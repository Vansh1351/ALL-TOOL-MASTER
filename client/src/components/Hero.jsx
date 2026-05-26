import React from 'react';
import { FiSearch, FiZap, FiCheckCircle } from 'react-icons/fi';

export default function Hero({ searchVal, setSearchVal, scrollToTools }) {
  const stats = [
    { value: '100% Free', label: 'No Signups Required' },
    { value: '25+', label: 'File Format Conversions' },
    { value: 'Instant', label: 'AI Summaries & Notes' },
    { value: 'Secure', label: 'SSL File Processing' }
  ];

  return (
    <section style={{ padding: '60px 0 40px 0' }}>
      <div className="container">
        {/* Two-column Hero Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center'
        }} className="hero-grid">
          
          {/* Left Column: Heading and Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'inline-flex' }}>
              <span className="badge animate-pulse-glow" style={{ fontSize: '12px' }}>
                <FiZap style={{ marginRight: '4px' }} /> Ultimate Digital Utilities
              </span>
            </div>
            
            <h1 style={{
              fontSize: '48px',
              lineHeight: '1.15',
              fontWeight: '800',
              letterSpacing: '-1.5px'
            }} className="hero-title">
              Convert Files, Download Videos, & Create <span className="text-gradient">AI Notes</span> Instantly
            </h1>
            
            <p style={{
              fontSize: '17px',
              color: 'var(--text-muted)',
              maxWidth: '560px'
            }}>
              Welcome to the ultimate hub of free all tools. Convert formats (MP4, MP3, JPG, PDF, DOCX, ZIP), download high-quality media, and generate meeting transcripts or study notes using state-of-the-art AI.
            </p>

            {/* Search Input Bar */}
            <div style={{ position: 'relative', maxWidth: '500px', marginTop: '10px' }}>
              <FiSearch style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '18px'
              }} />
              <input
                type="text"
                placeholder="Search tools (e.g. YouTube Downloader, MP4 to MP3, AI summarizer...)"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '48px', height: '54px' }}
              />
            </div>

            {/* Quick Search Tag Cloud */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', alignItems: 'center' }} className="popular-tags-container">
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Popular Searches:</span>
              {[
                'URL to MP4', 'YouTube to MP3', 'PDF to Word', 'HEIC to JPG', 'AI Note Taker', 'WebP to PNG', 'AI Summarizer'
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchVal(tag);
                    scrollToTools();
                  }}
                  className="badge popular-tag"
                  style={{
                    cursor: 'pointer',
                    background: 'var(--bg-grid)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button className="btn btn-primary" onClick={scrollToTools}>
                Explore Converters
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setSearchVal('AI');
                  scrollToTools();
                }}
              >
                Try AI Productivity Suite
              </button>
            </div>
          </div>

          {/* Right Column: 1:1 Graphic Card */}
          <div className="hero-graphic-container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel animate-float" style={{
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '1/1',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Pulsing Backlit Glow */}
              <div style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                background: 'var(--primary-gradient)',
                filter: 'blur(50px)',
                opacity: 0.15,
                zIndex: 0
              }} />

              {/* Premium SVG Digital Node Visualizer */}
              <svg width="220" height="220" viewBox="0 0 220 220" style={{ zIndex: 1, overflow: 'visible' }}>
                <defs>
                  <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f766e" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                
                {/* Central AI Node */}
                <circle cx="110" cy="110" r="30" fill="url(#tealGrad)" style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.6))' }} />
                <text x="110" y="114" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">AI</text>
                
                {/* Orbiting Satellite Nodes */}
                {/* MP4 */}
                <line x1="110" y1="110" x2="110" y2="40" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="110" cy="40" r="18" fill="var(--bg-grid)" stroke="var(--accent-color)" strokeWidth="2" />
                <text x="110" y="44" fill="var(--text-main)" fontSize="9" fontWeight="bold" textAnchor="middle">MP4</text>
                
                {/* MP3 */}
                <line x1="110" y1="110" x2="180" y2="110" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="180" cy="110" r="18" fill="var(--bg-grid)" stroke="var(--accent-color)" strokeWidth="2" />
                <text x="180" y="114" fill="var(--text-main)" fontSize="9" fontWeight="bold" textAnchor="middle">MP3</text>
                
                {/* PDF */}
                <line x1="110" y1="110" x2="110" y2="180" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="110" cy="180" r="18" fill="var(--bg-grid)" stroke="var(--accent-color)" strokeWidth="2" />
                <text x="110" y="184" fill="var(--text-main)" fontSize="9" fontWeight="bold" textAnchor="middle">PDF</text>
                
                {/* PNG */}
                <line x1="110" y1="110" x2="40" y2="110" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="40" cy="110" r="18" fill="var(--bg-grid)" stroke="var(--accent-color)" strokeWidth="2" />
                <text x="40" y="114" fill="var(--text-main)" fontSize="9" fontWeight="bold" textAnchor="middle">PNG</text>
              </svg>

              <div style={{ marginTop: '20px', textAlign: 'center', zIndex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Universal Converters Running</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Drag & drop any file to convert instantly</p>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginTop: '60px',
          padding: '24px',
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.1)'
        }} className="stats-row">
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: 'var(--accent-color)'
              }}>{stat.value}</div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginTop: '4px'
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .popular-tag {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .popular-tag:hover {
          background: var(--accent-color) !important;
          border-color: var(--accent-color) !important;
          color: #fff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }
        @media (max-width: 768px) {
          .popular-tags-container {
            justify-content: center;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
            text-align: center;
          }
          .hero-title {
            font-size: 34px !important;
          }
          .hero-graphic-container {
            order: -1;
          }
          .input-field {
            margin: 0 auto;
          }
          .stats-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
