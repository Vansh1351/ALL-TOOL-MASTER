import { downloadMedia } from '../services/downloader.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, 'output');
fs.mkdirSync(outputDir, { recursive: true });

// Set environment variables for testing
process.env.DOWNLOAD_PROXY = 'http://vcktlzbn:49y6wkpf7asl@31.59.20.176:6754';

console.log('Running test download...');
downloadMedia('https://www.instagram.com/p/DaVUc2JTufS', 'mp4', 'best', outputDir)
  .then(filePath => {
    console.log('Download succeeded!', filePath);
  })
  .catch(err => {
    console.error('Download failed:', err.message);
  });
