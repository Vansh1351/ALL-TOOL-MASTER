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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' })); // Allow React dev server or production hosting
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

  console.log(`Starting conversion: ${req.file.originalname} (${inputMime}) to ${targetFormat}`);

  try {
    const outputPath = await performConversion(inputPath, inputMime, targetFormat, uploadsDir);
    
    // Check if the result is a folder path or file path
    // In our converter, we always return a file path. Let's send the file for download.
    const downloadFilename = `converted_${path.basename(outputPath)}`;
    
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

      if (err) {
        console.error("Error sending converted file:", err);
      }
    });

  } catch (error) {
    console.error("Conversion failed:", error);
    // Cleanup uploaded file
    try { fs.unlinkSync(inputPath); } catch (e) {}
    res.status(500).json({ error: `Conversion failed: ${error.message}` });
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
    
    const downloadFilename = path.basename(outputPath).replace(/^download_\d+_/, '');
    
    res.download(outputPath, downloadFilename, (err) => {
      // Clean up file after download
      try {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (e) {
        console.error("Download cleanup error:", e);
      }

      if (err) {
        console.error("Error sending downloaded file:", err);
      }
    });

  } catch (error) {
    console.error("Download failed:", error);
    res.status(500).json({ error: `Download failed: ${error.message}` });
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

    res.json({ result: aiResult });

  } catch (error) {
    console.error("AI processing error:", error);
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
  next();
});

// Start Server
app.listen(PORT, () => {
  console.log(`All Tool Master server is running on http://localhost:${PORT}`);
});
