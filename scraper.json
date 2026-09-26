const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeYouTubeCloneData() {
    try {
        const targetUrl = 'https://www.rexporn.io/'; 
        const { data } = await axios.get(targetUrl);
        const $ = cheerio.load(data);
        
        const videos = [];

        $('.video-item-class').each(async (index, element) => {
            const title = $(element).find('.title-class').text().trim();
            const thumbnail = $(element).find('img').attr('src');
            const channelTitle = $(element).find('.channel-name').text().trim();
            const channelAvatar = $(element).find('.channel-img').attr('src');
            const views = $(element).find('.views-count').text().trim();
            const publishedAt = $(element).find('.upload-date').text().trim();
            const duration = $(element).find('.duration').text().trim();
            
            // رابط صفحة الفيديو أو رابط الـ Embed الأساسي
            const pageUrl = $(element).find('a').attr('href');
            
            // (اختياري متقدم): إذا كنت تستطيع جلب رابط الفيديو المباشر (.mp4 أو .m3u8) 
            // أو سيقوم التطبيق بفتح رابط الـ Embed/الصفحة عبر WebView
            const directVideoUrl = pageUrl; // أو استخراج رابط الـ streaming الفعلي من صفحة الفيديو الداخلية

            videos.push({
                id: `video_${index + 1}`,
                title: title || "عنوان غير متوفر",
                thumbnail: thumbnail || "",
                channelTitle: channelTitle || "قناة غير معروفة",
                channelAvatar: channelAvatar || "",
                views: views || "0 مشاهدة",
                publishedAt: publishedAt || "حديثاً",
                duration: duration || "00:00",
                description: "وصف الفيديو المستخرج...",
                commentsCount: "12",
                videoUrl: directVideoUrl // هذا هو رابط الفيديو المستخرج لعرضه في المشغل
            });
        });

        fs.writeFileSync('data.json', JSON.stringify(videos, null, 2));
        console.log('تم استخراج البيانات مع روابط الفيديوهات بنجاح!');

    } catch (error) {
        console.error('حدث خطأ أثناء السكاربينج:', error);
    }
}

scrapeYouTubeCloneData();
