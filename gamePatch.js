!function(u, s, c, z) {
    const H = 26
      , U = 57
      , F = 51
      , G = [H, U, F]
      , B = 0
      , K = 1
      , _ = 2
      , V = 0
      , X = 1
      , Z = 2
      , j = 3
      , J = 4
      , Q = 5
      , ee = 6
      , te = 7;
    const ne = 1
      , ae = 2
      , oe = {
        LANG: 0,
        SLOTS: 1,
        DRAWTIME: 2,
        ROUNDS: 3,
        WORDCOUNT: 4,
        HINTCOUNT: 5,
        WORDMODE: 6,
        CUSTOMWORDSONLY: 7
    }
      , re = {
        NORMAL: 0,
        HIDDEN: 1,
        COMBINATION: 2
    }
// TYPOMOD 
    // desc: create re-useable functions
    , typo = {
        joinLobby: undefined,        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input -> Yn
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> l
            return { id: id, name: name.length != 0 ? name : (Yn.value.split("#")[0] != "" ? Yn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? l.avatar : avatar, score: score, guessed: guessed };
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
            let abort=false; document.addEventListener("abortJoin", () => abort = true); document.addEventListener("joinLobby", (e) => {
                let timeoutdiff = Date.now() - typo.lastConnect;
                //Xn(true);
                setTimeout(() => {
                    if(abort) return; typo.lastConnect = Date.now();
                    //Hn.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                    //##PRIVATELBBY## = !1 // IDENTIFY: x:  = !1   
                    if(e.detail) window.history.pushState({path:window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);////##JOINLOBBY##(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                    typo.joinLobby(); window.history.pushState({path:window.location.origin}, '', window.location.origin);//Fn(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 1800 ? 1800 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else na() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = xt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
                let code = match >= 0 ? match : e.detail.code;
                if (e.detail.secondary) Ot(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                else Nt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
            });
            document.addEventListener("performDrawCommand", (e) => {
                x.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                Bt(Xt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
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
    // TYPOEND
      , ie = ["Normal", "Hidden", "Combination"]
      , le = ["English", "German", "Bulgarian", "Czech", "Danish", "Dutch", "Finnish", "French", "Estonian", "Greek", "Hebrew", "Hungarian", "Italian", "Japanese", "Korean", "Latvian", "Macedonian", "Norwegian", "Portuguese", "Polish", "Romanian", "Russian", "Serbian", "Slovakian", "Spanish", "Swedish", "Tagalog", "Turkish"];
    if (u.localStorageAvailable = !1,
    void 0 !== c)
        try {
            c.setItem("feature_test", "yes"),
            "yes" === c.getItem("feature_test") && (c.removeItem("feature_test"),
            u.localStorageAvailable = !0)
        } catch (e) {}
    var d = [];
    function se(t) {
        for (let e = 0; e < d.length; e++)
            if (d[e].name == t)
                return d[e]
    }
    function ce(t, n, a, e, o) {
        var r = n;
        u.localStorageAvailable && (l = c.getItem("hotkey_" + t)) && (n = l);
        let i = se(t);
        if (i)
            i.key = n,
            i.def = r,
            i.desc = a;
        else {
            i = {
                name: t,
                desc: a,
                key: n,
                def: r,
                listing: v("item"),
                changed: [],
                cb: []
            },
            d.push(i);
            var l = v("key", i.name);
            Xe(l, "text"),
            i.listing.appendChild(l);
            let e = s.createElement("input");
            e.value = i.key,
            i.listing.appendChild(e),
            y(e, "keydown", function(t) {
                var n = t.key;
                for (let e = 0; e < d.length; e++)
                    if (d[e].key == n)
                        return void t.preventDefault();
                e.value = n,
                i.key = n;
                for (let e = 0; e < i.changed.length; e++)
                    i.changed[e](i);
                return de(),
                t.preventDefault(),
                !1
            }),
            f[p].querySelector("#hotkey-list").appendChild(i.listing)
        }
        return e && i.cb.push(e),
        o && i.changed.push(o),
        i
    }
    function de() {
        if (u.localStorageAvailable)
            for (let e = 0; e < d.length; e++)
                u.localStorage.setItem("hotkey_" + d[e].name, d[e].key)
    }
    var l = {
        avatar: [Math.round(100 * Math.random()) % H, Math.round(100 * Math.random()) % U, Math.round(100 * Math.random()) % F, -1],
        volume: 100,
        dark: 0,
        filterChat: 1,
        pressureSensitivity: 1,
        displayLang: "en",
        undefined
    };
    function e(e, t) {
        e = c.getItem(e);
        return null == e ? t : e
    }
    function n() {
        u.localStorageAvailable ? (c.setItem("name", Yn.value),
        c.setItem("lang", zn.value),
        c.setItem("displaylang", l.displayLang),
        c.setItem("volume", l.volume),
        c.setItem("dark", 1 == l.dark ? 1 : 0),
        c.setItem("filter", 1 == l.filterChat ? 1 : 0),
        c.setItem("pressure", 1 == l.pressureSensitivity ? 1 : 0),
        c.setItem("ava", JSON.stringify(l.avatar)),
        c.setItem("keyboard", He.value),
        c.setItem("keyboardlayout", Ue.value),
        console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
    }
    function y(e, t, n) {
        for (var a, o = e, r = ("string" == typeof e ? o = s.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]),
        t.split(" ")), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++)
                o[i].addEventListener(r[l], n)
    }
    function v(e, t) {
        let n = s.createElement("div");
        if (void 0 !== e)
            for (var a = e.split(" "), o = 0; o < a.length; o++)
                n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t),
        n
    }
    function ue(e, t, n) {
        let a = s.createElement(e);
        if (void 0 !== t)
            for (var o = t.split(" "), r = 0; r < o.length; r++)
                a.classList.add(o[r]);
        return void 0 !== n && (a.textContent = n),
        a
    }
    function b(e) {
        for (; e.firstChild; )
            e.removeChild(e.firstChild)
    }
    function he(e, t, n) {
        var a = v("avatar")
          , o = v("color")
          , r = v("eyes")
          , i = v("mouth")
          , l = v("special")
          , s = v("owner");
        return s.style.display = n ? "block" : "none",
        a.appendChild(o),
        a.appendChild(r),
        a.appendChild(i),
        a.appendChild(l),
        a.appendChild(s),
        a.parts = [o, r, i],
        pe(a, e),
        a
    }
    function pe(e, t) {
        function n(e, t, n, a) {
            var o = -t % n * 100
              , t = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + t + "%"
        }
        var a = t[0] % H
          , o = t[1] % U
          , r = t[2] % F
          , t = t[3]
          , a = (n(e.querySelector(".color"), a, 10),
        n(e.querySelector(".eyes"), o, 10),
        n(e.querySelector(".mouth"), r, 10),
        e.querySelector(".special"));
        0 <= t ? (a.style.display = "",
        n(a, t, 10)) : a.style.display = "none"
    }
    function me(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }
    function a(e, t, n, a) {
        let o = {
            element: v("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element),
        n.push(o.element),
        y(n, "DOMMouseScroll wheel", function(e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY,
            t = Math.sign(t),
            ge(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)),
            e.preventDefault(),
            e.stopPropagation()
        }),
        fe(o, t),
        o
    }
    function fe(n, e) {
        b(n.element),
        n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = v("dot");
            e.appendChild(v("inner")),
            y(e, "click", function() {
                ge(n, t, !0)
            }),
            n.element.appendChild(e),
            n.dots.push(e)
        }
        n.selected < 0 && (n.selected = 0),
        n.selected >= e && (n.selected = e - 1),
        ge(n, n.selected, !1)
    }
    function ge(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++)
                t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"),
            t.change(t, e, n)
        }
    }
    const h = 0
      , ye = 1
      , ve = 2
      , be = 3
      , p = 4
      , Se = 5;
    var m = s.querySelector("#modal")
      , ke = m.querySelector(".modal-title .text")
      , we = m.querySelector(".modal-content")
      , f = [];
    function Ce(e) {
        f[h].querySelector(".buttons button.mute").textContent = C(e ? "Unmute" : "Mute")
    }
    function g(e, n) {
        m.style.display = "block";
        for (var t = 0; t < f.length; t++)
            f[t].style.display = "none";
        f[e].style.display = "flex";
        let a = f[e];
        switch (e) {
        case ye:
            ke.textContent = C("Something went wrong!"),
            a.querySelector(".message").textContent = n;
            break;
        case ve:
            ke.textContent = C("Disconnected!"),
            a.querySelector(".message").textContent = n;
            break;
        case h:
            {
                ke.textContent = n.id == R ? C("$ (You)", n.name) : n.name;
                let e = a.querySelector(".buttons")
                  , t = (e.style.display = n.id == R ? "none" : "flex",
                e.querySelector(".button-pair").style.display = R == I ? "flex" : "none",
                e.querySelector("button.report").style.display = n.reported ? "none" : "",
                Ce(n.muted),
                a.querySelector(".report-menu").style.display = "none",
                a.querySelector(".invite").style.display = R == n.id ? "flex" : "none",
                we.querySelector(".player"));
                t.style.display = "",
                b(t);
                var o = he(n.avatar);
                me(o, I == n.id),
                t.appendChild(o)
            }
            break;
        case Se:
            ke.textContent = C("Rooms"),
            roomsUpdate(n);
            break;
        case be:
            {
                ke.textContent = 0 == Dn ? "Public Room" : "Private Room",
                b(a);
                var r = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"];
                let o = v("settings");
                for (let a = 0; a < Ln.length; a++) {
                    let e = v("setting")
                      , t = ue("img", "icon")
                      , n = (t.src = "/img/setting_" + a + ".gif",
                    e.appendChild(t),
                    e.appendChild(ue("span", "name", r[a] + ":")),
                    Ln[a]);
                    a == oe.CUSTOMWORDSONLY && (n = n ? "Yes" : "No"),
                    a == oe.SLOTS && (n = A.length + "/" + n),
                    a == oe.LANG && (n = le[n]),
                    a == oe.WORDMODE && (n = ie[n]),
                    a == oe.DRAWTIME && (n += "s"),
                    e.appendChild(ue("span", "value", n)),
                    o.appendChild(e)
                }
                a.appendChild(o);
                let e = s.querySelector("#game-invite").cloneNode(!0);
                y(e.querySelector("#copy-invite"), "click", Qa),
                a.appendChild(e)
            }
            break;
        case p:
            ke.textContent = C("Settings"),
            a.querySelector("#select-pressure-sensitivity").value = l.pressureSensitivity
        }
    }
    function qe() {
        m.style.display = "none"
    }
    f[h] = m.querySelector(".modal-container-player"),
    f[ye] = m.querySelector(".modal-container-info"),
    f[ve] = m.querySelector(".modal-container-info"),
    f[be] = m.querySelector(".modal-container-room"),
    f[p] = m.querySelector(".modal-container-settings"),
    y(u, "click", function(e) {
        e.target == m && qe()
    }),
    y([m.querySelector(".close"), f[ye].querySelector("button.ok")], "click", qe);
    var xe = s.querySelector("#game-chat form")
      , Me = s.querySelector("#game-chat form input")
      , Le = s.querySelector("#game-chat .chat-content");
    const De = 0;
    const $e = 2
      , Ee = 3
      , Ae = 4
      , Re = 5
      , Ie = 6
      , Te = 7
      , Ne = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];
    function S(e) {
        return "var(--COLOR_CHAT_TEXT_" + Ne[e] + ")"
    }
    function Oe() {
        Le.scrollTop = Le.scrollHeight + 100
    }
    function k(e, t, n, a) {
        var o = s.createElement("p")
          , r = s.createElement("b")
          , a = (r.textContent = a ? e : e + ": ",
        o.appendChild(r),
        o.style.color = n,
        s.createElement("span"))
          , e = (a.textContent = t,
        o.appendChild(a),
        Le.scrollHeight - Le.scrollTop - Le.clientHeight <= 20);
        if (Le.appendChild(o),
        e && Oe(),
        0 < l.chatDeleteQuota)
            for (; Le.childElementCount > l.chatDeleteQuota; )
                Le.firstElementChild.remove();
        return o
    }
    let w = void 0
      , We = void 0;
    function Pe(e) {
        Ye();
        var t = (We = e).dataset.tooltip;
        let n = e.dataset.tooltipdir || "N"
          , a = ((w = v("tooltip")).appendChild(v("tooltip-arrow")),
        w.appendChild(v("tooltip-content", C(t))),
        !1)
          , o = e;
        for (; o; ) {
            if ("fixed" == u.getComputedStyle(o).position) {
                a = !0;
                break
            }
            o = o.parentElement
        }
        w.style.position = a ? "fixed" : "absolute";
        t = e.getBoundingClientRect();
        "E" == (n = "W" == (n = "S" == (n = "N" == n && t.top - u.scrollY < 48 ? "S" : n) && t.bottom - u.scrollY > s.documentElement.clientHeight - 48 ? "N" : n) && t.left - u.scrollX < 48 ? "E" : n) && t.right - u.scrollX > s.documentElement.clientWidth - 48 && (n = "W");
        let r = t.left
          , i = t.top;
        "N" == n && (r = (t.left + t.right) / 2),
        "S" == n && (r = (t.left + t.right) / 2,
        i = t.bottom),
        "E" == n && (r = t.right,
        i = (t.top + t.bottom) / 2),
        "W" == n && (i = (t.top + t.bottom) / 2),
        a || (r += u.scrollX,
        i += u.scrollY),
        w.classList.add(n),
        w.style.left = r + "px",
        w.style.top = i + "px",
        s.body.appendChild(w)
    }
    function Ye() {
        w && (w.remove(),
        w = void 0,
        We = void 0)
    }
    const ze = [{
        code: "en",
        name: "English",
        layout: [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], ["A", "S", "D", "F", "G", "H", "J", "K", "L"], ["Z", "X", "C", "V", "B", "N", "M"]]
    }, {
        code: "fr",
        name: "French",
        layout: [["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"], ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"], ["W", "X", "C", "V", "B", "N", "É", "È", "Ç", "À"]]
    }, {
        code: "de",
        name: "German",
        layout: [["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"], ["Y", "X", "C", "V", "B", "N", "M"]]
    }, {
        code: "tr",
        name: "Turkish",
        layout: [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"], ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"]]
    }, {
        code: "ru",
        name: "Russian",
        layout: [["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"], ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"], ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Ё"]]
    }, {
        code: "es",
        name: "Spanish",
        layout: [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"], ["Z", "X", "C", "V", "B", "N", "M"]]
    }];
    var He = s.querySelector("#select-mobile-keyboard-enabled")
      , Ue = s.querySelector("#select-mobile-keyboard-layout")
      , Fe = {
        elements: {
            main: s.querySelector("#game-keyboard"),
            input: s.querySelector("#game-keyboard .input"),
            rows: s.querySelector("#game-keyboard .keys"),
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
            this.lang = e.code,
            this.caps = !1,
            this.columns = 0,
            this.elements.keys = [],
            b(this.elements.rows);
            var n = e.layout;
            let o = this;
            function a(e, n, t) {
                let a = ue("button", "key");
                if (Ge.has(n)) {
                    let t = Ge.get(n);
                    a.classList.add(t.class),
                    a.appendChild(ue("span", "material-icons", t.icon)),
                    y(a, "pointerdown", function(e) {
                        t.callback(o)
                    })
                } else
                    a.textContent = o.getKeyLowercase(n),
                    y(a, "pointerdown", function(e) {
                        o.inputAdd(n)
                    }),
                    o.elements.keys.push(a);
                return t ? e.insertBefore(a, e.firstChild) : e.appendChild(a),
                a
            }
            let r = 0;
            for (let t = 0; t < n.length; t++) {
                r = o.addRow();
                for (let e = 0; e < n[t].length; e++) {
                    var i = n[t][e];
                    a(r, i)
                }
            }
            this.elements.caps = a(r, "caps", !0),
            a(r, "backspace"),
            r = o.addRow();
            var t = ["-", "space", ".", "enter"];
            for (let e = 0; e < t.length; e++)
                a(r, t[e])
        },
        addRow: function() {
            var e = v("row");
            return this.elements.rows.appendChild(e),
            this.rows.push(e),
            e
        },
        inputChanged: function() {
            Fe.elements.input.querySelector("span").textContent = Fe.input
        },
        inputAdd: function(e) {
            this.input += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e),
            this.inputChanged(),
            this.caps && this.toggleCaps()
        },
        enter: function() {
            0 < this.input.length && (to(this.input),
            this.input = "",
            this.inputChanged())
        },
        toggleCaps: function() {
            this.caps = !this.caps;
            for (let t = 0; t < this.elements.keys.length; t++) {
                let e = this.elements.keys[t];
                e.textContent = this.caps ? this.getKeyUppercase(e.textContent) : this.getKeyLowercase(e.textContent)
            }
            this.elements.caps.classList.toggle("enabled", this.caps)
        }
    };
    const Ge = new Map;
    function Be() {
        1 == He.value ? s.documentElement.dataset.mobileKeyboard = "" : delete s.documentElement.dataset.mobileKeyboard
    }
    Ge.set("backspace", {
        class: "wide",
        icon: "backspace",
        callback: function(e) {
            0 < e.input.length && (e.input = e.input.slice(0, -1),
            e.inputChanged())
        }
    }),
    Ge.set("caps", {
        class: "wide",
        icon: "keyboard_capslock",
        callback: function(e) {
            e.toggleCaps()
        }
    }),
    Ge.set("enter", {
        class: "wide",
        icon: "keyboard_return",
        callback: function(e) {
            e.enter()
        }
    }),
    Ge.set("space", {
        class: "extra-wide",
        icon: "space_bar",
        callback: function(e) {
            e.input += " ",
            e.inputChanged()
        }
    });
    for (let t = 0; t < ze.length; t++) {
        let e = ue("option");
        e.textContent = ze[t].name,
        e.value = ze[t].code,
        Ue.appendChild(e)
    }
    y(Ue, "change", function(e) {
        let t = void 0;
        for (let e = 0; e < ze.length; e++)
            ze[e].code == this.value && (t = ze[e]);
        null != t && Fe.init(t)
    }),
    y([He, Ue], "change", function(e) {
        n(),
        Be()
    }),
    y(Fe.elements.input, "click", function() {
        Fe.isOpen || (s.documentElement.dataset.mobileKeyboardOpen = "",
        Ia(),
        Oe(),
        Fe.isOpen = !0)
    }),
    Fe.init(ze[0]);
    let Ke = {}
      , _e = [];
    function Ve(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }
    function C(e, t) {
        let n = Ve(Ke[l.displayLang], e)
          , a = (n,
        "")
          , o = 0;
        Array.isArray(t) || (t = [t]);
        for (let e = 0; e < n.length; e++) {
            var r = n.charAt(e);
            "$" == r ? (a += t[o],
            o++) : a += r
        }
        return a
    }
    function Xe(t, n) {
        if ("children" == n)
            for (let e = 0; e < t.children.length; e++) {
                var a = t.children[e].dataset.translate;
                Xe(t.children[e], null == a ? "text" : a)
            }
        else {
            let e = "";
            "text" == n && (e = t.textContent),
            0 < (e = "placeholder" == n ? t.placeholder : e).length ? _e.push({
                key: e,
                element: t,
                type: n
            }) : (console.log("Empty key passed to translate with!"),
            console.log(t))
        }
    }
    Ke.en = {},
    Ke.de = {
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
    const Ze = 0
      , je = 1;
    const Je = 0
      , Qe = 2
      , et = 1;
    const tt = 4
      , nt = 40;
    var at = [4, 10, 20, 32, 40]
      , ot = s.querySelector("#game-toolbar")
      , rt = ot.querySelector(".toolbar-group-tools")
      , it = ot.querySelector(".toolbar-group-actions")
      , t = s.querySelector("#game-toolbar .sizes .size-preview")
      , lt = s.querySelector("#game-toolbar .sizes .container")
      , st = s.querySelector("#game-toolbar .colors");
    function ct(e, t) {
        let n = v("tool clickable")
          , a = (n.appendChild(v("icon")),
        n.appendChild(v("key")),
        t);
        var o, r, i;
        a.id = e,
        (a.element = n).toolIndex = e,
        n.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")",
        o = n,
        r = t.name,
        i = "S",
        o.dataset.tooltip = r,
        o.dataset.tooltipdir = i,
        y(o, "pointerenter", function(e) {
            Pe(e.target)
        }),
        y(o, "pointerleave", function(e) {
            Ye()
        });
        let l, s = (l = t.isAction ? (n.addEventListener("click", function(e) {
            It(this.toolIndex)
        }),
        it.appendChild(n),
        ut[e] = a,
        ce(t.name, t.keydef, "", function() {
            It(e)
        }, function(e) {
            s.textContent = e.key
        })) : (n.addEventListener("click", function(e) {
            Tt(this.toolIndex)
        }),
        rt.appendChild(n),
        dt[e] = a,
        ce(t.name, t.keydef, "", function() {
            Tt(a.id)
        }, function(e) {
            s.textContent = e.key
        })),
        n.querySelector(".key"));
        s.textContent = l.key,
        t.hide && (n.style.display = "none")
    }
    var dt = []
      , ut = (ct(Je, {
        isAction: !1,
        name: "Brush",
        keydef: "B",
        graphic: "pen.gif",
        cursor: 0
    }),
    ct(et, {
        isAction: !1,
        name: "Fill",
        keydef: "F",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    }),
    [])
      , q = (ct(0, {
        isAction: !0,
        name: "Undo",
        keydef: "U",
        graphic: "undo.gif",
        action: function() {
            {
                var e;
                0 < gt.length && (gt.pop(),
                0 < gt.length ? (Ut(e = gt[gt.length - 1]),
                o && o.emit("data", {
                    id: Ca,
                    data: e
                })) : _t())
            }
        }
    }),
    ct(1, {
        isAction: !0,
        name: "Clear",
        keydef: "C",
        graphic: "clear.gif",
        action: _t
    })
/*,*/ /*TYPOMOD DESC: add action for colorswitch*/ /*ct(2, {
        isAction: !0,
        name: "Switcher",
        graphic: "",
        action: ()=>{document.dispatchEvent(new Event("toggleColor"));}
    })*/ /*TYPOEND*/
, /*TYPOMOD DESC: add action for brushlab*/ ct(3, {
        isAction: !0,
        name: "Lab",
        graphic: "",
        action: ()=>{document.dispatchEvent(new Event("openBrushLab"));}
    }) /*TYPOEND*/,
    s.querySelector("#game-canvas canvas"))
      , ht = q.getContext("2d")
      , x = (ht.willReadFrequently = !0,
    [])
      , pt = 0
      , mt = 0
      , ft = []
      , r = [0, 9999, 9999, 0, 0]
      , gt = []
      , M = [0, 0]
      , yt = [0, 0]
      , vt = 0
      , bt = s.createElement("canvas")
      , L = (bt.width = nt + 2,
    bt.height = nt + 2,
    bt.getContext("2d"));
    function St() {
        var t = dt[wt].cursor;
        if (N.id == J && T == R) {
            if (wt == Je) {
                var n, a = bt.width, o = Mt;
                if (o <= 0)
                    return;
                L.clearRect(0, 0, a, a);
// TYPOMOD
// desc: cursor with custom color
let e = Ct < 10000 ? xt[Ct] : typo.hexToRgb((Ct - 10000).toString(16).padStart(6, "0"));
// TYPOEND  
                1 == l.dark && (r = Math.floor(.75 * e[0]),
                i = Math.floor(.75 * e[1]),
                n = Math.floor(.75 * e[2]),
                e = [r, i, n]);
                var r = [e[0], e[1], e[2], .8];
                L.fillStyle = "rgba(" + r[0] + "," + r[1] + "," + r[2] + "," + r[3] + ")",
                L.beginPath(),
                L.arc(a / 2, a / 2, o / 2 - 1, 0, 2 * Math.PI),
                L.fill(),
                L.strokeStyle = "#FFF",
                L.beginPath(),
                L.arc(a / 2, a / 2, o / 2 - 1, 0, 2 * Math.PI),
                L.stroke(),
                L.strokeStyle = "#000",
                L.beginPath(),
                L.arc(a / 2, a / 2, o / 2, 0, 2 * Math.PI),
                L.stroke();
                var i = a / 2
                  , t = "url(" + bt.toDataURL() + ")" + i + " " + i + ", default"
            }
        } else
            t = "default";
        q.style.cursor = t
    }
    var kt = 0
      , wt = 0
      , Ct = 0
      , qt = 0
      , xt = [[255, 255, 255], [0, 0, 0], [193, 193, 193], [80, 80, 80], [239, 19, 11], [116, 11, 7], [255, 113, 0], [194, 56, 0], [255, 228, 0], [232, 162, 0], [0, 204, 0], [0, 70, 25], [0, 255, 145], [0, 120, 93], [0, 178, 255], [0, 86, 158], [35, 31, 211], [14, 8, 101], [163, 0, 186], [85, 0, 105], [223, 105, 167], [135, 53, 84], [255, 172, 142], [204, 119, 77], [160, 82, 45], [99, 48, 13]]
      , Mt = 0
      , Lt = -1
      , Dt = [];
    function $t(e) {
        return 20 + (e - tt) / (nt - tt) * 80
    }
    for (let n = 0; n < at.length; n++) {
        let e = v("size clickable")
          , t = v("icon");
        t.style.backgroundSize = $t(at[n]) + "%",
        e.appendChild(t),
        lt.appendChild(e),
        y(e, "click", function(e) {
            var t = n;
            Rt((t = Dt[t]).element),
            At(t.size),
            Pt()
        }),
        Dt.push({
            id: n,
            size: at[n],
            element: e,
            elementIcon: t
        })
    }
    var Et = [v("top"), v("bottom")];
    for (let e = 0; e < xt.length / 2; e++)
        Et[0].appendChild(Yt(2 * e)),
        Et[1].appendChild(Yt(2 * e + 1)),
        s.querySelector("#game-toolbar .colors-mobile .top").appendChild(Yt(2 * e)),
        s.querySelector("#game-toolbar .colors-mobile .bottom").appendChild(Yt(2 * e + 1));
    for (let e = 0; e < Et.length; e++)
        st.appendChild(Et[e]);
    function At(e) {
        Mt = D(e, tt, nt);
        let n = Dt[Dt.length - 1]
          , a = n.size;
        for (let t = 0; t < Dt.length; t++) {
            let e = Dt[t];
            var o = Math.abs(Mt - e.size);
            o <= a && (a = o,
            n = e,
            t),
            e.element.classList.remove("selected")
        }
        n.element.classList.add("selected"),
        ot.querySelector(".size-preview .icon").style.backgroundSize = $t(Mt) + "%",
        St()
    }
    function Rt(e) {
        e.classList.remove("clicked"),
        e.offsetWidth,
        e.classList.add("clicked")
    }
    function It(e) {
        Rt(ut[e].element),
        ut[e].action()
    }
    function Tt(e, t) {
        Rt(dt[e].element),
        e == wt && !t || (dt[kt = wt].element.classList.remove("selected"),
        dt[e].element.classList.add("selected"),
        wt = e,
        St())
    }
    function Nt(e) {
        var t =
e > 10000 ? zt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : zt(xt[e]);
        Ct = e,
        s.querySelector("#color-preview-primary").style.fill = t,
        s.querySelector("#game-toolbar .color-picker-mobile .preview").style.backgroundColor = t,
        St()
    }
    function Ot(e) {
        var t =
e > 10000 ? zt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : zt(xt[e]);
        qt = e,
        s.querySelector("#color-preview-secondary").style.fill = t,
        St()
    }
    function Wt() {
        var e = Ct;
        Nt(qt),
        Ot(e)
    }
    function Pt() {
        lt.classList.remove("open")
    }
    function Yt(e) {
        let t = v("color");
        return t.style.backgroundColor = zt(xt[e]),
        t.colorIndex = e,
        t
    }
    function zt(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }
    function Ht(e) {
/*TYPOMOD   
desc: if color code > 1000 -> customcolor*/if(e < 1000)
        e = D(e, 0, xt.length),
        e = xt[e];
else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }
    function Ut(e) {
        if (x = x.slice(0, e),
        !(R != T && mt < e)) {
/* TYPOMOD
        desc: replace draw commands because of redo*/        const keepCommands = x;
        /* TYPOEND*/
            r = Gt();
            e = Math.floor(x.length / Ft);
            ft = ft.slice(0, e),
            Jt();
            for (var t = 0; t < ft.length; t++) {
                var n = ft[t];
                ht.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = ft.length * Ft; t < x.length; t++)
                Bt(Xt(x[t]), x[t]);
            pt = Math.min(x.length, pt),
            mt = Math.min(x.length, mt)
        
/* TYPOMOD 
         log kept commands*/
        document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
        /* TYPOEND*/}
    }
    const Ft = 200;
    function Gt() {
        return [0, 9999, 9999, 0, 0]
    }
    function Bt(o) {
        if (r[0] += 1,
        r[1] = Math.min(r[1], o[0]),
        r[2] = Math.min(r[2], o[1]),
        r[3] = Math.max(r[3], o[2]),
        r[4] = Math.max(r[4], o[3]),
        r[0] >= Ft) {
            let e = r[1]
              , t = r[2]
              , n = r[3]
              , a = r[4];
            (n - e <= 0 || a - t <= 0) && (e = o[0],
            t = o[1],
            n = o[2],
            a = o[3]);
            o = ht.getImageData(e, t, n - e, a - t);
            ft.push({
                data: o,
                bounds: r
            }),
            r = Gt()
        }
    }
    function Kt(e) {
        return (e || 0 < x.length || 0 < gt.length || 0 < pt || 0 < mt) && (x = [],
        gt = [],
        pt = mt = 0,
        r = Gt(),
        ft = [],
        Jt(),
        1)
    }
    function _t() {
        Kt() && o && o.emit("data", {
            id: wa
        })
    }
    function Vt(e) {
        !function(e) {
            if (e[0] != Ze)
                return e[0] == je && (0 <= e[2] && e[2] < q.width && 0 <= e[3] && e[3] < q.height);
            {
                var t = {
                    x1: e[3],
                    y1: e[4],
                    x2: e[5],
                    y2: e[6]
                }
                  , e = Math.ceil(e[2] / 2)
                  , n = (t.x1 + t.x2) / 2
                  , a = (t.y1 + t.y2) / 2
                  , o = Math.abs(t.x2 - t.x1) / 2
                  , t = Math.abs(t.y2 - t.y2) / 2
                  , o = {
                    x1: -(e + o),
                    y1: -(e + o),
                    x2: q.width + e + o,
                    y2: q.height + e + t
                };
                return o.x1 < n && n < o.x2 && o.y1 < a && a < o.y2
            }
        }(e) ? console.log("IGNORED COMMAND OUT OF CANVAS BOUNDS") :
/* TYPOMOD 
         log draw commands */
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e })) & 
        /* TYPOEND */ (x.push(e),
        R == T && Bt(Xt(e)))
    }
    function Xt(e) {
        let t = [0, 0, q.width, q.height];
        switch (e[0]) {
        case Ze:
            var n = D(Math.floor(e[2]), tt, nt)
              , a = Math.ceil(n / 2)
              , o = D(Math.floor(e[3]), -a, q.width + a)
              , r = D(Math.floor(e[4]), -a, q.height + a)
              , i = D(Math.floor(e[5]), -a, q.width + a)
              , l = D(Math.floor(e[6]), -a, q.height + a)
              , s = Ht(e[1]);
            t[0] = D(o - a, 0, q.width),
            t[1] = D(r - a, 0, q.height),
            t[2] = D(i + a, 0, q.width),
            t[3] = D(l + a, 0, q.height),
            jt(o, r, i, l, n, s.r, s.g, s.b);
            break;
        case je:
            var a = Ht(e[1])
              , o = D(Math.floor(e[2]), 0, q.width)
              , r = D(Math.floor(e[3]), 0, q.height)
              , i = o
              , l = r
              , c = a.r
              , d = a.g
              , u = a.b
              , h = ht.getImageData(0, 0, q.width, q.height)
              , p = [[i, l]]
              , m = function(e, t, n) {
                n = 4 * (n * e.width + t);
                return 0 <= n && n < e.data.length ? [e.data[n], e.data[1 + n], e.data[2 + n]] : [0, 0, 0]
            }(h, i, l);
            if (c != m[0] || d != m[1] || u != m[2]) {
                function f(e) {
                    var t = h.data[e]
                      , n = h.data[e + 1]
                      , e = h.data[e + 2];
                    if (t == c && n == d && e == u)
                        return !1;
                    t = Math.abs(t - m[0]),
                    n = Math.abs(n - m[1]),
                    e = Math.abs(e - m[2]);
                    return t < 1 && n < 1 && e < 1
                }
                for (var g, y, v, b, S, k, w = h.height, C = h.width; p.length; ) {
                    for (g = p.pop(),
                    y = g[0],
                    v = g[1],
                    b = 4 * (v * C + y); 0 <= v-- && f(b); )
                        b -= 4 * C;
                    for (b += 4 * C,
                    ++v,
                    k = S = !1; v++ < w - 1 && f(b); )
                        Zt(h, b, c, d, u),
                        0 < y && (f(b - 4) ? S || (p.push([y - 1, v]),
                        S = !0) : S = S && !1),
                        y < C - 1 && (f(b + 4) ? k || (p.push([y + 1, v]),
                        k = !0) : k = k && !1),
                        b += 4 * C
                }
                ht.putImageData(h, 0, 0)
            }
        }
        return t
    }
    function D(e, t, n) {
        return e < t ? t : n < e ? n : e
    }
    function Zt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n,
        e.data[t + 1] = a,
        e.data[t + 2] = o,
        e.data[t + 3] = 255)
    }
    function jt(e, t, n, a, o, r, i, l) {
        function s(e, t) {
            for (var n = -c; n <= c; n++)
                for (var a, o = -c; o <= c; o++)
                    n * n + o * o < d && (0 <= (a = 4 * ((t + o) * m.width + e + n)) && a < m.data.length && (m.data[a] = r,
                    m.data[1 + a] = i,
                    m.data[2 + a] = l,
                    m.data[3 + a] = 255))
        }
        var c = Math.floor(o / 2)
          , d = c * c
          , o = Math.min(e, n) - c
          , u = Math.min(t, a) - c
          , h = Math.max(e, n) + c
          , p = Math.max(t, a) + c
          , m = (e -= o,
        t -= u,
        n -= o,
        a -= u,
        ht.getImageData(o, u, h - o, p - u));
        if (e == n && t == a)
            s(e, t);
        else {
            s(e, t),
            s(n, a);
            var f = Math.abs(n - e)
              , g = Math.abs(a - t)
              , y = e < n ? 1 : -1
              , v = t < a ? 1 : -1
              , b = f - g;
            for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a; ) {
                var S = b << 1;
                -g < S && (b -= g,
                e += y),
                S < f && (b += f,
                t += v),
                s(e, t)
            }
        }
        ht.putImageData(m, o, u)
    }
    function Jt() {
/* TYPOMOD
         desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
/* TYPOEND */
        ht.fillStyle = "#FFF",
        ht.fillRect(0, 0, q.width, q.height)
/* TYPOMOD
         desc: dispatch clear event */
        ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
/* TYPOEND */
    }
    y(ot, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    }),
    y("#game-toolbar .colors * .color", "pointerdown", function(e) {
        var t = this.colorIndex;
        let n = 0 == e.button;
        ((n = e.altKey ? !n : n) ? Nt : Ot)(t)
    }),
    y("#game-toolbar .colors-mobile * .color", "pointerdown", function(e) {
        var t = this.colorIndex;
        let n = 0 == e.button;
        ((n = e.altKey ? !n : n) ? Nt : Ot)(t),
        ot.querySelector(".colors-mobile").classList.remove("open")
    }),
    y([q], "DOMMouseScroll wheel", function(e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY,
        e = Math.sign(e);
        At(Mt + 2 * e)
    }),
    ce("Swap", "S", "Swap the primary and secondary color.", Wt),
    y(ot.querySelector(".color-picker .preview"), "click", function(e) {
        Wt()
    }),
    y(ot.querySelector(".color-picker-mobile .preview"), "click", function(e) {
        ot.querySelector(".colors-mobile").classList.toggle("open")
    }),
    y(t, "click", function(e) {
        lt.classList.toggle("open")
    }),
    y(s, "keyup", function(e) {
        if ("Enter" == e.code)
            return Me.focus(),
            0;
        if ("input" == s.activeElement.tagName.toLowerCase() || "textarea" == s.activeElement.tagName.toLowerCase() || -1 != Lt)
            return 0;
        var n = e.key.toLowerCase().replace("key", "");
        for (let t = 0; t < d.length; t++)
            if (d[t].key.toLowerCase() == n) {
                for (let e = 0; e < d[t].cb.length; e++)
                    d[t].cb[e](d[t]);
                return void e.preventDefault()
            }
    }),
    y(q, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    });
    var Qt = null;
    function en(e, t, n, a) {
        var o = q.getBoundingClientRect()
          , e = Math.floor((e - o.left) / o.width * q.width)
          , t = Math.floor((t - o.top) / o.height * q.height);
        a ? (vt = n,
        yt[0] = M[0] = e,
        yt[1] = M[1] = t) : (yt[0] = M[0],
        yt[1] = M[1],
        vt = n,
        M[0] = e,
        M[1] = t)
    }
    u.PointerEvent ? (y(q, "pointerdown", function(e) {
        if (e.preventDefault(),
        (0 == e.button || 2 == e.button || 5 == e.button) && -1 == Lt)
            switch (e.pointerType) {
            case "mouse":
                an(e.button, e.clientX, e.clientY, !0, -1);
                break;
            case "pen":
                an(e.button, e.clientX, e.clientY, !0, e.pressure);
                break;
            case "touch":
                null == Qt && (Qt = e.pointerId,
                an(e.button, e.clientX, e.clientY, !0, -1))
            }
    }),
    y(s, "pointermove", function(e) {
        switch (e.pointerType) {
        case "mouse":
            nn(e.clientX, e.clientY, !1, -1);
            break;
        case "pen":
            nn(e.clientX, e.clientY, !1, e.pressure);
            break;
        case "touch":
            Qt == e.pointerId && nn(e.clientX, e.clientY, !1, -1)
        }
    }),
    y(s, "pointerup", function(e) {
        "touch" == e.pointerType ? Qt == e.pointerId && (Qt = null,
        on(e.button)) : on(e.button)
    })) : (y(q, "mousedown", function(e) {
        e.preventDefault(),
        0 != e.button && 2 != e.button || -1 != Lt || an(e.button, e.clientX, e.clientY, !0, -1)
    }),
    y(s, "mouseup", function(e) {
        e,
        on(e.button)
    }),
    y(s, "mousemove", function(e) {
        nn(e.clientX, e.clientY, !1, -1)
    }),
    y(q, "touchstart", function(e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Qt && (Qt = e[0].identitfier,
        an(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }),
    y(q, "touchend touchcancel", function(e) {
        e.preventDefault(),
        on(Lt)
    }),
    y(q, "touchmove", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == Qt) {
                nn(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    }));
    var tn = 0;
    function nn(e, t, n, a) {
        en(e, t, a = l.pressureSensitivity ? a : -1, n),
        rn(!1)
    }
    function an(e, t, n, a, o) {
        x.length,
        Lt = e,
        en(t, n, o, a),
        rn(!0)
    }
    function on(e) {
        -1 == e || 0 != e && 2 != e && 5 != e || Lt != e || (tn != x.length && (tn = x.length,
        gt.push(tn)),
        Qt = null,
        Lt = -1)
    }
    function rn(n) {
        if (N.id == J && T == R && -1 != Lt) {
            var a = 0 == Lt ? Ct : qt;
            let t = null;
            if (n) {
                n = function(e, t) {
                    var n = (e = ht.getImageData(e, t, 1, 1)).data[0]
                      , a = e.data[1]
                      , o = e.data[2];
                    for (let e = 0; e < xt.length; e++) {
                        var r = xt[e]
                          , l = r[0] - n
                          , s = r[1] - a
                          , r = r[2] - o;
                        if (0 == l && 0 == s && 0 == r)
                            return e
                    }
/* TYPOMOD
                     desc: if color is not in array, convert to custom color */
                    return e = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
                    /* TYPOEND */
                    return i
                }(M[0], M[1]);
                if (wt == et) {
                    if (n == a)
                        return;
                    t = (o = a,
                    r = M[0],
                    l = M[1],
                    [je, o, r, l])
                }
                if (wt == Qe)
                    return (0 == Lt ? Nt : Ot)(n),
                    void Tt(kt)
            }
            if (wt == Je) {
                let e = Mt;
                0 <= vt && (e = (e - tt) * D(vt, 0, 1) + tt);
                var o = Math.ceil(.5 * e)
                  , r = D(Math.floor(yt[0]), -o, q.width + o)
                  , l = D(Math.floor(yt[1]), -o, q.height + o)
                  , n = D(Math.floor(M[0]), -o, q.width + o)
                  , s = D(Math.floor(M[1]), -o, q.height + o);
                t = (a = a,
                c = e,
                d = r,
                u = l,
                n = n,
                s = s,
                [Ze, a, c, d, u, n, s])
            }
            null != t && Vt(t)
        }
        var c, d, u, o, r, l
    }
    setInterval(()=>{
        var e, t;
        o && N.id == J && T == R && 0 < x.length - pt && (e = pt + 8,
        t = x.slice(pt, e),
        o.emit("data", {
            id: ka,
            data: t
        }),
        pt = Math.min(e, x.length))
    }
    , 50),
    setInterval(function() {
        o && N.id == J && T != R && mt < x.length && (Bt(Xt(x[mt]), x[mt]),
        mt++)
    }, 3);
    var ln = s.querySelector("#game-canvas .overlay")
      , sn = s.querySelector("#game-canvas .overlay-content")
      , $ = s.querySelector("#game-canvas .overlay-content .text")
      , cn = s.querySelector("#game-canvas .overlay-content .words")
      , dn = s.querySelector("#game-canvas .overlay-content .reveal")
      , E = s.querySelector("#game-canvas .overlay-content .result")
      , un = s.querySelector("#game-canvas .overlay-content .room")
      , hn = -100
      , pn = 0
      , mn = void 0;
    function fn(e, r, i) {
        let l = hn
          , s = pn
          , c = e.top - l
          , d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001)
            i && i();
        else {
            let a = void 0
              , o = 0;
            mn = u.requestAnimationFrame(function e(t) {
                var n = t - (a = null == a ? t : a)
                  , t = (a = t,
                (o = Math.min(o + n, r)) / r)
                  , n = (n = t) < .5 ? .5 * function(e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function(e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2)
                  , t = t * t * (3 - 2 * t);
                hn = l + c * n,
                pn = s + d * t,
                sn.style.top = hn + "%",
                ln.style.opacity = pn,
                o == r ? i && i() : mn = u.requestAnimationFrame(e)
            })
        }
    }
    function gn(e) {
        e.classList.add("show")
    }
/* TYPOMOD 
     desc: add event handlers for typo features */
    y(".avatar-customizer .container", "pointerdown", () => {
        Vn(typo.createFakeLobbyData());}); 
    /* TYPOEND */
    function yn(l) {
        for (var e = 0; e < sn.children.length; e++)
            sn.children[e].classList.remove("show");
        switch (l.id) {
        case te:
            gn(un);
            break;
        case Z:
            gn($),
            $.textContent = C("Round $", l.data + 1);
            break;
        case V:
            gn($),
            $.textContent = C("Waiting for players...");
            break;
        case X:
            gn($),
            $.textContent = C("Game starting in a few seconds...");
            break;
        case Q:
            gn(dn),
            dn.querySelector("p span.word").textContent = l.data.word,
            dn.querySelector(".reason").textContent = function(e) {
                switch (e) {
                case B:
                    return C("Everyone guessed the word!");
                case _:
                    return C("The drawer left the game!");
                case K:
                    return C("Time is up!");
                default:
                    return "Error!"
                }
            }(l.data.reason);
            let a = dn.querySelector(".player-container")
              , o = (b(a),
            []);
            for (let e = 0; e < l.data.scores.length; e += 3) {
                var t = l.data.scores[e + 0]
                  , n = (l.data.scores[e + 1],
                l.data.scores[e + 2])
                  , t = Y(t);
                t && o.push({
                    name: t.name,
                    score: n
                })
            }
            o.sort(function(e, t) {
                return t.score - e.score
            });
            for (let n = 0; n < Math.min(o.length, 12); n++) {
                let e = v("player");
                var i = o[n];
                e.appendChild(v("name", i.name));
                let t = v("score", (0 < i.score ? "+" : "") + i.score);
                i.score <= 0 && t.classList.add("zero"),
                e.appendChild(t),
                a.appendChild(e)
            }
            break;
        case ee:
            gn(E);
            let r = [E.querySelector(".podest-1"), E.querySelector(".podest-2"), E.querySelector(".podest-3"), E.querySelector(".ranks")];
            for (let e = 0; e < 4; e++)
                b(r[e]);
            if (0 < l.data.length) {
                let n = [[], [], [], []];
                for (let e = 0; e < l.data.length; e++) {
                    var s = {
                        player: Y(l.data[e][0]),
                        rank: l.data[e][1],
                        title: l.data[e][2]
                    };
                    s.player && n[Math.min(s.rank, 3)].push(s)
                }
                for (let o = 0; o < 3; o++) {
                    let a = n[o];
                    if (0 < a.length) {
                        var c = a.map(function(e) {
                            return e.player.name
                        }).join(", ")
                          , d = a[0].player.score;
                        let e = r[o]
                          , n = v("avatar-container")
                          , t = (e.appendChild(n),
                        v("border"));
                        t.appendChild(v("rank-place", "#" + (o + 1))),
                        t.appendChild(v("rank-name", c)),
                        t.appendChild(v("rank-score", C("$ points", d))),
                        e.appendChild(t),
                        0 == o && n.appendChild(v("trophy"));
                        for (let t = 0; t < a.length; t++) {
                            let e = he(a[t].player.avatar, 0, 0 == o);
                            e.style.left = 15 * -(a.length - 1) + 30 * t + "%",
                            0 == o && (e.classList.add("winner"),
                            e.style.animationDelay = -2.35 * t + "s"),
                            n.appendChild(e)
                        }
                    }
                }
                var u = Math.min(5, n[3].length);
                for (let t = 0; t < u; t++) {
                    var h = n[3][t];
                    let e = v("rank");
                    var p = he(h.player.avatar, 0, !1);
                    e.appendChild(p),
                    e.appendChild(v("rank-place", "#" + (h.rank + 1))),
                    e.appendChild(v("rank-name", h.player.name)),
                    e.appendChild(v("rank-score", C("$ points", h.player.score))),
                    r[3].appendChild(e)
                }
                0 < n[0].length ? (g = n[0].map(function(e) {
                    return e.player.name
                }).join(", "),
                E.querySelector(".winner-name").textContent = (0 < n[0].length ? g : "<user left>") + " ",
                E.querySelector(".winner-text").textContent = 1 == n[0].length ? C("is the winner!") : C("are the winners!")) : (E.querySelector(".winner-name").textContent = "",
                E.querySelector(".winner-text").textContent = C("Nobody won!"))
            } else
                E.querySelector(".winner-name").textContent = "",
                E.querySelector(".winner-text").textContent = C("Nobody won!");
            break;
        case j:
            if (l.data.words)
                if (gn($),
                gn(cn),
                b(cn),
                Ln[oe.WORDMODE] == re.COMBINATION) {
                    $.textContent = C("Choose the first word");
                    let a = l.data.words.length / 2
                      , o = []
                      , r = []
                      , i = 0;
                    for (let n = 0; n < a; n++) {
                        let e = v("word", l.data.words[n])
                          , t = (e.index = n,
                        v("word", l.data.words[n + a]));
                        t.index = n,
                        t.style.display = "none",
                        t.style.animationDelay = .03 * n + "s",
                        o.push(e),
                        r.push(t),
                        y(e, "click", function() {
                            i = this.index;
                            for (let e = 0; e < a; e++)
                                o[e].style.display = "none",
                                r[e].style.display = "";
                            $.textContent = C("Choose the second word")
                        }),
                        y(t, "click", function() {
                            aa([i, this.index])
                        }),
                        cn.appendChild(e),
                        cn.appendChild(t)
                    }
                } else {
                    $.textContent = C("Choose a word");
                    for (var m = 0; m < l.data.words.length; m++) {
                        var f = v("word", l.data.words[m]);
                        f.index = m,
                        y(f, "click", function() {
                            aa(this.index)
                        }),
                        cn.appendChild(f)
                    }
                }
            else {
                gn($);
                var g = Y(l.data.id)
                  , g = g ? g.name : C("User");
                $.textContent = C("$ is choosing a word!", g)
            }
        }
    }
    const vn = 0
      , bn = 1
      , Sn = 2
      , kn = 3
      , wn = 4
      , Cn = 5
      , qn = 6;
    function xn(e, t) {
        this.url = t,
        this.buffer = null,
        this.loaded = !1;
        let n = this
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
    function Mn() {
        this.context = null,
        this.gain = null,
        this.sounds = new Map,
        u.addEventListener("load", this.load.bind(this), !1)
    }
    Mn.prototype.addSound = function(e, t) {
        this.sounds.set(e, new xn(this,t))
    }
    ,
    Mn.prototype.loadSounds = function() {
        this.addSound(vn, "/audio/roundStart.ogg"),
        this.addSound(bn, "/audio/roundEndSuccess.ogg"),
        this.addSound(Sn, "/audio/roundEndFailure.ogg"),
        this.addSound(kn, "/audio/join.ogg"),
        this.addSound(wn, "/audio/leave.ogg"),
        this.addSound(Cn, "/audio/playerGuessed.ogg"),
        this.addSound(qn, "/audio/tick.ogg")
    }
    ,
    Mn.prototype.playSound = function(t) {
        if (null == this.context)
            this.load();
        else if ("running" != this.context.state) {
            let e = this.context.resume();
            void e.then(()=>{
                this.playSound(t)
            }
            )
        } else if (null != this.context && 0 < l.volume && this.sounds.has(t)) {
            var n = this.sounds.get(t);
            if (n.loaded) {
                let e = this.context.createBufferSource();
                e.buffer = n.buffer,
                e.connect(this.gain),
                e.start(0)
            }
        }
    }
    ,
    Mn.prototype.setVolume = function(e) {
        f[p].querySelector("#volume .title .icon").classList.toggle("muted", e <= 0),
        f[p].querySelector("#volume .volume-value").textContent = e <= 0 ? "Muted" : e + "%",
        this.gain && (this.gain.gain.value = e / 100)
    }
    ,
    Mn.prototype.load = function() {
        if (null == this.context)
            try {
                u.AudioContext = u.AudioContext || u.webkitAudioContext,
                this.context = new AudioContext,
                this.gain = this.context.createGain(),
                this.gain.connect(this.context.destination),
                this.setVolume(l.volume),
                console.log("AudioContext created."),
                this.loadSounds()
            } catch (e) {
                console.log("Error creating AudioContext.", e),
                this.context = null
            }
    }
    ,
    V;
    var o, A = [], R = 0, I = -1, T = -1, Ln = [], N = {
        id: -1,
        time: 0,
        data: 0
    }, Dn = -1, $n = 0, En = void 0, O = new Mn, W = void 0, An = !1, Rn = !1, In = s.querySelector("#game-wrapper"), t = s.querySelector("#game-canvas .room"), Tn = s.querySelector("#game-players"), Nn = (s.querySelector("#game-chat"),
    s.querySelector("#game-board"),
    s.querySelector("#game-bar")), On = Tn.querySelector(".players-list"), Wn = Tn.querySelector(".players-footer"), Pn = s.querySelector("#game-round"), P = [s.querySelector("#game-word .description"), s.querySelector("#game-word .word"), s.querySelector("#game-word .hints .container")], Yn = s.querySelector("#home .container-name-lang input"), zn = s.querySelector("#home .container-name-lang select"), Hn = s.querySelector("#home .panel .button-play"), Un = s.querySelector("#home .panel .button-create");
    function Fn(e) {
        An = e,
        s.querySelector("#load").style.display = e ? "block" : "none"
    }
    function Gn(e, t, n, a) {
        var o, r;
        e = e,
        t = t,
        o = function(e, t) {
            switch (e) {
            case 200:
                return void n({
                    success: !0,
                    data: t
                });
            case 503:
            case 0:
                a && g(ye, C("Servers are currently undergoing maintenance!") + "\n\r" + C("Please try again later!"));
                break;
            default:
                a && g(ye, C("An unknown error occurred ('$')", e) + "\n\r" + C("Please try again later!"))
            }
            n({
                success: !1,
                error: e
            })
        }
        ,
        (r = new XMLHttpRequest).onreadystatechange = function() {
            4 == this.readyState && o(this.status, this.response)
        }
        ,
        r.open("POST", e, !0),
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        r.send(t)
    }
    var Bn = null;
    function Kn(t) {
        let n = !1;
        if (u.localStorageAvailable) {
            let e = c.getItem("lastAd")
              , t = new Date;
            var a;
            c.setItem("lastAd", t.toString()),
            null == e ? e = t : (e = new Date(Date.parse(e)),
            a = Math.abs(e - t),
            n = 1 <= a / 1e3 / 60)
        }
        if (n)
            try {
                aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (Bn = t,
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
    function _n(e, t, n) {
        O.context.resume(),
        o && na();
        let a = 0;
        (o = z(e, {
            closeOnBeforeunload: !1
        })).on("connect", function() {
/* TYPOMOD
             desc: disconnect socket & leave lobby */
            document.addEventListener('socketEmit', event => o.emit('data', {id: event.detail.id, data: event.detail.data}));
 typo.disconnect = () => {
                if (o) {
                    o.typoDisconnect = true;
                    o.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    o.off("data");
                    o.reconnect = false;
                    o.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            /* TYPOEND */
            Fn(!1),
            o.on("joinerr", function(e) {
                na(),
                g(ye, function(e) {
                    switch (e) {
                    case 1:
                        return C("Room not found!");
                    case 2:
                        return C("Room is full!");
                    case 3:
                        return C("You are on a kick cooldown!");
                    case 4:
                        return C("You are banned from this room!");
                    default:
                        return C("An unknown error ('$') occured!", e)
                    }
                }(e))
            }),
            o.on("data", La);
            var e = Yn.value.split("#")
              , e = {
                join: t,
                create: n ? 1 : 0,
                name: e[0],
                lang: zn.value,
                code: e[1],
                avatar: l.avatar
            };
            o.emit("login", e)
        }),
        o.on("reason", function(e) {
            a = e
        }),
        o.on("disconnect", function() {
/* TYPOMOD
                 DESC: no msg if disconnect intentionally */
                if(!o.typoDisconnect)
                /*TYPOEND*/
            switch (a) {
            case ne:
                g(ve, C("You have been kicked!"));
                break;
            case ae:
                g(ve, C("You have been banned!"));
                break;
            default:
                g(ve, C("Connection lost!"))
            }
            na()
        }),
        o.on("connect_error", e=>{
            na(),
            Fn(!1),
            g(ye, e.message)
        }
        )
    }
    function Vn(e) {
        var t;
        O.playSound(kn),
        Tt(Je, !0),
        At(12),
        Nt(1),
        Ot(0),
        Kt(!0),
        b(Le),
        s.querySelector("#home").style.display = "none",
        s.querySelector("#game").style.display = "flex",
        R = e.me,
        Dn = e.type,
        En = e.id,
        s.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id,
        t = e.settings,
        Ln = t,
        Xn(),
        b(On),
        A = [];
        for (var n = 0; n < e.users.length; n++)
            Da(e.users[n], !1);
        Ia(),
        Na(),
        jn(e.round),
        la(e.owner),
        Qn(e.state, !0),
        Rn || ((adsbygoogle = u.adsbygoogle || []).push({}),
        (adsbygoogle = u.adsbygoogle || []).push({}),
        Rn = !0)
    }
    function Xn() {
        jn($n);
        for (var e, t = 0; t < Pa.length; t++) {
            var n = Pa[t];
            n.index && (e = Ln[(n = n).index],
            "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
        }
    }
    function Zn(e, t, n) {
        Ln[e] = t,
        n && o && o.emit("data", {
            id: ma,
            data: {
                id: e,
                val: t
            }
        }),
        Xn()
    }
    function jn(e) {
        var e = ($n = e) + 1
          , t = Ln[oe.ROUNDS];
        Pn.textContent = C("Round $ of $", [e, t]),
        Nn.querySelector(".mobile .round span").textContent = e + "/" + t
    }
    function Jn() {
        for (let e = 0; e < A.length; e++)
            A[e].score = 0;
        for (let e = 0; e < A.length; e++)
            Oa(A[e], !1),
            Wa(A[e], !1),
            Ta(A[e])
    }
    function Qn(a, e) {
        var t, n;
        if (t = N = a,
        null != mn && (u.cancelAnimationFrame(mn),
        mn = void 0),
        t.id == J ? fn({
            top: -100,
            opacity: 0
        }, 600, function() {
            ln.classList.remove("show")
        }) : ln.classList.contains("show") ? fn({
            top: -100,
            opacity: 1
        }, 600, function() {
            yn(t),
            fn({
                top: 0,
                opacity: 1
            }, 600)
        }) : (ln.classList.add("show"),
        yn(t),
        fn({
            top: 0,
            opacity: 1
        }, 600)),
        n = a.time,
        Ba(),
        Ka(n),
        Fa = setInterval(function() {
            Ka(Math.max(0, Ga - 1));
            let e = -1;
            N.id == J && (e = za),
            N.id == j && (e = Ha),
            Ua.style.animationName = Ga < e ? Ga % 2 == 0 ? "rot_left" : "rot_right" : "none",
            Ga < e && O.playSound(qn),
            Ga <= 0 && Ba()
        }, 1e3),
        In.classList.add("toolbar-hidden"),
        St(),
        ta(!1),
        a.id == te ? (Jn(),
        In.classList.add("room")) : In.classList.remove("room"),
        a.id == Z && (jn(a.data),
        0 == a.data && Jn()),
        a.id == Q) {
            R != T && ia(a.data.word);
            for (var o = 0; o < a.data.scores.length; o += 3) {
                var r = a.data.scores[o + 0]
                  , i = a.data.scores[o + 1]
                  , r = (a.data.scores[o + 2],
                Y(r));
                r && (r.score = i)
            }
            Na();
            for (var l = !0, o = 0; o < A.length; o++)
                if (A[o].guessed) {
                    l = !1;
                    break
                }
            l ? O.playSound(Sn) : O.playSound(bn),
            k(C("The word was '$'", a.data.word), "", S(Ae), !0)
/* TYPOMOD
             desc: log finished drawing */
            ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: a.data.word }));
            /* TYPOEND */
        } else
            a.id != J && (P[0].textContent = C("WAITING"),
            P[0].classList.add("waiting"),
            P[1].style.display = "none",
            P[2].style.display = "none");
        if (a.id == J) {
            if (T = a.data.id,
            O.playSound(vn),
            Kt(!0),
            a.data.drawCommands && (x = a.data.drawCommands),
            k(C("$ is drawing now!", Y(T).name), "", S(Ee), !0),
            !e)
                for (o = 0; o < A.length; o++)
                    Oa(A[o], !1);
            P[0].classList.remove("waiting"),
            T == R ? (n = a.data.word,
            P[0].textContent = C("DRAW THIS"),
            P[1].style.display = "",
            P[2].style.display = "none",
            P[1].textContent = n,
            In.classList.remove("toolbar-hidden"),
            St()) : (ta(!0),
            oa(a.data.word, !1),
            ra(a.data.hints))
        } else {
            T = -1;
            for (o = 0; o < A.length; o++)
                Oa(A[o], !1)
        }
        if (a.id == ee && 0 < a.data.length) {
            let t = []
              , n = 0;
            for (let e = 0; e < a.data.length; e++) {
                var s = a.data[e][0]
                  , c = a.data[e][1]
                  , s = Y(s);
                s && 0 == c && (n = s.score,
                t.push(s.name))
            }
            1 == t.length ? k(C("$ won with a score of $!", [t[0], n]), "", S(Ie), !0) : 1 < t.length && k(C("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", S(Ie), !0)
        }
        for (o = 0; o < A.length; o++)
            Wa(A[o], A[o].id == T);
        Ia()
    }
    function ea(e) {
        o && o.connected && N.id == J && (o.emit("data", {
            id: ua,
            data: e
        }),
        ta(!1))
    }
    function ta(e) {
        s.querySelector("#game-rate").style.display = e ? "" : "none"
    }
    function na() {
        o && o.close(),
        o = void 0,
        Kt(),
        Ba(),
        A = [],
        Ln = [],
        N = {
            id: T = I = -1,
            time: R = 0,
            data: 0
        },
        s.querySelector("#home").style.display = "",
        s.querySelector("#game").style.display = "none"
    }
    function aa(e) {
        o && o.connected && N.id == j && o.emit("data", {
            id: Sa,
            data: e
        })
    }
    function oa(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++)
            n += t[e];
        var a = !e && 1 == Ln[oe.WORDMODE];
        a && (n = 3),
        P[0].textContent = C(a ? "WORD HIDDEN" : "GUESS THIS"),
        P[1].style.display = "none",
        P[2].style.display = "",
        b(P[2]),
        P[2].hints = [];
        for (var o = 0; o < n; o++)
            P[2].hints[o] = v("hint", a ? "?" : "_"),
            P[2].appendChild(P[2].hints[o]);
        a || P[2].appendChild(v("word-length", t.join(" ")))
    }
    function ra(e) {
        for (var t = P[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0]
              , o = e[n][1];
            t[a].textContent = o,
            t[a].classList.add("uncover")
        }
    }
    function ia(e) {
        (!P[2].hints || P[2].hints.length < e.length) && oa([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++)
            t.push([n, e.charAt(n)]);
        ra(t)
    }
    function la(e) {
        I = e;
        for (var t = 0; t < A.length; t++)
            me(A[t].element, A[t].id == I),
            Aa(A[t], 0, A[t].id == I);
        var n = R != I;
        s.querySelector("#start-game").disabled = n;
        for (var a = 0; a < Pa.length; a++) {
            let e = Pa[a];
            e.element.disabled = n
        }
        e = Y(I);
        e && k(C("$ is now the room owner!", e.name), "", S(Ie), !0)
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
                return s.getElementById("preroll")
            },
            AIP_COMPLETE: function(e) {
                Bn()
            },
            AIP_REMOVE: function() {}
        })
    });
    const sa = 1
      , ca = 2
      , da = 5
      , ua = 8
      , ha = 10
      , pa = 11
      , ma = 12
      , fa = 13
      , ga = 14
      , ya = 15
      , va = 16
      , ba = 17
      , Sa = 18
      , ka = 19
      , wa = 20
      , Ca = 21;
    const qa = 30
      , xa = 31
      , Ma = 32;
    function La(e) {
        var t = e.id
          , n = e.data;
        switch (t) {
        case ha:
/* TYPOMOD
                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                /* TYPOEND*/
            Vn(n);
            break;
        case pa:
            Qn(n);
            break;
        case ma:
            Zn(n.id, n.val, !1);
            break;
        case fa:
            ra(n);
            break;
        case ga:
            Ka(n);
            break;
        case sa:
            k(C("$ joined the room!", Da(n, !0).name), "", S(Ae), !0),
            O.playSound(kn);
            break;
        case ca:
            var a = function(e) {
                for (var t = 0; t < A.length; t++) {
                    var n = A[t];
                    if (n.id == e)
                        return A.splice(t, 1),
                        n.element.remove(),
                        Na(),
                        Ia(),
                        n
                }
                return
            }(n.id);
            a && (k(function(e, t) {
                switch (e) {
                default:
                    return C("$ left the room!", t);
                case ne:
                    return C("$ has been kicked!", t);
                case ae:
                    return C("$ has been banned!", t)
                }
            }(n.reason, a.name), "", S(Re), !0),
            O.playSound(wn),
            n.reason != ne && n.reason != ae || Kt(!0));
            break;
        case da:
            var a = Y(n[0])
              , o = Y(n[1])
              , r = n[2]
              , i = n[3];
            a && o && k(C("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", S($e), !0);
            break;
        case ya:
            a = Y(n.id);
            if (a) {
                let e = k(C("$ guessed the word!", a.name), "", S(Ae), !0);
                e.classList.add("guessed"),
                Oa(a, !0),
                O.playSound(Cn),
                n.id == R && ia(n.word)
            }
            break;
        case ua:
            o = Y(n.id);
            o && (r = o,
            i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif",
            (a = v("icon")).style.backgroundImage = "url(/img/" + i + ")",
            Ea(r, a),
            n.vote ? k(C("$ liked the drawing!", o.name), "", S(Ae), !0) : k(C("$ disliked the drawing!", o.name), "", S(Re), !0));
            break;
        case ba:
            la(n);
            break;
        case va:
            k(C("$ is close!", n), "", S($e), !0);
            break;
        case qa:
            $a(Y(n.id), n.msg);
            break;
        case Ma:
            k(C("Spam detected! You're sending messages too quickly."), "", S(Re), !0);
            break;
        case xa:
            switch (n.id) {
            case 0:
                k(C("You need at least 2 players to start the game!"), "", S(Re), !0);
                break;
            case 100:
                k(C("Server restarting in about $ seconds!", n.data), "", S(Re), !0)
            }
            break;
        case ka:
            for (var l = 0; l < n.length; l++)
                Vt(n[l]);
            break;
        case wa:
            Kt(!0);
            break;
        case Ca:
            Ut(n);
            break;
        default:
            return void console.log("Unimplemented data packed received with id " + t)
        }
    }
    function Y(e) {
        for (var t = 0; t < A.length; t++) {
            var n = A[t];
            if (n.id == e)
                return n
        }
    }
    function Da(e, t) {
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
            element: v("player"),
            bubble: void 0
        }
          , e = (A.push(n),
        n.id == R ? C("$ (You)", n.name) : n.name);
        let a = v("player-avatar-container")
          , o = he(n.avatar)
          , r = (n.element.drawing = v("drawing"),
        o.appendChild(n.element.drawing),
        a.appendChild(o),
        n.element.appendChild(a),
        On.appendChild(n.element),
        v("player-info"))
          , i = v("player-name", e);
        n.id == R && i.classList.add("me"),
        r.appendChild(i),
        r.appendChild(v("player-rank", "#" + n.rank)),
        r.appendChild(v("player-score", C("$ points", n.score))),
        n.element.appendChild(r),
        y(n.element, "click", function() {
            W = n,
            g(h, n)
        });
        4 == (4 & n.flags) && (n.interval = setInterval(function() {
            n.avatar[0] = (n.avatar[0] + 1) % G[0],
            pe(o, n.avatar)
        }, 250));
/* TYPOMOD
         desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id);
        /* TYPOEND */
        var e = v("player-icons")
          , l = v("icon owner")
          , s = v("icon muted");
        return e.appendChild(l),
        e.appendChild(s),
        n.element.appendChild(e),
        n.element.icons = [l, s],
        Oa(n, n.guessed),
        t && Ia(),
        n
    }
    function $a(e, t) {
        var n;
        e.muted || (n = e.id == T || e.guessed,
        R != T && !Y(R).guessed && n || (Ea(e, v("text", t)),
        k(e.name, t, S(n ? Te : De))))
    }
    function Ea(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout),
        e.bubble.remove(),
        e.bubble = void 0);
        var n = v("player-bubble")
          , a = v("content");
        a.appendChild(t),
        n.appendChild(v("arrow")),
        n.appendChild(a),
        e.element.appendChild(n),
        e.bubble = n,
        e.bubble.timeout = setTimeout(function() {
            e.bubble.remove(),
            e.bubble = void 0
        }, 1500)
    }
    function Aa(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ra = void 0;
    function Ia() {
        N.id,
        te;
        let e = getComputedStyle(s.documentElement)
          , t = e.getPropertyValue("--PLAYERS_PER_PAGE");
        t <= 0 && (n = Math.max(48, On.clientHeight),
        t = Math.floor(n / 48));
        var n = Math.ceil(A.length / t);
        for (let e = 0; e < A.length; e++)
            A[e].page = Math.floor(e / t);
        null == Ra ? Ra = a(Wn, n, [Tn], function(e, n, t) {
            let a = [];
            for (let t = 0; t < A.length; t++) {
                let e = A[t];
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
        }) : fe(Ra, n),
        Ra.element.style.display = 1 < n ? "" : "none"
    }
    function Ta(t) {
        let n = 1;
        for (let e = 0; e < A.length; e++) {
            var a = A[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n,
        t.element.querySelector(".player-score").textContent = C("$ points", t.score);
        let e = t.element.querySelector(".player-rank");
        e.textContent = "#" + n,
        e.classList.remove("first"),
        e.classList.remove("second"),
        e.classList.remove("third"),
        1 == n && e.classList.add("first"),
        2 == n && e.classList.add("second"),
        3 == n && e.classList.add("third")
    }
    function Na() {
        for (var e = 0; e < A.length; e++)
            Ta(A[e])
    }
    function Oa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }
    function Wa(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Pa = [];
    {
        let e = t.querySelectorAll('*[id^="item-"]');
        for (var Ya = 0; Ya < e.length; Ya++) {
            let t = {
                id: e[Ya].id.replace("item-settings-", ""),
                element: e[Ya],
                index: e[Ya].dataset.setting
            };
            Pa.push(t),
            y(t.element, "change", function() {
                let e = this.value;
                "checkbox" == this.type && (e = this.checked ? 1 : 0),
                null != t.index && Zn(t.index, e, !0)
            })
        }
    }
    const za = 10
      , Ha = 4;
    var Ua = s.querySelector("#game-clock")
      , Fa = null
      , Ga = 0;
    function Ba() {
        Fa && (clearInterval(Fa),
        Fa = null)
    }
    function Ka(e) {
        Ga = e,
        Ua.textContent = Ga,
        Nn.querySelector(".mobile .drawtime span").textContent = Ga + "s"
    }
    var _a, Va, t = s.querySelector("#tutorial"), Xa = t.querySelectorAll(".page"), Za = a(t.querySelector(".navigation"), Xa.length, [t.querySelector(".pages")], function(e, t, n) {
        n && clearInterval(ja);
        for (let e = 0; e < Xa.length; e++)
            Xa[e].classList.remove("active");
        Xa[t].classList.add("active")
    }), ja = setInterval(function() {
        Za.selected < 4 ? ge(Za, Za.selected + 1, !1) : ge(Za, 0, !1)
    }, 3500), t = s.querySelector("#game-settings");
    s.querySelector("#audio"),
    s.querySelector("#lightbulb");
    function Ja() {
        var e = .01 * u.innerHeight;
        s.documentElement.style.setProperty("--vh", e + "px")
    }
    function Qa() {
        k(C("Copied room link to clipboard!"), "", S($e), !0);
        var e = "https://skribbl.io/?" + En;
        if (navigator.clipboard)
            navigator.clipboard.writeText(e).then(function() {
                console.log("Async: Copying to clipboard was successful!")
            }, function(e) {
                console.error("Async: Could not copy text: ", e)
            });
        else {
            var t = s.createElement("textarea");
            t.value = e,
            t.style.top = "0",
            t.style.left = "0",
            t.style.position = "fixed",
            s.body.appendChild(t),
            t.select(),
            t.focus();
            try {
                var n = s.execCommand("copy");
                console.log("Copying link was " + (n ? "successful" : "unsuccessful"))
            } catch (e) {
                console.log("Unable to copy link " + e)
            }
            s.body.removeChild(t)
        }
    }
    function eo(e) {
        let t = xe.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }
    function to(e) {
        o && o.connected ? o.emit("data", {
            id: qa,
            data: e
        }) : $a(Y(R), e)
    }
    y(t, "click", function() {
        g(p)
    }),
    y(u, "resize", function() {
        Ja(),
        Ia()
    }),
    u.onbeforeunload = function(e) {
        return o ? C("Are you sure you want to leave?") : void 0
    }
    ,
    u.onunload = function() {
        o && na()
    }
    ,
    y(s, "pointerdown", function(e) {
        Fe.elements.main.contains(e.target) || Fe.isOpen && (delete s.documentElement.dataset.mobileKeyboardOpen,
        Ia(),
        Fe.isOpen = !1),
        s.querySelector("#game-toolbar .sizes").contains(e.target) || Pt()
    }),
    y([Yn, zn], "change", n),
    y(Hn, "click",
typo.joinLobby = function() {
        var t, e, n, a, o;
        n = u.location.href,
        o = "",
        n = n.split("?"),
        t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o,
        An || (e = "" != t ? "id=" + t : "lang=" + zn.value,
        qe(),
        Fn(!0),
        Kn(function() {
            Gn(location.origin + ":3000/play", e, function(e) {
                Fn(!1),
                e.success && _n(e.data, t)
            }, !0)
        }))
    }),
    y(Un, "click", function() {
        An || (qe(),
        Fn(!0),
        Kn(function() {
            Gn(location.origin + ":3000/play", "lang=" + zn.value, function(e) {
                e.success ? _n(e.data, 0, 1) : Fn(!1)
            }, !0)
        }))
    }),
    y(s.querySelector("#game-rate .like"), "click", function() {
        ea(1)
    }),
    y(s.querySelector("#game-rate .dislike"), "click", function() {
        ea(0)
    }),
    y(s.querySelector("#start-game"), "click", function() {
        if (o) {
            let t = s.querySelector("#item-settings-customwords").value.split(",")
              , e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++)
                    t[e] = t[e].trim();
                e = t.join(",")
            }
            o.emit("data", {
                id: 22,
                data: e
            })
        }
    }),
    y([s.querySelector("#copy-invite"), s.querySelector("#modal-player-button-invite")], "click", Qa),
    y(f[h].querySelector("button.kick"), "click", function() {
        qe(),
        null != W && W.id != R && R == I && o && o.emit("data", {
            id: 3,
            data: W.id
        })
    }),
    y(f[h].querySelector("button.ban"), "click", function() {
        qe(),
        null != W && W.id != R && R == I && o && o.emit("data", {
            id: 4,
            data: W.id
        })
    }),
    y(f[h].querySelector("button.votekick"), "click", function() {
        qe(),
        null != W && W.id != R && o && (W.id == I ? k(C("You can not votekick the lobby owner!"), "", S(Re), !0) : o.emit("data", {
            id: da,
            data: W.id
        }))
    }),
    y(f[h].querySelector("button.mute"), "click", function() {
        null != W && W.id != R && (W.muted = !W.muted,
        Aa(W, 1, W.muted),
        W.muted ? k(C("You muted '$'!", W.name), "", S(Re), !0) : k(C("You unmuted '$'!", W.name), "", S(Re), !0),
        o && o.emit("data", {
            id: 7,
            data: W.id
        }),
        Ce(W.muted))
    }),
    y(f[h].querySelector("button.report"), "click", function() {
        f[h].querySelector(".buttons").style.display = "none",
        f[h].querySelector(".player").style.display = "none",
        f[h].querySelector(".report-menu").style.display = "";
        let t = f[h].querySelectorAll(".report-menu input");
        for (let e = 0; e < t.length; e++)
            t[e].checked = !1
    }),
    y(f[h].querySelector("button#report-send"), "click", function() {
        let e = 0;
        f[h].querySelector("#report-reason-toxic").checked && (e |= 1),
        f[h].querySelector("#report-reason-spam").checked && (e |= 2),
        f[h].querySelector("#report-reason-bot").checked && (e |= 4),
        0 < e && (null != W && W.id != R && (W.reported = !0,
        o && o.emit("data", {
            id: 6,
            data: {
                id: W.id,
                reasons: e
            }
        }),
        k(C("Your report for '$' has been sent!", W.name), "", S($e), !0)),
        qe())
    }),
    y(f[p].querySelector("#volume input"), "change", function(e) {
        l.volume = e.target.value,
        O.setVolume(l.volume),
        O.playSound(Cn),
        n()
    }),
    y(f[p].querySelector("#select-pressure-sensitivity"), "change", function(e) {
        l.pressureSensitivity = e.target.value,
        n()
    }),
    y(f[p].querySelector("button.reset"), "click", function() {
        for (let e = 0; e < d.length; e++) {
            let t = d[e];
            t.key = t.def,
            t.listing.querySelector("input").value = t.key;
            for (let e = 0; e < t.changed.length; e++)
                t.changed[e](t)
        }
        de()
    }),
    y(s.querySelector("#game-keyboard button.settings"), "click", function(e) {
        g(p)
    }),
    y(Me, "focusin focus", function(e) {
        e.preventDefault()
    }),
    y(Me, "input", function(e) {
        eo(Me.value.length)
    }),
    y(xe, "submit", function(e) {
const input = Me; let rest = input.value.substring(100);
        input.value = input.value.substring(0,100);
        if(rest.length > 0) setTimeout(()=>{input.value = rest; e.target.dispatchEvent(new Event("submit"));},180);
        return e.preventDefault(),
        Me.value && to(Me.value),
        xe.reset(),
        eo(0),
        !1
    }),
    Ja(),
    u.localStorageAvailable ? (Yn.value = e("name", ""),
    zn.value = function(t) {
        var n = s.querySelectorAll("#home .panel .container-name-lang select option");
        for (let e = 0; e < n.length; e++)
            if (n[e].value == t)
                return n[e].value;
        return 0
    }(e("lang", 0)),
    l.displayLang = e("displaylang", "en"),
    l.volume = parseInt(e("volume", 100)),
    l.filterChat = 1 == parseInt(e("filter", 1)) ? 1 : 0,
    l.pressureSensitivity = 1 == parseInt(e("pressure", 1)) ? 1 : 0,
    l.avatar = (t = "ava",
    Hn = l.avatar,
    null == (t = c.getItem(t)) ? Hn : JSON.parse(t)),
    He.value = e("keyboard", 1),
    Ue.value = e("keyboardlayout", "en"),
    Be(),
    f[p].querySelector("#volume input").value = l.volume,
    O.setVolume(l.volume),
    console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
    var no = s.querySelectorAll("[data-translate]");
    for (let e = 0; e < no.length; e++) {
        var ao = no[e];
        Xe(ao, ao.dataset.translate)
    }
    var oo = Ke[l.displayLang];
    for (let t = 0; t < _e.length; t++) {
        let e = _e[t];
        var ro = Ve(oo, e.key);
        "text" == e.type && (e.element.textContent = ro),
        "placeholder" == e.type && (e.element.placeholder = ro)
    }
    function io(e) {
        Va.parts[e].classList.remove("bounce"),
        Va.parts[e].offsetWidth,
        Va.parts[e].classList.add("bounce")
    }
    y(Un = s.querySelectorAll("[data-tooltip]"), "pointerenter", function(e) {
        Pe(e.target)
    }),
    y(Un, "pointerleave", function(e) {
        Ye()
    }),
    t = (Hn = s.querySelector("#home .avatar-customizer")).querySelector(".container"),
    Un = Hn.querySelectorAll(".arrows.left .arrow"),
    _a = Hn.querySelectorAll(".arrows.right .arrow"),
    Hn = Hn.querySelectorAll(".randomize"),
    (Va = he(l.avatar)).classList.add("fit"),
    t.appendChild(Va),
    y(Un, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        --l.avatar[e],
        l.avatar[e] < 0 && (l.avatar[e] = G[e] - 1),
        io(e),
        pe(Va, l.avatar),
        n()
    }),
    y(_a, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        l.avatar[e] += 1,
        l.avatar[e] >= G[e] && (l.avatar[e] = 0),
        io(e),
        pe(Va, l.avatar),
        n()
    }),
    y(Hn, "click", function() {
        l.avatar[0] = Math.floor(Math.random() * G[0]),
        l.avatar[1] = Math.floor(Math.random() * G[1]),
        l.avatar[2] = Math.floor(Math.random() * G[2]),
        io(1),
        io(2),
        pe(Va, l.avatar),
        n()
    });
    {
        var lo = Math.round(8 * Math.random());
        let e = s.querySelector("#home .logo-big .avatar-container");
        for (var so = 0; so < 8; so++) {
            let t = [0, 0, 0, -1]
              , n = (t[0] = so,
            t[1] = Math.round(100 * Math.random()) % U,
            t[2] = Math.round(100 * Math.random()) % F,
            1e3 * Math.random() < 10 && (t[3] = Math.floor(20 * Math.random())),
            he(t, 0, lo == so));
            e.append(n),
            y(n, "click", function() {
                let e = [t[0], 0, 0, -1];
                e[1] = Math.round(100 * Math.random()) % U,
                e[2] = Math.round(100 * Math.random()) % F,
                1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())),
                pe(n, e),
                n.classList.remove("clicked"),
                n.offsetWidth,
                n.classList.add("clicked")
            })
        }
    }
}(window, document, localStorage, io);
