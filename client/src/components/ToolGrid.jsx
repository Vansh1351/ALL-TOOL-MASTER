import React from 'react';
import { 
  FiYoutube, FiMusic, FiImage, FiFileText, 
  FiFolderPlus, FiVideo, FiMic, FiCompass, 
  FiBookOpen, FiClock, FiSettings, FiVolume2 
} from 'react-icons/fi';

export const TOOLS_DATA = [
  {
    id: 'youtube-downloader',
    title: 'YouTube Downloader',
    desc: 'Extract MP4 video or MP3 audio from any YouTube, Shorts, or Vimeo URL.',
    icon: FiYoutube,
    color: '#ef4444',
    category: 'Downloader'
  },
  {
    id: 'url-to-mp4',
    title: 'URL to MP4',
    desc: 'Download videos from FB, Instagram, TikTok, Vimeo, or Twitter directly to MP4.',
    icon: FiCompass,
    color: '#06b6d4',
    category: 'Downloader'
  },
  {
    id: 'mp4-to-mp3',
    title: 'MOV & MP4 Video Converter',
    desc: 'Convert uploaded MOV or MP4 video files to MP4, MOV, MP3, or WAV formats.',
    icon: FiMusic,
    color: '#ec4899',
    category: 'Converter'
  },
  {
    id: 'image-converter',
    title: 'Universal Image Converter',
    desc: 'Batch convert between JPG, PNG, and PDF, or export image formats into DOCX structures.',
    icon: FiImage,
    color: '#3b82f6',
    category: 'Converter'
  },
  {
    id: 'pdf-converter',
    title: 'PDF Document Converter',
    desc: 'Translate PDF to DOCX text structures, convert files, or compile text to PDF.',
    icon: FiFileText,
    color: '#10b981',
    category: 'Converter'
  },
  {
    id: 'zip-extractor',
    title: 'ZIP Extractor / Archiver',
    desc: 'Decompress uploaded ZIP archives or bundle multiple assets into a zipped download.',
    icon: FiFolderPlus,
    color: '#f59e0b',
    category: 'Utility'
  },
  {
    id: 'ai-video-summarizer',
    title: 'AI Video Summarizer & Watcher',
    desc: 'Upload a video (or pass a URL) and let AI watch, analyze, and outline key takeaways.',
    icon: FiVideo,
    color: '#8b5cf6',
    category: 'AI Tool'
  },
  {
    id: 'ai-transcript',
    title: 'Transcript Generator',
    desc: 'Extract and transcribe verbatim dialogue transcripts from audio or video recordings.',
    icon: FiClock,
    color: '#d946ef',
    category: 'AI Tool'
  },
  {
    id: 'ai-audio-analyzer',
    title: 'Audio Analyzer & Summarizer',
    desc: 'Upload audio or voice notes and analyze topics, arguments, tone, and conclusions.',
    icon: FiVolume2,
    color: '#14b8a6',
    category: 'AI Tool'
  },
  {
    id: 'ai-lecture-notes',
    title: 'AI Lecture Note Taker',
    desc: 'Convert academic recordings or text notes into study notes, formulas, and Q&As.',
    icon: FiBookOpen,
    color: '#f43f5e',
    category: 'AI Tool'
  },
  {
    id: 'ai-meeting-minutes',
    title: 'AI Meeting Assistant & Minutes',
    desc: 'Transcribe meeting logs or voice clips into summary minutes and action items tables.',
    icon: FiMic,
    color: '#6366f1',
    category: 'AI Tool'
  },
  {
    id: 'pdf-to-brainrot',
    title: 'PDF to Gen-Z Brainrot Translator',
    desc: 'Upload dry PDF files or documents and translate summaries into hilarious Gen-Z slang.',
    icon: FiSettings,
    color: '#84cc16',
    category: 'AI Tool'
  }
];

export default function ToolGrid({ filterText, onSelectTool }) {
  const filteredTools = TOOLS_DATA.filter(tool => {
    const term = filterText.toLowerCase();
    return tool.title.toLowerCase().includes(term) || 
           tool.desc.toLowerCase().includes(term) || 
           tool.category.toLowerCase().includes(term);
  });

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800' }}>
            Featured <span className="text-gradient">Digital Tool Suite</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Fully responsive, lightning-fast tools designed to make conversions and AI tasks effortless.
          </p>
        </div>

        {/* Grid List */}
        {filteredTools.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)'
          }}>
            <h3>No tools matched your search</h3>
            <p style={{ fontSize: '14px', marginTop: '6px' }}>Try searching for generic terms like "PDF", "MP3", or "AI".</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }} className="tool-grid">
            {filteredTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="glass-panel tool-card"
                  onClick={() => onSelectTool(tool)}
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Category Badge & Icon */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${tool.color}15`,
                        color: tool.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px'
                      }}>
                        <IconComp />
                      </div>
                      <span className="badge" style={{
                        background: 'var(--bg-grid)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)'
                      }}>
                        {tool.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                      {tool.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      lineHeight: '1.5'
                    }}>
                      {tool.desc}
                    </p>
                  </div>

                  {/* Micro action prompt */}
                  <div style={{
                    marginTop: '20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }} className="card-cta">
                    Open Tool &rarr;
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <style>{`
        .tool-card {
          transform: translateY(0);
        }
        .tool-card:hover {
          transform: translateY(-5px);
        }
        .tool-card:hover .card-cta {
          gap: 8px !important;
        }
        @media (max-width: 640px) {
          .tool-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
