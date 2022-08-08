!function(u, c, o, r) {
    const l = 26
      , s = 57
      , d = 51
      , h = [l, s, d]
      , y = 0
      , v = 1
      , S = 2
      , b = 0
      , k = 1
      , w = 2
      , C = 3
      , f = 4
      , q = 5
      , x = 6
      , p = 7;
    const g = 1
      , m = 2
      , M = {
        LANG: 0,
        SLOTS: 1,
        DRAWTIME: 2,
        ROUNDS: 3,
        WORDCOUNT: 4,
        HINTCOUNT: 5,
        WORDMODE: 6,
        CUSTOMWORDSONLY: 7
    }
      , L = {
        NORMAL: 0,
        HIDDEN: 1,
        COMBINATION: 2
    }
      , a = ["Normal", "Hidden", "Combination"];
    const t = ["B", "F"]
      , n = ["U", "C"];
    var $ = {
        avatar: [Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % s, Math.round(100 * Math.random()) % d, -1],
        audioMute: 0,
        dark: 0,
        filterChat: 1,
        pressureSensitivity: 1,
        displayLang: "en",
        hotkeysTools: ["B", "F"],
        hotkeysActions: ["U", "C"],
        chatDeleteQuota: 100
    };
    function A(e, t) {
        e = o.getItem(e);
        return null == e ? t : e
    }
    function D(e, t) {
        e = o.getItem(e);
        return null == e ? t : JSON.parse(e)
    }
    function I() {
        u.localStorageAvailable && (o.setItem("name", Wn.value),
        o.setItem("lang", On.value),
        o.setItem("displaylang", $.displayLang),
        o.setItem("audio", 1 == $.audioMute ? 1 : 0),
        o.setItem("dark", 1 == $.dark ? 1 : 0),
        o.setItem("filter", 1 == $.filterChat ? 1 : 0),
        o.setItem("pressure", 1 == $.pressureSensitivity ? 1 : 0),
        o.setItem("tools", JSON.stringify($.hotkeysTools)),
        o.setItem("actions", JSON.stringify($.hotkeysActions)),
        o.setItem("ava", JSON.stringify($.avatar)),
        console.log("Settings saved."))
    }
    function E(e) {
        $.dark = e ? 1 : 0,
        c.documentElement.dataset.theme = $.dark ? "dark" : ""
    }
    function R(e, t, n) {
        var a, o = e;
        "string" == typeof e ? o = c.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]);
        for (var r = t.split(" "), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++)
                o[i].addEventListener(r[l], n)
    }
    function T(e, t) {
        for (var n = c.createElement("div"), a = e.split(" "), o = 0; o < a.length; o++)
            n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t),
        n
    }
    function N(e) {
        for (; e.firstChild; )
            e.removeChild(e.firstChild)
    }
    function W(e, t, n) {
        var a = T("avatar")
          , o = T("color")
          , r = T("eyes")
          , i = T("mouth")
          , l = T("special")
          , s = T("owner");
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
            var o = -t % n * 100
              , n = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + n + "%"
        }
        var o = t[0] % l
          , r = t[1] % s
          , n = t[2] % d
          , t = t[3];
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
    function P(e, t, n, a) {
        let o = {
            element: T("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element),
        n.push(o.element),
        R(n, "DOMMouseScroll wheel", function(e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY,
            t = Math.sign(t),
            H(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)),
            e.preventDefault(),
            e.stopPropagation()
        }),
        Y(o, t),
        o
    }
    function Y(n, e) {
        N(n.element),
        n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = T("dot");
            e.appendChild(T("inner")),
            R(e, "click", function() {
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
    const U = 0
      , B = 1
      , F = 2
      , _ = 3
      , G = 4
      , j = 5;
    var X = c.querySelector("#modal")
      , V = X.querySelector(".title .text")
      , Z = X.querySelector(".content")
      , K = [];
    function J(e) {
        K[U].querySelector(".buttons button.mute").textContent = Me(e ? "Unmute" : "Mute")
    }
    function Q(e, a) {
        X.style.display = "block";
        for (var t = 0; t < K.length; t++)
            K[t].style.display = "none";
        switch (K[e].style.display = "flex",
        e) {
        case B:
            V.textContent = Me("Something went wrong!"),
            K[B].querySelector(".message").textContent = a;
            break;
        case F:
            V.textContent = Me("Disconnected!"),
            K[F].querySelector(".message").textContent = a;
            break;
        case U:
            {
                V.textContent = "";
                let e = K[U].querySelector(".buttons");
                e.style.display = a.id == gn ? "none" : "flex",
                e.querySelector(".button-pair").style.display = gn == mn ? "flex" : "none",
                e.querySelector("button.report").style.display = a.reported ? "none" : "",
                J(a.muted),
                K[U].querySelector(".report-menu").style.display = "none";
                let t = Z.querySelector(".player");
                N(t);
                let n = W(a.avatar, 96);
                z(n, mn == a.id),
                n.style.width = "96px",
                n.style.height = "96px",
                t.appendChild(n),
                t.appendChild(T("name", a.id == gn ? Me("$ (You)", a.name) : a.name))
            }
            break;
        case _:
            V.textContent = Me("Rooms"),
            ae(a);
            break;
        case G:
            V.textContent = vn[M.NAME];
            break;
        case j:
            V.textContent = Me("Settings"),
            K[j].querySelector("#select-display-language").value = $.displayLang,
            K[j].querySelector("#select-pressure-sensitivity").value = $.pressureSensitivity
        }
    }
    K[U] = X.querySelector(".container-player"),
    K[B] = X.querySelector(".container-info"),
    K[F] = X.querySelector(".container-info"),
    K[_] = X.querySelector(".container-rooms"),
    K[G] = X.querySelector(".container-room"),
    K[j] = X.querySelector(".container-settings");
    var ee = []
      , te = K[_].querySelector(".rooms")
      , e = K[_].querySelector(".footer")
      , ne = (K[_].querySelector(".dots"),
    P(e, 0, [e, te], function(e, n, t) {
        for (let t = 0; t < ee.length; t++) {
            let e = ee[t];
            e.element.style.display = e.page == n ? "" : "none"
        }
    }));
    function ae(t) {
        !function() {
            for (let e = 0; e < ee.length; e++)
                ee[e].element.remove();
            ee = []
        }();
        for (let e = 0; e < t.length; e++)
            !function(e) {
                let t = T("room")
                  , n = T("type", 0 == e.type ? "P" : "C");
                n.dataset.type = e.type,
                t.appendChild(n),
                t.appendChild(T("name", e.settings[M.NAME])),
                t.appendChild(T("slots", e.users + "/" + e.settings[M.SLOTS])),
                t.appendChild(T("round", 0 < e.round ? e.round : Me("Not started"))),
                t.appendChild(T("mode", a[e.settings[M.WORDMODE]])),
                t.appendChild(T("settings", e.settings[M.DRAWTIME] + "s")),
                te.appendChild(t),
                ee.push({
                    element: t,
                    page: 0,
                    data: e
                }),
                R(t, "click", function() {
                    Fn(e.id)
                })
            }(t[e]);
        oe()
    }
    function oe() {
        var n = K[_].querySelector(".filter input").value
          , a = K[_].querySelector(".filter select.type").value;
        let o = 0
          , r = 0;
        for (let t = 0; t < ee.length; t++) {
            let e = ee[t];
            var i = -1 != a && e.data.type != a
              , l = "" != n && !e.data.settings[M.NAME].includes(n);
            i || l ? e.page = -1 : (e.page = r,
            o++,
            10 <= o && (r++,
            o = 0))
        }
        var e = 0 == o && 0 == r;
        K[_].querySelector(".rooms .empty").style.display = e ? "flex" : "none",
        r = Math.max(1, r),
        Y(ne, r),
        e = 1 < r,
        ne.element.style.display = e ? "" : "none"
    }
    function re() {
        X.style.display = "none"
    }
    R(u, "click", function(e) {
        e.target == X && re()
    }),
    R([X.querySelector(".close"), K[B].querySelector("button.ok")], "click", re),
    R(K[_].querySelector(".filter select.type"), "change", oe),
    R(K[_].querySelector(".filter input"), "input", oe);
    var ie = c.querySelector("#game-chat form")
      , le = c.querySelector("#game-chat form input")
      , se = c.querySelector("#game-chat .content");
    const ce = 0;
    const de = 2
      , ue = 3
      , he = 4
      , fe = 5
      , pe = 6
      , ge = 7;
    var me = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];
    function ye(e) {
        return "var(--COLOR_CHAT_TEXT_" + me[e] + ")"
    }
    function ve(e, t, n, a) {
        var o = c.createElement("p")
          , r = c.createElement("b");
        r.textContent = a ? e : e + ": ",
        o.appendChild(r),
        o.style.color = n;
        n = c.createElement("span");
        n.textContent = t,
        o.appendChild(n);
        n = se.scrollHeight - se.scrollTop - se.clientHeight <= 20;
        if (se.appendChild(o),
        n && (se.scrollTop = se.scrollHeight + 100),
        0 < $.chatDeleteQuota)
            for (; se.childElementCount > $.chatDeleteQuota; )
                se.firstElementChild.remove();
        return o
    }
    let Se = void 0
      , be = void 0;
    function ke(e) {
        we();
        var t = (be = e).dataset.tooltip
          , n = e.dataset.tooltipdir || "N";
        Se = T("tooltip"),
        Se.classList.add(n),
        Se.appendChild(T("tooltip-arrow")),
        Se.appendChild(T("tooltip-content", Me(t)));
        let a = !1
          , o = e;
        for (; o; ) {
            if ("fixed" == u.getComputedStyle(o).position) {
                a = !0;
                break
            }
            o = o.parentElement
        }
        Se.style.position = a ? "fixed" : "absolute";
        e = e.getBoundingClientRect();
        let r = e.left
          , i = e.top;
        "N" == n && (r = (e.left + e.right) / 2),
        "S" == n && (r = (e.left + e.right) / 2,
        i = e.bottom),
        "E" == n && (r = e.right,
        i = (e.top + e.bottom) / 2),
        "W" == n && (i = (e.top + e.bottom) / 2),
        a || (r += u.scrollX,
        i += u.scrollY),
        Se.style.left = r + "px",
        Se.style.top = i + "px",
        c.body.appendChild(Se)
    }
    function we() {
        Se && (Se.remove(),
        Se = void 0,
        be = void 0)
    }
    let Ce = {}
      , qe = [];
    function xe(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }
    function Me(t, n) {
        var e = xe(Ce[$.displayLang], t);
        e == t ? console.log("No translation found for: " + t) : t = e;
        let a = ""
          , o = 0;
        Array.isArray(n) || (n = [n]);
        for (let e = 0; e < t.length; e++) {
            var r = t.charAt(e);
            "$" == r ? (a += n[o],
            o++) : a += r
        }
        return a
    }
    function Le(t, n) {
        if ("children" != n) {
            let e = "";
            "text" == n && (e = t.textContent),
            "placeholder" == n && (e = t.placeholder),
            0 < e.length ? qe.push({
                key: e,
                element: t,
                type: n
            }) : (console.log("Empty key passed to translate with!"),
            console.log(t))
        } else
            for (let e = 0; e < t.children.length; e++) {
                var a = t.children[e].dataset.translate;
                Le(t.children[e], null == a ? "text" : a)
            }
    }
    function $e() {
        var n = Ce[$.displayLang];
        for (let t = 0; t < qe.length; t++) {
            let e = qe[t];
            var a = xe(n, e.key);
            "text" == e.type && (e.element.textContent = a),
            "placeholder" == e.type && (e.element.placeholder = a)
        }
    }
    Ce.en = {},
    Ce.de = {
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
        "$ joined the room!": "$ ist dem Raum beigetreten!",
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
    const Ae = 0
      , De = 1;
    const Ie = 0
      , Ee = 2
      , Re = 1;
    const Te = 4
      , Ne = 40;
    var We = [4, 14, 30, 40]
      , Oe = c.querySelector("#game-toolbar")
      , ze = Oe.querySelectorAll(".tools-container .tools")[0]
      , Pe = Oe.querySelectorAll(".tools-container .tools")[1]
      , Ye = c.querySelector("#game-toolbar .sizes")
      , He = c.querySelector("#game-toolbar .colors");
    function Ue(e, t) {
        let n = T("tool clickable");
        n.appendChild(T("icon")),
        n.appendChild(T("key"));
        var a, o, r, i = (t.isAction ? $.hotkeysActions : $.hotkeysTools)[e];
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
        R(a, "mouseenter", function(e) {
            ke(e.target)
        }),
        R(a, "mouseleave", function(e) {
            we()
        }),
        t.isAction ? (n.addEventListener("click", function(e) {
            yt(this.toolIndex)
        }),
        Pe.appendChild(n),
        _e[e] = l) : (n.addEventListener("click", function(e) {
            vt(this.toolIndex)
        }),
        ze.appendChild(n),
        Fe[e] = l);
        e = T("key", l.name);
        Le(e, "text"),
        l.listing = T("item"),
        l.listing.appendChild(e);
        let s = c.createElement("input");
        s.value = i,
        l.listing.appendChild(s),
        R(s, "keydown", function(e) {
            var t = e.key;
            return Be(l, t),
            I(),
            e.preventDefault(),
            !1
        }),
        K[j].querySelector("#hotkey-list").appendChild(l.listing),
        t.hide && (n.style.display = "none")
    }
    function Be(e, t) {
        e.isAction ? $.hotkeysActions[e.id] = t : $.hotkeysTools[e.id] = t,
        e.element.querySelector(".key").textContent = t,
        e.listing.querySelector("input").value = t
    }
    var Fe = [];
    Ue(Ie, {
        isAction: !1,
        name: "Brush",
        graphic: "pen.gif",
        cursor: 0
    }),
    Ue(Re, {
        isAction: !1,
        name: "Fill",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    });
    var _e = [];
    Ue(0, {
        isAction: !0,
        name: "Undo",
        graphic: "undo.gif",
        action: function() {
            {
                var e;
                0 < Qe.length && (Qe.pop(),
                0 < Qe.length ? (qt(e = Qe[Qe.length - 1]),
                fn && fn.emit("data", {
                    id: wa,
                    data: e
                })) : At())
            }
        }
    }),
    Ue(1, {
        isAction: !0,
        name: "Clear",
        graphic: "clear.gif",
        action: At
    });
    var Ge = c.querySelector("#game-canvas canvas")
      , je = Ge.getContext("2d")
      , Xe = []
      , Ve = 0
      , Ze = 0
      , Ke = []
      , Je = [0, 9999, 9999, 0, 0]
      , Qe = []
      , et = [0, 0]
      , tt = [0, 0]
      , nt = 0
      , at = c.createElement("canvas");
    at.width = Ne + 2,
    at.height = Ne + 2;
    var ot = at.getContext("2d");
    function rt() {
        var t = Fe[lt].cursor;
        if (Sn.id == f && yn == gn) {
            if (lt == Ie) {
                var n, a, o, r = at.width, i = ut;
                if (i <= 0)
                    return;
                ot.clearRect(0, 0, r, r);
                let e = dt[st];
                1 == $.dark && (n = Math.floor(.75 * e[0]),
                a = Math.floor(.75 * e[1]),
                o = Math.floor(.75 * e[2]),
                e = [n, a, o]),
                ot.fillStyle = wt(e),
                ot.beginPath(),
                ot.arc(r / 2, r / 2, i / 2 - 1, 0, 2 * Math.PI),
                ot.fill(),
                ot.strokeStyle = "#FFF",
                ot.beginPath(),
                ot.arc(r / 2, r / 2, i / 2 - 1, 0, 2 * Math.PI),
                ot.stroke(),
                ot.strokeStyle = "#000",
                ot.beginPath(),
                ot.arc(r / 2, r / 2, i / 2, 0, 2 * Math.PI),
                ot.stroke();
                r = r / 2,
                t = "url(" + at.toDataURL() + ")" + r + " " + r + ", default"
            }
        } else
            t = "default";
        Ge.style.cursor = t
    }
    var it = 0
      , lt = 0
      , st = 0
      , ct = 0
      , dt = [[255, 255, 255], [0, 0, 0], [193, 193, 193], [80, 80, 80], [239, 19, 11], [116, 11, 7], [255, 113, 0], [194, 56, 0], [255, 228, 0], [232, 162, 0], [0, 204, 0], [0, 70, 25], [0, 255, 145], [0, 120, 93], [0, 178, 255], [0, 86, 158], [35, 31, 211], [14, 8, 101], [163, 0, 186], [85, 0, 105], [223, 105, 167], [135, 53, 84], [255, 172, 142], [204, 119, 77], [160, 82, 45], [99, 48, 13]]
      , ut = 0
      , ht = -1
      , ft = [];
    for (let n = 0; n < We.length; n++) {
        let e = T("size clickable")
          , t = T("icon");
        t.style.backgroundPosition = -100 * n + "% 0%",
        t.style.backgroundSize = "400% 100%",
        e.appendChild(t),
        Ye.appendChild(e),
        R(e, "click", function(e) {
            !function(e) {
                e = ft[e];
                mt(e.element),
                gt(e.size)
            }(n)
        }),
        ft.push({
            id: n,
            size: We[n],
            element: e,
            elementIcon: t
        })
    }
    var pt = [T("top"), T("bottom")];
    for (let e = 0; e < dt.length / 2; e++)
        pt[0].appendChild(kt(2 * e)),
        pt[1].appendChild(kt(2 * e + 1));
    for (let e = 0; e < pt.length; e++)
        He.appendChild(pt[e]);
    function gt(e) {
        ut = Et(e, Te, Ne);
        let n = ft[ft.length - 1]
          , a = n.size;
        for (let t = 0; t < ft.length; t++) {
            let e = ft[t];
            var o = Math.abs(ut - e.size);
            o <= a && (a = o,
            n = e),
            e.element.classList.remove("selected")
        }
        n.element.classList.add("selected"),
        rt()
    }
    function mt(e) {
        e.classList.remove("clicked"),
        e.offsetWidth,
        e.classList.add("clicked")
    }
    function yt(e) {
        mt(_e[e].element),
        _e[e].action()
    }
    function vt(e, t) {
        mt(Fe[e].element),
        e == lt && !t || (Fe[it = lt].element.classList.remove("selected"),
        Fe[e].element.classList.add("selected"),
        lt = e,
        rt())
    }
    function St(e) {
        var t = wt(dt[e]);
        st = e,
        c.querySelector("#color-preview-primary").style.fill = t,
        rt()
    }
    function bt(e) {
        var t = wt(dt[e]);
        ct = e,
        c.querySelector("#color-preview-secondary").style.fill = t,
        rt()
    }
    function kt(e) {
        var t = T("item")
          , n = T("inner");
        return n.style.backgroundColor = wt(dt[e]),
        t.appendChild(n),
        t.colorIndex = e,
        t
    }
    function wt(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }
    function Ct(e) {
        e = Et(e, 0, dt.length),
        e = dt[e];
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }
    function qt(e) {
        if (Xe = Xe.slice(0, e),
        !(gn != yn && Ze < e)) {
            Je = Mt();
            e = Math.floor(Xe.length / xt);
            Ke = Ke.slice(0, e),
            Nt();
            for (var t = 0; t < Ke.length; t++) {
                var n = Ke[t];
                je.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = Ke.length * xt; t < Xe.length; t++)
                Lt(It(Xe[t]), Xe[t]);
            Ve = Math.min(Xe.length, Ve),
            Ze = Math.min(Xe.length, Ze)
        }
    }
    const xt = 200;
    function Mt() {
        return [0, 9999, 9999, 0, 0]
    }
    function Lt(e) {
        var t, n, a;
        Je[0] += 1,
        Je[1] = Math.min(Je[1], e[0]),
        Je[2] = Math.min(Je[2], e[1]),
        Je[3] = Math.max(Je[3], e[2]),
        Je[4] = Math.max(Je[4], e[3]),
        Je[0] >= xt && (t = Je[1],
        a = Je[2],
        n = Je[3],
        e = Je[4],
        a = je.getImageData(t, a, n - t, e - a),
        Ke.push({
            data: a,
            bounds: Je
        }),
        Je = Mt())
    }
    function $t(e) {
        return (e || 0 < Xe.length || 0 < Qe.length || 0 < Ve || 0 < Ze) && (Xe = [],
        Qe = [],
        Ve = Ze = 0,
        Je = Mt(),
        Ke = [],
        Nt(),
        1)
    }
    function At() {
        $t() && fn && fn.emit("data", {
            id: ka
        })
    }
    function Dt(e) {
        Xe.push(e),
        gn == yn && Lt(It(e))
    }
    function It(e) {
        let t = [0, 0, Ge.width, Ge.height];
        switch (e[0]) {
        case Ae:
            var n = Et(Math.floor(e[2]), Te, Ne)
              , a = Math.floor(Math.ceil(n / 2))
              , o = Et(Math.floor(e[3]), -a, Ge.width + a)
              , r = Et(Math.floor(e[4]), -a, Ge.height + a)
              , i = Et(Math.floor(e[5]), -a, Ge.width + a)
              , l = Et(Math.floor(e[6]), -a, Ge.height + a)
              , s = Ct(e[1]);
            t[0] = Et(o - a, 0, Ge.width),
            t[1] = Et(r - a, 0, Ge.height),
            t[2] = Et(i + a, 0, Ge.width),
            t[3] = Et(l + a, 0, Ge.height),
            Tt(o, r, i, l, n, s.r, s.g, s.b);
            break;
        case De:
            s = Ct(e[1]);
            !function(e, t, a, o, r) {
                var i = je.getImageData(0, 0, Ge.width, Ge.height)
                  , n = [[e, t]]
                  , l = function(e, t, n) {
                    t = 4 * (n * e.width + t);
                    return 0 <= t && t < e.data.length ? [e.data[t], e.data[1 + t], e.data[2 + t]] : [0, 0, 0]
                }(i, e, t);
                if (a != l[0] || o != l[1] || r != l[2]) {
                    function s(e) {
                        var t = i.data[e]
                          , n = i.data[e + 1]
                          , e = i.data[e + 2];
                        if (t == a && n == o && e == r)
                            return !1;
                        t = Math.abs(t - l[0]),
                        n = Math.abs(n - l[1]),
                        e = Math.abs(e - l[2]);
                        return t < 1 && n < 1 && e < 1
                    }
                    for (var c, d, u, h, f, p, g = i.height, m = i.width; n.length; ) {
                        for (c = n.pop(),
                        d = c[0],
                        u = c[1],
                        h = 4 * (u * m + d); 0 <= u-- && s(h); )
                            h -= 4 * m;
                        for (h += 4 * m,
                        ++u,
                        p = f = !1; u++ < g - 1 && s(h); )
                            Rt(i, h, a, o, r),
                            0 < d && (s(h - 4) ? f || (n.push([d - 1, u]),
                            f = !0) : f = f && !1),
                            d < m - 1 && (s(h + 4) ? p || (n.push([d + 1, u]),
                            p = !0) : p = p && !1),
                            h += 4 * m
                    }
                    je.putImageData(i, 0, 0)
                }
            }(Et(Math.floor(e[2]), 0, Ge.width), Et(Math.floor(e[3]), 0, Ge.height), s.r, s.g, s.b)
        }
        return t
    }
    function Et(e, t, n) {
        return e < t ? t : n < e ? n : e
    }
    function Rt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n,
        e.data[t + 1] = a,
        e.data[t + 2] = o,
        e.data[t + 3] = 255)
    }
    function Tt(e, t, n, a, o, r, i, l) {
        var s = Math.floor(o / 2)
          , c = s * s
          , d = Math.min(e, n) - s
          , u = Math.min(t, a) - s
          , h = Math.max(e, n) + s
          , o = Math.max(t, a) + s;
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
        var p = je.getImageData(d, u, h - d, o - u);
        if (e == n && t == a)
            f(e, t);
        else {
            f(e, t),
            f(n, a);
            var g = Math.abs(n - e)
              , m = Math.abs(a - t)
              , y = e < n ? 1 : -1
              , v = t < a ? 1 : -1
              , S = g - m;
            for (Math.floor(Math.max(0, s - 10) / 5); e != n || t != a; ) {
                var b = S << 1;
                -m < b && (S -= m,
                e += y),
                b < g && (S += g,
                t += v),
                f(e, t)
            }
        }
        je.putImageData(p, d, u)
    }
    function Nt() {
        je.fillStyle = "#FFF",
        je.fillRect(0, 0, Ge.width, Ge.height)
    }
    var Wt = !1;
    function Ot(e) {
        var t = c.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        gt(Te + Math.round(Et((e - t.left) / t.width, 0, 1) * (Ne - Te)))
    }
    R("#game-toolbar .slider", "mousedown", function(e) {
        0 == e.button && (Wt = !0,
        Ot(e.clientX))
    }),
    R("#game-toolbar .slider", "touchstart", function(e) {
        Wt = !0,
        Ot(e.touches[0].clientX)
    }),
    R(Oe, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    }),
    R("#game-toolbar .colors * .item", "mousedown", function(e) {
        var t = this.colorIndex;
        0 == e.button ? (e.altKey ? bt : St)(t) : 2 == e.button && bt(t)
    }),
    R([Ge], "DOMMouseScroll wheel", function(e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY,
        e = Math.sign(e);
        gt(ut + 4 * e)
    }),
    R(c, "keypress", function(e) {
        if ("Enter" == e.code)
            return le.focus(),
            0;
        if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != ht)
            return 0;
        for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < Fe.length; n++)
            if ($.hotkeysTools[Fe[n].id].toLowerCase() == t)
                return vt(Fe[n].id),
                e.preventDefault(),
                0;
        for (n = 0; n < _e.length; n++)
            if ($.hotkeysActions[_e[n].id].toLowerCase() == t)
                return yt(_e[n].id),
                e.preventDefault(),
                0
    }),
    R(c, "touchmove", function(e) {
        Wt && Ot(e.touches[0].clientX)
    }),
    R(c, "touchend touchcancel", function(e) {
        Wt = !1
    }),
    R(Ge, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    }),
    R(Ge, "mousedown", function(e) {
        e.preventDefault(),
        0 != e.button && 2 != e.button || -1 != ht || Ut(e.button, e.clientX, e.clientY, !0, -1)
    }),
    R(c, "mouseup", function(e) {
        e.preventDefault(),
        Bt(e.button),
        Wt = !1
    }),
    R(c, "mousemove", function(e) {
        Ht(e.clientX, e.clientY, !1, -1),
        Wt && Ot(e.clientX)
    });
    var zt = null;
    function Pt(e, t, n, a) {
        var o = Ge.getBoundingClientRect()
          , e = Math.floor((e - o.left) / o.width * Ge.width)
          , o = Math.floor((t - o.top) / o.height * Ge.height);
        a ? (nt = n,
        tt[0] = et[0] = e,
        tt[1] = et[1] = o) : (tt[0] = et[0],
        tt[1] = et[1],
        nt = n,
        et[0] = e,
        et[1] = o)
    }
    R(Ge, "touchstart", function(e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == zt && (zt = e[0].identitfier,
        Ut(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }),
    R(Ge, "touchend touchcancel", function(e) {
        e.preventDefault(),
        Bt(ht)
    }),
    R(Ge, "touchmove", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == zt) {
                Ht(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    });
    var Yt = 0;
    function Ht(e, t, n, a) {
        Pt(e, t, a = !$.pressureSensitivity ? -1 : a, n),
        Ft(!1)
    }
    function Ut(e, t, n, a, o) {
        Xe.length,
        ht = e,
        Pt(t, n, o, a),
        Ft(!0)
    }
    function Bt(e) {
        -1 == e || 0 != e && 2 != e || ht != e || (Yt != Xe.length && (Yt = Xe.length,
        Qe.push(Yt)),
        zt = null,
        ht = -1)
    }
    function Ft(n) {
        if (Sn.id == f && yn == gn && -1 != ht) {
            var a = 0 == ht ? st : ct;
            let t = null;
            if (n) {
                var o = function(e, t) {
                    var n = (t = je.getImageData(e, t, 1, 1)).data[0]
                      , a = t.data[1]
                      , o = t.data[2];
                    for (let e = 0; e < dt.length; e++) {
                        var r = dt[e]
                          , l = r[0] - n
                          , s = r[1] - a
                          , r = r[2] - o;
                        if (0 == l && 0 == s && 0 == r)
                            return e
                    }
                    return i
                }(et[0], et[1]);
                if (lt == Re) {
                    if (o == a)
                        return;
                    t = (r = a,
                    l = et[0],
                    s = et[1],
                    [De, r, l, s])
                }
                if (lt == Ee)
                    return (0 == ht ? St : bt)(o),
                    void vt(it)
            }
            if (lt == Ie) {
                let e = ut;
                0 <= nt && (e = (e - Te) * Et(nt, 0, 1) + Te),
                t = (n = a,
                r = e,
                l = tt[0],
                s = tt[1],
                o = et[0],
                a = et[1],
                [Ae, n, r, l, s, o, a])
            }
            null != t && Dt(t)
        }
        var r, l, s
    }
    setInterval(()=>{
        var e, t;
        fn && Sn.id == f && yn == gn && 0 < Xe.length - Ve && (t = Xe.slice(Ve, e = Ve + 8),
        fn.emit("data", {
            id: ba,
            data: t
        }),
        Ve = Math.min(e, Xe.length))
    }
    , 50),
    setInterval(function() {
        fn && Sn.id == f && yn != gn && Ze < Xe.length && (Lt(It(Xe[Ze]), Xe[Ze]),
        Ze++)
    }, 3);
    var _t = c.querySelector("#game-canvas .overlay")
      , Gt = c.querySelector("#game-canvas .overlay-content")
      , jt = c.querySelector("#game-canvas .overlay-content .text")
      , Xt = c.querySelector("#game-canvas .overlay-content .words")
      , Vt = c.querySelector("#game-canvas .overlay-content .reveal")
      , Zt = c.querySelector("#game-canvas .overlay-content .result")
      , Kt = -100
      , Jt = 0
      , Qt = void 0;
    function en(e, r, i) {
        let l = Kt
          , s = Jt
          , c = e.top - l
          , d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001)
            i && i();
        else {
            let a = void 0
              , o = 0;
            Qt = u.requestAnimationFrame(function e(t) {
                null == a && (a = t);
                var n = t - a;
                a = t,
                o = Math.min(o + n, r);
                t = o / r,
                n = (n = t) < .5 ? .5 * function(e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function(e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2),
                t = t * t * (3 - 2 * t);
                Kt = l + c * n,
                Jt = s + d * t,
                Gt.style.top = Kt + "%",
                _t.style.opacity = Jt,
                o == r ? i && i() : Qt = u.requestAnimationFrame(e)
            })
        }
    }
    function tn(e) {
        e.classList.add("show")
    }
    function nn(l) {
        switch (!function() {
            for (var e = 0; e < Gt.children.length; e++)
                Gt.children[e].classList.remove("show")
        }(),
        l.id) {
        case w:
            tn(jt),
            jt.textContent = Me("Round $", l.data + 1);
            break;
        case b:
            tn(jt),
            jt.textContent = Me("Waiting for players...");
            break;
        case k:
            tn(jt),
            jt.textContent = Me("Game starting in a few seconds...");
            break;
        case q:
            tn(Vt),
            Vt.querySelector("p span.word").textContent = l.data.word,
            Vt.querySelector(".reason").textContent = function(e) {
                switch (e) {
                case y:
                    return Me("Everyone guessed the word!");
                case S:
                    return Me("The drawer left the game!");
                case v:
                    return Me("Time is up!");
                default:
                    return "Error!"
                }
            }(l.data.reason);
            var e = Vt.querySelector(".player-container");
            N(e);
            for (var t = [], n = 0; n < l.data.scores.length; n += 3) {
                var a = l.data.scores[n + 0]
                  , o = (l.data.scores[n + 1],
                l.data.scores[n + 2]);
                (s = La(a)) && t.push({
                    name: s.name,
                    score: o
                })
            }
            t.sort(function(e, t) {
                return t.score - e.score
            });
            for (n = 0; n < t.length; n++) {
                var r = T("player")
                  , s = t[n];
                r.appendChild(T("name", s.name));
                var c = T("score", (0 < s.score ? "+" : "") + s.score);
                s.score <= 0 && c.classList.add("zero"),
                r.appendChild(c),
                e.appendChild(r)
            }
            break;
        case x:
            tn(Zt);
            let i = [Zt.querySelector(".podest-1"), Zt.querySelector(".podest-2"), Zt.querySelector(".podest-3"), Zt.querySelector(".ranks")];
            for (let e = 0; e < 4; e++)
                N(i[e]);
            if (0 < l.data.length) {
                let r = [[], [], [], []];
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
                        var u = a.map(function(e) {
                            return e.player.name
                        }).join(", ")
                          , h = a[0].player.score;
                        let e = i[o];
                        e.appendChild(T("rank-place", "#" + (o + 1))),
                        e.appendChild(T("rank-name", u)),
                        e.appendChild(T("rank-score", Me("$ points", h)));
                        let n = T("avatar-container");
                        e.appendChild(n),
                        0 == o && n.appendChild(T("trophy"));
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
                    let e = T("rank")
                      , t = W(p.player.avatar, 48, !1);
                    t.style.width = "48px",
                    t.style.height = "48px",
                    e.appendChild(t),
                    e.appendChild(T("rank-name", "#" + (p.rank + 1) + " " + p.player.name)),
                    e.appendChild(T("rank-score", Me("$ points", p.player.score))),
                    i[3].appendChild(e)
                }
                0 < r[0].length ? (m = r[0].map(function(e) {
                    return e.player.name
                }).join(", "),
                Zt.querySelector(".winner-name").textContent = 0 < r[0].length ? m : "<user left>",
                Zt.querySelector(".winner-text").textContent = " " + (1 == r[0].length ? Me("is the winner!") : Me("are the winners!"))) : (Zt.querySelector(".winner-name").textContent = "",
                Zt.querySelector(".winner-text").textContent = Me("Nobody won!"))
            } else
                Zt.querySelector(".winner-name").textContent = "",
                Zt.querySelector(".winner-text").textContent = Me("Nobody won!");
            break;
        case C:
            if (l.data.words)
                if (tn(jt),
                tn(Xt),
                N(Xt),
                vn[M.WORDMODE] == L.COMBINATION) {
                    jt.textContent = Me("Choose the first word");
                    let a = l.data.words.length / 2
                      , o = []
                      , r = []
                      , i = 0;
                    for (let n = 0; n < a; n++) {
                        let e = T("word", l.data.words[n]);
                        e.index = n;
                        let t = T("word", l.data.words[n + a]);
                        t.index = n,
                        t.style.display = "none",
                        t.style.animationDelay = .03 * n + "s",
                        o.push(e),
                        r.push(t),
                        R(e, "click", function() {
                            i = this.index;
                            for (let e = 0; e < a; e++)
                                o[e].style.display = "none",
                                r[e].style.display = "";
                            jt.textContent = Me("Choose the second word")
                        }),
                        R(t, "click", function() {
                            na([i, this.index])
                        }),
                        Xt.appendChild(e),
                        Xt.appendChild(t)
                    }
                } else {
                    jt.textContent = Me("Choose a word");
                    for (n = 0; n < l.data.words.length; n++) {
                        var g = T("word", l.data.words[n]);
                        g.index = n,
                        R(g, "click", function() {
                            na(this.index)
                        }),
                        Xt.appendChild(g)
                    }
                }
            else {
                tn(jt);
                var m = (s = La(l.data.id)) ? s.name : Me("User");
                jt.textContent = Me("$ is choosing a word!", m)
            }
        }
    }
    const an = 0
      , on = 1
      , rn = 2
      , ln = 3
      , sn = 4
      , cn = 5
      , dn = 6;
    function un(e, t) {
        this.url = t,
        this.buffer = null,
        this.loaded = !1;
        var n = this
          , a = new XMLHttpRequest;
        a.open("GET", t, !0),
        a.responseType = "arraybuffer",
        a.onload = function() {
            e.context.decodeAudioData(a.response, function(e) {
                n.buffer = e,
                n.loaded = !0
            }, function(e) {
                console.log("Failed loading audio from url '" + t + "'")
            })
        }
        ,
        a.send()
    }
    var hn = function() {
        this.context = null,
        this.sounds = new Map,
        u.addEventListener("load", this.load.bind(this), !1)
    };
    hn.prototype.addSound = function(e, t) {
        this.sounds.set(e, new un(this,t))
    }
    ,
    hn.prototype.loadSounds = function() {
        this.addSound(an, "/audio/roundStart.ogg"),
        this.addSound(on, "/audio/roundEndSuccess.ogg"),
        this.addSound(rn, "/audio/roundEndFailure.ogg"),
        this.addSound(ln, "/audio/join.ogg"),
        this.addSound(sn, "/audio/leave.ogg"),
        this.addSound(cn, "/audio/playerGuessed.ogg"),
        this.addSound(dn, "/audio/tick.ogg")
    }
    ,
    hn.prototype.playSound = function(e) {
        var t, n;
        null != this.context && ("running" == this.context.state ? null == this.context || $.audioMute || !this.sounds.has(e) || (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer,
        n.connect(this.context.destination),
        n.start(0)) : this.context.resume().then(()=>{
            this.playSound(e)
        }
        ))
    }
    ,
    hn.prototype.load = function() {
        try {
            u.AudioContext = u.AudioContext || u.webkitAudioContext,
            this.context = new AudioContext
        } catch (e) {
            return console.log("Error creating AudioContext."),
            void (this.context = null)
        }
        this.loadSounds()
    }
    ;
    b;
    var fn, pn = [], gn = 0, mn = -1, yn = -1, vn = [], Sn = {
        id: -1,
        time: 0,
        data: 0
    }, bn = 0, kn = void 0, wn = new hn, Cn = void 0, qn = !1, xn = !1, Mn = c.querySelector("#game-container"), Ln = c.querySelector("#game-room"), $n = c.querySelector("#game-players"), An = c.querySelector("#game-chat"), Dn = (c.querySelector("#game-board"),
    c.querySelector("#game-info")), In = c.querySelector("#game-bar"), En = $n.querySelector(".list"), Rn = $n.querySelector(".footer"), Tn = c.querySelector("#game-round"), Nn = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")], Wn = c.querySelector("#home .container-name-lang input"), On = c.querySelector("#home .container-name-lang select"), zn = c.querySelector("#home .panel .button-play"), e = c.querySelector("#home .panel .button-create");
    function Pn(e) {
        qn = e,
        c.querySelector("#load").style.display = e ? "block" : "none"
    }
    function Yn(e, t, n, a) {
        var o, r;
        o = e,
        e = t,
        r = function(e, t) {
            switch (e) {
            case 200:
                return void n({
                    success: !0,
                    data: t
                });
            case 503:
            case 0:
                a && Q(B, Me("Servers are currently undergoing maintenance!") + "\n\r" + Me("Please try again later!"));
                break;
            default:
                a && Q(B, Me("An unknown error occurred ('$')", e) + "\n\r" + Me("Please try again later!"))
            }
            n({
                success: !1,
                error: e
            })
        }
        ,
        (t = new XMLHttpRequest).onreadystatechange = function() {
            4 == this.readyState && r(this.status, this.response)
        }
        ,
        t.open("POST", o, !0),
        t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        t.send(e)
    }
    var Hn = null;
    function Un(t) {
        let n = !1;
        if (u.localStorageAvailable) {
            let e = o.getItem("lastAd")
              , t = new Date;
            var a;
            o.setItem("lastAd", t.toString()),
            null == e ? e = t : (e = new Date(Date.parse(e)),
            a = Math.abs(e - t),
            n = 1 <= a / 1e3 / 60)
        }
        if (n)
            try {
                aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (Hn = t,
                aiptag.cmd.player.push(function() {
                    adplayer.startPreRoll()
                })) : t()
            } catch (e) {
                console.log(e),
                t()
            }
        else
            t()
    }
    function Bn(e, t, n) {
        wn.context.resume(),
        fn && ta();
        let a = 0;
        (fn = r(e, {
            closeOnBeforeunload: !1
        })).on("connect", function() {
            fn.on("joinerr", function(e) {
                ta(),
                Q(B, function(e) {
                    switch (e) {
                    case 1:
                        return Me("Room not found!");
                    case 2:
                        return Me("Room is full!");
                    case 3:
                        return Me("You are on a kick cooldown!");
                    case 4:
                        return Me("You are banned from this room!");
                    default:
                        return Me("An unknown error ('$') occured!", e)
                    }
                }(e))
            }),
            fn.on("data", Ma);
            var e = Wn.value.split("#")
              , e = {
                join: t,
                create: n ? 1 : 0,
                name: e[0],
                lang: On.value,
                code: e[1],
                avatar: $.avatar
            };
            fn.emit("login", e)
        }),
        fn.on("reason", function(e) {
            a = e
        }),
        fn.on("disconnect", function() {
            switch (a) {
            case g:
                Q(F, Me("You have been kicked!"));
                break;
            case m:
                Q(F, Me("You have been banned!"));
                break;
            default:
                Q(F, Me("Connection lost!"))
            }
            ta()
        }),
        fn.on("connect_error", e=>{
            ta(),
            Q(B, e.message)
        }
        )
    }
    function Fn(t) {
        var e;
        qn || (e = "" != t ? "id=" + t : "lang=" + On.value,
        re(),
        Pn(!0),
        Un(function() {
            Yn(location.origin + ":3000/play", e, function(e) {
                Pn(!1),
                e.success && Bn(e.data, t)
            }, !0)
        }))
    }
    function _n(e) {
        let n = []
          , a = e.split(",");
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
    function Gn() {
        var e = K[_].querySelector(".filter select.lang").value;
        Yn(location.origin + ":3000/rooms", "lang=" + e, function(e) {
            e.success && ae(_n(e.data))
        })
    }
    function jn(e) {
        var t;
        wn.playSound(ln),
        vt(Ie, !0),
        gt(12),
        St(1),
        bt(0),
        $t(!0),
        N(se),
        c.querySelector("#home").style.display = "none",
        c.querySelector("#game").style.display = "flex",
        gn = e.me,
        e.type,
        kn = e.id,
        c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id,
        t = e.settings,
        vn = t,
        Xn(),
        N(En),
        pn = [];
        for (var n = 0; n < e.users.length; n++)
            $a(e.users[n], !1);
        Ra(),
        Na(),
        Zn(e.round),
        ia(e.owner),
        Jn(e.state, !0),
        xn || ((adsbygoogle = u.adsbygoogle || []).push({}),
        (adsbygoogle = u.adsbygoogle || []).push({}),
        xn = !0)
    }
    function Xn() {
        Zn(bn);
        for (var e, t = 0; t < za.length; t++) {
            var n = za[t];
            n.index && (n = vn[(e = n).index],
            "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }
    function Vn(e, t, n) {
        vn[e] = t,
        n && fn && fn.emit("data", {
            id: fa,
            data: {
                id: e,
                val: t
            }
        }),
        Xn()
    }
    function Zn(e) {
        bn = e,
        Tn.textContent = Me("Round $ of $", [bn + 1, vn[M.ROUNDS]])
    }
    function Kn() {
        for (let e = 0; e < pn.length; e++)
            pn[e].score = 0;
        for (let e = 0; e < pn.length; e++)
            Wa(pn[e], !1),
            Oa(pn[e], !1),
            Ta(pn[e])
    }
    function Jn(a, e) {
        var t, n;
        if (t = Sn = a,
        null != Qt && (u.cancelAnimationFrame(Qt),
        Qt = void 0),
        t.id == f || t.id == p ? en({
            top: -100,
            opacity: 0
        }, 600, function() {
            _t.classList.remove("show")
        }) : _t.classList.contains("show") ? en({
            top: -100,
            opacity: 1
        }, 600, function() {
            nn(t),
            en({
                top: 0,
                opacity: 1
            }, 600)
        }) : (_t.classList.add("show"),
        nn(t),
        en({
            top: 0,
            opacity: 1
        }, 600)),
        n = a.time,
        Fa(),
        Ba = n,
        Ha.textContent = Ba,
        Ua = setInterval(function() {
            Ba = Math.max(0, Ba - 1),
            Ha.textContent = Ba;
            var e = -1;
            Sn.id == f && (e = Pa),
            Sn.id == C && (e = Ya),
            Ha.style.animationName = Ba < e ? Ba % 2 == 0 ? "rot_left" : "rot_right" : "none",
            Ba < e && wn.playSound(dn),
            Ba <= 0 && Fa()
        }, 1e3),
        Oe.classList.add("hidden"),
        rt(),
        ea(!1),
        a.id == p ? (Kn(),
        Ln.style.display = "flex",
        Mn.style.display = "none",
        In.style.display = "none",
        An.classList.add("room"),
        $n.parentNode.removeChild($n),
        Ln.querySelector(".container .players").appendChild($n),
        $n.classList.add("room")) : (Ln.style.display = "none",
        Mn.style.display = "",
        In.style.display = "",
        An.classList.remove("room"),
        $n.parentNode.removeChild($n),
        Mn.prepend($n),
        $n.classList.remove("room")),
        a.id == w && (Zn(a.data),
        0 == a.data && Kn()),
        a.id == q) {
            gn != yn && ra(a.data.word);
            for (var o = 0; o < a.data.scores.length; o += 3) {
                var r = a.data.scores[o + 0]
                  , i = a.data.scores[o + 1]
                  , r = (a.data.scores[o + 2],
                La(r));
                r && (r.score = i)
            }
            Na();
            for (var l = !0, o = 0; o < pn.length; o++)
                if (pn[o].guessed) {
                    l = !1;
                    break
                }
            l ? wn.playSound(rn) : wn.playSound(on),
            ve(Me("The word was '$'", a.data.word), "", ye(he), !0)
        } else
            a.id != f && (Nn[0].textContent = Me("WAITING"),
            Nn[0].classList.add("waiting"),
            Nn[1].style.display = "none",
            Nn[2].style.display = "none");
        if (a.id == f) {
            if (yn = a.data.id,
            wn.playSound(an),
            $t(!0),
            a.data.drawCommands && (Xe = a.data.drawCommands),
            ve(Me("$ is drawing now!", La(yn).name), "", ye(ue), !0),
            !e)
                for (o = 0; o < pn.length; o++)
                    Wa(pn[o], !1);
            Nn[0].classList.remove("waiting"),
            yn == gn ? (e = a.data.word,
            Nn[0].textContent = Me("DRAW THIS"),
            Nn[1].style.display = "",
            Nn[2].style.display = "none",
            Nn[1].textContent = e,
            Oe.classList.remove("hidden"),
            rt()) : (ea(!0),
            aa(a.data.word, !1),
            oa(a.data.hints))
        } else {
            yn = -1;
            for (o = 0; o < pn.length; o++)
                Wa(pn[o], !1)
        }
        if (a.id == x && 0 < a.data.length) {
            let t = []
              , n = 0;
            for (let e = 0; e < a.data.length; e++) {
                var s = a.data[e][0]
                  , c = a.data[e][1]
                  , s = La(s);
                s && 0 == c && (n = s.score,
                t.push(s.name))
            }
            1 == t.length ? ve(Me("$ won with a score of $!", [t[0], n]), "", ye(pe), !0) : 1 < t.length && ve(Me("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", ye(pe), !0)
        }
        for (o = 0; o < pn.length; o++)
            Oa(pn[o], pn[o].id == yn);
        Ra()
    }
    function Qn(e) {
        fn && fn.connected && Sn.id == f && (fn.emit("data", {
            id: da,
            data: e
        }),
        ea(!1))
    }
    function ea(e) {
        c.querySelector("#game-rate").style.display = e ? "" : "none"
    }
    function ta() {
        fn && fn.close(),
        fn = void 0,
        $t(),
        Fa(),
        pn = [],
        vn = [],
        Sn = {
            id: yn = mn = -1,
            time: gn = 0,
            data: 0
        },
        c.querySelector("#home").style.display = "",
        c.querySelector("#game").style.display = "none"
    }
    function na(e) {
        fn && fn.connected && Sn.id == C && fn.emit("data", {
            id: Sa,
            data: e
        })
    }
    function aa(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++)
            n += t[e];
        var a = !e && 1 == vn[M.WORDMODE];
        a && (n = 3),
        Nn[0].textContent = Me(a ? "WORD HIDDEN" : "GUESS THIS"),
        Nn[1].style.display = "none",
        Nn[2].style.display = "",
        N(Nn[2]),
        Nn[2].hints = [];
        for (var o = 0; o < n; o++)
            Nn[2].hints[o] = T("hint", a ? "?" : "_"),
            Nn[2].appendChild(Nn[2].hints[o]);
        a || Nn[2].appendChild(T("word-length", t.join(" ")))
    }
    function oa(e) {
        for (var t = Nn[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0]
              , o = e[n][1];
            t[a].textContent = o,
            t[a].classList.add("uncover")
        }
    }
    function ra(e) {
        (!Nn[2].hints || Nn[2].hints.length < e.length) && aa([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++)
            t.push([n, e.charAt(n)]);
        oa(t)
    }
    function ia(e) {
        mn = e;
        for (var t = 0; t < pn.length; t++)
            z(pn[t].element, pn[t].id == mn),
            Ia(pn[t], 0, pn[t].id == mn);
        !function(t) {
            c.querySelector("#start-game").disabled = t;
            for (var n = 0; n < za.length; n++) {
                let e = za[n];
                e.element.disabled = t
            }
        }(gn != mn);
        e = La(mn);
        e && ve(Me("$ is now the room owner!", e.name), "", ye(pe), !0)
    }
    adplayer = null,
    aiptag.cmd.player.push(function() {
        console.log("ad player loaded"),
        adplayer = new aipPlayer({
            AD_WIDTH: 960,
            AD_HEIGHT: 540,
            AD_FULLSCREEN: !1,
            AD_CENTERPLAYER: !0,
            LOADING_TEXT: "loading advertisement",
            PREROLL_ELEM: function() {
                return c.getElementById("preroll")
            },
            AIP_COMPLETE: function(e) {
                Hn()
            },
            AIP_REMOVE: function() {}
        })
    }),
    R(K[_].querySelector(".filter select.lang"), "change", Gn),
    R(K[_].querySelector("button.refresh"), "click", Gn);
    const la = 1
      , sa = 2
      , ca = 5
      , da = 8
      , ua = 10
      , ha = 11
      , fa = 12
      , pa = 13
      , ga = 14
      , ma = 15
      , ya = 16
      , va = 17
      , Sa = 18
      , ba = 19
      , ka = 20
      , wa = 21;
    const Ca = 30
      , qa = 31
      , xa = 32;
    function Ma(e) {
        var t = e.id
          , n = e.data;
        switch (t) {
        case ua:
            jn(n);
            break;
        case ha:
            Jn(n);
            break;
        case fa:
            Vn(n.id, n.val, !1);
            break;
        case pa:
            oa(n);
            break;
        case ga:
            Ba = n;
            break;
        case la:
            ve(Me("$ joined the room!", $a(n, !0).name), "", ye(he), !0),
            wn.playSound(ln);
            break;
        case sa:
            var a = function(e) {
                for (var t = 0; t < pn.length; t++) {
                    var n = pn[t];
                    if (n.id == e)
                        return pn.splice(t, 1),
                        n.element.remove(),
                        Na(),
                        Ra(),
                        n
                }
                return
            }(n.id);
            a && (ve(function(e, t) {
                switch (e) {
                default:
                    return Me("$ left the room!", t);
                case g:
                    return Me("$ has been kicked!", t);
                case m:
                    return Me("$ has been banned!", t)
                }
            }(n.reason, a.name), "", ye(fe), !0),
            wn.playSound(sn),
            n.reason != g && n.reason != m || $t(!0));
            break;
        case ca:
            var a = La(n[0])
              , o = La(n[1])
              , r = n[2]
              , i = n[3];
            a && o && ve(Me("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", ye(de), !0);
            break;
        case ma:
            var l = La(n.id);
            if (l) {
                let e = ve(Me("$ guessed the word!", l.name), "", ye(he), !0);
                e.classList.add("guessed"),
                Wa(l, !0),
                wn.playSound(cn),
                n.id == gn && ra(n.word)
            }
            break;
        case da:
            o = La(n.id);
            o && (r = o,
            i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif",
            (l = T("icon")).style.backgroundImage = "url(/img/" + i + ")",
            Da(r, l),
            n.vote ? ve(Me("$ liked the drawing!", o.name), "", ye(he), !0) : ve(Me("$ disliked the drawing!", o.name), "", ye(fe), !0));
            break;
        case va:
            ia(n);
            break;
        case ya:
            ve(Me("$ is close!", n), "", ye(de), !0);
            break;
        case Ca:
            Aa(La(n.id), n.msg);
            break;
        case xa:
            ve(Me("Spam detected! You're sending messages too quickly."), "", ye(fe), !0);
            break;
        case qa:
            switch (n.id) {
            case 0:
                ve(Me("You need at least 2 players to start the game!"), "", ye(fe), !0);
                break;
            case 100:
                ve(Me("Server restarting in about $ seconds!", n.data), "", ye(fe), !0)
            }
            break;
        case ba:
            for (var s = 0; s < n.length; s++)
                Dt(n[s]);
            break;
        case ka:
            $t(!0);
            break;
        case wa:
            qt(n);
            break;
        default:
            return void console.log("Unimplemented data packed received with id " + t)
        }
    }
    function La(e) {
        for (var t = 0; t < pn.length; t++) {
            var n = pn[t];
            if (n.id == e)
                return n
        }
    }
    function $a(e, t) {
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
            element: T("player"),
            bubble: void 0
        };
        pn.push(n);
        var a = n.id == gn ? Me("$ (You)", n.name) : n.name
          , o = T("info")
          , e = T("name", a);
        n.id == gn && e.classList.add("me"),
        o.appendChild(e),
        o.appendChild(T("rank", "#" + n.rank)),
        o.appendChild(T("score", Me("$ points", n.score))),
        n.element.appendChild(o);
        var r = W(n.avatar);
        n.element.drawing = T("drawing"),
        r.appendChild(n.element.drawing),
        n.element.appendChild(r),
        En.appendChild(n.element),
        R(n.element, "click", function() {
            Cn = n,
            Q(U, n)
        });
        4 == (4 & n.flags) && (n.interval = setInterval(function() {
            n.avatar[0] = (n.avatar[0] + 1) % h[0],
            n.avatar[1] = (n.avatar[1] + 1) % h[1],
            n.avatar[2] = (n.avatar[2] + 1) % h[2],
            O(r, n.avatar)
        }, 250));
        a = T("icons"),
        e = T("icon owner"),
        o = T("icon muted");
        return a.appendChild(e),
        a.appendChild(o),
        n.element.appendChild(a),
        n.element.icons = [e, o],
        Wa(n, n.guessed),
        t && Ra(),
        n
    }
    function Aa(e, t) {
        var n;
        e.muted || (n = e.id == yn || e.guessed,
        gn != yn && !La(gn).guessed && n || (Da(e, T("text", t)),
        ve(e.name, t, ye(n ? ge : ce))))
    }
    function Da(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout),
        e.bubble.remove(),
        e.bubble = void 0);
        var n = T("bubble")
          , a = T("content");
        a.appendChild(t),
        n.appendChild(T("arrow")),
        n.appendChild(a),
        e.element.appendChild(n),
        e.bubble = n,
        e.bubble.timeout = setTimeout(function() {
            e.bubble.remove(),
            e.bubble = void 0
        }, 1500)
    }
    function Ia(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ea = void 0;
    function Ra() {
        var e = Sn.id == p
          , t = e ? 112 : 48
          , n = Math.max(t, En.clientHeight);
        let a = Math.floor(n / t);
        e && (o = Math.floor(En.clientWidth / 96),
        a *= o);
        e = Math.ceil(pn.length / a);
        for (let e = 0; e < pn.length; e++)
            pn[e].page = Math.floor(e / a);
        var o = c.querySelectorAll("#game-players .player-amount b");
        o[0].textContent = pn.length,
        o[1].textContent = vn[M.SLOTS],
        null == Ea ? Ea = P(Rn, e, [$n], function(e, n, t) {
            let a = [];
            for (let t = 0; t < pn.length; t++) {
                let e = pn[t];
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
        }) : Y(Ea, e),
        Ea.element.style.display = 1 < e ? "" : "none"
    }
    function Ta(t) {
        let n = 1;
        for (let e = 0; e < pn.length; e++) {
            var a = pn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n,
        t.element.querySelector(".score").textContent = Me("$ points", t.score);
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n,
        e.classList.remove("first"),
        e.classList.remove("second"),
        e.classList.remove("third"),
        1 == n && e.classList.add("first"),
        2 == n && e.classList.add("second"),
        3 == n && e.classList.add("third")
    }
    function Na() {
        for (var e = 0; e < pn.length; e++)
            Ta(pn[e])
    }
    function Wa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }
    function Oa(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var za = [];
    !function() {
        let e = Ln.querySelectorAll('*[id^="item-"]');
        for (var n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            za.push(t),
            R(t.element, "change", function() {
                let e = this.value;
                "checkbox" == this.type && (e = this.checked ? 1 : 0),
                console.log("lobby setting " + t.id + " changed to " + e),
                null != t.index && Vn(t.index, e, !0)
            })
        }
    }();
    const Pa = 10
      , Ya = 4;
    var Ha = c.querySelector("#game-clock")
      , Ua = null
      , Ba = 0;
    function Fa() {
        Ua && (clearInterval(Ua),
        Ua = null)
    }
    var _a, Ga, ja, Xa, Va, Za, hn = c.querySelector("#tutorial"), Ka = hn.querySelectorAll(".page"), Ja = P(hn, Ka.length, [hn.querySelector(".pages")], function(e, t, n) {
        n && clearInterval(Qa);
        for (let e = 0; e < Ka.length; e++)
            Ka[e].classList.remove("active");
        Ka[t].classList.add("active")
    }), Qa = setInterval(function() {
        Ja.selected < 4 ? H(Ja, Ja.selected + 1, !1) : H(Ja, 0, !1)
    }, 3500), eo = c.querySelector("#setting-bar"), to = c.querySelector("#audio"), no = c.querySelector("#lightbulb");
    function ao() {
        eo.classList.remove("open")
    }
    function oo(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }
    function ro() {
        to.dataset.tooltip = $.audioMute ? "Unmute audio" : "Mute audio",
        no.dataset.tooltip = $.dark ? "Turn the lights on" : "Turn the lights off",
        Se && (Se.querySelector(".tooltip-content").textContent = Me(be.dataset.tooltip))
    }
    function io() {
        ve(Me("Copied room link to clipboard!"), "", ye(de), !0),
        function(e) {
            if (navigator.clipboard)
                navigator.clipboard.writeText(e).then(function() {
                    console.log("Async: Copying to clipboard was successful!")
                }, function(e) {
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
        }("https://skribbl.io/?" + kn)
    }
    function lo(e) {
        let t = ie.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }
    function so(e) {
        Za.parts[e].classList.remove("bounce"),
        Za.parts[e].offsetWidth,
        Za.parts[e].classList.add("bounce")
    }
    R(eo.querySelector(".icon"), "click", function() {
        oo(to, $.audioMute),
        oo(no, $.dark),
        ro(),
        eo.classList.contains("open") ? ao() : eo.classList.add("open")
    }),
    R("#audio", "click", function(e) {
        $.audioMute = !$.audioMute,
        oo(to, $.audioMute),
        ro(),
        I()
    }),
    R("#lightbulb", "click", function(e) {
        E(!$.dark),
        oo(no, $.dark),
        ro(),
        I()
    }),
    R("#hotkeys", "click", function(e) {
        ao(),
        Q(j)
    }),
    u.onbeforeunload = function(e) {
        return fn ? Me("Are you sure you want to leave?") : void 0
    }
    ,
    u.onunload = function() {
        fn && ta()
    }
    ,
    R([c, Ge], "mousedown touchstart", function(e) {
        eo.contains(e.target) || ao()
    }),
    R(u, "resize", Ra),
    R([Wn, On], "change", I),
    R(zn, "click", function() {
        var e, t, n;
        Fn((e = u.location.href,
        n = "",
        e = e.split("?"),
        n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
    }),
    R(e, "click", function() {
        qn || (re(),
        Pn(!0),
        Un(function() {
            Yn(location.origin + ":3000/play", "lang=" + On.value, function(e) {
                Pn(!1),
                e.success && Bn(e.data, 0, 1)
            }, !0)
        }))
    }),
    R(c.querySelector("#game-rate .like"), "click", function() {
        Qn(1)
    }),
    R(c.querySelector("#game-rate .dislike"), "click", function() {
        Qn(0)
    }),
    R(Dn, "click", io),
    R(c.querySelector("#start-game"), "click", function() {
        if (fn) {
            let t = c.querySelector("#item-settings-customwords").value.split(",")
              , e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++)
                    t[e] = t[e].trim();
                e = t.join(",")
            }
            fn.emit("data", {
                id: 22,
                data: e
            })
        }
    }),
    R(c.querySelector("#copy-invite"), "click", io),
    R(K[U].querySelector("button.kick"), "click", function() {
        re(),
        null != Cn && Cn.id != gn && gn == mn && fn && fn.emit("data", {
            id: 3,
            data: Cn.id
        })
    }),
    R(K[U].querySelector("button.ban"), "click", function() {
        re(),
        null != Cn && Cn.id != gn && gn == mn && fn && fn.emit("data", {
            id: 4,
            data: Cn.id
        })
    }),
    R(K[U].querySelector("button.votekick"), "click", function() {
        re(),
        null != Cn && Cn.id != gn && fn && (Cn.id == mn ? ve(Me("You can not votekick the lobby owner!"), "", ye(fe), !0) : fn.emit("data", {
            id: ca,
            data: Cn.id
        }))
    }),
    R(K[U].querySelector("button.mute"), "click", function() {
        null != Cn && Cn.id != gn && (Cn.muted = !Cn.muted,
        Ia(Cn, 1, Cn.muted),
        Cn.muted ? ve(Me("You muted '$'!", Cn.name), "", ye(fe), !0) : ve(Me("You unmuted '$'!", Cn.name), "", ye(fe), !0),
        fn && fn.emit("data", {
            id: 7,
            data: Cn.id
        }),
        J(Cn.muted))
    }),
    R(K[U].querySelector("button.report"), "click", function() {
        K[U].querySelector(".buttons").style.display = "none",
        K[U].querySelector(".report-menu").style.display = "";
        let t = K[U].querySelectorAll(".report-menu input");
        for (let e = 0; e < t.length; e++)
            t[e].checked = !1
    }),
    R(K[U].querySelector("button#report-send"), "click", function() {
        let e = 0;
        K[U].querySelector("#report-reason-toxic").checked && (e |= 1),
        K[U].querySelector("#report-reason-spam").checked && (e |= 2),
        K[U].querySelector("#report-reason-bot").checked && (e |= 4),
        0 < e && (null != Cn && Cn.id != gn && (Cn.reported = !0,
        fn && fn.emit("data", {
            id: 6,
            data: {
                id: Cn.id,
                reasons: e
            }
        }),
        ve(Me("Your report for '$' has been sent!", Cn.name), "", ye(de), !0)),
        re())
    }),
    R(K[j].querySelector("#select-display-language"), "change", function(e) {
        $.displayLang = e.target.value,
        I(),
        $e()
    }),
    R(K[j].querySelector("#select-pressure-sensitivity"), "change", function(e) {
        $.pressureSensitivity = e.target.value,
        I()
    }),
    R(K[j].querySelector("button.reset"), "click", function(e) {
        for (let e = 0; e < Fe.length; e++)
            Be(Fe[e], t[Fe[e].id]);
        for (let e = 0; e < _e.length; e++)
            Be(_e[e], n[_e[e].id]);
        I()
    }),
    R(le, "focusin focus", function(e) {
        e.preventDefault()
    }),
    R(le, "input", function(e) {
        lo(le.value.length)
    }),
    R(ie, "submit", function(e) {
        return e.preventDefault(),
        le.value && (fn && fn.connected ? fn.emit("data", {
            id: Ca,
            data: le.value
        }) : Aa(La(gn), le.value)),
        ie.reset(),
        lo(0),
        !1
    }),
    function() {
        if (!u.localStorageAvailable) {
            var e = !1;
            if (void 0 !== o)
                try {
                    o.setItem("feature_test", "yes"),
                    "yes" === o.getItem("feature_test") && (o.removeItem("feature_test"),
                    e = !0)
                } catch (e) {}
            u.localStorageAvailable = e
        }
        u.localStorageAvailable ? (Wn.value = A("name", ""),
        On.value = function(t) {
            var n = c.querySelectorAll("#home .panel .container-name-lang select option");
            for (let e = 0; e < n.length; e++)
                if (n[e].value == t)
                    return n[e].value;
            return 0
        }(A("lang", 0)),
        $.displayLang = A("displaylang", "en"),
        $.audioMute = 1 == parseInt(A("audio", 0)) ? 1 : 0,
        $.filterChat = 1 == parseInt(A("filter", 1)) ? 1 : 0,
        $.pressureSensitivity = 1 == parseInt(A("pressure", 1)) ? 1 : 0,
        $.hotkeysTools = D("tools", $.hotkeysTools),
        $.hotkeysActions = D("actions", $.hotkeysActions),
        function() {
            for (let e = 0; e < Fe.length; e++)
                Be(Fe[e], $.hotkeysTools[Fe[e].id]);
            for (let e = 0; e < _e.length; e++)
                Be(_e[e], $.hotkeysActions[_e[e].id])
        }(),
        $.avatar = D("ava", $.avatar),
        E(1 == parseInt(A("dark", 0)) ? 1 : 0),
        console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
    }(),
    function() {
        var t = c.querySelectorAll("[data-translate]");
        for (let e = 0; e < t.length; e++) {
            var n = t[e];
            Le(n, n.dataset.translate)
        }
    }(),
    $e(),
    R(_a = c.querySelectorAll("[data-tooltip]"), "mouseenter", function(e) {
        ke(e.target)
    }),
    R(_a, "mouseleave", function(e) {
        we()
    }),
    Ga = (Va = c.querySelector("#home .avatar-customizer")).querySelector(".container"),
    ja = Va.querySelectorAll(".arrows.left .arrow"),
    Xa = Va.querySelectorAll(".arrows.right .arrow"),
    Va = Va.querySelectorAll(".randomize"),
    (Za = W($.avatar, 96)).classList.add("fit"),
    Ga.appendChild(Za),
    R(ja, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        --$.avatar[e],
        $.avatar[e] < 0 && ($.avatar[e] = h[e] - 1),
        so(e),
        O(Za, $.avatar, 96),
        I()
    }),
    R(Xa, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        $.avatar[e] += 1,
        $.avatar[e] >= h[e] && ($.avatar[e] = 0),
        so(e),
        O(Za, $.avatar, 96),
        I()
    }),
    R(Va, "click", function() {
        $.avatar[0] = Math.floor(Math.random() * h[0]),
        $.avatar[1] = Math.floor(Math.random() * h[1]),
        $.avatar[2] = Math.floor(Math.random() * h[2]),
        so(1),
        so(2),
        O(Za, $.avatar, 96),
        I()
    }),
    function() {
        var t = Math.round(8 * Math.random());
        let n = c.querySelector("#home .logo-big .avatar-container");
        for (var a = 0; a < 8; a++) {
            let e = [0, 0, 0, -1];
            e[0] = a,
            e[1] = Math.round(100 * Math.random()) % s,
            e[2] = Math.round(100 * Math.random()) % d,
            1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random()));
            var o = W(e, 48, t == a);
            n.append(o)
        }
    }()
}(window, document, localStorage, io);
