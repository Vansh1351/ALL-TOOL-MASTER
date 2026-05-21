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

  if (format === 'mp3') {
    args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
  } else {
    // mp4 video
    let formatArg = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    if (quality === '720p') {
      formatArg = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best';
    } else if (quality === '480p') {
      formatArg = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best';
    } else if (quality === '360p') {
      formatArg = 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]/best';
    }
    args.push('-f', formatArg);
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
