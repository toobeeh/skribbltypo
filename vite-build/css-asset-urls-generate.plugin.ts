import path from "path";
import { type PluginOption } from "vite";
import fg from "fast-glob";
import fs from "fs";

/**
 * A plugin to generate a content script which provides css urls for resources specified in the manifest
 * @param manifest
 */
export const generateCssAssetUrlsArtifacts = (manifest: chrome.runtime.ManifestV3): PluginOption => {
  return {
    name: "build-css-injector",
    enforce: "pre",
    buildStart() {
      const webAccessibleResources = manifest.web_accessible_resources ?? [];
      const resolvedFiles: string[] = [];

      /* find matching files */
      for (const resource of webAccessibleResources) {
        if (typeof resource === "string") {

          // If it's a glob pattern, resolve it
          const globPattern = path.resolve(__dirname, "../assets", resource).replace(/\\/g, "/");
          const files = fg.sync(globPattern);
          resolvedFiles.push(...files.map(file => path.relative(path.resolve(__dirname, "public"), file)));
        } else if (Array.isArray(resource.resources)) {

          // Handle patterns within objects (e.g., resource arrays)
          for (const pattern of resource.resources) {
            const globPattern = path.resolve(__dirname, "../assets", pattern).replace(/\\/g, "/");
            const files = fg.sync(globPattern);
            resolvedFiles.push(...files.map(file => path.relative(path.resolve(__dirname, "../assets"), file)));
          }
        }
      }

      /* build ts output */
      const tsContent = `
        const files = ${JSON.stringify(resolvedFiles.map(file => file.replace(/\\/g, "/")), null, 2)};

        // Function to inject CSS variables into the page
        function injectCSSVariables() {
          const style = document.createElement("style");
          let cssVariables = "";
          files.forEach(file => {
            const chromeUrl = chrome.runtime.getURL(file);
            const variableName = "--file-" + file.replace(/[\\./]/gi, "-").toLowerCase();
            cssVariables += \`\${variableName}: url("\${chromeUrl}");\`;
          });
          style.innerHTML = \`:root { \${cssVariables} }\`;
          document.head.appendChild(style);
        }

        // Inject CSS variables when the content script is loaded
        injectCSSVariables();
      `;

      /* save output*/
      fs.mkdirSync(path.resolve(__dirname, "cssgen"), { recursive: true });
      const tsOutputPath = path.resolve(__dirname, "cssgen/css-urls.ts");
      console.log(tsOutputPath);
      fs.writeFileSync(tsOutputPath, tsContent, "utf-8");

      /* add css url gen to manifest */
      manifest.content_scripts[0].js.push("vite-build/cssgen/css-urls.ts");
    }
  };
};