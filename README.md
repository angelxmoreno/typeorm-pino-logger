# TypeORM Pino Logger

A [Pino](https://github.com/pinojs/pino) logger adapter for [TypeORM](https://github.com/typeorm/typeorm) that provides structured logging with configurable options and advanced features.

[![npm version](https://badge.fury.io/js/typeorm-pino-logger.svg)](https://badge.fury.io/js/typeorm-pino-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 High-performance logging with Pino
- 📊 Structured JSON logging
- ⚙️ Configurable logging levels and options
- 🐌 Slow query detection and logging
- 📝 Query parameter logging with truncation
- 🔍 Migration and schema operation logging
- 🎯 Customizable context for all log entries
- 🔧 QueryRunner context extraction (connection, database, transaction status)
- ✂️ Automatic query truncation for large queries
- 🛡️ Type-safe implementation with TypeScript

## Quick Start

### Installation

```bash
bun add typeorm-pino-logger pino typeorm
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

## Documentation

📚 **[Full Documentation](https://angelxmoreno.github.io/typeorm-pino-logger/)** - Complete guides and examples

### Quick Links

- [🚀 **Getting Started**](https://angelxmoreno.github.io/typeorm-pino-logger/docs/intro) - Installation and basic usage
- [⚙️ **Configuration**](https://angelxmoreno.github.io/typeorm-pino-logger/docs/configuration) - All configuration options
- [📊 **Log Examples**](https://angelxmoreno.github.io/typeorm-pino-logger/docs/log-examples) - See what the logs look like
- [🔧 **Advanced Usage**](https://angelxmoreno.github.io/typeorm-pino-logger/docs/advanced-usage) - Advanced patterns and integrations
- [📖 **API Reference**](https://angelxmoreno.github.io/typeorm-pino-logger/docs/api) - Complete API documentation

## Development

```bash
# Install dependencies
bun install

# Build the project
bun run build

# Run tests
bun test

# Type checking
bun run check-types

# Linting
bun run lint
```

## License

MIT - See [LICENSE](LICENSE) for more information.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.