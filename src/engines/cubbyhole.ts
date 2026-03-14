import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";

/**
 * Cubbyhole secrets engine — per-token private secret storage.
 * No versioning, no sharing between tokens.
 */
export class CubbyholeEngine extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/cubbyhole");
    }

    async read<T = Record<string, unknown>>(path: string): Promise<OpenBaoResponse<T>> {
        return this.get<T>(`/${path}`);
    }

    async write<T = Record<string, unknown>>(path: string, data: T): Promise<void> {
        await this.post(`/${path}`, data);
    }

    async deleteSecret(path: string): Promise<void> {
        await this.del(`/${path}`);
    }

    async listSecrets(path = ""): Promise<OpenBaoResponse<{ keys: string[] }>> {
        const suffix = path ? `/${path}` : "";
        return this.list<{ keys: string[] }>(suffix);
    }
}
