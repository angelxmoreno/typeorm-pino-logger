import { join } from 'node:path';
import type { FileSyncConfig } from '@site/scripts/file-sync/types';

const ROOT_DIR = join(new URL('.', import.meta.url).pathname, '..', '..', '..');
const config: Array<FileSyncConfig> = [
    {
        sourceFile: `${ROOT_DIR}/CONTRIBUTING.md`,
        targetFile: `${ROOT_DIR}/docs/docs/contributing.md`,
        templateFile: `${ROOT_DIR}/docs/scripts/file-sync/templates/contributing.hbs`,
    },
    {
        sourceFile: `${ROOT_DIR}/CHANGELOG.md`,
        targetFile: `${ROOT_DIR}/docs/docs/changelog.md`,
        templateFile: `${ROOT_DIR}/docs/scripts/file-sync/templates/changelog.hbs`,
    },
];

const readFile = async (filePath: string): Promise<string> => Bun.file(filePath).text();
const writeFile = async (filePath: string, content: string): Promise<number> => Bun.write(filePath, content);

(async () => {
    for (const { sourceFile, targetFile, templateFile, formatter } of config) {
        console.log(`reading source file: ${sourceFile}`);
        let source = await readFile(sourceFile);

        console.log(`reading template file: ${templateFile}`);
        const template = await readFile(templateFile);

        if (formatter) {
            console.log('running formatter on source file');
            source = await formatter(source);
        }
        console.log('building target content');
        const target = template.replace('{{source}}', source);

        console.log(`writing to target: ${targetFile}`);
        await writeFile(targetFile, target);
    }
    console.log('complete');
})().catch(console.error);
