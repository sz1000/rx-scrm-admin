<template>
    <div class="video-play">
        <el-dialog
            class="video-play-dialog"
            title=""
            :visible.sync="videoPlayDialogVisible"
            @close="hide"
            :destroy-on-close="true"
            :show-close="false"
            width="80vw">
            <div class="content-box" @click.prevent.stop="hide">
                <video v-if="url" id="video" :src="url" autoplay controls @click.prevent.stop="videoPlayDialogVisible = true">您的浏览器暂不支持该视频播放</video>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'videoPlay',
    data() {
        return {
            videoPlayDialogVisible: false,
            url: '',
        }
    },
    methods: {
        show(data) {
            const { filePath = ''} = data

            this.url = filePath
            this.videoPlayDialogVisible = true
        },
        hide() {
            this.initData()
            this.videoPlayDialogVisible = false
        },
        initData() {
            this.url = ''
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../style/dialog');

    .video-play-dialog {
        /deep/ .el-dialog{
            background: transparent;
            box-shadow: none;
            .el-dialog__header {
                padding: 0;
                background: transparent;
                box-shadow: none;
                border: none;
                .el-dialog__headerbtn {
                    width: 40px;
                    height: 40px;
                    background-color: #606266;
                    border-radius: 50%;
                    .el-dialog__close {
                        color: #fff;
                    }
                }
            }
            .el-dialog__body {
                padding: 0 !important;
            }
        }
        .content-box {
            display: flex;
            #video {
                max-width: 70vw;
                max-height: 70vh;
                margin: 0 auto;
            }
        }
    }
</style>