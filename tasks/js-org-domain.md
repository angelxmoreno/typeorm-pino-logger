# Getting a Free .js.org Domain

Guide to obtaining a free `.js.org` subdomain for the TypeORM Pino Logger project.

## **What You Can Get**

- **URL**: `https://typeorm-pino-logger.js.org/`
- **Cost**: Completely free
- **Requirements**: Open source JavaScript/TypeScript project

## **Benefits**

- Professional-looking domain
- Free forever
- Great for open source projects
- SEO-friendly for JavaScript libraries
- Perfect for npm packages and documentation

## **Requirements**

- Open source project
- Active development
- Related to JavaScript/TypeScript
- Good documentation
- Clean commit history

## **Application Process**

### **Step 1: Prepare Your Project**
- Ensure your GitHub Pages site is working
- Have good documentation (README, docs site)
- Clean up commit history if needed
- Make sure the project is actively maintained

### **Step 2: Fork the JS.ORG Repository**
```bash
# Fork https://github.com/js-org/js.org
```

### **Step 3: Add Your Domain Configuration**
1. Navigate to the `cnames_active.js` file in your fork
2. Add your subdomain entry:
   ```javascript
   "typeorm-pino-logger": "angelxmoreno.github.io/typeorm-pino-logger"
   ```

### **Step 4: Submit Pull Request**
1. Commit your changes
2. Submit a pull request to the main js-org repository
3. Include in your PR description:
   - Brief description of your project
   - Link to your GitHub repository
   - Link to your documentation/demo site
   - Why you need the subdomain

### **Step 5: Wait for Approval**
- Review process typically takes a few days to a week
- Maintainers will check if your project meets requirements
- They may ask for clarifications or improvements

## **Example PR Description**

```markdown
# Request for typeorm-pino-logger.js.org

## Project Details
- **Repository**: https://github.com/angelxmoreno/typeorm-pino-logger
- **Documentation**: https://angelxmoreno.github.io/typeorm-pino-logger/
- **NPM Package**: https://www.npmjs.com/package/typeorm-pino-logger

## Description
TypeORM Pino Logger is a high-performance logging adapter that integrates Pino with TypeORM for structured database query logging. The library provides configurable logging levels, query truncation, and context extraction.

## Why .js.org?
This TypeScript library serves the JavaScript/TypeScript community by providing better logging capabilities for TypeORM applications. A .js.org domain would help developers easily find and remember the documentation site.

## Project Status
- Active development
- Comprehensive test coverage
- Full TypeScript support
- MIT licensed
- Well-documented API
```

## **After Approval**

### **Update Docusaurus Configuration**
Once approved, update your `docs/docusaurus.config.ts`:

```typescript
const config: Config = {
  title: 'TypeORM Pino Logger',
  tagline: 'High-performance logging for TypeORM with Pino',
  url: 'https://typeorm-pino-logger.js.org',
  baseUrl: '/',
  organizationName: 'angelxmoreno',
  projectName: 'typeorm-pino-logger',
  // ...
};
```

### **Update Package.json**
Add the homepage field:
```json
{
  "homepage": "https://typeorm-pino-logger.js.org"
}
```

### **Update README**
Update all documentation links to use the new domain.

## **Timeline**

1. **Week 1**: Set up GitHub Pages and Docusaurus
2. **Week 2**: Polish documentation and project
3. **Week 3**: Submit JS.ORG application
4. **Week 4**: Wait for approval and make any requested changes
5. **Week 5**: Update all configurations with new domain

## **Tips for Approval**

- Have comprehensive documentation
- Include usage examples
- Show active maintenance (recent commits)
- Respond quickly to maintainer feedback
- Follow their contribution guidelines exactly

## **Alternative Options**

If JS.ORG application is rejected or takes too long:
- Use standard GitHub Pages: `https://angelxmoreno.github.io/typeorm-pino-logger/`
- Consider purchasing a custom domain
- Look into other free domain providers

## **Resources**

- **JS.ORG Repository**: https://github.com/js-org/js.org
- **Application Guidelines**: https://github.com/js-org/js.org/blob/master/README.md
- **DNS Setup Help**: https://github.com/js-org/js.org/wiki