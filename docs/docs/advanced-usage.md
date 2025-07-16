---
sidebar_position: 4
---

# Advanced Usage

This guide covers advanced usage patterns and integration scenarios for TypeORM Pino Logger.

## Integration with Express/Fastify

### Express with Request ID Correlation

```typescript
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';

const app = express();

// Request ID middleware
app.use((req, res, next) => {
  req.requestId = uuidv4();
  next();
});

// Create logger with request context
app.use((req, res, next) => {
  const logger = pino().child({ requestId: req.requestId });
  req.logger = logger;
  
  // Create TypeORM logger with request context
  req.typeormLogger = new TypeOrmPinoLogger(logger, {
    context: {
      requestId: req.requestId,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }
  });
  
  next();
});

// Use in your routes
app.get('/users/:id', async (req, res) => {
  // Use the request-specific TypeORM logger
  const dataSource = getDataSource();
  dataSource.setOptions({
    ...dataSource.options,
    logger: req.typeormLogger
  });
  
  const user = await dataSource.getRepository(User).findOne({
    where: { id: req.params.id }
  });
  
  res.json(user);
});
```

### Fastify Integration

```typescript
import fastify from 'fastify';
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';

const server = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
});

// Register TypeORM logger as a plugin
server.register(async (fastify) => {
  const typeormLogger = new TypeOrmPinoLogger(fastify.log, {
    context: {
      service: 'api-server'
    }
  });
  
  fastify.decorate('typeormLogger', typeormLogger);
});

// Use in routes
server.get('/users/:id', async (request, reply) => {
  const dataSource = getDataSource();
  dataSource.setOptions({
    ...dataSource.options,
    logger: server.typeormLogger
  });
  
  const user = await dataSource.getRepository(User).findOne({
    where: { id: request.params.id }
  });
  
  return user;
});
```

## Multi-Database Logging

When working with multiple databases, you can create different logger instances:

```typescript
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';
import pino from 'pino';

const baseLogger = pino();

// Primary database logger
const primaryLogger = new TypeOrmPinoLogger(baseLogger, {
  context: {
    database: 'primary',
    connection: 'main'
  }
});

// Analytics database logger
const analyticsLogger = new TypeOrmPinoLogger(baseLogger, {
  logQueries: false,        // Disable query logging for analytics
  logSlowQueries: true,     // Only log slow queries
  slowQueryThreshold: 5000, // 5 second threshold
  context: {
    database: 'analytics',
    connection: 'readonly'
  }
});

// Cache database logger
const cacheLogger = new TypeOrmPinoLogger(baseLogger, {
  logQueries: false,        // Disable all query logging for cache
  logSlowQueries: false,
  logQueryErrors: true,     // Only log errors
  context: {
    database: 'cache',
    connection: 'redis'
  }
});

// Configure data sources
const primaryDataSource = new DataSource({
  name: 'primary',
  type: 'postgres',
  // ... config
  logger: primaryLogger
});

const analyticsDataSource = new DataSource({
  name: 'analytics',
  type: 'postgres',
  // ... config
  logger: analyticsLogger
});
```

## Environment-Specific Configuration

### Development Environment

```typescript
const createDevelopmentLogger = () => {
  const logger = pino({
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  });

  return new TypeOrmPinoLogger(logger, {
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
};
```

### Production Environment

```typescript
const createProductionLogger = () => {
  const logger = pino({
    level: 'info',
    // No transport in production - use stdout
  });

  return new TypeOrmPinoLogger(logger, {
    logQueries: false,           // Disable normal query logging
    logSlowQueries: true,        // Log slow queries
    slowQueryThreshold: 2000,    // Queries > 2 seconds
    logQueryErrors: true,        // Always log errors
    logSchemaOperations: false,  // Disable schema logging
    logMigrations: true,         // Keep migration logging
    maxQueryLength: 500,         // Shorter for production
    context: {
      environment: 'production',
      service: process.env.SERVICE_NAME,
      version: process.env.npm_package_version
    }
  });
};
```

## Integration with Monitoring Systems

### Prometheus Metrics

```typescript
import { register, Counter, Histogram } from 'prom-client';
import pino from 'pino';
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';

const queryCounter = new Counter({
  name: 'typeorm_queries_total',
  help: 'Total number of TypeORM queries',
  labelNames: ['type', 'database']
});

const queryDuration = new Histogram({
  name: 'typeorm_query_duration_seconds',
  help: 'Duration of TypeORM queries',
  labelNames: ['type', 'database']
});

// Custom logger that also records metrics
class MetricsTypeOrmPinoLogger extends TypeOrmPinoLogger {
  logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    super.logQuery(query, parameters, queryRunner);
    queryCounter.inc({ type: 'query', database: queryRunner?.connection?.name || 'default' });
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    super.logQuerySlow(time, query, parameters, queryRunner);
    queryDuration.observe({ type: 'slow', database: queryRunner?.connection?.name || 'default' }, time / 1000);
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    super.logQueryError(error, query, parameters, queryRunner);
    queryCounter.inc({ type: 'error', database: queryRunner?.connection?.name || 'default' });
  }
}

const logger = pino();
const typeormLogger = new MetricsTypeOrmPinoLogger(logger, {
  context: {
    service: 'my-api'
  }
});
```

### OpenTelemetry Integration

```typescript
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';

class TracingTypeOrmPinoLogger extends TypeOrmPinoLogger {
  logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    const tracer = trace.getTracer('typeorm-pino-logger');
    const span = tracer.startSpan('db.query', {
      attributes: {
        'db.statement': query,
        'db.system': 'postgresql', // or your database type
        'db.name': queryRunner?.connection?.options?.database
      }
    });

    context.with(trace.setSpan(context.active(), span), () => {
      super.logQuery(query, parameters, queryRunner);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    });
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    const tracer = trace.getTracer('typeorm-pino-logger');
    const span = tracer.startSpan('db.query.error', {
      attributes: {
        'db.statement': query,
        'db.system': 'postgresql',
        'db.name': queryRunner?.connection?.options?.database
      }
    });

    context.with(trace.setSpan(context.active(), span), () => {
      super.logQueryError(error, query, parameters, queryRunner);
      span.setStatus({ 
        code: SpanStatusCode.ERROR,
        message: typeof error === 'string' ? error : error.message
      });
      span.end();
    });
  }
}
```

## Custom Log Processing

### Log Filtering

```typescript
import { Transform } from 'stream';
import pino from 'pino';

// Filter out sensitive queries
const filterSensitiveQueries = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const log = JSON.parse(chunk);
    
    // Filter out password-related queries
    if (log.query && log.query.includes('password')) {
      log.query = '[FILTERED - Contains sensitive data]';
      delete log.parameters;
    }
    
    callback(null, JSON.stringify(log) + '\n');
  }
});

const logger = pino({
  transport: {
    target: 'pino/file',
    options: {
      destination: process.stdout
    }
  }
}).child({}, {
  transport: filterSensitiveQueries
});

const typeormLogger = new TypeOrmPinoLogger(logger);
```

### Log Aggregation

```typescript
// Aggregate slow queries for periodic reporting
class AggregatingTypeOrmPinoLogger extends TypeOrmPinoLogger {
  private slowQueries: Array<{ query: string; time: number; timestamp: Date }> = [];

  logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    super.logQuerySlow(time, query, parameters, queryRunner);
    
    this.slowQueries.push({
      query: query.substring(0, 100), // Truncate for aggregation
      time,
      timestamp: new Date()
    });

    // Report aggregated data every 100 slow queries
    if (this.slowQueries.length >= 100) {
      this.reportSlowQueries();
    }
  }

  private reportSlowQueries() {
    const avgTime = this.slowQueries.reduce((sum, q) => sum + q.time, 0) / this.slowQueries.length;
    const maxTime = Math.max(...this.slowQueries.map(q => q.time));
    
    this.logger.info({
      type: 'slow-query-report',
      count: this.slowQueries.length,
      avgTime,
      maxTime,
      timeRange: {
        start: this.slowQueries[0].timestamp,
        end: this.slowQueries[this.slowQueries.length - 1].timestamp
      }
    }, 'Slow query report');

    this.slowQueries = [];
  }
}
```

## Testing with TypeORM Pino Logger

```typescript
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';
import pino from 'pino';

// Create a test logger that captures logs
const createTestLogger = () => {
  const logs: any[] = [];
  
  const logger = pino({
    transport: {
      target: 'pino/file',
      options: {
        destination: {
          write: (log: string) => {
            logs.push(JSON.parse(log));
          }
        }
      }
    }
  });

  return { logger, logs };
};

// Use in tests
describe('Database Operations', () => {
  it('should log slow queries', async () => {
    const { logger, logs } = createTestLogger();
    const typeormLogger = new TypeOrmPinoLogger(logger, {
      slowQueryThreshold: 100
    });

    // Configure your test database with the logger
    const dataSource = new DataSource({
      // ... test config
      logger: typeormLogger
    });

    // Perform slow operation
    await dataSource.query('SELECT pg_sleep(0.2)');

    // Assert log was created
    expect(logs).toHaveLength(1);
    expect(logs[0].type).toBe('slow-query');
    expect(logs[0].executionTime).toBeGreaterThan(100);
  });
});
```

These advanced patterns help you integrate TypeORM Pino Logger into complex applications with sophisticated logging, monitoring, and testing requirements.