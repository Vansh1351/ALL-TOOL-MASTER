import React, { useState } from 'react';
import axios from 'axios';
import {
  FiArrowLeft, FiEdit3, FiCheckCircle, FiAlertCircle, FiCopy, FiDownload, FiZap
} from 'react-icons/fi';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');
const rawBackupUrl = import.meta.env.VITE_BACKUP_API_URL || '';
const BACKUP_URL = rawBackupUrl ? rawBackupUrl.replace(/\/+$/, '') : '';

const GENRES = [
  'Drama', 'Comedy', 'Action / Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Fantasy',
  'Documentary', 'Short Film', 'YouTube Video', 'Podcast Episode', 'Advertisement / Commercial',
  'Explainer Video', 'Social Media Reel', 'Motivational Speech', 'News Report', 'Animation'
];

const TONES = [
  'Professional & Formal', 'Casual & Conversational', 'Humorous & Witty',
  'Dramatic & Emotional', 'Suspenseful & Tense', 'Inspirational & Uplifting',
  'Dark & Gritty', 'Whimsical & Playful', 'Educational & Informative'
];

const LENGTHS = [
  { value: 'short', label: 'Short (~5 min)', desc: 'Ideal for ads, reels, YouTube shorts' },
  { value: 'medium', label: 'Medium (~15 min)', desc: 'Perfect for YouTube, podcasts, short films' },
  { value: 'long', label: 'Long (~30+ min)', desc: 'Full-length content, movies, episodes' },
];

export default function ScriptWriter({ tool, setView, setActiveTool, navigate }) {
  const [form, setForm] = useState({
    title: '', genre: 'Drama', tone: 'Professional & Formal', length: 'medium',
    premise: '', characters: '', audience: '', extraNotes: ''
  });
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [script, setScript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    alert('Script copied to clipboard!');
  };

  const downloadScript = () => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(form.title || 'script').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    if (!form.title.trim() || !form.premise.trim()) return;
    setStatus('processing');
    setProgress(15);
    setErrorMessage('');
    setScript('');

    const apiKey = localStorage.getItem('gemini_api_key') || '';
    const textContent = `
SCRIPT REQUEST:
- Title: ${form.title}
- Genre: ${form.genre}
- Tone: ${form.tone}
- Script Length: ${form.length}
- Main Premise / Story Description: ${form.premise}
- Main Characters: ${form.characters || 'As determined by the story'}
- Target Audience: ${form.audience || 'General audience'}
- Additional Notes: ${form.extraNotes || 'None'}
`.trim();

    const formData = new FormData();
    formData.append('tool', 'ai-script-writer');
    formData.append('textContent', textContent);
    if (apiKey && apiKey.length > 10 && !apiKey.toLowerCase().includes('your_')) {
      formData.append('apiKey', apiKey);
    }

    const tryRequest = async (baseUrl) => axios.post(`${baseUrl}/api/ai`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const pct = Math.round((e.loaded * 100) / (e.total || e.loaded));
        setProgress(15 + pct * 0.2);
      }
    });

    try {
      let response;
      try {
        setProgress(35);
        response = await tryRequest(BACKEND_URL);
      } catch (err) {
        if (BACKUP_URL && BACKUP_URL !== BACKEND_URL) {
          setProgress(20);
          response = await tryRequest(BACKUP_URL);
        } else throw err;
      }

      setProgress(95);
      setScript(response.data.result || '');
      setStatus('success');
      setProgress(100);
    } catch (err) {
      console.error(err);
      let msg = 'Script generation failed. Please try again.';
      if (err.response?.data?.error) msg = err.response.data.error;
      else if (err.message) msg = err.message;
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const isReady = form.title.trim() && form.premise.trim();

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 0 80px 0' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => { if (setView) setView('dashboard'); if (setActiveTool) setActiveTool(null); }}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(168,85,247,0.35)'
        }}>
          <FiEdit3 />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          AI Script <span className="text-gradient">Writer</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '580px', margin: '0 auto' }}>
          Enter your title, genre, and premise — our AI generates a full professional script from start to finish.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">

        {/* ===== LEFT: FORM ===== */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7' }}>
            <FiZap /> Script Details
          </h3>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Script Title *
            </label>
            <input
              type="text" className="input-field" placeholder="e.g. The Last Signal"
              value={form.title} onChange={e => set('title', e.target.value)}
              style={{ fontSize: '14px' }}
            />
          </div>

          {/* Genre + Tone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Genre</label>
              <select className="select-field" value={form.genre} onChange={e => set('genre', e.target.value)} style={{ fontSize: '13px' }}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tone</label>
              <select className="select-field" value={form.tone} onChange={e => set('tone', e.target.value)} style={{ fontSize: '13px' }}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Script Length */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Script Length</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {LENGTHS.map(l => (
                <button key={l.value} onClick={() => set('length', l.value)} style={{
                  flex: 1, padding: '10px 6px', borderRadius: '10px', fontSize: '11px', fontWeight: '700',
                  border: `2px solid ${form.length === l.value ? '#a855f7' : 'var(--border-color)'}`,
                  background: form.length === l.value ? 'rgba(168,85,247,0.1)' : 'transparent',
                  color: form.length === l.value ? '#a855f7' : 'var(--text-muted)',
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s'
                }}>
                  <div style={{ fontWeight: '800', fontSize: '12px', marginBottom: '2px' }}>{l.label}</div>
                  <div style={{ fontWeight: '400', fontSize: '10px', opacity: 0.8 }}>{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Premise */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Premise / Story Description *
            </label>
            <textarea
              className="input-field" rows={4} style={{ resize: 'vertical', fontSize: '13px' }}
              placeholder="Describe your story, topic, or content in detail. The more specific you are, the better the script. e.g. 'A lone astronaut discovers a mysterious signal from an abandoned space station and must decide whether to investigate...'"
              value={form.premise} onChange={e => set('premise', e.target.value)}
            />
          </div>

          {/* Characters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Main Characters (optional)
            </label>
            <textarea
              className="input-field" rows={2} style={{ resize: 'vertical', fontSize: '13px' }}
              placeholder="e.g. ARIA - a fearless astronaut in her 30s; MISSION CONTROL - calm, calculating..."
              value={form.characters} onChange={e => set('characters', e.target.value)}
            />
          </div>

          {/* Audience + Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Audience</label>
              <input type="text" className="input-field" placeholder="e.g. Adults 18-35" style={{ fontSize: '13px' }}
                value={form.audience} onChange={e => set('audience', e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Extra Notes</label>
              <input type="text" className="input-field" placeholder="e.g. Include twist ending" style={{ fontSize: '13px' }}
                value={form.extraNotes} onChange={e => set('extraNotes', e.target.value)} />
            </div>
          </div>

          {/* Gemini Key Note */}
          {!localStorage.getItem('gemini_api_key') && (
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)', fontSize: '12px', color: 'var(--text-muted)' }}>
              💡 For best results, add your <strong>Gemini API Key</strong> in Settings (⚙️ top-right corner).
            </div>
          )}

          {/* Generate Button */}
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={!isReady || status === 'processing'}
            style={{
              height: '52px', fontSize: '15px', fontWeight: '800',
              background: isReady && status !== 'processing' ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'var(--bg-grid)',
              border: 'none', cursor: !isReady || status === 'processing' ? 'not-allowed' : 'pointer',
              opacity: !isReady || status === 'processing' ? 0.5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            <FiEdit3 />
            {status === 'processing' ? 'Writing Script...' : 'Generate Full Script →'}
          </button>
        </div>

        {/* ===== RIGHT: OUTPUT ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* IDLE placeholder */}
          {status === 'idle' && (
            <div className="glass-panel" style={{ borderRadius: '20px', padding: '60px 32px', textAlign: 'center' }}>
              <FiEdit3 size={52} style={{ color: '#a855f7', opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', opacity: 0.5 }}>Your Script Appears Here</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', opacity: 0.5 }}>
                Fill in the details on the left and click "Generate Full Script" to begin.
              </p>
            </div>
          )}

          {/* PROCESSING */}
          {status === 'processing' && (
            <div className="glass-panel" style={{ borderRadius: '20px', padding: '60px 32px', textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', border: '4px solid var(--border-color)',
                borderTop: '4px solid #a855f7', borderRadius: '50%',
                margin: '0 auto 20px auto', animation: 'spin 1s linear infinite'
              }} />
              <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>AI is Writing Your Script...</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Crafting a {form.genre} script in {form.tone.toLowerCase()} tone
              </p>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-grid)', borderRadius: '99px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #7c3aed)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#a855f7' }}>{Math.round(progress)}%</span>
            </div>
          )}

          {/* SUCCESS */}
          {status === 'success' && script && (
            <>
              {/* Action bar */}
              <div className="glass-panel" style={{ borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                  <FiCheckCircle size={18} />
                  <span style={{ fontWeight: '800', fontSize: '14px' }}>Script Generated!</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>
                    — {form.genre} · {LENGTHS.find(l => l.value === form.length)?.label}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" onClick={copyScript} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px' }}>
                    <FiCopy size={13} /> Copy
                  </button>
                  <button className="btn btn-secondary" onClick={downloadScript} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px' }}>
                    <FiDownload size={13} /> Download .txt
                  </button>
                  <button className="btn btn-secondary" onClick={() => setStatus('idle')} style={{ padding: '8px 14px', fontSize: '13px' }}>
                    New Script
                  </button>
                </div>
              </div>

              {/* Script output */}
              <div className="glass-panel" style={{
                borderRadius: '16px', padding: '28px',
                maxHeight: '70vh', overflowY: 'auto',
                background: 'var(--bg-grid)',
                fontFamily: "'Courier New', monospace",
                fontSize: '13px', lineHeight: '1.8',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                color: 'var(--text-main)'
              }}>
                {script}
              </div>
            </>
          )}

          {/* ERROR */}
          {status === 'error' && (
            <div className="glass-panel" style={{ borderRadius: '20px', padding: '40px 24px', textAlign: 'center' }}>
              <FiAlertCircle size={52} style={{ color: '#ef4444', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Generation Failed</h4>
              <p style={{
                fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px',
                maxHeight: '120px', overflowY: 'auto', padding: '10px',
                background: 'rgba(239,68,68,0.07)', borderRadius: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
              }}>
                {errorMessage}
              </p>
              <button className="btn btn-primary" onClick={() => setStatus('idle')} style={{ width: '100%', background: 'linear-gradient(135deg, #a855f7, #7c3aed)', border: 'none' }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) { .tool-page-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
