import React, { useState } from 'react';
import { FiCode, FiFilm, FiLayers, FiCpu, FiCheck, FiCheckCircle, FiGlobe, FiTerminal, FiLayout, FiImage, FiVideo } from 'react-icons/fi';

const SKILL_CATEGORIES = [
  {
    id: 'programming',
    title: 'Programming & Web Tech',
    icon: FiCode,
    badge: 'Frontend & Systems',
    color: '#00A3FF',
    skills: [
      { name: 'HTML5 / Semantic Web', level: 'Expert', desc: 'SEO, Accessibility (a11y), Schema markup', icon: FiGlobe },
      { name: 'CSS3 / Vanilla / Grid', level: 'Expert', desc: 'Custom design tokens, Flexbox, Keyframes', icon: FiLayout },
      { name: 'JavaScript (ES6+)', level: 'Advanced', desc: 'Async/Await, DOM, Event loops, Canvas', icon: FiCode },
      { name: 'TypeScript', level: 'Advanced', desc: 'Strict types, Generics, Interfaces', icon: FiCode },
      { name: 'React.js 19', level: 'Advanced', desc: 'Custom hooks, Context, Virtual DOM', icon: FiCode },
      { name: 'Next.js (App Router)', level: 'Advanced', desc: 'SSR, SSG, Route handlers, Vercel edge', icon: FiGlobe },
      { name: 'Python', level: 'Intermediate', desc: 'Scripting, Automation, AI pipelines', icon: FiTerminal },
      { name: 'Java', level: 'Intermediate', desc: 'OOP principles, Data structures', icon: FiCode },
      { name: 'Git & GitHub', level: 'Advanced', desc: 'Version control, Branching, Actions', icon: FiTerminal }
    ]
  },
  {
    id: 'creative',
    title: 'Creative & Video Editing',
    icon: FiFilm,
    badge: 'Post-Production',
    color: '#7C3AED',
    skills: [
      { name: 'Adobe After Effects', level: 'Expert', desc: 'Motion graphics, Kinetic text, Expression scripts', icon: FiFilm },
      { name: 'Adobe Premiere Pro', level: 'Expert', desc: 'Multi-cam cutting, Color grading, Sound design', icon: FiVideo },
      { name: 'Adobe Photoshop', level: 'Expert', desc: 'Thumbnails, Matte painting, Asset prep', icon: FiImage },
      { name: 'Adobe Illustrator', level: 'Advanced', desc: 'Vector logo design, SVG illustrations', icon: FiLayout },
      { name: 'Adobe Audition', level: 'Advanced', desc: 'Noise reduction, Voiceover mastering', icon: FiFilm }
    ]
  },
  {
    id: 'vfx',
    title: 'VFX & 3D Animation',
    icon: FiLayers,
    badge: 'Visual Effects',
    color: '#00E5FF',
    skills: [
      { name: 'Autodesk Maya', level: 'Advanced', desc: '3D modeling, Lighting, Texturing, Rigging', icon: FiLayers },
      { name: 'Foundry Nuke', level: 'Advanced', desc: 'Node-based compositing, Keying, Tracking', icon: FiLayers },
      { name: 'Silhouette FX', level: 'Expert', desc: 'High-precision rotoscoping, Paint cleanup', icon: FiLayers },
      { name: 'Motion Graphics', level: 'Expert', desc: 'Commercial promo animation, Infographics', icon: FiFilm }
    ]
  },
  {
    id: 'ai',
    title: 'AI & Automation Workflows',
    icon: FiCpu,
    badge: 'Generative AI',
    color: '#10b981',
    skills: [
      { name: 'ChatGPT & OpenAI API', level: 'Advanced', desc: 'Function calling, System prompts, Fine-tuning', icon: FiCpu },
      { name: 'Google Gemini AI', level: 'Advanced', desc: 'Multimodal processing, Context analysis', icon: FiCpu },
      { name: 'Claude (Anthropic)', level: 'Advanced', desc: 'Complex reasoning, Code synthesis', icon: FiCpu },
      { name: 'Prompt Engineering', level: 'Expert', desc: 'Zero-shot, Few-shot, Chain-of-thought prompts', icon: FiCpu },
      { name: 'AI Automation & Agents', level: 'Advanced', desc: 'Workflow triggers, Scraping, Auto summarizers', icon: FiCpu }
    ]
  }
];

export default function PortfolioSkills() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredCategories = activeTab === 'all' 
    ? SKILL_CATEGORIES 
    : SKILL_CATEGORIES.filter(c => c.id === activeTab);

  return (
    <section id="skills" style={{ padding: '100px 24px', background: 'rgba(5, 8, 22, 0.4)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="pf-badge pf-badge-cyan" style={{ marginBottom: '12px' }}>
            <FiCpu size={12} /> Tech Stack & Tools
          </div>
          <h2 className="portfolio-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800' }}>
            Technical & Creative <span className="pf-text-gradient">Skillset</span>
          </h2>
          <p style={{ color: 'var(--pf-muted)', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px' }}>
            A comprehensive suite of modern frameworks, video software, VFX tools, and AI workflows.
          </p>
        </div>

        {/* Category Selector Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '48px'
        }}>
          <button
            onClick={() => setActiveTab('all')}
            className={activeTab === 'all' ? 'pf-btn-primary' : 'pf-btn-secondary'}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            All Skills
          </button>
          {SKILL_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={isActive ? 'pf-btn-primary' : 'pf-btn-secondary'}
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                <Icon size={14} /> {cat.title}
              </button>
            );
          })}
        </div>

        {/* Skills Grid per Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {filteredCategories.map(cat => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="pf-card" style={{ padding: '36px' }}>
                
                {/* Category Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: `${cat.color}15`,
                      border: `1px solid ${cat.color}40`,
                      borderRadius: '10px',
                      padding: '10px',
                      color: cat.color
                    }}>
                      <CatIcon size={20} />
                    </div>
                    <h3 className="portfolio-heading" style={{ fontSize: '22px', color: '#fff' }}>{cat.title}</h3>
                  </div>
                  <span className="pf-badge" style={{ borderColor: cat.color, color: cat.color }}>
                    {cat.badge}
                  </span>
                </div>

                {/* Skill Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '20px'
                }}>
                  {cat.skills.map((skill, idx) => {
                    const SkillIcon = skill.icon || FiCheck;
                    return (
                      <div 
                        key={idx} 
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '14px',
                          padding: '18px',
                          transition: 'all 0.25s ease'
                        }}
                        className="pf-skill-card"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <SkillIcon size={18} style={{ color: cat.color }} />
                            <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 700 }}>{skill.name}</h4>
                          </div>
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--pf-muted)', lineHeight: 1.5, marginBottom: '10px' }}>
                          {skill.desc}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiCheckCircle size={12} style={{ color: cat.color }} />
                          <span style={{ fontSize: '11px', color: cat.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .pf-skill-card:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(0, 163, 255, 0.3) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
