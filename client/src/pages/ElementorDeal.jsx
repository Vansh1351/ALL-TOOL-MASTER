import React from 'react';
import { FiCheck, FiX, FiExternalLink, FiLayout, FiCpu, FiGrid } from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function ElementorDeal() {
  const pros = [
    "Intuitive drag-and-drop live editing interface",
    "100+ responsive widgets and elements",
    "Advanced Theme Builder for custom headers/footers",
    "WooCommerce Builder for online store customization",
    "Includes professional website template kits",
    "Free basic plugin available in WordPress repository"
  ];

  const cons = [
    "Pro version requires yearly subscription per site",
    "Can slow down site load speeds if over-bloated with addons",
    "Support responsiveness can vary on lower-tier plans"
  ];

  const features = [
    { title: "Visual Live Editor", desc: "Design and customize every section of your site in real-time without writing HTML or CSS code." },
    { title: "Advanced Widgets", desc: "Access sliders, forms, testimonials, portfolio grids, and animated headlines out of the box." },
    { title: "Theme Builder", desc: "Gain complete control over structural templates like blog posts, archives, headers, and 404 pages." },
    { title: "Loop Grid Builder", desc: "Build custom listing templates for posts or products using query control filters." }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span>Home</span> &gt; <span>Deals</span> &gt; <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Elementor</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge">Verified Web Development Partnership</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px', lineHeight: '1.2' }}>
            Build Stunning Websites With Elementor WordPress Builder
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>
            Design custom layouts, headers, WooCommerce shops, and landing pages with the #1 WordPress page builder. Learn about Elementor Pro features and discounts.
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
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Why Choose Elementor?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
              Elementor is the industry-standard page builder for WordPress, powering over 15 million websites. It eliminates the need for expensive web development services, allowing creators, marketers, and developers to build responsive, beautiful websites on a code-free visual canvas.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', marginBottom: '6px', color: '#8d00c4' }}>{feat.title}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={AFFILIATE_LINKS.elementor} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#8d00c4', borderColor: '#8d00c4', padding: '14px 28px', fontSize: '15.5px' }}>
              Get Elementor Pro <FiExternalLink size={16} />
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
