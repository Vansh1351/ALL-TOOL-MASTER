import React, { useState, useRef, useEffect } from 'react';
import {
  FiArrowLeft, FiGrid, FiDownload, FiZap, FiUpload, FiRefreshCw, FiPlus, FiTrash2
} from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

const FONTS = ['Impact, Arial Black', 'sans-serif', 'monospace', 'serif', 'cursive'];
const COLORS = ['#ffffff', '#facc15', '#f43f5e', '#38bdf8', '#4ade80'];

const TEMPLATES = [
  { id: 'tutorial', name: 'Tutorial Style', bg: 'linear-gradient(135deg, #1e1b4b, #311042)', text: 'AI UTILS', badge: '100% FREE' },
  { id: 'review', name: 'Product Review', bg: 'linear-gradient(135deg, #062f4f, #000000)', text: 'HONEST REVIEW', badge: 'MUST WATCH' },
  { id: 'vlog', name: 'Vlog Lifestyle', bg: 'linear-gradient(135deg, #f43f5e, #ca8a04)', text: 'MY STORY', badge: 'DAILY VLOG' },
  { id: 'gaming', name: 'Gaming VS', bg: 'linear-gradient(135deg, #09090b, #3b0764)', text: 'CHAMPIONS VS PRO', badge: 'LIVE GAME' }
];

export default function ThumbnailMaker({ tool, setView, setActiveTool, navigate, addToast }) {
  const [bgImage, setBgImage] = useState(null);
  const [bgGradientIdx, setBgGradientIdx] = useState(0);
  const [templateId, setTemplateId] = useState('tutorial');
  const [badgeText, setBadgeText] = useState('100% FREE');

  const [textLayers, setTextLayers] = useState([
    { id: 1, text: 'HOW TO MAKE', size: 54, color: '#ffffff', strokeColor: '#000000', strokeWidth: 8, font: 'Impact, Arial Black', x: 80, y: 160 },
    { id: 2, text: 'YT THUMBNAILS', size: 68, color: '#facc15', strokeColor: '#000000', strokeWidth: 10, font: 'Impact, Arial Black', x: 80, y: 250 },
    { id: 3, text: 'WITH AI IN SECONDS', size: 36, color: '#38bdf8', strokeColor: '#000000', strokeWidth: 6, font: 'Impact, Arial Black', x: 80, y: 320 }
  ]);

  const [selectedLayerId, setSelectedLayerId] = useState(1);
  const canvasRef = useRef(null);

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBgImage(img);
        addToast('Background image loaded!', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Draw Background
    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, w, h);
    } else {
      const activeTemplate = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
      const grad = ctx.createLinearGradient(0, 0, w, h);
      if (activeTemplate.id === 'tutorial') {
        grad.addColorStop(0, '#1e1b4b'); grad.addColorStop(1, '#311042');
      } else if (activeTemplate.id === 'review') {
        grad.addColorStop(0, '#062f4f'); grad.addColorStop(1, '#000000');
      } else if (activeTemplate.id === 'vlog') {
        grad.addColorStop(0, '#f43f5e'); grad.addColorStop(1, '#ca8a04');
      } else {
        grad.addColorStop(0, '#09090b'); grad.addColorStop(1, '#3b0764');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Draw Overlay shapes for layout presets
    if (templateId === 'tutorial' || templateId === 'gaming') {
      // Draw neon side glow frames
      ctx.strokeStyle = 'rgba(6,182,212,0.4)';
      ctx.lineWidth = 14;
      ctx.strokeRect(10, 10, w - 20, h - 20);
    }

    // Draw badge tag overlay
    if (badgeText) {
      ctx.save();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(80, 50, 150, 40, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText.toUpperCase(), 155, 76);
      ctx.restore();
    }

    // Draw Text Layers
    textLayers.forEach(layer => {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.font = `bold ${layer.size}px ${layer.font}`;

      // Text Stroke Outline (crucial for YouTube thumbnails)
      ctx.strokeStyle = layer.strokeColor;
      ctx.lineWidth = layer.strokeWidth;
      ctx.lineJoin = 'round';
      ctx.strokeText(layer.text, layer.x, layer.y);

      // Text Fill
      ctx.fillStyle = layer.color;
      ctx.fillText(layer.text, layer.x, layer.y);
      
      // Shadow layer
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      ctx.restore();
    });
  };

  useEffect(() => {
    drawThumbnail();
  }, [bgImage, templateId, badgeText, textLayers]);

  const addTextLayer = () => {
    const newId = textLayers.length > 0 ? Math.max(...textLayers.map(l => l.id)) + 1 : 1;
    const newLayer = {
      id: newId,
      text: 'NEW LAYER',
      size: 42,
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 6,
      font: 'Impact, Arial Black',
      x: 100,
      y: 100 + newId * 40
    };
    setTextLayers([...textLayers, newLayer]);
    setSelectedLayerId(newId);
    addToast('Text layer added!', 'success');
  };

  const removeTextLayer = (id) => {
    setTextLayers(textLayers.filter(l => l.id !== id));
    addToast('Text layer removed.', 'info');
  };

  const updateSelectedLayer = (key, val) => {
    setTextLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, [key]: val } : l));
  };

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`);
    link.download = `youtube_thumbnail.${format}`;
    link.click();
    addToast(`Cover downloaded as ${format.toUpperCase()}!`, 'success');
  };

  const handleTemplateChange = (tid) => {
    setTemplateId(tid);
    const tmpl = TEMPLATES.find(t => t.id === tid);
    if (tmpl) {
      setBadgeText(tmpl.badge);
      updateSelectedLayer('text', tmpl.text);
    }
  };

  const selLayer = textLayers.find(l => l.id === selectedLayerId);

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 0 80px 0' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => { setView('dashboard'); setActiveTool(null); }}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(239,68,68,0.35)'
        }}>
          <FiGrid />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          YouTube Thumbnail <span className="text-gradient">Maker</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Design eye-catching YouTube thumbnail covers with high-contrast text outlines and gradients.
        </p>
      </div>

      {/* Canva Affiliate Hook (Temporarily Hidden) */}
      {false && (
      <div className="glass-panel" style={{
        padding: '16px 24px', borderRadius: '14px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Need advanced assets, face cutout grids, or custom layout elements? <strong style={{ color: 'var(--text-main)' }}>Explore Canva Pro.</strong> Elevate your channel branding.
        </div>
        <a href={AFFILIATE_LINKS.canva || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00c4cc', borderColor: '#00c4cc', fontSize: '12.5px', padding: '8px 16px' }}>
          Open Canva Pro
        </a>
      </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
        
        {/* Left Form */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#ef4444' }}>Workspace Editor</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Cover Template Style</label>
              <select className="select-field" value={templateId} onChange={e => handleTemplateChange(e.target.value)}>
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Badge Banner Text</label>
              <input type="text" className="input-field" value={badgeText} onChange={e => setBadgeText(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Custom Background Image</label>
            <div className="glass-panel" style={{ padding: '16px', border: '2px dashed var(--border-color)', position: 'relative', textAlign: 'center' }}>
              <input type="file" accept="image/*" onChange={handleBgUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <FiUpload size={18} style={{ color: '#ef4444', marginBottom: '4px' }} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Supports JPG/PNG uploads (1280x720 recommended)</div>
            </div>
          </div>

          {/* Text layer selectors */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Text Layer Blocks</span>
              <button className="btn btn-secondary" onClick={addTextLayer} style={{ fontSize: '11px', padding: '4px 10px', height: '28px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiPlus /> Add Text
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {textLayers.map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLayerId(l.id)}
                  className={`btn ${selectedLayerId === l.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '11px', padding: '6px 12px', height: '30px',
                    background: selectedLayerId === l.id ? '#ef4444' : 'transparent',
                    borderColor: '#ef4444'
                  }}
                >
                  Layer {l.id}
                </button>
              ))}
            </div>

            {selLayer && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>LAYER TEXT CONTENT</label>
                  <input type="text" className="input-field" value={selLayer.text} onChange={e => updateSelectedLayer('text', e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>FONT FAMILY</label>
                    <select className="select-field" value={selLayer.font} onChange={e => updateSelectedLayer('font', e.target.value)}>
                      {FONTS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>TEXT COLOR</label>
                    <select className="select-field" value={selLayer.color} onChange={e => updateSelectedLayer('color', e.target.value)}>
                      {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>FONT SIZE ({selLayer.size}px)</label>
                    <input type="range" min="16" max="100" value={selLayer.size} onChange={e => updateSelectedLayer('size', parseInt(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>OUTLINE STROKE ({selLayer.strokeWidth}px)</label>
                    <input type="range" min="0" max="20" value={selLayer.strokeWidth} onChange={e => updateSelectedLayer('strokeWidth', parseInt(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>POSITION X</label>
                    <input type="range" min="0" max="800" value={selLayer.x} onChange={e => updateSelectedLayer('x', parseInt(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>POSITION Y</label>
                    <input type="range" min="0" max="600" value={selLayer.y} onChange={e => updateSelectedLayer('y', parseInt(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
                  </div>
                </div>

                <button className="btn btn-secondary" onClick={() => removeTextLayer(selectedLayerId)} style={{ color: '#ef4444', borderColor: '#ef4444', height: '34px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <FiTrash2 /> Remove Layer
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          
          <div className="glass-panel" style={{
            padding: '16px', borderRadius: '24px', background: 'rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)', width: '100%', maxWidth: '480px',
            display: 'flex', justifyContent: 'center'
          }}>
            <canvas
              ref={canvasRef}
              width={1280} // YT Standard Width
              height={720} // YT Standard Height
              style={{
                borderRadius: '12px', width: '100%', height: 'auto', display: 'block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '480px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('png')}>Export as PNG</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('jpg')}>Export as JPG</button>
          </div>

        </div>
      </div>
    </div>
  );
}
