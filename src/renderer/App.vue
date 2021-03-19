<template>
    <div id="app">
        <transition :name="$stt.transitionName">
            <keep-alive :exclude="['login', 'register', 'do_search_people',]">
                <router-view :key="!$route.fullPath.startsWith('/index')?$route.fullPath:$options.name"></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
    import {getSearch} from './assets/js/base'
    export default {
        name: 'my-project',
        components: {},
        data() {
            return {
                // transitionName: null,
            }
        },
        watch: {
            '$route'(to, from) {
                console.log("path", to.fullPath);
                if (this.$stt.isGoingBack) {
                    this.$stt.transitionName = 'slide-right';
                } else {
                    const transtion = getSearch('transition', to.fullPath);
                    console.log("transtion", transtion);
                    if (transtion === 'right') {
                        this.$stt.transitionName = 'slide-right';
                    } else if (transtion === 'left') {
                        this.$stt.transitionName = 'slide-left';
                    } else if (to.meta.index === from.meta.index) {
                        this.$stt.transitionName = null;
                    } else if (to.meta.index > from.meta.index) {
                        this.$stt.transitionName = 'slide-left';
                    } else {
                        this.$stt.transitionName = 'slide-right';
                    }
                }

                this.$stt.isGoingBack = false;

            }
        },
    }
</script>

<style>
    @import url('https://at.alicdn.com/t/font_2174780_7crhllz3eqy.css');
    @import "assets/css/icon_font.css";
</style>
