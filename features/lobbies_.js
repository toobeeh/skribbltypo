// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates lobby search buttons and lobby search events
// depends on: genericfunctions.js, socket.js
const lobbies_ = {
	userAllow: localStorage.userAllow == "true",
	inGame: false,
	joined: false,
	lobbyContainer: null,
	searchData: { searching: false, check: null, proceed: null, ended: null },
	lobbyProperties: {
		Round: 1,
		Private: false,
		Link: "",
		Host: "skribbl.io",
		Language: "",
		Players: [],
		Key: "",
		Description: ""
	},
	getLobbyKey: () => {
		// generate pseudo-unique lobby id based on first player and languge details
		if (lobbies_.lobbyProperties.Private) return lobbies_.lobbyProperties.Link;
		let playernum = lobbies_.lobbyProperties.Players[0].LobbyPlayerID;
		let name = lobbies_.lobbyProperties.Players[0].Name;
		let namenum = "";
		for (let i = 0; i < name.length && i < 5; i++) namenum += name.charCodeAt(i).toString();
		let lang = lobbies_.lobbyProperties.Language;
		let langnum = "";
		for (let i = 0; i < lang.length && i < 5; i++) langnum += lang.charCodeAt(i).toString();
		return playernum + "-" + namenum + "-" + langnum;
	},
	getLobbyPlayers: () => {
		let players = [];
		[...QSA(".player")].filter(player => player.id.includes("player")).forEach(player => {
			players.push({
				Name: player.querySelector(".name").textContent.replace("(You)", "").trim(),
				Score: player.querySelector(".score").textContent.replace("Points:", "").trim(),
				Drawing: (player.querySelector(".drawing").style.display != "none"),
				Sender: player.querySelector(".name").textContent.includes("(You)"),
				LobbyPlayerID: player.id.replace("player", "").trim()
			});
		});
		return players;
	},
	getTriggerElements: () => {
		return [QS("#round"), QS("#containerGamePlayers"), [...QSA(".drawing")]].flat().filter(element=>element);
	},
	initLobbyContainer: () => {
		let panel = document.querySelector(".login-side-right");
		let container = document.createElement("div");
		container.id = "palantirLobbies";
		container.style.cssText = "padding: 0.5em; width:100%;";
		container.insertAdjacentHTML("afterbegin", `
		<h3>
			<p style="font-weight: 700; margin-bottom: 0; color: black"> Discord Lobbies </p>
		</h3>`
		);
		let lobbies = document.createElement("div");
		lobbies.innerHTML = "Connecting to Palantir...";
		lobbies.classList.add("updateInfo");
		container.appendChild(lobbies);
		panel.appendChild(container);
		panel.classList.add("loginPanelContent");
		panel.style.cssText = "height: fit-content; width: 400px; flex: 0 1 auto;";
		return lobbies;
	},
	setLobbies: (lobbies) => {
		if (!lobbies_.lobbyContainer) return;
		if (!socket.authenticated == true) {
			lobbies_.lobbyContainer.innerHTML = "Didn't connect to Palantir. <br>Read the manual on the <a style='font-weight:700; color:black;' href='https://typo.rip/#palantir'>typo website</a>.<br>Join the typo discord server to try it out!<br>";
			return;
		}
		lobbies_.lobbyContainer.innerHTML = "";
		lobbies.forEach(guild => {
			let name = socket.data.user.member.Guilds.find(memberGuild => memberGuild.GuildID.slice(0,-2) == guild.guildID.slice(0,-2)).GuildName;
			let guildContainer = document.createElement("div");
			guildContainer.id = "guildLobbies" + guild.guildID;
			guildContainer.style.cssText = "display:flex; flex-flow:row wrap; margin:1em";
			guild.guildLobbies.forEach(lobby => {
				let lobbyButton = document.createElement("div");
				lobbyButton.id = "lobby" + lobby.ID.split(":")[1];
				lobbyButton.setAttribute("playercount", lobby.Players);
				lobbyButton.setAttribute("key", lobby.Key);
				lobbyButton.innerText = name + " #" + lobby.ID.split(":")[0] + (lobby.Private? (lobby.Host == "skribbl.io" ? " [Custom]" : " [Sketchful]") : "");
				lobbyButton.classList.add("btn", "btn-success", "lobbySearchBtn");
				lobbyButton.style.margin = "0.15em";
				// add search logic
				lobbyButton.addEventListener("click", () => {
					if (lobby.Private) {
						if (lobby.Host == "sketchful.io") window.location.href = lobby.Link;
						else {
							sessionStorage.joinCustom = lobby.Link.substr(lobby.Link.indexOf("?") + 1);
							document.body.dispatchEvent(newCustomEvent("joinLobby"));
						}
						return;
					}
					if (lobbies_.searchData.searching) return;
					// set proper language
					document.querySelector("#loginLanguage").selectedIndex =
						[...document.querySelectorAll("#loginLanguage option")].findIndex(o => o.innerText == lobby.Language);
					// create modal
					let modalCont = elemFromString("<div style='text-align:center'><h4>" + lobbyButton.innerText + "</h4><h4 id='hits'></h4><span id='skippedPlayers'>Skipped:<br></span><br><h4>Click anywhere to cancel</h4><div>");
					let hits = 1;
					let skippedPlayers = [];
					let checkInterval = null;
					let modal = new Modal(modalCont,() => {
							clearInterval(checkInterval);
							lobbies_.searchData.searching = false;
							let button = QS("#" + lobbyButton.id);
							if (button && button.classList.contains("btn-danger")) {
								button.classList.remove("btn-danger");
								button.classList.add("btn-success");
								button.innerText = button.innerText.replace(" (waiting...)","");
							}
						}, "Searching for a discord lobby:", "40vw", "15em");
					lobbies_.startSearch(() => { 
						modalCont.querySelector("#hits").innerText = hits++ + " Lobby Hits";
						lobbies_.lobbyProperties.Players.forEach(p => {
							if (skippedPlayers.indexOf(p.Name) < 0 && p.Name != socket.clientData.playerName) {
								skippedPlayers.push(p.Name);
								modalCont.querySelector("#skippedPlayers").innerHTML += " [" + p.Name + "] <wbr>";
							}
						});
						return lobbies_.getLobbyKey(lobby.Private) == QS("#" + lobbyButton.id).getAttribute("key"); // lobby key is target key?
					}, () => {
						leaveLobby();
						let deadHits = 0;
						let checkCallback = () => {
							let button = QS("#" + lobbyButton.id);
							if (!button) { // lobby exists?
								if (deadHits++ > 10) {
									modal.close();
									new Modal(false, () => { }, "This lobby doesn't exist anymore :(");
									clearInterval(checkInterval);
								}
							}
							else { 
								deadHits = 0;
								if (Number(button.getAttribute("playercount")) > 7) { // lobby is full?
									leaveLobby(false);
									if (button.classList.contains("btn-success")) {
										button.classList.remove("btn-success");
										button.classList.add("btn-danger");
										button.innerText += " (waiting...)";
										modal.setNewTitle("Waiting for free slot...");
										if (lobbies_.userAllow) socket.searchLobby(true);
									}
								}
								else {
									clearInterval(checkInterval); // go for it!
									document.body.dispatchEvent(newCustomEvent("joinLobby"));
									modal.setNewTitle("Searching for a discord lobby:");
								}
							}
						}
						checkInterval = setInterval(checkCallback, 500);
						checkCallback();
						
					}, () => { // close modal if search finished
						modal.close();
					});
					document.body.dispatchEvent(newCustomEvent("joinLobby"));
				});
				guildContainer.appendChild(lobbyButton);
			});
			if (guildContainer.children.length <= 0) {
				guildContainer.insertAdjacentHTML("afterbegin", "<div class='btn btn-primary'> No lobbies on " + name + " :(</div>");
			}
			lobbies_.lobbyContainer.appendChild(guildContainer);			
		});
	},
	startSearch: (check, proceed, ended = () => { }) => {
		if (lobbies_.searchData.searching) return;
		lobbies_.searchData.searching = true;
		lobbies_.searchData.check = check;
		lobbies_.searchData.proceed = proceed;
		lobbies_.searchData.ended = ended;
	},
	init: () => {
		lobbies_.inGame = false; // as soon as player is in a lobby
		lobbies_.joined = false; // as soon as socket has joined a lobby
		// send reports when lobby changes
		const lobbyObserver = new MutationObserver(async () => {
			if (lobbies_.inGame) {
				// observe new matching elements
				lobbies_.getTriggerElements().forEach(elem => lobbyObserver.observe(elem, { childList: true, attributes: true }));
				lobbies_.lobbyProperties.Players = lobbies_.getLobbyPlayers();
				lobbies_.lobbyProperties.Round = QS("#round").textContent.trim().split(" ")[1];
				lobbies_.lobbyProperties.Key = lobbies_.getLobbyKey(lobbies_.lobbyProperties.Private);
				socket.clientData.lobbyKey = lobbies_.lobbyProperties.Key;
				let description = lobbies_.lobbyProperties.Private ? (QS("#lobbyDesc").value ? QS("#lobbyDesc").value : '') : "";
				if (lobbies_.joined && lobbies_.userAllow) { // report lobby if joined
					await socket.setLobby(lobbies_.lobbyProperties, lobbies_.lobbyProperties.Key, description);
				}
			}
		});
		// init lobby container
		lobbies_.lobbyContainer = lobbies_.initLobbyContainer();
		// on lobby join
		document.addEventListener("lobbyConnected", async (e) => {
			sessionStorage.removeItem("joinCustom");
			lobbies_.getTriggerElements().forEach(elem => lobbyObserver.observe(elem, { characterData: true, childList: true, subtree: true, attributes: true }));
			lobbies_.lobbyProperties.Language = e.detail.language.charAt(0).toUpperCase() + e.detail.language.slice(1);
			lobbies_.lobbyProperties.Private = e.detail.ownerID > -1 ? true : false;
			lobbies_.lobbyProperties.Link = e.detail.key != "" ? "https://skribbl.io/?" + e.detail.key : "";
			lobbies_.lobbyProperties.Round = e.detail.round;
			if (!lobbies_.inGame) {
				// get own name
				sessionStorage.lastLoginName = socket.clientData.playerName = e.detail.players[e.detail.players.length-1].name;
				lobbies_.inGame = true;
				// get initialplayers for search check and report
				lobbies_.lobbyProperties.Players = [];
				e.detail.players.forEach(p => {
					let add = {
						Name: p.name,
						Score: p.score,
						Drawing: false,
						LobbyPlayerID: p.id,
						Sender: false
					};
					if (add.Name == socket.clientData.playerName) add.Sender = true; // for some fkng weird reasons
					lobbies_.lobbyProperties.Players.push(add);
				});
				lobbies_.lobbyProperties.Key = lobbies_.getLobbyKey(lobbies_.lobbyProperties.Private);
				// set as searching with timeout for report
				let setPlaying = null;
				if (lobbies_.userAllow && !lobbies_.joined) {
					await socket.searchLobby();
					setPlaying = setTimeout(async () => {
						if (!lobbies_.inGame) return;
						await socket.joinLobby(lobbies_.lobbyProperties.Key);
						await socket.setLobby(lobbies_.lobbyProperties, lobbies_.lobbyProperties.Key);
						lobbies_.joined = true;
					}, 7000);
				}
				// apply search logic
				if (lobbies_.searchData.searching && !lobbies_.searchData.check()) {
					if (setPlaying) {
						clearTimeout(setPlaying);
						setPlaying = null;
					}
					lobbies_.searchData.proceed();
				}
				else if (lobbies_.searchData.searching) {
					lobbies_.searchData.searching = false;
					lobbies_.searchData.ended();
					if (Notification.permission == "granted" && document.hidden) {
						let notif = new Notification("Lobby found!", { body: "Yee! Check out skribbl", icon: "/res/crown.gif" });
						notif.onclick = () => window.focus();
					}
				}
			}
		});
		// on lobby leave / login show
		document.addEventListener("leftGame", async () => {
			lobbies_.inGame = false;
			QS("#restrictLobby").style.display = "none";
			if (lobbies_.joined) {
				await socket.leaveLobby();
				lobbies_.joined = false;
			}
		});
	}

}