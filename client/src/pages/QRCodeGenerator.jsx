import React, { useState, useRef, useEffect } from 'react';
import {
  FiArrowLeft, FiCommand, FiDownload, FiZap, FiUpload, FiRefreshCw
} from 'react-icons/fi';

export default function QRCodeGenerator({ tool, setView, setActiveTool, navigate, addToast }) {
  const [mode, setMode] = useState('url'); // url, wifi, vcard, whatsapp, email
  const [inputs, setInputs] = useState({
    url: 'https://alltoolmaster.me',
    wifiSsid: 'MyHomeWiFi',
    wifiPassword: 'Password123',
    wifiSecurity: 'WPA',
    vcardName: 'Vansh Shah',
    vcardPhone: '+919820901789',
    vcardEmail: 'vhshah1711@gmail.com',
    vcardCompany: 'All Tool Master',
    waPhone: '919820901789',
    waMessage: 'Hi! I scanned your QR code.',
    mailAddress: 'vhshah1711@gmail.com',
    mailSubject: 'Business Inquiry',
    mailBody: 'Hello Vansh, I visited All Tool Master...'
  });

  const [styling, setStyling] = useState({
    dotType: 'circle', // circle, square, rounded
    colorType: 'solid', // solid, gradient
    primaryColor: '#14b8a6',
    secondaryColor: '#06b6d4',
    bgColor: '#ffffff',
    logoUploaded: false,
    logoImg: null
  });

  const canvasRef = useRef(null);

  const setInput = (key, val) => setInputs(p => ({ ...p, [key]: val }));
  const setStyle = (key, val) => setStyling(p => ({ ...p, [key]: val }));

  // Helper to compile data payload based on selected QR mode
  const getPayloadData = () => {
    switch (mode) {
      case 'wifi':
        return `WIFI:S:${inputs.wifiSsid};T:${inputs.wifiSecurity};P:${inputs.wifiPassword};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${inputs.vcardName}\nORG:${inputs.vcardCompany}\nTEL:${inputs.vcardPhone}\nEMAIL:${inputs.vcardEmail}\nEND:VCARD`;
      case 'whatsapp':
        return `https://wa.me/${inputs.waPhone}?text=${encodeURIComponent(inputs.waMessage)}`;
      case 'email':
        return `mailto:${inputs.mailAddress}?subject=${encodeURIComponent(inputs.mailSubject)}&body=${encodeURIComponent(inputs.mailBody)}`;
      case 'url':
      default:
        return inputs.url;
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setStyle('logoImg', img);
        setStyle('logoUploaded', true);
        addToast('Logo uploaded! Placed in the center.', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Redraw QR code matrix onto the canvas
  const drawQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    
    // Clear background
    ctx.fillStyle = styling.bgColor;
    ctx.fillRect(0, 0, size, size);

    // Fetch a base QR code matrix using QR Server API, then repaint custom dots
    const dataString = encodeURIComponent(getPayloadData());
    const baseQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${dataString}`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Create temp canvas to read original pixel data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 300;
      tempCanvas.height = 300;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(img, 0, 0, 300, 300);

      const imgData = tempCtx.getImageData(0, 0, 300, 300);
      const pixels = imgData.data;

      // Draw custom dots
      const scale = size / 300;
      const step = 8; // Size of each QR block

      ctx.save();
      
      // Setup gradient fill if selected
      let fillStyleVal = styling.primaryColor;
      if (styling.colorType === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, styling.primaryColor);
        grad.addColorStop(1, styling.secondaryColor);
        fillStyleVal = grad;
      }
      ctx.fillStyle = fillStyleVal;

      for (let y = 0; y < 300; y += step) {
        for (let x = 0; x < 300; x += step) {
          // Check if pixel is dark (lower than threshold)
          const pIdx = (y * 300 + x) * 4;
          const r = pixels[pIdx];
          const g = pixels[pIdx+1];
          const b = pixels[pIdx+2];

          if (r < 120 && g < 120 && b < 120) {
            // Draw styled block
            const drawX = x * scale;
            const drawY = y * scale;
            const drawSize = step * scale - 1;

            // Anchor corner zones should stay solid square for reliable scans
            const isAnchor = (x < 65 && y < 65) || (x > 235 && y < 65) || (x < 65 && y > 235);

            if (isAnchor || styling.dotType === 'square') {
              ctx.fillRect(drawX, drawY, drawSize, drawSize);
            } else if (styling.dotType === 'circle') {
              ctx.beginPath();
              ctx.arc(drawX + drawSize/2, drawY + drawSize/2, drawSize/2 * 0.95, 0, Math.PI * 2);
              ctx.fill();
            } else if (styling.dotType === 'rounded') {
              ctx.beginPath();
              ctx.roundRect(drawX, drawY, drawSize, drawSize, 4);
              ctx.fill();
            }
          }
        }
      }

      ctx.restore();

      // Overlay central logo if uploaded
      if (styling.logoUploaded && styling.logoImg) {
        const logoSize = size * 0.20;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        // Draw backdrop card for logo to mask QR dots
        ctx.fillStyle = styling.bgColor;
        ctx.beginPath();
        ctx.roundRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8, 8);
        ctx.fill();

        ctx.drawImage(styling.logoImg, logoX, logoY, logoSize, logoSize);
      }
    };
    img.src = baseQrUrl;
  };

  useEffect(() => {
    drawQRCode();
  }, [mode, inputs, styling]);

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `custom_qrcode.${format}`;
    link.click();
    addToast('QR Code exported successfully!', 'success');
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
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(20,184,166,0.35)'
        }}>
          <FiCommand />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          Custom QR <span className="text-gradient">Generator</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Generate customized QR codes with brand gradients, dots styles, and custom logos inside.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
        
        {/* Left Form controls */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['url', 'wifi', 'vcard', 'whatsapp', 'email'].map(t => (
              <button
                key={t}
                onClick={() => setMode(t)}
                className={`btn ${mode === t ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '11px', padding: '6px 10px', height: '30px', flex: 1, minWidth: '70px',
                  background: mode === t ? '#14b8a6' : 'transparent', borderColor: '#14b8a6'
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Dynamic input sections */}
          {mode === 'url' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Target URL Link</label>
              <input type="url" className="input-field" value={inputs.url} onChange={e => setInput('url', e.target.value)} placeholder="https://example.com" />
            </div>
          )}

          {mode === 'wifi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Network SSID (Name)</label>
                <input type="text" className="input-field" value={inputs.wifiSsid} onChange={e => setInput('wifiSsid', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Password</label>
                  <input type="password" className="input-field" value={inputs.wifiPassword} onChange={e => setInput('wifiPassword', e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Security</label>
                  <select className="select-field" value={inputs.wifiSecurity} onChange={e => setInput('wifiSecurity', e.target.value)}>
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password (Open)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'vcard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" className="input-field" value={inputs.vcardName} onChange={e => setInput('vcardName', e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Phone Number</label>
                  <input type="text" className="input-field" value={inputs.vcardPhone} onChange={e => setInput('vcardPhone', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Email Address</label>
                  <input type="email" className="input-field" value={inputs.vcardEmail} onChange={e => setInput('vcardEmail', e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Company</label>
                  <input type="text" className="input-field" value={inputs.vcardCompany} onChange={e => setInput('vcardCompany', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {mode === 'whatsapp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Phone Number (with Country Code)</label>
                <input type="text" className="input-field" value={inputs.waPhone} onChange={e => setInput('waPhone', e.target.value)} placeholder="e.g. 919820901789" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Pre-filled Message</label>
                <textarea className="input-field" rows={2} value={inputs.waMessage} onChange={e => setInput('waMessage', e.target.value)} />
              </div>
            </div>
          )}

          {mode === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Recipient Email</label>
                  <input type="email" className="input-field" value={inputs.mailAddress} onChange={e => setInput('mailAddress', e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Subject</label>
                  <input type="text" className="input-field" value={inputs.mailSubject} onChange={e => setInput('mailSubject', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Message Body</label>
                <textarea className="input-field" rows={2} value={inputs.mailBody} onChange={e => setInput('mailBody', e.target.value)} />
              </div>
            </div>
          )}

          {/* Styling customization */}
          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#14b8a6', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '10px' }}>Styling Customizer</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Block Shape</label>
              <select className="select-field" value={styling.dotType} onChange={e => setStyle('dotType', e.target.value)}>
                <option value="circle">Circles</option>
                <option value="square">Squares</option>
                <option value="rounded">Rounded Squares</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Color Mode</label>
              <select className="select-field" value={styling.colorType} onChange={e => setStyle('colorType', e.target.value)}>
                <option value="solid">Solid Colors</option>
                <option value="gradient">Gradient Colors</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Primary Color</label>
              <input type="color" value={styling.primaryColor} onChange={e => setStyle('primaryColor', e.target.value)} style={{ width: '100%', height: '38px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
            </div>
            {styling.colorType === 'gradient' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Secondary Color</label>
                <input type="color" value={styling.secondaryColor} onChange={e => setStyle('secondaryColor', e.target.value)} style={{ width: '100%', height: '38px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
              </div>
            )}
          </div>

          {/* Logo overlay file input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Center Logo Overlay</label>
            <div className="glass-panel" style={{ padding: '16px', border: '2px dashed var(--border-color)', position: 'relative', textAlign: 'center' }}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <FiUpload size={18} style={{ color: '#14b8a6', marginBottom: '4px' }} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Choose brand logo to place in center</div>
            </div>
          </div>

        </div>

        {/* Right Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          
          <div className="glass-panel" style={{
            padding: '20px', borderRadius: '24px', background: '#ffffff',
            border: '1px solid var(--border-color)', width: '100%', maxWidth: '360px',
            display: 'flex', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              style={{
                borderRadius: '8px', width: '100%', height: 'auto', display: 'block'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '360px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('png')}>Export PNG</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('svg')}>Export SVG</button>
          </div>
        </div>
      </div>
    </div>
  );
}
