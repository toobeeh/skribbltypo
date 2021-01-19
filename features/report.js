// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Initiates and manages report to orthanc
// depend on: genericfunctions.js
let Report = {
	//Player object
	Player: function(Name, Score, Drawing, Sender, ID, LobbyPlayerID) {
		this.Name = Name;
		this.Score = Score;
		this.Drawing = Drawing;
		this.Sender = Sender;
		this.ID = ID;
		this.LobbyPlayerID = LobbyPlayerID;
	},
	//playerstatus object
	PlayerStatus: function (PlayerMember, Status, LobbyID, LobbyPlayerID) {
		this.PlayerMember = PlayerMember;
		this.Status = Status;
		this.LobbyID = LobbyID;
		this.LobbyPlayerID = LobbyPlayerID;
	},
	// Lobby object
	Lobby: function(ID, Round, GuildID, Private, Link, Host, ObserveToken, Players, Kicked, Language, Key, Description) {
		this.ID = ID;
		this.Round = Round;
		this.GuildID = GuildID;
		this.Private = Private;
		this.Link = Link;
		this.Host = Host;
		this.ObserveToken = ObserveToken;
		this.Players = Players;
		this.Kicked = Kicked;
		this.Language = Language;
		this.Key = Key;
		this.Description = Description;
	},
	// Guild object
	Guild: function(GuildID, GuildName, ObserveToken) {
		this.GuildID = GuildID;
		this.GuildName = GuildName;
		this.ObserveToken = ObserveToken;
	},
	sessionID: sessionStorage.sessionID ? sessionStorage.sessionID : sessionStorage.sessionID = Math.floor(Math.random() * 100000000),
	lobby: undefined,
	nextReport: undefined,
	senderPlayer: undefined,
	userAllow: false,
	waiting: false,
	searching: false,
	playing: false,
	LobbyKey: "",
	lobbyID: "",
	loginName: "",
	descriptionSet: false,
	updateLobbyID: async (key, id = "", desc = "") => {
		// gets a lobby id by key or updates a id's key
		let state = await fetch('https://www.tobeh.host/Orthanc/idprovider/', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: "member=" + encodeURIComponent(localStorage.member) + "&lobbyKey=" + key + (id != "" ? "&lobbyID=" + id : "") + (desc != "" ? "&description=" + desc : "")
		});
		let response = await state.text();
		return JSON.parse(response);
	},
	getLobbyPlayers: () => {
		// get all players in the current lobby; returns player array
		let players = QSA("#containerGamePlayers .player");
		let lobbyPlayers = [];
		players.forEach((p) => {
			if (p.id != "gamePlayerDummy") {
				let player = new Report.Player();
				player.Sender = p.querySelector(".name").textContent.includes(Report.loginName + " (You)");
				player.Name = p.querySelector(".name").textContent.replace("(You)", "").trim();
				player.Score = p.querySelector(".score").textContent.replace("Points: ", "").trim();
				player.Drawing = p.querySelector(".drawing") ? p.querySelector(".drawing").style.display != "none" : false;
				player.LobbyPlayerID = p.id.replace("player", "").trim();
				if (player.Sender) {
					player.ID = JSON.parse(localStorage.member).UserID;
					Report.senderPlayer = player;
				}
				lobbyPlayers.push(player);
			}
		});
		return lobbyPlayers;
	},
	initLobby: async () => {
		// create lobby object and set constant values
		let lobby = new Report.Lobby();
		lobby.Host = window.location.hostname;
		lobby.Players = Report.getLobbyPlayers();
		lobby.Round = QS("#round").innerHTML[6];
		lobby.Private = false;
		QSA("#containerGamePlayers .player .owner").forEach((o) => {
			if (o.style.display != "none") lobby.Private = true;
		});
		lobby.Link = lobby.Private ? QS("#invite").value : "";
		lobby.Key = Report.generateLobbyKey(lobby.Private);
		let idResponse = await Report.updateLobbyID(lobby.Key, "", lobby.Private ? QS("#lobbyDesc").value.trim() : "");
		lobby.ID = idResponse.Lobby.ID;
		lobby.Description = idResponse.Lobby.Description;
		Report.lobbyID = lobby.ID;
		lobby.Language = lobby.Private ? QS("#lobbySetLanguage").value : QS("#loginLanguage").value;
		Report.lobby = lobby;
	},
	generateLobbyKey: (private) => {
		// generate pseudo-unique lobby id based on first player and languge details
		if (private) return QS("#invite").value;
		let players = QSA("#containerGamePlayers .player");
		let playernum = players[0].id.replace("player", "").trim();
		let name = players[0].querySelector(".name").textContent.replace("(You)", "").trim();
		let namenum = "";
		for (let i = 0; i < name.length && i < 5; i++) namenum += name.charCodeAt(i).toString();
		let lang = document.querySelector("#loginLanguage").value;
		let langnum = "";
		for (let i = 0; i < lang.length && i < 5; i++) langnum += lang.charCodeAt(i).toString();
		return playernum + "-" + namenum + "-" + langnum;
	},
	reportLobby: async () => {
		// report player lobby
		if (!Report.lobby) await Report.initLobby();
		else {
			// update lobby key, description and players
			let updatedKey = Report.generateLobbyKey(Report.lobby.Private);
			if (Report.lobby.Key != updatedKey || Report.lobby.Private && !Report.descriptionSet && QS("#screenLobby").style.display == "none") {
				let idResponse = await Report.updateLobbyID(updatedKey, Report.lobby.ID, Report.lobby.Private ? QS("#lobbyDesc").value.trim() : "");
				let lobby = idResponse.Lobby;
				if (lobby == undefined) return;
				if (lobby.Description != "") Report.descriptionSet = true;
				Report.lobby.Key = lobby.Key
				Report.lobby.ID = lobby.ID;
			}
			Report.lobby.Players = Report.getLobbyPlayers();
			Report.lobby.Round = document.querySelector("#round").innerHTML[6];
		}
		clearTimeout(Report.nextReport);
		// send lobby report for each verified guild
		for (let guild of JSON.parse(localStorage.member).Guilds) {
			let guildLobby = { ...Report.lobby };
			guildLobby.GuildID = guild.GuildID;
			guildLobby.ObserveToken = guild.ObserveToken;
			let state = await fetch('https://www.tobeh.host/Orthanc/report/', {
				method: 'POST',
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				body: "lobbyReport=" + encodeURIComponent(JSON.stringify(guildLobby)) + "&member=" + encodeURIComponent(localStorage.member)
			}
			);
			state = await state.text();
		}
		if (localStorage.userAllow == "true") Report.nextReport = setTimeout(Report.trigger, 4000);
	},
	reportPlayerStatus: async (status, lobbyID, lobbyPlayerID) => {
		// report player status
		let playerStatus = new Report.PlayerStatus();
		playerStatus.PlayerMember = JSON.parse(localStorage.member);
		if (status == "searching") {
			playerStatus.PlayerMember.UserName = Report.loginName;
		}
		else if (status == "waiting" && sessionStorage.lastLoginName && sessionStorage.lastLoginName != "")
			playerStatus.PlayerMember.UserName = sessionStorage.lastLoginName;
		playerStatus.Status = status;
		playerStatus.LobbyID = lobbyID;
		playerStatus.LobbyPlayerID = lobbyPlayerID;

		let state = await fetch('https://www.tobeh.host/Orthanc/memberstate/', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: "playerStatus=" + JSON.stringify(playerStatus)  + "&session=" + Report.sessionID
		});
	},
	reportAsSearching: () => {
		// report status as searching      
		Report.searching = true;
		Report.waiting = false;
		Report.playing = false;
		Report.trigger();
	},
	reportAsPlaying: () => {
		Report.playing = true;
		Report.searching = false;
		Report.waiting = false;
		Report.trigger();
	},
	trigger: async () => {
		// report current playing state to orthanc
		if (localStorage.member == ""
			|| QS("#popupSearch").parentElement.style.display == "none"
			&& QS("#screenLobby").style.display == "none"
			&& QS("#screenGame").style.display == "none") {
			clearTimeout(Report.nextReport);
			return;
		}
		if (!(Report.playing || Report.searching || Report.waiting) || localStorage.userAllow != "true") return;
		if (Report.searching) {
			await Report.reportPlayerStatus("searching",null,null );
		}
		else if (Report.waiting) {
			await Report.reportPlayerStatus("waiting", QS("#inputName").value, null);
			setTimeout(Report.trigger, 3000);
		}
		else if (Report.playing) {
			await Report.reportLobby();
			await Report.reportPlayerStatus("playing", Report.lobbyID, Report.senderPlayer.LobbyPlayerID);
		}
	},
	initEvents: () => {
		// get user name from game.js -> prevents modification from DOM
		document.body.addEventListener("loginData", function (d) {
			Report.loginName = d.detail.name.trim();
			sessionStorage.lastLoginName = Report.loginName;
		});
		// trigger on player mutations
		(new MutationObserver(Report.trigger)).observe(QS(".containerGame #containerGamePlayers"), { attributes: true, childList: true });
	}
}