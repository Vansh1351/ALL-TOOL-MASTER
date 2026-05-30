import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  FiArrowLeft, FiDownload, FiUploadCloud, FiClipboard, 
  FiCheckCircle, FiAlertCircle, FiCopy, FiFile, FiChevronDown, FiChevronUp, FiExternalLink 
} from 'react-icons/fi';
import { SEO_DATA } from '../seoData';
import { TOOLS_DATA } from '../components/ToolGrid';
import { AFFILIATE_LINKS } from '../affiliateLinks';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

export default function ToolPage({ tool, setView, setActiveTool, addToHistory, navigate }) {
  if (!tool) return null;

  const seoInfo = SEO_DATA[tool.id] || {
    title: `${tool.title} - Free Online Utilities | All Tool Master`,
    description: tool.desc,
    h1: tool.title,
    introduction: tool.desc,
    howTo: ['Upload your files or enter required input details.', 'Click the "Process" button to start.', 'Download the formatted file or copy results.'],
    features: [{ title: 'Free & Fast', desc: 'Convert as many files as you need.' }],
    article: '',
    faqs: []
  };

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, idx) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      if (trimmed.startsWith('### ')) {
        return (
          <h3 
            key={idx} 
            style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              marginTop: '32px', 
              marginBottom: '12px', 
              color: 'var(--text-main)',
              letterSpacing: '-0.3px'
            }}
          >
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }
      
      if (trimmed.startsWith('## ')) {
        return (
          <h2 
            key={idx} 
            style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              marginTop: '36px', 
              marginBottom: '16px', 
              color: 'var(--text-main)',
              letterSpacing: '-0.5px'
            }}
          >
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      }
      
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item, itemIdx) => (
          <li key={itemIdx} style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
            {item.replace(/^[\*\-]\s+/, '')}
          </li>
        ));
        return (
          <ul key={idx} style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'disc' }}>
            {items}
          </ul>
        );
      }
      
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map((item, itemIdx) => (
          <li key={itemIdx} style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
            {item.replace(/^\d+\.\s+/, '')}
          </li>
        ));
        return (
          <ol key={idx} style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'decimal' }}>
            {items}
          </ol>
        );
      }
      
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      const content = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: 'var(--text-main)', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      return (
        <p key={idx} style={{ marginBottom: '20px', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '14px' }}>
          {content}
        </p>
      );
    });
  };

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
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const fileInputRef = useRef(null);

  // Set default format on tool change
  useEffect(() => {
    if (tool.id === 'mp4-to-mp3') setTargetFormat('mp4');
    else if (tool.id === 'image-converter') setTargetFormat('png');
    else if (tool.id === 'pdf-converter') setTargetFormat('docx');
    else if (tool.id === 'zip-extractor') setTargetFormat('unzip');
    else setTargetFormat('mp4');
    
    // Reset states
    setUrl('');
    setFile(null);
    setTextInput('');
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setAiResult('');
    setDownloadBlobUrl('');
    setOpenFAQIndex(null);

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'instant' });
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
    
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv', '.m2ts', '.m4v', '.mod', '.wtv', '.mpeg', '.mpg', '.ogv', '.swf', '.ts', '.dv', '.dvr'];
    const audioExts = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.wma', '.amr', '.mid', '.m4r'];
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp', '.svg', '.heic', '.heif', '.eps', '.ps', '.ai'];
    const sheetExts = ['.xlsx', '.xls', '.ods', '.csv', '.tsv'];
    const presentationExts = ['.pptx', '.ppt'];
    const docExts = ['.docx', '.doc', '.pdf', '.odt', '.txt', '.rtf', '.html', '.epub', '.md'];
    const zipExts = ['.zip', '.rar', '.7z', '.tar', '.gz'];

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
        { value: 'zip', label: 'ZIP Archive' }
      ];
    }
    if (imageExts.includes(ext)) {
      return [
        { value: 'png', label: 'PNG Image' },
        { value: 'jpg', label: 'JPG Image' },
        { value: 'webp', label: 'WEBP Image' },
        { value: 'eps', label: 'EPS Vector' },
        { value: 'ps', label: 'PS PostScript' },
        { value: 'ai', label: 'AI Illustrator' },
        { value: 'pdf', label: 'PDF Document' },
        { value: 'docx', label: 'DOCX Word' },
        { value: 'gif', label: 'GIF Image' },
        { value: 'tiff', label: 'TIFF Image' },
        { value: 'bmp', label: 'BMP Image' },
        { value: 'txt', label: 'TXT Plain Text' },
        { value: 'rtf', label: 'RTF Rich Text' },
        { value: 'html', label: 'HTML Webpage' },
        { value: 'epub', label: 'EPUB Publication' },
        { value: 'md', label: 'Markdown (.md)' },
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

  const handleProcess = async () => {
    setStatus('processing');
    setProgress(20);
    setErrorMessage('');
    const apiKey = localStorage.getItem('gemini_api_key') || '';

    try {
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
            setProgress(60 + percent * 0.35);
          }
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `downloaded_file.${targetFormat}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename=["']?([^"';]+)["']?/);
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
            setProgress(30 + percent * 0.3);
          },
          onDownloadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded));
            setProgress(70 + percent * 0.25);
          }
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `converted_file.${targetFormat}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename=["']?([^"';]+)["']?/);
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

      } else if (tool.category === 'AI Tool') {
        if (!file && !textInput) {
          throw new Error('Please upload an audio/video/pdf file or write text content.');
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
      if (err.message && err.message.toLowerCase().includes('network error')) {
        errMsg = `Network Connection Error.
This happens because your React frontend is unable to reach the local backend server (running at http://localhost:5000).

If you are running the project locally:
1. Open a new terminal.
2. Navigate to the server folder: "cd server"
3. Install dependencies: "npm install"
4. Start the backend: "npm run dev"

If you have deployed this site to production (e.g. Vercel):
Vercel only hosts static frontend pages. You must deploy the "server" backend to a platform like Render, Railway, or a VPS. After deploying, add the hosted backend URL to your Vercel project environment variables as:
VITE_API_URL=https://your-backend-server.com`;
      } else if (err.response && err.response.data) {
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
          <option value="eps">EPS Vector</option>
          <option value="ps">PS PostScript</option>
          <option value="ai">AI Illustrator</option>
          <option value="pdf">PDF Document</option>
          <option value="docx">DOCX Word</option>
          <option value="gif">GIF Image</option>
          <option value="tiff">TIFF Image</option>
          <option value="bmp">BMP Image</option>
          <option value="txt">TXT Plain Text</option>
          <option value="rtf">RTF Rich Text</option>
          <option value="html">HTML Webpage</option>
          <option value="epub">EPUB Publication</option>
          <option value="md">Markdown (.md)</option>
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

  const handleRelatedToolClick = (relatedTool) => {
    navigate('tool-page', relatedTool);
  };

  const relatedTools = TOOLS_DATA.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 3);
  const fallbackRelatedTools = TOOLS_DATA.filter(t => t.id !== tool.id).slice(0, 3);
  const displayRelated = relatedTools.length > 0 ? relatedTools : fallbackRelatedTools;

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 0 60px 0' }}>
      
      {/* Back Button / Breadcrumbs */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => {
            setView('dashboard');
            setActiveTool(null);
          }}
          className="btn btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Main Grid: Tool Workspace Left, Sticky Info Panel Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '36px',
        alignItems: 'start',
        marginBottom: '60px'
      }} className="tool-page-grid">
        
        {/* Left Column: Tool workspace panel */}
        <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              {React.createElement(tool.icon)}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>{seoInfo.h1}</h1>
              <span className="badge" style={{ marginTop: '4px', display: 'inline-block' }}>{tool.category}</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            {seoInfo.introduction}
          </p>

          {/* Tool actions interface */}
          {status === 'idle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Downloader Input */}
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

              {/* Converter & Utility Dropzone */}
              {(tool.category === 'Converter' || tool.category === 'Utility') && (
                <>
                  <div 
                    className={`dropzone ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    style={{ border: '2px dashed var(--border-color)', padding: '40px 20px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <FiUploadCloud size={44} style={{ color: 'var(--accent-color)', marginBottom: '14px' }} />
                    {file ? (
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>{file.name}</span>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>Drag & drop file here, or click to browse</span>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Supports popular formats up to 100MB
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

              {/* AI Suite Layout */}
              {tool.category === 'AI Tool' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Upload Media File (Audio / Video / PDF)</label>
                    <div 
                      className="dropzone"
                      onClick={() => fileInputRef.current.click()}
                      style={{ padding: '30px 10px', border: '2px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }}
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
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <FiUploadCloud size={32} style={{ color: 'var(--accent-color)', marginBottom: '6px' }} />
                          <span style={{ fontSize: '14px', fontWeight: '700', display: 'block' }}>Drag or select a media recording</span>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MP3, WAV, MP4, PDF, etc.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Or Paste Text Content (Optional)</label>
                    <textarea
                      rows={5}
                      placeholder="Paste meeting transcripts, articles, or lecture drafts here if you do not have a media file..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="input-field"
                      style={{ resize: 'vertical', fontSize: '14px' }}
                    />
                  </div>
                </>
              )}

              <button className="btn btn-primary" onClick={handleProcess} style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                Process Command &rarr;
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
                Your file is processing on our secure server. Please keep this page open.
              </p>
              
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-grid)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '10px', transition: 'width 0.4s ease-out', boxShadow: 'var(--accent-glow)' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: '700' }}>{Math.round(progress)}% Complete</span>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div style={{ padding: '10px 0' }}>
              {tool.category !== 'AI Tool' ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <FiCheckCircle size={56} style={{ color: '#10b981', marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Conversion Complete!</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Your output file <strong>{downloadFilename}</strong> is ready.
                  </p>
                  <a 
                    href={downloadBlobUrl} 
                    download={downloadFilename} 
                    className="btn btn-primary"
                    style={{ width: '100%', height: '48px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <FiDownload /> Download File
                  </a>
                </div>
              ) : (
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
                  <div style={{
                    padding: '24px',
                    borderRadius: '14px',
                    background: 'var(--bg-grid)',
                    maxHeight: '450px',
                    overflowY: 'auto',
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    fontSize: '13.5px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    border: '1px solid var(--border-color)'
                  }}>
                    {aiResult}
                  </div>
                </div>
              )}

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
              <button className="btn btn-primary" onClick={() => setStatus('idle')} style={{ width: '100%' }}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Sticky instruction / Related tools panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '90px' }} className="tool-page-sidebar">
          {/* Quick How-To steps */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>How to use:</h3>
            <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              {seoInfo.howTo.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Partner Promo: Affiliate Banner */}
          <div className="glass-panel" style={{ 
            padding: '20px', 
            borderRadius: '20px', 
            border: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(103,58,183,0.05) 0%, rgba(222,75,26,0.05) 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #673ab7 0%, #de4b1a 100%)',
              filter: 'blur(30px)',
              opacity: 0.2,
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="badge" style={{ fontSize: '10px', padding: '3px 8px', marginBottom: '8px', display: 'inline-block' }}>Exclusive Partner Offer</span>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '6px' }}>Need Web Hosting or a Domain?</h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '14px' }}>
                Launch your website with <strong>Hostinger</strong> (75% off + free domain) or secure cheap names at <strong>Namecheap</strong> ($0.99 domains).
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a 
                  href={AFFILIATE_LINKS.hostinger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    height: '34px',
                    fontSize: '12px',
                    background: '#673ab7',
                    borderColor: '#673ab7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                >
                  Get Hosting Deal <FiExternalLink size={12} />
                </a>
                <a 
                  href={AFFILIATE_LINKS.namecheap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    height: '34px',
                    fontSize: '12px',
                    borderColor: '#de4b1a',
                    color: '#de4b1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(222, 75, 26, 0.05)' }}
                  onMouseLeave={(e) => { e.target.style.background = 'none' }}
                >
                  Get Domain Deal <FiExternalLink size={12} />
                </a>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span 
                  onClick={() => navigate('deals')}
                  style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '700', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Learn more about resources
                </span>
              </div>
            </div>
          </div>

          {/* Internal Linking: Related Tools list */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Related Tools:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayRelated.map((relTool) => (
                <a 
                  key={relTool.id} 
                  href={relTool.routes ? relTool.routes[0] : '#'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRelatedToolClick(relTool);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: 'var(--bg-grid)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                  className="related-tool-card"
                >
                  <div style={{ color: relTool.color, fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                    {React.createElement(relTool.icon)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>{relTool.title}</h4>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{relTool.category}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Programmatic SEO content article (1000+ words) */}
      <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px', marginBottom: '60px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>
            Complete Guide & Reference Manual
          </h2>
          
          {/* Feature Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {seoInfo.features.map((feat, i) => (
              <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(0,0,0,0.03)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: 'var(--accent-color)' }}>{feat.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Markdown dynamic content body */}
          <div 
            style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: 'var(--text-muted)',
              textAlign: 'justify'
            }}
            className="seo-article-content"
          >
            {renderMarkdown(seoInfo.article)}
          </div>
        </div>
      </section>

      {/* Dynamic Specific FAQs */}
      {seoInfo.faqs && seoInfo.faqs.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '28px', textAlign: 'center' }}>
              Frequently Asked Questions (FAQs)
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {seoInfo.faqs.map((faq, idx) => {
                const isOpen = openFAQIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="glass-panel"
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      borderColor: isOpen ? 'var(--accent-color)' : 'var(--border-color)',
                    }}
                    onClick={() => setOpenFAQIndex(isOpen ? null : idx)}
                  >
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', justifyContent: 'space-between', gap: '12px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: isOpen ? 'var(--accent-color)' : 'var(--text-main)', margin: 0 }}>
                        {faq.question}
                      </h4>
                      {isOpen ? <FiChevronUp style={{ color: 'var(--accent-color)' }} /> : <FiChevronDown style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    {isOpen && (
                      <div style={{ padding: '0 20px 16px 20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }} className="animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .tool-page-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .tool-page-sidebar {
            position: static !important;
          }
        }
        .related-tool-card:hover {
          border-color: var(--accent-color) !important;
          transform: translateY(-2px);
          box-shadow: var(--accent-glow);
        }
        .seo-article-content h3 {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          margin-top: 24px;
          margin-bottom: 8px;
        }
        .seo-article-content p {
          margin-bottom: 16px;
        }
        .seo-article-content ul {
          padding-left: 20px;
          margin-bottom: 16px;
        }
        .seo-article-content li {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}
