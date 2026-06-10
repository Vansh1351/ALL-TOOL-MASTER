import React from 'react';
import { FiCheckCircle, FiShield, FiCpu, FiTrendingUp, FiUser, FiMail, FiGlobe } from 'react-icons/fi';

export default function AboutPage() {
  const features = [
    {
      icon: FiCpu,
      title: "AI-Powered Automation",
      desc: "We harness Google Gemini AI to transcribe audio, analyze documents, generate meeting minutes, and summarize videos — all in seconds with no manual effort."
    },
    {
      icon: FiShield,
      title: "Privacy by Design",
      desc: "Files are uploaded to temporary RAM pools, processed in isolated server environments, and permanently deleted immediately after download. We never store user files."
    },
    {
      icon: FiTrendingUp,
      title: "No Signups, No Paywalls",
      desc: "Every tool on All Tool Master is 100% free with zero subscription screens, credit card requirements, or account creation. Access everything instantly."
    }
  ];

  const stats = [
    { value: "14+", label: "Free Tools" },
    { value: "100%", label: "Free Forever" },
    { value: "0", label: "Data Stored" },
    { value: "2026", label: "Year Founded" },
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge">About All Tool Master</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px' }}>
            Free Tools Built for <span className="text-gradient">Everyone</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px', maxWidth: '680px', margin: '12px auto 0 auto' }}>
            All Tool Master is a free online productivity platform offering file converters, video downloaders, AI note-takers, and utility tools — with no signups, no watermarks, and no paywalls.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-color)' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Our Story</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.8', marginBottom: '16px' }}>
            All Tool Master was founded in 2026 by Vansh Shah, a developer and content creator based in Mumbai, India. The idea was simple: there are far too many online tools that demand sign-ups, show aggressive ads, add watermarks to converted files, or lock the most useful features behind paywalls.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.8', marginBottom: '16px' }}>
            Vansh set out to build a single platform where anyone — students transcribing their lectures, professionals converting meeting recordings into formatted minutes, creators downloading and repurposing social media clips, or freelancers compiling documents — could get the job done in seconds without barriers.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.8', marginBottom: '20px' }}>
            The result is All Tool Master: a browser-based suite powered by a Node.js backend (using FFmpeg for media processing and Sharp for images), integrated directly with Google Gemini AI for intelligent transcription, summarization, and note generation. Every tool runs on secure servers, processes files in isolated memory, and destroys all data immediately after your download — no exceptions.
          </p>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-muted)',
                color: 'var(--accent-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
              }}>
                <FiUser />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '2px' }}>Founded by <span className="text-gradient">Vansh Shah</span></h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                  Based in Mumbai, India — passionate about building tools that simplify everyday digital workflows. Connect on{' '}
                  <a href="https://www.linkedin.com/in/vansh-shah-824926291/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>LinkedIn</a>
                  {' '}or{' '}
                  <a href="https://www.youtube.com/@VANSHSHAH-india" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>YouTube</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--accent-muted)',
                  color: 'var(--accent-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginBottom: '16px'
                }}>
                  <Icon />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Our Commitment */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Our Commitment to You</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              "We will never charge you for any tool on this platform — all tools are free forever.",
              "We do not sell, share, or store any of your uploaded files or personal data.",
              "Your files are processed and immediately deleted after download — no cloud storage, no retention.",
              "All tools work without creating an account or entering a payment method.",
              "No watermarks are ever added to your converted or downloaded files.",
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                <FiCheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', textAlign: 'center', background: 'linear-gradient(135deg, var(--accent-muted) 0%, transparent 100%)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Have a Question or Suggestion?</h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            We'd love to hear from you. Reach out via our contact page for support, feature requests, or business inquiries.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px' }}>
                <FiMail /> Contact Us
              </button>
            </a>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px' }}>
                <FiGlobe /> Browse All Tools
              </button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
