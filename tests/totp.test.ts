import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { OpenBaoClient } from "../src/index";
import { createClient, enableEngine, waitForOpenBao } from "./setup";

describe("TOTP engine", () => {
    let client: OpenBaoClient;
    const mountPath = "totp-test";

    beforeAll(async () => {
        await waitForOpenBao();
        client = createClient({ totpMountPoint: mountPath });
        await enableEngine(client, mountPath, "totp");
    });

    afterAll(async () => {
        try {
            await client.sys.mounts.disable(mountPath);
        } catch {
            // ignore
        }
    });

    it("creates a TOTP key (generate mode)", async () => {
        const res = await client.totp.createKey("test-totp", {
            generate: true,
            issuer: "OpenBaoTest",
            account_name: "alice@example.com",
        });
        expect(res.data.barcode).toBeDefined();
        expect(res.data.url).toBeDefined();
    });

    it("reads a TOTP key", async () => {
        const res = await client.totp.readKey("test-totp");
        expect(res.data.issuer).toBe("OpenBaoTest");
        expect(res.data.account_name).toBe("alice@example.com");
    });

    it("lists TOTP keys", async () => {
        const res = await client.totp.listKeys();
        expect(res.data.keys).toContain("test-totp");
    });

    it("generates and validates a code", async () => {
        const code = await client.totp.generateCode("test-totp");
        expect(code.data.code).toBeDefined();
        expect(code.data.code).toMatch(/^\d{6}$/);

        const valid = await client.totp.validateCode("test-totp", {
            code: code.data.code,
        });
        expect(valid.data.valid).toBe(true);
    });

    it("deletes a TOTP key", async () => {
        await client.totp.deleteKey("test-totp");
        await expect(client.totp.readKey("test-totp")).rejects.toThrow();
    });
});
