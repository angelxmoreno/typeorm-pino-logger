export type FilterFunction = (message: string, type: string) => boolean;

export interface TypeOrmPinoLoggerOptions {
    /**
     * Optional filter function to control which messages are logged
     * Return true to log the message, false to suppress it
     */
    messageFilter?: FilterFunction;

    /**
     * Log all queries (default: true)
     */
    logQueries?: boolean;

    /**
     * Log slow queries (default: true)
     */
    logSlowQueries?: boolean;

    /**
     * Slow query threshold in milliseconds (default: 1000)
     */
    slowQueryThreshold?: number;

    /**
     * Log query errors (default: true)
     */
    logQueryErrors?: boolean;

    /**
     * Log schema operations (default: true)
     */
    logSchemaOperations?: boolean;

    /**
     * Log migrations (default: true)
     */
    logMigrations?: boolean;

    /**
     * Maximum length for query logging (queries longer than this will be truncated)
     * @default 1000
     */
    maxQueryLength?: number;

    /**
     * Custom context to add to all log entries
     */
    context?: Record<string, unknown>;
}
