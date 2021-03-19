<template>
    <div>
        <div class="courses_header">
            <span class="header_title fa-long-arrow-alt-down">选修课程:</span>
            <router-link to="login"><i class="iconfont icon-zhuxiao"></i><span>注销</span></router-link>
        </div>
        <div class="img_list">
            <div class="single_img" v-for="(v,k) in data" :key="k">
                <router-link :to="'coursedetail?id='+k" >
                    <img :src="v[3]">
                </router-link>
                <div style="padding-top: 2px" v-text="v[0]"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "chaox_courses",
        data() {
            return {
                data: [],
            }
        },
        mounted() {
            this.$axios.post(
                this.$host_header + '/chaox/ajaxcourses/',
            ).then(res => {
                this.data = res.data.data;
                // console.log(this.data);
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
        word-break: keep-all;
    }

    .border_div {
        border-bottom: 0.02rem solid rgb(223, 223, 223);
    }

    /*.comment_div {*/
    /*    padding: 20px 20px;*/
    /*    display: flex;*/

    /*    &:nth-child(odd) {*/
    /*        background-color: #fff;*/
    /*    }*/
    /*}*/

    /*.root_div {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/
    /*    height: 100vh;*/
    /*}*/

    /*.root_div > div {*/
    /*    width: 100vw;*/
    /*}*/

    /*#comments {*/
    /*    flex: 12;*/
    /*    overflow-y: scroll;*/
    /*}*/

    /*.submit_cmt {*/
    /*    display: flex;*/
    /*    max-width: 100vw;*/
    /*    margin: .5rem 0;*/
    /*    height: 2rem;*/

    /*    > button {*/
    /*        margin: 0 .5rem 0 1rem;*/
    /*        background-color: #FFD100;*/

    /*        :focus {*/
    /*            box-shadow: 0 0 0 0.2rem #f3dd7c;*/
    /*        }*/
    /*    }*/

    /*    > input {*/
    /*        margin-left: .5rem;*/
    /*    }*/
    /*}*/


    /*.comment_div .cmt_cnt {*/
    /*    border-top: 0.02rem solid #000000e0;*/
    /*    padding-top: .5rem;*/
    /*}*/

    /*.comment_div > a > img {*/
    /*    border-radius: 50%;*/
    /*    width: 2.07rem;*/
    /*    height: 2.07rem;*/
    /*    margin: 25% 0;*/
    /*}*/

    /*.user_avater {*/
    /*    border-radius: 50%;*/
    /*    width: 4rem;*/
    /*    height: 4rem;*/
    /*    margin: 25% 0;*/
    /*}*/

    /*.comment_div > div {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/
    /*    position: relative;*/
    /*    margin-left: 0.27rem;*/
    /*    margin-right: 5%;*/
    /*}*/

    .courses_header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin: .5rem 0.5rem 1rem 0;
    }
</style>