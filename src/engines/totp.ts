import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type {
    TOTPCodeResponse,
    TOTPCreateKeyRequest,
    TOTPCreateKeyResponse,
    TOTPKeyResponse,
    TOTPListKeysResponse,
    TOTPValidateRequest,
    TOTPValidateResponse,
} from "../types/engines/totp";

export class TOTPEngine extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "totp") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/${mount}`);
    }

    async createKey(name: string, config: TOTPCreateKeyRequest): Promise<OpenBaoResponse<TOTPCreateKeyResponse>> {
        return this.post<TOTPCreateKeyResponse>(`/keys/${name}`, config);
    }

    async readKey(name: string): Promise<OpenBaoResponse<TOTPKeyResponse>> {
        return this.get<TOTPKeyResponse>(`/keys/${name}`);
    }

    async deleteKey(name: string): Promise<void> {
        await this.del(`/keys/${name}`);
    }

    async listKeys(): Promise<OpenBaoResponse<TOTPListKeysResponse>> {
        return this.list<TOTPListKeysResponse>("/keys");
    }

    async generateCode(name: string): Promise<OpenBaoResponse<TOTPCodeResponse>> {
        return this.get<TOTPCodeResponse>(`/code/${name}`);
    }

    async validateCode(name: string, payload: TOTPValidateRequest): Promise<OpenBaoResponse<TOTPValidateResponse>> {
        return this.post<TOTPValidateResponse>(`/code/${name}`, payload);
    }
}
