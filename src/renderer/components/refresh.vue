<template>
    <!-- 通过ref可以获取到dom对象 -->
    <swiper class="swiper" :options="swiperOption" ref="swiper">
        <div class="mine-scroll-pull-down" ref="upper">
            <div class="upper-content">
                <slot name="upper"></slot>
            </div>
            <!--            <div id="pdt" ref="pullDownLoading">-->
            <!--            </div>-->
            <!--            <div v-show="updateCd" style="height: 50px;background-color: black" ref="testBB"></div>-->
        </div>
        <swiper-slide>
            <slot name="content"></slot>
        </swiper-slide>
        <div class="mine-scroll-pull-up" ref="bottom">
            <!--            <div v-text="pullUpText" inline ref="pullUpLoading"/>-->
            <slot name="bottom"></slot>
        </div>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
</template>

<script>
    import {Swiper, SwiperSlide} from 'vue-awesome-swiper';
    import 'swiper/css/swiper.css';

    export default {
        name: 'Scrollbar',
        title: 'Scrollbar',
        components: {
            Swiper,
            SwiperSlide,
        },
        data() {
            return {
                pulling: false,
                swiperOption: {
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        hide: true
                    },
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    mousewheel: true,
                    // nested: true,
                    touchMoveStopPropagation: false,
                    //
                    resistanceRatio: .8,
                    freeModeMomentumBounceRatio: .5,
                    // simulateTouch: false,
                    // freeModeMomentumRatio: .7,
                    // freeModeMomentumVelocityRatio: 2,

                    // autoHeight: true,
                    // observer: true,
                    // observeParents: true,
                    // observeSlideChildren: true,
                    // virtualTranslate: true,
                    on: {
                        sliderMove: () => {
                            this.sliderMove();
                        },
                        touchEnd: this.touchEnd,
                        init: function () {
                            this.translateToBak = this.translateTo;
                            this.setTranslateBak = this.setTranslate;
                        },
                        touchStart: function () {
                            this.setTranslate(this.getTranslate());
                            this.allowTouchMove = true;
                            this.translateTo = () => {
                            };
                            this.setTranslate = () => {
                            };
                        },
                        touchMove: function (e) {
                            // e.stopPropagation();
                            // e.stopImmediatePropagation();
                            this.translateTo = this.translateToBak;
                            this.setTranslate = this.setTranslateBak;
                        },
                        // touchEnd: function () {
                        //     console.log("refresh end")
                        // }
                        // progress: function (swiper, process) {
                        //     console.log('progress', swiper, process);
                        // }
                    }
                },
                upperHeight: 0,
                moreThan: 0,
                currentPos: null,
            }
        },
        props: {
            recommends: {
                type: [Array, Object],
                default() {
                    return [];
                }
            },
            scrollbar: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },
        watch: {
            // recommends() {
            //     this.$refs.swiper && this.$refs.swiper.$swiper.update();//更新滚动条长度
            // }
        },
        methods: {
            sliderMove() {
                if (this.pulling) return;//正在下拉中，则不重复下拉
                const swiper = this.$refs.swiper.$swiper;
                if (swiper.translate > 0) {//向下拉
                    this.$emit('drawOverflow', swiper.translate > this.upperHeight + this.moreThan);
                }
            },
            touchEnd() {
                if (this.pulling) return;//正在下拉中，则不重复下拉
                const swiper = this.$refs.swiper.$swiper;

                if (swiper.translate > this.upperHeight + this.moreThan) {
                    this.pulling = true;//正在下拉中
                    // swiper.allowTouchMove = false;//禁止触摸
                    swiper.setTransition(swiper.params.speed);//设置初始速度
                    swiper.setTranslate(this.upperHeight);//移动到设定的位置（拖动过度时回到设置的位置）
                    swiper.params.virtualTranslate = true;//定住不给回弹
                    // this.$refs.pullDownLoading.textContent = "正在下拉中...";
                    this.$emit("drawAction", this.pullDownEnd);//触发消息，传递结束下拉的函数
                    // setTimeout(() => this.pullDownEnd(), 2000);
                }
                // else if (swiper.isEnd) {//上拉
                //     //是否达到上拉的触发条件
                //     const isPullUp = Math.abs(swiper.translate) + swiper.height - 30 > parseInt(swiper.$wrapperEl.css('height'));
                //     if (isPullUp) {//开始上拉
                //
                //         this.pulling = true;
                //         swiper.allowTouchMove = false;//禁止触摸
                //         swiper.setTransition(swiper.params.speed);//设置初始速度
                //         swiper.setTranslate(-(parseInt(swiper.$wrapperEl.css('height')) + 50 - swiper.height));//超过拉动距离时回弹
                //         swiper.params.virtualTranslate = true;//定住不给回弹
                //         // this.$refs.pullUpLoading.setText("正在上拉中...");//设置正在刷新中的文字
                //         this.pullUpText = ("正在上拉中...");//设置正在刷新中的文字
                //         this.$emit("pull-up", this.pullUpEnd);//触发消息，传递结束下拉的函数
                //         setTimeout(()=>this.pullUpEnd(), 2000);
                //     }
                // }
            },
            pullDownEnd() {
                const swiper = this.$refs.swiper.$swiper;
                swiper.allowTouchMove = true;//可以触摸
                swiper.setTransition(swiper.params.speed);//设置初始速度
                swiper.params.virtualTranslate = false;
                setTimeout(() => {
                    swiper.setTranslate(0);
                    setTimeout(() => {
                        this.pulling = false;
                        this.$emit("hidenAfterLoaded");
                    }, swiper.params.speed)
                }, 500);

            },
            pullUpEnd() {
                const swiper = this.$refs.swiper.$swiper;
                this.pulling = false;
                this.$refs.pullUpLoading.setText("上拉结束");//设置加载结束后的文字
                swiper.allowTouchMove = true;//可以触摸
                swiper.params.virtualTranslate = false;//可以回弹
            },
            scrollEnd(speed = 0) {
                const swiper = this.$refs.swiper.$swiper;
                swiper.translateTo(-1 * (swiper.slides[0].clientHeight - swiper.height), speed);
            },
            updateSwiper() {
                // console.log("********updateSwiper----------");
                this.$refs.swiper && this.$refs.swiper.$swiper.update();
            },
            recordPos() {
                this.currentPos = this.$refs.upper.parentNode.style.transform;
                console.log(this.currentPos);
            },
            restorePos() {
                if (this.currentPos) this.$refs.upper.parentNode.style.transform = this.currentPos;
            }
        },
        beforeMount() {
        },
        mounted() {
            this.upperHeight = this.$refs.upper.clientHeight;
            this.scrollEnd()
        }
    }
</script>

<style lang="scss" scoped>
    .swiper-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .swiper-slide {
        height: auto;
    }

    .mine-scroll-pull-down {
        position: absolute;
        left: 0;
        bottom: 100%;
        width: 100%;

        .upper-content {
            margin-bottom: .3rem;
        }
    }

    .mine-scroll-pull-up {
        position: absolute;
        left: 0;
        top: 100%;
        width: 100%;
    }
</style>