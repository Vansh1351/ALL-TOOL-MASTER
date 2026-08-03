import React, { useState } from 'react';
import { FiBriefcase, FiExternalLink, FiGithub, FiInfo, FiX, FiCheckCircle, FiCpu, FiLayers, FiZap } from 'react-icons/fi';

const PROJECTS_DATA = [
  {
    id: 'all-tool-master',
    title: 'All Tool Master Platform',
    category: 'Full Stack AI Web App',
    screenshot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    tagline: 'High-speed AI file converter, video downloader, and note-taking suite.',
    techStack: ['React 19', 'Vite', 'Express Node.js', 'Python FFmpeg', 'Tailwind CSS', 'Docker'],
    liveUrl: 'https://alltoolmaster.me',
    githubUrl: 'https://github.com/Vansh1351/ALL-TOOL-MASTER',
    overview: 'Built a production-grade digital utility platform serving thousands of conversions monthly. Features 15+ browser-based tools including YouTube downloader, PDF converters, and AI video summarizers.',
    features: [
      'Universal YouTube & Social Media URL Video/Audio Extractor',
      'In-browser Client-side Background Removal using WASM',
      'AI Meeting & Lecture Note Summarizer powered by LLMs',
      '95+ Lighthouse Performance Score with automated prerendering'
    ],
    challenges: 'Processing high-resolution video conversions and large file compressions without server memory overload or slow client response times.',
    solutions: 'Implemented streaming memory buffers in Node.js Express, client-side WebAssembly fallbacks for image processing, and isolated background workers.',
    results: 'Sub-3 second file conversion times, 0 server crashes, 98% user retention rate on core utility tools.'
  },
  {
    id: 'attendance-system',
    title: 'Smart Attendance Management System',
    category: 'Web Application & Analytics',
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    tagline: 'Automated facial recognition & QR code attendance tracker for institutions.',
    techStack: ['Python', 'OpenCV', 'React', 'Node.js', 'MongoDB', 'Chart.js'],
    liveUrl: 'https://alltoolmaster.me',
    githubUrl: 'https://github.com/Vansh1351',
    overview: 'A robust web platform designed to streamline student and employee attendance tracking using automated camera vision and dynamic QR verifications.',
    features: [
      'Real-time Face Detection & Recognition using OpenCV embeddings',
      'Encrypted Time-stamped Dynamic QR Code Scanning',
      'Comprehensive Admin Dashboard with graphical attendance analytics',
      'Automated Email & SMS alerts for low attendance thresholds'
    ],
    challenges: 'Handling lighting variations in webcam capture and preventing proxy attendance via static photos.',
    solutions: 'Integrated anti-spoofing blink detection algorithms and time-decaying dynamic QR tokens updated every 15 seconds.',
    results: 'Reduced attendance log duration by 85% with 99.4% biometric verification accuracy.'
  },
  {
    id: 'portfolio-website',
    title: 'Luxury Creative Developer Portfolio',
    category: 'Frontend & Creative Engineering',
    screenshot: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
    tagline: 'Handcrafted luxury digital experience showcasing code, design & VFX.',
    techStack: ['React', 'Vite', 'Space Grotesk', 'Framer CSS', 'Glassmorphism', 'Vercel'],
    liveUrl: 'https://alltoolmaster.me/portfolio',
    githubUrl: 'https://github.com/Vansh1351/ALL-TOOL-MASTER',
    overview: 'Engineered a state-of-the-art personal showcase designed to impress recruiters at top-tier global tech and design companies.',
    features: [
      'Interactive Before/After VFX Split-Screen Comparison Sliders',
      'Smooth Sticky Navigation with live scroll progress indicator',
      'Interactive Certificate Modals and Live PDF Resume Viewers',
      '100% Responsive, Accessible, and SEO-optimized architecture'
    ],
    challenges: 'Blending high-end visual animations, video preview modals, and glassmorphism without compromising Lighthouse 95+ performance metrics.',
    solutions: 'Used pure GPU hardware-accelerated CSS keyframes, lazy component mounting, and optimized asset pipelines.',
    results: 'Flawless 60fps animations across desktop and mobile browsers with sub-second page loads.'
  },
  {
    id: 'future-ai-projects',
    title: 'Generative AI Workflow & Media Engine',
    category: 'AI Application & Automation',
    screenshot: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    tagline: 'Autonomous AI agent pipeline for video transcription and automated motion edits.',
    techStack: ['Python', 'LangChain', 'OpenAI Whisper', 'FastAPI', 'React', 'FFmpeg'],
    liveUrl: 'https://alltoolmaster.me',
    githubUrl: 'https://github.com/Vansh1351',
    overview: 'An experimental AI system that ingests raw video footage, automatically transcribes audio via Whisper, detects key highlights, and generates motion graphic overlays.',
    features: [
      'Automatic Audio Transcription & Speaker Diarization',
      'AI Highlight Extraction and Viral Short-Form Clip Snipping',
      'Automated Subtitle Burning with custom motion typography styles',
      'RESTful API API integration for automated batch processing'
    ],
    challenges: 'Handling long-form video audio rendering and synchronizing generated subtitle timestamps accurately.',
    solutions: 'Utilized Whisper word-level timestamp offsets paired with automated FFmpeg composition scripts.',
    results: 'Streamlined video post-production turnaround by 70% for short-form content creators.'
  }
];

export default function PortfolioProjects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" style={{ padding: '100px 24px' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
            <FiBriefcase size={12} /> Showcased Engineering Work
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            Featured <span className="pf-text-gradient">Projects</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Handcrafted Web Applications, AI Tools, and Creative Engineering Solutions.
          </p>
        </div>

        {/* Projects Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {PROJECTS_DATA.map((project) => (
            <div 
              key={project.id} 
              className="pf-card" 
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Banner Image Preview */}
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img 
                  src={project.screenshot} 
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  className="pf-project-img"
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}>
                  <span className="pf-badge pf-badge-purple">{project.category}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="portfolio-heading" style={{ fontSize: '22px', color: '#fff', marginBottom: '8px' }}>
                  {project.title}
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--pf-muted)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  {project.tagline}
                </p>

                {/* Tech Stack Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                  {project.techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: 'var(--pf-muted)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions Row */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pf-btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    <FiExternalLink size={14} /> Live Demo
                  </a>

                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pf-btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    <FiGithub size={14} /> GitHub
                  </a>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="pf-btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(124, 58, 237, 0.15)', borderColor: 'rgba(124, 58, 237, 0.4)', color: '#a78bfa' }}
                  >
                    <FiInfo size={14} /> Case Study
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Study Detailed Modal */}
      {selectedProject && (
        <div className="pf-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="pf-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FiX size={20} />
            </button>

            <span className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
              Detailed Case Study
            </span>

            <h2 className="portfolio-heading" style={{ fontSize: '28px', color: '#fff', marginBottom: '8px' }}>
              {selectedProject.title}
            </h2>

            <p style={{ color: 'var(--pf-muted)', fontSize: '15px', marginBottom: '24px' }}>
              {selectedProject.overview}
            </p>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <h4 style={{ color: '#00A3FF', fontWeight: 700, marginBottom: '10px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiZap /> Key Features & Capabilities
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} style={{ fontSize: '14px', color: 'var(--pf-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiCheckCircle size={14} style={{ color: '#00E5FF', shrink: 0 }} /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <h5 style={{ color: '#f87171', fontWeight: 700, marginBottom: '6px' }}>Technical Challenge</h5>
                  <p style={{ fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.5 }}>{selectedProject.challenges}</p>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <h5 style={{ color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>Architectural Solution</h5>
                  <p style={{ fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.5 }}>{selectedProject.solutions}</p>
                </div>
              </div>

              <div style={{ background: 'rgba(124, 58, 237, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                <h5 style={{ color: '#a78bfa', fontWeight: 700, marginBottom: '6px' }}>Empirical Results</h5>
                <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{selectedProject.results}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="pf-btn-primary">
                <FiExternalLink /> Visit Live Application
              </a>
              <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="pf-btn-secondary">
                <FiGithub /> Source Code
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pf-card:hover .pf-project-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
