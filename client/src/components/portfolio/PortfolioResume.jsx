import React from 'react';
import { FiFileText, FiDownload, FiCheckCircle, FiUser, FiBriefcase, FiCpu, FiAward, FiPrinter } from 'react-icons/fi';

export default function PortfolioResume() {

  const handleDownload = (format) => {
    // Generate text/file content download dynamically or trigger print
    if (format === 'PDF') {
      window.print();
    } else {
      const resumeText = `
VANSH HEMANSHU SHAH - CREATIVE DEVELOPER & AI ENGINEER
Email: vhshah1711@gmail.com | Phone: +91 98209 01789 | Website: https://alltoolmaster.me/portfolio

SUMMARY:
Creative Developer and Full Stack AI Engineer specializing in React, Next.js, Motion Graphics, Video Editing, VFX, and Generative AI applications.

SKILLS:
- Programming: HTML, CSS, JavaScript, TypeScript, React 19, Next.js, Python, Java, Git
- Creative & Video: Adobe Premiere Pro, After Effects, Photoshop, Illustrator, Audition
- VFX & 3D: Autodesk Maya, Foundry Nuke, Silhouette FX, Motion Graphics
- AI: ChatGPT, Gemini, Claude, Prompt Engineering, LangChain, AI Automation

PROJECTS:
1. All Tool Master (https://alltoolmaster.me) - AI File Converter & Downloader Platform
2. Smart Attendance Management System - Biometric & Dynamic QR Tracking App
3. Creative Portfolio Showcase - Luxury Digital Experience

EXPERIENCE & CERTIFICATIONS:
- Creator & Lead Architect, All Tool Master (2024 - Present)
- Arena Animation Certified Professional (2023 - 2024)
`;
      const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vansh_Shah_Resume.${format.toLowerCase()}`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section id="resume" style={{ padding: '100px 24px' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
            <FiFileText size={12} /> Professional Resume
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            Curriculum <span className="pf-text-gradient">Vitae</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Preview my full interactive resume online or download offline copies for recruiters.
          </p>
        </div>

        {/* Action Download Buttons Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '48px'
        }}>
          <button onClick={() => handleDownload('PDF')} className="pf-btn-primary">
            <FiDownload size={16} /> Download PDF Resume
          </button>

          <button onClick={() => handleDownload('DOCX')} className="pf-btn-secondary">
            <FiDownload size={16} /> Download DOCX Format
          </button>

          <button onClick={() => window.print()} className="pf-btn-purple">
            <FiPrinter size={16} /> Print / Save PDF
          </button>
        </div>

        {/* Formatted Interactive Resume View Container */}
        <div 
          className="pf-card" 
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '48px',
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(0, 163, 255, 0.2)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Resume Header */}
          <div style={{
            borderBottom: '2px solid rgba(0, 163, 255, 0.3)',
            paddingBottom: '24px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 className="portfolio-heading" style={{ fontSize: '32px', color: '#fff', fontWeight: 800 }}>
                VANSH HEMANSHU SHAH
              </h1>
              <p style={{ color: '#00E5FF', fontWeight: 700, fontSize: '16px', marginTop: '4px' }}>
                Creative Developer • Motion Graphics Artist • AI Engineer
              </p>
            </div>

            <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.6 }}>
              <div>Email: vhshah1711@gmail.com</div>
              <div>Phone: +91 98209 01789</div>
              <div>Location: Mumbai, India</div>
              <div>Web: alltoolmaster.me/portfolio</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', color: '#00A3FF', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Executive Summary
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--pf-muted)', lineHeight: 1.7 }}>
              Highly versatile <strong>Creative Developer</strong> with extensive expertise in full-stack web engineering (React, Next.js, Node.js), visual post-production (After Effects, Premiere Pro), VFX compositing (Maya, Nuke), and Generative AI workflows. Proven track record of architecting scalable applications like All Tool Master with 95+ Lighthouse performance scores.
            </p>
          </div>

          {/* Section 2: Technical & Creative Core Competencies */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', color: '#00A3FF', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Core Technical Competencies
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '13px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Frontend Engineering</strong>
                <span style={{ color: 'var(--pf-muted)' }}>React 19, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Creative & Motion Design</strong>
                <span style={{ color: 'var(--pf-muted)' }}>Adobe After Effects, Premiere Pro, Photoshop, Illustrator, Audition, Kinetic Typography</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>VFX & 3D Production</strong>
                <span style={{ color: 'var(--pf-muted)' }}>Autodesk Maya, Foundry Nuke, Silhouette FX, Matchmoving, 3D Tracking</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>AI & Systems</strong>
                <span style={{ color: 'var(--pf-muted)' }}>OpenAI API, Gemini Pro, Claude 3.5, Prompt Engineering, Python, Express Node.js</span>
              </div>
            </div>
          </div>

          {/* Section 3: Key Experience & Projects */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', color: '#00A3FF', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Featured Experience & Projects
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                  <span>Founder & Lead Engineer — All Tool Master Platform</span>
                  <span style={{ color: '#00E5FF', fontFamily: 'var(--font-mono)' }}>2024 - Present</span>
                </div>
                <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.6 }}>
                  <li>Engineered 15+ browser-based AI conversion & downloading utilities serving global users.</li>
                  <li>Achieved 95+ Lighthouse performance, SEO, and accessibility benchmarks.</li>
                </ul>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                  <span>Motion & VFX Specialist — Freelance & Arena Projects</span>
                  <span style={{ color: '#00E5FF', fontFamily: 'var(--font-mono)' }}>2023 - 2024</span>
                </div>
                <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.6 }}>
                  <li>Produced commercial video reels, rotoscoping setups, and green-screen composites.</li>
                  <li>Delivered over 50+ video edits with focus on retention and visual quality.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
