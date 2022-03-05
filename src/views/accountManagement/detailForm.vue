<template>
  <div class="edit_dialog">
    <el-dialog
      title="员工信息详情"
      :visible.sync="infoFormVisible"
      :before-close="dialogFormCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <el-form label-position="right" :model="detailForm" label-width="100px">
        <el-form-item label="员工姓名:">
          <span>{{ detailForm.name }}</span>
        </el-form-item>
        <el-form-item label="性别:">
          <span>{{
            detailForm.gender == 1
              ? "男"
              : detailForm.gender == 2
              ? "女"
              : "未知"
          }}</span>
        </el-form-item>
        <el-form-item label="手机号:">
          <span>{{ detailForm.phone }}</span>
        </el-form-item>
        <el-form-item label="邮箱:">
          <span>{{ detailForm.email }}</span>
        </el-form-item>
        <el-form-item label="所属部门:">
          <span>{{ detailForm.deptname }}</span>
        </el-form-item>
        <el-form-item label="职务:">
          <span>{{ detailForm.position }}</span>
        </el-form-item>
        <el-form-item label="是否为上级:">
          <span>{{ detailForm.isLeaderInDept == 0 ? "否" : "是" }}</span>
        </el-form-item>
        <el-form-item label="主管部门:">
          <span>{{ detailForm.leaderName }}</span>
        </el-form-item>
        <el-form-item label="所属角色:">
          <span> {{ detailForm.rolename }} </span>
        </el-form-item>
        <el-form-item label="启用系统:">
          <span>{{ detailForm.scrmStatus == 1 ? "启用" : "未启用" }}</span>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <!-- <el-button @click="dialogBeforeClose">取 消</el-button> -->
        <el-button type="primary" @click="save">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    infoFormVisible: {
      type: Boolean,
    },
    detailInfo: {
      type: Object,
    },
  },

  data() {
    return {
      detailForm: {
        name: "231313",
        shop: "313123",
        id: "313",
        shopId: "313",
        address: "132",
        desc: "3123",
      },
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$network
        .get("/user-service/user/getDetail", {
          userNo: this.detailInfo.userNo,
        })
        .then((res) => {
          let tempArr = [];
          this.detailForm = res.data.userEntity;
          let leaderList = res.data.deptlist;
          leaderList.forEach((item) => {
            this.detailForm.isleader.forEach((v) => {
              if (v == item.depId) {
                tempArr.push(item.name);
                this.detailForm.leaderName = tempArr.join(",");
              }
            });
          });
        });
    },
    dialogFormCancel() {
      // console.log('-----aaaaaa------')
      this.$emit("closeInfoForm");
    },
    save() {
      this.$emit("closeInfoForm");
    },
  },
};
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    // height: 606px;
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
.dialog-footer {
  height: 64px;
  line-height: 64px;
  padding-right: 16px;
  border-top: 1px solid #f0f2f7;
  text-align: right;
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
</style>
