import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import sveltePreprocess from "svelte-preprocess";
import manifest from "./src/manifest";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => {
  const production = mode === "production";

  return {
    esbuild: {
      minifyIdentifiers: false,
      keepNames: true,
    },
    publicDir: "public",
    build: {
      watch: {
        include: ["public/styles/**"]
      },
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
      crx({ manifest }),
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
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
