// eslint-disable-next-line no-unused-vars
export function dihejk() {
    var diz = document.getElementById("url").value;
    var jkurl = document.getElementById("jk");
    var jk = document.getElementById("jk").selectedIndex;
    var jkv = jkurl.options[jk].value;
    var cljurl = document.getElementById("player");
    cljurl.src = jkv + diz
}

// eslint-disable-next-line no-unexpected-multiline
function video_f1() {
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = '';
    } else {
        bp.src = '';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
}

video_f1();

function video_f2() {
    var src = (document.location.protocol == "http:") ? "//js.passport.qihucdn.com/11.0.1.js?cb9a6d8e6456d5329cfbe66f1d87f9a7" : "https://jspassport.ssl.qhimg.com/11.0.1.js?cb9a6d8e6456d5329cfbe66f1d87f9a7";
    document.write('<script src="' + src + '" id="sozz"></script>');
}

video_f2();

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?990a1ced91d4927e41a231d3ac0f56cb";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

// eslint-disable-next-line no-useless-escape
(function (e) {
    function t(e) {
        var t = location.href, n = t.split("").reverse(), r = e.split(""), i = [];
        for (var s = 0, o = 16; s < o; s++) i.push(r[s] + (n[s] || ""));
        return i.join("")
    }

    // eslint-disable-next-line no-useless-escape
    var n = /([http|https]:\/\/[a-zA-Z0-9\_\.]+\.so\.com)/gi, r = e.location.href;
    if (r && !n.test(r) && window.navigator.appName) {
        var i = "//s.360.cn/so/zz.gif", s = document.getElementById("sozz"), o = s.src.split("?")[1], u = t(o),
            a = new Image;
        r && (i += "?url=" + encodeURIComponent(r)), o && (i += "&sid=" + o), u && (i += "&token=" + u), o && (a.src = i)
    }
})(window);
