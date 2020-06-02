(() => {
  // sexy
})();

var guildLobbies;
var header;
(() => {

  header = document.createElement("h3");
  header.innerHTML = "<p style='font-weight:700' ; margin-bottom: 0.5em; color:black !important;> Discord Lobbies </p>";

  guildLobbies = document.createElement("div");
  guildLobbies.className = "updateInfo";
  let guilds = JSON.parse(localStorage.guilds);

  guilds.forEach((g) => {
    let guildContainer = document.createElement("div");
    guildContainer.id = g.guildID + "cont";
    guildContainer.className = "guildContainer";

    let header = document.createElement("div");
    header.classList = "btn btn-primary btn -block";
    header.style = "background-color: #337ab7 !important;margin-left:.5em; padding:0.5em; margin-top:0.5em;";
    header.innerText = g.guildName;

    let lobbies = document.createElement("div");
    lobbies.id = "lobbies" + g.guildID;
    lobbies.style = "display:flex;flex-direction:row;flex-wrap:wrap;margin:1em;";
    lobbies.innerText = "Loading lobbies...";

    guildContainer.appendChild(header);
    guildContainer.appendChild(lobbies);
    guildLobbies.appendChild(guildContainer);   
  });

})();

function initLobbyTab() {
  // remove news, about etc and replace with lobby view
  let tab = document.querySelector(".informationTabs").parentElement;
  tab.style.width = "100%";
  tab.insertBefore(guildLobbies, tab.firstChild);
  tab.insertBefore(header, guildLobbies);


  JSON.parse(localStorage.guilds).forEach((g => {
    loadLobbies(g.observeToken);
  }));
}

async function loadLobbies(observeToken) {
  let state = await fetch('https://81.217.227.81/Orthanc/status/', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: "ObserveToken=" + observeToken
  });
  let lobbies = await state.json();
  if (lobbies.Status.includes("Unauthorized") || lobbies.Verify.Valid == false) {
    document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).innerHTML = "Error retrieving data :(";
    return;
  }
  document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).innerHTML = "";

  lobbies.Lobbies.forEach((l) => {

    let lobbyButton = document.createElement("div");
    lobbyButton.classList = "btn btn-success";
    lobbyButton.style = "margin-right:1em";
    lobbyButton.textContent = "Lobby #" + l.ID;
    // search event goes here

    document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).appendChild(lobbyButton);
  });

  if (lobbies.Lobbies.length < 1) document.querySelector("#lobbies" + lobbies.Verify.AuthGuildID).innerHTML = "Atm, noone is playing :(";
}