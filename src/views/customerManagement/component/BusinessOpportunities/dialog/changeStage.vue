<template>
    <el-dialog
        class="change-stage"
        title="温馨提示"
        :visible.sync="changeStageDialogVisible"
        :close-on-click-modal="false"
        width="420px">
        <div class="box">
            <img src="../../../../../assets/images/icon_confirm.png" alt="">
            <span>是否更改阶段为“{{ stageName }}”？</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">否</el-button>
            <el-button type="primary" @click="doChange(params)">是</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: 'changeStage',
    data() {
        return {
            changeStageDialogVisible: false,
            params: {},
            stageName: ''
        }
    },
    inject: ['doChange'],
    methods: {
        show(id, data) {
            this.params = {
                id,
                stageNo: data.sortNo,
                status: data.status
            }
            this.stageName = data.stageName
            this.changeStageDialogVisible = true
        },
        hide() {
            this.changeStageDialogVisible = false
        },
    }
}
</script>
<style lang="less" scoped>
    .change-stage{
        .box {
            img, span {
                margin-right: 8px;
                vertical-align: middle;
            }
            img {
                width: 18px;
                height: 18px;
            }
        }
        /deep/ .el-dialog{
            border-radius: 8px;
            .el-dialog__header {
                padding: 16px 16px 0;
                .el-dialog__title {
                    font-size: 16px;
                }
            }
            .el-dialog__body {
                padding: 16px;
            }
            .el-button {
                width: 46px;
                height: 32px;
                padding: 0;
            }
            .el-button--primary {
                border-color: #4168F6;
                background-color: #4168F6;
            }
        }
    }
</style>