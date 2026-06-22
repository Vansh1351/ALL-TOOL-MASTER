import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import pdfParse from 'pdf-parse';
import { convertMedia, extractTextFromDocx } from './converter.js';

/**
 * Handles AI summarization, note-taking, transcription, and translation.
 * Extracts audio from video files if a video is provided, to optimize the payload size.
 */
export async function processAiTool({ tool, filePath, mimeType, textContent, apiKey, uploadsDir }) {
  let incomingKey = apiKey;
  if (incomingKey) {
    incomingKey = incomingKey.trim();
    if (incomingKey.length < 10) {
      incomingKey = null;
    }
  }
  if (incomingKey) {
    const lower = incomingKey.toLowerCase();
    if (lower.includes('your_') || lower.includes('api_key') || lower.includes('placeholder') || lower.includes('aizasy...') || lower === 'undefined' || lower === 'null') {
      incomingKey = null;
    }
  }

  const rawKey = incomingKey || process.env.GEMINI_API_KEY;
  if (!rawKey) {
    throw new Error("Missing Gemini API Key. Please provide it in Settings or configure the server .env.");
  }

  const keys = rawKey.split(',').map(k => k.trim()).filter(Boolean).filter(k => {
    const trimmed = k.toLowerCase();
    if (trimmed.includes('your_') || trimmed.includes('api_key') || trimmed.includes('placeholder') || trimmed.includes('aizasy...')) {
      return false;
    }
    return true;
  });

  if (keys.length === 0) {
    throw new Error("No valid Gemini API keys found. Please provide a valid key in Settings or configure the server .env.");
  }

  // OPTIMIZATION: If video is uploaded, extract audio to reduce payload size once before key iteration
  let processedFilePath = filePath;
  let processedMimeType = mimeType;

  if (filePath && mimeType && mimeType.startsWith('video/')) {
    console.log("Extracting audio from video for AI analysis...");
    const audioFilename = `extracted_${Date.now()}.mp3`;
    const audioPath = path.join(uploadsDir, audioFilename);
    try {
      await convertMedia(filePath, audioPath, 'mp3');
      processedFilePath = audioPath;
      processedMimeType = 'audio/mp3';
    } catch (e) {
      console.error("Failed to extract audio, falling back to original video file:", e);
      processedFilePath = filePath;
      processedMimeType = mimeType;
    }
  }

  // Construct Prompt based on tool
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
    default:
      prompt = `Provide a comprehensive summary and analysis of the attached content. Highlight all main topics and present them clearly in markdown.`;
  }

  let lastError = null;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const maskedKey = key.length > 10 ? `${key.slice(0, 8)}...${key.slice(-4)}` : 'Key';
    console.log(`Trying API key ${i + 1}/${keys.length} (${maskedKey})...`);

    try {
      // 1. OPENROUTER COMPATIBILITY BLOCK (For keys starting with 'sk-')
      if (key.startsWith('sk-')) {
        console.log(`Using OpenRouter routing for key ${i + 1}...`);
        let contextText = "";

        // Extract text from files if provided
        if (filePath && fs.existsSync(filePath)) {
          const ext = path.extname(filePath).toLowerCase();
          if (mimeType === 'application/pdf' || ext === '.pdf') {
            try {
              const dataBuffer = fs.readFileSync(filePath);
              const pdfData = await pdfParse(dataBuffer);
              contextText = pdfData.text || "Empty PDF document.";
            } catch (err) {
              console.error("PDF text extraction failed:", err);
              throw new Error("Unable to parse text from the uploaded PDF document.");
            }
          } else if (ext === '.docx') {
            try {
              contextText = await extractTextFromDocx(filePath);
            } catch (err) {
              console.error("DOCX text extraction failed:", err);
              throw new Error("Unable to parse text from the uploaded Word document.");
            }
          } else if (mimeType && (mimeType.startsWith('audio/') || mimeType.startsWith('video/'))) {
            throw new Error("Audio/video file analysis is not supported with OpenAI/OpenRouter keys. Please use a standard Google Gemini API Key (starts with 'AIzaSy') from Google AI Studio, or paste the text content directly.");
          } else {
            try {
              contextText = fs.readFileSync(filePath, 'utf8');
            } catch (err) {
              contextText = "";
            }
          }
        }

        const fullPrompt = `System Directive: Apply the following instructions to the provided media/text context:

${prompt}

${contextText ? `Context Content:\n${contextText}\n\n` : ''}${textContent ? `Text Input Context:\n${textContent}\n\n` : ''}Format your output in professional, readable Markdown syntax. Start directly with the content without conversational meta-responses.`;

        const openRouterModels = [
          "google/gemini-2.5-flash",
          "google/gemini-1.5-flash",
          "google/gemini-flash-1.5-8b"
        ];
        let orError = null;
        let responseText = null;

        for (const model of openRouterModels) {
          let attempts = 3;
          let delay = 1000;
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              console.log(`Calling OpenRouter model ${model} (attempt ${attempt}/${attempts})...`);
              const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${key}`,
                  "Content-Type": "application/json",
                  "HTTP-Referer": "http://localhost:5000",
                  "X-Title": "All Tool Master"
                },
                body: JSON.stringify({
                  model: model,
                  messages: [
                    { role: "user", content: fullPrompt }
                  ]
                })
              });

              if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                const errMsg = errJson.error?.message || `HTTP error ${response.status}`;
                throw { status: response.status, message: errMsg };
              }

              const resJson = await response.json();
              const text = resJson.choices?.[0]?.message?.content;
              if (!text) {
                throw new Error("Invalid response received from OpenRouter API.");
              }
              responseText = text;
              break;
            } catch (error) {
              orError = error;
              const errMsg = error.message || "";
              const status = error.status || 0;
              const isTransient = status === 503 || status === 429 ||
                                  errMsg.includes('503') || errMsg.includes('429') ||
                                  errMsg.toLowerCase().includes('high demand') ||
                                  errMsg.toLowerCase().includes('temporarily') ||
                                  errMsg.toLowerCase().includes('unavailable');
              
              if (isTransient && attempt < attempts) {
                console.warn(`Transient error calling ${model} on OpenRouter: ${errMsg}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
              } else {
                console.error(`Error calling OpenRouter model ${model}:`, errMsg);
                break; // break the attempt loop to try next model
              }
            }
          }
          if (responseText) {
            break;
          }
        }

        if (!responseText) {
          throw orError || new Error("Failed to generate content with OpenRouter.");
        }

        // Cleanup extracted audio file if it was created
        if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
          try { fs.unlinkSync(processedFilePath); } catch (e) {}
        }

        return responseText;
      } 
      
      // 2. STANDARD GEMINI SDK BLOCK
      else {
        console.log(`Using Standard Gemini SDK routing for key ${i + 1}...`);
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

        // Append prompt instructions
        contents.push({
          text: `System Directive: Apply the following instructions to the provided media/text context:\n\n${prompt}\n\nFormat your output in professional, readable Markdown syntax. Start directly with the content without conversational meta-responses.`
        });

        const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash'];
        let sdkError = null;
        let responseText = null;

        for (const model of modelsToTry) {
          let attempts = 3;
          let delay = 1000;
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              console.log(`Calling SDK model ${model} (attempt ${attempt}/${attempts})...`);
              const response = await ai.models.generateContent({
                model: model,
                contents: contents
              });
              responseText = response.text;
              break;
            } catch (error) {
              sdkError = error;
              const errMsg = error.message || "";
              const status = error.status || 0;
              const isTransient = status === 503 || status === 429 ||
                                  errMsg.includes('503') || errMsg.includes('429') ||
                                  errMsg.toLowerCase().includes('high demand') ||
                                  errMsg.toLowerCase().includes('temporarily') ||
                                  errMsg.toLowerCase().includes('unavailable');
              
              if (isTransient && attempt < attempts) {
                console.warn(`Transient error calling SDK model ${model}: ${errMsg}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
              } else {
                console.error(`Error calling SDK model ${model}:`, errMsg);
                break; // break the attempt loop to try the next model
              }
            }
          }
          if (responseText) {
            break;
          }
        }

        if (!responseText) {
          throw sdkError || new Error("Failed to generate content with SDK.");
        }

        // Cleanup extracted audio file if it was created
        if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
          try { fs.unlinkSync(processedFilePath); } catch (e) {}
        }

        return responseText;
      }
    } catch (error) {
      console.error(`API Key ${i + 1} failed:`, error.message);
      lastError = error;
      // Loop continues...
    }
  }

  // Cleanup on error
  if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
    try { fs.unlinkSync(processedFilePath); } catch (e) {}
  }

  throw new Error(`All provided API keys failed. Last error: ${lastError.message}`);
}

/**
 * Removes watermarks from an image using Gemini's native image generation/editing.
 * Sends the image (and optional mask) to Gemini with responseModalities: ['TEXT', 'IMAGE'].
 * Returns the path to the cleaned image file.
 */
export async function removeWatermark({ filePath, mimeType, maskPath, regions, apiKey, uploadsDir }) {
  let incomingKey = apiKey;
  if (incomingKey) {
    incomingKey = incomingKey.trim();
    if (incomingKey.length < 10) incomingKey = null;
  }
  if (incomingKey) {
    const lower = incomingKey.toLowerCase();
    if (lower.includes('your_') || lower.includes('api_key') || lower.includes('placeholder') || lower === 'undefined' || lower === 'null') {
      incomingKey = null;
    }
  }

  const rawKey = incomingKey || process.env.GEMINI_API_KEY;
  if (!rawKey) {
    throw new Error("Missing Gemini API Key. Please provide it in Settings or configure the server .env.");
  }

  const keys = rawKey.split(',').map(k => k.trim()).filter(Boolean).filter(k => {
    const trimmed = k.toLowerCase();
    return !(trimmed.includes('your_') || trimmed.includes('api_key') || trimmed.includes('placeholder'));
  });

  if (keys.length === 0) {
    throw new Error("No valid Gemini API keys found.");
  }

  // Only use Gemini SDK keys (AIzaSy...) for image generation — OpenRouter doesn't support it
  const geminiKeys = keys.filter(k => !k.startsWith('sk-'));
  if (geminiKeys.length === 0) {
    throw new Error("Watermark removal requires a Google Gemini API key (starts with 'AIzaSy'). OpenRouter keys do not support image generation.");
  }

  // Build region description for the prompt
  let regionDescription = '';
  if (regions && regions.length > 0) {
    const regionLines = regions.map((r, i) =>
      `  ${i + 1}. "${r.type}" at position (${r.x}%, ${r.y}%) with size ${r.w}% × ${r.h}%`
    ).join('\n');
    regionDescription = `\nThe following watermark/overlay regions have been detected:\n${regionLines}\n`;
  }

  // Build the prompt
  const prompt = `You are an expert image restoration AI. Your task is to remove ALL watermarks, text overlays, logos, timestamps, and any other non-original content from this image.
${regionDescription}
CRITICAL INSTRUCTIONS:
- Remove every watermark, logo, text overlay, and semi-transparent pattern completely
- Reconstruct the underlying image content behind each watermark naturally
- The result must look like the original clean photograph with NO traces of watermarks
- Preserve the original image quality, colors, lighting, and composition exactly
- Do NOT add any new text, logos, or artifacts
- Do NOT crop or resize the image
- Return ONLY the cleaned image with no watermarks remaining

${maskPath ? 'A mask image is also provided — white/red areas indicate regions to clean. Focus removal on those areas but also check for any other watermarks across the entire image.' : ''}

Output the cleaned image.`;

  const contents = [];

  // Add the original image
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

  // Add the mask image if provided (manual mode)
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

  // Add the prompt
  contents.push({ text: prompt });

  // Try each Gemini key
  let lastError = null;
  const modelsToTry = ['gemini-2.0-flash-exp', 'gemini-2.5-flash', 'gemini-2.0-flash'];

  for (let i = 0; i < geminiKeys.length; i++) {
    const key = geminiKeys[i];
    const maskedKey = key.length > 10 ? `${key.slice(0, 8)}...${key.slice(-4)}` : 'Key';
    console.log(`[Watermark Removal] Trying API key ${i + 1}/${geminiKeys.length} (${maskedKey})...`);

    const ai = new GoogleGenAI({ apiKey: key });

    for (const model of modelsToTry) {
      let attempts = 2;
      let delay = 2000;

      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          console.log(`[Watermark Removal] Calling ${model} with image editing (attempt ${attempt}/${attempts})...`);

          const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            }
          });

          // Extract the image from the response
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

          if (!imageData) {
            // Try alternate response structure
            if (response.image) {
              imageData = response.image.imageBytes || response.image;
              imageMimeType = response.image.mimeType || 'image/png';
            } else if (response.generatedImages && response.generatedImages.length > 0) {
              imageData = response.generatedImages[0].image?.imageBytes;
              imageMimeType = response.generatedImages[0].image?.mimeType || 'image/png';
            }
          }

          if (!imageData) {
            throw new Error("Gemini did not return an image in the response. The model may not support image generation with this configuration.");
          }

          // Save the cleaned image
          const ext = imageMimeType.includes('png') ? 'png' : imageMimeType.includes('webp') ? 'webp' : 'jpg';
          const outputFilename = `watermark_cleaned_${Date.now()}.${ext}`;
          const outputPath = path.join(uploadsDir, outputFilename);

          const imageBuffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, imageBuffer);

          console.log(`[Watermark Removal] Success! Cleaned image saved: ${outputFilename} (${(imageBuffer.length / 1024).toFixed(1)}KB)`);
          return { outputPath, mimeType: imageMimeType };

        } catch (error) {
          lastError = error;
          const errMsg = error.message || '';
          const status = error.status || 0;
          const isTransient = status === 503 || status === 429 ||
                              errMsg.includes('503') || errMsg.includes('429') ||
                              errMsg.toLowerCase().includes('high demand') ||
                              errMsg.toLowerCase().includes('temporarily') ||
                              errMsg.toLowerCase().includes('unavailable');

          if (isTransient && attempt < attempts) {
            console.warn(`[Watermark Removal] Transient error with ${model}: ${errMsg}. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
          } else {
            console.error(`[Watermark Removal] Error with ${model}:`, errMsg);
            break;
          }
        }
      }
    }
  }

  throw new Error(`Watermark removal failed: ${lastError?.message || 'Unknown error'}. Please try again.`);
}
