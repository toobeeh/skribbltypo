! function(h, u, c, P) {
    const Y = 26,
      z = 57,
      H = 51,
      U = [Y, z, H],
      B = 0,
      G = 1,
      F = 2,
      K = 5,
      _ = 0,
      V = 1,
      X = 2,
      j = 3,
      Z = 4,
      J = 5,
      Q = 6,
      ee = 7;
    const te = 1,
      ne = 2,
      ae = {
          LANG: 0,
          SLOTS: 1,
          DRAWTIME: 2,
          ROUNDS: 3,
          WORDCOUNT: 4,
          HINTCOUNT: 5,
          WORDMODE: 6,
          CUSTOMWORDSONLY: 7
      },
      oe = {
          NORMAL: 0,
          HIDDEN: 1,
          COMBINATION: 2
      }
// TYPOMOD
      // desc: create re-useable functions
      , typo = {
          joinLobby: undefined,        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
              // IDENTIFY x.value.split: #home .container-name-lang input -> Zn
              // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> p
              return { id: id, name: name.length != 0 ? name : (Zn.value.split("#")[0] != "" ? Zn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? p.avatar : avatar, score: score, guessed: guessed };
          },
          createFakeLobbyData: (
            settings = ["PRACTISE", "en", 1, 1, 80, 3, 3, 2, 0, false],
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
              let abort=false; document.addEventListener("abortJoin", () => abort = true); document.addEventListener("joinLobby", (e) => {
                  abort=false;let timeoutdiff = Date.now() - (typo.lastConnect == 0 ? Date.now() : typo.lastConnect);
                  //Xn(true);
                  setTimeout(() => {
                      if(abort) return; typo.lastConnect = Date.now();
                      //Qn.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                      //##PRIVATELBBY## = !1 // IDENTIFY: x:  = !1
                      if(e.detail) window.history.pushState({path:window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);////##JOINLOBBY##(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                      typo.joinLobby(); window.history.pushState({path:window.location.origin}, '', window.location.origin);//na(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                      document.dispatchEvent(new Event("joinedLobby"));
                  }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
              });
              document.addEventListener("leaveLobby", () => {
                  if (typo.disconnect) typo.disconnect();
                  else ga() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
              });
              document.addEventListener("setColor", (e) => {
                  let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                  let match = Dt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
                  let code = match >= 0 ? match : e.detail.code;
                  if (e.detail.secondary) Bt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                  else Ut(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
              });
              document.addEventListener("performDrawCommand", (e) => {
                  k.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                  Jt(nn(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
              });
              document.addEventListener("addTypoTooltips", () => {
                  [...document.querySelectorAll("[data-typo-tooltip]")].forEach(elem => {
                      elem.setAttribute("data-tooltip", elem.getAttribute("data-typo-tooltip"));
                      elem.removeAttribute("data-typo-tooltip");
                      elem.addEventListener("mouseenter", (e) => Pe(e.target)); // IDENTIFY: x(e.target):
                      elem.addEventListener("mouseleave", (e) => Ye()); // IDENTIFY: (e) => x():

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
    re = ["Normal", "Hidden", "Combination"],
      ie = ["English", "German", "Bulgarian", "Czech", "Danish", "Dutch", "Finnish", "French", "Estonian", "Greek", "Hebrew", "Hungarian", "Italian", "Japanese", "Korean", "Latvian", "Macedonian", "Norwegian", "Portuguese", "Polish", "Romanian", "Russian", "Serbian", "Slovakian", "Spanish", "Swedish", "Tagalog", "Turkish"];
    if (h.localStorageAvailable = !1, void 0 !== c) try {
        c.setItem("feature_test", "yes"), "yes" === c.getItem("feature_test") && (c.removeItem("feature_test"), h.localStorageAvailable = !0)
    } catch (e) {}
    var d = [];

    function le(e) {
        for (var t = 0; t < d.length; t++)
            if (d[t].name == e) return d[t]
    }

    function se(e, t, n, a, o) {
        var r, i, l = t,
          s = (h.localStorageAvailable && (r = c.getItem("hotkey_" + e)) && (t = r), le(e));
        return s ? (s.key = t, s.def = l, s.desc = n) : (s = {
            name: e,
            desc: n,
            key: t,
            def: l,
            listing: R("item"),
            changed: [],
            cb: []
        }, d.push(s), Ze(r = R("key", s.name), "text"), s.listing.appendChild(r), (i = u.createElement("input")).value = s.key, s.listing.appendChild(i), E(i, "keydown", function(e) {
            for (var t = e.key, n = 0; n < d.length; n++)
                if (d[n].key == t) return void e.preventDefault();
            i.value = t, s.key = t;
            for (n = 0; n < s.changed.length; n++) s.changed[n](s);
            return ce(), e.preventDefault(), !1
        }), y[g].querySelector("#hotkey-list").appendChild(s.listing)), a && s.cb.push(a), o && s.changed.push(o), s
    }

    function ce() {
        if (h.localStorageAvailable)
            for (var e = 0; e < d.length; e++) h.localStorage.setItem("hotkey_" + d[e].name, d[e].key)
    }
    var p = {
        avatar: [Math.round(100 * Math.random()) % Y, Math.round(100 * Math.random()) % z, Math.round(100 * Math.random()) % H, -1],
        volume: 100,
        dark: 0,
        filterChat: 1,
        pressureSensitivity: 1,
        displayLang: "en",
        undefined
    };

    function n(e, t) {
        e = c.getItem(e);
        return null == e ? t : e
    }

    function a() {
        h.localStorageAvailable ? (c.setItem("name", Zn.value), c.setItem("lang", Jn.value), c.setItem("displaylang", p.displayLang), c.setItem("volume", p.volume), c.setItem("dark", 1 == p.dark ? 1 : 0), c.setItem("filter", 1 == p.filterChat ? 1 : 0), c.setItem("pressure", 1 == p.pressureSensitivity ? 1 : 0), c.setItem("ava", JSON.stringify(p.avatar)), c.setItem("keyboard", Ue.value), c.setItem("keyboardlayout", Be.value), console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
    }

    function E(e, t, n) {
        for (var a, o = e, r = ("string" == typeof e ? o = u.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]), t.split(" ")), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++) o[i].addEventListener(r[l], n)
    }

    function R(e, t) {
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

    function $(e) {
        for (; e.firstChild;) e.removeChild(e.firstChild)
    }

    function ue(e, t, n) {
        var a = R("avatar"),
          o = R("color"),
          r = R("eyes"),
          i = R("mouth"),
          l = R("special"),
          s = R("owner");
        return s.style.display = n ? "block" : "none", a.appendChild(o), a.appendChild(r), a.appendChild(i), a.appendChild(l), a.appendChild(s), a.parts = [o, r, i], he(a, e), a
    }

    function he(e, t) {
        function n(e, t, n, a) {
            var o = -t % n * 100,
              t = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + t + "%"
        }
        var a = t[0] % Y,
          o = t[1] % z,
          r = t[2] % H,
          t = t[3],
          a = (n(e.querySelector(".color"), a, 10), n(e.querySelector(".eyes"), o, 10), n(e.querySelector(".mouth"), r, 10), e.querySelector(".special"));
        0 <= t ? (a.style.display = "", n(a, t, 10)) : a.style.display = "none"
    }

    function pe(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }

    function me(e, t, n, a) {
        var o = {
            element: R("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element), n.push(o.element), E(n, "DOMMouseScroll wheel", function(e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), fe(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), ge(o, t), o
    }

    function ge(e, t) {
        $(e.element), e.dots = [];
        for (var n = 0; n < t; n++) {
            var a = R("dot");
            a.index = n, a.appendChild(R("inner")), E(a, "click", function() {
                fe(e, this.index, !0)
            }), e.element.appendChild(a), e.dots.push(a)
        }
        e.selected < 0 && (e.selected = 0), e.selected >= t && (e.selected = t - 1), fe(e, e.selected, !1)
    }

    function fe(e, t, n) {
        if (0 <= t && t < e.dots.length) {
            e.selected = t;
            for (var a = 0; a < e.dots.length; a++) e.dots[a].classList.remove("active");
            e.dots[t].classList.add("active"), e.change(e, t, n)
        }
    }
    const m = 0,
      ye = 1,
      ve = 2,
      be = 3,
      g = 4,
      ke = 5;
    var f = u.querySelector("#modal"),
      Se = f.querySelector(".modal-title .text"),
      we = f.querySelector(".modal-content"),
      y = [];

    function Ce(e) {
        y[m].querySelector(".buttons button.mute").textContent = I(e ? "Unmute" : "Mute")
    }

    function i(e, t) {
        f.style.display = "block";
        for (var n = 0; n < y.length; n++) y[n].style.display = "none";
        y[e].style.display = "flex";
        var a = y[e];
        switch (e) {
            case ye:
                Se.textContent = I("Something went wrong!"), a.querySelector(".message").textContent = t;
                break;
            case ve:
                Se.textContent = I("Disconnected!"), a.querySelector(".message").textContent = t;
                break;
            case m:
                Se.textContent = t.id == x ? I("$ (You)", t.name) : t.name;
                var o = (W(x).flags & On) == On,
                  r = (t.flags & On) == On,
                  i = a.querySelector(".buttons"),
                  r = (i.style.display = t.id == x || r ? "none" : "flex", i.querySelector(".button-pair").style.display = x == Wn || o ? "flex" : "none", i.querySelector("button.report").style.display = t.reported ? "none" : "", Ce(t.muted), a.querySelector(".report-menu").style.display = "none", a.querySelector(".invite").style.display = x == t.id ? "flex" : "none", we.querySelector(".player")),
                  o = (r.style.display = "", $(r), ue(t.avatar));
                pe(o, Wn == t.id), r.appendChild(o);
                break;
            case ke:
                Se.textContent = I("Rooms"), roomsUpdate(t);
                break;
            case be:
                Se.textContent = 0 == Yn ? "Public Room" : "Private Room", $(a);
                for (var l = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"], s = R("settings"), n = 0; n < Pn.length; n++) {
                    var c = R("setting"),
                      d = de("img", "icon"),
                      d = (d.src = "/img/setting_" + n + ".gif", c.appendChild(d), c.appendChild(de("span", "name", l[n] + ":")), Pn[n]);
                    n == ae.CUSTOMWORDSONLY && (d = d ? "Yes" : "No"), n == ae.SLOTS && (d = w.length + "/" + d), n == ae.LANG && (d = ie[d]), n == ae.WORDMODE && (d = re[d]), n == ae.DRAWTIME && (d += "s"), c.appendChild(de("span", "value", d)), s.appendChild(c)
                }
                a.appendChild(s);
                i = u.querySelector("#game-invite").cloneNode(!0);
                E(i.querySelector("#copy-invite"), "click", go), a.appendChild(i);
                break;
            case g:
                Se.textContent = I("Settings"), a.querySelector("#select-pressure-sensitivity").value = p.pressureSensitivity
        }
    }

    function qe() {
        f.style.display = "none"
    }
    y[m] = f.querySelector(".modal-container-player"), y[ye] = f.querySelector(".modal-container-info"), y[ve] = f.querySelector(".modal-container-info"), y[be] = f.querySelector(".modal-container-room"), y[g] = f.querySelector(".modal-container-settings"), E(h, "click", function(e) {
        e.target == f && qe()
    }), E([f.querySelector(".close"), y[ye].querySelector("button.ok")], "click", qe);
    var xe = u.querySelector("#game-chat form"),
      Me = u.querySelector("#game-chat form input"),
      Le = u.querySelector("#game-chat .chat-content");
    const De = 0;
    const Ee = 2,
      Re = 3,
      $e = 4,
      Ie = 5,
      Ae = 6,
      Te = 7,
      Ne = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];

    function v(e) {
        return "var(--COLOR_CHAT_TEXT_" + Ne[e] + ")"
    }

    function Oe() {
        Le.scrollTop = Le.scrollHeight + 100
    }

    function b(e, t, n, a) {
        var o = u.createElement("p"),
          r = u.createElement("b"),
          a = (r.textContent = a ? e : e + ": ", o.appendChild(r), o.style.color = n, u.createElement("span")),
          e = (a.textContent = t, o.appendChild(a), Le.scrollHeight - Le.scrollTop - Le.clientHeight <= 20);
        if (Le.appendChild(o), e && Oe(), 0 < p.chatDeleteQuota)
            for (; Le.childElementCount > p.chatDeleteQuota;) Le.firstElementChild.remove();
        return o
    }
    var l = void 0,
      We = void 0;

    function Pe(e) {
        Ye();
        for (var t = (We = e).dataset.tooltip, n = e.dataset.tooltipdir || "N", a = ((l = R("tooltip")).appendChild(R("tooltip-arrow")), l.appendChild(R("tooltip-content", I(t))), !1), o = e; o;) {
            if ("fixed" == h.getComputedStyle(o).position) {
                a = !0;
                break
            }
            o = o.parentElement
        }
        l.style.position = a ? "fixed" : "absolute";
        var t = e.getBoundingClientRect(),
          e = ("E" == (n = "W" == (n = "S" == (n = "N" == n && t.top - h.scrollY < 48 ? "S" : n) && t.bottom - h.scrollY > u.documentElement.clientHeight - 48 ? "N" : n) && t.left - h.scrollX < 48 ? "E" : n) && t.right - h.scrollX > u.documentElement.clientWidth - 48 && (n = "W"), t.left),
          r = t.top;
        "N" == n && (e = (t.left + t.right) / 2), "S" == n && (e = (t.left + t.right) / 2, r = t.bottom), "E" == n && (e = t.right, r = (t.top + t.bottom) / 2), "W" == n && (r = (t.top + t.bottom) / 2), a || (e += h.scrollX, r += h.scrollY), l.classList.add(n), l.style.left = e + "px", l.style.top = r + "px", u.body.appendChild(l)
    }

    function Ye() {
        l && (l.remove(), We = l = void 0)
    }

    function ze() {
        l && (l.querySelector(".tooltip-content").textContent = I(We.dataset.tooltip))
    }
    const He = [{
        code: "en",
        name: "English",
        layout: [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Z", "X", "C", "V", "B", "N", "M"]
        ]
    }, {
        code: "fr",
        name: "French",
        layout: [
            ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
            ["W", "X", "C", "V", "B", "N", "É", "È", "Ç", "À", "'"]
        ]
    }, {
        code: "de",
        name: "German",
        layout: [
            ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
            ["Y", "X", "C", "V", "B", "N", "M"]
        ]
    }, {
        code: "tr",
        name: "Turkish",
        layout: [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
            ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"]
        ]
    }, {
        code: "ru",
        name: "Russian",
        layout: [
            ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"],
            ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"],
            ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Ё"]
        ]
    }, {
        code: "es",
        name: "Spanish",
        layout: [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
            ["Z", "X", "C", "V", "B", "N", "M"]
        ]
    }];
    var Ue = u.querySelector("#select-mobile-keyboard-enabled"),
      Be = u.querySelector("#select-mobile-keyboard-layout"),
      Ge = {
          elements: {
              main: u.querySelector("#game-keyboard"),
              input: u.querySelector("#game-keyboard .input"),
              rows: u.querySelector("#game-keyboard .keys"),
              caps: 0,
              keys: []
          },
          lang: 0,
          input: "",
          caps: !1,
          keys: [],
          rows: [],
          columns: 0,
          isOpen: !1,
          getKeyLowercase: function(e) {
              return e.toLocaleLowerCase(this.lang)
          },
          getKeyUppercase: function(e) {
              return e.toLocaleUpperCase(this.lang)
          },
          init: function(e) {
              this.lang = e.code, this.caps = !1, this.columns = 0, this.elements.keys = [], $(this.elements.rows);
              var t = e.layout,
                i = this;

              function n(e, t, n) {
                  var a, o = de("button", "key"),
                    r = "PointerEvent" in h ? "pointerdown" : "click";
                  return Fe.has(t) ? (a = Fe.get(t), o.classList.add(a.class), o.appendChild(de("span", "material-icons", a.icon)), E(o, r, function(e) {
                      a.callback(i)
                  })) : (o.textContent = i.getKeyLowercase(t), E(o, r, function(e) {
                      i.inputAdd(t)
                  }), i.elements.keys.push(o)), n ? e.insertBefore(o, e.firstChild) : e.appendChild(o), o
              }
              for (var a = 0, o = 0; o < t.length; o++)
                  for (var a = i.addRow(), r = 0; r < t[o].length; r++) n(a, t[o][r]);
              this.elements.caps = n(a, "caps", !0), n(a, "backspace"), a = i.addRow();
              for (var l = ["-", "space", ".", "enter"], r = 0; r < l.length; r++) n(a, l[r])
          },
          addRow: function() {
              var e = R("row");
              return this.elements.rows.appendChild(e), this.rows.push(e), e
          },
          inputChanged: function() {
              Ge.elements.input.querySelector("span").textContent = Ge.input
          },
          inputAdd: function(e) {
              this.input += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e), this.inputChanged(), this.caps && this.toggleCaps()
          },
          enter: function() {
              0 < this.input.length && (yo(this.input), this.input = "", this.inputChanged())
          },
          toggleCaps: function() {
              this.caps = !this.caps;
              for (var e = 0; e < this.elements.keys.length; e++) {
                  var t = this.elements.keys[e];
                  t.textContent = this.caps ? this.getKeyUppercase(t.textContent) : this.getKeyLowercase(t.textContent)
              }
              this.elements.caps.classList.toggle("enabled", this.caps)
          }
      };
    const Fe = new Map;

    function Ke() {
        1 == Ue.value ? u.documentElement.dataset.mobileKeyboard = "" : delete u.documentElement.dataset.mobileKeyboard
    }
    Fe.set("backspace", {
        class: "wide",
        icon: "backspace",
        callback: function(e) {
            0 < e.input.length && (e.input = e.input.slice(0, -1), e.inputChanged())
        }
    }), Fe.set("caps", {
        class: "wide",
        icon: "keyboard_capslock",
        callback: function(e) {
            e.toggleCaps()
        }
    }), Fe.set("enter", {
        class: "wide",
        icon: "keyboard_return",
        callback: function(e) {
            e.enter()
        }
    }), Fe.set("space", {
        class: "extra-wide",
        icon: "space_bar",
        callback: function(e) {
            e.input += " ", e.inputChanged()
        }
    });
    for (var e = 0; e < He.length; e++) {
        var _e = de("option");
        _e.textContent = He[e].name, _e.value = He[e].code, Be.appendChild(_e)
    }
    E(Be, "change", function(e) {
        for (var t = void 0, n = 0; n < He.length; n++) He[n].code == this.value && (t = He[n]);
        null != t && Ge.init(t)
    }), E([Ue, Be], "change", function(e) {
        a(), Ke()
    }), E(Ge.elements.input, "click", function() {
        Ge.isOpen || (u.documentElement.dataset.mobileKeyboardOpen = "", Va(), Oe(), Ge.isOpen = !0)
    }), Ge.init(He[0]);
    var Ve = {},
      Xe = [];

    function je(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }

    function I(e, t) {
        var n = je(Ve[p.displayLang], e),
          a = "",
          o = 0;
        Array.isArray(t) || (t = [t]);
        for (var r = 0; r < n.length; r++) {
            var i = n.charAt(r);
            "$" == i ? (a += t[o], o++) : a += i
        }
        return a
    }

    function Ze(e, t) {
        if ("children" == t)
            for (var n = 0; n < e.children.length; n++) {
                var a = e.children[n].dataset.translate;
                Ze(e.children[n], null == a ? "text" : a)
            } else {
            var o = "";
            "text" == t && (o = e.textContent), 0 < (o = "placeholder" == t ? e.placeholder : o).length ? Xe.push({
                key: o,
                element: e,
                type: t
            }) : (console.log("Empty key passed to translate with!"), console.log(e))
        }
    }
    Ve.en = {}, Ve.de = {
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
    const Je = 0,
      Qe = 1;
    const et = 0,
      tt = 2,
      nt = 1;
    const at = 4,
      ot = 40;
    var rt = [4, 10, 20, 32, 40],
      it = u.querySelector("#game-toolbar"),
      lt = it.querySelector(".toolbar-group-tools"),
      st = it.querySelector(".toolbar-group-actions"),
      ct = u.querySelector("#game-toolbar .sizes .size-preview"),
      dt = u.querySelector("#game-toolbar .sizes .container"),
      ut = u.querySelector("#game-toolbar .colors");

    function ht(e, t) {
        var n, a, o, r = R("tool clickable"),
          i = (r.appendChild(R("icon")), r.appendChild(R("key")), t),
          l = (i.id = e, (i.element = r).toolIndex = e, r.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")", n = r, o = t.name, a = "S", n.dataset.tooltip = o, n.dataset.tooltipdir = a, E(n, "pointerenter", function(e) {
              Pe(e.target)
          }), E(n, "pointerleave", function(e) {
              Ye()
          }), o = t.isAction ? (r.addEventListener("click", function(e) {
              zt(this.toolIndex)
          }), st.appendChild(r), mt[e] = i, se(t.name, t.keydef, "", function() {
              zt(e)
          }, function(e) {
              l.textContent = e.key
          })) : (r.addEventListener("click", function(e) {
              Ht(this.toolIndex)
          }), lt.appendChild(r), pt[e] = i, se(t.name, t.keydef, "", function() {
              Ht(i.id)
          }, function(e) {
              l.textContent = e.key
          })), r.querySelector(".key"));
        l.textContent = o.key, t.hide && (r.style.display = "none")
    }
    var pt = [],
      mt = (ht(et, {
          isAction: !1,
          name: "Brush",
          keydef: "B",
          graphic: "pen.gif",
          cursor: 0
      }), ht(nt, {
          isAction: !1,
          name: "Fill",
          keydef: "F",
          graphic: "fill.gif",
          cursor: "url(/img/fill_cur.png) 7 38, default"
      }), []),
      C = (ht(0, {
          isAction: !0,
          name: "Undo",
          keydef: "U",
          graphic: "undo.gif",
          action: function() {
              {
                  var e;
                  M == x && 0 < bt.length && (bt.pop(), 0 < bt.length ? (Xt(e = bt[bt.length - 1]), s && s.emit("data", {
                      id: Pa,
                      data: e
                  })) : en())
              }
          }
      }), ht(1, {
          isAction: !0,
          name: "Clear",
          keydef: "C",
          graphic: "clear.gif",
          action: en
      })
        /*,*/ /*TYPOMOD DESC: add action for colorswitch*/ /*ht(2, {
        isAction: !0,
        name: "Switcher",
        graphic: "",
        action: ()=>{document.dispatchEvent(new Event("toggleColor"));}
    })*/ /*TYPOEND*/
        , /*TYPOMOD DESC: add action for brushlab*/ ht(3, {
          isAction: !0,
          name: "Lab",
          graphic: "",keydef:'L',
          action: ()=>{document.dispatchEvent(new Event("openBrushLab"));}
      }) /*TYPOEND*/, u.querySelector("#game-canvas canvas")),
      gt = C.getContext("2d", {
          willReadFrequently: !0
      }),
      k = [],
      ft = 0,
      yt = 0,
      vt = [],
      r = [0, 9999, 9999, 0, 0],
      bt = [],
      S = [0, 0],
      kt = [0, 0],
      St = 0,
      wt = u.createElement("canvas"),
      o = (wt.width = ot + 2, wt.height = ot + 2, wt.getContext("2d"));

    function Ct() {
        var e = pt[xt].cursor;
        if (L.id == Z && M == x) {
            if (xt == et) {
                var t = wt.width,
                  n = Rt;
                if (n <= 0) return;
                o.clearRect(0, 0, t, t);
// TYPOMOD
// desc: cursor with custom color
                var a = Mt < 10000 ? Dt[Mt] : typo.hexToRgb((Mt - 10000).toString(16).padStart(6, "0"));
// TYPOEND

                a = [(a = 1 == p.dark ? [Math.floor(.75 * a[0]), Math.floor(.75 * a[1]), Math.floor(.75 * a[2])] : a)[0], a[1], a[2], .8];
                o.fillStyle = "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ")", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.fill(), o.strokeStyle = "#FFF", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.stroke(), o.strokeStyle = "#000", o.beginPath(), o.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), o.stroke();
                a = t / 2, e = "url(" + wt.toDataURL() + ")" + a + " " + a + ", default"
            }
        } else e = "default";
        C.style.cursor = e
    }
    var qt = 0,
      xt = 0,
      Mt = 0,
      Lt = 0,
      Dt = [
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
      Et = ["White", "Black", "Light Gray", "Gray", "Red", "Dark Red", "Orange", "Dark Orange", "Yellow", "Dark Yellow", "Green", "Dark Green", "Mint", "Dark Mint", "Skyblue", "Dark Skyblue", "Seablue", "Dark Seablue", "Purple", "Dark Purple", "Pink", "Dark Pink", "Beige", "Dark Beige", "Brown", "Dark Brown"],
      Rt = 0,
      $t = -1,
      It = [];

    function At(e) {
        return 20 + (e - at) / (ot - at) * 80
    }
    for (e = 0; e < rt.length; e++) {
        var Tt = R("size clickable"),
          Nt = R("icon"),
          Ot = (Nt.style.backgroundSize = At(rt[e]) + "%", {
              id: e,
              size: rt[e],
              element: Tt,
              elementIcon: Nt
          });
        Tt.appendChild(Nt), dt.appendChild(Tt), Tt.size = Ot, It.push(Ot)
    }
    for (var Wt = [R("top"), R("bottom")], e = 0; e < Dt.length / 2; e++) Wt[0].appendChild(Kt(2 * e)), Wt[1].appendChild(Kt(2 * e + 1)), u.querySelector("#game-toolbar .colors-mobile .top").appendChild(Kt(2 * e)), u.querySelector("#game-toolbar .colors-mobile .bottom").appendChild(Kt(2 * e + 1));
    for (e = 0; e < Wt.length; e++) ut.appendChild(Wt[e]);

    function Pt(e) {
        Rt = q(e, at, ot);
        for (var t = It[It.length - 1], n = t.size, a = 0; a < It.length; a++) {
            var o = It[a],
              r = Math.abs(Rt - o.size);
            r <= n && (n = r, t = o, 0), o.element.classList.remove("selected")
        }
        t.element.classList.add("selected"), it.querySelector(".size-preview .icon").style.backgroundSize = At(Rt) + "%", Ct()
    }

    function Yt(e) {
        e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
    }

    function zt(e) {
        Yt(mt[e].element), mt[e].action()
    }

    function Ht(e, t) {
        Yt(pt[e].element), e == xt && !t || (pt[qt = xt].element.classList.remove("selected"), pt[e].element.classList.add("selected"), xt = e, Ct())
    }

    function Ut(e) {
        var t =
          e > 10000 ? _t(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : _t(Dt[e]);
        Mt = e, u.querySelector("#color-preview-primary").style.fill = t, u.querySelector("#game-toolbar .color-picker-mobile .preview").style.backgroundColor = t, Ct()
    }

    function Bt(e) {
        var t =
          e > 10000 ? _t(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : _t(Dt[e]);
        Lt = e, u.querySelector("#color-preview-secondary").style.fill = t, Ct()
    }

    function Gt() {
        var e = Mt;
        Ut(Lt), Bt(e)
    }

    function Ft() {
        dt.classList.remove("open")
    }

    function Kt(e) {
        var t = R("color");
        return t.style.backgroundColor = _t(Dt[e]), t.colorIndex = e, t
    }

    function _t(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function Vt(e) {
        /*TYPOMOD
        desc: if color code > 1000 -> customcolor*/if(e < 1000)
            e = q(e, 0, Dt.length), e = Dt[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function Xt(e) {
        if (k = k.slice(0, e), !(x != M && yt < e)) {
            /* TYPOMOD
                    desc: replace draw commands because of redo*/        const keepCommands = k;
            /* TYPOEND*/
            r = Zt();
            e = Math.floor(k.length / jt);
            vt = vt.slice(0, e), rn();
            for (var t = 0; t < vt.length; t++) {
                var n = vt[t];
                gt.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = vt.length * jt; t < k.length; t++) Jt(nn(k[t]), k[t]);
            ft = Math.min(k.length, ft), yt = Math.min(k.length, yt)

            /* TYPOMOD
                     log kept commands*/
            document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
            /* TYPOEND*/}
    }
    const jt = 50;

    function Zt() {
        return [0, 9999, 9999, 0, 0]
    }

    function Jt(e) {
        var t, n, a, o;
        r[0] += 1, r[1] = Math.min(r[1], e[0]), r[2] = Math.min(r[2], e[1]), r[3] = Math.max(r[3], e[2]), r[4] = Math.max(r[4], e[3]), r[0] >= jt && (t = r[1], n = r[2], a = r[3], o = r[4], (a - t <= 0 || o - n <= 0) && (t = e[0], n = e[1], a = e[2], o = e[3]), e = gt.getImageData(t, n, a - t, o - n), vt.push({
            data: e,
            bounds: r
        }), r = Zt())
    }

    function Qt(e) {
        return (e || 0 < k.length || 0 < bt.length || 0 < ft || 0 < yt) && (k = [], bt = [], ft = yt = 0, r = Zt(), vt = [], rn(), 1)
    }

    function en() {
        M == x && Qt() && s && s.emit("data", {
            id: Wa
        })
    }

    function tn(e) {
        var t, n, a, o, r, i;
        ((t = e)[0] != Je ? t[0] == Qe && 0 <= t[2] && t[2] < C.width && 0 <= t[3] && t[3] < C.height : (a = t[3], o = t[4], r = t[5], i = t[6], t = Math.ceil(t[2] / 2), n = (a + r) / 2, o = (o + i) / 2, r = Math.abs(r - a) / 2, a = Math.abs(i - i) / 2, (i = {
            x1: -(t + r),
            y1: -(t + r),
            x2: C.width + t + r,
            y2: C.height + t + a
        }).x1 < n && n < i.x2 && i.y1 < o && o < i.y2)) ? (k.push(e), x == M && Jt(nn(e)))
          /* TYPOMOD
                   log draw commands */
          & document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }))
          /* TYPOEND */: console.log("IGNORED COMMAND OUT OF CANVAS BOUNDS")
    }

    function nn(e) {
        var t = [0, 0, C.width, C.height];
        switch (e[0]) {
            case Je:
                var n = q(Math.floor(e[2]), at, ot),
                  a = Math.ceil(n / 2),
                  o = q(Math.floor(e[3]), -a, C.width + a),
                  r = q(Math.floor(e[4]), -a, C.height + a),
                  i = q(Math.floor(e[5]), -a, C.width + a),
                  a = q(Math.floor(e[6]), -a, C.height + a),
                  l = Vt(e[1]);
                t[0] = q(o - n, 0, C.width), t[1] = q(r - n, 0, C.height), t[2] = q(i + n, 0, C.width), t[3] = q(a + n, 0, C.height), on(o, r, i, a, n, l.r, l.g, l.b);
                break;
            case Qe:
                var l = Vt(e[1]),
                  o = q(Math.floor(e[2]), 0, C.width),
                  r = q(Math.floor(e[3]), 0, C.height),
                  i = o,
                  a = r,
                  s = l.r,
                  c = l.g,
                  d = l.b,
                  u = gt.getImageData(0, 0, C.width, C.height),
                  h = [
                      [i, a]
                  ],
                  p = function(e, t, n) {
                      n = 4 * (n * e.width + t);
                      return 0 <= n && n < e.data.length ? [e.data[n], e.data[1 + n], e.data[2 + n]] : [0, 0, 0]
                  }(u, i, a);
                if (s != p[0] || c != p[1] || d != p[2]) {
                    function m(e) {
                        var t = u.data[e],
                          n = u.data[e + 1],
                          e = u.data[e + 2];
                        return (t != s || n != c || e != d) && (t = Math.abs(t - p[0]), n = Math.abs(n - p[1]), e = Math.abs(e - p[2]), t < 3) && n < 3 && e < 3
                    }
                    for (var g, f, y, v, b, k, S = u.height, w = u.width; h.length;) {
                        for (g = h.pop(), f = g[0], y = g[1], v = 4 * (y * w + f); 0 <= y-- && m(v);) v -= 4 * w;
                        for (v += 4 * w, ++y, k = b = !1; y++ < S - 1 && m(v);) an(u, v, s, c, d), 0 < f && (m(v - 4) ? b || (h.push([f - 1, y]), b = !0) : b = b && !1), f < w - 1 && (m(v + 4) ? k || (h.push([f + 1, y]), k = !0) : k = k && !1), v += 4 * w
                    }
                    gt.putImageData(u, 0, 0)
                }
        }
        return t
    }

    function q(e, t, n) {
        return e < t ? t : n < e ? n : e
    }

    function an(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
    }

    function on(e, t, n, a, o, r, i, l) {
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
          m = (e -= o, t -= u, n -= o, a -= u, gt.getImageData(o, u, h - o, p - u));
        if (e == n && t == a) s(e, t);
        else {
            s(e, t), s(n, a);
            var g = Math.abs(n - e),
              f = Math.abs(a - t),
              y = e < n ? 1 : -1,
              v = t < a ? 1 : -1,
              b = g - f;
            for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a;) {
                var k = b << 1; - f < k && (b -= f, e += y), k < g && (b += g, t += v), s(e, t)
            }
        }
        gt.putImageData(m, o, u)
    }

    function rn() {
        /* TYPOMOD
                 desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        /* TYPOEND */
        gt.fillStyle = "#FFF", gt.fillRect(0, 0, C.width, C.height)
        /* TYPOMOD
                 desc: dispatch clear event */
        ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        /* TYPOEND */
    }

    function ln(e, t, n) {
        ((t = n ? !t : t) ? Ut : Bt)(e)
    }
    E(it, "contextmenu", function(e) {
        return e.preventDefault(), !1
    }), E("#game-toolbar .sizes .size", "click", function(e) {
        var t;
        t = this.size.id, Yt((t = It[t]).element), Pt(t.size), Ft()
    }), E([C], "DOMMouseScroll wheel", function(e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        Pt(Rt + 2 * e)
    }), se("Swap", "S", "Swap the primary and secondary color.", Gt), E(it.querySelector(".color-picker .preview"), "click", function(e) {
        Gt()
    }), E(it.querySelector(".color-picker-mobile .preview"), "click", function(e) {
        it.querySelector(".colors-mobile").classList.toggle("open")
    }), E(ct, "click", function(e) {
        dt.classList.toggle("open")
    }), E(u, "keydown", function(e) {
        if ("Enter" == e.code) return Me.focus(), 0;
        if ("input" == u.activeElement.tagName.toLowerCase() || "textarea" == u.activeElement.tagName.toLowerCase() || -1 != $t) return 0;
        for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < d.length; n++)
            if (d[n].key.toLowerCase() == t) {
                for (var a = 0; a < d[n].cb.length; a++) d[n].cb[a](d[n]);
                return void e.preventDefault()
            }
    }), E(C, "contextmenu", function(e) {
        return e.preventDefault(), !1
    });
    var sn = "Left-/Rightclick to choose a color!",
      cn = null;

    function dn(e, t, n, a) {
        var o = C.getBoundingClientRect(),
          e = Math.floor((e - o.left) / o.width * C.width),
          t = Math.floor((t - o.top) / o.height * C.height);
        a ? (St = n, kt[0] = S[0] = e, kt[1] = S[1] = t) : (kt[0] = S[0], kt[1] = S[1], St = n, S[0] = e, S[1] = t)
    }
    "PointerEvent" in h ? (E("#game-toolbar .colors * .color", "pointerenter", function(e) {
        var t = sn + "\n" + Et[this.colorIndex];
        u.querySelector("#game-toolbar .colors").dataset.tooltip = t, ze()
    }), E("#game-toolbar .colors * .color", "pointerdown", function(e) {
        ln(this.colorIndex, 0 == e.button, e.altKey)
    }), E("#game-toolbar .colors-mobile * .color", "pointerdown", function(e) {
        ln(this.colorIndex, 0 == e.button, e.altKey), it.querySelector(".colors-mobile").classList.remove("open")
    }), E(C, "pointerdown", function(e) {
        if ((0 == e.button || 2 == e.button || 5 == e.button) && -1 == $t) switch (e.pointerType) {
            case "mouse":
                pn(e.button, e.clientX, e.clientY, !0, -1);
                break;
            case "pen":
                pn(e.button, e.clientX, e.clientY, !0, e.pressure);
                break;
            case "touch":
                null == cn && (cn = e.pointerId, pn(e.button, e.clientX, e.clientY, !0, -1))
        }
    }), E(u, "pointermove", function(e) {
        switch (e.pointerType) {
            case "mouse":
                hn(e.clientX, e.clientY, !1, -1);
                break;
            case "pen":
                hn(e.clientX, e.clientY, !1, e.pressure);
                break;
            case "touch":
                cn == e.pointerId && hn(e.clientX, e.clientY, !1, -1)
        }
    }), E(u, "pointerup", function(e) {
        "touch" == e.pointerType ? cn == e.pointerId && (cn = null, mn(e.button)) : mn(e.button)
    })) : (E("#game-toolbar .colors * .color", "mouseenter", function(e) {
        var t = sn + "\n" + Et[this.colorIndex];
        u.querySelector("#game-toolbar .colors").dataset.tooltip = t, ze()
    }), E("#game-toolbar .colors * .color", "click", function(e) {
        ln(this.colorIndex, 0 == e.button, e.altKey)
    }), E("#game-toolbar .colors-mobile * .color", "click", function(e) {
        ln(this.colorIndex, 0 == e.button, e.altKey), it.querySelector(".colors-mobile").classList.remove("open")
    }), E(C, "mousedown", function(e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != $t || pn(e.button, e.clientX, e.clientY, !0, -1)
    }), E(u, "mouseup", function(e) {
        e.preventDefault(), mn(e.button)
    }), E(u, "mousemove", function(e) {
        hn(e.clientX, e.clientY, !1, -1)
    }), E(C, "touchstart", function(e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == cn && (cn = e[0].identitfier, pn(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), E(C, "touchend touchcancel", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == cn) {
                mn($t);
                break
            }
    }), E(C, "touchmove", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == cn) {
                hn(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    }));
    var un = 0;

    function hn(e, t, n, a) {
        dn(e, t, a = p.pressureSensitivity ? a : -1, n), gn(!1)
    }

    function pn(e, t, n, a, o) {
        p.pressureSensitivity || (o = -1), k.length, $t = e, dn(t, n, o, a), gn(!0)
    }

    function mn(e) {
        -1 == e || 0 != e && 2 != e && 5 != e || $t != e || (un != k.length && (un = k.length, bt.push(un)), cn = null, $t = -1)
    }

    function gn(e) {
        if (L.id == Z && M == x && -1 != $t) {
            var t = 0 == $t ? Mt : Lt,
              n = null;
            if (e) {
                var e = function(e, t) {
                    for (var n = (e = gt.getImageData(e, t, 1, 1)).data[0], a = e.data[1], o = e.data[2], r = 0; r < Dt.length; r++) {
                        var i = Dt[r],
                          l = i[0] - n,
                          s = i[1] - a,
                          i = i[2] - o;
                        if (0 == l && 0 == s && 0 == i) return r
                    }
                    /* TYPOMOD
                                         desc: if color is not in array, convert to custom color */
                    return r = parseInt(typo.rgbToHex(n, a, n), 16) + 10000;
                    /* TYPOEND */
                    return r
                }(S[0], S[1]);
                if (xt == nt) {
                    if (e == t) return;
                    l = t, s = S[0], c = S[1], n = [Qe, l, s, c]
                }
                if (xt == tt) return (0 == $t ? Ut : Bt)(e), void Ht(qt)
            }
            xt == et && (l = Rt, 0 <= St && (l = (l - at) * q(St, 0, 1) + at),
              /* TYPOMOD use typo pressure */
              (()=>{if(0 <= St && localStorage.typoink == 'true') {const calcSkribblSize = (val) => Number(val) * 36 + 4;const calcLevelledSize = (val, level) => Math.pow(Number(val), Math.pow(1.5, (Number(level) - 50) / 10)); const sensitivity = 100 - Number(localStorage.sens);let levelled = calcLevelledSize(St, sensitivity); l = Math.round(calcSkribblSize(levelled));}
              })(),s = Math.ceil(.5 * l), c = q(Math.floor(kt[0]), -s, C.width + s), e = q(Math.floor(kt[1]), -s, C.height + s), r = q(Math.floor(S[0]), -s, C.width + s), i = q(Math.floor(S[1]), -s, C.height + s), t = t, a = l, o = c, e = e, r = r, i = i, n = [Je, t, a, o, e, r, i]), null != n && tn(n)
        }
        var a, o, r, i, l, s, c
    }
    setInterval(function() {
        var e, t;
        s && L.id == Z && M == x && 0 < k.length - ft && (e = ft + 8, t = k.slice(ft, e), s.emit("data", {
            id: Oa,
            data: t
        }), ft = Math.min(e, k.length))
    }, 50), setInterval(function() {
        s && L.id == Z && M != x && yt < k.length && (Jt(nn(k[yt]), k[yt]), yt++)
    }, 3);
    var fn = u.querySelector("#game-canvas .overlay"),
      yn = u.querySelector("#game-canvas .overlay-content"),
      A = u.querySelector("#game-canvas .overlay-content .text"),
      vn = u.querySelector("#game-canvas .overlay-content .words"),
      bn = u.querySelector("#game-canvas .overlay-content .reveal"),
      T = u.querySelector("#game-canvas .overlay-content .result"),
      kn = u.querySelector("#game-canvas .overlay-content .room"),
      Sn = -100,
      wn = 0,
      Cn = void 0;

    function qn(e, a, o) {
        var r, i, l = Sn,
          s = wn,
          c = e.top - l,
          d = e.opacity - s;
        Math.abs(c) < .001 && Math.abs(d) < .001 ? o && o() : (r = void 0, i = 0, Cn = h.requestAnimationFrame(function e(t) {
            var n = t - (r = null == r ? t : r),
              t = (r = t, (i = Math.min(i + n, a)) / a),
              n = (n = t) < .5 ? .5 * function(e, t) {
                  return e * e * ((t + 1) * e - t)
              }(2 * n, 1.2 * 1.5) : .5 * (function(e, t) {
                  return e * e * ((t + 1) * e + t)
              }(2 * n - 2, 1.2 * 1.5) + 2);
            Sn = l + c * n, wn = s + t * t * (3 - 2 * t) * d, yn.style.top = Sn + "%", fn.style.opacity = wn, i == a ? o && o() : Cn = h.requestAnimationFrame(e)
        }))
    }

    function xn(e) {
        e.classList.add("show")
    }
    /* TYPOMOD
         desc: add event handlers for typo features */
    E(".avatar-customizer .container", "pointerdown", () => {
        la(typo.createFakeLobbyData());});
    /* TYPOEND */

    function Mn(e) {
        for (var t = 0; t < yn.children.length; t++) yn.children[t].classList.remove("show");
        switch (e.id) {
            case ee:
                xn(kn);
                break;
            case X:
                xn(A), A.textContent = I("Round $", e.data + 1);
                break;
            case _:
                xn(A), A.textContent = I("Waiting for players...");
                break;
            case V:
                xn(A), A.textContent = I("Game starting in a few seconds...");
                break;
            case J:
                xn(bn), bn.querySelector("p span.word").textContent = e.data.word, bn.querySelector(".reason").textContent = function(e) {
                    switch (e) {
                        case B:
                            return I("Everyone guessed the word!");
                        case F:
                            return I("The drawer left the game!");
                        case G:
                            return I("Time is up!");
                        case K:
                            return I("Drawer got skipped!");
                        default:
                            return "Error!"
                    }
                }(e.data.reason);
                for (var n = bn.querySelector(".player-container"), a = ($(n), []), o = 0; o < e.data.scores.length; o += 3) {
                    var r = e.data.scores[o + 0],
                      i = (e.data.scores[o + 1], e.data.scores[o + 2]);
                    (s = W(r)) && a.push({
                        name: s.name,
                        score: i
                    })
                }
                a.sort(function(e, t) {
                    return t.score - e.score
                });
                for (o = 0; o < Math.min(a.length, 12); o++) {
                    var l = R("player"),
                      s = a[o],
                      c = (l.appendChild(R("name", s.name)), R("score", (0 < s.score ? "+" : "") + s.score));
                    s.score <= 0 && c.classList.add("zero"), l.appendChild(c), n.appendChild(l)
                }
                break;
            case Q:
                xn(T);
                for (var d = [T.querySelector(".podest-1"), T.querySelector(".podest-2"), T.querySelector(".podest-3"), T.querySelector(".ranks")], o = 0; o < 4; o++) $(d[o]);
                if (0 < e.data.length) {
                    for (var u = [
                        [],
                        [],
                        [],
                        []
                    ], o = 0; o < e.data.length; o++)(s = {
                        player: W(r = e.data[o][0]),
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
                              l = R("avatar-container"),
                              v = (y.appendChild(l), R("border"));
                            v.appendChild(R("rank-place", "#" + (h + 1))), v.appendChild(R("rank-name", m)), v.appendChild(R("rank-score", I("$ points", g))), y.appendChild(v), 0 == h && l.appendChild(R("trophy"));
                            for (o = 0; o < p.length; o++)(k = ue((s = p[o]).player.avatar, 0, 0 == h)).style.left = 15 * -(p.length - 1) + 30 * o + "%", 0 == h && (k.classList.add("winner"), k.style.animationDelay = -2.35 * o + "s"), l.appendChild(k)
                        }
                    }
                    for (var b = Math.min(5, u[3].length), o = 0; o < b; o++) {
                        var s = u[3][o],
                          f = 48,
                          y = R("rank"),
                          k = ue(s.player.avatar, 0, !1);
                        y.appendChild(k), y.appendChild(R("rank-place", "#" + (s.rank + 1))), y.appendChild(R("rank-name", s.player.name)), y.appendChild(R("rank-score", I("$ points", s.player.score))), d[3].appendChild(y)
                    }
                    0 < u[0].length ? (D = u[0].map(function(e) {
                        return e.player.name
                    }).join(", "), T.querySelector(".winner-name").textContent = (0 < u[0].length ? D : "<user left>") + " ", T.querySelector(".winner-text").textContent = 1 == u[0].length ? I("is the winner!") : I("are the winners!")) : (T.querySelector(".winner-name").textContent = "", T.querySelector(".winner-text").textContent = I("Nobody won!"))
                } else T.querySelector(".winner-name").textContent = "", T.querySelector(".winner-text").textContent = I("Nobody won!");
                break;
            case j:
                if (e.data.words)
                    if (xn(A), xn(vn), $(vn), Pn[ae.WORDMODE] == oe.COMBINATION) {
                        A.textContent = I("Choose the first word");
                        for (var S = e.data.words.length / 2, w = [], C = [], q = 0, o = 0; o < S; o++) {
                            var x = R("word", e.data.words[o]),
                              M = (x.index = o, R("word", e.data.words[o + S]));
                            M.index = o, M.style.display = "none", M.style.animationDelay = .03 * o + "s", w.push(x), C.push(M), E(x, "click", function() {
                                q = this.index;
                                for (var e = 0; e < S; e++) w[e].style.display = "none", C[e].style.display = "";
                                A.textContent = I("Choose the second word")
                            }), E(M, "click", function() {
                                fa([q, this.index])
                            }), vn.appendChild(x), vn.appendChild(M)
                        }
                    } else {
                        A.textContent = I("Choose a word");
                        for (o = 0; o < e.data.words.length; o++) {
                            var L = R("word", e.data.words[o]);
                            L.index = o, E(L, "click", function() {
                                fa(this.index)
                            }), vn.appendChild(L)
                        }
                    }
                else {
                    xn(A);
                    var D = (s = W(e.data.id)) ? s.name : I("User"),
                      D = (A.textContent = "", A.appendChild(de("span", void 0, I("$ is choosing a word!", D))), ue(s ? s.avatar : [0, 0, 0, 0], 0, !1));
                    D.style.width = "2em", D.style.height = "2em", A.appendChild(D)
                }
        }
    }
    const Ln = 0,
      Dn = 1,
      En = 2,
      Rn = 3,
      $n = 4,
      In = 5,
      An = 6;

    function Tn(e, t) {
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

    function Nn() {
        this.context = null, this.gain = null, this.sounds = new Map, h.addEventListener("load", this.load.bind(this), !1)
    }
    Nn.prototype.addSound = function(e, t) {
        this.sounds.set(e, new Tn(this, t))
    }, Nn.prototype.loadSounds = function() {
        this.addSound(Ln, "/audio/roundStart.ogg"), this.addSound(Dn, "/audio/roundEndSuccess.ogg"), this.addSound(En, "/audio/roundEndFailure.ogg"), this.addSound(Rn, "/audio/join.ogg"), this.addSound($n, "/audio/leave.ogg"), this.addSound(In, "/audio/playerGuessed.ogg"), this.addSound(An, "/audio/tick.ogg")
    }, Nn.prototype.playSound = function(e) {
        var t, n;
        null == this.context ? this.load() : "running" != this.context.state ? this.context.resume().then(function() {
            this.playSound(e)
        }) : null != this.context && 0 < p.volume && this.sounds.has(e) && (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.gain), n.start(0))
    }, Nn.prototype.setVolume = function(e) {
        y[g].querySelector("#volume .title .icon").classList.toggle("muted", e <= 0), y[g].querySelector("#volume .volume-value").textContent = e <= 0 ? "Muted" : e + "%", this.gain && (this.gain.gain.value = e / 100)
    }, Nn.prototype.load = function() {
        if (null == this.context) try {
            h.AudioContext = h.AudioContext || h.webkitAudioContext, this.context = new AudioContext, this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.setVolume(p.volume), console.log("AudioContext created."), this.loadSounds()
        } catch (e) {
            console.log("Error creating AudioContext.", e), this.context = null
        }
    };
    const On = 4;
    _;
    var s, w = [],
      x = 0,
      Wn = -1,
      M = -1,
      Pn = [],
      L = {
          id: -1,
          time: 0,
          data: 0
      },
      Yn = -1,
      zn = 0,
      Hn = void 0,
      D = new Nn,
      N = void 0,
      Un = !1,
      Bn = !1,
      Gn = u.querySelector("#game-wrapper"),
      ct = u.querySelector("#game-canvas .room"),
      Fn = u.querySelector("#game-players"),
      Kn = u.querySelector("#game-chat"),
      _n = (u.querySelector("#game-board"), u.querySelector("#game-bar")),
      Vn = Fn.querySelector(".players-list"),
      Xn = Fn.querySelector(".players-footer"),
      jn = u.querySelector("#game-round"),
      O = [u.querySelector("#game-word .description"), u.querySelector("#game-word .word"), u.querySelector("#game-word .hints .container")],
      Zn = u.querySelector("#home .container-name-lang input"),
      Jn = u.querySelector("#home .container-name-lang select"),
      Qn = u.querySelector("#home .panel .button-play"),
      ea = u.querySelector("#home .panel .button-create");
    const ta = 11 == (t = new Date).getMonth() && 19 <= (t = t.getDate()) && t <= 26;

    function na(e) {
        Un = e, u.querySelector("#load").style.display = e ? "block" : "none"
    }

    function aa(e, t, n, a) {
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
                    a && i(ye, I("Servers are currently undergoing maintenance!") + "\n\rStatus: " + e + "\n\rPlease try again later!");
                    break;
                default:
                    a && i(ye, I("An unknown error occurred ('$')", e) + "\n\r" + I("Please try again later!"))
            }
            n({
                success: !1,
                error: e
            })
        }, (r = new XMLHttpRequest).onreadystatechange = function() {
            4 == this.readyState && o(this.status, this.response)
        }, r.open("POST", e, !0), r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), r.send(t)
    }
    ta;
    var oa = null;
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
                    oa()
                },
                AIP_REMOVE: function() {}
            })
        })
    } catch (e) {
        console.log("ad push failed: "), console.log(e)
    }

    function ra(t) {
        var e, n, a = !1;
        if (h.localStorageAvailable && (n = c.getItem("lastAd"), e = new Date, c.setItem("lastAd", e.toString()), null == n ? n = e : (n = new Date(Date.parse(n)), a = 1 <= Math.abs(n - e) / 1e3 / 60)), a) try {
            aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (oa = t, aiptag.cmd.player.push(function() {
                adplayer.startPreRoll()
            })) : t()
        } catch (e) {
            console.log(e), t()
        } else t()
    }

    function ia(e, t, n) {
        D.context && D.context.resume && D.context.resume(), s && ga();
        var a, o = 0,
          r = {
              transports: ["websocket", "polling"],
              closeOnBeforeunload: !1
          };
        "URL" in h && "127.0.0.1" != (a = new URL(e)).hostname && "localhost" != a.hostname && (r.path = "/" + a.port + "/", e = a.protocol + "//" + a.hostname), (s = P(e, r)).on("connect", function() {
            /* TYPOMOD
                         desc: disconnect socket & leave lobby */
            document.addEventListener('socketEmit', event => s.emit('data', {id: event.detail.id, data: event.detail.data}));
            typo.disconnect = () => {
                if (s) {
                    s.typoDisconnect = true;
                    s.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    s.off("data");
                    s.reconnect = false;
                    s.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            /* TYPOEND */
            na(!1), s.on("joinerr", function(e) {
                ga(), i(ye, function(e) {
                    switch (e) {
                        case 1:
                            return I("Room not found!");
                        case 2:
                            return I("Room is full!");
                        case 3:
                            return I("You are on a kick cooldown!");
                        case 4:
                            return I("You are banned from this room!");
                        case 5:
                            return I("You are joining rooms too quickly!");
                        case 100:
                            return I("You are already connected to this room!");
                        case 200:
                            return I("Too many users from your IP are connected to this room!");
                        case 300:
                            return I("You have been kicked too many times!");
                        default:
                            return I("An unknown error ('$') occured!", e)
                    }
                }(e))
            }), s.on("data", Ua);
            var e = Zn.value.split("#"),
              e = {
                  join: t,
                  create: n ? 1 : 0,
                  name: e[0],
                  lang: Jn.value,
                  code: e[1],
                  avatar: p.avatar
              };
            s.emit("login", e)
        }), s.on("reason", function(e) {
            o = e
        }), s.on("disconnect", function(e) {
            /* TYPOMOD
                             DESC: no msg if disconnect intentionally */
            if(!s.typoDisconnect)
              /*TYPOEND*/
                switch (console.log("socket disconnect: " + e), o) {
                    case te:
                        i(ve, I("You have been kicked!"));
                        break;
                    case ne:
                        i(ve, I("You have been banned!"));
                        break;
                    default:
                        i(ve, I("Connection lost!") + "\n" + e)
                }
            ga()
        }), s.on("connect_error", function(e) {
            ga(), na(!1), i(ye, e.message)
        })
    }

    function la(e) {
        var t;
        D.playSound(Rn), Ht(et, !0), Pt(12), Ut(1), Bt(0), Qt(!0), $(Le), u.querySelector("#home").style.display = "none", u.querySelector("#game").style.display = "flex", x = e.me, Yn = e.type, Hn = e.id, u.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, Pn = t, sa(), $(Vn), w = [];
        for (var n = 0; n < e.users.length; n++) Ba(e.users[n], !1);
        if (Va(), Xa(), da(e.round), ka(e.owner), ha(e.state, !0), !Bn) {
            try {
                (adsbygoogle = h.adsbygoogle || []).push({}), (adsbygoogle = h.adsbygoogle || []).push({})
            } catch (e) {
                console.log("google ad request failed"), console.log(e)
            }
            Bn = !0
        }
    }

    function sa() {
        da(zn);
        for (var e, t = 0; t < Ja.length; t++) {
            var n = Ja[t];
            n.index && (e = Pn[(n = n).index], "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
        }
    }

    function ca(e, t, n) {
        Pn[e] = t, n && s && s.emit("data", {
            id: Ea,
            data: {
                id: e,
                val: t
            }
        }), sa()
    }

    function da(e) {
        var e = (zn = e) + 1,
          t = Pn[ae.ROUNDS];
        jn.textContent = I("Round $ of $", [e, t]), _n.querySelector(".mobile .round span").textContent = e + "/" + t
    }

    function ua() {
        for (var e = 0; e < w.length; e++) w[e].score = 0;
        for (e = 0; e < w.length; e++) ja(w[e], !1), Za(w[e], !1);
        Xa()
    }

    function ha(e, t) {
        var n, a;
        if (n = L = e, null != Cn && (h.cancelAnimationFrame(Cn), Cn = void 0), n.id == Z ? qn({
            top: -100,
            opacity: 0
        }, 600, function() {
            fn.classList.remove("show")
        }) : fn.classList.contains("show") ? qn({
            top: -100,
            opacity: 1
        }, 600, function() {
            Mn(n), qn({
                top: 0,
                opacity: 1
            }, 600)
        }) : (fn.classList.add("show"), Mn(n), qn({
            top: 0,
            opacity: 1
        }, 600)), a = e.time, lo(), so(a), ro = setInterval(function() {
            so(Math.max(0, io - 1));
            var e = -1;
            L.id == Z && (e = no), L.id == j && (e = ao), oo.style.animationName = io < e ? io % 2 == 0 ? "rot_left" : "rot_right" : "none", io < e && D.playSound(An), io <= 0 && lo()
        }, 1e3), Gn.classList.add("toolbar-hidden"), Ct(), ma(!1), e.id == ee ? (ua(), Gn.classList.add("room")) : Gn.classList.remove("room"), e.id == X && (da(e.data), 0 == e.data) && ua(), e.id == J) {
            x != M && ba(e.data.word);
            for (var o = 0; o < e.data.scores.length; o += 3) {
                var r = e.data.scores[o + 0],
                  i = e.data.scores[o + 1];
                e.data.scores[o + 2];
                (c = W(r)) && (c.score = i)
            }
            Xa();
            for (var l = !0, o = 0; o < w.length; o++)
                if (w[o].guessed) {
                    l = !1;
                    break
                } l ? D.playSound(En) : D.playSound(Dn), b(I("The word was '$'", e.data.word), "", v($e), !0)
            /* TYPOMOD
                         desc: log finished drawing */
            ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
            /* TYPOEND */
        } else e.id != Z && (O[0].textContent = I("WAITING"), O[0].classList.add("waiting"), O[1].style.display = "none", O[2].style.display = "none");
        if (e.id == Z) {
            if (M = e.data.id, D.playSound(Ln), Qt(!0), e.data.drawCommands && (k = e.data.drawCommands), b(I("$ is drawing now!", W(M).name), "", v(Re), !0), M != x && Kn.querySelector("input").focus(), !t)
                for (o = 0; o < w.length; o++) ja(w[o], !1);
            O[0].classList.remove("waiting"), M == x ? (a = e.data.word, O[0].textContent = I("DRAW THIS"), O[1].style.display = "", O[2].style.display = "none", O[1].textContent = a, Gn.classList.remove("toolbar-hidden"), Ct()) : (ma(!0), ya(e.data.word, !1), va(e.data.hints))
        } else {
            M = -1;
            for (o = 0; o < w.length; o++) ja(w[o], !1)
        }
        if (e.id == Q && 0 < e.data.length) {
            for (var s = [], i = 0, o = 0; o < e.data.length; o++) {
                var c, d = e.data[o][0],
                  u = e.data[o][1];
                (c = W(d)) && 0 == u && (i = c.score, s.push(c.name))
            }
            1 == s.length ? b(I("$ won with a score of $!", [s[0], i]), "", v(Ae), !0) : 1 < s.length && b(I("$ and $ won with a score of $!", [s.slice(0, -1).join(", "), s[s.length - 1], i]), "", v(Ae), !0)
        }
        for (o = 0; o < w.length; o++) Za(w[o], w[o].id == M);
        Va()
    }

    function pa(e) {
        s && s.connected && L.id == Z && (s.emit("data", {
            id: qa,
            data: e
        }), ma(!1))
    }

    function ma(e) {
        u.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function ga() {
        console.log("lobby left"), s && s.close(), Qt(!(s = void 0)), lo(), w = [], Pn = [], L = {
            id: M = Wn = -1,
            time: x = 0,
            data: 0
        }, u.querySelector("#home").style.display = "", u.querySelector("#game").style.display = "none"
    }

    function fa(e) {
        s && s.connected && L.id == j && s.emit("data", {
            id: Na,
            data: e
        })
    }

    function ya(e, t) {
        for (var n = e.length - 1, a = 0; a < e.length; a++) n += e[a];
        var o = !t && 1 == Pn[ae.WORDMODE];
        o && (n = 3), O[0].textContent = I(o ? "WORD HIDDEN" : "GUESS THIS"), O[1].style.display = "none", O[2].style.display = "", $(O[2]), O[2].hints = [];
        for (a = 0; a < n; a++) O[2].hints[a] = R("hint", o ? "?" : "_"), O[2].appendChild(O[2].hints[a]);
        o || O[2].appendChild(R("word-length", e.join(" ")))
    }

    function va(e) {
        for (var t = O[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
              o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function ba(e) {
        (!O[2].hints || O[2].hints.length < e.length) && ya([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        va(t)
    }

    function ka(e) {
        Wn = e;
        for (var t = 0; t < w.length; t++) pe(w[t].element, w[t].id == Wn), Ka(w[t], 0, w[t].id == Wn);
        var n = x != Wn;
        u.querySelector("#start-game").disabled = n;
        for (var a = 0; a < Ja.length; a++) Ja[a].element.disabled = n;
        e = W(Wn);
        e && b(I("$ is now the room owner!", e.name), "", v(Ae), !0)
    }
    const Sa = 1,
      wa = 2,
      Ca = 5,
      qa = 8,
      xa = 9,
      Ma = 90,
      La = 10,
      Da = 11,
      Ea = 12,
      Ra = 13,
      $a = 14,
      Ia = 15,
      Aa = 16,
      Ta = 17,
      Na = 18,
      Oa = 19,
      Wa = 20,
      Pa = 21;
    const Ya = 30,
      za = 31,
      Ha = 32;

    function Ua(e) {
        var t = e.id,
          n = e.data;
        switch (t) {
            case La:
                /* TYPOMOD
                                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: n }));
                /* TYPOEND*/
                la(n);
                break;
            case Da:
                ha(n);
                break;
            case Ea:
                ca(n.id, n.val, !1);
                break;
            case Ra:
                va(n);
                break;
            case $a:
                so(n);
                break;
            case Sa:
                var a = Ba(n, !0);
                Xa(), a.joinTimeout = setTimeout(() => {
                    b(I("$ joined the room!", a.name), "", v($e), !0), D.playSound(Rn), a.joinTimeout = void 0
                }, 0 == Yn ? 1e3 : 0);
                break;
            case xa:
                (a = W(n.id)) && (a.avatar = n.avatar, he(a.element.avatar, a.avatar));
                break;
            case Ma:
                (a = W(n.id)) && (a.name = n.name, a.element.querySelector(".player-name").textContent = n.name);
                break;
            case wa:
                (a = function(e) {
                    for (var t = 0; t < w.length; t++) {
                        var n = w[t];
                        if (n.id == e) return w.splice(t, 1), n.element.remove(), Xa(), Va(), n
                    }
                    return
                }(n.id)) && (null == a.joinTimeout ? (b(function(e, t) {
                    switch (e) {
                        default:
                            return I("$ left the room!", t);
                        case te:
                            return I("$ has been kicked!", t);
                        case ne:
                            return I("$ has been banned!", t)
                    }
                }(n.reason, a.name), "", v(Ie), !0), D.playSound($n)) : (clearTimeout(a.joinTimeout), a.joinTimeout = void 0), n.id != M || n.reason != te && n.reason != ne || Qt(!0));
                break;
            case Ca:
                var o = W(n[0]),
                  r = W(n[1]),
                  i = n[2],
                  l = n[3];
                o && r && b(I("$ is voting to kick $ ($/$)", [o.name, r.name, i, l]), "", v(Ee), !0);
                break;
            case Ia:
                (a = W(n.id)) && (b(I("$ guessed the word!", a.name), "", v($e), !0).classList.add("guessed"), ja(a, !0), D.playSound(In), n.id == x) && ba(n.word);
                break;
            case qa:
                (a = W(n.id)) && (o = a, r = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (i = R("icon")).style.backgroundImage = "url(/img/" + r + ")", r = Fa(o, i).getBoundingClientRect(), o = .9 * (r.bottom - r.top), i.style.width = o + "px", i.style.height = o + "px", n.vote ? b(I("$ liked the drawing!", a.name), "", v($e), !0) : b(I("$ disliked the drawing!", a.name), "", v(Ie), !0));
                break;
            case Ta:
                ka(n);
                break;
            case Aa:
                b(I("$ is close!", n), "", v(Ee), !0);
                break;
            case Ya:
                Ga(W(n.id), n.msg);
                break;
            case Ha:
                b(I("Spam detected! You're sending messages too quickly."), "", v(Ie), !0);
                break;
            case za:
                switch (n.id) {
                    case 0:
                        b(I("You need at least 2 players to start the game!"), "", v(Ie), !0);
                        break;
                    case 100:
                        b(I("Server restarting in about $ seconds!", n.data), "", v(Ie), !0)
                }
                break;
            case Oa:
                for (var s = 0; s < n.length; s++) tn(n[s]);
                break;
            case Wa:
                Qt(!0);
                break;
            case Pa:
                Xt(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function W(e) {
        for (var t = 0; t < w.length; t++) {
            var n = w[t];
            if (n.id == e) return n
        }
    }

    function Ba(e, t) {
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
          },
          e = (w.push(n), (n.flags & On) == On),
          a = (e && (n.element.classList.add("admin"), n.interval = setInterval(function() {
              n.avatar[0] = (n.avatar[0] + 1) % U[0], he(r, n.avatar)
          }, 250)), n.id == x ? I("$ (You)", n.name) : n.name),
          o = R("player-avatar-container"),
          r = ue(n.avatar),
          o = (n.element.drawing = R("drawing"), (n.element.avatar = r).appendChild(n.element.drawing), o.appendChild(r), n.element.appendChild(o), Vn.appendChild(n.element), R("player-info")),
          a = R("player-name", a),
          a = (n.id == x && a.classList.add("me"), o.appendChild(a), o.appendChild(R("player-rank", "#" + n.rank)), o.appendChild(R("player-score", I("$ points", n.score))), e && o.appendChild(R("player-tag", "THE CREATOR")), n.element.appendChild(o), E(n.element, "click", function() {
              N = n, i(m, n)
          }), R("player-icons")),
          e = R("icon owner"),
          o = R("icon muted");
        /* TYPOMOD
                 desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id);
        /* TYPOEND */
        return a.appendChild(e), a.appendChild(o), n.element.appendChild(a), n.element.icons = [e, o], ja(n, n.guessed), t && Va(), n
    }

    function Ga(e, t) {
        var n, a, o;
        !e.muted && (o = ((a = W(x)).flags & On) == On, n = e.id == M || e.guessed, x == M || a.guessed || !n || o) && (a = (e.flags & On) == On, o = De, n && (o = Te), a && (o = Ie), Fa(e, R("text", t)), b(e.name, t, v(o))
          .setAttribute("playerid", e.id))
    }

    function Fa(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = R("player-bubble"),
          a = R("content");
        return a.appendChild(t), n.appendChild(R("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function() {
            e.bubble.remove(), e.bubble = void 0
        }, 1500), n
    }

    function Ka(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var _a = void 0;

    function Va() {
        L.id, ee;
        for (var e = getComputedStyle(u.documentElement).getPropertyValue("--PLAYERS_PER_PAGE"), t = (e <= 0 && (t = Math.max(48, Vn.clientHeight), e = Math.floor(t / 48)), Math.ceil(w.length / e)), n = 0; n < w.length; n++) w[n].page = Math.floor(n / e);
        null == _a ? _a = me(Xn, t, [Fn], function(e, t, n) {
            for (var a = [], o = 0; o < w.length; o++) {
                var r = (i = w[o]).page == t;
                i.element.style.display = r ? "" : "none", r && a.push(i.element)
            }
            if (0 < a.length) {
                for (var i, o = 0; o < a.length; o++)(i = a[o]).classList.remove("first"), i.classList.remove("last"), o % 2 == 0 ? i.classList.remove("odd") : i.classList.add("odd");
                a[0].classList.add("first"), a[a.length - 1].classList.add("last")
            }
        }) : ge(_a, t), _a.element.style.display = 1 < t ? "" : "none"
    }

    function Xa() {
        for (var e = [], t = 0; t < w.length; t++) e.push(w[t]);
        e.sort(function(e, t) {
            return t.score - e.score
        });
        for (var n, a, o = 1, t = 0; t < e.length; t++) {
            var r = e[t];
            a = o, (n = r).rank = a, n.element.querySelector(".player-score").textContent = I("$ points", n.score), (n = n.element.querySelector(".player-rank")).textContent = "#" + a, n.classList.remove("first"), n.classList.remove("second"), n.classList.remove("third"), 1 == a && n.classList.add("first"), 2 == a && n.classList.add("second"), 3 == a && n.classList.add("third"), t < e.length - 1 && r.score > e[t + 1].score && o++
        }
    }

    function ja(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed"): e.element.classList.remove("guessed")
    }

    function Za(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ja = [];
    for (var Qa = ct.querySelectorAll('*[id^="item-"]'), eo = 0; eo < Qa.length; eo++) {
        var to = {
            id: Qa[eo].id.replace("item-settings-", ""),
            element: Qa[eo],
            index: Qa[eo].dataset.setting
        };
        Qa[eo].item = to, Ja.push(to), E(Qa[eo].item.element, "change", function() {
            var e = this.value;
            "checkbox" == this.type && (e = this.checked ? 1 : 0), null != this.item.index && ca(this.item.index, e, !0)
        })
    }
    const no = 10,
      ao = 4;
    var oo = u.querySelector("#game-clock"),
      ro = null,
      io = 0;

    function lo() {
        ro && (clearInterval(ro), ro = null)
    }

    function so(e) {
        io = e, oo.textContent = io, _n.querySelector(".mobile .drawtime span").textContent = io + "s"
    }
    var co, t = u.querySelector("#tutorial"),
      uo = t.querySelectorAll(".page"),
      ho = me(t.querySelector(".navigation"), uo.length, [t.querySelector(".pages")], function(e, t, n) {
          n && clearInterval(po);
          for (var a = 0; a < uo.length; a++) uo[a].classList.remove("active");
          uo[t].classList.add("active")
      }),
      po = setInterval(function() {
          ho.selected < 4 ? fe(ho, ho.selected + 1, !1) : fe(ho, 0, !1)
      }, 3500),
      ct = u.querySelector("#game-settings");
    u.querySelector("#audio"), u.querySelector("#lightbulb");

    function mo() {
        var e = .01 * h.innerHeight;
        u.documentElement.style.setProperty("--vh", e + "px")
    }

    function go() {
        b(I("Copied room link to clipboard!"), "", v(Ee), !0);
        var e = "https://skribbl.io/?" + Hn;
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

    function fo(e) {
        var t = xe.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }

    function yo(e) {
        s && s.connected ? s.emit("data", {
            id: Ya,
            data: e
        }) : Ga(W(x), e)
    }
    E(ct, "click", function() {
        i(g)
    }), E(h, "resize", function() {
        mo(), Va()
    }), h.onunload = function() {
        console.log("huh"), s && ga()
    }, E(u, "PointerEvent" in h ? "pointerdown" : "click", function(e) {
        Ge.elements.main.contains(e.target) || Ge.isOpen && (delete u.documentElement.dataset.mobileKeyboardOpen, Va(), Ge.isOpen = !1), u.querySelector("#game-toolbar .sizes").contains(e.target) || Ft()
    }), E([Zn, Jn], "change", a), E(Qn, "click",
      typo.joinLobby = function() {
          var t, e, n, a, o;
          n = h.location.href,
            typo.lastConnect = Date.now(), o = "", n = n.split("?"), t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o, Un || (e = "" != t ? "id=" + t : "lang=" + Jn.value, qe(), na(!0), ra(function() {
              aa(location.origin + "/api/play", e, function(e) {
                  na(!1), e.success && ia(e.data, t)
              }, !0)
          }))
      }), E(ea, "click", function() {
        Un || (qe(), na(!0), ra(function() {
            aa(location.origin + "/api/play", "lang=" + Jn.value, function(e) {
                e.success ? ia(e.data, 0, 1) : na(!1)
            }, !0)
        }))
    }), E(u.querySelector("#game-rate .like"), "click", function() {
        pa(1)
    }), E(u.querySelector("#game-rate .dislike"), "click", function() {
        pa(0)
    }), E(u.querySelector("#start-game"), "click", function() {
        if (s) {
            var e = u.querySelector("#item-settings-customwords").value.split(","),
              t = "";
            if (5 <= e.length) {
                for (var n = 0; n < e.length; n++) e[n] = e[n].trim();
                t = e.join(",")
            }
            s.emit("data", {
                id: 22,
                data: t
            })
        }
    }), E([u.querySelector("#copy-invite"), u.querySelector("#modal-player-button-invite")], "click", go), E(y[m].querySelector("button.kick"), "click", function() {
        qe(), null != N && N.id != x && s && s.emit("data", {
            id: 3,
            data: N.id
        })
    }), E(y[m].querySelector("button.ban"), "click", function() {
        qe(), null != N && N.id != x && s && s.emit("data", {
            id: 4,
            data: N.id
        })
    }), E(y[m].querySelector("button.votekick"), "click", function() {
        qe(), null != N && N.id != x && s && (N.id == Wn ? b(I("You can not votekick the lobby owner!"), "", v(Ie), !0) : s.emit("data", {
            id: Ca,
            data: N.id
        }))
    }), E(y[m].querySelector("button.mute"), "click", function() {
        null != N && N.id != x && (N.muted = !N.muted, Ka(N, 1, N.muted), N.muted ? b(I("You muted '$'!", N.name), "", v(Ie), !0) : b(I("You unmuted '$'!", N.name), "", v(Ie), !0), s && s.emit("data", {
            id: 7,
            data: N.id
        }), Ce(N.muted))
    }), E(y[m].querySelector("button.report"), "click", function() {
        y[m].querySelector(".buttons").style.display = "none", y[m].querySelector(".player").style.display = "none", y[m].querySelector(".report-menu").style.display = "";
        for (var e = y[m].querySelectorAll(".report-menu input"), t = 0; t < e.length; t++) e[t].checked = !1
    }), E(y[m].querySelector("button#report-send"), "click", function() {
        var e = 0;
        y[m].querySelector("#report-reason-toxic").checked && (e |= 1), y[m].querySelector("#report-reason-spam").checked && (e |= 2), y[m].querySelector("#report-reason-bot").checked && (e |= 4), 0 < e && (null != N && N.id != x && (N.reported = !0, s && s.emit("data", {
            id: 6,
            data: {
                id: N.id,
                reasons: e
            }
        }), b(I("Your report for '$' has been sent!", N.name), "", v(Ee), !0)), qe())
    }), E(y[g].querySelector("#volume input"), "change", function(e) {
        p.volume = e.target.value, D.setVolume(p.volume), D.playSound(In), a()
    }), E(y[g].querySelector("#select-pressure-sensitivity"), "change", function(e) {
        p.pressureSensitivity = e.target.value, a()
    }), E(y[g].querySelector("button.reset"), "click", function() {
        for (var e = 0; e < d.length; e++) {
            var t = d[e];
            t.key = t.def, t.listing.querySelector("input").value = t.key;
            for (var n = 0; n < t.changed.length; n++) t.changed[n](t)
        }
        ce()
    }), E(u.querySelector("#game-keyboard button.settings"), "click", function(e) {
        i(g)
    }), E(Me, "focusin focus", function(e) {
        e.preventDefault()
    }), E(Me, "input", function(e) {
        fo(Me.value.length)
    }), E(xe, "submit", function(e) {
        const input = Me; let rest = input.value.substring(100);
        input.value = input.value.substring(0,100);
        if(rest.length > 0) setTimeout(()=>{input.value = rest; e.target.dispatchEvent(new Event("submit"));},180);
        return e.preventDefault(), Me.value && yo(Me.value), xe.reset(), fo(0), !1
    }), mo(), h.localStorageAvailable ? (Zn.value = n("name", ""), Jn.value = function(e) {
        for (var t = u.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
            if (t[n].value == e) return t[n].value;
        return 0
    }(n("lang", 0)), p.displayLang = n("displaylang", "en"), p.volume = parseInt(n("volume", 100)), p.filterChat = 1 == parseInt(n("filter", 1)) ? 1 : 0, p.pressureSensitivity = 1 == parseInt(n("pressure", 1)) ? 1 : 0, p.avatar = (t = "ava", ct = p.avatar, null == (t = c.getItem(t)) ? ct : JSON.parse(t)), Ue.value = n("keyboard", 1), Be.value = n("keyboardlayout", "en"), Ke(), y[g].querySelector("#volume input").value = p.volume, D.setVolume(p.volume), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
    for (var vo = u.querySelectorAll("[data-translate]"), bo = 0; bo < vo.length; bo++) {
        var ko = vo[bo];
        Ze(ko, ko.dataset.translate)
    }
    for (var So = Ve[p.displayLang], wo = 0; wo < Xe.length; wo++) {
        var Co = Xe[wo],
          qo = je(So, Co.key);
        "text" == Co.type && (Co.element.textContent = qo), "placeholder" == Co.type && (Co.element.placeholder = qo)
    }

    function xo(e) {
        co.parts[e].classList.remove("bounce"), co.parts[e].offsetWidth, co.parts[e].classList.add("bounce")
    }
    E(Qn = u.querySelectorAll("[data-tooltip]"), "pointerenter", function(e) {
        Pe(e.target)
    }), E(Qn, "pointerleave", function(e) {
        Ye()
    }), ct = (ea = u.querySelector("#home .avatar-customizer")).querySelector(".container"), t = ea.querySelectorAll(".arrows.left .arrow"), Qn = ea.querySelectorAll(".arrows.right .arrow"), ea = ea.querySelectorAll(".randomize"), (co = ue(p.avatar)).classList.add("fit"), ct.appendChild(co), E(t, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        --p.avatar[e], p.avatar[e] < 0 && (p.avatar[e] = U[e] - 1), xo(e), he(co, p.avatar), a()
    }), E(Qn, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        p.avatar[e] += 1, p.avatar[e] >= U[e] && (p.avatar[e] = 0), xo(e), he(co, p.avatar), a()
    }), E(ea, "click", function() {
        p.avatar[0] = Math.floor(Math.random() * U[0]), p.avatar[1] = Math.floor(Math.random() * U[1]), p.avatar[2] = Math.floor(Math.random() * U[2]), xo(1), xo(2), he(co, p.avatar), a()
    });
    for (var Mo = Math.round(8 * Math.random()), Lo = u.querySelector("#home .logo-big .avatar-container"), Do = 0; Do < 8; Do++) {
        var Eo = [0, 0, 0, -1],
          Eo = (Eo[0] = Do, Eo[1] = Math.round(100 * Math.random()) % z, Eo[2] = Math.round(100 * Math.random()) % H, 100 * Math.random() < 1 && (Eo[3] = Math.floor(20 * Math.random())), ta && 100 * Math.random() < 35 && (Eo[3] = 96 + Math.floor(4 * Math.random())), ue(Eo, 0, Mo == Do));
        Eo.index = Do, Lo.appendChild(Eo), E(Eo, "click", function() {
            var e = [this.index, 0, 0, -1];
            e[1] = Math.round(100 * Math.random()) % z, e[2] = Math.round(100 * Math.random()) % H, 1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())), he(this, e), this.classList.remove("clicked"), this.offsetWidth, this.classList.add("clicked")
        })
    }
}(window, document, localStorage, io);