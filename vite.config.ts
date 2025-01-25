import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { sveltePreprocess } from "svelte-preprocess";
import checker from "vite-plugin-checker";
import { buildChromeExtension } from "./buildChromeExtension.plugin";
import manifest from "./src/manifest";

/**
 * Build depending on environment
 * mode: production or development
 * commit: the commit hash of the build
 *
 * if production -> stable build
 * if commit and development -> beta build
 * if no commit and development -> alpha build
 */
export default defineConfig(({ mode }) => {
  const production = mode === "production";
  const env = loadEnv(mode, process.cwd(), "");
  const commit = env.COMMIT; /* try to get commit from env */
  const version = production ? "stable" : commit ? "beta" : "alpha";

  return {
    esbuild: {
      minifyIdentifiers: production,
      keepNames: !production,
    },
    publicDir: "public",
    build: {
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
      buildChromeExtension(manifest, version, commit),
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
      },
    },
  };
});
