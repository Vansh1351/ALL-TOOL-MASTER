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

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "All Tool Master"
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "user", content: fullPrompt }
            ]
          })
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson.error?.message || `HTTP error ${response.status}`);
        }

        const resJson = await response.json();
        const text = resJson.choices?.[0]?.message?.content;
        if (!text) {
          throw new Error("Invalid response received from OpenRouter API.");
        }

        // Cleanup extracted audio file if it was created
        if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
          try { fs.unlinkSync(processedFilePath); } catch (e) {}
        }

        return text;
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

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents
        });

        // Cleanup extracted audio file if it was created
        if (processedFilePath !== filePath && fs.existsSync(processedFilePath)) {
          try { fs.unlinkSync(processedFilePath); } catch (e) {}
        }

        return response.text;
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
