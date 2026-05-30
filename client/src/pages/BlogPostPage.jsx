import React, { useEffect } from 'react';
import { BLOG_POSTS } from '../blogData';
import { TOOLS_DATA } from '../components/ToolGrid';
import { 
  FiArrowLeft, FiUser, FiCalendar, FiClock, 
  FiTwitter, FiFacebook, FiLinkedin, FiLink, FiCheck, FiExternalLink 
} from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

export default function BlogPostPage({ slug, navigate }) {
  const post = BLOG_POSTS.find(p => p.slug === slug);

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

  // Custom renderer for blog content
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, idx) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // Header 3: ### Title
      if (trimmed.startsWith('### ')) {
        return (
          <h3 
            key={idx} 
            style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              marginTop: '32px', 
              marginBottom: '12px', 
              color: 'var(--text-main)',
              letterSpacing: '-0.3px'
            }}
          >
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }
      
      // Header 2: ## Title
      if (trimmed.startsWith('## ')) {
        return (
          <h2 
            key={idx} 
            style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              marginTop: '36px', 
              marginBottom: '16px', 
              color: 'var(--text-main)',
              letterSpacing: '-0.5px'
            }}
          >
            {trimmed.replace(/^##\s+/, '')}
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
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Back Link */}
        <button 
          onClick={() => navigate('blog-list')} 
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', padding: '8px 16px' }}
        >
          <FiArrowLeft /> Back to Blog
        </button>

        {/* Article Header */}
        <header style={{ marginBottom: '40px' }}>
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
            
            {/* Share Controls */}
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }} className="share-buttons">
              <button onClick={() => handleShare('twitter')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px' }} title="Share on Twitter"><FiTwitter /></button>
              <button onClick={() => handleShare('facebook')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px' }} title="Share on Facebook"><FiFacebook /></button>
              <button onClick={() => handleShare('linkedin')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px' }} title="Share on LinkedIn"><FiLinkedin /></button>
              <button onClick={() => handleShare('copy')} className="btn-icon" style={{ width: '32px', height: '32px', fontSize: '13px' }} title="Copy Link"><FiLink /></button>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="blog-article-content" style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
          {renderMarkdown(post.content)}
        </article>

        {/* Call to Action for Related Tool */}
        {relatedTool && (
          <div 
            className="glass-panel" 
            style={{ 
              marginTop: '50px', 
              padding: '30px', 
              borderRadius: '24px', 
              border: '2px solid var(--accent-color)',
              background: 'linear-gradient(135deg, rgba(var(--accent-color-rgb), 0.05) 0%, rgba(0,0,0,0) 100%)',
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

        {/* Affiliate Marketing Banner */}
        <div 
          className="glass-panel" 
          style={{ 
            marginTop: '30px', 
            padding: '24px', 
            borderRadius: '20px', 
            border: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(103,58,183,0.03) 0%, rgba(222,75,26,0.03) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <span className="badge" style={{ marginBottom: '6px', display: 'inline-block' }}>Exclusive Web Hosting & Domain Offers</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Launch Your Next Project Today</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a 
                href={AFFILIATE_LINKS.hostinger}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  height: '36px',
                  fontSize: '12.5px',
                  background: '#673ab7',
                  borderColor: '#673ab7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none'
                }}
              >
                75% Off Hostinger <FiExternalLink size={13} />
              </a>
              <a 
                href={AFFILIATE_LINKS.namecheap}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  height: '36px',
                  fontSize: '12.5px',
                  borderColor: '#de4b1a',
                  color: '#de4b1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(222, 75, 26, 0.05)' }}
                onMouseLeave={(e) => { e.target.style.background = 'none' }}
              >
                $0.99 Domains <FiExternalLink size={13} />
              </a>
            </div>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            We've partnered with <strong>Hostinger</strong> and <strong>Namecheap</strong> to bring you the best deals on premium cloud hosting (with free SSL & domain) and secure domain registrations. Check out these developer resources!
          </p>
        </div>

      </div>
      
      <style>{`
        @media (max-width: 600px) {
          .share-buttons {
            margin-left: 0 !important;
            width: 100%;
            justify-content: flex-start;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}
