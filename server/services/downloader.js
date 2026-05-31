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
async function downloadMediaWithYtdlp(url, format, quality, outputDir) {
  const binary = await ensureYtdlp();
  
  // Create output path format
  const outputPattern = path.join(outputDir, `download_${Date.now()}_%(title)s.%(ext)s`);
  
  const args = [
    url,
    '-o', outputPattern,
    '--no-playlist',
    '--no-warnings',
    '--restrict-filenames',
    '--ffmpeg-location', binDir,
    '--js-runtimes', 'node',
    '--extractor-args', 'youtube:player_client=android,ios'
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
    const runCommand = (currentArgs, isFallback = false, triedBrowserCookies = false) => {
      console.log(`Running yt-dlp command: ${binary} ${currentArgs.join(' ')}`);
      execFile(binary, currentArgs, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          const errMessage = stderr || error.message;
          console.error(`yt-dlp execution error (isFallback=${isFallback}, triedBrowserCookies=${triedBrowserCookies}):`, errMessage);
          
          const isBotBlock = errMessage.toLowerCase().includes("confirm you're not a bot") || 
                              errMessage.toLowerCase().includes("sign in to confirm");

          if (isBotBlock && !triedBrowserCookies) {
            const isLocalEnv = process.platform === 'win32' || process.platform === 'darwin' || process.env.NODE_ENV !== 'production';
            if (isLocalEnv) {
              const browsers = process.platform === 'win32' 
                ? ['chrome', 'edge', 'firefox', 'opera', 'brave'] 
                : (process.platform === 'darwin' ? ['safari', 'chrome', 'firefox'] : ['firefox', 'chrome']);
              
              console.log(`Bot block detected. Attempting to bypass using local browser cookies on platform: ${process.platform}...`);
              
              const tryBrowserCookies = (browserList, index) => {
                if (index >= browserList.length) {
                  // Tried all browsers, fail with user-friendly error message
                  const userFriendlyError = "YouTube blocked the download with a bot-verification check (Sign in to confirm you're not a bot). All attempts to extract local browser cookies failed. Please close your browser completely or configure 'YOUTUBE_COOKIES' in your server settings.";
                  return reject(new Error(userFriendlyError));
                }
                
                const browser = browserList[index];
                console.log(`Retrying download with cookies from browser: ${browser}...`);
                
                // Copy current args but remove any existing --cookies or --cookies-from-browser
                const fallbackArgs = [];
                for (let i = 0; i < currentArgs.length; i++) {
                  if (currentArgs[i] === '--cookies' || currentArgs[i] === '--cookies-from-browser') {
                    i++; // skip option and value
                  } else {
                    fallbackArgs.push(currentArgs[i]);
                  }
                }
                fallbackArgs.push('--cookies-from-browser', browser);
                
                console.log(`Running yt-dlp with browser cookies command: ${binary} ${fallbackArgs.join(' ')}`);
                execFile(binary, fallbackArgs, { maxBuffer: 1024 * 1024 * 10 }, (err, subStdout, subStderr) => {
                  if (err) {
                    const nextErrMessage = subStderr || err.message;
                    console.warn(`Failed with cookies from browser ${browser}: ${nextErrMessage}`);
                    return tryBrowserCookies(browserList, index + 1);
                  }
                  
                  console.log(`Successfully downloaded using cookies from browser: ${browser}`);
                  const files = fs.readdirSync(outputDir);
                  const matches = files.filter(f => f.startsWith(`download_`));
                  if (matches.length === 0) {
                    return tryBrowserCookies(browserList, index + 1);
                  }
                  const latestFile = matches
                    .map(f => ({ name: f, time: fs.statSync(path.join(outputDir, f)).mtimeMs }))
                    .sort((a, b) => b.time - a.time)[0].name;
                  
                  return resolve(path.join(outputDir, latestFile));
                });
              };
              
              return tryBrowserCookies(browsers, 0);
            } else {
              // Cloud environment
              const platform = process.env.SPACE_ID ? 'Hugging Face' : (process.env.RENDER ? 'Render' : 'cloud hosting platform');
              const userFriendlyError = `YouTube blocked the download with a bot-verification check (Sign in to confirm you're not a bot). Since the server is hosted in the cloud (${platform}), you must provide cookies to authenticate. Please export your YouTube cookies in Netscape format (using a browser extension like 'Get cookies.txt LOCALLY') and set them in your ${platform} dashboard environment variables under the name 'YOUTUBE_COOKIES'. If you already set it, your cookies may have expired and you need to export new ones.`;
              return reject(new Error(userFriendlyError));
            }
          }

          // Fallback if specific requested format was not found or failed to merge
          if (!isFallback && format !== 'mp3' && (errMessage.includes('Requested format is not available') || errMessage.includes('format is not available'))) {
            console.warn("Requested format not available. Retrying with default best streams...");
            
            // Remove -f and -S arguments and their values to let it fallback to default best format selection
            const fallbackArgs = [];
            for (let i = 0; i < currentArgs.length; i++) {
              if (currentArgs[i] === '-f' || currentArgs[i] === '-S') {
                i++; // Skip option and its value
              } else {
                fallbackArgs.push(currentArgs[i]);
              }
            }
            return runCommand(fallbackArgs, true, triedBrowserCookies);
          }
          
          // If the bot block was detected and we couldn't bypass it, customize the error message
          if (isBotBlock) {
            const platform = process.env.SPACE_ID ? 'Hugging Face' : (process.env.RENDER ? 'Render' : 'cloud hosting platform');
            const userFriendlyError = `YouTube blocked the download with a bot-verification check (Sign in to confirm you're not a bot). If running in the cloud (${platform}), please set up/renew your 'YOUTUBE_COOKIES' environment variable. If running locally, make sure you close your browser completely before retrying.`;
            return reject(new Error(userFriendlyError));
          }

          return reject(new Error(errMessage));
        }
        
        console.log('yt-dlp finished:', stdout);
        
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
    };

    runCommand(args);
  });
}

async function downloadWithCobalt(videoUrl, format, quality, outputDir) {
  // List of public cobalt instances to cycle through
  const instances = [
    'https://api.cobalt.tools',
    'https://co.wuk.sh',
    'https://cobalt.api.ryzetech.live',
    'https://cobalt.kudo.lol',
    'https://cobalt-api.lule.rocks'
  ];

  let lastError = null;

  for (const instance of instances) {
    try {
      console.log(`Attempting Cobalt download using instance: ${instance}...`);
      const body = {
        url: videoUrl,
        vQuality: quality === 'best' ? '1080' : quality.replace('p', ''),
        isAudioOnly: format === 'mp3',
        filenameStyle: 'classic'
      };

      const res = await fetch(`${instance}/api/json`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.status === 'error') {
        throw new Error(json.error?.code || 'Unknown cobalt error');
      }

      const mediaUrl = json.url;
      if (!mediaUrl) {
        throw new Error('No download URL returned from cobalt');
      }

      console.log(`Cobalt returned download URL: ${mediaUrl}`);

      // Fetch the file from Cobalt URL and save it to outputDir
      const fileRes = await fetch(mediaUrl);
      if (!fileRes.ok) {
        throw new Error(`Failed to fetch media file: ${fileRes.statusText}`);
      }

      // Try to extract extension from content-disposition
      const cd = fileRes.headers.get('content-disposition');
      let ext = format === 'mp3' ? '.mp3' : '.mp4';
      if (cd) {
        const match = cd.match(/filename=["']?([^"';]+)["']?/);
        if (match) {
          const fname = match[1];
          const lastDot = fname.lastIndexOf('.');
          if (lastDot !== -1) {
            ext = fname.substring(lastDot);
          }
        }
      }

      // Save locally to outputDir
      const finalPath = path.join(outputDir, `download_${Date.now()}_video${ext}`);
      
      const buffer = await fileRes.arrayBuffer();
      fs.writeFileSync(finalPath, Buffer.from(buffer));

      console.log(`Successfully saved Cobalt download to ${finalPath}`);
      return finalPath;
    } catch (err) {
      console.warn(`Cobalt instance ${instance} failed:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All Cobalt fallback instances failed. Last error: ${lastError ? lastError.message : 'Unknown'}`);
}

export async function downloadMedia(url, format, quality, outputDir) {
  try {
    // Try yt-dlp first
    const filePath = await downloadMediaWithYtdlp(url, format, quality, outputDir);
    return filePath;
  } catch (ytdlpError) {
    console.warn(`yt-dlp download failed (${ytdlpError.message}). Trying Cobalt API fallback...`);
    try {
      const filePath = await downloadWithCobalt(url, format, quality, outputDir);
      return filePath;
    } catch (cobaltError) {
      console.error(`Cobalt download fallback also failed: ${cobaltError.message}`);
      // Throw the original yt-dlp error so they see the detailed yt-dlp issue if both fail
      throw ytdlpError;
    }
  }
}
