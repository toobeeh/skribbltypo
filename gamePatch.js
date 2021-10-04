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
    // TYPOMOD 
    // desc: create re-useable functions
    const typo = {
        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input -> Yn
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> m
            return { id: id, name: name.length != 0 ? name : (Yn.value.split("#")[0] != "" ? Yn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? m.avatar : avatar, score: score, guessed: guessed };
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
                else oe() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
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
                $t(Tt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
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
        r = ["U", "C"];
    var m = {
        avatar: [Math.round(100 * Math.random()) % i, Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % s, -1],
        audioMute: 0,
        dark: 0,
        filterChat: 1,
        pressureSensitivity: 1,
        displayLang: "en",
        hotkeysTools: ["B", "V", "F"],
        hotkeysActions: ["U", "C"],
        chatDeleteQuota: 100
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
        u.localStorageAvailable && (n.setItem("name", Yn.value), n.setItem("lang", Pn.value), n.setItem("displaylang", m.displayLang), n.setItem("audio", 1 == m.audioMute ? 1 : 0), n.setItem("dark", 1 == m.dark ? 1 : 0), n.setItem("filter", 1 == m.filterChat ? 1 : 0), n.setItem("pressure", 1 == m.pressureSensitivity ? 1 : 0), n.setItem("tools", JSON.stringify(m.hotkeysTools)), n.setItem("actions", JSON.stringify(m.hotkeysActions)), n.setItem("ava", JSON.stringify(m.avatar)), console.log("Settings saved."))
    }

    function I(e) {
        /* TYPOMOD 
                 log draw commands */
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        /* TYPOEND */
        m.dark = e ? 1 : 0, c.documentElement.dataset.theme = m.dark ? "dark" : ""
    }

    function E(e, t, n) {
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

    function Y(e, t, n, a) {
        let o = {
            element: R("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element), n.push(o.element), E(n, "DOMMouseScroll wheel", function (e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), H(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), P(o, t), o
    }

    function P(n, e) {
        N(n.element), n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = R("dot");
            e.appendChild(R("inner")), E(e, "click", function () {
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
        for (var t = 0; t < K.length; t++) K[t].style.display = "none";
        switch (K[e].style.display = "flex", e) {
            case B:
                X.textContent = Ae("Something went wrong!"), K[B].querySelector(".message").textContent = a;
                break;
            case F:
                X.textContent = Ae("Disconnected!"), K[F].querySelector(".message").textContent = a;
                break;
            case U: {
                X.textContent = "";
                let e = K[U].querySelector(".buttons");
                e.style.display = a.id == Sn ? "none" : "flex", e.querySelector(".button-pair").style.display = Sn == kn ? "flex" : "none", e.querySelector("button.report").style.display = a.reported ? "none" : "", J(a.muted), K[U].querySelector(".report-menu").style.display = "none";
                let t = _.querySelector(".player");
                N(t);
                let n = W(a.avatar, 96);
                z(n, kn == a.id), n.style.width = "96px", n.style.height = "96px", t.appendChild(n), t.appendChild(R("name", a.id == Sn ? Ae("$ (You)", a.name) : a.name))
            }
                break;
            case j:
                X.textContent = Ae("Rooms"), ae(a);
                break;
            case G:
                X.textContent = wn[M.NAME];
                break;
            case V:
                X.textContent = Ae("Settings"), K[V].querySelector("#select-display-language").value = m.displayLang, K[V].querySelector("#select-filter-chat").value = m.filterChat, K[V].querySelector("#select-pressure-sensitivity").value = m.pressureSensitivity
        }
    }
    K[U] = Z.querySelector(".container-player"), K[B] = Z.querySelector(".container-info"), K[F] = Z.querySelector(".container-info"), K[j] = Z.querySelector(".container-rooms"), K[G] = Z.querySelector(".container-room"), K[V] = Z.querySelector(".container-settings");
    var ee = [],
        te = K[j].querySelector(".rooms"),
        e = K[j].querySelector(".footer"),
        ne = (K[j].querySelector(".dots"), Y(e, 0, [e, te], function (e, n, t) {
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
            n.dataset.type = e.type, t.appendChild(n), t.appendChild(R("name", e.settings[M.NAME])), t.appendChild(R("slots", e.users + "/" + e.settings[M.SLOTS])), t.appendChild(R("round", 0 < e.round ? e.round : Ae("Not started"))), t.appendChild(R("mode", o[e.settings[M.WORDMODE]])), t.appendChild(R("settings", e.settings[M.DRAWTIME] + "s")), te.appendChild(t), ee.push({
                element: t,
                page: 0,
                data: e
            }), E(t, "click", function () {
                jn(e.id)
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
            i || l ? e.page = -1 : (e.page = r, o++, 10 <= o && (r++, o = 0))
        }
        var e = 0 == o && 0 == r;
        K[j].querySelector(".rooms .empty").style.display = e ? "flex" : "none", r = Math.max(1, r), P(ne, r), e = 1 < r, ne.element.style.display = e ? "" : "none"
    }

    function re() {
        Z.style.display = "none"
    }
    E(u, "click", function (e) {
        e.target == Z && re()
    }), E([Z.querySelector(".close"), K[B].querySelector("button.ok")], "click", re), E(K[j].querySelector(".filter select.type"), "change", oe), E(K[j].querySelector(".filter input"), "input", oe);
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
        we = R("tooltip"), we.classList.add(n), we.appendChild(R("tooltip-arrow")), we.appendChild(R("tooltip-content", Ae(t)));
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
            "$" == r ? (a += n[o], o++) : a += r
        }
        return a
    }

    function De(t, n) {
        if ("children" != n) {
            let e = "";
            "text" == n && (e = t.textContent), "placeholder" == n && (e = t.placeholder), 0 < e.length ? $e.push({
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

    function Ie() {
        var n = Me[m.displayLang];
        for (let t = 0; t < $e.length; t++) {
            let e = $e[t];
            var a = Le(n, e.key);
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
    const Ee = 0,
        Re = 1;
    const Te = 0,
        Ne = 1,
        We = 2;
    const Oe = 4,
        ze = 44;
    var Ye, Pe = [4, 12, 20, 28, 36],
        He = c.querySelector("#game-toolbar"),
        Ue = He.querySelectorAll(".tools-container .tools")[0],
        Be = He.querySelectorAll(".tools-container .tools")[1],
        Fe = ((Ye = He.querySelector(".tool")).parentElement.removeChild(Ye), c.querySelector("#game-toolbar .picker .size-picker"));
    c.querySelector("#game-toolbar .picker .color-picker");

    function je(e, t) {
        let n = R("tool clickable");
        n.appendChild(R("icon")), n.appendChild(R("key"));
        var a, o, r, i = (t.isAction ? m.hotkeysActions : m.hotkeysTools)[e];
        let l = t;
        l.id = e, l.element = n, n.toolIndex = e, n.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")", n.querySelector(".key").textContent = i, a = n, o = t.name, r = "N", a.dataset.tooltip = o, a.dataset.tooltipdir = r, E(a, "mouseenter", function (e) {
            qe(e.target)
        }), E(a, "mouseleave", function (e) {
            xe()
        }), t.isAction ? (n.addEventListener("click", function (e) {
            kt(this.toolIndex)
        }), Be.appendChild(n), Ze[e] = l) : (n.addEventListener("click", function (e) {
            bt(this.toolIndex)
        }), Ue.appendChild(n), Ve[e] = l);
        e = R("key", l.name);
        De(e, "text"), l.listing = R("item"), l.listing.appendChild(e);
        let s = c.createElement("input");
        s.value = i, l.listing.appendChild(s), E(s, "keydown", function (e) {
            var t = e.key;
            return Ge(l, t), D(), e.preventDefault(), !1
        }), K[V].querySelector("#hotkey-list").appendChild(l.listing)
    }

    function Ge(e, t) {
        e.isAction ? m.hotkeysActions[e.id] = t : m.hotkeysTools[e.id] = t, e.element.querySelector(".key").textContent = t, e.listing.querySelector("input").value = t
    }
    var Ve = [];
    je(Te, {
        isAction: !1,
        name: "Brush",
        graphic: "pen.gif",
        cursor: 0
    }), je(Ne, {
        isAction: !1,
        name: "Colorpick",
        graphic: "pick.gif",
        cursor: "url(/img/pick_cur.png) 7 36, default"
    }), je(We, {
        isAction: !1,
        name: "Fill",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    });
    var Ze = [];
    je(0, {
        isAction: !0,
        name: "Undo",
        graphic: "undo.gif",
        action: function () {
            {
                var e;
                0 < nt.length && (nt.pop(), 0 < nt.length ? ($t(e = nt[nt.length - 1]), yn && yn.emit("data", {
                    id: Ca,
                    data: e
                })) : Et())
            }
        }
    }), je(1, {
        isAction: !0,
        name: "Clear",
        graphic: "clear.gif",
        action: Et
    });
    var Xe = c.querySelector("#game-canvas canvas"),
        _e = Xe.getContext("2d"),
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
        var t = Ve[dt].cursor;
        if (Cn.id == h && bn == Sn) {
            if (dt == Te) {
                var n, a, o, r = it.width,
                    i = pt;
                if (i <= 0) return;
                lt.clearRect(0, 0, r, r);
                // TYPOMOD
                // desc: cursor with custom color
                let e = ut < 10000 ? ft[ut] : typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));
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
    for (let n = 0; n < Pe.length; n++) {
        let e = R("size clickable"),
            t = R("icon");
        t.style.backgroundPosition = -100 * n + "% 0%", t.style.backgroundSize = 100 * Pe.length + "% 100%", e.appendChild(t), Fe.querySelector(".sizes").appendChild(e), E(e, "click", function (e) {
            ! function (e) {
                e = mt[e];
                St(e.element), vt(e.size)
            }(n)
        }), mt.push({
            id: n,
            size: Pe[n],
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
        St(Ze[e].element), Ze[e].action()
    }

    function bt(e, t) {
        St(Ve[e].element), e == dt && !t || (Ve[ct = dt].element.classList.remove("selected"), Ve[e].element.classList.add("selected"), dt = e, st())
    }

    function wt(e) {
        var t =
            ut > 10000 ? xt(typo.hexToRgb((ut - 10000).toString(16).padStart(6, "0"))) : xt(ft[e]);
        ut = e, c.querySelector("#color-preview-primary").style.fill = t, st()
    }

    function Ct(e) {
        var t =
            ht > 10000 ? xt(typo.hexToRgb((ht - 10000).toString(16).padStart(6, "0"))) : xt(ft[e]);
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

    function $t(e) {
        if (Ke = Ke.slice(0, e), !(Sn != bn && Qe < e)) {
/* TYPOMOD
        desc: replace draw commands because of redo*/        const keepCommands = Ke;
            /* TYPOEND*/
            tt = At();
            e = Math.floor(Ke.length / Lt);
            et = et.slice(0, e), zt();
            for (var t = 0; t < et.length; t++) {
                var n = et[t];
                _e.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = et.length * Lt; t < Ke.length; t++) Dt(Tt(Ke[t]));
            Je = Math.min(Ke.length, Je), Qe = Math.min(Ke.length, Qe)

            /* TYPOMOD 
                     log kept commands*/
            document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
            /* TYPOEND*/
}
    }
    const Lt = 200;

    function At() {
        return [0, 9999, 9999, 0, 0]
    }

    function Dt(e) {
        var t, n, a;
        tt[0] += 1, tt[1] = Math.min(tt[1], e[0]), tt[2] = Math.min(tt[2], e[1]), tt[3] = Math.max(tt[3], e[2]), tt[4] = Math.max(tt[4], e[3]), tt[0] >= Lt && (t = tt[1], a = tt[2], n = tt[3], e = tt[4], a = _e.getImageData(t, a, n - t, e - a), et.push({
            data: a,
            bounds: tt
        }), tt = At())
    }

    function It(e) {
        return (e || 0 < Ke.length || 0 < nt.length || 0 < Je || 0 < Qe) && (Ke = [], nt = [], Je = Qe = 0, tt = At(), et = [], zt(), 1)
    }

    function Et() {
        It() && yn && yn.emit("data", {
            id: wa
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
            case Ee:
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
                    var i = _e.getImageData(0, 0, Xe.width, Xe.height),
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
                        _e.putImageData(i, 0, 0)
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
        var p = _e.getImageData(d, u, h - d, o - u);
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
        _e.putImageData(p, d, u)
    }

    function zt() {
        /* TYPOMOD
                 desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        /* TYPOEND */
        _e.fillStyle = "#FFF", _e.fillRect(0, 0, Xe.width, Xe.height)
            /* TYPOMOD
                     desc: dispatch clear event */
            ; document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        /* TYPOEND */
    }
    var Yt = !1;

    function Pt(e) {
        var t = c.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        vt(Oe + Math.round(Nt((e - t.left) / t.width, 0, 1) * (ze - Oe)))
    }
    E("#game-toolbar .slider", "mousedown", function (e) {
        0 == e.button && (Yt = !0, Pt(e.clientX))
    }), E("#game-toolbar .slider", "touchstart", function (e) {
        Yt = !0, Pt(e.touches[0].clientX)
    }), E(He, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), E("#game-toolbar .color-picker .colors * .item", "mousedown", function (e) {
        var t = this.colorIndex;
        0 == e.button ? (e.altKey ? Ct : wt)(t) : 2 == e.button && Ct(t)
    });
    var Ht = He.querySelector(".preview");
    E([Xe, Ht], "DOMMouseScroll wheel", function (e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        vt(pt + 4 * e)
    }), E(Ht, "click", function (e) {
        Fe.classList.contains("toggled") ? Fe.classList.remove("toggled") : Fe.classList.add("toggled"), yt()
    }), E(c, "keypress", function (e) {
        if ("Enter" == e.code) return le.focus(), 0;
        if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != gt) return 0;
        for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < Ve.length; n++)
            if (m.hotkeysTools[Ve[n].id].toLowerCase() == t) return bt(Ve[n].id), e.preventDefault(), 0;
        for (n = 0; n < Ze.length; n++)
            if (m.hotkeysActions[Ze[n].id].toLowerCase() == t) return kt(Ze[n].id), e.preventDefault(), 0
    }), E(c, "touchmove", function (e) {
        Yt && Pt(e.touches[0].clientX)
    }), E(c, "touchend touchcancel", function (e) {
        Yt = !1
    }), E(Xe, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), E(Xe, "mousedown", function (e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != gt || Gt(e.button, e.clientX, e.clientY, !0, -1)
    }), E(c, "mouseup", function (e) {
        e.preventDefault(), Vt(e.button), Yt = !1
    }), E(c, "mousemove", function (e) {
        jt(e.clientX, e.clientY, !1, -1), Yt && Pt(e.clientX)
    });
    /* TYPOMOD 
         desc: add event handlers for typo features */
    E(".avatar-customizer .container", "pointerdown", () => {
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
    E(Xe, "touchstart", function (e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Ut && (Ut = e[0].identitfier, Gt(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), E(Xe, "touchend touchcancel", function (e) {
        e.preventDefault(), Vt(gt)
    }), E(Xe, "touchmove", function (e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == Ut) {
                jt(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    });
    var Ft = 0;

    function jt(e, t, n, a) {
        Bt(e, t, a = !m.pressureSensitivity ? -1 : a, n), Zt(!1)
    }

    function Gt(e, t, n, a, o) {
        Ke.length, gt = e, Bt(t, n, o, a), Zt(!0)
    }

    function Vt(e) {
        -1 == e || 0 != e && 2 != e || gt != e || (Ft = Ke.length, nt.push(Ft), Ut = null, gt = -1)
    }

    function Zt(e) {
        if (Cn.id == h && bn == Sn && -1 != gt) {
            var t = 0 == gt ? ut : ht,
                n = null;
            if (e && (dt == We && (o = t, r = at[0], i = at[1], n = [Re, o, r, i]), dt == Ne)) {
                var a = function (e, t) {
                    for (var n = (t = _e.getImageData(e, t, 1, 1)).data[0], a = t.data[1], o = t.data[2], r = 0; r < ft.length; r++) {
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
            dt == Te && (e = pt, 0 <= rt && (e = (pt - Oe) * Nt(rt, 0, 1) + Oe), o = t, r = e, i = ot[0], a = ot[1], t = at[0], e = at[1], n = [Ee, o, r, i, a, t, e]), null != n && Rt(n)
        }
        var o, r, i
    }
    setInterval(() => {
        var e, t;
        yn && Cn.id == h && bn == Sn && 0 < Ke.length - Je && (t = Ke.slice(Je, e = Je + 8), yn.emit("data", {
            id: ba,
            data: t
        }), Je = Math.min(e, Ke.length))
    }, 50), setInterval(function () {
        yn && Cn.id == h && bn != Sn && Qe < Ke.length && (Dt(Tt(Ke[Qe])), Qe++)
    }, 3);
    var Xt = c.querySelector("#game-canvas .overlay"),
        _t = c.querySelector("#game-canvas .overlay-content"),
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
                tn = l + c * n, nn = s + d * t, _t.style.top = tn + "%", Xt.style.opacity = nn, o == r ? i && i() : an = u.requestAnimationFrame(e)
            })
        }
    }

    function rn(e) {
        e.classList.add("show")
    }

    function ln(l) {
        switch (! function () {
            for (var e = 0; e < _t.children.length; e++) _t.children[e].classList.remove("show")
        }(), l.id) {
            case w:
                rn(Kt), Kt.textContent = Ae("Round $", l.data + 1);
                break;
            case k:
                rn(Kt), Kt.textContent = Ae("Waiting for players...");
                break;
            case b:
                rn(Kt), Kt.textContent = Ae("Game starting in a few seconds...");
                break;
            case q:
                rn(Qt), Qt.querySelector("p span.word").textContent = l.data.word, Qt.querySelector(".reason").textContent = function (e) {
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
                var e = Qt.querySelector(".player-container");
                N(e);
                for (var t = [], n = 0; n < l.data.scores.length; n += 3) {
                    var a = l.data.scores[n + 0],
                        o = (l.data.scores[n + 1], l.data.scores[n + 2]);
                    (s = La(a)) && t.push({
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
                            player: La(l.data[e][0]),
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
                            e.appendChild(R("rank-place", "#" + (o + 1))), e.appendChild(R("rank-name", u)), e.appendChild(R("rank-score", Ae("$ points", h)));
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
                        t.style.width = "48px", t.style.height = "48px", e.appendChild(t), e.appendChild(R("rank-name", "#" + (p.rank + 1) + " " + p.player.name)), e.appendChild(R("rank-score", Ae("$ points", p.player.score))), i[3].appendChild(e)
                    }
                    0 < r[0].length ? (m = r[0].map(function (e) {
                        return e.player.name
                    }).join(", "), en.querySelector(".winner-name").textContent = 0 < r[0].length ? m : "<user left>", en.querySelector(".winner-text").textContent = " " + (1 == r[0].length ? Ae("is the winner!") : Ae("are the winners!"))) : (en.querySelector(".winner-name").textContent = "", en.querySelector(".winner-text").textContent = Ae("Nobody won!"))
                } else en.querySelector(".winner-name").textContent = "", en.querySelector(".winner-text").textContent = Ae("Nobody won!");
                break;
            case C:
                if (l.data.words)
                    if (rn(Kt), rn(Jt), N(Jt), wn[M.WORDMODE] == $.COMBINATION) {
                        Kt.textContent = Ae("Choose the first word");
                        let a = l.data.words.length / 2,
                            o = [],
                            r = [],
                            i = 0;
                        for (let n = 0; n < a; n++) {
                            let e = R("word", l.data.words[n]);
                            e.index = n;
                            let t = R("word", l.data.words[n + a]);
                            t.index = n, t.style.display = "none", t.style.animationDelay = .03 * n + "s", o.push(e), r.push(t), E(e, "click", function () {
                                i = this.index;
                                for (let e = 0; e < a; e++) o[e].style.display = "none", r[e].style.display = "";
                                Kt.textContent = Ae("Choose the second word")
                            }), E(t, "click", function () {
                                aa([i, this.index])
                            }), Jt.appendChild(e), Jt.appendChild(t)
                        }
                    } else {
                        Kt.textContent = Ae("Choose a word");
                        for (n = 0; n < l.data.words.length; n++) {
                            var g = R("word", l.data.words[n]);
                            g.index = n, E(g, "click", function () {
                                aa(this.index)
                            }), Jt.appendChild(g)
                        }
                    }
                else {
                    rn(Kt);
                    var m = (s = La(l.data.id)) ? s.name : Ae("User");
                    Kt.textContent = Ae("$ is choosing a word!", m)
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
        $n = new mn,
        Ln = void 0,
        An = !1,
        Dn = !1,
        In = c.querySelector("#game-room"),
        En = c.querySelector("#game-players"),
        Rn = c.querySelector("#game-board"),
        Tn = c.querySelector("#game-info"),
        Nn = En.querySelector(".list"),
        Wn = En.querySelector(".footer"),
        On = c.querySelector("#game-round"),
        zn = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")],
        Yn = c.querySelector("#home .container-name-lang input"),
        Pn = c.querySelector("#home .container-name-lang select"),
        Hn = c.querySelector("#home .panel .button-play"),
        e = c.querySelector("#home .panel .button-create"),
        Ht = c.querySelector("#home .panel .button-rooms");

    function Un(e) {
        An = e, c.querySelector("#load").style.display = e ? "block" : "none"
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
                    a && Q(B, Ae("Servers are currently undergoing maintenance!") + "\n\r" + Ae("Please try again later!"));
                    break;
                default:
                    a && Q(B, Ae("An unknown error occurred ('$')", e) + "\n\r" + Ae("Please try again later!"))
            }
            n({
                success: !1,
                error: e
            })
        }, (t = new XMLHttpRequest).onreadystatechange = function () {
            4 == this.readyState && r(this.status, this.response)
        }, t.open("POST", o, !0), t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), t.send(e)
    }

    function Fn(e, t) {
        $n.context.resume(), yn && na();
        let n = 0;
        (yn = a(e, {
            closeOnBeforeunload: !1
        })).on("connect", function () {
            /* TYPOMOD
                         desc: disconnect socket & leave lobby */
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
                na(), Q(B, function (e) {
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
            }), yn.on("data", $a);
            var e = Yn.value.split("#"),
                e = {
                    join: t,
                    name: e[0],
                    lang: Pn.value,
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
                        Q(F, Ae("You have been kicked!"));
                        break;
                    case g:
                        Q(F, Ae("You have been banned!"));
                        break;
                    default:
                        Q(F, Ae("Connection lost!"))
                }
            na()
        }), yn.on("connect_error", e => {
            na(), Q(B, e.message)
        })
    }

    function jn(e) {
        An || (e = "" != e ? "id=" + e : "lang=" + Pn.value, re(), Un(!0), Bn(location.origin + ":3000/play", e, function (e) {
            Un(!1), e.success && Fn((e = e.data.split(","))[0], e[1])
        }, !0))
    }

    function Gn(e) {
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

    function Vn() {
        var e = K[j].querySelector(".filter select.lang").value;
        Bn(location.origin + ":3000/rooms", "lang=" + e, function (e) {
            e.success && ae(Gn(e.data))
        })
    }

    function Zn(e) {
        var t;
        $n.playSound(un), bt(Te, !0), vt(12), wt(2), Ct(0), It(!0), N(se), c.querySelector("#home").style.display = "none", c.querySelector("#game").style.display = "flex", Sn = e.me, qn = e.type, Mn = e.id, c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, wn = t, Xn(), N(Nn), vn = [];
        for (var n = 0; n < e.users.length; n++) Aa(e.users[n], !1);
        Ta(), Wa(), Kn(e.round), la(e.owner), Qn(e.state, !0), Dn || ((adsbygoogle = u.adsbygoogle || []).push({}), (adsbygoogle = u.adsbygoogle || []).push({}), Dn = !0)
    }

    function Xn() {
        Tn.querySelector(".text .name").textContent = wn[M.NAME], Tn.querySelector(".text .type").textContent = Ae(0 == qn ? "Public" : "Custom"), c.querySelector("#game-room .lobby-name").textContent = wn[M.NAME], Kn(xn);
        for (var e, t = 0; t < Ya.length; t++) {
            var n = Ya[t];
            n.index && (n = wn[(e = n).index], "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }

    function _n(e, t, n) {
        wn[e] = t, n && yn && yn.emit("data", {
            id: pa,
            data: {
                id: e,
                val: t
            }
        }), Xn()
    }

    function Kn(e) {
        xn = e, On.textContent = Ae("Round $ of $", [xn + 1, wn[M.ROUNDS]])
    }

    function Jn() {
        for (let e = 0; e < vn.length; e++) vn[e].score = 0;
        for (let e = 0; e < vn.length; e++) Oa(vn[e], !1), za(vn[e], !1), Na(vn[e])
    }

    function Qn(a, e) {
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
        }, 600)), n = a.time, ja(), Fa = n, Ua.textContent = Fa, Ba = setInterval(function () {
            Fa = Math.max(0, Fa - 1), Ua.textContent = Fa;
            var e = -1;
            Cn.id == h && (e = Pa), Cn.id == C && (e = Ha), Ua.style.animationName = Fa < e ? Fa % 2 == 0 ? "rot_left" : "rot_right" : "none", Fa < e && $n.playSound(pn), Fa <= 0 && ja()
        }, 1e3), He.classList.add("hidden"), st(), ta(!1), a.id == f ? (Jn(), In.style.display = "flex", Rn.style.display = "none", En.classList.add("room"), Tn.classList.add("room")) : (In.style.display = "none", Rn.style.display = "", En.classList.remove("room"), Tn.classList.remove("room")), a.id == w && (Kn(a.data), 0 == a.data && Jn()), a.id == q) {
            Sn != bn && ia(a.data.word);
            for (var o = 0; o < a.data.scores.length; o += 3) {
                var r = a.data.scores[o + 0],
                    i = a.data.scores[o + 1],
                    r = (a.data.scores[o + 2], La(r));
                r && (r.score = i)
            }
            Wa();
            for (var l = !0, o = 0; o < vn.length; o++)
                if (vn[o].guessed) {
                    l = !1;
                    break
                } l ? $n.playSound(dn) : $n.playSound(cn), be(Ae("The word was '$'", a.data.word), "", ke(ge), !0)
                /* TYPOMOD
                             desc: log finished drawing */
                ; document.dispatchEvent(new CustomEvent("drawingFinished", { detail: a.data.word }));
            /* TYPOEND */
        } else a.id != h && (zn[0].textContent = Ae("WAITING"), zn[0].classList.add("waiting"), zn[1].style.display = "none", zn[2].style.display = "none");
        if (a.id == h) {
            if (bn = a.data.id, $n.playSound(sn), It(!0), a.data.drawCommands && (Ke = a.data.drawCommands), be(Ae("$ is drawing now!", La(bn).name), "", ke(pe), !0), !e)
                for (o = 0; o < vn.length; o++) Oa(vn[o], !1);
            zn[0].classList.remove("waiting"), bn == Sn ? (e = a.data.word, zn[0].textContent = Ae("DRAW THIS"), zn[1].style.display = "", zn[2].style.display = "none", zn[1].textContent = e, He.classList.remove("hidden"), st()) : (ta(!0), oa(a.data.word, !1), ra(a.data.hints))
        } else {
            bn = -1;
            for (o = 0; o < vn.length; o++) Oa(vn[o], !1)
        }
        if (a.id == x && 0 < a.data.length) {
            let t = [],
                n = 0;
            for (let e = 0; e < a.data.length; e++) {
                var s = a.data[e][0],
                    c = a.data[e][1],
                    s = La(s);
                s && 0 == c && (n = s.score, t.push(s.name))
            }
            1 == t.length ? be(Ae("$ won with a score of $!", [t[0], n]), "", ke(ye), !0) : 1 < t.length && be(Ae("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", ke(ye), !0)
        }
        for (o = 0; o < vn.length; o++) za(vn[o], vn[o].id == bn);
        Ta()
    }

    function ea(e) {
        yn && yn.connected && Cn.id == h && (yn.emit("data", {
            id: ua,
            data: e
        }), ta(!1))
    }

    function ta(e) {
        c.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function na() {
        yn && yn.close(), yn = void 0, It(), ja(), vn = [], wn = [], Cn = {
            id: bn = kn = -1,
            time: Sn = 0,
            data: 0
        }, c.querySelector("#home").style.display = "", c.querySelector("#game").style.display = "none"
    }

    function aa(e) {
        yn && yn.connected && Cn.id == C && yn.emit("data", {
            id: ka,
            data: e
        })
    }

    function oa(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++) n += t[e];
        var a = !e && 1 == wn[M.WORDMODE];
        a && (n = 3), zn[0].textContent = Ae(a ? "WORD HIDDEN" : "GUESS THIS"), zn[1].style.display = "none", zn[2].style.display = "", N(zn[2]), zn[2].hints = [];
        for (var o = 0; o < n; o++) zn[2].hints[o] = R("hint", a ? "?" : "_"), zn[2].appendChild(zn[2].hints[o]);
        a || zn[2].appendChild(R("word-length", t.join(" ")))
    }

    function ra(e) {
        for (var t = zn[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
                o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function ia(e) {
        (!zn[2].hints || zn[2].hints.length < e.length) && oa([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        ra(t)
    }

    function la(e) {
        kn = e;
        for (var t = 0; t < vn.length; t++) z(vn[t].element, vn[t].id == kn), Ea(vn[t], 0, vn[t].id == kn);
        ! function (t) {
            for (var n = 0; n < Ya.length; n++) {
                let e = Ya[n];
                e.element.disabled = t
            }
        }(Sn != kn);
        e = La(kn);
        e && be(Ae("$ is now the room owner!", e.name), "", ke(ye), !0)
    }
    E(K[j].querySelector(".filter select.lang"), "change", Vn), E(K[j].querySelector("button.refresh"), "click", Vn);
    const sa = 1,
        ca = 2,
        da = 5,
        ua = 8,
        ha = 10,
        fa = 11,
        pa = 12,
        ga = 13,
        ma = 14,
        ya = 15,
        va = 16,
        Sa = 17,
        ka = 18,
        ba = 19,
        wa = 20,
        Ca = 21;
    const qa = 30,
        xa = 31,
        Ma = 32;

    function $a(e) {
        var t = e.id,
            n = e.data;
        switch (t) {
            case ha:
                /* TYPOMOD
                                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                /* TYPOEND*/
                Zn(n);
                break;
            case fa:
                Qn(n);
                break;
            case pa:
                _n(n.id, n.val, !1);
                break;
            case ga:
                ra(n);
                break;
            case ma:
                Fa = n;
                break;
            case sa:
                be(Ae("$ joined the room!", Aa(n, !0).name), "", ke(ge), !0), $n.playSound(un);
                break;
            case ca:
                var a = function (e) {
                    for (var t = 0; t < vn.length; t++) {
                        var n = vn[t];
                        if (n.id == e) return vn.splice(t, 1), n.element.remove(), Wa(), Ta(), n
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
                }(n.reason, a.name), "", ke(me), !0), $n.playSound(hn));
                break;
            case da:
                var a = La(n[0]),
                    o = La(n[1]),
                    r = n[2],
                    i = n[3];
                a && o && be(Ae("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", ke(fe), !0);
                break;
            case ya:
                var l = La(n.id);
                if (l) {
                    let e = be(Ae("$ guessed the word!", l.name), "", ke(ge), !0);
                    e.classList.add("guessed"), Oa(l, !0), $n.playSound(fn), n.id == Sn && ia(n.word)
                }
                break;
            case ua:
                o = La(n.id);
                o && (r = o, i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (l = R("icon")).style.backgroundImage = "url(/img/" + i + ")", Ia(r, l), n.vote ? be(Ae("$ liked the drawing!", o.name), "", ke(ge), !0) : be(Ae("$ disliked the drawing!", o.name), "", ke(me), !0));
                break;
            case Sa:
                la(n);
                break;
            case va:
                be(Ae("$ is close!", n), "", ke(fe), !0);
                break;
            case qa:
                Da(La(n.id), n.msg);
                break;
            case Ma:
                be(Ae("Spam detected! You're sending messages too quickly."), "", ke(me), !0);
                break;
            case xa:
                switch (n.id) {
                    case 0:
                        be(Ae("You need at least 2 players to start the game!"), "", ke(me), !0);
                        break;
                    case 100:
                        be(Ae("Server restarting in about $ seconds!", n.data), "", ke(me), !0)
                }
                break;
            case ba:
                for (var s = 0; s < n.length; s++) Rt(n[s]);
                break;
            case wa:
                It(!0);
                break;
            case Ca:
                $t(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function La(e) {
        for (var t = 0; t < vn.length; t++) {
            var n = vn[t];
            if (n.id == e) return n
        }
    }

    function Aa(e, t) {
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
        var a = n.id == Sn ? Ae("$ (You)", n.name) : n.name,
            o = R("info"),
            e = R("name", a);
        n.id == Sn && e.classList.add("me"), o.appendChild(e), o.appendChild(R("rank", "#" + n.rank)), o.appendChild(R("score", Ae("$ points", n.score))), n.element.appendChild(o);
        var r = W(n.avatar);
        /* TYPOMOD
                 desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id);
        /* TYPOEND */
        n.element.drawing = R("drawing"), r.appendChild(n.element.drawing), n.element.appendChild(r), Nn.appendChild(n.element), E(n.element, "click", function () {
            Ln = n, Q(U, n)
        });
        4 == (4 & n.flags) && (n.interval = setInterval(function () {
            n.avatar[0] = (n.avatar[0] + 1) % d[0], n.avatar[1] = (n.avatar[1] + 1) % d[1], n.avatar[2] = (n.avatar[2] + 1) % d[2], O(r, n.avatar)
        }, 250));
        a = R("icons"), e = R("icon owner"), o = R("icon muted");
        return a.appendChild(e), a.appendChild(o), n.element.appendChild(a), n.element.icons = [e, o], Oa(n, n.guessed), t && Ta(), n
    }

    function Da(e, t) {
        var n;
        e.muted || (n = e.id == bn || e.guessed, Sn != bn && !La(Sn).guessed && n || (m.filterChat && (t = ue(t)), Ia(e, R("text", t)), be(e.name, t, ke(n ? ve : he))))
    }

    function Ia(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = R("bubble"),
            a = R("content");
        a.appendChild(t), n.appendChild(R("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function () {
            e.bubble.remove(), e.bubble = void 0
        }, 1500)
    }

    function Ea(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ra = void 0;

    function Ta() {
        var e = Cn.id == f,
            t = e ? 112 : 48,
            n = Math.max(t, Nn.clientHeight);
        let a = Math.floor(n / t);
        e && (a *= 4);
        t = Math.ceil(vn.length / a);
        for (let e = 0; e < vn.length; e++) vn[e].page = Math.floor(e / a);
        e = c.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = vn.length, e[1].textContent = wn[M.SLOTS], null == Ra ? Ra = Y(Wn, t, [En], function (e, n, t) {
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
        }) : P(Ra, t), Ra.element.style.display = 1 < t ? "" : "none"
    }

    function Na(t) {
        let n = 1;
        for (let e = 0; e < vn.length; e++) {
            var a = vn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n, t.element.querySelector(".score").textContent = Ae("$ points", t.score);
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n, e.classList.remove("first"), e.classList.remove("second"), e.classList.remove("third"), 1 == n && e.classList.add("first"), 2 == n && e.classList.add("second"), 3 == n && e.classList.add("third")
    }

    function Wa() {
        for (var e = 0; e < vn.length; e++) Na(vn[e])
    }

    function Oa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }

    function za(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ya = [];
    ! function () {
        for (var e = In.querySelectorAll('*[id^="item-"]'), n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            Ya.push(t), E(t.element, "change", function () {
                var e = "checkbox" == this.type ? this.checked : this.value;
                null != t.index && _n(t.index, e, !0)
            })
        }
    }();
    const Pa = 10,
        Ha = 4;
    var Ua = c.querySelector("#game-clock"),
        Ba = null,
        Fa = 0;

    function ja() {
        Ba && (clearInterval(Ba), Ba = null)
    }
    var Ga, Va, Za, Xa, _a, Ka, mn = c.querySelector("#tutorial"),
        Ja = mn.querySelectorAll(".page"),
        Qa = Y(mn, Ja.length, [mn.querySelector(".pages")], function (e, t, n) {
            n && clearInterval(eo);
            for (let e = 0; e < Ja.length; e++) Ja[e].classList.remove("active");
            Ja[t].classList.add("active")
        }),
        eo = setInterval(function () {
            Qa.selected < 4 ? H(Qa, Qa.selected + 1, !1) : H(Qa, 0, !1)
        }, 3500),
        to = c.querySelector("#setting-bar"),
        no = c.querySelector("#audio"),
        ao = c.querySelector("#lightbulb");

    function oo() {
        to.classList.remove("open")
    }

    function ro(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }

    function io() {
        no.dataset.tooltip = m.audioMute ? "Unmute audio" : "Mute audio", ao.dataset.tooltip = m.dark ? "Turn the lights on" : "Turn the lights off", we && (we.querySelector(".tooltip-content").textContent = Ae(Ce.dataset.tooltip))
    }

    function lo() {
        be(Ae("Copied room link to clipboard!"), "", ke(fe), !0),
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

    function so(e) {
        Ka.parts[e].classList.remove("bounce"), Ka.parts[e].offsetWidth, Ka.parts[e].classList.add("bounce")
    }
    E(to.querySelector(".icon"), "click", function () {
        ro(no, m.audioMute), ro(ao, m.dark), io(), to.classList.contains("open") ? oo() : to.classList.add("open")
    }), E("#audio", "click", function (e) {
        m.audioMute = !m.audioMute, ro(no, m.audioMute), io(), D()
    }), E("#lightbulb", "click", function (e) {
        I(!m.dark), ro(ao, m.dark), io(), D()
    }), E("#hotkeys", "click", function (e) {
        oo(), Q(V)
    }), u.onbeforeunload = function (e) {
        return yn ? Ae("Are you sure you want to leave?") : void 0
    }, u.onunload = function () {
        yn && na()
    }, E([c, Xe], "mousedown touchstart", function (e) {
        to.contains(e.target) || oo(), e.target
    }), E(u, "resize", Ta), E([Yn, Pn], "change", D), E(Hn, "click", function () {
        var e, t, n;
        jn((e = u.location.href, n = "", e = e.split("?"), n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
    }), E(Ht, "click", function () {
        An || (re(), Un(!0), K[j].querySelector(".filter select.lang").value = Pn.value, Bn(location.origin + ":3000/rooms", "lang=" + Pn.value, function (e) {
            Un(!1), e.success && Q(j, Gn(e.data))
        }, !0))
    }), E(e, "click", function () {
        An || (re(), Un(!0), Bn(location.origin + ":3000/create", "lang=" + Pn.value, function (e) {
            Un(!1), e.success && Fn((e = e.data.split(","))[0], e[1])
        }, !0))
    }), E(c.querySelector("#game-rate .like"), "click", function () {
        ea(1)
    }), E(c.querySelector("#game-rate .dislike"), "click", function () {
        ea(0)
    }), E(Tn, "click", lo), E(c.querySelector("#start-game"), "click", function () {
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
    }), E(c.querySelector("#copy-invite"), "click", lo), E(K[U].querySelector("button.kick"), "click", function () {
        re(), null != Ln && Ln.id != Sn && Sn == kn && yn && yn.emit("data", {
            id: 3,
            data: Ln.id
        })
    }), E(K[U].querySelector("button.ban"), "click", function () {
        re(), null != Ln && Ln.id != Sn && Sn == kn && yn && yn.emit("data", {
            id: 4,
            data: Ln.id
        })
    }), E(K[U].querySelector("button.votekick"), "click", function () {
        re(), null != Ln && Ln.id != Sn && yn && (Ln.id == kn ? be(Ae("You can not votekick the lobby owner!"), "", ke(me), !0) : yn.emit("data", {
            id: da,
            data: Ln.id
        }))
    }), E(K[U].querySelector("button.mute"), "click", function () {
        null != Ln && Ln.id != Sn && (Ln.muted = !Ln.muted, Ea(Ln, 1, Ln.muted), Ln.muted ? be(Ae("You muted '$'!", Ln.name), "", ke(me), !0) : be(Ae("You unmuted '$'!", Ln.name), "", ke(me), !0), yn && yn.emit("data", {
            id: 7,
            data: Ln.id
        }), J(Ln.muted))
    }), E(K[U].querySelector("button.report"), "click", function () {
        K[U].querySelector(".buttons").style.display = "none", K[U].querySelector(".report-menu").style.display = "";
        let t = K[U].querySelectorAll(".report-menu input");
        for (let e = 0; e < t.length; e++) t[e].checked = !1
    }), E(K[U].querySelector("button#report-send"), "click", function () {
        let e = 0;
        K[U].querySelector("#report-reason-toxic").checked && (e |= 1), K[U].querySelector("#report-reason-spam").checked && (e |= 2), K[U].querySelector("#report-reason-bot").checked && (e |= 4), 0 < e && (null != Ln && Ln.id != Sn && (Ln.reported = !0, yn && yn.emit("data", {
            id: 6,
            data: {
                id: Ln.id,
                reasons: e
            }
        }), be(Ae("Your report for '$' has been sent!", Ln.name), "", ke(fe), !0)), re())
    }), E(K[V].querySelector("#select-display-language"), "change", function (e) {
        m.displayLang = e.target.value, D(), Ie()
    }), E(K[V].querySelector("#select-filter-chat"), "change", function (e) {
        m.filterChat = e.target.value, D()
    }), E(K[V].querySelector("#select-pressure-sensitivity"), "change", function (e) {
        m.pressureSensitivity = e.target.value, D()
    }), E(K[V].querySelector("button.reset"), "click", function (e) {
        for (let e = 0; e < Ve.length; e++) Ge(Ve[e], t[Ve[e].id]);
        for (let e = 0; e < Ze.length; e++) Ge(Ze[e], r[Ze[e].id]);
        D()
    }), E(ie, "submit", function (e) {
        return e.preventDefault(), le.value && (yn && yn.connected ? yn.emit("data", {
            id: qa,
            data: le.value
        }) : Da(La(Sn), le.value)), ie.reset(), !1
    }),
        function () {
            if (!u.localStorageAvailable) {
                var e = !1;
                if (void 0 !== n) try {
                    n.setItem("feature_test", "yes"), "yes" === n.getItem("feature_test") && (n.removeItem("feature_test"), e = !0)
                } catch (e) { }
                u.localStorageAvailable = e
            }
            u.localStorageAvailable ? (Yn.value = L("name", ""), Pn.value = function (e) {
                for (var t = c.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                    if (e.startsWith(t[n].value)) return t[n].value;
                return "en"
            }(L("lang", navigator.language)), m.displayLang = L("displaylang", "en"), m.audioMute = 1 == parseInt(L("audio", 0)) ? 1 : 0, m.filterChat = 1 == parseInt(L("filter", 1)) ? 1 : 0, m.pressureSensitivity = 1 == parseInt(L("pressure", 1)) ? 1 : 0, m.hotkeysTools = A("tools", m.hotkeysTools), m.hotkeysActions = A("actions", m.hotkeysActions), function () {
                for (let e = 0; e < Ve.length; e++) Ge(Ve[e], m.hotkeysTools[Ve[e].id]);
                for (let e = 0; e < Ze.length; e++) Ge(Ze[e], m.hotkeysActions[Ze[e].id])
            }(), m.avatar = A("ava", m.avatar), I(1 == parseInt(L("dark", 0)) ? 1 : 0), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
        }(),
        function () {
            var t = c.querySelectorAll("[data-translate]");
            for (let e = 0; e < t.length; e++) {
                var n = t[e];
                De(n, n.dataset.translate)
            }
        }(), Ie(), E(Ga = c.querySelectorAll("[data-tooltip]"), "mouseenter", function (e) {
            qe(e.target)
        }), E(Ga, "mouseleave", function (e) {
            xe()
        }), Va = (_a = c.querySelector("#home .avatar-customizer")).querySelector(".container"), Za = _a.querySelectorAll(".arrows.left .arrow"), Xa = _a.querySelectorAll(".arrows.right .arrow"), _a = _a.querySelectorAll(".randomize"), (Ka = W(m.avatar, 96)).classList.add("fit"), Va.appendChild(Ka), E(Za, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --m.avatar[e], m.avatar[e] < 0 && (m.avatar[e] = d[e] - 1), so(e), O(Ka, m.avatar, 96), D()
        }), E(Xa, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            m.avatar[e] += 1, m.avatar[e] >= d[e] && (m.avatar[e] = 0), so(e), O(Ka, m.avatar, 96), D()
        }), E(_a, "click", function () {
            m.avatar[0] = Math.floor(Math.random() * d[0]), m.avatar[1] = Math.floor(Math.random() * d[1]), m.avatar[2] = Math.floor(Math.random() * d[2]), so(1), so(2), O(Ka, m.avatar, 96), D()
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