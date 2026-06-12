import React from 'react';
import { FiCheck, FiX, FiExternalLink, FiImage, FiCompass, FiSliders, FiGlobe } from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function CanvaDeal() {
  const pros = [
    "Simple drag-and-drop interface for beginners",
    "Thousands of professional templates and fonts",
    "Magic Studio AI tools for instant graphic generation",
    "Easy video resizing for YouTube, TikTok, and Reels",
    "Real-time team collaboration and brand kits",
    "Free basic tier with 250,000+ templates"
  ];

  const cons = [
    "Premium assets require a Pro subscription",
    "Not as advanced as Photoshop for manual photo retouching",
    "Vector export options are limited on the free plan"
  ];

  const features = [
    { title: "Social Media Templates", desc: "Access high-quality layouts for Instagram Reels, YouTube Thumbnails, Facebook Ads, and TikTok covers." },
    { title: "AI Magic Studio", desc: "Generate images, expand graphic borders, rewrite copy, and create mockups using AI tools." },
    { title: "Brand Kit Management", desc: "Organize company logos, color palettes, and fonts for consistent marketing designs." },
    { title: "Team Workspace", desc: "Share folders, collaborate on slides in real-time, and leave comments on layouts." }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span>Home</span> &gt; <span>Deals</span> &gt; <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Canva</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge">Verified Design Partnership</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px', lineHeight: '1.2' }}>
            Get Started With Canva Graphic Design & Pro Trials
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>
            Design professional social media posts, business presentations, posters, logo ideas, and marketing documents with Canva Pro. Free trial details and benefits below.
          </p>
        </div>

        {/* Affiliate Disclaimer */}
        <div style={{
          background: 'rgba(34, 211, 238, 0.05)',
          borderLeft: '4px solid var(--accent-color)',
          padding: '16px 20px',
          borderRadius: '0 12px 12px 0',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          <strong>Affiliate Disclaimer:</strong> All Tool Master is supported by referral links. If you sign up or purchase plans using our links, we may receive a commission at no extra cost to you.
        </div>

        {/* Overview Card */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Why Choose Canva?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
              Canva is the ultimate graphic design platform for content creators, agencies, and small businesses. Bypassing the learning curves of Adobe Photoshop, Canva empowers anyone to render clean marketing materials, visual mockups, and presentations in minutes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', marginBottom: '6px', color: '#00c4cc' }}>{feat.title}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={AFFILIATE_LINKS.canva} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00c4cc', borderColor: '#00c4cc', padding: '14px 28px', fontSize: '15.5px' }}>
              Try Canva Pro Free <FiExternalLink size={16} />
            </a>
            <a href="/blog/canva-vs-photoshop" className="btn btn-secondary" style={{ padding: '14px 28px' }}>
              Read Comparison Guide
            </a>
          </div>
        </div>

        {/* Pros & Cons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheck /> The Pros
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pros.map((pro, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  <FiCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiX /> The Cons
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cons.map((con, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  <FiX style={{ color: '#ef4444', flexShrink: 0, marginTop: '3px' }} />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
