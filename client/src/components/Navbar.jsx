import React, { useState } from 'react';
import { FiSun, FiMoon, FiSettings, FiMenu, FiX, FiLayers } from 'react-icons/fi';

export default function Navbar({ theme, toggleTheme, currentView, setView, navigate, openSettings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Tools Dashboard', id: 'dashboard' },
    { name: 'Blog', id: 'blog-list' },
    { name: 'Deals', id: 'deals' },
    { name: 'About Us', id: 'about' },
    { name: 'Contact Us', id: 'contact' },
    { name: 'FAQs', id: 'faqs' }
  ];

  const handleNavClick = (viewId) => {
    navigate(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 16px 16px',
      margin: '0 auto',
      width: '100%',
      backdropFilter: 'blur(20px)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      backgroundColor: 'var(--bg-navbar)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('dashboard')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <img 
            src="/logo.png" 
            alt="All Tool Master Logo" 
            style={{ 
              height: '34px', 
              width: '34px',
              borderRadius: '8px',
              objectFit: 'cover'
            }} 
          />
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            AllTool<span className="text-gradient">Master</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {navLinks.map(link => (
            <span
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                color: currentView === link.id ? 'var(--accent-color)' : 'var(--text-muted)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
              onMouseLeave={(e) => e.target.style.color = currentView === link.id ? 'var(--accent-color)' : 'var(--text-muted)'}
            >
              {link.name}
            </span>
          ))}
        </div>

        {/* Actions (Settings, Theme, Mobile Toggle) */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Settings button */}
          <button 
            className="btn-icon" 
            onClick={openSettings} 
            title="API Settings"
            id="btn-settings"
          >
            <FiSettings />
          </button>

          {/* Theme toggle */}
          <button 
            className="btn-icon" 
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="btn-theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          {/* Mobile menu toggle */}
          <button 
            className="btn-icon mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }} // Controlled in CSS or simple media query inline
            id="btn-mobile-menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="glass-panel mobile-menu-panel" style={{
          position: 'absolute',
          top: '75px',
          left: '24px',
          right: '24px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          borderRadius: '12px',
          zIndex: 99
        }}>
          {navLinks.map(link => (
            <div
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-color)',
                color: currentView === link.id ? 'var(--accent-color)' : 'var(--text-main)'
              }}
            >
              {link.name}
            </div>
          ))}
        </div>
      )}

      {/* Inline styles for responsive hamburger display */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .navbar-actions {
            gap: 8px !important;
          }
        }
      `}</style>
    </nav>
  );
}
