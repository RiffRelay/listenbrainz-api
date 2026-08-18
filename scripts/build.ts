import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  sourcemap: "external",
  splitting: false,
  minify: false,
  packages: "bundle",
});
if (!result.success) {
  console.error("Bun build failed:");
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

const tsc = spawnSync(
  "tsc",
  ["--emitDeclarationOnly", "--outDir", "dist", "--project", "tsconfig.json"],
  { stdio: "inherit" },
);
if (tsc.status !== 0) process.exit(tsc.status ?? 1);

console.log("listenbrainz-api built successfully.");
