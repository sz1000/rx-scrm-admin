<template>
  <div class="rename_warp">
    <el-dialog title="分组重命名"
               :visible.sync="dialogName"
               width="520px"
               :close-on-click-modal='false'
               :before-close="dialogBeforeClose">
      <div class="input_text">
        <span class="groupname"><span>*</span>分组名称:</span>
        <el-input v-model="newlabel"
                  placeholder=""
                  show-word-limit
                  maxlength="20"
                  @change="changeName"></el-input>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogBeforeClose">取 消</el-button>
        <el-button type="primary"
                   @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogName: {
      type: Boolean,
    },
    oldLabel: {
      type: Object,
    },
    groupType: {
      type: String,
    },
  },
  data() {
    return {
      newlabel: '',
    }
  },
  created() {
    // console.log(this.oldLabel)
    this.newlabel = this.oldLabel.name
  },
  methods: {
    changeName(val) {
      this.newlabel = val
    },
    dialogBeforeClose() {
      this.$emit('closeRename')
    },

    save() {
      this.oldLabel.name = this.newlabel
      // console.log(this.oldLabel)
      if (this.oldLabel.name == '') {
        this.$message({
          type: 'error',
          message: '请填写分组名称',
        })
      } else {
        this.$network
          .post('/material-service/verbaltrickgroup/update', this.oldLabel)
          .then((res) => {
            this.$emit('closeRename')
            this.$message({
              type: 'success',
              message: '操作成功',
            })
          })
      }
    },
  },
}
</script>
<style lang="less" scoped>
.rename_warp {
  /deep/.el-dialog {
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
      height: 185px;
      .input_text {
        display: flex;
        margin-top: 20px;
        .groupname {
          display: inline-block;
          width: 90px;
          line-height: 32px;
          span {
            color: red;
            vertical-align: -5%;
          }
        }
      }
      .el-input__inner {
      }
    }
    .el-dialog__footer {
      padding: 0;
    }
    .dialog-footer {
      height: 64px;
      line-height: 64px;
      padding-right: 16px;
      border-top: 1px solid #f0f2f7;
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