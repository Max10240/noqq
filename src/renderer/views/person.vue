<template>
    <router-link :to="link" tag="div" class="row person-container" v-if="currentUser && link">
        <div class="avatar"
             :style='`background-image: url("${currentUser.avatar}")`'></div>
        <div class="column">
            <div v-text="currentUser.name"></div>
            <div class="row middle-small-font tip-font-color" v-if="type == 0">
                <div class="state" v-text="`[${currentUser.stateId || '手机在线'}]`"></div>
                <div v-text="currentUser.signature"></div>
            </div>
        </div>
    </router-link>
</template>

<script>
    import store from "../store";
    export default {
        name: "person",
        // props: ["userId", "link", "type"],
        props: {
            userId: [String, Number],
            link: String,
            type: {
                default: 0,
                type: [String, Number],
            }
        },
        computed: {
            currentUser() {
                // console.log('this is', this.userId, this.type, this);
                return store.state.users.get(this.userId, this.type);
            },
        }
    }
</script>

<style scoped lang="scss">
    $row-height: 2.5rem;

    .person-container {
        padding: .5rem 0;
        height: $row-height;
        align-items: center;
    }

    .avatar {
        border-radius: 50%;
        width: $row-height;
        height: $row-height;
        background-size: 100%;
        margin-right: .5rem;
    }

    .state {
        margin-right: .2rem;
    }
</style>