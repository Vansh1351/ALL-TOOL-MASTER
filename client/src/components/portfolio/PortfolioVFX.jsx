import React, { useState, useRef } from 'react';
import { FiLayers, FiSliders, FiCheckCircle, FiCompass } from 'react-icons/fi';

const VFX_ITEMS = [
  {
    id: 'vfx-1',
    title: 'Rotoscoping & Green Screen Clean-Up',
    category: 'Rotoscoping & Keying',
    beforeImg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    software: 'Silhouette FX & Foundry Nuke',
    desc: 'High-precision hairline rotoscoping, green screen spill suppression, and multi-pass alpha matting.'
  },
  {
    id: 'vfx-2',
    title: '3D Camera Tracking & Environment Insertion',
    category: 'Matchmoving & Compositing',
    beforeImg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop',
    software: 'Autodesk Maya & Nuke',
    desc: '3D point-cloud camera tracking, projection mapping, depth-pass blur, and shadow layer integration.'
  }
];

function BeforeAfterSlider({ beforeImg, afterImg, title }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPos(pos);
  };

  const onMouseDown = () => { isDragging.current = true; };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseMove = (e) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const onTouchMove = (e) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      ref={containerRef}
      className="vfx-slider-container"
      style={{ height: '320px', position: 'relative', cursor: 'ew-resize' }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* After Image (Full Base) */}
      <img 
        src={afterImg} 
        alt={`${title} - VFX Rendered`} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      
      {/* Label After */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(0, 163, 255, 0.85)',
        color: '#050816',
        fontWeight: 800,
        fontSize: '11px',
        padding: '4px 10px',
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)'
      }}>
        AFTER (VFX)
      </div>

      {/* Before Image (Clipped Overlay) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: `${sliderPos}%`,
        overflow: 'hidden'
      }}>
        <img 
          src={beforeImg} 
          alt={`${title} - Raw Footage`} 
          style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%', height: '100%', objectFit: 'cover', maxWidth: 'none' }}
        />
        {/* Label Before */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(124, 58, 237, 0.85)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '11px',
          padding: '4px 10px',
          borderRadius: '6px',
          fontFamily: 'var(--font-mono)'
        }}>
          BEFORE (RAW)
        </div>
      </div>

      {/* Divider Handle */}
      <div className="vfx-slider-handle" style={{ left: `${sliderPos}%` }}>
        <div className="vfx-slider-button">
          <FiSliders size={16} />
        </div>
      </div>
    </div>
  );
}

export default function PortfolioVFX() {
  return (
    <section id="vfx" style={{ padding: '100px 24px', background: 'rgba(5, 8, 22, 0.4)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pf-badge pf-badge-purple" style={{ marginBottom: '12px' }}>
            <FiLayers size={12} /> Visual Effects & Compositing
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            VFX <span className="pf-text-gradient">Breakdowns</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Drag the split-screen slider to compare raw production plates against final CGI composited renders.
          </p>
        </div>

        {/* VFX Sliders Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '36px'
        }}>
          {VFX_ITEMS.map((vfx) => (
            <div key={vfx.id} className="pf-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <BeforeAfterSlider 
                beforeImg={vfx.beforeImg}
                afterImg={vfx.afterImg}
                title={vfx.title}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 className="portfolio-heading" style={{ fontSize: '20px', color: '#fff' }}>{vfx.title}</h3>
                  <span className="pf-badge pf-badge-cyan">{vfx.category}</span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                  {vfx.desc}
                </p>

                <div style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiCompass /> <strong>Software Stack:</strong> {vfx.software}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
