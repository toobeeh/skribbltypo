import { PluginOption } from "vite";
import path from "path";
import fg from "fast-glob";
import fs from "fs";

export const generateCssAssetUrls = (runtime: string, includeAssetsGlob: string): PluginOption => {
  const virtualModuleId = "virtual:asset-urls";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  /* find matching files */
  const globPattern = path.resolve(__dirname, "../assets", includeAssetsGlob).replace(/\\/g, "/");
  const files = fg.sync(globPattern);
  const resolvedFiles = files.map(file => path.relative(path.resolve(__dirname, "../assets"), file));

  /* generate mapping */
  const assets: [string, string][] = resolvedFiles.reduce((acc, file) => {
    const name = file.replace(/[\\./]/gi, "-").toLowerCase();
    const pathString = file.replace(/\\/g, "/");
    let urlFactory = "";

    if (runtime === "extension") {
      urlFactory = `() => chrome.runtime.getURL("${pathString}")`;
    } else if(runtime === "page") {
      urlFactory = `() => "data:text/plain;base64,${fs.readFileSync(path.resolve(__dirname, "../assets", file), "base64").toString()}"`;
    }
    else {
      throw new Error("Invalid runtime");
    }

    acc.push([name, urlFactory]);
    return acc;
  }, []);

  const tsContent = `export const assets = {${assets.map(([name, factory]) => `"${name}": ${factory}`)}};`;

  return {
    name: "generateCssAssetUrls",
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return tsContent;
      }
    },
  };
};