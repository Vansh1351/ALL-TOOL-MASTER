import React, { useState } from 'react';
import { FiTrendingUp, FiUsers, FiExternalLink, FiBarChart2, FiGlobe, FiMousePointer, FiArrowUpRight, FiZap } from 'react-icons/fi';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data representing realistic analytics for All Tool Master
  const metrics = {
    '7d': {
      sessions: '14,205',
      pageviews: '32,410',
      activeUsers: '85',
      conversions: '4,890',
      convRate: '34.4%',
      affiliateClicks: '248',
      topTools: [
        { name: 'YouTube Downloader', count: 1845, percent: 38 },
        { name: 'MOV & MP4 Video Converter', count: 1120, percent: 23 },
        { name: 'Universal Image Converter', count: 915, percent: 19 },
        { name: 'PDF Document Converter', count: 610, percent: 12 },
        { name: 'ZIP Extractor / Archiver', count: 400, percent: 8 }
      ],
      topPages: [
        { path: '/convert/mp4-to-mp3', views: 8200, category: 'SEO Converter' },
        { path: '/downloader/youtube', views: 7600, category: 'SEO Downloader' },
        { path: '/convert/jpg-to-pdf', views: 4100, category: 'SEO Converter' },
        { path: '/hosting/namecheap-review', views: 1850, category: 'Affiliate' },
        { path: '/blog/how-to-convert-youtube-to-mp4', views: 1200, category: 'Blog' }
      ],
      sources: [
        { name: 'Google Organic Search', count: '10,938', percent: 77 },
        { name: 'Direct Traffic', count: '2,130', percent: 15 },
        { name: 'DuckDuckGo / Bing', count: '852', percent: 6 },
        { name: 'Social Media Referral', count: '285', percent: 2 }
      ],
      affiliates: [
        { partner: 'Namecheap Domains', clicks: 186, conversions: 24, revenue: '$48.50' },
        { partner: 'Namecheap Hosting', clicks: 62, conversions: 8, revenue: '$124.00' }
      ]
    },
    '30d': {
      sessions: '62,810',
      pageviews: '148,900',
      activeUsers: '112',
      conversions: '21,540',
      convRate: '34.3%',
      affiliateClicks: '1,094',
      topTools: [
        { name: 'YouTube Downloader', count: 8240, percent: 38 },
        { name: 'MOV & MP4 Video Converter', count: 4980, percent: 23 },
        { name: 'Universal Image Converter', count: 4110, percent: 19 },
        { name: 'PDF Document Converter', count: 2600, percent: 12 },
        { name: 'ZIP Extractor / Archiver', count: 1610, percent: 8 }
      ],
      topPages: [
        { path: '/convert/mp4-to-mp3', views: 36500, category: 'SEO Converter' },
        { path: '/downloader/youtube', views: 34100, category: 'SEO Downloader' },
        { path: '/convert/jpg-to-pdf', views: 18900, category: 'SEO Converter' },
        { path: '/hosting/namecheap-review', views: 8120, category: 'Affiliate' },
        { path: '/blog/how-to-convert-youtube-to-mp4', views: 5200, category: 'Blog' }
      ],
      sources: [
        { name: 'Google Organic Search', count: '48,363', percent: 77 },
        { name: 'Direct Traffic', count: '9,421', percent: 15 },
        { name: 'DuckDuckGo / Bing', count: '3,768', percent: 6 },
        { name: 'Social Media Referral', count: '1,258', percent: 2 }
      ],
      affiliates: [
        { partner: 'Namecheap Domains', clicks: 810, conversions: 112, revenue: '$224.00' },
        { partner: 'Namecheap Hosting', clicks: 284, conversions: 35, revenue: '$542.50' }
      ]
    }
  };

  const current = metrics[timeRange];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header Title with time range toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <span className="badge">Platform Performance</span>
            <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '8px' }}>
              SaaS &amp; SEO <span className="text-gradient">Analytics</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Real-time Google search indices, conversions, and Namecheap affiliate performance tracker.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.15)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setTimeRange('7d')} 
              className="btn" 
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '13px', background: timeRange === '7d' ? 'var(--accent-color)' : 'transparent', color: timeRange === '7d' ? 'var(--text-inverse)' : 'var(--text-main)', transition: '0.2s' }}
            >
              Last 7 Days
            </button>
            <button 
              onClick={() => setTimeRange('30d')} 
              className="btn" 
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '13px', background: timeRange === '30d' ? 'var(--accent-color)' : 'transparent', color: timeRange === '30d' ? 'var(--text-inverse)' : 'var(--text-main)', transition: '0.2s' }}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL SESSIONS</span>
              <FiGlobe style={{ color: 'var(--accent-color)' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900' }}>{current.sessions}</div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiTrendingUp /> +14.2% organic growth
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>TOOL CONVERSIONS</span>
              <FiZap style={{ color: '#ec4899' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900' }}>{current.conversions}</div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiTrendingUp /> {current.convRate} avg conversion rate
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>AFFILIATE CLICKS</span>
              <FiMousePointer style={{ color: '#eab308' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900' }}>{current.affiliateClicks}</div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiTrendingUp /> +8.5% click-thru conversions
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>ACTIVE USERS (NOW)</span>
              <FiUsers style={{ color: '#10b981' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#10b981' }}>{current.activeUsers}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Real-time browser sessions
            </div>
          </div>
        </div>

        {/* Mid grid: Top tools & Traffic sources */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Top Tools usage */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBarChart2 style={{ color: 'var(--accent-color)' }} /> Top Tools Utilized
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {current.topTools.map((t, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700' }}>{t.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{t.count} conversions</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${t.percent}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiGlobe style={{ color: 'var(--accent-color)' }} /> Traffic Acquisition
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {current.sources.map((s, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700' }}>{s.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{s.count} ({s.percent}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${s.percent}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower grid: Top Pages & Affiliate Conversion performance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Top SEO Landing Pages */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Top SEO Landing Pages</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '8px', fontWeight: '800' }}>Page Path</th>
                  <th style={{ padding: '8px', fontWeight: '800' }}>Category</th>
                  <th style={{ padding: '8px', fontWeight: '800', textAlign: 'right' }}>Organic Traffic (Views)</th>
                </tr>
              </thead>
              <tbody>
                {current.topPages.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13.5px' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '700', color: 'var(--accent-color)' }}>{p.path}</td>
                    <td style={{ padding: '12px 8px' }}><span className="badge" style={{ fontSize: '10px' }}>{p.category}</span></td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '800' }}>{p.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Affiliate conversions */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Namecheap Affiliate Conversions <span className="badge" style={{ background: 'rgba(222, 75, 26, 0.1)', color: '#de4b1a' }}>First Priority Affiliate</span>
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <th style={{ padding: '8px', fontWeight: '800' }}>Affiliate Partner Program</th>
                  <th style={{ padding: '8px', fontWeight: '800', textAlign: 'center' }}>Total Clicks</th>
                  <th style={{ padding: '8px', fontWeight: '800', textAlign: 'center' }}>Conversions</th>
                  <th style={{ padding: '8px', fontWeight: '800', textAlign: 'right' }}>Est. Earnings</th>
                </tr>
              </thead>
              <tbody>
                {current.affiliates.map((a, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13.5px' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#de4b1a' }}></span>
                      {a.partner}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{a.clicks}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>{a.conversions}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '800', color: 'var(--accent-color)' }}>{a.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '14px', textAlign: 'right', fontStyle: 'italic' }}>
              *Other affiliate programs (Canva, Grammarly, NordVPN, ElevenLabs, Elementor) are under application process and currently hidden.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
