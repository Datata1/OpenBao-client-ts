import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { HealthResponse } from "../types/sys";

/** `GET /v1/sys/health` */
export class SysHealth extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async check(): Promise<OpenBaoResponse<HealthResponse>> {
        return this.get<HealthResponse>("/health");
    }
}
