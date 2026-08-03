# All Tool Master Platform

**All Tool Master** is a premium, modern, fully responsive SaaS-style web application providing:
1. **Universal File Converter**: Multi-format conversions between video, audio, image, and document assets in pure JavaScript.
2. **URL Video/Audio Downloader**: High-quality extractor wrapping `yt-dlp` to download media from YouTube, Facebook, Instagram, TikTok, and more.
3. **AI Productivity Suite**: Google Gemini-powered transcription, analysis, meeting minutes generator, study note taker, and document translation.

Built with a glassmorphic UI, responsive layouts, teal color schemes, and dual dark/light modes.

---

## 📁 Project Structure

```
/All Tool Master
├── package.json               # Root scripts (orchestrates concurrently)
├── README.md                  # Documentation and API endpoints
├── client/                    # Vite + React Frontend
│   ├── package.json
│   ├── index.html             # Entry HTML with SEO meta tags
│   ├── public/                # robots.txt, sitemap.xml, assets
│   └── src/
│       ├── main.jsx           # React mounting
│       ├── index.css          # Design system & CSS animations
│       ├── App.jsx            # State coordinator & page layouts
│       ├── components/        # UI components (Navbar, Hero, ToolModal, etc.)
│       │   └── portfolio/     # Luxury Portfolio showcase suite (/portfolio)
│       └── pages/             # Informational pages & PortfolioPage (/portfolio)
└── server/                    # Node.js + Express Backend
    ├── package.json
    ├── server.js              # Express app coordination
    ├── .env                   # Local server keys
    ├── bin/                   # Auto-fetched yt-dlp binaries
    ├── uploads/               # Temporary uploads folder
    └── services/
        ├── converter.js       # Core conversion logic
        ├── downloader.js      # yt-dlp download wrapper
        └── aiService.js       # Google Gemini API connector
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- **Node.js** (v18+ recommended. Node v24.14.1 is validated).
- **npm** package manager.
- **FFmpeg & yt-dlp**: The server automatically downloads `yt-dlp` and installs self-contained FFmpeg binaries on first boot! No manual system setups are required.

### 2. Quick Setup
1. Open terminal in the project root directory.
2. Run the bulk installation command:
   ```bash
   npm run install-all
   ```
   *Note: On Windows systems with script execution limitations, use:*
   ```powershell
   npm.cmd run install-all
   ```
3. Set up the Environment Variables (see section below).

### 3. Launch Development Server
Run the root concurrent task to boot both the Vite React dev server (`localhost:5173`) and the Node Express server (`localhost:5000`):
```bash
npm run dev
```

---

## ⚙️ Environment Variables

Create a file named `.env` in the `/server` directory:
```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
```

- **PORT**: Configures the port number for the backend Express server (default: `5000`).
- **GEMINI_API_KEY**: Optional fallback key for Google Gemini model access. If not provided here, users can input their own key in the Settings dialog on the frontend.

---

## 📡 API Documentation

### 1. Universal File Converter
**Endpoint**: `POST http://localhost:5000/api/convert`  
**Content-Type**: `multipart/form-data`  
**Payload**:
- `file`: The media, image, or document file binary.
- `targetFormat`: The string format you want to convert to.

**Supported Paths**:
- **Video**: `mp4`, `mov`, `avi`, `mkv` $\rightarrow$ `mp3`, `wav`, `mov`, `mp4`, `zip`
- **Audio**: `mp3`, `wav`, `ogg` $\rightarrow$ `mp3`, `wav`, `zip`
- **Image**: `jpg`, `jpeg`, `png`, `webp` $\rightarrow$ `jpg`, `png`, `webp`, `pdf`, `docx`, `zip`
- **Document**: `docx` $\rightarrow$ `pdf`, `jpg`, `png`, `zip`
- **Document**: `pdf` $\rightarrow$ `docx`, `jpg`, `png`, `zip`
- **Archive**: `zip` $\rightarrow$ `unzip` (returns unzipped contents zipped back up)

---

### 2. URL Media Downloader
**Endpoint**: `POST http://localhost:5000/api/download`  
**Content-Type**: `application/json`  
**Payload**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp4", // 'mp4' (video) or 'mp3' (audio extract)
  "quality": "best" // 'best', '720p', '480p', '360p'
}
```
**Response**: Returns the media file stream download.

---

### 3. AI Productivity Suite
**Endpoint**: `POST http://localhost:5000/api/ai`  
**Content-Type**: `multipart/form-data`  
**Payload**:
- `file`: (Optional) Audio, video, or PDF file to analyze.
- `tool`: Specific AI utility name.
- `textContent`: (Optional) Paste-in text context for analysis.
- `apiKey`: (Optional) Gemini key passed from the client's localStorage.

**Available Tool IDs**:
- `note-taker`, `ai-note-taker`, `voice-recorder`: Generates core structured summaries.
- `lecture-notes`: Creates academic study notes with key terms and study questions.
- `meeting-minutes`, `meeting-recorder`, `transcript-to-minutes`: Drafts formal meeting summaries, roles, and a table of Action Items.
- `video-analyzer`, `video-summarizer`, `vimeo-summarizer`: Chronological summaries of videos.
- `audio-analyzer`, `audio-summarizer`: Audio transcripts, theme, and tone summaries.
- `transcript`: Generates verbatim textual dialogues.
- `sop`, `video-to-sop`: Step-by-step Standard Operating Procedures.
- `brainrot`, `pdf-to-brainrot`: Translates uploaded texts into comedic Gen-Z internet slang.

**Response**:
```json
{
  "result": "## Markdown formatted analysis response from Gemini..."
}
```

---

## 🌐 Deployment Guidelines

### Backend Deployment (Render / Heroku / Railway)
1. **Web Service Setup**: Create a new web service connected to your Git repository, pointing to the `/server` subdirectory.
2. **Environment Variables**: Add your `GEMINI_API_KEY` to the environment settings.
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. **FFmpeg & yt-dlp**: When running on Render, the backend service automatically downloads the Linux versions of `yt-dlp` and FFmpeg binaries internally, meaning no system buildpack configurations are strictly required!

### Frontend Deployment (Vercel / Netlify)
1. **Build Settings**: Configure your deployment target to the `/client` directory.
2. **Framework Preset**: Select `Vite` or `Other`.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **API Connection**: Open `client/src/components/ToolModal.jsx` and update `BACKEND_URL` to point to your deployed backend Express URL instead of `http://localhost:5000`.
