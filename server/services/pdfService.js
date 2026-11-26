import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import XLSX from 'xlsx';
import archiver from 'archiver';
import { performConversion } from './converter.js';
import { processAiTool } from './aiService.js';

const execFileAsync = promisify(execFile);

async function runQpdf(args) {
  try {
    await execFileAsync('qpdf', args, { timeout: 60000 });
    return true;
  } catch (err) {
    // qpdf exits with code 3 for warnings (e.g. recovered/repaired PDF) even when output succeeds
    if (err.code === 3) return true;
    throw new Error(err.stderr || err.message || 'qpdf operation failed');
  }
}

/**
 * Compresses, protects, unlocks, or repairs a PDF using qpdf + pdf-lib fallback.
 */
export async function handlePdfSecurityOrOptimize({ action, filePath, password, level = 'medium', uploadsDir }) {
  const outName = `pdf_${action}_${Date.now()}.pdf`;
  const outPath = path.join(uploadsDir, outName);

  if (action === 'protect') {
    if (!password) throw new Error('Password is required to protect the PDF.');
    await runQpdf(['--encrypt', password, password, '256', '--', filePath, outPath]);
    return { outputPath: outPath, ext: 'pdf', mimeType: 'application/pdf' };
  }

  if (action === 'unlock') {
    const args = password ? [`--password=${password}`, '--decrypt', filePath, outPath] : ['--decrypt', filePath, outPath];
    await runQpdf(args);
    return { outputPath: outPath, ext: 'pdf', mimeType: 'application/pdf' };
  }

  if (action === 'repair') {
    try {
      await runQpdf(['--warning-exit-0', filePath, outPath]);
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
        return { outputPath: outPath, ext: 'pdf', mimeType: 'application/pdf' };
      }
    } catch (e) {
      // Fallback: rebuild via pdf-lib
    }
    const bytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true, throwOnInvalidObject: false });
    const rebuilt = await pdfDoc.save({ useObjectStreams: true });
    fs.writeFileSync(outPath, rebuilt);
    return { outputPath: outPath, ext: 'pdf', mimeType: 'application/pdf' };
  }

  if (action === 'compress') {
    try {
      const qpdfArgs = level === 'high'
        ? ['--stream-data=compress', '--recompress-flate', '--compression-level=9', '--object-streams=generate', filePath, outPath]
        : ['--stream-data=compress', '--object-streams=generate', filePath, outPath];
      await runQpdf(qpdfArgs);
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
        return { outputPath: outPath, ext: 'pdf', mimeType: 'application/pdf' };
      }
    } catch (e) {
      // Fallback: pdf-lib object stream repack
    }
    const bytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const compressed = await pdfDoc.save({ useObjectStreams: true });
    fs.writeFileSync(outPath, compressed);
    return { outputPath: outPath, ext: 'pdf', mimeType: 'application/pdf' };
  }

  if (action === 'pdf-to-pdfa') {
    const bytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    pdfDoc.setTitle(pdfDoc.getTitle() || 'PDF/A Archival Document');
    pdfDoc.setProducer('All Tool Master PDF/A Engine');
    pdfDoc.setCreator('All Tool Master');
    const saved = await pdfDoc.save({ useObjectStreams: false });
    fs.writeFileSync(outPath, saved);
    return { outputPath: outPath, ext: 'pdf', mimeType: 'application/pdf' };
  }

  throw new Error(`Unsupported PDF action: ${action}`);
}

/**
 * Converts PDF to Word (.docx), Excel (.xlsx), PowerPoint (.pptx), or Markdown (.md),
 * and converts Word/Excel/PPT/HTML/CSV/Text to PDF.
 */
export async function handlePdfConversion({ action, filePath, mimeType, originalName, textInput, uploadsDir }) {
  const baseName = path.parse(originalName || 'document').name.replace(/[^a-zA-Z0-9_-]/g, '_');

  if (action === 'pdf-to-word') {
    const outPath = await performConversion(filePath, mimeType || 'application/pdf', 'docx', uploadsDir, originalName);
    return { outputPath: outPath, filename: `${baseName}.docx`, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  }

  if (action === 'word-to-pdf' || action === 'excel-to-pdf' || action === 'jpg-to-pdf') {
    const outPath = await performConversion(filePath, mimeType, 'pdf', uploadsDir, originalName);
    return { outputPath: outPath, filename: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  if (action === 'pdf-to-excel') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const lines = (pdfData.text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const rows = lines.map(line => line.split(/\s{2,}|\t|,/).map(c => c.trim()));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows.length ? rows : [['No text extracted']]);
    XLSX.utils.book_append_sheet(wb, ws, 'PDF_Data');
    const outPath = path.join(uploadsDir, `${baseName}_${Date.now()}.xlsx`);
    XLSX.writeFile(wb, outPath);
    return { outputPath: outPath, filename: `${baseName}.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
  }

  if (action === 'pdf-to-markdown') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const mdLines = (pdfData.text || '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .map(l => {
        if (!l) return '';
        if (l.length < 70 && l === l.toUpperCase() && /[A-Z]/.test(l)) return `## ${l}`;
        return l;
      });
    const outPath = path.join(uploadsDir, `${baseName}_${Date.now()}.md`);
    fs.writeFileSync(outPath, `# ${baseName}\n\n${mdLines.join('\n\n')}`, 'utf8');
    return { outputPath: outPath, filename: `${baseName}.md`, mimeType: 'text/markdown;charset=utf-8' };
  }

  if (action === 'html-to-pdf' || action === 'text-to-pdf' || action === 'csv-to-pdf') {
    let rawText = textInput || '';
    if (filePath && fs.existsSync(filePath)) {
      rawText = fs.readFileSync(filePath, 'utf8');
    }
    // Strip HTML tags cleanly if HTML
    const cleanText = action === 'html-to-pdf'
      ? rawText
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<\/(p|div|h[1-6]|li|tr|br)>/gi, '\n')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/[ \t]+/g, ' ')
          .trim()
      : rawText;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const lineHeight = 16;
    const margin = 50;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const maxWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const paragraphs = (cleanText || 'Empty document').split(/\r?\n/);
    for (const para of paragraphs) {
      const words = para.split(/\s+/);
      let line = '';
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine.replace(/[^\x20-\x7E]/g, '?'), fontSize);
        if (width > maxWidth && line) {
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          page.drawText(line.replace(/[^\x20-\x7E]/g, '?'), { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line.replace(/[^\x20-\x7E]/g, '?'), { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      }
      y -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();
    const outPath = path.join(uploadsDir, `${baseName}_${Date.now()}.pdf`);
    fs.writeFileSync(outPath, pdfBytes);
    return { outputPath: outPath, filename: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  if (action === 'powerpoint-to-pdf') {
    // Extract slide text from PPTX XML inside the zip and render clean PDF slides
    const unzipper = (await import('unzipper')).default;
    const dir = await unzipper.Open.file(filePath);
    const slideFiles = dir.files
      .filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f.path))
      .sort((a, b) => {
        const na = parseInt(a.path.match(/slide(\d+)\.xml/)[1], 10);
        const nb = parseInt(b.path.match(/slide(\d+)\.xml/)[1], 10);
        return na - nb;
      });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (let idx = 0; idx < slideFiles.length; idx++) {
      const xml = (await slideFiles[idx].buffer()).toString('utf8');
      const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1]).filter(Boolean);
      const page = pdfDoc.addPage([841.89, 595.28]); // Landscape 16:10 slide
      page.drawText(`Slide ${idx + 1}`, { x: 40, y: 550, size: 18, font: boldFont, color: rgb(0.05, 0.45, 0.65) });
      let y = 510;
      for (const t of texts) {
        if (y < 40) break;
        const safe = t.replace(/[^\x20-\x7E]/g, '?').slice(0, 110);
        page.drawText(`• ${safe}`, { x: 45, y, size: 13, font, color: rgb(0.15, 0.15, 0.15) });
        y -= 22;
      }
    }
    if (slideFiles.length === 0) {
      const page = pdfDoc.addPage([841.89, 595.28]);
      page.drawText('No readable slides found in PPTX.', { x: 40, y: 500, size: 14, font });
    }
    const outPath = path.join(uploadsDir, `${baseName}_${Date.now()}.pdf`);
    fs.writeFileSync(outPath, await pdfDoc.save());
    return { outputPath: outPath, filename: `${baseName}.pdf`, mimeType: 'application/pdf' };
  }

  if (action === 'pdf-to-powerpoint') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const chunks = (pdfData.text || 'Empty PDF').match(/[\s\S]{1,900}/g) || ['Empty PDF'];
    const outPath = path.join(uploadsDir, `${baseName}_${Date.now()}.pptx`);

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);

      const slideRels = chunks.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join('');
      const slideIds = chunks.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join('');
      const contentOverrides = chunks.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('');

      archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>${contentOverrides}</Types>`, { name: '[Content_Types].xml' });
      archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`, { name: '_rels/.rels' });
      archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldIdLst>${slideIds}</p:sldIdLst><p:sldSz cx="9144000" cy="6858000" type="screen4x3"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`, { name: 'ppt/presentation.xml' });
      archive.append(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${slideRels}</Relationships>`, { name: 'ppt/_rels/presentation.xml.rels' });

      chunks.forEach((chunk, i) => {
        const escaped = chunk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const paras = escaped.split(/\r?\n/).filter(Boolean).slice(0, 14).map(line => `<a:p><a:r><a:rPr lang="en-US" sz="1400"/><a:t>${line}</a:t></a:r></a:p>`).join('');
        const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/><p:sp><p:nvSpPr><p:cNvPr id="2" name="Content"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="457200" y="457200"/><a:ext cx="8229600" cy="5943600"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/>${paras}</p:txBody></p:sp></p:spTree></p:cSld></p:sld>`;
        archive.append(slideXml, { name: `ppt/slides/slide${i + 1}.xml` });
      });

      archive.finalize();
    });

    return { outputPath: outPath, filename: `${baseName}.pptx`, mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
  }

  throw new Error(`Unsupported conversion action: ${action}`);
}

/**
 * AI Intelligence for PDFs: Summarize, Translate, OCR, or Compare two PDFs.
 */
export async function handlePdfIntelligence({ action, files, targetLanguage = 'English', apiKey, uploadsDir }) {
  if (!files || files.length === 0) throw new Error('Please upload a PDF file.');

  if (action === 'ai-compare') {
    if (files.length < 2) throw new Error('Please upload 2 PDF files to compare.');
    const pdf1 = await pdfParse(fs.readFileSync(files[0].path));
    const pdf2 = await pdfParse(fs.readFileSync(files[1].path));
    const combined = `--- DOCUMENT 1 (${files[0].originalname}) ---\n${(pdf1.text || '').slice(0, 12000)}\n\n--- DOCUMENT 2 (${files[1].originalname}) ---\n${(pdf2.text || '').slice(0, 12000)}`;
    const result = await processAiTool({
      tool: 'ai-humanizer',
      textContent: `Compare Document 1 and Document 2 in detail. List: 1) Key Differences, 2) Added Content, 3) Removed Content, 4) Summary of Changes.\n\n${combined}`,
      apiKey,
      uploadsDir
    });
    return result;
  }

  const file = files[0];
  if (action === 'ai-summarize') {
    return await processAiTool({
      tool: 'ai-lecture-notes',
      filePath: file.path,
      mimeType: file.mimetype,
      textContent: 'Provide an executive summary, key takeaways, and structured section breakdown of this PDF.',
      apiKey,
      uploadsDir
    });
  }

  if (action === 'ai-translate') {
    return await processAiTool({
      tool: 'ai-transcript',
      filePath: file.path,
      mimeType: file.mimetype,
      textContent: `Translate the entire document text accurately into ${targetLanguage} while preserving structure and meaning.`,
      apiKey,
      uploadsDir
    });
  }

  if (action === 'ai-ocr') {
    let extracted = '';
    if (file.mimetype === 'application/pdf') {
      try {
        const parsed = await pdfParse(fs.readFileSync(file.path));
        extracted = (parsed.text || '').trim();
      } catch (e) {}
    }
    if (extracted.length > 40) return extracted;
    return await processAiTool({
      tool: 'ai-transcript',
      filePath: file.path,
      mimeType: file.mimetype,
      textContent: 'Perform high-accuracy OCR on this document/image and extract every single word, heading, number, and table cleanly.',
      apiKey,
      uploadsDir
    });
  }

  throw new Error(`Unsupported AI PDF action: ${action}`);
}
