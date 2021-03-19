<template>
    <swiper class="swiper" :options="swiperOption" ref="swiper">
        <swiper-slide>
            <slot></slot>
        </swiper-slide>
        <div v-if="scrollbar" class="swiper-scrollbar" slot="scrollbar"></div>
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
            let that = this;
            return {
                swiperOption: {
                    scrollbar: that.scrollbar ? {
                        el: '.swiper-scrollbar',
                        hide: true
                    } : null,
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    resistanceRatio: .75,
                    mousewheel: true,
                    virtual: this.virtual,
                    // nested: true,
                    // autoHeight: true,
                    // observer: true,
                    // observeSlideChildren: true,
                    on: {
                        // sliderMove: () => {
                        //     this.sliderMove();
                        // },
                        touchEnd: this.touchEnd,
                        init: function () {
                            this.translateToBak = this.translateTo;
                            this.setTranslateBak = this.setTranslate;
                        },
                        touchStart: function () {
                            this.setTranslate(this.getTranslate());
                            this.translateTo = () => {
                            };
                            this.setTranslate = () => {
                            };
                        },
                        touchMove: function () {
                            this.translateTo = this.translateToBak;
                            this.setTranslate = this.setTranslateBak;
                        }
                    }
                },
            }
        },
        props: {
            scrollbar: {
                type: Boolean,
                default() {
                    return false
                }
            },
            virtual: {
                type: Boolean,
                default() {
                    return false
                }
            },
        },
        watch: {},
        methods: {
            scrollEnd(speed = 0) {
                const swiper = this.$refs.swiper.$swiper;
                swiper.translateTo(-1 * (swiper.slides[0].clientHeight - swiper.height), speed);
            },
            updateSwiper() {
                this.$refs.swiper && this.$refs.swiper.$swiper.update();
            }
        },
        beforeMount() {
            if (!this.scrollbar) delete this.swiperOption['scrollbar'];
        },
        mounted() {
        },
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

</style>