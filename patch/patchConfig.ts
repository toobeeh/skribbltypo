export const gameJsPatchConfig = {
  name: "Skribbl Source Code Patch",
  description:
    "The patch config to modify skribbls source code for typo. Works with tobeh's tool PatchEx",
  groups: [
    {
      name: "Insert Typo Functions at top",
      replacements: [
        {
          source: "##CONTNAMEIN##",
          target:
            '([a-zA-Z0-9&_\\-$]+) = [a-zA-Z0-9&_\\-$]+\\.querySelector\\("#home \\.container-name-lang input"',
        },
        {
          source: "##SETTINGS##",
          target:
            "var ([a-zA-Z0-9&_\\-$]+) = {\\s+avatar: \\[Math.round\\(100 \\* Math.random\\(\\)\\) %",
        },
        {
          source: "##BTNPLAY##",
          target:
            '([a-zA-Z0-9&_\\-$]+) = [a-zA-Z0-9&_\\-$]+\\.querySelector\\("#home \\.panel \\.button-play"\\)',
        },
        {
          source: "##LOADING##",
          target:
            '([a-zA-Z0-9&_\\-$]+)\\([a-zA-Z0-9&_\\-$]+\\) {[^}]+?,\\s+.*querySelector\\(\\"#load\\"\\).style.display =',
        },
        {
          source: "##GOHOME##",
          target:
            'function ([a-zA-Z0-9&_\\-$]+)\\(\\) \\{[^}]+?data: 0\\s+?}[^}]+?\\.querySelector\\("#home"\\).style.display =',
        },
        {
          source: "##COLORS##",
          target: "([a-zA-Z0-9&_\\-$]+)\\s*=\\s*\\[\\s*\\[255, 255, 255\\],\\s*\\[0, 0, 0\\]",
        },
        {
          source: "##SECFILL##",
          target:
            'function ([a-zA-Z0-9&_\\-$]+)\\([a-zA-Z0-9&_\\-$]+\\) {\\s+[^}]+?#color-preview-secondary"\\).style.fill =',
        },
        {
          source: "##PRIMFILL##",
          target:
            'function ([a-zA-Z0-9&_\\-$]+)\\([a-zA-Z0-9&_\\-$]+\\) {\\s+[^}]+?#color-preview-primary"\\).style.fill =',
        },
        {
          source: "##PUSHCMD##",
          target:
            '.getContext\\("2d", {\\s*willReadFrequently[^}]*}\\)\\s*,\\s*([a-zA-Z0-9&_\\-$]+) = \\[\\]',
        },
        {
          source: "##PUSHACTION##",
          target: '[a-zA-Z0-9&_\\-$]+\\.length, ([a-zA-Z0-9&_\\-$]+)\\.push'
        },
        {
          source: "##PERFOUTER##",
          target: "function ([a-zA-Z0-9&_\\-$]+)\\([a-zA-Z0-9&_\\-$]+\\) {[^}]+?data[^}]+?bounds:",
        },
        {
          source: "##PERFINNER##",
          target:
            "function ([a-zA-Z0-9&_\\-$]+)\\([a-zA-Z0-9&_\\-$]+\\) {[^}]+?\\[0, 0, [a-zA-Z0-9&_\\-$]+\\.width, [a-zA-Z0-9&_\\-$]+\\.height\\]",
        },
        {
          source: "##SHWOTOOLTIP##",
          target:
            "function ([a-zA-Z0-9&_\\-$]+)\\(e\\) \\{[^}]+?[a-zA-Z0-9&_\\-$]+\\(\\)[^}]+?\\.dataset\\.tooltip",
        },
        {
          source: "##HIDETOOLTIP##",
          target:
            "function [a-zA-Z0-9&_\\-$]+\\(e\\) \\{[^}]+?([a-zA-Z0-9&_\\-$]+)\\(\\)[^}]+?\\.dataset\\.tooltip",
        },
        {
          source: "##CLEARACTION##",
          target:
            "graphic: \"clear\\.gif\",\\s+action: ([a-zA-Z0-9&_\\-$]+)",
        },
        {
          source: "##SELECTTOOL##",
          target:
            "function ([a-zA-Z0-9&_\\-$]+)\\([a-zA-Z0-9&_\\-$]+, [a-zA-Z0-9&_\\-$]+\\) {\\s+[a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\.element\\)",
        },
        {
          source: "##SELECTSIZE##",
          target:
            "wheelDeltaY, [a-zA-Z0-9&_\\-$]+ = Math\\.sign\\([a-zA-Z0-9&_\\-$]+\\);\\s+([a-zA-Z0-9&_\\-$]+)\\(",
        },
        {
          source: "##UPDATECURSOR##",
          target:
            "function\\s*([a-zA-Z0-9&_\\-$]+)\\(\\)\\s*{\\s*var [a-zA-Z0-9&_\\-$]+ = [a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\.cursor;",
        },
      ],
      injections: [
        {
          position: "(COMBINATION: 2\n\\s+?})",
          code: `
                // TYPOMOD 
                // desc: create re-useable functions
                , typo = {
                    messagePort: (()=>{
                      const channel = new MessageChannel();
                      window.postMessage("skribblMessagePort", "*", [channel.port2]);
                      return channel.port1;
                    })(),
                    emitPort: (()=>{
                      const channel = new MessageChannel();
                      window.postMessage("skribblEmitPort", "*", [channel.port2]);
                      return channel.port1;
                    })(),
                    joinLobby: undefined,
                    createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
                        // IDENTIFY x.value.split: #home .container-name-lang input -> ##CONTNAMEIN##
                        // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> ##SETTINGS##
                        return { 
                            id: id, 
                            name: name.length != 0 ? name : (##CONTNAMEIN##.value.split("#")[0] != "" ? ##CONTNAMEIN##.value.split("#")[0] : "Player"), 
                            avatar: avatar.length == 0 ? ##SETTINGS##.avatar : avatar, 
                            score: score, 
                            guessed: guessed 
                        };
                    },
                    createFakeLobbyData: (
                        settings = ["PRACTISE", "en", 1, 1, 80, 3, 3, 2, 0, false],
                        id = null,
                        me = 0,
                        owner = 0,
                        users = [],
                        state = { id: 4, type: 0, time: 0, data: { id: 0, word: "Anything" } }) => {
                        if (users.length == 0) users = [typo.createFakeUser()];
                        return { 
                            settings: settings, 
                            id: id, 
                            me: me, 
                            owner: owner, 
                            round: 0, 
                            users: users, 
                            state: state 
                        };
                    },
                    disconnect: undefined,
                    skipCursorUpdate: false,
                    lastConnect: 0,
                    initListeners: (() => {
                        let abort = false; 
                        document.addEventListener("selectSkribblTool", (event) => ##SELECTTOOL##(event.detail));
                        document.addEventListener("selectSkribblSize", (event) => ##SELECTSIZE##(event.detail));
                        document.addEventListener("clearDrawing", () => ##CLEARACTION##());
                        document.addEventListener("abortJoin", () => abort = true); 
                        document.addEventListener("disableCursorUpdates", e => {
                            typo.skipCursorUpdate = e.detail === true;
                            if(e.detail === false) ##UPDATECURSOR##(); // update cursor when updates reenabled
                        });
                        document.addEventListener("joinLobby", (e) => {
                            abort = false;
                            let timeoutdiff = Date.now() - (typo.lastConnect == 0 ? Date.now() : typo.lastConnect);
                            // Xn(true);
                            setTimeout(() => {
                                if (abort) return; 
                                typo.lastConnect = Date.now();
                                // ##BTNPLAY##.dispatchEvent(new Event("click")); 
                                // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                                // ##PRIVATELBBY## = !1 
                                // IDENTIFY: x:  = !1   
                                if (e.detail) window.history.pushState({path: window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);
                                // ##JOINLOBBY##(e.detail?.join ? e.detail.join : "");
                                // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                                typo.joinLobby(); 
                                window.history.pushState({path: window.location.origin}, '', window.location.origin);
                                // ##LOADING##(false); 
                                // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                                document.dispatchEvent(new Event("joinedLobby"));
                            }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
                        });
                        document.addEventListener("leaveLobby", () => {
                            if (typo.disconnect) typo.disconnect();
                            else ##GOHOME##() | document.dispatchEvent(new Event("leftLobby"));
                            // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
                        });
                        document.addEventListener("setColor", (e) => {
                            let rgb = e.detail.code < 10000 ? ##COLORS##[e.detail.code] : typo.typoCodeToRgb(e.detail.code);
                            let match = ##COLORS##.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]);
                            // IDENTIFY [0, 59, 120], -> COLORS
                            let code = match >= 0 ? match : e.detail.code;
                            if (e.detail.secondary) ##SECFILL##(code); 
                            // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                            else ##PRIMFILL##(code);
                            // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
                        });
                        document.addEventListener("performDrawCommand", (e) => {
                            ##PUSHCMD##.push(e.detail); 
                            ##PUSHACTION##.push(##PUSHCMD##.length); 
                            // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                            ##PERFOUTER##(##PERFINNER##(e.detail)); 
                            // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
                        });
                        document.addEventListener("collapseUndoActions", (e) => {
                            const shrinkCount = e.detail;
                            const firstCollapsedIndex = ##PUSHACTION##.length - shrinkCount + 1;
                            const collapsed = ##PUSHACTION##.slice(0, firstCollapsedIndex);
                            const lastCollapsedIndex = collapsed.length === 0 ? 0 : collapsed.length - 1
                            collapsed[lastCollapsedIndex] = ##PUSHACTION##[##PUSHACTION##.length - 1];
                            ##PUSHACTION## = collapsed;
                        });
                        document.addEventListener("addTypoTooltips", () => {
                            [...document.querySelectorAll("[data-typo-tooltip]")].forEach(elem => {
                                elem.setAttribute("data-tooltip", elem.getAttribute("data-typo-tooltip"));
                                elem.removeAttribute("data-typo-tooltip");
                                elem.addEventListener("mouseenter", (e) => ##SHWOTOOLTIP##(e.target)); 
                                // IDENTIFY: x(e.target):
                                elem.addEventListener("mouseleave", (e) => ##HIDETOOLTIP##()); 
                                // IDENTIFY: (e) => x():
                            });
                        });
                    })(),
                    hexToRgb: (hex) => {
                        let arrBuff = new ArrayBuffer(4);
                        let vw = new DataView(arrBuff);
                        vw.setUint32(0, parseInt(hex, 16), false);
                        let arrByte = new Uint8Array(arrBuff);
                        return [arrByte[1], arrByte[2], arrByte[3]];
                    },
                    rgbToHex: (r, g, b) => {
                        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                    },
                    typoCodeToRgb: (code) => {
                      const decimal = code - 10000;
                      return [
                          (decimal >> 16) & 255, // Red
                          (decimal >> 8) & 255,  // Green
                          decimal & 255          // Blue
                      ];
                    }
                }
                // TYPOEND
                `,
        },
      ],
    },
    {
      name: "Custom Cursor Color",
      replacements: [
        {
          source: "patchcode#customcursor([^,]+,)",
          target: "(\\s)",
        },
        {
          source: "##COLORINDEX##",
          target:
            '([a-zA-Z0-9&_\\-$]+) = [a-zA-Z0-9&_\\-$]+,\\s+?[a-zA-Z0-9&_\\-$]+\\.querySelector\\("#color-preview-primary"\\)\\.style.fill =',
        },
        {
          source: "##COLORS##",
          target: "([a-zA-Z0-9&_\\-$]+)\\s*=\\s*\\[\\s*\\[255, 255, 255\\],\\s*\\[0, 0, 0\\]",
        },
        {
          source: "##COLORCODE##",
          target: "\\.75 \\* ([a-zA-Z0-9&_\\-$]+)",
        },
      ],
      injections: [
        {
          position:
            "(clearRect\\(0, 0, [a-zA-Z0-9&_\\-$]+, [a-zA-Z0-9&_\\-$]+\\);)\\s+var [a-zA-Z0-9&_\\-$]+ = [a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\s*,",
          code: '// TYPOMOD\n// desc: cursor with custom color\nvar ##COLORCODE## = ##COLORINDEX## < 10000 ? ##COLORS##[##COLORINDEX##] : typo.typoCodeToRgb(##COLORINDEX##);\n// TYPOEND \npatchcode#customcursor',
        },
        {
          position: "(\\s)var [a-zA-Z0-9&_\\-$]+ = [a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\.cursor;",
          code: "// TYPOMOD\n// desc: dont update cursor when typo updates if very frequently to avoid performance drop\nif(typo.skipCursorUpdate === true) return;\n",
        }
      ],
    },
    {
      name: "Primary Custom Color",
      replacements: [
        {
          source: "##COLORCODE##",
          target:
            '[a-zA-Z0-9&_\\-$]+ = ([a-zA-Z0-9&_\\-$]+), [^}]+?\\.querySelector\\("#color-preview-primary"\\)\\.style\\.fill =',
        },
        {
          source: "##SETCOLOR##",
          target:
            ':\\s*([a-zA-Z0-9&_\\-$]+)[^}]+?;[^}]+?\\.querySelector\\("#color-preview-primary"\\)\\.style\\.fill =',
        },
      ],
      injections: [
        {
          position:
            '(var [a-zA-Z0-9&_\\-$]+ =) [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\);[^}]+?\\.querySelector\\("#color-preview-primary"\\)\\.style\\.fill =',
          code: '##COLORCODE## > 10000 ? ##SETCOLOR##(typo.typoCodeToRgb(##COLORCODE##)) :',
        },
      ],
    },
    {
      name: "Secondary Custom Color",
      replacements: [
        {
          source: "##COLORCODE##",
          target:
            '[a-zA-Z0-9&_\\-$]+ = ([a-zA-Z0-9&_\\-$]+), [^}]+?\\.querySelector\\("#color-preview-secondary"\\)\\.style\\.fill =',
        },
        {
          source: "##SETCOLOR##",
          target:
            ':\\s*([a-zA-Z0-9&_\\-$]+)[^}]+?;[^}]+?\\.querySelector\\("#color-preview-secondary"\\)\\.style\\.fill =',
        },
      ],
      injections: [
        {
          position:
            '(var [a-zA-Z0-9&_\\-$]+ =) [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\);[^}]+?\\.querySelector\\("#color-preview-secondary"\\)\\.style\\.fill =',
          code: '##COLORCODE## > 10000 ? ##SETCOLOR##(typo.typoCodeToRgb(##COLORCODE##)) :',
        },
      ],
    },
    {
      name: "Detect Custom Colors",
      replacements: [
        {
          source: "##COLORCODE##",
          target:
            "function [a-zA-Z0-9&_\\-$]+\\(([a-zA-Z0-9&_\\-$]+)\\) {[^}]+?return {\\s+?r:[^},]+?,\\s+?g:[^},]+?,\\s+?b:",
        },
      ],
      injections: [
        {
          position:
            "(function [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\) {)[^}]+?return {\\s+?r:[^},]+?,\\s+?g:[^},]+?,\\s+?b:",
          code: "/*TYPOMOD   \ndesc: if color code > 1000 -> customcolor*/if(##COLORCODE## < 1000)",
        },
        {
          position: "([^{]+?length[^}]+?;)\\s+return {\\s+?r:[^},]+?,\\s+?g:[^},]+?,\\s+?b:",
          code: 'else ##COLORCODE## = typo.typoCodeToRgb(##COLORCODE##);/* TYPOEND */',
        },
      ],
    },
    {
      name: "Save Undo Draw Commands",
      replacements: [
        {
          source: "##COMMANDS##",
          target:
            "if\\s\\([a-zA-Z0-9&_\\-$]+ = ([a-zA-Z0-9&_\\-$]+)\\.[^}]+?putImageData\\([a-zA-Z0-9&_\\-$]+\\.data, [a-zA-Z0-9&_\\-$]+\\.bounds\\[",
        },
      ],
      injections: [
        {
          position:
            "(for[^{]+?{[^}]+?putImageData\\([a-zA-Z0-9&_\\-$]+\\.data, [a-zA-Z0-9&_\\-$]+\\.bounds\\[[\\s\\S]+?[^}]+?}[^}]*)",
          code: '/* TYPOMOD \n         log kept commands*/\n        document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));\n        /* TYPOEND*/',
        },
        {
          position:
            "(if[^{]+?{)[^}]+?putImageData\\([a-zA-Z0-9&_\\-$]+\\.data, [a-zA-Z0-9&_\\-$]+\\.bounds\\[",
          code: "/* TYPOMOD\n        desc: replace draw commands because of redo*/        const keepCommands = ##COMMANDS##;\n        /* TYPOEND*/",
        },
      ],
    },
    {
      name: "Log Draw Commands",
      replacements: [
        {
          source: "##COMMAND##",
          target: "(e)",
        }
      ],
      injections: [
        {
          position: '( ): console.log\\("IGNORED COMMAND OUT OF CANVAS BOUNDS"\\)',
          code: `
          /* TYPOMOD  log draw commands */
          & document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: ##COMMAND## }))
          /* TYPOEND */`,
        },
      ],
    },
    {
      name: "Log Canvas Clear",
      replacements: [],
      injections: [
        {
          position:
            '(function [a-zA-Z0-9&_\\-$]+?\\(\\) {)[^}]+?"#FFF",\\s+[a-zA-Z0-9&_\\-$]+?\\.fillRect\\(0, 0, [a-zA-Z0-9&_\\-$]+?\\.width',
          code: '/* TYPOMOD\n         desc: store data before clear */\n        const data = document.querySelector("#game-canvas canvas").toDataURL();\n/* TYPOEND */',
        },
        {
          position:
            '("#FFF",\\s+[a-zA-Z0-9&_\\-$]+?\\.fillRect\\(0, 0, [a-zA-Z0-9&_\\-$]+?\\.width[^)]+?\\))',
          code: '/* TYPOMOD\n         desc: dispatch clear event */\n        ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));\n/* TYPOEND */',
        },
      ],
    },
    {
      name: "Add Practise Join",
      replacements: [
        {
          source: "##JOIN##",
          target:
            'function ([a-zA-Z0-9&_\\-$]+?)\\([a-zA-Z0-9&_\\-$]+?\\) {[^}]+?\\.querySelector\\("#home"\\)\\.style\\.display = "none"',
        },
        {
          source: "##SOCKET##",
          target: '\\(([a-zA-Z0-9&_\\-$]+?) = [^\\)]+?\\)\\)\\.on\\("connect"',
        },
      ],
      injections: [
        {
          position: '(e.classList.add\\("show"\\)\\s+})',
          code: `
                /* TYPOMOD desc: add event handlers for typo features */
                document.addEventListener("joinPractice", () => {
                  const data = typo.createFakeLobbyData();
                  typo.messagePort.postMessage({ id: 10, data });
                  //document.dispatchEvent(new CustomEvent("practiceJoined", {detail: data}));
                  ##JOIN##(data);
                });
                
                ##SOCKET## = new Proxy({},{
                  emit: (...data) => typo.emitPort.postMessage(data),
                  other: (...data) => void 0,
                  get (target, prop) {
                    if(prop === "emit"){
                      return this.emit;
                    }
                    else return this.other;
                  }
                });
                /* TYPOEND */
                `,
        },
      ],
    },
    {
      name: "Pipette Custom Color",
      replacements: [
        {
          source: "##COL##",
          target:
            "if \\(0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+?\\) return ([a-zA-Z0-9&_\\-$]+)[^}]+?}",
        },
        {
          source: "##COLR##",
          target:
            "if \\(0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - ([a-zA-Z0-9&_\\-$]+?) && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+?\\)[^}]+?}",
        },
        {
          source: "##COLG##",
          target:
            "if \\(0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - ([a-zA-Z0-9&_\\-$]+?) && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+?\\)[^}]+?}",
        },
        {
          source: "##COLB##",
          target:
            "if \\(0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - ([a-zA-Z0-9&_\\-$]+?)\\)[^}]+?}",
        },
      ],
      injections: [
        {
          position:
            "(if \\(0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+? && 0 == [a-zA-Z0-9&_\\-$]+?\\[[a-zA-Z0-9&_\\-$]+?\\] - [a-zA-Z0-9&_\\-$]+?\\)[^}]+?})",
          code: "/* TYPOMOD\n                     desc: if color is not in array, convert to custom color */\n                    return ##COL## = parseInt(typo.rgbToHex(##COLR##, ##COLG##, ##COLB##), 16) + 10000;\n                    /* TYPOEND */",
        },
      ],
    },
    {
      name: "Lobby Navigation",
      replacements: [
        {
          source: "##SOCKET##",
          target: '\\(([a-zA-Z0-9&_\\-$]+?) = [^\\)]+?\\)\\)\\.on\\("connect"',
        },
      ],
      injections: [
        {
          position: '(\\.on\\("connect", function\\s*\\(\\) \\{)',
          code: `
                /* TYPOMOD
                     desc: disconnect socket & leave lobby */
                document.addEventListener('socketEmit', event => 
                    ##SOCKET##.emit('data', { id: event.detail.id, data: event.detail.data })
                );
                
                typo.disconnect = () => {
                    if (##SOCKET##) {
                        ##SOCKET##.typoDisconnect = true;
                        ##SOCKET##.on("disconnect", () => {
                            typo.disconnect = undefined;
                            document.dispatchEvent(new Event("leftLobby"));
                        });
                        ##SOCKET##.off("data");
                        ##SOCKET##.reconnect = false;
                        ##SOCKET##.disconnect();
                    } else {
                        document.dispatchEvent(new Event("leftLobby"));
                    }
                }
                ##SOCKET##.on("data", data => typo.messagePort.postMessage(data));
                typo.messagePort.onmessage = data => ##SOCKET##.emit("data", data.data);
                
                const originalEmit = ##SOCKET##.emit.bind(##SOCKET##);
                ##SOCKET##.emit = function(...data) {
                  typo.emitPort.postMessage(data);
                  originalEmit(...data);
                };
                /* TYPOEND */
`,
        },
      ],
    },
    {
      name: "Handle Disconnect",
      replacements: [
        {
          source: "##SOCKET##",
          target: '\\(([a-zA-Z0-9&_\\-$]+?) = [^\\)]+?\\)\\)\\.on\\("connect"',
        },
      ],
      injections: [
        {
          position: '(\\.on\\("disconnect", function[^{]*{)',
          code: "/* TYPOMOD\n                 DESC: no msg if disconnect intentionally */\n                if(!##SOCKET##.typoDisconnect)\n                /*TYPOEND*/",
        },
      ],
    },
    {
      name: "Dispatch Draw Finish",
      replacements: [
        {
          source: "##DATA##",
          target:
            'The word was \'\\$\'", ([a-zA-Z0-9&_\\-$]+?)\\.data\\.word\\), "", [a-zA-Z0-9&_\\-$]+?\\([a-zA-Z0-9&_\\-$]+?\\), !0\\)',
        },
      ],
      injections: [
        {
          position:
            '(The word was \'\\$\'", [a-zA-Z0-9&_\\-$]+?\\.data\\.word\\), "", [a-zA-Z0-9&_\\-$]+?\\([a-zA-Z0-9&_\\-$]+?\\), !0\\))',
          code: '/* TYPOMOD\n             desc: log finished drawing */\n            ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: ##DATA##.data.word }));\n            /* TYPOEND */',
        },
      ],
    },
    {
      name: "Dispatch Lobbydata",
      replacements: [
        {
          source: "##EVENT##",
          target:
            "switch \\([a-zA-Z0-9&_\\-$]+?\\) {[\\s\\S]*?(?=break)break[^(]*\\(([^)]*)\\)[^}]*joined the room!",
        },
      ],
      injections: [
        {
          position:
            "(switch \\([a-zA-Z0-9&_\\-$]+?\\) {\\s+case [a-zA-Z0-9&_\\-$]+?:)[^}]*joined the room!",
          code: '/* TYPOMOD\n                 desc: send lobbydata*/\n                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: ##EVENT## }));\n                /* TYPOEND*/',
        },
      ],
    },
    {
      name: "Add Lobbyplayer ID",
      replacements: [
        {
          source: "##PLAYER##",
          target: '([a-zA-Z0-9&_\\-$]+?)\\.element, "click"',
        },
      ],
      injections: [
        {
          position: '(\\("icon muted"\\);)',
          code: '/* TYPOMOD\n         desc: set ID to player to identify */\n        ##PLAYER##.element.setAttribute("playerid", ##PLAYER##.id);\n        /* TYPOEND */',
        },
      ],
    },
    {
      name: "Add message length splits",
      replacements: [ ],
      injections: [
        {
          position:
            '("submit", function\\s*\\([a-zA-Z0-9&_\\-$]+\\) {)\\s+[a-zA-Z0-9&_\\-$]+\\.preventDefault',
          code: 'const input = this.querySelector("input"); let rest = input.value.substring(100);\n        input.value = input.value.substring(0,100);\n        if(rest.length > 0) setTimeout(()=>{input.value = rest; this.dispatchEvent(new Event("submit"));},180);',
        },
      ],
    },
    {
      name: "Add Action Buttons",
      replacements: [
        {
          source: "##ADDACTION##",
          target: "([a-zA-Z0-9&_\\-$]+?)\\([^}]+{\\s+(isAction: !0,[^}]+Clear[^}]+}\\))",
        },
      ],
      injections: [
        {
          position: "(isAction: !0,[^}]+Clear[^}]+}\\))",
          code: `
                /*TYPOMOD DESC: add action for brushlab*/ 
                ,
                ##ADDACTION##(3, {
                    isAction: !0,
                    name: "Lab",
                    graphic: "",
                    keydef: 'L',
                    action: () => {
                        document.dispatchEvent(new Event("openBrushLab"));
                    }
                }) 
                /*TYPOEND*/
                `,
        },
        {
          position: "(isAction: !0,[^}]+Clear[^}]+}\\))",
          code: `
                /* TYPOMOD DESC: add action for colorswitch */ 
                /* 
                ,
                ##ADDACTION##(2, {
                    isAction: !0,
                    name: "Switcher",
                    graphic: "",
                    action: () => {
                        document.dispatchEvent(new Event("toggleColor"));
                    }
                })
                */ 
                /* TYPOEND */
                `,
        },
        {
          position: "(isAction: !0,[^}]+Clear[^}]+}\\))",
          code: `
                /*TYPOMOD DESC: add tool for pipette*/ 
                ,
                ##ADDACTION##(3, {
                    isAction: !1,
                    name: "Pipette",
                    graphic: "",
                    keydef: 'P',
                }) 
                /*TYPOEND*/
                `,
        },
        {
          position: "(isAction: !0,[^}]+Clear[^}]+}\\))",
          code: `
                /*TYPOMOD DESC: add tool for deselect*/ 
                ,
                ##ADDACTION##(-1, {
                    isAction: !1,
                    name: "None",
                    graphic: "",
                    keydef: "",
                }) 
                /*TYPOEND*/
                `,
        },
      ],
    },
    {
      name: "Remove Chat Limit",
      replacements: [
        {
          source: "chatDeleteQuota: 100",
          target: ";",
        },
      ],
      injections: [],
    },
    {
      name: "Define join function",
      replacements: [],
      injections: [
        {
          position: '("click",) function[^}]+\\.location\\.href',
          code: "typo.joinLobby = ",
        },
      ],
    },
    {
      name: "Set last joined in regular join",
      replacements: [],
      injections: [
        {
          position: "([a-zA-Z0-9&_\\-$]+\\.location\\.href,)",
          code: `typo.lastConnect = Date.now(),`,
        },
      ],
    },
    /*{ TODO - what was this purpose? any bugs w/o it?
      name: "Keyup to keydown",
      replacements: [
        {
          source: "(keyup)",
          target: "(keydown)",
        },
      ],
      injections: [],
    },*/
    {
      name: "Use Typo Pressure",
      replacements: [
        {
          source: "##TYPOSIZE##",
          target: "[a-zA-Z0-9&_\\-$]+ = Math\\.ceil\\(\\.5 \\* ([a-zA-Z0-9&_\\-$]+)\\)",
        },
        {
          source: "##PRESSURE##",
          target: "[a-zA-Z0-9&_\\-$]+\\(([a-zA-Z0-9&_\\-$]+), 0, 1\\)",
        },
      ],
      injections: [
        {
          position: "(\\s)[a-zA-Z0-9&_\\-$]+ = Math\\.ceil\\(\\.5[^}]*",
          code: `
              /* TYPOMOD use typo pressure */
              (() => {
                  if (0 <= ##PRESSURE## && document.documentElement.dataset["typo_pressure_performance"]) {
                      const pressure = eval(document.documentElement.dataset["typo_pressure_performance"])(##PRESSURE##);
                      ##TYPOSIZE## = Math.max(4, Math.round(40 * pressure));
                  }
              })(),
              `,
        },
      ],
    },
    {
      name: "Add User ID in chat",
      replacements: [
        {
          source: "##PLAYER##",
          target: '\\(([a-zA-Z0-9&_\\-$]+)\\.name, [a-zA-Z0-9&_\\-$]+, [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\), !1\\)',
        },
      ],
      injections: [
        {
          position: '(\\([a-zA-Z0-9&_\\-$]+\\.name, [a-zA-Z0-9&_\\-$]+, [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\), !1\\))',
          code: `.setAttribute("playerid", ##PLAYER##.id)`,
        },
      ],
    },
    {
      name: "Add event when skribbl initialized",
      replacements: [ ],
      injections: [
        {
          position: '\\)(\\s+)}\\)\\(window, document,',
          code: `;document.dispatchEvent(new Event("skribblInitialized")); document.body.setAttribute("typo-skribbl-loaded", "true");`,
        },
      ],
    },
    {
      name: "Add event when skribbl tool changed",
      replacements: [
        {
          source: "##TOOLID##",
          target: 'function [a-zA-Z0-9&_\\-$]+\\(([a-zA-Z0-9&_\\-$]+), [a-zA-Z0-9&_\\-$]+\\) {\\s+\\/\\*toolidtarget',
        },
      ],
      injections: [
        {
          position: 'function [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+, [a-zA-Z0-9&_\\-$]+\\) {(\\s+[a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\.element\\))',
          code: `/*toolidtarget*/ document.dispatchEvent(new CustomEvent("skribblToolChanged", {detail: ##TOOLID##}));`,
        },
      ],
    },
    {
      name: "Add event when skribbl size changed",
      replacements: [
        {
          source: "##SIZE##",
          target: '\\.querySelector\\("\\.size-preview \\.icon"\\)\\.style\\.backgroundSize = [a-zA-Z0-9&_\\-$]+\\(([a-zA-Z0-9&_\\-$]+)\\) \\+ "%"',
        },
      ],
      injections: [
        {
          position: '([a-zA-Z0-9&_\\-$]+\\.querySelector\\("\\.size-preview \\.icon"\\)\\.style\\.backgroundSize = [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+\\) \\+ "%",)',
          code: `document.dispatchEvent(new CustomEvent("skribblSizeChanged", { detail: ##SIZE## })),`,
        },
      ],
    },
    {
      name: "Add event when skribbl color changed",
      replacements: [
        {
          source: "##COLOR##",
          target: '"#color-preview-primary"\\).style\\.fill = ([a-zA-Z0-9&_\\-$]+)',
        },
      ],
      injections: [
        {
          position: '("#color-preview-primary"\\).style\\.fill = [a-zA-Z0-9&_\\-$]+)',
          code: `, document.dispatchEvent(new CustomEvent("skribblColorChanged", {detail: ##COLOR##}))`,
        },
      ],
    },
    {
      name: "Add player id to endboard avatar",
      replacements: [
        {
          source: "##ELEMENT1##",
          target: '([a-zA-Z0-9&_\\-$]+)\\.classList\\.add\\("winner\\"\\),',
        },
        {
          source: "##RESULT1##",
          target: '([a-zA-Z0-9&_\\-$]+) = [a-zA-Z0-9&_\\-$]+\\[[a-zA-Z0-9&_\\-$]+\\]\\)\\.player\\.avatar,',
        },
        {
          source: "##ELEMENT2##",
          target: '\\/\\*elemanchor\\*\\/\\s*([a-zA-Z0-9&_\\-$]+)',
        },
        {
          source: "##RESULT2##",
          target: '"rank-name", ([a-zA-Z0-9&_\\-$]+)\\.player\\.name\\)\\),',
        },
      ],
      injections: [
        {
          position: '( )0 == [a-zA-Z0-9&_\\-$]+ && \\([a-zA-Z0-9&_\\-$]+\\.classList\\.add\\("winner\\"\\),',
          code: `##ELEMENT1##.setAttribute("playerid", ##RESULT1##.player.id),`,
        },
        {
          position: '("rank-name", [a-zA-Z0-9&_\\-$]+\\.player\\.name\\)\\),)',
          code: `##ELEMENT2##.setAttribute("playerid", ##RESULT2##.player.id), /*elemanchor*/`,
        },
      ],
    },
    {
      name: "Add player ID in popup",
      replacements: [
        {
          source: "##PLAYER##",
          target: '[a-zA-Z0-9&_\\-$]+ = \\([a-zA-Z0-9&_\\-$]+\\.style.display = ([a-zA-Z0-9&_\\-$]+)\\.id[\\s\\S]*?button\\.report[\\s\\S]*?\\.avatar\\)\\)',
        },
        {
          source: "##ELEMENT##",
          target: '([a-zA-Z0-9&_\\-$]+) = \\([a-zA-Z0-9&_\\-$]+\\.style.display = [a-zA-Z0-9&_\\-$]+\\.id[\\s\\S]*?button\\.report[\\s\\S]*?\\.avatar\\)\\)',
        },
      ],
      injections: [
        {
          position: '([a-zA-Z0-9&_\\-$]+ = \\([a-zA-Z0-9&_\\-$]+\\.style.display = [a-zA-Z0-9&_\\-$]+\\.id[\\s\\S]*?button\\.report[\\s\\S]*?\\.avatar\\)\\))',
          code: `; /*id in popup*/ ##ELEMENT##.setAttribute("playerid", ##PLAYER##.id);`,
        },
      ],
    },
    {
      name: "Add playerid in text overlay",
      replacements: [
        {
          source: "##PLAYER##",
          target: 'overlayanchor\\*\\/ \\? ([a-zA-Z0-9&_\\-$]+)',
        },
        {
          source: "##ELEMENT##",
          target: '"", ([a-zA-Z0-9&_\\-$]+)\\.appendChild[\\s\\S]+is choosing a word![\\s\\S]+overlayanchor',
        },
      ],
      injections: [
        {
          position: '(, [a-zA-Z0-9&_\\-$]+\\.appendChild[\\s\\S]+is choosing a word!", [a-zA-Z0-9&_\\-$]+\\)\\)\\), [a-zA-Z0-9&_\\-$]+\\([a-zA-Z0-9&_\\-$]+) ',
          code: `&& (##ELEMENT##.setAttribute("playerid", ##PLAYER##.id) || true) /*overlayanchor*/ `,
        },
      ],
    },
    {
      name: "Bypass skribbl drawing performance limitation",
      replacements: [
      ],
      injections: [
        {
          position: '(performance\\.now\\(\\);\\s*if\\s*\\()',
          code: `document.body.dataset.bypassFps !== 'true' &&`,
        },
      ],
    },
    {
      name: "Bypass skribbl command emit limitation",
      replacements: [
      ],
      injections: [
        {
          position: '(\\)\\)\\s*\\},\\s*)\\d+\\)',
          code: `document.body.dataset.bypassCommandRate === 'true' ? 0 :`,
        },
      ],
    },
    {
      name: "Disable skribbl command logs",
      replacements: [
      ],
      injections: [
        {
          position: '(\s*)console\\.log\\(`Sent',
          code: `false && `,
        },
      ],
    },
  ],
};