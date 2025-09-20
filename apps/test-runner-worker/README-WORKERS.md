# Test Runner Workers

This directory contains specialized workers for the test execution system.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│  Execution      │    │  Database        │    │  Redis Pub/Sub  │
│  Worker         │    │  Worker          │    │  (UI Events)    │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│ test-execution- │    │ database-updates │    │ WebSocket       │
│ queue           │    │ -queue           │    │ Gateway         │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Workers

### 1. Execution Worker (`workers/execution.worker.js`)
- **Purpose**: Runs Playwright test cases
- **Queue**: `test-execution-queue`
- **Responsibilities**:
  - Execute test commands
  - Capture screenshots
  - Publish real-time UI events (Redis pub/sub)
  - Queue database updates (BullMQ)

### 2. Database Worker (`workers/database.worker.js`)
- **Purpose**: Handles all database operations reliably
- **Queue**: `database-updates-queue`
- **Responsibilities**:
  - Update test case status in database
  - Handle test completion results
  - Retry failed database operations
  - Ensure data persistence

## Running Workers

### Development
```bash
# Run execution worker
npm run dev:execution

# Run database worker  
npm run dev:database

# Run both (in separate terminals)
npm run dev:execution & npm run dev:database
```

### Production
```bash
# Run execution worker
npm run start:execution

# Run database worker
npm run start:database
```

## Event Flow

### Test Case Started
```
1. Execution Worker
   ├── Publishes to Redis: test-case-events (immediate UI update)
   └── Queues BullMQ job: database-updates-queue (reliable DB update)

2. UI Updates (Redis → WebSocket)
   └── Users see test started immediately (~1ms)

3. Database Worker (BullMQ)
   └── Updates database reliably (~5-20ms, with retries)
```

### Test Case Completed
```
1. Execution Worker
   ├── Publishes to Redis: test-case-events (immediate UI update)
   └── Queues BullMQ job: database-updates-queue (reliable DB update)

2. UI Updates (Redis → WebSocket)
   └── Users see results immediately (~1ms)

3. Database Worker (BullMQ)
   └── Saves results, step data, updates suite status (~5-20ms, with retries)
```

## Benefits

### Redis Pub/Sub (UI Events)
- ⚡ **Ultra-fast**: ~1ms latency
- 🎯 **Perfect for UI**: Real-time progress
- 💨 **Ephemeral**: Acceptable to lose
- 🔥 **High throughput**: No persistence overhead

### BullMQ (Database Operations)
- 💾 **Persistent**: Survives crashes
- 🔄 **Retry logic**: Automatic failure handling
- ⚖️ **Load balancing**: Multiple workers
- 📊 **Monitoring**: Built-in job tracking
- 🎯 **Exactly-once processing**

## Scaling

### Horizontal Scaling
```bash
# Run multiple database workers for high load
npm run start:database &
npm run start:database &
npm run start:database &

# Each worker processes jobs concurrently
# BullMQ automatically distributes load
```

### Monitoring
- Check queue stats via API: `GET /test-runner/queue/stats`
- Monitor failed jobs in BullMQ dashboard
- Track job completion rates

## Environment Variables

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# API Configuration
MAIN_API_URL=http://localhost:3000
```

## Error Handling

### Database Worker Failures
- **Automatic retries**: 3 attempts with exponential backoff
- **Failed job storage**: Keeps failed jobs for debugging
- **Graceful degradation**: UI still works if DB worker fails

### Execution Worker Failures
- **Test isolation**: One test failure doesn't affect others
- **Screenshot capture**: Error screenshots for debugging
- **Partial results**: Saves completed steps even if test fails




