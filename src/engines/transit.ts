import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type {
    TransitBackupResponse,
    TransitCacheConfigResponse,
    TransitCreateKeyRequest,
    TransitDataKeyRequest,
    TransitDataKeyResponse,
    TransitDecryptRequest,
    TransitDecryptResponse,
    TransitEncryptRequest,
    TransitEncryptResponse,
    TransitExportKeyResponse,
    TransitExportKeyType,
    TransitHashRequest,
    TransitHashResponse,
    TransitHmacRequest,
    TransitHmacResponse,
    TransitKeyResponse,
    TransitListKeysResponse,
    TransitRandomRequest,
    TransitRandomResponse,
    TransitRestoreRequest,
    TransitRewrapRequest,
    TransitRewrapResponse,
    TransitSignRequest,
    TransitSignResponse,
    TransitUpdateKeyRequest,
    TransitVerifyRequest,
    TransitVerifyResponse,
} from "../types/engines/transit";

/**
 * Transit secrets engine — encryption as a service.
 */
export class TransitEngine extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "transit") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/${mount}`);
    }

    // ─── Keys ────────────────────────────────────────────────────────

    async createKey(name: string, config?: TransitCreateKeyRequest): Promise<void> {
        await this.post(`/keys/${name}`, config);
    }

    async readKey(name: string): Promise<OpenBaoResponse<TransitKeyResponse>> {
        return this.get<TransitKeyResponse>(`/keys/${name}`);
    }

    async updateKeyConfig(name: string, config: TransitUpdateKeyRequest): Promise<void> {
        await this.post(`/keys/${name}/config`, config);
    }

    async deleteKey(name: string): Promise<void> {
        await this.del(`/keys/${name}`);
    }

    async listKeys(): Promise<OpenBaoResponse<TransitListKeysResponse>> {
        return this.list<TransitListKeysResponse>("/keys");
    }

    async rotateKey(name: string): Promise<void> {
        await this.post(`/keys/${name}/rotate`);
    }

    // ─── Export / Backup / Restore ───────────────────────────────────

    async exportKey(
        keyType: TransitExportKeyType,
        name: string,
        version?: string,
    ): Promise<OpenBaoResponse<TransitExportKeyResponse>> {
        const versionSuffix = version ? `/${version}` : "";
        return this.get<TransitExportKeyResponse>(`/export/${keyType}/${name}${versionSuffix}`);
    }

    async backupKey(name: string): Promise<OpenBaoResponse<TransitBackupResponse>> {
        return this.get<TransitBackupResponse>(`/backup/${name}`);
    }

    async restoreKey(name: string, payload: TransitRestoreRequest): Promise<void> {
        await this.post(`/restore/${name}`, payload);
    }

    // ─── Encrypt / Decrypt / Rewrap ──────────────────────────────────

    async encrypt(keyName: string, payload: TransitEncryptRequest): Promise<OpenBaoResponse<TransitEncryptResponse>> {
        return this.post<TransitEncryptResponse>(`/encrypt/${keyName}`, payload);
    }

    async decrypt(keyName: string, payload: TransitDecryptRequest): Promise<OpenBaoResponse<TransitDecryptResponse>> {
        return this.post<TransitDecryptResponse>(`/decrypt/${keyName}`, payload);
    }

    async rewrap(keyName: string, payload: TransitRewrapRequest): Promise<OpenBaoResponse<TransitRewrapResponse>> {
        return this.post<TransitRewrapResponse>(`/rewrap/${keyName}`, payload);
    }

    // ─── Data Key ────────────────────────────────────────────────────

    async generateDataKey(
        keyName: string,
        type: "plaintext" | "wrapped",
        payload?: TransitDataKeyRequest,
    ): Promise<OpenBaoResponse<TransitDataKeyResponse>> {
        return this.post<TransitDataKeyResponse>(`/datakey/${type}/${keyName}`, payload);
    }

    // ─── Sign / Verify ──────────────────────────────────────────────

    async sign(keyName: string, payload: TransitSignRequest): Promise<OpenBaoResponse<TransitSignResponse>> {
        return this.post<TransitSignResponse>(`/sign/${keyName}`, payload);
    }

    async verify(keyName: string, payload: TransitVerifyRequest): Promise<OpenBaoResponse<TransitVerifyResponse>> {
        return this.post<TransitVerifyResponse>(`/verify/${keyName}`, payload);
    }

    // ─── Hash / HMAC / Random ───────────────────────────────────────

    async hash(payload: TransitHashRequest): Promise<OpenBaoResponse<TransitHashResponse>> {
        return this.post<TransitHashResponse>("/hash", payload);
    }

    async hmac(keyName: string, payload: TransitHmacRequest): Promise<OpenBaoResponse<TransitHmacResponse>> {
        return this.post<TransitHmacResponse>(`/hmac/${keyName}`, payload);
    }

    async random(payload?: TransitRandomRequest): Promise<OpenBaoResponse<TransitRandomResponse>> {
        return this.post<TransitRandomResponse>("/random", payload);
    }

    // ─── Cache ───────────────────────────────────────────────────────

    async readCacheConfig(): Promise<OpenBaoResponse<TransitCacheConfigResponse>> {
        return this.get<TransitCacheConfigResponse>("/cache-config");
    }

    async setCacheConfig(size: number): Promise<void> {
        await this.post("/cache-config", { size });
    }
}
