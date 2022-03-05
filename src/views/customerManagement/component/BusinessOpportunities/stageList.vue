<template>
    <div v-show="formType != 1 && formType != 2" class="stage-list">
        <div class="top" v-if="enterTable && enterTable.length">
            <h3>商机</h3>
            <div class="add-btn pointer" @click="handleEdit">
                <img src="../../../../assets/images/icon_add@2x.png" alt="" />
                <span>新增商机</span>
            </div>
        </div>
        <div v-if="enterTable && enterTable.length" class="list-box">
            <div class="item" v-for="i in enterTable" :key="i.id">
                <div class="bar">
                    <div class="item left">
                        <div class="bar-box">
                            <span v-for="item in i.infoModelList" :key="item.sortNo" v-show="item.stageName && item.sortNo" class="bar-item pointer" :class="{after: item.sortNo > i.stageNo, 'before-ing': i.status == 0 && item.sortNo <= i.stageNo, 'before-success': i.status == 1 && item.sortNo <= i.stageNo, 'before-lose': i.status == 2 && item.sortNo <= i.stageNo, 'before-invalid': i.status == 3 && item.sortNo <= i.stageNo}" @click="handleChange(i, item)">{{ item.stageName }}</span>
                        </div>
                    </div>
                    <div class="item right">
                        <el-select v-if="!i.status" v-model="stageStatusValue" placeholder="结束" size="mini" @visible-change="clearValue" @change="changeStatus($event, i)">
                            <el-option
                            v-for="v in stageListOptions"
                            :key="v.sortId"
                            :label="v.stageName"
                            :value="v.sortId">
                            </el-option>
                        </el-select>
                        <span v-else class="status-tag" :class="{success: i.status == 1, lose: i.status == 2, invalid: i.status == 3}">{{ i.status | getStatusText }}</span>
                    </div>
                </div>
                <div class="table-box">
                    <div class="table-content">
                        <div class="content-item left">
                            <div class="item">
                                <span class="label">商机名称:</span>
                                <span class="value one-line">{{ i.name }}</span>
                            </div>
                            <div class="item">
                                <span class="label">商机金额:</span>
                                <span class="value one-line">{{ i.price }}</span>
                            </div>
                            <div class="item">
                                <span class="label">商机负责人:</span>
                                <span class="value one-line">{{ i.chargeUserName }}</span>
                            </div>
                            <div v-if="i.status == 2" class="item">
                                <span class="label">输单原因:</span>
                                <span class="value one-line">{{ i.endReasonName }}</span>
                                <div v-if="i.endReasonName" class="title-tips">{{ i.endReasonName }}</div>
                            </div>
                            <div v-if="i.status == 3" class="item">
                                <span class="label">无效原因:</span>
                                <span class="value one-line">{{ i.endReasonName }}</span>
                                <div v-if="i.endReasonName" class="title-tips">{{ i.endReasonName }}</div>
                            </div>
                            <div class="item">
                                <span class="label">备注:</span>
                                <span class="value one-line">{{ i.remarks }}</span>
                                <div v-if="i.remarks" class="title-tips">{{ i.remarks }}</div>
                            </div>
                        </div>
                        <div class="content-item right">
                            <div class="item">
                                <span class="label">商机创建时间:</span>
                                <span class="value one-line">{{ i.createTime ? formatDate(i.createTime, "yyyy-MM-dd") : '-' }}</span>
                            </div>
                            <div class="item">
                                <span class="label">预计成交时间:</span>
                                <span class="value one-line">{{ i.expectEndTime ? formatDate(i.expectEndTime, "yyyy-MM-dd") : '-' }}</span>
                            </div>
                            <div v-if="i.status" class="item">
                                <span class="label">{{ i.status == 1 ? '成交时间:' : '结束时间:' }}</span>
                                <span class="value one-line">{{ i.endTime ? formatDate(i.endTime, "yyyy-MM-dd") : '-' }}</span>
                            </div>
                            <div v-if="i.status == 2" class="item">
                                <span class="label">输单备注:</span>
                                <span class="value one-line">{{ i.endRemarks }}</span>
                                <div v-if="i.endRemarks" class="title-tips">{{ i.endRemarks }}</div>
                            </div>
                            <div v-if="i.status == 3" class="item">
                                <span class="label">无效备注:</span>
                                <span class="value one-line">{{ i.endRemarks }}</span>
                                <div v-if="i.endRemarks" class="title-tips">{{ i.endRemarks }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="table-option">
                        <img @click="handleEdit(i)" class="pointer" src="../../../../assets/images/icon_edit1.png" alt="">
                        <img @click="deleteRow(i.id)" class="pointer" src="../../../../assets/images/icon_delete1.png" alt="">
                    </div>
                </div>
            </div>
        </div>

        <!-- 新建/编辑商机 -->
        <edit-opportunity ref="editOpportunity" :customerNo="customerNo" :formType="formType" @sure="addFun"></edit-opportunity>
        <!-- 更改商机阶段 -->
        <change-stage ref="changeStage"></change-stage>
        <!-- 确认结束商机 -->
        <confirm-result ref="confirmResult" :customerNo="customerNo" :formType="formType"></confirm-result>
        <!-- 删除 -->
        <delete-dialog ref="deleteDialog"></delete-dialog>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { OpportunitiesList, ModifyOpportunitiesStatus, OpportunitiesStageList, DeleteOpportunities } from "../../../../config/api"
import MyMixin from '../../../../mixins/permissions'

import { formatDate } from "../../../../utils/tool"

import EditOpportunity from "./dialog/editOpportunity"
import ChangeStage from "./dialog/changeStage"
import ConfirmResult from "./dialog/confirmResult"
import DeleteDialog from "../../../../components/MaterialTemplate/dialog/delete"

export default {
    name: 'recommendableArticle',
    mixins: [MyMixin],
    props: {
        customerNo: {
            type: String,
            default: ''
        },
        formType: {
            type: String,
            default: '3' // 1: 我的线索，2: 线索公海，3: 我的客户，4: 客户公海
        }
    },
    data() {
        return {
            dataLoading: true,
            enterTable: [],
            stageListOptions: [],
            stageStatusValue: null
        }
    },
    computed: {
        ...mapState(["corpId"])
    },
    async created() {
        await this.getCorpId()
        this.getList()
    },
    mounted() {
        window.addEventListener('scroll', this.handleSelect, true)
    },
    provide() {
        return {
            getList: this.getList,
            doChange: this.doChange,
            doDelete: this.doDelete,
            opportunitiesStageList: this.opportunitiesStageList
        }
    },
    methods: {
        ...mapActions(["getCorpId"]),
        getList() {
            OpportunitiesList(this.customerNo).then(res => {
                const { code, data, msg } = res
                if (code === 'success') {
                    this.$emit('getTotal',data.length)
                    this.enterTable = data
                    this.opportunitiesStageList(this.getStageListOptions, true)
                } else {
                    this.$message.error(msg)
                }
                this.dataLoading = false
            })
        },
        async opportunitiesStageList(callBack, isEnd) {
            let params = {
                corpId: this.corpId,
                isEnd,
            }

            let { code, data } = await OpportunitiesStageList(params)

            if (code == 'success') {
                callBack(data)
            }
        },
        getStageListOptions(data) {
            this.stageListOptions = data
        },
        handleEdit(data) {
            this.$refs.editOpportunity.show(data)
        },
        handleChange(i, data) {
            data.status = 0
            this.$refs.changeStage.show(i.id, data)
        },
        clearValue() {
            this.stageStatusValue = null
        },
        addFun() {
            console.log('getList in in in')
            this.$emit('sure')
        },
        async doChange(params) {
            let { code, msg } = await ModifyOpportunitiesStatus(params)

            if (code == 'success') {
                this.$message.success(msg)
                this.getList()
                this.$refs.changeStage.hide()
            } else {
                this.$message.error(msg)
            }
        },
        deleteRow(id) {
            this.$refs.deleteDialog.show(id)
        },
        async doDelete(id) {
            const {code, msg} = await DeleteOpportunities(id)
            if (code === 'success') {
                this.getList()
                this.$message.success(msg)
                this.$refs.deleteDialog.hide()
            } else {
                this.$message.error(msg)
            }
        },
        changeStatus(v, i) {
            let statusData = {
                stageId: v
            }

            this.stageListOptions.map(item => {
                if (v == item.sortId) {
                    statusData.status = item.defaultStatus
                }
            })

            this.$refs.confirmResult.show(statusData, i)
        },
        formatDate,
        handleSelect() {
            let offset = document.getElementsByClassName("boxWarp")[0].scrollTop
            let selectDom = document.getElementsByClassName('el-select-dropdown')

			if (offset >= 100 && selectDom && selectDom.length) {
                for (let i = 0; i < selectDom.length; i++) {
                    selectDom[i].style.display = 'none'
                }
            }
        },
    },
    filters: {
        getStatusText(status) {
            let result = ''

            if (status == 1) {
                result = '成交'
            } else if (status == 2) {
                result = '输单'
            } else if (status == 3) {
                result = '无效'
            }
            return result
        }
    },
    components: {
        EditOpportunity,
        ChangeStage,
        ConfirmResult,
        DeleteDialog
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleSelect, true);
    },
}
</script>
<style lang="less" scoped>
    @import url('./main');
</style>