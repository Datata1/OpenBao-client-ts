import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type {
    AppRoleListRolesResponse,
    AppRoleLoginRequest,
    AppRoleRoleConfig,
    AppRoleRoleIdResponse,
    AppRoleRoleResponse,
    AppRoleSecretIdAccessorsResponse,
    AppRoleSecretIdLookupResponse,
    AppRoleSecretIdRequest,
    AppRoleSecretIdResponse,
} from "../types/auth/approle";
import type { OpenBaoResponse } from "../types/common";

/**
 * AppRole auth method — `/v1/auth/approle`.
 */
export class AppRoleAuth extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "approle") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/auth/${mount}`);
    }

    // ─── Login ───────────────────────────────────────────────────────

    async login(payload: AppRoleLoginRequest): Promise<OpenBaoResponse<unknown>> {
        const result = await this.post<unknown>("/login", payload);
        if (result.auth?.client_token) {
            this.client.setToken(result.auth.client_token);
        }
        return result;
    }

    // ─── Roles ───────────────────────────────────────────────────────

    async createRole(name: string, config: AppRoleRoleConfig): Promise<void> {
        await this.post(`/role/${name}`, config);
    }

    async readRole(name: string): Promise<OpenBaoResponse<AppRoleRoleResponse>> {
        return this.get<AppRoleRoleResponse>(`/role/${name}`);
    }

    async deleteRole(name: string): Promise<void> {
        await this.del(`/role/${name}`);
    }

    async listRoles(): Promise<OpenBaoResponse<AppRoleListRolesResponse>> {
        return super.list<AppRoleListRolesResponse>("/role");
    }

    // ─── Role ID ─────────────────────────────────────────────────────

    async readRoleId(name: string): Promise<OpenBaoResponse<AppRoleRoleIdResponse>> {
        return this.get<AppRoleRoleIdResponse>(`/role/${name}/role-id`);
    }

    async updateRoleId(name: string, roleId: string): Promise<void> {
        await this.post(`/role/${name}/role-id`, { role_id: roleId });
    }

    // ─── Secret ID ──────────────────────────────────────────────────

    async generateSecretId(
        roleName: string,
        payload?: AppRoleSecretIdRequest,
    ): Promise<OpenBaoResponse<AppRoleSecretIdResponse>> {
        return this.post<AppRoleSecretIdResponse>(`/role/${roleName}/secret-id`, payload);
    }

    async lookupSecretId(roleName: string, secretId: string): Promise<OpenBaoResponse<AppRoleSecretIdLookupResponse>> {
        return this.post<AppRoleSecretIdLookupResponse>(`/role/${roleName}/secret-id/lookup`, { secret_id: secretId });
    }

    async destroySecretId(roleName: string, secretId: string): Promise<void> {
        await this.post(`/role/${roleName}/secret-id/destroy`, {
            secret_id: secretId,
        });
    }

    async listSecretIdAccessors(roleName: string): Promise<OpenBaoResponse<AppRoleSecretIdAccessorsResponse>> {
        return super.list<AppRoleSecretIdAccessorsResponse>(`/role/${roleName}/secret-id`);
    }
}
