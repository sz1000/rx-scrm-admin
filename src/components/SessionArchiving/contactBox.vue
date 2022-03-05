<template>
    <div class="contacts-box">
        <ul class="middle-nav">
            <li v-for="(i, index) in middleNavList" :key="i" @click="changeMiddleNav(index)" class="pointer" :class="{active: middleContentType == index}"><span>{{ i }}</span></li>
        </ul>
        <div v-if="contactsList && contactsList.length" class="middle-content">
            <div class="search">
                <span>共{{ contactsList.length }}个{{ middleContentType == 2 ? '群聊' : '好友'}}</span>
                <div class="inp-box">
                    <el-input class="search-input" v-model.trim="contactSearchText" placeholder="搜索内容" @input="doChange" @keyup.enter.native="getContactsList(contactSearchText)"></el-input>
                    <div class="icon-search pointer" @click.stop.prevent="getContactsList(contactSearchText)"><jzIcon class="jz_icon" type="icon-icon_search"></jzIcon></div>
                </div>
            </div>
            <div class="middle-content-box">
                <ul class="contacts-content-box">
                    <li v-for="i in contactsList" :key="i.id" class="contacts-box-item pointer" :class="{active: i.checked}" @click="checkContact(i)">
                        <div class="contacts-left">
                            <!-- 群头像 -->
                            <div v-if="middleContentType == 2" class="group-img-box">
                                <template v-for="(item, index) in i.avatarList">
                                    <img :key="item + index" v-if="item && index < 9" class="contacts-img" :src="item" alt="">
                                </template>
                            </div>
                            <!-- 个人头像 -->
                            <template v-else>
                                <img v-if="i.toAvatar" class="contacts-img" :src="i.toAvatar" alt="">
                                <jzIcon v-else class="jz_icon" type="icon-default_toAvatar"></jzIcon>
                            </template>
                        </div>
                        <div class="contacts-right">
                            <div class="contacts-top">
                                <div class="contacts-name-box one-line" v-html="middleContentType == 2 ? i.name : i.toName ? i.toName : '***' "></div>
                                <span class="contacts-time">{{ i.sendTime ? getHumanDate(i.sendTime) : '' }}</span>
                            </div>
                            <div class="contacts-bottom">
                                <span class="one-line" v-html="i.content"></span>
                                <!-- <span></span> -->
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <empty v-else type="1" tips="暂无数据"></empty>
    </div>
</template>
<script>
import { getHumanDate } from '../../utils/tool'
import Empty from "../../components/SessionArchiving/empty"

export default {
    name: 'contactsBox',
    props: {
        contactsList: {
            default() {
                return []
            }
        },
    },
    data() {
        return {
            middleNavList: [ '内部联系人', '外部联系人', '群聊' ],
            middleContentType: 0,
            contactSearchText: '',
        }
    },
    inject: ['checkContact', 'getContactsList', 'getToUserType', 'initCheckedContacts'],
    methods: {
        getHumanDate,
        changeMiddleNav(index) {
            this.middleContentType = index
            this.getToUserType(index + 1)
            this.contactSearchText = ''
            this.initCheckedContacts()
            this.getContactsList()
        },
        doChange(v) {
            if(!v) {
                this.getContactsList()
            }
        },
    },
    components: {
        Empty,
    }
}
</script>
<style lang="less" scoped>
.contacts-box {
    .middle-nav {
        display: flex;
        height: 20px;
        box-sizing: content-box;
        padding: 0 16px 16px;
        border-bottom: 1px solid @lineColor;
        li {
            flex: 1;
            text-align: center;
            span {
                line-height: 20px;
                color: @fontSub2;
                font-size: 12px;
                position: relative;
            }
        }
        .active {
            span{
                color: @main;
                font-size: 14px;
                &::after {
                    content: '';
                    width: 100%;
                    height: 2px;
                    background-color: @main;
                    position: absolute;
                    left: 0;
                    bottom: -16px;
                }
            }
        }
    }
    .middle-content {
        .search {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            span {
                word-break: break-all;
                font-size: 12px;
                color: @fontSub2;
            }
            .inp-box {
                width: 156px;
                position: relative;
                /deep/ .el-input {
                    width: 100%;
                    .el-input__icon {
                        line-height: 32px;
                    }
                }
                .icon-search {
                    width: 28px;
                    height: 32px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    .jz_icon {
                        width: 16px;
                        height: 16px;
                        margin: 8px 0;
                    }
                }
            }
        }
        .middle-content-box {
            .contacts-content-box {
                .contacts-box-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 14px 10px 16px;
                    position: relative;
                    &::after {
                        content: '';
                        height: 1px;
                        background-color: @lineColor;
                        position: absolute;
                        left: 16px;
                        right: 0;
                        bottom: 0;
                    }
                    &:hover {
                        background-color: #F4F6FE;
                    }
                    .contacts-left {
                        width: 40px;
                        height: 40px;
                        border-radius: 2px;
                        overflow: hidden;
                        .contacts-img, .jz_icon {
                            width: 100%;
                            height: 100%;
                        }
                        .group-img-box {
                            display: flex;
                            flex-wrap: wrap;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                            background-color: #F6F7F9;
                            .contacts-img{
                                width: 11px;
                                height: 11px;
                                margin-right: 2px;
                                &:nth-child(3n) {
                                    margin-right: 0;
                                }
                            }
                        }
                    }
                    .contacts-right {
                        flex: 1;
                        margin-left: 8px;
                        .contacts-top {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            .contacts-name-box {
                                word-break: break-all;
                                color: #000;
                                font-size: 14px;
                            }
                            .contacts-time {
                                max-width: 125px;
                                white-space: nowrap;
                                text-align: right;
                                color: #C0C4CC;
                                font-size: 11px;
                            }
                        }
                        .contacts-bottom {
                            span {
                                word-break: break-all;
                                color: @fontSub2;
                                font-size: 12px;
                            }
                        }
                    }
                }
                .active {
                    background-color: #F4F6FE;
                }
            }
        }
    }
}
</style>