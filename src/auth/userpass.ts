import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type {
    UserpassListUsersResponse,
    UserpassLoginRequest,
    UserpassUserConfig,
    UserpassUserResponse,
} from "../types/auth/userpass";
import type { OpenBaoResponse } from "../types/common";

/**
 * Userpass auth method — `/v1/auth/userpass`.
 */
export class UserpassAuth extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "userpass") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/auth/${mount}`);
    }

    async login(username: string, payload: UserpassLoginRequest): Promise<OpenBaoResponse<unknown>> {
        const result = await this.post<unknown>(`/login/${username}`, payload);
        if (result.auth?.client_token) {
            this.client.setToken(result.auth.client_token);
        }
        return result;
    }

    // ─── Users ───────────────────────────────────────────────────────

    async createUser(username: string, config: UserpassUserConfig): Promise<void> {
        await this.post(`/users/${username}`, config);
    }

    async readUser(username: string): Promise<OpenBaoResponse<UserpassUserResponse>> {
        return this.get<UserpassUserResponse>(`/users/${username}`);
    }

    async deleteUser(username: string): Promise<void> {
        await this.del(`/users/${username}`);
    }

    async listUsers(): Promise<OpenBaoResponse<UserpassListUsersResponse>> {
        return super.list<UserpassListUsersResponse>("/users");
    }

    async updatePassword(username: string, password: string): Promise<void> {
        await this.post(`/users/${username}/password`, { password });
    }

    async updatePolicies(username: string, policies: string[]): Promise<void> {
        await this.post(`/users/${username}/policies`, {
            token_policies: policies,
        });
    }
}
