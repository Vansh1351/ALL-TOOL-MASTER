import React from 'react';
import { FiCheck, FiX, FiExternalLink, FiEdit, FiShield } from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function GrammarlyDeal() {
  const pros = [
    "Real-time spelling and grammar corrections",
    "Smart tone adjustments for different audiences",
    "Generative AI for drafting, summarizing, and outline creation",
    "Integrates with Gmail, Google Docs, Word, and Slack",
    "Free version corrects basic punctuation errors",
    "Built-in plagiarism detector for students and academics"
  ];

  const cons = [
    "Premium features require a paid subscription",
    "Offline desktop app can sometimes feel resource-heavy",
    "AI draft suggestions have weekly limits on cheaper plans"
  ];

  const features = [
    { title: "Grammar & Punctuation", desc: "Instantly highlights and fixes typos, misplaced commas, run-on sentences, and basic spelling slipups." },
    { title: "Tone Enhancement", desc: "Analyze your message style to ensure it sounds formal, confident, helpful, or direct depending on goals." },
    { title: "AI Writer (GrammarlyGO)", desc: "Type a prompt to quickly compose outlines, rewrite paragraphs, summarize long email threads, or generate copy." },
    { title: "Plagiarism Checker", desc: "Compare your text against billions of online web pages and databases to ensure original content layouts." }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span>Home</span> &gt; <span>Deals</span> &gt; <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Grammarly</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge">Verified Writing Partnership</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px', lineHeight: '1.2' }}>
            Perfect Your Writing With Grammarly AI Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>
            Elevate your emails, essays, code documentations, and copy. Learn how Grammarly's AI-driven platform corrects grammar, improves clarity, and fine-tunes your tone.
          </p>
        </div>

        {/* Affiliate Disclaimer */}
        <div style={{
          background: 'rgba(34, 211, 238, 0.05)',
          borderLeft: '4px solid var(--accent-color)',
          padding: '16px 20px',
          borderRadius: '0 12px 12px 0',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          <strong>Affiliate Disclaimer:</strong> All Tool Master is supported by referral links. If you sign up or purchase plans using our links, we may receive a commission at no extra cost to you.
        </div>

        {/* Overview Card */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Why Choose Grammarly?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
              Grammarly is the world's leading writing assistant. Used by millions of students, marketers, and developers worldwide, Grammarly checks your text in real-time to prevent embarrassing spelling mistakes, clarify dense passages, and format professional correspondence.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', marginBottom: '6px', color: '#11a683' }}>{feat.title}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={AFFILIATE_LINKS.grammarly} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#11a683', borderColor: '#11a683', padding: '14px 28px', fontSize: '15.5px' }}>
              Try Grammarly For Free <FiExternalLink size={16} />
            </a>
            <a href="/blog/grammarly-vs-quillbot-comparison" className="btn btn-secondary" style={{ padding: '14px 28px' }}>
              Compare Grammarly vs QuillBot
            </a>
          </div>
        </div>

        {/* Pros & Cons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheck /> The Pros
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pros.map((pro, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  <FiCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiX /> The Cons
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cons.map((con, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  <FiX style={{ color: '#ef4444', flexShrink: 0, marginTop: '3px' }} />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
