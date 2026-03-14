// ─── TOTP Engine Types ───────────────────────────────────────────────

/** Create TOTP key request. */
export interface TOTPCreateKeyRequest {
    /** If true, Vault generates the key. If false, provide `url` or `key`. */
    generate?: boolean;
    /** TOTP key (base32 encoded). Required unless `generate` or `url` is set. */
    key?: string;
    /** otpauth:// URL to import. */
    url?: string;
    /** Key size in bytes (default 20). */
    key_size?: number;
    /** Algorithm: SHA1, SHA256, SHA512. */
    algorithm?: "SHA1" | "SHA256" | "SHA512";
    /** Number of digits: 6 or 8. */
    digits?: 6 | 8;
    /** Period in seconds (default 30). */
    period?: number;
    /** Skew: number of periods to allow (default 1). */
    skew?: number;
    /** Additional count for the HOTP counter. */
    qr_size?: number;
    /** Issuer name for the otpauth URL. */
    issuer?: string;
    /** Account name for the otpauth URL. */
    account_name?: string;
    exported?: boolean;
}

/** Create TOTP key response (when generate=true). */
export interface TOTPCreateKeyResponse {
    url?: string;
    barcode?: string;
}

/** Read TOTP key response. */
export interface TOTPKeyResponse {
    account_name: string;
    algorithm: string;
    digits: number;
    issuer: string;
    period: number;
}

/** Generate code response. */
export interface TOTPCodeResponse {
    code: string;
}

/** Validate code request. */
export interface TOTPValidateRequest {
    code: string;
}

/** Validate code response. */
export interface TOTPValidateResponse {
    valid: boolean;
}

/** TOTP list keys response. */
export interface TOTPListKeysResponse {
    keys: string[];
}
