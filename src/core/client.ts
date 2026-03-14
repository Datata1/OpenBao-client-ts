import { type Dispatcher, request } from "undici";
import type { OpenBaoResponse } from "../types/common";

export interface OpenBaoClientConfig {
    /** Base URL of the OpenBao / Vault server (e.g. "https://vault.example.com"). */
    endpoint: string;
    /** Authentication token. Can be omitted for unauthenticated calls (e.g. login). */
    token?: string;
    /** Optional namespace (Enterprise / OpenBao namespace support). */
    namespace?: string;
}

/** Options forwarded to undici's `request()`. */
export interface RequestOptions {
    method?: Dispatcher.HttpMethod;
    body?: string;
    headers?: Record<string, string>;
}

/**
 * Low-level HTTP client that wraps undici's `request()`.
 * All engine classes delegate their HTTP calls through this client.
 */
export class OpenBaoCoreClient {
    private readonly endpoint: string;
    private token: string;
    private readonly namespace?: string;

    constructor(config: OpenBaoClientConfig) {
        // Strip trailing slash so callers can use paths starting with `/`
        this.endpoint = config.endpoint.replace(/\/+$/, "");
        this.token = config.token ?? "";
        this.namespace = config.namespace;
    }

    /**
     * Update the authentication token used for subsequent requests.
     * Called automatically by auth login methods.
     */
    setToken(token: string): void {
        this.token = token;
    }

    /**
     * Send an authenticated request to the OpenBao API and return the
     * strongly-typed JSON envelope.
     *
     * @param path - API path **including** the leading `/v1/` prefix.
     * @param opts - Optional request overrides (method, body, headers).
     * @returns      Parsed `OpenBaoResponse<T>`.
     */
    async request<T>(path: string, opts: RequestOptions = {}): Promise<OpenBaoResponse<T>> {
        const url = `${this.endpoint}${path}`;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...opts.headers,
            "X-Vault-Token": this.token,
        };

        if (this.namespace) {
            headers["X-Vault-Namespace"] = this.namespace;
        }

        const { statusCode, body } = await request(url, {
            method: opts.method ?? "GET",
            headers,
            body: opts.body,
        });

        if (statusCode < 200 || statusCode >= 300) {
            const text = await body.text();
            throw new OpenBaoError(`OpenBao request failed: ${statusCode}`, statusCode, text);
        }

        return (await body.json()) as OpenBaoResponse<T>;
    }
}

/**
 * Custom error class that preserves the HTTP status code and raw body
 * returned by OpenBao.
 */
export class OpenBaoError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly responseBody: string,
    ) {
        super(message);
        this.name = "OpenBaoError";
    }
}
