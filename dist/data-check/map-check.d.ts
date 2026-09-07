import type { DataCheckQuery, DataCheckResult } from "./types.js";
/** Stringify store values exactly. Numbers and booleans become stable decimal/true/false. */
export declare function exactFieldString(value: unknown): string;
export declare function stringsEqualExact(a: string, b: string): boolean;
export declare function resolveClaimField(row: Record<string, unknown>, claimField?: string): {
    key: string;
    value: string;
} | null;
/**
 * Build DataCheckResult from a row. Field map is the single source of truth:
 * pass ⇔ fields.claim === fields.required (exact).
 */
export declare function buildCheckResult(opts: {
    row: Record<string, unknown>;
    query: DataCheckQuery;
    source: string;
    style: "modern" | "legacy";
    record_id?: string;
    meta?: Record<string, string>;
}): DataCheckResult;
/** Deep equality for field maps (order-independent keys). */
export declare function fieldsExactMatch(a: Record<string, string>, b: Record<string, string>): boolean;
