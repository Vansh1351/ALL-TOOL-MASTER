import React from 'react';
import { FiCheck, FiX, FiExternalLink, FiVolume2, FiMic, FiSliders, FiGlobe } from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function ElevenLabsDeal() {
  const pros = [
    "Most realistic neural AI voices in the industry",
    "Instant voice cloning with just a 10-second sample",
    "Multilingual speech synthesis supporting 29+ languages",
    "Free plan available with 10,000 characters monthly",
    "Professional voice cloning for high-fidelity duplicates",
    "Built-in automatic video translation and dubbing"
  ];

  const cons = [
    "Commercial rights require a paid plan (starting at $5/mo)",
    "Character credits can go fast on long-form audiobook projects",
    "Professional voice cloning takes several hours to train"
  ];

  const features = [
    { title: "Text To Speech", desc: "Convert any text into high-fidelity lifelike spoken audio with natural breathing inflections." },
    { title: "Voice Cloning", desc: "Create an instant voice replica using brief samples or train a professional voice duplicate." },
    { title: "Dubbing & Translation", desc: "Automatically translate videos into other languages while retaining your unique vocal identity." },
    { title: "Audiobook Creation", desc: "Build multi-chapter narrative voice tracks with custom pronunciation dictionaries." },
    { title: "Podcast Voice Gen", desc: "Generate intro narrations, advertisements, or scale podcast episodes internationally." }
  ];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span>Home</span> &gt; <span>Deals</span> &gt; <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>ElevenLabs</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <span className="badge">Verified AI Audio Partnership</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px', lineHeight: '1.2' }}>
            Get Started With ElevenLabs AI Voice Generator
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>
            Create realistic AI voices, voiceovers, dubbing, podcasts, and audiobooks using ElevenLabs. Learn how to generate human-like synthetic speech for your content creation workflow.
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
          <strong>Affiliate Disclaimer:</strong> All Tool Master is supported by referral links. If you sign up or purchase plans using our links, we may receive a commission at no extra cost to you. This helps support our free browser utilities!
        </div>

        {/* ElevenLabs Overview Card */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>Why Choose ElevenLabs?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
              ElevenLabs is the industry-leading generative speech platform. It uses advanced neural networks to analyze context and render synthetic voices with emotional variety, proper breathing pauses, and natural cadences. Whether you are generating promotional video voiceovers or publishing audiobooks, ElevenLabs is the most realistic tool available.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: '800', marginBottom: '6px', color: '#d97706' }}>{feat.title}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{feat.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={AFFILIATE_LINKS.elevenlabs} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#d97706', borderColor: '#d97706', padding: '14px 28px', fontSize: '15.5px' }}>
              Start Free With ElevenLabs <FiExternalLink size={16} />
            </a>
            <a href="/blog/best-ai-voice-generator-2026" className="btn btn-secondary" style={{ padding: '14px 28px' }}>
              Read Deep-Dive Guide
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

        {/* Quick Tutorial Section */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiSliders style={{ color: '#d97706' }} /> How to Create Voiceovers in 3 Steps
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
            You can create natural-sounding AI speech with ElevenLabs in under three minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800' }}>Choose Your Model & Voice</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Select the flagship "Eleven Multilingual v3" model and pick a voice character from the list of defaults or community library.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800' }}>Paste Script and Tune Settings</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Input your script text. Adjust the Stability slider (45-55% is ideal) and Clarity enhancement to customize inflections and emotional variation.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '800' }}>Generate and Download</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Click "Generate" and download the final high-definition voiceover file to add to your video editor or audiobook player.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', background: 'linear-gradient(135deg, #78350f 0%, #1c1917 100%)', border: 'none' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>Create Realistic AI Voices Today</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Scale your narration speed, localise videos into 29+ languages in your own voice, and eliminate audio recording bottlenecks with ElevenLabs.
          </p>
          <a href={AFFILIATE_LINKS.elevenlabs} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ background: '#ffffff', color: '#0f172a', border: 'none', padding: '14px 32px', fontSize: '16px', fontWeight: '800' }}>
            Start Free With ElevenLabs &rarr;
          </a>
        </div>

      </div>
    </div>
  );
}
