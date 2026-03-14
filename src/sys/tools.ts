import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { ToolsHashRequest, ToolsHashResponse, ToolsRandomRequest, ToolsRandomResponse } from "../types/sys";

/** `/v1/sys/tools` — server-side hash / random utilities. */
export class SysTools extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async hash(payload: ToolsHashRequest): Promise<OpenBaoResponse<ToolsHashResponse>> {
        return this.post<ToolsHashResponse>("/tools/hash", payload);
    }

    async random(payload?: ToolsRandomRequest): Promise<OpenBaoResponse<ToolsRandomResponse>> {
        return this.post<ToolsRandomResponse>("/tools/random", payload);
    }
}
