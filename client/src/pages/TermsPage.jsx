import React from 'react';

export default function TermsPage() {
  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>
            Terms of <span className="text-gradient">Service</span>
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
            Last Updated: May 20, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing or using All Tool Master ("Website", "Platform", "Service"), you agree to be bound by these Terms of Service. If you do not agree to all terms, please cease access and use of our platform immediately.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                2. User License and Conduct
              </h3>
              <p>
                All Tool Master grants you a personal, non-exclusive, non-transferable, revocable license to access our converters and AI utilities. You represent and warrant that you own or have the necessary intellectual property licenses for any files, text inputs, or URLs you upload, process, or download through our service.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                3. Prohibited Usage
              </h3>
              <p>
                You agree not to use the Service to:
              </p>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Upload or process illegal, harmful, threatening, or infringing material.</li>
                <li>Attempt to bypass file size limits, rate limits, or disrupt our backend infrastructure.</li>
                <li>Extract copyrighted media files without explicit authorization from the copyright holder.</li>
                <li>Conduct automated scraping or bot interactions with our conversion endpoints.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                4. Service Availability & Modifications
              </h3>
              <p>
                We reserve the right to modify, suspend, or discontinue any component of All Tool Master at any time without notice. We are not liable to you or any third party for adjustments, downtime, or service terminations.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                5. Indemnification
              </h3>
              <p>
                You agree to indemnify and hold harmless All Tool Master, its developers, partners, and affiliates from any claims, losses, or legal liabilities arising from your uploads, content conversions, and violation of these Terms.
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
