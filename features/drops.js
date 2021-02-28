// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// handles drops collecting and initialization
// depends on: generalFunctions.js, commands.js
let drops = {
    eventDrops: [],
    currentDrop: null,
    newDrop: (drop) => {
        drops.currentDrop = drop;
        let dropElem = QS("#claimDrop");
        if (drop.EventDropID == 0) dropElem.style.backgroundImage = 'url("https://tobeh.host/Orthanc/sprites/gif/drop.gif")';
        else dropElem.style.backgroundImage = 'url("' + drops.eventDrops.find(e => e.EventDropID == drop.EventDropID).URL + '")';
        dropElem.style.display = "block";
        dropElem.style.left = Math.round(8 + Math.random() * 784) + "px";
        //hide drop after 5s and emit timeout
        setTimeout(async() => {
            if (dropElem.style.display != "none") {
                dropElem.style.display = "none";
                let result = await socket.claimDrop(drops.currentDrop, true);
                printCmdOutput("drop", "The drop timed out :o", "Whoops...");
                if(result.lobbyKey != "") printCmdOutput("drop", "Someone with typo older than v21 caught the drop.","..");
                drops.currentDrop = null;
            }
        }, 5000);
    },
    clearDrop: (result) => {
        let dropElem = QS("#claimDrop");
        if (dropElem.style.display != "none") {
            let winner = "";
            if (result.caughtLobbyKey == socket.clientData.lobbyKey) winner = result.caughtPlayer;
            else winner = "Someone in another lobby";
            printCmdOutput("drop", winner + " caught the drop before you :(", "Whoops...");
            dropElem.style.display = "none";
            drops.currentDrop = null;
        }
    },
    initDropContainer: () => {
        // add drop button
        let dropContainer = document.createElement("div");
        dropContainer.id = "claimDrop";
        dropContainer.style.width = "48px";
        dropContainer.style.height = "48px";
        dropContainer.style.left = "8px";
        dropContainer.style.bottom = "8px";
        dropContainer.style.position = "absolute";
        dropContainer.style.backgroundSize = "contain";
        dropContainer.style.cursor = "pointer";
        dropContainer.style.display = "none";
        dropContainer.style.backgroundImage = "url('https://tobeh.host/Orthanc/sprites/gif/drop.gif')";
        dropContainer.addEventListener("click", async () => {
            if (dropContainer.style.display == "none") return;
            dropContainer.style.display = "none";
            let result = await socket.claimDrop(drops.currentDrop);
            if (result.result.caught) printCmdOutput("drop", "You were the fastest and caught the drop!", "Yeee!");
            else {
                let winner = "";
                if (result.caughtLobbyKey == socket.clientData.lobbyKey) winner = result.playerName;
                else winner = "Someone in another lobby";
                printCmdOutput("drop", winner + " caught the drop before you :(", "Whoops...");
            }
            drops.currentDrop = null;
        });
        document.querySelector("#containerCanvas").appendChild(dropContainer);
    },
    initDrops: async () => {
        drops.initDropContainer();
        drops.eventDrops = socket.data.publicData.drops;
    }
}