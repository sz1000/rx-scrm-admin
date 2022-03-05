<template>
    <el-dialog
        class="modify-stage"
        title="编辑阶段"
        :visible.sync="ModifyStageDialogVisible"
        :close-on-click-modal="false"
        @close="hide"
        :destroy-on-close="true"
        width="520px">
        <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="90px"
            label-position="right"
        >
             <el-form-item v-if="isEnd" label="默认状态:" prop="defaultStatus">
                <span>{{ form.defaultStatus }}</span>
            </el-form-item>
            <el-form-item label="阶段名称:" prop="name">
                <el-input
                    v-model.trim="form.name"
                    placeholder="请输入"
                    maxlength="30"
                    minlength="2"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="阶段说明:" prop="explain">
                <el-input
                    type="textarea"
                    class="text-area"
                    :rows="10"
                    v-model.trim="form.explain"
                    placeholder="请输入阶段说明"
                    maxlength="200"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item v-if="isEnd && form.defaultStatus != '成交'" label="阶段原因:" prop="stageReasonRelList">
                <div v-for="(i, index) in form.stageReasonRelList" :key="i.id">
                    <el-input
                        v-model.trim="i.content"
                        class="reason-inp"
                        placeholder="请输入"
                        maxlength="30"
                        clearable
                    ></el-input>
                    <img v-show="form.stageReasonRelList.length > 1" @click="removeReason(index)" class="delete-btn pointer" src="../../../assets/images/reduceone@2x.png" alt="">
                </div>
                <div v-if="form.stageReasonRelList.length < 10" class="add-btn pointer" @click="addReason">
                    <img src="../../../assets/images/icon_add@2x.png" alt="" />
                    <span>添加原因</span>
                </div>
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
import { ModifyBusinessOpportunities } from "../../../config/api"
import { throttle } from "../../../utils/tool"

export default {
    name: 'modifyStage',
    data() {
        return {
            ModifyStageDialogVisible: false,
            isEnd: false,
            form: {
                defaultStatus: '',
                name: '',
                explain: '',
                stageReasonRelList: [
                    {
                        id: null,
                        content: '',
                        sortNo: 0,
                        stageId: null
                    }
                ]
            },
            rules: {
                name: [
                    { required: true, message: '请输入阶段名称', trigger: ['blur', 'change']},
                    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: ['blur', 'change']}
                ],
                explain: [
                    { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: ['blur', 'change']}
                ]
            }
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    inject: ['getList'],
    methods: {
        show(isEnd, formData) {
            this.isEnd = isEnd
            this.form = JSON.parse(JSON.stringify(formData))
            if (isEnd) {
                let item = {
                    id: null,
                    content: '',
                    sortNo: 0,
                    stageId: null
                }
                if (!this.form.stageReasonRelList || !this.form.stageReasonRelList.length) {
                    this.form.stageReasonRelList = new Array(item)
                }
            }

            this.ModifyStageDialogVisible = true
        },
        hide() {
            this.initForm()
            this.ModifyStageDialogVisible = false
        },
        initForm() {
            this.form = {
                defaultStatus: '',
                name: '',
                explain: '',
                stageReasonRelList: [
                    {
                        id: null,
                        content: '',
                        sortNo: 0,
                        stageId: null
                    }
                ]
            }
        },
        addReason() {
            let item = {
                id: null,
                content: '',
                sortNo: this.form.stageReasonRelList.length,
                stageId: null
            }

            this.form.stageReasonRelList.push(item)
        },
        removeReason(index) {
            this.form.stageReasonRelList.splice(index, 1)
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
        async confirm() {
            if(!throttle()) {
                return
            }
            this.validate().then(async () => {
                this.form.isEnd = this.isEnd
                this.form.corpId = this.corpId
                if(this.isEnd) {
                    this.form.stageReasonRelList = this.form.stageReasonRelList.filter(item => { return !!item.content })
                }

                let { code, msg } = await ModifyBusinessOpportunities(this.form)

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
        }
    }
}
</script>
<style lang="less" scoped>
    .modify-stage {
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
                .el-input, .el-select {
                    width: 86%;
                    .el-input__inner {
                        height: 32px;
                        line-height: 32px;
                    }
                    .el-input__icon {
                        line-height: 32px;
                    }
                }
                .el-textarea {
                    width: 86%;
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
        .reason-inp {
            margin-bottom: 16px;
        }
        .add-btn {
            width: 103px;
            height: 32px;
            padding: 0 12px;
            background: rgba(65, 104, 246, 0.04);
            border-radius: 4px;
            border: 1px solid #4168f6;
            img {
                width: 12px;
                height: 12px;
            }
            span {
                margin-left: 6px;
                line-height: 32px;
                font-size: 14px;
                color: #4168f6;
            }
        }
        .delete-btn {
            width: 12px;
            height: 12px;
            margin-left: 16px;
        }
    }
</style>