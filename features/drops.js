// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// handles drops collecting and initialization
// depends on: generalFunctions.js, commands.js
const drops = {
    eventDrops: [],
    currentDrop: null,
    dropContainer: null,
    waitForClear: false,
    fakeboxes: [],
    newDrop: (drop) => {
        if (localStorage.drops == "false") return;
        drops.currentDrop = drop;
        let dropElem = drops.dropContainer;
        if (drop.EventDropID == 0) dropElem.style.backgroundImage = 'url("https://tobeh.host/Orthanc/sprites/gif/drop.gif")';
        else dropElem.style.backgroundImage = 'url("' + drops.eventDrops.find(e => e.EventDropID == drop.EventDropID).URL + '")';
        dropElem.style.display = "block";
        dropElem.style.left = Math.round(8 + Math.random() * 784) + "px";
        //hide drop after 5s and emit timeout
        setTimeout(async () => {
            if (drops.currentDrop) {
                dropElem.style.display = "none";
                printCmdOutput("drop", "The drop timed out :o", "Whoops...");
                drops.currentDrop = null;
            }
            
        }, 5000);
    },
    clearDrop: (result) => {
        if (localStorage.drops == "false") return;
        let dropElem = drops.dropContainer;
        let winner = result.caughtPlayer;
        if (result.claimSocketID == socket.sck.id) printCmdOutput("drop", "You were the fastest and caught the drop!", "Yeee!");
        else printCmdOutput("drop", winner + " caught the drop before you :(", "Whoops...");
        dropElem.style.display = "none";
        drops.currentDrop = null;
        drops.waitForClear = false;
        
    },
    initDropContainer: () => {
        // add drop button
        let dropContainer = document.createElement("div");
        drops.dropContainer = dropContainer;
        dropContainer.style.width = "48px";
        dropContainer.setAttribute("fuck-you", "are you really trying to auto-click drops? come on...");
        dropContainer.style.height = "48px";
        dropContainer.style.left = "8px";
        dropContainer.style.bottom = "8px";
        dropContainer.style.position = "absolute";
        dropContainer.style.backgroundSize = "contain";
        dropContainer.style.cursor = "pointer";
        dropContainer.style.display = "none";
        dropContainer.style.backgroundImage = "url('https://tobeh.host/Orthanc/sprites/gif/drop.gif')";
        dropContainer.addEventListener("click", async (event) => {
            if (!event.isTrusted) {
                // send webhook
                await fetch("https://discord.com/api/webhooks/917505895867482183/mhR2tsguCLDG8O-jmiSPo_YEtIUTIxA9Oq00jV6IdZi9VjP4p4Ntm1b8WvmGbSQk4kOI", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: "fuck you",
                        embeds: [
                            {
                                "title": socket.data.user.member.UserLogin + socket.data.user.member.UserName
                            }
                        ]
                    })
                });
                return;
            }
            if (dropContainer.style.display == "none") return;
            dropContainer.style.display = "none";
            let result = await socket.claimDrop(drops.currentDrop);
            drops.currentDrop = null;
        });
        document.querySelector("#containerCanvas").appendChild(dropContainer);
    },
    initDrops: async () => {
        drops.initDropContainer();
        drops.eventDrops = socket.data.publicData.drops;
    }
}