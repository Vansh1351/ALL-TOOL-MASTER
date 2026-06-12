import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

export default function AffiliateDisclosure() {
  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>

          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Affiliate <span className="text-gradient">Disclosure</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
            Last Updated: June 12, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>

            {/* Summary box */}
            <div style={{
              padding: '20px', borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-muted) 0%, transparent 100%)',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                Quick Summary
              </h3>
              <p style={{ fontSize: '14px' }}>
                Some links on All Tool Master are affiliate links. If you click on these links and make a purchase, we may earn a small commission — at <strong style={{ color: 'var(--text-main)' }}>no additional cost to you</strong>. This helps us keep the platform free and continue developing new tools. We only recommend products we genuinely believe in.
              </p>
            </div>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                What Are Affiliate Links?
              </h3>
              <p>
                Affiliate links are special URLs that track referrals from our website to a partner's website. When you click an affiliate link on All Tool Master and subsequently make a purchase, the partner company pays us a small referral commission. This commission comes from the partner's marketing budget — it does not increase the price you pay. In many cases, our affiliate partners offer exclusive discounts that actually save you money.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                How We Use Affiliate Revenue
              </h3>
              <p style={{ marginBottom: '12px' }}>
                All Tool Master is a free platform with no subscription fees, no paid tiers, and no mandatory accounts. Affiliate commissions help us:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Pay for server hosting and cloud infrastructure (Vercel, domain registration).',
                  'Maintain and update existing tools to ensure they work correctly.',
                  'Develop new free tools and features for the platform.',
                  'Create high-quality educational content (blog articles, tutorials, guides).',
                  'Keep the platform completely free for all users worldwide.'
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
                Our Affiliate Partners
              </h3>
              <p style={{ marginBottom: '12px' }}>
                We currently have affiliate relationships with the following companies:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'Namecheap', desc: 'Domain registration, web hosting, and SSL certificates.' },
                  { name: 'ElevenLabs', desc: 'AI voice generation, text-to-speech, and voice cloning technology.' },
                  { name: 'Canva', desc: 'Online graphic design platform for creating social media content, presentations, and more.' },
                  { name: 'Grammarly', desc: 'AI-powered writing assistant for grammar checking, plagiarism detection, and writing enhancement.' },
                  { name: 'NordVPN', desc: 'Virtual private network (VPN) service for online privacy and security.' },
                  { name: 'Elementor', desc: 'WordPress website builder with drag-and-drop page editing.' },
                ].map((partner, i) => (
                  <div key={i} style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                    <strong style={{ color: 'var(--text-main)', fontSize: '14px' }}>{partner.name}</strong>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>{partner.desc}</p>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '12px', fontSize: '13px' }}>
                This list may be updated as new partnerships are established. We will always disclose new affiliate relationships on this page.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                Editorial Independence
              </h3>
              <p>
                Our affiliate relationships do not influence our editorial content. Product recommendations, reviews, and comparisons are based solely on our own research, testing, and honest opinions. We include both free and paid alternatives in our guides, and we will always disclose negative aspects of products alongside positive features. If a product is not good, we will say so — regardless of any affiliate relationship.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                FTC Compliance
              </h3>
              <p>
                This disclosure is provided in accordance with the Federal Trade Commission's 16 CFR Part 255 guidelines concerning the use of endorsements and testimonials in advertising. We are committed to transparency about our revenue sources and will always clearly identify affiliate links and sponsored content.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                Questions?
              </h3>
              <p>
                If you have any questions about our affiliate relationships or this disclosure, please contact us at{' '}
                <a href="mailto:vhshah1711@gmail.com" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>vhshah1711@gmail.com</a>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
