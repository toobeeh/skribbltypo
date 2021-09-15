! function (u, s, n, a) {
    const i = 26,
        l = 57,
        c = 51,
        t = [i, l, c],
        y = 0,
        v = 1,
        S = 2,
        k = 0,
        b = 1,
        w = 2,
        C = 3,
        d = 4,
        q = 5,
        x = 6,
        h = 7;
    const f = 1,
        p = 2,
        m = {
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
        };
    // TYPOMOD 
    // desc: create re-useable functions
    const typo = {
        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) %
            return { id: id, name: name.length != 0 ? name : (Wn.value.split("#")[0] != "" ? Wn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? g.avatar : avatar, score: score, guessed: guessed };
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
            document.addEventListener("joinLobby", () => {
                let timeoutdiff = Date.now() - typo.lastConnect;
                jn(true);
                setTimeout(() => {
                    typo.lastConnect = Date.now();
                    Yn.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play")
                    Hn(false); // IDENTIFY x(false): querySelector("#load").style.display
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 3000 ? 3000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else ea() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = ""
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = it.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY colors array
                let code = match >= 0 ? match : e.detail.code;
                if (e.detail.secondary) wt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill
                else bt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill
            });
            document.addEventListener("performDrawCommand", (e) => {
                Ge.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = []
                It(Tt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil
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
    var g = {
        avatar: [Math.round(100 * Math.random()) % i, Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % c, -1],
        audioMute: 0,
        dark: 0,
        filterChat: 1,
        displayLang: "en",
        hotkeysTools: ["B", "V", "F"],
        hotkeysActions: ["U", "C"]
    };

    function o(e, t) {
        e = n.getItem(e);
        return null == e ? t : e
    }

    function r(e, t) {
        e = n.getItem(e);
        return null == e ? t : JSON.parse(e)
    }

    function M() {
        u.localStorageAvailable && (n.setItem("name", Wn.value), n.setItem("lang", On.value), n.setItem("displaylang", g.displayLang), n.setItem("audio", 1 == g.audioMute ? 1 : 0), n.setItem("dark", 1 == g.dark ? 1 : 0), n.setItem("filter", 1 == g.filterChat ? 1 : 0), n.setItem("tools", JSON.stringify(g.hotkeysTools)), n.setItem("actions", JSON.stringify(g.hotkeysActions)), n.setItem("ava", JSON.stringify(g.avatar)), console.log("Settings saved."))
    }

    function L(e) {
        g.dark = e ? 1 : 0, s.documentElement.dataset.theme = g.dark ? "dark" : ""
    }

    function $(e, t, n) {
        var a, o = e;
        "string" == typeof e ? o = s.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]);
        for (var r = t.split(" "), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++) o[i].addEventListener(r[l], n)
    }

    function A(e, t) {
        for (var n = s.createElement("div"), a = e.split(" "), o = 0; o < a.length; o++) n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t), n
    }

    function I(e) {
        return parseFloat(getComputedStyle(e, null).width.replace("px", ""))
    }

    function D(e) {
        for (; e.firstChild;) e.removeChild(e.firstChild)
    }

    function R(e, t, n) {
        var a = A("avatar"),
            o = A("color"),
            r = A("eyes"),
            i = A("mouth"),
            l = A("special"),
            s = A("owner");
        return s.style.display = n ? "block" : "none", a.appendChild(o), a.appendChild(r), a.appendChild(i), a.appendChild(l), a.appendChild(s), a.parts = [o, r, i], E(a, e, t || 48), a
    }

    function E(e, t, n) {
        function a(e, t, n, a) {
            var o = -t % n * 100,
                n = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + n + "%"
        }
        var o = t[0] % i,
            r = t[1] % l,
            n = t[2] % c,
            t = t[3];
        a(e.querySelector(".color"), o, 10), a(e.querySelector(".eyes"), r, 10), a(e.querySelector(".mouth"), n, 10);
        e = e.querySelector(".special");
        0 <= t ? (e.style.display = "", a(e, t, 10)) : e.style.display = "none"
    }

    function T(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }

    function N(e, t, n, a) {
        let o = {
            element: A("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element), n.push(o.element), $(n, "DOMMouseScroll wheel", function (e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), O(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), W(o, t), o
    }

    function W(n, e) {
        D(n.element), n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = A("dot");
            e.appendChild(A("inner")), $(e, "click", function () {
                O(n, t, !0)
            }), n.element.appendChild(e), n.dots.push(e)
        }
        n.selected < 0 && (n.selected = 0), n.selected >= e && (n.selected = e - 1), O(n, n.selected, !1)
    }

    function O(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++) t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"), t.change(t, e, n)
        }
    }
    const Y = 0,
        U = 1,
        H = 2,
        z = 3,
        F = 4,
        P = 5;
    var G = s.querySelector("#modal"),
        j = G.querySelector(".title .text"),
        B = G.querySelector(".content"),
        X = [];

    function _(e) {
        X[Y].querySelector(".buttons button.mute").textContent = xe(e ? "Unmute" : "Mute")
    }

    function V(e, a) {
        G.style.display = "block";
        for (var t = 0; t < X.length; t++) X[t].style.display = "none";
        switch (X[e].style.display = "flex", e) {
            case U:
                j.textContent = xe("Something went wrong!"), X[U].querySelector(".message").textContent = a;
                break;
            case H:
                j.textContent = xe("Disconnected!"), X[H].querySelector(".message").textContent = a;
                break;
            case Y: {
                j.textContent = "";
                let e = X[Y].querySelector(".buttons");
                e.style.display = a.id == kn ? "none" : "flex", e.querySelector(".button-pair").style.display = kn == bn ? "flex" : "none", _(a.muted);
                let t = B.querySelector(".player");
                D(t);
                let n = R(a.avatar, 96);
                T(n, bn == a.id), n.style.width = "96px", n.style.height = "96px", t.appendChild(n), t.appendChild(A("name", a.id == kn ? xe("$ (You)", a.name) : a.name))
            }
                break;
            case z:
                j.textContent = xe("Rooms"), Q(a);
                break;
            case F:
                j.textContent = a.name;
                break;
            case P: {
                j.textContent = xe("Settings");
                let t = X[P].querySelector("#hotkey-list");

                function n(n, a) {
                    let e = A("item");
                    e.appendChild(A("key", n.name));
                    let o = s.createElement("input");
                    o.value = a[n.id], e.appendChild(o), $(o, "keydown", function (e) {
                        var t;
                        return o.value = e.key, a[n.id] = e.key, t = e.key, n.element.querySelector(".key").textContent = t, M(), e.preventDefault(), !1
                    }), t.appendChild(e)
                }
                D(t), X[P].querySelector("#select-display-language").value = g.displayLang, X[P].querySelector("#select-filter-chat").value = g.filterChat;
                for (let e = 0; e < He.length; e++) n(He[e], g.hotkeysTools);
                for (let e = 0; e < ze.length; e++) n(ze[e], g.hotkeysActions)
            }
        }
    }
    X[Y] = G.querySelector(".container-player"), X[U] = G.querySelector(".container-info"), X[H] = G.querySelector(".container-info"), X[z] = G.querySelector(".container-rooms"), X[F] = G.querySelector(".container-room"), X[P] = G.querySelector(".container-settings");
    var K = [],
        Z = X[z].querySelector(".rooms"),
        e = X[z].querySelector(".footer"),
        J = (X[z].querySelector(".dots"), N(e, 0, [e, Z], function (e, n, t) {
            for (let t = 0; t < K.length; t++) {
                let e = K[t];
                e.element.style.display = e.page == n ? "" : "none"
            }
        }));

    function Q(t) {
        ! function () {
            for (let e = 0; e < K.length; e++) K[e].element.remove();
            K = []
        }();
        for (let e = 0; e < t.length; e++) ! function (e) {
            let t = A("room"),
                n = A("type", 0 == e.type ? "P" : "C");
            n.dataset.type = e.type, t.appendChild(n), t.appendChild(A("name", e.settings[m.NAME])), t.appendChild(A("slots", e.users + "/" + e.settings[m.SLOTS])), t.appendChild(A("round", 0 < e.round ? e.round : xe("Not started"))), t.appendChild(A("settings", e.settings[m.DRAWTIME] + "s")), Z.appendChild(t), K.push({
                element: t,
                page: 0,
                data: e
            }), $(t, "click", function () {
                Pn(e.id)
            })
        }(t[e]);
        ee()
    }

    function ee() {
        var e, n = X[z].querySelector(".filter input").value,
            a = X[z].querySelector(".filter select.type").value;
        let o = 0,
            r = 0;
        for (let t = 0; t < K.length; t++) {
            let e = K[t];
            var i = -1 != a && e.data.type != a,
                l = "" != n && !e.data.settings[m.NAME].includes(n);
            i || l ? e.page = -1 : (e.page = r, o++, 10 <= o && (r++, o = 0))
        }
        r = Math.max(1, r), W(J, r), e = 1 < r, J.element.style.display = e ? "" : "none", X[z].querySelector(".rooms .empty").style.display = 0 == o ? "flex" : "none"
    }

    function te() {
        G.style.display = "none"
    }
    $(u, "click", function (e) {
        e.target == G && te()
    }), $([G.querySelector(".close"), X[U].querySelector("button.ok")], "click", te), $(X[z].querySelector(".filter select.type"), "change", ee), $(X[z].querySelector(".filter input"), "input", ee);
    var ne = s.querySelector("#game-chat form"),
        ae = s.querySelector("#game-chat form input"),
        oe = s.querySelector("#game-chat .content");
    const re = ["neger", "negro", "nigger", "nigga", "cunt", "fuck", "fucker", "fucking", "fucked", "fucktard", "kill", "rape", "cock", "dick", "asshole", "slut", "whore", "semen", "fag", "faggot", "retard", "retarded", "arsch", "arschloch", "hurensohn", "fotze", "muschi", "schlampe", "pisser", "missgeburt", "nutte", "nuttensohn", "hundesohn", "hure", "ficker", "ficken", "fick", "spast", "spasti", "spastiker", "hailhitler", "heilhitler", "sieghail", "siegheil", "nazi"],
        ie = [
            ["i", "î", "1", "!", "|"],
            ["e", "3", "€", "³"],
            ["a", "4", "@"],
            ["o", "ö", "0"],
            ["g", "q"],
            ["s", "$"]
        ];

    function le(e) {
        for (var t, n, a = e.toLocaleLowerCase("en-US"), o = 0; o < ie.length; o++)
            for (var r = ie[o], i = 1; i < r.length; i++) t = r[i], n = r[0], a = a.split(t).join(n);
        for (var a = a.replace(/[^A-Z^a-z0-9^가-힣]/g, "*"), l = "", s = [], o = 0; o < a.length; o++) {
            var c = a.charAt(o);
            "*" != c && (l += c, s.push(o))
        }
        for (o = 0; o < re.length; o++)
            for (var d = re[o], u = -1; - 1 != (u = l.indexOf(d, u + 1));) {
                var h = s[u],
                    f = s[u + d.length - 1],
                    p = d.length,
                    p = "*".repeat(p);
                e = e.slice(0, h) + p + e.slice(f + 1)
            }
        return e
    }
    const se = 0;
    const ce = 2,
        de = 3,
        ue = 4,
        he = 5,
        fe = 6,
        pe = 7;
    var me = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];

    function ge(e) {
        return "var(--COLOR_CHAT_TEXT_" + me[e] + ")"
    }

    function ye(e, t, n, a) {
        var o = s.createElement("p"),
            r = s.createElement("b");
        r.textContent = a ? e : e + ": ", o.appendChild(r), o.style.color = n;
        n = s.createElement("span");
        n.textContent = t, o.appendChild(n);
        n = oe.scrollHeight - oe.scrollTop - oe.clientHeight <= 20;
        oe.appendChild(o), n && (oe.scrollTop = oe.scrollHeight + 100)
    }
    let ve = void 0,
        Se = void 0;

    function ke(e) {
        be();
        var t = (Se = e).dataset.tooltip,
            n = e.dataset.tooltipdir || "N";
        ve = A("tooltip"), ve.classList.add(n), ve.appendChild(A("tooltip-arrow")), ve.appendChild(A("tooltip-content", xe(t)));
        let a = !1,
            o = e;
        for (; o;) {
            if ("fixed" == u.getComputedStyle(o).position) {
                a = !0;
                break
            }
            o = o.parentElement
        }
        ve.style.position = a ? "fixed" : "absolute";
        e = e.getBoundingClientRect();
        let r = e.left,
            i = e.top;
        "N" == n && (r = (e.left + e.right) / 2), "S" == n && (r = (e.left + e.right) / 2, i = e.bottom), "E" == n && (r = e.right, i = (e.top + e.bottom) / 2), "W" == n && (i = (e.top + e.bottom) / 2), a || (r += u.scrollX, i += u.scrollY), ve.style.left = r + "px", ve.style.top = i + "px", s.body.appendChild(ve)
    }

    function be() {
        ve && (ve.remove(), ve = void 0, Se = void 0)
    }
    let we = {},
        Ce = [];

    function qe(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }

    function xe(t, n) {
        var e = qe(we[g.displayLang], t);
        e == t ? console.log("No translation found for: " + t) : t = e;
        let a = "",
            o = 0;
        Array.isArray(n) || (n = [n]);
        for (let e = 0; e < t.length; e++) {
            var r = t.charAt(e);
            "$" == r ? (a += n[o], o++) : a += r
        }
        return a
    }

    function Me() {
        var n = we[g.displayLang];
        for (let t = 0; t < Ce.length; t++) {
            let e = Ce[t];
            var a = "en" == g.displayLang ? e.key : qe(n, e.key);
            "text" == e.type && (e.element.textContent = a), "placeholder" == e.type && (e.element.placeholder = a)
        }
    }
    we.en = {}, we.de = {
        "You have been kicked!": "Du wurdest gekickt!",
        "You have been banned!": "Du wurdest gebannt!",
        "You muted '$'!": "Du hast '$' stummgeschalten!",
        "You unmuted '$'!": "Du hast die Stummschaltung für '$' aufgehoben!",
        "You are on a kick cooldown!": "",
        "You are banned from this room!": "",
        "You need at least 2 players to start the game!": "",
        "Server restarting in about $ seconds!": "",
        "Spam detected! You're sending messages too quickly.": "Spam erkannt! Du sendest Nachrichten zu schnell.",
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
        WAITING: "WARTEN",
        "DRAW THIS": "ZEICHNE",
        "WORD HIDDEN": "WORT VERSTECKT",
        "GUESS THIS": "RATE",
        "$ (You)": "$ (Du)",
        "$ points": "$ Punkte",
        "Room not found!": "Raum nicht gefunden!",
        "Room is full!": "Raum ist voll!",
        "An unknown error ('$')": "Unbekannter Fehler ('$')",
        Unmute: "Stumm. aufheben",
        Mute: "Stummschalten",
        "Something went wrong!": "Irgendetwas ist schief gelaufen!",
        "Disconnected!": "Verbindung unterbrochen!",
        Rooms: "Räume",
        Settings: "Einstellungen",
        "Not started": "Nicht gestartet",
        "No rooms found :(": "Keine Räume gefunden :(",
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
        User: "Spieler",
        Play: "Spielen",
        "Create Room": "Raum Erstellen",
        "View Rooms": "Räume Ansehen",
        "How to play": "Wie wird gespielt",
        About: "Über",
        News: "Neuigkeiten",
        "When it's your turn, choose a word you want to draw!": "Wähl ein Wort, dass du zeichnen willst wenn du dran bist!",
        "Try to draw your choosen word! No spelling!": "Versuche nun dein Wort zu zeichen. Kein aufschreiben!",
        "Let other players try to guess your drawn word!": "Lass andere Mitspieler dein gezeichnetes Wort erraten!",
        "When it's not your turn, try to guess what other players are drawing!": "Wenn du nicht dran bist mit zeichnen, versuche Zeichnungen anderer zu erraten!",
        "Score the most points and be crowned the winner at the end!": "Sammel die meisten Punkte und werde zum Gewinner!",
        "Invite your friends!": "Lad deine Freunde ein!",
        Copy: "Kopieren",
        "Hover over me to see the Invite link!": "Einladungslink hier anschauen!",
        "The word was": "Das Wort war",
        Visibility: "",
        Name: "Name",
        Players: "Spieler",
        "Draw time": "Zeit",
        Language: "Sprache",
        "Word Mode": "Wort Modus",
        "Word Count ": "Wort Anzahl",
        Hints: "Hinweise",
        "Custom words": "Eigene Wörter",
        "Minimum of 5 words. 1-32 characters per word! 10000 characters maximum. Separated by a , (comma)": "Minimum von 5 Wörtern. 1-32 Buchstaben pro Wort. 10000 Buchstaben maximal. Getrennt durch ein , (Komma)",
        "Use custom words only": "Nur eigene Wörter benutzen",
        "Start!": "Starten!",
        "Enter your name": "Gib dein Namen ein",
        "Filter lobbies by name here...": "Suche nach Räume hier...",
        "Type your guess here...": "Rate das gesuchte Wort hier...",
        "Everyone guessed the word!": "Jeder hat das Wort erraten!",
        "The drawer left the game!": "Der Zeichner hat das Spiel verlassen!",
        "Time is up!": "Die Zeit ist abgelaufen!",
        Kick: "Kicken",
        Ban: "Bannen",
        Votekick: "Votekicken",
        Report: "Melden"
    };
    const Le = 0,
        $e = 1;
    const Ae = 0,
        Ie = 1,
        De = 2;
    const Re = 4,
        Ee = 40;
    var Te, Ne = s.querySelector("#game-toolbar"),
        We = Ne.querySelectorAll(".tools-container .tools")[0],
        Oe = Ne.querySelectorAll(".tools-container .tools")[1],
        Ye = (Te = Ne.querySelector(".tool")).parentElement.removeChild(Te);

    function Ue(e, t) {
        let n = Ye.cloneNode(!0);
        var a, o, r = (t.isAction ? g.hotkeysActions : g.hotkeysTools)[e];
        n.toolIndex = e, n.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")", n.querySelector(".key").textContent = r, a = n, o = t.name, r = "N", a.dataset.tooltip = o, a.dataset.tooltipdir = r, $(a, "mouseenter", function (e) {
            ke(e.target)
        }), $(a, "mouseleave", function (e) {
            be()
        });
        let i = t;
        i.id = e, i.element = n, t.isAction ? (n.addEventListener("click", function (e) {
            St(this.toolIndex)
        }), Oe.appendChild(n), ze[e] = i) : (n.addEventListener("click", function (e) {
            kt(this.toolIndex)
        }), We.appendChild(n), He[e] = i)
    }
    var He = [];
    Ue(Ae, {
        isAction: !1,
        name: "Brush",
        graphic: "pen.gif",
        cursor: 0
    }), Ue(Ie, {
        isAction: !1,
        name: "Colorpick",
        graphic: "pick.gif",
        cursor: "url(/img/pick_cur.png) 7 36, default"
    }), Ue(De, {
        isAction: !1,
        name: "Fill",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    });
    var ze = [];
    Ue(0, {
        isAction: !0,
        name: "Undo",
        graphic: "undo.gif",
        action: function () {
            {
                var e;
                0 < Ve.length && (Ve.pop(), 0 < Ve.length ? (Lt(e = Ve[Ve.length - 1]), vn && vn.emit("data", {
                    id: ka,
                    data: e
                })) : Rt())
            }
        }
    }), Ue(1, {
        isAction: !0,
        name: "Clear",
        graphic: "clear.gif",
        action: Rt
    });
    var Fe = s.querySelector("#game-canvas canvas"),
        Pe = Fe.getContext("2d"),
        Ge = [],
        je = 0,
        Be = 0,
        Xe = [],
        _e = [0, 9999, 9999, 0, 0],
        Ve = [],
        Ke = [0, 0],
        Ze = [0, 0],
        Je = 0,
        Qe = s.createElement("canvas");
    Qe.width = Ee + 2, Qe.height = Ee + 2;
    var et = Qe.getContext("2d");

    function tt() {
        var e = He[at].cursor;
        if (qn.id == d && wn == kn) {
            if (at == Ae) {
                var t = Qe.width,
                    n = lt;
                if (n <= 0) return;
                // TYPOMOD
                // desc: cursor with custom color
                let rgbArr = ot < 10000 ? it[ot] : typo.hexToRgb((ot - 10000).toString(16).padStart(6, "0"));
                et.clearRect(0, 0, t, t), et.fillStyle = vt(rgbArr), et.beginPath(), et.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), et.fill(), et.strokeStyle = "#FFF", et.beginPath(), et.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), et.stroke(), et.strokeStyle = "#000", et.beginPath(), et.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), et.stroke();
                // TYPOEND
                // ORIGINAL et.clearRect(0, 0, t, t), et.fillStyle = xt(it[ot]), et.beginPath(), et.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), et.fill(), et.strokeStyle = "#FFF", et.beginPath(), et.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), et.stroke(), et.strokeStyle = "#000", et.beginPath(), et.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), et.stroke();
                t = t / 2, e = "url(" + Qe.toDataURL() + ")" + t + " " + t + ", default"
            }
        } else e = "default";
        Fe.style.cursor = e
    }
    for (var nt = 0, at = 0, ot = 0, rt = 0, it = [
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
    ], lt = 0, st = -1, ct = [], dt = 6, ut = 0; ut < dt; ut++) {
        var ht = ut / (dt - 1),
            ft = 11 + 32 * (1 - ht),
            pt = (Re, Ee, Re, s.createElement("div"));
        pt.classList.add("size");
        ht = s.createElement("div");
        ht.classList.add("icon"), ht.style.borderRadius = "100%", ht.style.left = ft + "%", ht.style.right = ft + "%", ht.style.top = ft + "%", ht.style.bottom = ft + "%", pt.appendChild(ht), s.querySelector("#game-toolbar .color-picker .sizes").appendChild(pt), ct.push([pt, ht])
    }

    function mt(e) {
        for (var t = 0; t < dt; t++) ct[t][1].style.backgroundColor = e
    }

    function gt() {
        var e = (lt - Re) / (Ee - Re),
            t = I(Ne.querySelector(".slider .track")),
            n = I(Ne.querySelector(".slider")),
            n = ((n - t) / 2 + e * t) / n;
        Ne.querySelector(".slider .knob").style.left = 100 * e + "%", Ne.querySelector(".slider .bar-fill").style.width = 100 * n + "%";
        n = Ne.querySelector(".color-picker .preview .graphic .brush"), e = 30 * e + 8;
        n.style.width = e + "px", n.style.height = e + "px", Ne.querySelector(".color-picker .preview .size").textContent = lt + "px"
    }

    function yt(e) {
        lt = Nt(e, Re, Ee), gt(), tt()
    }

    function vt(e) {
        e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
    }

    function St(e) {
        vt(ze[e].element), ze[e].action()
    }

    function kt(e, t) {
        vt(He[e].element), e == at && !t || (He[nt = at].element.classList.remove("selected"), He[e].element.classList.add("selected"), at = e, tt())
    }

    function bt(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            xt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            xt(it[e]);
        // TYPOEND
        // ORIGINAL var t = xt(it[e]);
        mt(t), ot = e, s.querySelector("#color-preview-primary").style.fill = t, tt()
    }

    function wt(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            xt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            xt(it[e]);
        // TYPOEND
        // ORIGINAL var t = xt(it[e]);
        mt(t), rt = e, s.querySelector("#color-preview-secondary").style.fill = t, tt()
    }

    function Ct() {
        Ne.querySelector(".color-picker .brushmenu").classList.remove("open"), Ne.querySelector(".color-picker .preview").classList.remove("open")
    }
    for (ut = 0; ut < it.length / 3; ut++) Ne.querySelector(".top").appendChild(qt(3 * ut)), Ne.querySelector(".mid").appendChild(qt(3 * ut + 1)), Ne.querySelector(".bottom").appendChild(qt(3 * ut + 2));

    function qt(e) {
        var t = A("item"),
            n = A("inner");
        return n.style.backgroundColor = xt(it[e]), t.appendChild(n), t.colorIndex = e, t
    }

    function xt(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function Mt(e) {
        // TYPOMOD
        // desc: if color code > 1000 -> customcolor
        if (e < 10000) e = Nt(e, 0, it.length), e = it[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));
        // TYPOEND
        // ORIGINAL e = Nt(e, 0, it.length), e = it[e];
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function Lt(e) {
        // TYPOMOD
        // desc: replace draw commands because of redo
        const keepCommands = Ye;
        // TYPOEND
        if (Ge = Ge.slice(0, e), !(kn != wn && Be < e)) {
            _e = At();
            e = Math.floor(Ge.length / $t);
            Xe = Xe.slice(0, e), Yt();
            for (var t = 0; t < Xe.length; t++) {
                var n = Xe[t];
                Pe.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = Xe.length * $t; t < Ge.length; t++) It(Tt(Ge[t]));
            je = Math.min(Ge.length, je), Be = Math.min(Ge.length, Be)
        }
        // TYPOMOD 
        // log kept commands
        document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
        // TYPOEND
    }
    const $t = 200;

    function At() {
        return [0, 9999, 9999, 0, 0]
    }

    function It(e) {
        var t, n, a;
        _e[0] += 1, _e[1] = Math.min(_e[1], e[0]), _e[2] = Math.min(_e[2], e[1]), _e[3] = Math.max(_e[3], e[2]), _e[4] = Math.max(_e[4], e[3]), _e[0] >= $t && (t = _e[1], a = _e[2], n = _e[3], e = _e[4], a = Pe.getImageData(t, a, n - t, e - a), Xe.push({
            data: a,
            bounds: _e
        }), _e = At())
    }

    function Dt(e) {
        return (e || 0 < Ge.length || 0 < Ve.length || 0 < je || 0 < Be) && (Ge = [], Ve = [], je = Be = 0, _e = At(), Xe = [], Yt(), 1)
    }

    function Rt() {
        Dt() && vn && vn.emit("data", {
            id: Sa
        })
    }

    function Et(e) {
        // TYPOMOD
        // log draw commands
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        // TYPOEND
        Ge.push(e), kn == wn && It(Tt(e))
    }

    function Tt(e) {
        var t = [0, 0, Fe.width, Fe.height];
        switch (e[0]) {
            case Le:
                var n = Nt(Math.floor(e[2]), Re, Ee),
                    a = Math.floor(Math.ceil(n / 2)),
                    o = Nt(Math.floor(e[3]), -a, Fe.width + a),
                    r = Nt(Math.floor(e[4]), -a, Fe.height + a),
                    i = Nt(Math.floor(e[5]), -a, Fe.width + a),
                    l = Nt(Math.floor(e[6]), -a, Fe.height + a),
                    s = Mt(e[1]);
                t[0] = Nt(o - a, 0, Fe.width), t[1] = Nt(r - a, 0, Fe.height), t[2] = Nt(i + a, 0, Fe.width), t[3] = Nt(l + a, 0, Fe.height), Ot(o, r, i, l, n, s.r, s.g, s.b);
                break;
            case $e:
                s = Mt(e[1]);
                ! function (e, t, a, o, r) {
                    var i = Pe.getImageData(0, 0, Fe.width, Fe.height),
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
                            if (t == a && n == o && e == r) return !1;
                            t = Math.abs(t - l[0]), n = Math.abs(n - l[1]), e = Math.abs(e - l[2]);
                            return t < 1 && n < 1 && e < 1
                        }
                        for (var c, d, u, h, f, p, m = i.height, g = i.width; n.length;) {
                            for (c = n.pop(), d = c[0], u = c[1], h = 4 * (u * g + d); 0 <= u-- && s(h);) h -= 4 * g;
                            for (h += 4 * g, ++u, p = f = !1; u++ < m - 1 && s(h);) Wt(i, h, a, o, r), 0 < d && (s(h - 4) ? f || (n.push([d - 1, u]), f = !0) : f = f && !1), d < g - 1 && (s(h + 4) ? p || (n.push([d + 1, u]), p = !0) : p = p && !1), h += 4 * g
                        }
                        Pe.putImageData(i, 0, 0)
                    }
                }(Nt(Math.floor(e[2]), 0, Fe.width), Nt(Math.floor(e[3]), 0, Fe.height), s.r, s.g, s.b)
        }
        return t
    }

    function Nt(e, t, n) {
        return e < t ? t : n < e ? n : e
    }

    function Wt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
    }

    function Ot(e, t, n, a, o, r, i, l) {
        var s = Math.floor(o / 2),
            c = s * s,
            d = Math.min(e, n) - s,
            u = Math.min(t, a) - s,
            h = Math.max(e, n) + s,
            o = Math.max(t, a) + s;
        e -= d, t -= u, n -= d, a -= u;

        function f(e, t) {
            for (var n = -s; n <= s; n++)
                for (var a, o = -s; o <= s; o++) n * n + o * o < c && (0 <= (a = 4 * ((t + o) * p.width + e + n)) && a < p.data.length && (p.data[a] = r, p.data[1 + a] = i, p.data[2 + a] = l, p.data[3 + a] = 255))
        }
        var p = Pe.getImageData(d, u, h - d, o - u);
        if (e == n && t == a) f(e, t);
        else {
            f(e, t), f(n, a);
            var m = Math.abs(n - e),
                g = Math.abs(a - t),
                y = e < n ? 1 : -1,
                v = t < a ? 1 : -1,
                S = m - g;
            for (Math.floor(Math.max(0, s - 10) / 5); e != n || t != a;) {
                var k = S << 1; - g < k && (S -= g, e += y), k < m && (S += m, t += v), f(e, t)
            }
        }
        Pe.putImageData(p, d, u)
    }

    function Yt() {
        // TYPOMOD
        // desc: log a canvas clear
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        Pe.fillStyle = "#FFF", Pe.fillRect(0, 0, Fe.width, Fe.height)
        document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        // TYPOEND
        // ORIGINAL Pe.fillStyle = "#FFF", Pe.fillRect(0, 0, Fe.width, Fe.height)
    }
    var Ut = !1;

    function Ht(e) {
        var t = s.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        yt(Re + Math.round(Nt((e - t.left) / t.width, 0, 1) * (Ee - Re)))
    }
    $("#game-toolbar .slider", "mousedown", function (e) {
        0 == e.button && (Ut = !0, Ht(e.clientX))
    }), $("#game-toolbar .slider", "touchstart", function (e) {
        Ut = !0, Ht(e.touches[0].clientX)
    }), $(Ne, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), $("#game-toolbar .color-picker .colors * .item", "mousedown", function (e) {
        var t = this.colorIndex;
        0 == e.button ? (e.altKey ? wt : bt)(t) : 2 == e.button && wt(t)
    });
    var zt = Ne.querySelector(".color-picker .preview"),
        Ft = Ne.querySelector(".color-picker .brushmenu");
    $([Fe, zt, Ft], "DOMMouseScroll wheel", function (e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        yt(lt + 4 * e)
    }), $(zt, "click", function (e) {
        this.classList.contains("open") ? Ct() : (Ne.querySelector(".color-picker .brushmenu").classList.add("open"), Ne.querySelector(".color-picker .preview").classList.add("open"), gt())
    }), $(s, "keypress", function (e) {
        if ("Enter" == e.code) return ae.focus(), 0;
        if ("input" == s.activeElement.tagName.toLowerCase() || "textarea" == s.activeElement.tagName.toLowerCase() || -1 != st) return 0;
        for (var t = e.code.toLowerCase().replace("key", ""), n = 0; n < He.length; n++)
            if (g.hotkeysTools[He[n].id].toLowerCase() == t) return kt(He[n].id), e.preventDefault(), 0;
        for (n = 0; n < ze.length; n++)
            if (g.hotkeysActions[ze[n].id].toLowerCase() == t) return St(ze[n].id), e.preventDefault(), 0
    }), $(s, "touchmove", function (e) {
        Ut && Ht(e.touches[0].clientX)
    }), $(s, "touchend touchcancel", function (e) {
        Ut = !1
    }), $(Fe, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), $(Fe, "mousedown", function (e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != st || Xt(e.button, e.clientX, e.clientY, !0, -1)
    }), $(s, "mouseup", function (e) {
        e.preventDefault(), _t(e.button), Ut = !1
    }), $(s, "mousemove", function (e) {
        Bt(e.clientX, e.clientY, !1, -1), Ut && Ht(e.clientX)
    });
    // TYPOMOD 
    // desc: add event handlers for typo features
    $(".avatar-customizer .container", "pointerdown", () => {
        Bn(typo.createFakeLobbyData()); // IDENTIFY x(typo.c()): .querySelector("#home").style.display = "none"
    });
    // TYPOEND
    var Pt = null;

    function Gt(e, t, n, a) {
        var o = Fe.getBoundingClientRect(),
            e = Math.floor((e - o.left) / o.width * Fe.width),
            o = Math.floor((t - o.top) / o.height * Fe.height);
        a ? (Je = n, Ze[0] = Ke[0] = e, Ze[1] = Ke[1] = o) : (Ze[0] = Ke[0], Ze[1] = Ke[1], Je = n, Ke[0] = e, Ke[1] = o)
    }
    $(Fe, "touchstart", function (e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Pt && (Pt = e[0].identitfier, Xt(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), $(Fe, "touchend touchcancel", function (e) {
        e.preventDefault(), _t(st)
    }), $(Fe, "touchmove", function (e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == Pt) {
                Bt(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    });
    var jt = 0;

    function Bt(e, t, n, a) {
        Gt(e, t, a, n), Vt(!1)
    }

    function Xt(e, t, n, a, o) {
        Ge.length, st = e, Gt(t, n, o, a), Vt(!0)
    }

    function _t(e) {
        -1 == e || 0 != e && 2 != e || st != e || (jt = Ge.length, Ve.push(jt), Pt = null, st = -1)
    }

    function Vt(e) {
        if (qn.id == d && wn == kn && -1 != st) {
            var t = 0 == st ? ot : rt,
                n = null;
            if (e && (at == De && (o = t, r = Ke[0], i = Ke[1], n = [$e, o, r, i]), at == Ie)) {
                var a = function (e, t) {
                    for (var n = (t = Pe.getImageData(e, t, 1, 1)).data[0], a = t.data[1], o = t.data[2], r = 0; r < it.length; r++) {
                        var i = it[r],
                            l = i[0] - n,
                            s = i[1] - a,
                            i = i[2] - o;
                        if (0 == l && 0 == s && 0 == i) return r
                    }
                    // TYPOMOD
                    // desc: if color is not in array, convert to custom color
                    r = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
                    // TYPOEND
                    return r
                }(Ke[0], Ke[1]);
                return (0 == st ? bt : wt)(a), void kt(nt)
            }
            at == Ae && (e = lt, 0 <= Je && (e = (lt - Re) * Nt(Je, 0, 1) + Re), o = t, r = e, i = Ze[0], a = Ze[1], t = Ke[0], e = Ke[1], n = [Le, o, r, i, a, t, e]), null != n && Et(n)
        }
        var o, r, i
    }
    setInterval(() => {
        var e, t;
        vn && qn.id == d && wn == kn && 0 < Ge.length - je && (t = Ge.slice(je, e = je + 8), vn.emit("data", {
            id: va,
            data: t
        }), je = Math.min(e, Ge.length))
    }, 50), setInterval(function () {
        vn && qn.id == d && wn != kn && Be < Ge.length && (It(Tt(Ge[Be])), Be++)
    }, 3);
    var Kt = s.querySelector("#game-canvas .overlay"),
        Zt = s.querySelector("#game-canvas .overlay-content"),
        Jt = s.querySelector("#game-canvas .overlay-content .text"),
        Qt = s.querySelector("#game-canvas .overlay-content .words"),
        en = s.querySelector("#game-canvas .overlay-content .reveal"),
        tn = s.querySelector("#game-canvas .overlay-content .result"),
        nn = -100,
        an = 0,
        on = void 0;

    function rn(e, r, i) {
        let l = nn,
            s = an,
            c = e.top - l,
            d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001) i && i();
        else {
            let a = void 0,
                o = 0;
            on = u.requestAnimationFrame(function e(t) {
                null == a && (a = t);
                var n = t - a;
                a = t, o = Math.min(o + n, r);
                t = o / r, n = (n = t) < .5 ? .5 * function (e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function (e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2), t = t * t * (3 - 2 * t);
                nn = l + c * n, an = s + d * t, Zt.style.top = nn + "%", Kt.style.opacity = an, o == r ? i && i() : on = u.requestAnimationFrame(e)
            })
        }
    }

    function ln(e) {
        e.classList.add("show")
    }

    function sn(t) {
        switch (! function () {
            for (var e = 0; e < Zt.children.length; e++) Zt.children[e].classList.remove("show")
        }(), t.id) {
            case w:
                ln(Jt), Jt.textContent = xe("Round $", t.data + 1);
                break;
            case k:
                ln(Jt), Jt.textContent = xe("Waiting for players...");
                break;
            case b:
                ln(Jt), Jt.textContent = xe("Game starting in a few seconds...");
                break;
            case q:
                ln(en), en.querySelector("p span.word").textContent = t.data.word, en.querySelector(".reason").textContent = function (e) {
                    switch (e) {
                        case y:
                            return xe("Everyone guessed the word!");
                        case S:
                            return xe("The drawer left the game!");
                        case v:
                            return xe("Time is up!");
                        default:
                            return "Error!"
                    }
                }(t.data.reason);
                var e = en.querySelector(".player-container");
                D(e);
                for (var n = [], a = 0; a < t.data.scores.length; a += 3) {
                    var o = t.data.scores[a + 0],
                        r = (t.data.scores[a + 1], t.data.scores[a + 2]);
                    (s = xa(o)) && n.push({
                        name: s.name,
                        score: r
                    })
                }
                n.sort(function (e, t) {
                    return t.score - e.score
                });
                for (a = 0; a < n.length; a++) {
                    var l = A("player"),
                        s = n[a];
                    l.appendChild(A("name", s.name));
                    var c = A("score", (0 < s.score ? "+" : "") + s.score);
                    s.score <= 0 && c.classList.add("zero"), l.appendChild(c), e.appendChild(l)
                }
                break;
            case x:
                ln(tn);
                let i = [tn.querySelector(".podest-1"), tn.querySelector(".podest-2"), tn.querySelector(".podest-3"), tn.querySelector(".ranks")];
                for (let e = 0; e < 4; e++) D(i[e]);
                if (0 < t.data.length) {
                    let r = [
                        [],
                        [],
                        [],
                        []
                    ];
                    for (let e = 0; e < t.data.length; e++) {
                        var d = {
                            player: xa(t.data[e][0]),
                            rank: t.data[e][1],
                            title: t.data[e][2]
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
                            e.appendChild(A("rank-place", "#" + (o + 1))), e.appendChild(A("rank-name", u)), e.appendChild(A("rank-score", xe("$ points", h)));
                            let n = A("avatar-container");
                            e.appendChild(n), 0 == o && n.appendChild(A("trophy"));
                            for (let t = 0; t < a.length; t++) {
                                let e = R(a[t].player.avatar, 96, 0 == o);
                                e.style.width = "96px", e.style.height = "96px", e.style.left = 16 * -(a.length - 1) + 32 * t + "px", 0 == o && (e.classList.add("winner"), e.style.animationDelay = -2.35 * t + "s"), n.appendChild(e)
                            }
                        }
                    }
                    var f = Math.min(5, r[3].length);
                    for (let n = 0; n < f; n++) {
                        var p = r[3][n];
                        let e = A("rank"),
                            t = R(p.player.avatar, 48, !1);
                        t.style.width = "48px", t.style.height = "48px", e.appendChild(t), e.appendChild(A("rank-name", "#" + (p.rank + 1) + " " + p.player.name)), e.appendChild(A("rank-score", xe("$ points", p.player.score))), i[3].appendChild(e)
                    }
                    0 < r[0].length ? (g = r[0].map(function (e) {
                        return e.player.name
                    }).join(", "), tn.querySelector(".winner-name").textContent = 0 < r[0].length ? g : "<user left>", tn.querySelector(".winner-text").textContent = " " + (1 == r[0].length ? xe("is the winner!") : xe("are the winners!"))) : (tn.querySelector(".winner-name").textContent = "", tn.querySelector(".winner-text").textContent = xe("Nobody won!"))
                } else tn.querySelector(".winner-name").textContent = "", tn.querySelector(".winner-text").textContent = xe("Nobody won!");
                break;
            case C:
                if (t.data.words) {
                    ln(Jt), ln(Qt), Jt.textContent = xe("Choose a word"), D(Qt);
                    for (a = 0; a < t.data.words.length; a++) {
                        var m = A("word", t.data.words[a]);
                        m.index = a, $(m, "click", function () {
                            var e;
                            e = this.index, vn && vn.connected && qn.id == C && vn.emit("data", {
                                id: ya,
                                data: e
                            })
                        }), Qt.appendChild(m)
                    }
                } else {
                    ln(Jt);
                    var g = (s = xa(t.data.id)) ? s.name : xe("User");
                    Jt.textContent = xe("$ is choosing a word!", g)
                }
        }
    }
    const cn = 0,
        dn = 1,
        un = 2,
        hn = 3,
        fn = 4,
        pn = 5,
        mn = 6;

    function gn(e, t) {
        this.url = t, this.buffer = null, this.loaded = !1;
        var n = this,
            a = new XMLHttpRequest;
        a.open("GET", t, !0), a.responseType = "arraybuffer", a.onload = function () {
            e.context.decodeAudioData(a.response, function (e) {
                n.buffer = e, n.loaded = !0
            }, function (e) {
                console.log("Failed loading audio from url '" + t + "'")
            })
        }, a.send()
    }
    var yn = function () {
        this.context = null, this.sounds = new Map, u.addEventListener("load", this.load.bind(this), !1)
    };
    yn.prototype.addSound = function (e, t) {
        this.sounds.set(e, new gn(this, t))
    }, yn.prototype.loadSounds = function () {
        this.addSound(cn, "/audio/roundStart.ogg"), this.addSound(dn, "/audio/roundEndSuccess.ogg"), this.addSound(un, "/audio/roundEndFailure.ogg"), this.addSound(hn, "/audio/join.ogg"), this.addSound(fn, "/audio/leave.ogg"), this.addSound(pn, "/audio/playerGuessed.ogg"), this.addSound(mn, "/audio/tick.ogg")
    }, yn.prototype.playSound = function (e) {
        var t, n;
        null != this.context && ("running" == this.context.state ? null == this.context || g.audioMute || !this.sounds.has(e) || (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.context.destination), n.start(0)) : this.context.resume().then(() => {
            this.playSound(e)
        }))
    }, yn.prototype.load = function () {
        try {
            u.AudioContext = u.AudioContext || u.webkitAudioContext, this.context = new AudioContext
        } catch (e) {
            return console.log("Error creating AudioContext."), void (this.context = null)
        }
        this.loadSounds()
    };
    k;
    var vn, Sn = [],
        kn = 0,
        bn = -1,
        wn = -1,
        Cn = [],
        qn = {
            id: -1,
            time: 0,
            data: 0
        },
        xn = 0,
        Mn = new yn,
        Ln = void 0,
        $n = !1,
        An = s.querySelector("#game-room"),
        In = s.querySelector("#game-players"),
        Dn = s.querySelector("#game-board"),
        Rn = In.querySelector(".list"),
        En = In.querySelector(".footer"),
        Tn = s.querySelector("#game-round"),
        Nn = [s.querySelector("#game-word .description"), s.querySelector("#game-word .word"), s.querySelector("#game-word .hints .container")],
        Wn = s.querySelector("#home .container-name-lang input"),
        On = s.querySelector("#home .container-name-lang select"),
        Yn = s.querySelector("#home .panel .button-play"),
        Un = s.querySelector("#home .panel .button-create"),
        e = s.querySelector("#home .panel .button-rooms");

    function Hn(e) {
        $n = e, s.querySelector("#load").style.display = e ? "block" : "none"
    }

    function zn(e, t, n, a) {
        var o, r;
        o = e, e = t, r = function (e, t) {
            switch (e) {
                case 200:
                    return void n({
                        success: !0,
                        data: t
                    });
                case 503:
                case 0:
                    a && V(U, "Servers are currently undergoing maintenance!\n\rPlease try again later!");
                    break;
                default:
                    a && V(U, "An unknown error occurred (" + e + ")\n\rPlease try again later!")
            }
            n({
                success: !1,
                error: e
            })
        }, (t = new XMLHttpRequest).onreadystatechange = function () {
            4 == this.readyState && (console.log(this.responseText), r(this.status, this.response))
        }, t.open("POST", o, !0), t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), t.send(e)
    }

    function Fn(e, t) {
        Mn.context.resume(), vn && vn.disconnect();
        let n = 0;
        (vn = a(e, {
            closeOnBeforeunload: !1
        })).on("connect", function () {
            // TYPOMOD
            // desc: disconnect socket & leave lobby
            typo.disconnect = () => {
                if (vn) {
                    vn.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    vn.off("data");
                    vn.reconnect = false;
                    vn.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            // TYPOEND
            vn.on("joinerr", function (e) {
                ea(), V(U, function (e) {
                    switch (e) {
                        case 1:
                            return xe("Room not found!");
                        case 2:
                            return xe("Room is full!");
                        case 3:
                            return xe("You are on a kick cooldown!");
                        case 4:
                            return xe("You are banned from this room!");
                        default:
                            return xe("An unknown error ('$') occured!", e)
                    }
                }(e))
            }), vn.on("data", qa);
            var e = Wn.value.split("#"),
                e = {
                    join: t,
                    name: e[0],
                    lang: On.value,
                    code: e[1],
                    avatar: g.avatar
                };
            vn.emit("login", e)
        }), vn.on("reason", function (e) {
            n = e
        }), vn.on("disconnect", function () {
            switch (n) {
                case f:
                    V(H, xe("You have been kicked!"));
                    break;
                case p:
                    V(H, xe("You have been banned!"))
            }
            ea()
        }), vn.on("connect_error", e => {
            ea(), V(U, e.message)
        })
    }

    function Pn(e) {
        $n || (e = "" != e ? "id=" + e : "lang=" + On.value, te(), Hn(!0), zn(location.origin + ":3000/play", e, function (e) {
            Hn(!1), e.success && Fn((e = e.data.split(","))[0], e[1])
        }, !0))
    }

    function Gn(e) {
        let n = [],
            a = e.split(",");
        var t = parseInt(a.shift());
        if (0 < t) {
            var o = (a.length - 1) / t;
            for (let e = 0; e < t; e++) {
                var r = e * o;
                let t = [];
                for (let e = 0; e < 10; e++) t.push(a[r + e + 4]);
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

    function jn() {
        var e = X[z].querySelector(".filter select.lang").value;
        zn(location.origin + ":3000/rooms", "lang=" + e, function (e) {
            e.success && Q(Gn(e.data))
        })
    }

    function Bn(e) {
        var t;
        Mn.playSound(hn), kt(Ae, !0), yt(8), bt(2), wt(0), Dt(!0), D(oe), s.querySelector("#home").style.display = "none", s.querySelector("#game").style.display = "flex", kn = e.me, s.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, Cn = t, Xn(), D(Rn), Sn = [];
        for (var n = 0; n < e.users.length; n++) Ma(e.users[n], !1);
        Da(), Ea(), Vn(e.round), oa(e.owner), Zn(e.state, !0)
    }

    function Xn() {
        s.querySelector("#game-room .lobby-name").textContent = Cn[m.NAME], Vn(xn);
        for (var e, t = 0; t < Wa.length; t++) {
            var n = Wa[t];
            n.index && (n = Cn[(e = n).index], "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }

    function _n(e, t, n) {
        Cn[e] = t, n && vn && vn.emit("data", {
            id: ua,
            data: {
                id: e,
                val: t
            }
        }), Xn()
    }

    function Vn(e) {
        xn = e, Tn.textContent = xe("Round $ of $", [xn + 1, Cn[m.ROUNDS]])
    }

    function Kn() {
        for (let e = 0; e < Sn.length; e++) Sn[e].score = 0;
        for (let e = 0; e < Sn.length; e++) Ta(Sn[e], !1), Na(Sn[e], !1), Ra(Sn[e])
    }

    function Zn(e, t) {
        var n, a;
        if (n = qn = e, null != on && (u.cancelAnimationFrame(on), on = void 0), n.id == d || n.id == h ? rn({
            top: -100,
            opacity: 0
        }, 700, function () {
            Kt.classList.remove("show")
        }) : Kt.classList.contains("show") ? rn({
            top: -100,
            opacity: 1
        }, 700, function () {
            sn(n), rn({
                top: 0,
                opacity: 1
            }, 700)
        }) : (Kt.classList.add("show"), sn(n), rn({
            top: 0,
            opacity: 1
        }, 700)), a = e.time, Fa(), za = a, Ua.textContent = za, Ha = setInterval(function () {
            za = Math.max(0, za - 1), Ua.textContent = za;
            var e = -1;
            qn.id == d && (e = Oa), qn.id == C && (e = Ya), Ua.style.animationName = za < e ? za % 2 == 0 ? "rot_left" : "rot_right" : "none", za < e && Mn.playSound(mn), za <= 0 && Fa()
        }, 1e3), Ne.classList.add("hidden"), tt(), Qn(!1), e.id == h ? (Kn(), An.style.display = "flex", Dn.style.display = "none", In.classList.add("room")) : (An.style.display = "none", Dn.style.display = "", In.classList.remove("room")), e.id == w && (Vn(e.data), 0 == e.data && Kn()), e.id == q) {
            kn != wn && aa(e.data.word);
            for (var o = 0; o < e.data.scores.length; o += 3) {
                var r = e.data.scores[o + 0],
                    i = e.data.scores[o + 1],
                    r = (e.data.scores[o + 2], xa(r));
                r && (r.score = i)
            }
            Ea();
            for (var l = !0, o = 0; o < Sn.length; o++)
                if (Sn[o].guessed) {
                    l = !1;
                    break
                } l ? Mn.playSound(un) : Mn.playSound(dn), ye(xe("The word was '$'", e.data.word), "", ge(ue), !0)
            // TYPOMOD
            // desc: log finished drawing
            document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
            // TYPOEND
        } else e.id != d && (Nn[0].textContent = xe("WAITING"), Nn[0].classList.add("waiting"), Nn[1].style.display = "none", Nn[2].style.display = "none");
        if (e.id == d) {
            if (wn = e.data.id, Mn.playSound(cn), Dt(!0), e.data.drawCommands && (Ge = e.data.drawCommands), ye(xe("$ is drawing now!", xa(wn).name), "", ge(de), !0), !t)
                for (o = 0; o < Sn.length; o++) Ta(Sn[o], !1);
            Nn[0].classList.remove("waiting"), wn == kn ? (t = e.data.word, Nn[0].textContent = xe("DRAW THIS"), Nn[1].style.display = "", Nn[2].style.display = "none", Nn[1].textContent = t, Ne.classList.remove("hidden"), tt()) : (Qn(!0), ta(e.data.word, !1), na(e.data.hints))
        } else {
            wn = -1;
            for (o = 0; o < Sn.length; o++) Ta(Sn[o], !1)
        }
        for (o = 0; o < Sn.length; o++) Na(Sn[o], Sn[o].id == wn);
        Da()
    }

    function Jn(e) {
        vn && vn.connected && qn.id == d && (vn.emit("data", {
            id: sa,
            data: e
        }), Qn(!1))
    }

    function Qn(e) {
        s.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function ea() {
        vn && vn.close(), vn = void 0, Dt(), Fa(), Sn = [], Cn = [], qn = {
            id: wn = bn = -1,
            time: kn = 0,
            data: 0
        }, s.querySelector("#home").style.display = "", s.querySelector("#game").style.display = "none"
    }

    function ta(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++) n += t[e];
        var a = !e && 1 == Cn[m.WORDMODE];
        a && (n = 3), Nn[0].textContent = xe(a ? "WORD HIDDEN" : "GUESS THIS"), Nn[1].style.display = "none", Nn[2].style.display = "", D(Nn[2]), Nn[2].hints = [];
        for (var o = 0; o < n; o++) Nn[2].hints[o] = A("hint", a ? "?" : "_"), Nn[2].appendChild(Nn[2].hints[o]);
        a || Nn[2].appendChild(A("word-length", t.join(" ")))
    }

    function na(e) {
        for (var t = Nn[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
                o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function aa(e) {
        (!Nn[2].hints || Nn[2].hints.length < e.length) && ta([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        na(t)
    }

    function oa(e) {
        bn = e;
        for (var t = 0; t < Sn.length; t++) T(Sn[t].element, Sn[t].id == bn), Aa(Sn[t], 0, Sn[t].id == bn);
        ! function (t) {
            for (var n = 0; n < Wa.length; n++) {
                let e = Wa[n];
                e.element.disabled = t
            }
        }(kn != bn);
        e = xa(bn);
        e && ye(xe("$ is now the room owner!", e.name), "", ge(fe), !0)
    }
    $(X[z].querySelector(".filter select.lang"), "change", jn), $(X[z].querySelector("button.refresh"), "click", jn);
    const ra = 1,
        ia = 2,
        la = 5,
        sa = 8,
        ca = 10,
        da = 11,
        ua = 12,
        ha = 13,
        fa = 14,
        pa = 15,
        ma = 16,
        ga = 17,
        ya = 18,
        va = 19,
        Sa = 20,
        ka = 21;
    const ba = 30,
        wa = 31,
        Ca = 32;

    function qa(e) {
        var t = e.id,
            n = e.data;
        switch (t) {
            case ca:
                Bn(n);
                // TYPOMOD
                // desc: send lobbydata
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                // TYPOEND
                break;
            case da:
                Zn(n);
                break;
            case ua:
                _n(n.id, n.val, !1);
                break;
            case ha:
                na(n);
                break;
            case fa:
                za = n;
                break;
            case ra:
                ye(xe("$ joined the room!", Ma(n, !0).name), "", ge(ue), !0), Mn.playSound(hn);
                break;
            case ia:
                var a = function (e) {
                    for (var t = 0; t < Sn.length; t++) {
                        var n = Sn[t];
                        if (n.id == e) return Sn.splice(t, 1), n.element.remove(), Ea(), Da(), n
                    }
                    return
                }(n.id);
                a && (ye(function (e, t) {
                    switch (e) {
                        default:
                            return xe("$ left the room!", t);
                        case f:
                            return xe("$ has been kicked!", t);
                        case p:
                            return xe("$ has been banned!", t)
                    }
                }(n.reason, a.name), "", ge(he), !0), Mn.playSound(fn));
                break;
            case la:
                var a = xa(n[0]),
                    o = xa(n[1]),
                    r = n[2],
                    i = n[3];
                a && o && ye(xe("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", ge(ce), !0);
                break;
            case pa:
                var l = xa(n.id);
                l && (ye(xe("$ guessed the word!", l.name), "", ge(ue), !0), Ta(l, !0), Mn.playSound(pn), n.id == kn && aa(n.word));
                break;
            case sa:
                o = xa(n.id);
                o && (r = o, i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (l = A("icon")).style.backgroundImage = "url(/img/" + i + ")", $a(r, l), n.vote ? ye(xe("$ liked the drawing!", o.name), "", ge(ue), !0) : ye(xe("$ disliked the drawing!", o.name), "", ge(he), !0));
                break;
            case ga:
                oa(n);
                break;
            case ma:
                ye(xe("$ is close!", n), "", ge(ce), !0);
                break;
            case ba:
                La(xa(n.id), n.msg);
                break;
            case Ca:
                ye(xe("Spam detected! You're sending messages too quickly."), "", ge(he), !0);
                break;
            case wa:
                switch (n.id) {
                    case 0:
                        ye(xe("You need at least 2 players to start the game!"), "", ge(he), !0);
                        break;
                    case 100:
                        ye(xe("Server restarting in about $ seconds!", n.data), "", ge(he), !0)
                }
                break;
            case va:
                for (var s = 0; s < n.length; s++) Et(n[s]);
                break;
            case Sa:
                Dt(!0);
                break;
            case ka:
                Lt(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function xa(e) {
        for (var t = 0; t < Sn.length; t++) {
            var n = Sn[t];
            if (n.id == e) return n
        }
    }

    function Ma(e, t) {
        var n = {
            id: e.id,
            name: e.name,
            avatar: e.avatar,
            score: e.score,
            guessed: e.guessed,
            rank: 0,
            muted: !1,
            votekick: !1,
            reported: !1,
            page: 0,
            element: A("player"),
            bubble: void 0
        };
        Sn.push(n), g.filterChat && n.id != kn && le(n.name.slice()) != n.name && (n.name = "user");
        var a = n.id == kn ? xe("$ (You)", n.name) : n.name,
            o = A("info"),
            e = A("name", a);
        n.id == kn && e.classList.add("me"), o.appendChild(e), o.appendChild(A("rank", "#" + n.rank)), o.appendChild(A("score", xe("$ points", n.score))), n.element.appendChild(o);
        a = R(n.avatar);
        // TYPOMOD
        // desc: set ID to player to identify
        n.element.setAttribute("playerid", n.id);
        // TYPOEND
        n.element.drawing = A("drawing"), a.appendChild(n.element.drawing), n.element.appendChild(a), Rn.appendChild(n.element), $(n.element, "click", function () {
            Ln = n, V(Y, n)
        });
        e = A("icons"), o = A("icon owner"), a = A("icon muted");
        return e.appendChild(o), e.appendChild(a), n.element.appendChild(e), n.element.icons = [o, a], Ta(n, n.guessed), t && Da(), n
    }

    function La(e, t) {
        var n;
        e.muted || (n = e.id == wn || e.guessed, kn != wn && !xa(kn).guessed && n || (g.filterChat && (t = le(t)), $a(e, A("text", t)), ye(e.name, t, ge(n ? pe : se))))
    }

    function $a(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = A("bubble"),
            a = A("content");
        a.appendChild(t), n.appendChild(A("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function () {
            e.bubble.remove(), e.bubble = void 0
        }, 1500)
    }

    function Aa(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ia = void 0;

    function Da() {
        var e = qn.id == h,
            t = e ? 112 : 48,
            n = Math.max(t, Rn.clientHeight);
        let a = Math.floor(n / t);
        e && (a *= 4);
        t = Math.ceil(Sn.length / a);
        for (let e = 0; e < Sn.length; e++) Sn[e].page = Math.floor(e / a);
        e = s.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = Sn.length, e[1].textContent = Cn[m.SLOTS], null == Ia ? Ia = N(En, t, [In], function (e, n, t) {
            let a = [];
            for (let t = 0; t < Sn.length; t++) {
                let e = Sn[t];
                var o = e.page == n;
                e.element.style.display = o ? "" : "none", o && a.push(e.element)
            }
            if (0 < a.length) {
                for (let t = 0; t < a.length; t++) {
                    let e = a[t];
                    e.classList.remove("first"), e.classList.remove("last"), t % 2 == 0 ? e.classList.remove("odd") : e.classList.add("odd")
                }
                a[0].classList.add("first"), a[a.length - 1].classList.add("last")
            }
        }) : W(Ia, t), Ia.element.style.display = 1 < t ? "" : "none"
    }

    function Ra(t) {
        let n = 1;
        for (let e = 0; e < Sn.length; e++) {
            var a = Sn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n, t.element.querySelector(".score").textContent = xe("$ points", t.score);
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n, e.classList.remove("first"), e.classList.remove("second"), e.classList.remove("third"), 1 == n && e.classList.add("first"), 2 == n && e.classList.add("second"), 3 == n && e.classList.add("third")
    }

    function Ea() {
        for (var e = 0; e < Sn.length; e++) Ra(Sn[e])
    }

    function Ta(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }

    function Na(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Wa = [];
    ! function () {
        for (var e = An.querySelectorAll('*[id^="item-"]'), n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            Wa.push(t), $(t.element, "change", function () {
                var e = "checkbox" == this.type ? this.checked : this.value;
                null != t.index && _n(t.index, e, !0)
            })
        }
    }();
    const Oa = 10,
        Ya = 4;
    var Ua = s.querySelector("#game-clock"),
        Ha = null,
        za = 0;

    function Fa() {
        Ha && (clearInterval(Ha), Ha = null)
    }
    var Pa, Ga, ja, Ba, Xa, _a, yn = s.querySelector("#tutorial"),
        Va = yn.querySelectorAll(".page"),
        Ka = N(yn, Va.length, [yn.querySelector(".pages")], function (e, t, n) {
            n && clearInterval(Za);
            for (let e = 0; e < Va.length; e++) Va[e].classList.remove("active");
            Va[t].classList.add("active")
        }),
        Za = setInterval(function () {
            Ka.selected < 4 ? O(Ka, Ka.selected + 1, !1) : O(Ka, 0, !1)
        }, 3500),
        Ja = s.querySelector("#setting-bar"),
        Qa = s.querySelector("#audio"),
        eo = s.querySelector("#lightbulb");

    function to() {
        Ja.classList.remove("open")
    }

    function no(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }

    function ao() {
        Qa.dataset.tooltip = g.audioMute ? "Unmute audio" : "Mute audio", eo.dataset.tooltip = g.dark ? "Turn the lights on" : "Turn the lights off", ve && (ve.querySelector(".tooltip-content").textContent = xe(Se.dataset.tooltip))
    }

    function oo(e) {
        _a.parts[e].classList.remove("bounce"), _a.parts[e].offsetWidth, _a.parts[e].classList.add("bounce")
    }
    $(Ja.querySelector(".icon"), "click", function () {
        no(Qa, g.audioMute), no(eo, g.dark), ao(), Ja.classList.contains("open") ? to() : Ja.classList.add("open")
    }), $("#audio", "click", function (e) {
        g.audioMute = !g.audioMute, no(Qa, g.audioMute), ao(), M()
    }), $("#lightbulb", "click", function (e) {
        L(!g.dark), no(eo, g.dark), ao(), M()
    }), $("#hotkeys", "click", function (e) {
        to(), V(P)
    }), u.onbeforeunload = function (e) {
        return vn ? xe("Are you sure you want to leave?") : void 0
    }, u.onunload = function () {
        vn && ea()
    }, $([s, Fe], "mousedown touchstart", function (e) {
        Ja.contains(e.target) || to(), e.target != zt && (Ft.contains(e.target) || Ct())
    }), $(u, "resize", Da), $([Wn, On], "change", M), $(Yn, "click", function () {
        var e, t, n;
        Pn((e = u.location.href, n = "", e = e.split("?"), n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
    }), $(e, "click", function () {
        var e;
        $n || (te(), Hn(!0), X[z].querySelector(".filter select.lang").value = On.value, e = X[z].querySelector(".filter select.type").value, zn(location.origin + ":3000/rooms", "lang=" + On.value + "&type=" + e, function (e) {
            Hn(!1), e.success && V(z, Gn(e.data))
        }, !0))
    }), $(Un, "click", function () {
        $n || (te(), Hn(!0), zn(location.origin + ":3000/create", "lang=" + On.value, function (e) {
            Hn(!1), e.success && Fn((e = e.data.split(","))[0], e[1])
        }, !0))
    }), $(s.querySelector("#game-rate .like"), "click", function () {
        Jn(1)
    }), $(s.querySelector("#game-rate .dislike"), "click", function () {
        Jn(0)
    }), $(s.querySelector("#start-game"), "click", function () {
        if (vn) {
            let t = s.querySelector("#item-settings-customwords").value.split(","),
                e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++) t[e] = t[e].trim();
                e = t.join(",")
            }
            vn.emit("data", {
                id: 22,
                data: e
            })
        }
    }), $(s.querySelector("#copy-invite"), "click", function () {
        s.querySelector("#input-invite").select();
        try {
            var e = s.execCommand("copy") ? "successful" : "unsuccessful";
            console.log("Copying link was " + e)
        } catch (e) {
            console.log("Unable to copy link " + e)
        }
    }), $(X[Y].querySelector("button.kick"), "click", function () {
        te(), null != Ln && Ln.id != kn && kn == bn && vn && vn.emit("data", {
            id: 3,
            data: Ln.id
        })
    }), $(X[Y].querySelector("button.ban"), "click", function () {
        te(), null != Ln && Ln.id != kn && kn == bn && vn && vn.emit("data", {
            id: 4,
            data: Ln.id
        })
    }), $(X[Y].querySelector("button.votekick"), "click", function () {
        te(), null != Ln && Ln.id != kn && vn && (Ln.id == bn ? ye(xe("You can not votekick the lobby owner!"), "", ge(he), !0) : vn.emit("data", {
            id: la,
            data: Ln.id
        }))
    }), $(X[Y].querySelector("button.mute"), "click", function () {
        null != Ln && Ln.id != kn && (Ln.muted = !Ln.muted, Aa(Ln, 1, Ln.muted), Ln.muted ? ye(xe("You muted '$'!", Ln.name), "", ge(he), !0) : ye(xe("You unmuted '$'!", Ln.name), "", ge(he), !0), vn && vn.emit("data", {
            id: 7,
            data: Ln.id
        }), _(Ln.muted))
    }), $(X[Y].querySelector("button.report"), "click", function () {
        vn && null != Ln && Ln.id != kn && vn.emit("data", {
            id: 6,
            data: Ln.id
        })
    }), $(X[P].querySelector("#select-display-language"), "change", function (e) {
        g.displayLang = e.target.value, M(), Me()
    }), $(X[P].querySelector("#select-filter-chat"), "change", function (e) {
        g.filterChat = e.target.value, console.log(e.target.value), M()
    }), $(ne, "submit", function (e) {
        return e.preventDefault(), ae.value && (vn && vn.connected ? vn.emit("data", {
            id: ba,
            data: ae.value
        }) : La(xa(kn), ae.value)), ne.reset(), !1
    }),
        function () {
            if (!u.localStorageAvailable) {
                var e = !1;
                if (void 0 !== n) try {
                    n.setItem("feature_test", "yes"), "yes" === n.getItem("feature_test") && (n.removeItem("feature_test"), e = !0)
                } catch (e) { }
                u.localStorageAvailable = e
            }
            u.localStorageAvailable ? (Wn.value = o("name", ""), On.value = function (e) {
                for (var t = s.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                    if (e.startsWith(t[n].value)) return t[n].value;
                return "en"
            }(o("lang", navigator.language)), g.displayLang = o("displaylang", "en"), g.audioMute = 1 == parseInt(o("audio", 0)) ? 1 : 0, g.filterChat = 1 == parseInt(o("filter", 1)) ? 1 : 0, g.hotkeysTools = r("tools", g.hotkeysTools), g.hotkeysActions = r("actions", g.hotkeysActions), g.avatar = r("ava", g.avatar), L(1 == parseInt(o("dark", 0)) ? 1 : 0), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
        }(),
        function () {
            var t = s.querySelectorAll("[data-translate]");
            for (let e = 0; e < t.length; e++) {
                var n = t[e],
                    a = n.dataset.translate;
                if ("text" == a && Ce.push({
                    key: n.textContent,
                    element: n,
                    type: a
                }), "placeholder" == a && Ce.push({
                    key: n.placeholder,
                    element: n,
                    type: a
                }), "children" == a)
                    for (let e = 0; e < n.children.length; e++) Ce.push({
                        key: n.children[e].textContent,
                        element: n.children[e],
                        type: "text"
                    })
            }
        }(), Me(), $(Pa = s.querySelectorAll("[data-tooltip]"), "mouseenter", function (e) {
            ke(e.target)
        }), $(Pa, "mouseleave", function (e) {
            be()
        }), Ga = (Xa = s.querySelector("#home .avatar-customizer")).querySelector(".container"), ja = Xa.querySelectorAll(".arrows.left .arrow"), Ba = Xa.querySelectorAll(".arrows.right .arrow"), Xa = Xa.querySelectorAll(".randomize"), (_a = R(g.avatar, 96)).classList.add("fit"), Ga.appendChild(_a), $(ja, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --g.avatar[e], g.avatar[e] < 0 && (g.avatar[e] = t[e] - 1), oo(e), E(_a, g.avatar, 96), M()
        }), $(Ba, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            g.avatar[e] += 1, g.avatar[e] >= t[e] && (g.avatar[e] = 0), oo(e), E(_a, g.avatar, 96), M()
        }), $(Xa, "click", function () {
            g.avatar[0] = Math.floor(Math.random() * t[0]), g.avatar[1] = Math.floor(Math.random() * t[1]), g.avatar[2] = Math.floor(Math.random() * t[2]), oo(1), oo(2), E(_a, g.avatar, 96), M()
        }),
        function () {
            var t = Math.round(8 * Math.random());
            let n = s.querySelector("#home .logo-big .avatar-container");
            for (var a = 0; a < 8; a++) {
                let e = [0, 0, 0, -1];
                e[0] = a, e[1] = Math.round(100 * Math.random()) % l, e[2] = Math.round(100 * Math.random()) % c, 1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random()));
                var o = R(e, 48, t == a);
                n.append(o)
            }
        }()
}(window, document, localStorage, io);