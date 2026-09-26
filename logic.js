// 1. تحديد الرابط وتوجيه المتصفح إلى Bing Copilot Search
var targetUrl = "https://www.bing.com/copilotsearch?q=" + encodeURIComponent(promptText);

// التوجيه إذا لم نكن في الصفحة المطلوبة
if (window.location.href.indexOf(targetUrl) === -1) {
    window.location.href = targetUrl;
}

var previousLength = 0;
var stableCount = 0;
var lastSentText = "";

window.onload = function() {
    setInterval(function() {
        try {
            // 2. ويب سكرابينج حقيقي: استهداف رسالة Copilot
            // Copilot يضع إجابته داخل عناصر ويب مخصصة (Web Components)
            // غالباً يستخدم c-b-r-chat-message أو cib-chat-turn
            
            // نحاول إيجاد الإجابة باستخدام عدة محددات (Selectors) لضمان النجاح
            var aiMessages = document.querySelectorAll(
                'cib-message[type="text"] .ac-textBlock, ' + 
                'cib-shared .content, ' + 
                'div[data-testid="copilot-message"]'
            );
            
            // محاولة أخرى للبحث العميق داخل Shadow DOM (إذا كان Bing يستخدمه)
            if (aiMessages.length === 0) {
                 var host = document.querySelector('cib-serp');
                 if(host && host.shadowRoot){
                     var chatMain = host.shadowRoot.querySelector('cib-conversation').shadowRoot.querySelector('cib-chat-main');
                     if(chatMain && chatMain.shadowRoot){
                         aiMessages = chatMain.shadowRoot.querySelectorAll('cib-chat-turn:last-child cib-message-group[source="bot"] cib-message[type="text"]');
                     }
                 }
            }

            // إذا لم تنجح المحددات الدقيقة، نستخدم البحث الاستدلالي (Heuristic) كملاذ أخير
            if (aiMessages.length === 0) {
                 aiMessages = document.querySelectorAll('p, div.text-base'); 
            }

            if (aiMessages.length > 0) {
                var lastMessage = aiMessages[aiMessages.length - 1];
                var currentText = lastMessage.innerText.trim();
                
                // تنظيف النص من أرقام المصادر (مثل [1], [2] التي يضيفها Bing)
                currentText = currentText.replace(/\[\d+\]/g, ''); 
                
                var currentLength = currentText.length;

                // 3. التحقق من أن الإجابة طويلة بما يكفي (أكثر من 20 حرف)
                if (currentLength > 20) {
                    // خوارزمية اكتشاف انتهاء الكتابة
                    if (currentLength === previousLength) {
                        stableCount++;
                        
                        // ننتظر حتى يستقر النص لمرتين (للتأكد من أن Copilot أنهى الكتابة)
                        if (stableCount >= 2 && currentText !== lastSentText) {
                            
                            // إرسال الإجابة النهائية لتطبيق الأندرويد
                            AppBridge.onArticleReady(currentText);
                            lastSentText = currentText; 
                            stableCount = -100; // تصفير العداد
                        }
                    } else {
                        previousLength = currentLength;
                        stableCount = 0;
                    }
                }
            }

            // 4. التعامل مع النوافذ المنبثقة (Pop-ups)
            // إغلاق نافذة "سجل الدخول" أو "الموافقة على ملفات تعريف الارتباط"
            var buttons = document.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                var btnText = buttons[i].innerText.toLowerCase();
                if (btnText.includes('accept') || btnText.includes('close') || btnText.includes('decline') || btnText.includes('accepter')) {
                    buttons[i].click();
                }
            }

        } catch(e) {
            console.log("Bing Copilot Scraping Error: " + e.message);
        }
    }, 1500); // الفحص كل ثانية ونصف
};
