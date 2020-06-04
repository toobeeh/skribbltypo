function Player(Name, Score, Drawing, Sender, ID, Status, GuildID) {
	this.Name = Name;
	this.Score = Score;
	this.Drawing = Drawing;
	this.Sender = Sender;
	this.ID = ID;
	this.Status = Status;
	this.GuildID = GuildID;
}


function Lobby(ID, Round, GuildID, Private, Link, Host, ObserveToken, Players, Kicked, Language) {
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
}

function Guild(GuildID, GuildName, ObserveToken) {
	this.GuildID = GuildID;
	this.GuildName = GuildName;
	this.ObserveToken = ObserveToken;
}

var loginName;
var guildLobbies = [];
var nextReport;
var senderPlayer;

document.querySelector("body").addEventListener("loginData", function (d) {
	loginName = d.detail.name;
});


document.querySelector("body").addEventListener("gotLobbyReportStatus", function (e) {
	alert(e.detail);
});

// func to send lobby report to orthanc server
function getLobbyPlayers() {
	let players = document.querySelectorAll("#containerGamePlayers .player");
	let lobbyPlayers = [];

	players.forEach((p) => {
		if (p.id != "gamePlayerDummy") {

			let player = new Player();
			player.Sender = p.querySelector(".name").textContent.includes(loginName + " (You)");
			player.Name = p.querySelector(".name").textContent.replace("(You)","").trim();
			player.Score = p.querySelector(".score").textContent.replace("Points: ", "").trim();
			player.Drawing = p.querySelector(".drawing") ? p.querySelector(".drawing").style.display != "none" : false;
			player.ID = p.id.replace("player", "").trim();

			lobbyPlayers.push(player);
			if (player.Sender) {
				senderPlayer = player;
			}
		}
	});
	return lobbyPlayers;
}

function initLobby() {
	let discordGuilds = JSON.parse(localStorage.guilds);
	discordGuilds.forEach((g) => {
		let lobby = new Lobby();
		lobby.ObserveToken = g.ObserveToken;
		lobby.Host = window.location.hostname;
		lobby.Players = getLobbyPlayers();
		lobby.GuildID = g.GuildID;
		lobby.Round = document.querySelector("#round").innerHTML[6];
		lobby.Private = false;		
		document.querySelectorAll("#containerGamePlayers .player .owner").forEach((o) => {
			if (o.style.display != "none") lobby.Private = true;
		});
		lobby.Link = lobby.Host == "sketchful.io" ? window.location.href : lobby.Private ? document.querySelector("#invite").value : "";
		lobby.ID = generateLobbyID(lobby.Private);
		lobby.Language = lobby.Private ? document.querySelector("#lobbySetLanguage").value : document.querySelector("#loginLanguage").value;
		guildLobbies.push(lobby);
	});
}

function generateLobbyID(private) {
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

function reportLobby() {
	if (guildLobbies.length<1) initLobby();
	else {
		guildLobbies.forEach((g) => {
			g.Players = getLobbyPlayers();
			g.Round = document.querySelector("#round").innerHTML[6];
			g.ID = generateLobbyID(g.Private);
		});
	}

	clearTimeout(nextReport);

	// send lobby report for each verified guild
	guildLobbies.forEach(async (g) => {
		let state = await fetch('https://www.tobeh.host/Orthanc/report/', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body:"lobbyReport=" + JSON.stringify(g)
		}
		);
		console.log("Sent report to guild " + g.GuildName);
	});

	// send palyer status reprot to each verified guild


	nextReport = setTimeout(reportLobby, 5000);
}

function reportPlayerStatus() {

}