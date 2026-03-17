export interface WrapInfo {
    token: string;
    accessor: string;
    ttl: number;
    creation_time: string;
    creation_path: string;
    wrapped_accessor: string;
}

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

export interface ListKeysResponse {
    keys: string[];
}
