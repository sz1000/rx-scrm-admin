<template>
  <div class="edit_dialog">
    <el-dialog :title="title" :visible.sync="distrDialog" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <!-- <div class="rowStyle"><span>现有负责人：</span>{{people}}</div> -->
      <div><span style="color:red">*</span>指定负责人： <el-select v-model="region" @change="leaderChange" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.userNo">
          </el-option>
        </el-select>
      </div>

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
    distrDialog: {
      type: Boolean,
    },
  },

  data() {
    return {
      people: '',
      region: '',
      options: [],
      title: this.$route.query.type == 2 ? '分配线索' : '分配客户',
    }
  },
  created() {
    // console.log(this.$route.query.type)
    this.changePeople()
  },
  methods: {
    changePeople() {
      let params = {
        clueCustomerNo: this.$route.query.customno,
      }
      this.$network
        .get('/customer-service/cluecustomer/getuserList', params)
        .then((res) => {
          this.people = res.data.userNo
          this.options = res.data.list
        })
    },
    leaderChange(val) {
      // console.log(val)
      this.region = val
    },
    dialogFormCancel() {
      this.$emit('closeDistribution', 1)
    },
    dialogFormSure() {
      this.$confirm('是否保存编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let params = {
            cluecustomerno: this.$route.query.customno,
            user_no: this.region,
            // oldname: this.people,
          }
          this.$network
            .get('/customer-service/cluecustomer/turnBlon', params)
            .then((res) => {
              // console.log('-----editres---', res)
              this.$emit('closeDistribution', 2)
              this.$message({
                type: 'success',
                message: '编辑成功!',
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
    height: 300px;
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
      padding: 31px 16px;
      .rowStyle {
        margin-bottom: 20px;
        line-height: 32px;
      }
      .el-select,
      .el-input__inner {
        width: 329px;
        height: 32px;
      }
      .el-input__icon {
        line-height: 32px;
      }
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
