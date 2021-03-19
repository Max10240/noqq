<template>
    <div class="nav_list">
        <router-link tag="span" class="icon_item pointer" v-for="(e, i) in to_links_data" :to="'/index/'+e.link" :key="e.link"
                     active-class="selected">
            <i :class="'parent iconfont icon-'+e.icon_class">
                <span v-if="i ===0 && $store.getters.totalUnreadMsgNum" v-text="$store.getters.totalUnreadMsgNum" class="unread"></span>
                <span v-if="i ===1 && $store.getters.totalUnhandleAskNum" v-text="$store.getters.totalUnhandleAskNum" class="unread"></span>
            </i>
            <span v-text="e.name"></span>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "navbar",
        props: [
            'to_links_data'
        ],
        computed:{
            // unreadMsgNum(){
            //     return this.
            // },
        }
    }
</script>

<style scoped lang="scss">
    .nav_list {
        /*margin: 0 1rem;*/
        padding: .5rem 0;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-around;
    }

    .icon_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $theme-tip-font-color;

        & > i {
            font-size: 1.5rem;
            color: gray;
        }


        &.selected {
            color: $theme-normal-font-color;

            > i {
                color: $theme_deep_color;
            }
        }

        & > span {
            font-size: .6rem;
            margin-top: 2px;
        }

        .unread {
            position: absolute;
            top: -20%;
            right: -20%;
        }
    }

</style>

<style lang="scss">
    .unread {
        $height: 1rem;
        width: $height;
        height: $height;
        line-height: $height;
        text-align: center;
        border-radius: 50%;
        background-color: red;
        color: $theme-normal-font-color-white;
        font-size: $small-font-size;
    }
</style>