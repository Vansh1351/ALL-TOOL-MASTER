import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiX, FiDownload, FiCheckCircle, FiAlertCircle, FiZap, FiArrowLeft, FiPackage, FiFile } from 'react-icons/fi';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');
const rawBackupUrl = import.meta.env.VITE_BACKUP_API_URL || '';
const BACKUP_URL = rawBackupUrl ? rawBackupUrl.replace(/\/+$/, '') : '';

const COMPRESSION_LEVELS = [
  { value: 1, label: 'Fast', desc: 'Light compression · 10–20% size reduction', color: '#10b981' },
  { value: 5, label: 'Balanced', desc: 'Good compression · 20–50% size reduction', color: '#f59e0b' },
  { value: 9, label: 'Maximum', desc: 'Maximum compression · 50–80% size reduction', color: '#ef4444' },
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function FileCompressor({ tool, setView, setActiveTool, addToHistory, navigate }) {
  const [files, setFiles] = useState([]);
  const [compressionLevel, setCompressionLevel] = useState(5);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadBlobUrl, setDownloadBlobUrl] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');
  const [isMultiFile, setIsMultiFile] = useState(false);
  const [compressedSize, setCompressedSize] = useState(0);
  const fileInputRef = useRef(null);

  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size));
      const unique = fileArray.filter(f => !existing.has(f.name + f.size));
      return [...prev, ...unique];
    });
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const selectedLevel = COMPRESSION_LEVELS.find(l => l.value === compressionLevel) || COMPRESSION_LEVELS[1];

  const handleCompress = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setProgress(10);
    setErrorMessage('');

    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('compressionLevel', String(compressionLevel));

    const tryRequest = async (baseUrl) => {
      return axios.post(`${baseUrl}/api/compress`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || e.loaded));
          setProgress(10 + pct * 0.6);
        },
        onDownloadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || e.loaded));
          setProgress(70 + pct * 0.28);
        }
      });
    };

    try {
      let response;
      try {
        response = await tryRequest(BACKEND_URL);
      } catch (err) {
        if (BACKUP_URL && BACKUP_URL !== BACKEND_URL) {
          response = await tryRequest(BACKUP_URL);
        } else throw err;
      }

      const blob = response.data;
      setCompressedSize(blob.size);
      const cd = response.headers['content-disposition'];
      let filename = files.length === 1 ? files[0].name : 'compressed_files.zip';
      if (cd) {
        const m = cd.match(/filename[^;=\n]*=(["']?)([^"'\n;]+)\1/);
        if (m && m[2]) filename = decodeURIComponent(m[2]);
      }
      const multi = files.length > 1;
      setIsMultiFile(multi);
      const blobUrl = window.URL.createObjectURL(blob);
      setDownloadBlobUrl(blobUrl);
      setDownloadFilename(filename);
      setStatus('success');
      setProgress(100);
      if (addToHistory) {
        addToHistory({
          toolTitle: 'File Compressor',
          fileName: `${files.length} file(s)`,
          outputName: filename,
          type: 'compression',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (err) {
      console.error(err);
      let msg = 'Compression failed. Please try again.';
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try { msg = JSON.parse(text).error || msg; } catch { msg = text.replace(/<[^>]+>/g, '').trim().slice(0, 300) || msg; }
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const reset = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setDownloadBlobUrl('');
    setDownloadFilename('');
    setIsMultiFile(false);
    setCompressedSize(0);
  };

  const savings = totalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round((1 - compressedSize / totalSize) * 100))
    : 0;

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
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(249,115,22,0.35)'
        }}>
          <FiPackage />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          File <span className="text-gradient">Compressor</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '560px', margin: '0 auto' }}>
          Upload any files — images, videos, documents, archives — and compress them into a single optimized ZIP.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '28px', alignItems: 'start' }}
           className="tool-page-grid">

        {/* Left: Dropzone + File List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Drop Zone */}
          {status === 'idle' && (
            <div
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{
                border: `2px dashed ${dragActive ? 'var(--accent-color)' : 'var(--border-color)'}`,
                borderRadius: '20px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                background: dragActive ? 'rgba(var(--accent-rgb),0.04)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <input type="file" ref={fileInputRef} multiple style={{ display: 'none' }} onChange={handleFileChange} />
              <FiUploadCloud size={48} style={{ color: '#f97316', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '800', marginBottom: '6px' }}>
                Drop files here or click to browse
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Supports all file types — images, videos, PDFs, archives, documents, and more
              </p>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && status === 'idle' && (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '800', fontSize: '14px' }}>
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400', marginLeft: '8px' }}>
                    ({formatBytes(totalSize)} total)
                  </span>
                </span>
                <button className="btn btn-secondary" onClick={reset} style={{ padding: '4px 12px', fontSize: '12px' }}>
                  Clear All
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {files.map((f, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '10px',
                    background: 'var(--bg-grid)', border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontSize: '20px', flexShrink: 0 }}>
                      {f.type.startsWith('image/') ? '🖼️' :
                       f.type.startsWith('video/') ? '🎬' :
                       f.type.startsWith('audio/') ? '🎵' :
                       f.type === 'application/pdf' ? '📄' :
                       f.name.endsWith('.zip') || f.name.endsWith('.rar') ? '📦' : '📁'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '700', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.name}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatBytes(f.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', flexShrink: 0 }}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {/* Add more */}
              <button
                className="btn btn-secondary"
                onClick={() => fileInputRef.current.click()}
                style={{ width: '100%', marginTop: '12px', fontSize: '13px' }}
              >
                + Add More Files
              </button>
            </div>
          )}

          {/* Processing */}
          {status === 'processing' && (
            <div className="glass-panel" style={{ borderRadius: '20px', padding: '48px 24px', textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px', border: '4px solid var(--border-color)',
                borderTop: '4px solid #f97316', borderRadius: '50%',
                margin: '0 auto 20px auto', animation: 'spin 1s linear infinite'
              }} />
              <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Compressing Files...</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Packing {files.length} file(s) with {selectedLevel.label} compression
              </p>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-grid)', borderRadius: '99px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#f97316' }}>{Math.round(progress)}% Complete</span>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="glass-panel" style={{ borderRadius: '20px', padding: '40px 24px', textAlign: 'center' }}>
              <FiCheckCircle size={60} style={{ color: '#10b981', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '6px' }}>Compression Complete!</h4>
              {savings > 0 && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(16,185,129,0.1)', color: '#10b981',
                  padding: '6px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '700',
                  marginBottom: '12px'
                }}>
                  <FiZap size={14} /> Saved ~{savings}% space
                </div>
              )}
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Original: {formatBytes(totalSize)} → Compressed: {formatBytes(compressedSize)}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>
                {isMultiFile
                  ? <>Files packed in: <strong>{downloadFilename}</strong></>
                  : <>Ready: <strong>{downloadFilename}</strong> · same format, smaller size</>}
              </p>
              <a
                href={downloadBlobUrl}
                download={downloadFilename}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '14px 28px', fontSize: '15px', fontWeight: '800' }}
              >
                <FiDownload />
                {isMultiFile ? `Download ZIP (${files.length} files)` : `Download ${downloadFilename}`}
              </a>
              <button className="btn btn-secondary" onClick={reset} style={{ display: 'block', width: '100%', marginTop: '16px' }}>
                Compress More Files
              </button>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="glass-panel" style={{ borderRadius: '20px', padding: '40px 24px', textAlign: 'center' }}>
              <FiAlertCircle size={56} style={{ color: '#ef4444', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Compression Failed</h4>
              <p style={{
                fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px',
                maxHeight: '120px', overflowY: 'auto', padding: '10px',
                background: 'rgba(239,68,68,0.07)', borderRadius: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
              }}>
                {errorMessage}
              </p>
              <button className="btn btn-primary" onClick={() => setStatus('idle')} style={{ width: '100%' }}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Right: Compression Settings + Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Compression Level */}
          <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>⚙️ Compression Settings</h3>

            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', display: 'block' }}>
              Compression Level
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {COMPRESSION_LEVELS.map(level => (
                <button
                  key={level.value}
                  onClick={() => setCompressionLevel(level.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                    borderRadius: '10px', border: `2px solid ${compressionLevel === level.value ? level.color : 'var(--border-color)'}`,
                    background: compressionLevel === level.value ? `${level.color}12` : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: compressionLevel === level.value ? level.color : 'var(--border-color)',
                    flexShrink: 0, transition: 'background 0.15s'
                  }} />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: compressionLevel === level.value ? level.color : 'var(--text-main)' }}>
                      {level.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{level.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>📊 Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Files selected', value: files.length },
                { label: 'Total size', value: formatBytes(totalSize) },
                { label: 'Compression', value: selectedLevel.label },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                  <span style={{ fontWeight: '800' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Button */}
          {status === 'idle' && (
            <button
              className="btn btn-primary"
              onClick={handleCompress}
              disabled={files.length === 0}
              style={{
                height: '52px', fontSize: '15px', fontWeight: '800',
                background: files.length === 0 ? 'var(--bg-grid)' : 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none', cursor: files.length === 0 ? 'not-allowed' : 'pointer',
                opacity: files.length === 0 ? 0.5 : 1
              }}
            >
              <FiPackage style={{ marginRight: '8px' }} />
              {files.length === 0 ? 'Select Files to Start' : `Compress ${files.length} File${files.length > 1 ? 's' : ''}`}
            </button>
          )}

          {/* Info Box */}
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              💡 <strong>How it works:</strong> Videos and audio are re-encoded with quality control (FFmpeg). Images are optimized with lossless-to-lossy compression (Sharp). Files are returned in their <em>original format</em> with the same name — no ZIP wrapping for single files.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) { .tool-page-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
