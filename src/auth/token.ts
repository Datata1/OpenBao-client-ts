import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type {
    TokenAccessorsListResponse,
    TokenCreateRequest,
    TokenLookupResponse,
    TokenRenewRequest,
    TokenRevokeRequest,
    TokenRoleConfig,
    TokenRoleResponse,
} from "../types/auth/token";
import type { OpenBaoResponse } from "../types/common";

export class TokenAuth extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "token") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/auth/${mount}`);
    }

    async create(payload?: TokenCreateRequest): Promise<OpenBaoResponse<unknown>> {
        return this.post<unknown>("/create", payload);
    }

    async createOrphan(payload?: TokenCreateRequest): Promise<OpenBaoResponse<unknown>> {
        return this.post<unknown>("/create-orphan", payload);
    }

    async createWithRole(roleName: string, payload?: TokenCreateRequest): Promise<OpenBaoResponse<unknown>> {
        return this.post<unknown>(`/create/${roleName}`, payload);
    }

    async lookupSelf(): Promise<OpenBaoResponse<TokenLookupResponse>> {
        return this.get<TokenLookupResponse>("/lookup-self");
    }

    async lookup(token: string): Promise<OpenBaoResponse<TokenLookupResponse>> {
        return this.post<TokenLookupResponse>("/lookup", { token });
    }

    async lookupAccessor(accessor: string): Promise<OpenBaoResponse<TokenLookupResponse>> {
        return this.post<TokenLookupResponse>("/lookup-accessor", { accessor });
    }

    async renewSelf(increment?: string): Promise<OpenBaoResponse<unknown>> {
        return this.post<unknown>("/renew-self", increment ? { increment } : undefined);
    }

    async renew(payload: TokenRenewRequest): Promise<OpenBaoResponse<unknown>> {
        return this.post<unknown>("/renew", payload);
    }

    async revokeSelf(): Promise<void> {
        await this.post("/revoke-self");
    }

    async revoke(payload: TokenRevokeRequest): Promise<void> {
        await this.post("/revoke", payload);
    }

    async revokeAccessor(accessor: string): Promise<void> {
        await this.post("/revoke-accessor", { accessor });
    }

    async revokeOrphan(token: string): Promise<void> {
        await this.post("/revoke-orphan", { token });
    }

    async listAccessors(): Promise<OpenBaoResponse<TokenAccessorsListResponse>> {
        return super.list<TokenAccessorsListResponse>("/accessors");
    }

    async createRole(name: string, config: TokenRoleConfig): Promise<void> {
        await this.post(`/roles/${name}`, config);
    }

    async readRole(name: string): Promise<OpenBaoResponse<TokenRoleResponse>> {
        return this.get<TokenRoleResponse>(`/roles/${name}`);
    }

    async deleteRole(name: string): Promise<void> {
        await this.del(`/roles/${name}`);
    }

    async listRoles(): Promise<OpenBaoResponse<{ keys: string[] }>> {
        return super.list<{ keys: string[] }>("/roles");
    }
}
