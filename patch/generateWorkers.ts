import esbuild from "esbuild";
import fs from "fs";
import fg from "fast-glob";
import path from "path";

const workerFilesGlob = path.resolve("./src/worker/**/*.worker.ts");
const srcOutDir = path.resolve("./src/worker");

const workerFiles = fg.sync(workerFilesGlob.replace(/\\/g, "/"));
const exports: string[] = [];
const base64Exports: string[] = [];

for (const file of workerFiles) {
  const filename = path.basename(file);
  const filePath = file;
  const outFile = path.join("./workergen", filename.replace(".ts", ".jsgen"));

  // Bundle and transpile to standalone JS
  esbuild.buildSync({
    entryPoints: [filePath],
    outfile: outFile,
    bundle: true,
    format: "iife",
    platform: "browser",
  });

  // Read and encode as Base64
  const jsCode = fs.readFileSync(outFile, "utf8");
  const base64Code = Buffer.from(jsCode).toString("base64");
  const exportName = filename
    .replace(".worker.ts", "WorkerBase64")
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

  base64Exports.push(`export const ${exportName} = "${base64Code}";`);

  // Create type definition for each worker
  exports.push(`export const ${exportName} = "";`);
}

// Write base64 contents to a separate file in src which should be gitignored
fs.writeFileSync(path.join(srcOutDir, "workers.ts"), base64Exports.join("\n"));

// Write type definitions to the src directory
fs.writeFileSync(path.join(srcOutDir, "workers.d.ts"), exports.join("\n"));

/* remove temp files */
fs.rmSync(path.resolve("./workergen"), { recursive: true, force: true });