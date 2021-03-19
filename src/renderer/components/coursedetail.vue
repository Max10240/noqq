<template>
    <div class="container">
        <div class="contents">
            <div class="single_content" v-for="(e,i) in contents_list" :key="i">
                <div @click="toggle_expand(i)" :class="'content '+ (expand_status[i]?'expand':'')" v-text="e">
                </div>
                <div class="details" v-show="expand_status[i]">
                    <div :key="i1" v-for="(e1,i1) in courses_list[i]">
                        <i v-for="(e2,i2) in new Array(e1[0])" class="iconfont icon-xiaohongqi" :key="i2"></i>
                        {{e1[2]}}
                    </div>
                </div>
            </div>

        </div>
        <div class="numcode_elems" v-show="task_numcode.is_show_task_numcode">
            <img v-if="task_numcode.img_src" :src="task_numcode.img_src">
            <input type="text" class="theme_ipt" v-model="task_numcode.numcode" placeholder="验证码">
            <button type="button" @click="submit_numcode" class="theme_btn">提交该验证码
            </button>
        </div>
        <div class="contents actions">
            <button @click="passtask(i)" class="theme_btn" v-for="(e,i) in button_list" v-text="e" :key="i"></button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "coursedetail",
        data() {
            return {
                contents_list: ['全部课程', '未完成课程', '当前进度'],
                button_list: ['视频', '章节测试'],
                expand_status: [false, false, false],
                courses_list: [[], [], []],
                task_numcode: {
                    is_show_task_numcode: false,
                    img_src: '',
                    numcode: '',
                },
                chaox_keys: {},
                ws: null,
            }
        },
        methods: {
            toggle_expand(i) {
                this.expand_status.splice(i, 1, !this.expand_status[i]);
                if (i < 2 && this.expand_status[i]) {
                    // let params = new URLSearchParams();
                    // params.append('courseid', this.$route.query.id);
                    // params.append('todo_only', i);
                    let params = {
                        courseid: this.$route.query.id,
                        todo_only: i
                    };
                    this.$axios.post(
                        this.$host_header + '/chaox/getcoursetodolist/',
                        params,
                    )
                }
            },
            passtask(i) {
                // let params = new URLSearchParams();
                // params.append('courseid', this.$route.query.id);
                // params.append('task_kind', i);
                let params = {
                    courseid: this.$route.query.id,
                    task_kind: i,
                };
                this.$axios.post(
                    this.$host_header + '/chaox/passtask/',
                    params,
                ).then((res) => {
                    if (res.data.status !== 200) {
                        alert('已有任务在执行，请等待其执行完毕!若需强制终止该任务，返回课程列表页注销并重新登录.');
                        return;
                    }
                    if (i === 1) {
                        this.task_numcode.is_show_task_numcode = true;
                    }
                    this.expand_status.splice(2, 1, true);
                });

            },
            submit_numcode() {
                if (!this.task_numcode.numcode) return;
                // let params = new URLSearchParams();
                // params.append('key', this.chaox_keys.key_pass_test);
                // params.append('value', this.task_numcode.numcode);
                let params = {
                    key: this.chaox_keys.key_pass_test,
                    value: this.task_numcode.numcode,
                };
                this.$axios.post(
                    this.$host_header + '/chaox/submitkv/',
                    params,
                );
                this.task_numcode.numcode = '';
            }
        },
        mounted() {
            const chaox_keys = JSON.parse(localStorage.getItem('chaox_keys'));
            this.chaox_keys = chaox_keys;
            const chatSocket = new WebSocket(
                'ws://'
                + window.location.host
                + this.$host_header
                + '/ws/client/'
            );
            this.ws = chatSocket;
            chatSocket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                if (data['key'] === chaox_keys.key_output_pass_video || data['key'] === chaox_keys.key_output_pass_test) {
                    let value = data['value'];
                    if (value === null) return;
                    if (value === 'STOP') {
                        if (data['key'] === chaox_keys.key_output_pass_test) {
                            this.task_numcode.is_show_task_numcode = false;
                        }
                        this.courses_list[2].push([0, null, '任务已完成!']);
                    } else if (value === 'ERROR') {
                        this.task_numcode.is_show_task_numcode = false;
                        this.courses_list[2].push([0, null, '未知错误，任务已中断.']);
                    } else {
                        this.courses_list[2].push([0, null, value]);
                    }
                } else if (data['key'] === chaox_keys.key_pass_test) {
                    let value = data['value'];
                    if (value === null) return;
                    this.task_numcode.img_src = this.$host_header + '/' + value + '?ts=' + new Date().getTime();
                }
                else if(data.kind === '2'){
                    this.courses_list.splice(data.i, 1, data.list);
                    console.log('is 2')
                }
            }
        },
        beforeDestroy() {
            this.ws.close();
        }
    }
</script>

<style scoped lang="scss">
    .container {
        $normal_text_color: #DF4615;
        $details_bg_color: #e4e4e4;

        width: 100%;
        margin: 2rem 0;

        > .contents {
            &.actions {
                margin: 2rem 3rem;
                margin-top: 5rem;
            }

            > * {
                color: $normal_text_color;
            }

            display: flex;
            flex-direction: column;

            .content {
                background-color: $theme_color;
                font-weight: bold;
                height: 3rem;
                line-height: 3rem;
                margin: .3rem 3rem;
                transition: all 0.3s ease 0s;
                text-indent: 2rem;
                position: relative;

                &.expand {
                    margin-left: 1rem;
                    background-color: $normal_text_color;
                    color: $theme_color;

                    &:before {
                        border-left-color: $normal_text_color;
                    }
                }

                &:before {
                    transition: all 0.3s ease 0s;
                    content: "";
                    border-left: 24px solid $theme_color;
                    border-top: 24px solid transparent;
                    border-bottom: 24px solid transparent;
                    position: absolute;
                    top: 0;
                    right: -24px;
                }
            }

            .details {
                background-color: $details_bg_color;
                margin: .3rem 2rem;
                color: $theme_deep_color;
                font-size: .9rem;
                transition: all 0.3s ease 0s;

                > div {
                    margin: 2px 0;
                }
            }

            button {
                margin: .3rem 1rem;
            }
        }

        .numcode_elems {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            > img {
                width: 60%;
                padding-bottom: 10px
            }

            > button {
                margin-top: 10px;
                width: 40%;
            }

            > input {
                width: 60%;
            }
        }

    }
</style>