// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// Object which contains image agent functions and initialisation
let imageAgent = {// func to set the image in the agentdiv
    imageIndex: 0,
    searchImages: [],
    agent: undefined,
    setAgentSource: async (searchCriteria, exclusive = 0) => {
        let word = QS("#currentWord").innerHTML;
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
        let uri = encodeURIComponent('https://www.picsearch.com/index.cgi?q=' + search);
        let resp = await fetch('https://api.allorigins.win/get?url=' + uri);
        let html = (await resp.json()).contents;
        let doc = new DOMParser().parseFromString(html, "text/html");
        imageAgent.searchImages = doc.images;
        imageAgent.imageIndex = 0;

        if (!imageAgent.searchImages[imageAgent.imageIndex * 2 + 1]) { imageAgent.agent.alt = "Error: No results found :("; imageAgent.agent.src = ""; return; }
        imageAgent.getNextAgentImage();
    },
    getNextAgentImage: () => {
        if (imageAgent.imageIndex >= imageAgent.searchImages.length) imageAgent.imageIndex = 2;
        imageAgent.agent.src = imageAgent.searchImages[imageAgent.imageIndex].src;
        scrollMessages();
        imageAgent.imageIndex++;
    },
    updateImageAgent: () => {
        // func to set imageagentbuttons visible if drawing or opposite
        let word = QS("#currentWord");
        let div = QS("#agentButtons");
        if (!div) return;
        // if player isnt drawing
        if (word.innerHTML.includes("_") || word.innerHTML == "" || localStorage.imageAgent == "false") {
            div.style.display = "none";
            QS("#containerAgent").setAttribute("class", "");
            QS("#imageAgent").setAttribute("src", "");
            QS("#imageAgent").style.display = "none";
            scrollMessages();
            return;
        }
        div.style.display = "block";
        QS("#imageAgent").style.display = "block";
        QS("#containerAgent").setAttribute("class", "updateInfo collapse in");
        scrollMessages();
    },
    initImageAgent: () => {
        let flag = document.createElement("input");
        flag.setAttribute("type", "button");
        flag.setAttribute("value", "Flag");
        flag.setAttribute("class", "btn btn-info");
        flag.setAttribute("style", "margin:0.5em; padding:0.2em");
        flag.addEventListener("click", () => { imageAgent.setAgentSource("flag"); });

        let logo = document.createElement("input");
        logo.setAttribute("type", "button");
        logo.setAttribute("value", "Logo");
        logo.setAttribute("class", "btn btn-info");
        logo.setAttribute("style", "margin:0.5em; padding:0.2em");
        logo.addEventListener("click", () => { imageAgent.setAgentSource("logo"); });

        let map = document.createElement("input");
        map.setAttribute("type", "button");
        map.setAttribute("value", "Map");
        map.setAttribute("class", "btn btn-info");
        map.setAttribute("style", "margin:0.5em; padding:0.2em");
        map.addEventListener("click", () => { imageAgent.setAgentSource("map"); });

        let random = document.createElement("input");
        random.setAttribute("type", "button");
        random.setAttribute("value", "Word");
        random.setAttribute("class", "btn btn-info");
        random.setAttribute("style", "margin:0.5em; padding:0.2em");
        random.addEventListener("click", () => { imageAgent.setAgentSource(""); });

        let text = document.createElement("input");
        text.setAttribute("type", "button");
        text.setAttribute("value", "Custom");
        text.setAttribute("class", "btn btn-warning");
        text.setAttribute("style", "margin:0.5em; padding:0.2em");
        text.addEventListener("click", () => { searchAgentInput.style.display == "none" ? searchAgentInput.style.display = "" : searchAgentInput.style.display = "none"; });

        let searchAgentInput = document.createElement("input");
        searchAgentInput.setAttribute("type", "text");
        searchAgentInput.setAttribute("class", "form-control");
        searchAgentInput.setAttribute("id", "searchAgentInput");
        searchAgentInput.setAttribute("style", "margin-bottom:0.3em; display:none");
        searchAgentInput.setAttribute("placeholder", "Input term and search with 'enter'!");
        searchAgentInput.addEventListener("keyup", (event) => {
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') imageAgent.setAgentSource(searchAgentInput.value, 1);
            event.stopPropagation();
        });

        let agentButtons = document.createElement("div");
        agentButtons.setAttribute("id", "agentButtons");
        agentButtons.setAttribute("class", "updateInfo collapse in");
        agentButtons.appendChild(flag);
        agentButtons.appendChild(logo);
        agentButtons.appendChild(map);
        agentButtons.appendChild(random);
        agentButtons.appendChild(text);
        agentButtons.appendChild(searchAgentInput);

        let containerAgent = document.createElement("div");
        containerAgent.id = "containerAgent";
        containerAgent.appendChild(agentButtons);
        containerAgent.style = "display:flex;flex-direction:column;align-items:center;";

        let agentImage = document.createElement("img");
        agentImage.setAttribute("id", "imageAgent");
        agentImage.setAttribute("style", "max-width:100%; max-height:30vh !important");
        agentImage.addEventListener("click", imageAgent.getNextAgentImage);

        containerAgent.appendChild(agentImage);
        QS("#containerSidebar").insertBefore(containerAgent, QS("#containerSidebar").firstChild);
        agentButtons.style.display = "none";
        imageAgent.agent = agentImage;

        let agentObserver = new MutationObserver(() => {
            imageAgent.updateImageAgent();
        });
        agentObserver.observe(QS("#currentWord"), { attributes: false, childList: true });
        agentObserver.observe(QS(".containerGame #containerGamePlayers"), { attributes: false, childList: true });
    }
}