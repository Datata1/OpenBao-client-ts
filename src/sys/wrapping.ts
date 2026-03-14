import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { WrapLookupResponse } from "../types/sys";

/** `/v1/sys/wrapping` — response wrapping utilities. */
export class SysWrapping extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async lookup(token: string): Promise<OpenBaoResponse<WrapLookupResponse>> {
        return this.post<WrapLookupResponse>("/wrapping/lookup", { token });
    }

    async rewrap(token: string): Promise<OpenBaoResponse<unknown>> {
        return this.post<unknown>("/wrapping/rewrap", { token });
    }

    async unwrap<T = unknown>(token?: string): Promise<OpenBaoResponse<T>> {
        return this.post<T>("/wrapping/unwrap", token ? { token } : undefined);
    }

    async wrap<T = unknown>(data: unknown, wrapTTL: string): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}/wrapping/wrap`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "X-Vault-Wrap-TTL": wrapTTL },
        });
    }
}
