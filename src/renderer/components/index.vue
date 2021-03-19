<template>
    <Swiper class="swiper" :options="swiperOptionh" ref="swiper">
        <SwiperSlide>
            <sidebar-info :me="me" v-on:back="switchSwiperTo"></sidebar-info>
        </SwiperSlide>

        <SwiperSlide>
            <theme_base :kind="0">
                <div slot="h-left" v-if="me">
                    <div class="row flex-center">
                        <div @click="switchSwiperTo(0)" class="avatar child pointer"
                             :style='`background-image: url("${me.avatar}")`'></div>
                        <div class="column normal-font-color-white detail-info"
                             v-if="stt.indexPageIndex===0 && me">
                            <span v-text="me.name"></span>
                            <span class="small-font row status-bar">
                                <i class="status-icon"></i>
                                <span class="user-state" v-text="`${'手机在线' || me.stateId}>`"></span>
                            </span>
                        </div>
                    </div>
                </div>

                <div slot="h-middle">
                    <div v-if="this.stt.indexPageIndex!==0"
                         v-text="getTitle(this.stt.indexPageIndex)">
                    </div>
                </div>

                <div slot="h-right">
                    <div class="row header-icons" v-if="this.stt.indexPageIndex===0">
                        <span @click="on_logout" class="iconfont icon-xiangji"></span>
                        <span @click="on_logout" class="iconfont icon-hao"></span>
                    </div>
                    <div class="row header-icons" v-if="this.stt.indexPageIndex===1">
                        <span @click="gotoSearch" class="iconfont icon-tianjialianxiren"></span>
                    </div>
                    <div class="row header-icons" v-if="this.stt.indexPageIndex===2">
                        <span @click="on_logout" class="iconfont icon-options"></span>
                    </div>
                </div>

                <div slot="body" class="parent">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
                <div slot="footer">
                    <div class="index-footer">
                        <navbar :to_links_data="to_link_data"></navbar>
                    </div>
                </div>
            </theme_base>
        </SwiperSlide>
    </Swiper>
</template>

<script>
    import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
    // import 'swiper/swiper-bundle.css'
    import 'swiper/css/swiper.css'

    import navbar from "../views/navbar";
    import SidebarInfo from "./sidebarInfo";
    import theme_base from "./theme_base";

    import {getCookie} from "../assets/js/base";

    export default {
        name: "index",
        components: {theme_base, SidebarInfo, navbar, Swiper, SwiperSlide},
        data() {
            return {
                swiperOptionh: {
                    initialSlide: 1,
                    resistanceRatio: 0,
                    touchRatio: .5,
                    shortSwipes: false,
                    longSwipesMs: 10,
                    longSwipesRatio: .07,
                },
                to_link_data: [
                    {
                        link: 'messages',
                        name: "消息",
                        icon_class: "xiaoxi11"
                    },
                    {
                        link: 'contact/',
                        name: "联系人",
                        icon_class: "lianxiren"
                    },
                    {
                        link: 'movement',
                        name: "动态",
                        icon_class: "dongtai"
                    },
                ],
                transitionName: "slide-right",
            }
        },
        methods: {
            on_logout() {
                this.$axios.post(
                    this.$host_header + '/ajaxlogout/'
                ).catch(() => {
                });
                this.$router.push('/login/');
            },
            getTitle(pageIndex) {
                return ['联系人', '动态'][pageIndex - 1]
            },
            switchSwiperTo(i) {
                this.$refs.swiper.$swiper.slideTo(i);
            },
            gotoSearch() {
                this.$router.push('/searchpg/');
            },
        },
        mounted() {
        },
        beforeMount() {
            // this.$store.commit("updateSelfUserId", getCookie("userid"))
        },
        computed: {
            me() {
                return this.stt.users.get(this.stt.selfUserId);
            }
        },
        watch: {},
        activated() {
            // window.currentVue = this;
        }

    }
</script>

<style scoped lang="scss">
    .content {
        overflow: auto;
    }

    .status-bar {
        align-items: center;

        .status-icon {
            $height: .7rem;
            background-color: #14e879;
            height: $height;
            width: $height;
            border-radius: 50%;
            margin-right: .25rem;
        }
    }

    .avatar {
        left: 0;
        bottom: 0;
    }

    .detail-info {
        margin-left: 2.75rem;
    }

</style>

<style lang="scss">
    .theme_btn {
        color: black;
        background-color: $theme_color !important;
        border-width: 0;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        border-radius: .25rem;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;

        &:active, &:active, &:hover {
            outline: none;
            box-shadow: 0 0 0 0.2rem $theme_box_shadow_color;
        }
    }

    .theme_ipt {
        display: block;
        width: 100%;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #495057;
        background-clip: padding-box;
        border: 1px solid $theme_color;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        background-color: transparent;

        &:focus {
            box-shadow: 0 0 0 0.2rem $theme_box_shadow_color;
            outline: none;
        }

        &[readonly] {
            background-color: $theme_disable_color;
        }
    }

    .index-body-container {
        margin: .5rem 1rem 0 1rem;
        background-color: $theme_bg_deeper_light_gray;
        width: 100%;
        height: 100%;
    }

    .index-footer {
        height: $footer-height;
        display: flex;
        align-items: center;
    }

</style>