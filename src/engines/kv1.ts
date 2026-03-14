import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { KV1Data, KV1ListResponse } from "../types/engines/kv1";

/**
 * KV Version 1 secrets engine (unversioned).
 */
export class KV1Engine extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "kv") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/${mount}`);
    }

    async read<T = Record<string, unknown>>(path: string): Promise<OpenBaoResponse<KV1Data<T>>> {
        return this.get<KV1Data<T>>(`/${path}`);
    }

    async write<T = Record<string, unknown>>(path: string, data: T): Promise<void> {
        await this.post(`/${path}`, data);
    }

    async deleteSecret(path: string): Promise<void> {
        await this.del(`/${path}`);
    }

    async listSecrets(path = ""): Promise<OpenBaoResponse<KV1ListResponse>> {
        const suffix = path ? `/${path}` : "";
        return this.list<KV1ListResponse>(suffix);
    }
}
