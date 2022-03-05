<template>
    <el-dialog
        class="edit-opportunity"
        :title="title"
        :visible.sync="editOpportunityDialogVisible"
        :close-on-click-modal="false"
        @close="hide"
        :destroy-on-close="true"
        width="520px">
        <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="110px"
            label-position="right"
        >
            <el-form-item label="商机名称:" prop="name">
                <el-input
                    v-model.trim="form.name"
                    placeholder="请输入"
                    minlength="2"
                    maxlength="30"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="商机金额:" prop="price">
                <el-input-number
                    v-model="form.price"
                    placeholder="请输入"
                    :min="0"
                    :max="99999999999999999999"
                    :precision="2"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="预计成交时间:" prop="expectEndTime">
                <el-date-picker
                    v-model="form.expectEndTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进阶段:" prop="stageNo">
                <el-select 
                    v-model="form.stageNo"
                    placeholder="请选择"
                    @change="changeStage"
                    clearable>
                    <el-option 
                        v-for="item in stageListOptions"
                        v-show="item.stageName && item.sortNo"
                        :key="item.sortNo" 
                        :label="item.stageName"
                        :value="item.sortNo">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商机负责人:" prop="chargeUserNo">
                <el-select 
                    v-model="form.chargeUserNo"
                    placeholder="请选择"
                    clearable>
                    <el-option 
                        v-for="item in chargeUserInfoListOptions"
                        v-show="item.name && item.userNo"
                        :key="item.userNo" 
                        :label="item.name"
                        :value="item.userNo">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="opportunityStatus == 1" label="成交时间:" prop="endTime">
                <el-date-picker
                    v-model="form.endTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-if="opportunityStatus == 2 || opportunityStatus == 3" label="结束时间:" prop="endTime">
                <el-date-picker
                    v-model="form.endTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <template v-if="opportunityStatus == 2 || opportunityStatus == 3">
                <el-form-item :label="opportunityStatus == 2 ? '输单原因:' : '无效原因:'" prop="endReasonId">
                    <el-select 
                        v-model="form.endReasonId"
                        placeholder="请选择"
                        clearable>
                        <el-option 
                            v-for="item in reasonOptions"
                            v-show="item.content && item.id"
                            :key="item.id" 
                            :label="item.content"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="opportunityStatus == 2">
                <el-form-item label="输单备注:" prop="endRemarks">
                    <el-input
                        type="textarea"
                        class="text-area"
                        :rows="10"
                        v-model="form.endRemarks"
                        placeholder="请输入"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </template>

            <template v-if="opportunityStatus == 3">
                <el-form-item label="无效备注:" prop="endRemarks">
                    <el-input
                        type="textarea"
                        class="text-area"
                        :rows="10"
                        v-model="form.endRemarks"
                        placeholder="请输入"
                        maxlength="200"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </template>
            <el-form-item label="备注:" prop="remarks">
                <el-input
                    type="textarea"
                    class="text-area"
                    :rows="10"
                    v-model="form.remarks"
                    placeholder="请输入"
                    maxlength="200"
                    show-word-limit
                ></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { ChargeUserInfoList, UsersList, StageReasonList, AddOpportunities, ModifyOpportunities } from "../../../../../config/api"

export default {
    name: 'editOpportunity',
    props: {
        customerNo: {
            type: String,
            default: ''
        },
        formType: {
            type: String,
            default: '3' // 3: 我的客户，4: 客户公海
        }
    },
    data() {
        return {
            title: '新建商机',
            id: null,
            opportunityStatus: null,
            editOpportunityDialogVisible: false,
            form: {
                name: '',
                price: null,
                expectEndTime: null,
                stageNo: null,
                chargeUserNo: null,
                chargeUserName: '',
                remarks: '',
                endTime: null,
                endReasonId: null,
                endRemarks: ''
            },
            reasonOptions: [],
            stageListOptions: [],
            chargeUserInfoListOptions: [],
            rules: {
                name: [
                    { required: true, message: '请输入商机名称', trigger: ['blur', 'change']},
                    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: ['blur', 'change']}
                ],
                stageNo: [
                    { required: true, message: '请选择跟进阶段', trigger: ['change']}
                ],
                chargeUserNo: [
                    { required: true, message: '请选择商机负责人', trigger: ['change']}
                ],
                endTime: [
                    { required: true, message: '请选择时间', trigger: ['change']}
                ],
                endReasonId: [
                    { required: true, message: '请选择原因', trigger: ['change']}
                ]
            }
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    inject: ['getList', 'opportunitiesStageList'],
    methods: {
        show(formData) {
            this.initStatus(formData)
            this.chargeUserInfoList()
            this.editOpportunityDialogVisible = true
        },
        hide() {
            this.initForm()
            this.editOpportunityDialogVisible = false
        },
        initStatus(formData) {
            if (formData && formData.id) {
                this.id = formData.id
                this.title = '编辑商机'
                const { status } = formData
                
                this.opportunityStatus = status  //0：跟进中；1：成交；2：输单；3：无效
                this.form = JSON.parse(JSON.stringify(formData))
                this.stageReasonList(this.form.sortId)
                this.opportunitiesStageList(this.getStageListOptions, '')
            } else {
                this.id = null
                this.title = '新建商机'
                this.opportunityStatus = -1 // 新建
                this.opportunitiesStageList(this.getStageListOptions, false)
            }
        },
        initForm() {
            this.form = {
                name: '',
                price: null,
                expectEndTime: null,
                stageNo: null,
                chargeUserNo: null,
                chargeUserName: '',
                remarks: '',
                endTime: null,
                endReasonId: null,
                endRemarks: ''
            }
        },
        // 获取阶段原因列表
        async stageReasonList(sortId) {
            let { code, data } = await StageReasonList(sortId)

            if (code == 'success') {
                this.reasonOptions = data
            }
        },
        // 获取商机阶段标签列表
        getStageListOptions(data) {
            this.stageListOptions = data
        },
        // 获取商机负责人列表
        async chargeUserInfoList() {
            let ApiOpts = null, params = null

            if(this.formType == '3') {
                ApiOpts = ChargeUserInfoList
                params = this.customerNo
            } else if(this.formType == '4') {
                ApiOpts = UsersList
                params = this.corpId
            }

            let { code, data } = await ApiOpts(params)

            if (code == 'success') {
                this.chargeUserInfoListOptions = data
            }
        },
        changeStage(v) {
            this.stageListOptions.map(item => {
                if (item.sortNo == v) {
                    this.stageReasonList(item.sortId)
                    if (item.defaultStatus == '成交') {
                        this.opportunityStatus = 1
                    } else if (item.defaultStatus == '输单') {
                        this.opportunityStatus = 2
                        this.form.endReasonId = null
                    } else if (item.defaultStatus == '无效') {
                        this.opportunityStatus = 3
                        this.form.endReasonId = null
                    } else {
                        this.opportunityStatus = this.id ? 0 : -1
                    }
                }
            })
        },
        async confirm() {
            this.validate().then(async () => {
                this.form.corpId = this.corpId
                this.form.customerNo = this.customerNo
                this.form.status = this.opportunityStatus > -1 ? this.opportunityStatus : this.form.status
                this.form.stageNo = this.opportunityStatus > 0 ? '' : this.form.stageNo

                this.form.chargeUserNo && this.chargeUserInfoListOptions && this.chargeUserInfoListOptions.map(item => {
                    if (item.userNo == this.form.chargeUserNo) {
                        this.form.chargeUserName = item.name
                    }
                })

                let ApiOpt = null

                if (this.form.id) {
                    ApiOpt = ModifyOpportunities
                } else {
                    ApiOpt = AddOpportunities
                }

                let { code, msg } = await ApiOpt(this.form)

                if (code == 'success') {
                    this.$emit('sure')
                    this.getList()
                    this.$message.success(msg)
                    this.hide()
                } else {
                    this.$message.error(msg)
                }
            }).catch(err => {
                console.warn(err);
            })
        },
        validate() {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        resolve(this.form);
                    } else {
                        reject('请完善表单');
                    }
                });
            })
        },
    }
}
</script>
<style lang="less" scoped>
    .edit-opportunity {
        /deep/ .el-dialog{
            border-radius: 8px;
            overflow: hidden;
            .el-dialog__header {
                padding: 14px 16px;
                background-color: #fafbff;
                border-bottom: 1px solid #F0F2F7;
                .el-dialog__title {
                    font-size: 16px;
                }
            }
            .el-dialog__body {
                min-height: 185px;
                padding: 32px 16px;
                .el-form-item {
                    margin-bottom: 20px;
                    .el-form-item__label {
                        line-height: 32px;
                        font-weight: 500;
                    }
                    .el-form-item__content {
                        line-height: 32px;
                    }
                }
                .el-input-number {
                    width: 100%;
                    .el-input__inner {
                        padding: 0 15px;
                        text-align: left;
                    }
                }
                .el-input-number__decrease, .el-input-number__increase {
                    display: none;
                }
                .el-input, .el-select {
                    width: 100%;
                    .el-input__inner {
                        height: 32px;
                        line-height: 32px;
                    }
                    .el-input__icon {
                        line-height: 32px;
                    }
                }
                .el-textarea {
                    width: 100%;
                }
                .el-textarea__inner {
                    font-family: PingFangSC-Regular, PingFang SC;
                }
            }
            .el-dialog__footer {
                padding: 16px;
                border-top: 1px solid #F0F2F7;
                .el-button {
                    height: 32px;
                    padding: 0 16px;
                }
                .el-button--primary {
                    border-color: #4168F6;
                    background-color: #4168F6;
                }
            }
        }
    }
</style>