// ─── KV v2 Types ─────────────────────────────────────────────────────

/** Per-version metadata returned by the KV v2 engine. */
export interface KV2VersionMetadata {
    created_time: string;
    custom_metadata: Record<string, string> | null;
    deletion_time: string;
    destroyed: boolean;
    version: number;
}

/**
 * Shape of the `data` field for KV v2 **read** responses.
 */
export interface KV2Data<T = Record<string, unknown>> {
    data: T;
    metadata: KV2VersionMetadata;
}

/**
 * Shape of the `data` field for KV v2 **write** responses.
 */
export type KV2WriteResponse = KV2VersionMetadata;

/**
 * Shape of the `data` field returned by the KV v2 **list** endpoint.
 */
export interface KV2ListResponse {
    keys: string[];
}

/** Version record within the full metadata read. */
export interface KV2VersionRecord {
    created_time: string;
    deletion_time: string;
    destroyed: boolean;
}

/**
 * Shape of the `data` field returned by the KV v2 **metadata** endpoint.
 */
export interface KV2FullMetadata {
    cas_required: boolean;
    created_time: string;
    current_version: number;
    custom_metadata: Record<string, string> | null;
    delete_version_after: string;
    max_versions: number;
    oldest_version: number;
    updated_time: string;
    versions: Record<string, KV2VersionRecord>;
}

/** Options for KV2 writes. */
export interface KV2WriteOptions {
    /** Check-And-Set index. Use `0` for create-only semantics. */
    cas?: number;
}
