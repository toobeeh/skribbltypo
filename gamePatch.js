! function(h, u, c, P) {
    const Y = 26,
      z = 57,
      H = 51,
      n = [Y, z, H],
      U = 0,
      B = 1,
      G = 2,
      F = 5,
      K = 0,
      _ = 1,
      V = 2,
      X = 3,
      j = 4,
      Z = 5,
      J = 6,
      Q = 7;
    const ee = 1,
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
          joinLobby: undefined,        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
              // IDENTIFY x.value.split: #home .container-name-lang input -> Jn
              // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> p
              return { id: id, name: name.length != 0 ? name : (Jn.value.split("#")[0] != "" ? Jn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? p.avatar : avatar, score: score, guessed: guessed };
          },
          createFakeLobbyData: (
            settings = ["PRACTISE", "en", 1, 1, 80, 3, 3, 2, 0, false],
            id = "FAKE",
            me = 0,
            owner = 0,
            users = [],
            state = { id: 4, time: 0, data: { id: 0, word: "Anything" } }) => {
              if (users.length == 0) users = [typo.createFakeUser()];
              return { settings: settings, id: id, me: me, owner: owner, round: 0, users: users, state: state };
          },
          disconnect: undefined,
          lastConnect: 0,
          initListeners: (() => {
              let abort=false; document.addEventListener("abortJoin", () => abort = true); document.addEventListener("joinLobby", (e) => {
                  abort=false;let timeoutdiff = Date.now() - (typo.lastConnect == 0 ? Date.now() : typo.lastConnect);
                  //Xn(true);
                  setTimeout(() => {
                      if(abort) return; typo.lastConnect = Date.now();
                      //ea.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                      //##PRIVATELBBY## = !1 // IDENTIFY: x:  = !1
                      if(e.detail) window.history.pushState({path:window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);////##JOINLOBBY##(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                      typo.joinLobby(); window.history.pushState({path:window.location.origin}, '', window.location.origin);//aa(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                      document.dispatchEvent(new Event("joinedLobby"));
                  }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
              });
              document.addEventListener("leaveLobby", () => {
                  if (typo.disconnect) typo.disconnect();
                  else fa() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
              });
              document.addEventListener("setColor", (e) => {
                  let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                  let match = $t.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
                  let code = match >= 0 ? match : e.detail.code;
                  if (e.detail.secondary) Ft(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                  else Gt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
              });
              document.addEventListener("performDrawCommand", (e) => {
                  k.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                  en(on(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
              });
              document.addEventListener("addTypoTooltips", () => {
                  [...document.querySelectorAll("[data-typo-tooltip]")].forEach(elem => {
                      elem.setAttribute("data-tooltip", elem.getAttribute("data-typo-tooltip"));
                      elem.removeAttribute("data-typo-tooltip");
                      elem.addEventListener("mouseenter", (e) => ze(e.target)); // IDENTIFY: x(e.target):
                      elem.addEventListener("mouseleave", (e) => He()); // IDENTIFY: (e) => x():

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
            listing: $("item"),
            changed: [],
            cb: []
        }, d.push(s), Qe(r = $("key", s.name), "text"), s.listing.appendChild(r), (i = u.createElement("input")).value = s.key, s.listing.appendChild(i), E(i, "keydown", function(e) {
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
        avatar: [Math.round(100 * Math.random()) % Y, Math.round(100 * Math.random()) % z, Math.round(100 * Math.random()) % H, -1],
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
        h.localStorageAvailable ? (c.setItem("name", Jn.value), c.setItem("lang", Qn.value), c.setItem("displaylang", p.displayLang), c.setItem("volume", p.volume), c.setItem("dark", 1 == p.dark ? 1 : 0), c.setItem("filter", 1 == p.filterChat ? 1 : 0), c.setItem("pressure", 1 == p.pressureSensitivity ? 1 : 0), c.setItem("ava", JSON.stringify(p.avatar)), c.setItem("keyboard", Ge.value), c.setItem("keyboardlayout", Fe.value), console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
    }

    function E(e, t, n) {
        for (var a, o = e, r = ("string" == typeof e ? o = u.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]), t.split(" ")), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++) o[i].addEventListener(r[l], n)
    }

    function $(e, t) {
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

    function R(e) {
        for (; e.firstChild;) e.removeChild(e.firstChild)
    }

    function ue(e, t, n) {
        var a = $("avatar"),
          o = $("color"),
          r = $("eyes"),
          i = $("mouth"),
          l = $("special"),
          s = $("owner");
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

    function me(e, t) {
        e.className = "avatar";
        for (var n of t) e.classList.add("filter-" + n)
    }

    function ge(e, t, n, a) {
        var o = {
            element: $("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element), n.push(o.element), E(n, "DOMMouseScroll wheel", function(e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), ye(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), fe(o, t), o
    }

    function fe(e, t) {
        R(e.element), e.dots = [];
        for (var n = 0; n < t; n++) {
            var a = $("dot");
            a.index = n, a.appendChild($("inner")), E(a, "click", function() {
                ye(e, this.index, !0)
            }), e.element.appendChild(a), e.dots.push(a)
        }
        e.selected < 0 && (e.selected = 0), e.selected >= t && (e.selected = t - 1), ye(e, e.selected, !1)
    }

    function ye(e, t, n) {
        if (0 <= t && t < e.dots.length) {
            e.selected = t;
            for (var a = 0; a < e.dots.length; a++) e.dots[a].classList.remove("active");
            e.dots[t].classList.add("active"), e.change(e, t, n)
        }
    }
    const m = 0,
      ve = 1,
      be = 2,
      ke = 3,
      g = 4,
      Se = 5;
    var f = u.querySelector("#modal"),
      we = f.querySelector(".modal-title .text"),
      Ce = f.querySelector(".modal-content"),
      y = [];

    function qe(e) {
        y[m].querySelector(".buttons button.mute").textContent = I(e ? "Unmute" : "Mute")
    }

    function xe(e, t) {
        f.style.display = "block";
        for (var n = 0; n < y.length; n++) y[n].style.display = "none";
        y[e].style.display = "flex";
        var a = y[e];
        switch (e) {
            case ve:
                we.textContent = I("Something went wrong!"), a.querySelector(".message").textContent = t;
                break;
            case be:
                we.textContent = I("Disconnected!"), a.querySelector(".message").textContent = t;
                break;
            case m:
                we.textContent = t.id == M ? I("$ (You)", t.name) : t.name;
                var o = (W(M).flags & w) == w,
                  r = (t.flags & w) == w,
                  i = a.querySelector(".buttons"),
                  r = (i.style.display = t.id == M || r ? "none" : "flex", i.querySelector(".button-pair").style.display = M == Pn || o ? "flex" : "none", i.querySelector("button.report").style.display = t.reported ? "none" : "", qe(t.muted), a.querySelector(".report-menu").style.display = "none", a.querySelector(".invite").style.display = M == t.id ? "flex" : "none", Ce.querySelector(".player")),
                  o = (r.style.display = "", R(r), ue(t.avatar));
                pe(o, Pn == t.id), me(o, Ga(t)), r.appendChild(o);
                break;
            case Se:
                we.textContent = I("Rooms"), roomsUpdate(t);
                break;
            case ke:
                we.textContent = 0 == zn ? "Public Room" : "Private Room", R(a);
                for (var l = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"], s = $("settings"), n = 0; n < Yn.length; n++) {
                    var c = $("setting"),
                      d = de("img", "icon"),
                      d = (d.src = "/img/setting_" + n + ".gif", c.appendChild(d), c.appendChild(de("span", "name", l[n] + ":")), Yn[n]);
                    n == ne.CUSTOMWORDSONLY && (d = d ? "Yes" : "No"), n == ne.SLOTS && (d = x.length + "/" + d), n == ne.LANG && (d = re[d]), n == ne.WORDMODE && (d = oe[d]), n == ne.DRAWTIME && (d += "s"), c.appendChild(de("span", "value", d)), s.appendChild(c)
                }
                a.appendChild(s);
                i = u.querySelector("#game-invite").cloneNode(!0);
                E(i.querySelector("#copy-invite"), "click", yo), a.appendChild(i);
                break;
            case g:
                we.textContent = I("Settings"), a.querySelector("#select-pressure-sensitivity").value = p.pressureSensitivity
        }
    }

    function Me() {
        f.style.display = "none"
    }
    y[m] = f.querySelector(".modal-container-player"), y[ve] = f.querySelector(".modal-container-info"), y[be] = f.querySelector(".modal-container-info"), y[ke] = f.querySelector(".modal-container-room"), y[g] = f.querySelector(".modal-container-settings"), E(h, "click", function(e) {
        e.target == f && Me()
    }), E([f.querySelector(".close"), y[ve].querySelector("button.ok")], "click", Me);
    var Le = u.querySelector("#game-chat form"),
      De = u.querySelector("#game-chat form input"),
      Ee = u.querySelector("#game-chat .chat-content");
    const $e = 0;
    const Re = 2,
      Ie = 3,
      Ae = 4,
      Te = 5,
      Ne = 6,
      Oe = 7,
      We = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];

    function v(e) {
        return "var(--COLOR_CHAT_TEXT_" + We[e] + ")"
    }

    function Pe() {
        Ee.scrollTop = Ee.scrollHeight + 100
    }

    function b(e, t, n, a) {
        var o = u.createElement("p"),
          r = u.createElement("b"),
          a = (r.textContent = a ? e : e + ": ", o.appendChild(r), o.style.color = n, u.createElement("span")),
          e = (a.textContent = t, o.appendChild(a), Ee.scrollHeight - Ee.scrollTop - Ee.clientHeight <= 20);
        if (Ee.appendChild(o), e && Pe(), 0 < p.chatDeleteQuota)
            for (; Ee.childElementCount > p.chatDeleteQuota;) Ee.firstElementChild.remove();
        return o
    }
    var i = void 0,
      Ye = void 0;

    function ze(e) {
        He();
        for (var t = (Ye = e).dataset.tooltip, n = e.dataset.tooltipdir || "N", a = ((i = $("tooltip")).appendChild($("tooltip-arrow")), i.appendChild($("tooltip-content", I(t))), !1), o = e; o;) {
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

    function He() {
        i && (i.remove(), Ye = i = void 0)
    }

    function Ue() {
        i && (i.querySelector(".tooltip-content").textContent = I(Ye.dataset.tooltip))
    }
    const Be = [{
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
    var Ge = u.querySelector("#select-mobile-keyboard-enabled"),
      Fe = u.querySelector("#select-mobile-keyboard-layout"),
      Ke = {
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
              this.lang = e.code, this.caps = !1, this.columns = 0, this.elements.keys = [], R(this.elements.rows);
              var t = e.layout,
                i = this;

              function n(e, t, n) {
                  var a, o = de("button", "key"),
                    r = "PointerEvent" in h ? "pointerdown" : "click";
                  return _e.has(t) ? (a = _e.get(t), o.classList.add(a.class), o.appendChild(de("span", "material-icons", a.icon)), E(o, r, function(e) {
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
              var e = $("row");
              return this.elements.rows.appendChild(e), this.rows.push(e), e
          },
          inputChanged: function() {
              Ke.elements.input.querySelector("span").textContent = Ke.input
          },
          inputAdd: function(e) {
              this.input += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e), this.inputChanged(), this.caps && this.toggleCaps()
          },
          enter: function() {
              0 < this.input.length && (bo(this.input), this.input = "", this.inputChanged())
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
    const _e = new Map;

    function Ve() {
        1 == Ge.value ? u.documentElement.dataset.mobileKeyboard = "" : delete u.documentElement.dataset.mobileKeyboard
    }
    _e.set("backspace", {
        class: "wide",
        icon: "backspace",
        callback: function(e) {
            0 < e.input.length && (e.input = e.input.slice(0, -1), e.inputChanged())
        }
    }), _e.set("caps", {
        class: "wide",
        icon: "keyboard_capslock",
        callback: function(e) {
            e.toggleCaps()
        }
    }), _e.set("enter", {
        class: "wide",
        icon: "keyboard_return",
        callback: function(e) {
            e.enter()
        }
    }), _e.set("space", {
        class: "extra-wide",
        icon: "space_bar",
        callback: function(e) {
            e.input += " ", e.inputChanged()
        }
    });
    for (var e = 0; e < Be.length; e++) {
        var Xe = de("option");
        Xe.textContent = Be[e].name, Xe.value = Be[e].code, Fe.appendChild(Xe)
    }
    E(Fe, "change", function(e) {
        for (var t = void 0, n = 0; n < Be.length; n++) Be[n].code == this.value && (t = Be[n]);
        null != t && Ke.init(t)
    }), E([Ge, Fe], "change", function(e) {
        ce(), Ve()
    }), E(Ke.elements.input, "click", function() {
        Ke.isOpen || (u.documentElement.dataset.mobileKeyboardOpen = "", ja(), Pe(), Ke.isOpen = !0)
    }), Ke.init(Be[0]);
    var je = {},
      Ze = [];

    function Je(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }

    function I(e, t) {
        var n = Je(je[p.displayLang], e),
          a = "",
          o = 0;
        Array.isArray(t) || (t = [t]);
        for (var r = 0; r < n.length; r++) {
            var i = n.charAt(r);
            "$" == i ? (a += t[o], o++) : a += i
        }
        return a
    }

    function Qe(e, t) {
        if ("children" == t)
            for (var n = 0; n < e.children.length; n++) {
                var a = e.children[n].dataset.translate;
                Qe(e.children[n], null == a ? "text" : a)
            } else {
            var o = "";
            "text" == t && (o = e.textContent), 0 < (o = "placeholder" == t ? e.placeholder : o).length ? Ze.push({
                key: o,
                element: e,
                type: t
            }) : (console.log("Empty key passed to translate with!"), console.log(e))
        }
    }
    je.en = {}, je.de = {
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
    const et = 0,
      tt = 1;
    const nt = 0,
      at = 2,
      ot = 1;
    const rt = 4,
      it = 40;
    var lt = [4, 10, 20, 32, 40],
      st = u.querySelector("#game-toolbar"),
      ct = st.querySelector(".toolbar-group-tools"),
      dt = st.querySelector(".toolbar-group-actions"),
      ut = u.querySelector("#game-toolbar .sizes .size-preview"),
      ht = u.querySelector("#game-toolbar .sizes .container"),
      pt = u.querySelector("#game-toolbar .colors");

    function mt(e, t) {
        var n, a, o, r = $("tool clickable"),
          i = (r.appendChild($("icon")), r.appendChild($("key")), t),
          l = (i.id = e, (i.element = r).toolIndex = e, r.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")", n = r, o = t.name, a = "S", n.dataset.tooltip = o, n.dataset.tooltipdir = a, E(n, "pointerenter", function(e) {
              ze(e.target)
          }), E(n, "pointerleave", function(e) {
              He()
          }), o = t.isAction ? (r.addEventListener("click", function(e) {
              Ut(this.toolIndex)
          }), dt.appendChild(r), ft[e] = i, le(t.name, t.keydef, "", function() {
              Ut(e)
          }, function(e) {
              l.textContent = e.key
          })) : (r.addEventListener("click", function(e) {
              Bt(this.toolIndex)
          }), ct.appendChild(r), gt[e] = i, le(t.name, t.keydef, "", function() {
              Bt(i.id)
          }, function(e) {
              l.textContent = e.key
          })), r.querySelector(".key"));
        l.textContent = o.key, t.hide && (r.style.display = "none")
    }
    var gt = [],
      ft = (mt(nt, {
          isAction: !1,
          name: "Brush",
          keydef: "B",
          graphic: "pen.gif",
          cursor: 0
      }), mt(ot, {
          isAction: !1,
          name: "Fill",
          keydef: "F",
          graphic: "fill.gif",
          cursor: "url(/img/fill_cur.png) 7 38, default"
      }), []),
      C = (mt(0, {
          isAction: !0,
          name: "Undo",
          keydef: "U",
          graphic: "undo.gif",
          action: function() {
              {
                  var e;
                  L == M && 0 < St.length && (St.pop(), 0 < St.length ? (Zt(e = St[St.length - 1]), l && l.emit("data", {
                      id: Ya,
                      data: e
                  })) : nn())
              }
          }
      }), mt(1, {
          isAction: !0,
          name: "Clear",
          keydef: "C",
          graphic: "clear.gif",
          action: nn
      })
        /*,*/ /*TYPOMOD DESC: add action for colorswitch*/ /*mt(2, {
        isAction: !0,
        name: "Switcher",
        graphic: "",
        action: ()=>{document.dispatchEvent(new Event("toggleColor"));}
    })*/ /*TYPOEND*/
        , /*TYPOMOD DESC: add action for brushlab*/ mt(3, {
          isAction: !0,
          name: "Lab",
          graphic: "",keydef:'L',
          action: ()=>{document.dispatchEvent(new Event("openBrushLab"));}
      }) /*TYPOEND*/, u.querySelector("#game-canvas canvas")),
      yt = C.getContext("2d", {
          willReadFrequently: !0
      }),
      k = [],
      vt = 0,
      bt = 0,
      kt = [],
      r = [0, 9999, 9999, 0, 0],
      St = [],
      S = [0, 0],
      wt = [0, 0],
      Ct = 0,
      qt = u.createElement("canvas"),
      o = (qt.width = it + 2, qt.height = it + 2, qt.getContext("2d"));

    function xt() {
        var e = gt[Lt].cursor;
        if (D.id == j && L == M) {
            if (Lt == nt) {
                var t = qt.width,
                  n = It;
                if (n <= 0) return;
                o.clearRect(0, 0, t, t);
// TYPOMOD
// desc: cursor with custom color
                var a = Dt < 10000 ? $t[Dt] : typo.hexToRgb((Dt - 10000).toString(16).padStart(6, "0"));
// TYPOEND

                a = [(a = 1 == p.dark ? [Math.floor(.75 * a[0]), Math.floor(.75 * a[1]), Math.floor(.75 * a[2])] : a)[0], a[1], a[2], .8];
                o.fillStyle = "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ")", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.fill(), o.strokeStyle = "#FFF", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.stroke(), o.strokeStyle = "#000", o.beginPath(), o.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), o.stroke();
                a = t / 2, e = "url(" + qt.toDataURL() + ")" + a + " " + a + ", default"
            }
        } else e = "default";
        C.style.cursor = e
    }
    var Mt = 0,
      Lt = 0,
      Dt = 0,
      Et = 0,
      $t = [
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
      Rt = ["White", "Black", "Light Gray", "Gray", "Red", "Dark Red", "Orange", "Dark Orange", "Yellow", "Dark Yellow", "Green", "Dark Green", "Mint", "Dark Mint", "Skyblue", "Dark Skyblue", "Seablue", "Dark Seablue", "Purple", "Dark Purple", "Pink", "Dark Pink", "Beige", "Dark Beige", "Brown", "Dark Brown"],
      It = 0,
      At = -1,
      Tt = [];

    function Nt(e) {
        return 20 + (e - rt) / (it - rt) * 80
    }
    for (e = 0; e < lt.length; e++) {
        var Ot = $("size clickable"),
          Wt = $("icon"),
          Pt = (Wt.style.backgroundSize = Nt(lt[e]) + "%", {
              id: e,
              size: lt[e],
              element: Ot,
              elementIcon: Wt
          });
        Ot.appendChild(Wt), ht.appendChild(Ot), Ot.size = Pt, Tt.push(Pt)
    }
    for (var Yt = [$("top"), $("bottom")], e = 0; e < $t.length / 2; e++) Yt[0].appendChild(Vt(2 * e)), Yt[1].appendChild(Vt(2 * e + 1)), u.querySelector("#game-toolbar .colors-mobile .top").appendChild(Vt(2 * e)), u.querySelector("#game-toolbar .colors-mobile .bottom").appendChild(Vt(2 * e + 1));
    for (e = 0; e < Yt.length; e++) pt.appendChild(Yt[e]);

    function zt(e) {
        It = q(e, rt, it);
        for (var t = Tt[Tt.length - 1], n = t.size, a = 0; a < Tt.length; a++) {
            var o = Tt[a],
              r = Math.abs(It - o.size);
            r <= n && (n = r, t = o, 0), o.element.classList.remove("selected")
        }
        t.element.classList.add("selected"), st.querySelector(".size-preview .icon").style.backgroundSize = Nt(It) + "%", xt()
    }

    function Ht(e) {
        e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
    }

    function Ut(e) {
        Ht(ft[e].element), ft[e].action()
    }

    function Bt(e, t) {
        Ht(gt[e].element), e == Lt && !t || (gt[Mt = Lt].element.classList.remove("selected"), gt[e].element.classList.add("selected"), Lt = e, xt())
    }

    function Gt(e) {
        var t =
          e > 10000 ? Xt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Xt($t[e]);
        Dt = e, u.querySelector("#color-preview-primary").style.fill = t, u.querySelector("#game-toolbar .color-picker-mobile .preview").style.backgroundColor = t, xt()
    }

    function Ft(e) {
        var t =
          e > 10000 ? Xt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Xt($t[e]);
        Et = e, u.querySelector("#color-preview-secondary").style.fill = t, xt()
    }

    function Kt() {
        var e = Dt;
        Gt(Et), Ft(e)
    }

    function _t() {
        ht.classList.remove("open")
    }

    function Vt(e) {
        var t = $("color");
        return t.style.backgroundColor = Xt($t[e]), t.colorIndex = e, t
    }

    function Xt(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function jt(e) {
        /*TYPOMOD
        desc: if color code > 1000 -> customcolor*/if(e < 1000)
            e = q(e, 0, $t.length), e = $t[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function Zt(e) {
        if (k = k.slice(0, e), !(M != L && bt < e)) {
            /* TYPOMOD
                    desc: replace draw commands because of redo*/        const keepCommands = k;
            /* TYPOEND*/
            r = Qt();
            e = Math.floor(k.length / Jt);
            kt = kt.slice(0, e), sn();
            for (var t = 0; t < kt.length; t++) {
                var n = kt[t];
                yt.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = kt.length * Jt; t < k.length; t++) en(on(k[t]), k[t]);
            vt = Math.min(k.length, vt), bt = Math.min(k.length, bt)

            /* TYPOMOD
                     log kept commands*/
            document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
            /* TYPOEND*/}
    }
    const Jt = 50;

    function Qt() {
        return [0, 9999, 9999, 0, 0]
    }

    function en(e) {
        var t, n, a, o;
        r[0] += 1, r[1] = Math.min(r[1], e[0]), r[2] = Math.min(r[2], e[1]), r[3] = Math.max(r[3], e[2]), r[4] = Math.max(r[4], e[3]), r[0] >= Jt && (t = r[1], n = r[2], a = r[3], o = r[4], (a - t <= 0 || o - n <= 0) && (t = e[0], n = e[1], a = e[2], o = e[3]), e = yt.getImageData(t, n, a - t, o - n), kt.push({
            data: e,
            bounds: r
        }), r = Qt())
    }

    function tn(e) {
        return (e || 0 < k.length || 0 < St.length || 0 < vt || 0 < bt) && (k = [], St = [], vt = bt = 0, r = Qt(), kt = [], sn(), 1)
    }

    function nn() {
        L == M && tn() && l && l.emit("data", {
            id: Pa
        })
    }

    function an(e) {
        var t, n, a, o, r, i;
        ((t = e)[0] != et ? t[0] == tt && 0 <= t[2] && t[2] < C.width && 0 <= t[3] && t[3] < C.height : (a = t[3], o = t[4], r = t[5], i = t[6], t = Math.ceil(t[2] / 2), n = (a + r) / 2, o = (o + i) / 2, r = Math.abs(r - a) / 2, a = Math.abs(i - i) / 2, (i = {
            x1: -(t + r),
            y1: -(t + r),
            x2: C.width + t + r,
            y2: C.height + t + a
        }).x1 < n && n < i.x2 && i.y1 < o && o < i.y2)) ? (k.push(e), M == L && en(on(e)))
          /* TYPOMOD
                   log draw commands */
          & document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }))
          /* TYPOEND */: console.log("IGNORED COMMAND OUT OF CANVAS BOUNDS")
    }

    function on(e) {
        var t = [0, 0, C.width, C.height];
        switch (e[0]) {
            case et:
                var n = q(Math.floor(e[2]), rt, it),
                  a = Math.ceil(n / 2),
                  o = q(Math.floor(e[3]), -a, C.width + a),
                  r = q(Math.floor(e[4]), -a, C.height + a),
                  i = q(Math.floor(e[5]), -a, C.width + a),
                  a = q(Math.floor(e[6]), -a, C.height + a),
                  l = jt(e[1]);
                t[0] = q(o - n, 0, C.width), t[1] = q(r - n, 0, C.height), t[2] = q(i + n, 0, C.width), t[3] = q(a + n, 0, C.height), ln(o, r, i, a, n, l.r, l.g, l.b);
                break;
            case tt:
                var l = jt(e[1]),
                  o = q(Math.floor(e[2]), 0, C.width),
                  r = q(Math.floor(e[3]), 0, C.height),
                  i = o,
                  a = r,
                  s = l.r,
                  c = l.g,
                  d = l.b,
                  u = yt.getImageData(0, 0, C.width, C.height),
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
                        for (v += 4 * w, ++y, k = b = !1; y++ < S - 1 && m(v);) rn(u, v, s, c, d), 0 < f && (m(v - 4) ? b || (h.push([f - 1, y]), b = !0) : b = b && !1), f < w - 1 && (m(v + 4) ? k || (h.push([f + 1, y]), k = !0) : k = k && !1), v += 4 * w
                    }
                    yt.putImageData(u, 0, 0)
                }
        }
        return t
    }

    function q(e, t, n) {
        return e < t ? t : n < e ? n : e
    }

    function rn(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
    }

    function ln(e, t, n, a, o, r, i, l) {
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
          m = (e -= o, t -= u, n -= o, a -= u, yt.getImageData(o, u, h - o, p - u));
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
        yt.putImageData(m, o, u)
    }

    function sn() {
        /* TYPOMOD
                 desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        /* TYPOEND */
        yt.fillStyle = "#FFF", yt.fillRect(0, 0, C.width, C.height)
        /* TYPOMOD
                 desc: dispatch clear event */
        ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        /* TYPOEND */
    }

    function cn(e, t, n) {
        ((t = n ? !t : t) ? Gt : Ft)(e)
    }
    E(st, "contextmenu", function(e) {
        return e.preventDefault(), !1
    }), E("#game-toolbar .sizes .size", "click", function(e) {
        var t;
        t = this.size.id, Ht((t = Tt[t]).element), zt(t.size), _t()
    }), E([C], "DOMMouseScroll wheel", function(e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        zt(It + 2 * e)
    }), le("Swap", "S", "Swap the primary and secondary color.", Kt), E(st.querySelector(".color-picker .preview"), "click", function(e) {
        Kt()
    }), E(st.querySelector(".color-picker-mobile .preview"), "click", function(e) {
        st.querySelector(".colors-mobile").classList.toggle("open")
    }), E(ut, "click", function(e) {
        ht.classList.toggle("open")
    }), E(u, "keydown", function(e) {
        if ("Enter" == e.code) return De.focus(), 0;
        if ("input" == u.activeElement.tagName.toLowerCase() || "textarea" == u.activeElement.tagName.toLowerCase() || -1 != At) return 0;
        for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < d.length; n++)
            if (d[n].key.toLowerCase() == t) {
                for (var a = 0; a < d[n].cb.length; a++) d[n].cb[a](d[n]);
                return void e.preventDefault()
            }
    }), E(C, "contextmenu", function(e) {
        return e.preventDefault(), !1
    });
    var dn = "Left-/Rightclick to choose a color!",
      un = null;

    function hn(e, t, n, a) {
        var o = C.getBoundingClientRect(),
          e = Math.floor((e - o.left) / o.width * C.width),
          t = Math.floor((t - o.top) / o.height * C.height);
        a ? (Ct = n, wt[0] = S[0] = e, wt[1] = S[1] = t) : (wt[0] = S[0], wt[1] = S[1], Ct = n, S[0] = e, S[1] = t)
    }
    "PointerEvent" in h ? (E("#game-toolbar .colors * .color", "pointerenter", function(e) {
        var t = dn + "\n" + Rt[this.colorIndex];
        u.querySelector("#game-toolbar .colors").dataset.tooltip = t, Ue()
    }), E("#game-toolbar .colors * .color", "pointerdown", function(e) {
        cn(this.colorIndex, 0 == e.button, e.altKey)
    }), E("#game-toolbar .colors-mobile * .color", "pointerdown", function(e) {
        cn(this.colorIndex, 0 == e.button, e.altKey), st.querySelector(".colors-mobile").classList.remove("open")
    }), E(C, "pointerdown", function(e) {
        if ((0 == e.button || 2 == e.button || 5 == e.button) && -1 == At) switch (e.pointerType) {
            case "mouse":
                gn(e.button, e.clientX, e.clientY, !0, -1);
                break;
            case "pen":
                gn(e.button, e.clientX, e.clientY, !0, e.pressure);
                break;
            case "touch":
                null == un && (un = e.pointerId, gn(e.button, e.clientX, e.clientY, !0, -1))
        }
    }), E(u, "pointermove", function(e) {
        switch (e.pointerType) {
            case "mouse":
                mn(e.clientX, e.clientY, !1, -1);
                break;
            case "pen":
                mn(e.clientX, e.clientY, !1, e.pressure);
                break;
            case "touch":
                un == e.pointerId && mn(e.clientX, e.clientY, !1, -1)
        }
    }), E(u, "pointerup", function(e) {
        "touch" == e.pointerType ? un == e.pointerId && (un = null, fn(e.button)) : fn(e.button)
    })) : (E("#game-toolbar .colors * .color", "mouseenter", function(e) {
        var t = dn + "\n" + Rt[this.colorIndex];
        u.querySelector("#game-toolbar .colors").dataset.tooltip = t, Ue()
    }), E("#game-toolbar .colors * .color", "click", function(e) {
        cn(this.colorIndex, 0 == e.button, e.altKey)
    }), E("#game-toolbar .colors-mobile * .color", "click", function(e) {
        cn(this.colorIndex, 0 == e.button, e.altKey), st.querySelector(".colors-mobile").classList.remove("open")
    }), E(C, "mousedown", function(e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != At || gn(e.button, e.clientX, e.clientY, !0, -1)
    }), E(u, "mouseup", function(e) {
        e.preventDefault(), fn(e.button)
    }), E(u, "mousemove", function(e) {
        mn(e.clientX, e.clientY, !1, -1)
    }), E(C, "touchstart", function(e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == un && (un = e[0].identitfier, gn(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), E(C, "touchend touchcancel", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == un) {
                fn(At);
                break
            }
    }), E(C, "touchmove", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == un) {
                mn(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    }));
    var pn = 0;

    function mn(e, t, n, a) {
        hn(e, t, a = p.pressureSensitivity ? a : -1, n), yn(!1)
    }

    function gn(e, t, n, a, o) {
        p.pressureSensitivity || (o = -1), k.length, At = e, hn(t, n, o, a), yn(!0)
    }

    function fn(e) {
        -1 == e || 0 != e && 2 != e && 5 != e || At != e || (pn != k.length && (pn = k.length, St.push(pn)), un = null, At = -1)
    }

    function yn(e) {
        if (D.id == j && L == M && -1 != At) {
            var t = 0 == At ? Dt : Et,
              n = null;
            if (e) {
                var e = function(e, t) {
                    for (var n = (e = yt.getImageData(e, t, 1, 1)).data[0], a = e.data[1], o = e.data[2], r = 0; r < $t.length; r++) {
                        var i = $t[r],
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
                if (Lt == ot) {
                    if (e == t) return;
                    l = t, s = S[0], c = S[1], n = [tt, l, s, c]
                }
                if (Lt == at) return (0 == At ? Gt : Ft)(e), void Bt(Mt)
            }
            Lt == nt && (l = It, 0 <= Ct && (l = (l - rt) * q(Ct, 0, 1) + rt),
              /* TYPOMOD use typo pressure */
              (()=>{if(0 <= Ct && localStorage.typoink == 'true') {const calcSkribblSize = (val) => Number(val) * 36 + 4;const calcLevelledSize = (val, level) => Math.pow(Number(val), Math.pow(1.5, (Number(level) - 50) / 10)); const sensitivity = 100 - Number(localStorage.sens);let levelled = calcLevelledSize(Ct, sensitivity); l = Math.round(calcSkribblSize(levelled));}
              })(),s = Math.ceil(.5 * l), c = q(Math.floor(wt[0]), -s, C.width + s), e = q(Math.floor(wt[1]), -s, C.height + s), r = q(Math.floor(S[0]), -s, C.width + s), i = q(Math.floor(S[1]), -s, C.height + s), t = t, a = l, o = c, e = e, r = r, i = i, n = [et, t, a, o, e, r, i]), null != n && an(n)
        }
        var a, o, r, i, l, s, c
    }
    setInterval(function() {
        var e, t;
        l && D.id == j && L == M && 0 < k.length - vt && (e = vt + 8, t = k.slice(vt, e), l.emit("data", {
            id: Wa,
            data: t
        }), vt = Math.min(e, k.length))
    }, 50), setInterval(function() {
        l && D.id == j && L != M && bt < k.length && (en(on(k[bt]), k[bt]), bt++)
    }, 3);
    var vn = u.querySelector("#game-canvas .overlay"),
      bn = u.querySelector("#game-canvas .overlay-content"),
      A = u.querySelector("#game-canvas .overlay-content .text"),
      kn = u.querySelector("#game-canvas .overlay-content .words"),
      Sn = u.querySelector("#game-canvas .overlay-content .reveal"),
      T = u.querySelector("#game-canvas .overlay-content .result"),
      wn = u.querySelector("#game-canvas .overlay-content .room"),
      Cn = -100,
      qn = 0,
      xn = void 0;

    function Mn(e, a, o) {
        var r, i, l = Cn,
          s = qn,
          c = e.top - l,
          d = e.opacity - s;
        Math.abs(c) < .001 && Math.abs(d) < .001 ? o && o() : (r = void 0, i = 0, xn = h.requestAnimationFrame(function e(t) {
            var n = t - (r = null == r ? t : r),
              t = (r = t, (i = Math.min(i + n, a)) / a),
              n = (n = t) < .5 ? .5 * function(e, t) {
                  return e * e * ((t + 1) * e - t)
              }(2 * n, 1.2 * 1.5) : .5 * (function(e, t) {
                  return e * e * ((t + 1) * e + t)
              }(2 * n - 2, 1.2 * 1.5) + 2);
            Cn = l + c * n, qn = s + t * t * (3 - 2 * t) * d, bn.style.top = Cn + "%", vn.style.opacity = qn, i == a ? o && o() : xn = h.requestAnimationFrame(e)
        }))
    }

    function Ln(e) {
        e.classList.add("show")
    }
    /* TYPOMOD
         desc: add event handlers for typo features */
    E(".avatar-customizer .container", "pointerdown", () => {
        sa(typo.createFakeLobbyData());});
    /* TYPOEND */

    function Dn(e) {
        for (var t = 0; t < bn.children.length; t++) bn.children[t].classList.remove("show");
        switch (e.id) {
            case Q:
                Ln(wn);
                break;
            case V:
                Ln(A), A.textContent = I("Round $", e.data + 1);
                break;
            case K:
                Ln(A), A.textContent = I("Waiting for players...");
                break;
            case _:
                Ln(A), A.textContent = I("Game starting in a few seconds...");
                break;
            case Z:
                Ln(Sn), Sn.querySelector("p span.word").textContent = e.data.word, Sn.querySelector(".reason").textContent = function(e) {
                    switch (e) {
                        case U:
                            return I("Everyone guessed the word!");
                        case G:
                            return I("The drawer left the game!");
                        case B:
                            return I("Time is up!");
                        case F:
                            return I("Drawer got skipped!");
                        default:
                            return "Error!"
                    }
                }(e.data.reason);
                for (var n = Sn.querySelector(".player-container"), a = (R(n), []), o = 0; o < e.data.scores.length; o += 3) {
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
                    var l = $("player"),
                      s = a[o],
                      c = (l.appendChild($("name", s.name)), $("score", (0 < s.score ? "+" : "") + s.score));
                    s.score <= 0 && c.classList.add("zero"), l.appendChild(c), n.appendChild(l)
                }
                break;
            case J:
                Ln(T);
                for (var d = [T.querySelector(".podest-1"), T.querySelector(".podest-2"), T.querySelector(".podest-3"), T.querySelector(".ranks")], o = 0; o < 4; o++) R(d[o]);
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
                              l = $("avatar-container"),
                              v = (y.appendChild(l), $("border"));
                            v.appendChild($("rank-place", "#" + (h + 1))), v.appendChild($("rank-name", m)), v.appendChild($("rank-score", I("$ points", g))), y.appendChild(v), 0 == h && l.appendChild($("trophy"));
                            for (o = 0; o < p.length; o++)(k = ue((s = p[o]).player.avatar, 0, 0 == h)).style.left = 15 * -(p.length - 1) + 30 * o + "%", 0 == h && (k.classList.add("winner"), k.style.animationDelay = -2.35 * o + "s"), l.appendChild(k)
                        }
                    }
                    for (var b = Math.min(5, u[3].length), o = 0; o < b; o++) {
                        var s = u[3][o],
                          f = 48,
                          y = $("rank"),
                          k = ue(s.player.avatar, 0, !1);
                        y.appendChild(k), y.appendChild($("rank-place", "#" + (s.rank + 1))), y.appendChild($("rank-name", s.player.name)), y.appendChild($("rank-score", I("$ points", s.player.score))), d[3].appendChild(y)
                    }
                    0 < u[0].length ? (D = u[0].map(function(e) {
                        return e.player.name
                    }).join(", "), T.querySelector(".winner-name").textContent = (0 < u[0].length ? D : "<user left>") + " ", T.querySelector(".winner-text").textContent = 1 == u[0].length ? I("is the winner!") : I("are the winners!")) : (T.querySelector(".winner-name").textContent = "", T.querySelector(".winner-text").textContent = I("Nobody won!"))
                } else T.querySelector(".winner-name").textContent = "", T.querySelector(".winner-text").textContent = I("Nobody won!");
                break;
            case X:
                if (e.data.words)
                    if (Ln(A), Ln(kn), R(kn), Yn[ne.WORDMODE] == ae.COMBINATION) {
                        A.textContent = I("Choose the first word");
                        for (var S = e.data.words.length / 2, w = [], C = [], q = 0, o = 0; o < S; o++) {
                            var x = $("word", e.data.words[o]),
                              M = (x.index = o, $("word", e.data.words[o + S]));
                            M.index = o, M.style.display = "none", M.style.animationDelay = .03 * o + "s", w.push(x), C.push(M), E(x, "click", function() {
                                q = this.index;
                                for (var e = 0; e < S; e++) w[e].style.display = "none", C[e].style.display = "";
                                A.textContent = I("Choose the second word")
                            }), E(M, "click", function() {
                                ya([q, this.index])
                            }), kn.appendChild(x), kn.appendChild(M)
                        }
                    } else {
                        A.textContent = I("Choose a word");
                        for (o = 0; o < e.data.words.length; o++) {
                            var L = $("word", e.data.words[o]);
                            L.index = o, E(L, "click", function() {
                                ya(this.index)
                            }), kn.appendChild(L)
                        }
                    }
                else {
                    Ln(A);
                    var D = (s = W(e.data.id)) ? s.name : I("User"),
                      D = (A.textContent = "", A.appendChild(de("span", void 0, I("$ is choosing a word!", D))), ue(s ? s.avatar : [0, 0, 0, 0], 0, !1));
                    D.style.width = "2em", D.style.height = "2em", A.appendChild(D)
                }
        }
    }
    const En = 0,
      $n = 1,
      Rn = 2,
      In = 3,
      An = 4,
      Tn = 5,
      Nn = 6;

    function On(e, t) {
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

    function Wn() {
        this.context = null, this.gain = null, this.sounds = new Map, h.addEventListener("load", this.load.bind(this), !1)
    }
    Wn.prototype.addSound = function(e, t) {
        this.sounds.set(e, new On(this, t))
    }, Wn.prototype.loadSounds = function() {
        this.addSound(En, "/audio/roundStart.ogg"), this.addSound($n, "/audio/roundEndSuccess.ogg"), this.addSound(Rn, "/audio/roundEndFailure.ogg"), this.addSound(In, "/audio/join.ogg"), this.addSound(An, "/audio/leave.ogg"), this.addSound(Tn, "/audio/playerGuessed.ogg"), this.addSound(Nn, "/audio/tick.ogg")
    }, Wn.prototype.playSound = function(e) {
        var t, n;
        null == this.context ? this.load() : "running" != this.context.state ? this.context.resume().then(function() {
            this.playSound(e)
        }) : null != this.context && 0 < p.volume && this.sounds.has(e) && (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.gain), n.start(0))
    }, Wn.prototype.setVolume = function(e) {
        y[g].querySelector("#volume .title .icon").classList.toggle("muted", e <= 0), y[g].querySelector("#volume .volume-value").textContent = e <= 0 ? "Muted" : e + "%", this.gain && (this.gain.gain.value = e / 100)
    }, Wn.prototype.load = function() {
        if (null == this.context) try {
            h.AudioContext = h.AudioContext || h.webkitAudioContext, this.context = new AudioContext, this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.setVolume(p.volume), console.log("AudioContext created."), this.loadSounds()
        } catch (e) {
            console.log("Error creating AudioContext.", e), this.context = null
        }
    };
    const w = 4;
    K;
    var l, x = [],
      M = 0,
      Pn = -1,
      L = -1,
      Yn = [],
      D = {
          id: -1,
          time: 0,
          data: 0
      },
      zn = -1,
      Hn = 0,
      Un = void 0,
      N = new Wn,
      s = void 0,
      Bn = !1,
      Gn = !1,
      Fn = u.querySelector("#game-wrapper"),
      ut = u.querySelector("#game-canvas .room"),
      Kn = u.querySelector("#game-players"),
      _n = u.querySelector("#game-chat"),
      Vn = (u.querySelector("#game-board"), u.querySelector("#game-bar")),
      Xn = Kn.querySelector(".players-list"),
      jn = Kn.querySelector(".players-footer"),
      Zn = u.querySelector("#game-round"),
      O = [u.querySelector("#game-word .description"), u.querySelector("#game-word .word"), u.querySelector("#game-word .hints .container")],
      Jn = u.querySelector("#home .container-name-lang input"),
      Qn = u.querySelector("#home .container-name-lang select"),
      ea = u.querySelector("#home .panel .button-play"),
      ta = u.querySelector("#home .panel .button-create");
    const na = 11 == (t = new Date).getMonth() && 19 <= (t = t.getDate()) && t <= 26;

    function aa(e) {
        Bn = e, u.querySelector("#load").style.display = e ? "block" : "none"
    }

    function oa(e, t, n, a) {
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
                    a && xe(ve, I("Servers are currently undergoing maintenance!") + "\n\rStatus: " + e + "\n\rPlease try again later!");
                    break;
                default:
                    a && xe(ve, I("An unknown error occurred ('$')", e) + "\n\r" + I("Please try again later!"))
            }
            n({
                success: !1,
                error: e
            })
        }, (r = new XMLHttpRequest).onreadystatechange = function() {
            4 == this.readyState && o(this.status, this.response)
        }, r.open("POST", e, !0), r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), r.send(t)
    }
    na;
    var ra = null;
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
                    ra()
                },
                AIP_REMOVE: function() {}
            })
        })
    } catch (e) {
        console.log("ad push failed: "), console.log(e)
    }

    function ia(t) {
        var e, n, a = !1;
        if (h.localStorageAvailable && (n = c.getItem("lastAd"), e = new Date, c.setItem("lastAd", e.toString()), null == n ? n = e : (n = new Date(Date.parse(n)), a = 1 <= Math.abs(n - e) / 1e3 / 60)), a) try {
            aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (ra = t, aiptag.cmd.player.push(function() {
                adplayer.startPreRoll()
            })) : t()
        } catch (e) {
            console.log(e), t()
        } else t()
    }

    function la(e, t, n) {
        N.context && N.context.resume && N.context.resume(), l && fa();
        var a, o = 0,
          r = {
              transports: ["websocket", "polling"],
              closeOnBeforeunload: !1
          };
        "URL" in h && "127.0.0.1" != (a = new URL(e)).hostname && "localhost" != a.hostname && (r.path = "/" + a.port + "/", e = a.protocol + "//" + a.hostname), (l = P(e, r)).on("connect", function() {
            /* TYPOMOD
                         desc: disconnect socket & leave lobby */
            document.addEventListener('socketEmit', event => l.emit('data', {id: event.detail.id, data: event.detail.data}));
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
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            /* TYPOEND */
            aa(!1), l.on("joinerr", function(e) {
                fa(), xe(ve, function(e) {
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
            }), l.on("data", Ba);
            var e = Jn.value.split("#"),
              e = {
                  join: t,
                  create: n ? 1 : 0,
                  name: e[0],
                  lang: Qn.value,
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
                        xe(be, I("You have been kicked!"));
                        break;
                    case te:
                        xe(be, I("You have been banned!"));
                        break;
                    default:
                        xe(be, I("Connection lost!") + "\n" + e)
                }
            fa()
        }), l.on("connect_error", function(e) {
            fa(), aa(!1), xe(ve, e.message)
        })
    }

    function sa(e) {
        var t;
        N.playSound(In), Bt(nt, !0), zt(12), Gt(1), Ft(0), tn(!0), R(Ee), u.querySelector("#home").style.display = "none", u.querySelector("#game").style.display = "flex", M = e.me, zn = e.type, Un = e.id, u.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, Yn = t, ca(), R(Xn), x = [];
        for (var n = 0; n < e.users.length; n++) Fa(e.users[n], !1);
        if (ja(), Za(), ua(e.round), Sa(e.owner), pa(e.state, !0), !Gn) {
            try {
                (adsbygoogle = h.adsbygoogle || []).push({}), (adsbygoogle = h.adsbygoogle || []).push({})
            } catch (e) {
                console.log("google ad request failed"), console.log(e)
            }
            Gn = !0
        }
    }

    function ca() {
        ua(Hn);
        for (var e, t = 0; t < eo.length; t++) {
            var n = eo[t];
            n.index && (e = Yn[(n = n).index], "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
        }
    }

    function da(e, t, n) {
        Yn[e] = t, n && l && l.emit("data", {
            id: $a,
            data: {
                id: e,
                val: t
            }
        }), ca()
    }

    function ua(e) {
        var e = (Hn = e) + 1,
          t = Yn[ne.ROUNDS];
        Zn.textContent = I("Round $ of $", [e, t]), Vn.querySelector(".mobile .round span").textContent = e + "/" + t
    }

    function ha() {
        for (var e = 0; e < x.length; e++) x[e].score = 0;
        for (e = 0; e < x.length; e++) Ja(x[e], !1), Qa(x[e], !1);
        Za()
    }

    function pa(e, t) {
        var n, a;
        if (n = D = e, null != xn && (h.cancelAnimationFrame(xn), xn = void 0), n.id == j ? Mn({
            top: -100,
            opacity: 0
        }, 600, function() {
            vn.classList.remove("show")
        }) : vn.classList.contains("show") ? Mn({
            top: -100,
            opacity: 1
        }, 600, function() {
            Dn(n), Mn({
                top: 0,
                opacity: 1
            }, 600)
        }) : (vn.classList.add("show"), Dn(n), Mn({
            top: 0,
            opacity: 1
        }, 600)), a = e.time, co(), uo(a), lo = setInterval(function() {
            uo(Math.max(0, so - 1));
            var e = -1;
            D.id == j && (e = oo), D.id == X && (e = ro), io.style.animationName = so < e ? so % 2 == 0 ? "rot_left" : "rot_right" : "none", so < e && N.playSound(Nn), so <= 0 && co()
        }, 1e3), Fn.classList.add("toolbar-hidden"), xt(), ga(!1), e.id == Q ? (ha(), Fn.classList.add("room")) : Fn.classList.remove("room"), e.id == V && (ua(e.data), 0 == e.data) && ha(), e.id == Z) {
            M != L && ka(e.data.word);
            for (var o = 0; o < e.data.scores.length; o += 3) {
                var r = e.data.scores[o + 0],
                  i = e.data.scores[o + 1];
                e.data.scores[o + 2];
                (c = W(r)) && (c.score = i)
            }
            Za();
            for (var l = !0, o = 0; o < x.length; o++)
                if (x[o].guessed) {
                    l = !1;
                    break
                } l ? N.playSound(Rn) : N.playSound($n), b(I("The word was '$'", e.data.word), "", v(Ae), !0)
            /* TYPOMOD
                         desc: log finished drawing */
            ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
            /* TYPOEND */
        } else e.id != j && (O[0].textContent = I("WAITING"), O[0].classList.add("waiting"), O[1].style.display = "none", O[2].style.display = "none");
        if (e.id == j) {
            if (L = e.data.id, N.playSound(En), tn(!0), e.data.drawCommands && (k = e.data.drawCommands), b(I("$ is drawing now!", W(L).name), "", v(Ie), !0), L != M && _n.querySelector("input").focus(), !t)
                for (o = 0; o < x.length; o++) Ja(x[o], !1);
            O[0].classList.remove("waiting"), L == M ? (a = e.data.word, O[0].textContent = I("DRAW THIS"), O[1].style.display = "", O[2].style.display = "none", O[1].textContent = a, Fn.classList.remove("toolbar-hidden"), xt()) : (ga(!0), va(e.data.word, !1), ba(e.data.hints))
        } else {
            L = -1;
            for (o = 0; o < x.length; o++) Ja(x[o], !1)
        }
        if (e.id == J && 0 < e.data.length) {
            for (var s = [], i = 0, o = 0; o < e.data.length; o++) {
                var c, d = e.data[o][0],
                  u = e.data[o][1];
                (c = W(d)) && 0 == u && (i = c.score, s.push(c.name))
            }
            1 == s.length ? b(I("$ won with a score of $!", [s[0], i]), "", v(Ne), !0) : 1 < s.length && b(I("$ and $ won with a score of $!", [s.slice(0, -1).join(", "), s[s.length - 1], i]), "", v(Ne), !0)
        }
        for (o = 0; o < x.length; o++) Qa(x[o], x[o].id == L);
        ja()
    }

    function ma(e) {
        l && l.connected && D.id == j && (l.emit("data", {
            id: xa,
            data: e
        }), ga(!1))
    }

    function ga(e) {
        u.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function fa() {
        console.log("lobby left"), l && l.close(), tn(!(l = void 0)), co(), x = [], Yn = [], D = {
            id: L = Pn = -1,
            time: M = 0,
            data: 0
        }, u.querySelector("#home").style.display = "", u.querySelector("#game").style.display = "none"
    }

    function ya(e) {
        l && l.connected && D.id == X && l.emit("data", {
            id: Oa,
            data: e
        })
    }

    function va(e, t) {
        for (var n = e.length - 1, a = 0; a < e.length; a++) n += e[a];
        var o = !t && 1 == Yn[ne.WORDMODE];
        o && (n = 3), O[0].textContent = I(o ? "WORD HIDDEN" : "GUESS THIS"), O[1].style.display = "none", O[2].style.display = "", R(O[2]), O[2].hints = [];
        for (a = 0; a < n; a++) O[2].hints[a] = $("hint", o ? "?" : "_"), O[2].appendChild(O[2].hints[a]);
        o || O[2].appendChild($("word-length", e.join(" ")))
    }

    function ba(e) {
        for (var t = O[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
              o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function ka(e) {
        (!O[2].hints || O[2].hints.length < e.length) && va([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        ba(t)
    }

    function Sa(e) {
        Pn = e;
        for (var t = 0; t < x.length; t++) pe(x[t].element, x[t].id == Pn), Va(x[t], 0, x[t].id == Pn);
        var n = M != Pn;
        u.querySelector("#start-game").disabled = n;
        for (var a = 0; a < eo.length; a++) eo[a].element.disabled = n;
        e = W(Pn);
        e && b(I("$ is now the room owner!", e.name), "", v(Ne), !0)
    }
    const wa = 1,
      Ca = 2,
      qa = 5,
      xa = 8,
      Ma = 9,
      La = 90,
      Da = 10,
      Ea = 11,
      $a = 12,
      Ra = 13,
      Ia = 14,
      Aa = 15,
      Ta = 16,
      Na = 17,
      Oa = 18,
      Wa = 19,
      Pa = 20,
      Ya = 21;
    const za = 30,
      Ha = 31,
      Ua = 32;

    function Ba(e) {
        var t = e.id,
          n = e.data;
        switch (t) {
            case Da:
                /* TYPOMOD
                                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: n }));
                /* TYPOEND*/
                sa(n);
                break;
            case Ea:
                pa(n);
                break;
            case $a:
                da(n.id, n.val, !1);
                break;
            case Ra:
                ba(n);
                break;
            case Ia:
                uo(n);
                break;
            case wa:
                var a = Fa(n, !0);
                Za(), a.joinTimeout = setTimeout(() => {
                    b(I("$ joined the room!", a.name), "", v(Ae), !0), N.playSound(In), a.joinTimeout = void 0
                }, 0 == zn ? 1e3 : 0);
                break;
            case Ma:
                (a = W(n.id)) && (a.avatar = n.avatar, he(a.element.avatar, a.avatar));
                break;
            case La:
                (a = W(n.id)) && (a.name = n.name, a.element.querySelector(".player-name").textContent = n.name);
                break;
            case Ca:
                (a = function(e) {
                    for (var t = 0; t < x.length; t++) {
                        var n = x[t];
                        if (n.id == e) return x.splice(t, 1), n.element.remove(), Za(), ja(), n
                    }
                    return
                }(n.id)) && (null == a.joinTimeout ? (b(function(e, t) {
                    switch (e) {
                        default:
                            return I("$ left the room!", t);
                        case ee:
                            return I("$ has been kicked!", t);
                        case te:
                            return I("$ has been banned!", t)
                    }
                }(n.reason, a.name), "", v(Te), !0), N.playSound(An)) : (clearTimeout(a.joinTimeout), a.joinTimeout = void 0), n.id != L || n.reason != ee && n.reason != te || tn(!0));
                break;
            case qa:
                var o = W(n[0]),
                  r = W(n[1]),
                  i = n[2],
                  l = n[3];
                o && r && b(I("$ is voting to kick $ ($/$)", [o.name, r.name, i, l]), "", v(Re), !0);
                break;
            case Aa:
                (a = W(n.id)) && (b(I("$ guessed the word!", a.name), "", v(Ae), !0).classList.add("guessed"), Ja(a, !0), N.playSound(Tn), n.id == M) && ka(n.word);
                break;
            case xa:
                (a = W(n.id)) && (o = a, r = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (i = $("icon")).style.backgroundImage = "url(/img/" + r + ")", r = _a(o, i).getBoundingClientRect(), o = .9 * (r.bottom - r.top), i.style.width = o + "px", i.style.height = o + "px", n.vote ? b(I("$ liked the drawing!", a.name), "", v(Ae), !0) : b(I("$ disliked the drawing!", a.name), "", v(Te), !0));
                break;
            case Na:
                Sa(n);
                break;
            case Ta:
                b(I("$ is close!", n), "", v(Re), !0);
                break;
            case za:
                Ka(W(n.id), n.msg);
                break;
            case Ua:
                b(I("Spam detected! You're sending messages too quickly."), "", v(Te), !0);
                break;
            case Ha:
                switch (n.id) {
                    case 0:
                        b(I("You need at least 2 players to start the game!"), "", v(Te), !0);
                        break;
                    case 100:
                        b(I("Server restarting in about $ seconds!", n.data), "", v(Te), !0)
                }
                break;
            case Wa:
                for (var s = 0; s < n.length; s++) an(n[s]);
                break;
            case Pa:
                tn(!0);
                break;
            case Ya:
                Zt(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function W(e) {
        for (var t = 0; t < x.length; t++) {
            var n = x[t];
            if (n.id == e) return n
        }
    }

    function Ga(e) {
        return (e.flags & w) == w ? ["glow", "hue-rotate"] : []
    }

    function Fa(e, t) {
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
              element: $("player"),
              bubble: void 0
          },
          e = (x.push(n), n.id == M ? I("$ (You)", n.name) : n.name),
          a = (n.flags & w) == w,
          o = (a && n.element.classList.add("admin"), $("player-avatar-container")),
          r = ue(n.avatar),
          o = (n.element.drawing = $("drawing"), (n.element.avatar = r).appendChild(n.element.drawing), o.appendChild(r), n.element.appendChild(o), Xn.appendChild(n.element), me(r, Ga(n)), $("player-info")),
          r = $("player-name", e),
          e = (n.id == M && r.classList.add("me"), o.appendChild(r), o.appendChild($("player-rank", "#" + n.rank)), o.appendChild($("player-score", I("$ points", n.score))), a && o.appendChild($("player-tag", "ADMIN")), n.element.appendChild(o), E(n.element, "click", function() {
              s = n, xe(m, n)
          }), $("player-icons")),
          r = $("icon owner"),
          a = $("icon muted");
        /* TYPOMOD
                 desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id);
        /* TYPOEND */
        return e.appendChild(r), e.appendChild(a), n.element.appendChild(e), n.element.icons = [r, a], Ja(n, n.guessed), t && ja(), n
    }

    function Ka(e, t) {
        var n, a, o;
        !e.muted && (o = ((a = W(M)).flags & w) == w, n = e.id == L || e.guessed, M == L || a.guessed || !n || o) && (a = (e.flags & w) == w, o = $e, n && (o = Oe), a && (o = Te), _a(e, $("text", t)), b(e.name, t, v(o))
          .setAttribute("playerid", e.id))
    }

    function _a(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = $("player-bubble"),
          a = $("content");
        return a.appendChild(t), n.appendChild($("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function() {
            e.bubble.remove(), e.bubble = void 0
        }, 1500), n
    }

    function Va(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Xa = void 0;

    function ja() {
        D.id, Q;
        for (var e = getComputedStyle(u.documentElement).getPropertyValue("--PLAYERS_PER_PAGE"), t = (e <= 0 && (t = Math.max(48, Xn.clientHeight), e = Math.floor(t / 48)), Math.ceil(x.length / e)), n = 0; n < x.length; n++) x[n].page = Math.floor(n / e);
        null == Xa ? Xa = ge(jn, t, [Kn], function(e, t, n) {
            for (var a = [], o = 0; o < x.length; o++) {
                var r = (i = x[o]).page == t;
                i.element.style.display = r ? "" : "none", r && a.push(i.element)
            }
            if (0 < a.length) {
                for (var i, o = 0; o < a.length; o++)(i = a[o]).classList.remove("first"), i.classList.remove("last"), o % 2 == 0 ? i.classList.remove("odd") : i.classList.add("odd");
                a[0].classList.add("first"), a[a.length - 1].classList.add("last")
            }
        }) : fe(Xa, t), Xa.element.style.display = 1 < t ? "" : "none"
    }

    function Za() {
        for (var e = [], t = 0; t < x.length; t++) e.push(x[t]);
        e.sort(function(e, t) {
            return t.score - e.score
        });
        for (var n, a, o = 1, t = 0; t < e.length; t++) {
            var r = e[t];
            a = o, (n = r).rank = a, n.element.querySelector(".player-score").textContent = I("$ points", n.score), (n = n.element.querySelector(".player-rank")).textContent = "#" + a, n.classList.remove("first"), n.classList.remove("second"), n.classList.remove("third"), 1 == a && n.classList.add("first"), 2 == a && n.classList.add("second"), 3 == a && n.classList.add("third"), t < e.length - 1 && r.score > e[t + 1].score && o++
        }
    }

    function Ja(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed"): e.element.classList.remove("guessed")
    }

    function Qa(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var eo = [];
    for (var to = ut.querySelectorAll('*[id^="item-"]'), no = 0; no < to.length; no++) {
        var ao = {
            id: to[no].id.replace("item-settings-", ""),
            element: to[no],
            index: to[no].dataset.setting
        };
        to[no].item = ao, eo.push(ao), E(to[no].item.element, "change", function() {
            var e = this.value;
            "checkbox" == this.type && (e = this.checked ? 1 : 0), null != this.item.index && da(this.item.index, e, !0)
        })
    }
    const oo = 10,
      ro = 4;
    var io = u.querySelector("#game-clock"),
      lo = null,
      so = 0;

    function co() {
        lo && (clearInterval(lo), lo = null)
    }

    function uo(e) {
        so = e, io.textContent = so, Vn.querySelector(".mobile .drawtime span").textContent = so + "s"
    }
    var ho, t = u.querySelector("#tutorial"),
      po = t.querySelectorAll(".page"),
      mo = ge(t.querySelector(".navigation"), po.length, [t.querySelector(".pages")], function(e, t, n) {
          n && clearInterval(go);
          for (var a = 0; a < po.length; a++) po[a].classList.remove("active");
          po[t].classList.add("active")
      }),
      go = setInterval(function() {
          mo.selected < 4 ? ye(mo, mo.selected + 1, !1) : ye(mo, 0, !1)
      }, 3500),
      ut = u.querySelector("#game-settings");
    u.querySelector("#audio"), u.querySelector("#lightbulb");

    function fo() {
        var e = .01 * h.innerHeight;
        u.documentElement.style.setProperty("--vh", e + "px")
    }

    function yo() {
        b(I("Copied room link to clipboard!"), "", v(Re), !0);
        var e = "https://skribbl.io/?" + Un;
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

    function vo(e) {
        var t = Le.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }

    function bo(e) {
        l && l.connected ? l.emit("data", {
            id: za,
            data: e
        }) : Ka(W(M), e)
    }
    E(ut, "click", function() {
        xe(g)
    }), E(h, "resize", function() {
        fo(), ja()
    }), h.onunload = function() {
        console.log("huh"), l && fa()
    }, E(u, "PointerEvent" in h ? "pointerdown" : "click", function(e) {
        Ke.elements.main.contains(e.target) || Ke.isOpen && (delete u.documentElement.dataset.mobileKeyboardOpen, ja(), Ke.isOpen = !1), u.querySelector("#game-toolbar .sizes").contains(e.target) || _t()
    }), E([Jn, Qn], "change", ce), E(ea, "click",
      typo.joinLobby = function() {
          var t, e, n, a, o;
          n = h.location.href,
            typo.lastConnect = Date.now(), o = "", n = n.split("?"), t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o, Bn || (e = "" != t ? "id=" + t : "lang=" + Qn.value, Me(), aa(!0), ia(function() {
              oa(location.origin + "/api/play", e, function(e) {
                  aa(!1), e.success && la(e.data, t)
              }, !0)
          }))
      }), E(ta, "click", function() {
        Bn || (Me(), aa(!0), ia(function() {
            oa(location.origin + "/api/play", "lang=" + Qn.value, function(e) {
                e.success ? la(e.data, 0, 1) : aa(!1)
            }, !0)
        }))
    }), E(u.querySelector("#game-rate .like"), "click", function() {
        ma(1)
    }), E(u.querySelector("#game-rate .dislike"), "click", function() {
        ma(0)
    }), E(u.querySelector("#start-game"), "click", function() {
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
    }), E([u.querySelector("#copy-invite"), u.querySelector("#modal-player-button-invite")], "click", yo), E(y[m].querySelector("button.kick"), "click", function() {
        Me(), null != s && s.id != M && l && l.emit("data", {
            id: 3,
            data: s.id
        })
    }), E(y[m].querySelector("button.ban"), "click", function() {
        Me(), null != s && s.id != M && l && l.emit("data", {
            id: 4,
            data: s.id
        })
    }), E(y[m].querySelector("button.votekick"), "click", function() {
        Me(), null != s && s.id != M && l && (s.id == Pn ? b(I("You can not votekick the lobby owner!"), "", v(Te), !0) : l.emit("data", {
            id: qa,
            data: s.id
        }))
    }), E(y[m].querySelector("button.mute"), "click", function() {
        null != s && s.id != M && (s.muted = !s.muted, Va(s, 1, s.muted), s.muted ? b(I("You muted '$'!", s.name), "", v(Te), !0) : b(I("You unmuted '$'!", s.name), "", v(Te), !0), l && l.emit("data", {
            id: 7,
            data: s.id
        }), qe(s.muted))
    }), E(y[m].querySelector("button.report"), "click", function() {
        y[m].querySelector(".buttons").style.display = "none", y[m].querySelector(".player").style.display = "none", y[m].querySelector(".report-menu").style.display = "";
        for (var e = y[m].querySelectorAll(".report-menu input"), t = 0; t < e.length; t++) e[t].checked = !1
    }), E(y[m].querySelector("button#report-send"), "click", function() {
        var e = 0;
        y[m].querySelector("#report-reason-toxic").checked && (e |= 1), y[m].querySelector("#report-reason-spam").checked && (e |= 2), y[m].querySelector("#report-reason-bot").checked && (e |= 4), 0 < e && (null != s && s.id != M && (s.reported = !0, l && l.emit("data", {
            id: 6,
            data: {
                id: s.id,
                reasons: e
            }
        }), b(I("Your report for '$' has been sent!", s.name), "", v(Re), !0)), Me())
    }), E(y[g].querySelector("#volume input"), "change", function(e) {
        p.volume = e.target.value, N.setVolume(p.volume), N.playSound(Tn), ce()
    }), E(y[g].querySelector("#select-pressure-sensitivity"), "change", function(e) {
        p.pressureSensitivity = e.target.value, ce()
    }), E(y[g].querySelector("button.reset"), "click", function() {
        for (var e = 0; e < d.length; e++) {
            var t = d[e];
            t.key = t.def, t.listing.querySelector("input").value = t.key;
            for (var n = 0; n < t.changed.length; n++) t.changed[n](t)
        }
        se()
    }), E(u.querySelector("#game-keyboard button.settings"), "click", function(e) {
        xe(g)
    }), E(De, "focusin focus", function(e) {
        e.preventDefault()
    }), E(De, "input", function(e) {
        vo(De.value.length)
    }), E(Le, "submit", function(e) {
        const input = De; let rest = input.value.substring(100);
        input.value = input.value.substring(0,100);
        if(rest.length > 0) setTimeout(()=>{input.value = rest; e.target.dispatchEvent(new Event("submit"));},180);
        return e.preventDefault(), De.value && bo(De.value), Le.reset(), vo(0), !1
    }), fo(), h.localStorageAvailable ? (Jn.value = a("name", ""), Qn.value = function(e) {
        for (var t = u.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
            if (t[n].value == e) return t[n].value;
        return 0
    }(a("lang", 0)), p.displayLang = a("displaylang", "en"), p.volume = parseInt(a("volume", 100)), p.filterChat = 1 == parseInt(a("filter", 1)) ? 1 : 0, p.pressureSensitivity = 1 == parseInt(a("pressure", 1)) ? 1 : 0, p.avatar = (t = "ava", ut = p.avatar, null == (t = c.getItem(t)) ? ut : JSON.parse(t)), Ge.value = a("keyboard", 1), Fe.value = a("keyboardlayout", "en"), Ve(), y[g].querySelector("#volume input").value = p.volume, N.setVolume(p.volume), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
    for (var ko = u.querySelectorAll("[data-translate]"), So = 0; So < ko.length; So++) {
        var wo = ko[So];
        Qe(wo, wo.dataset.translate)
    }
    for (var Co = je[p.displayLang], qo = 0; qo < Ze.length; qo++) {
        var xo = Ze[qo],
          Mo = Je(Co, xo.key);
        "text" == xo.type && (xo.element.textContent = Mo), "placeholder" == xo.type && (xo.element.placeholder = Mo)
    }

    function Lo(e) {
        ho.parts[e].classList.remove("bounce"), ho.parts[e].offsetWidth, ho.parts[e].classList.add("bounce")
    }
    E(ea = u.querySelectorAll("[data-tooltip]"), "pointerenter", function(e) {
        ze(e.target)
    }), E(ea, "pointerleave", function(e) {
        He()
    }), ut = (ta = u.querySelector("#home .avatar-customizer")).querySelector(".container"), t = ta.querySelectorAll(".arrows.left .arrow"), ea = ta.querySelectorAll(".arrows.right .arrow"), ta = ta.querySelectorAll(".randomize"), (ho = ue(p.avatar)).classList.add("fit"), ut.appendChild(ho), E(t, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        --p.avatar[e], p.avatar[e] < 0 && (p.avatar[e] = n[e] - 1), Lo(e), he(ho, p.avatar), ce()
    }), E(ea, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        p.avatar[e] += 1, p.avatar[e] >= n[e] && (p.avatar[e] = 0), Lo(e), he(ho, p.avatar), ce()
    }), E(ta, "click", function() {
        p.avatar[0] = Math.floor(Math.random() * n[0]), p.avatar[1] = Math.floor(Math.random() * n[1]), p.avatar[2] = Math.floor(Math.random() * n[2]), Lo(1), Lo(2), he(ho, p.avatar), ce()
    });
    for (var Do = Math.round(8 * Math.random()), Eo = u.querySelector("#home .logo-big .avatar-container"), $o = 0; $o < 8; $o++) {
        var Ro = [0, 0, 0, -1],
          Ro = (Ro[0] = $o, Ro[1] = Math.round(100 * Math.random()) % z, Ro[2] = Math.round(100 * Math.random()) % H, 100 * Math.random() < 1 && (Ro[3] = Math.floor(20 * Math.random())), na && 100 * Math.random() < 35 && (Ro[3] = 96 + Math.floor(4 * Math.random())), ue(Ro, 0, Do == $o));
        Ro.index = $o, Eo.appendChild(Ro), E(Ro, "click", function() {
            var e = [this.index, 0, 0, -1];
            e[1] = Math.round(100 * Math.random()) % z, e[2] = Math.round(100 * Math.random()) % H, 1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())), he(this, e), this.classList.remove("clicked"), this.offsetWidth, this.classList.add("clicked")
        })
    }
}(window, document, localStorage, io);