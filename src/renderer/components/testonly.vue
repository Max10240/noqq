<template>
    <div style="
        width: 100%;
    height: 100vh;
    overflow: auto;
">
        <!--        <lazy-component v-for="(img,i) in Array(100)" style="-->
        <!--            width: 50%;-->
        <!--            height: 30vh;-->
        <!--            overflow: auto;-->
        <!--        ">-->
        <!--            <div>-->
        <!--                <div v-for="(e1,i1) in Array(30)">i1</div>-->
        <!--                <div style="background-color: red;" v-text="i"></div>-->
        <!--            </div>-->
        <!--        </lazy-component>-->
        <iscroll-view :options="{preventDefault: false}" style="height: 50vh;overflow: hidden">
            <div v-for="(e,i) in Array(200)">
                <div v-text="i"></div>
                <div>-----</div>
            </div>
        </iscroll-view>


    </div>
</template>

<script>
    import {Toast} from 'vant';
    import Vue from 'vue';
    import {Lazyload} from 'vant';
    import IScrollView from 'vue-iscroll-view'

    /* Using these kinds of IScroll class for different cases. */
    import IScroll from 'iscroll'
    // import IScroll from 'iscroll/build/iscroll-infinite.js
    // import IScroll from 'iscroll/build/iscroll-probe.js
    // import IScroll from 'iscroll/build/iscroll-view.js
    // import IScroll from 'iscroll/build/iscroll-zoom.js
    // import IScroll from 'iscroll/build/iscroll-lite.js

    Vue.use(IScrollView, IScroll)

    Vue.use(Lazyload, {
        lazyComponent: true,
        observer: true,
        observerOptions: {
            rootMargin: '0px',
            threshold: 0.1
        },

    });
export default {
  data() {
    return {
      imageList: [
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-1.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
        'https://img01.yzcdn.cn/vant/apple-2.jpg',
      ],
    };
  },
};
</script>