// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Object which contains image agent functions and initialisation
let imageAgent = {// func to set the image in the agentdiv
    imageIndex: 0,
    searchImages: [],
    agent: undefined,
    setAgentSource: async (searchCriteria, exclusive = false) => {
        let word = getCurrentWordOrHint();
        let search = (exclusive ? "" : word + "+") + searchCriteria;
        search = replaceUmlaute(search);
        imageAgent.agent.src = "/res/load.gif";

        // Search engines with CORS bypass:
        // Google, duckduckgo etc detect bot usage -> unusable
        // Not working after few requests due to bot detection or smth:     https://yandex.com/images/search?text=hello%20kitty
        // Working but a bit weird results:                                 https://www.mojeek.com/search?fmt=images&imgpr=bing&q=
        // Probably best - wikimedia: https://commons.wikimedia.org/wiki/Special:MediaSearch?type=bitmap&q= LOL NO SO WEIRD
        // Sooo weird  https://search.aol.com/aol/image;?q=
        // lets give it a try https://www.picsearch.com/index.cgi?q=einhorn
        // nice pakistani https://searchoye.com/search?q=&engine=5#gsc.tab=0&gsc.q=
        // hehe finally my own scraper: https://typo-agent-scraper.herokuapp.com/param
        let param = encodeURIComponent(search);

        const server = (window.location.hostname.split(".")[0] == "pbt" ? "https://api.allorigins.win/raw?url=" : "") + ((new Date()).getDate() < 16 ? "https://typo-agent-scraper.herokuapp.com/" : "https://typo-agent-scraper-m1.herokuapp.com/");

        let resp = await fetch(server + param);
        results = await resp.json();
        imageAgent.searchImages = (results).slice(2);
        imageAgent.imageIndex = 0;

        if (!imageAgent.searchImages[0]) { imageAgent.agent.alt = "Error: No results found :("; imageAgent.agent.src = ""; return; }
        imageAgent.getNextAgentImage();
    },
    getNextAgentImage: () => {
        if (imageAgent.imageIndex >= imageAgent.searchImages.length) imageAgent.imageIndex = 0;
        imageAgent.agent.src = imageAgent.searchImages[imageAgent.imageIndex];
        scrollMessages();
        imageAgent.imageIndex++;
    },
    updateImageAgent: () => {
        // func to set imageagentbuttons visible if drawing or opposite
        let word = getCurrentWordOrHint();
        // if player isnt drawing
        if (word.includes("_") || word == "" || localStorage.agent == "false") {
            imageAgent.agent.src = "";
            QS("#imageAgent").style.display = "none";
            scrollMessages(true);
        }
        else {
            QS("#imageAgent").style.display = "";
            scrollMessages();
        }
    },
    initImageAgent: () => {
        let agentElem = elemFromString(`<div id="imageAgent">
<div>
<button class="flatUI blue min air">Flag</button>
<button class="flatUI blue min air">Logo</button>
<button class="flatUI blue min air">Map</button>
<button class="flatUI blue min air">Word</button>
</div>
<input type="text" class="flatUI" placeholder="Search text with 'enter'">
<div><img></div>

</div>`);

        [...agentElem.querySelectorAll("button")].forEach((btn) => {
            btn.addEventListener("click", () => imageAgent.setAgentSource(btn.innerText));
        });
        agentElem.querySelector("input").addEventListener("keydown", (event) => {
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') imageAgent.setAgentSource(agentElem.querySelector("input").value, true);
            event.stopPropagation();
        });
        imageAgent.agent = agentElem.querySelector("img");
        imageAgent.agent.addEventListener("click", imageAgent.getNextAgentImage);
        QS("#game-chat").insertAdjacentElement("afterbegin", agentElem);
        let agentObserver = new MutationObserver(() => {
            imageAgent.updateImageAgent();
        });
        agentObserver.observe(QS("#game-word"), { attributes: true, subtree:true, childList: true });
    }
}