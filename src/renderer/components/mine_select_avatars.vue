<template>
    <div style="height:100%">
        <div style="height: 2rem">
            <router-link tag="i" class="iconfont icon-cuohao myfont"
                         style="color: red;float: left"
                         to="mine_infos"></router-link>
            <i class="iconfont icon-correct-1-mini myfont" id="submit"
               :style="'color: blue;float: right;opacity: '+(select_img_obj.e?'1':'.3')"
               @click="update_avatar_url"></i>
        </div>
        <div class="img_list" id="img_list">
            <div v-for="(e,i) in imgs_src" :key="i"
                 :class="'single_img '+(select_img_obj.i===i?'checked':'')"
                 @click="check_this({e,i})">
                <img :src="e">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "mine_select_avatars",
        methods: {
            update_avatar_url() {
                if(!this.select_img_obj.e) return;
                this.$emit('update_avatar_url', this.select_img_obj.e);
                this.$router.push('mine_infos')
            },
            check_this(obj) {
                this.select_img_obj = obj;
            }
        },
        data() {
            return {
                imgs_src: [
                    'https://iconfont.alicdn.com/t/e332943a-3ed4-46ca-80fb-585bff2a7b9b.png', 'https://iconfont.alicdn.com/t/c1e3794b-3560-4835-9712-c40853fd21a5.png', 'https://iconfont.alicdn.com/t/d7dacf5c-aaa7-4e16-89ff-714b862a664c.png', 'https://iconfont.alicdn.com/t/9e76aaf1-a9f0-43a5-b99a-efbbcbbacda8.png', 'https://iconfont.alicdn.com/t/52f29a13-86ec-4391-a0e0-891584b0a725.png', 'https://iconfont.alicdn.com/t/9cf3d686-4d1e-4e4b-8b36-11c45e7eaaaf.png', 'https://iconfont.alicdn.com/t/9d115905-9bce-48d4-ac14-f4835185fc9b.png', 'https://iconfont.alicdn.com/t/bd8bfa38-cea3-4962-b0df-e8c5a885e69d.png', 'https://iconfont.alicdn.com/t/adfbc05b-5692-4c27-a0bf-13f6fecfdabe.png', 'https://iconfont.alicdn.com/t/791e6498-5a1c-46f2-96c4-405b28f615ac.png', 'https://iconfont.alicdn.com/t/2affe7cb-c6fa-468d-a210-9d26ddb5e241.png', 'https://iconfont.alicdn.com/t/a505beb7-a915-46e7-9e55-fde5236e36ce.png', 'https://iconfont.alicdn.com/t/12f709c2-dd7a-4afe-815e-f0030660c9ba.png', 'https://iconfont.alicdn.com/t/1534d585-d2b6-4b76-a63a-bdf627cf81f9.png', 'https://iconfont.alicdn.com/t/28bb422c-550b-42e1-84e3-4030303347f9.png', 'https://iconfont.alicdn.com/t/52524ce2-5406-4abf-8b45-b09b81e9a352.png', 'https://iconfont.alicdn.com/t/925c3c45-0461-4b14-a5c6-c93041f1d9b0.png', 'https://iconfont.alicdn.com/t/5a1b220e-d501-42d1-a7b4-838cac8a4369.png', 'https://iconfont.alicdn.com/t/3aee8e80-04a9-4ba2-84d5-19ccc76a7ba5.png', 'https://iconfont.alicdn.com/t/ec61bf3c-ae98-423b-8a34-9d3e2c1a79ab.png', 'https://iconfont.alicdn.com/t/081e4db4-323d-4eea-b97f-c4f77800283d.png', 'https://iconfont.alicdn.com/t/78754b86-c4ea-4314-9451-9a7bd269dea5.png', 'https://iconfont.alicdn.com/t/65f6d0ef-a86d-49d8-9142-9db277363ac2.png', 'https://iconfont.alicdn.com/t/5108c192-ddaf-4935-99e7-f5846b4e9376.png', 'https://iconfont.alicdn.com/t/138fb074-580d-4fa2-9f1e-77f7324056ad.png',
                    "https://iconfont.alicdn.com/t/9d79fc67-6f0d-4af2-90e7-ce50ef4404b7.png", "https://iconfont.alicdn.com/t/58c8f739-bbd7-4831-ae22-c877489d2cbc.png", "https://iconfont.alicdn.com/t/3d2af5c1-f86b-4251-bc22-55a0c530ee76.png", "https://iconfont.alicdn.com/t/d83dcf5a-c98a-42b4-91f6-ddcdbe9b0fec.png", "https://iconfont.alicdn.com/t/e4e91b10-7ccd-487b-a93f-04e949071b11.png", "https://iconfont.alicdn.com/t/8c8b71ba-e558-4f37-9ae0-0444c92e0797.png", "https://iconfont.alicdn.com/t/43f13cdf-39c8-4053-affd-b2d3e75b1e0e.png", "https://iconfont.alicdn.com/t/46a0f2e1-0820-4c00-a20f-c9ea1cbb50f7.png", "https://iconfont.alicdn.com/t/785b9ad4-2bf4-4eeb-bb32-1226dfc51a69.png", "https://iconfont.alicdn.com/t/8f90b878-560b-4f85-a183-e688fa283c42.png", "https://iconfont.alicdn.com/t/a413865c-38fb-472c-8760-ecfeb8d7c044.png", "https://iconfont.alicdn.com/t/a7b2c214-9c60-4efc-8229-939d9d2c8c71.png", "https://iconfont.alicdn.com/t/bdf396ff-e5a1-4765-8910-f7bbf028cbfb.png", "https://iconfont.alicdn.com/t/8fcee187-e9fa-49fc-aac1-03fb2b7c8337.png", "https://iconfont.alicdn.com/t/0bd5e861-ffc4-4647-a810-699de21ca955.png", "https://iconfont.alicdn.com/t/19a37e7a-1e0a-4531-a3fe-bcb221254b02.png", "https://iconfont.alicdn.com/t/b8d2ef1e-bc56-4bf4-91da-033a852c6433.png", "https://iconfont.alicdn.com/t/f563fc70-8594-496f-a3e0-4121c382979c.png", "https://iconfont.alicdn.com/t/ec4ac679-a694-4f70-a14d-2b5b16f075c9.png", "https://iconfont.alicdn.com/t/b5d688c9-ee4e-49c8-bcc0-2200d09e44f0.png", "https://iconfont.alicdn.com/t/551c7fc9-5231-4aae-b8d6-afd7af4013e3.png", "https://iconfont.alicdn.com/t/38f1543b-54f1-4ec8-b036-b26da635dcb9.png", "https://iconfont.alicdn.com/t/050f7b00-4378-4bcd-a6a2-d03265303264.png", "https://iconfont.alicdn.com/t/27193d5a-c653-44dd-a90a-48117da51eb8.png",
                    "https://iconfont.alicdn.com/t/2b993c0a-bbce-4f31-915f-2f09acb9315c.png", "https://iconfont.alicdn.com/t/b219af17-ee89-4bad-b48a-7d6c1147009d.png", "https://iconfont.alicdn.com/t/65b33553-2f80-491d-91b2-a7f6f25565f3.png", "https://iconfont.alicdn.com/t/492f18c6-f778-4c6c-bad1-9073cd3e3e01.png", "https://iconfont.alicdn.com/t/17c5c22d-c563-4b95-b8ae-f4c92d854a67.png", "https://iconfont.alicdn.com/t/3070fe5b-d357-47b3-b658-19cc0cb5ffe2.png", "https://iconfont.alicdn.com/t/183d3345-5c80-4d51-9c6c-df75ef5c01c9.png", "https://iconfont.alicdn.com/t/14ca7a41-58bb-40e5-8f7d-208ff1905e90.png", "https://iconfont.alicdn.com/t/07b00f1c-182a-4e83-8454-d15cf2742b49.png", "https://iconfont.alicdn.com/t/23eb9a3a-683f-42ab-83aa-565c9c574765.png", "https://iconfont.alicdn.com/t/6eaf0940-6055-4515-9c7b-d12d1191f39b.png", "https://iconfont.alicdn.com/t/86ba96c0-ac0c-401c-ab12-f6a3f4c3c89d.png", "https://iconfont.alicdn.com/t/984338e3-1bdd-4203-acdd-0c141eaca872.png", "https://iconfont.alicdn.com/t/73350a49-9f0c-4387-b396-7ba6e26f60bc.png", "https://iconfont.alicdn.com/t/6763f6d3-2e75-4923-99f6-a1d1de2541de.png", "https://iconfont.alicdn.com/t/6ddc163d-d1bf-4c76-9d0f-b1eb3632a99f.png",
                    "https://iconfont.alicdn.com/t/428c11de-464b-476c-976c-a794ad8ac300.png", "https://iconfont.alicdn.com/t/2be0c58b-73b5-44cd-8907-f2eb434c57f2.png", "https://iconfont.alicdn.com/t/0c1ea0a7-2c12-4836-b95c-eb03c9f8d4b6.png", "https://iconfont.alicdn.com/t/0f7cc729-d748-443d-a5ed-9c5f8aeee9ce.png", "https://iconfont.alicdn.com/t/f0e188cb-1b48-4a96-ac8d-b25ed2c862d8.png", "https://iconfont.alicdn.com/t/b23486f3-6de0-4acb-ada5-f8d16f8c6642.png", "https://iconfont.alicdn.com/t/2ec921d8-1b92-46b1-9eb2-68b7d4f2561c.png", "https://iconfont.alicdn.com/t/febd1f4b-e27b-49e2-a452-efbe64f123fd.png", "https://iconfont.alicdn.com/t/6842f6a4-b473-4d3f-b8c5-f16b23ad8429.png", "https://iconfont.alicdn.com/t/53f19ffb-303f-4fbe-af9c-8a9872e0f42a.png", "https://iconfont.alicdn.com/t/288a64a5-3e94-400d-9502-81cbae6d952f.png", "https://iconfont.alicdn.com/t/1309ce94-6a0e-4e39-ac80-e2d96863c1cc.png",

                ],
                select_img_obj: {},
            }
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
        --h: 40vw;
        --max_h: 5rem;
        max-height: var(--max_h);
        max-width: var(--max_h);
        height: var(--h);
        width: var(--h);
        position: relative;

        img {
            height: 100%;
            width: 100%;
        }
    }


    .checked {
        border-radius: 50%;
        background-color: #0f6848;

        img {
            height: 70%;
            width: 70%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .myfont {
        font-size: 2rem;
    }
</style>