<template>
  <div class="edit_dialog">
    <el-dialog title="编辑员工信息" :visible.sync="dialogFormVisible" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <el-form :model="editForm" :rules="editRules" label-width="84px" label-position="right">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model.trim="editForm.name" autocomplete="off" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.gender" @select="sexChange" clearable>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
            <el-option label="未知" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="手机号"
                      prop="phone">
          <el-input v-model.trim="editForm.phone"
                    autocomplete="off"
                    maxlength="11"></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" autocomplete="off" maxlength="60"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="depts">
          <el-select v-model="editForm.depts" multiple collapse-tags @change="organChagne" clearable>
            <el-option v-for="item in organOption" :key="item.value" :label="item.name" :value="item.depId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="editForm.position" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="是否为上级">
          <el-radio-group v-model="editForm.isLeaderInDept" @change="leaderChange">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主管部门" v-show="editForm.isLeaderInDept == '1'">
          <el-select v-model="editForm.isleader" multiple collapse-tags @change="deptChange" clearable>
            <el-option v-for="item in mainList" :key="item.value" :label="item.name" :value="item.depId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" v-if="showRoled">
          <span> 超级管理员</span>
        </el-form-item>
        <el-form-item label="所属角色" v-else>
          <el-select v-model="editForm.roleId" clearable @change="selectRloed">
            <el-option v-for="item in editRoleList" :key="item.value" :label="item.name" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用系统">
          <el-switch v-model="editForm.scrmStatus" :active-value="1" :inactive-value="0" active-color="#4168F6" inactive-color="#B9B9B9"
                     :disabled='showRoled' @change="switchOpen" />
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
    editFormInfo: {
      type: Object,
    },
    showRoled: {
      type: Boolean,
    },
    roleInfo: {
      type: Array,
    },
  },

  data() {
    return {
      editForm: {
        // name: '',
        // region: '',
        // aaa: 'hahaha',
        // switch: true,
      },
      options: [],
      editRoleList: [],
      organOption: [],
      editRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        depts: [
          {
            required: true,
            trigger: 'change',
            message: '请选择部门',
          },
        ],
      },
      mainList: [],
    }
  },
  created() {},
  mounted() {
    this.$network
      .get('/user-service/user/getDetail', { userNo: this.editFormInfo.userNo })
      .then((res) => {
        let data = res.data
        this.editForm = data.userEntity
        this.organOption = data.deptlist
        this.editRoleList = data.roleList
        if (this.editFormInfo.isLeaderInDept == '1') {
          let list = this.editForm.depts
          let tempList = this.organOption
          tempList.forEach((item) => {
            // console.log(item)
            if (list.includes(item.depId)) {
              this.mainList.push(item)
            }
          })
        }
      })
  },
  methods: {
    checkPhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    },
    selectRloed(val) {
      console.log(this.editForm)
    },
    sexChange() {},
    organChagne(val) {
      this.editForm.isLeaderInDept = '0'
    },
    deptChange(val) {},
    leaderChange(val) {
      this.mainList = []
      if (val == 1) {
        let list = this.editForm.depts
        let tempList = this.organOption
        tempList.forEach((item) => {
          // console.log(item)
          if (list.includes(item.depId)) {
            this.mainList.push(item)
          }
        })
      } else {
        this.editForm.isleader = []
      }
    },
    switchOpen() {
      // console.log(this.editForm.switch)
    },
    dialogFormCancel() {
      this.$confirm('是否取消编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // iconClass:''
      })
        .then(() => {
          this.$emit('statusDialog')
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
      this.$confirm('是否保存编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.$network
            .post('/user-service/user/updateUser', this.editForm)
            .then((res) => {
              // console.log('-----editres---', res)
              if (res.result) {
                this.$emit('statusDialog')
                this.$message({
                  type: 'success',
                  message: '保存成功!',
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg,
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存',
          })
        })
    },
    updateForm() {
      this.$network
        .post('/user-service/user/updateUser', this.editForm)
        .then((res) => {
          return res
        })
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    height: 606px;
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
    .el-form-item {
      margin-bottom: 16px;
      // height: 32px;
    }
    .el-form-item__label {
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
      line-height: 32px;
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

    .el-radio {
      &.is-checked {
        .el-radio__input.is-checked .el-radio__inner {
          background: #4168f6;
          border-color: #4168f6;
        }
        .el-radio__label {
          color: #4168f6;
        }
      }
    }
  }
}
</style>
