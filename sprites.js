(function () {
    // Object which has necessary properties to handle sprite logic
    let PlayerSpriteContainer = function (_lobbyKey, _lobbyPlayerID, _avatarContainer, _name) {
        this.lobbyKey = _lobbyKey;
        this.lobbyPlayerID = _lobbyPlayerID;
        this.name =_name;
        this.avatarContainer = _avatarContainer;
    } 

    let availableSprites = []; //list of all sprites
    let playerSprites = []; //list of all player identifications which are online and have sprites
    let lobbyPlayers = []; //list of the players in the players lobby

    // get onlinesprites and spritelist from orthanc
    async function fetchSprites() {
        let resp = await fetch("https://www.tobeh.host/Orthanc/sprites/", {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });
        let json = await resp.json();
        availableSprites = json.Sprites;
        playerSprites = json.OnlineSprites;
    }

    // get the gif url from a sprite id
    function getSpriteURL(id) {
        let url = "";
        availableSprites.forEach(s => { if (s.ID == id) url = s.URL; });
        return url;
    }

    // checks if a sprite is special
    function isSpecial(id) {
        let special = false;
        availableSprites.forEach(s => { if (s.ID == id && s.Special) special = true; });
        return special;
    }

    //get the lobby player list and store in lobbyPlayers
    function getPlayerList() {
        let players = [];
        let playerContainer = document.querySelector("#containerGamePlayers");
        [...playerContainer.querySelectorAll(".player")].forEach(p => {
            let private = false;
            document.querySelectorAll("#containerGamePlayers .player .owner").forEach((o) => {
                if (o.style.display != "none") private = true;
            });
            let psc = new PlayerSpriteContainer(
                Report.generateLobbyKey(private),
                p.id.replace("player", ""),
                p.querySelector(".avatar"),
                p.querySelector(".name").innerText.replace("(You)", "").trim()
            )
            players.push(psc);
        });
        lobbyPlayers = players; 
    }

    // compare lobbyplayers with onlinesprites and set sprite if matching
    function updateSprites() {
        lobbyPlayers.forEach(player => {
            let playerSprite;
            playerSprites.forEach(sprite => {
                if (sprite.LobbyPlayerID.toString() == player.lobbyPlayerID && sprite.LobbyKey == player.lobbyKey) playerSprite = sprite.Sprite;
            })
            if (playerSprite == undefined) return;
            let spriteUrl = getSpriteURL(playerSprite);

            player.avatarContainer.querySelector(".special").remove();
            let spriteContainer = document.createElement("div");
            spriteContainer.className = "special";
            spriteContainer.style.backgroundImage = "url(" + spriteUrl + ")";
            player.avatarContainer.appendChild(spriteContainer);
            spriteContainer.parentElement.parentElement.style.height = "60px";

            let special = isSpecial(playerSprite);
            [...player.avatarContainer.querySelectorAll(".color, .eyes, .mouth")].forEach(a => a.style.display = special ? "none" : "");
        });
    }

    function updateEndboardSprites() {
        let endboardAvatars = document.querySelectorAll(".gameEndPlayer .name");
        lobbyPlayers.forEach(player => {
            let avatarFitContainer = null;
            endboardAvatars.forEach(a => { if (a.innerText == player.name) avatarFitContainer = a.parentElement.querySelector(".special"); });
            if (avatarFitContainer != null) {
                avatarFitContainer.style.backgroundSize = "cover";
                avatarFitContainer.style.display = player.avatarContainer.querySelector(".special").style.display;
                avatarFitContainer.style.backgroundImage = player.avatarContainer.querySelector(".special").style.backgroundImage;
            }
        });
    }

    // refresh all
    async function refreshCallback() {
        await fetchSprites();
        getPlayerList();
        updateSprites();
    }

    // polling for sprites, observer does not make sense since sprites take a few seconds to be activated
    setInterval(refreshCallback, 2000);

    // mutation observer for game end result
    let endboardObserver = new MutationObserver(() => {
        updateEndboardSprites();
    });
    endboardObserver.observe(document.querySelector(".gameEndContainerPlayersBest"), { childList: true, attributes: true });

})();