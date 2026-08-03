import React, { useState } from 'react';
import { FiVideo, FiPlay, FiX, FiCheckCircle } from 'react-icons/fi';

const CATEGORIES = ['All', 'YouTube', 'Shorts', 'Corporate', 'Trailers', 'Reels'];

const EDITS_DATA = [
  {
    id: 've-1',
    title: 'High-Retention Tech YouTube Video Editing',
    category: 'YouTube',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    highlights: ['B-roll integration', 'Sound design & Foley', 'Custom lower thirds', 'Dynamic pacing']
  },
  {
    id: 've-2',
    title: 'Viral Instagram Reel & TikTok Edit',
    category: 'Shorts',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    highlights: ['Fast-paced cuts', 'Animated subtitles', 'Sound effects', 'Color boost']
  },
  {
    id: 've-3',
    title: 'Corporate Brand Story & Founder Interview',
    category: 'Corporate',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    highlights: ['Multi-cam sync', 'Cinematic LUT color grading', 'Audio noise cleanup', 'Lower thirds']
  },
  {
    id: 've-4',
    title: 'Cinematic Game & Product Teaser Trailer',
    category: 'Trailers',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    highlights: ['Epic soundtrack build-up', 'Glitch transitions', 'Title graphics', 'Impact sound FX']
  },
  {
    id: 've-5',
    title: 'Social Creator High-Energy Reel',
    category: 'Reels',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    highlights: ['Speed ramping', 'Beat matching', 'Zoom transitions', 'Trending audio sync']
  }
];

export default function PortfolioVideoEditing() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);

  const filteredEdits = activeCategory === 'All'
    ? EDITS_DATA
    : EDITS_DATA.filter(item => item.category === activeCategory);

  return (
    <section id="video-editing" style={{ padding: '100px 24px' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
            <FiVideo size={12} /> Post-Production Portfolio
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            Video Editing <span className="pf-text-gradient">Showcase</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Pacing, storytelling, sound design, and color grading tailored for max audience retention.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '48px'
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'pf-btn-primary' : 'pf-btn-secondary'}
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {filteredEdits.map((item) => (
            <div key={item.id} className="pf-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              <div 
                style={{ position: 'relative', height: '200px', cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => setActiveVideo(item)}
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="pf-project-img"
                />

                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(5, 8, 22, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#00A3FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#050816',
                    boxShadow: '0 0 20px rgba(0, 163, 255, 0.6)'
                  }}>
                    <FiPlay size={20} style={{ marginLeft: '3px' }} />
                  </div>
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className="pf-badge pf-badge-cyan">{item.category}</span>
                </div>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="portfolio-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>
                  {item.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.highlights.map((h, i) => (
                    <div key={i} style={{ fontSize: '12px', color: 'var(--pf-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiCheckCircle size={12} style={{ color: '#00E5FF' }} /> {h}
                    </div>
                  ))}
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
                fontWeight: 700
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
