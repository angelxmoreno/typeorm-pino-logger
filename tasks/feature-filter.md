# Message Filtering Feature Request

**GitHub Issue**: https://github.com/angelxmoreno/typeorm-pino-logger/issues/13

## Problem Statement

When using the TypeORM Pino Logger, users see verbose messages during application startup that may not be relevant for their logging needs. Specifically, messages about glob pattern discovery are logged as:

```shell
[2025-07-22 19:47:20.999 -0400] INFO (database): TypeORM Log
    message: "All classes found using provided glob pattern \"/monorepo/packages/database/src/entities/*Entity.ts\" : \"/monorepo/packages/database/src/entities/...\""
    type: "general"
[2025-07-22 19:47:21.020 -0400] INFO (database): TypeORM Log
    message: "All classes found using provided glob pattern \"/monorepo/packages/database/src/migrations/*.ts\" : \"/monorepo/packages/database/src/migrations/...\""
    type: "general"
```

These messages can clutter logs and are often not useful in production environments.

## Proposed Solution

Add a message filtering capability through a `FilterFunction` that allows users to selectively suppress log messages based on content and type.

### API Design

```typescript
type FilterFunction = (message: string, type: string) => boolean;

interface TypeOrmPinoLoggerOptions {
  // ... existing options
  
  /**
   * Optional filter function to control which messages are logged
   * Return true to log the message, false to suppress it
   */
  messageFilter?: FilterFunction;
}
```

### Usage Example

```typescript
const filterOutGlobMessages: FilterFunction = (message, type) => {
  // Suppress glob pattern discovery messages
  if (type === 'general' && message.match(/^All classes found using provided glob pattern/)) {
    return false;
  }
  return true;
};

const typeormLogger = new TypeOrmPinoLogger(pinoLogger, {
  messageFilter: filterOutGlobMessages,
  // ... other options
});
```

### Advanced Usage Examples

```typescript
// Filter out multiple message patterns
const customFilter: FilterFunction = (message, type) => {
  const suppressedPatterns = [
    /^All classes found using provided glob pattern/,
    /^Database schema loaded from/,
    /^Connection established/
  ];
  
  return !suppressedPatterns.some(pattern => pattern.test(message));
};

// Filter by log type
const typeBasedFilter: FilterFunction = (message, type) => {
  // Only show errors and slow queries
  return ['query-error', 'slow-query'].includes(type);
};

// Combine content and type filtering
const combinedFilter: FilterFunction = (message, type) => {
  // Suppress general messages but keep schema and migration logs
  if (type === 'general' && message.includes('glob pattern')) {
    return false;
  }
  return true;
};
```

## Implementation Plan

### 1. Type Definitions (`src/types.ts`)
- Add `FilterFunction` type definition
- Add `messageFilter` property to `TypeOrmPinoLoggerOptions` interface

### 2. Logger Implementation (`src/TypeOrmPinoLogger.ts`)
- Update constructor to accept and store the filter function
- Apply filtering logic in relevant logging methods:
  - `log()` method (primary target for glob messages)
  - Consider applying to other methods for consistency
- Ensure filter is called before the actual Pino logging occurs

### 3. Method Integration Points
The filter should be applied in these methods:
- `log()` - handles general TypeORM messages (including glob patterns)
- `logSchemaBuild()` - schema operation messages
- `logMigration()` - migration messages
- Potentially `logQuery()`, `logQuerySlow()`, `logQueryError()` for consistency

### 4. Implementation Details
- Filter function should be called with the message string and log type
- If no filter is provided, all messages should be logged (backward compatibility)
- Filter should be applied before any Pino logger method is called
- Consider extracting message string from both string and object message types

### 5. Testing
- Add unit tests for filter functionality
- Test filtering of different message types
- Test backward compatibility when no filter is provided
- Test filter function that returns true/false for various scenarios

### 6. Documentation Updates

#### Root Documentation
- **README.md**: Add message filtering to features list and quick start examples

#### API Documentation (TypeDoc Generated)
- **FilterFunction type**: Will be auto-generated from TypeScript definitions
- **TypeOrmPinoLoggerOptions interface**: messageFilter property will be documented
- **Usage examples**: Add to class-level JSDoc comments

#### Documentation Site (Docusaurus)
- **docs/configuration.md**: Add dedicated section on message filtering with examples
- **docs/advanced-usage.md**: Include advanced filtering patterns and use cases
- **docs/log-examples.md**: Show before/after examples of filtered vs unfiltered logs
- **docs/api/**: TypeDoc-generated API docs will automatically include new types
- **docs/intro.md**: Mention filtering capability in feature overview

## Technical Considerations

### Performance
- Filter function will be called for every log message
- Should be lightweight and fast
- Consider memoization for complex regex patterns if needed

### Error Handling
- Filter function errors should not break logging
- Consider try-catch around filter function calls
- Log filter errors at debug level

### Flexibility
- Design allows filtering any message type, not just glob patterns
- Users can implement complex filtering logic
- Maintains full backward compatibility

### Thread Safety
- Filter function should be stateless or handle concurrency properly
- Consider documenting thread safety expectations

## Benefits

1. **Noise Reduction**: Users can suppress verbose startup messages
2. **Flexibility**: Supports filtering any message pattern or type
3. **Performance**: Reduces log volume in production environments
4. **Backward Compatibility**: Optional feature that doesn't affect existing users
5. **Extensibility**: Can be extended for more complex filtering scenarios

## Future Enhancements

- Predefined filter functions for common patterns (glob messages, schema operations)
- Configuration-based filtering (JSON/YAML config files)
- Multiple filter functions support
- Filter statistics and debugging