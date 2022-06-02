// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// handles drops collecting and initialization
// depends on: generalFunctions.js, commands.js
const drops = {
    eventDrops: [],
    currentDrop: null,
    claimedDrop: false,
    dropContainer: null,
    fakeboxes: [],
    newDrop: (drop) => {
        if (localStorage.drops == "false" || sessionStorage.inStream == "true") return;
        drops.currentDrop = drop;
        let dropElem = drops.dropContainer;
        if (drop.eventDropID == 0) dropElem.style.backgroundImage = 'url("https://tobeh.host/Orthanc/sprites/gif/drop.gif")';
        else dropElem.style.backgroundImage = 'url("' + drops.eventDrops.find(e => e.EventDropID == drop.eventDropID).URL + '")';
        dropElem.style.display = "block";
        dropElem.style.left = Math.round(8 + Math.random() * 784) + "px";
        //hide drop after 5s and emit timeout
        setTimeout(async () => {
            if (drops.currentDrop) {
                addChatMessage("Whoops...", "The drop timed out :o");
                drops.currentDrop = null;
                drops.claimedDrop = false;
                dropElem.style.display = "none";
            }
            
        }, 5000);
    },
    clearDrop: (result) => {
        //console.log(result);
        if (localStorage.drops == "false" || sessionStorage.inStream == "true") return;
        let dropElem = drops.dropContainer;
        let winner = result.caughtPlayer;
        if(result.leagueWeight > 0){
            if (result.claimTicket == drops.currentDrop.claimTicket) {
                addChatMessage("Nice one!", "You caught a " + Math.round(Number(result.leagueWeight)) + "% rated league drop.");
            }
            else {
                addChatMessage("", winner + " claimed a " +  Math.round(Number(result.leagueWeight)) + "% rated league drop.");
            }
        }
        else {
            if (result.claimTicket == drops.currentDrop.claimTicket) addChatMessage("Yeee!", "You were the fastest to catch the drop!");
            else if(!drops.claimedDrop) addChatMessage("Whoops..", winner + " caught the drop before you :(");
            else addChatMessage("", winner + " caught the regular drop.");
            dropElem.style.display = "none";
        }
    },
    rankDrop: (data) => {
        if (localStorage.drops == "false") return;
        const dropID = data.dropID;
        const ranks = data.ranks;
        const text = ranks.map(r => "- " + r).join("<br>");
        drops.currentDrop = null;
        drops.claimedDrop = false;
        drops.dropContainer.style.display = "none";
        addChatMessage("Last drop claim ranking:", text);
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
            drops.claimedDrop = true;
            let result = await socket.claimDrop(drops.currentDrop);
        });
        document.querySelector("#containerCanvas").appendChild(dropContainer);
    },
    initDrops: async () => {
        drops.initDropContainer();
        drops.eventDrops = socket.data.publicData.drops;
    }
}