var patcher = new MutationObserver(function (mutations) {
         mutations.forEach(function (mutation){
            mutation.addedNodes.forEach(function(node){
              if(node.tagName == "SCRIPT" && node.src.includes("game.js")) node.src = chrome.extension.getURL("gamePatch.js");
                if (node.tagName == "A" && node.href.includes("tower")) node.remove();
                if (node.tagName == "DIV") {
                    if (node.classList.contains("informationTabs")) initLobbyTab();
                    if (node.id == "collapseUpdate") node.classList = "updateInfo collapse";
                }
                    

            });
        });
    });
patcher.observe(document, { attributes: false, childList: true, subtree:true });
