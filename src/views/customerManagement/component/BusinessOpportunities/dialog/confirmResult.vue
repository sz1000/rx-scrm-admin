<template>
    <el-dialog
        class="confirm-result"
        :title="`确定${status}`"
        :visible.sync="confirmResultDialogVisible"
        :close-on-click-modal="false"
        @close="hide"
        :destroy-on-close="true"
        width="520px">
        <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="100px"
            label-position="right"
        >
            <template v-if="status == '成交'">
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
                <el-form-item label="商机金额:" prop="price">
                    <el-input-number
                        v-model="form.price"
                        placeholder="请输入"
                        :min="0"
                        :max="99999999999999999999"
                        :precision="2"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="成交时间:" prop="endTime">
                    <el-date-picker
                        v-model="form.endTime"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </template>
            <template v-if="status == '输单'">
                <el-form-item label="输单原因:" prop="endReasonId">
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
            <template v-if="status == '无效'">
                <el-form-item label="无效原因:" prop="endReasonId">
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
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { StageReasonList, ChargeUserInfoList, UsersList, ModifyOpportunities } from "../../../../../config/api"

export default {
    name: 'confirmResult',
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
            status: null,
            stageId: null,
            confirmResultDialogVisible: false,
            form: {
                chargeUserNo: '',
                price: null,
                endTime: null,
                endReasonId: null,
                endRemarks: null
            },
            chargeUserInfoListOptions: [],
            reasonOptions: [],
            rules: {
                chargeUserNo: [
                    { required: true, message: '请选择商机负责人', trigger: ['change']}
                ],
                price: [
                    { required: true, message: '请输入商机金额', trigger: ['blur', 'change']}
                ],
                endTime: [
                    { required: true, message: '请选择成交时间', trigger: ['change']}
                ],
                endReasonId: [
                    { required: true, message: '请选择原因', trigger: ['change']}
                ],
            }
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    inject: ['getList'],
    methods: {
        show(statusData, formData) {
            const {stageId, status} = statusData
            this.stageId = stageId
            this.status = status
            this.form = JSON.parse(JSON.stringify(formData))
            if (this.status == '成交') {
                this.chargeUserInfoList()
            } else {
                this.stageReasonList()
            }
            this.confirmResultDialogVisible = true
        },
        hide() {
            this.initForm()
            this.confirmResultDialogVisible = false
        },
        initForm() {
            this.form = {
                chargeUserNo: '',
                price: null,
                endTime: null,
                endReasonId: null,
                endRemarks: null
            }
        },
        // 获取阶段原因列表
        async stageReasonList() {
            let { code, data } = await StageReasonList(this.stageId)

            if (code == 'success') {
                this.reasonOptions = data
            }
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
        async confirm() {
            this.validate().then(async () => {
                this.form.corpId = this.corpId
                this.form.customerNo = this.customerNo
                this.form.status = this.status == '成交' ? 1 : this.status == '输单' ? 2 : this.status == '无效' ? 3 : 0

                this.form.chargeUserNo && this.chargeUserInfoListOptions && this.chargeUserInfoListOptions.map(item => {
                    if (item.userNo == this.form.chargeUserNo) {
                        this.form.chargeUserName = item.name
                    }
                })

                let { code, msg } = await ModifyOpportunities(this.form)

                if (code == 'success') {
                    this.getList(this.isEnd)
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
    .confirm-result {
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