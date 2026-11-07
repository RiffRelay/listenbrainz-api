import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

const tsc = spawnSync(
  "tsc",
  [
    "--project",
    "tsconfig.json",
    "--noEmit",
    "false",
    "--sourceMap",
    "false",
    "--declarationMap",
    "false",
  ],
  { stdio: "inherit" },
);
if (tsc.status !== 0) process.exit(tsc.status ?? 1);

console.log("listenbrainz-api modules and declarations built successfully.");
