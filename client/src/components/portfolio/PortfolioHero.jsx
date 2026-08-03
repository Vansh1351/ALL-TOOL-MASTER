import React, { useState, useEffect } from 'react';
import { FiArrowDown, FiBriefcase, FiDownload, FiSend, FiZap, FiCheckCircle } from 'react-icons/fi';

const ROLES = [
  'Creative Developer',
  'Frontend Developer',
  'Motion Graphics Artist',
  'Video Editor',
  'VFX Artist',
  'AI Application Developer'
];

export default function PortfolioHero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setFade(true);
      }, 300);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 24px',
        position: 'relative',
        textAlign: 'center'
      }}
    >
      {/* Top Status Pill */}
      <div 
        className="pf-badge pf-badge-cyan" 
        style={{ marginBottom: '24px', padding: '6px 16px', fontSize: '13px' }}
      >
        <FiZap className="pf-spin" size={14} /> Available for High-Impact Roles & AI Projects
      </div>

      {/* Main Headline Name */}
      <h1 
        className="portfolio-heading" 
        style={{
          fontSize: 'clamp(42px, 7vw, 84px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          marginBottom: '16px',
          color: '#ffffff'
        }}
      >
        VANSH <span className="pf-text-gradient">HEMANSHU SHAH</span>
      </h1>

      {/* Dynamic Animated Role Rotator */}
      <div style={{
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <span 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(20px, 3vw, 32px)',
            fontWeight: 700,
            color: '#00E5FF',
            opacity: fade ? 1 : 0,
            transform: fade ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.3s ease',
            textShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
          }}
        >
          &lt;{ROLES[roleIndex]} /&gt;
        </span>
      </div>

      {/* Tagline */}
      <p style={{
        maxWidth: '680px',
        fontSize: 'clamp(16px, 2vw, 20px)',
        color: 'var(--pf-muted)',
        lineHeight: 1.6,
        marginBottom: '36px',
        fontWeight: 400
      }}>
        Building Creative Experiences with <strong style={{ color: '#fff' }}>Code</strong>, <strong style={{ color: '#00A3FF' }}>Design</strong> & <strong style={{ color: '#7C3AED' }}>AI</strong>.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '60px'
      }}>
        <button onClick={() => scrollTo('projects')} className="pf-btn-primary">
          <FiBriefcase size={18} /> View Projects
        </button>

        <button onClick={() => scrollTo('resume')} className="pf-btn-secondary">
          <FiDownload size={18} /> Download Resume
        </button>

        <button onClick={() => scrollTo('contact')} className="pf-btn-purple">
          <FiSend size={18} /> Hire Me
        </button>
      </div>

      {/* Key Metrics / Highlights Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '20px',
        maxWidth: '720px',
        width: '100%',
        padding: '20px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#00A3FF', fontFamily: 'var(--font-heading)' }}>5+</div>
          <div style={{ fontSize: '12px', color: 'var(--pf-muted)' }}>Core Specialities</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#00E5FF', fontFamily: 'var(--font-heading)' }}>15+</div>
          <div style={{ fontSize: '12px', color: 'var(--pf-muted)' }}>AI & Web Apps</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-heading)' }}>50+</div>
          <div style={{ fontSize: '12px', color: 'var(--pf-muted)' }}>Motion & VFX Edits</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>95+</div>
          <div style={{ fontSize: '12px', color: 'var(--pf-muted)' }}>Lighthouse Score</div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        onClick={() => scrollTo('about')}
        style={{
          position: 'absolute',
          bottom: '24px',
          cursor: 'pointer',
          color: 'var(--pf-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          transition: 'color 0.2s ease'
        }}
      >
        <span>Scroll to Explore</span>
        <FiArrowDown className="pf-bounce" size={16} />
      </div>

      <style>{`
        @keyframes pfBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .pf-bounce {
          animation: pfBounce 2s infinite;
        }
      `}</style>
    </section>
  );
}
