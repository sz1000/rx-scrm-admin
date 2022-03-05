<template>
    <div>
        <ul class="img-video-box">
            <li v-for="(i, index) in list" :key="index" class="img-video-item">
                <div class="time">{{ i.dateStr | getDate }}</div>
                <ul class="content">
                    <template v-for="item in i.conversationInfoModelList">
                        <li v-if="item.msgtype == 'image'" :key="item.msgid" class="content-item img-box pointer">
                            <div class="img-box-des">
                                <el-image
                                    :src="item.filePath" 
                                    :preview-src-list="[item.filePath]">
                                </el-image>
                            </div>
                        </li>
                        <template v-if="item.msgtype == 'mixed'">
                            <li :key="item.msgid">
                                <div v-for="j in getImgUrl(item.msg)" :key="j" class="content-item img-box pointer">
                                    <div class="img-box-des">
                                        <el-image :src="j" :preview-src-list="[j]"></el-image>
                                    </div>
                                </div>
                            </li>
                        </template>
                        <li v-if="item.msgtype == 'video'" :key="item.msgid" class="content-item pointer" @click.stop="playVideo(item)">
                            <img class="icon-video" src="../../assets/images/icon_videoplay.png" alt="">
                            <video class="img-video" :src="item.filePath">您的浏览器暂不支持该视频播放</video>
                        </li>
                    </template>
                </ul>
            </li>
        </ul>

        <video-play ref="videoPlay"></video-play>
    </div>
</template>
<script>
import VideoPlay from '../../components/SessionArchiving/dialog/videoPlay'

export default {
    name: 'imgVideoBox',
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        playVideo(item) {
            this.$refs.videoPlay.show(item)
        },
        getImgUrl(msg) {
            let msgArr = JSON.parse(JSON.parse(JSON.parse(msg).mixed).mixed)

            let result = msgArr.filter(item => {
                return item.type == 'image'
            }).map(e => {
                return e.content
            })

            return result
        }
    },
    filters: {
        getDate(date) {
            let result = ''

            if (date) {
                let arr = date.split('-')
                result = `${arr[0]}年${arr[1]}月${arr[2]}日`
            }

            return result
        },
    },
    components: {
        VideoPlay
    }
}
</script>
<style lang="less" scoped>
.img-video-box {
    .img-video-item {
        margin-bottom: 30px;
        .time {
            margin: 0 0 16px 16px;
            color: #3C4353;
            font-size: 14px;
        }
        .content {
            .content-item {
                display: inline-block;
                vertical-align: middle;
                width: 118px;
                height: 118px;
                margin: 0 0 16px 16px;
                overflow: hidden;
                position: relative;
                .icon-video {
                    width: 48px;
                    height: 48px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .img-box {
                background-color: #F7F8FA;
                .img-box-des {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    .el-image {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
            }
        }
    }
}
</style>