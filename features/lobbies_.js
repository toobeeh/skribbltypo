// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, socket.js
const lobbies = {
	userAllow: localStorage.palantir == "true",
	inGame: false,
	joined: false,
	lobbyContainer: null,
	searchData: { searching: false, check: null, proceed: null, ended: null },
	lobbyProperties: {
		Round: 1,
		Private: true,
		Link: "",
		Host: "skribbl.io",
		Language: "",
		Players: [],
		Key: "",
		Description: ""
	},
	getLobbyPlayers: () => {
		let players = [];
		[...QSA("#game-players .player")].forEach(player => {
			players.push({
				Name: player.querySelector(".name").textContent.replace("(You)", "").trim(),
				Score: player.querySelector(".score").textContent.replace("points", "").trim(),
				Drawing: (player.querySelector(".drawing").style.display != "none"),
				Sender: player.querySelector(".name").textContent.includes("(You)"),
				LobbyPlayerID: player.getAttribute("playerid")
			});
		});
		return players;
	},
	getTriggerElements: () => {
		return [QS(".round-current"), QS("#game-players .list"), [...QSA(".avatar .drawing")]].flat();
	},
	initLobbyContainer: () => {
		let lobbies = elemFromString("<div></div>");
		return lobbies;
	},
	setLobbies: (lobbies) => {
		if (!lobbies.lobbyContainer) return;
		if (!socket.authenticated == true) {
			lobbies.lobbyContainer.innerHTML = "Didn't connect to Palantir. <br>Read the manual on the <a style='font-weight:700; color:black;' href='https://typo.rip/#palantir'>typo website</a>.<br>Join the typo discord server to try it out!<br>";
			return;
		}
		lobbies.lobbyContainer.innerHTML = "";
		lobbies.forEach(guild => {
			let name = socket.data.user.member.Guilds.find(memberGuild => memberGuild.GuildID.slice(0,-2) == guild.guildID.slice(0,-2)).GuildName;	
		});
	},
	init: () => {
		lobbies.inGame = false; // as soon as player is in a lobby
		lobbies.joined = false; // as soon as socket has joined a lobby
		// send reports when lobby changes
		const lobbyObserver = new MutationObserver(async () => {
			if (lobbies.inGame) {
				// observe new matching elements
				lobbies.getTriggerElements().forEach(elem => lobbyObserver.observe(elem, { characterData: true, childList: true, subtree: true, attributes: true}));
				lobbies.lobbyProperties.Players = lobbies.getLobbyPlayers();
				lobbies.lobbyProperties.Round = QS(".round-current").textContent.trim();
				socket.clientData.lobbyKey = lobbies.lobbyProperties.Key;
				let description = QS(".icon.owner.visible") ? (QS("#lobbyDesc") && QS("#lobbyDesc").value ? QS("#lobbyDesc").value : '') : "";
				if (lobbies.joined && lobbies.userAllow) { // report lobby if joined
					await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key, description);
				}
			}
		});
		// init lobby container
		lobbies.lobbyContainer = lobbies.initLobbyContainer();
		// on lobby join
		document.addEventListener("lobbyConnected", async (e) => {
			lobbies.getTriggerElements().forEach(elem => lobbyObserver.observe(elem, { characterData: true, childList: true, subtree: true, attributes: true }));
			lobbies.lobbyProperties.Language = e.detail.settings[1];
			lobbies.lobbyProperties.Private = e.detail.owner >= 0 ? true : false;
			lobbies.lobbyProperties.Link = "https://skribbl.io/?" + e.detail.id;
			lobbies.lobbyProperties.Key = e.detail.id;
			lobbies.lobbyProperties.Round = 0;
			if (!lobbies.inGame) {
				// get own name
				sessionStorage.lastLoginName = socket.clientData.playerName = e.detail.users[e.detail.users.length-1].name;
				lobbies.inGame = true;
				// get initialplayers for search check and report
				lobbies.lobbyProperties.Players = [];
				e.detail.users.forEach(p => {
					let add = {
						Name: p.name,
						Score: p.score,
						Drawing: false,
						LobbyPlayerID: p.id,
						Sender: false
					};
					if (add.Name == socket.clientData.playerName) add.Sender = true; 
					lobbies.lobbyProperties.Players.push(add);
				});
				lobbies.lobbyProperties.Key = e.detail.id;
				// set as searching with timeout for report
				if (lobbies.userAllow && !lobbies.joined) {
					await socket.joinLobby(lobbies.lobbyProperties.Key);
					await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key);
					lobbies.joined = true;
				}
			}
		});
		// on lobby leave / login show
		document.addEventListener("leftLobby", async () => {
			lobbies.inGame = false;
			if (QS("#restrictLobby")) QS("#restrictLobby").style.display = "none";
			if (lobbies.joined) {
				await socket.leaveLobby();
				lobbies.joined = false;
			}
		});
	}

}