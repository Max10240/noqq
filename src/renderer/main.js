import Vue from 'vue'
import Axios from 'axios'

// import Mint from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(Mint);

import {getCookie} from "./assets/js/base";
import json from "./assets/js/json";
import MetaInfo from 'vue-meta-info';

Vue.use(MetaInfo);

import qs from 'qs';

import App from './App'
import router from './router'
import store from './store'

router.goBak = router.go;
router.go = function (n) {
    if (n === -1) {
        store.state.transitionName = 'slide-left';
        store.state.isGoingBack = true;
    }
    router.goBak(n)
}
// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'
// Vue.use(preview);

const path = require('path');
const fs = require('fs');
const {ipcRenderer} = require('electron');

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);



Vue.prototype.$axios = Axios;

// const USE_QQ_BOT = true;

let SERVE = process.env.NODE_ENV === 'development';
// let func_enc = (p) => {
//     if (window.Android) {
//         return window.Android.enc(p);
//     }
//     return '';
// };

// let urlHeader = SERVE ? '/api1' : '';
let urlHeader = "http://127.0.0.1:5700";
// let wsHeader = SERVE ? '/socket' : '';

Axios.interceptors.request.use(function (config) {
    if (!config.url.startsWith('http')) config.url = urlHeader + config.url;
    // if (config.method === 'post') {
    //     let str_params = '';
    //     if (!config.data) config['data'] = {};
    //     config.data['params_ts'] = new Date().getTime().toString().slice(0, 10);
    //     for (let k of Object.keys(config.data).sort()) {
    //         str_params += String(k) + String(config.data[k])
    //     }
    //     // console.log(str_params);
    //     config.data['params_sign'] = func_enc(str_params);
    //     // console.log(config.data['params_sign']);
    //     if (USE_QQ_BOT) config.data = qs.stringify(config.data);
    // }
    return config;
}, function (error) {
    return Promise.reject(error);
});

Vue.prototype.stt = store.state;
Vue.prototype.$stt = store.state;
Vue.prototype.$LS = json;
Vue.prototype.$fileDownloadDir = ipcRenderer.sendSync("get-download-path");

Vue.prototype.$getBotServerDataPath = (name) => {
    let botServerDataDir = path.join(store.state.serverDataPath, 'data');
    // console.log("fuck get path", __static, botServerDataDir);
    if (name === 'image') return path.join(botServerDataDir, 'images');
    else if (name === 'video') return path.join(botServerDataDir, 'videos');
    else if (name === 'voice') return path.join(botServerDataDir, 'voices');
    else throw new Error("unexpected path name:", name);
};
let timeDeviation = 0;

// Axios.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp").then(res => {
//     timeDeviation = res.data - new Date().getTime();
// });
Vue.prototype.$getTimestamp = function () {
    return Number(String(new Date().getTime() + timeDeviation).slice(0, 10));
};

Vue.prototype.$formatTime = function (ts) {
    const now = new Date(), currentTime = new Date(Number(`${ts}000`));
    if (now.getFullYear() !== currentTime.getFullYear()) return `${currentTime.getFullYear()}年`;
    else if (now.getMonth() !== currentTime.getMonth() || now.getDate() !== currentTime.getDate()) return `${currentTime.getMonth() + 1}月${currentTime.getDate()}日`;
    else {
        if (currentTime.getHours() < 12) return `上午${currentTime.getHours()}:${currentTime.getMinutes()}`;
        else if (currentTime.getHours() < 12) return `中午${currentTime.getHours()}:${currentTime.getMinutes()}`;
        else return `下午${currentTime.getHours()}:${currentTime.getMinutes()}`;
    }

};

Vue.prototype.$formatFileSize = function (size) {
    let result;
    if (size < 1024) result = `${size}B`;
    else if (size < 1024 * 1024) result = `${(size / 1024).toFixed(2)}KB`;
    else if (size < 1024 * 1024 * 1024) result = `${(size / (1024 * 1024)).toFixed(2)}MB`;
    else result = `${(size / (1024 * 1024 * 1024)).toFixed(2)}G`;
    return result;
};

Vue.prototype.STORE = store;

// import {get_cookie} from "./assets/js/base";
//
let login_path = '/login', register_path = '/register', select_server_path = '/selectserver';
// let wsUrl = 'ws://'
//     + window.location.host
//     + wsHeader
//     + "/ws/user";

let wsUrl = 'ws://127.0.0.1:6700';
let pongContent = "PONG";

function handleWsMsg(data) {
    if (data.meta_event_type !== 'heartbeat' && data.data !== null) console.log(data);
    if (data.meta_event_type === 'heartbeat' || data.data === null) {
        return;
    } else if (data.meta_event_type === 'lifecycle') {
        store.commit("updateSelfUserId", data.self_id);
    } else if (data.post_type === 'message' || data.post_type === 'message_sent') {
        let msgType = 0, body;
        // if (data.message.startsWith("[CQ:image,")) {
        //     msgType = 1;
        //     body = {
        //         url: data.message.match(/url=(.+)\]/)[1],
        //         imgId: data.message.match(/file=(.+)\.image/)[1],
        //     };
        // } else if (data.message.startsWith("[CQ:face,")) {
        //     msgType = 1;
        //     let face_id = data.message.match(/id=(\d+)\]/)[1];
        //     body = {
        //         url: `https://docs-v1.zhamao.xin/face/${face_id}.gif`,
        //     };
        // } else {
        //     body = {text: data.message};
        // }
        body = {text: data.message};
        let msg = {
            meta: {
                id: data.message_id,
                fromId: data.user_id,
                toId: data.group_id || data.self_id,
                ts: data.time,
                msgType,
                msgId: data.message_id,
                toType: data.message_type === 'private' ? 0 : 1,
                fromSelf: data.post_type === 'message_sent',
                message_seq: data.message_seq,
            },
            body,
        };
        if (data.isNewMsg !== false) msg.isNewMsg = true;
        store.commit("addMessage", msg);
    } else if (data.post_type === 'notice') {
        if (data.notice_type === 'offline_file') {
            let msg = {
                meta: {
                    id: `${data.time}-${data.file.url}`,
                    fromId: data.user_id,
                    toId: data.self_id,
                    ts: data.time,
                    msgType: 2,
                    msgId: data.file.url.split('/').slice(-1)[0],
                    toType: 0,
                    message_seq: data.message_seq,
                },
                body: data.file,
            };
            msg.isNewMsg = true;
            store.commit("addMessage", msg);
        }
        if (data.notice_type === 'group_upload') {
            let msg = {
                meta: {
                    id: `${data.time}-${data.file.id}`,
                    fromId: data.user_id,
                    toId: data.group_id,
                    ts: data.time,
                    msgType: 2,
                    msgId: data.file.url.split('/').slice(-1)[0],
                    toType: 1,
                    message_seq: data.message_seq,
                },
                body: data.file,
            };
            msg.isNewMsg = true;
            store.commit("addMessage", msg);
        }
    }
}

Vue.prototype.$handleWsMsg = handleWsMsg;
store.state.$handleWsMsg = handleWsMsg;

router.beforeEach((to, from, next) => {
    let path = to.fullPath;
    // if (getCookie('userid')) {
    if (!store.state.serverDataPath) {
        if (path === select_server_path) {
            next();
            return;
        }
        let localStoreDataPath = json.load(json.constKeys.serverDataPath);
        if (localStoreDataPath && fs.existsSync(localStoreDataPath)) {
            store.state.serverDataPath = localStoreDataPath;
        } else {
            next({
                path: select_server_path
            });
            return;
        }
    }
    if (1) {
        if (!store.state.inited) {
            store.state.inited = true;
            next({
                path: '/'
            });
        }
        if (store.state.msgWs === null) {
            // eslint-disable-next-line no-inner-declarations
            function reConnect(ws) {
                console.log("socket 连接断开，正在尝试重新建立连接");
                ws.init();
            }

            // eslint-disable-next-line no-inner-declarations
            function checkConnect(ws) {

                if (ws.websocket.readyState === ws.websocket.OPEN) ws.websocket.send("PING");
                if ((new Date().getTime() - WebSocket.lastHeartBeat) > WebSocket.overtime) {
                    reConnect();
                }
            }

            // eslint-disable-next-line no-inner-declarations
            function onOpen() {
            }

            let ws = {};
            ws.init = function (uri) {
                this.wsUri = this.wsUri || uri;
                this.lastHeartBeat = new Date().getTime();
                this.overtime = 8000;

                // initChannelData();
                ws.websocket = new WebSocket(ws.wsUri);

                ws.websocket.onerror = function (event) {
                    console.log(event)
                };

                ws.websocket.onopen = function (evt) {
                    onOpen(evt)
                };
                ws.websocket.onclose = function () {
                    reConnect(ws);
                };
                ws.websocket.onmessage = function (evt) {
                    ws.lastHeartBeat = new Date().getTime();
                    // console.log("recieve: ", evt.data);
                    let data = evt.data;

                    // test start
                    data = JSON.parse(data);
                    handleWsMsg(data);
                    return;

                    // eslint-disable-next-line no-unreachable
                    if (data === pongContent) return;
                    data = JSON.parse(data);
                    if (data.kind === 0) {
                        if (data.meta.fromId === store.state.selfUserId && data.meta.toId === store.state.selfUserId) return;
                        data.meta.unread = true;
                        data.isNewMsg = true;
                        store.commit("addMessage", data);
                    } else if (data.kind === 1) {
                        let oriId = data.data[0], nowId = data.data[1];
                        let pos = store.state.sendMsgs[oriId];
                        let aboutMsgs = store.state.messages[pos];
                        for (let i = aboutMsgs.length - 1; i >= 0; i--) {
                            let msg = aboutMsgs[i];
                            if (msg.meta.id === oriId) msg.meta.id = nowId;
                        }
                        delete store.state.sendMsgs[oriId];
                    } else if (data.kind === 2) {
                        store.commit("getAskList", 0);
                    } else if (data.kind === 3) {
                        store.commit("getAskList", 1);
                        if (data.groupId) {
                            store.commit("getInitalMsgAbout", {
                                id: data.groupId,
                                type: 1
                            });
                        }
                    } else {
                        console.log("unexpected ws data:", data)
                    }
                };
            };

            ws.init(wsUrl);
            setInterval(() => checkConnect(ws), 5000);
            store.state.msgWs = ws;

        }
    } else if (path !== login_path && path !== register_path) {
        next({
            path: login_path
        });
        return;
    }
    // for (let key in child_link_map.map) {
    //     let base_header = starts + key;
    //     if (path.startsWith(base_header)) {
    //         if (path.length === base_header.length) {
    //             next({
    //                 path: path + '/' + child_link_map.map[key]
    //             });
    //             return
    //         } else {
    //             child_link_map.map[key] = path.replace(base_header + '/', '');
    //         }
    //         break;
    //     }
    // }
    next();
});

router.afterEach(() => {
    // history.pushState(null, null, location.href);
    // console.log(location.href);
});
Vue.config.productionTip = false;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))


/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app')
