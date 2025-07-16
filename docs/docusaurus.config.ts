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
    favicon: 'favicon_io/favicon.ico',

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

    onBrokenLinks: 'warn',
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
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    plugins: [
        [
            'docusaurus-plugin-typedoc',
            {
                entryPoints: ['../src/index.ts'],
                tsconfig: '../tsconfig.json',
                out: 'docs/api',
                name: 'TypeORM Pino Logger API',
                excludePrivate: true,
                excludeProtected: true,
                excludeExternals: true,
                hideGenerator: true,
                sort: ['source-order'],
                sidebar: {
                    pretty: true,
                },
                readme: 'none',
                exclude: ['**/_media/**'],
            },
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        metadata: [
            { name: 'apple-touch-icon', sizes: '180x180', href: 'favicon_io/apple-touch-icon.png' },
            { name: 'icon', type: 'image/png', sizes: '32x32', href: 'favicon_io/favicon-32x32.png' },
            { name: 'icon', type: 'image/png', sizes: '16x16', href: 'favicon_io/favicon-16x16.png' },
            { name: 'manifest', href: 'favicon_io/site.webmanifest' },
        ],
        image: 'img/typeorm-pino-logger-logo-v1.png',
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
                    label: 'Documentation',
                },
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
                        {
                            label: 'API Reference',
                            to: '/docs/api',
                        },
                        {
                            label: 'Contributing',
                            to: '/docs/contributing',
                        },
                        {
                            label: 'Changelog',
                            to: '/docs/changelog',
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
