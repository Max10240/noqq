<template>
    <div :status="open - 0" class="row flex-ac container">
        <div class="circle theme-bg-white"></div>
    </div>
</template>

<script>
    export default {
        name: "toggle_btn",
        props: {
            open: {
                type: Boolean,
                default: false,
            }
        },

    }
</script>

<style scoped lang="scss">
    .container {
        $height: 32px;
        height: $height;
        width: $height * 1.8;
        padding: 1px;
        border-radius: $height * .5;

        &[status="0"] {
            background-color: $theme-bg_deeper_light_gray;
            justify-content: flex-start;
        }

        &[status="1"] {
            background-color: $theme_deep_color;
            justify-content: flex-end;
        }

        .circle {
            height: $height - 1;
            width: $height - 1;
            border-radius: 50%;
        }
    }
</style>