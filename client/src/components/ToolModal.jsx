import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  FiX, FiDownload, FiUploadCloud, FiClipboard, 
  FiCheckCircle, FiAlertCircle, FiCopy, FiFile 
} from 'react-icons/fi';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

const rawBackupUrl = import.meta.env.VITE_BACKUP_API_URL || '';
const BACKUP_URL = rawBackupUrl ? rawBackupUrl.replace(/\/+$/, '') : '';

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

  const getCompatibleFormats = (selectedFile) => {
    if (!selectedFile) return [];
    const ext = selectedFile.name ? selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase() : '';
    
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv', '.m2ts', '.m4v', '.mod', '.wtv', '.mpeg', '.mpg', '.ogv', '.swf', '.ts', '.dv', '.dvr', '.m4k'];
    const audioExts = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.wma', '.amr', '.mid', '.m4r', '.oog'];
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp', '.svg', '.heic', '.heif', '.eps', '.ps', '.ai'];
    const sheetExts = ['.xlsx', '.xls', '.ods', '.csv', '.tsv'];
    const presentationExts = ['.pptx', '.ppt'];
    const docExts = ['.docx', '.doc', '.pdf', '.odt', '.txt', '.rtf', '.html', '.epub', '.md'];
    const zipExts = ['.zip', '.rar', '.7z', '.tar', '.gz', '.tgz'];

    if (videoExts.includes(ext) || audioExts.includes(ext)) {
      return [
        { value: 'mp4', label: 'MP4 Video' },
        { value: 'mov', label: 'MOV QuickTime' },
        { value: 'avi', label: 'AVI Video' },
        { value: 'webm', label: 'WEBM Web Video' },
        { value: 'wmv', label: 'WMV Windows Media' },
        { value: 'mkv', label: 'MKV Matroska' },
        { value: 'flv', label: 'FLV Flash' },
        { value: 'mpeg', label: 'MPEG Video' },
        { value: 'mpg', label: 'MPG Video' },
        { value: 'ts', label: 'TS Transport Stream' },
        { value: 'm2ts', label: 'M2TS Blu-ray' },
        { value: 'm4v', label: 'M4V Video' },
        { value: 'm4k', label: 'M4K Video' },
        { value: 'gif', label: 'GIF Animated' },
        { value: 'ogv', label: 'OGV Ogg Video' },
        { value: 'swf', label: 'SWF Flash' },
        { value: 'dv', label: 'DV Video' },
        { value: 'dvr', label: 'DVR Video' },
        { value: 'wtv', label: 'WTV Video' },
        { value: 'mod', label: 'MOD Video' },
        { value: 'mp3', label: 'MP3 Audio' },
        { value: 'wav', label: 'WAV Audio' },
        { value: 'ogg', label: 'OGG Audio' },
        { value: 'oog', label: 'OOG Audio' },
        { value: 'zip', label: 'ZIP Archive' }
      ];
    }
    if (imageExts.includes(ext)) {
      return [
        { value: 'png', label: 'PNG Image' },
        { value: 'jpg', label: 'JPG Image' },
        { value: 'webp', label: 'WEBP Image' },
        { value: 'webg', label: 'WEBG Image' },
        { value: 'eps', label: 'EPS Vector' },
        { value: 'ps', label: 'PS PostScript' },
        { value: 'ai', label: 'AI Illustrator' },
        { value: 'pdf', label: 'PDF Document' },
        { value: 'docx', label: 'DOCX Word' },
        { value: 'odt', label: 'ODT Document' },
        { value: 'gif', label: 'GIF Image' },
        { value: 'tiff', label: 'TIFF Image' },
        { value: 'bmp', label: 'BMP Image' },
        { value: 'txt', label: 'TXT Plain Text' },
        { value: 'rtf', label: 'RTF Rich Text' },
        { value: 'html', label: 'HTML Webpage' },
        { value: 'epub', label: 'EPUB Publication' },
        { value: 'md', label: 'Markdown (.md)' },
        { value: 'xlsx', label: 'XLSX Excel' },
        { value: 'ods', label: 'ODS OpenDocument Sheet' },
        { value: 'csv', label: 'CSV Values' },
        { value: 'tsv', label: 'TSV Values' },
        { value: 'ppt', label: 'PPT Presentation' },
        { value: 'avi', label: 'AVI Video' },
        { value: 'zip', label: 'ZIP Archive' }
      ];
    }
    if (sheetExts.includes(ext)) {
      return [
        { value: 'xlsx', label: 'XLSX Excel' },
        { value: 'csv', label: 'CSV Values' },
        { value: 'tsv', label: 'TSV Values' },
        { value: 'ods', label: 'ODS OpenDocument' },
        { value: 'pdf', label: 'PDF Document' },
        { value: 'docx', label: 'DOCX Word' },
        { value: 'jpg', label: 'JPG Image' },
        { value: 'png', label: 'PNG Image' },
        { value: 'txt', label: 'TXT Text' },
        { value: 'html', label: 'HTML Webpage' },
        { value: 'rtf', label: 'RTF Rich Text' },
        { value: 'epub', label: 'EPUB E-book' },
        { value: 'md', label: 'Markdown (.md)' },
        { value: 'zip', label: 'ZIP Archive' }
      ];
    }
    if (presentationExts.includes(ext)) {
      return [
        { value: 'pdf', label: 'PDF Document' },
        { value: 'docx', label: 'DOCX Word' },
        { value: 'txt', label: 'TXT Text' },
        { value: 'jpg', label: 'JPG Image' },
        { value: 'png', label: 'PNG Image' },
        { value: 'html', label: 'HTML Webpage' },
        { value: 'md', label: 'Markdown (.md)' },
        { value: 'rtf', label: 'RTF Rich Text' },
        { value: 'epub', label: 'EPUB E-book' },
        { value: 'zip', label: 'ZIP Archive' }
      ];
    }
    if (docExts.includes(ext)) {
      return [
        { value: 'docx', label: 'DOCX Word' },
        { value: 'pdf', label: 'PDF Document' },
        { value: 'odt', label: 'ODT Document' },
        { value: 'txt', label: 'TXT Plain Text' },
        { value: 'rtf', label: 'RTF Rich Text' },
        { value: 'html', label: 'HTML Webpage' },
        { value: 'epub', label: 'EPUB E-book' },
        { value: 'md', label: 'Markdown (.md)' },
        { value: 'jpg', label: 'JPG Image' },
        { value: 'png', label: 'PNG Image' },
        { value: 'webp', label: 'WEBP Image' },
        { value: 'zip', label: 'ZIP Archive' }
      ];
    }
    if (zipExts.includes(ext)) {
      return [
        { value: 'unzip', label: 'Extract All Files' }
      ];
    }
    return [
      { value: 'zip', label: 'ZIP Archive' }
    ];
  };

  const autoSetDefaultTarget = (selectedFile) => {
    const formats = getCompatibleFormats(selectedFile);
    if (formats.length > 0) {
      const exists = formats.some(f => f.value === targetFormat);
      if (!exists) {
        setTargetFormat(formats[0].value);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      autoSetDefaultTarget(selectedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      autoSetDefaultTarget(selectedFile);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResult);
    alert('Copied to clipboard!');
  };

  // Validate blob responses — catches 0-byte files and JSON error responses disguised as blobs
  const validateBlobResponse = async (response, fallbackName) => {
    const blob = response.data;
    const contentType = response.headers['content-type'] || '';
    
    // If server returned JSON error instead of a file (common when backend fails)
    if (contentType.includes('application/json')) {
      const text = await blob.text();
      try {
        const parsed = JSON.parse(text);
        throw new Error(parsed.error || 'Server returned an error instead of a file.');
      } catch (e) {
        if (e instanceof SyntaxError) {
          throw new Error(text || 'Server returned an unexpected response.');
        }
        throw e;
      }
    }
    
    // Check for empty/zero-byte responses
    if (!blob || blob.size === 0) {
      throw new Error(
        'Download produced an empty file (0 bytes). This can happen when:\n' +
        '• The video is private, age-restricted, or region-locked\n' +
        '• The download service is temporarily unavailable\n' +
        '• The backend server timed out during processing\n\n' +
        'Please try again in a few minutes, or try a different video.'
      );
    }
    
    // Warn if file is suspiciously small (under 1KB) — might be an HTML error page
    if (blob.size < 1024) {
      const text = await blob.text();
      // Check if it looks like an error message rather than actual file content
      if (text.includes('error') || text.includes('Error') || text.includes('<html')) {
        try {
          const parsed = JSON.parse(text);
          throw new Error(parsed.error || 'Server returned an error instead of a file.');
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new Error(`Download failed: ${text.substring(0, 200)}`);
          }
          throw e;
        }
      }
    }
    
    return blob;
  };

  const handleProcess = async () => {
    setStatus('processing');
    setProgress(20);
    setErrorMessage('');

    // Fetch API Key from localStorage if available
    const apiKey = localStorage.getItem('gemini_api_key') || '';

    const makeRequestWithFallback = async (method, path, data, config = {}) => {
      try {
        console.log(`Sending request to primary backend: ${BACKEND_URL}${path}`);
        if (method === 'post') {
          return await axios.post(`${BACKEND_URL}${path}`, data, config);
        } else {
          return await axios.get(`${BACKEND_URL}${path}`, config);
        }
      } catch (err) {
        if (BACKUP_URL && BACKUP_URL !== BACKEND_URL) {
          console.warn(`Primary backend request failed. Retrying with backup backend: ${BACKUP_URL}${path}`);
          setProgress(prev => Math.max(10, prev - 10)); // Reset progress slightly
          try {
            if (method === 'post') {
              return await axios.post(`${BACKUP_URL}${path}`, data, config);
            } else {
              return await axios.get(`${BACKUP_URL}${path}`, config);
            }
          } catch (backupErr) {
            console.error("Backup backend request also failed:", backupErr);
            throw err;
          }
        }
        throw err;
      }
    };

    try {
      // 1. DOWNLOADER TOOLS
      if (tool.category === 'Downloader') {
        if (!url) throw new Error('Please enter a valid URL.');
        setProgress(40);
        
        const response = await makeRequestWithFallback('post', '/api/download', {
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

        // Validate the blob BEFORE creating download URL
        const validatedBlob = await validateBlobResponse(response, `downloaded_file.${targetFormat}`);

        const contentDisposition = response.headers['content-disposition'];
        let filename = `downloaded_file.${targetFormat}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename[*]?=["']?(?:UTF-8'')?([^"';\n]+)["']?/i);
          if (match) filename = decodeURIComponent(match[1]).trim();
        }
        // Sanitize filename
        filename = filename.replace(/[<>:"\/\\|?*]/g, '_').trim() || `downloaded_file.${targetFormat}`;

        const blobUrl = window.URL.createObjectURL(validatedBlob);
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

        const response = await makeRequestWithFallback('post', '/api/convert', formData, {
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

        // Validate the blob BEFORE creating download URL
        const validatedBlob = await validateBlobResponse(response, `converted_file.${targetFormat}`);

        // Use original upload filename with new extension
        const origBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        let filename = `${origBaseName}.${targetFormat}`;

        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
          const match = contentDisposition.match(/filename[*]?=["']?(?:UTF-8'')?([^"';\n]+)["']?/i);
          if (match) {
            const serverName = decodeURIComponent(match[1]).trim();
            if (serverName && !serverName.startsWith('converted_')) {
              filename = serverName;
            }
          }
        }
        // Sanitize filename
        filename = filename.replace(/[<>:"\/\\|?*]/g, '_').trim() || `converted_file.${targetFormat}`;

        const blobUrl = window.URL.createObjectURL(validatedBlob);
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

        const response = await makeRequestWithFallback('post', '/api/ai', formData, {
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
            // Strip HTML tags if the blob returned raw HTML
            const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            errMsg = stripped.length > 300 ? stripped.substring(0, 300) + '...' : stripped || errMsg;
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
    if (file) {
      const formats = getCompatibleFormats(file);
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          {formats.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      );
    }

    if (tool.id === 'mp4-to-mp3') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="mp4">MP4 Video</option>
          <option value="mov">MOV QuickTime</option>
          <option value="avi">AVI Video</option>
          <option value="webm">WEBM Web Video</option>
          <option value="wmv">WMV Windows Media</option>
          <option value="mkv">MKV Matroska</option>
          <option value="flv">FLV Flash</option>
          <option value="mpeg">MPEG Video</option>
          <option value="mpg">MPG Video</option>
          <option value="ts">TS Transport Stream</option>
          <option value="m2ts">M2TS Blu-ray</option>
          <option value="m4v">M4V Video</option>
          <option value="m4k">M4K Video</option>
          <option value="gif">GIF Animated</option>
          <option value="ogv">OGV Ogg Video</option>
          <option value="swf">SWF Flash</option>
          <option value="dv">DV Video</option>
          <option value="dvr">DVR Video</option>
          <option value="wtv">WTV Video</option>
          <option value="mod">MOD Video</option>
          <option value="mp3">MP3 Audio</option>
          <option value="wav">WAV Audio</option>
          <option value="ogg">OGG Audio</option>
          <option value="oog">OOG Audio</option>
          <option value="zip">ZIP Archive</option>
        </select>
      );
    }
    if (tool.id === 'image-converter') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="png">PNG Image</option>
          <option value="jpg">JPG Image</option>
          <option value="webp">WEBP Image</option>
          <option value="webg">WEBG Image</option>
          <option value="gif">GIF Image</option>
          <option value="tiff">TIFF Image</option>
          <option value="bmp">BMP Image</option>
          <option value="eps">EPS Vector</option>
          <option value="ps">PS PostScript</option>
          <option value="ai">AI Illustrator</option>
          <option value="pdf">PDF Document</option>
          <option value="docx">DOCX Word</option>
          <option value="odt">ODT Document</option>
          <option value="txt">TXT Plain Text</option>
          <option value="rtf">RTF Rich Text</option>
          <option value="html">HTML Webpage</option>
          <option value="epub">EPUB Publication</option>
          <option value="md">Markdown (.md)</option>
          <option value="xlsx">XLSX Excel</option>
          <option value="ods">ODS OpenDocument Sheet</option>
          <option value="csv">CSV Values</option>
          <option value="tsv">TSV Values</option>
          <option value="ppt">PPT Presentation</option>
          <option value="avi">AVI Video</option>
          <option value="zip">ZIP Archive</option>
        </select>
      );
    }
    if (tool.id === 'pdf-converter') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="docx">DOCX Word</option>
          <option value="pdf">PDF Document</option>
          <option value="odt">ODT Document</option>
          <option value="txt">TXT Plain Text</option>
          <option value="rtf">RTF Rich Text</option>
          <option value="html">HTML Webpage</option>
          <option value="epub">EPUB E-book</option>
          <option value="md">Markdown (.md)</option>
          <option value="jpg">JPG Image</option>
          <option value="png">PNG Image</option>
          <option value="webp">WEBP Image</option>
          <option value="zip">ZIP Archive</option>
        </select>
      );
    }
    if (tool.id === 'zip-extractor') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="unzip">Extract All Files</option>
        </select>
      );
    }
    if (tool.category === 'Downloader') {
      return (
        <select className="select-field" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <option value="mp4">MP4 Video</option>
          <option value="mp3">MP3 Audio</option>
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
                  style={{ border: '2px dashed var(--border-color)', padding: '24px 10px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }}
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
                        Supports popular formats (Video, Audio, Image, Document, Archive) up to 500MB
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Target Conversion Format</label>
                  {getFormatSelector()}
                </div>
              </>
            )}

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
            <p style={{ 
              fontSize: '13px', 
              color: 'var(--text-muted)', 
              marginBottom: '24px', 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '160px',
              overflowY: 'auto',
              padding: '12px',
              background: 'rgba(239,68,68,0.07)',
              borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.15)'
            }}>
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
