import React from 'react';
import { FiCheck, FiX, FiExternalLink, FiShield, FiLock, FiGlobe, FiCpu } from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function NordVPNDeal() {
  const pros = [
    "Strict no-logs policy audited by third parties",
    "6000+ ultra-fast servers in 111 countries",
    "Threat Protection blocks malware, ads, and trackers",
    "Double VPN encrypts data through two servers",
    "Supports up to 10 simultaneous device connections",
    "30-day money-back guarantee on all plans"
  ];

  const cons = [
    "Renewal prices are higher than initial promotional rates",
    "No free trial period available (only refund guarantee)",
    "Desktop app can occasionally show server load fluctuations"
  ];

  const features = [
    { title: "Military-Grade Encryption", desc: "Encrypts your web traffic using AES-256 standard, shielding data from hackers, ISPs, and snoops." },
    { title: "Threat Protection Pro", desc: "Scans downloads for malware, blocks malicious URLs, and hides intrusive popup ads natively." },
    { title: "Meshnet Connectivity", desc: "Create secure private networks to share files, access work PCs, or host virtual LAN game sessions." },
    { title: "Kill Switch Security", desc: "Automatically blocks internet access if the VPN connection drops, preventing accidental data leaks." }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span>Home</span> &gt; <span>Deals</span> &gt; <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>NordVPN</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge">Verified Cybersecurity Partnership</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px', lineHeight: '1.2' }}>
            Secure Your Digital Footprint With NordVPN
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>
            Safeguard your data on public Wi-Fi, bypass geo-restrictions, and block web malware. Check our verified NordVPN partner discount rates and features.
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
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Why Choose NordVPN?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
              NordVPN is widely regarded as the fastest and most secure VPN provider on the market. With support for NordLynx protocol, NordVPN delivers blazing-fast speeds while maintaining strict encryption standards. It lets you browse anonymously, secure remote work connections, and protect mobile devices.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', marginBottom: '6px', color: '#3b82f6' }}>{feat.title}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={AFFILIATE_LINKS.nordvpn} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#3b82f6', borderColor: '#3b82f6', padding: '14px 28px', fontSize: '15.5px' }}>
              Claim NordVPN Discount <FiExternalLink size={16} />
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
