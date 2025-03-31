import fs from "fs";
import beautify from "js-beautify";
import { gameJsPatchConfig } from "./patchConfig";
import { PatchProcessor } from "./patchEx";

const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

(async () => {
  const js = await (await fetch("https://skribbl.io/js/game.js")).text();
  const gameHash = cyrb53(js);
  console.log("Found game js with hash ", gameHash);
  const beautified = beautify.js(js, { indent_size: 2 });

  const config = JSON.stringify(gameJsPatchConfig);
  const processor = new PatchProcessor();
  processor.importConfig(config);
  const res = processor.process(beautified);
  if(res.failedInjections.length > 0 || res.failedReplacements.length > 0) {
    console.log("FAILED INJECTIONS\n", res.failedInjections.map(i => `Position: ${i.injection.injectionPositionRegex}\nCode: ${i.injection.injectionCode}`).join("\n\n"));
    console.log("FAILED REPLACEMENTS\n", res.failedReplacements.map(i => `Source: ${i.replacement.sourceRegex}\nTarget: ${i.replacement.targetRegex}`).join("\n\n"));
    console.log("TOTAL\n", res.failedReplacements.length, res.failedInjections.length);
    fs.writeFileSync(`./assets/failed-gamePatch-${gameHash}.js`, res.patchedCode);
    throw new Error("Failed to apply patch");
  }
  fs.writeFileSync(`./assets/gamePatch-${gameHash}.js`, res.patchedCode);
})();