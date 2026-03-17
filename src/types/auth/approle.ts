export interface AppRoleLoginRequest {
    role_id: string;
    secret_id?: string;
}

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

export interface AppRoleRoleResponse extends AppRoleRoleConfig {
    [key: string]: unknown;
}

export interface AppRoleRoleIdResponse {
    role_id: string;
}

export interface AppRoleSecretIdRequest {
    metadata?: string;
    cidr_list?: string[];
    token_bound_cidrs?: string[];
    num_uses?: number;
    ttl?: string;
}

export interface AppRoleSecretIdResponse {
    secret_id: string;
    secret_id_accessor: string;
    secret_id_num_uses: number;
    secret_id_ttl: number;
}

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

export interface AppRoleSecretIdAccessorsResponse {
    keys: string[];
}

export interface AppRoleListRolesResponse {
    keys: string[];
}
