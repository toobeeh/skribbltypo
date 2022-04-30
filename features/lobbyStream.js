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

    init: () => {

        // listen for incoming events
        document.addEventListener("socketdata", (event) => lobbyStream.processIncoming(event.detail));

        // close if exited
        QS(".gameHeaderButtons").addEventListener("click", () => {
            lobbyStream.client?.disconnect();
            lobbyStream.listeners = [];
            lobbyStream.client = null;
        });
    },

    client: null,
    spectateRules: null,
    spectating: false,

    initStream: () => {

        // connect to stream server
        const host = io("https://typo-stream.herokuapp.com/");

        // when server has accepted connection
        host.on("connect", () => {
            
            // get stream id
            let streamID = "";
            host.on("streamstart", data => {

                streamID = data;
                addChatMessage("Stream started!", "Your friends can connect to the id " + streamID);
                
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
            host.emit("stream");
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

            // leave lobby and go to practise
            leaveLobby();
            waitMs(100);
            showPractise();

            // register as spectator
            client.emit("spectate", {id: streamID, name: socket.clientData.playerName});
            
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
            leaveLobby();
        });
    }
}