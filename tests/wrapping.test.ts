import { beforeAll, describe, expect, it } from "vitest";
import type { OpenBaoClient } from "../src/index";
import { createClient, waitForOpenBao } from "./setup";

describe("sys – wrapping", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        await waitForOpenBao();
        client = createClient();
    });

    it("wraps and unwraps data", async () => {
        const data = { secret: "wrapped-value" };
        const wrapped = await client.sys.wrapping.wrap<{ secret: string }>(data, "5m");
        expect(wrapped.wrap_info).toBeDefined();
        expect(wrapped.wrap_info?.token).toBeDefined();

        const unwrapped = await client.sys.wrapping.unwrap<{ secret: string }>(
            wrapped.wrap_info!.token,
        );
        expect(unwrapped.data.secret).toBe("wrapped-value");
    });

    it("looks up a wrapping token", async () => {
        const wrapped = await client.sys.wrapping.wrap({ hello: "world" }, "5m");
        const token = wrapped.wrap_info!.token;

        const lookup = await client.sys.wrapping.lookup(token);
        expect(lookup.data.creation_time).toBeDefined();

        await client.sys.wrapping.unwrap(token);
    });

    it("rewraps a wrapping token", async () => {
        const wrapped = await client.sys.wrapping.wrap({ x: 1 }, "5m");
        const oldToken = wrapped.wrap_info!.token;

        const rewrapped = await client.sys.wrapping.rewrap(oldToken);
        expect(rewrapped.wrap_info?.token).toBeDefined();
        expect(rewrapped.wrap_info?.token).not.toBe(oldToken);

        await client.sys.wrapping.unwrap(rewrapped.wrap_info!.token);
    });
});

describe("sys – auth methods management", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        client = createClient();
    });

    it("lists auth methods (includes token/)", async () => {
        const res = await client.sys.auth.listMethods();
        expect(res.data).toHaveProperty("token/");
    });

    it("enables and disables an auth method", async () => {
        const path = "test-userpass-sys";
        try {
            await client.sys.auth.disable(path);
        } catch {
        }

        await client.sys.auth.enable(path, { type: "userpass" });

        const methods = await client.sys.auth.listMethods();
        expect(methods.data).toHaveProperty(`${path}/`);

        await client.sys.auth.disable(path);
        const afterDisable = await client.sys.auth.listMethods();
        expect(afterDisable.data).not.toHaveProperty(`${path}/`);
    });
});
