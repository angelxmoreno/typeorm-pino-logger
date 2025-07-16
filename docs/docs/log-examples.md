---
sidebar_position: 3
---

# Log Output Examples

This page shows examples of the structured JSON logs that TypeORM Pino Logger produces.

## Query Logging

Regular queries are logged with the following structure:

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

## Slow Query Logging

Queries that exceed the configured threshold are logged with additional timing information:

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

## Query Error Logging

Failed queries are logged with error details:

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

## Schema Build Logging

Schema operations are logged during database initialization:

```json
{
  "level": 30,
  "time": 1672531200000,
  "msg": "Schema build",
  "message": "Creating table users",
  "queryRunner": {
    "connectionName": "default",
    "database": "mydb",
    "isTransactionActive": false
  },
  "type": "schema-build",
  "service": "my-api",
  "version": "1.0.0"
}
```

## Migration Logging

Migration operations are logged with details:

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

## Truncated Query Example

Long queries are automatically truncated based on the `maxQueryLength` configuration:

```json
{
  "level": 20,
  "time": 1672531200000,
  "msg": "Executing query",
  "query": "SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100)... (truncated)",
  "parameters": [],
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

## Log Levels

The logger uses different log levels based on the type of operation:

- **Debug (level 20)**: Regular query execution
- **Info (level 30)**: Schema builds, migrations, slow queries
- **Warn (level 40)**: General warnings
- **Error (level 50)**: Query failures and errors

## QueryRunner Context

All logs include `queryRunner` context with information about:

- `connectionName`: The name of the database connection
- `database`: The database name
- `isTransactionActive`: Whether the query is running within a transaction

## Custom Context

Any custom context you provide in the configuration will be included in all log entries:

```typescript
const typeormLogger = new TypeOrmPinoLogger(logger, {
  context: {
    service: 'user-service',
    version: '2.1.0',
    datacenter: 'us-west-2'
  }
});
```

Results in logs like:

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
  "service": "user-service",
  "version": "2.1.0",
  "datacenter": "us-west-2"
}
```

This structured logging makes it easy to search, filter, and analyze your database operations in log aggregation systems like ELK Stack, Splunk, or cloud logging services.