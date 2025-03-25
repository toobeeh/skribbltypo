import path from "path";
import fg from "fast-glob";
import fs from "fs";

/**
 * A plugin to generate a content script which embeds files as base64 as css variables
 * @param manifest
 */
export const generateCssAssetBase64Embeds = (manifest: chrome.runtime.ManifestV3): string => {

      const webAccessibleResources = manifest.web_accessible_resources ?? [];

      const fileContents = new Map<string, string>();

      /* find matching files */
      for (const resource of webAccessibleResources) {
        if (typeof resource === "string") {

          // If it's a glob pattern, resolve it
          const globPattern = path.resolve(__dirname, "../public", resource).replace(/\\/g, "/");
          const files = fg.sync(globPattern);
          files.forEach(file => fileContents.set(file, fs.readFileSync(file, "base64").toString()));
        } else if (Array.isArray(resource.resources)) {

          // Handle patterns within objects (e.g., resource arrays)
          for (const pattern of resource.resources) {
            const globPattern = path.resolve(__dirname, "../public", pattern).replace(/\\/g, "/");
            const files = fg.sync(globPattern);
            files.forEach(file => fileContents.set(file, fs.readFileSync(file, "base64").toString()));
          }
        }
      }

      let variables = "";
      fileContents.forEach((content, file) => {
        variables += `--file-${file.replace(/[\\./]/gi, "-").toLowerCase()}: url("data:text/plain;base64,${content}");\n`;
      });

      /* generate js output */
      return `

        // Function to inject CSS variables into the page
        function injectCSSVariables() {
          const style = document.createElement("style");
          style.innerHTML = \`:root { ${ variables }\`;
          document.head.appendChild(style);
        }

        // Inject CSS variables when the content script is loaded
        injectCSSVariables();
      `;
};