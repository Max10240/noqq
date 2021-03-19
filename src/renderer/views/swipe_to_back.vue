<template>
    <div @swipe="handleSwipe">
        <slot></slot>
    </div>
</template>

<script>
    import AnyTouch from 'any-touch';

    export default {
        name: "swipe_to_back",
        props: {
            target: {
                type: [String],
                default: null,
            },
        },
        mounted() {
            const at = new AnyTouch(this.$el, {
                preventDefault: false,
            });
            this.$on('hook:destroyed', () => {
                at.destroy()
            });
        },
        methods: {
            handleSwipe: function (event) {
                if (event.direction === "right" && this.actionCd) {
                    if (this.target === null) {
                        this.$router.go(-1);
                    } else {
                        this.$router.push(this.target).catch(() => {
                        })
                    }
                    this.actionCd = false;
                    setTimeout(() => this.actionCd = true, this.cdTime);
                }
            },
        },
        data() {
            return {
                actionCd: true,
                cdTime: 200,
            }
        }
    }
</script>

<style scoped>

</style>