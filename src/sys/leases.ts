import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type {
    LeaseListResponse,
    LeaseLookupResponse,
    LeaseRenewRequest,
    LeaseRenewResponse,
    LeaseRevokeRequest,
} from "../types/sys";

export class SysLeases extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async lookup(leaseId: string): Promise<OpenBaoResponse<LeaseLookupResponse>> {
        return this.put<LeaseLookupResponse>("/leases/lookup", { lease_id: leaseId });
    }

    async renew(payload: LeaseRenewRequest): Promise<OpenBaoResponse<LeaseRenewResponse>> {
        return this.put<LeaseRenewResponse>("/leases/renew", payload);
    }

    async revoke(payload: LeaseRevokeRequest): Promise<void> {
        await this.put("/leases/revoke", payload);
    }

    async revokeForce(prefix: string): Promise<void> {
        await this.put(`/leases/revoke-force/${prefix}`);
    }

    async revokePrefix(prefix: string): Promise<void> {
        await this.put(`/leases/revoke-prefix/${prefix}`);
    }

    async listLeases(prefix: string): Promise<OpenBaoResponse<LeaseListResponse>> {
        return super.list<LeaseListResponse>(`/leases/lookup/${prefix}`);
    }
}
