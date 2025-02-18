((h, c, d, P) => {
  let Y = 28,
    z = 57,
    U = 51,
    n = [Y, z, U],
    H = 0,
    B = 1,
    _ = 2,
    G = 5,
    K = 0,
    F = 1,
    V = 2,
    j = 3,
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
      /* mod sequence injection for custom draw commands */
      msi: {

        reset: () => {
          typo.msi.mod.selected = undefined;
          typo.msi.mod.buffer = undefined;
          typo.msi.mod.apply = undefined
        },

        /* incoming draw commands are part of an injected mod */
        mod: {
          selected: undefined, /* index of selected mod */
          buffer: undefined, /* buffer to construct mod */
          apply: undefined /* function to apply constructed mod */
        },

        modes: [

          /* custom color mode */
          (buffer) => {
            return (command) => {

              /* skip if buffer empty */
              if(buffer.length === 0) return command;

              /* if brush or fill */
              if(command[0] <= 1) {
                command[1] = buffer[0];
              }

              return command;
            }
          }
        ],

        fromSenaryDoubleDecimalBase: (senary, decimal1, decimal0) => {
          return decimal0 + decimal1 * 10 + Number.parseInt(senary.toString(), 6) * 100;
        },

        fromOctalDoubleDecimalBase: (octal, decimal1, decimal0) => {
          return decimal0 + decimal1 * 10 + Number.parseInt(octal.toString(), 8) * 100;
        },

        /* bases of data: width x height x width x height -> odd sdd odd sdd */
        parseInjectedSequence: (odd1, sdd1, odd0, sdd0) => {
          const parseDigits = (num) => {
            const str = num.toString().padStart(3, '0');
            return [str[0], str[1], str[2]].map(Number);
          };

          const [sdd0_s, sdd0_d1, sdd0_d0] = parseDigits(sdd0);
          const [odd0_o, odd0_d1, odd0_d0] = parseDigits(odd0);
          const [sdd1_s, sdd1_d1, sdd1_d0] = parseDigits(sdd1);
          const [odd1_o, odd1_d1, odd1_d0] = parseDigits(odd1);

          return typo.msi.fromSenaryDoubleDecimalBase(sdd0_s, sdd0_d1, sdd0_d0)
            + 600 * typo.msi.fromOctalDoubleDecimalBase(odd0_o, odd0_d1, odd0_d0)
            + 600 * 800 * typo.msi.fromSenaryDoubleDecimalBase(sdd1_s, sdd1_d1, sdd1_d0)
            + 600 * 800 * 600 * typo.msi.fromOctalDoubleDecimalBase(odd1_o, odd1_d1, odd1_d0);
        },

        toSenaryDoubleDecimalBase: (number) => {
          const senary = Math.floor(number / 100);
          const decimal1 = Math.floor((number % 100) / 10);
          const decimal0 = number % 10;
          return [senary, decimal1, decimal0];
        },

        toOctalDoubleDecimalBase: (number) => {
          const octal = Math.floor(number / 100);
          const decimal1 = Math.floor((number % 100) / 10);
          const decimal0 = number % 10;
          return [octal, decimal1, decimal0];
        },

        toInjectedSequence: (number) => {
          const odd1 = Math.floor(number / (600 * 800 * 600));
          const sdd1 = Math.floor((number % (600 * 800 * 600)) / (600 * 800));
          const odd0 = Math.floor((number % (600 * 800)) / 600);
          const sdd0 = number % 600;

          const sdd0Array = typo.msi.toSenaryDoubleDecimalBase(sdd0);
          const odd0Array = typo.msi.toOctalDoubleDecimalBase(odd0);
          const sdd1Array = typo.msi.toSenaryDoubleDecimalBase(sdd1);
          const odd1Array = typo.msi.toOctalDoubleDecimalBase(odd1);

          return [
            odd1Array[0] * 100 + odd1Array[1] * 10 + odd1Array[2],
            sdd1Array[0] * 100 + sdd1Array[1] * 10 + sdd1Array[2],
            odd0Array[0] * 100 + odd0Array[1] * 10 + odd0Array[2],
            sdd0Array[0] * 100 + sdd0Array[1] * 10 + sdd0Array[2]
          ];
        },

        /* if tool = 0 (brush), color 0, size 4, and all coords 0 -> MSI init/finish signal */
        isMSIInitSignal: (command) => {
          return (command[0] === 0 && command[1] === 0 && command[2] === 5 && command[3] === 0 && command[4] === 0 && command[5] === 0 && command[6] === 0);
        },

        /* if tool = 0 (brush), color 0, size 40 and all coords 0 -> MSI reset signal */
        isResetSignal: (command) => {
          return (command[0] === 0 && command[1] === 0 && command[2] === 39 && command[3] === 0 && command[4] === 0 && command[5] === 0 && command[6] === 0);
        },

        processIncomingCommand: (command) => {
          const msiInitSignal = typo.msi.isMSIInitSignal(command);
          const resetSignal = typo.msi.isResetSignal(command);
          const processingMode = typo.msi.mod.selected === undefined && Array.isArray(typo.msi.mod.buffer);
          const processingBuffer = typo.msi.mod.selected !== undefined && typo.msi.mod.apply === undefined && Array.isArray(typo.msi.mod.buffer);
          const mod = typo.msi.mod.apply;

          if(resetSignal){
            /*console.log("MSI reset signal received.");*/
            typo.msi.mod.selected = undefined;
            typo.msi.mod.buffer = undefined;
            typo.msi.mod.apply = undefined;
            return undefined;
          }

          if(msiInitSignal && !processingBuffer) {
            /*console.log("MSI init signal received.");*/
            typo.msi.mod.selected = undefined;
            typo.msi.mod.buffer = [];
            typo.msi.mod.apply = undefined;
            return undefined;
          }

          if(msiInitSignal && processingBuffer) {
            /*console.log("MSI finish signal received.");*/
            typo.msi.mod.apply = typo.msi.mod.selected(typo.msi.mod.buffer);
            return undefined;
          }

          if(processingMode){
            const mode = typo.msi.parseInjectedSequence(command[3], command[4], command[5], command[6]);
            /*console.log("MSI mode selection received.", mode);*/
            typo.msi.mod.selected = (typo.msi.modes[mode - 1] ?? (() => c => c));
            return undefined;
          }

          if(processingBuffer){
            const packet = typo.msi.parseInjectedSequence(command[3], command[4], command[5], command[6]);
            /*console.log("MSI buffer processing.", packet);*/
            typo.msi.mod.buffer.push(packet);
            return undefined;
          }

          if(mod){
            /*console.log("MSI mod applying.");*/
            return typo.msi.mod.apply(command);
          }

          return command;
        }
      },

      msiColorSwitch: {
        currentCode: undefined,
        closeColors: {},
        getClosestSkribblColor: code => {
          const existing = typo.msiColorSwitch.closeColors[code];
          if(existing !== undefined) return existing;

          const rgb = typo.typoCodeToRgb(code);
          const lab = typo.rgbToLab(rgb);
          const distance = (c1, c2) =>
            Math.sqrt(
              Math.pow(c1[0] - c2[0], 2) +
              Math.pow(c1[1] - c2[1], 2) +
              Math.pow(c1[2] - c2[2], 2)
            );

          const colors = wt.map(c => typo.rgbToLab(c));
          const color = colors.reduce((closestIndex, color, index) =>
              distance(lab, color) < distance(lab, colors[closestIndex]) ? index : closestIndex
            , 0);
          typo.msiColorSwitch.closeColors[code] = color;
          return color;
        },
        ensureColorSequence: command => {
          const color = command[1];

          /* sanitize color to black for non-typo users */
          if(color > 10000){
            command[1] = typo.msiColorSwitch.getClosestSkribblColor(color);
          }

          /* if color is typo color and not already initiated */
          if(color > 10000 && color !== typo.msiColorSwitch.currentCode){
            typo.msiColorSwitch.currentCode = color;
            const codeData = typo.msi.toInjectedSequence(color);
            const sequence = [
              [0, 0, 5, 0,0,0,0],
              [0, 0, 5, 0,0,0,1],
              [0, 0, 5, ...codeData],
              [0, 0, 5, 0,0,0,0]
            ];
            return sequence;
          }

          /* if color is original but typo color initiated */
          if(color < 10000 && typo.msiColorSwitch.currentCode !== undefined){
            typo.msiColorSwitch.currentCode = undefined;
            return [[0, 0, 39, 0,0,0,0]];
          }

          return undefined;
        },
        insertColorSwitches: (commands) => {
          inserted = [];
          for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            const t = typo.msiColorSwitch.ensureColorSequence(command);
            if(t !== undefined) inserted.push(...t);
            inserted.push(command);
          }

          commands.splice(0, commands.length, ...inserted);
        }
      },
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
        // IDENTIFY x.value.split: #home .container-name-lang input -> Kn
        // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> l
        return {
          id: id,
          name: name.length != 0 ? name : (Kn.value.split("#")[0] != "" ? Kn.value.split("#")[0] : "Player"),
          avatar: avatar.length == 0 ? l.avatar : avatar,
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
        document.addEventListener("selectSkribblTool", (event) => Nt(event.detail));
        document.addEventListener("selectSkribblSize", (event) => It(event.detail));
        document.addEventListener("clearDrawing", () => Vt());
        document.addEventListener("abortJoin", () => abort = true);
        document.addEventListener("disableCursorUpdates", e => {
          typo.skipCursorUpdate = e.detail === true;
          if(e.detail === false) vt(); // update cursor when updates reenabled
        });
        document.addEventListener("joinLobby", (e) => {
          abort = false;
          let timeoutdiff = Date.now() - (typo.lastConnect == 0 ? Date.now() : typo.lastConnect);
          // Xn(true);
          setTimeout(() => {
            if (abort) return;
            typo.lastConnect = Date.now();
            // Vn.dispatchEvent(new Event("click"));
            // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
            // ##PRIVATELBBY## = !1
            // IDENTIFY: x:  = !1
            if (e.detail) window.history.pushState({path: window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);
            // ##JOINLOBBY##(e.detail?.join ? e.detail.join : "");
            // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
            typo.joinLobby();
            window.history.pushState({path: window.location.origin}, '', window.location.origin);
            // Jn(false);
            // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
            document.dispatchEvent(new Event("joinedLobby"));
          }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
        });
        document.addEventListener("leaveLobby", () => {
          if (typo.disconnect) typo.disconnect();
          else ua() | document.dispatchEvent(new Event("leftLobby"));
          // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
        });
        document.addEventListener("setColor", (e) => {
          let rgb = e.detail.code < 10000 ? wt[e.detail.code] : typo.typoCodeToRgb(e.detail.code);
          let match = wt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]);
          // IDENTIFY [0, 59, 120], -> COLORS
          let code = match >= 0 ? match : e.detail.code;
          if (e.detail.secondary) Ot(code);
          // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
          else Wt(code);
          // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
        });
        document.addEventListener("performDrawCommand", (e) => {
          v.push(e.detail);
          mt.push(v.length);
          // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
          Kt(Zt(e.detail));
          // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
        });
        document.addEventListener("collapseUndoActions", (e) => {
          const shrinkCount = e.detail;
          const firstCollapsedIndex = mt.length - shrinkCount + 1;
          const collapsed = mt.slice(0, firstCollapsedIndex);
          const lastCollapsedIndex = collapsed.length === 0 ? 0 : collapsed.length - 1
          collapsed[lastCollapsedIndex] = mt[mt.length - 1];
          mt = collapsed;
        });
        document.addEventListener("addTypoTooltips", () => {
          [...document.querySelectorAll("[data-typo-tooltip]")].forEach(elem => {
            elem.setAttribute("data-tooltip", elem.getAttribute("data-typo-tooltip"));
            elem.removeAttribute("data-typo-tooltip");
            elem.addEventListener("mouseenter", (e) => Oe(e.target));
            // IDENTIFY: x(e.target):
            elem.addEventListener("mouseleave", (e) => Pe());
            // IDENTIFY: (e) => x():
          });
        });
      })(),
      rgbToXyz: (R, G, B) => {
        let r = R / 255;
        let g = G / 255;
        let b = B / 255;

        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : (r / 12.92);
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : (g / 12.92);
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : (b / 12.92);

        let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        return [x, y, z];
      },
      xyzToLab: (x, y, z) => {
        const REF_X = 0.95047;
        const REF_Y = 1.00000;
        const REF_Z = 1.08883;

        let fx = f(x / REF_X);
        let fy = f(y / REF_Y);
        let fz = f(z / REF_Z);

        let L = 116 * fy - 16;
        let a = 500 * (fx - fy);
        let b = 200 * (fy - fz);

        return [L, a, b];

        function f(value) {
          return (value > 0.008856)
            ? Math.pow(value, 1 / 3)
            : (7.787 * value) + (16 / 116);
        }
      },
      rgbToLab: ([R, G, B]) => {
        const [x, y, z] = typo.rgbToXyz(R, G, B);
        return typo.xyzToLab(x, y, z);
      },
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
  // TYPOEND,
  oe = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (h.localStorageAvailable = !1, void 0 !== d) try {
    d.setItem("feature_test", "yes"), "yes" === d.getItem("feature_test") && (d.removeItem("feature_test"), h.localStorageAvailable = !0)
  } catch (e) {}
  var u = [];

  function re(e) {
    for (var t = 0; t < u.length; t++)
      if (u[t].name == e) return u[t]
  }

  function ie(e, t, n, a, o) {
    var r, i, l = t,
      s = (h.localStorageAvailable && (r = d.getItem("hotkey_" + e)) && (t = r), re(e));
    return s ? (s.key = t, s.def = l, s.desc = n) : (s = {
      name: e,
      desc: n,
      key: t,
      def: l,
      listing: $("item"),
      changed: [],
      cb: []
    }, u.push(s), je(r = $("key", s.name), "text"), s.listing.appendChild(r), (i = c.createElement("input")).value = s.key, s.listing.appendChild(i), D(i, "keydown", function(e) {
      for (var t = e.key, n = 0; n < u.length; n++)
        if (u[n].key == t) return void e.preventDefault();
      i.value = t, s.key = t;
      for (n = 0; n < s.changed.length; n++) s.changed[n](s);
      return le(), e.preventDefault(), !1
    }), g[p].querySelector("#hotkey-list").appendChild(s.listing)), a && s.cb.push(a), o && s.changed.push(o), s
  }

  function le() {
    if (h.localStorageAvailable)
      for (var e = 0; e < u.length; e++) h.localStorage.setItem("hotkey_" + u[e].name, u[e].key)
  }
  var l = {
    avatar: [Math.round(100 * Math.random()) % Y, Math.round(100 * Math.random()) % z, Math.round(100 * Math.random()) % U, -1],
    volume: 100,
    dark: 0,
    filterChat: 1,
    pressureSensitivity: 1,
    displayLang: "en",
    undefined,
    mobileChatLayout: "bottom"
  };

  function a(e, t) {
    e = d.getItem(e);
    return null == e ? t : e
  }

  function se() {
    h.localStorageAvailable ? (d.setItem("name", Kn.value), d.setItem("lang", Fn.value), d.setItem("displaylang", l.displayLang), d.setItem("volume", l.volume), d.setItem("dark", 1 == l.dark ? 1 : 0), d.setItem("filter", 1 == l.filterChat ? 1 : 0), d.setItem("pressure", 1 == l.pressureSensitivity ? 1 : 0), d.setItem("ava", JSON.stringify(l.avatar)), d.setItem("mobileChatLayout", l.mobileChatLayout), d.setItem("keyboard", ze.value), d.setItem("keyboardlayout", Ue.value), console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
  }

  function D(e, t, n) {
    for (var a, o = e, r = ("string" == typeof e ? o = c.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]), t.split(" ")), i = 0; i < o.length; i++)
      for (var l = 0; l < r.length; l++) o[i].addEventListener(r[l], n)
  }

  function $(e, t) {
    var n = c.createElement("div");
    if (void 0 !== e)
      for (var a = e.split(" "), o = 0; o < a.length; o++) n.classList.add(a[o]);
    return void 0 !== t && (n.textContent = t), n
  }

  function ce(e, t, n) {
    var a = c.createElement(e);
    if (void 0 !== t)
      for (var o = t.split(" "), r = 0; r < o.length; r++) a.classList.add(o[r]);
    return void 0 !== n && (a.textContent = n), a
  }

  function de(e) {
    for (; e.firstChild;) e.removeChild(e.firstChild)
  }

  function ue(e, t) {
    var n = $("avatar"),
      a = $("color"),
      o = $("eyes"),
      r = $("mouth"),
      i = $("special"),
      l = $("owner");
    return l.style.display = t ? "block" : "none", n.appendChild(a), n.appendChild(o), n.appendChild(r), n.appendChild(i), n.appendChild(l), n.parts = [a, o, r], he(n, e), n
  }

  function he(e, t) {
    function n(e, t, n) {
      var a = -t % n * 100,
        t = 100 * -Math.floor(t / n);
      e.style.backgroundPosition = a + "% " + t + "%"
    }
    var a = t[0] % Y,
      o = t[1] % z,
      r = t[2] % U,
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
    return e.appendChild(o.element), n.push(o.element), D(n, "DOMMouseScroll wheel", function(e) {
      var t;
      1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), ye(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0), e.preventDefault(), e.stopPropagation())
    }), fe(o, t), o
  }

  function fe(e, t) {
    de(e.element), e.dots = [];
    for (var n = 0; n < t; n++) {
      var a = $("dot");
      a.index = n, a.appendChild($("inner")), D(a, "click", function() {
        ye(e, this.index, !0)
      }), e.element.appendChild(a), e.dots.push(a)
    }
    e.selected < 0 && (e.selected = 0), t <= e.selected && (e.selected = t - 1), ye(e, e.selected, !1)
  }

  function ye(e, t, n) {
    if (0 <= t && t < e.dots.length) {
      e.selected = t;
      for (var a = 0; a < e.dots.length; a++) e.dots[a].classList.remove("active");
      e.dots[t].classList.add("active"), e.change(e, t, n)
    }
  }
  let s = 0,
    ve = 1,
    be = 2,
    Se = 3,
    p = 4,
    ke = 5;
  var m = c.querySelector("#modal"),
    we = m.querySelector(".modal-title .text"),
    Ce = m.querySelector(".modal-content"),
    g = [];

  function qe(e) {
    g[s].querySelector(".buttons button.mute").textContent = E(e ? "Unmute" : "Mute")
  }

  function xe(e, t) {
    m.style.display = "block";
    for (var n = 0; n < g.length; n++) g[n].style.display = "none";
    g[e].style.display = "flex";
    var a = g[e];
    switch (e) {
      case ve:
        we.textContent = E("Something went wrong!"), a.querySelector(".message").textContent = t;
        break;
      case be:
        we.textContent = E("Disconnected!"), a.querySelector(".message").textContent = t;
        break;
      case s:
        we.textContent = t.id == x ? E("$ (You)", t.name) : t.name;
        var o = (O(x).flags & k) == k,
          r = (t.flags & k) == k,
          i = a.querySelector(".buttons"),
          r = (i.style.display = t.id == x || r ? "none" : "flex", i.querySelector(".button-pair").style.display = x == R || o ? "flex" : "none", i.querySelector("button.report").style.display = t.reported ? "none" : "", qe(t.muted), a.querySelector(".report-menu").style.display = "none", a.querySelector(".invite").style.display = x == t.id ? "flex" : "none", Ce.querySelector(".player")),
          o = (r.style.display = "", de(r), ue(t.avatar))
        ; /*id in popup*/ r.setAttribute("playerid", t.id);;
        pe(o, R == t.id), me(o, Ya(t)), r.appendChild(o);
        break;
      case ke:
        we.textContent = E("Rooms"), roomsUpdate(t);
        break;
      case Se:
        we.textContent = E("Invite your friends!");
        break;
      case p:
        we.textContent = E("Settings"), a.querySelector("#select-pressure-sensitivity").value = l.pressureSensitivity
    }
  }

  function Me() {
    m.style.display = "none"
  }
  g[s] = m.querySelector(".modal-container-player"), g[ve] = m.querySelector(".modal-container-info"), g[be] = m.querySelector(".modal-container-info"), g[Se] = m.querySelector(".modal-container-room"), g[p] = m.querySelector(".modal-container-settings"), D([m.querySelector(".close"), g[ve].querySelector("button.ok")], "click", Me);
  let Le = 0,
    De = 2,
    $e = 3,
    Ee = 4,
    Ae = 5,
    Ie = 6,
    Re = 7,
    Te = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];

  function f(e) {
    return "var(--COLOR_CHAT_TEXT_" + Te[e] + ")"
  }

  function Ne(e, t, n, a) {
    var o = c.createElement("p"),
      r = c.createElement("b"),
      a = (r.textContent = a ? e : e + ": ", o.appendChild(r), o.style.color = n, c.createElement("span"));
    return a.textContent = t, o.appendChild(a), o
  }

  function y(e, t, n, a) {
    var o = Ne(e, t, n, a),
      r = Gn.scrollHeight - Gn.scrollTop - Gn.clientHeight <= 20;
    if (Gn.appendChild(o), r && (Gn.scrollTop = Gn.scrollHeight + 100), 0 < l.chatDeleteQuota)
      for (; Gn.childElementCount > l.chatDeleteQuota;) Gn.firstElementChild.remove();
    var i = Ne(e, t, n, a);
    return c.querySelector("#game-canvas .bubbles").appendChild(i), setTimeout(function() {
      i.remove()
    }, 2500), o
  }
  var i = void 0,
    We = void 0;

  function Oe(e) {
    Pe();
    for (var t = (We = e).dataset.tooltip, n = e.dataset.tooltipdir || "N", a = ((i = $("tooltip")).appendChild($("tooltip-arrow")), i.appendChild($("tooltip-content", E(t))), !1), o = e; o;) {
      if ("fixed" == h.getComputedStyle(o).position) {
        a = !0;
        break
      }
      o = o.parentElement
    }
    i.style.position = a ? "fixed" : "absolute";
    var t = e.getBoundingClientRect(),
      e = ("E" == (n = "W" == (n = "S" == (n = "N" == n && t.top - h.scrollY < 48 ? "S" : n) && t.bottom - h.scrollY > c.documentElement.clientHeight - 48 ? "N" : n) && t.left - h.scrollX < 48 ? "E" : n) && t.right - h.scrollX > c.documentElement.clientWidth - 48 && (n = "W"), t.left),
      r = t.top;
    "N" == n && (e = (t.left + t.right) / 2), "S" == n && (e = (t.left + t.right) / 2, r = t.bottom), "E" == n && (e = t.right, r = (t.top + t.bottom) / 2), "W" == n && (r = (t.top + t.bottom) / 2), a || (e += h.scrollX, r += h.scrollY), i.classList.add(n), i.style.left = e + "px", i.style.top = r + "px", c.body.appendChild(i)
  }

  function Pe() {
    i && (i.remove(), We = i = void 0)
  }
  let Ye = [{
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
  var ze = c.querySelector("#select-mobile-keyboard-enabled"),
    Ue = c.querySelector("#select-mobile-keyboard-layout"),
    He = {
      elements: {
        main: c.querySelector("#game-keyboard"),
        input: c.querySelector("#game-keyboard .input"),
        rows: c.querySelector("#game-keyboard .keys"),
        caps: 0,
        keys: []
      },
      lang: 0,
      form: void 0,
      input: void 0,
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
        this.lang = e.code, this.caps = !1, this.columns = 0, this.elements.keys = [], this.form = c.querySelector("#game-chat-input-mobile form"), this.input = this.form.querySelector("input"), de(this.elements.rows);
        var t = e.layout,
          i = this;

        function n(e, t, n) {
          var a, o = ce("button", "key"),
            r = "PointerEvent" in h ? "pointerdown" : "click";
          return Be.has(t) ? (a = Be.get(t), o.classList.add(a.class), o.appendChild(ce("span", "material-icons", a.icon)), D(o, r, function(e) {
            a.callback(i), e.preventDefault()
          })) : (o.textContent = i.getKeyLowercase(t), D(o, r, function(e) {
            i.inputAdd(t), e.preventDefault()
          }), i.elements.keys.push(o)), n ? e.insertBefore(o, e.firstChild) : e.appendChild(o), o
        }
        for (var a = 0; a < t.length; a++) {
          current_row = i.addRow();
          for (var o = 0; o < t[a].length; o++) {
            var r = t[a][o];
            n(current_row, r)
          }
        }
        this.elements.caps = n(current_row, "caps", !0), n(current_row, "backspace"), current_row = i.addRow();
        for (var l = ["-", "space", ".", "enter"], o = 0; o < l.length; o++) n(current_row, l[o])
      },
      addRow: function() {
        var e = $("row");
        return this.elements.rows.appendChild(e), this.rows.push(e), e
      },
      inputChanged: function() {
        this.input.dispatchEvent(new Event("input", {
          bubbles: !0
        }))
      },
      inputAdd: function(e) {
        this.input.value += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e), this.inputChanged(), this.caps && this.toggleCaps()
      },
      enter: function() {
        0 < this.input.value.length && (this.form.requestSubmit(), this.input.value = "", this.inputChanged())
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
  let Be = new Map;

  function _e() {
    1 == ze.value ? (_n[1].setAttribute("readonly", ""), c.documentElement.dataset.mobileKeyboard = "") : (_n[1].removeAttribute("readonly"), delete c.documentElement.dataset.mobileKeyboard)
  }
  Be.set("backspace", {
    class: "wide",
    icon: "backspace",
    callback: function(e) {
      0 < e.input.value.length && (e.input.value = e.input.value.slice(0, -1), e.inputChanged())
    }
  }), Be.set("caps", {
    class: "wide",
    icon: "keyboard_capslock",
    callback: function(e) {
      e.toggleCaps()
    }
  }), Be.set("enter", {
    class: "wide",
    icon: "keyboard_return",
    callback: function(e) {
      e.enter()
    }
  }), Be.set("space", {
    class: "extra-wide",
    icon: "space_bar",
    callback: function(e) {
      e.input.value += " ", e.inputChanged()
    }
  });
  for (var e = 0; e < Ye.length; e++) {
    var Ge = ce("option");
    Ge.textContent = Ye[e].name, Ge.value = Ye[e].code, Ue.appendChild(Ge)
  }
  D(Ue, "change", function(e) {
    for (var t = void 0, n = 0; n < Ye.length; n++) Ye[n].code == this.value && (t = Ye[n]);
    null != t && He.init(t)
  }), D([ze, Ue], "change", function(e) {
    se(), _e()
  }), D(He.elements.main, "gesturestart gesturechange gestureend drag scroll", function(e) {
    return e.preventDefault(), !1
  }), He.init(Ye[0]);
  var Ke = {},
    Fe = [];

  function Ve(e, t) {
    e = e[t];
    return null != e && "" != e ? e : t
  }

  function E(e, t) {
    var n = Ve(Ke[l.displayLang], e),
      a = "",
      o = 0;
    Array.isArray(t) || (t = [t]);
    for (var r = 0; r < n.length; r++) {
      var i = n.charAt(r);
      "$" == i ? (a += t[o], o++) : a += i
    }
    return a
  }

  function je(e, t) {
    if ("children" == t)
      for (var n = 0; n < e.children.length; n++) {
        var a = e.children[n].dataset.translate;
        je(e.children[n], null == a ? "text" : a)
      } else {
      var o = "";
      "text" == t && (o = e.textContent), 0 < (o = "placeholder" == t ? e.placeholder : o).length ? Fe.push({
        key: o,
        element: e,
        type: t
      }) : (console.log("Empty key passed to translate with!"), console.log(e))
    }
  }
  Ke.en = {}, Ke.de = {
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
  let Ze = 0,
    Xe = 1,
    Je = 0,
    Qe = 4,
    et = 40;
  var tt = [4, 10, 20, 32, 40],
    nt = c.querySelector("#game-toolbar"),
    at = nt.querySelector(".toolbar-group-tools"),
    ot = nt.querySelector(".toolbar-group-actions"),
    t = c.querySelector("#game-toolbar .sizes .size-preview"),
    rt = c.querySelector("#game-toolbar .sizes .container"),
    it = c.querySelector("#game-toolbar .colors");

  function lt(e, t) {
    var n, a, o, r = $("tool clickable"),
      i = (r.appendChild($("icon")), r.appendChild($("key")), t),
      l = (i.id = e, (i.element = r).toolIndex = e, r.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")", o = t.name, a = "S", (n = r).dataset.tooltip = o, n.dataset.tooltipdir = a, D(n, "pointerenter", function(e) {
        Oe(e.target)
      }), D(n, "pointerleave", function(e) {
        Pe()
      }), o = t.isAction ? (r.addEventListener("click", function(e) {
        Tt(this.toolIndex)
      }), ot.appendChild(r), ct[e] = i, ie(t.name, t.keydef, "", function() {
        Tt(e)
      }, function(e) {
        l.textContent = e.key
      })) : (r.addEventListener("click", function(e) {
        Nt(this.toolIndex)
      }), at.appendChild(r), st[e] = i, ie(t.name, t.keydef, "", function() {
        Nt(i.id)
      }, function(e) {
        l.textContent = e.key
      })), r.querySelector(".key"));
    l.textContent = o.key, t.hide && (r.style.display = "none")
  }
  var st = [],
    ct = (lt(Je, {
      isAction: !1,
      name: "Brush",
      keydef: "B",
      graphic: "pen.gif",
      cursor: 0
    }), lt(1, {
      isAction: !1,
      name: "Fill",
      keydef: "F",
      graphic: "fill.gif",
      cursor: "url(/img/fill_cur.png) 7 38, default"
    }), []),
    C = (lt(0, {
      isAction: !0,
      name: "Undo",
      keydef: "U",
      graphic: "undo.gif",
      action: function() {
        {
          var e;
          M == x && 0 < mt.length && (mt.pop(), 0 < mt.length ? (Bt(e = mt[mt.length - 1]), S && S.emit("data", {
            id: Ta,
            data: e
          })) : Vt())
        }
      }
    }), lt(1, {
      isAction: !0,
      name: "Clear",
      keydef: "C",
      graphic: "clear.gif",
      action: Vt
    })
      /*TYPOMOD DESC: add tool for deselect*/
      ,
      lt(-1, {
        isAction: !1,
        name: "None",
        graphic: "",
        keydef: "",
      })
      /*TYPOEND*/
      /*TYPOMOD DESC: add tool for pipette*/
      ,
      lt(3, {
        isAction: !1,
        name: "Pipette",
        graphic: "",
        keydef: 'P',
      })
      /*TYPOEND*/
      /* TYPOMOD DESC: add action for colorswitch */
      /*
      ,
      lt(2, {
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
      lt(3, {
        isAction: !0,
        name: "Lab",
        graphic: "",
        keydef: 'L',
        action: () => {
          document.dispatchEvent(new Event("openBrushLab"));
        }
      })
      /*TYPOEND*/, c.querySelector("#game-canvas canvas")),
    dt = C.getContext("2d", {
      willReadFrequently: !0
    }),
    v = [],
    ut = 0,
    ht = 0,
    pt = [],
    r = [0, 9999, 9999, 0, 0],
    mt = [],
    b = [0, 0],
    gt = [0, 0],
    ft = 0,
    yt = c.createElement("canvas"),
    o = (yt.width = et + 2, yt.height = et + 2, yt.getContext("2d"));

  function vt() {

// TYPOMOD
// desc: dont update cursor when typo updates if very frequently to avoid performance drop
    if(typo.skipCursorUpdate === true) return;var e = st[bt].cursor;
    if (L.id == Z && M == x) {
      if (bt == Je) {
        var t = yt.width,
          n = qt;
        if (n <= 0) return;
        o.clearRect(0, 0, t, t);
// TYPOMOD
// desc: cursor with custom color
        var a = St < 10000 ? wt[St] : typo.typoCodeToRgb(St);
// TYPOEND

        a = [(a = 1 == l.dark ? [Math.floor(.75 * a[0]), Math.floor(.75 * a[1]), Math.floor(.75 * a[2])] : a)[0], a[1], a[2], .8];
        o.fillStyle = "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ")", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.fill(), o.strokeStyle = "#FFF", o.beginPath(), o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), o.stroke(), o.strokeStyle = "#000", o.beginPath(), o.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), o.stroke();
        a = t / 2, e = "url(" + yt.toDataURL() + ")" + a + " " + a + ", default"
      }
    } else e = "default";
    C.style.cursor = e
  }
  var bt = 0,
    St = 0,
    kt = 0,
    wt = [
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
    Ct = ["White", "Black", "Light Gray", "Gray", "Red", "Dark Red", "Orange", "Dark Orange", "Yellow", "Dark Yellow", "Green", "Dark Green", "Mint", "Dark Mint", "Skyblue", "Dark Skyblue", "Seablue", "Dark Seablue", "Purple", "Dark Purple", "Pink", "Dark Pink", "Beige", "Dark Beige", "Brown", "Dark Brown"],
    qt = 0,
    xt = -1,
    Mt = [];

  function Lt(e) {
    return 20 + (e - Qe) / (et - Qe) * 80
  }
  for (e = 0; e < tt.length; e++) {
    var Dt = $("size clickable"),
      $t = $("icon"),
      Et = ($t.style.backgroundSize = Lt(tt[e]) + "%", {
        id: e,
        size: tt[e],
        element: Dt,
        elementIcon: $t
      });
    Dt.appendChild($t), rt.appendChild(Dt), Dt.size = Et, Mt.push(Et)
  }
  for (var At = [$("top"), $("bottom")], e = 0; e < wt.length / 2; e++) At[0].appendChild(zt(2 * e)), At[1].appendChild(zt(2 * e + 1));
  for (e = 0; e < At.length; e++) it.appendChild(At[e]);

  function It(e) {
    qt = q(e, Qe, et);
    for (var t = Mt[Mt.length - 1], n = t.size, a = 0; a < Mt.length; a++) {
      var o = Mt[a],
        r = Math.abs(qt - o.size);
      r <= n && (n = r, t = o, 0), o.element.classList.remove("selected")
    }
    t.element.classList.add("selected"), nt.querySelector(".size-preview .icon").style.backgroundSize = Lt(qt) + "%",
      document.dispatchEvent(new CustomEvent("skribblSizeChanged", { detail: qt })), vt()
  }

  function Rt(e) {
    e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
  }

  function Tt(e) {
    Rt(ct[e].element), ct[e].action()
  }

  function Nt(e, t) {

    /*toolidtarget*/ document.dispatchEvent(new CustomEvent("skribblToolChanged", {detail: e}));  Rt(st[e].element), e == bt && !t || (st[bt].element.classList.remove("selected"), st[e].element.classList.add("selected"), bt = e, vt())
  }

  function Wt(e) {
    var t =
      e > 10000 ? Ut(typo.typoCodeToRgb(e)) : Ut(wt[e]);
    St = e, c.querySelector("#color-preview-primary").style.fill = t
      , document.dispatchEvent(new CustomEvent("skribblColorChanged", {detail: t})), c.querySelector("#game-toolbar .color-preview-mobile").style.backgroundColor = t, vt()
  }

  function Ot(e) {
    var t =
      e > 10000 ? Ut(typo.typoCodeToRgb(e)) : Ut(wt[e]);
    kt = e, c.querySelector("#color-preview-secondary").style.fill = t, vt()
  }

  function Pt() {
    var e = St;
    Wt(kt), Ot(e)
  }

  function Yt() {
    rt.classList.remove("open")
  }

  function zt(e) {
    var t = $("color");
    return t.style.backgroundColor = Ut(wt[e]), t.colorIndex = e, t
  }

  function Ut(e) {
    return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
  }

  function Ht(e) {
    /*TYPOMOD
    desc: if color code > 1000 -> customcolor*/if(e < 1000)
      e = q(e, 0, wt.length), e = wt[e];
    else e = typo.typoCodeToRgb(e);/* TYPOEND */
    return {
      r: e[0],
      g: e[1],
      b: e[2]
    }
  }

  function Bt(e) {
    if (v = v.slice(0, e), !(x != M && ht < e)) {
      /* TYPOMOD
              desc: replace draw commands because of redo*/        const keepCommands = v;
      /* TYPOEND*/
      r = Gt();
      e = Math.floor(v.length / _t);
      pt = pt.slice(0, e), Qt();
      for (var t = 0; t < pt.length; t++) {
        var n = pt[t];
        dt.putImageData(n.data, n.bounds[1], n.bounds[2])
      }
      for (t = pt.length * _t; t < v.length; t++) Kt(Zt(v[t]), v[t]);
      ut = Math.min(v.length, ut), ht = Math.min(v.length, ht)

      /* TYPOMOD
               log kept commands*/
      document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
      /* TYPOEND*/}
  }
  let _t = 50;

  function Gt() {
    return [0, 9999, 9999, 0, 0]
  }

  function Kt(e) {
    var t, n, a, o;
    r[0] += 1, r[1] = Math.min(r[1], e[0]), r[2] = Math.min(r[2], e[1]), r[3] = Math.max(r[3], e[2]), r[4] = Math.max(r[4], e[3]), r[0] >= _t && (t = r[1], n = r[2], a = r[3], o = r[4], (a - t <= 0 || o - n <= 0) && (t = e[0], n = e[1], a = e[2], o = e[3]), e = dt.getImageData(t, n, a - t, o - n), pt.push({
      data: e,
      bounds: r
    }), r = Gt())
  }

  function Ft(e) {
    return (e || 0 < v.length || 0 < mt.length || 0 < ut || 0 < ht) && (v = [], mt = [], ut = ht = 0, r = Gt(), pt = [], Qt(), 1)
  }

  function Vt() {
    M == x && Ft() && S && S.emit("data", {
      id: Ra
    })
  }

  function jt(e) {
    var t, n, a, o, r, i;
    ((t = e)[0] != Ze ? t[0] == Xe && 0 <= t[2] && t[2] < C.width && 0 <= t[3] && t[3] < C.height : (a = t[3], o = t[4], r = t[5], i = t[6], t = Math.ceil(t[2] / 2), n = (a + r) / 2, o = (o + i) / 2, r = Math.abs(r - a) / 2, a = Math.abs(i - i) / 2, (i = {
      x1: -(t + r),
      y1: -(t + r),
      x2: C.width + t + r,
      y2: C.height + t + a
    }).x1 < n && n < i.x2 && i.y1 < o && o < i.y2)) ? (v.push(e), x == M && Kt(Zt(e)))
      /* TYPOMOD  log draw commands */
      & document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }))
      /* TYPOEND */: console.log("IGNORED COMMAND OUT OF CANVAS BOUNDS")
  }

  function Zt(e) {
    var t = [0, 0, C.width, C.height];
    switch (e[0]) {
      case Ze:
        var n = q(Math.floor(e[2]), Qe, et),
          a = Math.ceil(n / 2),
          o = q(Math.floor(e[3]), -a, C.width + a),
          r = q(Math.floor(e[4]), -a, C.height + a),
          i = q(Math.floor(e[5]), -a, C.width + a),
          a = q(Math.floor(e[6]), -a, C.height + a),
          l = Ht(e[1]);
        t[0] = q(o - n, 0, C.width), t[1] = q(r - n, 0, C.height), t[2] = q(i + n, 0, C.width), t[3] = q(a + n, 0, C.height), Jt(o, r, i, a, n, l.r, l.g, l.b);
        break;
      case Xe:
        var l = Ht(e[1]),
          o = q(Math.floor(e[2]), 0, C.width),
          r = q(Math.floor(e[3]), 0, C.height),
          i = o,
          a = r,
          s = l.r,
          c = l.g,
          d = l.b,
          u = dt.getImageData(0, 0, C.width, C.height),
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
            for (y += 4 * w, ++f, b = v = !1; f++ < k - 1 && S(y);) Xt(u, y, s, c, d), 0 < g && (S(y - 4) ? v || (h.push([g - 1, f]), v = !0) : v = v && !1), g < w - 1 && (S(y + 4) ? b || (h.push([g + 1, f]), b = !0) : b = b && !1), y += 4 * w
          }
          dt.putImageData(u, 0, 0)
        }
    }
    return t
  }

  function q(e, t, n) {
    return e < t ? t : n < e ? n : e
  }

  function Xt(e, t, n, a, o) {
    0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
  }

  function Jt(e, t, n, a, o, r, i, l) {
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
      m = (e -= o, t -= u, n -= o, a -= u, dt.getImageData(o, u, h - o, p - u));
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
    dt.putImageData(m, o, u)
  }

  function Qt() {
    /* TYPOMOD
             desc: store data before clear */
    const data = document.querySelector("#game-canvas canvas").toDataURL();
    /* TYPOEND */
    dt.fillStyle = "#FFF", dt.fillRect(0, 0, C.width, C.height)
    /* TYPOMOD
             desc: dispatch clear event */
    ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
    /* TYPOEND */
  }

  function en(e) {
    if (L.id == Z && M == x && -1 != xt) {
      var t = 0 == xt ? St : kt,
        n = null;
      if (e) {
        var e = ((e, t) => {
          for (var n = (e = dt.getImageData(e, t, 1, 1)).data[0], a = e.data[1], o = e.data[2], r = 0; r < wt.length; r++) {
            var i = wt[r];
            if (0 == i[0] - n && 0 == i[1] - a && 0 == i[2] - o) return r
          }
          /* TYPOMOD
                               desc: if color is not in array, convert to custom color */
          return r = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
          /* TYPOEND */
          return r
        })(b[0], b[1]);
        if (1 == bt) {
          if (e == t) return;
          e = t, l = b[0], s = b[1], n = [Xe, e, l, s]
        }
      }
      bt == Je && (e = qt, 0 <= ft && (e = (e - Qe) * q(ft, 0, 1) + Qe),
        /* TYPOMOD use typo pressure */
        (() => {
          if (0 <= ft && document.documentElement.dataset["typo_pressure_performance"]) {
            const pressure = eval(document.documentElement.dataset["typo_pressure_performance"])(ft);
            e = Math.max(4, Math.round(40 * pressure));
          }
        })(),l = Math.ceil(.5 * e), s = q(Math.floor(gt[0]), -l, C.width + l), o = q(Math.floor(gt[1]), -l, C.height + l), r = q(Math.floor(b[0]), -l, C.width + l), i = q(Math.floor(b[1]), -l, C.height + l), t = t, e = e, a = s, o = o, r = r, i = i, n = [Ze, t, e, a, o, r, i]), null != n && jt(n)
    }
    var a, o, r, i, l, s
  }

  function tn(e, t, n, a) {
    var o = C.getBoundingClientRect(),
      e = Math.floor((e - o.left) / o.width * C.width),
      t = Math.floor((t - o.top) / o.height * C.height);
    a ? (ft = n, gt[0] = b[0] = e, gt[1] = b[1] = t) : (gt[0] = b[0], gt[1] = b[1], ft = n, b[0] = e, b[1] = t)
  }

  function nn(e) {
    return 0 == e || 2 == e || 5 == e
  }

  function an(e) {
    var t = "Left-/Rightclick to choose a color!\n" + Ct[this.colorIndex];
    c.querySelector("#game-toolbar .colors").dataset.tooltip = t, i && (i.querySelector(".tooltip-content").textContent = E(We.dataset.tooltip))
  }

  function on(e) {
    var t, n;
    t = this.colorIndex, n = 0 == e.button, ((n = e.altKey ? !n : n) ? Wt : Ot)(t)
  }
  D(nt, "contextmenu", function(e) {
    return e.preventDefault(), !1
  }), D("#game-toolbar .sizes .size", "click", function(e) {
    var t;
    t = this.size.id, Rt((t = Mt[t]).element), It(t.size), Yt()
  }), D([C], "DOMMouseScroll wheel", function(e) {
    e.preventDefault();
    e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
    It(qt + 2 * e)
  }), ie("Swap", "S", "Swap the primary and secondary color.", Pt), D(nt.querySelector(".color-preview"), "click", function(e) {
    Pt()
  }), D(nt.querySelector(".color-preview-mobile"), "click", function(e) {
    nt.querySelector(".colors").classList.toggle("open")
  }), D(t, "click", function(e) {
    rt.classList.toggle("open")
  }), D(c, "keyup", function(e) {
    if ("Enter" == e.code) return _n[0].focus(), 0;
    if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != xt) return 0;
    for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < u.length; n++)
      if (u[n].key.toLowerCase() == t) {
        for (var a = 0; a < u[n].cb.length; a++) u[n].cb[a](u[n]);
        return void e.preventDefault()
      }
  }), D(C, "contextmenu", function(e) {
    return e.preventDefault(), !1
  });
  var rn = null;
  "PointerEvent" in h ? (D("#game-toolbar .colors * .color", "pointerenter", an), D("#game-toolbar .colors * .color", "pointerdown", on), D(C, "pointerdown", function(e) {
    var t, n, a, o;
    null == rn && nn(e.button) && (h.getSelection ? h.getSelection().removeAllRanges() : c.selection && c.selection.empty(), t = 1 == l.pressureSensitivity && "pen" == e.pointerType, n = e.clientX, a = e.clientY, o = -1, t && (o = (oe && e.pressure, e.pressure)), rn = e.pointerId, xt = e.button, C.setPointerCapture(e.pointerId), v.length, tn(n, a, o, !0), en(!0))
  }), D(C, "pointermove", function(e) {
    var t, n;
    rn !== e.pointerId || (() => {
      var e = performance.now();
      if (
        document.body.dataset.bypassFps !== 'true' &&e - sn < 1e3 / ln) return 1;
      sn = e
    })() || (t = 1 == l.pressureSensitivity && "pen" == e.pointerType, n = -1, tn(e.clientX, e.clientY, n = t ? (oe && e.pressure, e.pressure) : n, !1), en(!1))
  }), D(C, "pointerup pointercancel", function(e) {
    rn === e.pointerId && (cn != v.length && (cn = v.length, mt.push(cn)), rn = null, xt = -1, C.releasePointerCapture(e.pointerId))
  })) : (D("#game-toolbar .colors * .color", "mouseenter", an), D("#game-toolbar .colors * .color", "click", on), D(C, "mousedown", function(e) {
    nn(e.button) && (xt = e.button, v.length, tn(e.clientX, e.clientY, -1, !0), en(!0))
  }), D(c, "mousemove", function(e) {
    tn(e.clientX, e.clientY, -1, !1), en(!1)
  }), D(c, "mouseup", function(e) {
    -1 != xt && (cn != v.length && (cn = v.length, mt.push(cn)), xt = -1)
  }));
  let ln = 90;
  var S, sn = 0,
    cn = 0,
    dn = (setInterval(function() {
        var e, t, n;
        S && L.id == Z && M == x && 0 < (e = v.length - ut) && (t = ut + 8, n = v.slice(ut, t), S.emit("data", {
          id: Ia,
          data: n
        }), ut = Math.min(t, v.length),
        false &&console.log(`Sent ${n.length} commands. ${e} remaining.`))
      },
      document.body.dataset.bypassCommandRate === 'true' ? 0 :50), setInterval(function() {
      S && L.id == Z && M != x && ht < v.length && (Kt(Zt(v[ht]), v[ht]), ht++)
    }, 1), c.querySelector("#game-canvas .overlay")),
    un = c.querySelector("#game-canvas .overlay-content"),
    A = c.querySelector("#game-canvas .overlay-content .text"),
    hn = c.querySelector("#game-canvas .overlay-content .words"),
    pn = c.querySelector("#game-canvas .overlay-content .reveal"),
    I = c.querySelector("#game-canvas .overlay-content .result"),
    mn = c.querySelector("#game-canvas .overlay-content .room"),
    gn = -100,
    fn = 0,
    yn = void 0;

  function vn(e, a, o) {
    var r, i, l = gn,
      s = fn,
      c = e.top - l,
      d = e.opacity - s;
    Math.abs(c) < .001 && Math.abs(d) < .001 ? o && o() : (r = void 0, i = 0, yn = h.requestAnimationFrame(function e(t) {
      var n = t - (r = null == r ? t : r),
        t = (r = t, (i = Math.min(i + n, a)) / a),
        n = (n = t) < .5 ? .5 * ((e, t) => e * e * ((t + 1) * e - t))(2 * n, 1.2 * 1.5) : .5 * (((e, t) => e * e * ((t + 1) * e + t))(2 * n - 2, 1.2 * 1.5) + 2);
      gn = l + c * n, fn = s + t * t * (3 - 2 * t) * d, un.style.top = gn + "%", dn.style.opacity = fn, i == a ? o && o() : yn = h.requestAnimationFrame(e)
    }))
  }

  function bn(e) {
    e.classList.add("show")
  }
  /* TYPOMOD desc: add event handlers for typo features */
  document.addEventListener("joinPractice", () => {
    const data = typo.createFakeLobbyData();
    typo.messagePort.postMessage({ id: 10, data });
    //document.dispatchEvent(new CustomEvent("practiceJoined", {detail: data}));
    aa(data);
  });

  S = new Proxy({},{
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

  function Sn(e) {
    for (var t = 0; t < un.children.length; t++) un.children[t].classList.remove("show");
    switch (e.id) {
      case Q:
        bn(mn);
        break;
      case V:
        bn(A), A.textContent = E("Round $", e.data + 1);
        break;
      case K:
        bn(A), A.textContent = E("Waiting for players...");
        break;
      case F:
        bn(A), A.textContent = E("Game starting in a few seconds...");
        break;
      case X:
        bn(pn), pn.querySelector("p span.word").textContent = e.data.word, pn.querySelector(".reason").textContent = (e => {
          switch (e) {
            case H:
              return E("Everyone guessed the word!");
            case _:
              return E("The drawer left the game!");
            case B:
              return E("Time is up!");
            case G:
              return E("Drawer got skipped!");
            default:
              return "Error!"
          }
        })(e.data.reason);
        for (var n = pn.querySelector(".player-container"), a = (de(n), []), o = 0; o < e.data.scores.length; o += 3) {
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
          var l = $("player"),
            s = a[o],
            c = (l.appendChild($("name", s.name)), $("score", (0 < s.score ? "+" : "") + s.score));
          s.score <= 0 && c.classList.add("zero"), l.appendChild(c), n.appendChild(l)
        }
        break;
      case J:
        bn(I);
        for (var d = [I.querySelector(".podest-1"), I.querySelector(".podest-2"), I.querySelector(".podest-3"), I.querySelector(".ranks")], o = 0; o < 4; o++) de(d[o]);
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
                f = d[h],
                l = $("avatar-container"),
                y = (f.appendChild(l), $("border"));
              y.appendChild($("rank-place", "#" + (h + 1))), y.appendChild($("rank-name", m)), y.appendChild($("rank-score", E("$ points", g))), f.appendChild(y), 0 == h && l.appendChild($("trophy"));
              for (o = 0; o < p.length; o++) me(b = ue((s = p[o]).player.avatar, 0 == h), Ya(s.player)), b.style.left = 15 * -(p.length - 1) + 30 * o + "%",
                b.setAttribute("playerid", s.player.id),0 == h && (b.classList.add("winner"), b.style.animationDelay = -2.35 * o + "s"), l.appendChild(b)
            }
          }
          for (var v = Math.min(5, u[3].length), o = 0; o < v; o++) {
            var b, s = u[3][o],
              f = $("rank");
            me(b = ue(s.player.avatar, !1), Ya(s.player)), f.appendChild(b), f.appendChild($("rank-place", "#" + (s.rank + 1))), f.appendChild($("rank-name", s.player.name)),
              f.setAttribute("playerid", s.player.id), /*elemanchor*/ f.appendChild($("rank-score", E("$ points", s.player.score))), d[3].appendChild(f)
          }
          0 < u[0].length ? (L = u[0].map(function(e) {
            return e.player.name
          }).join(", "), I.querySelector(".winner-name").textContent = (0 < u[0].length ? L : "<user left>") + " ", I.querySelector(".winner-text").textContent = 1 == u[0].length ? E("is the winner!") : E("are the winners!")) : (I.querySelector(".winner-name").textContent = "", I.querySelector(".winner-text").textContent = E("Nobody won!"))
        } else I.querySelector(".winner-name").textContent = "", I.querySelector(".winner-text").textContent = E("Nobody won!");
        break;
      case j:
        if (e.data.words)
          if (bn(A), bn(hn), de(hn), An[ne.WORDMODE] == ae.COMBINATION) {
            A.textContent = E("Choose the first word");
            for (var S = e.data.words.length / 2, k = [], w = [], C = 0, o = 0; o < S; o++) {
              var q = $("word", e.data.words[o]),
                x = (q.index = o, $("word", e.data.words[o + S]));
              x.index = o, x.style.display = "none", x.style.animationDelay = .03 * o + "s", k.push(q), w.push(x), D(q, "click", function() {
                C = this.index;
                for (var e = 0; e < S; e++) k[e].style.display = "none", w[e].style.display = "";
                A.textContent = E("Choose the second word")
              }), D(x, "click", function() {
                ha([C, this.index])
              }), hn.appendChild(q), hn.appendChild(x)
            }
          } else {
            A.textContent = E("Choose a word");
            for (o = 0; o < e.data.words.length; o++) {
              var M = $("word", e.data.words[o]);
              M.index = o, D(M, "click", function() {
                ha(this.index)
              }), hn.appendChild(M)
            }
          }
        else {
          bn(A);
          var L = (s = O(e.data.id)) ? s.name : E("User"),
            L = (A.textContent = "", A.appendChild(ce("span", void 0, E("$ is choosing a word!", L))), ue(s
            && (A.setAttribute("playerid", s.id) || true) /*overlayanchor*/ ? s.avatar : [0, 0, 0, 0], e.data.id == R));
          s && me(L, Ya(s)), L.style.width = "2em", L.style.height = "2em", A.appendChild(L)
        }
    }
  }
  let kn = 0,
    wn = 1,
    Cn = 2,
    qn = 3,
    xn = 4,
    Mn = 5,
    Ln = 6;

  function Dn(e, t) {
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

  function $n() {
    this.context = null, this.gain = null, this.sounds = new Map, h.addEventListener("load", this.load.bind(this), !1)
  }
  $n.prototype.addSound = function(e, t) {
    this.sounds.set(e, new Dn(this, t))
  }, $n.prototype.loadSounds = function() {
    this.addSound(kn, "/audio/roundStart.ogg"), this.addSound(wn, "/audio/roundEndSuccess.ogg"), this.addSound(Cn, "/audio/roundEndFailure.ogg"), this.addSound(qn, "/audio/join.ogg"), this.addSound(xn, "/audio/leave.ogg"), this.addSound(Mn, "/audio/playerGuessed.ogg"), this.addSound(Ln, "/audio/tick.ogg")
  }, $n.prototype.playSound = function(e) {
    var t, n;
    null == this.context ? this.load() : "running" != this.context.state ? this.context.resume().then(function() {
      this.playSound(e)
    }) : null != this.context && 0 < l.volume && this.sounds.has(e) && (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.gain), n.start(0))
  }, $n.prototype.setVolume = function(e) {
    g[p].querySelector("#volume .title .icon").classList.toggle("muted", e <= 0), g[p].querySelector("#volume .volume-value").textContent = e <= 0 ? "Muted" : e + "%", this.gain && (this.gain.gain.value = e / 100)
  }, $n.prototype.load = function() {
    if (null == this.context) try {
      h.AudioContext = h.AudioContext || h.webkitAudioContext, this.context = new AudioContext, this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.setVolume(l.volume), console.log("AudioContext created."), this.loadSounds()
    } catch (e) {
      console.log("Error creating AudioContext.", e), this.context = null
    }
  };
  let k = 4,
    En = location.origin + "/api/play";
  K;
  var w = [],
    x = 0,
    R = -1,
    M = -1,
    An = [],
    L = {
      id: -1,
      time: 0,
      data: 0
    },
    In = -1,
    Rn = 0,
    Tn = void 0,
    T = new $n,
    N = void 0,
    Nn = !1,
    Wn = !1,
    On = c.querySelector("#game"),
    Pn = c.querySelector("#game-wrapper"),
    t = c.querySelector("#game-canvas .room"),
    Yn = c.querySelector("#game-players"),
    zn = c.querySelector("#game-players .players-list"),
    Un = c.querySelector("#game-players-footer"),
    Hn = (c.querySelector("#game-board"), c.querySelector("#game-bar"), c.querySelector("#game-round .text")),
    W = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")],
    Bn = (c.querySelector("#game-chat"), [c.querySelector("#game-chat form"), c.querySelector("#game-chat-input-mobile form")]),
    _n = [c.querySelector("#game-chat input"), c.querySelector("#game-chat-input-mobile input")],
    Gn = c.querySelector("#game-chat .chat-content"),
    Kn = c.querySelector("#home .container-name-lang input"),
    Fn = c.querySelector("#home .container-name-lang select"),
    Vn = c.querySelector("#home .panel .button-play"),
    jn = c.querySelector("#home .panel .button-create");
  let Zn = 11 == (Xn = new Date).getMonth() && 19 <= (Xn = Xn.getDate()) && Xn <= 26;
  var Xn = 9 == (Xn = new Date).getMonth() && 24 <= (Xn = Xn.getDate()) && Xn <= 31;

  function Jn(e) {
    Nn = e, c.querySelector("#load").style.display = e ? "block" : "none"
  }

  function Qn(e, t, n, a) {
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
          a && xe(ve, E("Servers are currently undergoing maintenance!") + "\n\r" + E("Please try again later!") + "\n\rStatus: " + e);
          break;
        default:
          a && xe(ve, E("An unknown error occurred ('$')", e) + "\n\r" + E("Please try again later!"))
      }
      n({
        success: !1,
        error: e
      })
    }, (r = new XMLHttpRequest).onreadystatechange = function() {
      4 == this.readyState && o(this.status, this.response)
    }, r.open("POST", e, !0), r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), r.send(t)
  }
  Zn;
  var ea = null;
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
          return c.getElementById("preroll")
        },
        AIP_COMPLETE: function(e) {
          ea()
        },
        AIP_REMOVE: function() {}
      })
    })
  } catch (e) {
    console.log("ad push failed: "), console.log(e)
  }

  function ta(t) {
    var e, n, a = !1;
    if (h.localStorageAvailable && (n = d.getItem("lastAd"), e = new Date, d.setItem("lastAd", e.toString()), null == n ? n = e : (n = new Date(Date.parse(n)), a = 1 <= Math.abs(n - e) / 1e3 / 60)), a) try {
      aiptag && adplayer && null != adplayer && "undefined" !== adplayer ? (ea = t, aiptag.cmd.player.push(function() {
        adplayer.startPreRoll()
      })) : t()
    } catch (e) {
      console.log(e), t()
    } else t()
  }

  function na(e, t, n) {
    T.context && T.context.resume && T.context.resume(), S && ua();
    var a, o = 0,
      r = {
        transports: ["websocket", "polling"],
        closeOnBeforeunload: !1
      };
    "URL" in h && "127.0.0.1" != (a = new URL(e)).hostname && "localhost" != a.hostname && (r.path = "/" + a.port + "/", e = a.protocol + "//" + a.hostname), (S = P(e, r)).on("connect", function() {
      /* TYPOMOD
                           desc: disconnect socket & leave lobby */
      document.addEventListener('socketEmit', event =>
        S.emit('data', { id: event.detail.id, data: event.detail.data })
      );

      typo.disconnect = () => {
        if (S) {
          S.typoDisconnect = true;
          S.on("disconnect", () => {
            typo.disconnect = undefined;
            document.dispatchEvent(new Event("leftLobby"));
          });
          S.off("data");
          S.reconnect = false;
          S.disconnect();
        } else {
          document.dispatchEvent(new Event("leftLobby"));
        }
      }
      S.on("data", data => typo.messagePort.postMessage(data));
      typo.messagePort.onmessage = data => S.emit("data", data.data);

      const originalEmit = S.emit.bind(S);
      S.emit = function(...event) {
        typo.emitPort.postMessage(event);

        const {data, id} = event[1];

        if(id === Ia){
          const events = [];
          const buffer = [];
          let sent = 0; /* to calculate correct undo offset */

          for(const command of data){
            const sequence = typo.msiColorSwitch.ensureColorSequence(command);
            if(sequence === undefined) buffer.push(command);
            else {
              if(buffer.length > 0) events.push({id: Ia, data: buffer});
              events.push({id: Ia, data: sequence});
              events.push({id: Ta, data: ut + sent});
              buffer.push(command);
            }
          }

          if(buffer.length > 0) events.push({id: Ia, data: buffer});

          for(event of events){
            originalEmit("data", event);
          }
        }

        else {
          originalEmit(...event) /* replace recursion prevention */;
        }
      };
      /* TYPOEND */
      Jn(!1), S.on("joinerr", function(e) {
        ua(), xe(ve, (e => {
          switch (e) {
            case 1:
              return E("Room not found!");
            case 2:
              return E("Room is full!");
            case 3:
              return E("You are on a kick cooldown!");
            case 4:
              return E("You are banned from this room!");
            case 5:
              return E("You are joining rooms too quickly!");
            case 100:
              return E("You are already connected to this room!");
            case 200:
              return E("Too many users from your IP are connected to this room!");
            case 300:
              return E("You have been kicked too many times!");
            default:
              return E("An unknown error ('$') occured!", e)
          }
        })(e))
      }), S.on("data", Pa);
      var e = Kn.value.split("#"),
        e = {
          join: t,
          create: n ? 1 : 0,
          name: e[0],
          lang: Fn.value,
          code: e[1],
          avatar: l.avatar
        };
      S.emit("login", e)
    }), S.on("reason", function(e) {
      o = e
    }), S.on("disconnect", function(e) {
      /* TYPOMOD
                       DESC: no msg if disconnect intentionally */
      if(!S.typoDisconnect)
        /*TYPOEND*/
        switch (console.log("socket disconnect: " + e), o) {
          case ee:
            xe(be, E("You have been kicked!"));
            break;
          case te:
            xe(be, E("You have been banned!"));
            break;
          default:
            xe(be, E("Connection lost!") + "\n" + e)
        }
      ua()
    }), S.on("connect_error", function(e) {
      ua(), Jn(!1), xe(ve, e.message)
    })
  }

  function aa(e) {
    T.playSound(qn), Nt(Je, !0), It(12), Wt(1), Ot(0), Ft(!0), de(Gn), c.querySelector("#home").style.display = "none", c.querySelector("#game").style.display = "flex", x = e.me, In = e.type, Tn = e.id, c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, An = e.settings, oa(), de(zn), w = [];
    for (var t = 0; t < e.users.length; t++) za(e.users[t], !1);
    Ga(), Ka(), ia(e.round), fa(e.owner), sa(e.state, !0), Wn || (setTimeout(function() {
      try {
        (adsbygoogle = h.adsbygoogle || []).push({}), (adsbygoogle = h.adsbygoogle || []).push({})
      } catch (e) {
        console.log("google ad request failed"), console.log(e)
      }
    }, 1500), Wn = !0)
  }

  function oa() {
    ia(Rn);
    for (var e, t = 0; t < ja.length; t++) {
      var n = ja[t];
      n.index && (e = An[(n = n).index], "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
    }
  }

  function ra(e, t, n) {
    An[e] = t, n && S && S.emit("data", {
      id: xa,
      data: {
        id: e,
        val: t
      }
    }), oa()
  }

  function ia(e) {
    var e = (Rn = e) + 1,
      t = An[ne.ROUNDS];
    Hn.textContent = E("Round $ of $", [e, t])
  }

  function la() {
    for (var e = 0; e < w.length; e++) w[e].score = 0;
    for (e = 0; e < w.length; e++) Fa(w[e], !1), Va(w[e], !1);
    Ka()
  }

  function sa(e, t) {
    var n, a;
    if (n = L = e, null != yn && (h.cancelAnimationFrame(yn), yn = void 0), n.id == Z ? vn({
      top: -100,
      opacity: 0
    }, 600, function() {
      dn.classList.remove("show")
    }) : dn.classList.contains("show") ? vn({
      top: -100,
      opacity: 1
    }, 600, function() {
      Sn(n), vn({
        top: 0,
        opacity: 1
      }, 600)
    }) : (dn.classList.add("show"), Sn(n), vn({
      top: 0,
      opacity: 1
    }, 600)), a = e.time, oo(), ro(a), no = setInterval(function() {
      ro(Math.max(0, ao - 1));
      var e = -1;
      L.id == Z && (e = Qa), L.id == j && (e = eo), to.style.animationName = ao < e ? ao % 2 == 0 ? "rot_left" : "rot_right" : "none", ao < e && T.playSound(Ln), ao <= 0 && oo()
    }, 1e3), Pn.classList.add("toolbar-hidden"), vt(), da(!1), e.id == Q ? (la(), Pn.classList.add("room")) : Pn.classList.remove("room"), e.id == V && (ia(e.data), 0 == e.data) && la(), e.id == X) {
      x != M && ga(e.data.word);
      for (var o = 0; o < e.data.scores.length; o += 3) {
        var r = e.data.scores[o + 0],
          i = e.data.scores[o + 1];
        e.data.scores[o + 2];
        (c = O(r)) && (c.score = i)
      }
      Ka();
      for (var l = !0, o = 0; o < w.length; o++)
        if (w[o].guessed) {
          l = !1;
          break
        } l ? T.playSound(Cn) : T.playSound(wn), y(E("The word was '$'", e.data.word), "", f(Ee), !0)
      /* TYPOMOD
                   desc: log finished drawing */
      ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
      /* TYPOEND */
    } else e.id != Z && (W[0].textContent = E("WAITING"), W[0].classList.add("waiting"), W[1].style.display = "none", W[2].style.display = "none");
    if (e.id == Z) {
      if (M = e.data.id,
        typo.msi.reset(),
        typo.msiColorSwitch.currentCode = undefined,T.playSound(kn), Ft(!0), e.data.drawCommands && (v = e.data.drawCommands), y(E("$ is drawing now!", O(M).name), "", f($e), !0), !t)
        for (o = 0; o < w.length; o++) Fa(w[o], !1);
      W[0].classList.remove("waiting"), M == x ? (a = e.data.word, W[0].textContent = E("DRAW THIS"), W[1].style.display = "", W[2].style.display = "none", W[1].textContent = a, Pn.classList.remove("toolbar-hidden"), vt()) : (da(!0), pa(e.data.word, !1), ma(e.data.hints))
    } else {
      M = -1;
      for (o = 0; o < w.length; o++) Fa(w[o], !1)
    }
    if (e.id == J && 0 < e.data.length) {
      for (var s = [], i = 0, o = 0; o < e.data.length; o++) {
        var c, d = e.data[o][0],
          u = e.data[o][1];
        (c = O(d)) && 0 == u && (i = c.score, s.push(c.name))
      }
      1 == s.length ? y(E("$ won with a score of $!", [s[0], i]), "", f(Ie), !0) : 1 < s.length && y(E("$ and $ won with a score of $!", [s.slice(0, -1).join(", "), s[s.length - 1], i]), "", f(Ie), !0)
    }
    for (o = 0; o < w.length; o++) Va(w[o], w[o].id == M);
    Ga()
  }

  function ca(e) {
    S && S.connected && L.id == Z && (S.emit("data", {
      id: Sa,
      data: e
    }), da(!1))
  }

  function da(e) {
    c.querySelector("#game-rate").style.display = e ? "" : "none"
  }

  function ua() {
    console.log("lobby left"), S && S.close(), Ft(!(S = void 0)), oo(), w = [], An = [], L = {
      id: M = R = -1,
      time: x = 0,
      data: 0
    }, c.querySelector("#home").style.display = "", c.querySelector("#game").style.display = "none"
  }

  function ha(e) {
    S && S.connected && L.id == j && S.emit("data", {
      id: Aa,
      data: e
    })
  }

  function pa(e, t) {
    for (var n = e.length - 1, a = 0; a < e.length; a++) n += e[a];
    var o = !t && 1 == An[ne.WORDMODE];
    o && (n = 3), W[0].textContent = E(o ? "WORD HIDDEN" : "GUESS THIS"), W[1].style.display = "none", W[2].style.display = "", de(W[2]), W[2].hints = [];
    for (a = 0; a < n; a++) W[2].hints[a] = $("hint", o ? "?" : "_"), W[2].appendChild(W[2].hints[a]);
    o || W[2].appendChild($("word-length", e.join(" ")))
  }

  function ma(e) {
    for (var t = W[2].hints, n = 0; n < e.length; n++) {
      var a = e[n][0],
        o = e[n][1];
      t[a].textContent = o, t[a].classList.add("uncover")
    }
  }

  function ga(e) {
    (!W[2].hints || W[2].hints.length < e.length) && pa([e.length], !0);
    for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
    ma(t)
  }

  function fa(e) {
    R = e;
    for (var t = 0; t < w.length; t++) pe(w[t].element, w[t].id == R), Ba(w[t], 0, w[t].id == R);
    var n = x != R;
    c.querySelector("#button-start-game").disabled = n;
    for (var a = 0; a < ja.length; a++) ja[a].element.disabled = n;
    e = O(R);
    e && y(E("$ is now the room owner!", e.name), "", f(Ie), !0)
  }
  let ya = 1,
    va = 2,
    ba = 5,
    Sa = 8,
    ka = 9,
    wa = 90,
    Ca = 10,
    qa = 11,
    xa = 12,
    Ma = 13,
    La = 14,
    Da = 15,
    $a = 16,
    Ea = 17,
    Aa = 18,
    Ia = 19,
    Ra = 20,
    Ta = 21,
    Na = 30,
    Wa = 31,
    Oa = 32;

  function Pa(e) {
    var t = e.id,
      n = e.data;
    switch (t) {
      case Ca:
        /* TYPOMOD
                         desc: send lobbydata*/
        document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: n }));
        /* TYPOEND*/
        aa(n);
        break;
      case qa:
        sa(n);
        break;
      case xa:
        ra(n.id, n.val, !1);
        break;
      case Ma:
        ma(n);
        break;
      case La:
        ro(n);
        break;
      case ya:
        var a = za(n, !0);
        Ka(), a.joinTimeout = setTimeout(() => {
          y(E("$ joined the room!", a.name), "", f(Ee), !0), T.playSound(qn), a.joinTimeout = void 0
        }, 0 == In ? 1e3 : 0);
        break;
      case ka:
        (a = O(n.id)) && (a.avatar = n.avatar, he(a.element.avatar, a.avatar));
        break;
      case wa:
        (a = O(n.id)) && (a.name = n.name, a.element.querySelector(".player-name").textContent = n.name);
        break;
      case va:
        (a = (e => {
          for (var t = 0; t < w.length; t++) {
            var n = w[t];
            if (n.id == e) return w.splice(t, 1), n.element.remove(), Ka(), Ga(), n
          }
        })(n.id)) && (null == a.joinTimeout ? (y(((e, t) => {
          switch (e) {
            default:
              return E("$ left the room!", t);
            case ee:
              return E("$ has been kicked!", t);
            case te:
              return E("$ has been banned!", t)
          }
        })(n.reason, a.name), "", f(Ae), !0), T.playSound(xn)) : (clearTimeout(a.joinTimeout), a.joinTimeout = void 0), n.id != M || n.reason != ee && n.reason != te || Ft(!0));
        break;
      case ba:
        var o = O(n[0]),
          r = O(n[1]),
          i = n[2],
          l = n[3];
        o && r && y(E("$ is voting to kick $ ($/$)", [o.name, r.name, i, l]), "", f(De), !0);
        break;
      case Da:
        (a = O(n.id)) && (y(E("$ guessed the word!", a.name), "", f(Ee), !0).classList.add("guessed"), Fa(a, !0), T.playSound(Mn), n.id == x) && ga(n.word);
        break;
      case Sa:
        (a = O(n.id)) && (o = a, r = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (i = $("icon")).style.backgroundImage = "url(/img/" + r + ")", r = Ha(o, i).getBoundingClientRect(), o = .9 * (r.bottom - r.top), i.style.width = o + "px", i.style.height = o + "px", n.vote ? y(E("$ liked the drawing!", a.name), "", f(Ee), !0) : y(E("$ disliked the drawing!", a.name), "", f(Ae), !0));
        break;
      case Ea:
        fa(n);
        break;
      case $a:
        y(E("$ is close!", n), "", f(De), !0);
        break;
      case Na:
        Ua(O(n.id), n.msg);
        break;
      case Oa:
        y(E("Spam detected! You're sending messages too quickly."), "", f(Ae), !0);
        break;
      case Wa:
        switch (n.id) {
          case 0:
            y(E("You need at least 2 players to start the game!"), "", f(Ae), !0);
            break;
          case 100:
            y(E("Server restarting in about $ seconds!", n.data), "", f(Ae), !0)
        }
        break;
      case Ia:
        for (var s = 0; s < n.length; s++)
          n[s] = typo.msi.processIncomingCommand(n[s]), n[s] !== undefined && jt(n[s]);
        break;
      case Ra:
        Ft(!0);
        break;
      case Ta:
        Bt(n);
        break;
      default:
        return void console.log("Unimplemented data packed received with id " + t)
    }
  }

  function O(e) {
    for (var t = 0; t < w.length; t++) {
      var n = w[t];
      if (n.id == e) return n
    }
  }

  function Ya(e) {
    return (e.flags & k) == k ? ["glow", "hue-rotate"] : []
  }

  function za(e, t) {
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
      e = (w.push(n), n.id == x ? E("$ (You)", n.name) : n.name),
      a = (n.flags & k) == k,
      o = (a && n.element.classList.add("admin"), $("player-background")),
      r = (n.element.appendChild(o), a ? 1 : -1);
    if (1 == r)
      for (var i = 0; i < 7; i++) o.appendChild($("background-bubble"));
    if (2 == r)
      for (i = 0; i < 3; i++) o.appendChild($("background-wave"));
    var r = $("player-avatar-container"),
      l = ue(n.avatar),
      r = (n.element.drawing = $("drawing"), (n.element.avatar = l).appendChild(n.element.drawing), r.appendChild(l), n.element.appendChild(r), zn.appendChild(n.element), me(l, Ya(n)), $("player-info")),
      l = $("player-name", e),
      e = (n.id == x && l.classList.add("me"), r.appendChild(l), r.appendChild($("player-rank", "#" + n.rank)), r.appendChild($("player-score", E("$ points", n.score))), a && r.appendChild($("player-tag", "ADMIN")), n.element.appendChild(r), D(n.element, "click", function() {
        N = n, xe(s, n)
      }), $("player-icons")),
      l = $("icon owner"),
      a = $("icon muted");
    /* TYPOMOD
             desc: set ID to player to identify */
    n.element.setAttribute("playerid", n.id);
    /* TYPOEND */
    return e.appendChild(l), e.appendChild(a), n.element.appendChild(e), n.element.icons = [l, a], Fa(n, n.guessed), t && Ga(), n
  }

  function Ua(e, t) {
    var n, a, o;
    !e.muted && (o = ((a = O(x)).flags & k) == k, n = e.id == M || e.guessed, x == M || a.guessed || !n || o) && (a = (e.flags & k) == k, o = Le, n && (o = Re), a && (o = Ae), Ha(e, $("text", t)), y(e.name, t, f(o), !1)
      .setAttribute("playerid", e.id))
  }

  function Ha(e, t) {
    e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
    var n = $("player-bubble"),
      a = $("content");
    return a.appendChild(t), n.appendChild($("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function() {
      e.bubble.remove(), e.bubble = void 0
    }, 1500), n
  }

  function Ba(e, t, n) {
    n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
  }
  var _a = void 0;

  function Ga() {
    L.id, Q;
    for (var e = getComputedStyle(Pn).getPropertyValue("--PLAYERS_PER_PAGE"), t = (e <= 0 && (t = Math.max(48, Yn.clientHeight), e = Math.floor(t / 48)), Math.ceil(w.length / e)), n = 0; n < w.length; n++) w[n].page = Math.floor(n / e);
    null == _a ? _a = ge(Un, t, [Yn], function(e, t, n) {
      for (var a = [], o = 0; o < w.length; o++) {
        var r = (i = w[o]).page == t;
        i.element.style.display = r ? "" : "none", r && a.push(i.element)
      }
      if (0 < a.length) {
        for (var i, o = 0; o < a.length; o++)(i = a[o]).classList.remove("first"), i.classList.remove("last"), o % 2 == 0 ? i.classList.remove("odd") : i.classList.add("odd");
        a[0].classList.add("first"), a[a.length - 1].classList.add("last")
      }
    }) : fe(_a, t), _a.element.style.display = 1 < t ? "" : "none"
  }

  function Ka() {
    for (var e = [], t = 0; t < w.length; t++) e.push(w[t]);
    e.sort(function(e, t) {
      return t.score - e.score
    });
    for (var n, a, o = 1, t = 0; t < e.length; t++) {
      var r = e[t];
      a = o, (n = r).rank = a, n.element.querySelector(".player-score").textContent = E("$ points", n.score), (n = n.element.querySelector(".player-rank")).textContent = "#" + a, n.classList.remove("first"), n.classList.remove("second"), n.classList.remove("third"), 1 == a && n.classList.add("first"), 2 == a && n.classList.add("second"), 3 == a && n.classList.add("third"), t < e.length - 1 && r.score > e[t + 1].score && o++
    }
  }

  function Fa(e, t) {
    (e.guessed = t) ? e.element.classList.add("guessed"): e.element.classList.remove("guessed")
  }

  function Va(e, t) {
    e.element.drawing.style.display = t ? "block" : "none"
  }
  for (var ja = [], Za = t.querySelectorAll('*[id^="item-"]'), Xa = 0; Xa < Za.length; Xa++) {
    var Ja = {
      id: Za[Xa].id.replace("item-settings-", ""),
      element: Za[Xa],
      index: Za[Xa].dataset.setting
    };
    Za[Xa].item = Ja, ja.push(Ja), D(Za[Xa].item.element, "change", function() {
      var e = this.value;
      "checkbox" == this.type && (e = this.checked ? 1 : 0), null != this.item.index && ra(this.item.index, e, !0)
    })
  }
  let Qa = 10,
    eo = 4;
  var to = c.querySelector("#game-clock .text"),
    no = null,
    ao = 0;

  function oo() {
    no && (clearInterval(no), no = null)
  }

  function ro(e) {
    ao = e, to.textContent = ao
  }
  var io, lo = (t = c.querySelector("#tutorial")).querySelectorAll(".page"),
    so = ge(t.querySelector(".navigation"), lo.length, [t.querySelector(".pages")], function(e, t, n) {
      n && clearInterval(co);
      for (var a = 0; a < lo.length; a++) lo[a].classList.remove("active");
      lo[t].classList.add("active")
    }),
    co = setInterval(function() {
      so.selected < 4 ? ye(so, so.selected + 1, !1) : ye(so, 0, !1)
    }, 3500),
    t = c.querySelector("#game-settings");

  function uo() {
    var e;
    e = h.visualViewport ? h.visualViewport.height : h.innerHeight, "virtualKeyboard" in navigator && (e -= navigator.virtualKeyboard.boundingRect.height), c.documentElement.style.setProperty("--vh", e + "px")
  }

  function ho() {
    uo(), Ga()
  }

  function po() {
    var e = "top" == l.mobileChatLayout;
    On.classList.toggle("mobile-input-top", e)
  }

  function mo(e, t) {
    e = e.querySelector(".characters");
    0 == (e.textContent = t) ? e.classList.remove("visible") : e.classList.add("visible")
  }
  c.querySelector("#audio"), c.querySelector("#lightbulb"), D(t, "click", function() {
    xe(p)
  }), "virtualKeyboard" in navigator && (navigator.virtualKeyboard.overlaysContent = !0, navigator.virtualKeyboard.addEventListener("geometrychange", e => {
    uo()
  })), h.visualViewport ? (D(h.visualViewport, "resize", ho), oe && D(h.visualViewport, "scroll", ho)) : D(h, "resize", ho), h.onunload = function() {
    S && ua()
  }, D(c, "PointerEvent" in h ? "pointerdown" : "click", function(e) {
    if (e.target == m) return Me(), e.preventDefault(), !1;
    He.elements.main.contains(e.target) ? e.preventDefault() : ("1" == ze.value && _n[1].blur(), c.querySelector("#game-toolbar .sizes").contains(e.target) || Yt(), e.target != c.querySelector("#game-toolbar .color-preview-mobile") && it.classList.remove("open"))
  }), D([Kn, Fn], "change", se), D(Vn, "click",
    typo.joinLobby = function() {
      var t, e, n, a, o;
      n = h.location.href,
        typo.lastConnect = Date.now(), o = "", n = n.split("?"), t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o, Nn || (e = "" != t ? "id=" + t : "lang=" + Fn.value, Me(), Jn(!0), ta(function() {
        Qn(En, e, function(e) {
          Jn(!1), e.success && na(e.data, t)
        }, !0)
      }))
    }), D(jn, "click", function() {
    Nn || (Me(), Jn(!0), ta(function() {
      Qn(En, "lang=" + Fn.value, function(e) {
        e.success ? na(e.data, 0, 1) : Jn(!1)
      }, !0)
    }))
  }), D(c.querySelector("#game-rate .like"), "click", function() {
    ca(1)
  }), D(c.querySelector("#game-rate .dislike"), "click", function() {
    ca(0)
  }), D(c.querySelector("#button-start-game"), "click", function() {
    if (S) {
      var e = c.querySelector("#item-settings-customwords").value.split(","),
        t = "";
      if (5 <= e.length) {
        for (var n = 0; n < e.length; n++) e[n] = e[n].trim();
        t = e.join(",")
      }
      S.emit("data", {
        id: 22,
        data: t
      })
    }
  }), D([c.querySelector("#button-invite"), c.querySelector("#modal-player-button-invite")], "click", function() {
    y(E("Copied room link to clipboard!"), "", f(De), !0);
    var e = "https://skribbl.io/?" + Tn;
    if (navigator.clipboard) navigator.clipboard.writeText(e).then(function() {
      console.log("Async: Copying to clipboard was successful!")
    }, function(e) {
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
  }), D(g[s].querySelector("button.kick"), "click", function() {
    Me(), null != N && N.id != x && S && S.emit("data", {
      id: 3,
      data: N.id
    })
  }), D(g[s].querySelector("button.ban"), "click", function() {
    Me(), null != N && N.id != x && S && S.emit("data", {
      id: 4,
      data: N.id
    })
  }), D(g[s].querySelector("button.votekick"), "click", function() {
    Me(), null != N && N.id != x && S && (N.id == R ? y(E("You can not votekick the lobby owner!"), "", f(Ae), !0) : S.emit("data", {
      id: ba,
      data: N.id
    }))
  }), D(g[s].querySelector("button.mute"), "click", function() {
    null != N && N.id != x && (N.muted = !N.muted, Ba(N, 1, N.muted), N.muted ? y(E("You muted '$'!", N.name), "", f(Ae), !0) : y(E("You unmuted '$'!", N.name), "", f(Ae), !0), S && S.emit("data", {
      id: 7,
      data: N.id
    }), qe(N.muted))
  }), D(g[s].querySelector("button.report"), "click", function() {
    g[s].querySelector(".buttons").style.display = "none", g[s].querySelector(".player").style.display = "none", g[s].querySelector(".report-menu").style.display = "";
    for (var e = g[s].querySelectorAll(".report-menu input"), t = 0; t < e.length; t++) e[t].checked = !1
  }), D(g[s].querySelector("button#report-send"), "click", function() {
    var e = 0;
    g[s].querySelector("#report-reason-toxic").checked && (e |= 1), g[s].querySelector("#report-reason-spam").checked && (e |= 2), g[s].querySelector("#report-reason-bot").checked && (e |= 4), 0 < e && (null != N && N.id != x && (N.reported = !0, S && S.emit("data", {
      id: 6,
      data: {
        id: N.id,
        reasons: e
      }
    }), y(E("Your report for '$' has been sent!", N.name), "", f(De), !0)), Me())
  }), D(g[p].querySelector("#volume input"), "change", function(e) {
    l.volume = e.target.value, T.setVolume(l.volume), T.playSound(Mn), se()
  }), D(g[p].querySelector("#select-pressure-sensitivity"), "change", function(e) {
    l.pressureSensitivity = e.target.value, se()
  }), D(g[p].querySelector("#select-mobile-chat-input"), "change", function(e) {
    l.mobileChatLayout = e.target.value, po(), se()
  }), D(g[p].querySelector("button.reset"), "click", function() {
    for (var e = 0; e < u.length; e++) {
      var t = u[e];
      t.key = t.def, t.listing.querySelector("input").value = t.key;
      for (var n = 0; n < t.changed.length; n++) t.changed[n](t)
    }
    le()
  }), D(_n[1], "focus", function(e) {
    function t(e) {
      h.removeEventListener("scroll", t), h.scroll(0, 0), e.preventDefault()
    }
    uo(), On.classList.add("mobile-input-focus"), oe && (h.addEventListener("scroll", t), setTimeout(function() {
      t(e)
    }, 200), e.preventDefault())
  }), D(_n[1], "blur", function(e) {
    uo(), On.classList.remove("mobile-input-focus")
  }), D(_n, "input", function(e) {
    mo(this.parentNode, this.value.length)
  }), D(Bn, "submit", function(e) {
    const input = this.querySelector("input"); let rest = input.value.substring(100);
    input.value = input.value.substring(0,100);
    if(rest.length > 0) setTimeout(()=>{input.value = rest; this.dispatchEvent(new Event("submit"));},180);
    e.preventDefault();
    var e = this.querySelector("input");
    return e.value && (e = e.value, S && S.connected ? S.emit("data", {
      id: Na,
      data: e
    }) : Ua(O(x), e)), this.reset(), mo(this, 0), !1
  }), uo(), h.localStorageAvailable ? (Kn.value = a("name", ""), Fn.value = (e => {
    for (var t = c.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
      if (t[n].value == e) return t[n].value;
    return 0
  })(a("lang", 0)), l.displayLang = a("displaylang", "en"), l.volume = parseInt(a("volume", 100)), l.filterChat = 1 == parseInt(a("filter", 1)) ? 1 : 0, l.pressureSensitivity = 1 == parseInt(a("pressure", 1)) ? 1 : 0, l.avatar = (t = "ava", Vn = l.avatar, null == (t = d.getItem(t)) ? Vn : JSON.parse(t)), l.mobileChatLayout = a("mobileChatLayout", "bottom"), ze.value = a("keyboard", oe ? 1 : 0), Ue.value = a("keyboardlayout", "en"), _e(), g[p].querySelector("#select-mobile-chat-input").value = l.mobileChatLayout, g[p].querySelector("#volume input").value = l.volume, T.setVolume(l.volume), po(), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
  for (var go = c.querySelectorAll("[data-translate]"), fo = 0; fo < go.length; fo++) {
    var yo = go[fo];
    je(yo, yo.dataset.translate)
  }
  for (var vo = Ke[l.displayLang], bo = 0; bo < Fe.length; bo++) {
    var So = Fe[bo],
      ko = Ve(vo, So.key);
    "text" == So.type && (So.element.textContent = ko), "placeholder" == So.type && (So.element.placeholder = ko)
  }

  function wo(e) {
    io.parts[e].classList.remove("bounce"), io.parts[e].offsetWidth, io.parts[e].classList.add("bounce")
  }
  D(jn = c.querySelectorAll("[data-tooltip]"), "pointerenter", function(e) {
    Oe(e.target)
  }), D(jn, "pointerleave", function(e) {
    Pe()
  }), Vn = (Bn = c.querySelector("#home .avatar-customizer")).querySelector(".container"), t = Bn.querySelectorAll(".arrows.left .arrow"), jn = Bn.querySelectorAll(".arrows.right .arrow"), Bn = Bn.querySelectorAll(".randomize"), (io = ue(l.avatar)).classList.add("fit"), Vn.appendChild(io), D(t, "click", function() {
    var e = parseInt(this.dataset.avatarIndex);
    --l.avatar[e], l.avatar[e] < 0 && (l.avatar[e] = n[e] - 1), wo(e), he(io, l.avatar), se()
  }), D(jn, "click", function() {
    var e = parseInt(this.dataset.avatarIndex);
    l.avatar[e] += 1, l.avatar[e] >= n[e] && (l.avatar[e] = 0), wo(e), he(io, l.avatar), se()
  }), D(Bn, "click", function() {
    l.avatar[0] = Math.floor(Math.random() * n[0]), l.avatar[1] = Math.floor(Math.random() * n[1]), l.avatar[2] = Math.floor(Math.random() * n[2]), wo(1), wo(2), he(io, l.avatar), se()
  });
  for (var Co = Math.round(8 * Math.random()), qo = c.querySelector("#home .logo-big .avatar-container"), xo = 0; xo < 8; xo++) {
    var Mo = [0, 0, 0, -1],
      Mo = (Mo[0] = xo, Mo[1] = Math.round(100 * Math.random()) % z, Mo[2] = Math.round(100 * Math.random()) % U, 100 * Math.random() < 1 && (Mo[3] = Math.floor(20 * Math.random())), Zn && 100 * Math.random() < 35 && (Mo[3] = 96 + Math.floor(4 * Math.random())), ue(Mo, Co == xo));
    Mo.index = xo, qo.appendChild(Mo), D(Mo, "click", function() {
      var e = [this.index, 0, 0, -1];
      e[1] = Math.round(100 * Math.random()) % z, e[2] = Math.round(100 * Math.random()) % U, 1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())), he(this, e), this.classList.remove("clicked"), this.offsetWidth, this.classList.add("clicked")
    })
  }
  Xn && (c.documentElement.dataset.halloween = "")
  ;document.dispatchEvent(new Event("skribblInitialized")); document.body.setAttribute("typo-skribbl-loaded", "true");
})(window, document, localStorage, io);