---
sidebar_position: 2
---

# Configuration Guide

TypeORM Pino Logger offers extensive configuration options to customize logging behavior for your application needs.

## Configuration Options

All configuration options are optional and have sensible defaults:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logQueries` | `boolean` | `true` | Log all executed queries |
| `logSlowQueries` | `boolean` | `true` | Log slow queries |
| `slowQueryThreshold` | `number` | `1000` | Threshold in milliseconds for slow queries |
| `logQueryErrors` | `boolean` | `true` | Log failed queries |
| `logSchemaOperations` | `boolean` | `true` | Log schema build operations |
| `logMigrations` | `boolean` | `true` | Log migration operations |
| `maxQueryLength` | `number` | `1000` | Maximum length for query logging (longer queries will be truncated) |
| `context` | `Record<string, unknown>` | `{}` | Additional context to include in all log entries |

## Basic Configuration

```typescript
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';
import pino from 'pino';

const logger = pino();
const typeormLogger = new TypeOrmPinoLogger(logger, {
  logQueries: true,
  logSlowQueries: true,
  slowQueryThreshold: 500, // 500ms
  logQueryErrors: true,
  logSchemaOperations: false,
  logMigrations: true,
  maxQueryLength: 2000,
  context: {
    service: 'my-api',
    version: '1.0.0'
  }
});
```

## Advanced Configuration

### Performance Optimization

For high-performance applications, you may want to disable certain logging:

```typescript
const typeormLogger = new TypeOrmPinoLogger(logger, {
  logQueries: false,           // Disable all query logging
  logSlowQueries: true,        // Only log slow queries
  slowQueryThreshold: 2000,    // Only queries > 2 seconds
  logQueryErrors: true,        // Always log errors
  logSchemaOperations: false,  // Disable schema logging
  logMigrations: true,         // Keep migration logging
});
```

### Development Configuration

For development, you might want more verbose logging:

```typescript
const typeormLogger = new TypeOrmPinoLogger(logger, {
  logQueries: true,
  logSlowQueries: true,
  slowQueryThreshold: 100,     // Log queries > 100ms
  logQueryErrors: true,
  logSchemaOperations: true,
  logMigrations: true,
  maxQueryLength: 5000,        // Longer queries for debugging
  context: {
    environment: 'development',
    debug: true
  }
});
```

### Production Configuration

For production, focus on errors and performance:

```typescript
const typeormLogger = new TypeOrmPinoLogger(logger, {
  logQueries: false,           // Disable normal query logging
  logSlowQueries: true,        // Log slow queries
  slowQueryThreshold: 1000,    // Queries > 1 second
  logQueryErrors: true,        // Always log errors
  logSchemaOperations: false,  // Disable schema logging
  logMigrations: true,         // Keep migration logging
  maxQueryLength: 500,         // Shorter for production
  context: {
    environment: 'production',
    service: 'my-api'
  }
});
```

## Custom Context

The `context` option allows you to add custom fields to all log entries:

```typescript
const typeormLogger = new TypeOrmPinoLogger(logger, {
  context: {
    service: 'user-service',
    version: '2.1.0',
    datacenter: 'us-west-2',
    instanceId: process.env.INSTANCE_ID,
    requestId: 'req-123'  // This could be dynamic
  }
});
```

## Query Truncation

Long queries can be truncated to prevent log bloat:

```typescript
const typeormLogger = new TypeOrmPinoLogger(logger, {
  maxQueryLength: 1000,  // Queries longer than 1000 chars will be truncated
});
```

Truncated queries will have `... (truncated)` appended to indicate truncation.

## Integration with Pino Configuration

You can also configure the underlying Pino logger:

```typescript
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  }
});

const typeormLogger = new TypeOrmPinoLogger(logger, {
  // Your TypeORM logger config
});
```

## Environment-Based Configuration

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';

const typeormLogger = new TypeOrmPinoLogger(logger, {
  logQueries: isDevelopment,
  logSlowQueries: true,
  slowQueryThreshold: isDevelopment ? 100 : 1000,
  logQueryErrors: true,
  logSchemaOperations: isDevelopment,
  logMigrations: true,
  maxQueryLength: isDevelopment ? 5000 : 1000,
  context: {
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  }
});
```