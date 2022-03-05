<template>
  <div class="edit_dialog">
    <el-dialog title="新增渠道" :visible.sync="addChannel" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <el-form :model="addCodeForm" :rules="editRules" ref="ruleForm" label-width="90px" label-position="right">
        <el-form-item label="渠道名称:" prop='name'>
          <el-input v-model.trim="addCodeForm.name" placeholder="请输入渠道名称" maxlength="15" minlength="2"></el-input>
        </el-form-item>
        <el-form-item label="欢迎语:">
          <el-input show-word-limit v-model="addCodeForm.welText" type="textarea" maxlength="200" placeholder="快来设置欢迎语吧~ 设置个性化欢迎语，扫描该员工活码
添加的客户，将自动推送该欢迎语"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    addChannel: {
      type: Boolean,
    },
  },

  data() {
    return {
      addCodeForm: {
        name: '',
        welText: '',
      },

      editRules: {
        name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入渠道名称',
          },
        ],
      },
    }
  },
  created() {},
  methods: {
    dialogFormCancel() {
      this.addCodeForm = {}
      this.$emit('closeAddChannel')
    },
    dialogFormSure(formName) {
      let createBy = localStorage.getItem('user_no')
      let params = { ...this.addCodeForm, createBy: createBy }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$network
            .post('/user-service/channel/addChannel', params)
            .then((res) => {
              this.$emit('closeAddChannel')
              this.addCodeForm = {}
            })
        } else {
          console.log('error submit!!')
          return false
        }
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
