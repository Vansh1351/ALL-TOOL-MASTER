import React from 'react';
import { AFFILIATE_LINKS } from '../affiliateLinks';
import { FiGlobe, FiCheck, FiShoppingBag, FiExternalLink } from 'react-icons/fi';

export default function DealsPage() {
  const deals = [
    {
      id: 'namecheap',
      title: 'Namecheap Domain Names & Security',
      tagline: 'Secure your brand name with industry-leading DNS and cheap domain extensions.',
      discount: 'Domains from $0.99',
      price: 'Popular .COM at $5.98',
      bonus: 'Free Privacy Protection',
      icon: FiGlobe,
      color: '#de4b1a',
      features: [
        'Free lifetime domain privacy protection',
        'High-speed DNS Server resolution',
        'Easy 1-click integration with Vercel/GitHub',
        'Cheap SSL certificates & Web Security',
        'No hidden renewal fees',
        '24/7 helpful customer service support'
      ],
      link: AFFILIATE_LINKS.namecheap,
      cta: 'Claim Namecheap Deal'
    }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="badge">Special Promotions</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px' }}>
            Exclusive Deals & <span className="text-gradient">Resources</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px' }}>
            Get verified discounts on web hosting, domain registrations, and developer tools to start your next online project.
          </p>
        </div>

        {/* Grid List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '30px'
        }}>
          {deals.map(deal => {
            const Icon = deal.icon;
            return (
              <div 
                key={deal.id}
                className="glass-panel"
                style={{
                  borderRadius: '24px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.07) 100%)'
                }}
              >
                {/* Background Glow */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: deal.color,
                  filter: 'blur(70px)',
                  opacity: 0.15,
                  zIndex: 0
                }} />

                <div style={{ zIndex: 1 }}>
                  {/* Icon & Discount Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '14px',
                      background: `${deal.color}15`,
                      color: deal.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      <Icon />
                    </div>
                    <span 
                      className="badge" 
                      style={{ 
                        background: `${deal.color}15`, 
                        color: deal.color, 
                        borderColor: `${deal.color}30`,
                        fontWeight: '800',
                        fontSize: '12px',
                        padding: '6px 14px'
                      }}
                    >
                      {deal.discount}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>{deal.title}</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                    {deal.tagline}
                  </p>

                  {/* Price Row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>{deal.price}</span>
                    <span style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: '700' }}>{deal.bonus}</span>
                  </div>

                  {/* Feature Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                    {deal.features.map((feat, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <FiCheck style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Claim CTA Button */}
                <a 
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    background: deal.color,
                    borderColor: deal.color,
                    zIndex: 1
                  }}
                >
                  <FiShoppingBag /> {deal.cta} <FiExternalLink size={14} />
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
