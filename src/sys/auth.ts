import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { AuthMethodInput, AuthMethodOutput, AuthMethodsListResponse, MountTuneInput } from "../types/sys";

/** `/v1/sys/auth` — auth method lifecycle. */
export class SysAuth extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async listMethods(): Promise<OpenBaoResponse<AuthMethodsListResponse>> {
        return this.get<AuthMethodsListResponse>("/auth");
    }

    async read(path: string): Promise<OpenBaoResponse<AuthMethodOutput>> {
        return this.get<AuthMethodOutput>(`/auth/${path}`);
    }

    async enable(path: string, config: AuthMethodInput): Promise<void> {
        await this.post(`/auth/${path}`, config);
    }

    async disable(path: string): Promise<void> {
        await this.del(`/auth/${path}`);
    }

    async tune(path: string, config: MountTuneInput): Promise<void> {
        await this.post(`/auth/${path}/tune`, config);
    }

    async readTune(path: string): Promise<OpenBaoResponse<MountTuneInput>> {
        return this.get<MountTuneInput>(`/auth/${path}/tune`);
    }
}
