// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, report.js
let lobbies = {
    guildLobbies: undefined,
    header: undefined,
    lobbyDeadHits: 0,
    error: true,
    authorized: false,
    getAndValidateLoginPlayer: async () => {
        // verify stored login and get player object with connected guilds from orthanc server
        if (lobbies.authorized) return true;
        if (!localStorage.login || localStorage.login.trim() == "") return false;
        let loginResponse = await (await fetch('https://www.tobeh.host/Orthanc/login/', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: "login=" + localStorage.login
        })).text();
        if (loginResponse.includes("false")) {
            alert("Something went wrong with your Palantir login.\nMessage Palantir '>login' and enter your login in the popup.");
            localStorage.member = "";
            localStorage.login = "";
            return false;
        };
        loginResponse = JSON.parse(loginResponse);
        if (!loginResponse.Valid) {
            alert("Something went wrong with your Palantir login.\nMessage Palantir '>login' and enter your login in the popup.");
            localStorage.member = "";
            localStorage.login = "";
            return false;
        }
        else localStorage.member = JSON.stringify(loginResponse.Member);
        lobbies.authorized = true;
        return true;
    },
    loadLobbies: async (observeToken, guildID, container, guildName) => {
        let state = await fetch('https://www.tobeh.host/Orthanc/status/', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: "observeToken=" + observeToken + "&member=" + encodeURIComponent(localStorage.member)
        });
        let response = await state.json()
        if (response.Status.includes("Unauthorized") || response.Verify.Valid == false) {
            container.querySelector("#lobbies" + guildID).innerHTML = "Error retrieving data for " + guildName + " :( ";
            return;
        }
        container.querySelector("#lobbies" + response.Verify.AuthGuildID).innerHTML = "";
        response.Lobbies.forEach((l) => {
            let lobbyButton = document.createElement("div");
            let idData = l.ID.split(":");
            lobbyButton.classList = "btn btn-success";
            lobbyButton.style = "margin:0.2em";
            lobbyButton.classList.add("lobbySearchButton");
            lobbyButton.setAttribute("lobbykey", l.Key);
            lobbyButton.setAttribute("lobbylang", l.Language);
            lobbyButton.setAttribute("link", l.Link);
            lobbyButton.setAttribute("lobbyid", idData[1]);
            lobbyButton.setAttribute('lobbyPlayerCount', l.Players.length);
            lobbyButton.textContent = response.Verify.AuthGuildName + " #" + idData[0] + (l.Private ? (l.Host == "skribbl.io" ? " [Private]" : " [Sketchful]") : "");
            lobbyButton.id = "lobbyID" + idData[1];
            if (idData[1] == sessionStorage.targetLobby && sessionStorage.lobbySearch == "true") {
                if (l.Players.length >= 8) {
                    lobbyButton.textContent += " [waiting...]";
                    document.querySelector("#popupSearch").innerText = "Waiting for free slot";
                    Report.playing = false;
                    Report.searching = false;
                    Report.waiting = true;
                    Report.trigger();
                }
                lobbyButton.classList.remove("btn-success");
                lobbyButton.classList.add("btn-warning");
            }
            container.querySelector("#lobbies" + response.Verify.AuthGuildID).appendChild(lobbyButton);
        });
        if (container.querySelector("#lobbies" + response.Verify.AuthGuildID).children.length < 1) {
            container.querySelector("#lobbies" + response.Verify.AuthGuildID).remove();
            container.querySelector("#cont" + response.Verify.AuthGuildID).innerHTML = "<div style='margin:1em' class='btn btn-primary'> No lobbies on " + response.Verify.AuthGuildName + " :( </div>";
        }
    },
    startSearch: () => {
        // start a search for a palantir lobby 
        if (sessionStorage.lobbySearch == "true") {
            let lobbyid = QS("#lobbyID" + sessionStorage.targetLobby);
            if (!lobbyid) {
                lobbies.lobbyDeadHits++;
                if (lobbies.lobbyDeadHits < 5) {
                    setTimeout(lobbies.startSearch, 1000);
                    return;
                }
                sessionStorage.lobbySearch = "false";
                alert("The lobby doesn't exist anymore :(");
                QS("#popupSearch").popupSearch.innerText = "";
                QS("#popupSearch").popupSearch.style.display = "none";
                Report.playing = false;
                Report.searching = false;
                Report.waiting = false;
                Report.trigger();
            }
            else if (parseInt(lobbyid.getAttribute('lobbyPlayerCount')) < 8) QS("button[type='submit'].btn-success").click();
        }
    },
    initGuildContainer: async (patcher = false) => {
        // abort if not authorized or screen not shown
        if (!await lobbies.getAndValidateLoginPlayer() || !patcher && QS("#screenLogin").style.display == "none") return;
        // create header for lobbies tab and lobbie container for each guild
        lobbies.header = document.createElement("h3");
        lobbies.header.innerHTML = "<p style='font-weight:700; margin-bottom: 0; color:black !important' ;> Discord Lobbies </p>";
        lobbies.guildLobbies = document.createElement("div");
        lobbies.guildLobbies.className = "updateInfo";
        let guilds = JSON.parse(localStorage.member).Guilds;
        guilds.forEach((g) => {
            let guildContainer = document.createElement("div");
            guildContainer.id = "cont" + g.GuildID;
            guildContainer.className = "guildContainer";
            let guildLobbies = document.createElement("div");
            guildLobbies.id = "lobbies" + g.GuildID;
            guildLobbies.style = "display:flex;flex-direction:row;flex-wrap:wrap;margin:1em;";
            guildLobbies.innerText = "Loading lobbies...";
            guildContainer.appendChild(guildLobbies);
            lobbies.guildLobbies.appendChild(guildContainer);
        });
        // set tab styles
        let tab = document.querySelector(".login-side-right");
        let newPalantirTab = document.createElement("div");
        newPalantirTab.appendChild(lobbies.header);
        newPalantirTab.appendChild(lobbies.guildLobbies);
        // if initiated by patcher, show loading stuff
        if (patcher) {
            newPalantirTab.id = "palantir";
            newPalantirTab.className = "loginPanelContent";
            newPalantirTab.style = "height:fit-content; padding: .5em;";
            tab.insertBefore(newPalantirTab, tab.firstChild);
        }
        // load current lobbies
        for (let g of JSON.parse(localStorage.member).Guilds) {
            await lobbies.loadLobbies(g.ObserveToken, g.GuildID, newPalantirTab, g.GuildName);
        }
        if (localStorage.member == "" || JSON.parse(localStorage.member).Guilds.length < 1) {
            newPalantirTab.querySelector(".updateInfo").innerHTML = "No discord server verified.<br/>Check out the extension popup!";
        }
        // if not patcher, show lobbies after loaded
        if (!patcher) {
            let palantirTab = document.querySelector("#palantir");
            if (palantirTab) palantirTab.innerHTML = "";
            else {
                palantirTab = document.createElement("div");
                palantirTab.id = "palantir";
                tab.insertBefore(palantirTab, tab.firstChild);
            }
            palantirTab.innerHTML = newPalantirTab.innerHTML;
        }
        // add search event handler to all lobby buttons
        QSA(".lobbySearchButton").forEach(b => {
            b.addEventListener("click", async () => {
                let link = b.getAttribute("link");
                let key = b.getAttribute("lobbykey");
                let id = b.getAttribute("lobbyid");
                let language = b.getAttribute("lobbylang");
                localStorage.lang = language;
                if (link) {
                    sessionStorage.skippedLobby = "true";
                    window.location.href = link;
                    return;
                }
                sessionStorage.targetLobby = id;
                sessionStorage.targetKey = key;
                sessionStorage.lobbySearch = "true";

                QS("button[type='submit'].btn-success").click();
                Report.searching = true;
                Report.waiting = false;
                Report.playing = false;
                setTimeout(() => {
                    if (sessionStorage.skipDeadLobbies == "false" && JSON.parse(sessionStorage.searchPlayers).length <= 0 && sessionStorage.lobbySearch == "false") {
                        Report.playing = true;
                        Report.searching = false;
                        Report.waiting = false;
                        Report.trigger();
                    }
                }, 4000);
                // reload active lobbies
                await lobbies.initGuildContainer();
                QS("#popupSearch").parentElement.style.display = "block";
            });
        });
    },
    lobbyConnected: async (e) => {
        // handler as soon as the lobby is connected -> execute search checks
        // if searching for a lobby id
        if (sessionStorage.lobbySearch == "true") {
            let id = sessionStorage.targetLobby;
            let state = await fetch('https://www.tobeh.host/Orthanc/idprovider/', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: "lobbyID=" + id
            });
            let idResponse = await state.json();
            let thisKey = Report.generateLobbyKey(false);
            //alert(idResponse.Lobby.Key + " # " + thisKey); // #DEBUG
            if (idResponse.Lobby && idResponse.Lobby.Key != thisKey) setTimeout(() => { window.location.reload(); }, 600);
            else {
                sessionStorage.lobbySearch = "false";
                QS("#popupSearch").parentElement.style.display = "none";
                if (Notification.permission !== "blocked" && document.hidden) {
                    let n = new Notification("Lobby found!", { body: "Yee! Check out skribbl", icon: "/res/crown.gif" });
                }
            }
        }
        //if searching for a player
        else if (sessionStorage.searchPlayers && JSON.parse(sessionStorage.searchPlayers).length > 0) {
            let found = false;
            let players = JSON.parse(sessionStorage.searchPlayers);
            e.detail.forEach(p => { if (players.includes(p.name)) found = true; });
            if (found) {
                sessionStorage.searchPlayers = "[]";
                QS("#popupSearch").parentElement.style.display = "none";
                if (Notification.permission !== "blocked" && document.hidden) {
                    let n = new Notification("Player found!", { body: "Yee! Check out skribbl", icon: "/res/crown.gif" });
                }
            }
            else {
                sessionStorage.skippedLobby = "true";
                setTimeout(() => { window.location.reload(); }, 600);
            }
        }
        // if dead lobbies are skipped
        else if (sessionStorage.skipDeadLobbies == "true") {
            if (QSA("#containerGamePlayers > .player").length <= 1) {
                sessionStorage.skippedLobby = "true";
                setTimeout(() => { window.location.reload(); }, 600);
            }
            else {
                sessionStorage.skipDeadLobbies = "false";
                QS("#popupSearch").parentElement.style.display = "none";
                if (Notification.permission !== "blocked" && document.hidden) {
                    let n = new Notification("Lobby found!", { body: "Yee! Check out skribbl", icon: "/res/crown.gif" });
                }
            }
        }
        // report as playing after timeout
        setTimeout(() => {
            if (sessionStorage.skipDeadLobbies == "false" && JSON.parse(sessionStorage.searchPlayers).length <= 0 && sessionStorage.lobbySearch == "false") {
                Report.reportAsPlaying();
            }
        }, 4000);
    },
    initSearchEvents: () => {
        // Set status as searching as soon as lobby connected
        document.body.addEventListener("lobbyConnected", () => {
            Report.reportAsSearching();
            // report as playing after timeout
            setTimeout(() => { Report.reportAsPlaying(); }, 4000);
        });
        // check lobby as soon as connected and perform search checks
        document.body.addEventListener("lobbyConnected", lobbies.lobbyConnected);
        // refresh lobbies all 5 secs 
        setInterval(async () => {
            await lobbies.initGuildContainer();
            if (sessionStorage.lobbySearch == "true") setTimeout(lobbies.startSearch, 1000);
        }, 5000);
        // if search is active, call
        if (sessionStorage.lobbySearch == "true") setTimeout(lobbies.startSearch, 1000);
    }
};