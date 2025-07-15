# TypeORM Pino Logger

A [Pino](https://github.com/pinojs/pino) logger adapter for [TypeORM](https://github.com/typeorm/typeorm) that provides structured logging with configurable options and advanced features.

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

## Installation

```bash
bun add typeorm-pino-logger pino typeorm
```
or
```bash
yarn add typeorm-pino-logger pino typeorm
```
or
```bash
npm install typeorm-pino-logger pino typeorm
```

## Usage

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
  logging: true, // Enable TypeORM logging
  // ... other TypeORM options
});
```

### Advanced Configuration

```typescript
import { DataSource } from 'typeorm';
import pino from 'pino';
import { TypeOrmPinoLogger } from 'typeorm-pino-logger';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

const typeormLogger = new TypeOrmPinoLogger(logger, {
  logQueries: true,
  logSlowQueries: true,
  slowQueryThreshold: 500, // 500ms
  logQueryErrors: true,
  logSchemaOperations: false,
  logMigrations: true,
  maxQueryLength: 2000, // Truncate queries longer than 2000 characters
  context: {
    service: 'my-api',
    version: '1.0.0'
  }
});

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'mydb',
  logger: typeormLogger,
  logging: true, // Enable TypeORM logging
  // ... other options
});
```

## Configuration Options

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

## Log Output Examples

### Query Logging
```json
{
  "level": 20,
  "time": 1672531200000,
  "msg": "Executing query",
  "query": "SELECT * FROM users WHERE id = $1",
  "parameters": [123],
  "queryRunner": {
    "connectionName": "default",
    "database": "mydb",
    "isTransactionActive": false
  },
  "type": "query",
  "service": "my-api",
  "version": "1.0.0"
}
```

### Slow Query Logging
```json
{
  "level": 30,
  "time": 1672531200000,
  "msg": "Slow query detected (1500ms)",
  "query": "SELECT * FROM users u JOIN orders o ON u.id = o.user_id",
  "parameters": [],
  "executionTime": 1500,
  "threshold": 1000,
  "queryRunner": {
    "connectionName": "default",
    "database": "mydb",
    "isTransactionActive": false
  },
  "type": "slow-query",
  "service": "my-api",
  "version": "1.0.0"
}
```

### Query Error Logging
```json
{
  "level": 50,
  "time": 1672531200000,
  "msg": "Query failed",
  "query": "SELECT * FROM non_existent_table",
  "parameters": [],
  "error": "relation \"non_existent_table\" does not exist",
  "queryRunner": {
    "connectionName": "default",
    "database": "mydb",
    "isTransactionActive": false
  },
  "type": "query-error",
  "service": "my-api",
  "version": "1.0.0"
}
```

### Migration Logging
```json
{
  "level": 30,
  "time": 1672531200000,
  "msg": "Migration",
  "message": "CreateUserTable1672531200000 migration has been executed successfully",
  "queryRunner": {
    "connectionName": "default",
    "database": "mydb",
    "isTransactionActive": true
  },
  "type": "migration",
  "service": "my-api",
  "version": "1.0.0"
}
```

### Truncated Query Example
```json
{
  "level": 20,
  "time": 1672531200000,
  "msg": "Executing query",
  "query": "SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200)... (truncated)",
  "parameters": [],
  "type": "query"
}
```

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
bun run lint:fix

# Watch mode for development
bun run test:watch
```

## License

MIT - See [LICENSE](LICENSE) for more information.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.