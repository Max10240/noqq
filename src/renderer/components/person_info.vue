<template>
    <theme_base>
        <i slot="h-left" @click="$router.go(-1)" class="iconfont icon-fanhui"></i>
        <div slot="h-middle">个人资料</div>
        <div slot="h-right">设置</div>
        <swipe_to_back slot="body" class="cnt-container column">
            <div class="flex-open-up">
                <better-scroll v-if="owner" class="theme-bg-white" :scrollbar="false">
                    <div class="theme-padding-l-r-parent content">
                        <div class="row flex-center">
                            <div class="avatar m-r" :style='`background-image: url("${owner.avatar}")`'></div>
                            <div class="column flex-jc flex-open-up">
                                <div class="row flex-between user-name-row">
                                    <div class="column">
                                        <div class="bigger-font" v-text="owner.name"></div>
                                        <div class="user-nickname" v-text="`昵称: 憨批昵称`"></div>
                                    </div>
                                    <div class="column flex-center">
                                        <i class="iconfont icon-dianzan tip-font-color bigger-font"></i>
                                        <div class="tip-font-color small-font" v-text="owner.likeNum || 20749"></div>
                                    </div>
                                </div>
                                <div class="middle-small-font user-account-row" v-text="`QQ: ${owner.id}`"></div>
                                <div class="row flex-between">
                                    <div class="row flex-center vip-and-level-row">
                                        <i class="iconfont icon-icons_VIP"></i>
                                        <div class="row flex-center">
                                            <i class="iconfont icon-yueliang" v-for="(e,i) in Array(3)" :key="i"></i>
                                        </div>
                                    </div>
                                    <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                                </div>
                            </div>
                        </div>
                        <press_shandow class="row flex-center user-signature">
                            <i class="iconfont icon-gexingqianmingbianji"></i>
                            <div class="flex-open-up middle-small-font" v-text="owner.signature"></div>
                            <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                        </press_shandow>

                        <press_shandow class="row flex-center user-signature">
                            <i class="iconfont icon-huiyuan"></i>
                            <div class="flex-open-up middle-small-font">TA还未开通任何特权服务</div>
                            <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                        </press_shandow>

                        <press_shandow class="row user-signature">
                            <i class="iconfont icon-QQkongjian"></i>
                            <div class="column flex-open-up">
                                <div class="row flex-between">
                                    <div class="flex-open-up middle-small-font">他的QQ空间</div>
                                    <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                                </div>
                                <div class="row">
                                    <div class="movement-sub middle-small-font"
                                         v-for="(e,i) in (owner.movementSubs || ['今天心情好\(^o^)/~', '今天心情不好╮(╯﹏╰)╭'])"
                                         v-text="e" :key="i"></div>
                                </div>
                            </div>
                        </press_shandow>
                        <press_shandow class="row flex-between post-header">
                            <div class="middle-bigger-font">匿问我答</div>
                            <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                        </press_shandow>

                        <div>
                            <div class="row flex-jc post-show q-a">
                                <div class="column flex-center">
                                    <div>可向好友匿名提问</div>
                                    <div class="post-btn">匿名提问</div>
                                </div>
                            </div>
                        </div>

                        <press_shandow class="row flex-between post-header">
                            <div class="middle-bigger-font">随心贴</div>
                            <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                        </press_shandow>

                        <div class="row flex-center post-show heart-post">
                            <div class="column flex-center">
                                <div>写一张随心贴</div>
                                <div>留下我想对他说的话</div>
                                <div class="post-btn">贴一个</div>
                            </div>
                        </div>
                    </div>


                </better-scroll>
            </div>


            <div class="row flex-between action-btns theme-padding-l-r">
                <press_shandow :bg-color="'lightgray'" class="action-btn">音视频通话</press_shandow>
                <press_shandow :bg-color="'lightgray'" class="action-btn">送礼物</press_shandow>
                <press_shandow :bg-color="'rgb(0, 175, 254)'" class="action-btn" @click.native="$router.push(`/chatroom/${$route.params.type}/${$route.params.id}`).catch()">发消息</press_shandow>
            </div>

        </swipe_to_back>

    </theme_base>
</template>

<script>
    import theme_base from "./theme_base";
    import betterScroll from "../views/betterScroll";
    import press_shandow from "../views/press_shandow";
    import swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "person_info",
        components: {press_shandow, theme_base, betterScroll, swipe_to_back},
        props: {},
        computed: {
            owner() {
                return this.$store.state.users.get(this.$route.params.id, this.$route.params.type);
            }
        },
        mounted() {
            // window.currentVue = this;
        },
    }
</script>

<style scoped lang="scss">
    .icon-yueliang {
        color: #ffd121;
    }

    .avatar {
        $height: 5rem;
        height: $height;
        width: $height;
    }

    .flex-open-up {
        overflow-y: hidden;
    }

    .action-btns {
        $p-height: 4rem;
        border-top: lightgray 1px solid;
        height: $p-height;
        background-color: $theme-bg_deeper_light_gray;

        .action-btn {
            $height: 3rem;
            width: 30vw;
            line-height: $height;
            text-align: center;
            border-radius: $height * .1;

            &:nth-child(1) {
                background-color: rgba(211, 211, 211, 0.4);
            }

            &:nth-child(2) {
                background-color: rgba(211, 211, 211, 0.4);
            }

            &:nth-child(3) {
                background-color: $theme_bg_color;
                color: $theme-normal-font-color-white;
            }
        }
    }

    .post-header {
        padding-top: .5rem;
        padding-bottom: .5rem;
    }

    .post-show {
        height: 90vw;

        .column {
            padding-top: 33vw;
        }

        .post-btn {
            $height: 2rem;
            margin-top: 1rem;
            color: $theme-normal-font-color-white;
            background-color: $theme-bg-color;
            line-height: $height;
            padding: 0 1rem;
            border-radius: $height * .5;
        }
    }

    .user-signature {
        padding-top: .5rem;
        padding-bottom: .5rem;
        margin: .5rem 0;

        > i {
            &:nth-child(1) {
                margin-right: .75rem;
            }
        }
    }

    .m-r {
        margin-right: 1rem;
    }

    .m-r-middle {
        margin-right: .5rem;
    }

    .content {
        padding-top: 1.5rem;
    }

    .user-name-row {
        margin-bottom: .5rem;
    }

    .user-account-row {
        margin-bottom: .25rem;
    }

    .movement-sub {
        width: 5rem;
        background-color: rgb(253, 253, 243);
        padding: 1rem .5rem 1rem .25rem;
    }

    .q-a {
        background-image: url('../assets/imgs/q_a.png');
        background-size: 100% auto;
        background-position: center;
        background-repeat: no-repeat;
    }

    .heart-post {
        background-image: url('../assets/imgs/heart_post.png');
        background-size: 100% auto;
        background-position: center;
        background-repeat: no-repeat;
    }

    .vip-and-level-row {
        > i {
            color: gray;

            > div > i {
                color: #ffd121;
            }
        }
    }
</style>