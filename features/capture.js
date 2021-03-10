// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

// captures drawings and actions on canvas
// depends on: genericfunctions.js
const captureCanvas = {
    capturedCommands: [],
    capturedActions: [[[3]]],
    capturedDrawings: [],
    abortDrawingProcess: false,
    pushCaptured: () => {
        // put commands in array (each index is one action aka mouseup on canvas)
        if (captureCanvas.capturedCommands.length > 0) {
            captureCanvas.capturedActions.push(captureCanvas.capturedCommands);
            captureCanvas.capturedCommands = [];
        }
    },
    getCapturedActions: () => {
        // request captured actions and unpushed commands
        return captureCanvas.capturedCommands.length > 0 ?
            captureCanvas.capturedActions.concat([[...captureCanvas.capturedCommands]]) :
            captureCanvas.capturedActions;
    },
    restoreDrawing: (limit = 0) => {
        // func to restore drawing based on saved commands
        let restore = QS("#restore");
        restore.style.pointerEvents = "none";
        QS("#canvasGame").style.pointerEvents = "none";
        let actions = captureCanvas.getCapturedActions();
        actions = actions.slice(0, actions.length - limit);
        let redo = [];
        // put all commands from each action in one command-array. the last actions (limit) are passed.
        for (let action = 0, lenA = actions.length - limit; action < lenA; action++)
            for (let cmd = 0, lenC = actions[action].length; cmd < lenC; cmd++)
                actions[action][cmd].length > 0 && redo.push(actions[action][cmd]);
        // search for the last clear to avoid unnecessary drawing
        let lastClear = redo.length - 1;
        while (lastClear > 0 && redo[lastClear][0] != 3) { lastClear--; }
        let captured = lastClear > 0 ? lastClear + 1 : 0;
        let maxcaptured = redo.length;
        QS("#buttonClearCanvas").dispatchEvent(newCustomEvent("click"));
        let t = setInterval(function () {
            if (captured >= maxcaptured) {
                clearInterval(t);
                restore.style.pointerEvents = "";
                QS("#canvasGame").style.pointerEvents = "";
                setTimeout(() => {
                    captureCanvas.capturedActions = actions;
                    captureCanvas.capturedCommands = [];
                }, 100);
            }
            else document.body.dispatchEvent(newCustomEvent("performDrawCommand", { detail: redo[captured] }));
            captured++;
        }, 5);
    },
    drawOnCanvas: (drawActions) => {
        // function to draw selected draw commands separated in actions
        captureCanvas.abortDrawingProcess = false;
        QS("#abortDrawing").style.display = "block";
        let restore = document.querySelector("#restore");
        restore.style.pointerEvents = "none";
        QS("#canvasGame").style.pointerEvents = "none";
        if (QS("#clearCanvasBeforePaste").checked) QS("#buttonClearCanvas").dispatchEvent(newCustomEvent("click"));
        let commands = [];
        let command = 0;
        let toolbar = QS(".containerToolbar");
        drawActions.forEach(a => a.forEach(c => commands.push(c)));
        let i = setInterval(() => {
            if (command >= commands.length || captureCanvas.abortDrawingProcess === true || toolbar.style.display == "none") {
                clearInterval(i);
                captureCanvas.abortDrawingProcess = false;
                QS("#abortDrawing").style.display = "none";
                restore.style.pointerEvents = "";
                QS("#canvasGame").style.pointerEvents = "";
            }
            else document.body.dispatchEvent(newCustomEvent("performDrawCommand", { detail: commands[command] }));
            command++;
        }, 5);
    },
    initListeners: () => {
        // capture drawings
        document.body.addEventListener("logDrawCommand", e => {
            captureCanvas.capturedCommands.push(e.detail);
        });
        // log canvas clear in actions array
        document.body.addEventListener("logCanvasClear", () => {
            captureCanvas.capturedCommands = [];
            captureCanvas.capturedActions = [[[3]]];
        });
        // puts the image data in array to be displayable in the image share popup
        document.body.addEventListener("drawingFinished", async () => {
            captureCanvas.capturedDrawings.push({
                drawing: QS("#canvasGame").toDataURL("2d"),
                drawer: getCurrentOrLastDrawer(),
                word: QS("#currentWord").innerText
            });
            await socket.emitEvent("store drawing", {
                meta: {
                    name: sessionStorage.lastWord ? sessionStorage.lastWord : QS("#currentWord").innerText,
                    author: getCurrentOrLastDrawer(),
                    own: getCurrentOrLastDrawer() == socket.clientData.playerName,
                    language: lobbies_.lobbyProperties.Language,
                    private: lobbies_.lobbyProperties.Private
                },
                commands: captureCanvas.getCapturedActions(),
                uri: QS("#canvasGame").toDataURL()
            }, true, 5000)
        });
        QS("#canvasGame").addEventListener("pointerup", captureCanvas.pushCaptured);
        QS("#canvasGame").addEventListener("pointerout", captureCanvas.pushCaptured);
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
*/