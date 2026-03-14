// ─── SSH Engine Types ────────────────────────────────────────────────

/** SSH key configuration (signing). */
export interface SSHRoleConfig {
    key_type: "ca" | "otp";
    default_user?: string;
    allowed_users?: string;
    allowed_users_template?: boolean;
    allowed_domains?: string;
    ttl?: string;
    max_ttl?: string;
    allowed_critical_options?: string;
    allowed_extensions?: string;
    default_extensions?: Record<string, string>;
    default_critical_options?: Record<string, string>;
    allow_user_certificates?: boolean;
    allow_host_certificates?: boolean;
    allow_bare_domains?: boolean;
    allow_subdomains?: boolean;
    algorithm_signer?: "ssh-rsa" | "rsa-sha2-256" | "rsa-sha2-512" | "default";
    not_before_duration?: string;
}

/** SSH role read response. */
export interface SSHRoleResponse extends SSHRoleConfig {
    // Vault returns the superset
    [key: string]: unknown;
}

/** Sign SSH key request. */
export interface SSHSignRequest {
    public_key: string;
    ttl?: string;
    valid_principals?: string;
    cert_type?: "user" | "host";
    key_id?: string;
    critical_options?: Record<string, string>;
    extensions?: Record<string, string>;
}

/** Sign SSH key response. */
export interface SSHSignResponse {
    serial_number: string;
    signed_key: string;
}

/** Issue SSH credential request. */
export interface SSHIssueRequest {
    key_type: "ca" | "otp";
    username?: string;
    ip?: string;
}

/** Issue SSH credential response. */
export interface SSHIssueResponse {
    serial_number?: string;
    signed_key?: string;
    key?: string;
    key_type?: string;
    port?: number;
    ip?: string;
}

/** Verify OTP request. */
export interface SSHVerifyOTPRequest {
    otp: string;
}

/** Verify OTP response. */
export interface SSHVerifyOTPResponse {
    ip: string;
    username: string;
}

/** SSH CA public key response (raw string, not JSON envelope). */
export type SSHCAPublicKeyResponse = string;

/** SSH list roles response. */
export interface SSHListRolesResponse {
    keys: string[];
    key_info: Record<string, { key_type: string }>;
}
