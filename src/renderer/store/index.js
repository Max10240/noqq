import Vue from 'vue'
import Vuex from 'vuex'
import Dexie from 'dexie';

import Axios from 'axios';
import json from "../assets/js/json";
import router from "../router";

const {ipcRenderer} = require('electron');

Vue.use(Vuex);

let downloadUniqueId = 0;

let users = {
    locks: [{}, {}],
    data: [{}, {}],
    get(i, type = 0) {
        type = Number(type);
        if (!i && i !== 0) return;
        let user = this.data[type][i];
        if (user) return user;
        if (this.locks[type][i]) {
            // console.log("locked: i-type" + i + "-" + type);
            return
        }
        this.locks[type][i] = true;
        // console.log("Getting userinfo for: i-type" + i + "-" + type);

        // Vue.prototype.$axios.post(type === 0 ? "/get_stranger_info" : "/get_group_info", {"id": i}).then(res => {
        //     res.data.type = type;
        //     res.data.isTop = store.state.topUserIds.has(store.state.generateUniqueId(type, res.data.id));
        //     Vue.set(this.data[type], res.data.id, res.data)
        // })

        if (type === 0) {
            Axios.get(
                '/get_stranger_info',
                {
                    params: {
                        user_id: i
                    }
                }
            ).then(res => {
                this.set(type, res.data.data);
                // console.log(store.state.topUserIds, store.state.generateUniqueId(type, i));
                // if (store.state.topUserIds.has(store.state.generateUniqueId(type, i))) {
                //     store.commit("setTop", this.data[type][i]);
                // }
            }).catch(() => {
                this.locks[type][i] = false;
            })
        } else if (type === 1) {
            Axios.get(
                '/get_group_info',
                {
                    params: {
                        group_id: i
                    }
                }
            ).then(res => {
                this.set(type, res.data.data);
            }).catch(() => {
                this.locks[type][i] = false;
            })
        }
    },
    set(type, info) {
        if (type === 0) {
            Vue.set(this.data[type], info.user_id, {
                id: info.user_id,
                type,
                name: info.remark || info.nickname,
                avatar: `http://q1.qlogo.cn/g?b=qq&nk=${info.user_id}&s=100`,
            });
            // console.log("---set user", store.state.topUserIds, store.state.generateUniqueId(type, info.user_id));
            if (store.state.topUserIds.has(store.state.generateUniqueId(type, info.user_id))) {
                store.commit("setTop", this.data[type][info.user_id]);
            }

        } else if (type === 1) {
            Vue.set(this.data[type], info.group_id, {
                id: info.group_id,
                type,
                name: info.group_name,
                avatar: `http://p.qlogo.cn/gh/${info.group_id}/${info.group_id}/100`,
            });
            if (store.state.topUserIds.has(store.state.generateUniqueId(type, info.group_id))) {
                store.commit("setTop", this.data[type][info.group_id]);
            }
        }

    }
};

function getTotalUnreadNum(msgs) {
    let values = Object.values(msgs), total = 0;
    values.forEach(e => total += e);
    return total;
}

function getTotalUnhandlePeopleNum(oriPeopleAskList) {
    if (!oriPeopleAskList) return 0;
    // console.log("peopleAskList", oriPeopleAskList);
    let total = 0;
    oriPeopleAskList.forEach(e => {
        if (e.status === 0 && e.toId === store.state.selfUserId) total += 1;
    });

    return total
}

function getTotalUnhandleGroupNum(oriGroupAskList) {
    if (!oriGroupAskList) return 0;
    // console.log("oriGroupAskList", oriGroupAskList);
    let total = 0;
    oriGroupAskList.forEach(e => {
        if (e.status === 2) total += 1;
    });

    return total
}

function generateUniqueId(toType, userId) {
    return `${toType}_${userId}`
}

function splitUniqueId(uid) {
    return uid.split('_')
}

function getShowMsgList(showIds, totalMsgs, topUsers) {
    return [...showIds].map(u_id => {
        let lastMsg;
        for (let m of totalMsgs[u_id]) {
            // console.log("single msg:", m);
            // if (m.meta.unread) unreadNum++;
            if (!lastMsg || lastMsg.meta.ts < m.meta.ts) {
                lastMsg = m;
            }
        }
        if (!lastMsg) return null;
        let [type, id] = splitUniqueId(u_id);
        let content = "未知类型消息";
        if (lastMsg.meta.msgType === 0) {
            content = lastMsg.body.text
        } else if (lastMsg.meta.msgType === 1) {
            content = "[图片]"
        } else if (lastMsg.meta.msgType === 2) {
            content = "[文件]"
        }
        return {
            content,
            num: store.getters.currentUserUnreadMsgNum(type, id),
            time: lastMsg.meta.ts,
            fromId: id,
            oriMsg: lastMsg,
            uid: u_id,
        }
    }).sort((v0, v1) => -(topUsers.has(v0.uid) - topUsers.has(v1.uid)) * 10 + ((v0.time > v1.time) ? -1 : 1));

    // if (!r.length) return r;
    // let newArray = [r[0]];
    // r.slice(1, ).forEach(e=>{
    //     for (let i = 0; i < newArray.length; i++) {
    //         let v0 = e, v1 = newArray[i];
    //         if (-(topUsers.has(v0.uid) - topUsers.has(v1.uid)) * 10 + -1 * (Number(v0.time) > Number(v1.time)) <= 0){
    //             newArray.splice(i, 0, e);
    //             return
    //         }
    //     }
    //     newArray.push(e);
    // })
    // return newArray;
}

async function loadTopUserIds() {
    let s = new Set();
    // (json.load(json.constKeys.topUserIds) || []).forEach(e => s.add(e));
    const db = store.getters.db;
    await db.topUserIds.each(d => s.add(d.uid));
    store.state.topUserIds = s;
    // Vue.set(store.state, "topUserIds", s);
}

let store = new Vuex.Store({
    state: {
        inited: false,
        now_version_name: '',
        msgWs: null,
        indexPageIndex: 0,
        users: users,
        selfUserId: null,
        messages: {},
        showUserIds: new Set(),
        topUserIds: new Set(),
        unreadMsgs: {},
        sendMsgs: {},
        selfSendMsgLock: {},
        friendIds: [],
        oriPeopleAskList: [],
        oriGroupAskList: [],
        backCd: false,
        downloadList: {},
        dialogOpenRecord: {},
        swipeOption: {direction: 'horizontal'},
        serverDataPath: '',
        transitionName: null,
        isGoingBack: false,
        getOwnerIdOfMsg(msg) {
            return msg.meta.fromId === store.state.selfUserId ? msg.meta.toId : (msg.meta.toType === 0 ? msg.meta.fromId : msg.meta.toId)
        },
        generateUniqueId,
        splitUniqueId,
        updateContactHeight() {
            // reset in contact.vue
        },
        swiperight() {
            if (store.state.backCd) return;
            store.state.backCd = true;
            setTimeout(() => {
                store.state.backCd = false;
            }, 200);
            router.go(-1);
        },
        needReload(url) {
            let headers = [
                "http://gchat.qpic.cn/gchatpic_new",
            ];
            for (let header of headers) {
                if (url.startsWith(header)) return true;
            }
            return false;
        },
        getUniqueDownloadId() {
            let v = downloadUniqueId;
            downloadUniqueId = (downloadUniqueId + 1) % 999999;
            return v
        },
        saveMsgToDB: async function (msg, unique_id) {
            let state = store.state;
            delete msg.isNewMsg;

            unique_id = unique_id || state.generateUniqueId(msg.meta.toType, state.getOwnerIdOfMsg(msg));

            const db = store.getters.db;
            await db.messages.add({
                uid: unique_id,
                id: msg.meta.id,
                ts: msg.meta.ts,
                data: msg,
            }).catch(e => {
                // console.log(e)
                // console.error('fuck, it exists')
            })
        },
    },
    mutations: {
        update_now_version_name(state, v_n) {
            state.now_version_name = v_n;
        },
        gotoThisIndexPage(state, value) {
            state.indexPageIndex = value;
        },
        addMessage(state, msg,) {
            let msgType = msg.meta.toType;
            if (msg.meta.msgType === 0 && msg.body.text === '') return;
            let msgOwnerId = state.getOwnerIdOfMsg(msg);

            if (msg.meta.fromSelf && state.selfSendMsgLock[msgOwnerId]) {
                msg._retryCount = msg._retryCount || 0;
                msg._retryCount += 1;
                if (msg._retryCount < 20) {
                    setTimeout(() => {
                        console.log("can't add message now");
                        store.commit("addMessage", msg)
                    }, 100);
                } else {
                    console.error("msg can't be recieved", msg);
                }
                return;
            }
            let unique_id = state.generateUniqueId(msgType, msgOwnerId);
            let msgList = state.messages[unique_id];

            if (!msgList) msgList = [];
            else if (msgList.map(v => {
                return v.meta.id;
            }).indexOf(msg.meta.id) !== -1) {
                // console.log("exist!", msg.meta.id);
                return
            }


            // console.log(state.messages[msgType][msgOwnerId].map(v => {
            //     return v.meta.id;
            // }), msg.meta.id);


            msg.meta.msgOwnerId = msgOwnerId;

            msgList.push(msg);
            msgList.sort((e0, e1) => e0.meta.ts - e1.meta.ts);
            Vue.set(state.messages, unique_id, msgList);

            function addShowUser(unique_id) {
                if (!state.showUserIds.has(unique_id)) {
                    state.showUserIds.add(unique_id);
                    let arraySet = [...state.showUserIds];

                    json.dump(json.constKeys.showUserIds, arraySet);

                    async function f() {
                        const db = store.getters.db;
                        // console.log("db is:", db);
                        // console.log("first show user is:", await db.showUserIds.where("uid").equals(unique_id).first());

                        if (!(await db.showUserIds.where("uid").equals(unique_id).first())) {
                            await db.showUserIds.add({
                                uid: unique_id
                            })
                        }
                    }

                    f().then(() => {
                    }).catch((e) => {
                        console.log("fuck...");
                        console.error(e);
                    });

                    Vue.set(state, 'showUserIds', new Set(state.showUserIds));
                }
            }

            addShowUser(unique_id);
            if (msg.isNewMsg) {
                Vue.set(state.unreadMsgs, unique_id, (state.unreadMsgs[unique_id] || 0) + 1);
            }


            if (!msg.meta.localId) state.saveMsgToDB(msg, unique_id).then();
            // if (!msg.notSave)
        },
        updateSelfUserId(state, id) {
            state.selfUserId = Number(id);

            Vue.nextTick(() => {
                async function f() {
                    const db = store.getters.db;
                    // console.log("db is ---", db);
                    await loadTopUserIds();
                    Axios.get('/get_friend_list').then(res => {
                        res.data.data.forEach(e => {
                            store.state.users.set(0, e);
                            store.state.friendIds.push(e.user_id);
                        });
                    });
                    let savedShowUserIds = (await db.showUserIds.toArray()) || [];
                    savedShowUserIds = savedShowUserIds.map(d => d.uid);
                    savedShowUserIds.forEach(uid => {
                        let [type, id] = store.state.splitUniqueId(uid);
                        store.commit('getInitalMsgAbout', {type, id});
                    });


                    store.commit("refreshWhenContacted", {
                        excludeUids: savedShowUserIds,
                    });

                    store.commit("getAskList");
                }

                f().then();
            });

        },
        loadMsgsFromServer() {
        },
        readMsgAbout(state, data) {
            let unique_id = state.generateUniqueId(data.toType, data.fromId);

            // readMsgAbout
            // if (state.unreadMsgs[unique_id]) Axios.post("/readMsgAbout", data).then(() => {
            //     // alert(`read ${unique_id}`);
            // });

            Vue.set(state.unreadMsgs, unique_id, 0);
            // state.unreadMsgs[unique_id] = 0;
        },
        addUnreadMsgCount(state, data) {
            let uid = state.generateUniqueId(data.type, data.id);
            Vue.set(state.unreadMsgs, uid, data.count);
        },
        setTop(state, user) {
            console.log("set top user", user);
            if (!user) return;
            if (user.isTop === true) return;
            user.isTop = true;
            let uid = state.generateUniqueId(user.type, user.id);
            state.users.data[user.type][user.id] = {...user};
            state.topUserIds.add(uid);
            state.topUserIds = new Set([...state.topUserIds]);
            json.dump(json.constKeys.topUserIds, [...state.topUserIds]);

            async function f() {
                const db = store.getters.db;
                if (!(await db.topUserIds.where("uid").equals(uid).first())) {
                    await db.topUserIds.add({
                        uid
                    })
                }
            }

            f().then(console.log("add a top user"));
        },
        unsetTop(state, user) {
            if (!user) return;
            user.isTop = false;
            let uid = state.generateUniqueId(user.type, user.id);
            state.users.data[user.type][user.id] = {...user};
            state.topUserIds.delete(uid);
            state.topUserIds = new Set([...state.topUserIds]);
            json.dump(json.constKeys.topUserIds, [...state.topUserIds]);

            async function f() {
                const db = store.getters.db;
                await db.topUserIds.where("uid").equals(uid).delete();
            }

            f().then(console.log("delete a top user"));
        },
        removeShow(state, data) {
            let unique_id = state.generateUniqueId(data.type, data.id);
            state.showUserIds.delete(unique_id);
            state.showUserIds = new Set([...state.showUserIds]);
            json.dump(json.constKeys.showUserIds, [...state.showUserIds]);

            async function f() {
                const db = store.getters.db;
                await db.showUserIds.where("uid").equals(unique_id).delete();
            }

            f().then(console.log("delete a show user"));
        },
        // eslint-disable-next-line no-unused-vars
        getInitalMsgAbout(state, data) {
            // Axios.post("/getmsgs", {
            //     id0: data.id,
            //     toType: data.type,
            // }).then(res => {
            //     res.data.forEach(v => {
            //         store.commit("addMessage", v)
            //     });
            // })
            if (data.type === '1') {
                let postData = {
                    group_id: data.id,
                };
                if (data.message_seq) postData['message_seq'] = data.message_seq;
                Axios.post("/get_group_msg_history", postData).then(
                    res => {
                        // console.log(res.data);
                        // res.data.message.forEach(v => this.$store.commit("addMessage", v));
                        res.data.data.messages.reverse().forEach((v, i) => {
                            if (!data.message_seq && i > 7) return;
                            Axios.post("/get_msg", {
                                message_id: v.message_id,
                            }).then(res1 => {
                                let data1 = res1.data.data;
                                if (data.dataEachHandler) {
                                    data.dataEachHandler(data1);
                                }
                                data1.post_type = 'message';
                                data1.user_id = data1.sender.user_id;
                                data1.isNewMsg = false;
                                state.$handleWsMsg(data1)
                            });

                        });
                        // this.$nextTick(() => this.realThemeBody.scrollTop = this.realThemeBody.scrollHeight)
                    }
                );
            } else {

            }

            async function f() {
                const db = store.getters.db;
                let records = await db.messages.where("uid").equals(store.state.generateUniqueId(data.type, data.id)).reverse().offset(data.dbOffset || 0).limit(10).toArray();
                records.reverse().forEach(d => {
                    if (data.dataEachHandlerDB) data.dataEachHandlerDB(d.data);
                    d.data.notSave = true;
                    store.commit("addMessage", d.data);
                });
            }

            f().then(console.log("get init message about user", data.id));


        },
        // eslint-disable-next-line no-unused-vars
        refreshWhenContacted(state, data) {
            // Axios.post("/getgroupbyunreadmsgs").then(res => {
            //     res.data.forEach(e => {
            //         let ownerId = e.toType === 0 ? e.fromId : e.toId;
            //         store.commit("addUnreadMsgCount", {
            //             type: e.toType,
            //             id: ownerId,
            //             count: e.count,
            //         });
            //         if (data.excludeUids && data.excludeUids.indexOf(state.generateUniqueId(e.toType, ownerId)) !== -1) {
            //             console.log("exclude uid: ", state.generateUniqueId(e.toType, ownerId));
            //             return
            //         }
            //         store.commit('getInitalMsgAbout', {
            //             type: e.toType,
            //             id: ownerId,
            //         });
            //     })
            // })
        },
        // eslint-disable-next-line no-unused-vars
        getAskList(state, only) {
            // if (only === 0) {
            //     Axios.post('/getfriendasks',).then(res => state.oriPeopleAskList = res.data);
            // } else if (only === 1) {
            //     Axios.post('/getgroupasks',).then(res => state.oriGroupAskList = res.data);
            // } else {
            //     Axios.post('/getfriendasks',).then(res => state.oriPeopleAskList = res.data);
            //     Axios.post('/getgroupasks',).then(res => state.oriGroupAskList = res.data);
            // }
        },
        downloadFile(state, {url, options}) {
            if (state.downloadList[options.fileId]) {
                return
            }

            Vue.set(state.downloadList, options.fileId, {
                isDownloading: true,
                options,
            });

            ipcRenderer.send("download-file", {
                url,
                options,
            });
            console.log("render sent download request:", options.filename);

            // Vue.set(state.downloadList, options.fileId, {
            //     isDownloading: true,
            //     options,
            // });
            // state.downloadList[options.fileId] = {
            //     isDownloading: true,
            //     options,
            // };
        },
        openDialog(state, options) {
            state.dialogOpenRecord[options.fileId] = {
                options
            };

            ipcRenderer.send("open-dialog", {
                options,
            });
            console.log("render sent open request:", options, state.dialogOpenRecord);

            // state.downloadList[options.fileId] = {
            //     isDownloading: true,
            //     options,
            // };
        },


    },
    getters: {
        totalUnreadMsgNum: state => {
            return getTotalUnreadNum(state.unreadMsgs)
        },
        totalUnhandleAskNum: (state, getters) => {
            return getters.unhandlePeopleAskNum + getters.unhandleGroupAskNum;
        },
        unhandlePeopleAskNum: state => {
            return getTotalUnhandlePeopleNum(state.oriPeopleAskList)
        },
        unhandleGroupAskNum: state => {
            return getTotalUnhandleGroupNum(state.oriGroupAskList)
        },
        currentUserUnreadMsgNum: state => (type, id) => {
            return state.unreadMsgs[state.generateUniqueId(type, id)];
        },
        showMsgs: state => {
            return getShowMsgList(state.showUserIds, state.messages, state.topUserIds);
        },
        db: state => {
            const db = new Dexie(String(state.selfUserId));
            db.version(1).stores({
                users: "&uid, type",
                showUserIds: "&uid",
                topUserIds: "&uid",
                messages: "&id ,uid, ts",
            });
            return db;
        }

    },
    actions: {}
});

ipcRenderer.on("download-start", (event, data) => {
    // console.log("start->", data.options.filename);
    let dlRecord = store.state.downloadList[data.options.fileId];
    if (dlRecord) {
        dlRecord.options.onStarted && dlRecord.options.onStarted(data);
    }
});

ipcRenderer.on("download-progress", (event, data) => {
    // console.log("progress->", data.options.filename, data.progressData.percent);
    let dlRecord = store.state.downloadList[data.options.fileId];
    if (dlRecord) {
        dlRecord.options.onProgress && dlRecord.options.onProgress(data);
        // if (data.progressData.percent === 1) {
        //     dlRecord.isDownloading = false;
        // }
    }
});

ipcRenderer.on("download-finish", (event, data) => {
    let dlRecord = store.state.downloadList[data.options.fileId];
    if (dlRecord) {
        dlRecord.options.onFinish && dlRecord.options.onFinish(data.filePath);
        dlRecord.isDownloading = false;

        // delete store.state.downloadList[data.options.fileId];
    }
});

ipcRenderer.on("download-cancel", (event, data) => {
    let dlRecord = store.state.downloadList[data.options.fileId];
    if (dlRecord) {
        dlRecord.options.onCancel && dlRecord.options.onCancel();
    }
});

ipcRenderer.on("openDialog-finish", (event, data) => {
    console.log("render open callback", data);
    let dlRecord = store.state.dialogOpenRecord[data.options.fileId];
    if (dlRecord) {
        dlRecord.options.onFinish && dlRecord.options.onFinish(data);
    }
    delete store.state.dialogOpenRecord[data.options.fileId];
});


export default store;