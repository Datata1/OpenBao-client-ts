// ─── Userpass Auth Types ─────────────────────────────────────────────

/** Userpass login request. */
export interface UserpassLoginRequest {
    password: string;
}

/** Userpass user configuration. */
export interface UserpassUserConfig {
    password?: string;
    token_policies?: string[];
    token_ttl?: string;
    token_max_ttl?: string;
    token_bound_cidrs?: string[];
    token_explicit_max_ttl?: string;
    token_no_default_policy?: boolean;
    token_num_uses?: number;
    token_period?: string;
    token_type?: "default" | "service" | "batch";
}

/** Userpass user response. */
export interface UserpassUserResponse {
    token_bound_cidrs: string[];
    token_explicit_max_ttl: number;
    token_max_ttl: number;
    token_no_default_policy: boolean;
    token_num_uses: number;
    token_period: number;
    token_policies: string[];
    token_ttl: number;
    token_type: string;
}

/** Userpass list users response. */
export interface UserpassListUsersResponse {
    keys: string[];
}
