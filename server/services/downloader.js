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
async function downloadMediaWithYtdlp(url, format, quality, outputDir) {
  const binary = await ensureYtdlp();
  
  // Create output path format
  const outputPattern = path.join(outputDir, `download_${Date.now()}_%(title)s.%(ext)s`);
  
  // Check if ffmpeg is globally available in system PATH
  const hasGlobalFfmpeg = await new Promise(resolve => {
    execFile('ffmpeg', ['-version'], (err) => {
      resolve(!err);
    });
  });

  const args = [
    url,
    '-o', outputPattern,
    '--no-playlist',
    '--no-warnings',
    '--restrict-filenames',
    '--no-check-certificate'
  ];

  // Check if the binary supports the requested browser impersonation target.
  const chromeImpersonateTarget = await new Promise(resolve => {
    execFile(binary, ['--list-impersonate-targets'], { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        return resolve(null);
      }

      const targetList = `${stdout || ''}\n${stderr || ''}`;
      const chromeTarget = targetList
        .split(/\r?\n/)
        .map(line => line.trim().split(/\s+/)[0])
        .find(target => /^chrome(?:-\d+)?$/i.test(target));

      resolve(chromeTarget || null);
    });
  });

  if (chromeImpersonateTarget) {
    console.log(`yt-dlp binary "${binary}" supports Chrome TLS impersonation. Enabling ${chromeImpersonateTarget} impersonation.`);
    args.push('--impersonate', chromeImpersonateTarget);
  } else {
    console.log(`yt-dlp binary "${binary}" does not list Chrome as an impersonation target. Bypassing impersonate argument.`);
  }

  if (!hasGlobalFfmpeg) {
    console.log("Global ffmpeg not found in PATH. Using bundled/bin directory ffmpeg location.");
    args.push('--ffmpeg-location', binDir);
  } else {
    console.log("Global ffmpeg found in PATH. Using system-installed ffmpeg.");
  }

  const resolvedCookiesPath = setupCookies();

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
    const attempts = [];

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
          const hasParam = ['-f', '-S', '--cookies', '--extractor-args', '--cookies-from-browser'].includes(argList[i]);
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
      if (resolvedCookiesPath) {
        return [...argList, '--cookies', resolvedCookiesPath];
      }
      return argList;
    };

    // 1. Default player client, with cookies
    attempts.push({
      name: "Default player client (with cookies)",
      args: addCookies([...baseArgs])
    });

    // 2. Default player client, without cookies
    attempts.push({
      name: "Default player client (without cookies)",
      args: [...baseArgs]
    });

    // 3. Fallback format (no -f/-S restrictions), with cookies
    attempts.push({
      name: "Fallback format selection (with cookies)",
      args: addCookies(filterArgs([...baseArgs], ['-f', '-S']))
    });

    // 4. Fallback format (no -f/-S restrictions), without cookies
    attempts.push({
      name: "Fallback format selection (without cookies)",
      args: filterArgs([...baseArgs], ['-f', '-S'])
    });

    // 5. TV client fallback, without cookies
    attempts.push({
      name: "TV player client fallback (without cookies)",
      args: [
        ...filterArgs([...baseArgs], ['-f', '-S']),
        '--extractor-args', 'youtube:player_client=tv_simply,default,-tv'
      ]
    });

    // 6. Web Embedded client fallback, without cookies
    attempts.push({
      name: "Web Embedded player client fallback (without cookies)",
      args: [
        ...filterArgs([...baseArgs], ['-f', '-S']),
        '--extractor-args', 'youtube:player_client=web_embedded,web_safari,default'
      ]
    });

    // 7. Android/iOS client fallback, with cookies
    attempts.push({
      name: "Android/iOS player client fallback (with cookies)",
      args: addCookies([
        ...filterArgs([...baseArgs], ['-f', '-S']),
        '--extractor-args', 'youtube:player_client=android,ios'
      ])
    });

    // 8. Android/iOS client fallback, without cookies
    attempts.push({
      name: "Android/iOS player client fallback (without cookies)",
      args: [
        ...filterArgs([...baseArgs], ['-f', '-S']),
        '--extractor-args', 'youtube:player_client=android,ios'
      ]
    });

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

    const runNextAttempt = (triedBrowserCookies = false) => {
      if (currentAttemptIndex >= uniqueAttempts.length) {
        return reject(new Error(`All yt-dlp fallback attempts failed. Last error: ${lastErrorMsg}`));
      }

      const attempt = uniqueAttempts[currentAttemptIndex];
      console.log(`[Attempt ${currentAttemptIndex + 1}/${uniqueAttempts.length}] Running yt-dlp command: ${binary} ${attempt.args.join(' ')}`);

      execFile(binary, attempt.args, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          const errMessage = (stderr || error.message).trim();
          lastErrorMsg = errMessage;
          console.error(`Attempt "${attempt.name}" failed:`, errMessage);

          const isBotBlock = errMessage.toLowerCase().includes("confirm you're not a bot") || 
                              errMessage.toLowerCase().includes("sign in to confirm");

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
                
                execFile(binary, fallbackArgs, { maxBuffer: 1024 * 1024 * 10 }, (err, subStdout, subStderr) => {
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
      const files = fs.readdirSync(outputDir);
      const matches = files.filter(f => f.startsWith(`download_`));
      
      if (matches.length === 0) {
        return reject(new Error('File not found after yt-dlp finished processing.'));
      }
      
      const latestFile = matches
        .map(f => ({ name: f, time: fs.statSync(path.join(outputDir, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time)[0].name;

      resolve(path.join(outputDir, latestFile));
    };

    runNextAttempt();
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
    // We try v10 endpoint (root '/') first, then legacy endpoint ('/api/json')
    const endpointsToTry = [
      {
        url: `${instance.replace(/\/+$/, '')}/`,
        body: {
          url: videoUrl,
          videoQuality: quality === 'best' ? '1080' : quality.replace('p', ''),
          audioOnly: format === 'mp3',
          audioFormat: format === 'mp3' ? 'mp3' : undefined,
          filenamePattern: 'classic'
        }
      },
      {
        url: `${instance.replace(/\/+$/, '')}/api/json`,
        body: {
          url: videoUrl,
          vQuality: quality === 'best' ? '1080' : quality.replace('p', ''),
          isAudioOnly: format === 'mp3',
          filenameStyle: 'classic'
        }
      }
    ];

    for (const endpoint of endpointsToTry) {
      try {
        console.log(`Attempting Cobalt request to: ${endpoint.url}`);
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(endpoint.body)
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        if (json.status === 'error') {
          throw new Error(json.error?.code || json.error || 'Unknown cobalt error');
        }

        const mediaUrl = json.url;
        if (!mediaUrl) {
          throw new Error('No direct download URL returned from cobalt');
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
        console.warn(`Cobalt endpoint ${endpoint.url} failed:`, err.message);
        lastError = err;
      }
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
