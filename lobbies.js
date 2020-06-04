(() => {
  // sexy
})();

var guildLobbies;
var header;

async function getLoginPlayer() {
  let loginResponse = await (await fetch('https://www.tobeh.host/Orthanc/login/', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: "login=" + localStorage.login
  }
  )).json();
  if (!loginResponse.Valid) {
    localStorage.member = null;
  }
  else localStorage.member = JSON.stringify(loginResponse.Member);
}

async function buildGuildContainer() {

  header = document.createElement("h3");
  header.innerHTML = "<p style='font-weight:700' ; margin-bottom: 0.5em; color:black !important;> Discord Lobbies </p>";

  guildLobbies = document.createElement("div");
  guildLobbies.className = "updateInfo";

  let guilds = JSON.parse(localStorage.member).Guilds;

  guilds.forEach((g) => {
    let guildContainer = document.createElement("div");
    guildContainer.id = "cont" + g.GuildID ;
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

async function initLobbyTab() {
  await getLoginPlayer();
  await buildGuildContainer();

  // remove news, about etc and replace with lobby view
  let tab = document.querySelector(".informationTabs").parentElement;
  tab.style.width = "100%";
  tab.insertBefore(guildLobbies, tab.firstChild);
  tab.insertBefore(header, guildLobbies);


  JSON.parse(localStorage.member).Guilds.forEach((g => {
    loadLobbies(g.ObserveToken);
  }));
}

async function loadLobbies(observeToken) {
  let state = await fetch('https://www.tobeh.host/Orthanc/status/', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: "observeToken=" + observeToken + "&member=" + localStorage.member
  });
  let lobbies = await state.json();
  if (lobbies.Status.includes("Unauthorized") || lobbies.Verify.Valid == false) {
    document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).innerHTML = "Error retrieving data from " + lobbies.Verify.AuthGuildName+ " :(";
    return;
  }
  document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).innerHTML = "";

  lobbies.Lobbies.forEach((l) => {

    let lobbyButton = document.createElement("div");
    lobbyButton.classList = "btn btn-success";
    lobbyButton.style = "margin:0.2em";
    lobbyButton.textContent = lobbies.Verify.AuthGuildName + " #" + l.ID;
    // search event goes here

    document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).appendChild(lobbyButton);
  });

  if (document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).children.length < 1) {
    document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).remove();
    document.querySelector("#cont" + lobbies.Verify.AuthGuildID ).textContent = lobbies.Verify.AuthGuildName + " has no active lobby.";
  }

}