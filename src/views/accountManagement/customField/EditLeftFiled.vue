<template>
  <div class="add_filed">
    <el-dialog title="修改字段" :visible.sync="leftEdit" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <el-form :model="addCodeForm" :rules="editRules" ref="ruleForm" label-width="100px" label-position="right">
        <el-form-item label="字段名称:" prop="content">
          <el-input v-model.trim="addCodeForm.content" maxlength="10" @change="changeInput" placeholder="请输入名称，2-10个字" disabled></el-input>
        </el-form-item>
        <el-form-item label="字段类型:">
          <div class="tagName" v-for="(item,index) in addCodeForm.tagList" :key="index">
            <el-input v-model.trim="item.name" placeholder="请输入" @change="changeItem(item)" :disabled='!item.editable'></el-input>
            <img src="../../../assets/images/reduceone@2x.png" alt="" @click="reduceOne(item,index)"
                 v-if="addCodeForm.tagList.length > 1 && item.editable" />
          </div>
        </el-form-item>
      </el-form>
      <div class="btn_warp">
        <div class="codeBtn pointer" @click="addLabel">
          <img src="../../../assets/images/icon_add@2x.png" alt="" />
          添加选项
        </div>
        <span class="explanText">（最多可添加20个）</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button @click="dialogFormCancel">取 消</el-button>
          <el-button type="primary" v-preventReClick @click="dialogFormSure('ruleForm')">确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { fixedColumnList, fixedColumnEdit } from '../../../api/field'
export default {
  components: { Draggable },
  props: {
    leftEdit: {
      type: Boolean,
    },
    leftObj: {
      type: Object,
    },
  },

  data() {
    return {
      addCodeForm: {
        content: '',
        radio: '',
        tagList: [{ name: '' }],
      },
      sortOrder: 1,

      editRules: {
        content: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入字段名称',
          },
        ],
      },
      tempList: [],
      deletedIds: [],
    }
  },
  created() {
    // console.log('---this.leftObj---', this.leftObj)
    this.getChangeList()
  },
  watch: {},
  methods: {
    getChangeList() {
      this.addCodeForm.content = this.leftObj.columnName
      fixedColumnList({ type: this.leftObj.columnValue }).then((res) => {
        this.addCodeForm.tagList = res.data
        this.tempList = JSON.parse(JSON.stringify(res.data))
      })
    },
    dialogFormCancel() {
      this.addCodeForm = {}
      this.$emit('sureDialog')
    },
    changeRadio() {
      this.addCodeForm.tagList = [{ name: '' }]
    },
    dialogFormSure(formName) {
      console.log(this.addCodeForm.tagList, this.tempList)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            commonVOS: this.addCodeForm.tagList,
            deletedIds: this.deletedIds,
            type: this.leftObj.columnValue,
          }
          fixedColumnEdit(params).then((res) => {
            if (res.result) {
              this.$emit('sureDialog')
            }
          })
        }
      })
    },
    changeInput() {},
    changeItem(item) {},
    addLabel() {
      this.sortOrder++
      if (this.addCodeForm.tagList.length < 20) {
        this.addCodeForm.tagList.push({
          name: '',
          editable: true,
        })
      }
    },
    reduceOne(item, index) {
      console.log(item)
      this.addCodeForm.tagList.splice(index, 1)
      this.deletedIds.push(item.id)
    },
  },
}
</script>
<style lang="less" scoped>
.add_filed {
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
    .el-form-item {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-dialog__body {
      max-height: 496px;
      overflow-y: scroll;
      padding: 16px;
      .btn_warp {
        display: flex;
        .codeBtn {
          width: 104px;
          height: 32px;
          background: rgba(65, 104, 246, 0.04);
          border-radius: 4px;
          border: 1px solid #4168f6;
          text-align: center;
          color: #4168f6;
          line-height: 32px;
          margin-left: 100px;
          img {
            width: 12px;
            height: 12px;
          }
        }
        .explanText {
          font-size: 14px;
          color: #c0c4cc;
          line-height: 30px;
        }
      }
      .tagName {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        img {
          margin-left: 10px;
          width: 14px;
          height: 14px;
        }
      }
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
    }
    .el-input,
    .el-select,
    .el-input__inner {
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      width: 302px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .deletetext {
          color: #4168f6;
          cursor: pointer;
        }
      }
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
  /deep/.el-radio__input.is-checked + .el-radio__label {
    color: #4168f6;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #4168f6;
    background: #4168f6;
  }
}
</style>
