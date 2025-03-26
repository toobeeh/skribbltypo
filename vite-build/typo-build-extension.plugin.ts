import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import ManifestV3 = chrome.runtime.ManifestV3;
import manifest from "../src/runtime/extension/manifest";
import { TypoBuildPlugin } from "./typo-build-plugin.interface";

/**
 * Build typo as web extension for firefox or chrome
 * based on the crx plugin
 * @param browser
 */
export const buildChromeExtension: (browser: "chrome" | "firefox") => TypoBuildPlugin = (browser: "chrome" | "firefox") => (
  version: "stable" | "beta" | "alpha" = "stable",
  buildCommit: string | undefined = undefined
) => {

  /* get manifest */
  const mv3 = manifest as unknown as ManifestV3;

  /* add version name to manifest */
  mv3.version_name = `${mv3.version} ${version}-crx${buildCommit ? " " + buildCommit : ""}`;

  const crxOriginal = crx({ manifest: mv3 as unknown as ManifestV3Export, browser });

  return [

    /* apply crx plugin */
    ...crxOriginal,
  ];
};