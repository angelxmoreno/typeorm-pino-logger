# Class: TypeOrmPinoLogger

Defined in: [TypeOrmPinoLogger.ts:5](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L5)

## Implements

- `Logger`

## Constructors

### Constructor

> **new TypeOrmPinoLogger**(`pinoLogger`, `options`): `TypeOrmPinoLogger`

Defined in: [TypeOrmPinoLogger.ts:9](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L9)

#### Parameters

##### pinoLogger

`Logger`

##### options

[`TypeOrmPinoLoggerOptions`](../interfaces/TypeOrmPinoLoggerOptions.md) = `{}`

#### Returns

`TypeOrmPinoLogger`

## Methods

### logQuery()

> **logQuery**(`query`, `parameters?`, `queryRunner?`): `void`

Defined in: [TypeOrmPinoLogger.ts:27](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L27)

Logs query and parameters used in it.

#### Parameters

##### query

`string`

##### parameters?

`unknown`[]

##### queryRunner?

`QueryRunner`

#### Returns

`void`

#### Implementation of

`Logger.logQuery`

***

### logQueryError()

> **logQueryError**(`error`, `query`, `parameters?`, `queryRunner?`): `void`

Defined in: [TypeOrmPinoLogger.ts:44](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L44)

Logs query that failed.

#### Parameters

##### error

`string` | `Error`

##### query

`string`

##### parameters?

`unknown`[]

##### queryRunner?

`QueryRunner`

#### Returns

`void`

#### Implementation of

`Logger.logQueryError`

***

### logQuerySlow()

> **logQuerySlow**(`time`, `query`, `parameters?`, `queryRunner?`): `void`

Defined in: [TypeOrmPinoLogger.ts:62](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L62)

Logs query that is slow.

#### Parameters

##### time

`number`

##### query

`string`

##### parameters?

`unknown`[]

##### queryRunner?

`QueryRunner`

#### Returns

`void`

#### Implementation of

`Logger.logQuerySlow`

***

### logSchemaBuild()

> **logSchemaBuild**(`message`, `queryRunner?`): `void`

Defined in: [TypeOrmPinoLogger.ts:81](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L81)

Logs events from the schema build process.

#### Parameters

##### message

`string`

##### queryRunner?

`QueryRunner`

#### Returns

`void`

#### Implementation of

`Logger.logSchemaBuild`

***

### logMigration()

> **logMigration**(`message`, `queryRunner?`): `void`

Defined in: [TypeOrmPinoLogger.ts:97](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L97)

Logs events from the migration run process.

#### Parameters

##### message

`string`

##### queryRunner?

`QueryRunner`

#### Returns

`void`

#### Implementation of

`Logger.logMigration`

***

### log()

> **log**(`level`, `message`, `queryRunner?`): `void`

Defined in: [TypeOrmPinoLogger.ts:113](https://github.com/angelxmoreno/typeorm-pino-logger/blob/7cef26f5356f15253ff5c6aed9151e767054a97f/src/TypeOrmPinoLogger.ts#L113)

Perform logging using given logger.

#### Parameters

##### level

`"log"` | `"info"` | `"warn"` | `"error"`

##### message

`unknown`

##### queryRunner?

`QueryRunner`

#### Returns

`void`

#### Implementation of

`Logger.log`
