import type { GeneratedCode, SavedCodeFiles } from "./types.js";
export type SaveCodeOptions = {
    path?: string;
    sidecar?: boolean;
    basename?: string;
};
export declare function saveCodeAssets(code: Pick<GeneratedCode, "code_id" | "header" | "content" | "carrier" | "link" | "prove" | "carrier_mode" | "kind" | "symbology">, rendered: {
    svg?: string;
    png?: Buffer;
}, opts?: SaveCodeOptions): SavedCodeFiles;
export declare function loadSidecar(path: string): {
    prove?: {
        proof: string;
        circuit_id: string;
        proof_digest: string;
    };
    header?: GeneratedCode["header"];
} | null;
