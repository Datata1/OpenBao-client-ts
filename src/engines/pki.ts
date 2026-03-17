import { BaseEngine } from "../core/base-engine";
import type { OpenBaoCoreClient } from "../core/client";
import type { OpenBaoResponse } from "../types/common";
import type {
    PKICRLConfig,
    PKICertificateResponse,
    PKIGenerateIntermediateRequest,
    PKIGenerateIntermediateResponse,
    PKIGenerateRootRequest,
    PKIGenerateRootResponse,
    PKIIssueRequest,
    PKIIssuerResponse,
    PKIListResponse,
    PKIRevokeRequest,
    PKIRevokeResponse,
    PKIRoleConfig,
    PKIRoleResponse,
    PKISetSignedIntermediateRequest,
    PKISignRequest,
    PKITidyRequest,
    PKIURLsConfig,
} from "../types/engines/pki";

export class PKIEngine extends BaseEngine {
    constructor(client: OpenBaoCoreClient, mountPoint = "pki") {
        const mount = mountPoint.replace(/^\/+|\/+$/g, "");
        super(client, `/v1/${mount}`);
    }

    async issue(roleName: string, payload: PKIIssueRequest): Promise<OpenBaoResponse<PKICertificateResponse>> {
        return this.post<PKICertificateResponse>(`/issue/${roleName}`, payload);
    }

    async sign(roleName: string, payload: PKISignRequest): Promise<OpenBaoResponse<PKICertificateResponse>> {
        return this.post<PKICertificateResponse>(`/sign/${roleName}`, payload);
    }

    async revoke(payload: PKIRevokeRequest): Promise<OpenBaoResponse<PKIRevokeResponse>> {
        return this.post<PKIRevokeResponse>("/revoke", payload);
    }

    async generateRoot(payload: PKIGenerateRootRequest): Promise<OpenBaoResponse<PKIGenerateRootResponse>> {
        return this.post<PKIGenerateRootResponse>(`/root/generate/${payload.type}`, payload);
    }

    async deleteRoot(): Promise<void> {
        await this.del("/root");
    }

    async generateIntermediate(
        payload: PKIGenerateIntermediateRequest,
    ): Promise<OpenBaoResponse<PKIGenerateIntermediateResponse>> {
        return this.post<PKIGenerateIntermediateResponse>(`/intermediate/generate/${payload.type}`, payload);
    }

    async setSignedIntermediate(payload: PKISetSignedIntermediateRequest): Promise<void> {
        await this.post("/intermediate/set-signed", payload);
    }

    async signIntermediate(payload: PKISignRequest): Promise<OpenBaoResponse<PKICertificateResponse>> {
        return this.post<PKICertificateResponse>("/root/sign-intermediate", payload);
    }

    async listIssuers(): Promise<OpenBaoResponse<PKIListResponse>> {
        return this.list<PKIListResponse>("/issuers");
    }

    async readIssuer(issuerId: string): Promise<OpenBaoResponse<PKIIssuerResponse>> {
        return this.get<PKIIssuerResponse>(`/issuer/${issuerId}`);
    }

    async createRole(name: string, config: PKIRoleConfig): Promise<void> {
        await this.post(`/roles/${name}`, config);
    }

    async readRole(name: string): Promise<OpenBaoResponse<PKIRoleResponse>> {
        return this.get<PKIRoleResponse>(`/roles/${name}`);
    }

    async deleteRole(name: string): Promise<void> {
        await this.del(`/roles/${name}`);
    }

    async listRoles(): Promise<OpenBaoResponse<PKIListResponse>> {
        return this.list<PKIListResponse>("/roles");
    }

    async readCRLConfig(): Promise<OpenBaoResponse<PKICRLConfig>> {
        return this.get<PKICRLConfig>("/config/crl");
    }

    async setCRLConfig(config: PKICRLConfig): Promise<void> {
        await this.post("/config/crl", config);
    }

    async readURLs(): Promise<OpenBaoResponse<PKIURLsConfig>> {
        return this.get<PKIURLsConfig>("/config/urls");
    }

    async setURLs(config: PKIURLsConfig): Promise<void> {
        await this.post("/config/urls", config);
    }

    async tidy(payload: PKITidyRequest): Promise<void> {
        await this.post("/tidy", payload);
    }

    async rotateCRL(): Promise<OpenBaoResponse<{ success: boolean }>> {
        return this.get<{ success: boolean }>("/crl/rotate");
    }
}
