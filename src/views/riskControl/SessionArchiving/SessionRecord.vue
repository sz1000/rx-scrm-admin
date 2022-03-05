<template>
    <div class="content-box session-record">
        <div class="left">
            <div v-if="fromData" class="has-from-box">
                <h3>员工列表</h3>
                <div class="has-from-des pointer one-line">
                    <jzIcon class="jz_icon" type="icon-icon_header"></jzIcon>
                    <span>{{ fromData.name }}</span>
                </div>
            </div>
            <tree-box v-else ref="treeBox" headerTitle="员工列表" :comeFrom="1" :checkedList="checkedList"></tree-box>
        </div>
        <template v-if="isOpen">
            <div class="divider"></div>
            <div class="middle" v-loading="dataLoading">
                <div v-if="checkedStaff">
                    <h3 class="middle-title" v-html="`和${checkedStaff.name}的聊天对象`"></h3>

                    <contact-box ref="contactBox" :contactsList="contactsList"></contact-box>
                </div>

                <empty v-else tips="请选择员工~"></empty>
            </div>
            <div class="divider"></div>
            <div class="right">
                <div v-if="checkedContacts" class="right-box">
                    <h3 class="right-title" v-html="`和${toUserType == 3 ? checkedContacts.name : checkedContacts.toName ? checkedContacts.toName : '***'}的聊天记录`"></h3>

                    <chat-box ref="chatBox" :toUser="checkedContacts" :fromUser="checkedStaff"></chat-box>
                </div>

                <empty v-else tips="请选择联系人~"></empty>
            </div>
        </template>
        <div v-else class="not-open-box">
            <empty tips="该员工未开通会话存档"></empty>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { IfIsOpen, ContactsList, GroupList } from "../../../config/api"

import MyMixin from '../../../mixins/permissions'

import TreeBox from "../../../components/SessionArchiving/treeBox"
import Empty from "../../../components/SessionArchiving/empty"
import ContactBox from "../../../components/SessionArchiving/contactBox"
import ChatBox from "../../../components/SessionArchiving/chatBox"

export default {
    name: 'sessionRecord',
    mixins: [MyMixin],
    data() {
        return {
            isOpen: true, // 是否开启会话存档功能(个人)
            fromData: null, // 从违规提醒点击跳转带过来的数据
            dataLoading: false,
            checkedList: [], // 会话记录页面选中的员工（单选）
            checkedStaff: null, // 选中的员工
            checkedContacts: null, // 选中的联系对象
            contactsList: [], // 联系对象列表
            toUserType: 1, // 1.内部联系人 2.外部联系人 3.群聊
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    provide() {
        return {
            getContactsList: this.getContactsList,
            getToUserType: this.getToUserType,
            getCheckedList: this.getCheckedList,
            checkContact: this.checkContact,
            initCheckedContacts: this.initCheckedContacts
        }
    },
    async created() {
        await this.getCorpId()
        this.hasFrom()
    },
    methods: {
        ...mapActions(["getCorpId"]),
        async IfIsOpen() {
            let {code, data} = await IfIsOpen({corpId: this.corpId, userId: this.checkedStaff && this.checkedStaff.id})

            if (code == 'success') {
                this.isOpen = data
            }
        },
        // 判断是否从违规提醒点击跳转过来的
        hasFrom() {
            const { id, name, toUserId, msgType, msgid } = this.$route.query

            if (this.$route.query && id) {
                this.fromData = { id, name, toUserId, msgType, msgid }
                this.doGetContactsList(this.fromData.msgType)
            }
        },
        // 选中员工
        getCheckedList(data) {
            if (data.type == 3 && data.isChecked == true) {
                this.checkedList = []
                this.checkedList.push(data)
                this.checkedList[0].content = this.checkedList[0].id
                this.$refs.treeBox.resetTreeData(this.checkedList)
                console.log("结果---checkedList:::", this.checkedList)
                this.doGetContactsList(0)
            } else if (data.type == 3 && data.isChecked == false && data.id == this.checkedStaff.id) {
                data.isChecked = true
            }
        },
        // 选中员工后即获取聊天对象列表
        async doGetContactsList(type) {
            this.checkedStaff = type == 0 ? this.checkedList[0] : this.fromData

            if (type == 0) {
                await this.IfIsOpen()
                this.fromData = null
            } else {
                this.isOpen = true
            }
            this.$nextTick(() => {
                if (type == 0 || type == 1) {
                    this.$refs.contactBox.changeMiddleNav(0)
                } else if (type == 2) {
                    this.$refs.contactBox.changeMiddleNav(1)
                } else if (type == 3) {
                    this.$refs.contactBox.changeMiddleNav(2)
                }
            })
        },
        // 获取聊天对象列表
        getContactsList(paramsData) {
            this.dataLoading = true

            let params = {
                corpId: this.corpId,
                userId: this.checkedStaff && this.checkedStaff.id,
                content: paramsData ? paramsData : ''
            }

            let ApiOpts = null

            if (this.toUserType == 1 || this.toUserType == 2) {
                params.toUserType = this.toUserType // 1.内部联系人 2.外部联系人 3.群聊
                ApiOpts = ContactsList
            } else if (this.toUserType == 3) {
                ApiOpts = GroupList
            }

            ApiOpts(params).then(res => {
                const { code, data, msg } = res

                if (code === 'success') {
                    this.contactsList = data
                    this.initCheckedContacts()

                    // 从违规提醒点击跳转过来的
                    if (this.fromData) {
                        this.contactsList.map(item => {
                            if (item.toUserId == this.fromData.toUserId) {
                                this.checkContact(item)
                            }
                        })
                    }
                } else {
                    this.$message.error(msg)
                }
                this.dataLoading = false
            })
        },
        // 选中聊天对象
        checkContact(item) {
            if(!item['checked']) {
                this.resetContacts()
                item.checked = true
                this.contactsList = JSON.parse(JSON.stringify(this.contactsList))
                this.checkedContacts = item
                this.$nextTick(() => {
                    if (this.fromData) {
                        // 从违规提醒点击跳转过来的直接走定位数据
                        this.$refs.chatBox.changeNav(0, this.fromData.msgid)
                    } else {
                        this.$refs.chatBox.changeNav(0)
                    }
                })
            }
        },
        resetContacts() {
            if (!this.contactsList) {
                return
            }
            for (let i = 0; i < this.contactsList.length; i++) {
                this.contactsList[i].checked = false
            }
        },
        initCheckedContacts() {
            this.checkedContacts = null
            this.resetContacts()
        },
        getToUserType(index) {
            this.toUserType = index ? index : this.toUserType
        }
    },
    components: {
        TreeBox,
        Empty,
        ContactBox,
        ChatBox
    }
}
</script>
<style lang="less" scoped>
.content-box {
    height: 100%;
    border-radius: 8px;
    background-color: @white;
    overflow-y: auto;
}
.session-record {
    display: flex;
    .divider {
        width: 1px;
        height: 100%;
        background-color: @lineColor;
    }
    .left {
        width: 262px;
        height: 100%;
        padding: 16px;
        overflow-x: hidden;
        overflow-y: auto;
        .has-from-box {
            h3 {
                margin: 0 16px 16px 0;
                color: @fontMain;
                font-size: 16px;
            }
            .has-from-des {
                padding: 6px 0 6px 16px;
                background-color: #F4F6FE;
                .jz_icon {
                    width: 14px;
                    height: 14px;
                    margin-right: 8px;
                }
                span {
                    font-size: 14px;
                    color: @fontMain;
                }
            }
        }
    }
    .middle {
        width: 282px;
        height: 100%;
        padding: 16px 0;
        overflow-x: hidden;
        overflow-y: auto;
        .middle-title {
            margin: 0 16px 16px;
            font-size: 16px;
            color: @fontMain;
        }
    }
    .right {
        flex: 1;
        height: 100%;
        padding: 16px 0;
        overflow: hidden;
        .right-box {
            .right-title {
                margin: 0 16px;
                font-size: 16px;
                color: @fontMain;
            }
        }
    }
}
</style>
<style lang="less">
.session-record{
    .empty {
        padding: 60px 0;
        img {
            width: 120px;
            height: 94px;
        }
    }
    .list {
        .list-box {
            h3 {
                margin: 0 16px 16px 0 !important;
            }
        }
    }
    .not-open-box {
        display: flex;
        align-items: center;
        width: 100%;
        img {
            width: 240px;
            height: 188px;
        }
    }
}
</style>