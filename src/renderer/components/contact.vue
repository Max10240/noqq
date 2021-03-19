<template>
    <refresh v-on:drawOverflow="drawOverflow" v-on:drawAction="loadMore"
             v-on:hidenAfterLoaded="refreshLoadedAndHiden"
             ref="refresh">
        <div slot="upper">
            <div class="row flex-center upper">
                <div ref="upperNormalState" class="row flex-center">
                    <i ref="normalIcon" :class="`iconfont ${upperData.normal.icon.normal}`" style="font-size: 2rem"></i>
                    <div class="column flex-center">
                        <span ref="upperNormalText" class="middle-small-font"
                              v-text="upperData.normal.normal"></span>
                        <span class="small-font" v-text="upperData.normal.tip"></span>
                    </div>
                </div>
                <div style="display: none" ref="upperUpdatingState" class="row flex-center">
                    <i ref="upperIsUpdating"
                       class="iconfont icon-querenyuanzhengqueduigoutijiaochenggongwancheng middle-small-font"
                       style="font-size: 1rem;display: none"></i>
                    <img ref="upperIsUpdatingGif" class="loading-gif" height="16" src="../assets/imgs/loading.gif">
                    <span class="middle-small-font" ref="upperUpdatingText" v-text="upperData.updating.updating"></span>
                </div>
            </div>
        </div>
        <div ref="sb" class="contact-container" slot="content">
            <div ref="cttHeader" class="ctt-header">
                <searchbar kind="1"></searchbar>
                <press_shandow class="p-l-r">
                    <router-link tag="div" to="/newfriend" class="row-btw new-friend">
                        <span>新朋友</span>
                        <div class="row flex-ac">
                        <span class="unread ask-num" v-if="$store.getters.unhandlePeopleAskNum"
                              v-text="$store.getters.unhandlePeopleAskNum"></span>
                            <i class="iconfont icon-dayuhao small-font tip-font-color"></i>
                        </div>
                    </router-link>
                </press_shandow>
                <press_shandow class="p-l-r">
                    <router-link tag="div" to="/newgroup" class="row-btw new-friend">
                        <span>群通知</span>
                        <div class="row flex-ac">
                        <span class="unread ask-num" v-if="$store.getters.unhandleGroupAskNum"
                              v-text="$store.getters.unhandleGroupAskNum"></span>
                            <i class="iconfont icon-dayuhao small-font tip-font-color"></i>
                        </div>
                    </router-link>
                </press_shandow>
            </div>
            <div :class="'ctt-body '+(fixed?'fixed':'')">
                <div ref="linksParent" class="theme-padding-l-r">
                    <div ref="links" :class="`links-parent ${(fixed?'fixed-links-parent':'')}`">
                        <swiper class="contact-links fit-width-swiper" :options="swiperOption">
                            <swiper-slide class="pointer" v-for="(e,i) in to_links_data" :key="e.link">
                                <span :class="`link  ${i===routerViewIndex?'selected':''}`"
                                      @click="slideTo(i)">
                                    <span v-text="e.name"></span>
                                </span>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>

                <div class="below-links">
                    <swiper ref="sp" class="swiper" :options="swiperOption1">
                        <swiper-slide v-for="(e,i) in routerViewList" :key="e">
                            <router-view v-if="activedPages.indexOf(i) !== -1" :name="e"></router-view>
                            <div v-if="activedPages.indexOf(i) === -1"></div>
                        </swiper-slide>
                    </swiper>

                </div>
            </div>
        </div>
    </refresh>
</template>

<script>
    import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
    import refresh from "./refresh";
    import 'swiper/css/swiper.css'
    import Searchbar from "../views/searchbar";
    import {hideThisDom, showThisDom} from "../assets/js/base";
    import press_shandow from "../views/press_shandow";

    export default {
        name: "contact",
        components: {Searchbar, Swiper, SwiperSlide, refresh, press_shandow},
        data() {
            let that = this;
            return {
                swiperOption: {
                    slidesPerView: "auto",
                    freeMode: true,
                    resistanceRatio: 0,
                    touchMoveStopPropagation: false,
                    freeModeMomentumBounce: false,
                    on:{
                        touchStart(e){
                            console.log('start');
                            e.stopPropagation();
                        }
                    }
                },
                swiperOption1: {
                    autoHeight: true,
                    resistanceRatio: 0,
                    touchMoveStopPropagation: false,
                    // observer: true,
                    on: {
                        slideChangeTransitionStart() {
                            that.routerViewIndex = this.activeIndex;
                            if (that.activedPages.indexOf(this.activeIndex) === -1) that.activedPages.push(this.activeIndex);
                        },
                        slideChangeTransitionEnd() {
                            // console.log('swiper index change');
                            that.updateHeight();
                        },
                        touchStart(e){
                            // console.log("touch start");
                            // that.$refs.refresh.$refs.swiper.$swiper.allowTouchMove = false;
                            e.stopPropagation();
                        },
                        // touchMove(e) {
                        //     // e.stopPropagation();
                        //     // e.stopImmediatePropagation();
                        // },
                        // touchEnd(){
                        //     // console.log("touch end");
                        //     // that.$refs.refresh.$refs.swiper.$swiper.allowTouchMove = true;
                        // }
                        // sliderMove: this.handleSBScroll,
                        // init() {
                        //     this.emit('slideChangeTransitionStart');
                        // },

                    },
                },
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
                to_links_data: [
                    {link: "persons", name: "好友"},
                    {link: "groups", name: "分组"},
                    {link: "groupchats", name: "群聊"},
                    {link: "equipments", name: "设备"},
                    {link: "addressbooks", name: "通讯录"},
                    {link: "subscriptionnumbers", name: "订阅号"},
                ],
                routerViewList: ["persons", "groups", "groupchats"],
                fixed: false,
                routerViewIndex: 0,
                isFixed: false,
                paddingHeight: 0,
                activedPages: [],
            }
        },
        methods: {
            handleSBScroll() {
                let sbTop = this.$refs.sb.getBoundingClientRect().top;
                let cttHeaderBottom = this.$refs.cttHeader.getBoundingClientRect().bottom;
                console.log(-1 * sbTop, cttHeaderBottom);
                let fixed = -1 * sbTop - cttHeaderBottom > 0;
                this.fixed = fixed;
                if (fixed && !this.isFixed) {
                    const links = this.$refs.links;
                    links.remove();
                    links.style.top = this.paddingHeight + 'px';
                    document.body.appendChild(links);
                    this.isFixed = true;
                } else if (!fixed && this.isFixed) {
                    const links = this.$refs.links;
                    links.remove();
                    this.$refs.linksParent.appendChild(links);
                    this.isFixed = false;
                }
            },
            slideTo(index) {
                this.$refs.sp.$swiper.slideTo(index);
            },
            updateHeight() {
                this.$refs.sp.$swiper.update();
                this.$refs.refresh.updateSwiper();
            },
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
                console.log('loding more');
                hideThisDom(this.$refs.upperNormalState);
                showThisDom(this.$refs.upperUpdatingState);
                this.$refs.upperUpdatingText.textContent = this.upperData.updating.updating;

                // this.$axios.post("/getfriends").then(res => {
                //     res.data.forEach(e => this.$stt.users.get(e, 0));
                //     this.$stt.friendIds = res.data;
                // }).finally(() => {
                //     this.$refs.upperUpdatingText.textContent = this.upperData.updating.uploaded;
                //     showThisDom(this.$refs.upperIsUpdating);
                //     hideThisDom(this.$refs.upperIsUpdatingGif);
                //     end();
                // });

                setTimeout(() => {
                    this.$refs.upperUpdatingText.textContent = this.upperData.updating.uploaded;
                    showThisDom(this.$refs.upperIsUpdating);
                    hideThisDom(this.$refs.upperIsUpdatingGif);
                    end();
                }, 800);

            },
            refreshLoadedAndHiden() {
                showThisDom(this.$refs.upperNormalState);
                hideThisDom(this.$refs.upperUpdatingState);
                hideThisDom(this.$refs.upperIsUpdating);
                showThisDom(this.$refs.upperIsUpdatingGif);
            },
            logThis(e){
                console.log(e)
            }
        },
        mounted() {
            // this.$refs.sb.addEventListener("scroll", this.handleSBScroll);
            // let wp = this.$refs.sp.$wrapperEl[0];
            // wp.style.height = wp.children[this.activeIndex].offsetHeight + "px";
            // this.$refs.refresh.$refs.swiper.$swiper.on('progress', this.handleSBScroll);
            this.paddingHeight = this.$refs.cttHeader.getBoundingClientRect().top;
            this.$stt.updateContactHeight = this.updateHeight;
            this.activedPages.push(this.$refs.sp.$swiper.activeIndex);
        },
        activated() {
            this.$store.commit("gotoThisIndexPage", 1);
            // this.$nextTick();
            // window.currentVue = this;
            // this.$refs.sb.scrollTop = this.scrollTop;
        },
        beforeRouteLeave(to, from, next) {
            // this.scrollTop = this.$refs.sb.scrollTop;
            next();
        },
    }
</script>

<style scoped lang="scss">
    .contact-container {
        > .ctt-header {
            background-color: white;

            .new-friend {
                height: 3rem;
            }
        }

        > .ctt-body {
            margin-top: .5rem;
            padding-top: .5rem;
            background-color: white;
        }
    }

    .p-l-r {
        padding: .5rem 1rem;
    }

    .row-btw {
        display: flex;
        justify-content: space-between;
        align-items: center;

        > div:nth-child(2) {
            color: $theme-tip-font-color;
            font-size: $middle-small-font-size;
        }
    }

    .fixed {
        .below-links {
            margin-top: 2.5rem;
        }
    }

    .fixed-links-parent {
        background-color: white;
        position: absolute;
        top: 60px;
        z-index: 10;
    }

    .contact-links {
        color: $theme-tip-font-color;
        padding: .5rem 0;
        $link-height: 2rem;

        .link {
            display: inline-block;
            height: $link-height;
            line-height: $link-height;
            padding: 0 1.5rem;
            border-radius: $link-height*.5;
        }
    }

    .selected {
        color: $theme_deep_color;
        background-color: rgba(102, 218, 255, 0.31);
    }

    .upper {
        height: 3rem;
    }

    .loading-gif {
        margin-right: .5rem;
    }

    .ask-num {
        margin-right: .5rem;
    }

</style>

<style lang="scss">
    .ctt-body {
        > div:last-child {
            padding-bottom: $footer-height;
        }
    }

    .swiper-slide {
        height: fit-content;
    }

    .theme-body {
        position: relative;
    }
</style>