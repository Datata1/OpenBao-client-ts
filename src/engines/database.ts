import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type {
    DatabaseConnectionConfig,
    DatabaseConnectionResponse,
    DatabaseCredentialsResponse,
    DatabaseListResponse,
    DatabaseRoleConfig,
    DatabaseRoleResponse,
    DatabaseStaticCredentialsResponse,
    DatabaseStaticRoleConfig,
    DatabaseStaticRoleResponse,
} from "../types/engines/database";

/**
 * Database secrets engine — dynamic credential generation.
 */
export class DatabaseEngine extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "database") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/${mount}`);
    }

    // ─── Connections ─────────────────────────────────────────────────

    async configureConnection(name: string, config: DatabaseConnectionConfig): Promise<void> {
        await this.post(`/config/${name}`, config);
    }

    async readConnection(name: string): Promise<OpenBaoResponse<DatabaseConnectionResponse>> {
        return this.get<DatabaseConnectionResponse>(`/config/${name}`);
    }

    async deleteConnection(name: string): Promise<void> {
        await this.del(`/config/${name}`);
    }

    async listConnections(): Promise<OpenBaoResponse<DatabaseListResponse>> {
        return this.list<DatabaseListResponse>("/config");
    }

    async resetConnection(name: string): Promise<void> {
        await this.post(`/reset/${name}`);
    }

    async rotateRootCredentials(name: string): Promise<void> {
        await this.post(`/rotate-root/${name}`);
    }

    // ─── Dynamic Roles ──────────────────────────────────────────────

    async createRole(name: string, config: DatabaseRoleConfig): Promise<void> {
        await this.post(`/roles/${name}`, config);
    }

    async readRole(name: string): Promise<OpenBaoResponse<DatabaseRoleResponse>> {
        return this.get<DatabaseRoleResponse>(`/roles/${name}`);
    }

    async deleteRole(name: string): Promise<void> {
        await this.del(`/roles/${name}`);
    }

    async listRoles(): Promise<OpenBaoResponse<DatabaseListResponse>> {
        return this.list<DatabaseListResponse>("/roles");
    }

    async getCredentials(roleName: string): Promise<OpenBaoResponse<DatabaseCredentialsResponse>> {
        return this.get<DatabaseCredentialsResponse>(`/creds/${roleName}`);
    }

    // ─── Static Roles ───────────────────────────────────────────────

    async createStaticRole(name: string, config: DatabaseStaticRoleConfig): Promise<void> {
        await this.post(`/static-roles/${name}`, config);
    }

    async readStaticRole(name: string): Promise<OpenBaoResponse<DatabaseStaticRoleResponse>> {
        return this.get<DatabaseStaticRoleResponse>(`/static-roles/${name}`);
    }

    async deleteStaticRole(name: string): Promise<void> {
        await this.del(`/static-roles/${name}`);
    }

    async listStaticRoles(): Promise<OpenBaoResponse<DatabaseListResponse>> {
        return this.list<DatabaseListResponse>("/static-roles");
    }

    async getStaticCredentials(roleName: string): Promise<OpenBaoResponse<DatabaseStaticCredentialsResponse>> {
        return this.get<DatabaseStaticCredentialsResponse>(`/static-creds/${roleName}`);
    }

    async rotateStaticRole(name: string): Promise<void> {
        await this.post(`/rotate-role/${name}`);
    }
}
