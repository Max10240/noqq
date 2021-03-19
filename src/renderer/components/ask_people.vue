<template>
    <theme_base>
        <div slot="h-left" @click="$router.go(-1)">取消</div>
        <div slot="h-middle">添加好友</div>
        <div slot="h-right" @click="sendAsk">发送</div>
        <swipe_to_back slot="body" class="fill-col">
            <better-scroll>
                <div class="theme-padding-l-r-parent cnt-container">
                    <div v-if="user" class="user-info-bar row flex-ac">
                        <div class="avatar" :style="`background-image: url('${user.avatar}')`"></div>
                        <div class="column flex-jc">
                            <div v-text="user.name"></div>
                            <div class="row tip-font-color middle-small-font detail-info">
                                <span v-text="user.sex ? '女': '男'"></span>
                                <span v-text="`${user.age || 19}岁`"></span>
                                <span>阳谷县</span>
                                <span>景阳冈</span>
                            </div>
                        </div>
                    </div>
                    <div class="tip-title middle-small-font tip-font-color">填写验证信息</div>
                    <textarea rows="3" cols="1" autofocus class="fill-row ta" v-model="value"></textarea>
                    <div class="tip-title middle-small-font tip-font-color">设置备注和分组</div>
                    <div class="row flex-ac theme-bg-white add-info-row">
                        <div>备注</div>
                        <input type="text" class="flex-open-up">
                    </div>

                    <press_shandow class="row flex-ac theme-bg-white add-info-row">
                        <div>分组</div>
                        <div class="row flex-between flex-open-up">
                            <div>我的好友</div>
                            <i class="iconfont icon-dayuhao small-font tip-font-color"></i>
                        </div>
                    </press_shandow>

                    <div class="row flex-between access-movement theme-bg-white">
                        <div>不让他看我的动态</div>
                        <toggle_btn @click.native="allowAccessMovement = !allowAccessMovement"
                                    :open="!allowAccessMovement"></toggle_btn>
                    </div>
                </div>
            </better-scroll>
        </swipe_to_back>
    </theme_base>
</template>

<script>
    import theme_base from "./theme_base";
    import betterScroll from "../views/betterScroll";
    import press_shandow from "../views/press_shandow";
    import toggle_btn from "../views/toggle_btn";
    import swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "ask_people",
        components: {swipe_to_back, theme_base, betterScroll, press_shandow, toggle_btn},
        methods: {
            sendAsk() {
                this.$axios.post('/askfriend', {
                    toId: this.$route.params.id,
                    text: this.value,
                    from_: "账号查找",
                }).then(() => this.$store.commit("getAskList", 0));

                this.$router.go(-1);
            }
        },
        data() {
            return {
                value: '',
                allowAccessMovement: true,
            }
        },
        mounted() {
            let me = this.$store.state.users.get(this.$store.state.selfUserId);
            this.value = "我是" + (me ? me.name : '');
        },
        computed: {
            user() {
                return this.$store.state.users.get(this.$route.params.id)
            }
        }
    }
</script>

<style scoped lang="scss">
    .tip-title {
        margin-top: 1.25rem;
        margin-bottom: .5rem;
    }

    .ta {
        padding-top: .75rem;
        padding-bottom: .75rem;
    }

    .user-info-bar {
        margin-top: 1.75rem;
    }

    .avatar {
        $height: 3rem;
        height: $height;
        width: $height;
        margin-right: .75rem;
    }

    .detail-info {
        margin-top: .75rem;

        > span {
            margin-right: .75rem;
        }
    }

    .access-movement {
        margin-top: .25rem;
        padding-top: .75rem;
        padding-bottom: .75rem;
    }

    .add-info-row {
        padding-top: 1rem;
        padding-bottom: 1rem;

        > div:nth-child(1) {
            margin-right: 4rem;
        }
    }
</style>