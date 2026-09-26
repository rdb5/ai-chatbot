// الانتظار حتى يكتمل تحميل الصفحة
setTimeout(function() {
    setInterval(function() {
        try {
            // 1. خوارزمية الغواص: للبحث عن الصندوق الذي يحتوي على الإجابة فقط
            function getCoreContentNode(node) {
                if (!node || !node.children || node.children.length === 0) return node;
                
                var maxTextLen = 0;
                var biggestChild = null;
                
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    // تجاهل الأكواد البرمجية
                    if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') continue;
                    
                    var text = child.innerText || "";
                    if (text.length > maxTextLen) {
                        maxTextLen = text.length;
                        biggestChild = child;
                    }
                }
                
                var parentLen = (node.innerText || "").length;
                // إذا كان هناك عنصر داخلي يستحوذ على أكثر من 65% من النص، نغوص داخله
                if (biggestChild && maxTextLen > (parentLen * 0.65)) {
                    return getCoreContentNode(biggestChild);
                }
                return node; // وجدنا الصندوق العميق!
            }

            var coreNode = getCoreContentNode(document.body);
            var rawText = coreNode.innerText.trim();

            // 2. فلتر الضجيج: تنظيف الكلمات الخاصة بواجهة جوجل الفرنسية والإنجليزية والعربية
            var lines = rawText.split('\n');
            var cleanedLines = [];
            
            for (var j = 0; j < lines.length; j++) {
                var line = lines[j].trim();
                if (line.length === 0) continue;
                
                // حذف الجمل الخاصة بنظام SGE التي ظهرت لك
                if (line.includes("Looking for results in English")) continue;
                if (line.includes("Conversation en Mode IA")) continue;
                if (line.includes("Réponse du Mode IA")) continue;
                if (line.includes("Transcription")) continue;
                if (line.includes("Mes préférences publicitaires")) continue;
                
                // إذا كان السطر قصيراً جداً ولا يحتوي على علامات ترقيم، فهو على الأرجح زر مثل "Micro" أو "Envoyer"
                if (line.length < 25 && !/[.،:؛?!]/.test(line)) {
                    continue; 
                }
                
                cleanedLines.push(line);
            }
            
            var finalContent = cleanedLines.join('\n\n').trim();

            // 3. إرسال النص إلى الأندرويد إذا كانت الإجابة طويلة ومكتملة
            if (finalContent.length > 50) {
                // تذكر أن تستخدم اسم الدالة الموجودة في واجهة التطبيق التي أعطاها لك الذكاء الاصطناعي
                // غالباً تكون AppBridge.onArticleReady أو AndroidInterface.onDataExtracted
                AppBridge.onArticleReady(finalContent); 
            }
        } catch(e) {
            console.log("Extraction Error: " + e);
        }
    }, 2500); // الفحص كل ثانيتين ونصف لإعطاء وقت لتوليد الإجابة
}, 3000); // انتظار 3 ثواني قبل بدء الفحص الأول
