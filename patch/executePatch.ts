import fs from "fs";
import beautify from 'js-beautify';
import { gameJsPatchConfig } from "./patchConfig";
import { PatchProcessor } from "./patchEx";

(async () => {
  const js = await (await fetch("https://skribbl.io/js/game.js")).text();
  const beautified = beautify.js(js, { indent_size: 2 });

  const config = JSON.stringify(gameJsPatchConfig);
  const processor = new PatchProcessor();
  processor.importConfig(config);
  const res = processor.process(beautified);
  if(res.failedInjections.length > 0 || res.failedReplacements.length > 0) {
    throw new Error("Failed to apply patch");
  }
  fs.writeFileSync("./public/gamePatch.js", res.patchedCode);
})();