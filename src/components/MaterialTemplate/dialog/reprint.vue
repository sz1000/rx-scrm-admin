<template>
  <el-dialog class="mt-reprint" title="转载公众号文章" :visible.sync="reprintDialogVisible" :close-on-click-modal="false" width="520px">
    <el-form :model="form" label-width="80px" label-position="right">
      <el-form-item label="输入链接:" prop="reprintLink">
        <el-input v-model="form.reprintLink" placeholder="请输入链接" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'mtReprint',
  data() {
    return {
      reprintDialogVisible: false,
      form: {
        reprintLink: '',
      },
      isPublic: '',
    }
  },
  methods: {
    show(isPublic) {
      console.log(isPublic)
      this.isPublic = isPublic
      this.reprintDialogVisible = true
    },
    hide() {
      this.reprintDialogVisible = false
    },
    async confirm() {
      const params = {
        articleUrl: encodeURIComponent(window.btoa(this.form.reprintLink)),
        tab: this.isPublic,
      }
      console.log(params)
      this.$router.push({
        path: '/interactivemarketing/editArticle',
        query: params,
      })
    },
  },
}
</script>
<style lang="less" scoped>
.mt-reprint {
  /deep/ .el-dialog {
    border-radius: 8px;
    overflow: hidden;
    .el-dialog__header {
      padding: 14px 16px;
      background-color: #fafbff;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
      }
    }
    .el-dialog__body {
      min-height: 185px;
      padding: 32px 16px;
      .el-form-item {
        height: 32px;
        margin-bottom: 20px;
        .el-form-item__label {
          line-height: 32px;
          font-weight: 500;
        }
        .el-form-item__content {
          line-height: 32px;
        }
      }
      .el-input,
      .el-select {
        width: 100%;
        .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
        .el-input__icon {
          line-height: 32px;
        }
      }
    }
    .el-dialog__footer {
      padding: 16px;
      border-top: 1px solid #f0f2f7;
      .el-button {
        height: 32px;
        padding: 0 16px;
      }
      .el-button--primary {
        border-color: #4168f6;
        background-color: #4168f6;
      }
    }
  }
}
</style>