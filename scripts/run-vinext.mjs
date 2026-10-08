import { spawn } from "node:child_process";
import { resolve } from "node:path";

const command = process.argv[2];
const allowed = new Set(["dev", "build", "start"]);
if (!allowed.has(command)) {
  console.error("Usage: node scripts/run-vinext.mjs <dev|build|start>");
  process.exit(2);
}

process.env.WRANGLER_LOG_PATH ??= ".wrangler/wrangler.log";

const bin = process.platform === "win32" ? "vinext.cmd" : "vinext";
const child = spawn(resolve("node_modules", ".bin", bin), [command], {
  stdio: "inherit",
  env: process.env,
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`vinext terminated by signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
