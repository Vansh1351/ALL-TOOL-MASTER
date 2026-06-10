import React, { useState } from 'react';
import { BLOG_POSTS } from '../blogData';
import { TOOLS_DATA } from '../components/ToolGrid';
import { FiCalendar, FiClock, FiUser, FiArrowRight } from 'react-icons/fi';

export default function BlogListPage({ navigate, category }) {
  const categoryMap = {
    'all': 'All',
    'downloader': 'Downloader',
    'converter': 'Converter',
    'ai-tools': 'AI Tool',
    'productivity': 'Productivity',
    'web-hosting': 'Web Hosting'
  };

  const getToolCategory = (toolId) => {
    if (toolId === 'web-hosting') return 'Web Hosting';
    const tool = TOOLS_DATA.find(t => t.id === toolId);
    if (!tool) return 'General';
    return tool.category === 'Utility' ? 'Productivity' : tool.category;
  };

  const activeLabel = categoryMap[category] || 'All';

  const filteredPosts = activeLabel === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => getToolCategory(post.relatedToolId) === activeLabel);

  const categories = [
    { label: 'All', slug: 'all' },
    { label: 'Converter', slug: 'converter' },
    { label: 'Downloader', slug: 'downloader' },
    { label: 'AI Tool', slug: 'ai-tools' },
    { label: 'Productivity', slug: 'productivity' },
    { label: 'Web Hosting', slug: 'web-hosting' }
  ];

  const handleCategoryClick = (catSlug) => {
    navigate('blog-list', null, null, catSlug);
  };

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Title / Hero */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge">Tutorials & Guides</span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', marginTop: '12px' }}>
            All Tool Master <span className="text-gradient">Blog Hub</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '16px' }}>
            Step-by-step guides, walkthroughs, and solutions for online converters, video downloading, and AI note-taking.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`btn ${activeLabel === cat.label ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blog Post Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {filteredPosts.map(post => {
            const cat = getToolCategory(post.relatedToolId);
            return (
              <div
                key={post.slug}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '20px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid var(--border-color)'
                }}
                onClick={() => {
                  if (post.isAffiliateReview) {
                    navigate('namecheap-review');
                  } else {
                    navigate('blog-post', null, post.slug);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div>
                  {/* Metadata & Category */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge" style={{ fontSize: '11px' }}>{cat}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock /> {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', lineHeight: '1.4' }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Info */}
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <FiUser /> <span>{post.author}</span>
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Read Article <FiArrowRight />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
