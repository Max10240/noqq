<template>
    <theme_base>
        <div @click="$router.go(-1)" slot="h-left">
            <i class="iconfont icon-fanhui"></i>
            <span>返回</span>
        </div>
        <div slot="h-middle">验证信息</div>
        <div @click="sendAsk" slot="h-right">发送</div>
        <swipe_to_back slot="body" class="fill-col">
            <better-scroll>
                <div class="theme-padding-l-r-parent cnt-container">
                    <press_shandow class="theme-bg-white middle-small-font">问题:加群干啥?</press_shandow>
                    <input autofocus type="text" class="fill-row middle-small-font" placeholder="输入答案" v-model="value">
                </div>
            </better-scroll>
        </swipe_to_back>
    </theme_base>
</template>

<script>
    import theme_base from "./theme_base";
    import betterScroll from "../views/betterScroll";
    import press_shandow from "../views/press_shandow";
    import swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "ask_group",
        components: {swipe_to_back, press_shandow, theme_base, betterScroll},
        methods: {
            sendAsk() {
                this.$axios.post('/askjoingroup', {
                    userId: this.$store.state.selfUserId,
                    groupId: this.$route.params.id,
                    text: this.value,
                }).then(() => this.$store.commit("getAskList", 1));

                this.$router.go(-1);
            }
        },
        data() {
            return {
                value: '',
            }
        }
    }
</script>

<style scoped lang="scss">
    .cnt-container {
        padding-top: 1rem;

        > div {
            padding-top: .75rem;
            padding-bottom: .75rem;
        }

        input {
            padding-top: .75rem;
            padding-bottom: .75rem;
        }
    }
</style>