<template>
  <div class="edit_dialog">
    <el-dialog title="编辑渠道" :visible.sync="dialogFormVisible" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <el-form :model="editForm" :rules="editRules" label-width="84px" label-position="right">
        <el-form-item label="渠道名称:" prop='name'>
          <el-input v-model="editForm.name" maxlength="15" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="欢迎语:">
          <el-input show-word-limit v-model="editForm.welText" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
    },
    editForm: {
      type: Object,
    },
  },

  data() {
    return {
      // editForm: {
      //   name: '',
      //   welText: '',
      // },
      editRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
      },
    }
  },
  created() {
    // this.editForm = this.row
    // console.log('---------', this.editForm, this.row)
  },
  methods: {
    userChange(val) {
      console.log(val)
    },
    organChagne() {},

    dialogFormCancel() {
      this.$confirm('是否取消编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // iconClass:''
      }).then(() => {
        this.$emit('closeDialog')
        this.$message({
          type: 'success',
          message: '已取消!',
        })
      })
    },
    dialogFormSure() {
      this.$confirm('是否保存编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // iconClass:''
      })
        .then(() => {
          let params = this.editForm
          this.$network
            .post('/user-service/channel/updChannel', params)
            .then((res) => {
              this.$emit('closeDialog')
              this.$message({
                type: 'success',
                message: '保存成功!',
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存',
          })
        })
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    height: 500px;
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
      .el-textarea__inner {
        height: 236px !important;
      }
    }
    .el-form-item {
      margin-bottom: 20px;
      height: 32px;
    }
    .el-form-item__content {
      line-height: 32px;
    }
    .el-form-item__label {
      line-height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3c4353;
      padding: 0 12px 0 0;
    }
    .el-input,
    .el-select,
    .el-input__inner {
      width: 404px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
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
