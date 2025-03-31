import monkey from "vite-plugin-monkey";

/// @ts-expect-error errors in the IDE, but it's fine
import packageData from "../package.json";
import { TypoBuildPlugin } from "./typo-build-plugin.interface";

/**
 * Build the extension for userscript engines
 * based on the vite userscript plugin
 * @param version
 * @param buildCommit
 */
export const buildUserscript: TypoBuildPlugin = (
  version: "stable" | "beta" | "alpha" = "stable",
  buildCommit: string | undefined = undefined
) => {

  /* virtual module for release details */
  const virtualModuleId = "virtual:page-release-details";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  /* add version name to manifest */
  const version_name = `${packageData.version} ${version}-usc${buildCommit ? " " + buildCommit : ""}`;
  console.log(version_name);

  return [

    /* generate release details */
    {
      name: "generateReleaseDetails",
      resolveId(id: string) {
        if (id === virtualModuleId) {
          return resolvedVirtualModuleId;
        }
      },
      load(id: string) {
        if (id === resolvedVirtualModuleId) {
          return `export const pageReleaseDetails = { version: "${packageData.version}", versionName: "${version_name}", runtime: "userscript" };`;
        }
      },
    },

    /* apply userscript plugin */
    ...monkey({
      entry: "src/runtime/page/entry.ts",
      userscript: {
        match: "https://skribbl.io/*",
        "run-at": "document-start",
        version: version_name,
      }
    }),
  ];
};