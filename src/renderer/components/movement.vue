<template>
    <better-scroll>
        <div class="movement-container">
            <searchbar></searchbar>

            <div class="ctn-container index-body-last-child">
                <press_shandow class="row movement-row">
                    <div class="row flex-center">
                        <i class="iconfont icon-QQkongjian"></i>
                        <span>好友动态</span>
                    </div>
                    <i class="tip-font-color middle-small-font iconfont icon-dayuhao"></i>
                </press_shandow>
                <div class="items">
                    <press_shandow tag="span" class="item" to="music">
                        <i style="color: rgb(251, 95, 119)" class="iconfont icon-tubiaolianxi-"></i>
                        <span>附近</span>
                    </press_shandow>
                    <press_shandow tag="span" class="item" to="video/">
                        <i style="color: rgb(22, 210, 248)" class="iconfont icon-hfenlei6"></i>
                        <span>运动</span>
                    </press_shandow>
                    <press_shandow tag="span" class="item" to="chats/">
                        <i style="color: rgb(27, 217, 249)" class="iconfont icon-icyingyongbao48px"></i>
                        <span>应用宝</span>
                    </press_shandow>
                </div>
            </div>

<!--            <div style="height: 150px;overflow-y: auto">-->
<!--                <div style="height: 50px" v-for="(e,i) in Array(50)">i</div>-->
<!--            </div>-->
        </div>
    </better-scroll>
</template>

<script>
    import Searchbar from "../views/searchbar";
    import betterScroll from "../views/betterScroll";
    import press_shandow from "../views/press_shandow";

    export default {
        name: "movement",
        components: {press_shandow, Searchbar, betterScroll},
        methods: {},
        mounted() {
        },
        activated() {
            this.$store.commit("gotoThisIndexPage", 2);
        }
    }
</script>

<style scoped lang="scss">
    .items {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        height: fit-content;

        > .item {
            background-color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 30vw;
            height: 30vw;
            margin: .1rem 0;

            & > .iconfont {
                font-size: 1.5rem;
                margin-bottom: .2rem;
                color: #FFD100;
            }

            &:nth-child(3n-2) {
                border-radius: 20% 0 0 20%;
            }

            &:nth-child(3n) {
                border-radius: 0 20% 20% 0;
            }
        }
    }

    .movement-row {
        $height: 5rem;
        align-items: center;
        justify-content: space-between;
        margin: .7rem 0;
        padding: 0 .7rem;
        height: $height;
        background-color: white;
        border-radius: $height*.2;
        /*width: 100%;*/

        .movement-ctn-row {
            justify-content: space-between;
            align-items: center;
            flex: 1;
        }

        .row .iconfont {
            font-size: 1.8rem;
            margin-right: .7rem;
            color: #FFD100;
        }

        .left-circle {
            width: .5rem;
            border-radius: $height*.2 0 0 $height*.2;
        }

        .right-circle {
            width: $height;
            border-radius: $height*.2 0 0 $height*.2;
        }
    }


    .ctn-container {
        margin: .5rem 1rem;
    }

</style>