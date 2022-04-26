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

        lobbyStream.listeners.forEach(l => {
            l.send(data);
        });

    },

    init: () => {

        // listen for incoming events
        document.addEventListener("socketdata", (event) => lobbyStream.processIncoming(event.detail));

        // close if exited
        QS(".gameHeaderButtons").addEventListener("click", ()=>{
            lobbyStream.listeners.forEach(l => l.close());
            client?.destroy();
            lobbyStream.listeners = [];
            lobbyStream.client = null;
        });
    },

    client: null,
    listeners: [],
    spectateRules: null,

    initStream: () => {
        const id = "typoStrm_" + (Math.ceil(Math.random() * Date.now())).toString(16);
        const host = new Peer(id);

        // wait until host is ready
        host.on("open", () => {
            addChatMessage("Lobby is being streamed", " Spectators can connect to the id: " + host.id);
            lobbyStream.client = host;

            // create new connection handler
            host.on("connection", conn => {
                
                let spectatorName = "";

                // listen to data sent by spectator
                conn.on("data", data => {

                    // if spectator is ready, start sending data
                    if(data.spectator){

                        spectatorName = data.spectator;
                        addChatMessage("New Spectator", spectatorName + " joined your stream");
                        lobbyStream.importantLobbyCache.forEach(item => conn.send(item));
                        lobbyStream.listeners.push(conn);
                    }
                });

                conn.on("close", () => {
                    addChatMessage("", spectatorName + " left the stream");
                });
            });
        });
    },

    initSpectate: (streamID) => {
        const id = "typoSpct_" + (Math.ceil(Math.random() * Date.now())).toString(16);
        const peer = new Peer(id);

        peer.on("error", (e) => {
            addChatMessage("Something went wrong while spectating.", " Details can be found in the browser console.");
            console.log(e);
        });

        // wait until peer is initialized
        peer.on("open", () => {

            // connect to lobby host
            const connection = peer.connect(streamID);
            connection.on("open", (e) => {
                addChatMessage("Spectating lobby now!", "");

                // emit ready
                connection.send({spectator: socket.clientData.playerName});

                // listen for hosts events
                connection.on("data", data => {

                    sessionStorage.inStream = true;
                    document.dispatchEvent(newCustomEvent("fakeSocketdata", {detail: data}));
                });

                // change ui things
                lobbyStream.spectateRules = elemFromString(`<style>

                    #formChat, .containerToolbar, #votekickCurrentplayer, #brushlab {display: none}
                    div#round:after {content: "in  a lobby stream";margin-left: 2em;font-style: italic;}
                
                </style>`);
                document.body.appendChild(lobbyStream.spectateRules);
            });

            // listen to close
            connection.on("close", () => {
                addChatMessage("The stream was stopped.", "");
                sessionStorage.inStream = false;
                lobbyStream.spectateRules.remove();
            });
        });
    }
}