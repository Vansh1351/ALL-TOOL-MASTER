import React from 'react';
import { FiCheckCircle, FiFileText, FiSearch, FiUsers, FiRefreshCw, FiShield } from 'react-icons/fi';

export default function EditorialPolicy() {
  const principles = [
    { icon: FiSearch, title: 'Research-Driven Content', desc: 'Every article is thoroughly researched using primary sources, official documentation, and hands-on testing. We verify claims, test tools ourselves, and cross-reference information before publishing.' },
    { icon: FiUsers, title: 'Reader-First Approach', desc: 'Our content prioritizes reader value over marketing goals. We provide honest assessments, transparent comparisons, and actionable advice that helps you make informed decisions.' },
    { icon: FiRefreshCw, title: 'Regular Updates', desc: 'We review and update published articles regularly to ensure accuracy. Technology evolves quickly, and we commit to keeping our guides current with the latest developments.' },
    { icon: FiShield, title: 'Transparent Affiliations', desc: 'When we include affiliate links, they are clearly disclosed. Our editorial opinions are never influenced by affiliate partnerships. We recommend tools based on merit alone.' },
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>

          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Editorial <span className="text-gradient">Policy</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
            Last Updated: June 12, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
                Our Commitment to Quality
              </h2>
              <p>
                At All Tool Master, we believe that free tools deserve the same level of editorial care as premium products. Our content — including blog articles, tool descriptions, comparison guides, and tutorials — follows strict editorial standards to ensure every piece of information you read on our platform is accurate, helpful, and trustworthy.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
                Editorial Principles
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {principles.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div key={i} style={{
                      padding: '20px', borderRadius: '14px',
                      border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)'
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'var(--accent-muted)', color: 'var(--accent-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', marginBottom: '12px'
                      }}>
                        <Icon />
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>{p.title}</h4>
                      <p style={{ fontSize: '13px', lineHeight: '1.6' }}>{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                Content Creation Process
              </h3>
              <p style={{ marginBottom: '12px' }}>Every article published on All Tool Master follows this workflow:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Topic Research: We identify topics based on user searches, trending questions, and gaps in existing online guides.',
                  'Hands-On Testing: For tool reviews and comparisons, we personally test every product using real-world use cases before writing.',
                  'Writing & Structuring: Articles are written with clear heading hierarchies (H1-H3), scannable formatting, and actionable advice.',
                  'Fact-Checking: All claims, statistics, and product features are verified against official sources and documentation.',
                  'SEO Optimization: We optimize for relevant search intent while maintaining readability. We never sacrifice content quality for keyword density.',
                  'Review & Publish: Each article undergoes a final review for accuracy, grammar, and helpfulness before publication.',
                  'Ongoing Monitoring: Published articles are monitored for outdated information and updated when tools, pricing, or features change.'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <FiCheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '3px', fontSize: '14px' }} />
                    <span><strong style={{ color: 'var(--text-main)' }}>{item.split(':')[0]}:</strong>{item.split(':').slice(1).join(':')}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                Affiliate Content Policy
              </h3>
              <p style={{ marginBottom: '12px' }}>
                Some articles on All Tool Master contain affiliate links. When you click these links and make a purchase, we may earn a small commission at no extra cost to you. However:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Affiliate relationships never influence our editorial opinions or recommendations.',
                  'We only recommend products we have personally tested and believe provide genuine value.',
                  'All affiliate links are clearly disclosed with appropriate labels.',
                  'We include both free and paid alternatives in every comparison to serve all budgets.',
                  'Negative aspects of affiliate products are honestly disclosed alongside positive features.'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <FiCheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '3px', fontSize: '14px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                Corrections Policy
              </h3>
              <p>
                We take factual accuracy seriously. If you find any inaccuracies in our content, please contact us at <a href="mailto:vhshah1711@gmail.com" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>vhshah1711@gmail.com</a>. We will investigate and correct errors promptly, with a note indicating the correction was made.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                Author Information
              </h3>
              <p>
                All content on All Tool Master is written and reviewed by <a href="/author/vansh-shah" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>Vansh Shah</a>, the founder of the platform. Vansh is a BCA student, web developer, VFX artist, and AI tools enthusiast based in Mumbai, India. For more information about the author, visit the <a href="/author/vansh-shah" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>author profile page</a>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
