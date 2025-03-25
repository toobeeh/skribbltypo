import path from "path";
import { type PluginOption } from "vite";
import fs from "fs";

/**
 * A plugin to remove artifacts created by the css url generator
 * @param manifest
 */
export const deleteCssAssetUrlsArtifacts = (): PluginOption => {
  return {
    name: "delete-css-injector",
      enforce: "post",
      buildEnd() {
        const tsOutputPath = path.resolve(__dirname, "cssgen/css-urls.ts");
        fs.unlinkSync(tsOutputPath);
        fs.rmdirSync(path.resolve(__dirname, "cssgen"));
    }
  };
};