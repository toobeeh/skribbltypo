!function(u, s, c, z) {
    const H = 26
      , U = 57
      , F = 51
      , B = [H, U, F]
      , G = 0
      , K = 1
      , _ = 2
      , X = 0
      , V = 1
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
        joinFn: undefined,
        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input -> Hn
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> l
            return { id: id, name: name.length != 0 ? name : (Hn.value.split("#")[0] != "" ? Hn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? l.avatar : avatar, score: score, guessed: guessed };
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
        lastConnect: undefined,
        initListeners: (() => {
            document.addEventListener("joinLobby", (e) => {
                if(!typo.lastConnect) typo.lastConnect = Date.now();
                let timeoutdiff = Date.now() - typo.lastConnect;
                //Xn(false);
                //Gn(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                setTimeout(() => {
                    typo.lastConnect = Date.now();
                    //document.querySelector(".button-play").dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                    //Rn = !1 // IDENTIFY: x:  = !1   
                    typo.joinFn();//##JOINLOBBY##(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else oa() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = Lt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
                let code = match >= 0 ? match : e.detail.code;
                if (e.detail.secondary) Yt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                else Ot(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
            });
            document.addEventListener("performDrawCommand", (e) => {
                C.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                _t(jt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
                     });
                document.addEventListener("addTypoTooltips", () => {
                [...document.querySelectorAll("[data-typo-tooltip]")].forEach(elem => {
                    elem.setAttribute("data-tooltip", elem.getAttribute("data-typo-tooltip"));
                    elem.removeAttribute("data-typo-tooltip");
                    elem.addEventListener("mouseenter", (e) => Pe(e.target)); // IDENTIFY: x(e.target): 
                    elem.addEventListener("mouseleave", (e) => ze()); // IDENTIFY: (e) => x(): 
 
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
                listing: b("item"),
                changed: [],
                cb: []
            },
            d.push(i);
            var l = b("key", i.name);
            Ze(l, "text"),
            i.listing.appendChild(l);
            let e = s.createElement("input");
            e.value = i.key,
            i.listing.appendChild(e),
            v(e, "keydown", function(t) {
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
            p[ke].querySelector("#hotkey-list").appendChild(i.listing)
        }
        e && i.cb.push(e),
        o && i.changed.push(o)
    }
    function de() {
        if (u.localStorageAvailable)
            for (let e = 0; e < d.length; e++)
                u.localStorage.setItem("hotkey_" + d[e].name, d[e].key)
    }
    var l = {
        avatar: [Math.round(100 * Math.random()) % H, Math.round(100 * Math.random()) % U, Math.round(100 * Math.random()) % F, -1],
        audioMute: 0,
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
    function t() {
        u.localStorageAvailable ? (c.setItem("name", Hn.value),
        c.setItem("lang", Un.value),
        c.setItem("displaylang", l.displayLang),
        c.setItem("audio", 1 == l.audioMute ? 1 : 0),
        c.setItem("dark", 1 == l.dark ? 1 : 0),
        c.setItem("filter", 1 == l.filterChat ? 1 : 0),
        c.setItem("pressure", 1 == l.pressureSensitivity ? 1 : 0),
        c.setItem("ava", JSON.stringify(l.avatar)),
        c.setItem("keyboard", Ge.value),
        c.setItem("keyboardlayout", Ke.value),
        console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
    }
    function a(e) {
        l.dark = e ? 1 : 0,
        s.documentElement.dataset.theme = l.dark ? "dark" : ""
    }
    function v(e, t, n) {
        for (var a, o = e, r = ("string" == typeof e ? o = s.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]),
        t.split(" ")), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++)
                o[i].addEventListener(r[l], n)
    }
    function b(e, t) {
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
    function S(e) {
        for (; e.firstChild; )
            e.removeChild(e.firstChild)
    }
    function he(e, t, n) {
        var a = b("avatar")
          , o = b("color")
          , r = b("eyes")
          , i = b("mouth")
          , l = b("special")
          , s = b("owner");
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
    function fe(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }
    function ge(e, t, n, a) {
        let o = {
            element: b("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element),
        n.push(o.element),
        v(n, "DOMMouseScroll wheel", function(e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY,
            t = Math.sign(t),
            ye(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)),
            e.preventDefault(),
            e.stopPropagation()
        }),
        me(o, t),
        o
    }
    function me(n, e) {
        S(n.element),
        n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = b("dot");
            e.appendChild(b("inner")),
            v(e, "click", function() {
                ye(n, t, !0)
            }),
            n.element.appendChild(e),
            n.dots.push(e)
        }
        n.selected < 0 && (n.selected = 0),
        n.selected >= e && (n.selected = e - 1),
        ye(n, n.selected, !1)
    }
    function ye(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++)
                t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"),
            t.change(t, e, n)
        }
    }
    const h = 0
      , ve = 1
      , be = 2
      , Se = 3
      , ke = 4
      , we = 5;
    var n = s.querySelector("#modal")
      , Ce = n.querySelector(".title .text")
      , qe = n.querySelector(".content")
      , p = [];
    function xe(e) {
        p[h].querySelector(".buttons button.mute").textContent = k(e ? "Unmute" : "Mute")
    }
    function f(e, a) {
        n.style.display = "block";
        for (var t = 0; t < p.length; t++)
            p[t].style.display = "none";
        p[e].style.display = "flex";
        let r = p[e];
        switch (e) {
        case ve:
            Ce.textContent = k("Something went wrong!"),
            r.querySelector(".message").textContent = a;
            break;
        case be:
            Ce.textContent = k("Disconnected!"),
            r.querySelector(".message").textContent = a;
            break;
        case h:
            {
                Ce.textContent = "";
                let e = r.querySelector(".buttons")
                  , t = (e.style.display = a.id == I ? "none" : "flex",
                e.querySelector(".button-pair").style.display = I == R ? "flex" : "none",
                e.querySelector("button.report").style.display = a.reported ? "none" : "",
                xe(a.muted),
                r.querySelector(".report-menu").style.display = "none",
                qe.querySelector(".player"))
                  , n = (S(t),
                he(a.avatar));
                fe(n, R == a.id),
                n.style.width = "96px",
                n.style.height = "96px",
                t.appendChild(n),
                t.appendChild(b("name", a.id == I ? k("$ (You)", a.name) : a.name))
            }
            break;
        case we:
            Ce.textContent = k("Rooms"),
            roomsUpdate(a);
            break;
        case Se:
            {
                Ce.textContent = 0 == Dn ? "Public Room" : "Private Room",
                S(r);
                var i = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"];
                let o = b("settings");
                for (let a = 0; a < Ln.length; a++) {
                    let e = b("setting")
                      , t = ue("img", "icon")
                      , n = (t.src = "/img/setting_" + a + ".gif",
                    e.appendChild(t),
                    e.appendChild(ue("span", "name", i[a] + ":")),
                    Ln[a]);
                    a == oe.CUSTOMWORDSONLY && (n = n ? "Yes" : "No"),
                    a == oe.SLOTS && (n = E.length + "/" + n),
                    a == oe.LANG && (n = le[n]),
                    a == oe.WORDMODE && (n = ie[n]),
                    a == oe.DRAWTIME && (n += "s"),
                    e.appendChild(ue("span", "value", n)),
                    o.appendChild(e)
                }
                r.appendChild(o);
                let e = s.querySelector("#game-invite").cloneNode(!0);
                v(e.querySelector("#copy-invite"), "click", ro),
                r.appendChild(e)
            }
            break;
        case ke:
            Ce.textContent = k("Settings"),
            r.querySelector("#select-display-language").value = l.displayLang,
            r.querySelector("#select-pressure-sensitivity").value = l.pressureSensitivity
        }
    }
    function Me() {
        n.style.display = "none"
    }
    p[h] = n.querySelector(".container-player"),
    p[ve] = n.querySelector(".container-info"),
    p[be] = n.querySelector(".container-info"),
    p[Se] = n.querySelector(".container-room"),
    p[ke] = n.querySelector(".container-settings"),
    v(u, "click", function(e) {
        e.target == n && Me()
    }),
    v([n.querySelector(".close"), p[ve].querySelector("button.ok")], "click", Me);
    var Le = s.querySelector("#game-chat form")
      , De = s.querySelector("#game-chat form input")
      , $e = s.querySelector("#game-chat .content");
    const Ae = 0;
    const Ee = 2
      , Ie = 3
      , Re = 4
      , Te = 5
      , Ne = 6
      , We = 7
      , Oe = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];
    function g(e) {
        return "var(--COLOR_CHAT_TEXT_" + Oe[e] + ")"
    }
    function m(e, t, n, a) {
        var o = s.createElement("p")
          , r = s.createElement("b")
          , a = (r.textContent = a ? e : e + ": ",
        o.appendChild(r),
        o.style.color = n,
        s.createElement("span"))
          , e = (a.textContent = t,
        o.appendChild(a),
        $e.scrollHeight - $e.scrollTop - $e.clientHeight <= 20);
        if ($e.appendChild(o),
        e && ($e.scrollTop = $e.scrollHeight + 100),
        0 < l.chatDeleteQuota)
            for (; $e.childElementCount > l.chatDeleteQuota; )
                $e.firstElementChild.remove();
        return o
    }
    let y = void 0
      , Ye = void 0;
    function Pe(e) {
        ze();
        var t = (Ye = e).dataset.tooltip;
        let n = e.dataset.tooltipdir || "N"
          , a = ((y = b("tooltip")).appendChild(b("tooltip-arrow")),
        y.appendChild(b("tooltip-content", k(t))),
        !1)
          , o = e;
        for (; o; ) {
            if ("fixed" == u.getComputedStyle(o).position) {
                a = !0;
                break
            }
            o = o.parentElement
        }
        y.style.position = a ? "fixed" : "absolute";
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
        y.classList.add(n),
        y.style.left = r + "px",
        y.style.top = i + "px",
        s.body.appendChild(y)
    }
    function ze() {
        y && (y.remove(),
        y = void 0,
        Ye = void 0)
    }
    const He = [{
        code: "en",
        name: "English",
        layout: [["Q", "W", "E", "R", "T", "Y", "U", "I", "O"], ["A", "S", "D", "F", "G", "H", "J", "K", "L"], ["Z", "X", "C", "V", "B", "N", "M"]]
    }, {
        code: "fr",
        name: "French",
        layout: [["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"], ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"], ["W", "X", "C", "V", "B", "N", "É", "È", "Ç", "À"]]
    }, {
        code: "de",
        name: "German",
        layout: [["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "Ü"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"], ["Y", "X", "C", "V", "B", "N", "M"]]
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
    var Ue = {
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
            S(this.elements.rows);
            var n = e.layout;
            let o = this;
            function a(e, n, t) {
                let a = ue("button", "key");
                if (Fe.has(n)) {
                    let t = Fe.get(n);
                    a.classList.add(t.class),
                    a.appendChild(ue("span", "material-icons", t.icon)),
                    v(a, "click", function(e) {
                        t.callback(o)
                    })
                } else
                    a.textContent = o.getKeyLowercase(n),
                    v(a, "click", function(e) {
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
            var t = ["-", "space", ",", ".", "enter"];
            for (let e = 0; e < t.length; e++)
                a(r, t[e])
        },
        addRow: function() {
            var e = b("row");
            return this.elements.rows.appendChild(e),
            this.rows.push(e),
            e
        },
        inputChanged: function() {
            Ue.elements.input.textContent = Ue.input
        },
        inputAdd: function(e) {
            this.input += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e),
            this.inputChanged(),
            this.caps && this.toggleCaps()
        },
        enter: function() {
            0 < this.input.length && (lo(this.input),
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
    const Fe = new Map;
    function Be() {
        1 == Ge.value ? s.documentElement.dataset.mobileKeyboard = "" : delete s.documentElement.dataset.mobileKeyboard
    }
    Fe.set("backspace", {
        class: "wide",
        icon: "backspace",
        callback: function(e) {
            0 < e.input.length && (e.input = e.input.slice(0, -1),
            e.inputChanged())
        }
    }),
    Fe.set("caps", {
        class: "wide",
        icon: "keyboard_capslock",
        callback: function(e) {
            e.toggleCaps()
        }
    }),
    Fe.set("enter", {
        class: "wide",
        icon: "keyboard_return",
        callback: function(e) {
            e.enter()
        }
    }),
    Fe.set("space", {
        class: "extra-wide",
        icon: "space_bar",
        callback: function(e) {
            e.input += " ",
            e.inputChanged()
        }
    }),
    Ue.init(He[0]);
    var Ge = s.querySelector("#select-mobile-keyboard-enabled")
      , Ke = s.querySelector("#select-mobile-keyboard-layout");
    for (let t = 0; t < He.length; t++) {
        let e = ue("option");
        e.textContent = He[t].name,
        e.value = He[t].code,
        Ke.appendChild(e)
    }
    v(Ke, "change", function(e) {
        let t = void 0;
        for (let e = 0; e < He.length; e++)
            He[e].code == this.value && (t = He[e]);
        null != t && Ue.init(t)
    }),
    v([Ge, Ke], "change", function(e) {
        t(),
        Be()
    });
    let _e = {}
      , Xe = [];
    function Ve(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }
    function k(t, n) {
        var e = Ve(_e[l.displayLang], t);
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
    function Ze(t, n) {
        if ("children" == n)
            for (let e = 0; e < t.children.length; e++) {
                var a = t.children[e].dataset.translate;
                Ze(t.children[e], null == a ? "text" : a)
            }
        else {
            let e = "";
            "text" == n && (e = t.textContent),
            0 < (e = "placeholder" == n ? t.placeholder : e).length ? Xe.push({
                key: e,
                element: t,
                type: n
            }) : (console.log("Empty key passed to translate with!"),
            console.log(t))
        }
    }
    function je() {
        var n = _e[l.displayLang];
        for (let t = 0; t < Xe.length; t++) {
            let e = Xe[t];
            var a = Ve(n, e.key);
            "text" == e.type && (e.element.textContent = a),
            "placeholder" == e.type && (e.element.placeholder = a)
        }
    }
    _e.en = {},
    _e.de = {
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
    const Je = 0
      , Qe = 1;
    const et = 0
      , tt = 2
      , nt = 1;
    const at = 4
      , ot = 40;
    var rt = [4, 10, 20, 32, 40]
      , w = s.querySelector("#game-toolbar")
      , it = w.querySelector(".tools-container .tools")
      , lt = w.querySelector(".tools-container .actions")
      , st = s.querySelector("#game-toolbar .sizes .size-preview")
      , ct = s.querySelector("#game-toolbar .sizes .container")
      , dt = s.querySelector("#game-toolbar .colors");
    function ut(e, t) {
        let n = b("tool clickable")
          , a = (n.appendChild(b("icon")),
        n.appendChild(b("key")),
        t)
          , o = (a.id = e,
        (a.element = n).toolIndex = e,
        n.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")",
        n.querySelector(".key"));
        var r, i, l;
        o.textContent = t.keydef,
        r = n,
        i = t.name,
        l = "S",
        r.dataset.tooltip = i,
        r.dataset.tooltipdir = l,
        v(r, "mouseenter", function(e) {
            Pe(e.target)
        }),
        v(r, "mouseleave", function(e) {
            ze()
        }),
        t.isAction ? (n.addEventListener("click", function(e) {
            Nt(this.toolIndex)
        }),
        lt.appendChild(n),
        pt[e] = a,
        ce(t.name, t.keydef, "", function() {
            Nt(e)
        }, function(e) {
            o.textContent = e.key
        })) : (n.addEventListener("click", function(e) {
            Wt(this.toolIndex)
        }),
        it.appendChild(n),
        ht[e] = a,
        ce(t.name, t.keydef, "", function() {
            Wt(a.id)
        }, function(e) {
            o.textContent = e.key
        })),
        t.hide && (n.style.display = "none")
    }
    var ht = []
      , pt = (ut(et, {
        isAction: !1,
        name: "Brush",
        keydef: "B",
        graphic: "pen.gif",
        cursor: 0
    }),
    ut(nt, {
        isAction: !1,
        name: "Fill",
        keydef: "F",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    }),
    [])
      , q = (ut(0, {
        isAction: !0,
        name: "Undo",
        keydef: "U",
        graphic: "undo.gif",
        action: function() {
            {
                var e;
                0 < vt.length && (vt.pop(),
                0 < vt.length ? (Bt(e = vt[vt.length - 1]),
                r && r.emit("data", {
                    id: xa,
                    data: e
                })) : Vt())
            }
        }
    }),
    ut(1, {
        isAction: !0,
        name: "Clear",
        keydef: "C",
        graphic: "clear.gif",
        action: Vt
    })
/*,*/ /*TYPOMOD DESC: add action for colorswitch*/ /*ut(2, {
        isAction: !0,
        name: "Switcher",
        graphic: "",
        action: ()=>{document.dispatchEvent(new Event("toggleColor"));}
    })*/ /*TYPOEND*/
, /*TYPOMOD DESC: add action for brushlab*/ ut(3, {
        isAction: !0,
        name: "Lab",
        graphic: "",
        action: ()=>{document.dispatchEvent(new Event("openBrushLab"));}
    }) /*TYPOEND*/,
    s.querySelector("#game-canvas canvas"))
      , ft = q.getContext("2d")
      , C = []
      , gt = 0
      , mt = 0
      , yt = []
      , o = [0, 9999, 9999, 0, 0]
      , vt = []
      , x = [0, 0]
      , bt = [0, 0]
      , St = 0
      , kt = s.createElement("canvas")
      , M = (kt.width = ot + 2,
    kt.height = ot + 2,
    kt.getContext("2d"));
    function wt() {
        var t = ht[qt].cursor;
        if (N.id == J && T == I) {
            if (qt == et) {
                var n, a = kt.width, o = Dt;
                if (o <= 0)
                    return;
                M.clearRect(0, 0, a, a);
// TYPOMOD
// desc: cursor with custom color
let e = xt < 10000 ? Lt[xt] : typo.hexToRgb((xt - 10000).toString(16).padStart(6, "0"));
// TYPOEND  
                1 == l.dark && (r = Math.floor(.75 * e[0]),
                i = Math.floor(.75 * e[1]),
                n = Math.floor(.75 * e[2]),
                e = [r, i, n]);
                var r = [e[0], e[1], e[2], .8];
                M.fillStyle = "rgba(" + r[0] + "," + r[1] + "," + r[2] + "," + r[3] + ")",
                M.beginPath(),
                M.arc(a / 2, a / 2, o / 2 - 1, 0, 2 * Math.PI),
                M.fill(),
                M.strokeStyle = "#FFF",
                M.beginPath(),
                M.arc(a / 2, a / 2, o / 2 - 1, 0, 2 * Math.PI),
                M.stroke(),
                M.strokeStyle = "#000",
                M.beginPath(),
                M.arc(a / 2, a / 2, o / 2, 0, 2 * Math.PI),
                M.stroke();
                var i = a / 2
                  , t = "url(" + kt.toDataURL() + ")" + i + " " + i + ", default"
            }
        } else
            t = "default";
        q.style.cursor = t
    }
    var Ct = 0
      , qt = 0
      , xt = 0
      , Mt = 0
      , Lt = [[255, 255, 255], [0, 0, 0], [193, 193, 193], [80, 80, 80], [239, 19, 11], [116, 11, 7], [255, 113, 0], [194, 56, 0], [255, 228, 0], [232, 162, 0], [0, 204, 0], [0, 70, 25], [0, 255, 145], [0, 120, 93], [0, 178, 255], [0, 86, 158], [35, 31, 211], [14, 8, 101], [163, 0, 186], [85, 0, 105], [223, 105, 167], [135, 53, 84], [255, 172, 142], [204, 119, 77], [160, 82, 45], [99, 48, 13]]
      , Dt = 0
      , L = -1
      , $t = [];
    function At(e) {
        return 20 + (e - at) / (ot - at) * 80
    }
    for (let n = 0; n < rt.length; n++) {
        let e = b("size clickable")
          , t = b("icon");
        t.style.backgroundSize = At(rt[n]) + "%",
        e.appendChild(t),
        ct.appendChild(e),
        v(e, "click", function(e) {
            var t = n;
            Tt((t = $t[t]).element),
            Rt(t.size),
            zt()
        }),
        $t.push({
            id: n,
            size: rt[n],
            element: e,
            elementIcon: t
        })
    }
    var Et, It = [b("top"), b("bottom")];
    for (let e = 0; e < Lt.length / 2; e++)
        It[0].appendChild(Ht(2 * e)),
        It[1].appendChild(Ht(2 * e + 1)),
        s.querySelector("#game-toolbar .colors-mobile .top").appendChild(Ht(2 * e)),
        s.querySelector("#game-toolbar .colors-mobile .bottom").appendChild(Ht(2 * e + 1));
    for (let e = 0; e < It.length; e++)
        dt.appendChild(It[e]);
    function Rt(e) {
        Dt = D(e, at, ot);
        let n = $t[$t.length - 1]
          , a = n.size;
        for (let t = 0; t < $t.length; t++) {
            let e = $t[t];
            var o = Math.abs(Dt - e.size);
            o <= a && (a = o,
            n = e,
            t),
            e.element.classList.remove("selected")
        }
        n.element.classList.add("selected"),
        w.querySelector(".size-preview .icon").style.backgroundSize = At(Dt) + "%",
        wt()
    }
    function Tt(e) {
        e.classList.remove("clicked"),
        e.offsetWidth,
        e.classList.add("clicked")
    }
    function Nt(e) {
        Tt(pt[e].element),
        pt[e].action()
    }
    function Wt(e, t) {
        Tt(ht[e].element),
        e == qt && !t || (ht[Ct = qt].element.classList.remove("selected"),
        ht[e].element.classList.add("selected"),
        qt = e,
        wt())
    }
    function Ot(e) {
        var t =
e > 10000 ? Ut(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ut(Lt[e]);
        xt = e,
        s.querySelector("#color-preview-primary").style.fill = t,
        s.querySelector("#game-toolbar .color-picker-mobile .preview").style.backgroundColor = t,
        wt()
    }
    function Yt(e) {
        var t =
e > 10000 ? Ut(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ut(Lt[e]);
        Mt = e,
        s.querySelector("#color-preview-secondary").style.fill = t,
        wt()
    }
    function Pt() {
        var e = xt;
        Ot(Mt),
        Yt(e)
    }
    function zt() {
        ct.classList.remove("open")
    }
    function Ht(e) {
        let t = b("color");
        return t.style.backgroundColor = Ut(Lt[e]),
        t.colorIndex = e,
        t
    }
    function Ut(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }
    function Ft(e) {
/*TYPOMOD   
desc: if color code > 1000 -> customcolor*/if(e < 1000)
        e = D(e, 0, Lt.length),
        e = Lt[e];
else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }
    function Bt(e) {
        if (C = C.slice(0, e),
        !(I != T && mt < e)) {
/* TYPOMOD
        desc: replace draw commands because of redo*/        const keepCommands = C;
        /* TYPOEND*/
            o = Kt();
            e = Math.floor(C.length / Gt);
            yt = yt.slice(0, e),
            en();
            for (var t = 0; t < yt.length; t++) {
                var n = yt[t];
                ft.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = yt.length * Gt; t < C.length; t++)
                _t(jt(C[t]), C[t]);
            gt = Math.min(C.length, gt),
            mt = Math.min(C.length, mt)
        
/* TYPOMOD 
         log kept commands*/
        document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
        /* TYPOEND*/}
    }
    const Gt = 200;
    function Kt() {
        return [0, 9999, 9999, 0, 0]
    }
    function _t(e) {
        var t, n, a;
        o[0] += 1,
        o[1] = Math.min(o[1], e[0]),
        o[2] = Math.min(o[2], e[1]),
        o[3] = Math.max(o[3], e[2]),
        o[4] = Math.max(o[4], e[3]),
        o[0] >= Gt && (e = o[1],
        t = o[2],
        a = o[3],
        n = o[4],
        a = ft.getImageData(e, t, a - e, n - t),
        yt.push({
            data: a,
            bounds: o
        }),
        o = Kt())
    }
    function Xt(e) {
        return (e || 0 < C.length || 0 < vt.length || 0 < gt || 0 < mt) && (C = [],
        vt = [],
        gt = mt = 0,
        o = Kt(),
        yt = [],
        en(),
        1)
    }
    function Vt() {
        Xt() && r && r.emit("data", {
            id: qa
        })
    }
    function Zt(e) {
        !function(e) {
            if (e[0] != Je)
                return e[0] == Qe && (0 <= e[2] && e[2] < q.width && 0 <= e[3] && e[3] < q.height);
            {
                var t = Math.ceil(e[2] / 2)
                  , n = -t
                  , a = -t
                  , o = q.width + t
                  , t = q.height + t;
                return e[3] < o && e[5] > n && e[4] < t && e[6] > a
            }
        }(e) ? console.log("IGNORED COMMAND OUT OF CANVAS BOUNDS") :
/* TYPOMOD 
         log draw commands */
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e })) & 
        /* TYPOEND */ (C.push(e),
        I == T && _t(jt(e)))
    }
    function jt(e) {
        let t = [0, 0, q.width, q.height];
        switch (e[0]) {
        case Je:
            var n = D(Math.floor(e[2]), at, ot)
              , a = Math.ceil(n / 2)
              , o = D(Math.floor(e[3]), -a, q.width + a)
              , r = D(Math.floor(e[4]), -a, q.height + a)
              , i = D(Math.floor(e[5]), -a, q.width + a)
              , l = D(Math.floor(e[6]), -a, q.height + a)
              , s = Ft(e[1]);
            t[0] = D(o - a, 0, q.width),
            t[1] = D(r - a, 0, q.height),
            t[2] = D(i + a, 0, q.width),
            t[3] = D(l + a, 0, q.height),
            Qt(o, r, i, l, n, s.r, s.g, s.b);
            break;
        case Qe:
            var a = Ft(e[1])
              , o = D(Math.floor(e[2]), 0, q.width)
              , r = D(Math.floor(e[3]), 0, q.height)
              , i = o
              , l = r
              , c = a.r
              , d = a.g
              , u = a.b
              , h = ft.getImageData(0, 0, q.width, q.height)
              , p = [[i, l]]
              , f = function(e, t, n) {
                n = 4 * (n * e.width + t);
                return 0 <= n && n < e.data.length ? [e.data[n], e.data[1 + n], e.data[2 + n]] : [0, 0, 0]
            }(h, i, l);
            if (c != f[0] || d != f[1] || u != f[2]) {
                function g(e) {
                    var t = h.data[e]
                      , n = h.data[e + 1]
                      , e = h.data[e + 2];
                    if (t == c && n == d && e == u)
                        return !1;
                    t = Math.abs(t - f[0]),
                    n = Math.abs(n - f[1]),
                    e = Math.abs(e - f[2]);
                    return t < 1 && n < 1 && e < 1
                }
                for (var m, y, v, b, S, k, w = h.height, C = h.width; p.length; ) {
                    for (m = p.pop(),
                    y = m[0],
                    v = m[1],
                    b = 4 * (v * C + y); 0 <= v-- && g(b); )
                        b -= 4 * C;
                    for (b += 4 * C,
                    ++v,
                    k = S = !1; v++ < w - 1 && g(b); )
                        Jt(h, b, c, d, u),
                        0 < y && (g(b - 4) ? S || (p.push([y - 1, v]),
                        S = !0) : S = S && !1),
                        y < C - 1 && (g(b + 4) ? k || (p.push([y + 1, v]),
                        k = !0) : k = k && !1),
                        b += 4 * C
                }
                ft.putImageData(h, 0, 0)
            }
        }
        return t
    }
    function D(e, t, n) {
        return e < t ? t : n < e ? n : e
    }
    function Jt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n,
        e.data[t + 1] = a,
        e.data[t + 2] = o,
        e.data[t + 3] = 255)
    }
    function Qt(e, t, n, a, o, r, i, l) {
        function s(e, t) {
            for (var n = -c; n <= c; n++)
                for (var a, o = -c; o <= c; o++)
                    n * n + o * o < d && (0 <= (a = 4 * ((t + o) * f.width + e + n)) && a < f.data.length && (f.data[a] = r,
                    f.data[1 + a] = i,
                    f.data[2 + a] = l,
                    f.data[3 + a] = 255))
        }
        var c = Math.floor(o / 2)
          , d = c * c
          , o = Math.min(e, n) - c
          , u = Math.min(t, a) - c
          , h = Math.max(e, n) + c
          , p = Math.max(t, a) + c
          , f = (e -= o,
        t -= u,
        n -= o,
        a -= u,
        ft.getImageData(o, u, h - o, p - u));
        if (e == n && t == a)
            s(e, t);
        else {
            s(e, t),
            s(n, a);
            var g = Math.abs(n - e)
              , m = Math.abs(a - t)
              , y = e < n ? 1 : -1
              , v = t < a ? 1 : -1
              , b = g - m;
            for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a; ) {
                var S = b << 1;
                -m < S && (b -= m,
                e += y),
                S < g && (b += g,
                t += v),
                s(e, t)
            }
        }
        ft.putImageData(f, o, u)
    }
    function en() {
/* TYPOMOD
         desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
/* TYPOEND */
        ft.fillStyle = "#FFF",
        ft.fillRect(0, 0, q.width, q.height)
/* TYPOMOD
         desc: dispatch clear event */
        ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
/* TYPOEND */
    }
    function tn(e, t, n, a) {
        var o = q.getBoundingClientRect()
          , e = Math.floor((e - o.left) / o.width * q.width)
          , t = Math.floor((t - o.top) / o.height * q.height);
        a ? (St = n,
        bt[0] = x[0] = e,
        bt[1] = x[1] = t) : (bt[0] = x[0],
        bt[1] = x[1],
        St = n,
        x[0] = e,
        x[1] = t)
    }
    v(w, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    }),
    v("#game-toolbar .colors * .color", "pointerdown", function(e) {
        var t = this.colorIndex;
        let n = 0 == e.button;
        ((n = e.altKey ? !n : n) ? Ot : Yt)(t)
    }),
    v("#game-toolbar .colors-mobile * .color", "pointerdown", function(e) {
        var t = this.colorIndex;
        let n = 0 == e.button;
        ((n = e.altKey ? !n : n) ? Ot : Yt)(t),
        w.querySelector(".colors-mobile").classList.remove("open")
    }),
    v([q], "DOMMouseScroll wheel", function(e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY,
        e = Math.sign(e);
        Rt(Dt + 2 * e)
    }),
    ce("Swap", "S", "Swap the primary and secondary color.", Pt),
    v(w.querySelector(".color-picker .preview"), "click", function(e) {
        Pt()
    }),
    v(w.querySelector(".color-picker-mobile .preview"), "click", function(e) {
        w.querySelector(".colors-mobile").classList.toggle("open")
    }),
    v(st, "click", function(e) {
        ct.classList.toggle("open")
    }),
    v(s, "keyup", function(e) {
        if ("Enter" == e.code)
            return De.focus(),
            0;
        if ("input" == s.activeElement.tagName.toLowerCase() || "textarea" == s.activeElement.tagName.toLowerCase() || -1 != L)
            return 0;
        var n = e.key.toLowerCase().replace("key", "");
        for (let t = 0; t < d.length; t++)
            if (d[t].key.toLowerCase() == n) {
                for (let e = 0; e < d[t].cb.length; e++)
                    d[t].cb[e](d[t]);
                return void e.preventDefault()
            }
    }),
    v(q, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    }),
    u.PointerEvent ? (v(q, "pointerdown", function(e) {
        if (e.preventDefault(),
        (0 == e.button || 2 == e.button || 5 == e.button) && -1 == L)
            switch (e.pointerType) {
            case "mouse":
                on(e.button, e.clientX, e.clientY, !0, -1);
                break;
            case "pen":
                on(e.button, e.clientX, e.clientY, !0, e.pressure);
                break;
            case "touch":
                var t = e.changedTouches;
                0 < t.length && null == Et && (Et = t[0].identitfier,
                on(0, t[0].clientX, t[0].clientY, !0, t[0].force))
            }
    }),
    v(s, "pointermove", function(e) {
        switch (
        e.pointerType) {
        case "mouse":
            an(e.clientX, e.clientY, !1, -1);
            break;
        case "pen":
            an(e.clientX, e.clientY, !1, e.pressure);
            break;
        case "touch":
            var t = e.changedTouches;
            for (let e = 0; e < t.length; e++)
                if (t[e].identitfier == Et) {
                    an(t[e].clientX, t[e].clientY, !1, t[e].force);
                    break
                }
        }
    }),
    v(s, "pointerup", function(e) {
        e.preventDefault(),
        rn(e.button)
    })) : (v(q, "mousedown", function(e) {
        e.preventDefault(),
        0 != e.button && 2 != e.button || -1 != L || on(e.button, e.clientX, e.clientY, !0, -1)
    }),
    v(s, "mouseup", function(e) {
        rn(e.button)
    }),
    v(s, "mousemove", function(e) {
        an(e.clientX, e.clientY, !1, -1)
    }),
    Et = null,
    v(q, "touchstart", function(e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Et && (Et = e[0].identitfier,
        on(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }),
    v(q, "touchend touchcancel", function(e) {
        e.preventDefault(),
        rn(L)
    }),
    v(q, "touchmove", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == Et) {
                an(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    }));
    var nn = 0;
    function an(e, t, n, a) {
        tn(e, t, a = l.pressureSensitivity ? a : -1, n),
        ln(!1)
    }
    function on(e, t, n, a, o) {
        C.length,
        L = e,
        tn(t, n, o, a),
        ln(!0)
    }
    function rn(e) {
        -1 == e || 0 != e && 2 != e && 5 != e || L != e || (nn != C.length && (nn = C.length,
        vt.push(nn)),
        Et = null,
        L = -1)
    }
    function ln(n) {
        if (N.id == J && T == I && -1 != L) {
            var a = 0 == L ? xt : Mt;
            let t = null;
            if (n) {
                n = function(e, t) {
                    var n = (e = ft.getImageData(e, t, 1, 1)).data[0]
                      , a = e.data[1]
                      , o = e.data[2];
                    for (let e = 0; e < Lt.length; e++) {
                        var r = Lt[e]
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
                }(x[0], x[1]);
                if (qt == nt) {
                    if (n == a)
                        return;
                    t = (r = a,
                    l = x[0],
                    s = x[1],
                    [Qe, r, l, s])
                }
                if (qt == tt)
                    return (0 == L ? Ot : Yt)(n),
                    void Wt(Ct)
            }
            if (qt == et) {
                let e = Dt;
                0 <= St && (e = (e - at) * D(St, 0, 1) + at),
                t = (r = a,
                l = e,
                s = bt[0],
                n = bt[1],
                a = x[0],
                o = x[1],
                [Je, r, l, s, n, a, o])
            }
            null != t && Zt(t)
        }
        var o, r, l, s
    }
    setInterval(()=>{
        var e, t;
        r && N.id == J && T == I && 0 < C.length - gt && (e = gt + 8,
        t = C.slice(gt, e),
        r.emit("data", {
            id: Ca,
            data: t
        }),
        gt = Math.min(e, C.length))
    }
    , 50),
    setInterval(function() {
        r && N.id == J && T != I && mt < C.length && (_t(jt(C[mt]), C[mt]),
        mt++)
    }, 3);
    var sn = s.querySelector("#game-canvas .overlay")
      , cn = s.querySelector("#game-canvas .overlay-content")
      , $ = s.querySelector("#game-canvas .overlay-content .text")
      , dn = s.querySelector("#game-canvas .overlay-content .words")
      , un = s.querySelector("#game-canvas .overlay-content .reveal")
      , A = s.querySelector("#game-canvas .overlay-content .result")
      , hn = -100
      , pn = 0
      , fn = void 0;
    function gn(e, r, i) {
        let l = hn
          , s = pn
          , c = e.top - l
          , d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001)
            i && i();
        else {
            let a = void 0
              , o = 0;
            fn = u.requestAnimationFrame(function e(t) {
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
                cn.style.top = hn + "%",
                sn.style.opacity = pn,
                o == r ? i && i() : fn = u.requestAnimationFrame(e)
            })
        }
    }
    function mn(e) {
        e.classList.add("show")
    }
/* TYPOMOD 
     desc: add event handlers for typo features */
    v(".avatar-customizer .container", "pointerdown", () => {
        Zn(typo.createFakeLobbyData());}); 
    /* TYPOEND */
    function yn(l) {
        for (var e = 0; e < cn.children.length; e++)
            cn.children[e].classList.remove("show");
        switch (l.id) {
        case Z:
            mn($),
            $.textContent = k("Round $", l.data + 1);
            break;
        case X:
            mn($),
            $.textContent = k("Waiting for players...");
            break;
        case V:
            mn($),
            $.textContent = k("Game starting in a few seconds...");
            break;
        case Q:
            mn(un),
            un.querySelector("p span.word").textContent = l.data.word,
            un.querySelector(".reason").textContent = function(e) {
                switch (e) {
                case G:
                    return k("Everyone guessed the word!");
                case _:
                    return k("The drawer left the game!");
                case K:
                    return k("Time is up!");
                default:
                    return "Error!"
                }
            }(l.data.reason);
            for (var t = un.querySelector(".player-container"), n = (S(t),
            []), a = 0; a < l.data.scores.length; a += 3) {
                var o = l.data.scores[a + 0]
                  , r = (l.data.scores[a + 1],
                l.data.scores[a + 2]);
                (c = P(o)) && n.push({
                    name: c.name,
                    score: r
                })
            }
            n.sort(function(e, t) {
                return t.score - e.score
            });
            for (a = 0; a < n.length; a++) {
                var s = b("player")
                  , c = n[a]
                  , d = (s.appendChild(b("name", c.name)),
                b("score", (0 < c.score ? "+" : "") + c.score));
                c.score <= 0 && d.classList.add("zero"),
                s.appendChild(d),
                t.appendChild(s)
            }
            break;
        case ee:
            mn(A);
            let i = [A.querySelector(".podest-1"), A.querySelector(".podest-2"), A.querySelector(".podest-3"), A.querySelector(".ranks")];
            for (let e = 0; e < 4; e++)
                S(i[e]);
            if (0 < l.data.length) {
                let r = [[], [], [], []];
                for (let e = 0; e < l.data.length; e++) {
                    var u = {
                        player: P(l.data[e][0]),
                        rank: l.data[e][1],
                        title: l.data[e][2]
                    };
                    u.player && r[Math.min(u.rank, 3)].push(u)
                }
                for (let o = 0; o < 3; o++) {
                    let a = r[o];
                    if (0 < a.length) {
                        var h = a.map(function(e) {
                            return e.player.name
                        }).join(", ")
                          , p = a[0].player.score;
                        let e = i[o]
                          , n = (e.appendChild(b("rank-place", "#" + (o + 1))),
                        e.appendChild(b("rank-name", h)),
                        e.appendChild(b("rank-score", k("$ points", p))),
                        b("avatar-container"));
                        e.appendChild(n),
                        0 == o && n.appendChild(b("trophy"));
                        for (let t = 0; t < a.length; t++) {
                            let e = he(a[t].player.avatar, 0, 0 == o);
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
                    var g = r[3][n];
                    let e = b("rank")
                      , t = he(g.player.avatar, 0, !1);
                    t.style.width = "48px",
                    t.style.height = "48px",
                    e.appendChild(t),
                    e.appendChild(b("rank-name", "#" + (g.rank + 1) + " " + g.player.name)),
                    e.appendChild(b("rank-score", k("$ points", g.player.score))),
                    i[3].appendChild(e)
                }
                0 < r[0].length ? (y = r[0].map(function(e) {
                    return e.player.name
                }).join(", "),
                A.querySelector(".winner-name").textContent = 0 < r[0].length ? y : "<user left>",
                A.querySelector(".winner-text").textContent = " " + (1 == r[0].length ? k("is the winner!") : k("are the winners!"))) : (A.querySelector(".winner-name").textContent = "",
                A.querySelector(".winner-text").textContent = k("Nobody won!"))
            } else
                A.querySelector(".winner-name").textContent = "",
                A.querySelector(".winner-text").textContent = k("Nobody won!");
            break;
        case j:
            if (l.data.words)
                if (mn($),
                mn(dn),
                S(dn),
                Ln[oe.WORDMODE] == re.COMBINATION) {
                    $.textContent = k("Choose the first word");
                    let a = l.data.words.length / 2
                      , o = []
                      , r = []
                      , i = 0;
                    for (let n = 0; n < a; n++) {
                        let e = b("word", l.data.words[n])
                          , t = (e.index = n,
                        b("word", l.data.words[n + a]));
                        t.index = n,
                        t.style.display = "none",
                        t.style.animationDelay = .03 * n + "s",
                        o.push(e),
                        r.push(t),
                        v(e, "click", function() {
                            i = this.index;
                            for (let e = 0; e < a; e++)
                                o[e].style.display = "none",
                                r[e].style.display = "";
                            $.textContent = k("Choose the second word")
                        }),
                        v(t, "click", function() {
                            ra([i, this.index])
                        }),
                        dn.appendChild(e),
                        dn.appendChild(t)
                    }
                } else {
                    $.textContent = k("Choose a word");
                    for (a = 0; a < l.data.words.length; a++) {
                        var m = b("word", l.data.words[a]);
                        m.index = a,
                        v(m, "click", function() {
                            ra(this.index)
                        }),
                        dn.appendChild(m)
                    }
                }
            else {
                mn($);
                var y = (c = P(l.data.id)) ? c.name : k("User");
                $.textContent = k("$ is choosing a word!", y)
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
    function Mn() {
        this.context = null,
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
    Mn.prototype.playSound = function(e) {
        var t, n;
        null != this.context && ("running" != this.context.state ? this.context.resume().then(()=>{
            this.playSound(e)
        }
        ) : null != this.context && !l.audioMute && this.sounds.has(e) && (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer,
        n.connect(this.context.destination),
        n.start(0)))
    }
    ,
    Mn.prototype.load = function() {
        try {
            u.AudioContext = u.AudioContext || u.webkitAudioContext,
            this.context = new AudioContext
        } catch (e) {
            return console.log("Error creating AudioContext."),
            void (this.context = null)
        }
        this.loadSounds()
    }
    ,
    X;
    var r, E = [], I = 0, R = -1, T = -1, Ln = [], N = {
        id: -1,
        time: 0,
        data: 0
    }, Dn = -1, $n = 0, An = void 0, En = new Mn, W = void 0, In = !1, Rn = !1, Tn = s.querySelector("#game-container"), Nn = s.querySelector("#game-room"), O = s.querySelector("#game-players"), Wn = s.querySelector("#game-chat"), st = (s.querySelector("#game-board"),
    s.querySelector("#game-info")), On = s.querySelector("#game-bar"), Yn = O.querySelector(".list"), Pn = O.querySelector(".footer"), zn = s.querySelector("#game-round"), Y = [s.querySelector("#game-word .description"), s.querySelector("#game-word .word"), s.querySelector("#game-word .hints .container")], Hn = s.querySelector("#home .container-name-lang input"), Un = s.querySelector("#home .container-name-lang select"), Fn = s.querySelector("#home .panel .button-play"), Bn = s.querySelector("#home .panel .button-create");
    function Gn(e) {
        In = e,
        s.querySelector("#load").style.display = e ? "block" : "none"
    }
    function Kn(e, t, n, a) {
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
                a && f(ve, k("Servers are currently undergoing maintenance!") + "\n\r" + k("Please try again later!"));
                break;
            default:
                a && f(ve, k("An unknown error occurred ('$')", e) + "\n\r" + k("Please try again later!"))
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
    var _n = null;
    function Xn(t) {
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
                aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (_n = t,
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
    function Vn(e, t, n) {
        En.context.resume(),
        r && oa();
        let a = 0;
        (r = z(e, {
            closeOnBeforeunload: !1
        })).on("connect", function() {
/* TYPOMOD
             desc: disconnect socket & leave lobby */
            document.addEventListener('socketEmit', event => r.emit('data', {id: event.detail.id, data: event.detail.data}));
 typo.disconnect = () => {
                if (r) {
                    r.typoDisconnect = true;
                    r.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    r.off("data");
                    r.reconnect = false;
                    r.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            /* TYPOEND */
            Gn(!1),
            r.on("joinerr", function(e) {
                oa(),
                f(ve, function(e) {
                    switch (e) {
                    case 1:
                        return k("Room not found!");
                    case 2:
                        return k("Room is full!");
                    case 3:
                        return k("You are on a kick cooldown!");
                    case 4:
                        return k("You are banned from this room!");
                    default:
                        return k("An unknown error ('$') occured!", e)
                    }
                }(e))
            }),
            r.on("data", $a);
            var e = Hn.value.split("#")
              , e = {
                join: t,
                create: n ? 1 : 0,
                name: e[0],
                lang: Un.value,
                code: e[1],
                avatar: l.avatar
            };
            r.emit("login", e)
        }),
        r.on("reason", function(e) {
            a = e
        }),
        r.on("disconnect", function() {
/* TYPOMOD
                 DESC: no msg if disconnect intentionally */
                if(!r.typoDisconnect)
                /*TYPOEND*/
            switch (a) {
            case ne:
                f(be, k("You have been kicked!"));
                break;
            case ae:
                f(be, k("You have been banned!"));
                break;
            default:
                f(be, k("Connection lost!"))
            }
            oa()
        }),
        r.on("connect_error", e=>{
            oa(),
            Gn(!1),
            f(ve, e.message)
        }
        )
    }
    function Zn(e) {
        var t;
        En.playSound(kn),
        Wt(et, !0),
        Rt(12),
        Ot(1),
        Yt(0),
        Xt(!0),
        S($e),
        s.querySelector("#home").style.display = "none",
        s.querySelector("#game").style.display = "flex",
        I = e.me,
        Dn = e.type,
        An = e.id,
        s.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id,
        t = e.settings,
        Ln = t,
        jn(),
        S(Yn),
        E = [];
        for (var n = 0; n < e.users.length; n++)
            Aa(e.users[n], !1);
        Na(),
        Oa(),
        Qn(e.round),
        ca(e.owner),
        ta(e.state, !0),
        Rn || ((adsbygoogle = u.adsbygoogle || []).push({}),
        (adsbygoogle = u.adsbygoogle || []).push({}),
        Rn = !0)
    }
    function jn() {
        Qn($n);
        for (var e, t = 0; t < za.length; t++) {
            var n = za[t];
            n.index && (e = Ln[(n = n).index],
            "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
        }
    }
    function Jn(e, t, n) {
        Ln[e] = t,
        n && r && r.emit("data", {
            id: ma,
            data: {
                id: e,
                val: t
            }
        }),
        jn()
    }
    function Qn(e) {
        $n = e,
        zn.textContent = k("Round $ of $", [$n + 1, Ln[oe.ROUNDS]])
    }
    function ea() {
        for (let e = 0; e < E.length; e++)
            E[e].score = 0;
        for (let e = 0; e < E.length; e++)
            Ya(E[e], !1),
            Pa(E[e], !1),
            Wa(E[e])
    }
    function ta(a, e) {
        var t, n;
        if (t = N = a,
        null != fn && (u.cancelAnimationFrame(fn),
        fn = void 0),
        t.id == J || t.id == te ? gn({
            top: -100,
            opacity: 0
        }, 600, function() {
            sn.classList.remove("show")
        }) : sn.classList.contains("show") ? gn({
            top: -100,
            opacity: 1
        }, 600, function() {
            yn(t),
            gn({
                top: 0,
                opacity: 1
            }, 600)
        }) : (sn.classList.add("show"),
        yn(t),
        gn({
            top: 0,
            opacity: 1
        }, 600)),
        n = a.time,
        _a(),
        Ka = n,
        Ba.textContent = Ka,
        Ga = setInterval(function() {
            Ka = Math.max(0, Ka - 1),
            Ba.textContent = Ka;
            var e = -1;
            N.id == J && (e = Ua),
            N.id == j && (e = Fa),
            Ba.style.animationName = Ka < e ? Ka % 2 == 0 ? "rot_left" : "rot_right" : "none",
            Ka < e && En.playSound(qn),
            Ka <= 0 && _a()
        }, 1e3),
        w.classList.add("hidden"),
        wt(),
        aa(!1),
        a.id == te ? (ea(),
        Nn.style.display = "flex",
        Tn.style.display = "none",
        On.style.display = "none",
        Wn.classList.add("room"),
        O.parentNode.removeChild(O),
        Nn.querySelector(".container .players").appendChild(O),
        O.classList.add("room")) : (Nn.style.display = "none",
        Tn.style.display = "",
        On.style.display = "",
        Wn.classList.remove("room"),
        O.parentNode.removeChild(O),
        Tn.prepend(O),
        O.classList.remove("room")),
        a.id == Z && (Qn(a.data),
        0 == a.data && ea()),
        a.id == Q) {
            I != T && sa(a.data.word);
            for (var o = 0; o < a.data.scores.length; o += 3) {
                var r = a.data.scores[o + 0]
                  , i = a.data.scores[o + 1]
                  , r = (a.data.scores[o + 2],
                P(r));
                r && (r.score = i)
            }
            Oa();
            for (var l = !0, o = 0; o < E.length; o++)
                if (E[o].guessed) {
                    l = !1;
                    break
                }
            l ? En.playSound(Sn) : En.playSound(bn),
            m(k("The word was '$'", a.data.word), "", g(Re), !0)
/* TYPOMOD
             desc: log finished drawing */
            ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: a.data.word }));
            /* TYPOEND */
        } else
            a.id != J && (Y[0].textContent = k("WAITING"),
            Y[0].classList.add("waiting"),
            Y[1].style.display = "none",
            Y[2].style.display = "none");
        if (a.id == J) {
            if (T = a.data.id,
            En.playSound(vn),
            Xt(!0),
            a.data.drawCommands && (C = a.data.drawCommands),
            m(k("$ is drawing now!", P(T).name), "", g(Ie), !0),
            !e)
                for (o = 0; o < E.length; o++)
                    Ya(E[o], !1);
            Y[0].classList.remove("waiting"),
            T == I ? (n = a.data.word,
            Y[0].textContent = k("DRAW THIS"),
            Y[1].style.display = "",
            Y[2].style.display = "none",
            Y[1].textContent = n,
            w.classList.remove("hidden"),
            wt()) : (aa(!0),
            ia(a.data.word, !1),
            la(a.data.hints))
        } else {
            T = -1;
            for (o = 0; o < E.length; o++)
                Ya(E[o], !1)
        }
        if (a.id == ee && 0 < a.data.length) {
            let t = []
              , n = 0;
            for (let e = 0; e < a.data.length; e++) {
                var s = a.data[e][0]
                  , c = a.data[e][1]
                  , s = P(s);
                s && 0 == c && (n = s.score,
                t.push(s.name))
            }
            1 == t.length ? m(k("$ won with a score of $!", [t[0], n]), "", g(Ne), !0) : 1 < t.length && m(k("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", g(Ne), !0)
        }
        for (o = 0; o < E.length; o++)
            Pa(E[o], E[o].id == T);
        Na()
    }
    function na(e) {
        r && r.connected && N.id == J && (r.emit("data", {
            id: pa,
            data: e
        }),
        aa(!1))
    }
    function aa(e) {
        s.querySelector("#game-rate").style.display = e ? "" : "none"
    }
    function oa() {
        r && r.close(),
        r = void 0,
        Xt(),
        _a(),
        E = [],
        Ln = [],
        N = {
            id: T = R = -1,
            time: I = 0,
            data: 0
        },
        s.querySelector("#home").style.display = "",
        s.querySelector("#game").style.display = "none"
    }
    function ra(e) {
        r && r.connected && N.id == j && r.emit("data", {
            id: wa,
            data: e
        })
    }
    function ia(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++)
            n += t[e];
        var a = !e && 1 == Ln[oe.WORDMODE];
        a && (n = 3),
        Y[0].textContent = k(a ? "WORD HIDDEN" : "GUESS THIS"),
        Y[1].style.display = "none",
        Y[2].style.display = "",
        S(Y[2]),
        Y[2].hints = [];
        for (var o = 0; o < n; o++)
            Y[2].hints[o] = b("hint", a ? "?" : "_"),
            Y[2].appendChild(Y[2].hints[o]);
        a || Y[2].appendChild(b("word-length", t.join(" ")))
    }
    function la(e) {
        for (var t = Y[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0]
              , o = e[n][1];
            t[a].textContent = o,
            t[a].classList.add("uncover")
        }
    }
    function sa(e) {
        (!Y[2].hints || Y[2].hints.length < e.length) && ia([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++)
            t.push([n, e.charAt(n)]);
        la(t)
    }
    function ca(e) {
        R = e;
        for (var t = 0; t < E.length; t++)
            fe(E[t].element, E[t].id == R),
            Ra(E[t], 0, E[t].id == R);
        var n = I != R;
        s.querySelector("#start-game").disabled = n;
        for (var a = 0; a < za.length; a++) {
            let e = za[a];
            e.element.disabled = n
        }
        e = P(R);
        e && m(k("$ is now the room owner!", e.name), "", g(Ne), !0)
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
                _n()
            },
            AIP_REMOVE: function() {}
        })
    });
    const da = 1
      , ua = 2
      , ha = 5
      , pa = 8
      , fa = 10
      , ga = 11
      , ma = 12
      , ya = 13
      , va = 14
      , ba = 15
      , Sa = 16
      , ka = 17
      , wa = 18
      , Ca = 19
      , qa = 20
      , xa = 21;
    const Ma = 30
      , La = 31
      , Da = 32;
    function $a(e) {
        var t = e.id
          , n = e.data;
        switch (t) {
        case fa:
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
            Ka = n;
            break;
        case da:
            m(k("$ joined the room!", Aa(n, !0).name), "", g(Re), !0),
            En.playSound(kn);
            break;
        case ua:
            var a = function(e) {
                for (var t = 0; t < E.length; t++) {
                    var n = E[t];
                    if (n.id == e)
                        return E.splice(t, 1),
                        n.element.remove(),
                        Oa(),
                        Na(),
                        n
                }
                return
            }(n.id);
            a && (m(function(e, t) {
                switch (e) {
                default:
                    return k("$ left the room!", t);
                case ne:
                    return k("$ has been kicked!", t);
                case ae:
                    return k("$ has been banned!", t)
                }
            }(n.reason, a.name), "", g(Te), !0),
            En.playSound(wn),
            n.reason != ne && n.reason != ae || Xt(!0));
            break;
        case ha:
            var a = P(n[0])
              , o = P(n[1])
              , r = n[2]
              , i = n[3];
            a && o && m(k("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", g(Ee), !0);
            break;
        case ba:
            a = P(n.id);
            if (a) {
                let e = m(k("$ guessed the word!", a.name), "", g(Re), !0);
                e.classList.add("guessed"),
                Ya(a, !0),
                En.playSound(Cn),
                n.id == I && sa(n.word)
            }
            break;
        case pa:
            o = P(n.id);
            o && (r = o,
            i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif",
            (a = b("icon")).style.backgroundImage = "url(/img/" + i + ")",
            Ia(r, a),
            n.vote ? m(k("$ liked the drawing!", o.name), "", g(Re), !0) : m(k("$ disliked the drawing!", o.name), "", g(Te), !0));
            break;
        case ka:
            ca(n);
            break;
        case Sa:
            m(k("$ is close!", n), "", g(Ee), !0);
            break;
        case Ma:
            Ea(P(n.id), n.msg);
            break;
        case Da:
            m(k("Spam detected! You're sending messages too quickly."), "", g(Te), !0);
            break;
        case La:
            switch (n.id) {
            case 0:
                m(k("You need at least 2 players to start the game!"), "", g(Te), !0);
                break;
            case 100:
                m(k("Server restarting in about $ seconds!", n.data), "", g(Te), !0)
            }
            break;
        case Ca:
            for (var l = 0; l < n.length; l++)
                Zt(n[l]);
            break;
        case qa:
            Xt(!0);
            break;
        case xa:
            Bt(n);
            break;
        default:
            return void console.log("Unimplemented data packed received with id " + t)
        }
    }
    function P(e) {
        for (var t = 0; t < E.length; t++) {
            var n = E[t];
            if (n.id == e)
                return n
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
            element: b("player"),
            bubble: void 0
        }
          , e = (E.push(n),
        n.id == I ? k("$ (You)", n.name) : n.name)
          , a = b("info")
          , e = b("name", e)
          , o = (n.id == I && e.classList.add("me"),
        a.appendChild(e),
        a.appendChild(b("rank", "#" + n.rank)),
        a.appendChild(b("score", k("$ points", n.score))),
        n.element.appendChild(a),
        he(n.avatar))
          , e = (n.element.drawing = b("drawing"),
        o.appendChild(n.element.drawing),
        n.element.appendChild(o),
        Yn.appendChild(n.element),
        v(n.element, "click", function() {
            W = n,
            f(h, n)
        }),
        4 == (4 & n.flags) && (n.interval = setInterval(function() {
            n.avatar[0] = (n.avatar[0] + 1) % B[0],
            pe(o, n.avatar)
        }, 250)),
/* TYPOMOD
         desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id),
        /* TYPOEND */
        b("icons"))
          , a = b("icon owner")
          , r = b("icon muted");
        return e.appendChild(a),
        e.appendChild(r),
        n.element.appendChild(e),
        n.element.icons = [a, r],
        Ya(n, n.guessed),
        t && Na(),
        n
    }
    function Ea(e, t) {
        var n;
        e.muted || (n = e.id == T || e.guessed,
        I != T && !P(I).guessed && n || (Ia(e, b("text", t)),
        m(e.name, t, g(n ? We : Ae))))
    }
    function Ia(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout),
        e.bubble.remove(),
        e.bubble = void 0);
        var n = b("bubble")
          , a = b("content");
        a.appendChild(t),
        n.appendChild(b("arrow")),
        n.appendChild(a),
        e.element.appendChild(n),
        e.bubble = n,
        e.bubble.timeout = setTimeout(function() {
            e.bubble.remove(),
            e.bubble = void 0
        }, 1500)
    }
    function Ra(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ta = void 0;
    function Na() {
        var e = N.id == te
          , t = e ? 112 : 48
          , n = Math.max(t, Yn.clientHeight);
        let a = Math.floor(n / t);
        e && (n = Math.floor(Yn.clientWidth / 96),
        a *= n);
        t = Math.ceil(E.length / a);
        for (let e = 0; e < E.length; e++)
            E[e].page = Math.floor(e / a);
        e = s.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = E.length,
        e[1].textContent = Ln[oe.SLOTS],
        null == Ta ? Ta = ge(Pn, t, [O], function(e, n, t) {
            let a = [];
            for (let t = 0; t < E.length; t++) {
                let e = E[t];
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
        }) : me(Ta, t),
        Ta.element.style.display = 1 < t ? "" : "none"
    }
    function Wa(t) {
        let n = 1;
        for (let e = 0; e < E.length; e++) {
            var a = E[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n,
        t.element.querySelector(".score").textContent = k("$ points", t.score);
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n,
        e.classList.remove("first"),
        e.classList.remove("second"),
        e.classList.remove("third"),
        1 == n && e.classList.add("first"),
        2 == n && e.classList.add("second"),
        3 == n && e.classList.add("third")
    }
    function Oa() {
        for (var e = 0; e < E.length; e++)
            Wa(E[e])
    }
    function Ya(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }
    function Pa(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var za = [];
    {
        let e = Nn.querySelectorAll('*[id^="item-"]');
        for (var Ha = 0; Ha < e.length; Ha++) {
            let t = {
                id: e[Ha].id.replace("item-settings-", ""),
                element: e[Ha],
                index: e[Ha].dataset.setting
            };
            za.push(t),
            v(t.element, "change", function() {
                let e = this.value;
                "checkbox" == this.type && (e = this.checked ? 1 : 0),
                null != t.index && Jn(t.index, e, !0)
            })
        }
    }
    const Ua = 10
      , Fa = 4;
    var Ba = s.querySelector("#game-clock")
      , Ga = null
      , Ka = 0;
    function _a() {
        Ga && (clearInterval(Ga),
        Ga = null)
    }
    var Xa, Va = s.querySelector("#tutorial"), Za = Va.querySelectorAll(".page"), ja = ge(Va, Za.length, [Va.querySelector(".pages")], function(e, t, n) {
        n && clearInterval(Ja);
        for (let e = 0; e < Za.length; e++)
            Za[e].classList.remove("active");
        Za[t].classList.add("active")
    }), Ja = setInterval(function() {
        ja.selected < 4 ? ye(ja, ja.selected + 1, !1) : ye(ja, 0, !1)
    }, 3500), Qa = s.querySelector("#setting-bar"), eo = s.querySelector("#audio"), to = s.querySelector("#lightbulb");
    function no() {
        Qa.classList.remove("open")
    }
    function ao(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }
    function oo() {
        eo.dataset.tooltip = l.audioMute ? "Unmute audio" : "Mute audio",
        to.dataset.tooltip = l.dark ? "Turn the lights on" : "Turn the lights off",
        y && (y.querySelector(".tooltip-content").textContent = k(Ye.dataset.tooltip))
    }
    function ro() {
        m(k("Copied room link to clipboard!"), "", g(Ee), !0);
        var e = "https://skribbl.io/?" + An;
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
    function io(e) {
        let t = Le.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }
    function lo(e) {
        r && r.connected ? r.emit("data", {
            id: Ma,
            data: e
        }) : Ea(P(I), e)
    }
    v(Qa.querySelector(".icon"), "click", function() {
        ao(eo, l.audioMute),
        ao(to, l.dark),
        oo(),
        Qa.classList.contains("open") ? no() : Qa.classList.add("open")
    }),
    v("#audio", "click", function(e) {
        l.audioMute = !l.audioMute,
        ao(eo, l.audioMute),
        oo(),
        t()
    }),
    v("#lightbulb", "click", function(e) {
        a(!l.dark),
        ao(to, l.dark),
        oo(),
        t()
    }),
    v("#hotkeys", "click", function(e) {
        no(),
        f(ke)
    }),
    u.onbeforeunload = function(e) {
        return r ? k("Are you sure you want to leave?") : void 0
    }
    ,
    u.onunload = function() {
        r && oa()
    }
    ,
    v([s, q], "mousedown touchstart", function(e) {
        Qa.contains(e.target) || no(),
        s.querySelector("#game-toolbar .sizes").contains(e.target) || zt()
    }),
    v(u, "resize", Na),
    v([Hn, Un], "change", t),
    v(Fn, "click",typo.joinFn = function() {
        var t, e, n, a, o;
        n = u.location.href,
        o = "",
        n = n.split("?"),
        t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o,
        In || (e = "" != t ? "id=" + t : "lang=" + Un.value,
        Me(),
        Gn(!0),
        Xn(function() {
            Kn(location.origin + ":3000/play", e, function(e) {
                Gn(!1),
                e.success && Vn(e.data, t)
            }, !0)
        }))
    }),
    v(Bn, "click", function() {
        In || (Me(),
        Gn(!0),
        Xn(function() {
            Kn(location.origin + ":3000/play", "lang=" + Un.value, function(e) {
                e.success ? Vn(e.data, 0, 1) : Gn(!1)
            }, !0)
        }))
    }),
    v(s.querySelector("#game-rate .like"), "click", function() {
        na(1)
    }),
    v(s.querySelector("#game-rate .dislike"), "click", function() {
        na(0)
    }),
    v(st, "click", function() {
        f(Se)
    }),
    v(s.querySelector("#start-game"), "click", function() {
        if (r) {
            let t = s.querySelector("#item-settings-customwords").value.split(",")
              , e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++)
                    t[e] = t[e].trim();
                e = t.join(",")
            }
            r.emit("data", {
                id: 22,
                data: e
            })
        }
    }),
    v(s.querySelector("#copy-invite"), "click", ro),
    v(p[h].querySelector("button.kick"), "click", function() {
        Me(),
        null != W && W.id != I && I == R && r && r.emit("data", {
            id: 3,
            data: W.id
        })
    }),
    v(p[h].querySelector("button.ban"), "click", function() {
        Me(),
        null != W && W.id != I && I == R && r && r.emit("data", {
            id: 4,
            data: W.id
        })
    }),
    v(p[h].querySelector("button.votekick"), "click", function() {
        Me(),
        null != W && W.id != I && r && (W.id == R ? m(k("You can not votekick the lobby owner!"), "", g(Te), !0) : r.emit("data", {
            id: ha,
            data: W.id
        }))
    }),
    v(p[h].querySelector("button.mute"), "click", function() {
        null != W && W.id != I && (W.muted = !W.muted,
        Ra(W, 1, W.muted),
        W.muted ? m(k("You muted '$'!", W.name), "", g(Te), !0) : m(k("You unmuted '$'!", W.name), "", g(Te), !0),
        r && r.emit("data", {
            id: 7,
            data: W.id
        }),
        xe(W.muted))
    }),
    v(p[h].querySelector("button.report"), "click", function() {
        p[h].querySelector(".buttons").style.display = "none",
        p[h].querySelector(".report-menu").style.display = "";
        let t = p[h].querySelectorAll(".report-menu input");
        for (let e = 0; e < t.length; e++)
            t[e].checked = !1
    }),
    v(p[h].querySelector("button#report-send"), "click", function() {
        let e = 0;
        p[h].querySelector("#report-reason-toxic").checked && (e |= 1),
        p[h].querySelector("#report-reason-spam").checked && (e |= 2),
        p[h].querySelector("#report-reason-bot").checked && (e |= 4),
        0 < e && (null != W && W.id != I && (W.reported = !0,
        r && r.emit("data", {
            id: 6,
            data: {
                id: W.id,
                reasons: e
            }
        }),
        m(k("Your report for '$' has been sent!", W.name), "", g(Ee), !0)),
        Me())
    }),
    v(p[ke].querySelector("#select-display-language"), "change", function(e) {
        l.displayLang = e.target.value,
        t(),
        je()
    }),
    v(p[ke].querySelector("#select-pressure-sensitivity"), "change", function(e) {
        l.pressureSensitivity = e.target.value,
        t()
    }),
    v(p[ke].querySelector("button.reset"), "click", function() {
        for (let e = 0; e < d.length; e++)
            d[e].key = d[e].def;
        de()
    }),
    v(s.querySelector("#game-keyboard button.settings"), "click", function(e) {
        f(ke)
    }),
    v(De, "focusin focus", function(e) {
        e.preventDefault()
    }),
    v(De, "input", function(e) {
        io(De.value.length)
    }),
    v(Le, "submit", function(e) {
const input = De; let rest = input.value.substring(100);
        input.value = input.value.substring(0,100);
        if(rest.length > 0) setTimeout(()=>{input.value = rest; e.target.dispatchEvent(new Event("submit"));},180);
        return e.preventDefault(),
        De.value && lo(De.value),
        Le.reset(),
        io(0),
        !1
    }),
    u.localStorageAvailable ? (Hn.value = e("name", ""),
    Un.value = function(t) {
        var n = s.querySelectorAll("#home .panel .container-name-lang select option");
        for (let e = 0; e < n.length; e++)
            if (n[e].value == t)
                return n[e].value;
        return 0
    }(e("lang", 0)),
    l.displayLang = e("displaylang", "en"),
    l.audioMute = 1 == parseInt(e("audio", 0)) ? 1 : 0,
    l.filterChat = 1 == parseInt(e("filter", 1)) ? 1 : 0,
    l.pressureSensitivity = 1 == parseInt(e("pressure", 1)) ? 1 : 0,
    l.avatar = (Va = "ava",
    Fn = l.avatar,
    null == (Va = c.getItem(Va)) ? Fn : JSON.parse(Va)),
    Ge.value = e("keyboard", 1),
    Ke.value = e("keyboardlayout", "en"),
    Be(),
    a(1 == parseInt(e("dark", 0)) ? 1 : 0),
    console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
    var so = s.querySelectorAll("[data-translate]");
    for (let e = 0; e < so.length; e++) {
        var co = so[e];
        Ze(co, co.dataset.translate)
    }
    function uo(e) {
        Xa.parts[e].classList.remove("bounce"),
        Xa.parts[e].offsetWidth,
        Xa.parts[e].classList.add("bounce")
    }
    je(),
    v(Bn = s.querySelectorAll("[data-tooltip]"), "mouseenter", function(e) {
        Pe(e.target)
    }),
    v(Bn, "mouseleave", function(e) {
        ze()
    }),
    Fn = (st = s.querySelector("#home .avatar-customizer")).querySelector(".container"),
    Va = st.querySelectorAll(".arrows.left .arrow"),
    Bn = st.querySelectorAll(".arrows.right .arrow"),
    st = st.querySelectorAll(".randomize"),
    (Xa = he(l.avatar)).classList.add("fit"),
    Fn.appendChild(Xa),
    v(Va, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        --l.avatar[e],
        l.avatar[e] < 0 && (l.avatar[e] = B[e] - 1),
        uo(e),
        pe(Xa, l.avatar),
        t()
    }),
    v(Bn, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        l.avatar[e] += 1,
        l.avatar[e] >= B[e] && (l.avatar[e] = 0),
        uo(e),
        pe(Xa, l.avatar),
        t()
    }),
    v(st, "click", function() {
        l.avatar[0] = Math.floor(Math.random() * B[0]),
        l.avatar[1] = Math.floor(Math.random() * B[1]),
        l.avatar[2] = Math.floor(Math.random() * B[2]),
        uo(1),
        uo(2),
        pe(Xa, l.avatar),
        t()
    });
    {
        var ho = Math.round(8 * Math.random());
        let t = s.querySelector("#home .logo-big .avatar-container");
        for (var po = 0; po < 8; po++) {
            let e = [0, 0, 0, -1];
            e[0] = po,
            e[1] = Math.round(100 * Math.random()) % U,
            e[2] = Math.round(100 * Math.random()) % F,
            1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random()));
            var fo = he(e, 0, ho == po);
            t.append(fo)
        }
    }
}(window, document, localStorage, io);
