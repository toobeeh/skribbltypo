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
        joinLobby: undefined,        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input -> Un
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> l
            return { id: id, name: name.length != 0 ? name : (Un.value.split("#")[0] != "" ? Un.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? l.avatar : avatar, score: score, guessed: guessed };
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
                //Xn(true);
                setTimeout(() => {
                    typo.lastConnect = Date.now();
                    //Bn.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                    //Rn = !1 // IDENTIFY: x:  = !1   
                    if(e.detail) window.history.pushState({path:window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);////##JOINLOBBY##(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                    typo.joinLobby(); window.history.pushState({path:window.location.origin}, '', window.location.origin);//Kn(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else ra() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = Dt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
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
            je(l, "text"),
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
            p[we].querySelector("#hotkey-list").appendChild(i.listing)
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
        u.localStorageAvailable ? (c.setItem("name", Un.value),
        c.setItem("lang", Fn.value),
        c.setItem("displaylang", l.displayLang),
        c.setItem("audio", 1 == l.audioMute ? 1 : 0),
        c.setItem("dark", 1 == l.dark ? 1 : 0),
        c.setItem("filter", 1 == l.filterChat ? 1 : 0),
        c.setItem("pressure", 1 == l.pressureSensitivity ? 1 : 0),
        c.setItem("ava", JSON.stringify(l.avatar)),
        c.setItem("keyboard", Ke.value),
        c.setItem("keyboardlayout", _e.value),
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
        e.parentNode && e.parentNode.removeChild(e),
        n ? t.prepend(e) : t.appendChild(e)
    }
    function pe(e, t, n) {
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
        fe(a, e),
        a
    }
    function fe(e, t) {
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
    function ge(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }
    function me(e, t, n, a) {
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
            ve(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)),
            e.preventDefault(),
            e.stopPropagation()
        }),
        ye(o, t),
        o
    }
    function ye(n, e) {
        S(n.element),
        n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = b("dot");
            e.appendChild(b("inner")),
            v(e, "click", function() {
                ve(n, t, !0)
            }),
            n.element.appendChild(e),
            n.dots.push(e)
        }
        n.selected < 0 && (n.selected = 0),
        n.selected >= e && (n.selected = e - 1),
        ve(n, n.selected, !1)
    }
    function ve(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++)
                t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"),
            t.change(t, e, n)
        }
    }
    const h = 0
      , be = 1
      , Se = 2
      , ke = 3
      , we = 4
      , Ce = 5;
    var n = s.querySelector("#modal")
      , qe = n.querySelector(".title .text")
      , xe = n.querySelector(".content")
      , p = [];
    function Me(e) {
        p[h].querySelector(".buttons button.mute").textContent = k(e ? "Unmute" : "Mute")
    }
    function f(e, a) {
        n.style.display = "block";
        for (var t = 0; t < p.length; t++)
            p[t].style.display = "none";
        p[e].style.display = "flex";
        let r = p[e];
        switch (e) {
        case be:
            qe.textContent = k("Something went wrong!"),
            r.querySelector(".message").textContent = a;
            break;
        case Se:
            qe.textContent = k("Disconnected!"),
            r.querySelector(".message").textContent = a;
            break;
        case h:
            {
                qe.textContent = "";
                let e = r.querySelector(".buttons")
                  , t = (e.style.display = a.id == I ? "none" : "flex",
                e.querySelector(".button-pair").style.display = I == R ? "flex" : "none",
                e.querySelector("button.report").style.display = a.reported ? "none" : "",
                Me(a.muted),
                r.querySelector(".report-menu").style.display = "none",
                xe.querySelector(".player"))
                  , n = (S(t),
                pe(a.avatar));
                ge(n, R == a.id),
                n.style.width = "96px",
                n.style.height = "96px",
                t.appendChild(n),
                t.appendChild(b("name", a.id == I ? k("$ (You)", a.name) : a.name))
            }
            break;
        case Ce:
            qe.textContent = k("Rooms"),
            roomsUpdate(a);
            break;
        case ke:
            {
                qe.textContent = 0 == Dn ? "Public Room" : "Private Room",
                S(r);
                var i = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"];
                let o = b("settings");
                for (let a = 0; a < T.length; a++) {
                    let e = b("setting")
                      , t = ue("img", "icon")
                      , n = (t.src = "/img/setting_" + a + ".gif",
                    e.appendChild(t),
                    e.appendChild(ue("span", "name", i[a] + ":")),
                    T[a]);
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
                v(e.querySelector("#copy-invite"), "click", io),
                r.appendChild(e)
            }
            break;
        case we:
            qe.textContent = k("Settings"),
            r.querySelector("#select-display-language").value = l.displayLang,
            r.querySelector("#select-pressure-sensitivity").value = l.pressureSensitivity
        }
    }
    function Le() {
        n.style.display = "none"
    }
    p[h] = n.querySelector(".container-player"),
    p[be] = n.querySelector(".container-info"),
    p[Se] = n.querySelector(".container-info"),
    p[ke] = n.querySelector(".container-room"),
    p[we] = n.querySelector(".container-settings"),
    v(u, "click", function(e) {
        e.target == n && Le()
    }),
    v([n.querySelector(".close"), p[be].querySelector("button.ok")], "click", Le);
    var De = s.querySelector("#game-chat form")
      , $e = s.querySelector("#game-chat form input")
      , Ae = s.querySelector("#game-chat .chat-content");
    const Ee = 0;
    const Ie = 2
      , Re = 3
      , Ne = 4
      , Te = 5
      , We = 6
      , Oe = 7
      , Ye = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];
    function g(e) {
        return "var(--COLOR_CHAT_TEXT_" + Ye[e] + ")"
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
        Ae.scrollHeight - Ae.scrollTop - Ae.clientHeight <= 20);
        if (Ae.appendChild(o),
        e && (Ae.scrollTop = Ae.scrollHeight + 100),
        0 < l.chatDeleteQuota)
            for (; Ae.childElementCount > l.chatDeleteQuota; )
                Ae.firstElementChild.remove();
        return o
    }
    let y = void 0
      , Pe = void 0;
    function ze(e) {
        He();
        var t = (Pe = e).dataset.tooltip;
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
    function He() {
        y && (y.remove(),
        y = void 0,
        Pe = void 0)
    }
    const Ue = [{
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
    var Fe = {
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
                if (Be.has(n)) {
                    let t = Be.get(n);
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
            Fe.elements.input.textContent = Fe.input
        },
        inputAdd: function(e) {
            this.input += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e),
            this.inputChanged(),
            this.caps && this.toggleCaps()
        },
        enter: function() {
            0 < this.input.length && (so(this.input),
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
    const Be = new Map;
    function Ge() {
        1 == Ke.value ? s.documentElement.dataset.mobileKeyboard = "" : delete s.documentElement.dataset.mobileKeyboard
    }
    Be.set("backspace", {
        class: "wide",
        icon: "backspace",
        callback: function(e) {
            0 < e.input.length && (e.input = e.input.slice(0, -1),
            e.inputChanged())
        }
    }),
    Be.set("caps", {
        class: "wide",
        icon: "keyboard_capslock",
        callback: function(e) {
            e.toggleCaps()
        }
    }),
    Be.set("enter", {
        class: "wide",
        icon: "keyboard_return",
        callback: function(e) {
            e.enter()
        }
    }),
    Be.set("space", {
        class: "extra-wide",
        icon: "space_bar",
        callback: function(e) {
            e.input += " ",
            e.inputChanged()
        }
    }),
    Fe.init(Ue[0]);
    var Ke = s.querySelector("#select-mobile-keyboard-enabled")
      , _e = s.querySelector("#select-mobile-keyboard-layout");
    for (let t = 0; t < Ue.length; t++) {
        let e = ue("option");
        e.textContent = Ue[t].name,
        e.value = Ue[t].code,
        _e.appendChild(e)
    }
    v(_e, "change", function(e) {
        let t = void 0;
        for (let e = 0; e < Ue.length; e++)
            Ue[e].code == this.value && (t = Ue[e]);
        null != t && Fe.init(t)
    }),
    v([Ke, _e], "change", function(e) {
        t(),
        Ge()
    });
    let Xe = {}
      , Ve = [];
    function Ze(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }
    function k(t, n) {
        var e = Ze(Xe[l.displayLang], t);
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
    function je(t, n) {
        if ("children" == n)
            for (let e = 0; e < t.children.length; e++) {
                var a = t.children[e].dataset.translate;
                je(t.children[e], null == a ? "text" : a)
            }
        else {
            let e = "";
            "text" == n && (e = t.textContent),
            0 < (e = "placeholder" == n ? t.placeholder : e).length ? Ve.push({
                key: e,
                element: t,
                type: n
            }) : (console.log("Empty key passed to translate with!"),
            console.log(t))
        }
    }
    function Je() {
        var n = Xe[l.displayLang];
        for (let t = 0; t < Ve.length; t++) {
            let e = Ve[t];
            var a = Ze(n, e.key);
            "text" == e.type && (e.element.textContent = a),
            "placeholder" == e.type && (e.element.placeholder = a)
        }
    }
    Xe.en = {},
    Xe.de = {
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
    const Qe = 0
      , et = 1;
    const tt = 0
      , nt = 2
      , at = 1;
    const ot = 4
      , rt = 40;
    var it = [4, 10, 20, 32, 40]
      , w = s.querySelector("#game-toolbar")
      , lt = w.querySelector(".tools-container .tools")
      , st = w.querySelector(".tools-container .actions")
      , ct = s.querySelector("#game-toolbar .sizes .size-preview")
      , dt = s.querySelector("#game-toolbar .sizes .container")
      , ut = s.querySelector("#game-toolbar .colors");
    function ht(e, t) {
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
            ze(e.target)
        }),
        v(r, "mouseleave", function(e) {
            He()
        }),
        t.isAction ? (n.addEventListener("click", function(e) {
            Tt(this.toolIndex)
        }),
        st.appendChild(n),
        ft[e] = a,
        ce(t.name, t.keydef, "", function() {
            Tt(e)
        }, function(e) {
            o.textContent = e.key
        })) : (n.addEventListener("click", function(e) {
            Wt(this.toolIndex)
        }),
        lt.appendChild(n),
        pt[e] = a,
        ce(t.name, t.keydef, "", function() {
            Wt(a.id)
        }, function(e) {
            o.textContent = e.key
        })),
        t.hide && (n.style.display = "none")
    }
    var pt = []
      , ft = (ht(tt, {
        isAction: !1,
        name: "Brush",
        keydef: "B",
        graphic: "pen.gif",
        cursor: 0
    }),
    ht(at, {
        isAction: !1,
        name: "Fill",
        keydef: "F",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    }),
    [])
      , q = (ht(0, {
        isAction: !0,
        name: "Undo",
        keydef: "U",
        graphic: "undo.gif",
        action: function() {
            {
                var e;
                0 < bt.length && (bt.pop(),
                0 < bt.length ? (Bt(e = bt[bt.length - 1]),
                o && o.emit("data", {
                    id: Ma,
                    data: e
                })) : Vt())
            }
        }
    }),
    ht(1, {
        isAction: !0,
        name: "Clear",
        keydef: "C",
        graphic: "clear.gif",
        action: Vt
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
        graphic: "",
        action: ()=>{document.dispatchEvent(new Event("openBrushLab"));}
    }) /*TYPOEND*/,
    s.querySelector("#game-canvas canvas"))
      , gt = q.getContext("2d")
      , C = []
      , mt = 0
      , yt = 0
      , vt = []
      , r = [0, 9999, 9999, 0, 0]
      , bt = []
      , x = [0, 0]
      , St = [0, 0]
      , kt = 0
      , wt = s.createElement("canvas")
      , M = (wt.width = rt + 2,
    wt.height = rt + 2,
    wt.getContext("2d"));
    function Ct() {
        var t = pt[xt].cursor;
        if (W.id == J && N == I) {
            if (xt == tt) {
                var n, a = wt.width, o = $t;
                if (o <= 0)
                    return;
                M.clearRect(0, 0, a, a);
// TYPOMOD
// desc: cursor with custom color
let e = Mt < 10000 ? Dt[Mt] : typo.hexToRgb((Mt - 10000).toString(16).padStart(6, "0"));
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
                  , t = "url(" + wt.toDataURL() + ")" + i + " " + i + ", default"
            }
        } else
            t = "default";
        q.style.cursor = t
    }
    var qt = 0
      , xt = 0
      , Mt = 0
      , Lt = 0
      , Dt = [[255, 255, 255], [0, 0, 0], [193, 193, 193], [80, 80, 80], [239, 19, 11], [116, 11, 7], [255, 113, 0], [194, 56, 0], [255, 228, 0], [232, 162, 0], [0, 204, 0], [0, 70, 25], [0, 255, 145], [0, 120, 93], [0, 178, 255], [0, 86, 158], [35, 31, 211], [14, 8, 101], [163, 0, 186], [85, 0, 105], [223, 105, 167], [135, 53, 84], [255, 172, 142], [204, 119, 77], [160, 82, 45], [99, 48, 13]]
      , $t = 0
      , L = -1
      , At = [];
    function Et(e) {
        return 20 + (e - ot) / (rt - ot) * 80
    }
    for (let n = 0; n < it.length; n++) {
        let e = b("size clickable")
          , t = b("icon");
        t.style.backgroundSize = Et(it[n]) + "%",
        e.appendChild(t),
        dt.appendChild(e),
        v(e, "click", function(e) {
            var t = n;
            Nt((t = At[t]).element),
            Rt(t.size),
            zt()
        }),
        At.push({
            id: n,
            size: it[n],
            element: e,
            elementIcon: t
        })
    }
    var It = [b("top"), b("bottom")];
    for (let e = 0; e < Dt.length / 2; e++)
        It[0].appendChild(Ht(2 * e)),
        It[1].appendChild(Ht(2 * e + 1)),
        s.querySelector("#game-toolbar .colors-mobile .top").appendChild(Ht(2 * e)),
        s.querySelector("#game-toolbar .colors-mobile .bottom").appendChild(Ht(2 * e + 1));
    for (let e = 0; e < It.length; e++)
        ut.appendChild(It[e]);
    function Rt(e) {
        $t = D(e, ot, rt);
        let n = At[At.length - 1]
          , a = n.size;
        for (let t = 0; t < At.length; t++) {
            let e = At[t];
            var o = Math.abs($t - e.size);
            o <= a && (a = o,
            n = e,
            t),
            e.element.classList.remove("selected")
        }
        n.element.classList.add("selected"),
        w.querySelector(".size-preview .icon").style.backgroundSize = Et($t) + "%",
        Ct()
    }
    function Nt(e) {
        e.classList.remove("clicked"),
        e.offsetWidth,
        e.classList.add("clicked")
    }
    function Tt(e) {
        Nt(ft[e].element),
        ft[e].action()
    }
    function Wt(e, t) {
        Nt(pt[e].element),
        e == xt && !t || (pt[qt = xt].element.classList.remove("selected"),
        pt[e].element.classList.add("selected"),
        xt = e,
        Ct())
    }
    function Ot(e) {
        var t =
e > 10000 ? Ut(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ut(Dt[e]);
        Mt = e,
        s.querySelector("#color-preview-primary").style.fill = t,
        s.querySelector("#game-toolbar .color-picker-mobile .preview").style.backgroundColor = t,
        Ct()
    }
    function Yt(e) {
        var t =
e > 10000 ? Ut(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ut(Dt[e]);
        Lt = e,
        s.querySelector("#color-preview-secondary").style.fill = t,
        Ct()
    }
    function Pt() {
        var e = Mt;
        Ot(Lt),
        Yt(e)
    }
    function zt() {
        dt.classList.remove("open")
    }
    function Ht(e) {
        let t = b("color");
        return t.style.backgroundColor = Ut(Dt[e]),
        t.colorIndex = e,
        t
    }
    function Ut(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }
    function Ft(e) {
/*TYPOMOD   
desc: if color code > 1000 -> customcolor*/if(e < 1000)
        e = D(e, 0, Dt.length),
        e = Dt[e];
else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }
    function Bt(e) {
        if (C = C.slice(0, e),
        !(I != N && yt < e)) {
/* TYPOMOD
        desc: replace draw commands because of redo*/        const keepCommands = C;
        /* TYPOEND*/
            r = Kt();
            e = Math.floor(C.length / Gt);
            vt = vt.slice(0, e),
            en();
            for (var t = 0; t < vt.length; t++) {
                var n = vt[t];
                gt.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = vt.length * Gt; t < C.length; t++)
                _t(jt(C[t]), C[t]);
            mt = Math.min(C.length, mt),
            yt = Math.min(C.length, yt)
        
/* TYPOMOD 
         log kept commands*/
        document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
        /* TYPOEND*/}
    }
    const Gt = 200;
    function Kt() {
        return [0, 9999, 9999, 0, 0]
    }
    function _t(o) {
        if (r[0] += 1,
        r[1] = Math.min(r[1], o[0]),
        r[2] = Math.min(r[2], o[1]),
        r[3] = Math.max(r[3], o[2]),
        r[4] = Math.max(r[4], o[3]),
        r[0] >= Gt) {
            let e = r[1]
              , t = r[2]
              , n = r[3]
              , a = r[4];
            (n - e <= 0 || a - t <= 0) && (e = o[0],
            t = o[1],
            n = o[2],
            a = o[3]);
            o = gt.getImageData(e, t, n - e, a - t);
            vt.push({
                data: o,
                bounds: r
            }),
            r = Kt()
        }
    }
    function Xt(e) {
        return (e || 0 < C.length || 0 < bt.length || 0 < mt || 0 < yt) && (C = [],
        bt = [],
        mt = yt = 0,
        r = Kt(),
        vt = [],
        en(),
        1)
    }
    function Vt() {
        Xt() && o && o.emit("data", {
            id: xa
        })
    }
    function Zt(e) {
        !function(e) {
            if (e[0] != Qe)
                return e[0] == et && (0 <= e[2] && e[2] < q.width && 0 <= e[3] && e[3] < q.height);
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
        /* TYPOEND */ (C.push(e),
        I == N && _t(jt(e)))
    }
    function jt(e) {
        let t = [0, 0, q.width, q.height];
        switch (e[0]) {
        case Qe:
            var n = D(Math.floor(e[2]), ot, rt)
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
        case et:
            var a = Ft(e[1])
              , o = D(Math.floor(e[2]), 0, q.width)
              , r = D(Math.floor(e[3]), 0, q.height)
              , i = o
              , l = r
              , c = a.r
              , d = a.g
              , u = a.b
              , h = gt.getImageData(0, 0, q.width, q.height)
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
                gt.putImageData(h, 0, 0)
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
        gt.getImageData(o, u, h - o, p - u));
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
        gt.putImageData(f, o, u)
    }
    function en() {
/* TYPOMOD
         desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
/* TYPOEND */
        gt.fillStyle = "#FFF",
        gt.fillRect(0, 0, q.width, q.height)
/* TYPOMOD
         desc: dispatch clear event */
        ;document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
/* TYPOEND */
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
        Rt($t + 2 * e)
    }),
    ce("Swap", "S", "Swap the primary and secondary color.", Pt),
    v(w.querySelector(".color-picker .preview"), "click", function(e) {
        Pt()
    }),
    v(w.querySelector(".color-picker-mobile .preview"), "click", function(e) {
        w.querySelector(".colors-mobile").classList.toggle("open")
    }),
    v(ct, "click", function(e) {
        dt.classList.toggle("open")
    }),
    v(s, "keyup", function(e) {
        if ("Enter" == e.code)
            return $e.focus(),
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
    });
    var tn = null;
    function nn(e, t, n, a) {
        var o = q.getBoundingClientRect()
          , e = Math.floor((e - o.left) / o.width * q.width)
          , t = Math.floor((t - o.top) / o.height * q.height);
        a ? (kt = n,
        St[0] = x[0] = e,
        St[1] = x[1] = t) : (St[0] = x[0],
        St[1] = x[1],
        kt = n,
        x[0] = e,
        x[1] = t)
    }
    u.PointerEvent ? (v(q, "pointerdown", function(e) {
        if (e.preventDefault(),
        (0 == e.button || 2 == e.button || 5 == e.button) && -1 == L)
            switch (e.pointerType) {
            case "mouse":
                rn(e.button, e.clientX, e.clientY, !0, -1);
                break;
            case "pen":
            case "touch":
                rn(e.button, e.clientX, e.clientY, !0, e.pressure)
            }
    }),
    v(s, "pointermove", function(e) {
        switch (e,
        e.pointerType) {
        case "mouse":
            on(e.clientX, e.clientY, !1, -1);
            break;
        case "pen":
        case "touch":
            on(e.clientX, e.clientY, !1, e.pressure)
        }
    }),
    v(s, "pointerup", function(e) {
        e.preventDefault(),
        ln(e.button)
    })) : (v(q, "mousedown", function(e) {
        e.preventDefault(),
        0 != e.button && 2 != e.button || -1 != L || rn(e.button, e.clientX, e.clientY, !0, -1)
    }),
    v(s, "mouseup", function(e) {
        e,
        ln(e.button)
    }),
    v(s, "mousemove", function(e) {
        on(e.clientX, e.clientY, !1, -1)
    }),
    v(q, "touchstart", function(e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == tn && (tn = e[0].identitfier,
        rn(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }),
    v(q, "touchend touchcancel", function(e) {
        e.preventDefault(),
        ln(L)
    }),
    v(q, "touchmove", function(e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == tn) {
                on(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    }));
    var an = 0;
    function on(e, t, n, a) {
        nn(e, t, a = l.pressureSensitivity ? a : -1, n),
        sn(!1)
    }
    function rn(e, t, n, a, o) {
        C.length,
        L = e,
        nn(t, n, o, a),
        sn(!0)
    }
    function ln(e) {
        -1 == e || 0 != e && 2 != e && 5 != e || L != e || (an != C.length && (an = C.length,
        bt.push(an)),
        tn = null,
        L = -1)
    }
    function sn(n) {
        if (W.id == J && N == I && -1 != L) {
            var a = 0 == L ? Mt : Lt;
            let t = null;
            if (n) {
                n = function(e, t) {
                    var n = (e = gt.getImageData(e, t, 1, 1)).data[0]
                      , a = e.data[1]
                      , o = e.data[2];
                    for (let e = 0; e < Dt.length; e++) {
                        var r = Dt[e]
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
                if (xt == at) {
                    if (n == a)
                        return;
                    t = (o = a,
                    r = x[0],
                    l = x[1],
                    [et, o, r, l])
                }
                if (xt == nt)
                    return (0 == L ? Ot : Yt)(n),
                    void Wt(qt)
            }
            if (xt == tt) {
                let e = $t;
                0 <= kt && (e = (e - ot) * D(kt, 0, 1) + ot);
                var o = Math.ceil(.5 * e)
                  , r = D(Math.floor(St[0]), -o, q.width + o)
                  , l = D(Math.floor(St[1]), -o, q.height + o)
                  , n = D(Math.floor(x[0]), -o, q.width + o)
                  , s = D(Math.floor(x[1]), -o, q.height + o);
                t = (a = a,
                c = e,
                d = r,
                u = l,
                n = n,
                s = s,
                [Qe, a, c, d, u, n, s])
            }
            null != t && Zt(t)
        }
        var c, d, u, o, r, l
    }
    setInterval(()=>{
        var e, t;
        o && W.id == J && N == I && 0 < C.length - mt && (e = mt + 8,
        t = C.slice(mt, e),
        o.emit("data", {
            id: qa,
            data: t
        }),
        mt = Math.min(e, C.length))
    }
    , 50),
    setInterval(function() {
        o && W.id == J && N != I && yt < C.length && (_t(jt(C[yt]), C[yt]),
        yt++)
    }, 3);
    var cn = s.querySelector("#game-canvas .overlay")
      , dn = s.querySelector("#game-canvas .overlay-content")
      , $ = s.querySelector("#game-canvas .overlay-content .text")
      , un = s.querySelector("#game-canvas .overlay-content .words")
      , hn = s.querySelector("#game-canvas .overlay-content .reveal")
      , A = s.querySelector("#game-canvas .overlay-content .result")
      , pn = -100
      , fn = 0
      , gn = void 0;
    function mn(e, r, i) {
        let l = pn
          , s = fn
          , c = e.top - l
          , d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001)
            i && i();
        else {
            let a = void 0
              , o = 0;
            gn = u.requestAnimationFrame(function e(t) {
                var n = t - (a = null == a ? t : a)
                  , t = (a = t,
                (o = Math.min(o + n, r)) / r)
                  , n = (n = t) < .5 ? .5 * function(e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function(e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2)
                  , t = t * t * (3 - 2 * t);
                pn = l + c * n,
                fn = s + d * t,
                dn.style.top = pn + "%",
                cn.style.opacity = fn,
                o == r ? i && i() : gn = u.requestAnimationFrame(e)
            })
        }
    }
    function yn(e) {
        e.classList.add("show")
    }
/* TYPOMOD 
     desc: add event handlers for typo features */
    v(".avatar-customizer .container", "pointerdown", () => {
        jn(typo.createFakeLobbyData());}); 
    /* TYPOEND */
    function vn(l) {
        for (var e = 0; e < dn.children.length; e++)
            dn.children[e].classList.remove("show");
        switch (l.id) {
        case Z:
            yn($),
            $.textContent = k("Round $", l.data + 1);
            break;
        case X:
            yn($),
            $.textContent = k("Waiting for players...");
            break;
        case V:
            yn($),
            $.textContent = k("Game starting in a few seconds...");
            break;
        case Q:
            yn(hn),
            hn.querySelector("p span.word").textContent = l.data.word,
            hn.querySelector(".reason").textContent = function(e) {
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
            for (var t = hn.querySelector(".player-container"), n = (S(t),
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
            yn(A);
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
                            let e = pe(a[t].player.avatar, 0, 0 == o);
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
                      , t = pe(g.player.avatar, 0, !1);
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
                if (yn($),
                yn(un),
                S(un),
                T[oe.WORDMODE] == re.COMBINATION) {
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
                            ia([i, this.index])
                        }),
                        un.appendChild(e),
                        un.appendChild(t)
                    }
                } else {
                    $.textContent = k("Choose a word");
                    for (a = 0; a < l.data.words.length; a++) {
                        var m = b("word", l.data.words[a]);
                        m.index = a,
                        v(m, "click", function() {
                            ia(this.index)
                        }),
                        un.appendChild(m)
                    }
                }
            else {
                yn($);
                var y = (c = P(l.data.id)) ? c.name : k("User");
                $.textContent = k("$ is choosing a word!", y)
            }
        }
    }
    const bn = 0
      , Sn = 1
      , kn = 2
      , wn = 3
      , Cn = 4
      , qn = 5
      , xn = 6;
    function Mn(e, t) {
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
    function Ln() {
        this.context = null,
        this.sounds = new Map,
        u.addEventListener("load", this.load.bind(this), !1)
    }
    Ln.prototype.addSound = function(e, t) {
        this.sounds.set(e, new Mn(this,t))
    }
    ,
    Ln.prototype.loadSounds = function() {
        this.addSound(bn, "/audio/roundStart.ogg"),
        this.addSound(Sn, "/audio/roundEndSuccess.ogg"),
        this.addSound(kn, "/audio/roundEndFailure.ogg"),
        this.addSound(wn, "/audio/join.ogg"),
        this.addSound(Cn, "/audio/leave.ogg"),
        this.addSound(qn, "/audio/playerGuessed.ogg"),
        this.addSound(xn, "/audio/tick.ogg")
    }
    ,
    Ln.prototype.playSound = function(e) {
        var t, n;
        null != this.context && ("running" != this.context.state ? this.context.resume().then(()=>{
            this.playSound(e)
        }
        ) : null != this.context && !l.audioMute && this.sounds.has(e) && (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer,
        n.connect(this.context.destination),
        n.start(0)))
    }
    ,
    Ln.prototype.load = function() {
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
    var o, E = [], I = 0, R = -1, N = -1, T = [], W = {
        id: -1,
        time: 0,
        data: 0
    }, Dn = -1, $n = 0, An = void 0, En = new Ln, O = void 0, In = !1, Rn = !1, Nn = s.querySelector("#game-container"), Tn = s.querySelector("#game-room"), Wn = s.querySelector("#game-players"), On = s.querySelector("#game-chat"), ct = (s.querySelector("#game-board"),
    s.querySelector("#game-info")), Yn = s.querySelector("#game-bar"), Pn = Wn.querySelector(".list"), zn = Wn.querySelector(".footer"), Hn = s.querySelector("#game-round"), Y = [s.querySelector("#game-word .description"), s.querySelector("#game-word .word"), s.querySelector("#game-word .hints .container")], Un = s.querySelector("#home .container-name-lang input"), Fn = s.querySelector("#home .container-name-lang select"), Bn = s.querySelector("#home .panel .button-play"), Gn = s.querySelector("#home .panel .button-create");
    function Kn(e) {
        In = e,
        s.querySelector("#load").style.display = e ? "block" : "none"
    }
    function _n(e, t, n, a) {
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
                a && f(be, k("Servers are currently undergoing maintenance!") + "\n\r" + k("Please try again later!"));
                break;
            default:
                a && f(be, k("An unknown error occurred ('$')", e) + "\n\r" + k("Please try again later!"))
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
    var Xn = null;
    function Vn(t) {
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
                aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (Xn = t,
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
    function Zn(e, t, n) {
        En.context.resume(),
        o && ra();
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
            Kn(!1),
            o.on("joinerr", function(e) {
                ra(),
                f(be, function(e) {
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
            o.on("data", Aa);
            var e = Un.value.split("#")
              , e = {
                join: t,
                create: n ? 1 : 0,
                name: e[0],
                lang: Fn.value,
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
                f(Se, k("You have been kicked!"));
                break;
            case ae:
                f(Se, k("You have been banned!"));
                break;
            default:
                f(Se, k("Connection lost!"))
            }
            ra()
        }),
        o.on("connect_error", e=>{
            ra(),
            Kn(!1),
            f(be, e.message)
        }
        )
    }
    function jn(e) {
        var t;
        En.playSound(wn),
        Wt(tt, !0),
        Rt(12),
        Ot(1),
        Yt(0),
        Xt(!0),
        S(Ae),
        s.querySelector("#home").style.display = "none",
        s.querySelector("#game").style.display = "flex",
        I = e.me,
        Dn = e.type,
        An = e.id,
        s.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id,
        t = e.settings,
        T = t,
        Jn(),
        S(Pn),
        E = [];
        for (var n = 0; n < e.users.length; n++)
            Ea(e.users[n], !1);
        Wa(),
        Ya(),
        ea(e.round),
        da(e.owner),
        na(e.state, !0),
        Rn || ((adsbygoogle = u.adsbygoogle || []).push({}),
        (adsbygoogle = u.adsbygoogle || []).push({}),
        Rn = !0)
    }
    function Jn() {
        ea($n);
        for (var e, t = 0; t < Ha.length; t++) {
            var n = Ha[t];
            n.index && (e = T[(n = n).index],
            "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
        }
    }
    function Qn(e, t, n) {
        T[e] = t,
        n && o && o.emit("data", {
            id: ya,
            data: {
                id: e,
                val: t
            }
        }),
        Jn()
    }
    function ea(e) {
        $n = e,
        Hn.textContent = k("Round $ of $", [$n + 1, T[oe.ROUNDS]])
    }
    function ta() {
        for (let e = 0; e < E.length; e++)
            E[e].score = 0;
        for (let e = 0; e < E.length; e++)
            Pa(E[e], !1),
            za(E[e], !1),
            Oa(E[e])
    }
    function na(a, e) {
        var t, n;
        if (t = W = a,
        null != gn && (u.cancelAnimationFrame(gn),
        gn = void 0),
        t.id == J || t.id == te ? mn({
            top: -100,
            opacity: 0
        }, 600, function() {
            cn.classList.remove("show")
        }) : cn.classList.contains("show") ? mn({
            top: -100,
            opacity: 1
        }, 600, function() {
            vn(t),
            mn({
                top: 0,
                opacity: 1
            }, 600)
        }) : (cn.classList.add("show"),
        vn(t),
        mn({
            top: 0,
            opacity: 1
        }, 600)),
        n = a.time,
        Xa(),
        _a = n,
        Ga.textContent = _a,
        Ka = setInterval(function() {
            _a = Math.max(0, _a - 1),
            Ga.textContent = _a;
            var e = -1;
            W.id == J && (e = Fa),
            W.id == j && (e = Ba),
            Ga.style.animationName = _a < e ? _a % 2 == 0 ? "rot_left" : "rot_right" : "none",
            _a < e && En.playSound(xn),
            _a <= 0 && Xa()
        }, 1e3),
        w.classList.add("hidden"),
        Ct(),
        oa(!1),
        a.id == te ? (ta(),
        Tn.style.display = "flex",
        Nn.style.display = "none",
        Yn.style.display = "none",
        Wn.classList.add("room"),
        On.classList.add("room"),
        n = Tn.querySelector(".container .players"),
        he(Wn, n),
        he(On, n)) : (Tn.style.display = "none",
        Nn.style.display = "",
        Yn.style.display = "",
        Wn.classList.remove("room"),
        On.classList.remove("room"),
        he(Wn, Nn, !0),
        he(On, Nn)),
        a.id == Z && (ea(a.data),
        0 == a.data && ta()),
        a.id == Q) {
            I != N && ca(a.data.word);
            for (var o = 0; o < a.data.scores.length; o += 3) {
                var r = a.data.scores[o + 0]
                  , i = a.data.scores[o + 1]
                  , r = (a.data.scores[o + 2],
                P(r));
                r && (r.score = i)
            }
            Ya();
            for (var l = !0, o = 0; o < E.length; o++)
                if (E[o].guessed) {
                    l = !1;
                    break
                }
            l ? En.playSound(kn) : En.playSound(Sn),
            m(k("The word was '$'", a.data.word), "", g(Ne), !0)
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
            if (N = a.data.id,
            En.playSound(bn),
            Xt(!0),
            a.data.drawCommands && (C = a.data.drawCommands),
            m(k("$ is drawing now!", P(N).name), "", g(Re), !0),
            !e)
                for (o = 0; o < E.length; o++)
                    Pa(E[o], !1);
            Y[0].classList.remove("waiting"),
            N == I ? (n = a.data.word,
            Y[0].textContent = k("DRAW THIS"),
            Y[1].style.display = "",
            Y[2].style.display = "none",
            Y[1].textContent = n,
            w.classList.remove("hidden"),
            Ct()) : (oa(!0),
            la(a.data.word, !1),
            sa(a.data.hints))
        } else {
            N = -1;
            for (o = 0; o < E.length; o++)
                Pa(E[o], !1)
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
            1 == t.length ? m(k("$ won with a score of $!", [t[0], n]), "", g(We), !0) : 1 < t.length && m(k("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", g(We), !0)
        }
        for (o = 0; o < E.length; o++)
            za(E[o], E[o].id == N);
        Wa()
    }
    function aa(e) {
        o && o.connected && W.id == J && (o.emit("data", {
            id: fa,
            data: e
        }),
        oa(!1))
    }
    function oa(e) {
        s.querySelector("#game-rate").style.display = e ? "" : "none"
    }
    function ra() {
        o && o.close(),
        o = void 0,
        Xt(),
        Xa(),
        E = [],
        T = [],
        W = {
            id: N = R = -1,
            time: I = 0,
            data: 0
        },
        s.querySelector("#home").style.display = "",
        s.querySelector("#game").style.display = "none"
    }
    function ia(e) {
        o && o.connected && W.id == j && o.emit("data", {
            id: Ca,
            data: e
        })
    }
    function la(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++)
            n += t[e];
        var a = !e && 1 == T[oe.WORDMODE];
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
    function sa(e) {
        for (var t = Y[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0]
              , o = e[n][1];
            t[a].textContent = o,
            t[a].classList.add("uncover")
        }
    }
    function ca(e) {
        (!Y[2].hints || Y[2].hints.length < e.length) && la([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++)
            t.push([n, e.charAt(n)]);
        sa(t)
    }
    function da(e) {
        R = e;
        for (var t = 0; t < E.length; t++)
            ge(E[t].element, E[t].id == R),
            Na(E[t], 0, E[t].id == R);
        var n = I != R;
        s.querySelector("#start-game").disabled = n;
        for (var a = 0; a < Ha.length; a++) {
            let e = Ha[a];
            e.element.disabled = n
        }
        e = P(R);
        e && m(k("$ is now the room owner!", e.name), "", g(We), !0)
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
                Xn()
            },
            AIP_REMOVE: function() {}
        })
    });
    const ua = 1
      , ha = 2
      , pa = 5
      , fa = 8
      , ga = 10
      , ma = 11
      , ya = 12
      , va = 13
      , ba = 14
      , Sa = 15
      , ka = 16
      , wa = 17
      , Ca = 18
      , qa = 19
      , xa = 20
      , Ma = 21;
    const La = 30
      , Da = 31
      , $a = 32;
    function Aa(e) {
        var t = e.id
          , n = e.data;
        switch (t) {
        case ga:
/* TYPOMOD
                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                /* TYPOEND*/
            jn(n);
            break;
        case ma:
            na(n);
            break;
        case ya:
            Qn(n.id, n.val, !1);
            break;
        case va:
            sa(n);
            break;
        case ba:
            _a = n;
            break;
        case ua:
            m(k("$ joined the room!", Ea(n, !0).name), "", g(Ne), !0),
            En.playSound(wn);
            break;
        case ha:
            var a = function(e) {
                for (var t = 0; t < E.length; t++) {
                    var n = E[t];
                    if (n.id == e)
                        return E.splice(t, 1),
                        n.element.remove(),
                        Ya(),
                        Wa(),
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
            En.playSound(Cn),
            n.reason != ne && n.reason != ae || Xt(!0));
            break;
        case pa:
            var a = P(n[0])
              , o = P(n[1])
              , r = n[2]
              , i = n[3];
            a && o && m(k("$ is voting to kick $ ($/$)", [a.name, o.name, r, i]), "", g(Ie), !0);
            break;
        case Sa:
            a = P(n.id);
            if (a) {
                let e = m(k("$ guessed the word!", a.name), "", g(Ne), !0);
                e.classList.add("guessed"),
                Pa(a, !0),
                En.playSound(qn),
                n.id == I && ca(n.word)
            }
            break;
        case fa:
            o = P(n.id);
            o && (r = o,
            i = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif",
            (a = b("icon")).style.backgroundImage = "url(/img/" + i + ")",
            Ra(r, a),
            n.vote ? m(k("$ liked the drawing!", o.name), "", g(Ne), !0) : m(k("$ disliked the drawing!", o.name), "", g(Te), !0));
            break;
        case wa:
            da(n);
            break;
        case ka:
            m(k("$ is close!", n), "", g(Ie), !0);
            break;
        case La:
            Ia(P(n.id), n.msg);
            break;
        case $a:
            m(k("Spam detected! You're sending messages too quickly."), "", g(Te), !0);
            break;
        case Da:
            switch (n.id) {
            case 0:
                m(k("You need at least 2 players to start the game!"), "", g(Te), !0);
                break;
            case 100:
                m(k("Server restarting in about $ seconds!", n.data), "", g(Te), !0)
            }
            break;
        case qa:
            for (var l = 0; l < n.length; l++)
                Zt(n[l]);
            break;
        case xa:
            Xt(!0);
            break;
        case Ma:
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
        pe(n.avatar))
          , e = (n.element.drawing = b("drawing"),
        o.appendChild(n.element.drawing),
        n.element.appendChild(o),
        Pn.appendChild(n.element),
        v(n.element, "click", function() {
            O = n,
            f(h, n)
        }),
        4 == (4 & n.flags) && (n.interval = setInterval(function() {
            n.avatar[0] = (n.avatar[0] + 1) % B[0],
            fe(o, n.avatar)
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
        Pa(n, n.guessed),
        t && Wa(),
        n
    }
    function Ia(e, t) {
        var n;
        e.muted || (n = e.id == N || e.guessed,
        I != N && !P(I).guessed && n || (Ra(e, b("text", t)),
        m(e.name, t, g(n ? Oe : Ee))))
    }
    function Ra(e, t) {
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
    function Na(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ta = void 0;
    function Wa() {
        var e = W.id == te
          , t = e ? 112 : 48
          , n = Math.max(t, Pn.clientHeight);
        let a = Math.floor(n / t);
        e && (n = Math.floor(Pn.clientWidth / 96),
        a = 2 * n);
        t = Math.ceil(E.length / a);
        for (let e = 0; e < E.length; e++)
            E[e].page = Math.floor(e / a);
        e = s.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = E.length,
        e[1].textContent = T[oe.SLOTS],
        null == Ta ? Ta = me(zn, t, [Wn], function(e, n, t) {
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
        }) : ye(Ta, t),
        Ta.element.style.display = 1 < t ? "" : "none"
    }
    function Oa(t) {
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
    function Ya() {
        for (var e = 0; e < E.length; e++)
            Oa(E[e])
    }
    function Pa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }
    function za(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ha = [];
    {
        let e = Tn.querySelectorAll('*[id^="item-"]');
        for (var Ua = 0; Ua < e.length; Ua++) {
            let t = {
                id: e[Ua].id.replace("item-settings-", ""),
                element: e[Ua],
                index: e[Ua].dataset.setting
            };
            Ha.push(t),
            v(t.element, "change", function() {
                let e = this.value;
                "checkbox" == this.type && (e = this.checked ? 1 : 0),
                null != t.index && Qn(t.index, e, !0)
            })
        }
    }
    const Fa = 10
      , Ba = 4;
    var Ga = s.querySelector("#game-clock")
      , Ka = null
      , _a = 0;
    function Xa() {
        Ka && (clearInterval(Ka),
        Ka = null)
    }
    var Va, Za = s.querySelector("#tutorial"), ja = Za.querySelectorAll(".page"), Ja = me(Za, ja.length, [Za.querySelector(".pages")], function(e, t, n) {
        n && clearInterval(Qa);
        for (let e = 0; e < ja.length; e++)
            ja[e].classList.remove("active");
        ja[t].classList.add("active")
    }), Qa = setInterval(function() {
        Ja.selected < 4 ? ve(Ja, Ja.selected + 1, !1) : ve(Ja, 0, !1)
    }, 3500), eo = s.querySelector("#setting-bar"), to = s.querySelector("#audio"), no = s.querySelector("#lightbulb");
    function ao() {
        eo.classList.remove("open")
    }
    function oo(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }
    function ro() {
        to.dataset.tooltip = l.audioMute ? "Unmute audio" : "Mute audio",
        no.dataset.tooltip = l.dark ? "Turn the lights on" : "Turn the lights off",
        y && (y.querySelector(".tooltip-content").textContent = k(Pe.dataset.tooltip))
    }
    function io() {
        m(k("Copied room link to clipboard!"), "", g(Ie), !0);
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
    function lo(e) {
        let t = De.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }
    function so(e) {
        o && o.connected ? o.emit("data", {
            id: La,
            data: e
        }) : Ia(P(I), e)
    }
    v(eo.querySelector(".icon"), "click", function() {
        oo(to, l.audioMute),
        oo(no, l.dark),
        ro(),
        eo.classList.contains("open") ? ao() : eo.classList.add("open")
    }),
    v("#audio", "click", function(e) {
        l.audioMute = !l.audioMute,
        oo(to, l.audioMute),
        ro(),
        t()
    }),
    v("#lightbulb", "click", function(e) {
        a(!l.dark),
        oo(no, l.dark),
        ro(),
        t()
    }),
    v("#hotkeys", "click", function(e) {
        ao(),
        f(we)
    }),
    u.onbeforeunload = function(e) {
        return o ? k("Are you sure you want to leave?") : void 0
    }
    ,
    u.onunload = function() {
        o && ra()
    }
    ,
    v([s, q], "mousedown touchstart", function(e) {
        eo.contains(e.target) || ao(),
        s.querySelector("#game-toolbar .sizes").contains(e.target) || zt()
    }),
    v(u, "resize", Wa),
    v([Un, Fn], "change", t),
    v(Bn, "click",
typo.joinLobby = function() {
        var t, e, n, a, o;
        n = u.location.href,
        o = "",
        n = n.split("?"),
        t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o,
        In || (e = "" != t ? "id=" + t : "lang=" + Fn.value,
        Le(),
        Kn(!0),
        Vn(function() {
            _n(location.origin + ":3000/play", e, function(e) {
                Kn(!1),
                e.success && Zn(e.data, t)
            }, !0)
        }))
    }),
    v(Gn, "click", function() {
        In || (Le(),
        Kn(!0),
        Vn(function() {
            _n(location.origin + ":3000/play", "lang=" + Fn.value, function(e) {
                e.success ? Zn(e.data, 0, 1) : Kn(!1)
            }, !0)
        }))
    }),
    v(s.querySelector("#game-rate .like"), "click", function() {
        aa(1)
    }),
    v(s.querySelector("#game-rate .dislike"), "click", function() {
        aa(0)
    }),
    v(ct, "click", function() {
        f(ke)
    }),
    v(s.querySelector("#start-game"), "click", function() {
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
    v(s.querySelector("#copy-invite"), "click", io),
    v(p[h].querySelector("button.kick"), "click", function() {
        Le(),
        null != O && O.id != I && I == R && o && o.emit("data", {
            id: 3,
            data: O.id
        })
    }),
    v(p[h].querySelector("button.ban"), "click", function() {
        Le(),
        null != O && O.id != I && I == R && o && o.emit("data", {
            id: 4,
            data: O.id
        })
    }),
    v(p[h].querySelector("button.votekick"), "click", function() {
        Le(),
        null != O && O.id != I && o && (O.id == R ? m(k("You can not votekick the lobby owner!"), "", g(Te), !0) : o.emit("data", {
            id: pa,
            data: O.id
        }))
    }),
    v(p[h].querySelector("button.mute"), "click", function() {
        null != O && O.id != I && (O.muted = !O.muted,
        Na(O, 1, O.muted),
        O.muted ? m(k("You muted '$'!", O.name), "", g(Te), !0) : m(k("You unmuted '$'!", O.name), "", g(Te), !0),
        o && o.emit("data", {
            id: 7,
            data: O.id
        }),
        Me(O.muted))
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
        0 < e && (null != O && O.id != I && (O.reported = !0,
        o && o.emit("data", {
            id: 6,
            data: {
                id: O.id,
                reasons: e
            }
        }),
        m(k("Your report for '$' has been sent!", O.name), "", g(Ie), !0)),
        Le())
    }),
    v(p[we].querySelector("#select-display-language"), "change", function(e) {
        l.displayLang = e.target.value,
        t(),
        Je()
    }),
    v(p[we].querySelector("#select-pressure-sensitivity"), "change", function(e) {
        l.pressureSensitivity = e.target.value,
        t()
    }),
    v(p[we].querySelector("button.reset"), "click", function() {
        for (let e = 0; e < d.length; e++)
            d[e].key = d[e].def;
        de()
    }),
    v(s.querySelector("#game-keyboard button.settings"), "click", function(e) {
        f(we)
    }),
    v($e, "focusin focus", function(e) {
        e.preventDefault()
    }),
    v($e, "input", function(e) {
        lo($e.value.length)
    }),
    v(De, "submit", function(e) {
const input = $e; let rest = input.value.substring(100);
        input.value = input.value.substring(0,100);
        if(rest.length > 0) setTimeout(()=>{input.value = rest; e.target.dispatchEvent(new Event("submit"));},180);
        return e.preventDefault(),
        $e.value && so($e.value),
        De.reset(),
        lo(0),
        !1
    }),
    u.localStorageAvailable ? (Un.value = e("name", ""),
    Fn.value = function(t) {
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
    l.avatar = (Za = "ava",
    Bn = l.avatar,
    null == (Za = c.getItem(Za)) ? Bn : JSON.parse(Za)),
    Ke.value = e("keyboard", 1),
    _e.value = e("keyboardlayout", "en"),
    Ge(),
    a(1 == parseInt(e("dark", 0)) ? 1 : 0),
    console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
    var co = s.querySelectorAll("[data-translate]");
    for (let e = 0; e < co.length; e++) {
        var uo = co[e];
        je(uo, uo.dataset.translate)
    }
    function ho(e) {
        Va.parts[e].classList.remove("bounce"),
        Va.parts[e].offsetWidth,
        Va.parts[e].classList.add("bounce")
    }
    Je(),
    v(Gn = s.querySelectorAll("[data-tooltip]"), "mouseenter", function(e) {
        ze(e.target)
    }),
    v(Gn, "mouseleave", function(e) {
        He()
    }),
    Bn = (ct = s.querySelector("#home .avatar-customizer")).querySelector(".container"),
    Za = ct.querySelectorAll(".arrows.left .arrow"),
    Gn = ct.querySelectorAll(".arrows.right .arrow"),
    ct = ct.querySelectorAll(".randomize"),
    (Va = pe(l.avatar)).classList.add("fit"),
    Bn.appendChild(Va),
    v(Za, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        --l.avatar[e],
        l.avatar[e] < 0 && (l.avatar[e] = B[e] - 1),
        ho(e),
        fe(Va, l.avatar),
        t()
    }),
    v(Gn, "click", function() {
        var e = parseInt(this.dataset.avatarIndex);
        l.avatar[e] += 1,
        l.avatar[e] >= B[e] && (l.avatar[e] = 0),
        ho(e),
        fe(Va, l.avatar),
        t()
    }),
    v(ct, "click", function() {
        l.avatar[0] = Math.floor(Math.random() * B[0]),
        l.avatar[1] = Math.floor(Math.random() * B[1]),
        l.avatar[2] = Math.floor(Math.random() * B[2]),
        ho(1),
        ho(2),
        fe(Va, l.avatar),
        t()
    });
    {
        var po = Math.round(8 * Math.random());
        let t = s.querySelector("#home .logo-big .avatar-container");
        for (var fo = 0; fo < 8; fo++) {
            let e = [0, 0, 0, -1];
            e[0] = fo,
            e[1] = Math.round(100 * Math.random()) % U,
            e[2] = Math.round(100 * Math.random()) % F,
            1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random()));
            var go = pe(e, 0, po == fo);
            t.append(go)
        }
    }
}(window, document, localStorage, io);
