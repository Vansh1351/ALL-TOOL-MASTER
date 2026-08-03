import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolGrid, { TOOLS_DATA } from './components/ToolGrid';
import HistoryPanel from './components/HistoryPanel';
import FAQAccordion, { FAQ_ITEMS } from './components/FAQAccordion';
import Footer from './components/Footer';

// Pages (Lazy Loaded)
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const DisclaimerPage = React.lazy(() => import('./pages/DisclaimerPage'));
const DmcaPage = React.lazy(() => import('./pages/DmcaPage'));
const ToolPage = React.lazy(() => import('./pages/ToolPage'));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const FileCompressor = React.lazy(() => import('./pages/FileCompressor'));
const ResumeBuilder = React.lazy(() => import('./pages/ResumeBuilder'));
const ScriptWriter = React.lazy(() => import('./pages/ScriptWriter'));
const CardMaker = React.lazy(() => import('./pages/CardMaker'));
const WatermarkRemover = React.lazy(() => import('./pages/WatermarkRemover'));
const ObjectRemover = React.lazy(() => import('./pages/ObjectRemover'));
const BackgroundRemover = React.lazy(() => import('./pages/BackgroundRemover'));
const LogoGenerator = React.lazy(() => import('./pages/LogoGenerator'));
const QRCodeGenerator = React.lazy(() => import('./pages/QRCodeGenerator'));
const BusinessCardMaker = React.lazy(() => import('./pages/BusinessCardMaker'));
const ThumbnailMaker = React.lazy(() => import('./pages/ThumbnailMaker'));
const DealsPage = React.lazy(() => import('./pages/DealsPage'));

// New Page Modules
const NamecheapReview = React.lazy(() => import('./pages/NamecheapReview'));
const AnalyticsDashboard = React.lazy(() => import('./pages/AnalyticsDashboard'));
const ElevenLabsDeal = React.lazy(() => import('./pages/ElevenLabsDeal'));
const CanvaDeal = React.lazy(() => import('./pages/CanvaDeal'));
const GrammarlyDeal = React.lazy(() => import('./pages/GrammarlyDeal'));
const NordVPNDeal = React.lazy(() => import('./pages/NordVPNDeal'));
const ElementorDeal = React.lazy(() => import('./pages/ElementorDeal'));

// Trust & E-E-A-T Pages
const AuthorPage = React.lazy(() => import('./pages/AuthorPage'));
const EditorialPolicy = React.lazy(() => import('./pages/EditorialPolicy'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const AccessibilityStatement = React.lazy(() => import('./pages/AccessibilityStatement'));
const AffiliateDisclosure = React.lazy(() => import('./pages/AffiliateDisclosure'));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));

import { BLOG_POSTS } from './blogData';
import { SEO_DATA } from './seoData';
import { AFFILIATE_LINKS } from './affiliateLinks';


import { FiShield, FiZap, FiUserCheck, FiCpu, FiStar, FiExternalLink, FiClock, FiSend, FiAlertTriangle } from 'react-icons/fi';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';


function SkeletonLoader() {
  return (
    <div className="container animate-fade-in" style={{ padding: '40px 0', minHeight: '60vh' }}>
      <div className="skeleton" style={{ height: '40px', width: '50%', marginBottom: '20px', borderRadius: '8px' }}></div>
      <div className="skeleton" style={{ height: '20px', width: '90%', marginBottom: '12px', borderRadius: '6px' }}></div>
      <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '32px', borderRadius: '6px' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="skeleton" style={{ height: '220px', borderRadius: '16px' }}></div>
        <div className="skeleton" style={{ height: '220px', borderRadius: '16px' }}></div>
        <div className="skeleton" style={{ height: '220px', borderRadius: '16px' }}></div>
      </div>
    </div>
  );
}
function getInitialRouteState() {
  if (typeof window === 'undefined') {
    return { view: 'dashboard', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  const path = window.location.pathname;

  // Informational pages
  const infoPages = {
    '/about': 'about',
    '/contact': 'contact',
    '/privacy': 'privacy',
    '/terms': 'terms',
    '/disclaimer': 'disclaimer',
    '/dmca': 'dmca',
    '/faqs': 'faqs',
    '/editorial-policy': 'editorial-policy',
    '/cookie-policy': 'cookie-policy',
    '/accessibility': 'accessibility',
    '/affiliate-disclosure': 'affiliate-disclosure'
  };

  // Portfolio Page
  if (path === '/portfolio' || path === '/portfolio.html' || path.startsWith('/portfolio')) {
    return { view: 'portfolio', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }

  // Author page
  if (path === '/author/vansh-shah' || path === '/author') {
    return { view: 'author', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  
  if (infoPages[path]) {
    return { view: infoPages[path], activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }

  // Deals page & Namecheap Reviews
  if (path === '/hosting/namecheap-review' || path === '/deals/namecheap') {
    return { view: 'namecheap-review', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  if (path === '/deals') {
    return { view: 'deals', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  if (path === '/deals/elevenlabs' || path === '/deals/eleven-labs') {
    return { view: 'elevenlabs-deal', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  if (path === '/deals/canva' || path === '/deals/canva-pro') {
    return { view: 'canva-deal', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  if (path === '/deals/grammarly') {
    return { view: 'grammarly-deal', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  if (path === '/deals/nordvpn') {
    return { view: 'nordvpn-deal', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  if (path === '/deals/elementor') {
    return { view: 'elementor-deal', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }

  // Analytics Dashboard
  if (path === '/analytics' || path === '/admin-analytics') {
    return { view: 'analytics-dashboard', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  
  // Blog pages
  if (path === '/blog') {
    return { view: 'blog-list', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  
  if (path.startsWith('/blog/category/')) {
    const cat = path.substring(15);
    return { view: 'blog-list', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: cat, searchVal: '' };
  }
  
  if (path.startsWith('/blog/')) {
    const slug = path.substring(6);
    return { view: 'blog-post', activeTool: null, selectedBlogSlug: slug, selectedBlogCategory: null, searchVal: '' };
  }
  
  // Main sections
  if (path === '/downloader') {
    return { view: 'dashboard', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: 'downloader' };
  }
  if (path === '/converter') {
    return { view: 'dashboard', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: 'converter' };
  }
  if (path === '/ai-notes') {
    return { view: 'dashboard', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: 'AI Tool' };
  }
  if (path === '/utility') {
    return { view: 'dashboard', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: 'Utility' };
  }
  
  // Specific tools
  const matchedTool = TOOLS_DATA.find(tool => 
    tool.routes && tool.routes.includes(path)
  );
  if (matchedTool) {
    return { view: 'tool-page', activeTool: matchedTool, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
  }
  
  return { view: 'dashboard', activeTool: null, selectedBlogSlug: null, selectedBlogCategory: null, searchVal: '' };
}

export default function App() {
  const initialRoute = getInitialRouteState();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [view, setView] = useState(initialRoute.view);
  const [searchVal, setSearchVal] = useState(initialRoute.searchVal);
  const [activeTool, setActiveTool] = useState(initialRoute.activeTool);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState(initialRoute.selectedBlogSlug);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState(initialRoute.selectedBlogCategory);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('ops_history')) || []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  
  // Bookmarks, Recently Used, Conversion Counter & Toasts
  const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('ops_bookmarks')) || []);
  const [recentlyUsed, setRecentlyUsed] = useState(JSON.parse(localStorage.getItem('ops_recently_used')) || []);
  const [conversionCount, setConversionCount] = useState(parseInt(localStorage.getItem('ops_conversion_count')) || 14205);
  const [toasts, setToasts] = useState([]);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const toggleBookmark = (toolId) => {
    let updated;
    if (bookmarks.includes(toolId)) {
      updated = bookmarks.filter(id => id !== toolId);
      addToast('Removed from favorites', 'info');
    } else {
      updated = [...bookmarks, toolId];
      addToast('Added to favorites', 'success');
    }
    setBookmarks(updated);
    localStorage.setItem('ops_bookmarks', JSON.stringify(updated));
  };

  const addRecentlyUsed = (toolId) => {
    const filtered = recentlyUsed.filter(id => id !== toolId);
    const updated = [toolId, ...filtered].slice(0, 4); // Keep top 4
    setRecentlyUsed(updated);
    localStorage.setItem('ops_recently_used', JSON.stringify(updated));
  };

  const incrementConversion = () => {
    const updated = conversionCount + 1;
    setConversionCount(updated);
    localStorage.setItem('ops_conversion_count', updated.toString());
  };
  
  const toolsRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Backend health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout
        
        const res = await fetch(`${rawBackendUrl}/health`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error('Non-200 response');
        }
        const data = await res.json();
        if (data.status === 'ok') {
          setIsBackendHealthy(true);
        } else {
          throw new Error('Status not ok');
        }
      } catch (err) {
        console.warn("Backend health check failed:", err);
        setIsBackendHealthy(false);
      }
    };

    // Run health check initially
    checkHealth();

    // Check health every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  // Navigate helper function
  const navigate = (viewId, tool = null, slug = null, category = null) => {
    setView(viewId);
    setActiveTool(tool);
    setSelectedBlogSlug(slug);
    setSelectedBlogCategory(category);
    
    if (viewId !== 'dashboard') {
      setSearchVal('');
    }
    
    if (viewId === 'tool-page' && tool) {
      addRecentlyUsed(tool.id);
    }

    // Push browser history state for clean URL synchronization
    let targetUrl = '/';
    if (viewId === 'portfolio') targetUrl = '/portfolio';
    else if (viewId === 'about') targetUrl = '/about';
    else if (viewId === 'contact') targetUrl = '/contact';
    else if (viewId === 'privacy') targetUrl = '/privacy';
    else if (viewId === 'terms') targetUrl = '/terms';
    else if (viewId === 'disclaimer') targetUrl = '/disclaimer';
    else if (viewId === 'dmca') targetUrl = '/dmca';
    else if (viewId === 'faqs') targetUrl = '/faqs';
    else if (viewId === 'editorial-policy') targetUrl = '/editorial-policy';
    else if (viewId === 'cookie-policy') targetUrl = '/cookie-policy';
    else if (viewId === 'accessibility') targetUrl = '/accessibility';
    else if (viewId === 'affiliate-disclosure') targetUrl = '/affiliate-disclosure';
    else if (viewId === 'author') targetUrl = '/author/vansh-shah';
    else if (viewId === 'deals') targetUrl = '/deals';
    else if (viewId === 'blog-list') targetUrl = category ? `/blog/category/${category}` : '/blog';
    else if (viewId === 'blog-post' && slug) targetUrl = `/blog/${slug}`;
    else if (viewId === 'tool-page' && tool && tool.routes && tool.routes[0]) targetUrl = tool.routes[0];

    if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({ view: viewId }, '', targetUrl);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Client-side virtual routing mount / listener
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      
      // Informational pages
      const infoPages = {
        '/about': 'about',
        '/contact': 'contact',
        '/privacy': 'privacy',
        '/terms': 'terms',
        '/disclaimer': 'disclaimer',
        '/dmca': 'dmca',
        '/faqs': 'faqs',
        '/editorial-policy': 'editorial-policy',
        '/cookie-policy': 'cookie-policy',
        '/accessibility': 'accessibility',
        '/affiliate-disclosure': 'affiliate-disclosure'
      };

      // Portfolio Page
      if (path === '/portfolio' || path === '/portfolio.html' || path.startsWith('/portfolio')) {
        setView('portfolio');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }

      // Author page
      if (path === '/author/vansh-shah' || path === '/author') {
        setView('author');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      
      if (infoPages[path]) {
        setView(infoPages[path]);
        setActiveTool(null);
        setSelectedBlogSlug(null);
        return;
      }

      // Deals page & Namecheap Reviews
      if (path === '/hosting/namecheap-review' || path === '/deals/namecheap') {
        setView('namecheap-review');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      if (path === '/deals') {
        setView('deals');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      if (path === '/deals/elevenlabs' || path === '/deals/eleven-labs') {
        setView('elevenlabs-deal');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      if (path === '/deals/canva') {
        setView('canva-deal');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      if (path === '/deals/grammarly') {
        setView('grammarly-deal');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      if (path === '/deals/nordvpn') {
        setView('nordvpn-deal');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      if (path === '/deals/elementor') {
        setView('elementor-deal');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }

      // Analytics Dashboard
      if (path === '/analytics' || path === '/admin-analytics') {
        setView('analytics-dashboard');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSelectedBlogCategory(null);
        return;
      }
      
      // Blog pages
      if (path === '/blog') {
        setView('blog-list');
        setSelectedBlogCategory(null);
        setActiveTool(null);
        setSelectedBlogSlug(null);
        return;
      }
      
      if (path.startsWith('/blog/category/')) {
        const cat = path.substring(15);
        setView('blog-list');
        setSelectedBlogCategory(cat);
        setActiveTool(null);
        setSelectedBlogSlug(null);
        return;
      }
      
      if (path.startsWith('/blog/')) {
        const slug = path.substring(6);
        setView('blog-post');
        setSelectedBlogSlug(slug);
        setActiveTool(null);
        setSelectedBlogCategory(null);
        return;
      }
      
      // Main sections
      if (path === '/downloader') {
        setView('dashboard');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSearchVal('downloader');
        setTimeout(scrollToTools, 100);
        return;
      }
      if (path === '/converter') {
        setView('dashboard');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSearchVal('converter');
        setTimeout(scrollToTools, 100);
        return;
      }
      if (path === '/ai-notes') {
        setView('dashboard');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSearchVal('AI Tool');
        setTimeout(scrollToTools, 100);
        return;
      }
      if (path === '/utility') {
        setView('dashboard');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        setSearchVal('Utility');
        setTimeout(scrollToTools, 100);
        return;
      }
      
      // Specific tools
      const matchedTool = TOOLS_DATA.find(tool => 
        tool.routes && tool.routes.includes(path)
      );
      if (matchedTool) {
        setView('tool-page');
        setActiveTool(matchedTool);
        setSelectedBlogSlug(null);
        return;
      }
      
      // Fallback/Home
      setView('dashboard');
      setActiveTool(null);
      setSelectedBlogSlug(null);
    };

    handleRoute();
    
    // Listen for popstate changes (browser back/forward navigation)
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  // Consolidated URL state, metadata and analytics sync
  useEffect(() => {
    let path = '/';
    let title = "All Tool Master — Free Online File Converter, Downloader & AI Notes";
    let desc = "Free online tools to convert PDF, Word, images and videos. Download videos from YouTube, Instagram & TikTok. AI-powered notes and transcription. No signup needed.";
    let ogTitleVal = "";
    let ogDescVal = "";
    
    if (view === 'tool-page' && activeTool) {
      const currentPath = window.location.pathname;
      path = activeTool.routes && activeTool.routes.includes(currentPath) ? currentPath : (activeTool.routes ? activeTool.routes[0] : '/');
      const seoInfo = { ...SEO_DATA[activeTool.id], ...SEO_DATA[path] };
      title = seoInfo?.title || `${activeTool.title} | Free Online Converter & AI Notes | All Tool Master`;
      desc = seoInfo?.description || `${activeTool.desc} Safe, fast, and browser-based format utilities by All Tool Master.`;
      
      if (window.gtag) {
        window.gtag('event', 'view_item', {
          item_id: activeTool.id,
          item_name: activeTool.title,
          item_category: activeTool.category
        });
      }
    } else if (view === 'blog-post' && selectedBlogSlug) {
      path = `/blog/${selectedBlogSlug}`;
      const post = BLOG_POSTS.find(p => p.slug === selectedBlogSlug);
      if (post) {
        title = post.seoTitle || `${post.title} | All Tool Master Blog`;
        desc = post.metaDescription || post.excerpt;
        ogTitleVal = post.ogTitle;
        ogDescVal = post.ogDescription;
      }
      
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: `blog-post-${selectedBlogSlug}` });
      }
    } else if (view === 'blog-list') {
      if (selectedBlogCategory) {
        path = `/blog/category/${selectedBlogCategory}`;
        title = `${selectedBlogCategory.charAt(0).toUpperCase() + selectedBlogCategory.slice(1)} Articles | All Tool Master Blog`;
        desc = `Browse high-quality educational guides, tool reviews, and productivity tutorials in the ${selectedBlogCategory} category.`;
      } else {
        path = '/blog';
        const seoInfo = SEO_DATA['/blog'];
        title = seoInfo?.title || "Blog — File Conversion Tips & Video Download Guides | All Tool Master";
        desc = seoInfo?.description || "Guides and tutorials on file conversion, video downloading, AI note-taking and online productivity tools. Free tips, updated regularly.";
      }
      
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: `blog-list${selectedBlogCategory ? `-${selectedBlogCategory}` : ''}` });
      }
    } else if (view !== 'dashboard') {
      const pathMap = {
        about: '/about',
        contact: '/contact',
        privacy: '/privacy',
        terms: '/terms',
        disclaimer: '/disclaimer',
        dmca: '/dmca',
        faqs: '/faqs',
        deals: '/deals',
        'namecheap-review': '/hosting/namecheap-review',
        'analytics-dashboard': '/analytics',
        'elevenlabs-deal': '/deals/elevenlabs',
        'canva-deal': '/deals/canva',
        'grammarly-deal': '/deals/grammarly',
        'nordvpn-deal': '/deals/nordvpn',
        'elementor-deal': '/deals/elementor',
        author: '/author/vansh-shah',
        'editorial-policy': '/editorial-policy',
        'cookie-policy': '/cookie-policy',
        accessibility: '/accessibility',
        'affiliate-disclosure': '/affiliate-disclosure'
      };
      const titleMap = {
        about: "About All Tool Master — Free Online Tools for Everyone",
        contact: "Contact All Tool Master — Get in Touch",
        privacy: "Privacy Policy | All Tool Master",
        terms: "Terms & Conditions | All Tool Master",
        disclaimer: "Disclaimer | All Tool Master",
        dmca: "DMCA Policy | All Tool Master",
        faqs: "FAQs — Frequently Asked Questions | All Tool Master",
        deals: "Hosting Deals & Domains | All Tool Master",
        'namecheap-review': "Namecheap Review & Student Domain Discounts | All Tool Master",
        'analytics-dashboard': "SaaS Performance & Tool Traffic Analytics | All Tool Master",
        'elevenlabs-deal': "Get Started With ElevenLabs AI Voice Generator | All Tool Master",
        'canva-deal': "Get Started With Canva Graphic Design & Pro Trials | All Tool Master",
        'grammarly-deal': "Perfect Your Writing With Grammarly AI Assistant | All Tool Master",
        'nordvpn-deal': "Secure Your Digital Footprint With NordVPN | All Tool Master",
        'elementor-deal': "Build Websites With Elementor WordPress Builder | All Tool Master",
        author: "About the Author: Vansh Shah | All Tool Master",
        'editorial-policy': "Editorial Policy & Editorial Standards | All Tool Master",
        'cookie-policy': "Cookie Policy & Cookie Consent | All Tool Master",
        accessibility: "Accessibility Statement & Web Standards | All Tool Master",
        'affiliate-disclosure': "FTC Affiliate Disclosure & Partnerships | All Tool Master"
      };
      const descMap = {
        about: "All Tool Master is a free platform built for students, professionals and content creators who need fast, reliable online tools with no signup.",
        contact: "Have a question or suggestion? Contact the All Tool Master team. We respond to all inquiries.",
        privacy: "Read our privacy policy. We respect your security; no files are logged or stored on our servers.",
        terms: "Review the terms and conditions for using All Tool Master utilities.",
        disclaimer: "Legal disclaimers for the All Tool Master toolset and conversions.",
        dmca: "DMCA copyright policy and takedown instructions for All Tool Master.",
        faqs: "Answers to common questions about All Tool Master's free file converters, video downloaders and AI note-taking tools.",
        deals: "Domain registration discounts with our affiliate promo tools via Namecheap.",
        'namecheap-review': "Read our comprehensive Namecheap review. Compare pricing vs GoDaddy, free domain privacy protection, and claim special student discounts.",
        'analytics-dashboard': "View real-time traffic statistics, top active digital converter utilities, and affiliate conversion rates on All Tool Master.",
        'elevenlabs-deal': "Create realistic AI voices, voiceovers, dubbing, podcasts, and audiobooks using ElevenLabs. Start free with our affiliate partner registration.",
        'canva-deal': "Design professional social media posts, presentations, posters, logo ideas, and marketing documents with Canva Pro free trial.",
        'grammarly-deal': "Elevate your writing. Grammarly AI corrects grammar, improves clarity, and fine-tunes your writing tone in real-time.",
        'nordvpn-deal': "Protect your online privacy, secure public Wi-Fi traffic, block malware, and browse securely with NordVPN affiliate discounts.",
        'elementor-deal': "Build responsive WordPress websites using the #1 visual page builder. Get Elementor Pro discount codes and details.",
        author: "Learn more about Vansh Shah, founder and lead developer of All Tool Master. Software engineer from Mumbai, India.",
        'editorial-policy': "Review our editorial guidelines, fact-checking process, and quality standards for all content on All Tool Master.",
        'cookie-policy': "Understand how All Tool Master uses cookies to manage user settings and web preferences safely.",
        accessibility: "Read our commitment to WCAG 2.1 AA web accessibility standards and user features.",
        'affiliate-disclosure': "Read our transparent affiliate link disclosure complying with FTC requirements."
      };
      
      path = pathMap[view] || '/';
      title = titleMap[view] || title;
      desc = descMap[view] || desc;
      
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: view });
      }
    } else {
      const currentPath = window.location.pathname;
      if (['/downloader', '/converter', '/ai-notes', '/utility'].includes(currentPath)) {
        path = currentPath;
        const seoInfo = SEO_DATA[currentPath];
        title = seoInfo?.title || title;
        desc = seoInfo?.description || desc;
      } else {
        path = '/';
      }
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: path === '/' ? 'home' : path.substring(1) });
      }
    }
    
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    
    document.title = title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', desc);
    }
    
    // Update canonical URL
    const canonicalLink = document.getElementById('canonical-url');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `https://alltoolmaster.me${path}`);
    }
    
    // Update og:url, og:title, og:description
    const ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', `https://alltoolmaster.me${path}`);
    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', ogTitleVal || title);
    const ogDesc = document.getElementById('og-desc');
    if (ogDesc) ogDesc.setAttribute('content', ogDescVal || desc);

    // Update Twitter Card meta tags
    const twTitle = document.getElementById('twitter-title');
    if (twTitle) twTitle.setAttribute('content', ogTitleVal || title);
    const twDesc = document.getElementById('twitter-desc');
    if (twDesc) twDesc.setAttribute('content', ogDescVal || desc);

    // Noindex control for low-value pages
    const robotsMeta = document.getElementById('robots-meta');
    const noindexViews = ['privacy', 'terms', 'dmca', 'disclaimer', 'deals', 'analytics-dashboard'];
    if (robotsMeta) {
      if (noindexViews.includes(view)) {
        robotsMeta.setAttribute('content', 'noindex, nofollow');
      } else {
        robotsMeta.setAttribute('content', 'index, follow');
      }
    }

    // Inject dynamic JSON-LD schema
    const dynamicSchema = document.getElementById('dynamic-schema');
    if (dynamicSchema) {
      if (view === 'tool-page' && activeTool) {
        const currentPath = window.location.pathname;
        const seoInfo = { ...SEO_DATA[activeTool.id], ...SEO_DATA[currentPath] };
        const toolUrl = `https://alltoolmaster.me${currentPath}`;
        
        const mainSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: seoInfo?.h1 || activeTool.title,
          url: toolUrl,
          description: seoInfo?.description || activeTool.desc,
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          }
        };

        let schemas = [mainSchema];
        
        // FAQPage Schema
        if (seoInfo && seoInfo.faqs && seoInfo.faqs.length > 0) {
          const faqSchema = {
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
          };
          schemas.push(faqSchema);
        }

        // BreadcrumbList Schema
        const breadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://alltoolmaster.me'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: activeTool.category,
              item: `https://alltoolmaster.me/${activeTool.category.toLowerCase()}`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: seoInfo?.h1 || activeTool.title,
              item: toolUrl
            }
          ]
        };
        schemas.push(breadcrumbs);

        dynamicSchema.textContent = JSON.stringify(schemas);
      } else if (view === 'blog-post' && selectedBlogSlug) {
        const post = BLOG_POSTS.find(p => p.slug === selectedBlogSlug);
        if (post) {
          const articleSchema = post.articleSchema || {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
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
                url: 'https://alltoolmaster.me/logo.png'
              }
            },
            datePublished: post.date,
            dateModified: post.date,
            url: `https://alltoolmaster.me/blog/${post.slug}`,
            image: 'https://alltoolmaster.me/logo.png'
          };

          const breadcrumbs = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://alltoolmaster.me'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://alltoolmaster.me/blog'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://alltoolmaster.me/blog/${post.slug}`
              }
            ]
          };

          const schemas = [articleSchema, breadcrumbs];
          if (post.faqSchema) {
            schemas.push(post.faqSchema);
          }
          dynamicSchema.textContent = JSON.stringify(schemas);
        }
      } else if (view === 'dashboard') {
        const orgSchema = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'All Tool Master',
          url: 'https://alltoolmaster.me',
          logo: 'https://alltoolmaster.me/logo.png',
          sameAs: [
            'https://www.linkedin.com/in/vansh-shah-824926291/',
            'https://www.youtube.com/@VANSHSHAH-india'
          ]
        };

        const websiteSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'All Tool Master',
          url: 'https://alltoolmaster.me',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://alltoolmaster.me/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        };

        const homepageFaqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is the best free url to mp4 converter online without watermark?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'All Tool Master is the best free URL to MP4 converter online. It allows you to download videos from YouTube, Shorts, TikTok, Instagram, and Facebook as high-quality watermark-free MP4 files without signup.'
              }
            },
            {
              '@type': 'Question',
              name: 'How to convert PDF to editable Word online free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can convert PDF to editable Word online with All Tool Master. Drag and drop your PDF file, choose the DOCX target format, and click process. The tool extracts text layouts and preserves formatting without losing quality.'
              }
            },
            {
              '@type': 'Question',
              name: 'Is there a free AI video summarizer to summarize YouTube videos with AI?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, All Tool Master features a free AI video summarizer and watcher. Paste a YouTube URL or upload a video clip, and Gemini AI will transcribe, analyze, and generate structured study notes or bulleted summaries.'
              }
            },
            {
              '@type': 'Question',
              name: 'How do I extract ZIP files online without software?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Use the browser-based ZIP extractor on All Tool Master. Upload any compressed ZIP archive and our secure tool will extract all nested files instantly, packaging the contents for download without installing heavy desktop software.'
              }
            }
          ]
        };

        dynamicSchema.textContent = JSON.stringify([orgSchema, websiteSchema, homepageFaqSchema]);
      } else if (view === 'faqs') {
        const breadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://alltoolmaster.me'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'FAQs',
              item: 'https://alltoolmaster.me/faqs'
            }
          ]
        };

        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer
            }
          }))
        };

        dynamicSchema.textContent = JSON.stringify([breadcrumbs, faqSchema]);
      } else {
        const breadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://alltoolmaster.me'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' '),
              item: `https://alltoolmaster.me/${view}`
            }
          ]
        };
        dynamicSchema.textContent = JSON.stringify([breadcrumbs]);
      }
    }
  }, [view, activeTool, selectedBlogSlug, selectedBlogCategory]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const saveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', geminiKey);
    setSettingsOpen(false);
    alert('Settings saved successfully!');
  };

  const addToHistory = (item) => {
    const updated = [item, ...history].slice(0, 15); // keep last 15
    setHistory(updated);
    localStorage.setItem('ops_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ops_history');
  };

  const scrollToTools = () => {
    if (toolsRef.current) {
      toolsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Testimonials list
  const testimonials = [
    {
      name: "Marcus Aurelius",
      role: "Digital Content Producer",
      review: "All Tool Master is my absolute go-to for daily conversions. MP4 to MP3 conversions take seconds, and there are no annoying ads or sign-up popups. The quality is flawless!",
      rating: 5
    },
    {
      name: "Sophia Rodriguez",
      role: "College Student",
      review: "As a student, the AI Lecture Note Taker has saved me hours of transcribing. I simply upload my recorded lecture audio and get a beautiful, structured summary outline.",
      rating: 5
    },
    {
      name: "Ethan Chen",
      role: "Operations Manager",
      review: "The PDF-to-Word converter and ZIP utility work beautifully. Highly secure too - knowing my files are deleted immediately after processing is key.",
      rating: 5
    }
  ];

  const features = [
    { title: "Unlimited Conversions", desc: "No hourly quotas or limitations. Convert as many files as you need.", icon: FiZap },
    { title: "Secure File Handling", desc: "Files process in secure RAM pools and are wiped immediately.", icon: FiShield },
    { title: "AI-Powered Analysis", desc: "Leverage Gemini to summarize documents and media verbatim.", icon: FiCpu },
    { title: "No Registration Required", desc: "Start converting instantly. No signups, no credit cards.", icon: FiUserCheck }
  ];

  if (view === 'portfolio') {
    return (
      <React.Suspense fallback={<SkeletonLoader />}>
        <PortfolioPage navigate={navigate} />
      </React.Suspense>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header Navbar */}
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentView={view} 
        setView={setView} 
        navigate={navigate}
        openSettings={openSettings} 
      />

      {/* Backend Offline Banner */}
      {!isBackendHealthy && (
        <div className="animate-fade-in" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '12px 24px',
          color: 'var(--text-main)',
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          zIndex: 999,
          position: 'relative',
          flexWrap: 'wrap',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiAlertTriangle style={{ color: '#f59e0b', fontSize: '16px', flexShrink: 0 }} />
            <span style={{ fontWeight: '700', color: '#f59e0b', letterSpacing: '-0.01em' }}>
              Service Alert:
            </span>
            <span style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
              The backend server is taking time to wake up or unreachable. File downloads/conversions may fail.
            </span>
          </div>
          <button 
            onClick={async () => {
              addToast('Rechecking server status...', 'info');
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000);
                const res = await fetch(`${rawBackendUrl}/health`, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (res.ok) {
                  const data = await res.json();
                  if (data.status === 'ok') {
                    setIsBackendHealthy(true);
                    addToast('Backend connected successfully!', 'success');
                    return;
                  }
                }
                addToast('Backend remains offline. Waking it up might take a minute.', 'warning');
              } catch (e) {
                addToast('Backend is still unreachable. Please try again in a moment.', 'error');
              }
            }} 
            className="btn btn-secondary" 
            style={{ 
              padding: '5px 12px', 
              fontSize: '12px', 
              height: '28px', 
              borderRadius: '6px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: '600'
            }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: '1 0 auto' }}>
        {view === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <Hero 
              searchVal={searchVal} 
              setSearchVal={setSearchVal} 
              scrollToTools={scrollToTools} 
            />

            {/* Bookmarks & Recently Used Section */}
            {(bookmarks.length > 0 || recentlyUsed.length > 0) && (
              <section style={{ padding: '20px 0 0 0' }}>
                <div className="container">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {bookmarks.length > 0 && (
                      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
                          <FiStar style={{ fill: 'var(--accent-color)' }} /> Favorite Tools
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {bookmarks.map(id => {
                            const t = TOOLS_DATA.find(x => x.id === id);
                            if (!t) return null;
                            const IconComp = t.icon;
                            return (
                              <button key={id} onClick={() => navigate('tool-page', t)} className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <IconComp size={14} style={{ color: t.color }} /> {t.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {recentlyUsed.length > 0 && (
                      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FiClock /> Recently Used
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {recentlyUsed.map(id => {
                            const t = TOOLS_DATA.find(x => x.id === id);
                            if (!t) return null;
                            const IconComp = t.icon;
                            return (
                              <button key={id} onClick={() => navigate('tool-page', t)} className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <IconComp size={14} style={{ color: t.color }} /> {t.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Tool Dashboard Tiles */}
            <div ref={toolsRef}>
              <ToolGrid 
                filterText={searchVal} 
                onSelectTool={(tool) => navigate('tool-page', tool)} 
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            </div>

            {/* History Panel */}
            <HistoryPanel 
              history={history} 
              clearHistory={clearHistory} 
            />

            {/* Features Row */}
            <section style={{ padding: '40px 0', background: 'rgba(0,0,0,0.05)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Why Choose <span className="text-gradient">All Tool Master</span>?</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>High-speed, cloud-based conversion and AI models optimized for your workflow.</p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '24px'
                }}>
                  {features.map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: 'var(--accent-muted)',
                          color: 'var(--accent-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          marginBottom: '16px'
                        }}>
                          <Icon />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>{feat.title}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{feat.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Why Trust AllToolMaster? Section */}
            <section style={{ padding: '50px 0', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <span className="badge">E-E-A-T Authority</span>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>Why Trust <span className="text-gradient">AllToolMaster</span>?</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14.5px' }}>We are committed to transparency, safety, and expert-reviewed content.</p>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '24px'
                }}>
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                    <div style={{ fontSize: '24px', color: 'var(--accent-color)', marginBottom: '12px' }}><FiUserCheck /></div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Real Founder</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      AllToolMaster was built by <span onClick={() => navigate('author')} style={{ color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>Vansh Shah</span>, a software engineer dedicated to building clean, ad-free web utilities.
                    </p>
                  </div>
                  
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                    <div style={{ fontSize: '24px', color: 'var(--accent-color)', marginBottom: '12px' }}><FiShield /></div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Secure Processing</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      All files are converted directly in your browser or secure RAM pools and immediately deleted. We never sell or inspect your files.
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                    <div style={{ fontSize: '24px', color: 'var(--accent-color)', marginBottom: '12px' }}><FiZap /></div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>No Signup Required</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      Start using our tools instantly. There are no registration flows, credit card requirements, or email paywalls.
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                    <div style={{ fontSize: '24px', color: 'var(--accent-color)', marginBottom: '12px' }}><FiStar /></div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Expertly Researched</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      Our guides and tool explanations are vetted for technical accuracy under our rigorous <span onClick={() => navigate('editorial-policy')} style={{ color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' }}>Editorial Policy</span>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Popular Guides Section */}
            <section style={{ padding: '50px 0', borderTop: '1px solid var(--border-color)' }}>
              <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="badge">Knowledge Hub</span>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>Popular <span className="text-gradient">Guides &amp; Tutorials</span></h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14.5px' }}>Learn how to solve file conversion and productivity problems in seconds.</p>
                  </div>
                  <button onClick={() => navigate('blog-list')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    View All Articles <FiSend />
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px'
                }}>
                  {BLOG_POSTS.slice(0, 6).map((post, idx) => (
                    <div key={idx} className="glass-panel card-hover" style={{ 
                      padding: '24px', 
                      borderRadius: '18px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      minHeight: '220px',
                      cursor: 'pointer'
                    }} onClick={() => navigate('blog-post', null, post.slug)}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 style={{ fontSize: '16.5px', fontWeight: '800', marginBottom: '10px', lineHeight: '1.4' }}>{post.title}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.excerpt}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-color)', marginTop: '16px' }}>
                        Read Guide <FiSend size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: '50px 0' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '800' }}>What Our <span className="text-gradient">Users Say</span></h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Trusted by thousands of professionals, creators, and students worldwide.</p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px'
                }} className="testimonials-grid">
                  {testimonials.map((t, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                        {[...Array(t.rating)].map((_, i) => (
                          <FiStar key={i} style={{ fill: '#eab308', color: '#eab308' }} />
                        ))}
                      </div>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.6' }}>
                        "{t.review}"
                      </p>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800' }}>{t.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured AI Resources */}
            <section style={{ padding: '50px 0', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <span className="badge">Featured Deals &amp; Discounts</span>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>Recommended <span className="text-gradient">Creator &amp; AI Tools</span></h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14.5px' }}>Exclusive partner offers for leading AI platforms, domain hosting, and creative software.</p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '24px',
                  maxWidth: '1200px',
                  margin: '0 auto'
                }}>
                  {/* Namecheap Card */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.03)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#de4b1a', background: 'rgba(222, 75, 26, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>Domain Deal</span>
                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10b981' }}>Domains from $0.99</span>
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>Namecheap Domains</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                        Get cheap domain registration with free lifetime privacy protection, DNSSEC security, and premium 24/7 support.
                      </p>
                    </div>
                    <a href={AFFILIATE_LINKS.namecheap} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#de4b1a', borderColor: '#de4b1a', width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}>
                      Claim Discount <FiExternalLink size={14} />
                    </a>
                  </div>

                  {/* ElevenLabs Card */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.03)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>AI Voice</span>
                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10b981' }}>Free Plan Available</span>
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>ElevenLabs AI Voices</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                        Generate hyper-realistic human-like speech in any language, clone your voice, and create professional audio dubs.
                      </p>
                    </div>
                    <a href={AFFILIATE_LINKS.elevenlabs} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#6366f1', borderColor: '#6366f1', width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}>
                      Try ElevenLabs Free <FiExternalLink size={14} />
                    </a>
                  </div>

                  {/* Canva Card */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.03)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#00c4cc', background: 'rgba(0, 196, 204, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>Design</span>
                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10b981' }}>30-Day Pro Trial</span>
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>Canva Graphic Design</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                        Create stunning social media posts, presentations, and documents with Canva's simple drag-and-drop platform.
                      </p>
                    </div>
                    <a href={AFFILIATE_LINKS.canva || "#affiliate"} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00c4cc', borderColor: '#00c4cc', width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}>
                      Try Canva Pro Free <FiExternalLink size={14} />
                    </a>
                  </div>

                  {/* Elementor Card */}
                  <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.03)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#8d00c4', background: 'rgba(141, 0, 196, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>Web Builder</span>
                        <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10b981' }}>#1 WP Page Builder</span>
                      </div>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>Elementor Pro Builder</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                        Build custom, high-speed WordPress websites with a professional drag-and-drop live editor and 100+ responsive widgets.
                      </p>
                    </div>
                    <a href={AFFILIATE_LINKS.elementor} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#8d00c4', borderColor: '#8d00c4', width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}>
                      Get Elementor Pro <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <span onClick={() => navigate('deals')} style={{ color: 'var(--accent-color)', cursor: 'pointer', fontSize: '14.5px', fontWeight: '700', textDecoration: 'underline' }}>
                    View All Promotional Resource Deals
                  </span>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <FAQAccordion />

            {/* Newsletter Subscription Banner */}
            <section style={{ padding: '60px 0', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.01)' }}>
              <div className="container" style={{ maxWidth: '800px' }}>
                <div className="glass-panel" style={{
                  padding: '40px',
                  borderRadius: '24px',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(0,0,0,0.05) 100%)',
                  border: '1px solid var(--border-color)'
                }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Join the All Tool Master Newsletter</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
                    Subscribe to receive product updates, new file conversion tools, AI productivity tips, and exclusive partner deal alerts direct to your inbox.
                  </p>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const emailInput = e.target.elements.newsletterEmail.value;
                    if (emailInput) {
                      const subs = JSON.parse(localStorage.getItem('newsletter_subs') || '[]');
                      subs.push(emailInput);
                      localStorage.setItem('newsletter_subs', JSON.stringify(subs));
                      alert(`Thank you for subscribing! We've saved ${emailInput} to our newsletter subscriber list.`);
                      e.target.reset();
                    }
                  }} style={{
                    display: 'flex',
                    gap: '12px',
                    maxWidth: '500px',
                    margin: '0 auto',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <input
                      name="newsletterEmail"
                      type="email"
                      placeholder="Enter your email address..."
                      required
                      className="input-field"
                      style={{ flex: 1, minWidth: '240px', height: '44px', padding: '0 16px', borderRadius: '10px' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ height: '44px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Subscribe Now <FiSend />
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* SEO Content Section */}
            <section style={{ padding: '40px 0 60px 0', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.03)' }}>
              <div className="container" style={{ maxWidth: '900px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px' }}>
                  All Tool Master – Free All Tools Platform for Universal File Conversion & AI Productivity
                </h2>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  fontSize: '13.5px',
                  lineHeight: '1.7',
                  color: 'var(--text-muted)',
                  textAlign: 'justify'
                }}>
                  <p>
                    Are you searching for an efficient, reliable <strong>free all tools</strong> repository? Look no further. All Tool Master is an all-in-one digital utility hub built to solve your formatting bottlenecks and boost your productivity. Our <strong>online file converter</strong> makes it incredibly easy to translate between various formats, supporting high-speed cross-conversions such as <strong>MP4 to MP3</strong>, MOV to MP4, JPG to PNG, image-to-PDF compilation, and document-to-PDF rendering. Everything runs directly inside your web browser, bypassing the need to download heavy programs.
                  </p>
                  
                  <p>
                    In addition to file conversions, our platform acts as a secure, fast <strong>free youtube downloader</strong>. With support for standard URL inputs, you can paste video links from platforms like YouTube, Vimeo, Facebook, TikTok, and Instagram, exporting them directly as HD MP4 files or extracting clean MP3 files. With our <strong>url to mp4 converter</strong> and <strong>video to mp3 converter</strong>, extracting soundtracks from podcasts or parenting tutorials for offline usage is quick and simple.
                  </p>

                  <p>
                    Furthermore, All Tool Master features a full-fledged <strong>AI note taker</strong> and productivity suite. Powered by Gemini API, tools like our AI Meeting Assistant and Lecture Note Taker automatically transcribe and summarize uploaded recordings into formal meeting minutes, bulleted summaries, action items, or study sheets. Whether you are a student translating lectures, a creator compressing media, or a business professional organizing action items, our platform is optimized to help you save time.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        <React.Suspense fallback={<SkeletonLoader />}>
          {view === 'about' && <AboutPage />}
          {view === 'contact' && <ContactPage />}
          {view === 'privacy' && <PrivacyPage />}
          {view === 'terms' && <TermsPage />}
          {view === 'disclaimer' && <DisclaimerPage />}
          {view === 'dmca' && <DmcaPage />}
          {view === 'faqs' && <FAQAccordion />}
          {view === 'blog-list' && <BlogListPage category={selectedBlogCategory} navigate={navigate} />}
          {view === 'deals' && <DealsPage navigate={navigate} />}
          {view === 'blog-post' && <BlogPostPage slug={selectedBlogSlug} navigate={navigate} />}
          {view === 'namecheap-review' && <NamecheapReview navigate={navigate} />}
          {view === 'analytics-dashboard' && <AnalyticsDashboard navigate={navigate} />}
          {view === 'elevenlabs-deal' && <ElevenLabsDeal />}
          {view === 'canva-deal' && <CanvaDeal />}
          {view === 'grammarly-deal' && <GrammarlyDeal />}
          {view === 'nordvpn-deal' && <NordVPNDeal />}
          {view === 'elementor-deal' && <ElementorDeal />}
          {view === 'author' && <AuthorPage navigate={navigate} />}
          {view === 'editorial-policy' && <EditorialPolicy />}
          {view === 'cookie-policy' && <CookiePolicy />}
          {view === 'accessibility' && <AccessibilityStatement />}
          {view === 'affiliate-disclosure' && <AffiliateDisclosure />}
          {view === 'tool-page' && activeTool && (
            activeTool.id === 'file-compressor' ? (
              <FileCompressor tool={activeTool} setView={setView} setActiveTool={setActiveTool} addToHistory={addToHistory} navigate={navigate} addToast={addToast} incrementConversion={incrementConversion} />
            ) : activeTool.id === 'resume-builder' ? (
              <ResumeBuilder tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'ai-script-writer' ? (
              <ScriptWriter tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'ai-card-maker' ? (
              <CardMaker tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'watermark-remover' ? (
              <WatermarkRemover tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'object-remover' ? (
              <ObjectRemover tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'background-remover' ? (
              <BackgroundRemover tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'ai-logo-generator' ? (
              <LogoGenerator tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'qr-code-generator' ? (
              <QRCodeGenerator tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'business-card-maker' ? (
              <BusinessCardMaker tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : activeTool.id === 'youtube-thumbnail-maker' ? (
              <ThumbnailMaker tool={activeTool} setView={setView} setActiveTool={setActiveTool} navigate={navigate} addToast={addToast} />
            ) : (
              <ToolPage 
                tool={activeTool} 
                setView={setView} 
                setActiveTool={setActiveTool} 
                addToHistory={addToHistory} 
                navigate={navigate}
                addToast={addToast}
                incrementConversion={incrementConversion}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            )
          )}
        </React.Suspense>
      </main>

      {/* Footer */}
      <Footer setView={setView} navigate={navigate} />

      {/* Settings Modal (Gemini API Key input) */}
      {settingsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }} className="animate-fade-in">
          
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '450px',
            padding: '30px',
            borderRadius: '20px',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Settings</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Add your Google Gemini API Key to enable AI summarization and note-taking services.
            </p>

            <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Gemini API Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="input-field"
                  required
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Your key is stored securely in your browser's local storage and is never saved on our databases.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={closeSettings}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Key</button>
              </div>
            </form>
          </div>

        </div>
      )}



      {/* Toast Notification System */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
