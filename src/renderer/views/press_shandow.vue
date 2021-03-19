<template>
    <div class="" :style="this.showShadow ? `background-color: ${this.bgColor} !important;`: ''"
         @touchstart="handleTouchDown"
         @touchmove="handleMove"
         @touchend="handleUp"

         @mousedown="handleTouchDown($event)"
         @mousemove="handleMove"
         @mouseup="handleUp"
    >
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "press_shandow",
        props: {
            bgColor: {
                type: String,
                default: 'rgb(242, 242, 242)',
            }
        },
        methods: {
            handleTouchDown(event) {
                // if (event){
                //     event.stopPropagation()
                // }
                // console.log("funck mousedown down");
                this.preShowShadow = new Date().getTime();
                setTimeout(() => {
                    if (this.preShowShadow) this.showShadow = true;
                }, 0);
            },
            handleMove() {
                this.showShadow = false;
            },
            handleUp() {
                let currentTime = this.preShowShadow;
                setTimeout(() => {
                    if (this.preShowShadow === currentTime) this.showShadow = false;
                }, Math.max(0, 200 - (new Date().getTime() - this.preShowShadow)));
            }
        },
        data() {
            return {
                showShadow: false,
                preShowShadow: 0,
            }
        }
    }
</script>

<style scoped lang="scss">
</style>