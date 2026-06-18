import React, { useState, useRef, useEffect } from 'react';
import {
  FiArrowLeft, FiScissors, FiDownload, FiZap, FiUpload, FiRefreshCw
} from 'react-icons/fi';

const PRESET_GRADIENTS = [
  { name: 'Teal Lagoon', val: 'linear-gradient(135deg, #14b8a6, #06b6d4)' },
  { name: 'Sunset Glow', val: 'linear-gradient(135deg, #f97316, #ec4899)' },
  { name: 'Midnight', val: 'linear-gradient(135deg, #0f172a, #1e3a8a)' },
  { name: 'Royal Gold', val: 'linear-gradient(135deg, #78350f, #ca8a04)' },
  { name: 'Emerald Forest', val: 'linear-gradient(135deg, #064e3b, #10b981)' }
];

export default function BackgroundRemover({ tool, setView, setActiveTool, navigate, addToast }) {
  const [image, setImage] = useState(null);
  const [cutoutImage, setCutoutImage] = useState(null);
  const [bgType, setBgType] = useState('transparent'); // transparent, color, gradient, custom
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [selectedGradient, setSelectedGradient] = useState(PRESET_GRADIENTS[0].val);
  const [customBg, setCustomBg] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState(-1);

  const canvasRef = useRef(null);
  const originalImageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setImage(img);
        setCutoutImage(null);
        addToast('Photo uploaded!', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCustomBgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setCustomBg(img);
        setBgType('custom');
        addToast('Custom background loaded.', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Run AI-simulated background isolation
  const handleRemoveBackground = () => {
    if (!image) return;
    setProcessing(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          
          // Perform client-side color-difference transparency keying
          // This isolates background from typical portrait/product backgrounds (e.g. solid white or green-screen,
          // or thresholding corners to build a quick alpha mask)
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Sample corner pixels to guess background color (e.g., top-left)
          const rBg = data[0];
          const gBg = data[1];
          const bBg = data[2];

          // Thresholding loop to make background transparent
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            
            // Calculate Euclidean distance in RGB space
            const dist = Math.sqrt((r - rBg)**2 + (g - gBg)**2 + (b - bBg)**2);
            if (dist < 80) { // Background match threshold
              data[i+3] = 0; // Set alpha to 0
            } else {
              // Add slight smoothing/feathering near the edges
              if (dist < 110) {
                const alpha = ((dist - 80) / 30) * 255;
                data[i+3] = Math.min(data[i+3], alpha);
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);

          const cutout = new Image();
          cutout.onload = () => {
            setCutoutImage(cutout);
            setProcessing(false);
            setScanProgress(-1);
            addToast('Background removed!', 'success');
          };
          cutout.src = canvas.toDataURL();
          
          return -1;
        }
        return p + 10;
      });
    }, 150);
  };

  // Render composite canvas workspace
  const drawWorkspace = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const activeImage = cutoutImage || image;
    if (!activeImage) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background layers ONLY if background was removed (cutout is active)
    if (cutoutImage) {
      if (bgType === 'transparent') {
        // Draw standard checkered transparency board
        const size = 16;
        for (let y = 0; y < canvas.height; y += size) {
          for (let x = 0; x < canvas.width; x += size) {
            ctx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#1f2937' : '#111827';
            ctx.fillRect(x, y, size, size);
          }
        }
      } else if (bgType === 'color') {
        ctx.fillStyle = solidColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (selectedGradient === PRESET_GRADIENTS[0].val) {
          grad.addColorStop(0, '#14b8a6'); grad.addColorStop(1, '#06b6d4');
        } else if (selectedGradient === PRESET_GRADIENTS[1].val) {
          grad.addColorStop(0, '#f97316'); grad.addColorStop(1, '#ec4899');
        } else if (selectedGradient === PRESET_GRADIENTS[2].val) {
          grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e3a8a');
        } else if (selectedGradient === PRESET_GRADIENTS[3].val) {
          grad.addColorStop(0, '#78350f'); grad.addColorStop(1, '#ca8a04');
        } else {
          grad.addColorStop(0, '#064e3b'); grad.addColorStop(1, '#10b981');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === 'custom' && customBg) {
        ctx.drawImage(customBg, 0, 0, canvas.width, canvas.height);
      }
    }

    // Draw main isolated cutout (or original image)
    ctx.drawImage(activeImage, 0, 0, canvas.width, canvas.height);

    // Draw scanning laser line
    if (scanProgress >= 0 && scanProgress <= 100) {
      const laserY = (scanProgress / 100) * canvas.height;
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, laserY);
      ctx.lineTo(canvas.width, laserY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
      ctx.fillRect(0, 0, canvas.width, laserY);
    }
  };

  useEffect(() => {
    drawWorkspace();
  }, [image, cutoutImage, bgType, solidColor, selectedGradient, customBg, scanProgress]);

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`);
    link.download = `background_removed.${format}`;
    link.click();
    addToast(`Isolated cutout exported as ${format.toUpperCase()}`, 'success');
  };

  const handleReset = () => {
    setCutoutImage(null);
    setCustomBg(null);
    setBgType('transparent');
    addToast('Cutout reset to original.', 'info');
  };

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
          background: 'linear-gradient(135deg, #ec4899, #be185d)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(236,72,153,0.35)'
        }}>
          <FiScissors />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          AI Background <span className="text-gradient">Remover</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Instantly erase backdrops to save transparent PNG cutouts, or swap them for stunning gradients and custom scenes.
        </p>
      </div>

      {!image ? (
        /* Upload Area */
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-panel" style={{
            padding: '60px 40px', borderRadius: '24px', textAlign: 'center',
            border: '2px dashed var(--border-color)', background: 'rgba(0,0,0,0.1)', cursor: 'pointer',
            position: 'relative'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
              }}
            />
            <FiScissors size={48} style={{ color: '#ec4899', marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Upload Portrait or Product Photo</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Supports JPG, PNG, WEBP (Max 50MB)</p>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
          
          {/* Canvas workspace */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <div className="glass-panel" style={{
              position: 'relative', padding: '16px', borderRadius: '24px', width: '100%',
              display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)'
            }}>
              <div style={{ position: 'relative', maxWidth: '100%' }}>
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={420}
                  style={{
                    borderRadius: '16px', width: '100%', height: 'auto', display: 'block',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
              {!cutoutImage ? (
                <button className="btn btn-primary" onClick={handleRemoveBackground} style={{ background: '#ec4899', borderColor: '#ec4899', minWidth: '180px' }} disabled={processing}>
                  <FiZap style={{ marginRight: '6px' }} /> Isolate Subject
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={handleReset}>
                  <FiRefreshCw style={{ marginRight: '6px' }} /> Reset Photo
                </button>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#ec4899' }}>Background Replacer</h3>
            
            {cutoutImage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* BG Type Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className={`btn ${bgType === 'transparent' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setBgType('transparent')} style={{ fontSize: '12px', background: bgType === 'transparent' ? '#ec4899' : 'transparent', borderColor: '#ec4899' }}>Transparent</button>
                  <button className={`btn ${bgType === 'color' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setBgType('color')} style={{ fontSize: '12px', background: bgType === 'color' ? '#ec4899' : 'transparent', borderColor: '#ec4899' }}>Solid Color</button>
                  <button className={`btn ${bgType === 'gradient' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setBgType('gradient')} style={{ fontSize: '12px', background: bgType === 'gradient' ? '#ec4899' : 'transparent', borderColor: '#ec4899' }}>Gradients</button>
                  <button className={`btn ${bgType === 'custom' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setBgType('custom')} style={{ fontSize: '12px', background: bgType === 'custom' ? '#ec4899' : 'transparent', borderColor: '#ec4899' }}>Custom Scene</button>
                </div>

                {bgType === 'color' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>PICK COLOR</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={solidColor}
                        onChange={e => setSolidColor(e.target.value)}
                        style={{ width: '48px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                      />
                      <input type="text" className="input-field" value={solidColor} readOnly style={{ fontSize: '13px' }} />
                    </div>
                  </div>
                )}

                {bgType === 'gradient' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>SELECT GRADIENT PRESET</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {PRESET_GRADIENTS.map(g => (
                        <button
                          key={g.name}
                          onClick={() => setSelectedGradient(g.val)}
                          style={{
                            padding: '10px', borderRadius: '10px', border: selectedGradient === g.val ? '2px solid #ec4899' : '1px solid var(--border-color)',
                            background: g.val, color: '#ffffff', fontSize: '12px', fontWeight: '800', cursor: 'pointer', textShadow: '0 1px 3px rgba(0,0,0,0.5)', textAlign: 'left'
                          }}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {bgType === 'custom' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>UPLOAD BACKDROP</label>
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', border: '2px dashed var(--border-color)', position: 'relative', textAlign: 'center' }}>
                      <input type="file" accept="image/*" onChange={handleCustomBgUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                      <FiUpload size={20} style={{ color: '#ec4899', marginBottom: '6px' }} />
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Choose background image</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '20px 10px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                💡 Click "Isolate Subject" to erase the background, then unlock replacements!
              </div>
            )}

            {/* Exports */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>DOWNLOAD CUTOUT</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ padding: '8px 0' }} onClick={() => handleDownload('png')}>PNG</button>
                <button className="btn btn-secondary" style={{ padding: '8px 0' }} onClick={() => handleDownload('jpg')}>JPG</button>
                <button className="btn btn-secondary" style={{ padding: '8px 0' }} onClick={() => handleDownload('webp')}>WEBP</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) { .tool-page-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
