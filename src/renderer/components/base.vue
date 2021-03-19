<template>
    <div class="abs-root">
        <slot name="header"></slot>
        <slot name="body"></slot>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import '../assets/css/preload.css'
    import '../assets/js/preload'
    import '../assets/css/initial.css'
    // import '../assets/js/alert'

    export default {
        name: "base_layout",
        metaInfo: {
            title: 'WBL Toolbox',
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
                },
                {
                    name: 'description',
                    content: 'QQ',
                }
            ],
        },
        mounted() {
            // let now_version_name = window.Android ? window.Android.getVersionName() : '1.0.1';
            // this.$store.commit('update_now_version_name', now_version_name);
            // this.$axios.get(
            //     this.$host_header + '/checkupdate/'
            // ).then(res => {
            //     let new_version_name = res.data.version;
            //     if (new_version_name !== now_version_name) {
            //         alert(`当前版本: ${now_version_name}, 最新版本: ${new_version_name}, 可前往公众号升级App.`)
            //     }
            // });
        },
        data() {
            return {
            }
        },
    }
</script>

<style scoped>

</style>