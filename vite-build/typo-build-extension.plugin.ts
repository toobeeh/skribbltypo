import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import ManifestV3 = chrome.runtime.ManifestV3;
import manifest from "../src/runtime/extension/manifest";
import { TypoBuildPlugin } from "./typo-build-plugin.interface";
import ManifestV2 = chrome.runtime.ManifestV2;

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
  const browserShort = browser === "chrome" ? "cr" : "ff";
  mv3.version_name = `${mv3.version} ${version}-${browserShort}x${buildCommit ? " " + buildCommit : ""}`;

  /* change background worker declaration for firefox */
  if(browser === "firefox") {
    (mv3 as unknown as ManifestV2).background = {scripts: [mv3.background.service_worker]};
  }

  const crxOriginal = crx({ manifest: mv3 as unknown as ManifestV3Export, browser });

  return [

    /* apply crx plugin */
    ...crxOriginal,
  ];
};