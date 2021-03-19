<template>
    <base_layout class="theme-container parent">
        <div class="theme-header parent" slot="header">
            <swipe_to_back>
                <div class="row_content" :style="`display:block;margin-bottom: ${['.75rem', '.25rem'][kind]};`">
                    <div class="drag-box">
                        <div class="drag"></div>
                    </div>
                    <div class="row parent flex-ac header">
                        <div style="z-index: 1;">
                            <slot name="h-left"></slot>
                        </div>
                        <div class="child row flex-center">
                            <slot name="h-middle"></slot>
                        </div>
                        <div style="z-index: 1">
                            <slot name="h-right"></slot>
                        </div>
                    </div>
                </div>
            </swipe_to_back>
        </div>
        <div class="theme-body" slot="body">
            <slot name="body"></slot>
        </div>
        <div class="theme-footer" slot="footer">
            <slot name="footer"></slot>
        </div>
    </base_layout>
</template>

<script>
    import base_layout from "./base";
    import swipe_to_back from "../views/swipe_to_back";
    export default {
        name: "theme_base",
        components: {base_layout, swipe_to_back},
        props: {
            kind: {
                type: Number,
                default: 0,
            }
        }
    }
</script>

<style lang="scss">
    body {
        margin: 0;
        display: flex;
        flex-direction: column;
        height: 100vh;
        min-height: 100vh;
        max-height: 100vh;
    }

    .theme-container {
        display: flex;
        flex-direction: column;
    }

    .theme-header {
        background: linear-gradient(to bottom right, $theme_color, $theme_deep_color);
        display: flex;
        border-bottom: $theme_border_color solid .5px;
        height: 5.5rem;
        font-size: 1rem;
        padding: 0 1rem;
        color: white;

        > div {
            width: 100%;
        }

        > .row_content {
            align-items: flex-end;
            /*margin-bottom: .25rem;*/
            /*margin-bottom: .75rem;*/

            > .row {
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
        }

        .header-icons {
            * {
                font-size: 1.3rem;
                margin: 0 .5rem;
            }
        }

        .avatar {
            width: 2rem;
            height: 2rem;
            background-size: 100%;
            border-radius: 50%;
            /*margin-right: .7rem;*/
        }

        .user-state {
        }
    }

    .row_content {
        display: flex;
        flex: 1;
        max-width: 100%;

        &.container-body {
            position: relative;

            > div {
                width: 100%;
            }
        }
    }

    .theme-body {
        display: flex;
        flex: 1;
        overflow-y: auto;
        background-color: $theme_bg_deeper_light_gray;

        > div {
            width: 100%;
        }
    }

    .theme-footer {
        background: $theme_bg_deep_light_gray;
        display: flex;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 1;
        width: 100%;

        > div {
            width: 100%;
        }

        .row_content {
            justify-content: space-around;
        }
    }

    .parent {
        > .child {
            width: 100%;
        }
    }

    .header {
        min-height: 2rem;
        justify-content: space-between;
    }

    .drag-box {
        text-align: center;

        > div {
            display: inline-block;
            height: 2rem;
            width: 50vw;
        }
    }
</style>