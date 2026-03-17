import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { OpenBaoClient } from "../src/index";
import { createClient, enableEngine, waitForOpenBao } from "./setup";

describe("Transit engine", () => {
    let client: OpenBaoClient;
    const mountPath = "transit-test";

    beforeAll(async () => {
        await waitForOpenBao();
        client = createClient({ transitMountPoint: mountPath });
        await enableEngine(client, mountPath, "transit");
    });

    afterAll(async () => {
        try {
            await client.sys.mounts.disable(mountPath);
        } catch {
            // ignore
        }
    });

    it("creates and reads an encryption key", async () => {
        await client.transit.createKey("test-key");

        const res = await client.transit.readKey("test-key");
        expect(res.data.name).toBe("test-key");
        expect(res.data.type).toBe("aes256-gcm96");
    });

    it("lists keys", async () => {
        await client.transit.createKey("list-key-1");
        const list = await client.transit.listKeys();
        expect(list.data.keys).toContain("list-key-1");
    });

    it("encrypts and decrypts data", async () => {
        await client.transit.createKey("enc-key");

        const plaintext = btoa("hello world");
        const encrypted = await client.transit.encrypt("enc-key", { plaintext });
        expect(encrypted.data.ciphertext).toMatch(/^vault:v1:/);

        const decrypted = await client.transit.decrypt("enc-key", {
            ciphertext: encrypted.data.ciphertext,
        });
        expect(decrypted.data.plaintext).toBe(plaintext);
    });

    it("rotates a key and rewraps ciphertext", async () => {
        await client.transit.createKey("rotate-key");
        const plaintext = btoa("rotate me");

        const enc1 = await client.transit.encrypt("rotate-key", { plaintext });
        expect(enc1.data.ciphertext).toMatch(/^vault:v1:/);

        await client.transit.rotateKey("rotate-key");

        const rewrapped = await client.transit.rewrap("rotate-key", {
            ciphertext: enc1.data.ciphertext,
        });
        expect(rewrapped.data.ciphertext).toMatch(/^vault:v2:/);

        const dec = await client.transit.decrypt("rotate-key", {
            ciphertext: rewrapped.data.ciphertext,
        });
        expect(dec.data.plaintext).toBe(plaintext);
    });

    it("generates a data key", async () => {
        await client.transit.createKey("datakey-key");

        const res = await client.transit.generateDataKey("datakey-key", "plaintext");
        expect(res.data.plaintext).toBeDefined();
        expect(res.data.ciphertext).toBeDefined();
    });

    it("signs and verifies data", async () => {
        await client.transit.createKey("sign-key", { type: "ed25519" });

        const input = btoa("sign this");
        const signed = await client.transit.sign("sign-key", { input });
        expect(signed.data.signature).toMatch(/^vault:v1:/);

        const verified = await client.transit.verify("sign-key", {
            input,
            signature: signed.data.signature,
        });
        expect(verified.data.valid).toBe(true);
    });

    it("computes a hash", async () => {
        const res = await client.transit.hash({ input: btoa("hash me") });
        expect(res.data.sum).toBeDefined();
    });

    it("computes an HMAC", async () => {
        await client.transit.createKey("hmac-key");

        const res = await client.transit.hmac("hmac-key", {
            input: btoa("hmac this"),
        });
        expect(res.data.hmac).toBeDefined();
    });

    it("generates random bytes", async () => {
        const res = await client.transit.random({ bytes: 32, format: "base64" });
        expect(res.data.random_bytes).toBeDefined();
    });

    it("updates key config", async () => {
        await client.transit.createKey("config-key");
        await client.transit.updateKeyConfig("config-key", {
            deletion_allowed: true,
        });

        await client.transit.deleteKey("config-key");
        await expect(client.transit.readKey("config-key")).rejects.toThrow();
    });
});
