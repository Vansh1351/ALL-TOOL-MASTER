import React, { useState } from 'react';
import { FiLayers, FiYoutube, FiLinkedin, FiSend, FiMail, FiPhone } from 'react-icons/fi';

export default function Footer({ setView }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  const handleLinkClick = (viewId) => {
    setView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <div style={{
                background: 'var(--primary-gradient)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <FiLayers size={16} />
              </div>
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
              <span onClick={() => handleLinkClick('dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>URL Downloader</span>
              <span onClick={() => handleLinkClick('dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>MP4 to MP3</span>
              <span onClick={() => handleLinkClick('dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Universal Image Converter</span>
              <span onClick={() => handleLinkClick('dashboard')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>AI Meeting Assistant</span>
            </div>
          </div>

          {/* Column 3: Legal Pages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <span onClick={() => handleLinkClick('privacy')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Privacy Policy</span>
              <span onClick={() => handleLinkClick('terms')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Terms of Service</span>
              <span onClick={() => handleLinkClick('disclaimer')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>Disclaimer</span>
              <span onClick={() => handleLinkClick('dmca')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>DMCA Notice</span>
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
