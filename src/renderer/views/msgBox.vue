<template>
    <van-popover
            v-model="showPopover"
            theme="dark"
            placement="top"
            trigger="click.right"
            :overlay="true"
            :class="`popover-root ${isMine ? 'flex-end' : ''}`"
            :actions="actions"
            @select="onSelect"
            @click.right.native="showPopover = !showPopover"
    >
        <van-grid
                clickable
                :border="false"
                column-num="5"
                style="width: 240px"
        >
            <van-grid-item
                    v-for="e in actions"
                    :key="e"
                    :text="e"
                    class="dark-item"
                    @click="handleAction(e)"
            />
        </van-grid>
        <template #reference>
            <div class="root">
                <div v-if="isMine">
                    <div class="row container" kind="mine">
                        <div class="column">
                            <div v-if="isGroup && me" v-text="`${me.name}`"
                                 class="middle-small-font tip-font-color name"></div>
                            <div class="msg parent " v-if="msgType === 0" ref="msgContent">
                                <div class="inline" v-for="(e,i) in text">
                                    <div v-html="e.text" class="inline clipable" v-if="e.type === 0"></div>
                                    <!--                            <div class="images" v-viewer="{movable: false}" v-else-if="e.type === 1">-->
                                    <!--                                <img :src="e.url" @load="handleImgLoaded(i)"-->
                                    <!--                                     :class="`${e.extendClass || ''}`"-->
                                    <!--                                >-->
                                    <!--                            </div>-->
                                    <img :src="e.url" @load="handleImgLoaded(i)"
                                         v-else-if="e.type === 1"
                                         :class="`${e.extendClass || ''}`"
                                         :preview="e.allowPreview ? '0' : false"
                                         @click="e.allowPreview ? previewImg([e.url], 0) : false"
                                    >
                                    <div v-text="`@${$store.state.users.get(e.qq_id) ? $store.state.users.get(e.qq_id).name : e.qq_id} `"
                                         v-else-if="e.type === 3"
                                         :class="`inline clipable isat ${e.extendClass || ''}`"></div>
                                </div>
                            </div>
                            <div v-else-if="msgType === 1">
                                <!--                        <img preview="0"  @load="handleImgLoaded" ref="msgImg"-->
                                <!--                             class="img-msg" :src="imgUrl">-->
                                <!--                                <div>Deprecated</div>-->
                                <img :src="imgUrl" @load="handleImgLoaded" ref="msgImg"
                                     class="img-msg"
                                     @click="previewImg([imgUrl], 0)"
                                >
                            </div>
                            <div @click="downloadFile()" :class="`msg parent msg-file`"
                                 v-else-if="msgType === 2">
                                <!--                        <video :src="data.body.url" @canplay="handleImgLoaded" style="height: 30vh"-->
                                <!--                               v-if="data.body.name.endsWith('.mp4')" onclick="this.play()" autobuffer></video>-->
                                <video-player class="video-player vjs-custom-skin"
                                              @canplay="handleImgLoaded"
                                              v-if="data.body.name.endsWith('.mp4')"
                                              ref="videoPlayer"
                                              :playsinline="true"
                                              :options="setVideoUrl((!onceDownload && !needDownload)? `file://${saveFilePath}` : data.body.url)">
                                </video-player>
                                <img preview="0" @load="handleImgLoaded" ref="msgImg"
                                     class="img-msg"
                                     :src="(!onceDownload && !needDownload)? `file://${saveFilePath}` : imgUrl"
                                     @click="previewImg([(!onceDownload && !needDownload)? `file://${saveFilePath}` : imgUrl], 0)"
                                     v-else-if="data.body.name.endsWith('.jpg') || data.body.name.endsWith('.png') || data.body.name.endsWith('.jpeg') || data.body.name.endsWith('.gif')">
                                <div :class="`row fill-row ${needDownload ? '' : 'disabled'}`">
                                    <div class="flex-open-up">
                                        <div class="flex-open-up" v-text="data.body.name"></div>
                                        <div class="small-font tip-font-color"
                                             v-text="$formatFileSize(data.body.size)"></div>
                                    </div>
                                    <img width="48px" height="48px" src="../assets/imgs/file.png">
                                </div>

                            </div>
                        </div>
                        <div class="avatar-parent pointer" @click="$router.push(`/person_info/0/${me.id}?transition=left`)">
                            <div v-if="me" class="avatar" :style='`background-image: url("${me.avatar}")`'></div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div class="row container">
                        <div class="avatar-parent pointer" @click="$router.push(`/person_info/0/${me.id}?transition=left`)">
                            <div v-if="me" class="avatar" :style='`background-image: url("${me.avatar}")`'></div>
                        </div>
                        <div class="column">
                            <div v-if="isGroup && me" v-text="`${me.name}`"
                                 class="middle-small-font tip-font-color name"></div>
                            <div class="msg parent " v-if="msgType === 0" ref="msgContent">
                                <div class="inline" v-for="(e,i) in text">
                                    <div v-html="e.text" class="inline clipable" v-if="e.type === 0"></div>
                                    <!--                            <div class="images" v-viewer="{movable: false}" v-else-if="e.type === 1">-->
                                    <!--                                <img :src="e.url" @load="handleImgLoaded(i)"-->
                                    <!--                                     :class="`${e.extendClass || ''}`"-->
                                    <!--                                >-->
                                    <!--                            </div>-->
                                    <img :src="e.url" @load="handleImgLoaded(i)"
                                         v-else-if="e.type === 1"
                                         :class="`${e.extendClass || ''}`"
                                         :preview="e.allowPreview ? '0' : false"
                                         @click="e.allowPreview ? previewImg([e.url], 0) : false"
                                    >
                                    <div v-text="`@${$store.state.users.get(e.qq_id) ? $store.state.users.get(e.qq_id).name : e.qq_id} `"
                                         v-else-if="e.type === 3"
                                         :class="`inline clipable isat ${e.extendClass || ''}`"></div>
                                </div>
                            </div>
                            <div v-else-if="msgType === 1">
                                <!--                        <img preview="0"  @load="handleImgLoaded" ref="msgImg"-->
                                <!--                             class="img-msg" :src="imgUrl">-->
                                <!--                                <div>Deprecated</div>-->
                                <img :src="imgUrl" @load="handleImgLoaded" ref="msgImg"
                                     class="img-msg"
                                     @click="previewImg([imgUrl], 0)"
                                >
                            </div>
                            <div @click="downloadFile()" :class="`msg parent msg-file`"
                                 v-else-if="msgType === 2">
                                <!--                        <video :src="data.body.url" @canplay="handleImgLoaded" style="height: 30vh"-->
                                <!--                               v-if="data.body.name.endsWith('.mp4')" onclick="this.play()" autobuffer></video>-->
                                <video-player class="video-player vjs-custom-skin"
                                              @canplay="handleImgLoaded"
                                              v-if="data.body.name.endsWith('.mp4')"
                                              ref="videoPlayer"
                                              :playsinline="true"
                                              :options="setVideoUrl((!onceDownload && !needDownload)? `file://${saveFilePath}` : data.body.url)">
                                </video-player>
                                <img preview="0" @load="handleImgLoaded" ref="msgImg"
                                     class="img-msg"
                                     :src="(!onceDownload && !needDownload)? `file://${saveFilePath}` : imgUrl"
                                     @click="previewImg([(!onceDownload && !needDownload)? `file://${saveFilePath}` : imgUrl], 0)"
                                     v-else-if="data.body.name.endsWith('.jpg') || data.body.name.endsWith('.png') || data.body.name.endsWith('.jpeg') || data.body.name.endsWith('.gif')">
                                <div :class="`row fill-row ${needDownload ? '' : 'disabled'}`">
                                    <div class="flex-open-up">
                                        <div class="flex-open-up" v-text="data.body.name"></div>
                                        <div class="small-font tip-font-color"
                                             v-text="$formatFileSize(data.body.size)"></div>
                                    </div>
                                    <img width="48px" height="48px" src="../assets/imgs/file.png">
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

    </van-popover>

</template>

<script>
    const app = require('electron').remote.app;
    const path = require('path');
    const fs = require('fs');
    const {shell, clipboard} = require('electron');
    import {ImagePreview} from "vant";

    import 'video.js/dist/video-js.css'
    import {videoPlayer} from 'vue-video-player'

    import {Toast} from 'vant';

    // import 'viewerjs/dist/viewer.css'
    export default {
        name: "msgBox",
        components: {
            videoPlayer
        },
        props: [
            "data",
        ],
        data() {
            return {
                imgLoaded: false,
                showPopover: false,
                actions: ['复制', '转发', '收藏', '回复', '多选', '删除', '代办', '截图'],
                onceDownload: false,
                textList: [],
                // judgedExists: false,
            }
        },
        computed: {
            me() {
                return this.stt.users.get(this.data.meta.fromId);
            },
            isMine() {
                return this.stt.selfUserId === this.data.meta.fromId;
            },
            isGroup() {
                return this.data.meta.toType === 1;
            },
            text() {
                if (this.data.meta.msgType !== 0) return;

                function escape(t) {
                    return t.replace(/ /g, "&nbsp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/\n/g, '<br>');
                }

                let msgList = this.data.body.text.match(/([^\[]+)|(\[CQ:.+?\])/g);
                if (!msgList) {
                    console.log(this.data.body.text, this.data);
                    msgList = ['[该消息无法显示]'];
                }

                for (let i = 0; i < msgList.length; i++) {
                    let ctt = msgList[i];
                    if (!ctt.startsWith('[CQ:')) {
                        msgList[i] = {type: 0, text: escape(ctt)};
                        this.textList.push(ctt);
                    } else if (ctt.startsWith('[CQ:image,')) {
                        let url = ctt.match(/url\=(.+?)(?=\])/)[0].slice(4);
                        msgList[i] = {type: 1, url, extendClass: 'img-msg block', allowPreview: true,};
                    } else if (ctt.startsWith("[CQ:face,")) {
                        let face_id = ctt.match(/id=(\d+)\]/)[1];
                        let url = `https://docs-v1.zhamao.xin/face/${face_id}.gif`;
                        msgList[i] = {type: 1, url, extendClass: 'qq-face'};
                    } else if (ctt.startsWith("[CQ:at,")) {
                        let qq_id = ctt.match(/qq=(.+)\]/)[1];
                        if (qq_id === 'all') {
                            msgList[i] = {type: 0, text: '@全体成员 '};
                        } else msgList[i] = {type: 3, qq_id, extendClass: 'at-msg'};
                        // this.textList.push(3);
                    } else if (ctt.startsWith("[CQ:reply,")) {
                        // let qq_id = ctt.match(/qq=(.+)\]/)[1];
                        msgList[i] = {type: 0, text: '[回复]:'};
                        // this.textList.push(3);
                    } else {
                        msgList[i] = {type: 0, text: escape(ctt)};
                        this.textList.push(ctt);
                    }
                }
                return msgList;

                let escapeText = this.data.body.text
                    .replace(/ /g, "&nbsp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\n/g, '<br>');
                escapeText = escapeText.replace(/\[CQ:image,.+?\]/g, function (str) {
                    let url = str.match(/url\=(.+?)(?=\])/)[0].slice(4);
                    return `<img src="${url}" class="img-msg block" preview="0">`;
                });
                if (escapeText.endsWith('<br>')) escapeText += '&nbsp;';
                return escapeText;
            },
            msgType() {
                return this.data.meta.msgType;
            },
            saveFilePath() {
                return path.join(this.$fileDownloadDir, `${this.relativePath}`)
            },
            needDownload() {
                if (!this.saveFilePath) return;
                // console.log("msgBox show",this.$store.state.downloadList[this.data.meta.id]);
                // console.log("FE", fs.existsSync(this.saveFilePath), this.saveFilePath);
                // this.judgedExists = true;
                return this.msgType === 2 && !this.$store.state.downloadList[this.relativePath] && !fs.existsSync(this.saveFilePath);
            },
            imgUrl() {
                let url = this.data.body.url;
                return url;

                if (url && !this.$store.state.needReload(url)) return url;
                return null;
            },
            relativePath() {
                return `${this.data.meta.msgId}_${this.data.body.name}`.replace(/\?|\/|\=|#/g, '');
            },

        },
        methods: {
            downloadFile() {
                if (!this.needDownload) {
                    return
                }
                this.onceDownload = true;
                // console.log("`${this.data.meta.msgId}_${this.data.body.name}`", `${this.data.meta.msgId}_${this.data.body.name}`);

                let options = {
                    fileId: this.relativePath,
                    filename: this.relativePath,
                    openFolderWhenDone: true,
                    showBadge: true,
                    onProgress: (data) => {
                        // console.log("from msgBox progress", this.data.body.name, data);
                    },
                    onStarted: () => {
                        // console.log("from msgBox start----------", this.data.body.name);
                    },
                    onFinish: () => {
                        shell.showItemInFolder(this.saveFilePath);
                    },
                };

                this.$store.commit("downloadFile", {
                    url: this.data.body.url,
                    options,
                });


            },
            displayImg() {
                let url = this.data.body.url;
                if (!url || this.imgUrl) {
                    // console.log("displayImg not need download");
                    return
                }
                let dirPath = app.getPath('downloads'), _filename = this.data.body.imgId;
                let filename = `${_filename}_${this.$store.state.getUniqueDownloadId()}`;
                dirPath = path.join(dirPath, '.vue_qq_by_bot');
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath)
                }
                let absPath = path.join(dirPath, filename);
                if (fs.existsSync(absPath)) {
                    this.imgLoaded = true;
                    this.data.body.url = `file:///${absPath}`;
                    // const img = this.$refs.msgImg;
                    // img.src = `file:///${absPath}`;
                    // img.onload = () => {
                    //     this.$emit("imgLoaded");
                    // };

                    return;
                }
                // console.log('dirpath', dirPath);
                let options = {
                    fileId: this.data.meta.id,
                    filename,
                    // openFolderWhenDone: true,
                    showBadge: true,
                    directory: dirPath,
                    onProgress: (data) => {
                        // console.log("from msgBox progress", filename, data.percent);
                    },
                    onStarted: () => {
                        // console.log("from msgBox start----------", filename);
                    },
                    onFinish: (filePath) => {
                        if (this.imgLoaded) return;
                        this.imgLoaded = true;
                        this.data.body.url = `file:///${filePath}`;
                    },
                    onCancel: () => {
                        console.error("fuck cancel...")
                    },
                };

                this.$store.commit("downloadFile", {
                    url,
                    options,
                });
            }
            ,
            handleImgLoaded(extraId) {
                this.$emit("imgLoaded", this.data.meta.id);
                // this.$emit("imgLoaded", extraId ? `${this.data.meta.id}_${extraId}` : this.data.meta.id);
            },
            setVideoUrl(url) {
                return {
                    playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
                    autoplay: false, // 如果为true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 是否视频一结束就重新开始。
                    // height: 200,
                    // width: 200,
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    // fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "video/mp4", // 类型
                        src: url, // url地址
                    }],
                    poster: '', // 封面地址
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: true, // 当前时间和持续时间的分隔符
                        durationDisplay: true, // 显示持续时间
                        remainingTimeDisplay: true, // 是否显示剩余时间功能
                        fullscreenToggle: true // 是否显示全屏按钮
                    }
                }
            },
            previewImg(images, index) {
                ImagePreview({
                    images: images, //需要预览的图片 URL 数组
                    // showIndex: true, //是否显示页码
                    // loop: false, //是否开启循环播放
                    // startPosition: index,
                    maxZoom: 10,
                    minZoom: .3,
                    closeable: true,
                })
            },
            onSelect(action) {
                Toast(action.text);
            },
            handleAction(e) {
                this.showPopover = false;
                Toast(e);
                let text = this.textList.join(' ');

                // let text = null;
                // if (this.msgType === 0) {
                //     let msgContentElem = this.$refs.msgContent, textList = [];
                //     msgContentElem.querySelectorAll('.clipable').forEach(e => textList.push(e.textContent));
                //     text = textList.join(' ');
                // } else if (this.msgType === 1) {
                //     text = this.data.body.url;
                // } else if (this.msgType === 2) {
                //     text = this.data.body.name;
                // }

                clipboard.writeText(text);
            }

        },
        mounted() {
            // this.displayImg();
            // window.msgBoxVue = this;
            // window.msgBoxApp = app;
            // window.msgBoxFs = fs;
        }
    }
</script>

<style scoped lang="scss">
    .root {
        .msg {
            min-width: 1rem;

            /*div {*/
            /*    cursor: text !important;*/
            /*}*/
        }

        .container:not([kind="mine"]) {
            $avatar-height: 2.5rem;
            align-items: flex-start;

            > .column {
                flex: 1;
                margin-right: $avatar-height;
            }

            .avatar-parent {
                width: $avatar-height;
                height: $avatar-height;
                margin-right: .5rem;

                .avatar {
                    width: 100%;
                    height: 100%;
                    margin-right: .5rem;
                }
            }

            .msg {
                $arrow-bw: 5px;
                $padding-width: .7rem;
                user-select: auto;

                width: fit-content;
                background-color: white;
                padding: $padding-width $padding-width $padding-width $padding-width;
                border-radius: $padding-width*.5 $padding-width $padding-width $padding-width;
                word-break: break-all;


                &::before {
                    width: 0;
                    height: 0;
                    border: solid transparent;
                    border-width: $arrow-bw;
                    border-right-color: #fff;
                    content: "";
                    position: absolute;
                    top: $arrow-bw*1.5;
                    left: $arrow-bw*-2;
                }

            }
        }

        .container[kind="mine"] {
            $avatar-height: 2.5rem;
            align-items: flex-start;

            > .column {
                flex: 1;
                margin-left: $avatar-height;
                align-items: flex-end;
            }

            .avatar-parent {
                width: $avatar-height;
                height: $avatar-height;
                margin-left: .5rem;

                .avatar {
                    width: 100%;
                    height: 100%;
                    margin-right: .5rem;
                }
            }

            .msg {
                $arrow-bw: 5px;
                $padding-width: .7rem;
                $bg-color: #59c0fe;

                user-select: auto;

                width: fit-content;
                background-color: $bg-color;
                color: white;
                padding: $padding-width $padding-width $padding-width $padding-width;
                border-radius: $padding-width $padding-width*.5 $padding-width $padding-width;
                word-break: break-all;


                &::before {
                    width: 0;
                    height: 0;
                    border: solid transparent;
                    border-width: $arrow-bw;
                    border-left-color: $bg-color;
                    content: "";
                    position: absolute;
                    top: $arrow-bw*1.5;
                    right: $arrow-bw*-2;
                }
            }
        }
    }

    .name {
        margin-bottom: .5rem;
    }

    .msg-file {
        width: 40vw !important;

        img {
            margin-left: 1rem;
        }
    }

    .disabled {
        opacity: .4;
    }

    .mine-img {
        text-align: right;
    }

    .qq-face {
        height: 1.5rem;
    }

    .inline {
        display: inline;
    }

    .flex-end {
        align-self: flex-end;
    }

    .popover-root {
        margin: 1rem 0;
        width: fit-content !important;
    }


</style>

<style lang="scss">
    .img-msg {
        max-width: 70vw;
        max-height: 25vh;
        border-radius: 8px;
    }

    .block {
        display: block;
    }


    .video-player {
        height: fit-content !important;
        width: fit-content !important;

        .video-js {
            height: fit-content !important;
            width: fit-content !important;
            background-color: white !important;

            .vjs-tech {
                height: 30vh !important;
                width: auto !important;
                max-width: 40vw;
                position: unset !important;
                margin-bottom: 1.5rem;
            }

            .vjs-big-play-button {
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -70%) !important;
            }

            .vjs-control {
                background-color: gray;
            }

            &.vjs-fullscreen {
                .vjs-tech {
                    height: 100% !important;
                    width: 100% !important;
                    max-width: unset;
                }
            }
        }
    }

    .van-overlay {
        background-color: transparent !important;

        &.van-image-preview__overlay {
            background-color: rgba(0, 0, 0, .9) !important;
        }
    }

    .dark-item {
        > div {
            background-color: rgb(74, 74, 74) !important;

            > span {
                color: rgb(255, 255, 255) !important;
            }
        }
    }



</style>