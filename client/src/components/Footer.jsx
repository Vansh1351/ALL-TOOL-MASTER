import React, { useState } from 'react';
import { FiLayers, FiYoutube, FiLinkedin, FiSend, FiMail, FiPhone } from 'react-icons/fi';
import { TOOLS_DATA } from './ToolGrid';

export default function Footer({ setView, navigate }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  const handleLinkClick = (viewId) => {
    navigate(viewId);
  };

  const handleToolClick = (toolId) => {
    const tool = TOOLS_DATA.find(t => t.id === toolId);
    if (tool) {
      navigate('tool-page', tool);
    }
  };

  return (
    <footer className="glass-panel" style={{
      borderRadius: '16px 16px 0 0',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '60px 0 30px 0',
      marginTop: '40px',
      background: 'var(--bg-navbar)'
    }}>
      <div className="container">
        
        {/* 4-Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr',
          gap: '40px',
          marginBottom: '40px'
        }} className="footer-grid">
          
          {/* Column 1: About */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => handleLinkClick('dashboard')}>
              <img 
                src="/logo.png" 
                alt="All Tool Master Logo" 
                style={{ 
                  height: '28px', 
                  width: '28px',
                  borderRadius: '6px',
                  objectFit: 'cover'
                }} 
              />
              <span style={{ fontSize: '18px', fontWeight: '800' }}>AllTool<span className="text-gradient">Master</span></span>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              All Tool Master is an AI-powered File Converter, URL Downloader, and Productivity Hub built by <strong>Vansh Shah</strong> from Mumbai, India. Free, fast, and secure — no signup required.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <a href="mailto:vhshah1711@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}><FiMail size={13} /> vhshah1711@gmail.com</a>
              <a href="tel:+919820901789" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}><FiPhone size={13} /> +91 98209 01789</a>
            </div>
          </div>

          {/* Column 2: Tools Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Utilities</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <a 
                href="/downloader/youtube" 
                onClick={(e) => { e.preventDefault(); handleToolClick('youtube-downloader'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                URL Downloader
              </a>
              <a 
                href="/convert/mp4-to-mp3" 
                onClick={(e) => { e.preventDefault(); handleToolClick('mp4-to-mp3'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                MP4 to MP3
              </a>
              <a 
                href="/convert/heic-to-jpg" 
                onClick={(e) => { e.preventDefault(); handleToolClick('image-converter'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                Universal Image Converter
              </a>
              <a 
                href="/ai-notes/meeting-minutes" 
                onClick={(e) => { e.preventDefault(); handleToolClick('ai-meeting-minutes'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                AI Meeting Assistant
              </a>
            </div>
          </div>

          {/* Column 3: Legal Pages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <a 
                href="/blog" 
                onClick={(e) => { e.preventDefault(); handleLinkClick('blog-list'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none', fontWeight: '700' }}
              >
                Blog Articles
              </a>
              <a 
                href="/privacy" 
                onClick={(e) => { e.preventDefault(); handleLinkClick('privacy'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                onClick={(e) => { e.preventDefault(); handleLinkClick('terms'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                Terms of Service
              </a>
              <a 
                href="/disclaimer" 
                onClick={(e) => { e.preventDefault(); handleLinkClick('disclaimer'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                Disclaimer
              </a>
              <a 
                href="/dmca" 
                onClick={(e) => { e.preventDefault(); handleLinkClick('dmca'); }} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none' }}
              >
                DMCA Notice
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscribe</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get notified when we add new utilities and AI tools.</p>
            
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ padding: '8px 12px', fontSize: '13px', height: '40px' }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', height: '40px' }}>
                <FiSend />
              </button>
            </form>

            <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
              <a href="https://www.linkedin.com/in/vansh-shah-824926291/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '18px' }} title="LinkedIn"><FiLinkedin /></a>
              <a href="https://www.youtube.com/@VANSHSHAH-india" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '18px' }} title="YouTube"><FiYoutube /></a>
              <a href="mailto:vhshah1711@gmail.com" style={{ color: 'var(--text-muted)', fontSize: '18px' }} title="Email"><FiMail /></a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '12px'
        }} className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} All Tool Master by Vansh Shah. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span onClick={() => handleLinkClick('about')} style={{ cursor: 'pointer' }}>About Us</span>
            <span onClick={() => handleLinkClick('contact')} style={{ cursor: 'pointer' }}>Contact</span>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
