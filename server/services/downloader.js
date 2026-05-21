import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const binDir = path.join(__dirname, '..', 'bin');
fs.mkdirSync(binDir, { recursive: true });

// Copy ffmpeg and ffprobe to binDir so yt-dlp can locate them in a single place
try {
  const ffmpegDestName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const ffprobeDestName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
  
  const ffmpegDest = path.join(binDir, ffmpegDestName);
  const ffprobeDest = path.join(binDir, ffprobeDestName);

  if (!fs.existsSync(ffmpegDest) && ffmpegInstaller.path) {
    console.log(`Copying ffmpeg binary to ${ffmpegDest}...`);
    fs.copyFileSync(ffmpegInstaller.path, ffmpegDest);
    if (process.platform !== 'win32') {
      fs.chmodSync(ffmpegDest, '755');
    }
  }
  if (!fs.existsSync(ffprobeDest) && ffprobeInstaller.path) {
    console.log(`Copying ffprobe binary to ${ffprobeDest}...`);
    fs.copyFileSync(ffprobeInstaller.path, ffprobeDest);
    if (process.platform !== 'win32') {
      fs.chmodSync(ffprobeDest, '755');
    }
  }
} catch (err) {
  console.error("Failed to copy ffmpeg/ffprobe binaries to bin folder:", err);
}

// Helper to configure cookies for yt-dlp to bypass bot challenges
function setupCookies() {
  const envCookies = process.env.YOUTUBE_COOKIES;
  const cookiesPath = path.join(binDir, 'cookies.txt');

  if (!envCookies) {
    // Check if a local cookies.txt exists in root or bin
    const rootCookies = path.join(__dirname, '..', 'cookies.txt');
    if (fs.existsSync(rootCookies)) {
      return rootCookies;
    }
    if (fs.existsSync(cookiesPath)) {
      return cookiesPath;
    }
    return null;
  }

  // Write cookies from env variable (support plain Netscape text or base64 encoded)
  try {
    let cookiesContent = envCookies.trim();
    if (!cookiesContent.includes('# Netscape') && !cookiesContent.includes('\t') && cookiesContent.length > 20) {
      try {
        const decoded = Buffer.from(cookiesContent, 'base64').toString('utf8');
        if (decoded.includes('# Netscape') || decoded.includes('\t')) {
          cookiesContent = decoded;
        }
      } catch (e) {
        // Fallback to raw value
      }
    }
    fs.writeFileSync(cookiesPath, cookiesContent, 'utf8');
    return cookiesPath;
  } catch (err) {
    console.error("Failed to write cookies.txt from environment variable:", err);
    return null;
  }
}

// Determine binary name and URL
let binaryName = 'yt-dlp';
let downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

if (process.platform === 'win32') {
  binaryName = 'yt-dlp.exe';
  downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe';
} else if (process.platform === 'darwin') {
  binaryName = 'yt-dlp_macos';
  downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos';
}

const binaryPath = path.join(binDir, binaryName);

/**
 * Automatically downloads yt-dlp binary if it doesn't exist.
 */
export async function ensureYtdlp() {
  if (fs.existsSync(binaryPath)) {
    return binaryPath;
  }

  console.log(`Downloading yt-dlp binary from ${downloadUrl}...`);
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download yt-dlp: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(binaryPath, Buffer.from(buffer));
    
    // Set executable permission on Unix-based OS
    if (process.platform !== 'win32') {
      fs.chmodSync(binaryPath, '755');
    }
    
    console.log(`yt-dlp binary saved to ${binaryPath}`);
    return binaryPath;
  } catch (error) {
    console.error('Error downloading yt-dlp binary:', error);
    throw error;
  }
}

/**
 * Downloads a video or audio from URL.
 * @param {string} url - Target URL (YouTube, FB, Insta, etc.)
 * @param {string} format - 'mp4' (video) or 'mp3' (audio)
 * @param {string} quality - quality selection (e.g. 'best', '1080p', '720p', etc.)
 * @param {string} outputDir - Directory to save files
 */
export async function downloadMedia(url, format, quality, outputDir) {
  const binary = await ensureYtdlp();
  
  // Create output path format
  const outputPattern = path.join(outputDir, `download_${Date.now()}_%(title)s.%(ext)s`);
  
  const args = [
    url,
    '-o', outputPattern,
    '--no-playlist',
    '--no-warnings',
    '--restrict-filenames',
    '--ffmpeg-location', binDir
  ];

  const resolvedCookiesPath = setupCookies();
  if (resolvedCookiesPath) {
    console.log(`Using cookies file: ${resolvedCookiesPath}`);
    args.push('--cookies', resolvedCookiesPath);
  }

  if (format === 'mp3') {
    args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
  } else {
    // mp4 video
    let formatArg = 'bestvideo+bestaudio/best';
    if (quality === '720p') {
      formatArg = 'bestvideo[height<=720]+bestaudio/best[height<=720]/best';
    } else if (quality === '480p') {
      formatArg = 'bestvideo[height<=480]+bestaudio/best[height<=480]/best';
    } else if (quality === '360p') {
      formatArg = 'bestvideo[height<=360]+bestaudio/best[height<=360]/best';
    }
    args.push('-f', formatArg);
    args.push('-S', 'res,vcodec:h264,acodec:m4a');
    args.push('--recode-video', 'mp4');
  }

  return new Promise((resolve, reject) => {
    console.log(`Running yt-dlp command: ${binary} ${args.join(' ')}`);
    const child = execFile(binary, args, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('yt-dlp execution error:', stderr);
        return reject(new Error(stderr || error.message));
      }
      
      console.log('yt-dlp finished:', stdout);
      
      // Let's find the created file in outputDir
      // Find files starting with download_ and created recently
      const files = fs.readdirSync(outputDir);
      const matches = files.filter(f => f.startsWith(`download_`));
      
      if (matches.length === 0) {
        return reject(new Error('File not found after yt-dlp finished processing.'));
      }
      
      // Find the latest modified file
      const latestFile = matches
        .map(f => ({ name: f, time: fs.statSync(path.join(outputDir, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time)[0].name;

      resolve(path.join(outputDir, latestFile));
    });
  });
}
