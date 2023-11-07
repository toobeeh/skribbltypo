// handles the award feature
// depends on: genericfunctions.js, socket.js
const awards = {
    state: null,
    ui: null,
    inventory: [],
    all: [],
    toggleState: async to => {
        if (to === awards.state) return;

        // check if valid rewardee and show ui
        if (to) {
            const lobbyRewardees = socket.data.publicData.onlineItems.filter(item => item.ItemType === "rewardee" && item.LobbyKey === lobbies.lobbyProperties.Key);
            const drawer = lobbies.lobbyProperties.Players.find(p => p.Drawing === true);
            if (drawer === undefined || drawer.Sender) throw new Error("no drawer according to report or self");
            const rewardee = lobbyRewardees.find(r => r.LobbyPlayerID === Number(drawer.LobbyPlayerID));
            if (rewardee !== undefined) {
                // check if user has awards to give
                const result = await socket.emitEvent("get awards", undefined, true);
                if (result.awards.length > 0) {
                    awards.inventory = result.awards;
                    awards.state = true;
                    awards.ui.style.display = "";
                }
            }
        }

        // hide ui
        else {
            awards.state = false;
            awards.ui.style.display = "none";
            awards.inventory = [];
        }
    },
    openPicker: () => {
        awards.ui.querySelector(".grid").innerHTML = awards.inventory.map(a => {
            const award = awards.all.find(f => f.id == a[0]);
            return `<div class="award" data-id="${a[1][0]}" style="background-image:url(${award.url})"></div>`;
        }).join("");
        [...awards.ui.querySelectorAll(".grid .award")].forEach(a => a.addEventListener("click", () => {
            const id = Number(a.getAttribute("data-id"));
            console.log(id);
            awards.ui.blur();
            awards.toggleState(false);
        }));
        awards.ui.focus();
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
        awards.ui.querySelector(".icon").addEventListener("click", () => awards.openPicker());
        QS("#game-canvas").appendChild(awards.ui);

        await waitMs(2000);
        awards.inventory = (await socket.emitEvent("get awards", undefined, true)).awards;
        awards.all = await (await fetch("https://api.typo.rip/awards")).json();
        awards.toggleState(true);
    }
}