# OpenBao TypeScript Client

A modern, fully-typed, zero-dependency SDK for OpenBao (Vault) — covering the entire HTTP API lifecycle. Built for Node.js (18+) and TypeScript projects.

## Features

- **1:1 HTTP API coverage** — all system, auth, and secret engines
- **Strong typing** — every endpoint, request, and response is fully typed
- **Modular engine classes** — easy to extend, tree-shake, and test
- **Native HTTP** — uses [undici](https://github.com/nodejs/undici) for fast, standards-compliant requests
- **No dependencies** — except undici (for Node 18+)
- **Open/closed design** — add new engines with minimal boilerplate

## Installation

```sh
yarn add openbao-client
# or
npm install openbao-client
```

## Usage

```ts
import { OpenBaoClient } from "openbao-client";

const client = new OpenBaoClient({
  endpoint: "https://vault.example.com",
  token: "s.xxxxxxxx",
});

// System lifecycle
await client.sys.health.check();
await client.sys.seal.unseal({ key: "..." });
await client.sys.mounts.enable("transit", { type: "transit" });
await client.sys.policies.create("my-policy", { policy: '...' });

// Auth
await client.auth.token.lookupSelf();
await client.auth.approle.login({ role_id: "...", secret_id: "..." });

// Secrets
const secret = await client.kv2.read<{ password: string }>("app/config");
const encrypted = await client.transit.encrypt("my-key", { plaintext: btoa("secret") });
const cert = await client.pki.issue("web-role", { common_name: "app.example.com" });
const creds = await client.database.getCredentials("my-role");
const signed = await client.ssh.signKey("ca-role", { public_key: "ssh-ed25519 ..." });
```

## Project Structure

```
src/
├── core/           # HTTP client, base engine
├── types/          # All request/response types
├── sys/            # System backend (health, seal, mounts, policies, ...)
├── auth/           # Auth methods (token, approle, userpass)
├── engines/        # Secret engines (kv2, kv1, transit, pki, database, ssh, totp, cubbyhole)
└── index.ts        # Main facade + barrel exports
```

## Adding New Engines

1. Create `src/types/engines/foo.ts` with request/response types
2. Create `src/engines/foo.ts` extending `BaseEngine`
3. Add a property to the facade in `src/index.ts`

## Contributing

Pull requests, issues, and suggestions are welcome! Please open an issue for bugs or feature requests.

## License

MIT

---

**OpenBao** is a fork of HashiCorp Vault. This client is not affiliated with HashiCorp or the OpenBao project.
