import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type {
    SSHIssueRequest,
    SSHIssueResponse,
    SSHListRolesResponse,
    SSHRoleConfig,
    SSHRoleResponse,
    SSHSignRequest,
    SSHSignResponse,
    SSHVerifyOTPRequest,
    SSHVerifyOTPResponse,
} from "../types/engines/ssh";

export class SSHEngine extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "ssh") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/${mount}`);
    }

    async configureCA(privateKey?: string, publicKey?: string): Promise<void> {
        await this.post("/config/ca", {
            ...(privateKey && { private_key: privateKey }),
            ...(publicKey && { public_key: publicKey }),
        });
    }

    async deleteCA(): Promise<void> {
        await this.del("/config/ca");
    }

    async createRole(name: string, config: SSHRoleConfig): Promise<void> {
        await this.post(`/roles/${name}`, config);
    }

    async readRole(name: string): Promise<OpenBaoResponse<SSHRoleResponse>> {
        return this.get<SSHRoleResponse>(`/roles/${name}`);
    }

    async deleteRole(name: string): Promise<void> {
        await this.del(`/roles/${name}`);
    }

    async listRoles(): Promise<OpenBaoResponse<SSHListRolesResponse>> {
        return this.list<SSHListRolesResponse>("/roles");
    }

    async signKey(roleName: string, payload: SSHSignRequest): Promise<OpenBaoResponse<SSHSignResponse>> {
        return this.post<SSHSignResponse>(`/sign/${roleName}`, payload);
    }

    async issueCredential(roleName: string, payload: SSHIssueRequest): Promise<OpenBaoResponse<SSHIssueResponse>> {
        return this.post<SSHIssueResponse>(`/issue/${roleName}`, payload);
    }

    async verifyOTP(payload: SSHVerifyOTPRequest): Promise<OpenBaoResponse<SSHVerifyOTPResponse>> {
        return this.post<SSHVerifyOTPResponse>("/verify", payload);
    }

    async readPublicKey(): Promise<OpenBaoResponse<{ public_key: string }>> {
        return this.get<{ public_key: string }>("/config/ca");
    }
}
