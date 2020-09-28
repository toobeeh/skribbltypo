

/*
 *          Sketchful support for lobby reports to palantir
 * 
 * Problem: Login & authentication stuff is stored in localstorage of skribbl.
 * Sketchful has no access 
 * 
 * Workaround: Popup stores login & authentication data in the popup localstorage when entered in skribbl and passes it to sketchful when sketchful is opened.
 * Means on sketchful, the popup has to be opened at least once after logging in on skribbl to send reports.
 * 
 * Better solution... not implemented: backgroundscript which fetches & stores the member data from both skribbl and sketchful
 */


//DOM elements
const GAME = document.querySelector("div.game");
const PLAYERS = document.querySelector("#gamePlayersList");

var reportEnabled = false;
var skribblMember = localStorage.skribblMember ? JSON.parse(localStorage.skribblMember) : null;
var sketchfulAllow = localStorage.sketchfulAllow ? localStorage.sketchfulAllow == "true" : false;
var sessionID = sessionStorage.sessionID ? sessionStorage.sessionID : sessionStorage.sessionID = Math.floor(Math.random() * 100000000);
var selfPlayer;
var nextTimeoutReport;

// add menu page
let menuPage = document.createElement("div");
menuPage.id = "menuTypo";
let contentDiscord = "";
if (!skribblMember) contentDiscord = "<h4>Open the extension popup to load your connections!</h4>";
else {
	contentDiscord += "<p>Logged in as: <span style='font-size:1.3em; font-weight:400;'>" + skribblMember.UserName + "</span></p><br><span style='font-size:1.2em; font-weight:400;'>Your Discord servers:</span><br><br>";
	skribblMember.Guilds.forEach(g => contentDiscord += "" + g.GuildName + "<br>");
}
menuPage.innerHTML = "<div class='row align-items-center h-100 p-5'><div class='col'><h3>Typo</h3><p>Skribbl Typo now supports sketchful!<br>Your sketchful lobbies will show up in the Palantir bot with an invite link.</p>"
	+ "<div style='width:100%;background-image:url(https://support.discord.com/hc/article_attachments/360013500032/nitro_gif.gif);background-size:fit;border-radius:1em;height:10em;background-repeat:no-repeat;background-position:center;'></div>" 
	+ "<br><p> To login and add your Discord servers, go to skribbl and add them in the extension popup.</p></div> <div class='col sm-4'> " + contentDiscord + "</div></div > ";
document.querySelector(".menuTabs").appendChild(menuPage);

// add menu icon
let menuItem = document.createElement("li");
menuItem.style.cursor = "pointer";
menuItem.addEventListener("click", () => {
	document.querySelector(".menuTabs").childNodes.forEach(n => n.classList.remove("active"));
	document.querySelectorAll(".menuNav li a").forEach(n => n.classList.remove("active"));
	menuPage.classList.add("active");
	menuItem.firstChild.classList.add("active");
});
menuItem.innerHTML = "<a draggable='false'><img class='lazy' src='" + chrome.runtime.getURL("res/icon128.png") + "' draggable='false'><span> Typo</span></a>";
document.querySelector(".menuNav ul").appendChild(menuItem);

if (localStorage.showInfo != "false") {
	menuItem.dispatchEvent(new Event("click"));
	localStorage.showInfo = "false";
}

// communication with popup
chrome.runtime.onMessage.addListener(msgObj => {
	if (msgObj.updateUser) {
		let reload = false;
		// if skribbl member changed relaod sketch
		if (JSON.stringify(skribblMember) != JSON.stringify(JSON.parse(msgObj.data).member)) reload = true;
		skribblMember = JSON.parse(msgObj.data).member; 
		localStorage.skribblMember = JSON.stringify(JSON.parse(msgObj.data).member);
		sketchfulAllow = localStorage.sketchfulAllow = (JSON.parse(msgObj.data).userallow == "true");
		if (reload) window.location.reload();
	}
});

// mutation observer for game visibility
var gameObserver = new MutationObserver(() => {
	if (!localStorage.skribblMember) return;
	if (GAME.style.display != "none") {
		// set self lobby player, is also a indicator that the user is in a game
		selfPlayer = new Player(
			document.querySelector("#nick").value,
			0,
			false,
			true,
			skribblMember.UserID,
			0
		);
	}
	else {
		// reset self player, clear nextreport
		selfPlayer = null;
		clearTimeout(nextTimeoutReport);
	}
});
gameObserver.observe(GAME, { attributes: true, childList: false });

// observer for player list
var playerObserver = new MutationObserver(async () => {
	// send report to orthanc
	sendPlayingReport();
});
playerObserver.observe(PLAYERS, { attributes: false, childList: true });

async function sendPlayingReport() {
	// if called by mutation observer, clear polling timeout
	clearTimeout(nextTimeoutReport);
	// if player is in lobby & user allowed reports
	if (selfPlayer && sketchfulAllow) {
		// get self player id
		selfPlayer.LobbyPlayerID = [...document.querySelectorAll("#gamePlayersList li")].find(g => g.querySelector(".gameAvatarName").style.color.includes("teal")).id.split("-")[1];

		// report member as playing to orthanc
		let state = await fetch('https://www.tobeh.host/Orthanc/memberstate/', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: "playerStatus=playing&session=" + self.sessionID
		});

		// initiate lobby object
		let l = new Lobby();
		l.Key = document.querySelector("#roomInfoLink").value.replace("<").replace(">");
		l.Players = getLobbyPlayers();
		l.Host = window.location.hostname;
		l.Language = document.querySelector("#roomInfoLanguage b").innerText;
		l.Round = document.querySelector("#gameRound").innerText.split("/")[0];
		l.Private = true;
		let desc = document.querySelector("#roomInfoPublic").innerText + " - " + document.querySelector("#roomInfoRounds").innerText + " - " + document.querySelector("#roomInfoDrawTime").innerText;
		// get a provided id and fetch desc if available from orthanc
		let providedData = await updateLobbyID(l.Key, "", desc);
		l.ID = providedData.ID;
		l.Link = "https://" + l.Key;

		// report lobby for every authenticated guild for orthanc
		skribblMember.Guilds.forEach(async g => {
			let guildlobby = new Lobby(l.ID, l.Round, g.GuildID, l.Private, l.Link, l.Host, g.ObserveToken, l.Players, null, l.Language, l.Key, l.Description);
			let state = await fetch('https://www.tobeh.host/Orthanc/report/', {
				method: 'POST',
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				body: "lobbyReport=" + encodeURIComponent(JSON.stringify(guildlobby)) + "&member=" + encodeURIComponent(JSON.stringify(skribblMember))
			}
			);
		});
	}
	// set next timeout for polling
	nextTimeoutReport = setTimeout(sendPlayingReport, 4000);
}

// gets all players in a lobby as Player[]
function getLobbyPlayers() {
	let players = [];
	PLAYERS.childNodes.forEach(p => {
		let player = new Player(
			p.querySelector(".gameAvatarName").innerText,
			p.querySelector(".gameAvatarScore").innerText.replace("points", "").trim(),
			p.querySelector(".gameDrawing") != null ? true : false,
			false,
			"",
			p.id.split("-")[1]
		);
		if (player.LobbyPlayerID == selfPlayer.LobbyPlayerID) {
			player.Sender = true;
			player.ID = selfPlayer.ID;
		}
		players.push(player);
	});
	return players;
}

// get lobby id & desc by key from orthanc
async function updateLobbyID(key, id = "", desc = "") {
	let state = await fetch('https://www.tobeh.host/Orthanc/idprovider/', {
		method: 'POST',
		headers: {
			'Accept': '*/*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: "member=" + encodeURIComponent(JSON.stringify(skribblMember)) + "&lobbyKey=" + key + (id != "" ? "&lobbyID=" + id : "") + (desc != "" ? "&description=" + desc : "")
	}
	);
	let response = await state.text();
	return JSON.parse(response).Lobby;
}

// player object
this.Player = function (Name, Score, Drawing, Sender, ID, LobbyPlayerID) {
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
this.Lobby = function (ID, Round, GuildID, Private, Link, Host, ObserveToken, Players, Kicked, Language, Key, Description) {
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
}
// Guild object
this.Guild = function (GuildID, GuildName, ObserveToken) {
	this.GuildID = GuildID;
	this.GuildName = GuildName;
	this.ObserveToken = ObserveToken;
}