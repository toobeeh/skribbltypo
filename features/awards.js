// handles the award feature
// depends on: genericfunctions.js, socket.js
const awards = {
    state: null,
    ui: null,
    inventory: [],
    cloudAwardLink: undefined,
    all: [],
    toggleState: async to => {

        // check if valid rewardee and show ui
        if (to) {
            const lobbyRewardees = socket.data.publicData.onlineItems.filter(item => item.ItemType === "rewardee" && item.LobbyKey === lobbies.lobbyProperties.Key);
            const drawer = lobbies.lobbyProperties.Players.find(p => p.Drawing === true);
            if (drawer === undefined || drawer.Sender) {
                awards.toggleState(false);
                return;
            }
            const rewardee = lobbyRewardees.find(r => r.LobbyPlayerID === Number(drawer.LobbyPlayerID));
            if (rewardee !== undefined) {
                // check if user has awards to give
                const result = await socket.emitEvent("get awards", undefined, true);
                if (result.awards.length > 0) {
                    awards.inventory = result.awards;
                    awards.state = true;
                    awards.ui.style.display = "";

                    awards.openPicker = () => {

                        // build clickable icons
                        awards.ui.querySelector(".grid").innerHTML = awards.inventory.map(a => {
                            const award = awards.all.find(f => f.id == a[0]);
                            return `<div class="award" data-id="${a[1][0]}" data-award="${a[0]}" style="background-image:url(${award.url})"></div>`;
                        }).join("");

                        // add eventlisteners
                        [...awards.ui.querySelectorAll(".grid .award")].forEach(a => a.addEventListener("click", async () => {
                            const awardId = Number(a.getAttribute("data-award"));
                            const id = Number(a.getAttribute("data-id"));
                            awards.ui.blur();
                            awards.toggleState(false);
                            await socket.emitEvent("give award", { lobbyPlayerId: rewardee.LobbyPlayerID, awardInventoryId: id }, true);
                        }));
                        awards.ui.focus();
                    };
                }
                else {
                    awards.toggleState(false);
                    return;
                }
            }
            else {
                awards.toggleState(false);
                return;
            }
        }

        // if awards not activated, hide ui
        else {
            awards.awardee = undefined;
            awards.state = false;
            awards.ui.style.display = "none";
            awards.inventory = [];
            awards.openPicker = undefined;
        }
    },
    openPicker: undefined,
    presentAward: (id, invId, from, to) => {
        const award = awards.all.find(a => a.id == id);
        if (award === undefined) return;

        const isAwardee = lobbies.lobbyProperties.Players.find(p => p.Sender === true && p.LobbyPlayerID == to);
        const getIdname = id => document.querySelector(`[playerid='${id}'] .player-name`).textContent.replace("(You)", "").trim();

        if (localStorage.awardfx == "true") {
            const object = elemFromString(`<div id="awardPresentation" style="background-image: url(${award.url})"></div>`);
            QS("#game-canvas").appendChild(object);
            const animation = object.animate([
                {
                    opacity: 0,
                    backgroundSize: "100%"
                },
                {
                    opacity: 1,
                    backgroundSize: "30px"
                },
                {
                    opacity: 1,
                    backgroundSize: "48px"
                },
                {
                    opacity: 1,
                    backgroundSize: "48px"
                },
                {
                    opacity: 0,
                    backgroundSize: "48px"
                },
            ], {
                duration: 3000,
                easing: "ease-out"
            });
            animation.onfinish = () => object.remove();
        }

        let msg;
        if (isAwardee) {
            awards.cloudAwardLink = invId;
            msg = getIdname(from) + " awarded your drawing with a '" + award.name + "'!";
        }
        else msg = getIdname(from) + " awarded the drawing of " + getIdname(to) + " with a '" + award.name + "'!";

        QS(".chat-content").appendChild(elemFromString(`<div style='display:flex; color: var(--COLOR_CHAT_TEXT_DRAWING); background-color: inherit'><div class="awardChatIcon" style="display: grid; place-content: center; width:3em; margin-left:1em; background-image:url(${award.url})"></div> <p style="flex-grow:1; padding-left: 1em;background-color: inherit"> ${msg} </div> </div>`));
        scrollMessages(true);
    },
    setup: async () => {

        let enabler = new MutationObserver((mutations) => {
            console.log(QS("#game-rate").style.display);
            if (QS("#game-rate").style.display !== "none") awards.toggleState(true);
        });
        enabler.observe(QS("#game-rate"), { attributes: true, attributeFilter: ['style'] });

        // hide controls
        document.addEventListener("drawingFinished", async (data) => {
            awards.toggleState(false);
        });
        document.addEventListener("lobbyConnected", () => {
            awards.toggleState(false);
            awards.toggleState(true);
        });

        awards.ui = elemFromString(`<div tabindex="0" id="awardsAnchor" data-typo-tooltip='Award this special drawing' data-tooltipdir='W'>
            <div class="icon"></div>
            <div id="awardsInventory">
                <h2 style="display:none">Award Inventory</h2>
                <div class="grid"></div>
            </div>
        </div>     
        `);
        awards.ui.querySelector(".icon").style.backgroundImage = "url(" + chrome.runtime.getURL("res/noChallenge.gif") + ")";
        awards.ui.querySelector(".icon").addEventListener("click", () => awards.openPicker?.());
        QS("#game-canvas").appendChild(awards.ui);

        // await waitMs(5000);
        // awards.inventory = (await socket.emitEvent("get awards", undefined, true)).awards;

        // workaround to using without permission temporarily - depends on cloudflare worker
        awards.all = await typoApiFetch("awards");
        awards.toggleState(false);
    }
}