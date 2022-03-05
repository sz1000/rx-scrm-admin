<template>
  <div class="edit_dialog">
    <el-dialog title="新建跟进"
               :visible.sync="followDialog"
               :before-close="dialogFormCancel"
               :close-on-click-modal='false'
               width="520px">
      <el-input v-model="input1"
                type="textarea"
                maxlength="300"
                show-word-limit
                autosize
                placeholder="记录好跟进，多签单哟"></el-input>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogFormSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    followDialog: {
      type: Boolean,
    },
  },

  data() {
    return {
      input1: '',
    }
  },
  created() {
    console.log(this.$route.query)
  },
  methods: {
    dialogFormCancel() {
      this.$emit('shutDown')
    },
    dialogFormSure() {
      let params = {
        context: this.input1,
        clueCustomerNo: this.$route.query.customno,
      }
      this.$network
        .post('/customer-service/cluecustomer/addMessage', params)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '保存成功!',
          })
          this.$emit('shutDown')
        })
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    height: 400px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #3c4353;
      }
    }
    .el-dialog__body {
      padding: 16px;
    }
    .el-textarea__inner {
      height: 236px !important;
    }
    .el-dialog__footer {
      position: absolute;
      bottom: 16px;
      right: 16px;
      .el-button {
        width: 60px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        padding: 0;
        border: 1px solid #d9dae4;
      }
      .el-button--primary {
        background: #4168f6;
      }
    }
  }
}
</style>
