// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// handles drops collecting and initialization
// depends on: generalFunctions.js, commands.js
let drops = {
    timeSyncDiff: 0,
    showNextDropTimeout: null,
    eventDrops: [],
    getSyncedMs: () => {
        return Date.now() + drops.timeSyncDiff;
    },
    getTimeDiff: async () => {
        // sync time
        return new Promise((resolve, reject) => {
            let intv;
            let diffs = [];
            intv = setInterval(async () => {
                let pingTime = Date.now()
                let resp = await fetch("https://www.tobeh.host/Orthanc/date/", {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                });
                let now = Date.now()
                pingTime = now - pingTime;
                diffs.push((Date.parse((await resp.json()).UTCDate) + pingTime / 2) - now);
                if (diffs.length > 20) {
                    clearInterval(intv);
                    resolve(diffs.reduce((previous, current) => current += previous) / diffs.length);
                }
            }, 100);
        })
    },
    fetchEventDrops: async () => {
        let dropResponse = await fetch('https://www.tobeh.host/Orthanc/drop/eventdrop/', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });
        drops.eventDrops = (await dropResponse.json()).EventDrops;
    },
    getNextDrop: async () => {
        if (!lobbies.authorized || sessionStorage.practise == "true") {
            if (QS("#claimDrop")) QS("#claimDrop").style.display = "none";
            return;
        }
        let state = await (await fetch('https://www.tobeh.host/Orthanc/drop/', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: "login=" + JSON.parse(localStorage.member).UserLogin
        })).json();
        if (state.DropID) {
            let dropTime = state.ValidFrom;
            let timediff = Date.parse(dropTime + " UTC") - drops.getSyncedMs();
            if (timediff < 0) return;
            clearTimeout(drops.showNextDropTimeout);
            drops.showNextDropTimeout = setTimeout(() => {
                let drop = QS("#claimDrop");
                drop.setAttribute("dropID", state.DropID);
                if (state.EventDropID == 0) drop.style.backgroundImage = 'url("https://tobeh.host/Orthanc/sprites/gif/drop.gif")';
                else drop.style.backgroundImage = 'url("' + drops.eventDrops.find(e => e.EventDropID == state.EventDropID).URL + '")';
                drop.style.display = "block";
                drop.style.left = Math.round(8 + Math.random() * 784) + "px";
                let dropClaimedCheck = setInterval(async () => {
                    if (drop.style.display == "none") { clearInterval(dropClaimedCheck); return; }
                    let state = await fetch('https://www.tobeh.host/Orthanc/drop/', {
                        method: 'POST',
                        headers: {
                            'Accept': '*/*',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        body: "login=" + JSON.parse(localStorage.member).UserLogin
                    });
                    state = await state.json();
                    if (!state.DropID) {
                        drop.dispatchEvent(new Event("click"));
                    }
                }, 200);
                setTimeout(async () => { drop.style.display = "none"; clearInterval(dropClaimedCheck); }, 5000);
            }, timediff);
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
            let dropID = dropContainer.getAttribute("dropID");
            let state = await fetch('https://www.tobeh.host/Orthanc/drop/claim/', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: "login=" + JSON.parse(localStorage.member).UserLogin + "&dropID=" + dropID + "&lobbyKey=" + Report.lobby.Key + "&lobbyPlayerID=" + Report.loginName
            }
            );
            state = await state.json();
            if (state.Caught) printCmdOutput("drop", "You were the fastest and caught the drop!", "Yeee!");
            else {
                let winner = "";
                if (state.CaughtLobbyKey == Report.lobby.Key) winner = state.CaughtLobbyPlayerID;
                else winner = "Someone in another lobby"
                printCmdOutput("drop", winner + " caught the drop before you :(", "Whoops...");
            }
        })
        document.querySelector("#containerCanvas").appendChild(dropContainer);
    },
    initDrops: async () => {
        drops.initDropContainer();
        await drops.fetchEventDrops();
        // sync time once a min
        (async () => { drops.timeSyncDiff = await drops.getTimeDiff(); })();
        setInterval(async () => { drops.timeSyncDiff = await drops.getTimeDiff(); }, 1000 * 60);
        // check drops all 10 seconds
        setInterval(drops.getNextDrop, 10000);
    }
}