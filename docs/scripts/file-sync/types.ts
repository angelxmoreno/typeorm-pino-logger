export type FileSyncConfig = {
    sourceFile: string;
    targetFile: string;
    templateFile: string;
    formatter?: (sourceContent: string) => Promise<string>;
};
