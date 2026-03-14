// ─── KV v1 Types ─────────────────────────────────────────────────────

/**
 * KV v1 has no versioning — reads return the raw key/value map directly
 * as the `data` field in the OpenBao envelope.
 */
export type KV1Data<T = Record<string, unknown>> = T;

/** KV v1 list response. */
export interface KV1ListResponse {
    keys: string[];
}
