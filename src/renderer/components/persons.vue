<template>
    <div class="theme-padding-l-r row flex-ac persons-container">
        <!--        <better-scroll >-->
        <!--            -->
        <!--        </better-scroll>-->
        <!--        <mt-index-list class="fit-height">-->
        <!--            <mt-index-section class="index-item" v-for="(v, k) in friends" :key="k" :index="k">-->
        <!--                <div class="index-section">-->
        <!--                    <lazy-component  v-for="(e1) in v" :key="e1" style="-->
        <!--                            /*width: 100%;*/-->
        <!--                        /*height: 100vh;*/-->
        <!--                        /*overflow: auto;*/-->
        <!--                    ">-->
        <!--                        <press_shandow>-->
        <!--                            <person :user-id="e1" :link="`/chatroom/0/${e1}`"></person>-->
        <!--                        </press_shandow>-->
        <!--                    </lazy-component>-->

        <!--                </div>-->
        <!--            </mt-index-section>-->
        <!--        </mt-index-list>-->
        <!--        <div>-->
        <!--            <div v-for="(v, k) in friends" :key="k">-->

        <!--                <div v-text="e1" v-for="(e1) in v" :key="e1"></div>-->
        <!--            </div>-->
        <!--        </div>-->
        <virtual-list v-on:scroll="handleVirtualListScroll" ref="virtualList"
                      class="scrollbar flex-open-up fill-col scroll-y" v-if="friends"
                      :data-key="'v'"
                      :data-sources="friends[0]"
                      :data-component="itemComponent"
                      scroll="scroll"
        />
        <div class="index-list fill-col scroll-y small-font tip-font-color">
            <div v-for="e in Object.keys(friends[1])" v-text="e" :class="currentIndex === e ? 'current-index': ''"
                 @click="changeIndexTo(e)"></div>
        </div>
    </div>
</template>

<script>

    // import {IndexList, IndexSection} from 'mint-ui';
    // import Vue from 'vue';
    // import Person from "../views/person";
    // import press_shandow from "../views/press_shandow";
    // import store from "../../store";
    import pinyin from "../assets/js/pinyin";
    import VirtualList from 'vue-virtual-scroll-list';
    import single_person_item from "../views/single_person_item";
    // import {Lazyload} from 'vant';

    // Vue.use(Lazyload, {
    //     lazyComponent: true,
    // });

    // Vue.component(IndexList.name, IndexList);
    // Vue.component(IndexSection.name, IndexSection);
    export default {
        name: "persons",
        components: {'virtual-list': VirtualList},
        data() {
            return {
                itemComponent: single_person_item,
                currentIndex: null,
            }
        },
        mounted() {
        },
        beforeMount() {
            // this.$axios.post("/getfriends").then(res => {
            //     res.data.forEach(e => this.$stt.users.get(e, 0));
            //     this.$stt.friendIds = res.data;
            // })
            //
            // this.$axios.get('/get_group_list').then(res => {
            //     res.data.forEach(e => store.state.users.set(1, e));
            // })
        },
        computed: {
            friends() {
                let getFriendMap = (users, ids) => {
                    let return_dict = {};
                    ids.forEach((e) => {
                        let friensInfo = users.get(e, 0);
                        if (!friensInfo) return;
                        let pinyinStart = pinyin(friensInfo.name[0])[0].toUpperCase();
                        const charAt = pinyinStart.charCodeAt();
                        pinyinStart = (charAt >= 65 && charAt <= 90) ? pinyinStart : '#';
                        if (return_dict[pinyinStart]) return_dict[pinyinStart].push(e);
                        else return_dict[pinyinStart] = [e];
                    });

                    let totalData = [], indexPosRecord = {};
                    let keys = Object.keys(return_dict).sort();
                    if (keys[0] === '#') {
                        keys.shift();
                        keys.push('#');
                    }
                    this.currentIndex = this.currentIndex || keys[0];
                    keys.forEach((k) => {
                        totalData.push({isIndex: true, index: k, v: k});
                        indexPosRecord[k] = totalData.length - 1;
                        totalData.push.apply(totalData, return_dict[k])
                    });
                    return [
                        totalData.map(v => {
                            return v.isIndex ? v : {v};
                        }),
                        indexPosRecord,
                    ];

                    return return_dict;
                }

                return getFriendMap(this.$stt.users, this.$stt.friendIds)
            },
        },
        methods: {
            changeIndexTo(index) {
                this.$refs.virtualList.scrollToIndex(this.friends[1][index]);
                this.currentIndex = index;
            },
            handleVirtualListScroll(event, range) {
                // console.log("scroll params", event, range);
                const el = this.$refs.virtualList.$el;
                const scrollTop = el.scrollTop;
                // let lastOffsetTop = null;
                let done = null;
                const children = el.children[0].children;
                for (let i = 0; i < children.length; i++) {
                    if (done) return;
                    let c = children[i];
                    let currentOffsetTop = c.offsetTop;
                    if (currentOffsetTop >= scrollTop) {
                        let realIndex = range.start + i;
                        const record = this.friends[1];
                        Object.keys(record).reverse().forEach(k => {
                            if (done) return;
                            if (realIndex >= record[k]) {
                                this.currentIndex = k;
                                done = true;
                            }
                        });
                    }
                }

            }
        },
        // watch:{
        //     '$stt.users':{
        //         handler(){
        //             // this.
        //         }
        //     }
        // }

    }
</script>

<style lang="scss" scoped>
    .persons-container {
        height: 50vh;
    }

    .scrollbar::-webkit-scrollbar {
        display: none;
    }

    .index-list {
        /*width: 2rem;*/
        /*padding-top: 3rem;;*/
        /*line-height: 100%;*/
        &::-webkit-scrollbar {
            display: none;
            /*width: 10px;*/
        }

        > div {
            cursor: pointer;
            width: 100%;
            text-align: center;
            padding: 1px 0;

            &.current-index {
                color: $theme_deep_color;
            }

            &:hover {
                color: $theme_deep_color;
            }
        }
    }

    .scroll-y {
        overflow-y: auto;
    }

    /*!*定义滚动条的轨道，内阴影及圆角*!*/
    /*.scrollbar::-webkit-scrollbar-track {*/
    /*    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
    /*    border-radius: 10px;*/
    /*    background-color: #f5f5f5;*/
    /*}*/

    /*!*定义滑块，内阴影及圆角*!*/
    /*.scrollbar::-webkit-scrollbar-thumb {*/
    /*    !*width: 10px;*!*/
    /*    height: 20px;*/
    /*    border-radius: 10px;*/
    /*    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
    /*    background-color: #555;*/
    /*}*/
</style>

<style lang="scss">
    .fit-height {
        height: fit-content;

        > ul {
            height: fit-content !important;
        }
    }

    .mint-indexlist-nav {
        border: none;

        > .mint-indexlist-navlist > .mint-indexlist-navitem {
            font-size: $middle-small-font-size;
            color: $theme-tip-font-color;
        }
    }

    .mint-indexsection-index {
        padding: 0;
        background-color: white;
        color: $theme_deep_color;
        font-size: $middle-small-font-size;
    }
</style>