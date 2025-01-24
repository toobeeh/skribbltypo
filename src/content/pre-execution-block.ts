/* hello there :) */
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
                                                                    
                                                    `,
  "color: lightblue",
  "color:#2596be; font-family:'Arial'; font-weight:bold; font-style:italic; letter-spacing:2em",
  "color: lightblue",
  "color:#2596be; font-family:'Arial'; font-weight:bold; font-style:italic; letter-spacing:2em", "color:#f39656"
);

/**
 * Intercept game.js script and block it from executing
 * Separate from remaining content script to ensure fast run time by lightweight chunk size
 */
const scriptObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.type === "childList") {

      /* if game.js script element is found */
      const target = [...mutation.addedNodes].find(n => n.nodeName === "SCRIPT" && (n as HTMLScriptElement).src.includes("game.js"));
      if(target){
        const script = target as HTMLScriptElement;
        script.type = "javascript/blocked"; // block for chrome
        script.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true }); // block for firefox
        script.remove();
        scriptObserver.disconnect();
      }
    }
  });
});

scriptObserver.observe(document.body, {
  childList: true,
  subtree: true
});