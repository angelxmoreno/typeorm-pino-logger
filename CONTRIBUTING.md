# Contributing to TypeORM Pino Logger

Thank you for your interest in contributing to TypeORM Pino Logger! This guide will help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`
5. Start development mode: `npm run dev`

## Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages and allows us to automatically generate changelogs.

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

### Examples

```
feat(logger): add support for custom log levels
fix(query): handle undefined parameters correctly
docs(readme): update usage examples
test(logger): add tests for slow query detection
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Add or update tests as needed
4. Update documentation if required
5. Ensure all tests pass: `npm test`
6. Ensure the build succeeds: `npm run build`
7. Create a pull request with a clear description

## Release Process

Releases are automated using `release-it`. Only maintainers can create releases:

### Manual Release (for maintainers)

```bash
# Patch release (1.0.0 -> 1.0.1)
npm run release:patch

# Minor release (1.0.0 -> 1.1.0)
npm run release:minor

# Major release (1.0.0 -> 2.0.0)
npm run release:major

# Beta release
npm run release:beta

# Dry run (preview changes)
npm run release:dry
```

### GitHub Actions Release

Releases can also be triggered via GitHub Actions:

1. Go to the "Actions" tab in the repository
2. Select the "Release" workflow
3. Click "Run workflow"
4. Choose the release type (patch, minor, major, beta)
5. Click "Run workflow"

## Code Style

- Use TypeScript with strict mode enabled
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

- Write tests for new features and bug fixes
- Ensure test coverage remains high
- Use descriptive test names
- Group related tests using `describe` blocks

## Documentation

- Update README.md for new features or breaking changes
- Add JSDoc comments for new public methods
- Update CHANGELOG.md (handled automatically by release-it)

## Questions?

If you have questions about contributing, please open an issue or start a discussion in the repository.