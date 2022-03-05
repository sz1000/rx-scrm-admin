<template>
    <ul class="chat-search-list">
        <li v-for="i in list" :key="i.msgid" class="dialog-box-item pointer" @click="changeNav(0, i.msgid)">
            <div class="header-img">
                <img v-if="i.toAvatar" :src="i.toAvatar" alt="">
                <jzIcon v-else class="jz_icon" type="icon-default_toAvatar"></jzIcon>
            </div>
            <div class="chat-des">
                <div class="chat-des-top">
                    <span class="chat-name one-line">{{ i.toName ? i.toName : '***' }}</span>
                    <span class="chat-time">{{ i.sendTime ? getHumanDate(i.sendTime) : '' }}</span>
                </div>
                <p class="chat-des-bottom">
                    <span v-if="i.msgtype == 'text'" class="content-box text" v-html="i.content"></span>
                    <span v-if="i.msgtype == 'revoke'" class="content-box text">【撤回了一条消息】</span>
                    <span v-if="i.msgtype == 'file'" class="content-box text" v-html="`[文件]${i.content}`"></span>
                    <span v-if="i.msgtype == 'link'" class="content-box text" v-html="`[链接]${i.content}`"></span>
                    <span v-if="i.msgtype == 'video'" class="content-box text">【视频】</span>
                    <span v-if="i.msgtype == 'image' || i.msgtype == 'emotion'" class="content-box text">【图片】</span>
                    <span v-if="i.msgtype == 'mixed'" class="content-box text">【混合消息】</span>
                    <span v-if="i.msgtype == 'docmsg'" class="content-box text">【在线文档】</span>
                    <span v-if="i.msgtype == 'location'" class="content-box text">【地址信息】</span>
                    <span v-if="i.msgtype == 'voice'" class="content-box text">【语音消息】</span>
                    <span v-if="i.msgtype == 'card'" class="content-box text">【名片】</span>
                    <span v-if="i.msgtype == 'weapp'" class="content-box text">【小程序】</span>
                    <span v-if="i.msgtype == 'redpacket'" class="content-box text">【红包】</span>
                    <span v-if="i.msgtype == 'chatrecord'" class="content-box text">【会话记录】</span>
                    <span v-if="i.msgtype == 'todo'" class="content-box">【待办】</span>
                    <span v-if="i.msgtype == 'calendar'" class="content-box">【日程消息】</span>
                    <span v-if="i.msgtype == 'disagree'" class="content-box">【不同意会话聊天内容】</span>
                    <span v-if="i.msgtype == 'agree'" class="content-box">【同意会话聊天内容】</span>
                    <span v-if="i.msgtype == 'vote'" class="content-box">【投票】</span>
                    <span v-if="i.msgtype == 'collect'" class="content-box">【填表】</span>
                    <span v-if="i.msgtype == 'meeting'" class="content-box">【会议邀请】</span>
                    <span v-if="i.msgtype == 'markdown'" class="content-box">【MarkDown格式】</span>
                    <span v-if="i.msgtype == 'news'" class="content-box">【图文消息】</span>
                    <span v-if="i.msgtype == 'meeting_voice_call'" class="content-box">【音频存档消息】</span>
                    <span v-if="i.msgtype == 'voip_doc_share'" class="content-box">【音频共享文档】</span>
                    <span v-if="i.msgtype == 'external_redpacket'" class="content-box">【互通红包】</span>
                    <span v-if="i.msgtype == 'sphfeed'" class="content-box">【视频号】</span>
                </p>
            </div>
        </li>
    </ul>
</template>
<script>
import { getHumanDate } from '../../utils/tool'

export default {
    name: 'chatSearchList',
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
    inject: ['changeNav'],
    methods: {
        getHumanDate
    }
}
</script>
<style lang="less" scoped>
.chat-search-list {
    .dialog-box-item {
        display: flex;
        padding: 15px 16px;
        position: relative;
        &::after {
            content: '';
            height: 1px;
            background-color: #F0F2F7;
            position: absolute;
            left: 63px;
            right: 16px;
            bottom: 0;
        }
        .header-img {
            width: 36px;
            height: 36px;
            margin-right: 12px;
            border-radius: 2px;
            overflow: hidden;
            img, .jz_icon {
                width: 100%;
                height: 100%;
            }
        }
        .chat-des {
            flex: 1;
            .chat-des-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                span {
                    font-size: 12px;
                }
                .chat-name {
                    flex: 1;
                    max-width: 75%;
                    word-break: break-all;
                    color: #838A9D;
                }
                .chat-time {
                    min-width: 125px;
                    text-align: right;
                    color: #C0C4CC;
                }
            }
            .chat-des-bottom {
                margin-top: 8px;
                color: #3C4353;
                font-size: 14px;
            }
        }
    }
}
</style>