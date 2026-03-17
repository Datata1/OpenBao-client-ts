import { execSync } from "node:child_process";
import { OpenBaoClient } from "../src/index";

/**
 * Default endpoint and root token matching docker-compose.test.yml.
 */
export const OPENBAO_ADDR = process.env.OPENBAO_ADDR ?? "http://127.0.0.1:8200";
export const ROOT_TOKEN = process.env.OPENBAO_TOKEN ?? "test-root-token";

/**
 * Create a fresh client for each test suite.
 */
export function createClient(overrides: Record<string, string> = {}): OpenBaoClient {
    return new OpenBaoClient({
        endpoint: OPENBAO_ADDR,
        token: ROOT_TOKEN,
        ...overrides,
    });
}

/**
 * Wait until the OpenBao server is ready (health endpoint returns 200).
 * Retries with exponential backoff up to ~30 s.
 */
export async function waitForOpenBao(maxRetries = 20): Promise<void> {
    const { request } = await import("undici");
    for (let i = 0; i < maxRetries; i++) {
        try {
            const { statusCode } = await request(`${OPENBAO_ADDR}/v1/sys/health`, {
                method: "GET",
            });
            if (statusCode === 200) return;
        } catch {
            // server not ready yet
        }
        await sleep(Math.min(500 * 2 ** i, 3000));
    }
    throw new Error(`OpenBao not reachable at ${OPENBAO_ADDR} after ${maxRetries} retries`);
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Enable a secrets engine, ignoring "already mounted" errors.
 */
export async function enableEngine(
    client: OpenBaoClient,
    path: string,
    type: string,
): Promise<void> {
    try {
        await client.sys.mounts.enable(path, { type });
    } catch (err: unknown) {
        if (!isAlreadyExistsError(err)) {
            throw err;
        }
    }
}

/**
 * Enable an auth method, ignoring "already enabled" errors.
 */
export async function enableAuth(
    client: OpenBaoClient,
    path: string,
    type: string,
): Promise<void> {
    try {
        await client.sys.auth.enable(path, { type });
    } catch (err: unknown) {
        if (!isAlreadyExistsError(err)) {
            throw err;
        }
    }
}

function isAlreadyExistsError(err: unknown): boolean {
    const msg = String(err);
    const body = (err as { responseBody?: string }).responseBody ?? "";
    const combined = `${msg} ${body}`;
    return (
        combined.includes("existing mount") ||
        combined.includes("path is already in use")
    );
}
