import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const siteName = 'TypeORM Pino Logger';
const orgName = 'angelxmoreno';
const repoName = 'typeorm-pino-logger';
const baseRepoUrl = `https://github.com/${orgName}`;
const fullRepoUrl = `${baseRepoUrl}/${repoName}`;
const baseDocsUrl = `https://${orgName}.github.io`;
const baseDocsPath = `/${repoName}/`;
const _fullDocsUrl = `${baseDocsUrl}${baseDocsPath}`;

const config: Config = {
    title: 'TypeORM Pino Logger',
    tagline: 'High-performance logging for TypeORM with Pino',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: baseDocsUrl,
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: baseDocsPath,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: orgName, // Usually your GitHub org/user name.
    projectName: repoName, // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: `${fullRepoUrl}/tree/main/docs/docs/`,
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: `${fullRepoUrl}/tree/main/docs/blog/`,
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: siteName,
            logo: {
                alt: `${siteName} Logo`,
                src: 'img/typeorm-pino-logger-logo-v1.png',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                { to: '/blog', label: 'Blog', position: 'left' },
                {
                    href: fullRepoUrl,
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Getting Started',
                            to: '/docs/intro',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'NPM Package',
                            href: 'https://www.npmjs.com/package/typeorm-pino-logger',
                        },
                        {
                            label: 'Issues',
                            href: `${fullRepoUrl}/issues`,
                        },
                        {
                            label: 'Discussions',
                            href: `${fullRepoUrl}/discussions`,
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog',
                        },
                        {
                            label: 'GitHub',
                            href: fullRepoUrl,
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} ${siteName} - Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
