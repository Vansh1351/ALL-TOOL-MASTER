import React, { useState, useRef, useEffect } from 'react';
import {
  FiArrowLeft, FiCamera, FiDownload, FiZap, FiSliders, FiMousePointer, FiTrash2, FiRefreshCw
} from 'react-icons/fi';

export default function WatermarkRemover({ tool, setView, setActiveTool, navigate, addToast }) {
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [mode, setMode] = useState('auto'); // auto, manual
  const [toolType, setToolType] = useState('brush'); // brush, rect, eraser
  const [brushSize, setBrushSize] = useState(24);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState(-1); // -1 = not scanning

  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const originalImageRef = useRef(null);

  // Simulated AI detected bounding boxes (percentage coords)
  const [detectedRegions, setDetectedRegions] = useState([
    { id: 1, type: 'Timestamp', x: 70, y: 85, w: 22, h: 6, selected: true },
    { id: 2, type: 'Logo / Icon', x: 10, y: 10, w: 12, h: 12, selected: true },
    { id: 3, type: 'Text Overlay', x: 30, y: 45, w: 40, h: 8, selected: false }
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setImage(img);
        setImageSize({ w: img.width, h: img.height });
        addToast('Image uploaded successfully!', 'success');
        // Reset regions selection
        setDetectedRegions(prev => prev.map(r => ({ ...r, selected: true })));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawWorkspace = () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');

    // Match mask canvas sizes
    if (maskCanvas.width !== canvas.width || maskCanvas.height !== canvas.height) {
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
    }

    // Clear and draw original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Apply manual masking overlays (translucent red)
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.restore();

    // Draw Auto Bounding Boxes if in auto mode
    if (mode === 'auto' && scanProgress === -1) {
      detectedRegions.forEach(r => {
        const rx = (r.x / 100) * canvas.width;
        const ry = (r.y / 100) * canvas.height;
        const rw = (r.w / 100) * canvas.width;
        const rh = (r.h / 100) * canvas.height;

        ctx.strokeStyle = r.selected ? 'rgba(239, 68, 68, 0.95)' : 'rgba(6, 182, 212, 0.6)';
        ctx.fillStyle = r.selected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.05)';
        ctx.lineWidth = r.selected ? 3 : 1.5;
        
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);

        // Label
        ctx.fillStyle = r.selected ? '#ef4444' : '#06b6d4';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(r.type, rx + 4, ry - 4);
      });
    }

    // If scanning, draw visual laser line
    if (scanProgress >= 0 && scanProgress <= 100) {
      const laserY = (scanProgress / 100) * canvas.height;
      const grad = ctx.createLinearGradient(0, laserY - 15, 0, laserY);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, laserY - 15, canvas.width, 15);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, laserY);
      ctx.lineTo(canvas.width, laserY);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawWorkspace();
  }, [image, mode, toolType, brushSize, detectedRegions, scanProgress]);

  // Start manual painting drawing state
  const handleMouseDown = (e) => {
    if (mode !== 'manual' || !image) return;
    setIsDrawing(true);
    drawMask(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    drawMask(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawMask = (e) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';

    if (toolType === 'brush') {
      maskCtx.fillStyle = 'red';
      maskCtx.strokeStyle = 'red';
      maskCtx.lineWidth = brushSize;
      
      maskCtx.beginPath();
      maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      maskCtx.fill();
    } else if (toolType === 'eraser') {
      maskCtx.save();
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.lineWidth = brushSize;
      
      maskCtx.beginPath();
      maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();
    }

    drawWorkspace();
  };

  // Simulated automatic AI Scanning
  const triggerAutoScan = () => {
    if (!image) return;
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          addToast('AI Scanning completed! 3 zones identified.', 'success');
          return -1;
        }
        return p + 4;
      });
    }, 60);
  };

  useEffect(() => {
    if (image && mode === 'auto') {
      triggerAutoScan();
    }
  }, [image, mode]);

  const toggleRegion = (id) => {
    setDetectedRegions(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  // Perform Content-Aware Inpainting Client-Side
  const handleRemove = () => {
    if (!image) return;
    setProcessing(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');

      const width = canvas.width;
      const height = canvas.height;

      // Extract mask regions
      const imgData = ctx.getImageData(0, 0, width, height);
      const maskImgData = maskCtx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      const maskPixels = maskImgData.data;

      // Create a set of marked pixels (both manual & auto selected regions)
      const toRemove = new Uint8Array(width * height);

      // 1. Process manual mask pixels (non-zero alpha in mask canvas)
      for (let i = 0; i < pixels.length; i += 4) {
        const alpha = maskPixels[i + 3];
        if (alpha > 50) {
          toRemove[i / 4] = 1;
        }
      }

      // 2. Process automatic selected bounding boxes
      if (mode === 'auto') {
        detectedRegions.forEach(r => {
          if (!r.selected) return;
          const rx1 = Math.round((r.x / 100) * width);
          const ry1 = Math.round((r.y / 100) * height);
          const rx2 = Math.round(((r.x + r.w) / 100) * width);
          const ry2 = Math.round(((r.y + r.h) / 100) * height);

          for (let y = ry1; y < ry2; y++) {
            for (let x = rx1; x < rx2; x++) {
              if (x >= 0 && x < width && y >= 0 && y < height) {
                toRemove[y * width + x] = 1;
              }
            }
          }
        });
      }

      // Inpainting algorithm: Bilateral box interpolation
      // Loop multiple passes to grow inward from healthy boundaries
      const passes = 3;
      const radius = 6;
      for (let pass = 0; pass < passes; pass++) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (toRemove[idx] === 1) {
              let rSum = 0, gSum = 0, bSum = 0, count = 0;
              
              // Sample surrounding pixels
              for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                  const ny = y + dy;
                  const nx = x + dx;
                  if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                    const nIdx = ny * width + nx;
                    if (toRemove[nIdx] === 0) {
                      rSum += pixels[nIdx * 4];
                      gSum += pixels[nIdx * 4 + 1];
                      bSum += pixels[nIdx * 4 + 2];
                      count++;
                    }
                  }
                }
              }

              if (count > 0) {
                pixels[idx * 4] = rSum / count + (Math.random() - 0.5) * 4;
                pixels[idx * 4 + 1] = gSum / count + (Math.random() - 0.5) * 4;
                pixels[idx * 4 + 2] = bSum / count + (Math.random() - 0.5) * 4;
                // Leave alpha intact
              }
            }
          }
        }
      }

      // Commit back to canvas
      ctx.putImageData(imgData, 0, 0);

      // Create new clean image source
      const cleanImg = new Image();
      cleanImg.onload = () => {
        setImage(cleanImg);
        // Clear mask canvas
        maskCtx.clearRect(0, 0, width, height);
        // Clear auto zones
        setDetectedRegions([]);
        setProcessing(false);
        addToast('Watermark removed successfully!', 'success');
      };
      cleanImg.src = canvas.toDataURL();

    }, 1200);
  };

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`);
    link.download = `cleaned_photo.${format}`;
    link.click();
    addToast(`Cleaned photo downloaded as ${format.toUpperCase()}!`, 'success');
  };

  const resetAll = () => {
    if (originalImageRef.current) {
      setImage(originalImageRef.current);
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        maskCanvas.getContext('2d').clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
      setDetectedRegions([
        { id: 1, type: 'Timestamp', x: 70, y: 85, w: 22, h: 6, selected: true },
        { id: 2, type: 'Logo / Icon', x: 10, y: 10, w: 12, h: 12, selected: true },
        { id: 3, type: 'Text Overlay', x: 30, y: 45, w: 40, h: 8, selected: false }
      ]);
      addToast('Reset to original image.', 'info');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 0 80px 0' }}>
      {/* Back button */}
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
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(59,130,246,0.35)'
        }}>
          <FiCamera />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          AI Watermark <span className="text-gradient">Cleanup</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Automatically detect or manually brush over watermarks, timestamps, and logos to wipe them clean instantly.
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
            <FiCamera size={48} style={{ color: '#3b82f6', marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Upload Image</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Supports JPG, PNG, WEBP, or HEIC (Max 50MB)</p>
          </div>
        </div>
      ) : (
        /* Editor Workspace */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
          
          {/* Visual Workspace Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            
            {/* Editor Canvas Container */}
            <div className="glass-panel" style={{
              position: 'relative', padding: '16px', borderRadius: '24px', width: '100%',
              display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)'
            }}>
              {processing && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.75)', borderRadius: '24px', zIndex: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px'
                }}>
                  <div style={{
                    width: '44px', height: '44px', border: '3px solid #3b82f6', borderTopColor: 'transparent',
                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>AI Inpainting &amp; Reconstructing...</span>
                </div>
              )}

              <div style={{ position: 'relative', maxWidth: '100%' }}>
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={420}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    borderRadius: '16px', width: '100%', height: 'auto', display: 'block', cursor: 'crosshair',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                />
                <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={handleRemove} style={{ background: '#3b82f6', borderColor: '#3b82f6', minWidth: '160px' }}>
                <FiZap style={{ marginRight: '6px' }} /> Remove Overlays
              </button>
              <button className="btn btn-secondary" onClick={resetAll}>
                <FiRefreshCw style={{ marginRight: '6px' }} /> Reset
              </button>
            </div>
          </div>

          {/* Settings Control Panel */}
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#3b82f6' }}>Cleanup Panel</h3>
            
            {/* Mode selection */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setMode('auto')}
                className={`btn ${mode === 'auto' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, background: mode === 'auto' ? '#3b82f6' : 'transparent', borderColor: '#3b82f6' }}
              >
                Auto AI Detection
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, background: mode === 'manual' ? '#3b82f6' : 'transparent', borderColor: '#3b82f6' }}
              >
                Manual Eraser
              </button>
            </div>

            {mode === 'auto' ? (
              /* Auto Mode detected regions */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>DETECTED REGIONS</span>
                {detectedRegions.length === 0 ? (
                  <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    No watermark overlays detected in frame.
                  </div>
                ) : (
                  detectedRegions.map(r => (
                    <div
                      key={r.id}
                      onClick={() => toggleRegion(r.id)}
                      style={{
                        padding: '12px 16px', borderRadius: '12px', border: `1px solid ${r.selected ? '#3b82f6' : 'var(--border-color)'}`,
                        background: r.selected ? 'rgba(59, 130, 246, 0.08)' : 'transparent', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>{r.type}</span>
                      <span style={{ fontSize: '11px', color: r.selected ? '#3b82f6' : 'var(--text-muted)' }}>
                        {r.selected ? 'Selected' : 'Ignored'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Manual brush tools */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setToolType('brush')}
                    className={`btn ${toolType === 'brush' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, background: toolType === 'brush' ? '#3b82f6' : 'transparent', borderColor: '#3b82f6' }}
                  >
                    Brush Paint
                  </button>
                  <button
                    onClick={() => setToolType('eraser')}
                    className={`btn ${toolType === 'eraser' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, background: toolType === 'eraser' ? '#3b82f6' : 'transparent', borderColor: '#3b82f6' }}
                  >
                    Mask Eraser
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    <span>BRUSH SIZE</span>
                    <span>{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    value={brushSize}
                    onChange={e => setBrushSize(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#3b82f6' }}
                  />
                </div>
              </div>
            )}

            {/* Export options */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>DOWNLOAD FILE</span>
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
