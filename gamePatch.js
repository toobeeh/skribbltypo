!function(u, s, c, Y) {
    const z = 26
      , H = 57
      , U = 51
      , F = [z, H, U]
      , B = 0
      , G = 1
      , K = 2
      , _ = 0
      , V = 1
      , X = 2
      , Z = 3
      , j = 4
      , J = 5
      , Q = 6
      , ee = 7;
    const te = 1
      , ne = 2
      , ae = {
        LANG: 0,
        SLOTS: 1,
        DRAWTIME: 2,
        ROUNDS: 3,
        WORDCOUNT: 4,
        HINTCOUNT: 5,
        WORDMODE: 6,
        CUSTOMWORDSONLY: 7
    }
      , oe = {
        NORMAL: 0,
        HIDDEN: 1,
        COMBINATION: 2
    }
// TYPOMOD 
    // desc: create re-useable functions
    , typo = {
        joinLobby: undefined,        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            // IDENTIFY x.value.split: #home .container-name-lang input -> Fn
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> h
            return { id: id, name: name.length != 0 ? name : (Fn.value.split("#")[0] != "" ? Fn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? h.avatar : avatar, score: score, guessed: guessed };
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
                    //lt.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                    //##PRIVATELBBY## = !1 // IDENTIFY: x:  = !1   
                    if(e.detail) window.history.pushState({path:window.location.origin + '?' + e.detail}, '', window.location.origin + '?' + e.detail);////##JOINLOBBY##(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                    typo.joinLobby(); window.history.pushState({path:window.location.origin}, '', window.location.origin);//Kn(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 1800 ? 1800 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else ra() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = Mt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
                let code = match >= 0 ? match : e.detail.code;
                if (e.detail.secondary) Pt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                else Wt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
            });
            document.addEventListener("performDrawCommand", (e) => {
                x.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                _t(jt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
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
      , re = ["Normal", "Hidden", "Combination"]
      , le = ["English", "German", "Bulgarian", "Czech", "Danish", "Dutch", "Finnish", "French", "Estonian", "Greek", "Hebrew", "Hungarian", "Italian", "Japanese", "Korean", "Latvian", "Macedonian", "Norwegian", "Portuguese", "Polish", "Romanian", "Russian", "Serbian", "Slovakian", "Spanish", "Swedish", "Tagalog", "Turkish"];
    if (u.localStorageAvailable = !1,
    void 0 !== c)
        try {
            c.setItem("feature_test", "yes"),
            "yes" === c.getItem("feature_test") && (c.removeItem("feature_test"),
            u.localStorageAvailable = !0)
        } catch (e) {}
    let d = [];
    function ie(t) {
        for (let e = 0; e < d.length; e++)
            if (d[e].name == t)
                return d[e]
    }
    function se(t, n, a, e, o) {
        var r = n;
        u.localStorageAvailable && (i = c.getItem("hotkey_" + t)) && (n = i);
        let l = ie(t);
        if (l)
            l.key = n,
            l.def = r,
            l.desc = a;
        else {
            l = {
                name: t,
                desc: a,
                key: n,
                def: r,
                listing: g("item"),
                changed: [],
                cb: []
            },
            d.push(l);
            var i = g("key", l.name);
            Ve(i, "text"),
            l.listing.appendChild(i);
            let e = s.createElement("input");
            e.value = l.key,
            l.listing.appendChild(e),
            m(e, "keydown", function(t) {
                var n = t.key;
                for (let e = 0; e < d.length; e++)
                    if (d[e].key == n)
                        return void t.preventDefault();
                e.value = n,
                l.key = n;
                for (let e = 0; e < l.changed.length; e++)
                    l.changed[e](l);
                return ce(),
                t.preventDefault(),
                !1
            }),
            v[y].querySelector("#hotkey-list").appendChild(l.listing)
        }
        return e && l.cb.push(e),
        o && l.changed.push(o),
        l
    }
    function ce() {
        if (u.localStorageAvailable)
            for (let e = 0; e < d.length; e++)
                u.localStorage.setItem("hotkey_" + d[e].name, d[e].key)
    }
    let h = {
        avatar: [Math.round(100 * Math.random()) % z, Math.round(100 * Math.random()) % H, Math.round(100 * Math.random()) % U, -1],
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
    function a() {
        u.localStorageAvailable ? (c.setItem("name", Fn.value),
        c.setItem("lang", Bn.value),
        c.setItem("displaylang", h.displayLang),
        c.setItem("volume", h.volume),
        c.setItem("dark", 1 == h.dark ? 1 : 0),
        c.setItem("filter", 1 == h.filterChat ? 1 : 0),
        c.setItem("pressure", 1 == h.pressureSensitivity ? 1 : 0),
        c.setItem("ava", JSON.stringify(h.avatar)),
        c.setItem("keyboard", He.value),
        c.setItem("keyboardlayout", Ue.value),
        console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
    }
    function m(e, t, n) {
        let a = e;
        "string" == typeof e ? a = s.querySelectorAll(e) : "[object Array]" !== (o = Object.prototype.toString.call(e)) && "[object NodeList]" !== o && "[object HTMLCollection]" !== o && (a = [e]);
        var o, r = t.split(" ");
        for (let t = 0; t < a.length; t++)
            for (let e = 0; e < r.length; e++)
                a[t].addEventListener(r[e], n)
    }
    function g(e, t) {
        let n = s.createElement("div");
        if (void 0 !== e) {
            var a = e.split(" ");
            for (let e = 0; e < a.length; e++)
                n.classList.add(a[e])
        }
        return void 0 !== t && (n.textContent = t),
        n
    }
    function de(e, t, n) {
        let a = s.createElement(e);
        if (void 0 !== t) {
            var o = t.split(" ");
            for (let e = 0; e < o.length; e++)
                a.classList.add(o[e])
        }
        return void 0 !== n && (a.textContent = n),
        a
    }
    function f(e) {
        for (; e.firstChild; )
            e.removeChild(e.firstChild)
    }
    function ue(e, t, n) {
        let a = g("avatar");
        var o = g("color")
          , r = g("eyes")
          , l = g("mouth")
          , i = g("special");
        let s = g("owner");
        return s.style.display = n ? "block" : "none",
        a.appendChild(o),
        a.appendChild(r),
        a.appendChild(l),
        a.appendChild(i),
        a.appendChild(s),
        a.parts = [o, r, l],
        he(a, e),
        a
    }
    function he(e, t) {
        function n(e, t, n, a) {
            var o = -t % n * 100
              , t = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + t + "%"
        }
        var a = t[0] % z
          , o = t[1] % H
          , r = t[2] % U
          , t = t[3];
        n(e.querySelector(".color"), a, 10),
        n(e.querySelector(".eyes"), o, 10),
        n(e.querySelector(".mouth"), r, 10);
        let l = e.querySelector(".special");
        0 <= t ? (l.style.display = "",
        n(l, t, 10)) : l.style.display = "none"
    }
    function pe(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }
    function me(e, t, n, a) {
        let o = {
            element: g("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element),
        n.push(o.element),
        m(n, "DOMMouseScroll wheel", function(e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY,
            t = Math.sign(t),
            fe(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)),
            e.preventDefault(),
            e.stopPropagation()
        }),
        ge(o, t),
        o
    }
    function ge(n, e) {
        f(n.element),
        n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = g("dot");
            e.index = t,
            e.appendChild(g("inner")),
            m(e, "click", function() {
                fe(n, this.index, !0)
            }),
            n.element.appendChild(e),
            n.dots.push(e)
        }
        n.selected < 0 && (n.selected = 0),
        n.selected >= e && (n.selected = e - 1),
        fe(n, n.selected, !1)
    }
    function fe(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++)
                t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"),
            t.change(t, e, n)
        }
    }
    const p = 0
      , ye = 1
      , ve = 2
      , be = 3
      , y = 4
      , Se = 5;
    let t = s.querySelector("#modal")
      , ke = t.querySelector(".modal-title .text")
      , we = t.querySelector(".modal-content")
      , v = [];
    function Ce(e) {
        v[p].querySelector(".buttons button.mute").textContent = C(e ? "Unmute" : "Mute")
    }
    function b(e, n) {
        t.style.display = "block";
        for (let e = 0; e < v.length; e++)
            v[e].style.display = "none";
        v[e].style.display = "flex";
        let a = v[e];
        switch (e) {
        case ye:
            ke.textContent = C("Something went wrong!"),
            a.querySelector(".message").textContent = n;
            break;
        case ve:
            ke.textContent = C("Disconnected!"),
            a.querySelector(".message").textContent = n;
            break;
        case p:
            {
                ke.textContent = n.id == R ? C("$ (You)", n.name) : n.name;
                let e = a.querySelector(".buttons")
                  , t = (e.style.display = n.id == R ? "none" : "flex",
                e.querySelector(".button-pair").style.display = R == l ? "flex" : "none",
                e.querySelector("button.report").style.display = n.reported ? "none" : "",
                Ce(n.muted),
                a.querySelector(".report-menu").style.display = "none",
                a.querySelector(".invite").style.display = R == n.id ? "flex" : "none",
                we.querySelector(".player"));
                t.style.display = "",
                f(t);
                var o = ue(n.avatar);
                pe(o, l == n.id),
                t.appendChild(o)
            }
            break;
        case Se:
            ke.textContent = C("Rooms"),
            roomsUpdate(n);
            break;
        case be:
            {
                ke.textContent = 0 == An ? "Public Room" : "Private Room",
                f(a);
                var r = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"];
                let o = g("settings");
                for (let a = 0; a < $n.length; a++) {
                    let e = g("setting")
                      , t = de("img", "icon")
                      , n = (t.src = "/img/setting_" + a + ".gif",
                    e.appendChild(t),
                    e.appendChild(de("span", "name", r[a] + ":")),
                    $n[a]);
                    a == ae.CUSTOMWORDSONLY && (n = n ? "Yes" : "No"),
                    a == ae.SLOTS && (n = A.length + "/" + n),
                    a == ae.LANG && (n = le[n]),
                    a == ae.WORDMODE && (n = re[n]),
                    a == ae.DRAWTIME && (n += "s"),
                    e.appendChild(de("span", "value", n)),
                    o.appendChild(e)
                }
                a.appendChild(o);
                let e = s.querySelector("#game-invite").cloneNode(!0);
                m(e.querySelector("#copy-invite"), "click", to),
                a.appendChild(e)
            }
            break;
        case y:
            ke.textContent = C("Settings"),
            a.querySelector("#select-pressure-sensitivity").value = h.pressureSensitivity
        }
    }
    function qe() {
        t.style.display = "none"
    }
    v[p] = t.querySelector(".modal-container-player"),
    v[ye] = t.querySelector(".modal-container-info"),
    v[ve] = t.querySelector(".modal-container-info"),
    v[be] = t.querySelector(".modal-container-room"),
    v[y] = t.querySelector(".modal-container-settings"),
    m(u, "click", function(e) {
        e.target == t && qe()
    }),
    m([t.querySelector(".close"), v[ye].querySelector("button.ok")], "click", qe);
    let xe = s.querySelector("#game-chat form")
      , Me = s.querySelector("#game-chat form input")
      , Le = s.querySelector("#game-chat .chat-content");
    const Ee = 0;
    const De = 2
      , $e = 3
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
        let o = s.createElement("p")
          , r = s.createElement("b");
        r.textContent = a ? e : e + ": ",
        o.appendChild(r),
        o.style.color = n;
        {
            let e = s.createElement("span");
            e.textContent = t,
            o.appendChild(e)
        }
        a = Le.scrollHeight - Le.scrollTop - Le.clientHeight <= 20;
        if (Le.appendChild(o),
        a && Oe(),
        0 < h.chatDeleteQuota)
            for (; Le.childElementCount > h.chatDeleteQuota; )
                Le.firstElementChild.remove();
        return o
    }
    let w = void 0
      , We = void 0;
    function Pe(e) {
        Ye();
        var t = (We = e).dataset.tooltip;
        let n = e.dataset.tooltipdir || "N"
          , a = ((w = g("tooltip")).appendChild(g("tooltip-arrow")),
        w.appendChild(g("tooltip-content", C(t))),
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
          , l = t.top;
        "N" == n && (r = (t.left + t.right) / 2),
        "S" == n && (r = (t.left + t.right) / 2,
        l = t.bottom),
        "E" == n && (r = t.right,
        l = (t.top + t.bottom) / 2),
        "W" == n && (l = (t.top + t.bottom) / 2),
        a || (r += u.scrollX,
        l += u.scrollY),
        w.classList.add(n),
        w.style.left = r + "px",
        w.style.top = l + "px",
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
        layout: [["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"], ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"], ["W", "X", "C", "V", "B", "N", "É", "È", "Ç", "À", "'"]]
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
    let He = s.querySelector("#select-mobile-keyboard-enabled")
      , Ue = s.querySelector("#select-mobile-keyboard-layout")
      , n = {
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
            f(this.elements.rows);
            var n = e.layout;
            let r = this;
            function a(e, n, t) {
                let a = de("button", "key");
                var o = "PointerEvent"in u ? "pointerdown" : "click";
                if (Fe.has(n)) {
                    let t = Fe.get(n);
                    a.classList.add(t.class),
                    a.appendChild(de("span", "material-icons", t.icon)),
                    m(a, o, function(e) {
                        t.callback(r)
                    })
                } else
                    a.textContent = r.getKeyLowercase(n),
                    m(a, o, function(e) {
                        r.inputAdd(n)
                    }),
                    r.elements.keys.push(a);
                return t ? e.insertBefore(a, e.firstChild) : e.appendChild(a),
                a
            }
            let o = 0;
            for (let t = 0; t < n.length; t++) {
                o = r.addRow();
                for (let e = 0; e < n[t].length; e++) {
                    var l = n[t][e];
                    a(o, l)
                }
            }
            this.elements.caps = a(o, "caps", !0),
            a(o, "backspace"),
            o = r.addRow();
            var t = ["-", "space", ".", "enter"];
            for (let e = 0; e < t.length; e++)
                a(o, t[e])
        },
        addRow: function() {
            var e = g("row");
            return this.elements.rows.appendChild(e),
            this.rows.push(e),
            e
        },
        inputChanged: function() {
            n.elements.input.querySelector("span").textContent = n.input
        },
        inputAdd: function(e) {
            this.input += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e),
            this.inputChanged(),
            this.caps && this.toggleCaps()
        },
        enter: function() {
            0 < this.input.length && (ao(this.input),
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
        1 == He.value ? s.documentElement.dataset.mobileKeyboard = "" : delete s.documentElement.dataset.mobileKeyboard
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
    });
    for (let t = 0; t < ze.length; t++) {
        let e = de("option");
        e.textContent = ze[t].name,
        e.value = ze[t].code,
        Ue.appendChild(e)
    }
    m(Ue, "change", function(e) {
        let t = void 0;
        for (let e = 0; e < ze.length; e++)
            ze[e].code == this.value && (t = ze[e]);
        null != t && n.init(t)
    }),
    m([He, Ue], "change", function(e) {
        a(),
        Be()
    }),
    m(n.elements.input, "click", function() {
        n.isOpen || (s.documentElement.dataset.mobileKeyboardOpen = "",
        Oa(),
        Oe(),
        n.isOpen = !0)
    }),
    n.init(ze[0]);
    var Ge = {}
      , Ke = [];
    function _e(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }
    function C(e, t) {
        var n = _e(Ge[h.displayLang], e)
          , a = ""
          , o = 0;
        Array.isArray(t) || (t = [t]);
        for (var r = 0; r < n.length; r++) {
            var l = n.charAt(r);
            "$" == l ? (a += t[o],
            o++) : a += l
        }
        return a
    }
    function Ve(e, t) {
        if ("children" == t)
            for (var n = 0; n < e.children.length; n++) {
                var a = e.children[n].dataset.translate;
                Ve(e.children[n], null == a ? "text" : a)
            }
        else {
            var o = "";
            "text" == t && (o = e.textContent),
            0 < (o = "placeholder" == t ? e.placeholder : o).length ? Ke.push({
                key: o,
                element: e,
                type: t
            }) : (console.log("Empty key passed to translate with!"),
            console.log(e))
        }
    }
    Ge.en = {},
    Ge.de = {
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
    const Xe = 0
      , Ze = 1;
    const je = 0
      , Je = 2
      , Qe = 1;
    const et = 4
      , tt = 40;
    var nt = [4, 10, 20, 32, 40];
    let at = s.querySelector("#game-toolbar")
      , ot = at.querySelector(".toolbar-group-tools")
      , rt = at.querySelector(".toolbar-group-actions");
    var lt = s.querySelector("#game-toolbar .sizes .size-preview");
    let it = s.querySelector("#game-toolbar .sizes .container")
      , st = s.querySelector("#game-toolbar .colors");
    function ct(e, t) {
        let n = g("tool clickable")
          , a = (n.appendChild(g("icon")),
        n.appendChild(g("key")),
        t);
        var o, r, l;
        a.id = e,
        (a.element = n).toolIndex = e,
        n.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")",
        o = n,
        r = t.name,
        l = "S",
        o.dataset.tooltip = r,
        o.dataset.tooltipdir = l,
        m(o, "pointerenter", function(e) {
            Pe(e.target)
        }),
        m(o, "pointerleave", function(e) {
            Ye()
        });
        let i, s = (i = t.isAction ? (n.addEventListener("click", function(e) {
            Nt(this.toolIndex)
        }),
        rt.appendChild(n),
        ut[e] = a,
        se(t.name, t.keydef, "", function() {
            Nt(e)
        }, function(e) {
            s.textContent = e.key
        })) : (n.addEventListener("click", function(e) {
            Ot(this.toolIndex)
        }),
        ot.appendChild(n),
        dt[e] = a,
        se(t.name, t.keydef, "", function() {
            Ot(a.id)
        }, function(e) {
            s.textContent = e.key
        })),
        n.querySelector(".key"));
        s.textContent = i.key,
        t.hide && (n.style.display = "none")
    }
    let dt = []
      , ut = (ct(je, {
        isAction: !1,
        name: "Brush",
        keydef: "B",
        graphic: "pen.gif",
        cursor: 0
    }),
    ct(Qe, {
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
                0 < ft.length && (ft.pop(),
                0 < ft.length ? (e = ft[ft.length - 1],
                pt,
                Bt(e),
                o && o.emit("data", {
                    id: Ma,
                    data: e
                })) : Xt())
            }
        }
    }),
    ct(1, {
        isAction: !0,
        name: "Clear",
        keydef: "C",
        graphic: "clear.gif",
        action: Xt
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
        graphic: "",keydef:'L',
        action: ()=>{document.dispatchEvent(new Event("openBrushLab"));}
    }) /*TYPOEND*/,
    s.querySelector("#game-canvas canvas"))
      , ht = q.getContext("2d")
      , x = (ht.willReadFrequently = !0,
    [])
      , pt = 0
      , mt = 0
      , gt = []
      , r = [0, 9999, 9999, 0, 0]
      , ft = []
      , M = [0, 0]
      , yt = [0, 0]
      , vt = 0
      , bt = 0
      , St = s.createElement("canvas")
      , L = (St.width = tt + 2,
    St.height = tt + 2,
    St.getContext("2d"));
    function kt() {
        let t = dt[Ct].cursor;
        if (T.id == j && I == R) {
            if (Ct == je) {
                var n = St.width
                  , a = Lt;
                if (a <= 0)
                    return;
                L.clearRect(0, 0, n, n);
// TYPOMOD
// desc: cursor with custom color
let e = qt < 10000 ? Mt[qt] : typo.hexToRgb((qt - 10000).toString(16).padStart(6, "0"));
// TYPOEND  
                1 == h.dark && (o = Math.floor(.75 * e[0]),
                r = Math.floor(.75 * e[1]),
                l = Math.floor(.75 * e[2]),
                e = [o, r, l]);
                var o = [e[0], e[1], e[2], .8]
                  , r = (L.fillStyle = "rgba(" + o[0] + "," + o[1] + "," + o[2] + "," + o[3] + ")",
                L.beginPath(),
                L.arc(n / 2, n / 2, a / 2 - 1, 0, 2 * Math.PI),
                L.fill(),
                L.strokeStyle = "#FFF",
                L.beginPath(),
                L.arc(n / 2, n / 2, a / 2 - 1, 0, 2 * Math.PI),
                L.stroke(),
                L.strokeStyle = "#000",
                L.beginPath(),
                L.arc(n / 2, n / 2, a / 2, 0, 2 * Math.PI),
                L.stroke(),
                St.toDataURL())
                  , l = n / 2;
                t = "url(" + r + ")" + l + " " + l + ", default"
            }
        } else
            t = "default";
        q.style.cursor = t
    }
    let wt = 0
      , Ct = 0
      , qt = 0
      , xt = 0
      , Mt = [[255, 255, 255], [0, 0, 0], [193, 193, 193], [80, 80, 80], [239, 19, 11], [116, 11, 7], [255, 113, 0], [194, 56, 0], [255, 228, 0], [232, 162, 0], [0, 204, 0], [0, 70, 25], [0, 255, 145], [0, 120, 93], [0, 178, 255], [0, 86, 158], [35, 31, 211], [14, 8, 101], [163, 0, 186], [85, 0, 105], [223, 105, 167], [135, 53, 84], [255, 172, 142], [204, 119, 77], [160, 82, 45], [99, 48, 13]]
      , Lt = 0
      , Et = -1;
    let Dt = [];
    function $t(e) {
        return 20 + (e - et) / (tt - et) * 80
    }
    for (let n = 0; n < nt.length; n++) {
        let e = g("size clickable")
          , t = g("icon");
        t.style.backgroundSize = $t(nt[n]) + "%";
        var At = {
            id: n,
            size: nt[n],
            element: e,
            elementIcon: t
        };
        e.appendChild(t),
        it.appendChild(e),
        e.size = At,
        Dt.push(At)
    }
    let Rt = [g("top"), g("bottom")];
    for (let e = 0; e < Mt.length / 2; e++)
        Rt[0].appendChild(Ht(2 * e)),
        Rt[1].appendChild(Ht(2 * e + 1)),
        s.querySelector("#game-toolbar .colors-mobile .top").appendChild(Ht(2 * e)),
        s.querySelector("#game-toolbar .colors-mobile .bottom").appendChild(Ht(2 * e + 1));
    for (let e = 0; e < Rt.length; e++)
        st.appendChild(Rt[e]);
    function It(e) {
        Lt = E(e, et, tt);
        let n = Dt[Dt.length - 1]
          , a = n.size;
        for (let t = 0; t < Dt.length; t++) {
            let e = Dt[t];
            var o = Math.abs(Lt - e.size);
            o <= a && (a = o,
            n = e,
            t),
            e.element.classList.remove("selected")
        }
        n.element.classList.add("selected"),
        at.querySelector(".size-preview .icon").style.backgroundSize = $t(Lt) + "%",
        kt()
    }
    function Tt(e) {
        e.classList.remove("clicked"),
        e.offsetWidth,
        e.classList.add("clicked")
    }
    function Nt(e) {
        Tt(ut[e].element),
        ut[e].action()
    }
    function Ot(e, t) {
        Tt(dt[e].element),
        e == Ct && !t || (wt = Ct,
        dt[Ct].element.classList.remove("selected"),
        dt[e].element.classList.add("selected"),
        Ct = e,
        kt())
    }
    function Wt(e) {
        var t =
e > 10000 ? Ut(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ut(Mt[e]);
        qt = e,
        s.querySelector("#color-preview-primary").style.fill = t,
        s.querySelector("#game-toolbar .color-picker-mobile .preview").style.backgroundColor = t,
        kt()
    }
    function Pt(e) {
        var t =
e > 10000 ? Ut(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ut(Mt[e]);
        xt = e,
        s.querySelector("#color-preview-secondary").style.fill = t,
        kt()
    }
    function Yt() {
        var e = qt;
        Wt(xt),
        Pt(e)
    }
    function zt() {
        it.classList.remove("open")
    }
    function Ht(e) {
        let t = g("color");
        return t.style.backgroundColor = Ut(Mt[e]),
        t.colorIndex = e,
        t
    }
    function Ut(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }
    function Ft(e) {
/*TYPOMOD   
desc: if color code > 1000 -> customcolor*/if(e < 1000)
        e = E(e, 0, Mt.length),
        e = Mt[e];
else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }
    function Bt(e) {
        if (x = x.slice(0, e),
        !(R != I && mt < e)) {
/* TYPOMOD
        desc: replace draw commands because of redo*/        const keepCommands = x;
        /* TYPOEND*/
            r = Kt();
            e = Math.floor(x.length / Gt);
            gt = gt.slice(0, e),
            en();
            for (let e = 0; e < gt.length; e++) {
                var t = gt[e];
                ht.putImageData(t.data, t.bounds[1], t.bounds[2])
            }
            for (let e = gt.length * Gt; e < x.length; e++)
                _t(jt(x[e]), x[e]);
            pt = Math.min(x.length, pt),
            mt = Math.min(x.length, mt)
        
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
            o = ht.getImageData(e, t, n - e, a - t);
            gt.push({
                data: o,
                bounds: r
            }),
            r = Kt()
        }
    }
    function Vt(e) {
        return (e || 0 < x.length || 0 < ft.length || 0 < pt || 0 < mt) && (x = [],
        ft = [],
        mt = 0,
        pt = 0,
        r = Kt(),
        gt = [],
        en(),
        1)
    }
    function Xt() {
        Vt() && o && o.emit("data", {
            id: xa
        })
    }
    function Zt(e) {
        !function(e) {
            if (e[0] != Xe)
                return e[0] == Ze && (0 <= e[2] && e[2] < q.width && 0 <= e[3] && e[3] < q.height);
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
        R == I && _t(jt(e)))
    }
    function jt(e) {
        let t = [0, 0, q.width, q.height];
        switch (e[0]) {
        case Xe:
            var n = E(Math.floor(e[2]), et, tt)
              , o = Math.ceil(n / 2)
              , r = E(Math.floor(e[3]), -o, q.width + o)
              , s = E(Math.floor(e[4]), -o, q.height + o)
              , c = E(Math.floor(e[5]), -o, q.width + o)
              , d = E(Math.floor(e[6]), -o, q.height + o)
              , a = Ft(e[1]);
            t[0] = E(r - o, 0, q.width),
            t[1] = E(s - o, 0, q.height),
            t[2] = E(c + o, 0, q.width),
            t[3] = E(d + o, 0, q.height),
            Qt(r, s, c, d, n, a.r, a.g, a.b);
            break;
        case Ze:
            o = Ft(e[1]),
            r = E(Math.floor(e[2]), 0, q.width),
            s = E(Math.floor(e[3]), 0, q.height);
            {
                c = r;
                d = s;
                var u = o.r;
                var h = o.g;
                var p = o.b;
                let l = ht.getImageData(0, 0, q.width, q.height)
                  , i = [[c, d]]
                  , a = function(e, t, n) {
                    n = 4 * (n * e.width + t);
                    return 0 <= n && n < e.data.length ? [e.data[n], e.data[1 + n], e.data[2 + n]] : [0, 0, 0]
                }(l, c, d);
                if (u != a[0] || h != a[1] || p != a[2]) {
                    function m(e) {
                        var t = l.data[e]
                          , n = l.data[e + 1]
                          , e = l.data[e + 2];
                        if (t == u && n == h && e == p)
                            return !1;
                        t = Math.abs(t - a[0]),
                        n = Math.abs(n - a[1]),
                        e = Math.abs(e - a[2]);
                        return t < 1 && n < 1 && e < 1
                    }
                    for (var g = l.height, f = l.width; i.length; ) {
                        let e, t, n, a, o, r;
                        for (e = i.pop(),
                        t = e[0],
                        n = e[1],
                        a = 4 * (n * f + t); 0 <= n-- && m(a); )
                            a -= 4 * f;
                        for (a += 4 * f,
                        ++n,
                        o = !1,
                        r = !1; n++ < g - 1 && m(a); )
                            Jt(l, a, u, h, p),
                            0 < t && (m(a - 4) ? o || (i.push([t - 1, n]),
                            o = !0) : o = o && !1),
                            t < f - 1 && (m(a + 4) ? r || (i.push([t + 1, n]),
                            r = !0) : r = r && !1),
                            a += 4 * f
                    }
                    ht.putImageData(l, 0, 0)
                }
            }
        }
        return t
    }
    function E(e, t, n) {
        return e < t ? t : n < e ? n : e
    }
    function Jt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n,
        e.data[t + 1] = a,
        e.data[t + 2] = o,
        e.data[t + 3] = 255)
    }
    function Qt(t, n, a, o, e, r, l, i) {
        let s = Math.floor(e / 2)
          , c = s * s;
        var e = Math.min(t, a) - s
          , d = Math.min(n, o) - s
          , u = Math.max(t, a) + s
          , h = Math.max(n, o) + s;
        t -= e,
        n -= d,
        a -= e,
        o -= d;
        let p = ht.getImageData(e, d, u - e, h - d);
        function m(n, a) {
            for (let t = -s; t <= s; t++)
                for (let e = -s; e <= s; e++) {
                    var o;
                    t * t + e * e < c && (0 <= (o = 4 * ((a + e) * p.width + n + t)) && o < p.data.length && (p.data[o] = r,
                    p.data[1 + o] = l,
                    p.data[2 + o] = i,
                    p.data[3 + o] = 255))
                }
        }
        if (t == a && n == o)
            m(t, n);
        else {
            m(t, n),
            m(a, o);
            var g = Math.abs(a - t)
              , f = Math.abs(o - n)
              , y = t < a ? 1 : -1
              , v = n < o ? 1 : -1;
            let e = g - f;
            for (Math.floor(Math.max(0, s - 10) / 5); t != a || n != o; ) {
                var b = e << 1;
                -f < b && (e -= f,
                t += y),
                b < g && (e += g,
                n += v),
                m(t, n)
            }
        }
        ht.putImageData(p, e, d)
    }
    function en() {
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
    m(at, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    }),
    m("#game-toolbar .colors * .color", "click", function(e) {
        var t = this.colorIndex;
        let n = 0 == e.button;
        ((n = e.altKey ? !n : n) ? Wt : Pt)(t)
    }),
    m("#game-toolbar .colors-mobile * .color", "click", function(e) {
        var t = this.colorIndex;
        let n = 0 == e.button;
        ((n = e.altKey ? !n : n) ? Wt : Pt)(t),
        at.querySelector(".colors-mobile").classList.remove("open")
    }),
    m("#game-toolbar .sizes .size", "click", function(e) {
        var t;
        t = this.size.id,
        Tt((t = Dt[t]).element),
        It(t.size),
        zt()
    }),
    m([q], "DOMMouseScroll wheel", function(e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY,
        e = Math.sign(e);
        It(Lt + 2 * e)
    }),
    se("Swap", "S", "Swap the primary and secondary color.", Yt),
    m(at.querySelector(".color-picker .preview"), "click", function(e) {
        Yt()
    }),
    m(at.querySelector(".color-picker-mobile .preview"), "click", function(e) {
        at.querySelector(".colors-mobile").classList.toggle("open")
    }),
    m(lt, "click", function(e) {
        it.classList.toggle("open")
    }),
    m(s, "keydown", function(e) {
        if ("Enter" == e.code)
            return Me.focus(),
            0;
        if ("input" == s.activeElement.tagName.toLowerCase() || "textarea" == s.activeElement.tagName.toLowerCase() || -1 != Et)
            return 0;
        var n = e.key.toLowerCase().replace("key", "");
        for (let t = 0; t < d.length; t++)
            if (d[t].key.toLowerCase() == n) {
                for (let e = 0; e < d[t].cb.length; e++)
                    d[t].cb[e](d[t]);
                return void e.preventDefault()
            }
    }),
    m(q, "contextmenu", function(e) {
        return e.preventDefault(),
        !1
    });
    let tn = null;
    function nn(e, t, n, a) {
        var o = q.getBoundingClientRect()
          , e = Math.floor((e - o.left) / o.width * q.width)
          , t = Math.floor((t - o.top) / o.height * q.height);
        a ? (bt = vt = n,
        yt[0] = M[0] = e,
        yt[1] = M[1] = t) : (bt = vt,
        yt[0] = M[0],
        yt[1] = M[1],
        vt = n,
        M[0] = e,
        M[1] = t)
    }
    "PointerEvent"in u ? (m(q, "pointerdown", function(e) {
        if ((0 == e.button || 2 == e.button || 5 == e.button) && -1 == Et)
            switch (e.pointerType) {
            case "mouse":
                ln(e.button, e.clientX, e.clientY, !0, -1);
                break;
            case "pen":
                ln(e.button, e.clientX, e.clientY, !0, e.pressure);
                break;
            case "touch":
                null == tn && (tn = e.pointerId,
                ln(e.button, e.clientX, e.clientY, !0, -1))
            }
    }),
    m(s, "pointermove", function(e) {
        switch (e.pointerType) {
        case "mouse":
            rn(e.clientX, e.clientY, !1, -1);
            break;
        case "pen":
            rn(e.clientX, e.clientY, !1, e.pressure);
            break;
        case "touch":
            tn == e.pointerId && rn(e.clientX, e.clientY, !1, -1)
        }
    }),
    m(s, "pointerup", function(e) {
        "touch" == e.pointerType ? tn == e.pointerId && (tn = null,
        sn(e.button)) : sn(e.button)
    })) : (m(q, "mousedown", function(e) {
        e.preventDefault(),
        0 != e.button && 2 != e.button || -1 != Et || ln(e.button, e.clientX, e.clientY, !0, -1)
    }),
    m(s, "mouseup", function(e) {
        e.preventDefault(),
        sn(e.button)
    }),
    m(s, "mousemove", function(e) {
        rn(e.clientX, e.clientY, !1, -1)
    }),
    m(q, "touchstart", function(e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == tn && (tn = e[0].identitfier,
        ln(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }),
    m(q, "touchend touchcancel", function(e) {
        e.preventDefault();
        var t = e.changedTouches;
        for (let e = 0; e < t.length; e++)
            if (t[e].identitfier == tn) {
                sn(Et);
                break
            }
    }),
    m(q, "touchmove", function(e) {
        e.preventDefault();
        var t = e.changedTouches;
        for (let e = 0; e < t.length; e++)
            if (t[e].identitfier == tn) {
                rn(t[e].clientX, t[e].clientY, !1, t[e].force);
                break
            }
    }));
    let an = 0
      , on = 0;
    function rn(e, t, n, a) {
        nn(e, t, a = h.pressureSensitivity ? a : -1, n),
        cn(!1)
    }
    function ln(e, t, n, a, o) {
        h.pressureSensitivity || (o = -1),
        an = x.length,
        Et = e,
        nn(t, n, o, a),
        cn(!0)
    }
    function sn(e) {
        -1 == e || 0 != e && 2 != e && 5 != e || Et != e || (on != x.length && (on = x.length,
        ft.push(on)),
        tn = null,
        Et = -1)
    }
    function cn(n) {
        if (T.id == j && I == R && -1 != Et) {
            var a = 0 == Et ? qt : xt;
            let t = null;
            if (n) {
                n = function(e, t) {
                    var n = (e = ht.getImageData(e, t, 1, 1)).data[0]
                      , a = e.data[1]
                      , o = e.data[2];
                    for (let e = 0; e < Mt.length; e++) {
                        var r = Mt[e]
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
                if (Ct == Qe) {
                    if (n == a)
                        return;
                    t = (o = a,
                    r = M[0],
                    l = M[1],
                    [Ze, o, r, l])
                }
                if (Ct == Je)
                    return (0 == Et ? Wt : Pt)(n),
                    void Ot(wt)
            }
            if (Ct == je) {
                let e = Lt;
                0 <= vt && (e = (e - et) * E(vt, 0, 1) + et);
if(0 <= vt && localStorage.typoink == 'true') {const calcSkribblSize = (val) => Number(val) * 36 + 4;const calcLevelledSize = (val, level) => Math.pow(Number(val), Math.pow(1.5, (Number(level) - 50) / 10)); const sensitivity = 100 - Number(localStorage.sens);let levelled = calcLevelledSize(vt, sensitivity); e = Math.round(calcSkribblSize(levelled));}
                var o = Math.ceil(.5 * e)
                  , r = E(Math.floor(yt[0]), -o, q.width + o)
                  , l = E(Math.floor(yt[1]), -o, q.height + o)
                  , n = E(Math.floor(M[0]), -o, q.width + o)
                  , s = E(Math.floor(M[1]), -o, q.height + o);
                t = (a = a,
                c = e,
                d = r,
                u = l,
                n = n,
                s = s,
                [Xe, a, c, d, u, n, s])
            }
            null != t && Zt(t)
        }
        var c, d, u, o, r, l
    }
    setInterval(function() {
        var e, t;
        o && T.id == j && I == R && 0 < x.length - pt && (e = pt + 8,
        t = x.slice(pt, e),
        o.emit("data", {
            id: qa,
            data: t
        }),
        pt = Math.min(e, x.length))
    }, 50),
    setInterval(function() {
        o && T.id == j && I != R && mt < x.length && (_t(jt(x[mt]), x[mt]),
        mt++)
    }, 3);
    let dn = s.querySelector("#game-canvas .overlay")
      , un = s.querySelector("#game-canvas .overlay-content")
      , D = s.querySelector("#game-canvas .overlay-content .text")
      , hn = s.querySelector("#game-canvas .overlay-content .words")
      , pn = s.querySelector("#game-canvas .overlay-content .reveal")
      , $ = s.querySelector("#game-canvas .overlay-content .result")
      , mn = s.querySelector("#game-canvas .overlay-content .room");
    let gn = -100
      , fn = 0
      , yn = void 0;
    function vn(e, r, l) {
        let i = gn
          , s = fn
          , c = e.top - i
          , d = e.opacity - s;
        if (Math.abs(c) < .001 && Math.abs(d) < .001)
            l && l();
        else {
            let a = void 0
              , o = 0;
            yn = u.requestAnimationFrame(function e(t) {
                var n = t - (a = null == a ? t : a)
                  , t = (a = t,
                (o = Math.min(o + n, r)) / r)
                  , n = (n = t) < .5 ? .5 * function(e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function(e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2)
                  , t = t * t * (3 - 2 * t);
                gn = i + c * n,
                fn = s + d * t,
                un.style.top = gn + "%",
                dn.style.opacity = fn,
                o == r ? l && l() : yn = u.requestAnimationFrame(e)
            })
        }
    }
    function bn(e) {
        e.classList.add("show")
    }
/* TYPOMOD 
     desc: add event handlers for typo features */
    m(".avatar-customizer .container", "pointerdown", () => {
        jn(typo.createFakeLobbyData());}); 
    /* TYPOEND */
    function Sn(i) {
        for (let e = 0; e < un.children.length; e++)
            un.children[e].classList.remove("show");
        switch (i.id) {
        case ee:
            bn(mn);
            break;
        case X:
            bn(D),
            D.textContent = C("Round $", i.data + 1);
            break;
        case _:
            bn(D),
            D.textContent = C("Waiting for players...");
            break;
        case V:
            bn(D),
            D.textContent = C("Game starting in a few seconds...");
            break;
        case J:
            bn(pn),
            pn.querySelector("p span.word").textContent = i.data.word,
            pn.querySelector(".reason").textContent = function(e) {
                switch (e) {
                case B:
                    return C("Everyone guessed the word!");
                case K:
                    return C("The drawer left the game!");
                case G:
                    return C("Time is up!");
                default:
                    return "Error!"
                }
            }(i.data.reason);
            let a = pn.querySelector(".player-container")
              , o = (f(a),
            []);
            for (let e = 0; e < i.data.scores.length; e += 3) {
                var t = i.data.scores[e + 0]
                  , n = (i.data.scores[e + 1],
                i.data.scores[e + 2])
                  , t = P(t);
                t && o.push({
                    name: t.name,
                    score: n
                })
            }
            o.sort(function(e, t) {
                return t.score - e.score
            });
            for (let n = 0; n < Math.min(o.length, 12); n++) {
                let e = g("player");
                var l = o[n];
                e.appendChild(g("name", l.name));
                let t = g("score", (0 < l.score ? "+" : "") + l.score);
                l.score <= 0 && t.classList.add("zero"),
                e.appendChild(t),
                a.appendChild(e)
            }
            break;
        case Q:
            bn($);
            let r = [$.querySelector(".podest-1"), $.querySelector(".podest-2"), $.querySelector(".podest-3"), $.querySelector(".ranks")];
            for (let e = 0; e < 4; e++)
                f(r[e]);
            if (0 < i.data.length) {
                let n = [[], [], [], []];
                for (let e = 0; e < i.data.length; e++) {
                    var s = {
                        player: P(i.data[e][0]),
                        rank: i.data[e][1],
                        title: i.data[e][2]
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
                          , n = g("avatar-container")
                          , t = (e.appendChild(n),
                        g("border"));
                        t.appendChild(g("rank-place", "#" + (o + 1))),
                        t.appendChild(g("rank-name", c)),
                        t.appendChild(g("rank-score", C("$ points", d))),
                        e.appendChild(t),
                        0 == o && n.appendChild(g("trophy"));
                        for (let t = 0; t < a.length; t++) {
                            let e = ue(a[t].player.avatar, 0, 0 == o);
                            e.style.left = 15 * -(a.length - 1) + 30 * t + "%",
                            0 == o && (e.classList.add("winner"),
                            e.style.animationDelay = -2.35 * t + "s"),
                            n.appendChild(e)
                        }
                    }
                }
                var e = Math.min(5, n[3].length);
                for (let t = 0; t < e; t++) {
                    var u = n[3][t];
                    let e = g("rank");
                    var h = ue(u.player.avatar, 0, !1);
                    e.appendChild(h),
                    e.appendChild(g("rank-place", "#" + (u.rank + 1))),
                    e.appendChild(g("rank-name", u.player.name)),
                    e.appendChild(g("rank-score", C("$ points", u.player.score))),
                    r[3].appendChild(e)
                }
                0 < n[0].length ? (p = n[0].map(function(e) {
                    return e.player.name
                }).join(", "),
                $.querySelector(".winner-name").textContent = (0 < n[0].length ? p : "<user left>") + " ",
                $.querySelector(".winner-text").textContent = 1 == n[0].length ? C("is the winner!") : C("are the winners!")) : ($.querySelector(".winner-name").textContent = "",
                $.querySelector(".winner-text").textContent = C("Nobody won!"))
            } else
                $.querySelector(".winner-name").textContent = "",
                $.querySelector(".winner-text").textContent = C("Nobody won!");
            break;
        case Z:
            if (i.data.words)
                if (bn(D),
                bn(hn),
                f(hn),
                $n[ae.WORDMODE] == oe.COMBINATION) {
                    D.textContent = C("Choose the first word");
                    let a = i.data.words.length / 2
                      , o = []
                      , r = []
                      , l = 0;
                    for (let n = 0; n < a; n++) {
                        let e = g("word", i.data.words[n])
                          , t = (e.index = n,
                        g("word", i.data.words[n + a]));
                        t.index = n,
                        t.style.display = "none",
                        t.style.animationDelay = .03 * n + "s",
                        o.push(e),
                        r.push(t),
                        m(e, "click", function() {
                            l = this.index;
                            for (let e = 0; e < a; e++)
                                o[e].style.display = "none",
                                r[e].style.display = "";
                            D.textContent = C("Choose the second word")
                        }),
                        m(t, "click", function() {
                            la([l, this.index])
                        }),
                        hn.appendChild(e),
                        hn.appendChild(t)
                    }
                } else {
                    D.textContent = C("Choose a word");
                    for (let t = 0; t < i.data.words.length; t++) {
                        let e = g("word", i.data.words[t]);
                        e.index = t,
                        m(e, "click", function() {
                            la(this.index)
                        }),
                        hn.appendChild(e)
                    }
                }
            else {
                bn(D);
                var p = P(i.data.id)
                  , p = p ? p.name : C("User");
                D.textContent = C("$ is choosing a word!", p)
            }
        }
    }
    const kn = 0
      , wn = 1
      , Cn = 2
      , qn = 3
      , xn = 4
      , Mn = 5
      , Ln = 6;
    function En(e, t) {
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
    function Dn() {
        this.context = null,
        this.gain = null,
        this.sounds = new Map,
        u.addEventListener("load", this.load.bind(this), !1)
    }
    Dn.prototype.addSound = function(e, t) {
        this.sounds.set(e, new En(this,t))
    }
    ,
    Dn.prototype.loadSounds = function() {
        this.addSound(kn, "/audio/roundStart.ogg"),
        this.addSound(wn, "/audio/roundEndSuccess.ogg"),
        this.addSound(Cn, "/audio/roundEndFailure.ogg"),
        this.addSound(qn, "/audio/join.ogg"),
        this.addSound(xn, "/audio/leave.ogg"),
        this.addSound(Mn, "/audio/playerGuessed.ogg"),
        this.addSound(Ln, "/audio/tick.ogg")
    }
    ,
    Dn.prototype.playSound = function(t) {
        if (null == this.context)
            this.load();
        else if ("running" != this.context.state) {
            let e = this.context.resume();
            void e.then(()=>{
                this.playSound(t)
            }
            )
        } else if (null != this.context && 0 < h.volume && this.sounds.has(t)) {
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
    Dn.prototype.setVolume = function(e) {
        v[y].querySelector("#volume .title .icon").classList.toggle("muted", e <= 0),
        v[y].querySelector("#volume .volume-value").textContent = e <= 0 ? "Muted" : e + "%",
        this.gain && (this.gain.gain.value = e / 100)
    }
    ,
    Dn.prototype.load = function() {
        if (null == this.context)
            try {
                u.AudioContext = u.AudioContext || u.webkitAudioContext,
                this.context = new AudioContext,
                this.gain = this.context.createGain(),
                this.gain.connect(this.context.destination),
                this.setVolume(h.volume),
                console.log("AudioContext created."),
                this.loadSounds()
            } catch (e) {
                console.log("Error creating AudioContext.", e),
                this.context = null
            }
    }
    ,
    _;
    let o, A = [], R = 0, l = -1, I = -1, $n = [], T = {
        id: -1,
        time: 0,
        data: 0
    }, An = -1, Rn = 0, In = void 0, N = new Dn;
    let O = void 0
      , Tn = !1
      , Nn = !1
      , On = s.querySelector("#game-wrapper")
      , Wn = s.querySelector("#game-canvas .room")
      , Pn = s.querySelector("#game-players");
    s.querySelector("#game-chat");
    s.querySelector("#game-board");
    let Yn = s.querySelector("#game-bar")
      , zn = Pn.querySelector(".players-list")
      , Hn = Pn.querySelector(".players-footer")
      , Un = s.querySelector("#game-round")
      , W = [s.querySelector("#game-word .description"), s.querySelector("#game-word .word"), s.querySelector("#game-word .hints .container")]
      , Fn = s.querySelector("#home .container-name-lang input")
      , Bn = s.querySelector("#home .container-name-lang select");
    var lt = s.querySelector("#home .panel .button-play")
      , Gn = s.querySelector("#home .panel .button-create");
    function Kn(e) {
        Tn = e,
        s.querySelector("#load").style.display = e ? "block" : "none"
    }
    function _n(t, n, a, o) {
        {
            var r = function(e, t) {
                switch (e) {
                case 200:
                    return void a({
                        success: !0,
                        data: t
                    });
                case 503:
                case 0:
                    o && b(ye, C("Servers are currently undergoing maintenance!") + "\n\r" + C("Please try again later!"));
                    break;
                default:
                    o && b(ye, C("An unknown error occurred ('$')", e) + "\n\r" + C("Please try again later!"))
                }
                a({
                    success: !1,
                    error: e
                })
            };
            let e = new XMLHttpRequest;
            e.onreadystatechange = function() {
                4 == this.readyState && r(this.status, this.response)
            }
            ,
            e.open("POST", t, !0),
            e.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            e.send(n)
        }
    }
    let Vn = null;
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
                aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (Vn = t,
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
        N.context.resume(),
        o && ra();
        let a = 0;
        (o = Y(e, {
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
                b(ye, function(e) {
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
            o.on("data", $a);
            var e = Fn.value.split("#")
              , e = {
                join: t,
                create: n ? 1 : 0,
                name: e[0],
                lang: Bn.value,
                code: e[1],
                avatar: h.avatar
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
            case te:
                b(ve, C("You have been kicked!"));
                break;
            case ne:
                b(ve, C("You have been banned!"));
                break;
            default:
                b(ve, C("Connection lost!"))
            }
            ra()
        }),
        o.on("connect_error", e=>{
            ra(),
            Kn(!1),
            b(ye, e.message)
        }
        )
    }
    function jn(t) {
        var e;
        N.playSound(qn),
        Ot(je, !0),
        It(12),
        Wt(1),
        Pt(0),
        Vt(!0),
        f(Le),
        s.querySelector("#home").style.display = "none",
        s.querySelector("#game").style.display = "flex",
        R = t.me,
        An = t.type,
        In = t.id,
        s.querySelector("#input-invite").value = "https://skribbl.io/?" + t.id,
        e = t.settings,
        $n = e,
        Jn(),
        f(zn),
        A = [];
        for (let e = 0; e < t.users.length; e++)
            Aa(t.users[e], !1);
        if (Oa(),
        Wa(),
        ea(t.round),
        da(t.owner),
        na(t.state, !0),
        !Nn) {
            try {
                (adsbygoogle = u.adsbygoogle || []).push({}),
                (adsbygoogle = u.adsbygoogle || []).push({})
            } catch (e) {
                console.log("google ad request failed"),
                console.log(e)
            }
            Nn = !0
        }
    }
    function Jn() {
        ea(Rn);
        for (let e = 0; e < za.length; e++) {
            var t = za[e];
            t.index && (n = t,
            t = $n[t.index],
            "checkbox" == n.element.type ? n.element.checked = !!t : n.element.value = t)
        }
        var n
    }
    function Qn(e, t, n) {
        $n[e] = t,
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
        var e = (Rn = e) + 1
          , t = $n[ae.ROUNDS];
        Un.textContent = C("Round $ of $", [e, t]),
        Yn.querySelector(".mobile .round span").textContent = e + "/" + t
    }
    function ta() {
        for (let e = 0; e < A.length; e++)
            A[e].score = 0;
        for (let e = 0; e < A.length; e++)
            Pa(A[e], !1),
            Ya(A[e], !1);
        Wa()
    }
    function na(a, e) {
        var t, n;
        if (T = a,
        t = a,
        null != yn && (u.cancelAnimationFrame(yn),
        yn = void 0),
        t.id == j ? vn({
            top: -100,
            opacity: 0
        }, 600, function() {
            dn.classList.remove("show")
        }) : dn.classList.contains("show") ? vn({
            top: -100,
            opacity: 1
        }, 600, function() {
            Sn(t),
            vn({
                top: 0,
                opacity: 1
            }, 600)
        }) : (dn.classList.add("show"),
        Sn(t),
        vn({
            top: 0,
            opacity: 1
        }, 600)),
        n = a.time,
        _a(),
        Va(n),
        Ga = setInterval(function() {
            Va(Math.max(0, Ka - 1));
            let e = -1;
            T.id == j && (e = Ua),
            T.id == Z && (e = Fa),
            Ba.style.animationName = Ka < e ? Ka % 2 == 0 ? "rot_left" : "rot_right" : "none",
            Ka < e && N.playSound(Ln),
            Ka <= 0 && _a()
        }, 1e3),
        On.classList.add("toolbar-hidden"),
        kt(),
        oa(!1),
        a.id == ee ? (ta(),
        On.classList.add("room")) : On.classList.remove("room"),
        a.id == X && (ea(a.data),
        0 == a.data && ta()),
        a.id == J) {
            R != I && ca(a.data.word);
            for (let t = 0; t < a.data.scores.length; t += 3) {
                var o = a.data.scores[t + 0]
                  , r = a.data.scores[t + 1];
                a.data.scores[t + 2];
                let e = P(o);
                e && (e.score = r)
            }
            Wa();
            let t = !0;
            for (let e = 0; e < A.length; e++)
                if (A[e].guessed) {
                    t = !1;
                    break
                }
            t ? N.playSound(Cn) : N.playSound(wn),
            k(C("The word was '$'", a.data.word), "", S(Ae), !0)
/* TYPOMOD
             desc: log finished drawing */
            ;document.dispatchEvent(new CustomEvent("drawingFinished", { detail: a.data.word }));
            /* TYPOEND */
        } else
            a.id != j && (W[0].textContent = C("WAITING"),
            W[0].classList.add("waiting"),
            W[1].style.display = "none",
            W[2].style.display = "none");
        if (a.id == j) {
            if (I = a.data.id,
            N.playSound(kn),
            Vt(!0),
            a.data.drawCommands && (x = a.data.drawCommands),
            k(C("$ is drawing now!", P(I).name), "", S($e), !0),
            !e)
                for (let e = 0; e < A.length; e++)
                    Pa(A[e], !1);
            W[0].classList.remove("waiting"),
            I == R ? (n = a.data.word,
            W[0].textContent = C("DRAW THIS"),
            W[1].style.display = "",
            W[2].style.display = "none",
            W[1].textContent = n,
            On.classList.remove("toolbar-hidden"),
            kt()) : (oa(!0),
            ia(a.data.word, !1),
            sa(a.data.hints))
        } else {
            I = -1;
            for (let e = 0; e < A.length; e++)
                Pa(A[e], !1)
        }
        if (a.id == Q && 0 < a.data.length) {
            let t = []
              , n = 0;
            for (let e = 0; e < a.data.length; e++) {
                var l = a.data[e][0]
                  , i = a.data[e][1]
                  , l = P(l);
                l && 0 == i && (n = l.score,
                t.push(l.name))
            }
            1 == t.length ? k(C("$ won with a score of $!", [t[0], n]), "", S(Ie), !0) : 1 < t.length && k(C("$ and $ won with a score of $!", [t.slice(0, -1).join(", "), t[t.length - 1], n]), "", S(Ie), !0)
        }
        for (let e = 0; e < A.length; e++)
            Ya(A[e], A[e].id == I);
        Oa()
    }
    function aa(e) {
        o && o.connected && T.id == j && (o.emit("data", {
            id: ma,
            data: e
        }),
        oa(!1))
    }
    function oa(e) {
        s.querySelector("#game-rate").style.display = e ? "" : "none"
    }
    function ra() {
        o && o.close(),
        Vt(!(o = void 0)),
        _a(),
        A = [],
        R = 0,
        l = -1,
        I = -1,
        $n = [],
        T = {
            id: -1,
            time: 0,
            data: 0
        },
        s.querySelector("#home").style.display = "",
        s.querySelector("#game").style.display = "none"
    }
    function la(e) {
        o && o.connected && T.id == Z && o.emit("data", {
            id: Ca,
            data: e
        })
    }
    function ia(t, e) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++)
            n += t[e];
        var a = !e && 1 == $n[ae.WORDMODE];
        a && (n = 3),
        W[0].textContent = C(a ? "WORD HIDDEN" : "GUESS THIS"),
        W[1].style.display = "none",
        W[2].style.display = "",
        f(W[2]),
        W[2].hints = [];
        for (let e = 0; e < n; e++)
            W[2].hints[e] = g("hint", a ? "?" : "_"),
            W[2].appendChild(W[2].hints[e]);
        a || W[2].appendChild(g("word-length", t.join(" ")))
    }
    function sa(t) {
        let n = W[2].hints;
        for (let e = 0; e < t.length; e++) {
            var a = t[e][0]
              , o = t[e][1];
            n[a].textContent = o,
            n[a].classList.add("uncover")
        }
    }
    function ca(t) {
        (!W[2].hints || W[2].hints.length < t.length) && ia([t.length], !0);
        let n = [];
        for (let e = 0; e < t.length; e++)
            n.push([e, t.charAt(e)]);
        sa(n)
    }
    function da(e) {
        l = e;
        for (let e = 0; e < A.length; e++)
            pe(A[e].element, A[e].id == l),
            Ta(A[e], 0, A[e].id == l);
        var n = R != l;
        s.querySelector("#start-game").disabled = n;
        for (let t = 0; t < za.length; t++) {
            let e = za[t];
            e.element.disabled = n
        }
        e = P(l);
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
                Vn()
            },
            AIP_REMOVE: function() {}
        })
    });
    const ua = 1
      , ha = 2
      , pa = 5
      , ma = 8
      , ga = 10
      , fa = 11
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
      , Ea = 31
      , Da = 32;
    function $a(e) {
        var t = e.id
          , o = e.data;
        switch (t) {
        case ga:
/* TYPOMOD
                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                /* TYPOEND*/
            jn(o);
            break;
        case fa:
            na(o);
            break;
        case ya:
            Qn(o.id, o.val, !1);
            break;
        case va:
            sa(o);
            break;
        case ba:
            Va(o);
            break;
        case ua:
            k(C("$ joined the room!", Aa(o, !0).name), "", S(Ae), !0),
            N.playSound(qn),
            Wa();
            break;
        case ha:
            var n = function(n) {
                for (let t = 0; t < A.length; t++) {
                    let e = A[t];
                    if (e.id == n)
                        return A.splice(t, 1),
                        e.element.remove(),
                        Wa(),
                        Oa(),
                        e
                }
                return
            }(o.id);
            n && (k(function(e, t) {
                switch (e) {
                default:
                    return C("$ left the room!", t);
                case te:
                    return C("$ has been kicked!", t);
                case ne:
                    return C("$ has been banned!", t)
                }
            }(o.reason, n.name), "", S(Re), !0),
            N.playSound(xn),
            (o.id == I && o.reason == te || o.reason == ne) && Vt(!0));
            break;
        case pa:
            var n = P(o[0])
              , r = P(o[1])
              , l = o[2]
              , i = o[3];
            n && r && k(C("$ is voting to kick $ ($/$)", [n.name, r.name, l, i]), "", S(De), !0);
            break;
        case Sa:
            n = P(o.id);
            if (n) {
                let e = k(C("$ guessed the word!", n.name), "", S(Ae), !0);
                e.classList.add("guessed"),
                Pa(n, !0),
                N.playSound(Mn),
                o.id == R && ca(o.word)
            }
            break;
        case ma:
            r = P(o.id);
            if (r) {
                {
                    l = r;
                    i = 0 == o.vote ? "thumbsdown.gif" : "thumbsup.gif";
                    let e = g("icon")
                      , t = (e.style.backgroundImage = "url(/img/" + i + ")",
                    Ia(l, e))
                      , n = t.getBoundingClientRect()
                      , a = .9 * (n.bottom - n.top);
                    e.style.width = a + "px",
                    e.style.height = a + "px"
                }
                o.vote ? k(C("$ liked the drawing!", r.name), "", S(Ae), !0) : k(C("$ disliked the drawing!", r.name), "", S(Re), !0)
            }
            break;
        case wa:
            da(o);
            break;
        case ka:
            k(C("$ is close!", o), "", S(De), !0);
            break;
        case La:
            Ra(P(o.id), o.msg);
            break;
        case Da:
            k(C("Spam detected! You're sending messages too quickly."), "", S(Re), !0);
            break;
        case Ea:
            switch (o.id) {
            case 0:
                k(C("You need at least 2 players to start the game!"), "", S(Re), !0);
                break;
            case 100:
                k(C("Server restarting in about $ seconds!", o.data), "", S(Re), !0)
            }
            break;
        case qa:
            for (let e = 0; e < o.length; e++)
                Zt(o[e]);
            break;
        case xa:
            Vt(!0);
            break;
        case Ma:
            Bt(o);
            break;
        default:
            return void console.log("Unimplemented data packed received with id " + t)
        }
    }
    function P(t) {
        for (let e = 0; e < A.length; e++) {
            var n = A[e];
            if (n.id == t)
                return n
        }
    }
    function Aa(e, t) {
        let n = {
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
            element: g("player"),
            bubble: void 0
        };
        A.push(n);
        e = n.id == R ? C("$ (You)", n.name) : n.name;
        let a = g("player-avatar-container")
          , o = ue(n.avatar)
          , r = (n.element.drawing = g("drawing"),
        o.appendChild(n.element.drawing),
        a.appendChild(o),
        n.element.appendChild(a),
        zn.appendChild(n.element),
        g("player-info"))
          , l = g("player-name", e);
        n.id == R && l.classList.add("me"),
        r.appendChild(l),
        r.appendChild(g("player-rank", "#" + n.rank)),
        r.appendChild(g("player-score", C("$ points", n.score))),
        n.element.appendChild(r),
        m(n.element, "click", function() {
            O = n,
            b(p, n)
        });
        4 == (4 & n.flags) && (n.interval = setInterval(function() {
            n.avatar[0] = (n.avatar[0] + 1) % F[0],
            he(o, n.avatar)
        }, 250));
/* TYPOMOD
         desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id);
        /* TYPOEND */
        let i = g("player-icons");
        var e = g("icon owner")
          , s = g("icon muted");
        return i.appendChild(e),
        i.appendChild(s),
        n.element.appendChild(i),
        n.element.icons = [e, s],
        Pa(n, n.guessed),
        t && Oa(),
        n
    }
    function Ra(e, t) {
        var n;
        e.muted || (n = e.id == I || e.guessed,
        R != I && !P(R).guessed && n || (Ia(e, g("text", t)),
        k(e.name, t, S(n ? Te : Ee))))
    }
    function Ia(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout),
        e.bubble.remove(),
        e.bubble = void 0);
        let n = g("player-bubble")
          , a = g("content");
        return a.appendChild(t),
        n.appendChild(g("arrow")),
        n.appendChild(a),
        e.element.appendChild(n),
        e.bubble = n,
        e.bubble.timeout = setTimeout(function() {
            e.bubble.remove(),
            e.bubble = void 0
        }, 1500),
        n
    }
    function Ta(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    let Na = void 0;
    function Oa() {
        T.id,
        ee;
        let e = getComputedStyle(s.documentElement)
          , t = e.getPropertyValue("--PLAYERS_PER_PAGE");
        t <= 0 && (n = Math.max(48, zn.clientHeight),
        t = Math.floor(n / 48));
        var n = Math.ceil(A.length / t);
        for (let e = 0; e < A.length; e++)
            A[e].page = Math.floor(e / t);
        null == Na ? Na = me(Hn, n, [Pn], function(e, n, t) {
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
        }) : ge(Na, n),
        Na.element.style.display = 1 < n ? "" : "none"
    }
    function Wa() {
        let t = [];
        for (let e = 0; e < A.length; e++)
            t.push(A[e]);
        t.sort(function(e, t) {
            return t.score - e.score
        });
        let n = 1;
        for (let e = 0; e < t.length; e++) {
            var a = t[e];
            {
                o = void 0;
                r = void 0;
                var o = a;
                var r = n;
                o.rank = r,
                o.element.querySelector(".player-score").textContent = C("$ points", o.score);
                let e = o.element.querySelector(".player-rank");
                e.textContent = "#" + r,
                e.classList.remove("first"),
                e.classList.remove("second"),
                e.classList.remove("third"),
                1 == r && e.classList.add("first"),
                2 == r && e.classList.add("second"),
                3 == r && e.classList.add("third")
            }
            e < t.length - 1 && a.score > t[e + 1].score && n++
        }
    }
    function Pa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }
    function Ya(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    let za = [];
    {
        let t = Wn.querySelectorAll('*[id^="item-"]');
        for (let e = 0; e < t.length; e++) {
            var Ha = {
                id: t[e].id.replace("item-settings-", ""),
                element: t[e],
                index: t[e].dataset.setting
            };
            t[e].item = Ha,
            za.push(Ha),
            m(t[e].item.element, "change", function() {
                let e = this.value;
                "checkbox" == this.type && (e = this.checked ? 1 : 0),
                null != this.item.index && Qn(this.item.index, e, !0)
            })
        }
    }
    const Ua = 10
      , Fa = 4;
    let Ba = s.querySelector("#game-clock")
      , Ga = null
      , Ka = 0;
    function _a() {
        Ga && (clearInterval(Ga),
        Ga = null)
    }
    function Va(e) {
        Ka = e,
        Ba.textContent = Ka,
        Yn.querySelector(".mobile .drawtime span").textContent = Ka + "s"
    }
    let Xa = s.querySelector("#tutorial")
      , Za = Xa.querySelectorAll(".page")
      , ja = me(Xa.querySelector(".navigation"), Za.length, [Xa.querySelector(".pages")], function(e, t, n) {
        n && clearInterval(Ja);
        for (let e = 0; e < Za.length; e++)
            Za[e].classList.remove("active");
        Za[t].classList.add("active")
    })
      , Ja = setInterval(function() {
        ja.selected < 4 ? fe(ja, ja.selected + 1, !1) : fe(ja, 0, !1)
    }, 3500);
    var Qa = s.querySelector("#game-settings");
    s.querySelector("#audio"),
    s.querySelector("#lightbulb");
    function eo() {
        var e = .01 * u.innerHeight;
        s.documentElement.style.setProperty("--vh", e + "px")
    }
    function to() {
        k(C("Copied room link to clipboard!"), "", S(De), !0);
        var t = "https://skribbl.io/?" + In;
        if (navigator.clipboard)
            navigator.clipboard.writeText(t).then(function() {
                console.log("Async: Copying to clipboard was successful!")
            }, function(e) {
                console.error("Async: Could not copy text: ", e)
            });
        else {
            let e = s.createElement("textarea");
            e.value = t,
            e.style.top = "0",
            e.style.left = "0",
            e.style.position = "fixed",
            s.body.appendChild(e),
            e.select(),
            e.focus();
            try {
                var n = s.execCommand("copy");
                console.log("Copying link was " + (n ? "successful" : "unsuccessful"))
            } catch (e) {
                console.log("Unable to copy link " + e)
            }
            s.body.removeChild(e)
        }
    }
    function no(e) {
        let t = xe.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }
    function ao(e) {
        o && o.connected ? o.emit("data", {
            id: La,
            data: e
        }) : Ra(P(R), e)
    }
    m(Qa, "click", function() {
        b(y)
    }),
    m(u, "resize", function() {
        eo(),
        Oa()
    }),
    u.onunload = function() {
        o && ra()
    }
    ,
    m(s, "PointerEvent"in u ? "pointerdown" : "click", function(e) {
        n.elements.main.contains(e.target) || n.isOpen && (delete s.documentElement.dataset.mobileKeyboardOpen,
        Oa(),
        n.isOpen = !1),
        s.querySelector("#game-toolbar .sizes").contains(e.target) || zt()
    }),
    m([Fn, Bn], "change", a),
    m(lt, "click",
typo.joinLobby = function() {
        var t = function(e, t) {
            let n = "";
            return e = e.split("?"),
            n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n
        }(u.location.href)
;typo.lastConnect = Date.now();
        if (!Tn) {
            let e = "" != t ? "id=" + t : "lang=" + Bn.value;
            qe(),
            Kn(!0),
            Xn(function() {
                _n(location.origin + ":3000/play", e, function(e) {
                    Kn(!1),
                    e.success && Zn(e.data, t)
                }, !0)
            })
        }
    }),
    m(Gn, "click", function() {
        Tn || (qe(),
        Kn(!0),
        Xn(function() {
            _n(location.origin + ":3000/play", "lang=" + Bn.value, function(e) {
                e.success ? Zn(e.data, 0, 1) : Kn(!1)
            }, !0)
        }))
    }),
    m(s.querySelector("#game-rate .like"), "click", function() {
        aa(1)
    }),
    m(s.querySelector("#game-rate .dislike"), "click", function() {
        aa(0)
    }),
    m(s.querySelector("#start-game"), "click", function() {
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
    m([s.querySelector("#copy-invite"), s.querySelector("#modal-player-button-invite")], "click", to),
    m(v[p].querySelector("button.kick"), "click", function() {
        qe(),
        null != O && O.id != R && R == l && o && o.emit("data", {
            id: 3,
            data: O.id
        })
    }),
    m(v[p].querySelector("button.ban"), "click", function() {
        qe(),
        null != O && O.id != R && R == l && o && o.emit("data", {
            id: 4,
            data: O.id
        })
    }),
    m(v[p].querySelector("button.votekick"), "click", function() {
        qe(),
        null != O && O.id != R && o && (O.id == l ? k(C("You can not votekick the lobby owner!"), "", S(Re), !0) : o.emit("data", {
            id: pa,
            data: O.id
        }))
    }),
    m(v[p].querySelector("button.mute"), "click", function() {
        null != O && O.id != R && (O.muted = !O.muted,
        Ta(O, 1, O.muted),
        O.muted ? k(C("You muted '$'!", O.name), "", S(Re), !0) : k(C("You unmuted '$'!", O.name), "", S(Re), !0),
        o && o.emit("data", {
            id: 7,
            data: O.id
        }),
        Ce(O.muted))
    }),
    m(v[p].querySelector("button.report"), "click", function() {
        v[p].querySelector(".buttons").style.display = "none",
        v[p].querySelector(".player").style.display = "none",
        v[p].querySelector(".report-menu").style.display = "";
        let t = v[p].querySelectorAll(".report-menu input");
        for (let e = 0; e < t.length; e++)
            t[e].checked = !1
    }),
    m(v[p].querySelector("button#report-send"), "click", function() {
        let e = 0;
        v[p].querySelector("#report-reason-toxic").checked && (e |= 1),
        v[p].querySelector("#report-reason-spam").checked && (e |= 2),
        v[p].querySelector("#report-reason-bot").checked && (e |= 4),
        0 < e && (null != O && O.id != R && (O.reported = !0,
        o && o.emit("data", {
            id: 6,
            data: {
                id: O.id,
                reasons: e
            }
        }),
        k(C("Your report for '$' has been sent!", O.name), "", S(De), !0)),
        qe())
    }),
    m(v[y].querySelector("#volume input"), "change", function(e) {
        h.volume = e.target.value,
        N.setVolume(h.volume),
        N.playSound(Mn),
        a()
    }),
    m(v[y].querySelector("#select-pressure-sensitivity"), "change", function(e) {
        h.pressureSensitivity = e.target.value,
        a()
    }),
    m(v[y].querySelector("button.reset"), "click", function() {
        for (let e = 0; e < d.length; e++) {
            let t = d[e];
            t.key = t.def,
            t.listing.querySelector("input").value = t.key;
            for (let e = 0; e < t.changed.length; e++)
                t.changed[e](t)
        }
        ce()
    }),
    m(s.querySelector("#game-keyboard button.settings"), "click", function(e) {
        b(y)
    }),
    m(Me, "focusin focus", function(e) {
        e.preventDefault()
    }),
    m(Me, "input", function(e) {
        no(Me.value.length)
    }),
    m(xe, "submit", function(e) {
const input = Me; let rest = input.value.substring(100);
        input.value = input.value.substring(0,100);
        if(rest.length > 0) setTimeout(()=>{input.value = rest; e.target.dispatchEvent(new Event("submit"));},180);
        return e.preventDefault(),
        Me.value && ao(Me.value),
        xe.reset(),
        no(0),
        !1
    }),
    eo(),
    u.localStorageAvailable ? (Fn.value = e("name", ""),
    Bn.value = function(t) {
        var n = s.querySelectorAll("#home .panel .container-name-lang select option");
        for (let e = 0; e < n.length; e++)
            if (n[e].value == t)
                return n[e].value;
        return 0
    }(e("lang", 0)),
    h.displayLang = e("displaylang", "en"),
    h.volume = parseInt(e("volume", 100)),
    h.filterChat = 1 == parseInt(e("filter", 1)) ? 1 : 0,
    h.pressureSensitivity = 1 == parseInt(e("pressure", 1)) ? 1 : 0,
    h.avatar = (Qa = "ava",
    lt = h.avatar,
    null == (Qa = c.getItem(Qa)) ? lt : JSON.parse(Qa)),
    He.value = e("keyboard", 1),
    Ue.value = e("keyboardlayout", "en"),
    Be(),
    v[y].querySelector("#volume input").value = h.volume,
    N.setVolume(h.volume),
    console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
    for (var oo = s.querySelectorAll("[data-translate]"), ro = 0; ro < oo.length; ro++) {
        var lo = oo[ro];
        Ve(lo, lo.dataset.translate)
    }
    for (var io = Ge[h.displayLang], so = 0; so < Ke.length; so++) {
        var co = Ke[so]
          , uo = _e(io, co.key);
        "text" == co.type && (co.element.textContent = uo),
        "placeholder" == co.type && (co.element.placeholder = uo)
    }
    m(Gn = s.querySelectorAll("[data-tooltip]"), "pointerenter", function(e) {
        Pe(e.target)
    }),
    m(Gn, "pointerleave", function(e) {
        Ye()
    });
    {
        let e = s.querySelector("#home .avatar-customizer")
          , t = e.querySelector(".container")
          , n = (lt = e.querySelectorAll(".arrows.left .arrow"),
        Qa = e.querySelectorAll(".arrows.right .arrow"),
        Gn = e.querySelectorAll(".randomize"),
        ue(h.avatar));
        function ho(e) {
            n.parts[e].classList.remove("bounce"),
            n.parts[e].offsetWidth,
            n.parts[e].classList.add("bounce")
        }
        n.classList.add("fit"),
        t.appendChild(n),
        m(lt, "click", function() {
            var e = parseInt(this.dataset.avatarIndex);
            --h.avatar[e],
            h.avatar[e] < 0 && (h.avatar[e] = F[e] - 1),
            ho(e),
            he(n, h.avatar),
            a()
        }),
        m(Qa, "click", function() {
            var e = parseInt(this.dataset.avatarIndex);
            h.avatar[e] += 1,
            h.avatar[e] >= F[e] && (h.avatar[e] = 0),
            ho(e),
            he(n, h.avatar),
            a()
        }),
        m(Gn, "click", function() {
            h.avatar[0] = Math.floor(Math.random() * F[0]),
            h.avatar[1] = Math.floor(Math.random() * F[1]),
            h.avatar[2] = Math.floor(Math.random() * F[2]),
            ho(1),
            ho(2),
            he(n, h.avatar),
            a()
        })
    }
    {
        var po = Math.round(8 * Math.random());
        let a = s.querySelector("#home .logo-big .avatar-container");
        for (let n = 0; n < 8; n++) {
            let e = [0, 0, 0, -1]
              , t = (e[0] = n,
            e[1] = Math.round(100 * Math.random()) % H,
            e[2] = Math.round(100 * Math.random()) % U,
            1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())),
            ue(e, 0, po == n));
            t.index = n,
            a.append(t),
            m(t, "click", function() {
                let e = [this.index, 0, 0, -1];
                e[1] = Math.round(100 * Math.random()) % H,
                e[2] = Math.round(100 * Math.random()) % U,
                1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())),
                he(this, e),
                this.classList.remove("clicked"),
                this.offsetWidth,
                this.classList.add("clicked")
            })
        }
    }
}(window, document, localStorage, io);
