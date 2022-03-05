<template>
    <div class="chat-list-item" :class="{'chat-list-item-right': type == 2}">
        <div v-if="itemData.msgtype == 'text'" class="content-box text">{{ itemData.content }}</div>
        <div v-if="itemData.msgtype == 'revoke'" class="content-box">【撤回了一条消息】</div>
        <div v-if="itemData.msgtype == 'file'" class="content-box">
            <a :href="itemData.filePath" target="_blank" class="file-box">
                <div class="file-text">
                    <h3>{{ itemData.content }}</h3>
                    <p>{{ JSON.parse(itemData.msg) && JSON.parse(itemData.msg).file ? byteConvert(JSON.parse(itemData.msg).file.filesize) : '' }}</p>
                </div>
                <jzIcon class="jz_icon" :type="type == 1 ? 'icon-icon_file_left' : 'icon-icon_file_right'"></jzIcon>
            </a>
        </div>
        <div v-if="(itemData.msgtype == 'image' || itemData.msgtype == 'emotion') && itemData.filePath" class="content-box">
            <el-image
                :src="itemData.filePath" 
                :preview-src-list="[itemData.filePath]"
                style="display: block; max-width: 100px; max-height: 100px">
            </el-image>
        </div>
        <div v-if="itemData.msgtype == 'video'" class="content-box video-box pointer" @click.stop="playVideo(itemData)">
            <div class="video-box-content">
                <img class="icon-video" src="../../assets/images/icon_videoplay.png" alt="">
                <video class="video" :src="itemData.filePath">您的浏览器暂不支持该视频播放</video>
            </div>
        </div>
        <div v-if="itemData.msgtype == 'link'" class="content-box">
            <a :href="JSON.parse(itemData.msg) && JSON.parse(itemData.msg).link ? JSON.parse(itemData.msg).link.link_url : ''" target="_blank" class="link-box">
                <h3 class="one-line">{{ itemData.content }}</h3>
                <div class="link-text">
                    <p class="two-line">{{ JSON.parse(itemData.msg) && JSON.parse(itemData.msg).link ? JSON.parse(itemData.msg).link.description : '' }}</p>
                    <jzIcon class="jz_icon" :type="type == 1 ? 'icon-icon_link_left' : 'icon-icon_link_right'"></jzIcon>
                </div>
            </a>
        </div>
        <div v-if="itemData.msgtype == 'docmsg'" class="content-box">
            <!-- <a :href="JSON.parse(itemData.msg) && JSON.parse(itemData.msg).doc ? JSON.parse(itemData.msg).doc.link_url : ''" target="_blank" class="doc-box"> -->
                【在线文档】
            <!-- </a> -->
        </div>
        <div v-if="itemData.msgtype == 'mixed'" class="content-box mixed-box">
            <!-- 【混合消息】 -->
            <template v-for="(i, index) in JSON.parse(JSON.parse(JSON.parse(itemData.msg).mixed).mixed)">
                <div v-if="i.type == 'image' || i.type == 'emotion'" :key="i.type + index">
                    <el-image
                        :src="i.content" 
                        :preview-src-list="[i.content]"
                        style="display: block; max-width: 100px; max-height: 100px">
                    </el-image>
                </div>
                <div v-if="i.type == 'text'" :key="i.type + index" class="text">{{ i.content ? i.content : '' }}</div>
            </template>
        </div>
        <div v-if="itemData.msgtype == 'chatrecord'" class="content-box">【会话记录】</div>
        <div v-if="itemData.msgtype == 'location'" class="content-box">【地址信息】</div>
        <div v-if="itemData.msgtype == 'voice'" class="content-box">【语音消息】</div>
        <div v-if="itemData.msgtype == 'card'" class="content-box">【名片】</div>
        <div v-if="itemData.msgtype == 'weapp'" class="content-box">【小程序】</div>
        <div v-if="itemData.msgtype == 'redpacket'" class="content-box">【红包】</div>
        <div v-if="itemData.msgtype == 'todo'" class="content-box">【待办】</div>
        <div v-if="itemData.msgtype == 'calendar'" class="content-box">【日程消息】</div>
        <div v-if="itemData.msgtype == 'disagree'" class="content-box">【不同意会话聊天内容】</div>
        <div v-if="itemData.msgtype == 'agree'" class="content-box">【同意会话聊天内容】</div>
        <div v-if="itemData.msgtype == 'vote'" class="content-box">【投票】</div>
        <div v-if="itemData.msgtype == 'collect'" class="content-box">【填表】</div>
        <div v-if="itemData.msgtype == 'meeting'" class="content-box">【会议邀请】</div>
        <div v-if="itemData.msgtype == 'markdown'" class="content-box">【MarkDown格式】</div>
        <div v-if="itemData.msgtype == 'news'" class="content-box">【图文消息】</div>
        <div v-if="itemData.msgtype == 'meeting_voice_call'" class="content-box">【音频存档消息】</div>
        <div v-if="itemData.msgtype == 'voip_doc_share'" class="content-box">【音频共享文档】</div>
        <div v-if="itemData.msgtype == 'external_redpacket'" class="content-box">【互通红包】</div>
        <div v-if="itemData.msgtype == 'sphfeed'" class="content-box">【视频号】</div>
    </div>
</template>
<script>
import { byteConvert } from '../../utils/tool'

export default {
    name: 'chatListItem',
    props: {
        type: {
            default: 1
        },
        itemData: {
            default() {
                return {}
            }
        },
    },
    inject: ['playVideo'],
    methods: {
        byteConvert,
    },
}
</script>
<style lang="less" scoped>
.chat-list-item {
    .content-box {
        word-break: break-all;
        padding: 9px 8px;
        background-color: #F6F7F9;
        border-radius: 0 4px 4px 8px;
        color: #3C4353;
        font-size: 14px;
        .file-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 238px;
            min-width: 238px;
            padding: 1px 8px;
            text-align: left;
            .file-text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 60px;
                h3 {
                    font-weight: 500;
                    font-size: 14px;
                }
                p {
                    margin-top: 8px;
                    font-size: 12px;
                }
            }
            .jz_icon {
                width: 60px;
                min-width: 60px;
                height: 60px;
            }
        }
        .link-box {
            display: block;
            width: 238px;
            padding: 1px 8px;
            text-align: left;
            h3 {
                font-weight: 500;
                font-size: 14px;
            }
            .link-text {
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 60px;
                p {
                    margin-right: 16px;
                    font-size: 11px;
                }
                .jz_icon {
                    width: 34px;
                    min-width: 34px;
                    height: 34px;
                }
            }
        }
    }
    .text {
        max-height: 200px;
        overflow-y: auto;
    }
    .video-box {
        .video-box-content {
            max-width: 100px;
            max-height: 100px;
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
            .video {
                width: 100%;
                border-radius: 4px;
            }
        }
    }
    .mixed-box {
        .text {
            margin: 5px 0;
        }
    }
}
.chat-list-item-right {
    .content-box {
        border-radius: 4px 0 4px 8px;
        background-color: #5880F5;
        color: #fff;
        text-align: right;
    }
    .text {
        text-align: left;
    }
}
</style>