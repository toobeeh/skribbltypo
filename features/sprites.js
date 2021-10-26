// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const sprites = {    
    // Object which has necessary properties to handle sprite logic
    PlayerSpriteContainer: function (_lobbyKey, _lobbyPlayerID, _avatarContainer, _name) {
        this.lobbyKey = _lobbyKey;
        this.lobbyPlayerID = _lobbyPlayerID;
        this.name =_name;
        this.avatarContainer = _avatarContainer;
    },
    availableSprites: [], //list of all sprites
    playerSprites: [], //list of all player identifications which are online and have sprites
    lobbyPlayers: [], //list of the players in the players lobby
    getSpriteURL: (id) => { // get the gif url from a sprite id
        let url = "";
        sprites.availableSprites.forEach(s => { if (s.ID == id) url = s.URL; });
        return url;
    },
    isSpecial: (id) => { // checks if a sprite is special
        let special = false;
        sprites.availableSprites.forEach(s => { if (s.ID == id && s.Special) special = true; });
        return special;
    },
    getPlayerList: () => { //get the lobby player list and store in lobbyPlayers
        let players = [];
        let playerContainer = QS("#containerGamePlayers");
        let playerContainerLobby = QS("#containerLobbyPlayers");
        [...playerContainer.querySelectorAll(".player"), ...playerContainerLobby.querySelectorAll(".lobbyPlayer")].forEach(p => {
            let private = false;
            QSA("#containerGamePlayers .player .owner").forEach((o) => {
                if (o.style.display != "none") private = true;
            });
            let psc = new sprites.PlayerSpriteContainer(
                lobbies_.getLobbyKey(private),
                p.id.replace("player", ""),
                p.querySelector(".avatar"),
                p.querySelector(".name").innerText.replace("(You)", "").trim()
            )
            players.push(psc);
        });
        sprites.lobbyPlayers = players;
    },
    updateSprites: () => { // compare lobbyplayers with onlinesprites and set sprite if matching
        sprites.lobbyPlayers.forEach(player => {
            let playerSlots = [];
            sprites.playerSprites.forEach(sprite => {
                if (sprite.LobbyPlayerID.toString() == player.lobbyPlayerID && sprite.LobbyKey == player.lobbyKey) playerSlots.push({ sprite: sprite.Sprite, slot: sprite.Slot });
            });
            
            if (playerSlots.length > 0) {
                // check if existent slots are set to 0
                [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")].forEach(existentSlot => {
                    if (!playerSlots.some(slot => existentSlot.classList.contains("specialSlot" + slot.slot))) existentSlot.remove();
                });
                // make avatar invisible if special is inluded
                let state = playerSlots.some(slot => sprites.isSpecial(slot.sprite)) ? "none" : "";
                [...player.avatarContainer.querySelectorAll(".color, .eyes, .mouth")].forEach(a => a.style.display = state);
                // update slots
                playerSlots.forEach(slot => {
                    let spriteUrl = sprites.getSpriteURL(slot.sprite);
                    if (!player.avatarContainer.querySelector(".specialSlot" + slot.slot) // if slot layer isnt existent or has old url
                        || player.avatarContainer.querySelector(".specialSlot" + slot.slot).style.backgroundImage != "url(\"" + spriteUrl + "\")") {
                        if (player.avatarContainer.querySelector(".specialSlot" + slot.slot)) // remove slot layer
                            player.avatarContainer.querySelector(".specialSlot" + slot.slot).remove();
                        let spriteContainer = document.createElement("div"); // create new layer
                        spriteContainer.className = "specialSlot" + slot.slot;
                        spriteContainer.classList.add("special");
                        spriteContainer.classList.add("typoSpecialSlot");
                        spriteContainer.style.zIndex = slot.slot;
                        spriteContainer.style.backgroundImage = "url(" + spriteUrl + ")";
                        player.avatarContainer.appendChild(spriteContainer);
                        // set style depending on listing
                        if (spriteContainer.closest("#containerLobbyPlayers")) spriteContainer.style.backgroundSize = "contain";
                        else spriteContainer.parentElement.parentElement.style.height = "60px";
                    }
                });
            }
            // else remove all existent slots
            else [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")].forEach(existentSlot => existentSlot.remove()); 
            
        });
    },
    updateEndboardSprites: () => { // show sprites on endboard
        let endboardAvatars = QSA(".gameEndPlayer .name");
        sprites.lobbyPlayers.forEach(player => {
            let avatarFitContainer = null;
            endboardAvatars.forEach(a => { if (a.innerText == player.name) avatarFitContainer = a.parentElement.querySelector(".special"); });
            if (avatarFitContainer != null) {
                // remove all existent special slots on avatar
                [...avatarFitContainer.parentElement.querySelectorAll(".typoSpecialSlot")].forEach(slot => slot.remove());
                // update background depending on avatar
                let state = player.avatarContainer.querySelector(".color").style.display;
                [...avatarFitContainer.parentElement.querySelectorAll(".color, .eyes, .mouth")].forEach(elem => elem.style.display = state);
                // add slots to avatar
                let slotsOnSidebar = [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")];
                slotsOnSidebar.forEach(slot => {
                    let slotElem = avatarFitContainer.cloneNode(true);
                    slotElem.style.backgroundSize = "cover";
                    slotElem.classList.add(".typoSpecialSlot");
                    slotElem.style.display = "";
                    slotElem.style.backgroundPosition = "";
                    slotElem.style.backgroundImage = slot.style.backgroundImage;
                    slotElem.style.zIndex = slot.style.zIndex;
                    avatarFitContainer.parentElement.appendChild(slotElem);
                });
            }
        });
    },
    updateScenes: () => {
        const playerlist = QS("#containerPlayerlist");
        let scenesCSS = elemFromString("<style id='scenesRules'></style>");

        sprites.onlineScenes.forEach(scene => {
            if (scene.LobbyKey == socket.clientData.lobbyKey) {
                scenesCSS.innerHTML += `
                #containerGamePlayers div.player#player${scene.LobbyPlayerID} {
                    background-image: url(${sprites.availableScenes.find(av => av.ID == scene.Sprite).URL}) !important;
                    background-size: auto 100% !important;
                    background-position: center center !important;
                    background-repeat: no-repeat !important;
                }
                #containerGamePlayers div.player.guessedWord#player${scene.LobbyPlayerID} *:is(.rank, .score, .name) {color: ${sprites.availableScenes.find(av => av.ID == scene.Sprite).GuessedColor} !important}
                #containerGamePlayers div.player#player${scene.LobbyPlayerID} *:is(.rank, .score, .name) {color: ${sprites.availableScenes.find(av => av.ID == scene.Sprite).Color} !important}`;
            }
            
        });

        QS("#scenesRules")?.remove();
        playerlist.insertAdjacentElement("afterbegin", scenesCSS);
    },
    refreshCallback: async () => { // refresh all
        sprites.getSprites();
        sprites.getPlayerList();
        sprites.updateSprites();
        sprites.updateScenes();
    },
    getSprites: () => {
        sprites.availableSprites = socket.data.publicData.sprites;
        sprites.availableScenes = socket.data.publicData.scenes;
        sprites.playerSprites = socket.data.publicData.onlineSprites;
        sprites.onlineScenes = socket.data.publicData.onlineScenes;
    },
    init: async () => {
        // make board behind playerlist so it doesnt hide portions of avatars
        QS("#containerGamePlayers").style.zIndex = "1";
        // polling for sprites, observer does not make sense since sprites take a few seconds to be activated
        setInterval(sprites.refreshCallback, 2000);
        let endboardObserver = new MutationObserver(() => { // mutation observer for game end result
            sprites.updateEndboardSprites();
            sprites.updateSprites();
        });
        endboardObserver.observe(QS(".gameEndContainerPlayersBest"), { childList: true, attributes: true });

        if (!socket.authenticated) return;
        sprites.getSprites();
        let ownsprites = socket.data.user.sprites.split(",");
        let activeSprites = ownsprites.filter(s => s.includes("."));
        activeSprites.forEach(sprite => {
            let slot = sprite.split(".").length - 1;
            let id = sprite.replaceAll(".", "");
            let url = sprites.getSpriteURL(id);
            if (sprites.isSpecial(id)) {
                QSA("#loginAvatarCustomizeContainer .color, #loginAvatarCustomizeContainer .eyes, #loginAvatarCustomizeContainer .mouth").forEach(n => {
                    n.style.opacity = 0;
                });
            }
            let specialContainer = QS("#loginAvatarCustomizeContainer .special");
            let clone = specialContainer.cloneNode(true);
            specialContainer.parentElement.appendChild(clone);
            clone.style = "background-image:url(" + url + "); background-size:contain; position: absolute; left: -33%; top: -33%; width: 166%;height: 166%;";
            clone.style.zIndex = slot;
            clone.classList.add("spriteSlot");
            clone.classList.remove("special");
        });
        let avatarContainer = document.querySelector("#loginAvatarCustomizeContainer");
        avatarContainer.insertAdjacentHTML("afterend", "<div style='margin:1em 0; text-align: center; pointer-events:none; user-select:none'> 🔮 Current Bubbles: "
            + socket.data.user.bubbles + "    💧 Caught Drops: " + socket.data.user.drops
            + "</div>")
        if(localStorage.experimental == "true") avatarContainer.insertAdjacentHTML("afterend", "<div style='opacity:0.6, margin:1em 0; text-align: center; pointer-events:none; user-select:none'>"
            + "Typo v" + chrome.runtime.getManifest().version + " connected@ " + socket.sck.io.uri
            + "</div>")
        QS("#loginAvatarCustomizeContainer .avatarContainer").style.margin = "0 30px";
    }

};