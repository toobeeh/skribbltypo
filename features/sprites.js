// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

const sprites = {
    // Object which has necessary properties to handle sprite logic
    PlayerSpriteContainer: function (_lobbyKey, _lobbyPlayerID, _avatarContainer, _name) {
        this.lobbyKey = _lobbyKey;
        this.lobbyPlayerID = _lobbyPlayerID;
        this.name = _name;
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
        let playerContainer = QS("#game-players .players-list");
        //let playerContainerLobby = QS("#containerLobbyPlayers");, ...playerContainerLobby.querySelectorAll(".lobbyPlayer")
        [...playerContainer.querySelectorAll(".player")].forEach(p => {
            let psc = new sprites.PlayerSpriteContainer(
                lobbies.lobbyProperties.Key,
                p.getAttribute("playerid"),
                p.querySelector(".avatar"),
                p.querySelector(".player-name").innerText.replace("(You)", "").trim()
            )
            players.push(psc);
        });
        sprites.lobbyPlayers = players;
    },
    updateSprites: () => { // compare lobbyplayers with onlinesprites and set sprite if matching

        // get shifts for this lobby
        let shifts = socket.data.publicData.onlineItems.filter(item => item.LobbyKey == socket.clientData.lobbyKey && item.ItemType == "shift");

        sprites.lobbyPlayers.forEach(player => {
            let playerSlots = [];
            sprites.playerSprites.forEach(sprite => {
                if (sprite.LobbyPlayerID.toString() == player.lobbyPlayerID && sprite.LobbyKey == player.lobbyKey) {
                    playerSlots.push({
                        sprite: sprite.Sprite,
                        slot: sprite.Slot,
                        shift: shifts.find(shift => shift.LobbyPlayerID == player.lobbyPlayerID && sprite.Slot == shift.Slot)
                    });
                }
            });

            if (playerSlots.length > 0) {
                player.avatarContainer.parentElement.parentElement.classList.toggle("typo", true);
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
                        spriteContainer.style.backgroundImage = slot.shift ? "url(https://static.typo.rip/sprites/rainbow/modulate.php?url=" + spriteUrl + "&hue=" + slot.shift.ItemID + ")" : "url(" + spriteUrl + ")";
                        player.avatarContainer.appendChild(spriteContainer);
                        // set style depending on listing
                        if (spriteContainer.closest("#containerLobbyPlayers")) spriteContainer.style.backgroundSize = "contain";
                        else {
                            spriteContainer.parentElement.parentElement.parentElement.style.height = "56px";
                            spriteContainer.parentElement.parentElement.style.top = "3px";
                        }
                    }
                });
            }
            // else remove all existent slots
            else {
                [...player.avatarContainer.querySelectorAll(".typoSpecialSlot")].forEach(existentSlot => existentSlot.remove());
                player.avatarContainer.parentElement.parentElement.classList.toggle("typo", false);
            }

        });
    },
    updateAwards: () => {
        const lobbyAwards = socket.data.publicData.onlineItems.filter(item => item.LobbyKey == socket.clientData.lobbyKey && item.ItemType == "award");

        [...QSA(".players-list .player-icons")].forEach(icons => {
            const playerId = Number(icons.closest(".player")?.getAttribute("playerid"));
            if (Number.isNaN(playerId)) return;
            let playerIcons = lobbyAwards.filter(a => a.LobbyPlayerID == playerId);

            [...icons.querySelectorAll(".award")].forEach(existingIcon => {
                const awardId = Number(existingIcon.getAttribute("awardId"));
                if (!playerIcons.some(icon => icon.Slot == awardId)) existingIcon.remove();
                else playerIcons = playerIcons.filter(icon => icon.Slot != awardId);
            });

            playerIcons.forEach(icon => {
                const award = awards.all.find(a => a.id == icon.Slot);
                icons.insertAdjacentHTML("beforeend", `<div class="icon typo award visible" awardId="${award.id}" style="background-image: url(${award.url})"></div>`);
            });
        });
    },
    updateScenes: () => {
        const playerlist = QS("#game-players");
        let scenesCSS = elemFromString("<style id='scenesRules'></style>");

        // scene shifts for this lobby
        let shifts = socket.data.publicData.onlineItems.filter(item => item.LobbyKey == socket.clientData.lobbyKey && item.ItemType == "sceneTheme");

        sprites.onlineScenes.forEach(scene => {
            if (scene.LobbyKey == socket.clientData.lobbyKey) {
                let url = sprites.availableScenes.find(av => av.ID == scene.Sprite).URL;
                const sceneShift = shifts.find(shift => shift.LobbyPlayerID == scene.LobbyPlayerID);
                if(sceneShift) {
                    url = `https://static.typo.rip/sprites/rainbow/modulate.php?url=${url}&hue=${sceneShift.ItemID}`;
                    const rotate = ((360/200) * sceneShift.ItemID - 180) * -1;
                    scenesCSS.innerHTML += `
                    #game-players div.player:not(.guessed)[playerid='${scene.LobbyPlayerID}'] .player-info {filter: hue-rotate(${rotate}deg) !important}`;
                }

                scenesCSS.innerHTML += `
                #game-players div.player[playerid='${scene.LobbyPlayerID}'] {
                    background-image: url(${url}) !important;
                    background-size: auto 100% !important;
                    background-position: center center !important;
                    background-repeat: no-repeat !important;
                }
                #game-players div.player.guessed[playerid='${scene.LobbyPlayerID}'] *:is(.player-rank, .player-score, .player-name) {color: ${sprites.availableScenes.find(av => av.ID == scene.Sprite).GuessedColor} !important}
                #game-players div.player[playerid='${scene.LobbyPlayerID}'] *:is(.player-rank, .player-score, .player-name) {color: ${sprites.availableScenes.find(av => av.ID == scene.Sprite).Color} !important}`;
            }
        });

        if (QS("#scenesRules")?.innerHTML === scenesCSS.innerHTML) return;

        QS("#scenesRules")?.remove();
        playerlist.insertAdjacentElement("afterbegin", scenesCSS);
    },
    updateEndboardSprites: () => { // show sprites on endboard
        let endboardAvatars = QSA(".overlay-content .result .rank-name");
        sprites.lobbyPlayers.forEach(player => {
            let avatarContainer = null;
            endboardAvatars.forEach(a => { if (a.innerText == player.name) avatarContainer = a.closest(".podests") ? a.parentElement.parentElement.querySelector(".avatar") : a.parentElement.querySelector(".avatar"); });
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
        sprites.updateScenes();
        sprites.updateAwards();
    },
    getSprites: () => {
        sprites.availableSprites = socket.data.publicData.sprites;
        sprites.playerSprites = socket.data.publicData.onlineSprites;
        sprites.availableScenes = socket.data.publicData.scenes;
        sprites.onlineScenes = socket.data.publicData.onlineScenes;
    },
    getOwnSpriteUrlShifted: (id) => {
        let shifts = socket.data.user.rainbowSprites ? socket.data.user.rainbowSprites.split(",").map(s => s.split(":")) : [];
        let url = sprites.getSpriteURL(id);
        let shift = shifts.find(s => s[0] == id);
        if (shift) url = "https://static.typo.rip/sprites/rainbow/modulate.php?url=" + url + "&hue=" + shift[1];
        return url;
    },
    setLandingSprites: (authenticated = false) => {
        QSA(".avatar-customizer .spriteSlot").forEach(elem => elem.remove());
        QS(".avatar-customizer").style.backgroundImage = "";
        if (authenticated) {
            let ownsprites = socket.data.user.sprites.toString().split(",");
            let activeSprites = ownsprites.filter(s => s.includes("."));
            QSA(".avatar-customizer .color, .avatar-customizer .eyes, .avatar-customizer .mouth").forEach(n => {
                n.style.opacity = activeSprites.some(spt => sprites.isSpecial(spt.replaceAll(".", ""))) ? 0 : 1;
            });
            activeSprites.forEach(sprite => {
                let slot = sprite.split(".").length - 1;
                let id = sprite.replaceAll(".", "");
                let url = sprites.getOwnSpriteUrlShifted(id);
                let specialContainer = QS(".avatar-customizer .special");
                let clone = specialContainer.cloneNode(true);
                specialContainer.parentElement.appendChild(clone);
                clone.style = "background-image:url(" + url + "); background-size:contain; position: absolute; left: -33%; top: -33%; width: 166%;height: 166%;";
                clone.style.zIndex = slot;
                clone.classList.add("spriteSlot");
                clone.classList.remove("special");
            });

            let container = QS(".avatar-customizer");
            let scene = socket.data.user.scenes ? socket.data.user.scenes.toString().split(",").filter(s => s[0] == ".")[0] : undefined;
            if (scene != undefined) {
                let url = socket.data.publicData.scenes.find(_scene => _scene.ID == Number(scene.replace(".", ""))).URL;
                container.style.cssText = `    
                    background-repeat: no-repeat;
                    background-image: url(${url});
                    background-size: cover;
                    background-position: center;
                `;
            }
            else container.style.cssText = ``;
        }
        else {
            QSA(".avatar-customizer .color, .avatar-customizer .eyes, .avatar-customizer .mouth").forEach(n => {
                n.style.opacity = 1;
            });
        }
    },
    resetCabin: async (authorized = false) => {
        const cabin = QS("#cabinSlots");
        cabin.innerHTML = `
            <div id="loginRedir">
                <button class="flatUI air min blue">Log in with Palantir</button>
            </div>
            <div>Slot 1<p></p></div>
            <div>Slot 2<p></p></div>
            <div>Slot 3<p></p></div>
            <div>Slot 4<p></p></div>
            <div>Slot 5<p></p></div>
            <div>Slot 6<p></p></div>
            <div>Slot 7<p></p></div>
            <div>Slot 8<p></p></div>
            <div>Slot 9<p></p></div>`;

        if (!authorized) {
            cabin.classList.add("unauth");
        }
        else {
            // add sprite cabin stuff
            let user = await socket.getUser();
            const createSlot = (slot, unlocked = false, caption = false, background = false, id = 0) => {
                return elemFromString(`<div draggable="true" spriteid="${id}" slotid="${slot}" class="${unlocked ? "unlocked" : ""}" style="background-image:url(${background ?
                    sprites.getOwnSpriteUrlShifted(id) : ""})">
                    Slot ${slot}${caption ? "<p>" + (id > 0 ? "Selected #" + id : "Empty") + "</p>" : ""}</div>`);
            }
            const getCombo = () => {
                let slots = [...QSA("#cabinSlots > div:not(#loginRedir)")];
                slots = slots.map(slot => { return { slot: slots.indexOf(slot) + 1, sprite: slot.getAttribute("spriteid") }; });
                while (slots[slots.length - 1].sprite == 0) slots.pop();
                return slots.map(slot => ".".repeat(parseInt(slot.slot)) + slot.sprite)
                    .join(",");
            }
            cabin.classList.remove("unauth");
            const setSlotSprites = () => {
                // clean slots
                QSA("#cabinSlots > div:not(#loginRedir)").forEach(slot => slot.remove());
                // loop through player slots and check if sprite set on slot
                const activeSprites = user.user.sprites.toString().split(",")
                    .filter(spt => spt.includes("."))
                    .map(spt => {
                        return {
                            id: spt.replaceAll(".", ""),
                            slot: spt.split(".").length - 1
                        }
                    });
                for (let slotIndex = 1; slotIndex <= user.slots || slotIndex < 16; slotIndex++) {
                    const sprite = activeSprites.find(spt => spt.slot == slotIndex);
                    const id = sprite ? parseInt(sprite.id) : 0;
                    const background = id > 0;
                    const unlocked = slotIndex <= user.slots;
                    cabin.appendChild(createSlot(slotIndex, unlocked, unlocked, background, id));
                }
                // make grid draggable
                const drag = (e) => {
                    e.preventDefault();
                    // make preview elem
                    const preview = createSlot(0, true, false, false, 0);
                    preview.style.opacity = "0";
                    e.target.insertAdjacentElement("beforebegin", preview);
                    // lock element;
                    const bounds = e.target.getBoundingClientRect();
                    e.target.style.width = bounds.width + "px";
                    e.target.style.height = bounds.height + "px";
                    e.target.style.position = "fixed";
                    e.target.style.transition = "none";
                    e.target.style.transform = "translate(-50%, -50%)";
                    e.target.setAttribute("released", "false");
                    // move as first child to hover over all children
                    e.target.parentElement.insertAdjacentElement("afterbegin", e.target);
                    //listen for mouseup, follow mouse until then
                    let lastPrevX = 0;
                    const followMouse = (event) => {
                        e.target.style.top = event.pageY - document.body.scrollTop + "px";
                        e.target.style.left = event.pageX + "px";
                        let hoverDrop = QS("#cabinSlots > div:not(#loginRedir):hover");
                        if (hoverDrop != e.target) {
                            if (e.target.style.left < lastPrevX) hoverDrop.insertAdjacentElement("beforebegin", preview);
                            else hoverDrop.insertAdjacentElement("afterend", preview);
                            lastPrevX = e.target.style.left;
                        }
                    }
                    const reset = async () => {
                        document.removeEventListener("pointermove", followMouse);
                        e.target.style.position = "";
                        e.target.style.transition = "";
                        e.target.style.transform = "";
                        e.target.style.width = "";
                        e.target.style.height = "";
                        // move to dragged position
                        QS("#cabinSlots > div:not(#loginRedir):hover").insertAdjacentElement("afterend", e.target);
                        preview.remove();
                        setTimeout(() => {
                            e.target.setAttribute("released", "true");
                        }, 100);
                        let updatedmember = await socket.setSpriteCombo(getCombo());
                        user.user = updatedmember;
                        socket.data.user = updatedmember;
                        setSlotSprites();
                        sprites.setLandingSprites(true);

                    }
                    document.addEventListener("pointerup", reset, { once: true });
                    document.addEventListener("pointermove", followMouse);
                }

                QSA("#cabinSlots > div:not(#loginRedir)").forEach(slot => slot.addEventListener("dragstart", drag));
            }

            setSlotSprites();

            cabin.addEventListener("contextmenu", async (event) => {
                event.preventDefault();
                if (event.target.getAttribute("released") == "false") return;
                slotid = event.target.getAttribute("slotid");
                if (slotid && event.target.classList.contains("unlocked")) {
                    const slotNo = parseInt(slotid);
                    let updatedmember = await socket.setSpriteSlot(slotNo, 0);
                    socket.data.user = updatedmember;
                    user.user = updatedmember;
                    setSlotSprites();
                    sprites.setLandingSprites(true);
                }
            });

            cabin.addEventListener("click", event => {
                if (event.target.getAttribute("released") == "false") return;
                slotid = event.target.getAttribute("slotid");
                if (slotid) {
                    const slotNo = parseInt(slotid);
                    const spriteList = elemFromString(`<div style="width:100%; display:flex; flex-wrap:wrap; justify-content:center;"></div>`);
                    spriteList.insertAdjacentHTML("beforeend",
                        "<div class='spriteChoice' sprite='0' style='margin:.5em; height:6em; aspect-ratio:1; background-image:none'></div>");
                    user.user.sprites.toString().split(",").forEach(spt => {
                        const id = spt.replaceAll(".", "");
                        const active = spt.includes(".");
                        if (!active && id > 0) {
                            spriteList.insertAdjacentHTML("beforeend",
                                "<div class='spriteChoice' sprite='" + id + "' style='order: " + id + ";margin:.5em; height:6em; aspect-ratio:1; background-image:url("
                                + sprites.getOwnSpriteUrlShifted(id)
                                + ")'></div>");
                        }
                    });
                    const picker = new Modal(spriteList, () => { }, "Choose a sprite for slot " + slotNo);
                    spriteList.addEventListener("click", async event => {
                        const spt = event.target.getAttribute("sprite");
                        if (spt) {
                            picker.close();
                            let updatedmember = await socket.setSpriteSlot(slotNo, spt);
                            user.user = updatedmember;
                            socket.data.user = updatedmember;
                            setSlotSprites();
                            sprites.setLandingSprites(true);
                        }
                    })
                }
            });

        }

        QS("#rightPanelContent #loginRedir").addEventListener("click", login);
    },
    init: async () => {
        // make board behind playerlist so it doesnt hide portions of avatars
        QS("#game-players .players-list").style.zIndex = "1";
        // polling for sprites, observer does not make sense since sprites take a few seconds to be activated
        setInterval(sprites.refreshCallback, 2000);
        let endboardObserver = new MutationObserver(() => { // mutation observer for game end result
            sprites.updateEndboardSprites();
            sprites.updateSprites();
        });
        endboardObserver.observe(QS(".overlay-content .result"), { childList: true, attributes: true });
        sprites.getSprites();
    }

};