/**
* @license BSD-3-Clause
* @copyright 2014-2023 hizzgdev@163.com
*
* Project Home:
*   https://github.com/hizzgdev/jsmind/
*/
!function() {
    "use strict";
    if (!jsMind)
        throw new Error("jsMind is not defined");
    const t = jsMind.$;
    var e = function(t, e) {
        return t.getPropertyValue(e)
    }
      , i = function(t) {
        var i = e(t, "visibility")
          , n = e(t, "display");
        return "hidden" !== i && "none" !== n
    }
      , n = {
        rect: function(t, e, i, n, a, s) {
            n < 2 * s && (s = n / 2),
            a < 2 * s && (s = a / 2),
            t.moveTo(e + s, i),
            t.arcTo(e + n, i, e + n, i + a, s),
            t.arcTo(e + n, i + a, e, i + a, s),
            t.arcTo(e, i + a, e, i, s),
            t.arcTo(e, i, e + n, i, s)
        },
        text_multiline: function(t, e, i, n, a, s, o) {
            var r = ""
              , l = e.length
              , d = e.split("")
              , h = null;
            t.textAlign = "left",
            t.textBaseline = "top";
            for (var c = 0; c < l; c++)
                h = r + d[c],
                t.measureText(h).width > a && c > 0 ? (t.fillText(r, i, n),
                r = d[c],
                n += o) : r = h;
            t.fillText(r, i, n)
        },
        text_ellipsis: function(t, e, i, a, s, o) {
            var r = a + o / 2;
            e = n.fittingString(t, e, s);
            t.textAlign = "left",
            t.textBaseline = "middle",
            t.fillText(e, i, r, s)
        },
        fittingString: function(t, e, i) {
            var n = t.measureText(e).width
              , a = t.measureText("…").width;
            if (n <= i || n <= a)
                return e;
            for (var s = e.length; n >= i - a && s-- > 0; )
                e = e.substring(0, s),
                n = t.measureText(e).width;
            return e + "…"
        },
        image: function(t, e, i, a, s, o, r, l, d) {
            var h = new Image;
            h.onload = function() {
                t.save(),
                t.translate(i, a),
                t.save(),
                t.beginPath(),
                n.rect(t, 0, 0, s, o, r),
                t.closePath(),
                t.clip(),
                t.translate(s / 2, o / 2),
                t.rotate(l * Math.PI / 180),
                t.drawImage(h, -s / 2, -o / 2),
                t.restore(),
                t.restore(),
                d && d()
            }
            ,
            h.src = e
        }
    };
    class a {
        constructor(t) {
            this.jm = t,
            this.canvas_elem = null,
            this.canvas_ctx = null,
            this._inited = !1
        }
        init() {
            if (!this._inited) {
                console.log("init");
                var e = t.c("canvas")
                  , i = e.getContext("2d");
                this.canvas_elem = e,
                this.canvas_ctx = i,
                this.jm.view.e_panel.appendChild(e),
                this._inited = !0,
                this.resize()
            }
        }
        shoot(t) {
            this.init(),
            this._draw(function() {
                t && t(),
                this.clean()
            }
            .bind(this)),
            this._watermark()
        }
        shootDownload() {
            this.shoot(function() {
                this._download()
            }
            .bind(this))
        }
        shootAsDataURL(t) {
            this.shoot(function() {
                t && t(this.canvas_elem.toDataURL())
            }
            .bind(this))
        }
        resize() {
            this._inited && (this.canvas_elem.width = this.jm.view.size.w,
            this.canvas_elem.height = this.jm.view.size.h)
        }
        clean() {
            var t = this.canvas_elem;
            this.canvas_ctx.clearRect(0, 0, t.width, t.height)
        }
        _draw(t) {
            var e = this.canvas_ctx;
            e.textAlign = "left",
            e.textBaseline = "top",
            this._draw_lines(function() {
                this._draw_nodes(t)
            }
            .bind(this))
        }
        _watermark() {
            var e = this.canvas_elem
              , i = this.canvas_ctx;
            i.textAlign = "right",
            i.textBaseline = "bottom",
            i.fillStyle = "#000",
            i.font = "11px Verdana,Arial,Helvetica,sans-serif",
            i.fillText("github.com/hizzgdev/jsmind", e.width - 5.5, e.height - 2.5),
            i.textAlign = "left",
            i.fillText(t.w.location, 5.5, e.height - 2.5)
        }
        _draw_lines(t) {
            this.jm.view.graph.copy_to(this.canvas_ctx, t)
        }
        _draw_nodes(e) {
            var i, n = this.jm.mind.nodes;
            for (var a in n)
                i = n[a],
                this._draw_node(i);
            !function a() {
                console.log("check_node_ready" + new Date);
                var s = !0;
                for (var o in n)
                    s &= (i = n[o]).ready;
                s ? t.w.setTimeout(e, 200) : t.w.setTimeout(a, 200)
            }()
        }
        _draw_node(t) {
            var a = this.canvas_ctx
              , s = t._data.view
              , o = s.element
              , r = getComputedStyle(o);
            if (i(r)) {
                var l = e(r, "background-color")
                  , d = parseInt(e(r, "border-top-left-radius"))
                  , h = e(r, "color")
                  , c = parseInt(e(r, "padding-left"))
                  , v = parseInt(e(r, "padding-right"))
                  , f = parseInt(e(r, "padding-top"))
                  , _ = parseInt(e(r, "padding-bottom"))
                  , g = e(r, "text-overflow")
                  , m = e(r, "font-style") + " " + e(r, "font-variant") + " " + e(r, "font-weight") + " " + e(r, "font-size") + "/" + e(r, "line-height") + " " + e(r, "font-family")
                  , u = {
                    x: s.abs_x,
                    y: s.abs_y,
                    w: s.width + 1,
                    h: s.height + 1
                }
                  , w = {
                    x: u.x + c,
                    y: u.y + f,
                    w: u.w - c - v,
                    h: u.h - f - _
                };
                if (a.font = m,
                a.fillStyle = l,
                a.beginPath(),
                n.rect(a, u.x, u.y, u.w, u.h, d),
                a.closePath(),
                a.fill(),
                a.fillStyle = h,
                "background-image"in t.data) {
                    var p = e(r, "background-image").slice(5, -2);
                    t.ready = !1;
                    var x = 0;
                    "background-rotation"in t.data && (x = t.data["background-rotation"]),
                    n.image(a, p, u.x, u.y, u.w, u.h, d, x, (function() {
                        t.ready = !0
                    }
                    ))
                }
                if (t.topic)
                    if ("ellipsis" === g)
                        n.text_ellipsis(a, t.topic, w.x, w.y, w.w, w.h);
                    else {
                        var y = parseInt(e(r, "line-height"));
                        n.text_multiline(a, t.topic, w.x, w.y, w.w, w.h, y)
                    }
                s.expander && this._draw_expander(s.expander),
                "background-image"in t.data || (t.ready = !0)
            } else
                t.ready = !0
        }
        _draw_expander(t) {
            var n = this.canvas_ctx
              , a = getComputedStyle(t);
            if (i(a)) {
                var s = e(a, "left")
                  , o = e(a, "top");
                e(a, "font");
                var r = parseInt(s)
                  , l = parseInt(o)
                  , d = "+" === t.innerHTML;
                n.lineWidth = 1,
                n.beginPath(),
                n.arc(r + 7, l + 7, 5, 0, 2 * Math.PI, !0),
                n.moveTo(r + 10, l + 7),
                n.lineTo(r + 4, l + 7),
                d && (n.moveTo(r + 7, l + 4),
                n.lineTo(r + 7, l + 10)),
                n.closePath(),
                n.stroke()
            }
        }
        _download() {
            var e = this.canvas_elem
              , i = this.jm.mind.name + ".png";
            if (navigator.msSaveBlob && e.msToBlob) {
                var n = e.msToBlob();
                navigator.msSaveBlob(n, i)
            } else {
                var a = this.canvas_elem.toDataURL()
                  , s = t.c("a");
                if ("download"in s) {
                    s.style.visibility = "hidden",
                    s.href = a,
                    s.download = i,
                    t.d.body.appendChild(s);
                    var o = t.d.createEvent("MouseEvents");
                    o.initEvent("click", !0, !0),
                    s.dispatchEvent(o),
                    t.d.body.removeChild(s)
                } else
                    location.href = a
            }
        }
        jm_event_handle(t, e) {
            t === jsMind.event_type.resize && this.resize()
        }
    }
    var s = new jsMind.plugin("screenshot",(function(t) {
        var e = new a(t);
        t.screenshot = e,
        t.shoot = function() {
            e.shoot()
        }
        ,
        t.add_event_listener((function(t, i) {
            e.jm_event_handle.call(e, t, i)
        }
        ))
    }
    ));
    jsMind.register_plugin(s)
}();
//# sourceMappingURL=jsmind.screenshot.js.map
