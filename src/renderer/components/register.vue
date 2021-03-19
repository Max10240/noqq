<template>
    <login_base :layout_data="layout_data"></login_base>
</template>

<script>
    import login_base from "./login_base";

    export default {
        name: "register",
        components: {
            login_base,
        },
        data: function () {
            let that = this;
            return {
                'layout_data': {
                    title: '用户注册',
                    action(u, p) {
                        if (!(u && p)) return;
                        // let param = new URLSearchParams();
                        // param.append('userName', u);
                        // param.append('passWord', p);
                        let param = {
                            userName: u,
                            passWord: p,
                        };
                        that.$axios.post(
                            '/register/',
                            param,
                        ).then(res => {
                            let data = res.data;
                            if (data) {
                                alert(`注册成功! Your account: ${data.account}`, () => {
                                    that.$router.push('/login');
                                })
                            } else {
                                alert('用户名已使用!');
                                p = '';
                            }
                        }).catch(e => console.log(e))
                    },
                    action_name_p: '注册',
                    jump_tip_p: '已有帐号',
                    jump_link_name_p: '登录',
                    jump_link: '/login',
                }
            }
        },
    }
</script>

<style scoped>

</style>