import React, { useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiCheckCircle, FiLinkedin, FiYoutube, FiUser } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge">Get in Touch</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px' }}>
            We'd Love to Hear <span className="text-gradient">From You</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '15px' }}>
            Have a tool request, feedback, bug report, or business inquiry? Fill out the form or reach out directly.
          </p>
        </div>

        {/* Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '0.8fr 1.2fr',
          gap: '40px'
        }} className="contact-grid">
          
          {/* Info Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Contact Information</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-color)', fontSize: '18px' }}><FiUser /></div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Founder</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Vansh Shah</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-color)', fontSize: '18px' }}><FiMail /></div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Email</span>
                    <a href="mailto:vhshah1711@gmail.com" style={{ fontSize: '13px', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600' }}>
                      vhshah1711@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-color)', fontSize: '18px' }}><FiPhone /></div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Phone</span>
                    <a href="tel:+919820901789" style={{ fontSize: '13px', color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600' }}>
                      +91 98209 01789
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent-color)', fontSize: '18px' }}><FiMapPin /></div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Location</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Mumbai, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Connect With Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="https://www.linkedin.com/in/vansh-shah-824926291/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '10px', alignItems: 'center', textDecoration: 'none', color: 'var(--text-main)', fontSize: '13px', fontWeight: '600' }}>
                  <FiLinkedin style={{ color: '#0a66c2', fontSize: '18px' }} /> LinkedIn
                </a>
                <a href="https://www.youtube.com/@VANSHSHAH-india" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '10px', alignItems: 'center', textDecoration: 'none', color: 'var(--text-main)', fontSize: '13px', fontWeight: '600' }}>
                  <FiYoutube style={{ color: '#ff0000', fontSize: '18px' }} /> YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <FiCheckCircle size={56} style={{ color: '#10b981', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Message Sent Successfully!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                  Thank you for reaching out. A support coordinator will respond to your inquiry shortly.
                </p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Send a Message</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your Name"
                      className="input-field"
                      style={{ padding: '10px 14px', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="name@email.com"
                      className="input-field"
                      style={{ padding: '10px 14px', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="How can we help?"
                    className="input-field"
                    style={{ padding: '10px 14px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Type details..."
                    className="input-field"
                    style={{ padding: '10px 14px', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ height: '44px', marginTop: '10px' }}>
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
      <style>{`
        @media (max-width: 680px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
