<template>
  <div class="edit_dialog">
    <el-dialog title="编辑企微活码" :visible.sync="dialogFormVisible" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <el-form :model="editForm" :rules="editRules" ref='editForm' label-width="90px" label-position="right">
        <el-form-item label="创建人员:">
          <span>{{ editForm.createBy }}</span>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{formatDate( editForm.createTime ,'yyyy-MM-dd')}}</span>
        </el-form-item>
        <el-form-item label="活码名称:" prop="name">
          <el-input show-word-limit v-model="editForm.name" maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="使用员工:" prop="value1">
          <el-select v-model="editForm.value1" collapse-tags multiple placeholder="请选择" @change="userChange" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.userNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道:" prop="chId">
          <el-select v-model="editForm.chId" @change="organChagne" clearable>
            <el-option v-for="item in organOption" :key="item.value" :label="item.name" :value="item.chId">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="渠道"
                      prop="region"
                      class="channelItem">
          <el-dropdown trigger="click"
                       :hide-on-click="true"
                       placement='bottom-start'>
            <span class="el-dropdown-link">
              <div class="channelLink"
                   @mouseover='showIcon=false'
                   @mouseleave='showIcon=true'>
                <span class="channelName">{{editForm.region}}</span>
                <i class="el-icon-arrow-down el-icon--right"
                   v-if='showIcon'>
                </i>
                <i class="el-icon-circle-close pointer"
                   v-else
                   @click="clearInput">
                </i>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown"
                              class="channelMenu">
              <div @click="add"
                   class="channelBtn">
                <i class="el-icon-plus"></i>
                添加渠道
              </div>
              <div class="addinput">
                <el-input v-model="addInput"
                          placeholder="输入后回车完成"
                          v-show="showInput"
                          maxlength="15"
                          @keydown.enter.native="newItem"></el-input>
              </div>
              <el-dropdown-item v-for="(item,index) in items"
                                :key="index"
                                @click.native="selectInput(item)">{{item.name}}</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item> -->
        <el-form-item label="备注:">
          <el-input show-word-limit v-model="editForm.remark" type="textarea" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from '../../utils/tool'
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
      //   value1: [],
      //   region: '',
      //   aaa: 'hahaha',
      //   bbb: '2021-08-01 12:30:30',
      //   remark: '',
      // },
      options: [],
      organOption: [],
      editRules: {
        name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入活码名称',
          },
        ],
        value1: [{ required: true, trigger: 'blur', message: '请选择员工' }],
        chId: [{ required: true, trigger: 'blur', message: '请选择渠道' }],
      },
      userEntityList: [],
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    formatDate,
    getSelect() {
      this.$network.get('/user-service/livecode/toadd').then((res) => {
        this.organOption = res.data.chlist
        this.options = res.data.userlist
        let tempArr = this.editForm.userNames.split(',')
        // console.log('----finalArr', tempArr)
        let finalArr = this.options.filter(
          (item) => tempArr.indexOf(item.name) > -1
        )
        this.editForm.value1 = finalArr.map((item) => {
          return item.userNo
        })
        // console.log('----finalArr', finalArr, this.editForm.value1)
        // this.editForm.region = this.editForm.chId
      })
    },

    userChange(val) {
      this.editForm.value1 = val
      // this.userEntityList = val.map((item) => {
      //   // tempObj.userNo = item
      //   return { userNo: item }
      // })
      // console.log('---', this.userEntityList)
    },
    organChagne(val) {
      this.editForm.chId = val
    },

    dialogFormCancel() {
      this.$confirm('是否取消修改？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'remindicon',
      }).then(() => {
        this.$emit('closeDialog')
        this.$message({
          type: 'success',
          message: '已取消!',
        })
      })
    },
    dialogFormSure(editForm) {
      this.$refs[editForm].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.$confirm('是否确认修改？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'remindicon',
          }).then(() => {
            let params = {
              livecodeEntity: {
                createBy: localStorage.getItem('user_no'),
                chId: this.editForm.chId,
                remark: this.editForm.remark,
                name: this.editForm.name,
                livecodeNo: this.editForm.livecodeNo,
              },
              userArr: this.editForm.value1,
            }
            this.$network
              .post('/user-service/livecode/updLivecode', params)
              .then((res) => {
                this.$emit('closeDialog')
                this.$message({
                  type: 'success',
                  message: '保存成功!',
                })
              })
              .catch((err) => {
                this.$message({
                  type: 'error',
                  message: '保存失败!',
                })
              })
          })
        } else {
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
      padding: 16px;
      height: 387px;
      overflow: auto;
      box-sizing: border-box;
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
</style>
