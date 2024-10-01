((h, u, c, P) => {
  let z = 28,
    Y = 57,
    H = 51,
    n = [z, Y, H],
    U = 0,
    B = 1,
    G = 2,
    F = 5,
    _ = 0,
    j = 1,
    V = 2,
    K = 3,
    Z = 4,
    X = 5,
    J = 6,
    Q = 7,
    ee = 1,
    te = 2,
    ne = {
      LANG: 0,
      SLOTS: 1,
      DRAWTIME: 2,
      ROUNDS: 3,
      WORDCOUNT: 4,
      HINTCOUNT: 5,
      WORDMODE: 6,
      CUSTOMWORDSONLY: 7
    },
    ae = {
      NORMAL: 0,
      HIDDEN: 1,
      COMBINATION: 2
    }
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
        // IDENTIFY x.value.split: #home .container-name-lang input -> Pn
        // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> p
        return {
          id: id,
          name: name.length != 0 ? name : (Pn.value.split("#")[0] != "" ? Pn.value.split("#")[0] : "Player"),
          avatar: avatar.length == 0 ? p.avatar : avatar,
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
      lastConnect: 0,
      initListeners: (() => {
        let abort = false;
        document.addEventListener("clearDrawing", () => Bt());
        document.addEventListener("abortJoin", () => abort = true);
        document.addEventListener("joinLobby", (e) => {
          abort = false;
          let timeoutdiff = Date.now() - (typo.lastConnect == 0 ? Date.now() : typo.lastConnect);
          // Xn(true);
          setTimeout(() => {
            if (abort) return;
            typo.lastConnect = Date.now();
            // Yn.dispatchEvent(new Event("click"));
            // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
            // ##PRIVATELBBY## = !1
            // IDENTIFY: x:  = !1
            if (e.detail) window.history.pushState({path: window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);
            // ##JOINLOBBY##(e.detail?.join ? e.detail.join : "");
            // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
            typo.joinLobby();
            window.history.pushState({path: window.location.origin}, '', window.location.origin);
            // Bn(false);
            // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
            document.dispatchEvent(new Event("joinedLobby"));
          }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
        });
        document.addEventListener("leaveLobby", () => {
          if (typo.disconnect) typo.disconnect();
          else na() | document.dispatchEvent(new Event("leftLobby"));
          // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
        });
        document.addEventListener("setColor", (e) => {
          let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
          let match = yt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]);
          // IDENTIFY [0, 59, 120], -> COLORS
          let code = match >= 0 ? match : e.detail.code;
          if (e.detail.secondary) At(code);
          // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
          else Rt(code);
          // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
        });
        document.addEventListener("performDrawCommand", (e) => {
          S.push(e.detail);
          // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
          Ht(Ft(e.detail));
          // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
        });
        document.addEventListener("addTypoTooltips", () => {
          [...document.querySelectorAll("[data-typo-tooltip]")].forEach(elem => {
            elem.setAttribute("data-tooltip", elem.getAttribute("data-typo-tooltip"));
            elem.removeAttribute("data-typo-tooltip");
            elem.addEventListener("mouseenter", (e) => Pe(e.target));
            // IDENTIFY: x(e.target):
            elem.addEventListener("mouseleave", (e) => ze());
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
      }
    }
  // TYPOEND,
  oe = ["Normal", "Hidden", "Combination"],
    re = ["English", "German", "Bulgarian", "Czech", "Danish", "Dutch", "Finnish", "French", "Estonian", "Greek", "Hebrew", "Hungarian", "Italian", "Japanese", "Korean", "Latvian", "Macedonian", "Norwegian", "Portuguese", "Polish", "Romanian", "Russian", "Serbian", "Slovakian", "Spanish", "Swedish", "Tagalog", "Turkish"];
  if (h.localStorageAvailable = !1, void 0 !== c) try {
    c.setItem("feature_test", "yes"), "yes" === c.getItem("feature_test") && (c.removeItem("feature_test"), h.localStorageAvailable = !0)
  } catch (e) {}
  "virtualKeyboard" in navigator && (navigator.virtualKeyboard.overlaysContent = !0);
  var d = [];

  function ie(e) {
    for (var t = 0; t < d.length; t++)
      if (d[t].name == e) return d[t]
  }

  function le(e, t, n, a, o) {
    var r, i, l = t,
      s = (h.localStorageAvailable && (r = c.getItem("hotkey_" + e)) && (t = r), ie(e));
    return s ? (s.key = t, s.def = l, s.desc = n) : (s = {
      name: e,
      desc: n,
      key: t,
      def: l,
      listing: E("item"),
      changed: [],
      cb: []
    }, d.push(s), Be(r = E("key", s.name), "text"), s.listing.appendChild(r), (i = u.createElement("input")).value = s.key, s.listing.appendChild(i), $(i, "keydown", function(e) {
      for (var t = e.key, n = 0; n < d.length; n++)
        if (d[n].key == t) return void e.preventDefault();
      i.value = t, s.key = t;
      for (n = 0; n < s.changed.length; n++) s.changed[n](s);
      return se(), e.preventDefault(), !1
    }), y[g].querySelector("#hotkey-list").appendChild(s.listing)), a && s.cb.push(a), o && s.changed.push(o), s
  }

  function se() {
    if (h.localStorageAvailable)
      for (var e = 0; e < d.length; e++) h.localStorage.setItem("hotkey_" + d[e].name, d[e].key)
  }
  var p = {
    avatar: [Math.round(100 * Math.random()) % z, Math.round(100 * Math.random()) % Y, Math.round(100 * Math.random()) % H, -1],
    volume: 100,
    dark: 0,
    filterChat: 1,
    pressureSensitivity: 1,
    displayLang: "en",
    undefined
  };

  function a(e, t) {
    e = c.getItem(e);
    return null == e ? t : e
  }

  function ce() {
    h.localStorageAvailable ? (c.setItem("name", Pn.value), c.setItem("lang", zn.value), c.setItem("displaylang", p.displayLang), c.setItem("volume", p.volume), c.setItem("dark", 1 == p.dark ? 1 : 0), c.setItem("filter", 1 == p.filterChat ? 1 : 0), c.setItem("pressure", 1 == p.pressureSensitivity ? 1 : 0), c.setItem("ava", JSON.stringify(p.avatar)), console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
  }

  function $(e, t, n) {
    for (var a, o = e, r = ("string" == typeof e ? o = u.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]), t.split(" ")), i = 0; i < o.length; i++)
      for (var l = 0; l < r.length; l++) o[i].addEventListener(r[l], n)
  }

  function E(e, t) {
    var n = u.createElement("div");
    if (void 0 !== e)
      for (var a = e.split(" "), o = 0; o < a.length; o++) n.classList.add(a[o]);
    return void 0 !== t && (n.textContent = t), n
  }

  function de(e, t, n) {
    var a = u.createElement(e);
    if (void 0 !== t)
      for (var o = t.split(" "), r = 0; r < o.length; r++) a.classList.add(o[r]);
    return void 0 !== n && (a.textContent = n), a
  }

  function ue(e) {
    for (; e.firstChild;) e.removeChild(e.firstChild)
  }

  function he(e, t) {
    var n = E("avatar"),
      a = E("color"),
      o = E("eyes"),
      r = E("mouth"),
      i = E("special"),
      l = E("owner");
    return l.style.display = t ? "block" : "none", n.appendChild(a), n.appendChild(o), n.appendChild(r), n.appendChild(i), n.appendChild(l), n.parts = [a, o, r], pe(n, e), n
  }

  function pe(e, t) {
    function n(e, t, n) {
      var a = -t % n * 100,
        t = 100 * -Math.floor(t / n);
      e.style.backgroundPosition = a + "% " + t + "%"
    }
    var a = t[0] % z,
      o = t[1] % Y,
      r = t[2] % H,
      t = t[3],
      a = (n(e.querySelector(".color"), a, 10), n(e.querySelector(".eyes"), o, 10), n(e.querySelector(".mouth"), r, 10), e.querySelector(".special"));
    0 <= t ? (a.style.display = "", n(a, t, 10)) : a.style.display = "none"
  }

  function me(e, t) {
    e.querySelector(".owner").style.display = t ? "block" : "none"
  }

  function ge(e, t) {
    e.className = "avatar";
    for (var n of t) e.classList.add("filter-" + n)
  }

  function fe(e, t, n, a) {
    var o = {
      element: E("dots"),
      dots: [],
      selected: 0,
      change: a
    };
    return e.appendChild(o.element), n.push(o.element), $(n, "DOMMouseScroll wheel", function(e) {
      var t;
      1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), ve(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0), e.preventDefault(), e.stopPropagation())
    }), ye(o, t), o
  }

  function ye(e, t) {
    ue(e.element), e.dots = [];
    for (var n = 0; n < t; n++) {
      var a = E("dot");
      a.index = n, a.appendChild(E("inner")), $(a, "click", function() {
        ve(e, this.index, !0)
      }), e.element.appendChild(a), e.dots.push(a)
    }
    e.selected < 0 && (e.selected = 0), t <= e.selected && (e.selected = t - 1), ve(e, e.selected, !1)
  }

  function ve(e, t, n) {
    if (0 <= t && t < e.dots.length) {
      e.selected = t;
      for (var a = 0; a < e.dots.length; a++) e.dots[a].classList.remove("active");
      e.dots[t].classList.add("active"), e.change(e, t, n)
    }
  }
  let m = 0,
    be = 1,
    Se = 2,
    ke = 3,
    g = 4,
    we = 5;
  var f = u.querySelector("#modal"),
    Ce = f.querySelector(".modal-title .text"),
    qe = f.querySelector(".modal-content"),
    y = [];

  function xe(e) {
    y[m].querySelector(".buttons button.mute").textContent = R(e ? "Unmute" : "Mute")
  }

  function Me(e, t) {
    f.style.display = "block";
    for (var n = 0; n < y.length; n++) y[n].style.display = "none";
    y[e].style.display = "flex";
    var a = y[e];
    switch (e) {
      case be:
        Ce.textContent = R("Something went wrong!"), a.querySelector(".message").textContent = t;
        break;
      case Se:
        Ce.textContent = R("Disconnected!"), a.querySelector(".message").textContent = t;
        break;
      case m:
        Ce.textContent = t.id == M ? R("$ (You)", t.name) : t.name;
        var o = (O(M).flags & w) == w,
          r = (t.flags & w) == w,
          i = a.querySelector(".buttons"),
          r = (i.style.display = t.id == M || r ? "none" : "flex", i.querySelector(".button-pair").style.display = M == T || o ? "flex" : "none", i.querySelector("button.report").style.display = t.reported ? "none" : "", xe(t.muted), a.querySelector(".report-menu").style.display = "none", a.querySelector(".invite").style.display = M == t.id ? "flex" : "none", qe.querySelector(".player")),
          o = (r.style.display = "", ue(r), he(t.avatar));
        me(o, T == t.id), ge(o, Ea(t)), r.appendChild(o);
        break;
      case we:
        Ce.textContent = R("Rooms"), roomsUpdate(t);
        break;
      case ke:
        Ce.textContent = 0 == xn ? "Public Room" : "Private Room", ue(a);
        for (var l = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"], s = E("settings"), n = 0; n < qn.length; n++) {
          var c = E("setting"),
            d = de("img", "icon"),
            d = (d.src = "/img/setting_" + n + ".gif", c.appendChild(d), c.appendChild(de("span", "name", l[n] + ":")), qn[n]);
          n == ne.CUSTOMWORDSONLY && (d = d ? "Yes" : "No"), n == ne.SLOTS && (d = x.length + "/" + d), n == ne.LANG && (d = re[d]), n == ne.WORDMODE && (d = oe[d]), n == ne.DRAWTIME && (d += "s"), c.appendChild(de("span", "value", d)), s.appendChild(c)
        }
        a.appendChild(s);
        i = u.querySelector("#game-invite").cloneNode(!0);
        $(i.querySelector("#copy-invite"), "click", no), a.appendChild(i);
        break;
      case g:
        Ce.textContent = R("Settings"), a.querySelector("#select-pressure-sensitivity").value = p.pressureSensitivity
    }
  }

  function Le() {
    f.style.display = "none"
  }
  y[m] = f.querySelector(".modal-container-player"), y[be] = f.querySelector(".modal-container-info"), y[Se] = f.querySelector(".modal-container-info"), y[ke] = f.querySelector(".modal-container-room"), y[g] = f.querySelector(".modal-container-settings"), $(h, "click", function(e) {
    e.target == f && Le()
  }), $([f.querySelector(".close"), y[be].querySelector("button.ok")], "click", Le);
  let De = 0,
    $e = 2,
    Ee = 3,
    Re = 4,
    Ae = 5,
    Ie = 6,
    Te = 7,
    Ne = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];

  function v(e) {
    return "var(--COLOR_CHAT_TEXT_" + Ne[e] + ")"
  }

  function We(e, t, n, a) {
    var o = u.createElement("p"),
      r = u.createElement("b"),
      a = (r.textContent = a ? e : e + ": ", o.appendChild(r), o.style.color = n, u.createElement("span"));
    return a.textContent = t, o.appendChild(a), o
  }

  function b(e, t, n, a) {
    var o = We(e, t, n, a),
      r = On.scrollHeight - On.scrollTop - On.clientHeight <= 20;
    if (On.appendChild(o), r && (On.scrollTop = On.scrollHeight + 100), 0 < p.chatDeleteQuota)
      for (; On.childElementCount > p.chatDeleteQuota;) On.firstElementChild.remove();
    var i = We(e, t, n, a);
    return u.querySelector("#game-canvas .bubbles").appendChild(i), setTimeout(function() {
      i.remove()
    }, 2500), o
  }
  var i = void 0,
    Oe = void 0;

  function Pe(e) {
    ze();
    for (var t = (Oe = e).dataset.tooltip, n = e.dataset.tooltipdir || "N", a = ((i = E("tooltip")).appendChild(E("tooltip-arrow")), i.appendChild(E("tooltip-content", R(t))), !1), o = e; o;) {
      if ("fixed" == h.getComputedStyle(o).position) {
        a = !0;
        break
      }
      o = o.parentElement
    }
    i.style.position = a ? "fixed" : "absolute";
    var t = e.getBoundingClientRect(),
      e = ("E" == (n = "W" == (n = "S" == (n = "N" == n && t.top - h.scrollY < 48 ? "S" : n) && t.bottom - h.scrollY > u.documentElement.clientHeight - 48 ? "N" : n) && t.left - h.scrollX < 48 ? "E" : n) && t.right - h.scrollX > u.documentElement.clientWidth - 48 && (n = "W"), t.left),
      r = t.top;
    "N" == n && (e = (t.left + t.right) / 2), "S" == n && (e = (t.left + t.right) / 2, r = t.bottom), "E" == n && (e = t.right, r = (t.top + t.bottom) / 2), "W" == n && (r = (t.top + t.bottom) / 2), a || (e += h.scrollX, r += h.scrollY), i.classList.add(n), i.style.left = e + "px", i.style.top = r + "px", u.body.appendChild(i)
  }

  function ze() {
    i && (i.remove(), Oe = i = void 0)
  }
  var Ye = {},
    He = [];

  function Ue(e, t) {
    e = e[t];
    return null != e && "" != e ? e : t
  }

  function R(e, t) {
    var n = Ue(Ye[p.displayLang], e),
      a = "",
      o = 0;
    Array.isArray(t) || (t = [t]);
    for (var r = 0; r < n.length; r++) {
      var i = n.charAt(r);
      "$" == i ? (a += t[o], o++) : a += i
    }
    return a
  }

  function Be(e, t) {
    if ("children" == t)
      for (var n = 0; n < e.children.length; n++) {
        var a = e.children[n].dataset.translate;
        Be(e.children[n], null == a ? "text" : a)
      } else {
      var o = "";
      "text" == t && (o = e.textContent), 0 < (o = "placeholder" == t ? e.placeholder : o).length ? He.push({
        key: o,
        element: e,
        type: t
      }) : (console.log("Empty key passed to translate with!"), console.log(e))
    }
  }
  Ye.en = {}, Ye.de = {
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
  let Ge = 0,
    Fe = 1,
    _e = 0,
    je = 4,
    Ve = 40;
  var Ke = [4, 10, 20, 32, 40],
    Ze = u.querySelector("#game-toolbar"),
    Xe = Ze.querySelector(".toolbar-group-tools"),
    Je = Ze.querySelector(".toolbar-group-actions"),
    Qe = u.querySelector("#game-toolbar .sizes .size-preview"),
    et = u.querySelector("#game-toolbar .sizes .container"),
    tt = u.querySelector("#game-toolbar .colors");

  function nt(e, t) {
    var n, a, o, r = E("tool clickable"),
      i = (r.appendChild(E("icon")), r.appendChild(E("key")), t),
      l = (i.id = e, (i.element = r).toolIndex = e, r.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")", o = t.name, a = "S", (n = r).dataset.tooltip = o, n.dataset.tooltipdir = a, $(n, "pointerenter", function(e) {
        Pe(e.target)
      }), $(n, "pointerleave", function(e) {
        ze()
      }), o = t.isAction ? (r.addEventListener("click", function(e) {
        $t(this.toolIndex)
      }), Je.appendChild(r), ot[e] = i, le(t.name, t.keydef, "", function() {
        $t(e)
      }, function(e) {
        l.textContent = e.key
      })) : (r.addEventListener("click", function(e) {
        Et(this.toolIndex)
      }), Xe.appendChild(r), at[e] = i, le(t.name, t.keydef, "", function() {
        Et(i.id)
      }, function(e) {
        l.textContent = e.key
      })), r.querySelector(".key"));
    l.textContent = o.key, t.hide && (r.style.display = "none")
  }
  var at = [],
    ot = (nt(_e, {
      isAction: !1,
      name: "Brush",
      keydef: "B",
      graphic: "pen.gif",
      cursor: 0
    }), nt(1, {
      isAction: !1,
      name: "Fill",
      keydef: "F",
      graphic: "fill.gif",
      cursor: "url(/img/fill_cur.png) 7 38, default"
    }), []),
    C = (nt(0, {
      isAction: !0,
      name: "Undo",
      keydef: "U",
      graphic: "undo.gif",
      action: function() {
        {
          var e;
          L == M && 0 < ct.length && (ct.pop(), 0 < ct.length ? (Pt(e = ct[ct.length - 1]), l && l.emit("data", {
            id: xa,
            data: e
          })) : Bt())
        }
      }
    }), nt(1, {
      isAction: !0,
      name: "Clear",
      keydef: "C",
      graphic: "clear.gif",
      action: Bt
    })
      /*TYPOMOD DESC: add tool for pipette*/
      ,
      nt(3, {
        isAction: !1,
        name: "Pipette",
        graphic: "",
        keydef: 'P',
      })
      /*TYPOEND*/
      /* TYPOMOD DESC: add action for colorswitch */
      /*
      ,
      nt(2, {
          isAction: !0,
          name: "Switcher",
          graphic: "",
          action: () => {
              document.dispatchEvent(new Event("toggleColor"));
          }
      })
      */
      /* TYPOEND */
      /*TYPOMOD DESC: add action for brushlab*/
      ,
      nt(3, {
        isAction: !0,
        name: "Lab",
        graphic: "",
        keydef: 'L',
        action: () => {
          document.dispatchEvent(new Event("openBrushLab"));
        }
      })
      /*TYPOEND*/, u.querySelector("#game-canvas canvas")),
    rt = C.getContext("2d", {
      willReadFrequently: !0
    }),
    S = [],
    it = 0,
    lt = 0,
    st = [],
    r = [0, 9999, 9999, 0, 0],
    ct = [],
    k = [0, 0],
    dt = [0, 0],
    ut = 0,
    ht = u.createElement("canvas"),
    o = (ht.width = Ve + 2, ht.height = Ve + 2, ht.getContext("2d"));

  function pt() {
    var e = at[mt].cursor;
    if (D.id == Z && L == M) {
      if (mt == _e) {
        var t = ht.width,
          n = bt;
        if (n <= 0) return;
        o.clearRect(0, 0, t, t);
// TYPOMOD
// desc: cursor with custom color
        var a = gt < 10000 ? yt[gt] : typo.hexToRgb((gt - 10000).toString(16).padStart(6, "0"));
// TYPOEND

        a = [(a = 1 == p.dark ? [Math.floor(.75 * a[0]), Math.floor(.75 * a[1]), Math.floor(.75 * a[2])] : a)[0], a[1], a[2], .8];
        o.fillStyle = "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ")", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.fill(), o.strokeStyle = "#FFF", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.stroke(), o.strokeStyle = "#000", o.beginPath(), o.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), o.stroke();
        a = t / 2, e = "url(" + ht.toDataURL() + ")" + a + " " + a + ", default"
      }
    } else e = "default";
    C.style.cursor = e
  }
  var mt = 0,
    gt = 0,
    ft = 0,
    yt = [
      [255, 255, 255],
      [0, 0, 0],
      [193, 193, 193],
      [80, 80, 80],
      [239, 19, 11],
      [116, 11, 7],
      [255, 113, 0],
      [194, 56, 0],
      [255, 228, 0],
      [232, 162, 0],
      [0, 204, 0],
      [0, 70, 25],
      [0, 255, 145],
      [0, 120, 93],
      [0, 178, 255],
      [0, 86, 158],
      [35, 31, 211],
      [14, 8, 101],
      [163, 0, 186],
      [85, 0, 105],
      [223, 105, 167],
      [135, 53, 84],
      [255, 172, 142],
      [204, 119, 77],
      [160, 82, 45],
      [99, 48, 13]
    ],
    vt = ["White", "Black", "Light Gray", "Gray", "Red", "Dark Red", "Orange", "Dark Orange", "Yellow", "Dark Yellow", "Green", "Dark Green", "Mint", "Dark Mint", "Skyblue", "Dark Skyblue", "Seablue", "Dark Seablue", "Purple", "Dark Purple", "Pink", "Dark Pink", "Beige", "Dark Beige", "Brown", "Dark Brown"],
    bt = 0,
    St = -1,
    kt = [];

  function wt(e) {
    return 20 + (e - je) / (Ve - je) * 80
  }
  for (var e = 0; e < Ke.length; e++) {
    var Ct = E("size clickable"),
      qt = E("icon"),
      xt = (qt.style.backgroundSize = wt(Ke[e]) + "%", {
        id: e,
        size: Ke[e],
        element: Ct,
        elementIcon: qt
      });
    Ct.appendChild(qt), et.appendChild(Ct), Ct.size = xt, kt.push(xt)
  }
  for (var Mt = [E("top"), E("bottom")], e = 0; e < yt.length / 2; e++) Mt[0].appendChild(Nt(2 * e)), Mt[1].appendChild(Nt(2 * e + 1));
  for (e = 0; e < Mt.length; e++) tt.appendChild(Mt[e]);

  function Lt(e) {
    bt = q(e, je, Ve);
    for (var t = kt[kt.length - 1], n = t.size, a = 0; a < kt.length; a++) {
      var o = kt[a],
        r = Math.abs(bt - o.size);
      r <= n && (n = r, t = o, 0), o.element.classList.remove("selected")
    }
    t.element.classList.add("selected"), Ze.querySelector(".size-preview .icon").style.backgroundSize = wt(bt) + "%", pt()
  }

  function Dt(e) {
    e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
  }

  function $t(e) {
    Dt(ot[e].element), ot[e].action()
  }

  function Et(e, t) {
    Dt(at[e].element), e == mt && !t || (at[mt].element.classList.remove("selected"), at[e].element.classList.add("selected"), mt = e, pt())
  }

  function Rt(e) {
    var t =
      e > 10000 ? Wt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Wt(yt[e]);
    gt = e, u.querySelector("#color-preview-primary").style.fill = t, pt()
  }

  function At(e) {
    var t =
      e > 10000 ? Wt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Wt(yt[e]);
    ft = e, u.querySelector("#color-preview-secondary").style.fill = t, pt()
  }

  function It() {
    var e = gt;
    Rt(ft), At(e)
  }

  function Tt() {
    et.classList.remove("open")
  }

  function Nt(e) {
    var t = E("color");
    return t.style.backgroundColor = Wt(yt[e]), t.colorIndex = e, t
  }

  function Wt(e) {
    return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
  }

  function Ot(e) {
    /*TYPOMOD
    desc: if color code > 1000 -> customcolor*/if(e < 1000)
      e = q(e, 0, yt.length), e = yt[e];
    else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
    return {
      r: e[0],
      g: e[1],
      b: e[2]
    }
  }

  function Pt(e) {
    if (S = S.slice(0, e), !(M != L && lt < e)) {
      /* TYPOMOD
              desc: replace draw commands because of redo*/        const keepCommands = S;
      /* TYPOEND*/
      r = Yt();
      e = Math.floor(S.length / zt);
      st = st.slice(0, e), Vt();
      for (var t = 0; t < st.length; t++) {
        var n = st[t];
        rt.putImageData(n.data, n.bounds[1], n.bounds[2])
      }
      for (t = st.length * zt; t < S.length; t++) Ht(Ft(S[t]), S[t]);
      it = Math.min(S.length, it), lt = Math.min(S.length, lt)

      /* TYPOMOD
               log kept commands*/
      document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
      /* TYPOEND*/}
  }
  let zt = 50;

  function Yt() {
    return [0, 9999, 9999, 0, 0]
  }

  function Ht(e) {
    var t, n, a, o;
    r[0] += 1, r[1] = Math.min(r[1], e[0]), r[2] = Math.min(r[2], e[1]), r[3] = Math.max(r[3], e[2]), r[4] = Math.max(r[4], e[3]), r[0] >= zt && (t = r[1], n = r[2], a = r[3], o = r[4], (a - t <= 0 || o - n <= 0) && (t = e[0], n = e[1], a = e[2], o = e[3]), e = rt.getImageData(t, n, a - t, o - n), st.push({
      data: e,
      bounds: r
    }), r = Yt())
  }

  function Ut(e) {
    return (e || 0 < S.length || 0 < ct.length || 0 < it || 0 < lt) && (S = [], ct = [], it = lt = 0, r = Yt(), st = [], Vt(), 1)
  }

  function Bt() {
    L == M && Ut() && l && l.emit("data", {
      id: qa
    })
  }

  function Gt(e) {
    var t, n, a, o, r, i;
    ((t = e)[0] != Ge ? t[0] == Fe && 0 <= t[2] && t[2] < C.width && 0 <= t[3] && t[3] < C.height : (a = t[3], o = t[4], r = t[5], i = t[6], t = Math.ceil(t[2] / 2), n = (a + r) / 2, o = (o + i) / 2, r = Math.abs(r - a) / 2, a = Math.abs(i - i) / 2, (i = {
      x1: -(t + r),
      y1: -(t + r),
      x2: C.width + t + r,
      y2: C.height + t + a
    }).x1 < n && n < i.x2 && i.y1 < o && o < i.y2)) ? (S.push(e), M == L && Ht(Ft(e)))
      /* TYPOMOD  log draw commands */
      & document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }))
      /* TYPOEND */: console.log("IGNORED COMMAND OUT OF CANVAS BOUNDS")
  }

  function Ft(e) {
    var t = [0, 0, C.width, C.height];
    switch (e[0]) {
      case Ge:
        var n = q(Math.floor(e[2]), je, Ve),
          a = Math.ceil(n / 2),
          o = q(Math.floor(e[3]), -a, C.width + a),
          r = q(Math.floor(e[4]), -a, C.height + a),
          i = q(Math.floor(e[5]), -a, C.width + a),
          a = q(Math.floor(e[6]), -a, C.height + a),
          l = Ot(e[1]);
        t[0] = q(o - n, 0, C.width), t[1] = q(r - n, 0, C.height), t[2] = q(i + n, 0, C.width), t[3] = q(a + n, 0, C.height), jt(o, r, i, a, n, l.r, l.g, l.b);
        break;
      case Fe:
        var l = Ot(e[1]),
          o = q(Math.floor(e[2]), 0, C.width),
          r = q(Math.floor(e[3]), 0, C.height),
          i = o,
          a = r,
          s = l.r,
          c = l.g,
          d = l.b,
          u = rt.getImageData(0, 0, C.width, C.height),
          h = [
            [i, a]
          ],
          p = ((e, t, n) => 0 <= (n = 4 * (n * e.width + t)) && n < e.data.length ? [e.data[n], e.data[1 + n], e.data[2 + n]] : [0, 0, 0])(u, i, a);
        if (s != p[0] || c != p[1] || d != p[2]) {
          for (var m, g, f, y, v, b, S = function(e) {
            var t = u.data[e],
              n = u.data[e + 1],
              e = u.data[e + 2];
            return (t != s || n != c || e != d) && (t = Math.abs(t - p[0]), n = Math.abs(n - p[1]), e = Math.abs(e - p[2]), t < 3) && n < 3 && e < 3
          }, k = u.height, w = u.width; h.length;) {
            for (m = h.pop(), g = m[0], y = 4 * ((f = m[1]) * w + g); 0 <= f-- && S(y);) y -= 4 * w;
            for (y += 4 * w, ++f, b = v = !1; f++ < k - 1 && S(y);) _t(u, y, s, c, d), 0 < g && (S(y - 4) ? v || (h.push([g - 1, f]), v = !0) : v = v && !1), g < w - 1 && (S(y + 4) ? b || (h.push([g + 1, f]), b = !0) : b = b && !1), y += 4 * w
          }
          rt.putImageData(u, 0, 0)
        }
    }
    return t
  }

  function q(e, t, n) {
    return e < t ? t : n < e ? n : e
  }

  function _t(e, t, n, a, o) {
    0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
  }

  function jt(e, t, n, a, o, r, i, l) {
    function s(e, t) {
      for (var n = -c; n <= c; n++)
        for (var a, o = -c; o <= c; o++) n * n + o * o < d && 0 <= (a = 4 * ((t + o) * m.width + e + n)) && a < m.data.length && (m.data[a] = r, m.data[1 + a] = i, m.data[2 + a] = l, m.data[3 + a] = 255)
    }
    var c = Math.floor(o / 2),
      d = c * c,
      o = Math.min(e, n) - c,
      u = Math.min(t, a) - c,
      h = Math.max(e, n) + c,
      p = Math.max(t, a) + c,
      m = (e -= o, t -= u, n -= o, a -= u, rt.getImageData(o, u, h - o, p - u));
    if (e == n && t == a) s(e, t);
    else {
      s(e, t), s(n, a);
      var g = Math.abs(n - e),
        f = Math.abs(a - t),
        y = e < n ? 1 : -1,
        v = t < a ? 1 : -1,
        b = g - f;
      for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a;) {
        var S = b << 1; - f < S && (b -= f, e += y), S < g && (b += g, t += v), s(e, t)
      }
    }
    rt.putImageData(m, o, u)
  }

  function Vt() {
    /* TYPOMOD
             desc: store data before clear */
    const data = document.querySelector("#game-canvas canvas").toDataURL();
    /* TYPOEND */
    rt.fillStyle = "#FFF", rt.fillRect(0, 0, C.width, C.height)
    /* TYPOMOD
             desc: dispatch clear event */
    ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
    /* TYPOEND */
  }

  function Kt(e) {
    if (D.id == Z && L == M && -1 != St) {
      var t = 0 == St ? gt : ft,
        n = null;
      if (e) {
        var e = ((e, t) => {
          for (var n = (e = rt.getImageData(e, t, 1, 1)).data[0], a = e.data[1], o = e.data[2], r = 0; r < yt.length; r++) {
            var i = yt[r];
            if (0 == i[0] - n && 0 == i[1] - a && 0 == i[2] - o) return r
          }
          /* TYPOMOD
                               desc: if color is not in array, convert to custom color */
          return r = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
          /* TYPOEND */
          return r
        })(k[0], k[1]);
        if (1 == mt) {
          if (e == t) return;
          e = t, l = k[0], s = k[1], n = [Fe, e, l, s]
        }
      }
      mt == _e && (e = bt, 0 <= ut && (e = (e - je) * q(ut, 0, 1) + je),
        /* TYPOMOD use typo pressure */
        (() => {
          if (0 <= ut && localStorage.typoink == 'true') {
            const calcSkribblSize = (val) => Number(val) * 36 + 4;
            const calcLevelledSize = (val, level) => Math.pow(Number(val), Math.pow(1.5, (Number(level) - 50) / 10));
            const sensitivity = 100 - Number(localStorage.sens);
            let levelled = calcLevelledSize(ut, sensitivity);
            e = Math.round(calcSkribblSize(levelled));
          }
        })(),l = Math.ceil(.5 * e), s = q(Math.floor(dt[0]), -l, C.width + l), o = q(Math.floor(dt[1]), -l, C.height + l), r = q(Math.floor(k[0]), -l, C.width + l), i = q(Math.floor(k[1]), -l, C.height + l), t = t, e = e, a = s, o = o, r = r, i = i, n = [Ge, t, e, a, o, r, i]), null != n && Gt(n)
    }
    var a, o, r, i, l, s
  }

  function Zt(e, t, n, a) {
    var o = C.getBoundingClientRect(),
      e = Math.floor((e - o.left) / o.width * C.width),
      t = Math.floor((t - o.top) / o.height * C.height);
    a ? (ut = n, dt[0] = k[0] = e, dt[1] = k[1] = t) : (dt[0] = k[0], dt[1] = k[1], ut = n, k[0] = e, k[1] = t)
  }

  function Xt(e) {
    return 0 == e || 2 == e || 5 == e
  }

  function Jt(e) {
    var t = "Left-/Rightclick to choose a color!\n" + vt[this.colorIndex];
    u.querySelector("#game-toolbar .colors").dataset.tooltip = t, i && (i.querySelector(".tooltip-content").textContent = R(Oe.dataset.tooltip))
  }

  function Qt(e) {
    var t, n;
    t = this.colorIndex, n = 0 == e.button, ((n = e.altKey ? !n : n) ? Rt : At)(t)
  }
  $(Ze, "contextmenu", function(e) {
    return e.preventDefault(), !1
  }), $("#game-toolbar .sizes .size", "click", function(e) {
    var t;
    t = this.size.id, Dt((t = kt[t]).element), Lt(t.size), Tt()
  }), $([C], "DOMMouseScroll wheel", function(e) {
    e.preventDefault();
    e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
    Lt(bt + 2 * e)
  }), le("Swap", "S", "Swap the primary and secondary color.", It), $(Ze.querySelector(".color-preview"), "click", function(e) {
    It()
  }), $(Qe, "click", function(e) {
    et.classList.toggle("open")
  }), $(u, "keydown", function(e) {
    if ("Enter" == e.code) return Wn[0].focus(), 0;
    if ("input" == u.activeElement.tagName.toLowerCase() || "textarea" == u.activeElement.tagName.toLowerCase() || -1 != St) return 0;
    for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < d.length; n++)
      if (d[n].key.toLowerCase() == t) {
        for (var a = 0; a < d[n].cb.length; a++) d[n].cb[a](d[n]);
        return void e.preventDefault()
      }
  }), $(C, "contextmenu", function(e) {
    return e.preventDefault(), !1
  });
  var l, en = null,
    tn = ("PointerEvent" in h ? ($("#game-toolbar .colors * .color", "pointerenter", Jt), $("#game-toolbar .colors * .color", "pointerdown", Qt), $(C, "pointerdown", function(e) {
      var t, n, a;
      null == en && Xt(e.button) && (a = p.pressureSensitivity && ("pen" == e.pointerType || "touch" == e.pointerType), t = e.clientX, n = e.clientY, a = a ? e.pressure : -1, en = e.pointerId, St = e.button, C.setPointerCapture(e.pointerId), S.length, Zt(t, n, a, !0), Kt(!0))
    }), $(C, "pointermove", function(e) {
      var t;
      en === e.pointerId && (t = p.pressureSensitivity && ("pen" == e.pointerType || "touch" == e.pointerType), Zt(e.clientX, e.clientY, t ? e.pressure : -1, !1), Kt(!1))
    }), $(C, "pointerup pointercancel", function(e) {
      en === e.pointerId && (tn != S.length && (tn = S.length, ct.push(tn)), en = null, St = -1, C.releasePointerCapture(e.pointerId))
    })) : ($("#game-toolbar .colors * .color", "mouseenter", Jt), $("#game-toolbar .colors * .color", "click", Qt), $(C, "mousedown", function(e) {
      Xt(e.button) && (St = e.button, S.length, Zt(e.clientX, e.clientY, -1, !0), Kt(!0))
    }), $(u, "mousemove", function(e) {
      Zt(e.clientX, e.clientY, -1, !1), Kt(!1)
    }), $(u, "mouseup", function(e) {
      -1 != St && (tn != S.length && (tn = S.length, ct.push(tn)), St = -1)
    })), 0),
    nn = (setInterval(function() {
      var e, t;
      l && D.id == Z && L == M && 0 < S.length - it && (e = it + 8, t = S.slice(it, e), l.emit("data", {
        id: Ca,
        data: t
      }), it = Math.min(e, S.length))
    }, 50), setInterval(function() {
      l && D.id == Z && L != M && lt < S.length && (Ht(Ft(S[lt]), S[lt]), lt++)
    }, 3), u.querySelector("#game-canvas .overlay")),
    an = u.querySelector("#game-canvas .overlay-content"),
    A = u.querySelector("#game-canvas .overlay-content .text"),
    on = u.querySelector("#game-canvas .overlay-content .words"),
    rn = u.querySelector("#game-canvas .overlay-content .reveal"),
    I = u.querySelector("#game-canvas .overlay-content .result"),
    ln = u.querySelector("#game-canvas .overlay-content .room"),
    sn = -100,
    cn = 0,
    dn = void 0;

  function un(e, a, o) {
    var r, i, l = sn,
      s = cn,
      c = e.top - l,
      d = e.opacity - s;
    Math.abs(c) < .001 && Math.abs(d) < .001 ? o && o() : (r = void 0, i = 0, dn = h.requestAnimationFrame(function e(t) {
      var n = t - (r = null == r ? t : r),
        t = (r = t, (i = Math.min(i + n, a)) / a),
        n = (n = t) < .5 ? .5 * ((e, t) => e * e * ((t + 1) * e - t))(2 * n, 1.2 * 1.5) : .5 * (((e, t) => e * e * ((t + 1) * e + t))(2 * n - 2, 1.2 * 1.5) + 2);
      sn = l + c * n, cn = s + t * t * (3 - 2 * t) * d, an.style.top = sn + "%", nn.style.opacity = cn, i == a ? o && o() : dn = h.requestAnimationFrame(e)
    }))
  }

  function hn(e) {
    e.classList.add("show")
  }
  /* TYPOMOD desc: add event handlers for typo features */
  $(".avatar-customizer .container", "pointerdown", () => {
    const data = typo.createFakeLobbyData();
    typo.messagePort.postMessage({ id: 10, data });
    //document.dispatchEvent(new CustomEvent("practiceJoined", {detail: data}));
    Vn(data);
  });

  l = new Proxy({},{
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

  function pn(e) {
    for (var t = 0; t < an.children.length; t++) an.children[t].classList.remove("show");
    switch (e.id) {
      case Q:
        hn(ln);
        break;
      case V:
        hn(A), A.textContent = R("Round $", e.data + 1);
        break;
      case _:
        hn(A), A.textContent = R("Waiting for players...");
        break;
      case j:
        hn(A), A.textContent = R("Game starting in a few seconds...");
        break;
      case X:
        hn(rn), rn.querySelector("p span.word").textContent = e.data.word, rn.querySelector(".reason").textContent = (e => {
          switch (e) {
            case U:
              return R("Everyone guessed the word!");
            case G:
              return R("The drawer left the game!");
            case B:
              return R("Time is up!");
            case F:
              return R("Drawer got skipped!");
            default:
              return "Error!"
          }
        })(e.data.reason);
        for (var n = rn.querySelector(".player-container"), a = (ue(n), []), o = 0; o < e.data.scores.length; o += 3) {
          var r = e.data.scores[o + 0],
            i = (e.data.scores[o + 1], e.data.scores[o + 2]);
          (s = O(r)) && a.push({
            name: s.name,
            score: i
          })
        }
        a.sort(function(e, t) {
          return t.score - e.score
        });
        for (o = 0; o < Math.min(a.length, 12); o++) {
          var l = E("player"),
            s = a[o],
            c = (l.appendChild(E("name", s.name)), E("score", (0 < s.score ? "+" : "") + s.score));
          s.score <= 0 && c.classList.add("zero"), l.appendChild(c), n.appendChild(l)
        }
        break;
      case J:
        hn(I);
        for (var d = [I.querySelector(".podest-1"), I.querySelector(".podest-2"), I.querySelector(".podest-3"), I.querySelector(".ranks")], o = 0; o < 4; o++) ue(d[o]);
        if (0 < e.data.length) {
          for (var u = [
            [],
            [],
            [],
            []
          ], o = 0; o < e.data.length; o++)(s = {
            player: O(r = e.data[o][0]),
            rank: e.data[o][1],
            title: e.data[o][2]
          }).player && u[Math.min(s.rank, 3)].push(s);
          for (var h = 0; h < 3; h++) {
            var p = u[h];
            if (0 < p.length) {
              var m = p.map(function(e) {
                  return e.player.name
                }).join(", "),
                g = p[0].player.score,
                f = 96,
                y = d[h],
                l = E("avatar-container"),
                v = (y.appendChild(l), E("border"));
              v.appendChild(E("rank-place", "#" + (h + 1))), v.appendChild(E("rank-name", m)), v.appendChild(E("rank-score", R("$ points", g))), y.appendChild(v), 0 == h && l.appendChild(E("trophy"));
              for (o = 0; o < p.length; o++) ge(S = he((s = p[o]).player.avatar, f), Ea(s.player)), S.style.left = 15 * -(p.length - 1) + 30 * o + "%", 0 == h && (S.classList.add("winner"), S.style.animationDelay = -2.35 * o + "s"), l.appendChild(S)
            }
          }
          for (var b = Math.min(5, u[3].length), o = 0; o < b; o++) {
            var S, s = u[3][o],
              f = 48,
              y = E("rank");
            ge(S = he(s.player.avatar, f), Ea(s.player)), y.appendChild(S), y.appendChild(E("rank-place", "#" + (s.rank + 1))), y.appendChild(E("rank-name", s.player.name)), y.appendChild(E("rank-score", R("$ points", s.player.score))), d[3].appendChild(y)
          }
          0 < u[0].length ? (D = u[0].map(function(e) {
            return e.player.name
          }).join(", "), I.querySelector(".winner-name").textContent = (0 < u[0].length ? D : "<user left>") + " ", I.querySelector(".winner-text").textContent = 1 == u[0].length ? R("is the winner!") : R("are the winners!")) : (I.querySelector(".winner-name").textContent = "", I.querySelector(".winner-text").textContent = R("Nobody won!"))
        } else I.querySelector(".winner-name").textContent = "", I.querySelector(".winner-text").textContent = R("Nobody won!");
        break;
      case K:
        if (e.data.words)
          if (hn(A), hn(on), ue(on), qn[ne.WORDMODE] == ae.COMBINATION) {
            A.textContent = R("Choose the first word");
            for (var k = e.data.words.length / 2, w = [], C = [], q = 0, o = 0; o < k; o++) {
              var x = E("word", e.data.words[o]),
                M = (x.index = o, E("word", e.data.words[o + k]));
              M.index = o, M.style.display = "none", M.style.animationDelay = .03 * o + "s", w.push(x), C.push(M), $(x, "click", function() {
                q = this.index;
                for (var e = 0; e < k; e++) w[e].style.display = "none", C[e].style.display = "";
                A.textContent = R("Choose the second word")
              }), $(M, "click", function() {
                aa([q, this.index])
              }), on.appendChild(x), on.appendChild(M)
            }
          } else {
            A.textContent = R("Choose a word");
            for (o = 0; o < e.data.words.length; o++) {
              var L = E("word", e.data.words[o]);
              L.index = o, $(L, "click", function() {
                aa(this.index)
              }), on.appendChild(L)
            }
          }
        else {
          hn(A);
          var D = (s = O(e.data.id)) ? s.name : R("User"),
            D = (A.textContent = "", A.appendChild(de("span", void 0, R("$ is choosing a word!", D))), he(s ? s.avatar : [0, 0, 0, 0], e.data.id == T));
          s && ge(D, Ea(s)), D.style.width = "2em", D.style.height = "2em", A.appendChild(D)
        }
    }
  }
  let mn = 0,
    gn = 1,
    fn = 2,
    yn = 3,
    vn = 4,
    bn = 5,
    Sn = 6;

  function kn(e, t) {
    this.url = t, this.buffer = null, this.loaded = !1;
    var n = this,
      a = new XMLHttpRequest;
    a.open("GET", t, !0), a.responseType = "arraybuffer", a.onload = function() {
      e.context.decodeAudioData(a.response, function(e) {
        n.buffer = e, n.loaded = !0
      }, function(e) {
        console.log("Failed loading audio from url '" + t + "'")
      })
    }, a.send()
  }

  function wn() {
    this.context = null, this.gain = null, this.sounds = new Map, h.addEventListener("load", this.load.bind(this), !1)
  }
  wn.prototype.addSound = function(e, t) {
    this.sounds.set(e, new kn(this, t))
  }, wn.prototype.loadSounds = function() {
    this.addSound(mn, "/audio/roundStart.ogg"), this.addSound(gn, "/audio/roundEndSuccess.ogg"), this.addSound(fn, "/audio/roundEndFailure.ogg"), this.addSound(yn, "/audio/join.ogg"), this.addSound(vn, "/audio/leave.ogg"), this.addSound(bn, "/audio/playerGuessed.ogg"), this.addSound(Sn, "/audio/tick.ogg")
  }, wn.prototype.playSound = function(e) {
    var t, n;
    null == this.context ? this.load() : "running" != this.context.state ? this.context.resume().then(function() {
      this.playSound(e)
    }) : null != this.context && 0 < p.volume && this.sounds.has(e) && (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.gain), n.start(0))
  }, wn.prototype.setVolume = function(e) {
    y[g].querySelector("#volume .title .icon").classList.toggle("muted", e <= 0), y[g].querySelector("#volume .volume-value").textContent = e <= 0 ? "Muted" : e + "%", this.gain && (this.gain.gain.value = e / 100)
  }, wn.prototype.load = function() {
    if (null == this.context) try {
      h.AudioContext = h.AudioContext || h.webkitAudioContext, this.context = new AudioContext, this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.setVolume(p.volume), console.log("AudioContext created."), this.loadSounds()
    } catch (e) {
      console.log("Error creating AudioContext.", e), this.context = null
    }
  };
  let w = 4,
    Cn = "https://skribbl.io/api/play";
  _;
  var x = [],
    M = 0,
    T = -1,
    L = -1,
    qn = [],
    D = {
      id: -1,
      time: 0,
      data: 0
    },
    xn = -1,
    Mn = 0,
    Ln = void 0,
    N = new wn,
    s = void 0,
    Dn = !1,
    $n = !1,
    En = u.querySelector("#game-wrapper"),
    Qe = u.querySelector("#game-canvas .room"),
    Rn = u.querySelector("#game-players"),
    An = u.querySelector("#game-players-footer"),
    In = (u.querySelector("#game-board"), u.querySelector("#game-bar"), u.querySelector("#game-round .text")),
    W = [u.querySelector("#game-word .description"), u.querySelector("#game-word .word"), u.querySelector("#game-word .hints .container")],
    Tn = u.querySelector("#game-chat"),
    Nn = [u.querySelector("#game-chat form"), u.querySelector("#game-chat-input-mobile form")],
    Wn = [u.querySelector("#game-chat input"), u.querySelector("#game-chat-input-mobile input")],
    On = u.querySelector("#game-chat .chat-content"),
    Pn = u.querySelector("#home .container-name-lang input"),
    zn = u.querySelector("#home .container-name-lang select"),
    Yn = u.querySelector("#home .panel .button-play"),
    Hn = u.querySelector("#home .panel .button-create");
  let Un = 11 == (t = new Date).getMonth() && 19 <= (t = t.getDate()) && t <= 26;

  function Bn(e) {
    Dn = e, u.querySelector("#load").style.display = e ? "block" : "none"
  }

  function Gn(e, t, n, a) {
    var o, r;
    e = e, t = t, o = function(e, t) {
      switch (e) {
        case 200:
          return void n({
            success: !0,
            data: t
          });
        case 503:
        case 0:
          a && Me(be, R("Servers are currently undergoing maintenance!") + "\n\r" + R("Please try again later!") + "\n\rStatus: " + e);
          break;
        default:
          a && Me(be, R("An unknown error occurred ('$')", e) + "\n\r" + R("Please try again later!"))
      }
      n({
        success: !1,
        error: e
      })
    }, (r = new XMLHttpRequest).onreadystatechange = function() {
      4 == this.readyState && o(this.status, this.response)
    }, r.open("POST", e, !0), r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), r.send(t)
  }
  Un;
  var Fn = null;
  adplayer = null;
  try {
    aiptag.cmd.player.push(function() {
      console.log("ad player loaded"), adplayer = new aipPlayer({
        AD_WIDTH: 960,
        AD_HEIGHT: 540,
        AD_FULLSCREEN: !1,
        AD_CENTERPLAYER: !0,
        LOADING_TEXT: "loading advertisement",
        PREROLL_ELEM: function() {
          return u.getElementById("preroll")
        },
        AIP_COMPLETE: function(e) {
          Fn()
        },
        AIP_REMOVE: function() {}
      })
    })
  } catch (e) {
    console.log("ad push failed: "), console.log(e)
  }

  function _n(t) {
    var e, n, a = !1;
    if (h.localStorageAvailable && (n = c.getItem("lastAd"), e = new Date, c.setItem("lastAd", e.toString()), null == n ? n = e : (n = new Date(Date.parse(n)), a = 1 <= Math.abs(n - e) / 1e3 / 60)), a) try {
      aiptag && adplayer && null != adplayer && "undefined" !== adplayer ? (Fn = t, aiptag.cmd.player.push(function() {
        adplayer.startPreRoll()
      })) : t()
    } catch (e) {
      console.log(e), t()
    } else t()
  }

  function jn(e, t, n) {
    N.context && N.context.resume && N.context.resume(), l && na();
    var a, o = 0,
      r = {
        transports: ["websocket", "polling"],
        closeOnBeforeunload: !1
      };
    "URL" in h && "127.0.0.1" != (a = new URL(e)).hostname && "localhost" != a.hostname && (r.path = "/" + a.port + "/", e = a.protocol + "//" + a.hostname), (l = P(e, r)).on("connect", function() {
      /* TYPOMOD
                           desc: disconnect socket & leave lobby */
      document.addEventListener('socketEmit', event =>
        l.emit('data', { id: event.detail.id, data: event.detail.data })
      );

      typo.disconnect = () => {
        if (l) {
          l.typoDisconnect = true;
          l.on("disconnect", () => {
            typo.disconnect = undefined;
            document.dispatchEvent(new Event("leftLobby"));
          });
          l.off("data");
          l.reconnect = false;
          l.disconnect();
        } else {
          document.dispatchEvent(new Event("leftLobby"));
        }
      }
      l.on("data", data => typo.messagePort.postMessage(data));
      typo.messagePort.onmessage = data => l.emit("data", data.data);

      const originalEmit = l.emit.bind(l);
      l.emit = function(...data) {
        typo.emitPort.postMessage(data);
        originalEmit(...data);
      };
      /* TYPOEND */
      Bn(!1), l.on("joinerr", function(e) {
        na(), Me(be, (e => {
          switch (e) {
            case 1:
              return R("Room not found!");
            case 2:
              return R("Room is full!");
            case 3:
              return R("You are on a kick cooldown!");
            case 4:
              return R("You are banned from this room!");
            case 5:
              return R("You are joining rooms too quickly!");
            case 100:
              return R("You are already connected to this room!");
            case 200:
              return R("Too many users from your IP are connected to this room!");
            case 300:
              return R("You have been kicked too many times!");
            default:
              return R("An unknown error ('$') occured!", e)
          }
        })(e))
      }), l.on("data", $a);
      var e = Pn.value.split("#"),
        e = {
          join: t,
          create: n ? 1 : 0,
          name: e[0],
          lang: zn.value,
          code: e[1],
          avatar: p.avatar
        };
      l.emit("login", e)
    }), l.on("reason", function(e) {
      o = e
    }), l.on("disconnect", function(e) {
      /* TYPOMOD
                       DESC: no msg if disconnect intentionally */
      if(!l.typoDisconnect)
        /*TYPOEND*/
        switch (console.log("socket disconnect: " + e), o) {
          case ee:
            Me(Se, R("You have been kicked!"));
            break;
          case te:
            Me(Se, R("You have been banned!"));
            break;
          default:
            Me(Se, R("Connection lost!") + "\n" + e)
        }
      na()
    }), l.on("connect_error", function(e) {
      na(), Bn(!1), Me(be, e.message)
    })
  }

  function Vn(e) {
    N.playSound(yn), Et(_e, !0), Lt(12), Rt(1), At(0), Ut(!0), ue(On), u.querySelector("#home").style.display = "none", u.querySelector("#game").style.display = "flex", M = e.me, xn = e.type, Ln = e.id, u.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, qn = e.settings, Kn(), ue(Rn), x = [];
    for (var t = 0; t < e.users.length; t++) Ra(e.users[t], !1);
    Wa(), Oa(), Xn(e.round), la(e.owner), Qn(e.state, !0), $n || (setTimeout(function() {
      try {
        (adsbygoogle = h.adsbygoogle || []).push({}), (adsbygoogle = h.adsbygoogle || []).push({})
      } catch (e) {
        console.log("google ad request failed"), console.log(e)
      }
    }, 1500), $n = !0)
  }

  function Kn() {
    Xn(Mn);
    for (var e, t = 0; t < Ya.length; t++) {
      var n = Ya[t];
      n.index && (e = qn[(n = n).index], "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
    }
  }

  function Zn(e, t, n) {
    qn[e] = t, n && l && l.emit("data", {
      id: fa,
      data: {
        id: e,
        val: t
      }
    }), Kn()
  }

  function Xn(e) {
    var e = (Mn = e) + 1,
      t = qn[ne.ROUNDS];
    In.textContent = R("Round $/$", [e, t])
  }

  function Jn() {
    for (var e = 0; e < x.length; e++) x[e].score = 0;
    for (e = 0; e < x.length; e++) Pa(x[e], !1), za(x[e], !1);
    Oa()
  }

  function Qn(e, t) {
    var n, a;
    if (n = D = e, null != dn && (h.cancelAnimationFrame(dn), dn = void 0), n.id == Z ? un({
      top: -100,
      opacity: 0
    }, 600, function() {
      nn.classList.remove("show")
    }) : nn.classList.contains("show") ? un({
      top: -100,
      opacity: 1
    }, 600, function() {
      pn(n), un({
        top: 0,
        opacity: 1
      }, 600)
    }) : (nn.classList.add("show"), pn(n), un({
      top: 0,
      opacity: 1
    }, 600)), a = e.time, Ka(), Za(a), ja = setInterval(function() {
      Za(Math.max(0, Va - 1));
      var e = -1;
      D.id == Z && (e = Ga), D.id == K && (e = Fa), _a.style.animationName = Va < e ? Va % 2 == 0 ? "rot_left" : "rot_right" : "none", Va < e && N.playSound(Sn), Va <= 0 && Ka()
    }, 1e3), En.classList.add("toolbar-hidden"), pt(), ta(!1), e.id == Q ? (Jn(), En.classList.add("room")) : En.classList.remove("room"), e.id == V && (Xn(e.data), 0 == e.data) && Jn(), e.id == X) {
      M != L && ia(e.data.word);
      for (var o = 0; o < e.data.scores.length; o += 3) {
        var r = e.data.scores[o + 0],
          i = e.data.scores[o + 1];
        e.data.scores[o + 2];
        (c = O(r)) && (c.score = i)
      }
      Oa();
      for (var l = !0, o = 0; o < x.length; o++)
        if (x[o].guessed) {
          l = !1;
          break
        } l ? N.playSound(fn) : N.playSound(gn), b(R("The word was '$'", e.data.word), "", v(Re), !0)
      /* TYPOMOD
                   desc: log finished drawing */
      ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
      /* TYPOEND */
    } else e.id != Z && (W[0].textContent = R("WAITING"), W[0].classList.add("waiting"), W[1].style.display = "none", W[2].style.display = "none");
    if (e.id == Z) {
      if (L = e.data.id, N.playSound(mn), Ut(!0), e.data.drawCommands && (S = e.data.drawCommands), b(R("$ is drawing now!", O(L).name), "", v(Ee), !0), !t)
        for (o = 0; o < x.length; o++) Pa(x[o], !1);
      W[0].classList.remove("waiting"), L == M ? (a = e.data.word, W[0].textContent = R("DRAW THIS"), W[1].style.display = "", W[2].style.display = "none", W[1].textContent = a, En.classList.remove("toolbar-hidden"), pt()) : (ta(!0), oa(e.data.word, !1), ra(e.data.hints))
    } else {
      L = -1;
      for (o = 0; o < x.length; o++) Pa(x[o], !1)
    }
    if (e.id == J && 0 < e.data.length) {
      for (var s = [], i = 0, o = 0; o < e.data.length; o++) {
        var c, d = e.data[o][0],
          u = e.data[o][1];
        (c = O(d)) && 0 == u && (i = c.score, s.push(c.name))
      }
      1 == s.length ? b(R("$ won with a score of $!", [s[0], i]), "", v(Ie), !0) : 1 < s.length && b(R("$ and $ won with a score of $!", [s.slice(0, -1).join(", "), s[s.length - 1], i]), "", v(Ie), !0)
    }
    for (o = 0; o < x.length; o++) za(x[o], x[o].id == L);
    Wa()
  }

  function ea(e) {
    l && l.connected && D.id == Z && (l.emit("data", {
      id: ua,
      data: e
    }), ta(!1))
  }

  function ta(e) {
    u.querySelector("#game-rate").style.display = e ? "" : "none"
  }

  function na() {
    console.log("lobby left"), l && l.close(), Ut(!(l = void 0)), Ka(), x = [], qn = [], D = {
      id: L = T = -1,
      time: M = 0,
      data: 0
    }, u.querySelector("#home").style.display = "", u.querySelector("#game").style.display = "none"
  }

  function aa(e) {
    l && l.connected && D.id == K && l.emit("data", {
      id: wa,
      data: e
    })
  }

  function oa(e, t) {
    for (var n = e.length - 1, a = 0; a < e.length; a++) n += e[a];
    var o = !t && 1 == qn[ne.WORDMODE];
    o && (n = 3), W[0].textContent = R(o ? "WORD HIDDEN" : "GUESS THIS"), W[1].style.display = "none", W[2].style.display = "", ue(W[2]), W[2].hints = [];
    for (a = 0; a < n; a++) W[2].hints[a] = E("hint", o ? "?" : "_"), W[2].appendChild(W[2].hints[a]);
    o || W[2].appendChild(E("word-length", e.join(" ")))
  }

  function ra(e) {
    for (var t = W[2].hints, n = 0; n < e.length; n++) {
      var a = e[n][0],
        o = e[n][1];
      t[a].textContent = o, t[a].classList.add("uncover")
    }
  }

  function ia(e) {
    (!W[2].hints || W[2].hints.length < e.length) && oa([e.length], !0);
    for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
    ra(t)
  }

  function la(e) {
    T = e;
    for (var t = 0; t < x.length; t++) me(x[t].element, x[t].id == T), Ta(x[t], 0, x[t].id == T);
    var n = M != T;
    u.querySelector("#button-start-game").disabled = n;
    for (var a = 0; a < Ya.length; a++) Ya[a].element.disabled = n;
    e = O(T);
    e && b(R("$ is now the room owner!", e.name), "", v(Ie), !0)
  }
  let sa = 1,
    ca = 2,
    da = 5,
    ua = 8,
    ha = 9,
    pa = 90,
    ma = 10,
    ga = 11,
    fa = 12,
    ya = 13,
    va = 14,
    ba = 15,
    Sa = 16,
    ka = 17,
    wa = 18,
    Ca = 19,
    qa = 20,
    xa = 21,
    Ma = 30,
    La = 31,
    Da = 32;

  function $a(e) {
    var t = e.id,
      n = e.data;
    switch (t) {
      case ma:
        /* TYPOMOD
                         desc: send lobbydata*/
        document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: n }));
        /* TYPOEND*/
        Vn(n);
        break;
      case ga:
        Qn(n);
        break;
      case fa:
        Zn(n.id, n.val, !1);
        break;
      case ya:
        ra(n);
        break;
      case va:
        Za(n);
        break;
      case sa:
        var a = Ra(n, !0);
        Oa(), a.joinTimeout = setTimeout(() => {
          b(R("$ joined the room!", a.name), "", v(Re), !0), N.playSound(yn), a.joinTimeout = void 0
        }, 0 == xn ? 1e3 : 0);
        break;
      case ha:
        (a = O(n.id)) && (a.avatar = n.avatar, pe(a.element.avatar, a.avatar));
        break;
      case pa:
        (a = O(n.id)) && (a.name = n.name, a.element.querySelector(".player-name").textContent = n.name);
        break;
      case ca:
        (a = (e => {
          for (var t = 0; t < x.length; t++) {
            var n = x[t];
            if (n.id == e) return x.splice(t, 1), n.element.remove(), Oa(), Wa(), n
          }
        })(n.id)) && (null == a.joinTimeout ? (b(((e, t) => {
          switch (e) {
            default:
              return R("$ left the room!", t);
            case ee:
              return R("$ has been kicked!", t);
            case te:
              return R("$ has been banned!", t)
          }
        })(n.reason, a.name), "", v(Ae), !0), N.playSound(vn)) : (clearTimeout(a.joinTimeout), a.joinTimeout = void 0), n.id != L || n.reason != ee && n.reason != te || Ut(!0));
        break;
      case da:
        var o = O(n[0]),
          r = O(n[1]),
          i = n[2],
          l = n[3];
        o && r && b(R("$ is voting to kick $ ($/$)", [o.name, r.name, i, l]), "", v($e), !0);
        break;
      case ba:
        (a = O(n.id)) && (b(R("$ guessed the word!", a.name), "", v(Re), !0).classList.add("guessed"), Pa(a, !0), N.playSound(bn), n.id == M) && ia(n.word);
        break;
      case ua:
        (a = O(n.id)) && (o = a, r = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (i = E("icon")).style.backgroundImage = "url(/img/" + r + ")", r = Ia(o, i).getBoundingClientRect(), o = .9 * (r.bottom - r.top), i.style.width = o + "px", i.style.height = o + "px", n.vote ? b(R("$ liked the drawing!", a.name), "", v(Re), !0) : b(R("$ disliked the drawing!", a.name), "", v(Ae), !0));
        break;
      case ka:
        la(n);
        break;
      case Sa:
        b(R("$ is close!", n), "", v($e), !0);
        break;
      case Ma:
        Aa(O(n.id), n.msg);
        break;
      case Da:
        b(R("Spam detected! You're sending messages too quickly."), "", v(Ae), !0);
        break;
      case La:
        switch (n.id) {
          case 0:
            b(R("You need at least 2 players to start the game!"), "", v(Ae), !0);
            break;
          case 100:
            b(R("Server restarting in about $ seconds!", n.data), "", v(Ae), !0)
        }
        break;
      case Ca:
        for (var s = 0; s < n.length; s++) Gt(n[s]);
        break;
      case qa:
        Ut(!0);
        break;
      case xa:
        Pt(n);
        break;
      default:
        return void console.log("Unimplemented data packed received with id " + t)
    }
  }

  function O(e) {
    for (var t = 0; t < x.length; t++) {
      var n = x[t];
      if (n.id == e) return n
    }
  }

  function Ea(e) {
    return (e.flags & w) == w ? ["glow", "hue-rotate"] : []
  }

  function Ra(e, t) {
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
      },
      e = (x.push(n), n.id == M ? R("$ (You)", n.name) : n.name),
      a = (n.flags & w) == w,
      o = (a && n.element.classList.add("admin"), E("player-background")),
      r = (n.element.appendChild(o), a ? 1 : -1);
    if (1 == r)
      for (var i = 0; i < 7; i++) o.appendChild(E("background-bubble"));
    if (2 == r)
      for (i = 0; i < 3; i++) o.appendChild(E("background-wave"));
    var r = E("player-avatar-container"),
      l = he(n.avatar),
      r = (n.element.drawing = E("drawing"), (n.element.avatar = l).appendChild(n.element.drawing), r.appendChild(l), n.element.appendChild(r), Rn.appendChild(n.element), ge(l, Ea(n)), E("player-info")),
      l = E("player-name", e),
      e = (n.id == M && l.classList.add("me"), r.appendChild(l), r.appendChild(E("player-rank", "#" + n.rank)), r.appendChild(E("player-score", R("$ points", n.score))), a && r.appendChild(E("player-tag", "ADMIN")), n.element.appendChild(r), $(n.element, "click", function() {
        s = n, Me(m, n)
      }), E("player-icons")),
      l = E("icon owner"),
      a = E("icon muted");
    /* TYPOMOD
             desc: set ID to player to identify */
    n.element.setAttribute("playerid", n.id);
    /* TYPOEND */
    return e.appendChild(l), e.appendChild(a), n.element.appendChild(e), n.element.icons = [l, a], Pa(n, n.guessed), t && Wa(), n
  }

  function Aa(e, t) {
    var n, a, o;
    !e.muted && (o = ((a = O(M)).flags & w) == w, n = e.id == L || e.guessed, M == L || a.guessed || !n || o) && (a = (e.flags & w) == w, o = De, n && (o = Te), a && (o = Ae), Ia(e, E("text", t)), b(e.name, t, v(o), !1)
      .setAttribute("playerid", e.id))
  }

  function Ia(e, t) {
    e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
    var n = E("player-bubble"),
      a = E("content");
    return a.appendChild(t), n.appendChild(E("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function() {
      e.bubble.remove(), e.bubble = void 0
    }, 1500), n
  }

  function Ta(e, t, n) {
    n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
  }
  var Na = void 0;

  function Wa() {
    D.id, Q;
    for (var e = getComputedStyle(En).getPropertyValue("--PLAYERS_PER_PAGE"), t = (e <= 0 && (t = Math.max(48, Rn.clientHeight), e = Math.floor(t / 48)), Math.ceil(x.length / e)), n = 0; n < x.length; n++) x[n].page = Math.floor(n / e);
    null == Na ? Na = fe(An, t, [Rn], function(e, t, n) {
      for (var a = [], o = 0; o < x.length; o++) {
        var r = (i = x[o]).page == t;
        i.element.style.display = r ? "" : "none", r && a.push(i.element)
      }
      if (0 < a.length) {
        for (var i, o = 0; o < a.length; o++)(i = a[o]).classList.remove("first"), i.classList.remove("last"), o % 2 == 0 ? i.classList.remove("odd") : i.classList.add("odd");
        a[0].classList.add("first"), a[a.length - 1].classList.add("last")
      }
    }) : ye(Na, t), Na.element.style.display = 1 < t ? "" : "none"
  }

  function Oa() {
    for (var e = [], t = 0; t < x.length; t++) e.push(x[t]);
    e.sort(function(e, t) {
      return t.score - e.score
    });
    for (var n, a, o = 1, t = 0; t < e.length; t++) {
      var r = e[t];
      a = o, (n = r).rank = a, n.element.querySelector(".player-score").textContent = R("$ points", n.score), (n = n.element.querySelector(".player-rank")).textContent = "#" + a, n.classList.remove("first"), n.classList.remove("second"), n.classList.remove("third"), 1 == a && n.classList.add("first"), 2 == a && n.classList.add("second"), 3 == a && n.classList.add("third"), t < e.length - 1 && r.score > e[t + 1].score && o++
    }
  }

  function Pa(e, t) {
    (e.guessed = t) ? e.element.classList.add("guessed"): e.element.classList.remove("guessed")
  }

  function za(e, t) {
    e.element.drawing.style.display = t ? "block" : "none"
  }
  for (var Ya = [], Ha = Qe.querySelectorAll('*[id^="item-"]'), Ua = 0; Ua < Ha.length; Ua++) {
    var Ba = {
      id: Ha[Ua].id.replace("item-settings-", ""),
      element: Ha[Ua],
      index: Ha[Ua].dataset.setting
    };
    Ha[Ua].item = Ba, Ya.push(Ba), $(Ha[Ua].item.element, "change", function() {
      var e = this.value;
      "checkbox" == this.type && (e = this.checked ? 1 : 0), null != this.item.index && Zn(this.item.index, e, !0)
    })
  }
  let Ga = 10,
    Fa = 4;
  var _a = u.querySelector("#game-clock .text"),
    ja = null,
    Va = 0;

  function Ka() {
    ja && (clearInterval(ja), ja = null)
  }

  function Za(e) {
    Va = e, _a.textContent = Va
  }
  var Xa, t = u.querySelector("#tutorial"),
    Ja = t.querySelectorAll(".page"),
    Qa = fe(t.querySelector(".navigation"), Ja.length, [t.querySelector(".pages")], function(e, t, n) {
      n && clearInterval(eo);
      for (var a = 0; a < Ja.length; a++) Ja[a].classList.remove("active");
      Ja[t].classList.add("active")
    }),
    eo = setInterval(function() {
      Qa.selected < 4 ? ve(Qa, Qa.selected + 1, !1) : ve(Qa, 0, !1)
    }, 3500),
    Qe = u.querySelector("#game-settings");

  function to() {
    var e = .01 * h.innerHeight;
    u.documentElement.style.setProperty("--vh", e + "px")
  }

  function no() {
    b(R("Copied room link to clipboard!"), "", v($e), !0);
    var e = "https://skribbl.io/?" + Ln;
    if (navigator.clipboard) navigator.clipboard.writeText(e).then(function() {
      console.log("Async: Copying to clipboard was successful!")
    }, function(e) {
      console.error("Async: Could not copy text: ", e)
    });
    else {
      var t = u.createElement("textarea");
      t.value = e, t.style.top = "0", t.style.left = "0", t.style.position = "fixed", u.body.appendChild(t), t.select(), t.focus();
      try {
        var n = u.execCommand("copy");
        console.log("Copying link was " + (n ? "successful" : "unsuccessful"))
      } catch (e) {
        console.log("Unable to copy link " + e)
      }
      u.body.removeChild(t)
    }
  }

  function ao(e, t) {
    e = e.querySelector(".characters");
    0 == (e.textContent = t) ? e.classList.remove("visible") : e.classList.add("visible")
  }
  u.querySelector("#audio"), u.querySelector("#lightbulb"), $(Qe, "click", function() {
    Me(g)
  }), $(h, "resize", function() {
    to(), Wa()
  }), h.onunload = function() {
    l && na()
  }, $(u, "PointerEvent" in h ? "pointerdown" : "click", function(e) {
    u.querySelector("#game-toolbar .sizes").contains(e.target) || Tt()
  }), $([Pn, zn], "change", ce), $(Yn, "click",
    typo.joinLobby = function() {
      var t, e, n, a, o;
      n = h.location.href,
        typo.lastConnect = Date.now(), o = "", n = n.split("?"), t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o, Dn || (e = "" != t ? "id=" + t : "lang=" + zn.value, Le(), Bn(!0), _n(function() {
        Gn(Cn, e, function(e) {
          Bn(!1), e.success && jn(e.data, t)
        }, !0)
      }))
    }), $(Hn, "click", function() {
    Dn || (Le(), Bn(!0), _n(function() {
      Gn(Cn, "lang=" + zn.value, function(e) {
        e.success ? jn(e.data, 0, 1) : Bn(!1)
      }, !0)
    }))
  }), $(u.querySelector("#game-rate .like"), "click", function() {
    ea(1)
  }), $(u.querySelector("#game-rate .dislike"), "click", function() {
    ea(0)
  }), $(u.querySelector("#button-start-game"), "click", function() {
    if (l) {
      var e = u.querySelector("#item-settings-customwords").value.split(","),
        t = "";
      if (5 <= e.length) {
        for (var n = 0; n < e.length; n++) e[n] = e[n].trim();
        t = e.join(",")
      }
      l.emit("data", {
        id: 22,
        data: t
      })
    }
  }), $([u.querySelector("#button-invite"), u.querySelector("#modal-player-button-invite")], "click", no), $(y[m].querySelector("button.kick"), "click", function() {
    Le(), null != s && s.id != M && l && l.emit("data", {
      id: 3,
      data: s.id
    })
  }), $(y[m].querySelector("button.ban"), "click", function() {
    Le(), null != s && s.id != M && l && l.emit("data", {
      id: 4,
      data: s.id
    })
  }), $(y[m].querySelector("button.votekick"), "click", function() {
    Le(), null != s && s.id != M && l && (s.id == T ? b(R("You can not votekick the lobby owner!"), "", v(Ae), !0) : l.emit("data", {
      id: da,
      data: s.id
    }))
  }), $(y[m].querySelector("button.mute"), "click", function() {
    null != s && s.id != M && (s.muted = !s.muted, Ta(s, 1, s.muted), s.muted ? b(R("You muted '$'!", s.name), "", v(Ae), !0) : b(R("You unmuted '$'!", s.name), "", v(Ae), !0), l && l.emit("data", {
      id: 7,
      data: s.id
    }), xe(s.muted))
  }), $(y[m].querySelector("button.report"), "click", function() {
    y[m].querySelector(".buttons").style.display = "none", y[m].querySelector(".player").style.display = "none", y[m].querySelector(".report-menu").style.display = "";
    for (var e = y[m].querySelectorAll(".report-menu input"), t = 0; t < e.length; t++) e[t].checked = !1
  }), $(y[m].querySelector("button#report-send"), "click", function() {
    var e = 0;
    y[m].querySelector("#report-reason-toxic").checked && (e |= 1), y[m].querySelector("#report-reason-spam").checked && (e |= 2), y[m].querySelector("#report-reason-bot").checked && (e |= 4), 0 < e && (null != s && s.id != M && (s.reported = !0, l && l.emit("data", {
      id: 6,
      data: {
        id: s.id,
        reasons: e
      }
    }), b(R("Your report for '$' has been sent!", s.name), "", v($e), !0)), Le())
  }), $(y[g].querySelector("#volume input"), "change", function(e) {
    p.volume = e.target.value, N.setVolume(p.volume), N.playSound(bn), ce()
  }), $(y[g].querySelector("#select-pressure-sensitivity"), "change", function(e) {
    p.pressureSensitivity = e.target.value, ce()
  }), $(y[g].querySelector("button.reset"), "click", function() {
    for (var e = 0; e < d.length; e++) {
      var t = d[e];
      t.key = t.def, t.listing.querySelector("input").value = t.key;
      for (var n = 0; n < t.changed.length; n++) t.changed[n](t)
    }
    se()
  }), $(Wn[1], "focus", function(e) {
    function t(e) {
      h.removeEventListener("scroll", t), h.scroll(0, 0), e.preventDefault()
    }
    Tn.classList.add("input-focus"), h.addEventListener("scroll", t), setTimeout(function() {
      t(e)
    }, 200), e.preventDefault()
  }), $(Wn[1], "blur", function(e) {
    Tn.classList.remove("input-focus")
  }), $(Wn, "input", function(e) {
    ao(this.parentNode, this.value.length)
  }), $(Nn, "submit", function(e) {
    const input = this.querySelector("input"); let rest = input.value.substring(100);
    input.value = input.value.substring(0,100);
    if(rest.length > 0) setTimeout(()=>{input.value = rest; e.target.dispatchEvent(new Event("submit"));},180);
    e.preventDefault();
    var e = this.querySelector("input");
    return e.value && (e = e.value, l && l.connected ? l.emit("data", {
      id: Ma,
      data: e
    }) : Aa(O(M), e)), this.reset(), ao(this, 0), !1
  }), to(), h.localStorageAvailable ? (Pn.value = a("name", ""), zn.value = (e => {
    for (var t = u.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
      if (t[n].value == e) return t[n].value;
    return 0
  })(a("lang", 0)), p.displayLang = a("displaylang", "en"), p.volume = parseInt(a("volume", 100)), p.filterChat = 1 == parseInt(a("filter", 1)) ? 1 : 0, p.pressureSensitivity = 1 == parseInt(a("pressure", 1)) ? 1 : 0, p.avatar = (t = "ava", Qe = p.avatar, null == (t = c.getItem(t)) ? Qe : JSON.parse(t)), y[g].querySelector("#volume input").value = p.volume, N.setVolume(p.volume), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
  for (var oo = u.querySelectorAll("[data-translate]"), ro = 0; ro < oo.length; ro++) {
    var io = oo[ro];
    Be(io, io.dataset.translate)
  }
  for (var lo = Ye[p.displayLang], so = 0; so < He.length; so++) {
    var co = He[so],
      uo = Ue(lo, co.key);
    "text" == co.type && (co.element.textContent = uo), "placeholder" == co.type && (co.element.placeholder = uo)
  }

  function ho(e) {
    Xa.parts[e].classList.remove("bounce"), Xa.parts[e].offsetWidth, Xa.parts[e].classList.add("bounce")
  }
  $(Yn = u.querySelectorAll("[data-tooltip]"), "pointerenter", function(e) {
    Pe(e.target)
  }), $(Yn, "pointerleave", function(e) {
    ze()
  }), Nn = (Hn = u.querySelector("#home .avatar-customizer")).querySelector(".container"), Qe = Hn.querySelectorAll(".arrows.left .arrow"), t = Hn.querySelectorAll(".arrows.right .arrow"), Hn = Hn.querySelectorAll(".randomize"), (Xa = he(p.avatar)).classList.add("fit"), Nn.appendChild(Xa), $(Qe, "click", function() {
    var e = parseInt(this.dataset.avatarIndex);
    --p.avatar[e], p.avatar[e] < 0 && (p.avatar[e] = n[e] - 1), ho(e), pe(Xa, p.avatar), ce()
  }), $(t, "click", function() {
    var e = parseInt(this.dataset.avatarIndex);
    p.avatar[e] += 1, p.avatar[e] >= n[e] && (p.avatar[e] = 0), ho(e), pe(Xa, p.avatar), ce()
  }), $(Hn, "click", function() {
    p.avatar[0] = Math.floor(Math.random() * n[0]), p.avatar[1] = Math.floor(Math.random() * n[1]), p.avatar[2] = Math.floor(Math.random() * n[2]), ho(1), ho(2), pe(Xa, p.avatar), ce()
  });
  for (var po = Math.round(8 * Math.random()), mo = u.querySelector("#home .logo-big .avatar-container"), go = 0; go < 8; go++) {
    var fo = [0, 0, 0, -1],
      fo = (fo[0] = go, fo[1] = Math.round(100 * Math.random()) % Y, fo[2] = Math.round(100 * Math.random()) % H, 100 * Math.random() < 1 && (fo[3] = Math.floor(20 * Math.random())), Un && 100 * Math.random() < 35 && (fo[3] = 96 + Math.floor(4 * Math.random())), he(fo, po == go));
    fo.index = go, mo.appendChild(fo), $(fo, "click", function() {
      var e = [this.index, 0, 0, -1];
      e[1] = Math.round(100 * Math.random()) % Y, e[2] = Math.round(100 * Math.random()) % H, 1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())), pe(this, e), this.classList.remove("clicked"), this.offsetWidth, this.classList.add("clicked")
    })
  }
  document.dispatchEvent(new Event("skribblInitialized")); document.body.setAttribute("typo-skribbl-loaded", "true");
})(window, document, localStorage, io);