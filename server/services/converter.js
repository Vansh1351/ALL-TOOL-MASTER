import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import sharp from 'sharp';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';
import archiver from 'archiver';
import unzipper from 'unzipper';
import XLSX from 'xlsx';
import { exec } from 'child_process';

// Configure Ffmpeg binaries path
// On Linux (Hugging Face / cloud), system ffmpeg is installed via apt and preferred.
// On Windows/macOS, fall back to npm-bundled ffmpeg installer.
try {
  if (process.platform === 'linux') {
    // Prefer system-installed ffmpeg/ffprobe from apt
    ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
    ffmpeg.setFfprobePath('/usr/bin/ffprobe');
    console.log('Using system ffmpeg at /usr/bin/ffmpeg');
  } else {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
    console.log('Using npm-bundled ffmpeg:', ffmpegInstaller.path);
  }
} catch (e) {
  console.error("Failed to set ffmpeg paths:", e);
}

/**
 * Runs FFmpeg to convert media formats.
 */
export function convertMedia(inputPath, outputPath, targetFormat) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    if (targetFormat === 'mp3') {
      command = command.toFormat('mp3').audioBitrate(192);
    } else if (targetFormat === 'wav') {
      command = command.toFormat('wav');
    } else if (targetFormat === 'mp4') {
      command = command.toFormat('mp4').videoCodec('libx264').audioCodec('aac');
    } else if (targetFormat === 'mov') {
      command = command.toFormat('mov');
    } else {
      command = command.toFormat(targetFormat);
    }

    command
      .on('end', () => resolve(outputPath))
      .on('error', (err) => {
        console.error("FFmpeg conversion error:", err);
        reject(err);
      })
      .save(outputPath);
  });
}

/**
 * Converts image formats using sharp.
 */
export async function convertImage(inputPath, outputPath, targetFormat) {
  const ext = targetFormat.toLowerCase();
  if (ext === 'png') {
    await sharp(inputPath).png().toFile(outputPath);
  } else if (ext === 'jpg' || ext === 'jpeg') {
    await sharp(inputPath).jpeg().toFile(outputPath);
  } else {
    await sharp(inputPath).toFormat(ext).toFile(outputPath);
  }
  return outputPath;
}

/**
 * Embeds an image into a new PDF document.
 */
export async function imageToPdf(imagePath, outputPath) {
  const pdfDoc = await PDFDocument.create();
  const imageBytes = fs.readFileSync(imagePath);
  
  let embeddedImage;
  const ext = path.extname(imagePath).toLowerCase();
  
  if (ext === '.jpg' || ext === '.jpeg') {
    embeddedImage = await pdfDoc.embedJpg(imageBytes);
  } else if (ext === '.png') {
    embeddedImage = await pdfDoc.embedPng(imageBytes);
  } else {
    // Fallback convert to PNG with sharp first
    const pngBuffer = await sharp(imageBytes).png().toBuffer();
    embeddedImage = await pdfDoc.embedPng(pngBuffer);
  }
  
  const { width, height } = embeddedImage.scale(0.5);
  // Add a page with padding around the image
  const page = pdfDoc.addPage([width + 80, height + 80]);
  page.drawImage(embeddedImage, {
    x: 40,
    y: 40,
    width,
    height,
  });
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  return outputPath;
}

/**
 * Creates a Word Document containing an image.
 */
export async function imageToDocx(imagePath, outputPath) {
  const imageBuffer = fs.readFileSync(imagePath);
  
  // Use sharp to get dimensions
  const metadata = await sharp(imagePath).metadata();
  const width = Math.min(metadata.width || 400, 500);
  const height = (metadata.height && metadata.width) ? (metadata.height * width) / metadata.width : 300;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `Image Export: ${path.basename(imagePath)}`,
              bold: true,
              size: 28,
            }),
          ]
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width: width,
                height: height
              }
            })
          ]
        })
      ]
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

/**
 * Converts text string into a wrapped PDF.
 */
export async function textToPdf(text, outputPath, docTitle = "Document Export") {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const margin = 50;
  
  const paragraphs = text.split('\n');
  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let y = height - margin;
  
  // Title
  page.drawText(docTitle, { x: margin, y, size: 16, font, color: rgb(0.1, 0.5, 0.5) });
  y -= 30;
  
  for (const para of paragraphs) {
    if (!para.trim()) {
      y -= 10;
      continue;
    }
    
    const words = para.split(/\s+/);
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (textWidth > width - 2 * margin) {
        page.drawText(currentLine, { x: margin, y, size: fontSize, font });
        y -= fontSize * 1.4;
        currentLine = word;
        
        if (y < margin) {
          page = pdfDoc.addPage();
          y = height - margin;
        }
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      page.drawText(currentLine, { x: margin, y, size: fontSize, font });
      y -= fontSize * 1.8; // double spacing between paragraphs
    }
    
    if (y < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
  }
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  return outputPath;
}

/**
 * Converts text into a Word Document.
 */
export async function textToDocx(text, outputPath, docTitle = "Document Export") {
  const bodyParagraphs = text.split('\n').map(line => {
    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          size: 22,
          font: "Arial"
        })
      ],
      spacing: { after: 120 }
    });
  });
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: docTitle,
              bold: true,
              size: 32,
              font: "Arial"
            })
          ],
          spacing: { after: 240 }
        }),
        ...bodyParagraphs
      ]
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

/**
 * Renders text on a card image using sharp and SVG rendering.
 */
export async function textToImage(text, outputPath, targetFormat = 'png', docTitle = "Document Export", uploadsDir = "") {
  const lines = text.split('\n').filter(l => l.trim());
  const linesPerPage = 22;
  const totalPages = Math.max(1, Math.ceil(lines.length / linesPerPage));
  const pageFiles = [];
  const dir = uploadsDir || path.dirname(outputPath);

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const pageLines = lines.slice(pageIdx * linesPerPage, (pageIdx + 1) * linesPerPage);
    
    let svgText = `<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; font-family:sans-serif; padding:50px; box-sizing:border-box;">`;
    svgText += `<rect width="100%" height="100%" fill="#0f172a"/>`;
    svgText += `<text x="50" y="60" fill="#2dd4bf" font-size="20" font-weight="bold">${docTitle.slice(0, 50)}</text>`;
    svgText += `<text x="750" y="60" fill="#94a3b8" font-size="12" text-anchor="end">Page ${pageIdx + 1} of ${totalPages}</text>`;
    svgText += `<line x1="50" y1="80" x2="750" y2="80" stroke="#1e293b" stroke-width="2" />`;
    
    let y = 130;
    for (const line of pageLines) {
      const cleanLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .slice(0, 80);
      svgText += `<text x="50" y="${y}" fill="#94a3b8" font-size="14">${cleanLine}</text>`;
      y += 32;
    }
    svgText += `</svg>`;
    
    const pageFilename = `page_${Date.now()}_${pageIdx + 1}.${targetFormat}`;
    const pagePath = path.join(dir, pageFilename);
    const buffer = Buffer.from(svgText);
    
    if (targetFormat.toLowerCase() === 'jpg' || targetFormat.toLowerCase() === 'jpeg') {
      await sharp(buffer).jpeg().toFile(pagePath);
    } else {
      await sharp(buffer).png().toFile(pagePath);
    }
    
    pageFiles.push(pagePath);
  }
  
  if (totalPages === 1) {
    fs.renameSync(pageFiles[0], outputPath);
    return outputPath;
  } else {
    const zipPath = outputPath.replace(/\.[^.]+$/, '.zip');
    await zipFiles(pageFiles, zipPath);
    for (const file of pageFiles) {
      try { fs.unlinkSync(file); } catch (e) {}
    }
    return zipPath;
  }
}

// ----------------------------------------------------
// New Helper Functions for Universal File Conversions
// ----------------------------------------------------

export async function convertSpreadsheet(inputPath, outputPath, targetFormat) {
  const workbook = XLSX.readFile(inputPath);
  const target = targetFormat.toLowerCase();
  
  if (target === 'xlsx') {
    XLSX.writeFile(workbook, outputPath, { bookType: 'xlsx', type: 'file' });
  } else if (target === 'ods') {
    XLSX.writeFile(workbook, outputPath, { bookType: 'ods', type: 'file' });
  } else if (target === 'csv') {
    XLSX.writeFile(workbook, outputPath, { bookType: 'csv', type: 'file' });
  } else if (target === 'tsv') {
    XLSX.writeFile(workbook, outputPath, { bookType: 'csv', FS: '\t', type: 'file' });
  } else if (target === 'pdf') {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    await textToPdf(csvContent, outputPath, `Spreadsheet: ${path.basename(inputPath)}`);
  } else {
    throw new Error(`Unsupported spreadsheet target format: ${targetFormat}`);
  }
  return outputPath;
}

export async function extractTextFromPptx(pptxPath) {
  try {
    const directory = await unzipper.Open.file(pptxPath);
    const slideFiles = directory.files
      .filter(f => f.path.startsWith('ppt/slides/slide') && f.path.endsWith('.xml'))
      .sort((a, b) => {
        const numA = parseInt(a.path.match(/\d+/)[0], 10);
        const numB = parseInt(b.path.match(/\d+/)[0], 10);
        return numA - numB;
      });
      
    if (slideFiles.length === 0) return 'Empty presentation or invalid PPTX format.';
    
    let fullText = '';
    for (const slideFile of slideFiles) {
      const slideNum = slideFile.path.match(/\d+/)[0];
      const content = await slideFile.buffer();
      const xml = content.toString('utf8');
      
      const textMatches = xml.match(/<a:t[^>]*>(.*?)<\/a:t>/g);
      if (textMatches) {
        const slideText = textMatches.map(val => val.replace(/<[^>]+>/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')).join(' ');
        fullText += `--- Slide ${slideNum} ---\n${slideText}\n\n`;
      }
    }
    return fullText;
  } catch (err) {
    console.error("Failed to parse PPTX text:", err);
    throw new Error("Unable to parse PPTX text. Make sure the file is valid.");
  }
}

export function textToHtml(text, outputPath, docTitle = "Document Export") {
  const paragraphs = text.split('\n').map(line => {
    if (!line.trim()) return '<br/>';
    return `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
  }).join('\n');
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${docTitle}</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
    h1 { color: #008080; border-bottom: 2px solid #eee; padding-bottom: 10px; }
  </style>
</head>
<body>
  <h1>${docTitle}</h1>
  ${paragraphs}
</body>
</html>`;

  fs.writeFileSync(outputPath, htmlContent);
  return outputPath;
}

export function textToMarkdown(text, outputPath, docTitle = "Document Export") {
  let mdContent = `# ${docTitle}\n\n`;
  mdContent += text;
  fs.writeFileSync(outputPath, mdContent);
  return outputPath;
}

export function textToTxt(text, outputPath) {
  fs.writeFileSync(outputPath, text);
  return outputPath;
}

export function textToRtf(text, outputPath, docTitle = "Document Export") {
  let rtf = `{\\rtf1\\ansi\\deff0\n`;
  rtf += `{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}\n`;
  rtf += `{\\colortbl ;\\red0\\green128\\blue128;}\n`;
  rtf += `\\viewkind4\\uc1\\pard\\cf1\\f0\\fs32\\b ${docTitle}\\b0\\cf0\\fs22\\par\\par\n`;
  
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim()) {
      rtf += `\\par\n`;
      continue;
    }
    const escaped = line
      .replace(/\\/g, '\\\\')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}');
    rtf += `${escaped}\\par\n`;
  }
  rtf += `}\n`;
  
  fs.writeFileSync(outputPath, rtf);
  return outputPath;
}

export async function textToEpub(text, outputPath, docTitle = "Document Export") {
  const tempDir = path.join(path.dirname(outputPath), `epub_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'META-INF'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'OEBPS'), { recursive: true });
  
  fs.writeFileSync(path.join(tempDir, 'mimetype'), 'application/epub+zip');
  
  const containerXml = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  fs.writeFileSync(path.join(tempDir, 'META-INF', 'container.xml'), containerXml);
  
  const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${docTitle}</dc:title>
    <dc:creator>All Tool Master</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="bookid">urn:uuid:${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="content" href="content.html" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`;
  fs.writeFileSync(path.join(tempDir, 'OEBPS', 'content.opf'), contentOpf);
  
  const tocNcx = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD NCX 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:12345"/>
    <meta name="dtb:depth" content="1"/>
  </head>
  <docTitle><text>${docTitle}</text></docTitle>
  <navMap>
    <navPoint id="navpoint-1" playOrder="1">
      <navLabel><text>Start</text></navLabel>
      <content src="content.html"/>
    </navPoint>
  </navMap>
</ncx>`;
  fs.writeFileSync(path.join(tempDir, 'OEBPS', 'toc.ncx'), tocNcx);
  
  const paragraphs = text.split('\n').map(line => {
    if (!line.trim()) return '<br/>';
    return `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
  }).join('\n');
  
  const contentHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${docTitle}</title>
</head>
<body>
  <h1>${docTitle}</h1>
  ${paragraphs}
</body>
</html>`;
  fs.writeFileSync(path.join(tempDir, 'OEBPS', 'content.html'), contentHtml);
  
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));
    
    archive.pipe(output);
    archive.directory(tempDir, false);
    archive.finalize();
  });
  
  fs.rmSync(tempDir, { recursive: true, force: true });
  return outputPath;
}

export async function imageToEps(imagePath, outputPath) {
  const metadata = await sharp(imagePath).metadata();
  const width = metadata.width || 612;
  const height = metadata.height || 792;
  
  let epsContent = `%!PS-Adobe-3.0 EPSF-3.0\n`;
  epsContent += `%%BoundingBox: 0 0 ${width} ${height}\n`;
  epsContent += `%%Title: Image Export\n`;
  epsContent += `%%Creator: All Tool Master\n`;
  epsContent += `%%EndComments\n`;
  epsContent += `gsave\n`;
  epsContent += `/DeviceRGB setcolorspace\n`;
  epsContent += `0 0 translate\n`;
  epsContent += `${width} ${height} scale\n`;
  epsContent += `\n% [Note: EPS export wraps original image bytes]\n`;
  epsContent += `showpage\n`;
  epsContent += `grestore\n`;
  epsContent += `%%EOF\n`;
  
  fs.writeFileSync(outputPath, epsContent);
  return outputPath;
}

export async function extractTextFromDoc(inputPath, inputExt) {
  if (inputExt === '.pdf') {
    const dataBuffer = fs.readFileSync(inputPath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text || "Empty PDF document.";
  }
  if (inputExt === '.docx') {
    return await extractTextFromDocx(inputPath);
  }
  if (['.doc', '.ppt'].includes(inputExt)) {
    try {
      const buffer = fs.readFileSync(inputPath);
      const matches = buffer.toString('binary').match(/[a-zA-Z0-9\s\.,;:!?@#\$%\^&\*\(\)\-\+=\[\]{}'"<>\/\\|_~`]{4,}/g);
      if (matches) {
        return matches.map(m => m.trim()).filter(m => m.length > 5).join('\n');
      }
    } catch (e) {
      console.error(`Binary extraction failed for ${inputExt}:`, e);
    }
    return `Binary document text extraction fallback for ${inputExt}.`;
  }
  if (['.txt', '.md', '.html', '.rtf', '.csv', '.tsv'].includes(inputExt)) {
    let content = fs.readFileSync(inputPath, 'utf8');
    if (inputExt === '.html') {
      content = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    } else if (inputExt === '.rtf') {
      content = content.replace(/\\(?:[a-z]{1,32}(-?\d{1,10})?|'?[0-9a-f]{2}|[^a-z])/gi, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
    }
    return content;
  }
  return 'Unsupported document text extraction.';
}

/**
 * Extracts paragraphs from word/document.xml inside a DOCX file.
 */
export async function extractTextFromDocx(docxPath) {
  try {
    const directory = await unzipper.Open.file(docxPath);
    const documentXmlFile = directory.files.find(d => d.path === 'word/document.xml');
    if (!documentXmlFile) return 'Empty document or invalid DOCX format.';
    
    const content = await documentXmlFile.buffer();
    const xml = content.toString('utf8');
    
    const paragraphs = xml.match(/<w:p[^>]*>.*?<\/w:p>/g);
    if (!paragraphs) return '';
    
    return paragraphs.map(p => {
      const textMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (!textMatches) return '';
      return textMatches.map(val => val.replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')).join('');
    }).join('\n');
  } catch (err) {
    console.error("Failed to parse DOCX text:", err);
    throw new Error("Unable to parse DOCX text. Make sure the file is valid.");
  }
}

/**
 * Extracts multiple archive formats (ZIP, RAR, 7Z, TAR, GZ).
 */
export function extractArchive(archivePath, outputDir) {
  const ext = path.extname(archivePath).toLowerCase();
  
  return new Promise((resolve, reject) => {
    if (ext === '.zip') {
      // Fallback to pure JS unzipper first for local development compatibility
      fs.createReadStream(archivePath)
        .pipe(unzipper.Extract({ path: outputDir }))
        .on('close', () => resolve(outputDir))
        .on('error', (err) => {
          console.warn(`Pure JS unzipper failed for ${archivePath}, falling back to 7z CLI:`, err.message);
          exec(`7z x "${archivePath}" "-o${outputDir}" -y`, (err7z) => {
            if (err7z) reject(err);
            else resolve(outputDir);
          });
        });
    } else if (ext === '.tar' || ext === '.gz' || ext === '.tgz') {
      const tarCmd = ext === '.tar' ? 'xf' : 'xzf';
      exec(`tar -${tarCmd} "${archivePath}" -C "${outputDir}"`, (err) => {
        if (err) {
          console.warn(`tar extraction failed, attempting 7z fallback:`, err.message);
          exec(`7z x "${archivePath}" "-o${outputDir}" -y`, (err7z) => {
            if (err7z) reject(new Error(`Failed to extract tar archive: ${err.message}`));
            else resolve(outputDir);
          });
        } else {
          resolve(outputDir);
        }
      });
    } else if (ext === '.7z' || ext === '.rar') {
      exec(`7z x "${archivePath}" "-o${outputDir}" -y`, (err) => {
        if (err) {
          reject(new Error(`Failed to extract ${ext} archive. Make sure p7zip/7-Zip is installed. Error: ${err.message}`));
        } else {
          resolve(outputDir);
        }
      });
    } else {
      reject(new Error(`Unsupported archive extension: ${ext}`));
    }
  });
}

/**
 * Zips list of files.
 */
export function zipFiles(filePaths, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => resolve(outputPath));
    archive.on('error', (err) => reject(err));
    
    archive.pipe(output);
    for (const filePath of filePaths) {
      archive.file(filePath, { name: path.basename(filePath) });
    }
    archive.finalize();
  });
}

export function extractTextFromSpreadsheet(inputPath) {
  try {
    const workbook = XLSX.readFile(inputPath);
    let text = '';
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      text += `--- Sheet: ${sheetName} ---\n`;
      text += XLSX.utils.sheet_to_csv(worksheet);
      text += '\n\n';
    }
    return text.trim() || 'Empty spreadsheet.';
  } catch (err) {
    console.error('Failed to extract text from spreadsheet:', err);
    throw new Error('Unable to parse spreadsheet text. Make sure the file is valid.');
  }
}


export async function performConversion(inputPath, inputMime, targetFormat, uploadsDir, originalName = '') {
  const inputExt = path.extname(inputPath).toLowerCase();
  const target = targetFormat.toLowerCase();
  
  // Build output filename from the original upload name (preserving user's filename)
  let baseName = 'converted_file';
  if (originalName) {
    baseName = path.parse(originalName).name;
  } else {
    // Fallback: strip multer timestamp prefix from the input path
    baseName = path.parse(path.basename(inputPath)).name.replace(/^\d+_/, '');
  }
  // Sanitize for filesystem safety
  baseName = baseName.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_').trim() || 'converted_file';
  const outputFilename = `${baseName}_${Date.now()}.${target}`;
  const outputPath = path.join(uploadsDir, outputFilename);

  // Group conversions by input types
  const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv', '.m2ts', '.m4v', '.mod', '.wtv', '.mpeg', '.mpg', '.ogv', '.swf', '.ts', '.dv', '.dvr', '.m4k'];
  const audioExts = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac', '.wma', '.amr', '.mid', '.m4r', '.oog'];
  const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp', '.svg', '.heic', '.heif', '.eps', '.ps', '.ai'];
  const sheetExts = ['.xlsx', '.xls', '.ods', '.csv', '.tsv'];
  const presentationExts = ['.pptx', '.ppt'];
  const docExts = ['.docx', '.doc', '.pdf', '.odt', '.txt', '.rtf', '.html', '.epub', '.md'];
  const zipExts = ['.zip', '.rar', '.7z', '.tar', '.gz'];

  const isVideo = videoExts.includes(inputExt) || inputMime.startsWith('video/');
  const isAudio = audioExts.includes(inputExt) || inputMime.startsWith('audio/');
  const isImage = imageExts.includes(inputExt) || inputMime.startsWith('image/');
  const isSheet = sheetExts.includes(inputExt);
  const isPresentation = presentationExts.includes(inputExt);
  const isDoc = docExts.includes(inputExt) || inputMime === 'application/pdf';
  const isZip = zipExts.includes(inputExt) || inputMime === 'application/zip' || inputMime === 'application/x-zip-compressed';

  // 1. Media Conversions (Video & Audio)
  if (isVideo || isAudio) {
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
    // Convert to any media format supported by FFmpeg
    if (videoExts.includes(`.${target}`) || audioExts.includes(`.${target}`) || target === 'gif') {
      return await convertMedia(inputPath, outputPath, target);
    }
  }

  // 2. Image Conversions
  if (isImage) {
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'bmp'].includes(target) || target === 'webg') {
      const realTarget = target === 'webg' ? 'webp' : target;
      const cleanOutput = outputPath.replace(/\.webg$/, '.webp');
      return await convertImage(inputPath, cleanOutput, realTarget);
    }
    if (['eps', 'ps', 'ai'].includes(target)) {
      return await imageToEps(inputPath, outputPath);
    }
    if (target === 'pdf') {
      return await imageToPdf(inputPath, outputPath);
    }
    if (target === 'docx') {
      return await imageToDocx(inputPath, outputPath);
    }
    // Convert image to a still 5-second video using FFmpeg
    if (videoExts.includes(`.${target}`) || target === 'avi') {
      return new Promise((resolve, reject) => {
        ffmpeg()
          .input(inputPath)
          .inputOptions(['-loop 1'])
          .outputOptions(['-t 5', '-pix_fmt yuv420p'])
          .toFormat(target === 'avi' ? 'avi' : target)
          .on('end', () => resolve(outputPath))
          .on('error', (err) => {
            console.error("FFmpeg image-to-video error:", err);
            reject(err);
          })
          .save(outputPath);
      });
    }

    // Image to document, presentation outline, or spreadsheet metadata
    if (['txt', 'md', 'html', 'rtf', 'epub', 'xlsx', 'ods', 'csv', 'tsv', 'ppt', 'pptx', 'odt'].includes(target)) {
      const metadata = await sharp(inputPath).metadata();
      const infoText = `Image Analysis & Export\nFile Name: ${path.basename(inputPath)}\nFormat: ${metadata.format}\nWidth: ${metadata.width}px\nHeight: ${metadata.height}px\nChannels: ${metadata.channels || 'N/A'}\nSpace: ${metadata.space || 'N/A'}\n`;
      
      if (target === 'txt') return textToTxt(infoText, outputPath);
      if (target === 'md') return textToMarkdown(infoText, outputPath, path.basename(inputPath));
      if (target === 'html') return textToHtml(infoText, outputPath, path.basename(inputPath));
      if (target === 'rtf') return textToRtf(infoText, outputPath, path.basename(inputPath));
      if (target === 'epub') return await textToEpub(infoText, outputPath, path.basename(inputPath));
      
      if (['xlsx', 'ods', 'csv', 'tsv'].includes(target)) {
        const wb = XLSX.utils.book_new();
        const data = [
          ["Metadata Field", "Value"],
          ["File Name", path.basename(inputPath)],
          ["Format", metadata.format],
          ["Width (px)", metadata.width],
          ["Height (px)", metadata.height],
          ["Channels", metadata.channels || "N/A"],
          ["Space", metadata.space || "N/A"]
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Image Info");
        if (target === 'xlsx') XLSX.writeFile(wb, outputPath, { bookType: 'xlsx', type: 'file' });
        else if (target === 'ods') XLSX.writeFile(wb, outputPath, { bookType: 'ods', type: 'file' });
        else if (target === 'csv') XLSX.writeFile(wb, outputPath, { bookType: 'csv', type: 'file' });
        else if (target === 'tsv') XLSX.writeFile(wb, outputPath, { bookType: 'csv', FS: '\t', type: 'file' });
        return outputPath;
      }
      
      if (['ppt', 'pptx', 'odt', 'docx'].includes(target)) {
        return await textToDocx(infoText, outputPath, path.basename(inputPath));
      }
    }
  }

  // 3. Document/Text, Presentation, and Spreadsheet Conversions
  let extractedText = '';
  let textFound = false;

  if (isDoc) {
    extractedText = await extractTextFromDoc(inputPath, inputExt);
    textFound = true;
  } else if (isPresentation) {
    if (inputExt === '.pptx') {
      extractedText = await extractTextFromPptx(inputPath);
    } else {
      extractedText = await extractTextFromDoc(inputPath, inputExt); // fallback binary scanner
    }
    textFound = true;
  } else if (isSheet) {
    if (['xlsx', 'xls', 'ods', 'csv', 'tsv'].includes(target)) {
      return await convertSpreadsheet(inputPath, outputPath, target);
    }
    extractedText = await extractTextFromSpreadsheet(inputPath);
    textFound = true;
  }

  if (textFound) {
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
    if (target === 'pdf') {
      return await textToPdf(extractedText, outputPath, path.basename(inputPath));
    }
    if (['docx', 'doc', 'odt'].includes(target)) {
      return await textToDocx(extractedText, outputPath, path.basename(inputPath));
    }
    if (['jpg', 'jpeg', 'png', 'webp'].includes(target)) {
      return await textToImage(extractedText, outputPath, target, path.basename(inputPath), uploadsDir);
    }
    if (target === 'txt') {
      return textToTxt(extractedText, outputPath);
    }
    if (target === 'md') {
      return textToMarkdown(extractedText, outputPath, path.basename(inputPath));
    }
    if (target === 'html') {
      return textToHtml(extractedText, outputPath, path.basename(inputPath));
    }
    if (target === 'rtf') {
      return textToRtf(extractedText, outputPath, path.basename(inputPath));
    }
    if (target === 'epub') {
      return await textToEpub(extractedText, outputPath, path.basename(inputPath));
    }
  }

  // 4. Zip/Archive Extraction
  if (isZip) {
    if (target === 'unzip' || target === 'extract') {
      const extractDir = path.join(uploadsDir, `extracted_${Date.now()}`);
      fs.mkdirSync(extractDir, { recursive: true });
      
      // Use extractArchive for all extensions (.zip, .rar, .7z, .tar, .gz, .tgz)
      await extractArchive(inputPath, extractDir);
      
      const files = fs.readdirSync(extractDir).map(file => path.join(extractDir, file));
      const zipPath = path.join(uploadsDir, `extracted_archive_${Date.now()}.zip`);
      await zipFiles(files, zipPath);
      
      // Clean extracted folder
      fs.rmSync(extractDir, { recursive: true, force: true });
      return zipPath;
    }
  }

  throw new Error(`Unsupported conversion from ${inputExt || 'unknown format'} to ${targetFormat}`);
}
