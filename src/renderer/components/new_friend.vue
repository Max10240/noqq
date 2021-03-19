<template>
    <Swipe_to_back>
        <theme_base>
            <div @click="$router.go(-1)" slot="h-left">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <div slot="h-middle">新朋友</div>
            <div slot="h-right">添加</div>
            <div slot="body">
                <better-scroll ref="betterScroll">
                    <div class="body-container theme-bg-white">
                        <div ref="openContact" class="row ask-contact flex-between">
                            <div class="column">
                                <div>开启通讯录</div>
                                <div class="tip-font-color middle-small-font">帮你快速找到通讯录上的朋友</div>
                            </div>
                            <div class="row flex-center">
                                <div class="open-contact">前往开启</div>
                                <i @click="closeOpenContact"
                                   class="small-font tip-font-color iconfont icon-chahao"></i>
                            </div>
                        </div>
                        <div class="title-bar">
                            <div class="tip-font-color middle-small-font">好友通知</div>
                        </div>

                        <div v-for="e in askList" :key="e.id">
                            <div v-if="e.user" class="row flex-between single-ask">
                                <div class="row flex-center">
                                    <div class="avatar" :style="`background-image: url('${e.user.avatar}')`"></div>
                                    <div class="column">
                                        <div v-text="e.user.name"></div>
                                        <div class="middle-small-font tip-font-color"
                                             v-text="`对方留言: ${e.text}`"></div>
                                        <div class="middle-small-font tip-font-color"
                                             v-text="`来源: ${e.from_}`"></div>
                                    </div>
                                </div>
                                <div class="agree-btn" @click="agreeMakeFriend(e.user.id, e)"
                                     v-if="e.status === 0 && e.toId === $store.state.selfUserId">同意
                                </div>
                                <div class="tip-font-color"
                                     v-if="e.status === 0 && e.userId === $store.state.selfUserId">已申请
                                </div>
                                <div class="tip-font-color" v-if="e.status === 1 || e.status === 2"
                                     v-text="e.status === 1 ? '已同意' : '已拒绝'"></div>
                            </div>
                        </div>
                    </div>
                </better-scroll>

            </div>
        </theme_base>
    </Swipe_to_back>
</template>

<script>
    import theme_base from "./theme_base";
    import betterScroll from "../views/betterScroll";
    import Swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "new_friend",
        components: {theme_base, betterScroll, Swipe_to_back},
        data() {
            return {}
        },
        computed: {
            askList() {
                return this.$store.state.oriPeopleAskList.map(e => {
                    return {
                        ...e,
                        user: this.$store.state.users.get(e.userId !== this.$store.state.selfUserId ? e.userId : e.toId),
                    }
                })
            }
        },
        mounted() {
        },
        methods: {
            closeOpenContact() {
                this.$refs.openContact.remove();
                this.$refs.betterScroll.updateSwiper()
            },
            agreeMakeFriend(toId, e) {
                this.$axios.post('/makefriend', {
                    userId: toId,
                }).then(() => this.$store.commit("getInitalMsgAbout", {
                    id: toId,
                    type: 0,
                }));
                // e.status = 1;
                let oriIndex, oriRecord;
                for (let [i, record] of this.$store.state.oriPeopleAskList.entries()) {
                    if (record.id === e.id) {
                        oriIndex = i;
                        oriRecord = record;
                        break
                    }
                }
                oriRecord.status = 1;
                this.$store.state.oriPeopleAskList.splice(oriIndex, 1, {...oriRecord});
            }
        }
    }
</script>

<style scoped lang="scss">
    .body-container {
        > * {
            padding-left: $theme-padding-l-r-width;
            padding-right: $theme-padding-l-r-width;
        }
    }

    .ask-contact {
        $p-t: .75rem;
        padding-top: $p-t;
        padding-bottom: $p-t;
    }

    .open-contact {
        $height: 2rem;
        width: 6rem;
        text-align: center;
        line-height: $height;
        background-color: $theme_deep_color;
        color: $theme-normal-font-color-white;
        height: $height;
        border-radius: $height * .5;
        margin-right: 1rem;
    }

    .title-bar {
        padding-bottom: 5px;
        height: 2rem;
        background-color: $theme_bg_deeper_light_gray !important;
        display: flex;
        align-items: flex-end;
    }

    .agree-btn {
        $height: 2rem;
        height: $height;
        text-align: center;
        line-height: $height;
        width: 4rem;
        border-radius: $height * .5;
        background-color: $font-bg-gray;
        color: black;
    }

    .single-ask {
        $p-t: 1rem;
        padding-top: $p-t;
        padding-bottom: $p-t;
    }

    .avatar {
        $height: 3rem;
        height: $height;
        width: $height;
        margin-right: .5rem;
    }

</style>