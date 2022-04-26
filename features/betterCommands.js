// Only way to catch errors since: https://github.com/mknichel/javascript-errors#content-scripts. Paste in every script which should trace bugs.
window.onerror = (errorMsg, url, lineNumber, column, errorObj) => { if (!errorMsg) return; errors += "`❌` **" + (new Date()).toTimeString().substr(0, (new Date()).toTimeString().indexOf(" ")) + ": " + errorMsg + "**:\n" + ' Script: ' + url + ' \nLine: ' + lineNumber + ' \nColumn: ' + column + ' \nStackTrace: ' + errorObj + "\n\n"; }

/*
 * Extends service.js contentscript
  Command detection:
  - commands are registered in the commands array
  - consist of actions
  - performCommand finds a suitable comamnd & executes the ommands actions with applied parameters / arguemnts

    heheheh now this is finally hot reworked code and not a fucking mess anymore
*/

const commands = [
    {
        command: "charbar",
        options: {
            type: "toggle",
            description: "Sets the charbar visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.charBar = "true";
            },
            actionDisable: () => {
                localStorage.charBar = "false";
            },
            actionAfter: (args) => {
                QS("#inputChat").dispatchEvent(new Event("keyup"));
            },
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " char count.";
            }
        }
    }, {
        command: "controls",
        options: {
            type: "toggle",
            description: "Sets the controls visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.controls = "true";
                QS("#controls").style.display = "flex";
            },
            actionDisable: () => {
                localStorage.controls = "false";
                QS("#controls").style.display = "none";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " controls.";
            }
        }
    }, {
        command: "palantir",
        options: {
            type: "toggle",
            description: "Sets the palantir visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.palantir = "true";
                lobbies_.userAllow = true;
                if (lobbies_.inGame && !lobbies_.joined) {
                    socket.joinLobby(lobbies_.lobbyProperties.Key);
                    lobbies_.joined = true;
                }
                if (lobbies_.inGame) socket.setLobby(lobbies_.lobbyProperties, lobbies_.lobbyProperties.Key);
            },
            actionDisable: () => {
                localStorage.palantir = "false";
                lobbies_.userAllow = false;
                if(lobbies_.joined) socket.leaveLobby();
                lobbies_.joined = false;
            },
            actionAfter: null,
            response: (state) => {
                return "You're now " + (state ? "visible" : "invisible") + " on Palantir.";
            }
        }
    }, {
        command: "clr",
        options: {
            type: "action",
            description: "Deletes the last 50 messages.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                let elems = [...QSA("#boxMessages > *")];
                if (elems.length > 50) elems = elems.slice(0, -50);
                elems.forEach(elem => elem.remove());
            },
            response: (args) => {
                return "Removed last 50 messages, if existent.";
            }
        }
    }, {
        command: "chatcommands",
        options: {
            type: "toggle",
            description: "Sets the chat command detection feature. Lol, how r u gonne enable this again?",
            actionBefore: null,
            actionEnable: () => {
                localStorage.chatcommands = "true";
            },
            actionDisable: () => {
                localStorage.chatcommands = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " chat commands.";
            }
        }
    }, {
        command: "experimental",
        options: {
            type: "toggle",
            description: "Sets the experimental features.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.experimental = "true";
            },
            actionDisable: () => {
                localStorage.experimental = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " experimental features.";
            }
        }
    }, {
        command: "emojipicker",
        options: {
            type: "toggle",
            description: "Sets the emoji picker visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.emojipicker = "true";
            },
            actionDisable: () => {
                localStorage.emojipicker = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " the emoji picker.";
            }
        }
    }, {
        command: "drops",
        options: {
            type: "toggle",
            description: "Sets the drop visibility.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.drops = "true";
            },
            actionDisable: () => {
                localStorage.drops = "false";
            },
            actionAfter: null,
            response: (state) => {
                return "Drops " + (!state ? "won't show anymore" : "will be visible") + " on the canvas.";
            }
        }
    }, {
        command: "zoomdraw",
        options: {
            type: "toggle",
            description: "Sets the zoom draw feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.zoomdraw = "true";
            },
            actionDisable: () => {
                localStorage.zoomdraw = "false";
                uiTweaks.resetZoom();
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " canvas zoom (STRG+Click).";
            }
        }
    }, {
        command: "like",
        options: {
            type: "action",
            description: "Executes a like.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                QS("#rateDrawing .thumbsUp").dispatchEvent(new Event("click"));
            },
            response: (args) => {
                return "You liked " + getCurrentOrLastDrawer() + "s drawing.";
            }
        }
    }, {
        command: "shame",
        options: {
            type: "action",
            description: "Executes a dislike.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                QS("#rateDrawing .thumbsDown").dispatchEvent(new Event("click"));
            },
            response: (args) => {
                return "You disliked " + getCurrentOrLastDrawer() + "s drawing.";
            }
        }
    }, {
        command: "random", 
        options: {
            type: "toggle",
            description: "Sets the random color / picker feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.randomAndPicker = "true";
                QS("#randomIcon").style.display = "";
                QS("#colPicker").style.display = "flex";
            },
            actionDisable: () => {
                localStorage.randomAndPicker = "false";
                QS("#randomIcon").parentElement.style.display = "none";
                QS("#colPicker").style.display = "none";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " random color & color picker tools.";
            }
        }
    }, {
        command: "agent", 
        options: {
            type: "toggle",
            description: "Sets the agent feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.imageAgent = "true";
                QS("#containerAgent").style.display = "flex";
            },
            actionDisable: () => {
                localStorage.imageAgent = "false";
                QS("#containerAgent").style.display = "none";
            },
            actionAfter: (state) => {
                scrollMessages();
            },
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " image agent.";
            }
        }
    }, {
        command: "quickreact",
        options: {
            type: "toggle",
            description: "Sets the quickreact feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.quickreact = "true";
            },
            actionDisable: () => {
                localStorage.quickreact = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " quick reaction menu.";
            }
        }
    }, {
        command: "markup",
        options: {
            type: "toggle",
            description: "Sets the markup feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.markup = "true";
            },
            actionDisable: () => {
                localStorage.markup = "false";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " chat markup.";
            }
        }
    }, {
        command: "keybinds",
        options: {
            type: "toggle",
            description: "Sets the keybinds feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.keybinds = "true";
                keybind.init();
            },
            actionDisable: () => {
                localStorage.keybinds = "false";
                keybind.destroy();
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " keybinds.";
            }
        }
    }, {
        command: "translate",
        options: {
            type: "toggle",
            description: "Sets german -> english translation.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.translate = "true";
                translate.init();
            },
            actionDisable: () => {
                localStorage.translate = "false";
                translate.destroy();
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " chat translation.";
            }
        }
    }, {
        command: "sizeslider",
        options: {
            type: "toggle",
            description: "Sets the brush size slider feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.sizeslider = "true";
                uiTweaks.initSizeSlider();
            },
            actionDisable: () => {
                localStorage.sizeslider = "false";
                QS("#sizeslider").remove();
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " size slider.";
            }
        }
    }, {
        command: "back",
        options: {
            type: "toggle",
            description: "Sets the back button (undo) feature.",
            actionBefore: null,
            actionEnable: () => {
                localStorage.displayBack = "true";
                QS("#restore").style.display = "";
            },
            actionDisable: () => {
                localStorage.displayBack = "false";
                QS("#restore").style.display = "none";
            },
            actionAfter: null,
            response: (state) => {
                return (state ? "Enabled" : "Disabled") + " size slider.";
            }
        }
    }, {
        command: "kick", 
        options: {
            type: "action",
            description: "Kicks the currently drawing player.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
            },
            response: (args) => {
                let kickPlayer = QS("#votekickCurrentplayer");
                if(kickPlayer.style.display != "none"){
                    kickPlayer.click();
                    return "Voted to kick the currently drawing player.";
                }
                else return "There's currently no-one to kick!";
            }
        }
    }, {
        command: "randominterval", 
        options: {
            type: "action",
            description: "Sets the random interval. Argument: interval in ms",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                args > 1000 ? args = 1000 : args < 5 ? args = 5 : 1;
                localStorage.randomColorInterval = args;
                clearInterval(uiTweaks.randomInterval);
                QS("#randomIcon")?.click();
            },
            response: (args) => {
                return "The random color brush interval is now " + args + "ms.";
            }
        }
    }, {
        command: "markupcolor", 
        options: {
            type: "action",
            description: "Sets the markup color. Argument: hex color code",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                localStorage.markupcolor = args;
            },
            response: (args) => {
                return "The highlight color for your messages is now " + args + ".";
            }
        }
    }, {
        command: "stream", 
        options: {
            type: "action",
            description: "Starts a lobby stream",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                lobbyStream.initStream();
            },
            response: (args) => {
                return "Starting lobby stream..";
            }
        }
    }, {
        command: "spectate", 
        options: {
            type: "action",
            description: "Starts a lobby stream",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                lobbyStream.initSpectate(args);
            },
            response: (args) => {
                return "Connecting to lobby stream..";
            }
        }
    }, {
        command: "sensitivity",
        options: {
            type: "action",
            description: "Sets the pressure sensitivity. Argument: sensitivity (1-100)",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                args = args < 1 ? 1 : args > 100 ? 100 : args;
                localStorage.sens = args;
            },
            response: (args) => {
                return "Tablet pressure sensitivity is now at " + args + "%.";
            }
        }
    }, {
        command: "usepalette", 
        options: {
            type: "action",
            description: "Uses a palette. Argument: palette name",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                if (uiTweaks.palettes.some(palette => palette.name == args)) localStorage.palette = args;
                uiTweaks.palettes.find(palette => palette.name == args)?.activate();
            },
            response: (args) => {
                return localStorage.palette == args ? "Activated custom palette '" + args + "'" : "Custom palette not found :(";
            }
        }
    }, {
        command: "addpalette",
        options: {
            type: "action",
            description: "Adds a palette. Argument: palette json",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                uiTweaks.palettes.push(createColorPalette(JSON.parse(args)));
                let palettesSave = [];
                uiTweaks.palettes.forEach(palette => {
                    if (palette.json) palettesSave.push(JSON.parse(palette.json));
                });
                localStorage.customPalettes = JSON.stringify(palettesSave);
            },
            response: (args) => {
                return "Added custom palette: '" + JSON.parse(args).name + "'";
            }
        }
    }, {
        command: "rempalette", 
        options: {
            type: "action",
            description: "Removes a palette. Argument: palette name",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: (args) => {
                uiTweaks.palettes = uiTweaks.palettes.filter(palette => palette.name != args);
                let palettesSave = [];
                uiTweaks.palettes.forEach(palette => {
                    if (palette.json) palettesSave.push(JSON.parse(palette.json));
                });
                localStorage.customPalettes = JSON.stringify(palettesSave);
            },
            response: (args) => {
                return "Removed palette(s) with name:" + args;
            }
        }
    }, {
        command: "help",
        options: {
            type: "action",
            description: "Shows some help about chat commands.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: () => {
                let help = "<div style='padding:.5em;'><h4>Overview of commands</h4><small><b>Types of commands:</b><br>Toggle - use with 'enable' / 'disable' + command name.<br>Action - execute with command name + arguments.<br><br>";
                help += "<h4>Commands:</h4>";
                commands.forEach(cmd => {
                    help += `<b>${cmd.command} (${cmd.options.type}):</b> ${cmd.options.description}<br><br>`;
                });
                help += "</small></div>";
                QS("#boxMessages").appendChild(elemFromString(help));
            },
            response: (args) => {
                return "";
            }
        }
    }, {
        command: "resettypo",
        options: {
            type: "action",
            description: "Resets everything to the defaults.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: () => {
                setDefaults(true);
                window.location.reload();
            },
            response: (args) => {
                return "";
            }
        }
    }, {
        command: "newvision",
        options: {
            type: "action",
            description: "Opens a new vision overlay.",
            actionBefore: null,
            actionEnable: null,
            actionDisable: null,
            actionAfter: () => {
               new Vision();
            },
            response: (args) => {
                return "Vision opened.";
            }
        }
    }

];

const performCommand = (command) => {
    // get raw command
    command = command.replace("--","").trim();
    let toggle = null;
    // check if command is toggle
    if (command.startsWith("enable")) toggle = true;
    else if (command.startsWith("disable")) toggle = false;
    command = command.replace("enable", "").replace("disable", "").trim();
    // extract args
    const args = command.includes(" ") ? command.substr(command.indexOf(" ")).trim() : "";
    command = command.replace(args, "").trim();
    match = false;
    // find matching command
    commands.forEach(cmd => {
        if (cmd.command.startsWith(command) && command.includes(cmd.command) && !match) {
            match = true;
            // execute command actions
            if (cmd.options.actionBefore) cmd.options.actionBefore(args);
            if (cmd.options.type == "toggle") if (toggle == true) cmd.options.actionEnable();
            else cmd.options.actionDisable();
            if (cmd.options.actionAfter) cmd.options.actionAfter(args);
            const response = cmd.options.response(cmd.options.type == "toggle" ? toggle : args);
            // print output
            QS("#boxMessages").appendChild(
                elemFromString(`<p><b style="color: rgb(57, 117, 206);">Command: ${cmd.command}</b><br><span style="color: rgb(57, 117, 206);">${response}</span></p>`));
        }
    });
    if (!match) {
        // print error - no matching command 
        QS("#boxMessages").appendChild(
            elemFromString(`<p><b style="color: rgb(57, 117, 206);">Command failed: ${command}</b><br><span style="color: rgb(57, 117, 206);">Not found :(</span></p>`));
    }
    scrollMessages();
}

const addChatMessage = (title, content) => {
    QS("#boxMessages").appendChild(
        elemFromString(`<p><b style="color: rgb(57, 117, 206);">${title}</b><br><span style="color: rgb(57, 117, 206);">${content}</span></p>`));
    scrollMessages();
}