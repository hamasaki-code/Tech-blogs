import { spawnSync } from "node:child_process";

process.env.NEXT_TELEMETRY_DISABLED ??= "1";

const nextCommand = process.platform === "win32" ? "next.cmd" : "next";
const result = spawnSync(nextCommand, ["build"], {
  env: process.env,
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
