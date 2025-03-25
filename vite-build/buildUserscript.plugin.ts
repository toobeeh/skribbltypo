import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import { PluginOption } from "vite";
import ManifestV3 = chrome.runtime.ManifestV3;

/**
 * Build the extension for chrome browsers
 * based on the crx plugin
 * extended to include css variables for all chrome accessible resource urls
 * @param manifest
 * @param version
 * @param buildCommit
 */
export const buildUserscript = (
  manifest: ManifestV3Export,
  version: "stable" | "beta" | "alpha" = "stable",
  buildCommit: string | undefined = undefined
): PluginOption[] => {

  /* get manifest */
  const mv3 = manifest as unknown as ManifestV3;

  /* add version name to manifest */
  mv3.version_name = `${mv3.version} ${version}-usc${buildCommit ? " " + buildCommit : ""}`;

  return [

    /* apply crx plugin */
    ...crx({ manifest: mv3 as unknown as ManifestV3Export }),
  ];
};