const fs = require('fs');
const path = require('path');

const domain = 'https://alltoolmaster.me';

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/dmca',
  '/faqs',
  '/deals',
  '/hosting/namecheap-review',
  '/deals/namecheap'
];

const blogCategories = [
  '/blog',
  '/blog/category/converter',
  '/blog/category/downloader',
  '/blog/category/ai-tools',
  '/blog/category/productivity',
  '/blog/category/web-hosting'
];

const blogPosts = [
  '/blog/free-url-to-mp4-converter-saved-hours',
  '/blog/compress-files-online-free-no-signup',
  '/blog/free-resume-builder-no-signup-2026',
  '/blog/best-ai-script-writer-free-online',
  '/blog/youtube-to-mp3-converter-safe-free',
  '/blog/namecheap-review-domain-hosting-deals',
  '/blog/canva-vs-photoshop',
  '/blog/how-to-create-social-media-posts-with-canva',
  '/blog/best-free-canva-templates-for-students'
];

const seoToolPages = [
  '/convert/mp4-to-mp3',
  '/convert/mp4-to-wav',
  '/convert/mov-to-mp4',
  '/convert/mp3-to-wav',
  '/convert/jpg-to-png',
  '/convert/png-to-jpg',
  '/convert/jpg-to-pdf',
  '/convert/png-to-pdf',
  '/convert/pdf-to-docx',
  '/convert/docx-to-pdf',
  '/convert/pdf-to-jpg',
  '/convert/zip-extractor'
];

const otherToolPages = [
  '/downloader/youtube',
  '/downloader/vimeo',
  '/downloader/shorts',
  '/downloader/facebook',
  '/downloader/instagram',
  '/downloader/tiktok',
  '/downloader/twitter',
  '/convert/heic-to-jpg',
  '/convert/webp-to-png',
  '/convert/pdf-to-word',
  '/convert/word-to-pdf',
  '/convert/excel-to-pdf',
  '/utility/zip-extractor',
  '/utility/unzip',
  '/ai-notes/video-summarizer',
  '/ai-notes/video-watcher',
  '/ai-notes/transcript',
  '/ai-notes/speech-to-text',
  '/ai-notes/audio-analyzer',
  '/ai-notes/voice-notes',
  '/ai-notes/lecture-notes',
  '/ai-notes/study-guide',
  '/ai-notes/meeting-minutes',
  '/ai-notes/meeting-assistant',
  '/ai-notes/brainrot-translator',
  '/ai-notes/brainrot',
  '/utility/file-compressor',
  '/utility/compress',
  '/utility/resume-builder',
  '/utility/cv-builder',
  '/ai-notes/script-writer',
  '/ai-notes/screenplay-writer'
];

const allRoutes = [
  ...staticRoutes,
  ...blogCategories,
  ...blogPosts,
  ...seoToolPages,
  ...otherToolPages
];

const generateSitemap = () => {
  const dateStr = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allRoutes.forEach((route) => {
    const priority = route === '/' ? '1.0' : (route.startsWith('/convert/') ? '0.9' : '0.7');
    const freq = route === '/' ? 'daily' : 'weekly';
    
    xml += '  <url>\n';
    xml += `    <loc>${domain}${route}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += `    <changefreq>${freq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>\n';
  
  const destDir = path.join(__dirname, 'public');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const destPath = path.join(destDir, 'sitemap.xml');
  fs.writeFileSync(destPath, xml, 'utf8');
  console.log(`Successfully generated sitemap.xml with ${allRoutes.length} pages at ${destPath}`);
};

generateSitemap();
