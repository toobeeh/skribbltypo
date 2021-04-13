// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// adds emoji replacement
const emojis = {
    emojis : [],
    init: async () => {
        // load emojis in worker to avoid blocking ui
        let workerJS = await (await fetch(chrome.runtime.getURL("features/emojiLoadWorker.js"))).text();
        let loadWorker = new Worker(URL.createObjectURL(new Blob([(workerJS)], { type: 'application/javascript' })));
        loadWorker.addEventListener('message', message => {
            emojis.emojis = message.data;
        });
        QS("#emojiPrev").style.maxHeight = "80%";
        QS("#emojiPrev").style.overflowY = "auto";
        // show emoji preview on chat type
        QS("#inputChat").addEventListener("input", (e) => {
            let val = QS("#inputChat").value;
            let lastsplit = val.indexOf(":") >= 0 ? val.split(":").pop() : "";
            if (lastsplit == "" || e.key == "Enter") {
                QS("#emojiPrev").style.display = "none";
            }
            else {
                let setEmojis = (limit) => {
                    QS("#emojiPrev").style.display = "";
                    let content = "";
                    let search = emojis.search(lastsplit).splice(0, limit);
                    if (!search.length || search.length <= 0) {
                        QS("#emojiPrev").style.display = "none";
                        return;
                    }
                    search.forEach(
                        emoji => content +=
                            "<span style='background-color: rgba(0,0,0,0.1); display: inline-block;cursor: pointer; border-radius: 0.3em; padding:0.1em; margin: .2em;'>" +
                            emoji.name + " <span style='position:relative; bottom: -0.25em; display: inline-block;height: 1em;background-size: contain;background-repeat:no-repeat;width:1em;image-rendering: auto;background-image: url( " + emoji.url + ");'></span>" +
                            "</span>"
                    );
                    if (limit < 100) content += "<br><span style='color:black' id='loadingHintEmojis'>Loading more...</span>";
                    QS("#emojiPrev").innerHTML = content;
                    [...QSA("#emojiPrev > span:not(#loadingHintEmojis)")].forEach(emoji => emoji.addEventListener("click", () => {
                        QS("#inputChat").value = QS("#inputChat").value.replace(":" + lastsplit, ":" + emoji.textContent.trim() + ":");
                        QS("#inputChat").dispatchEvent(newCustomEvent("input"));
                        QS("#inputChat").focus();
                    }));
                }
                setEmojis(50);
                setTimeout(() => { if (QS("#inputChat").value == val) setEmojis(500); }, 2000);                
            }
        });
    },
    get: (name) => emojis.emojis.find(emoji => emoji.name == name),
    search: (name) => emojis.emojis.filter(emoji => emoji.name.indexOf(name) >= 0).sort((a,b)=>a.name.length - b.name.length),
    replaceEmojiContent: (node) => {
        const matches = node.innerHTML.matchAll(new RegExp(":([A-Za-z0-9\-\_]+):", "g"));
        for (const match of matches) {
            let id = Math.floor(Math.random() * 1000);
            let emoji = emojis.get(match[1]);
            if (emoji) node.innerHTML = node.innerHTML.replace(match[0],
                "<style> .emoji-" + emoji.name + id + ":hover:after {color:white; word-break:none;font-weight:500; letter-spacing:.05em; content:'։" + emoji.name + "։'; position: absolute; right:2.5em;background: #333333e0; padding: .5em; border-radius: .2em;}" +
                ".emoji-" + emoji.name + id + ":hover:before {content: '';border-style: solid;border-width: .5em 0 .5em .5em;border-color: transparent transparent transparent #333333e0;position: absolute;right: 2em;top: .5em;}</style>" +
                "<span class='emoji-" + emoji.name + id + "' style='position:relative; z-index:1; bottom: -0.5em; display: inline-block;height: 2em;background-size: contain;background-repeat:no-repeat;width:2em;image-rendering: auto;background-image: url( " + emoji.url + ");'></span>");
            let emojiSpan = node.querySelector("span > span").getBoundingClientRect();
            let span = node.getBoundingClientRect();
            if (emojiSpan.left - span.left < span.right - emojiSpan.right) {
                let style = node.querySelector("style");
                style.innerHTML = ".emoji-" + emoji.name + id + ":hover:after {width:fit-content; color:white; word-break:none;font-weight:500; letter-spacing:.05em; content:'։" + emoji.name + "։'; position: absolute; left:2.5em;background: #333333e0; padding: .5em; border-radius: .2em;}" +
                    ".emoji-" + emoji.name + id + ":hover:before {content: '';border-style: solid;border-width: .5em .5em .5em 0;border-color: transparent #333333e0 transparent transparent; position: absolute;left: 2em; top: .5em;}";
            }
          
        }
        // if scrolled very down, scroll to view full emoji height
        if (Math.floor(node.parentElement.scrollHeight - node.parentElement.scrollTop) <= node.parentElement.clientHeight + 30) scrollMessages();
    }
};