import { OpenBaoClient } from "../src/index";

async function main() {
  const client = new OpenBaoClient({
    endpoint: "localhost:8200",
    kvMountPoint: "engine",
  });

  await client.auth.userpass.login("user", { password: "xxx" });

  const kvMount = "engine";
  try {
    await client.sys.mounts.enable(kvMount, { type: "kv", options: { version: "2" } });
    console.log(`KV2 engine enabled at ${kvMount}/`);
  } catch {
    console.log(`Engine already enabled at ${kvMount}/ (or skipped)`);
  }

  const secretPath = "app/demo";
  const secretData = { password: "supersecret123" };
  await client.kv2.write(secretPath, secretData);
  console.log(`Secret written to ${kvMount}/data/${secretPath}`);

  const result = await client.kv2.read<{ password: string }>(secretPath);
  console.log("Retrieved secret:", result?.data?.data.password);
}

main().catch((err) => {
  console.error("Error:", err);
});
