(() => {
    // sexy
})();

var guildLobbies;
var header;
var error = true;
var auth = false;

// verify stored login and get player object with connected guilds from orthanc server
async function getLoginPlayer() {
    if (auth) return;
    if (localStorage.login == "" || localStorage.login == undefined) return;
    let loginResponse = await (await fetch('https://www.tobeh.host/Orthanc/login/', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: "login=" + localStorage.login
    }
    )).text();   
    if (loginResponse.includes("false")) alert(loginResponse + "\n" + localStorage.login);
    loginResponse = JSON.parse(loginResponse);
    if (!loginResponse.Valid) {
        alert("Your saved login data is invalid! Re-enter your login in the extension popup.");
        localStorage.member = "";
        localStorage.login = "";
    }
    else localStorage.member = JSON.stringify(loginResponse.Member);
    auth = true;
}

// build div on top of updatenews containing a div for each connected guild
function buildGuildContainer() {

    header = document.createElement("h3");
    header.innerHTML = "<p style='font-weight:700' ; margin-bottom: 0.5em; color:black !important;> Discord Lobbies </p>";

    guildLobbies = document.createElement("div");
    guildLobbies.className = "updateInfo";

    let guilds = JSON.parse(localStorage.member).Guilds;

    guilds.forEach((g) => {
        let guildContainer = document.createElement("div");
        guildContainer.id = "cont" + g.GuildID;
        guildContainer.className = "guildContainer";

        let header = document.createElement("div");
        header.classList = "btn btn-primary btn -block";
        header.style = "background-color: #337ab7 !important;margin-left:.5em; padding:0.5em; margin-top:0.5em;";
        header.innerText = g.GuildName;

        let lobbies = document.createElement("div");
        lobbies.id = "lobbies" + g.GuildID;
        lobbies.style = "display:flex;flex-direction:row;flex-wrap:wrap;margin:1em;";
        lobbies.innerText = "Loading lobbies...";

        //guildContainer.appendChild(header);
        guildContainer.appendChild(lobbies);
        guildLobbies.appendChild(guildContainer);
    });
}

// called by the mutation observer in patcher.js as soon as the update tab is initialized
async function initLobbyTab(patcher = false) {
    await getLoginPlayer();
    await buildGuildContainer();

    let tab = document.querySelector(".informationTabs").parentElement;
    tab.style.width = "100%";

    let newPalantir = document.createElement("div");
    newPalantir.appendChild(header);
    newPalantir.appendChild(guildLobbies);

    // if initiated by patcher, show loading stuff
    if (patcher) {
        newPalantir.id = "palantir";
        tab.insertBefore(newPalantir, tab.firstChild);
    }

    for (let g of JSON.parse(localStorage.member).Guilds) {
        await loadLobbies(g.ObserveToken, g.GuildID, newPalantir, g.GuildName);
        //if (error) return;
    }

    // if not, show only when everything is loaded (after await)
    if (!patcher) {
        let palantir = document.querySelector("#palantir");
        if (palantir) palantir.innerHTML = "";
        else {
            palantir = document.createElement("div");
            palantir.id = "palantir";
            tab.insertBefore(palantir, tab.firstChild);
        }
        palantir.innerHTML = newPalantir.innerHTML;
    }

    if (localStorage.member == "" || JSON.parse(localStorage.member).Guilds.length < 1) {
        palantir.querySelector(".updateInfo").innerText = "No discord server verified. \nCheck out the extension popup!";
    }

    document.querySelector("body").dispatchEvent(new Event("lobbiesLoaded"));
    loaded = true;
}

var loaded = false;

// asnc function which loads the lobbies for a guild from the orthanc server
async function loadLobbies(observeToken, guildID, container, guildName) {
    let state = await fetch('https://www.tobeh.host/Orthanc/status/', {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: "observeToken=" + observeToken + "&member=" + encodeURIComponent(localStorage.member)
    });
    let response = await state.text();
    console.log(response);
    response = JSON.parse(response);
    if (response.Status.includes("Unauthorized") || response.Verify.Valid == false) {
        container.querySelector("#lobbies" + guildID).innerHTML = "Error retrieving data for " + guildName + " :( ";
        error = true;
        return;
    }
    error = false;
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
        lobbyButton.textContent = response.Verify.AuthGuildName + " #" + idData[0] + (l.Private ? " [Private]" : "");
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
            //lobbyButton.textContent += " Escape -> Cancel";
            lobbyButton.classList.remove("btn-success");
            lobbyButton.classList.add("btn-warning");
        }
        container.querySelector("#lobbies" + response.Verify.AuthGuildID).appendChild(lobbyButton);
    });

    if (container.querySelector("#lobbies" + response.Verify.AuthGuildID).children.length < 1) {
        container.querySelector("#lobbies" + response.Verify.AuthGuildID).remove();
        container.querySelector("#cont" + response.Verify.AuthGuildID).innerHTML = "<div style='margin:1em' class='btn btn-primary'> No lobbies on " + response.Verify.AuthGuildName + " :( </div>";
    }

}