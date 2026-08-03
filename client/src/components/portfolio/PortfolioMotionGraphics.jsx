import React, { useState } from 'react';
import { FiFilm, FiPlay, FiX, FiClock, FiUserCheck, FiLayers } from 'react-icons/fi';

const MOTION_WORK = [
  {
    id: 'mg-1',
    title: 'Brand Commercial & Kinetic Typography Reel',
    category: 'Commercial Motion',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Embed preview
    software: ['After Effects', 'Illustrator', 'Audition'],
    duration: '0:45',
    role: 'Motion Graphics Artist & Designer',
    desc: 'Dynamic promo spot featuring kinetic text sync, fluid shape transitions, and high-frequency sound design built for commercial marketing.'
  },
  {
    id: 'mg-2',
    title: '3D Cyberpunk Logo Reveal Animation',
    category: 'Logo Animation',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    software: ['After Effects', 'Element 3D', 'Photoshop'],
    duration: '0:15',
    role: '3D Motion Animator',
    desc: 'Futuristic logo reveal with chromatic aberration, neon glow passes, and particle dispersion effects.'
  },
  {
    id: 'mg-3',
    title: 'Product UI & Infographics Motion Breakdown',
    category: 'Explainer & UI',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    software: ['After Effects', 'Premiere Pro'],
    duration: '1:12',
    role: 'UI Motion Specialist',
    desc: 'Sleek dashboard UI walkthrough animation highlighting key metric graphs and app interaction micro-animations.'
  }
];

export default function PortfolioMotionGraphics() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id="motion-graphics" style={{ padding: '100px 24px', background: 'rgba(5, 8, 22, 0.4)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pf-badge pf-badge-purple" style={{ marginBottom: '12px' }}>
            <FiFilm size={12} /> Post-Production Showcase
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            Motion <span className="pf-text-gradient">Graphics Gallery</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            High-impact 2D/3D motion design, brand promos, kinetic typography, and UI walkthroughs.
          </p>
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {MOTION_WORK.map((item) => (
            <div 
              key={item.id} 
              className="pf-card" 
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Thumbnail Container with Play Overlay */}
              <div 
                style={{ position: 'relative', height: '220px', cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => setActiveVideo(item)}
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="pf-project-img"
                />
                
                {/* Play Overlay Icon */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(5, 8, 22, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }} className="pf-play-overlay">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00A3FF, #00E5FF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#050816',
                    boxShadow: '0 0 25px rgba(0, 229, 255, 0.6)'
                  }}>
                    <FiPlay size={24} style={{ marginLeft: '4px' }} />
                  </div>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                  <span className="pf-badge" style={{ background: 'rgba(5, 8, 22, 0.8)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                    <FiClock size={12} /> {item.duration}
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="portfolio-heading" style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--pf-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUserCheck style={{ color: '#00E5FF' }} /> <strong>Role:</strong> {item.role}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <FiLayers style={{ color: '#7C3AED' }} /> <strong>Software:</strong>
                    {item.software.map((s, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: '#fff' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="pf-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="pf-modal-content" style={{ maxWidth: '840px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
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
                fontWeight: 700,
                boxShadow: '0 0 15px rgba(0, 163, 255, 0.6)'
              }}
            >
              <FiX size={20} />
            </button>

            <h3 className="portfolio-heading" style={{ fontSize: '22px', color: '#fff', marginBottom: '16px' }}>
              {activeVideo.title}
            </h3>

            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px' }}>
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
