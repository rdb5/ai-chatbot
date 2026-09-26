// 1. تحديد الرابط الخاص بـ Google AI Mode (بدون الحاجة لمحاكاة الكتابة)
var targetUrl = "https://www.google.com/search?udm=50&q=" + encodeURIComponent(promptText);

if (window.location.href.indexOf("udm=50") === -1) {
    window.location.href = targetUrl;
}

var previousLength = 0;
var stableCount = 0;
var lastSentText = "";

window.onload = function() {
    setInterval(function() {
        try {
            // 2. البحث الذكي عن الإجابة في صفحة جوجل 
            // نتجاهل الأزرار مثل (Micro, Envoyer, Réessayer)
            // نركز على الفقرات أو العناصر التي تحتوي على كمية كبيرة من النص المتصل
            
            var allElements = document.querySelectorAll('span, div, p');
            var bestText = "";
            var maxLength = 0;

            for (var i = 0; i < allElements.length; i++) {
                var el = allElements[i];
                // يجب أن يكون العنصر ظاهراً ولا يحتوي على عناصر فرعية كثيرة لتجنب نسخ الصفحة كاملة
                if (el.offsetParent !== null && el.children.length < 10) {
                    var text = el.innerText.trim();
                    
                    // استبعاد نصوص واجهة جوجل المعروفة
                    var isUIElement = text.includes("Micro") || 
                                      text.includes("Envoyer") || 
                                      text.includes("Réessayer") || 
                                      text.includes("Transcription") ||
                                      text.includes("Mes préférences");
                    
                    if (text.length > maxLength && !isUIElement) {
                        maxLength = text.length;
                        bestText = text;
                    }
                }
            }

            var currentLength = bestText.length;

            // 3. التأكد من أننا وجدنا إجابة طويلة (أكثر من 50 حرف)
            if (currentLength > 50) {
                // خوارزمية اكتشاف انتهاء الكتابة (Streaming Detection)
                if (currentLength === previousLength) {
                    stableCount++;
                    
                    if (stableCount >= 2 && bestText !== lastSentText) {
                        // إرسال الإجابة النهائية لتطبيق الأندرويد
                        AppBridge.onArticleReady(bestText);
                        lastSentText = bestText; 
                        stableCount = -100; 
                    }
                } else {
                    previousLength = currentLength;
                    stableCount = 0;
                }
            }

        } catch(e) {
            console.log("Google AI Mode Error: " + e.message);
        }
    }, 1500); // الفحص كل ثانية ونصف
};
