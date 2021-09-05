! function (u, c, n, a) {
    const s = "#CCCC00",
        d = "#3975CE",
        h = "#56CE27",
        f = "#CE4F0A",
        o = "#ffa844",
        p = d,
        l = 18,
        i = 52,
        m = 49,
        t = [l, i, m],
        y = 0,
        v = 1,
        S = 2,
        k = 0,
        b = 1,
        C = 2,
        q = 3,
        g = 4,
        w = 5,
        x = 6,
        M = 7;
    const L = 1,
        I = 2,
        r = {
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
            return { id: id, name: name.length != 0 ? name : (In.value.split("#")[0] != "" ? In.value.split("#")[0] : "Dummy"), avatar: avatar.length == 0 ? D.avatar : avatar, score: score, guessed: guessed };
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
                    An.dispatchEvent(new Event("click")); // IDENTIFY x.dispatchEvent: querySelector("#home .panel .button-play")
                    $n(false); // IDENTIFY x(false): querySelector("#load").style.display
                    document.dispatchEvent(new Event("joinedLobby"));
                }, timeoutdiff < 3000 ? 3000 - timeoutdiff : 0);
            });
            document.addEventListener("leaveLobby", () => {
                if (typo.disconnect) typo.disconnect();
                else Xn() | document.dispatchEvent(new Event("leftLobby")); // IDENTIFY x(): querySelector("#home").style.display = ""
            });
            document.addEventListener("setColor", (e) => {
                let rgb = typo.hexToRgb((e.detail.code - 10000).toString(16).padStart(6, "0"));
                let match = Ge.findIndex(color => color[0] == rgb[0] && color[1] == rgb[1] && color[2] == rgb[2]);
                let code = match >= 0 ? match : e.detail.code;
                if (e.detail.secondary) mt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-secondary").style.fill
                else pt(code); // IDENTIFY x(e.detail.code): querySelector("#color-preview-primary").style.fill
            });
            document.addEventListener("performDrawCommand", (e) => {
                Ye.push(e.detail); // IDENTIFY x.push(e.detail): .getContext("2d"), x = []
                qt(Lt(e.detail)); // IDENTIFY: x(y(e.detail)): bounds: AND Math.floor(Math.ceil
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
    var D = {
        avatar: [Math.round(100 * Math.random()) % l, Math.round(100 * Math.random()) % i, Math.round(100 * Math.random()) % m],
        audio_mute: 0,
        dark: 0,
        filterChat: 1
    };

    function A(e, t) {
        e = n.getItem(e);
        return null == e ? t : e
    }

    function E() {
        u.localStorageAvailable && (n.setItem("name", In.value), n.setItem("lang", Dn.value), n.setItem("audio", D.audio_mute ? 1 : 0), n.setItem("dark", D.dark ? 1 : 0), n.setItem("filter", D.filterChat ? 1 : 0), n.setItem("ava", JSON.stringify(D.avatar)), console.log("Settings saved."))
    }

    function $(e) {
        D.dark = e ? 1 : 0, c.documentElement.dataset.theme = D.dark ? "dark" : ""
    }

    function T(e, t, n) {
        var a, o = e;
        "string" == typeof e ? o = c.querySelectorAll(e) : "[object Array]" !== (a = Object.prototype.toString.call(e)) && "[object NodeList]" !== a && "[object HTMLCollection]" !== a && (o = [e]);
        for (var r = t.split(" "), l = 0; l < o.length; l++)
            for (var i = 0; i < r.length; i++) o[l].addEventListener(r[i], n)
    }

    function O(e, t) {
        for (var n = c.createElement("div"), a = e.split(" "), o = 0; o < a.length; o++) n.classList.add(a[o]);
        return void 0 !== t && (n.textContent = t), n
    }

    function N(e) {
        return parseFloat(getComputedStyle(e, null).width.replace("px", ""))
    }

    function R(e) {
        for (; e.firstChild;) e.removeChild(e.firstChild)
    }

    function Y(e, t, n) {
        var a = O("avatar"),
            o = O("color"),
            r = O("eyes"),
            l = O("mouth"),
            i = O("special"),
            c = O("owner");
        return c.style.display = n ? "block" : "none", a.appendChild(o), a.appendChild(r), a.appendChild(l), a.appendChild(i), a.appendChild(c), a.parts = [o, r, l], _(a, e, t || 48), a
    }

    function _(e, t, n) {
        function a(e, t, n, a) {
            var o = -t % n * 100,
                n = 100 * -Math.floor(t / n);
            e.style.backgroundPosition = o + "% " + n + "%"
        }
        var o = t[0] % l,
            r = t[1] % i,
            n = t[2] % m,
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
            element: O("dots"),
            dots: [],
            selected: 0,
            change: a
        };
        return e.appendChild(o.element), n.push(o.element), T(n, "DOMMouseScroll wheel", function (e) {
            var t;
            1 < o.dots.length && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), P(o, Math.min(o.dots.length - 1, Math.max(0, o.selected - t)), !0)), e.preventDefault(), e.stopPropagation()
        }), j(o, t), o
    }

    function j(n, e) {
        R(n.element), n.dots = [];
        for (let t = 0; t < e; t++) {
            let e = O("dot");
            e.appendChild(O("inner")), T(e, "click", function () {
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
    const W = 0,
        H = 1,
        z = 2,
        X = 3;
    const B = 5;
    var G = c.querySelector("#modal"),
        J = G.querySelector(".title .text"),
        K = G.querySelector(".content"),
        V = [];

    function Z(e) {
        V[W].querySelector(".buttons button.mute").textContent = ve(e ? "Unmute" : "Mute")
    }

    function Q(e, t) {
        G.style.display = "block";
        for (var n = 0; n < V.length; n++) V[n].style.display = "none";
        switch (V[e].style.display = "flex", e) {
            case H:
                J.textContent = ve("Something went wrong!"), V[H].querySelector(".message").textContent = t;
                break;
            case z:
                J.textContent = ve("Disconnected!"), V[z].querySelector(".message").textContent = t;
                break;
            case W:
                J.textContent = "";
                var a = V[W].querySelector(".buttons");
                a.style.display = t.id == fn ? "none" : "flex", a.querySelector(".button-pair").style.display = fn == pn ? "flex" : "none", Z(t.muted);
                var o = K.querySelector(".player");
                R(o);
                a = Y(t.avatar, 96);
                F(a, pn == t.id), a.style.width = "96px", a.style.height = "96px", o.appendChild(a), o.appendChild(O("name", t.id == fn ? ve("$ (You)", t.name) : t.name));
                break;
            case X:
                J.textContent = ve("Rooms"), le(t);
                break;
            case X:
                J.textContent = t.name;
                break;
            case B:
                J.textContent = ve("Settings")
        }
    }
    V[W] = G.querySelector(".container-player"), V[H] = G.querySelector(".container-info"), V[z] = G.querySelector(".container-info"), V[X] = G.querySelector(".container-rooms"), V[4] = G.querySelector(".container-room"), V[B] = G.querySelector(".container-settings");
    var ee = [],
        te = [],
        ne = 0,
        ae = 0,
        oe = V[X].querySelector(".rooms"),
        e = V[X].querySelector(".footer"),
        re = V[X].querySelector(".dots");

    function le(t) {
        ee = [], R(oe), R(re);
        for (let e = ae = ne = 0; e < t.length; e++) ! function (e) {
            console.log(e.settings[r.SLOTS]);
            let t = O("room");
            t.appendChild(O("name", e.settings[r.NAME])), t.appendChild(O("slots", e.users + "/" + e.settings[r.SLOTS])), t.appendChild(O("round", 0 < e.round ? e.round : ve("Not started"))), t.appendChild(O("settings", e.settings[r.DRAWTIME] + "s")), oe.appendChild(t), ee.push({
                element: t,
                page: 0,
                data: e
            }), T(t, "click", function () {
                Nn(e.id)
            })
        }(t[e]);
        ! function () {
            V[X].querySelector(".desc");
            if (0 < ee.length) {
                let n = 0,
                    a = 0;
                for (let t = 0; t < ee.length; t++) {
                    let e = ee[t];
                    e.page = a, n++, 10 <= n && (a++, n = 0)
                }
                if (ne = a + Math.ceil(n / 10), te = [], 1 < ne) {
                    re.style.display = "", R(re);
                    for (let e = 0; e < ne; e++) {
                        var t = O("dot");
                        re.appendChild(t), T(t, "click", function () {
                            ie(e)
                        }), te.push(t)
                    }
                    ie(ae)
                } else re.style.display = "none"
            } else oe.textContent = ve("No rooms found :(")
        }()
    }

    function ie(e) {
        ae = e;
        for (let t = 0; t < ee.length; t++) {
            let e = ee[t];
            e.element.style.display = e.page == ae ? "" : "none"
        }
        for (let e = 0; e < te.length; e++) te[e].classList.remove("active");
        te[e].classList.add("active")
    }

    function ce() {
        G.style.display = "none"
    }
    T([oe, e], "DOMMouseScroll wheel", function (e) {
        var t;
        1 < ne && (t = -e.deltaY || e.wheelDeltaY, t = Math.sign(t), ie(Math.min(ne - 1, Math.max(0, ae - t)))), e.preventDefault()
    }), T(u, "click", function (e) {
        e.target == G && ce()
    }), T([G.querySelector(".close"), V[H].querySelector("button.ok")], "click", ce);
    var se = c.querySelector("#game-chat form"),
        de = c.querySelector("#game-chat form input"),
        ue = c.querySelector("#game-chat .content");
    const he = ["neger", "negro", "nigger", "nigga", "cunt", "fuck", "fucker", "fucking", "fucked", "fucktard", "kill", "rape", "cock", "dick", "asshole", "slut", "whore", "semen", "fag", "faggot", "retard", "retarded", "arsch", "arschloch", "hurensohn", "fotze", "muschi", "schlampe", "pisser", "missgeburt", "nutte", "nuttensohn", "hundesohn", "hure", "ficker", "ficken", "fick", "spast", "spasti", "spastiker", "hailhitler", "heilhitler", "sieghail", "siegheil", "nazi"],
        fe = [
            ["i", "î", "1", "!", "|"],
            ["e", "3", "€", "³"],
            ["a", "4", "@"],
            ["o", "ö", "0"],
            ["g", "q"],
            ["s", "$"]
        ];

    function pe(e) {
        for (var t, n, a = e.toLocaleLowerCase("en-US"), o = 0; o < fe.length; o++)
            for (var r = fe[o], l = 1; l < r.length; l++) t = r[l], n = r[0], a = a.split(t).join(n);
        for (var a = a.replace(/[^A-Z^a-z0-9^가-힣]/g, "*"), i = "", c = [], o = 0; o < a.length; o++) {
            var s = a.charAt(o);
            "*" != s && (i += s, c.push(o))
        }
        for (o = 0; o < he.length; o++)
            for (var d = he[o], u = -1; - 1 != (u = i.indexOf(d, u + 1));) {
                var h = c[u],
                    f = c[u + d.length - 1],
                    p = d.length,
                    p = "*".repeat(p);
                e = e.slice(0, h) + p + e.slice(f + 1)
            }
        return e
    }

    function me(e, t, n, a) {
        var o = c.createElement("p"),
            r = c.createElement("b");
        r.textContent = a ? e : e + ": ", r.style.color = n, o.appendChild(r);
        r = c.createElement("span");
        r.textContent = t, r.style.color = n, o.appendChild(r);
        r = ue.scrollHeight - ue.scrollTop - ue.clientHeight <= 20;
        ue.appendChild(o), r && (ue.scrollTop = ue.scrollHeight + 100)
    }
    let ge = {};

    function ye(e, t) {
        e = e[t];
        return null != e && "" != e ? e : t
    }

    function ve(t, n) {
        var e = ye(ge, t);
        e == t ? console.log("No translation found for: " + t) : t = e;
        let a = "",
            o = 0;
        Array.isArray(n) || (n = [n]);
        for (let e = 0; e < t.length; e++) {
            var r = t.charAt(e);
            "$" == r ? (a += n[o], o++) : a += r
        }
        return a
    }
    let Se = [];
    ! function () {
        var t = c.querySelectorAll("[data-translate]");
        for (let e = 0; e < t.length; e++) {
            var n = t[e],
                a = n.dataset.translate;
            if ("text" == a && Se.push({
                key: n.textContent,
                element: n,
                type: a
            }), "placeholder" == a && Se.push({
                key: n.placeholder,
                element: n,
                type: a
            }), "children" == a)
                for (let e = 0; e < n.children.length; e++) Se.push({
                    key: n.children[e].textContent,
                    element: n.children[e],
                    type: "text"
                })
        }
        console.log([].join(",\n"))
    }(),
        function (n) {
            for (let t = 0; t < Se.length; t++) {
                let e = Se[t];
                var a = ye(n, e.key);
                "text" == e.type && (e.element.textContent = a), "placeholder" == e.type && (e.element.placeholder = a)
            }
        }(ge);
    const ke = 0,
        be = 1;
    const Ce = 0,
        qe = 1,
        we = 2;
    const xe = 4,
        Me = 40;
    var Le, Ie = c.querySelector("#game-toolbar"),
        De = Ie.querySelectorAll(".tools-container .tools")[0],
        Ae = Ie.querySelectorAll(".tools-container .tools")[1],
        Ee = (Le = Ie.querySelector(".tool")).parentElement.removeChild(Le);

    function $e(e, t, n) {
        var a = Ee.cloneNode(!0);
        a.toolIndex = t, a.querySelector(".icon").style.backgroundImage = "url(/img/" + n.graphic + ")", a.querySelector(".key").textContent = n.hotkey;
        n.id = t, n.element = a, e ? (a.addEventListener("click", function (e) {
            ht(this.toolIndex)
        }), Ae.appendChild(a), Oe[t] = n) : (a.addEventListener("click", function (e) {
            ft(this.toolIndex)
        }), De.appendChild(a), Te[t] = n)
    }
    var Te = [];
    $e(!1, Ce, {
        name: "Brush",
        hotkey: "B",
        graphic: "pen.gif",
        cursor: 0
    }), $e(!1, qe, {
        name: "Pick",
        hotkey: "V",
        graphic: "pick.gif",
        cursor: "url(/img/pick_cur.png) 7 36, default"
    }), $e(!1, we, {
        name: "Fill",
        hotkey: "F",
        graphic: "fill.gif",
        cursor: "url(/img/fill_cur.png) 7 38, default"
    });
    var Oe = [];
    $e(!0, 0, {
        name: "Undo",
        hotkey: "U",
        graphic: "undo.gif",
        action: function () {
            ! function () {
                {
                    var e;
                    0 < Pe.length && (Pe.pop(), 0 < Pe.length ? (kt(e = Pe[Pe.length - 1]), un && un.emit("data", {
                        id: ha,
                        data: e
                    })) : xt())
                }
            }()
        }
    }), $e(!0, 1, {
        name: "Clear",
        hotkey: "C",
        graphic: "clear.gif",
        action: function () {
            xt()
        }
    });
    var Ne = c.querySelector("#game-canvas canvas"),
        Re = Ne.getContext("2d"),
        Ye = [],
        _e = 0,
        Fe = 0,
        Ue = [],
        je = [0, 9999, 9999, 0, 0],
        Pe = [],
        We = [0, 0],
        He = [0, 0],
        ze = 0,
        Xe = c.createElement("canvas");
    Xe.width = Me + 2, Xe.height = Me + 2;
    var Be = Xe.getContext("2d");

    function Ge() {
        var e = Te[Ke].cursor;
        if (yn.id == g && mn == fn) {
            if (Ke == Ce) {
                var t = Xe.width,
                    n = et;
                if (n <= 0) return;
                // TYPOMOD
                // desc: cursor with custom color
                let rgbArr = Ve < 10000 ? Qe[Ve] : typo.hexToRgb((Ve - 10000).toString(16).padStart(6, "0"));
                Be.clearRect(0, 0, t, t), Be.fillStyle = vt(rgbArr), Be.beginPath(), Be.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), Be.fill(), Be.strokeStyle = "#FFF", Be.beginPath(), Be.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), Be.stroke(), Be.strokeStyle = "#000", Be.beginPath(), Be.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), Be.stroke();
                // TYPOEND
                // ORIGINAL Be.clearRect(0, 0, t, t), Be.fillStyle = vt(Qe[Ve]), Be.beginPath(), Be.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), Be.fill(), Be.strokeStyle = "#FFF", Be.beginPath(), Be.arc(t / 2, t / 2, n / 2 - 1, 0, 2 * Math.PI), Be.stroke(), Be.strokeStyle = "#000", Be.beginPath(), Be.arc(t / 2, t / 2, n / 2, 0, 2 * Math.PI), Be.stroke();
                t = t / 2, e = "url(" + Xe.toDataURL() + ")" + t + " " + t + ", default"
            }
        } else e = "default";
        Ne.style.cursor = e
    }
    for (var Je = 0, Ke = 0, Ve = 0, Ze = 0, Qe = [
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
    ], et = 0, tt = -1, nt = [], at = 6, ot = 0; ot < at; ot++) {
        var rt = ot / (at - 1),
            lt = 11 + 32 * (1 - rt),
            it = (xe, Me, xe, c.createElement("div"));
        it.classList.add("size");
        rt = c.createElement("div");
        rt.classList.add("icon"), rt.style.borderRadius = "100%", rt.style.left = lt + "%", rt.style.right = lt + "%", rt.style.top = lt + "%", rt.style.bottom = lt + "%", it.appendChild(rt), c.querySelector("#game-toolbar .color-picker .sizes").appendChild(it), nt.push([it, rt])
    }

    function ct(e) {
        for (var t = 0; t < at; t++) nt[t][1].style.backgroundColor = e
    }

    function st() {
        var e = (et - xe) / (Me - xe),
            t = N(Ie.querySelector(".slider .track")),
            n = N(Ie.querySelector(".slider")),
            n = ((n - t) / 2 + e * t) / n;
        Ie.querySelector(".slider .knob").style.left = 100 * e + "%", Ie.querySelector(".slider .bar-fill").style.width = 100 * n + "%";
        e = Ie.querySelector(".color-picker .preview .graphic .brush"), n = et + 10;
        e.style.width = n + "px", e.style.height = n + "px", Ie.querySelector(".color-picker .preview .size").textContent = et + "px"
    }

    function dt(e) {
        et = It(e, xe, Me), st(), Ge()
    }

    function ut(e) {
        e.classList.remove("clicked"), e.offsetWidth, e.classList.add("clicked")
    }

    function ht(e) {
        ut(Oe[e].element), Oe[e].action()
    }

    function ft(e, t) {
        ut(Te[e].element), e == Ke && !t || (Te[Je = Ke].element.classList.remove("selected"), Te[e].element.classList.add("selected"), Ke = e, Ge())
    }

    function pt(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            vt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            vt(Qe[e]);
        // TYPOEND
        // ORIGINAL var t = vt(Qe[e]);
        ct(t), Ve = e, c.querySelector("#color-preview-primary").style.fill = t, Ge()
    }

    function mt(e) {
        // TYPOMOD
        // desc: if color code > 10000 -> customcolor
        var t = e > 10000 ?
            vt(typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"))) :
            vt(Qe[e]);
        // TYPOEND
        // ORIGINAL var t = vt(Qe[e]);
        ct(t), Ze = e, c.querySelector("#color-preview-secondary").style.fill = t, Ge()
    }

    function gt() {
        Ie.querySelector(".color-picker .brushmenu").classList.remove("open"), Ie.querySelector(".color-picker .preview").classList.remove("open")
    }
    for (ot = 0; ot < Qe.length / 3; ot++) Ie.querySelector(".top").appendChild(yt(3 * ot)), Ie.querySelector(".mid").appendChild(yt(3 * ot + 1)), Ie.querySelector(".bottom").appendChild(yt(3 * ot + 2));

    function yt(e) {
        var t = O("item"),
            n = O("inner");
        return n.style.backgroundColor = vt(Qe[e]), t.appendChild(n), t.colorIndex = e, t
    }

    function vt(e) {
        return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
    }

    function St(e) {
        // TYPOMOD
        // desc: if color code > 1000 -> customcolor
        if (e < 10000) e = It(e, 0, Qe.length), e = Qe[e];
        else e = typo.hexToRgb((e - 10000).toString(16).padStart(6, "0"));
        // TYPOEND
        // ORIGINAL e = It(e, 0, Qe.length), e = Qe[e];
        return {
            r: e[0],
            g: e[1],
            b: e[2]
        }
    }

    function kt(e) {// TYPOMOD
        // desc: replace draw commands because of redo
        const keepCommands = Ye;
        // TYPOEND
        if (Ye = Ye.slice(0, e), !(fn != mn && Fe < e)) {
            je = Ct();
            e = Math.floor(Ye.length / bt);
            Ue = Ue.slice(0, e), Et();
            for (var t = 0; t < Ue.length; t++) {
                var n = Ue[t];
                Re.putImageData(n.data, n.bounds[1], n.bounds[2])
            }
            for (t = Ue.length * bt; t < Ye.length; t++) qt(Lt(Ye[t]));
            _e = Math.min(Ye.length, _e), Fe = Math.min(Ye.length, Fe)
        }
        // TYPOMOD 
        // log kept commands
        document.dispatchEvent(new CustomEvent("logRedo", { detail: keepCommands }));
        // TYPOEND
    }
    const bt = 200;

    function Ct() {
        return [0, 9999, 9999, 0, 0]
    }

    function qt(e) {
        var t, n, a;
        je[0] += 1, je[1] = Math.min(je[1], e[0]), je[2] = Math.min(je[2], e[1]), je[3] = Math.max(je[3], e[2]), je[4] = Math.max(je[4], e[3]), je[0] >= bt && (t = je[1], a = je[2], n = je[3], e = je[4], a = Re.getImageData(t, a, n - t, e - a), Ue.push({
            data: a,
            bounds: je
        }), je = Ct())
    }

    function wt(e) {
        return (e || 0 < Ye.length || 0 < Pe.length || 0 < _e || 0 < Fe) && (Ye = [], Pe = [], _e = Fe = 0, je = Ct(), Ue = [], Et(), 1)
    }

    function xt() {
        wt() && un && un.emit("data", {
            id: ua
        })
    }

    function Mt(e) {
        Ye.push(e), fn == mn && qt(Lt(e))
        // TYPOMOD
        // log draw commands
        document.dispatchEvent(new CustomEvent("logDrawCommand", { detail: e }));
        // TYPOEND
    }

    function Lt(e) {
        var t = [0, 0, Ne.width, Ne.height];
        switch (e[0]) {
            case ke:
                var n = It(Math.floor(e[2]), xe, Me),
                    a = Math.floor(Math.ceil(n / 2)),
                    o = It(Math.floor(e[3]), -a, Ne.width + a),
                    r = It(Math.floor(e[4]), -a, Ne.height + a),
                    l = It(Math.floor(e[5]), -a, Ne.width + a),
                    i = It(Math.floor(e[6]), -a, Ne.height + a),
                    c = St(e[1]);
                t[0] = It(o - a, 0, Ne.width), t[1] = It(r - a, 0, Ne.height), t[2] = It(l + a, 0, Ne.width), t[3] = It(i + a, 0, Ne.height), At(o, r, l, i, n, c.r, c.g, c.b);
                break;
            case be:
                c = St(e[1]);
                ! function (e, t, a, o, r) {
                    var l = Re.getImageData(0, 0, Ne.width, Ne.height),
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
                        for (var s, d, u, h, f, p, m = l.height, g = l.width; n.length;) {
                            for (s = n.pop(), d = s[0], u = s[1], h = 4 * (u * g + d); 0 <= u-- && c(h);) h -= 4 * g;
                            for (h += 4 * g, ++u, p = f = !1; u++ < m - 1 && c(h);) Dt(l, h, a, o, r), 0 < d && (c(h - 4) ? f || (n.push([d - 1, u]), f = !0) : f = f && !1), d < g - 1 && (c(h + 4) ? p || (n.push([d + 1, u]), p = !0) : p = p && !1), h += 4 * g
                        }
                        Re.putImageData(l, 0, 0)
                    }
                }(It(Math.floor(e[2]), 0, Ne.width), It(Math.floor(e[3]), 0, Ne.height), c.r, c.g, c.b)
        }
        return t
    }

    function It(e, t, n) {
        return e < t ? t : n < e ? n : e
    }

    function Dt(e, t, n, a, o) {
        0 <= t && t < e.data.length && (e.data[t] = n, e.data[t + 1] = a, e.data[t + 2] = o, e.data[t + 3] = 255)
    }

    function At(e, t, n, a, o, r, l, i) {
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
        var p = Re.getImageData(d, u, h - d, o - u);
        if (e == n && t == a) f(e, t);
        else {
            f(e, t), f(n, a);
            var m = Math.abs(n - e),
                g = Math.abs(a - t),
                y = e < n ? 1 : -1,
                v = t < a ? 1 : -1,
                S = m - g;
            for (Math.floor(Math.max(0, c - 10) / 5); e != n || t != a;) {
                var k = S << 1; - g < k && (S -= g, e += y), k < m && (S += m, t += v), f(e, t)
            }
        }
        Re.putImageData(p, d, u)
    }

    function Et() {
        // TYPOMOD
        // desc: log a canvas clear
        const data = document.querySelector("#game-canvas canvas").toDataURL();
        Re.fillStyle = "#FFF", Re.fillRect(0, 0, Ne.width, Ne.height)
        document.dispatchEvent(new CustomEvent("logCanvasClear", { detail: data }));
        // TYPOEND
        // ORIGINAL Re.fillStyle = "#FFF", Re.fillRect(0, 0, Ne.width, Ne.height)
    }
    var $t = !1;

    function Tt(e) {
        var t = c.querySelector("#game-toolbar .slider .track").getBoundingClientRect();
        dt(xe + Math.round(It((e - t.left) / t.width, 0, 1) * (Me - xe)))
    }
    T("#game-toolbar .slider", "mousedown", function (e) {
        0 == e.button && ($t = !0, Tt(e.clientX))
    }), T("#game-toolbar .slider", "touchstart", function (e) {
        $t = !0, Tt(e.touches[0].clientX)
    }), T(Ie, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), T("#game-toolbar .color-picker .colors * .item", "mousedown", function (e) {
        var t = this.colorIndex;
        0 == e.button ? (e.altKey ? mt : pt)(t) : 2 == e.button && mt(t)
    });
    var Ot = Ie.querySelector(".color-picker .preview"),
        Nt = Ie.querySelector(".color-picker .brushmenu");
    T([Ne, Ot, Nt], "DOMMouseScroll wheel", function (e) {
        e.preventDefault();
        e = -e.deltaY || e.wheelDeltaY, e = Math.sign(e);
        dt(et + 4 * e)
    }), T(Ot, "click", function (e) {
        this.classList.contains("open") ? gt() : (Ie.querySelector(".color-picker .brushmenu").classList.add("open"), Ie.querySelector(".color-picker .preview").classList.add("open"), st())
    }), T(c, "keypress", function (e) {
        if ("Enter" == e.code) return de.focus(), 0;
        if ("input" == c.activeElement.tagName.toLowerCase() || "textarea" == c.activeElement.tagName.toLowerCase() || -1 != tt) return 0;
        for (var t = 0; t < Te.length; t++)
            if (Te[t].hotkey.toLowerCase() == e.key) return ft(Te[t].id), e.preventDefault(), 0;
        for (t = 0; t < Oe.length; t++)
            if (Oe[t].hotkey.toLowerCase() == e.key) return ht(Oe[t].id), e.preventDefault(), 0
    }), T(c, "touchmove", function (e) {
        $t && Tt(e.touches[0].clientX)
    }), T(c, "touchend touchcancel", function (e) {
        $t = !1
    }), T(Ne, "contextmenu", function (e) {
        return e.preventDefault(), !1
    }), T(Ne, "mousedown", function (e) {
        e.preventDefault(), 0 != e.button && 2 != e.button || -1 != tt || Ut(e.button, e.clientX, e.clientY, !0, -1)
    }), T(c, "mouseup", function (e) {
        e.preventDefault(), jt(e.button), $t = !1
    }), T(c, "mousemove", function (e) {
        Ft(e.clientX, e.clientY, !1, -1), $t && Tt(e.clientX)
    });
    // TYPOMOD 
    // desc: add event handlers for typo features
    T(".avatar-customizer .container", "pointerdown", () => {
        _n(typo.createFakeLobbyData()); // IDENTIFY x(typo.c()): .querySelector("#home").style.display = "none"
    });
    // TYPOEND
    var Rt = null;

    function Yt(e, t, n, a) {
        var o = Ne.getBoundingClientRect(),
            e = Math.floor((e - o.left) / o.width * Ne.width),
            o = Math.floor((t - o.top) / o.height * Ne.height);
        a ? (ze = n, He[0] = We[0] = e, He[1] = We[1] = o) : (He[0] = We[0], He[1] = We[1], ze = n, We[0] = e, We[1] = o)
    }
    T(Ne, "touchstart", function (e) {
        e.preventDefault();
        e = e.changedTouches;
        0 < e.length && null == Rt && (Rt = e[0].identitfier, Ut(0, e[0].clientX, e[0].clientY, !0, e[0].force))
    }), T(Ne, "touchend touchcancel", function (e) {
        e.preventDefault(), jt(tt)
    }), T(Ne, "touchmove", function (e) {
        e.preventDefault();
        for (var t = e.changedTouches, n = 0; n < t.length; n++)
            if (t[n].identitfier == Rt) {
                Ft(t[n].clientX, t[n].clientY, !1, t[n].force);
                break
            }
    });
    var _t = 0;

    function Ft(e, t, n, a) {
        Yt(e, t, a, n), Pt(!1)
    }

    function Ut(e, t, n, a, o) {
        Ye.length, tt = e, Yt(t, n, o, a), Pt(!0)
    }

    function jt(e) {
        -1 == e || 0 != e && 2 != e || tt != e || (_t = Ye.length, Pe.push(_t), Rt = null, tt = -1)
    }

    function Pt(e) {
        if (yn.id == g && mn == fn && -1 != tt) {
            var t = 0 == tt ? Ve : Ze,
                n = null;
            if (e && (Ke == we && (o = t, r = We[0], l = We[1], n = [be, o, r, l]), Ke == qe)) {
                var a = function (e, t) {
                    for (var n = (t = Re.getImageData(e, t, 1, 1)).data[0], a = t.data[1], o = t.data[2], r = 0; r < Qe.length; r++) {
                        var l = Qe[r],
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
                }(We[0], We[1]);
                return (0 == tt ? pt : mt)(a), void ft(Je)
            }
            Ke == Ce && (e = et, 0 <= ze && (e = (et - xe) * It(ze, 0, 1) + xe), o = t, r = e, l = He[0], a = He[1], t = We[0], e = We[1], n = [ke, o, r, l, a, t, e]), null != n && Mt(n)
        }
        var o, r, l
    }
    setInterval(() => {
        var e, t;
        un && yn.id == g && mn == fn && 0 < Ye.length - _e && (t = Ye.slice(_e, e = _e + 8), un.emit("data", {
            id: da,
            data: t
        }), _e = Math.min(e, Ye.length))
    }, 50), setInterval(function () {
        un && yn.id == g && mn != fn && Fe < Ye.length && (qt(Lt(Ye[Fe])), Fe++)
    }, 3);
    var Wt = c.querySelector("#game-canvas .overlay"),
        Ht = c.querySelector("#game-canvas .overlay-content"),
        zt = c.querySelector("#game-canvas .overlay-content .text"),
        Xt = c.querySelector("#game-canvas .overlay-content .words"),
        Bt = c.querySelector("#game-canvas .overlay-content .reveal"),
        Gt = c.querySelector("#game-canvas .overlay-content .result"),
        Jt = -100,
        Kt = 0,
        Vt = void 0;

    function Zt(e, r, l) {
        let i = Jt,
            c = Kt,
            s = e.top - i,
            d = e.opacity - c;
        if (Math.abs(s) < .001 && Math.abs(d) < .001) l && l();
        else {
            let a = void 0,
                o = 0;
            Vt = u.requestAnimationFrame(function e(t) {
                null == a && (a = t);
                var n = t - a;
                a = t, o = Math.min(o + n, r);
                t = o / r, n = (n = t) < .5 ? .5 * function (e, t) {
                    return e * e * ((t + 1) * e - t)
                }(2 * n, 1.2 * 1.5) : .5 * (function (e, t) {
                    return e * e * ((t + 1) * e + t)
                }(2 * n - 2, 1.2 * 1.5) + 2), t = t * t * (3 - 2 * t);
                Jt = i + s * n, Kt = c + d * t, Ht.style.top = Jt + "%", Wt.style.opacity = Kt, o == r ? l && l() : Vt = u.requestAnimationFrame(e)
            })
        }
    }

    function Qt(e) {
        e.classList.add("show")
    }

    function en(t) {
        switch (! function () {
            for (var e = 0; e < Ht.children.length; e++) Ht.children[e].classList.remove("show")
        }(), t.id) {
            case C:
                Qt(zt), zt.textContent = ve("Round $", t.data + 1);
                break;
            case k:
                Qt(zt), zt.textContent = ve("Waiting for players...");
                break;
            case b:
                Qt(zt), zt.textContent = ve("Game starting in a few seconds...");
                break;
            case w:
                Qt(Bt), Bt.querySelector("p span.word").textContent = t.data.word, Bt.querySelector(".reason").textContent = function (e) {
                    switch (e) {
                        case y:
                            return ve("Everyone guessed the word!");
                        case S:
                            return ve("The drawer left the game!");
                        case v:
                            return ve("Time is up!");
                        default:
                            return "Error!"
                    }
                }(t.data.reason);
                var e = Bt.querySelector(".player-container");
                R(e);
                for (var n = [], a = 0; a < t.data.scores.length; a += 3) {
                    var o = t.data.scores[a + 0],
                        r = (t.data.scores[a + 1], t.data.scores[a + 2]);
                    (c = ya(o)) && n.push({
                        name: c.name,
                        score: r
                    })
                }
                n.sort(function (e, t) {
                    return t.score - e.score
                });
                for (a = 0; a < n.length; a++) {
                    var i = O("player"),
                        c = n[a];
                    i.appendChild(O("name", c.name));
                    var s = O("score", (0 < c.score ? "+" : "") + c.score);
                    c.score <= 0 && s.classList.add("zero"), i.appendChild(s), e.appendChild(i)
                }
                break;
            case x:
                Qt(Gt);
                let l = [Gt.querySelector(".podest-1"), Gt.querySelector(".podest-2"), Gt.querySelector(".podest-3"), Gt.querySelector(".ranks")];
                for (let e = 0; e < 4; e++) R(l[e]);
                if (0 < t.data.length) {
                    let r = [
                        [],
                        [],
                        [],
                        []
                    ];
                    for (let e = 0; e < t.data.length; e++) {
                        var d = {
                            player: ya(t.data[e][0]),
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
                            e.appendChild(O("rank-place", "#" + (o + 1))), e.appendChild(O("rank-name", u)), e.appendChild(O("rank-score", ve("$ points", h)));
                            let n = O("avatar-container");
                            e.appendChild(n), 0 == o && n.appendChild(O("trophy"));
                            for (let t = 0; t < a.length; t++) {
                                let e = Y(a[t].player.avatar, 96, 0 == o);
                                e.style.width = "96px", e.style.height = "96px", e.style.left = 16 * -(a.length - 1) + 32 * t + "px", 0 == o && (e.classList.add("winner"), e.style.animationDelay = -2.35 * t + "s"), n.appendChild(e)
                            }
                        }
                    }
                    var f = Math.min(5, r[3].length);
                    for (let n = 0; n < f; n++) {
                        var p = r[3][n];
                        let e = O("rank"),
                            t = Y(p.player.avatar, 48, !1);
                        t.style.width = "48px", t.style.height = "48px", e.appendChild(t), e.appendChild(O("rank-name", "#" + (p.rank + 1) + " " + p.player.name)), e.appendChild(O("rank-score", ve("$ points", p.player.score))), l[3].appendChild(e)
                    }
                    0 < r[0].length ? (g = r[0].map(function (e) {
                        return e.player.name
                    }).join(", "), Gt.querySelector(".winner-name").textContent = 0 < r[0].length ? g : "<user left>", Gt.querySelector(".winner-text").textContent = " " + (1 == r[0].length ? ve("is the winner!") : ve("are the winners!"))) : (Gt.querySelector(".winner-name").textContent = "", Gt.querySelector(".winner-text").textContent = ve("Nobody won!"))
                } else Gt.querySelector(".winner-name").textContent = "", Gt.querySelector(".winner-text").textContent = ve("Nobody won!");
                break;
            case q:
                if (t.data.words) {
                    Qt(zt), Qt(Xt), zt.textContent = ve("Choose a word"), R(Xt);
                    for (a = 0; a < t.data.words.length; a++) {
                        var m = O("word", t.data.words[a]);
                        m.index = a, T(m, "click", function () {
                            var e;
                            e = this.index, un && un.connected && yn.id == q && un.emit("data", {
                                id: sa,
                                data: e
                            })
                        }), Xt.appendChild(m)
                    }
                } else {
                    Qt(zt);
                    var g = (c = ya(t.data.id)) ? c.name : ve("User");
                    zt.textContent = ve("$ is choosing a word!", g)
                }
        }
    }
    const tn = 0,
        nn = 1,
        an = 2,
        on = 3,
        rn = 4,
        ln = 5,
        cn = 6;

    function sn(e, t) {
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
    var dn = function () {
        this.context = null, this.sounds = new Map, u.addEventListener("load", this.load.bind(this), !1)
    };
    dn.prototype.addSound = function (e, t) {
        this.sounds.set(e, new sn(this, t))
    }, dn.prototype.loadSounds = function () {
        this.addSound(tn, "/audio/roundStart.ogg"), this.addSound(nn, "/audio/roundEndSuccess.ogg"), this.addSound(an, "/audio/roundEndFailure.ogg"), this.addSound(on, "/audio/join.ogg"), this.addSound(rn, "/audio/leave.ogg"), this.addSound(ln, "/audio/playerGuessed.ogg"), this.addSound(cn, "/audio/tick.ogg")
    }, dn.prototype.playSound = function (e) {
        var t, n;
        null != this.context && ("running" == this.context.state ? null == this.context || D.audio_mute || !this.sounds.has(e) || (t = this.sounds.get(e)).loaded && ((n = this.context.createBufferSource()).buffer = t.buffer, n.connect(this.context.destination), n.start(0)) : this.context.resume().then(() => {
            this.playSound(e)
        }))
    }, dn.prototype.load = function () {
        try {
            u.AudioContext = u.AudioContext || u.webkitAudioContext, this.context = new AudioContext
        } catch (e) {
            return console.log("Error creating AudioContext."), void (this.context = null)
        }
        this.loadSounds()
    };
    k;
    var un, hn = [],
        fn = 0,
        pn = -1,
        mn = -1,
        gn = [],
        yn = {
            id: -1,
            time: 0,
            data: 0
        },
        vn = 0,
        Sn = new dn,
        kn = void 0,
        bn = c.querySelector("#game-room"),
        Cn = c.querySelector("#game-players"),
        qn = c.querySelector("#game-board"),
        wn = Cn.querySelector(".list"),
        xn = Cn.querySelector(".footer"),
        Mn = c.querySelector("#game-round"),
        Ln = [c.querySelector("#game-word .description"), c.querySelector("#game-word .word"), c.querySelector("#game-word .hints .container")],
        In = c.querySelector("#home .container-name-lang input"),
        Dn = c.querySelector("#home .container-name-lang select"),
        An = c.querySelector("#home .panel .button-play"),
        En = c.querySelector("#home .panel .button-create"),
        e = c.querySelector("#home .panel .button-rooms");

    function $n(e) {
        c.querySelector("#load").style.display = e ? "block" : "none"
    }

    function Tn(e, t, n, a) {
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
                    a && Q(H, "Servers are currently undergoing maintenance!\n\rPlease try again later!");
                    break;
                default:
                    a && Q(H, "An unknown error occurred (" + e + ")\n\rPlease try again later!")
            }
            n({
                success: !1,
                error: e
            })
        }, (t = new XMLHttpRequest).onreadystatechange = function () {
            4 == this.readyState && (console.log(this.responseText), r(this.status, this.response))
        }, t.open("POST", o, !0), t.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), t.send(e)
    }

    function On(e, t) {
        Sn.context.resume(), un && un.disconnect();
        let n = 0;
        (un = a(e)).on("connect", function () {
            // TYPOMOD
            // desc: disconnect socket & leave lobby
            typo.disconnect = () => {
                if (rn) {
                    un.on("disconnect", () => {
                        typo.disconnect = undefined;
                        document.dispatchEvent(new Event("leftLobby"));
                    });
                    un.off("data");
                    un.reconnect = false;
                    un.disconnect();
                }
                else document.dispatchEvent(new Event("leftLobby"));
            }
            // TYPOEND
            un.on("joinerr", function (e) {
                Xn(), Q(H, function (e) {
                    switch (e) {
                        case 1:
                            return ve("Room not found!");
                        case 2:
                            return ve("Room is full!");
                        case 3:
                            return ve("You are on a kick cooldown!");
                        case 4:
                            return ve("You are banned from this room!");
                        default:
                            return ve("An unknown error ('$') occured!", e)
                    }
                }(e))
            }), un.on("data", ga);
            var e = In.value.split("#"),
                e = {
                    join: t,
                    name: e[0],
                    lang: Dn.value,
                    code: e[1],
                    avatar: D.avatar
                };
            un.emit("login", e)
        }), un.on("reason", function (e) {
            n = e
        }), un.on("disconnect", function () {
            switch (n) {
                case L:
                    Q(z, ve("You have been kicked!"));
                    break;
                case I:
                    Q(z, ve("You have been banned!"))
            }
            Xn()
        }), un.on("connect_error", e => {
            Xn(), Q(H, e.message)
        })
    }

    function Nn(e) {
        e = "" != e ? "id=" + e : "lang=" + Dn.value;
        ce(), $n(!0), Tn(location.origin + ":3000/play", e, function (e) {
            $n(!1), e.success && On((e = e.data.split(","))[0], e[1])
        })
    }

    function Rn(e) {
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

    function Yn() {
        var e = V[X].querySelector(".filter select.lang").value,
            t = V[X].querySelector(".filter select.type").value;
        Tn(location.origin + ":3000/rooms", "lang=" + e + "&type=" + t, function (e) {
            e.success && le(Rn(e.data))
        })
    }

    function _n(e) {
        var t;
        Sn.playSound(on), ft(Ce, !0), dt(28), pt(2), mt(0), wt(!0), R(ue), c.querySelector("#home").style.display = "none", c.querySelector("#game").style.display = "flex", fn = e.me, c.querySelector("#input-invite").value = "https://skribbl.io/?" + e.id, t = e.settings, gn = t, Fn(), R(wn), hn = [];
        for (var n = 0; n < e.users.length; n++) va(e.users[n], !1);
        qa(), xa(), jn(e.round), Kn(e.owner), Wn(e.state, !0)
    }

    function Fn() {
        c.querySelector("#game-room .lobby-name").textContent = gn[r.NAME], jn(vn);
        for (var e, t = 0; t < Ia.length; t++) {
            var n = Ia[t];
            n.index && (n = gn[(e = n).index], "checkbox" == e.element.type ? e.element.checked = !!n : e.element.value = n)
        }
    }

    function Un(e, t, n) {
        gn[e] = t, n && un && un.emit("data", {
            id: aa,
            data: {
                id: e,
                val: t
            }
        }), Fn()
    }

    function jn(e) {
        vn = e, Mn.textContent = ve("Round $ of $", [vn + 1, gn[r.ROUNDS]])
    }

    function Pn() {
        for (let e = 0; e < hn.length; e++) hn[e].score = 0;
        for (let e = 0; e < hn.length; e++) Ma(hn[e], !1), La(hn[e], !1), wa(hn[e])
    }

    function Wn(e, t) {
        var n, a;
        if (n = yn = e, null != Vt && (u.cancelAnimationFrame(Vt), Vt = void 0), n.id == g || n.id == M ? Zt({
            top: -100,
            opacity: 0
        }, 700, function () {
            Wt.classList.remove("show")
        }) : Wt.classList.contains("show") ? Zt({
            top: -100,
            opacity: 1
        }, 700, function () {
            en(n), Zt({
                top: 0,
                opacity: 1
            }, 700)
        }) : (Wt.classList.add("show"), en(n), Zt({
            top: 0,
            opacity: 1
        }, 700)), a = e.time, Oa(), Ta = a, Ea.textContent = Ta, $a = setInterval(function () {
            Ta = Math.max(0, Ta - 1), Ea.textContent = Ta;
            var e = -1;
            yn.id == g && (e = Da), yn.id == q && (e = Aa), Ea.style.animationName = Ta < e ? Ta % 2 == 0 ? "rot_left" : "rot_right" : "none", Ta < e && Sn.playSound(cn), Ta <= 0 && Oa()
        }, 1e3), Ie.classList.add("hidden"), Ge(), zn(!1), e.id == M ? (Pn(), bn.style.display = "flex", qn.style.display = "none", Cn.classList.add("room")) : (bn.style.display = "none", qn.style.display = "", Cn.classList.remove("room")), qa(), e.id == C && (jn(e.data), 0 == e.data && Pn()), e.id == w) {
            fn != mn && Jn(e.data.word);
            for (var o = 0; o < e.data.scores.length; o += 3) {
                var r = e.data.scores[o + 0],
                    l = e.data.scores[o + 1],
                    r = (e.data.scores[o + 2], ya(r));
                r && (r.score = l)
            }
            xa();
            for (var i = !0, o = 0; o < hn.length; o++)
                if (hn[o].guessed) {
                    i = !1;
                    break
                } i ? Sn.playSound(an) : Sn.playSound(nn), me(ve("The word was '$'", e.data.word), "", p, !0)
            // TYPOMOD
            // desc: log finished drawing
            document.dispatchEvent(new CustomEvent("drawingFinished", { detail: e.data.word }));
            // TYPOEND
        } else e.id != g && (Ln[0].textContent = ve("WAITING"), Ln[0].classList.add("waiting"), Ln[1].style.display = "none", Ln[2].style.display = "none");
        if (e.id == g) {
            if (mn = e.data.id, Sn.playSound(tn), wt(!0), e.data.drawCommands && (Ye = e.data.drawCommands), me(ve("$ is drawing now!", ya(mn).name), "", d, !0), !t)
                for (o = 0; o < hn.length; o++) Ma(hn[o], !1);
            Ln[0].classList.remove("waiting"), mn == fn ? (t = e.data.word, Ln[0].textContent = ve("DRAW THIS"), Ln[1].style.display = "", Ln[2].style.display = "none", Ln[1].textContent = t, Ie.classList.remove("hidden"), Ge()) : (zn(!0), Bn(e.data.word), Gn(e.data.hints))
        } else {
            mn = -1;
            for (o = 0; o < hn.length; o++) Ma(hn[o], !1)
        }
        for (o = 0; o < hn.length; o++) La(hn[o], hn[o].id == mn)
    }

    function Hn(e) {
        un && un.connected && yn.id == g && (un.emit("data", {
            id: ea,
            data: e
        }), zn(!1))
    }

    function zn(e) {
        c.querySelector("#game-rate").style.display = e ? "" : "none"
    }

    function Xn() {
        un && un.close(), un = void 0, wt(), Oa(), hn = [], gn = [], yn = {
            id: mn = pn = -1,
            time: fn = 0,
            data: 0
        }, c.querySelector("#home").style.display = "", c.querySelector("#game").style.display = "none"
    }

    function Bn(t) {
        let n = t.length - 1;
        for (let e = 0; e < t.length; e++) n += t[e];
        var e = 1 == gn[r.WORDMODE];
        Ln[0].textContent = ve(e ? "WORD HIDDEN" : "GUESS THIS"), Ln[1].style.display = "none", Ln[2].style.display = "", R(Ln[2]), Ln[2].hints = [], e && (n = 3);
        for (var a = 0; a < n; a++) Ln[2].hints[a] = O("hint", e ? "?" : "_"), Ln[2].appendChild(Ln[2].hints[a]);
        e || Ln[2].appendChild(O("word-length", t.join(" ")))
    }

    function Gn(e) {
        for (var t = Ln[2].hints, n = 0; n < e.length; n++) {
            var a = e[n][0],
                o = e[n][1];
            t[a].textContent = o, t[a].classList.add("uncover")
        }
    }

    function Jn(e) {
        (!Ln[2].hints || Ln[2].hints.length < e.length) && Bn([e.length]);
        for (var t = [], n = 0; n < e.length; n++) t.push([n, e.charAt(n)]);
        Gn(t)
    }

    function Kn(e) {
        pn = e;
        for (var t = 0; t < hn.length; t++) F(hn[t].element, hn[t].id == pn), ba(hn[t], 0, hn[t].id == pn);
        ! function (t) {
            for (var n = 0; n < Ia.length; n++) {
                let e = Ia[n];
                e.element.disabled = t
            }
        }(fn != pn);
        e = ya(pn);
        e && me(ve("$ is now the room owner!", e.name), "", o, !0)
    }
    T(V[X].querySelectorAll(".filter select"), "change", Yn), T(V[X].querySelector("button.refresh"), "click", Yn);
    const Vn = 1,
        Zn = 2,
        Qn = 5,
        ea = 8,
        ta = 10,
        na = 11,
        aa = 12,
        oa = 13,
        ra = 14,
        la = 15,
        ia = 16,
        ca = 17,
        sa = 18,
        da = 19,
        ua = 20,
        ha = 21;
    const fa = 30,
        pa = 31,
        ma = 32;

    function ga(e) {
        var t = e.id,
            n = e.data;
        switch (t) {
            case ta:
                _n(n);
                Tn(n);
                // TYPOMOD
                // desc: send lobbydata
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: e.data }));
                // TYPOEND
                break;
            case na:
                Wn(n);
                break;
            case aa:
                Un(n.id, n.val, !1);
                break;
            case oa:
                Gn(n);
                break;
            case ra:
                Ta = n;
                break;
            case Vn:
                me(ve("$ joined the room!", va(n, !0).name), "", h, !0), Sn.playSound(on);
                break;
            case Zn:
                var a = function (e) {
                    for (var t = 0; t < hn.length; t++) {
                        var n = hn[t];
                        if (n.id == e) return hn.splice(t, 1), n.element.remove(), xa(), qa(), n
                    }
                    return
                }(n.id);
                a && (me(function (e, t) {
                    switch (e) {
                        default:
                            return ve("$ left the room!", t);
                        case L:
                            return ve("$ has been kicked!", t);
                        case I:
                            return ve("$ has been banned!", t)
                    }
                }(n.reason, a.name), "", f, !0), Sn.playSound(rn));
                break;
            case Qn:
                var a = ya(n[0]),
                    o = ya(n[1]),
                    r = n[2],
                    l = n[3];
                a && o && me(ve("$ is voting to kick $ ($/$)", [a.name, o.name, r, l]), "", s, !0);
                break;
            case la:
                var i = ya(n.id);
                i && (me(ve("$ guessed the word!", i.name), "", h, !0), Ma(i, !0), Sn.playSound(ln), n.id == fn && Jn(n.word));
                break;
            case ea:
                o = ya(n.id);
                o && (r = o, l = 0 == n.vote ? "thumbsdown.gif" : "thumbsup.gif", (i = O("icon")).style.backgroundImage = "url(/img/" + l + ")", ka(r, i), n.vote ? me(ve("$ liked the drawing!", o.name), "", h, !0) : me(ve("$ disliked the drawing!", o.name), "", f, !0));
                break;
            case ca:
                Kn(n);
                break;
            case ia:
                me(ve("$ is close!", n), "", s, !0);
                break;
            case fa:
                Sa(ya(n.id), n.msg);
                break;
            case ma:
                me(ve("Spam detected! You're sending messages too quickly."), "", f, !0);
                break;
            case pa:
                switch (n.id) {
                    case 0:
                        me(ve("You need at least 2 players to start the game!"), "", f, !0);
                        break;
                    case 100:
                        me(ve("Server restarting in about $ seconds!", n.data), "", f, !0)
                }
                break;
            case da:
                for (var c = 0; c < n.length; c++) Mt(n[c]);
                break;
            case ua:
                wt(!0);
                break;
            case ha:
                kt(n);
                break;
            default:
                return void console.log("Unimplemented data packed received with id " + t)
        }
    }

    function ya(e) {
        for (var t = 0; t < hn.length; t++) {
            var n = hn[t];
            if (n.id == e) return n
        }
    }

    function va(e, t) {
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
            element: O("player"),
            bubble: void 0
        };
        hn.push(n), D.filterChat && n.id != fn && pe(n.name.slice()) != n.name && (n.name = "user");
        var a = n.id == fn ? ve("$ (You)", n.name) : n.name,
            o = O("info"),
            e = O("name", a);
        n.id == fn && e.classList.add("me"), o.appendChild(e), o.appendChild(O("rank", "#" + n.rank)), o.appendChild(O("score", ve("$ points", n.score))), n.element.appendChild(o);
        a = Y(n.avatar);
        // TYPOMOD
        // desc: set ID to player to identify
        n.element.setAttribute("playerid", n.id);
        // TYPOEND
        n.element.drawing = O("drawing"), a.appendChild(n.element.drawing), n.element.appendChild(a), wn.appendChild(n.element), T(n.element, "click", function () {
            kn = n, Q(W, n)
        });
        e = O("icons"), o = O("icon owner"), a = O("icon muted");
        return e.appendChild(o), e.appendChild(a), n.element.appendChild(e), n.element.icons = [o, a], Ma(n, n.guessed), t && qa(), n
    }

    function Sa(e, t) {
        var n;
        e.muted || (n = e.id == mn || e.guessed, fn != mn && !ya(fn).guessed && n || (t = pe(t), ka(e, O("text", t)), me(e.name, t, n ? "#7dad3f" : "#000")))
    }

    function ka(e, t) {
        e.bubble && (clearTimeout(e.bubble.timeout), e.bubble.remove(), e.bubble = void 0);
        var n = O("bubble"),
            a = O("content");
        a.appendChild(t), n.appendChild(O("arrow")), n.appendChild(a), e.element.appendChild(n), e.bubble = n, e.bubble.timeout = setTimeout(function () {
            e.bubble.remove(), e.bubble = void 0
        }, 1500)
    }

    function ba(e, t, n) {
        n ? e.element.icons[t].classList.add("visible") : e.element.icons[t].classList.remove("visible")
    }
    var Ca = void 0;

    function qa() {
        var e = yn.id == M,
            t = e ? 112 : 48,
            n = Math.max(t, wn.clientHeight);
        let a = Math.floor(n / t);
        e && (a *= 4);
        t = Math.ceil(hn.length / a);
        for (let e = 0; e < hn.length; e++) hn[e].page = Math.floor(e / a);
        e = c.querySelectorAll("#game-players .player-amount b");
        e[0].textContent = hn.length, e[1].textContent = gn[r.SLOTS], null == Ca ? Ca = U(xn, t, [Cn], function (e, n, t) {
            let a = [];
            for (let t = 0; t < hn.length; t++) {
                let e = hn[t];
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
        }) : j(Ca, t), Ca.element.style.display = 1 < t ? "" : "none"
    }

    function wa(t) {
        let n = 1;
        for (let e = 0; e < hn.length; e++) {
            var a = hn[e];
            a.id != t.id && t.score < a.score && n++
        }
        t.rank = n, t.element.querySelector(".score").textContent = ve("$ points", t.score);
        let e = t.element.querySelector(".rank");
        e.textContent = "#" + n, e.classList.remove("first"), e.classList.remove("second"), e.classList.remove("third"), 1 == n && e.classList.add("first"), 2 == n && e.classList.add("second"), 3 == n && e.classList.add("third")
    }

    function xa() {
        for (var e = 0; e < hn.length; e++) wa(hn[e])
    }

    function Ma(e, t) {
        (e.guessed = t) ? e.element.classList.add("guessed") : e.element.classList.remove("guessed")
    }

    function La(e, t) {
        e.element.drawing.style.display = t ? "block" : "none"
    }
    var Ia = [];
    ! function () {
        for (var e = bn.querySelectorAll('*[id^="item-"]'), n = 0; n < e.length; n++) {
            let t = {
                id: e[n].id.replace("item-settings-", ""),
                element: e[n],
                index: e[n].dataset.setting
            };
            Ia.push(t), T(t.element, "change", function () {
                var e = "checkbox" == this.type ? this.checked : this.value;
                null != t.index && Un(t.index, e, !0)
            })
        }
    }();
    const Da = 10,
        Aa = 4;
    var Ea = c.querySelector("#game-clock"),
        $a = null,
        Ta = 0;

    function Oa() {
        $a && (clearInterval($a), $a = null)
    }
    var Na, Ra, Ya, _a, Fa, dn = c.querySelector("#tutorial"),
        Ua = dn.querySelectorAll(".page"),
        ja = U(dn, Ua.length, [dn.querySelector(".pages")], function (e, t, n) {
            n && clearInterval(Pa);
            for (let e = 0; e < Ua.length; e++) Ua[e].classList.remove("active");
            Ua[t].classList.add("active")
        }),
        Pa = setInterval(function () {
            ja.selected < 4 ? P(ja, ja.selected + 1, !0) : P(ja, 0, !0)
        }, 3500),
        Wa = c.querySelector("#setting-bar"),
        Ha = c.querySelector("#audio"),
        za = c.querySelector("#lightbulb");

    function Xa() {
        Wa.classList.remove("open")
    }

    function Ba(e, t) {
        t ? e.classList.add("off") : e.classList.remove("off")
    }

    function Ga(e) {
        Fa.parts[e].classList.remove("bounce"), Fa.parts[e].offsetWidth, Fa.parts[e].classList.add("bounce")
    }
    T(Wa.querySelector(".icon"), "click", function (e) {
        Ba(Ha, D.audio_mute), Ba(za, D.dark), Wa.classList.contains("open") ? Xa() : Wa.classList.add("open")
    }), T("#audio", "click", function (e) {
        D.audio_mute = !D.audio_mute, Ba(Ha, D.audio_mute), E()
    }), T("#lightbulb", "click", function (e) {
        $(!D.dark), Ba(za, D.dark), E()
    }), T("#audio", "click", function (e) { }), T([c, Ne], "mousedown touchstart", function (e) {
        Wa.contains(e.target) || Xa(), e.target != Ot && (Nt.contains(e.target) || gt())
    }), T(u, "resize", qa), T([In, Dn], "change", E), T(An, "click", function () {
        var e, t, n;
        Nn((e = u.location.href, n = "", e = e.split("?"), n = 1 < e.length ? (n = "" + e[1]).substring(0, t) : n))
    }), T(e, "click", function () {
        ce(), $n(!0), V[X].querySelector(".filter select.lang").value = Dn.value;
        var e = V[X].querySelector(".filter select.type").value;
        Tn(location.origin + ":3000/rooms", "lang=" + Dn.value + "&type=" + e, function (e) {
            $n(!1), e.success && Q(X, Rn(e.data))
        })
    }), T(En, "click", function () {
        ce(), $n(!0), Tn(location.origin + ":3000/create", "lang=" + Dn.value, function (e) {
            $n(!1), e.success && On((e = e.data.split(","))[0], e[1])
        })
    }), T(c.querySelector("#game-rate .like"), "click", function () {
        Hn(1)
    }), T(c.querySelector("#game-rate .dislike"), "click", function () {
        Hn(0)
    }), T(c.querySelector("#start-game"), "click", function () {
        if (un) {
            let t = c.querySelector("#item-settings-customwords").value.split(","),
                e = "";
            if (5 <= t.length) {
                for (let e = 0; e < t.length; e++) t[e] = t[e].trim();
                e = t.join(",")
            }
            un.emit("data", {
                id: 22,
                data: e
            })
        }
    }), T(c.querySelector("#copy-invite"), "click", function () {
        c.querySelector("#input-invite").select();
        try {
            var e = c.execCommand("copy") ? "successful" : "unsuccessful";
            console.log("Copying link was " + e)
        } catch (e) {
            console.log("Unable to copy link " + e)
        }
    }), T(V[W].querySelector("button.kick"), "click", function () {
        ce(), null != kn && kn.id != fn && fn == pn && un && un.emit("data", {
            id: 3,
            data: kn.id
        })
    }), T(V[W].querySelector("button.ban"), "click", function () {
        ce(), null != kn && kn.id != fn && fn == pn && un && un.emit("data", {
            id: 4,
            data: kn.id
        })
    }), T(V[W].querySelector("button.votekick"), "click", function () {
        ce(), null != kn && kn.id != fn && un && un.emit("data", {
            id: Qn,
            data: kn.id
        })
    }), T(V[W].querySelector("button.mute"), "click", function () {
        null != kn && kn.id != fn && (kn.muted = !kn.muted, ba(kn, 1, kn.muted), kn.muted ? me(ve("You muted '$'!", kn.name), "", f, !0) : me(ve("You unmuted '$'!", kn.name), "", f, !0), un && un.emit("data", {
            id: 7,
            data: kn.id
        }), Z(kn.muted))
    }), T(V[W].querySelector("button.report"), "click", function () {
        un && null != kn && kn.id != fn && un.emit("data", {
            id: 6,
            data: kn.id
        })
    }), T(se, "submit", function (e) {
        return e.preventDefault(), de.value && (un && un.connected ? un.emit("data", {
            id: fa,
            data: de.value
        }) : Sa(ya(fn), de.value)), se.reset(), !1
    }),
        function () {
            if (!u.localStorageAvailable) {
                var e = !1;
                if (void 0 !== n) try {
                    n.setItem("feature_test", "yes"), "yes" === n.getItem("feature_test") && (n.removeItem("feature_test"), e = !0)
                } catch (e) { }
                u.localStorageAvailable = e
            }
            u.localStorageAvailable ? (In.value = A("name", ""), Dn.value = function (e) {
                for (var t = c.querySelectorAll("#home .panel .container-name-lang select option"), n = 0; n < t.length; n++)
                    if (e.startsWith(t[n].value)) return t[n].value;
                return "en"
            }(A("lang", navigator.language)), D.audio_mute = 1 == A("audio", 0) ? 1 : 0, D.filterChat = 1 == A("filter", 0) ? 1 : 0, $(1 == A("dark", 0) ? 1 : 0), (e = n.getItem("ava")) && (D.avatar = JSON.parse(e)), console.log("Settings loaded.")) : console.log("Settings not loaded. LocalStorage unavailable.")
        }(), Na = (_a = c.querySelector("#home .avatar-customizer")).querySelector(".container"), Ra = _a.querySelectorAll(".arrows.left .arrow"), Ya = _a.querySelectorAll(".arrows.right .arrow"), _a = _a.querySelectorAll(".randomize"), (Fa = Y(D.avatar, 96)).classList.add("fit"), Na.appendChild(Fa), T(Ra, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            --D.avatar[e], D.avatar[e] < 0 && (D.avatar[e] = t[e] - 1), Ga(e), _(Fa, D.avatar, 96), E()
        }), T(Ya, "click", function () {
            var e = parseInt(this.dataset.avatarIndex);
            D.avatar[e] += 1, D.avatar[e] >= t[e] && (D.avatar[e] = 0), Ga(e), _(Fa, D.avatar, 96), E()
        }), T(_a, "click", function () {
            D.avatar[0] = Math.floor(Math.random() * t[0]), D.avatar[1] = Math.floor(Math.random() * t[1]), D.avatar[2] = Math.floor(Math.random() * t[2]), Ga(1), Ga(2), _(Fa, D.avatar, 96), E()
        }),
        function () {
            for (var e = Math.round(8 * Math.random()), t = c.querySelector("#home .logo-big .avatar-container"), n = 0; n < 8; n++) {
                var a, o = [0, 0, 0, -1];
                o[0] = n, o[1] = Math.round(100 * Math.random()) % i, o[2] = Math.round(100 * Math.random()) % m, 1e3 * Math.random() < 10 && (o[3] = (a = [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])[Math.floor(Math.random() * a.length)]);
                o = Y(o, 48, e == n);
                t.append(o)
            }
        }()
}(window, document, localStorage, io);