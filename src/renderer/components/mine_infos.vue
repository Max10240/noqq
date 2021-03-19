<template>
    <div class="container">
        <form enctype="multipart/form-data" id="data_form" :action="target_link" method="post"
              onsubmit="return allow_submit()">
            <div class="form-group">
                <label style="display: block">上传新头像：</label>
                <li class="indent_0">从头像库选择:</li>
                <input type="text" style="display: none;" name="select_avatar_src"
                       id="select_avatar">
                <router-link tag="div" class="indent_1 change_avater" to="select_avatars"
                             style="margin-bottom: .5rem">
                    <i class="iconfont icon-tiaozhuan" style="color: red"></i> Get It Now!
                </router-link>
                <div style="display: none">
                    <li class="indent_0">从本地上传:</li>
                    <input type="file" class="form-control indent_1" name="avatar_file"
                           style="width: calc(100% - 2rem)">
                </div>
            </div>
            <div class="form-group" v-if="user">
                <label>帐号：</label>
                <input type="text" class="form-control theme_ipt" v-model="user.name" readonly>
            </div>
            <div class="form-group">
                <label>昵称：</label>
                <input type="text" id="nickname_input" class="form-control theme_ipt" name="nickname"
                       v-model="user.nick_name">
            </div>
            <div class="form-group">
                <label>性别：</label>
                <input type="text" class="form-control theme_ipt" name="sex" v-model="user.format_gender">
            </div>


            <button class="theme_btn" type="button"
                    style="margin-bottom: 2rem" @click="submit_userinfo">提交</button>
        </form>
        <iframe id="mine_iframe" src="about:blank" style="display: none; height: 95vh"
                width="100%" height="100%"
                frameborder="0" marginheight="0" marginwidth="0" scrolling="auto">
        </iframe>
    </div>
</template>

<script>
    export default {
        name: "mine_infos",
        props: ['avatar_url'],
        data() {
            // let that = this;
            return {
                user: {
                    name: '',
                    nick_name: '',
                    format_gender: '',
                },
                target_link: 'selectavatars',
                changed: false,
            }
        },
        mounted() {
            this.$axios.post(
                this.$host_header + '/userinfo/',
            ).then(res => {
                this.user = res.data;
            })
        },
        methods: {
            submit_userinfo() {
                // console.log('avl',this.avatar_url);
                // let param = new URLSearchParams();
                // param.append('nickname', this.user.nick_name);
                // param.append('sex', this.user.format_gender);
                // param.append('select_avatar_src', this.avatar_url || '');
                let param = {
                    nickname: this.user.nick_name,
                    sex: this.user.format_gender,
                    select_avatar_src: this.avatar_url || '',
                };
                this.$axios.post(
                    this.$host_header + '/mine/',
                    param,
                );
                alert('更新资料成功!')
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        padding-left: 7vw;
        padding-right: 7vw;
        margin-right: 7vh;
        padding-top: 2vh;
        width: 100%;
    }

    .indent_0 {
        margin-left: 1rem;
    }

    .indent_1 {
        margin-left: 2rem;
    }

    .form-group {
        margin-bottom: 1rem;

        & > label {
            display: inline-block;
            margin-bottom: .5rem;
        }
    }

    .change_avater {
        margin-top: .2rem;
    }

</style>