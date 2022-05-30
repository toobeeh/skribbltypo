const lobbyStream = {

    // cached data to reconstruct current lobby state
    importantLobbyCache: [],

    processIncoming: (data) => {

        // if event contains data of lobby init state
        if(data[0] == "lobbyConnected") {
            lobbyStream.importantLobbyCache = [];
            lobbyStream.importantLobbyCache.push(data);
        }

        // if event contains current lobby state, set that to current
        else if(data[0] == "lobbyState") {
            lobbyStream.importantLobbyCache = lobbyStream.importantLobbyCache.filter(data => data[0] != "lobbyState");
            lobbyStream.importantLobbyCache.push(data);
        }

        // if event contains player connect
        else if(data[0] == "lobbyPlayerConnected" || data[0] == "lobbyPlayerDisconnected") {
            lobbyStream.importantLobbyCache.push(data);
        }

        // if draw comamnds are incoming
        else if(data[0] == "drawCommands") {
            lobbyStream.importantLobbyCache.push(data);
        }

        // if canvas cleared, remove draw commands
        else if(data[0] == "canvasClear") {
            lobbyStream.importantLobbyCache = lobbyStream.importantLobbyCache.filter(data => data[0] != "drawCommands" && data[0] != "canvasClear");
            lobbyStream.importantLobbyCache.push(data);
        }

        // lobby properties
        else if(["lobbyLanguage", "lobbyRounds", "lobbyDrawTime", "lobbyCustomWordsExclusive"].indexOf(data[0]) >= 0){
            lobbyStream.importantLobbyCache.push(data);
        }

        lobbyStream.client?.emit("streamdata", data);
    },
    modal: {},
    streamSettings: {
        personalCode: false,
        streamChat: true,
        onlyPalantir: false,
        spectatorWhitelist: "",
        serverWhitelist: ""
    },
    getSettings: () => {
        lobbyStream.streamSettings.personalCode = lobbyStream.modal.querySelector("#personalCode").checked;
        lobbyStream.streamSettings.chat = lobbyStream.modal.querySelector("#streamChat").checked;
        lobbyStream.streamSettings.onlyPalantir = lobbyStream.modal.querySelector("#onlyPalantir").checked;
        lobbyStream.streamSettings.spectatorWhitelist = lobbyStream.modal.querySelector("#spectatorWhitelist").value;
        lobbyStream.streamSettings.serverWhitelist = lobbyStream.modal.querySelector("#serverWhitelist").value;

        localStorage.setItem("lobbyStream", JSON.stringify(lobbyStream.streamSettings));
    },
    setSettings: () => {
        lobbyStream.streamSettings = JSON.parse(localStorage.getItem("lobbyStream"));

        lobbyStream.modal.querySelector("#personalCode").checked = lobbyStream.streamSettings.personalCode;
        lobbyStream.modal.querySelector("#streamChat").checked = lobbyStream.streamSettings.chat;
        lobbyStream.modal.querySelector("#onlyPalantir").checked = lobbyStream.streamSettings.onlyPalantir;
        lobbyStream.modal.querySelector("#spectatorWhitelist").value = lobbyStream.streamSettings.spectatorWhitelist ? lobbyStream.streamSettings.spectatorWhitelist : "";
        lobbyStream.modal.querySelector("#serverWhitelist").value = lobbyStream.streamSettings.serverWhitelist ? lobbyStream.streamSettings.serverWhitelist : "";
    },
    init: () => {

        // build UI
        // modal
        const modal = elemFromString(`<div id="modalLobbystream" style="text-align:center">

            <h4>
                Stream a lobby to let friends watch everything that happens in a lobby, as if they were in it.<br>
                <small>(You can also access this options by typing <code>stream--</code> in-game)</small>
            </h4>

            <hr>

            <h3 class="joinstream"> Join Stream</h3>
            <div class="joinstream" style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 2em; place-content: center; margin-top: 1em;">
                <span style="display:grid; place-content:center" >Enter the stream code:</span>
                <input id="streamCode" class="form-control" type="text">
                <input id="joinStream" type="button" class="btn btn-primary" value="Join Stream">
            </div>

            <hr class="joinstream">

            <h3 class="startstream">Your Stream</h3>
            <div class="startstream" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em; place-content: center; margin-top: 1em;">

                <div class="stopstream">
                    <h4>Stream code: <b id="currentStreamcode"></b></h4><br> 
                    <input id="stopStream" type="button" value="Stop the Stream" class="btn btn-danger">
                </div>

                <div>
                    Once the stream has started, send the stream code to your friends. <br> <br>
                    <input id="startStream" type="button" value="Start a Stream" class="btn btn-success">
                </div>

                <div>
                    <h4>Stream Invite Code</h4>
                    <label style="display:block; cursor: pointer"><input id="personalCode" type="checkbox"> Use personal stream code </label>
                    If you're logged in with Palantir, you can set a personal stream code.<br>
                    Set this code with the Bot command ">streamcode" in Discord.
                </div>

                <div>
                    <h4>Stream Spectator Chat</h4>
                    <label style="display:block; cursor: pointer"><input id="streamChat" checked="true" type="checkbox"> Enable stream chat </label>
                    Selecting this will enable spectators to chat in a separate chat.  <br>
                    The streamer can send messages as well, but keep in mind the chat is unmoderated. <br>
                </div>

                <div>
                    <h4>Spectator Verification</h4>
                    <label style="display:block; cursor: pointer"><input id="onlyPalantir" type="checkbox"> Let only Palantir users join </label>
                    Spectators will have to be logged in with Palantir and only can join once per account.
                </div>

                <div>
                    <h4>Spectator Whitelist</h4>
                    <input id="spectatorWhitelist" class="form-control" type="text" placeholder="Spectator Whitelist is disabled">
                    Only spectators listed here are able to join. They must have logged in with Palantir.<br>
                    Enter their Discord IDs spearated with an ",".
                </div>

                <div style="grid-column-span:2">
                    <h4>Server Whitelist</h4>
                    <input id="serverWhitelist" class="form-control" type="text" placeholder="Server Whitelist is disabled">
                    Only spectators that are connected to Palantir on the listed servers can join. <br>
                    Spectators will have to be logged in with Palantir and only can join once per account. <br>
                    Enter the Server IDs separated by ",".
                </div>
            
            </div>

        </div>`);
        lobbyStream.modal = modal;

        // read settings from localstorage
        lobbyStream.setSettings();

        // save settings to localstorage
        modal.addEventListener("click", () => {
            lobbyStream.getSettings();
        });

        // listen for stream start
        modal.querySelector("#startStream").addEventListener("click", () => {
            lobbyStream.initStream();
        });

        // listen for stream end
        modal.querySelector("#stopStream").addEventListener("click", () => {
            lobbyStream.client.disconnect();
        });

        // listen for stream spectate
        modal.querySelector("#joinStream").addEventListener("click", () => {
            const code = modal.querySelector("#streamCode").value;
            lobbyStream.initSpectate(code);
            QS(".nodalBlue").click();
        });

        // listen for incoming events
        document.addEventListener("socketdata", (event) => lobbyStream.processIncoming(event.detail));

        // stop spectating if exit
        QS(".gameHeaderButtons").addEventListener("click", () => {
            if(lobbyStream.spectating)  {
                lobbyStream.client?.disconnect();
                lobbyStream.client = null;
            }
        });

        // add streaming button
        const btn = elemFromString(`<div style="    cursor: pointer;
            position: absolute;
            width: 32px;
            height: 32px;
            right: 4px;
            top: 4px;
            opacity: .6;"
        >
        </div>`);
        btn.id="btnOpenStreamSettings"
        btn.style.bottom = "4px";
        btn.style.top = "unset";
        btn.style.transform = "scale(0.9)";
        btn.style.backgroundImage = "url(" + chrome.runtime.getURL("/res/stream.gif") + ")";
        btn.remo
        QS("#buttonAvatarCustomizerRandomize").insertAdjacentElement("beforebegin", btn);
        btn.addEventListener("click", lobbyStream.showModal);

        // add stream chat
        let container = QS("#containerChat");
        let streamChat =  QS("#boxChat").cloneNode(true);
        container.appendChild(streamChat);
        streamChat.id = "boxStreamChat";
        streamChat.style.height = "100%";
        lobbyStream.addStreamMessage = (author, message, host = false, system = false) => { 
            if(!system) streamChat.querySelector("#boxMessages").appendChild(elemFromString(`<p> ${host? "[host]" : ""} <b>${sanitize(author)}:</b> ${sanitize(message)}</p>`));
            else streamChat.querySelector("#boxMessages").appendChild(elemFromString(`<p><b>${sanitize(author)}</b> ${sanitize(message)}</p>`));
            
            let box = document.querySelector("#boxStreamChat #boxMessages");
            if (Number(getComputedStyle(box).height.replace("px","")) + box.scrollTop - box.scrollHeight < 30) {
                box.scrollTop = box.scrollHeight;
            }
        }

        let streamInput = streamChat.querySelector("input");
        streamInput.placeholder = "Chat with other stream spectators";
        streamInput.id = "";
        streamInput.parentElement.replaceWith(streamInput);
        streamInput.addEventListener("keydown", e => {
            if(e.key == "Enter"){
                if(lobbyStream.client && lobbyStream.client.connected){
                    lobbyStream.client.emit("userchat", e.target.value);
                }
                e.target.value = "";
            }
        });

        let streamMessages = streamChat.querySelector("div");
        streamMessages.style.cssText = "height: calc(100% - 34px); overflow-y: scroll;";

        // add stream chat toggle
        const switchChat = elemFromString(`<div id="toggleStreamChat">
            <span>Lobby Chat</span> <span>Stream Chat</span>
        </div>`);
        container.insertAdjacentElement("afterbegin", switchChat);
        switchChat.addEventListener("click", () => container.classList.toggle("stream"));
        
    },

    addStreamMessage: (author, message) => { },

    showModal: () => {

        // set state
        lobbyStream.modal.querySelector("#streamCode").value = "";
        new Modal(lobbyStream.modal, () => { }, "Lobby Stream");
    },

    client: null,
    spectateRules: null,
    spectating: false,

    initStream: () => {

        // clear messages
        document.querySelector("#boxStreamChat #boxMessages").innerHTML = "";

        const request = {
            settings: lobbyStream.streamSettings,
            accessToken: localStorage.accessToken
        };

        // connect to stream server
        const server = (new Date()).getDate() < 16 ? "https://typo-stream.herokuapp.com/" : "https://typo-stream-m1.herokuapp.com/";
        const host = io(server);

        // when server has accepted connection
        host.on("connect", () => {
            
            host.on("error", (msg) => { new Toast(msg) });
            
            lobbyStream.modal.classList.add("streaming");
            
            // change ui things
            lobbyStream.spectateRules = elemFromString(`<style>

                div#round:after {content: "streaming lobby";margin-left: 2em;font-style: italic;}
            
            </style>`);
            document.body.appendChild(lobbyStream.spectateRules);
            document.body.classList.toggle("streamChatEnabled", request.settings.streamChat);

            // get stream id
            let streamID = "";
            host.on("streamstart", data => {

                streamID = data;
                addChatMessage("Stream started!", "Your friends can connect to the id " + streamID);
                document.body.classList.add("streamChatEnabled");
                QS("#currentStreamcode").innerText = streamID;
                
                lobbyStream.client = host;

                // emit cached important things
                lobbyStream.importantLobbyCache.forEach(data => {
                    host.emit("streamdata", data);
                });
            });

            host.on("message", data => {
                addChatMessage(data.title, data.message);
                lobbyStream.addStreamMessage(data.title, data.message, false, true);
            });

            host.on("roomdata", data => {
                document.body.classList.toggle("streamChatEnabled", data.settings.chat);
                const spectators = data.spectators
                    .map(s => "<span>" + sanitize(s.name) + (s.id.length > 0 ? "<abbr title='Verified Palantir User: " + s.id + "'>✅</abbr>" : "") + "</span>")
                    .join(", ");
                if(spectators.length > 0) QS("#boxStreamChat #boxMessages").appendChild(elemFromString(`<p><b>Spectators: </b> ${spectators}</p>`));
                console.log(data);
            });

            host.on("roomchat", data => {
                lobbyStream.addStreamMessage(data.user, data.message, data.host);
            });

            // start as streamer
            host.emit("stream", request);

            host.on("disconnect", () => {
                document.body.classList.remove("streamChatEnabled");
                lobbyStream.modal.classList.remove("streaming");
                addChatMessage("Stream stopped.", " ");
                lobbyStream.spectateRules.remove();
            });
        });
    },

    initSpectate: (streamID) => {
        
        // clear messages
        document.querySelector("#boxStreamChat #boxMessages").innerHTML = "";

        // connect to stream server
        const server = (new Date()).getDate() < 16 ? "https://typo-stream.herokuapp.com/" : "https://typo-stream-m1.herokuapp.com/";
        const client = io(server);

        // on stream message events
        client.on("message", data => {
            addChatMessage(data.title, data.message);
            lobbyStream.addStreamMessage(data.title, data.message, false, true);
        });

        // on client connected
        client.on("connect", async () => {

            client.on("error", (msg) => { new Toast(msg) });

            QS(".modalBlur").click();
            
            lobbyStream.modal.classList.add("spectating");
            document.body.classList.add("streamChatEnabled");

            // leave lobby and go to practise
            leaveLobby();
            waitMs(100);
            showPractise();

            // register as spectator
            client.emit("spectate", {id: streamID, name: socket.clientData.playerName, accessToken: localStorage.accessToken});
            
            // change ui things
            lobbyStream.spectateRules = elemFromString(`<style>

                #formChat, #modalIdle, .containerToolbar, #votekickCurrentplayer, #brushlab, #restrictLobby, #rateDrawing, .containerSettings .form-group:last-child, #buttonLobbyPlay, .invite-container {display: none !important}
                div#round:after {content: "in  a lobby stream";margin-left: 2em;font-style: italic;}
                #canvasGame, #containerBoard {pointer-events: none};
            
            </style>`);
            document.body.appendChild(lobbyStream.spectateRules);
            lobbyStream.spectating = true;
            lobbyStream.client = client;
            if(lobbies_.joined) {
                lobbies_.joined = false;
                socket.joined = false;
                socket.leaveLobby();
            }
        });

        // on streamdata 
        client.on("streamdata", data => {
            document.dispatchEvent(newCustomEvent("fakeSocketdata", {detail: data}));
        });

        client.on("roomdata", data => {
            document.body.classList.toggle("streamChatEnabled", data.settings.chat);
            const spectators = data.spectators
                .map(s => "<span>" + sanitize(s.name) + (s.id.length > 0 ? "<abbr title='Verified Palantir User: " + s.id + "'>✅</abbr>" : "") + "</span>")
                .join(", ");
            if(spectators.length > 0) QS("#boxStreamChat #boxMessages").appendChild(elemFromString(`<p><b>Spectators: </b> ${spectators}</p>`));
            console.log(data);
        });

        client.on("roomchat", data => {
            lobbyStream.addStreamMessage(data.user, data.message, data.host);
        });

        // on disconnect
        client.on("disconnect", reason => {
            addChatMessage("The stream was stopped.", "");
            new Toast("The stream was stopped.");
            lobbyStream.spectating = false;
            lobbyStream.spectateRules.remove();
            lobbyStream.modal.classList.remove("spectating");
            document.body.classList.remove("streamChatEnabled");
            leaveLobby();
        });
    }
}