import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { AuditDeviceInput, AuditDevicesListResponse } from "../types/sys";

export class SysAudit extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async listDevices(): Promise<OpenBaoResponse<AuditDevicesListResponse>> {
        return this.get<AuditDevicesListResponse>("/audit");
    }

    async enable(path: string, config: AuditDeviceInput): Promise<void> {
        await this.put(`/audit/${path}`, config);
    }

    async disable(path: string): Promise<void> {
        await this.del(`/audit/${path}`);
    }
}
