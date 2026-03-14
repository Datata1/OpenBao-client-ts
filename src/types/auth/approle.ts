// ─── AppRole Auth Types ──────────────────────────────────────────────

/** AppRole login request. */
export interface AppRoleLoginRequest {
    role_id: string;
    secret_id?: string;
}

/** AppRole role configuration. */
export interface AppRoleRoleConfig {
    bind_secret_id?: boolean;
    secret_id_bound_cidrs?: string[];
    secret_id_num_uses?: number;
    secret_id_ttl?: string;
    local_secret_ids?: boolean;
    token_ttl?: string;
    token_max_ttl?: string;
    token_policies?: string[];
    token_bound_cidrs?: string[];
    token_explicit_max_ttl?: string;
    token_no_default_policy?: boolean;
    token_num_uses?: number;
    token_period?: string;
    token_type?: "default" | "service" | "batch";
}

/** AppRole role response. */
export interface AppRoleRoleResponse extends AppRoleRoleConfig {
    // Vault adds fields on read
    [key: string]: unknown;
}

/** AppRole role ID response. */
export interface AppRoleRoleIdResponse {
    role_id: string;
}

/** Generate secret ID request. */
export interface AppRoleSecretIdRequest {
    metadata?: string;
    cidr_list?: string[];
    token_bound_cidrs?: string[];
    num_uses?: number;
    ttl?: string;
}

/** Generate secret ID response. */
export interface AppRoleSecretIdResponse {
    secret_id: string;
    secret_id_accessor: string;
    secret_id_num_uses: number;
    secret_id_ttl: number;
}

/** Lookup secret ID response. */
export interface AppRoleSecretIdLookupResponse {
    cidr_list: string[];
    creation_time: string;
    expiration_time: string;
    last_updated_time: string;
    metadata: Record<string, string>;
    secret_id_accessor: string;
    secret_id_num_uses: number;
    secret_id_ttl: number;
    token_bound_cidrs: string[];
}

/** Secret ID accessor list. */
export interface AppRoleSecretIdAccessorsResponse {
    keys: string[];
}

/** AppRole roles list. */
export interface AppRoleListRolesResponse {
    keys: string[];
}
