<template>
    <groups_base :group-list="groupList"></groups_base>
<!--    <div :group-list="groupList"></div>-->
<!--    <div>Loaded</div>-->
</template>

<script>
    import groups_base from "./groups_base";

    export default {
        name: "groupchats",
        components: {groups_base},
        data() {
            return {
                groupList: [],
            }
        },
        mounted() {
            function getLink(id) {
                return `/chatroom/1/${id}`
            }

            this.$axios.get("/get_group_list").then(res => {
                let groupByNames = ['我加入的群聊', '我管理的群聊', '我创建的群聊', '置顶的群聊'];
                let groupList = groupByNames.map(e => {
                    return {name: e, elems: [], type: 1}
                });
                res.data.data.forEach(e => {
                    if (e.isTop) {
                        groupList[3].elems.push(e.group_id)
                    }
                    groupList[0].elems.push(e.group_id);
                });
                this.groupList = groupList.map(e => {
                    e.rightBar = e.elems.length;
                    return e
                }).map(e => {
                    e.elems = e.elems.map(e1 => {
                        return {userId: e1, link: getLink(e1), type: 1}
                    });
                    return e;
                });
            })
        }
    }
</script>

<style scoped>

</style>