import React from 'react';

export default function PrivacyPage() {
  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
            Effective Date: May 20, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                1. Data Collection and Usage
              </h3>
              <p>
                At All Tool Master, we respect your privacy. We do not require account registration or collection of personal details (names, physical addresses, etc.) to use our digital utility suite. We only collect the technical parameters, URLs, or files you submit to perform your requested conversions and AI tasks.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                2. File Safety and Zero-Storage Guarantee
              </h3>
              <p>
                All media files, images, PDFs, or text logs you upload are stored in isolated RAM pools on our servers during the conversion process. Once the converter or AI processing completes, the output file is generated, sent back to your browser, and <strong>immediately deleted</strong>. We do not retain, copy, or read your private files.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                3. Third-Party API Integrations
              </h3>
              <p>
                Our AI productivity suite triggers the Google Gemini API to analyze files, generate transcripts, or translate documents. When using these AI tools, your uploaded data is transmitted securely to Google's generative models solely for output transcription or summarization. We do not share your files with advertising networks.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                4. Cookies and Web Analytics
              </h3>
              <p>
                We may use basic cookies or local storage settings (e.g. to save your light/dark mode preference or locally keep your operations history). These cookies do not track cross-site browsing and contain no personally identifiable details.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                5. Contact Us
              </h3>
              <p>
                If you have questions regarding this Privacy Policy, please contact our privacy compliance desk at <a href="mailto:privacy@alltoolmaster.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>privacy@alltoolmaster.com</a>.
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
