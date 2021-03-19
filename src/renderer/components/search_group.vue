<template>
    <swipe_to_back class="fill-col" target="/index/contact/">
        <refresh v-on:drawOverflow="drawOverflow" v-on:drawAction="loadMore"
                 v-on:hidenAfterLoaded="refreshLoadedAndHiden"
                 ref="topRefresh">
            <div slot="upper">
                <div class="row flex-center upper">
                    <div ref="upperNormalState" class="row flex-center">
                        <i ref="normalIcon" :class="`iconfont ${upperData.normal.icon.normal}`"
                           style="font-size: 2rem"></i>
                        <div class="column flex-center">
                        <span ref="upperNormalText" class="middle-small-font"
                              v-text="upperData.normal.normal"></span>
                            <!--                        <span class="small-font" v-text="upperData.normal.tip"></span>-->
                        </div>
                    </div>
                    <div style="display: none" ref="upperUpdatingState" class="row flex-center">
                        <i ref="upperIsUpdating"
                           class="iconfont icon-querenyuanzhengqueduigoutijiaochenggongwancheng middle-small-font"
                           style="font-size: 1rem;display: none"></i>
                        <img ref="upperIsUpdatingGif" class="loading-gif" height="16" src="../assets/imgs/loading.gif">
                        <span class="middle-small-font" ref="upperUpdatingText"
                              v-text="upperData.updating.updating"></span>
                    </div>
                </div>
            </div>
            <div slot="content" class="cnt-container">
                <searchbar kind="1" text="搜索群号或群名称"></searchbar>
                <div class="theme-padding-l-r-parent">
                    <swiper class="fit-width-swiper" ref="titleSwiper" :options="swiperOption">
                        <swiper-slide v-for="(e, i) in titleList" :key="i">
                            <div class="single-title">
                                <div @click="titleSlideTo(i)" class="column flex-center t-cnt"
                                     :style="`${i === titleIndex ? `color: white;background-color: ${e.iconColor}`: ''}`">
                                    <i :style="`${i !== titleIndex ? `color: ${e.iconColor}`: ''}`"
                                       :class="`iconfont ${e.iconClass}`"></i>
                                    <span class="small-font" v-text="e.name"></span>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                    <swiper class="fit-width-swiper st-swiper" ref="secondTitleSwiper" :options="swiperOption">
                        <swiper-slide v-for="(e, i) in secondTitleList[titleIndex]" :key="i">
                            <div @click="secondTitleSelect(i)"
                                 :class="`st-name ${secondTitleFilterCondition === i ? 'selected-second-title': ''}`"
                                 v-text="e.name">
                            </div>
                        </swiper-slide>
                    </swiper>
                    <swiper class="content-swiper" ref="contentSwiper" :options="contentSwiperOption">
                        <swiper-slide v-for="(e,i) in (titleList || [])" :key="i">
                            <div class="theme-padding-l-r" v-for="id in (groupByGroupIds[i] || [])" :key="id">
                                <div class="row flex-center single-group" v-if="$store.state.users.get(id, 1)">
                                    <div class="avatar"
                                         :style="`background-image: url('${$store.state.users.get(id, 1).avatar}')`"></div>
                                    <div class="column right-bar">
                                        <div class="row flex-between">
                                            <div v-text="$store.state.users.get(id, 1).name"></div>
                                            <!--                                            <router-link tag="div" :to="`/askgroup/${id}`" class="join-btn">加入</router-link>-->
                                        </div>
                                        <div class="row heat">
                                            <i class="iconfont icon-redu small-font"
                                               v-for="(e,i) in Array($store.state.users.get(id, 1).heat || 4)"
                                               :key="i"></i>
                                        </div>
                                        <div class="tip-font-color middle-small-font"
                                             v-text="$store.state.users.get(id, 1).introduction || '没有介绍噢...'"></div>
                                    </div>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>

            </div>
        </refresh>
    </swipe_to_back>
</template>

<script>
    import refresh from "./refresh";
    import {hideThisDom, showThisDom} from "../assets/js/base";
    import searchbar from "../views/searchbar";
    import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
    import 'swiper/css/swiper.css'
    import swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "search_group",
        components: {swipe_to_back, refresh, searchbar, Swiper, SwiperSlide},
        methods: {
            drawOverflow(overflow) {
                this.$refs.upperNormalText.textContent = !overflow ? this.upperData.normal.normal : this.upperData.normal.overflow;
                if (!overflow) {
                    this.$refs.normalIcon.classList.remove(this.upperData.normal.icon.overflow);
                    this.$refs.normalIcon.classList.add(this.upperData.normal.icon.normal)
                } else {
                    this.$refs.normalIcon.classList.remove(this.upperData.normal.icon.normal);
                    this.$refs.normalIcon.classList.add(this.upperData.normal.icon.overflow)
                }
            },
            loadMore(end) {
                // console.log('loding more');
                hideThisDom(this.$refs.upperNormalState);
                showThisDom(this.$refs.upperUpdatingState);
                this.$refs.upperUpdatingText.textContent = this.upperData.updating.updating;
                this.$axios.post("/getgroupbyunreadmsgs").then(() => {

                }).finally(() => {
                    this.$refs.upperUpdatingText.textContent = this.upperData.updating.uploaded;
                    showThisDom(this.$refs.upperIsUpdating);
                    hideThisDom(this.$refs.upperIsUpdatingGif);
                    end();
                })


            },
            refreshLoadedAndHiden() {
                showThisDom(this.$refs.upperNormalState);
                hideThisDom(this.$refs.upperUpdatingState);
                hideThisDom(this.$refs.upperIsUpdating);
                showThisDom(this.$refs.upperIsUpdatingGif);
            },
            titleSlideTo(i) {
                this.titleIndex = i;
                this.$refs.titleSwiper.$swiper.slideTo(i - 1);
                this.$refs.contentSwiper.$swiper.slideTo(i);
            },
            secondTitleSelect(i) {
                this.secondTitleFilterCondition = this.secondTitleFilterCondition === i ? null : i;
            },
            updateHeight() {
                this.$refs.contentSwiper.$swiper.update();
                this.$refs.topRefresh.updateSwiper();
            },
        },
        data() {
            let that = this;
            return {
                scrollTop: 0,
                upperData: {
                    normal: {
                        normal: "上拉刷新",
                        overflow: "释放立即刷新",
                        tip: "最近刷新: 昨天",
                        icon: {
                            normal: 'icon-refreshdown',
                            overflow: 'icon-refreshup',
                        }
                    },
                    updating: {
                        updating: "正在刷新",
                        uploaded: "刷新成功",
                        icon: {
                            updating: 'icon-loadding-rotate',
                            uploaded: 'icon-querenyuanzhengqueduigoutijiaochenggongwancheng',
                        }
                    },
                },
                // msgList: [],
                swiperOption: {
                    slidesPerView: "auto",
                    freeMode: true,
                    resistanceRatio: 0,
                    touchMoveStopPropagation: true,
                    freeModeMomentumBounce: false,

                },
                contentSwiperOption: {
                    resistanceRatio: 0,
                    freeModeMomentumBounce: false,
                    touchMoveStopPropagation: true,
                    autoHeight: true,
                    on: {
                        slideChangeTransitionStart() {
                            that.titleIndex = this.activeIndex;
                        },
                        slideChangeTransitionEnd() {
                            that.updateHeight();
                        },
                    }
                },
                secondTitleFilterCondition: null,
                titleIndex: 0,
                titleList: [
                    {name: "学习", iconClass: "icon-xuexi", iconColor: "rgb(0, 217, 110)"},
                    {name: "公益", iconClass: "icon-gongyiguanli", iconColor: "rgb(255, 89, 106)"},
                    {name: "运动", iconClass: "icon-yundong", iconColor: "rgb(255, 159, 64)"},
                    {name: "粉丝", iconClass: "icon-fensi", iconColor: "rgb(254, 115, 198)"},
                    {name: "兴趣", iconClass: "icon-xingquaihao", iconColor: "rgb(255, 204, 0)"},
                    {name: "游戏", iconClass: "icon-svgmoban14", iconColor: "rgb(199, 115, 255)"},
                    {name: "交友", iconClass: "icon-jiaoyou", iconColor: "rgb(254, 115, 198)"},
                ],
                secondTitleList: {
                    0: [{name: "CET-4"}, {name: "CET-6"}, {name: "考研"}, {name: "托福"}, {name: "雅思"}, {name: "职业认证"}],
                    1: [{name: "托福"}, {name: "雅思"}, {name: "职业认证"}],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: [],
                },
                secondTitleFilterList: [],
                groupByGroupIds: {
                    0: [1],
                    1: [1],
                },
            }
        },
        watch: {
            titleIndex() {
                this.secondTitleFilterCondition = null;
            }
        }
    }
</script>

<style scoped lang="scss">
    .right-bar {
        flex: 1;
    }

    .single-title {
        $height: 4.5rem;
        width: $height;
        height: $height;
        background-color: $theme-background_color;
        margin: .25rem;
        display: inline-block;

        .t-cnt {
            height: 100%;
            border-radius: 10%;

            &.selected-title {
                span {
                    color: $theme-normal-font-color-white;
                }
            }

            i {
                font-size: 2rem;
                margin-bottom: .25rem;
            }
        }
    }

    .st-swiper {
        margin: 1rem 0;

        .st-name {
            $height: 1.8rem;
            height: $height;
            line-height: $height;
            padding: 0 1.75rem;
            border-radius: $height *.5;

            &.selected-second-title {
                color: $theme-normal-font-color;
                background-color: $theme_bg_deeper_light_gray;
            }
        }
    }

    .cnt-container {
        background-color: $theme-background_color;
    }

    .content-swiper {
        padding: 0 !important;
    }

    .avatar {
        $height: 3rem;
        height: $height;
        width: $height;
        margin: 1.5rem 1rem 1.5rem 0;
    }

    .join-btn {
        $height: 2rem;
        background-color: $font-bg-gray;
        line-height: $height;
        width: 4rem;
        text-align: center;
        border-radius: $height * .5;
    }

    .heat {
        i {
            color: orange;
        }
    }

</style>