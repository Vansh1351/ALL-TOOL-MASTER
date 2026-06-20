FROM node:18-slim

# Install system dependencies (FFmpeg, Python3 for yt-dlp, and curl)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    p7zip-full \
    unrar-free \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp – use pipx-style override to bypass PEP 668 "externally managed environment"
RUN pip3 install --no-cache-dir --break-system-packages -U pip && \
    pip3 install --no-cache-dir --break-system-packages -U "yt-dlp[default,curl-cffi]"

# Create app directory
WORKDIR /app

# Pre-create writable directories
RUN mkdir -p /app/uploads /app/bin

# Install app dependencies (as root for native builds like sharp)
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Fix ALL ownership AFTER npm install & copy — ensures node_modules,
# uploads, bin, and all app files are writable by the runtime user.
# HuggingFace Spaces run containers as UID 1000 which maps to 'node'.
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Hugging Face Spaces run on port 7860
EXPOSE 7860
ENV PORT=7860
ENV NODE_ENV=production

# Start server
CMD ["node", "--expose-gc", "--max-old-space-size=4096", "server.js"]
