// ─── Database Engine Types ───────────────────────────────────────────

/** Configuration for a database connection. */
export interface DatabaseConnectionConfig {
    plugin_name: string;
    connection_url?: string;
    allowed_roles?: string[];
    verify_connection?: boolean;
    username?: string;
    password?: string;
    username_template?: string;
    root_rotation_statements?: string[];
    password_policy?: string;
    [key: string]: unknown;
}

/** Read connection response. */
export interface DatabaseConnectionResponse {
    plugin_name: string;
    connection_details: Record<string, unknown>;
    allowed_roles: string[];
    root_credentials_rotate_statements: string[];
    password_policy: string;
}

/** Database role configuration. */
export interface DatabaseRoleConfig {
    db_name: string;
    default_ttl?: string;
    max_ttl?: string;
    creation_statements?: string[];
    revocation_statements?: string[];
    rollback_statements?: string[];
    renew_statements?: string[];
    credential_type?: "password" | "rsa_private_key";
    credential_config?: Record<string, unknown>;
}

/** Database role response. */
export interface DatabaseRoleResponse {
    db_name: string;
    default_ttl: number;
    max_ttl: number;
    creation_statements: string[];
    revocation_statements: string[];
    rollback_statements: string[];
    renew_statements: string[];
    credential_type: string;
    credential_config: Record<string, unknown>;
}

/** Static role configuration. */
export interface DatabaseStaticRoleConfig {
    db_name: string;
    username: string;
    rotation_period?: string;
    rotation_statements?: string[];
    credential_type?: "password" | "rsa_private_key";
    credential_config?: Record<string, unknown>;
}

/** Static role response. */
export interface DatabaseStaticRoleResponse extends DatabaseStaticRoleConfig {
    last_vault_rotation: string;
}

/** Dynamic credentials response. */
export interface DatabaseCredentialsResponse {
    username: string;
    password: string;
}

/** Static credentials response. */
export interface DatabaseStaticCredentialsResponse {
    username: string;
    password: string;
    last_vault_rotation: string;
    rotation_period: number;
    ttl: number;
}

/** List response. */
export interface DatabaseListResponse {
    keys: string[];
}
