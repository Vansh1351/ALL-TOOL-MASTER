import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import pdfParse from 'pdf-parse';
import { convertMedia, extractTextFromDocx } from './converter.js';

/**
 * Validates whether an API key is a valid non-placeholder token.
 */
function isValidKey(key) {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (trimmed.length < 10) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('your_') ||
    lower.includes('api_key') ||
    lower.includes('placeholder') ||
    lower.includes('aizasy...') ||
    lower === 'undefined' ||
    lower === 'null'
  ) {
    return false;
  }
  return true;
}

/**
 * Builds an ordered list of valid API keys combining incoming user keys and server environment keys.
 */
function buildKeyPool(incomingKey) {
  const pool = [];

  const addKeys = (raw) => {
    if (!raw) return;
    const parts = raw.split(',').map(s => s.trim()).filter(isValidKey);
    for (const p of parts) {
      if (!pool.includes(p)) {
        pool.push(p);
      }
    }
  };

  // 1. User supplied incoming key (highest priority)
  if (incomingKey) {
    addKeys(incomingKey);
  }

  // 2. Server configured keys
  addKeys(process.env.GROQ_API_KEY);
  addKeys(process.env.OPENROUTER_API_KEY);
  addKeys(process.env.NVIDIA_API_KEY || process.env.NVTDTA_APT_KEY || process.env.NVIDIA_KEY);
  addKeys(process.env.GEMINI_API_KEY);

  // 3. Resilient scan: check any environment variable matching key prefixes
  for (const [envName, envVal] of Object.entries(process.env)) {
    if (typeof envVal === 'string') {
      const trimmed = envVal.trim();
      if (
        trimmed.startsWith('gsk_') ||
        trimmed.startsWith('sk-or-') ||
        trimmed.startsWith('nvapi-') ||
        trimmed.startsWith('AQ.') ||
        trimmed.startsWith('AIzaSy')
      ) {
        addKeys(trimmed);
      }
    }
  }

  return pool;
}

/**
 * Detects provider type from API key format.
 */
function detectProvider(key) {
  if (key.startsWith('gsk_')) return 'groq';
  if (key.startsWith('sk-or-') || key.startsWith('sk-')) return 'openrouter';
  if (key.startsWith('nvapi-')) return 'nvidia';
  return 'gemini';
}

/**
 * Transcribes audio/video using Groq Whisper Large v3 Turbo (~400ms latency).
 */
async function transcribeWithGroq(filePath, mimeType, key) {
  console.log(`[Groq Whisper] Transcribing ${path.basename(filePath)} with whisper-large-v3-turbo...`);
  const fileBuf = fs.readFileSync(filePath);
  const whisperForm = new FormData();
  const audioBlob = new Blob([fileBuf], { type: mimeType || 'audio/mpeg' });
  whisperForm.append('file', audioBlob, path.basename(filePath));
  whisperForm.append('model', 'whisper-large-v3-turbo');

  const whisperRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}` },
    body: whisperForm
  });

  if (!whisperRes.ok) {
    const errText = await whisperRes.text();
    throw new Error(`Groq Whisper error (${whisperRes.status}): ${errText}`);
  }

  const whisperData = await whisperRes.json();
  return whisperData.text || "";
}

/**
 * Transcribes audio/video using Google Gemini multimodal audio.
 */
async function transcribeWithGemini(filePath, mimeType, key) {
  console.log(`[Gemini Audio] Transcribing ${path.basename(filePath)} with Gemini SDK...`);
  const ai = new GoogleGenAI({ apiKey: key });
  const fileBuffer = fs.readFileSync(filePath);
  const contents = [
    {
      inlineData: {
        mimeType: mimeType || 'audio/mpeg',
        data: fileBuffer.toString('base64')
      }
    },
    {
      text: "Generate a verbatim, accurate transcription of all speech in this audio. Break down paragraph blocks clearly. Start directly with the transcript."
    }
  ];

  const models = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  let lastErr = null;
  for (const m of models) {
    try {
      const res = await ai.models.generateContent({ model: m, contents: contents });
      const txt = res.text;
      if (txt) return txt;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Gemini audio transcription failed.");
}

/**
 * Executes chat / text generation via Groq.
 */
async function executeGroqChat({ prompt, contextText, textContent, tool, key }) {
  const models = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];
  const maxTokens = tool === 'ai-script-writer' ? 4096 : (tool === 'watermark-remover' || tool === 'logo-generator' ? 2048 : 2500);

  const fullPrompt = `System Directive: Apply the following instructions to the provided media/text context:

${prompt}

${contextText ? `Context Content:\n${contextText}\n\n` : ''}${textContent ? `Text Input Context:\n${textContent}\n\n` : ''}Format your output in professional, readable Markdown syntax. Start directly with the content without conversational meta-responses.`;

  let lastErr = null;
  for (const model of models) {
    try {
      console.log(`[Groq Chat] Calling model ${model}...`);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          max_tokens: maxTokens,
          messages: [{ role: "user", content: fullPrompt }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        const errText = await res.text();
        lastErr = new Error(`Groq ${model} (${res.status}): ${errText}`);
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Groq chat execution failed.");
}

/**
 * Executes chat / vision generation via OpenRouter.
 */
async function executeOpenRouter({ prompt, contextText, textContent, imagePayload, tool, key }) {
  const models = [
    "google/gemini-2.5-flash",
    "openai/gpt-4o-mini",
    "deepseek/deepseek-chat"
  ];

  const fullPrompt = `System Directive: Apply the following instructions to the provided media/text context:

${prompt}

${contextText ? `Context Content:\n${contextText}\n\n` : ''}${textContent ? `Text Input Context:\n${textContent}\n\n` : ''}Format your output in professional, readable Markdown syntax. Start directly with the content without conversational meta-responses.`;

  let messageContent;
  if (imagePayload) {
    messageContent = [
      { type: "text", text: fullPrompt },
      { type: "image_url", image_url: { url: imagePayload } }
    ];
  } else {
    messageContent = fullPrompt;
  }

  const maxTokens = tool === 'ai-script-writer' ? 4096 : (tool === 'watermark-remover' || tool === 'logo-generator' ? 2048 : 2500);

  let lastErr = null;
  for (const model of models) {
    let attempts = 2;
    let delay = 1000;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[OpenRouter] Calling model ${model} (attempt ${attempt}/${attempts})...`);
        const payload = {
          model: model,
          max_tokens: maxTokens,
          messages: [{ role: "user", content: messageContent }]
        };
        if (tool === 'logo-generator' || tool === 'ai-logo-generator' || tool === 'watermark-remover') {
          payload.response_format = { type: "json_object" };
        }

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://alltoolmaster.me",
            "X-Title": "All Tool Master"
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          const errMsg = errJson.error?.message || `HTTP ${res.status}`;
          throw { status: res.status, message: errMsg };
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
        throw new Error("No text content in OpenRouter response.");
      } catch (e) {
        lastErr = e;
        const status = e.status || 0;
        const errMsg = e.message || "";
        const isTransient = status === 503 || status === 429 || errMsg.includes('503') || errMsg.includes('429');
        if (isTransient && attempt < attempts) {
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        } else {
          break;
        }
      }
    }
  }
  throw lastErr || new Error("OpenRouter execution failed.");
}

/**
 * Executes chat generation via NVIDIA NIM API.
 */
async function executeNvidiaNim({ prompt, contextText, textContent, tool, key }) {
  const models = [
    'minimaxai/minimax-m3.1-flash',
    'nvidia/nemotron-3.5-lightning-30b-a3b'
  ];

  const fullPrompt = `System Directive: Apply the following instructions to the provided media/text context:

${prompt}

${contextText ? `Context Content:\n${contextText}\n\n` : ''}${textContent ? `Text Input Context:\n${textContent}\n\n` : ''}Format your output in professional, readable Markdown syntax. Start directly with the content without conversational meta-responses.`;

  const maxTokens = tool === 'ai-script-writer' ? 4096 : (tool === 'watermark-remover' || tool === 'logo-generator' ? 2048 : 2500);

  let lastErr = null;
  for (const model of models) {
    try {
      console.log(`[NVIDIA NIM] Calling model ${model}...`);
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          max_tokens: maxTokens,
          messages: [{ role: "user", content: fullPrompt }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const choice = data.choices?.[0]?.message;
        let content = choice?.content;
        // If reasoning model put output in reasoning_content
        if (!content && choice?.reasoning_content) {
          content = choice.reasoning_content;
        }
        if (content) return content;
      } else {
        const errText = await res.text();
        lastErr = new Error(`NVIDIA ${model} (${res.status}): ${errText}`);
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("NVIDIA NIM execution failed.");
}

/**
 * Executes multimodal generation via Google Gemini SDK.
 */
async function executeGeminiSdk({ prompt, textContent, processedFilePath, processedMimeType, tool, key }) {
  console.log(`[Gemini SDK] Initializing GoogleGenAI client...`);
  const ai = new GoogleGenAI({ apiKey: key });
  const contents = [];

  if (processedFilePath && fs.existsSync(processedFilePath)) {
    const fileBuffer = fs.readFileSync(processedFilePath);
    contents.push({
      inlineData: {
        mimeType: processedMimeType,
        data: fileBuffer.toString('base64')
      }
    });
  }

  if (textContent) {
    contents.push({ text: `Text Input for Context:\n\n${textContent}` });
  }

  contents.push({
    text: `System Directive: Apply the following instructions to the provided media/text context:\n\n${prompt}\n\nFormat your output in professional, readable Markdown syntax. Start directly with the content without conversational meta-responses.`
  });

  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  let sdkError = null;

  for (const model of modelsToTry) {
    let attempts = 2;
    let delay = 1000;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[Gemini SDK] Calling ${model} (attempt ${attempt}/${attempts})...`);
        const config = {};
        if (tool === 'logo-generator' || tool === 'ai-logo-generator' || tool === 'watermark-remover') {
          config.responseMimeType = 'application/json';
        }
        const response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: config
        });
        const text = response.text;
        if (text) return text;
      } catch (error) {
        sdkError = error;
        const errMsg = error.message || "";
        const status = error.status || 0;
        const isTransient = status === 503 || status === 429 || errMsg.includes('503') || errMsg.includes('429');
        if (isTransient && attempt < attempts) {
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        } else {
          break;
        }
      }
    }
  }
  throw sdkError || new Error("Gemini SDK request failed.");
}

/**
 * Master multi-provider AI processing handler with automatic cascading fallback.
 * Works seamlessly across Groq, OpenRouter, NVIDIA NIM, and Google Gemini.
 */
export async function processAiTool({ tool, filePath, mimeType, textContent, apiKey, uploadsDir }) {
  // Build aggregated key pool across user-provided and environment keys
  const keys = buildKeyPool(apiKey);

  if (keys.length === 0) {
    throw new Error("Missing AI API Key. Please configure your key in Settings or contact the administrator.");
  }

  // OPTIMIZATION: If video is uploaded, extract audio to reduce payload size
  let processedFilePath = filePath;
  let processedMimeType = mimeType;

  if (filePath && mimeType && mimeType.startsWith('video/')) {
    console.log("Extracting audio from video for AI analysis...");
    const audioFilename = `extracted_${Date.now()}.mp3`;
    const audioPath = path.join(uploadsDir, audioFilename);
    try {
      await convertMedia(filePath, audioPath, 'mp3');
      processedFilePath = audioPath;
      processedMimeType = 'audio/mpeg';
    } catch (e) {
      console.error("Failed to extract audio, falling back to original video file:", e);
      processedFilePath = filePath;
      processedMimeType = mimeType;
    }
  }

  // Construct prompt based on tool
  let prompt = "";
  switch (tool) {
    case 'voice-recorder':
    case 'note-taker':
    case 'ai-note-taker':
      prompt = "Act as an expert AI Note Taker. Extract the core ideas, definitions, facts, and themes from this media/text and structure them into clear, beautifully formatted bullet points. Avoid fluff.";
      break;
    case 'lecture-notes':
    case 'ai-lecture-notes':
      prompt = "Generate highly structured, detailed academic lecture notes from this media/text. Organise into sections with clear headers, bold important terminology, draft key summaries, and formulate a 'Q&A' study card section at the end. Use clean Markdown.";
      break;
    case 'meeting-minutes':
    case 'ai-meeting-minutes':
    case 'transcript-to-minutes':
    case 'meeting-assistant':
    case 'meeting-summarizer':
    case 'meeting-minutes-generator':
    case 'google-meet-notes':
    case 'meeting-recorder':
      prompt = "Analyze this meeting media/text. Generate formal Meeting Minutes containing:\n1. Subject / Objective\n2. Executive Summary (2-3 sentences)\n3. Participant Roles (if detectable)\n4. Chronological key discussion points\n5. Action Items Checklist (Task, Owner, Deadline/Status).";
      break;
    case 'video-analyzer':
    case 'video-summarizer':
    case 'ai-video-summarizer':
    case 'vimeo-summarizer':
    case 'video-watcher':
      prompt = "Act as a Media Watcher. Summarize this video content. Detail the primary message, map out the timeline/chapters of the topics discussed, and list the key conclusions.";
      break;
    case 'audio-analyzer':
    case 'ai-audio-analyzer':
    case 'audio-summarizer':
      prompt = "Provide a thorough analysis of this audio content. Discuss the speaker's tone, the core message, and list key quotes/arguments.";
      break;
    case 'transcript':
    case 'ai-transcript':
      prompt = "Generate a verbatim text transcription of the conversation or audio. Break down paragraph blocks by speaker changes or topic changes where applicable.";
      break;
    case 'sop':
    case 'video-to-sop':
      prompt = "Generate a formal, professional Standard Operating Procedure (SOP) based on the actions or steps demonstrated in the media/text. Structure as follows:\n- Document Title & ID\n- Purpose & Scope\n- Required Tools / Prerequisites\n- Sequential Process Steps (numbered, with sub-bullets for details)\n- Quality Controls & Success Criteria.";
      break;
    case 'brainrot':
    case 'pdf-to-brainrot':
      prompt = "Act as a Gen-Z translator. Summarize this entire content using highly exaggerated Gen-Z 'brainrot' slang (e.g., skibidi, rizzler, gyatt, fanum tax, looksmaxxing, kai cenat, baby grimace, mewing, mogging, cooked, sigma, alpha, grinding in Ohio, etc.). Make it hilarious but still explain the actual content and logic accurately.";
      break;
    case 'ai-script-writer':
    case 'script-writer':
      prompt = `You are an award-winning professional script writer and screenwriter with 20+ years of experience writing for Hollywood, YouTube, podcasts, and advertising.

Your task: Write a COMPLETE, FULL-LENGTH, PROFESSIONAL SCRIPT based on the user's brief below.

FORMATTING RULES (STRICTLY FOLLOW):
- Use standard screenplay format (FADE IN:, INT./EXT., CHARACTER NAME centered, action lines, dialogue, FADE OUT.)
- For YouTube/podcast/ad scripts: Use clear SCENE HEADERS, HOST/NARRATOR cues, B-ROLL suggestions in brackets
- Open with an ENHANCED, COMPELLING TITLE and LOGLINE
- Divide into clear ACTS or SEGMENTS (Act 1: Setup, Act 2: Confrontation, Act 3: Resolution OR Opening Hook / Main Content / CTA)
- Include all dialogue, stage directions, scene transitions, and action lines
- End with a powerful, satisfying conclusion appropriate to the genre and tone
- If the user requests SHORT: write ~600-900 words of script content
- If the user requests MEDIUM: write ~1500-2500 words of script content  
- If the user requests LONG: write ~3500-5000 words of script content

BEGIN with "ENHANCED TITLE:" then write the full script immediately. Do not add meta-commentary about what you are going to write. Just write the script.`;
      break;
    case 'ai-resume-enhance-summary':
      prompt = "You are an expert resume writer and career coach. Your task is to rewrite, polish, and professionally enhance the provided professional summary. Make it punchy, high-impact, professional, and tailored for a modern resume. Keep it to 2-4 sentences maximum. Do not include any introductory text, greeting, or markdown formatting like quotes. Just return the enhanced summary directly.";
      break;
    case 'ai-resume-enhance-experience':
      prompt = "You are an expert resume writer. Enhance and polish the following work experience description or bullet points. Use active verb phrase format (e.g. 'Led cross-functional teams...', 'Optimized pipeline speed...'), quantify achievements where possible, and ensure the tone is professional, clear, and action-oriented. Keep the structure as a list of bullet points if the input is in that format, or write 2-3 strong bullet points. Start directly with the enhanced text, do not add introductory phrases, conversational comments, or explanations.";
      break;
    case 'watermark-remover':
      prompt = `You are an expert image analysis AI specializing in detecting watermarks, overlays, and non-original content on images.

Analyze this image carefully and detect ALL of the following:
- Text watermarks (e.g. stock photo watermarks like "Shutterstock", "Getty Images", "Adobe Stock", etc.)
- Logo watermarks (company logos, brand marks overlaid on the image)
- Timestamps (date/time overlays)
- Text overlays (captions, subtitles, credit text)
- Semi-transparent overlays (diagonal repeating text patterns, grid watermarks)
- Any other non-original content overlaid on the base image

For each detected watermark/overlay, return its bounding box as PERCENTAGE coordinates (0-100) relative to the image width and height:
- x: left edge percentage
- y: top edge percentage  
- w: width percentage
- h: height percentage

Return ONLY a valid JSON array with no markdown formatting, no code blocks, no explanation. Example format:
[{"type":"Text Watermark","x":25,"y":40,"w":50,"h":15,"confidence":0.95},{"type":"Logo","x":5,"y":5,"w":12,"h":12,"confidence":0.88}]

If no watermarks are detected, return exactly: []

CRITICAL: Return ONLY the raw JSON array. No other text.`;
      break;
    case 'logo-generator':
    case 'ai-logo-generator':
      prompt = `You are a world-class professional brand identity designer and SVG developer.
Your task is to generate 3 catchy slogans/taglines and 4 completely unique, custom, creative vector logo marks/icons as SVG elements for a company.

Based on the company details provided in the context, create 4 different vector logo concepts.
Design Guidelines:
- The logo marks must look highly professional, unique, premium, and meaningful for the specific company name, industry, and style.
- Each concept MUST be a set of valid inner SVG tags (such as <path>, <circle>, <polygon>, <rect>, <g>, etc.) centered around coordinate (0, 0).
- The entire design should fit within a boundary of roughly -40 to 40 on both X and Y axes.
- Use placeholders "PRIMARY_COLOR" and "SECONDARY_COLOR" for fill or stroke attributes so colors can be dynamically swapped.
- Do NOT output the outer <svg> tag. Output only the inner elements.
- Use SINGLE QUOTES (') for all HTML/SVG attributes (e.g. fill='PRIMARY_COLOR' or d='M -20 -20 L 20 20') inside the "svgIcon" string to prevent double quote JSON parsing failures. Do NOT use escaped double quotes inside "svgIcon".
- The icons must be sophisticated and highly custom. For example, if it's a tech company, design a cool abstract chip, network nodes, or a futuristic polygon. If it's a food company, design custom leaves, spoons, or steam vector paths. If it is corporate, design clean intersecting grids or geometric bands.
- Do NOT use standard plain circles and triangles unless they are arranged in an extremely creative way.

Format your output strictly as a JSON object:
{
  "slogans": ["slogan 1", "slogan 2", "slogan 3"],
  "concepts": [
    {
      "id": "concept1",
      "name": "Concept Name 1",
      "font": "Inter",
      "svgIcon": "<path d='M -20 0 L 20 0' stroke='PRIMARY_COLOR' stroke-width='4' />"
    },
    {
      "id": "concept2",
      "name": "Concept Name 2",
      "font": "Montserrat",
      "svgIcon": "..."
    },
    {
      "id": "concept3",
      "name": "Concept Name 3",
      "font": "Outfit",
      "svgIcon": "..."
    },
    {
      "id": "concept4",
      "name": "Concept Name 4",
      "font": "Playfair Display",
      "svgIcon": "..."
    }
  ]
}

CRITICAL: Return ONLY valid, parser-friendly JSON. Do not wrap in markdown \`\`\`json.`;
      break;
    default:
      prompt = `Provide a comprehensive summary and analysis of the attached content. Highlight all main topics and present them clearly in markdown.`;
  }

  // Pre-process any uploaded document (PDF, DOCX) or image payload
  let contextText = "";
  let imagePayload = null;

  if (processedFilePath && fs.existsSync(processedFilePath)) {
    const ext = path.extname(processedFilePath).toLowerCase();
    if (processedMimeType && processedMimeType.startsWith('image/')) {
      try {
        const fileBuffer = fs.readFileSync(processedFilePath);
        imagePayload = `data:${processedMimeType};base64,${fileBuffer.toString('base64')}`;
      } catch (err) {
        console.error("Image base64 read failed:", err);
      }
    } else if (processedMimeType === 'application/pdf' || ext === '.pdf') {
      try {
        const dataBuffer = fs.readFileSync(processedFilePath);
        const pdfData = await pdfParse(dataBuffer);
        contextText = pdfData.text || "Empty PDF document.";
      } catch (err) {
        console.error("PDF text extraction failed:", err);
        throw new Error("Unable to parse text from the uploaded PDF document.");
      }
    } else if (ext === '.docx') {
      try {
        contextText = await extractTextFromDocx(processedFilePath);
      } catch (err) {
        console.error("DOCX text extraction failed:", err);
        throw new Error("Unable to parse text from the uploaded Word document.");
      }
    } else if (processedMimeType && (processedMimeType.startsWith('audio/') || processedMimeType.startsWith('video/'))) {
      // Step A: Audio/Video Transcription Waterfall
      console.log("[Audio Engine] Transcribing audio/video input with high-speed fallback...");
      let transcribedText = "";
      let transcriptionError = null;

      // 1. Try Groq Whisper (Ultra-fast, ~400ms)
      const groqKey = keys.find(k => detectProvider(k) === 'groq');
      if (groqKey) {
        try {
          transcribedText = await transcribeWithGroq(processedFilePath, processedMimeType, groqKey);
        } catch (e) {
          console.warn("[Groq Whisper] Failed, trying fallback:", e.message);
          transcriptionError = e;
        }
      }

      // 2. Fallback to Gemini Multimodal Audio if Groq failed or wasn't available
      if (!transcribedText) {
        const geminiKey = keys.find(k => detectProvider(k) === 'gemini');
        if (geminiKey) {
          try {
            transcribedText = await transcribeWithGemini(processedFilePath, processedMimeType, geminiKey);
          } catch (e) {
            console.warn("[Gemini Audio] Failed:", e.message);
            transcriptionError = e;
          }
        }
      }

      if (!transcribedText && !contextText) {
        throw transcriptionError || new Error("Failed to transcribe audio from the uploaded media file.");
      }

      // If user tool is purely transcript or speech-to-text, return the verbatim text immediately!
      if (tool === 'transcript' || tool === 'ai-transcript') {
        if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
          try { fs.unlinkSync(processedFilePath); } catch (e) {}
        }
        return transcribedText || "No speech detected in the uploaded audio file.";
      }

      contextText = transcribedText;
    } else {
      try {
        contextText = fs.readFileSync(processedFilePath, 'utf8');
      } catch (err) {
        contextText = "";
      }
    }
  }

  // Step B: Multi-Provider LLM Waterfall for Text/Analysis/Script/Summary/Logo
  let lastError = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const provider = detectProvider(key);
    const maskedKey = key.length > 10 ? `${key.slice(0, 8)}...${key.slice(-4)}` : 'Key';
    console.log(`[AI Waterfall] Attempting Provider: ${provider.toUpperCase()} (${maskedKey}, priority ${i + 1}/${keys.length})...`);

    try {
      let resultText = null;

      if (provider === 'groq') {
        // Groq Chat
        resultText = await executeGroqChat({ prompt, contextText, textContent, tool, key });
      } else if (provider === 'openrouter') {
        // OpenRouter (with vision support)
        resultText = await executeOpenRouter({ prompt, contextText, textContent, imagePayload, tool, key });
      } else if (provider === 'nvidia') {
        // NVIDIA NIM
        resultText = await executeNvidiaNim({ prompt, contextText, textContent, tool, key });
      } else if (provider === 'gemini') {
        // Google Gemini SDK
        resultText = await executeGeminiSdk({ prompt, textContent, processedFilePath, processedMimeType, tool, key });
      }

      if (resultText) {
        console.log(`[AI Waterfall] Provider ${provider.toUpperCase()} SUCCEEDED!`);
        // Clean up extracted temp audio file if created
        if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
          try { fs.unlinkSync(processedFilePath); } catch (e) {}
        }
        return resultText;
      }
    } catch (err) {
      console.warn(`[AI Waterfall] Provider ${provider.toUpperCase()} failed: ${err.message}. Trying next available provider...`);
      lastError = err;
    }
  }

  // Cleanup on error
  if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
    try { fs.unlinkSync(processedFilePath); } catch (e) {}
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Removes watermarks from an image using Gemini's native image generation/editing,
 * with seamless fallback to the local Sharp inpainting engine.
 */
export async function removeWatermark({ filePath, mimeType, maskPath, regions, apiKey, uploadsDir }) {
  const keys = buildKeyPool(apiKey);
  const geminiKeys = keys.filter(k => detectProvider(k) === 'gemini');

  // If no Gemini image-generation keys are available, use local inpainting engine directly
  if (geminiKeys.length === 0) {
    console.log("[Watermark Removal] No direct Gemini image-generation key available. Using high-quality local inpainting engine.");
    return await localInpaint({ filePath, mimeType, maskPath, regions, uploadsDir });
  }

  // Build region description for the prompt
  let regionDescription = '';
  if (regions && regions.length > 0) {
    const regionLines = regions.map((r, i) =>
      `  ${i + 1}. "${r.type}" at position (${r.x}%, ${r.y}%) with size ${r.w}% × ${r.h}%`
    ).join('\n');
    regionDescription = `\nThe following watermark/overlay regions have been detected:\n${regionLines}\n`;
  }

  const prompt = `Edit this image: Remove all watermarks, logos, text overlays, timestamps, and semi-transparent patterns from this image. Inpaint the areas where watermarks were with the natural background content that should be behind them. Keep everything else exactly the same - same colors, lighting, composition, and quality. Do not add any new elements. Do not crop or resize.${regionDescription ? '\nFocus especially on these detected regions:' + regionDescription : ''}${maskPath ? '\nThe second image is a mask where painted areas show exactly where to remove content.' : ''}`;

  const contents = [];

  if (filePath && fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    contents.push({
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: fileBuffer.toString('base64')
      }
    });
  } else {
    throw new Error("Image file not found for watermark removal.");
  }

  if (maskPath && fs.existsSync(maskPath)) {
    const maskBuffer = fs.readFileSync(maskPath);
    contents.push({
      inlineData: {
        mimeType: 'image/png',
        data: maskBuffer.toString('base64')
      }
    });
    contents.push({ text: 'The second image above is a mask — white/red painted areas indicate the watermark regions to remove.' });
  }

  contents.push({ text: prompt });

  let lastError = null;
  const modelsToTry = [
    'gemini-2.5-flash-preview-image-generation',
    'gemini-2.0-flash-preview-image-generation',
  ];

  for (let i = 0; i < geminiKeys.length; i++) {
    const key = geminiKeys[i];
    const ai = new GoogleGenAI({ apiKey: key });

    for (const model of modelsToTry) {
      try {
        console.log(`[Watermark Removal] Calling ${model}...`);
        const response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: {
            responseModalities: ['IMAGE', 'TEXT'],
          }
        });

        const candidates = response.candidates || (response.response && response.response.candidates) || [];
        let imageData = null;
        let imageMimeType = 'image/png';

        for (const candidate of candidates) {
          const parts = candidate.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              imageData = part.inlineData.data;
              imageMimeType = part.inlineData.mimeType || 'image/png';
              break;
            }
          }
          if (imageData) break;
        }

        if (imageData) {
          const ext = imageMimeType.includes('png') ? 'png' : imageMimeType.includes('webp') ? 'webp' : 'jpg';
          const outputFilename = `watermark_cleaned_${Date.now()}.${ext}`;
          const outputPath = path.join(uploadsDir, outputFilename);
          fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
          return { outputPath, mimeType: imageMimeType };
        }
      } catch (err) {
        lastError = err;
      }
    }
  }

  console.warn(`[Watermark Removal] Cloud AI image generation unavailable (${lastError?.message || 'not supported'}). Falling back to local inpainting...`);
  return await localInpaint({ filePath, mimeType, maskPath, regions, uploadsDir });
}

/**
 * Performs high-quality local image inpainting using concentric distance-weighted averaging.
 * Runs completely locally on the server using the sharp library.
 */
async function localInpaint({ filePath, mimeType, maskPath, regions, uploadsDir }) {
  console.log(`[Local Inpaint] Running local inpainting fallback...`);
  
  const img = sharp(filePath);
  const metadata = await img.metadata();
  const width = metadata.width;
  const height = metadata.height;
  
  const rawImage = await img.ensureAlpha().raw().toBuffer();
  const isMasked = Array.from({ length: height }, () => new Uint8Array(width));
  let hasMask = false;
  
  // 1. Parse manual mask image if provided
  if (maskPath && fs.existsSync(maskPath)) {
    const maskImg = sharp(maskPath).resize(width, height).raw();
    const rawMask = await maskImg.toBuffer();
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = rawMask[idx];
        const g = rawMask[idx+1];
        const b = rawMask[idx+2];
        const a = rawMask[idx+3];
        if ((r > 120 && g < 100 && b < 100) || (a > 30 && (r > 80 || g > 80 || b > 80))) {
          isMasked[y][x] = 1;
          hasMask = true;
        }
      }
    }
  }
  
  // 2. Parse auto-detected regions if provided
  if (regions && regions.length > 0) {
    for (const r of regions) {
      const rx = Math.max(0, Math.min(width - 1, Math.round((r.x / 100) * width)));
      const ry = Math.max(0, Math.min(height - 1, Math.round((r.y / 100) * height)));
      const rw = Math.max(1, Math.round((r.w / 100) * width));
      const rh = Math.max(1, Math.round((r.h / 100) * height));
      
      const xEnd = Math.min(width, rx + rw);
      const yEnd = Math.min(height, ry + rh);
      
      for (let y = ry; y < yEnd; y++) {
        for (let x = rx; x < xEnd; x++) {
          isMasked[y][x] = 1;
          hasMask = true;
        }
      }
    }
  }
  
  if (!hasMask) {
    console.log(`[Local Inpaint] No mask regions detected. Returning copy of original image.`);
    const ext = mimeType?.includes('png') ? 'png' : 'jpg';
    const outputFilename = `watermark_cleaned_${Date.now()}.${ext}`;
    const outputPath = path.join(uploadsDir, outputFilename);
    fs.copyFileSync(filePath, outputPath);
    return { outputPath, mimeType };
  }
  
  const workingImage = Buffer.from(rawImage);
  const workingMask = Array.from({ length: height }, (_, y) => new Uint8Array(isMasked[y]));
  
  let maskedCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (workingMask[y][x] === 1) maskedCount++;
    }
  }
  
  console.log(`[Local Inpaint] Inpainting ${maskedCount} pixels...`);
  
  let iterations = 0;
  const maxIterations = 500;
  
  while (maskedCount > 0 && iterations < maxIterations) {
    iterations++;
    const boundaryPixels = [];
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (workingMask[y][x] === 1) {
          let hasUnmaskedNeighbor = false;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (workingMask[ny][nx] === 0) {
                  hasUnmaskedNeighbor = true;
                  break;
                }
              }
            }
            if (hasUnmaskedNeighbor) break;
          }
          if (hasUnmaskedNeighbor) {
            boundaryPixels.push({ x, y });
          }
        }
      }
    }
    
    if (boundaryPixels.length === 0) break;
    
    const newColors = [];
    for (const { x, y } of boundaryPixels) {
      let sumR = 0, sumG = 0, sumB = 0, weightSum = 0;
      const r = 2;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (workingMask[ny][nx] === 0) {
              const distSq = dx * dx + dy * dy || 1;
              const weight = 1 / distSq;
              const idx = (ny * width + nx) * 4;
              sumR += workingImage[idx] * weight;
              sumG += workingImage[idx + 1] * weight;
              sumB += workingImage[idx + 2] * weight;
              weightSum += weight;
            }
          }
        }
      }
      
      if (weightSum > 0) {
        newColors.push({
          x, y,
          r: Math.round(sumR / weightSum),
          g: Math.round(sumG / weightSum),
          b: Math.round(sumB / weightSum)
        });
      } else {
        const idx = (y * width + x) * 4;
        newColors.push({
          x, y,
          r: workingImage[idx],
          g: workingImage[idx+1],
          b: workingImage[idx+2]
        });
      }
    }
    
    for (const { x, y, r, g, b } of newColors) {
      const idx = (y * width + x) * 4;
      workingImage[idx] = r;
      workingImage[idx + 1] = g;
      workingImage[idx + 2] = b;
      workingMask[y][x] = 0;
      maskedCount--;
    }
  }
  
  const ext = mimeType?.includes('png') ? 'png' : 'jpg';
  const outputFilename = `watermark_cleaned_${Date.now()}.${ext}`;
  const outputPath = path.join(uploadsDir, outputFilename);
  
  await sharp(workingImage, {
    raw: {
      width,
      height,
      channels: 4
    }
  }).toFile(outputPath);
  
  console.log(`[Local Inpaint] Inpainting completed successfully: ${outputFilename}`);
  return { outputPath, mimeType };
}
