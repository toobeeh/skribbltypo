// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// captures drawings and actions on canvas
// depends on: genericfunctions.js
const captureCanvas = {
    capturedCommands: [],
    capturedDrawings: [],
    abortDrawingProcess: false,
    drawOnCanvas: async (commands) => {
        // function to draw selected draw commands separated in actions
        captureCanvas.abortDrawingProcess = false;
        //QS("#abortDrawing").style.display = "block";
        QS("#game-canvas canvas").style.pointerEvents = "none";
        //if (QS("#clearCanvasBeforePaste").checked) QS(".tools .tool div.icon[style*='clear.gif']").dispatchEvent(newCustomEvent("click"));
        for (dc of commands) {
            if (captureCanvas.abortDrawingProcess === true || QS("#game-toolbar.hidden")) {
                QS("#game-canvas canvas").style.pointerEvents = "";
                return;
            }
            if (dc.length == 1 && dc[0] == 3) QS(".toolbar-group-actions .tool div.icon[style*='clear.gif']").dispatchEvent(newCustomEvent("click"));
            else document.dispatchEvent(newCustomEvent("performDrawCommand", { detail: dc }));
            captureCanvas.capturedCommands.push(dc);
            await waitMs(3);
        }
        QS("#game-canvas canvas").style.pointerEvents = "";
    },
    initListeners: () => {
        // capture drawings
        document.addEventListener("logDrawCommand", e => {
            captureCanvas.capturedCommands.push(e.detail);
        });
        // capture redos
        document.addEventListener("logRedo", e => {
            captureCanvas.capturedCommands = e.detail;
        });
        // clear captured comamnds on canvasclear
        document.addEventListener("logCanvasClear", () => {
            captureCanvas.capturedCommands = [[3]];
        });
        // puts the image data in array to be displayable in the image share popup
        document.addEventListener("drawingFinished", async (data) => {
            captureCanvas.capturedDrawings.push({
                drawing: QS("#game-canvas canvas").toDataURL("2d"),
                drawer: getCurrentOrLastDrawer(),
                word: data.detail,
                hint: "(" + data.detail.length + ")"
            });

            try {

                const response = await typoApiFetch(`/cloud/${socket.data.user.member.UserLogin}`, "POST", undefined, {
                    name: data.detail,
                    author: getCurrentOrLastDrawer(),
                    inPrivate: lobbies.lobbyProperties.Private,
                    language: lobbies.lobbyProperties.Language,
                    isOwn: getCurrentOrLastDrawer() == socket.clientData.playerName,
                    commands: captureCanvas.capturedCommands,
                    imageBase64: QS("#game-canvas canvas").toDataURL().replace("data:image/png;base64,", "")
                }, localStorage.accessToken, true);

                if(awards.cloudAwardLink !== undefined && response.id !== undefined){
                    await typoApiFetch(`/cloud/${socket.data.user.member.UserLogin}/${response.id}/award/${awards.cloudAwardLink}`, "PATCH", undefined, undefined, localStorage.accessToken, false);
                    console.log("Awarded drawing with id " + response.id + " with award id " + awards.cloudAwardLink);
                }

                /*await socket.emitEvent("store drawing", {
                    meta: {
                        name: data.detail,
                        author: getCurrentOrLastDrawer(),
                        own: getCurrentOrLastDrawer() == socket.clientData.playerName,
                        language: lobbies.lobbyProperties.Language,
                        private: lobbies.lobbyProperties.Private,
                        thumbnail: await scaleDataURL(QS("#game-canvas canvas").toDataURL("2d"), QS("#game-canvas canvas").width / 10, QS("#game-canvas canvas").height / 10)
                    },
                    linkAwardId: awards.cloudAwardLink,
                    commands: captureCanvas.capturedCommands,
                    uri: QS("#game-canvas canvas").toDataURL()
                }, true, 5000);*/
            }
            catch { }
            awards.cloudAwardLink = undefined;
        });
    }
}

/*
    Draw Report message format:
        Draw:   ["drawCommands", [C1], [C2], ..., [C8]]
        Clear:  ["clearCanvas"]

    Draw command format:
        Brush:  [m, c, s, x1, y1, x2, y2]
        Fill:   [m, c, x1, y1]
        Erase:  [m, s, x1, y1, x2, y2]
        Clear:  [m] (Only custom logged)

    Parameter values:
        Mode    m: 0 (Brush), 1 (Erase), 2 (Fill), 3 (Clear - Only custom report to content script, originally sent as "clearCanvas" report message)
        Color   c: 0-22 (Column-wise skribbl colors, left to right)
        Vector  x: 0-800
        Vector  y: 0-600

xt: get color of index
*/