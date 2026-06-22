import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FiArrowLeft, FiCamera, FiDownload, FiZap, FiSliders, FiMousePointer, FiTrash2, FiRefreshCw,
  FiUpload, FiCheck, FiX, FiLoader, FiEye
} from 'react-icons/fi';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

export default function WatermarkRemover({ tool, setView, setActiveTool, navigate, addToast }) {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [mode, setMode] = useState('auto'); // auto, manual
  const [toolType, setToolType] = useState('brush'); // brush, eraser
  const [brushSize, setBrushSize] = useState(24);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');
  const [aiScanning, setAiScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(-1);
  const [hoverPos, setHoverPos] = useState(null);
  const [cleaned, setCleaned] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPos, setComparisonPos] = useState(50);

  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const originalImageRef = useRef(null);
  const originalPixelsRef = useRef(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const isDrawingRef = useRef(false);
  const comparisonCleanedCanvasRef = useRef(null);
  const comparisonOriginalCanvasRef = useRef(null);

  const [detectedRegions, setDetectedRegions] = useState([]);

  // ─── Image Upload ───────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setCleaned(false);
    setShowComparison(false);
    setDetectedRegions([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setImage(img);
        setImageSize({ w: img.width, h: img.height });
        addToast('Image uploaded! Starting AI analysis...', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ─── Canvas Drawing ─────────────────────────────────────────────
  const drawBaseImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [image]);

  const drawOverlay = useCallback(() => {
    const overlayCanvas = overlayCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!overlayCanvas || !image) return;

    const ctx = overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Draw manual mask translucent
    if (mode === 'manual' && maskCanvas) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.restore();
    }

    // Draw AI-detected bounding boxes
    if (mode === 'auto' && scanProgress === -1 && !cleaned) {
      detectedRegions.forEach(r => {
        const rx = (r.x / 100) * overlayCanvas.width;
        const ry = (r.y / 100) * overlayCanvas.height;
        const rw = (r.w / 100) * overlayCanvas.width;
        const rh = (r.h / 100) * overlayCanvas.height;

        ctx.strokeStyle = r.selected ? 'rgba(239, 68, 68, 0.95)' : 'rgba(6, 182, 212, 0.6)';
        ctx.fillStyle = r.selected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.05)';
        ctx.lineWidth = r.selected ? Math.max(3, overlayCanvas.width * 0.006) : Math.max(1.5, overlayCanvas.width * 0.003);

        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);

        // Label with confidence
        ctx.fillStyle = r.selected ? '#ef4444' : '#06b6d4';
        const fontSize = Math.max(11, Math.round(overlayCanvas.width * 0.022));
        ctx.font = `bold ${fontSize}px sans-serif`;
        const label = `${r.type} (${Math.round((r.confidence || 0.9) * 100)}%)`;
        ctx.fillText(label, rx + 4, ry - fontSize * 0.3);
      });
    }

    // Scanning laser effect
    if (scanProgress >= 0 && scanProgress <= 100) {
      const laserY = (scanProgress / 100) * overlayCanvas.height;
      const laserHeight = Math.max(15, overlayCanvas.height * 0.035);
      const grad = ctx.createLinearGradient(0, laserY - laserHeight, 0, laserY);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, laserY - laserHeight, overlayCanvas.width, laserHeight);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = Math.max(3, overlayCanvas.height * 0.007);
      ctx.beginPath();
      ctx.moveTo(0, laserY);
      ctx.lineTo(overlayCanvas.width, laserY);
      ctx.stroke();
    }

    // Brush hover cursor
    if (mode === 'manual' && hoverPos) {
      const rect = overlayCanvas.getBoundingClientRect();
      const scale = rect.width > 0 ? overlayCanvas.width / rect.width : 1;
      const logicalBrushSize = brushSize * scale;

      ctx.save();
      ctx.beginPath();
      ctx.arc(hoverPos.x, hoverPos.y, logicalBrushSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1.5, overlayCanvas.width * 0.003);
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();
    }
  }, [image, mode, scanProgress, detectedRegions, hoverPos, brushSize, cleaned]);

  // Set canvas sizes and draw base image once when image or imageSize changes
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
      drawBaseImage();
      // Save original pixels for comparison
      if (image && canvas) {
        const ctx = canvas.getContext('2d');
        originalPixelsRef.current = ctx.getImageData(0, 0, imageSize.w, imageSize.h);
      }
      drawOverlay();
    }
  }, [image, imageSize, drawBaseImage, drawOverlay]);

  // Re-draw overlay whenever it changes
  useEffect(() => {
    drawOverlay();
  }, [drawOverlay]);

  // Copy cleaned and original pixels to comparison canvases once shown
  useEffect(() => {
    if (showComparison && imageSize.w && imageSize.h) {
      const cleanCanvas = comparisonCleanedCanvasRef.current;
      if (cleanCanvas && canvasRef.current) {
        cleanCanvas.width = imageSize.w;
        cleanCanvas.height = imageSize.h;
        const ctx = cleanCanvas.getContext('2d');
        ctx.drawImage(canvasRef.current, 0, 0);
      }
      const origCanvas = comparisonOriginalCanvasRef.current;
      if (origCanvas && originalPixelsRef.current) {
        origCanvas.width = imageSize.w;
        origCanvas.height = imageSize.h;
        const ctx = origCanvas.getContext('2d');
        ctx.putImageData(originalPixelsRef.current, 0, 0);
      }
    }
  }, [showComparison, imageSize, cleaned]);

  // ─── AI Detection via Backend ───────────────────────────────────
  const triggerAiScan = useCallback(async () => {
    if (!imageFile) return;

    setAiScanning(true);
    setScanProgress(0);

    // Animate scanning laser
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 95) return 95; // Hold at 95% until response
        return p + 2;
      });
    }, 80);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('tool', 'watermark-remover');

      const response = await fetch(`${BACKEND_URL}/api/ai`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      let resultText = data.result || '[]';

      // Clean markdown code fences if present
      resultText = resultText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

      let regions = [];
      try {
        regions = JSON.parse(resultText);
      } catch (parseErr) {
        // Try to extract JSON array from the response
        const match = resultText.match(/\[[\s\S]*\]/);
        if (match) {
          regions = JSON.parse(match[0]);
        } else {
          console.warn('Could not parse AI response as JSON:', resultText);
          regions = [];
        }
      }

      if (!Array.isArray(regions)) regions = [];

      // Add id and selected flag
      const formattedRegions = regions.map((r, i) => ({
        id: i + 1,
        type: r.type || 'Detected Overlay',
        x: Math.max(0, Math.min(100, r.x || 0)),
        y: Math.max(0, Math.min(100, r.y || 0)),
        w: Math.max(1, Math.min(100, r.w || 10)),
        h: Math.max(1, Math.min(100, r.h || 5)),
        confidence: r.confidence || 0.85,
        selected: true,
      }));

      clearInterval(interval);
      setScanProgress(100);

      setTimeout(() => {
        setScanProgress(-1);
        setDetectedRegions(formattedRegions);
        setAiScanning(false);

        if (formattedRegions.length > 0) {
          addToast(`AI detected ${formattedRegions.length} watermark region(s)!`, 'success');
        } else {
          addToast('No watermarks detected by AI. Try Manual Eraser mode.', 'info');
        }
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setScanProgress(-1);
      setAiScanning(false);
      console.error('AI Scan error:', err);
      addToast(`AI scan failed: ${err.message}. Try Manual Eraser mode.`, 'error');
    }
  }, [imageFile, addToast]);

  // Auto-trigger AI scan when image loads in auto mode
  useEffect(() => {
    if (image && imageFile && mode === 'auto') {
      triggerAiScan();
    }
  }, [image, imageFile, mode]);

  // ─── Mouse/Touch Event Helpers ──────────────────────────────────
  const getCanvasCoords = (e) => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return null;
    const rect = overlayCanvas.getBoundingClientRect();
    // Support both mouse and touch events
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = rect.width > 0 ? ((clientX - rect.left) / rect.width) * overlayCanvas.width : 0;
    const y = rect.height > 0 ? ((clientY - rect.top) / rect.height) * overlayCanvas.height : 0;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (mode !== 'manual' || !image) return;
    e.preventDefault();
    isDrawingRef.current = true;
    setIsDrawing(true);

    const coords = getCanvasCoords(e);
    if (!coords) return;

    lastXRef.current = coords.x;
    lastYRef.current = coords.y;
    drawMask(coords.x, coords.y, coords.x, coords.y);
  };

  const handleMouseMove = (e) => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas || !image) return;
    if (mode === 'manual') e.preventDefault();

    const coords = getCanvasCoords(e);
    if (!coords) return;

    if (mode === 'manual') {
      setHoverPos({ x: coords.x, y: coords.y });
    } else {
      setHoverPos(null);
    }

    if (isDrawingRef.current) {
      drawMask(lastXRef.current, lastYRef.current, coords.x, coords.y);
      lastXRef.current = coords.x;
      lastYRef.current = coords.y;
    }
  };

  const handleMouseUp = (e) => {
    if (e) e.preventDefault();
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

    drawOverlay();
  };

  const toggleRegion = (id) => {
    setDetectedRegions(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  // ─── Server-Side AI Watermark Removal ────────────────────────────
  const handleRemove = async () => {
    if (!image || !imageFile) return;

    // Validate that there's something to remove
    if (mode === 'auto') {
      const selected = detectedRegions.filter(r => r.selected);
      if (selected.length === 0 && detectedRegions.length > 0) {
        addToast('No regions selected for removal. Click regions to select them.', 'info');
        return;
      }
    }

    setProcessing(true);
    setProcessingMsg('Sending to AI for watermark removal...');

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      if (mode === 'manual') {
        // Render the mask canvas to a PNG blob and include it
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          const maskBlob = await new Promise((resolve) => {
            maskCanvas.toBlob((blob) => resolve(blob), 'image/png');
          });
          if (maskBlob && maskBlob.size > 100) {
            formData.append('mask', maskBlob, 'mask.png');
          } else {
            setProcessing(false);
            addToast('Please paint over the watermark areas first using the brush tool.', 'info');
            return;
          }
        }
      } else {
        // Auto mode: include the selected detected regions
        const selected = detectedRegions.filter(r => r.selected);
        if (selected.length > 0) {
          formData.append('regions', JSON.stringify(selected));
        }
      }

      setProcessingMsg('AI is removing watermarks & reconstructing image...');

      const response = await fetch(`${BACKEND_URL}/api/watermark-remove`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      // Read the cleaned image from the response
      const blob = await response.blob();
      const cleanedUrl = URL.createObjectURL(blob);

      // Load the cleaned image and draw it on canvas
      const cleanedImg = new Image();
      cleanedImg.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(cleanedImg, 0, 0, canvas.width, canvas.height);
        }

        // Clear mask & regions
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
          maskCanvas.getContext('2d').clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        }
        if (mode === 'auto') setDetectedRegions([]);

        setCleaned(true);
        setProcessing(false);
        setShowComparison(true);
        addToast('Watermark removed successfully by AI!', 'success');
        drawOverlay();

        // Clean up object URL after a delay
        setTimeout(() => URL.revokeObjectURL(cleanedUrl), 5000);
      };
      cleanedImg.onerror = () => {
        setProcessing(false);
        addToast('Failed to load the cleaned image from server.', 'error');
        URL.revokeObjectURL(cleanedUrl);
      };
      cleanedImg.src = cleanedUrl;

    } catch (err) {
      setProcessing(false);
      console.error('Watermark removal error:', err);
      addToast(`Watermark removal failed: ${err.message}`, 'error');
    }
  };

  // ─── Download ───────────────────────────────────────────────────
  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`, format === 'jpg' ? 0.95 : undefined);
    link.download = `cleaned_photo.${format}`;
    link.click();
    addToast(`Cleaned photo downloaded as ${format.toUpperCase()}!`, 'success');
  };

  // ─── Reset ──────────────────────────────────────────────────────
  const resetAll = () => {
    if (image) {
      drawBaseImage();
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        maskCanvas.getContext('2d').clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
      setDetectedRegions([]);
      setCleaned(false);
      setShowComparison(false);
      addToast('Reset to original image.', 'info');
      if (mode === 'auto') {
        triggerAiScan();
      }
    }
  };

  // ─── Comparison slider handler ──────────────────────────────────
  const handleComparisonMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setComparisonPos(x);
  };

  const selectedCount = detectedRegions.filter(r => r.selected).length;

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
          Powered by Gemini AI — automatically detects and removes watermarks, timestamps, logos, and text overlays.
        </p>
      </div>

      {!image ? (
        /* Upload Area */
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-panel" style={{
            padding: '60px 40px', borderRadius: '24px', textAlign: 'center',
            border: '2px dashed var(--border-color)', background: 'rgba(0,0,0,0.1)', cursor: 'pointer',
            position: 'relative', transition: 'border-color 0.3s, background 0.3s'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
              }}
            />
            <FiUpload size={48} style={{ color: '#3b82f6', marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Upload Image with Watermark</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Supports JPG, PNG, WEBP (Max 50MB) — AI will automatically detect watermarks
            </p>
          </div>

          {/* How it works */}
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <FiUpload />, title: 'Upload', desc: 'Drop your watermarked image' },
              { icon: <FiZap />, title: 'AI Detects', desc: 'Gemini AI finds all watermarks' },
              { icon: <FiCheck />, title: 'Remove', desc: 'One-click clean removal' },
              { icon: <FiDownload />, title: 'Download', desc: 'Get your clean image' },
            ].map((step, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '16px', borderRadius: '14px',
                background: 'rgba(59,130,246,0.06)', flex: '1', minWidth: '120px',
                border: '1px solid rgba(59,130,246,0.1)'
              }}>
                <div style={{ color: '#3b82f6', fontSize: '22px', marginBottom: '8px' }}>{step.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{step.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Editor Workspace */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">

          {/* Canvas Workspace */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>

            {/* Canvas Container */}
            <div className="glass-panel" style={{
              position: 'relative', padding: '16px', borderRadius: '24px', width: '100%',
              display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)'
            }}>
              {(processing || aiScanning) && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.75)', borderRadius: '24px', zIndex: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px'
                }}>
                  <div style={{
                    width: '44px', height: '44px', border: '3px solid #3b82f6', borderTopColor: 'transparent',
                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>
                    {aiScanning ? 'AI Analyzing Image for Watermarks...' : processingMsg}
                  </span>
                  {processing && !aiScanning && (
                    <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: '280px' }}>
                      Gemini AI is reconstructing the image — this may take 10-30 seconds
                    </span>
                  )}
                  {aiScanning && scanProgress >= 0 && (
                    <div style={{ width: '200px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${scanProgress}%`, height: '100%', borderRadius: '3px',
                        background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  )}
                </div>
              )}

              <div style={{ position: 'relative', maxWidth: '100%', width: '100%' }}>
                <canvas
                  ref={canvasRef}
                  width={imageSize.w || 560}
                  height={imageSize.h || 420}
                  style={{
                    borderRadius: '16px', width: '100%', height: 'auto', display: 'block',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                />
                <canvas
                  ref={overlayCanvasRef}
                  width={imageSize.w || 560}
                  height={imageSize.h || 420}
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

            {/* Before/After Comparison */}
            {showComparison && originalPixelsRef.current && (
              <div className="glass-panel" style={{ width: '100%', padding: '16px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FiEye style={{ color: '#3b82f6' }} />
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>Before / After Comparison</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>← Drag slider →</span>
                </div>
                <div
                  style={{ position: 'relative', width: '100%', cursor: 'col-resize', borderRadius: '12px', overflow: 'hidden' }}
                  onMouseMove={handleComparisonMove}
                >
                  {/* After (cleaned) - full width */}
                  <canvas
                    ref={comparisonCleanedCanvasRef}
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
                  />
                  {/* Before (original) - clipped */}
                  <canvas
                    ref={comparisonOriginalCanvasRef}
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      borderRadius: '12px',
                      clipPath: `inset(0 ${100 - comparisonPos}% 0 0)`
                    }}
                  />
                  {/* Divider line */}
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: `${comparisonPos}%`,
                    width: '3px', background: '#fff', transform: 'translateX(-50%)',
                    boxShadow: '0 0 8px rgba(0,0,0,0.5)'
                  }}>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: '32px', height: '32px', borderRadius: '50%', background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)', fontSize: '14px', color: '#333'
                    }}>⇔</div>
                  </div>
                  {/* Labels */}
                  <div style={{
                    position: 'absolute', top: '8px', left: '8px',
                    background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 10px',
                    borderRadius: '6px', fontSize: '11px', fontWeight: '700'
                  }}>BEFORE</div>
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(59,130,246,0.9)', color: '#fff', padding: '4px 10px',
                    borderRadius: '6px', fontSize: '11px', fontWeight: '700'
                  }}>AFTER</div>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={handleRemove}
                disabled={processing || aiScanning}
                style={{
                  background: '#3b82f6', borderColor: '#3b82f6', minWidth: '160px',
                  opacity: (processing || aiScanning) ? 0.6 : 1
                }}
              >
                <FiZap style={{ marginRight: '6px' }} />
                {mode === 'auto' && selectedCount > 0
                  ? `Remove ${selectedCount} Region${selectedCount > 1 ? 's' : ''}`
                  : 'Remove Watermarks'}
              </button>
              <button className="btn btn-secondary" onClick={resetAll} disabled={processing || aiScanning}>
                <FiRefreshCw style={{ marginRight: '6px' }} /> Reset
              </button>
              {mode === 'auto' && !aiScanning && (
                <button className="btn btn-secondary" onClick={triggerAiScan} disabled={processing}>
                  <FiZap style={{ marginRight: '6px' }} /> Re-scan
                </button>
              )}
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
              /* Auto Mode */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {aiScanning ? (
                  <div style={{
                    padding: '20px', borderRadius: '12px', background: 'rgba(59,130,246,0.08)',
                    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                  }}>
                    <div style={{
                      width: '28px', height: '28px', border: '2px solid #3b82f6',
                      borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#3b82f6' }}>
                      Gemini AI is analyzing your image...
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Detecting watermarks, logos, text overlays
                    </span>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
                      AI DETECTED REGIONS {detectedRegions.length > 0 && `(${detectedRegions.length})`}
                    </span>
                    {detectedRegions.length === 0 ? (
                      <div style={{
                        padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)',
                        textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)'
                      }}>
                        {cleaned
                          ? '✅ All watermarks have been removed!'
                          : 'No watermark overlays detected. Try Manual Eraser mode.'}
                      </div>
                    ) : (
                      detectedRegions.map(r => (
                        <div
                          key={r.id}
                          onClick={() => toggleRegion(r.id)}
                          style={{
                            padding: '12px 16px', borderRadius: '12px',
                            border: `1px solid ${r.selected ? '#3b82f6' : 'var(--border-color)'}`,
                            background: r.selected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                            cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '700' }}>{r.type}</span>
                            <span style={{
                              fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px',
                              background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px'
                            }}>
                              {Math.round((r.confidence || 0.9) * 100)}% confidence
                            </span>
                          </div>
                          <span style={{
                            fontSize: '11px', fontWeight: '700',
                            color: r.selected ? '#3b82f6' : 'var(--text-muted)'
                          }}>
                            {r.selected ? '✓ Selected' : 'Ignored'}
                          </span>
                        </div>
                      ))
                    )}
                  </>
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

                <div style={{
                  padding: '12px', borderRadius: '10px', background: 'rgba(59,130,246,0.05)',
                  fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.5'
                }}>
                  💡 <strong>Tip:</strong> Use Brush Paint to highlight watermark areas, then click "Remove Watermarks". Use Mask Eraser to correct mistakes.
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

            {/* Upload new image */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <label className="btn btn-secondary" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', cursor: 'pointer', position: 'relative'
              }}>
                <FiUpload /> Upload New Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </label>
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
