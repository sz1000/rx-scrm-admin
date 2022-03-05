<template>
    <div class="chat-box" v-loading="dataLoading">
        <div class="chat-box-content">
            <div class="right-nav-box">
                <div class="right-nav-box-content">
                    <ul class="right-nav">
                        <li v-for="(i, index) in navList" :key="i" @click="changeNav(index)" class="pointer" :class="{active: contentType == index}">{{ i }}</li>
                    </ul>
                    <div class="search">
                        <div class="inp-box">
                            <el-input class="search-input" v-model.trim="chatSearchText" placeholder="搜索内容" @input="doChange" @keyup.enter.native="doSearch"></el-input>
                            <div class="icon-search pointer" @click.stop.prevent="doSearch"><jzIcon class="jz_icon" type="icon-icon_search"></jzIcon></div>
                        </div>
                        <el-date-picker
                            v-model="creatDate"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy-MM-dd"
                            @change="changeDate">
                        </el-date-picker>
                    </div>
                </div>
            </div>

            <div v-if="listData && listData.length || imgVideoList && imgVideoList.length || documentList && documentList.length" class="chat-content-box">
                <div v-if="contentType == 0" class="dialog-box">
                    <chat-list ref="chatList" :list="listData" :fromUser="fromUser"></chat-list>
                </div>

                <div v-if="contentType == 1" class="img-video-list">
                    <img-video-box v-if="imgVideoList" ref="imgVideoBox" :list="imgVideoList"></img-video-box>
                </div>

                <div v-if="contentType == 2" class="document-list">
                    <document-box v-if="documentList" ref="documentBox" :list="documentList"></document-box>
                </div>
            </div>

            <div v-else-if="contentType == 0 && searchList && searchList.length" class="chat-content-box">
                <chat-search-list ref="chatList" :list="searchList"></chat-search-list>
            </div>

            <empty v-else type="1" tips="暂无数据"></empty>
        </div>
    </div>
</template>
<script>
import { ChatDataList, ChatFileDataList } from "../../config/api"

import Empty from "../../components/SessionArchiving/empty"
import ChatList from "../../components/SessionArchiving/chatList"
import ImgVideoBox from "../../components/SessionArchiving/imgVideoBox"
import DocumentBox from "../../components/SessionArchiving/documentBox"
import ChatSearchList from "../../components/SessionArchiving/chatSearchList"

import { throttle } from "../../utils/tool"

import { mapState } from 'vuex'

export default {
    name: 'chatBox',
    props: {
        toUser: {
            default() {
                return {}
            }
        },
        fromUser: {
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            dataLoading: false,
            navList: [ '全部', '图片及视频', '文件' ],
            contentType: 0,
            pageInfo: {
                page: 1, // 全部列表搜索页码数
                upPage: 1, // 全部列表上滑页码数
                downPage: 1, // 全部列表下滑页码数
                limit: 10,
            },
            total: 0,
            chatSearchText: '',
            preChatSearchText: '',
            searchOption: false,
            creatDate: null,
            date: {
                beginTime: null,
                preBeginTime: null,
                endTime: null,
                preEndTime: null
            },
            listData: [], // 全部对话框
            searchList: [], // 全部对话框搜索结果列表
            imgVideoList: [], // 图片及视频列表
            documentList: [], // 文件列表
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    provide() {
        return {
            changeNav: this.changeNav
        }
    },
    mounted() {
        window.addEventListener('scroll', this.loadMore, true)
    },
    methods: {
        changeNav(index, msgid) {
            this.contentType = index
            this.initData()
            if (msgid) { // 搜索列表定位标志
                this.getList('initData', '', msgid)  // 搜索列表获取定位数据
                return
            }
            if (index == 0) {
                this.getList('initData')
            } else {
                this.getFileList('initData', index)
            }
        },
        doChange(v) {
            if(!v) {
                this.doSearch()
            }
        },
        changeDate(val) {
            if (!val) {
                this.date.beginTime = null
                this.date.endTime = null
            } else {
                if (val[0] == val[1]) {
                    this.date.beginTime = val[0] + ' 00:00:00'
                    this.date.endTime = val[0] + ' 23:59:59'
                } else {
                    this.date.beginTime = val[0] + ' 00:00:00'
                    this.date.endTime = val[1] + ' 23:59:59'
                }
            }
            this.doSearch()
        },
        initType() {
            this.contentType = 0
        },
        // 初始化所有数据
        initData() {
            this.pageInfo = {
                page: 1,
                upPage: 1,
                downPage: 1,
                limit: 10,
            },
            this.creatDate = null
            this.date = {
                beginTime: null,
                preBeginTime: null,
                endTime: null,
                preEndTime: null
            }
            this.listData = []
            this.searchList = []
            this.imgVideoList = []
            this.documentList = []
            this.clearSearchText()
        },
        clearSearchText() {
            this.searchOption = false
            this.chatSearchText = ''
        },
        // 搜索功能
        doSearch() {
            const { beginTime, preBeginTime, endTime, preEndTime } = this.date

            // 搜索内容产生变化后就从第一页开始重新加载
            if (this.chatSearchText != this.preChatSearchText || preBeginTime  != beginTime || preEndTime != endTime) {
                this.pageInfo.page = 1
            }

            if (this.chatSearchText || this.date && this.date.beginTime && this.date.endTime) {
                this.searchOption = true
                if (this.contentType == 0) {
                    this.getList('', {'content': this.chatSearchText, ...this.date})
                } else {
                    this.getFileList('', this.contentType , {'content': this.chatSearchText, ...this.date})
                }
                this.preChatSearchText = this.chatSearchText
                this.date.preBeginTime = beginTime
                this.date.preEndTime = endTime
            } else {
                this.searchOption = false
                this.changeNav(this.contentType)
            }
        },
        // 获取全部对话内容列表数据
        getList(type, paramsData, msgid) {
            if((type == 'upLoadMore' || type == 'downLoadMore') && !throttle()) {
                return
            }

            this.dataLoading = true

            let pageIndex = this.initPage(type, paramsData)

            const { limit } = this.pageInfo

            const { content = '', beginTime = null, endTime = null } = paramsData || {}

            let params = {
                msgid,
                pageIndex: pageIndex,
                pageSize: limit,
                corpId: this.corpId,
                fromUserId: this.toUser && this.toUser.userId ? this.toUser.userId : '',
                toUserId: this.toUser && this.toUser.toUserId ? this.toUser.toUserId : '',
                content,
                beginTime,
                endTime
            }

            if (this.toUser && this.toUser.roomId) {
                params.roomId = this.toUser.roomId
            }

            ChatDataList(params).then(res => {
                const { code, data, msg } = res
                if (code === 'success' && data) {
                    this.total = data.total
                    this.handleRes(data, type, paramsData, msgid)
                } else {
                    this.$message.error(msg)
                }
                this.dataLoading = false
            })
        },
        // 初始化请求页码数
        initPage(type, paramsData) {
            let pageIndex = 1

            if (paramsData) {
                // 搜索
                if (this.listData && this.listData.length) {
                    this.pageInfo.page = 1
                    this.listData = []
                }
                pageIndex = this.pageInfo.page
                this.pageInfo.limit = 20
            } else if (!paramsData) {
                // 非搜索
                this.searchOption = false
                if (this.searchList && this.searchList.length) {
                    this.pageInfo.upPage = 1
                    this.pageInfo.downPage = -1
                    this.searchList = []
                }
                if (type == 'upLoadMore' || type == 'initData') {
                    pageIndex = this.pageInfo.upPage
                } else if (type == 'downLoadMore') {
                    pageIndex = this.pageInfo.downPage
                }
                this.pageInfo.limit = 10
            }

            return pageIndex
        },
        // 处理请求成功之后的数据及相应页码数
        handleRes(data, type, paramsData, msgid) {
            const { records, current } = data
            const { page, upPage, downPage, limit } = this.pageInfo

            if (paramsData) {
                // 搜索
                if (page == 1) {
                    this.searchList = records
                } else if (page != -1) {
                    this.searchList = this.searchList.concat(...records)
                }
                this.pageInfo.page++
                if (records && records.length <= 0 || records && records.length < limit) {
                    if (this.total > 0) {
                        this.pageInfo.page = -1
                    }
                    // this.$message.warning('没有更多数据了')
                }
            } else {
                // 非搜索
                let pageIndex = 1
                
                if (type == 'upLoadMore' || type == 'initData') {
                    pageIndex = upPage
                } else if (type == 'downLoadMore') {
                    pageIndex = downPage
                }
                if (upPage == 1) {
                    this.listData = records
                    if (!msgid) {
                        this.initScroll()
                    }
                } else if (pageIndex != -1) {
                    if (type == 'upLoadMore' || type == 'initData') {
                        this.listData = records.concat(...this.listData)
                    } else if (type == 'downLoadMore') {
                        this.listData = this.listData.concat(...records)
                    }
                }
                if (!msgid) {
                    // 非定位
                    if (type == 'upLoadMore' || type == 'initData') {
                        if (upPage == 1) {
                            this.pageInfo.downPage = -1
                        }
                        this.pageInfo.upPage++
                        if (records && records.length <= 0 || records && records.length < limit) {
                            if (this.total > 0) {
                                this.pageInfo.upPage = -1
                            }
                            // this.$message.warning('没有更多数据了')
                        }
                    } else if (type == 'downLoadMore') {
                        if (downPage > 1) {
                            this.pageInfo.downPage--
                        } else {
                            this.pageInfo.downPage = -1
                        }
                    }
                } else {
                    // 定位
                    this.pageInfo.upPage = current + 1
                    if (current > 1) {
                        this.pageInfo.downPage = current -1
                    } else if (current <= 1) {
                        this.pageInfo.downPage = -1
                    }
                }
            }
        },
        // 获取图片、视频、文件的对话内容列表数据
        getFileList(optType, type, paramsData) {
            if(!optType && !throttle()) {
                return
            }

            this.dataLoading = true

            const { content = '', beginTime = null, endTime = null } = paramsData || {}

            let params = {
                type,
                corpId: this.corpId,
                fromUserId: this.toUser.userId,
                toUserId: this.toUser.toUserId,
                content,
                beginTime,
                endTime,
            }

            if (this.toUser && this.toUser.roomId) {
                params.roomId = this.toUser.roomId
            }

            ChatFileDataList(params).then(res => {
                const { code, data, msg } = res
                if (code === 'success' && data) {
                    if (type == 1) {
                        this.imgVideoList = data
                    } else if (type == 2) {
                        this.documentList = data
                    }
                } else {
                    this.$message.error(msg)
                }
                this.dataLoading = false
            })
        },
        // 初始化滚动条至底部
        initScroll() {
            this.$nextTick(() => {
                let chatContentBoxDom = this.getDom('chat-content-box'), obj = this.getHeightData('chat-content-box')

                if (obj && (obj.scrollTop + obj.windowHeight < obj.scrollHeight)) {
                    // console.log("距顶部:::" + scrollTop + "可视区高度:::" + windowHeight + "滚动条总高度:::" + scrollHeight) 
                    chatContentBoxDom.scrollTop = obj.scrollHeight
                }
            })
        },
        getDom(className) {
            let chatContentBoxDom = document.getElementsByClassName(className)[0]

            return chatContentBoxDom
        },
        getHeightData(className) {
            if (this.getDom(className)) {
                let chatContentBoxDom = this.getDom(className), scrollTop = chatContentBoxDom.scrollTop, windowHeight = chatContentBoxDom.clientHeight, scrollHeight = chatContentBoxDom.scrollHeight

                return {
                    scrollTop,
                    windowHeight,
                    scrollHeight
                }
            }
            return {}
        },
        // 滑动加载数据（包括上滑和下滑）
        loadMore() {
            let obj = this.getHeightData('chat-content-box')

            const { page, upPage, downPage } = this.pageInfo

            if (this.searchOption) {
                // 搜索下滑加载
                if (obj && (obj.scrollTop >= obj.scrollHeight - obj.windowHeight) && this.contentType == 0 && page > 0) {
                    this.getList('', {'content': this.chatSearchText, ...this.date})
                }
            } else {
                // 非搜索上滑/下滑加载
                if (obj && obj.scrollTop == 0 && this.contentType == 0 && upPage > 0) {
                    // 上滑加载
                    this.getList('upLoadMore')
                } else if (obj && (obj.scrollTop >= obj.scrollHeight - obj.windowHeight) && this.contentType == 0 && downPage > 0) {
                    // 下滑加载
                    this.getList('downLoadMore')
                }
            }
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.loadMore, true);
    },
    components: {
        Empty,
        ChatList,
        ImgVideoBox,
        DocumentBox,
        ChatSearchList,
    }
}
</script>
<style lang="less" scoped>
.chat-box {
    .chat-box-content {
        .right-nav-box {
            padding-top: 16px;
            overflow-x: auto;
            .right-nav-box-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: content-box;
                height: 20px;
                padding: 0 0 16px;
                margin: 0 16px;
                border-bottom: 1px solid #F0F2F7;
                .right-nav {
                    min-width: 238px;
                    height: 20px;
                    li {
                        display: inline-block;
                        line-height: 20px;
                        vertical-align: middle;
                        text-align: center;
                        color: #838A9D;
                        font-size: 14px;
                        position: relative;
                        &:not(:first-child) {
                            margin-left: 40px;
                        }
                    }
                    .active {
                        color: #4168F6;
                        font-size: 14px;
                        &::after {
                            content: '';
                            width: 100%;
                            height: 2px;
                            background-color: #4168F6;
                            position: absolute;
                            left: 0;
                            bottom: -14px;
                        }
                    }
                }
                .search {
                    min-width: 435px;
                    margin-left: 16px;
                    .inp-box {
                        display: inline-block;
                        margin-right: 16px;
                        position: relative;
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
                    /deep/ .el-input {
                        width: 156px;
                        .el-input__inner {
                            height: 32px;
                        }
                        .el-input__icon {
                            line-height: 32px;
                        }
                    }
                    /deep/ .el-range-editor.el-input__inner {
                        width: 260px;
                        height: 32px;
                        padding: 0 10px;
                        .el-date-editor .el-range__icon {
                            line-height: 0;
                        }
                    }
                }
            }
        }
        .chat-content-box {
            max-height: 80vh;
            overflow-y: auto;
            .dialog-box {
                padding: 16px;
            }
            .img-video-list, .document-list {
                padding: 16px 0;
            }
        }
    }
}
@media screen and (max-width: 1440px){
    .chat-box {
        .chat-box-content {
            .chat-content-box {
                max-height: 72vh;
            }
        }
    }
}
</style>