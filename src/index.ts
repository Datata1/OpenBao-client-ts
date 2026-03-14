import { Auth } from "./auth";
import { type OpenBaoClientConfig, OpenBaoCoreClient } from "./core/client";
import { CubbyholeEngine } from "./engines/cubbyhole";
import { DatabaseEngine } from "./engines/database";
import { KV1Engine } from "./engines/kv1";
import { KV2Engine } from "./engines/kv2";
import { PKIEngine } from "./engines/pki";
import { SSHEngine } from "./engines/ssh";
import { TOTPEngine } from "./engines/totp";
import { TransitEngine } from "./engines/transit";
import { Sys } from "./sys";

// ─── Re-exports ────────────────────────────────────────────────────

// Core
export type { OpenBaoClientConfig, RequestOptions } from "./core/client";
export { OpenBaoCoreClient, OpenBaoError } from "./core/client";
export { BaseEngine } from "./core/base-engine";

// Common types
export type {
    AuthInfo,
    ListKeysResponse,
    OpenBaoResponse,
    WrapInfo,
} from "./types/common";

// System types
export type * from "./types/sys";

// Auth types
export type * from "./types/auth/token";
export type * from "./types/auth/approle";
export type * from "./types/auth/userpass";

// Engine types
export type * from "./types/engines/kv2";
export type * from "./types/engines/kv1";
export type * from "./types/engines/transit";
export type * from "./types/engines/pki";
export type * from "./types/engines/database";
export type * from "./types/engines/ssh";
export type * from "./types/engines/totp";

// Facades & engines
export { Sys } from "./sys";
export { Auth } from "./auth";
export { KV2Engine } from "./engines/kv2";
export { KV1Engine } from "./engines/kv1";
export { TransitEngine } from "./engines/transit";
export { PKIEngine } from "./engines/pki";
export { DatabaseEngine } from "./engines/database";
export { SSHEngine } from "./engines/ssh";
export { TOTPEngine } from "./engines/totp";
export { CubbyholeEngine } from "./engines/cubbyhole";
export { TokenAuth } from "./auth/token";
export { AppRoleAuth } from "./auth/approle";
export { UserpassAuth } from "./auth/userpass";

// ─── Options ───────────────────────────────────────────────────────

export interface OpenBaoOptions extends OpenBaoClientConfig {
    /** Mount path for KV v2 (default `"secret"`). */
    kvMountPoint?: string;
    /** Mount path for KV v1 (default `"kv"`). */
    kv1MountPoint?: string;
    /** Mount path for Transit (default `"transit"`). */
    transitMountPoint?: string;
    /** Mount path for PKI (default `"pki"`). */
    pkiMountPoint?: string;
    /** Mount path for Database (default `"database"`). */
    databaseMountPoint?: string;
    /** Mount path for SSH (default `"ssh"`). */
    sshMountPoint?: string;
    /** Mount path for TOTP (default `"totp"`). */
    totpMountPoint?: string;
}

// ─── Main Facade ───────────────────────────────────────────────────

/**
 * High-level facade for interacting with an OpenBao / Vault server.
 *
 * @example
 * ```ts
 * const client = new OpenBaoClient({
 *   endpoint: "https://vault.example.com",
 *   token: "s.mytoken",
 * });
 *
 * // System
 * await client.sys.health.check();
 * await client.sys.seal.status();
 * await client.sys.mounts.enable("transit", { type: "transit" });
 *
 * // Auth
 * await client.auth.token.lookupSelf();
 * await client.auth.approle.login({ role_id: "...", secret_id: "..." });
 *
 * // Secret engines
 * const secret = await client.kv2.read<{ password: string }>("my-app/config");
 * const encrypted = await client.transit.encrypt("my-key", { plaintext: "..." });
 * ```
 */
export class OpenBaoClient {
    /** Low-level HTTP client — exposed for advanced / custom calls. */
    public readonly core: OpenBaoCoreClient;

    /** System backend (`/v1/sys/`). */
    public readonly sys: Sys;

    /** Auth methods. */
    public readonly auth: Auth;

    /** KV Version 2 secrets engine. */
    public readonly kv2: KV2Engine;

    /** KV Version 1 secrets engine. */
    public readonly kv1: KV1Engine;

    /** Transit secrets engine — encryption as a service. */
    public readonly transit: TransitEngine;

    /** PKI secrets engine — certificate management. */
    public readonly pki: PKIEngine;

    /** Database secrets engine — dynamic credentials. */
    public readonly database: DatabaseEngine;

    /** SSH secrets engine — certificate signing. */
    public readonly ssh: SSHEngine;

    /** TOTP secrets engine. */
    public readonly totp: TOTPEngine;

    /** Cubbyhole — per-token private storage. */
    public readonly cubbyhole: CubbyholeEngine;

    constructor(options: OpenBaoOptions) {
        this.core = new OpenBaoCoreClient(options);

        // System & Auth
        this.sys = new Sys(this.core);
        this.auth = new Auth(this.core);

        // Secret engines
        this.kv2 = new KV2Engine(this.core, options.kvMountPoint);
        this.kv1 = new KV1Engine(this.core, options.kv1MountPoint);
        this.transit = new TransitEngine(this.core, options.transitMountPoint);
        this.pki = new PKIEngine(this.core, options.pkiMountPoint);
        this.database = new DatabaseEngine(this.core, options.databaseMountPoint);
        this.ssh = new SSHEngine(this.core, options.sshMountPoint);
        this.totp = new TOTPEngine(this.core, options.totpMountPoint);
        this.cubbyhole = new CubbyholeEngine(this.core);
    }
}
