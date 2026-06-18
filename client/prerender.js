import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_DATA } from './src/seoData.js';
import { BLOG_POSTS } from './src/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://alltoolmaster.me';

// Helper to extract TOOLS_DATA dynamically from ToolGrid.jsx
function getToolsData() {
  const toolGridPath = path.join(__dirname, 'src', 'components', 'ToolGrid.jsx');
  if (!fs.existsSync(toolGridPath)) {
    console.error('ToolGrid.jsx not found');
    return [];
  }
  let content = fs.readFileSync(toolGridPath, 'utf8');
  const startIdx = content.indexOf('export const TOOLS_DATA = [');
  if (startIdx === -1) {
    console.error('export const TOOLS_DATA not found in ToolGrid.jsx');
    return [];
  }
  const nextExportIdx = content.indexOf('export default function ToolGrid', startIdx);
  let arrayContent = content.substring(startIdx, nextExportIdx).trim();
  arrayContent = arrayContent.replace('export const TOOLS_DATA =', '').trim();
  // Remove react-icons components reference
  arrayContent = arrayContent.replace(/icon:\s*Fi[A-Za-z0-9]+/g, 'icon: null');
  if (arrayContent.endsWith(';')) arrayContent = arrayContent.slice(0, -1);
  
  try {
    const tools = new Function(`return ${arrayContent}`)();
    return tools;
  } catch (e) {
    console.error('Error evaluating TOOLS_DATA:', e);
    return [];
  }
}

// Convert blog date (e.g. "May 26, 2026") to ISO format
function parseDateToISO(dateStr) {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {}
  return '2026-06-15';
}

function prerender() {
  const distDir = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('index.html not found in dist. Make sure you run vite build first.');
    return;
  }
  
  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const tools = getToolsData();
  
  const staticRoutes = [
    { path: '/about', view: 'about' },
    { path: '/contact', view: 'contact' },
    { path: '/faqs', view: 'faqs' },
    { path: '/editorial-policy', view: 'editorial-policy' },
    { path: '/cookie-policy', view: 'cookie-policy' },
    { path: '/accessibility', view: 'accessibility' },
    { path: '/affiliate-disclosure', view: 'affiliate-disclosure' },
    { path: '/author/vansh-shah', view: 'author' },
    { path: '/author', view: 'author' }
  ];
  
  const hubRoutes = [
    { path: '/converter', title: 'Free File Converters Online — PDF, Word, Image, Video | All Tool Master', desc: 'Convert PDF to Word, Word to PDF, JPG to PNG, MP4 to MP3 and more. All converters are free, browser-based and require no account.' },
    { path: '/downloader', title: 'Free Video Downloader — YouTube, Instagram, TikTok & More | All Tool Master', desc: 'Download videos from YouTube, Instagram, TikTok, Facebook, Twitter and Vimeo for free. No watermark, no signup required.' },
    { path: '/ai-notes', title: 'Free AI Notes Tools — Lecture Notes, Transcripts & Summaries | All Tool Master', desc: 'AI-powered tools to generate lecture notes, meeting minutes, transcripts, study guides and video summaries. Free, no account needed.' },
    { path: '/utility', title: 'Free Digital Utilities & Productivity Tools Online | All Tool Master', desc: 'Free online utilities including ZIP Extractor, File Compressor, and Resume Builder. Browser-based, fast, secure, and no signup required.' },
    { path: '/blog', title: 'Blog — File Conversion Tips & Video Download Guides | All Tool Master', desc: 'Guides and tutorials on file conversion, video downloading, AI note-taking and online productivity tools. Free tips, updated regularly.' }
  ];
  
  const excludedRoutes = [
    { path: '/deals', title: 'Hosting Deals & Domains | All Tool Master', desc: 'Domain registration discounts with our affiliate promo tools via Namecheap.' },
    { path: '/deals/namecheap', title: 'Namecheap Discount Deals | All Tool Master', desc: 'Claim student and domain discounts on Namecheap.' },
    { path: '/deals/elevenlabs', title: 'ElevenLabs AI Voice Deals | All Tool Master', desc: 'Get starting offers on ElevenLabs AI voices.' },
    { path: '/deals/canva', title: 'Canva Pro Trial Deals | All Tool Master', desc: 'Claim Canva Pro free trial and graphic templates.' },
    { path: '/deals/grammarly', title: 'Grammarly AI writing assistant | All Tool Master', desc: 'Elevate your writing tone with Grammarly AI.' },
    { path: '/deals/nordvpn', title: 'NordVPN security discount | All Tool Master', desc: 'Secure your digital footprint with NordVPN.' },
    { path: '/deals/elementor', title: 'Elementor Pro builder deals | All Tool Master', desc: 'Build responsive WordPress sites with Elementor.' },
    { path: '/privacy', title: 'Privacy Policy | All Tool Master', desc: 'Read our privacy policy. We respect your security; no files are logged or stored on our servers.' },
    { path: '/terms', title: 'Terms & Conditions | All Tool Master', desc: 'Review the terms and conditions for using All Tool Master utilities.' },
    { path: '/dmca', title: 'DMCA Policy | All Tool Master', desc: 'DMCA copyright policy and takedown instructions for All Tool Master.' },
    { path: '/disclaimer', title: 'Disclaimer | All Tool Master', desc: 'Legal disclaimers for the All Tool Master toolset and conversions.' }
  ];

  const infoPageTitles = {
    about: "About All Tool Master — Free Online Tools for Everyone",
    contact: "Contact All Tool Master — Get in Touch",
    faqs: "FAQs — Frequently Asked Questions | All Tool Master",
    'editorial-policy': "Editorial Policy & Editorial Standards | All Tool Master",
    'cookie-policy': "Cookie Policy & Cookie Consent | All Tool Master",
    accessibility: "Accessibility Statement & Web Standards | All Tool Master",
    'affiliate-disclosure': "FTC Affiliate Disclosure & Partnerships | All Tool Master",
    author: "About the Author: Vansh Shah | All Tool Master"
  };

  const infoPageDescs = {
    about: "All Tool Master is a free platform built for students, professionals and content creators who need fast, reliable online tools with no signup.",
    contact: "Have a question or suggestion? Contact the All Tool Master team. We respond to all inquiries.",
    faqs: "Answers to common questions about All Tool Master's free file converters, video downloaders and AI note-taking tools.",
    'editorial-policy': "Review our editorial guidelines, fact-checking process, and quality standards for all content on All Tool Master.",
    'cookie-policy': "Understand how All Tool Master uses cookies to manage user settings and web preferences safely.",
    accessibility: "Read our commitment to WCAG 2.1 AA web accessibility standards and user features.",
    'affiliate-disclosure': "Read our transparent affiliate link disclosure complying with FTC requirements.",
    author: "Learn more about Vansh Shah, founder and lead developer of All Tool Master. Software engineer from Mumbai, India."
  };
  
  const pagesToPrerender = [];

  // 1. Homepage (special rewrite directly to dist/index.html)
  pagesToPrerender.push({
    path: '/',
    title: 'All Tool Master — Free Online File Converter, Downloader & AI Notes',
    desc: 'Free online tools to convert PDF, Word, images and videos. Download videos from YouTube, Instagram & TikTok. AI-powered notes and transcription. No signup needed.',
    h1: 'Convert Files, Download Videos, & Create AI Notes Instantly',
    noindex: false,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'All Tool Master',
        url: DOMAIN,
        logo: `${DOMAIN}/logo.png`,
        sameAs: [
          'https://www.linkedin.com/in/vansh-shah-824926291/',
          'https://www.youtube.com/@VANSHSHAH-india'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'All Tool Master',
        url: DOMAIN,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${DOMAIN}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  });

  // 2. Hub pages
  hubRoutes.forEach(route => {
    pagesToPrerender.push({
      path: route.path,
      title: route.title,
      desc: route.desc,
      h1: route.title.split(' — ')[0].split(' | ')[0],
      noindex: false,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: DOMAIN
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: route.path.substring(1).charAt(0).toUpperCase() + route.path.substring(2),
              item: `${DOMAIN}${route.path}`
            }
          ]
        }
      ]
    });
  });

  // 3. Info static pages
  staticRoutes.forEach(route => {
    const title = infoPageTitles[route.view];
    const desc = infoPageDescs[route.view];
    pagesToPrerender.push({
      path: route.path,
      title,
      desc,
      h1: title.split(' — ')[0].split(' | ')[0],
      noindex: false,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: DOMAIN
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: route.view.replace('-', ' '),
              item: `${DOMAIN}${route.path}`
            }
          ]
        }
      ]
    });
  });

  // 4. Excluded pages (noindex)
  excludedRoutes.forEach(route => {
    pagesToPrerender.push({
      path: route.path,
      title: route.title,
      desc: route.desc,
      h1: route.title.split(' | ')[0],
      noindex: true,
      schemas: []
    });
  });

  // 5. Tool pages
  tools.forEach(tool => {
    if (!tool.routes) return;
    tool.routes.forEach(route => {
      const seoInfo = { ...SEO_DATA[tool.id], ...SEO_DATA[route] };
      const title = seoInfo?.title || `${tool.title} | Free Online Converter & AI Notes | All Tool Master`;
      const desc = seoInfo?.description || `${tool.desc} Safe, fast, and browser-based format utilities by All Tool Master.`;
      const h1 = seoInfo?.h1 || tool.title;
      
      const appCategoryMap = {
        'Converter': 'Converters',
        'Downloader': 'Downloaders',
        'AI Tool': 'AI Notes',
        'Utility': 'Utilities'
      };
      
      const parentName = appCategoryMap[tool.category] || 'Converters';
      const parentPath = '/' + tool.category.toLowerCase().replace(' ', '-');
      
      const webAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: seoInfo?.h1 || tool.title,
        url: `${DOMAIN}${route}`,
        description: desc,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        provider: {
          '@type': 'Organization',
          name: 'All Tool Master',
          url: DOMAIN
        }
      };

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${DOMAIN}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: parentName,
            item: `${DOMAIN}${parentPath}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: seoInfo?.h1 || tool.title,
            item: `${DOMAIN}${route}`
          }
        ]
      };

      const schemas = [webAppSchema, breadcrumbSchema];
      
      if (seoInfo?.faqs && seoInfo.faqs.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: seoInfo.faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer
            }
          }))
        });
      }

      pagesToPrerender.push({
        path: route,
        title,
        desc,
        h1,
        noindex: false,
        schemas
      });
    });
  });

  // 6. Blog Posts
  BLOG_POSTS.forEach(post => {
    const title = post.seoTitle || `${post.title} | All Tool Master Blog`;
    const desc = post.metaDescription || post.excerpt;
    const h1 = post.title;
    const url = `${DOMAIN}/blog/${post.slug}`;
    const isoDate = parseDateToISO(post.date);

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      url,
      author: {
        '@type': 'Person',
        name: 'Vansh Shah',
        jobTitle: 'Founder',
        url: 'https://www.linkedin.com/in/vansh-shah-824926291/'
      },
      publisher: {
        '@type': 'Organization',
        name: 'All Tool Master',
        logo: {
          '@type': 'ImageObject',
          url: `${DOMAIN}/logo.png`
        }
      },
      datePublished: isoDate,
      dateModified: '2026-06-15',
      image: `${DOMAIN}/logo.png`
    };

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: DOMAIN
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${DOMAIN}/blog`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: url
        }
      ]
    };

    const schemas = [articleSchema, breadcrumbs];

    pagesToPrerender.push({
      path: `/blog/${post.slug}`,
      title,
      desc,
      h1,
      noindex: false,
      schemas
    });
  });

  console.log(`Prerendering ${pagesToPrerender.length} routes...`);

  // Write pre-rendered pages
  pagesToPrerender.forEach(page => {
    let html = templateHtml;
    
    // Replace title
    html = html.replace(/<title>[^<]*<\/title>/g, `<title>${page.title}</title>`);
    
    // Replace description
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/g,
      `<meta name="description" content="${page.desc}" />`
    );

    // Inject fallback H1 and description in body for crawlers
    html = html.replace(
      /<div id="root"><\/div>/g,
      `<div id="root"><h1>${page.h1}</h1><p>${page.desc}</p></div>`
    );
    
    // Replace canonical URL
    const canonicalUrl = `${DOMAIN}${page.path === '/' ? '' : page.path}`;
    html = html.replace(
      /<link rel="canonical" href="[^"]*" id="canonical-url" \/>/g,
      `<link rel="canonical" href="${canonicalUrl}" id="canonical-url" />`
    );

    // Replace Open Graph title, description, url
    html = html.replace(
      /<meta property="og:title" id="og-title" content="[^"]*" \/>/g,
      `<meta property="og:title" id="og-title" content="${page.title}" />`
    );
    html = html.replace(
      /<meta property="og:description" id="og-desc" content="[^"]*" \/>/g,
      `<meta property="og:description" id="og-desc" content="${page.desc}" />`
    );
    html = html.replace(
      /<meta property="og:url" id="og-url" content="[^"]*" \/>/g,
      `<meta property="og:url" id="og-url" content="${canonicalUrl}" />`
    );

    // Replace Twitter Card title, description
    html = html.replace(
      /<meta name="twitter:title" id="twitter-title" content="[^"]*" \/>/g,
      `<meta name="twitter:title" id="twitter-title" content="${page.title}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" id="twitter-desc" content="[^"]*" \/>/g,
      `<meta name="twitter:description" id="twitter-desc" content="${page.desc}" />`
    );

    // Update robots meta tag for noindex pages
    if (page.noindex) {
      html = html.replace(
        /<meta id="robots-meta" name="robots" content="index, follow" \/>/g,
        `<meta id="robots-meta" name="robots" content="noindex, nofollow" />`
      );
    } else {
      html = html.replace(
        /<meta id="robots-meta" name="robots" content="index, follow" \/>/g,
        `<meta id="robots-meta" name="robots" content="index, follow" />`
      );
    }

    // Inject dynamic schemas
    const schemaStr = JSON.stringify(page.schemas);
    html = html.replace(
      /<script type="application\/ld\+json" id="dynamic-schema">{}<\/script>/g,
      `<script type="application/ld+json" id="dynamic-schema">${schemaStr}</script>`
    );

    // Save output file
    if (page.path === '/') {
      // Homepage directly overwrites dist/index.html
      fs.writeFileSync(indexHtmlPath, html, 'utf8');
    } else {
      // E.g., /about -> dist/about.html (using cleanUrls: true)
      // or /convert/pdf-to-word -> dist/convert/pdf-to-word.html
      const relativeDestPath = `${page.path.replace(/^\//, '')}.html`;
      const destFilePath = path.join(distDir, relativeDestPath);
      
      fs.mkdirSync(path.dirname(destFilePath), { recursive: true });
      fs.writeFileSync(destFilePath, html, 'utf8');
    }
  });

  console.log('Static prerendering complete!');
}

prerender();
