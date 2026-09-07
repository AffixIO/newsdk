import type { ProofData } from "../local-prove.js";
import type { CodeCarrierMode, MaxUsesOption, ZkCodeHeader, ZkCodePayload } from "./types.js";
declare const PREFIX = "AFX.ZK1.";
export { PREFIX as ZK_CARRIER_PREFIX };
/** QR version 40 ECC-L binary capacity (conservative). */
export declare const QR_MAX_BINARY_BYTES = 2953;
/** PDF417 level 8 binary capacity (conservative). */
export declare const PDF417_MAX_BINARY_BYTES = 1800;
/** Data Matrix ECC200 max binary (conservative). */
export declare const DATAMATRIX_MAX_BINARY_BYTES = 2335;
export declare function normaliseMaxUses(value: MaxUsesOption | undefined): number;
export declare function defaultExp(): number;
export declare function buildHeader(input: {
    circuitId: string;
    decision: "yes" | "no";
    proofDigest: string;
    maxUses?: MaxUsesOption;
    exp?: number;
    validFrom?: number;
    codeId?: string;
    mode: CodeCarrierMode;
    proofId?: string;
}): ZkCodeHeader;
export declare function packCarrier(header: ZkCodeHeader, proofData?: ProofData): string;
export declare function unpackCarrier(text: string): ZkCodePayload;
export declare function isZkCarrier(text: string): boolean;
export declare function proofDataFromHex(proofHex: string): ProofData;
export declare function carrierBinarySize(mode: CodeCarrierMode, proofData?: ProofData): number;
export declare function selectSymbology(kind: "qr" | "barcode", byteSize: number, symbology?: string): {
    kind: "qr" | "barcode";
    symbology: string;
    mode: CodeCarrierMode;
};
export declare function digestProofHex(proofHex: string, circuitId?: string, valid?: boolean): string;
