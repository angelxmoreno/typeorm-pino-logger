---
sidebar_position: 1
---

# Getting Started

Welcome to **TypeORM Pino Logger** - a high-performance logging adapter that brings structured JSON logging to your TypeORM applications.

## Quick Start

### Installation

```bash
bun add typeorm-pino-logger pino typeorm
```

Or with npm/yarn:

```bash
npm install typeorm-pino-logger pino typeorm
# or
yarn add typeorm-pino-logger pino typeorm
```

### Basic Usage

```typescript
import { DataSource } from 'typeorm';
import pino from 'pino';
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';

const logger = pino();
const typeormLogger = new TypeOrmPinoLogger(logger);

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'mydb',
  logger: typeormLogger,
  logging: true,
  // ... other TypeORM options
});
```

That's it! Your TypeORM queries will now be logged with structured JSON output.

## What's Next?

- [📖 **Configuration Guide**](./configuration) - Learn about all configuration options
- [📊 **Log Output Examples**](./log-examples) - See what the logs look like
- [🔧 **Advanced Usage**](./advanced-usage) - Advanced configuration and use cases
- [📚 **API Reference**](./api) - Complete API documentation
