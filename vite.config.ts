import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { sveltePreprocess } from "svelte-preprocess";
import checker from "vite-plugin-checker";
import { generateCssAssetUrls } from "./vite-build/css-asset-urls.plugin";
import { buildChromeExtension } from "./vite-build/typo-build-extension.plugin";
import { TypoBuildPlugin } from "./vite-build/typo-build-plugin.interface";
import { buildUserscript } from "./vite-build/typo-build-userscript.plugin";

/**
 * Build depending on environment
 * mode: production or development
 * commit: the commit hash of the build (from env)
 * target: chrome, firefox or userscript (from env)
 *
 * if production -> stable build
 * if commit and development -> beta build
 * if no commit and development -> alpha build
 */
export default defineConfig(({ mode }) => {
  const production = mode === "production";
  const env = loadEnv(mode, process.cwd(), "");
  const commit = env.COMMIT; /* try to get commit from env */
  const target = env.TARGET ?? "chrome"; /* try to get target from env */
  const version = production ? "stable" : commit ? "beta" : "alpha";

  /* determine the runtime based on the build target */
  let runtime: string;
  switch (target) {
    case "chrome":
    case "firefox":
      runtime = "extension";
      break;

    case "userscript":
      runtime = "page";
      break;

    default:
      throw new Error(`Unknown target: ${target}`);
  }

  /* determine the build plugin based on the build target */
  let buildTypoPlugin: TypoBuildPlugin;
  switch (target) {
    case "chrome":
    case "firefox":
      buildTypoPlugin = buildChromeExtension(target);
      break;

    case "userscript":
      buildTypoPlugin = buildUserscript;
      break;

    default:
      throw new Error(`Unknown target: ${target}`);
  }

  console.log(`Building ${target} for ${version} (${commit})...`);

  return {
    esbuild: {
      minifyIdentifiers: production,
      keepNames: !production,
    },
    test: {
    },
    publicDir: "assets",
    build: {
      minify: production,
      sourcemap: true,
      emptyOutDir: true,
      outDir: "dist",
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]"
        },
      },
    },
    plugins: [
      generateCssAssetUrls(runtime, "img/*"),
      buildTypoPlugin(version, commit),
      svelte({
        compilerOptions: {
          dev: !production,
        },
        preprocess: sveltePreprocess(),
      }),
      checker({
        eslint: {
          lintCommand: "eslint .",
        },
        typescript: true
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "runtime": path.resolve(__dirname, `src/runtime/${runtime}/${runtime}-runtime.ts`),
      },
    },
  };
});
