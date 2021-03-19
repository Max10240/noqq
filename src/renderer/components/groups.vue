<template>
    <groups_base :groupList="groupList"></groups_base>
</template>

<script>
    import groups_base from "./groups_base";

    export default {
        name: "groups",
        components: {groups_base},
        data() {
            return {
                // groupList: [],
            }
        },
        mounted() {
            // let getLink = id => `/chatroom/0/${id}`;
            // function getLink(id) {
            //     return `/chatroom/0/${id}`
            // }

            // setTimeout(() => {
            //     this.groupList = [
            //         {
            //             name: "特别关心", elems: [this.$store.state.selfUserId], rightBar: "0/0"
            //         },
            //         {
            //             name: "分组一", elems: [9], rightBar: "2/4"
            //         },
            //         {
            //             name: "分组2", elems: [3, 7], rightBar: "2/50"
            //         },
            //         {
            //             name: "Group3", elems: [7, 9, 10, 12], rightBar: "2/122"
            //         },
            //     ].map(e => {
            //         e.elems = e.elems.map(e1 => {
            //             return {userId: e1, link: getLink(e1)}
            //         });
            //         return e;
            //     });
            //     console.log('groupList', this.groupList);
            //     this.$nextTick(() => {
            //         this.$stt.updateContactHeight()
            //     });
            // }, 1000);
        },
        computed: {
            groupList() {
                if (this.$store.state.selfUserId === null) return [];
                let return_list = [
                    {
                        name: "特别关心", elems: [this.$store.state.selfUserId], rightBar: "1/1"
                    },
                    {
                        name: "我的好友", elems: this.$store.state.friendIds, rightBar: `${this.$store.state.friendIds.length}/${this.$store.state.friendIds.length}`
                    },
                ].map(e => {
                    e.elems = e.elems.map(e1 => {
                        return {userId: e1, link: `/chatroom/0/${e1}`}
                    });
                    return e;
                });
                this.$nextTick(() => {
                    this.$stt.updateContactHeight()
                });
                return return_list
            }
        }
    }
</script>

<style scoped>

</style>