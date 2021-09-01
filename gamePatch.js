﻿! function (u, c, n, a) {
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
    const y = ["Everyone guessed the word!", "Time is up!", "The drawer left the game!", "The drawer received too many thumbs down!", "The drawer has been kicked!"],
        v = 0,
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
            // IDENTIFY x.value.split: #home .container-name-lang input
            // IDENTIFY x.avatar: [Math.round(100 * Math.random()) %
            return { id: id, name: name.length != 0 ? name : (wn.value.split("#")[0] != "" ? wn.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? I.avatar : avatar, score: score, guessed: guessed };
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
            document.addEventListener("joinLobby", () => {
                let timeoutdiff = Date.now() - typo.lastConnect;
                jn(true);
                setTimeout(() => {
                    typo.lastConnect = Date.now();
                    xn.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play")
                    Ln(false); // IDENTIFY x(false): querySelector("#load").style.display
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 3000 ? 3000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else _n() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = ""
            });
            document.addEventListener("setColor", (e) => {
                if (e.detail.secondary) st(e.detail.code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill
                else ct(e.detail.code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill
            });
            document.addEventListener("performDrawCommand", (e) => {
                Ee.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = []
                yt(kt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil
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
    var I = {
        avatar: [Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % i, Math.round(100 * Math.random()) % g],
        audio_mute: 0,
        filterChat: !0
    };

    function D(e, t) {
        e = n.getItem(e);
        return null == e ? t : e
    }

    function A() {
        u.localStorageAvailable && (n.setItem("name", wn.value), n.setItem("lang", qn.value), n.setItem("audio", I.audio_mute ? 1 : 0), n.setItem("ava", JSON.stringify(I.avatar)), console.log("Settings saved."))
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

    function N(e) {
        return parseFloat(getComputedStyle(e, null).width.replace("px", ""))
    }

    function O(e) {
        for (; e.firstChild;) e.removeChild(e.firstChild)
    }

    function R(e, t, n) {
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
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), _(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), P(o, t), o
    }

    function P(n, e) {
        O(n.element), n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = T("dot");
            e.appendChild(T("inner")), E(e, "click", function () {
                _(n, t, !0)
            }), n.element.appendChild(e), n.dots.push(e)
        }
        _(n, n.selected, !1)
    }

    function _(t, e, n) {
        if (0 <= e && e < t.dots.length) {
            t.selected = e;
            for (let e = 0; e < t.dots.length; e++) t.dots[e].classList.remove("active");
            t.dots[e].classList.add("active"), t.change(t, e, n)
        }
    }
    const j = 0,
        H = 1,
        W = 2,
        z = 3;
    const X = 5;
    var B = c.querySelector("#modal"),
        G = B.querySelector(".title .text"),
        J = B.querySelector(".content"),
        K = [];

    function V(e) {
        K[j].querySelector(".buttons button.mute").textContent = e ? "Unmute" : "Mute"
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
            case j:
                G.textContent = "";
                var a = K[j].querySelector(".buttons");
                a.style.display = t.id == sn ? "none" : "flex", a.querySelector(".button-pair").style.display = sn == dn ? "flex" : "none", V(t.muted);
                var o = J.querySelector(".player");
                O(o);
                a = R(t.avatar, 96);
                F(a, dn == t.id), a.style.width = "96px", a.style.height = "96px", o.appendChild(a), o.appendChild(T("name", t.id == sn ? t.name + " (You)" : t.name));
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
    K[j] = B.querySelector(".container-player"), K[H] = B.querySelector(".container-info"), K[W] = B.querySelector(".container-info"), K[z] = B.querySelector(".container-rooms"), K[4] = B.querySelector(".container-room"), K[X] = B.querySelector(".container-settings");
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
                An(e.id)
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
    const pe = 0,
        ge = 1;
    const me = 0,
        ye = 1,
        ve = 2;
    const Se = 4,
        be = 40;
    var ke, Ce = c.querySelector("#game-toolbar"),
        we = Ce.querySelectorAll(".tools-container .tools")[0],
        qe = Ce.querySelectorAll(".tools-container .tools")[1],
        xe = (ke = Ce.querySelector(".tool")).parentElement.removeChild(ke);

    function Me(e, t, n) {
        var a = xe.cloneNode(!0);
        a.toolIndex = t, a.querySelector(".icon").style.backgroundImage = "url(/img/" + n.graphic + ")", a.querySelector(".key").textContent = n.hotkey;
        n.id = t, n.element = a, e ? (a.addEventListener("click", function (e) {
            lt(this.toolIndex)
        }), qe.appendChild(a), Ie[t] = n) : (a.addEventListener("click", function (e) {
            it(this.toolIndex)
        }), we.appendChild(a), Le[t] = n)
    }
    var Le = [];
    Me(!1, me, {
        name: "Brush",
        hotkey: "B",
        graphic: "pen.gif",
        cursor: 0
    }), Me(!1, ye, {
        name: "Pick",
        hotkey: "V",
        graphic: "pick.gif",
        cursor: "url(/img/pick_cur.png) 7 36, default"
    }), Me(!1, ve, {
        name: "Fill",
        hotkey: "F",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    });
    var Ie = [];
    Me(!0, 0, {
        name: "Undo",
        hotkey: "U",
        graphic: "undo.gif",
        action: function () {
            ! function () {
                {
                    var e;
                    0 < Ye.length && (Ye.pop(), 0 < Ye.length ? (pt(e = Ye[Ye.length - 1]), ln && ln.emit("data", {
                        id: la,
                        data: e
                    })) : St())
                }
            }()
        }
    }), Me(!0, 1, {
        name: "Clear",
        hotkey: "C",
        graphic: "clear.gif",
        action: function () {
            St()
        }
    });
    var De = c.querySelector("#game-canvas canvas"),
        Ae = De.getContext("2d"),
        Ee = [],
        Te = 0,
        Ne = 0,
        Oe = [],
        Re = [0, 9999, 9999, 0, 0],
        Ye = [],
        Fe = [0, 0],
        Ue = [0, 0],
        Pe = 0,
        _e = c.createElement("canvas");
    _e.width = be + 2, _e.height = be + 2;
    var je = _e.getContext("2d");

    function He() {
        var e = Le[ze].cursor;
        if (fn.id == m && un == sn) {
            if (ze == me) {
                var t = _e.width,
                    n = Je;
                if (n <= 0) return;
                // TYPOMOD
                // desc: cursor with custom color
                let rgbArr = Xe < 10000 ? Ge[Xe] : typo.hexToRgb((Xe - 10000).toString(16).padStart(6, "0"));
                je.clearRect(0, 0, t, t), je.fillStyle = ht(rgbArr), je.beginPath(), je.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), je.fill(), je.strokeStyle = "#FFF", je.beginPath(), je.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), je.stroke(), je.strokeStyle = "#000", je.beginPath(), je.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), je.stroke();
                // TYPOEND
                // ORIG je.clearRect(0, 0, t, t), je.fillStyle = ht(Ge[Xe]), je.beginPath(), je.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), je.fill(), je.strokeStyle = "#FFF", je.beginPath(), je.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), je.stroke(), je.strokeStyle = "#000", je.beginPath(), je.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), je.stroke();
                t = t / 2, e = "url(" + _e.toDataURL() + ")" + t + " " + t + ", default"
            }
        } else e = "default";
        De.style.cursor = e
    }
    for (var We = 0, ze = 0, Xe = 0, Be = 0, Ge = [
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
    ], Je = 0, Ke = -1, Ve = [], Ze = 6, $e = 0; $e < Ze; $e++) {
        var Qe = $e / (Ze - 1),
            et = 11 + 32 * (1 - Qe),
            tt = (Se, be, Se, c.createElement("div"));
        tt.classList.add("size");
        Qe = c.createElement("div");
        Qe.classList.add("icon"), Qe.style.borderRadius = "100%", Qe.style.left = et + "%", Qe.style.right = et + "%", Qe.style.top = et + "%", Qe.style.bottom = et + "%", tt.appendChild(Qe), c.querySelector("#game-toolbar .color-picker .sizes").appendChild(tt), Ve.push([tt, Qe])
    }

    function nt(e) {
        for (var t = 0; t < Ze; t++) Ve[t][1].style.backgroundColor = e
    }

    function at() {
        var e = (Je - Se) / (be - Se),
            t = N(Ce.querySelector(".slider .track")),
            n = N(Ce.querySelector(".slider")),
            n = ((n - t) / 2 + e * t) / n;
        Ce.querySelector(".slider .knob").style.left = 100 * e + "%", Ce.querySelector(".slider .bar-fill").style.width = 100 * n + "%";
        e = Ce.querySelector(".color-picker .preview .graphic .brush"), n = Je + 10;
        e.style.width = n + "px", e.style.height = n + "px", Ce.querySelector(".color-picker .preview .size").textContent = Je + "px"
    }

    function ot(e) {
        Je = Ct(e, Se, be), at(), He()
    }

    function rt(e) {
        e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
    }

    function lt(e) {
        rt(Ie[e].element), Ie[e].action()
    }

    function it(e, t) {
        rt(Le[e].element), e == ze && !t || (Le[We = ze].element.classList.remove("selected"), Le[e].element.classList.add("selected"), ze = e, He())
    }

    function ct(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            ht(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            ht(Ge[e]);
        // TYPOEND
        // ORIG var t = ht(Ge[e]);
        nt(t), Xe = e, c.querySelector("#color-preview-primary").style.fill = t, He()
    }

    function st(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            ht(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            ht(Ge[e]);
        // TYPOEND
        //var t = ht(Ge[e]);
        nt(t), Be = e, c.querySelector("#color-preview-secondary").style.fill = t, He()
    }

    function dt() {
        Ce.querySelector(".color-picker .brushmenu").classList.remove("open"), Ce.querySelector(".color-picker .preview").classList.remove("open")
    }
    for ($e = 0; $e < Ge.length / 3; $e++) Ce.querySelector(".top").appendChild(ut(3 * $e)), Ce.querySelector(".mid").appendChild(ut(3 * $e + 1)), Ce.querySelector(".bottom").appendChild(ut(3 * $e + 2));

    function ut(e) {
        var t = T("item"),
            n = T("inner");
        return n.style.backgroundColor = ht(Ge[e]), t.appendChild(n), t.colorIndex = e, t
    }

    function ht(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function ft(e) {
        // TYPOMOD
        // desc: if color code > 1000 -> customcolor
        if (e < 10000) e = Ct(e, 0, Ge.length), e = Ge[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));
        // TYPOEND
        // ORIGINAL e = Ct(e, 0, Ge.length), e = Ge[e];
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function pt(e) {
        if (Ee = Ee.slice(0, e), !(sn != un && Ne < e)) {
            // TYPOMOD
            // desc: replace draw commands because of redo
            const keepCommands = Ee;
            // TYPOEND
            Re = mt();
            e = Math.floor(Ee.length / gt);
            console.log("canvas cache is: " + Oe.length), console.log("keeping: " + e), Oe = Oe.slice(0, e), xt(), console.log("applied " + Oe.length + " cached canvas imgs.");
            for (var t = 0; t < Oe.length; t++) {
                var n = Oe[t];
                Ae.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            e = Oe.length * gt;
            console.log("redrawn " + (Ee.length - e) + " drawCommands");
            for (t = e; t < Ee.length; t++) yt(kt(Ee[t]));
            Te = Math.min(Ee.length, Te), Ne = Math.min(Ee.length, Ne)
            // TYPOMOD 
            // log kept commands
            document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
            // TYPOEND
        }
    }
    const gt = 100;

    function mt() {
        return [0, 9999, 9999, 0, 0]
    }

    function yt(e) {
        var t, n, a, o;
        Re[0] += 1, Re[1] = Math.min(Re[1], e[0]), Re[2] = Math.min(Re[2], e[1]), Re[3] = Math.max(Re[3], e[2]), Re[4] = Math.max(Re[4], e[3]), Re[0] >= gt && (t = Re[1], n = Re[2], a = Re[3], o = Re[4], e = Ae.getImageData(t, n, a - t, o - n), Oe.push({
            data: e,
            bounds: Re
        }), Re = mt(), console.log("stashed image data with bounds of " + t + ", " + n + ", " + a + ", " + o + " (" + (a - t) + "x" + (o - n) + "px)"))
    }

    function vt(e) {
        return (e || 0 < Ee.length || 0 < Ye.length || 0 < Te || 0 < Ne) && (Ee = [], Ye = [], Te = Ne = 0, Re = mt(), Oe = [], xt(), 1)
    }

    function St() {
        vt() && ln && ln.emit("data", {
            id: ra
        })
    }

    function bt(e) {
        Ee.push(e), sn == un && yt(kt(e))
        // TYPOMOD
        // log draw commands
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        // TYPOEND
    }

    function kt(e) {
        var t = [0, 0, De.width, De.height];
        switch (e[0]) {
            case pe:
                var n = Ct(Math.floor(e[2]), Se, be),
                    a = Math.floor(Math.ceil(n / 2)),
                    o = Ct(Math.floor(e[3]), -a, De.width + a),
                    r = Ct(Math.floor(e[4]), -a, De.height + a),
                    l = Ct(Math.floor(e[5]), -a, De.width + a),
                    i = Ct(Math.floor(e[6]), -a, De.height + a),
                    c = ft(e[1]);
                t[0] = Ct(o - a, 0, De.width), t[1] = Ct(r - a, 0, De.height), t[2] = Ct(l + a, 0, De.width), t[3] = Ct(i + a, 0, De.height), qt(o, r, l, i, n, c.r, c.g, c.b);
                break;
            case ge:
                c = ft(e[1]);
                ! function (e, t, a, o, r) {
                    var l = Ae.getImageData(0, 0, De.width, De.height),
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
                            for (h += 4 * m, ++u, p = f = !1; u++ < g - 1 && c(h);) wt(l, h, a, o, r), 0 < d && (c(h - 4) ? f || (n.push([d - 1, u]), f = !0) : f = f && !1), d < m - 1 && (c(h + 4) ? p || (n.push([d + 1, u]), p = !0) : p = p && !1), h += 4 * m
                        }
                        Ae.putImageData(l, 0, 0)
                    }
                }(Ct(Math.floor(e[2]), 0, De.width), Ct(Math.floor(e[3]), 0, De.height), c.r, c.g, c.b)
        }
        return t
    }

    function Ct(e, t, n) {
        return e < t ? t : n < e ? n : e
    }

    function wt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
    }

    function qt(e, t, n, a, o, r, l, i) {
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
        var p = Ae.getImageData(d, u, h - d, o - u);
        if (e == n && t == a) f(e, t);
        else {
            f(e, t), f(n, a);
            var g = Math.abs(n - e),
                m = Math.abs(a - t),
                y = e < n ? 1 : -1,
                v = t < a ? 1 : -1,
                S = g - m;
            for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a;) {
                var b = S << 1; - m < b && (S -= m, e += y), b < g && (S += g, t += v), f(e, t)
            }
        }
        Ae.putImageData(p, d, u)
    }

    function xt() {
        // TYPOMOD
        // desc: log a canvas clear
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        Ae.fillStyle = "#FFF", Ae.fillRect(0, 0, De.width, De.height)
        document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        // TYPOEND
        // ORIGINAL Ae.fillStyle = "#FFF", Ae.fillRect(0, 0, De.width, De.height)
    }
    var Mt = !1;

    function Lt(e) {
        var t = c.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        ot(Se + Math.round(Ct((e - t.left) / t.width, 0, 1) * (be - Se)))
    }
    E("#game-toolbar .slider", "mousedown", function (e) {
        0 == e.button && (Mt = !0, Lt(e.clientX))
    }), E("#game-toolbar .slider", "touchstart", function (e) {
        Mt = !0, Lt(e.touches[0].clientX)
    }), E(Ce, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), E("#game-toolbar .color-picker .colors * .item", "mousedown", function (e) {
        var t = this.colorIndex;
        0 == e.button ? (e.altKey ? st : ct)(t) : 2 == e.button && st(t)
    });
    var It = Ce.querySelector(".color-picker .preview"),
        Dt = Ce.querySelector(".color-picker .brushmenu");
    E([De, It, Dt], "DOMMouseScroll wheel", function (e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        ot(Je + 4 * e)
    }), E(It, "click", function (e) {
        this.classList.contains("open") ? dt() : (Ce.querySelector(".color-picker .brushmenu").classList.add("open"), Ce.querySelector(".color-picker .preview").classList.add("open"), at())
    }), E([c, De], "mousedown touchstart", function (e) {
        e.target != It && (Dt.contains(e.target) || dt())
    }), E(c, "keypress", function (e) {
        if ("Enter" == e.code) return ce.focus(), 0;
        if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != Ke) return 0;
        for (var t = 0; t < Le.length; t++)
            if (Le[t].hotkey.toLowerCase() == e.key) return it(Le[t].id), e.preventDefault(), 0;
        for (t = 0; t < Ie.length; t++)
            if (Ie[t].hotkey.toLowerCase() == e.key) return lt(Ie[t].id), e.preventDefault(), 0
    }), E(c, "touchmove", function (e) {
        Mt && Lt(e.touches[0].clientX)
    }), E(c, "touchend touchcancel", function (e) {
        Mt = !1
    }), E(De, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), E(De, "mousedown", function (e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != Ke || Rt(e.button, e.clientX, e.clientY, !0, -1)
    }), E(c, "mouseup", function (e) {
        e.preventDefault(), Yt(e.button), Mt = !1
    }), E(c, "mousemove", function (e) {
        Ot(e.clientX, e.clientY, !1, -1), Mt && Lt(e.clientX)
    });
    // TYPOMOD 
    // desc: add event handlers for typo features
    E(".avatar-customizer .container", "pointerdown", () => {
        Nn(typo.createFakeLobbyData()); // IDENTIFY x(typo.c()): .querySelector("#home").style.display = "none"
    });
    // TYPOEND
    var At = null;

    function Et(e, t, n, a) {
        var o = De.getBoundingClientRect(),
            e = Math.floor((e - o.left) / o.width * De.width),
            o = Math.floor((t - o.top) / o.height * De.height);
        a ? (Pe = n, Ue[0] = Fe[0] = e, Ue[1] = Fe[1] = o) : (Ue[0] = Fe[0], Ue[1] = Fe[1], Pe = n, Fe[0] = e, Fe[1] = o)
    }
    E(De, "touchstart", function (e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == At && (At = e[0].identitfier, Rt(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), E(De, "touchend touchcancel", function (e) {
        e.preventDefault(), Yt(Ke)
    }), E(De, "touchmove", function (e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == At) {
                Ot(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    });
    var Tt = !1,
        Nt = 0;
    setInterval(function () {
        Tt && (Ft(!1), Tt = !1)
    }, 1e3 / 90);

    function Ot(e, t, n, a) {
        Tt || (Tt = !0, Et(e, t, a, n))
    }

    function Rt(e, t, n, a, o) {
        Ee.length, Ke = e, Et(t, n, o, a), Ft(!0)
    }

    function Yt(e) {
        -1 == e || 0 != e && 2 != e || Ke != e || (Nt = Ee.length, Ye.push(Nt), At = null, Ke = -1)
    }

    function Ft(e) {
        if (fn.id == m && un == sn && -1 != Ke) {
            var t = 0 == Ke ? Xe : Be,
                n = null;
            if (e && (ze == ve && (o = t, r = Fe[0], l = Fe[1], n = [ge, o, r, l]), ze == ye)) {
                var a = function (e, t) {
                    for (var n = (t = Ae.getImageData(e, t, 1, 1)).data[0], a = t.data[1], o = t.data[2], r = 0; r < Ge.length; r++) {
                        var l = Ge[r],
                            i = l[0] - n,
                            c = l[1] - a,
                            l = l[2] - o;
                        if (0 == i && 0 == c && 0 == l) return r
                    }
                    // TYPOMOD
                    // desc: if color is not in array, convert to custom color
                    r = parseInt(typo.rgbToHex(n, a, o), 16) + 10000;
                    // TYPOEND
                    return r
                }(Fe[0], Fe[1]);
                return (0 == Ke ? ct : st)(a), void it(We)
            }
            ze == me && (e = Je, 0 <= Pe && (e = (Je - Se) * Ct(Pe, 0, 1) + Se), o = t, r = e, l = Ue[0], a = Ue[1], t = Fe[0], e = Fe[1], n = [pe, o, r, l, a, t, e]), null != n && bt(n)
        }
        var o, r, l
    }
    setInterval(() => {
        var e, t;
        ln && fn.id == m && un == sn && 0 < Ee.length - Te && (t = Ee.slice(Te, e = Te + 8), ln.emit("data", {
            id: oa,
            data: t
        }), Te = Math.min(e, Ee.length))
    }, 50), setInterval(function () {
        ln && fn.id == m && un != sn && Ne < Ee.length && (yt(kt(Ee[Ne])), Ne++)
    }, 3);
    var Ut = c.querySelector("#game-canvas .overlay"),
        Pt = c.querySelector("#game-canvas .overlay-content"),
        _t = c.querySelector("#game-canvas .overlay-content .text"),
        jt = c.querySelector("#game-canvas .overlay-content .words"),
        Ht = c.querySelector("#game-canvas .overlay-content .reveal"),
        Wt = c.querySelector("#game-canvas .overlay-content .result"),
        zt = -100,
        Xt = 0,
        Bt = void 0;

    function Gt(e, r, l) {
        let i = zt,
            c = Xt,
            s = e.top - i,
            d = e.opacity - c;
        if (Math.abs(s) < .001 && Math.abs(d) < .001) l && l();
        else {
            let a = void 0,
                o = 0;
            Bt = u.requestAnimationFrame(function e(t) {
                null == a && (a = t);
                var n = t - a;
                a = t, o = Math.min(o + n, r);
                t = o / r, n = (n = t) < .5 ? .5 * function (e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function (e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2), t = t * t * (3 - 2 * t);
                zt = i + s * n, Xt = c + d * t, Pt.style.top = zt + "%", Ut.style.opacity = Xt, o == r ? l && l() : Bt = u.requestAnimationFrame(e)
            })
        }
    }

    function Jt(e) {
        e.classList.add("show")
    }

    function Kt(e) {
        e.classList.remove("show")
    }

    function Vt(t) {
        switch (! function () {
            for (var e = 0; e < Pt.children.length; e++) Kt(Pt.children[e])
        }(), t.id) {
            case b:
                Jt(_t), _t.textContent = "Round " + (t.data + 1);
                break;
            case v:
                Jt(_t), _t.textContent = "Waiting for players...";
                break;
            case S:
                Jt(_t), _t.textContent = "Game starting in a few seconds...";
                break;
            case C:
                Jt(Ht), Ht.querySelector("p span.word").textContent = t.data.word, Ht.querySelector(".reason").textContent = y[t.data.reason];
                var e = Ht.querySelector(".player-container");
                O(e);
                for (var n = [], a = 0; a < t.data.scores.length; a += 3) {
                    var o = t.data.scores[a + 0],
                        r = (t.data.scores[a + 1], t.data.scores[a + 2]);
                    (c = da(o)) && n.push({
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
                Jt(Wt);
                let l = [Wt.querySelector(".podest-1"), Wt.querySelector(".podest-2"), Wt.querySelector(".podest-3"), Wt.querySelector(".ranks")];
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
                            player: da(t.data[e][0]),
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
                                let e = R(a[t].player.avatar, 96, 0 == o);
                                e.style.width = "96px", e.style.height = "96px", e.style.left = 16 * -(a.length - 1) + 32 * t + "px", 0 == o && (e.classList.add("winner"), e.style.animationDelay = -2.35 * t + "s"), n.appendChild(e)
                            }
                        }
                    }
                    var f = Math.min(5, r[3].length);
                    for (let n = 0; n < f; n++) {
                        var p = r[3][n];
                        let e = T("rank"),
                            t = R(p.player.avatar, 48, !1);
                        t.style.width = "48px", t.style.height = "48px", e.appendChild(t), e.appendChild(T("rank-name", "#" + (p.rank + 1) + " " + p.player.name)), e.appendChild(T("rank-score", p.player.score + " points")), l[3].appendChild(e)
                    }
                    0 < r[0].length ? (m = r[0].map(function (e) {
                        return e.player.name
                    }).join(", "), Wt.querySelector(".winner-name").textContent = 0 < r[0].length ? m : "<user left>", Wt.querySelector(".winner-text").textContent = 1 == r[0].length ? " is the winner!" : " are the winners!") : (Wt.querySelector(".winner-name").textContent = "", Wt.querySelector(".winner-text").textContent = "Nobody won!")
                } else Wt.querySelector(".winner-name").textContent = "", Wt.querySelector(".winner-text").textContent = "Nobody won!";
                break;
            case k:
                if (t.data.words) {
                    Jt(_t), Jt(jt), _t.textContent = "Choose a word", O(jt);
                    for (a = 0; a < t.data.words.length; a++) {
                        var g = T("word", t.data.words[a]);
                        g.index = a, E(g, "click", function () {
                            var e;
                            e = this.index, ln && ln.connected && fn.id == k && ln.emit("data", {
                                id: aa,
                                data: e
                            })
                        }), jt.appendChild(g)
                    }
                } else {
                    Jt(_t);
                    var m = (c = da(t.data.id)) ? c.name : "User";
                    _t.textContent = m + " is choosing a word!"
                }
        }
    }
    const Zt = 0,
        $t = 1,
        Qt = 2,
        en = 3,
        tn = 4,
        nn = 5,
        an = 6;

    function on(e, t) {
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
    var rn = function () {
        this.context = null, this.sounds = new Map, u.addEventListener("load", this.load.bind(this), !1)
    };
    rn.prototype.addSound = function (e, t) {
        this.sounds.set(e, new on(this, t))
    }, rn.prototype.loadSounds = function () {
        this.addSound(Zt, "/audio/roundStart.ogg"), this.addSound($t, "/audio/roundEndSuccess.ogg"), this.addSound(Qt, "/audio/roundEndFailure.ogg"), this.addSound(en, "/audio/join.ogg"), this.addSound(tn, "/audio/leave.ogg"), this.addSound(nn, "/audio/playerGuessed.ogg"), this.addSound(an, "/audio/tick.ogg")
    }, rn.prototype.playSound = function (e) {
        var t, n;
        null != this.context && ("running" == this.context.state ? null == this.context || I.audio_mute || !this.sounds.has(e) || (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.context.destination), n.start(0)) : this.context.resume().then(() => {
            this.playSound(e)
        }))
    }, rn.prototype.load = function () {
        try {
            u.AudioContext = u.AudioContext || u.webkitAudioContext, this.context = new AudioContext
        } catch (e) {
            return console.log("Error creating AudioContext."), void (this.context = null)
        }
        this.loadSounds()
    };
    v;
    var ln, cn = [],
        sn = 0,
        dn = -1,
        un = -1,
        hn = [],
        fn = {
            id: -1,
            time: 0,
            data: 0
        },
        pn = new rn,
        gn = void 0,
        mn = c.querySelector("#game-room"),
        yn = c.querySelector("#game-players"),
        vn = c.querySelector("#game-board"),
        Sn = yn.querySelector(".list"),
        bn = yn.querySelector(".footer"),
        kn = [c.querySelector("#game-round .round-current"), c.querySelector("#game-round .round-max")],
        Cn = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")],
        wn = c.querySelector("#home .container-name-lang input"),
        qn = c.querySelector("#home .container-name-lang select"),
        xn = c.querySelector("#home .panel .button-play"),
        Mn = c.querySelector("#home .panel .button-create"),
        e = c.querySelector("#home .panel .button-rooms");

    function Ln(e) {
        c.querySelector("#load").style.display = e ? "block" : "none"
    }

    function In(e, t, n, a) {
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

    function Dn(e, t) {
        pn.context.resume(), ln && ln.disconnect();
        let n = 0;
        (ln = a(e)).on("connect", function () {
            // TYPOMOD
            // desc: disconnect socket & leave lobby
            typo.disconnect = () => {
                if (ln) {
                    ln.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    ln.off("data");
                    ln.reconnect = false;
                    ln.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            // TYPOEND
            ln.on("joinerr", function (e) {
                _n(), Z(H, function (e) {
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
            }), ln.on("data", sa);
            var e = wn.value.split("#"),
                e = {
                    join: t,
                    name: e[0],
                    lang: qn.value,
                    code: e[1],
                    avatar: I.avatar
                };
            ln.emit("login", e)
        }), ln.on("reason", function (e) {
            n = e
        }), ln.on("disconnect", function () {
            switch (n) {
                case r:
                    Z(W, "You have been kicked!");
                    break;
                case x:
                    Z(W, "You have been banned!")
            }
            _n()
        }), ln.on("connect_error", e => {
            _n(), Z(H, e.message)
        })
    }

    function An(e) {
        e = "" != e ? "id=" + e : "lang=" + qn.value;
        le(), Ln(!0), In(location.origin + ":3000/play", e, function (e) {
            Ln(!1), e.success && Dn((e = e.data.split(","))[0], e[1])
        })
    }

    function En(e) {
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

    function Tn() {
        var e = K[z].querySelector(".filter select.lang").value,
            t = K[z].querySelector(".filter select.type").value;
        In(location.origin + ":3000/rooms", "lang=" + e + "&type=" + t, function (e) {
            e.success && oe(En(e.data))
        })
    }

    function Nn(e) {
        var t;
        pn.playSound(en), it(me, !0), ot(28), ct(2), st(0), vt(!0), O(se), c.querySelector("#home").style.display = "none", c.querySelector("#game").style.display = "flex", sn = e.me, c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, hn = t, On(), O(Sn), cn = [];
        for (var n = 0; n < e.users.length; n++) ua(e.users[n], !1);
        ma(), va(), zn(e.owner), Fn(e.state, !0)
    }

    function On() {
        c.querySelector("#game-room .lobby-name").textContent = hn[L.NAME], kn[1].textContent = hn[L.ROUNDS];
        for (var e, t = 0; t < ka.length; t++) {
            var n = ka[t];
            n.index && (n = hn[(e = n).index], "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }

    function Rn(e, t, n) {
        hn[e] = t, n && ln && ln.emit("data", {
            id: Zn,
            data: {
                id: e,
                val: t
            }
        }), On()
    }

    function Yn() {
        for (let e = 0; e < cn.length; e++) cn[e].score = 0;
        for (let e = 0; e < cn.length; e++) Sa(cn[e], !1), ba(cn[e], !1), ya(cn[e])
    }

    function Fn(e, t) {
        var n, a;
        if (n = fn = e, null != Bt && (u.cancelAnimationFrame(Bt), Bt = void 0), n.id == m || n.id == q ? Gt({
            top: -100,
            opacity: 0
        }, 700, function () {
            Ut.classList.remove("show")
        }) : Ut.classList.contains("show") ? Gt({
            top: -100,
            opacity: 1
        }, 700, function () {
            Vt(n), Gt({
                top: 0,
                opacity: 1
            }, 700)
        }) : (Ut.classList.add("show"), Vt(n), Gt({
            top: 0,
            opacity: 1
        }, 700)), a = e.time, La(), Ma = a, qa.textContent = Ma, xa = setInterval(function () {
            Ma = Math.max(0, Ma - 1), qa.textContent = Ma;
            var e = -1;
            fn.id == m && (e = Ca), fn.id == k && (e = wa), qa.style.animationName = Ma < e ? Ma % 2 == 0 ? "rot_left" : "rot_right" : "none", Ma < e && pn.playSound(an), Ma <= 0 && La()
        }, 1e3), Ce.classList.add("hidden"), He(), Pn(!1), e.id == q ? (Yn(), mn.style.display = "flex", vn.style.display = "none", yn.classList.add("room")) : (mn.style.display = "none", vn.style.display = "", yn.classList.remove("room")), ma(), e.id == b && (kn[0].textContent = e.data + 1, 0 == e.data && Yn()), e.id == C) {
            sn != un && Wn(e.data.word);
            for (var o = 0; o < e.data.scores.length; o += 3) {
                var r = e.data.scores[o + 0],
                    l = e.data.scores[o + 1],
                    r = (e.data.scores[o + 2], da(r));
                r && (r.score = l)
            }
            va();
            for (var i = !0, o = 0; o < cn.length; o++)
                if (cn[o].guessed) {
                    i = !1;
                    break
                } i ? pn.playSound(Qt) : pn.playSound($t), fe("The word was '" + e.data.word + "'", "", p, !0)
            // TYPOMOD
            // desc: log finished drawing
            document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
            // TYPOEND
        } else e.id != m && (Cn[0].textContent = "WAITING", Cn[0].classList.add("waiting"), Cn[1].style.display = "none", Cn[2].style.display = "none");
        if (e.id == m) {
            if (un = e.data.id, pn.playSound(Zt), vt(!0), e.data.drawCommands && (Ee = e.data.drawCommands), fe(da(un).name + " is drawing now!", "", d, !0), !t)
                for (o = 0; o < cn.length; o++) Sa(cn[o], !1);
            Cn[0].classList.remove("waiting"), un == sn ? (t = e.data.word, Cn[0].textContent = "DRAW THIS", Cn[1].style.display = "", Cn[2].style.display = "none", Cn[1].textContent = t, Ce.classList.remove("hidden"), He()) : (Pn(!0), jn(e.data.word), Hn(e.data.hints))
        } else {
            un = -1;
            for (o = 0; o < cn.length; o++) Sa(cn[o], !1)
        }
        for (o = 0; o < cn.length; o++) ba(cn[o], cn[o].id == un)
    }

    function Un(e) {
        ln && ln.connected && fn.id == m && (ln.emit("data", {
            id: Jn,
            data: e
        }), Pn(!1))
    }

    function Pn(e) {
        c.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function _n() {
        ln && ln.close(), ln = void 0, vt(), La(), cn = [], hn = [], fn = {
            id: un = dn = -1,
            time: sn = 0,
            data: 0
        }, c.querySelector("#home").style.display = "", c.querySelector("#game").style.display = "none"
    }

    function jn(e) {
        var t = 0 == e;
        Cn[0].textContent = t ? "WORD HIDDEN" : "GUESS THIS", Cn[1].style.display = "none", Cn[2].style.display = "", O(Cn[2]), Cn[2].hints = [], t && (e = 3);
        for (var n = 0; n < e; n++) Cn[2].hints[n] = T("hint", t ? "?" : "_"), Cn[2].appendChild(Cn[2].hints[n]);
        t || Cn[2].appendChild(T("word-length", e))
    }

    function Hn(e) {
        for (var t = Cn[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
                o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function Wn(e) {
        (!Cn[2].hints || Cn[2].hints.length < e.length) && jn(e.length);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        Hn(t)
    }

    function zn(e) {
        dn = e;
        for (var t = 0; t < cn.length; t++) F(cn[t].element, cn[t].id == dn), pa(cn[t], 0, cn[t].id == dn);
        ! function (t) {
            for (var n = 0; n < ka.length; n++) {
                let e = ka[n];
                e.element.disabled = t
            }
        }(sn != dn);
        e = da(dn);
        e && fe(e.name + " is now the lobby owner!", "", o, !0)
    }
    E(K[z].querySelectorAll(".filter select"), "change", Tn), E(K[z].querySelector("button.refresh"), "click", Tn);
    const Xn = 1,
        Bn = 2,
        Gn = 5,
        Jn = 8,
        Kn = 10,
        Vn = 11,
        Zn = 12,
        $n = 13,
        Qn = 14,
        ea = 15,
        ta = 16,
        na = 17,
        aa = 18,
        oa = 19,
        ra = 20,
        la = 21;
    const ia = 30;
    const ca = 32;

    function sa(e) {
        var t = e.id,
            n = e.data;
        switch (t) {
            case Kn:
                Nn(n);
                break;
            case Vn:
                Fn(n);
                break;
            case Zn:
                Rn(n.id, n.val, !1);
                break;
            case $n:
                Hn(n);
                break;
            case Qn:
                Ma = n;
                break;
            case Xn:
                // TYPOMOD
                // desc: send lobbydata
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                // TYPOEND
                fe(ua(n, !0).name + " joined the room!", "", h, !0), pn.playSound(en);
                break;
            case Bn:
                var a = function (e) {
                    for (var t = 0; t < cn.length; t++) {
                        var n = cn[t];
                        if (n.id == e) return cn.splice(t, 1), n.element.remove(), va(), ma(), n
                    }
                    return
                }(n.id);
                a && (fe(a.name + M[n.reason], "", f, !0), pn.playSound(tn));
                break;
            case Gn:
                var a = da(n[0]),
                    o = da(n[1]),
                    r = n[2],
                    l = n[3];
                a && o && fe("'" + a.name + "' is voting to kick '" + o.name + "' (" + r + "/" + l + ")", "", s, !0);
                break;
            case ea:
                var i = da(n.id);
                i && (fe(i.name + " guessed the word!", "", h, !0), Sa(i, !0), pn.playSound(nn), n.id == sn && Wn(n.word));
                break;
            case Jn:
                o = da(n.id);
                o && (r = o, l = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (i = T("icon")).style.backgroundImage = "url(/img/" + l + ")", fa(r, i), n.vote ? fe(o.name + " liked the drawing!", "", h, !0) : fe(o.name + " disliked the drawing!", "", f, !0));
                break;
            case na:
                zn(n);
                break;
            case ta:
                fe("'" + n + " is close!", "", s, !0);
                break;
            case ia:
                ha(da(n.id), n.msg);
                break;
            case ca:
                fe("Spam detected! You're sending messages too quickly.", "", f, !0);
                break;
            case oa:
                for (var c = 0; c < n.length; c++) bt(n[c]);
                break;
            case ra:
                vt(!0);
                break;
            case la:
                pt(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function da(e) {
        for (var t = 0; t < cn.length; t++) {
            var n = cn[t];
            if (n.id == e) return n
        }
    }

    function ua(e, t) {
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
        cn.push(n), I.filterChat && n.id != sn && he(n.name.slice()) != n.name && (n.name = "user");
        var a = n.id == sn ? n.name + " (You)" : n.name,
            o = T("info"),
            e = T("name", a);
        n.id == sn && e.classList.add("me"), o.appendChild(e), o.appendChild(T("rank", "#" + n.rank)), o.appendChild(T("score", n.score + " points")), n.element.appendChild(o);
        a = R(n.avatar);
        // TYPOMOD
        // desc: set ID to player to identify
        n.element.setAttribute("playerid", n.id);
        // TYPOEND
        n.element.drawing = T("drawing"), a.appendChild(n.element.drawing), n.element.appendChild(a), Sn.appendChild(n.element), E(n.element, "click", function () {
            gn = n, Z(j, n)
        });
        e = T("icons"), o = T("icon owner"), a = T("icon muted");
        return e.appendChild(o), e.appendChild(a), n.element.appendChild(e), n.element.icons = [o, a], Sa(n, n.guessed), t && ma(), n
    }

    function ha(e, t) {
        var n;
        e.muted || (n = e.id == un || e.guessed, sn != un && !da(sn).guessed && n || (t = he(t), fa(e, T("text", t)), fe(e.name, t, n ? "#7dad3f" : "#000")))
    }

    function fa(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = T("bubble"),
            a = T("content");
        a.appendChild(t), n.appendChild(T("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function () {
            e.bubble.remove(), e.bubble = void 0
        }, 1500)
    }

    function pa(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var ga = void 0;

    function ma() {
        var e = fn.id == q,
            t = e ? 112 : 48,
            n = Math.max(t, Sn.clientHeight);
        let a = Math.floor(n / t);
        e && (a *= 4);
        t = Math.ceil(cn.length / a);
        for (let e = 0; e < cn.length; e++) cn[e].page = Math.floor(e / a);
        e = c.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = cn.length, e[1].textContent = hn[L.SLOTS], null == ga ? ga = U(bn, t, [yn], function (e, n, t) {
            let a = [];
            for (let t = 0; t < cn.length; t++) {
                let e = cn[t];
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
        }) : P(ga, t), ga.element.style.display = 1 < t ? "" : "none"
    }

    function ya(t) {
        let n = 1;
        for (let e = 0; e < cn.length; e++) {
            var a = cn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n, t.element.querySelector(".score").textContent = t.score + " points";
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n, e.classList.remove("first"), e.classList.remove("second"), e.classList.remove("third"), 1 == n && e.classList.add("first"), 2 == n && e.classList.add("second"), 3 == n && e.classList.add("third")
    }

    function va() {
        for (var e = 0; e < cn.length; e++) ya(cn[e])
    }

    function Sa(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }

    function ba(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var ka = [];
    ! function () {
        for (var e = mn.querySelectorAll('*[id^="item-"]'), n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            ka.push(t), E(t.element, "change", function () {
                var e = "checkbox" == this.type ? this.checked : this.value;
                console.log("lobby setting " + t.id + " changed to " + e), null != t.index && Rn(t.index, e, !0)
            })
        }
    }();
    const Ca = 10,
        wa = 4;
    var qa = c.querySelector("#game-clock"),
        xa = null,
        Ma = 0;

    function La() {
        xa && (clearInterval(xa), xa = null)
    }
    var Ia, Da, Aa, Ea, Ta, rn = c.querySelector("#tutorial"),
        Na = rn.querySelectorAll(".page"),
        Oa = U(rn, Na.length, [rn.querySelector(".pages")], function (e, t, n) {
            n && clearInterval(Ra);
            for (let e = 0; e < Na.length; e++) Na[e].classList.remove("active");
            Na[t].classList.add("active")
        }),
        Ra = setInterval(function () {
            Oa.selected < 4 ? _(Oa, Oa.selected + 1, !0) : _(Oa, 0, !0)
        }, 3500);

    function Ya(e) {
        Ta.parts[e].classList.remove("bounce"), Ta.parts[e].offsetWidth, Ta.parts[e].classList.add("bounce")
    }
    E(u, "resize", ma), E([wn, qn], "change", A), E(xn, "click", function () {
        var e, t, n;
        An((e = u.location.href, n = "", e = e.split("?"), n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
    }), E(e, "click", function () {
        K[z].querySelector(".filter select.lang").value = qn.value;
        var e = K[z].querySelector(".filter select.type").value;
        In(location.origin + ":3000/rooms", "lang=" + qn.value + "&type=" + e, function (e) {
            e.success && Z(z, En(e.data))
        })
    }), E(Mn, "click", function () {
        le(), Ln(!0), In(location.origin + ":3000/create", "lang=" + qn.value, function (e) {
            Ln(!1), e.success && Dn((e = e.data.split(","))[0], e[1])
        })
    }), E(c.querySelector("#game-rate .like"), "click", function () {
        Un(1)
    }), E(c.querySelector("#game-rate .dislike"), "click", function () {
        Un(0)
    }), E(c.querySelector("#start-game"), "click", function () {
        if (ln) {
            let t = c.querySelector("#item-settings-customwords").value.split(","),
                e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++) t[e] = t[e].trim();
                e = t.join(",")
            }
            ln.emit("data", {
                id: 22,
                data: e
            })
        }
    }), E(c.querySelector("#copy-invite"), "click", function () {
        c.querySelector("#input-invite").select();
        try {
            var e = c.execCommand("copy") ? "successful" : "unsuccessful";
            console.log("Copying link was " + e)
        } catch (e) {
            console.log("Unable to copy link " + e)
        }
    }), E(K[j].querySelector("button.kick"), "click", function () {
        le(), null != gn && gn.id != sn && sn == dn && ln && ln.emit("data", {
            id: 3,
            data: gn.id
        })
    }), E(K[j].querySelector("button.ban"), "click", function () {
        le(), null != gn && gn.id != sn && sn == dn && ln && ln.emit("data", {
            id: 4,
            data: gn.id
        })
    }), E(K[j].querySelector("button.votekick"), "click", function () {
        le(), null != gn && gn.id != sn && ln && ln.emit("data", {
            id: Gn,
            data: gn.id
        })
    }), E(K[j].querySelector("button.mute"), "click", function () {
        null != gn && gn.id != sn && (gn.muted = !gn.muted, pa(gn, 1, gn.muted), gn.muted ? fe("You muted '" + gn.name + "'!", "", f, !0) : fe("You unmuted '" + gn.name + "'!", "", f, !0), ln && ln.emit("data", {
            id: 7,
            data: gn.id
        }), V(gn.muted))
    }), E(K[j].querySelector("button.report"), "click", function () {
        ln && null != gn && gn.id != sn && ln.emit("data", {
            id: 6,
            data: gn.id
        })
    }), E(ie, "submit", function (e) {
        return e.preventDefault(), ce.value && (ln && ln.connected ? ln.emit("data", {
            id: ia,
            data: ce.value
        }) : ha(da(sn), ce.value)), ie.reset(), !1
    }),
        function () {
            if (!u.localStorageAvailable) {
                var e = !1;
                if (void 0 !== n) try {
                    n.setItem("feature_test", "yes"), "yes" === n.getItem("feature_test") && (n.removeItem("feature_test"), e = !0)
                } catch (e) { }
                u.localStorageAvailable = e
            }
            u.localStorageAvailable ? (wn.value = D("name", ""), qn.value = function (e) {
                for (var t = c.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                    if (e.startsWith(t[n].value)) return t[n].value;
                return "en"
            }(D("lang", navigator.language)), I.audio_mute = 1 == D("audio", 0) ? 1 : 0, (e = n.getItem("ava")) && (I.avatar = JSON.parse(e)), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
        }(), Ia = (Ea = c.querySelector("#home .avatar-customizer")).querySelector(".container"), Da = Ea.querySelectorAll(".arrows.left .arrow"), Aa = Ea.querySelectorAll(".arrows.right .arrow"), Ea = Ea.querySelectorAll(".randomize"), (Ta = R(I.avatar, 96)).classList.add("fit"), Ia.appendChild(Ta), E(Da, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --I.avatar[e], I.avatar[e] < 0 && (I.avatar[e] = t[e] - 1), Ya(e), Y(Ta, I.avatar, 96), A()
        }), E(Aa, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            I.avatar[e] += 1, I.avatar[e] >= t[e] && (I.avatar[e] = 0), Ya(e), Y(Ta, I.avatar, 96), A()
        }), E(Ea, "click", function () {
            I.avatar[0] = Math.floor(Math.random() * t[0]), I.avatar[1] = Math.floor(Math.random() * t[1]), I.avatar[2] = Math.floor(Math.random() * t[2]), Ya(1), Ya(2), Y(Ta, I.avatar, 96), A()
        }),
        function () {
            Math.round(8 * Math.random());
            for (var e = c.querySelector("#home .logo-big .avatar-container"), t = 0; t < 8; t++) {
                var n = [0, 0, 0, 0];
                n[0] = t, n[1] = Math.round(100 * Math.random()) % i, n[2] = Math.round(100 * Math.random()) % g, n[3] = 1e3 * Math.random() < 70 ? Math.round(+Math.random()) : -1;
                n = R(n, 48);
                e.append(n)
            }
        }()
}(window, document, localStorage, io);