export function getCookie(key) {
    let c_array = document.cookie.split(';');
    for (let k_v in c_array) {
        k_v = c_array[k_v];
        k_v = k_v.replace(' ', '');
        k_v = k_v.split('=');
        if (k_v[0] === key) {
            return k_v[1];
        }
    }
}

export function getSearch(key, url) {
    url = url || location.search;
    let regex = new RegExp('\\W' + key + '=(\\w+)');
    const matchResult = url.match(regex);
    return matchResult && matchResult[1];
}

export function showThisDom(elem) {
    elem.style.display = ""
}

export function hideThisDom(elem) {
    elem.style.display = "none"
}

export function toggleThisDom(elem) {
    elem.style.display = elem.style.display === "" ? 'none' : ''
}


export function clickHereOnly(targetDom, cancelCallback, finalCallback) {
    let handler = event => {
        if (!event.target.parentNode.contains(targetDom)) {
            event.stopPropagation();
            document.removeEventListener("click", handler, true);
        }
        if (targetDom.contains(event.target)) {
            event.target.click();
        } else if (cancelCallback) cancelCallback();
        if (finalCallback) finalCallback();
    };

    document.addEventListener("click", handler, true);

}