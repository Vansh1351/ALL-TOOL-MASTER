import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  FiArrowLeft, FiEdit3, FiDownload, FiShare2, FiZap, FiCheck, FiCopy, FiMail, FiMessageCircle
} from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

const TEMPLATES = [
  { id: 'modern', name: 'Modern Style', bg: 'linear-gradient(135deg, #1e293b, #0f172a)', text: '#f8fafc', accent: '#06b6d4', font: 'sans-serif' },
  { id: 'luxury', name: 'Luxury Gold', bg: 'linear-gradient(135deg, #1a103c, #0d0626)', text: '#fef08a', accent: '#fbbf24', font: 'serif' },
  { id: 'minimal', name: 'Minimalist', bg: '#ffffff', text: '#0f172a', accent: '#334155', font: 'sans-serif', border: '2px solid #0f172a' },
  { id: 'corporate', name: 'Corporate Grid', bg: 'linear-gradient(135deg, #0f172a, #1e3a8a)', text: '#f8fafc', accent: '#60a5fa', font: 'sans-serif' },
  { id: 'kids', name: 'Kids Pastel', bg: 'linear-gradient(135deg, #e0f2fe, #f0fdf4)', text: '#0369a1', accent: '#f43f5e', font: 'cursive, sans-serif' },
  { id: 'gaming', name: 'Cyber Gaming', bg: '#09090b', text: '#22c55e', accent: '#a855f7', font: 'monospace', border: '1px solid #22c55e' },
  { id: 'floral', name: 'Floral Rose', bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', text: '#9f1239', accent: '#db2777', font: 'serif' },
  { id: 'traditional', name: 'Traditional Indian', bg: 'linear-gradient(135deg, #ea580c, #ca8a04)', text: '#fef08a', accent: '#facc15', font: 'serif' },
  { id: 'wedding', name: 'Elegant Wedding', bg: 'linear-gradient(135deg, #fafaf9, #f5f5f4)', text: '#78350f', accent: '#b45309', font: 'serif', border: '1px solid #d97706' }
];

export default function CardMaker({ tool, setView, setActiveTool, navigate, addToast }) {
  const [form, setForm] = useState({
    name: '',
    eventType: 'Birthday Party',
    date: '2026-07-20',
    time: '18:00',
    venue: 'Skyline Banquet Hall, Mumbai',
    theme: 'modern',
    language: 'English',
    style: 'Elegant',
    tone: 'Joyful'
  });

  const [aiData, setAiData] = useState({
    title: 'Warm Invitation',
    greeting: 'You are cordially invited!',
    message: 'Join us to celebrate a wonderful evening filled with joy and laughter.',
    rsvp: 'RSVP by July 15th to Host.'
  });

  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [sharingOpen, setSharingOpen] = useState(false);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // Call backend AI to write card contents
  const handleGenerate = async () => {
    setLoading(true);
    const apiKey = localStorage.getItem('gemini_api_key') || '';
    const promptText = `
Generate custom invitation card details based on these settings:
- Host/Name: ${form.name || 'Our Guest'}
- Event: ${form.eventType}
- Date: ${form.date}
- Time: ${form.time}
- Venue: ${form.venue}
- Tone: ${form.tone}
- Style: ${form.style}
- Language: ${form.language}

Return EXACTLY a JSON string with these fields:
{
  "title": "Short event title",
  "greeting": "Personalized opening greeting line",
  "message": "Heartfelt 2-3 sentence invitation message body",
  "rsvp": "RSVP instructions line"
}
Do not write markdown quotes or explanations, just raw JSON.
`;

    const formData = new FormData();
    formData.append('tool', 'note-taker');
    formData.append('textContent', promptText);
    if (apiKey) formData.append('apiKey', apiKey);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = JSON.parse(res.data.result.replace(/```json|```/g, '').trim());
      setAiData(data);
      addToast('Card contents updated with AI!', 'success');
    } catch (e) {
      console.error(e);
      addToast('AI generation failed, using template defaults.', 'info');
    } finally {
      setLoading(false);
    }
  };

  // Render to canvas for export
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const template = TEMPLATES.find(t => t.id === form.theme) || TEMPLATES[0];

    // Card background
    if (template.bg.startsWith('linear-gradient')) {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (template.id === 'modern') {
        grad.addColorStop(0, '#1e293b'); grad.addColorStop(1, '#0f172a');
      } else if (template.id === 'luxury') {
        grad.addColorStop(0, '#1a103c'); grad.addColorStop(1, '#0d0626');
      } else if (template.id === 'kids') {
        grad.addColorStop(0, '#e0f2fe'); grad.addColorStop(1, '#f0fdf4');
      } else if (template.id === 'floral') {
        grad.addColorStop(0, '#fff1f2'); grad.addColorStop(1, '#ffe4e6');
      } else if (template.id === 'traditional') {
        grad.addColorStop(0, '#ea580c'); grad.addColorStop(1, '#ca8a04');
      } else if (template.id === 'wedding') {
        grad.addColorStop(0, '#fafaf9'); grad.addColorStop(1, '#f5f5f4');
      } else {
        grad.addColorStop(0, '#0f172a'); grad.addColorStop(1, '#1e3a8a');
      }
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = template.bg;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    if (template.border) {
      ctx.strokeStyle = template.accent;
      ctx.lineWidth = 16;
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    }

    if (template.id === 'wedding' || template.id === 'floral') {
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
      ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);
    }

    // Typography setup
    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = template.accent;
    ctx.font = `bold 42px ${template.font}`;
    ctx.fillText(aiData.title || form.eventType, canvas.width / 2, 90);

    // Greeting
    ctx.fillStyle = template.text;
    ctx.font = `italic 24px ${template.font}`;
    ctx.fillText(aiData.greeting, canvas.width / 2, 160);

    // Host highlight
    if (form.name) {
      ctx.fillStyle = template.accent;
      ctx.font = `bold 22px ${template.font}`;
      ctx.fillText(`Hosted by: ${form.name}`, canvas.width / 2, 210);
    }

    // Message Body
    ctx.fillStyle = template.text;
    ctx.font = `18px ${template.font}`;
    const words = aiData.message.split(' ');
    let line = '';
    let y = 260;
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 100 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 28;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Date & Time
    y += 50;
    ctx.fillStyle = template.accent;
    ctx.font = `bold 24px ${template.font}`;
    ctx.fillText(`${form.date}  |  ${form.time}`, canvas.width / 2, y);

    // Venue
    y += 40;
    ctx.fillStyle = template.text;
    ctx.font = `18px ${template.font}`;
    ctx.fillText(form.venue, canvas.width / 2, y);

    // RSVP
    ctx.fillStyle = template.accent;
    ctx.font = `italic 18px ${template.font}`;
    ctx.fillText(aiData.rsvp, canvas.width / 2, canvas.height - 70);
  };

  useEffect(() => {
    drawCanvas();
  }, [form, aiData]);

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `invitation_${form.eventType.toLowerCase().replace(/\s+/g, '_')}.${format}`;
    link.click();
    addToast(`Card downloaded as ${format.toUpperCase()}!`, 'success');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Invitation link copied!', 'success');
  };

  const activeTemplate = TEMPLATES.find(t => t.id === form.theme) || TEMPLATES[0];

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
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(6,182,212,0.35)'
        }}>
          <FiEdit3 />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          AI Invitation &amp; <span className="text-gradient">Card Maker</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Design premium customized greeting cards and invitations for any celebration. powered by Gemini AI.
        </p>
      </div>

      {/* Canva Affiliate Hook */}
      <div className="glass-panel" style={{
        padding: '16px 24px', borderRadius: '14px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
        border: '1px solid rgba(6, 182, 212, 0.2)'
      }}>
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Need advanced templates, stickers, or folding layouts? <strong style={{ color: 'var(--text-main)' }}>Try Canva.</strong> Explore millions of professional graphics.
        </div>
        <a href={AFFILIATE_LINKS.canva || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00c4cc', borderColor: '#00c4cc', fontSize: '12.5px', padding: '8px 16px' }}>
          Open Canva
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
        
        {/* Left Form controls */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4' }}>
            <FiZap /> Design Parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Host Name</label>
              <input type="text" className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Vansh Shah" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Event Type</label>
              <select className="select-field" value={form.eventType} onChange={e => set('eventType', e.target.value)}>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Wedding Invitation">Wedding Invitation</option>
                <option value="Anniversary Celebration">Anniversary Celebration</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Housewarming Party">Housewarming Party</option>
                <option value="Festival Greetings">Festival Greetings</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Thank You Card">Thank You Card</option>
                <option value="Farewell Card">Farewell Card</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Date</label>
              <input type="date" className="input-field" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Time</label>
              <input type="time" className="input-field" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Venue / Location</label>
            <input type="text" className="input-field" value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="e.g. 5th Avenue, New York" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Design Style</label>
              <select className="select-field" value={form.theme} onChange={e => set('theme', e.target.value)}>
                {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Message Tone</label>
              <select className="select-field" value={form.tone} onChange={e => set('tone', e.target.value)}>
                <option value="Joyful">Joyful</option>
                <option value="Formal">Formal</option>
                <option value="Humorous">Humorous</option>
                <option value="Warm">Warm &amp; Emotional</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Language</label>
              <input type="text" className="input-field" value={form.language} onChange={e => set('language', e.target.value)} placeholder="e.g. English, Hindi" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Copy Style</label>
              <input type="text" className="input-field" value={form.style} onChange={e => set('style', e.target.value)} placeholder="e.g. Classic Calligraphy" />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ height: '48px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', marginTop: '10px' }}
          >
            {loading ? 'AI Writing Copy...' : 'Generate AI Copy & Update Card'}
          </button>
        </div>

        {/* Right Canvas Preview & Exports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          
          {/* Card Frame Preview */}
          <div className="glass-panel" style={{
            padding: '16px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '100%', width: '400px'
          }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={560}
              style={{
                borderRadius: '16px', width: '100%', height: 'auto', display: 'block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          </div>

          {/* Export / Share actions */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('png')}>
              <FiDownload style={{ marginRight: '6px' }} /> Download PNG
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('jpg')}>
              <FiDownload style={{ marginRight: '6px' }} /> Download JPG
            </button>
            <button className="btn btn-secondary" onClick={() => setSharingOpen(!sharingOpen)}>
              <FiShare2 />
            </button>
          </div>

          {sharingOpen && (
            <div className="glass-panel animate-fade-in" style={{ padding: '14px', borderRadius: '12px', width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-around' }}>
              <a href={`https://api.whatsapp.com/send?text=You%20are%20invited%20to%20our%20event!`} target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', fontSize: '20px' }}><FiMessageCircle /></a>
              <a href={`mailto:?subject=Invitation&body=You%20are%20invited!`} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontSize: '20px' }}><FiMail /></a>
              <button onClick={copyShareLink} style={{ background: 'none', border: 'none', color: '#06b6d4', fontSize: '20px', cursor: 'pointer' }}><FiCopy /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
