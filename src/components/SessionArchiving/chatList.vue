<template>
    <div class="chat-list">
        <ul v-for="i in list" :key="i.msgid">
            <li v-if="i.fromUserId != fromUser.id" class="dialog-box-item">
                <div class="header-img">
                    <img v-if="i.toAvatar" :src="i.toAvatar" alt="">
                    <jzIcon v-else class="jz_icon" type="icon-default_toAvatar"></jzIcon>
                </div>
                <div class="chat-des">
                    <div class="chat-des-top">
                        <span class="chat-name one-line">{{ i.toName ? i.toName : '***' }}</span>
                        <span class="chat-time">{{ i.sendTime ? getHumanDate(i.sendTime) : '' }}</span>
                    </div>
                    <div class="chat-des-bottom">
                        <chat-list-item :type="1" :itemData="i"></chat-list-item>
                    </div>
                </div>
            </li>
            <li v-if="i.fromUserId == fromUser.id" class="dialog-box-item dialog-box-item-me">
                <div class="chat-des">
                    <div class="chat-des-top">
                        <span class="chat-time">{{ i.sendTime ? getHumanDate(i.sendTime) : '' }}</span>
                        <span class="chat-name one-line">{{ i.toName ? i.toName : '***' }}</span>
                    </div>
                    <div class="chat-des-bottom">
                        <chat-list-item :type="2" :itemData="i"></chat-list-item>
                    </div>
                </div>
                <div class="header-img">
                    <img v-if="i.toAvatar" :src="i.toAvatar" alt="">
                    <jzIcon v-else class="jz_icon" type="icon-default_toAvatar"></jzIcon>
                </div>
            </li>
        </ul>

        <video-play ref="videoPlay"></video-play>
    </div>
</template>
<script>
import { getHumanDate } from '../../utils/tool'
import ChatListItem from '../../components/SessionArchiving/chatListItem'
import VideoPlay from '../../components/SessionArchiving/dialog/videoPlay'

export default {
    name: 'chatList',
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        },
        fromUser: {
            default() {
                return {}
            }
        }
    },
    provide() {
        return {
            playVideo: this.playVideo
        }
    },
    methods: {
        getHumanDate,
        playVideo(item) {
            this.$refs.videoPlay.show(item)
        }
    },
    components: {
        ChatListItem,
        VideoPlay
    }
}
</script>
<style lang="less" scoped>
.chat-list {
    .dialog-box-item {
        display: flex;
        margin: 15px 0;
        .header-img {
            width: 36px;
            min-width: 36px;
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
            max-width: 85%;
            position: relative;
            .chat-des-top {
                display: flex;
                min-width: 200px;
                position: absolute;
                left: 0;
                span {
                    font-size: 12px;
                }
                .chat-name {
                    margin-right: 8px;
                    color: #838A9D;
                    text-align: left;
                }
                .chat-time {
                    min-width: 125px;
                    color: #C0C4CC;
                }
            }
            .chat-des-bottom {
                padding: 9px 0;
                margin-top: 20px;
            }
        }
    }
    .dialog-box-item-me {
        justify-content: flex-end;
        text-align: right;
        .header-img {
            margin-right: 0px;
            margin-left: 12px;
        }
        .chat-des {
            .chat-des-top {
                justify-content: flex-end;
                left: unset;
                right: 0;
                text-align: right;
                .chat-name {
                    margin-right: 0;
                    margin-left: 8px;
                }
            }
        }
    }
}
</style>