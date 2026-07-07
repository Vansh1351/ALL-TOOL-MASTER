import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  FiArrowLeft, FiCommand, FiDownload, FiZap, FiUpload, FiRefreshCw
} from 'react-icons/fi';

const INDUSTRIES = [
  'Technology & Software', 'Food & Restaurant', 'Fashion & Beauty', 'Real Estate',
  'Finance & Consulting', 'Education & Learning', 'Fitness & Health', 'Creative & Design'
];

const COLORS = [
  { name: 'Teal Lagoon', primary: '#14b8a6', secondary: '#06b6d4', dark: '#0f172a' },
  { name: 'Sunset Gold', primary: '#f59e0b', secondary: '#d97706', dark: '#1e293b' },
  { name: 'Royal Purple', primary: '#a855f7', secondary: '#7c3aed', dark: '#090514' },
  { name: 'Crimson Slate', primary: '#ef4444', secondary: '#b91c1c', dark: '#18181b' },
  { name: 'Monochrome', primary: '#0f172a', secondary: '#334155', dark: '#ffffff' }
];

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

    try {
      const dataString = getPayloadData();
      const qrCode = QRCode.create(dataString, { errorCorrectionLevel: 'H' });
      const { modules } = qrCode;
      const count = modules.size;
      const scale = size / count;

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

      for (let y = 0; y < count; y++) {
        for (let x = 0; x < count; x++) {
          if (modules.data[y * count + x] === 1) {
            const drawX = x * scale;
            const drawY = y * scale;
            const drawSize = scale;

            const isAnchor = (x < 7 && y < 7) || (x >= count - 7 && y < 7) || (x < 7 && y >= count - 7);

            if (isAnchor || styling.dotType === 'square') {
              ctx.fillRect(drawX, drawY, drawSize + 0.5, drawSize + 0.5);
            } else if (styling.dotType === 'circle') {
              ctx.beginPath();
              ctx.arc(drawX + drawSize/2, drawY + drawSize/2, drawSize/2 * 0.85, 0, Math.PI * 2);
              ctx.fill();
            } else if (styling.dotType === 'rounded') {
              if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(drawX + scale * 0.05, drawY + scale * 0.05, drawSize * 0.9, drawSize * 0.9, scale * 0.2);
                ctx.fill();
              } else {
                ctx.fillRect(drawX, drawY, drawSize + 0.5, drawSize + 0.5);
              }
            }
          }
        }
      }

      ctx.restore();

      // Overlay central logo if uploaded
      if (styling.logoUploaded && styling.logoImg) {
        const logoSize = size * 0.22;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        ctx.fillStyle = styling.bgColor;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(logoX - 6, logoY - 6, logoSize + 12, logoSize + 12, size * 0.02);
        } else {
          ctx.rect(logoX - 6, logoY - 6, logoSize + 12, logoSize + 12);
        }
        ctx.fill();

        ctx.drawImage(styling.logoImg, logoX, logoY, logoSize, logoSize);
      }
    } catch (err) {
      console.error("QR drawing failed:", err);
    }
  };

  useEffect(() => {
    drawQRCode();
  }, [mode, inputs, styling]);

  const generateSVGString = () => {
    try {
      const dataString = getPayloadData();
      const qrCode = QRCode.create(dataString, { errorCorrectionLevel: 'H' });
      const { modules } = qrCode;
      const size = modules.size;
      
      let paths = [];
      const isGradient = styling.colorType === 'gradient';
      
      let defs = '';
      let fill = styling.primaryColor;
      if (isGradient) {
        fill = 'url(#qr-grad)';
        defs = `
      <defs>
        <linearGradient id="qr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${styling.primaryColor}" />
          <stop offset="100%" stop-color="${styling.secondaryColor}" />
        </linearGradient>
      </defs>`;
      }
      
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (modules.data[y * size + x] === 1) {
            const isAnchor = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
            
            if (isAnchor || styling.dotType === 'square') {
              paths.push(`<rect x="${x}" y="${y}" width="1.05" height="1.05" fill="${fill}" />`);
            } else if (styling.dotType === 'circle') {
              paths.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.42" fill="${fill}" />`);
            } else if (styling.dotType === 'rounded') {
              paths.push(`<rect x="${x + 0.05}" y="${y + 0.05}" width="0.9" height="0.9" rx="0.18" fill="${fill}" />`);
            }
          }
        }
      }
      
      let logoSvg = '';
      if (styling.logoUploaded && styling.logoImg) {
        const logoSize = size * 0.22;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;
        logoSvg = `
      <rect x="${logoX - 0.15}" y="${logoY - 0.15}" width="${logoSize + 0.3}" height="${logoSize + 0.3}" rx="0.3" fill="${styling.bgColor}" />
      <image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" href="${styling.logoImg.src}" />`;
      }
      
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="1000" height="1000">
      <rect width="100%" height="100%" fill="${styling.bgColor}" />${defs}
      ${paths.join('\n      ')}${logoSvg}
    </svg>`;
    } catch (err) {
      console.error(err);
      return '';
    }
  };

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (format === 'svg') {
      const svgString = generateSVGString();
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `custom_qrcode.svg`;
      link.click();
      addToast('QR Code exported as vector SVG!', 'success');
    } else {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `custom_qrcode.png`;
      link.click();
      addToast('QR Code exported as PNG!', 'success');
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

      <div className="tool-page-grid">
        
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
              width={1000}
              height={1000}
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
