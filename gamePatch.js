!function (h, u, c, P) {
    const Y = 26
        , z = 57
        , H = 51
        , U = [Y, z, H]
        , F = 0
        , K = 1
        , B = 2
        , G = 0
        , _ = 1
        , V = 2
        , X = 3
        , Z = 4
        , j = 5
        , J = 6
        , Q = 7;
    const ee = 1
        , te = 2
        , ne = {
            LANG: 0,
            SLOTS: 1,
            DRAWTIME: 2,
            ROUNDS: 3,
            WORDCOUNT: 4,
            HINTCOUNT: 5,
            WORDMODE: 6,
            CUSTOMWORDSONLY: 7
        }
        , ae = {
            NORMAL: 0,
            HIDDEN: 1,
            COMBINATION: 2
        }
        // TYPOMOD 
        // desc: create re-useable functions
        , typo = {
            joinLobby: undefined, createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
                // IDENTIFY x.value.split: #home .container-name-lang input -> Bn
                // IDENTIFY x.avatar: [Math.round(100 * Math.random()) % -> p
                return { id: id, name: name.length != 0 ? name : (Bn.value.split("#")[0] != "" ? Bn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? p.avatar : avatar, score: score, guessed: guessed };
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
                let abort = false; document.addEventListener("abortJoin", () => abort = true); document.addEventListener("joinLobby", (e) => {
                    abort = false; let timeoutdiff = Date.now() - (typo.lastConnect == 0 ? Date.now() : typo.lastConnect);
                    //Xn(true);
                    setTimeout(() => {
                        if (abort) return; typo.lastConnect = Date.now();
                        //_n.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play") -> BTNPLAY
                        //##PRIVATELBBY## = !1 // IDENTIFY: x:  = !1   
                        if (e.detail) window.history.pushState({ path: window.location.origin + '?' + e.detail }, '', window.location.origin + '?' + e.detail);////##JOINLOBBY##(e.detail?.join ? e.detail.join : ""); // IDENTIFY x(e.det..): ? "id=" + -> JOINLOBBY
                        typo.joinLobby(); window.history.pushState({ path: window.location.origin }, '', window.location.origin);//Zn(false); // IDENTIFY x(false): querySelector("#load").style.display -> LOADING
                        document.dispatchEvent(new Event("joinedLobby"));
                    }, timeoutdiff < 2000 ? 2000 - timeoutdiff : 0);
                });
                document.addEventListener("leaveLobby", () => {
                    if (typo.disconnect) typo.disconnect();
                    else ca() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = "" -> GOHOME
                });
                document.addEventListener("setColor", (e) => {
                    let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                    let match = xt.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]); // IDENTIFY [0, 59, 120], -> COLORS
                    let code = match >= 0 ? match : e.detail.code;
                    if (e.detail.secondary) Yt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill -> SECFILL
                    else Pt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill -> PRIMFILL
                });
                document.addEventListener("performDrawCommand", (e) => {
                    S.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = [] -> PUSHCMD
                    Vt(Jt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil -> PERFOUTER, PERFINNER
                });
                document.addEventListener("addTypoTooltips", () => {
                    [...document.querySelectorAll("[data-typo-tooltip]")].forEach(elem => {
                        elem.setAttribute("data-tooltip", elem.getAttribute("data-typo-tooltip"));
                        elem.removeAttribute("data-typo-tooltip");
                        elem.addEventListener("mouseenter", (e) => Oe(e.target)); // IDENTIFY: x(e.target): 
                        elem.addEventListener("mouseleave", (e) => We()); // IDENTIFY: (e) => x(): 

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
        , oe = ["Normal", "Hidden", "Combination"]
        , re = ["English", "German", "Bulgarian", "Czech", "Danish", "Dutch", "Finnish", "French", "Estonian", "Greek", "Hebrew", "Hungarian", "Italian", "Japanese", "Korean", "Latvian", "Macedonian", "Norwegian", "Portuguese", "Polish", "Romanian", "Russian", "Serbian", "Slovakian", "Spanish", "Swedish", "Tagalog", "Turkish"];
    if (h.localStorageAvailable = !1,
        void 0 !== c)
        try {
            c.setItem("feature_test", "yes"),
                "yes" === c.getItem("feature_test") && (c.removeItem("feature_test"),
                    h.localStorageAvailable = !0)
        } catch (e) { }
    var d = [];
    function ie(e) {
        for (var t = 0; t < d.length; t++)
            if (d[t].name == e)
                return d[t]
    }
    function le(e, t, n, a, o) {
        var r, i, l = t, s = (!h.localStorageAvailable || (r = c.getItem("hotkey_" + e)) && (t = r),
            ie(e));
        return s ? (s.key = t,
            s.def = l,
            s.desc = n) : (s = {
                name: e,
                desc: n,
                key: t,
                def: l,
                listing: $("item"),
                changed: [],
                cb: []
            },
                d.push(s),
                Ve(r = $("key", s.name), "text"),
                s.listing.appendChild(r),
                (i = u.createElement("input")).value = s.key,
                s.listing.appendChild(i),
                D(i, "keydown", function (e) {
                    for (var t = e.key, n = 0; n < d.length; n++)
                        if (d[n].key == t)
                            return void e.preventDefault();
                    i.value = t,
                        s.key = t;
                    for (n = 0; n < s.changed.length; n++)
                        s.changed[n](s);
                    return se(),
                        e.preventDefault(),
                        !1
                }),
                y[g].querySelector("#hotkey-list").appendChild(s.listing)),
            a && s.cb.push(a),
            o && s.changed.push(o),
            s
    }
    function se() {
        if (h.localStorageAvailable)
            for (var e = 0; e < d.length; e++)
                h.localStorage.setItem("hotkey_" + d[e].name, d[e].key)
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
        h.localStorageAvailable ? (c.setItem("name", Bn.value),
            c.setItem("lang", Gn.value),
            c.setItem("displaylang", p.displayLang),
            c.setItem("volume", p.volume),
            c.setItem("dark", 1 == p.dark ? 1 : 0),
            c.setItem("filter", 1 == p.filterChat ? 1 : 0),
            c.setItem("pressure", 1 == p.pressureSensitivity ? 1 : 0),
            c.setItem("ava", JSON.stringify(p.avatar)),
            c.setItem("keyboard", Ye.value),
            c.setItem("keyboardlayout", ze.value),
            console.log("Settings saved.")) : console.log("Settings not saved. LocalStorage unavailable.")
    }
    function D(e, t, n) {
        for (var a, o = e, r = ("string" == typeof e ? o = u.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]),
            t.split(" ")), i = 0; i < o.length; i++)
            for (var l = 0; l < r.length; l++)
                o[i].addEventListener(r[l], n)
    }
    function $(e, t) {
        var n = u.createElement("div");
        if (void 0 !== e)
            for (var a = e.split(" "), o = 0; o < a.length; o++)
                n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t),
            n
    }
    function ce(e, t, n) {
        var a = u.createElement(e);
        if (void 0 !== t)
            for (var o = t.split(" "), r = 0; r < o.length; r++)
                a.classList.add(o[r]);
        return void 0 !== n && (a.textContent = n),
            a
    }
    function A(e) {
        for (; e.firstChild;)
            e.removeChild(e.firstChild)
    }
    function de(e, t, n) {
        var a = $("avatar")
            , o = $("color")
            , r = $("eyes")
            , i = $("mouth")
            , l = $("special")
            , s = $("owner");
        return s.style.display = n ? "block" : "none",
            a.appendChild(o),
            a.appendChild(r),
            a.appendChild(i),
            a.appendChild(l),
            a.appendChild(s),
            a.parts = [o, r, i],
            ue(a, e),
            a
    }
    function ue(e, t) {
        function n(e, t, n, a) {
            var o = -t % n * 100
                , t = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + t + "%"
        }
        var a = t[0] % Y
            , o = t[1] % z
            , r = t[2] % H
            , t = t[3]
            , a = (n(e.querySelector(".color"), a, 10),
                n(e.querySelector(".eyes"), o, 10),
                n(e.querySelector(".mouth"), r, 10),
                e.querySelector(".special"));
        0 <= t ? (a.style.display = "",
            n(a, t, 10)) : a.style.display = "none"
    }
    function he(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }
    function pe(e, t, n, a) {
        var o = {
            element: $("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element),
            n.push(o.element),
            D(n, "DOMMouseScroll wheel", function (e) {
                var t;
                1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY,
                    t = Math.sign(t),
                    ge(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)),
                    e.preventDefault(),
                    e.stopPropagation()
            }),
            me(o, t),
            o
    }
    function me(e, t) {
        A(e.element),
            e.dots = [];
        for (var n = 0; n < t; n++) {
            var a = $("dot");
            a.index = n,
                a.appendChild($("inner")),
                D(a, "click", function () {
                    ge(e, this.index, !0)
                }),
                e.element.appendChild(a),
                e.dots.push(a)
        }
        e.selected < 0 && (e.selected = 0),
            e.selected >= t && (e.selected = t - 1),
            ge(e, e.selected, !1)
    }
    function ge(e, t, n) {
        if (0 <= t && t < e.dots.length) {
            e.selected = t;
            for (var a = 0; a < e.dots.length; a++)
                e.dots[a].classList.remove("active");
            e.dots[t].classList.add("active"),
                e.change(e, t, n)
        }
    }
    const m = 0
        , fe = 1
        , ye = 2
        , ve = 3
        , g = 4
        , be = 5;
    var f = u.querySelector("#modal")
        , Se = f.querySelector(".modal-title .text")
        , ke = f.querySelector(".modal-content")
        , y = [];
    function we(e) {
        y[m].querySelector(".buttons button.mute").textContent = R(e ? "Unmute" : "Mute")
    }
    function i(e, t) {
        f.style.display = "block";
        for (var n = 0; n < y.length; n++)
            y[n].style.display = "none";
        y[e].style.display = "flex";
        var a = y[e];
        switch (e) {
            case fe:
                Se.textContent = R("Something went wrong!"),
                    a.querySelector(".message").textContent = t;
                break;
            case ye:
                Se.textContent = R("Disconnected!"),
                    a.querySelector(".message").textContent = t;
                break;
            case m:
                Se.textContent = t.id == C ? R("$ (You)", t.name) : t.name;
                var o = (W(C).flags & An) == An
                    , r = (t.flags & An) == An
                    , i = a.querySelector(".buttons")
                    , r = (i.style.display = t.id == C || r ? "none" : "flex",
                        i.querySelector(".button-pair").style.display = C == Rn || o ? "flex" : "none",
                        i.querySelector("button.report").style.display = t.reported ? "none" : "",
                        we(t.muted),
                        a.querySelector(".report-menu").style.display = "none",
                        a.querySelector(".invite").style.display = C == t.id ? "flex" : "none",
                        ke.querySelector(".player"))
                    , o = (r.style.display = "",
                        A(r),
                        de(t.avatar));
                he(o, Rn == t.id),
                    r.appendChild(o);
                break;
            case be:
                Se.textContent = R("Rooms"),
                    roomsUpdate(t);
                break;
            case ve:
                Se.textContent = 0 == Tn ? "Public Room" : "Private Room",
                    A(a);
                for (var l = ["Language", "Players", "Drawtime", "Rounds", "Word count", "Hint count", "Word mode", "Custom words only"], s = $("settings"), n = 0; n < In.length; n++) {
                    var c = $("setting")
                        , d = ce("img", "icon")
                        , d = (d.src = "/img/setting_" + n + ".gif",
                            c.appendChild(d),
                            c.appendChild(ce("span", "name", l[n] + ":")),
                            In[n]);
                    n == ne.CUSTOMWORDSONLY && (d = d ? "Yes" : "No"),
                        n == ne.SLOTS && (d = w.length + "/" + d),
                        n == ne.LANG && (d = re[d]),
                        n == ne.WORDMODE && (d = oe[d]),
                        n == ne.DRAWTIME && (d += "s"),
                        c.appendChild(ce("span", "value", d)),
                        s.appendChild(c)
                }
                a.appendChild(s);
                i = u.querySelector("#game-invite").cloneNode(!0);
                D(i.querySelector("#copy-invite"), "click", io),
                    a.appendChild(i);
                break;
            case g:
                Se.textContent = R("Settings"),
                    a.querySelector("#select-pressure-sensitivity").value = p.pressureSensitivity
        }
    }
    function Ce() {
        f.style.display = "none"
    }
    y[m] = f.querySelector(".modal-container-player"),
        y[fe] = f.querySelector(".modal-container-info"),
        y[ye] = f.querySelector(".modal-container-info"),
        y[ve] = f.querySelector(".modal-container-room"),
        y[g] = f.querySelector(".modal-container-settings"),
        D(h, "click", function (e) {
            e.target == f && Ce()
        }),
        D([f.querySelector(".close"), y[fe].querySelector("button.ok")], "click", Ce);
    var qe = u.querySelector("#game-chat form")
        , xe = u.querySelector("#game-chat form input")
        , Me = u.querySelector("#game-chat .chat-content");
    const Le = 0;
    const Ee = 2
        , De = 3
        , $e = 4
        , Ae = 5
        , Re = 6
        , Ie = 7
        , Te = ["BASE", "GUESSED", "CLOSE", "DRAWING", "JOIN", "LEAVE", "OWNER", "GUESSCHAT"];
    function v(e) {
        return "var(--COLOR_CHAT_TEXT_" + Te[e] + ")"
    }
    function Ne() {
        Me.scrollTop = Me.scrollHeight + 100
    }
    function b(e, t, n, a) {
        var o = u.createElement("p")
            , r = u.createElement("b")
            , a = (r.textContent = a ? e : e + ": ",
                o.appendChild(r),
                o.style.color = n,
                u.createElement("span"))
            , e = (a.textContent = t,
                o.appendChild(a),
                Me.scrollHeight - Me.scrollTop - Me.clientHeight <= 20);
        if (Me.appendChild(o),
            e && Ne(),
            0 < p.chatDeleteQuota)
            for (; Me.childElementCount > p.chatDeleteQuota;)
                Me.firstElementChild.remove();
        return o
    }
    var l = void 0;
    function Oe(e) {
        We();
        for (var t = e.dataset.tooltip, n = e.dataset.tooltipdir || "N", a = ((l = $("tooltip")).appendChild($("tooltip-arrow")),
            l.appendChild($("tooltip-content", R(t))),
            !1), o = e; o;) {
            if ("fixed" == h.getComputedStyle(o).position) {
                a = !0;
                break
            }
            o = o.parentElement
        }
        l.style.position = a ? "fixed" : "absolute";
        var t = e.getBoundingClientRect()
            , e = ("E" == (n = "W" == (n = "S" == (n = "N" == n && t.top - h.scrollY < 48 ? "S" : n) && t.bottom - h.scrollY > u.documentElement.clientHeight - 48 ? "N" : n) && t.left - h.scrollX < 48 ? "E" : n) && t.right - h.scrollX > u.documentElement.clientWidth - 48 && (n = "W"),
                t.left)
            , r = t.top;
        "N" == n && (e = (t.left + t.right) / 2),
            "S" == n && (e = (t.left + t.right) / 2,
                r = t.bottom),
            "E" == n && (e = t.right,
                r = (t.top + t.bottom) / 2),
            "W" == n && (r = (t.top + t.bottom) / 2),
            a || (e += h.scrollX,
                r += h.scrollY),
            l.classList.add(n),
            l.style.left = e + "px",
            l.style.top = r + "px",
            u.body.appendChild(l)
    }
    function We() {
        l && (l.remove(),
            l = void 0)
    }
    const Pe = [{
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
    var Ye = u.querySelector("#select-mobile-keyboard-enabled")
        , ze = u.querySelector("#select-mobile-keyboard-layout")
        , He = {
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
            getKeyLowercase: function (e) {
                return e.toLocaleLowerCase(this.lang)
            },
            getKeyUppercase: function (e) {
                return e.toLocaleUpperCase(this.lang)
            },
            init: function (e) {
                this.lang = e.code,
                    this.caps = !1,
                    this.columns = 0,
                    this.elements.keys = [],
                    A(this.elements.rows);
                var t = e.layout
                    , i = this;
                function n(e, t, n) {
                    var a, o = ce("button", "key"), r = "PointerEvent" in h ? "pointerdown" : "click";
                    return Ue.has(t) ? (a = Ue.get(t),
                        o.classList.add(a.class),
                        o.appendChild(ce("span", "material-icons", a.icon)),
                        D(o, r, function (e) {
                            a.callback(i)
                        })) : (o.textContent = i.getKeyLowercase(t),
                            D(o, r, function (e) {
                                i.inputAdd(t)
                            }),
                            i.elements.keys.push(o)),
                        n ? e.insertBefore(o, e.firstChild) : e.appendChild(o),
                        o
                }
                for (var a = 0, o = 0; o < t.length; o++)
                    for (var a = i.addRow(), r = 0; r < t[o].length; r++)
                        n(a, t[o][r]);
                this.elements.caps = n(a, "caps", !0),
                    n(a, "backspace"),
                    a = i.addRow();
                for (var l = ["-", "space", ".", "enter"], r = 0; r < l.length; r++)
                    n(a, l[r])
            },
            addRow: function () {
                var e = $("row");
                return this.elements.rows.appendChild(e),
                    this.rows.push(e),
                    e
            },
            inputChanged: function () {
                He.elements.input.querySelector("span").textContent = He.input
            },
            inputAdd: function (e) {
                this.input += this.caps ? this.getKeyUppercase(e) : this.getKeyLowercase(e),
                    this.inputChanged(),
                    this.caps && this.toggleCaps()
            },
            enter: function () {
                0 < this.input.length && (so(this.input),
                    this.input = "",
                    this.inputChanged())
            },
            toggleCaps: function () {
                this.caps = !this.caps;
                for (var e = 0; e < this.elements.keys.length; e++) {
                    var t = this.elements.keys[e];
                    t.textContent = this.caps ? this.getKeyUppercase(t.textContent) : this.getKeyLowercase(t.textContent)
                }
                this.elements.caps.classList.toggle("enabled", this.caps)
            }
        };
    const Ue = new Map;
    function Fe() {
        1 == Ye.value ? u.documentElement.dataset.mobileKeyboard = "" : delete u.documentElement.dataset.mobileKeyboard
    }
    Ue.set("backspace", {
        class: "wide",
        icon: "backspace",
        callback: function (e) {
            0 < e.input.length && (e.input = e.input.slice(0, -1),
                e.inputChanged())
        }
    }),
        Ue.set("caps", {
            class: "wide",
            icon: "keyboard_capslock",
            callback: function (e) {
                e.toggleCaps()
            }
        }),
        Ue.set("enter", {
            class: "wide",
            icon: "keyboard_return",
            callback: function (e) {
                e.enter()
            }
        }),
        Ue.set("space", {
            class: "extra-wide",
            icon: "space_bar",
            callback: function (e) {
                e.input += " ",
                    e.inputChanged()
            }
        });
    for (var e = 0; e < Pe.length; e++) {
        var Ke = ce("option");
        Ke.textContent = Pe[e].name,
            Ke.value = Pe[e].code,
            ze.appendChild(Ke)
    }
    D(ze, "change", function (e) {
        for (var t = void 0, n = 0; n < Pe.length; n++)
            Pe[n].code == this.value && (t = Pe[n]);
        null != t && He.init(t)
    }),
        D([Ye, ze], "change", function (e) {
            a(),
                Fe()
        }),
        D(He.elements.input, "click", function () {
            He.isOpen || (u.documentElement.dataset.mobileKeyboardOpen = "",
                za(),
                Ne(),
                He.isOpen = !0)
        }),
        He.init(Pe[0]);
    var Be = {}
        , Ge = [];
    function _e(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }
    function R(e, t) {
        var n = _e(Be[p.displayLang], e)
            , a = ""
            , o = 0;
        Array.isArray(t) || (t = [t]);
        for (var r = 0; r < n.length; r++) {
            var i = n.charAt(r);
            "$" == i ? (a += t[o],
                o++) : a += i
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
                0 < (o = "placeholder" == t ? e.placeholder : o).length ? Ge.push({
                    key: o,
                    element: e,
                    type: t
                }) : (console.log("Empty key passed to translate with!"),
                    console.log(e))
        }
    }
    Be.en = {},
        Be.de = {
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
    var nt = [4, 10, 20, 32, 40]
        , at = u.querySelector("#game-toolbar")
        , ot = at.querySelector(".toolbar-group-tools")
        , rt = at.querySelector(".toolbar-group-actions")
        , it = u.querySelector("#game-toolbar .sizes .size-preview")
        , lt = u.querySelector("#game-toolbar .sizes .container")
        , st = u.querySelector("#game-toolbar .colors");
    function ct(e, t) {
        var n, a, o, r = $("tool clickable"), i = (r.appendChild($("icon")),
            r.appendChild($("key")),
            t), l = (i.id = e,
                (i.element = r).toolIndex = e,
                r.querySelector(".icon").style.backgroundImage = "url(/img/" + t.graphic + ")",
                n = r,
                o = t.name,
                a = "S",
                n.dataset.tooltip = o,
                n.dataset.tooltipdir = a,
                D(n, "pointerenter", function (e) {
                    Oe(e.target)
                }),
                D(n, "pointerleave", function (e) {
                    We()
                }),
                o = t.isAction ? (r.addEventListener("click", function (e) {
                    Ot(this.toolIndex)
                }),
                    rt.appendChild(r),
                    ut[e] = i,
                    le(t.name, t.keydef, "", function () {
                        Ot(e)
                    }, function (e) {
                        l.textContent = e.key
                    })) : (r.addEventListener("click", function (e) {
                        Wt(this.toolIndex)
                    }),
                        ot.appendChild(r),
                        dt[e] = i,
                        le(t.name, t.keydef, "", function () {
                            Wt(i.id)
                        }, function (e) {
                            l.textContent = e.key
                        })),
                r.querySelector(".key"));
        l.textContent = o.key,
            t.hide && (r.style.display = "none")
    }
    var dt = []
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
            action: function () {
                {
                    var e;
                    M == C && 0 < ft.length && (ft.pop(),
                        0 < ft.length ? (Bt(e = ft[ft.length - 1]),
                            s && s.emit("data", {
                                id: $a,
                                data: e
                            })) : Zt())
                }
            }
        }),
            ct(1, {
                isAction: !0,
                name: "Clear",
                keydef: "C",
                graphic: "clear.gif",
                action: Zt
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
                graphic: "", keydef: 'L',
                action: () => { document.dispatchEvent(new Event("openBrushLab")); }
            }) /*TYPOEND*/,
            u.querySelector("#game-canvas canvas"))
        , ht = q.getContext("2d", {
            willReadFrequently: !0
        })
        , S = []
        , pt = 0
        , mt = 0
        , gt = []
        , r = [0, 9999, 9999, 0, 0]
        , ft = []
        , k = [0, 0]
        , yt = [0, 0]
        , vt = 0
        , bt = u.createElement("canvas")
        , o = (bt.width = tt + 2,
            bt.height = tt + 2,
            bt.getContext("2d"));
    function St() {
        var e = dt[wt].cursor;
        if (L.id == Z && M == C) {
            if (wt == je) {
                var t = bt.width
                    , n = Mt;
                if (n <= 0)
                    return;
                o.clearRect(0, 0, t, t);
                // TYPOMOD
                // desc: cursor with custom color
                var a = Ct < 10000 ? xt[Ct] : typo.hexToRgb((Ct - 10000).toString(16).padStart(6, "0"));
                // TYPOEND 
                a = [(a = 1 == p.dark ? [Math.floor(.75 * a[0]), Math.floor(.75 * a[1]), Math.floor(.75 * a[2])] : a)[0], a[1], a[2], .8];
                o.fillStyle = "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ")",
                    o.beginPath(),
                    o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI),
                    o.fill(),
                    o.strokeStyle = "#FFF",
                    o.beginPath(),
                    o.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI),
                    o.stroke(),
                    o.strokeStyle = "#000",
                    o.beginPath(),
                    o.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI),
                    o.stroke();
                a = t / 2,
                    e = "url(" + bt.toDataURL() + ")" + a + " " + a + ", default"
            }
        } else
            e = "default";
        q.style.cursor = e
    }
    var kt = 0
        , wt = 0
        , Ct = 0
        , qt = 0
        , xt = [[255, 255, 255], [0, 0, 0], [193, 193, 193], [80, 80, 80], [239, 19, 11], [116, 11, 7], [255, 113, 0], [194, 56, 0], [255, 228, 0], [232, 162, 0], [0, 204, 0], [0, 70, 25], [0, 255, 145], [0, 120, 93], [0, 178, 255], [0, 86, 158], [35, 31, 211], [14, 8, 101], [163, 0, 186], [85, 0, 105], [223, 105, 167], [135, 53, 84], [255, 172, 142], [204, 119, 77], [160, 82, 45], [99, 48, 13]]
        , Mt = 0
        , Lt = -1
        , Et = [];
    function Dt(e) {
        return 20 + (e - et) / (tt - et) * 80
    }
    for (e = 0; e < nt.length; e++) {
        var $t = $("size clickable")
            , At = $("icon")
            , Rt = (At.style.backgroundSize = Dt(nt[e]) + "%",
            {
                id: e,
                size: nt[e],
                element: $t,
                elementIcon: At
            });
        $t.appendChild(At),
            lt.appendChild($t),
            $t.size = Rt,
            Et.push(Rt)
    }
    for (var It = [$("top"), $("bottom")], e = 0; e < xt.length / 2; e++)
        It[0].appendChild(Ut(2 * e)),
            It[1].appendChild(Ut(2 * e + 1)),
            u.querySelector("#game-toolbar .colors-mobile .top").appendChild(Ut(2 * e)),
            u.querySelector("#game-toolbar .colors-mobile .bottom").appendChild(Ut(2 * e + 1));
    for (e = 0; e < It.length; e++)
        st.appendChild(It[e]);
    function Tt(e) {
        Mt = x(e, et, tt);
        for (var t = Et[Et.length - 1], n = t.size, a = 0; a < Et.length; a++) {
            var o = Et[a]
                , r = Math.abs(Mt - o.size);
            r <= n && (n = r,
                t = o,
                0),
                o.element.classList.remove("selected")
        }
        t.element.classList.add("selected"),
            at.querySelector(".size-preview .icon").style.backgroundSize = Dt(Mt) + "%",
            St()
    }
    function Nt(e) {
        e.classList.remove("clicked"),
            e.offsetWidth,
            e.classList.add("clicked")
    }
    function Ot(e) {
        Nt(ut[e].element),
            ut[e].action()
    }
    function Wt(e, t) {
        Nt(dt[e].element),
            e == wt && !t || (dt[kt = wt].element.classList.remove("selected"),
                dt[e].element.classList.add("selected"),
                wt = e,
                St())
    }
    function Pt(e) {
        var t =
            e > 10000 ? Ft(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ft(xt[e]);
        Ct = e,
            u.querySelector("#color-preview-primary").style.fill = t,
            u.querySelector("#game-toolbar .color-picker-mobile .preview").style.backgroundColor = t,
            St()
    }
    function Yt(e) {
        var t =
            e > 10000 ? Ft(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) : Ft(xt[e]);
        qt = e,
            u.querySelector("#color-preview-secondary").style.fill = t,
            St()
    }
    function zt() {
        var e = Ct;
        Pt(qt),
            Yt(e)
    }
    function Ht() {
        lt.classList.remove("open")
    }
    function Ut(e) {
        var t = $("color");
        return t.style.backgroundColor = Ft(xt[e]),
            t.colorIndex = e,
            t
    }
    function Ft(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }
    function Kt(e) {
/*TYPOMOD   
desc: if color code > 1000 -> customcolor*/if (e < 1000)
            e = x(e, 0, xt.length),
                e = xt[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));/* TYPOEND */
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }
    function Bt(e) {
        if (S = S.slice(0, e),
            !(C != M && mt < e)) {
/* TYPOMOD
        desc: replace draw commands because of redo*/        const keepCommands = S;
            /* TYPOEND*/
            r = _t();
            e = Math.floor(S.length / Gt);
            gt = gt.slice(0, e),
                tn();
            for (var t = 0; t < gt.length; t++) {
                var n = gt[t];
                ht.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = gt.length * Gt; t < S.length; t++)
                Vt(Jt(S[t]), S[t]);
            pt = Math.min(S.length, pt),
                mt = Math.min(S.length, mt)

            /* TYPOMOD 
                     log kept commands*/
            document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
            /* TYPOEND*/
}
    }
    const Gt = 50;
    function _t() {
        return [0, 9999, 9999, 0, 0]
    }
    function Vt(e) {
        var t, n, a, o;
        r[0] += 1,
            r[1] = Math.min(r[1], e[0]),
            r[2] = Math.min(r[2], e[1]),
            r[3] = Math.max(r[3], e[2]),
            r[4] = Math.max(r[4], e[3]),
            r[0] >= Gt && (t = r[1],
                n = r[2],
                a = r[3],
                o = r[4],
                (a - t <= 0 || o - n <= 0) && (t = e[0],
                    n = e[1],
                    a = e[2],
                    o = e[3]),
                e = ht.getImageData(t, n, a - t, o - n),
                gt.push({
                    data: e,
                    bounds: r
                }),
                r = _t())
    }
    function Xt(e) {
        return (e || 0 < S.length || 0 < ft.length || 0 < pt || 0 < mt) && (S = [],
            ft = [],
            pt = mt = 0,
            r = _t(),
            gt = [],
            tn(),
            1)
    }
    function Zt() {
        M == C && Xt() && s && s.emit("data", {
            id: Da
        })
    }
    function jt(e) {
        !function (e) {
            if (e[0] != Xe)
                return e[0] == Ze && (0 <= e[2] && e[2] < q.width && 0 <= e[3] && e[3] < q.height);
            var t = e[3]
                , n = e[4]
                , a = e[5]
                , o = e[6]
                , e = Math.ceil(e[2] / 2)
                , r = (t + a) / 2
                , n = (n + o) / 2
                , a = Math.abs(a - t) / 2
                , t = Math.abs(o - o) / 2
                , o = -(e + a)
                , i = -(e + a)
                , a = q.width + e + a
                , e = q.height + e + t;
            return o < r && r < a && i < n && n < e
        }(e) ? console.log("IGNORED COMMAND OUT OF CANVAS BOUNDS") :
            /* TYPOMOD 
                     log draw commands */
            document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e })) &
        /* TYPOEND */ (S.push(e),
                C == M && Vt(Jt(e)))
    }
    function Jt(e) {
        var t = [0, 0, q.width, q.height];
        switch (e[0]) {
            case Xe:
                var n = x(Math.floor(e[2]), et, tt)
                    , a = Math.ceil(n / 2)
                    , o = x(Math.floor(e[3]), -a, q.width + a)
                    , r = x(Math.floor(e[4]), -a, q.height + a)
                    , i = x(Math.floor(e[5]), -a, q.width + a)
                    , l = x(Math.floor(e[6]), -a, q.height + a)
                    , s = Kt(e[1]);
                t[0] = x(o - a, 0, q.width),
                    t[1] = x(r - a, 0, q.height),
                    t[2] = x(i + a, 0, q.width),
                    t[3] = x(l + a, 0, q.height),
                    en(o, r, i, l, n, s.r, s.g, s.b);
                break;
            case Ze:
                var s = Kt(e[1])
                    , a = x(Math.floor(e[2]), 0, q.width)
                    , o = x(Math.floor(e[3]), 0, q.height)
                    , r = a
                    , i = o
                    , c = s.r
                    , d = s.g
                    , u = s.b
                    , h = ht.getImageData(0, 0, q.width, q.height)
                    , p = [[r, i]]
                    , m = function (e, t, n) {
                        n = 4 * (n * e.width + t);
                        return 0 <= n && n < e.data.length ? [e.data[n], e.data[1 + n], e.data[2 + n]] : [0, 0, 0]
                    }(h, r, i);
                if (c != m[0] || d != m[1] || u != m[2]) {
                    function g(e) {
                        var t = h.data[e]
                            , n = h.data[e + 1]
                            , e = h.data[e + 2];
                        if (t == c && n == d && e == u)
                            return !1;
                        t = Math.abs(t - m[0]),
                            n = Math.abs(n - m[1]),
                            e = Math.abs(e - m[2]);
                        return t < 3 && n < 3 && e < 3
                    }
                    for (var f, y, v, b, S, k, w = h.height, C = h.width; p.length;) {
                        for (f = p.pop(),
                            y = f[0],
                            v = f[1],
                            b = 4 * (v * C + y); 0 <= v-- && g(b);)
                            b -= 4 * C;
                        for (b += 4 * C,
                            ++v,
                            k = S = !1; v++ < w - 1 && g(b);)
                            Qt(h, b, c, d, u),
                                0 < y && (g(b - 4) ? S || (p.push([y - 1, v]),
                                    S = !0) : S = S && !1),
                                y < C - 1 && (g(b + 4) ? k || (p.push([y + 1, v]),
                                    k = !0) : k = k && !1),
                                b += 4 * C
                    }
                    ht.putImageData(h, 0, 0)
                }
        }
        return t
    }
    function x(e, t, n) {
        return e < t ? t : n < e ? n : e
    }
    function Qt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n,
            e.data[t + 1] = a,
            e.data[t + 2] = o,
            e.data[t + 3] = 255)
    }
    function en(e, t, n, a, o, r, i, l) {
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
            var g = Math.abs(n - e)
                , f = Math.abs(a - t)
                , y = e < n ? 1 : -1
                , v = t < a ? 1 : -1
                , b = g - f;
            for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a;) {
                var S = b << 1;
                -f < S && (b -= f,
                    e += y),
                    S < g && (b += g,
                        t += v),
                    s(e, t)
            }
        }
        ht.putImageData(m, o, u)
    }
    function tn() {
        /* TYPOMOD
                 desc: store data before clear */
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        /* TYPOEND */
        ht.fillStyle = "#FFF",
            ht.fillRect(0, 0, q.width, q.height)
            /* TYPOMOD
                     desc: dispatch clear event */
            ; document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        /* TYPOEND */
    }
    function nn(e, t, n) {
        ((t = n ? !t : t) ? Pt : Yt)(e)
    }
    D(at, "contextmenu", function (e) {
        return e.preventDefault(),
            !1
    }),
        D("#game-toolbar .sizes .size", "click", function (e) {
            var t;
            t = this.size.id,
                Nt((t = Et[t]).element),
                Tt(t.size),
                Ht()
        }),
        D([q], "DOMMouseScroll wheel", function (e) {
            e.preventDefault();
            e = -e.deltaY || e.wheelDeltaY,
                e = Math.sign(e);
            Tt(Mt + 2 * e)
        }),
        le("Swap", "S", "Swap the primary and secondary color.", zt),
        D(at.querySelector(".color-picker .preview"), "click", function (e) {
            zt()
        }),
        D(at.querySelector(".color-picker-mobile .preview"), "click", function (e) {
            at.querySelector(".colors-mobile").classList.toggle("open")
        }),
        D(it, "click", function (e) {
            lt.classList.toggle("open")
        }),
        D(u, "keydown", function (e) {
            if ("Enter" == e.code)
                return xe.focus(),
                    0;
            if ("input" == u.activeElement.tagName.toLowerCase() || "textarea" == u.activeElement.tagName.toLowerCase() || -1 != Lt)
                return 0;
            for (var t = e.key.toLowerCase().replace("key", ""), n = 0; n < d.length; n++)
                if (d[n].key.toLowerCase() == t) {
                    for (var a = 0; a < d[n].cb.length; a++)
                        d[n].cb[a](d[n]);
                    return void e.preventDefault()
                }
        }),
        D(q, "contextmenu", function (e) {
            return e.preventDefault(),
                !1
        });
    var an = null;
    function on(e, t, n, a) {
        var o = q.getBoundingClientRect()
            , e = Math.floor((e - o.left) / o.width * q.width)
            , t = Math.floor((t - o.top) / o.height * q.height);
        a ? (vt = n,
            yt[0] = k[0] = e,
            yt[1] = k[1] = t) : (yt[0] = k[0],
                yt[1] = k[1],
                vt = n,
                k[0] = e,
                k[1] = t)
    }
    "PointerEvent" in h ? (D("#game-toolbar .colors * .color", "pointerdown", function (e) {
        nn(this.colorIndex, 0 == e.button, e.altKey)
    }),
        D("#game-toolbar .colors-mobile * .color", "pointerdown", function (e) {
            nn(this.colorIndex, 0 == e.button, e.altKey),
                at.querySelector(".colors-mobile").classList.remove("open")
        }),
        D(q, "pointerdown", function (e) {
            if ((0 == e.button || 2 == e.button || 5 == e.button) && -1 == Lt)
                switch (e.pointerType) {
                    case "mouse":
                        sn(e.button, e.clientX, e.clientY, !0, -1);
                        break;
                    case "pen":
                        sn(e.button, e.clientX, e.clientY, !0, e.pressure);
                        break;
                    case "touch":
                        null == an && (an = e.pointerId,
                            sn(e.button, e.clientX, e.clientY, !0, -1))
                }
        }),
        D(u, "pointermove", function (e) {
            switch (e.pointerType) {
                case "mouse":
                    ln(e.clientX, e.clientY, !1, -1);
                    break;
                case "pen":
                    ln(e.clientX, e.clientY, !1, e.pressure);
                    break;
                case "touch":
                    an == e.pointerId && ln(e.clientX, e.clientY, !1, -1)
            }
        }),
        D(u, "pointerup", function (e) {
            "touch" == e.pointerType ? an == e.pointerId && (an = null,
                cn(e.button)) : cn(e.button)
        })) : (D("#game-toolbar .colors * .color", "click", function (e) {
            nn(this.colorIndex, 0 == e.button, e.altKey)
        }),
            D("#game-toolbar .colors-mobile * .color", "click", function (e) {
                nn(this.colorIndex, 0 == e.button, e.altKey),
                    at.querySelector(".colors-mobile").classList.remove("open")
            }),
            D(q, "mousedown", function (e) {
                e.preventDefault(),
                    0 != e.button && 2 != e.button || -1 != Lt || sn(e.button, e.clientX, e.clientY, !0, -1)
            }),
            D(u, "mouseup", function (e) {
                e.preventDefault(),
                    cn(e.button)
            }),
            D(u, "mousemove", function (e) {
                ln(e.clientX, e.clientY, !1, -1)
            }),
            D(q, "touchstart", function (e) {
                e.preventDefault();
                e = e.changedTouches;
                0 < e.length && null == an && (an = e[0].identitfier,
                    sn(0, e[0].clientX, e[0].clientY, !0, e[0].force))
            }),
            D(q, "touchend touchcancel", function (e) {
                e.preventDefault();
                for (var t = e.changedTouches, n = 0; n < t.length; n++)
                    if (t[n].identitfier == an) {
                        cn(Lt);
                        break
                    }
            }),
            D(q, "touchmove", function (e) {
                e.preventDefault();
                for (var t = e.changedTouches, n = 0; n < t.length; n++)
                    if (t[n].identitfier == an) {
                        ln(t[n].clientX, t[n].clientY, !1, t[n].force);
                        break
                    }
            }));
    var rn = 0;
    function ln(e, t, n, a) {
        on(e, t, a = p.pressureSensitivity ? a : -1, n),
            dn(!1)
    }
    function sn(e, t, n, a, o) {
        p.pressureSensitivity || (o = -1),
            S.length,
            Lt = e,
            on(t, n, o, a),
            dn(!0)
    }
    function cn(e) {
        -1 == e || 0 != e && 2 != e && 5 != e || Lt != e || (rn != S.length && (rn = S.length,
            ft.push(rn)),
            an = null,
            Lt = -1)
    }
    function dn(e) {
        if (L.id == Z && M == C && -1 != Lt) {
            var t = 0 == Lt ? Ct : qt
                , n = null;
            if (e) {
                var e = function (e, t) {
                    for (var n = (e = ht.getImageData(e, t, 1, 1)).data[0], a = e.data[1], o = e.data[2], r = 0; r < xt.length; r++) {
                        var i = xt[r]
                            , l = i[0] - n
                            , s = i[1] - a
                            , i = i[2] - o;
                        if (0 == l && 0 == s && 0 == i)
                            return r
                    }
                    /* TYPOMOD
                                         desc: if color is not in array, convert to custom color */
                    return r = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
                    /* TYPOEND */
                    return r
                }(k[0], k[1]);
                if (wt == Qe) {
                    if (e == t)
                        return;
                    l = t,
                        s = k[0],
                        c = k[1],
                        n = [Ze, l, s, c]
                }
                if (wt == Je)
                    return (0 == Lt ? Pt : Yt)(e),
                        void Wt(kt)
            }
            wt == je && (l = Mt,
                0 <= vt && (l = (l - et) * x(vt, 0, 1) + et),

                /* TYPOMOD use typo pressure */
                (() => {
                    if (0 <= vt && localStorage.typoink == 'true') { const calcSkribblSize = (val) => Number(val) * 36 + 4; const calcLevelledSize = (val, level) => Math.pow(Number(val), Math.pow(1.5, (Number(level) - 50) / 10)); const sensitivity = 100 - Number(localStorage.sens); let levelled = calcLevelledSize(vt, sensitivity); l = Math.round(calcSkribblSize(levelled)); }
                })(), s = Math.ceil(.5 * l),
                c = x(Math.floor(yt[0]), -s, q.width + s),
                e = x(Math.floor(yt[1]), -s, q.height + s),
                r = x(Math.floor(k[0]), -s, q.width + s),
                i = x(Math.floor(k[1]), -s, q.height + s),
                t = t,
                a = l,
                o = c,
                e = e,
                r = r,
                i = i,
                n = [Xe, t, a, o, e, r, i]),
                null != n && jt(n)
        }
        var a, o, r, i, l, s, c
    }
    setInterval(function () {
        var e, t;
        s && L.id == Z && M == C && 0 < S.length - pt && (e = pt + 8,
            t = S.slice(pt, e),
            s.emit("data", {
                id: Ea,
                data: t
            }),
            pt = Math.min(e, S.length))
    }, 50),
        setInterval(function () {
            s && L.id == Z && M != C && mt < S.length && (Vt(Jt(S[mt]), S[mt]),
                mt++)
        }, 3);
    var un = u.querySelector("#game-canvas .overlay")
        , hn = u.querySelector("#game-canvas .overlay-content")
        , I = u.querySelector("#game-canvas .overlay-content .text")
        , pn = u.querySelector("#game-canvas .overlay-content .words")
        , mn = u.querySelector("#game-canvas .overlay-content .reveal")
        , T = u.querySelector("#game-canvas .overlay-content .result")
        , gn = u.querySelector("#game-canvas .overlay-content .room")
        , fn = -100
        , yn = 0
        , vn = void 0;
    function bn(e, a, o) {
        var r, i, l = fn, s = yn, c = e.top - l, d = e.opacity - s;
        Math.abs(c) < .001 && Math.abs(d) < .001 ? o && o() : (r = void 0,
            i = 0,
            vn = h.requestAnimationFrame(function e(t) {
                var n = t - (r = null == r ? t : r)
                    , t = (r = t,
                        (i = Math.min(i + n, a)) / a)
                    , n = (n = t) < .5 ? .5 * function (e, t) {
                        return e * e * ((t + 1) * e - t)
                    }(2 * n, 1.2 * 1.5) : .5 * (function (e, t) {
                        return e * e * ((t + 1) * e + t)
                    }(2 * n - 2, 1.2 * 1.5) + 2);
                fn = l + c * n,
                    yn = s + t * t * (3 - 2 * t) * d,
                    hn.style.top = fn + "%",
                    un.style.opacity = yn,
                    i == a ? o && o() : vn = h.requestAnimationFrame(e)
            }))
    }
    function Sn(e) {
        e.classList.add("show")
    }
    /* TYPOMOD 
         desc: add event handlers for typo features */
    D(".avatar-customizer .container", "pointerdown", () => {
        ta(typo.createFakeLobbyData());
    });
    /* TYPOEND */
    function kn(e) {
        for (var t = 0; t < hn.children.length; t++)
            hn.children[t].classList.remove("show");
        switch (e.id) {
            case Q:
                Sn(gn);
                break;
            case V:
                Sn(I),
                    I.textContent = R("Round $", e.data + 1);
                break;
            case G:
                Sn(I),
                    I.textContent = R("Waiting for players...");
                break;
            case _:
                Sn(I),
                    I.textContent = R("Game starting in a few seconds...");
                break;
            case j:
                Sn(mn),
                    mn.querySelector("p span.word").textContent = e.data.word,
                    mn.querySelector(".reason").textContent = function (e) {
                        switch (e) {
                            case F:
                                return R("Everyone guessed the word!");
                            case B:
                                return R("The drawer left the game!");
                            case K:
                                return R("Time is up!");
                            default:
                                return "Error!"
                        }
                    }(e.data.reason);
                for (var n = mn.querySelector(".player-container"), a = (A(n),
                    []), o = 0; o < e.data.scores.length; o += 3) {
                    var r = e.data.scores[o + 0]
                        , i = (e.data.scores[o + 1],
                            e.data.scores[o + 2]);
                    (s = W(r)) && a.push({
                        name: s.name,
                        score: i
                    })
                }
                a.sort(function (e, t) {
                    return t.score - e.score
                });
                for (o = 0; o < Math.min(a.length, 12); o++) {
                    var l = $("player")
                        , s = a[o]
                        , c = (l.appendChild($("name", s.name)),
                            $("score", (0 < s.score ? "+" : "") + s.score));
                    s.score <= 0 && c.classList.add("zero"),
                        l.appendChild(c),
                        n.appendChild(l)
                }
                break;
            case J:
                Sn(T);
                for (var d = [T.querySelector(".podest-1"), T.querySelector(".podest-2"), T.querySelector(".podest-3"), T.querySelector(".ranks")], o = 0; o < 4; o++)
                    A(d[o]);
                if (0 < e.data.length) {
                    for (var u = [[], [], [], []], o = 0; o < e.data.length; o++)
                        (s = {
                            player: W(r = e.data[o][0]),
                            rank: e.data[o][1],
                            title: e.data[o][2]
                        }).player && u[Math.min(s.rank, 3)].push(s);
                    for (var h = 0; h < 3; h++) {
                        var p = u[h];
                        if (0 < p.length) {
                            var m = p.map(function (e) {
                                return e.player.name
                            }).join(", ")
                                , g = p[0].player.score
                                , f = 96
                                , y = d[h]
                                , l = $("avatar-container")
                                , v = (y.appendChild(l),
                                    $("border"));
                            v.appendChild($("rank-place", "#" + (h + 1))),
                                v.appendChild($("rank-name", m)),
                                v.appendChild($("rank-score", R("$ points", g))),
                                y.appendChild(v),
                                0 == h && l.appendChild($("trophy"));
                            for (o = 0; o < p.length; o++)
                                (S = de((s = p[o]).player.avatar, 0, 0 == h)).style.left = 15 * -(p.length - 1) + 30 * o + "%",
                                    0 == h && (S.classList.add("winner"),
                                        S.style.animationDelay = -2.35 * o + "s"),
                                    l.appendChild(S)
                        }
                    }
                    for (var b = Math.min(5, u[3].length), o = 0; o < b; o++) {
                        var s = u[3][o]
                            , f = 48
                            , y = $("rank")
                            , S = de(s.player.avatar, 0, !1);
                        y.appendChild(S),
                            y.appendChild($("rank-place", "#" + (s.rank + 1))),
                            y.appendChild($("rank-name", s.player.name)),
                            y.appendChild($("rank-score", R("$ points", s.player.score))),
                            d[3].appendChild(y)
                    }
                    0 < u[0].length ? (E = u[0].map(function (e) {
                        return e.player.name
                    }).join(", "),
                        T.querySelector(".winner-name").textContent = (0 < u[0].length ? E : "<user left>") + " ",
                        T.querySelector(".winner-text").textContent = 1 == u[0].length ? R("is the winner!") : R("are the winners!")) : (T.querySelector(".winner-name").textContent = "",
                            T.querySelector(".winner-text").textContent = R("Nobody won!"))
                } else
                    T.querySelector(".winner-name").textContent = "",
                        T.querySelector(".winner-text").textContent = R("Nobody won!");
                break;
            case X:
                if (e.data.words)
                    if (Sn(I),
                        Sn(pn),
                        A(pn),
                        In[ne.WORDMODE] == ae.COMBINATION) {
                        I.textContent = R("Choose the first word");
                        for (var k = e.data.words.length / 2, w = [], C = [], q = 0, o = 0; o < k; o++) {
                            var x = $("word", e.data.words[o])
                                , M = (x.index = o,
                                    $("word", e.data.words[o + k]));
                            M.index = o,
                                M.style.display = "none",
                                M.style.animationDelay = .03 * o + "s",
                                w.push(x),
                                C.push(M),
                                D(x, "click", function () {
                                    q = this.index;
                                    for (var e = 0; e < k; e++)
                                        w[e].style.display = "none",
                                            C[e].style.display = "";
                                    I.textContent = R("Choose the second word")
                                }),
                                D(M, "click", function () {
                                    da([q, this.index])
                                }),
                                pn.appendChild(x),
                                pn.appendChild(M)
                        }
                    } else {
                        I.textContent = R("Choose a word");
                        for (o = 0; o < e.data.words.length; o++) {
                            var L = $("word", e.data.words[o]);
                            L.index = o,
                                D(L, "click", function () {
                                    da(this.index)
                                }),
                                pn.appendChild(L)
                        }
                    }
                else {
                    Sn(I);
                    var E = (s = W(e.data.id)) ? s.name : R("User")
                        , E = (I.textContent = "",
                            I.appendChild(ce("span", void 0, R("$ is choosing a word!", E))),
                            de(s ? s.avatar : [0, 0, 0, 0], 0, !1));
                    E.style.width = "2em",
                        E.style.height = "2em",
                        I.appendChild(E)
                }
        }
    }
    const wn = 0
        , Cn = 1
        , qn = 2
        , xn = 3
        , Mn = 4
        , Ln = 5
        , En = 6;
    function Dn(e, t) {
        this.url = t,
            this.buffer = null,
            this.loaded = !1;
        var n = this
            , a = new XMLHttpRequest;
        a.open("GET", t, !0),
            a.responseType = "arraybuffer",
            a.onload = function () {
                e.context.decodeAudioData(a.response, function (e) {
                    n.buffer = e,
                        n.loaded = !0
                }, function (e) {
                    console.log("Failed loading audio from url '" + t + "'")
                })
            }
            ,
            a.send()
    }
    function $n() {
        this.context = null,
            this.gain = null,
            this.sounds = new Map,
            h.addEventListener("load", this.load.bind(this), !1)
    }
    $n.prototype.addSound = function (e, t) {
        this.sounds.set(e, new Dn(this, t))
    }
        ,
        $n.prototype.loadSounds = function () {
            this.addSound(wn, "/audio/roundStart.ogg"),
                this.addSound(Cn, "/audio/roundEndSuccess.ogg"),
                this.addSound(qn, "/audio/roundEndFailure.ogg"),
                this.addSound(xn, "/audio/join.ogg"),
                this.addSound(Mn, "/audio/leave.ogg"),
                this.addSound(Ln, "/audio/playerGuessed.ogg"),
                this.addSound(En, "/audio/tick.ogg")
        }
        ,
        $n.prototype.playSound = function (e) {
            var t, n;
            null == this.context ? this.load() : "running" != this.context.state ? this.context.resume().then(function () {
                this.playSound(e)
            }) : null != this.context && 0 < p.volume && this.sounds.has(e) && ((t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer,
                n.connect(this.gain),
                n.start(0)))
        }
        ,
        $n.prototype.setVolume = function (e) {
            y[g].querySelector("#volume .title .icon").classList.toggle("muted", e <= 0),
                y[g].querySelector("#volume .volume-value").textContent = e <= 0 ? "Muted" : e + "%",
                this.gain && (this.gain.gain.value = e / 100)
        }
        ,
        $n.prototype.load = function () {
            if (null == this.context)
                try {
                    h.AudioContext = h.AudioContext || h.webkitAudioContext,
                        this.context = new AudioContext,
                        this.gain = this.context.createGain(),
                        this.gain.connect(this.context.destination),
                        this.setVolume(p.volume),
                        console.log("AudioContext created."),
                        this.loadSounds()
                } catch (e) {
                    console.log("Error creating AudioContext.", e),
                        this.context = null
                }
        }
        ;
    const An = 4;
    G;
    var s, w = [], C = 0, Rn = -1, M = -1, In = [], L = {
        id: -1,
        time: 0,
        data: 0
    }, Tn = -1, Nn = 0, On = void 0, E = new $n, N = void 0, Wn = !1, Pn = !1, Yn = u.querySelector("#game-wrapper"), it = u.querySelector("#game-canvas .room"), zn = u.querySelector("#game-players"), Hn = (u.querySelector("#game-chat"),
        u.querySelector("#game-board"),
        u.querySelector("#game-bar")), Un = zn.querySelector(".players-list"), Fn = zn.querySelector(".players-footer"), Kn = u.querySelector("#game-round"), O = [u.querySelector("#game-word .description"), u.querySelector("#game-word .word"), u.querySelector("#game-word .hints .container")], Bn = u.querySelector("#home .container-name-lang input"), Gn = u.querySelector("#home .container-name-lang select"), _n = u.querySelector("#home .panel .button-play"), Vn = u.querySelector("#home .panel .button-create");
    const Xn = 11 == (t = new Date).getMonth() && (19 <= (t = t.getDate()) && t <= 26);
    function Zn(e) {
        Wn = e,
            u.querySelector("#load").style.display = e ? "block" : "none"
    }
    function jn(e, t, n, a) {
        var o, r;
        e = e,
            t = t,
            o = function (e, t) {
                switch (e) {
                    case 200:
                        return void n({
                            success: !0,
                            data: t
                        });
                    case 503:
                    case 0:
                        a && i(fe, R("Servers are currently undergoing maintenance!") + "\n\rStatus: " + e + "\n\rPlease try again later!");
                        break;
                    default:
                        a && i(fe, R("An unknown error occurred ('$')", e) + "\n\r" + R("Please try again later!"))
                }
                n({
                    success: !1,
                    error: e
                })
            }
            ,
            (r = new XMLHttpRequest).onreadystatechange = function () {
                4 == this.readyState && o(this.status, this.response)
            }
            ,
            r.open("POST", e, !0),
            r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            r.send(t)
    }
    Xn;
    var Jn = null;
    adplayer = null;
    try {
        aiptag.cmd.player.push(function () {
            console.log("ad player loaded"),
                adplayer = new aipPlayer({
                    AD_WIDTH: 960,
                    AD_HEIGHT: 540,
                    AD_FULLSCREEN: !1,
                    AD_CENTERPLAYER: !0,
                    LOADING_TEXT: "loading advertisement",
                    PREROLL_ELEM: function () {
                        return u.getElementById("preroll")
                    },
                    AIP_COMPLETE: function (e) {
                        Jn()
                    },
                    AIP_REMOVE: function () { }
                })
        })
    } catch (e) {
        console.log("ad push failed: "),
            console.log(e)
    }
    function Qn(t) {
        var e, n, a = !1;
        if (h.localStorageAvailable && (n = c.getItem("lastAd"),
            e = new Date,
            c.setItem("lastAd", e.toString()),
            null == n ? n = e : (n = new Date(Date.parse(n)),
                a = 1 <= Math.abs(n - e) / 1e3 / 60)),
            a)
            try {
                aiptag && adplayer && void 0 !== adplayer && null !== adplayer && "undefined" !== adplayer ? (Jn = t,
                    aiptag.cmd.player.push(function () {
                        adplayer.startPreRoll()
                    })) : t()
            } catch (e) {
                console.log(e),
                    t()
            }
        else
            t()
    }
    function ea(e, t, n) {
        E.context && E.context.resume && E.context.resume(),
            s && ca();
        var a = 0;
        (s = P(e, {
            closeOnBeforeunload: !1
        })).on("connect", function () {
            /* TYPOMOD
                         desc: disconnect socket & leave lobby */
            document.addEventListener('socketEmit', event => s.emit('data', { id: event.detail.id, data: event.detail.data }));
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
            Zn(!1),
                s.on("joinerr", function (e) {
                    ca(),
                        i(fe, function (e) {
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
                        }(e))
                }),
                s.on("data", Ta);
            var e = Bn.value.split("#")
                , e = {
                    join: t,
                    create: n ? 1 : 0,
                    name: e[0],
                    lang: Gn.value,
                    code: e[1],
                    avatar: p.avatar
                };
            s.emit("login", e)
        }),
            s.on("reason", function (e) {
                a = e
            }),
            s.on("disconnect", function () {
                /* TYPOMOD
                                 DESC: no msg if disconnect intentionally */
                if (!s.typoDisconnect)
                    /*TYPOEND*/
                    switch (a) {
                        case ee:
                            i(ye, R("You have been kicked!"));
                            break;
                        case te:
                            i(ye, R("You have been banned!"));
                            break;
                        default:
                            i(ye, R("Connection lost!"))
                    }
                ca()
            }),
            s.on("connect_error", function (e) {
                ca(),
                    Zn(!1),
                    i(fe, e.message)
            })
    }
    function ta(e) {
        var t;
        E.playSound(xn),
            Wt(je, !0),
            Tt(12),
            Pt(1),
            Yt(0),
            Xt(!0),
            A(Me),
            u.querySelector("#home").style.display = "none",
            u.querySelector("#game").style.display = "flex",
            C = e.me,
            Tn = e.type,
            On = e.id,
            u.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id,
            t = e.settings,
            In = t,
            na(),
            A(Un),
            w = [];
        for (var n = 0; n < e.users.length; n++)
            Na(e.users[n], !1);
        if (za(),
            Ha(),
            oa(e.round),
            ma(e.owner),
            ia(e.state, !0),
            !Pn) {
            try {
                (adsbygoogle = h.adsbygoogle || []).push({}),
                    (adsbygoogle = h.adsbygoogle || []).push({})
            } catch (e) {
                console.log("google ad request failed"),
                    console.log(e)
            }
            Pn = !0
        }
    }
    function na() {
        oa(Nn);
        for (var e, t = 0; t < Ka.length; t++) {
            var n = Ka[t];
            n.index && (e = In[(n = n).index],
                "checkbox" == n.element.type ? n.element.checked = !!e : n.element.value = e)
        }
    }
    function aa(e, t, n) {
        In[e] = t,
            n && s && s.emit("data", {
                id: ka,
                data: {
                    id: e,
                    val: t
                }
            }),
            na()
    }
    function oa(e) {
        var e = (Nn = e) + 1
            , t = In[ne.ROUNDS];
        Kn.textContent = R("Round $ of $", [e, t]),
            Hn.querySelector(".mobile .round span").textContent = e + "/" + t
    }
    function ra() {
        for (var e = 0; e < w.length; e++)
            w[e].score = 0;
        for (e = 0; e < w.length; e++)
            Ua(w[e], !1),
                Fa(w[e], !1);
        Ha()
    }
    function ia(e, t) {
        var n, a;
        if (n = L = e,
            null != vn && (h.cancelAnimationFrame(vn),
                vn = void 0),
            n.id == Z ? bn({
                top: -100,
                opacity: 0
            }, 600, function () {
                un.classList.remove("show")
            }) : un.classList.contains("show") ? bn({
                top: -100,
                opacity: 1
            }, 600, function () {
                kn(n),
                    bn({
                        top: 0,
                        opacity: 1
                    }, 600)
            }) : (un.classList.add("show"),
                kn(n),
                bn({
                    top: 0,
                    opacity: 1
                }, 600)),
            a = e.time,
            Qa(),
            eo(a),
            ja = setInterval(function () {
                eo(Math.max(0, Ja - 1));
                var e = -1;
                L.id == Z && (e = Va),
                    L.id == X && (e = Xa),
                    Za.style.animationName = Ja < e ? Ja % 2 == 0 ? "rot_left" : "rot_right" : "none",
                    Ja < e && E.playSound(En),
                    Ja <= 0 && Qa()
            }, 1e3),
            Yn.classList.add("toolbar-hidden"),
            St(),
            sa(!1),
            e.id == Q ? (ra(),
                Yn.classList.add("room")) : Yn.classList.remove("room"),
            e.id == V && (oa(e.data),
                0 == e.data && ra()),
            e.id == j) {
            C != M && pa(e.data.word);
            for (var o = 0; o < e.data.scores.length; o += 3) {
                var r = e.data.scores[o + 0]
                    , i = e.data.scores[o + 1];
                e.data.scores[o + 2];
                (c = W(r)) && (c.score = i)
            }
            Ha();
            for (var l = !0, o = 0; o < w.length; o++)
                if (w[o].guessed) {
                    l = !1;
                    break
                }
            l ? E.playSound(qn) : E.playSound(Cn),
                b(R("The word was '$'", e.data.word), "", v($e), !0)
                /* TYPOMOD
                             desc: log finished drawing */
                ; document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
            /* TYPOEND */
        } else
            e.id != Z && (O[0].textContent = R("WAITING"),
                O[0].classList.add("waiting"),
                O[1].style.display = "none",
                O[2].style.display = "none");
        if (e.id == Z) {
            if (M = e.data.id,
                E.playSound(wn),
                Xt(!0),
                e.data.drawCommands && (S = e.data.drawCommands),
                b(R("$ is drawing now!", W(M).name), "", v(De), !0),
                !t)
                for (o = 0; o < w.length; o++)
                    Ua(w[o], !1);
            O[0].classList.remove("waiting"),
                M == C ? (a = e.data.word,
                    O[0].textContent = R("DRAW THIS"),
                    O[1].style.display = "",
                    O[2].style.display = "none",
                    O[1].textContent = a,
                    Yn.classList.remove("toolbar-hidden"),
                    St()) : (sa(!0),
                        ua(e.data.word, !1),
                        ha(e.data.hints))
        } else {
            M = -1;
            for (o = 0; o < w.length; o++)
                Ua(w[o], !1)
        }
        if (e.id == J && 0 < e.data.length) {
            for (var s = [], i = 0, o = 0; o < e.data.length; o++) {
                var c, d = e.data[o][0], u = e.data[o][1];
                (c = W(d)) && 0 == u && (i = c.score,
                    s.push(c.name))
            }
            1 == s.length ? b(R("$ won with a score of $!", [s[0], i]), "", v(Re), !0) : 1 < s.length && b(R("$ and $ won with a score of $!", [s.slice(0, -1).join(", "), s[s.length - 1], i]), "", v(Re), !0)
        }
        for (o = 0; o < w.length; o++)
            Fa(w[o], w[o].id == M);
        za()
    }
    function la(e) {
        s && s.connected && L.id == Z && (s.emit("data", {
            id: va,
            data: e
        }),
            sa(!1))
    }
    function sa(e) {
        u.querySelector("#game-rate").style.display = e ? "" : "none"
    }
    function ca() {
        s && s.close(),
            Xt(!(s = void 0)),
            Qa(),
            w = [],
            In = [],
            L = {
                id: M = Rn = -1,
                time: C = 0,
                data: 0
            },
            u.querySelector("#home").style.display = "",
            u.querySelector("#game").style.display = "none"
    }
    function da(e) {
        s && s.connected && L.id == X && s.emit("data", {
            id: La,
            data: e
        })
    }
    function ua(e, t) {
        for (var n = e.length - 1, a = 0; a < e.length; a++)
            n += e[a];
        var o = !t && 1 == In[ne.WORDMODE];
        o && (n = 3),
            O[0].textContent = R(o ? "WORD HIDDEN" : "GUESS THIS"),
            O[1].style.display = "none",
            O[2].style.display = "",
            A(O[2]),
            O[2].hints = [];
        for (a = 0; a < n; a++)
            O[2].hints[a] = $("hint", o ? "?" : "_"),
                O[2].appendChild(O[2].hints[a]);
        o || O[2].appendChild($("word-length", e.join(" ")))
    }
    function ha(e) {
        for (var t = O[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0]
                , o = e[n][1];
            t[a].textContent = o,
                t[a].classList.add("uncover")
        }
    }
    function pa(e) {
        (!O[2].hints || O[2].hints.length < e.length) && ua([e.length], !0);
        for (var t = [], n = 0; n < e.length; n++)
            t.push([n, e.charAt(n)]);
        ha(t)
    }
    function ma(e) {
        Rn = e;
        for (var t = 0; t < w.length; t++)
            he(w[t].element, w[t].id == Rn),
                Pa(w[t], 0, w[t].id == Rn);
        var n = C != Rn;
        u.querySelector("#start-game").disabled = n;
        for (var a = 0; a < Ka.length; a++)
            Ka[a].element.disabled = n;
        e = W(Rn);
        e && b(R("$ is now the room owner!", e.name), "", v(Re), !0)
    }
    const ga = 1
        , fa = 2
        , ya = 5
        , va = 8
        , ba = 10
        , Sa = 11
        , ka = 12
        , wa = 13
        , Ca = 14
        , qa = 15
        , xa = 16
        , Ma = 17
        , La = 18
        , Ea = 19
        , Da = 20
        , $a = 21;
    const Aa = 30
        , Ra = 31
        , Ia = 32;
    function Ta(e) {
        var t, n = e.id, a = e.data;
        switch (n) {
            case ba:
                /* TYPOMOD
                                 desc: send lobbydata*/
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: a }));
                /* TYPOEND*/
                ta(a);
                break;
            case Sa:
                ia(a);
                break;
            case ka:
                aa(a.id, a.val, !1);
                break;
            case wa:
                ha(a);
                break;
            case Ca:
                eo(a);
                break;
            case ga:
                b(R("$ joined the room!", (t = Na(a, !0)).name), "", v($e), !0),
                    E.playSound(xn),
                    Ha();
                break;
            case fa:
                (t = function (e) {
                    for (var t = 0; t < w.length; t++) {
                        var n = w[t];
                        if (n.id == e)
                            return w.splice(t, 1),
                                n.element.remove(),
                                Ha(),
                                za(),
                                n
                    }
                    return
                }(a.id)) && (b(function (e, t) {
                    switch (e) {
                        default:
                            return R("$ left the room!", t);
                        case ee:
                            return R("$ has been kicked!", t);
                        case te:
                            return R("$ has been banned!", t)
                    }
                }(a.reason, t.name), "", v(Ae), !0),
                    E.playSound(Mn),
                    a.id != M || a.reason != ee && a.reason != te || Xt(!0));
                break;
            case ya:
                var o = W(a[0])
                    , r = W(a[1])
                    , i = a[2]
                    , l = a[3];
                o && r && b(R("$ is voting to kick $ ($/$)", [o.name, r.name, i, l]), "", v(Ee), !0);
                break;
            case qa:
                (t = W(a.id)) && (b(R("$ guessed the word!", t.name), "", v($e), !0).classList.add("guessed"),
                    Ua(t, !0),
                    E.playSound(Ln),
                    a.id == C && pa(a.word));
                break;
            case va:
                (t = W(a.id)) && (o = t,
                    r = 0 == a.vote ? "thumbsdown.gif" : "thumbsup.gif",
                    (i = $("icon")).style.backgroundImage = "url(/img/" + r + ")",
                    r = Wa(o, i).getBoundingClientRect(),
                    o = .9 * (r.bottom - r.top),
                    i.style.width = o + "px",
                    i.style.height = o + "px",
                    a.vote ? b(R("$ liked the drawing!", t.name), "", v($e), !0) : b(R("$ disliked the drawing!", t.name), "", v(Ae), !0));
                break;
            case Ma:
                ma(a);
                break;
            case xa:
                b(R("$ is close!", a), "", v(Ee), !0);
                break;
            case Aa:
                Oa(W(a.id), a.msg);
                break;
            case Ia:
                b(R("Spam detected! You're sending messages too quickly."), "", v(Ae), !0);
                break;
            case Ra:
                switch (a.id) {
                    case 0:
                        b(R("You need at least 2 players to start the game!"), "", v(Ae), !0);
                        break;
                    case 100:
                        b(R("Server restarting in about $ seconds!", a.data), "", v(Ae), !0)
                }
                break;
            case Ea:
                for (var s = 0; s < a.length; s++)
                    jt(a[s]);
                break;
            case Da:
                Xt(!0);
                break;
            case $a:
                Bt(a);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + n)
        }
    }
    function W(e) {
        for (var t = 0; t < w.length; t++) {
            var n = w[t];
            if (n.id == e)
                return n
        }
    }
    function Na(e, t) {
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
        }
            , e = (w.push(n),
                (n.flags & An) == An)
            , a = (e && (n.element.classList.add("admin"),
                n.interval = setInterval(function () {
                    n.avatar[0] = (n.avatar[0] + 1) % U[0],
                        ue(r, n.avatar)
                }, 250)),
                n.id == C ? R("$ (You)", n.name) : n.name)
            , o = $("player-avatar-container")
            , r = de(n.avatar)
            , o = (n.element.drawing = $("drawing"),
                r.appendChild(n.element.drawing),
                o.appendChild(r),
                n.element.appendChild(o),
                Un.appendChild(n.element),
                $("player-info"))
            , a = $("player-name", a)
            , a = (n.id == C && a.classList.add("me"),
                o.appendChild(a),
                o.appendChild($("player-rank", "#" + n.rank)),
                o.appendChild($("player-score", R("$ points", n.score))),
                e && o.appendChild($("player-tag", "THE CREATOR")),
                n.element.appendChild(o),
                D(n.element, "click", function () {
                    N = n,
                        i(m, n)
                }),
                $("player-icons"))
            , e = $("icon owner")
            , o = $("icon muted");
        /* TYPOMOD
                 desc: set ID to player to identify */
        n.element.setAttribute("playerid", n.id);
        /* TYPOEND */
        return a.appendChild(e),
            a.appendChild(o),
            n.element.appendChild(a),
            n.element.icons = [e, o],
            Ua(n, n.guessed),
            t && za(),
            n
    }
    function Oa(e, t) {
        var n, a, o;
        e.muted || (o = ((a = W(C)).flags & An) == An,
            n = e.id == M || e.guessed,
            C != M && !a.guessed && n && !o || (a = (e.flags & An) == An,
                o = Le,
                n && (o = Ie),
                a && (o = Ae),
                Wa(e, $("text", t)),
                b(e.name, t, v(o))))
    }
    function Wa(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout),
            e.bubble.remove(),
            e.bubble = void 0);
        var n = $("player-bubble")
            , a = $("content");
        return a.appendChild(t),
            n.appendChild($("arrow")),
            n.appendChild(a),
            e.element.appendChild(n),
            e.bubble = n,
            e.bubble.timeout = setTimeout(function () {
                e.bubble.remove(),
                    e.bubble = void 0
            }, 1500),
            n
    }
    function Pa(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ya = void 0;
    function za() {
        L.id,
            Q;
        for (var e = getComputedStyle(u.documentElement).getPropertyValue("--PLAYERS_PER_PAGE"), t = (e <= 0 && (t = Math.max(48, Un.clientHeight),
            e = Math.floor(t / 48)),
            Math.ceil(w.length / e)), n = 0; n < w.length; n++)
            w[n].page = Math.floor(n / e);
        null == Ya ? Ya = pe(Fn, t, [zn], function (e, t, n) {
            for (var a = [], o = 0; o < w.length; o++) {
                var r = (i = w[o]).page == t;
                i.element.style.display = r ? "" : "none",
                    r && a.push(i.element)
            }
            if (0 < a.length) {
                for (var i, o = 0; o < a.length; o++)
                    (i = a[o]).classList.remove("first"),
                        i.classList.remove("last"),
                        o % 2 == 0 ? i.classList.remove("odd") : i.classList.add("odd");
                a[0].classList.add("first"),
                    a[a.length - 1].classList.add("last")
            }
        }) : me(Ya, t),
            Ya.element.style.display = 1 < t ? "" : "none"
    }
    function Ha() {
        for (var e = [], t = 0; t < w.length; t++)
            e.push(w[t]);
        e.sort(function (e, t) {
            return t.score - e.score
        });
        for (var n, a, o = 1, t = 0; t < e.length; t++) {
            var r = e[t];
            a = o,
                (n = r).rank = a,
                n.element.querySelector(".player-score").textContent = R("$ points", n.score),
                (n = n.element.querySelector(".player-rank")).textContent = "#" + a,
                n.classList.remove("first"),
                n.classList.remove("second"),
                n.classList.remove("third"),
                1 == a && n.classList.add("first"),
                2 == a && n.classList.add("second"),
                3 == a && n.classList.add("third"),
                t < e.length - 1 && r.score > e[t + 1].score && o++
        }
    }
    function Ua(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }
    function Fa(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ka = [];
    for (var Ba = it.querySelectorAll('*[id^="item-"]'), Ga = 0; Ga < Ba.length; Ga++) {
        var _a = {
            id: Ba[Ga].id.replace("item-settings-", ""),
            element: Ba[Ga],
            index: Ba[Ga].dataset.setting
        };
        Ba[Ga].item = _a,
            Ka.push(_a),
            D(Ba[Ga].item.element, "change", function () {
                var e = this.value;
                "checkbox" == this.type && (e = this.checked ? 1 : 0),
                    null != this.item.index && aa(this.item.index, e, !0)
            })
    }
    const Va = 10
        , Xa = 4;
    var Za = u.querySelector("#game-clock")
        , ja = null
        , Ja = 0;
    function Qa() {
        ja && (clearInterval(ja),
            ja = null)
    }
    function eo(e) {
        Ja = e,
            Za.textContent = Ja,
            Hn.querySelector(".mobile .drawtime span").textContent = Ja + "s"
    }
    var to, t = u.querySelector("#tutorial"), no = t.querySelectorAll(".page"), ao = pe(t.querySelector(".navigation"), no.length, [t.querySelector(".pages")], function (e, t, n) {
        n && clearInterval(oo);
        for (var a = 0; a < no.length; a++)
            no[a].classList.remove("active");
        no[t].classList.add("active")
    }), oo = setInterval(function () {
        ao.selected < 4 ? ge(ao, ao.selected + 1, !1) : ge(ao, 0, !1)
    }, 3500), it = u.querySelector("#game-settings");
    u.querySelector("#audio"),
        u.querySelector("#lightbulb");
    function ro() {
        var e = .01 * h.innerHeight;
        u.documentElement.style.setProperty("--vh", e + "px")
    }
    function io() {
        b(R("Copied room link to clipboard!"), "", v(Ee), !0);
        var e = "https://skribbl.io/?" + On;
        if (navigator.clipboard)
            navigator.clipboard.writeText(e).then(function () {
                console.log("Async: Copying to clipboard was successful!")
            }, function (e) {
                console.error("Async: Could not copy text: ", e)
            });
        else {
            var t = u.createElement("textarea");
            t.value = e,
                t.style.top = "0",
                t.style.left = "0",
                t.style.position = "fixed",
                u.body.appendChild(t),
                t.select(),
                t.focus();
            try {
                var n = u.execCommand("copy");
                console.log("Copying link was " + (n ? "successful" : "unsuccessful"))
            } catch (e) {
                console.log("Unable to copy link " + e)
            }
            u.body.removeChild(t)
        }
    }
    function lo(e) {
        var t = qe.querySelector(".characters");
        0 == (t.textContent = e) ? t.classList.remove("visible") : t.classList.add("visible")
    }
    function so(e) {
        s && s.connected ? s.emit("data", {
            id: Aa,
            data: e
        }) : Oa(W(C), e)
    }
    D(it, "click", function () {
        i(g)
    }),
        D(h, "resize", function () {
            ro(),
                za()
        }),
        h.onunload = function () {
            s && ca()
        }
        ,
        D(u, "PointerEvent" in h ? "pointerdown" : "click", function (e) {
            He.elements.main.contains(e.target) || He.isOpen && (delete u.documentElement.dataset.mobileKeyboardOpen,
                za(),
                He.isOpen = !1),
                u.querySelector("#game-toolbar .sizes").contains(e.target) || Ht()
        }),
        D([Bn, Gn], "change", a),
        D(_n, "click",
            typo.joinLobby = function () {
                var t, e, n, a, o;
                n = h.location.href,
                    o = "",
                    n = n.split("?"),
                    t = o = 1 < n.length ? (o = "" + n[1]).substring(0, a) : o,
                    Wn || (e = "" != t ? "id=" + t : "lang=" + Gn.value,
                        Ce(),
                        Zn(!0),
                        Qn(function () {
                            jn(location.origin + ":3000/play", e, function (e) {
                                Zn(!1),
                                    e.success && ea(e.data, t)
                            }, !0)
                        }))
            }),
        D(Vn, "click", function () {
            Wn || (Ce(),
                Zn(!0),
                Qn(function () {
                    jn(location.origin + ":3000/play", "lang=" + Gn.value, function (e) {
                        e.success ? ea(e.data, 0, 1) : Zn(!1)
                    }, !0)
                }))
        }),
        D(u.querySelector("#game-rate .like"), "click", function () {
            la(1)
        }),
        D(u.querySelector("#game-rate .dislike"), "click", function () {
            la(0)
        }),
        D(u.querySelector("#start-game"), "click", function () {
            if (s) {
                var e = u.querySelector("#item-settings-customwords").value.split(",")
                    , t = "";
                if (5 <= e.length) {
                    for (var n = 0; n < e.length; n++)
                        e[n] = e[n].trim();
                    t = e.join(",")
                }
                s.emit("data", {
                    id: 22,
                    data: t
                })
            }
        }),
        D([u.querySelector("#copy-invite"), u.querySelector("#modal-player-button-invite")], "click", io),
        D(y[m].querySelector("button.kick"), "click", function () {
            Ce(),
                null != N && N.id != C && s && s.emit("data", {
                    id: 3,
                    data: N.id
                })
        }),
        D(y[m].querySelector("button.ban"), "click", function () {
            Ce(),
                null != N && N.id != C && s && s.emit("data", {
                    id: 4,
                    data: N.id
                })
        }),
        D(y[m].querySelector("button.votekick"), "click", function () {
            Ce(),
                null != N && N.id != C && s && (N.id == Rn ? b(R("You can not votekick the lobby owner!"), "", v(Ae), !0) : s.emit("data", {
                    id: ya,
                    data: N.id
                }))
        }),
        D(y[m].querySelector("button.mute"), "click", function () {
            null != N && N.id != C && (N.muted = !N.muted,
                Pa(N, 1, N.muted),
                N.muted ? b(R("You muted '$'!", N.name), "", v(Ae), !0) : b(R("You unmuted '$'!", N.name), "", v(Ae), !0),
                s && s.emit("data", {
                    id: 7,
                    data: N.id
                }),
                we(N.muted))
        }),
        D(y[m].querySelector("button.report"), "click", function () {
            y[m].querySelector(".buttons").style.display = "none",
                y[m].querySelector(".player").style.display = "none",
                y[m].querySelector(".report-menu").style.display = "";
            for (var e = y[m].querySelectorAll(".report-menu input"), t = 0; t < e.length; t++)
                e[t].checked = !1
        }),
        D(y[m].querySelector("button#report-send"), "click", function () {
            var e = 0;
            y[m].querySelector("#report-reason-toxic").checked && (e |= 1),
                y[m].querySelector("#report-reason-spam").checked && (e |= 2),
                y[m].querySelector("#report-reason-bot").checked && (e |= 4),
                0 < e && (null != N && N.id != C && (N.reported = !0,
                    s && s.emit("data", {
                        id: 6,
                        data: {
                            id: N.id,
                            reasons: e
                        }
                    }),
                    b(R("Your report for '$' has been sent!", N.name), "", v(Ee), !0)),
                    Ce())
        }),
        D(y[g].querySelector("#volume input"), "change", function (e) {
            p.volume = e.target.value,
                E.setVolume(p.volume),
                E.playSound(Ln),
                a()
        }),
        D(y[g].querySelector("#select-pressure-sensitivity"), "change", function (e) {
            p.pressureSensitivity = e.target.value,
                a()
        }),
        D(y[g].querySelector("button.reset"), "click", function () {
            for (var e = 0; e < d.length; e++) {
                var t = d[e];
                t.key = t.def,
                    t.listing.querySelector("input").value = t.key;
                for (var n = 0; n < t.changed.length; n++)
                    t.changed[n](t)
            }
            se()
        }),
        D(u.querySelector("#game-keyboard button.settings"), "click", function (e) {
            i(g)
        }),
        D(xe, "focusin focus", function (e) {
            e.preventDefault()
        }),
        D(xe, "input", function (e) {
            lo(xe.value.length)
        }),
        D(qe, "submit", function (e) {
            const input = xe; let rest = input.value.substring(100);
            input.value = input.value.substring(0, 100);
            if (rest.length > 0) setTimeout(() => { input.value = rest; e.target.dispatchEvent(new Event("submit")); }, 180);
            return e.preventDefault(),
                xe.value && so(xe.value),
                qe.reset(),
                lo(0),
                !1
        }),
        ro(),
        h.localStorageAvailable ? (Bn.value = n("name", ""),
            Gn.value = function (e) {
                for (var t = u.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                    if (t[n].value == e)
                        return t[n].value;
                return 0
            }(n("lang", 0)),
            p.displayLang = n("displaylang", "en"),
            p.volume = parseInt(n("volume", 100)),
            p.filterChat = 1 == parseInt(n("filter", 1)) ? 1 : 0,
            p.pressureSensitivity = 1 == parseInt(n("pressure", 1)) ? 1 : 0,
            p.avatar = (t = "ava",
                it = p.avatar,
                null == (t = c.getItem(t)) ? it : JSON.parse(t)),
            Ye.value = n("keyboard", 1),
            ze.value = n("keyboardlayout", "en"),
            Fe(),
            y[g].querySelector("#volume input").value = p.volume,
            E.setVolume(p.volume),
            console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.");
    for (var co = u.querySelectorAll("[data-translate]"), uo = 0; uo < co.length; uo++) {
        var ho = co[uo];
        Ve(ho, ho.dataset.translate)
    }
    for (var po = Be[p.displayLang], mo = 0; mo < Ge.length; mo++) {
        var go = Ge[mo]
            , fo = _e(po, go.key);
        "text" == go.type && (go.element.textContent = fo),
            "placeholder" == go.type && (go.element.placeholder = fo)
    }
    function yo(e) {
        to.parts[e].classList.remove("bounce"),
            to.parts[e].offsetWidth,
            to.parts[e].classList.add("bounce")
    }
    D(_n = u.querySelectorAll("[data-tooltip]"), "pointerenter", function (e) {
        Oe(e.target)
    }),
        D(_n, "pointerleave", function (e) {
            We()
        }),
        it = (Vn = u.querySelector("#home .avatar-customizer")).querySelector(".container"),
        t = Vn.querySelectorAll(".arrows.left .arrow"),
        _n = Vn.querySelectorAll(".arrows.right .arrow"),
        Vn = Vn.querySelectorAll(".randomize"),
        (to = de(p.avatar)).classList.add("fit"),
        it.appendChild(to),
        D(t, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --p.avatar[e],
                p.avatar[e] < 0 && (p.avatar[e] = U[e] - 1),
                yo(e),
                ue(to, p.avatar),
                a()
        }),
        D(_n, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            p.avatar[e] += 1,
                p.avatar[e] >= U[e] && (p.avatar[e] = 0),
                yo(e),
                ue(to, p.avatar),
                a()
        }),
        D(Vn, "click", function () {
            p.avatar[0] = Math.floor(Math.random() * U[0]),
                p.avatar[1] = Math.floor(Math.random() * U[1]),
                p.avatar[2] = Math.floor(Math.random() * U[2]),
                yo(1),
                yo(2),
                ue(to, p.avatar),
                a()
        });
    for (var vo = Math.round(8 * Math.random()), bo = u.querySelector("#home .logo-big .avatar-container"), So = 0; So < 8; So++) {
        var ko = [0, 0, 0, -1]
            , ko = (ko[0] = So,
                ko[1] = Math.round(100 * Math.random()) % z,
                ko[2] = Math.round(100 * Math.random()) % H,
                100 * Math.random() < 1 && (ko[3] = Math.floor(20 * Math.random())),
                Xn && 100 * Math.random() < 35 && (ko[3] = 96 + Math.floor(4 * Math.random())),
                de(ko, 0, vo == So));
        ko.index = So,
            bo.appendChild(ko),
            D(ko, "click", function () {
                var e = [this.index, 0, 0, -1];
                e[1] = Math.round(100 * Math.random()) % z,
                    e[2] = Math.round(100 * Math.random()) % H,
                    1e3 * Math.random() < 10 && (e[3] = Math.floor(20 * Math.random())),
                    ue(this, e),
                    this.classList.remove("clicked"),
                    this.offsetWidth,
                    this.classList.add("clicked")
            })
    }
}(window, document, localStorage, io);
