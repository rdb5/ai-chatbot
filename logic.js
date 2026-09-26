// 1. تحديد الرابط وتوجيه المتصفح إلى Gemini
// نستخدم q= لتمرير السؤال مباشرة في الرابط
var targetUrl = "https://gemini.google.com/?q=" + encodeURIComponent(promptText);
window.location.href = targetUrl;

// متغيرات لتتبع حالة الإجابة (لضمان اكتمالها قبل الإرسال)
var previousLength = 0;
var stableCount = 0;
var lastSentText = "";

window.onload = function() {
    setInterval(function() {
        try {
            // 2. البحث عن رسائل Gemini 
            // Gemini يستخدم عادة كلاسات معينة لرسائل الذكاء الاصطناعي، أشهرها message-content أو user-content
            // وبما أننا نريد إجابة البوت (وليس سؤالنا)، سنبحث عن كل نصوص المحادثة
            var allMessages = document.querySelectorAll('.message-content, .model-response-text, message-content');
            
            // كخيار بديل قوي في حال تغير الكلاسات، نبحث عن العنصر الذي يحمل دور "الإجابة"
            if (allMessages.length === 0) {
                 allMessages = document.querySelectorAll('[data-test-id="model-response"]');
            }

            if (allMessages.length > 0) {
                // نأخذ آخر رسالة في القائمة (والتي من المفترض أن تكون إجابة البوت الحالية)
                var lastMessage = allMessages[allMessages.length - 1];
                var currentText = lastMessage.innerText.trim();
                var currentLength = currentText.length;

                if (currentLength > 0) {
                    // 3. خوارزمية اكتشاف انتهاء الكتابة (Streaming Detection)
                    // Gemini يكتب الإجابة تدريجياً، لذا يجب أن ننتظر حتى يتوقف النص عن الزيادة
                    if (currentLength === previousLength) {
                        stableCount++;
                        
                        // إذا استقر النص لمرتين متتاليتين (حوالي 3 ثوانٍ) ولم نرسله من قبل
                        if (stableCount >= 2 && currentText !== lastSentText) {
                            // إرسال الإجابة النظيفة لتطبيق الأندرويد
                            AppBridge.onArticleReady(currentText);
                            lastSentText = currentText; 
                            stableCount = -100; // إعادة تعيين العداد
                        }
                    } else {
                        // النص لا يزال قيد الكتابة
                        previousLength = currentLength;
                        stableCount = 0;
                    }
                }
            }
            
            // 4. خطوة احترازية: إغلاق النوافذ المنبثقة الترحيبية (مثل نافذة "Got it" أو الموافقة على الشروط)
            var popupButtons = document.querySelectorAll('button:contains("Got it"), button:contains("I agree"), button:contains("Accepter")');
             for (var i = 0; i < popupButtons.length; i++) {
                popupButtons[i].click();
            }

        } catch(e) {
            console.log("Gemini Extraction Error: " + e.message);
        }
    }, 1500); // الفحص كل ثانية ونصف
};

// دالة مساعدة للبحث عن النصوص داخل الأزرار (jQuery style in plain JS)
// لضمان إغلاق النوافذ المنبثقة مهما كانت لغتها
document.querySelectorAll.prototype.contains = function(text) {
    var elements = document.querySelectorAll(this);
    return Array.prototype.filter.call(elements, function(element){
        return RegExp(text, 'i').test(element.textContent);
    });
};
