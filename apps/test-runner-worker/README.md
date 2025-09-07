# Test Runner Worker

A Playwright-based test execution worker that runs automated tests and captures screenshots.

## Features

- 🎭 Playwright-based test execution
- 📸 Automatic screenshot capture
- 🗄️ MinIO integration for file storage
- 🔄 BullMQ job processing
- 🐳 Docker support
- ☁️ Hugging Face Spaces ready

## Environment Variables

```bash
# MinIO Configuration
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# API Configuration
MAIN_API_URL=http://localhost:3000

# Worker Configuration
WORKER_ID=worker-1
WORKER_NAME=Test-Runner-Worker-1

# Server Configuration
PORT=7860
```

## API Endpoints

- `GET /` - Service information
- `GET /health` - Health check
- `GET /screenshots/*` - Serve screenshot files

## Docker Deployment

```bash
# Build the image
docker build -t test-runner-worker .

# Run the container
docker run -p 7860:7860 \
  -e MINIO_URL=your_minio_url \
  -e MINIO_ACCESS_KEY=your_access_key \
  -e MINIO_SECRET_KEY=your_secret_key \
  -e REDIS_HOST=your_redis_host \
  test-runner-worker
```

## Hugging Face Spaces

This application is configured for Hugging Face Spaces deployment:

- Uses port 7860 (Hugging Face default)
- Includes health check endpoint
- Optimized Docker image
- Proper environment variable handling

## Development

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Start worker
npm run worker
```
