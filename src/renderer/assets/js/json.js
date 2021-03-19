export default {
    dump(key, obj) {
        if (key.startsWith('-')) return;
        localStorage.setItem(key, JSON.stringify(obj))
    },
    load(key) {
        if (key.startsWith('-')) return;
        return JSON.parse(localStorage.getItem(key));
    },
    constKeys: {
        serverDataPath: "serverDataPath",
        showUserIds: "-showUserIds",
        topUserIds: "-topUserIds",
    }
}