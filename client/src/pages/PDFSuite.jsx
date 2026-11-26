import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import {
  FiArrowLeft, FiUploadCloud, FiDownload, FiTrash2, FiRotateCw, FiPlus,
  FiMove, FiType, FiSquare, FiCircle, FiImage, FiEdit3, FiLayers,
  FiZoomIn, FiZoomOut, FiLock, FiUnlock, FiFileText, FiScissors,
  FiMinimize2, FiCpu, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff,
  FiArrowUp, FiArrowDown, FiCopy, FiPaperclip, FiCrop, FiDroplet,
  FiBold, FiItalic, FiUnderline, FiSliders, FiGrid, FiCheckSquare
} from 'react-icons/fi';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

const CATEGORIES = [
  { id: 'organize', label: 'Organize PDF', icon: FiLayers },
  { id: 'optimize', label: 'Optimize PDF', icon: FiMinimize2 },
  { id: 'to-pdf', label: 'Convert to PDF', icon: FiFileText },
  { id: 'from-pdf', label: 'Convert from PDF', icon: FiDownload },
  { id: 'edit', label: 'Edit Studio (PDF/Img/CSV/Txt)', icon: FiEdit3 },
  { id: 'security', label: 'PDF Security', icon: FiLock },
  { id: 'ai', label: 'PDF Intelligence (AI)', icon: FiCpu }
];

const TOOLS_BY_CATEGORY = {
  organize: [
    { id: 'merge', label: 'Merge PDF' },
    { id: 'split', label: 'Split PDF' },
    { id: 'organize-pages', label: 'Organize / Rotate / Remove / Extract' }
  ],
  optimize: [
    { id: 'compress', label: 'Compress PDF' },
    { id: 'repair', label: 'Repair PDF' },
    { id: 'ocr', label: 'OCR PDF' }
  ],
  'to-pdf': [
    { id: 'jpg-to-pdf', label: 'JPG / PNG / Scan to PDF' },
    { id: 'word-to-pdf', label: 'WORD to PDF' },
    { id: 'powerpoint-to-pdf', label: 'POWERPOINT to PDF' },
    { id: 'excel-to-pdf', label: 'EXCEL / CSV to PDF' },
    { id: 'html-to-pdf', label: 'HTML / Text to PDF' }
  ],
  'from-pdf': [
    { id: 'pdf-to-jpg', label: 'PDF to JPG / PNG' },
    { id: 'pdf-to-word', label: 'PDF to WORD' },
    { id: 'pdf-to-powerpoint', label: 'PDF to POWERPOINT' },
    { id: 'pdf-to-excel', label: 'PDF to EXCEL' },
    { id: 'pdf-to-markdown', label: 'PDF to Markdown' },
    { id: 'pdf-to-pdfa', label: 'PDF to PDF/A' }
  ],
  edit: [
    { id: 'editor', label: 'Interactive Document & PDF Editor' }
  ],
  security: [
    { id: 'protect', label: 'Protect PDF' },
    { id: 'unlock', label: 'Unlock PDF' },
    { id: 'sign', label: 'Sign PDF' },
    { id: 'redact', label: 'Redact PDF' }
  ],
  ai: [
    { id: 'ai-summarize', label: 'AI Summarizer' },
    { id: 'ai-translate', label: 'Translate PDF' },
    { id: 'ai-compare', label: 'Compare PDF' },
    { id: 'ai-ocr', label: 'OCR PDF' }
  ]
};

const FONT_OPTIONS = [
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Arial',
  'Georgia',
  'Verdana',
  'Cursive'
];

const COLOR_SWATCHES = ['#0f172a', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'];

function hexToRgbNorm(hex) {
  const clean = (hex || '#000000').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16) || 0;
  return rgb(((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255);
}

export default function PDFSuite({ tool, setView, setActiveTool, addToast, incrementConversion, addToHistory }) {
  const [category, setCategory] = useState('organize');
  const [activeSubTool, setActiveSubTool] = useState('merge');

  // Shared processing state for standard tools
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadName, setDownloadName] = useState('output.pdf');
  const [aiOutput, setAiOutput] = useState('');
  const [multiOutputs, setMultiOutputs] = useState([]); // for PDF -> JPG / Split pages

  // Tool-specific options
  const [splitRange, setSplitRange] = useState('1-1');
  const [compressLevel, setCompressLevel] = useState('medium');
  const [pdfPassword, setPdfPassword] = useState('');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [htmlTextInput, setHtmlTextInput] = useState('');

  // Visual Page Organizer state
  const [orgPages, setOrgPages] = useState([]); // { uid, index, thumb, rotate, selected }
  const [orgPdfBytes, setOrgPdfBytes] = useState(null);
  const [orgDragIdx, setOrgDragIdx] = useState(null);

  // ─── Interactive Document & PDF Edit Studio State ─────────────────────────
  const [docPages, setDocPages] = useState([
    { width: 595, height: 842, bgDataUrl: null, bgType: 'blank' }
  ]);
  const [editorPdfBytes, setEditorPdfBytes] = useState(null);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [editorTool, setEditorTool] = useState('select'); // select | text | rect | circle | line | arrow | triangle | star | draw | highlight | image | sign | form-text | form-check | redact | crop
  const [elements, setElements] = useState([]); // { id, pageIdx, type, x, y, w, h, text, fontFamily, fontSize, bold, italic, underline, strike, color, bgColor, fillColor, strokeColor, strokeWidth, opacity, shadow, rotation, visible, points, imgDataUrl, fieldName }
  const [selectedId, setSelectedId] = useState(null);
  const [attachments, setAttachments] = useState([]); // { name, bytes, type }
  const [watermarkCfg, setWatermarkCfg] = useState({ enabled: false, text: 'CONFIDENTIAL', color: '#ef4444', opacity: 0.25, rotation: -35 });
  const [pageNumbersCfg, setPageNumbersCfg] = useState({ enabled: false, position: 'bottom-center', prefix: 'Page ' });
  const [cropCfg, setCropCfg] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  // Brush / Drawing defaults
  const [drawColor, setDrawColor] = useState('#06b6d4');
  const [drawSize, setDrawSize] = useState(3);

  // Signature modal state
  const [showSignModal, setShowSignModal] = useState(false);
  const [signMode, setSignMode] = useState('draw'); // draw | type
  const [typedSign, setTypedSign] = useState('Your Signature');
  const signCanvasRef = useRef(null);
  const isSigningRef = useRef(false);

  // Canvas drag/draw refs
  const stageRef = useRef(null);
  const dragStateRef = useRef(null);
  const drawPathRef = useRef(null);
  const [liveDrawPoints, setLiveDrawPoints] = useState(null);

  const fileInputRef = useRef(null);
  const editorUploadRef = useRef(null);
  const insertImageRef = useRef(null);
  const attachFileRef = useRef(null);

  const handleCategorySwitch = (catId) => {
    setCategory(catId);
    const first = TOOLS_BY_CATEGORY[catId]?.[0]?.id;
    if (first) {
      if (first === 'sign') {
        setCategory('edit');
        setActiveSubTool('editor');
        setEditorTool('sign');
        setShowSignModal(true);
        return;
      }
      if (first === 'redact') {
        setCategory('edit');
        setActiveSubTool('editor');
        setEditorTool('redact');
        return;
      }
      setActiveSubTool(first);
    }
    resetToolOutputs();
  };

  const handleSubToolSwitch = (subId) => {
    if (subId === 'sign') {
      setCategory('edit');
      setActiveSubTool('editor');
      setEditorTool('sign');
      setShowSignModal(true);
      return;
    }
    if (subId === 'redact') {
      setCategory('edit');
      setActiveSubTool('editor');
      setEditorTool('redact');
      return;
    }
    setActiveSubTool(subId);
    resetToolOutputs();
    if (subId === 'organize-pages' && files[0]?.type === 'application/pdf') {
      loadOrganizerFromFile(files[0]);
    }
  };

  const resetToolOutputs = () => {
    setStatus('idle');
    setErrorMsg('');
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
    setAiOutput('');
    setMultiOutputs([]);
  };

  const triggerDownloadBlob = (blob, name) => {
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setDownloadName(name);
    setStatus('success');
    if (incrementConversion) incrementConversion();
    if (addToHistory) {
      addToHistory({
        toolTitle: `PDF Suite (${activeSubTool})`,
        fileName: files[0]?.name || 'document',
        outputName: name,
        type: 'conversion',
        timestamp: new Date().toLocaleTimeString()
      });
    }
    if (addToast) addToast(`${name} is ready!`, 'success');
  };

  // ─── Render PDF pages to thumbnails/canvases via pdfjs-dist ───────────────
  const renderPdfPagesToImages = async (arrayBuffer, scale = 1.5) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
    const rendered = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;
      const baseViewport = page.getViewport({ scale: 1 });
      rendered.push({
        index: i - 1,
        width: baseViewport.width,
        height: baseViewport.height,
        dataUrl: canvas.toDataURL('image/png')
      });
    }
    return rendered;
  };

  const loadOrganizerFromFile = async (pdfFile) => {
    if (!pdfFile) return;
    try {
      const buf = await pdfFile.arrayBuffer();
      setOrgPdfBytes(buf);
      const pages = await renderPdfPagesToImages(buf, 0.45);
      setOrgPages(pages.map((p, idx) => ({ ...p, uid: `${p.index}_${Date.now()}_${idx}`, rotate: 0, selected: true })));
    } catch (e) {
      if (addToast) addToast('Failed to preview PDF pages: ' + e.message, 'error');
    }
  };

  const moveOrgPage = (fromIdx, toIdx) => {
    setOrgPages(prev => {
      if (toIdx < 0 || toIdx >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, item);
      return copy;
    });
  };

  // Load PDF into Organizer when organize-pages is active
  const handleFilesSelected = async (selectedFiles) => {
    const list = Array.from(selectedFiles || []);
    if (list.length === 0) return;
    setFiles(prev => (activeSubTool === 'merge' || activeSubTool === 'jpg-to-pdf' || activeSubTool === 'ai-compare') ? [...prev, ...list] : list);
    resetToolOutputs();

    if (activeSubTool === 'organize-pages' && (list[0]?.type === 'application/pdf' || list[0]?.name?.toLowerCase().endsWith('.pdf'))) {
      await loadOrganizerFromFile(list[0]);
    }
  };

  // ─── Execute Standard Organize / Optimize / Convert / Security / AI Tools ───
  const runStandardTool = async () => {
    setStatus('processing');
    setErrorMsg('');
    try {
      // 1. Client-Side Merge PDF
      if (activeSubTool === 'merge') {
        if (files.length < 2) throw new Error('Please upload at least 2 PDF files to merge.');
        const merged = await PDFDocument.create();
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
          const copied = await merged.copyPages(doc, doc.getPageIndices());
          copied.forEach(p => merged.addPage(p));
        }
        const outBytes = await merged.save();
        triggerDownloadBlob(new Blob([outBytes], { type: 'application/pdf' }), 'merged_document.pdf');
        return;
      }

      // 2. Client-Side Split PDF
      if (activeSubTool === 'split') {
        if (!files[0]) throw new Error('Please upload a PDF file.');
        const bytes = await files[0].arrayBuffer();
        const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const total = srcDoc.getPageCount();
        const parts = splitRange.split(',').map(s => s.trim()).filter(Boolean);
        const outputs = [];
        for (let idx = 0; idx < parts.length; idx++) {
          const part = parts[idx];
          const [startStr, endStr] = part.split('-');
          const start = Math.max(1, parseInt(startStr, 10) || 1);
          const end = Math.min(total, parseInt(endStr || startStr, 10) || start);
          const outDoc = await PDFDocument.create();
          const indices = [];
          for (let p = start - 1; p < end; p++) indices.push(p);
          const copied = await outDoc.copyPages(srcDoc, indices);
          copied.forEach(p => outDoc.addPage(p));
          const outBytes = await outDoc.save();
          outputs.push({
            name: `split_${start}-${end}.pdf`,
            url: URL.createObjectURL(new Blob([outBytes], { type: 'application/pdf' }))
          });
        }
        if (outputs.length === 1) {
          setDownloadUrl(outputs[0].url);
          setDownloadName(outputs[0].name);
        } else {
          setMultiOutputs(outputs);
        }
        setStatus('success');
        if (incrementConversion) incrementConversion();
        return;
      }

      // 3. Client-Side Organize / Rotate / Remove / Extract Pages
      if (activeSubTool === 'organize-pages') {
        if (!orgPdfBytes || orgPages.length === 0) throw new Error('Please upload a PDF first.');
        const kept = orgPages.filter(p => p.selected);
        if (kept.length === 0) throw new Error('Select at least 1 page to keep/extract.');
        const srcDoc = await PDFDocument.load(orgPdfBytes, { ignoreEncryption: true });
        const outDoc = await PDFDocument.create();
        for (const p of kept) {
          const [copied] = await outDoc.copyPages(srcDoc, [p.index]);
          if (p.rotate) copied.setRotation(degrees((copied.getRotation().angle + p.rotate) % 360));
          outDoc.addPage(copied);
        }
        const outBytes = await outDoc.save();
        triggerDownloadBlob(new Blob([outBytes], { type: 'application/pdf' }), 'organized_document.pdf');
        return;
      }

      // 4. Client-Side JPG/PNG/Scan to PDF
      if (activeSubTool === 'jpg-to-pdf') {
        if (files.length === 0) throw new Error('Please upload one or more images (JPG, PNG).');
        const pdfDoc = await PDFDocument.create();
        for (const f of files) {
          const buf = await f.arrayBuffer();
          let img;
          if (f.type === 'image/png' || f.name.toLowerCase().endsWith('.png')) {
            img = await pdfDoc.embedPng(buf);
          } else {
            img = await pdfDoc.embedJpg(buf);
          }
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const outBytes = await pdfDoc.save();
        triggerDownloadBlob(new Blob([outBytes], { type: 'application/pdf' }), 'images_to_pdf.pdf');
        return;
      }

      // 5. Client-Side PDF to JPG/PNG (HD)
      if (activeSubTool === 'pdf-to-jpg') {
        if (!files[0]) throw new Error('Please upload a PDF file.');
        const buf = await files[0].arrayBuffer();
        const pages = await renderPdfPagesToImages(buf, 2);
        const outputs = pages.map((p, i) => ({
          name: `page_${i + 1}.png`,
          url: p.dataUrl
        }));
        setMultiOutputs(outputs);
        setStatus('success');
        if (incrementConversion) incrementConversion();
        return;
      }

      // 6. AI Intelligence Endpoints (Summarize, Translate, Compare, OCR)
      if (category === 'ai' || activeSubTool === 'ocr') {
        const aiAction = activeSubTool === 'ocr' ? 'ai-ocr' : activeSubTool;
        if (files.length === 0) throw new Error('Please upload the required PDF/image file(s).');
        const fd = new FormData();
        fd.append('action', aiAction);
        if (targetLang) fd.append('targetLanguage', targetLang);
        files.forEach(f => fd.append('files', f));
        const res = await axios.post(`${BACKEND_URL}/api/pdf-intelligence`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAiOutput(res.data.result || '');
        setStatus('success');
        if (incrementConversion) incrementConversion();
        return;
      }

      // 7. Server-Side PDF Suite Actions (Compress, Repair, Protect, Unlock, Word/Excel/PPT/HTML/Markdown/PDF-A)
      const fd = new FormData();
      fd.append('action', activeSubTool);
      if (files[0]) fd.append('file', files[0]);
      if (pdfPassword) fd.append('password', pdfPassword);
      if (compressLevel) fd.append('level', compressLevel);
      if (htmlTextInput) fd.append('textInput', htmlTextInput);

      const res = await axios.post(`${BACKEND_URL}/api/pdf-suite`, fd, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const contentDisp = res.headers['content-disposition'] || '';
      const match = contentDisp.match(/filename="?([^";\n]+)"?/i);
      const extMap = { 'pdf-to-word': 'docx', 'pdf-to-excel': 'xlsx', 'pdf-to-powerpoint': 'pptx', 'pdf-to-markdown': 'md' };
      const fallbackName = `output_${activeSubTool}.${extMap[activeSubTool] || 'pdf'}`;
      const finalName = match ? match[1] : fallbackName;

      triggerDownloadBlob(res.data, finalName);
    } catch (err) {
      let msg = err.message || 'Operation failed.';
      if (err.response?.data instanceof Blob) {
        try {
          const parsed = JSON.parse(await err.response.data.text());
          msg = parsed.error || msg;
        } catch (e) {}
      }
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  // ─── Edit Studio: Load PDF, Image, Text, or CSV onto Canvas ───────────────
  const handleLoadIntoEditor = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setElements([]);
    setSelectedId(null);
    setCurrentPageIdx(0);

    try {
      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
        const buf = await f.arrayBuffer();
        setEditorPdfBytes(buf);
        const rendered = await renderPdfPagesToImages(buf, 1.5);
        setDocPages(rendered.map(p => ({ width: p.width, height: p.height, bgDataUrl: p.dataUrl, bgType: 'pdf' })));
      } else if (f.type.startsWith('image/')) {
        setEditorPdfBytes(null);
        const dataUrl = await new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.readAsDataURL(f);
        });
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, 800 / img.width);
          setDocPages([{ width: Math.round(img.width * scale), height: Math.round(img.height * scale), bgDataUrl: dataUrl, bgType: 'image' }]);
        };
        img.src = dataUrl;
      } else {
        // TXT or CSV
        setEditorPdfBytes(null);
        const text = await f.text();
        setDocPages([{ width: 595, height: 842, bgDataUrl: null, bgType: 'blank' }]);
        const lines = text.split(/\r?\n/).slice(0, 35);
        const formatted = f.name.toLowerCase().endsWith('.csv')
          ? lines.map(l => l.split(',').join('  |  ')).join('\n')
          : lines.join('\n');
        setElements([{
          id: `el_${Date.now()}`,
          pageIdx: 0,
          type: 'text',
          x: 40,
          y: 40,
          w: 515,
          h: 600,
          text: formatted,
          fontFamily: f.name.toLowerCase().endsWith('.csv') ? 'Courier New' : 'Helvetica',
          fontSize: 12,
          bold: false,
          italic: false,
          underline: false,
          strike: false,
          color: '#0f172a',
          bgColor: 'transparent',
          opacity: 1,
          shadow: false,
          rotation: 0,
          visible: true
        }]);
      }
      if (addToast) addToast(`Loaded ${f.name} into Edit Studio!`, 'success');
    } catch (err) {
      if (addToast) addToast('Failed to load document: ' + err.message, 'error');
    }
  };

  // Add elements onto current page
  const addElement = (overrides) => {
    const id = `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newEl = {
      id,
      pageIdx: currentPageIdx,
      x: 80,
      y: 100,
      w: 180,
      h: 48,
      fontFamily: 'Helvetica',
      fontSize: 18,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      color: '#0f172a',
      bgColor: 'transparent',
      fillColor: 'rgba(6, 182, 212, 0.2)',
      strokeColor: '#06b6d4',
      strokeWidth: 2,
      opacity: 1,
      shadow: false,
      rotation: 0,
      visible: true,
      ...overrides
    };
    setElements(prev => [...prev, newEl]);
    setSelectedId(id);
    setEditorTool('select');
  };

  const handleInsertImage = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.readAsDataURL(f);
    });
    addElement({ type: 'image', imgDataUrl: dataUrl, w: 200, h: 150 });
  };

  const handleAttachFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const bytes = await f.arrayBuffer();
    setAttachments(prev => [...prev, { name: f.name, bytes, type: f.type }]);
    if (addToast) addToast(`Attached ${f.name} to PDF`, 'success');
  };

  const updateSelected = (patch) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, ...patch } : el));
  };

  const moveLayer = (id, dir) => {
    setElements(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx === -1) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  };

  // Stage pointer handlers (Drag elements + Freehand Drawing)
  const getStageCoords = (e) => {
    const rect = stageRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
  };

  const handleStageMouseDown = (e) => {
    if (e.target === stageRef.current || e.target.dataset.bg === '1') {
      setSelectedId(null);
    }
    const { x, y } = getStageCoords(e);

    if (editorTool === 'draw' || editorTool === 'highlight') {
      drawPathRef.current = [{ x, y }];
      setLiveDrawPoints([{ x, y }]);
      return;
    }

    if (editorTool === 'text') {
      addElement({ type: 'text', x, y, w: 220, h: 42, text: 'Double-click or edit text in panel' });
      return;
    }
    if (['rect', 'circle', 'line', 'arrow', 'triangle', 'star'].includes(editorTool)) {
      addElement({ type: editorTool, x, y, w: 140, h: editorTool === 'line' || editorTool === 'arrow' ? 40 : 100 });
      return;
    }
    if (editorTool === 'redact') {
      addElement({ type: 'rect', x, y, w: 180, h: 36, fillColor: '#000000', strokeColor: '#000000', strokeWidth: 0 });
      return;
    }
    if (editorTool === 'form-text') {
      addElement({ type: 'form-text', x, y, w: 200, h: 34, fieldName: `field_${Date.now()}`, text: 'Form Text Input' });
      return;
    }
    if (editorTool === 'form-check') {
      addElement({ type: 'form-check', x, y, w: 26, h: 26, fieldName: `check_${Date.now()}` });
      return;
    }
  };

  const handleStageMouseMove = (e) => {
    if (drawPathRef.current) {
      const pt = getStageCoords(e);
      drawPathRef.current.push(pt);
      setLiveDrawPoints([...drawPathRef.current]);
      return;
    }
    if (dragStateRef.current) {
      const { id, startX, startY, origX, origY, mode, origW, origH } = dragStateRef.current;
      const { x, y } = getStageCoords(e);
      const dx = x - startX;
      const dy = y - startY;
      setElements(prev => prev.map(el => {
        if (el.id !== id) return el;
        if (mode === 'resize') {
          return { ...el, w: Math.max(20, origW + dx), h: Math.max(20, origH + dy) };
        }
        return { ...el, x: origX + dx, y: origY + dy };
      }));
    }
  };

  const handleStageMouseUp = () => {
    if (drawPathRef.current && drawPathRef.current.length > 1) {
      const pts = drawPathRef.current;
      const xs = pts.map(p => p.x);
      const ys = pts.map(p => p.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const w = Math.max(10, Math.max(...xs) - minX);
      const h = Math.max(10, Math.max(...ys) - minY);
      const relPts = pts.map(p => ({ x: p.x - minX, y: p.y - minY }));
      addElement({
        type: 'path',
        x: minX,
        y: minY,
        w,
        h,
        points: relPts,
        strokeColor: drawColor,
        strokeWidth: editorTool === 'highlight' ? Math.max(12, drawSize * 3) : drawSize,
        opacity: editorTool === 'highlight' ? 0.35 : 1
      });
    }
    drawPathRef.current = null;
    setLiveDrawPoints(null);
    dragStateRef.current = null;
  };

  // Signature pad helpers
  const startSignDraw = (e) => {
    isSigningRef.current = true;
    const canvas = signCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const moveSignDraw = (e) => {
    if (!isSigningRef.current) return;
    const canvas = signCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  const endSignDraw = () => { isSigningRef.current = false; };
  const insertSignatureFromModal = () => {
    let dataUrl;
    if (signMode === 'draw') {
      dataUrl = signCanvasRef.current.toDataURL('image/png');
    } else {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 120;
      const ctx = c.getContext('2d');
      ctx.font = 'italic 42px Georgia, serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(typedSign || 'Signature', 20, 75);
      dataUrl = c.toDataURL('image/png');
    }
    addElement({ type: 'image', imgDataUrl: dataUrl, w: 180, h: 65 });
    setShowSignModal(false);
  };

  // Export Edited Document as Real PDF via pdf-lib
  const exportEditedPdf = async () => {
    try {
      let pdfDoc;
      if (editorPdfBytes) {
        pdfDoc = await PDFDocument.load(editorPdfBytes.slice(0), { ignoreEncryption: true });
      } else {
        pdfDoc = await PDFDocument.create();
        for (const p of docPages) {
          const page = pdfDoc.addPage([p.width, p.height]);
          if (p.bgDataUrl) {
            const bytes = await fetch(p.bgDataUrl).then(r => r.arrayBuffer());
            const img = p.bgDataUrl.includes('image/png') ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
            page.drawImage(img, { x: 0, y: 0, width: p.width, height: p.height });
          }
        }
      }

      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontCourier = await pdfDoc.embedFont(StandardFonts.Courier);
      const form = pdfDoc.getForm();
      const pages = pdfDoc.getPages();

      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const page = pages[pIdx];
        const { width: pw, height: ph } = page.getSize();
        const pageEls = elements.filter(el => el.pageIdx === pIdx && el.visible !== false);

        for (const el of pageEls) {
          const pdfY = ph - el.y - el.h;

          if (el.type === 'text') {
            const font = el.fontFamily?.includes('Times') ? fontTimes
              : el.fontFamily?.includes('Courier') ? fontCourier
              : el.bold ? fontBold
              : el.italic ? fontItalic : fontRegular;

            if (el.bgColor && el.bgColor !== 'transparent') {
              page.drawRectangle({ x: el.x, y: pdfY, width: el.w, height: el.h, color: hexToRgbNorm(el.bgColor), opacity: el.opacity ?? 1 });
            }
            const lines = (el.text || '').split('\n');
            lines.forEach((line, li) => {
              const safeLine = line.replace(/[^\x20-\x7E]/g, '?');
              const ly = ph - el.y - (el.fontSize || 16) - li * ((el.fontSize || 16) * 1.3);
              page.drawText(safeLine, {
                x: el.x,
                y: ly,
                size: el.fontSize || 16,
                font,
                color: hexToRgbNorm(el.color || '#000000'),
                opacity: el.opacity ?? 1
              });
              if (el.underline) {
                const tw = font.widthOfTextAtSize(safeLine, el.fontSize || 16);
                page.drawLine({ start: { x: el.x, y: ly - 2 }, end: { x: el.x + tw, y: ly - 2 }, thickness: 1, color: hexToRgbNorm(el.color || '#000000') });
              }
              if (el.strike) {
                const tw = font.widthOfTextAtSize(safeLine, el.fontSize || 16);
                page.drawLine({ start: { x: el.x, y: ly + (el.fontSize || 16) * 0.35 }, end: { x: el.x + tw, y: ly + (el.fontSize || 16) * 0.35 }, thickness: 1, color: hexToRgbNorm(el.color || '#000000') });
              }
            });
          } else if (el.type === 'rect') {
            page.drawRectangle({
              x: el.x,
              y: pdfY,
              width: el.w,
              height: el.h,
              color: el.fillColor && el.fillColor !== 'transparent' ? hexToRgbNorm(el.fillColor) : undefined,
              borderColor: el.strokeColor ? hexToRgbNorm(el.strokeColor) : undefined,
              borderWidth: el.strokeWidth ?? 1,
              opacity: el.opacity ?? 1
            });
          } else if (el.type === 'circle') {
            page.drawEllipse({
              x: el.x + el.w / 2,
              y: pdfY + el.h / 2,
              xScale: el.w / 2,
              yScale: el.h / 2,
              color: el.fillColor && el.fillColor !== 'transparent' ? hexToRgbNorm(el.fillColor) : undefined,
              borderColor: el.strokeColor ? hexToRgbNorm(el.strokeColor) : undefined,
              borderWidth: el.strokeWidth ?? 1,
              opacity: el.opacity ?? 1
            });
          } else if (el.type === 'line' || el.type === 'arrow') {
            page.drawLine({
              start: { x: el.x, y: ph - el.y - el.h / 2 },
              end: { x: el.x + el.w, y: ph - el.y - el.h / 2 },
              thickness: el.strokeWidth || 2,
              color: hexToRgbNorm(el.strokeColor || '#06b6d4'),
              opacity: el.opacity ?? 1
            });
          } else if (el.type === 'path' && el.points?.length > 1) {
            for (let i = 1; i < el.points.length; i++) {
              const p1 = el.points[i - 1];
              const p2 = el.points[i];
              page.drawLine({
                start: { x: el.x + p1.x, y: ph - (el.y + p1.y) },
                end: { x: el.x + p2.x, y: ph - (el.y + p2.y) },
                thickness: el.strokeWidth || 2,
                color: hexToRgbNorm(el.strokeColor || '#06b6d4'),
                opacity: el.opacity ?? 1
              });
            }
          } else if (el.type === 'image' && el.imgDataUrl) {
            const bytes = await fetch(el.imgDataUrl).then(r => r.arrayBuffer());
            const img = el.imgDataUrl.includes('image/png') ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
            page.drawImage(img, { x: el.x, y: pdfY, width: el.w, height: el.h, opacity: el.opacity ?? 1 });
          } else if (el.type === 'form-text') {
            const tf = form.createTextField(el.fieldName || `tf_${el.id}`);
            tf.setText(el.text || '');
            tf.addToPage(page, { x: el.x, y: pdfY, width: el.w, height: el.h });
          } else if (el.type === 'form-check') {
            const cb = form.createCheckBox(el.fieldName || `cb_${el.id}`);
            cb.addToPage(page, { x: el.x, y: pdfY, width: el.w, height: el.h });
          }
        }

        // Apply Watermark
        if (watermarkCfg.enabled && watermarkCfg.text) {
          page.drawText(watermarkCfg.text.replace(/[^\x20-\x7E]/g, '?'), {
            x: pw * 0.2,
            y: ph * 0.45,
            size: 48,
            font: fontBold,
            color: hexToRgbNorm(watermarkCfg.color),
            opacity: watermarkCfg.opacity,
            rotate: degrees(watermarkCfg.rotation)
          });
        }

        // Apply Page Numbers
        if (pageNumbersCfg.enabled) {
          const label = `${pageNumbersCfg.prefix}${pIdx + 1} / ${pages.length}`;
          const yPos = pageNumbersCfg.position.startsWith('top') ? ph - 28 : 18;
          page.drawText(label, { x: pw / 2 - 25, y: yPos, size: 11, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        }

        // Apply Crop Box
        if (cropCfg.top || cropCfg.right || cropCfg.bottom || cropCfg.left) {
          const cx = (cropCfg.left / 100) * pw;
          const cy = (cropCfg.bottom / 100) * ph;
          const cw = pw * (1 - (cropCfg.left + cropCfg.right) / 100);
          const ch = ph * (1 - (cropCfg.top + cropCfg.bottom) / 100);
          if (cw > 50 && ch > 50) page.setCropBox(cx, cy, cw, ch);
        }
      }

      // Embed Attachments
      for (const att of attachments) {
        await pdfDoc.attach(att.bytes, att.name, { mimeType: att.type || 'application/octet-stream' });
      }

      const outBytes = await pdfDoc.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited_document.pdf';
      a.click();
      URL.revokeObjectURL(url);
      if (incrementConversion) incrementConversion();
      if (addToast) addToast('Exported edited_document.pdf!', 'success');
    } catch (err) {
      if (addToast) addToast('Export failed: ' + err.message, 'error');
    }
  };

  // Export current page as PNG / JPG
  const exportCurrentPageImage = async (fmt = 'png') => {
    const page = docPages[currentPageIdx];
    const canvas = document.createElement('canvas');
    canvas.width = page.width * 2;
    canvas.height = page.height * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, page.width, page.height);

    if (page.bgDataUrl) {
      await new Promise((res) => {
        const img = new Image();
        img.onload = () => { ctx.drawImage(img, 0, 0, page.width, page.height); res(); };
        img.src = page.bgDataUrl;
      });
    }

    const pageEls = elements.filter(el => el.pageIdx === currentPageIdx && el.visible !== false);
    for (const el of pageEls) {
      ctx.save();
      ctx.globalAlpha = el.opacity ?? 1;
      if (el.type === 'text') {
        if (el.bgColor && el.bgColor !== 'transparent') {
          ctx.fillStyle = el.bgColor;
          ctx.fillRect(el.x, el.y, el.w, el.h);
        }
        ctx.font = `${el.italic ? 'italic ' : ''}${el.bold ? 'bold ' : ''}${el.fontSize || 16}px ${el.fontFamily || 'Helvetica'}`;
        ctx.fillStyle = el.color || '#0f172a';
        (el.text || '').split('\n').forEach((line, i) => {
          ctx.fillText(line, el.x, el.y + (el.fontSize || 16) + i * (el.fontSize || 16) * 1.3);
        });
      } else if (el.type === 'rect') {
        if (el.fillColor && el.fillColor !== 'transparent') { ctx.fillStyle = el.fillColor; ctx.fillRect(el.x, el.y, el.w, el.h); }
        if (el.strokeWidth) { ctx.strokeStyle = el.strokeColor || '#06b6d4'; ctx.lineWidth = el.strokeWidth; ctx.strokeRect(el.x, el.y, el.w, el.h); }
      } else if (el.type === 'circle') {
        ctx.beginPath();
        ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
        if (el.fillColor && el.fillColor !== 'transparent') { ctx.fillStyle = el.fillColor; ctx.fill(); }
        if (el.strokeWidth) { ctx.strokeStyle = el.strokeColor || '#06b6d4'; ctx.lineWidth = el.strokeWidth; ctx.stroke(); }
      } else if (el.type === 'path' && el.points?.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = el.strokeColor || '#06b6d4';
        ctx.lineWidth = el.strokeWidth || 2;
        ctx.lineCap = 'round';
        ctx.moveTo(el.x + el.points[0].x, el.y + el.points[0].y);
        el.points.forEach(p => ctx.lineTo(el.x + p.x, el.y + p.y));
        ctx.stroke();
      } else if (el.type === 'image' && el.imgDataUrl) {
        await new Promise((res) => {
          const img = new Image();
          img.onload = () => { ctx.drawImage(img, el.x, el.y, el.w, el.h); res(); };
          img.src = el.imgDataUrl;
        });
      }
      ctx.restore();
    }

    const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
    const url = canvas.toDataURL(mime, 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edited_page_${currentPageIdx + 1}.${fmt}`;
    a.click();
    if (addToast) addToast(`Exported page as ${fmt.toUpperCase()}`, 'success');
  };

  const selectedEl = elements.find(e => e.id === selectedId);
  const currentPage = docPages[currentPageIdx] || docPages[0];
  const currentPageElements = elements.filter(e => e.pageIdx === currentPageIdx);

  return (
    <div className="container animate-fade-in" style={{ padding: '24px 0 60px 0' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => { setView('dashboard'); setActiveTool(null); }}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}
          >
            <FiArrowLeft /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>PDF Suite & Document Studio</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Organize, Optimize, Convert, Edit (PDF, Image, Text, CSV), Sign, Secure & AI Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySwitch(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 15px', borderRadius: '12px', fontSize: '13px', fontWeight: '700',
                border: active ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                background: active ? 'var(--primary-gradient)' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text-main)', cursor: 'pointer'
              }}
            >
              <Icon size={15} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Tool Pills (for non-editor categories) */}
      {category !== 'edit' && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {(TOOLS_BY_CATEGORY[category] || []).map(sub => {
            const active = activeSubTool === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => handleSubToolSwitch(sub.id)}
                style={{
                  padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '600',
                  border: active ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  background: active ? 'rgba(6, 182, 212, 0.14)' : 'var(--bg-grid)',
                  color: active ? 'var(--accent-color)' : 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ─── MODE A: EDIT STUDIO (CANVA / SEJDA-STYLE DOCUMENT EDITOR) ─────── */}
      {category === 'edit' ? (
        <div className="glass-panel" style={{ borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          {/* Studio Top Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-grid)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input ref={editorUploadRef} type="file" accept=".pdf,image/*,.txt,.csv" style={{ display: 'none' }} onChange={handleLoadIntoEditor} />
              <button className="btn btn-secondary" onClick={() => editorUploadRef.current.click()} style={{ padding: '7px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiUploadCloud /> Open PDF / Img / TXT / CSV
              </button>
              <button className="btn btn-secondary" onClick={() => setDocPages(p => [...p, { width: 595, height: 842, bgDataUrl: null, bgType: 'blank' }])} style={{ padding: '7px 10px', fontSize: '12px' }}>
                + Blank Page
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentPageIdx(i => Math.max(0, i - 1))} style={{ padding: '5px 9px', fontSize: '12px' }}>‹</button>
                <span style={{ fontSize: '12px', fontWeight: '700' }}>Page {currentPageIdx + 1}/{docPages.length}</span>
                <button className="btn btn-secondary" onClick={() => setCurrentPageIdx(i => Math.min(docPages.length - 1, i + 1))} style={{ padding: '5px 9px', fontSize: '12px' }}>›</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                <button className="btn btn-secondary" onClick={() => setZoom(z => Math.max(0.4, +(z - 0.15).toFixed(2)))} style={{ padding: '5px 8px' }}><FiZoomOut size={14} /></button>
                <span style={{ fontSize: '12px', minWidth: '42px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
                <button className="btn btn-secondary" onClick={() => setZoom(z => Math.min(2.5, +(z + 0.15).toFixed(2)))} style={{ padding: '5px 8px' }}><FiZoomIn size={14} /></button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => exportCurrentPageImage('png')} style={{ padding: '7px 12px', fontSize: '12px' }}>Export PNG</button>
              <button className="btn btn-secondary" onClick={() => exportCurrentPageImage('jpg')} style={{ padding: '7px 12px', fontSize: '12px' }}>Export JPG</button>
              <button className="btn btn-primary" onClick={exportEditedPdf} style={{ padding: '7px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiDownload /> Export PDF
              </button>
            </div>
          </div>

          {/* Studio 3-Column Workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr 290px', minHeight: '640px' }} className="studio-grid">
            {/* Left Tool Dock */}
            <div style={{ borderRight: '1px solid var(--border-color)', padding: '10px 6px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-grid)' }}>
              {[
                { id: 'select', label: 'Select', icon: FiMove },
                { id: 'text', label: 'Text', icon: FiType },
                { id: 'rect', label: 'Box', icon: FiSquare },
                { id: 'circle', label: 'Circle', icon: FiCircle },
                { id: 'line', label: 'Line', icon: FiScissors },
                { id: 'draw', label: 'Draw', icon: FiEdit3 },
                { id: 'highlight', label: 'Annotate', icon: FiDroplet },
                { id: 'redact', label: 'Redact', icon: FiEyeOff },
                { id: 'form-text', label: 'Form', icon: FiFileText },
                { id: 'form-check', label: 'Check', icon: FiCheckSquare }
              ].map(t => {
                const Icon = t.icon;
                const active = editorTool === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setEditorTool(t.id)}
                    title={t.label}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                      padding: '8px 4px', borderRadius: '10px', fontSize: '10px', fontWeight: '700',
                      border: active ? '1px solid var(--accent-color)' : '1px solid transparent',
                      background: active ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                      color: active ? 'var(--accent-color)' : 'var(--text-muted)', cursor: 'pointer'
                    }}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}

              <input ref={insertImageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleInsertImage} />
              <button onClick={() => insertImageRef.current.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '8px 4px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiImage size={16} /><span>Image</span>
              </button>

              <button onClick={() => setShowSignModal(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '8px 4px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiEdit3 size={16} /><span>Sign</span>
              </button>

              <input ref={attachFileRef} type="file" style={{ display: 'none' }} onChange={handleAttachFile} />
              <button onClick={() => attachFileRef.current.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '8px 4px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiPaperclip size={16} /><span>Attach</span>
              </button>
            </div>

            {/* Center Interactive Document Canvas */}
            <div style={{ overflow: 'auto', padding: '24px', background: '#0b1120', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <div
                ref={stageRef}
                data-bg="1"
                onMouseDown={handleStageMouseDown}
                onMouseMove={handleStageMouseMove}
                onMouseUp={handleStageMouseUp}
                style={{
                  position: 'relative',
                  width: currentPage.width * zoom,
                  height: currentPage.height * zoom,
                  background: '#ffffff',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  cursor: editorTool === 'select' ? 'default' : 'crosshair',
                  userSelect: 'none',
                  overflow: 'hidden'
                }}
              >
                {currentPage.bgDataUrl && (
                  <img
                    src={currentPage.bgDataUrl}
                    alt="Document Page"
                    data-bg="1"
                    draggable={false}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none' }}
                  />
                )}

                {/* Watermark Preview */}
                {watermarkCfg.enabled && (
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: `translate(-50%, -50%) rotate(${watermarkCfg.rotation}deg)`,
                    fontSize: `${44 * zoom}px`, fontWeight: '800', color: watermarkCfg.color,
                    opacity: watermarkCfg.opacity, pointerEvents: 'none', whiteSpace: 'nowrap'
                  }}>
                    {watermarkCfg.text}
                  </div>
                )}

                {/* Rendered Elements on Current Page */}
                {currentPageElements.map(el => {
                  if (el.visible === false) return null;
                  const isSel = el.id === selectedId;
                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setSelectedId(el.id);
                        if (editorTool === 'select') {
                          const pt = getStageCoords(e);
                          dragStateRef.current = { id: el.id, startX: pt.x, startY: pt.y, origX: el.x, origY: el.y, mode: 'move' };
                        }
                      }}
                      style={{
                        position: 'absolute',
                        left: el.x * zoom,
                        top: el.y * zoom,
                        width: el.w * zoom,
                        height: el.h * zoom,
                        opacity: el.opacity ?? 1,
                        transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                        outline: isSel ? '2px dashed #06b6d4' : 'none',
                        cursor: editorTool === 'select' ? 'move' : 'inherit'
                      }}
                    >
                      {el.type === 'text' && (
                        <div style={{
                          width: '100%', height: '100%',
                          fontFamily: el.fontFamily, fontSize: (el.fontSize || 16) * zoom,
                          fontWeight: el.bold ? 'bold' : 'normal',
                          fontStyle: el.italic ? 'italic' : 'normal',
                          textDecoration: `${el.underline ? 'underline' : ''} ${el.strike ? 'line-through' : ''}`.trim(),
                          color: el.color, backgroundColor: el.bgColor,
                          textShadow: el.shadow ? '2px 2px 4px rgba(0,0,0,0.35)' : 'none',
                          whiteSpace: 'pre-wrap', lineHeight: 1.3, padding: '2px'
                        }}>
                          {el.text}
                        </div>
                      )}

                      {el.type === 'rect' && (
                        <div style={{ width: '100%', height: '100%', background: el.fillColor, border: `${(el.strokeWidth ?? 2) * zoom}px solid ${el.strokeColor}` }} />
                      )}

                      {el.type === 'circle' && (
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: el.fillColor, border: `${(el.strokeWidth ?? 2) * zoom}px solid ${el.strokeColor}` }} />
                      )}

                      {(el.type === 'line' || el.type === 'arrow') && (
                        <svg width="100%" height="100%" viewBox={`0 0 ${el.w} ${el.h}`}>
                          <line x1="0" y1={el.h / 2} x2={el.w - (el.type === 'arrow' ? 10 : 0)} y2={el.h / 2} stroke={el.strokeColor} strokeWidth={el.strokeWidth || 2} />
                          {el.type === 'arrow' && <polygon points={`${el.w},${el.h / 2} ${el.w - 12},${el.h / 2 - 6} ${el.w - 12},${el.h / 2 + 6}`} fill={el.strokeColor} />}
                        </svg>
                      )}

                      {el.type === 'path' && el.points && (
                        <svg width="100%" height="100%" viewBox={`0 0 ${el.w} ${el.h}`} style={{ overflow: 'visible' }}>
                          <polyline
                            fill="none"
                            stroke={el.strokeColor}
                            strokeWidth={el.strokeWidth || 2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={el.points.map(p => `${p.x},${p.y}`).join(' ')}
                          />
                        </svg>
                      )}

                      {el.type === 'image' && (
                        <img src={el.imgDataUrl} alt="Inserted" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      )}

                      {el.type === 'form-text' && (
                        <div style={{ width: '100%', height: '100%', border: '1px solid #3b82f6', background: 'rgba(59,130,246,0.08)', color: '#1e3a8a', fontSize: 12 * zoom, padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
                          [Form Field: {el.text}]
                        </div>
                      )}

                      {el.type === 'form-check' && (
                        <div style={{ width: '100%', height: '100%', border: '2px solid #3b82f6', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontWeight: 'bold' }}>✓</div>
                      )}

                      {/* Resize Handle */}
                      {isSel && (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const pt = getStageCoords(e);
                            dragStateRef.current = { id: el.id, startX: pt.x, startY: pt.y, origW: el.w, origH: el.h, mode: 'resize' };
                          }}
                          style={{ position: 'absolute', right: -5, bottom: -5, width: 10, height: 10, background: '#06b6d4', cursor: 'nwse-resize', borderRadius: '2px' }}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Live Freehand Stroke Preview */}
                {liveDrawPoints && liveDrawPoints.length > 1 && (
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox={`0 0 ${currentPage.width} ${currentPage.height}`}>
                    <polyline
                      fill="none"
                      stroke={drawColor}
                      strokeWidth={editorTool === 'highlight' ? Math.max(12, drawSize * 3) : drawSize}
                      strokeOpacity={editorTool === 'highlight' ? 0.35 : 1}
                      strokeLinecap="round"
                      points={liveDrawPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Right Properties, Effects, Watermark/PageNumbers/Crop & Layers Panel */}
            <div style={{ borderLeft: '1px solid var(--border-color)', padding: '14px', overflowY: 'auto', maxHeight: '700px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Brush / Draw Controls */}
              {(editorTool === 'draw' || editorTool === 'highlight') && (
                <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>Brush / Highlighter</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px' }}>Color:</span>
                    <input type="color" value={drawColor} onChange={e => setDrawColor(e.target.value)} />
                    <span style={{ fontSize: '11px' }}>Size: {drawSize}px</span>
                  </div>
                  <input type="range" min="1" max="24" value={drawSize} onChange={e => setDrawSize(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              )}

              {/* Selected Element Inspector */}
              {selectedEl ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', borderRadius: '12px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>{selectedEl.type} Properties</span>
                    <button onClick={() => { setElements(prev => prev.filter(e => e.id !== selectedEl.id)); setSelectedId(null); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 /></button>
                  </div>

                  {selectedEl.type === 'text' && (
                    <>
                      <textarea rows={3} value={selectedEl.text} onChange={e => updateSelected({ text: e.target.value })} style={{ width: '100%', padding: '6px', fontSize: '12px' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px', gap: '6px' }}>
                        <select value={selectedEl.fontFamily} onChange={e => updateSelected({ fontFamily: e.target.value })} style={{ fontSize: '11.5px', padding: '5px' }}>
                          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <input type="number" min="8" max="96" value={selectedEl.fontSize} onChange={e => updateSelected({ fontSize: Number(e.target.value) })} style={{ fontSize: '12px', padding: '5px' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => updateSelected({ bold: !selectedEl.bold })} className="btn btn-secondary" style={{ flex: 1, padding: '5px', background: selectedEl.bold ? 'var(--accent-color)' : undefined, color: selectedEl.bold ? '#fff' : undefined }}><FiBold /></button>
                        <button onClick={() => updateSelected({ italic: !selectedEl.italic })} className="btn btn-secondary" style={{ flex: 1, padding: '5px', background: selectedEl.italic ? 'var(--accent-color)' : undefined, color: selectedEl.italic ? '#fff' : undefined }}><FiItalic /></button>
                        <button onClick={() => updateSelected({ underline: !selectedEl.underline })} className="btn btn-secondary" style={{ flex: 1, padding: '5px', background: selectedEl.underline ? 'var(--accent-color)' : undefined, color: selectedEl.underline ? '#fff' : undefined }}><FiUnderline /></button>
                        <button onClick={() => updateSelected({ strike: !selectedEl.strike })} className="btn btn-secondary" style={{ flex: 1, padding: '5px', fontSize: '11px', background: selectedEl.strike ? 'var(--accent-color)' : undefined, color: selectedEl.strike ? '#fff' : undefined }}>S̶</button>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Text Color & Custom Picker</div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {COLOR_SWATCHES.map(c => (
                            <button key={c} onClick={() => updateSelected({ color: c })} style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: selectedEl.color === c ? '2px solid #06b6d4' : '1px solid #475569', cursor: 'pointer' }} />
                          ))}
                          <input type="color" value={selectedEl.color} onChange={e => updateSelected({ color: e.target.value })} title="Custom Text Color" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span>Highlight BG:</span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input type="color" value={selectedEl.bgColor === 'transparent' ? '#ffff00' : selectedEl.bgColor} onChange={e => updateSelected({ bgColor: e.target.value })} />
                          <button onClick={() => updateSelected({ bgColor: 'transparent' })} style={{ fontSize: '10px', padding: '2px 6px' }}>Clear</button>
                        </div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <input type="checkbox" checked={!!selectedEl.shadow} onChange={e => updateSelected({ shadow: e.target.checked })} /> Drop Shadow Effect
                      </label>
                    </>
                  )}

                  {['rect', 'circle', 'line', 'arrow', 'path'].includes(selectedEl.type) && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span>Fill:</span>
                        <input type="color" value={selectedEl.fillColor?.startsWith('#') ? selectedEl.fillColor : '#06b6d4'} onChange={e => updateSelected({ fillColor: e.target.value })} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span>Stroke:</span>
                        <input type="color" value={selectedEl.strokeColor || '#06b6d4'} onChange={e => updateSelected({ strokeColor: e.target.value })} />
                      </div>
                      <div style={{ fontSize: '11px' }}>Stroke Width: {selectedEl.strokeWidth}px</div>
                      <input type="range" min="0" max="20" value={selectedEl.strokeWidth ?? 2} onChange={e => updateSelected({ strokeWidth: Number(e.target.value) })} />
                    </>
                  )}

                  <div style={{ fontSize: '11px' }}>Opacity: {Math.round((selectedEl.opacity ?? 1) * 100)}%</div>
                  <input type="range" min="0.1" max="1" step="0.05" value={selectedEl.opacity ?? 1} onChange={e => updateSelected({ opacity: Number(e.target.value) })} />
                  <div style={{ fontSize: '11px' }}>Rotation: {selectedEl.rotation || 0}°</div>
                  <input type="range" min="-180" max="180" value={selectedEl.rotation || 0} onChange={e => updateSelected({ rotation: Number(e.target.value) })} />
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '10px', borderRadius: '10px', background: 'var(--bg-grid)' }}>
                  Click any tool on the left to add Text, Shapes, Drawings, Forms, Signatures, or Images, then click an element to style it.
                </div>
              )}

              {/* Watermark, Page Numbers, Crop & Attachments */}
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800' }}>Page Options (Export)</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
                  <input type="checkbox" checked={watermarkCfg.enabled} onChange={e => setWatermarkCfg(w => ({ ...w, enabled: e.target.checked }))} /> Add Watermark
                </label>
                {watermarkCfg.enabled && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input type="text" value={watermarkCfg.text} onChange={e => setWatermarkCfg(w => ({ ...w, text: e.target.value }))} style={{ flex: 1, fontSize: '11px', padding: '4px' }} />
                    <input type="color" value={watermarkCfg.color} onChange={e => setWatermarkCfg(w => ({ ...w, color: e.target.value }))} />
                  </div>
                )}
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
                  <input type="checkbox" checked={pageNumbersCfg.enabled} onChange={e => setPageNumbersCfg(p => ({ ...p, enabled: e.target.checked }))} /> Add Page Numbers
                </label>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Crop Margins % (Top / Bottom):</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="number" min="0" max="40" value={cropCfg.top} onChange={e => setCropCfg(c => ({ ...c, top: Number(e.target.value) }))} placeholder="Top %" style={{ width: '50%', fontSize: '11px', padding: '4px' }} />
                  <input type="number" min="0" max="40" value={cropCfg.bottom} onChange={e => setCropCfg(c => ({ ...c, bottom: Number(e.target.value) }))} placeholder="Bottom %" style={{ width: '50%', fontSize: '11px', padding: '4px' }} />
                </div>
                {attachments.length > 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--accent-color)' }}>Attachments ({attachments.length}): {attachments.map(a => a.name).join(', ')}</div>
                )}
              </div>

              {/* Layers Panel */}
              <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiLayers /> Layers ({currentPageElements.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[...currentPageElements].reverse().map(el => (
                    <div
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px',
                        borderRadius: '8px', fontSize: '11.5px', cursor: 'pointer',
                        background: el.id === selectedId ? 'rgba(6, 182, 212, 0.16)' : 'var(--bg-card)',
                        border: el.id === selectedId ? '1px solid var(--accent-color)' : '1px solid var(--border-color)'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                        {el.type === 'text' ? (el.text || 'Text') : el.type}
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={(e) => { e.stopPropagation(); setElements(prev => prev.map(x => x.id === el.id ? { ...x, visible: x.visible === false ? true : false } : x)); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          {el.visible === false ? <FiEyeOff size={12} /> : <FiEye size={12} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 1); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiArrowUp size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveLayer(el.id, -1); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><FiArrowDown size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setElements(prev => prev.filter(x => x.id !== el.id)); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ─── MODE B: STANDARD PDF OPERATIONS WORKSPACE ─────────────────────── */
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>
              {(TOOLS_BY_CATEGORY[category] || []).find(t => t.id === activeSubTool)?.label || activeSubTool}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {activeSubTool === 'merge' && 'Upload 2 or more PDF files, reorder them, and merge into one clean PDF.'}
              {activeSubTool === 'split' && 'Enter page ranges (e.g. 1-2, 3-5) to split your PDF into separate files.'}
              {activeSubTool === 'organize-pages' && 'Visual page manager: rotate pages, toggle pages to remove/extract, and export.'}
              {activeSubTool === 'ai-compare' && 'Upload 2 PDF files to generate a detailed AI comparison & diff report.'}
              {activeSubTool === 'html-to-pdf' && 'Upload an HTML/TXT file or paste HTML/text below to convert into a formatted PDF.'}
            </p>
          </div>

          {/* File Dropzone */}
          <div
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '32px 16px', border: '2px dashed var(--border-color)', borderRadius: '16px',
              textAlign: 'center', cursor: 'pointer', marginBottom: '20px', background: 'var(--bg-grid)'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={activeSubTool === 'merge' || activeSubTool === 'jpg-to-pdf' || activeSubTool === 'ai-compare'}
              accept={
                activeSubTool === 'jpg-to-pdf' ? 'image/*' :
                activeSubTool === 'word-to-pdf' ? '.doc,.docx' :
                activeSubTool === 'powerpoint-to-pdf' ? '.ppt,.pptx' :
                activeSubTool === 'excel-to-pdf' ? '.xls,.xlsx,.csv' :
                activeSubTool === 'html-to-pdf' ? '.html,.htm,.txt' :
                activeSubTool === 'ocr' || activeSubTool === 'ai-ocr' ? '.pdf,image/*' : '.pdf'
              }
              style={{ display: 'none' }}
              onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = ''; }}
            />
            <FiUploadCloud size={34} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', fontWeight: '700' }}>
              {files.length > 0 ? `${files.length} file(s) selected: ${files.map(f => f.name).join(', ')}` : 'Click to select file(s)'}
            </div>
          </div>

          {/* Reorderable File List for Merge PDF / JPG to PDF */}
          {(activeSubTool === 'merge' || activeSubTool === 'jpg-to-pdf') && files.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                <span>File Order ({files.length}):</span>
                <button className="btn btn-secondary" onClick={() => setFiles([])} style={{ padding: '3px 8px', fontSize: '11px' }}>Clear All</button>
              </div>
              {files.map((f, idx) => (
                <div key={`${f.name}_${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '10px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)', fontSize: '12.5px' }}>
                  <span><strong>#{idx + 1}</strong> {f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-secondary" disabled={idx === 0} onClick={() => setFiles(prev => { const c = [...prev]; [c[idx], c[idx - 1]] = [c[idx - 1], c[idx]]; return c; })} style={{ padding: '3px 7px', fontSize: '11px' }}><FiArrowUp /></button>
                    <button className="btn btn-secondary" disabled={idx === files.length - 1} onClick={() => setFiles(prev => { const c = [...prev]; [c[idx], c[idx + 1]] = [c[idx + 1], c[idx]]; return c; })} style={{ padding: '3px 7px', fontSize: '11px' }}><FiArrowDown /></button>
                    <button className="btn btn-secondary" onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '3px 7px', fontSize: '11px', color: '#ef4444' }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tool-Specific Options */}
          {activeSubTool === 'split' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Page Ranges (comma separated, e.g. 1-2, 3-4)</label>
              <input type="text" value={splitRange} onChange={e => setSplitRange(e.target.value)} style={{ width: '100%' }} />
            </div>
          )}

          {activeSubTool === 'compress' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Compression Level</label>
              <select value={compressLevel} onChange={e => setCompressLevel(e.target.value)} style={{ width: '100%' }}>
                <option value="medium">Recommended Compression (Balanced Quality)</option>
                <option value="high">Extreme Compression (Smallest Size)</option>
              </select>
            </div>
          )}

          {(activeSubTool === 'protect' || activeSubTool === 'unlock') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                {activeSubTool === 'protect' ? 'Set PDF Password' : 'Enter Current Password (if required)'}
              </label>
              <input type="password" value={pdfPassword} onChange={e => setPdfPassword(e.target.value)} placeholder="Enter password..." style={{ width: '100%' }} />
            </div>
          )}

          {activeSubTool === 'ai-translate' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Target Language</label>
              <input type="text" value={targetLang} onChange={e => setTargetLang(e.target.value)} placeholder="e.g. Hindi, Hinglish, Gujarati, Marathi, Tamil, Spanish..." style={{ width: '100%' }} />
            </div>
          )}

          {activeSubTool === 'html-to-pdf' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Or Paste HTML / Text Content</label>
              <textarea rows={5} value={htmlTextInput} onChange={e => setHtmlTextInput(e.target.value)} placeholder="<h1>Hello</h1><p>Paste HTML or plain text here...</p>" style={{ width: '100%' }} />
            </div>
          )}

          {/* Visual Page Grid for Organize / Rotate / Remove / Extract */}
          {activeSubTool === 'organize-pages' && orgPages.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Drag & drop pages or use ← / → to reorder ({orgPages.filter(p => p.selected).length}/{orgPages.length} kept)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary" onClick={() => setOrgPages(prev => prev.map(p => ({ ...p, selected: true })))} style={{ padding: '5px 10px', fontSize: '11.5px' }}>Select All</button>
                  <button className="btn btn-secondary" onClick={() => setOrgPages(prev => prev.map(p => ({ ...p, selected: false })))} style={{ padding: '5px 10px', fontSize: '11.5px' }}>Deselect All</button>
                  <button className="btn btn-secondary" onClick={() => loadOrganizerFromFile(files[0])} style={{ padding: '5px 10px', fontSize: '11.5px' }}>Reset</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '12px' }}>
                {orgPages.map((p, idx) => (
                  <div
                    key={p.uid || `${p.index}_${idx}`}
                    draggable
                    onDragStart={() => setOrgDragIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (orgDragIdx !== null && orgDragIdx !== idx) {
                        moveOrgPage(orgDragIdx, idx);
                      }
                      setOrgDragIdx(null);
                    }}
                    style={{
                      padding: '8px', borderRadius: '12px', background: 'var(--bg-grid)',
                      border: p.selected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                      opacity: p.selected ? 1 : 0.45, textAlign: 'center', cursor: 'grab'
                    }}
                  >
                    <img src={p.dataUrl} alt={`Page ${p.index + 1}`} draggable={false} style={{ width: '100%', height: '150px', objectFit: 'contain', transform: `rotate(${p.rotate}deg)`, transition: '0.2s' }} />
                    <div style={{ fontSize: '11px', fontWeight: '700', margin: '6px 0' }}>
                      #{idx + 1} <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>(Orig p.{p.index + 1})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      <button onClick={() => moveOrgPage(idx, idx - 1)} disabled={idx === 0} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: '11px' }} title="Move Left">←</button>
                      <button onClick={() => moveOrgPage(idx, idx + 1)} disabled={idx === orgPages.length - 1} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: '11px' }} title="Move Right">→</button>
                      <button onClick={() => setOrgPages(prev => prev.map((x, i) => i === idx ? { ...x, rotate: (x.rotate + 90) % 360 } : x))} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: '11px' }} title="Rotate 90°"><FiRotateCw /></button>
                      <button onClick={() => setOrgPages(prev => { const c = [...prev]; c.splice(idx + 1, 0, { ...p, uid: `${p.index}_${Date.now()}_dup` }); return c; })} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: '11px' }} title="Duplicate Page"><FiPlus /></button>
                      <button onClick={() => setOrgPages(prev => prev.map((x, i) => i === idx ? { ...x, selected: !x.selected } : x))} className="btn btn-secondary" style={{ padding: '4px 7px', fontSize: '11px', color: p.selected ? '#10b981' : '#ef4444' }} title="Keep/Remove">{p.selected ? 'Keep' : 'Removed'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Process Button */}
          <button
            className="btn btn-primary"
            disabled={status === 'processing'}
            onClick={runStandardTool}
            style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: '700' }}
          >
            {status === 'processing' ? 'Processing...' : 'Run Tool →'}
          </button>

          {/* Error Display */}
          {status === 'error' && (
            <div style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiAlertCircle /> {errorMsg}
            </div>
          )}

          {/* Success Download / AI Output */}
          {status === 'success' && (
            <div style={{ marginTop: '20px', padding: '20px', borderRadius: '14px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)' }}>
              {downloadUrl && (
                <a href={downloadUrl} download={downloadName} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  <FiDownload /> Download {downloadName}
                </a>
              )}
              {multiOutputs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {multiOutputs.map((out, i) => (
                    <a key={i} href={out.url} download={out.name} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontSize: '13px' }}>
                      <FiDownload /> {out.name}
                    </a>
                  ))}
                </div>
              )}
              {aiOutput && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '700', color: '#10b981' }}><FiCheckCircle /> Result Ready</span>
                    <button className="btn btn-secondary" onClick={() => { navigator.clipboard.writeText(aiOutput); if (addToast) addToast('Copied!', 'success'); }} style={{ padding: '5px 10px', fontSize: '12px' }}>
                      <FiCopy /> Copy
                    </button>
                  </div>
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '1.6', maxHeight: '420px', overflowY: 'auto', margin: 0 }}>{aiOutput}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Signature Modal ───────────────────────────────────────────────── */}
      {showSignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '800' }}>Create Signature</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button className="btn btn-secondary" onClick={() => setSignMode('draw')} style={{ flex: 1, background: signMode === 'draw' ? 'var(--accent-color)' : undefined, color: signMode === 'draw' ? '#fff' : undefined }}>Draw</button>
              <button className="btn btn-secondary" onClick={() => setSignMode('type')} style={{ flex: 1, background: signMode === 'type' ? 'var(--accent-color)' : undefined, color: signMode === 'type' ? '#fff' : undefined }}>Type</button>
            </div>
            {signMode === 'draw' ? (
              <canvas
                ref={signCanvasRef}
                width={400}
                height={140}
                onMouseDown={startSignDraw}
                onMouseMove={moveSignDraw}
                onMouseUp={endSignDraw}
                onMouseLeave={endSignDraw}
                style={{ width: '100%', height: '140px', background: '#fff', borderRadius: '12px', cursor: 'crosshair', border: '1px solid var(--border-color)' }}
              />
            ) : (
              <input type="text" value={typedSign} onChange={e => setTypedSign(e.target.value)} style={{ width: '100%', fontSize: '26px', fontFamily: 'Georgia, serif', fontStyle: 'italic', padding: '14px' }} />
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              {signMode === 'draw' && (
                <button className="btn btn-secondary" onClick={() => signCanvasRef.current.getContext('2d').clearRect(0, 0, 400, 140)}>Clear</button>
              )}
              <button className="btn btn-secondary" onClick={() => setShowSignModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={insertSignatureFromModal}>Insert Signature</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
