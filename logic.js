// 1. تحديد الرابط وتوجيه المتصفح إلى ChatGPT مع تمرير السؤال
var targetUrl = "https://chatgpt.com/?q=" + encodeURIComponent(promptText);
window.location.href = targetUrl;

// متغيرات لتتبع حالة الإجابة
var previousLength = 0;
var stableCount = 0;
var lastSentText = ""; // لمنع إرسال نفس الإجابة مرتين

window.onload = function() {
    setInterval(function() {
        try {
            // 2. استهداف رسائل الذكاء الاصطناعي "فقط" باستخدام المعرف الخاص بـ ChatGPT
            var aiMessages = document.querySelectorAll('[data-message-author-role="assistant"]');
            
            if (aiMessages.length > 0) {
                // نأخذ آخر رسالة في المحادثة (وهي الإجابة على سؤالنا الحالي)
                var lastMessage = aiMessages[aiMessages.length - 1];
                
                // ChatGPT قد يستخدم عدة فقرات، نأخذ النص بالكامل
                var currentText = lastMessage.innerText.trim();
                var currentLength = currentText.length;

                if (currentLength > 0) {
                    // 3. خوارزمية اكتشاف انتهاء الكتابة
                    if (currentLength === previousLength) {
                        stableCount++;
                        
                        // إذا استقر النص لمرتين (حوالي 3 ثوانٍ) ولم نقم بإرساله سابقاً
                        if (stableCount >= 2 && currentText !== lastSentText) {
                            // إرسال الإجابة النظيفة لتطبيق الأندرويد
                            AppBridge.onArticleReady(currentText);
                            lastSentText = currentText; 
                            stableCount = -100; // إعادة تعيين العداد
                        }
                    } else {
                        // الذكاء الاصطناعي لا يزال يكتب الإجابة
                        previousLength = currentLength;
                        stableCount = 0;
                    }
                }
            }

            // 4. خطوة إضافية: إغلاق النوافذ المنبثقة المزعجة 
            // (مثل نافذة "سجل الدخول لحفظ المحادثة" التي تظهر لغير المسجلين)
            var closeButtons = document.querySelectorAll('button[aria-label="Close"], button[aria-label="Fermer"]');
            for (var i = 0; i < closeButtons.length; i++) {
                closeButtons[i].click();
            }

        } catch(e) {
            console.log("Extraction Error: " + e.message);
        }
    }, 1500); // فحص الصفحة كل ثانية ونصف
};
