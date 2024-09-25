import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { sveltePreprocess } from "svelte-preprocess";
import checker from "vite-plugin-checker";
import { buildExtension } from "./css-resources.plugin";
import manifest from "./src/manifest";

export default defineConfig(({ mode }) => {
  const production = mode === "production";

  return {
    esbuild: {
      minifyIdentifiers: true,
      keepNames: true,
    },
    publicDir: "public",
    build: {
      sourcemap: true,
      emptyOutDir: true,
      outDir: "dist",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/chunk-[hash].js",
        },
      },
    },
    plugins: [
      buildExtension(manifest),
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
