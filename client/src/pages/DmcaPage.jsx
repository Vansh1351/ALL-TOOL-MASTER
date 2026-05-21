import React from 'react';

export default function DmcaPage() {
  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>
            DMCA Copyright <span className="text-gradient">Policy</span>
          </h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
            Effective Date: May 20, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            
            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                1. Overview of DMCA Compliance
              </h3>
              <p>
                All Tool Master respects the intellectual property rights of creators and copyright holders. In compliance with the Digital Millennium Copyright Act (DMCA), we respond rapidly to formal claims of copyright infringement submitted via the instructions below.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                2. User-Driven Processing and Hosting Policy
              </h3>
              <p>
                All Tool Master is an automated transit service. We do **not** host, store, index, or distribute user-submitted files or downloaded videos. All conversions and download requests are performed dynamically on-the-fly and deleted immediately upon transfer. Because we hold no media files on our servers, there is no permanent content repository to block or remove.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                3. Submitting a Notice of Copyright Infringement
              </h3>
              <p>
                If you are a copyright owner and believe our tools are being utilized to retrieve or convert your copyrighted materials without authorization, please submit a written DMCA Notice containing:
              </p>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the infringed copyright.</li>
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>Information reasonably sufficient to permit us to contact you, such as address, telephone, and email.</li>
                <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner or the law.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                4. DMCA Contact
              </h3>
              <p>
                Please email formal DMCA requests directly to: <a href="mailto:dmca@alltoolmaster.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>dmca@alltoolmaster.com</a>.
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
