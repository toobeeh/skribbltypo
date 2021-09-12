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
        let playerContainer = QS("#game-players .list");
        //let playerContainerLobby = QS("#containerLobbyPlayers");, ...playerContainerLobby.querySelectorAll(".lobbyPlayer")
        [...playerContainer.querySelectorAll(".player")].forEach(p => {
            let psc = new sprites.PlayerSpriteContainer(
                lobbies.lobbyProperties.Key,
                p.getAttribute("playerid"),
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
                        else {
                            spriteContainer.parentElement.parentElement.style.height = "60px";
                            spriteContainer.parentElement.style.top = "5px";
                        } 
                    }
                });
            }
            // else remove all existent slots
            else [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")].forEach(existentSlot => existentSlot.remove()); 
            
        });
    },
    updateEndboardSprites: () => { // show sprites on endboard
        let endboardAvatars = QSA(".overlay-content .result .rank-name");
        sprites.lobbyPlayers.forEach(player => {
            let avatarContainer = null;
            endboardAvatars.forEach(a => { if (a.innerText == player.name) avatarContainer = a.parentElement.querySelector(".avatar"); });
            if (avatarContainer != null) {
                // remove all existent special slots on avatar
                [...avatarContainer.parentElement.querySelectorAll(".typoSpecialSlot")].forEach(slot => slot.remove());
                // update background depending on avatar
                let state = player.avatarContainer.querySelector(".color").style.display;
                [...avatarContainer.parentElement.querySelectorAll(".color, .eyes, .mouth")].forEach(elem => elem.style.display = state);
                // add slots to avatar
                let slotsOnSidebar = [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")];
                slotsOnSidebar.forEach(slot => {
                    let slotElem = avatarContainer.querySelector(".special").cloneNode(true);
                    slotElem.style.backgroundSize = "cover";
                    slotElem.classList.add(".typoSpecialSlot");
                    slotElem.style.display = "";
                    slotElem.style.backgroundPosition = "";
                    slotElem.style.backgroundImage = slot.style.backgroundImage;
                    slotElem.style.zIndex = slot.style.zIndex;
                    avatarContainer.appendChild(slotElem);
                });
            }
        });
    },
    refreshCallback: async () => { // refresh all
        sprites.getSprites();
        sprites.getPlayerList();
        sprites.updateSprites();
    },
    getSprites: () => {
        sprites.availableSprites = socket.data.publicData.sprites;
        sprites.playerSprites = socket.data.publicData.onlineSprites;
    },
    init: async () => {
        // make board behind playerlist so it doesnt hide portions of avatars
        QS("#game-players .list").style.zIndex = "1";
        // polling for sprites, observer does not make sense since sprites take a few seconds to be activated
        setInterval(sprites.refreshCallback, 2000);
        let endboardObserver = new MutationObserver(() => { // mutation observer for game end result
            sprites.updateEndboardSprites();
            sprites.updateSprites();
        });
        endboardObserver.observe(QS(".overlay-content .result"), { childList: true, attributes: true });

        if (!socket.authenticated) {
            const userinfo = QS("#typoUserInfo")
            userinfo.innerText = "No palantir account connected!";
            userinfo.style.cssText = "opacity:1; transition: opacity 0.5s";
            setTimeout(() => { userinfo.style.opacity = "0"; }, 3000);
            setTimeout(() => { userinfo.style.display = "none" }, 3500);
        }
        else {
            sprites.getSprites();
            const setLandingSprites = () => {
                let ownsprites = socket.data.user.sprites.split(",");
                let activeSprites = ownsprites.filter(s => s.includes("."));
                QSA(".avatar-customizer .spriteSlot").forEach(elem => elem.remove());
                activeSprites.forEach(sprite => {
                    let slot = sprite.split(".").length - 1;
                    let id = sprite.replaceAll(".", "");
                    let url = sprites.getSpriteURL(id);
                    QSA(".avatar-customizer .color, .avatar-customizer .eyes, .avatar-customizer .mouth").forEach(n => {
                        n.style.opacity = sprites.isSpecial(id) ? 0 : 1;
                    });
                    let specialContainer = QS(".avatar-customizer .special");
                    let clone = specialContainer.cloneNode(true);
                    specialContainer.parentElement.appendChild(clone);
                    clone.style = "background-image:url(" + url + "); background-size:contain; position: absolute; left: -33%; top: -33%; width: 166%;height: 166%;";
                    clone.style.zIndex = slot;
                    clone.classList.add("spriteSlot");
                    clone.classList.remove("special");
                });
            }
            setLandingSprites();
            QS("#typoUserInfo").innerHTML = "<div style='display:flex; justify-content:space-between; width:100%;'><span>🔮 Bubbles: "
                + socket.data.user.bubbles + "</span><span>💧 Drops: " + socket.data.user.drops + "</span></div>";
            if (localStorage.experimental == "true") QS("#typoUserInfo").innerText.insertAdjacentHTML("beforeend",
                + "<br>Typo v" + chrome.runtime.getManifest().version + " connected@ " + socket.sck.io.uri);
            // add sprite cabin stuff
            const cabin = QS("#cabinSlots");
            cabin.classList.remove("unauth");
            const slots = [...QSA("#cabinSlots > div:not(#loginRedir)")];
            const setSlotSprites = () => {
                socket.data.user.sprites.split(",")
                    .filter(spt => spt.includes("."))
                    .map(spt => [spt.replaceAll(".", ""), spt.split(".").length - 1])
                    .forEach(slot => {
                        if (slot[0] > 0) slots[slot[1] - 1].style.backgroundImage = "url(" + socket.data.publicData.sprites.find(spt => spt.ID == slot[0]).URL + ")";
                        else slots[slot[1] - 1].style.backgroundImage = "none";
                    });
                slots.forEach(slot => {
                    if (slots.indexOf(slot) < socket.data.user.slots)
                        slot.classList.add("unlocked");
                    else slot.classList.remove("unlocked");
                });
            }
            setSlotSprites();
            cabin.addEventListener("click", event => {
                slot = slots.find(elem => elem == event.target);
                if (slot) {
                    const slotNo = slots.indexOf(slot) + 1;
                    const spriteList = elemFromString(`<div style="width:100%; display:flex; flex-wrap:wrap; justify-content:center;"></div>`);
                    spriteList.insertAdjacentHTML("beforeend",
                        "<div class='spriteChoice' sprite='0' style='margin:.5em; height:6em; aspect-ratio:1; background-image:none'></div>");
                    socket.data.user.sprites.split(",").forEach(spt => {
                        const id = spt.replaceAll(".", "");
                        const active = spt.includes(".");
                        if (!active && id > 0) {
                            spriteList.insertAdjacentHTML("beforeend",
                                "<div class='spriteChoice' sprite='" + id + "' style='margin:.5em; height:6em; aspect-ratio:1; background-image:url("
                                + socket.data.publicData.sprites.find(spt => spt.ID == id).URL
                                + ")'></div>");
                        }
                    });
                    const picker = new Modal(spriteList, () => { }, "Choose a sprite for slot " + slotNo);
                    spriteList.addEventListener("click", async event => {
                        const spt = event.target.getAttribute("sprite");
                        if (spt) {
                            picker.close();
                            let updatedmember = await socket.setSpriteSlot(slotNo, spt);
                            socket.data.user = updatedmember;
                            setSlotSprites();
                            setLandingSprites();
                        }
                    })
                }
            });
        }
        
    }

};