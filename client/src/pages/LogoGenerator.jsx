import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiArrowLeft, FiPenTool, FiDownload, FiZap, FiRefreshCw, FiGrid
} from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

const INDUSTRIES = [
  'Technology & Software', 'Food & Restaurant', 'Fashion & Beauty', 'Real Estate',
  'Finance & Consulting', 'Education & Learning', 'Fitness & Health', 'Creative & Design'
];

const STYLES = [
  { id: 'minimalist', name: 'Minimalist Icon' },
  { id: 'monogram', name: 'Letter Monogram' },
  { id: 'emblem', name: 'Vintage Emblem' },
  { id: 'corporate', name: 'Corporate Grid' }
];

const COLORS = [
  { name: 'Teal Lagoon', primary: '#14b8a6', secondary: '#06b6d4', dark: '#0f172a' },
  { name: 'Sunset Gold', primary: '#f59e0b', secondary: '#d97706', dark: '#1e293b' },
  { name: 'Royal Purple', primary: '#a855f7', secondary: '#7c3aed', dark: '#090514' },
  { name: 'Crimson Slate', primary: '#ef4444', secondary: '#b91c1c', dark: '#18181b' },
  { name: 'Monochrome', primary: '#0f172a', secondary: '#334155', dark: '#ffffff' }
];

export default function LogoGenerator({ tool, setView, setActiveTool, navigate, addToast }) {
  const [form, setForm] = useState({
    name: '',
    slogan: '',
    industry: INDUSTRIES[0],
    style: 'minimalist',
    colorIdx: 0
  });

  const [loading, setLoading] = useState(false);
  
  // Concept parameters
  const [brandAssets, setBrandAssets] = useState({
    slogans: ['Innovate Your Future', 'Precision Coding', 'Digital Mastery'],
    activeSlogan: '',
    concepts: [
      { id: 'concept1', iconType: 'circle-node', font: 'Outfit' },
      { id: 'concept2', iconType: 'box-grid', font: 'Montserrat' },
      { id: 'concept3', iconType: 'abstract-star', font: 'Playfair Display' },
      { id: 'concept4', iconType: 'monogram-letter', font: 'Inter' }
    ],
    activeConceptIdx: 0
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleGenerate = async () => {
    if (!form.name.trim()) return;
    setLoading(true);

    const apiKey = localStorage.getItem('gemini_api_key') || '';
    const promptText = `
Generate 3 catchy taglines/slogans for a company with this name: "${form.name}" operating in the "${form.industry}" industry.
Format your output exactly as a JSON array of strings:
["slogan 1", "slogan 2", "slogan 3"]
Do not add markdown formatting or quotes.
`;

    const formData = new FormData();
    formData.append('tool', 'note-taker');
    formData.append('textContent', promptText);
    if (apiKey) formData.append('apiKey', apiKey);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const taglines = JSON.parse(res.data.result.replace(/```json|```/g, '').trim());
      setBrandAssets(prev => ({
        ...prev,
        slogans: taglines,
        activeSlogan: taglines[0]
      }));
      addToast('Logo concepts generated successfully!', 'success');
    } catch (e) {
      console.error(e);
      // Fallback
      setBrandAssets(prev => ({
        ...prev,
        activeSlogan: prev.slogans[0]
      }));
      addToast('Logo generated with default templates.', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form.name && !brandAssets.activeSlogan) {
      setBrandAssets(p => ({ ...p, activeSlogan: form.slogan || p.slogans[0] }));
    }
  }, [form.name]);

  const activeColor = COLORS[form.colorIdx];
  const activeConcept = brandAssets.concepts[brandAssets.activeConceptIdx];

  const downloadSVG = () => {
    const svgEl = document.getElementById('logo-svg-preview');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.name.toLowerCase().replace(/\s+/g, '_')}_logo.svg`;
    link.click();
    addToast('Logo exported as SVG vector!', 'success');
  };

  const downloadPNG = () => {
    const svgEl = document.getElementById('logo-svg-preview');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1000, 1000);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${form.name.toLowerCase().replace(/\s+/g, '_')}_logo.png`;
      link.click();
      addToast('Logo exported as PNG!', 'success');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
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
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(245,158,11,0.35)'
        }}>
          <FiPenTool />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          AI Logo <span className="text-gradient">Generator</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Instantly generate vector logo concepts for your business, startup, or blog. powered by Gemini AI.
        </p>
      </div>

      {/* Canva Affiliate Hook */}
      <div className="glass-panel" style={{
        padding: '16px 24px', borderRadius: '14px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
        border: '1px solid rgba(245, 158, 11, 0.2)'
      }}>
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Need professional branding assets, vector icons, or business card exports? <strong style={{ color: 'var(--text-main)' }}>Explore Canva Pro.</strong> Get unlimited templates free.
        </div>
        <a href={AFFILIATE_LINKS.canva || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00c4cc', borderColor: '#00c4cc', fontSize: '12.5px', padding: '8px 16px' }}>
          Explore Canva Pro
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">
        
        {/* Left Input form */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#f59e0b' }}>Brand Settings</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Business Name *</label>
            <input type="text" className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Antigravity AI" required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Slogan / Tagline (Optional)</label>
            <input type="text" className="input-field" value={form.slogan} onChange={e => set('slogan', e.target.value)} placeholder="e.g. Next-Gen Intelligence" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Industry Type</label>
            <select className="select-field" value={form.industry} onChange={e => set('industry', e.target.value)}>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Design Style</label>
            <select className="select-field" value={form.style} onChange={e => set('style', e.target.value)}>
              {STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Color Palettes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Color Palette</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {COLORS.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => set('colorIdx', idx)}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%', border: form.colorIdx === idx ? '3px solid var(--accent-color)' : '1px solid var(--border-color)',
                    background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`, cursor: 'pointer'
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !form.name.trim()}
            className="btn btn-primary"
            style={{ height: '48px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', marginTop: '10px' }}
          >
            {loading ? 'AI Generating brand kits...' : 'Generate Brand Concepts'}
          </button>
        </div>

        {/* Right Preview area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          
          {/* Logo SVG Render Canvas */}
          <div className="glass-panel" style={{
            padding: '24px', borderRadius: '24px', background: activeColor.dark,
            border: '1px solid var(--border-color)', width: '100%', maxWidth: '380px', aspectRatio: '1/1',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <svg
              id="logo-svg-preview"
              width="300"
              height="300"
              viewBox="0 0 300 300"
              style={{ overflow: 'visible' }}
            >
              {/* Logo Layout Mark */}
              {form.style === 'minimalist' && (
                <g transform="translate(150, 95)" fill="none" strokeWidth="6" stroke={activeColor.primary}>
                  <circle cx="0" cy="0" r="30" strokeDasharray="6 6" />
                  <polygon points="0,-25 22,12 -22,12" fill={activeColor.secondary} opacity="0.8" />
                </g>
              )}

              {form.style === 'monogram' && (
                <g transform="translate(150, 100)">
                  <rect x="-35" y="-35" width="70" height="70" rx="14" fill="none" strokeWidth="4" stroke={activeColor.primary} />
                  <text x="0" y="15" fill={activeColor.secondary} fontSize="46" fontWeight="bold" fontFamily={activeConcept.font} textAnchor="middle">
                    {(form.name.trim() ? form.name.charAt(0) : 'A').toUpperCase()}
                  </text>
                </g>
              )}

              {form.style === 'emblem' && (
                <g transform="translate(150, 95)">
                  <polygon points="0,-45 40,30 -40,30" fill="none" strokeWidth="4" stroke={activeColor.primary} />
                  <circle cx="0" cy="5" r="24" strokeWidth="3" stroke={activeColor.secondary} fill="none" />
                </g>
              )}

              {form.style === 'corporate' && (
                <g transform="translate(150, 95)" fill={activeColor.primary}>
                  <rect x="-25" y="-25" width="20" height="20" rx="4" />
                  <rect x="5" y="-25" width="20" height="20" rx="4" fill={activeColor.secondary} />
                  <rect x="-25" y="5" width="20" height="20" rx="4" fill={activeColor.secondary} />
                  <rect x="5" y="5" width="20" height="20" rx="4" />
                </g>
              )}

              {/* Title Text */}
              <text
                x="150"
                y="190"
                fill={activeColor.secondary}
                fontSize="24"
                fontWeight="900"
                fontFamily={activeConcept.font}
                textAnchor="middle"
              >
                {form.name || 'BRAND NAME'}
              </text>

              {/* Slogan */}
              <text
                x="150"
                y="215"
                fill={activeColor.primary}
                fontSize="12"
                fontWeight="600"
                letterSpacing="2"
                textAnchor="middle"
              >
                {(form.slogan || brandAssets.activeSlogan || 'ESTABLISHED 2026').toUpperCase()}
              </text>
            </svg>
          </div>

          {/* Alternate Slogans list */}
          {brandAssets.slogans.length > 0 && (
            <div className="glass-panel" style={{ padding: '14px', borderRadius: '12px', width: '100%', maxWidth: '380px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Select Tagline Idea</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {brandAssets.slogans.map(s => (
                  <button
                    key={s}
                    onClick={() => setBrandAssets(prev => ({ ...prev, activeSlogan: s }))}
                    className="btn btn-secondary"
                    style={{
                      fontSize: '12px', padding: '6px 12px', textAlign: 'left',
                      borderColor: brandAssets.activeSlogan === s ? '#f59e0b' : 'var(--border-color)',
                      color: brandAssets.activeSlogan === s ? '#f59e0b' : 'var(--text-main)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Download buttons */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={downloadSVG}>Export SVG Vector</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={downloadPNG}>Export PNG</button>
          </div>

        </div>
      </div>
    </div>
  );
}
