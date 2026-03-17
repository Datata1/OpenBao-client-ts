import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { HAStatusResponse, LeaderResponse } from "../types/sys";

export class SysLeader extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async leader(): Promise<OpenBaoResponse<LeaderResponse>> {
        return this.get<LeaderResponse>("/leader");
    }

    async haStatus(): Promise<OpenBaoResponse<HAStatusResponse>> {
        return this.get<HAStatusResponse>("/ha-status");
    }

    async stepDown(): Promise<void> {
        await this.put("/step-down");
    }
}
