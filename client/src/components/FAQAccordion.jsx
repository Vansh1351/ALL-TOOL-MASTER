import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ_ITEMS = [
  {
    question: "What is All Tool Master?",
    answer: "All Tool Master is an all-in-one free digital toolbox. It offers high-speed file conversion, a universal media URL video downloader, and an automated AI note-taking app to streamline daily online productivity tasks without installing any software."
  },
  {
    question: "Is it safe to convert files and download videos here?",
    answer: "Yes. All Tool Master processes file conversions and video downloads securely through your browser session. Uploaded data is processed strictly for your active utility command and is not stored or shared on external servers."
  },
  {
    question: "How does the online file converter work?",
    answer: "Simply drop your document, image, audio, or video into the tool, select your target file format (like PDF to Word, WebP to JPG, or MP4 to MP3), and click convert. The file format utility processes the conversion immediately for a quick download."
  },
  {
    question: "Can the AI Note Taker summarize long documents?",
    answer: "Yes. The free AI note generator tool can ingest long text files, web articles, and lecture transcripts to produce bulleted study notes, short summaries, or automated minutes of meetings in seconds."
  },
  {
    question: "Is All Tool Master really free to use?",
    answer: "Yes, All Tool Master is completely free. We do not require any credit cards, registrations, or monthly subscriptions. You can convert files, run AI tools, and paste video links to download media 100% free of charge."
  },
  {
    question: "What file formats does the universal converter support?",
    answer: "Our online file converter supports popular formats including MP4, MOV, MP3, WAV, JPG, PNG, PDF, DOCX, and ZIP. You can convert between them bidirectionally (e.g. MP4 to MP3, JPG to PNG/PDF, DOCX to PDF, ZIP extraction, and more) in high quality."
  },
  {
    question: "Do you store or log my uploaded files on your server?",
    answer: "No, security is our primary focus. All uploaded files are processed locally on our secure backend and immediately deleted once the conversion is completed and sent back to you. We do not inspect, log, or store your private files."
  },
  {
    question: "How does the AI transcription and meeting summary tool work?",
    answer: "Our AI suite utilizes Google Gemini models. It transcribes audio/video uploads and uses generative LLM analysis to draft detailed lecture notes, formal meeting minutes, action items, or summaries instantly."
  },
  {
    question: "Can I download videos in HD quality?",
    answer: "Yes, our URL downloader fetches video feeds directly from platforms like YouTube, Vimeo, Facebook, and Instagram. You can select your desired maximum quality (up to HD 720p/1080p where available) or export them directly to audio (MP3)."
  },
  {
    question: "Is there a limit on file upload size?",
    answer: "Yes, to ensure high speed and server availability, we limit individual file uploads to 100MB per process. For larger media files, we recommend compressing them before uploading."
  }
];

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section style={{ padding: '40px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800' }}>
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Everything you need to know about our online converters, URL downloaders, and AI utilities.
          </p>
        </div>

        {/* Accordion Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="glass-panel"
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderColor: isOpen ? 'var(--accent-color)' : 'var(--border-color)',
                }}
                onClick={() => toggleFAQ(idx)}
              >
                {/* FAQ Header */}
                <div style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  userSelect: 'none'
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: isOpen ? 'var(--accent-color)' : 'var(--text-main)' }}>
                    {faq.question}
                  </h4>
                  {isOpen ? <FiChevronUp style={{ color: 'var(--accent-color)' }} /> : <FiChevronDown style={{ color: 'var(--text-muted)' }} />}
                </div>

                {/* FAQ Body */}
                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px'
                  }} className="animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
