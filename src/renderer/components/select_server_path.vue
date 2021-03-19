<template>
    <theme_base>
        <div slot="h-middle">选择启动文件</div>
        <div @click="$router.push('/').catch()" v-if="selectedPath" slot="h-right">完成</div>
        <div slot="body">
            <better-scroll :scrollbar="false" class="cnt-bs" slot="body">
                <div class="theme-padding-l-r-parent">
                    <press_shandow @click.native="selectDataPath" class="row flex-between single-option theme-bg-white">
                        <div>选择启动文件</div>
                        <i class="iconfont icon-dayuhao tip-font-color middle-small-font"></i>
                    </press_shandow>

                </div>
            </better-scroll>
        </div>
    </theme_base>
</template>

<script>
    import betterScroll from "../views/betterScroll";
    import theme_base from "./theme_base";
    import press_shandow from "../views/press_shandow";
    import json from "../assets/js/json";

    const path = require('path');

    export default {
        name: "select_server_path",
        components: {theme_base, betterScroll, press_shandow},
        methods: {
            selectDataPath() {
                this.$store.commit("openDialog", {
                    fileId: `selectServerPath`,
                    properties: ['openFile', 'multiSelections'],
                    filters: [{
                        name: "启动文件", extensions: ['qqserver'],
                    }],
                    onFinish: (data) => {
                        if (data.filePaths) {
                            window.spPath = path;
                            let p = data.filePaths[0];
                            //console.log(data);
                            json.dump(json.constKeys.serverDataPath, path.dirname(p));
                            this.selectedPath = true;
                        }
                    }
                })
            }
        },
        data() {
            return {
                selectedPath: false,
            }
        }
    }
</script>

<style scoped lang="scss">
    .cnt-bs {
        margin-top: .75rem;
    }

    .single-option {
        height: 3.5rem;
        border-bottom: 1px $theme-bg_deeper_light_gray solid;
    }
</style>