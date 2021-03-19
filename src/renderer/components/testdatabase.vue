<template>
    <div class="container">
        <form id="data_form">
            <textarea id="question_body" placeholder="粘贴题目至此" v-model="question"></textarea>
            <button type="button" @click="search_question">搜索</button>
        </form>
        <div id="answer_displaybar" v-text="answer"></div>
    </div>
</template>

<script>
    export default {
        name: "testdatabase",
        methods: {
            search_question() {
                if (!this.question) return;
                // let params = new URLSearchParams();
                // params.append('question', this.question);
                let params = {
                    question: this.question,
                };
                this.$axios.post(
                    this.$host_header + '/chaox/getquestionanswer/',
                    params
                );
                //     .then(res => {
                //     let answer = res.data.answer;
                //     this.answer = answer === null ? '未找到答案' : answer;
                // });
                this.question = '';
                this.answer = '';
            }
        },
        data() {
            return {
                question: '',
                answer: '答案在这',
                ws: null,
            }
        },
        mounted() {
            // window.myVue = this;
            const chatSocket = new WebSocket(
                'ws://'
                + window.location.host
                + this.$host_header
                + '/ws/client/testdatabase/'
            );
            this.ws = chatSocket;
            chatSocket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                let answer = data.answer;
                this.answer = answer === null ? '未找到答案' : answer;
            }
        },
        beforeDestroy() {
            this.ws.close();
        }
    }
</script>

<style scoped lang="scss">
    .container {
        margin: 1rem;
        width: 100%;
    }

    #data_form {
        display: flex;
        align-items: flex-end;
        justify-content: center;

        & > textarea {
            flex: 1;
            height: 4rem;
            border: none;
            resize: none;
            margin-right: 1rem;
            padding: .2rem 0 0 .5rem;

            &:focus {
                outline-color: #FFD100;
            }
        }

        & > button {
            color: black;
            background-color: #FFD100;
            border-color: orange;
            border-width: 0;
            font-weight: 300 !important;
            font-size: 1rem;
            line-height: 2rem;
            border-radius: 0.25rem;
            width: 3.5rem;

            &:focus {
                outline: none;
            }
        }
    }

    #answer_displaybar {
        background-color: white;
        margin-top: 5rem;
        height: 6rem;
        padding: .5rem 0 0 1rem;
    }
</style>