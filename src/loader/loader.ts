import { requireElement } from "@/util/document/requiredQuerySelector";
import "./loader.scss";

document.documentElement.dataset["typo_loading_screen_disabled"] = (
  window.location.pathname === "/terms" || window.location.pathname === "/credits"
) + "";

/* check if document is loaded so that socketio is available, or wait for dom loaded */
const loaded = new Promise<void>(resolve => {
  if(document.readyState === "interactive" || document.readyState === "complete" || Object.keys(window).includes("io")) resolve();
  document.addEventListener("DOMContentLoaded", () => resolve());
});

/* prevent game.js to be sure, in case it gets executed on new body */
const scriptObserver = new MutationObserver((nodes) => {

  nodes.forEach(node => {
    if(node instanceof HTMLScriptElement){
      if(node.src.includes("game.js")) {
        node.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true }); // block for firefox
        node.src = ""; /* to be sure */
        node.remove();
      }
    }
  });
});

scriptObserver.observe(document, {
  childList: true,
  subtree: true
});

/* start loading skribbl page */
const content = new Promise<HTMLElement>(async (resolve) => {

  /* fetch original skribbl doc and prevent game from executing */
  let html = await (await fetch(window.location.href)).text();
  html = html.replaceAll("game.js", "game.jsblocked");

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
loaded.then(async () => {
  const body = await content;
  document.body = body;
  scriptObserver.disconnect();
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




