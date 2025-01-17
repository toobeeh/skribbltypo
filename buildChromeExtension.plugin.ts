import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import path from "path";
import { PluginOption } from "vite";
import fg from "fast-glob";
import fs from "fs";
import ManifestV3 = chrome.runtime.ManifestV3;

/**
 * Build the extension for chrome browsers
 * based on the crx plugin
 * extended to include css variables for all chrome accessible resource urls
 * @param options
 */
export const buildChromeExtension = (
  options: ManifestV3Export,
  version: "stable" | "beta" | "alpha" = "stable",
  buildCommit: string | undefined = undefined
): PluginOption[] => {

  /* get manifest */
  const mv3 = options as unknown as ManifestV3;

  /* add css url gen to manifest */
  mv3.content_scripts[0].js.push("cssgen/css-urls.ts");

  /* add version name to manifest */
  mv3.version_name = `${mv3.version} ${version}-crx${buildCommit ? " " + buildCommit : ""}`;

  const crxOriginal = crx({ manifest: mv3 as unknown as ManifestV3Export });

  return [
    {
      name: "build-css-injector",
      enforce: "pre",
      buildStart() {
        const webAccessibleResources = mv3.web_accessible_resources;
        const resolvedFiles: string[] = [];

        /* find matching files */
        for (const resource of webAccessibleResources) {
          if (typeof resource === "string") {
            // If it's a glob pattern, resolve it
            const globPattern = path.resolve(__dirname, "public", resource).replace(/\\/g, "/");
            const files = fg.sync(globPattern);
            resolvedFiles.push(...files.map(file => path.relative(path.resolve(__dirname, "public"), file)));
          } else if (Array.isArray(resource.resources)) {
            // Handle patterns within objects (e.g., resource arrays)
            for (const pattern of resource.resources) {
              const globPattern = path.resolve(__dirname, "public", pattern).replace(/\\/g, "/");
              const files = fg.sync(globPattern);
              resolvedFiles.push(...files.map(file => path.relative(path.resolve(__dirname, "public"), file)));
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
        fs.writeFileSync(tsOutputPath, tsContent, "utf-8");
      }
    },

    /* apply crx plugin */
    ...crxOriginal,
    {
      name: "delete-css-injector",
      enforce: "post",
      buildEnd() {
        const tsOutputPath = path.resolve(__dirname, "cssgen/css-urls.ts");
        fs.unlinkSync(tsOutputPath);
        fs.rmdirSync(path.resolve(__dirname, "cssgen"));
      }
    }
  ];
};