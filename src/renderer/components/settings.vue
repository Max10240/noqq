<template>
    <theme_base class="settings">
        <div @click="$router.go(-1)" slot="h-left">
            <i class="iconfont icon-fanhui"></i>
        </div>
        <div slot="h-middle">设置</div>
        <better-scroll :scrollbar="false" class="cnt-bs" slot="body">
            <swipe_to_back>
                <div class="theme-padding-l-r-parent">
                    <press_shandow @click.native="$router.push('/accountmanage')" class="row flex-between single-option theme-bg-white">
                        <div>账号管理</div>
                        <div class="avatar"
                             :style="`background-image: url('${me.avatar}')`"></div>
                    </press_shandow>

                    <press_shandow class="row flex-between single-option theme-bg-white">
                        <div>手机号码</div>
                        <div class="row flex-center">
                            <div class="phone tip-font-color middle-small-font"
                                 v-text="me.phone? me.phone.slice(0, 3) + Array(6).fill('*').join('') + me.phone.slice(9): ''"></div>
                            <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                        </div>
                    </press_shandow>

                    <press_shandow v-for="(e,i) in options" :key="i"
                         :class="`row flex-between single-option theme-bg-white ${e.end ? 'end' : ''}`">
                        <div v-text="e.name"></div>
                        <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
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
        name: "settings",
        components: {press_shandow, theme_base, betterScroll, swipe_to_back},
        data() {
            return {
                options: [
                    {name: "账号安全", end: true},
                    {name: "消息通知",},
                    {name: "隐私",},
                    {name: "通用",},
                    {name: "辅助功能", end: true},
                    {name: "免流量特权", end: true},
                    {name: "关于QQ与帮助", end: true},
                ]
            }
        },
        computed: {
            me() {
                return this.$store.state.users.get(this.$store.state.selfUserId)
            }
        }
    }
</script>

<style scoped lang="scss">
    .cnt-bs {
        margin-top: .75rem;
    }

    .avatar {
        $height: 2rem;
        height: $height;
        width: $height;
    }

    .single-option {
        height: 3.5rem;
        border-bottom: 1px $theme-bg_deeper_light_gray solid;
    }

    .phone {
        margin-right: .5rem;
    }

    .end {
        margin-bottom: .75rem;
    }
</style>

<style lang="scss">
    .settings {
        .theme-body {
            flex-direction: column;
        }
    }
</style>