<template>
    <swiper ref="cntSwiper" class="swiper" style="height: 100%" :options="swiperOption">
        <swiper-slide>
            <div ref="upper">
                <slot name="upper"></slot>
            </div>
        </swiper-slide>
        <swiper-slide>
            <swiper :options="swiperOption1">
                <swiper-slide>
                    <div ref="content">
                        <slot name="content"></slot>
                    </div>
                </swiper-slide>
            </swiper>
        </swiper-slide>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
</template>

<script>
    import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
    // import 'swiper/swiper-bundle.css'
    import 'swiper/css/swiper.css'

    export default {
        name: "updraw",
        components: {Swiper, SwiperSlide},
        props: [
            'actionDone'
        ],
        data() {
            let that = this;
            return {
                swiperOption: {
                    init: false,
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    observer: false,
                    slidesOffsetBefore: 0,

                    scrollbar: {
                        el: '.swiper-scrollbar',
                        hide: true,
                    },
                    on: {
                        sliderMove() {
                            // console.log(this.getTranslate());
                            let translate = this.translate;
                            that.$emit('drawOverflow', translate >= 0);
                            // if (translate >= 0) {
                            //     console.log("drawOverflow")
                            // }
                        },
                        touchEnd() {
                            let translate = this.translate;
                            if (translate >= 0) {
                                that.$emit('drawAction');
                                // this.params.slidesOffsetBefore = 0;
                                this.update();
                                // this.setTranslate(0,);
                                // setTimeout(() => that.actionDone = !that.actionDone, 2000);
                                // console.log('drawAction');
                            }
                        }
                    }

                },
                cntSwiper: null,
            }
        },
        mounted() {
            this.cntSwiper = this.$refs.cntSwiper.$swiper;
            // console.log('refs', this.$refs);
            this.cntSwiper.params.slidesOffsetBefore = -1 * this.$refs.upper.clientHeight;
            // if (0) this.cntSwiper.params.slidesOffsetAfter = this.$refs.upper.clientHeight;
            this.cntSwiper.init();
            this.$emit("setChildSwiper", this.cntSwiper)
        },
        watch: {
            actionDone() {
                setTimeout(() => {
                    // this.cntSwiper.params.slidesOffsetBefore = -1 * this.$refs.upper.clientHeight;
                    // this.cntSwiper.update();
                    // this.cntSwiper.slideToClosest();
                }, 500);
            }
        }
    }
</script>

<style scoped>

</style>