import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { OpenBaoClient } from "../src/index";
import { createClient, enableEngine, waitForOpenBao } from "./setup";

describe("PKI engine", () => {
    let client: OpenBaoClient;
    const mountPath = "pki-test";

    beforeAll(async () => {
        await waitForOpenBao();
        client = createClient({ pkiMountPoint: mountPath });
        await enableEngine(client, mountPath, "pki");
    });

    afterAll(async () => {
        try {
            await client.sys.mounts.disable(mountPath);
        } catch {
            // ignore
        }
    });

    it("generates an internal root CA", async () => {
        const res = await client.pki.generateRoot({
            type: "internal",
            common_name: "Test Root CA",
            ttl: "87600h",
        });
        expect(res.data.certificate).toBeDefined();
        expect(res.data.issuing_ca).toBeDefined();
    });

    it("sets and reads URLs", async () => {
        await client.pki.setURLs({
            issuing_certificates: ["http://localhost:8200/v1/pki-test/ca"],
            crl_distribution_points: ["http://localhost:8200/v1/pki-test/crl"],
        });

        const urls = await client.pki.readURLs();
        expect(urls.data.issuing_certificates).toContain(
            "http://localhost:8200/v1/pki-test/ca",
        );
    });

    it("creates and reads a role", async () => {
        await client.pki.createRole("test-role", {
            allowed_domains: ["example.com"],
            allow_subdomains: true,
            max_ttl: "72h",
        });

        const role = await client.pki.readRole("test-role");
        expect(role.data.allowed_domains).toContain("example.com");
        expect(role.data.allow_subdomains).toBe(true);
    });

    it("lists roles", async () => {
        const roles = await client.pki.listRoles();
        expect(roles.data.keys).toContain("test-role");
    });

    it("issues a certificate", async () => {
        const res = await client.pki.issue("test-role", {
            common_name: "test.example.com",
            ttl: "24h",
        });
        expect(res.data.certificate).toBeDefined();
        expect(res.data.private_key).toBeDefined();
        expect(res.data.serial_number).toBeDefined();
    });

    it("revokes a certificate", async () => {
        const issued = await client.pki.issue("test-role", {
            common_name: "revoke.example.com",
            ttl: "24h",
        });

        const revoked = await client.pki.revoke({
            serial_number: issued.data.serial_number,
        });
        expect(revoked.data.revocation_time).toBeDefined();
    });

    it("rotates the CRL", async () => {
        const res = await client.pki.rotateCRL();
        expect(res.data.success).toBe(true);
    });

    it("reads and sets CRL config", async () => {
        await client.pki.setCRLConfig({ expiry: "72h" });
        const config = await client.pki.readCRLConfig();
        expect(config.data.expiry).toBeDefined();
    });

    it("deletes a role", async () => {
        await client.pki.deleteRole("test-role");
        await expect(client.pki.readRole("test-role")).rejects.toThrow();
    });

    it("deletes the root CA", async () => {
        await client.pki.deleteRoot();
    });
});

describe("SSH engine", () => {
    let client: OpenBaoClient;
    const mountPath = "ssh-test";

    beforeAll(async () => {
        client = createClient({ sshMountPoint: mountPath });
        await enableEngine(client, mountPath, "ssh");
    });

    afterAll(async () => {
        try {
            await client.sys.mounts.disable(mountPath);
        } catch {
            // ignore
        }
    });

    it("configures a CA", async () => {
        // Generate CA with no arguments (auto-generate)
        await client.ssh.configureCA();
    });

    it("creates and reads a role", async () => {
        await client.ssh.createRole("test-ssh-role", {
            key_type: "ca",
            default_user: "ubuntu",
            allowed_users: "*",
            allow_user_certificates: true,
            ttl: "30m",
        });

        const role = await client.ssh.readRole("test-ssh-role");
        expect(role.data.key_type).toBe("ca");
        expect(role.data.default_user).toBe("ubuntu");
    });

    it("lists roles", async () => {
        const roles = await client.ssh.listRoles();
        expect(roles.data.keys).toContain("test-ssh-role");
    });

    it("reads the public key", async () => {
        const res = await client.ssh.readPublicKey();
        expect(res.data.public_key).toBeDefined();
    });

    it("deletes a role and CA", async () => {
        await client.ssh.deleteRole("test-ssh-role");
        await expect(client.ssh.readRole("test-ssh-role")).rejects.toThrow();

        await client.ssh.deleteCA();
    });
});
