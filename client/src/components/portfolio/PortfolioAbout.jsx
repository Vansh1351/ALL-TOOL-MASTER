import React from 'react';
import { FiUser, FiBookOpen, FiTarget, FiHeart, FiAward, FiCompass } from 'react-icons/fi';

const TIMELINE = [
  {
    year: '2024 - Present',
    title: 'Full Stack AI Developer & Creative Specialist',
    organization: 'All Tool Master Platform',
    desc: 'Architected and engineered the All Tool Master web platform from scratch using React, Express, and AI automation. Built 15+ browser-based AI conversion and file utilities used globally.'
  },
  {
    year: '2023 - 2024',
    title: 'Motion Graphics & VFX Artist',
    organization: 'Arena Animation & Freelance',
    desc: 'Mastered rotoscoping, camera tracking, matchmoving, 3D compositing in Maya and Nuke, and commercial video editing in Premiere Pro & After Effects.'
  },
  {
    year: '2022 - 2023',
    title: 'Frontend Web Engineering & UI/UX',
    organization: 'Self-Directed & Academic Projects',
    desc: 'Designed interactive web architectures, JavaScript engines, responsive UI components, and state management pipelines.'
  }
];

const VALUES = [
  { title: 'Craftsmanship & Elegance', desc: 'Code and design are two sides of the same coin. Every pixel and function must be deliberate, clean, and performant.', icon: FiHeart, color: '#00A3FF' },
  { title: 'AI-First Engineering', desc: 'Harnessing generative AI models, LLM APIs, and intelligent automation to solve complex problems effortlessly.', icon: FiCompass, color: '#7C3AED' },
  { title: 'Relentless Optimization', desc: 'Prioritizing lightning-fast load times, 95+ Lighthouse benchmark scores, accessibility, and zero bloat.', icon: FiTarget, color: '#00E5FF' }
];

export default function PortfolioAbout() {
  return (
    <section id="about" style={{ padding: '100px 24px' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
            <FiUser size={12} /> Personal Story & Philosophy
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            About <span className="pf-text-gradient">Vansh Shah</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Bridging the gap between creative visual artistry and scalable software engineering.
          </p>
        </div>

        {/* 2-Column Grid: Story & Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginBottom: '60px'
        }}>
          {/* Column 1: Narrative Story */}
          <div className="pf-card" style={{ padding: '36px' }}>
            <h3 className="portfolio-heading" style={{ fontSize: '24px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiBookOpen style={{ color: '#00A3FF' }} /> Creative Developer Story
            </h3>
            <p style={{ color: 'var(--pf-muted)', lineHeight: 1.8, fontSize: '15px', marginBottom: '16px' }}>
              I am a <strong>Creative Developer</strong> based in Mumbai, India. My passion lies at the intersection of technical web development, modern visual design, motion graphics, and artificial intelligence.
            </p>
            <p style={{ color: 'var(--pf-muted)', lineHeight: 1.8, fontSize: '15px', marginBottom: '16px' }}>
              Rather than sticking strictly to code or pure graphic design, I blend both worlds: crafting visual motion effects, compositing VFX sequences, and bringing them to life with React, Next.js, and clean software architecture.
            </p>
            <p style={{ color: 'var(--pf-muted)', lineHeight: 1.8, fontSize: '15px' }}>
              Whether developing intelligent AI applications, optimizing web performance to achieve 95+ Lighthouse scores, or editing high-retention video content, I aim for nothing less than world-class quality.
            </p>
          </div>

          {/* Column 2: Career Goals & Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Education & Career Goals */}
            <div className="pf-card" style={{ padding: '32px' }}>
              <h3 className="portfolio-heading" style={{ fontSize: '20px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiTarget style={{ color: '#7C3AED' }} /> Vision & Career Target
              </h3>
              <p style={{ color: 'var(--pf-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                Aiming to work with visionary tech & design organizations like <strong>Adobe, Google, Microsoft, DNEG, Accenture, TCS Digital, Razorpay, CRED, BrowserStack, Vercel</strong>, and high-growth AI startups as a Creative Engineer.
              </p>
            </div>

            {/* Core Values */}
            <div className="pf-card" style={{ padding: '32px' }}>
              <h3 className="portfolio-heading" style={{ fontSize: '20px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiAward style={{ color: '#00E5FF' }} /> Core Principles
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {VALUES.map((v, idx) => {
                  const Icon = v.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        background: `${v.color}15`,
                        border: `1px solid ${v.color}40`,
                        borderRadius: '8px',
                        padding: '8px',
                        color: v.color
                      }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 700 }}>{v.title}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.5 }}>{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Timeline */}
        <div className="pf-card" style={{ padding: '40px' }}>
          <h3 className="portfolio-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '32px', textAlign: 'center' }}>
            Journey & <span className="pf-text-gradient">Timeline</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {TIMELINE.map((item, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr',
                gap: '24px',
                paddingBottom: '24px',
                borderBottom: index !== TIMELINE.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none'
              }} className="pf-timeline-item">
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  color: '#00E5FF',
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  {item.year}
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 700 }}>{item.title}</h4>
                  <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600, marginBottom: '8px' }}>{item.organization}</div>
                  <p style={{ fontSize: '14px', color: 'var(--pf-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .pf-timeline-item {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}
