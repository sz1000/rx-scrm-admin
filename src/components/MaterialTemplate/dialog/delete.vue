<template>
    <el-dialog
        class="mt-delete"
        title="温馨提示"
        :visible.sync="deleteDialogVisible"
        :close-on-click-modal="false"
        width="420px">
        <div class="box">
            <img src="../../../assets/images/icon_error@2x.png" alt="">
            <span>是否确认删除？</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="hide">否</el-button>
            <el-button type="primary" @click="doDelete(id)">是</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: 'mtDelete',
    data() {
        return {
            deleteDialogVisible: false,
            id: ''
        }
    },
    inject: ['doDelete'],
    methods: {
        show(data) {
            this.id = data
            this.deleteDialogVisible = true
        },
        hide() {
            this.deleteDialogVisible = false
        },
    }
}
</script>
<style lang="less" scoped>
    .mt-delete{
        margin-top: 20vh;
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
                border-color: #D14343;
                background-color: #D14343;
            }
        }
    }
</style>