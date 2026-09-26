// 1. فتح الصفحة الرئيسية لـ Gemini (بدون تمرير السؤال في الرابط)
var targetUrl = "https://gemini.google.com/app"; 
// إذا كان المتصفح لا يزال في الصفحة الرئيسية، نقوم بالتوجيه
if (window.location.href.indexOf(targetUrl) === -1) {
    window.location.href = targetUrl;
}

// متغيرات لتتبع الحالة
var previousLength = 0;
var stableCount = 0;
var lastSentText = "";
var questionAsked = false; // هل قمنا بطرح السؤال أم لا؟

window.onload = function() {
    setInterval(function() {
        try {
            // ==========================================
            // المرحلة الأولى: كتابة السؤال وإرساله (مرة واحدة فقط)
            // ==========================================
            if (!questionAsked) {
                // البحث عن حقل الإدخال في Gemini (عادة يكون textarea أو rich-textarea)
                var inputField = document.querySelector('rich-textarea, textarea, [contenteditable="true"]');
                // البحث عن زر الإرسال (غالباً أيقونة السهم أو زر يحتوي على إرسال/Send)
                var sendButton = document.querySelector('button[aria-label*="Send message"], button[aria-label*="Envoyer"], .send-button');

                if (inputField && sendButton) {
                    // كتابة النص في حقل الإدخال
                    // بعض الحقول تحتاج إلى محاكاة الكتابة بهذه الطريقة لكي يقبلها النظام
                    if (inputField.tagName.toLowerCase() === 'textarea') {
                         inputField.value = promptText;
                    } else if (inputField.hasAttribute('contenteditable')) {
                         inputField.innerText = promptText;
                    } else {
                         // لـ rich-textarea الخاصة بـ Gemini
                         inputField.innerHTML = "<p>" + promptText + "</p>";
                    }

                    // إطلاق أحداث الكتابة لكي يفهم الموقع أننا نكتب (لجعل زر الإرسال متاحاً)
                    var event = new Event('input', { bubbles: true });
                    inputField.dispatchEvent(event);

                    // الضغط على زر الإرسال بعد نصف ثانية لضمان تفعيل الزر
                    setTimeout(function() {
                        sendButton.click();
                        questionAsked = true; // تم طرح السؤال
                    }, 500);
                }
                
                // التوقف هنا وعدم الانتقال للمرحلة الثانية حتى نرسل السؤال
                return; 
            }

            // ==========================================
            // المرحلة الثانية: انتظار واستخراج الإجابة الحقيقية
            // ==========================================
            // نبحث عن رسائل الإجابة الحقيقية (بناءً على عناصر Gemini المخصصة للردود)
            var allMessages = document.querySelectorAll('.message-content, [data-test-id="model-response"]');

            if (allMessages.length > 0) {
                var lastMessage = allMessages[allMessages.length - 1];
                var currentText = lastMessage.innerText.trim();
                var currentLength = currentText.length;

                // التأكد من أن النص ليس رسالة ترحيبية بل إجابة حقيقية طويلة نسبياً
                if (currentLength > 20 && !currentText.includes("Meet Gemini") && !currentText.includes("Conversation with Gemini")) {
                    
                    if (currentLength === previousLength) {
                        stableCount++;
                        
                        if (stableCount >= 2 && currentText !== lastSentText) {
                            // إرسال الإجابة النهائية
                            AppBridge.onArticleReady(currentText);
                            lastSentText = currentText; 
                            stableCount = -100; 
                        }
                    } else {
                        previousLength = currentLength;
                        stableCount = 0;
                    }
                }
            }

        } catch(e) {
            console.log("Automation Error: " + e.message);
        }
    }, 1500);
};
