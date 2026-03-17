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

export interface TransitUpdateKeyRequest {
    min_decryption_version?: number;
    min_encryption_version?: number;
    deletion_allowed?: boolean;
    exportable?: boolean;
    allow_plaintext_backup?: boolean;
    auto_rotate_period?: string;
}

export interface TransitEncryptRequest {
    plaintext: string;
    context?: string;
    key_version?: number;
    nonce?: string;
    type?: string;
    convergent_encryption?: string;
}

export interface TransitEncryptResponse {
    ciphertext: string;
    key_version: number;
}

export interface TransitDecryptRequest {
    ciphertext: string;
    context?: string;
    nonce?: string;
}

export interface TransitDecryptResponse {
    plaintext: string;
}

export interface TransitRewrapRequest {
    ciphertext: string;
    context?: string;
    key_version?: number;
    nonce?: string;
}

export interface TransitRewrapResponse {
    ciphertext: string;
    key_version: number;
}

export interface TransitDataKeyRequest {
    context?: string;
    nonce?: string;
    bits?: 128 | 256 | 512;
    key_version?: number;
}

export interface TransitDataKeyResponse {
    ciphertext: string;
    key_version: number;
    plaintext?: string;
}

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

export interface TransitSignResponse {
    signature: string;
    key_version: number;
}

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

export interface TransitVerifyResponse {
    valid: boolean;
}

export interface TransitHashRequest {
    input: string;
    algorithm?: string;
    format?: "hex" | "base64";
}

export interface TransitHashResponse {
    sum: string;
}

export interface TransitHmacRequest {
    input: string;
    algorithm?: string;
    key_version?: number;
}

export interface TransitHmacResponse {
    hmac: string;
}

export interface TransitRandomRequest {
    bytes?: number;
    format?: "hex" | "base64";
}

export interface TransitRandomResponse {
    random_bytes: string;
}

export interface TransitListKeysResponse {
    keys: string[];
}

export type TransitExportKeyType = "encryption-key" | "signing-key" | "hmac-key" | "public-key";

export interface TransitExportKeyResponse {
    name: string;
    keys: Record<string, string>;
    type: string;
}

export interface TransitBackupResponse {
    backup: string;
}

export interface TransitRestoreRequest {
    backup: string;
    force?: boolean;
}

export interface TransitCacheConfigResponse {
    size: number;
}
