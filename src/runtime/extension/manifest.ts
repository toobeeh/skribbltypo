import { defineManifest } from "@crxjs/vite-plugin";

/// @ts-expect-error errors in the IDE, but it's fine
import packageData from "../../../package.json";

export default defineManifest({
  name: `${packageData.displayName || packageData.name}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: "icons/16Fit.png",
    32: "icons/32CircleFit.png",
    128: "icons/128MaxFit.png",
  },
  action: {
    default_popup: "src/runtime/extension/popup/popup.html",
    default_icon: "icons/128MaxFit.png",
  },
  background: {
    service_worker: "src/runtime/extension/background/background.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://skribbl.io/*"],
      js: [
        "src/loader/loader.ts",
        "src/app/app.ts",
      ],
      run_at: "document_start",
    }
  ],
  web_accessible_resources: [
    {
      resources: ["icons/16Fit.png", "icons/32CircleFit.png", "icons/128MaxFit.png", "img/**", "assets/*.worker.ts.js"],
      matches: ["https://skribbl.io/*"],
    },
    {
      matches: ["https://skribbl.io/*"],
      resources: ["**/*.js.map", "gamePatch.js"]
    },
  ],
  permissions: ["activeTab"]
});
