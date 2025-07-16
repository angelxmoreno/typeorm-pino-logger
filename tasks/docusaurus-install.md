# Docusaurus 3.8 Installation Guide

Step-by-step guide to set up Docusaurus 3.8 for the TypeORM Pino Logger project.

## **Step 1: Install Docusaurus 3.8**

```bash
cd /Users/amoreno/Projects/typeorm-pino-logger
bun create docusaurus@latest docs classic --typescript
```

This creates a `docs/` directory with Docusaurus setup.

## **Step 2: Install Dependencies**

```bash
cd docs
bun install
```

## **Step 3: Test the Initial Setup**

```bash
bun start
```

This should open `http://localhost:3000` with the default Docusaurus site.

## **Step 4: Configure Docusaurus for Your Project**

You'll need to edit `docs/docusaurus.config.ts` to customize:

- **Site title**: "TypeORM Pino Logger"
- **tagline**: "High-performance logging for TypeORM with Pino"
- **URL**: Your GitHub Pages URL
- **baseUrl**: `/typeorm-pino-logger/`
- **organizationName**: `angelxmoreno`
- **projectName**: `typeorm-pino-logger`
- **GitHub repository links**

## **Step 5: Create Your Documentation Structure**

Replace default content in `docs/docs/` with:
- `intro.md` - Getting started guide
- `installation.md` - Installation instructions
- `configuration.md` - Configuration options
- `api/` directory - API documentation
- `examples/` directory - Usage examples

## **Step 6: Set Up the Blog**

The blog is already configured! You can start writing posts in `docs/blog/`:
- `2024-01-15-introducing-typeorm-pino-logger.md`
- `2024-01-20-advanced-logging-techniques.md`

## **Step 7: Customize the Homepage**

Edit `docs/src/pages/index.tsx` to create a custom homepage showcasing your library.

## **Step 8: Add Package.json Scripts**

Add these scripts to your main `package.json`:

```json
{
  "scripts": {
    "docs:dev": "cd docs && bun start",
    "docs:start": "cd docs && bun start",
    "docs:build": "cd docs && bun build",
    "docs:serve": "cd docs && bun serve"
  }
}
```

## **Step 9: Set Up GitHub Pages Deployment**

Create `.github/workflows/deploy.yml` for automatic deployment to GitHub Pages when you push to main.

## **Step 10: Configure for TypeScript Library**

Install and configure:
- `@docusaurus/plugin-content-docs` for API docs
- `docusaurus-plugin-typedoc` for automatic API documentation from your TypeScript code

## **Final File Structure**

```
typeorm-pino-logger/
├── docs/                     # Docusaurus site
│   ├── blog/                 # Blog posts
│   ├── docs/                 # Documentation pages
│   ├── src/                  # Custom pages/components
│   ├── static/               # Static assets
│   └── docusaurus.config.ts  # Configuration
├── src/                      # Your library code
└── package.json
```

## **Next Steps**

1. Follow steps 1-3 to get the basic setup running
2. Customize the configuration in step 4
3. Start creating your documentation content
4. Set up deployment to GitHub Pages

The blog functionality will be ready out of the box once you complete the setup!