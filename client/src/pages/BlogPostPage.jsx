import React, { useEffect, useState } from 'react';
import { BLOG_POSTS } from '../blogData';
import { TOOLS_DATA } from '../components/ToolGrid';
import { 
  FiArrowLeft, FiUser, FiCalendar, FiClock, 
  FiTwitter, FiFacebook, FiLinkedin, FiLink, FiCheck, FiExternalLink, FiList 
} from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function BlogPostPage({ slug, navigate }) {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!post) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Post Not Found</h2>
        <button onClick={() => navigate('blog-list')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Blog
        </button>
      </div>
    );
  }

  const relatedTool = TOOLS_DATA.find(t => t.id === post.relatedToolId);

  // Generate Table of Contents items
  const headings = [];
  if (post.content) {
    post.content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const text = trimmed.replace(/^(##|###)\s+/, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({
          level: trimmed.startsWith('## ') ? 2 : 3,
          text,
          id
        });
      }
    });
  }

  // Related Posts filter (up to 3 posts in similar category or general)
  const getToolCategory = (toolId) => {
    const tool = TOOLS_DATA.find(t => t.id === toolId);
    return tool ? tool.category : 'General';
  };
  
  const currentCategory = getToolCategory(post.relatedToolId);
  const relatedPosts = BLOG_POSTS
    .filter(p => p.slug !== slug)
    .sort((a, b) => {
      const aCat = getToolCategory(a.relatedToolId);
      const bCat = getToolCategory(b.relatedToolId);
      if (aCat === currentCategory && bCat !== currentCategory) return -1;
      if (bCat === currentCategory && aCat !== currentCategory) return 1;
      return 0;
    })
    .slice(0, 3);

  // Custom renderer for blog content with IDs for TOC links
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, idx) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // Header 3: ### Title
      if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace(/^###\s+/, '');
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          <h3 
            key={idx} 
            id={id}
            style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              marginTop: '32px', 
              marginBottom: '12px', 
              color: 'var(--text-main)',
              letterSpacing: '-0.3px'
            }}
          >
            {headingText}
          </h3>
        );
      }
      
      // Header 2: ## Title
      if (trimmed.startsWith('## ')) {
        const headingText = trimmed.replace(/^##\s+/, '');
        const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          <h2 
            key={idx} 
            id={id}
            style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              marginTop: '36px', 
              marginBottom: '16px', 
              color: 'var(--text-main)',
              letterSpacing: '-0.5px'
            }}
          >
            {headingText}
          </h2>
        );
      }
      
      // Bullet list
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item, itemIdx) => (
          <li key={itemIdx} style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
            {item.replace(/^[\*\-]\s+/, '')}
          </li>
        ));
        return (
          <ul key={idx} style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'disc' }}>
            {items}
          </ul>
        );
      }
      
      // Numbered list
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map((item, itemIdx) => (
          <li key={itemIdx} style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
            {item.replace(/^\d+\.\s+/, '')}
          </li>
        ));
        return (
          <ol key={idx} style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'decimal' }}>
            {items}
          </ol>
        );
      }
      
      // Inline bold syntax parser (**text** -> strong)
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      const content = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: 'var(--text-main)', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      return (
        <p key={idx} style={{ marginBottom: '20px', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '15px' }}>
          {content}
        </p>
      );
    });
  };

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const shareText = post.title;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ padding: '40px 0 80px 0', position: 'relative' }} className="animate-fade-in">
      
      {/* Sticky Social Share Sidebar (Desktop Only) */}
      <div className="sticky-share-bar">
        <button onClick={() => handleShare('twitter')} className="btn-icon" title="Share on Twitter" style={{ background: 'var(--bg-card)', marginBottom: '8px' }}><FiTwitter /></button>
        <button onClick={() => handleShare('facebook')} className="btn-icon" title="Share on Facebook" style={{ background: 'var(--bg-card)', marginBottom: '8px' }}><FiFacebook /></button>
        <button onClick={() => handleShare('linkedin')} className="btn-icon" title="Share on LinkedIn" style={{ background: 'var(--bg-card)', marginBottom: '8px' }}><FiLinkedin /></button>
        <button onClick={() => handleShare('copy')} className="btn-icon" title="Copy Link" style={{ background: 'var(--bg-card)', color: copied ? '#10b981' : 'inherit' }}>
          {copied ? <FiCheck /> : <FiLink />}
        </button>
      </div>

      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Back Link */}
        <button 
          onClick={() => navigate('blog-list')} 
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', padding: '8px 16px' }}
        >
          <FiArrowLeft /> Back to Blog
        </button>

        {/* Article Header */}
        <header style={{ marginBottom: '32px' }}>
          <span className="badge" style={{ marginBottom: '8px' }}>{currentCategory} Tutorial</span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.3', marginBottom: '20px', letterSpacing: '-0.5px' }}>
            {post.title}
          </h1>

          {/* Author/Date/Read Time Metadata Row */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            fontSize: '13.5px', 
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '20px',
            alignItems: 'center'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiUser /> {post.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCalendar /> {post.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiClock /> {post.readTime}
            </span>
            
            {/* Inline Share Controls for Mobile */}
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }} className="mobile-only-share">
              <button onClick={() => handleShare('twitter')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px' }} title="Share on Twitter"><FiTwitter /></button>
              <button onClick={() => handleShare('facebook')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px' }} title="Share on Facebook"><FiFacebook /></button>
              <button onClick={() => handleShare('linkedin')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px' }} title="Share on LinkedIn"><FiLinkedin /></button>
              <button onClick={() => handleShare('copy')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px', color: copied ? '#10b981' : 'inherit' }} title="Copy Link">
                {copied ? <FiCheck /> : <FiLink />}
              </button>
            </div>
          </div>
        </header>

        {/* Layout Grid: Content + Table of Contents */}
        <div className="blog-layout-grid">
          
          {/* Main Article Content */}
          <div className="blog-main-content">
            
            {/* Table of Contents (Mobile/Inline view) */}
            {headings.length > 0 && (
              <div className="glass-panel inline-toc-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiList /> Table of Contents
                </h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {headings.map((h, i) => (
                    <li 
                      key={i} 
                      onClick={() => scrollToHeading(h.id)}
                      style={{ 
                        fontSize: '13.5px', 
                        cursor: 'pointer', 
                        color: 'var(--accent-color)', 
                        paddingLeft: h.level === 3 ? '16px' : '0',
                        textDecoration: 'underline'
                      }}
                    >
                      {h.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <article className="blog-article-content" style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              {renderMarkdown(post.content)}
            </article>
          </div>

          {/* Table of Contents Sidebar (Desktop Only) */}
          {headings.length > 0 && (
            <aside className="desktop-toc-sidebar">
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiList /> Contents
                </h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {headings.map((h, i) => (
                    <li 
                      key={i} 
                      onClick={() => scrollToHeading(h.id)}
                      style={{ 
                        fontSize: '13px', 
                        cursor: 'pointer', 
                        color: 'var(--text-muted)', 
                        paddingLeft: h.level === 3 ? '12px' : '0',
                        lineHeight: '1.4',
                        transition: '0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                      {h.text}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

        </div>

        {/* Call to Action for Related Tool */}
        {relatedTool && (
          <div 
            className="glass-panel" 
            style={{ 
              marginTop: '50px', 
              padding: '30px', 
              borderRadius: '24px', 
              border: '2px solid var(--accent-color)',
              background: 'linear-gradient(135deg, rgba(34,211,238,0.03) 0%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${relatedTool.color}15`,
                color: relatedTool.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {React.createElement(relatedTool.icon)}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Try the {relatedTool.title} online</h3>
                <span className="badge" style={{ marginTop: '2px', display: 'inline-block' }}>{relatedTool.category}</span>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
              {relatedTool.desc} Use our premium browser utility for instant watermark-free processing with no registration required.
            </p>

            <button 
              className="btn btn-primary" 
              onClick={() => navigate('tool-page', relatedTool)}
              style={{ width: 'fit-content', padding: '10px 24px', alignSelf: 'flex-start' }}
            >
              Open Free Tool Now &rarr;
            </button>
          </div>
        )}

        {/* Affiliate Marketing Banner (Namecheap Only, Hostinger Removed) */}
        <div 
          className="glass-panel" 
          style={{ 
            marginTop: '30px', 
            padding: '24px', 
            borderRadius: '20px', 
            border: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(222,75,26,0.03) 0%, rgba(0,0,0,0.01) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <span className="badge" style={{ marginBottom: '6px', display: 'inline-block', background: 'rgba(222, 75, 26, 0.1)', color: '#de4b1a' }}>Verified Domain Partner Offer</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Register Your Custom Domain</h3>
            </div>
            <div>
              <a 
                href={AFFILIATE_LINKS.namecheap}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  height: '38px',
                  fontSize: '13px',
                  background: '#de4b1a',
                  borderColor: '#de4b1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none'
                }}
              >
                Claim Namecheap Discount <FiExternalLink size={13} />
              </a>
            </div>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            We've partnered with <strong>Namecheap</strong> to provide secure domain registrations starting at just $0.99 with lifetime free privacy protection. Point your domain directly to Vercel or GitHub!
          </p>
        </div>

        {/* Related Articles Footer */}
        <section style={{ marginTop: '60px', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Related Tutorials</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {relatedPosts.map(p => (
              <div 
                key={p.slug}
                className="glass-panel" 
                style={{ padding: '24px', borderRadius: '18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px' }}
                onClick={() => {
                  if (p.isAffiliateReview) {
                    navigate('namecheap-review');
                  } else {
                    navigate('blog-post', null, p.slug);
                  }
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{p.date}</span>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '800', lineHeight: '1.4', marginBottom: '8px' }}>{p.title}</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{p.excerpt}</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-color)', marginTop: '16px', display: 'inline-block' }}>
                  Read Article &rarr;
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        .blog-layout-grid {
          display: flex;
          gap: 40px;
        }
        .blog-main-content {
          flex: 1;
          min-width: 0;
        }
        .desktop-toc-sidebar {
          width: 250px;
          flex-shrink: 0;
        }
        .sticky-share-bar {
          position: fixed;
          top: 30%;
          left: 40px;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }
        @media (max-width: 1200px) {
          .sticky-share-bar {
            display: none;
          }
        }
        @media (min-width: 1024px) {
          .inline-toc-panel {
            display: none !important;
          }
          .mobile-only-share {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .desktop-toc-sidebar {
            display: none !important;
          }
          .blog-layout-grid {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
