<template>
    <theme_base class="theme-base-do-search">
        <div slot="body">
            <Swipe_to_back class="ctn-container column">
                <div class="column">
                    <div class="row flex-center content theme-padding-l-r">
                        <i @click="$router.go(-1)" class="iconfont icon-fanhui tip-font-color"></i>
                        <div class="row input-row parent flex-center">
                            <i class="iconfont icon-sousuo search-icon"></i>
                            <input autofocus ref="input" @focus="handleFocus" @blur="handleHideKB"
                                   @keyup.enter="doSearch"
                                   type="search" v-model="value" placeholder="搜索">
                        </div>
                        <div @click="clearInput" class="cancel" v-show="showCancel">取消</div>
                    </div>
                </div>
                <div class="below">
                    <div v-show="!value.trim()" class="blank"></div>
                    <div v-if="searching">
                        <div class="row flex-center searching-bar">
                            <img src="../assets/imgs/loading.gif" height="16">
                            <div class="tip-font-color">正在加载...</div>
                        </div>
                    </div>
                    <better-scroll class="contentSwiper">
                        <div class="search-show-bar" v-if="searchPeoples.length">
                            <div class="title-tip theme-padding-l-r tip-font-color middle-small-font">查找人</div>
                            <div v-for="(e,i) in searchPeoples" :key="i">
                                <div v-if="e.user" class="row flex-between single-ask theme-padding-l-r">
                                    <div class="row flex-center">
                                        <div class="avatar" :style="`background-image: url('${e.user.avatar}')`"></div>
                                        <div class="column">
                                            <div v-text="e.user.name"></div>
                                            <div class="middle-small-font tip-font-color"
                                                 v-text="e.user.age || 19"></div>
                                            <div class="middle-small-font tip-font-color"
                                                 v-text="e.user.signature"></div>
                                        </div>
                                    </div>
                                    <router-link tag="div" :to="`/askpeople/${e.user.id}`" v-if="!oriSearchResult.friendsMap[i]" class="agree-btn">添加</router-link>
                                    <div v-if="oriSearchResult.friendsMap[i]" class="middle-small-font tip-font-color">已添加</div>
                                </div>
                            </div>
                        </div>

                        <div class="search-show-bar theme-padding-l-r" v-if="searchGroups.length">
                            <div class="title-tip tip-font-color middle-small-font">查找群</div>
                            <div v-for="(e,i) in searchGroups" :key="i">
                                <div v-if="e.group" class="row flex-between single-ask">
                                    <div class="row flex-center">
                                        <div class="avatar" :style="`background-image: url('${e.group.avatar}')`"></div>
                                        <div class="column">
                                            <div v-text="e.group.name"></div>
                                            <div class="middle-small-font tip-font-color"
                                                 v-text="e.group.memberNum || 1602"></div>
                                            <div class="middle-small-font tip-font-color"
                                                 v-text="e.group.introduction"></div>
                                        </div>
                                    </div>
                                    <router-link tag="div" :to="`/askgroup/${e.group.id}`" v-if="!oriSearchResult.groupMembersMap[i]" class="agree-btn">加入</router-link>
                                    <div v-if="oriSearchResult.groupMembersMap[i]" class="middle-small-font tip-font-color">已加入</div>
                                </div>
                            </div>
                        </div>
                    </better-scroll>

                </div>

            </Swipe_to_back>

        </div>
    </theme_base>
</template>

<script>
    import theme_base from "./theme_base";
    import betterScroll from "../views/betterScroll";
    import Swipe_to_back from "../views/swipe_to_back";

    export default {
        name: "do_search_people",
        components: {Swipe_to_back, theme_base, betterScroll},
        data() {
            return {
                showCancel: false,
                value: '',
                oriSearchResult: {peoples: [], groups: [], friendsMap: [], groupMembersMap: []},
                searching: false,
            }
        },
        methods: {
            doSearch() {
                this.searching = true;
                this.$refs.input.blur();
                // setTimeout(() => {
                //     this.searching = false;
                //     this.oriSearchResult = {
                //         peoples: [1, 2, 3, 4, 5, 8,],
                //         groups: [1],
                //     };
                // }, 1000);
                this.$axios.post("/searchpg", {
                    key: this.value
                }).then(res => this.oriSearchResult = res.data).finally(() => {
                    this.searching = false;
                })
            },
            clearInput() {
                this.value = ''
            },
            handleFocus() {
                this.showCancel = true;
                this.oriSearchResult.peoples.splice(0, this.oriSearchResult.peoples.length);
                this.oriSearchResult.groups.splice(0, this.oriSearchResult.groups.length);
            },
            handleHideKB() {
                setTimeout(() => {
                    this.showCancel = false
                }, 100);
            },
        },
        computed: {
            searchPeoples() {
                return this.oriSearchResult.peoples.map(e => {
                    return {
                        user: this.$store.state.users.get(e, 0),
                    }
                });
            },
            searchGroups() {
                return this.oriSearchResult.groups.map(e => {
                    return {
                        group: this.$store.state.users.get(e, 1),
                    }
                });
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.input.focus();
                // this.$refs.input.click();
            })
        }
    }
</script>

<style scoped lang="scss">
    .ctn-container {
        height: 100%;
        overflow-y: hidden;
    }

    .content {
        padding-top: .75rem;
        padding-bottom: .75rem;
        background-color: $theme-background_color;

        > i {
            font-size: 1.25rem;
        }
    }

    .input-row {
        $height: 2.25rem;
        flex: 1;
        background-color: $theme-bg-deeper_light_gray;
        height: $height;
        border-radius: $height * .5;
        padding: 0 1rem;
        margin: 0 1rem;

        > input {
            margin-left: .25rem;
            flex: 1;
            background-color: transparent;
            color: $theme-normal-font-color;
            font-weight: 500;
        }
    }

    .cancel {
        color: $theme-deep_color;
        z-index: 1;
    }

    .below {
        flex: 1;
        overflow-y: hidden;

        .blank {
            height: 100%;
            background-color: $theme-background_color;
        }

        .searching-bar {
            margin-top: 5rem;

            > img {
                margin-right: .5rem;
            }
        }

        .single-ask {
            $p-t: 1rem;
            padding-top: $p-t;
            padding-bottom: $p-t;
            border-bottom: 1px lightgray solid;
        }

        .avatar {
            $height: 3rem;
            height: $height;
            width: $height;
            margin-right: .5rem;
        }

        .search-show-bar {
            background-color: $theme-background_color;

            &:nth-child(1) {
                margin-bottom: .75rem;
            }
        }
    }

    .contentSwiper {
        max-height: 100%;
        overflow-y: hidden;
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

</style>

<style lang="scss">
    .theme-base-do-search {
        .theme-header {
            height: 2.25rem;
        }
    }
</style>