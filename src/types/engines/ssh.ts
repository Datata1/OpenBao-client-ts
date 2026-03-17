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

export interface SSHRoleResponse extends SSHRoleConfig {
    [key: string]: unknown;
}

export interface SSHSignRequest {
    public_key: string;
    ttl?: string;
    valid_principals?: string;
    cert_type?: "user" | "host";
    key_id?: string;
    critical_options?: Record<string, string>;
    extensions?: Record<string, string>;
}

export interface SSHSignResponse {
    serial_number: string;
    signed_key: string;
}

export interface SSHIssueRequest {
    key_type: "ca" | "otp";
    username?: string;
    ip?: string;
}

export interface SSHIssueResponse {
    serial_number?: string;
    signed_key?: string;
    key?: string;
    key_type?: string;
    port?: number;
    ip?: string;
}

export interface SSHVerifyOTPRequest {
    otp: string;
}

export interface SSHVerifyOTPResponse {
    ip: string;
    username: string;
}

export type SSHCAPublicKeyResponse = string;

export interface SSHListRolesResponse {
    keys: string[];
    key_info: Record<string, { key_type: string }>;
}
