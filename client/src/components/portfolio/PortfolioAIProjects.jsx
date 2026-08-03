import React, { useState } from 'react';
import { FiCpu, FiSearch, FiExternalLink, FiZap, FiCheckCircle } from 'react-icons/fi';

const AI_PROJECTS = [
  {
    id: 'ai-1',
    title: 'AI Video Summarizer & Note Generator',
    category: 'LLM & Multimodal',
    tagline: 'Analyzes long YouTube streams and extracts structured lecture notes & timestamps.',
    tech: ['Python', 'Whisper', 'Gemini Pro', 'React', 'Express'],
    status: 'Live on Site',
    demoUrl: 'https://alltoolmaster.me'
  },
  {
    id: 'ai-2',
    title: 'Autonomous Content Agent Workflow',
    category: 'Agentic Workflows',
    tagline: 'Generates SEO articles, social banners, and audio voiceovers autonomously.',
    tech: ['LangChain', 'OpenAI API', 'ElevenLabs API', 'Node.js'],
    status: 'Prototype',
    demoUrl: 'https://alltoolmaster.me'
  },
  {
    id: 'ai-3',
    title: 'Smart PDF to Gen-Z Brainrot Translator',
    category: 'NLP & Translation',
    tagline: 'Transforms complex research PDFs into engaging, accessible summary threads.',
    tech: ['React', 'PDF.js', 'Claude 3.5 Sonnet', 'Vite'],
    status: 'Live on Site',
    demoUrl: 'https://alltoolmaster.me'
  },
  {
    id: 'ai-4',
    title: 'Client-Side WASM Background Removal Engine',
    category: 'Computer Vision',
    tagline: 'Zero-latency image background removal using ONNX runtime in browser.',
    tech: ['WebAssembly', 'ONNX Runtime', 'React', 'Canvas API'],
    status: 'Live on Site',
    demoUrl: 'https://alltoolmaster.me'
  }
];

export default function PortfolioAIProjects() {
  const [searchVal, setSearchVal] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'LLM & Multimodal', 'Agentic Workflows', 'NLP & Translation', 'Computer Vision'];

  const filteredAI = AI_PROJECTS.filter(item => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch = item.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          item.tagline.toLowerCase().includes(searchVal.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="ai-projects" style={{ padding: '100px 24px' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
            <FiCpu size={12} /> Next-Gen AI Applications
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            AI Projects & <span className="pf-text-gradient">Automations</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            Future-ready autonomous workflows, multimodal models, and browser-based AI algorithms.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '48px'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pf-muted)' }} size={18} />
            <input
              type="text"
              placeholder="Search AI projects..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px 12px 48px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={selectedCat === cat ? 'pf-btn-primary' : 'pf-btn-secondary'}
                style={{ padding: '6px 16px', fontSize: '12px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredAI.map(project => (
            <div key={project.id} className="pf-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="pf-badge pf-badge-purple">{project.category}</span>
                <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {project.status}
                </span>
              </div>

              <h3 className="portfolio-heading" style={{ fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
                {project.title}
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--pf-muted)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                {project.tagline}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {project.tech.map((t, i) => (
                  <span key={i} style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    {t}
                  </span>
                ))}
              </div>

              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="pf-btn-secondary"
                style={{ padding: '8px 14px', fontSize: '12px', justifyContent: 'center' }}
              >
                <FiZap size={14} /> Launch AI Tool
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
