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
        autoStart: false,
        onlyPalantir: false,
        spectatorWhitelist: "",
        serverWhitelist: ""
    },
    getSettings: () => {
        lobbyStream.streamSettings.personalCode = lobbyStream.modal.querySelector("#personalCode").checked;
        lobbyStream.streamSettings.autoStart = lobbyStream.modal.querySelector("#autoStart").checked;
        lobbyStream.streamSettings.onlyPalantir = lobbyStream.modal.querySelector("#onlyPalantir").checked;
        lobbyStream.streamSettings.spectatorWhitelist = lobbyStream.modal.querySelector("#spectatorWhitelist").value;
        lobbyStream.streamSettings.serverWhitelist = lobbyStream.modal.querySelector("#serverWhitelist").value;

        localStorage.setItem("lobbyStream", JSON.stringify(lobbyStream.streamSettings));
    },
    setSettings: () => {
        lobbyStream.streamSettings = JSON.parse(localStorage.getItem("lobbyStream"));

        lobbyStream.modal.querySelector("#personalCode").checked = lobbyStream.streamSettings.personalCode;
        lobbyStream.modal.querySelector("#autoStart").checked =lobbyStream.streamSettings.autoStart;
        lobbyStream.modal.querySelector("#onlyPalantir").checked = lobbyStream.streamSettings.onlyPalantir;
        lobbyStream.modal.querySelector("#spectatorWhitelist").value = lobbyStream.streamSettings.spectatorWhitelist;
        lobbyStream.modal.querySelector("#serverWhitelist").value = lobbyStream.streamSettings.serverWhitelist;
    },
    init: () => {

        // listen for incoming events
        document.addEventListener("socketdata", (event) => lobbyStream.processIncoming(event.detail));

        // close if exited
        QS(".gameHeaderButtons").addEventListener("click", () => {
            lobbyStream.client?.disconnect();
            lobbyStream.listeners = [];
            lobbyStream.client = null;
        });

        // build UI
        // modal
        const modal = elemFromString(`<div id="modalLobbystream" style="text-align:center">

            <h4>
                Stream a lobby to let friends watch everything that happens in a lobby, as if they were in it.
            </h4>

            <hr>

            <h3 class="joinstream" >Join Stream</h3>
            <div class="joinstream" style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 2em; place-content: center; margin-top: 1em;">
                <span>Enter the stream code:</span>
                <input id="streamCode" class="form-control" type="text">
                <input id="joinStream" type="button" class="btn btn-primary" value="Join Stream">
            </div>

            <hr class="joinstream">

            <h3 class="startstream">Start Stream</h3>
            <div class="startstream" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em; place-content: center; margin-top: 1em;">

                <div class="stopstream">
                    <input id="stopStream" type="button" value="Stop the Stream" class="btn btn-danger">
                    <h4>Stream code: <b id="currentStreamcode"></b></h4>
                </div>

                <div>
                    <input id="startStream" type="button" value="Start a Stream" class="btn btn-success"><br><br>
                    Once the stream has started, send the stream code to your friends.
                </div>

                <div>
                    <h4>Stream Invite Code</h4>
                    <label style="display:block; cursor: pointer"><input id="personalCode" type="checkbox"> Use personal stream code </label>
                    If you're logged in with Palantir, you can set a personal stream code.<br>
                    Set this code with the Bot command ">streamcode" in Discord.
                </div>

                <div>
                    <h4>Auto-Start Stream</h4>
                    <label style="display:block; cursor: pointer"><input id="autoStart"  type="checkbox"> Start stream on lobby join </label>
                    Selecting this will automatically start a stream whenever you join a lobby. <br>
                    Useful when you have set a personal stream code and want friends to be able to watch all the time.
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
        });
    },

    client: null,
    spectateRules: null,
    spectating: false,

    initStream: () => {

        const request = {
            settings: lobbyStream.streamSettings,
            accessToken: localStorage.accessToken
        };

        // connect to stream server
        const host = io("https://typo-stream.herokuapp.com/");

        // when server has accepted connection
        host.on("connect", () => {
            
            host.on("error", (msg) => { new Toast(msg) });
            
            lobbyStream.modal.classList.add("streaming");

            // get stream id
            let streamID = "";
            host.on("streamstart", data => {

                streamID = data;
                addChatMessage("Stream started!", "Your friends can connect to the id " + streamID);
                QS("#currentStreamcode").innerText = streamID;
                
                lobbyStream.client = host;

                // emit cached important things
                lobbyStream.importantLobbyCache.forEach(data => {
                    host.emit("streamdata", data);
                });
            });

            host.on("message", data => {
                addChatMessage(data.title, data.message);
            });

            // start as streamer
            host.emit("stream", request);

            host.on("disconnect", () => {
                lobbyStream.modal.classList.remove("streaming");
                addChatMessage("Stream stopped.", " ");
            });
        });
    },

    initSpectate: (streamID) => {

        // connect to stream server
        const client = io("https://typo-stream.herokuapp.com/");

        // on stream message events
        client.on("message", data => {
            addChatMessage(data.title, data.message);
        });

        // on client connected
        client.on("connect", async () => {

            client.on("error", (msg) => { new Toast(msg) });
            
            lobbyStream.modal.classList.add("spectating");

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

        // on disconnect
        client.on("disconnect", reason => {
            addChatMessage("The stream was stopped.", "");
            new TransformStream("The stream was stopped.");
            lobbyStream.spectating = false;
            lobbyStream.spectateRules.remove();
            lobbyStream.modal.classList.remove("spectating");
            leaveLobby();
        });
    }
}