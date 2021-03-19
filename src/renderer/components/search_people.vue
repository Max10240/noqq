<template>
    <swipe_to_back class="fill-col" target="/index/contact/">
        <better-scroll>
            <div class="content-container theme-padding-l-r-parent">
                <div class="row search-bar" @click="$router.push('/dosearchpeople')">
                    <i class="iconfont icon-sousuo"></i>
                    <span>QQ号/手机号/群</span>
                </div>

                <div class="single-content-row" v-for="(e, i) in linkList" :key="i">
                    <div class="row flex-between single-content-row-cnt">
                        <div class="row flex-center content">
                            <i :class="`iconfont ${e.iconClass}`"></i>
                            <span v-text="e.name"></span>
                        </div>
                        <i class="iconfont icon-dayuhao small-font tip-font-color"></i>
                    </div>
                </div>
            </div>
        </better-scroll>
    </swipe_to_back>
</template>

<script>
    import betterScroll from "../views/betterScroll";
    import swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "search_people",
        components: {betterScroll, swipe_to_back},
        data() {
            return {
                linkList: [
                    {name: "添加手机联系人", iconClass: "icon-lianxiren1"},
                    {name: "扫一扫添加好友", iconClass: "icon-saoma"},
                    {name: "面对面添加好友", iconClass: "icon-_hotpoint"},
                    {name: "按条件查找陌生人", iconClass: "icon-sousuo"},
                    {name: "扩列匹配", iconClass: "icon-faxian-kuolie"},
                    {name: "面对面发起群聊", iconClass: "icon-weibiaoti-1_fuzhi"},
                    {name: "查看附近的人", iconClass: "icon-tubiaolianxi-"},
                ]
            }
        }
    }
</script>

<style scoped lang="scss">
    .content-container {
        > * {
            background-color: $theme-background_color;
        }
    }

    .search-bar {
        $height: 3.5rem;
        color: $theme-tip-font-color;
        line-height: $height;
        margin: .75rem 0;

        > i {
            margin-right: .75rem;
        }
    }

    .single-content-row {
        $height: 3rem;
        line-height: $height;

        .content {
            > i {
                color: $icon-color;
                font-size: 1.5rem;
                margin-right: 1.25rem;
            }
        }

    }


</style>