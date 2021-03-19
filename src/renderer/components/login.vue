<template>
    <login_base :layout_data="layout_data"></login_base>
</template>

<script>
    import login_base from "./login_base";

    export default {
        name: "login",
        mounted() {
            // console.log("login fullpath", this.$route.fullPath === '/login')
        },
        components: {
            login_base,
        },
        data: function () {
            let that = this;
            return {
                layout_data: {
                    title: '欢迎登录',
                    action(u, p) {
                        if (!(u && p)) return;
                        let param = {
                            userName: u,
                            passWord: p,
                        };
                        that.$axios.post(
                            '/login/',
                            param,
                        ).then(res => {
                            let data = res.data;
                            if (data) {
                                that.$store.commit("updateSelfUserId", data.id);
                                // that.$store.commit("updateUserInfo", data);
                                that.$router.push('/').catch(() => {
                                });
                            } else {
                                alert('密码错误');
                                p = '';
                            }
                        }).catch(e => console.log(e))
                    },
                    action_name_p: '登录',
                    jump_tip_p: '没有帐号',
                    jump_link_name_p: '注册',
                    jump_link: '/register',
                }
            }
        },
    }
</script>

<style scoped>

</style>