# Interface: TypeOrmPinoLoggerOptions

Defined in: [types.ts:1](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L1)

## Properties

### logQueries?

> `optional` **logQueries**: `boolean`

Defined in: [types.ts:5](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L5)

Log all queries (default: true)

***

### logSlowQueries?

> `optional` **logSlowQueries**: `boolean`

Defined in: [types.ts:10](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L10)

Log slow queries (default: true)

***

### slowQueryThreshold?

> `optional` **slowQueryThreshold**: `number`

Defined in: [types.ts:15](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L15)

Slow query threshold in milliseconds (default: 1000)

***

### logQueryErrors?

> `optional` **logQueryErrors**: `boolean`

Defined in: [types.ts:20](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L20)

Log query errors (default: true)

***

### logSchemaOperations?

> `optional` **logSchemaOperations**: `boolean`

Defined in: [types.ts:25](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L25)

Log schema operations (default: true)

***

### logMigrations?

> `optional` **logMigrations**: `boolean`

Defined in: [types.ts:30](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L30)

Log migrations (default: true)

***

### maxQueryLength?

> `optional` **maxQueryLength**: `number`

Defined in: [types.ts:36](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L36)

Maximum length for query logging (queries longer than this will be truncated)

#### Default

```ts
1000
```

***

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [types.ts:41](https://github.com/angelxmoreno/typeorm-pino-logger/blob/31c725dc540c045cab09502ab32b23e2a58ecdba/src/types.ts#L41)

Custom context to add to all log entries
