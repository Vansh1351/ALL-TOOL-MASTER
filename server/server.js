import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { performConversion } from './services/converter.js';
import { downloadMedia, ensureYtdlp } from './services/downloader.js';
import { processAiTool } from './services/aiService.js';
import { compressFile } from './services/compressor.js';
import archiver from 'archiver';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', exposedHeaders: ['Content-Disposition'] })); // Allow React dev server or production hosting

// Normalize request URLs to resolve double-slash issues (e.g. //api/download -> /api/download)
app.use((req, res, next) => {
  if (req.url) {
    const parts = req.url.split('?');
    parts[0] = parts[0].replace(/\/+/g, '/');
    req.url = parts.join('?');
  }
  next();
});

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Directories setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Config for uploads (limit 100MB files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Retain clean names
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}_${cleanName}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// Warmup ytdlp binary on start
ensureYtdlp().catch(err => console.error("yt-dlp auto-download failed:", err));

// Health-check routes (prevents "Cannot GET /" on Hugging Face / Render)
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'All Tool Master API', version: '1.0.0' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


/**
 * Universal File Converter API
 */
app.post('/api/convert', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const { targetFormat } = req.body;
  if (!targetFormat) {
    // clean uploaded file
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    return res.status(400).json({ error: "Target format is required." });
  }

  const inputPath = req.file.path;
  const inputMime = req.file.mimetype;
  const originalName = req.file.originalname;

  console.log(`Starting conversion: ${originalName} (${inputMime}) to ${targetFormat}`);

  try {
    const outputPath = await performConversion(inputPath, inputMime, targetFormat, uploadsDir, originalName);
    
    // Build download filename from the ORIGINAL uploaded file name + new extension
    const origBaseName = path.parse(originalName).name;
    // Sanitize for filesystem safety
    const safeName = origBaseName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_').trim() || 'converted_file';
    const downloadFilename = `${safeName}.${targetFormat}`;
    
    res.download(outputPath, downloadFilename, (err) => {
      // Clean up files after sending
      try {
        fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (e) {
        console.error("File cleanup error:", e);
      }

      if (global.gc) {
        try { global.gc(); } catch (e) {}
      }

      if (err) {
        console.error("Error sending converted file:", err);
      }
    });

  } catch (error) {
    console.error("Conversion failed:", error);
    // Cleanup uploaded file
    try { fs.unlinkSync(inputPath); } catch (e) {}
    if (global.gc) {
      try { global.gc(); } catch (e) {}
    }
    res.status(400).json({ error: `Conversion failed: ${error.message}` });
  }
});

/**
 * URL Downloader API
 */
app.post('/api/download', async (req, res) => {
  const { url, format, quality } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  const targetFormat = format || 'mp4';
  const targetQuality = quality || 'best';

  console.log(`Starting download for URL: ${url} (Format: ${targetFormat}, Quality: ${targetQuality})`);

  try {
    const outputPath = await downloadMedia(url, targetFormat, targetQuality, uploadsDir);
    
    // Extract a meaningful filename: strip the download_ timestamp prefix
    let downloadFilename = path.basename(outputPath).replace(/^download_\d+_/, '');
    // If still generic (e.g. "video.mp4"), try to keep it but ensure it has an extension
    if (!downloadFilename || downloadFilename === `video.${targetFormat}`) {
      downloadFilename = `downloaded_video.${targetFormat}`;
    }
    // Sanitize for safe Content-Disposition header
    downloadFilename = downloadFilename.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_').trim();
    
    res.download(outputPath, downloadFilename, (err) => {
      // Clean up file after download
      try {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (e) {
        console.error("Download cleanup error:", e);
      }

      if (global.gc) {
        try { global.gc(); } catch (e) {}
      }

      if (err) {
        console.error("Error sending downloaded file:", err);
      }
    });

  } catch (error) {
    console.error("Download failed:", error);
    if (global.gc) {
      try { global.gc(); } catch (e) {}
    }
    res.status(400).json({ error: `Download failed: ${error.message}` });
  }
});

/**
 * AI Productivity Suite API
 */
app.post('/api/ai', upload.single('file'), async (req, res) => {
  const { tool, textContent, apiKey } = req.body;
  if (!tool) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(400).json({ error: "AI tool selection is required." });
  }

  console.log(`Running AI tool: ${tool} (Has file: ${!!req.file}, Has text: ${!!textContent})`);

  const filePath = req.file ? req.file.path : null;
  const mimeType = req.file ? req.file.mimetype : null;

  try {
    const aiResult = await processAiTool({
      tool,
      filePath,
      mimeType,
      textContent,
      apiKey,
      uploadsDir
    });

    // Cleanup uploaded file immediately
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }

    if (global.gc) {
      try { global.gc(); } catch (e) {}
    }

    res.json({ result: aiResult });

  } catch (error) {
    console.error("AI processing error:", error);
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    if (global.gc) {
      try { global.gc(); } catch (e) {}
    }
    res.status(400).json({ error: error.message });
  }
});

// Serve frontend static build if in production
// (In dev, React will run separately)
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

/**
 * Real File Compressor API
 *
 * Accepts:  multipart/form-data with:
 *   - one or more 'files' fields
 *   - 'compressionLevel': 1 (fast) | 5 (balanced) | 9 (maximum)
 *
 * Returns:
 *   - Single file  → same format, same name (e.g. video.mp4 → compressed video.mp4)
 *   - Multi  files → ZIP containing each file in its original format & name
 */
app.post('/api/compress', upload.array('files', 20), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded. Please select at least one file to compress.' });
  }

  const level = Math.min(9, Math.max(1, parseInt(req.body.compressionLevel || '5', 10)));

  // ── 1. Compress each uploaded file ──────────────────────────────────────────
  const compressedFiles = []; // { outputPath, originalName }

  for (const file of files) {
    const originalName = file.originalname;
    const outputPath   = path.join(uploadsDir, `cmp_${Date.now()}_${originalName}`);

    try {
      await compressFile(file.path, outputPath, level, originalName);
      compressedFiles.push({ outputPath, originalName });
    } catch (err) {
      console.error(`Compression failed for ${originalName}:`, err.message);
      // Fallback: send original file unchanged rather than failing
      try {
        fs.copyFileSync(file.path, outputPath);
        compressedFiles.push({ outputPath, originalName });
      } catch {}
    }

    // Clean up uploaded temp file
    try { fs.unlinkSync(file.path); } catch {}
  }

  if (compressedFiles.length === 0) {
    return res.status(500).json({ error: 'All files failed to compress. Please try again.' });
  }

  // ── 2. Send result ──────────────────────────────────────────────────────────
  const cleanup = (paths) => {
    for (const p of paths) { try { fs.unlinkSync(p); } catch {} }
  };

  if (compressedFiles.length === 1) {
    // ── Single file: return in original format ─────────────────────────────
    const { outputPath, originalName } = compressedFiles[0];

    // Guess MIME type from extension
    const ext = path.extname(originalName).toLowerCase();
    const MIME_MAP = {
      '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska', '.webm': 'video/webm', '.flv': 'video/x-flv',
      '.wmv': 'video/x-ms-wmv', '.mpeg': 'video/mpeg', '.mpg': 'video/mpeg',
      '.m4v': 'video/mp4', '.3gp': 'video/3gpp', '.ogv': 'video/ogg',
      '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.aac': 'audio/aac',
      '.flac': 'audio/flac', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
      '.wma': 'audio/x-ms-wma',
      '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
      '.webp': 'image/webp', '.gif': 'image/gif', '.tiff': 'image/tiff',
      '.tif': 'image/tiff', '.bmp': 'image/bmp', '.heic': 'image/heic',
      '.pdf': 'application/pdf',
    };
    const mimeType = MIME_MAP[ext] || 'application/octet-stream';

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}"`);
    res.setHeader('Content-Type', mimeType);

    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({ error: 'Compressed file not found after processing.' });
    }

    const stream = fs.createReadStream(outputPath);
    stream.on('end',   () => cleanup([outputPath]));
    stream.on('error', () => cleanup([outputPath]));
    stream.pipe(res);

  } else {
    // ── Multiple files: pack them all into one ZIP (each in original format) ─
    const zipPath = path.join(uploadsDir, `compressed_${Date.now()}.zip`);

    try {
      await new Promise((resolve, reject) => {
        const output  = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 5 } });
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);
        for (const { outputPath: fp, originalName } of compressedFiles) {
          if (fs.existsSync(fp)) archive.file(fp, { name: originalName });
        }
        archive.finalize();
      });

      cleanup(compressedFiles.map(f => f.outputPath));

      res.setHeader('Content-Disposition', 'attachment; filename="compressed_files.zip"');
      res.setHeader('Content-Type', 'application/zip');

      const stream = fs.createReadStream(zipPath);
      stream.on('end',   () => cleanup([zipPath]));
      stream.on('error', () => cleanup([zipPath]));
      stream.pipe(res);

    } catch (zipErr) {
      console.error('ZIP packing error:', zipErr.message);
      cleanup(compressedFiles.map(f => f.outputPath));
      try { if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath); } catch {}
      return res.status(500).json({ error: `Failed to package compressed files: ${zipErr.message}` });
    }
  }
});


// Global error handler - catches multer and other errors, returns clean JSON
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum upload size is 500MB. Please try a smaller file.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    console.error('Unhandled server error:', err);
    return res.status(400).json({ error: err.message || 'Internal server error' });
  }
  next();
});

// Start Server
app.listen(PORT, () => {
  console.log(`All Tool Master server is running on http://localhost:${PORT}`);
});
