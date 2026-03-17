import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { MountInput, MountOutput, MountTuneInput, MountsListResponse } from "../types/sys";

export class SysMounts extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async listMounts(): Promise<OpenBaoResponse<MountsListResponse>> {
        return this.get<MountsListResponse>("/mounts");
    }

    async read(path: string): Promise<OpenBaoResponse<MountOutput>> {
        return this.get<MountOutput>(`/mounts/${path}`);
    }

    async enable(path: string, config: MountInput): Promise<void> {
        await this.post(`/mounts/${path}`, config);
    }

    async disable(path: string): Promise<void> {
        await this.del(`/mounts/${path}`);
    }

    async tune(path: string, config: MountTuneInput): Promise<void> {
        await this.post(`/mounts/${path}/tune`, config);
    }

    async readTune(path: string): Promise<OpenBaoResponse<MountTuneInput>> {
        return this.get<MountTuneInput>(`/mounts/${path}/tune`);
    }
}
