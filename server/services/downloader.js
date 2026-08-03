import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { Readable } from 'stream';

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

function withHardTimeout(promise, ms, name = 'Operation') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${name} timed out after ${ms}ms`)), ms);
    promise.then(
      val => { clearTimeout(timer); resolve(val); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}

function isLocalDesktopRuntime() {
  if (process.env.ALLOW_BROWSER_COOKIES === 'true') {
    return true;
  }

  if (process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.SPACE_ID || process.env.HF_SPACE_ID) {
    return false;
  }

  return process.platform === 'win32' || process.platform === 'darwin';
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

// Helper to configure dedicated Instagram cookies for yt-dlp
function setupInstagramCookies() {
  const envCookies = process.env.INSTAGRAM_COOKIES;
  const cookiesPath = path.join(binDir, 'instagram_cookies.txt');

  if (!envCookies) {
    const rootCookies = path.join(__dirname, '..', 'instagram_cookies.txt');
    if (fs.existsSync(rootCookies)) {
      return rootCookies;
    }
    if (fs.existsSync(cookiesPath)) {
      return cookiesPath;
    }
    return null;
  }

  try {
    let cookiesContent = envCookies.trim();
    if (!cookiesContent.includes('# Netscape') && !cookiesContent.includes('\t') && cookiesContent.length > 20) {
      try {
        const decoded = Buffer.from(cookiesContent, 'base64').toString('utf8');
        if (decoded.includes('# Netscape') || decoded.includes('\t')) {
          cookiesContent = decoded;
        }
      } catch (e) {}
    }
    fs.writeFileSync(cookiesPath, cookiesContent, 'utf8');
    return cookiesPath;
  } catch (err) {
    console.error("Failed to write instagram_cookies.txt:", err);
    return null;
  }
}

// Sanitizes and formats proxy URL if provided
function getSanitizedProxyUrl() {
  if (process.env.DISABLE_DOWNLOAD_PROXY === 'true' || process.env.DISABLE_PROXY === 'true') {
    return null;
  }
  let proxyUrl = process.env.DOWNLOAD_PROXY || process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  if (!proxyUrl) return null;
  
  proxyUrl = proxyUrl.trim().replace(/^['"]|['"]$/g, '');
  if (!proxyUrl) return null;

  if (!/^[a-z0-9]+:\/\//i.test(proxyUrl)) {
    proxyUrl = `http://${proxyUrl}`;
  }
  return proxyUrl;
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

// ── Module-level capability caches (populated after first download) ──────────
let _cachedHasGlobalFfmpeg = null;  // null = not yet checked
let _cachedImpersonateTarget = undefined; // undefined = not yet checked

async function checkGlobalFfmpeg() {
  if (_cachedHasGlobalFfmpeg !== null) return _cachedHasGlobalFfmpeg;
  _cachedHasGlobalFfmpeg = await new Promise(resolve => {
    execFile('ffmpeg', ['-version'], (err) => resolve(!err));
  });
  console.log(`[Cache] Global ffmpeg available: ${_cachedHasGlobalFfmpeg}`);
  return _cachedHasGlobalFfmpeg;
}

async function checkImpersonateTarget(binary) {
  if (_cachedImpersonateTarget !== undefined) return _cachedImpersonateTarget;
  _cachedImpersonateTarget = await new Promise(resolve => {
    execFile(binary, ['--list-impersonate-targets'], { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return resolve(null);
      const targetList = `${stdout || ''}\n${stderr || ''}`;
      const chromeTarget = targetList
        .split(/\r?\n/)
        .map(line => line.trim().split(/\s+/)[0])
        .find(target => /^chrome(?:-\d+)?$/i.test(target));
      resolve(chromeTarget || null);
    });
  });
  console.log(`[Cache] yt-dlp Chrome impersonate target: ${_cachedImpersonateTarget}`);
  return _cachedImpersonateTarget;
}

/**
 * Automatically downloads yt-dlp binary if it doesn't exist.
 */
export async function ensureYtdlp() {
  // Check if system has a global yt-dlp in PATH
  const hasGlobalYtdlp = await new Promise(resolve => {
    execFile('yt-dlp', ['--version'], (err) => {
      resolve(!err);
    });
  });

  if (hasGlobalYtdlp) {
    console.log("Global yt-dlp found in system PATH. Using system installation.");
    return 'yt-dlp';
  }

  if (fs.existsSync(binaryPath)) {
    if (process.env.NODE_ENV !== 'production') {
      // Attempt to update the binary in the background during local development only.
      try {
        execFile(binaryPath, ['-U'], (err, stdout, stderr) => {
          if (err) {
            console.warn("Failed to auto-update yt-dlp binary in background:", stderr || err.message);
          } else {
            console.log("yt-dlp binary updated in background:", stdout.trim());
          }
        });
      } catch (e) {
        console.warn("Error running auto-update in background:", e);
      }
    }
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
async function downloadMediaWithYtdlp(url, format, quality, outputDir, options = {}) {
  const binary = await ensureYtdlp();
  
  // Unique session token prevents concurrent downloads from picking up each other's output files
  const sessionId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const outputPattern = path.join(outputDir, `download_${sessionId}_%(title)s.%(ext)s`);
  const sessionPrefix = `download_${sessionId}_`;
  
  // Use cached capability checks (avoids ~400ms overhead per download)
  const hasGlobalFfmpeg = await checkGlobalFfmpeg();

  const args = [
    url,
    '-o', outputPattern,
    '--no-playlist',
    '--no-warnings',
    '--restrict-filenames',
    '--no-check-certificate',
    '-4',
    '--socket-timeout', '8'  // Fail fast in 8s on dead/unresponsive proxy or connection
  ];

  // Configure proxy ONLY if explicitly requested in options (defaults to false for speed & reliability)
  if (options.useProxy === true) {
    const proxyUrl = getSanitizedProxyUrl();
    if (proxyUrl) {
      console.log(`Configuring yt-dlp to use proxy: ${proxyUrl}`);
      args.push('--proxy', proxyUrl);
    }
  } else {
    console.log(`yt-dlp running with DIRECT connection (proxy disabled for maximum speed).`);
  }

  // Use cached impersonate target check
  const chromeImpersonateTarget = await checkImpersonateTarget(binary);

  if (chromeImpersonateTarget) {
    console.log(`yt-dlp: Enabling Chrome TLS impersonation (${chromeImpersonateTarget}).`);
    args.push('--impersonate', chromeImpersonateTarget);
  } else {
    console.log(`yt-dlp: Chrome impersonation not supported by this binary. Skipping.`);
  }

  if (!hasGlobalFfmpeg) {
    console.log("Global ffmpeg not found in PATH. Using bundled/bin directory ffmpeg location.");
    args.push('--ffmpeg-location', binDir);
  } else {
    console.log("Global ffmpeg found in PATH. Using system-installed ffmpeg.");
  }

  const resolvedCookiesPath = options.customCookiesPath || (options.useCookies !== false ? setupCookies() : null);

  if (format === 'mp3') {
    args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
  } else {
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    
    // Non-YouTube platforms (TikTok, FB, Twitter, Vimeo, Dailymotion, Reddit) serve single merged streams.
    // Searching for separate 'bestvideo+bestaudio' on non-YouTube sites causes format failures and timeouts.
    let formatArg = isYouTube ? 'bestvideo+bestaudio/best' : 'b/best';
    if (quality === '720p') {
      formatArg = isYouTube ? 'bestvideo[height<=720]+bestaudio/best[height<=720]/best' : 'b[height<=720]/best';
    } else if (quality === '480p') {
      formatArg = isYouTube ? 'bestvideo[height<=480]+bestaudio/best[height<=480]/best' : 'b[height<=480]/best';
    } else if (quality === '360p') {
      formatArg = isYouTube ? 'bestvideo[height<=360]+bestaudio/best[height<=360]/best' : 'b[height<=360]/best';
    }
    args.push('-f', formatArg);
    if (isYouTube) {
      args.push('-S', 'res,vcodec:h264,acodec:m4a');
    }
    // remux-video is instant (repackage streams) vs recode-video (re-encode, takes minutes)
    args.push('--remux-video', 'mp4');
  }

  return new Promise((resolve, reject) => {
    // Base command structure
    const baseArgs = [...args];

    // Helper to filter out args we want to exclude
    const filterArgs = (argList, excludePatterns) => {
      const filtered = [];
      for (let i = 0; i < argList.length; i++) {
        let matched = false;
        for (const pattern of excludePatterns) {
          if (argList[i] === pattern) {
            matched = true;
            break;
          }
        }
        if (matched) {
          // If the excluded argument takes a parameter (e.g. -f, --cookies, --extractor-args), skip the next token too
          const hasParam = ['-f', '-S', '--cookies', '--extractor-args', '--cookies-from-browser', '--proxy'].includes(argList[i]);
          if (hasParam) {
            i++;
          }
        } else {
          filtered.push(argList[i]);
        }
      }
      return filtered;
    };

    // Helper to check if cookies are present in base arguments
    const addCookies = (argList) => {
      if (resolvedCookiesPath && options.useCookies !== false) {
        return [...argList, '--cookies', resolvedCookiesPath];
      }
      return argList;
    };

    // Define a list of attempts
    const attemptsList = [];
    
    // Add all configurations
    const addAttempt = (name, attemptArgs, priorityOnServer = false) => {
      attemptsList.push({ name, args: attemptArgs, priorityOnServer });
    };


    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

    // ── Direct (non-proxy) attempts prioritized for maximum speed ──
    // Direct connection resolves URLs in ~2-4 seconds!

    // 1. Primary Direct Client
    const attempt1Args = [
      ...filterArgs([...baseArgs], ['-f', '-S', '--proxy']),
      '-f', format === 'mp3' ? 'ba/b' : (isYouTube ? 'bestvideo+bestaudio/best' : 'b/best')
    ];
    if (isYouTube) {
      attempt1Args.push('--extractor-args', 'youtube:player_client=android,ios');
    }
    addAttempt(isYouTube ? "Android+iOS client (direct)" : "Universal direct client", attempt1Args, true);

    // 2. Fallback Direct Client
    const attempt2Args = [
      ...filterArgs([...baseArgs], ['-f', '-S', '--proxy']),
      '-f', format === 'mp3' ? 'ba/b' : 'b/best'
    ];
    if (isYouTube) {
      attempt2Args.push('--extractor-args', 'youtube:player_client=tv_simply,default,-tv');
    }
    addAttempt("Universal fallback client", attempt2Args, true);

    // 3. With cookies (if available)
    if (resolvedCookiesPath) {
      addAttempt("With cookies (direct)", addCookies(filterArgs([...baseArgs], ['--proxy'])), false);
    }

    // 4. Default client (DIRECT)
    addAttempt("Default client (direct)", filterArgs([...baseArgs], ['--proxy']), false);

    // 5. Proxy fallback (only if explicitly enabled in options)
    if (options.useProxy === true && getSanitizedProxyUrl()) {
      addAttempt("Proxy client fallback", [
        ...filterArgs([...baseArgs], []),
        '-f', format === 'mp3' ? 'ba/b' : (isYouTube ? 'bestvideo+bestaudio/best' : 'b/best')
      ], false);
    }


    // Priority order: Android/iOS direct FIRST (fastest 3s execution on datacenters), then TV client, then Cookies fallback
    let attempts = [...attemptsList];
    if (options.singleAttempt) {
      attempts = [attempts[0]];
    }

    // Filter duplicates to optimize runs (e.g. if resolvedCookiesPath is null, with/without cookies are identical)
    const uniqueAttempts = [];
    const seenArgs = new Set();
    for (const attempt of attempts) {
      const key = attempt.args.join(' ');
      if (!seenArgs.has(key)) {
        seenArgs.add(key);
        uniqueAttempts.push(attempt);
      }
    }

    let currentAttemptIndex = 0;
    let lastErrorMsg = '';
    let proxyIsDead = false;

    const runNextAttempt = (triedBrowserCookies = false) => {
      if (currentAttemptIndex >= uniqueAttempts.length) {
        return reject(new Error(`All yt-dlp fallback attempts failed. Last error: ${lastErrorMsg}`));
      }

      const attempt = uniqueAttempts[currentAttemptIndex];

      // If proxy was detected dead, dynamically strip --proxy from remaining attempts
      if (proxyIsDead) {
        attempt.args = filterArgs(attempt.args, ['--proxy']);
      }

      console.log(`[Attempt ${currentAttemptIndex + 1}/${uniqueAttempts.length}] Running: ${attempt.name}`);

      // 15s hard timeout with SIGKILL (SIGKILL forces immediate uncatchable process termination on Linux)
      const execTimeout = options.singleAttempt ? 8000 : 15000;
    execFile(binary, attempt.args, { maxBuffer: 1024 * 1024 * 10, timeout: execTimeout, killSignal: 'SIGKILL' }, (error, stdout, stderr) => {
        if (error) {
          const errMessage = (stderr || error.message).trim();
          lastErrorMsg = errMessage;
          console.error(`Attempt "${attempt.name}" failed:`, errMessage);

          const lowerErr = errMessage.toLowerCase();

          // Auto-detect dead proxy (curl 28 timeout, connection refused, gateway error)
          const isProxyError = lowerErr.includes("connection timed out") ||
                               lowerErr.includes("curl: (28)") ||
                               lowerErr.includes("proxy") ||
                               lowerErr.includes("tunnel connection") ||
                               lowerErr.includes("connection refused") ||
                               lowerErr.includes("host unreachable");

          if (isProxyError && !proxyIsDead) {
            console.warn(`[Proxy Dead] Proxy server timed out or failed (${errMessage}). Disabling proxy for all remaining attempts!`);
            proxyIsDead = true;
          }

          const isBotBlock = lowerErr.includes("confirm you're not a bot") ||
                              lowerErr.includes("sign in to confirm") ||
                              lowerErr.includes("precondition check failed") ||
                              lowerErr.includes("http error 403") ||
                              lowerErr.includes("video unavailable") ||
                              lowerErr.includes("this video is not available") ||
                              lowerErr.includes("private video") ||
                              lowerErr.includes("403 forbidden");

          // Local browser cookies fallback
          if (isBotBlock && !triedBrowserCookies) {
            if (isLocalDesktopRuntime()) {
              const browsers = process.platform === 'win32' 
                ? ['chrome', 'edge', 'firefox', 'opera', 'brave'] 
                : (process.platform === 'darwin' ? ['safari', 'chrome', 'firefox'] : ['firefox', 'chrome']);
              
              console.log(`Bot block detected. Attempting to bypass using local browser cookies...`);
              
              const tryBrowserCookies = (browserList, index) => {
                if (index >= browserList.length) {
                  console.warn("Failed to retrieve cookies from any local browser. Proceeding to next configuration.");
                  currentAttemptIndex++;
                  return runNextAttempt(false);
                }
                
                const browser = browserList[index];
                console.log(`Retrying current configuration with cookies from browser: ${browser}...`);
                
                const fallbackArgs = filterArgs(attempt.args, ['--cookies', '--cookies-from-browser']);
                fallbackArgs.push('--cookies-from-browser', browser);
                
                execFile(binary, fallbackArgs, { maxBuffer: 1024 * 1024 * 10, timeout: 15000, killSignal: 'SIGKILL' }, (err, subStdout, subStderr) => {
                  if (err) {
                    console.warn(`Failed with cookies from browser ${browser}: ${subStderr || err.message}`);
                    return tryBrowserCookies(browserList, index + 1);
                  }
                  
                  console.log(`Successfully downloaded using cookies from browser: ${browser}`);
                  return resolveFile();
                });
              };
              
              return tryBrowserCookies(browsers, 0);
            } else {
              console.warn("Bot block detected, but browser-cookie scraping is disabled for this runtime. Set YOUTUBE_COOKIES or ALLOW_BROWSER_COOKIES=true to opt in.");
            }
          }

          // Move to next configuration
          currentAttemptIndex++;
          return runNextAttempt(triedBrowserCookies);
        }

        console.log(`yt-dlp finished successfully with config: "${attempt.name}"`, stdout);
        return resolveFile();
      });
    };

    const resolveFile = () => {
      // Find files matching THIS session's unique prefix to prevent cross-request collisions
      const files = fs.readdirSync(outputDir);
      const matches = files.filter(f => f.startsWith(sessionPrefix));
      
      if (matches.length === 0) {
        return reject(new Error('File not found after yt-dlp finished processing.'));
      }
      
      const latestFile = matches
        .map(f => ({ name: f, time: fs.statSync(path.join(outputDir, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time)[0].name;

      const fullPath = path.join(outputDir, latestFile);
      
      // Verify the file is not empty (0 bytes)
      const stats = fs.statSync(fullPath);
      if (stats.size === 0) {
        console.error(`yt-dlp produced a 0-byte file: ${fullPath}`);
        try { fs.unlinkSync(fullPath); } catch {}
        return reject(new Error('Download produced a 0-byte file. The video may be unavailable, private, or region-restricted.'));
      }
      
      console.log(`yt-dlp resolved output file: ${latestFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      resolve(fullPath);
    };

    runNextAttempt();
  });
}

async function downloadWithCobalt(videoUrl, format, quality, outputDir) {
  const activeInstances = [
    'https://lime.clxxped.lol',          // 100% uptime (cobalt.clxxped.lol)
    'https://nuko-c.meowing.de',          // 100% uptime (cobalt.meowing.de)
    'https://cobalt.alpha.wolfy.love',    // 87% uptime (cobalt.canine.tools)
    'https://rue-cobalt.xenon.zone',      // 83% uptime (cobalt.xenon.zone)
    'https://api.cobalt.liubquanti.click' // fallback (cobalt.liubquanti.click)
  ];

  const COBALT_TIMEOUT_MS = 7000; // 7s timeout — fail fast so we can fall back to yt-dlp quickly
  
  // 1. Resolve media URL using the fastest working instance in parallel
  const promises = activeInstances.map(async (instance) => {
    const endpoint = `${instance.replace(/\/+$/, '')}/`;
    const body = {
      url: videoUrl,
      videoQuality: quality === 'best' ? '1080' : quality.replace('p', ''),
      downloadMode: format === 'mp3' ? 'audio' : 'auto',
      audioFormat: format === 'mp3' ? 'mp3' : undefined,
      filenameStyle: 'classic'
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), COBALT_TIMEOUT_MS);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status} from ${instance}`);
      }

      const json = await res.json();
      if (json.status === 'error') {
        throw new Error(json.error?.code || json.error || `Error from ${instance}`);
      }

      const mediaUrl = json.url;
      if (!mediaUrl) {
        throw new Error(`No direct URL from ${instance}`);
      }

      return { mediaUrl, instance };
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  });

  let mediaUrl;
  let chosenInstance;
  try {
    const result = await Promise.any(promises);
    mediaUrl = result.mediaUrl;
    chosenInstance = result.instance;
    console.log(`Cobalt resolved media URL via ${chosenInstance}: ${mediaUrl}`);
  } catch (err) {
    throw new Error(`All parallel Cobalt instances failed. Errors: ${err.errors?.map(e => e.message).join(', ') || err.message}`);
  }

  // 2. Fetch the file from the returned media URL and stream it to outputDir
  try {
    const dlController = new AbortController();
    const dlTimeout = setTimeout(() => dlController.abort(), 120000); // 2 min timeout for downloading

    const fileRes = await fetch(mediaUrl, { signal: dlController.signal });
    clearTimeout(dlTimeout);

    if (!fileRes.ok) {
      throw new Error(`Failed to fetch media file: ${fileRes.statusText}`);
    }

    // Try to extract the real filename from Content-Disposition header
    const cd = fileRes.headers.get('content-disposition');
    let filename = null;
    let ext = format === 'mp3' ? '.mp3' : '.mp4';
    if (cd) {
      const match = cd.match(/filename[*]?=["']?(?:UTF-8'')?([^"';\n]+)["']?/i);
      if (match) {
        let fname = decodeURIComponent(match[1]).trim();
        // Remove any path components for safety
        fname = fname.replace(/^.*[\/\\]/, '');
        if (fname) {
          filename = fname;
          const lastDot = fname.lastIndexOf('.');
          if (lastDot !== -1) {
            ext = fname.substring(lastDot);
          }
        }
      }
    }

    // Use the real filename from the platform, or fall back to generic
    const safeFilename = filename 
      ? filename.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_').trim()
      : `video${ext}`;
    const finalPath = path.join(outputDir, `download_${Date.now()}_${safeFilename}`);
    const fileStream = fs.createWriteStream(finalPath);
    
    await new Promise((resolve, reject) => {
      const readable = Readable.fromWeb(fileRes.body);
      readable.pipe(fileStream);
      readable.on('error', (err) => {
        fileStream.close();
        try { fs.unlinkSync(finalPath); } catch {}
        reject(err);
      });
      fileStream.on('finish', () => {
        resolve();
      });
      fileStream.on('error', (err) => {
        try { fs.unlinkSync(finalPath); } catch {}
        reject(err);
      });
    });

    console.log(`Successfully saved Cobalt download from ${chosenInstance} to ${finalPath} (${safeFilename})`);

    // Verify the downloaded file is not 0 bytes
    const stats = fs.statSync(finalPath);
    if (stats.size === 0) {
      console.error(`Cobalt download produced a 0-byte file: ${finalPath}`);
      try { fs.unlinkSync(finalPath); } catch {}
      throw new Error('Download produced a 0-byte file. The media may be unavailable or the download service timed out.');
    }

    // If a video format was requested (not mp3), but Cobalt returned a static image (e.g. cover photo/thumbnail), reject it to trigger yt-dlp fallback
    const isImage = /\.(jpg|jpeg|png|webp|gif|heic)$/i.test(finalPath);
    if (format !== 'mp3' && isImage) {
      console.warn(`Cobalt returned an image (${safeFilename}) instead of a video. Rejecting Cobalt result to trigger yt-dlp fallback.`);
      try { fs.unlinkSync(finalPath); } catch {}
      throw new Error('Cobalt returned an image instead of a video.');
    }

    console.log(`Cobalt download verified: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    return finalPath;
  } catch (err) {
    console.error(`Cobalt download step failed:`, err.message);
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════════
// DEDICATED INSTAGRAM DOWNLOADER (bypasses datacenter IP blocks)
// ═══════════════════════════════════════════════════════════════

function extractInstagramShortcode(url) {
  // Extract shortcode from all Instagram URL types:
  // /p/CODE, /reel/CODE, /reels/CODE, /tv/CODE
  const m = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

/**
 * Strategy 1: Use indown.io free scraper backend
 * This service reverse-engineers Instagram's internal API and works from any IP
 */
async function tryIndownIo(postUrl) {
  const TIMEOUT = 6000;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    // Step 1: Get the nonce token from the page
    const pageRes = await fetch('https://indown.io/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://indown.io/'
      },
      signal: controller.signal
    });

    clearTimeout(t);
    if (!pageRes.ok) throw new Error(`indown.io page fetch failed: ${pageRes.status}`);

    const pageHtml = await pageRes.text();

    // Extract nonce and referer token from page
    const nonceMatch = pageHtml.match(/name="nonce"\s+value="([^"]+)"/);
    const nonce = nonceMatch ? nonceMatch[1] : '';

    // Step 2: Submit the form with the Instagram URL
    const formData = new URLSearchParams();
    formData.append('url', postUrl);
    formData.append('nonce', nonce);
    formData.append('lang', 'en');
    formData.append('referer', 'https://indown.io/');

    const controller2 = new AbortController();
    const t2 = setTimeout(() => controller2.abort(), TIMEOUT);

    const apiRes = await fetch('https://indown.io/', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://indown.io/',
        'Origin': 'https://indown.io'
      },
      body: formData.toString(),
      signal: controller2.signal
    });

    clearTimeout(t2);
    if (!apiRes.ok) throw new Error(`indown.io API response: ${apiRes.status}`);

    const html = await apiRes.text();

    // Extract video download URLs from HTML response
    const videoMatches = [...html.matchAll(/href="(https?:\/\/[^"]+\.mp4[^"]*)"/gi)];
    const directMatches = [...html.matchAll(/src="(https?:\/\/[^"]+\.mp4[^"]*)"/gi)];
    const cdnMatches = [...html.matchAll(/"url"\s*:\s*"(https?:\/\/[^"]+\.mp4[^"]*)"/gi)];

    const allUrls = [
      ...videoMatches.map(m => m[1]),
      ...directMatches.map(m => m[1]),
      ...cdnMatches.map(m => m[1])
    ].filter(u => u && !u.includes('//w.') && !u.includes('thumb'));

    if (allUrls.length > 0) {
      // Prefer the first working URL (often best quality)
      return decodeURIComponent(allUrls[0].replace(/&amp;/g, '&'));
    }

    // Also look for button download links
    const btnMatches = [...html.matchAll(/data-url="(https?:\/\/[^"]+)"/gi)];
    if (btnMatches.length > 0) {
      return decodeURIComponent(btnMatches[0][1].replace(/&amp;/g, '&'));
    }

    throw new Error('indown.io: no video URL found in response HTML');
  } catch (err) {
    clearTimeout(t);
    throw err;
  }
}

/**
 * Strategy 2: Use sssinsta.com (SSSInstagram) API
 * An open Instagram downloader service that works without Instagram auth
 */
async function trySSSInstagram(postUrl) {
  const TIMEOUT = 6000;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    // SSS provides a JSON API endpoint
    const params = new URLSearchParams({ url: postUrl });
    const res = await fetch(`https://sssinsta.com/api/ajaxSearch`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://sssinsta.com/',
        'Origin': 'https://sssinsta.com',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: params.toString(),
      signal: controller.signal
    });

    clearTimeout(t);
    if (!res.ok) throw new Error(`SSS API response: ${res.status}`);

    const data = await res.json();
    
    if (data.status === 'ok' && data.data) {
      // Parse the HTML response in data.data for download links
      const html = data.data;
      const videoMatches = [...html.matchAll(/href="(https?:\/\/[^"]+\.mp4[^"]*)"/gi)];
      if (videoMatches.length > 0) {
        return decodeURIComponent(videoMatches[0][1].replace(/&amp;/g, '&'));
      }
    }

    throw new Error('SSS Instagram: no video URL found in API response');
  } catch (err) {
    clearTimeout(t);
    throw err;
  }
}

/**
 * Strategy 3: Use Cobalt instances with Instagram support
 * Some cobalt instances have working Instagram support
 */
async function tryCobaltForInstagram(postUrl) {
  const instaInstances = [
    'https://lime.clxxped.lol',
    'https://nuko-c.meowing.de',
    'https://cobalt.alpha.wolfy.love',
    'https://rue-cobalt.xenon.zone'
  ];

  const promises = instaInstances.map(async (instance) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(`${instance}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: postUrl,
          downloadMode: 'auto',
          videoQuality: '1080',
          filenameStyle: 'classic'
        }),
        signal: controller.signal
      });

      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.status === 'error') throw new Error(json.error?.code || 'error');
      if (!json.url) throw new Error('no url');

      return json.url;
    } catch (err) {
      clearTimeout(t);
      throw err;
    }
  });

  try {
    return await Promise.any(promises);
  } catch (err) {
    throw new Error('All Instagram Cobalt instances failed');
  }
}

/**
 * Main Instagram download orchestrator
 * Tries multiple strategies in sequence:
 * 1. Method 1: yt-dlp with proxy (using DOWNLOAD_PROXY/HTTP_PROXY/HTTPS_PROXY)
 * 2. Method 2: yt-dlp with cookies (using INSTAGRAM_COOKIES/YOUTUBE_COOKIES)
 * 3. Scrapers fallback: indown.io, SSSInstagram, Cobalt
 */
async function downloadInstagram(postUrl, format, outputDir) {
  // ── 1. Run online scrapers (indown.io, SSSInstagram, Cobalt) in PARALLEL first for instant 1-2s response ──
  const scrapers = [
    { name: 'indown.io', fn: () => tryIndownIo(postUrl) },
    { name: 'SSSInstagram', fn: () => trySSSInstagram(postUrl) },
    { name: 'Cobalt', fn: () => tryCobaltForInstagram(postUrl) }
  ];

  let mediaUrl;
  let winningScraper;

  try {
    console.log(`[Instagram] Launching parallel scrapers (3.5s max)...`);
    const promises = scrapers.map(async (scraper) => {
      const url = await withHardTimeout(scraper.fn(), 3500, scraper.name);
      return { url, name: scraper.name };
    });

    const result = await Promise.any(promises);
    mediaUrl = result.url;
    winningScraper = result.name;
    console.log(`[Instagram] ${winningScraper} resolved URL in parallel: ${mediaUrl.slice(0, 80)}...`);
  } catch (parallelErr) {
    console.warn(`[Instagram] Parallel scrapers failed or timed out. Falling back to yt-dlp...`);
  }

  // Stream media URL to output file with fast 6s timeout max
  if (mediaUrl) {
    const dlController = new AbortController();
    const dlTimeout = setTimeout(() => dlController.abort(), 6000);

    try {
      const fileRes = await fetch(mediaUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://www.instagram.com/'
        },
        signal: dlController.signal
      });
      clearTimeout(dlTimeout);

      if (!fileRes.ok) throw new Error(`Media fetch failed: ${fileRes.status}`);

      const contentType = fileRes.headers.get('content-type') || '';
      const isVideo = contentType.includes('video') || mediaUrl.includes('.mp4');
      const ext = format === 'mp3' ? '.mp3' : (isVideo ? '.mp4' : '.mp4');
      const finalPath = path.join(outputDir, `download_${Date.now()}_instagram${ext}`);
      const fileStream = fs.createWriteStream(finalPath);

      await new Promise((resolve, reject) => {
        const readable = Readable.fromWeb(fileRes.body);
        readable.pipe(fileStream);
        readable.on('error', (err) => { fileStream.close(); try { fs.unlinkSync(finalPath); } catch {} reject(err); });
        fileStream.on('finish', () => resolve());
        fileStream.on('error', (err) => { try { fs.unlinkSync(finalPath); } catch {} reject(err); });
      });

      const stats = fs.statSync(finalPath);
      if (stats.size > 0) {
        console.log(`[Instagram] Successfully downloaded via ${winningScraper}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        return finalPath;
      }
      try { fs.unlinkSync(finalPath); } catch {}
    } catch (streamErr) {
      clearTimeout(dlTimeout);
      console.warn(`[Instagram] Media stream download failed: ${streamErr.message}. Falling back to yt-dlp...`);
    }
  }

  // ── 2. Fallback: Cookie-authenticated yt-dlp (if INSTAGRAM_COOKIES configured) ──
  const cookiesPath = setupInstagramCookies();
  if (cookiesPath) {
    try {
      console.log(`[Instagram] Trying Cookie-authenticated yt-dlp (5s max)...`);
      const filePath = await withHardTimeout(
        downloadMediaWithYtdlp(postUrl, format, 'best', outputDir, { 
          useProxy: false, 
          useCookies: true, 
          customCookiesPath: cookiesPath,
          singleAttempt: true
        }),
        5000,
        'Cookie yt-dlp'
      );
      console.log(`[Instagram] Cookie strategy succeeded: ${filePath}`);
      return filePath;
    } catch (cookieErr) {
      console.warn(`[Instagram] Cookie strategy failed: ${cookieErr.message}`);
    }
  }

  // ── 3. Fallback: Direct yt-dlp (5s max) ──
  try {
    console.log(`[Instagram] Trying Direct yt-dlp (5s max)...`);
    const filePath = await withHardTimeout(
      downloadMediaWithYtdlp(postUrl, format, 'best', outputDir, { 
        useProxy: false, 
        useCookies: false,
        singleAttempt: true
      }),
      5000,
      'Direct yt-dlp'
    );
    console.log(`[Instagram] Direct yt-dlp succeeded: ${filePath}`);
    return filePath;
  } catch (directErr) {
    console.warn(`[Instagram] Direct yt-dlp failed: ${directErr.message}`);
  }

  throw new Error(
    'Instagram download is currently unavailable. Instagram actively blocks cloud server IPs from accessing media.\n\n' +
    '✅ You can download this post for free at:\n' +
    '• https://indown.io\n' +
    '• https://snapinsta.app\n' +
    '• https://sssinsta.com'
  );
}

// ═══════════════════════════════════════════════════════════════
// DEDICATED VIMEO DOWNLOADER (0.5s open player config resolution)
// ═══════════════════════════════════════════════════════════════

async function downloadVimeo(vimeoUrl, format, outputDir) {
  const m = vimeoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!m) throw new Error('Invalid Vimeo URL format.');
  const id = m[1];

  console.log(`[Vimeo] Resolving direct Vimeo stream for video ID: ${id}...`);
  const configRes = await fetch(`https://player.vimeo.com/video/${id}/config`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://vimeo.com/'
    }
  });

  if (!configRes.ok) {
    throw new Error(`Vimeo player API returned HTTP ${configRes.status}`);
  }

  const json = await configRes.json();
  const rawTitle = json.video?.title || 'vimeo_video';
  const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9_-]/g, '_').trim();
  const files = json.request?.files?.progressive || [];

  if (files.length === 0) {
    throw new Error('No direct progressive MP4 streams found for this Vimeo video.');
  }

  // Sort by quality height (descending) -> pick highest quality stream
  files.sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0));
  const bestStream = files[0];
  const streamUrl = bestStream.url;

  console.log(`[Vimeo] Selected ${bestStream.quality} stream for "${cleanTitle}". Downloading...`);

  const dlRes = await fetch(streamUrl);
  if (!dlRes.ok) {
    throw new Error(`Failed to stream Vimeo media file: HTTP ${dlRes.status}`);
  }

  const ext = format === 'mp3' ? '.mp3' : '.mp4';
  const finalPath = path.join(outputDir, `download_${Date.now()}_vimeo_${cleanTitle}${ext}`);
  const fileStream = fs.createWriteStream(finalPath);

  await new Promise((resolve, reject) => {
    const readable = Readable.fromWeb(dlRes.body);
    readable.pipe(fileStream);
    readable.on('error', (err) => { fileStream.close(); try { fs.unlinkSync(finalPath); } catch {} reject(err); });
    fileStream.on('finish', () => resolve());
    fileStream.on('error', (err) => { try { fs.unlinkSync(finalPath); } catch {} reject(err); });
  });

  const stats = fs.statSync(finalPath);
  if (stats.size === 0) {
    try { fs.unlinkSync(finalPath); } catch {}
    throw new Error('Vimeo download produced a 0-byte file.');
  }

  console.log(`[Vimeo] Successfully downloaded: ${finalPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  return finalPath;
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════

function getFriendlyErrorMessage(rawError, url) {
  const err = (rawError || '').toLowerCase();
  
  if (url.includes('instagram.com') || url.includes('instagr.am')) {
    if (err.includes('empty media response') || err.includes('login') || err.includes('cookies') || err.includes('authentication')) {
      return "Instagram requires account authentication to download this media.\n\nThe server IP is currently restricted by Instagram. If you are the site administrator, please export your Instagram session cookies as a Netscape cookies.txt file and set it in the YOUTUBE_COOKIES environment variable to resume downloads.";
    }
  }
  
  if (err.includes('confirm you\'re not a bot') || err.includes('sign in to confirm') || err.includes('confirm you are not a bot')) {
    return "The media platform is blocking the download request (bot detection/rate limit).\n\nIf you are the site administrator, please configure a cookies file (YOUTUBE_COOKIES) or a proxy on the server to bypass this block.";
  }
  
  if (err.includes('private') || err.includes('not available') || err.includes('removed')) {
    return "This video is private, age-restricted, or deleted. It cannot be downloaded anonymously.";
  }
  
  return `Download failed: ${rawError || 'Unknown extractor error'}`;
}

function normalizeUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  let clean = rawUrl.trim();

  // Normalize x.com to twitter.com for yt-dlp Twitter extractor compatibility
  if (clean.includes('x.com/')) {
    clean = clean.replace('x.com/', 'twitter.com/');
  }

  // Normalize Vimeo URLs to player embed format to bypass broken macos OAuth token check
  const vimeoMatch = clean.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Normalize YouTube shortlinks
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (match) {
    return `https://www.youtube.com/watch?v=${match[1]}`;
  }
  return clean;
}

export async function downloadMedia(rawUrl, format, quality, outputDir) {
  const url = normalizeUrl(rawUrl);
  const isInstagram = url.includes('instagram.com') || url.includes('instagr.am');
  const isVimeo = url.includes('vimeo.com');

  // ── Vimeo: dedicated fast open player config scraper (1s resolution) ──────
  if (isVimeo) {
    console.log('[Vimeo] Detected Vimeo URL. Using dedicated fast Vimeo resolver...');
    try {
      const filePath = await downloadVimeo(url, format, outputDir);
      return filePath;
    } catch (vimeoErr) {
      console.warn(`[Vimeo] Dedicated resolver failed (${vimeoErr.message}). Falling back to yt-dlp...`);
    }
  }

  // ── Instagram: dedicated multi-strategy downloader ──────
  if (isInstagram) {
    console.log('[Instagram] Detected Instagram URL. Using dedicated Instagram downloader...');
    try {
      const filePath = await downloadInstagram(url, format, outputDir);
      return filePath;
    } catch (igError) {
      console.error(`[Instagram] Dedicated strategies failed: ${igError.message}`);
      throw new Error(
        'Instagram media access is currently restricted by Instagram on this cloud server.\n\n' +
        '✅ You can download this post for free at:\n' +
        '• https://indown.io\n' +
        '• https://snapinsta.app\n' +
        '• https://sssinsta.com'
      );
    }
  }

  // ── All other platforms: Cobalt first, then yt-dlp ──────────
  try {
    console.log('Attempting download via Cobalt API (priority)...');
    const filePath = await downloadWithCobalt(url, format, quality, outputDir);
    return filePath;
  } catch (cobaltError) {
    console.warn(`Cobalt API failed (${cobaltError.message}). Falling back to yt-dlp...`);
    try {
      const filePath = await downloadMediaWithYtdlp(url, format, quality, outputDir);
      return filePath;
    } catch (ytdlpError) {
      console.error(`yt-dlp fallback also failed: ${ytdlpError.message}`);
      const friendlyMsg = getFriendlyErrorMessage(ytdlpError.message, url);
      throw new Error(friendlyMsg);
    }
  }
}
