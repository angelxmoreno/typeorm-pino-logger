import { beforeEach, describe, expect, it, mock } from 'bun:test';
import type { Logger as PinoLogger } from 'pino';
import type { QueryRunner } from 'typeorm';
import { TypeOrmPinoLogger } from '../src/TypeOrmPinoLogger';

describe('TypeOrmPinoLogger', () => {
    let mockLogger: PinoLogger;

    beforeEach(() => {
        mockLogger = {
            debug: mock(),
            info: mock(),
            warn: mock(),
            error: mock(),
            fatal: mock(),
            trace: mock(),
            child: mock(),
        } as unknown as PinoLogger;
    });

    describe('constructor', () => {
        it('should create logger with default options', () => {
            const logger = new TypeOrmPinoLogger(mockLogger);
            expect(logger).toBeInstanceOf(TypeOrmPinoLogger);
        });

        it('should create logger with custom options', () => {
            const options = {
                logQueries: false,
                logSlowQueries: false,
                slowQueryThreshold: 500,
                maxQueryLength: 2000,
                context: { service: 'test' },
            };
            const logger = new TypeOrmPinoLogger(mockLogger, options);
            expect(logger).toBeInstanceOf(TypeOrmPinoLogger);
        });
    });

    describe('logQuery', () => {
        it('should log query when logQueries is enabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: true });
            logger.logQuery('SELECT * FROM users', [1, 2, 3]);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                {
                    query: 'SELECT * FROM users',
                    parameters: [1, 2, 3],
                    queryRunner: undefined,
                    type: 'query',
                },
                'Executing query'
            );
        });

        it('should not log query when logQueries is disabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: false });
            logger.logQuery('SELECT * FROM users', [1, 2, 3]);

            expect(mockLogger.debug).not.toHaveBeenCalled();
        });

        it('should include context in log', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logQueries: true,
                context: { service: 'test-service' },
            });
            logger.logQuery('SELECT * FROM users');

            expect(mockLogger.debug).toHaveBeenCalledWith(
                {
                    service: 'test-service',
                    query: 'SELECT * FROM users',
                    parameters: undefined,
                    queryRunner: undefined,
                    type: 'query',
                },
                'Executing query'
            );
        });

        it('should truncate long queries', () => {
            const longQuery = 'SELECT * FROM users WHERE '.repeat(100);
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logQueries: true,
                maxQueryLength: 50,
            });

            logger.logQuery(longQuery);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: expect.stringContaining('(truncated)'),
                }),
                'Executing query'
            );
        });

        it('should extract queryRunner context', () => {
            const mockQueryRunner = {
                connection: {
                    name: 'default',
                    options: {
                        database: 'test_db',
                    },
                },
                isTransactionActive: true,
            } as unknown as QueryRunner;

            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: true });
            logger.logQuery('SELECT * FROM users', undefined, mockQueryRunner);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryRunner: {
                        connectionName: 'default',
                        database: 'test_db',
                        isTransactionActive: true,
                    },
                }),
                'Executing query'
            );
        });

        it('should handle queryRunner without connection', () => {
            const mockQueryRunner = {
                isTransactionActive: false,
            } as unknown as QueryRunner;

            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: true });
            logger.logQuery('SELECT * FROM users', undefined, mockQueryRunner);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryRunner: {
                        isTransactionActive: false,
                    },
                }),
                'Executing query'
            );
        });
    });

    describe('logQueryError', () => {
        it('should log query error when logQueryErrors is enabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logQueryErrors: true });
            const error = new Error('Database connection failed');
            logger.logQueryError(error, 'SELECT * FROM users', [1]);

            expect(mockLogger.error).toHaveBeenCalledWith(
                {
                    query: 'SELECT * FROM users',
                    parameters: [1],
                    error: 'Database connection failed',
                    queryRunner: undefined,
                    type: 'query-error',
                },
                'Query failed'
            );
        });

        it('should handle string errors', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logQueryErrors: true });
            logger.logQueryError('String error', 'SELECT * FROM users');

            expect(mockLogger.error).toHaveBeenCalledWith(
                {
                    query: 'SELECT * FROM users',
                    parameters: undefined,
                    error: 'String error',
                    queryRunner: undefined,
                    type: 'query-error',
                },
                'Query failed'
            );
        });

        it('should not log when logQueryErrors is disabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logQueryErrors: false });
            logger.logQueryError('Error', 'SELECT * FROM users');

            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should truncate long queries in error logs', () => {
            const longQuery = 'SELECT * FROM users WHERE '.repeat(100);
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logQueryErrors: true,
                maxQueryLength: 50,
            });

            logger.logQueryError('Error', longQuery);

            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: expect.stringContaining('(truncated)'),
                }),
                'Query failed'
            );
        });

        it('should include context in error logs', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logQueryErrors: true,
                context: { service: 'test-service' },
            });
            logger.logQueryError('Error', 'SELECT * FROM users');

            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.objectContaining({
                    service: 'test-service',
                }),
                'Query failed'
            );
        });
    });

    describe('logQuerySlow', () => {
        it('should log slow query when enabled and threshold exceeded', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logSlowQueries: true,
                slowQueryThreshold: 500,
            });
            logger.logQuerySlow(1000, 'SELECT * FROM users', []);

            expect(mockLogger.warn).toHaveBeenCalledWith(
                {
                    query: 'SELECT * FROM users',
                    parameters: [],
                    executionTime: 1000,
                    threshold: 500,
                    queryRunner: undefined,
                    type: 'slow-query',
                },
                'Slow query detected (1000ms)'
            );
        });

        it('should not log when query is faster than threshold', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logSlowQueries: true,
                slowQueryThreshold: 1000,
            });
            logger.logQuerySlow(500, 'SELECT * FROM users', []);

            expect(mockLogger.warn).not.toHaveBeenCalled();
        });

        it('should not log when logSlowQueries is disabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logSlowQueries: false });
            logger.logQuerySlow(2000, 'SELECT * FROM users', []);

            expect(mockLogger.warn).not.toHaveBeenCalled();
        });

        it('should include context in slow query logs', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logSlowQueries: true,
                slowQueryThreshold: 500,
                context: { service: 'test-service' },
            });
            logger.logQuerySlow(1000, 'SELECT * FROM users', []);

            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.objectContaining({
                    service: 'test-service',
                }),
                'Slow query detected (1000ms)'
            );
        });

        it('should truncate long queries in slow query logs', () => {
            const longQuery = 'SELECT * FROM users WHERE '.repeat(100);
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logSlowQueries: true,
                slowQueryThreshold: 500,
                maxQueryLength: 50,
            });

            logger.logQuerySlow(1000, longQuery, []);

            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: expect.stringContaining('(truncated)'),
                }),
                'Slow query detected (1000ms)'
            );
        });
    });

    describe('logSchemaBuild', () => {
        it('should log schema build when enabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logSchemaOperations: true });
            logger.logSchemaBuild('Creating table users');

            expect(mockLogger.info).toHaveBeenCalledWith(
                {
                    message: 'Creating table users',
                    queryRunner: undefined,
                    type: 'schema-build',
                },
                'Schema Build'
            );
        });

        it('should not log when logSchemaOperations is disabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logSchemaOperations: false });
            logger.logSchemaBuild('Creating table users');

            expect(mockLogger.info).not.toHaveBeenCalled();
        });

        it('should include context in schema build logs', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logSchemaOperations: true,
                context: { service: 'test-service' },
            });
            logger.logSchemaBuild('Creating table users');

            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.objectContaining({
                    service: 'test-service',
                }),
                'Schema Build'
            );
        });
    });

    describe('logMigration', () => {
        it('should log migration when enabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logMigrations: true });
            logger.logMigration('Running migration 001');

            expect(mockLogger.info).toHaveBeenCalledWith(
                {
                    message: 'Running migration 001',
                    queryRunner: undefined,
                    type: 'migration',
                },
                'Migration'
            );
        });

        it('should not log when logMigrations is disabled', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logMigrations: false });
            logger.logMigration('Running migration 001');

            expect(mockLogger.info).not.toHaveBeenCalled();
        });

        it('should include context in migration logs', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logMigrations: true,
                context: { service: 'test-service' },
            });
            logger.logMigration('Running migration 001');

            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.objectContaining({
                    service: 'test-service',
                }),
                'Migration'
            );
        });
    });

    describe('log', () => {
        it('should log info messages', () => {
            const logger = new TypeOrmPinoLogger(mockLogger);
            logger.log('info', 'Test message');

            expect(mockLogger.info).toHaveBeenCalledWith(
                {
                    message: 'Test message',
                    queryRunner: undefined,
                    type: 'general',
                },
                'TypeORM Log'
            );
        });

        it('should log warn messages', () => {
            const logger = new TypeOrmPinoLogger(mockLogger);
            logger.log('warn', 'Warning message');

            expect(mockLogger.warn).toHaveBeenCalledWith(
                {
                    message: 'Warning message',
                    queryRunner: undefined,
                    type: 'general',
                },
                'TypeORM Warning'
            );
        });

        it('should log error messages', () => {
            const logger = new TypeOrmPinoLogger(mockLogger);
            logger.log('error', 'Error message');

            expect(mockLogger.error).toHaveBeenCalledWith(
                {
                    message: 'Error message',
                    queryRunner: undefined,
                    type: 'general',
                },
                'TypeORM Error'
            );
        });

        it('should default to info for log level', () => {
            const logger = new TypeOrmPinoLogger(mockLogger);
            logger.log('log', 'Log message');

            expect(mockLogger.info).toHaveBeenCalledWith(
                {
                    message: 'Log message',
                    queryRunner: undefined,
                    type: 'general',
                },
                'TypeORM Log'
            );
        });

        it('should include context in general logs', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, {
                context: { service: 'test-service' },
            });
            logger.log('info', 'Test message');

            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.objectContaining({
                    service: 'test-service',
                }),
                'TypeORM Log'
            );
        });
    });

    describe('query truncation', () => {
        it('should not truncate queries shorter than maxQueryLength', () => {
            const shortQuery = 'SELECT * FROM users';
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logQueries: true,
                maxQueryLength: 1000,
            });

            logger.logQuery(shortQuery);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: shortQuery,
                }),
                'Executing query'
            );
        });

        it('should truncate queries longer than maxQueryLength', () => {
            const longQuery = 'SELECT * FROM users WHERE id = 1'.repeat(100);
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logQueries: true,
                maxQueryLength: 100,
            });

            logger.logQuery(longQuery);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: expect.stringMatching(/^SELECT.*\(truncated\)$/),
                }),
                'Executing query'
            );
        });

        it('should trim whitespace before truncation', () => {
            const queryWithWhitespace = '   SELECT * FROM users   ';
            const logger = new TypeOrmPinoLogger(mockLogger, {
                logQueries: true,
                maxQueryLength: 1000,
            });

            logger.logQuery(queryWithWhitespace);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'SELECT * FROM users',
                }),
                'Executing query'
            );
        });
    });

    describe('queryRunner context extraction', () => {
        it('should extract full connection context from queryRunner', () => {
            const mockQueryRunner = {
                connection: {
                    name: 'default',
                    options: {
                        database: 'test_db',
                    },
                },
                isTransactionActive: true,
            } as unknown as QueryRunner;

            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: true });
            logger.logQuery('SELECT * FROM users', undefined, mockQueryRunner);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryRunner: {
                        connectionName: 'default',
                        database: 'test_db',
                        isTransactionActive: true,
                    },
                }),
                'Executing query'
            );
        });

        it('should handle queryRunner with partial connection info', () => {
            const mockQueryRunner = {
                connection: {
                    name: 'default',
                    options: {}, // No database
                },
                isTransactionActive: false,
            } as unknown as QueryRunner;

            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: true });
            logger.logQuery('SELECT * FROM users', undefined, mockQueryRunner);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryRunner: {
                        connectionName: 'default',
                        isTransactionActive: false,
                    },
                }),
                'Executing query'
            );
        });

        it('should handle queryRunner without connection', () => {
            const mockQueryRunner = {
                isTransactionActive: false,
            } as unknown as QueryRunner;

            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: true });
            logger.logQuery('SELECT * FROM users', undefined, mockQueryRunner);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryRunner: {
                        isTransactionActive: false,
                    },
                }),
                'Executing query'
            );
        });

        it('should handle undefined queryRunner', () => {
            const logger = new TypeOrmPinoLogger(mockLogger, { logQueries: true });
            logger.logQuery('SELECT * FROM users', undefined, undefined);

            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.objectContaining({
                    queryRunner: undefined,
                }),
                'Executing query'
            );
        });
    });
});
