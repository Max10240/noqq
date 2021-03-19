<template>
<!--    <swipe_to_back>-->
        <theme_base>
            <div slot="h-left">
                <div @click="goBack()" class="pointer">
                    <i class="iconfont icon-fanhui"></i>
                    <span class="unreadNum middle-small-font" v-if="totalUnreadMsgNum"
                          v-text="totalUnreadMsgNum < 100 ? totalUnreadMsgNum : '99+'"></span>
                </div>
            </div>
            <div slot="h-middle">
                <div class="column flex-center" v-if="currentUser">
                    <div @click="goBack()" v-text="currentUser.name"></div>
                    <div class="small-font" v-if="Number($route.params.type) === 0"
                         v-text="'手机在线 - WiFi' || currentUser.stateId"></div>
                </div>
            </div>

            <div slot="h-right">
                <div class="row header-icons">
                    <span class="iconfont icon-dianhua"></span>
                    <span class="iconfont icon-sandaogang"/>
                </div>
            </div>
            <div ref="themeBody" slot="body">
                <div style="min-height: 100%;height:100%;">
                    <refresh v-on:drawAction="loadMore" ref="refresh">
                        <div slot="upper">
                            <div>
                                <div class="row flex-center">
                                    <img class="loading-gif" height="16" src="../assets/imgs/loading.gif">
                                </div>
                            </div>
                        </div>
                        <div class="msg-list column" ref="body" slot="content">
                            <msg-box v-on:imgLoaded="imgLoaded" v-for="e in msgList" :data="e"
                                     :key="e.meta.id"></msg-box>
                        </div>
                    </refresh>
                </div>
            </div>
            <div slot="footer" ref="footer">
                <div class="row footer-above-line">
                    <textarea @keydown.ctrl.enter="sendMsg" contenteditable="true" ref="ta" v-model="text"
                              rows="1" cols="1" class="ta"
                              type="text">
                    </textarea>
                    <div ref="sendBtn" @click="sendMsg" :class="`middle-small-font ${text?'enable':'disable'}`">发送</div>
                </div>
                <div class="footer-below-line row_content">
                    <i :class="`iconfont icon-${e.iconClass} ${e.pointer ? 'pointer' : ''}`"
                       v-for="(e,i) in footerBLIcons" :key="i"
                       @click="e.func(i)"></i>
                </div>
            </div>
        </theme_base>
    <!--    </swipe_to_back>-->
</template>

<script>
    import theme_base from "./theme_base";
    import MsgBox from "../views/msgBox";
    // import updraw from "../views/updraw";
    import refresh from "./refresh";
    // import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
    // import 'swiper/swiper-bundle.css'
    // import 'swiper/css/swiper.css'
    import {mapGetters} from 'vuex';
    import swipe_to_back from "../views/swipe_to_back";

    // const {dialog} = require('electron').remote;
    const fs = require('fs');
    const { shell } = require('electron');
    // import {hideThisDom, showThisDom} from "../assets/js/base";

    export default {
        name: "chatroom",
        components: {swipe_to_back, refresh, MsgBox, theme_base},
        data() {
            return {
                swiperOption: {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    slidesOffsetBefore: -100,

                    scrollbar: {
                        el: '.swiper-scrollbar',
                        hide: true,
                    },
                },
                currentUserId: null,
                footerBLIcons: [
                    {iconClass: "yuyin", func: this.logThis,},
                    {iconClass: "xiangce", func: this.sendImg, pointer: true},
                    {iconClass: "xiangji", func: this.logThis,},
                    {iconClass: "hongbao", func: this.logThis,},
                    {iconClass: "youxi", func: this.logThis,},
                    {iconClass: "shape", func: this.logThis,},
                    {iconClass: "jia", func: this.logThis,},
                ],
                type: null,
                text: "",
                taHeight: null,
                backCd: false,
                realThemeBody: null,
                upperData: {
                    normal: {
                        normal: "上拉刷新",
                        overflow: "释放立即刷新",
                        tip: "最近刷新: 昨天",
                    },
                    updating: {
                        updating: "正在刷新",
                        uploaded: "刷新成功",
                    },
                },
                moreMsgLoaded: false,
                loadingMoreMsgRecord: new Set(),
                keyboardRise: false,

            }
        },
        methods: {
            getText(d0) {
                return d0 + " <- return";
            },
            logThis(e) {
                // console.log(e);
            },
            handleMsgReply(res, id) {
                let oriId = id, nowId = res.data.data.message_id;
                let pos = this.$store.state.sendMsgs[oriId];
                let aboutMsgs = this.$store.state.messages[pos];
                for (let i = aboutMsgs.length - 1; i >= 0; i--) {
                    let msg = aboutMsgs[i];
                    if (msg.meta.id === oriId) {
                        msg.meta.id = nowId;
                        this.$stt.saveMsgToDB(msg);
                    }
                }
                // console.log("msg reply data", res.data);
                delete this.$store.state.sendMsgs[oriId];
            },
            sendMsg() {
                function escape(text) {
                    // return text;
                    return text.replace(/\[/g, '&#91;')
                }

                let that = this;
                if (!this.text) return;
                let currentMsgList = this.$stt.messages[this.uid];
                let currentMsgListLength = currentMsgList ? currentMsgList.length : 0;
                let id = `${this.currentUserId}-${currentMsgListLength}-${this.$getTimestamp()}`;
                let sendData = {
                    "meta": {
                        "id": id,
                        "fromId": this.stt.selfUserId,
                        "toId": this.currentUserId,
                        "ts": this.$getTimestamp(),
                        "msgType": 0,
                        // "msgId": 90,
                        "toType": this.type,
                    },
                    "body": {"text": escape(this.text)}
                };


                // this.$stt.msgWs.websocket.send(JSON.stringify(sendData));
                // function handleMsgReply(res, id) {
                //     let oriId = id, nowId = res.data.data.message_id;
                //     let pos = that.$store.state.sendMsgs[oriId];
                //     let aboutMsgs = that.$store.state.messages[pos];
                //     for (let i = aboutMsgs.length - 1; i >= 0; i--) {
                //         let msg = aboutMsgs[i];
                //         if (msg.meta.id === oriId) msg.meta.id = nowId;
                //     }
                //     // console.log("msg reply data", res.data);
                //     delete that.$store.state.sendMsgs[oriId];
                // }

                if (this.type === '0') {
                    this.$axios.get('/send_private_msg', {
                        params: {
                            user_id: this.currentUserId,
                            message: (this.text),
                            auto_escape: true,
                        }
                    }).then(res => {
                        this.handleMsgReply(res, id)
                    }).finally(() => {
                        this.$store.state.selfSendMsgLock[this.currentUserId] -= 1;
                    })
                } else if (this.type === '1') {
                    this.$axios.get('/send_group_msg', {
                        params: {
                            group_id: this.currentUserId,
                            message: (this.text),
                            auto_escape: true,
                        }
                    }).then(res => {
                        this.handleMsgReply(res, id)
                    }).finally(() => {
                        this.$store.state.selfSendMsgLock[this.currentUserId] -= 1;
                    })
                }
                sendData.meta.localId = id;
                this.$store.commit("addMessage", sendData);
                this.$stt.sendMsgs[id] = this.uid;
                this.$store.state.selfSendMsgLock[this.currentUserId] = (this.$store.state.selfSendMsgLock[this.currentUserId] || 0) + 1;
                this.text = "";
                // setTimeout(() => {
                //     // this.$refs.refresh.updateSwiper();
                //     // this.scrollEnd(300);
                // }, 0);
                // this.$nextTick(() => {
                //     this.$nextTick(() => {
                //         this.$refs.refresh.updateSwiper();
                //         this.scrollEnd(300);
                //     });
                // });
                // setTimeout(() => this.$refs.ta.click(), 1000);
            },
            goBack() {
                // console.log("Go back");
                this.$router.push('/index/messages').catch();
            },
            scrollEnd(speed = 0) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs.refresh.scrollEnd(speed);
                    }, 0);

                })
            },
            updateTextareaHeight() {
                this.$nextTick(() => {
                    this.$refs.ta.style.height = "auto";
                    this.taHeight = Math.min(this.$refs.ta.scrollHeight - 8, 128);
                    this.taHeight = Math.max(24, this.taHeight);
                    this.$refs.ta.style.height = this.taHeight + "px";
                    this.$refs.body.style.paddingBottom = this.$refs.footer.clientHeight + "px";
                })
            },
            loadMore(end) {
                // console.log('loding more');
                // this.$axios.post("/getmsgs", {
                //     "id0": this.currentUserId,
                //     toType: this.type,
                //     offset: this.msgList ? this.msgList.length : 0,
                // }).then(
                //     res => {
                //         this.moreMsgLoaded = true;
                //         console.log("msg btn: ", res.data);
                //         res.data.forEach(v => this.$store.commit("addMessage", v));
                //     }
                // ).finally(() => {
                //     // this.$refs.upperUpdatingText.textContent = this.upperData.updating.uploaded;
                //     end();
                // });
                // if (this.type === '1') {
                //     // console.log(this.msgList[0]);
                //     this.$store.commit("getInitalMsgAbout", {
                //         message_seq: (this.msgList && this.msgList.length) ? this.msgList[0].meta.message_seq : false,
                //         type: '1',
                //         id: this.currentUserId,
                //         dataEachHandler: (data) => {
                //             data.notSave = true;
                //             this.moreMsgLoaded = true;
                //             this.loadingMoreMsgRecord.add(data.message_id);
                //         },
                //     });
                // } else {
                //
                // }

                this.$store.commit("getInitalMsgAbout", {
                    message_seq: (this.type === '1' && this.msgList && this.msgList.length) ? this.msgList[0].meta.message_seq : false,
                    type: this.type,
                    id: this.currentUserId,
                    dbOffset: this.msgList ? this.msgList.length : 0,
                    dataEachHandler: (data) => {
                        data.notSave = true;
                        this.moreMsgLoaded = true;
                        this.loadingMoreMsgRecord.add(data.message_id);
                    },
                    dataEachHandlerDB: (data) => {
                        this.moreMsgLoaded = true;
                        this.loadingMoreMsgRecord.add(data.meta.id);
                    },
                });

                end();
                this.loadingMore = false;

                // let f = async () => {
                //     const db = this.$store.getters.db;
                //     let records = await db.messages.where("uid").equals(this.$store.state.generateUniqueId(this.type, this.currentUserId)).reverse().offset(this.msgList ? this.msgList.length : 0).limit(10).toArray();
                //     // console.log("from", this.msgList ? this.msgList.length : 0);
                //     // console.log("get", records);
                //     records.reverse().forEach(d => {
                //         d.data.notSave = true;
                //         this.moreMsgLoaded = true;
                //         this.loadingMoreMsgRecord.add(d.data.meta.id);
                //         this.$store.commit("addMessage", d.data);
                //     });
                //
                //
                // };
                //
                // f().finally(() => {
                //     end();
                //     this.loadingMore = false;
                // });
            },
            imgLoaded(msgId) {
                // console.log("loaded msg Id", msgId);
                this.$refs.refresh.updateSwiper();
                // console.log("this.loadingMore", this.loadingMore);
                if (this.loadingMoreMsgRecord.has(msgId)) {
                    // console.log("don't scrollend");
                    // this.loadingMoreMsgRecord.delete(msgId)
                }else {
                    // console.log("scrollend...");
                    this.scrollEnd(300);
                }
                // this.scrollEnd(300);
            },
            sendImg() {
                let relativePath = `${new Date().getTime()}_${this.$store.state.getUniqueDownloadId()}`;
                this.$store.commit("openDialog", {
                    filters: [
                        {name: "图片", extensions: ['jpg', 'jpeg', 'png', 'gif']},
                    ],
                    fileId: relativePath,
                    onFinish: d => {
                        if (d.filePaths) {
                            d.filePaths.forEach(p => {
                                let to = path.join(this.$getBotServerDataPath('image'), relativePath);
                                let uploadCallback = () => {
                                    // console.log("fuck to", to);
                                    let that = this;
                                    let id = `${this.currentUserId}-${this.$store.state.getUniqueDownloadId()}-${this.$getTimestamp()}`;
                                    let sendData = {
                                        "meta": {
                                            "id": id,
                                            "fromId": this.stt.selfUserId,
                                            "toId": this.currentUserId,
                                            "ts": this.$getTimestamp(),
                                            "msgType": 1,
                                            // "msgId": 90,
                                            "toType": this.type,
                                        },
                                        "body": {url: `file:///${to}`},
                                    };

                                    // this.$stt.msgWs.websocket.send(JSON.stringify(sendData));
                                    // function handleMsgReply(res) {
                                    //     let oriId = id, nowId = res.data.data.message_id;
                                    //     let pos = that.$store.state.sendMsgs[oriId];
                                    //     let aboutMsgs = that.$store.state.messages[pos];
                                    //     for (let i = aboutMsgs.length - 1; i >= 0; i--) {
                                    //         let msg = aboutMsgs[i];
                                    //         if (msg.meta.id === oriId) msg.meta.id = nowId;
                                    //     }
                                    //     // console.log("msg reply data", res.data);
                                    //     delete that.$store.state.sendMsgs[oriId];
                                    // }

                                    if (this.type === '0') {
                                        this.$axios.get('/send_private_msg', {
                                            params: {
                                                user_id: this.currentUserId,
                                                message: `[CQ:image,file=${relativePath}]`,
                                                // message: `[CQ:image,file=///${p}]`,
                                            }
                                        }).then(res => {
                                            this.handleMsgReply(res, id)
                                        }).finally(() => {
                                            this.$store.state.selfSendMsgLock[this.currentUserId] -= 1;
                                        })
                                    } else if (this.type === '1') {
                                        this.$axios.get('/send_group_msg', {
                                            params: {
                                                group_id: this.currentUserId,
                                                message: `[CQ:image,file=${relativePath}]`,
                                                // message: `[CQ:image,file=///${p}]`,
                                            }
                                        }).then(res => {
                                            this.handleMsgReply(res, id)
                                        }).finally(() => {
                                            this.$store.state.selfSendMsgLock[this.currentUserId] -= 1;
                                        })
                                    }
                                    sendData.meta.localId = id;
                                    this.$store.commit("addMessage", sendData);
                                    this.$stt.sendMsgs[id] = this.uid;
                                    this.$store.state.selfSendMsgLock[this.currentUserId] = (this.$store.state.selfSendMsgLock[this.currentUserId] || 0) + 1;
                                    this.text = "";
                                };
                                try {
                                    fs.linkSync(p, to);
                                    uploadCallback();
                                } catch (e) {
                                    console.log("can't make link", e.message);
                                    fs.copyFile(p, to, uploadCallback);
                                }


                            });

                        }
                    },
                });
                // dialog.showOpenDialog({
                //     filters: [
                //         {name: "图片", extensions: ['jpg', 'jpeg', 'png', 'gif']},
                //     ]
                // }).then();
            }
            // refreshLoadedAndHiden() {
            //     console.log("hide callback");
            //     showThisDom(this.$refs.upperNormalState);
            //     hideThisDom(this.$refs.upperUpdatingState);
            // }
        },
        mounted() {
            this.$refs.sendBtn.addEventListener("mousedown", event => event.preventDefault());
            // this.cntSwiper = this.$refs.cntSwiper.$swiper;
            this.$refs.body.style.paddingBottom = this.$refs.footer.clientHeight + "px";
            // console.log('msgList length: ', this.msgList.length);
            if (this.type === '1') {

            }

            this.originalHeight = document.body.clientHeight;
            // this.$refs.body.style.minHeight = (this.$refs.totalBody.clientHeight - this.$refs.footer.clientHeight) + "px";
        },
        activated() {
            // alert('active chatroom');
            // console.log("chatroom get params:", this.$route.params);
            // window.currentVue = this;
            window.shell = shell;
            // window.chatroomDialog = dialog;
            this.realThemeBody = this.$refs.themeBody.parentElement;
            // this.$nextTick(() => this.realThemeBody.scrollTop = this.realThemeBody.scrollHeight);
            this.scrollEnd();
            // window.currentVue = this;
            this.keyboardRise = false;
            window.onresize = () => {
                document.activeElement.scrollIntoViewIfNeeded(true);
                this.keyboardRise = !this.keyboardRise;
                setTimeout(() => this.$refs.refresh.scrollEnd(), 0);
                // this.$refs.refresh.restorePos();
                // this.$nextTick();
                // if (this.keyboardRise) {
                //     alert('rise');
                // } else {
                //     alert('down');
                // }
            };
            this.$store.commit("readMsgAbout", {
                fromId: this.currentUserId,
                toType: this.type
            });
            // this.$refs.refresh.unfreeze();
        },
        beforeMount() {
            this.type = this.$route.params.type;
            this.currentUserId = this.$route.params.id;
        },
        computed: {
            ...mapGetters([
                'totalUnreadMsgNum'
            ]),
            currentUser() {
                if (this.type === null || this.currentUserId === null) return;
                return this.stt.users.get(this.currentUserId, Number(this.type));
            },
            msgList() {
                if (this.type === null) return [];
                // console.log(this.stt.messages[this.type][this.currentUserId]);
                return this.stt.messages[this.uid]
            },
            uid() {
                return this.$store.state.generateUniqueId(this.type, this.currentUserId)
            }

        },
        watch: {
            text() {
                this.updateTextareaHeight();
            },
            msgList() {
                // if (!this.currentUserId || !this.msgList || this.msgList.slice(-1)[0].meta.fromId == this.$stt.selfUserId) return;
                if (!this._inactive) {
                    this.$store.commit("readMsgAbout", {
                        fromId: this.currentUserId,
                        toType: this.type
                    });

                }

                if (!this.moreMsgLoaded) {
                    this.$nextTick(() => {
                        this.scrollEnd(300);
                    });
                } else {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.moreMsgLoaded = false;
                }
            }
        },
        // beforeRouteLeave(to, from, next) {
        //     this.$refs.refresh.freeze();
        //     next();
        // },
    }
</script>

<style scoped lang="scss">
    .footer-above-line {
        align-items: flex-end;
        padding: .5rem;

        $padding-top-height: 4px;

        > *:nth-child(1) {
            flex: 1;
        }

        > *:nth-child(2) {
            $height: 32px + $padding-top-height;
            height: $height;
            line-height: $height;
            padding: 0 1rem;
            background-color: $theme-light-color;
            border-radius: $height*.5;
            color: white;
            font-size: 1rem;
            opacity: .4;

            &.enable {
                opacity: 1;
            }
        }

        .ta {
            height: 16px + $padding-top-height*2;
            font-size: 16px;
            padding: $padding-top-height*2 1rem $padding-top-height 1rem;
            margin-right: 5px;
            border-radius: $padding-top-height+ 16px;
        }

    }

    .footer-below-line {
        margin-bottom: .5rem;

        > i {
            font-size: 1.5rem;
            color: $icon-color;
        }
    }

    .msg-list {
        height: fit-content;
        padding: .5rem;

        > div {
            margin-top: 1rem;
        }
    }

    .loading-gif {
        margin-top: .5rem;
    }

    .unreadNum {
        $height: 1.5rem;
        height: $height;
        line-height: $height;
        border-radius: $height * .5;
        padding: 0 .5rem;
        text-align: center;
        background-color: rgba(255, 255, 255, .3);
    }

</style>

<style lang="scss">
    .swiper-scrollbar {
        background-color: rgba(0, 0, 0, 0) !important;

        .swiper-scrollbar-drag {
            background-color: rgba(0, 0, 0, .3) !important;
        }
    }
</style>