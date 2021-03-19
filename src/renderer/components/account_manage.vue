<template>
    <theme_base class="account-manage">
        <div @click="$router.go(-1)" slot="h-left">
            <i class="iconfont icon-fanhui"></i>
        </div>
        <div slot="h-middle">账号管理</div>
        <div slot="h-right">编辑</div>
        <better-scroll :scrollbar="false" class="cnt-bs" slot="body">
            <swipe_to_back>
                <div class="theme-padding-l-r-parent">
                    <press_shandow class="theme-bg-white" v-for="(e,i) in users" :key="i">
                        <div v-if="e" class="row flex-between single-option">
                            <div class="row flex-center">
                                <div class="avatar"
                                     :style="`background-image: url('${e.avatar}')`"></div>
                                <div class="column">
                                    <div v-text="e.name"></div>
                                    <div v-text="e.account" class="tip-font-color small-font"></div>
                                </div>
                            </div>
                            <i v-if="e.id == $store.state.selfUserId"
                               class="current-user-check iconfont icon-correct-1-mini"></i>
                        </div>
                    </press_shandow>
                    <press_shandow class="row add-account single-option end theme-bg-white">
                        <div class="avatar add-account-cnt row flex-center">
                            <i class="iconfont icon-hao tip-font-color"></i>
                        </div>
                        <div class="text">添加或注册账号</div>
                    </press_shandow>

                    <press_shandow class="row flex-between single-option theme-bg-white">
                        <div>关联QQ号</div>
                        <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                    </press_shandow>

                    <div class="link-account-tip tip-font-color middle-small-font">关联QQ号后，即可代收改号的好友消息。</div>

                    <press_shandow class="row flex-between single-option theme-bg-white end">
                        <div>QID</div>
                        <div class="row flex-center">
                            <div class="tip-font-color middle-small-font m-r">未开启</div>
                            <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                        </div>
                    </press_shandow>

                    <press_shandow class="row flex-between single-option theme-bg-white end">
                        <div>在线状态</div>
                        <div class="row flex-center">
                            <i class="status-icon"></i>
                            <div class="tip-font-color middle-small-font m-r">在线</div>
                            <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                        </div>
                    </press_shandow>

                    <press_shandow class="row flex-between single-option theme-bg-white end">
                        <div>退出</div>
                    </press_shandow>

                </div>
            </swipe_to_back>
        </better-scroll>
    </theme_base>
</template>

<script>
    import theme_base from "./theme_base";
    import betterScroll from "../views/betterScroll";
    import swipe_to_back from "../views/swipe_to_back";
    import press_shandow from "../views/press_shandow";

    export default {
        name: "account_manage",
        components: {press_shandow, theme_base, betterScroll, swipe_to_back},
        data() {
            return {
                accountList: [this.$stt.selfUserId],
            }
        },
        computed: {
            users() {
                return this.accountList.map(id => this.$store.state.users.get(id))
            }
        },
    }
</script>

<style scoped lang="scss">
    .cnt-bs {
        padding-top: .75rem;
        flex: 1;
    }

    .avatar {
        $height: 2rem;
        height: $height;
        width: $height;
        margin-right: .75rem;
    }

    .single-option {
        height: 3.5rem;
        border-bottom: 1px $theme-bg_deeper_light_gray solid;
    }

    .end {
        margin-bottom: .75rem;
    }

    .m-r {
        margin-right: .75rem;
    }

    .status-icon {
        $height: .7rem;
        background-color: #14e879;
        height: $height;
        width: $height;
        border-radius: 50%;
        margin-right: .25rem;
    }

    .link-account-tip {
        margin: .25rem 0 .75rem 0;
    }

    .add-account {
        align-items: center;

        .add-account-cnt {
            background-color: $theme-bg_deeper_light_gray;
        }

        .text {
            color: $theme-deep_color;
        }
    }

    .current-user-check {
        color: $theme-deep_color;
        font-size: 1.5rem;
    }

</style>

<style lang="scss">
    .account-manage {
        .theme-body {
            flex-direction: column;
        }
    }
</style>