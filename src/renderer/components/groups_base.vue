<template>
    <div class="cnt-container">
        <div :class="`group ${expandList[i]?'expand':''}`" v-for="(e,i) in groupList" :key="i">
            <press_shandow class="group-toggle row flex-between theme-padding-l-r" @click.native="toggleThis(i)">
                <div class="row flex-center">
                    <div class="iconfont icon-zhankai triangle"></div>
                    <span v-text="e.name"></span>
                </div>
                <div class="middle-small-font tip-font-color" v-text="e.rightBar"></div>
            </press_shandow>
            <div class="group-body">
                <virtual-list style="max-height: 50vh; overflow-y: auto;"
                      :data-key="'link'"
                      :data-sources="e.elems"
                      :data-component="itemComponent"
                />
<!--                <press_shandow class="p-l-r" v-for="e1 in e.elems" :key="e1.link">-->
<!--                    <person :userId="e1.userId" :type="e.type" :link="e1.link">-->
<!--                    </person>-->
<!--                </press_shandow>-->
            </div>
        </div>
    </div>
</template>

<script>
    // import person from "../views/person";
    import press_shandow from "../views/press_shandow";
    import VirtualList from 'vue-virtual-scroll-list';
    import single_person_item from "../views/single_person_item";

    export default {
        name: "groups_base",
        props: ['groupList'],
        components: {'virtual-list': VirtualList, press_shandow},
        data() {
            return {
                expandList: [],
                itemComponent: single_person_item,
            }
        },
        methods: {
            toggleThis(index) {
                let gl = this.groupList.length;
                if (this.expandList.length !== gl) {
                    this.expandList = Array(gl).fill(false)
                }
                this.expandList.splice(index, 1, !this.expandList[index]);
                this.$nextTick(() => {
                    this.$stt.updateContactHeight();
                });
            }
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    .cnt-container {
        margin-top: .75rem;
    }

    .group {
        .group-toggle {
            padding-top: .5rem;
            padding-bottom: .5rem;
        }

        &.expand {
            .group-body {
                display: block;
            }

            .triangle {
                transform: rotate(90deg);
            }
        }

        .group-body {
            display: none;
        }

        .triangle {
            margin-right: .2rem;
            color: lightgray;
            font-size: $small-font-size;
            line-height: 1rem;
        }
    }

</style>