
var Report = new function ReportObj () {
	//Player object
	this.Player = function(Name, Score, Drawing, Sender, ID, LobbyPlayerID) {
		this.Name = Name;
		this.Score = Score;
		this.Drawing = Drawing;
		this.Sender = Sender;
		this.ID = ID;
		this.LobbyPlayerID = LobbyPlayerID;
	}
	//playerstatus object
	this.PlayerStatus = function (PlayerMember, Status, LobbyID, LobbyPlayerID) {
		this.PlayerMember = PlayerMember;
		this.Status = Status;
		this.LobbyID = LobbyID;
		this.LobbyPlayerID = LobbyPlayerID;
	}
	// Lobby object
	this.Lobby = function(ID, Round, GuildID, Private, Link, Host, ObserveToken, Players, Kicked, Language, Key) {
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
	}
	// Guild object
	this.Guild = function(GuildID, GuildName, ObserveToken) {
		this.GuildID = GuildID;
		this.GuildName = GuildName;
		this.ObserveToken = ObserveToken;
	}

	let self = this;
	this.hits = 0;
	this.reports = 0;
	this.sessionID = sessionStorage.sessionID ? sessionStorage.sessionID : sessionStorage.sessionID = Math.floor(Math.random() * 100000000);
	this.loginName;
	this.guildLobbies = [];
	this.nextReport;
	this.senderPlayer;
	this.userAllow = false;
	this.waiting = false;
	this.searching = false;
	this.playing = false;
	this.prevLobbyKey = "";
	this.lobbyID = "";

	this.updateLobbyID = async function (key, id = "") {
		let state = await fetch('https://www.tobeh.host/Orthanc/idprovider/', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: "member=" + encodeURIComponent(localStorage.member) + "&lobbyKey=" + key + (id != "" ? "&lobbyID="+id : "")
		}
		);
		let response = await state.text();
		console.log("Resp: " + response);
		return JSON.parse(response);
	}

	// func to get all players in the current lobby; returns player array
	this.getLobbyPlayers = function() {
		let players = document.querySelectorAll("#containerGamePlayers .player");
		let lobbyPlayers = [];

		players.forEach((p) => {
			if (p.id != "gamePlayerDummy") {

				let player = new self.Player();
				player.Sender = p.querySelector(".name").textContent.includes(self.loginName + " (You)");
				player.Name = p.querySelector(".name").textContent.replace("(You)", "").trim();
				player.Score = p.querySelector(".score").textContent.replace("Points: ", "").trim();
				player.Drawing = p.querySelector(".drawing") ? p.querySelector(".drawing").style.display != "none" : false;
				player.LobbyPlayerID = p.id.replace("player", "").trim();
				if (player.Sender) {
					player.ID = JSON.parse(localStorage.member).UserID;
					self.senderPlayer = player;
				}

				lobbyPlayers.push(player);
			}
		});
		return lobbyPlayers;
	}

	// create lobby object and set constant values
	this.initLobby = async function() {
		let discordGuilds = JSON.parse(localStorage.member).Guilds;
		for(let g of discordGuilds){
			let lobby = new self.Lobby();
			lobby.ObserveToken = g.ObserveToken;
			lobby.Host = window.location.hostname;
			lobby.Players = self.getLobbyPlayers();
			lobby.GuildID = g.GuildID;
			lobby.Round = document.querySelector("#round").innerHTML[6];
			lobby.Private = false;
			document.querySelectorAll("#containerGamePlayers .player .owner").forEach((o) => {
				if (o.style.display != "none") lobby.Private = true;
			});
			lobby.Link = lobby.Host == "sketchful.io" ? window.location.href : lobby.Private ? document.querySelector("#invite").value : "";
			lobby.Key = self.generateLobbyKey(lobby.Private);
			self.prevLobbyKey = lobby.Key;
			let resp = await self.updateLobbyID(lobby.Key);
			lobby.ID = resp.Lobby.ID;
			self.lobbyID = lobby.ID;
			lobby.Language = lobby.Private ? document.querySelector("#lobbySetLanguage").value : document.querySelector("#loginLanguage").value;
			self.guildLobbies.push(lobby);
		}
	}

	// func to generate pseudo-unique lobby id based on first player and languge details
	this.generateLobbyKey = function(private) {
		let players = document.querySelectorAll("#containerGamePlayers .player");

		let playernum = players[0].id.replace("player", "").trim();
		let name = players[0].querySelector(".name").textContent.replace("(You)", "").trim();
		let namenum = "";
		for (let i = 0, m = name.length; i < m; i++) { namenum += name.charCodeAt(i).toString(); }
		namenum = namenum.substr(0, 5);

		let lang = private ? "0000" : document.querySelector("#loginLanguage").value;
		let langnum = "";
		for (let i = 0, m = lang.length; i < m; i++) { langnum += lang.charCodeAt(i).toString(); }

		return playernum + "-" + namenum + "-" + langnum;
	}

	this.reportLobby = async function() {
		if (self.guildLobbies.length < 1) await self.initLobby();
		else {
			
			for (let g of self.guildLobbies) {
				let actKey = self.generateLobbyKey(g.Private);
				if (self.prevLobbyKey != actKey) {
					let response = await self.updateLobbyID(actKey, g.ID);
					let l = response.Lobby;
					if (l == undefined) return;
					self.prevLobbyKey = l.Key
					self.lobbyID = l.ID;
					g.Key = l.Key;
					g.ID = l.ID;
					self.hits++;
				}
				g.Players = self.getLobbyPlayers();
				g.Round = document.querySelector("#round").innerHTML[6];
			}
		}
		
		clearTimeout(self.nextReport);

		// send lobby report for each verified guild
		for(let g of self.guildLobbies){
			let state = await fetch('https://www.tobeh.host/Orthanc/report/', {
				method: 'POST',
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				body: "lobbyReport=" + encodeURIComponent(JSON.stringify(g)) + "&member=" + encodeURIComponent(localStorage.member)
			}
			);
			state = await state.text();
			console.log(state);
			//console.log("Sent report to guild " + g.GuildName);
			self.reports++;
		}

		if (localStorage.userAllow) self.nextReport = setTimeout(self.trigger, 2);
	}

	this.reportPlayerStatus = async function (status, lobbyID, lobbyPlayerID) {

		let playerStatus = new self.PlayerStatus();
		playerStatus.PlayerMember = JSON.parse(localStorage.member);
		if (status == "searching") playerStatus.PlayerMember.UserName = self.loginName;
		if (status == "waiting" && sessionStorage.lastLoginName && sessionStorage.lastLoginName != "") playerStatus.PlayerMember.UserName = sessionStorage.lastLoginName;
		playerStatus.Status = status;
		playerStatus.LobbyID = lobbyID;
		playerStatus.LobbyPlayerID = lobbyPlayerID;

		let state = await fetch('https://www.tobeh.host/Orthanc/memberstate/', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: "playerStatus=" + JSON.stringify(playerStatus)  + "&session=" + self.sessionID
		});
		state = await state.text();
		;
	}

	// func which gets called if the current state should be reported
	this.trigger = async function () {
		if (localStorage.member == "" || document.querySelector("#popupSearch").parentElement.style.display == "none" && document.querySelector("#screenLobby").style.display == "none" && document.querySelector("#screenGame").style.display == "none") {
			clearTimeout(self.nextReport);
			return;
		}
		if (!(self.playing || self.searching || self.waiting) || localStorage.userAllow != "true") return;
		if (self.searching) {
			await self.reportPlayerStatus("searching",null,null );
		}
		else if (self.waiting) {
			await self.reportPlayerStatus("waiting", document.querySelector("#inputName").value, null);
			setTimeout(() => self.trigger(), 3000);
		}
		else if (self.playing) {
			await self.reportLobby();
			await self.reportPlayerStatus("playing", self.lobbyID, self.senderPlayer.LobbyPlayerID);
		}
	}
}