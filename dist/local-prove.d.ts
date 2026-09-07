import type { WitnessPackage } from "./types.js";
export type ProofData = {
    proof: Uint8Array;
    publicInputs: string[];
};
export declare function packProof(proofData: ProofData): string;
export declare function unpackProof(proofHex: string): ProofData;
/** Affix API digest: sha256(`${circuitId}:${valid}:${proofHex}`). */
export declare function proofDigest(proofHex: string, circuitId: string, valid: boolean): string;
export declare function localProve(witness: WitnessPackage): Promise<{
    proof: string;
    returnValue: string;
    valid: boolean;
    proofDigest: string;
    proofData: ProofData;
}>;
export declare function localVerify(circuitId: string, proofHex: string): Promise<{
    valid: boolean;
    decision: "yes" | "no";
    returnValue: string | null;
}>;
export declare function makeProofId(): string;
