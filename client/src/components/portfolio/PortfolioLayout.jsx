import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCode, FiUser, FiCpu, FiBriefcase, FiVideo, FiFilm, FiLayers, FiAward, FiFileText, FiMail } from 'react-icons/fi';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: FiCode },
  { id: 'about', label: 'About', icon: FiUser },
  { id: 'skills', label: 'Skills', icon: FiCpu },
  { id: 'projects', label: 'Projects', icon: FiBriefcase },
  { id: 'motion-graphics', label: 'Motion', icon: FiFilm },
  { id: 'video-editing', label: 'Video', icon: FiVideo },
  { id: 'vfx', label: 'VFX', icon: FiLayers },
  { id: 'ai-projects', label: 'AI Projects', icon: FiCpu },
  { id: 'certificates', label: 'Certificates', icon: FiAward },
  { id: 'resume', label: 'Resume', icon: FiFileText },
  { id: 'contact', label: 'Contact', icon: FiMail },
];

export default function PortfolioLayout({ children, navigate }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Determine active section based on scroll position
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPos >= sections[i].offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="portfolio-scope">
      {/* Scroll Progress Bar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #00A3FF, #00E5FF, #7C3AED)',
          zIndex: 10000,
          transition: 'width 0.1s linear',
          boxShadow: '0 0 10px #00E5FF'
        }}
      />

      {/* Glow Orbs Backdrop */}
      <div className="pf-bg-glow" style={{ top: '5%', left: '-10%', background: '#00A3FF' }} />
      <div className="pf-bg-glow" style={{ top: '40%', right: '-10%', background: '#7C3AED' }} />
      <div className="pf-bg-glow" style={{ top: '75%', left: '5%', background: '#00E5FF' }} />

      {/* Sticky Header / Sub-Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          padding: '0 24px'
        }}>
          {/* Brand / Title & Back to Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('dashboard')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--pf-muted)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="pf-back-btn"
              title="Return to Main Website"
            >
              <FiArrowLeft size={14} /> Back to Utilities
            </button>

            <span 
              onClick={() => scrollToSection('hero')}
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 800, 
                fontSize: '18px', 
                cursor: 'pointer',
                letterSpacing: '-0.02em',
                color: '#fff'
              }}
            >
              VANSH<span className="pf-text-gradient-cyan">.SHAH</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="pf-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    background: isActive ? 'rgba(0, 163, 255, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 163, 255, 0.3)' : '1px solid transparent',
                    color: isActive ? '#00E5FF' : 'var(--pf-muted)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={12} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="pf-mobile-toggle"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            background: '#090d1e',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px'
          }}>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    background: isActive ? 'rgba(0, 163, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#00E5FF' : '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon size={14} /> {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Portfolio Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      {/* Responsive Breakpoints CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .pf-desktop-nav {
            display: none !important;
          }
          .pf-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
