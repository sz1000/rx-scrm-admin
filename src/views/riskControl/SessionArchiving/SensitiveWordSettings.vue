<template>
    <div class="content-box sensitive-word-settings">
        <!-- 查询重置 -->
        <search ref="search" title="规则名称"></search>

        <div class="add-btn">
            <div class="btn-box">
                <div class="pointer item" @click="synchronization">
                    <jzIcon class="jz_icon" type="icon-icon_tongbu"></jzIcon>
                    同步
                </div>
                <div class="pointer item" @click="handleEdit(1)">
                    <jzIcon class="jz_icon" type="icon-icon_xinzeng"></jzIcon>
                    新增规则
                </div>
            </div>
        </div>

        <div class="list-box-wrap" v-loading="dataLoading">
            <template v-if="enterTable && enterTable.length">
                <div v-for="(i, index) in enterTable" :key="index" class="list-box">
                    <div class="left">{{ i.ruleName }}</div>
                    <div class="middle">
                        <div class="item add-tag-btn pointer" @click="doShowAddInp(index)">+ 添加</div>
                        <el-input v-show="tagIndex == index" class="item add-input" v-model.trim="tagName" placeholder="输入后按回车完成" @keyup.enter.native="doAddTag(i.id)" maxlength="32"></el-input>
                        <span v-for="item in i.sensitiveWordsRels" :key="item.id" class="item tag-item">{{ item.content }}</span>
                    </div>
                    <div class="right">
                        <span class="btn-item pointer" @click="handleEdit(2, i.id)">
                            <jzIcon class="jz_icon" type="icon-icon_edit"></jzIcon>
                            修改
                        </span>
                        <span class="btn-item pointer" @click="deleteRow(i.id)">
                            <jzIcon class="jz_icon" type="icon-icon_delete"></jzIcon>
                            删除
                        </span>
                    </div>
                </div>
            </template>

            <no-date v-if="!enterTable.length"></no-date>
        </div>

        <!-- 修改规则 -->
        <rule-edit ref="ruleEditDialog"></rule-edit>

        <!-- 删除 -->
        <delete-dialog ref="deleteDialog"></delete-dialog>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { ChatSensitiveWordsList, ChatSensitiveWordsSyn, AddChatSensitiveWordsItem, DeleteChatSensitiveWords } from "../../../config/api"

import MyMixin from '../../../mixins/permissions'

import NoDate from "../../../components/noDate"
import Search from "../../../components/MaterialTemplate/search"
import RuleEdit from "../../../components/SessionArchiving/dialog/ruleEdit"
import DeleteDialog from "../../../components/MaterialTemplate/dialog/delete"
import { throttle } from "../../../utils/tool"

export default {
    name: 'recommendableArticle',
    mixins: [MyMixin],
    data() {
        return {
            dataLoading: true,
            total: 0,
            enterTable: [],
            tagIndex: -1,
            tagName: '',
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    provide() {
        return {
            getList: this.getList,
            deleteRow: this.deleteRow,
            doDelete: this.doDelete,
            checkTable: this.checkTable,
            resetTable: this.resetTable
        }
    },
    async created() {
        await this.getCorpId()
        this.getList()
    },
    methods: {
        ...mapActions(["getCorpId"]),
        getList(paramsData) {
            const { ruleName = '', beginTime = null, endTime = null } = paramsData || {}

            let params = {
                corpId: this.corpId,
                ruleName,
                beginTime,
                endTime
            }

            ChatSensitiveWordsList(params).then(res => {
                const { code, data, msg } = res
                if (code === 'success') {
                    this.enterTable = data.records;
                    this.total = data.total;
                } else {
                    this.$message.error(msg)
                }
                this.dataLoading = false
            })
        },
        pageChange(item) {
            console.log('', item)
            this.getList();
        },
        // 查询
        checkTable(data, date) {
            const { beginTime = null, endTime = null } = date

            let paramsData = {
                ruleName: data,
                beginTime,
                endTime
            }

            this.getList(paramsData)
        },
        resetTable() {
            this.$refs.search.initData()
            this.getList()
        },

        doShowAddInp(index) {
            this.tagIndex = index
        },

        doHideAddInp() {
            this.tagName = ''
            this.tagIndex = -1
        },

        async doAddTag(id) {
            if(!throttle(3000)) {
                return
            }

            if (!this.tagName) {
                return
            }

            let params = {
                sensitiveWordId: id,
                content: this.tagName,
                type: 1
            }

            let { result, msg } = await AddChatSensitiveWordsItem(params)

            if (result) {
                this.tagName = ''
                this.doHideAddInp()
                this.getList()
                this.$message.success(msg)
            } else {
                this.$message.error(msg)
            }
        },

        // 同步
        async synchronization() {
            let { code, msg } = await ChatSensitiveWordsSyn({ corpId: this.corpId })

            if (code == 'success') {
                this.getList()
                this.$message.success(msg)
            }
        },

        handleEdit(type, id) {
            this.$refs.ruleEditDialog.show(type, id)
        },

        deleteRow(id) {
            this.$refs.deleteDialog.show(id)
        },
        async doDelete(id) {
            if(!throttle(3000)) {
                return
            }

            let {result, msg} = await DeleteChatSensitiveWords(id)

            if (result) {
                this.getList()
                this.$message.success(msg)
                this.$refs.ruleEditDialog.hide()
                this.$refs.deleteDialog.hide()
            } else {
                this.$message.error(msg)
            }
        },
    },
    components: {
        NoDate,
        Search,
        RuleEdit,
        DeleteDialog,
    }
}
</script>
<style lang="less" scoped>
    .content-box {
        min-height: 100%;
        padding: 0 16px 16px;
        border-radius: 8px;
        background-color: @white;
    }
    .sensitive-word-settings {
        .add-btn {
            width: 100%;
            height: 32px;
            margin-bottom: 16px;
            position: relative;
            .btn-box {
                position: absolute;
                top: 0;
                right: 0;
                .item {
                    display: inline-block;
                    vertical-align: middle;
                    height: 32px;
                    padding: 6px 16px;
                    margin: 0 0 0 16px;
                    border-radius: 4px;
                    border: 1px solid @main;
                    background: rgba(65, 104, 246, 0.04);
                    text-align: center;
                    font-size: 14px;
                    color: @main;
                    position: relative;
                    .jz_icon{
                        width: 12px;
                        height: 12px;
                        vertical-align: -0.1em;
                    }
                }
            }
        }
        .list-box-wrap {
            border-top: 1px solid @lineColor;
            .list-box {
                display: flex;
                padding: 16px 0 8px;
                border-bottom: 1px solid @lineColor;
                .left {
                    width: 90px;
                    margin-right: 32px;
                    word-break: break-all;
                    color: @fontMain;
                    font-size: 14px;
                }
                .middle {
                    flex: 1;
                    .item {
                        display: inline-block;
                        vertical-align: middle;
                        height: 28px;
                        margin-bottom: 8px;
                        &:not(:last-child) {
                            margin-right: 16px;
                        }
                    }
                    .add-tag-btn {
                        width: 78px;
                        line-height: 28px;
                        border: 1px solid @bdColor;
                        border-radius: 4px;
                        text-align: center;
                        color: @fontSub2;
                        font-size: 14px;
                    }
                    .add-input {
                        width: 146px;
                        /deep/.el-input__inner {
                            width: 100%;
                            height: 28px;
                        }
                    }
                    .tag-item {
                        line-height: 28px;
                        padding: 0 16px;
                        background-color: @dialogBg;
                        border: 1px solid @bdColor;
                        border-radius: 4px;
                        color: @fontSub2;
                        font-size: 14px;
                    }
                }
                .right {
                    width: 118px;
                    margin-left: 32px;
                    .btn-item {
                        color: @fontMain;
                        font-size: 14px;
                        &:first-child {
                            margin-right: 18px;
                        }
                        .jz_icon {
                            width: 14px;
                            height: 14px;
                            vertical-align: -0.1em;
                        }
                    }
                }
            }
        }
    }
</style>