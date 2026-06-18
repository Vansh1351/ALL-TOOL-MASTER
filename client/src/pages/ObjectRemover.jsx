import React, { useState, useRef, useEffect } from 'react';
import {
  FiArrowLeft, FiSliders, FiDownload, FiZap, FiTrash2, FiPlusCircle, FiRefreshCw
} from 'react-icons/fi';

export default function ObjectRemover({ tool, setView, setActiveTool, navigate, addToast }) {
  const [image, setImage] = useState(null);
  const [mode, setMode] = useState('manual'); // manual, auto
  const [toolType, setToolType] = useState('brush'); // brush, polygon, eraser
  const [brushSize, setBrushSize] = useState(28);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState(-1);
  const [polygonPoints, setPolygonPoints] = useState([]);

  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const originalImageRef = useRef(null);

  // Simulated AI detected objects
  const [detectedObjects, setDetectedObjects] = useState([
    { id: 1, name: 'Person (Photobomb)', x: 45, y: 30, w: 14, h: 48, selected: true },
    { id: 2, name: 'Sign Post', x: 15, y: 20, w: 8, h: 32, selected: false },
    { id: 3, name: 'Vehicle / Car', x: 75, y: 55, w: 20, h: 22, selected: true }
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
        setDetectedObjects(prev => prev.map(o => ({ ...o, selected: true })));
        addToast('Image uploaded successfully!', 'success');
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

    if (maskCanvas.width !== canvas.width || maskCanvas.height !== canvas.height) {
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw manual mask layers
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.restore();

    // Draw polygon connection lines
    if (polygonPoints.length > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) {
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }
      ctx.stroke();

      // Dot anchors
      polygonPoints.forEach(p => {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Auto Mode detected areas
    if (mode === 'auto' && scanProgress === -1) {
      detectedObjects.forEach(obj => {
        const ox = (obj.x / 100) * canvas.width;
        const oy = (obj.y / 100) * canvas.height;
        const ow = (obj.w / 100) * canvas.width;
        const oh = (obj.h / 100) * canvas.height;

        ctx.strokeStyle = obj.selected ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.6)';
        ctx.fillStyle = obj.selected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.05)';
        ctx.lineWidth = obj.selected ? 3 : 1.5;

        ctx.fillRect(ox, oy, ow, oh);
        ctx.strokeRect(ox, oy, ow, oh);

        ctx.fillStyle = obj.selected ? '#ef4444' : '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(obj.name, ox + 4, oy - 4);
      });
    }

    // Scanning animations
    if (scanProgress >= 0 && scanProgress <= 100) {
      const laserY = (scanProgress / 100) * canvas.height;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, laserY);
      ctx.lineTo(canvas.width, laserY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(0, 0, canvas.width, laserY);
    }
  };

  useEffect(() => {
    drawWorkspace();
  }, [image, mode, toolType, brushSize, detectedObjects, scanProgress, polygonPoints]);

  const handleMouseDown = (e) => {
    if (!image) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (mode === 'manual' && toolType === 'polygon') {
      // Add point
      setPolygonPoints(prev => [...prev, { x, y }]);
      return;
    }

    if (mode !== 'manual' || toolType === 'polygon') return;
    setIsDrawing(true);
    drawMask(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    drawMask(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawMask = (x, y) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
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

  const completePolygon = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas || polygonPoints.length < 3) return;

    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.fillStyle = 'red';
    maskCtx.beginPath();
    maskCtx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for (let i = 1; i < polygonPoints.length; i++) {
      maskCtx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    maskCtx.closePath();
    maskCtx.fill();

    setPolygonPoints([]);
    drawWorkspace();
    addToast('Polygon area added to mask.', 'info');
  };

  const triggerScan = () => {
    if (!image) return;
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          addToast('AI Scanning completed! Objects detected.', 'success');
          return -1;
        }
        return p + 5;
      });
    }, 50);
  };

  useEffect(() => {
    if (image && mode === 'auto') {
      triggerScan();
    }
  }, [image, mode]);

  const toggleObjectSelection = (id) => {
    setDetectedObjects(prev => prev.map(o => o.id === id ? { ...o, selected: !o.selected } : o));
  };

  // Content-Aware Eraser Fill
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

      const imgData = ctx.getImageData(0, 0, width, height);
      const maskImgData = maskCtx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      const maskPixels = maskImgData.data;

      const toRemove = new Uint8Array(width * height);

      // Manual brush markers
      for (let i = 0; i < pixels.length; i += 4) {
        if (maskPixels[i + 3] > 50) {
          toRemove[i / 4] = 1;
        }
      }

      // Auto bounding box markers
      if (mode === 'auto') {
        detectedObjects.forEach(obj => {
          if (!obj.selected) return;
          const ox1 = Math.round((obj.x / 100) * width);
          const oy1 = Math.round((obj.y / 100) * height);
          const ox2 = Math.round(((obj.x + obj.w) / 100) * width);
          const oy2 = Math.round(((obj.y + obj.h) / 100) * height);

          for (let y = oy1; y < oy2; y++) {
            for (let x = ox1; x < ox2; x++) {
              if (x >= 0 && x < width && y >= 0 && y < height) {
                toRemove[y * width + x] = 1;
              }
            }
          }
        });
      }

      // Multi-pass smart interpolation
      const passes = 4;
      const radius = 8;
      for (let p = 0; p < passes; p++) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (toRemove[idx] === 1) {
              let rSum = 0, gSum = 0, bSum = 0, count = 0;
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
                pixels[idx * 4] = rSum / count + (Math.random() - 0.5) * 2;
                pixels[idx * 4 + 1] = gSum / count + (Math.random() - 0.5) * 2;
                pixels[idx * 4 + 2] = bSum / count + (Math.random() - 0.5) * 2;
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      const cleanImg = new Image();
      cleanImg.onload = () => {
        setImage(cleanImg);
        maskCtx.clearRect(0, 0, width, height);
        setDetectedObjects([]);
        setProcessing(false);
        addToast('Object removed successfully!', 'success');
      };
      cleanImg.src = canvas.toDataURL();
    }, 1400);
  };

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`);
    link.download = `cleaned_photo.${format}`;
    link.click();
    addToast(`Photo exported as ${format.toUpperCase()}`, 'success');
  };

  const resetAll = () => {
    if (originalImageRef.current) {
      setImage(originalImageRef.current);
      setPolygonPoints([]);
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        maskCanvas.getContext('2d').clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
      setDetectedObjects([
        { id: 1, name: 'Person (Photobomb)', x: 45, y: 30, w: 14, h: 48, selected: true },
        { id: 2, name: 'Sign Post', x: 15, y: 20, w: 8, h: 32, selected: false },
        { id: 3, name: 'Vehicle / Car', x: 75, y: 55, w: 20, h: 22, selected: true }
      ]);
      addToast('Reset completed.', 'info');
    }
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
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(16,185,129,0.35)'
        }}>
          <FiSliders />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          AI Object <span className="text-gradient">Remover</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Select and erase people, vehicles, signs, wires, and background clutter in seconds.
        </p>
      </div>

      {!image ? (
        /* Dropzone */
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
            <FiSliders size={48} style={{ color: '#10b981', marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Upload Travel or Street Photo</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Supports JPG, PNG, WEBP (Max 50MB)</p>
          </div>
        </div>
      ) : (
        /* Editor Workspace */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
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
                    width: '44px', height: '44px', border: '3px solid #10b981', borderTopColor: 'transparent',
                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>Erasing Object &amp; Healing Background...</span>
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

            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={handleRemove} style={{ background: '#10b981', borderColor: '#10b981', minWidth: '160px' }}>
                <FiZap style={{ marginRight: '6px' }} /> Erase Object
              </button>
              <button className="btn btn-secondary" onClick={resetAll}>
                <FiRefreshCw style={{ marginRight: '6px' }} /> Reset
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#10b981' }}>Controls</h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setMode('manual')}
                className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, background: mode === 'manual' ? '#10b981' : 'transparent', borderColor: '#10b981' }}
              >
                Manual Select
              </button>
              <button
                onClick={() => setMode('auto')}
                className={`btn ${mode === 'auto' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, background: mode === 'auto' ? '#10b981' : 'transparent', borderColor: '#10b981' }}
              >
                Auto Detect (AI)
              </button>
            </div>

            {mode === 'manual' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setToolType('brush')}
                    className={`btn ${toolType === 'brush' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, background: toolType === 'brush' ? '#10b981' : 'transparent', borderColor: '#10b981', fontSize: '12.5px' }}
                  >
                    Brush Select
                  </button>
                  <button
                    onClick={() => setToolType('polygon')}
                    className={`btn ${toolType === 'polygon' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, background: toolType === 'polygon' ? '#10b981' : 'transparent', borderColor: '#10b981', fontSize: '12.5px' }}
                  >
                    Polygon Lasso
                  </button>
                  <button
                    onClick={() => setToolType('eraser')}
                    className={`btn ${toolType === 'eraser' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, background: toolType === 'eraser' ? '#10b981' : 'transparent', borderColor: '#10b981', fontSize: '12.5px' }}
                  >
                    Eraser
                  </button>
                </div>

                {toolType === 'polygon' && (
                  <button className="btn btn-secondary" onClick={completePolygon} disabled={polygonPoints.length < 3} style={{ fontSize: '12px', padding: '6px' }}>
                    <FiPlusCircle style={{ marginRight: '6px' }} /> Fill Polygon Area
                  </button>
                )}

                {(toolType === 'brush' || toolType === 'eraser') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      <span>BRUSH DIAMETER</span>
                      <span>{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="80"
                      value={brushSize}
                      onChange={e => setBrushSize(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#10b981' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>DETECTED OBJECTS</span>
                {detectedObjects.length === 0 ? (
                  <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    No objects detected.
                  </div>
                ) : (
                  detectedObjects.map(obj => (
                    <div
                      key={obj.id}
                      onClick={() => toggleObjectSelection(obj.id)}
                      style={{
                        padding: '12px 16px', borderRadius: '12px', border: `1px solid ${obj.selected ? '#10b981' : 'var(--border-color)'}`,
                        background: obj.selected ? 'rgba(16, 185, 129, 0.08)' : 'transparent', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>{obj.name}</span>
                      <span style={{ fontSize: '11px', color: obj.selected ? '#10b981' : 'var(--text-muted)' }}>
                        {obj.selected ? 'To Remove' : 'Keep'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>EXPORT FILE</span>
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
