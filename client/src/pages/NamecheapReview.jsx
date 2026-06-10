import React from 'react';
import { FiCheck, FiX, FiExternalLink, FiAward, FiBookOpen, FiShield, FiCpu, FiStar } from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function NamecheapReview() {
  const pros = [
    "Most affordable domain registration in the industry",
    "Free lifetime Domain Privacy Protection (WhoisGuard)",
    "Extremely easy-to-use custom dashboard",
    "24/7 Live Chat Support with fast response times",
    "Free website builder and 1-click Vercel/GitHub integration",
    "30-day money-back guarantee on hosting plans"
  ];

  const cons = [
    "No phone support options (Live chat and ticket system only)",
    "Shared hosting speeds are solid but not optimized for enterprise-scale traffic",
    "Dashboard interface has occasional loading latency in regional locations"
  ];

  const features = [
    { title: "Free Domain Privacy", desc: "Keep your personal contact info off the public WHOIS registry for life." },
    { title: "99.9% Uptime", desc: "Reliable servers ensure your website stays online and accessible." },
    { title: "Free SSL Certificate", desc: "Secure your visitors' data and boost Google rankings with HTTPS." },
    { title: "Automatic Backups", desc: "Never lose your files with weekly scheduled automatic site backups." }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span>Home</span> &gt; <span>Hosting</span> &gt; <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Namecheap Review</span>
        </div>

        {/* H1 Heading */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge">Detailed Review &amp; Guide</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px', lineHeight: '1.2' }}>
            Namecheap Review 2026: Best Budget Hosting &amp; Free Student Domains
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>
            An in-depth review of Namecheap's domains, hosting packages, and student perks. Discover why Namecheap is the top choice for developers, creators, and students.
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
          <strong>Affiliate Disclaimer:</strong> This review is supported by referral programs. If you purchase domains or hosting using our links, we may receive a commission at no extra cost to you. This helps keep All Tool Master 100% free for everyone.
        </div>

        {/* Namecheap Overview Card */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Why We Recommend Namecheap</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
              For over two decades, Namecheap has stood out as one of the most reliable and affordable web hosting and domain registration platforms. Whether you are deploying a simple React app on Vercel and need a custom domain, or launching a full Node.js web server, Namecheap delivers the best balance of cost, performance, and security.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', marginBottom: '6px', color: 'var(--accent-color)' }}>{feat.title}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={AFFILIATE_LINKS.namecheap} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#de4b1a', borderColor: '#de4b1a', padding: '14px 28px', fontSize: '15.5px' }}>
              Claim Namecheap Discount <FiExternalLink size={16} />
            </a>
            <a href="#godaddy-comparison" className="btn btn-secondary" style={{ padding: '14px 28px' }}>
              Compare vs GoDaddy
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

        {/* Comparison Table vs GoDaddy */}
        <div id="godaddy-comparison" className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>Namecheap vs GoDaddy Comparison</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '24px' }}>How Namecheap stacks up against the largest domain registrar in the market.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px 8px', fontSize: '14.5px', fontWeight: '800' }}>Features</th>
                <th style={{ padding: '12px 8px', fontSize: '14.5px', fontWeight: '800', color: 'var(--accent-color)' }}>Namecheap</th>
                <th style={{ padding: '12px 8px', fontSize: '14.5px', fontWeight: '800' }}>GoDaddy</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', fontWeight: '700' }}>.com Registration</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', color: '#10b981' }}>$9.98/yr (or lower with codes)</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px' }}>$12.99/yr (first year only, high renewal)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', fontWeight: '700' }}>Domain Privacy</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', color: '#10b981' }}>Free &amp; Unlimited for life</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px' }}>Charged separately ($9.99/yr)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', fontWeight: '700' }}>Shared Hosting Price</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', color: '#10b981' }}>Starts at $1.98/mo (Stellar plan)</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px' }}>Starts at $5.99/mo</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', fontWeight: '700' }}>Free SSL certificates</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', color: '#10b981' }}>Included free (cPanel auto-install)</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px' }}>Paid upsell for basic plans</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontSize: '13.5px', fontWeight: '700' }}>Support System</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px' }}>24/7 Live Chat &amp; Ticket desk</td>
                <td style={{ padding: '12px 8px', fontSize: '13.5px' }}>24/7 Phone Support &amp; Chat</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Free .me Domain Guide for Students */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiBookOpen style={{ color: 'var(--accent-color)' }} /> Guide: Free .me Domain for Students
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
            If you are currently a student in high school, college, or university, you can claim a completely free <strong>.me domain name</strong> for one year through the Namecheap NC.me program or GitHub Student Developer Pack.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-muted)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800' }}>Sign up for GitHub Student Developer Pack</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Verify your student status with your official school email ID (.edu) on education.github.com.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-muted)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800' }}>Link GitHub with NC.me</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Visit nc.me and click "Authorize with GitHub" to fetch your student pack verification token.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-muted)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800' }}>Register and Configure Custom Domain</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Search your desired .me name, complete free checkout, and point the DNS records directly to your Vercel or Netlify project.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Discounts */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px', border: '1px dashed var(--accent-color)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiAward style={{ color: 'var(--accent-color)' }} /> Claim Student Discounts
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
            Namecheap provides up to <strong>86% discount</strong> on selected top-level domains (.com, .net, .club, .tech) and starter hosting packages for students globally who sign up with academic emails.
          </p>
          <a href="https://nc.me" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
            Register at NC.me &rarr;
          </a>
        </div>

        {/* Bottom CTA Card */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', background: 'var(--primary-gradient)', border: 'none' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>Ready to Start Your Website?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Get secure, fast hosting and domain registration with Namecheap. Set up your online store, personal portfolio, or converter script site today.
          </p>
          <a href={AFFILIATE_LINKS.namecheap} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ background: '#ffffff', color: '#0f172a', border: 'none', padding: '14px 32px', fontSize: '16px', fontWeight: '800' }}>
            Go to Namecheap Deal Page &rarr;
          </a>
        </div>

      </div>
    </div>
  );
}
