// ─── PKI Engine Types ────────────────────────────────────────────────

/** Request to issue a certificate. */
export interface PKIIssueRequest {
    common_name: string;
    alt_names?: string;
    ip_sans?: string;
    uri_sans?: string;
    other_sans?: string;
    ttl?: string;
    format?: "pem" | "der" | "pem_bundle";
    private_key_format?: "der" | "pkcs8" | "pem";
    exclude_cn_from_sans?: boolean;
}

/** Response from issuing/signing a certificate. */
export interface PKICertificateResponse {
    certificate: string;
    issuing_ca: string;
    ca_chain: string[];
    private_key: string;
    private_key_type: string;
    serial_number: string;
    expiration: number;
}

/** Request to sign a CSR. */
export interface PKISignRequest {
    csr: string;
    common_name: string;
    alt_names?: string;
    ip_sans?: string;
    uri_sans?: string;
    other_sans?: string;
    ttl?: string;
    format?: "pem" | "der" | "pem_bundle";
    exclude_cn_from_sans?: boolean;
}

/** Request to generate a root CA. */
export interface PKIGenerateRootRequest {
    type: "internal" | "exported" | "existing" | "kms";
    common_name: string;
    alt_names?: string;
    ip_sans?: string;
    uri_sans?: string;
    ttl?: string;
    key_type?: "rsa" | "ec" | "ed25519";
    key_bits?: number;
    max_path_length?: number;
    issuer_name?: string;
    format?: "pem" | "der" | "pem_bundle";
}

/** Response from generating a root CA. */
export interface PKIGenerateRootResponse {
    certificate: string;
    issuing_ca: string;
    serial_number: string;
    expiration: number;
    issuer_id: string;
    issuer_name: string;
    key_id: string;
    key_name: string;
}

/** Request to generate an intermediate CA. */
export interface PKIGenerateIntermediateRequest {
    type: "internal" | "exported" | "existing" | "kms";
    common_name: string;
    alt_names?: string;
    ip_sans?: string;
    uri_sans?: string;
    key_type?: "rsa" | "ec" | "ed25519";
    key_bits?: number;
    format?: "pem" | "der" | "pem_bundle";
}

/** Response from generating an intermediate CA CSR. */
export interface PKIGenerateIntermediateResponse {
    csr: string;
    key_id: string;
    private_key?: string;
    private_key_type?: string;
}

/** Set signed intermediate request. */
export interface PKISetSignedIntermediateRequest {
    certificate: string;
}

/** PKI role configuration. */
export interface PKIRoleConfig {
    ttl?: string;
    max_ttl?: string;
    allow_localhost?: boolean;
    allowed_domains?: string[];
    allowed_domains_template?: boolean;
    allow_bare_domains?: boolean;
    allow_subdomains?: boolean;
    allow_glob_domains?: boolean;
    allow_wildcard_certificates?: boolean;
    allow_any_name?: boolean;
    enforce_hostnames?: boolean;
    allow_ip_sans?: boolean;
    server_flag?: boolean;
    client_flag?: boolean;
    code_signing_flag?: boolean;
    key_type?: "rsa" | "ec" | "ed25519" | "any";
    key_bits?: number;
    no_store?: boolean;
    require_cn?: boolean;
    key_usage?: string[];
    ext_key_usage?: string[];
    generate_lease?: boolean;
    issuer_ref?: string;
}

/** PKI role read response. */
export interface PKIRoleResponse extends PKIRoleConfig {
    name?: string;
}

/** PKI issuer info. */
export interface PKIIssuerResponse {
    ca_chain: string[];
    certificate: string;
    issuer_id: string;
    issuer_name: string;
    key_id: string;
    leaf_not_after_behavior: string;
    manual_chain: string[] | null;
    usage: string;
    revocation_signature_algorithm: string;
}

/** PKI CRL config. */
export interface PKICRLConfig {
    expiry?: string;
    disable?: boolean;
    ocsp_disable?: boolean;
    auto_rebuild?: boolean;
    auto_rebuild_grace_period?: string;
    delta_rebuild_interval?: string;
    ocsp_expiry?: string;
}

/** PKI URLs config. */
export interface PKIURLsConfig {
    issuing_certificates?: string[];
    crl_distribution_points?: string[];
    ocsp_servers?: string[];
}

/** Tidy request. */
export interface PKITidyRequest {
    tidy_cert_store?: boolean;
    tidy_revoked_certs?: boolean;
    tidy_revoked_cert_issuer_associations?: boolean;
    safety_buffer?: string;
}

/** Revoke request. */
export interface PKIRevokeRequest {
    serial_number: string;
}

/** Revoke response. */
export interface PKIRevokeResponse {
    revocation_time: number;
    revocation_time_rfc3339: string;
}

/** List response for roles / issuers / certs. */
export interface PKIListResponse {
    keys: string[];
    key_info?: Record<string, Record<string, unknown>>;
}
