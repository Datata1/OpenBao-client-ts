import { beforeAll, describe, expect, it } from "vitest";
import type { OpenBaoClient } from "../src/index";
import { createClient, waitForOpenBao } from "./setup";

describe("sys – health, seal, leader, init", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        await waitForOpenBao();
        client = createClient();
    });

    it("returns health status", async () => {
        const res = await client.sys.health.check();
        // health endpoint returns data at the top level, not inside `data`
        const body = res as unknown as Record<string, unknown>;
        expect(body.initialized).toBe(true);
        expect(body.sealed).toBe(false);
    });

    it("returns seal status (unsealed in dev mode)", async () => {
        const res = await client.sys.seal.status();
        // seal-status returns data at the top level
        const body = res as unknown as Record<string, unknown>;
        expect(body.sealed).toBe(false);
    });

    it("returns init status (initialized in dev mode)", async () => {
        const res = await client.sys.init.status();
        // init returns data at the top level
        const body = res as unknown as Record<string, unknown>;
        expect(body.initialized).toBe(true);
    });

    it("returns leader info", async () => {
        const res = await client.sys.leader.leader();
        // leader returns data at the top level; in dev mode HA is disabled
        const body = res as unknown as Record<string, unknown>;
        expect(body.ha_enabled).toBeDefined();
    });
});

describe("sys – mounts", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        client = createClient();
    });

    it("lists secret mounts", async () => {
        const res = await client.sys.mounts.listMounts();
        expect(res.data).toBeDefined();
        // dev mode always has secret/ and cubbyhole/
        expect(res.data).toHaveProperty("secret/");
        expect(res.data).toHaveProperty("cubbyhole/");
    });

    it("enables and disables a mount", async () => {
        const path = "test-kv-mount";
        // Clean up from previous runs
        try { await client.sys.mounts.disable(path); } catch { /* ignore */ }

        await client.sys.mounts.enable(path, { type: "kv", options: { version: "1" } });

        const mounts = await client.sys.mounts.listMounts();
        expect(mounts.data).toHaveProperty(`${path}/`);

        await client.sys.mounts.disable(path);
        const afterDisable = await client.sys.mounts.listMounts();
        expect(afterDisable.data).not.toHaveProperty(`${path}/`);
    });

    it("reads and tunes a mount", async () => {
        const path = "test-tune-mount";
        // Clean up from previous runs
        try { await client.sys.mounts.disable(path); } catch { /* ignore */ }

        await client.sys.mounts.enable(path, { type: "kv", options: { version: "1" } });

        const info = await client.sys.mounts.read(path);
        expect(info.data.type).toBe("kv");

        await client.sys.mounts.tune(path, { description: "tuned mount" });
        const tuned = await client.sys.mounts.readTune(path);
        expect(tuned.data.description).toBe("tuned mount");

        await client.sys.mounts.disable(path);
    });
});

describe("sys – policies", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        client = createClient();
    });

    it("lists policies (includes default + root)", async () => {
        const res = await client.sys.policies.listPolicies();
        expect(res.data.keys).toContain("default");
        expect(res.data.keys).toContain("root");
    });

    it("creates, reads, and deletes a policy", async () => {
        const name = "test-policy-crud";
        const policy = `path "secret/*" { capabilities = ["read"] }`;

        await client.sys.policies.create(name, { policy });

        const read = await client.sys.policies.read(name);
        expect(read.data.policy).toContain("secret/*");

        await client.sys.policies.deletePolicy(name);

        const list = await client.sys.policies.listPolicies();
        expect(list.data.keys).not.toContain(name);
    });
});

describe("sys – tools", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        client = createClient();
    });

    it("generates a hash", async () => {
        const res = await client.sys.tools.hash({ input: btoa("hello") });
        expect(res.data.sum).toBeDefined();
        expect(typeof res.data.sum).toBe("string");
    });

    it("generates random bytes", async () => {
        const res = await client.sys.tools.random({ bytes: 32 });
        expect(res.data.random_bytes).toBeDefined();
    });
});
