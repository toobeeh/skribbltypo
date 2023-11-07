// handles the award feature
// depends on: genericfunctions.js, socket.js
const awards = {
    state: true,
    ui: null,
    inventory: [],
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
    setup: () => {

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

        awards.ui = elemFromString(`<div id="awardsAnchor" data-typo-tooltip='Award this special drawing' data-tooltipdir='W'>
            <div class="icon"></div>
        </div>     
        `);
        awards.ui.querySelector(".icon").style.backgroundImage = "url(" + chrome.runtime.getURL("res/noChallenge.gif") + ")";
        QS("#game-canvas").appendChild(awards.ui);
    }
}