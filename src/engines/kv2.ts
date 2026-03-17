import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type {
    KV2Data,
    KV2FullMetadata,
    KV2ListResponse,
    KV2WriteOptions,
    KV2WriteResponse,
} from "../types/engines/kv2";

/**
 * KV Version 2 secrets engine.
 *
 * @example
 * ```ts
 * const secret = await kv2.read<{ password: string }>("my-app/config");
 * console.log(secret.data.data.password);
 * ```
 */
export class KV2Engine extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "secret") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/${mount}`);
    }

    async read<T = Record<string, unknown>>(path: string, version?: number): Promise<OpenBaoResponse<KV2Data<T>>> {
        const qs = version !== undefined ? `?version=${version}` : "";
        return this.get<KV2Data<T>>(`/data/${path}${qs}`);
    }

    async write<T = Record<string, unknown>>(
        path: string,
        data: T,
        options?: KV2WriteOptions,
    ): Promise<OpenBaoResponse<KV2WriteResponse>> {
        const body: Record<string, unknown> = { data };
        if (options?.cas !== undefined) {
            body.options = { cas: options.cas };
        }
        return this.post<KV2WriteResponse>(`/data/${path}`, body);
    }

    async patchSecret<T = Record<string, unknown>>(
        path: string,
        data: Partial<T>,
    ): Promise<OpenBaoResponse<KV2WriteResponse>> {
        return this.patch<KV2WriteResponse>(`/data/${path}`, { data });
    }

    async deleteLatest(path: string): Promise<void> {
        await this.del(`/data/${path}`);
    }

    async deleteVersions(path: string, versions: number[]): Promise<void> {
        await this.post(`/delete/${path}`, { versions });
    }

    async undelete(path: string, versions: number[]): Promise<void> {
        await this.post(`/undelete/${path}`, { versions });
    }

    async destroy(path: string, versions: number[]): Promise<void> {
        await this.post(`/destroy/${path}`, { versions });
    }

    async listSecrets(path = ""): Promise<OpenBaoResponse<KV2ListResponse>> {
        const suffix = path ? `/${path}` : "";
        return this.list<KV2ListResponse>(`/metadata${suffix}`);
    }

    async readMetadata(path: string): Promise<OpenBaoResponse<KV2FullMetadata>> {
        return this.get<KV2FullMetadata>(`/metadata/${path}`);
    }

    async deleteMetadata(path: string): Promise<void> {
        await this.del(`/metadata/${path}`);
    }
}
