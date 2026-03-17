import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { SealStatusResponse, UnsealRequest } from "../types/sys";

export class SysSeal extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async status(): Promise<OpenBaoResponse<SealStatusResponse>> {
        return this.get<SealStatusResponse>("/seal-status");
    }

    async seal(): Promise<void> {
        await this.put("/seal");
    }

    async unseal(payload: UnsealRequest): Promise<OpenBaoResponse<SealStatusResponse>> {
        return this.put<SealStatusResponse>("/unseal", payload);
    }
}
