import React from 'react';

export default function CookiePolicy() {
  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>

          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Cookie <span className="text-gradient">Policy</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '30px' }}>
            Last Updated: June 12, 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                1. What Are Cookies?
              </h3>
              <p>
                Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently, provide a better browsing experience, and supply information to website owners. Cookies can be "persistent" (remain on your device until deleted) or "session-based" (deleted when you close your browser).
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                2. How We Use Cookies
              </h3>
              <p style={{ marginBottom: '12px' }}>
                All Tool Master uses minimal cookies to provide a functional and user-friendly experience. We categorize our cookie usage as follows:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>Essential Cookies</h4>
                  <p style={{ fontSize: '13px' }}>
                    These cookies are necessary for the website to function properly. They include cookies that store your theme preference (dark/light mode), Gemini API key (stored securely in localStorage), tool history, and bookmarked tools. Without these, certain features of the platform would not work correctly.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>Analytics Cookies</h4>
                  <p style={{ fontSize: '13px' }}>
                    We may use analytics services (such as Google Analytics or Vercel Analytics) to understand how visitors interact with our website. These cookies collect information about which pages you visit, how long you spend on each page, and any errors encountered. This data is aggregated and anonymized — we cannot identify individual users from analytics data.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>Advertising Cookies</h4>
                  <p style={{ fontSize: '13px' }}>
                    If we display advertisements through Google AdSense or similar networks, these services may set cookies to show you relevant ads based on your browsing history. These are third-party cookies managed by the advertising network, not by All Tool Master. You can opt out of personalized advertising through your Google Ad Settings or through the Digital Advertising Alliance's opt-out page.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                3. Third-Party Cookies
              </h3>
              <p>
                Some pages on our platform may include embedded content or links to third-party services (such as YouTube videos, affiliate partner websites, or social media platforms). These third parties may set their own cookies when you interact with their content. We have no control over the cookies set by third-party services and recommend reviewing their individual cookie policies.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                4. Local Storage
              </h3>
              <p>
                In addition to cookies, All Tool Master uses browser localStorage to store user preferences and settings. This includes your Gemini API key (for AI-powered tools), theme preference, tool usage history, and bookmarked tools. Unlike cookies, localStorage data is not sent to our servers with every request — it remains entirely on your device and is only accessed by our client-side application.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                5. Managing Cookies
              </h3>
              <p style={{ marginBottom: '12px' }}>
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>View all cookies stored on your device and delete them individually or in bulk.</li>
                <li>Block all cookies or only third-party cookies.</li>
                <li>Set your browser to notify you before a cookie is placed.</li>
                <li>Delete all cookies when you close your browser.</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                Please note that blocking essential cookies may affect the functionality of certain features on All Tool Master, such as theme preferences, tool history, and API key storage.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                6. Updates to This Policy
              </h3>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. When we make significant changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                7. Contact Us
              </h3>
              <p>
                If you have any questions about our use of cookies, please contact us at{' '}
                <a href="mailto:vhshah1711@gmail.com" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>vhshah1711@gmail.com</a>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
