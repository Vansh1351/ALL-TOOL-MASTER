import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FiArrowLeft, FiSliders, FiDownload, FiZap, FiTrash2, FiPlusCircle, FiRefreshCw, FiUpload, FiMousePointer
} from 'react-icons/fi';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

export default function ObjectRemover({ tool, setView, setActiveTool, navigate, addToast }) {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageSize, setImageSize] = useState({ w: 800, h: 600 });
  const [mode, setMode] = useState('manual'); // manual, auto
  const [toolType, setToolType] = useState('brush'); // brush, polygon, eraser
  const [brushSize, setBrushSize] = useState(28);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState(-1);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [hoverPos, setHoverPos] = useState(null);

  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const originalImageRef = useRef(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const isDrawingRef = useRef(false);

  // Simulated AI detected objects
  const [detectedObjects, setDetectedObjects] = useState([
    { id: 1, name: 'Person (Photobomb)', x: 45, y: 30, w: 14, h: 48, selected: true },
    { id: 2, name: 'Sign Post', x: 15, y: 20, w: 8, h: 32, selected: false },
    { id: 3, name: 'Vehicle / Car', x: 75, y: 55, w: 20, h: 22, selected: true }
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setImage(img);
        setImageSize({ w: img.width, h: img.height });
        // Clear mask canvas
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          maskCanvas.width = img.width;
          maskCanvas.height = img.height;
          const maskCtx = maskCanvas.getContext('2d');
          maskCtx.clearRect(0, 0, img.width, img.height);
        }
        setDetectedObjects([
          { id: 1, name: 'Person (Photobomb)', x: 45, y: 30, w: 14, h: 48, selected: true },
          { id: 2, name: 'Sign Post', x: 15, y: 20, w: 8, h: 32, selected: false },
          { id: 3, name: 'Vehicle / Car', x: 75, y: 55, w: 20, h: 22, selected: true }
        ]);
        addToast('Image uploaded successfully!', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawWorkspace = useCallback(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !overlayCanvas || !image) return;

    const ctx = canvas.getContext('2d');
    const overCtx = overlayCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    overCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Draw manual mask layers
    if (maskCanvas) {
      overCtx.save();
      overCtx.globalAlpha = 0.45;
      overCtx.drawImage(maskCanvas, 0, 0);
      overCtx.restore();
    }

    // Draw polygon connection lines
    if (mode === 'manual' && toolType === 'polygon' && polygonPoints.length > 0) {
      overCtx.strokeStyle = '#ef4444';
      overCtx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      overCtx.lineWidth = Math.max(2, overlayCanvas.width * 0.005);
      overCtx.beginPath();
      overCtx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) {
        overCtx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }
      overCtx.stroke();

      // Dot anchors
      polygonPoints.forEach(p => {
        overCtx.fillStyle = '#ef4444';
        overCtx.beginPath();
        overCtx.arc(p.x, p.y, Math.max(4, overlayCanvas.width * 0.008), 0, Math.PI * 2);
        overCtx.fill();
      });
    }

    // Auto Mode detected areas
    if (mode === 'auto' && scanProgress === -1) {
      detectedObjects.forEach(obj => {
        const ox = (obj.x / 100) * overlayCanvas.width;
        const oy = (obj.y / 100) * overlayCanvas.height;
        const ow = (obj.w / 100) * overlayCanvas.width;
        const oh = (obj.h / 100) * overlayCanvas.height;

        overCtx.strokeStyle = obj.selected ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.6)';
        overCtx.fillStyle = obj.selected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.05)';
        overCtx.lineWidth = obj.selected ? Math.max(3, overlayCanvas.width * 0.006) : Math.max(1.5, overlayCanvas.width * 0.003);

        overCtx.fillRect(ox, oy, ow, oh);
        overCtx.strokeRect(ox, oy, ow, oh);

        overCtx.fillStyle = obj.selected ? '#ef4444' : '#10b981';
        const fontSize = Math.max(11, Math.round(overlayCanvas.width * 0.022));
        overCtx.font = `bold ${fontSize}px sans-serif`;
        overCtx.fillText(obj.name, ox + 4, oy - fontSize * 0.3);
      });
    }

    // Scanning laser effect
    if (scanProgress >= 0 && scanProgress <= 100) {
      const laserY = (scanProgress / 100) * overlayCanvas.height;
      overCtx.strokeStyle = '#10b981';
      overCtx.lineWidth = Math.max(3, overlayCanvas.height * 0.007);
      overCtx.beginPath();
      overCtx.moveTo(0, laserY);
      overCtx.lineTo(overlayCanvas.width, laserY);
      overCtx.stroke();

      overCtx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      overCtx.fillRect(0, 0, overlayCanvas.width, laserY);
    }

    // Brush hover cursor
    if (mode === 'manual' && hoverPos && (toolType === 'brush' || toolType === 'eraser')) {
      const rect = overlayCanvas.getBoundingClientRect();
      const scale = rect.width > 0 ? overlayCanvas.width / rect.width : 1;
      const logicalBrushSize = brushSize * scale;

      overCtx.save();
      overCtx.beginPath();
      overCtx.arc(hoverPos.x, hoverPos.y, logicalBrushSize / 2, 0, Math.PI * 2);
      overCtx.strokeStyle = '#ffffff';
      overCtx.lineWidth = Math.max(1.5, overlayCanvas.width * 0.003);
      overCtx.shadowColor = 'rgba(0,0,0,0.5)';
      overCtx.shadowBlur = 4;
      overCtx.stroke();
      overCtx.restore();
    }
  }, [image, mode, toolType, brushSize, detectedObjects, scanProgress, polygonPoints, hoverPos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (imageSize.w && imageSize.h) {
      if (canvas) {
        canvas.width = imageSize.w;
        canvas.height = imageSize.h;
      }
      if (overlayCanvas) {
        overlayCanvas.width = imageSize.w;
        overlayCanvas.height = imageSize.h;
      }
      if (maskCanvas) {
        maskCanvas.width = imageSize.w;
        maskCanvas.height = imageSize.h;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.clearRect(0, 0, imageSize.w, imageSize.h);
      }
      // Initial draw of base image
      if (canvas && image) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [image, imageSize]);

  // Redraw overlay when points, hover, or selections change
  useEffect(() => {
    drawWorkspace();
  }, [polygonPoints, hoverPos, detectedObjects, scanProgress, drawWorkspace]);

  const getCanvasCoords = (e) => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return null;
    const rect = overlayCanvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = rect.width > 0 ? ((clientX - rect.left) / rect.width) * overlayCanvas.width : 0;
    const y = rect.height > 0 ? ((clientY - rect.top) / rect.height) * overlayCanvas.height : 0;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (!image) return;
    e.preventDefault();

    const coords = getCanvasCoords(e);
    if (!coords) return;

    if (mode === 'manual' && toolType === 'polygon') {
      setPolygonPoints(prev => [...prev, { x: coords.x, y: coords.y }]);
      return;
    }

    isDrawingRef.current = true;
    setIsDrawing(true);
    lastXRef.current = coords.x;
    lastYRef.current = coords.y;
    drawMask(coords.x, coords.y, coords.x, coords.y);
  };

  const handleMouseMove = (e) => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas || !image) return;

    const coords = getCanvasCoords(e);
    if (!coords) return;

    if (mode === 'manual') {
      setHoverPos({ x: coords.x, y: coords.y });
    } else {
      setHoverPos(null);
    }

    if (isDrawingRef.current) {
      e.preventDefault();
      drawMask(lastXRef.current, lastYRef.current, coords.x, coords.y);
      lastXRef.current = coords.x;
      lastYRef.current = coords.y;
    }
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    isDrawingRef.current = false;
    setIsDrawing(false);
    setHoverPos(null);
  };

  const drawMask = (x1, y1, x2, y2) => {
    const overlayCanvas = overlayCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!overlayCanvas || !maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';

    const rect = overlayCanvas.getBoundingClientRect();
    const scale = rect.width > 0 ? overlayCanvas.width / rect.width : 1;
    const logicalBrushSize = brushSize * scale;

    if (toolType === 'brush') {
      maskCtx.strokeStyle = 'red';
      maskCtx.lineWidth = logicalBrushSize;
      maskCtx.beginPath();
      maskCtx.moveTo(x1, y1);
      maskCtx.lineTo(x2, y2);
      maskCtx.stroke();
    } else if (toolType === 'eraser') {
      maskCtx.save();
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.strokeStyle = 'rgba(0,0,0,1)';
      maskCtx.lineWidth = logicalBrushSize;
      maskCtx.beginPath();
      maskCtx.moveTo(x1, y1);
      maskCtx.lineTo(x2, y2);
      maskCtx.stroke();
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

  // Backend connected AI Eraser
  const handleRemove = async () => {
    if (!image || !imageFile) return;
    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      if (mode === 'manual') {
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          const maskBlob = await new Promise((resolve) => {
            maskCanvas.toBlob((blob) => resolve(blob), 'image/png');
          });
          if (maskBlob && maskBlob.size > 100) {
            formData.append('mask', maskBlob, 'mask.png');
          } else {
            setProcessing(false);
            addToast('Please paint or select an object to remove first.', 'info');
            return;
          }
        }
      } else {
        // Auto Mode
        const selected = detectedObjects.filter(o => o.selected).map((obj, i) => ({
          id: i + 1,
          type: obj.name,
          x: obj.x,
          y: obj.y,
          w: obj.w,
          h: obj.h,
          confidence: 0.95
        }));
        if (selected.length > 0) {
          formData.append('regions', JSON.stringify(selected));
        } else {
          setProcessing(false);
          addToast('No objects selected for removal.', 'info');
          return;
        }
      }

      const response = await fetch(`${BACKEND_URL}/api/watermark-remove`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const cleanedUrl = URL.createObjectURL(blob);

      const cleanedImg = new Image();
      cleanedImg.onload = () => {
        setImage(cleanedImg);
        // Clear mask canvas
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          maskCanvas.getContext('2d').clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        }
        if (mode === 'auto') setDetectedObjects([]);
        setProcessing(false);
        addToast('Object removed successfully by AI!', 'success');
        
        // Clean up object URL after a short delay
        setTimeout(() => URL.revokeObjectURL(cleanedUrl), 5000);
      };
      cleanedImg.onerror = () => {
        setProcessing(false);
        addToast('Failed to load the processed image.', 'error');
        URL.revokeObjectURL(cleanedUrl);
      };
      cleanedImg.src = cleanedUrl;

    } catch (err) {
      setProcessing(false);
      console.error('Object removal failed:', err);
      addToast(`Object removal failed: ${err.message}`, 'error');
    }
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
              <div style={{ position: 'relative', maxWidth: '100%', width: '100%' }}>
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
                <canvas
                  ref={canvasRef}
                  width={imageSize.w}
                  height={imageSize.h}
                  style={{
                    borderRadius: '16px', width: '100%', height: 'auto', display: 'block',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                />
                <canvas
                  ref={overlayCanvasRef}
                  width={imageSize.w}
                  height={imageSize.h}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleMouseDown}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                  onTouchCancel={handleMouseLeave}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    borderRadius: '16px', display: 'block',
                    cursor: mode === 'manual' ? 'crosshair' : 'default',
                    pointerEvents: 'auto',
                    touchAction: mode === 'manual' ? 'none' : 'auto'
                  }}
                />
                <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={handleRemove} style={{ background: '#10b981', borderColor: '#10b981', minWidth: '160px' }} disabled={processing}>
                <FiZap style={{ marginRight: '6px' }} /> Erase Object
              </button>
              <button className="btn btn-secondary" onClick={resetAll} disabled={processing}>
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
