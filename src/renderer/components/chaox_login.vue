<template>
    <div class="chaox_login_content">
        <div class="img_header">
            <img src="https://img.zcool.cn/community/0144955eca211fa801209b86b3eaff.jpg@1280w_1l_2o_100sh.jpg">
        </div>
        <form id="data_form" action="." method="post" enctype="multipart/form-data">
            <div>
                <div class="form-group">
                    <input type="text" class="form-control theme_ipt" name="account" placeholder="手机号"
                           v-model="store_chaox_data.account">
                    <input type="password" class="form-control center_hori theme_ipt" name="password" placeholder="密码"
                           v-model="store_chaox_data.password">
                    <img :src="$host_header+img_path" class="center_hori" id="numcode_img" v-if="img_path">
                    <input type="text" class="form-control theme_ipt" name="numcode" placeholder="验证码"
                           v-model="numcode">
                    <input type="text" class="form-control theme_ipt" name="accesscode" placeholder="辅助激活码"
                           v-model="accesscode">
                </div>
            </div>
            <button type="button" @click="do_login" style="width: 40%;"
                    class="btn btn-primary theme_btn" id="data_form_submit_btn">登录
            </button>
        </form>
    </div>
</template>

<script>

    export default {
        name: "chaox_login",
        data() {
            return {
                store_chaox_data: {
                    account: '',
                    password: '',
                },
                accesscode: '',
                numcode: '',
                img_path: null,
                prepare_data: null,
                ws: null,
            }
        },
        mounted() {
            const chaox_keys = JSON.parse(localStorage.getItem('chaox_keys'));
            let params ={
                action: 'prepare'
            };
            this.$axios.post(
                this.$host_header + '/chaox/ajaxlogin/',
                params,
            ).then(res => {
                this.prepare_data = res.data;
                let chaox_data = res.data.store_chaox_data;
                // console.log(chaox_data);
                if (chaox_data) {
                    this.store_chaox_data.account = chaox_data.account;
                    this.store_chaox_data.password = chaox_data.password;
                }

                const socket = new WebSocket(
                    'ws://'
                    + window.location.host
                    + this.$host_header
                    + '/ws/client/'
                );
                this.ws = socket;
                socket.onmessage = e => {
                    const data = JSON.parse(e.data);
                    if (data['key'] === 'LoginNumcode') {
                        let img_path = data['value'];
                        if (img_path) {
                            this.img_path = '/' + img_path;
                        }
                    }
                    else if(data['key'] === chaox_keys.key_login_successful){
                        if(data.value === true){
                            console.log('GOGOGO')
                            this.$router.push('courses');
                        }
                        else{
                            alert(data.value)
                        }
                    }
                };
            });

            alert('Welcome!输入手机号及密码登录,首次使用请于微信公众号"王菠萝502"内获取辅助码');
        },
        methods: {
            do_login() {
                // let params = new URLSearchParams();
                // params.append('action', 'dologin');
                // params.append('accesscode', this.accesscode);
                // params.append('numcode', this.numcode);
                // params.append('account', this.store_chaox_data.account);
                // params.append('password', this.store_chaox_data.password);
                let params = {
                    action: 'dologin',
                    accesscode: this.accesscode,
                    numcode: this.numcode,
                    account: this.store_chaox_data.account,
                    password: this.store_chaox_data.password,
                };
                this.$axios.post(
                    this.$host_header + '/chaox/ajaxlogin/',
                    params,
                ).then(res=>{
                    let d = res.data.result;
                    if(d) alert(d);
                })
            }
        },
        destroyed() {
            this.ws.close();
        }
    }
</script>

<style scoped lang="scss">
    .form-group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;

        > label:first-child {
            width: 100px;
        }

        > input, > img {
            flex: 1;
            margin: .5rem 0;
            max-height: 1.5rem;
            line-height: 1;
        }
    }

    .form-group-multi {
        padding-bottom: 20px;

        > input[type='text'] {
            display: inline;
            width: 10%;
        }

        > input:first-child {
            display: inline;
            width: 20%;
        }

        > label {
            padding-right: 80px;
        }
    }


    .radio_div {
        display: inline;

        > label {
            width: 100px;
        }
    }


    .center_hori {
        display: inherit;
        margin: 0 auto;
    }

    .chaox_login_content {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;

        > form {
            flex: 1.5;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        }
    }

    #data_form {
        > button {
            margin-bottom: 2rem;
        }

        > div {
            flex: 1;
        }
    }

    .img_header {
        background-color: #fff;
        display: flex;
        justify-content: center;

        > img {
            width: 70%;
            max-width: 30vh;
        }
    }

</style>