import type { Logger as PinoLogger } from 'pino';
import type { Logger, QueryRunner } from 'typeorm';
import type { TypeOrmPinoLoggerOptions } from './types.ts';

/**
 * This type is used internally to represent the logger options after default values have been applied.
 * It makes all properties of `TypeOrmPinoLoggerOptions` required, except for `messageFilter`.
 * This ensures type safety within the class, as we can rely on the presence of all options except the filter.
 *
 * `messageFilter` is kept optional to avoid the performance overhead of a default filter function
 * for users who do not need the filtering feature.
 */
type TypeOrmPinoLoggerOptionsRequired = Required<Omit<TypeOrmPinoLoggerOptions, 'messageFilter'>> & {
    messageFilter?: TypeOrmPinoLoggerOptions['messageFilter'];
};

export class TypeOrmPinoLogger implements Logger {
    private readonly logger: PinoLogger;
    private readonly options: TypeOrmPinoLoggerOptionsRequired;

    constructor(pinoLogger: PinoLogger, options: TypeOrmPinoLoggerOptions = {}) {
        this.logger = pinoLogger;
        this.options = {
            logQueries: true,
            logSlowQueries: true,
            logQueryErrors: true,
            logSchemaOperations: true,
            logMigrations: true,
            slowQueryThreshold: 1000,
            maxQueryLength: 1000,
            context: {},
            ...options,
        };
    }

    /**
     * Logs query and parameters used in it.
     */
    logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
        if (!this.options.logQueries) return;

        if (this.options.messageFilter && !this.options.messageFilter(query, 'query')) {
            return;
        }

        const logData = {
            ...this.options.context,
            query: this.truncateQuery(query),
            parameters,
            queryRunner: queryRunner ? this.getQueryRunnerContext(queryRunner) : undefined,
            type: 'query',
        };

        this.logger.debug(logData, 'Executing query');
    }

    /**
     * Logs query that failed.
     */
    logQueryError(error: string | Error, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
        if (!this.options.logQueryErrors) return;

        const errorMessage = error instanceof Error ? error.message : error;
        if (this.options.messageFilter && !this.options.messageFilter(errorMessage, 'query-error')) {
            return;
        }

        const logData = {
            ...this.options.context,
            query: this.truncateQuery(query),
            parameters,
            error: error instanceof Error ? error.message : error,
            queryRunner: queryRunner ? this.getQueryRunnerContext(queryRunner) : undefined,
            type: 'query-error',
        };

        this.logger.error(logData, 'Query failed');
    }

    /**
     * Logs query that is slow.
     */
    logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner): void {
        if (!this.options.logSlowQueries || time < this.options.slowQueryThreshold) return;

        if (this.options.messageFilter && !this.options.messageFilter(query, 'slow-query')) {
            return;
        }

        const logData = {
            ...this.options.context,
            query: this.truncateQuery(query),
            parameters,
            executionTime: time,
            threshold: this.options.slowQueryThreshold,
            queryRunner: queryRunner ? this.getQueryRunnerContext(queryRunner) : undefined,
            type: 'slow-query',
        };

        this.logger.warn(logData, `Slow query detected (${time}ms)`);
    }

    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
        if (!this.options.logSchemaOperations) return;

        if (this.options.messageFilter && !this.options.messageFilter(message, 'schema-build')) {
            return;
        }

        const logData = {
            ...this.options.context,
            message,
            queryRunner: queryRunner ? this.getQueryRunnerContext(queryRunner) : undefined,
            type: 'schema-build',
        };

        this.logger.info(logData, 'Schema Build');
    }

    /**
     * Logs events from the migration run process.
     */
    logMigration(message: string, queryRunner?: QueryRunner): void {
        if (!this.options.logMigrations) return;

        if (this.options.messageFilter && !this.options.messageFilter(message, 'migration')) {
            return;
        }

        const logData = {
            ...this.options.context,
            message,
            queryRunner: queryRunner ? this.getQueryRunnerContext(queryRunner) : undefined,
            type: 'migration',
        };

        this.logger.info(logData, 'Migration');
    }

    /**
     * Perform logging using given logger.
     */
    log(level: 'log' | 'info' | 'warn' | 'error', message: unknown, queryRunner?: QueryRunner): void {
        if (
            this.options.messageFilter &&
            typeof message === 'string' &&
            !this.options.messageFilter(message, 'general')
        ) {
            return;
        }

        const logData = {
            ...this.options.context,
            message,
            queryRunner: queryRunner ? this.getQueryRunnerContext(queryRunner) : undefined,
            type: 'general',
        };

        switch (level) {
            case 'log':
            case 'info':
                this.logger.info(logData, 'TypeORM Log');
                break;
            case 'warn':
                this.logger.warn(logData, 'TypeORM Warning');
                break;
            case 'error':
                this.logger.error(logData, 'TypeORM Error');
                break;
            default:
                this.logger.info(logData, 'TypeORM Log');
        }
    }
    /**
     * Truncate query to maximum length if needed
     */
    private truncateQuery(query: string): string {
        const trimmed = query.trim();
        if (trimmed.length <= this.options.maxQueryLength) {
            return trimmed;
        }
        return `${trimmed.slice(0, this.options.maxQueryLength)}... (truncated)`;
    }

    /**
     * Extract useful context from query runner
     */
    private getQueryRunnerContext(queryRunner: QueryRunner): Record<string, unknown> {
        const context: Record<string, unknown> = {};

        if (queryRunner.connection) {
            const connection = queryRunner.connection;
            // `name` existed on the DataSource/Connection in typeorm 0.3.x but was removed in 1.0.
            // Read it defensively so this logger compiles against 1.0 while still capturing the
            // connection name at runtime when used with 0.3.x.
            const connectionName = (connection as { name?: string }).name;
            if (connectionName) {
                context.connectionName = connectionName;
            }
            if (connection.options?.database) {
                context.database = connection.options.database;
            }
        }

        if (queryRunner.isTransactionActive !== undefined) {
            context.isTransactionActive = queryRunner.isTransactionActive;
        }

        return context;
    }
}

export default TypeOrmPinoLogger;
