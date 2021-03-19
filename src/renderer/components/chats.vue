<template>
    <div class="root_div">
        <div>
            <div style="margin-top: .75rem; height: 2vh;">
                <span style="float: left;margin-left: .5rem">{{ comment_list.length }}条贴</span>
            </div>
        </div>
        <div id="comments">
            <div class="comment_div" v-for="e in comment_list" :key="e[5]">
                <a><img :src="e[1]"></a>
                <div>
                    <div>
                        <span style="word-break: break-all">{{ e[0] }}&nbsp;&nbsp;&nbsp;{{ e[4] }}</span>
                    </div>
                    <div class="cmt_cnt">
                        {{ e[2] }}
                    </div>
                </div>
            </div>
        </div>
        <div class="submit_cmt">
            <input id="cmt_cnt" v-model="comment_cnt" type="text" class="theme_ipt" placeholder="你的想法...">
            <button class="theme_btn" @click="submit_cmt">提交</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "chats",
        data() {
            return {
                comment_cnt: '',
                comment_list: [],
            }
        },
        methods: {
            submit_cmt() {
                // let params = new URLSearchParams();
                // params.append('content', this.comment_cnt);
                let params = {
                    content: this.comment_cnt,
                };
                this.comment_cnt = '';
                this.$axios.post(
                    this.$host_header+'/chats/',
                    params,
                ).then(res=>{
                    this.comment_list.unshift(res.data.comment)
                });
            }
        },
        mounted() {
            this.$axios.post(
                this.$host_header + '/commentlist/'
            ).then(res => {
                this.comment_list = res.data.list;
            })
        }
    }
</script>

<style scoped lang="scss">
    .img_list {
        display: flex;
        flex-wrap: wrap;
        margin: 0.5rem;
        justify-content: space-between;
    }

    .single_img {
        --h: 30vw;
        --min_h: 5rem;
        --max_h: 10rem;
        max-width: var(--max_h);
        min-width: var(--min_h);
        width: var(--h);

        a {
            display: inline-block;
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 100%;
        }

        img {
            position: absolute;
            border-radius: 5%;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        > div {
            text-align: center;
            padding: .5rem 0;
        }

    }


    .func_box {
        display: flex;
        width: 100%;
        margin: 0 auto;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .single_func {
        flex: 1;
        text-align: center;
        padding: 5px;
        width: 33.3%;
        min-width: 33.3%;
        max-width: 33.3%;
    }

    .header_title {
        font-size: 1.3rem;
        color: #333;
        padding-left: 2%;
        line-height: 100%;
    }

    .border_div {
        border-bottom: 0.02rem solid rgb(223, 223, 223);
    }

    .comment_div {
        padding: 20px 20px;
        display: flex;

        .cmt_cnt {
            border-top: 0.02rem solid #000000e0;
            padding-top: .5rem;
        }

        > a {
            > img {
                border-radius: 50%;
                width: 2.07rem;
                height: 2.07rem;
                margin: 25% 0;
            }
        }

        > div {
            display: flex;
            flex-direction: column;
            position: relative;
            margin-left: 0.27rem;
            margin-right: 5%;
        }
    }


    .root_div {
        display: flex;
        flex-direction: column;
        height: 100%;

        > div {
            width: 100vw;
        }
    }


    #comments {
        flex: 12;
        overflow-y: scroll;

        > .comment_div:nth-child(odd) {
            background-color: #fff;
        }
    }

    .submit_cmt {
        display: flex;
        max-width: 100vw;
        margin: .5rem 0;
        height: 2rem;

        > button {
            margin: 0 .5rem 0 1rem;
            background-color: #FFD100;

            :focus {
                box-shadow: 0 0 0 0.2rem #f3dd7c;
            }
        }

        > input {
            margin-left: .5rem;
        }
    }


    .user_avater {
        border-radius: 50%;
        width: 4rem;
        height: 4rem;
        margin: 25% 0;
    }


    .courses_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin: .5rem 0.5rem 1rem 0;
    }
</style>