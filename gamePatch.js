! function (u, c, n, a) {
    const i = 26,
        l = 57,
        s = 51,
        d = [i, l, s],
        y = 0,
        v = 1,
        S = 2,
        k = 0,
        b = 1,
        w = 2,
        C = 3,
        h = 4,
        q = 5,
        x = 6,
        f = 7;
    const p = 1,
        g = 2,
        M = {
            NAME: 0,
            LANG: 1,
            PUBLIC: 2,
            SLOTS: 3,
            DRAWTIME: 4,
            ROUNDS: 5,
            WORDCOUNT: 6,
            HINTCOUNT: 7,
            WORDMODE: 8,
            CUSTOMWORDSONLY: 9
        },
        $ = {
            NORMAL: 0,
            HIDDEN: 1,
            COMBINATION: 2
        },
        o = ["Normal", "Hidden", "Combination"];
    const t = ["B", "V", "F"],
        r = ["U", "C"];
    // TYPOMOD 
    // desc: create re-useable functions
    const typo = {
        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) %
            return { id: id, name: name.length != 0 ? name : (jn.value.split("#")[0] != "" ? jn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? m.avatar : avatar, score: score, guessed: guessed };
        },
        createFakeLobbyData: (
            settings = ["PRACTISE", "en", 1, 8, 80, 3, 3, 2, 0, false],
            id = "FAKE",
            me = 0,
            owner = 0,
            users = [],
            state = { id: 4, time: 999, data: { id: 0, word: "Anything" } }) => {
            if (users.length == 0) users = [typo.createFakeUser()];
            return { settings: settings, id: id, me: me, owner: owner, users: users, state: state };
        },
        disconnect: undefined,
        lastConnect: 0,
        initListeners: (() => {
            document.addEventListener("joinLobby", (e) => {
                let timeoutdiff = Date.now() - typo.lastConnect;
                Xn(true);
                setTimeout(() => {
                    typo.lastConnect = Date.now();
                    Vn.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play")
                    Wn = !1 // IDENTIFY: x:  = !1
                    Jn(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" +
                    Xn(false); // IDENTIFY x(false): querySelector("#load").style.display
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 3000 ? 3000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else ca() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = ""
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = ht.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120],
                let code = match >= 0 ? match : e.detail.code;
                if (e.detail.secondary) Lt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill
                else $t(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill
            });
            document.addEventListener("performDrawCommand", (e) => {
                _e.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = []
                Wt(Pt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil
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
        }
    }
    // TYPOEND
    var m = {
        avatar: [Math.round(100 * Math.random()) % i, Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % s, -1],
        audioMute: 0,
        dark: 0,
        filterChat: 1,
        pressureSensitivity: 1,
        displayLang: "en",
        hotkeysTools: ["B", "V", "F"],
        hotkeysActions: ["U", "C"]
    };

    function L(e, t) {
        e = n.getItem(e);
        return null == e ? t : e
    }

    function A(e, t) {
        e = n.getItem(e);
        return null == e ? t : JSON.parse(e)
    }

    function D() {
        u.localStorageAvailable && (n.setItem("name", jn.value),
            n.setItem("lang", Gn.value),
            n.setItem("displaylang", m.displayLang),
            n.setItem("audio", 1 == m.audioMute ? 1 : 0),
            n.setItem("dark", 1 == m.dark ? 1 : 0),
            n.setItem("filter", 1 == m.filterChat ? 1 : 0),
            n.setItem("pressure", 1 == m.pressureSensitivity ? 1 : 0),
            n.setItem("tools", JSON.stringify(m.hotkeysTools)),
            n.setItem("actions", JSON.stringify(m.hotkeysActions)),
            n.setItem("ava", JSON.stringify(m.avatar)),
            console.log("Settings saved."))
    }

    function I(e) {
        m.dark = e ? 1 : 0,
            c.documentElement.dataset.theme = m.dark ? "dark" : ""
    }

    function R(e, t, n) {
        var a, o = e;
        "string" == typeof e ? o = c.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]);
        for (var r = t.split(" "), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++)
                o[i].addEventListener(r[l], n)
    }

    function E(e, t) {
        for (var n = c.createElement("div"), a = e.split(" "), o = 0; o < a.length; o++)
            n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t),
            n
    }

    function N(e) {
        return parseFloat(getComputedStyle(e, null).width.replace("px", ""))
    }

    function T(e) {
        for (; e.firstChild;)
            e.removeChild(e.firstChild)
    }

    function W(e, t, n) {
        var a = E("avatar"),
            o = E("color"),
            r = E("eyes"),
            i = E("mouth"),
            l = E("special"),
            s = E("owner");
        return s.style.display = n ? "block" : "none",
            a.appendChild(o),
            a.appendChild(r),
            a.appendChild(i),
            a.appendChild(l),
            a.appendChild(s),
            a.parts = [o, r, i],
            O(a, e, t || 48),
            a
    }

    function O(e, t, n) {
        function a(e, t, n, a) {
            var o = -t % n * 100,
                n = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + n + "%"
        }
        var o = t[0] % i,
            r = t[1] % l,
            n = t[2] % s,
            t = t[3];
        a(e.querySelector(".color"), o, 10),
            a(e.querySelector(".eyes"), r, 10),
            a(e.querySelector(".mouth"), n, 10);
        e = e.querySelector(".special");
        0 <= t ? (e.style.display = "",
            a(e, t, 10)) : e.style.display = "none"
    }

    function z(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }

    function Y(e, t, n, a) {
        let o = {
            element: E("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element),
            n.push(o.element),
            R(n, "DOMMouseScroll wheel", function (e) {
                var t;
                1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY,
                    t = Math.sign(t),
                    H(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)),
                    e.preventDefault(),
                    e.stopPropagation()
            }),
            P(o, t),
            o
    }

    function P(n, e) {
        T(n.element),
            n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = E("dot");
            e.appendChild(E("inner")),
                R(e, "click", function () {
                    H(n, t, !0)
                }),
                n.element.appendChild(e),
                n.dots.push(e)
        }
        n.selected < 0 && (n.selected = 0),
            n.selected >= e && (n.selected = e - 1),
            H(n, n.selected, !1)
    }

    function H(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++)
                t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"),
                t.change(t, e, n)
        }
    }
    const U = 0,
        B = 1,
        F = 2,
        j = 3,
        G = 4,
        V = 5;
    var Z = c.querySelector("#modal"),
        X = Z.querySelector(".title .text"),
        _ = Z.querySelector(".content"),
        K = [];

    function J(e) {
        K[U].querySelector(".buttons button.mute").textContent = Ae(e ? "Unmute" : "Mute")
    }

    function Q(e, a) {
        Z.style.display = "block";
        for (var t = 0; t < K.length; t++)
            K[t].style.display = "none";
        switch (K[e].style.display = "flex",
        e) {
            case B:
                X.textContent = Ae("Something went wrong!"),
                    K[B].querySelector(".message").textContent = a;
                break;
            case F:
                X.textContent = Ae("Disconnected!"),
                    K[F].querySelector(".message").textContent = a;
                break;
            case U: {
                X.textContent = "";
                let e = K[U].querySelector(".buttons");
                e.style.display = a.id == Mn ? "none" : "flex",
                    e.querySelector(".button-pair").style.display = Mn == $n ? "flex" : "none",
                    e.querySelector("button.report").style.display = a.reported ? "none" : "",
                    J(a.muted),
                    K[U].querySelector(".report-menu").style.display = "none";
                let t = _.querySelector(".player");
                T(t);
                let n = W(a.avatar, 96);
                z(n, $n == a.id),
                    n.style.width = "96px",
                    n.style.height = "96px",
                    t.appendChild(n),
                    t.appendChild(E("name", a.id == Mn ? Ae("$ (You)", a.name) : a.name))
            }
                break;
            case j:
                X.textContent = Ae("Rooms"),
                    ae(a);
                break;
            case G:
                X.textContent = An[M.NAME];
                break;
            case V:
                X.textContent = Ae("Settings"),
                    K[V].querySelector("#select-display-language").value = m.displayLang,
                    K[V].querySelector("#select-filter-chat").value = m.filterChat,
                    K[V].querySelector("#select-pressure-sensitivity").value = m.pressureSensitivity
        }
    }
    K[U] = Z.querySelector(".container-player"),
        K[B] = Z.querySelector(".container-info"),
        K[F] = Z.querySelector(".container-info"),
        K[j] = Z.querySelector(".container-rooms"),
        K[G] = Z.querySelector(".container-room"),
        K[V] = Z.querySelector(".container-settings");
    var ee = [],
        te = K[j].querySelector(".rooms"),
        e = K[j].querySelector(".footer"),
        ne = (K[j].querySelector(".dots"),
            Y(e, 0, [e, te], function (e, n, t) {
                for (let t = 0; t < ee.length; t++) {
                    let e = ee[t];
                    e.element.style.display = e.page == n ? "" : "none"
                }
            }));

    function ae(t) {
        ! function () {
            for (let e = 0; e < ee.length; e++)
                ee[e].element.remove();
            ee = []
        }();
        for (let e = 0; e < t.length; e++)
            ! function (e) {
                let t = E("room"),
                    n = E("type", 0 == e.type ? "P" : "C");
                n.dataset.type = e.type,
                    t.appendChild(n),
                    t.appendChild(E("name", e.settings[M.NAME])),
                    t.appendChild(E("slots", e.users + "/" + e.settings[M.SLOTS])),
                    t.appendChild(E("round", 0 < e.round ? e.round : Ae("Not started"))),
                    t.appendChild(E("mode", o[e.settings[M.WORDMODE]])),
                    t.appendChild(E("settings", e.settings[M.DRAWTIME] + "s")),
                    te.appendChild(t),
                    ee.push({
                        element: t,
                        page: 0,
                        data: e
                    }),
                    R(t, "click", function () {
                        Jn(e.id)
                    })
            }(t[e]);
        oe()
    }

    function oe() {
        var n = K[j].querySelector(".filter input").value,
            a = K[j].querySelector(".filter select.type").value;
        let o = 0,
            r = 0;
        for (let t = 0; t < ee.length; t++) {
            let e = ee[t];
            var i = -1 != a && e.data.type != a,
                l = "" != n && !e.data.settings[M.NAME].includes(n);
            i || l ? e.page = -1 : (e.page = r,
                o++,
                10 <= o && (r++,
                    o = 0))
        }
        var e = 0 == o && 0 == r;
        K[j].querySelector(".rooms .empty").style.display = e ? "flex" : "none",
            r = Math.max(1, r),
            P(ne, r),
            e = 1 < r,
            ne.element.style.display = e ? "" : "none"
    }

    function re() {
        Z.style.display = "none"
    }
    R(u, "click", function (e) {
        e.target == Z && re()
    }),
        R([Z.querySelector(".close"), K[B].querySelector("button.ok")], "click", re),
        R(K[j].querySelector(".filter select.type"), "change", oe),
        R(K[j].querySelector(".filter input"), "input", oe);
    var ie = c.querySelector("#game-chat form"),
        le = c.querySelector("#game-chat form input"),
        se = c.querySelector("#game-chat .content");
    const ce = ["neger", "negro", "nigger", "nigga", "cunt", "fuck", "fucker", "fucking", "fucked", "fucktard", "kill", "rape", "cock", "dick", "asshole", "slut", "whore", "semen", "fag", "faggot", "retard", "retarded", "arsch", "arschloch", "hurensohn", "fotze", "muschi", "schlampe", "pisser", "missgeburt", "nutte", "nuttensohn", "hundesohn", "hure", "ficker", "ficken", "fick", "spast", "spasti", "spastiker", "hailhitler", "heilhitler", "sieghail", "siegheil", "nazi"],
        de = [
            ["i", "î", "1", "!", "|"],
            ["e", "3", "€", "³"],
            ["a", "4", "@"],
            ["o", "ö", "0"],
            ["g", "q"],
            ["s", "$"]
        ];

    function ue(e) {
        for (var t, n, a = e.toLocaleLowerCase("en-US"), o = 0; o < de.length; o++)
            for (var r = de[o], i = 1; i < r.length; i++)
                t = r[i],
                    n = r[0],
                    a = a.split(t).join(n);
        for (var a = a.replace(/[^A-Z^a-z0-9^가-힣]/g, "*"), l = "", s = [], o = 0; o < a.length; o++) {
            var c = a.charAt(o);
            "*" != c && (l += c,
                s.push(o))
        }
        for (o = 0; o < ce.length; o++)
            for (var d = ce[o], u = -1; - 1 != (u = l.indexOf(d, u + 1));) {
                var h = s[u],
                    f = s[u + d.length - 1],
                    p = d.length,
                    p = "*".repeat(p);
                e = e.slice(0, h) + p + e.slice(f + 1)
            }
        return e
    }
    const he = 0;
    const fe = 2,
        pe = 3,
        ge = 4,
        me = 5,
        ye = 6,
        ve = 7;
    var Se = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];

    function ke(e) {
        return "var(--COLOR_CHAT_TEXT_" + Se[e] + ")"
    }

    function be(e, t, n, a) {
        var o = c.createElement("p"),
            r = c.createElement("b");
        r.textContent = a ? e : e + ": ",
            o.appendChild(r),
            o.style.color = n;
        n = c.createElement("span");
        n.textContent = t,
            o.appendChild(n);
        n = se.scrollHeight - se.scrollTop - se.clientHeight <= 20;
        return se.appendChild(o),
            n && (se.scrollTop = se.scrollHeight + 100),
            o
    }
    let we = void 0,
        Ce = void 0;

    function qe(e) {
        xe();
        var t = (Ce = e).dataset.tooltip,
            n = e.dataset.tooltipdir || "N";
        we = E("tooltip"),
            we.classList.add(n),
            we.appendChild(E("tooltip-arrow")),
            we.appendChild(E("tooltip-content", Ae(t)));
        let a = !1,
            o = e;
        for (; o;) {
            if ("fixed" == u.getComputedStyle(o).position) {
                a = !0;
                break
            }
            o = o.parentElement
        }
        we.style.position = a ? "fixed" : "absolute";
        e = e.getBoundingClientRect();
        let r = e.left,
            i = e.top;
        "N" == n && (r = (e.left + e.right) / 2),
            "S" == n && (r = (e.left + e.right) / 2,
                i = e.bottom),
            "E" == n && (r = e.right,
                i = (e.top + e.bottom) / 2),
            "W" == n && (i = (e.top + e.bottom) / 2),
            a || (r += u.scrollX,
                i += u.scrollY),
            we.style.left = r + "px",
            we.style.top = i + "px",
            c.body.appendChild(we)
    }

    function xe() {
        we && (we.remove(),
            we = void 0,
            Ce = void 0)
    }
    let Me = {},
        $e = [];

    function Le(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }

    function Ae(t, n) {
        var e = Le(Me[m.displayLang], t);
        e == t ? console.log("No translation found for: " + t) : t = e;
        let a = "",
            o = 0;
        Array.isArray(n) || (n = [n]);
        for (let e = 0; e < t.length; e++) {
            var r = t.charAt(e);
            "$" == r ? (a += n[o],
                o++) : a += r
        }
        return a
    }

    function De(t, n) {
        if ("children" != n) {
            let e = "";
            "text" == n && (e = t.textContent),
                "placeholder" == n && (e = t.placeholder),
                0 < e.length ? $e.push({
                    key: e,
                    element: t,
                    type: n
                }) : (console.log("Empty key passed to translate with!"),
                    console.log(t))
        } else
            for (let e = 0; e < t.children.length; e++) {
                var a = t.children[e].dataset.translate;
                De(t.children[e], null == a ? "text" : a)
            }
    }

    function Ie() {
        var n = Me[m.displayLang];
        for (let t = 0; t < $e.length; t++) {
            let e = $e[t];
            var a = Le(n, e.key);
            "text" == e.type && (e.element.textContent = a),
                "placeholder" == e.type && (e.element.placeholder = a)
        }
    }
    Me.en = {},
        Me.de = {
            "You have been kicked!": "Du wurdest gekickt!",
            "You have been banned!": "Du wurdest gebannt!",
            "You muted '$'!": "Du hast '$' stummgeschalten!",
            "You unmuted '$'!": "Du hast die Stummschaltung für '$' aufgehoben!",
            "You are on a kick cooldown!": "Du bist noch in der Kick Abklingzeit!",
            "You are banned from this room!": "Du bist von diesem Raum gebannt!",
            "You need at least 2 players to start the game!": "Du brauchst mind. 2 Spieler um das Spiel zu starten!",
            "Server restarting in about $ seconds!": "Server Neustart in ungefähr $ Sekunden!",
            "Spam detected! You're sending messages too quickly.": "Spam erkannt! Du sendest Nachrichten zu schnell.",
            "You can not votekick the lobby owner!": "Du kannst den Raumbesitzer nicht kicken!",
            "The word was '$'": "Das Wort war '$'",
            "$ is drawing now!": "$ zeichnet nun!",
            "$ is now the room owner!": "$ ist nun der Raumeigentümer!",
            "$ is voting to kick $ ($/$)": "$ möchte $ kicken ($/$)!",
            "$ joined the room!": "$ ist den Raum beigetreten!",
            "$ left the room!": "$ hat den Raum verlassen!",
            "$ has been kicked!": "$ wurde gekickt!",
            "$ has been banned!": "$ wurde gebannt!",
            "$ guessed the word!": "$ hat das Wort erraten!",
            "$ liked the drawing!": "$ mag die Zeichnung!",
            "$ disliked the drawing!": "$ mag die Zeichnung nicht!",
            "$ is close!": "$ ist nah dran!",
            "$ is choosing a word!": "$ wählt ein Wort!",
            "$ won with a score of $!": "$ hat mit einem Punktestand von $ gewonnen!",
            "$ and $ won with a score of $!": "$ und $ haben mit einem Punktestand von $ gewonnen!",
            WAITING: "WARTEN",
            "DRAW THIS": "ZEICHNE",
            "WORD HIDDEN": "WORT VERSTECKT",
            "GUESS THIS": "RATE",
            "$ (You)": "$ (Du)",
            "$ points": "$ Punkte",
            "Room not found!": "Raum nicht gefunden!",
            "Room is full!": "Raum ist voll!",
            "No rooms found!": "Keine Räume gefunden!",
            "An unknown error ('$')": "Unbekannter Fehler ('$')",
            "Something went wrong!": "Etwas ist schief gelaufen!",
            "Disconnected!": "Verbindung getrennt!",
            "Connection lost!": "Verbindung verloren!",
            "Servers are currently undergoing maintenance!": "Server werden derzeit gewartet",
            "Please try again later!": "Bitte versuch es später noch einmal!",
            "An unknown error occurred ('$')": "Ein unbekannter Fehler ist aufgetreten ('$')",
            Unmute: "Stumm. aufheben",
            Mute: "Stummschalten",
            Rooms: "Räume",
            Settings: "Einstellungen",
            "Not started": "Nicht gestartet",
            Round: "Runde",
            Rounds: "Runden",
            "Round $": "Runde $",
            "Round $ of $": "Runde $ von $",
            "Waiting for players...": "Auf Spieler warten...",
            "Game starting in a few seconds...": "Das Spiel beginnt in wenigen Sekunden...",
            "is the winner!": "hat gewonnen!",
            "are the winners!": "haben gewonnen!",
            "Nobody won!": "Niemand hat gewonnen!",
            "Choose a word": "Wähle ein Wort",
            "The word was": "Das Wort war",
            User: "Spieler",
            Play: "Spielen",
            "Create Room": "Raum erstellen",
            "View Rooms": "Räume ansehen",
            "How to play": "Wie gespielt wird",
            About: "Über",
            News: "Neuigkeiten",
            "When it's your turn, choose a word you want to draw!": "Wähle ein Wort, das du zeichnen willst, wenn du dran bist!",
            "Try to draw your choosen word! No spelling!": "Versuche nun dein Wort zu zeichnen. Kein Schreiben!",
            "Let other players try to guess your drawn word!": "Lass andere Mitspieler dein gezeichnetes Wort erraten!",
            "When it's not your turn, try to guess what other players are drawing!": "Wenn du nicht dran bist mit Zeichnen, versuche die Zeichnungen anderer zu erraten!",
            "Score the most points and be crowned the winner at the end!": "Sammel die meisten Punkte und werde zum Gewinner!",
            "is a free online multiplayer drawing and guessing pictionary game.": "ist ein kostenloses Mehrspieler-Zeichnen und Raten- / Montagsmaler-Spiel.",
            "A normal game consists of a few rounds, where every round a player has to draw their chosen word and others have to guess it to gain points!": "Ein normales Spiel besteht aus drei Runden, in welcher jeder Spieler sein gewähltes Wort zeichnen muss, während die Anderen es für Punkte erraten müssen!",
            "The person with the most points at the end of the game, will then be crowned as the winner!": "Die Person mit dem höchsten Punktestand am Ende des Spiels wird als Sieger gekrönt!",
            "Have fun!": "Viel Spaß!",
            "Invite your friends!": "Lad deine Freunde ein!",
            Copy: "Kopieren",
            "Hover over me to see the Invite link!": "Einladungslink hier anschauen!",
            "Click to copy the link to this room!": "Klicke um den Einladungslink zu kopieren!",
            Visibility: "Sichtbarkeit",
            Name: "Name",
            Players: "Spieler",
            Drawtime: "Zeit",
            Language: "Sprache",
            "Word Mode": "Wort-Modus",
            "Word Count ": "Wort-Anzahl",
            Hints: "Hinweise",
            "Custom words": "Eigene Wörter",
            "Minimum of 10 words. 1-32 characters per word! 10000 characters maximum. Separated by a , (comma)": "Minimum von 10 Wörtern. 1-32 Buchstaben pro Wort. 10000 Buchstaben maximal. Getrennt durch ein , (Komma)",
            "Use custom words only": "Nur eigene Wörter benutzen",
            "Start!": "Starten!",
            All: "Alle",
            Custom: "Benutzerdefiniert",
            Public: "Öffentlich",
            Private: "Privat",
            Mode: "Modus",
            Normal: "Normal",
            Hidden: "Versteckt",
            Combination: "Kombination",
            "Please select the reasons for your report": "Bitte wählen Sie die Gründe für Ihre Meldung",
            "Inappropriate Messages / Drawings": "Unangemessene Nachrichten / Zeichnungen",
            Spam: "Spam",
            "Botting / Cheating": "Botting / Cheating",
            "Your report for '$' has been sent!": "Deine Meldung für '$' wurde abgesendet!",
            "Enter your name": "Gib dein Namen ein",
            "Filter rooms by name here...": "Suche nach Räume hier...",
            "Type your guess here...": "Rate das gesuchte Wort hier...",
            "Everyone guessed the word!": "Jeder hat das Wort erraten!",
            "The drawer left the game!": "Der Zeichner hat das Spiel verlassen!",
            "Time is up!": "Die Zeit ist abgelaufen!",
            Kick: "Kicken",
            Ban: "Bannen",
            Votekick: "Votekicken",
            Report: "Melden",
            "Randomize your Avatar!": "Zufälliger Avatar!",
            Brush: "Stift",
            Colorpick: "Pinzette",
            Fill: "Füllen",
            Undo: "Rückgängig",
            Clear: "Löschen",
            "Mute audio": "Stummschalten",
            "Unmute audio": "Stumm. aufheben",
            "Turn the lights off": "Lichter ausmachen",
            "Turn the lights on": "Lichter anmachen",
            "Hotkeys & Misc.": "Tastenkürzel & Sonstiges",
            Hotkeys: "Tastenkürzel",
            Miscellaneous: "Sonstiges",
            "Display Language": "Anzeigesprache",
            "Filter bad words in chat": "Schlechte Wörter im Chat filtern",
            "Brush Pressure Sensitivity": "Stiftdruckempfindlichkeit",
            Reset: "Zurücksetzen",
            "Reset hotkeys to default": "Tastenkürzel zurücksetzen",
            On: "An",
            Off: "Aus"
        };
    const Re = 0,
        Ee = 1;
    const Ne = 0,
        Te = 1,
        We = 2;
    const Oe = 4,
        ze = 40;
    var Ye, Pe = c.querySelector("#game-toolbar"),
        He = Pe.querySelectorAll(".tools-container .tools")[0],
        Ue = Pe.querySelectorAll(".tools-container .tools")[1],
        Be = (Ye = Pe.querySelector(".tool")).parentElement.removeChild(Ye);

    function Fe(e, t) {
        let n = Be.cloneNode(!0);
        var a, o, r, i = (t.isAction ? m.hotkeysActions : m.hotkeysTools)[e];
        let l = t;
        l.id = e,
            l.element = n,
            n.toolIndex = e,
            n.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")",
            n.querySelector(".key").textContent = i,
            a = n,
            o = t.name,
            r = "N",
            a.dataset.tooltip = o,
            a.dataset.tooltipdir = r,
            R(a, "mouseenter", function (e) {
                qe(e.target)
            }),
            R(a, "mouseleave", function (e) {
                xe()
            }),
            t.isAction ? (n.addEventListener("click", function (e) {
                xt(this.toolIndex)
            }),
                Ue.appendChild(n),
                Ve[e] = l) : (n.addEventListener("click", function (e) {
                    Mt(this.toolIndex)
                }),
                    He.appendChild(n),
                    Ge[e] = l);
        e = E("key", l.name);
        De(e, "text"),
            l.listing = E("item"),
            l.listing.appendChild(e);
        let s = c.createElement("input");
        s.value = i,
            l.listing.appendChild(s),
            R(s, "keydown", function (e) {
                var t = e.key;
                return je(l, t),
                    D(),
                    e.preventDefault(),
                    !1
            }),
            K[V].querySelector("#hotkey-list").appendChild(l.listing)
    }

    function je(e, t) {
        e.isAction ? m.hotkeysActions[e.id] = t : m.hotkeysTools[e.id] = t,
            e.element.querySelector(".key").textContent = t,
            e.listing.querySelector("input").value = t
    }
    var Ge = [];
    Fe(Ne, {
        isAction: !1,
        name: "Brush",
        graphic: "pen.gif",
        cursor: 0
    }),
        Fe(Te, {
            isAction: !1,
            name: "Colorpick",
            graphic: "pick.gif",
            cursor: "url(/img/pick_cur.png) 7 36, default"
        }),
        Fe(We, {
            isAction: !1,
            name: "Fill",
            graphic: "fill.gif",
            cursor: "url(/img/fill_cur.png) 7 38, default"
        });
    var Ve = [];
    Fe(0, {
        isAction: !0,
        name: "Undo",
        graphic: "undo.gif",
        action: function () {
            {
                var e;
                0 < tt.length && (tt.pop(),
                    0 < tt.length ? (Et(e = tt[tt.length - 1]),
                        qn && qn.emit("data", {
                            id: Da,
                            data: e
                        })) : zt())
            }
        }
    }),
        Fe(1, {
            isAction: !0,
            name: "Clear",
            graphic: "clear.gif",
            action: zt
        });
    var Ze = c.querySelector("#game-canvas canvas"),
        Xe = Ze.getContext("2d"),
        _e = [],
        Ke = 0,
        Je = 0,
        Qe = [],
        et = [0, 9999, 9999, 0, 0],
        tt = [],
        nt = [0, 0],
        at = [0, 0],
        ot = 0,
        rt = c.createElement("canvas");
    rt.width = ze + 2,
        rt.height = ze + 2;
    var it = rt.getContext("2d");

    function lt() {
        var t = Ge[ct].cursor;
        if (Dn.id == h && Ln == Mn) {
            if (ct == Ne) {
                var n, a, o, r = rt.width,
                    i = ft;
                if (i <= 0)
                    return;
                it.clearRect(0, 0, r, r);
                // TYPOMOD
                // desc: cursor with custom color
                let e = dt < 10000 ? ht[dt] : typo.hexToRgb((dt - 10000).toString(16).padStart(6, "0"));
                // TYPOEND
                // ORIGINAL let e = ht[dt];
                1 == m.dark && (n = Math.floor(.75 * e[0]),
                    a = Math.floor(.75 * e[1]),
                    o = Math.floor(.75 * e[2]),
                    e = [n, a, o]),
                    it.fillStyle = It(e),
                    it.beginPath(),
                    it.arc(r / 2, r / 2, i / 2 - 1, 0, 2 * Math.PI),
                    it.fill(),
                    it.strokeStyle = "#FFF",
                    it.beginPath(),
                    it.arc(r / 2, r / 2, i / 2 - 1, 0, 2 * Math.PI),
                    it.stroke(),
                    it.strokeStyle = "#000",
                    it.beginPath(),
                    it.arc(r / 2, r / 2, i / 2, 0, 2 * Math.PI),
                    it.stroke();
                r = r / 2,
                    t = "url(" + rt.toDataURL() + ")" + r + " " + r + ", default"
            }
        } else
            t = "default";
        Ze.style.cursor = t
    }
    for (var st = 0, ct = 0, dt = 0, ut = 0, ht = [
        [255, 255, 255],
        [80, 80, 80],
        [0, 0, 0],
        [210, 210, 210],
        [168, 168, 168],
        [126, 126, 126],
        [239, 19, 11],
        [183, 6, 0],
        [86, 8, 6],
        [255, 113, 0],
        [206, 67, 12],
        [137, 39, 0],
        [255, 228, 0],
        [232, 162, 0],
        [163, 103, 0],
        [0, 204, 0],
        [0, 114, 21],
        [0, 61, 3],
        [0, 255, 145],
        [0, 158, 114],
        [0, 120, 93],
        [0, 178, 255],
        [0, 86, 158],
        [0, 59, 120],
        [35, 31, 211],
        [18, 11, 145],
        [8, 3, 82],
        [163, 0, 186],
        [108, 0, 135],
        [65, 0, 81],
        [211, 124, 170],
        [167, 85, 116],
        [118, 48, 75],
        [255, 172, 142],
        [226, 139, 93],
        [204, 119, 77],
        [160, 82, 45],
        [99, 48, 13],
        [72, 28, 0]
    ], ft = 0, pt = -1, gt = [], mt = 6, yt = 0; yt < mt; yt++) {
        var vt = yt / (mt - 1),
            St = 11 + 32 * (1 - vt),
            kt = (Oe,
                ze,
                Oe,
                c.createElement("div"));
        kt.classList.add("size");
        vt = c.createElement("div");
        vt.classList.add("icon"),
            vt.style.borderRadius = "100%",
            vt.style.left = St + "%",
            vt.style.right = St + "%",
            vt.style.top = St + "%",
            vt.style.bottom = St + "%",
            kt.appendChild(vt),
            c.querySelector("#game-toolbar .color-picker .sizes").appendChild(kt),
            gt.push([kt, vt])
    }

    function bt(e) {
        for (var t = 0; t < mt; t++)
            gt[t][1].style.backgroundColor = e
    }

    function wt() {
        var e = (ft - Oe) / (ze - Oe),
            t = N(Pe.querySelector(".slider .track")),
            n = N(Pe.querySelector(".slider")),
            n = ((n - t) / 2 + e * t) / n;
        Pe.querySelector(".slider .knob").style.left = 100 * e + "%",
            Pe.querySelector(".slider .bar-fill").style.width = 100 * n + "%";
        n = Pe.querySelector(".color-picker .preview .graphic .brush"),
            e = 30 * e + 8;
        n.style.width = e + "px",
            n.style.height = e + "px",
            Pe.querySelector(".color-picker .preview .size").textContent = ft + "px"
    }

    function Ct(e) {
        ft = Ht(e, Oe, ze),
            wt(),
            lt()
    }

    function qt(e) {
        e.classList.remove("clicked"),
            e.offsetWidth,
            e.classList.add("clicked")
    }

    function xt(e) {
        qt(Ve[e].element),
            Ve[e].action()
    }

    function Mt(e, t) {
        qt(Ge[e].element),
            e == ct && !t || (Ge[st = ct].element.classList.remove("selected"),
                Ge[e].element.classList.add("selected"),
                ct = e,
                lt())
    }

    function $t(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            It(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            It(ht[e]);
        // TYPOEND
        // ORIGINAL  var t = It(ht[e]);
        bt(t),
            dt = e,
            c.querySelector("#color-preview-primary").style.fill = t,
            lt()
    }

    function Lt(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            It(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            It(ht[e]);
        // TYPOEND
        // ORIGINAL var t = It(ht[e]);
        bt(t),
            ut = e,
            c.querySelector("#color-preview-secondary").style.fill = t,
            lt()
    }

    function At() {
        Pe.querySelector(".color-picker .brushmenu").classList.remove("open"),
            Pe.querySelector(".color-picker .preview").classList.remove("open")
    }
    for (yt = 0; yt < ht.length / 3; yt++)
        Pe.querySelector(".top").appendChild(Dt(3 * yt)),
            Pe.querySelector(".mid").appendChild(Dt(3 * yt + 1)),
            Pe.querySelector(".bottom").appendChild(Dt(3 * yt + 2));

    function Dt(e) {
        var t = E("item"),
            n = E("inner");
        return n.style.backgroundColor = It(ht[e]),
            t.appendChild(n),
            t.colorIndex = e,
            t
    }

    function It(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function Rt(e) {
        // TYPOMOD
        // desc: if color code > 1000 -> customcolor
        if (e < 10000) e = Ht(e, 0, ht.length), e = ht[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));
        // TYPOEND
        // ORIGINAL  e = Ht(e, 0, ht.length), e = ht[e];
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function Et(e) {
        // TYPOMOD
        // desc: replace draw commands because of redo
        const keepCommands = _e;
        // TYPOEND
        if (_e = _e.slice(0, e),
            !(Mn != Ln && Je < e)) {
            et = Tt();
            e = Math.floor(_e.length / Nt);
            Qe = Qe.slice(0, e),
                Ft();
            for (var t = 0; t < Qe.length; t++) {
                var n = Qe[t];
                Xe.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = Qe.length * Nt; t < _e.length; t++)
                Wt(Pt(_e[t]));
            Ke = Math.min(_e.length, Ke),
                Je = Math.min(_e.length, Je)
        }
        // TYPOMOD 
        // log kept commands
        document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
        // TYPOEND
    }
    const Nt = 200;

    function Tt() {
        return [0, 9999, 9999, 0, 0]
    }

    function Wt(e) {
        var t, n, a;
        et[0] += 1,
            et[1] = Math.min(et[1], e[0]),
            et[2] = Math.min(et[2], e[1]),
            et[3] = Math.max(et[3], e[2]),
            et[4] = Math.max(et[4], e[3]),
            et[0] >= Nt && (t = et[1],
                a = et[2],
                n = et[3],
                e = et[4],
                a = Xe.getImageData(t, a, n - t, e - a),
                Qe.push({
                    data: a,
                    bounds: et
                }),
                et = Tt())
    }

    function Ot(e) {
        return (e || 0 < _e.length || 0 < tt.length || 0 < Ke || 0 < Je) && (_e = [],
            tt = [],
            Ke = Je = 0,
            et = Tt(),
            Qe = [],
            Ft(),
            1)
    }

    function zt() {
        Ot() && qn && qn.emit("data", {
            id: Aa
        })
    }

    function Yt(e) {
        // TYPOMOD
        // log draw commands
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        // TYPOEND
        _e.push(e),
            Mn == Ln && Wt(Pt(e))
    }

    function Pt(e) {
        var t = [0, 0, Ze.width, Ze.height];
        switch (e[0]) {
            case Re:
                var n = Ht(Math.floor(e[2]), Oe, ze),
                    a = Math.floor(Math.ceil(n / 2)),
                    o = Ht(Math.floor(e[3]), -a, Ze.width + a),
                    r = Ht(Math.floor(e[4]), -a, Ze.height + a),
                    i = Ht(Math.floor(e[5]), -a, Ze.width + a),
                    l = Ht(Math.floor(e[6]), -a, Ze.height + a),
                    s = Rt(e[1]);
                t[0] = Ht(o - a, 0, Ze.width),
                    t[1] = Ht(r - a, 0, Ze.height),
                    t[2] = Ht(i + a, 0, Ze.width),
                    t[3] = Ht(l + a, 0, Ze.height),
                    Bt(o, r, i, l, n, s.r, s.g, s.b);
                break;
            case Ee:
                s = Rt(e[1]);
                ! function (e, t, a, o, r) {
                    var i = Xe.getImageData(0, 0, Ze.width, Ze.height),
                        n = [
                            [e, t]
                        ],
                        l = function (e, t, n) {
                            t = 4 * (n * e.width + t);
                            return 0 <= t && t < e.data.length ? [e.data[t], e.data[1 + t], e.data[2 + t]] : [0, 0, 0]
                        }(i, e, t);
                    if (a != l[0] || o != l[1] || r != l[2]) {
                        function s(e) {
                            var t = i.data[e],
                                n = i.data[e + 1],
                                e = i.data[e + 2];
                            if (t == a && n == o && e == r)
                                return !1;
                            t = Math.abs(t - l[0]),
                                n = Math.abs(n - l[1]),
                                e = Math.abs(e - l[2]);
                            return t < 1 && n < 1 && e < 1
                        }
                        for (var c, d, u, h, f, p, g = i.height, m = i.width; n.length;) {
                            for (c = n.pop(),
                                d = c[0],
                                u = c[1],
                                h = 4 * (u * m + d); 0 <= u-- && s(h);)
                                h -= 4 * m;
                            for (h += 4 * m,
                                ++u,
                                p = f = !1; u++ < g - 1 && s(h);)
                                Ut(i, h, a, o, r),
                                    0 < d && (s(h - 4) ? f || (n.push([d - 1, u]),
                                        f = !0) : f = f && !1),
                                    d < m - 1 && (s(h + 4) ? p || (n.push([d + 1, u]),
                                        p = !0) : p = p && !1),
                                    h += 4 * m
                        }
                        Xe.putImageData(i, 0, 0)
                    }
                }(Ht(Math.floor(e[2]), 0, Ze.width), Ht(Math.floor(e[3]), 0, Ze.height), s.r, s.g, s.b)
        }
        return t
    }

    function Ht(e, t, n) {
        return e < t ? t : n < e ? n : e
    }

    function Ut(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n,
            e.data[t + 1] = a,
            e.data[t + 2] = o,
            e.data[t + 3] = 255)
    }

    function Bt(e, t, n, a, o, r, i, l) {
        var s = Math.floor(o / 2),
            c = s * s,
            d = Math.min(e, n) - s,
            u = Math.min(t, a) - s,
            h = Math.max(e, n) + s,
            o = Math.max(t, a) + s;
        e -= d,
            t -= u,
            n -= d,
            a -= u;

        function f(e, t) {
            for (var n = -s; n <= s; n++)
                for (var a, o = -s; o <= s; o++)
                    n * n + o * o < c && (0 <= (a = 4 * ((t + o) * p.width + e + n)) && a < p.data.length && (p.data[a] = r,
                        p.data[1 + a] = i,
                        p.data[2 + a] = l,
                        p.data[3 + a] = 255))
        }
        var p = Xe.getImageData(d, u, h - d, o - u);
        if (e == n && t == a)
            f(e, t);
        else {
            f(e, t),
                f(n, a);
            var g = Math.abs(n - e),
                m = Math.abs(a - t),
                y = e < n ? 1 : -1,
                v = t < a ? 1 : -1,
                S = g - m;
            for (Math.floor(Math.max(0, s - 10) / 5); e != n || t != a;) {
                var k = S << 1; -
                    m < k && (S -= m,
                        e += y),
                    k < g && (S += g,
                        t += v),
                    f(e, t)
            }
        }
        Xe.putImageData(p, d, u)
    }

    function Ft() {
        // TYPOMOD
        // desc: log a canvas clear
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        Xe.fillStyle = "#FFF", Xe.fillRect(0, 0, Ze.width, Ze.height)
        document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        // TYPOEND
        // ORIGINAL Pe.fillStyle = "#FFF", Pe.fillRect(0, 0, Fe.width, Fe.height)
    }
    var jt = !1;

    function Gt(e) {
        var t = c.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        Ct(Oe + Math.round(Ht((e - t.left) / t.width, 0, 1) * (ze - Oe)))
    }
    R("#game-toolbar .slider", "mousedown", function (e) {
        0 == e.button && (jt = !0,
            Gt(e.clientX))
    }),
        R("#game-toolbar .slider", "touchstart", function (e) {
            jt = !0,
                Gt(e.touches[0].clientX)
        }),
        R(Pe, "contextmenu", function (e) {
            return e.preventDefault(),
                !1
        }),
        R("#game-toolbar .color-picker .colors * .item", "mousedown", function (e) {
            var t = this.colorIndex;
            0 == e.button ? (e.altKey ? Lt : $t)(t) : 2 == e.button && Lt(t)
        });
    var Vt = Pe.querySelector(".color-picker .preview"),
        Zt = Pe.querySelector(".color-picker .brushmenu");
    R([Ze, Vt, Zt], "DOMMouseScroll wheel", function (e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY,
            e = Math.sign(e);
        Ct(ft + 4 * e)
    }),
        R(Vt, "click", function (e) {
            this.classList.contains("open") ? At() : (Pe.querySelector(".color-picker .brushmenu").classList.add("open"),
                Pe.querySelector(".color-picker .preview").classList.add("open"),
                wt())
        }),
        R(c, "keypress", function (e) {
            if ("Enter" == e.code)
                return le.focus(),
                    0;
            if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != pt)
                return 0;
            for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < Ge.length; n++)
                if (m.hotkeysTools[Ge[n].id].toLowerCase() == t)
                    return Mt(Ge[n].id),
                        e.preventDefault(),
                        0;
            for (n = 0; n < Ve.length; n++)
                if (m.hotkeysActions[Ve[n].id].toLowerCase() == t)
                    return xt(Ve[n].id),
                        e.preventDefault(),
                        0
        }),
        R(c, "touchmove", function (e) {
            jt && Gt(e.touches[0].clientX)
        }),
        R(c, "touchend touchcancel", function (e) {
            jt = !1
        }),
        R(Ze, "contextmenu", function (e) {
            return e.preventDefault(),
                !1
        }),
        R(Ze, "mousedown", function (e) {
            e.preventDefault(),
                0 != e.button && 2 != e.button || -1 != pt || Qt(e.button, e.clientX, e.clientY, !0, -1)
        }),
        R(c, "mouseup", function (e) {
            e.preventDefault(),
                en(e.button),
                jt = !1
        }),
        R(c, "mousemove", function (e) {
            Jt(e.clientX, e.clientY, !1, -1),
                jt && Gt(e.clientX)
        });

    // TYPOMOD 
    // desc: add event handlers for typo features
    R(".avatar-customizer .container", "pointerdown", () => {
        ta(typo.createFakeLobbyData()); // IDENTIFY x(typo.c()): .querySelector("#home").style.display = "none"
    });
    // TYPOEND
    var Xt = null;

    function _t(e, t, n, a) {
        var o = Ze.getBoundingClientRect(),
            e = Math.floor((e - o.left) / o.width * Ze.width),
            o = Math.floor((t - o.top) / o.height * Ze.height);
        a ? (ot = n,
            at[0] = nt[0] = e,
            at[1] = nt[1] = o) : (at[0] = nt[0],
                at[1] = nt[1],
                ot = n,
                nt[0] = e,
                nt[1] = o)
    }
    R(Ze, "touchstart", function (e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Xt && (Xt = e[0].identitfier,
            Qt(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }),
        R(Ze, "touchend touchcancel", function (e) {
            e.preventDefault(),
                en(pt)
        }),
        R(Ze, "touchmove", function (e) {
            e.preventDefault();
            for (var t = e.changedTouches, n = 0; n < t.length; n++)
                if (t[n].identitfier == Xt) {
                    Jt(t[n].clientX, t[n].clientY, !1, t[n].force);
                    break
                }
        });
    var Kt = 0;

    function Jt(e, t, n, a) {
        _t(e, t, a = !m.pressureSensitivity ? -1 : a, n),
            tn(!1)
    }

    function Qt(e, t, n, a, o) {
        _e.length,
            pt = e,
            _t(t, n, o, a),
            tn(!0)
    }

    function en(e) {
        -1 == e || 0 != e && 2 != e || pt != e || (Kt = _e.length,
            tt.push(Kt),
            Xt = null,
            pt = -1)
    }

    function tn(e) {
        if (Dn.id == h && Ln == Mn && -1 != pt) {
            var t = 0 == pt ? dt : ut,
                n = null;
            if (e && (ct == We && (o = t,
                r = nt[0],
                i = nt[1],
                n = [Ee, o, r, i]),
                ct == Te)) {
                var a = function (e, t) {
                    for (var n = (t = Xe.getImageData(e, t, 1, 1)).data[0], a = t.data[1], o = t.data[2], r = 0; r < ht.length; r++) {
                        var i = ht[r],
                            l = i[0] - n,
                            s = i[1] - a,
                            i = i[2] - o;
                        if (0 == l && 0 == s && 0 == i)
                            return r
                    }
                    // TYPOMOD
                    // desc: if color is not in array, convert to custom color
                    r = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
                    // TYPOEND
                    return r
                }(nt[0], nt[1]);
                return (0 == pt ? $t : Lt)(a),
                    void Mt(st)
            }
            ct == Ne && (e = ft,
                0 <= ot && (e = (ft - Oe) * Ht(ot, 0, 1) + Oe),
                o = t,
                r = e,
                i = at[0],
                a = at[1],
                t = nt[0],
                e = nt[1],
                n = [Re, o, r, i, a, t, e]),
                null != n && Yt(n)
        }
        var o, r, i
    }
    setInterval(() => {
        var e, t;
        qn && Dn.id == h && Ln == Mn && 0 < _e.length - Ke && (t = _e.slice(Ke, e = Ke + 8),
            qn.emit("data", {
                id: La,
                data: t
            }),
            Ke = Math.min(e, _e.length))
    }, 50),
        setInterval(function () {
            qn && Dn.id == h && Ln != Mn && Je < _e.length && (Wt(Pt(_e[Je])),
                Je++)
        }, 3);
    var nn = c.querySelector("#game-canvas .overlay"),
        an = c.querySelector("#game-canvas .overlay-content"),
        on = c.querySelector("#game-canvas .overlay-content .text"),
        rn = c.querySelector("#game-canvas .overlay-content .words"),
        ln = c.querySelector("#game-canvas .overlay-content .reveal"),
        sn = c.querySelector("#game-canvas .overlay-content .result"),
        cn = -100,
        dn = 0,
        un = void 0;

    function hn(e, r, i) {
        let l = cn,
            s = dn,
            c = e.top - l,
            d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001)
            i && i();
        else {
            let a = void 0,
                o = 0;
            un = u.requestAnimationFrame(function e(t) {
                null == a && (a = t);
                var n = t - a;
                a = t,
                    o = Math.min(o + n, r);
                t = o / r,
                    n = (n = t) < .5 ? .5 * function (e, t) {
                        return e * e * ((t + 1) * e - t)
                    }(2 * n, 1.2 * 1.5) : .5 * (function (e, t) {
                        return e * e * ((t + 1) * e + t)
                    }(2 * n - 2, 1.2 * 1.5) + 2),
                    t = t * t * (3 - 2 * t);
                cn = l + c * n,
                    dn = s + d * t,
                    an.style.top = cn + "%",
                    nn.style.opacity = dn,
                    o == r ? i && i() : un = u.requestAnimationFrame(e)
            })
        }
    }

    function fn(e) {
        e.classList.add("show")
    }

    function pn(l) {
        switch (! function () {
            for (var e = 0; e < an.children.length; e++)
                an.children[e].classList.remove("show")
        }(),
        l.id) {
            case w:
                fn(on),
                    on.textContent = Ae("Round $", l.data + 1);
                break;
            case k:
                fn(on),
                    on.textContent = Ae("Waiting for players...");
                break;
            case b:
                fn(on),
                    on.textContent = Ae("Game starting in a few seconds...");
                break;
            case q:
                fn(ln),
                    ln.querySelector("p span.word").textContent = l.data.word,
                    ln.querySelector(".reason").textContent = function (e) {
                        switch (e) {
                            case y:
                                return Ae("Everyone guessed the word!");
                            case S:
                                return Ae("The drawer left the game!");
                            case v:
                                return Ae("Time is up!");
                            default:
                                return "Error!"
                        }
                    }(l.data.reason);
                var e = ln.querySelector(".player-container");
                T(e);
                for (var t = [], n = 0; n < l.data.scores.length; n += 3) {
                    var a = l.data.scores[n + 0],
                        o = (l.data.scores[n + 1],
                            l.data.scores[n + 2]);
                    (s = Ta(a)) && t.push({
                        name: s.name,
                        score: o
                    })
                }
                t.sort(function (e, t) {
                    return t.score - e.score
                });
                for (n = 0; n < t.length; n++) {
                    var r = E("player"),
                        s = t[n];
                    r.appendChild(E("name", s.name));
                    var c = E("score", (0 < s.score ? "+" : "") + s.score);
                    s.score <= 0 && c.classList.add("zero"),
                        r.appendChild(c),
                        e.appendChild(r)
                }
                break;
            case x:
                fn(sn);
                let i = [sn.querySelector(".podest-1"), sn.querySelector(".podest-2"), sn.querySelector(".podest-3"), sn.querySelector(".ranks")];
                for (let e = 0; e < 4; e++)
                    T(i[e]);
                if (0 < l.data.length) {
                    let r = [
                        [],
                        [],
                        [],
                        []
                    ];
                    for (let e = 0; e < l.data.length; e++) {
                        var d = {
                            player: Ta(l.data[e][0]),
                            rank: l.data[e][1],
                            title: l.data[e][2]
                        };
                        d.player && r[Math.min(d.rank, 3)].push(d)
                    }
                    for (let o = 0; o < 3; o++) {
                        let a = r[o];
                        if (0 < a.length) {
                            var u = a.map(function (e) {
                                return e.player.name
                            }).join(", "),
                                h = a[0].player.score;
                            let e = i[o];
                            e.appendChild(E("rank-place", "#" + (o + 1))),
                                e.appendChild(E("rank-name", u)),
                                e.appendChild(E("rank-score", Ae("$ points", h)));
                            let n = E("avatar-container");
                            e.appendChild(n),
                                0 == o && n.appendChild(E("trophy"));
                            for (let t = 0; t < a.length; t++) {
                                let e = W(a[t].player.avatar, 96, 0 == o);
                                e.style.width = "96px",
                                    e.style.height = "96px",
                                    e.style.left = 16 * -(a.length - 1) + 32 * t + "px",
                                    0 == o && (e.classList.add("winner"),
                                        e.style.animationDelay = -2.35 * t + "s"),
                                    n.appendChild(e)
                            }
                        }
                    }
                    var f = Math.min(5, r[3].length);
                    for (let n = 0; n < f; n++) {
                        var p = r[3][n];
                        let e = E("rank"),
                            t = W(p.player.avatar, 48, !1);
                        t.style.width = "48px",
                            t.style.height = "48px",
                            e.appendChild(t),
                            e.appendChild(E("rank-name", "#" + (p.rank + 1) + " " + p.player.name)),
                            e.appendChild(E("rank-score", Ae("$ points", p.player.score))),
                            i[3].appendChild(e)
                    }
                    0 < r[0].length ? (m = r[0].map(function (e) {
                        return e.player.name
                    }).join(", "),
                        sn.querySelector(".winner-name").textContent = 0 < r[0].length ? m : "<user left>",
                        sn.querySelector(".winner-text").textContent = " " + (1 == r[0].length ? Ae("is the winner!") : Ae("are the winners!"))) : (sn.querySelector(".winner-name").textContent = "",
                            sn.querySelector(".winner-text").textContent = Ae("Nobody won!"))
                } else
                    sn.querySelector(".winner-name").textContent = "",
                        sn.querySelector(".winner-text").textContent = Ae("Nobody won!");
                break;
            case C:
                if (l.data.words)
                    if (fn(on),
                        fn(rn),
                        T(rn),
                        An[M.WORDMODE] == $.COMBINATION) {
                        on.textContent = Ae("Choose the first word"),
                            console.log(l.data.words);
                        let a = l.data.words.length / 2,
                            o = [],
                            r = [],
                            i = 0;
                        for (let n = 0; n < a; n++) {
                            let e = E("word", l.data.words[n]);
                            e.index = n;
                            let t = E("word", l.data.words[n + a]);
                            t.index = n,
                                t.style.display = "none",
                                t.style.animationDelay = .03 * n + "s",
                                o.push(e),
                                r.push(t),
                                R(e, "click", function () {
                                    i = this.index;
                                    for (let e = 0; e < a; e++)
                                        o[e].style.display = "none",
                                            r[e].style.display = "";
                                    on.textContent = Ae("Choose the second word")
                                }),
                                R(t, "click", function () {
                                    da([i, this.index])
                                }),
                                rn.appendChild(e),
                                rn.appendChild(t)
                        }
                    } else {
                        on.textContent = Ae("Choose a word");
                        for (n = 0; n < l.data.words.length; n++) {
                            var g = E("word", l.data.words[n]);
                            g.index = n,
                                R(g, "click", function () {
                                    da(this.index)
                                }),
                                rn.appendChild(g)
                        }
                    }
                else {
                    fn(on);
                    var m = (s = Ta(l.data.id)) ? s.name : Ae("User");
                    on.textContent = Ae("$ is choosing a word!", m)
                }
        }
    }
    const gn = 0,
        mn = 1,
        yn = 2,
        vn = 3,
        Sn = 4,
        kn = 5,
        bn = 6;

    function wn(e, t) {
        this.url = t,
            this.buffer = null,
            this.loaded = !1;
        var n = this,
            a = new XMLHttpRequest;
        a.open("GET", t, !0),
            a.responseType = "arraybuffer",
            a.onload = function () {
                e.context.decodeAudioData(a.response, function (e) {
                    n.buffer = e,
                        n.loaded = !0
                }, function (e) {
                    console.log("Failed loading audio from url '" + t + "'")
                })
            },
            a.send()
    }
    var Cn = function () {
        this.context = null,
            this.sounds = new Map,
            u.addEventListener("load", this.load.bind(this), !1)
    };
    Cn.prototype.addSound = function (e, t) {
        this.sounds.set(e, new wn(this, t))
    },
        Cn.prototype.loadSounds = function () {
            this.addSound(gn, "/audio/roundStart.ogg"),
                this.addSound(mn, "/audio/roundEndSuccess.ogg"),
                this.addSound(yn, "/audio/roundEndFailure.ogg"),
                this.addSound(vn, "/audio/join.ogg"),
                this.addSound(Sn, "/audio/leave.ogg"),
                this.addSound(kn, "/audio/playerGuessed.ogg"),
                this.addSound(bn, "/audio/tick.ogg")
        },
        Cn.prototype.playSound = function (e) {
            var t, n;
            null != this.context && ("running" == this.context.state ? null == this.context || m.audioMute || !this.sounds.has(e) || (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer,
                n.connect(this.context.destination),
                n.start(0)) : this.context.resume().then(() => {
                    this.playSound(e)
                }))
        },
        Cn.prototype.load = function () {
            try {
                u.AudioContext = u.AudioContext || u.webkitAudioContext,
                    this.context = new AudioContext
            } catch (e) {
                return console.log("Error creating AudioContext."),
                    void (this.context = null)
            }
            this.loadSounds()
        };
    k;
    var qn, xn = [],
        Mn = 0,
        $n = -1,
        Ln = -1,
        An = [],
        Dn = {
            id: -1,
            time: 0,
            data: 0
        },
        In = -1,
        Rn = 0,
        En = void 0,
        Nn = new Cn,
        Tn = void 0,
        Wn = !1,
        On = c.querySelector("#game-room"),
        zn = c.querySelector("#game-players"),
        Yn = c.querySelector("#game-board"),
        Pn = c.querySelector("#game-info"),
        Hn = zn.querySelector(".list"),
        Un = zn.querySelector(".footer"),
        Bn = c.querySelector("#game-round"),
        Fn = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")],
        jn = c.querySelector("#home .container-name-lang input"),
        Gn = c.querySelector("#home .container-name-lang select"),
        Vn = c.querySelector("#home .panel .button-play"),
        Zn = c.querySelector("#home .panel .button-create"),
        e = c.querySelector("#home .panel .button-rooms");

    function Xn(e) {
        Wn = e,
            c.querySelector("#load").style.display = e ? "block" : "none"
    }

    function _n(e, t, n, a) {
        var o, r;
        o = e,
            e = t,
            r = function (e, t) {
                switch (e) {
                    case 200:
                        return void n({
                            success: !0,
                            data: t
                        });
                    case 503:
                    case 0:
                        a && Q(B, Ae("Servers are currently undergoing maintenance!") + "\n\r" + Ae("Please try again later!"));
                        break;
                    default:
                        a && Q(B, Ae("An unknown error occurred ('$')", e) + "\n\r" + Ae("Please try again later!"))
                }
                n({
                    success: !1,
                    error: e
                })
            },
            (t = new XMLHttpRequest).onreadystatechange = function () {
                4 == this.readyState && r(this.status, this.response)
            },
            t.open("POST", o, !0),
            t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            t.send(e)
    }

    function Kn(e, t) {
        Nn.context.resume(),
            qn && ca();
        let n = 0;
        (qn = a(e, {
            closeOnBeforeunload: !1
        })).on("connect", function () {
            // TYPOMOD
            // desc: disconnect socket & leave lobby
            typo.disconnect = () => {
                if (qn) {
                    qn.typoDisconnect = true;
                    qn.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    qn.off("data");
                    qn.reconnect = false;
                    qn.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            // TYPOEND
            qn.on("joinerr", function (e) {
                ca(),
                    Q(B, function (e) {
                        switch (e) {
                            case 1:
                                return Ae("Room not found!");
                            case 2:
                                return Ae("Room is full!");
                            case 3:
                                return Ae("You are on a kick cooldown!");
                            case 4:
                                return Ae("You are banned from this room!");
                            default:
                                return Ae("An unknown error ('$') occured!", e)
                        }
                    }(e))
            }),
                qn.on("data", Na);
            var e = jn.value.split("#"),
                e = {
                    join: t,
                    name: e[0],
                    lang: Gn.value,
                    code: e[1],
                    avatar: m.avatar
                };
            qn.emit("login", e)
        }),
            qn.on("reason", function (e) {
                n = e
            }),
            qn.on("disconnect", function () {
                // TYPOMOD
                // DESC: no msg if disconnect intentionally
                if(!qn.typoDisconnect)
                //TYPOEND
                switch (n) {
                    case p:
                        Q(F, Ae("You have been kicked!"));
                        break;
                    case g:
                        Q(F, Ae("You have been banned!"));
                        break;
                    default:
                        Q(F, Ae("Connection lost!"))
                }
                ca()
            }),
            qn.on("connect_error", e => {
                ca(),
                    Q(B, e.message)
            })
    }

    function Jn(e) {
        Wn || (e = "" != e ? "id=" + e : "lang=" + Gn.value,
            re(),
            Xn(!0),
            _n(location.origin + ":3000/play", e, function (e) {
                Xn(!1),
                    e.success && Kn((e = e.data.split(","))[0], e[1])
            }, !0))
    }

    function Qn(e) {
        let n = [],
            a = e.split(",");
        var t = parseInt(a.shift());
        if (0 < t) {
            var o = a.length / t;
            for (let e = 0; e < t; e++) {
                var r = e * o;
                let t = [];
                for (let e = 0; e < 10; e++)
                    t.push(a[r + e + 4]);
                n.push({
                    id: a[r],
                    type: a[1 + r],
                    users: a[2 + r],
                    round: a[3 + r],
                    settings: t
                })
            }
        }
        return n
    }

    function ea() {
        var e = K[j].querySelector(".filter select.lang").value;
        _n(location.origin + ":3000/rooms", "lang=" + e, function (e) {
            e.success && ae(Qn(e.data))
        })
    }

    function ta(e) {
        var t;
        Nn.playSound(vn),
            Mt(Ne, !0),
            Ct(8),
            $t(2),
            Lt(0),
            Ot(!0),
            T(se),
            c.querySelector("#home").style.display = "none",
            c.querySelector("#game").style.display = "flex",
            Mn = e.me,
            In = e.type,
            En = e.id,
            c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id,
            t = e.settings,
            An = t,
            na(),
            T(Hn),
            xn = [];
        for (var n = 0; n < e.users.length; n++)
            Wa(e.users[n], !1);
        Ha(),
            Ba(),
            oa(e.round),
            pa(e.owner),
            ia(e.state, !0)
    }

    function na() {
        Pn.querySelector(".text .name").textContent = An[M.NAME],
            Pn.querySelector(".text .type").textContent = Ae(0 == In ? "Public" : "Custom"),
            c.querySelector("#game-room .lobby-name").textContent = An[M.NAME],
            oa(Rn);
        for (var e, t = 0; t < Ga.length; t++) {
            var n = Ga[t];
            n.index && (n = An[(e = n).index],
                "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }

    function aa(e, t, n) {
        An[e] = t,
            n && qn && qn.emit("data", {
                id: ba,
                data: {
                    id: e,
                    val: t
                }
            }),
            na()
    }

    function oa(e) {
        Rn = e,
            Bn.textContent = Ae("Round $ of $", [Rn + 1, An[M.ROUNDS]])
    }

    function ra() {
        for (let e = 0; e < xn.length; e++)
            xn[e].score = 0;
        for (let e = 0; e < xn.length; e++)
            Fa(xn[e], !1),
                ja(xn[e], !1),
                Ua(xn[e])
    }

    function ia(a, e) {
        var t, n;
        if (t = Dn = a,
            null != un && (u.cancelAnimationFrame(un),
                un = void 0),
            t.id == h || t.id == f ? hn({
                top: -100,
                opacity: 0
            }, 700, function () {
                nn.classList.remove("show")
            }) : nn.classList.contains("show") ? hn({
                top: -100,
                opacity: 1
            }, 700, function () {
                pn(t),
                    hn({
                        top: 0,
                        opacity: 1
                    }, 700)
            }) : (nn.classList.add("show"),
                pn(t),
                hn({
                    top: 0,
                    opacity: 1
                }, 700)),
            n = a.time,
            Ja(),
            Ka = n,
            Xa.textContent = Ka,
            _a = setInterval(function () {
                Ka = Math.max(0, Ka - 1),
                    Xa.textContent = Ka;
                var e = -1;
                Dn.id == h && (e = Va),
                    Dn.id == C && (e = Za),
                    Xa.style.animationName = Ka < e ? Ka % 2 == 0 ? "rot_left" : "rot_right" : "none",
                    Ka < e && Nn.playSound(bn),
                    Ka <= 0 && Ja()
            }, 1e3),
            Pe.classList.add("hidden"),
            lt(),
            sa(!1),
            a.id == f ? (ra(),
                On.style.display = "flex",
                Yn.style.display = "none",
                zn.classList.add("room"),
                Pn.classList.add("room")) : (On.style.display = "none",
                    Yn.style.display = "",
                    zn.classList.remove("room"),
                    Pn.classList.remove("room")),
            a.id == w && (oa(a.data),
                0 == a.data && ra()),
            a.id == q) {
            Mn != Ln && fa(a.data.word);
            for (var o = 0; o < a.data.scores.length; o += 3) {
                var r = a.data.scores[o + 0],
                    i = a.data.scores[o + 1],
                    r = (a.data.scores[o + 2],
                        Ta(r));
                r && (r.score = i)
            }
            Ba();
            for (var l = !0, o = 0; o < xn.length; o++)
                if (xn[o].guessed) {
                    l = !1;
                    break
                }
            l ? Nn.playSound(yn) : Nn.playSound(mn),
                be(Ae("The word was '$'", a.data.word), "", ke(ge), !0)
            // TYPOMOD
            // desc: log finished drawing
            document.dispatchEvent(new CustomEvent("drawingFinished", { detail: a.data.word }));
            // TYPOEND
        } else
            a.id != h && (Fn[0].textContent = Ae("WAITING"),
                Fn[0].classList.add("waiting"),
                Fn[1].style.display = "none",
                Fn[2].style.display = "none");
        if (a.id == h) {
            if (Ln = a.data.id,
                Nn.playSound(gn),
                Ot(!0),
                a.data.drawCommands && (_e = a.data.drawCommands),
                be(Ae("$ is drawing now!", Ta(Ln).name), "", ke(pe), !0),
                !e)
                for (o = 0; o < xn.length; o++)
                    Fa(xn[o], !1);
            Fn[0].classList.remove("waiting"),
                Ln == Mn ? (e = a.data.word,
                    Fn[0].textContent = Ae("DRAW THIS"),
                    Fn[1].style.display = "",
                    Fn[2].style.display = "none",
                    Fn[1].textContent = e,
                    Pe.classList.remove("hidden"),
                    lt()) : (sa(!0),
                        ua(a.data.word, !1),
                        ha(a.data.hints))
        } else {
            Ln = -1;
            for (o = 0; o < xn.length; o++)
                Fa(xn[o], !1)
        }
        if (a.id == x && 0 < a.data.length) {
            let t = [],
                n = 0;
            for (let e = 0; e < a.data.length; e++) {
                var s = a.data[e][0],
                    c = a.data[e][1],
                    s = Ta(s);
                s && 0 == c && (n = s.score,
                    t.push(s.name))
            }
            1 == t.length ? be(Ae("$ won with a score of $!", [t[0], n]), "", ke(ye), !0) : 1 < t.length && be(Ae("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", ke(ye), !0)
        }
        for (o = 0; o < xn.length; o++)
            ja(xn[o], xn[o].id == Ln);
        Ha()
    }

    function la(e) {
        qn && qn.connected && Dn.id == h && (qn.emit("data", {
            id: va,
            data: e
        }),
            sa(!1))
    }

    function sa(e) {
        c.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function ca() {
        qn && qn.close(),
            qn = void 0,
            Ot(),
            Ja(),
            xn = [],
            An = [],
            Dn = {
                id: Ln = $n = -1,
                time: Mn = 0,
                data: 0
            },
            c.querySelector("#home").style.display = "",
            c.querySelector("#game").style.display = "none"
    }

    function da(e) {
        qn && qn.connected && Dn.id == C && qn.emit("data", {
            id: $a,
            data: e
        })
    }

    function ua(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++)
            n += t[e];
        var a = !e && 1 == An[M.WORDMODE];
        a && (n = 3),
            Fn[0].textContent = Ae(a ? "WORD HIDDEN" : "GUESS THIS"),
            Fn[1].style.display = "none",
            Fn[2].style.display = "",
            T(Fn[2]),
            Fn[2].hints = [];
        for (var o = 0; o < n; o++)
            Fn[2].hints[o] = E("hint", a ? "?" : "_"),
                Fn[2].appendChild(Fn[2].hints[o]);
        a || Fn[2].appendChild(E("word-length", t.join(" ")))
    }

    function ha(e) {
        for (var t = Fn[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
                o = e[n][1];
            t[a].textContent = o,
                t[a].classList.add("uncover")
        }
    }

    function fa(e) {
        (!Fn[2].hints || Fn[2].hints.length < e.length) && ua([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++)
            t.push([n, e.charAt(n)]);
        ha(t)
    }

    function pa(e) {
        $n = e;
        for (var t = 0; t < xn.length; t++)
            z(xn[t].element, xn[t].id == $n),
                Ya(xn[t], 0, xn[t].id == $n);
        ! function (t) {
            for (var n = 0; n < Ga.length; n++) {
                let e = Ga[n];
                e.element.disabled = t
            }
        }(Mn != $n);
        e = Ta($n);
        e && be(Ae("$ is now the room owner!", e.name), "", ke(ye), !0)
    }
    R(K[j].querySelector(".filter select.lang"), "change", ea),
        R(K[j].querySelector("button.refresh"), "click", ea);
    const ga = 1,
        ma = 2,
        ya = 5,
        va = 8,
        Sa = 10,
        ka = 11,
        ba = 12,
        wa = 13,
        Ca = 14,
        qa = 15,
        xa = 16,
        Ma = 17,
        $a = 18,
        La = 19,
        Aa = 20,
        Da = 21;
    const Ia = 30,
        Ra = 31,
        Ea = 32;

    function Na(e) {
        var t = e.id,
            n = e.data;
        switch (t) {
            case Sa:
                // TYPOMOD
                // desc: send lobbydata
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                // TYPOEND
                ta(n);
                break;
            case ka:
                ia(n);
                break;
            case ba:
                aa(n.id, n.val, !1);
                break;
            case wa:
                ha(n);
                break;
            case Ca:
                Ka = n;
                break;
            case ga:
                be(Ae("$ joined the room!", Wa(n, !0).name), "", ke(ge), !0),
                    Nn.playSound(vn);
                break;
            case ma:
                var a = function (e) {
                    for (var t = 0; t < xn.length; t++) {
                        var n = xn[t];
                        if (n.id == e)
                            return xn.splice(t, 1),
                                n.element.remove(),
                                Ba(),
                                Ha(),
                                n
                    }
                    return
                }(n.id);
                a && (be(function (e, t) {
                    switch (e) {
                        default:
                            return Ae("$ left the room!", t);
                        case p:
                            return Ae("$ has been kicked!", t);
                        case g:
                            return Ae("$ has been banned!", t)
                    }
                }(n.reason, a.name), "", ke(me), !0),
                    Nn.playSound(Sn));
                break;
            case ya:
                var a = Ta(n[0]),
                    o = Ta(n[1]),
                    r = n[2],
                    i = n[3];
                a && o && be(Ae("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", ke(fe), !0);
                break;
            case qa:
                var l = Ta(n.id);
                if (l) {
                    let e = be(Ae("$ guessed the word!", l.name), "", ke(ge), !0);
                    e.classList.add("guessed"),
                        Fa(l, !0),
                        Nn.playSound(kn),
                        n.id == Mn && fa(n.word)
                }
                break;
            case va:
                o = Ta(n.id);
                o && (r = o,
                    i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif",
                    (l = E("icon")).style.backgroundImage = "url(/img/" + i + ")",
                    za(r, l),
                    n.vote ? be(Ae("$ liked the drawing!", o.name), "", ke(ge), !0) : be(Ae("$ disliked the drawing!", o.name), "", ke(me), !0));
                break;
            case Ma:
                pa(n);
                break;
            case xa:
                be(Ae("$ is close!", n), "", ke(fe), !0);
                break;
            case Ia:
                Oa(Ta(n.id), n.msg);
                break;
            case Ea:
                be(Ae("Spam detected! You're sending messages too quickly."), "", ke(me), !0);
                break;
            case Ra:
                switch (n.id) {
                    case 0:
                        be(Ae("You need at least 2 players to start the game!"), "", ke(me), !0);
                        break;
                    case 100:
                        be(Ae("Server restarting in about $ seconds!", n.data), "", ke(me), !0)
                }
                break;
            case La:
                for (var s = 0; s < n.length; s++)
                    Yt(n[s]);
                break;
            case Aa:
                Ot(!0);
                break;
            case Da:
                Et(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function Ta(e) {
        for (var t = 0; t < xn.length; t++) {
            var n = xn[t];
            if (n.id == e)
                return n
        }
    }

    function Wa(e, t) {
        var n = {
            id: e.id,
            flags: e.flags,
            name: e.name,
            avatar: e.avatar,
            score: e.score,
            guessed: e.guessed,
            rank: 0,
            muted: !1,
            votekick: !1,
            reported: !1,
            page: 0,
            element: E("player"),
            bubble: void 0
        };
        xn.push(n),
            m.filterChat && n.id != Mn && ue(n.name.slice()) != n.name && (n.name = "user");
        var a = n.id == Mn ? Ae("$ (You)", n.name) : n.name,
            o = E("info"),
            e = E("name", a);
        n.id == Mn && e.classList.add("me"),
            o.appendChild(e),
            o.appendChild(E("rank", "#" + n.rank)),
            o.appendChild(E("score", Ae("$ points", n.score))),
            n.element.appendChild(o);
        var r = W(n.avatar);
        // TYPOMOD
        // desc: set ID to player to identify
        n.element.setAttribute("playerid", n.id);
        // TYPOEND
        n.element.drawing = E("drawing"),
            r.appendChild(n.element.drawing),
            n.element.appendChild(r),
            Hn.appendChild(n.element),
            R(n.element, "click", function () {
                Tn = n,
                    Q(U, n)
            });
        4 == (4 & n.flags) && (n.interval = setInterval(function () {
            n.avatar[0] = (n.avatar[0] + 1) % d[0],
                n.avatar[1] = (n.avatar[1] + 1) % d[1],
                n.avatar[2] = (n.avatar[2] + 1) % d[2],
                O(r, n.avatar)
        }, 250));
        a = E("icons"),
            e = E("icon owner"),
            o = E("icon muted");
        return a.appendChild(e),
            a.appendChild(o),
            n.element.appendChild(a),
            n.element.icons = [e, o],
            Fa(n, n.guessed),
            t && Ha(),
            n
    }

    function Oa(e, t) {
        var n;
        e.muted || (n = e.id == Ln || e.guessed,
            Mn != Ln && !Ta(Mn).guessed && n || (m.filterChat && (t = ue(t)),
                za(e, E("text", t)),
                be(e.name, t, ke(n ? ve : he))))
    }

    function za(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout),
            e.bubble.remove(),
            e.bubble = void 0);
        var n = E("bubble"),
            a = E("content");
        a.appendChild(t),
            n.appendChild(E("arrow")),
            n.appendChild(a),
            e.element.appendChild(n),
            e.bubble = n,
            e.bubble.timeout = setTimeout(function () {
                e.bubble.remove(),
                    e.bubble = void 0
            }, 1500)
    }

    function Ya(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Pa = void 0;

    function Ha() {
        var e = Dn.id == f,
            t = e ? 112 : 48,
            n = Math.max(t, Hn.clientHeight);
        let a = Math.floor(n / t);
        e && (a *= 4);
        t = Math.ceil(xn.length / a);
        for (let e = 0; e < xn.length; e++)
            xn[e].page = Math.floor(e / a);
        e = c.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = xn.length,
            e[1].textContent = An[M.SLOTS],
            null == Pa ? Pa = Y(Un, t, [zn], function (e, n, t) {
                let a = [];
                for (let t = 0; t < xn.length; t++) {
                    let e = xn[t];
                    var o = e.page == n;
                    e.element.style.display = o ? "" : "none",
                        o && a.push(e.element)
                }
                if (0 < a.length) {
                    for (let t = 0; t < a.length; t++) {
                        let e = a[t];
                        e.classList.remove("first"),
                            e.classList.remove("last"),
                            t % 2 == 0 ? e.classList.remove("odd") : e.classList.add("odd")
                    }
                    a[0].classList.add("first"),
                        a[a.length - 1].classList.add("last")
                }
            }) : P(Pa, t),
            Pa.element.style.display = 1 < t ? "" : "none"
    }

    function Ua(t) {
        let n = 1;
        for (let e = 0; e < xn.length; e++) {
            var a = xn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n,
            t.element.querySelector(".score").textContent = Ae("$ points", t.score);
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n,
            e.classList.remove("first"),
            e.classList.remove("second"),
            e.classList.remove("third"),
            1 == n && e.classList.add("first"),
            2 == n && e.classList.add("second"),
            3 == n && e.classList.add("third")
    }

    function Ba() {
        for (var e = 0; e < xn.length; e++)
            Ua(xn[e])
    }

    function Fa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }

    function ja(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ga = [];
    ! function () {
        for (var e = On.querySelectorAll('*[id^="item-"]'), n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            Ga.push(t),
                R(t.element, "change", function () {
                    var e = "checkbox" == this.type ? this.checked : this.value;
                    null != t.index && aa(t.index, e, !0)
                })
        }
    }();
    const Va = 10,
        Za = 4;
    var Xa = c.querySelector("#game-clock"),
        _a = null,
        Ka = 0;

    function Ja() {
        _a && (clearInterval(_a),
            _a = null)
    }
    var Qa, eo, to, no, ao, oo, Cn = c.querySelector("#tutorial"),
        ro = Cn.querySelectorAll(".page"),
        io = Y(Cn, ro.length, [Cn.querySelector(".pages")], function (e, t, n) {
            n && clearInterval(lo);
            for (let e = 0; e < ro.length; e++)
                ro[e].classList.remove("active");
            ro[t].classList.add("active")
        }),
        lo = setInterval(function () {
            io.selected < 4 ? H(io, io.selected + 1, !1) : H(io, 0, !1)
        }, 3500),
        so = c.querySelector("#setting-bar"),
        co = c.querySelector("#audio"),
        uo = c.querySelector("#lightbulb");

    function ho() {
        so.classList.remove("open")
    }

    function fo(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }

    function po() {
        co.dataset.tooltip = m.audioMute ? "Unmute audio" : "Mute audio",
            uo.dataset.tooltip = m.dark ? "Turn the lights on" : "Turn the lights off",
            we && (we.querySelector(".tooltip-content").textContent = Ae(Ce.dataset.tooltip))
    }

    function go() {
        be(Ae("Copied room link to clipboard!"), "", ke(fe), !0),
            function (e) {
                if (navigator.clipboard)
                    navigator.clipboard.writeText(e).then(function () {
                        console.log("Async: Copying to clipboard was successful!")
                    }, function (e) {
                        console.error("Async: Could not copy text: ", e)
                    });
                else {
                    var t = c.createElement("textarea");
                    t.value = e,
                        t.style.top = "0",
                        t.style.left = "0",
                        t.style.position = "fixed",
                        c.body.appendChild(t),
                        t.select(),
                        t.focus();
                    try {
                        var n = c.execCommand("copy");
                        console.log("Copying link was " + (n ? "successful" : "unsuccessful"))
                    } catch (e) {
                        console.log("Unable to copy link " + e)
                    }
                    c.body.removeChild(t)
                }
            }("https://skribbl.io/?" + En)
    }

    function mo(e) {
        oo.parts[e].classList.remove("bounce"),
            oo.parts[e].offsetWidth,
            oo.parts[e].classList.add("bounce")
    }
    R(so.querySelector(".icon"), "click", function () {
        fo(co, m.audioMute),
            fo(uo, m.dark),
            po(),
            so.classList.contains("open") ? ho() : so.classList.add("open")
    }),
        R("#audio", "click", function (e) {
            m.audioMute = !m.audioMute,
                fo(co, m.audioMute),
                po(),
                D()
        }),
        R("#lightbulb", "click", function (e) {
            I(!m.dark),
                fo(uo, m.dark),
                po(),
                D()
        }),
        R("#hotkeys", "click", function (e) {
            ho(),
                Q(V)
        }),
        u.onbeforeunload = function (e) {
            return qn ? Ae("Are you sure you want to leave?") : void 0
        },
        u.onunload = function () {
            qn && ca()
        },
        R([c, Ze], "mousedown touchstart", function (e) {
            so.contains(e.target) || ho(),
                e.target != Vt && (Zt.contains(e.target) || At())
        }),
        R(u, "resize", Ha),
        R([jn, Gn], "change", D),
        R(Vn, "click", function () {
            var e, t, n;
            Jn((e = u.location.href,
                n = "",
                e = e.split("?"),
                n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
        }),
        R(e, "click", function () {
            Wn || (re(),
                Xn(!0),
                K[j].querySelector(".filter select.lang").value = Gn.value,
                _n(location.origin + ":3000/rooms", "lang=" + Gn.value, function (e) {
                    Xn(!1),
                        e.success && Q(j, Qn(e.data))
                }, !0))
        }),
        R(Zn, "click", function () {
            Wn || (re(),
                Xn(!0),
                _n(location.origin + ":3000/create", "lang=" + Gn.value, function (e) {
                    Xn(!1),
                        e.success && Kn((e = e.data.split(","))[0], e[1])
                }, !0))
        }),
        R(c.querySelector("#game-rate .like"), "click", function () {
            la(1)
        }),
        R(c.querySelector("#game-rate .dislike"), "click", function () {
            la(0)
        }),
        R(Pn, "click", go),
        R(c.querySelector("#start-game"), "click", function () {
            if (qn) {
                let t = c.querySelector("#item-settings-customwords").value.split(","),
                    e = "";
                if (5 <= t.length) {
                    for (let e = 0; e < t.length; e++)
                        t[e] = t[e].trim();
                    e = t.join(",")
                }
                qn.emit("data", {
                    id: 22,
                    data: e
                })
            }
        }),
        R(c.querySelector("#copy-invite"), "click", go),
        R(K[U].querySelector("button.kick"), "click", function () {
            re(),
                null != Tn && Tn.id != Mn && Mn == $n && qn && qn.emit("data", {
                    id: 3,
                    data: Tn.id
                })
        }),
        R(K[U].querySelector("button.ban"), "click", function () {
            re(),
                null != Tn && Tn.id != Mn && Mn == $n && qn && qn.emit("data", {
                    id: 4,
                    data: Tn.id
                })
        }),
        R(K[U].querySelector("button.votekick"), "click", function () {
            re(),
                null != Tn && Tn.id != Mn && qn && (Tn.id == $n ? be(Ae("You can not votekick the lobby owner!"), "", ke(me), !0) : qn.emit("data", {
                    id: ya,
                    data: Tn.id
                }))
        }),
        R(K[U].querySelector("button.mute"), "click", function () {
            null != Tn && Tn.id != Mn && (Tn.muted = !Tn.muted,
                Ya(Tn, 1, Tn.muted),
                Tn.muted ? be(Ae("You muted '$'!", Tn.name), "", ke(me), !0) : be(Ae("You unmuted '$'!", Tn.name), "", ke(me), !0),
                qn && qn.emit("data", {
                    id: 7,
                    data: Tn.id
                }),
                J(Tn.muted))
        }),
        R(K[U].querySelector("button.report"), "click", function () {
            K[U].querySelector(".buttons").style.display = "none",
                K[U].querySelector(".report-menu").style.display = "";
            let t = K[U].querySelectorAll(".report-menu input");
            for (let e = 0; e < t.length; e++)
                t[e].checked = !1
        }),
        R(K[U].querySelector("button#report-send"), "click", function () {
            let e = 0;
            K[U].querySelector("#report-reason-toxic").checked && (e |= 1),
                K[U].querySelector("#report-reason-spam").checked && (e |= 2),
                K[U].querySelector("#report-reason-bot").checked && (e |= 4),
                0 < e && (null != Tn && Tn.id != Mn && (Tn.reported = !0,
                    qn && qn.emit("data", {
                        id: 6,
                        data: {
                            id: Tn.id,
                            reasons: e
                        }
                    }),
                    be(Ae("Your report for '$' has been sent!", Tn.name), "", ke(fe), !0)),
                    re())
        }),
        R(K[V].querySelector("#select-display-language"), "change", function (e) {
            m.displayLang = e.target.value,
                D(),
                Ie()
        }),
        R(K[V].querySelector("#select-filter-chat"), "change", function (e) {
            m.filterChat = e.target.value,
                D()
        }),
        R(K[V].querySelector("#select-pressure-sensitivity"), "change", function (e) {
            m.pressureSensitivity = e.target.value,
                D()
        }),
        R(K[V].querySelector("button.reset"), "click", function (e) {
            for (let e = 0; e < Ge.length; e++)
                je(Ge[e], t[Ge[e].id]);
            for (let e = 0; e < Ve.length; e++)
                je(Ve[e], r[Ve[e].id]);
            D()
        }),
        R(ie, "submit", function (e) {
            return e.preventDefault(),
                le.value && (qn && qn.connected ? qn.emit("data", {
                    id: Ia,
                    data: le.value
                }) : Oa(Ta(Mn), le.value)),
                ie.reset(),
                !1
        }),
        function () {
            if (!u.localStorageAvailable) {
                var e = !1;
                if (void 0 !== n)
                    try {
                        n.setItem("feature_test", "yes"),
                            "yes" === n.getItem("feature_test") && (n.removeItem("feature_test"),
                                e = !0)
                    } catch (e) { }
                u.localStorageAvailable = e
            }
            u.localStorageAvailable ? (jn.value = L("name", ""),
                Gn.value = function (e) {
                    for (var t = c.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                        if (e.startsWith(t[n].value))
                            return t[n].value;
                    return "en"
                }(L("lang", navigator.language)),
                m.displayLang = L("displaylang", "en"),
                m.audioMute = 1 == parseInt(L("audio", 0)) ? 1 : 0,
                m.filterChat = 1 == parseInt(L("filter", 1)) ? 1 : 0,
                m.pressureSensitivity = 1 == parseInt(L("pressure", 1)) ? 1 : 0,
                m.hotkeysTools = A("tools", m.hotkeysTools),
                m.hotkeysActions = A("actions", m.hotkeysActions),
                function () {
                    for (let e = 0; e < Ge.length; e++)
                        je(Ge[e], m.hotkeysTools[Ge[e].id]);
                    for (let e = 0; e < Ve.length; e++)
                        je(Ve[e], m.hotkeysActions[Ve[e].id])
                }(),
                m.avatar = A("ava", m.avatar),
                I(1 == parseInt(L("dark", 0)) ? 1 : 0),
                console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
        }(),
        function () {
            var t = c.querySelectorAll("[data-translate]");
            for (let e = 0; e < t.length; e++) {
                var n = t[e];
                De(n, n.dataset.translate)
            }
        }(),
        Ie(),
        R(Qa = c.querySelectorAll("[data-tooltip]"), "mouseenter", function (e) {
            qe(e.target)
        }),
        R(Qa, "mouseleave", function (e) {
            xe()
        }),
        eo = (ao = c.querySelector("#home .avatar-customizer")).querySelector(".container"),
        to = ao.querySelectorAll(".arrows.left .arrow"),
        no = ao.querySelectorAll(".arrows.right .arrow"),
        ao = ao.querySelectorAll(".randomize"),
        (oo = W(m.avatar, 96)).classList.add("fit"),
        eo.appendChild(oo),
        R(to, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --m.avatar[e],
                m.avatar[e] < 0 && (m.avatar[e] = d[e] - 1),
                mo(e),
                O(oo, m.avatar, 96),
                D()
        }),
        R(no, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            m.avatar[e] += 1,
                m.avatar[e] >= d[e] && (m.avatar[e] = 0),
                mo(e),
                O(oo, m.avatar, 96),
                D()
        }),
        R(ao, "click", function () {
            m.avatar[0] = Math.floor(Math.random() * d[0]),
                m.avatar[1] = Math.floor(Math.random() * d[1]),
                m.avatar[2] = Math.floor(Math.random() * d[2]),
                mo(1),
                mo(2),
                O(oo, m.avatar, 96),
                D()
        }),
        function () {
            var t = Math.round(8 * Math.random());
            let n = c.querySelector("#home .logo-big .avatar-container");
            for (var a = 0; a < 8; a++) {
                let e = [0, 0, 0, -1];
                e[0] = a,
                    e[1] = Math.round(100 * Math.random()) % l,
                    e[2] = Math.round(100 * Math.random()) % s,
                    1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random()));
                var o = W(e, 48, t == a);
                n.append(o)
            }
        }()
}(window, document, localStorage, io);