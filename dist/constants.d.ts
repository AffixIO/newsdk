/** Canonical Affix API host for verify, attest, flush (not for QR/barcode presentment). */
export declare const DEFAULT_AFFIX_API_BASE = "https://api.affix-io.com";
/** Default path segment when building a user-supplied presentment URL. */
export declare const DEFAULT_PRESENTMENT_PATH = "/v";
export declare function normaliseApiBase(base?: string | null): string;
/**
 * Normalise a customer presentment base. Empty/unset → no link.
 * Never defaults to AffixIO; hosts set this themselves.
 */
export declare function normalisePresentmentBase(base?: string | null): string | undefined;
/**
 * Build a presentment URL from a customer-supplied base + ZK carrier.
 * Returns undefined when no base is configured (codes stay as raw AFX.ZK1…).
 */
export declare function buildPresentmentLink(carrier: string, presentmentBase?: string | null, pathPrefix?: string): string | undefined;
/**
 * Extract a ZK carrier from a scanned string.
 * Accepts raw AFX.ZK1… payloads or any https://…/v/… style URL the host configured.
 */
export declare function extractCarrierFromScan(scanned: string): string;
