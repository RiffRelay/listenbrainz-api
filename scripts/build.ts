// Build script: emits unbundled ESM JS + .d.ts declarations using Bun's
// TypeScript integration so the package is a clean, standard npm library.

import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

// 1) Transpile every source file to ESM JS, keeping the module graph intact
//    (unbundled, so consumers' bundlers can tree-shake).
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

// 2) Emit .d.ts + .d.ts.map for type safety.
const tsc = spawnSync(
  "tsc",
  ["--emitDeclarationOnly", "--outDir", "dist", "--project", "tsconfig.json"],
  { stdio: "inherit" },
);
if (tsc.status !== 0) process.exit(tsc.status ?? 1);

console.log("listenbrainz-api built successfully.");
