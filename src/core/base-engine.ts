import type { OpenBaoResponse } from "../types/common";
import type { OpenBaoCoreClient } from "./client";

/**
 * Abstract base class for all OpenBao engine / resource classes.
 *
 * Provides convenience HTTP methods that automatically prefix the
 * configured `basePath`, so each concrete engine only deals with
 * resource-relative paths.
 */
export abstract class BaseEngine {
    constructor(
        protected readonly client: OpenBaoCoreClient,
        protected readonly basePath: string,
    ) {}

    /** `GET basePath + path` */
    protected get<T>(path = ""): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`);
    }

    /** `POST basePath + path` with optional JSON body. */
    protected post<T>(path: string, body?: unknown): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    /** `PUT basePath + path` with optional JSON body. */
    protected put<T>(path: string, body?: unknown): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "PUT",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    /** `PATCH basePath + path` with merge-patch JSON body. */
    protected patch<T>(path: string, body?: unknown): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "PATCH",
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers: { "Content-Type": "application/merge-patch+json" },
        });
    }

    /** `DELETE basePath + path`. */
    protected del<T>(path: string): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "DELETE",
        });
    }

    /** `LIST basePath + path` (Vault-specific HTTP method). */
    protected list<T>(path = ""): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "LIST",
        });
    }
}
