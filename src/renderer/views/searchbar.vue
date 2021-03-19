<template>
    <div class="container row theme-padding-l-r" :kind="kind || 0">
        <div class="content">
            <i class="iconfont icon-sousuo"></i>
            <span v-text="text"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "searchbar",
        props: {
            kind: [Number, String],
            text:{
                type: String,
                default: "搜索",
            }
        },
    }
</script>

<style scoped lang="scss">
    .container {
        $height: 2rem;
        height: $height;
        padding-top: .5rem;
        padding-bottom: .5rem;
        background-color: $theme_bg_deeper_light_gray;
        color: $theme-tip-font-color;

        &[kind="1"] {
            background-color: white;
            margin-top: 0;

            > .content {
                background-color: $theme_bg_deeper_light_gray;
            }
        }

        > .content {
            width: 100%;
            line-height: $height;
            text-align: center;
            border-radius: $height*.5;
            background-color: white;
        }
    }

    .row {
        justify-content: center;
        align-items: center;
    }
</style>