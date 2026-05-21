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

// Configure Ffmpeg binaries path
try {
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  ffmpeg.setFfprobePath(ffprobeInstaller.path);
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
export async function textToImage(text, outputPath, targetFormat = 'png', docTitle = "Document Export") {
  const lines = text.split('\n').filter(l => l.trim()).slice(0, 18);
  
  let svgText = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; font-family:sans-serif; padding:40px; box-sizing:border-box;">`;
  // Slate background with teal accent
  svgText += `<rect width="100%" height="100%" fill="#0f172a"/>`;
  svgText += `<text x="40" y="60" fill="#2dd4bf" font-size="24" font-weight="bold">${docTitle.slice(0, 50)}</text>`;
  svgText += `<line x1="40" y1="80" x2="760" y2="80" stroke="#1e293b" stroke-width="2" />`;
  
  let y = 120;
  for (const line of lines) {
    const cleanLine = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .slice(0, 85);
    svgText += `<text x="40" y="${y}" fill="#94a3b8" font-size="14">${cleanLine}</text>`;
    y += 28;
  }
  
  if (text.split('\n').length > 18) {
    svgText += `<text x="40" y="${y + 10}" fill="#2dd4bf" font-size="12" font-style="italic">... [Truncated for preview]</text>`;
  }
  
  svgText += `</svg>`;
  
  const buffer = Buffer.from(svgText);
  if (targetFormat.toLowerCase() === 'jpg' || targetFormat.toLowerCase() === 'jpeg') {
    await sharp(buffer).jpeg().toFile(outputPath);
  } else {
    await sharp(buffer).png().toFile(outputPath);
  }
  return outputPath;
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
 * Unzips an archive.
 */
export function extractZip(zipPath, outputDir) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: outputDir }))
      .on('close', () => resolve(outputDir))
      .on('error', (err) => reject(err));
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

/**
 * Main orchestrator for conversions.
 */
export async function performConversion(inputPath, inputMime, targetFormat, uploadsDir) {
  const inputExt = path.extname(inputPath).toLowerCase();
  const outputFilename = `converted_${Date.now()}.${targetFormat.toLowerCase()}`;
  const outputPath = path.join(uploadsDir, outputFilename);

  // Group conversions by input types
  const isVideo = inputMime.startsWith('video/') || ['.mp4', '.mov', '.avi', '.mkv'].includes(inputExt);
  const isAudio = inputMime.startsWith('audio/') || ['.mp3', '.wav', '.ogg', '.aac', '.m4a'].includes(inputExt);
  const isImage = inputMime.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(inputExt);
  const isPdf = inputMime === 'application/pdf' || inputExt === '.pdf';
  const isDocx = inputMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || inputExt === '.docx';
  const isZip = inputMime === 'application/zip' || inputMime === 'application/x-zip-compressed' || inputExt === '.zip';

  // Output format options
  const target = targetFormat.toLowerCase();

  // 1. VIDEO Conversion
  if (isVideo) {
    if (['mp3', 'wav', 'mov', 'mp4'].includes(target)) {
      return await convertMedia(inputPath, outputPath, target);
    }
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
  }

  // 2. AUDIO Conversion
  if (isAudio) {
    if (['mp3', 'wav'].includes(target)) {
      return await convertMedia(inputPath, outputPath, target);
    }
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
  }

  // 3. IMAGE Conversion
  if (isImage) {
    if (['jpg', 'jpeg', 'png', 'webp'].includes(target)) {
      return await convertImage(inputPath, outputPath, target);
    }
    if (target === 'pdf') {
      return await imageToPdf(inputPath, outputPath);
    }
    if (target === 'docx') {
      return await imageToDocx(inputPath, outputPath);
    }
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
  }

  // 4. PDF Conversion
  if (isPdf) {
    const dataBuffer = fs.readFileSync(inputPath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text || "Empty PDF document.";

    if (['jpg', 'png', 'jpeg'].includes(target)) {
      return await textToImage(text, outputPath, target, path.basename(inputPath));
    }
    if (target === 'docx') {
      return await textToDocx(text, outputPath, path.basename(inputPath));
    }
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
  }

  // 5. DOCX Conversion
  if (isDocx) {
    const text = await extractTextFromDocx(inputPath);

    if (target === 'pdf') {
      return await textToPdf(text, outputPath, path.basename(inputPath));
    }
    if (['jpg', 'png', 'jpeg'].includes(target)) {
      return await textToImage(text, outputPath, target, path.basename(inputPath));
    }
    if (target === 'zip') {
      return await zipFiles([inputPath], outputPath);
    }
  }

  // 6. ZIP Extraction
  if (isZip) {
    if (target === 'unzip') {
      // Unzip to folder
      const extractDir = path.join(uploadsDir, `unzipped_${Date.now()}`);
      fs.mkdirSync(extractDir, { recursive: true });
      await extractZip(inputPath, extractDir);
      // Create a zip of extract files as a fallback download or return the folder path
      // In this setup, we'll zip it back or list files. The extractor unzips it,
      // and we return a single ZIP containing the unpacked files (as a download manager)
      const files = fs.readdirSync(extractDir).map(file => path.join(extractDir, file));
      const zipPath = path.join(uploadsDir, `unzipped_files_${Date.now()}.zip`);
      await zipFiles(files, zipPath);
      // clean folder
      fs.rmSync(extractDir, { recursive: true, force: true });
      return zipPath;
    }
  }

  throw new Error(`Unsupported conversion from ${inputExt} to ${targetFormat}`);
}
