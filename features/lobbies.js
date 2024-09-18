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
				Name: player.querySelector(".player-name").textContent.replace("(You)", "").trim(),
				Score: player.querySelector(".player-score").textContent.replace("points", "").trim(),
				Drawing: (player.querySelector(".drawing").style.display != "none"),
				Sender: player.querySelector(".player-name").textContent.includes("(You)"),
				LobbyPlayerID: player.getAttribute("playerid")
			});
		});
		return players;
	},
	getTriggerElements: () => {
		return [QS("#game-round"), QS("#game-players .players-list"), [...QSA(".avatar .drawing")]].flat();
	},
	setLobbyContainer: () => {
		// get online players with lobby links
		let onlinePlayers = [];
		socket.data.lobbyLinks.forEach(
			invite => {
				if(!onlinePlayers.some(added => added.link === invite.link && added.username === invite.username)) onlinePlayers.push(invite);
			});
		let playerButtons = "";
		onlinePlayers.forEach(player => playerButtons += `<button data-typo-tooltip="${player.slotAvailable} slots" link="${player.link}" slotAvailable=${player.slotAvailable} class="flatUI green min air" style="margin: .5em">${player.username}</button>`);
		if (playerButtons == "") playerButtons = "<span>None of your friends are online :(</span>";
		let container = elemFromString("<div id='discordLobbies'></div>");
		if (socket.sck?.connected) {
			if (socket.authenticated) container.innerHTML = playerButtons;
			else {
				container.innerHTML = `<h3>No palantir account connected.</h3><br><button class="flatUI air min blue">Log in with Palantir</button>`;
				container.querySelector("button")?.addEventListener("click", login);
			}
		}
		else {
			container.innerHTML = "<bounceload></bounceload> Connecting to Typo server...";
		}
		/*document.dispatchEvent(new Event("addTypoTooltips"));*/
		container.addEventListener("click", e => {
			let link = e.target.getAttribute("link");
			let slotAvailable = e.target.getAttribute("slotAvailable");
			let name = e.target.innerText;
			if (link) {
				if (slotAvailable) document.dispatchEvent(newCustomEvent("joinLobby", { detail: link.split("?")[1] }));
				else {

					let modal = new Modal(elemFromString(`<div><img src="https://c.tenor.com/fAQuR0VNdDIAAAAC/cat-cute.gif"></div>`), () => {
						if (!search.searchData.searching) return;
						search.searchData.ended();
					}, "Waiting for a free slot to play with " + name, "40vw", "15em");

					search.setSearch(() => {
						if (!QS("[link=" + link + "]")) {
							search.searchData.ended();
							new Toast("The lobby has ended :(");
						}
						console.log(Number(QS("[link=" + link + "]").getAttribute("slotAvailable")));
						let success = Number(QS("[link=" + link + "]").getAttribute("slotAvailable")) < 1;
						if (success) document.dispatchEvent(newCustomEvent("joinLobby", { detail: link }));
						return success;
					}, async () => {
					}, () => {
						search.searchData = {
							searching: false,
							check: undefined, proceed: undefined, ended: undefined
						};
						modal.close();
					});

					let interval = setInterval(() => {
						if (!search.searchData.searching) clearInterval(interval);
						if (search.searchData.check()) {
							search.searchData.ended();
							clearInterval(interval);
						}
					}, 500);
				}
			}
			else new Toast("Lobby access is restricted.");
		});
		QS("#discordLobbies").replaceWith(container);
	},
	init: () => {
		lobbies.inGame = false; // as soon as player is in a lobby
		lobbies.joined = false; // as soon as socket has joined a lobby
		// send reports when lobby changes
		const lobbyObserver = new MutationObserver(async () => {
			if (lobbies.inGame) {
				lobbies.lobbyProperties.Players = lobbies.getLobbyPlayers();
				lobbies.lobbyProperties.Round = parseInt(QS("#game-round").textContent.trim()[6]);
				if (!lobbies.lobbyProperties.Round) lobbies.lobbyProperties.Round = 0;
				socket.clientData.lobbyKey = lobbies.lobbyProperties.Key;
				let description = QS(".icon.owner.visible") ? (QS("#lobbyDesc") && QS("#lobbyDesc").value ? QS("#lobbyDesc").value : '') : "";
				if (lobbies.joined && lobbies.userAllow) { // report lobby if joined
					await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key, description);
				}
			}
		});

		// init lobby container
		lobbies.lobbyContainer = lobbies.setLobbyContainer();
		// on lobby join
		document.addEventListener("lobbyConnected", async (e) => {

			lobbyObserver.disconnect();

			lobbyObserver.observe(QS("#game-round"), { characterData: true, childList: false, subtree: false, attributes: false });
			lobbyObserver.observe(QS("#game-players .players-list"), { characterData: true, childList: true, subtree: false, attributes: false });
			lobbyObserver.observe(QS("#game-word .description"), { characterData: false, childList: false, subtree: false, attributes: true });
			// lobbies.getTriggerElements().forEach(elem => lobbyObserver.observe(elem, { characterData: true, childList: true, subtree: true, attributes: true }));

			// fill in basic lobby props 
			lobbies.lobbyProperties.Language = QS("#home div.panel > div.container-name-lang > select option[value = '" + e.detail.settings[0] + "']").innerText;
			lobbies.lobbyProperties.Private = e.detail.owner >= 0 ? true : false;
			console.log(e.detail.id);
			lobbies.lobbyProperties.Link = window.location.origin + "?" + e.detail.id;

			// generate lobby key by hashed link
			lobbies.lobbyProperties.Key = genMatchHash(e.detail.id);
			lobbies.lobbyProperties.Round = e.detail.round + 1;

			// get own name
			sessionStorage.lastLoginName = socket.clientData.playerName = e.detail.users[e.detail.users.length - 1].name;
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


			// check if lobby search is running and criteria is met
			if (search.searchData.searching) {
				if (search.searchData.check()) {
					search.searchData.ended();
					QS("#searchRules")?.remove();
				}
				else {
					search.searchData.proceed();
					return;
				}
			}

			// set as searching with timeout for report
			if (lobbies.userAllow && !lobbies.joined && socket.authenticated == true) {
				await socket.joinLobby(lobbies.lobbyProperties.Key);
				await socket.setLobby(lobbies.lobbyProperties, lobbies.lobbyProperties.Key);
				lobbies.joined = true;
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