export declare function withFileLock<T>(lockPath: string, fn: () => T, options?: {
    timeoutMs?: number;
    pollMs?: number;
}): T;
