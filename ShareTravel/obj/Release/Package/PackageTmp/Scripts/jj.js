! function (e) {
    function t(o) {
        if (n[o]) return n[o].exports;
        var a = n[o] = {
            exports: {},
            id: o,
            loaded: !1
        };
        return e[o].call(a.exports, a, a.exports, t), a.loaded = !0, a.exports
    }
    var n = {};
    return t.m = e, t.c = n, t.p = "", t(0)
}([function (e, t) {
    function n(e) {
        var t, n = /\+/g,
            o = /([^&=]+)=?([^&]*)/g,
            a = function (e) {
                return decodeURIComponent(e.replace(n, " "))
            },
            i = e;
        for (urlParams = {}; t = o.exec(i) ;) urlParams[a(t[1])] = a(t[2]);
        return urlParams
    }

    function o() { }

    function a(e) {
        var t = e.getElementsByTagName("coordinates"),
            n = [];
        if (t.length)
            for (var o = t[0].firstChild.nodeValue.trim(), a = o.split(/0[\s\n]/), i = 0, s = a.length; i < s; i++) {
                var l = e.createElement("latLng");
                l.setAttribute("lon", a[i].split(",")[0].trim()), l.setAttribute("lat", a[i].split(",")[1].trim()), n.push(l)
            }
        return n
    }

    function i(e) {
        try {
            var t = new FileReader;
            t.onload = function () {
                var n = t.result;
                window.DOMParser ? xmlDoc = (new DOMParser).parseFromString(n, "text/xml") : (xmlDoc = new ActiveXObject("Microsoft.XMLDOM"), xmlDoc.async = !1, xmlDoc.loadXML(n));
                var o = xmlDoc.getElementsByTagName("trkpt");
                0 === o.length && (o = xmlDoc.getElementsByTagNameNS("http://www.garmin.com/xmlschemas/GpxExtensions/v3", "rpt")), 0 === o.length && (o = xmlDoc.getElementsByTagName("rtept")), 0 === o.length && (o = xmlDoc.getElementsByTagName("wpt")), 0 === o.length && (o = a(xmlDoc));
                for (var i = [], l = 0, r = o.length; l < r; l++) i.push(new google.maps.LatLng(1 * o[l].getAttribute("lat"), o[l].getAttribute("lon")));
                0 === i.length ? s("No waypoints found in provided file.") : ("" !== document.getElementById("routename").value ? document.getElementById("route-name-label").innerHTML = document.getElementById("routename").value : document.getElementById("route-name-label").innerHTML = e.value, u({
                    route: {
                        overview_path: i
                    }
                }))
            }, t.readAsText(e.files[0])
        } catch (e) {
            s("Error uploading file, please try a new file or a new browser.")
        }
    }

    function s(e) {
        document.getElementById("statusbox").style.display = "block", document.getElementById("statusbox").innerHTML = e, document.getElementById("stage").style.display = "none", $(document.body).scrollTop(0)
    }

    function l() {
        document.getElementById("statusbox").style.display = "none"
    }

    function r() {
        return google.maps.TravelMode[$("#travelmode").val()]
    }

    function d() {
        /*
        ga("send", {
            hitType: "event",
            eventCategory: "movie",
            eventAction: "framesLoading",
            eventLabel: c.getTotalFrames()
        })*/
    }

    function u(e) {
        null !== c && c.dispose(), c = new google.maps.StreetViewPlayer($.extend(e, {
            movieCanvas: document.getElementById("draw"),
            mapCanvas: document.getElementById("map"),
            travelMode: r(),
            fps: document.getElementById("fps").value,
            onLoading: function () {
                document.getElementById("stage").style.display = "block", document.getElementById("draw").className = "loading", document.getElementById("controls").style.visibility = "hidden", $(document.body).scrollTop($("#stage").offset().top)
            },
            onError: function (e) {
                s(e)
            },
            onPlay: function () {
                d(), document.getElementById("draw").className = "", document.getElementById("controls").style.visibility = "visible", document.getElementById("route-distance").innerHTML = Math.round(100 * c.getRouteDistance()) / 100 + "km"
            },
            onProgress: function (e) {
                document.getElementById("progressbar").style.width = e.loaded + "%", document.getElementById("bufferbar").style.width = Math.min(100 - e.loaded, e.buffer) + "%"
            }
        }))
    }
    var c = null;
    $(function () {
        google.charts.load("current", {
            packages: ["corechart"]
        })/*, ga("set", "metric1", "FramesPerRoute")*/, $("#progress").mousedown(function (e) {
            if (e.target === $("#progressbar")[0] || e.target === $("#bufferbar")[0]) {
                var t = $("#progress"),
                    n = Math.floor(c.getTotalVertices() * ((e.pageX - t.offset().left) / t.width()));
                c.setProgress(n, o)
            }
        });
        var e = window.location.hash || window.location.search;
        if (e && e.length) {
            var t = n(e.substring(1));
            "undefined" != typeof t.origin && (document.getElementById("origin").value = t.origin), "undefined" != typeof t.destination && (document.getElementById("destination").value = t.destination), "undefined" != typeof t.advanced && (document.getElementById("advanced").checked = !0, showAdvanced()), "undefined" != typeof t.fps && (document.getElementById("fps").value = t.fps), "undefined" != typeof t.travelmode && $("#travelmode").val(t.travelmode), "undefined" != typeof t.rn && (document.getElementById("routename").value = t.rn), initMovie()
        }
    }), window.pauseMovie = function (e) {
        c.getPaused() === !1 ? (c.setPaused(!0), e.title = "Play", e.firstChild.className = "glyphicon glyphicon-play") : (c.setPaused(!1), e.title = "Pause", e.firstChild.className = "glyphicon glyphicon-pause")
    }, window.fullScreen = function () {
        var e = document.getElementById("draw");
        e.requestFullscreen ? e.requestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen && e.webkitRequestFullscreen()
    }, $(function () {
        $("#downloadModal").on("shown.bs.modal", function () {
            c.buildMovie()
        })
    }), window.initMovie = function () {
        var e = document.getElementById("origin"),
            t = document.getElementById("destination"),
            n = document.getElementById("gxp-file");
        return l(), "" !== n.value ? void i(n) : "" === e.value ? void s("Origin field is required.") : "" === t.value ? void s("Destination field is required.") : ("" !== document.getElementById("routename").value ? document.getElementById("route-name-label").innerHTML = document.getElementById("routename").value : document.getElementById("route-name-label").innerHTML = e.value + " to " + t.value, void u({
            origin: e.value,
            destination: t.value
        }))
    }, window.speedUpMovie = function () {
        c.setFPS(c.getFPS() + 1)
    }, window.slowDownMovie = function () {
        c.setFPS(c.getFPS() - 1)
    }, window.buildLink = function () {
        window.location = "#" + $("#mainform").serialize()
    }, window.showAdvanced = function () {
        $("#advanced-area").removeClass("hidden")
    }, window.hideAdvanced = function () {
        $("#advanced-area").addClass("hidden")
    }, window.getShareURL = function () {
        return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname + (window.location.hash || window.location.search).replace("#", "?")
    }, window.shareMovie = function () {
        document.getElementById("routeURL").value = getShareURL()
    }, window.toggleAdvanced = function (e) {
        buildLink(), e.checked ? showAdvanced() : hideAdvanced()
    }, google.maps.StreetViewPlayer = function (e) {
        function t(e) {
            return e * (Math.PI / 180)
        }

        function n(e, n) {
            var o = t(e.lat()),
                a = t(n.lat()),
                i = t(n.lng()) - t(e.lng());
            return (180 * Math.atan2(Math.sin(i) * Math.cos(a), Math.cos(o) * Math.sin(a) - Math.sin(o) * Math.cos(a) * Math.cos(i)) / Math.PI + 360) % 360
        }

        function a(e, n) {
            var o = t(n.lat() - e.lat()),
                a = t(n.lng() - e.lng()),
                i = Math.sin(o / 2) * Math.sin(o / 2) + Math.cos(t(e.lat())) * Math.cos(t(n.lat())) * Math.sin(a / 2) * Math.sin(a / 2),
                s = 2 * Math.atan2(Math.sqrt(i), Math.sqrt(1 - i));
            return 6371 * s
        }

        function i() {
            null !== O.config.onLoading && O.config.onLoading instanceof Function && O.config.onLoading.call(this), O.setProgress(0, o)
        }

        function s(e) {
            F = e.length, r(0, e)
        }

        function l(e, t, n, o) {
            "OK" === o ? (t[e].panoData = n, setTimeout(r.bind(this, ++e, t), 500 / P), e > 0 && (b.push(new q(t[e - 1], t[e])), T++, x === !1 && (x = !0, null !== O.config.onPlay && O.config.onPlay instanceof Function && O.config.onPlay.call(this)))) : (t.splice(e, 1), F--, setTimeout(r.bind(this, e, t), 500 / P))
        }

        function r(e, t) {
            e < F && E.getPanoramaByLocation(t[e], _, l.bind(this, e, t))
        }

        function d() {
            var e = this;
            if (L = null, x = !1, i.call(e), "undefined" == typeof this.config.route) (new google.maps.DirectionsService).route({
                origin: this.config.origin,
                destination: this.config.destination,
                travelMode: this.config.travelMode
            }, function (t, n) {
                if (n === google.maps.DirectionsStatus.OK) {
                    for (var o = [], i = 0, s = t.routes[0].legs.length; i < s; i++)
                        for (var l = 0, r = t.routes[0].legs[i].steps.length; l < r; l++)
                            for (var u = 0, c = t.routes[0].legs[i].steps[l].lat_lngs.length; u < c; u++) o.push(t.routes[0].legs[i].steps[l].lat_lngs[u]);
                    for (var i = 1, s = o.length; i < s; i++) a(o[i], o[i - 1]) < .009 && (o.splice(i--, 1), s--);
                    g({
                        overview_path: o
                    }), null === S && (S = new google.maps.DirectionsRenderer, S.setMap(C)), S.setDirections(t)
                } else n === google.maps.DirectionsStatus.ZERO_RESULTS ? "BICYCLING" === e.config.travelMode ? (e.config.travelMode = "DRIVING", $("#travelmode").val("DRIVING"), setTimeout(function () {
                    d.call(e)
                }, 1)) : e.config.onError.call(this, e.config.travelMode + " is not available for this route, please select a different mode of travel under 'Advanced Options'") : null != e.config.onError && e.config.onError instanceof Function && e.config.onError.call(this, "Error pulling directions for movie, please try again.")
            });
            else {
                g(this.config.route);
                var t = new google.maps.Polyline({
                    path: this.config.route.overview_path,
                    geodesic: !0,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1,
                    strokeWeight: 2
                });
                t.setMap(C)
            }
        }

        function u(e) {
            for (var t = 0, n = 1, o = e.length; n < o; n++) t += a(e[n], e[n - 1]);
            return t
        }

        function c(e) {
            if (!google.visualization || !google.visualization.ColumnChart) return void google.charts.setOnLoadCallback(c.bind(this, e));
            var t = [];
            if (e.overview_path.length > 50)
                for (var n = Math.ceil(e.overview_path.length / 50), o = 0; o < e.overview_path.length; o += n) t.push(e.overview_path[o]);
            else t = e.overview_path;
            M.getElevationAlongPath({
                path: t,
                samples: Math.floor(10 * k)
            }, function (e, t) {
                var n = document.getElementById("elevation_chart");
                if ("OK" !== t) return void (n.innerHTML = "Cannot show elevation: request failed because " + t);
                var o = new google.visualization.ColumnChart(n),
                    a = new google.visualization.DataTable;
                a.addColumn("string", "Sample"), a.addColumn("number", "Elevation");
                for (var i = 0; i < e.length; i++) {
                    var s = i % 10 === 0 ? Math.floor(i / 10) + "km" : "";
                    a.addRow([s, e[i].elevation])
                }
                o.draw(a, {
                    height: 150,
                    legend: "none",
                    titleY: "Elevation (m)"
                })
            })
        }

        function g(e) {
            R = !0, b = [], T = 0, B = 0, k = u(e.overview_path), s(e.overview_path), null === C && (C = new google.maps.Map(O.config.mapCanvas, {
                zoom: 14,
                center: e.overview_path[0],
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }), L = new google.maps.Marker({
                map: C,
                location: e.overview_path[0],
                visible: !0
            })), c(e), O.setPaused(!1)
        }

        function m(e, t) {
            return parseInt(Math.floor(e * t / 512))
        }

        function h(e, t, n, o, a, i) {
            for (var s = a.getImageData(), l = 0, r = s.length; l < r; l++) i.drawImage(a.m_aImages[l], 0, 0, 512, 512, m(s[l].left, e), 0, e, t)
        }

        function f(e, t) {
            document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement ? (N.height = screen.availHeight, N.width = screen.availWidth) : (N.width = N.parentNode.offsetWidth, N.height = 700), 0 === e.m_aImages.length ? e.getLoadedImages(function (n, o) {
                e.m_aImages = o, h(N.width, N.height, 512, 512, e, A), t()
            }) : (h(N.width, N.height, 512, 512, e, A), t()), L.setPosition(e.getPosition())
        }

        function v() {
            D = setTimeout(p, 1e3 / P >> 0)
        }

        function p() {
            R === !1 && (B >= T ? O.setProgress(T, v) : R === !1 && T > 0 && B <= T && O.setProgress(B, function () {
                B++, v()
            }))
        }

        function w() {
            B + 1 < b.length && b[B + 1].loadImages()
        }

        function y() {
            var e = document.getElementById("export-width");
            return e ? 1 * e.value : 512
        }

        function I() {
            var e = document.getElementById("export-height");
            return e ? 1 * e.value : 512
        }
        this.config = e, this.config.movieCanvas.innerHTML = "";
        var E = new google.maps.StreetViewService,
            M = new google.maps.ElevationService,
            b = [],
            _ = 50,
            P = 20,
            B = 0,
            C = null,
            S = null,
            x = !0,
            L = null,
            D = 0,
            T = 0,
            F = 0,
            R = !0,
            k = 0,
            N = document.getElementById("draw"),
            A = N.getContext("2d"),
            O = this;
        "undefined" == typeof this.config.fps || isNaN(parseInt(this.config.fps)) || (P = 1 * this.config.fps);
        var q = function (e, t) {
            this.m_pPanoData = e.panoData, this.m_sPanoId = this.m_pPanoData.location.pano, this.m_iCameraYaw = this.m_pPanoData.tiles.centerHeading, this.m_iNextYaw = n(e, t), this.m_aImages = [], this.m_aCanvasStyles = null;
            var o = this.m_iNextYaw - this.m_iCameraYaw;
            o < 0 ? o += 360 : o > 360 && (o -= 360);
            var a = 896 + o * (1664 / 360) >> 0;
            a > 1664 && (a -= 1664), this.m_iCanvasOffset = a, a >> 8 === 0 ? this.m_aCanvasStyles = [2, 3, 0] : 256 === a ? this.m_aCanvasStyles = [0] : a - 256 >> 9 === 0 ? this.m_aCanvasStyles = [0, 1] : 768 === a ? this.m_aCanvasStyles = [1] : a - 768 >> 9 === 0 ? this.m_aCanvasStyles = [1, 2] : 1280 === a ? this.m_aCanvasStyles = [2] : this.m_aCanvasStyles = [2, 3]
        };
        q.prototype.loadImages = function () {
            for (var e = this.m_aCanvasStyles, t = 0, n = e.length; t < n; t++) this.m_aImages.push(this.getImage(e[t], 0))
        }, q.prototype.getLoadedImages = function (e) {
            for (var t = [], n = this.m_aCanvasStyles, o = 0, a = n.length; o < a; o++) t.push(this.getImage.bind(this, n[o], 0));
            async.parallel(t, e)
        }, q.prototype.getImage = function (e, t, n) {
            var o = new Image;
            return n && (o.onload = function () {
                n(null, o)
            }), o.crossOrigin = "Anonymous", o.src = "http://cbk0.google.com/cbk?output=tile&panoid=" + this.m_sPanoId + "&zoom=2&x=" + e + "&y=" + t + "&cb_client=api&fover=0&onerr=3", o
        }, q.prototype.getImageData = function () {
            var e = this.m_iCanvasOffset,
                t = this.m_aCanvasStyles;
            if (3 === t.length) {
                var n = 384 + e;
                return [{
                    left: -n,
                    image: this.m_aImages[0].src
                }, {
                    left: -n + 512,
                    width: "128px",
                    image: this.m_aImages[1].src
                }, {
                    left: -n + 640,
                    image: this.m_aImages[2].src
                }]
            }
            if (1 === t.length) return [{
                left: 0,
                image: this.m_aImages[0].src
            }];
            var n = e - 256 * (2 * t[0] + 1);
            return [{
                left: -n,
                image: this.m_aImages[0].src
            }, {
                left: -n + 512,
                image: this.m_aImages[1].src
            }]
        }, q.prototype.getPosition = function () {
            return this.m_pPanoData.location.latLng
        }, this.dispose = function () {
            clearTimeout(D)
        }, this.setSensitivity = function (e) {
            _ = e
        }, this.getSensitivity = function () {
            return _
        }, this.getRouteDistance = function () {
            return k
        }, this.setFPS = function (e) {
            P = Math.max(1, e)
        }, this.getFPS = function () {
            return P
        }, this.setProgress = function (e, t) {
            B = e, B >= 0 && B < b.length ? (w(), f(b[B], t)) : t(), O.config.onProgress.call(this, {
                loaded: parseInt(100 * B / (F - 1)),
                buffer: parseInt(100 * ((T - B) / (F - 1)))
            })
        }, this.setPaused = function (e) {
            R = e, e === !1 && p.call(O)
        }, this.getPaused = function () {
            return R
        }, this.getTotalVertices = function () {
            return F
        }, this.getTotalFrames = function () {
            return T
        }, this.buildMovie = function () {
            function e(e) {
                var t = document.createElement("canvas");
                t.width = n, t.height = o;
                var i = t.getContext("2d");
                h(n, o, 512, 512, e, i), a.addFrame(t, {
                    delay: 1e3
                })
            }

            function t(n) {
                n >= b.length ? a.render() : b[n].getLoadedImages(function (o, a) {
                    b[n].m_aImages = a, e(b[n]), t(n + 1)
                })
            }
            var n = y(),
                o = I(),
                a = new GIF({
                    workers: 2,
                    workerScript: "../Scripts/gif.worker.js",
                    quality: 10,
                    width: n,
                    height: o
                });
            document.getElementById("downloadResult").innerHTML = "";
            var i = document.getElementById("downloadProgress");
            a.on("progress", function (e) {
                i.style.width = parseInt(100 * e) + "%"
            }), a.on("finished", function (e) {
                var t = new Image;
                t.src = URL.createObjectURL(e), document.getElementById("downloadResult").appendChild(t)/*, ga("send", "event", "videos", "download", b.length)*/
            }), t(0)
        }, d.call(this)
    }
}]);