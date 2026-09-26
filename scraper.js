// هذا كود Node.js / Serverless بسيط يعمل كمستخرج بيانات فوري
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        // ضع هنا رابط الموقع الحقيقي الذي تريد استخراج الفيديوهات منه
        const targetUrl = 'https://www.rexporn.sex/'; 
        
        const { data } = await axios.get(targetUrl);
        const $ = cheerio.load(data);
        
        const videos = [];

        // قم بتعديل الكلمات المفتاحية أدناه لتعطى الفئات الصحيحة من موقعك المستهدف
        $('.video-item').each((index, element) => {
            videos.push({
                id: `vid_${index}`,
                title: $(element).find('.title').text().trim(),
                thumbnail: $(element).find('img').attr('src'),
                channelTitle: $(element).find('.author').text().trim(),
                channelAvatar: $(element).find('img').attr('src5'), // صورة القناة إن وجدت
                views: $(element).find('.views').text().trim(),
                publishedAt: $(element).find('.date').text().trim(),
                duration: $(element).find('.duration').text().trim(),
                description: "وصف الفيديو مستخرج مباشرة",
                commentsCount: "0",
                videoUrl: $(element).find('a').attr('href') // رابط الفيديو الأساسي للاستخراج
            });
        });

        // إرجاع البيانات فوراً للتطبيق بصيغة JSON
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
