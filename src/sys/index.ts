import type { OpenBaoCoreClient } from "../core/client";
import { SysAudit } from "./audit";
import { SysAuth } from "./auth";
import { SysHealth } from "./health";
import { SysInit } from "./init";
import { SysLeader } from "./leader";
import { SysLeases } from "./leases";
import { SysMounts } from "./mounts";
import { SysPolicies } from "./policies";
import { SysSeal } from "./seal";
import { SysTools } from "./tools";
import { SysWrapping } from "./wrapping";

/**
 * Facade that groups all `/v1/sys/` sub-resources.
 *
 * @example
 * ```ts
 * await client.sys.health.check();
 * await client.sys.seal.unseal({ key: "..." });
 * await client.sys.mounts.enable("transit", { type: "transit" });
 * ```
 */
export class Sys {
    public readonly health: SysHealth;
    public readonly init: SysInit;
    public readonly seal: SysSeal;
    public readonly leader: SysLeader;
    public readonly mounts: SysMounts;
    public readonly auth: SysAuth;
    public readonly policies: SysPolicies;
    public readonly audit: SysAudit;
    public readonly leases: SysLeases;
    public readonly wrapping: SysWrapping;
    public readonly tools: SysTools;

    constructor(client: OpenBaoCoreClient) {
        this.health = new SysHealth(client);
        this.init = new SysInit(client);
        this.seal = new SysSeal(client);
        this.leader = new SysLeader(client);
        this.mounts = new SysMounts(client);
        this.auth = new SysAuth(client);
        this.policies = new SysPolicies(client);
        this.audit = new SysAudit(client);
        this.leases = new SysLeases(client);
        this.wrapping = new SysWrapping(client);
        this.tools = new SysTools(client);
    }
}
