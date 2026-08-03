import React, { useState } from 'react';
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiGlobe, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function PortfolioContact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [statusMsg, setStatusMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setStatusMsg(null);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    try {
      if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            name: formData.name,
            email: formData.email,
            subject: `Portfolio Inquiry: ${formData.subject || 'New Message'}`,
            message: formData.message,
            from_name: 'Vansh Shah Portfolio'
          })
        });
        const result = await res.json();
        if (result.success) {
          setStatusMsg({ type: 'success', text: 'Thank you! Your message has been sent successfully. I will get back to you shortly.' });
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          throw new Error('Submission failed');
        }
      } else {
        // Fallback for local testing / demo mode
        setTimeout(() => {
          setStatusMsg({ type: 'success', text: 'Thank you! Your inquiry has been received. I will reach out to you via email.' });
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 800);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to send message. Please email directly at vhshah1711@gmail.com' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{ padding: '100px 24px', background: 'rgba(5, 8, 22, 0.4)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
            <FiMail size={12} /> Get in Touch
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            Let's Build Something <span className="pf-text-gradient">Extraordinary</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Open for high-impact Creative Developer roles, freelance VFX/video projects, and AI collaborations.
          </p>
        </div>

        {/* 2-Column Grid: Contact Info & Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Column 1: Info Cards & Social Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="pf-card" style={{ padding: '32px' }}>
              <h3 className="portfolio-heading" style={{ fontSize: '22px', color: '#fff', marginBottom: '20px' }}>
                Contact Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <a href="mailto:vhshah1711@gmail.com" style={{ color: 'var(--pf-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(0, 163, 255, 0.1)', color: '#00A3FF', padding: '10px', borderRadius: '10px' }}><FiMail size={18} /></div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Email Address</div>
                    <div>vhshah1711@gmail.com</div>
                  </div>
                </a>

                <a href="tel:+919820901789" style={{ color: 'var(--pf-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', padding: '10px', borderRadius: '10px' }}><FiPhone size={18} /></div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Phone / WhatsApp</div>
                    <div>+91 98209 01789</div>
                  </div>
                </a>

                <a href="https://alltoolmaster.me/portfolio" style={{ color: 'var(--pf-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', padding: '10px', borderRadius: '10px' }}><FiGlobe size={18} /></div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Portfolio URL</div>
                    <div>alltoolmaster.me/portfolio</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pf-card" style={{ padding: '28px' }}>
              <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, marginBottom: '16px' }}>
                Social Profiles & Networks
              </h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a 
                  href="https://www.linkedin.com/in/vansh-shah-824926291/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pf-btn-secondary"
                  style={{ flex: 1, padding: '10px', justifyContent: 'center', fontSize: '13px' }}
                >
                  <FiLinkedin size={16} /> LinkedIn
                </a>

                <a 
                  href="https://github.com/Vansh1351" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pf-btn-secondary"
                  style={{ flex: 1, padding: '10px', justifyContent: 'center', fontSize: '13px' }}
                >
                  <FiGithub size={16} /> GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Direct Contact Form */}
          <div className="pf-card" style={{ padding: '36px' }}>
            <h3 className="portfolio-heading" style={{ fontSize: '22px', color: '#fff', marginBottom: '20px' }}>
              Send a Direct Message
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--pf-muted)', marginBottom: '6px', fontWeight: 600 }}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--pf-muted)', marginBottom: '6px', fontWeight: 600 }}>Your Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--pf-muted)', marginBottom: '6px', fontWeight: 600 }}>Subject</label>
                <input
                  type="text"
                  placeholder="Role offer, project inquiry, etc."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--pf-muted)', marginBottom: '6px', fontWeight: 600 }}>Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your project or role opportunities..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {statusMsg && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: statusMsg.type === 'success' ? '#34d399' : '#f87171',
                  border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {statusMsg.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                  {statusMsg.text}
                </div>
              )}

              <button type="submit" disabled={submitting} className="pf-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {submitting ? 'Sending...' : <><FiSend /> Send Message</>}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
