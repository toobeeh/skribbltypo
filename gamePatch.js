! function(t, e, n, o, r) {
    function s(t, e, n, o) {
        var r = e[0] % H,
            s = e[1] % F,
            i = e[2] % z,
            a = function(t, e, n, r) {
                var s = r * o,
                    i = r * o,
                    a = -e % n * s,
                    c = -Math.floor(e / n) * i,
                    u = s * n,
                    h = i * n;
                t.css("background-size", u + "px " + h + "px"), t.css("background-position", a + "px " + c + "px")
            };
        a(t.find(".color"), r, 10, 48), a(t.find(".eyes"), s, 10, 48), a(t.find(".mouth"), i, 10, 48), e[3] >= 0 ? (t.find(".special").show(), a(t.find(".special"), e[3], 10, 80)) : t.find(".special").hide(), n ? t.find(".owner").show() : t.find(".owner").hide()
    }

    function i(t, e, n) {
        return t < e ? e : t > n ? n : t
    }

    function a(t) {
        if (t[0] == "#") return hexToRgb(t.substr(1));
        var e = t.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return {
            r: parseInt(e[1]),
            g: parseInt(e[2]),
            b: parseInt(e[3])
        }
    }
    function hexToRgb(hex) {
        var arrBuff = new ArrayBuffer(4);
        var vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        var arrByte = new Uint8Array(arrBuff);

        return { r: arrByte[1], g: arrByte[2], b: arrByte[3] };
    }
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function c() {
        o.setItem("avatar", JSON.stringify(loginAvatarData))
    }

    function u(t, e) {
        t < 0 || t >= 3 || (e < 0 && (e = J[t] - 1), e >= J[t] && (e = 0), loginAvatarData[t] = e, s(n("#loginAvatar"), loginAvatarData, !1, 2), c())
    }

    function h() {
        n("#modalIdle").modal()
    }

    function l() {
        if (it)
            if (st && st.drawingID == st.myID) {
                if (ut.drawCommands.length > 0) {
                    if (ut.drawCommands.length > 8) {
                        var t = ut.drawCommands.splice(7);
                        it.emit("drawCommands", ut.drawCommands), ut.drawCommands = t
                    } else it.emit("drawCommands", ut.drawCommands), ut.drawCommands = []
                }
            } else ut.drawCommands.length > 0 && (ut.drawCommands = [])
    }

    function p() {
        setTimeout(function() {
            n("#rateDrawing").show()
        }, 5e3)
    }

    function f() {
        n("#rateDrawing").hide()
    }

    function d() {
        n("#votekickCurrentplayer").prop("disabled", !1)
    }

    function y() {
        n("#votekickCurrentplayer").prop("disabled", !0)
    }

    function m() {
        it && it.emit("votekickCurrent"), y()
    }

    function g() {
        ct.goto("load");
        var t = null === o.getItem("firstLogin");
        t && o.setItem("firstLogin", "");
        var e = !1;
        if (!t) {
            var n = o.getItem("lastAd"),
                s = new Date;
            if (null === n || n === r || "undefined" === n) e = !0;
            else {
                var i = new Date(Date.parse(n));
                Math.abs(i - s) / 1e3 / 60 >= 2.5 && (e = !0)
            }
            e && o.setItem("lastAd", s.toString())
        }
        if (e) try {
            aiptag && adplayer && adplayer !== r && null !== adplayer && "undefined" !== adplayer ? aiptag.cmd.player.push(function() {
                adplayer.startPreRoll()
            }) : b()
        } catch (t) {
            console.log(t), b()
        } else b()
    }

    function v(t) {
        return t
    }

    function b() {
        grecaptcha && grecaptcha.ready ? grecaptcha.ready(function() {
            grecaptcha.execute("6LeFbcgUAAAAAHQcfuuaFjakmubtKjKCmYM5cbIJ", {
                action: "homepage"
            }).then(function(t) {
                dt = t, w()
            })
        }) : w()
    }
    document.body.addEventListener("joinLobby", () => { ct.goto("load"); g(); });
    function w() {
        at.context && at.context.resume();
        var t = x(),
            e = io(location.origin + ":4999");
        e.emit("login", t), e.on("result", function(o) {
            o.code ? (n("#error-login").hide(), C(o.host, t)) : (n("#error-login").text(o.msg).show(), ct.goto("login")), e.close()
        })
    }

    function k(t) {
        var e = "",
            n = t.split("?");
        return n.length > 1 && (e = "" + n[1], e = e.substring(0, 12)), e
    }

    function x() {
        var e = n("#inputName")[0].value.split("#", 2);
        0 == e.length && (e = ["", ""]), 1 == e.length && e.push("");
        var o = sessionStorage.joinCustom ? sessionStorage.joinCustom : k(t.location.href),
            r = n("#loginLanguage").val();
        localStorage.removeItem("joinCustom");
        return {
            name: e[0],
            code: e[1],
            avatar: loginAvatarData,
            join: o,
            language: r,
            createPrivate: pt
        }
    }
    let userDisconnect = false;
    let reset = () => {
        st = new tt({
            drawCommands: [],
            drawingID: 0,
            inGame: true,
            key: "",
            language: "english",
            myID: 0,
            name: "Lobby",
            ownerID: 0,
            players: [],
            round: 0,
            roundMax: 0,
            slots: 8,
            time: 60,
            timeMax: 80,
            useCustomWordsExclusive: false
        }), st.setDrawTime(0), U(), ut.clear(), ct.showLogo(2), E(""), ct.goto("login")
    };
    let disconnect = () => {
        reset(), it ? it.close() : 0, it = null, st = null, document.dispatchEvent(new Event("leftGame"))
    }
    const waitMs = async (timeMs) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), timeMs);
        });
    };
    document.body.addEventListener("leaveLobby", () => {
        userDisconnect = true;
        if(it) it.reconnect = false;
        disconnect();
    });
    function C(t, e) {
        at.playSound("playerJoin"), it = io(t, {
            query: {
                token: dt
            }
        });
        it.on("connect", function () {
            it.on("", (e, o) =>
                console.log(e + " - Incoming from " + it.id + "."));
            it.on("disconnect", async function () {
                // dont perform events if source is not active socket
                if (this.id != it.id) return;
                //await waitMs(100);
                disconnect();
                if (!userDisconnect) n("#modalDisconnect").modal();
                delete it;
            }), it.emit("userData", e),  it.on("kicked", function() {
                n("#modalKicked").modal(),
                document.dispatchEvent(new Event("leftGame"));
            }), it.on("drawCommands", function(t) {
                for (var e = 0; e < t.length; e++) I(t[e])
            }), it.on("canvasClear", function() {
                ut.clear()
            }), it.on("lobbyKicked", function(t) {
                var e = st.players.get(t);
                null != e && (st.chatAddMsg(null, e.name + " was kicked!", G), e.kicked = !0)
            }), it.on("chat", function (t) {
                var e = st.players.get(t.id),
                    n = st.players.get(st.myID),
                    o = e.id == st.drawingID || e.guessedWord;
                    n.id != st.drawingID && !n.guessedWord && o || (!e.mute ?
                        st.chatAddMsg(e, v(t.message), o ? "#7dad3f" : "#000") :
                        st.chatAddMsg(e, v(t.message), "rgb(0 0 0 / 50%)", t.id))
            }), it.on("lobbySpam", function() {
                st.chatAddMsg(null, "Spam detected! You're sending too many messages.", G)
            }), it.on("restartNotification", function(t) {
                st && st.chatAddMsg(null, "Server will restart in about " + t + " seconds...", N)
            }), it.on("lobbyVotekickCurrent", function(t) {
                if (st) {
                    var e = st.players.get(t[0]),
                        n = st.players.get(t[1]);
                    st.chatAddMsg(null, "'" + e.name + "' is voting to kick '" + n.name + "' (" + t[2] + "/" + t[3] + ")", N)
                }
            }), it.on("lobbyConnected", function (t) {
                document.dispatchEvent(new CustomEvent("lobbyConnected", { detail: t }));
                if (ut.clear(), E(""), st = new tt(t), st.inGame) {
                    for (var e = 0; e < t.drawCommands.length; e++) I(t.drawCommands[e]);
                    ct.goto("game"), st.drawingID >= 0 && D(st.time)
                } else ct.goto("lobby")
            }), it.on("lobbyLobby", function() {
                ct.goto("lobby")
            }), it.on("lobbyState", function(t) {
                switch (parseInt(t[0])) {
                    case $:
                        d(), D(st.time);
                        break;
                    case Y:
                        E("Game will start soon...")
                }
            }),
            it.on("lobbyDisconnected", function() {
                it.emit("lobbyLeave"), st.reset(), ct.goto("login")
            }), it.on("lobbyGameStart", function(t) {
                st.reset(), E(""), ct.goto("game")
            }), it.on("lobbyGameEnd", function() {
                var t = [];
                st.players.forEach(function(e, n, o) {
                    t.push(e)
                }), L({
                    mode: "endgame",
                    text: "Result",
                    players: t
                })
            }), it.on("lobbyLanguage", function(t) {
                st.setLanguage(t)
            }), it.on("lobbyRounds", function(t) {
                st.setRounds(t)
            }), it.on("lobbyDrawTime", function(t) {
                st.setDrawTime(t)
            }), it.on("lobbyCustomWordsExclusive", function(t) {
                st.setCustomWordsExclusive(t)
            }), it.on("lobbyPlayerConnected", function (t) {
                st.addPlayer(t), st.chatAddMsg(null, t.name + " joined.", j), at.playSound("playerJoin")
            }), it.on("lobbyPlayerDisconnected", function(t) {
                var e = st.players.get(t);
                st.removePlayer(e), e.kicked || st.chatAddMsg(null, e.name + " left.", G), at.playSound("playerLeave")
            }), it.on("lobbyPlayerGuessedWord", function(t) {
                var e = st.players.get(t);
                st.setPlayerGuessed(e), st.chatAddMsg(null, e.name + " guessed the word!", _), t == st.myID && st.chatDisable(), at.playSound("playerGuessed")
            }), it.on("lobbyGuessClose", function(t) {
                st.chatAddMsg(null, "'" + t + "' is close!", N)
            }), it.on("lobbyPlayerDrawing", function(t) {
                var e = st.players.get(t);
                st.setPlayerDrawing(e.id), st.chatAddMsg(null, e.name + " is drawing now!", O);
                sessionStorage.lastDrawing = e.name;
                var n = st.drawingID == st.myID;
                ut.setDrawing(n), n ? (f(), y()) : (p(), d()), at.playSound("roundStart"), D(st.timeMax), U()
            }), it.on("lobbyOwnerChanged", function(t) {
                var e = st.players.get(t);
                st.setPlayerOwner(e), st.chatAddMsg(null, e.name + " is the owner now!", _)
            }), it.on("lobbyRound", function(t) {
                st.round = t, st.updateRound(), L({
                    mode: "text",
                    text: "Round " + (st.round + 1)
                })
            }), it.on("lobbyChooseWord", function(t) {
                if (t.id == st.myID) L({
                    mode: "choosewords",
                    text: "Choose a word",
                    words: t.words
                });
                else {
                    L({
                        mode: "text",
                        text: st.players.get(t.id).name + " is choosing a word!"
                    })
                }
            }), it.on("lobbyReveal", function (t) {
                sessionStorage.lastWord = t.word;
                document.querySelector("body").dispatchEvent(new Event("drawingFinished"));
                A(), st.chatEnable(), st.chatAddMsg(null, "The word was '" + t.word + "'", _);
                document.querySelector("body").dispatchEvent(new Event("wordRevealed"));
                for (var e = [], n = !0, o = 0; o < t.scores.length / 2; o++) {
                    var r = t.scores[2 * o],
                        s = t.scores[2 * o + 1],
                        i = st.players.get(r);
                    if (i) {
                        i.guessedWord && (n = !1);
                        var a = s - i.score;
                        st.setPlayerScore(i, s, a), e.push(i)
                    }
                }
                st.updateRanks(), L({
                    mode: "reveal",
                    text: "The word was: " + t.word,
                    revealReason: X[t.reason],
                    players: e,
                    onshow: function () {
                        n ? at.playSound("roundEndFailure") : at.playSound("roundEndSuccess")
                    }
                }), st.setPlayerDrawing(-1), ut.setDrawing(!1), st.playersResetGuessedWord();
            }), it.on("lobbyPlayerRateDrawing", function(t) {
                var e = st.players.get(t[0]),
                    n = st.players.get(t[1]),
                    o = t[2];
                e && st.playerRate(e, o), n && (o > 0 ? n.thumbsUp++ : n.thumbsDown++)
            }), it.on("lobbyCurrentWord", function(t) {
                st.players.get(st.myID).guessedWord || E(t)
            }), it.on("lobbyTime", function(t) {
                S(t)
            })
        })
    }

    function A() {
        null != yt && (clearInterval(yt), yt = null)
    }

    function D(t) {
        S(t), A(), yt = setInterval(function() {
            mt > 0 && S(mt - 1)
        }, 1e3)
    }

    function S(t) {
        mt = t, mt <= 8 && at.playSound("tick"), n("#timer").text(mt)
    }

    function P() {
        ct.goto("load"), it.emit("lobbyLeave")
    }

    function M(t) {
        return t.charAt(0).toUpperCase() + t.slice(1)
    }

    function E(t) {
        n("#currentWord").text(t)
    }

    function T(t, e, n, lineFrom) {
        var from = lineFrom;
        if ((sessionStorage.getItem('practise') == "true" || st.checkDrawing()) && (ut.updateMousePosition(t, e, n), ut.brush.down)) {
            var o = null;
            if (lineFrom) {
                if (lineFrom) ut.mouseposPrev = lineFrom;
                o = ut.createDrawCommandLine(ut.brush.colorIndex, ut.brush.thickness, ut.mouseposPrev.x, ut.mouseposPrev.y, ut.mousepos.x, ut.mousepos.y);
            }
            switch (ut.brush.tool) {
                case "pen":
                    o = ut.createDrawCommandLine(ut.brush.colorIndex, ut.brush.thickness, ut.mouseposPrev.x, ut.mouseposPrev.y, ut.mousepos.x, ut.mousepos.y);
                    break;
                case "erase":
                    o = ut.createDrawCommandErase(ut.brush.thickness, ut.mouseposPrev.x, ut.mouseposPrev.y, ut.mousepos.x, ut.mousepos.y);
                    break;
                case "fill":
                    ut.brush.toolUsed || (o = ut.createDrawCommandFill(ut.brush.colorIndex, ut.mouseposPrev.x, ut.mouseposPrev.y, ut.mousepos.x, ut.mousepos.y));
                    break;
                case "pipette":
                    let rgb = document.querySelector("#canvasGame").getContext("2d").getImageData(ut.mouseposPrev.x, ut.mouseposPrev.y, 1, 1).data;
                    // get data color index by rgb value
                    let rgbString = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
                    let item = [...document.querySelectorAll(".colorItem")].find(c => c.style.background == rgbString);
                    if (!item) {
                        let picker = document.querySelector("#colPicker");
                        picker.style.backgroundColor = rgbString;
                        let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
                        picker.firstChild.setAttribute("data-color", hex);
                        ut.brush.setColor(10000 + Number("0x" + hex.substr(1)));
                    }
                    else {
                        let index = item.getAttribute("data-color");
                        ut.brush.setColor(index);
                    }
                    break;
            }
            null != o && (ut.brush.toolUsed = !0, I(o))
        }
        else if (from) I(o = ut.createDrawCommandLine(ut.brush.colorIndex, ut.brush.thickness, from.x, from.y, ut.mousepos.x, ut.mousepos.y));
    }

    function B(t) {
        var e = t.clone();
        return e.removeAttr("id"), e.show(), e
    }

    function I(t) {
        sessionStorage.getItem('practise') == "true" || st.drawingID == st.myID ? (ut.drawCommands.push(t), ut.performDrawCommand(t), document.querySelector("body").dispatchEvent(new CustomEvent("logDrawCommand", { detail: t }))) : (ut.addDrawCommandReceived(t), document.querySelector("body").dispatchEvent(new CustomEvent("logDrawCommand", { detail: t })));
    }

    var lastBrushUp = { X: 0, Y: 0 };

    function L(t) {
        if (lt) return ht.unshift(t), void U();
        lt = !0;
        var e = n("#overlay");
        e.show(), e.animate({
            opacity: "1"
        }, q), R(t)
    }

    function R(t) {
        var e = n("#overlay"),
            o = e.find(".content");
        o.find(".text").text(t.text);
        var r = o.find(".wordContainer");
        if ("choosewords" == t.mode) {
            r.empty(), r.show();
            for (var i = 0; i < t.words.length; i++) {
                var a = n("<div class='word'></div>");
                a.data("id", i), a.text(t.words[i]), r.append(a), a.on("click", function() {
                    var t = n(this).data("id");
                    it && it.emit("lobbyChooseWord", t), U()
                })
            }
        } else r.hide();
        var c = e.find(".revealReason"),
            u = o.find(".revealContainer");
        if ("reveal" == t.mode) {
            c.text(t.revealReason), c.show(), u.empty(), u.show(), t.players.sort(function(t, e) {
                return e.scoreGuessed - t.scoreGuessed
            });
            for (var i = 0; i < t.players.length; i++) {
                var h = t.players[i],
                    l = n("<div class='player'></div>"),
                    p = n("<div class='name'></div>");
                p.text(h.name);
                var f = n("<div class='score'></div>");
                h.scoreGuessed > 0 ? (f.text("+" + h.scoreGuessed), f.css("color", "#07EA30")) : (f.text(h.scoreGuessed), f.css("color", "#E81300")), l.append(p), l.append(f), u.append(l)
            }
        } else c.hide(), u.hide();
        var d = o.find(".gameEndContainer");
        if ("endgame" == t.mode) {
            d.show(), t.players.sort(function(t, e) {
                return t.rank - e.rank
            });
            var y = n(".gameEndContainerPlayersBest"),
                m = n(".gameEndContainerPlayers");
            y.empty(), m.empty();
            for (var i = 0; i < t.players.length; i++) {
                var h = t.players[i],
                    l = B(n("#gameEndPlayerDummy"));
                l.find(".name").text(h.name);
                var g = l.find(".rank");
                g.text("#" + h.rank), h.rank <= 3 && g.addClass("rank-" + h.rank), h.rank <= 3 ? y.append(l) : m.append(l), s(l, h.avatar, h.id == st.ownerID, h.rank <= 3 ? 2 : 1)
            }
        } else d.hide();
        o.show(), o.animate({
            bottom: "0%"
        }, q, "easeInOutBack", function() {
            t.onshow && t.onshow()
        })
    }

    function U() {
        if (lt) {
            var t = n("#overlay"),
                e = t.find(".content"),
                o = ht.pop();
            o ? e.animate({
                bottom: "100%"
            }, W, "easeInOutBack", function() {
                R(o)
            }) : (lt = !1, t.animate({
                opacity: "0"
            }, W, function() {
                t.hide()
            }), e.animate({
                bottom: "100%"
            }, W, "easeInOutBack", function() {
                e.hide()
            }))
        }
    }! function(t, e) {
        "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e()
    }(this, function() {
        return function(t) {
            function e(o) {
                if (n[o]) return n[o].exports;
                var r = n[o] = {
                    exports: {},
                    id: o,
                    loaded: !1
                };
                return t[o].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
            }
            var n = {};
            return e.m = t, e.c = n, e.p = "", e(0)
        }([function(t, e, n) {
            "use strict";

            function o(t, e) {
                "object" === (void 0 === t ? "undefined" : s(t)) && (e = t, t = void 0), e = e || {};
                var n, o = i(t),
                    a = o.source,
                    l = o.id,
                    p = o.path,
                    f = h[l] && p in h[l].nsps;
                return e.forceNew || e["force new connection"] || !1 === e.multiplex || f ? (u("ignoring socket cache for %s", a), n = c(a, e)) : (h[l] || (u("new io instance for %s", a), h[l] = c(a, e)), n = h[l]), o.query && !e.query ? e.query = o.query : e && "object" === s(e.query) && (e.query = r(e.query)), n.socket(o.path, e)
            }

            function r(t) {
                var e = [];
                for (var n in t) t.hasOwnProperty(n) && e.push(encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
                return e.join("&")
            }
            var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                },
                i = n(1),
                a = n(7),
                c = n(17),
                u = n(3)("socket.io-client");
            t.exports = e = o;
            var h = e.managers = {};
            e.protocol = a.protocol, e.connect = o, e.Manager = n(17), e.Socket = n(44)
        }, function(t, e, n) {
            (function(e) {
                "use strict";

                function o(t, n) {
                    var o = t;
                    n = n || e.location, null == t && (t = n.protocol + "//" + n.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t), /^(https?|wss?):\/\//.test(t) || (s("protocol-less url %s", t), t = void 0 !== n ? n.protocol + "//" + t : "https://" + t), s("parse %s", t), o = r(t)), o.port || (/^(http|ws)$/.test(o.protocol) ? o.port = "80" : /^(http|ws)s$/.test(o.protocol) && (o.port = "443")), o.path = o.path || "/";
                    var i = -1 !== o.host.indexOf(":"),
                        a = i ? "[" + o.host + "]" : o.host;
                    return o.id = o.protocol + "://" + a + ":" + o.port, o.href = o.protocol + "://" + a + (n && n.port === o.port ? "" : ":" + o.port), o
                }
                var r = n(2),
                    s = n(3)("socket.io-client:url");
                t.exports = o
            }).call(e, function() {
                return this
            }())
        }, function(t, e) {
            var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                o = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            t.exports = function(t) {
                var e = t,
                    r = t.indexOf("["),
                    s = t.indexOf("]"); - 1 != r && -1 != s && (t = t.substring(0, r) + t.substring(r, s).replace(/:/g, ";") + t.substring(s, t.length));
                for (var i = n.exec(t || ""), a = {}, c = 14; c--;) a[o[c]] = i[c] || "";
                return -1 != r && -1 != s && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a
            }
        }, function(n, o, r) {
            (function(s) {
                function i() {
                    return void 0 !== e && "WebkitAppearance" in e.documentElement.style || t.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
                }

                function a() {
                    var t = arguments,
                        e = this.useColors;
                    if (t[0] = (e ? "%c" : "") + this.namespace + (e ? " %c" : " ") + t[0] + (e ? "%c " : " ") + "+" + o.humanize(this.diff), !e) return t;
                    var n = "color: " + this.color;
                    t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
                    var r = 0,
                        s = 0;
                    return t[0].replace(/%[a-z%]/g, function(t) {
                        "%%" !== t && (r++, "%c" === t && (s = r))
                    }), t.splice(s, 0, n), t
                }

                function c() {
                    return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                }

                function u(t) {
                    try {
                        null == t ? o.storage.removeItem("debug") : o.storage.debug = t
                    } catch (t) {}
                }

                function h() {
                    try {
                        return o.storage.debug
                    } catch (t) {}
                    if (void 0 !== s && "env" in s) return s.env.DEBUG
                }
                o = n.exports = r(5), o.log = c, o.formatArgs = a, o.save = u, o.load = h, o.useColors = i, o.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function() {
                    try {
                        return t.localStorage
                    } catch (t) {}
                }(), o.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], o.formatters.j = function(t) {
                    try {
                        return JSON.stringify(t)
                    } catch (t) {
                        return "[UnexpectedJSONParseError]: " + t.message
                    }
                }, o.enable(h())
            }).call(o, r(4))
        }, function(t, e) {
            function n() {
                throw new Error("setTimeout has not been defined")
            }

            function o() {
                throw new Error("clearTimeout has not been defined")
            }

            function r(t) {
                if (h === setTimeout) return setTimeout(t, 0);
                if ((h === n || !h) && setTimeout) return h = setTimeout, setTimeout(t, 0);
                try {
                    return h(t, 0)
                } catch (e) {
                    try {
                        return h.call(null, t, 0)
                    } catch (e) {
                        return h.call(this, t, 0)
                    }
                }
            }

            function s(t) {
                if (l === clearTimeout) return clearTimeout(t);
                if ((l === o || !l) && clearTimeout) return l = clearTimeout, clearTimeout(t);
                try {
                    return l(t)
                } catch (e) {
                    try {
                        return l.call(null, t)
                    } catch (e) {
                        return l.call(this, t)
                    }
                }
            }

            function i() {
                y && f && (y = !1, f.length ? d = f.concat(d) : m = -1, d.length && a())
            }

            function a() {
                if (!y) {
                    var t = r(i);
                    y = !0;
                    for (var e = d.length; e;) {
                        for (f = d, d = []; ++m < e;) f && f[m].run();
                        m = -1, e = d.length
                    }
                    f = null, y = !1, s(t)
                }
            }

            function c(t, e) {
                this.fun = t, this.array = e
            }

            function u() {}
            var h, l, p = t.exports = {};
            ! function() {
                try {
                    h = "function" == typeof setTimeout ? setTimeout : n
                } catch (t) {
                    h = n
                }
                try {
                    l = "function" == typeof clearTimeout ? clearTimeout : o
                } catch (t) {
                    l = o
                }
            }();
            var f, d = [],
                y = !1,
                m = -1;
            p.nextTick = function(t) {
                var e = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                d.push(new c(t, e)), 1 !== d.length || y || r(a)
            }, c.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, p.title = "browser", p.browser = !0, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = u, p.addListener = u, p.once = u, p.off = u, p.removeListener = u, p.removeAllListeners = u, p.emit = u, p.binding = function(t) {
                throw new Error("process.binding is not supported")
            }, p.cwd = function() {
                return "/"
            }, p.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }, p.umask = function() {
                return 0
            }
        }, function(t, e, n) {
            function o() {
                return e.colors[h++ % e.colors.length]
            }

            function r(t) {
                function n() {}

                function r() {
                    var t = r,
                        n = +new Date,
                        s = n - (u || n);
                    t.diff = s, t.prev = u, t.curr = n, u = n, null == t.useColors && (t.useColors = e.useColors()), null == t.color && t.useColors && (t.color = o());
                    for (var i = new Array(arguments.length), a = 0; a < i.length; a++) i[a] = arguments[a];
                    i[0] = e.coerce(i[0]), "string" != typeof i[0] && (i = ["%o"].concat(i));
                    var c = 0;
                    i[0] = i[0].replace(/%([a-z%])/g, function(n, o) {
                        if ("%%" === n) return n;
                        c++;
                        var r = e.formatters[o];
                        if ("function" == typeof r) {
                            var s = i[c];
                            n = r.call(t, s), i.splice(c, 1), c--
                        }
                        return n
                    }), i = e.formatArgs.apply(t, i), (r.log || e.log || console.log.bind(console)).apply(t, i)
                }
                n.enabled = !1, r.enabled = !0;
                var s = e.enabled(t) ? r : n;
                return s.namespace = t, s
            }

            function s(t) {
                e.save(t);
                for (var n = (t || "").split(/[\s,]+/), o = n.length, r = 0; r < o; r++) n[r] && (t = n[r].replace(/[\\^$+?.()|[\]{}]/g, "\\$&").replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")))
            }

            function i() {
                e.enable("")
            }

            function a(t) {
                var n, o;
                for (n = 0, o = e.skips.length; n < o; n++)
                    if (e.skips[n].test(t)) return !1;
                for (n = 0, o = e.names.length; n < o; n++)
                    if (e.names[n].test(t)) return !0;
                return !1
            }

            function c(t) {
                return t instanceof Error ? t.stack || t.message : t
            }
            e = t.exports = r.debug = r, e.coerce = c, e.disable = i, e.enable = s, e.enabled = a, e.humanize = n(6), e.names = [], e.skips = [], e.formatters = {};
            var u, h = 0
        }, function(t, e) {
            function n(t) {
                if (t = String(t), !(t.length > 1e4)) {
                    var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
                    if (e) {
                        var n = parseFloat(e[1]);
                        switch ((e[2] || "ms").toLowerCase()) {
                            case "years":
                            case "year":
                            case "yrs":
                            case "yr":
                            case "y":
                                return n * h;
                            case "days":
                            case "day":
                            case "d":
                                return n * u;
                            case "hours":
                            case "hour":
                            case "hrs":
                            case "hr":
                            case "h":
                                return n * c;
                            case "minutes":
                            case "minute":
                            case "mins":
                            case "min":
                            case "m":
                                return n * a;
                            case "seconds":
                            case "second":
                            case "secs":
                            case "sec":
                            case "s":
                                return n * i;
                            case "milliseconds":
                            case "millisecond":
                            case "msecs":
                            case "msec":
                            case "ms":
                                return n;
                            default:
                                return
                        }
                    }
                }
            }

            function o(t) {
                return t >= u ? Math.round(t / u) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= i ? Math.round(t / i) + "s" : t + "ms"
            }

            function r(t) {
                return s(t, u, "day") || s(t, c, "hour") || s(t, a, "minute") || s(t, i, "second") || t + " ms"
            }

            function s(t, e, n) {
                if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + n : Math.ceil(t / e) + " " + n + "s"
            }
            var i = 1e3,
                a = 60 * i,
                c = 60 * a,
                u = 24 * c,
                h = 365.25 * u;
            t.exports = function(t, e) {
                e = e || {};
                var s = typeof t;
                if ("string" === s && t.length > 0) return n(t);
                if ("number" === s && !1 === isNaN(t)) return e.long ? r(t) : o(t);
                throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t))
            }
        }, function(t, e, n) {
            function o() {}

            function r(t) {
                var n = "",
                    o = !1;
                return n += t.type, e.BINARY_EVENT != t.type && e.BINARY_ACK != t.type || (n += t.attachments, n += "-"), t.nsp && "/" != t.nsp && (o = !0, n += t.nsp), null != t.id && (o && (n += ",", o = !1), n += t.id), null != t.data && (o && (n += ","), n += p.stringify(t.data)), l("encoded %j as %s", t, n), n
            }

            function s(t, e) {
                function n(t) {
                    var n = d.deconstructPacket(t),
                        o = r(n.packet),
                        s = n.buffers;
                    s.unshift(o), e(s)
                }
                d.removeBlobs(t, n)
            }

            function i() {
                this.reconstructor = null
            }

            function a(t) {
                var n = {},
                    o = 0;
                if (n.type = Number(t.charAt(0)), null == e.types[n.type]) return h();
                if (e.BINARY_EVENT == n.type || e.BINARY_ACK == n.type) {
                    for (var r = "";
                        "-" != t.charAt(++o) && (r += t.charAt(o), o != t.length););
                    if (r != Number(r) || "-" != t.charAt(o)) throw new Error("Illegal attachments");
                    n.attachments = Number(r)
                }
                if ("/" == t.charAt(o + 1))
                    for (n.nsp = ""; ++o;) {
                        var s = t.charAt(o);
                        if ("," == s) break;
                        if (n.nsp += s, o == t.length) break
                    } else n.nsp = "/";
                var i = t.charAt(o + 1);
                if ("" !== i && Number(i) == i) {
                    for (n.id = ""; ++o;) {
                        var s = t.charAt(o);
                        if (null == s || Number(s) != s) {
                            --o;
                            break
                        }
                        if (n.id += t.charAt(o), o == t.length) break
                    }
                    n.id = Number(n.id)
                }
                return t.charAt(++o) && (n = c(n, t.substr(o))), l("decoded %s as %j", t, n), n
            }

            function c(t, e) {
                try {
                    t.data = p.parse(e)
                } catch (t) {
                    return h()
                }
                return t
            }

            function u(t) {
                this.reconPack = t, this.buffers = []
            }

            function h(t) {
                return {
                    type: e.ERROR,
                    data: "parser error"
                }
            }
            var l = n(8)("socket.io-parser"),
                p = n(11),
                f = n(13),
                d = n(14),
                y = n(16);
            e.protocol = 4, e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"], e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, e.BINARY_ACK = 6, e.Encoder = o, e.Decoder = i, o.prototype.encode = function(t, n) {
                if (l("encoding packet %j", t), e.BINARY_EVENT == t.type || e.BINARY_ACK == t.type) s(t, n);
                else {
                    n([r(t)])
                }
            }, f(i.prototype), i.prototype.add = function(t) {
                var n;
                if ("string" == typeof t) n = a(t), e.BINARY_EVENT == n.type || e.BINARY_ACK == n.type ? (this.reconstructor = new u(n), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", n)) : this.emit("decoded", n);
                else {
                    if (!y(t) && !t.base64) throw new Error("Unknown type: " + t);
                    if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                    (n = this.reconstructor.takeBinaryData(t)) && (this.reconstructor = null, this.emit("decoded", n))
                }
            }, i.prototype.destroy = function() {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            }, u.prototype.takeBinaryData = function(t) {
                if (this.buffers.push(t), this.buffers.length == this.reconPack.attachments) {
                    var e = d.reconstructPacket(this.reconPack, this.buffers);
                    return this.finishedReconstruction(), e
                }
                return null
            }, u.prototype.finishedReconstruction = function() {
                this.reconPack = null, this.buffers = []
            }
        }, function(n, o, r) {
            function s() {
                return "WebkitAppearance" in e.documentElement.style || t.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
            }

            function i() {
                var t = arguments,
                    e = this.useColors;
                if (t[0] = (e ? "%c" : "") + this.namespace + (e ? " %c" : " ") + t[0] + (e ? "%c " : " ") + "+" + o.humanize(this.diff), !e) return t;
                var n = "color: " + this.color;
                t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
                var r = 0,
                    s = 0;
                return t[0].replace(/%[a-z%]/g, function(t) {
                    "%%" !== t && (r++, "%c" === t && (s = r))
                }), t.splice(s, 0, n), t
            }

            function a() {
                return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            }

            function c(t) {
                try {
                    null == t ? o.storage.removeItem("debug") : o.storage.debug = t
                } catch (t) {}
            }

            function u() {
                var t;
                try {
                    t = o.storage.debug
                } catch (t) {}
                return t
            }
            o = n.exports = r(9), o.log = a, o.formatArgs = i, o.save = c, o.load = u, o.useColors = s, o.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function() {
                try {
                    return t.localStorage
                } catch (t) {}
            }(), o.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], o.formatters.j = function(t) {
                return JSON.stringify(t)
            }, o.enable(u())
        }, function(t, e, n) {
            function o() {
                return e.colors[h++ % e.colors.length]
            }

            function r(t) {
                function n() {}

                function r() {
                    var t = r,
                        n = +new Date,
                        s = n - (u || n);
                    t.diff = s, t.prev = u, t.curr = n, u = n, null == t.useColors && (t.useColors = e.useColors()), null == t.color && t.useColors && (t.color = o());
                    var i = Array.prototype.slice.call(arguments);
                    i[0] = e.coerce(i[0]), "string" != typeof i[0] && (i = ["%o"].concat(i));
                    var a = 0;
                    i[0] = i[0].replace(/%([a-z%])/g, function(n, o) {
                        if ("%%" === n) return n;
                        a++;
                        var r = e.formatters[o];
                        if ("function" == typeof r) {
                            var s = i[a];
                            n = r.call(t, s), i.splice(a, 1), a--
                        }
                        return n
                    }), "function" == typeof e.formatArgs && (i = e.formatArgs.apply(t, i)), (r.log || e.log || console.log.bind(console)).apply(t, i)
                }
                n.enabled = !1, r.enabled = !0;
                var s = e.enabled(t) ? r : n;
                return s.namespace = t, s
            }

            function s(t) {
                e.save(t);
                for (var n = (t || "").split(/[\s,]+/), o = n.length, r = 0; r < o; r++) n[r] && (t = n[r].replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")))
            }

            function i() {
                e.enable("")
            }

            function a(t) {
                var n, o;
                for (n = 0, o = e.skips.length; n < o; n++)
                    if (e.skips[n].test(t)) return !1;
                for (n = 0, o = e.names.length; n < o; n++)
                    if (e.names[n].test(t)) return !0;
                return !1
            }

            function c(t) {
                return t instanceof Error ? t.stack || t.message : t
            }
            e = t.exports = r, e.coerce = c, e.disable = i, e.enable = s, e.enabled = a, e.humanize = n(10), e.names = [], e.skips = [], e.formatters = {};
            var u, h = 0
        }, function(t, e) {
            function n(t) {
                if (t = "" + t, !(t.length > 1e4)) {
                    var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
                    if (e) {
                        var n = parseFloat(e[1]);
                        switch ((e[2] || "ms").toLowerCase()) {
                            case "years":
                            case "year":
                            case "yrs":
                            case "yr":
                            case "y":
                                return n * h;
                            case "days":
                            case "day":
                            case "d":
                                return n * u;
                            case "hours":
                            case "hour":
                            case "hrs":
                            case "hr":
                            case "h":
                                return n * c;
                            case "minutes":
                            case "minute":
                            case "mins":
                            case "min":
                            case "m":
                                return n * a;
                            case "seconds":
                            case "second":
                            case "secs":
                            case "sec":
                            case "s":
                                return n * i;
                            case "milliseconds":
                            case "millisecond":
                            case "msecs":
                            case "msec":
                            case "ms":
                                return n
                        }
                    }
                }
            }

            function o(t) {
                return t >= u ? Math.round(t / u) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= i ? Math.round(t / i) + "s" : t + "ms"
            }

            function r(t) {
                return s(t, u, "day") || s(t, c, "hour") || s(t, a, "minute") || s(t, i, "second") || t + " ms"
            }

            function s(t, e, n) {
                if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + n : Math.ceil(t / e) + " " + n + "s"
            }
            var i = 1e3,
                a = 60 * i,
                c = 60 * a,
                u = 24 * c,
                h = 365.25 * u;
            t.exports = function(t, e) {
                return e = e || {}, "string" == typeof t ? n(t) : e.long ? r(t) : o(t)
            }
        }, function(e, n, o) {
            (function(e, o) {
                var r = !1;
                (function() {
                    function s(t, e) {
                        function n(t) {
                            if (n[t] !== m) return n[t];
                            var s;
                            if ("bug-string-char-index" == t) s = "a" != "a" [0];
                            else if ("json" == t) s = n("json-stringify") && n("json-parse");
                            else {
                                var i, a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                                if ("json-stringify" == t) {
                                    var u = e.stringify,
                                        h = "function" == typeof u && b;
                                    if (h) {
                                        (i = function() {
                                            return 1
                                        }).toJSON = i;
                                        try {
                                            h = "0" === u(0) && "0" === u(new o) && '""' == u(new r) && u(v) === m && u(m) === m && u() === m && "1" === u(i) && "[1]" == u([i]) && "[null]" == u([m]) && "null" == u(null) && "[null,null,null]" == u([m, v, null]) && u({
                                                a: [i, !0, !1, null, "\0\b\n\f\r\t"]
                                            }) == a && "1" === u(null, i) && "[\n 1,\n 2\n]" == u([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == u(new c(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == u(new c(864e13)) && '"-000001-01-01T00:00:00.000Z"' == u(new c(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == u(new c(-1))
                                        } catch (t) {
                                            h = !1
                                        }
                                    }
                                    s = h
                                }
                                if ("json-parse" == t) {
                                    var l = e.parse;
                                    if ("function" == typeof l) try {
                                        if (0 === l("0") && !l(!1)) {
                                            i = l(a);
                                            var p = 5 == i.a.length && 1 === i.a[0];
                                            if (p) {
                                                try {
                                                    p = !l('"\t"')
                                                } catch (t) {}
                                                if (p) try {
                                                    p = 1 !== l("01")
                                                } catch (t) {}
                                                if (p) try {
                                                    p = 1 !== l("1.")
                                                } catch (t) {}
                                            }
                                        }
                                    } catch (t) {
                                        p = !1
                                    }
                                    s = p
                                }
                            }
                            return n[t] = !!s
                        }
                        t || (t = u.Object()), e || (e = u.Object());
                        var o = t.Number || u.Number,
                            r = t.String || u.String,
                            i = t.Object || u.Object,
                            c = t.Date || u.Date,
                            h = t.SyntaxError || u.SyntaxError,
                            l = t.TypeError || u.TypeError,
                            p = t.Math || u.Math,
                            f = t.JSON || u.JSON;
                        "object" == typeof f && f && (e.stringify = f.stringify, e.parse = f.parse);
                        var d, y, m, g = i.prototype,
                            v = g.toString,
                            b = new c(-0xc782b5b800cec);
                        try {
                            b = -109252 == b.getUTCFullYear() && 0 === b.getUTCMonth() && 1 === b.getUTCDate() && 10 == b.getUTCHours() && 37 == b.getUTCMinutes() && 6 == b.getUTCSeconds() && 708 == b.getUTCMilliseconds()
                        } catch (t) {}
                        if (!n("json")) {
                            var w = "[object Function]",
                                k = "[object Number]",
                                x = "[object String]",
                                C = "[object Array]",
                                A = n("bug-string-char-index");
                            if (!b) var D = p.floor,
                                S = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                                P = function(t, e) {
                                    return S[e] + 365 * (t - 1970) + D((t - 1969 + (e = +(e > 1))) / 4) - D((t - 1901 + e) / 100) + D((t - 1601 + e) / 400)
                                };
                            if ((d = g.hasOwnProperty) || (d = function(t) {
                                    var e, n = {};
                                    return (n.__proto__ = null, n.__proto__ = {
                                        toString: 1
                                    }, n).toString != v ? d = function(t) {
                                        var e = this.__proto__,
                                            n = t in (this.__proto__ = null, this);
                                        return this.__proto__ = e, n
                                    } : (e = n.constructor, d = function(t) {
                                        var n = (this.constructor || e).prototype;
                                        return t in this && !(t in n && this[t] === n[t])
                                    }), n = null, d.call(this, t)
                                }), y = function(t, e) {
                                    var n, o, r, s = 0;
                                    (n = function() {
                                        this.valueOf = 0
                                    }).prototype.valueOf = 0, o = new n;
                                    for (r in o) d.call(o, r) && s++;
                                    return n = o = null, s ? y = 2 == s ? function(t, e) {
                                        var n, o = {},
                                            r = v.call(t) == w;
                                        for (n in t) r && "prototype" == n || d.call(o, n) || !(o[n] = 1) || !d.call(t, n) || e(n)
                                    } : function(t, e) {
                                        var n, o, r = v.call(t) == w;
                                        for (n in t) r && "prototype" == n || !d.call(t, n) || (o = "constructor" === n) || e(n);
                                        (o || d.call(t, n = "constructor")) && e(n)
                                    } : (o = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], y = function(t, e) {
                                        var n, r, s = v.call(t) == w,
                                            i = !s && "function" != typeof t.constructor && a[typeof t.hasOwnProperty] && t.hasOwnProperty || d;
                                        for (n in t) s && "prototype" == n || !i.call(t, n) || e(n);
                                        for (r = o.length; n = o[--r]; i.call(t, n) && e(n));
                                    }), y(t, e)
                                }, !n("json-stringify")) {
                                var M = {
                                        92: "\\\\",
                                        34: '\\"',
                                        8: "\\b",
                                        12: "\\f",
                                        10: "\\n",
                                        13: "\\r",
                                        9: "\\t"
                                    },
                                    E = function(t, e) {
                                        return ("000000" + (e || 0)).slice(-t)
                                    },
                                    T = function(t) {
                                        for (var e = '"', n = 0, o = t.length, r = !A || o > 10, s = r && (A ? t.split("") : t); n < o; n++) {
                                            var i = t.charCodeAt(n);
                                            switch (i) {
                                                case 8:
                                                case 9:
                                                case 10:
                                                case 12:
                                                case 13:
                                                case 34:
                                                case 92:
                                                    e += M[i];
                                                    break;
                                                default:
                                                    if (i < 32) {
                                                        e += "\\u00" + E(2, i.toString(16));
                                                        break
                                                    }
                                                    e += r ? s[n] : t.charAt(n)
                                            }
                                        }
                                        return e + '"'
                                    },
                                    B = function(t, e, n, o, r, s, i) {
                                        var a, c, u, h, p, f, g, b, w, A, S, M, I, L, R, U;
                                        try {
                                            a = e[t]
                                        } catch (t) {}
                                        if ("object" == typeof a && a)
                                            if ("[object Date]" != (c = v.call(a)) || d.call(a, "toJSON")) "function" == typeof a.toJSON && (c != k && c != x && c != C || d.call(a, "toJSON")) && (a = a.toJSON(t));
                                            else if (a > -1 / 0 && a < 1 / 0) {
                                            if (P) {
                                                for (p = D(a / 864e5), u = D(p / 365.2425) + 1970 - 1; P(u + 1, 0) <= p; u++);
                                                for (h = D((p - P(u, 0)) / 30.42); P(u, h + 1) <= p; h++);
                                                p = 1 + p - P(u, h), f = (a % 864e5 + 864e5) % 864e5, g = D(f / 36e5) % 24, b = D(f / 6e4) % 60, w = D(f / 1e3) % 60, A = f % 1e3
                                            } else u = a.getUTCFullYear(), h = a.getUTCMonth(), p = a.getUTCDate(), g = a.getUTCHours(), b = a.getUTCMinutes(), w = a.getUTCSeconds(), A = a.getUTCMilliseconds();
                                            a = (u <= 0 || u >= 1e4 ? (u < 0 ? "-" : "+") + E(6, u < 0 ? -u : u) : E(4, u)) + "-" + E(2, h + 1) + "-" + E(2, p) + "T" + E(2, g) + ":" + E(2, b) + ":" + E(2, w) + "." + E(3, A) + "Z"
                                        } else a = null;
                                        if (n && (a = n.call(e, t, a)), null === a) return "null";
                                        if ("[object Boolean]" == (c = v.call(a))) return "" + a;
                                        if (c == k) return a > -1 / 0 && a < 1 / 0 ? "" + a : "null";
                                        if (c == x) return T("" + a);
                                        if ("object" == typeof a) {
                                            for (L = i.length; L--;)
                                                if (i[L] === a) throw l();
                                            if (i.push(a), S = [], R = s, s += r, c == C) {
                                                for (I = 0, L = a.length; I < L; I++) M = B(I, a, n, o, r, s, i), S.push(M === m ? "null" : M);
                                                U = S.length ? r ? "[\n" + s + S.join(",\n" + s) + "\n" + R + "]" : "[" + S.join(",") + "]" : "[]"
                                            } else y(o || a, function(t) {
                                                var e = B(t, a, n, o, r, s, i);
                                                e !== m && S.push(T(t) + ":" + (r ? " " : "") + e)
                                            }), U = S.length ? r ? "{\n" + s + S.join(",\n" + s) + "\n" + R + "}" : "{" + S.join(",") + "}" : "{}";
                                            return i.pop(), U
                                        }
                                    };
                                e.stringify = function(t, e, n) {
                                    var o, r, s, i;
                                    if (a[typeof e] && e)
                                        if ((i = v.call(e)) == w) r = e;
                                        else if (i == C) {
                                        s = {};
                                        for (var c, u = 0, h = e.length; u < h; c = e[u++], ((i = v.call(c)) == x || i == k) && (s[c] = 1));
                                    }
                                    if (n)
                                        if ((i = v.call(n)) == k) {
                                            if ((n -= n % 1) > 0)
                                                for (o = "", n > 10 && (n = 10); o.length < n; o += " ");
                                        } else i == x && (o = n.length <= 10 ? n : n.slice(0, 10));
                                    return B("", (c = {}, c[""] = t, c), r, s, o, "", [])
                                }
                            }
                            if (!n("json-parse")) {
                                var I, L, R = r.fromCharCode,
                                    U = {
                                        92: "\\",
                                        34: '"',
                                        47: "/",
                                        98: "\b",
                                        116: "\t",
                                        110: "\n",
                                        102: "\f",
                                        114: "\r"
                                    },
                                    _ = function() {
                                        throw I = L = null, h()
                                    },
                                    N = function() {
                                        for (var t, e, n, o, r, s = L, i = s.length; I < i;) switch (r = s.charCodeAt(I)) {
                                            case 9:
                                            case 10:
                                            case 13:
                                            case 32:
                                                I++;
                                                break;
                                            case 123:
                                            case 125:
                                            case 91:
                                            case 93:
                                            case 58:
                                            case 44:
                                                return t = A ? s.charAt(I) : s[I], I++, t;
                                            case 34:
                                                for (t = "@", I++; I < i;)
                                                    if ((r = s.charCodeAt(I)) < 32) _();
                                                    else if (92 == r) switch (r = s.charCodeAt(++I)) {
                                                    case 92:
                                                    case 34:
                                                    case 47:
                                                    case 98:
                                                    case 116:
                                                    case 110:
                                                    case 102:
                                                    case 114:
                                                        t += U[r], I++;
                                                        break;
                                                    case 117:
                                                        for (e = ++I, n = I + 4; I < n; I++)(r = s.charCodeAt(I)) >= 48 && r <= 57 || r >= 97 && r <= 102 || r >= 65 && r <= 70 || _();
                                                        t += R("0x" + s.slice(e, I));
                                                        break;
                                                    default:
                                                        _()
                                                } else {
                                                    if (34 == r) break;
                                                    for (r = s.charCodeAt(I), e = I; r >= 32 && 92 != r && 34 != r;) r = s.charCodeAt(++I);
                                                    t += s.slice(e, I)
                                                }
                                                if (34 == s.charCodeAt(I)) return I++, t;
                                                _();
                                            default:
                                                if (e = I, 45 == r && (o = !0, r = s.charCodeAt(++I)), r >= 48 && r <= 57) {
                                                    for (48 == r && (r = s.charCodeAt(I + 1)) >= 48 && r <= 57 && _(), o = !1; I < i && (r = s.charCodeAt(I)) >= 48 && r <= 57; I++);
                                                    if (46 == s.charCodeAt(I)) {
                                                        for (n = ++I; n < i && (r = s.charCodeAt(n)) >= 48 && r <= 57; n++);
                                                        n == I && _(), I = n
                                                    }
                                                    if (101 == (r = s.charCodeAt(I)) || 69 == r) {
                                                        for (r = s.charCodeAt(++I), 43 != r && 45 != r || I++, n = I; n < i && (r = s.charCodeAt(n)) >= 48 && r <= 57; n++);
                                                        n == I && _(), I = n
                                                    }
                                                    return +s.slice(e, I)
                                                }
                                                if (o && _(), "true" == s.slice(I, I + 4)) return I += 4, !0;
                                                if ("false" == s.slice(I, I + 5)) return I += 5, !1;
                                                if ("null" == s.slice(I, I + 4)) return I += 4, null;
                                                _()
                                        }
                                        return "$"
                                    },
                                    O = function(t) {
                                        var e, n;
                                        if ("$" == t && _(), "string" == typeof t) {
                                            if ("@" == (A ? t.charAt(0) : t[0])) return t.slice(1);
                                            if ("[" == t) {
                                                for (e = [];
                                                    "]" != (t = N()); n || (n = !0)) n && ("," == t ? "]" == (t = N()) && _() : _()), "," == t && _(), e.push(O(t));
                                                return e
                                            }
                                            if ("{" == t) {
                                                for (e = {};
                                                    "}" != (t = N()); n || (n = !0)) n && ("," == t ? "}" == (t = N()) && _() : _()), "," != t && "string" == typeof t && "@" == (A ? t.charAt(0) : t[0]) && ":" == N() || _(), e[t.slice(1)] = O(N());
                                                return e
                                            }
                                            _()
                                        }
                                        return t
                                    },
                                    j = function(t, e, n) {
                                        var o = G(t, e, n);
                                        o === m ? delete t[e] : t[e] = o
                                    },
                                    G = function(t, e, n) {
                                        var o, r = t[e];
                                        if ("object" == typeof r && r)
                                            if (v.call(r) == C)
                                                for (o = r.length; o--;) j(r, o, n);
                                            else y(r, function(t) {
                                                j(r, t, n)
                                            });
                                        return n.call(t, e, r)
                                    };
                                e.parse = function(t, e) {
                                    var n, o;
                                    return I = 0, L = "" + t, n = O(N()), "$" != N() && _(), I = L = null, e && v.call(e) == w ? G((o = {}, o[""] = n, o), "", e) : n
                                }
                            }
                        }
                        return e.runInContext = s, e
                    }
                    var i = "function" == typeof r && r.amd,
                        a = {
                            function: !0,
                            object: !0
                        },
                        c = a[typeof n] && n && !n.nodeType && n,
                        u = a[typeof t] && t || this,
                        h = c && a[typeof e] && e && !e.nodeType && "object" == typeof o && o;
                    if (!h || h.global !== h && h.window !== h && h.self !== h || (u = h), c && !i) s(u, c);
                    else {
                        var l = u.JSON,
                            p = u.JSON3,
                            f = !1,
                            d = s(u, u.JSON3 = {
                                noConflict: function() {
                                    return f || (f = !0, u.JSON = l, u.JSON3 = p, l = p = null), d
                                }
                            });
                        u.JSON = {
                            parse: d.parse,
                            stringify: d.stringify
                        }
                    }
                    i && r(function() {
                        return d
                    })
                }).call(this)
            }).call(n, o(12)(e), function() {
                return this
            }())
        }, function(t, e) {
            t.exports = function(t) {
                return t.webpackPolyfill || (t.deprecate = function() {}, t.paths = [], t.children = [], t.webpackPolyfill = 1), t
            }
        }, function(t, e) {
            function n(t) {
                if (t) return o(t)
            }

            function o(t) {
                for (var e in n.prototype) t[e] = n.prototype[e];
                return t
            }
                t.exports = n, n.prototype.on = n.prototype.addEventListener = function (t, e) {
                return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this
            }, n.prototype.once = function(t, e) {
                function n() {
                    o.off(t, n), e.apply(this, arguments)
                }
                var o = this;
                return this._callbacks = this._callbacks || {}, n.fn = e, this.on(t, n), this
            }, n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function(t, e) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var n = this._callbacks[t];
                if (!n) return this;
                if (1 == arguments.length) return delete this._callbacks[t], this;
                for (var o, r = 0; r < n.length; r++)
                    if ((o = n[r]) === e || o.fn === e) {
                        n.splice(r, 1);
                        break
                    } return this
            }, n.prototype.emit = function(t) {
                this._callbacks = this._callbacks || {};
                var e = [].slice.call(arguments, 1),
                    n = this._callbacks[t];
                if (n) {
                    n = n.slice(0);
                    for (var o = 0, r = n.length; o < r; ++o) n[o].apply(this, e)
                }
                return this
            }, n.prototype.listeners = function(t) {
                return this._callbacks = this._callbacks || {}, this._callbacks[t] || []
            }, n.prototype.hasListeners = function(t) {
                return !!this.listeners(t).length
            }
        }, function(t, e, n) {
            (function(t) {
                var o = n(15),
                    r = n(16);
                e.deconstructPacket = function(t) {
                    function e(t) {
                        if (!t) return t;
                        if (r(t)) {
                            var s = {
                                _placeholder: !0,
                                num: n.length
                            };
                            return n.push(t), s
                        }
                        if (o(t)) {
                            for (var i = new Array(t.length), a = 0; a < t.length; a++) i[a] = e(t[a]);
                            return i
                        }
                        if ("object" == typeof t && !(t instanceof Date)) {
                            var i = {};
                            for (var c in t) i[c] = e(t[c]);
                            return i
                        }
                        return t
                    }
                    var n = [],
                        s = t.data,
                        i = t;
                    return i.data = e(s), i.attachments = n.length, {
                        packet: i,
                        buffers: n
                    }
                }, e.reconstructPacket = function(t, e) {
                    function n(t) {
                        if (t && t._placeholder) {
                            return e[t.num]
                        }
                        if (o(t)) {
                            for (var r = 0; r < t.length; r++) t[r] = n(t[r]);
                            return t
                        }
                        if (t && "object" == typeof t) {
                            for (var s in t) t[s] = n(t[s]);
                            return t
                        }
                        return t
                    }
                    return t.data = n(t.data), t.attachments = void 0, t
                }, e.removeBlobs = function(e, n) {
                    function s(e, c, u) {
                        if (!e) return e;
                        if (t.Blob && e instanceof Blob || t.File && e instanceof File) {
                            i++;
                            var h = new FileReader;
                            h.onload = function() {
                                u ? u[c] = this.result : a = this.result, --i || n(a)
                            }, h.readAsArrayBuffer(e)
                        } else if (o(e))
                            for (var l = 0; l < e.length; l++) s(e[l], l, e);
                        else if (e && "object" == typeof e && !r(e))
                            for (var p in e) s(e[p], p, e)
                    }
                    var i = 0,
                        a = e;
                    s(a), i || n(a)
                }
            }).call(e, function() {
                return this
            }())
        }, function(t, e) {
            t.exports = Array.isArray || function(t) {
                return "[object Array]" == Object.prototype.toString.call(t)
            }
        }, function(t, e) {
            (function(e) {
                function n(t) {
                    return e.Buffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer
                }
                t.exports = n
            }).call(e, function() {
                return this
            }())
        }, function(t, e, n) {
            "use strict";

            function o(t, e) {
                return this instanceof o ? (t && "object" === (void 0 === t ? "undefined" : r(t)) && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(!1 !== e.reconnection), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new f({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", this.uri = t, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [], this.encoder = new c.Encoder, this.decoder = new c.Decoder, this.autoConnect = !1 !== e.autoConnect, void(this.autoConnect && this.open())) : new o(t, e)
            }
            var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                },
                s = n(18),
                i = n(44),
                a = n(35),
                c = n(7),
                u = n(46),
                h = n(47),
                l = n(3)("socket.io-client:manager"),
                p = n(42),
                f = n(48),
                d = Object.prototype.hasOwnProperty;
            t.exports = o, o.prototype.emitAll = function() {
                this.emit.apply(this, arguments);
                for (var t in this.nsps) d.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
            }, o.prototype.updateSocketIds = function() {
                for (var t in this.nsps) d.call(this.nsps, t) && (this.nsps[t].id = this.engine.id)
            }, a(o.prototype), o.prototype.reconnection = function(t) {
                return arguments.length ? (this._reconnection = !!t, this) : this._reconnection
            }, o.prototype.reconnectionAttempts = function(t) {
                return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts
            }, o.prototype.reconnectionDelay = function(t) {
                return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay
            }, o.prototype.randomizationFactor = function(t) {
                return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor
            }, o.prototype.reconnectionDelayMax = function(t) {
                return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax
            }, o.prototype.timeout = function(t) {
                return arguments.length ? (this._timeout = t, this) : this._timeout
            }, o.prototype.maybeReconnectOnOpen = function() {
                !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
            }, o.prototype.open = o.prototype.connect = function(t, e) {
                if (l("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
                l("opening %s", this.uri), this.engine = s(this.uri, this.opts);
                var n = this.engine,
                    o = this;
                this.readyState = "opening", this.skipReconnect = !1;
                var r = u(n, "open", function() {
                        o.onopen(), t && t()
                    }),
                    i = u(n, "error", function(e) {
                        if (l("connect_error"), o.cleanup(), o.readyState = "closed", o.emitAll("connect_error", e), t) {
                            var n = new Error("Connection error");
                            n.data = e, t(n)
                        } else o.maybeReconnectOnOpen()
                    });
                if (!1 !== this._timeout) {
                    var a = this._timeout;
                    l("connect attempt will timeout after %d", a);
                    var c = setTimeout(function() {
                        l("connect attempt timed out after %d", a), r.destroy(), n.close(), n.emit("error", "timeout"), o.emitAll("connect_timeout", a)
                    }, a);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(c)
                        }
                    })
                }
                return this.subs.push(r), this.subs.push(i), this
            }, o.prototype.onopen = function() {
                l("open"), this.cleanup(), this.readyState = "open", this.emit("open");
                var t = this.engine;
                this.subs.push(u(t, "data", h(this, "ondata"))), this.subs.push(u(t, "ping", h(this, "onping"))), this.subs.push(u(t, "pong", h(this, "onpong"))), this.subs.push(u(t, "error", h(this, "onerror"))), this.subs.push(u(t, "close", h(this, "onclose"))), this.subs.push(u(this.decoder, "decoded", h(this, "ondecoded")))
            }, o.prototype.onping = function() {
                this.lastPing = new Date, this.emitAll("ping")
            }, o.prototype.onpong = function() {
                this.emitAll("pong", new Date - this.lastPing)
            }, o.prototype.ondata = function(t) {
                this.decoder.add(t)
            }, o.prototype.ondecoded = function(t) {
                this.emit("packet", t)
            }, o.prototype.onerror = function(t) {
                l("error", t), this.emitAll("error", t)
            }, o.prototype.socket = function(t, e) {
                function n() {
                    ~p(r.connecting, o) || r.connecting.push(o)
                }
                var o = this.nsps[t];
                if (!o) {
                    o = new i(this, t, e), this.nsps[t] = o;
                    var r = this;
                    o.on("connecting", n), o.on("connect", function() {
                        o.id = r.engine.id
                    }), this.autoConnect && n()
                }
                return o
            }, o.prototype.destroy = function(t) {
                var e = p(this.connecting, t);
                ~e && this.connecting.splice(e, 1), this.connecting.length || this.close()
            }, o.prototype.packet = function(t) {
                l("writing packet %j", t);
                var e = this;
                t.query && 0 === t.type && (t.nsp += "?" + t.query), e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function(n) {
                    for (var o = 0; o < n.length; o++) e.engine.write(n[o], t.options);
                    e.encoding = !1, e.processPacketQueue()
                }))
            }, o.prototype.processPacketQueue = function() {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var t = this.packetBuffer.shift();
                    this.packet(t)
                }
            }, o.prototype.cleanup = function() {
                l("cleanup");
                for (var t = this.subs.length, e = 0; e < t; e++) {
                    this.subs.shift().destroy()
                }
                this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy()
            }, o.prototype.close = o.prototype.disconnect = function() {
                l("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
            }, o.prototype.onclose = function(t) {
                l("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect()
            }, o.prototype.reconnect = function() {
                if (this.reconnecting || this.skipReconnect) return this;
                var t = this;
                if (this.backoff.attempts >= this._reconnectionAttempts) l("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;
                else {
                    var e = this.backoff.duration();
                    l("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
                    var n = setTimeout(function() {
                        t.skipReconnect || (l("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function(e) {
                            e ? (l("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (l("reconnect success"), t.onreconnect())
                        }))
                    }, e);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(n)
                        }
                    })
                }
            }, o.prototype.onreconnect = function() {
                var t = this.backoff.attempts;
                this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t)
            }
        }, function(t, e, n) {
            t.exports = n(19)
        }, function(t, e, n) {
            t.exports = n(20), t.exports.parser = n(27)
        }, function(t, e, n) {
            (function(e) {
                function o(t, n) {
                    if (!(this instanceof o)) return new o(t, n);
                    n = n || {}, t && "object" == typeof t && (n = t, t = null), t ? (t = h(t), n.hostname = t.host, n.secure = "https" === t.protocol || "wss" === t.protocol, n.port = t.port, t.query && (n.query = t.query)) : n.host && (n.hostname = h(n.host).host), this.secure = null != n.secure ? n.secure : e.location && "https:" === location.protocol, n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.agent = n.agent || !1, this.hostname = n.hostname || (e.location ? location.hostname : "localhost"), this.port = n.port || (e.location && location.port ? location.port : this.secure ? 443 : 80), this.query = n.query || {}, "string" == typeof this.query && (this.query = p.decode(this.query)), this.upgrade = !1 !== n.upgrade, this.path = (n.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!n.forceJSONP, this.jsonp = !1 !== n.jsonp, this.forceBase64 = !!n.forceBase64, this.enablesXDR = !!n.enablesXDR, this.timestampParam = n.timestampParam || "t", this.timestampRequests = n.timestampRequests, this.transports = n.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = n.policyPort || 843, this.rememberUpgrade = n.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = n.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== n.perMessageDeflate && (n.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = n.pfx || null, this.key = n.key || null, this.passphrase = n.passphrase || null, this.cert = n.cert || null, this.ca = n.ca || null, this.ciphers = n.ciphers || null, this.rejectUnauthorized = void 0 === n.rejectUnauthorized ? null : n.rejectUnauthorized, this.forceNode = !!n.forceNode;
                    var r = "object" == typeof e && e;
                    r.global === r && (n.extraHeaders && Object.keys(n.extraHeaders).length > 0 && (this.extraHeaders = n.extraHeaders), n.localAddress && (this.localAddress = n.localAddress)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, this.pingTimeoutTimer = null, this.open()
                }

                function r(t) {
                    var e = {};
                    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
                    return e
                }
                var s = n(21),
                    i = n(35),
                    a = n(3)("engine.io-client:socket"),
                    c = n(42),
                    u = n(27),
                    h = n(2),
                    l = n(43),
                    p = n(36);
                t.exports = o, o.priorWebsocketSuccess = !1, i(o.prototype), o.protocol = u.protocol, o.Socket = o, o.Transport = n(26), o.transports = n(21), o.parser = n(27), o.prototype.createTransport = function(t) {
                    a('creating transport "%s"', t);
                    var e = r(this.query);
                    return e.EIO = u.protocol, e.transport = t, this.id && (e.sid = this.id), new s[t]({
                        agent: this.agent,
                        hostname: this.hostname,
                        port: this.port,
                        secure: this.secure,
                        path: this.path,
                        query: e,
                        forceJSONP: this.forceJSONP,
                        jsonp: this.jsonp,
                        forceBase64: this.forceBase64,
                        enablesXDR: this.enablesXDR,
                        timestampRequests: this.timestampRequests,
                        timestampParam: this.timestampParam,
                        policyPort: this.policyPort,
                        socket: this,
                        pfx: this.pfx,
                        key: this.key,
                        passphrase: this.passphrase,
                        cert: this.cert,
                        ca: this.ca,
                        ciphers: this.ciphers,
                        rejectUnauthorized: this.rejectUnauthorized,
                        perMessageDeflate: this.perMessageDeflate,
                        extraHeaders: this.extraHeaders,
                        forceNode: this.forceNode,
                        localAddress: this.localAddress
                    })
                }, o.prototype.open = function() {
                    var t;
                    if (this.rememberUpgrade && o.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) t = "websocket";
                    else {
                        if (0 === this.transports.length) {
                            var e = this;
                            return void setTimeout(function() {
                                e.emit("error", "No transports available")
                            }, 0)
                        }
                        t = this.transports[0]
                    }
                    this.readyState = "opening";
                    try {
                        t = this.createTransport(t)
                    } catch (t) {
                        return this.transports.shift(), void this.open()
                    }
                    t.open(), this.setTransport(t)
                }, o.prototype.setTransport = function(t) {
                    a("setting transport %s", t.name);
                    var e = this;
                    this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on("drain", function() {
                        e.onDrain()
                    }).on("packet", function(t) {
                        e.onPacket(t)
                    }).on("error", function(t) {
                        e.onError(t)
                    }).on("close", function() {
                        e.onClose("transport close")
                    })
                }, o.prototype.probe = function(t) {
                    function e() {
                        if (p.onlyBinaryUpgrades) {
                            var e = !this.supportsBinary && p.transport.supportsBinary;
                            l = l || e
                        }
                        l || (a('probe transport "%s" opened', t), h.send([{
                            type: "ping",
                            data: "probe"
                        }]), h.once("packet", function(e) {
                            if (!l)
                                if ("pong" === e.type && "probe" === e.data) {
                                    if (a('probe transport "%s" pong', t), p.upgrading = !0, p.emit("upgrading", h), !h) return;
                                    o.priorWebsocketSuccess = "websocket" === h.name, a('pausing current transport "%s"', p.transport.name), p.transport.pause(function() {
                                        l || "closed" !== p.readyState && (a("changing transport and sending upgrade packet"), u(), p.setTransport(h), h.send([{
                                            type: "upgrade"
                                        }]), p.emit("upgrade", h), h = null, p.upgrading = !1, p.flush())
                                    })
                                } else {
                                    a('probe transport "%s" failed', t);
                                    var n = new Error("probe error");
                                    n.transport = h.name, p.emit("upgradeError", n)
                                }
                        }))
                    }

                    function n() {
                        l || (l = !0, u(), h.close(), h = null)
                    }

                    function r(e) {
                        var o = new Error("probe error: " + e);
                        o.transport = h.name, n(), a('probe transport "%s" failed because of error: %s', t, e), p.emit("upgradeError", o)
                    }

                    function s() {
                        r("transport closed")
                    }

                    function i() {
                        r("socket closed")
                    }

                    function c(t) {
                        h && t.name !== h.name && (a('"%s" works - aborting "%s"', t.name, h.name), n())
                    }

                    function u() {
                        h.removeListener("open", e), h.removeListener("error", r), h.removeListener("close", s), p.removeListener("close", i), p.removeListener("upgrading", c)
                    }
                    a('probing transport "%s"', t);
                    var h = this.createTransport(t, {
                            probe: 1
                        }),
                        l = !1,
                        p = this;
                    o.priorWebsocketSuccess = !1, h.once("open", e), h.once("error", r), h.once("close", s), this.once("close", i), this.once("upgrading", c), h.open()
                }, o.prototype.onOpen = function() {
                    if (a("socket open"), this.readyState = "open", o.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
                        a("starting upgrade probes");
                        for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t])
                    }
                }, o.prototype.onPacket = function(t) {
                    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), this.emit("packet", t), this.emit("heartbeat"), t.type) {
                        case "open":
                            this.onHandshake(l(t.data));
                            break;
                        case "pong":
                            this.setPing(), this.emit("pong");
                            break;
                        case "error":
                            var e = new Error("server error");
                            e.code = t.data, this.onError(e);
                            break;
                        case "message":
                            this.emit("data", t.data), this.emit("message", t.data)
                    } else a('packet received with socket readyState "%s"', this.readyState)
                }, o.prototype.onHandshake = function(t) {
                    this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
                }, o.prototype.onHeartbeat = function(t) {
                    clearTimeout(this.pingTimeoutTimer);
                    var e = this;
                    e.pingTimeoutTimer = setTimeout(function() {
                        "closed" !== e.readyState && e.onClose("ping timeout")
                    }, t || e.pingInterval + e.pingTimeout)
                }, o.prototype.setPing = function() {
                    var t = this;
                    clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function() {
                        a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout)
                    }, t.pingInterval)
                }, o.prototype.ping = function() {
                    var t = this;
                    this.sendPacket("ping", function() {
                        t.emit("ping")
                    })
                }, o.prototype.onDrain = function() {
                    this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
                }, o.prototype.flush = function() {
                    "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
                }, o.prototype.write = o.prototype.send = function(t, e, n) {
                    return this.sendPacket("message", t, e, n), this
                }, o.prototype.sendPacket = function(t, e, n, o) {
                    if ("function" == typeof e && (o = e, e = void 0), "function" == typeof n && (o = n, n = null), "closing" !== this.readyState && "closed" !== this.readyState) {
                        n = n || {}, n.compress = !1 !== n.compress;
                        var r = {
                            type: t,
                            data: e,
                            options: n
                        };
                        this.emit("packetCreate", r), this.writeBuffer.push(r), o && this.once("flush", o), this.flush()
                    }
                }, o.prototype.close = function() {
                    function t() {
                        o.onClose("forced close"), a("socket closing - telling transport to close"), o.transport.close()
                    }

                    function e() {
                        o.removeListener("upgrade", e), o.removeListener("upgradeError", e), t()
                    }

                    function n() {
                        o.once("upgrade", e), o.once("upgradeError", e)
                    }
                    if ("opening" === this.readyState || "open" === this.readyState) {
                        this.readyState = "closing";
                        var o = this;
                        this.writeBuffer.length ? this.once("drain", function() {
                            this.upgrading ? n() : t()
                        }) : this.upgrading ? n() : t()
                    }
                    return this
                }, o.prototype.onError = function(t) {
                    a("socket error %j", t), o.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t)
                }, o.prototype.onClose = function(t, e) {
                    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                        a('socket close with reason: "%s"', t);
                        var n = this;
                        clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e), n.writeBuffer = [], n.prevBufferLen = 0
                    }
                }, o.prototype.filterUpgrades = function(t) {
                    for (var e = [], n = 0, o = t.length; n < o; n++) ~c(this.transports, t[n]) && e.push(t[n]);
                    return e
                }
            }).call(e, function() {
                return this
            }())
        }, function(t, e, n) {
            (function(t) {
                function o(e) {
                    var n = !1,
                        o = !1,
                        a = !1 !== e.jsonp;
                    if (t.location) {
                        var c = "https:" === location.protocol,
                            u = location.port;
                        u || (u = c ? 443 : 80), n = e.hostname !== location.hostname || u !== e.port, o = e.secure !== c
                    }
                    if (e.xdomain = n, e.xscheme = o, "open" in new r(e) && !e.forceJSONP) return new s(e);
                    if (!a) throw new Error("JSONP disabled");
                    return new i(e)
                }
                var r = n(22),
                    s = n(24),
                    i = n(39),
                    a = n(40);
                e.polling = o, e.websocket = a
            }).call(e, function() {
                return this
            }())
        }, function(t, e, n) {
            (function(e) {
                var o = n(23);
                t.exports = function(t) {
                    var n = t.xdomain,
                        r = t.xscheme,
                        s = t.enablesXDR;
                    try {
                        if ("undefined" != typeof XMLHttpRequest && (!n || o)) return new XMLHttpRequest
                    } catch (t) {}
                    try {
                        if ("undefined" != typeof XDomainRequest && !r && s) return new XDomainRequest
                    } catch (t) {}
                    if (!n) try {
                        return new(e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                    } catch (t) {}
                }
            }).call(e, function() {
                return this
            }())
        }, function(t, e) {
            try {
                t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest
            } catch (e) {
                t.exports = !1
            }
        }, function(t, e, n) {
            (function(e) {
                function o() {}

                function r(t) {
                    if (c.call(this, t), this.requestTimeout = t.requestTimeout, e.location) {
                        var n = "https:" === location.protocol,
                            o = location.port;
                        o || (o = n ? 443 : 80), this.xd = t.hostname !== e.location.hostname || o !== t.port, this.xs = t.secure !== n
                    } else this.extraHeaders = t.extraHeaders
                }

                function s(t) {
                    this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 !== t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.requestTimeout = t.requestTimeout, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.extraHeaders = t.extraHeaders, this.create()
                }

                function i() {
                    for (var t in s.requests) s.requests.hasOwnProperty(t) && s.requests[t].abort()
                }
                var a = n(22),
                    c = n(25),
                    u = n(35),
                    h = n(37),
                    l = n(3)("engine.io-client:polling-xhr");
                t.exports = r, t.exports.Request = s, h(r, c), r.prototype.supportsBinary = !0, r.prototype.request = function(t) {
                    return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, t.requestTimeout = this.requestTimeout, t.extraHeaders = this.extraHeaders, new s(t)
                }, r.prototype.doWrite = function(t, e) {
                    var n = "string" != typeof t && void 0 !== t,
                        o = this.request({
                            method: "POST",
                            data: t,
                            isBinary: n
                        }),
                        r = this;
                    o.on("success", e), o.on("error", function(t) {
                        r.onError("xhr post error", t)
                    }), this.sendXhr = o
                }, r.prototype.doPoll = function() {
                    l("xhr poll");
                    var t = this.request(),
                        e = this;
                    t.on("data", function(t) {
                        e.onData(t)
                    }), t.on("error", function(t) {
                        e.onError("xhr poll error", t)
                    }), this.pollXhr = t
                }, u(s.prototype), s.prototype.create = function() {
                    var t = {
                        agent: this.agent,
                        xdomain: this.xd,
                        xscheme: this.xs,
                        enablesXDR: this.enablesXDR
                    };
                    t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
                    var n = this.xhr = new a(t),
                        o = this;
                    try {
                        l("xhr open %s: %s", this.method, this.uri), n.open(this.method, this.uri, this.async);
                        try {
                            if (this.extraHeaders) {
                                n.setDisableHeaderCheck(!0);
                                for (var r in this.extraHeaders) this.extraHeaders.hasOwnProperty(r) && n.setRequestHeader(r, this.extraHeaders[r])
                            }
                        } catch (t) {}
                        if (this.supportsBinary && (n.responseType = "arraybuffer"), "POST" === this.method) try {
                            this.isBinary ? n.setRequestHeader("Content-type", "application/octet-stream") : n.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        } catch (t) {}
                        try {
                            n.setRequestHeader("Accept", "*/*")
                        } catch (t) {}
                        "withCredentials" in n && (n.withCredentials = !0), this.requestTimeout && (n.timeout = this.requestTimeout), this.hasXDR() ? (n.onload = function() {
                            o.onLoad()
                        }, n.onerror = function() {
                            o.onError(n.responseText)
                        }) : n.onreadystatechange = function() {
                            4 === n.readyState && (200 === n.status || 1223 === n.status ? o.onLoad() : setTimeout(function() {
                                o.onError(n.status)
                            }, 0))
                        }, l("xhr data %s", this.data), n.send(this.data)
                    } catch (t) {
                        return void setTimeout(function() {
                            o.onError(t)
                        }, 0)
                    }
                    e.document && (this.index = s.requestsCount++, s.requests[this.index] = this)
                }, s.prototype.onSuccess = function() {
                    this.emit("success"), this.cleanup()
                }, s.prototype.onData = function(t) {
                    this.emit("data", t), this.onSuccess()
                }, s.prototype.onError = function(t) {
                    this.emit("error", t), this.cleanup(!0)
                }, s.prototype.cleanup = function(t) {
                    if (void 0 !== this.xhr && null !== this.xhr) {
                        if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = o : this.xhr.onreadystatechange = o, t) try {
                            this.xhr.abort()
                        } catch (t) {}
                        e.document && delete s.requests[this.index], this.xhr = null
                    }
                }, s.prototype.onLoad = function() {
                    var t;
                    try {
                        var e;
                        try {
                            e = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                        } catch (t) {}
                        if ("application/octet-stream" === e) t = this.xhr.response || this.xhr.responseText;
                        else if (this.supportsBinary) try {
                            t = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response))
                        } catch (e) {
                            for (var n = new Uint8Array(this.xhr.response), o = [], r = 0, s = n.length; r < s; r++) o.push(n[r]);
                            t = String.fromCharCode.apply(null, o)
                        } else t = this.xhr.responseText
                    } catch (t) {
                        this.onError(t)
                    }
                    null != t && this.onData(t)
                }, s.prototype.hasXDR = function() {
                    return void 0 !== e.XDomainRequest && !this.xs && this.enablesXDR
                }, s.prototype.abort = function() {
                    this.cleanup()
                }, s.requestsCount = 0, s.requests = {}, e.document && (e.attachEvent ? e.attachEvent("onunload", i) : e.addEventListener && e.addEventListener("beforeunload", i, !1))
            }).call(e, function() {
                return this
            }())
        }, function(t, e, n) {
            function o(t) {
                var e = t && t.forceBase64;
                h && !e || (this.supportsBinary = !1), r.call(this, t)
            }
            var r = n(26),
                s = n(36),
                i = n(27),
                a = n(37),
                c = n(38),
                u = n(3)("engine.io-client:polling");
            t.exports = o;
            var h = function() {
                return null != new(n(22))({
                    xdomain: !1
                }).responseType
            }();
            a(o, r), o.prototype.name = "polling", o.prototype.doOpen = function() {
                this.poll()
            }, o.prototype.pause = function(t) {
                function e() {
                    u("paused"), n.readyState = "paused", t()
                }
                var n = this;
                if (this.readyState = "pausing", this.polling || !this.writable) {
                    var o = 0;
                    this.polling && (u("we are currently polling - waiting to pause"), o++, this.once("pollComplete", function() {
                        u("pre-pause polling complete"), --o || e()
                    })), this.writable || (u("we are currently writing - waiting to pause"), o++, this.once("drain", function() {
                        u("pre-pause writing complete"), --o || e()
                    }))
                } else e()
            }, o.prototype.poll = function() {
                u("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
            }, o.prototype.onData = function(t) {
                var e = this;
                u("polling got data %s", t);
                var n = function(t, n, o) {
                    return "opening" === e.readyState && e.onOpen(), "close" === t.type ? (e.onClose(), !1) : void e.onPacket(t)
                };
                i.decodePayload(t, this.socket.binaryType, n), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : u('ignoring poll - transport state "%s"', this.readyState))
            }, o.prototype.doClose = function() {
                function t() {
                    u("writing close packet"), e.write([{
                        type: "close"
                    }])
                }
                var e = this;
                "open" === this.readyState ? (u("transport open - closing"), t()) : (u("transport not open - deferring close"), this.once("open", t))
            }, o.prototype.write = function(t) {
                var e = this;
                this.writable = !1;
                var n = function() {
                    e.writable = !0, e.emit("drain")
                };
                i.encodePayload(t, this.supportsBinary, function(t) {
                    e.doWrite(t, n)
                })
            }, o.prototype.uri = function() {
                var t = this.query || {},
                    e = this.secure ? "https" : "http",
                    n = "";
                return !1 !== this.timestampRequests && (t[this.timestampParam] = c()), this.supportsBinary || t.sid || (t.b64 = 1), t = s.encode(t), this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (n = ":" + this.port), t.length && (t = "?" + t), e + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t
            }
        }, function(t, e, n) {
            function o(t) {
                this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.forceNode = t.forceNode, this.extraHeaders = t.extraHeaders, this.localAddress = t.localAddress
            }
            var r = n(27),
                s = n(35);
            t.exports = o, s(o.prototype), o.prototype.onError = function(t, e) {
                var n = new Error(t);
                return n.type = "TransportError", n.description = e, this.emit("error", n), this
            }, o.prototype.open = function() {
                return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this
            }, o.prototype.close = function() {
                return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this
            }, o.prototype.send = function(t) {
                if ("open" !== this.readyState) throw new Error("Transport not open");
                this.write(t)
            }, o.prototype.onOpen = function() {
                this.readyState = "open", this.writable = !0, this.emit("open")
            }, o.prototype.onData = function(t) {
                var e = r.decodePacket(t, this.socket.binaryType);
                this.onPacket(e)
            }, o.prototype.onPacket = function(t) {
                this.emit("packet", t)
            }, o.prototype.onClose = function() {
                this.readyState = "closed", this.emit("close")
            }
        }, function(t, e, n) {
            (function(t) {
                function o(t, n) {
                    return n("b" + e.packets[t.type] + t.data.data)
                }

                function r(t, n, o) {
                    if (!n) return e.encodeBase64Packet(t, o);
                    var r = t.data,
                        s = new Uint8Array(r),
                        i = new Uint8Array(1 + r.byteLength);
                    i[0] = v[t.type];
                    for (var a = 0; a < s.length; a++) i[a + 1] = s[a];
                    return o(i.buffer)
                }

                function s(t, n, o) {
                    if (!n) return e.encodeBase64Packet(t, o);
                    var r = new FileReader;
                    return r.onload = function() {
                        t.data = r.result, e.encodePacket(t, n, !0, o)
                    }, r.readAsArrayBuffer(t.data)
                }

                function i(t, n, o) {
                    if (!n) return e.encodeBase64Packet(t, o);
                    if (g) return s(t, n, o);
                    var r = new Uint8Array(1);
                    return r[0] = v[t.type], o(new k([r.buffer, t.data]))
                }

                function a(t) {
                    try {
                        t = d.decode(t)
                    } catch (t) {
                        return !1
                    }
                    return t
                }

                function c(t, e, n) {
                    for (var o = new Array(t.length), r = f(t.length, n), s = 0; s < t.length; s++) ! function(t, n, r) {
                        e(n, function(e, n) {
                            o[t] = n, r(e, o)
                        })
                    }(s, t[s], r)
                }
                var u, h = n(28),
                    l = n(29),
                    p = n(30),
                    f = n(31),
                    d = n(32);
                t && t.ArrayBuffer && (u = n(33));
                var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
                    m = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent),
                    g = y || m;
                e.protocol = 3;
                var v = e.packets = {
                        open: 0,
                        close: 1,
                        ping: 2,
                        pong: 3,
                        message: 4,
                        upgrade: 5,
                        noop: 6
                    },
                    b = h(v),
                    w = {
                        type: "error",
                        data: "parser error"
                    },
                    k = n(34);
                e.encodePacket = function(e, n, s, a) {
                    "function" == typeof n && (a = n, n = !1), "function" == typeof s && (a = s, s = null);
                    var c = void 0 === e.data ? void 0 : e.data.buffer || e.data;
                    if (t.ArrayBuffer && c instanceof ArrayBuffer) return r(e, n, a);
                    if (k && c instanceof t.Blob) return i(e, n, a);
                    if (c && c.base64) return o(e, a);
                    var u = v[e.type];
                    return void 0 !== e.data && (u += s ? d.encode(String(e.data)) : String(e.data)), a("" + u)
                }, e.encodeBase64Packet = function(n, o) {
                    var r = "b" + e.packets[n.type];
                    if (k && n.data instanceof t.Blob) {
                        var s = new FileReader;
                        return s.onload = function() {
                            var t = s.result.split(",")[1];
                            o(r + t)
                        }, s.readAsDataURL(n.data)
                    }
                    var i;
                    try {
                        i = String.fromCharCode.apply(null, new Uint8Array(n.data))
                    } catch (t) {
                        for (var a = new Uint8Array(n.data), c = new Array(a.length), u = 0; u < a.length; u++) c[u] = a[u];
                        i = String.fromCharCode.apply(null, c)
                    }
                    return r += t.btoa(i), o(r)
                }, e.decodePacket = function(t, n, o) {
                    if (void 0 === t) return w;
                    if ("string" == typeof t) {
                        if ("b" == t.charAt(0)) return e.decodeBase64Packet(t.substr(1), n);
                        if (o && !1 === (t = a(t))) return w;
                        var r = t.charAt(0);
                        return Number(r) == r && b[r] ? t.length > 1 ? {
                            type: b[r],
                            data: t.substring(1)
                        } : {
                            type: b[r]
                        } : w
                    }
                    var s = new Uint8Array(t),
                        r = s[0],
                        i = p(t, 1);
                    return k && "blob" === n && (i = new k([i])), {
                        type: b[r],
                        data: i
                    }
                }, e.decodeBase64Packet = function(t, e) {
                    var n = b[t.charAt(0)];
                    if (!u) return {
                        type: n,
                        data: {
                            base64: !0,
                            data: t.substr(1)
                        }
                    };
                    var o = u.decode(t.substr(1));
                    return "blob" === e && k && (o = new k([o])), {
                        type: n,
                        data: o
                    }
                }, e.encodePayload = function(t, n, o) {
                    function r(t) {
                        return t.length + ":" + t
                    }

                    function s(t, o) {
                        e.encodePacket(t, !!i && n, !0, function(t) {
                            o(null, r(t))
                        })
                    }
                    "function" == typeof n && (o = n, n = null);
                    var i = l(t);
                    return n && i ? k && !g ? e.encodePayloadAsBlob(t, o) : e.encodePayloadAsArrayBuffer(t, o) : t.length ? void c(t, s, function(t, e) {
                        return o(e.join(""))
                    }) : o("0:")
                }, e.decodePayload = function(t, n, o) {
                    if ("string" != typeof t) return e.decodePayloadAsBinary(t, n, o);
                    "function" == typeof n && (o = n, n = null);
                    var r;
                    if ("" == t) return o(w, 0, 1);
                    for (var s, i, a = "", c = 0, u = t.length; c < u; c++) {
                        var h = t.charAt(c);
                        if (":" != h) a += h;
                        else {
                            if ("" == a || a != (s = Number(a))) return o(w, 0, 1);
                            if (i = t.substr(c + 1, s), a != i.length) return o(w, 0, 1);
                            if (i.length) {
                                if (r = e.decodePacket(i, n, !0), w.type == r.type && w.data == r.data) return o(w, 0, 1);
                                if (!1 === o(r, c + s, u)) return
                            }
                            c += s, a = ""
                        }
                    }
                    return "" != a ? o(w, 0, 1) : void 0
                }, e.encodePayloadAsArrayBuffer = function(t, n) {
                    function o(t, n) {
                        e.encodePacket(t, !0, !0, function(t) {
                            return n(null, t)
                        })
                    }
                    return t.length ? void c(t, o, function(t, e) {
                        var o = e.reduce(function(t, e) {
                                var n;
                                return n = "string" == typeof e ? e.length : e.byteLength, t + n.toString().length + n + 2
                            }, 0),
                            r = new Uint8Array(o),
                            s = 0;
                        return e.forEach(function(t) {
                            var e = "string" == typeof t,
                                n = t;
                            if (e) {
                                for (var o = new Uint8Array(t.length), i = 0; i < t.length; i++) o[i] = t.charCodeAt(i);
                                n = o.buffer
                            }
                            r[s++] = e ? 0 : 1;
                            for (var a = n.byteLength.toString(), i = 0; i < a.length; i++) r[s++] = parseInt(a[i]);
                            r[s++] = 255;
                            for (var o = new Uint8Array(n), i = 0; i < o.length; i++) r[s++] = o[i]
                        }), n(r.buffer)
                    }) : n(new ArrayBuffer(0))
                }, e.encodePayloadAsBlob = function(t, n) {
                    function o(t, n) {
                        e.encodePacket(t, !0, !0, function(t) {
                            var e = new Uint8Array(1);
                            if (e[0] = 1, "string" == typeof t) {
                                for (var o = new Uint8Array(t.length), r = 0; r < t.length; r++) o[r] = t.charCodeAt(r);
                                t = o.buffer, e[0] = 0
                            }
                            for (var s = t instanceof ArrayBuffer ? t.byteLength : t.size, i = s.toString(), a = new Uint8Array(i.length + 1), r = 0; r < i.length; r++) a[r] = parseInt(i[r]);
                            if (a[i.length] = 255, k) {
                                var c = new k([e.buffer, a.buffer, t]);
                                n(null, c)
                            }
                        })
                    }
                    c(t, o, function(t, e) {
                        return n(new k(e))
                    })
                }, e.decodePayloadAsBinary = function(t, n, o) {
                    "function" == typeof n && (o = n, n = null);
                    for (var r = t, s = [], i = !1; r.byteLength > 0;) {
                        for (var a = new Uint8Array(r), c = 0 === a[0], u = "", h = 1; 255 != a[h]; h++) {
                            if (u.length > 310) {
                                i = !0;
                                break
                            }
                            u += a[h]
                        }
                        if (i) return o(w, 0, 1);
                        r = p(r, 2 + u.length), u = parseInt(u);
                        var l = p(r, 0, u);
                        if (c) try {
                            l = String.fromCharCode.apply(null, new Uint8Array(l))
                        } catch (t) {
                            var f = new Uint8Array(l);
                            l = "";
                            for (var h = 0; h < f.length; h++) l += String.fromCharCode(f[h])
                        }
                        s.push(l), r = p(r, u)
                    }
                    var d = s.length;
                    s.forEach(function(t, r) {
                        o(e.decodePacket(t, n, !0), r, d)
                    })
                }
            }).call(e, function() {
                return this
            }())
        }, function(t, e) {
            t.exports = Object.keys || function(t) {
                var e = [],
                    n = Object.prototype.hasOwnProperty;
                for (var o in t) n.call(t, o) && e.push(o);
                return e
            }
        }, function(t, e, n) {
            (function(e) {
                function o(t) {
                    function n(t) {
                        if (!t) return !1;
                        if (e.Buffer && e.Buffer.isBuffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer || e.Blob && t instanceof Blob || e.File && t instanceof File) return !0;
                        if (r(t)) {
                            for (var o = 0; o < t.length; o++)
                                if (n(t[o])) return !0
                        } else if (t && "object" == typeof t) {
                            t.toJSON && "function" == typeof t.toJSON && (t = t.toJSON());
                            for (var s in t)
                                if (Object.prototype.hasOwnProperty.call(t, s) && n(t[s])) return !0
                        }
                        return !1
                    }
                    return n(t)
                }
                var r = n(15);
                t.exports = o
            }).call(e, function() {
                return this
            }())
        }, function(t, e) {
            t.exports = function(t, e, n) {
                var o = t.byteLength;
                if (e = e || 0, n = n || o, t.slice) return t.slice(e, n);
                if (e < 0 && (e += o), n < 0 && (n += o), n > o && (n = o), e >= o || e >= n || 0 === o) return new ArrayBuffer(0);
                for (var r = new Uint8Array(t), s = new Uint8Array(n - e), i = e, a = 0; i < n; i++, a++) s[a] = r[i];
                return s.buffer
            }
        }, function(t, e) {
            function n(t, e, n) {
                function r(t, o) {
                    if (r.count <= 0) throw new Error("after called too many times");
                    --r.count, t ? (s = !0, e(t), e = n) : 0 !== r.count || s || e(null, o)
                }
                var s = !1;
                return n = n || o, r.count = t, 0 === t ? e() : r
            }

            function o() {}
            t.exports = n
        }, function(t, e, n) {
            var o;
            (function(t, r) {
                ! function(s) {
                    function i(t) {
                        for (var e, n, o = [], r = 0, s = t.length; r < s;) e = t.charCodeAt(r++), e >= 55296 && e <= 56319 && r < s ? (n = t.charCodeAt(r++), 56320 == (64512 & n) ? o.push(((1023 & e) << 10) + (1023 & n) + 65536) : (o.push(e), r--)) : o.push(e);
                        return o
                    }

                    function a(t) {
                        for (var e, n = t.length, o = -1, r = ""; ++o < n;) e = t[o], e > 65535 && (e -= 65536, r += v(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), r += v(e);
                        return r
                    }

                    function c(t, e) {
                        return v(t >> e & 63 | 128)
                    }

                    function u(t) {
                        if (0 == (4294967168 & t)) return v(t);
                        var e = "";
                        return 0 == (4294965248 & t) ? e = v(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (e = v(t >> 12 & 15 | 224), e += c(t, 6)) : 0 == (4292870144 & t) && (e = v(t >> 18 & 7 | 240), e += c(t, 12), e += c(t, 6)), e += v(63 & t | 128)
                    }

                    function h(t) {
                        for (var e, n = i(t), o = n.length, r = -1, s = ""; ++r < o;) e = n[r], s += u(e);
                        return s
                    }

                    function l() {
                        if (g >= m) throw Error("Invalid byte index");
                        var t = 255 & y[g];
                        if (g++, 128 == (192 & t)) return 63 & t;
                        throw Error("Invalid continuation byte")
                    }

                    function p() {
                        var t, e, n, o, r;
                        if (g > m) throw Error("Invalid byte index");
                        if (g == m) return !1;
                        if (t = 255 & y[g], g++, 0 == (128 & t)) return t;
                        if (192 == (224 & t)) {
                            var e = l();
                            if ((r = (31 & t) << 6 | e) >= 128) return r;
                            throw Error("Invalid continuation byte")
                        }
                        if (224 == (240 & t)) {
                            if (e = l(), n = l(), (r = (15 & t) << 12 | e << 6 | n) >= 2048) return r;
                            throw Error("Invalid continuation byte")
                        }
                        if (240 == (248 & t) && (e = l(), n = l(), o = l(), (r = (15 & t) << 18 | e << 12 | n << 6 | o) >= 65536 && r <= 1114111)) return r;
                        throw Error("Invalid WTF-8 detected")
                    }

                    function f(t) {
                        y = i(t), m = y.length, g = 0;
                        for (var e, n = []; !1 !== (e = p());) n.push(e);
                        return a(n)
                    }
                    var d = ("object" == typeof t && t && t.exports, "object" == typeof r && r);
                    var y, m, g, v = String.fromCharCode,
                        b = {
                            version: "1.0.0",
                            encode: h,
                            decode: f
                        };
                    void 0 !== (o = function() {
                        return b
                    }.call(e, n, e, t)) && (t.exports = o)
                }()
            }).call(e, n(12)(t), function() {
                return this
            }())
        }, function(t, e) {
            ! function() {
                "use strict";
                for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = new Uint8Array(256), o = 0; o < t.length; o++) n[t.charCodeAt(o)] = o;
                e.encode = function(e) {
                    var n, o = new Uint8Array(e),
                        r = o.length,
                        s = "";
                    for (n = 0; n < r; n += 3) s += t[o[n] >> 2], s += t[(3 & o[n]) << 4 | o[n + 1] >> 4], s += t[(15 & o[n + 1]) << 2 | o[n + 2] >> 6], s += t[63 & o[n + 2]];
                    return r % 3 == 2 ? s = s.substring(0, s.length - 1) + "=" : r % 3 == 1 && (s = s.substring(0, s.length - 2) + "=="), s
                }, e.decode = function(t) {
                    var e, o, r, s, i, a = .75 * t.length,
                        c = t.length,
                        u = 0;
                    "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
                    var h = new ArrayBuffer(a),
                        l = new Uint8Array(h);
                    for (e = 0; e < c; e += 4) o = n[t.charCodeAt(e)], r = n[t.charCodeAt(e + 1)], s = n[t.charCodeAt(e + 2)], i = n[t.charCodeAt(e + 3)], l[u++] = o << 2 | r >> 4, l[u++] = (15 & r) << 4 | s >> 2, l[u++] = (3 & s) << 6 | 63 & i;
                    return h
                }
            }()
        }, function(t, e) {
            (function(e) {
                function n(t) {
                    for (var e = 0; e < t.length; e++) {
                        var n = t[e];
                        if (n.buffer instanceof ArrayBuffer) {
                            var o = n.buffer;
                            if (n.byteLength !== o.byteLength) {
                                var r = new Uint8Array(n.byteLength);
                                r.set(new Uint8Array(o, n.byteOffset, n.byteLength)), o = r.buffer
                            }
                            t[e] = o
                        }
                    }
                }

                function o(t, e) {
                    e = e || {};
                    var o = new s;
                    n(t);
                    for (var r = 0; r < t.length; r++) o.append(t[r]);
                    return e.type ? o.getBlob(e.type) : o.getBlob()
                }

                function r(t, e) {
                    return n(t), new Blob(t, e || {})
                }
                var s = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder,
                    i = function() {
                        try {
                            return 2 === new Blob(["hi"]).size
                        } catch (t) {
                            return !1
                        }
                    }(),
                    a = i && function() {
                        try {
                            return 2 === new Blob([new Uint8Array([1, 2])]).size
                        } catch (t) {
                            return !1
                        }
                    }(),
                    c = s && s.prototype.append && s.prototype.getBlob;
                t.exports = function() {
                    return i ? a ? e.Blob : r : c ? o : void 0
                }()
            }).call(e, function() {
                return this
            }())
        }, function(t, e, n) {
            function o(t) {
                if (t) return r(t)
            }

            function r(t) {
                for (var e in o.prototype) t[e] = o.prototype[e];
                return t
            }
            t.exports = o, o.prototype.on = o.prototype.addEventListener = function(t, e) {
                return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this
            }, o.prototype.once = function(t, e) {
                function n() {
                    this.off(t, n), e.apply(this, arguments)
                }
                return n.fn = e, this.on(t, n), this
            }, o.prototype.off = o.prototype.removeListener = o.prototype.removeAllListeners = o.prototype.removeEventListener = function(t, e) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var n = this._callbacks["$" + t];
                if (!n) return this;
                if (1 == arguments.length) return delete this._callbacks["$" + t], this;
                for (var o, r = 0; r < n.length; r++)
                    if ((o = n[r]) === e || o.fn === e) {
                        n.splice(r, 1);
                        break
                    } return this
            }, o.prototype.emit = function(t) {
                this._callbacks = this._callbacks || {};
                var e = [].slice.call(arguments, 1),
                    n = this._callbacks["$" + t];
                if (n) {
                    n = n.slice(0);
                    for (var o = 0, r = n.length; o < r; ++o) n[o].apply(this, e)
                }
                return this
            }, o.prototype.listeners = function(t) {
                return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || []
            }, o.prototype.hasListeners = function(t) {
                return !!this.listeners(t).length
            }
        }, function(t, e) {
            e.encode = function(t) {
                var e = "";
                for (var n in t) t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
                return e
            }, e.decode = function(t) {
                for (var e = {}, n = t.split("&"), o = 0, r = n.length; o < r; o++) {
                    var s = n[o].split("=");
                    e[decodeURIComponent(s[0])] = decodeURIComponent(s[1])
                }
                return e
            }
        }, function(t, e) {
            t.exports = function(t, e) {
                var n = function() {};
                n.prototype = e.prototype, t.prototype = new n, t.prototype.constructor = t
            }
        }, function(t, e) {
            "use strict";

            function n(t) {
                var e = "";
                do {
                    e = i[t % a] + e, t = Math.floor(t / a)
                } while (t > 0);
                return e
            }

            function o(t) {
                var e = 0;
                for (h = 0; h < t.length; h++) e = e * a + c[t.charAt(h)];
                return e
            }

            function r() {
                var t = n(+new Date);
                return t !== s ? (u = 0, s = t) : t + "." + n(u++)
            }
            for (var s, i = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, u = 0, h = 0; h < a; h++) c[i[h]] = h;
            r.encode = n, r.decode = o, t.exports = r
        }, function(t, n, o) {
            (function(n) {
                function r() {}

                function s(t) {
                    i.call(this, t), this.query = this.query || {}, c || (n.___eio || (n.___eio = []), c = n.___eio), this.index = c.length;
                    var e = this;
                    c.push(function(t) {
                        e.onData(t)
                    }), this.query.j = this.index, n.document && n.addEventListener && n.addEventListener("beforeunload", function() {
                        e.script && (e.script.onerror = r)
                    }, !1)
                }
                var i = o(25),
                    a = o(37);
                t.exports = s;
                var c, u = /\n/g,
                    h = /\\n/g;
                a(s, i), s.prototype.supportsBinary = !1, s.prototype.doClose = function() {
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i.prototype.doClose.call(this)
                }, s.prototype.doPoll = function() {
                    var t = this,
                        n = e.createElement("script");
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), n.async = !0, n.src = this.uri(), n.onerror = function(e) {
                        t.onError("jsonp poll error", e)
                    };
                    var o = e.getElementsByTagName("script")[0];
                    o ? o.parentNode.insertBefore(n, o) : (e.head || e.body).appendChild(n), this.script = n, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function() {
                        var t = e.createElement("iframe");
                        e.body.appendChild(t), e.body.removeChild(t)
                    }, 100)
                }, s.prototype.doWrite = function(t, n) {
                    function o() {
                        r(), n()
                    }

                    function r() {
                        if (s.iframe) try {
                            s.form.removeChild(s.iframe)
                        } catch (t) {
                            s.onError("jsonp polling iframe removal error", t)
                        }
                        try {
                            var t = '<iframe src="javascript:0" name="' + s.iframeId + '">';
                            i = e.createElement(t)
                        } catch (t) {
                            i = e.createElement("iframe"), i.name = s.iframeId, i.src = "javascript:0"
                        }
                        i.id = s.iframeId, s.form.appendChild(i), s.iframe = i
                    }
                    var s = this;
                    if (!this.form) {
                        var i, a = e.createElement("form"),
                            c = e.createElement("textarea"),
                            l = this.iframeId = "eio_iframe_" + this.index;
                        a.className = "socketio", a.style.position = "absolute", a.style.top = "-1000px", a.style.left = "-1000px", a.target = l, a.method = "POST", a.setAttribute("accept-charset", "utf-8"), c.name = "d", a.appendChild(c), e.body.appendChild(a), this.form = a, this.area = c
                    }
                    this.form.action = this.uri(), r(), t = t.replace(h, "\\\n"), this.area.value = t.replace(u, "\\n");
                    try {
                        this.form.submit()
                    } catch (t) {}
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                        "complete" === s.iframe.readyState && o()
                    } : this.iframe.onload = o
                }
            }).call(n, function() {
                return this
            }())
        }, function(e, n, o) {
            (function(n) {
                function r(t) {
                    t && t.forceBase64 && (this.supportsBinary = !1), this.perMessageDeflate = t.perMessageDeflate, this.usingBrowserWebSocket = p && !t.forceNode, this.usingBrowserWebSocket || (f = s), i.call(this, t)
                }
                var s, i = o(26),
                    a = o(27),
                    c = o(36),
                    u = o(37),
                    h = o(38),
                    l = o(3)("engine.io-client:websocket"),
                    p = n.WebSocket || n.MozWebSocket;
                if (void 0 === t) try {
                    s = o(41)
                } catch (t) {}
                var f = p;
                f || void 0 !== t || (f = s), e.exports = r, u(r, i), r.prototype.name = "websocket", r.prototype.supportsBinary = !0, r.prototype.doOpen = function() {
                    if (this.check()) {
                        var t = this.uri(),
                            e = {
                                agent: this.agent,
                                perMessageDeflate: this.perMessageDeflate
                            };
                        e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (e.headers = this.extraHeaders), this.localAddress && (e.localAddress = this.localAddress);
                        try {
                            this.ws = this.usingBrowserWebSocket ? new f(t) : new f(t, void 0, e)
                        } catch (t) {
                            return this.emit("error", t)
                        }
                        void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners()
                    }
                }, r.prototype.addEventListeners = function() {
                    var t = this;
                    this.ws.onopen = function() {
                        t.onOpen()
                    }, this.ws.onclose = function() {
                        t.onClose()
                    }, this.ws.onmessage = function(e) {
                        t.onData(e.data)
                    }, this.ws.onerror = function(e) {
                        t.onError("websocket error", e)
                    }
                }, r.prototype.write = function(t) {
                    function e() {
                        o.emit("flush"), setTimeout(function() {
                            o.writable = !0, o.emit("drain")
                        }, 0)
                    }
                    var o = this;
                    this.writable = !1;
                    for (var r = t.length, s = 0, i = r; s < i; s++) ! function(t) {
                        a.encodePacket(t, o.supportsBinary, function(s) {
                            if (!o.usingBrowserWebSocket) {
                                var i = {};
                                if (t.options && (i.compress = t.options.compress), o.perMessageDeflate) {
                                    ("string" == typeof s ? n.Buffer.byteLength(s) : s.length) < o.perMessageDeflate.threshold && (i.compress = !1)
                                }
                            }
                            try {
                                o.usingBrowserWebSocket ? o.ws.send(s) : o.ws.send(s, i)
                            } catch (t) {
                                l("websocket closed before onclose event")
                            }--r || e()
                        })
                    }(t[s])
                }, r.prototype.onClose = function() {
                    i.prototype.onClose.call(this)
                }, r.prototype.doClose = function() {
                    void 0 !== this.ws && this.ws.close()
                }, r.prototype.uri = function() {
                    var t = this.query || {},
                        e = this.secure ? "wss" : "ws",
                        n = "";
                    return this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (n = ":" + this.port), this.timestampRequests && (t[this.timestampParam] = h()), this.supportsBinary || (t.b64 = 1), t = c.encode(t), t.length && (t = "?" + t), e + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t
                }, r.prototype.check = function() {
                    return !(!f || "__initialize" in f && this.name === r.prototype.name)
                }
            }).call(n, function() {
                return this
            }())
        }, function(t, e) {}, function(t, e) {
            var n = [].indexOf;
            t.exports = function(t, e) {
                if (n) return t.indexOf(e);
                for (var o = 0; o < t.length; ++o)
                    if (t[o] === e) return o;
                return -1
            }
        }, function(t, e) {
            (function(e) {
                var n = /^[\],:{}\s]*$/,
                    o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    r = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    s = /(?:^|:|,)(?:\s*\[)+/g,
                    i = /^\s+/,
                    a = /\s+$/;
                t.exports = function(t) {
                    return "string" == typeof t && t ? (t = t.replace(i, "").replace(a, ""), e.JSON && JSON.parse ? JSON.parse(t) : n.test(t.replace(o, "@").replace(r, "]").replace(s, "")) ? new Function("return " + t)() : void 0) : null
                }
            }).call(e, function() {
                return this
            }())
        }, function(t, e, n) {
            "use strict";

            function o(t, e, n) {
                this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, n && n.query && (this.query = n.query), this.io.autoConnect && this.open()
            }
            var r = n(7),
                s = n(35),
                i = n(45),
                a = n(46),
                c = n(47),
                u = n(3)("socket.io-client:socket"),
                h = n(29);
            t.exports = o;
            var l = {
                    connect: 1,
                    connect_error: 1,
                    connect_timeout: 1,
                    connecting: 1,
                    disconnect: 1,
                    error: 1,
                    reconnect: 1,
                    reconnect_attempt: 1,
                    reconnect_failed: 1,
                    reconnect_error: 1,
                    reconnecting: 1,
                    ping: 1,
                    pong: 1
                },
                p = s.prototype.emit;
            s(o.prototype), o.prototype.subEvents = function() {
                if (!this.subs) {
                    var t = this.io;
                    this.subs = [a(t, "open", c(this, "onopen")), a(t, "packet", c(this, "onpacket")), a(t, "close", c(this, "onclose"))]
                }
            }, o.prototype.open = o.prototype.connect = function() {
                return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting"), this)
            }, o.prototype.send = function() {
                var t = i(arguments);
                return t.unshift("message"), this.emit.apply(this, t), this
            }, o.prototype.emit = function(t) {
                if (l.hasOwnProperty(t)) return p.apply(this, arguments), this;
                var e = i(arguments),
                    n = r.EVENT;
                h(e) && (n = r.BINARY_EVENT);
                var o = {
                    type: n,
                    data: e
                };
                return o.options = {}, o.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof e[e.length - 1] && (u("emitting packet with ack id %d", this.ids), this.acks[this.ids] = e.pop(), o.id = this.ids++), this.connected ? this.packet(o) : this.sendBuffer.push(o), delete this.flags, this
            }, o.prototype.packet = function(t) {
                t.nsp = this.nsp, this.io.packet(t)
            }, o.prototype.onopen = function() {
                u("transport is open - connecting"), "/" !== this.nsp && (this.query ? this.packet({
                    type: r.CONNECT,
                    query: this.query
                }) : this.packet({
                    type: r.CONNECT
                }))
                }, o.prototype.onclose = function (t) {
                let port = this.io.engine.port;
                u("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", t), (port > 4999 ? document.dispatchEvent(new Event("disconnectedSocket")) : 0)
            }, o.prototype.onpacket = function(t) {
                if (t.nsp === this.nsp) switch (t.type) {
                    case r.CONNECT:
                        this.onconnect();
                        break;
                    case r.EVENT:
                    case r.BINARY_EVENT:
                        this.onevent(t);
                        break;
                    case r.ACK:
                    case r.BINARY_ACK:
                        this.onack(t);
                        break;
                    case r.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case r.ERROR:
                        this.emit("error", t.data)
                }
                }, o.prototype.onevent = function (t) {
                if (it && this.id != it.id) {
                    this.disconnect();
                    return;
                }
                var e = t.data || [];
                u("emitting event %j", e), null != t.id && (u("attaching ack callback to event"), e.push(this.ack(t.id))), this.connected ? p.apply(this, e) : this.receiveBuffer.push(e)
            }, o.prototype.ack = function(t) {
                var e = this,
                    n = !1;
                return function() {
                    if (!n) {
                        n = !0;
                        var o = i(arguments);
                        u("sending ack %j", o);
                        var s = h(o) ? r.BINARY_ACK : r.ACK;
                        e.packet({
                            type: s,
                            id: t,
                            data: o
                        })
                    }
                }
            }, o.prototype.onack = function(t) {
                var e = this.acks[t.id];
                "function" == typeof e ? (u("calling ack %s with %j", t.id, t.data), e.apply(this, t.data), delete this.acks[t.id]) : u("bad ack %s", t.id)
            }, o.prototype.onconnect = function() {
                this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
            }, o.prototype.emitBuffered = function() {
                var t;
                for (t = 0; t < this.receiveBuffer.length; t++) p.apply(this, this.receiveBuffer[t]);
                for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);
                this.sendBuffer = []
            }, o.prototype.ondisconnect = function() {
                u("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
            }, o.prototype.destroy = function() {
                if (this.subs) {
                    for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            }, o.prototype.close = o.prototype.disconnect = function() {
                return this.connected && (u("performing disconnect (%s)", this.nsp), this.packet({
                    type: r.DISCONNECT
                })), this.destroy(), this.connected && this.onclose("io client disconnect"), this
            }, o.prototype.compress = function(t) {
                return this.flags = this.flags || {}, this.flags.compress = t, this
            }
        }, function(t, e) {
            function n(t, e) {
                var n = [];
                e = e || 0;
                for (var o = e || 0; o < t.length; o++) n[o - e] = t[o];
                return n
            }
            t.exports = n
        }, function(t, e) {
            "use strict";

            function n(t, e, n) {
                return t.on(e, n), {
                    destroy: function() {
                        t.removeListener(e, n)
                    }
                }
            }
            t.exports = n
        }, function(t, e) {
            var n = [].slice;
            t.exports = function(t, e) {
                if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");
                var o = n.call(arguments, 2);
                return function() {
                    return e.apply(t, o.concat(n.call(arguments)))
                }
            }
        }, function(t, e) {
            function n(t) {
                t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0
            }
            t.exports = n, n.prototype.duration = function() {
                var t = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var e = Math.random(),
                        n = Math.floor(e * this.jitter * t);
                    t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n
                }
                return 0 | Math.min(t, this.max)
            }, n.prototype.reset = function() {
                this.attempts = 0
            }, n.prototype.setMin = function(t) {
                this.ms = t
            }, n.prototype.setMax = function(t) {
                this.max = t
            }, n.prototype.setJitter = function(t) {
                this.jitter = t
            }
        }])
    });
    const _ = "#56CE27",
        N = "#CCCC00",
        O = "#3975CE",
        j = "#56CE27",
        G = "#CE4F0A",
        q = 500,
        W = 500,
        H = 18,
        F = 31,
        z = 24,
        J = [H, F, z],
        X = {
            AG: "Everybody guessed the word!",
            DL: "The drawer left the game!",
            TP: "Time is up!",
            TD: "The drawer received too many thumbs down!",
            VK: "The drawer has been kicked!"
        },
        Y = 1,
        $ = 4;
    var K = function(t, e) {
            this.url = e, this.buffer = null, this.loaded = !1;
            var n = this,
                o = new XMLHttpRequest;
            o.open("GET", e, !0), o.responseType = "arraybuffer", o.onload = function() {
                t.context.decodeAudioData(o.response, function(t) {
                    n.buffer = t, n.loaded = !0
                }, function(t) {
                    console.log("Failed loading audio from url '" + e + "'")
                })
            }, o.send()
        },
        V = function() {
            this.context = null, this.sounds = new Map, this.mute = !1, "true" === o.getItem("audioMute") && this.setMute(!0), t.addEventListener("click", this.load.bind(this), !1)
        };
    V.prototype.setMute = function(t) {
        this.mute = t, this.mute ? n("#audio").css("background-image", "url(res/audio_off.gif") : n("#audio").css("background-image", "url(res/audio.gif"), o.setItem("audioMute", this.mute.toString())
    }, V.prototype.addSound = function(t, e) {
        this.sounds.set(e, new K(this, t))
    }, V.prototype.loadSounds = function() {
        this.addSound("res/sounds/roundStart.ogg", "roundStart"), this.addSound("res/sounds/roundEndSuccess.ogg", "roundEndSuccess"), this.addSound("res/sounds/roundEndFailure.ogg", "roundEndFailure"), this.addSound("res/sounds/join.ogg", "playerJoin"), this.addSound("res/sounds/leave.ogg", "playerLeave"), this.addSound("res/sounds/playerGuessed.ogg", "playerGuessed"), this.addSound("res/sounds/tick.ogg", "tick")
    }, V.prototype.playSound = function(t) {
        if (!this.mute && this.sounds.has(t)) {
            var e = this.sounds.get(t);
            if (e.loaded) {
                var n = this.context.createBufferSource();
                n.buffer = e.buffer, n.connect(this.context.destination), n.start(0)
            }
        }
        }, V.prototype.load = function () {
        if (this.context) return;
        try {
            t.AudioContext = t.AudioContext || t.webkitAudioContext, this.context = new AudioContext;
            if ("permission" in Notification && Notification.permission === "default" && confirm("Do you want to receive notifications when a lobby was found?")) Notification.requestPermission(); 
            t.removeEventListener("click", V.bind);
        } catch (t) {
            return void console.log("Error creating AudioContext.")
        }
        this.loadSounds()
    };
    var Z = function(t) {
        this.canvas = t, this.canvasCtx = this.canvas[0].getContext("2d"), this.canvasCtx.mozImageSmoothingEnabled = !1, this.canvasCtx.webkitImageSmoothingEnabled = !1, this.canvasCtx.msImageSmoothingEnabled = !1, this.canvasCtx.imageSmoothingEnabled = !1, this.mouseposPrev = {
            x: 0,
            y: 0
        }, this.mousepos = {
            x: 0,
            y: 0
        }, this.drawCommands = [], this.drawCommandsReceived = [], this.brush = new Q;
        var e = this;
        setInterval(function() {
            e.drawCommandsReceived.length > 0 && e.performDrawCommand(e.drawCommandsReceived.shift())
        }, 1), this.clear()
    };
    Z.prototype.updateMousePosition = function (t, e, n) {
        var o = this.canvas[0].getBoundingClientRect(),
            r = this.canvas[0].width,
            s = this.canvas[0].height,
            i = o.width,
            a = o.height,
            c = (t - o.left) / i,
            u = (e - o.top) / a;
        n ? (this.mouseposPrev.x = this.mousepos.x = Math.floor(c * r), this.mouseposPrev.y = this.mousepos.y = Math.floor(u * s)) : (this.mouseposPrev.x = this.mousepos.x, this.mouseposPrev.y = this.mousepos.y, this.mousepos.x = Math.floor(c * r), this.mousepos.y = Math.floor(u * s))
    }, Z.prototype.addDrawCommandReceived = function (t) {
        this.drawCommandsReceived.push(t)
    }, Z.prototype.addDrawCommand = function (t) {
        this.drawCommands.push(t)
    }, Z.prototype.createDrawCommandLine = function (t, e, n, o, r, s) {
        return [0, t, e, n, o, r, s]
    }, Z.prototype.createDrawCommandErase = function (t, e, n, o, r) {
        return [1, t, e, n, o, r]
    }, Z.prototype.createDrawCommandFill = function (t, e, n) {
        return [2, t, e, n]
    }, Z.prototype.performDrawCommand = function (t) {
        switch (t[0]) {
            case 0:
                var e = Math.floor(t[2]);
                e < this.brush.thicknessMin && (e = this.brush.thicknessMin), e > this.brush.thicknessMax && (e = this.brush.thicknessMax);
                var n = Math.floor(Math.ceil(e / 2)),
                    o = i(Math.floor(t[3]), -n, this.canvas[0].width + n),
                    r = i(Math.floor(t[4]), -n, this.canvas[0].height + n),
                    s = i(Math.floor(t[5]), -n, this.canvas[0].width + n),
                    c = i(Math.floor(t[6]), -n, this.canvas[0].height + n),
                    u = a(this.brush.getColor(t[1]));
                this.plotLine(o, r, s, c, e, u.r, u.g, u.b);
                lastBrushUp = { X: t[5], Y: t[6] };
                break;
            case 1:
                var e = Math.floor(t[1]);
                e < this.brush.thicknessMin && (e = this.brush.thicknessMin), e > this.brush.thicknessMax && (e = this.brush.thicknessMax);
                var n = Math.floor(Math.ceil(e / 2)),
                    o = i(Math.floor(t[2]), -n, this.canvas[0].width + n),
                    r = i(Math.floor(t[3]), -n, this.canvas[0].height + n),
                    s = i(Math.floor(t[4]), -n, this.canvas[0].width + n),
                    c = i(Math.floor(t[5]), -n, this.canvas[0].height + n);
                this.plotLine(o, r, s, c, e, 255, 255, 255);
                break;
            case 2:
                var u = a(this.brush.getColor(t[1])),
                    h = i(Math.floor(t[2]), 0, this.canvas[0].width),
                    l = i(Math.floor(t[3]), 0, this.canvas[0].height);
                this.floodFill(h, l, u.r, u.g, u.b)
        }
    }, Z.prototype.getImageData = function(t, e, n, o) {
        var r = Math.min(t, n),
            s = Math.min(e, o),
            i = Math.abs(t - n),
            a = Math.abs(e - o);
        return this.canvasCtx.getImageData(r, s, i, a)
    }, Z.prototype.setPixel = function(t, e, n, o, r) {
        e >= 0 && e < t.data.length && (t.data[e] = n, t.data[e + 1] = o, t.data[e + 2] = r, t.data[e + 3] = 255)
    }, Z.prototype.getPixel = function(t, e, n) {
        var o = 4 * (n * t.width + e);
        return o >= 0 && o < t.data.length ? [t.data[o], t.data[o + 1], t.data[o + 2]] : [0, 0, 0]
    }, Z.prototype.floodFill = function(t, e, n, o, r) {
        var s = this.canvasCtx.getImageData(0, 0, this.canvas[0].width, this.canvas[0].height),
            i = [
                [t, e]
            ],
            a = this.getPixel(s, t, e);
        if (n != a[0] || o != a[1] || r != a[2]) {
            for (var c = function(t) {
                    var e = s.data[t],
                        i = s.data[t + 1],
                        c = s.data[t + 2];
                    if (e == n && i == o && c == r) return !1;
                    var u = Math.abs(e - a[0]),
                        h = Math.abs(i - a[1]),
                        l = Math.abs(c - a[2]);
                    return u < 1 && h < 1 && l < 1
                }, u = s.height, h = s.width; i.length;) {
                var l, p, f, d, y, m;
                for (l = i.pop(), p = l[0], f = l[1], d = 4 * (f * h + p); f-- >= 0 && c(d);) d -= 4 * h;
                for (d += 4 * h, ++f, y = !1, m = !1; f++ < u - 1 && c(d);) this.setPixel(s, d, n, o, r), p > 0 && (c(d - 4) ? y || (i.push([p - 1, f]), y = !0) : y && (y = !1)), p < h - 1 && (c(d + 4) ? m || (i.push([p + 1, f]), m = !0) : m && (m = !1)), d += 4 * h
            }
            this.canvasCtx.putImageData(s, 0, 0)
        }
    }, Z.prototype.plotLineOld = function(t, e, n, o, r, s) {
        this.canvasCtx.fillStyle = this.canvasCtx.strokeStyle = this.brush.getColor(s), this.canvasCtx.lineWidth = r, this.canvasCtx.lineJoin = this.canvasCtx.lineCap = "round", this.canvasCtx.beginPath(), this.canvasCtx.moveTo(t, e), this.canvasCtx.lineTo(n, o), this.canvasCtx.closePath(), this.canvasCtx.stroke()
    }, Z.prototype.plotLine = function(t, e, n, o, r, s, i, a) {
        var c = Math.floor(r / 2),
            u = c * c,
            h = Math.min(t, n) - c,
            l = Math.min(e, o) - c,
            p = Math.max(t, n) + c,
            f = Math.max(e, o) + c;
        t -= h, e -= l, n -= h, o -= l;
        var d = this.canvasCtx.getImageData(h, l, p - h, f - l),
            y = function(t, e) {
                for (var n = -c; n <= c; n++)
                    for (var o = -c; o <= c; o++)
                        if (n * n + o * o < u) {
                            var r = 4 * ((e + o) * d.width + t + n);
                            r >= 0 && r < d.data.length && (d.data[r] = s, d.data[r + 1] = i, d.data[r + 2] = a, d.data[r + 3] = 255)
                        }
            };
        if (t == n && e == o) y(t, e);
        else {
            y(t, e), y(n, o);
            var m = Math.abs(n - t),
                g = Math.abs(o - e),
                v = t < n ? 1 : -1,
                b = e < o ? 1 : -1,
                w = m - g;
            for (Math.floor(Math.max(0, c - 10) / 5); t != n || e != o;) {
                var k = w << 1;
                k > -g && (w -= g, t += v), k < m && (w += m, e += b), y(t, e)
            }
        }
        this.canvasCtx.putImageData(d, h, l)
        }, Z.prototype.clear = function () {
        if (localStorage.keepCanvas == "true") {
            document.dispatchEvent(new CustomEvent("toast", { detail: { text: "Prevented Canvas Clear." }}));
            return;
        }
        this.drawCommands = [], this.drawCommandsReceived = [], this.canvasCtx.fillStyle = "#FFF", this.canvasCtx.fillRect(0, 0, this.canvas[0].width, this.canvas[0].height), document.querySelector("body").dispatchEvent(new CustomEvent("logCanvasClear"))
    }, Z.prototype.setDrawing = function(t) {
        t ? (this.brush.show(), n(".containerToolbar").show()) : (this.brush.hide(), n(".containerToolbar").hide())
    };
    var Q = function() {
        this.down = !1, this.tool = "pen", this.toolUsed = !1, this.colorIndex = 0, this.thickness = 0, this.thicknessMin = 4, this.thicknessMax = 40, this.brushCanvas = e.createElement("canvas"), this.brushCanvas.width = this.thicknessMax, this.brushCanvas.height = this.thicknessMax, this.brushCanvasCtx = this.brushCanvas.getContext("2d"), this.setTool("pen"), this.setThickness(12), this.setColor(1)
    };
    Q.prototype.hide = function() {
        n("#cursor").hide()
    }, Q.prototype.show = function() {
        n("#cursor").show()
    }, Q.prototype.setDown = function(t) {
        this.down = t, this.down || (this.toolUsed = !1), n("#cursor .tool").css("top", this.down ? 0 : -8)
    }, Q.prototype.setTool = function(t) {
        localStorage.brushtool = t, this.tool = t, n(".containerTools .tool").removeClass("toolActive"), n(".containerTools .tool[data-tool='" + t + "']").addClass("toolActive"), this.updateBrushCursor()
    }, Q.prototype.setColor = function(t) {
        this.colorIndex = t,
            (localStorage.down == "true" && (localStorage.inkMode.includes("brightness") || localStorage.inkMode.includes("degree"))  ? 0 : n(".colorPreview").css("background-color", this.getColor(t))),
            this.updateBrushCursor();
        let picker = document.querySelector("#colPicker");
        if(picker && picker.firstChild) picker.firstChild.setAttribute("data-color", this.getColor(t));
    }, Q.prototype.getColor = function (t) {
        if (t >= 10000) {
            t = t - 10000;
            t = t.toString(16);
            return "#" + t;
        }
        return n(".colorItem[data-color='" + t + "']").css("background-color")
    }, setBrushSize = Q.prototype.setThickness = function(t) {
        this.thickness = t, this.thickness < this.thicknessMin && (this.thickness = this.thicknessMin), this.thickness > this.thicknessMax && (this.thickness = this.thicknessMax), this.updateBrushCursor()
    }, Q.prototype.updateBrushCursor = function() {
        switch (this.tool) {
            case "pen":
            case "erase":
                if (this.thickness <= 0) return;
                let zoom = Number(document.querySelector("#canvasGame").getAttribute("data-zoom"));
                let oldmax = this.thicknessMax, oldthickness = this.thickness;
                if (zoom > 1) {
                    this.thickness *= zoom;
                    this.thicknessMax = this.thickness > 128 ? 128 : this.thickness;
                }
                this.brushCanvas.width = this.thicknessMax;
                this.brushCanvas.height = this.thicknessMax;
                this.brushCanvasCtx.clearRect(0, 0, this.thicknessMax, this.thicknessMax), this.brushCanvasCtx.fillStyle = "erase" == this.tool ? "#FFF" : this.getColor(this.colorIndex), this.brushCanvasCtx.beginPath(), this.brushCanvasCtx.arc(this.thicknessMax / 2, this.thicknessMax / 2, this.thickness / 2 - 1, 0, 2 * Math.PI), this.brushCanvasCtx.fill(), this.brushCanvasCtx.strokeStyle = "#FFF", this.brushCanvasCtx.beginPath(), this.brushCanvasCtx.arc(this.thicknessMax / 2, this.thicknessMax / 2, this.thickness / 2 - 1, 0, 2 * Math.PI), this.brushCanvasCtx.stroke(), this.brushCanvasCtx.strokeStyle = "#000", this.brushCanvasCtx.beginPath(), this.brushCanvasCtx.arc(this.thicknessMax / 2, this.thicknessMax / 2, this.thickness / 2, 0, 2 * Math.PI), this.brushCanvasCtx.stroke();
                var t = this.brushCanvas.toDataURL(),
                    e = this.thicknessMax / 2;
                n("#canvasGame").css("cursor", "url(" + t + ")" + e + " " + e + ", default");
                this.thickness = oldthickness;
                this.thicknessMax = oldmax; 
                break;
            case "fill":
                n("#canvasGame").css("cursor", "url(res/fill_graphic.png) 7 38, default");
                break;
            case "pipette":
                n("#canvasGame").css("cursor", "url(" + sessionStorage.pipetteURL + " ) 7 38, default");

        }
    };
    var tt = function(t) {
        this.name = t.name, this.key = t.key, this.language = t.language, this.slots = t.slots, this.drawingID = t.drawingID, this.myID = t.myID, this.ownerID = t.ownerID, this.round = t.round, this.roundMax = t.roundMax, this.time = t.time, this.timeMax = t.timeMax, this.useCustomWordsExclusive = t.useCustomWordsExclusive, this.inGame = t.inGame, this.players = new Map, this.containerGame = n("#containerGamePlayers"), this.containerLobby = n("#containerLobbyPlayers"), this.chatClear(), this.containerGamePlayerClear(), this.containerLobbyPlayerClear();
        for (var e = 0; e < t.players.length; e++) this.addPlayer(t.players[e]);
        n("#invite").val("https://skribbl.io/?" + this.key), n("#screenLobby .lobbySettings .lobbyName").text(this.name), this.containerLobbyUpdateRounds(), this.containerLobbyUpdateDrawTime(), this.containerLobbyUpdateUseCustomWordsExclusive(), this.containerLobbyUpdateLanguage(), this.containerLobbyPlayersUpdateOwner(), this.containerGamePlayersUpdateDrawing(), this.containerGamePlayersUpdateGuessed(), this.containerGamePlayersUpdateOwner(), this.updateRanks(), this.updateRound(), this.chatEnable()
    };
    tt.prototype.updatePlayerAvatars = function() {
        var t = this;
        this.players.forEach(function(e, n, o) {
            s(t.containerGamePlayerGet(player), player.avatar, player.id == t.ownerID)
        })
    }, tt.prototype.reset = function() {
        this.round = 0, this.drawingID = -1;
        var t = this;
        this.players.forEach(function(e, n, o) {
            e.guessedWord = !1, e.score = 0, e.thumbsUp = 0, e.thumbsDown = 0, t.containerGamePlayerUpdateScore(e)
        }), this.containerGamePlayersUpdateDrawing(), this.containerGamePlayersUpdateGuessed(), this.containerGamePlayersUpdateOwner(), this.updateRanks(), this.updateRound(), this.containerLobbyPlayersUpdateOwner(), this.chatEnable()
    }, tt.prototype.checkDrawing = function() {
        return this.drawingID == this.myID
    }, tt.prototype.addPlayer = function (t) {
        t.mute = false;
        this.players.set(t.id, t), this.containerGamePlayerAdd(t), this.containerLobbyPlayerAdd(t), this.updateRanks()
    }, tt.prototype.removePlayer = function(t) {
        this.containerGamePlayerRemove(t), this.containerLobbyPlayerRemove(t), this.players.delete(t.id), this.updateRanks()
    }, tt.prototype.playersResetGuessedWord = function() {
        this.players.forEach(function(t, e, n) {
            t.guessedWord = !1
        }), this.containerGamePlayersUpdateGuessed()
    }, tt.prototype.setPlayerOwner = function(t) {
        this.ownerID = t.id, this.containerGamePlayersUpdateOwner(), this.containerLobbyPlayersUpdateOwner()
    }, tt.prototype.setPlayerDrawing = function(t) {
        this.drawingID = t, this.containerGamePlayersUpdateDrawing()
    }, tt.prototype.setPlayerGuessed = function(t) {
        t.guessedWord = !0, this.containerGamePlayersUpdateGuessed()
    }, tt.prototype.setPlayerScore = function(t, e, n) {
        t.score = e, t.scoreGuessed = n, this.containerGamePlayerUpdateScore(t)
    }, tt.prototype.setLanguage = function(t) {
        this.language = t, this.containerLobbyUpdateLanguage()
    }, tt.prototype.setRounds = function(t) {
        this.roundMax = t, this.updateRound(), this.containerLobbyUpdateRounds()
    }, tt.prototype.setCustomWordsExclusive = function(t) {
        this.useCustomWordsExclusive = !!t, this.containerLobbyUpdateUseCustomWordsExclusive()
    }, tt.prototype.setDrawTime = function(t) {
        this.timeMax = t, this.containerLobbyUpdateDrawTime()
    }, tt.prototype.updateRound = function() {
        n("#round").text("Round " + (this.round + 1) + " of " + this.roundMax)
    }, tt.prototype.updateRanks = function() {
        var t = [];
        this.players.forEach(function(e, n, o) {
            t.push(e)
        }), t.sort(function(t, e) {
            return e.score - t.score
        });
        for (var e = 1, n = 0; n < t.length; n++) t[n].rank = e, this.containerGamePlayerUpdateRank(t[n], e), n < t.length - 1 && t[n].score > t[n + 1].score && e++
    }, tt.prototype.containerGamePlayerClear = function() {
        this.containerGame.empty()
    }, tt.prototype.containerGamePlayerGet = function(t) {
        return this.containerGame.find("#player" + t.id)
    }, tt.prototype.containerGamePlayerAdd = function(t) {
        var e = n("#gamePlayerDummy").clone();
        e.find(".name").css("cursor", "pointer");
        e.find(".name").css("user-select", "none");
        e.find(".name").attr("title", "Toggle mute");
        e.find(".name").tooltip();
        e.find(".name").on("click", () => {
            if (t.id == this.myID) {
                document.dispatchEvent(new CustomEvent("toast", { detail: { text: "You can't mute yourself, dummy!" } }));
                return;
            };
            t.mute = !t.mute;
            if (t.mute) e.find(".name")[0].style.setProperty("color", "red","important");
            else e.find(".name").css("color", "black");
            document.dispatchEvent(new CustomEvent("toast", { detail: { text: (t.mute ? "Muted " : "Unmuted ") + t.name } }));
            [...document.querySelectorAll(".mutedMsg" + t.id)].forEach(msg => {
                if (!t.mute) { msg.querySelector("span").style.display = ""; msg.style.color = "black"}
                else { msg.querySelector("span").style.display = "none"; msg.style.color = "rgb(0, 0, 0, .5)"; }
            });
            return;
        });
        e.attr("id", "player" + t.id), e.find(".name").text(t.name + (t.id == this.myID ? " (You)" : "")), t.id == this.myID && e.find(".name").css("color", "blue"), e.find(".drawing").hide(), this.containerGame.append(e), this.containerGamePlayerUpdateScore(t), e.show(), s(e, t.avatar, t.id == this.ownerID, 1)
    }, tt.prototype.containerGamePlayerRemove = function(t) {
        this.containerGamePlayerGet(t).remove()
    }, tt.prototype.containerGamePlayersUpdateGuessed = function() {
        var t = this;
        this.players.forEach(function(e, n, o) {
            var r = t.containerGamePlayerGet(e);
            e.guessedWord ? r.addClass("guessedWord") : r.removeClass("guessedWord")
        })
    }, tt.prototype.containerGamePlayersUpdateDrawing = function() {
        var t = this;
        this.players.forEach(function(e, n, o) {
            var r = t.containerGamePlayerGet(e).find(".drawing");
            e.id === t.drawingID ? r.show() : r.hide()
        })
    }, tt.prototype.containerGamePlayersUpdateOwner = function() {
        var t = this;
        this.players.forEach(function(e, n, o) {
            var r = t.containerGamePlayerGet(e).find(".owner");
            e.id === t.ownerID ? r.show() : r.hide()
        })
    }, tt.prototype.containerGamePlayerUpdateScore = function(t) {
        this.containerGamePlayerGet(t).find(".score").text("Points: " + t.score)
    }, tt.prototype.containerGamePlayerUpdateRank = function(t, e) {
        this.containerGamePlayerGet(t).find(".rank").text("#" + e)
    }, tt.prototype.containerLobbyPlayerGet = function(t) {
        return this.containerLobby.find("#player" + t.id)
    }, tt.prototype.containerLobbyPlayerAdd = function(t) {
        var e = n("#lobbyPlayerDummy").clone();
        e.attr("id", "player" + t.id), e.find(".name").text(t.name), e.find(".owner").hide(), t.id == this.myID && e.find(".you").show(), e.show(), this.containerLobby.append(e), s(e, t.avatar, t.id == this.ownerID, 2)
    }, tt.prototype.containerLobbyPlayerRemove = function(t) {
        this.containerLobbyPlayerGet(t).remove()
    }, tt.prototype.containerLobbyPlayersUpdateOwner = function() {
        var t = this;
        this.players.forEach(function(e, n, o) {
            var r = t.containerLobbyPlayerGet(e).find(".owner");
            e.id === t.ownerID ? r.show() : r.hide()
        });
        var e = this.ownerID != this.myID;
        n("#lobbySetRounds").prop("disabled", e),n("#lobbyDesc").prop("disabled", e), n("#lobbySetDrawTime").prop("disabled", e), n("#lobbySetCustomWords").prop("disabled", e), n("#lobbyCustomWordsExclusive").prop("disabled", e), n("#lobbySetLanguage").prop("disabled", e), n("#buttonLobbyPlay").prop("disabled", e)
    }, tt.prototype.containerLobbyPlayerClear = function() {
        this.containerLobby.empty()
    }, tt.prototype.containerLobbyUpdateRounds = function() {
        n("#lobbySetRounds").val(this.roundMax)
    }, tt.prototype.containerLobbyUpdateDrawTime = function() {
        n("#lobbySetDrawTime").val(this.timeMax)
    }, tt.prototype.containerLobbyUpdateUseCustomWordsExclusive = function() {
        n("#lobbyCustomWordsExclusive").attr("checked", !!this.useCustomWordsExclusive)
    }, tt.prototype.containerLobbyUpdateLanguage = function() {
        var t = M(this.language);
        n("#lobbySetLanguage").val(t)
    }, tt.prototype.playerMessage = function(t, e) {
        this.playerMessageHandle(t);
        var n = this.containerGamePlayerGet(t).find(".message");
        n.find(".text").show(), n.find(".text").text(e)
    }, tt.prototype.playerRate = function(t, e) {
        this.playerMessageHandle(t);
        var n = this.containerGamePlayerGet(t).find(".message");
        e > 0 ? n.find(".iconThumbsUp").show() : n.find(".iconThumbsDown").show()
    }, tt.prototype.playerMessageHandle = function(t) {
        var e = this.containerGamePlayerGet(t).find(".message");
        e.find(".content").children().hide(), e.stop(), e.css("opacity", "1.0"), e.show(), t._previousHandle && clearTimeout(t._previousHandle), t._previousHandle = setTimeout(function() {
            e.animate({
                opacity: "0"
            }, 500, function() {
                e.hide()
            })
        }, 1500)
    }, tt.prototype.chatClear = function() {
        n("#boxMessages").empty()
    }, tt.prototype.chatAddMsg = function(t, e, o, mute = -1) {
        var r = n("#boxMessages"),
            s = Math.abs(r[0].scrollTop - (r[0].scrollHeight - r.height())),
            i = s < 10,
            a = n("<p></p>");
        if (a.css("color", o), a.appendTo(r), t) {
            n("<b/>", {
                text: t.name + ": "
            }).appendTo(a), mute < 0 ? this.playerMessage(t, e) : 0;
        } else {
            a.css("font-weight", "bold");
        }
        if (!t || t.guessedWord) a.addClass("colorMsg");
        n("<span/>", {
            text: e,
            class: !t || t.guessedWord ? "colorMsg" : ""
        }).appendTo(a), i && r.scrollTop(r[0].scrollHeight);
        if (mute >= 0) { a.addClass("mutedMsg" + mute); a.find("span").hide(); }
    }, tt.prototype.chatDisable = function() {}, tt.prototype.chatEnable = function() {};
    var et = function(t, e) {
        this.element = t, this.logo = e, this.onshow = null, this.onhide = null
    };
    et.prototype.show = function() {
        this.element.show(), this.onshow && this.onshow()
    }, et.prototype.hide = function() {
        this.element.hide(), this.onhide && this.onhide()
    };
    var nt = function() {
        this.screens = {
            load: new et(n("#screenLoading"), 0),
            login: new et(n("#screenLogin"), 2),
            lobby: new et(n("#screenLobby"), 1),
            game: new et(n("#screenGame"), 1)
        }, this.screenCurrent = null
    };
    document.addEventListener("gotoScreen", (e) => ct.goto(e.detail.screen));
    nt.prototype.goto = function (t) {
        if (t == "login") document.dispatchEvent(new Event("leftGame"));
        this.screenCurrent && this.screens[this.screenCurrent].hide(), this.screenCurrent = t, this.screens[this.screenCurrent].show(), this.screens[this.screenCurrent].logo > 0 ? this.showLogo(this.screens[this.screenCurrent].logo) : this.hideLogo()
    }, nt.prototype.hideLogo = function() {
        n("#containerLogoBig").hide(), n("#containerLogoSmall").hide()
    }, nt.prototype.showLogo = function(t) {
        switch (this.hideLogo(), t) {
            case 1:
                n("#containerLogoSmall").show();
                break;
            case 2:
                n("#containerLogoBig").show()
        }
    };
    var ot = t.location != t.parent.location ? e.referrer : e.location.href,
        rt = function(t, e) {
            return -1 !== t.indexOf(e)
        };
    (rt(ot, "skribbl-io.com") || rt(ot, "skribblio.com") || rt(ot, "skribbl-io.org") || rt(ot, "skribblio.online")) && (t.top.location.href = "https://www.skribbl.io"), adplayer = null, aiptag.cmd.player.push(function() {
        console.log("ad player loaded"), adplayer = new aipPlayer({
            AD_WIDTH: 960,
            AD_HEIGHT: 540,
            AD_FULLSCREEN: !1,
            AD_CENTERPLAYER: !0,
            LOADING_TEXT: "loading advertisement",
            PREROLL_ELEM: function() {
                return e.getElementById("preroll")
            },
            AIP_COMPLETE: function(t) {
                b()
            },
            AIP_REMOVE: function() {}
        })
    });
    var inputLog = [],
        logPos=0,
        st = null,
        at = new V,
        ct = new nt,
        ut = new Z(n("#canvasGame")),
        ht = new Array,
        lt = !1,
        pt = !1;
    let it = null;
    ut.setDrawing(!1), ct.goto("login");
    var ft = !1;
    ct.screens.game.onshow = function() {
            ft || (ft = !0, (adsbygoogle = t.adsbygoogle || []).requestNonPersonalizedAds = t.cc_consent ? 0 : 1, (adsbygoogle = t.adsbygoogle || []).push({}))
        }, n("#audio").on("click", function() {
            at.setMute(!at.mute)
        }),
        function() {
            for (var t = n("#logoAvatarDummy"), e = n("#logoAvatarContainer"), o = Math.round(8 * Math.random()), r = 0; r < 8; r++) {
                var i = B(t);
                e.append(i);
                var a = [0, 0, 0, 0];
                a[0] = r, a[1] = Math.round(100 * Math.random()) % F, a[2] = Math.round(100 * Math.random()) % z, a[3] = 1e3 * Math.random() < 70 ? Math.round(1 * Math.random()) : -1, s(i, a, r == o, 1)
            }
        }(), n("#inputName").change(function() {
            o.setItem("name", n("#inputName").val())
        }), null != o.getItem("name") && n("#inputName").val(o.getItem("name")), n("#loginLanguage").change(function() {
            o.setItem("lang", n("#loginLanguage").val())
        }), null != o.getItem("lang") && n("#loginLanguage").val(o.getItem("lang")), loginAvatarData = function() {
            var t = o.getItem("avatar");
            return t ? t = JSON.parse(t) : (t = [Math.round(Math.random() * J[0]), Math.round(Math.random() * J[1]), Math.round(Math.random() * J[2]), -1], o.setItem("avatar", JSON.stringify(t))), t
        }(), n("#buttonAvatarCustomizerRandomize").on("click", function() {
            return loginAvatarData[0] = Math.floor(Math.random() * J[0]), loginAvatarData[1] = Math.floor(Math.random() * J[1]), loginAvatarData[2] = Math.floor(Math.random() * J[2]), c(), s(n("#loginAvatar"), loginAvatarData, !1, 2), !1
        }), s(n("#loginAvatar"), loginAvatarData, !1, 2), n("#loginAvatarArrowsLeft .avatarArrowLeft").on("click", function() {
            var t = parseInt(n(this).data("avatarindex"));
            u(t, loginAvatarData[t] - 1)
        }), n("#loginAvatarArrowsLeft .avatarArrowRight").on("click", function() {
            var t = parseInt(n(this).data("avatarindex"));
            u(t, loginAvatarData[t] + 1)
        }), n(e).ready(function() {
            function e() {
                r = 0
            }

            function o() {
                if (st) {
                    r++, 300 == r && h(), r >= 307 && t.location.reload(!0)
                }
            }
            var r = 0;
            setInterval(o, 1e3);
            n(this).mousemove(e), n(this).keypress(e), n(this).on("mousedown", e), n(this).on("touchmove", e)
        }), setInterval(l, 1), n("#rateDrawing .thumbsUp").on("click", function() {
            it && it.emit("rateDrawing", 1), f()
        }), n("#rateDrawing .thumbsDown").on("click", function() {
            it && it.emit("rateDrawing", 0), f()
        }), f(), y(), n("#votekickCurrentplayer").on("click", m), n("#formLogin").submit(function(t) {
            t.preventDefault(), pt = !1, g()
        }), n("#buttonLoginCreatePrivate").on("click", function(t) {
            t.preventDefault(), pt = !0, g()
        }), grecaptcha = t.grecaptcha || null;
    var dt = null,
        yt = null,
        mt = 0;
    S(80), n("#lobbySetLanguage").on("change", function() {
        it && st.myID == st.ownerID && it.emit("lobbySetLanguage", n(this).val())
    }), n("#lobbySetRounds").on("change", function() {
        it && st.myID == st.ownerID && it.emit("lobbySetRounds", n(this).val())
    }), n("#lobbySetDrawTime").on("change", function() {
        it && st.myID == st.ownerID && it.emit("lobbySetDrawTime", n(this).val())
    }), n("#lobbyCustomWordsExclusive:checkbox").change(function() {
        if (it && st.myID == st.ownerID) {
            var t = this.checked;
            it.emit("lobbySetCustomWordsExclusive", t)
        }
    }), n("#inviteCopyButton").on("click", function() {
        e.querySelector("#invite").select();
        try {
            e.execCommand("copy")
        } catch (t) {}
    }), n("#buttonJoinRandomLobby").on("click", function() {
        ct.goto("load"), it.emit("joinRandom")
    }), n("#buttonLobbyLeave").on("click", P), n("#buttonGameLeave").on("click", P), n("#buttonLobbyPlay").on("click", function() {
        it && st.myID == st.ownerID && it.emit("lobbyGameStart", n("#lobbySetCustomWords").val())
    }), n("#formChat").submit(function (t) {
        var e = n("#inputChat"),
            o = e.val();
        inputLog.push(e.val());
        logPos = inputLog.length;
        if (sessionStorage.practise == "true") {
            e.val("");
            return !1;
        }
        return o && (it ? it.emit("chat", o) : st.chatAddMsg(st.players.get(st.myID), o, "#000"), e.val("")),
            document.querySelector("#inputChat").dispatchEvent(new Event("input")), !1
    }), n("#buttonOpenLobbyCreation").on("click", function() {
        n("#modalCreateLobby").modal("show")
    }), n("#buttonLobbyCreate").on("click", function() {
        var t = {
            name: n("#lobbyCreateName").val(),
            private: n("#lobbyCreatePrivate").prop("checked")
        };
        it.emit("lobbyCreate", t), n("#modalCreateLobby").modal("hide")
    }), n("#buttonRefreshLobbies").on("click", function() {
        it.emit("requestLobbies")
    }), ut.canvas.on("mousewheel DOMMouseScroll", function(t) {
        t.preventDefault();
        var e = t.originalEvent.wheelDelta > 0 || t.originalEvent.detail < 0 ? 1 : -1;
        ut.brush.setThickness(ut.brush.thickness + 6 * e)
    }), n(e).on("mousemove", function(t) {
        sessionStorage.getItem('practise') == "true" && T(t.clientX, t.clientY, !1) || st && st.checkDrawing() && T(t.clientX, t.clientY, !1);
    }), n(e).keydown(function (t) {
        if ((sessionStorage.getItem('practise')=="true" ||  st && st.checkDrawing() && t !== r && t.key !== r) && document.activeElement.tagName !== 'INPUT') switch (t.key.toUpperCase()) {
            case "B":
                ut.brush.setTool("pen");
                break;
            case "E":
                ut.brush.setTool("erase");
                break;
            case "F":
                ut.brush.setTool("fill")
                break;
            case "C":
                ut.brush.setTool("pipette")
                break;
            case "T":
                if (document.activeElement.tagName != "INPUT" && !document.querySelector(".tabletOption"))
                    document.querySelector("#tabMode").dispatchEvent(new Event("click"));
                else if (document.activeElement.tagName != "INPUT" && document.querySelector(".modalBlur"))
                    document.querySelector(".modalBlur").dispatchEvent(new Event("click"));
                break;
            case "ESCAPE":
                it ? it.emit("canvasClear") : ut.clear();
        }
    }), ut.canvas.on("mousedown", function (t) {
        switch (t.preventDefault(), t.button + t.ctrlKey) { // + ctrl key when zooming
            case 0:
                ut.brush.down || (ut.brush.setDown(!0), T(t.clientX, t.clientY, !0))
        }
    }),ut.canvas.on("pointerdown", function (t) {
        if (t.altKey) {
            let from = { x: lastBrushUp.X, y: lastBrushUp.Y };
            T(t.clientX, t.clientY, !1, from);
            //I([0, ut.brush.colorIndex, ut.brush.thickness, prev.X, prev.Y, lastBrushUp.X, lastBrushUp.Y]);
        }
    });
    var gt = null;
    var setColorInterval = null;
    n("body").on("keydown", function (t) {
        if (t.ctrlKey && t.key.toLowerCase() == "c") {
            document.dispatchEvent(new Event("copyToClipboard"));
            return;
        }
        if (lastBrushUp.X < 0 || lastBrushUp.Y < 0 || !t.shiftKey || !t.key.includes("Arrow")) return;
        let move = () => {
            let prev = lastBrushUp;
            let acc = ut.brush.thickness / 4;
            switch (t.key) {
                case "ArrowUp":
                    lastBrushUp.Y = lastBrushUp.Y - acc;
                    break;
                case "ArrowDown":
                    lastBrushUp.Y = lastBrushUp.Y + acc;
                    break;
                case "ArrowLeft":
                    lastBrushUp.X = lastBrushUp.X - acc;
                    break;
                case "ArrowRight":
                    lastBrushUp.X = lastBrushUp.X + acc;
                    break;
            }
            I([0, ut.brush.colorIndex, ut.brush.thickness, prev.X, prev.Y, lastBrushUp.X, lastBrushUp.Y]);
        }
        move();
        move();
        move();
    }), ut.canvas.on("touchstart", function (t) {
        t.preventDefault();
        var e = t.changedTouches;
        e.length > 0 && null == gt && (gt = e[0].identitfier, !(t.ctrlKey) && ut.brush.setDown(!0), T(e[0].clientX, e[0].clientY, !0)) // + ctrl key when zooming
    }), ut.canvas.on("touchend", function (t) {
        t.preventDefault(), gt = null, ut.brush.setDown(!1);
    }), ut.canvas.on("touchcancel", function (t) {
        t.preventDefault(), gt = null, ut.brush.setDown(!1);
    }), ut.canvas.on("touchmove", function (t) {
        t.preventDefault();
        for (var e = t.changedTouches, n = 0; n < e.length; n++)
            if (e[n].identitfier == gt) {
                T(e[n].clientX, e[n].clientY, !1);
                break
            }
    }), n(this).on("mouseup", function (t) {
        switch (t.preventDefault(), t.button) {
            case 0:
                ut.brush.setDown(!1)
        }
    }), n("#buttonClearCanvas").on("click", function () {
        if (localStorage.keepCanvas == "true") {
            document.dispatchEvent(new CustomEvent("toast", { detail: { text: "Prevented Canvas Clear." } }));
            return;
        }
        it ? it.emit("canvasClear") : ut.clear()
    }), n(".containerTools .tool").on("click", function () {
        if (this.closest(".containerClearCanvas")) return;
        ut.brush.setTool(n(this).data("tool"));
        n(this).data("tool") != "pen" && n(this).data("tool") != "fill" && clearInterval(setColorInterval);
    }), n(".colorItem").on("click", function () {
        var t = n(this).data("color");
        ut.brush.setColor(Number(t))
    }), n(".brushSize").on("click", function () {
        var t = ut.brush.thicknessMin,
            e = ut.brush.thicknessMax,
            o = Number(n(this).data("size")) * (e - t) + t;
        ut.brush.setThickness(o)
    }), document.body.addEventListener("setBrushSize", function (event) {
        ut.brush.setThickness(event.detail);
    }), document.body.addEventListener("performDrawCommand", function (event) {
        I(event.detail);
    }), n("#inputChat").on("keyup", function (e) {
        if (e.key == "ArrowUp") {
            if (logPos <= 0) return;
            n("#inputChat").val(inputLog[--logPos]);
        }
        if (e.key == "ArrowDown") {
            if (logPos > inputLog.length - 1) return;
            n("#inputChat").val(inputLog[++logPos]);
        }
    }), document.body.addEventListener("setRandomColor", function (e) {
        clearInterval(setColorInterval);
        if (e.detail.enable != "false") setColorInterval = setInterval(function () {
            ut.brush.setColor(e.detail.colors[Math.floor((Math.random() * e.detail.colors.length))]);
        }, e.detail.enable);
    }), document.body.addEventListener("setColor", function (e) {
        if (e.detail.hex)
            ut.brush.setColor(10000 + Number("0x" + e.detail.hex.substr(1)));
        else ut.brush.setColor(Number(e.detail))
    }),
    (window.onbeforeunload = (e) => {
        if (sessionStorage.practise == "true") {
            e.returnValue = "Sure about that? Your drawing will be lost!";
            return "Sure about that? Your drawing will be lost!";
        }
    }), document.body.addEventListener('tooltip', function (e) {
        jQuery(e.detail.selector).tooltip({ container: 'body' });
    });
}(window, document, jQuery, localStorage);
