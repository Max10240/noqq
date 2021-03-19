<template>
    <div>
        <div v-if="source.isIndex" v-text="source.index" class="index small-font"></div>

        <press_shandow v-else-if="source.v">
            <person :user-id="source.v" :link="`/chatroom/0/${source.v}`"></person>
        </press_shandow>

        <press_shandow v-else-if="source.link" class="p-l-r">
            <person :user-id="source.userId" :type="source.type" :link="source.link"></person>
        </press_shandow>
    </div>
</template>

<script>
    import person from "../views/person";
    import press_shandow from "../views/press_shandow";

    export default {
        name: "single_person_item",
        components: {person, press_shandow},
        props: {
            source: {
                type: Object,
            }
        }
    }
</script>

<style scoped lang="scss">
    .p-l-r {
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .index{
        color: $theme_deep_color;
    }
</style>