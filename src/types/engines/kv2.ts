export interface KV2VersionMetadata {
    created_time: string;
    custom_metadata: Record<string, string> | null;
    deletion_time: string;
    destroyed: boolean;
    version: number;
}

export interface KV2Data<T = Record<string, unknown>> {
    data: T;
    metadata: KV2VersionMetadata;
}

export type KV2WriteResponse = KV2VersionMetadata;

export interface KV2ListResponse {
    keys: string[];
}

export interface KV2VersionRecord {
    created_time: string;
    deletion_time: string;
    destroyed: boolean;
}

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

export interface KV2WriteOptions {
    cas?: number;
}
