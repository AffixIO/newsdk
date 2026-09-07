export declare function fieldToBigInt(value: string | number | bigint): bigint;
export declare function fieldToHex(value: bigint): string;
export declare function fieldInputHex(value: string | number | bigint): string;
export declare function claimDigestField(value: string | number): string;
export declare function claimAsCircuitField(value: string | number): string;
export declare function credentialPayloadFingerprint(input: {
    issuer_pubkey_hash: string | bigint;
    schema_id: string | bigint;
    claim_hash: string | bigint;
    valid_from: string | number | bigint;
    valid_until: string | number | bigint;
}): string;
export declare function deriveNullifierField(input: {
    secret: string;
    context_id: string;
    credential_id: string;
}): string;
export declare function normalizeCredentialFields<T extends {
    schema_id: string;
    issuer_pubkey_hash: string;
    credential_id: string;
}>(credential: T): T;
