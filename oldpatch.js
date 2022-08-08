! function (u, c, o, a) {
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
        L = {
            NORMAL: 0,
            HIDDEN: 1,
            COMBINATION: 2
        },
        r = ["Normal", "Hidden", "Combination"];
    // TYPOMOD 
    // desc: create re-useable functions
    const typo = {
        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input -> Pn
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> m
            return { id: id, name: name.length != 0 ? name : (Pn.value.split("#")[0] != "" ? Pn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? m.avatar : avatar, score: score, guessed: guessed };
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
                    Hn.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                    Dn = !1 // IDENTIFY: x:  = !1   
                    jn(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                    Un(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 3000 ? 3000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else oa() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = ft.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
                let code = match >= 0 ? match : e.detail.code;
                if (e.detail.secondary) Ct(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                else wt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
            });
            document.addEventListener("performDrawCommand", (e) => {
                Ke.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                Dt(Tt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
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
    const t = ["B", "V", "F"],
        n = ["U", "C"
/*TYPOMOD DESC: add action shortcuts defaults*/, "S", "L" /*TYPOEND*/];
    var m = {
        avatar: [Math.round(100 * Math.random()) % i, Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % s, -1],
        audioMute: 0,
        dark: 0,
        filterChat: 1,
        pressureSensitivity: 1,
        displayLang: "en",
        hotkeysTools: ["B", "V", "F"],
        hotkeysActions: ["U", "C"
/*TYPOMOD DESC: add action shortcuts*/, "S", "L" /*TYPOEND*/],
        undefined
    };

    function A(e, t) {
        e = o.getItem(e);
        return null == e ? t : e
    }

    function $(e, t) {
        e = o.getItem(e);
        return null == e ? t : JSON.parse(e)
    }

    function D() {
        u.localStorageAvailable && (o.setItem("name", Pn.value), o.setItem("lang", Yn.value), o.setItem("displaylang", m.displayLang), o.setItem("audio", 1 == m.audioMute ? 1 : 0), o.setItem("dark", 1 == m.dark ? 1 : 0), o.setItem("filter", 1 == m.filterChat ? 1 : 0), o.setItem("pressure", 1 == m.pressureSensitivity ? 1 : 0), o.setItem("tools", JSON.stringify(m.hotkeysTools)), o.setItem("actions", JSON.stringify(m.hotkeysActions)), o.setItem("ava", JSON.stringify(m.avatar)), console.log("Settings saved."))
    }

    function E(e) {
        /* TYPOMOD 
                 log draw commands */
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        /* TYPOEND */
        m.dark = e ? 1 : 0, c.documentElement.dataset.theme = m.dark ? "dark" : ""
    }

    function I(e, t, n) {
        var a, o = e;
        "string" == typeof e ? o = c.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]);
        for (var r = t.split(" "), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++) o[i].addEventListener(r[l], n)
    }

    function R(e, t) {
        for (var n = c.createElement("div"), a = e.split(" "), o = 0; o < a.length; o++) n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t), n
    }

    function T(e) {
        return parseFloat(getComputedStyle(e, null).width.replace("px", ""))
    }

    function N(e) {
        for (; e.firstChild;) e.removeChild(e.firstChild)
    }

    function W(e, t, n) {
        var a = R("avatar"),
            o = R("color"),
            r = R("eyes"),
            i = R("mouth"),
            l = R("special"),
            s = R("owner");
        return s.style.display = n ? "block" : "none", a.appendChild(o), a.appendChild(r), a.appendChild(i), a.appendChild(l), a.appendChild(s), a.parts = [o, r, i], O(a, e, t || 48), a
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
        a(e.querySelector(".color"), o, 10), a(e.querySelector(".eyes"), r, 10), a(e.querySelector(".mouth"), n, 10);
        e = e.querySelector(".special");
        0 <= t ? (e.style.display = "", a(e, t, 10)) : e.style.display = "none"
    }

    function z(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }

    function P(e, t, n, a) {
        let o = {
            element: R("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element), n.push(o.element), I(n, "DOMMouseScroll wheel", function (e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), H(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), Y(o, t), o
    }

    function Y(n, e) {
        N(n.element), n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = R("dot");
            e.appendChild(R("inner")), I(e, "click", function () {
                H(n, t, !0)
            }), n.element.appendChild(e), n.dots.push(e)
        }
        n.selected < 0 && (n.selected = 0), n.selected >= e && (n.selected = e - 1), H(n, n.selected, !1)
    }

    function H(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++) t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"), t.change(t, e, n)
        }
    }
    const U = 0,
        B = 1,
        F = 2,
        _ = 3,
        G = 4,
        j = 5;
    var V = c.querySelector("#modal"),
        X = V.querySelector(".title .text"),
        Z = V.querySelector(".content"),
        K = [];

    function J(e) {
        K[U].querySelector(".buttons button.mute").textContent = $e(e ? "Unmute" : "Mute")
    }

    function Q(e, a) {
        V.style.display = "block";
        for (var t = 0; t < K.length; t++) K[t].style.display = "none";
        switch (K[e].style.display = "flex", e) {
            case B:
                X.textContent = $e("Something went wrong!"), K[B].querySelector(".message").textContent = a;
                break;
            case F:
                X.textContent = $e("Disconnected!"), K[F].querySelector(".message").textContent = a;
                break;
            case U: {
                X.textContent = "";
                let e = K[U].querySelector(".buttons");
                e.style.display = a.id == Sn ? "none" : "flex", e.querySelector(".button-pair").style.display = Sn == kn ? "flex" : "none", e.querySelector("button.report").style.display = a.reported ? "none" : "", J(a.muted), K[U].querySelector(".report-menu").style.display = "none";
                let t = Z.querySelector(".player");
                N(t);
                let n = W(a.avatar, 96);
                z(n, kn == a.id), n.style.width = "96px", n.style.height = "96px", t.appendChild(n), t.appendChild(R("name", a.id == Sn ? $e("$ (You)", a.name) : a.name))
            }
                break;
            case _:
                X.textContent = $e("Rooms"), ae(a);
                break;
            case G:
                X.textContent = wn[M.NAME];
                break;
            case j:
                X.textContent = $e("Settings"), K[j].querySelector("#select-display-language").value = m.displayLang, K[j].querySelector("#select-filter-chat").value = m.filterChat, K[j].querySelector("#select-pressure-sensitivity").value = m.pressureSensitivity
        }
    }
    K[U] = V.querySelector(".container-player"), K[B] = V.querySelector(".container-info"), K[F] = V.querySelector(".container-info"), K[_] = V.querySelector(".container-rooms"), K[G] = V.querySelector(".container-room"), K[j] = V.querySelector(".container-settings");
    var ee = [],
        te = K[_].querySelector(".rooms"),
        e = K[_].querySelector(".footer"),
        ne = (K[_].querySelector(".dots"), P(e, 0, [e, te], function (e, n, t) {
            for (let t = 0; t < ee.length; t++) {
                let e = ee[t];
                e.element.style.display = e.page == n ? "" : "none"
            }
        }));

    function ae(t) {
        ! function () {
            for (let e = 0; e < ee.length; e++) ee[e].element.remove();
            ee = []
        }();
        for (let e = 0; e < t.length; e++) ! function (e) {
            let t = R("room"),
                n = R("type", 0 == e.type ? "P" : "C");
            n.dataset.type = e.type, t.appendChild(n), t.appendChild(R("name", e.settings[M.NAME])), t.appendChild(R("slots", e.users + "/" + e.settings[M.SLOTS])), t.appendChild(R("round", 0 < e.round ? e.round : $e("Not started"))), t.appendChild(R("mode", r[e.settings[M.WORDMODE]])), t.appendChild(R("settings", e.settings[M.DRAWTIME] + "s")), te.appendChild(t), ee.push({
                element: t,
                page: 0,
                data: e
            }), I(t, "click", function () {
                jn(e.id)
            })
        }(t[e]);
        oe()
    }

    function oe() {
        var n = K[_].querySelector(".filter input").value,
            a = K[_].querySelector(".filter select.type").value;
        let o = 0,
            r = 0;
        for (let t = 0; t < ee.length; t++) {
            let e = ee[t];
            var i = -1 != a && e.data.type != a,
                l = "" != n && !e.data.settings[M.NAME].includes(n);
            i || l ? e.page = -1 : (e.page = r, o++, 10 <= o && (r++, o = 0))
        }
        var e = 0 == o && 0 == r;
        K[_].querySelector(".rooms .empty").style.display = e ? "flex" : "none", r = Math.max(1, r), Y(ne, r), e = 1 < r, ne.element.style.display = e ? "" : "none"
    }

    function re() {
        V.style.display = "none"
    }
    I(u, "click", function (e) {
        e.target == V && re()
    }), I([V.querySelector(".close"), K[B].querySelector("button.ok")], "click", re), I(K[_].querySelector(".filter select.type"), "change", oe), I(K[_].querySelector(".filter input"), "input", oe);
    var ie = c.querySelector("#game-chat form"),
        le = c.querySelector("#game-chat form input"),
        se = c.querySelector("#game-chat .content");
    const ce = ["neger", "negro", "nigger", "nigga", "cunt", "fuck", "fucker", "fucking", "fucked", "fucktard", "kill", "rape", "asshole", "slut", "whore", "semen", "fag", "faggot", "retard", "retarded", "arsch", "arschloch", "hurensohn", "fotze", "muschi", "schlampe", "pisser", "missgeburt", "nutte", "nuttensohn", "hundesohn", "hure", "ficker", "ficken", "fick", "spast", "spasti", "spastiker", "hailhitler", "heilhitler", "sieghail", "siegheil", "nazi"],
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
            for (var r = de[o], i = 1; i < r.length; i++) t = r[i], n = r[0], a = a.split(t).join(n);
        for (var a = a.replace(/[^A-Z^a-z0-9^가-힣]/g, "*"), l = "", s = [], o = 0; o < a.length; o++) {
            var c = a.charAt(o);
            "*" != c && (l += c, s.push(o))
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
        r.textContent = a ? e : e + ": ", o.appendChild(r), o.style.color = n;
        n = c.createElement("span");
        n.textContent = t, o.appendChild(n);
        n = se.scrollHeight - se.scrollTop - se.clientHeight <= 20;
        if (se.appendChild(o), n && (se.scrollTop = se.scrollHeight + 100), 0 < m.chatDeleteQuota)
            for (; se.childElementCount > m.chatDeleteQuota;) se.firstElementChild.remove();
        return o
    }
    let we = void 0,
        Ce = void 0;

    function qe(e) {
        xe();
        var t = (Ce = e).dataset.tooltip,
            n = e.dataset.tooltipdir || "N";
        we = R("tooltip"), we.classList.add(n), we.appendChild(R("tooltip-arrow")), we.appendChild(R("tooltip-content", $e(t)));
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
        "N" == n && (r = (e.left + e.right) / 2), "S" == n && (r = (e.left + e.right) / 2, i = e.bottom), "E" == n && (r = e.right, i = (e.top + e.bottom) / 2), "W" == n && (i = (e.top + e.bottom) / 2), a || (r += u.scrollX, i += u.scrollY), we.style.left = r + "px", we.style.top = i + "px", c.body.appendChild(we)
    }

    function xe() {
        we && (we.remove(), we = void 0, Ce = void 0)
    }
    let Me = {},
        Le = [];

    function Ae(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }

    function $e(t, n) {
        var e = Ae(Me[m.displayLang], t);
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

    function De(t, n) {
        if ("children" != n) {
            let e = "";
            "text" == n && (e = t.textContent), "placeholder" == n && (e = t.placeholder), 0 < e.length ? Le.push({
                key: e,
                element: t,
                type: n
            }) : (console.log("Empty key passed to translate with!"), console.log(t))
        } else
            for (let e = 0; e < t.children.length; e++) {
                var a = t.children[e].dataset.translate;
                De(t.children[e], null == a ? "text" : a)
            }
    }

    function Ee() {
        var n = Me[m.displayLang];
        for (let t = 0; t < Le.length; t++) {
            let e = Le[t];
            var a = Ae(n, e.key);
            "text" == e.type && (e.element.textContent = a), "placeholder" == e.type && (e.element.placeholder = a)
        }
    }
    Me.en = {}, Me.de = {
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
        Colorpick: "Pipette",
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
    const Ie = 0,
        Re = 1;
    const Te = 0,
        Ne = 1,
        We = 2;
    const Oe = 4,
        ze = 44;
    var Pe, Ye = [4, 12, 20, 28, 36],
        He = c.querySelector("#game-toolbar"),
        Ue = He.querySelectorAll(".tools-container .tools")[0],
        Be = He.querySelectorAll(".tools-container .tools")[1],
        Fe = ((Pe = He.querySelector(".tool")).parentElement.removeChild(Pe), c.querySelector("#game-toolbar .picker .size-picker"));
    c.querySelector("#game-toolbar .picker .color-picker");

    function _e(e, t) {
        let n = R("tool clickable");
        n.appendChild(R("icon")), n.appendChild(R("key"));
        var a, o, r, i = (t.isAction ? m.hotkeysActions : m.hotkeysTools)[e];
        let l = t;
        l.id = e, l.element = n, n.toolIndex = e, n.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")", n.querySelector(".key").textContent = i, a = n, o = t.name, r = "N", a.dataset.tooltip = o, a.dataset.tooltipdir = r, I(a, "mouseenter", function (e) {
            qe(e.target)
        }), I(a, "mouseleave", function (e) {
            xe()
        }), t.isAction ? (n.addEventListener("click", function (e) {
            kt(this.toolIndex)
        }), Be.appendChild(n), Ve[e] = l) : (n.addEventListener("click", function (e) {
            bt(this.toolIndex)
        }), Ue.appendChild(n), je[e] = l);
        e = R("key", l.name);
        De(e, "text"), l.listing = R("item"), l.listing.appendChild(e);
        let s = c.createElement("input");
        s.value = i, l.listing.appendChild(s), I(s, "keydown", function (e) {
            var t = e.key;
            return Ge(l, t), D(), e.preventDefault(), !1
        }), K[j].querySelector("#hotkey-list").appendChild(l.listing)
    }

    function Ge(e, t) {
        e.isAction ? m.hotkeysActions[e.id] = t : m.hotkeysTools[e.id] = t, e.element.querySelector(".key").textContent = t, e.listing.querySelector("input").value = t
    }
    var je = [];
    _e(Te, {
        isAction: !1,
        name: "Brush",
        graphic: "pen.gif",
        cursor: 0
    }), _e(Ne, {
        isAction: !1,
        name: "Colorpick",
        graphic: "pick.gif",
        cursor: "url(/img/pick_cur.png) 7 36, default"
    }), _e(We, {
        isAction: !1,
        name: "Fill",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    });
    var Ve = [];
    _e(0, {
        isAction: !0,
        name: "Undo",
        graphic: "undo.gif",
        action: function () {
            {
                var e;
                0 < nt.length && (nt.pop(), 0 < nt.length ? (Lt(e = nt[nt.length - 1]), yn && yn.emit("data", {
                    id: xa,
                    data: e
                })) : It())
            }
        }
    }), _e(1, {
        isAction: !0,
        name: "Clear",
        graphic: "clear.gif",
        action: It
    })
        , /*TYPOMOD DESC: add action for colorswitch*/ _e(2, {
            isAction: !0,
            name: "Switcher",
            graphic: "",
            action: () => { document.dispatchEvent(new Event("toggleColor")); }
        }) /*TYPOEND*/
        , /*TYPOMOD DESC: add action for brushlab*/ _e(3, {
            isAction: !0,
            name: "Lab",
            graphic: "",
            action: () => { document.dispatchEvent(new Event("openBrushLab")); }
        }) /*TYPOEND*/;
    var Xe = c.querySelector("#game-canvas canvas"),
        Ze = Xe.getContext("2d"),
        Ke = [],
        Je = 0,
        Qe = 0,
        et = [],
        tt = [0, 9999, 9999, 0, 0],
        nt = [],
        at = [0, 0],
        ot = [0, 0],
        rt = 0,
        it = c.createElement("canvas");
    it.width = ze + 2, it.height = ze + 2;
    var lt = it.getContext("2d");

    function st() {
        var t = je[dt].cursor;
        if (Cn.id == h && bn == Sn) {
            if (dt == Te) {
                var n, a, o, r = it.width,
                    i = pt;
                if (i <= 0) return;
                lt.clearRect(0, 0, r, r);
                // TYPOMOD
                // desc: cursor with custom color
                let e = ut < 10000 ? ft[ut] : typo.hexToRgb((ut - 10000).toString(16).padStart(6, "0"));
                // TYPOEND  
                1 == m.dark && (n = Math.floor(.75 * e[0]), a = Math.floor(.75 * e[1]), o = Math.floor(.75 * e[2]), e = [n, a, o]), lt.fillStyle = xt(e), lt.beginPath(), lt.arc(r / 2, r / 2, i / 2 - 1, 0, 2 * Math.PI), lt.fill(), lt.strokeStyle = "#FFF", lt.beginPath(), lt.arc(r / 2, r / 2, i / 2 - 1, 0, 2 * Math.PI), lt.stroke(), lt.strokeStyle = "#000", lt.beginPath(), lt.arc(r / 2, r / 2, i / 2, 0, 2 * Math.PI), lt.stroke();
                r = r / 2, t = "url(" + it.toDataURL() + ")" + r + " " + r + ", default"
            }
        } else t = "default";
        Xe.style.cursor = t
    }
    var ct = 0,
        dt = 0,
        ut = 0,
        ht = 0,
        ft = [
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
        ],
        pt = 0,
        gt = -1,
        mt = [];
    for (let n = 0; n < Ye.length; n++) {
        let e = R("size clickable"),
            t = R("icon");
        t.style.backgroundPosition = -100 * n + "% 0%", t.style.backgroundSize = 100 * Ye.length + "% 100%", e.appendChild(t), Fe.querySelector(".sizes").appendChild(e), I(e, "click", function (e) {
            ! function (e) {
                e = mt[e];
                St(e.element), vt(e.size)
            }(n)
        }), mt.push({
            id: n,
            size: Ye[n],
            element: e,
            elementIcon: t
        })
    }
    for (let e = 0; e < ft.length / 3; e++) He.querySelector(".top").appendChild(qt(3 * e)), He.querySelector(".mid").appendChild(qt(3 * e + 1)), He.querySelector(".bottom").appendChild(qt(3 * e + 2));

    function yt() {
        var e = (pt - Oe) / (ze - Oe),
            t = T(He.querySelector(".slider .track")),
            n = T(He.querySelector(".slider")),
            n = ((n - t) / 2 + e * t) / n;
        He.querySelector(".slider .knob").style.left = 100 * e + "%", He.querySelector(".slider .bar-fill").style.width = 100 * n + "%";
        n = He.querySelector(".preview .graphic .brush"), e = 24 * e + 8;
        n.style.width = e + "px", n.style.height = e + "px", He.querySelector(".preview .size").textContent = pt + "px"
    }

    function vt(e) {
        pt = Nt(e, Oe, ze);
        let n = mt[mt.length - 1],
            a = n.size;
        for (let t = 0; t < mt.length; t++) {
            let e = mt[t];
            var o = Math.abs(pt - e.size);
            o <= a && (a = o, n = e), e.element.classList.remove("selected")
        }
        n.element.classList.add("selected"), yt(), st()
    }

    function St(e) {
        e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
    }

    function kt(e) {
        St(Ve[e].element), Ve[e].action()
    }

    function bt(e, t) {
        St(je[e].element), e == dt && !t || (je[ct = dt].element.classList.remove("selected"), je[e].element.classList.add("selected"), dt = e, st())
    }

    function wt(e) {
        var t =
            e > 10000 ? xt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : xt(ft[e]);
        ut = e, c.querySelector("#color-preview-primary").style.fill = t, st()
    }

    function Ct(e) {
        var t =
            e > 10000 ? xt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : xt(ft[e]);
        ht = e, c.querySelector("#color-preview-secondary").style.fill = t, st()
    }

    function qt(e) {
        var t = R("item"),
            n = R("inner");
        return n.style.backgroundColor = xt(ft[e]), t.appendChild(n), t.colorIndex = e, t
    }

    function xt(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function Mt(e) {
/*TYPOMOD   
desc: if color code > 1000 -> customcolor*/if (e < 1000)
            e = Nt(e, 0, ft.length), e = ft[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function Lt(e) {
        if (Ke = Ke.slice(0, e), !(Sn != bn && Qe < e)) {
/* TYPOMOD
        desc: replace draw commands because of redo*/        const keepCommands = Ke;
            /* TYPOEND*/
            tt = $t();
            e = Math.floor(Ke.length / At);
            et = et.slice(0, e), zt();
            for (var t = 0; t < et.length; t++) {
                var n = et[t];
                Ze.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = et.length * At; t < Ke.length; t++) Dt(Tt(Ke[t]));
            Je = Math.min(Ke.length, Je), Qe = Math.min(Ke.length, Qe)

            /* TYPOMOD 
                     log kept commands*/
            document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
            /* TYPOEND*/
}
    }
    const At = 200;

    function $t() {
        return [0, 9999, 9999, 0, 0]
    }

    function Dt(e) {
        var t, n, a;
        tt[0] += 1, tt[1] = Math.min(tt[1], e[0]), tt[2] = Math.min(tt[2], e[1]), tt[3] = Math.max(tt[3], e[2]), tt[4] = Math.max(tt[4], e[3]), tt[0] >= At && (t = tt[1], a = tt[2], n = tt[3], e = tt[4], a = Ze.getImageData(t, a, n - t, e - a), et.push({
            data: a,
            bounds: tt
        }), tt = $t())
    }

    function Et(e) {
        return (e || 0 < Ke.length || 0 < nt.length || 0 < Je || 0 < Qe) && (Ke = [], nt = [], Je = Qe = 0, tt = $t(), et = [], zt(), 1)
    }

    function It() {
        Et() && yn && yn.emit("data", {
            id: qa
        })
    }

    function Rt(e) {
        /* TYPOMOD 
                 log draw commands */
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        /* TYPOEND */
        Ke.push(e), Sn == bn && Dt(Tt(e))
    }

    function Tt(e) {
        var t = [0, 0, Xe.width, Xe.height];
        switch (e[0]) {
            case Ie:
                var n = Nt(Math.floor(e[2]), Oe, ze),
                    a = Math.floor(Math.ceil(n / 2)),
                    o = Nt(Math.floor(e[3]), -a, Xe.width + a),
                    r = Nt(Math.floor(e[4]), -a, Xe.height + a),
                    i = Nt(Math.floor(e[5]), -a, Xe.width + a),
                    l = Nt(Math.floor(e[6]), -a, Xe.height + a),
                    s = Mt(e[1]);
                t[0] = Nt(o - a, 0, Xe.width), t[1] = Nt(r - a, 0, Xe.height), t[2] = Nt(i + a, 0, Xe.width), t[3] = Nt(l + a, 0, Xe.height), Ot(o, r, i, l, n, s.r, s.g, s.b);
                break;
            case Re:
                s = Mt(e[1]);
                ! function (e, t, a, o, r) {
                    var i = Ze.getImageData(0, 0, Xe.width, Xe.height),
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
                        for (var c, d, u, h, f, p, g = i.height, m = i.width; n.length;) {
                            for (c = n.pop(), d = c[0], u = c[1], h = 4 * (u * m + d); 0 <= u-- && s(h);) h -= 4 * m;
                            for (h += 4 * m, ++u, p = f = !1; u++ < g - 1 && s(h);) Wt(i, h, a, o, r), 0 < d && (s(h - 4) ? f || (n.push([d - 1, u]), f = !0) : f = f && !1), d < m - 1 && (s(h + 4) ? p || (n.push([d + 1, u]), p = !0) : p = p && !1), h += 4 * m
                        }
                        Ze.putImageData(i, 0, 0)
                    }
                }(Nt(Math.floor(e[2]), 0, Xe.width), Nt(Math.floor(e[3]), 0, Xe.height), s.r, s.g, s.b)
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
        var p = Ze.getImageData(d, u, h - d, o - u);
        if (e == n && t == a) f(e, t);
        else {
            f(e, t), f(n, a);
            var g = Math.abs(n - e),
                m = Math.abs(a - t),
                y = e < n ? 1 : -1,
                v = t < a ? 1 : -1,
                S = g - m;
            for (Math.floor(Math.max(0, s - 10) / 5); e != n || t != a;) {
                var k = S << 1; - m < k && (S -= m, e += y), k < g && (S += g, t += v), f(e, t)
            }
        }
        Ze.putImageData(p, d, u)
    }

    function zt() {
        /* TYPOMOD
                 desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        /* TYPOEND */
        Ze.fillStyle = "#FFF", Ze.fillRect(0, 0, Xe.width, Xe.height)
            /* TYPOMOD
                     desc: dispatch clear event */
            ; document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        /* TYPOEND */
    }
    var Pt = !1;

    function Yt(e) {
        var t = c.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        vt(Oe + Math.round(Nt((e - t.left) / t.width, 0, 1) * (ze - Oe)))
    }
    I("#game-toolbar .slider", "mousedown", function (e) {
        0 == e.button && (Pt = !0, Yt(e.clientX))
    }), I("#game-toolbar .slider", "touchstart", function (e) {
        Pt = !0, Yt(e.touches[0].clientX)
    }), I(He, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), I("#game-toolbar .color-picker .colors * .item", "mousedown", function (e) {
        var t = this.colorIndex;
        0 == e.button ? (e.altKey ? Ct : wt)(t) : 2 == e.button && Ct(t)
    });
    var Ht = He.querySelector(".preview");
    I([Xe, Ht], "DOMMouseScroll wheel", function (e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        vt(pt + 4 * e)
    }), I(Ht, "click", function (e) {
        Fe.classList.contains("toggled") ? Fe.classList.remove("toggled") : Fe.classList.add("toggled"), yt()
    }), I(c, "keypress", function (e) {
        if ("Enter" == e.code) return le.focus(), 0;
        if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != gt) return 0;
        for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < je.length; n++)
            if (m.hotkeysTools[je[n].id].toLowerCase() == t) return bt(je[n].id), e.preventDefault(), 0;
        for (n = 0; n < Ve.length; n++)
            if (m.hotkeysActions[Ve[n].id].toLowerCase() == t) return kt(Ve[n].id), e.preventDefault(), 0
    }), I(c, "touchmove", function (e) {
        Pt && Yt(e.touches[0].clientX)
    }), I(c, "touchend touchcancel", function (e) {
        Pt = !1
    }), I(Xe, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), I(Xe, "mousedown", function (e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != gt || Gt(e.button, e.clientX, e.clientY, !0, -1)
    }), I(c, "mouseup", function (e) {
        e.preventDefault(), jt(e.button), Pt = !1
    }), I(c, "mousemove", function (e) {
        _t(e.clientX, e.clientY, !1, -1), Pt && Yt(e.clientX)
    });
    /* TYPOMOD 
         desc: add event handlers for typo features */
    I(".avatar-customizer .container", "pointerdown", () => {
        Zn(typo.createFakeLobbyData());
    });
    /* TYPOEND */
    var Ut = null;

    function Bt(e, t, n, a) {
        var o = Xe.getBoundingClientRect(),
            e = Math.floor((e - o.left) / o.width * Xe.width),
            o = Math.floor((t - o.top) / o.height * Xe.height);
        a ? (rt = n, ot[0] = at[0] = e, ot[1] = at[1] = o) : (ot[0] = at[0], ot[1] = at[1], rt = n, at[0] = e, at[1] = o)
    }
    I(Xe, "touchstart", function (e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Ut && (Ut = e[0].identitfier, Gt(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), I(Xe, "touchend touchcancel", function (e) {
        e.preventDefault(), jt(gt)
    }), I(Xe, "touchmove", function (e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == Ut) {
                _t(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    });
    var Ft = 0;

    function _t(e, t, n, a) {
        Bt(e, t, a = !m.pressureSensitivity ? -1 : a, n), Vt(!1)
    }

    function Gt(e, t, n, a, o) {
        Ke.length, gt = e, Bt(t, n, o, a), Vt(!0)
    }

    function jt(e) {
        -1 == e || 0 != e && 2 != e || gt != e || (Ft = Ke.length, nt.push(Ft), Ut = null, gt = -1)
    }

    function Vt(e) {
        if (Cn.id == h && bn == Sn && -1 != gt) {
            var t = 0 == gt ? ut : ht,
                n = null;
            if (e && (dt == We && (o = t, r = at[0], i = at[1], n = [Re, o, r, i]), dt == Ne)) {
                var a = function (e, t) {
                    for (var n = (t = Ze.getImageData(e, t, 1, 1)).data[0], a = t.data[1], o = t.data[2], r = 0; r < ft.length; r++) {
                        var i = ft[r],
                            l = i[0] - n,
                            s = i[1] - a,
                            i = i[2] - o;
                        if (0 == l && 0 == s && 0 == i) return r
                    }
                    /* TYPOMOD
                                         desc: if color is not in array, convert to custom color */
                    r = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
                    /* TYPOEND */
                    return r
                }(at[0], at[1]);
                return (0 == gt ? wt : Ct)(a), void bt(ct)
            }
            dt == Te && (e = pt, 0 <= rt && (e = (pt - Oe) * Nt(rt, 0, 1) + Oe), o = t, r = e, i = ot[0], a = ot[1], t = at[0], e = at[1], n = [Ie, o, r, i, a, t, e]), null != n && Rt(n)
        }
        var o, r, i
    }
    setInterval(() => {
        var e, t;
        yn && Cn.id == h && bn == Sn && 0 < Ke.length - Je && (t = Ke.slice(Je, e = Je + 8), yn.emit("data", {
            id: Ca,
            data: t
        }), Je = Math.min(e, Ke.length))
    }, 50), setInterval(function () {
        yn && Cn.id == h && bn != Sn && Qe < Ke.length && (Dt(Tt(Ke[Qe])), Qe++)
    }, 3);
    var Xt = c.querySelector("#game-canvas .overlay"),
        Zt = c.querySelector("#game-canvas .overlay-content"),
        Kt = c.querySelector("#game-canvas .overlay-content .text"),
        Jt = c.querySelector("#game-canvas .overlay-content .words"),
        Qt = c.querySelector("#game-canvas .overlay-content .reveal"),
        en = c.querySelector("#game-canvas .overlay-content .result"),
        tn = -100,
        nn = 0,
        an = void 0;

    function on(e, r, i) {
        let l = tn,
            s = nn,
            c = e.top - l,
            d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001) i && i();
        else {
            let a = void 0,
                o = 0;
            an = u.requestAnimationFrame(function e(t) {
                null == a && (a = t);
                var n = t - a;
                a = t, o = Math.min(o + n, r);
                t = o / r, n = (n = t) < .5 ? .5 * function (e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function (e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2), t = t * t * (3 - 2 * t);
                tn = l + c * n, nn = s + d * t, Zt.style.top = tn + "%", Xt.style.opacity = nn, o == r ? i && i() : an = u.requestAnimationFrame(e)
            })
        }
    }

    function rn(e) {
        e.classList.add("show")
    }

    function ln(l) {
        switch (! function () {
            for (var e = 0; e < Zt.children.length; e++) Zt.children[e].classList.remove("show")
        }(), l.id) {
            case w:
                rn(Kt), Kt.textContent = $e("Round $", l.data + 1);
                break;
            case k:
                rn(Kt), Kt.textContent = $e("Waiting for players...");
                break;
            case b:
                rn(Kt), Kt.textContent = $e("Game starting in a few seconds...");
                break;
            case q:
                rn(Qt), Qt.querySelector("p span.word").textContent = l.data.word, Qt.querySelector(".reason").textContent = function (e) {
                    switch (e) {
                        case y:
                            return $e("Everyone guessed the word!");
                        case S:
                            return $e("The drawer left the game!");
                        case v:
                            return $e("Time is up!");
                        default:
                            return "Error!"
                    }
                }(l.data.reason);
                var e = Qt.querySelector(".player-container");
                N(e);
                for (var t = [], n = 0; n < l.data.scores.length; n += 3) {
                    var a = l.data.scores[n + 0],
                        o = (l.data.scores[n + 1], l.data.scores[n + 2]);
                    (s = Da(a)) && t.push({
                        name: s.name,
                        score: o
                    })
                }
                t.sort(function (e, t) {
                    return t.score - e.score
                });
                for (n = 0; n < t.length; n++) {
                    var r = R("player"),
                        s = t[n];
                    r.appendChild(R("name", s.name));
                    var c = R("score", (0 < s.score ? "+" : "") + s.score);
                    s.score <= 0 && c.classList.add("zero"), r.appendChild(c), e.appendChild(r)
                }
                break;
            case x:
                rn(en);
                let i = [en.querySelector(".podest-1"), en.querySelector(".podest-2"), en.querySelector(".podest-3"), en.querySelector(".ranks")];
                for (let e = 0; e < 4; e++) N(i[e]);
                if (0 < l.data.length) {
                    let r = [
                        [],
                        [],
                        [],
                        []
                    ];
                    for (let e = 0; e < l.data.length; e++) {
                        var d = {
                            player: Da(l.data[e][0]),
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
                            e.appendChild(R("rank-place", "#" + (o + 1))), e.appendChild(R("rank-name", u)), e.appendChild(R("rank-score", $e("$ points", h)));
                            let n = R("avatar-container");
                            e.appendChild(n), 0 == o && n.appendChild(R("trophy"));
                            for (let t = 0; t < a.length; t++) {
                                let e = W(a[t].player.avatar, 96, 0 == o);
                                e.style.width = "96px", e.style.height = "96px", e.style.left = 16 * -(a.length - 1) + 32 * t + "px", 0 == o && (e.classList.add("winner"), e.style.animationDelay = -2.35 * t + "s"), n.appendChild(e)
                            }
                        }
                    }
                    var f = Math.min(5, r[3].length);
                    for (let n = 0; n < f; n++) {
                        var p = r[3][n];
                        let e = R("rank"),
                            t = W(p.player.avatar, 48, !1);
                        t.style.width = "48px", t.style.height = "48px", e.appendChild(t), e.appendChild(R("rank-name", "#" + (p.rank + 1) + " " + p.player.name)), e.appendChild(R("rank-score", $e("$ points", p.player.score))), i[3].appendChild(e)
                    }
                    0 < r[0].length ? (m = r[0].map(function (e) {
                        return e.player.name
                    }).join(", "), en.querySelector(".winner-name").textContent = 0 < r[0].length ? m : "<user left>", en.querySelector(".winner-text").textContent = " " + (1 == r[0].length ? $e("is the winner!") : $e("are the winners!"))) : (en.querySelector(".winner-name").textContent = "", en.querySelector(".winner-text").textContent = $e("Nobody won!"))
                } else en.querySelector(".winner-name").textContent = "", en.querySelector(".winner-text").textContent = $e("Nobody won!");
                break;
            case C:
                if (l.data.words)
                    if (rn(Kt), rn(Jt), N(Jt), wn[M.WORDMODE] == L.COMBINATION) {
                        Kt.textContent = $e("Choose the first word");
                        let a = l.data.words.length / 2,
                            o = [],
                            r = [],
                            i = 0;
                        for (let n = 0; n < a; n++) {
                            let e = R("word", l.data.words[n]);
                            e.index = n;
                            let t = R("word", l.data.words[n + a]);
                            t.index = n, t.style.display = "none", t.style.animationDelay = .03 * n + "s", o.push(e), r.push(t), I(e, "click", function () {
                                i = this.index;
                                for (let e = 0; e < a; e++) o[e].style.display = "none", r[e].style.display = "";
                                Kt.textContent = $e("Choose the second word")
                            }), I(t, "click", function () {
                                ra([i, this.index])
                            }), Jt.appendChild(e), Jt.appendChild(t)
                        }
                    } else {
                        Kt.textContent = $e("Choose a word");
                        for (n = 0; n < l.data.words.length; n++) {
                            var g = R("word", l.data.words[n]);
                            g.index = n, I(g, "click", function () {
                                ra(this.index)
                            }), Jt.appendChild(g)
                        }
                    }
                else {
                    rn(Kt);
                    var m = (s = Da(l.data.id)) ? s.name : $e("User");
                    Kt.textContent = $e("$ is choosing a word!", m)
                }
        }
    }
    const sn = 0,
        cn = 1,
        dn = 2,
        un = 3,
        hn = 4,
        fn = 5,
        pn = 6;

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
    var mn = function () {
        this.context = null, this.sounds = new Map, u.addEventListener("load", this.load.bind(this), !1)
    };
    mn.prototype.addSound = function (e, t) {
        this.sounds.set(e, new gn(this, t))
    }, mn.prototype.loadSounds = function () {
        this.addSound(sn, "/audio/roundStart.ogg"), this.addSound(cn, "/audio/roundEndSuccess.ogg"), this.addSound(dn, "/audio/roundEndFailure.ogg"), this.addSound(un, "/audio/join.ogg"), this.addSound(hn, "/audio/leave.ogg"), this.addSound(fn, "/audio/playerGuessed.ogg"), this.addSound(pn, "/audio/tick.ogg")
    }, mn.prototype.playSound = function (e) {
        var t, n;
        null != this.context && ("running" == this.context.state ? null == this.context || m.audioMute || !this.sounds.has(e) || (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.context.destination), n.start(0)) : this.context.resume().then(() => {
            this.playSound(e)
        }))
    }, mn.prototype.load = function () {
        try {
            u.AudioContext = u.AudioContext || u.webkitAudioContext, this.context = new AudioContext
        } catch (e) {
            return console.log("Error creating AudioContext."), void (this.context = null)
        }
        this.loadSounds()
    };
    k;
    var yn, vn = [],
        Sn = 0,
        kn = -1,
        bn = -1,
        wn = [],
        Cn = {
            id: -1,
            time: 0,
            data: 0
        },
        qn = -1,
        xn = 0,
        Mn = void 0,
        Ln = new mn,
        An = void 0,
        $n = !1,
        Dn = !1,
        En = c.querySelector("#game-room"),
        In = c.querySelector("#game-players"),
        Rn = c.querySelector("#game-board"),
        Tn = c.querySelector("#game-info"),
        Nn = In.querySelector(".list"),
        Wn = In.querySelector(".footer"),
        On = c.querySelector("#game-round"),
        zn = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")],
        Pn = c.querySelector("#home .container-name-lang input"),
        Yn = c.querySelector("#home .container-name-lang select"),
        Hn = c.querySelector("#home .panel .button-play"),
        e = c.querySelector("#home .panel .button-create"),
        Ht = c.querySelector("#home .panel .button-rooms");

    function Un(e) {
        $n = e, c.querySelector("#load").style.display = e ? "block" : "none"
    }

    function Bn(e, t, n, a) {
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
                    a && Q(B, $e("Servers are currently undergoing maintenance!") + "\n\r" + $e("Please try again later!"));
                    break;
                default:
                    a && Q(B, $e("An unknown error occurred ('$')", e) + "\n\r" + $e("Please try again later!"))
            }
            n({
                success: !1,
                error: e
            })
        }, (t = new XMLHttpRequest).onreadystatechange = function () {
            4 == this.readyState && r(this.status, this.response)
        }, t.open("POST", o, !0), t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), t.send(e)
    }
    var Fn = null;

    function _n(t) {
        let n = !1;
        if (u.localStorageAvailable) {
            let e = o.getItem("lastAd"),
                t = new Date;
            var a;
            o.setItem("lastAd", t.toString()), null == e ? e = t : (e = new Date(Date.parse(e)), a = Math.abs(e - t), n = 1 <= a / 1e3 / 60)
        }
        if (n) try {
            aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (Fn = t, aiptag.cmd.player.push(function () {
                adplayer.startPreRoll()
            })) : t()
        } catch (e) {
            console.log(e), t()
        } else t()
    }

    function Gn(e, t) {
        Ln.context.resume(), yn && oa();
        let n = 0;
        (yn = a(e, {
            closeOnBeforeunload: !1
        })).on("connect", function () {
            /* TYPOMOD
                         desc: disconnect socket & leave lobby */
            document.addEventListener('socketEmit', event => yn.emit('data', { id: event.detail.id, data: event.detail.data }));
            typo.disconnect = () => {
                if (yn) {
                    yn.typoDisconnect = true;
                    yn.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    yn.off("data");
                    yn.reconnect = false;
                    yn.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            /* TYPOEND */
            yn.on("joinerr", function (e) {
                oa(), Q(B, function (e) {
                    switch (e) {
                        case 1:
                            return $e("Room not found!");
                        case 2:
                            return $e("Room is full!");
                        case 3:
                            return $e("You are on a kick cooldown!");
                        case 4:
                            return $e("You are banned from this room!");
                        default:
                            return $e("An unknown error ('$') occured!", e)
                    }
                }(e))
            }), yn.on("data", $a);
            var e = Pn.value.split("#"),
                e = {
                    join: t,
                    name: e[0],
                    lang: Yn.value,
                    code: e[1],
                    avatar: m.avatar
                };
            yn.emit("login", e)
        }), yn.on("reason", function (e) {
            n = e
        }), yn.on("disconnect", function () {
            /* TYPOMOD
                             DESC: no msg if disconnect intentionally */
            if (!yn.typoDisconnect)
                /*TYPOEND*/
                switch (n) {
                    case p:
                        Q(F, $e("You have been kicked!"));
                        break;
                    case g:
                        Q(F, $e("You have been banned!"));
                        break;
                    default:
                        Q(F, $e("Connection lost!"))
                }
            oa()
        }), yn.on("connect_error", e => {
            oa(), Q(B, e.message)
        })
    }

    function jn(e) {
        var t;
        $n || (t = "" != e ? "id=" + e : "lang=" + Yn.value, re(), Un(!0), _n(function () {
            Bn(location.origin + ":3000/play", t, function (e) {
                Un(!1), e.success && Gn((e = e.data.split(","))[0], e[1])
            }, !0)
        }))
    }

    function Vn(e) {
        let n = [],
            a = e.split(",");
        var t = parseInt(a.shift());
        if (0 < t) {
            var o = a.length / t;
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

    function Xn() {
        var e = K[_].querySelector(".filter select.lang").value;
        Bn(location.origin + ":3000/rooms", "lang=" + e, function (e) {
            e.success && ae(Vn(e.data))
        })
    }

    function Zn(e) {
        var t;
        Ln.playSound(un), bt(Te, !0), vt(12), wt(2), Ct(0), Et(!0), N(se), c.querySelector("#home").style.display = "none", c.querySelector("#game").style.display = "flex", Sn = e.me, qn = e.type, Mn = e.id, c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, wn = t, Kn(), N(Nn), vn = [];
        for (var n = 0; n < e.users.length; n++) Ea(e.users[n], !1);
        Wa(), za(), Qn(e.round), ca(e.owner), ta(e.state, !0), Dn || ((adsbygoogle = u.adsbygoogle || []).push({}), (adsbygoogle = u.adsbygoogle || []).push({}), Dn = !0)
    }

    function Kn() {
        Tn.querySelector(".text .name").textContent = wn[M.NAME], Tn.querySelector(".text .type").textContent = $e(0 == qn ? "Public" : "Custom"), c.querySelector("#game-room .lobby-name").textContent = wn[M.NAME], Qn(xn);
        for (var e, t = 0; t < Ha.length; t++) {
            var n = Ha[t];
            n.index && (n = wn[(e = n).index], "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }

    function Jn(e, t, n) {
        wn[e] = t, n && yn && yn.emit("data", {
            id: ma,
            data: {
                id: e,
                val: t
            }
        }), Kn()
    }

    function Qn(e) {
        xn = e, On.textContent = $e("Round $ of $", [xn + 1, wn[M.ROUNDS]])
    }

    function ea() {
        for (let e = 0; e < vn.length; e++) vn[e].score = 0;
        for (let e = 0; e < vn.length; e++) Pa(vn[e], !1), Ya(vn[e], !1), Oa(vn[e])
    }

    function ta(a, e) {
        var t, n;
        if (t = Cn = a, null != an && (u.cancelAnimationFrame(an), an = void 0), t.id == h || t.id == f ? on({
            top: -100,
            opacity: 0
        }, 600, function () {
            Xt.classList.remove("show")
        }) : Xt.classList.contains("show") ? on({
            top: -100,
            opacity: 1
        }, 600, function () {
            ln(t), on({
                top: 0,
                opacity: 1
            }, 600)
        }) : (Xt.classList.add("show"), ln(t), on({
            top: 0,
            opacity: 1
        }, 600)), n = a.time, ja(), Ga = n, Fa.textContent = Ga, _a = setInterval(function () {
            Ga = Math.max(0, Ga - 1), Fa.textContent = Ga;
            var e = -1;
            Cn.id == h && (e = Ua), Cn.id == C && (e = Ba), Fa.style.animationName = Ga < e ? Ga % 2 == 0 ? "rot_left" : "rot_right" : "none", Ga < e && Ln.playSound(pn), Ga <= 0 && ja()
        }, 1e3), He.classList.add("hidden"), st(), aa(!1), a.id == f ? (ea(), En.style.display = "flex", Rn.style.display = "none", In.classList.add("room"), Tn.classList.add("room")) : (En.style.display = "none", Rn.style.display = "", In.classList.remove("room"), Tn.classList.remove("room")), a.id == w && (Qn(a.data), 0 == a.data && ea()), a.id == q) {
            Sn != bn && sa(a.data.word);
            for (var o = 0; o < a.data.scores.length; o += 3) {
                var r = a.data.scores[o + 0],
                    i = a.data.scores[o + 1],
                    r = (a.data.scores[o + 2], Da(r));
                r && (r.score = i)
            }
            za();
            for (var l = !0, o = 0; o < vn.length; o++)
                if (vn[o].guessed) {
                    l = !1;
                    break
                } l ? Ln.playSound(dn) : Ln.playSound(cn), be($e("The word was '$'", a.data.word), "", ke(ge), !0)
                /* TYPOMOD
                             desc: log finished drawing */
                ; document.dispatchEvent(new CustomEvent("drawingFinished", { detail: a.data.word }));
            /* TYPOEND */
        } else a.id != h && (zn[0].textContent = $e("WAITING"), zn[0].classList.add("waiting"), zn[1].style.display = "none", zn[2].style.display = "none");
        if (a.id == h) {
            if (bn = a.data.id, Ln.playSound(sn), Et(!0), a.data.drawCommands && (Ke = a.data.drawCommands), be($e("$ is drawing now!", Da(bn).name), "", ke(pe), !0), !e)
                for (o = 0; o < vn.length; o++) Pa(vn[o], !1);
            zn[0].classList.remove("waiting"), bn == Sn ? (e = a.data.word, zn[0].textContent = $e("DRAW THIS"), zn[1].style.display = "", zn[2].style.display = "none", zn[1].textContent = e, He.classList.remove("hidden"), st()) : (aa(!0), ia(a.data.word, !1), la(a.data.hints))
        } else {
            bn = -1;
            for (o = 0; o < vn.length; o++) Pa(vn[o], !1)
        }
        if (a.id == x && 0 < a.data.length) {
            let t = [],
                n = 0;
            for (let e = 0; e < a.data.length; e++) {
                var s = a.data[e][0],
                    c = a.data[e][1],
                    s = Da(s);
                s && 0 == c && (n = s.score, t.push(s.name))
            }
            1 == t.length ? be($e("$ won with a score of $!", [t[0], n]), "", ke(ye), !0) : 1 < t.length && be($e("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", ke(ye), !0)
        }
        for (o = 0; o < vn.length; o++) Ya(vn[o], vn[o].id == bn);
        Wa()
    }

    function na(e) {
        yn && yn.connected && Cn.id == h && (yn.emit("data", {
            id: fa,
            data: e
        }), aa(!1))
    }

    function aa(e) {
        c.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function oa() {
        yn && yn.close(), yn = void 0, Et(), ja(), vn = [], wn = [], Cn = {
            id: bn = kn = -1,
            time: Sn = 0,
            data: 0
        }, c.querySelector("#home").style.display = "", c.querySelector("#game").style.display = "none"
    }

    function ra(e) {
        yn && yn.connected && Cn.id == C && yn.emit("data", {
            id: wa,
            data: e
        })
    }

    function ia(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++) n += t[e];
        var a = !e && 1 == wn[M.WORDMODE];
        a && (n = 3), zn[0].textContent = $e(a ? "WORD HIDDEN" : "GUESS THIS"), zn[1].style.display = "none", zn[2].style.display = "", N(zn[2]), zn[2].hints = [];
        for (var o = 0; o < n; o++) zn[2].hints[o] = R("hint", a ? "?" : "_"), zn[2].appendChild(zn[2].hints[o]);
        a || zn[2].appendChild(R("word-length", t.join(" ")))
    }

    function la(e) {
        for (var t = zn[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
                o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function sa(e) {
        (!zn[2].hints || zn[2].hints.length < e.length) && ia([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        la(t)
    }

    function ca(e) {
        kn = e;
        for (var t = 0; t < vn.length; t++) z(vn[t].element, vn[t].id == kn), Ta(vn[t], 0, vn[t].id == kn);
        ! function (t) {
            for (var n = 0; n < Ha.length; n++) {
                let e = Ha[n];
                e.element.disabled = t
            }
        }(Sn != kn);
        e = Da(kn);
        e && be($e("$ is now the room owner!", e.name), "", ke(ye), !0)
    }
    adplayer = null, aiptag.cmd.player.push(function () {
        console.log("ad player loaded"), adplayer = new aipPlayer({
            AD_WIDTH: 960,
            AD_HEIGHT: 540,
            AD_FULLSCREEN: !1,
            AD_CENTERPLAYER: !0,
            LOADING_TEXT: "loading advertisement",
            PREROLL_ELEM: function () {
                return c.getElementById("preroll")
            },
            AIP_COMPLETE: function (e) {
                Fn()
            },
            AIP_REMOVE: function () { }
        })
    }), I(K[_].querySelector(".filter select.lang"), "change", Xn), I(K[_].querySelector("button.refresh"), "click", Xn);
    const da = 1,
        ua = 2,
        ha = 5,
        fa = 8,
        pa = 10,
        ga = 11,
        ma = 12,
        ya = 13,
        va = 14,
        Sa = 15,
        ka = 16,
        ba = 17,
        wa = 18,
        Ca = 19,
        qa = 20,
        xa = 21;
    const Ma = 30,
        La = 31,
        Aa = 32;

    function $a(e) {
        var t = e.id,
            n = e.data;
        switch (t) {
            case pa:
                /* TYPOMOD
                                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                /* TYPOEND*/
                Zn(n);
                break;
            case ga:
                ta(n);
                break;
            case ma:
                Jn(n.id, n.val, !1);
                break;
            case ya:
                la(n);
                break;
            case va:
                Ga = n;
                break;
            case da:
                be($e("$ joined the room!", Ea(n, !0).name), "", ke(ge), !0), Ln.playSound(un);
                break;
            case ua:
                var a = function (e) {
                    for (var t = 0; t < vn.length; t++) {
                        var n = vn[t];
                        if (n.id == e) return vn.splice(t, 1), n.element.remove(), za(), Wa(), n
                    }
                    return
                }(n.id);
                a && (be(function (e, t) {
                    switch (e) {
                        default:
                            return $e("$ left the room!", t);
                        case p:
                            return $e("$ has been kicked!", t);
                        case g:
                            return $e("$ has been banned!", t)
                    }
                }(n.reason, a.name), "", ke(me), !0), Ln.playSound(hn));
                break;
            case ha:
                var a = Da(n[0]),
                    o = Da(n[1]),
                    r = n[2],
                    i = n[3];
                a && o && be($e("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", ke(fe), !0);
                break;
            case Sa:
                var l = Da(n.id);
                if (l) {
                    let e = be($e("$ guessed the word!", l.name), "", ke(ge), !0);
                    e.classList.add("guessed"), Pa(l, !0), Ln.playSound(fn), n.id == Sn && sa(n.word)
                }
                break;
            case fa:
                o = Da(n.id);
                o && (r = o, i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (l = R("icon")).style.backgroundImage = "url(/img/" + i + ")", Ra(r, l), n.vote ? be($e("$ liked the drawing!", o.name), "", ke(ge), !0) : be($e("$ disliked the drawing!", o.name), "", ke(me), !0));
                break;
            case ba:
                ca(n);
                break;
            case ka:
                be($e("$ is close!", n), "", ke(fe), !0);
                break;
            case Ma:
                Ia(Da(n.id), n.msg);
                break;
            case Aa:
                be($e("Spam detected! You're sending messages too quickly."), "", ke(me), !0);
                break;
            case La:
                switch (n.id) {
                    case 0:
                        be($e("You need at least 2 players to start the game!"), "", ke(me), !0);
                        break;
                    case 100:
                        be($e("Server restarting in about $ seconds!", n.data), "", ke(me), !0)
                }
                break;
            case Ca:
                for (var s = 0; s < n.length; s++) Rt(n[s]);
                break;
            case qa:
                Et(!0);
                break;
            case xa:
                Lt(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function Da(e) {
        for (var t = 0; t < vn.length; t++) {
            var n = vn[t];
            if (n.id == e) return n
        }
    }

    function Ea(e, t) {
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
            element: R("player"),
            bubble: void 0
        };
        vn.push(n), m.filterChat && n.id != Sn && ue(n.name.slice()) != n.name && (n.name = "user");
        var a = n.id == Sn ? $e("$ (You)", n.name) : n.name,
            o = R("info"),
            e = R("name", a);
        n.id == Sn && e.classList.add("me"), o.appendChild(e), o.appendChild(R("rank", "#" + n.rank)), o.appendChild(R("score", $e("$ points", n.score))), n.element.appendChild(o);
        var r = W(n.avatar);
        /* TYPOMOD
                 desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id);
        /* TYPOEND */
        n.element.drawing = R("drawing"), r.appendChild(n.element.drawing), n.element.appendChild(r), Nn.appendChild(n.element), I(n.element, "click", function () {
            An = n, Q(U, n)
        });
        4 == (4 & n.flags) && (n.interval = setInterval(function () {
            n.avatar[0] = (n.avatar[0] + 1) % d[0], n.avatar[1] = (n.avatar[1] + 1) % d[1], n.avatar[2] = (n.avatar[2] + 1) % d[2], O(r, n.avatar)
        }, 250));
        a = R("icons"), e = R("icon owner"), o = R("icon muted");
        return a.appendChild(e), a.appendChild(o), n.element.appendChild(a), n.element.icons = [e, o], Pa(n, n.guessed), t && Wa(), n
    }

    function Ia(e, t) {
        var n;
        e.muted || (n = e.id == bn || e.guessed, Sn != bn && !Da(Sn).guessed && n || (m.filterChat && (t = ue(t)), Ra(e, R("text", t)), be(e.name, t, ke(n ? ve : he))))
    }

    function Ra(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = R("bubble"),
            a = R("content");
        a.appendChild(t), n.appendChild(R("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function () {
            e.bubble.remove(), e.bubble = void 0
        }, 1500)
    }

    function Ta(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Na = void 0;

    function Wa() {
        var e = Cn.id == f,
            t = e ? 112 : 48,
            n = Math.max(t, Nn.clientHeight);
        let a = Math.floor(n / t);
        e && (a *= 4);
        t = Math.ceil(vn.length / a);
        for (let e = 0; e < vn.length; e++) vn[e].page = Math.floor(e / a);
        e = c.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = vn.length, e[1].textContent = wn[M.SLOTS], null == Na ? Na = P(Wn, t, [In], function (e, n, t) {
            let a = [];
            for (let t = 0; t < vn.length; t++) {
                let e = vn[t];
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
        }) : Y(Na, t), Na.element.style.display = 1 < t ? "" : "none"
    }

    function Oa(t) {
        let n = 1;
        for (let e = 0; e < vn.length; e++) {
            var a = vn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n, t.element.querySelector(".score").textContent = $e("$ points", t.score);
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n, e.classList.remove("first"), e.classList.remove("second"), e.classList.remove("third"), 1 == n && e.classList.add("first"), 2 == n && e.classList.add("second"), 3 == n && e.classList.add("third")
    }

    function za() {
        for (var e = 0; e < vn.length; e++) Oa(vn[e])
    }

    function Pa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }

    function Ya(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ha = [];
    ! function () {
        for (var e = En.querySelectorAll('*[id^="item-"]'), n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            Ha.push(t), I(t.element, "change", function () {
                var e = "checkbox" == this.type ? this.checked : this.value;
                null != t.index && Jn(t.index, e, !0)
            })
        }
    }();
    const Ua = 10,
        Ba = 4;
    var Fa = c.querySelector("#game-clock"),
        _a = null,
        Ga = 0;

    function ja() {
        _a && (clearInterval(_a), _a = null)
    }
    var Va, Xa, Za, Ka, Ja, Qa, mn = c.querySelector("#tutorial"),
        eo = mn.querySelectorAll(".page"),
        to = P(mn, eo.length, [mn.querySelector(".pages")], function (e, t, n) {
            n && clearInterval(no);
            for (let e = 0; e < eo.length; e++) eo[e].classList.remove("active");
            eo[t].classList.add("active")
        }),
        no = setInterval(function () {
            to.selected < 4 ? H(to, to.selected + 1, !1) : H(to, 0, !1)
        }, 3500),
        ao = c.querySelector("#setting-bar"),
        oo = c.querySelector("#audio"),
        ro = c.querySelector("#lightbulb");

    function io() {
        ao.classList.remove("open")
    }

    function lo(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }

    function so() {
        oo.dataset.tooltip = m.audioMute ? "Unmute audio" : "Mute audio", ro.dataset.tooltip = m.dark ? "Turn the lights on" : "Turn the lights off", we && (we.querySelector(".tooltip-content").textContent = $e(Ce.dataset.tooltip))
    }

    function co() {
        be($e("Copied room link to clipboard!"), "", ke(fe), !0),
            function (e) {
                if (navigator.clipboard) navigator.clipboard.writeText(e).then(function () {
                    console.log("Async: Copying to clipboard was successful!")
                }, function (e) {
                    console.error("Async: Could not copy text: ", e)
                });
                else {
                    var t = c.createElement("textarea");
                    t.value = e, t.style.top = "0", t.style.left = "0", t.style.position = "fixed", c.body.appendChild(t), t.select(), t.focus();
                    try {
                        var n = c.execCommand("copy");
                        console.log("Copying link was " + (n ? "successful" : "unsuccessful"))
                    } catch (e) {
                        console.log("Unable to copy link " + e)
                    }
                    c.body.removeChild(t)
                }
            }("https://skribbl.io/?" + Mn)
    }

    function uo(e) {
        Qa.parts[e].classList.remove("bounce"), Qa.parts[e].offsetWidth, Qa.parts[e].classList.add("bounce")
    }
    I(ao.querySelector(".icon"), "click", function () {
        lo(oo, m.audioMute), lo(ro, m.dark), so(), ao.classList.contains("open") ? io() : ao.classList.add("open")
    }), I("#audio", "click", function (e) {
        m.audioMute = !m.audioMute, lo(oo, m.audioMute), so(), D()
    }), I("#lightbulb", "click", function (e) {
        E(!m.dark), lo(ro, m.dark), so(), D()
    }), I("#hotkeys", "click", function (e) {
        io(), Q(j)
    }), u.onbeforeunload = function (e) {
        return yn ? $e("Are you sure you want to leave?") : void 0
    }, u.onunload = function () {
        yn && oa()
    }, I([c, Xe], "mousedown touchstart", function (e) {
        ao.contains(e.target) || io(), e.target
    }), I(u, "resize", Wa), I([Pn, Yn], "change", D), I(Hn, "click", function () {
        var e, t, n;
        jn((e = u.location.href, n = "", e = e.split("?"), n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
    }), I(Ht, "click", function () {
        $n || (re(), Un(!0), K[_].querySelector(".filter select.lang").value = Yn.value, Bn(location.origin + ":3000/rooms", "lang=" + Yn.value, function (e) {
            Un(!1), e.success && Q(_, Vn(e.data))
        }, !0))
    }), I(e, "click", function () {
        $n || (re(), Un(!0), _n(function () {
            Bn(location.origin + ":3000/create", "lang=" + Yn.value, function (e) {
                Un(!1), e.success && Gn((e = e.data.split(","))[0], e[1])
            }, !0)
        }))
    }), I(c.querySelector("#game-rate .like"), "click", function () {
        na(1)
    }), I(c.querySelector("#game-rate .dislike"), "click", function () {
        na(0)
    }), I(Tn, "click", co), I(c.querySelector("#start-game"), "click", function () {
        if (yn) {
            let t = c.querySelector("#item-settings-customwords").value.split(","),
                e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++) t[e] = t[e].trim();
                e = t.join(",")
            }
            yn.emit("data", {
                id: 22,
                data: e
            })
        }
    }), I(c.querySelector("#copy-invite"), "click", co), I(K[U].querySelector("button.kick"), "click", function () {
        re(), null != An && An.id != Sn && Sn == kn && yn && yn.emit("data", {
            id: 3,
            data: An.id
        })
    }), I(K[U].querySelector("button.ban"), "click", function () {
        re(), null != An && An.id != Sn && Sn == kn && yn && yn.emit("data", {
            id: 4,
            data: An.id
        })
    }), I(K[U].querySelector("button.votekick"), "click", function () {
        re(), null != An && An.id != Sn && yn && (An.id == kn ? be($e("You can not votekick the lobby owner!"), "", ke(me), !0) : yn.emit("data", {
            id: ha,
            data: An.id
        }))
    }), I(K[U].querySelector("button.mute"), "click", function () {
        null != An && An.id != Sn && (An.muted = !An.muted, Ta(An, 1, An.muted), An.muted ? be($e("You muted '$'!", An.name), "", ke(me), !0) : be($e("You unmuted '$'!", An.name), "", ke(me), !0), yn && yn.emit("data", {
            id: 7,
            data: An.id
        }), J(An.muted))
    }), I(K[U].querySelector("button.report"), "click", function () {
        K[U].querySelector(".buttons").style.display = "none", K[U].querySelector(".report-menu").style.display = "";
        let t = K[U].querySelectorAll(".report-menu input");
        for (let e = 0; e < t.length; e++) t[e].checked = !1
    }), I(K[U].querySelector("button#report-send"), "click", function () {
        let e = 0;
        K[U].querySelector("#report-reason-toxic").checked && (e |= 1), K[U].querySelector("#report-reason-spam").checked && (e |= 2), K[U].querySelector("#report-reason-bot").checked && (e |= 4), 0 < e && (null != An && An.id != Sn && (An.reported = !0, yn && yn.emit("data", {
            id: 6,
            data: {
                id: An.id,
                reasons: e
            }
        }), be($e("Your report for '$' has been sent!", An.name), "", ke(fe), !0)), re())
    }), I(K[j].querySelector("#select-display-language"), "change", function (e) {
        m.displayLang = e.target.value, D(), Ee()
    }), I(K[j].querySelector("#select-filter-chat"), "change", function (e) {
        m.filterChat = e.target.value, D()
    }), I(K[j].querySelector("#select-pressure-sensitivity"), "change", function (e) {
        m.pressureSensitivity = e.target.value, D()
    }), I(K[j].querySelector("button.reset"), "click", function (e) {
        for (let e = 0; e < je.length; e++) Ge(je[e], t[je[e].id]);
        for (let e = 0; e < Ve.length; e++) Ge(Ve[e], n[Ve[e].id]);
        D()
    }), I(ie, "submit", function (e) {
        return e.preventDefault(), le.value && (yn && yn.connected ? yn.emit("data", {
            id: Ma,
            data: le.value
        }) : Ia(Da(Sn), le.value)), ie.reset(), !1
    }),
        function () {
            if (!u.localStorageAvailable) {
                var e = !1;
                if (void 0 !== o) try {
                    o.setItem("feature_test", "yes"), "yes" === o.getItem("feature_test") && (o.removeItem("feature_test"), e = !0)
                } catch (e) { }
                u.localStorageAvailable = e
            }
            u.localStorageAvailable ? (Pn.value = A("name", ""), Yn.value = function (e) {
                for (var t = c.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                    if (e.startsWith(t[n].value)) return t[n].value;
                return "en"
            }(A("lang", navigator.language)), m.displayLang = A("displaylang", "en"), m.audioMute = 1 == parseInt(A("audio", 0)) ? 1 : 0, m.filterChat = 1 == parseInt(A("filter", 1)) ? 1 : 0, m.pressureSensitivity = 1 == parseInt(A("pressure", 1)) ? 1 : 0, m.hotkeysTools = $("tools", m.hotkeysTools), m.hotkeysActions = $("actions", m.hotkeysActions), function () {
                for (let e = 0; e < je.length; e++) Ge(je[e], m.hotkeysTools[je[e].id]);
                for (let e = 0; e < Ve.length; e++) Ge(Ve[e], m.hotkeysActions[Ve[e].id])
            }(), m.avatar = $("ava", m.avatar), E(1 == parseInt(A("dark", 0)) ? 1 : 0), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
        }(),
        function () {
            var t = c.querySelectorAll("[data-translate]");
            for (let e = 0; e < t.length; e++) {
                var n = t[e];
                De(n, n.dataset.translate)
            }
        }(), Ee(), I(Va = c.querySelectorAll("[data-tooltip]"), "mouseenter", function (e) {
            qe(e.target)
        }), I(Va, "mouseleave", function (e) {
            xe()
        }), Xa = (Ja = c.querySelector("#home .avatar-customizer")).querySelector(".container"), Za = Ja.querySelectorAll(".arrows.left .arrow"), Ka = Ja.querySelectorAll(".arrows.right .arrow"), Ja = Ja.querySelectorAll(".randomize"), (Qa = W(m.avatar, 96)).classList.add("fit"), Xa.appendChild(Qa), I(Za, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --m.avatar[e], m.avatar[e] < 0 && (m.avatar[e] = d[e] - 1), uo(e), O(Qa, m.avatar, 96), D()
        }), I(Ka, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            m.avatar[e] += 1, m.avatar[e] >= d[e] && (m.avatar[e] = 0), uo(e), O(Qa, m.avatar, 96), D()
        }), I(Ja, "click", function () {
            m.avatar[0] = Math.floor(Math.random() * d[0]), m.avatar[1] = Math.floor(Math.random() * d[1]), m.avatar[2] = Math.floor(Math.random() * d[2]), uo(1), uo(2), O(Qa, m.avatar, 96), D()
        }),
        function () {
            var t = Math.round(8 * Math.random());
            let n = c.querySelector("#home .logo-big .avatar-container");
            for (var a = 0; a < 8; a++) {
                let e = [0, 0, 0, -1];
                e[0] = a, e[1] = Math.round(100 * Math.random()) % l, e[2] = Math.round(100 * Math.random()) % s, 1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random()));
                var o = W(e, 48, t == a);
                n.append(o)
            }
        }()
}(window, document, localStorage, io);