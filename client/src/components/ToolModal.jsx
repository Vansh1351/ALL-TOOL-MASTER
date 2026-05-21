import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  FiX, FiDownload, FiUploadCloud, FiClipboard, 
  FiCheckCircle, FiAlertCircle, FiCopy, FiFile 
} from 'react-icons/fi';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ToolModal({ tool, onClose, addToHistory }) {
  if (!tool) return null;

  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [quality, setQuality] = useState('best');
  
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [downloadBlobUrl, setDownloadBlobUrl] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Set default format based on tool category
  React.useEffect(() => {
    if (tool.id === 'mp4-to-mp3') setTargetFormat('mp4');
    else if (tool.id === 'image-converter') setTargetFormat('png');
    else if (tool.id === 'pdf-converter') setTargetFormat('docx');
    else if (tool.id === 'zip-extractor') setTargetFormat('unzip');
    else setTargetFormat('mp4');
    
    // Reset state
    setUrl('');
    setFile(null);
    setTextInput('');
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setAiResult('');
    setDownloadBlobUrl('');
  }, [tool]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      alert('Could not access clipboard. Please paste manually.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResult);
    alert('Copied to clipboard!');
  };

  const handleProcess = async () => {
    setStatus('processing');
    setProgress(20);
    setErrorMessage('');

    // Fetch API Key from localStorage if available
    const apiKey = localStorage.getItem('gemini_api_key') || '';

    try {
      // 1. DOWNLOADER TOOLS
      if (tool.category === 'Downloader') {
        if (!url) throw new Error('Please enter a valid URL.');
        setProgress(40);
        
        const response = await axios.post(`${BACKEND_URL}/api/download`, {
          url,
          format: targetFormat,
          quality
        }, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded));
            setProgress(60 + percent * 0.35); // Scale progress
          }
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `downloaded_file.${targetFormat}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match) filename = match[1];
        }

        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadBlobUrl(blobUrl);
        setDownloadFilename(filename);
        setStatus('success');
        setProgress(100);
        addToHistory({
          toolTitle: tool.title,
          fileName: filename,
          type: 'download',
          timestamp: new Date().toLocaleTimeString()
        });

      // 2. CONVERTER TOOLS
      } else if (tool.category === 'Converter' || tool.category === 'Utility') {
        if (!file) throw new Error('Please select or drag a file to convert.');
        setProgress(30);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetFormat', targetFormat);

        const response = await axios.post(`${BACKEND_URL}/api/convert`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(30 + percent * 0.3); // Upload progress is first 30-60%
          },
          onDownloadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded));
            setProgress(70 + percent * 0.25); // Download result progress
          }
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `converted_file.${targetFormat}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match) filename = match[1];
        }

        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadBlobUrl(blobUrl);
        setDownloadFilename(filename);
        setStatus('success');
        setProgress(100);
        addToHistory({
          toolTitle: tool.title,
          fileName: file.name,
          outputName: filename,
          type: 'conversion',
          timestamp: new Date().toLocaleTimeString()
        });

      // 3. AI SUITE TOOLS
      } else if (tool.category === 'AI Tool') {
        if (!file && !textInput) {
          throw new Error('Please upload an audio/video/pdf file or write text content for analysis.');
        }
        setProgress(35);

        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('tool', tool.id);
        if (textInput) formData.append('textContent', textInput);
        if (apiKey && apiKey.length > 10 && !apiKey.toLowerCase().includes('your_')) {
          formData.append('apiKey', apiKey);
        }

        const response = await axios.post(`${BACKEND_URL}/api/ai`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(30 + percent * 0.4);
          }
        });

        setProgress(90);
        setAiResult(response.data.result);
        setStatus('success');
        setProgress(100);
        addToHistory({
          toolTitle: tool.title,
          fileName: file ? file.name : 'Text Input',
          type: 'ai-report',
          timestamp: new Date().toLocaleTimeString()
        });
      }

    } catch (err) {
      console.error(err);
      let errMsg = 'Something went wrong during processing. Please try again.';
      if (err.response && err.response.data) {
        // Axios error response is blob if responseType was blob
        if (err.response.data instanceof Blob) {
          const text = await err.response.data.text();
          try {
            const parsed = JSON.parse(text);
            errMsg = parsed.error || errMsg;
          } catch(e) {
            errMsg = text || errMsg;
          }
        } else {
          errMsg = err.response.data.error || errMsg;
        }
      } else if (err.message) {
        errMsg = err.message;
      }
      setErrorMessage(errMsg);
      setStatus('error');
    }
  };

  const getFormatSelector = () => {
    if (tool.id === 'mp4-to-mp3') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="mp4">MP4 (Video)</option>
          <option value="mov">MOV (QuickTime Video)</option>
          <option value="mp3">MP3 (Audio Extract)</option>
          <option value="wav">WAV (Lossless Audio)</option>
          <option value="zip">ZIP (Compressed Archive)</option>
        </select>
      );
    }
    if (tool.id === 'image-converter') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="png">PNG (Portable Network Graphics)</option>
          <option value="jpg">JPG (JPEG Image)</option>
          <option value="webp">WEBP (Modern Web Image)</option>
          <option value="pdf">PDF (Document Format)</option>
          <option value="docx">DOCX (Word Document)</option>
          <option value="zip">ZIP (Compressed Archive)</option>
        </select>
      );
    }
    if (tool.id === 'pdf-converter') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="docx">DOCX (Word Document)</option>
          <option value="jpg">JPG (Image Card)</option>
          <option value="png">PNG (Image Card)</option>
          <option value="zip">ZIP (Compressed Archive)</option>
        </select>
      );
    }
    if (tool.id === 'zip-extractor') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="unzip">Extract All Files (Return ZIP)</option>
        </select>
      );
    }
    if (tool.category === 'Downloader') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="mp4">MP4 (Video)</option>
          <option value="mp3">MP3 (Audio Extract)</option>
        </select>
      );
    }
    return null;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }} className="animate-fade-in">
      
      <div 
        className="glass-panel animate-slide-up" 
        style={{
          width: '100%',
          maxWidth: tool.category === 'AI Tool' && status === 'success' ? '900px' : '550px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '30px',
          borderRadius: '24px',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="btn-icon" 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            fontSize: '16px'
          }}
        >
          <FiX />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {React.createElement(tool.icon)}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{tool.title}</h3>
            <span className="badge" style={{ marginTop: '4px' }}>{tool.category}</span>
          </div>
        </div>

        {/* Status Indicators */}
        {status === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 1. Downloader Layout */}
            {tool.category === 'Downloader' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Paste Media URL</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="url"
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="input-field"
                    />
                    <button className="btn btn-secondary" onClick={handlePaste} title="Paste from Clipboard">
                      <FiClipboard />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Format Selection</label>
                    {getFormatSelector()}
                  </div>
                  {targetFormat === 'mp4' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Max Quality</label>
                      <select className="select-field" value={quality} onChange={(e) => setQuality(e.target.value)}>
                        <option value="best">Best Available</option>
                        <option value="720p">720p HD</option>
                        <option value="480p">480p SD</option>
                        <option value="360p">360p Mobile</option>
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 2. Converter & Utility Layout */}
            {(tool.category === 'Converter' || tool.category === 'Utility') && (
              <>
                <div 
                  className={`dropzone ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <FiUploadCloud size={40} style={{ color: 'var(--accent-color)', marginBottom: '12px' }} />
                  {file ? (
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>{file.name}</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>Drag & drop file here, or click to browse</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Supports MP4, MOV, JPG, PNG, PDF, DOCX, ZIP (Max 500MB)
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Target Conversion Format</label>
                  {getFormatSelector()}
                </div>
              </>
            )}

            {/* 3. AI Suite Layout */}
            {tool.category === 'AI Tool' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Upload Media File (Audio / Video / PDF)</label>
                  <div 
                    className="dropzone"
                    onClick={() => fileInputRef.current.click()}
                    style={{ padding: '24px 10px' }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      accept="audio/*,video/*,application/pdf"
                    />
                    {file ? (
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>{file.name}</span>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <FiUploadCloud size={28} style={{ color: 'var(--accent-color)', marginBottom: '4px' }} />
                        <span style={{ fontSize: '13px', fontWeight: '700', display: 'block' }}>Drag or select a media recording</span>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MP3, WAV, MP4, PDF, etc.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Or Paste Text Content (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Paste meeting transcripts, articles, or lecture drafts here if you do not have a media file..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="input-field"
                    style={{ resize: 'vertical', fontSize: '14px' }}
                  />
                </div>
              </>
            )}

            {/* Process Button */}
            <button className="btn btn-primary" onClick={handleProcess} style={{ width: '100%', height: '48px', marginTop: '10px' }}>
              Process &rarr;
            </button>
          </div>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid var(--border-color)',
              borderTop: '4px solid var(--accent-color)',
              borderRadius: '50%',
              margin: '0 auto 20px auto',
              animation: 'spin 1s linear infinite'
            }} className="loading-spinner" />
            <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Analyzing & Converting</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Your file is processing on our secure server. Please keep this modal open.
            </p>
            
            {/* Custom Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--bg-grid)',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--primary-gradient)',
                borderRadius: '10px',
                transition: 'width 0.4s ease-out',
                boxShadow: 'var(--accent-glow)'
              }} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: '700' }}>{Math.round(progress)}% Complete</span>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div style={{ padding: '10px 0' }}>
            
            {/* Files (Conversion & Downloader) success output */}
            {tool.category !== 'AI Tool' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <FiCheckCircle size={56} style={{ color: '#10b981', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Conversion Complete!</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Your file <strong>{downloadFilename}</strong> is ready for download.
                </p>

                <a 
                  href={downloadBlobUrl} 
                  download={downloadFilename} 
                  className="btn btn-primary"
                  style={{ width: '100%', height: '48px', textDecoration: 'none' }}
                >
                  <FiDownload /> Download File
                </a>
              </div>
            )}

            {/* AI tools output markdown */}
            {tool.category === 'AI Tool' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                    <FiCheckCircle size={20} />
                    <span style={{ fontWeight: '700' }}>Analysis Complete</span>
                  </div>
                  <button className="btn btn-secondary" onClick={copyToClipboard} style={{ padding: '8px 14px', fontSize: '13px' }}>
                    <FiCopy /> Copy Text
                  </button>
                </div>

                <div 
                  className="glass-panel" 
                  style={{
                    padding: '24px',
                    borderRadius: '14px',
                    background: 'var(--bg-grid)',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                  }}
                >
                  {aiResult}
                </div>
              </div>
            )}

            {/* Reset Modal Trigger */}
            <button 
              className="btn btn-secondary" 
              onClick={() => setStatus('idle')} 
              style={{ width: '100%', marginTop: '20px' }}
            >
              Process Another File
            </button>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <FiAlertCircle size={56} style={{ color: '#ef4444', marginBottom: '16px' }} />
            <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Operation Failed</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
              {errorMessage}
            </p>
            
            <button 
              className="btn btn-primary" 
              onClick={() => setStatus('idle')} 
              style={{ width: '100%' }}
            >
              Try Again
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
