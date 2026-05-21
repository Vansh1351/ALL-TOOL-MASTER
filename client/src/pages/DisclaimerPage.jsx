import React from 'react';

export default function DisclaimerPage() {
  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>
            Legal <span className="text-gradient">Disclaimer</span>
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
            Effective Date: May 20, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                1. "As-Is" Service Warranty
              </h3>
              <p>
                All Tool Master provides its platform, including file converters, video downloaders, and AI utilities, on an "AS IS" and "AS AVAILABLE" basis. We make no express or implied warranties or representations regarding the operation of our platform, the accuracy of its results, or file integrity.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                2. AI Accuracy Disclaimer
              </h3>
              <p>
                Our AI productivity suite relies on third-party large language models (Google Gemini API) to generate meeting minutes, summaries, and transcripts. Generative AI may occasionally produce inaccurate, incomplete, or biased information (often termed "hallucinations"). You should independently verify any critical action items, notes, or transcriptions before relying on them.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                3. Download Content Liability
              </h3>
              <p>
                Our URL downloader and MP4 converter tools operate solely as user-directed transit proxies. All Tool Master does not host, cache, index, or pre-verify any video files or audio streams retrieved from YouTube, Vimeo, or other social platforms. Users are entirely responsible for securing intellectual property clearance and rights before downloading external media.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                4. Limitation of Liability
              </h3>
              <p>
                In no event shall All Tool Master, its developers, or contributors be liable for any direct, indirect, incidental, special, or consequential damages (including loss of data, profits, file corruptions, or server downtime) arising from the use of our services.
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
