<template>
    <Swipe_to_back>

        <theme_base>
            <div @click="$router.go(-1)" slot="h-left">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <div slot="h-middle">群通知</div>
            <div slot="h-right">清空</div>
            <div slot="body" class="body-container column">
                <div class="title-bar row theme-bg-white theme-padding-l-r">
                    <div :class="`filter-btn ${filterCondition === 0 ? 'on-filter': ''}`"
                         v-text="`待处理(${unhandleNum})`" @click="toggleFilter(0)"></div>
                    <div :class="`filter-btn ${filterCondition === 1 ? 'on-filter': ''}`"
                         @click="toggleFilter(1)">已过滤
                    </div>
                </div>
                <div style="flex: 1;overflow-y: hidden;">
                    <better-scroll ref="betterScroll">
                        <div v-for="(e, i) in askList" :key="e.id + i">
                            <div v-if="e.user"
                                 class="row flex-between single-ask theme-bg-white theme-padding-l-r">
                                <div class="row flex-center">
                                    <div class="avatar"
                                         :style="`background-image: url('${e.user.avatar}')`"></div>
                                    <div class="column">
                                        <div v-text="e.user.name"></div>
                                        <div class="middle-small-font tip-font-color"
                                             v-text="`LV${e.user.level || 0}`"></div>
                                        <div class="middle-small-font tip-font-color"
                                             v-text="`${e.text}`"></div>
                                    </div>
                                </div>
                                <div class="tip-font-color" v-if="e.status === 0">已申请</div>
                                <div class="tip-font-color" v-if="e.status === 1">已加入</div>
                                <div class="agree-btn" v-if="e.status === 2"
                                     @click="allowJoinGroup(e.userId, e.groupId, e)">同意
                                </div>
                                <div class="tip-font-color" v-if="e.status === 3">已同意</div>
                            </div>
                        </div>
                    </better-scroll>
                </div>
            </div>
        </theme_base>
    </Swipe_to_back>
</template>

<script>
    import theme_base from "./theme_base";
    import betterScroll from "../views/betterScroll";
    import Swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "new_group",
        components: {Swipe_to_back, theme_base, betterScroll},
        data() {
            return {
                filterCondition: null,
            }
        },
        computed: {
            askList() {
                let askList = this.$store.state.oriGroupAskList.map(e => {
                    return {
                        ...e,
                        user: this.$store.state.users.get(e.groupId, 1),
                    }
                });
                let return_list = [];
                if (this.filterCondition === 0) {
                    return_list = askList.filter(e => e.status === 2)
                } else if (this.filterCondition === 1) {
                    return_list = askList.filter(e => e.status === 5)
                } else {
                    return_list = askList
                }
                return return_list
            },
            unhandleNum() {
                return this.$store.state.oriGroupAskList.filter(e => e.status === 0).length
            }
        },
        mounted() {
            // setTimeout(() => {
            //     this.oriAskList = [
            //         {id: 0, groupId: 1, text: "text-0-3001", status: 1},
            //         {id: 1, groupId: 1, text: "text-0-30010", status: 0},
            //         {id: 2, groupId: 1, text: "text-0-30012", status: 2},
            //         {id: 3, groupId: 1, text: "text-0-30012", status: 2},
            //         {id: 4, groupId: 1, text: "text-0-30012", status: 2},
            //         {id: 5, groupId: 1, text: "text-0-30012", status: 2},
            //         {id: 6, groupId: 1, text: "text-0-30012", status: 2},
            //         {id: 7, groupId: 1, text: "text-0-30012", status: 2},
            //         {id: 8, groupId: 1, text: "text-0-30012", status: 2},
            //     ]
            // }, 1500);
            // window.currentVue = this;
        },
        methods: {
            toggleFilter(mode) {
                this.filterCondition = this.filterCondition === mode ? null : mode;
            },
            allowJoinGroup(userId, groupId, e) {
                this.$axios.post('/joingroup', {
                    userId,
                    groupId,
                });
                // e.status = 3;
                let oriIndex, oriRecord;
                for (let [i, record] of this.$store.state.oriGroupAskList.entries()) {
                    if (record.id === e.id) {
                        oriIndex = i;
                        oriRecord = record;
                        break
                    }
                }
                oriRecord.status = 3;
                this.$store.state.oriGroupAskList.splice(oriIndex, 1, {...oriRecord})
            }
        }
    }
</script>

<style scoped lang="scss">
    .body-container {
        height: 100%;
    }

    .title-bar {
        $p-t: 1rem;
        padding-top: $p-t;
        padding-bottom: $p-t;
    }

    .agree-btn {
        $height: 2rem;
        height: $height;
        text-align: center;
        line-height: $height;
        width: 4rem;
        border-radius: $height * .5;
        background-color: $font-bg-gray;
        color: black;
    }

    .single-ask {
        $p-t: 1rem;
        padding-top: $p-t;
        padding-bottom: $p-t;
    }

    .avatar {
        $height: 3rem;
        height: $height;
        width: $height;
        margin-right: .5rem;
    }

    .filter-btn {
        $height: 2rem;
        height: $height;
        line-height: $height;
        text-align: center;
        padding: 0 1rem;
        border-radius: .25rem;
        background-color: $font-bg-gray;
        margin-right: 1rem;
        color: $theme-tip-font-color;
    }

    .on-filter {
        color: $theme_deep_color;
        font-weight: bold;
    }

</style>