import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { HealthResponse } from "../types/sys";

export class SysHealth extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async check(): Promise<OpenBaoResponse<HealthResponse>> {
        return this.get<HealthResponse>("/health");
    }
}
