import type { OpenBaoResponse } from "../types/common";
import type { OpenBaoCoreClient } from "./client";

export abstract class BaseEngine {
    constructor(
        protected readonly client: OpenBaoCoreClient,
        protected readonly basePath: string,
    ) {}

    protected get<T>(path = ""): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`);
    }

    protected post<T>(path: string, body?: unknown): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    protected put<T>(path: string, body?: unknown): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "PUT",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    }

    protected patch<T>(path: string, body?: unknown): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "PATCH",
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers: { "Content-Type": "application/merge-patch+json" },
        });
    }

    protected del<T>(path: string): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "DELETE",
        });
    }

    protected list<T>(path = ""): Promise<OpenBaoResponse<T>> {
        return this.client.request<T>(`${this.basePath}${path}`, {
            method: "LIST",
        });
    }
}
