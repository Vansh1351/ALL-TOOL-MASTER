import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  FiArrowLeft, FiDownload, FiPlus, FiX, FiFileText, FiUser, 
  FiBriefcase, FiBook, FiAward, FiCode, FiZap, FiTrash2,
  FiLinkedin, FiGithub, FiYoutube, FiInstagram, FiTwitter, FiFacebook, FiGlobe, FiVideo
} from 'react-icons/fi';

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

const getSocialIcon = (platform, color = 'currentColor', size = 12) => {
  const props = { size, style: { display: 'inline-block', verticalAlign: 'middle', marginRight: '4px', color } };
  switch (platform) {
    case 'linkedin': return <FiLinkedin {...props} />;
    case 'github': return <FiGithub {...props} />;
    case 'youtube': return <FiYoutube {...props} />;
    case 'instagram': return <FiInstagram {...props} />;
    case 'twitter': return <FiTwitter {...props} />;
    case 'facebook': return <FiFacebook {...props} />;
    case 'tiktok': return <FiVideo {...props} />;
    case 'website': return <FiGlobe {...props} />;
    default: return <FiGlobe {...props} />;
  }
};

export default function ResumeBuilder({ tool, setView, setActiveTool, navigate }) {
  const previewRef = useRef(null);

  const [info, setInfo] = useState({
    name: '', title: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', summary: ''
  });
  const [experiences, setExperiences] = useState([emptyExp()]);
  const [educations, setEducations] = useState([emptyEdu()]);
  const [skills, setSkills] = useState('');
  const [certifications, setCertifications] = useState([emptyCert()]);
  const [activeSection, setActiveSection] = useState('personal');
  const [templateColor, setTemplateColor] = useState('#0ea5e9');
  const [template, setTemplate] = useState('modern');
  const [customLinks, setCustomLinks] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [enhancing, setEnhancing] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const [socials, setSocials] = useState([
    { platform: 'linkedin', value: '' },
    { platform: 'github', value: '' }
  ]);

  const addSocial = () => setSocials(prev => [...prev, { platform: 'linkedin', value: '' }]);
  const updateSocialPlatform = (idx, platform) => setSocials(prev => prev.map((s, i) => i === idx ? { ...s, platform } : s));
  const updateSocialValue = (idx, value) => setSocials(prev => prev.map((s, i) => i === idx ? { ...s, value } : s));
  const deleteSocial = (idx) => setSocials(prev => prev.filter((_, i) => i !== idx));

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState('bullets');

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

  // --- CUSTOM LINKS ---
  const handleUpdateCustomLink = (idx, key, val) => {
    setCustomLinks(prev => prev.map((lnk, i) => i === idx ? { ...lnk, [key]: val } : lnk));
  };

  // --- CUSTOM SECTIONS ---
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      alert('Please enter a section title.');
      return;
    }
    const cleanTitle = newSectionTitle.trim();
    if (customSections.some(cs => cs.title.toLowerCase() === cleanTitle.toLowerCase()) || 
        ['personal', 'experience', 'education', 'skills', 'certifications'].includes(cleanTitle.toLowerCase())) {
      alert('A section with this name already exists.');
      return;
    }
    const id = `custom-${Date.now()}`;
    const newSection = {
      id,
      title: cleanTitle,
      type: newSectionType,
      items: newSectionType === 'bullets' ? [{ title: '', subtitle: '', date: '', bullets: '' }] : newSectionType === 'tags' ? '' : ''
    };
    setCustomSections(prev => [...prev, newSection]);
    setActiveSection(id);
    setNewSectionTitle('');
    setNewSectionType('bullets');
  };

  const handleDeleteCustomSection = (id) => {
    if (confirm('Are you sure you want to delete this section? All its contents will be lost.')) {
      setCustomSections(prev => prev.filter(cs => cs.id !== id));
      setActiveSection('personal');
    }
  };

  const handleUpdateCustomText = (sectionId, value) => {
    setCustomSections(prev => prev.map(cs => cs.id === sectionId ? { ...cs, items: value } : cs));
  };

  const handleUpdateCustomTags = (sectionId, value) => {
    setCustomSections(prev => prev.map(cs => cs.id === sectionId ? { ...cs, items: value } : cs));
  };

  const handleAddCustomBulletItem = (sectionId) => {
    setCustomSections(prev => prev.map(cs => {
      if (cs.id === sectionId) {
        return { ...cs, items: [...cs.items, { title: '', subtitle: '', date: '', bullets: '' }] };
      }
      return cs;
    }));
  };

  const handleRemoveCustomBulletItem = (sectionId, itemIdx) => {
    setCustomSections(prev => prev.map(cs => {
      if (cs.id === sectionId) {
        return { ...cs, items: cs.items.filter((_, idx) => idx !== itemIdx) };
      }
      return cs;
    }));
  };

  const handleUpdateCustomBulletItem = (sectionId, itemIdx, key, value) => {
    setCustomSections(prev => prev.map(cs => {
      if (cs.id === sectionId) {
        const newItems = cs.items.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item);
        return { ...cs, items: newItems };
      }
      return cs;
    }));
  };

  // --- AI RESUME ENHANCEMENT ---
  const enhanceTextWithAI = async (text, toolType, onComplete) => {
    if (!text.trim()) {
      alert("Please enter some text first before enhancing.");
      return;
    }
    const apiKey = localStorage.getItem('gemini_api_key') || '';
    const formData = new FormData();
    formData.append('tool', toolType);
    formData.append('textContent', text);
    if (apiKey && apiKey.length > 10 && !apiKey.toLowerCase().includes('your_')) {
      formData.append('apiKey', apiKey);
    }

    const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
    const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');
    const rawBackupUrl = import.meta.env.VITE_BACKUP_API_URL || '';
    const BACKUP_URL = rawBackupUrl ? rawBackupUrl.replace(/\/+$/, '') : '';

    const tryRequest = async (baseUrl) => axios.post(`${baseUrl}/api/ai`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    try {
      let response;
      try {
        response = await tryRequest(BACKEND_URL);
      } catch (err) {
        if (BACKUP_URL && BACKUP_URL !== BACKEND_URL) {
          response = await tryRequest(BACKUP_URL);
        } else throw err;
      }
      if (response.data.result) {
        onComplete(response.data.result.trim());
      } else {
        throw new Error("No result returned from AI.");
      }
    } catch (err) {
      console.error(err);
      let msg = 'AI enhancement failed. Please check your network or API key settings.';
      if (err.response?.data?.error) msg = err.response.data.error;
      else if (err.message) msg = err.message;
      alert(msg);
    }
  };

  const handleEnhanceSummary = async () => {
    if (!info.summary.trim()) {
      alert("Please write a draft in the Professional Summary first, then click Enhance to improve it.");
      return;
    }
    setEnhancing('summary');
    await enhanceTextWithAI(info.summary, 'ai-resume-enhance-summary', (enhanced) => {
      setInfo(p => ({ ...p, summary: enhanced }));
    });
    setEnhancing(null);
  };

  const handleEnhanceExperience = async (idx) => {
    const exp = experiences[idx];
    if (!exp.bullets.trim()) {
      alert("Please write some bullet points or description first, then click Enhance to improve it.");
      return;
    }
    setEnhancing(`exp-${idx}`);
    await enhanceTextWithAI(exp.bullets, 'ai-resume-enhance-experience', (enhanced) => {
      updateExp(idx, 'bullets', enhanced);
    });
    setEnhancing(null);
  };

  const handleEnhanceCustomSectionItem = async (sectionId, itemIdx) => {
    const section = customSections.find(cs => cs.id === sectionId);
    const item = section.items[itemIdx];
    if (!item.bullets.trim()) {
      alert("Please write some details or points first, then click Enhance to improve it.");
      return;
    }
    setEnhancing(`custom-${sectionId}-${itemIdx}`);
    await enhanceTextWithAI(item.bullets, 'ai-resume-enhance-experience', (enhanced) => {
      setCustomSections(prev => prev.map(cs => {
        if (cs.id === sectionId) {
          const newItems = cs.items.map((it, idx) => idx === itemIdx ? { ...it, bullets: enhanced } : it);
          return { ...cs, items: newItems };
        }
        return cs;
      }));
    });
    setEnhancing(null);
  };

  // --- DOWNLOAD PDF ---
  const handleDownloadPDF = () => {
    setDownloading(true);
    const printWindow = window.open('', '_blank');
    const content = previewRef.current?.innerHTML || '';
    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>${info.name || 'Resume'} - Resume</title>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', Arial, sans-serif; color: #1e293b; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @page { margin: 12mm; }
        .experience-item, .education-item, .custom-section-item { page-break-inside: avoid; break-inside: avoid; }
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

  const baseSections = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'experience', label: 'Work Experience', icon: FiBriefcase },
    { id: 'education', label: 'Education', icon: FiBook },
    { id: 'skills', label: 'Skills', icon: FiCode },
    { id: 'certifications', label: 'Certifications', icon: FiAward },
  ];

  const sections = [
    ...baseSections,
    ...customSections.map(cs => ({
      id: cs.id,
      label: cs.title,
      icon: cs.type === 'bullets' ? FiBriefcase : cs.type === 'tags' ? FiCode : FiFileText,
      isCustom: true
    })),
    { id: 'add-section', label: '+ Add Section', icon: FiPlus }
  ];

  const cleanUrl = (url) => {
    if (!url) return '';
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
  };

  // --- TEMPLATE RENDERERS ---
  const renderTemplateContent = () => {
    if (template === 'minimalist') return renderMinimalistTemplate();
    if (template === 'elegant') return renderElegantTemplate();
    if (template === 'sidebar') return renderSidebarTemplate();
    return renderModernTemplate();
  };

  const renderModernTemplate = () => {
    return (
      <div style={{ fontFamily: "'Inter', Arial, sans-serif", color: '#1e293b' }}>
        {/* Header */}
        <div style={{ borderBottom: `3px solid ${templateColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {info.name || 'Your Full Name'}
          </h1>
          {info.title && (
            <p style={{ fontSize: '14px', fontWeight: '600', color: templateColor, marginBottom: '8px' }}>
              {info.title}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#475569' }}>
            {info.email && <span>✉ {info.email}</span>}
            {info.phone && <span>📞 {info.phone}</span>}
            {info.location && <span>📍 {info.location}</span>}
            {socials.map((soc, idx) => (
              soc.value && (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {getSocialIcon(soc.platform, templateColor, 12)}
                  {cleanUrl(soc.value)}
                </span>
              )
            ))}
            {customLinks.map((lnk, idx) => (
              lnk.label && lnk.value && <span key={idx}>▪ {lnk.label}: {lnk.value}</span>
            ))}
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
          <div style={{ marginBottom: '18px' }} className="experience-item">
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
          <div style={{ marginBottom: '18px' }} className="education-item">
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
          <div style={{ marginBottom: '18px' }}>
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

        {/* Custom Sections */}
        {customSections.map(cs => {
          if (cs.type === 'text' && cs.items.trim()) {
            return (
              <div key={cs.id} style={{ marginBottom: '18px' }} className="custom-section-item">
                <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '10px', borderBottom: `1px solid ${templateColor}33`, paddingBottom: '4px' }}>
                  {cs.title}
                </h2>
                <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.7' }}>{cs.items}</p>
              </div>
            );
          }
          if (cs.type === 'tags' && cs.items.trim()) {
            return (
              <div key={cs.id} style={{ marginBottom: '18px' }} className="custom-section-item">
                <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '10px', borderBottom: `1px solid ${templateColor}33`, paddingBottom: '4px' }}>
                  {cs.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cs.items.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600',
                      background: `${templateColor}15`, color: templateColor, border: `1px solid ${templateColor}33`
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          if (cs.type === 'bullets' && cs.items.some(item => item.title)) {
            return (
              <div key={cs.id} style={{ marginBottom: '18px' }} className="custom-section-item">
                <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: templateColor, marginBottom: '10px', borderBottom: `1px solid ${templateColor}33`, paddingBottom: '4px' }}>
                  {cs.title}
                </h2>
                {cs.items.filter(item => item.title).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>{item.title}</p>
                        {item.subtitle && <p style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>{item.subtitle}</p>}
                      </div>
                      {item.date && (
                        <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {item.date}
                        </p>
                      )}
                    </div>
                    {item.bullets && (
                      <ul style={{ marginTop: '6px', paddingLeft: '16px', listStyleType: 'disc' }}>
                        {item.bullets.split('\n').filter(b => b.trim()).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '11.5px', color: '#374151', marginBottom: '3px' }}>
                            {b.replace(/^[•\-\*]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const renderMinimalistTemplate = () => {
    return (
      <div style={{ fontFamily: "'Inter', Arial, sans-serif", color: '#1e293b', lineHeight: '1.4' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '2px', letterSpacing: '-0.5px' }}>
            {info.name || 'Your Full Name'}
          </h1>
          {info.title && (
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {info.title}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', fontSize: '10.5px', color: '#64748b' }}>
            {info.email && <span>{info.email}</span>}
            {info.phone && <span>• {info.phone}</span>}
            {info.location && <span>• {info.location}</span>}
            {socials.map((soc, idx) => (
              soc.value && (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  •&nbsp;{getSocialIcon(soc.platform, '#475569', 11)}
                  {cleanUrl(soc.value)}
                </span>
              )
            ))}
            {customLinks.map((lnk, idx) => (
              lnk.label && lnk.value && <span key={idx}>• {lnk.label}: {lnk.value}</span>
            ))}
          </div>
        </div>

        {/* Summary */}
        {info.summary && (
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '4px' }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: '11px', color: '#374151' }}>{info.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.some(e => e.company || e.role) && (
          <div style={{ marginBottom: '14px' }} className="experience-item">
            <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
              Work Experience
            </h2>
            {experiences.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a' }}>{exp.role || 'Role'}</span>
                    <span style={{ fontSize: '11.5px', color: '#475569' }}> — {exp.company || 'Company'}</span>
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                    </span>
                  )}
                </div>
                {exp.bullets && (
                  <ul style={{ marginTop: '3px', paddingLeft: '12px', listStyleType: 'square' }}>
                    {exp.bullets.split('\n').filter(b => b.trim()).map((b, bi) => (
                      <li key={bi} style={{ fontSize: '11px', color: '#374151', marginBottom: '2px' }}>
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
          <div style={{ marginBottom: '14px' }} className="education-item">
            <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
              Education
            </h2>
            {educations.filter(e => e.institution || e.degree).map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '11.5px', color: '#0f172a' }}>{edu.degree || 'Degree'}</span>
                  <span style={{ fontSize: '11px', color: '#475569' }}>, {edu.institution}{edu.field ? ` in ${edu.field}` : ''}</span>
                </div>
                {edu.year && <span style={{ fontSize: '10px', color: '#64748b' }}>{edu.year}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.trim() && (
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                <span key={i} style={{
                  padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px',
                  border: '1px solid #cbd5e1', color: '#374151'
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.some(c => c.name) && (
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
              Certifications
            </h2>
            {certifications.filter(c => c.name).map((cert, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <div style={{ fontSize: '11px', color: '#374151' }}>
                  <span style={{ fontWeight: '700' }}>{cert.name}</span>
                  {cert.issuer && <span> — {cert.issuer}</span>}
                </div>
                {cert.year && <span style={{ fontSize: '10px', color: '#64748b' }}>{cert.year}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Custom Sections */}
        {customSections.map(cs => {
          if (cs.type === 'text' && cs.items.trim()) {
            return (
              <div key={cs.id} style={{ marginBottom: '14px' }} className="custom-section-item">
                <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '4px' }}>
                  {cs.title}
                </h2>
                <p style={{ fontSize: '11px', color: '#374151' }}>{cs.items}</p>
              </div>
            );
          }
          if (cs.type === 'tags' && cs.items.trim()) {
            return (
              <div key={cs.id} style={{ marginBottom: '14px' }} className="custom-section-item">
                <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
                  {cs.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {cs.items.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px',
                      border: '1px solid #cbd5e1', color: '#374151'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          if (cs.type === 'bullets' && cs.items.some(item => item.title)) {
            return (
              <div key={cs.id} style={{ marginBottom: '14px' }} className="custom-section-item">
                <h2 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '6px' }}>
                  {cs.title}
                </h2>
                {cs.items.filter(item => item.title).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '11.5px', color: '#0f172a' }}>{item.title}</span>
                        {item.subtitle && <span style={{ fontSize: '11px', color: '#475569' }}> ({item.subtitle})</span>}
                      </div>
                      {item.date && (
                        <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.bullets && (
                      <ul style={{ marginTop: '3px', paddingLeft: '12px', listStyleType: 'square' }}>
                        {item.bullets.split('\n').filter(b => b.trim()).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '11px', color: '#374151', marginBottom: '2px' }}>
                            {b.replace(/^[•\-\*]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const renderElegantTemplate = () => {
    const headingStyle = {
      fontFamily: "Georgia, serif",
      fontSize: '13px',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: templateColor,
      textAlign: 'center',
      borderBottom: `1px solid ${templateColor}`,
      paddingBottom: '4px',
      marginBottom: '10px'
    };

    return (
      <div style={{ fontFamily: "'Inter', Arial, sans-serif", color: '#1e293b', lineHeight: '1.6' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: '28px', fontWeight: '400', color: '#0f172a', marginBottom: '4px' }}>
            {info.name || 'Your Full Name'}
          </h1>
          {info.title && (
            <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#64748b', marginBottom: '10px' }}>
              {info.title}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', fontSize: '11px', color: '#475569' }}>
            {info.email && <span>{info.email}</span>}
            {info.phone && <span>• {info.phone}</span>}
            {info.location && <span>• {info.location}</span>}
            {socials.map((soc, idx) => (
              soc.value && (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  •&nbsp;{getSocialIcon(soc.platform, templateColor, 11)}
                  {cleanUrl(soc.value)}
                </span>
              )
            ))}
            {customLinks.map((lnk, idx) => (
              lnk.label && lnk.value && <span key={idx}>• {lnk.label}: {lnk.value}</span>
            ))}
          </div>
        </div>

        {/* Summary */}
        {info.summary && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={headingStyle}>Professional Summary</h2>
            <p style={{ fontSize: '12px', color: '#374151', textAlign: 'justify' }}>{info.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.some(e => e.company || e.role) && (
          <div style={{ marginBottom: '20px' }} className="experience-item">
            <h2 style={headingStyle}>Work Experience</h2>
            {experiences.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontFamily: "Georgia, serif", fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{exp.role || 'Role'}</span>
                    <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}> — {exp.company || 'Company'}</span>
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                    </span>
                  )}
                </div>
                {exp.bullets && (
                  <ul style={{ marginTop: '4px', paddingLeft: '18px', listStyleType: 'circle' }}>
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
          <div style={{ marginBottom: '20px' }} className="education-item">
            <h2 style={headingStyle}>Education</h2>
            {educations.filter(e => e.institution || e.degree).map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontFamily: "Georgia, serif", fontWeight: '700', fontSize: '12.5px', color: '#0f172a' }}>{edu.degree || 'Degree'}</span>
                  <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>, {edu.institution}{edu.field ? ` · ${edu.field}` : ''}</span>
                </div>
                {edu.year && <span style={{ fontSize: '11px', color: '#64748b' }}>{edu.year}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.trim() && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={headingStyle}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              {skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                <span key={i} style={{
                  padding: '4px 12px', fontSize: '11px', color: '#374151', borderBottom: `2px solid ${templateColor}`,
                  fontFamily: "Georgia, serif", fontStyle: 'italic'
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.some(c => c.name) && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={headingStyle}>Certifications</h2>
            {certifications.filter(c => c.name).map((cert, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <div style={{ fontSize: '12px', color: '#374151' }}>
                  <span style={{ fontFamily: "Georgia, serif", fontWeight: '700' }}>{cert.name}</span>
                  {cert.issuer && <span> — {cert.issuer}</span>}
                </div>
                {cert.year && <span style={{ fontSize: '11px', color: '#64748b' }}>{cert.year}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Custom Sections */}
        {customSections.map(cs => {
          if (cs.type === 'text' && cs.items.trim()) {
            return (
              <div key={cs.id} style={{ marginBottom: '20px' }} className="custom-section-item">
                <h2 style={headingStyle}>{cs.title}</h2>
                <p style={{ fontSize: '12px', color: '#374151', textAlign: 'justify' }}>{cs.items}</p>
              </div>
            );
          }
          if (cs.type === 'tags' && cs.items.trim()) {
            return (
              <div key={cs.id} style={{ marginBottom: '20px' }} className="custom-section-item">
                <h2 style={headingStyle}>{cs.title}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  {cs.items.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      padding: '4px 12px', fontSize: '11px', color: '#374151', borderBottom: `2px solid ${templateColor}`,
                      fontFamily: "Georgia, serif", fontStyle: 'italic'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          if (cs.type === 'bullets' && cs.items.some(item => item.title)) {
            return (
              <div key={cs.id} style={{ marginBottom: '20px' }} className="custom-section-item">
                <h2 style={headingStyle}>{cs.title}</h2>
                {cs.items.filter(item => item.title).map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <span style={{ fontFamily: "Georgia, serif", fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{item.title}</span>
                        {item.subtitle && <span style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}> ({item.subtitle})</span>}
                      </div>
                      {item.date && (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.bullets && (
                      <ul style={{ marginTop: '4px', paddingLeft: '18px', listStyleType: 'circle' }}>
                        {item.bullets.split('\n').filter(b => b.trim()).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '11.5px', color: '#374151', marginBottom: '3px' }}>
                            {b.replace(/^[•\-\*]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const renderSidebarTemplate = () => {
    const sidebarHeadingStyle = {
      fontSize: '11px',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
      color: templateColor,
      borderBottom: `2px solid ${templateColor}33`,
      paddingBottom: '3px',
      marginBottom: '8px',
      marginTop: '16px'
    };

    const mainHeadingStyle = {
      fontSize: '11px',
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: templateColor,
      borderBottom: `2px solid ${templateColor}`,
      paddingBottom: '4px',
      marginBottom: '10px',
      marginTop: '16px'
    };

    return (
      <div style={{ fontFamily: "'Inter', Arial, sans-serif", color: '#1e293b', lineHeight: '1.5' }}>
        {/* Header spanning full width */}
        <div style={{ borderBottom: `3px solid ${templateColor}`, paddingBottom: '14px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {info.name || 'Your Full Name'}
          </h1>
          {info.title && (
            <p style={{ fontSize: '14px', fontWeight: '600', color: templateColor }}>
              {info.title}
            </p>
          )}
        </div>

        {/* Dynamic two-column layout */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* LEFT SIDEBAR (30% width) */}
          <div style={{ width: '30%', borderRight: '1px solid #cbd5e1', paddingRight: '16px' }}>
            
            <h3 style={{ ...sidebarHeadingStyle, marginTop: '0' }}>Contact Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10.5px', color: '#475569', wordBreak: 'break-all' }}>
              {info.email && <div>✉ {info.email}</div>}
              {info.phone && <div>📞 {info.phone}</div>}
              {info.location && <div>📍 {info.location}</div>}
              {socials.map((soc, idx) => (
                soc.value && (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    {getSocialIcon(soc.platform, templateColor, 12)}
                    {cleanUrl(soc.value)}
                  </div>
                )
              ))}
              {customLinks.map((lnk, idx) => (
                lnk.label && lnk.value && <div key={idx}>▪ <strong>{lnk.label}:</strong> {lnk.value}</div>
              ))}
            </div>

            {skills.trim() && (
              <div>
                <h3 style={sidebarHeadingStyle}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600',
                      background: `${templateColor}10`, color: templateColor, border: `1px solid ${templateColor}20`
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {certifications.some(c => c.name) && (
              <div>
                <h3 style={sidebarHeadingStyle}>Certifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {certifications.filter(c => c.name).map((cert, i) => (
                    <div key={i} style={{ fontSize: '10.5px', color: '#374151' }}>
                      <div style={{ fontWeight: '700' }}>{cert.name}</div>
                      <div style={{ color: '#64748b', fontSize: '9.5px' }}>{cert.issuer} {cert.year ? `(${cert.year})` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Render custom sections that are tags in sidebar */}
            {customSections.filter(cs => cs.type === 'tags' && cs.items.trim()).map(cs => (
              <div key={cs.id}>
                <h3 style={sidebarHeadingStyle}>{cs.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {cs.items.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600',
                      background: `${templateColor}10`, color: templateColor, border: `1px solid ${templateColor}20`
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* MAIN COLUMN (70% width) */}
          <div style={{ width: '70%', paddingLeft: '4px' }}>
            
            {info.summary && (
              <div style={{ marginBottom: '18px', marginTop: '0' }}>
                <h2 style={{ ...mainHeadingStyle, marginTop: '0' }}>Professional Summary</h2>
                <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: '1.6' }}>{info.summary}</p>
              </div>
            )}

            {experiences.some(e => e.company || e.role) && (
              <div style={{ marginBottom: '18px' }} className="experience-item">
                <h2 style={mainHeadingStyle}>Work Experience</h2>
                {experiences.filter(e => e.company || e.role).map((exp, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '12.5px', color: '#0f172a' }}>{exp.role || 'Role'}</p>
                        <p style={{ fontSize: '11.5px', color: templateColor, fontWeight: '600' }}>{exp.company || 'Company'}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}
                        </p>
                      )}
                    </div>
                    {exp.bullets && (
                      <ul style={{ marginTop: '4px', paddingLeft: '14px', listStyleType: 'disc' }}>
                        {exp.bullets.split('\n').filter(b => b.trim()).map((b, bi) => (
                          <li key={bi} style={{ fontSize: '11px', color: '#374151', marginBottom: '2.5px' }}>
                            {b.replace(/^[•\-\*]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {educations.some(e => e.institution || e.degree) && (
              <div style={{ marginBottom: '18px' }} className="education-item">
                <h2 style={mainHeadingStyle}>Education</h2>
                {educations.filter(e => e.institution || e.degree).map((edu, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '12px', color: '#0f172a' }}>{edu.degree || 'Degree'}</p>
                      <p style={{ fontSize: '11.5px', color: '#475569' }}>{edu.institution}{edu.field ? ` · ${edu.field}` : ''}</p>
                    </div>
                    {edu.year && <p style={{ fontSize: '10.5px', color: '#64748b' }}>{edu.year}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Render custom sections that are text or bullets in main column */}
            {customSections.filter(cs => {
              if (cs.type === 'text' && cs.items.trim()) return true;
              if (cs.type === 'bullets' && cs.items.some(item => item.title)) return true;
              return false;
            }).map(cs => {
              if (cs.type === 'text') {
                return (
                  <div key={cs.id} style={{ marginBottom: '18px' }} className="custom-section-item">
                    <h2 style={mainHeadingStyle}>{cs.title}</h2>
                    <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: '1.6' }}>{cs.items}</p>
                  </div>
                );
              }
              return (
                <div key={cs.id} style={{ marginBottom: '18px' }} className="custom-section-item">
                  <h2 style={mainHeadingStyle}>{cs.title}</h2>
                  {cs.items.filter(item => item.title).map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontWeight: '800', fontSize: '12.5px', color: '#0f172a' }}>{item.title}</p>
                          {item.subtitle && <p style={{ fontSize: '11.5px', color: '#475569', fontWeight: '600' }}>{item.subtitle}</p>}
                        </div>
                        {item.date && (
                          <p style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {item.date}
                          </p>
                        )}
                      </div>
                      {item.bullets && (
                        <ul style={{ marginTop: '4px', paddingLeft: '14px', listStyleType: 'disc' }}>
                          {item.bullets.split('\n').filter(b => b.trim()).map((b, bi) => (
                            <li key={bi} style={{ fontSize: '11px', color: '#374151', marginBottom: '2.5px' }}>
                              {b.replace(/^[•\-\*]\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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

          {/* Template & Accent Color Picker */}
          <div className="glass-panel" style={{ borderRadius: '14px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>📄 Resume Template</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'modern', label: 'Modern (Default)' },
                  { id: 'minimalist', label: 'Minimalist' },
                  { id: 'elegant', label: 'Elegant Serif' },
                  { id: 'sidebar', label: 'Sidebar Layout' }
                ].map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)} className="btn" style={{
                    fontSize: '11px', fontWeight: '700', padding: '6px',
                    border: template === t.id ? `2px solid ${templateColor}` : '2px solid var(--border-color)',
                    background: template === t.id ? `${templateColor}10` : 'transparent',
                    color: template === t.id ? 'var(--text-main)' : 'var(--text-muted)',
                    cursor: 'pointer', borderRadius: '8px', transition: 'all 0.15s'
                  }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>🎨 Accent Color</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {colors.map(c => (
                  <button key={c} onClick={() => setTemplateColor(c)} style={{
                    width: '26px', height: '26px', borderRadius: '50%', background: c,
                    border: templateColor === c ? '3px solid var(--text-main)' : '3px solid transparent',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {sections.map(s => {
              const Icon = s.icon || FiFileText;
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
              <Field label="Professional Title" id="title" type="text" placeholder="e.g. Senior Software Engineer" value={info.title || ''}
                onChange={e => setInfo(p => ({ ...p, title: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Email *" id="email" type="email" placeholder="john@email.com" value={info.email}
                  onChange={e => setInfo(p => ({ ...p, email: e.target.value }))} />
                <Field label="Phone" id="phone" type="tel" placeholder="+1 555-000-0000" value={info.phone}
                  onChange={e => setInfo(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <Field label="Location" id="location" type="text" placeholder="City, Country" value={info.location}
                onChange={e => setInfo(p => ({ ...p, location: e.target.value }))} />
              {/* Find Me Out (Social Links & Profiles) */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '4px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🌐 Find Me Out</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Link your social media profiles, websites, channels, or custom pages with icons.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {socials.map((soc, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <label htmlFor={`social-platform-${idx}`} style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Platform</label>
                        <select 
                          id={`social-platform-${idx}`}
                          value={soc.platform} 
                          onChange={e => updateSocialPlatform(idx, e.target.value)} 
                          className="input-field" 
                          style={{ 
                            padding: '8px', 
                            height: '38px', 
                            fontSize: '13px', 
                            background: 'var(--bg-card)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '8px', 
                            color: 'var(--text-main)',
                            width: '100%',
                            outline: 'none'
                          }}
                        >
                          <option value="linkedin">LinkedIn</option>
                          <option value="github">GitHub</option>
                          <option value="youtube">YouTube</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter / X</option>
                          <option value="facebook">Facebook</option>
                          <option value="tiktok">TikTok</option>
                          <option value="website">Website / Portfolio</option>
                        </select>
                      </div>
                      <div style={{ flex: 2 }}>
                        <Field 
                          label="Profile URL" 
                          id={`social-link-${idx}`} 
                          type="url" 
                          placeholder={
                            soc.platform === 'linkedin' ? 'https://linkedin.com/in/username' :
                            soc.platform === 'github' ? 'https://github.com/username' :
                            soc.platform === 'youtube' ? 'https://youtube.com/@channel' :
                            soc.platform === 'instagram' ? 'https://instagram.com/username' :
                            soc.platform === 'twitter' ? 'https://x.com/username' :
                            soc.platform === 'facebook' ? 'https://facebook.com/username' :
                            soc.platform === 'tiktok' ? 'https://tiktok.com/@username' :
                            'https://yoursite.com'
                          } 
                          value={soc.value} 
                          onChange={e => updateSocialValue(idx, e.target.value)} 
                        />
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => deleteSocial(idx)} 
                        style={{ padding: '8px 10px', height: '38px', color: 'var(--red-color)', borderColor: 'var(--border-color)' }}
                        title="Remove link"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    className="btn btn-secondary" 
                    onClick={addSocial} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', marginTop: '6px', width: '100%' }}
                  >
                    <FiPlus size={14} /> Add Social Link
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Field label="Professional Summary" id="summary" as="textarea" placeholder="Write 2-3 sentences about your professional background..." value={info.summary}
                  onChange={e => setInfo(p => ({ ...p, summary: e.target.value }))} style={{ minHeight: '100px' }} />
                <button
                  className="btn btn-secondary"
                  onClick={handleEnhanceSummary}
                  disabled={enhancing === 'summary'}
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: '11px',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px'
                  }}
                >
                  {enhancing === 'summary' ? (
                    <>⏳ Enhancing...</>
                  ) : (
                    <>✨ Enhance with AI</>
                  )}
                </button>
              </div>

              {/* Custom Links & Details */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-main)' }}>🔗 Custom Links & Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {customLinks.map((lnk, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <Field label="Label / Type" id={`custom-link-label-${idx}`} type="text" placeholder="e.g. GitHub, DOB, Portfolio" value={lnk.label} onChange={e => {
                          const val = e.target.value;
                          setCustomLinks(prev => prev.map((l, i) => i === idx ? { ...l, label: val } : l));
                        }} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <Field label="Value" id={`custom-link-value-${idx}`} type="text" placeholder="e.g. github.com/username, July 1999" value={lnk.value} onChange={e => {
                          const val = e.target.value;
                          setCustomLinks(prev => prev.map((l, i) => i === idx ? { ...l, value: val } : l));
                        }} />
                      </div>
                      <button className="btn btn-secondary" onClick={() => {
                        setCustomLinks(prev => prev.filter((_, i) => i !== idx));
                      }} style={{ padding: '8px 10px', height: '36px', color: 'var(--red-color)', borderColor: 'var(--border-color)' }}>
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                  <button className="btn btn-secondary" onClick={() => {
                    setCustomLinks(prev => [...prev, { label: '', value: '' }]);
                  }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', marginTop: '6px' }}>
                    <FiPlus size={14} /> Add Custom Link / Detail
                  </button>
                </div>
              </div>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Field label="Key Responsibilities & Achievements (one per line)" id={`bullets-${i}`} as="textarea" placeholder="• Increased system performance by 40%&#10;• Led a team of 5 engineers..." value={exp.bullets} onChange={e => updateExp(i, 'bullets', e.target.value)} style={{ minHeight: '90px' }} />
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEnhanceExperience(i)}
                      disabled={enhancing === `exp-${i}`}
                      style={{
                        alignSelf: 'flex-start',
                        fontSize: '11px',
                        padding: '4px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px'
                      }}
                    >
                      {enhancing === `exp-${i}` ? (
                        <>⏳ Enhancing...</>
                      ) : (
                        <>✨ Enhance with AI</>
                      )}
                    </button>
                  </div>
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

          {/* ——— Add Custom Section ——— */}
          {activeSection === 'add-section' && (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiPlus style={{ color: templateColor }} /> Add Custom Section
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Section Title</label>
                <input className="input-field" placeholder="e.g. Projects, Languages, Publications" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Section Type</label>
                <select className="input-field" value={newSectionType} onChange={e => setNewSectionType(e.target.value)} style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}>
                  <option value="bullets">Bullet Points List (like Work Experience)</option>
                  <option value="text">Plain Text Paragraph (like Professional Summary)</option>
                  <option value="tags">Comma Separated tags (like Skills)</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleAddSection} style={{ marginTop: '10px', background: `linear-gradient(135deg, ${templateColor}, ${templateColor}cc)`, border: 'none' }}>
                Create Section
              </button>
            </div>
          )}

          {/* ——— Custom Section Editor ——— */}
          {(() => {
            const activeCustomSection = customSections.find(cs => cs.id === activeSection);
            if (!activeCustomSection) return null;
            return (
              <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiFileText style={{ color: templateColor }} /> {activeCustomSection.title}
                  </h3>
                  <button className="btn btn-secondary" onClick={() => handleDeleteCustomSection(activeCustomSection.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', fontSize: '12px', borderColor: 'var(--red-color)', color: 'var(--red-color)', background: 'transparent' }}>
                    <FiTrash2 size={12} /> Delete Section
                  </button>
                </div>

                {activeCustomSection.type === 'text' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Field
                      label="Section Content"
                      id={`custom-text-${activeCustomSection.id}`}
                      as="textarea"
                      placeholder={`Write content for ${activeCustomSection.title}...`}
                      value={activeCustomSection.items}
                      onChange={e => handleUpdateCustomText(activeCustomSection.id, e.target.value)}
                      style={{ minHeight: '150px' }}
                    />
                  </div>
                )}

                {activeCustomSection.type === 'tags' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Field
                      label="Tags (comma separated)"
                      id={`custom-tags-${activeCustomSection.id}`}
                      as="textarea"
                      placeholder="e.g. English, Spanish, French..."
                      value={activeCustomSection.items}
                      onChange={e => handleUpdateCustomTags(activeCustomSection.id, e.target.value)}
                      style={{ minHeight: '100px' }}
                    />
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Separate each item with a comma. They will display as tags on your resume.</p>
                  </div>
                )}

                {activeCustomSection.type === 'bullets' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeCustomSection.items.map((item, idx) => (
                      <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-grid)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                        {activeCustomSection.items.length > 1 && (
                          <button onClick={() => handleRemoveCustomBulletItem(activeCustomSection.id, idx)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <FiX size={14} />
                          </button>
                        )}
                        <p style={{ fontSize: '12px', fontWeight: '800', color: templateColor }}>Item #{idx + 1}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <Field label="Title / Heading" id={`custom-bullet-title-${idx}`} type="text" placeholder="e.g. Project Portfolio Website" value={item.title} onChange={e => handleUpdateCustomBulletItem(activeCustomSection.id, idx, 'title', e.target.value)} />
                          <Field label="Subtitle / Detail" id={`custom-bullet-sub-${idx}`} type="text" placeholder="e.g. React & Tailwind" value={item.subtitle} onChange={e => handleUpdateCustomBulletItem(activeCustomSection.id, idx, 'subtitle', e.target.value)} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                          <Field label="Date / Timeline" id={`custom-bullet-date-${idx}`} type="text" placeholder="e.g. 2026 or Spring 2025" value={item.date} onChange={e => handleUpdateCustomBulletItem(activeCustomSection.id, idx, 'date', e.target.value)} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <Field
                            label="Details & Achievements (one per line)"
                            id={`custom-bullet-points-${idx}`}
                            as="textarea"
                            placeholder="• Developed full-stack app using MERN stack...&#10;• Optimized page loads by 50%..."
                            value={item.bullets}
                            onChange={e => handleUpdateCustomBulletItem(activeCustomSection.id, idx, 'bullets', e.target.value)}
                            style={{ minHeight: '90px' }}
                          />
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEnhanceCustomSectionItem(activeCustomSection.id, idx)}
                            disabled={enhancing === `custom-${activeCustomSection.id}-${idx}`}
                            style={{
                              alignSelf: 'flex-start',
                              fontSize: '11px',
                              padding: '4px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '2px'
                            }}
                          >
                            {enhancing === `custom-${activeCustomSection.id}-${idx}` ? (
                              <>⏳ Enhancing...</>
                            ) : (
                              <>✨ Enhance with AI</>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-secondary" onClick={() => handleAddCustomBulletItem(activeCustomSection.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                      <FiPlus size={14} /> Add Another Item
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

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
            <div ref={previewRef} style={{ padding: '36px 32px', background: '#fff', color: '#1e293b' }}>
              {renderTemplateContent()}
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
