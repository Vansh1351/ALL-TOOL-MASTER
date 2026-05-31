import React, { useState, useRef } from 'react';
import { FiArrowLeft, FiDownload, FiPlus, FiX, FiFileText, FiUser, FiBriefcase, FiBook, FiAward, FiCode } from 'react-icons/fi';

const SECTION_COLORS = {
  personal: '#0ea5e9',
  experience: '#8b5cf6',
  education: '#10b981',
  skills: '#f59e0b',
  certifications: '#ef4444',
};

function Field({ label, id, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={id} style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {props.as === 'textarea' ? (
        <textarea id={id} {...props} as={undefined} className="input-field" style={{ resize: 'vertical', fontSize: '13px', minHeight: '80px', ...props.style }} />
      ) : (
        <input id={id} {...props} className="input-field" style={{ fontSize: '13px', ...props.style }} />
      )}
    </div>
  );
}

const emptyExp = () => ({ company: '', role: '', startDate: '', endDate: '', current: false, bullets: '' });
const emptyEdu = () => ({ institution: '', degree: '', field: '', year: '' });
const emptyCert = () => ({ name: '', issuer: '', year: '' });

export default function ResumeBuilder({ tool, setView, setActiveTool, navigate }) {
  const previewRef = useRef(null);

  const [info, setInfo] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', summary: ''
  });
  const [experiences, setExperiences] = useState([emptyExp()]);
  const [educations, setEducations] = useState([emptyEdu()]);
  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState([emptyCert()]);
  const [activeSection, setActiveSection] = useState('personal');
  const [templateColor, setTemplateColor] = useState('#0ea5e9');
  const [downloading, setDownloading] = useState(false);

  // --- EXPERIENCES ---
  const updateExp = (i, key, val) => setExperiences(prev => prev.map((e, idx) => idx === i ? { ...e, [key]: val } : e));
  const addExp = () => setExperiences(prev => [...prev, emptyExp()]);
  const removeExp = (i) => setExperiences(prev => prev.filter((_, idx) => idx !== i));

  // --- EDUCATION ---
  const updateEdu = (i, key, val) => setEducations(prev => prev.map((e, idx) => idx === i ? { ...e, [key]: val } : e));
  const addEdu = () => setEducations(prev => [...prev, emptyEdu()]);
  const removeEdu = (i) => setEducations(prev => prev.filter((_, idx) => idx !== i));

  // --- CERTIFICATIONS ---
  const updateCert = (i, key, val) => setCertifications(prev => prev.map((c, idx) => idx === i ? { ...c, [key]: val } : c));
  const addCert = () => setCertifications(prev => [...prev, emptyCert()]);
  const removeCert = (i) => setCertifications(prev => prev.filter((_, idx) => idx !== i));

  // --- DOWNLOAD PDF ---
  const handleDownloadPDF = () => {
    setDownloading(true);
    const printWindow = window.open('', '_blank');
    const content = previewRef.current?.innerHTML || '';
    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>${info.name || 'Resume'} - Resume</title>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', Arial, sans-serif; color: #1e293b; background: #fff; }
        @page { margin: 12mm; }
      </style>
    </head><body>${content}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); setDownloading(false); }, 600);
  };

  // --- DOWNLOAD HTML ---
  const handleDownloadHTML = () => {
    const content = previewRef.current?.innerHTML || '';
    const full = `<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${info.name || 'Resume'}</title>
      <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: Arial, sans-serif; color: #1e293b; background: #fff; max-width: 820px; margin: 0 auto; padding: 40px 24px; }</style>
    </head><body>${content}</body></html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${info.name || 'Resume'}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#64748b'];

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'experience', label: 'Work Experience', icon: FiBriefcase },
    { id: 'education', label: 'Education', icon: FiBook },
    { id: 'skills', label: 'Skills', icon: FiCode },
    { id: 'certifications', label: 'Certifications', icon: FiAward },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 0 80px 0' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => { if (setView) setView('dashboard'); if (setActiveTool) setActiveTool(null); }}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: `linear-gradient(135deg, ${templateColor}, ${templateColor}aa)`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: `0 8px 24px ${templateColor}55`
        }}>
          <FiFileText />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '6px' }}>
          Resume <span className="text-gradient">Builder</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Fill in your details on the left. Your resume updates live on the right.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">

        {/* ===== LEFT: FORM ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Accent Color Picker */}
          <div className="glass-panel" style={{ borderRadius: '14px', padding: '16px 20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>🎨 Resume Color</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {colors.map(c => (
                <button key={c} onClick={() => setTemplateColor(c)} style={{
                  width: '30px', height: '30px', borderRadius: '50%', background: c,
                  border: templateColor === c ? '3px solid var(--text-main)' : '3px solid transparent',
                  cursor: 'pointer', transition: 'border 0.15s'
                }} />
              ))}
            </div>
          </div>

          {/* Section Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700',
                  border: `2px solid ${activeSection === s.id ? templateColor : 'var(--border-color)'}`,
                  background: activeSection === s.id ? `${templateColor}15` : 'transparent',
                  color: activeSection === s.id ? templateColor : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  <Icon size={12} /> {s.label}
                </button>
              );
            })}
          </div>

          {/* ——— Personal Info ——— */}
          {activeSection === 'personal' && (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiUser style={{ color: templateColor }} /> Personal Information
              </h3>
              <Field label="Full Name *" id="name" type="text" placeholder="e.g. John Smith" value={info.name}
                onChange={e => setInfo(p => ({ ...p, name: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Email *" id="email" type="email" placeholder="john@email.com" value={info.email}
                  onChange={e => setInfo(p => ({ ...p, email: e.target.value }))} />
                <Field label="Phone" id="phone" type="tel" placeholder="+1 555-000-0000" value={info.phone}
                  onChange={e => setInfo(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <Field label="Location" id="location" type="text" placeholder="City, Country" value={info.location}
                onChange={e => setInfo(p => ({ ...p, location: e.target.value }))} />
              <Field label="LinkedIn URL" id="linkedin" type="url" placeholder="https://linkedin.com/in/..." value={info.linkedin}
                onChange={e => setInfo(p => ({ ...p, linkedin: e.target.value }))} />
              <Field label="Portfolio / Website" id="portfolio" type="url" placeholder="https://yoursite.com" value={info.portfolio}
                onChange={e => setInfo(p => ({ ...p, portfolio: e.target.value }))} />
              <Field label="Professional Summary" id="summary" as="textarea" placeholder="Write 2-3 sentences about your professional background..." value={info.summary}
                onChange={e => setInfo(p => ({ ...p, summary: e.target.value }))} />
            </div>
          )}

          {/* ——— Work Experience ——— */}
          {activeSection === 'experience' && (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBriefcase style={{ color: templateColor }} /> Work Experience
              </h3>
              {experiences.map((exp, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                  {experiences.length > 1 && (
                    <button onClick={() => removeExp(i)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <FiX size={14} />
                    </button>
                  )}
                  <p style={{ fontSize: '12px', fontWeight: '800', color: templateColor }}>Position #{i + 1}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <Field label="Company" id={`company-${i}`} type="text" placeholder="Google Inc." value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} />
                    <Field label="Job Title" id={`role-${i}`} type="text" placeholder="Software Engineer" value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} />
                    <Field label="Start Date" id={`start-${i}`} type="text" placeholder="Jan 2022" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)} />
                    <Field label="End Date" id={`end-${i}`} type="text" placeholder="Present" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)} />
                  </div>
                  <Field label="Key Responsibilities & Achievements (one per line)" id={`bullets-${i}`} as="textarea" placeholder="• Increased system performance by 40%&#10;• Led a team of 5 engineers..." value={exp.bullets} onChange={e => updateExp(i, 'bullets', e.target.value)} style={{ minHeight: '90px' }} />
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addExp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                <FiPlus size={14} /> Add Another Position
              </button>
            </div>
          )}

          {/* ——— Education ——— */}
          {activeSection === 'education' && (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBook style={{ color: templateColor }} /> Education
              </h3>
              {educations.map((edu, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                  {educations.length > 1 && (
                    <button onClick={() => removeEdu(i)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <FiX size={14} />
                    </button>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <Field label="Institution" id={`inst-${i}`} type="text" placeholder="MIT" value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} />
                    <Field label="Degree" id={`degree-${i}`} type="text" placeholder="B.Sc. Computer Science" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} />
                    <Field label="Field of Study" id={`field-${i}`} type="text" placeholder="Computer Science" value={edu.field} onChange={e => updateEdu(i, 'field', e.target.value)} />
                    <Field label="Graduation Year" id={`year-${i}`} type="text" placeholder="2023" value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)} />
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addEdu} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                <FiPlus size={14} /> Add Another Degree
              </button>
            </div>
          )}

          {/* ——— Skills ——— */}
          {activeSection === 'skills' && (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCode style={{ color: templateColor }} /> Skills
              </h3>
              <Field label="Skills (comma separated)" id="skills" as="textarea" placeholder="React, Node.js, Python, SQL, Figma, Project Management..." value={skills} onChange={e => setSkills(e.target.value)} style={{ minHeight: '100px' }} />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Separate each skill with a comma. They will display as tags on your resume.</p>
            </div>
          )}

          {/* ——— Certifications ——— */}
          {activeSection === 'certifications' && (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiAward style={{ color: templateColor }} /> Certifications
              </h3>
              {certifications.map((cert, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                  {certifications.length > 1 && (
                    <button onClick={() => removeCert(i)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <FiX size={14} />
                    </button>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.5fr', gap: '10px' }}>
                    <Field label="Certification Name" id={`cert-${i}`} type="text" placeholder="AWS Solutions Architect" value={cert.name} onChange={e => updateCert(i, 'name', e.target.value)} />
                    <Field label="Issuing Organization" id={`issuer-${i}`} type="text" placeholder="Amazon Web Services" value={cert.issuer} onChange={e => updateCert(i, 'issuer', e.target.value)} />
                    <Field label="Year" id={`certyear-${i}`} type="text" placeholder="2024" value={cert.year} onChange={e => updateCert(i, 'year', e.target.value)} />
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addCert} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                <FiPlus size={14} /> Add Certification
              </button>
            </div>
          )}

          {/* Download Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-primary"
              onClick={handleDownloadPDF}
              disabled={downloading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '14px', fontWeight: '800', background: `linear-gradient(135deg, ${templateColor}, ${templateColor}cc)`, border: 'none' }}
            >
              <FiDownload /> {downloading ? 'Opening...' : 'Download PDF'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleDownloadHTML}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '14px', fontWeight: '800' }}
            >
              <FiFileText /> Download HTML
            </button>
          </div>
        </div>

        {/* ===== RIGHT: LIVE PREVIEW ===== */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Preview</span>
            <span style={{ fontSize: '11px', background: `${templateColor}20`, color: templateColor, padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>
              ATS Friendly
            </span>
          </div>
          <div style={{
            background: '#fff', color: '#1e293b', borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)', overflow: 'hidden',
            maxHeight: '85vh', overflowY: 'auto', fontSize: '12px'
          }}>
            <div ref={previewRef} style={{ padding: '36px 32px', fontFamily: "'Inter', Arial, sans-serif", lineHeight: '1.5' }}>
              
              {/* Header */}
              <div style={{ borderBottom: `3px solid ${templateColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                  {info.name || 'Your Full Name'}
                </h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#475569' }}>
                  {info.email && <span>✉ {info.email}</span>}
                  {info.phone && <span>📞 {info.phone}</span>}
                  {info.location && <span>📍 {info.location}</span>}
                  {info.linkedin && <span>🔗 {info.linkedin.replace('https://', '')}</span>}
                  {info.portfolio && <span>🌐 {info.portfolio.replace('https://', '')}</span>}
                </div>
              </div>

              {/* Summary */}
              {info.summary && (
                <div style={{ marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '6px' }}>
                    Professional Summary
                  </h2>
                  <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.7' }}>{info.summary}</p>
                </div>
              )}

              {/* Experience */}
              {experiences.some(e => e.company || e.role) && (
                <div style={{ marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '10px', borderBottom: `1px solid ${templateColor}33`, paddingBottom: '4px' }}>
                    Work Experience
                  </h2>
                  {experiences.filter(e => e.company || e.role).map((exp, i) => (
                    <div key={i} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>{exp.role || 'Role'}</p>
                          <p style={{ fontSize: '12px', color: templateColor, fontWeight: '600' }}>{exp.company || 'Company'}</p>
                        </div>
                        {(exp.startDate || exp.endDate) && (
                          <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                          </p>
                        )}
                      </div>
                      {exp.bullets && (
                        <ul style={{ marginTop: '6px', paddingLeft: '16px', listStyleType: 'disc' }}>
                          {exp.bullets.split('\n').filter(b => b.trim()).map((b, bi) => (
                            <li key={bi} style={{ fontSize: '11.5px', color: '#374151', marginBottom: '3px' }}>
                              {b.replace(/^[•\-\*]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {educations.some(e => e.institution || e.degree) && (
                <div style={{ marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '10px', borderBottom: `1px solid ${templateColor}33`, paddingBottom: '4px' }}>
                    Education
                  </h2>
                  {educations.filter(e => e.institution || e.degree).map((edu, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '12.5px', color: '#0f172a' }}>{edu.degree || 'Degree'}</p>
                        <p style={{ fontSize: '12px', color: '#475569' }}>{edu.institution}{edu.field ? ` · ${edu.field}` : ''}</p>
                      </div>
                      {edu.year && <p style={{ fontSize: '11px', color: '#64748b' }}>{edu.year}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {skills.trim() && (
                <div style={{ marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '10px', borderBottom: `1px solid ${templateColor}33`, paddingBottom: '4px' }}>
                    Skills
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                      <span key={i} style={{
                        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600',
                        background: `${templateColor}15`, color: templateColor, border: `1px solid ${templateColor}33`
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.some(c => c.name) && (
                <div>
                  <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '10px', borderBottom: `1px solid ${templateColor}33`, paddingBottom: '4px' }}>
                    Certifications
                  </h2>
                  {certifications.filter(c => c.name).map((cert, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a' }}>{cert.name}</span>
                        {cert.issuer && <span style={{ fontSize: '11px', color: '#64748b' }}> · {cert.issuer}</span>}
                      </div>
                      {cert.year && <span style={{ fontSize: '11px', color: '#64748b' }}>{cert.year}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .tool-page-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
