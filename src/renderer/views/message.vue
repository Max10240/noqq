<template>
    <Swiper class="swiper" :options="swiperOptionh" ref="swp">
        <SwiperSlide>
            <div @click.right="handleRightClick()" v-if="owner" :class="owner.isTop?'':'normal-msg'">
                <press_shandow>
                    <router-link tag="div" :to="`/chatroom/${msg.oriMsg.meta.toType}/${msg.fromId}`"
                                 :class="`row theme-padding-l-r container`" v-if="owner">

                        <div class="avatar" :style='`background-image: url("${owner.avatar}")`'></div>
                        <div class="column msgContent">
                            <div class="row">
                                <span v-text="owner.name"></span>
                                <span v-text="$formatTime(msg.time)" class="small-font"></span>
                            </div>
                            <div class="row">
                                <span v-html="content" class="middle-small-font tip-font-color subContent"></span>
                                <span class="unread" v-text="num < 100 ? num : '99+'" v-if="num"></span>
                            </div>
                        </div>
                    </router-link>
                </press_shandow>
            </div>


        </SwiperSlide>
        <SwiperSlide ref="msgOptions" class="msg-options">
            <div class="row">
                <div class="msg-gray" @click="toggleTop" v-text="(owner&&owner.isTop)? '取消置顶':'置顶'"></div>
                <div class="msg-orange" @click="toggleRead" v-text="num?'标记已读':'标记未读'"></div>
                <div class="msg-red" @click="removeShow">删除</div>
            </div>
        </SwiperSlide>
    </Swiper>

</template>

<script>
    import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
    // import 'swiper/swiper-bundle.css'
    import 'swiper/css/swiper.css'
    import {clickHereOnly} from "../assets/js/base";
    import press_shandow from "./press_shandow";

    export default {
        name: "message",
        components: {press_shandow, Swiper, SwiperSlide},
        props: [
            "msg",
        ],
        computed: {
            owner() {
                return this.stt.users.get(this.msg.oriMsg.meta.msgOwnerId, this.msg.oriMsg.meta.toType);
            },
            num() {
                return this.$store.getters.currentUserUnreadMsgNum(this.msg.oriMsg.meta.toType, this.msg.oriMsg.meta.msgOwnerId)
            },
            content() {
                return this.msg.content
                    .replace(/\[CQ:image,.+?\]/g, ' [图片] ')
                    .replace(/\[CQ:face,.+?\]/g, ' [表情] ')
                    .replace(/\[CQ:file,.+?\]/g, ' [文件] ')
                    .replace(/\[CQ:at,.+?\]/g, (ctt) => {
                        let qq_id = ctt.match(/qq=(.+)\]/)[1];
                        if (qq_id === 'all') {
                            return '@全体成员 ';
                        }
                        return `@${this.$store.state.users.get(qq_id) ? this.$store.state.users.get(qq_id).name : qq_id} `;
                    })
                .replace(/\[CQ:reply,.+?\]/g, ' [回复]:')
                .replace(/\[CQ:xml,.+/g, function (ctt) {
                    let title = ctt.match(/<title>(.+?)<\/title>/)[1];
                    return title;
                })
                .replace(/\[CQ:json,.+?\]/g, '[json] ')
            }
        },
        data() {
            let that = this;
            return {
                swiperOptionh: {
                    resistanceRatio: 0,
                    // touchMoveStopPropagation: false,
                    slidesPerView: 'auto',
                    normalizeSlideIndex: false,
                    longSwipesRatio: .01,
                    on: {
                        slideChangeTransitionStart() {
                            this.params.touchMoveStopPropagation = this.activeIndex === 1;
                            if (this.activeIndex === 1) {
                                clickHereOnly(that.$refs.msgOptions.$el, null, () => {
                                    if (this.params) this.slideTo(0, that.hideSildeSpeed === null ? undefined : that.hideSildeSpeed);
                                    that.hideSildeSpeed = null;
                                });
                            }
                        },
                        // init() {
                        //     this.emit('slideChangeTransitionStart');
                        // },
                    },
                },
                hideSildeSpeed: null,
            }

        },
        activated() {
            // this.$refs.swp.$swiper.slidePrev();
        },
        methods: {
            toggleTop() {
                this.hideSildeSpeed = 0;
                this.$store.commit(this.owner.isTop ? "unsetTop" : "setTop", this.owner);
                console.log("toggleTop");
            },
            toggleRead() {
                if (this.num) {
                    this.$store.commit("readMsgAbout", {
                        toType: this.owner.type,
                        fromId: this.owner.id,
                    })
                } else {
                    this.$store.commit("addUnreadMsgCount", {
                        type: this.owner.type,
                        id: this.owner.id,
                        count: 1,
                    })
                }
            },
            removeShow() {
                this.$store.commit("readMsgAbout", {
                    toType: this.owner.type,
                    fromId: this.owner.id,
                });
                this.$store.commit("removeShow", {
                    type: this.owner.type,
                    id: this.owner.id,
                })
            },
            handleRightClick() {
                console.log("right click");
                const swiper = this.$refs.swp.$swiper;
                swiper.slideTo(swiper.activeIndex === 0 ? 1 : 0);
            }
        }
    }
</script>

<style scoped lang="scss">
    $avatar-height: 3rem;
    $container-padding: 1rem;
    .avatar {
        background-size: 100%;
        border-radius: 50%;
        height: $avatar-height;
        width: $avatar-height;
        margin-right: .5rem;
    }

    .column {
        flex: 1;

        > .row {
            justify-content: space-between;
            align-items: flex-end;
        }
    }

    .container {
        align-items: center;
        padding-top: $container-padding;
        padding-bottom: $container-padding;
    }

    .normal-msg {
        background-color: white;
    }

    .msgContent {
        overflow: hidden;

        .subContent {
            flex: 1;
            margin-right: 1rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }

    .swiper-slide:nth-child(2) {
        /*width: 20%;*/
    }

    .msg-options {
        width: 16rem;
        $height: 5rem;
        height: $height;

        .row {
            height: 100%;

            > div {
                line-height: $height;
                text-align: center;
                color: $theme-normal-font-color-white;
            }
        }

        .msg-gray {
            flex: 1;
            background-color: lightgray;
        }

        .msg-orange {
            background-color: orange;
            width: 6rem;
        }

        .msg-red {
            flex: 1;
            background-color: red;
        }
    }
</style>