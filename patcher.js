var patcher = new MutationObserver(function (mutations) {
         mutations.forEach(function (mutation){
            mutation.addedNodes.forEach(function(node){
              if(node.tagName == "SCRIPT" && node.src.includes("game.js")) node.src = chrome.extension.getURL("gamePatch.js");
              if(node.tagName == "A" && node.href.includes("tower")) node.remove();
            });
        });
    });
patcher.observe(document, { attributes: false, childList: true, subtree:true });
