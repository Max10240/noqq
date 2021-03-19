<template>
    <Theme_base>
        <div slot="h-left">
            <div @click="$router.push('/index/contact/').catch(()=>{})" slot="h-left">
                <i class="iconfont icon-fanhui"></i>
            </div>
        </div>
        <div slot="h-middle" class="row">
            <router-link class="search-link" tag="div" active-class="selected" to="/searchpg/people">找人
            </router-link>
            <router-link class="search-link" tag="div" active-class="selected" to="/searchpg/group">找群
            </router-link>
        </div>
        <div slot="body">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </Theme_base>
</template>

<script>
    import Theme_base from "./theme_base";

    export default {
        name: "search_people_group",
        components: {Theme_base},
    }
</script>

<style scoped lang="scss">
    .search-link {
        $height: 28px;
        $border-width: 1px;
        line-height: $height + $border-width*2;
        text-align: center;
        width: 5rem;
        border: 2px white solid;

        &.selected {
            background-color: $theme-background_color;
            color: $theme_deep_color;
        }

        &:nth-child(1) {
            border-top-left-radius: $height*.5 + $border-width*4;
            border-bottom-left-radius: $height*.5 + $border-width*4;
            border-right: none;
        }

        &:nth-child(2) {
            border-top-right-radius: $height*.5 + $border-width*4;
            border-bottom-right-radius: $height*.5 + $border-width*4;
            border-left: none;
        }
    }

    .s-pg-router {
        min-height: 100%;
    }


</style>