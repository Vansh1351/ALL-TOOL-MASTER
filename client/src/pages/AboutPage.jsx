import React from 'react';
import { FiCheckCircle, FiShield, FiCpu, FiTrendingUp } from 'react-icons/fi';

export default function AboutPage() {
  const features = [
    {
      icon: FiCpu,
      title: "AI-Powered Automation",
      desc: "We harness models like Gemini to transribe, analyze, and outline documents, audio, and video recordings in seconds."
    },
    {
      icon: FiShield,
      title: "Security & Confidentiality",
      desc: "All files upload to secure RAM pools, convert in isolated environments, and are permanently wiped after processing."
    },
    {
      icon: FiTrendingUp,
      title: "No Signups, No Limitations",
      desc: "We believe tools should be readily accessible. No subscription screens, credit cards, or account requirements."
    }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge">Who We Are</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px' }}>
            Empowering Productivity through <span className="text-gradient">Universal Tools</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px' }}>
            All Tool Master provides free AI-powered conversion and productivity tools for creators, students, professionals, and businesses.
          </p>
        </div>

        {/* Story details */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
            In the modern digital workspace, tasks are fragmented. Creators struggle with format mismatching; students juggle lecture transcribing; and professionals lose hours summarizing meeting logs. All Tool Master was built to consolidate these routines into a single, unified web suite.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
            By combining high-speed Node.js conversion pipelines (powered by FFmpeg and Sharp) with state-of-the-art AI intelligence, we allow you to download, convert, extract, and summarize any digital media in a couple of clicks.
          </p>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Founded by <span className="text-gradient">Vansh Shah</span></h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.7' }}>
              Based in Mumbai, India — Vansh is passionate about building tools that simplify everyday digital workflows. Connect on{' '}
              <a href="https://www.linkedin.com/in/vansh-shah-824926291/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>LinkedIn</a>{' '}or{' '}
              <a href="https://www.youtube.com/@VANSHSHAH-india" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>YouTube</a>.
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
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

      </div>
    </div>
  );
}
