import fs from "fs";
import beautify from 'js-beautify';
import { PatchProcessor } from "./patchEx";

(async () => {
  const js = await (await fetch("https://skribbl.io/js/game.js")).text();
  const beautified = beautify.js(js, { indent_size: 2 });

  const patch = fs.readFileSync("./patch/patch.json", { encoding: "utf-8" });
  const processor = new PatchProcessor();
  processor.importConfig(patch);
  const res = processor.process(beautified);
  if(res.failedInjections.length > 0 || res.failedReplacements.length > 0) {
    throw new Error("Failed to apply patch");
  }
  fs.writeFileSync("./game-patch.js", res.patchedCode);
})();