import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type { PolicyInput, PolicyListResponse, PolicyResponse } from "../types/sys";

export class SysPolicies extends BaseEngine {
    constructor(client: OpenBaoCoreClient) {
        super(client, "/v1/sys");
    }

    async listPolicies(): Promise<OpenBaoResponse<PolicyListResponse>> {
        return super.list<PolicyListResponse>("/policies/acl");
    }

    async read(name: string): Promise<OpenBaoResponse<PolicyResponse>> {
        return this.get<PolicyResponse>(`/policies/acl/${name}`);
    }

    async create(name: string, payload: PolicyInput): Promise<void> {
        await this.put(`/policies/acl/${name}`, payload);
    }

    async update(name: string, payload: PolicyInput): Promise<void> {
        await this.put(`/policies/acl/${name}`, payload);
    }

    async deletePolicy(name: string): Promise<void> {
        await this.del(`/policies/acl/${name}`);
    }
}
