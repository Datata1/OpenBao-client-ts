import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { OpenBaoClient } from "../src/index";
import { createClient, enableEngine, waitForOpenBao } from "./setup";

describe("KV2 engine", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        await waitForOpenBao();
        client = createClient();
    });

    it("writes and reads a secret", async () => {
        await client.kv2.write("test/hello", { user: "alice", pass: "s3cret" });

        const res = await client.kv2.read<{ user: string; pass: string }>("test/hello");
        expect(res.data.data.user).toBe("alice");
        expect(res.data.data.pass).toBe("s3cret");
    });

    it("reads a specific version", async () => {
        await client.kv2.write("test/versioned", { v: 1 });
        await client.kv2.write("test/versioned", { v: 2 });

        const v1 = await client.kv2.read<{ v: number }>("test/versioned", 1);
        expect(v1.data.data.v).toBe(1);

        const v2 = await client.kv2.read<{ v: number }>("test/versioned", 2);
        expect(v2.data.data.v).toBe(2);
    });

    it("patches a secret", async () => {
        await client.kv2.write("test/patch-me", { a: 1, b: 2 });
        await client.kv2.patchSecret<{ a: number; b: number; c: number }>("test/patch-me", {
            c: 3,
        });

        const res = await client.kv2.read<{ a: number; b: number; c: number }>("test/patch-me");
        expect(res.data.data.a).toBe(1);
        expect(res.data.data.c).toBe(3);
    });

    it("lists secrets", async () => {
        await client.kv2.write("test/list-a", { x: 1 });
        await client.kv2.write("test/list-b", { x: 2 });

        const list = await client.kv2.listSecrets("test");
        expect(list.data.keys).toContain("list-a");
        expect(list.data.keys).toContain("list-b");
    });

    it("deletes and destroys versions", async () => {
        await client.kv2.write("test/destroy-me", { x: 1 });
        const meta = await client.kv2.readMetadata("test/destroy-me");
        expect(meta.data.current_version).toBeGreaterThanOrEqual(1);

        await client.kv2.deleteLatest("test/destroy-me");

        await client.kv2.undelete("test/destroy-me", [meta.data.current_version]);

        await client.kv2.destroy("test/destroy-me", [meta.data.current_version]);
    });

    it("reads and deletes metadata", async () => {
        await client.kv2.write("test/meta-test", { val: true });
        const meta = await client.kv2.readMetadata("test/meta-test");
        expect(meta.data.versions).toBeDefined();

        await client.kv2.deleteMetadata("test/meta-test");
    });
});

describe("KV1 engine", () => {
    let client: OpenBaoClient;
    const mountPath = "kv1-test";

    beforeAll(async () => {
        client = createClient({ kv1MountPoint: mountPath });
        await enableEngine(client, mountPath, "kv");
    });

    afterAll(async () => {
        try {
            await client.sys.mounts.disable(mountPath);
        } catch {
            // ignore cleanup errors
        }
    });

    it("writes and reads a secret", async () => {
        await client.kv1.write("my-secret", { key: "value" });

        const res = await client.kv1.read<{ key: string }>("my-secret");
        expect(res.data.key).toBe("value");
    });

    it("lists secrets", async () => {
        await client.kv1.write("list/a", { x: 1 });
        await client.kv1.write("list/b", { x: 2 });

        const list = await client.kv1.listSecrets("list");
        expect(list.data.keys).toContain("a");
        expect(list.data.keys).toContain("b");
    });

    it("deletes a secret", async () => {
        await client.kv1.write("to-delete", { x: 1 });
        await client.kv1.deleteSecret("to-delete");

        await expect(client.kv1.read("to-delete")).rejects.toThrow();
    });
});

describe("Cubbyhole engine", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        client = createClient();
    });

    it("writes and reads a cubbyhole secret", async () => {
        await client.cubbyhole.write("my-cubby", { secret: "hidden" });

        const res = await client.cubbyhole.read<{ secret: string }>("my-cubby");
        expect(res.data.secret).toBe("hidden");
    });

    it("deletes a cubbyhole secret", async () => {
        await client.cubbyhole.write("to-delete", { x: 1 });
        await client.cubbyhole.deleteSecret("to-delete");

        await expect(client.cubbyhole.read("to-delete")).rejects.toThrow();
    });
});
