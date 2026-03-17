import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { OpenBaoClient } from "../src/index";
import { createClient, enableAuth, waitForOpenBao } from "./setup";

describe("Token auth", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        await waitForOpenBao();
        client = createClient();
    });

    it("looks up the current (root) token", async () => {
        const res = await client.auth.token.lookupSelf();
        expect(res.data.id).toBeDefined();
        expect(res.data.policies).toContain("root");
    });

    it("creates a new token and looks it up", async () => {
        const created = await client.auth.token.create({
            policies: ["default"],
            ttl: "1h",
        });
        const newToken = created.auth?.client_token;
        expect(newToken).toBeDefined();

        const lookup = await client.auth.token.lookup(newToken!);
        expect(lookup.data.policies).toContain("default");

        // Clean up
        await client.auth.token.revoke({ token: newToken! });
    });

    it("creates an orphan token", async () => {
        const created = await client.auth.token.createOrphan({
            policies: ["default"],
            ttl: "1h",
        });
        const token = created.auth?.client_token;
        expect(token).toBeDefined();

        const lookup = await client.auth.token.lookup(token!);
        expect(lookup.data.orphan).toBe(true);

        await client.auth.token.revoke({ token: token! });
    });

    it("renews self", async () => {
        // Create a renewable token
        const created = await client.auth.token.create({
            policies: ["default"],
            ttl: "1h",
            renewable: true,
        });
        const token = created.auth?.client_token;
        expect(token).toBeDefined();

        // Use the new token to renew itself
        const tempClient = createClient();
        tempClient.setToken(token!);
        const renewed = await tempClient.auth.token.renewSelf("2h");
        expect(renewed.auth).toBeDefined();

        // Clean up using root client
        await client.auth.token.revoke({ token: token! });
    });

    it("manages token roles", async () => {
        const roleName = "test-role";
        await client.auth.token.createRole(roleName, {
            allowed_policies: ["default"],
            orphan: true,
            renewable: true,
        });

        const role = await client.auth.token.readRole(roleName);
        expect(role.data.orphan).toBe(true);

        const roles = await client.auth.token.listRoles();
        expect(roles.data.keys).toContain(roleName);

        // Create a token with the role
        const created = await client.auth.token.createWithRole(roleName, { ttl: "1h" });
        expect(created.auth?.client_token).toBeDefined();

        await client.auth.token.revoke({ token: created.auth!.client_token! });
        await client.auth.token.deleteRole(roleName);
    });

    it("lists and revokes accessors", async () => {
        const created = await client.auth.token.create({
            policies: ["default"],
            ttl: "1h",
        });
        const accessor = created.auth?.accessor;
        expect(accessor).toBeDefined();

        const accessors = await client.auth.token.listAccessors();
        expect(accessors.data.keys).toContain(accessor);

        // Look up by accessor
        const lookup = await client.auth.token.lookupAccessor(accessor!);
        expect(lookup.data.accessor).toBe(accessor);

        // Revoke by accessor
        await client.auth.token.revokeAccessor(accessor!);
    });
});

describe("Userpass auth", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        client = createClient();
        await enableAuth(client, "userpass", "userpass");
    });

    it("creates a user and lists users", async () => {
        await client.auth.userpass.createUser("alice", {
            password: "p@ssword1",
            token_policies: ["default"],
        });

        const users = await client.auth.userpass.listUsers();
        expect(users.data.keys).toContain("alice");
    });

    it("reads a user", async () => {
        const user = await client.auth.userpass.readUser("alice");
        expect(user.data).toBeDefined();
    });

    it("logs in with userpass", async () => {
        const res = await client.auth.userpass.login("alice", {
            password: "p@ssword1",
        });
        expect(res.auth?.client_token).toBeDefined();

        // Restore root token
        client.setToken("test-root-token");
    });

    it("updates password", async () => {
        await client.auth.userpass.updatePassword("alice", "newp@ss");

        // Login with new password should succeed
        const res = await client.auth.userpass.login("alice", {
            password: "newp@ss",
        });
        expect(res.auth?.client_token).toBeDefined();

        // Restore root token
        client.setToken("test-root-token");
    });

    it("deletes a user", async () => {
        await client.auth.userpass.deleteUser("alice");
        await expect(client.auth.userpass.readUser("alice")).rejects.toThrow();
    });
});

describe("AppRole auth", () => {
    let client: OpenBaoClient;

    beforeAll(async () => {
        client = createClient();
        await enableAuth(client, "approle", "approle");
    });

    it("creates a role and reads it", async () => {
        await client.auth.approle.createRole("test-role", {
            token_policies: ["default"],
            token_ttl: "1h",
        });

        const role = await client.auth.approle.readRole("test-role");
        expect(role.data.token_ttl).toBeDefined();
    });

    it("lists roles", async () => {
        const list = await client.auth.approle.listRoles();
        expect(list.data.keys).toContain("test-role");
    });

    it("gets role ID and generates secret ID", async () => {
        const roleIdRes = await client.auth.approle.readRoleId("test-role");
        expect(roleIdRes.data.role_id).toBeDefined();

        const secretIdRes = await client.auth.approle.generateSecretId("test-role");
        expect(secretIdRes.data.secret_id).toBeDefined();
        expect(secretIdRes.data.secret_id_accessor).toBeDefined();
    });

    it("logs in with AppRole", async () => {
        const roleIdRes = await client.auth.approle.readRoleId("test-role");
        const secretIdRes = await client.auth.approle.generateSecretId("test-role");

        const loginRes = await client.auth.approle.login({
            role_id: roleIdRes.data.role_id,
            secret_id: secretIdRes.data.secret_id,
        });
        expect(loginRes.auth?.client_token).toBeDefined();

        // Restore root token
        client.setToken("test-root-token");
    });

    it("manages secret ID accessors", async () => {
        const secretIdRes = await client.auth.approle.generateSecretId("test-role");

        const accessors = await client.auth.approle.listSecretIdAccessors("test-role");
        expect(accessors.data.keys.length).toBeGreaterThan(0);

        // Lookup secret ID
        const lookup = await client.auth.approle.lookupSecretId(
            "test-role",
            secretIdRes.data.secret_id,
        );
        expect(lookup.data.secret_id_accessor).toBeDefined();

        // Destroy secret ID
        await client.auth.approle.destroySecretId("test-role", secretIdRes.data.secret_id);
    });

    it("deletes a role", async () => {
        await client.auth.approle.deleteRole("test-role");
        await expect(client.auth.approle.readRole("test-role")).rejects.toThrow();
    });
});
