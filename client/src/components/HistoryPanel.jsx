import React from 'react';
import { FiTrash2, FiClock, FiDownload, FiLayers } from 'react-icons/fi';

export default function HistoryPanel({ history, clearHistory }) {
  if (!history || history.length === 0) return null;

  return (
    <div style={{ padding: '20px 0 40px 0' }}>
      <div className="container">
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
          
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiClock style={{ color: 'var(--accent-color)' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Recent Operations History</h3>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={clearHistory}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: '#ef4444',
                color: '#ef4444'
              }}
            >
              <FiTrash2 /> Clear All
            </button>
          </div>

          {/* History List */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            maxHeight: '300px',
            overflowY: 'auto'
          }} className="history-list">
            {history.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', overflow: 'hidden' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--accent-muted)',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FiLayers size={14} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-color)', fontWeight: '700', textTransform: 'uppercase' }}>
                      {item.toolTitle}
                    </span>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}>
                      {item.fileName}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>
                    {item.timestamp}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: item.type === 'ai-report' ? '#8b5cf6' : '#10b981',
                    marginTop: '2px',
                    display: 'block'
                  }}>
                    {item.type === 'ai-report' ? 'AI Complete' : 'Downloaded'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
