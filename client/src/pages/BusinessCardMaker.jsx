import React, { useState, useRef, useEffect } from 'react';
import {
  FiArrowLeft, FiBriefcase, FiDownload, FiZap, FiUpload, FiRefreshCw
} from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

const LAYOUTS = [
  { id: 'modern', name: 'Modern Teal', bg: '#0f172a', text: '#f8fafc', accent: '#06b6d4', font: 'sans-serif' },
  { id: 'minimalist', name: 'Clean Minimalist', bg: '#ffffff', text: '#0f172a', accent: '#64748b', font: 'sans-serif', border: '1px solid #e2e8f0' },
  { id: 'corporate', name: 'Corporate Navy', bg: '#0b1329', text: '#ffffff', accent: '#f59e0b', font: 'serif' },
  { id: 'creative', name: 'Creative Purple', bg: 'linear-gradient(135deg, #3b0764, #1d003b)', text: '#f5f3ff', accent: '#c084fc', font: 'sans-serif' }
];

export default function BusinessCardMaker({ tool, setView, setActiveTool, navigate, addToast }) {
  const [form, setForm] = useState({
    name: 'Vansh Shah',
    title: 'Senior Software Engineer',
    company: 'All Tool Master',
    phone: '+91 98209 01789',
    email: 'vhshah1711@gmail.com',
    website: 'https://alltoolmaster.me',
    address: 'Mumbai, India',
    slogan: 'Instant Utilities & Creative Studio Solutions',
    layoutId: 'modern',
    showQr: true
  });

  const [logoImg, setLogoImg] = useState(null);
  const [cardSide, setCardSide] = useState('front'); // front, back

  const canvasRef = useRef(null);

  const setVal = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setLogoImg(img);
        addToast('Logo loaded and added to card.', 'success');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const layout = LAYOUTS.find(l => l.id === form.layoutId) || LAYOUTS[0];

    const w = canvas.width;
    const h = canvas.height;

    // Card background
    if (layout.bg.startsWith('linear-gradient')) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#3b0764');
      grad.addColorStop(1, '#1d003b');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = layout.bg;
    }
    ctx.fillRect(0, 0, w, h);

    if (layout.border) {
      ctx.strokeStyle = layout.accent;
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, w - 4, h - 4);
    }

    // Modern left color stripe accent
    if (layout.id === 'modern') {
      ctx.fillStyle = layout.accent;
      ctx.fillRect(0, 0, 16, h);
    }

    if (cardSide === 'front') {
      // Draw Corporate Logo
      if (logoImg) {
        ctx.drawImage(logoImg, 40, 45, 60, 60);
      } else {
        // Fallback Logo Icon drawing
        ctx.fillStyle = layout.accent;
        ctx.beginPath();
        ctx.arc(70, 75, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = layout.bg.startsWith('linear-gradient') ? '#ffffff' : layout.bg;
        ctx.font = `bold 16px ${layout.font}`;
        ctx.textAlign = 'center';
        ctx.fillText(form.company.charAt(0), 70, 81);
      }

      // Company Name
      ctx.fillStyle = layout.text;
      ctx.font = `bold 22px ${layout.font}`;
      ctx.textAlign = 'left';
      ctx.fillText(form.company, 115, 80);

      // Slogan
      ctx.fillStyle = layout.accent;
      ctx.font = `italic 11px ${layout.font}`;
      ctx.fillText(form.slogan.slice(0, 40), 115, 96);

      // Divider line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 125);
      ctx.lineTo(w - 40, 125);
      ctx.stroke();

      // Full Name
      ctx.fillStyle = layout.text;
      ctx.font = `bold 24px ${layout.font}`;
      ctx.fillText(form.name, 40, 165);

      // Job Title
      ctx.fillStyle = layout.accent;
      ctx.font = `600 13px ${layout.font}`;
      ctx.fillText(form.title, 40, 185);

      // Coordinates/Details Panel (Lower Half)
      ctx.fillStyle = layout.id === 'minimalist' ? '#334155' : 'rgba(255,255,255,0.7)';
      ctx.font = `12px ${layout.font}`;

      ctx.fillText(`📞  ${form.phone}`, 40, 220);
      ctx.fillText(`✉️  ${form.email}`, 40, 240);
      ctx.fillText(`🌐  ${form.website}`, w / 2 + 10, 220);
      ctx.fillText(`📍  ${form.address}`, w / 2 + 10, 240);

    } else {
      // BACK SIDE of the card
      ctx.textAlign = 'center';

      // Draw Center Logo
      if (logoImg) {
        ctx.drawImage(logoImg, w / 2 - 40, 45, 80, 80);
      } else {
        ctx.fillStyle = layout.accent;
        ctx.beginPath();
        ctx.arc(w / 2, 85, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = layout.bg.startsWith('linear-gradient') ? '#ffffff' : layout.bg;
        ctx.font = `bold 24px ${layout.font}`;
        ctx.fillText(form.company.charAt(0), w / 2, 93);
      }

      // Company Name
      ctx.fillStyle = layout.text;
      ctx.font = `bold 26px ${layout.font}`;
      ctx.fillText(form.company, w / 2, 160);

      // Slogan
      ctx.fillStyle = layout.accent;
      ctx.font = `italic 13px ${layout.font}`;
      ctx.fillText(form.slogan, w / 2, 182);

      // QR Code box overlay
      if (form.showQr) {
        // vCard data payload
        const vcardData = encodeURIComponent(
          `BEGIN:VCARD\nVERSION:3.0\nN:${form.name}\nORG:${form.company}\nTEL:${form.phone}\nEMAIL:${form.email}\nEND:VCARD`
        );
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&margin=0&data=${vcardData}`;

        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          // Draw white card frame for QR to mask background colors
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(w / 2 - 44, h - 94, 88, 88);
          ctx.drawImage(qrImg, w / 2 - 40, h - 90, 80, 80);
        };
        qrImg.src = qrUrl;
      }
    }
  };

  useEffect(() => {
    drawCard();
  }, [form, cardSide, logoImg]);

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `business_card_${cardSide}.${format}`;
    link.click();
    addToast(`Card ${cardSide.toUpperCase()} page exported!`, 'success');
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
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(14,165,233,0.35)'
        }}>
          <FiBriefcase />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          Business <span className="text-gradient">Card Maker</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Design double-sided professional visiting cards with scannable vCard contact QR codes.
        </p>
      </div>

      {/* Canva Affiliate Hook (Temporarily Hidden) */}
      {false && (
      <div className="glass-panel" style={{
        padding: '16px 24px', borderRadius: '14px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
        border: '1px solid rgba(14, 165, 233, 0.2)'
      }}>
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Looking for premium physical prints or dynamic folding cards? <strong style={{ color: 'var(--text-main)' }}>Explore Canva Pro.</strong> Save on custom template printing.
        </div>
        <a href={AFFILIATE_LINKS.canva || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00c4cc', borderColor: '#00c4cc', fontSize: '12.5px', padding: '8px 16px' }}>
          Open Canva
        </a>
      </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
        
        {/* Left Form */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#0ea5e9' }}>Card Coordinates</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Full Name</label>
              <input type="text" className="input-field" value={form.name} onChange={e => setVal('name', e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Job Title</label>
              <input type="text" className="input-field" value={form.title} onChange={e => setVal('title', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Company Name</label>
              <input type="text" className="input-field" value={form.company} onChange={e => setVal('company', e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Company Slogan</label>
              <input type="text" className="input-field" value={form.slogan} onChange={e => setVal('slogan', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Phone Number</label>
              <input type="text" className="input-field" value={form.phone} onChange={e => setVal('phone', e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Email Address</label>
              <input type="email" className="input-field" value={form.email} onChange={e => setVal('email', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Website URL</label>
              <input type="text" className="input-field" value={form.website} onChange={e => setVal('website', e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Address Location</label>
              <input type="text" className="input-field" value={form.address} onChange={e => setVal('address', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Card Preset Style</label>
              <select className="select-field" value={form.layoutId} onChange={e => setVal('layoutId', e.target.value)}>
                {LAYOUTS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Back QR Code</label>
              <select className="select-field" value={form.showQr ? 'yes' : 'no'} onChange={e => setVal('showQr', e.target.value === 'yes')}>
                <option value="yes">Include Scan-to-Save vCard</option>
                <option value="no">No QR Code</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Upload Brand Logo</label>
            <div className="glass-panel" style={{ padding: '16px', border: '2px dashed var(--border-color)', position: 'relative', textAlign: 'center' }}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <FiUpload size={18} style={{ color: '#0ea5e9', marginBottom: '4px' }} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PNG/JPG Logo with transparent background recommended</div>
            </div>
          </div>

        </div>

        {/* Right Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          
          {/* Card page switch */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px' }}>
            <button className={`btn ${cardSide === 'front' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCardSide('front')} style={{ flex: 1, background: cardSide === 'front' ? '#0ea5e9' : 'transparent', borderColor: '#0ea5e9' }}>Card Front</button>
            <button className={`btn ${cardSide === 'back' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCardSide('back')} style={{ flex: 1, background: cardSide === 'back' ? '#0ea5e9' : 'transparent', borderColor: '#0ea5e9' }}>Card Back</button>
          </div>

          {/* Canvas Render Frame */}
          <div className="glass-panel" style={{
            padding: '16px', borderRadius: '24px', background: 'rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)', width: '100%', maxWidth: '380px',
            display: 'flex', justifyContent: 'center'
          }}>
            <canvas
              ref={canvasRef}
              width={525} // Standard 3.5" ratio x150
              height={300} // Standard 2.0" ratio x150
              style={{
                borderRadius: '12px', width: '100%', height: 'auto', display: 'block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          </div>

          {/* Export action */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('png')}>Export as PNG</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('pdf')}>Export print PDF</button>
          </div>

        </div>
      </div>
    </div>
  );
}
