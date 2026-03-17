export interface TokenCreateRequest {
    id?: string;
    role_name?: string;
    policies?: string[];
    meta?: Record<string, string>;
    no_parent?: boolean;
    no_default_policy?: boolean;
    renewable?: boolean;
    ttl?: string;
    explicit_max_ttl?: string;
    display_name?: string;
    num_uses?: number;
    period?: string;
    entity_alias?: string;
    type?: "service" | "batch";
}

export interface TokenLookupResponse {
    accessor: string;
    creation_time: number;
    creation_ttl: number;
    display_name: string;
    entity_id: string;
    expire_time: string | null;
    explicit_max_ttl: number;
    id: string;
    issue_time: string;
    meta: Record<string, string> | null;
    num_uses: number;
    orphan: boolean;
    path: string;
    policies: string[];
    renewable: boolean;
    ttl: number;
    type: string;
}

export interface TokenRenewRequest {
    token?: string;
    increment?: string;
}

export interface TokenRevokeRequest {
    token: string;
}

export interface TokenRoleConfig {
    allowed_policies?: string[];
    disallowed_policies?: string[];
    orphan?: boolean;
    period?: string;
    renewable?: boolean;
    path_suffix?: string;
    explicit_max_ttl?: string;
    token_type?: "default" | "service" | "batch";
    token_num_uses?: number;
    allowed_entity_aliases?: string[];
    token_period?: string;
    token_explicit_max_ttl?: string;
    token_no_default_policy?: boolean;
    token_bound_cidrs?: string[];
}

export interface TokenRoleResponse extends TokenRoleConfig {
    name?: string;
}

export interface TokenAccessorsListResponse {
    keys: string[];
}
