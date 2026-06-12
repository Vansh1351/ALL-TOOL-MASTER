import React from 'react';
import { BLOG_POSTS } from '../blogData';
import { FiUser, FiCode, FiVideo, FiGlobe, FiLinkedin, FiYoutube, FiMail, FiArrowRight, FiAward, FiBriefcase, FiBookOpen, FiTarget, FiCheckCircle } from 'react-icons/fi';

export default function AuthorPage({ navigate }) {
  const skills = [
    { icon: FiCode, label: 'Web Development', desc: 'React, Node.js, JavaScript, Vite, Vercel' },
    { icon: FiVideo, label: 'VFX & Motion Design', desc: 'After Effects, Blender, DaVinci Resolve' },
    { icon: FiGlobe, label: 'SEO & Content', desc: 'Technical SEO, Blog Writing, Keyword Research' },
    { icon: FiBriefcase, label: 'AI Integration', desc: 'Google Gemini API, OpenRouter, Prompt Engineering' },
  ];

  const timeline = [
    { year: '2026', title: 'Founded All Tool Master', desc: 'Launched a free, all-in-one online tool suite featuring file converters, AI note-takers, and productivity utilities.' },
    { year: '2026', title: 'BCA Program', desc: 'Pursuing Bachelor of Computer Applications while building production-grade SaaS tools and gaining hands-on experience in full-stack development.' },
    { year: '2025', title: 'VFX & Content Creation', desc: 'Started creating visual effects, motion graphics, and educational content on YouTube, building a foundation in digital media production.' },
    { year: '2024', title: 'Web Development Journey', desc: 'Began learning HTML, CSS, JavaScript, and React. Built multiple projects and transitioned into Node.js backend development.' },
  ];

  const articles = BLOG_POSTS || [];

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>

        {/* Author Header */}
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--accent-color) 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              color: '#fff',
              fontWeight: '900',
              flexShrink: 0
            }}>
              VS
            </div>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <span className="badge" style={{ marginBottom: '8px', display: 'inline-block' }}>Founder & Author</span>
              <h1 style={{ fontSize: '34px', fontWeight: '800', margin: '8px 0 4px 0' }}>
                Vansh <span className="text-gradient">Shah</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                BCA Student • VFX Artist • Web Developer • AI Tools Enthusiast
              </p>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="https://www.linkedin.com/in/vansh-shah-824926291/" target="_blank" rel="noopener noreferrer"
                  className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  <FiLinkedin /> LinkedIn
                </a>
                <a href="https://www.youtube.com/@VANSHSHAH-india" target="_blank" rel="noopener noreferrer"
                  className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  <FiYoutube /> YouTube
                </a>
                <a href="mailto:vhshah1711@gmail.com"
                  className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  <FiMail /> Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiBookOpen style={{ color: 'var(--accent-color)' }} /> About Me
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
            <p>
              I'm Vansh Shah — a developer, content creator, and AI tools enthusiast based in Mumbai, India. I'm currently pursuing my Bachelor of Computer Applications (BCA) while building production-grade web applications and free utility tools for the internet.
            </p>
            <p>
              I founded <strong style={{ color: 'var(--text-main)' }}>All Tool Master</strong> in 2026 with a simple mission: to create a single, free platform where students, creators, freelancers, and professionals can convert files, download videos, generate AI-powered notes, build resumes, and handle everyday digital tasks — without signups, paywalls, or aggressive advertising.
            </p>
            <p>
              My background combines web development (React, Node.js, JavaScript) with visual effects and motion graphics (After Effects, Blender). This dual expertise allows me to build tools that are not only functionally powerful but also beautifully designed and intuitive to use.
            </p>
            <p>
              I write extensively about AI productivity tools, file conversion techniques, design software comparisons, and online productivity workflows. Every article on All Tool Master is personally researched, written, and fact-checked by me to ensure accuracy and real-world usefulness.
            </p>
          </div>
        </div>

        {/* Skills Grid */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiAward style={{ color: 'var(--accent-color)' }} /> Skills & Expertise
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {skills.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'var(--accent-muted)', color: 'var(--accent-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', marginBottom: '12px'
                  }}>
                    <Icon />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{skill.label}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{skill.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiBriefcase style={{ color: 'var(--accent-color)' }} /> Experience & Journey
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '16px', paddingBottom: i < timeline.length - 1 ? '24px' : '0',
                borderLeft: i < timeline.length - 1 ? '2px solid var(--border-color)' : '2px solid transparent',
                marginLeft: '8px', paddingLeft: '20px', position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', left: '-7px', top: '4px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: 'var(--accent-color)', border: '2px solid var(--bg-main)'
                }} />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.year}</span>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '4px 0 6px 0' }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="glass-panel" style={{
          padding: '32px', borderRadius: '20px', marginBottom: '32px',
          background: 'linear-gradient(135deg, var(--accent-muted) 0%, transparent 100%)'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiTarget style={{ color: 'var(--accent-color)' }} /> My Mission
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'Build free, high-quality tools that remove paywalls from everyday digital tasks.',
              'Create educational content that helps students and creators use AI tools effectively.',
              'Maintain complete transparency about data handling — your files are never stored.',
              'Keep All Tool Master ad-free, open, and accessible to everyone regardless of budget.',
              'Continuously improve and expand the platform based on real user feedback.'
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
                <FiCheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles by Vansh */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>
            Articles by <span className="text-gradient">Vansh Shah</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginLeft: '12px' }}>({articles.length} articles)</span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {articles.slice(0, 12).map((post, i) => (
              <a
                key={i}
                href={`/blog/${post.slug}`}
                onClick={(e) => { e.preventDefault(); if (navigate) navigate('blog-post', null, post.slug); else window.history.pushState({}, '', `/blog/${post.slug}`); window.location.reload(); }}
                className="glass-panel"
                style={{
                  padding: '20px', borderRadius: '14px', textDecoration: 'none',
                  color: 'inherit', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: '700', lineHeight: '1.4' }}>{post.title}</h4>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </a>
            ))}
          </div>
          {articles.length > 12 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <a
                href="/blog"
                onClick={(e) => { e.preventDefault(); if (navigate) navigate('blog-list'); }}
                style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                View All {articles.length} Articles <FiArrowRight />
              </a>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Want to Connect?</h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            For collaborations, questions, or business inquiries — feel free to reach out.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" onClick={(e) => { e.preventDefault(); if (navigate) navigate('contact'); }} style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px' }}>
                <FiMail /> Contact Me
              </button>
            </a>
            <a href="/" onClick={(e) => { e.preventDefault(); if (navigate) navigate('dashboard'); }} style={{ textDecoration: 'none' }}>
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
