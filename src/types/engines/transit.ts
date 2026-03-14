// ─── Transit Engine Types ────────────────────────────────────────────

/** Request to create or update a transit encryption key. */
export interface TransitCreateKeyRequest {
    type?:
        | "aes128-gcm96"
        | "aes256-gcm96"
        | "chacha20-poly1305"
        | "ed25519"
        | "ecdsa-p256"
        | "ecdsa-p384"
        | "ecdsa-p521"
        | "rsa-2048"
        | "rsa-3072"
        | "rsa-4096";
    convergent_encryption?: boolean;
    derived?: boolean;
    exportable?: boolean;
    allow_plaintext_backup?: boolean;
    auto_rotate_period?: string;
}

/** Response when reading a transit key. */
export interface TransitKeyResponse {
    type: string;
    deletion_allowed: boolean;
    derived: boolean;
    exportable: boolean;
    allow_plaintext_backup: boolean;
    keys: Record<string, number | Record<string, unknown>>;
    min_decryption_version: number;
    min_encryption_version: number;
    name: string;
    supports_encryption: boolean;
    supports_decryption: boolean;
    supports_derivation: boolean;
    supports_signing: boolean;
    auto_rotate_period: string;
    latest_version: number;
}

/** Request to configure/update an existing transit key. */
export interface TransitUpdateKeyRequest {
    min_decryption_version?: number;
    min_encryption_version?: number;
    deletion_allowed?: boolean;
    exportable?: boolean;
    allow_plaintext_backup?: boolean;
    auto_rotate_period?: string;
}

/** Encrypt request body. */
export interface TransitEncryptRequest {
    plaintext: string;
    context?: string;
    key_version?: number;
    nonce?: string;
    type?: string;
    convergent_encryption?: string;
}

/** Encrypt response. */
export interface TransitEncryptResponse {
    ciphertext: string;
    key_version: number;
}

/** Decrypt request body. */
export interface TransitDecryptRequest {
    ciphertext: string;
    context?: string;
    nonce?: string;
}

/** Decrypt response. */
export interface TransitDecryptResponse {
    plaintext: string;
}

/** Rewrap request body. */
export interface TransitRewrapRequest {
    ciphertext: string;
    context?: string;
    key_version?: number;
    nonce?: string;
}

/** Rewrap response. */
export interface TransitRewrapResponse {
    ciphertext: string;
    key_version: number;
}

/** Generate data key request. */
export interface TransitDataKeyRequest {
    context?: string;
    nonce?: string;
    bits?: 128 | 256 | 512;
    key_version?: number;
}

/** Generate data key response. */
export interface TransitDataKeyResponse {
    ciphertext: string;
    key_version: number;
    plaintext?: string;
}

/** Sign request body. */
export interface TransitSignRequest {
    input: string;
    hash_algorithm?:
        | "sha2-224"
        | "sha2-256"
        | "sha2-384"
        | "sha2-512"
        | "sha3-224"
        | "sha3-256"
        | "sha3-384"
        | "sha3-512"
        | "none";
    context?: string;
    prehashed?: boolean;
    signature_algorithm?: "pss" | "pkcs1v15";
    marshaling_algorithm?: "asn1" | "jws";
    salt_length?: "auto" | "hash";
    key_version?: number;
}

/** Sign response. */
export interface TransitSignResponse {
    signature: string;
    key_version: number;
}

/** Verify request body. */
export interface TransitVerifyRequest {
    input: string;
    signature?: string;
    hmac?: string;
    hash_algorithm?: string;
    context?: string;
    prehashed?: boolean;
    signature_algorithm?: "pss" | "pkcs1v15";
    marshaling_algorithm?: "asn1" | "jws";
}

/** Verify response. */
export interface TransitVerifyResponse {
    valid: boolean;
}

/** Hash request. */
export interface TransitHashRequest {
    input: string;
    algorithm?: string;
    format?: "hex" | "base64";
}

/** Hash response. */
export interface TransitHashResponse {
    sum: string;
}

/** HMAC request. */
export interface TransitHmacRequest {
    input: string;
    algorithm?: string;
    key_version?: number;
}

/** HMAC response. */
export interface TransitHmacResponse {
    hmac: string;
}

/** Random bytes request. */
export interface TransitRandomRequest {
    bytes?: number;
    format?: "hex" | "base64";
}

/** Random bytes response. */
export interface TransitRandomResponse {
    random_bytes: string;
}

/** Transit key list response. */
export interface TransitListKeysResponse {
    keys: string[];
}

/** Export key request type. */
export type TransitExportKeyType = "encryption-key" | "signing-key" | "hmac-key" | "public-key";

/** Export key response. */
export interface TransitExportKeyResponse {
    name: string;
    keys: Record<string, string>;
    type: string;
}

/** Backup key response. */
export interface TransitBackupResponse {
    backup: string;
}

/** Restore key request. */
export interface TransitRestoreRequest {
    backup: string;
    force?: boolean;
}

/** Cache config response. */
export interface TransitCacheConfigResponse {
    size: number;
}
