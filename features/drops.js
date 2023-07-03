// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// handles drops collecting and initialization
// depends on: generalFunctions.js, commands.js
let drops = {
    eventDrops: [],
    mode: "normal",
    currentDrop: null,
    dropContainer: null,
    waitForClear: false,
    specialDrop: (callback) => {
        let html = `<div id="specialdrop">
        <style>
            @keyframes rotate {
                0% {transform:rotate(-45deg) ;}
                100% {transform:rotate(45deg) ;}
            }
            
            @keyframes wiggle {
                0% {transform:rotateZ(0deg) rotateY(-2deg);}
                50% {transform:rotateZ(-2deg) rotateY(0deg);}
                100% {transform:rotateZ(0deg) rotateY(-2deg);}
            }
        </style>

        <div style="
            position: fixed;
            left: 50vw;
            top: 50vh;
            z-index: 1000;
            animation: wiggle 0.7s;
            animation-iteration-count: infinite;
        "><div style="
            cursor:pointer;
            width: 10em;
            aspect-ratio: 2;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url(https://media.discordapp.net/attachments/740191494975258644/1055490440515833866/SantaSleighDrop.gif);
            animation: rotate 6s;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            transform-origin: 0 200vh;
        "></div></div>
        `;
        document.body.insertAdjacentHTML("afterbegin", html);
        setTimeout(() => {
            QS("#specialdrop").remove();
        }, 5000);
        hits = 0;
        msgs = [
            "Baby, hit me one more time",
            "Ouch?! x.x",
            "Bro just stop it",
            ":-( *sad santa noises*",
            ">:( no presents for you"
        ];
        QS("#specialdrop").addEventListener("pointerdown", () => {
            hits++;
            addChatMessage("Santa:", msgs[msgs.length * Math.random() | 0]);
            if (hits == 4) callback();
        });
    },
    newDrop: (drop) => {
        if (localStorage.drops == "false" || sessionStorage.inStream == "true" || !lobbies.joined) return;
        drops.currentDrop = drop;
        let dropElem = drops.dropContainer;
        if (drop.eventDropID == 0 || drops.mode === "league") dropElem.style.backgroundImage = 'url("https://tobeh.host/Orthanc/sprites/gif/drop.gif")';
        else dropElem.style.backgroundImage = 'url("' + drops.eventDrops.find(e => e.EventDropID == drop.eventDropID).URL + '")';
        dropElem.style.display = "block";
        dropElem.style.left = Math.round(5 + Math.random() * 90) + "%";
        dropElem.style.filter = drops.mode === "normal" ? "" : "hue-rotate(100deg) saturate(1.5)";
        //hide drop after 5s and emit timeout
        setTimeout(async () => {
            if (drops.currentDrop && !drops.claimedDrop) {
                addChatMessage("Whoops...", "The drop timed out :o");
                drops.currentDrop = null;
                drops.claimedDrop = false;
                dropElem.style.display = "none";
            }

        }, 5000);
    },
    clearDrop: (result) => {
        if (localStorage.drops == "false" || sessionStorage.inStream == "true") return;
        let dropElem = drops.dropContainer;
        let winner = result.caughtPlayer;
        if (result.leagueWeight > 0) {
            if (result.claimTicket == drops.currentDrop.claimTicket) {
                addChatMessage("Nice one!", "You caught a " + Math.round(Number(result.leagueWeight)) + "% rated league drop.");
                drops.caughtLeagueDrop = true;
            }
            else {
                if (localStorage.dropmsgs == "true") addChatMessage("", winner + " claimed a " + Math.round(Number(result.leagueWeight)) + "% rated league drop.");
            }
        }
        else {
            if (result.claimTicket == drops.currentDrop.claimTicket) {
                addChatMessage("Yeee!", "You were the fastest to catch the drop!");
                drops.selfCaught = true;
            }
            else if (!drops.claimedDrop && !drops.caughtLeagueDrop) addChatMessage("Whoops..", winner + " caught the drop before you :(");
            else addChatMessage("", winner + " caught the regular drop.");
            dropElem.style.display = "none";
        }
    },
    rankDrop: (data) => {
        if (localStorage.drops == "false") return;
        const ranks = data.ranks;
        const text = ranks.map(r => "- " + r).join("<br>");
        drops.currentDrop = null;
        drops.claimedDrop = false;
        drops.caughtLeagueDrop = false;
        drops.dropContainer.style.display = "none";
        if (localStorage.dropmsgs == "true") {
            addChatMessage("Last drop claim ranking:", text);
        }
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
        dropContainer.addEventListener("pointerdown", async (event) => {
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
        document.querySelector("#game-canvas").appendChild(dropContainer);
    },
    initDrops: async () => {
        drops.initDropContainer();
        drops.eventDrops = socket.data.publicData.drops;
    }
}