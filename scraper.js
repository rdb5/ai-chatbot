// scraper.js - يوضع على مستودع GitHub
// يمكنك تشغيل هذا السكربت محلياً أو عبر GitHub Actions لتحديث ملف data.json تلقائياً

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeYouTubeCloneData() {
    try {
        // ضع هنا رابط الموقع المستهدف الذي تريد جلب المحتوى منه
        const targetUrl = 'https://example.com/videos-page'; 
        
        const { data } = await axios.get(targetUrl);
        const $ = cheerio.load(data);
        
        const videos = [];

        // قم بتعديل السيلكتورات (Selectors) بناءً على هيكل HTML للموقع المستهدف
        $('.video-item-class').each((index, element) => {
            const title = $(element).find('.title-class').text().trim();
            const thumbnail = $(element).find('img').attr('src');
            const channelTitle = $(element).find('.channel-name').text().trim();
            const channelAvatar = $(element).find('.channel-img').attr('src');
            const views = $(element).find('.views-count').text().trim();
            const publishedAt = $(element).find('.upload-date').text().trim();
            const duration = $(element).find('.duration').text().trim();
            const videoUrl = $(element).find('a').attr('href');
            
            videos.push({
                id: `video_${index + 1}`,
                title: title || "عنوان غير متوفر",
                thumbnail: thumbnail || "",
                channelTitle: channelTitle || "قناة غير معروفة",
                channelAvatar: channelAvatar || "",
                views: views || "0 مشاهدة",
                publishedAt: publishedAt || "حديثاً",
                duration: duration || "00:00",
                description: "هذا الوصف مستخرج تلقائياً من الموقع المستهدف عبر سكربت الـ Web Scraping.",
                commentsCount: "12",
                videoUrl: videoUrl || ""
            });
        });


        // حفظ البيانات في ملف json لرفعها على github وتوليد رابط raw
        fs.writeFileSync('data.json', JSON.stringify(videos, null, 2));
        console.log('تم استخراج البيانات بنجاح وإنشاء ملف data.json!');

    } catch (error) {
        console.error('حدث خطأ أثناء عملية السكاربينج:', error);
    }
}

scrapeYouTubeCloneData();
