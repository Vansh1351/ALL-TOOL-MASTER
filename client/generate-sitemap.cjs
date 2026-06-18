const fs = require('fs');
const path = require('path');

const domain = 'https://alltoolmaster.me';
const dateStr = '2026-06-15';

function getBlogSlugs() {
  const blogDataPath = path.join(__dirname, 'src', 'blogData.js');
  const blogDataNewPath = path.join(__dirname, 'src', 'blogDataNew.js');
  
  let content = '';
  if (fs.existsSync(blogDataPath)) content += fs.readFileSync(blogDataPath, 'utf8');
  if (fs.existsSync(blogDataNewPath)) content += fs.readFileSync(blogDataNewPath, 'utf8');
  
  const slugs = [];
  const regex = /slug:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (!slugs.includes(match[1])) {
      slugs.push(match[1]);
    }
  }
  return slugs;
}

function getToolRoutes() {
  const toolGridPath = path.join(__dirname, 'src', 'components', 'ToolGrid.jsx');
  if (!fs.existsSync(toolGridPath)) return [];
  
  const content = fs.readFileSync(toolGridPath, 'utf8');
  const routes = [];
  const regex = /routes:\s*\[([^\]]+)\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const routeStrings = match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
    routeStrings.forEach(r => {
      if (r && !routes.includes(r)) {
        routes.push(r);
      }
    });
  }
  return routes;
}

const generateSitemap = () => {
  const slugs = getBlogSlugs();
  const toolRoutes = getToolRoutes();
  
  const staticRoutes = [
    '/',
    '/about',
    '/contact',
    '/faqs',
    '/editorial-policy',
    '/cookie-policy',
    '/accessibility',
    '/affiliate-disclosure',
    '/author/vansh-shah'
  ];
  
  const hubRoutes = [
    '/converter',
    '/downloader',
    '/ai-notes',
    '/blog',
    '/utility'
  ];
  
  const excludeRoutes = [
    '/deals',
    '/privacy',
    '/terms',
    '/dmca',
    '/disclaimer'
  ];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  const processedRoutes = new Set();
  
  function addRoute(route, priority, freq) {
    // Check if route is excluded or already processed
    if (processedRoutes.has(route)) return;
    
    // Explicitly exclude requested pages and any deals/hosting routes
    if (excludeRoutes.includes(route) || route.startsWith('/deals') || route.startsWith('/hosting')) {
      return;
    }
    
    processedRoutes.add(route);
    
    xml += '  <url>\n';
    xml += `    <loc>${domain}${route}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += `    <changefreq>${freq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += '  </url>\n';
  }
  
  // 1. Homepage
  addRoute('/', '1.0', 'daily');
  
  // 2. Hub pages
  hubRoutes.forEach(r => addRoute(r, '0.9', 'weekly'));
  
  // 3. Tool pages
  toolRoutes.forEach(r => addRoute(r, '0.8', 'monthly'));
  
  // 4. Blog posts
  slugs.forEach(slug => addRoute(`/blog/${slug}`, '0.7', 'monthly'));
  
  // 5. Info pages
  staticRoutes.forEach(r => addRoute(r, '0.5', 'monthly'));
  
  xml += '</urlset>\n';
  
  const destDir = path.join(__dirname, 'public');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const destPath = path.join(destDir, 'sitemap.xml');
  fs.writeFileSync(destPath, xml, 'utf8');
  console.log(`Successfully generated sitemap.xml with ${processedRoutes.size} pages at ${destPath}`);
};

generateSitemap();
