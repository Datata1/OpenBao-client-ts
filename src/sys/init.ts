import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { InitRequest, InitResponse, InitStatusResponse } from "../types/sys";

export class SysInit extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async status(): Promise<OpenBaoResponse<InitStatusResponse>> {
        return this.get<InitStatusResponse>("/init");
    }

    async initialize(payload: InitRequest): Promise<OpenBaoResponse<InitResponse>> {
        return this.put<InitResponse>("/init", payload);
    }
}
