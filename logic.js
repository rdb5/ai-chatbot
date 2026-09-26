// 1. تحديد الرابط
var targetUrl = "https://www.google.com/search?udm=50&q=" + encodeURIComponent(promptText);
window.location.href = targetUrl;

// متغيرات لتتبع حالة الإجابة (هل ما زالت تُكتب أم انتهت؟)
var previousLength = 0;
var stableCount = 0;

window.onload = function() {
    setInterval(function() {
        try {
            // 2. استهداف النصوص الحقيقية فقط (الفقرات والقوائم)
            // الذكاء الاصطناعي ينسق إجابته دائماً باستخدام هذه الوسوم HTML
            var contentTags = document.querySelectorAll('p, li, h2, h3');
            var currentText = "";

            for (var i = 0; i < contentTags.length; i++) {
                var text = contentTags[i].innerText.trim();
                // تجاهل أي نصوص قصيرة جداً قد تكون بالخطأ من واجهة المستخدم
                if (text.length > 20) {
                    currentText += text + "\n\n";
                }
            }

            var currentLength = currentText.length;

            // 3. التحقق مما إذا كان النص طويلاً بما يكفي ليكون إجابة (أكثر من 100 حرف)
            if (currentLength > 100) {
                
                // 4. خوارزمية اكتشاف انتهاء الكتابة
                if (currentLength === previousLength) {
                    // النص لم يزداد حجمه، نزيد العداد
                    stableCount++;
                    
                    // إذا لم يتغير النص لمرتين متتاليتين (حوالي 3 ثوانٍ)، فهذا يعني أن الإجابة اكتملت!
                    if (stableCount >= 2) {
                        // إرسال النص النظيف والمنسق إلى تطبيق الأندرويد
                        AppBridge.onArticleReady(currentText.trim());
                        
                        // إعادة تعيين العداد لتجنب إرسال الإجابة مرتين
                        stableCount = -100; 
                    }
                } else {
                    // الذكاء الاصطناعي لا يزال يكتب الإجابة
                    previousLength = currentLength;
                    stableCount = 0; // تصفير العداد
                }
            }
        } catch(e) {
            console.log(e);
        }
    }, 1500); // فحص الصفحة كل ثانية ونصف
};
