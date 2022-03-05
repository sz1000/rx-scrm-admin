<template>
    <ul class="document-box">
        <li v-for="(i, index) in list" :key="index" class="document-item">
            <div class="time">{{ i.dateStr | getDate }}</div>
            <ul class="content">
                <li v-for="item in i.conversationInfoModelList" :key="item.msgid" class="content-item">
                    <a :href="item.filePath" target="_blank" class="box">
                        <div class="left">
                            <jzIcon class="jz_icon" type="icon-icon_file_left"></jzIcon>
                        </div>
                        <div class="right">
                            <div class="top">
                                <a class="name one-line" v-html="item.content"></a>
                                <span class="item-time">{{ item.sendTime ? getHumanDate(item.sendTime) : '' }}</span>
                                <div class="title-tips">{{ item.content }}</div>
                            </div>
                            <div class="bottom">
                                <span class="size">{{ JSON.parse(item.msg) && JSON.parse(item.msg).file ? byteConvert(JSON.parse(item.msg).file.filesize) : '' }}</span>
                                <span class="from">来自：{{ item.toName ? item.toName : '***' }}</span>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</template>
<script>
import { getHumanDate, byteConvert } from '../../utils/tool'

export default {
    name: 'documentBox',
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
        getHumanDate,
        byteConvert
    },
    filters: {
        getDate(date) {
            let result = ''

            if (date) {
                let arr = date.split('-')
                result = `${arr[0]}年${arr[1]}月${arr[2]}日`
            }

            return result
        }
    },
}
</script>
<style lang="less" scoped>
.document-box {
    .document-item {
        .time {
            margin: 30px auto 16px;
            text-align: center;
            color: #3C4353;
            font-size: 14px;
        }
        .content {
            .content-item {
                .box {
                    display: flex;
                    padding: 15px 16px;
                    position: relative;
                    &::after {
                        content: '';
                        height: 1px;
                        background-color: #F0F2F7;
                        position: absolute;
                        left: 87px;
                        right: 16px;
                        bottom: 0;
                    }
                    .left {
                        width: 60px;
                        height: 60px;
                        margin-right: 11px;
                        border-radius: 2px;
                        overflow: hidden;
                        .jz_icon {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .right {
                        flex: 1;
                        .top {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 8px;
                            position: relative;
                            .name {
                                color: #3C4353;
                                font-size: 14px;
                            }
                            .item-time {
                                min-width: 125px;
                                text-align: right;
                                color: #C0C4CC;
                                font-size: 11px;
                            }
                            .title-tips {
                                display: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                background-color: #333;
                                word-break: break-all;
                                color: #fff;
                                font-size: 12px;
                                position: absolute;
                                left: 0;
                                right: 50%;
                                bottom: 24px;
                                z-index: 9;
                                &::after {
                                    content: '';
                                    width: 8px;
                                    height: 8px;
                                    background-color: #333;
                                    position: absolute;
                                    bottom: 0;
                                    left: 50%;
                                    transform: rotate(-45deg) translateX(-50%);
                                }
                            }
                            &:hover {
                                .title-tips {
                                    display: block;
                                }
                            }
                        }
                        .bottom {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            span {
                                color: #838A9D;
                            }
                            .size {
                                font-size: 12px;
                            }
                            .from {
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>