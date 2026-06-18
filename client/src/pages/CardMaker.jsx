import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiArrowLeft, FiEdit3, FiDownload, FiShare2, FiZap, FiCopy, FiMail, FiMessageCircle, FiRefreshCw
} from 'react-icons/fi';
import { AFFILIATE_LINKS } from '../affiliateLinks';

const rawBackendUrl = import.meta.env.VITE_API_URL || 'https://vansh135-all-tool-master-backend.hf.space';
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '');

/* ─── Template definitions with decoration configs ──────── */
const TEMPLATES = [
  {
    id: 'rose-gold', name: '🎈 Rose Gold Balloons',
    bgGrad: ['#fef2f2', '#fff1f2', '#fce7f3'],
    textColor: '#881337', accentColor: '#be123c', subtitleColor: '#9f1239',
    balloonColors: ['#f9a8d4', '#fda4af', '#fecdd3', '#ffffff', '#e4b3c0'],
    confettiColors: ['#d4a574', '#c9a96e', '#e8c78e'],
    font: "'Georgia', serif", decorStyle: 'balloons'
  },
  {
    id: 'gold-surprise', name: '🎁 Gold Surprise Party',
    bgGrad: ['#1a1a2e', '#16213e', '#0f3460'],
    textColor: '#fef08a', accentColor: '#fbbf24', subtitleColor: '#fde68a',
    balloonColors: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#ffffff'],
    confettiColors: ['#fbbf24', '#f59e0b', '#ffffff'],
    font: "'Georgia', serif", decorStyle: 'surprise'
  },
  {
    id: 'bokeh-night', name: '✨ Bokeh Night Lights',
    bgGrad: ['#1e1b4b', '#312e81', '#3b0764'],
    textColor: '#ffffff', accentColor: '#f9a8d4', subtitleColor: '#e9d5ff',
    balloonColors: [],
    confettiColors: [],
    font: "'Georgia', serif", decorStyle: 'bokeh'
  },
  {
    id: 'retro-groovy', name: '🌼 Retro Groovy',
    bgGrad: ['#fffbeb', '#fef3c7', '#fde68a'],
    textColor: '#92400e', accentColor: '#dc2626', subtitleColor: '#c2410c',
    balloonColors: [],
    confettiColors: ['#dc2626', '#2563eb', '#f59e0b', '#16a34a'],
    font: "'Georgia', serif", decorStyle: 'retro'
  },
  {
    id: 'midnight-gold', name: '🌙 Midnight Gold',
    bgGrad: ['#000000', '#0a0a0a', '#171717'],
    textColor: '#fbbf24', accentColor: '#f59e0b', subtitleColor: '#fde68a',
    balloonColors: ['#b45309', '#d97706', '#f59e0b'],
    confettiColors: ['#fbbf24', '#f59e0b', '#d97706', '#92400e'],
    font: "'Georgia', serif", decorStyle: 'golden-rain'
  },
  {
    id: 'elegant-white', name: '🕊 Elegant Minimalist',
    bgGrad: ['#ffffff', '#fafafa', '#f5f5f5'],
    textColor: '#171717', accentColor: '#d4a574', subtitleColor: '#525252',
    balloonColors: [],
    confettiColors: [],
    font: "'Georgia', serif", decorStyle: 'elegant'
  },
  {
    id: 'neon-cyber', name: '🎮 Neon Cyber Party',
    bgGrad: ['#09090b', '#18181b', '#09090b'],
    textColor: '#22d3ee', accentColor: '#a855f7', subtitleColor: '#34d399',
    balloonColors: [],
    confettiColors: ['#22d3ee', '#a855f7', '#f43f5e', '#34d399'],
    font: "'monospace'", decorStyle: 'neon'
  },
  {
    id: 'floral-garden', name: '🌸 Floral Garden',
    bgGrad: ['#fdf2f8', '#fce7f3', '#fbcfe8'],
    textColor: '#831843', accentColor: '#db2777', subtitleColor: '#9d174d',
    balloonColors: [],
    confettiColors: [],
    font: "'Georgia', serif", decorStyle: 'floral'
  },
  {
    id: 'indian-festive', name: '🪔 Indian Festive',
    bgGrad: ['#7c2d12', '#9a3412', '#ea580c'],
    textColor: '#fef08a', accentColor: '#facc15', subtitleColor: '#fde68a',
    balloonColors: [],
    confettiColors: ['#facc15', '#fde68a', '#f97316', '#ffffff'],
    font: "'Georgia', serif", decorStyle: 'festive'
  }
];

/* ─── Drawing Helpers ──────────────────────────────────── */

// Seeded random for consistent decorations per render
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function drawBalloon(ctx, x, y, rx, ry, color, shine = true) {
  ctx.save();
  // String
  ctx.strokeStyle = 'rgba(180,180,180,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + ry);
  ctx.quadraticCurveTo(x + 8, y + ry + 25, x - 5, y + ry + 50);
  ctx.stroke();

  // Balloon body
  const grad = ctx.createRadialGradient(x - rx * 0.25, y - ry * 0.3, rx * 0.1, x, y, Math.max(rx, ry));
  grad.addColorStop(0, lightenColor(color, 60));
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, darkenColor(color, 30));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Knot
  ctx.fillStyle = darkenColor(color, 40);
  ctx.beginPath();
  ctx.moveTo(x - 4, y + ry);
  ctx.lineTo(x + 4, y + ry);
  ctx.lineTo(x, y + ry + 8);
  ctx.closePath();
  ctx.fill();

  // Shine highlight
  if (shine) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(x - rx * 0.28, y - ry * 0.3, rx * 0.18, ry * 0.25, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawConfetti(ctx, particles) {
  particles.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha || 0.85;
    if (p.shape === 'rect') {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Ribbon curl
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.bezierCurveTo(-p.w, -p.h, p.w, p.h / 2, -p.w / 2, p.h);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawBokeh(ctx, w, h, count, colors) {
  const rng = seededRandom(42);
  for (let i = 0; i < count; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const r = 10 + rng() * 50;
    const alpha = 0.05 + rng() * 0.2;
    const color = colors[Math.floor(rng() * colors.length)];
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${hexToRgb(color)}, ${alpha + 0.15})`);
    grad.addColorStop(0.6, `rgba(${hexToRgb(color)}, ${alpha * 0.5})`);
    grad.addColorStop(1, `rgba(${hexToRgb(color)}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStringLights(ctx, w, startY, count) {
  // Wire
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, startY);
  const step = w / count;
  for (let i = 0; i <= count; i++) {
    const x = i * step;
    const sag = Math.sin((i / count) * Math.PI) * 18;
    ctx.lineTo(x, startY + sag);
  }
  ctx.stroke();

  // Bulbs
  const bulbColors = ['#fef08a', '#fde68a', '#ffffff', '#fbbf24', '#fdba74'];
  for (let i = 1; i < count; i++) {
    const x = i * step;
    const sag = Math.sin((i / count) * Math.PI) * 18;
    const color = bulbColors[i % bulbColors.length];

    // Glow
    const glow = ctx.createRadialGradient(x, startY + sag + 8, 0, x, startY + sag + 8, 18);
    glow.addColorStop(0, `rgba(${hexToRgb(color)}, 0.5)`);
    glow.addColorStop(1, `rgba(${hexToRgb(color)}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, startY + sag + 8, 18, 0, Math.PI * 2);
    ctx.fill();

    // Bulb
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, startY + sag + 8, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStarSparkle(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.moveTo(0, 0);
    ctx.lineTo(-size * 0.15, -size * 0.5);
    ctx.lineTo(0, -size);
    ctx.lineTo(size * 0.15, -size * 0.5);
    ctx.lineTo(0, 0);
  }
  ctx.fill();
  ctx.restore();
}

function drawFlower(ctx, x, y, size, petalColor, centerColor) {
  ctx.save();
  const petals = 6;
  for (let i = 0; i < petals; i++) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.PI * 2 / petals) * i);
    ctx.fillStyle = petalColor;
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.5, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBunting(ctx, w, y, count, colors) {
  const step = w / count;
  for (let i = 0; i < count; i++) {
    const x1 = i * step;
    const x2 = x1 + step;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.lineTo((x1 + x2) / 2, y + step * 0.8);
    ctx.closePath();
    ctx.fill();
  }
  // Wire
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(w, y);
  ctx.stroke();
}

function drawRibbon(ctx, x, y, w, h, color, text, textColor) {
  ctx.save();
  const darkColor = darkenColor(color, 30);
  // Left tail
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.moveTo(x - 15, y);
  ctx.lineTo(x, y + h / 2);
  ctx.lineTo(x - 15, y + h);
  ctx.lineTo(x + 5, y + h);
  ctx.lineTo(x + 5, y);
  ctx.closePath();
  ctx.fill();
  // Right tail
  ctx.beginPath();
  ctx.moveTo(x + w + 15, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w + 15, y + h);
  ctx.lineTo(x + w - 5, y + h);
  ctx.lineTo(x + w - 5, y);
  ctx.closePath();
  ctx.fill();
  // Main body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 4);
  ctx.fill();
  // Text
  if (text) {
    ctx.fillStyle = textColor || '#ffffff';
    ctx.font = `bold 14px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x + w / 2, y + h / 2 + 5);
  }
  ctx.restore();
}

function drawOrnamentalBorder(ctx, w, h, color, style = 'double') {
  ctx.save();
  ctx.strokeStyle = color;
  if (style === 'double') {
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, w - 32, h - 32);
    ctx.lineWidth = 1;
    ctx.strokeRect(22, 22, w - 44, h - 44);
    // Corner flourishes
    const cSize = 16;
    [[24, 24], [w - 24, 24], [24, h - 24], [w - 24, h - 24]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, cSize / 3, 0, Math.PI * 2);
      ctx.stroke();
    });
  } else if (style === 'gold') {
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(20, 20, w - 40, h - 40);
    ctx.setLineDash([]);
  }
  ctx.restore();
}

/* ─── Color Utilities ──────────────────────────────────── */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)].join(',');
}

function lightenColor(hex, amount) {
  const h = hex.replace('#', '');
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, amount) {
  const h = hex.replace('#', '');
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return `rgb(${r},${g},${b})`;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

function formatTime(timeStr) {
  try {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  } catch { return timeStr; }
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function CardMaker({ tool, setView, setActiveTool, navigate, addToast }) {
  const [form, setForm] = useState({
    name: '',
    eventType: 'Birthday Party',
    customEvent: '',
    date: '2026-07-20',
    time: '18:00',
    venue: 'Skyline Banquet Hall, Mumbai',
    theme: 'rose-gold',
    language: 'English',
    style: 'Elegant',
    tone: 'Joyful'
  });

  const [aiData, setAiData] = useState({
    title: '',
    greeting: 'You are invited to',
    message: 'Join us to celebrate a wonderful evening filled with joy and laughter.',
    rsvp: 'RSVP by July 15th to Host.'
  });

  const [loading, setLoading] = useState(false);
  const [decorSeed, setDecorSeed] = useState(1);
  const canvasRef = useRef(null);
  const [sharingOpen, setSharingOpen] = useState(false);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  /* ─── AI Generation ───────────────────────────────── */
  const handleGenerate = async () => {
    setLoading(true);
    const apiKey = localStorage.getItem('gemini_api_key') || '';
    const displayEventType = form.eventType === 'Custom' ? (form.customEvent || 'Custom Event') : form.eventType;
    const promptText = `
Generate custom invitation card details based on these settings:
- Host/Name: ${form.name || 'Our Guest'}
- Event: ${displayEventType}
- Date: ${form.date}
- Time: ${form.time}
- Venue: ${form.venue}
- Tone: ${form.tone}
- Style: ${form.style}
- Language: ${form.language}

Return EXACTLY a JSON string with these fields:
{
  "title": "Short catchy event title (e.g. 'Birthday Bash', 'Wedding Celebration')",
  "greeting": "One-line opening like 'You are cordially invited to' or 'Please join us to celebrate'",
  "message": "Heartfelt 2-3 sentence invitation message body",
  "rsvp": "RSVP instructions line. IMPORTANT: Do NOT include placeholders like '[RSVP Date]' or '[Contact Information]' or brackets. If no contact information is available, write something general like 'RSVP to Host' or 'Kindly reply by next week' or similar."
}
Do not write markdown quotes or explanations, just raw JSON.
`;

    const formData = new FormData();
    formData.append('tool', 'note-taker');
    formData.append('textContent', promptText);
    if (apiKey) formData.append('apiKey', apiKey);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/ai`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = JSON.parse(res.data.result.replace(/```json|```/g, '').trim());
      setAiData(data);
      setDecorSeed(prev => prev + 1);
      addToast('Card contents updated with AI!', 'success');
    } catch (e) {
      console.error(e);
      addToast('AI generation failed, using template defaults.', 'info');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Canvas Rendering Engine ─────────────────────── */
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const template = TEMPLATES.find(t => t.id === form.theme) || TEMPLATES[0];
    const rng = seededRandom(decorSeed * 7 + 13);

    // ═══ Background ═══
    const bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
    template.bgGrad.forEach((c, i) => bgGrad.addColorStop(i / (template.bgGrad.length - 1), c));
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ═══ Decoration Layer (behind text) ═══
    const ds = template.decorStyle;

    if (ds === 'balloons') {
      // Generate confetti particles
      const particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: rng() * W, y: rng() * H, angle: rng() * Math.PI * 2,
          w: 4 + rng() * 8, h: 2 + rng() * 4,
          color: template.confettiColors[Math.floor(rng() * template.confettiColors.length)],
          alpha: 0.4 + rng() * 0.5, shape: rng() > 0.5 ? 'rect' : 'ribbon'
        });
      }
      drawConfetti(ctx, particles);

      // Draw balloons at corners and edges
      const bc = template.balloonColors;
      // Top-left cluster
      drawBalloon(ctx, 55, 95, 42, 52, bc[0]);
      drawBalloon(ctx, 20, 140, 36, 44, bc[3]);
      drawBalloon(ctx, 90, 55, 38, 48, bc[1]);
      // Top-right cluster
      drawBalloon(ctx, W - 50, 80, 44, 54, bc[2]);
      drawBalloon(ctx, W - 95, 45, 36, 46, bc[0]);
      drawBalloon(ctx, W - 25, 135, 32, 40, bc[4 % bc.length]);
      // Bottom cluster (drawn on sides to avoid overlapping RSVP/Venue text in the center)
      for (let i = 0; i < 6; i++) {
        const isLeft = i < 3;
        const bx = isLeft 
          ? 25 + i * 40 
          : W - 25 - (i - 3) * 40;
        const by = H - 35 - rng() * 30;
        const brx = 22 + rng() * 10;
        const bry = brx * 1.25;
        drawBalloon(ctx, bx, by, brx, bry, bc[Math.floor(rng() * bc.length)]);
      }
    }

    if (ds === 'surprise') {
      // Dark theme with gold bunting and balloons
      drawBunting(ctx, W, 25, 18, ['#fbbf24', '#f59e0b', '#d97706']);
      // Gold sparkles rain from top
      for (let i = 0; i < 80; i++) {
        const sx = rng() * W;
        const sy = rng() * H * 0.15;
        const ss = 1 + rng() * 3;
        ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + rng() * 0.7})`;
        ctx.beginPath();
        ctx.arc(sx, sy, ss, 0, Math.PI * 2);
        ctx.fill();
      }
      // Heart-shaped balloons cluster on left side
      const bc = template.balloonColors;
      drawBalloon(ctx, 75, H * 0.55, 22, 28, bc[0]);
      drawBalloon(ctx, 55, H * 0.48, 18, 24, bc[4 % bc.length]);
      drawBalloon(ctx, 90, H * 0.62, 20, 26, bc[1]);
      drawBalloon(ctx, 65, H * 0.7, 24, 30, bc[2]);
      // Gift box at bottom-left
      ctx.fillStyle = '#1a1a2e';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.fillRect(35, H - 120, 70, 60);
      ctx.strokeRect(35, H - 120, 70, 60);
      // Ribbon cross on box
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(70, H - 120);
      ctx.lineTo(70, H - 60);
      ctx.moveTo(35, H - 90);
      ctx.lineTo(105, H - 90);
      ctx.stroke();
      // Bow on top
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(60, H - 125, 14, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(80, H - 125, 14, 8, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Confetti
      const particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: rng() * W, y: rng() * H, angle: rng() * Math.PI * 2,
          w: 4 + rng() * 6, h: 2 + rng() * 3,
          color: template.confettiColors[Math.floor(rng() * template.confettiColors.length)],
          alpha: 0.4 + rng() * 0.5, shape: 'rect'
        });
      }
      drawConfetti(ctx, particles);
    }

    if (ds === 'bokeh') {
      drawBokeh(ctx, W, H, 35, ['#fbbf24', '#f9a8d4', '#a78bfa', '#67e8f9', '#fde68a', '#ffffff']);
      drawStringLights(ctx, W, 35, 12);
    }

    if (ds === 'retro') {
      // Wavy lines at bottom
      for (let w_i = 0; w_i < 5; w_i++) {
        const waveY = H - 80 + w_i * 16;
        const waveColors = ['#dc2626', '#f59e0b', '#2563eb', '#16a34a', '#7c3aed'];
        ctx.strokeStyle = waveColors[w_i % waveColors.length];
        ctx.lineWidth = 8;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = waveY + Math.sin(x / 30 + w_i * 0.8) * 12;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // Groovy flowers
      drawFlower(ctx, 60, 60, 28, '#dc2626', '#f59e0b');
      drawFlower(ctx, W - 55, 75, 22, '#2563eb', '#ffffff');
      drawFlower(ctx, 45, H - 140, 18, '#f59e0b', '#dc2626');
      drawFlower(ctx, W - 40, H - 155, 24, '#16a34a', '#fde68a');
      // Daisy at top-right
      drawFlower(ctx, W - 90, 45, 16, '#ffffff', '#f59e0b');
    }

    if (ds === 'golden-rain') {
      // Gold particle rain from top
      for (let i = 0; i < 120; i++) {
        const px = rng() * W;
        const py = rng() * H * 0.2;
        const ps = 1 + rng() * 3;
        ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + rng() * 0.7})`;
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fill();
      }
      drawOrnamentalBorder(ctx, W, H, 'rgba(251, 191, 36, 0.4)', 'gold');
      // Sparkles
      for (let i = 0; i < 12; i++) {
        drawStarSparkle(ctx, rng() * W, rng() * H, 6 + rng() * 10, `rgba(251, 191, 36, ${0.2 + rng() * 0.5})`);
      }
    }

    if (ds === 'elegant') {
      drawOrnamentalBorder(ctx, W, H, '#d4a574', 'double');
      // Subtle gold sparkles
      for (let i = 0; i < 8; i++) {
        drawStarSparkle(ctx, 30 + rng() * (W - 60), 30 + rng() * (H - 60), 4 + rng() * 6, 'rgba(212, 165, 116, 0.3)');
      }
    }

    if (ds === 'neon') {
      // Neon grid lines
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 30) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 30) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
      // Neon border glow
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, W - 30, H - 30);
      ctx.shadowBlur = 0;

      // Confetti particles
      const particles = [];
      for (let i = 0; i < 25; i++) {
        particles.push({
          x: rng() * W, y: rng() * H, angle: rng() * Math.PI * 2,
          w: 3 + rng() * 5, h: 2 + rng() * 3,
          color: template.confettiColors[Math.floor(rng() * template.confettiColors.length)],
          alpha: 0.3 + rng() * 0.4, shape: 'circle'
        });
      }
      drawConfetti(ctx, particles);
    }

    if (ds === 'floral') {
      // Border flowers and leaves
      const fc = ['#f9a8d4', '#fbcfe8', '#f472b6', '#ec4899', '#db2777'];
      for (let i = 0; i < 6; i++) {
        drawFlower(ctx, rng() * W, rng() * 80, 14 + rng() * 16, fc[Math.floor(rng() * fc.length)], '#fde68a');
      }
      for (let i = 0; i < 4; i++) {
        const fx = i < 2 ? 35 + i * 40 : W - 35 - (i - 2) * 40;
        const fy = H - 40 - rng() * 30;
        drawFlower(ctx, fx, fy, 12 + rng() * 10, fc[Math.floor(rng() * fc.length)], '#fde68a');
      }
      // Vine/leaf hints on sides
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const ly = 80 + i * (H - 160) / 5;
        const lx = rng() > 0.5 ? 25 : W - 25;
        ctx.beginPath();
        ctx.ellipse(lx, ly, 8, 14, rng() * Math.PI, 0, Math.PI * 2);
        ctx.stroke();
      }
      drawOrnamentalBorder(ctx, W, H, 'rgba(219, 39, 119, 0.2)', 'double');
    }

    if (ds === 'festive') {
      // Diya / Rangoli pattern borders
      drawOrnamentalBorder(ctx, W, H, 'rgba(250, 204, 21, 0.5)', 'gold');
      // Gold confetti
      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: rng() * W, y: rng() * H, angle: rng() * Math.PI * 2,
          w: 3 + rng() * 6, h: 2 + rng() * 4,
          color: template.confettiColors[Math.floor(rng() * template.confettiColors.length)],
          alpha: 0.3 + rng() * 0.5, shape: rng() > 0.5 ? 'rect' : 'circle'
        });
      }
      drawConfetti(ctx, particles);
      // 3 Diyas (left, center-low, right)
      const diyaXs = [60, W / 2, W - 60];
      diyaXs.forEach((dx, idx) => {
        const dy = idx === 1 ? H - 35 : H - 50;
        const glow = ctx.createRadialGradient(dx, dy, 0, dx, dy, 25);
        glow.addColorStop(0, 'rgba(250, 204, 21, 0.55)');
        glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(dx, dy, 25, 0, Math.PI * 2);
        ctx.fill();
        // Diya clay body
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(dx, dy, 12, 0, Math.PI);
        ctx.fill();
        // Flame
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(dx, dy - 8, 4, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ═══ TEXT CONTENT LAYER ═══
    ctx.textAlign = 'center';
    const centerX = W / 2;

    // Determine event title
    let eventTitle = aiData.title;
    let hostLine = '';
    const displayEventType = form.eventType === 'Custom' ? (form.customEvent || 'Custom Event') : form.eventType;
    
    if (!eventTitle) {
      if (form.name) {
        const cleanName = form.name.trim();
        const possessiveName = cleanName.endsWith("'s") || cleanName.endsWith("s'") 
          ? cleanName 
          : (cleanName.endsWith("s") ? `${cleanName}'` : `${cleanName}'s`);
        eventTitle = `${possessiveName} ${displayEventType}`;
      } else {
        eventTitle = displayEventType;
      }
    } else {
      if (form.name) {
        const nameLower = form.name.toLowerCase().trim();
        const titleLower = eventTitle.toLowerCase();
        if (!titleLower.includes(nameLower)) {
          const cleanName = form.name.trim();
          hostLine = cleanName.endsWith("'s") || cleanName.endsWith("s'") 
            ? cleanName 
            : (cleanName.endsWith("s") ? `${cleanName}'` : `${cleanName}'s`);
        }
      }
    }

    const greeting = aiData.greeting || 'You are invited to';

    // --- Greeting line ---
    ctx.fillStyle = template.subtitleColor;
    ctx.font = `italic 16px ${template.font}`;
    ctx.fillText(greeting.toUpperCase(), centerX, 155);

    let nextY = 195;

    // --- Host Name ---
    if (hostLine) {
      ctx.fillStyle = template.textColor;
      ctx.font = `bold 28px ${template.font}`;
      ctx.fillText(hostLine, centerX, nextY);
      nextY += 40;
    }

    // --- Event Title (Large, dynamic) ---
    ctx.fillStyle = template.accentColor;
    ctx.font = `italic bold 46px ${template.font}`;

    // Word wrap for long titles
    const titleWords = eventTitle.split(' ');
    if (ctx.measureText(eventTitle).width > W - 80) {
      const mid = Math.ceil(titleWords.length / 2);
      const line1 = titleWords.slice(0, mid).join(' ');
      const line2 = titleWords.slice(mid).join(' ');
      ctx.fillText(line1, centerX, nextY);
      ctx.fillText(line2, centerX, nextY + 50);
      nextY += 95;
    } else {
      ctx.fillText(eventTitle, centerX, nextY);
      nextY += 50;
    }

    // --- Message Body ---
    const msgY = nextY + 15;
    ctx.fillStyle = template.textColor;
    ctx.font = `16px ${template.font}`;
    const msgWords = aiData.message.split(' ');
    let msgLine = '';
    let curY = msgY;
    for (let n = 0; n < msgWords.length; n++) {
      let testLine = msgLine + msgWords[n] + ' ';
      if (ctx.measureText(testLine).width > W - 90 && n > 0) {
        ctx.fillText(msgLine.trim(), centerX, curY);
        msgLine = msgWords[n] + ' ';
        curY += 24;
      } else {
        msgLine = testLine;
      }
    }
    ctx.fillText(msgLine.trim(), centerX, curY);

    // --- Separator / Divider ---
    curY += 30;
    ctx.strokeStyle = `${template.accentColor}80`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W * 0.2, curY);
    ctx.lineTo(W * 0.8, curY);
    ctx.stroke();
    // Diamond ornament center
    ctx.fillStyle = template.accentColor;
    ctx.save();
    ctx.translate(centerX, curY);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();

    // --- Date & Time Block ---
    curY += 35;
    ctx.fillStyle = template.textColor;
    ctx.font = `bold 22px ${template.font}`;
    ctx.fillText(formatDate(form.date), centerX, curY);

    curY += 30;
    ctx.fillStyle = template.accentColor;
    ctx.font = `bold 26px ${template.font}`;
    ctx.fillText(formatTime(form.time), centerX, curY);

    // --- Venue ---
    curY += 35;
    ctx.fillStyle = template.subtitleColor;
    ctx.font = `16px ${template.font}`;
    // Wrap venue text
    const venueWords = form.venue.split(' ');
    let venueLine = '';
    for (let n = 0; n < venueWords.length; n++) {
      let testLine = venueLine + venueWords[n] + ' ';
      if (ctx.measureText(testLine).width > W - 80 && n > 0) {
        ctx.fillText(venueLine.trim(), centerX, curY);
        venueLine = venueWords[n] + ' ';
        curY += 22;
      } else {
        venueLine = testLine;
      }
    }
    ctx.fillText(venueLine.trim(), centerX, curY);

    // --- RSVP Line ---
    if (aiData.rsvp && aiData.rsvp.trim()) {
      ctx.fillStyle = template.accentColor;
      ctx.font = `italic 15px ${template.font}`;
      ctx.fillText(aiData.rsvp.trim(), centerX, H - 50);
    }

  }, [form, aiData, decorSeed]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  /* ─── Exports ─────────────────────────────────────── */
  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`, 0.95);
    const displayEventType = form.eventType === 'Custom' ? (form.customEvent || 'Custom Event') : form.eventType;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `invitation_${displayEventType.toLowerCase().replace(/\s+/g, '_')}.${format}`;
    link.click();
    addToast(`Card downloaded as ${format.toUpperCase()}!`, 'success');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Invitation link copied!', 'success');
  };

  const shuffleDecorations = () => {
    setDecorSeed(prev => prev + 1);
    addToast('Decorations shuffled!', 'info');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '30px 0 80px 0' }}>
      {/* Back button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => { setView('dashboard'); setActiveTool(null); }}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(6,182,212,0.35)'
        }}>
          <FiEdit3 />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>
          AI Invitation &amp; <span className="text-gradient">Card Maker</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          Design premium customized greeting cards and invitations with dynamic decorations — balloons, confetti, bokeh lights, and more. Powered by Gemini AI.
        </p>
      </div>

      {/* Canva Affiliate Hook */}
      <div className="glass-panel" style={{
        padding: '16px 24px', borderRadius: '14px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
        border: '1px solid rgba(6, 182, 212, 0.2)'
      }}>
        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Need advanced templates, stickers, or folding layouts? <strong style={{ color: 'var(--text-main)' }}>Try Canva.</strong> Explore millions of professional graphics.
        </div>
        <a href={AFFILIATE_LINKS.canva || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#00c4cc', borderColor: '#00c4cc', fontSize: '12.5px', padding: '8px 16px' }}>
          Open Canva
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', alignItems: 'start' }} className="tool-page-grid">

        {/* Left Form controls */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4' }}>
            <FiZap /> Design Parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Host Name</label>
              <input type="text" className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Vansh Shah" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Event Type</label>
              <select className="select-field" value={form.eventType} onChange={e => set('eventType', e.target.value)}>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Wedding Invitation">Wedding Invitation</option>
                <option value="Anniversary Celebration">Anniversary Celebration</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Housewarming Party">Housewarming Party</option>
                <option value="Festival Greetings">Festival Greetings</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Thank You Card">Thank You Card</option>
                <option value="Farewell Card">Farewell Card</option>
                <option value="Surprise Party">Surprise Party</option>
                <option value="Graduation Party">Graduation Party</option>
                <option value="Engagement Party">Engagement Party</option>
                <option value="Custom">Custom Event / Party</option>
              </select>
            </div>
          </div>

          {form.eventType === 'Custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className="animate-fade-in">
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Custom Event Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={form.customEvent} 
                onChange={e => set('customEvent', e.target.value)} 
                placeholder="e.g. Kitty Party, Get Together" 
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Date</label>
              <input type="date" className="input-field" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Time</label>
              <input type="time" className="input-field" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Venue / Location</label>
            <input type="text" className="input-field" value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="e.g. 5th Avenue, New York" />
          </div>

          {/* Template Selector (visual) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>CARD DESIGN THEME</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => set('theme', t.id)}
                  style={{
                    padding: '10px 6px', borderRadius: '12px', cursor: 'pointer',
                    border: form.theme === t.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    background: `linear-gradient(135deg, ${t.bgGrad[0]}, ${t.bgGrad[t.bgGrad.length - 1]})`,
                    color: t.textColor, fontSize: '11px', fontWeight: '700',
                    textAlign: 'center', transition: 'all 0.2s',
                    boxShadow: form.theme === t.id ? '0 0 12px var(--accent-muted)' : 'none',
                    transform: form.theme === t.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Message Tone</label>
              <select className="select-field" value={form.tone} onChange={e => set('tone', e.target.value)}>
                <option value="Joyful">Joyful</option>
                <option value="Formal">Formal</option>
                <option value="Humorous">Humorous</option>
                <option value="Warm">Warm & Emotional</option>
                <option value="Romantic">Romantic</option>
                <option value="Playful">Playful & Fun</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>Language</label>
              <input type="text" className="input-field" value={form.language} onChange={e => set('language', e.target.value)} placeholder="e.g. English, Hindi" />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ height: '48px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', marginTop: '10px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '18px', height: '18px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                AI Writing Card Copy...
              </span>
            ) : (
              '✨ Generate AI Card'
            )}
          </button>

          {/* Card Copy Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '18px', marginTop: '10px' }}>
            <h4 style={{ fontWeight: '700', fontSize: '14px', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiEdit3 /> Edit Card Text
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Greeting</label>
              <input 
                type="text" 
                className="input-field" 
                value={aiData.greeting} 
                onChange={e => setAiData(p => ({ ...p, greeting: e.target.value }))} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Event Title (Override)</label>
              <input 
                type="text" 
                className="input-field" 
                value={aiData.title} 
                onChange={e => setAiData(p => ({ ...p, title: e.target.value }))} 
                placeholder={form.eventType === 'Custom' ? form.customEvent : form.eventType}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>Invitation Message</label>
              <textarea 
                className="input-field" 
                style={{ height: '70px', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px', lineHeight: '1.4' }}
                value={aiData.message} 
                onChange={e => setAiData(p => ({ ...p, message: e.target.value }))} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>RSVP Line (Clear to remove)</label>
              <input 
                type="text" 
                className="input-field" 
                value={aiData.rsvp} 
                onChange={e => setAiData(p => ({ ...p, rsvp: e.target.value }))} 
                placeholder="e.g. RSVP to Host by July 15th"
              />
            </div>
          </div>
        </div>

        {/* Right Canvas Preview & Exports */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>

          {/* Card Frame Preview */}
          <div className="glass-panel" style={{
            padding: '16px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '100%', width: '440px'
          }}>
            <canvas
              ref={canvasRef}
              width={480}
              height={700}
              style={{
                borderRadius: '16px', width: '100%', height: 'auto', display: 'block',
                boxShadow: '0 8px 30px rgba(0,0,0,0.25)'
              }}
            />
          </div>

          {/* Shuffle Decorations */}
          <button
            className="btn btn-secondary"
            onClick={shuffleDecorations}
            style={{ width: '100%', maxWidth: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <FiRefreshCw /> Shuffle Decorations
          </button>

          {/* Export / Share actions */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '440px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('png')}>
              <FiDownload style={{ marginRight: '6px' }} /> Download PNG
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleDownload('jpg')}>
              <FiDownload style={{ marginRight: '6px' }} /> Download JPG
            </button>
            <button className="btn btn-secondary" onClick={() => setSharingOpen(!sharingOpen)}>
              <FiShare2 />
            </button>
          </div>

          {sharingOpen && (
            <div className="glass-panel animate-fade-in" style={{ padding: '14px', borderRadius: '12px', width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'space-around' }}>
              <a href={`https://api.whatsapp.com/send?text=You%20are%20invited%20to%20our%20event!`} target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', fontSize: '20px' }}><FiMessageCircle /></a>
              <a href={`mailto:?subject=Invitation&body=You%20are%20invited!`} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontSize: '20px' }}><FiMail /></a>
              <button onClick={copyShareLink} style={{ background: 'none', border: 'none', color: '#06b6d4', fontSize: '20px', cursor: 'pointer' }}><FiCopy /></button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) { .tool-page-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
