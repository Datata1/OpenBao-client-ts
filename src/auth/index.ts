import type { OpenBaoCoreClient } from "../core/client";
import { AppRoleAuth } from "./approle";
import { TokenAuth } from "./token";
import { UserpassAuth } from "./userpass";

/**
 * Facade that groups all auth methods.
 *
 * @example
 * ```ts
 * await client.auth.token.lookupSelf();
 * await client.auth.approle.login({ role_id: "...", secret_id: "..." });
 * ```
 */
export class Auth {
    public readonly token: TokenAuth;
    public readonly approle: AppRoleAuth;
    public readonly userpass: UserpassAuth;

    constructor(client: OpenBaoCoreClient) {
        this.token = new TokenAuth(client);
        this.approle = new AppRoleAuth(client);
        this.userpass = new UserpassAuth(client);
    }
}
