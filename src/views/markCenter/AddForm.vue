<template>
  <div class="edit_dialog">
    <el-dialog title="新增企业活码" :visible.sync="addVisible" :before-close="dialogFormCancel" :close-on-click-modal="false" width="520px">
      <el-form :model="addCodeForm" :rules="editRules" label-width="90px" label-position="right">
        <el-form-item label="活码名称:" prop="name">
          <el-input show-word-limit v-model="addCodeForm.name" maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="使用员工:" prop="value1">
          <el-select v-model="addCodeForm.value1" multiple collapse-tags placeholder="请选择" @change="userChange" clearable>
            <el-option v-for="item in organOption" :key="item.value" :label="item.name" :value="item.userNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加设置:">
          <el-checkbox v-model="addCodeForm.checked" true-label="1" false-label="0" @change="checkChange">设置添加时无需经过确认自动成为好友</el-checkbox>
        </el-form-item>
        <!-- <span class="rulesChannel">*</span> -->
        <el-form-item label="渠道:" prop="region" class="channelItem">
          <el-dropdown trigger="click" :hide-on-click="true" placement="bottom-start">
            <span class="el-dropdown-link">
              <div class="channelLink" @mouseover="showIcon = false" @mouseleave="showIcon = true">
                <span class="channelName">{{ addCodeForm.region }}</span>
                <i class="el-icon-arrow-down el-icon--right" v-if="showIcon">
                </i>
                <i class="el-icon-circle-close pointer" v-else @click="clearInput">
                </i>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown" class="channelMenu">
              <div @click="add" class="channelBtn">
                <i class="el-icon-plus"></i>
                添加渠道
              </div>
              <div class="addinput">
                <el-input v-model="addInput" placeholder="输入后回车完成" v-show="showInput" maxlength="15" @keydown.enter.native="newItem"></el-input>
              </div>
              <el-dropdown-item v-for="(item, index) in items" :key="index" @click.native="selectInput(item)">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input show-word-limit v-model="addCodeForm.remark" type="textarea" maxlength="200"></el-input>
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
    addVisible: {
      type: Boolean,
    },
  },

  data() {
    return {
      addCodeForm: {
        value1: [],
        checked: '1',
        region: '',
        remark: '',
        channel: '',
        chId: '',
        name: '',
      },
      userEntityList: [],
      options: [],
      organOption: [],
      showIcon: null,
      showInput: false,
      items: [
        // { name: '哈哈哈' },
        // { name: '阿达' },
        // { name: '是大概多少' },
        // { name: '给对方s' },
      ],
      addInput: '',
      editRules: {
        name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入活码名称',
          },
        ],
        value1: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入姓名',
          },
        ],
        region: [{ validator: this.resign, required: true }],
      },
    }
  },
  created() {
    this.getSelectDate()
  },
  methods: {
    resign(rule, value, callback) {
      // console.log(this.addCodeForm.region, value)
      if (this.addCodeForm.region) {
        return
      }
    },
    getSelectDate() {
      this.$network
        .get('/user-service/livecode/toadd', { name: this.addInput })
        .then((res) => {
          // console.log('-----res-----', res)
          this.organOption = res.data.userlist
          this.items = res.data.chlist
          this.items.forEach((v) => {
            if (v.name === this.addInput) {
              this.addCodeForm.chId = v.chId
            }
          })
          if (!res.result) {
            this.addCodeForm.region = ''
            this.$message({
              message: res.msg,
              type: 'error',
            })
          }
        })
    },
    userChange(val) {
      this.addCodeForm.value1 = val
      // this.userEntityList = val.map((item) => {
      //   // tempObj.userNo = item
      //   return { userNo: item }
      // })
      // console.log('---', this.userEntityList)
    },
    organChagne(val) {
      // console.log('----val---', val)
      // this.addCodeForm.region = val
    },
    checkChange(val) {
      // console.log(val)
    },
    dialogFormCancel() {
      this.$confirm('是否取消新增内容', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'remindicon',
      })
        .then(() => {
          this.$emit('closeAddForm')
          this.$message({
            type: 'success',
            message: '已取消!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消',
          })
        })
    },
    dialogFormSure() {
      this.$confirm('是否保存新增内容', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'remindicon',
      }).then(() => {
        let params = {
          livecodeEntity: {
            chId: this.addCodeForm.chId,
            remark: this.addCodeForm.remark,
            status: this.addCodeForm.checked,
            name: this.addCodeForm.name,
          },
          userArr: this.addCodeForm.value1,
        }

        this.$network
          .post('/user-service/livecode/addLivecode', params)
          .then((res) => {
            this.$emit('closeAddForm')
            this.$message({
              type: 'success',
              message: '保存成功!',
            })
          })
      })
    },
    add() {
      this.showInput = true
      this.addInput = ''
    },
    selectInput(item) {
      // console.log(item)
      this.addCodeForm.region = item.name
      this.addCodeForm.chId = item.chId
      this.resign()
    },
    newItem() {
      this.addCodeForm.region = this.addInput
      this.showInput = false
      // this.items.push({ name: this.addCodeForm.region })
      this.getSelectDate()
      this.resign()
    },
    clearInput() {
      this.addCodeForm.region = ''
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    // height: 500px;
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
      height: 387px;
      overflow: auto;
      padding: 16px;
      .el-textarea__inner {
        height: 100px !important;
      }
      .el-dropdown {
        width: 100%;
        .channelLink {
          // width: 406px;
          padding-left: 16px;
          height: 32px;
          background: #ffffff;
          // box-shadow: 0px 3px 40px 0px rgba(0, 0, 0, 0.04);
          border-radius: 4px;
          border: 1px solid #d9dae4;
          .channelName {
            display: inline-block;
            // width: 360px;
            width: 90%;
          }
        }
      }
    }

    .channelItem {
      // font-size: 0;
      position: relative;
      .el-dropdown-link {
        &:focus-visible {
          outline: none !important;
        }
      }
    }

    .rulesChannel {
    }
    .el-form-item {
      margin-bottom: 20px;
      line-height: 32px;
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
      line-height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
      // position: absolute;
      // bottom: 16px;
      // right: 16px;
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
.channelMenu .el-input .el-input__inner {
  border: none;
  background: #f4f6fe;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #4168f6 !important;
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #4168f6 !important;
}
</style>
