<template>
    <base_layout>
        <div slot="body">
            <div class="container">
                <div class="above">
                    <span class="title" v-text="layout_data.title"></span>
                    <span class="text_below_title">Wbl's toolbox</span>
                </div>
                <div class="below">
                    <form id="data_form">
                        <input type="text" id="login-username" v-model="username" placeholder="帐号">
                        <input type="password" id="login-password" v-model="password" placeholder="密码">
                        <button type="button" v-text="layout_data.action_name_p"
                                @click="layout_data.action(username, password)"></button>
                    </form>
                    <div class="jump">
                        <span class="jump_tip" v-text="layout_data.jump_tip_p"></span>
                        <router-link :to="layout_data.jump_link">
                            <div class="jump_link" v-text="layout_data.jump_link_name_p"></div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </base_layout>
</template>

<script>
    import base_layout from "./base";
    // import '../../public/css/login.css'
    export default {
        name: "login_base",
        components: {
            base_layout,
        },
        props: [
            'layout_data',
        ],
        data() {
            return {
                username: "",
                password: "",
            }
        },
        methods: {
            // say_hello() {
            //     console.log('Hello')
            // }
        },
    }
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .container > div {
        padding-left: 40px;
    }

    .above {
        background-color: #FFD100 !important;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
    }

    .below {
        background-color: white !important;
        flex: 1;
        display: flex;
        flex-direction: column;
        color: #aaa;
    }

    .title {
        font-size: 2.5em;
        font-weight: 600;
    }

    .text_below_title {
        font-weight: 300;
    }

    #data_form {
        flex-direction: column;
        display: flex;
        flex: 1;
        margin-top: 3vh;
    }

    #data_form > input {
        border: none;
        border-bottom: 1px solid #eee;
        padding: 10px 0;
        outline: none !important;
        font-size: 1.1rem;
        line-height: 3rem;
        margin-right: 40px;
    }

    #data_form > input:focus {
        border-color: #FFD100;
    }

    #data_form > button {
        color: white;
        background-color: #FFD100;
        border-color: orange;
        border-width: 0;
        font-weight: 300 !important;
        font-size: 1rem;
        line-height: 2rem;
        border-radius: 0.25rem;
        width: 3.5rem;
        margin-top: 4vh;
    }

    #data_form > button:focus {
        outline: none;
    }

    .jump {
        display: flex;
        margin-bottom: 2rem;
    }

    .jump_tip {
        font-size: .75rem;
    }

    .jump_link {
        font-size: .9rem;
        color: #FFD100;
    }
</style>