<template>
    <keep-alive>
        <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
</template>

<script>
    export default {
        name: "mine_base",
        data() {
            return {
                // avatar_url: null,
            }
        },
        methods: {
            // update_avatar_url(url){
            //     // console.log('get url:'+url);
            //     this.avatar_url = url;
            // }
        }
    }
</script>

<style scoped>

</style>