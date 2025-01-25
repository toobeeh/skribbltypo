import { requireElement } from "@/util/document/requiredQuerySelector";
import "./loader.scss";

/* start loading skribbl page */
const content = new Promise<HTMLElement>(async (resolve) => {

  /* fetch original skribbl doc and prevent game from executing */
  let html = await (await fetch("./")).text();
  html = html.replaceAll("game.js", "game.jsx");

  /* create new document wit loaded content */
  const newDoc = document.createElement("html");
  newDoc.innerHTML = html;
  const body = requireElement("body", newDoc);
  body.dataset["typo_loader"] = "true";
  resolve(body);
});

/**
 * replace document body as soon as loaded
 * this has the advantage that if typo is for some reason injected after the game.js is loaded,
 * the whole page will reset and execution of the game.js is in the hands of typo
 */
content.then(async body => {
  document.body = body;
  signature();
});

/* hello there :) */
const signature = () => {
  console.clear();
  console.log(`%c
        _             _   _       _       _   _                           
       | |           (_) | |     | |     | | | |     %cskribbl modded with%c
  ___  | | __  _ __   _  | |__   | |__   | | | |_   _   _   _ __     ___  
 / __| | |/ / | '__| | | | '_ \\  | '_ \\  | | | __| | | | | | '_ \\   / _ \\ 
 \\__ \\ |   <  | |    | | | |_) | | |_) | | | | |_  | |_| | | |_) | | (_) |
 |___/ |_|\\_\\ |_|    |_| |_.__/  |_.__/  |_|  \\__|  \\__, | | .__/   \\___/ 
                                                     __/ | | |            
                                                    |___/  |_|     %cby tobeh#7437 %c

        ➜ Typo & all its backend is open source: https://github.com/toobeeh/skribbltypo
        ➜ Join the community: https://discord.com/invite/pAapmUmWAM
        ➜ Find more infos at: https://www.typo.rip/
        ➜ Support development: https://patreon.com/skribbltypo
        
        [ ${chrome.runtime.getManifest().version_name} ]
                                                                    
                                                    `,
    "color: lightblue",
    "color:#2596be; font-family:'Arial'; font-weight:bold; font-style:italic; letter-spacing:2em",
    "color: lightblue",
    "color:#2596be; font-family:'Arial'; font-weight:bold; font-style:italic; letter-spacing:2em", "color:#f39656"
  );
};




