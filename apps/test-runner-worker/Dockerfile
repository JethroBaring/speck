# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install Playwright dependencies and system packages
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    curl \
    bash

# Let Playwright download its own browser binaries

# Set environment variables for Hugging Face
ENV PORT=7860
ENV HUGGINGFACE_HUB_CACHE=/tmp/huggingface_cache

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p screenshots /tmp/huggingface_cache

# Set proper permissions
RUN chmod -R 755 /app

# Expose port (Hugging Face uses 7860 by default)
EXPOSE 7860

# Health check for Hugging Face
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:7860/health || exit 1

# Start the application
CMD ["node", "index.js"]



