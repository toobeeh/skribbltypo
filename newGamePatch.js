! function (u, c, n, a) {
    const s = "#CCCC00",
        d = "#3975CE",
        h = "#56CE27",
        f = "#CE4F0A",
        o = "#ffa844",
        p = d,
        l = 18,
        i = 52,
        g = 49,
        t = [l, i, g];
    const v = ["Everyone guessed the word!", "Time is up!", "The drawer left the game!", "The drawer received too many thumbs down!", "The drawer has been kicked!"],
        y = 0,
        S = 1,
        b = 2,
        k = 3,
        m = 4,
        C = 5,
        w = 6,
        q = 7;
    const r = 1,
        x = 2,
        M = [" left the room!", " has been kicked!", " has been banned!"],
        L = {
            NAME: 0,
            LANG: 1,
            PUBLIC: 2,
            SLOTS: 3,
            DRAWTIME: 4,
            ROUNDS: 5,
            WORDCOUNT: 6,
            HINTCOUNT: 7,
            WORDMODE: 8,
            CUSTOMWORDSONLY: 9
        };
    // TYPOMOD 
    // desc: create re-useable functions
    const typo = {
        createFakeUser: (id = 0, name = "", avatar = [], score = 0, guessed = false) => {
            return { id: id, name: name.length != 0 ? name : (Nn.value.split("#")[0] != "" ? Nn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? I.avatar : avatar, score: score, guessed: guessed };
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
        lastConnect:0,
        initListeners: (() => {
            document.addEventListener("joinLobby", () => {
                let timeoutdiff = Date.now() - typo.lastConnect;
                jn(true);
                setTimeout(() => {
                    typo.lastConnect = Date.now();
                    Fn.dispatchEvent(new Event("click"));
                    jn(false);
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 3000 ? 3000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else $n() | document.dispatchEvent(new Event("leftLobby"));
            });
            document.addEventListener("setColor", (e) => {
                if (e.detail.secondary) kt(e.detail.code);
                else bt(e.detail.code);
            });
            document.addEventListener("performDrawCommand", (e) => {
                We.push(e.detail);
                At(Rt(e.detail));
            });
        })(),
        scaleDataURL:  (url, width, height) => {
            let source = new Image();
            source.src = url;
            let canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(source, 0, 0, width, height);
        },
        hexToRgb: (hex) => {
            let arrBuff = new ArrayBuffer(4);
            let vw = new DataView(arrBuff);
            vw.setUint32(0, parseInt(hex, 16), false);
            let arrByte = new Uint8Array(arrBuff);
            return [ arrByte[1],  arrByte[2], arrByte[3] ];
        },
        rgbToHex: (r, g, b) => {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    }
    // TYPOEND
    var I = {
        avatar: [Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % i, Math.round(100 * Math.random()) % g],
        audio_mute: 0,
        filterChat: !0
    };

    function A(e, t) {
        e = n.getItem(e);
        return null == e ? t : e
    }

    function D() {
        u.localStorageAvailable && (n.setItem("name", Nn.value), n.setItem("lang", Yn.value), n.setItem("audio", I.audio_mute ? 1 : 0), n.setItem("ava", JSON.stringify(I.avatar)), console.log("Settings saved."))
    }

    function E(e, t, n) {
        var a, o = e;
        "string" == typeof e ? o = c.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]);
        for (var r = t.split(" "), l = 0; l < o.length; l++)
            for (var i = 0; i < r.length; i++) o[l].addEventListener(r[i], n)
    }

    function T(e, t) {
        for (var n = c.createElement("div"), a = e.split(" "), o = 0; o < a.length; o++) n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t), n
    }

    function R(e) {
        return parseFloat(getComputedStyle(e, null).width.replace("px", ""))
    }

    function O(e) {
        for (; e.firstChild;) e.removeChild(e.firstChild)
    }

    function N(e, t, n) {
        var a = T("avatar"),
            o = T("color"),
            r = T("eyes"),
            l = T("mouth"),
            i = T("special"),
            c = T("owner");
        return c.style.display = n ? "block" : "none", a.appendChild(o), a.appendChild(r), a.appendChild(l), a.appendChild(i), a.appendChild(c), a.parts = [o, r, l], Y(a, e, t || 48), a
    }

    function Y(e, t, n) {
        function a(e, t, n, a) {
            var o = -t % n * 100,
                n = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + n + "%"
        }
        var o = t[0] % l,
            r = t[1] % i,
            n = t[2] % g,
            t = t[3];
        a(e.querySelector(".color"), o, 10), a(e.querySelector(".eyes"), r, 10), a(e.querySelector(".mouth"), n, 10);
        e = e.querySelector(".special");
        0 <= t ? (e.style.display = "", a(e, t, 10)) : e.style.display = "none"
    }

    function F(e, t) {
        e.querySelector(".owner").style.display = t ? "block" : "none"
    }

    function U(e, t, n, a) {
        let o = {
            element: T("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element), n.push(o.element), E(n, "DOMMouseScroll wheel", function (e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), P(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), j(o, t), o
    }

    function j(n, e) {
        O(n.element), n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = T("dot");
            e.appendChild(T("inner")), E(e, "click", function () {
                P(n, t, !0)
            }), n.element.appendChild(e), n.dots.push(e)
        }
        P(n, n.selected, !1)
    }

    function P(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++) t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"), t.change(t, e, n)
        }
    }
    const _ = 0,
        H = 1,
        W = 2,
        z = 3;
    const X = 5;
    var B = c.querySelector("#modal"),
        G = B.querySelector(".title .text"),
        J = B.querySelector(".content"),
        K = [];

    function V(e) {
        K[_].querySelector(".buttons button.mute").textContent = e ? "Unmute" : "Mute"
    }

    function Z(e, t) {
        B.style.display = "block";
        for (var n = 0; n < K.length; n++) K[n].style.display = "none";
        switch (K[e].style.display = "flex", e) {
            case H:
                G.textContent = "Something went wrong!", K[H].querySelector(".message").textContent = t;
                break;
            case W:
                G.textContent = "Disconnected!", K[W].querySelector(".message").textContent = t;
                break;
            case _:
                G.textContent = "";
                var a = K[_].querySelector(".buttons");
                a.style.display = t.id == kn ? "none" : "flex", a.querySelector(".button-pair").style.display = kn == Cn ? "flex" : "none", V(t.muted);
                var o = J.querySelector(".player");
                O(o);
                a = N(t.avatar, 96);
                F(a, Cn == t.id), a.style.width = "96px", a.style.height = "96px", o.appendChild(a), o.appendChild(T("name", t.id == kn ? t.name + " (You)" : t.name));
                break;
            case z:
                G.textContent = "Rooms", oe(t);
                break;
            case z:
                G.textContent = t.name;
                break;
            case X:
                G.textContent = "Settings"
        }
    }
    K[_] = B.querySelector(".container-player"), K[H] = B.querySelector(".container-info"), K[W] = B.querySelector(".container-info"), K[z] = B.querySelector(".container-rooms"), K[4] = B.querySelector(".container-room"), K[X] = B.querySelector(".container-settings");
    var $ = [],
        Q = [],
        ee = 0,
        te = 0,
        ne = K[z].querySelector(".rooms"),
        e = K[z].querySelector(".footer"),
        ae = K[z].querySelector(".dots");

    function oe(t) {
        $ = [], O(ne), O(ae);
        for (let e = te = ee = 0; e < t.length; e++) ! function (e) {
            console.log(e.settings[L.SLOTS]);
            let t = T("room");
            t.appendChild(T("name", e.settings[L.NAME])), t.appendChild(T("slots", e.users + "/" + e.settings[L.SLOTS])), t.appendChild(T("round", 0 < e.round ? e.round : "Not started")), t.appendChild(T("settings", e.settings[L.DRAWTIME] + "s")), ne.appendChild(t), $.push({
                element: t,
                page: 0,
                data: e
            }), E(t, "click", function () {
                Hn(e.id)
            })
        }(t[e]);
        ! function () {
            K[z].querySelector(".desc");
            if (0 < $.length) {
                let n = 0,
                    a = 0;
                for (let t = 0; t < $.length; t++) {
                    let e = $[t];
                    e.page = a, n++, 10 <= n && (a++, n = 0)
                }
                if (ee = a + Math.ceil(n / 10), Q = [], 1 < ee) {
                    ae.style.display = "", O(ae);
                    for (let e = 0; e < ee; e++) {
                        var t = T("dot");
                        ae.appendChild(t), E(t, "click", function () {
                            re(e)
                        }), Q.push(t)
                    }
                    re(te)
                } else ae.style.display = "none"
            } else ne.textContent = "No rooms found :("
        }()
    }

    function re(e) {
        te = e;
        for (let t = 0; t < $.length; t++) {
            let e = $[t];
            e.element.style.display = e.page == te ? "" : "none"
        }
        for (let e = 0; e < Q.length; e++) Q[e].classList.remove("active");
        Q[e].classList.add("active")
    }

    function le() {
        B.style.display = "none"
    }
    E([ne, e], "DOMMouseScroll wheel", function (e) {
        var t;
        1 < ee && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), re(Math.min(ee - 1, Math.max(0, te - t)))), e.preventDefault()
    }), E(u, "click", function (e) {
        e.target == B && le()
    }), E([B.querySelector(".close"), K[H].querySelector("button.ok")], "click", le);
    var ie = c.querySelector("#game-chat form"),
        ce = c.querySelector("#game-chat form input"),
        se = c.querySelector("#game-chat .content");
    const de = ["neger", "negro", "nigger", "nigga", "cunt", "fuck", "fucker", "fucking", "fucked", "fucktard", "kill", "rape", "cock", "dick", "asshole", "slut", "whore", "semen", "fag", "faggot", "retard", "retarded", "arsch", "arschloch", "hurensohn", "fotze", "muschi", "schlampe", "pisser", "missgeburt", "nutte", "nuttensohn", "hundesohn", "hure", "ficker", "ficken", "fick", "spast", "spasti", "spastiker", "hailhitler", "heilhitler", "sieghail", "siegheil", "nazi"],
        ue = [
            ["i", "î", "1", "!", "|"],
            ["e", "3", "€", "³"],
            ["a", "4", "@"],
            ["o", "ö", "0"],
            ["g", "q"],
            ["s", "$"]
        ];

    function he(e) {
        for (var t, n, a = e.toLocaleLowerCase("en-US"), o = 0; o < ue.length; o++)
            for (var r = ue[o], l = 1; l < r.length; l++) t = r[l], n = r[0], a = a.split(t).join(n);
        for (var a = a.replace(/[^A-Z^a-z0-9^가-힣]/g, "*"), i = "", c = [], o = 0; o < a.length; o++) {
            var s = a.charAt(o);
            "*" != s && (i += s, c.push(o))
        }
        for (o = 0; o < de.length; o++)
            for (var d = de[o], u = -1; - 1 != (u = i.indexOf(d, u + 1));) {
                var h = c[u],
                    f = c[u + d.length - 1],
                    p = d.length,
                    p = "*".repeat(p);
                e = e.slice(0, h) + p + e.slice(f + 1)
            }
        return e
    }

    function fe(e, t, n, a) {
        var o = c.createElement("p"),
            r = c.createElement("b");
        r.textContent = a ? e : e + ": ", r.style.color = n, o.appendChild(r);
        r = c.createElement("span");
        r.textContent = t, r.style.color = n, o.appendChild(r);
        r = se.scrollHeight - se.scrollTop - se.clientHeight <= 20;
        se.appendChild(o), r && (se.scrollTop = se.scrollHeight + 100)
    }

    function pe(e, t) {
        var n = me(n = e[0], r = e[1], o = e[2], a = e[3], t[0], 7, -680876936),
            a = me(a, n, r, o, t[1], 12, -389564586),
            o = me(o, a, n, r, t[2], 17, 606105819),
            r = me(r, o, a, n, t[3], 22, -1044525330);
        n = me(n, r, o, a, t[4], 7, -176418897), a = me(a, n, r, o, t[5], 12, 1200080426), o = me(o, a, n, r, t[6], 17, -1473231341), r = me(r, o, a, n, t[7], 22, -45705983), n = me(n, r, o, a, t[8], 7, 1770035416), a = me(a, n, r, o, t[9], 12, -1958414417), o = me(o, a, n, r, t[10], 17, -42063), r = me(r, o, a, n, t[11], 22, -1990404162), n = me(n, r, o, a, t[12], 7, 1804603682), a = me(a, n, r, o, t[13], 12, -40341101), o = me(o, a, n, r, t[14], 17, -1502002290), n = ve(n, r = me(r, o, a, n, t[15], 22, 1236535329), o, a, t[1], 5, -165796510), a = ve(a, n, r, o, t[6], 9, -1069501632), o = ve(o, a, n, r, t[11], 14, 643717713), r = ve(r, o, a, n, t[0], 20, -373897302), n = ve(n, r, o, a, t[5], 5, -701558691), a = ve(a, n, r, o, t[10], 9, 38016083), o = ve(o, a, n, r, t[15], 14, -660478335), r = ve(r, o, a, n, t[4], 20, -405537848), n = ve(n, r, o, a, t[9], 5, 568446438), a = ve(a, n, r, o, t[14], 9, -1019803690), o = ve(o, a, n, r, t[3], 14, -187363961), r = ve(r, o, a, n, t[8], 20, 1163531501), n = ve(n, r, o, a, t[13], 5, -1444681467), a = ve(a, n, r, o, t[2], 9, -51403784), o = ve(o, a, n, r, t[7], 14, 1735328473), n = ye(n, r = ve(r, o, a, n, t[12], 20, -1926607734), o, a, t[5], 4, -378558), a = ye(a, n, r, o, t[8], 11, -2022574463), o = ye(o, a, n, r, t[11], 16, 1839030562), r = ye(r, o, a, n, t[14], 23, -35309556), n = ye(n, r, o, a, t[1], 4, -1530992060), a = ye(a, n, r, o, t[4], 11, 1272893353), o = ye(o, a, n, r, t[7], 16, -155497632), r = ye(r, o, a, n, t[10], 23, -1094730640), n = ye(n, r, o, a, t[13], 4, 681279174), a = ye(a, n, r, o, t[0], 11, -358537222), o = ye(o, a, n, r, t[3], 16, -722521979), r = ye(r, o, a, n, t[6], 23, 76029189), n = ye(n, r, o, a, t[9], 4, -640364487), a = ye(a, n, r, o, t[12], 11, -421815835), o = ye(o, a, n, r, t[15], 16, 530742520), n = Se(n, r = ye(r, o, a, n, t[2], 23, -995338651), o, a, t[0], 6, -198630844), a = Se(a, n, r, o, t[7], 10, 1126891415), o = Se(o, a, n, r, t[14], 15, -1416354905), r = Se(r, o, a, n, t[5], 21, -57434055), n = Se(n, r, o, a, t[12], 6, 1700485571), a = Se(a, n, r, o, t[3], 10, -1894986606), o = Se(o, a, n, r, t[10], 15, -1051523), r = Se(r, o, a, n, t[1], 21, -2054922799), n = Se(n, r, o, a, t[8], 6, 1873313359), a = Se(a, n, r, o, t[15], 10, -30611744), o = Se(o, a, n, r, t[6], 15, -1560198380), r = Se(r, o, a, n, t[13], 21, 1309151649), n = Se(n, r, o, a, t[4], 6, -145523070), a = Se(a, n, r, o, t[11], 10, -1120210379), o = Se(o, a, n, r, t[2], 15, 718787259), r = Se(r, o, a, n, t[9], 21, -343485551), e[0] = qe(n, e[0]), e[1] = qe(r, e[1]), e[2] = qe(o, e[2]), e[3] = qe(a, e[3])
    }

    function ge(e, t, n, a, o, r) {
        return t = qe(qe(t, e), qe(a, r)), qe(t << o | t >>> 32 - o, n)
    }

    function me(e, t, n, a, o, r, l) {
        return ge(t & n | ~t & a, e, t, o, r, l)
    }

    function ve(e, t, n, a, o, r, l) {
        return ge(t & a | n & ~a, e, t, o, r, l)
    }

    function ye(e, t, n, a, o, r, l) {
        return ge(t ^ n ^ a, e, t, o, r, l)
    }

    function Se(e, t, n, a, o, r, l) {
        return ge(n ^ (t | ~a), e, t, o, r, l)
    }

    function be(e) {
        txt = "";
        for (var t = e.length, n = [1732584193, -271733879, -1732584194, 271733878], a = 64; a <= e.length; a += 64) pe(n, function (e) {
            var t, n = [];
            for (t = 0; t < 64; t += 4) n[t >> 2] = e.charCodeAt(t) + (e.charCodeAt(t + 1) << 8) + (e.charCodeAt(t + 2) << 16) + (e.charCodeAt(t + 3) << 24);
            return n
        }(e.substring(a - 64, a)));
        e = e.substring(a - 64);
        var o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (a = 0; a < e.length; a++) o[a >> 2] |= e.charCodeAt(a) << (a % 4 << 3);
        if (o[a >> 2] |= 128 << (a % 4 << 3), 55 < a)
            for (pe(n, o), a = 0; a < 16; a++) o[a] = 0;
        return o[14] = 8 * t, pe(n, o), n
    }
    var ke = "0123456789abcdef".split("");

    function Ce(e) {
        for (var t = 0; t < e.length; t++) e[t] = function (e) {
            for (var t = "", n = 0; n < 4; n++) t += ke[e >> 8 * n + 4 & 15] + ke[e >> 8 * n & 15];
            return t
        }(e[t]);
        return e.join("")
    }

    function we(e) {
        return Ce(be(e))
    }

    function qe(e, t) {
        return e + t & 4294967295
    } {
        function qe(e, t) {
            var n = (65535 & e) + (65535 & t);
            return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n
        }
        we("hello")
    }

    function xe() {
        return we(function () {
            var e = c.createElement("canvas");
            e.width = 240, e.height = 30;
            var t = e.getContext("2d"),
                n = "hTtps:\\\\SkRiBbl,iO <cAnvas> 6.9 420";
            return t.textBaseline = "top", t.font = "14px 'Arial'", t.textBaseline = "alphabetic", t.fillStyle = "#f60", t.fillRect(125, 1, 62, 20), t.fillStyle = "#069", t.fillText(n, 2, 15), t.fillStyle = "rgba(102, 204, 0, 0.7)", t.fillText(n, 4, 17), e.toDataURL()
        }())
    }
    const Me = 0,
        Le = 1;
    const Ie = 0,
        Ae = 1,
        De = 2;
    const Ee = 4,
        Te = 40;
    var Re, Oe = c.querySelector("#game-toolbar"),
        Ne = Oe.querySelectorAll(".tools-container .tools")[0],
        Ye = Oe.querySelectorAll(".tools-container .tools")[1],
        Fe = (Re = Oe.querySelector(".tool")).parentElement.removeChild(Re);

    function Ue(e, t, n) {
        var a = Fe.cloneNode(!0);
        a.toolIndex = t, a.querySelector(".icon").style.backgroundImage = "url(/img/" + n.graphic + ")", a.querySelector(".key").textContent = n.hotkey;
        n.id = t, n.element = a, e ? (a.addEventListener("click", function (e) {
            yt(this.toolIndex)
        }), Ye.appendChild(a), Pe[t] = n) : (a.addEventListener("click", function (e) {
            St(this.toolIndex)
        }), Ne.appendChild(a), je[t] = n)
    }
    var je = [];
    Ue(!1, Ie, {
        name: "Brush",
        hotkey: "B",
        graphic: "pen.gif",
        cursor: 0
    }), Ue(!1, Ae, {
        name: "Pick",
        hotkey: "V",
        graphic: "pick.gif",
        cursor: "url(/img/pick_cur.png) 7 36, default"
    }), Ue(!1, De, {
        name: "Fill",
        hotkey: "F",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    });
    var Pe = [];
    Ue(!0, 0, {
        name: "Undo",
        hotkey: "U",
        graphic: "undo.gif",
        action: function () {
            ! function () {
                {
                    var e;
                    0 < Je.length && (Je.pop(), 0 < Je.length ? (Mt(e = Je[Je.length - 1]), Sn && Sn.emit("data", {
                        id: ya,
                        data: e
                    })) : Et())
                }
            }()
        }
    }), Ue(!0, 1, {
        name: "Clear",
        hotkey: "C",
        graphic: "clear.gif",
        action: function () {
            Et()
        }
    });
    var _e = c.querySelector("#game-canvas canvas"),
        He = _e.getContext("2d"),
        We = [],
        ze = 0,
        Xe = 0,
        Be = [],
        Ge = [0, 9999, 9999, 0, 0],
        Je = [],
        Ke = [0, 0],
        Ve = [0, 0],
        Ze = 0,
        $e = c.createElement("canvas");
    $e.width = Te + 2, $e.height = Te + 2;
    var Qe = $e.getContext("2d");

    function et() {
        var e = je[nt].cursor;
        if (xn.id == m && wn == kn) {
            if (nt == Ie) {
                var t = $e.width,
                    n = lt;
                if (n <= 0) return;
                // TYPOMOD
                // desc: cursor with custom color
                let rgbArr = at < 10000 ? rt[at] : typo.hexToRgb((at - 10000).toString(16).padStart(6, "0"));
                Qe.clearRect(0, 0, t, t), Qe.fillStyle = qt(rgbArr), Qe.beginPath(), Qe.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), Qe.fill(), Qe.strokeStyle = "#FFF", Qe.beginPath(), Qe.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), Qe.stroke(), Qe.strokeStyle = "#000", Qe.beginPath(), Qe.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), Qe.stroke();
                // TYPOEND
                t = t / 2, e = "url(" + $e.toDataURL() + ")" + t + " " + t + ", default"
            }
        } else e = "default";
        _e.style.cursor = e
    }
    for (var tt = 0, nt = 0, at = 0, ot = 0, rt = [
        [255, 255, 255],
        [80, 80, 80],
        [0, 0, 0],
        [210, 210, 210],
        [168, 168, 168],
        [126, 126, 126],
        [239, 19, 11],
        [183, 6, 0],
        [86, 8, 6],
        [255, 113, 0],
        [206, 67, 12],
        [137, 39, 0],
        [255, 228, 0],
        [232, 162, 0],
        [163, 103, 0],
        [0, 204, 0],
        [0, 114, 21],
        [0, 61, 3],
        [0, 255, 145],
        [0, 158, 114],
        [0, 120, 93],
        [0, 178, 255],
        [0, 86, 158],
        [0, 59, 120],
        [35, 31, 211],
        [18, 11, 145],
        [8, 3, 82],
        [163, 0, 186],
        [108, 0, 135],
        [65, 0, 81],
        [211, 124, 170],
        [167, 85, 116],
        [118, 48, 75],
        [255, 172, 142],
        [226, 139, 93],
        [204, 119, 77],
        [160, 82, 45],
        [99, 48, 13],
        [72, 28, 0]
    ], lt = 0, it = -1, ct = [], st = 6, dt = 0; dt < st; dt++) {
        var ut = dt / (st - 1),
            ht = 11 + 32 * (1 - ut),
            ft = (Ee, Te, Ee, c.createElement("div"));
        ft.classList.add("size");
        ut = c.createElement("div");
        ut.classList.add("icon"), ut.style.borderRadius = "100%", ut.style.left = ht + "%", ut.style.right = ht + "%", ut.style.top = ht + "%", ut.style.bottom = ht + "%", ft.appendChild(ut), c.querySelector("#game-toolbar .color-picker .sizes").appendChild(ft), ct.push([ft, ut])
    }

    function pt(e) {
        for (var t = 0; t < st; t++) ct[t][1].style.backgroundColor = e
    }

    function gt() {
        var e = (lt - Ee) / (Te - Ee),
            t = R(Oe.querySelector(".slider .track")),
            n = R(Oe.querySelector(".slider")),
            n = ((n - t) / 2 + e * t) / n;
        Oe.querySelector(".slider .knob").style.left = 100 * e + "%", Oe.querySelector(".slider .bar-fill").style.width = 100 * n + "%";
        e = Oe.querySelector(".color-picker .preview .graphic .brush"), n = lt + 10;
        e.style.width = n + "px", e.style.height = n + "px", Oe.querySelector(".color-picker .preview .size").textContent = lt + "px"
    }

    function mt(e) {
        lt = Ot(e, Ee, Te), gt(), et()
    }

    function vt(e) {
        e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
    }

    function yt(e) {
        vt(Pe[e].element), Pe[e].action()
    }

    function St(e, t) {
        vt(je[e].element), e == nt && !t || (je[tt = nt].element.classList.remove("selected"), je[e].element.classList.add("selected"), nt = e, et())
    }

    function bt(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            qt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            qt(rt[e]);
        // TYPOEND
        pt(t), at = e, c.querySelector("#color-preview-primary").style.fill = t, et()
    }

    function kt(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            qt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            qt(rt[e]);
        // TYPOEND
        pt(t), ot = e, c.querySelector("#color-preview-secondary").style.fill = t, et()
    }

    function Ct() {
        Oe.querySelector(".color-picker .brushmenu").classList.remove("open"), Oe.querySelector(".color-picker .preview").classList.remove("open")
    }
    for (dt = 0; dt < rt.length / 3; dt++) Oe.querySelector(".top").appendChild(wt(3 * dt)), Oe.querySelector(".mid").appendChild(wt(3 * dt + 1)), Oe.querySelector(".bottom").appendChild(wt(3 * dt + 2));

    function wt(e) {
        var t = T("item"),
            n = T("inner");
        return n.style.backgroundColor = qt(rt[e]), t.appendChild(n), t.colorIndex = e, t
    }

    function qt(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function xt(e) {
        // TYPOMOD
        // desc: if color code > 1000 -> customcolor
        if (e < 10000) e = Ot(e, 0, rt.length), e = rt[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));
        // TYPOEND
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function Mt(e) {
        if (We = We.slice(0, e), !(kn != wn && Xe < e)) {
            // TYPOMOD
            // desc: replace draw commands because of redo
            const keepCommands = We;
            Ge = It();
            e = Math.floor(We.length / Lt);
            console.log("canvas cache is: " + Be.length), console.log("keeping: " + e), Be = Be.slice(0, e), Ft(), console.log("applied " + Be.length + " cached canvas imgs.");
            for (var t = 0; t < Be.length; t++) {
                var n = Be[t];
                He.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            e = Be.length * Lt;
            console.log("redrawn " + (We.length - e) + " drawCommands");
            for (t = e; t < We.length; t++) At(Rt(We[t]));
            ze = Math.min(We.length, ze), Xe = Math.min(We.length, Xe)
            document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
            // TYPOEND
        }
    }
    const Lt = 100;

    function It() {
        return [0, 9999, 9999, 0, 0]
    }

    function At(e) {
        var t, n, a, o;
        Ge[0] += 1, Ge[1] = Math.min(Ge[1], e[0]), Ge[2] = Math.min(Ge[2], e[1]), Ge[3] = Math.max(Ge[3], e[2]), Ge[4] = Math.max(Ge[4], e[3]), Ge[0] >= Lt && (t = Ge[1], n = Ge[2], a = Ge[3], o = Ge[4], e = He.getImageData(t, n, a - t, o - n), Be.push({
            data: e,
            bounds: Ge
        }), Ge = It(), console.log("stashed image data with bounds of " + t + ", " + n + ", " + a + ", " + o + " (" + (a - t) + "x" + (o - n) + "px)"))
    }

    function Dt(e) {
        return (e || 0 < We.length || 0 < Je.length || 0 < ze || 0 < Xe) && (We = [], Je = [], ze = Xe = 0, Ge = It(), Be = [], Ft(), 1)
    }

    function Et() {
        Dt() && Sn && Sn.emit("data", {
            id: va
        })
    }

    function Tt(e) {
        We.push(e), kn == wn && At(Rt(e))
        // TYPOMOD
        // log draw commands
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        // TYPOEND
    }

    function Rt(e) {
        var t = [0, 0, _e.width, _e.height];
        switch (e[0]) {
            case Me:
                var n = Ot(Math.floor(e[2]), Ee, Te),
                    a = Math.floor(Math.ceil(n / 2)),
                    o = Ot(Math.floor(e[3]), -a, _e.width + a),
                    r = Ot(Math.floor(e[4]), -a, _e.height + a),
                    l = Ot(Math.floor(e[5]), -a, _e.width + a),
                    i = Ot(Math.floor(e[6]), -a, _e.height + a),
                    c = xt(e[1]);
                t[0] = Ot(o - a, 0, _e.width), t[1] = Ot(r - a, 0, _e.height), t[2] = Ot(l + a, 0, _e.width), t[3] = Ot(i + a, 0, _e.height), Yt(o, r, l, i, n, c.r, c.g, c.b);
                break;
            case Le:
                c = xt(e[1]);
                ! function (e, t, a, o, r) {
                    var l = He.getImageData(0, 0, _e.width, _e.height),
                        n = [
                            [e, t]
                        ],
                        i = function (e, t, n) {
                            t = 4 * (n * e.width + t);
                            return 0 <= t && t < e.data.length ? [e.data[t], e.data[1 + t], e.data[2 + t]] : [0, 0, 0]
                        }(l, e, t);
                    if (a != i[0] || o != i[1] || r != i[2]) {
                        function c(e) {
                            var t = l.data[e],
                                n = l.data[e + 1],
                                e = l.data[e + 2];
                            if (t == a && n == o && e == r) return !1;
                            t = Math.abs(t - i[0]), n = Math.abs(n - i[1]), e = Math.abs(e - i[2]);
                            return t < 1 && n < 1 && e < 1
                        }
                        for (var s, d, u, h, f, p, g = l.height, m = l.width; n.length;) {
                            for (s = n.pop(), d = s[0], u = s[1], h = 4 * (u * m + d); 0 <= u-- && c(h);) h -= 4 * m;
                            for (h += 4 * m, ++u, p = f = !1; u++ < g - 1 && c(h);) Nt(l, h, a, o, r), 0 < d && (c(h - 4) ? f || (n.push([d - 1, u]), f = !0) : f = f && !1), d < m - 1 && (c(h + 4) ? p || (n.push([d + 1, u]), p = !0) : p = p && !1), h += 4 * m
                        }
                        He.putImageData(l, 0, 0)
                    }
                }(Ot(Math.floor(e[2]), 0, _e.width), Ot(Math.floor(e[3]), 0, _e.height), c.r, c.g, c.b)
        }
        return t
    }

    function Ot(e, t, n) {
        return e < t ? t : n < e ? n : e
    }

    function Nt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
    }

    function Yt(e, t, n, a, o, r, l, i) {
        var c = Math.floor(o / 2),
            s = c * c,
            d = Math.min(e, n) - c,
            u = Math.min(t, a) - c,
            h = Math.max(e, n) + c,
            o = Math.max(t, a) + c;
        e -= d, t -= u, n -= d, a -= u;

        function f(e, t) {
            for (var n = -c; n <= c; n++)
                for (var a, o = -c; o <= c; o++) n * n + o * o < s && (0 <= (a = 4 * ((t + o) * p.width + e + n)) && a < p.data.length && (p.data[a] = r, p.data[1 + a] = l, p.data[2 + a] = i, p.data[3 + a] = 255))
        }
        var p = He.getImageData(d, u, h - d, o - u);
        if (e == n && t == a) f(e, t);
        else {
            f(e, t), f(n, a);
            var g = Math.abs(n - e),
                m = Math.abs(a - t),
                v = e < n ? 1 : -1,
                y = t < a ? 1 : -1,
                S = g - m;
            for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a;) {
                var b = S << 1; - m < b && (S -= m, e += v), b < g && (S += g, t += y), f(e, t)
            }
        }
        He.putImageData(p, d, u)
    }

    function Ft() {
        // TYPOMOD
        // desc: log a canvas clear
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        He.fillStyle = "#FFF", He.fillRect(0, 0, _e.width, _e.height)
        document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        // TYPOEND
    }
    var Ut = !1;

    function jt(e) {
        var t = c.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        mt(Ee + Math.round(Ot((e - t.left) / t.width, 0, 1) * (Te - Ee)))
    }
    E("#game-toolbar .slider", "mousedown", function (e) {
        0 == e.button && (Ut = !0, jt(e.clientX))
    }), E("#game-toolbar .slider", "touchstart", function (e) {
        Ut = !0, jt(e.touches[0].clientX)
    }), E(Oe, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), E("#game-toolbar .color-picker .colors * .item", "mousedown", function (e) {
        var t = this.colorIndex;
        0 == e.button ? (e.altKey ? kt : bt)(t) : 2 == e.button && kt(t)
    });
    var Pt = Oe.querySelector(".color-picker .preview"),
        _t = Oe.querySelector(".color-picker .brushmenu");
    E([_e, Pt, _t], "DOMMouseScroll wheel", function (e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        mt(lt + 4 * e)
    }), E(Pt, "click", function (e) {
        this.classList.contains("open") ? Ct() : (Oe.querySelector(".color-picker .brushmenu").classList.add("open"), Oe.querySelector(".color-picker .preview").classList.add("open"), gt())
    }), E([c, _e], "mousedown touchstart", function (e) {
        e.target != Pt && (_t.contains(e.target) || Ct())
    }), E(c, "keypress", function (e) {
        if ("Enter" == e.code) return ce.focus(), 0;
        if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != it) return 0;
        for (var t = 0; t < je.length; t++)
            if (je[t].hotkey.toLowerCase() == e.key) return St(je[t].id), e.preventDefault(), 0;
        for (t = 0; t < Pe.length; t++)
            if (Pe[t].hotkey.toLowerCase() == e.key) return yt(Pe[t].id), e.preventDefault(), 0
    }), E(c, "touchmove", function (e) {
        Ut && jt(e.touches[0].clientX)
    }), E(c, "touchend touchcancel", function (e) {
        Ut = !1
    }), E(_e, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), E(_e, "mousedown", function (e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != it || Gt(e.button, e.clientX, e.clientY, !0, -1)
    }), E(c, "mouseup", function (e) {
        e.preventDefault(), Jt(e.button), Ut = !1
    }), E(c, "mousemove", function (e) {
        Bt(e.clientX, e.clientY, !1, -1), Ut && jt(e.clientX)
    });
    // TYPOMOD 
    // desc: add event handlers for typo features
    E(".avatar-customizer .container", "pointerdown", () => {
        Xn(typo.createFakeLobbyData());
    });
    // TYPOEND
    var Ht = null;

    function Wt(e, t, n, a) {
        var o = _e.getBoundingClientRect(),
            e = Math.floor((e - o.left) / o.width * _e.width),
            o = Math.floor((t - o.top) / o.height * _e.height);
        a ? (Ze = n, Ve[0] = Ke[0] = e, Ve[1] = Ke[1] = o) : (Ve[0] = Ke[0], Ve[1] = Ke[1], Ze = n, Ke[0] = e, Ke[1] = o)
    }
    E(_e, "touchstart", function (e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Ht && (Ht = e[0].identitfier, Gt(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), E(_e, "touchend touchcancel", function (e) {
        e.preventDefault(), Jt(it)
    }), E(_e, "touchmove", function (e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == Ht) {
                Bt(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    });
    var zt = !1,
        Xt = 0;
    setInterval(function () {
        zt && (Kt(!1), zt = !1)
    }, 1e3 / 90);

    function Bt(e, t, n, a) {
        zt || (zt = !0, Wt(e, t, a, n))
    }

    function Gt(e, t, n, a, o) {
        We.length, it = e, Wt(t, n, o, a), Kt(!0)
    }

    function Jt(e) {
        -1 == e || 0 != e && 2 != e || it != e || (Xt = We.length, Je.push(Xt), Ht = null, it = -1)
    }

    function Kt(e) {
        if (xn.id == m && wn == kn && -1 != it) {
            var t = 0 == it ? at : ot,
                n = null;
            if (e && (nt == De && (o = t, r = Ke[0], l = Ke[1], n = [Le, o, r, l]), nt == Ae)) {
                var a = function (e, t) {
                    for (var n = (t = He.getImageData(e, t, 1, 1)).data[0], a = t.data[1], o = t.data[2], r = 0; r < rt.length; r++) {
                        var l = rt[r],
                            i = l[0] - n,
                            c = l[1] - a,
                            l = l[2] - o;
                        if (0 == i && 0 == c && 0 == l) return r
                    }
                    // TYPOMOD
                    // desc: if color is not in array, convert to custom color
                    r = parseInt(typo.rgbToHex(n, a, o),16) + 10000;
                    // TYPOEND
                    return r
                }(Ke[0], Ke[1]);
                return (0 == it ? bt : kt)(a), void St(tt)
            }
            nt == Ie && (e = lt, 0 <= Ze && (e = (lt - Ee) * Ot(Ze, 0, 1) + Ee), o = t, r = e, l = Ve[0], a = Ve[1], t = Ke[0], e = Ke[1], n = [Me, o, r, l, a, t, e]), null != n && Tt(n)
        }
        var o, r, l
    }
    setInterval(() => {
        var e, t;
        Sn && xn.id == m && wn == kn && 0 < We.length - ze && (t = We.slice(ze, e = ze + 8), Sn.emit("data", {
            id: ma,
            data: t
        }), ze = Math.min(e, We.length))
    }, 50), setInterval(function () {
        Sn && xn.id == m && wn != kn && Xe < We.length && (At(Rt(We[Xe])), Xe++)
    }, 3);
    var Vt = c.querySelector("#game-canvas .overlay"),
        Zt = c.querySelector("#game-canvas .overlay-content"),
        $t = c.querySelector("#game-canvas .overlay-content .text"),
        Qt = c.querySelector("#game-canvas .overlay-content .words"),
        en = c.querySelector("#game-canvas .overlay-content .reveal"),
        tn = c.querySelector("#game-canvas .overlay-content .result"),
        nn = -100,
        an = 0,
        on = void 0;

    function rn(e, r, l) {
        let i = nn,
            c = an,
            s = e.top - i,
            d = e.opacity - c;
        if (Math.abs(s) < .001 && Math.abs(d) < .001) l && l();
        else {
            let a = void 0,
                o = 0;
            on = u.requestAnimationFrame(function e(t) {
                null == a && (a = t);
                var n = t - a;
                a = t, o = Math.min(o + n, r);
                t = o / r, n = (n = t) < .5 ? .5 * function (e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function (e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2), t = t * t * (3 - 2 * t);
                nn = i + s * n, an = c + d * t, Zt.style.top = nn + "%", Vt.style.opacity = an, o == r ? l && l() : on = u.requestAnimationFrame(e)
            })
        }
    }

    function ln(e) {
        e.classList.add("show")
    }

    function cn(e) {
        e.classList.remove("show")
    }

    function sn(t) {
        switch (! function () {
            for (var e = 0; e < Zt.children.length; e++) cn(Zt.children[e])
        }(), t.id) {
            case b:
                ln($t), $t.textContent = "Round " + (t.data + 1);
                break;
            case y:
                ln($t), $t.textContent = "Waiting for players...";
                break;
            case S:
                ln($t), $t.textContent = "Game starting in a few seconds...";
                break;
            case C:
                ln(en), en.querySelector("p span.word").textContent = t.data.word, en.querySelector(".reason").textContent = v[t.data.reason];
                var e = en.querySelector(".player-container");
                O(e);
                for (var n = [], a = 0; a < t.data.scores.length; a += 3) {
                    var o = t.data.scores[a + 0],
                        r = (t.data.scores[a + 1], t.data.scores[a + 2]);
                    (c = Ca(o)) && n.push({
                        name: c.name,
                        score: r
                    })
                }
                n.sort(function (e, t) {
                    return t.score - e.score
                });
                for (a = 0; a < n.length; a++) {
                    var i = T("player"),
                        c = n[a];
                    i.appendChild(T("name", c.name));
                    var s = T("score", (0 < c.score ? "+" : "") + c.score);
                    c.score <= 0 && s.classList.add("zero"), i.appendChild(s), e.appendChild(i)
                }
                break;
            case w:
                ln(tn);
                let l = [tn.querySelector(".podest-1"), tn.querySelector(".podest-2"), tn.querySelector(".podest-3"), tn.querySelector(".ranks")];
                for (let e = 0; e < 4; e++) O(l[e]);
                if (0 < t.data.length) {
                    let r = [
                        [],
                        [],
                        [],
                        []
                    ];
                    for (let e = 0; e < t.data.length; e++) {
                        var d = {
                            player: Ca(t.data[e][0]),
                            rank: t.data[e][1],
                            title: t.data[e][2]
                        };
                        d.player && r[Math.min(d.rank, 3)].push(d)
                    }
                    for (let o = 0; o < 3; o++) {
                        let a = r[o];
                        if (0 < a.length) {
                            var u = a.map(function (e) {
                                return e.player.name
                            }).join(", "),
                                h = a[0].player.score;
                            let e = l[o];
                            e.appendChild(T("rank-place", "#" + (o + 1))), e.appendChild(T("rank-name", u)), e.appendChild(T("rank-score", h + " points"));
                            let n = T("avatar-container");
                            e.appendChild(n), 0 == o && n.appendChild(T("trophy"));
                            for (let t = 0; t < a.length; t++) {
                                let e = N(a[t].player.avatar, 96, 0 == o);
                                e.style.width = "96px", e.style.height = "96px", e.style.left = 16 * -(a.length - 1) + 32 * t + "px", 0 == o && (e.classList.add("winner"), e.style.animationDelay = -2.35 * t + "s"), n.appendChild(e)
                            }
                        }
                    }
                    var f = Math.min(5, r[3].length);
                    for (let n = 0; n < f; n++) {
                        var p = r[3][n];
                        let e = T("rank"),
                            t = N(p.player.avatar, 48, !1);
                        t.style.width = "48px", t.style.height = "48px", e.appendChild(t), e.appendChild(T("rank-name", "#" + (p.rank + 1) + " " + p.player.name)), e.appendChild(T("rank-score", p.player.score + " points")), l[3].appendChild(e)
                    }
                    0 < r[0].length ? (m = r[0].map(function (e) {
                        return e.player.name
                    }).join(", "), tn.querySelector(".winner-name").textContent = 0 < r[0].length ? m : "<user left>", tn.querySelector(".winner-text").textContent = 1 == r[0].length ? " is the winner!" : " are the winners!") : (tn.querySelector(".winner-name").textContent = "", tn.querySelector(".winner-text").textContent = "Nobody won!")
                } else tn.querySelector(".winner-name").textContent = "", tn.querySelector(".winner-text").textContent = "Nobody won!";
                break;
            case k:
                if (t.data.words) {
                    ln($t), ln(Qt), $t.textContent = "Choose a word", O(Qt);
                    for (a = 0; a < t.data.words.length; a++) {
                        var g = T("word", t.data.words[a]);
                        g.index = a, E(g, "click", function () {
                            var e;
                            e = this.index, Sn && Sn.connected && xn.id == k && Sn.emit("data", {
                                id: ga,
                                data: e
                            })
                        }), Qt.appendChild(g)
                    }
                } else {
                    ln($t);
                    var m = (c = Ca(t.data.id)) ? c.name : "User";
                    $t.textContent = m + " is choosing a word!"
                }
        }
    }
    const dn = 0,
        un = 1,
        hn = 2,
        fn = 3,
        pn = 4,
        gn = 5,
        mn = 6;

    function vn(e, t) {
        this.url = t, this.buffer = null, this.loaded = !1;
        var n = this,
            a = new XMLHttpRequest;
        a.open("GET", t, !0), a.responseType = "arraybuffer", a.onload = function () {
            e.context.decodeAudioData(a.response, function (e) {
                n.buffer = e, n.loaded = !0
            }, function (e) {
                console.log("Failed loading audio from url '" + t + "'")
            })
        }, a.send()
    }
    var yn = function () {
        this.context = null, this.sounds = new Map, u.addEventListener("load", this.load.bind(this), !1)
    };
    yn.prototype.addSound = function (e, t) {
        this.sounds.set(e, new vn(this, t))
    }, yn.prototype.loadSounds = function () {
        this.addSound(dn, "/audio/roundStart.ogg"), this.addSound(un, "/audio/roundEndSuccess.ogg"), this.addSound(hn, "/audio/roundEndFailure.ogg"), this.addSound(fn, "/audio/join.ogg"), this.addSound(pn, "/audio/leave.ogg"), this.addSound(gn, "/audio/playerGuessed.ogg"), this.addSound(mn, "/audio/tick.ogg")
    }, yn.prototype.playSound = function (e) {
        var t, n;
        null != this.context && ("running" == this.context.state ? null == this.context || I.audio_mute || !this.sounds.has(e) || (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.context.destination), n.start(0)) : this.context.resume().then(() => {
            this.playSound(e)
        }))
    }, yn.prototype.load = function () {
        try {
            u.AudioContext = u.AudioContext || u.webkitAudioContext, this.context = new AudioContext
        } catch (e) {
            return console.log("Error creating AudioContext."), void (this.context = null)
        }
        this.loadSounds()
    };
    y;
    var Sn, bn = [],
        kn = 0,
        Cn = -1,
        wn = -1,
        qn = [],
        xn = {
            id: -1,
            time: 0,
            data: 0
        },
        Mn = new yn,
        Ln = void 0,
        In = c.querySelector("#game-room"),
        An = c.querySelector("#game-players"),
        Dn = c.querySelector("#game-board"),
        En = An.querySelector(".list"),
        Tn = An.querySelector(".footer"),
        Rn = [c.querySelector("#game-round .round-current"), c.querySelector("#game-round .round-max")],
        On = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")],
        Nn = c.querySelector("#home .container-name-lang input"),
        Yn = c.querySelector("#home .container-name-lang select"),
        Fn = c.querySelector("#home .panel .button-play"),
        Un = c.querySelector("#home .panel .button-create"),
        e = c.querySelector("#home .panel .button-rooms");

    function jn(e) {
        c.querySelector("#load").style.display = e ? "block" : "none"
    }

    function Pn(e, t, n, a) {
        var o, r;
        o = e, e = t, r = function (e, t) {
            switch (e) {
                case 200:
                    return void n({
                        success: !0,
                        data: t
                    });
                case 503:
                case 0:
                    a && Z(H, "Servers are currently undergoing maintenance!\n\rPlease try again later!");
                    break;
                default:
                    a && Z(H, "An unknown error occurred (" + e + ")\n\rPlease try again later!")
            }
            n({
                success: !1,
                error: e
            })
        }, (t = new XMLHttpRequest).onreadystatechange = function () {
            4 == this.readyState && (console.log(this.responseText), r(this.status, this.response))
        }, t.open("POST", o, !0), t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), t.send(e)
    }

    function _n(e, t) {
        Mn.context.resume(), Sn && Sn.disconnect();
        let n = 0;
        (Sn = a(e, {
            query: {
                fp: xe()
            }
        })).on("connect", function () {
            // TYPOMOD
            // desc: disconnect socket & leave lobby
            typo.disconnect = () => {
                if (Sn) {
                    Sn.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    Sn.off("data");
                    Sn.reconnect = false;
                    Sn.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            // TYPOEND
            Sn.on("joinerr", function (e) {
                $n(), Z(H, function (e) {
                    switch (e) {
                        case 1:
                            return "Room not found!";
                        case 2:
                            return "Room is full!";
                        case 3:
                            return "You are on a kick cooldown!";
                        case 4:
                            return "You are banned from this room!";
                        default:
                            return "An unknown error (" + e + ") occured! "
                    }
                }(e))
            }), Sn.on("data", ka);
            var e = Nn.value.split("#"),
                e = {
                    join: t,
                    name: e[0],
                    lang: Yn.value,
                    code: e[1],
                    avatar: I.avatar
                };
            Sn.emit("login", e)
        }), Sn.on("reason", function (e) {
            n = e
        }), Sn.on("disconnect", function () {
            switch (n) {
                case r:
                    Z(W, "You have been kicked!");
                    break;
                case x:
                    Z(W, "You have been banned!")
            }
            $n()
        }), Sn.on("connect_error", e => {
            $n(), Z(H, e.message)
        })
    }

    function Hn(e) {
        e = "" != e ? "id=" + e : "lang=" + Yn.value;
        le(), jn(!0), Pn(location.origin + ":3000/play", e, function (e) {
            jn(!1), e.success && _n((e = e.data.split(","))[0], e[1])
        })
    }

    function Wn(e) {
        let n = [],
            a = e.split(",");
        var t = parseInt(a.shift());
        if (0 < t) {
            var o = (a.length - 1) / t;
            for (let e = 0; e < t; e++) {
                var r = e * o;
                let t = [];
                for (let e = 0; e < 10; e++) t.push(a[r + e + 3]);
                n.push({
                    id: a[r],
                    users: a[1 + r],
                    round: a[2 + r],
                    settings: t
                })
            }
        }
        return n
    }

    function zn() {
        var e = K[z].querySelector(".filter select.lang").value,
            t = K[z].querySelector(".filter select.type").value;
        Pn(location.origin + ":3000/rooms", "lang=" + e + "&type=" + t, function (e) {
            e.success && oe(Wn(e.data))
        })
    }

    function Xn(e) {
        var t;
        Mn.playSound(fn), St(Ie, !0), mt(28), bt(2), kt(0), Dt(!0), O(se), c.querySelector("#home").style.display = "none", c.querySelector("#game").style.display = "flex", kn = e.me, c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, qn = t, Bn(), O(En), bn = [];
        for (var n = 0; n < e.users.length; n++) wa(e.users[n], !1);
        Ia(), Da(), na(e.owner), Kn(e.state, !0)
    }

    function Bn() {
        c.querySelector("#game-room .lobby-name").textContent = qn[L.NAME], Rn[1].textContent = qn[L.ROUNDS];
        for (var e, t = 0; t < Ra.length; t++) {
            var n = Ra[t];
            n.index && (n = qn[(e = n).index], "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }

    function Gn(e, t, n) {
        qn[e] = t, n && Sn && Sn.emit("data", {
            id: sa,
            data: {
                id: e,
                val: t
            }
        }), Bn()
    }

    function Jn() {
        for (let e = 0; e < bn.length; e++) bn[e].score = 0;
        for (let e = 0; e < bn.length; e++) Ea(bn[e], !1), Ta(bn[e], !1), Aa(bn[e])
    }

    function Kn(e, t) {
        var n, a;
        if (n = xn = e, null != on && (u.cancelAnimationFrame(on), on = void 0), n.id == m || n.id == q ? rn({
            top: -100,
            opacity: 0
        }, 700, function () {
            Vt.classList.remove("show")
        }) : Vt.classList.contains("show") ? rn({
            top: -100,
            opacity: 1
        }, 700, function () {
            sn(n), rn({
                top: 0,
                opacity: 1
            }, 700)
        }) : (Vt.classList.add("show"), sn(n), rn({
            top: 0,
            opacity: 1
        }, 700)), a = e.time, ja(), Ua = a, Ya.textContent = Ua, Fa = setInterval(function () {
            Ua = Math.max(0, Ua - 1), Ya.textContent = Ua;
            var e = -1;
            xn.id == m && (e = Oa), xn.id == k && (e = Na), Ya.style.animationName = Ua < e ? Ua % 2 == 0 ? "rot_left" : "rot_right" : "none", Ua < e && Mn.playSound(mn), Ua <= 0 && ja()
        }, 1e3), Oe.classList.add("hidden"), et(), Zn(!1), e.id == q ? (Jn(), In.style.display = "flex", Dn.style.display = "none", An.classList.add("room")) : (In.style.display = "none", Dn.style.display = "", An.classList.remove("room")), Ia(), e.id == b && (Rn[0].textContent = e.data + 1, 0 == e.data && Jn()), e.id == C) {
            kn != wn && ta(e.data.word);
            for (var o = 0; o < e.data.scores.length; o += 3) {
                var r = e.data.scores[o + 0],
                    l = e.data.scores[o + 1],
                    r = (e.data.scores[o + 2], Ca(r));
                r && (r.score = l)
            }
            Da();
            for (var i = !0, o = 0; o < bn.length; o++)
                if (bn[o].guessed) {
                    i = !1;
                    break
                } i ? Mn.playSound(hn) : Mn.playSound(un), fe("The word was '" + e.data.word + "'", "", p, !0)
            // TYPOMOD
            // desc: log finished drawing
            document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
            // TYPOEND
        } else e.id != m && (On[0].textContent = "WAITING", On[0].classList.add("waiting"), On[1].style.display = "none", On[2].style.display = "none");
        if (e.id == m) {
            if (wn = e.data.id, Mn.playSound(dn), Dt(!0), e.data.drawCommands && (We = e.data.drawCommands), fe(Ca(wn).name + " is drawing now!", "", d, !0), !t)
                for (o = 0; o < bn.length; o++) Ea(bn[o], !1);
            On[0].classList.remove("waiting"), wn == kn ? (t = e.data.word, On[0].textContent = "DRAW THIS", On[1].style.display = "", On[2].style.display = "none", On[1].textContent = t, Oe.classList.remove("hidden"), et()) : (Zn(!0), Qn(e.data.word), ea(e.data.hints))
        } else {
            wn = -1;
            for (o = 0; o < bn.length; o++) Ea(bn[o], !1)
        }
        for (o = 0; o < bn.length; o++) Ta(bn[o], bn[o].id == wn)
    }

    function Vn(e) {
        Sn && Sn.connected && xn.id == m && (Sn.emit("data", {
            id: la,
            data: e
        }), Zn(!1))
    }

    function Zn(e) {
        c.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function $n() {
        Sn && Sn.close(), Sn = void 0, Dt(), ja(), bn = [], qn = [], xn = {
            id: wn = Cn = -1,
            time: kn = 0,
            data: 0
        }, c.querySelector("#home").style.display = "", c.querySelector("#game").style.display = "none"
    }

    function Qn(e) {
        var t = 0 == e;
        On[0].textContent = t ? "WORD HIDDEN" : "GUESS THIS", On[1].style.display = "none", On[2].style.display = "", O(On[2]), On[2].hints = [], t && (e = 3);
        for (var n = 0; n < e; n++) On[2].hints[n] = T("hint", t ? "?" : "_"), On[2].appendChild(On[2].hints[n]);
        t || On[2].appendChild(T("word-length", e))
    }

    function ea(e) {
        for (var t = On[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
                o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function ta(e) {
        (!On[2].hints || On[2].hints.length < e.length) && Qn(e.length);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        ea(t)
    }

    function na(e) {
        Cn = e;
        for (var t = 0; t < bn.length; t++) F(bn[t].element, bn[t].id == Cn), Ma(bn[t], 0, bn[t].id == Cn);
        ! function (t) {
            for (var n = 0; n < Ra.length; n++) {
                let e = Ra[n];
                e.element.disabled = t
            }
        }(kn != Cn);
        e = Ca(Cn);
        e && fe(e.name + " is now the lobby owner!", "", o, !0)
    }
    E(K[z].querySelectorAll(".filter select"), "change", zn), E(K[z].querySelector("button.refresh"), "click", zn);
    const aa = 1,
        oa = 2,
        ra = 5,
        la = 8,
        ia = 10,
        ca = 11,
        sa = 12,
        da = 13,
        ua = 14,
        ha = 15,
        fa = 16,
        pa = 17,
        ga = 18,
        ma = 19,
        va = 20,
        ya = 21;
    const Sa = 30;
    const ba = 32;

    function ka(e) {
        var t = e.id,
            n = e.data;
        switch (t) {
            case ia:
                Xn(n);
                // TYPOMOD
                // desc: send lobbydata
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                // TYPOEND
                break;
            case ca:
                Kn(n);
                break;
            case sa:
                Gn(n.id, n.val, !1);
                break;
            case da:
                ea(n);
                break;
            case ua:
                Ua = n;
                break;
            case aa:
                fe(wa(n, !0).name + " joined the room!", "", h, !0), Mn.playSound(fn);
                break;
            case oa:
                var a = function (e) {
                    for (var t = 0; t < bn.length; t++) {
                        var n = bn[t];
                        if (n.id == e) return bn.splice(t, 1), n.element.remove(), Da(), Ia(), n
                    }
                    return
                }(n.id);
                a && (fe(a.name + M[n.reason], "", f, !0), Mn.playSound(pn));
                break;
            case ra:
                var a = Ca(n[0]),
                    o = Ca(n[1]),
                    r = n[2],
                    l = n[3];
                a && o && fe("'" + a.name + "' is voting to kick '" + o.name + "' (" + r + "/" + l + ")", "", s, !0);
                break;
            case ha:
                var i = Ca(n.id);
                i && (fe(i.name + " guessed the word!", "", h, !0), Ea(i, !0), Mn.playSound(gn), n.id == kn && ta(n.word));
                break;
            case la:
                o = Ca(n.id);
                o && (r = o, l = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (i = T("icon")).style.backgroundImage = "url(/img/" + l + ")", xa(r, i), n.vote ? fe(o.name + " liked the drawing!", "", h, !0) : fe(o.name + " disliked the drawing!", "", f, !0));
                break;
            case pa:
                na(n);
                break;
            case fa:
                fe("'" + n + " is close!", "", s, !0);
                break;
            case Sa:
                qa(Ca(n.id), n.msg);
                break;
            case ba:
                fe("Spam detected! You're sending messages too quickly.", "", f, !0);
                break;
            case ma:
                for (var c = 0; c < n.length; c++) Tt(n[c]);
                break;
            case va:
                Dt(!0);
                break;
            case ya:
                Mt(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function Ca(e) {
        for (var t = 0; t < bn.length; t++) {
            var n = bn[t];
            if (n.id == e) return n
        }
    }

    function wa(e, t) {
        var n = {
            id: e.id,
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
        bn.push(n), I.filterChat && n.id != kn && he(n.name.slice()) != n.name && (n.name = "user");
        var a = n.id == kn ? n.name + " (You)" : n.name,
            o = T("info"),
            e = T("name", a);
        n.id == kn && e.classList.add("me"), o.appendChild(e), o.appendChild(T("rank", "#" + n.rank)), o.appendChild(T("score", n.score + " points")), n.element.appendChild(o);
        a = N(n.avatar);
        // TYPOMOD
        // desc: set ID to player to identify
        n.element.setAttribute("playerid", n.id);
        // TYPOEND
        n.element.drawing = T("drawing"), a.appendChild(n.element.drawing), n.element.appendChild(a), En.appendChild(n.element), E(n.element, "click", function () {
            Ln = n, Z(_, n)
        });
        e = T("icons"), o = T("icon owner"), a = T("icon muted");
        return e.appendChild(o), e.appendChild(a), n.element.appendChild(e), n.element.icons = [o, a], Ea(n, n.guessed), t && Ia(), n
    }

    function qa(e, t) {
        var n;
        e.muted || (n = e.id == wn || e.guessed, kn != wn && !Ca(kn).guessed && n || (t = he(t), xa(e, T("text", t)), fe(e.name, t, n ? "#7dad3f" : "#000")))
    }

    function xa(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = T("bubble"),
            a = T("content");
        a.appendChild(t), n.appendChild(T("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function () {
            e.bubble.remove(), e.bubble = void 0
        }, 1500)
    }

    function Ma(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var La = void 0;

    function Ia() {
        var e = xn.id == q,
            t = e ? 112 : 48,
            n = Math.max(t, En.clientHeight);
        let a = Math.floor(n / t);
        e && (a *= 4);
        t = Math.ceil(bn.length / a);
        for (let e = 0; e < bn.length; e++) bn[e].page = Math.floor(e / a);
        e = c.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = bn.length, e[1].textContent = qn[L.SLOTS], null == La ? La = U(Tn, t, [An], function (e, n, t) {
            let a = [];
            for (let t = 0; t < bn.length; t++) {
                let e = bn[t];
                var o = e.page == n;
                e.element.style.display = o ? "" : "none", o && a.push(e.element)
            }
            if (0 < a.length) {
                for (let t = 0; t < a.length; t++) {
                    let e = a[t];
                    e.classList.remove("first"), e.classList.remove("last"), t % 2 == 0 ? e.classList.remove("odd") : e.classList.add("odd")
                }
                a[0].classList.add("first"), a[a.length - 1].classList.add("last")
            }
        }) : j(La, t), La.element.style.display = 1 < t ? "" : "none"
    }

    function Aa(t) {
        let n = 1;
        for (let e = 0; e < bn.length; e++) {
            var a = bn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n, t.element.querySelector(".score").textContent = t.score + " points";
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n, e.classList.remove("first"), e.classList.remove("second"), e.classList.remove("third"), 1 == n && e.classList.add("first"), 2 == n && e.classList.add("second"), 3 == n && e.classList.add("third")
    }

    function Da() {
        for (var e = 0; e < bn.length; e++) Aa(bn[e])
    }

    function Ea(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }

    function Ta(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ra = [];
    ! function () {
        for (var e = In.querySelectorAll('*[id^="item-"]'), n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            Ra.push(t), E(t.element, "change", function () {
                var e = "checkbox" == this.type ? this.checked : this.value;
                console.log("lobby setting " + t.id + " changed to " + e), null != t.index && Gn(t.index, e, !0)
            })
        }
    }();
    const Oa = 10,
        Na = 4;
    var Ya = c.querySelector("#game-clock"),
        Fa = null,
        Ua = 0;

    function ja() {
        Fa && (clearInterval(Fa), Fa = null)
    }
    var Pa, _a, Ha, Wa, za, yn = c.querySelector("#tutorial"),
        Xa = yn.querySelectorAll(".page"),
        Ba = U(yn, Xa.length, [yn.querySelector(".pages")], function (e, t, n) {
            n && clearInterval(Ga);
            for (let e = 0; e < Xa.length; e++) Xa[e].classList.remove("active");
            Xa[t].classList.add("active")
        }),
        Ga = setInterval(function () {
            Ba.selected < 4 ? P(Ba, Ba.selected + 1, !0) : P(Ba, 0, !0)
        }, 3500);

    function Ja(e) {
        za.parts[e].classList.remove("bounce"), za.parts[e].offsetWidth, za.parts[e].classList.add("bounce")
    }
    E(u, "resize", Ia), E([Nn, Yn], "change", D), E(Fn, "click", function () {
        var e, t, n;
        Hn((e = u.location.href, n = "", e = e.split("?"), n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
    }), E(e, "click", function () {
        K[z].querySelector(".filter select.lang").value = Yn.value;
        var e = K[z].querySelector(".filter select.type").value;
        Pn(location.origin + ":3000/rooms", "lang=" + Yn.value + "&type=" + e, function (e) {
            e.success && Z(z, Wn(e.data))
        })
    }), E(Un, "click", function () {
        le(), jn(!0), Pn(location.origin + ":3000/create", "lang=" + Yn.value, function (e) {
            jn(!1), e.success && _n((e = e.data.split(","))[0], e[1])
        })
    }), E(c.querySelector("#game-rate .like"), "click", function () {
        Vn(1)
    }), E(c.querySelector("#game-rate .dislike"), "click", function () {
        Vn(0)
    }), E(c.querySelector("#start-game"), "click", function () {
        if (Sn) {
            let t = c.querySelector("#item-settings-customwords").value.split(","),
                e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++) t[e] = t[e].trim();
                e = t.join(",")
            }
            Sn.emit("data", {
                id: 22,
                data: e
            })
        }
    }), E(K[_].querySelector("button.kick"), "click", function () {
        le(), null != Ln && Ln.id != kn && kn == Cn && Sn && Sn.emit("data", {
            id: 3,
            data: Ln.id
        })
    }), E(K[_].querySelector("button.ban"), "click", function () {
        le(), null != Ln && Ln.id != kn && kn == Cn && Sn && Sn.emit("data", {
            id: 4,
            data: Ln.id
        })
    }), E(K[_].querySelector("button.votekick"), "click", function () {
        le(), null != Ln && Ln.id != kn && Sn && Sn.emit("data", {
            id: ra,
            data: Ln.id
        })
    }), E(K[_].querySelector("button.mute"), "click", function () {
        null != Ln && Ln.id != kn && (Ln.muted = !Ln.muted, Ma(Ln, 1, Ln.muted), Ln.muted ? fe("You muted '" + Ln.name + "'!", "", f, !0) : fe("You unmuted '" + Ln.name + "'!", "", f, !0), Sn && Sn.emit("data", {
            id: 7,
            data: Ln.id
        }), V(Ln.muted))
    }), E(K[_].querySelector("button.report"), "click", function () {
        Sn && null != Ln && Ln.id != kn && Sn.emit("data", {
            id: 6,
            data: Ln.id
        })
    }), E(ie, "submit", function (e) {
        return e.preventDefault(), ce.value && (Sn && Sn.connected ? Sn.emit("data", {
            id: Sa,
            data: ce.value
        }) : qa(Ca(kn), ce.value)), ie.reset(), !1
    }),
        function () {
            if (!u.localStorageAvailable) {
                var e = !1;
                if (void 0 !== n) try {
                    n.setItem("feature_test", "yes"), "yes" === n.getItem("feature_test") && (n.removeItem("feature_test"), e = !0)
                } catch (e) { }
                u.localStorageAvailable = e
            }
            u.localStorageAvailable ? (Nn.value = A("name", ""), Yn.value = function (e) {
                for (var t = c.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                    if (e.startsWith(t[n].value)) return t[n].value;
                return "en"
            }(A("lang", navigator.language)), I.audio_mute = 1 == A("audio", 0) ? 1 : 0, (e = n.getItem("ava")) && (I.avatar = JSON.parse(e)), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
        }(), Pa = (Wa = c.querySelector("#home .avatar-customizer")).querySelector(".container"), _a = Wa.querySelectorAll(".arrows.left .arrow"), Ha = Wa.querySelectorAll(".arrows.right .arrow"), Wa = Wa.querySelectorAll(".randomize"), (za = N(I.avatar, 96)).classList.add("fit"), Pa.appendChild(za), E(_a, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --I.avatar[e], I.avatar[e] < 0 && (I.avatar[e] = t[e] - 1), Ja(e), Y(za, I.avatar, 96), D()
        }), E(Ha, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            I.avatar[e] += 1, I.avatar[e] >= t[e] && (I.avatar[e] = 0), Ja(e), Y(za, I.avatar, 96), D()
        }), E(Wa, "click", function () {
            I.avatar[0] = Math.floor(Math.random() * t[0]), I.avatar[1] = Math.floor(Math.random() * t[1]), I.avatar[2] = Math.floor(Math.random() * t[2]), Ja(1), Ja(2), Y(za, I.avatar, 96), D()
        }),
        function () {
            Math.round(8 * Math.random());
            for (var e = c.querySelector("#home .logo-big .avatar-container"), t = 0; t < 8; t++) {
                var n = [0, 0, 0, 0];
                n[0] = t, n[1] = Math.round(100 * Math.random()) % i, n[2] = Math.round(100 * Math.random()) % g, n[3] = 1e3 * Math.random() < 70 ? Math.round(+Math.random()) : -1;
                n = N(n, 48);
                e.append(n)
            }
        }()
}(window, document, localStorage, io);