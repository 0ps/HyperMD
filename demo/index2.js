/* global editor, CODEMIRROR_ROOT */

// the following code is just for test.
// useless for you.

function click_bind(id, func, event) {
    var btn = document.getElementById(id)
    btn.addEventListener(event || "click", func, false)
}

click_bind("raw_mode", function () {
    editor.setOption('theme', 'default')

    // stop auto folding
    editor.setOption('hmdAutoFold', 0)
    editor.setOption('hmdFoldMath', false)

    // unfold all folded parts
    setTimeout(function () {
        var marks = editor.getAllMarks()
        for (var i = 0; i < marks.length; i++) {
            var mark = marks[i]
            if (/^hmd-/.test(mark.className)) mark.clear()
        }
    }, 200) // FIXME: the timeout is not determined

    // stop hiding tokens
    editor.setOption('hmdHideToken', '')

    // stop aligining table columns
    editor.setOption('hmdTableAlign', false)
})

click_bind("hypermd_mode", function () {
    editor.setOption('theme', 'hypermd-light')
    editor.setOption('hmdAutoFold', 200)
    editor.setOption('hmdFoldMath', { interval: 200, preview: true })
    editor.setOption('hmdHideToken', '(profile-1)')
    editor.setOption('hmdTableAlign', { lineColor: '#999', rowsepColor: '#999' })
})

!function hideSplash() {
    if (!window.editor) return setTimeout(hideSplash, 100)
    document.getElementById('header').setAttribute('style', 'height:1px; overflow:hidden')
}()

// Use CDN to load CodeMirror and other stuff
// only works on https://*.github.io/ and https://*.laobubu.net/
// useless for you (maybe)

if (/\.github\.|laobubu\.net/.test(location.hostname)) {

    var node_modules_RE = /^.*node_modules\//
    var CDNPrefix = "https://cdn.jsdelivr.net/npm/"

    // inject requirejs
    var old_requirejs_load = requirejs.load
    requirejs.load = function (context, moduleId, url) {
        url = url.replace(node_modules_RE, CDNPrefix)
        return old_requirejs_load.call(this, context, moduleId, url)
    }

    // Redirect style
    Array.prototype.forEach.call(document.querySelectorAll("link"), function (link) {
        var href = link.href
        if (!node_modules_RE.test(href)) return
        href = href.replace(node_modules_RE, CDNPrefix)

        link.href = href
    })

    // Load Scripts from CDN
    Array.prototype.forEach.call(document.querySelectorAll("script"), function (link) {
        var src = link.getAttribute("src")
        if (!node_modules_RE.test(src)) return
        src = src.replace(node_modules_RE, CDNPrefix)

        var script = document.createElement("script")
        script.src = src
        document.body.appendChild(script)
    })
}
