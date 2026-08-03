import React, { useState } from 'react';
import { FiAward, FiEye, FiX, FiCheckCircle } from 'react-icons/fi';

const CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Certified Motion & Video Editing Professional',
    issuer: 'Arena Animation & Creative Media',
    category: 'Arena',
    date: '2024',
    img: 'https://images.unsplash.com/photo-1589330694653-aded6fac7716?q=80&w=1000&auto=format&fit=crop',
    desc: 'Advanced certification in Premiere Pro, After Effects, Maya 3D, Nuke, and compositing.'
  },
  {
    id: 'cert-2',
    title: 'Adobe Certified Professional - Digital Media',
    issuer: 'Adobe Certification Institute',
    category: 'Adobe',
    date: '2023',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    desc: 'Verified mastery in vector graphics, video post-production, visual layout, and digital design.'
  },
  {
    id: 'cert-3',
    title: 'Full Stack & Generative AI Engineering',
    issuer: 'AI Development Academy',
    category: 'AI',
    date: '2024',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    desc: 'Specialized credentials in LLM integration, prompt engineering, agentic pipelines, and REST APIs.'
  },
  {
    id: 'cert-4',
    title: 'National Web & Hackathon Competition',
    issuer: 'Tech Innovation Summit',
    category: 'Competitions',
    date: '2023',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop',
    desc: 'First place honors for building high-performance interactive web tools and accessible UI components.'
  }
];

export default function PortfolioCertificates() {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section id="certificates" style={{ padding: '100px 24px', background: 'rgba(5, 8, 22, 0.4)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pf-badge pf-badge-purple" style={{ marginBottom: '12px' }}>
            <FiAward size={12} /> Recognized Credentials
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            Certificates & <span className="pf-text-gradient">Honors</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Official industry certifications, competition awards, and academic accomplishments.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {CERTIFICATES.map(cert => (
            <div 
              key={cert.id} 
              className="pf-card" 
              style={{ overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedCert(cert)}
            >
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img 
                  src={cert.img} 
                  alt={cert.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="pf-project-img"
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className="pf-badge pf-badge-cyan">{cert.category}</span>
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <h3 className="portfolio-heading" style={{ fontSize: '17px', color: '#fff', marginBottom: '6px' }}>
                  {cert.title}
                </h3>
                <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600, marginBottom: '8px' }}>
                  {cert.issuer} • {cert.date}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--pf-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {cert.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#00E5FF', fontWeight: 700 }}>
                  <FiEye /> View Certificate
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal View */}
      {selectedCert && (
        <div className="pf-modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="pf-modal-content" style={{ maxWidth: '700px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedCert(null)}
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                background: '#00A3FF',
                border: 'none',
                color: '#050816',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              <FiX size={20} />
            </button>

            <img 
              src={selectedCert.img} 
              alt={selectedCert.title} 
              style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }}
            />

            <h3 className="portfolio-heading" style={{ fontSize: '22px', color: '#fff', marginBottom: '6px' }}>
              {selectedCert.title}
            </h3>
            <p style={{ color: '#7C3AED', fontWeight: 700, marginBottom: '12px' }}>
              Issued by {selectedCert.issuer} ({selectedCert.date})
            </p>
            <p style={{ color: 'var(--pf-muted)', fontSize: '14px', lineHeight: 1.6 }}>
              {selectedCert.desc}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
