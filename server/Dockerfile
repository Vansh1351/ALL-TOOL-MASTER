FROM node:18-slim

# Install system dependencies (FFmpeg, Python3 for yt-dlp, and curl)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp – use pipx-style override to bypass PEP 668 "externally managed environment"
RUN pip3 install --no-cache-dir --break-system-packages -U pip && \
    pip3 install --no-cache-dir --break-system-packages -U "yt-dlp[default,curl-cffi]"


# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Hugging Face Spaces run on port 7860
EXPOSE 7860
ENV PORT=7860
ENV NODE_ENV=production

# Start server using garbage collection flag and 4GB memory allocation
CMD ["node", "--expose-gc", "--max-old-space-size=4096", "server.js"]
