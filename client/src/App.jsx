import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolGrid, { TOOLS_DATA } from './components/ToolGrid';
import HistoryPanel from './components/HistoryPanel';
import FAQAccordion from './components/FAQAccordion';
import Footer from './components/Footer';

// Pages
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import DmcaPage from './pages/DmcaPage';
import ToolPage from './pages/ToolPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import { BLOG_POSTS } from './blogData';

import { FiShield, FiZap, FiUserCheck, FiCpu, FiStar } from 'react-icons/fi';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [view, setView] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [activeTool, setActiveTool] = useState(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState(null);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('ops_history')) || []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  
  const toolsRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Navigate helper function
  const navigate = (viewId, tool = null, slug = null) => {
    setView(viewId);
    setActiveTool(tool);
    setSelectedBlogSlug(slug);
    
    if (viewId !== 'dashboard') {
      setSearchVal('');
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
        '/faqs': 'faqs'
      };
      
      if (infoPages[path]) {
        setView(infoPages[path]);
        setActiveTool(null);
        setSelectedBlogSlug(null);
        return;
      }
      
      // Blog pages
      if (path === '/blog') {
        setView('blog-list');
        setActiveTool(null);
        setSelectedBlogSlug(null);
        return;
      }
      
      if (path.startsWith('/blog/')) {
        const slug = path.substring(6);
        setView('blog-post');
        setSelectedBlogSlug(slug);
        setActiveTool(null);
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
    let title = "All Tool Master | Free Online File Converter, Downloader & AI Notes";
    let desc = "Access free online file tools. Fast PDF and media converter, universal web video downloader from URL, and smart AI note-taker online. No registration required.";
    
    if (view === 'tool-page' && activeTool) {
      const firstRoute = activeTool.routes ? activeTool.routes[0] : '/';
      path = firstRoute;
      title = `${activeTool.title} | Free Online Converter & AI Notes | All Tool Master`;
      desc = `${activeTool.desc} Safe, fast, and browser-based format utilities by All Tool Master.`;
      
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
        title = `${post.title} | All Tool Master Blog`;
        desc = post.excerpt;
      }
      
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: `blog-post-${selectedBlogSlug}` });
      }
    } else if (view === 'blog-list') {
      path = '/blog';
      title = "All Tool Master Blog | Free Online Guides & Video Converter Tutorials";
      desc = "Learn how to convert MP4 to MP3, download YouTube videos, convert HEIC to JPG online, and transcribe meeting transcripts with AI tools.";
      
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: 'blog-list' });
      }
    } else if (view !== 'dashboard') {
      const pathMap = {
        about: '/about',
        contact: '/contact',
        privacy: '/privacy',
        terms: '/terms',
        disclaimer: '/disclaimer',
        dmca: '/dmca',
        faqs: '/faqs'
      };
      const titleMap = {
        about: "About Us | All Tool Master",
        contact: "Contact Us | All Tool Master",
        privacy: "Privacy Policy | All Tool Master",
        terms: "Terms & Conditions | All Tool Master",
        disclaimer: "Disclaimer | All Tool Master",
        dmca: "DMCA Policy | All Tool Master",
        faqs: "Frequently Asked Questions | All Tool Master"
      };
      const descMap = {
        about: "Learn about All Tool Master, our mission to build secure, browser-based file conversion and AI productivity tools.",
        contact: "Get in touch with the All Tool Master team. Support, feedback, and business inquiries.",
        privacy: "Read our privacy policy. We respect your security; no files are logged or stored on our servers.",
        terms: "Review the terms and conditions for using All Tool Master utilities.",
        disclaimer: "Legal disclaimers for the All Tool Master toolset and conversions.",
        dmca: "DMCA copyright policy and takedown instructions for All Tool Master.",
        faqs: "Find answers to frequently asked questions about All Tool Master conversions, safety, and tools."
      };
      
      path = pathMap[view] || '/';
      title = titleMap[view] || title;
      desc = descMap[view] || desc;
      
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: view });
      }
    } else {
      if (window.gtag) {
        window.gtag('event', 'screen_view', { screen_name: 'home' });
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
  }, [view, activeTool, selectedBlogSlug]);

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

            {/* Tool Dashboard Tiles */}
            <div ref={toolsRef}>
              <ToolGrid 
                filterText={searchVal} 
                onSelectTool={(tool) => navigate('tool-page', tool)} 
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

            {/* FAQs */}
            <FAQAccordion />

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

        {view === 'about' && <AboutPage />}
        {view === 'contact' && <ContactPage />}
        {view === 'privacy' && <PrivacyPage />}
        {view === 'terms' && <TermsPage />}
        {view === 'disclaimer' && <DisclaimerPage />}
        {view === 'dmca' && <DmcaPage />}
        {view === 'faqs' && <FAQAccordion />}
        {view === 'blog-list' && <BlogListPage navigate={navigate} />}
        {view === 'blog-post' && <BlogPostPage slug={selectedBlogSlug} navigate={navigate} />}
        {view === 'tool-page' && activeTool && (
          <ToolPage 
            tool={activeTool} 
            setView={setView} 
            setActiveTool={setActiveTool} 
            addToHistory={addToHistory} 
            navigate={navigate}
          />
        )}
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

    </div>
  );
}
