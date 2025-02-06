import { defineManifest } from "@crxjs/vite-plugin";

/// @ts-expect-error errors in the IDE, but it's fine
import packageData from "../package.json";

const isDev = process.env.NODE_ENV == "development";

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? " ➡️ Dev" : ""}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: "icons/16Fit.png",
    32: "icons/32CircleFit.png",
    128: "icons/128MaxFit.png",
  },
  action: {
    default_popup: "popup.html",
    default_icon: "icons/128MaxFit.png",
  },
  background: {
    service_worker: "src/background/background.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://skribbl.io/*"],
      js: [
        "src/loader/loader.ts",
        "src/content/content.ts",
        /*"src/content/pre-execution-block.ts"*/
      ],
      run_at: "document_start",
    },
    /*{
      matches: ["https://skribbl.io/never"],
      js: [
        "src/content/content.ts"
      ]
    }*/
  ],
  web_accessible_resources: [
    {
      resources: ["icons/16Fit.png", "icons/32CircleFit.png", "icons/128MaxFit.png", "img/**"],
      matches: ["https://skribbl.io/*"],
    },
    {
      matches: ["https://skribbl.io/*"],
      resources: ["**/*.js.map", "gamePatch.js"]
    },
  ],
  permissions: ["storage", "activeTab"],
});
