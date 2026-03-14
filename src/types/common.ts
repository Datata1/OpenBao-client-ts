// ─── Generic Envelope ────────────────────────────────────────────────

/** Wrapping information returned when response-wrapping is enabled. */
export interface WrapInfo {
    token: string;
    accessor: string;
    ttl: number;
    creation_time: string;
    creation_path: string;
    wrapped_accessor: string;
}

/** Auth information block in an OpenBao response. */
export interface AuthInfo {
    client_token: string;
    accessor: string;
    policies: string[];
    token_policies: string[];
    metadata: Record<string, string> | null;
    lease_duration: number;
    renewable: boolean;
    entity_id: string;
    token_type: string;
    orphan: boolean;
    num_uses: number;
}

/**
 * Generic envelope returned by every OpenBao / Vault API response.
 */
export interface OpenBaoResponse<T> {
    request_id: string;
    lease_id: string;
    renewable: boolean;
    lease_duration: number;
    data: T;
    wrap_info: WrapInfo | null;
    warnings: string[] | null;
    auth: AuthInfo | null;
}

/** Generic list response shape used by many endpoints. */
export interface ListKeysResponse {
    keys: string[];
}
