import React from 'react';
import { 
  FiYoutube, FiMusic, FiImage, FiFileText, 
  FiFolderPlus, FiVideo, FiMic, FiCompass, 
  FiBookOpen, FiClock, FiSettings, FiVolume2,
  FiStar, FiBriefcase, FiPenTool, FiScissors,
  FiSliders, FiEdit3, FiGrid, FiCamera, FiCommand
} from 'react-icons/fi';

export const TOOLS_DATA = [
  {
    id: 'youtube-downloader',
    title: 'YouTube Downloader',
    desc: 'Extract MP4 video or MP3 audio from any YouTube, Shorts, or Vimeo URL.',
    icon: FiYoutube,
    color: '#ef4444',
    category: 'Downloader',
    routes: ['/downloader/youtube', '/downloader/vimeo', '/downloader/shorts'],
    keywords: [
      'youtube downloader', 'yt downloader', 'youtube to mp4', 'youtube to mp3', 'url to mp3', 'url to mp4', 
      'url to mp4/mp3 converter', 'mp4 to mp3 converter', 'video downloader', 'shorts downloader', 'vimeo downloader', 
      'free url to mp4 converter online', 'best youtube url to mp4 converter', 'how to convert video url to mp4 fast', 
      'safe url to mp4 converter no virus', 'download video from url to mp4 hd', 'bulk url to mp4 converter tool', 
      'download web video online', 'free url video downloader', 'link to video downloader web app', 
      'download streaming video from link', 'online browser video downloader', 'hd video downloader online free', 
      'extract video from link free', 'safe online video saver', 'cloud video downloader tool', 
      'fast media downloader web app', 'social media video downloader free', 'download video mp4 high quality', 
      'video link to mp3 downloader', 'best clip downloader online', 'save public videos online free', 
      'full hd video downloader web', 'video thumbnail downloader online', 'free shorts video downloader', 
      'download short video online from url', 'best free website to download videos using link', 
      'safe website to download videos without virus', 'direct url video downloader no ads', 
      'cloud-based video downloader and converter free', 'youtube video downloader online free', 
      'youtube shorts downloader mp4', 'youtube to mp3 converter hd', 'download youtube video without app', 
      'youtube downloader no watermark', 'convert youtube link to mp4', 'youtube audio downloader online', 
      'free youtube video converter', 'fast youtube mp3 downloader', 'online youtube downloader hd', 
      'youtube link downloader for mobile', 'save youtube video to gallery', 'best youtube downloader 2026', 
      'secure youtube downloader online', 'download youtube shorts instantly', 'youtube music downloader', 
      'youtube downloader free', 'youtube video saver'
    ]
  },
  {
    id: 'url-to-mp4',
    title: 'URL to MP4',
    desc: 'Download videos from FB, Instagram, TikTok, Vimeo, or Twitter directly to MP4.',
    icon: FiCompass,
    color: '#06b6d4',
    category: 'Downloader',
    routes: ['/downloader/facebook', '/downloader/instagram', '/downloader/tiktok', '/downloader/twitter'],
    keywords: [
      'url to mp4', 'facebook downloader', 'fb downloader', 'instagram downloader', 'ig downloader', 
      'tiktok downloader', 'vimeo downloader', 'twitter downloader', 'url to mp4/mp3 converter', 'video downloader', 
      'facebook video url to mp4 converter', 'instagram url to mp4 converter download', 'mobile url to mp4 converter app', 
      'tiktok url to mp4 converter no watermark', 'download reel video online from link', 'save public videos online free', 
      'download short video online from url', 'convert url to mp4 online free', 'best url to mp4 converter without watermark', 
      'download video from url as mp4', 'paste link and download mp4', 'free online url to mp4 downloader', 
      'convert website video to mp4 online', 'direct video url to mp4 converter', 'save streaming video as mp4', 
      'social media url to mp4 converter', 'hd mp4 downloader from link', 'convert video link into mp4', 
      'online video downloader mp4 free', 'convert web video to mp4 instantly', 'fast url to mp4 converter 2026', 
      'mobile url to mp4 downloader', 'browser based mp4 converter online', 'convert tiktok url to mp4', 
      'convert instagram link to mp4', 'facebook video url to mp4', 'twitter video downloader mp4', 
      'vimeo video to mp4 converter', 'youtube shorts to mp4 online', 'no signup url to mp4 converter', 
      'unlimited mp4 video downloader', 'high quality mp4 converter online', 'url video downloader', 
      'mp4 downloader online', 'online video downloader free', 'hd mp4 video downloader', 
      'save online video as mp4', 'video url converter', 'direct mp4 downloader', 'social media video downloader', 
      'website video downloader', 'convert website video to mp4', 'url to mp4 converter free', 
      'best url to mp4 converter', 'convert url to mp4 online', 'download video from url'
    ]
  },
  {
    id: 'mp4-to-mp3',
    title: 'MOV & MP4 Video Converter',
    desc: 'Convert uploaded MOV or MP4 video files to MP4, MOV, MP3, or WAV formats.',
    icon: FiMusic,
    color: '#ec4899',
    category: 'Converter',
    routes: ['/convert/mp4-to-mp3', '/convert/mp4-to-wav', '/convert/mov-to-mp4', '/convert/mp3-to-wav', '/convert/video-to-audio'],
    keywords: [
      'mp4 to mp3', 'mp4 to mp3 converter', 'mov to mp4', 'video converter', 'audio converter', 'file converter', 
      'mov converter', 'wav converter', 'media converter', 'convert flac to mp3 without losing quality', 
      'best video converter software for large 4k files', 'powerpoint presentation to mp4 video converter online', 
      'convert wav to mp3 converter', 'video to audio converter free', 'convert mkv to mp4 online', 
      'mov to mp4 converter free', 'online audio format encoder', 'compress mp4 video online', 
      'avi to mp4 converter high speed', 'm4a to mp3 tool free', 'extract audio from video online', 
      'fast way to change video format online', 'convert url to mp3 online free', 'best free url to mp3 converter', 
      'paste video link and download mp3', 'online audio extractor from url', 'video url to mp3 converter online', 
      'convert youtube url to mp3 free', 'instagram reel to mp3 converter', 'tiktok url to mp3 downloader', 
      'convert social media videos to mp3', 'free online mp3 downloader from link', 'convert video link to audio instantly', 
      'no watermark mp3 converter online', 'extract audio from video url', 'convert online video to mp3 hd', 
      'mp3 downloader from direct url', 'online url audio converter free', 'best mp3 converter for mobile', 
      'fast video to audio converter', 'unlimited url to mp3 converter', 'browser based mp3 converter', 
      'url to mp3 converter', 'best url to mp3 converter free', 'convert video link to mp3', 
      'youtube url to mp3', 'video to mp3 converter online', 'mp3 downloader free', 'extract audio from url', 
      'online mp3 converter', 'audio downloader online', 'convert url to audio', 'youtube mp3 downloader', 
      'free audio converter', 'mp3 extractor online', 'video audio downloader', 'music downloader mp3'
    ]
  },
  {
    id: 'image-converter',
    title: 'Universal Image Converter',
    desc: 'Batch convert between JPG, PNG, and PDF, or export image formats into DOCX structures.',
    icon: FiImage,
    color: '#3b82f6',
    category: 'Converter',
    routes: ['/convert/heic-to-jpg', '/convert/webp-to-png', '/convert/jpg-to-png', '/convert/png-to-jpg', '/convert/jpg-to-pdf', '/convert/png-to-pdf'],
    keywords: [
      'image converter', 'jpg to png', 'png to jpg', 'jpg to pdf', 'png to pdf', 'image to docx', 'file converter', 
      'picture converter', 'bulk image converter', 'document converter', 'how to convert HEIC to JPG online free', 
      'professional RAW image converter software review', 'webp to png converter online', 'convert jpg to png free', 
      'heic to jpg converter windows', 'online image format changer', 'convert svg to png free', 
      'batch image converter online', 'free gif maker from video', 'compress image without losing quality', 
      'jpg to webp optimizer free', 'raw image converter online', 'how to convert webp to jpg without software', 
      'convert png to jpg online free', 'image to text OCR converter', 'online image format converter', 
      'convert image to editable text', 'free image to word converter', 'AI image text extractor', 
      'image to png transparent converter', 'batch image converter online', 'convert image without losing quality', 
      'image compressor and converter tool', 'fast image conversion online', 'secure image converter free', 
      'photo format changer online', 'convert webp to png instantly', 'mobile image converter online', 
      'image to pdf', 'jpg to pdf', 'png to jpg', 'image converter', 'image to text', 'OCR image converter', 
      'image text extractor', 'photo to pdf', 'online image converter', 'image compressor', 'image resizer', 
      'png converter', 'jpg converter', 'convert image online', 'image OCR online', 
      'image to pdf converter without watermark', 'merge multiple jpg into pdf', 'convert photo to pdf on mobile', 
      'jpg to pdf under 200kb', 'compress and convert jpg to pdf', 'png and jpg to pdf converter', 
      'best image to pdf converter online', 'fast jpg to pdf converter free', 'high quality photo to pdf converter', 
      'online image document converter', 'no signup jpg to pdf tool', 'batch image to pdf converter', 
      'convert screenshots to pdf online', 'mobile friendly image to pdf tool'
    ]
  },
  {
    id: 'pdf-converter',
    title: 'PDF Document Converter',
    desc: 'Translate PDF to DOCX text structures, convert files, or compile text to PDF.',
    icon: FiFileText,
    color: '#10b981',
    category: 'Converter',
    routes: ['/convert/pdf-to-word', '/convert/pdf-to-docx', '/convert/docx-to-pdf', '/convert/word-to-pdf', '/convert/excel-to-pdf', '/convert/pdf-to-jpg'],
    keywords: [
      'pdf converter', 'pdf to docx', 'docx to pdf', 'text to pdf', 'document converter', 'file converter', 
      'pdf translator', 'word to pdf', 'pdf to word', 'best free PDF to Word converter software download', 
      'excel to pdf converter preserve formatting online', 'autocad dwg to pdf converter maintain precision', 
      'convert pdf to word free', 'word to pdf converter online', 'pdf to jpg converter free', 
      'convert excel to pdf online', 'png to pdf high quality', 'merge pdf files free online', 
      'compress pdf file size free', 'txt to pdf online converter', 'free epub to pdf converter', 
      'online document converter tool', 'epub to mobi converter for kindle formatting', 
      'convert pdf to editable word online', 'free pdf to word converter without signup', 
      'OCR pdf to word converter free', 'convert scanned pdf to docx', 'best pdf to word converter online', 
      'editable pdf converter for students', 'pdf to word without losing formatting', 'fast pdf to docx converter', 
      'secure pdf file converter online', 'online pdf editing and conversion tool', 'convert handwritten pdf to word', 
      'browser based pdf converter', 'unlimited pdf to word free', 'high quality pdf conversion online', 
      'AI pdf to word converter', 'pdf to word', 'pdf converter', 'free pdf to word converter', 
      'editable pdf converter', 'pdf to docx', 'OCR pdf converter', 'pdf editor online', 
      'word to pdf', 'pdf to jpg', 'pdf compressor', 'merge pdf online', 'online pdf tools', 
      'pdf text extractor', 'best pdf converter', 'pdf conversion tool'
    ]
  },
  {
    id: 'zip-extractor',
    title: 'ZIP, RAR & 7Z Archive Extractor',
    desc: 'Decompress uploaded ZIP, RAR, 7Z, TAR, or GZ archives, or bundle multiple assets into a zipped download.',
    icon: FiFolderPlus,
    color: '#f59e0b',
    category: 'Utility',
    routes: ['/utility/zip-extractor', '/utility/unzip', '/convert/zip-extractor'],
    keywords: [
      'zip extractor', 'zip archiver', 'unzip', 'zip files', 'extract zip', 'compress files', 'zip file converter', 
      'file archiver', 'zip extractor online free', 'extract zip files without software', 'online zip archive creator', 
      'compress files into zip online', 'free file archiver tool', 'batch zip extractor online', 'secure zip file opener', 
      'unzip large files online', 'browser based zip extractor', 'fast zip compressor tool', 'unzip files', 
      'zip converter', 'file compressor', 'archive extractor', 'zip opener', 'online unzip tool', 
      'zip file converter', 'extract zip online', 'compress files online', 'rar extractor', '7z extractor', 
      'extract rar', 'extract 7z', 'extract tar', 'tar extractor', 'gz extractor', 'unrar online', 'unzip 7z', 
      'rar reader', '7z opener', 'tar.gz extractor', 'tar.gz online unzip'
    ]
  },
  {
    id: 'ai-video-summarizer',
    title: 'AI Video Summarizer & Watcher',
    desc: 'Upload a video (or pass a URL) and let AI watch, analyze, and outline key takeaways.',
    icon: FiVideo,
    color: '#8b5cf6',
    category: 'AI Tool',
    routes: ['/ai-notes/video-summarizer', '/ai-notes/video-watcher'],
    keywords: [
      'ai video summarizer', 'video summarizer', 'video watcher', 'ai watcher', 'summarize video', 'ai summarizer', 
      'youtube summarizer', 'how to summarize long articles quickly with ai', 'AI video summarizer free online', 
      'summarize youtube video with AI', 'convert long video into notes', 'AI lecture video summarizer', 
      'automatic video notes generator', 'AI tool to summarize classes', 'summarize educational videos online', 
      'video to study notes AI', 'smart AI video analyzer', 'best AI summarizer for students', 
      'AI powered video recap tool', 'online video summary generator', 'convert webinar to notes', 
      'summarize podcast video instantly', 'AI video learning assistant', 'video summary ai', 'video summarizer ai'
    ]
  },
  {
    id: 'ai-transcript',
    title: 'Transcript Generator',
    desc: 'Extract and transcribe verbatim dialogue transcripts from audio or video recordings.',
    icon: FiClock,
    color: '#d946ef',
    category: 'AI Tool',
    routes: ['/ai-notes/transcript', '/ai-notes/speech-to-text'],
    keywords: [
      'transcript generator', 'transcribe audio', 'transcribe video', 'verbatim dialogue', 'audio to text', 
      'video to text', 'speech to text', 'free tools to convert audio to text automatically', 
      'AI transcript generator online free', 'convert video to transcript instantly', 'youtube transcript generator AI', 
      'audio to text converter online', 'free AI transcription tool', 'generate subtitles from video', 
      'speech to text AI converter', 'convert lecture recording to text', 'fast audio transcription online', 
      'meeting transcript generator AI', 'podcast transcript generator', 'video subtitle generator online', 
      'automatic transcription software free', 'AI caption generator for videos', 'convert mp3 to transcript online', 
      'ai transcript', 'ai transcription tool', 'audio transcript ai'
    ]
  },
  {
    id: 'ai-audio-analyzer',
    title: 'Audio Analyzer & Summarizer',
    desc: 'Upload audio or voice notes and analyze topics, arguments, tone, and conclusions.',
    icon: FiVolume2,
    color: '#14b8a6',
    category: 'AI Tool',
    routes: ['/ai-notes/audio-analyzer', '/ai-notes/voice-notes'],
    keywords: [
      'audio analyzer', 'audio summarizer', 'voice notes analyzer', 'summarize audio', 'analyze audio', 
      'voice memo analyzer', 'convert voice notes to text AI', 'ai audio analyzer', 'audio transcript ai', 
      'speech to text ai', 'audio analyzer', 'audio summarizer', 'voice notes analyzer', 'summarize audio', 
      'analyze audio', 'voice memo analyzer', 'convert voice notes to text AI'
    ]
  },
  {
    id: 'ai-lecture-notes',
    title: 'AI Lecture Note Taker',
    desc: 'Convert academic recordings or text notes into study notes, formulas, and Q&As.',
    icon: FiBookOpen,
    color: '#f43f5e',
    category: 'AI Tool',
    routes: ['/ai-notes/free-ai-note-taker', '/ai-notes/lecture-notes', '/ai-notes/study-guide'],
    keywords: [
      'ai lecture note taker', 'lecture notes', 'study notes', 'academic recordings converter', 'notes generator', 
      'audio to notes', 'best free AI lecture note taker', 'ai study notes helper free', 'automated study guide generator', 
      'free online toolkit for student productivity', 'AI lecture notes generator', 'convert lecture to study notes', 
      'AI note taker for students', 'summarize lecture recordings online', 'smart class notes generator', 
      'AI powered study assistant', 'generate notes from audio lectures', 'lecture transcription and notes AI', 
      'convert class recording to notes', 'best AI note taking tool', 'online lecture summary generator', 
      'AI study material creator', 'notes generator from youtube lectures', 'automatic lecture note maker', 
      'AI academic assistant free', 'ai lecture notes', 'ai note taker', 'ai study tools', 
      'ai lecture summarizer', 'ai notes generator'
    ]
  },
  {
    id: 'ai-meeting-minutes',
    title: 'AI Meeting Assistant & Minutes',
    desc: 'Transcribe meeting logs or voice clips into summary minutes and action items tables.',
    icon: FiMic,
    color: '#6366f1',
    category: 'AI Tool',
    routes: ['/ai-notes/meeting-minutes', '/ai-notes/meeting-assistant'],
    keywords: [
      'ai meeting assistant', 'meeting minutes', 'meeting logs transcriber', 'action items table', 'transcribe meeting', 
      'meeting summarizer', 'ai meeting assistant and note taking tools', 'ai transcription and summarization tools', 
      'ai minutes of meeting tool free', 'open source alternative to otter ai notes', 'AI meeting assistant online free', 
      'automatic meeting minutes generator', 'AI action item generator', 'convert meeting recording to notes', 
      'smart meeting summarizer AI', 'business meeting transcript generator', 'AI team collaboration assistant', 
      'online meeting notes generator', 'AI powered productivity tool', 'summarize zoom meetings automatically', 
      'generate meeting recap instantly', 'convert office recordings to text', 'AI voice meeting analyzer', 
      'professional meeting note taker', 'free AI business assistant online', 'ai meeting assistant', 
      'ai note taker', 'meeting minutes', 'meeting summarizer'
    ]
  },
  {
    id: 'pdf-to-brainrot',
    title: 'PDF to Gen-Z Brainrot Translator',
    desc: 'Upload dry PDF files or documents and translate summaries into hilarious Gen-Z slang.',
    icon: FiSettings,
    color: '#84cc16',
    category: 'AI Tool',
    routes: ['/ai-notes/brainrot-translator', '/ai-notes/brainrot'],
    keywords: [
      'pdf to gen-z brainrot translator', 'brainrot translator', 'gen-z slang', 'funny pdf translator',
      'slang translator', 'pdf to slang', 'brainrot'
    ]
  },
  {
    id: 'file-compressor',
    title: 'File Compressor',
    desc: 'Compress multiple files, folders, images, videos, or archives into a single ZIP with custom compression levels.',
    icon: FiFolderPlus,
    color: '#f97316',
    category: 'Utility',
    routes: ['/utility/file-compressor', '/utility/compress'],
    keywords: [
      'file compressor', 'compress files', 'zip compressor', 'reduce file size', 'compress images',
      'compress video', 'compress audio', 'compress folder', 'compress multiple files', 'bulk file compressor',
      'online file compressor free', 'compress files into zip', 'file size reducer', 'lossless compression',
      'compress pdf', 'compress png', 'compress jpg', 'compress mp4', 'compress mp3', 'compress zip',
      'online zip creator', 'multi file compressor', 'batch file compressor', 'file archiver',
      'compress documents online', 'free file compression tool', 'reduce zip file size'
    ]
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    desc: 'Build a professional ATS-friendly resume with live preview. Fill your details and download as PDF instantly.',
    icon: FiFileText,
    color: '#0ea5e9',
    category: 'Utility',
    routes: ['/utility/resume-builder', '/utility/cv-builder'],
    keywords: [
      'resume builder', 'cv builder', 'professional resume', 'ats resume', 'free resume maker',
      'online resume creator', 'resume template', 'resume download pdf', 'resume generator free',
      'build resume online', 'create cv online free', 'job resume builder', 'resume maker no signup',
      'professional cv creator', 'resume with live preview', 'resume pdf download', 'free resume templates',
      'build professional resume online', 'ats friendly resume builder', 'resume maker 2026'
    ]
  },
  {
    id: 'ai-script-writer',
    title: 'AI Script Writer',
    desc: 'Generate full professional scripts — movies, YouTube, podcasts, ads — from a title, genre, and premise.',
    icon: FiMic,
    color: '#a855f7',
    category: 'AI Tool',
    routes: ['/ai-notes/script-writer', '/ai-notes/screenplay-writer'],
    keywords: [
      'ai script writer', 'script writer', 'screenplay writer', 'script generator', 'ai screenplay generator',
      'movie script generator ai', 'youtube script writer', 'podcast script generator', 'ad script writer',
      'short film script generator', 'ai story writer', 'script writing tool free', 'generate full script ai',
      'professional script writer online', 'ai creative writing tool', 'script from title ai',
      'generate script from description', 'full script generator', 'ai screenplay writer free',
      'ai video script writer', 'content script generator ai', 'blog to script converter', 'script ai tool'
    ]
  },
  {
    id: 'ai-card-maker',
    title: 'AI Invitation & Card Maker',
    desc: 'Design custom greeting cards and invitations for weddings, birthdays, baby showers, and events with AI.',
    icon: FiEdit3,
    color: '#06b6d4',
    category: 'AI Tool',
    routes: [
      '/ai-card-maker',
      '/birthday-card-maker',
      '/anniversary-card-maker',
      '/event-card-maker',
      '/invitation-card-maker',
      '/wedding-card-maker',
      '/baby-shower-card-maker',
      '/housewarming-card-maker',
      '/festival-card-maker',
      '/thank-you-card-maker',
      '/farewell-card-maker',
      '/business-invitation-maker'
    ],
    keywords: [
      'ai card maker', 'card maker online', 'invitation maker', 'wedding card maker', 'birthday card maker',
      'wedding invitation templates', 'anniversary card maker', 'festival card creator', 'party invitations',
      'custom invitation maker free', 'baby shower invitation', 'housewarming invitation', 'farewell card maker'
    ]
  },
  {
    id: 'watermark-remover',
    title: 'AI Watermark Remover',
    desc: 'Erase distracting watermarks, logo overlays, timestamps, and screenshot markings from your photos.',
    icon: FiCamera,
    color: '#3b82f6',
    category: 'AI Tool',
    routes: [
      '/watermark-remover',
      '/remove-watermark-online',
      '/remove-logo-from-image',
      '/remove-text-from-image',
      '/remove-timestamp-from-photo'
    ],
    keywords: [
      'watermark remover', 'remove watermark from image', 'logo remover', 'remove text from image',
      'erase watermark online free', 'timestamp remover', 'cleanup screenshot markings', 'photo cleanup tool'
    ]
  },
  {
    id: 'object-remover',
    title: 'AI Object Remover',
    desc: 'Erase unwanted people, objects, vehicles, animals, or wires from your images using content-aware fill.',
    icon: FiSliders,
    color: '#10b981',
    category: 'AI Tool',
    routes: [
      '/object-remover',
      '/remove-person-from-photo',
      '/remove-object-from-photo',
      '/remove-unwanted-things-from-image'
    ],
    keywords: [
      'object remover', 'remove person from photo', 'remove object from image', 'erase wires from photo',
      'content aware fill online', 'photobomb remover', 'cleanup photos online free', 'erase distractions'
    ]
  },
  {
    id: 'background-remover',
    title: 'AI Background Remover',
    desc: 'Remove image backgrounds in one click, export transparent PNGs, or add new colors and gradients.',
    icon: FiScissors,
    color: '#ec4899',
    category: 'AI Tool',
    routes: [
      '/background-remover',
      '/remove-background-online',
      '/transparent-png-maker'
    ],
    keywords: [
      'background remover', 'remove background from image', 'transparent png maker', 'transparent background',
      'white background converter', 'change background online free', 'image cutout creator', 'png cutout maker'
    ]
  },
  {
    id: 'ai-logo-generator',
    title: 'AI Logo Generator',
    desc: 'Generate multiple unique logo concepts, branding typography, and slogans for your business with AI.',
    icon: FiPenTool,
    color: '#f59e0b',
    category: 'AI Tool',
    routes: [
      '/ai-logo-generator',
      '/logo-generator',
      '/free-logo-maker'
    ],
    keywords: [
      'ai logo generator', 'logo generator free', 'logo maker online', 'business logo creator',
      'branding generator', 'minimalist logo maker', 'create custom logo free', 'vector logo generator'
    ]
  },
  {
    id: 'qr-code-generator',
    title: 'Custom QR Code Generator',
    desc: 'Create styled QR codes for URLs, WiFi networks, business vCards, emails, and WhatsApp with custom colors and logos.',
    icon: FiCommand,
    color: '#14b8a6',
    category: 'Utility',
    routes: [
      '/qr-code-generator',
      '/free-qr-generator'
    ],
    keywords: [
      'qr code generator', 'custom qr code creator', 'wifi qr code generator', 'vcard qr code maker',
      'gradient qr code online', 'qr code with logo', 'free qr generator', 'create printable qr code'
    ]
  },
  {
    id: 'business-card-maker',
    title: 'Business Card Maker',
    desc: 'Design professional visiting cards with pre-aligned templates, company logos, and contact QR codes.',
    icon: FiBriefcase,
    color: '#0ea5e9',
    category: 'Utility',
    routes: [
      '/business-card-maker',
      '/visiting-card-maker'
    ],
    keywords: [
      'business card maker', 'visiting card creator', 'design business card online', 'printable business cards',
      'professional cv business cards', 'card layout templates', 'create visiting card free'
    ]
  },
  {
    id: 'youtube-thumbnail-maker',
    title: 'YouTube Thumbnail Maker',
    desc: 'Design high-CTR YouTube covers and thumbnails with bold outlined text overlays, templates, and backgrounds.',
    icon: FiGrid,
    color: '#ef4444',
    category: 'Utility',
    routes: [
      '/youtube-thumbnail-maker'
    ],
    keywords: [
      'youtube thumbnail maker', 'custom youtube cover creator', 'high ctr thumbnail generator',
      'thumbnail editor online free', 'youtube banner maker', 'add text outline to image thumbnail'
    ]
  }
];

export default function ToolGrid({ filterText, onSelectTool, bookmarks = [], toggleBookmark = () => {} }) {
  const filteredTools = React.useMemo(() => {
    const query = (filterText || '').toLowerCase().trim();
    if (!query) {
      return TOOLS_DATA;
    }

    // Platform name search terms that should bypass filtering and show all tools at the top
    const platformTerms = [
      'all', 'tool', 'tools', 'master', 
      'all tool', 'all tools', 'all tool master', 
      'alltool', 'alltools', 'alltoolmaster', 
      'all tool master website',
      'free all tools platform for file conversion',
      'universal file converter and ai productivity tools',
      'all-in-one digital utility hub for conversions',
      'free online file conversion and productivity platform',
      'universal ai productivity and file conversion tools',
      'all tools master platform for digital conversions',
      'complete file conversion and ai productivity suite',
      'free universal tools for file format conversion',
      'ai-powered productivity and file conversion platform',
      'comprehensive digital tools for universal conversion',
      'online video downloader and converter tools',
      'multi-format media conversion hub',
      'web-based productivity and conversion suite',
      'free digital utility and ai tools platform',
      'convert large files online free no registration',
      'multi functional utility web tools for developers',
      'best all-in-one file converter app web',
      'lightweight online document tool kit',
      'no-install video and audio utility platform'
    ];

    if (platformTerms.includes(query)) {
      return TOOLS_DATA;
    }

    return TOOLS_DATA
      .map(tool => {
        let score = 0;
        const title = tool.title.toLowerCase();
        const desc = tool.desc.toLowerCase();
        const category = tool.category.toLowerCase();
        const keywords = tool.keywords || [];

        // Exact title match: highest priority
        if (title === query) {
          score += 1000;
        } else if (title.includes(query)) {
          score += 500;
        }

        // Exact keyword match: very high priority
        const hasExactKeyword = keywords.some(kw => kw.toLowerCase() === query);
        if (hasExactKeyword) {
          score += 800;
        } else {
          // Substring/partial keyword match
          const keywordMatches = keywords.filter(kw => kw.toLowerCase().includes(query) || query.includes(kw.toLowerCase()));
          if (keywordMatches.length > 0) {
            score += 300 * keywordMatches.length;
          }
        }

        // Category match
        if (category === query) {
          score += 400;
        } else if (category.includes(query)) {
          score += 200;
        }

        // Description match
        if (desc.includes(query)) {
          score += 100;
        }

        return { ...tool, score };
      })
      .filter(tool => tool.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [filterText]);


  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800' }}>
            Featured <span className="text-gradient">Digital Tool Suite</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Fully responsive, lightning-fast tools designed to make conversions and AI tasks effortless.
          </p>
        </div>

        {/* Grid List */}
        {filteredTools.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)'
          }}>
            <h3>No tools matched your search</h3>
            <p style={{ fontSize: '14px', marginTop: '6px' }}>Try searching for generic terms like "PDF", "MP3", or "AI".</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }} className="tool-grid">
            {filteredTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <a
                  key={tool.id}
                  href={tool.routes ? tool.routes[0] : '#'}
                  className="glass-panel tool-card"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTool(tool);
                  }}
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    position: 'relative',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  {/* Category Badge & Icon */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${tool.color}15`,
                        color: tool.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px'
                      }}>
                        <IconComp />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge" style={{
                          background: 'var(--bg-grid)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-muted)'
                        }}>
                          {tool.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            toggleBookmark(tool.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: bookmarks.includes(tool.id) ? 'var(--accent-color)' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '16px',
                            padding: '4px',
                            transition: 'var(--transition-smooth)'
                          }}
                          title={bookmarks.includes(tool.id) ? 'Remove Bookmark' : 'Add Bookmark'}
                        >
                          <FiStar style={{ fill: bookmarks.includes(tool.id) ? 'var(--accent-color)' : 'none' }} />
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                      {tool.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      lineHeight: '1.5'
                    }}>
                      {tool.desc}
                    </p>
                  </div>

                  {/* Micro action prompt */}
                  <div style={{
                    marginTop: '20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }} className="card-cta">
                    Open Tool &rarr;
                  </div>
                </a>
              );
            })}
          </div>
        )}

      </div>

      <style>{`
        .tool-card {
          transform: translateY(0);
        }
        .tool-card:hover {
          transform: translateY(-5px);
        }
        .tool-card:hover .card-cta {
          gap: 8px !important;
        }
        @media (max-width: 640px) {
          .tool-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
