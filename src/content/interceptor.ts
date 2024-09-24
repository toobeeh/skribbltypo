/* promise that resolves when original game.js has been removed */
const scriptStopped = new Promise<void>((resolve) => {

  /* observe changes in child list */
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
          resolve();
        }
      }
    });
  });

  scriptObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
});

/* promise that resolves when the content script is ready */
const contentScriptLoaded = new Promise<void>((resolve) => {
  if(document.body.getAttribute("typo-script-loaded") !== null) {
    resolve();
    return;
  }

  const contentLoadedObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "typo-script-loaded") {

        // Do something here, for example, stop observing if no longer needed
        contentLoadedObserver.disconnect();
        resolve();
      }
    });
  });

  /* wait until content script indicates it is ready */
  contentLoadedObserver.observe(document.body, {
    attributes: true // Observe attribute changes
  });
});

/* wait until original game js removed and content ready */
Promise.all([scriptStopped, contentScriptLoaded]).then(() => {
  document.dispatchEvent(new CustomEvent("scriptStopped"));

  const patch = document.createElement("script");
  patch.src = chrome.runtime.getURL("gamePatch.js");
  patch.onload = async () => {

    /* signalize patched game is ready */
    document.dispatchEvent(new CustomEvent("patchExecuted"));
  };
  document.body.appendChild(patch);
});



