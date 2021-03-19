<template>
    <div class="root-container">
        <div class="sidebar-container column">
            <div class="top-bar parent">
                <div class="top-bar-child">
                    <div class="row flex-between sign-in-line theme-padding-l-r">
                        <div class="row flex-center">
                            <i class="iconfont icon-daka"></i>
                            <span class="sign-in-tip">今天还没有打卡哦</span>
                        </div>
                        <i @click="$emit('back', 1)" class="iconfont icon-chahao"></i>
                    </div>

                    <div class="userinfo row flex-between theme-padding-l-r">
                        <div>
                            <div v-if="me" class="row flex-center">
                                <div class="avatar" :style='`background-image: url("${me.avatar}")`'></div>
                                <div class="column info-lines">
                                    <span v-text="me.name"></span>
                                    <div class="level-icons">
                                        <i class="iconfont icon-taiyang"></i>
                                        <i class="iconfont icon-taiyang"></i>
                                        <i class="iconfont icon-taiyang"></i>
                                        <i class="iconfont icon-yueliang"></i>
                                        <i class="iconfont icon-yueliang"></i>
                                        <i class="iconfont icon-xingxing"></i>
                                    </div>
                                    <div class="signature row flex-ac">
                                        <i class="iconfont icon-gexingqianmingbianji"></i>
                                        <span class="middle-small-font" v-text="me.signature"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <i class="iconfont icon-erweima qr-icon"></i>
                    </div>
                </div>
            </div>

            <better-scroll class="flex-open-up" :scrollbar="false">
                <div class="functions">
                    <press_shandow @click.native="e.func" :class="`row flex-between function theme-padding-l-r-parent ${e.clickable ? 'pointer': ''}`"
                                   v-for="(e,i) in functionList" :key="i">
                        <div class="row flex-center">
                            <i :class="`iconfont ${e.icon}`"></i>
                            <span class="func-name" v-text="e.name"></span>
                        </div>
                        <i class="iconfont icon-dayuhao"></i>
                    </press_shandow>

                </div>
            </better-scroll>


            <div class="row links theme-padding-l-r">
                <div :class="`column flex-center ${e.clickable ? 'pointer': ''}`" v-for="(e,i) in links" :key="i" @click="$router.push(e.link)">
                    <i :class="`iconfont ${e.iconClass}`"></i>
                    <span v-text="e.name" class="middle-small-font"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import betterScroll from "../views/betterScroll";
    import press_shandow from "../views/press_shandow";
    const {ipcRenderer, shell} = require('electron');

    export default {
        name: "sidebarInfo",
        components: {press_shandow, betterScroll},
        props: [
            "me"
        ],
        data() {
            return {
                functionList: [
                    {name: "开播了鹅", icon: "icon-kaibotixing", func: ()=>{}},
                    {name: "开通会员", icon: "icon-huiyuan", func: ()=>{}},
                    {name: "我的QQ钱包", icon: "icon-qianbao", func: ()=>{}},
                    {name: "我的个性装扮", icon: "icon-zhuangban", func: ()=>{}},
                    {name: "我的情侣空间", icon: "icon-aiqingqinglv", func: ()=>{}},
                    {name: "我的收藏", icon: "icon-wode_shoucang", func: ()=>{}},
                    {name: "我的相册", icon: "icon-xiangce", func: ()=>{}},
                    {name: "我的小游戏", icon: "icon-youxi", func: ()=>{}},
                    {name: "我的文件", icon: "icon-wenjian", func: this.openDwonloadDir, clickable: true,},
                    {name: "退出", icon: "icon-tuichu1", func: this.exit, clickable: true,},
                ],
                links: [
                    {iconClass: "icon-shezhi1", name: "设置", link: "/settings", clickable: true},
                    {iconClass: "icon-circle-fee-night", name: "夜间", link: "/"},
                    {iconClass: "icon-shouji", name: "886天", link: "/"},
                    {iconClass: "icon-daxue", name: "新安", link: "/"},
                ],
            }
        },
        methods:{
            exit(){
                ipcRenderer.send("close-main-window");
            },
            openDwonloadDir(){
                shell.openItem(this.$fileDownloadDir);
            }
        },
    }
</script>

<style scoped lang="scss">

    .iconfont {
        color: $icon-color;
    }

    .root-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .sidebar-container {
        margin-bottom: 1rem;
        height: 100%;

        .sign-in-line {
            .iconfont {
                font-size: 1.25rem;
            }
        }

        .sign-in-tip {
            margin-left: 1rem;
        }

        .userinfo {
            $height: 3.5rem;
            padding-top: 2rem;
            padding-bottom: 1.25rem;
            height: $height;

            .avatar {
                background-size: 100%;
                width: $height;
                height: $height;
                border-radius: 50%;
                border: white 2px solid;
                margin-right: .5rem;
            }

            > i {
                align-self: flex-start;
            }

            .signature {
                > .iconfont {
                    margin-right: 5px;
                }
            }

            .qr-icon {
                font-size: 1.25rem;
            }

            .level-icons {
                .iconfont {
                    color: #ffd121;
                }
            }

            .info-lines {
                > * {
                    margin: 1px;
                }
            }
        }

        .functions {
            margin-top: 2rem;
            flex: 1;

            .function {
                padding: .75rem 0;

                .func-name {
                    margin-left: 1rem;
                }

                .iconfont {
                    font-size: 1.4rem;
                }

                .iconfont.icon-dayuhao {
                    font-size: .7rem;
                }
            }
        }

        .links {
            margin-top: 1rem;
            align-items: center;

            > div {
                margin-right: 2rem;
            }


            .iconfont {
                font-size: 1.5rem;
                margin-bottom: 5px;
            }
        }
    }

    .top-bar {
        background-image: url('../assets/imgs/sidebar_bg.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: auto 100%;
        background-position-x: 90%;
        color: $theme-normal-font-color-white;

        i {
            color: $theme-normal-font-color-white;
        }

        .sign-in-line {
            .icon-daka {
                color: gray;
                /*font-size: 1.25rem;*/
            }
        }

        .top-bar-child {
            padding-top: 2rem;
            background-color: rgba(0, 0, 0, 0.3);
        }
    }
</style>