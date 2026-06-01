/**
 * Real File Compressor Service
 * Compresses files in their original format using FFmpeg (video/audio) and Sharp (images).
 * Returns files with the same name and extension — no ZIP wrapping for single files.
 */

import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

// Configure FFmpeg paths (prefer system on Linux, fall back to npm bundled)
try {
  if (process.platform === 'linux') {
    ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
    ffmpeg.setFfprobePath('/usr/bin/ffprobe');
  } else {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }
} catch (e) {
  console.error('Failed to configure ffmpeg in compressor:', e.message);
}

// ─── File type detection ──────────────────────────────────────────────────────

const VIDEO_EXTS = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv', '.mpeg', '.mpg', '.m4v', '.ts', '.m2ts', '.3gp', '.ogv', '.dv', '.mod']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a', '.wma', '.amr', '.mid', '.oog']);
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.tif', '.bmp', '.heic', '.heif', '.avif']);
const PDF_EXT   = '.pdf';

function getFileType(ext) {
  if (VIDEO_EXTS.has(ext)) return 'video';
  if (AUDIO_EXTS.has(ext)) return 'audio';
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (ext === PDF_EXT)     return 'pdf';
  return 'other';
}

// ─── Compression profiles ────────────────────────────────────────────────────
// level: 1 = Fast (10-20%), 5 = Balanced (20-50%), 9 = Maximum (50-80%)

function getProfile(level) {
  if (level <= 2) {
    return {
      name: 'fast',
      // Video: CRF 26 + fast preset → ~10-20% smaller than typical web video
      videoCrf: 26, videoPreset: 'fast', videoScale: null,
      // Audio: 192kbps → minimal quality loss
      audioBitrate: '192k',
      // Image: 80 quality → subtle reduction
      imageQuality: 80,
      pngCompressionLevel: 7,
    };
  }
  if (level <= 6) {
    return {
      name: 'balanced',
      // Video: CRF 32 + medium preset → ~25-50% smaller
      videoCrf: 32, videoPreset: 'medium', videoScale: null,
      // Audio: 128kbps → standard quality
      audioBitrate: '128k',
      // Image: 60 quality → noticeable but acceptable
      imageQuality: 60,
      pngCompressionLevel: 9,
    };
  }
  return {
    name: 'maximum',
    // Video: CRF 40 + slow preset → ~50-75% smaller (noticeable quality drop)
    videoCrf: 40, videoPreset: 'slow', videoScale: null,
    // Audio: 64kbps → lossy but still intelligible
    audioBitrate: '64k',
    // Image: 30 quality → significant compression
    imageQuality: 30,
    pngCompressionLevel: 9,
  };
}

// ─── VIDEO compression ────────────────────────────────────────────────────────

function compressVideo(inputPath, outputPath, profile, ext) {
  return new Promise((resolve, reject) => {
    // Choose codec & extra options based on output container
    const isWebm = ext === '.webm';
    const videoCodec = isWebm ? 'libvpx-vp9' : 'libx264';
    const audioCodec = isWebm ? 'libopus' : 'aac';

    let cmd = ffmpeg(inputPath)
      .videoCodec(videoCodec)
      .audioCodec(audioCodec)
      .audioBitrate(profile.audioBitrate);

    if (isWebm) {
      // VP9 uses -crf + -b:v 0 for constant quality mode
      cmd = cmd
        .addOption('-crf', profile.videoCrf)
        .addOption('-b:v', '0');
    } else {
      // H.264 CRF + preset
      cmd = cmd
        .addOption('-crf', String(profile.videoCrf))
        .addOption('-preset', profile.videoPreset)
        .addOption('-movflags', '+faststart'); // web-optimised MP4
    }

    cmd
      .output(outputPath)
      .on('start', (cmdLine) => console.log('FFmpeg video compress started'))
      .on('end', () => {
        console.log(`Video compressed: ${path.basename(outputPath)}`);
        resolve();
      })
      .on('error', (err) => {
        console.error('FFmpeg video compress error:', err.message);
        reject(err);
      })
      .run();
  });
}

// ─── AUDIO compression ────────────────────────────────────────────────────────

function compressAudio(inputPath, outputPath, profile, ext) {
  return new Promise((resolve, reject) => {
    // Decide output codec from extension
    let audioCodec = 'libmp3lame';
    if (ext === '.ogg' || ext === '.oog') audioCodec = 'libvorbis';
    else if (ext === '.aac') audioCodec = 'aac';
    else if (ext === '.wav') {
      // Compress WAV → output as MP3 (same name, but we rename the output)
      // Actually keep as wav with PCM 16bit at lower rate for "compression"
      audioCodec = 'pcm_s16le';
    }
    else if (ext === '.flac') audioCodec = 'flac';
    else if (ext === '.m4a') audioCodec = 'aac';

    let cmd = ffmpeg(inputPath).noVideo();

    if (ext === '.wav') {
      // For WAV, reduce sample rate to compress (no bitrate concept)
      const sampleRates = { fast: 44100, balanced: 32000, maximum: 22050 };
      cmd = cmd
        .audioCodec(audioCodec)
        .audioFrequency(sampleRates[profile.name] || 32000)
        .audioChannels(1); // mono for maximum
    } else if (ext === '.flac') {
      // FLAC compression levels 0-12 (higher = smaller)
      const flacLevels = { fast: 5, balanced: 8, maximum: 12 };
      cmd = cmd
        .audioCodec(audioCodec)
        .addOption('-compression_level', String(flacLevels[profile.name] || 8));
    } else {
      cmd = cmd
        .audioCodec(audioCodec)
        .audioBitrate(profile.audioBitrate);
    }

    cmd
      .output(outputPath)
      .on('end', resolve)
      .on('error', (err) => {
        console.error('FFmpeg audio compress error:', err.message);
        reject(err);
      })
      .run();
  });
}

// ─── IMAGE compression ────────────────────────────────────────────────────────

async function compressImage(inputPath, outputPath, profile, ext) {
  const img = sharp(inputPath);

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      await img
        .jpeg({ quality: profile.imageQuality, mozjpeg: true, progressive: true })
        .toFile(outputPath);
      break;

    case '.png':
      await img
        .png({ quality: profile.imageQuality, compressionLevel: profile.pngCompressionLevel, progressive: true })
        .toFile(outputPath);
      break;

    case '.webp':
      await img
        .webp({ quality: profile.imageQuality, effort: 6 })
        .toFile(outputPath);
      break;

    case '.gif': {
      // GIF: resize slightly for compression effect (lossless GIF has no quality setting)
      const metadata = await img.metadata();
      const scaleFactor = profile.name === 'fast' ? 1.0 : profile.name === 'balanced' ? 0.85 : 0.65;
      const newWidth = Math.round((metadata.width || 800) * scaleFactor);
      await img
        .resize(newWidth, null, { fit: 'inside' })
        .gif({ colours: profile.name === 'maximum' ? 64 : 128 })
        .toFile(outputPath);
      break;
    }

    case '.tiff':
    case '.tif':
      await img
        .tiff({ quality: profile.imageQuality, compression: 'lzw' })
        .toFile(outputPath);
      break;

    case '.bmp':
      // BMP has no lossy compression — convert to PNG and save as same name
      await img
        .png({ compressionLevel: profile.pngCompressionLevel })
        .toFile(outputPath.replace(/\.bmp$/i, '.png'));
      // Copy the PNG over to outputPath
      fs.copyFileSync(outputPath.replace(/\.bmp$/i, '.png'), outputPath);
      try { fs.unlinkSync(outputPath.replace(/\.bmp$/i, '.png')); } catch {}
      break;

    case '.heic':
    case '.heif':
    case '.avif':
      // Convert to JPEG for maximum compatibility + compression
      await img
        .jpeg({ quality: profile.imageQuality })
        .toFile(outputPath.replace(/\.(heic|heif|avif)$/i, '.jpg'));
      fs.copyFileSync(outputPath.replace(/\.(heic|heif|avif)$/i, '.jpg'), outputPath);
      try { fs.unlinkSync(outputPath.replace(/\.(heic|heif|avif)$/i, '.jpg')); } catch {}
      break;

    default:
      // Fallback: save as JPEG
      await img
        .jpeg({ quality: profile.imageQuality })
        .toFile(outputPath);
  }
}

// ─── PDF compression ──────────────────────────────────────────────────────────

async function compressPDF(inputPath, outputPath, profile) {
  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    // Save with object streams enabled (compresses cross-reference table & metadata)
    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
    fs.writeFileSync(outputPath, compressedBytes);
  } catch (err) {
    console.warn('PDF compression fallback (copy):', err.message);
    fs.copyFileSync(inputPath, outputPath);
  }
}

// ─── Main compress function ───────────────────────────────────────────────────

/**
 * Compress a single file in its original format.
 * @param {string} inputPath - Absolute path to the uploaded file
 * @param {string} outputPath - Where to write the compressed file
 * @param {number} level - 1 (fast) | 5 (balanced) | 9 (maximum)
 * @param {string} originalName - Original filename (used for extension detection)
 * @returns {Promise<void>}
 */
export async function compressFile(inputPath, outputPath, level, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const fileType = getFileType(ext);
  const profile = getProfile(level);

  console.log(`Compressing [${fileType}] ${originalName} (level: ${profile.name})`);

  switch (fileType) {
    case 'video':
      await compressVideo(inputPath, outputPath, profile, ext);
      break;
    case 'audio':
      await compressAudio(inputPath, outputPath, profile, ext);
      break;
    case 'image':
      await compressImage(inputPath, outputPath, profile, ext);
      break;
    case 'pdf':
      await compressPDF(inputPath, outputPath, profile);
      break;
    default:
      // Unsupported file type (docx, xlsx, zip, etc.) — copy as-is
      console.log(`No specific compressor for ${ext} — passing through unchanged`);
      fs.copyFileSync(inputPath, outputPath);
  }
}
