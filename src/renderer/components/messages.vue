<template>
    <refresh v-on:drawOverflow="drawOverflow" v-on:drawAction="loadMore"
             v-on:hidenAfterLoaded="refreshLoadedAndHiden"
             ref="refresh">
        <div slot="upper">
            <div class="row flex-center upper">
                <div ref="upperNormalState" class="row flex-center">
                    <i ref="normalIcon" :class="`iconfont ${upperData.normal.icon.normal}`" style="font-size: 2rem"></i>
                    <div class="column flex-center">
                        <span ref="upperNormalText" class="middle-small-font"
                              v-text="upperData.normal.normal"></span>
                        <!--                        <span class="small-font" v-text="upperData.normal.tip"></span>-->
                    </div>
                </div>
                <div style="display: none" ref="upperUpdatingState" class="row flex-center">
                    <i ref="upperIsUpdating"
                       class="iconfont icon-querenyuanzhengqueduigoutijiaochenggongwancheng middle-small-font"
                       style="font-size: 1rem;display: none"></i>
                    <img ref="upperIsUpdatingGif" class="loading-gif" height="16" src="../assets/imgs/loading.gif">
                    <span class="middle-small-font" ref="upperUpdatingText" v-text="upperData.updating.updating"></span>
                </div>
            </div>
        </div>
        <div slot="content">
            <searchbar
                    :kind="(msgList[0] && stt.users.get(msgList[0].oriMsg.meta.msgOwnerId, msgList[0].oriMsg.meta.toType) && stt.users.get(msgList[0].oriMsg.meta.msgOwnerId, msgList[0].oriMsg.meta.toType).isTop) ? 0 : 1"></searchbar>
            <div class="msg-list index-body-last-child">
                <div v-for="(e) in msgList" :key="e.oriMsg.meta.id">
                    <message :msg="e"></message>
                </div>
            </div>
        </div>
    </refresh>
</template>

<script>
    import searchbar from "../views/searchbar";
    import message from "../views/message";
    import refresh from "./refresh";
    // import store from "../../store";
    import {hideThisDom, showThisDom} from "../assets/js/base";

    export default {
        name: "messages",
        components: {message, searchbar, refresh},
        mounted() {
            // let savedShowUserIds = this.$LS.load(this.$LS.constKeys.showUserIds) || [];
            // savedShowUserIds.forEach(uid => {
            //     let [type, id] = this.$store.state.splitUniqueId(uid);
            //     this.$store.commit('getInitalMsgAbout', {type, id});
            // });
            //
            // this.$axios.post("/getgroupbyunreadmsgs").then(res => {
            //     res.data.forEach(e => {
            //         let ownerId = e.toType === 0 ? e.fromId : e.toId;
            //         this.$store.commit("addUnreadMsgCount", {
            //             type: e.toType,
            //             id: ownerId,
            //             count: e.count
            //         });
            //         if (savedShowUserIds.indexOf(this.$store.state.generateUniqueId(e.toType, ownerId)) === -1) {
            //             this.$store.commit('getInitalMsgAbout', {
            //                 type: e.toType,
            //                 id: ownerId,
            //             });
            //         }
            //     })
            // })

        },
        activated() {
            this.$store.commit("gotoThisIndexPage", 0);
            window.currentVue = this;
            // this.$refs.sb.scrollTop = this.scrollTop;
        },
        beforeRouteLeave(to, from, next) {
            // this.scrollTop = this.$refs.sb.scrollTop;
            next();
        },
        methods: {
            drawOverflow(overflow) {
                this.$refs.upperNormalText.textContent = !overflow ? this.upperData.normal.normal : this.upperData.normal.overflow;
                if (!overflow) {
                    this.$refs.normalIcon.classList.remove(this.upperData.normal.icon.overflow);
                    this.$refs.normalIcon.classList.add(this.upperData.normal.icon.normal)
                } else {
                    this.$refs.normalIcon.classList.remove(this.upperData.normal.icon.normal);
                    this.$refs.normalIcon.classList.add(this.upperData.normal.icon.overflow)
                }
            },
            loadMore(end) {
                // console.log('loding more');
                hideThisDom(this.$refs.upperNormalState);
                showThisDom(this.$refs.upperUpdatingState);
                this.$refs.upperUpdatingText.textContent = this.upperData.updating.updating;
                // this.$axios.post("/getgroupbyunreadmsgs").then(res => {
                //     // console.log(res.data);
                //     res.data.forEach(e => {
                //         // this.$stt.unreadMsgs[this.$stt.generateUniqueId(e.toType, e.toType === 0 ? e.fromId : e.toId)] = e.count;
                //         this.$axios.post("/getmsgs", {
                //             id0: e.toType == 0 ? e.fromId : e.toId,
                //             toType: e.toType,
                //         }).then(res => {
                //             res.data.forEach(v => {
                //                 this.$store.commit("addMessage", v)
                //             });
                //         })
                //     });
                // }).finally(() => {
                //     this.$refs.upperUpdatingText.textContent = this.upperData.updating.uploaded;
                //     showThisDom(this.$refs.upperIsUpdating);
                //     hideThisDom(this.$refs.upperIsUpdatingGif);
                //     end();
                // })
                setTimeout(() => {
                    this.$refs.upperUpdatingText.textContent = this.upperData.updating.uploaded;
                    showThisDom(this.$refs.upperIsUpdating);
                    hideThisDom(this.$refs.upperIsUpdatingGif);
                    end();
                }, 800);


            },
            refreshLoadedAndHiden() {
                showThisDom(this.$refs.upperNormalState);
                hideThisDom(this.$refs.upperUpdatingState);
                hideThisDom(this.$refs.upperIsUpdating);
                showThisDom(this.$refs.upperIsUpdatingGif);
            },
        },
        data() {
            return {
                scrollTop: 0,
                upperData: {
                    normal: {
                        normal: "上拉刷新",
                        overflow: "释放立即刷新",
                        tip: "最近刷新: 昨天",
                        icon: {
                            normal: 'icon-refreshdown',
                            overflow: 'icon-refreshup',
                        }
                    },
                    updating: {
                        updating: "正在刷新",
                        uploaded: "刷新成功",
                        icon: {
                            updating: 'icon-loadding-rotate',
                            uploaded: 'icon-querenyuanzhengqueduigoutijiaochenggongwancheng',
                        }
                    },
                },
                // msgList: [],
            }
        },
        computed: {
            msgList() {
                // let topUsers = this.$stt.topUserIds;
                return this.$store.getters.showMsgs
            }
        },
        watch: {
            // "stt.messages": {
            //     handler() {
            //         this.msgList = msgs();
            //     },
            // }
        }
    }
</script>

<style scoped lang="scss">
    .welcome_container {
        width: 100%;
    }

    .msg-list {
    }

    .upper {
        height: 3rem;

        .iconfont {
            margin-right: 1px;
        }
    }

    .loading-gif {
        margin-right: .5rem;
    }

</style>