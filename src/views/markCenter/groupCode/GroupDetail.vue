<template>
  <div class="edit_dialog">
    <el-dialog
      title="群活码详情"
      :visible.sync="detailVisible"
      :before-close="dialogFormCancel"
      :close-on-click-modal="false"
      width="520px"
    >
      <el-form label-position="right" :model="detailForm" label-width="100px">
        <el-form-item label="活码展示:" style="margin-bottom: 90px">
          <img
            :src="detailForm.address"
            alt=""
            style="width: 120px; height: 120px"
            v-if="detailForm.switchStatus"
          />
          <span id="qrcode" ref="qrcode" v-else> </span>
        </el-form-item>
        <el-form-item label="活码名称:">
          <span>{{ detailForm.name }}</span>
        </el-form-item>
        <el-form-item label="渠道:">
          <span>{{ detailForm.chName }}</span>
        </el-form-item>
        <el-form-item label="拉群方式:">
          <span>{{
            detailForm.addBy == "1" ? "群二维码拉群" : "企微活码拉群"
          }}</span>
        </el-form-item>
        <el-form-item label="使用员工:">
          <span>{{ detailForm.userNames || "-" }}</span>
        </el-form-item>
        <el-form-item label="入群引导语:" class="contest">
          <span :title="detailForm.contest">{{
            detailForm.contest || "-"
          }}</span>
        </el-form-item>
        <el-form-item label="创建人:">
          <span>{{ detailForm.createBy }}</span>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{
            formatDate(detailForm.createTime, "yyyy-MM-dd hh:mm:ss")
          }}</span>
        </el-form-item>

        <!-- <el-form-item label="备注:">
          <span>{{ detailForm.remark }}</span>
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormCancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "../../../utils/tool";
import QRCode from "qrcodejs2";
export default {
  components: {
    QRCode,
  },
  props: {
    detailVisible: {
      type: Boolean,
    },
    detailForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      // detailForm: {
      //   name: '231313',
      //   shop: '313123',
      //   id: '313',
      //   shopId: '313',
      //   address: '132',
      //   desc: '3123',
      // },
    };
  },
  created() {
    // console.log('----da-d-sa-da-d-----', this.detailForm)
  },
  mounted() {
    this.$nextTick(() => {
      this.qrcode();
    });
  },
  methods: {
    formatDate,
    dialogFormCancel() {
      this.$emit("closeDetailForm");
    },
    qrcode() {
      // console.log(this.$refs.qrcode)
      if (typeof this.$refs.qrcode == "undefined") {
        return;
      } else {
        this.$refs.qrcode.innerHTML = "";
        let qrcode = new QRCode("qrcode", {
          width: 80,
          height: 80,
          text: this.detailForm.address,
          render: "canvas",
          colorDark: "#000000",
          colorLight: "#ffffff",
        });
        this.hrefCode = document
          .getElementById("qrcode")
          .getElementsByTagName("canvas")[0]
          .toDataURL("image/png");
      }
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
    .contest {
      height: 32px;
      width: 480px;
      span {
        display: inline-block;
        width: 400px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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
      border-top: 1px solid #d9dae4;
      padding: 20px;
      // position: absolute;
      // bottom: 0;
      // right: 16px;
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
// .dialog-footer {
//   height: 64px;
//   line-height: 64px;
//   padding-right: 16px;
//   border-top: 1px solid #f0f2f7;
//   text-align: right;
//   margin-top: 10px;
//   .el-button {
//     width: 60px;
//     height: 32px;
//     border-radius: 4px;
//     text-align: center;
//     padding: 0;
//     border: 1px solid #d9dae4;
//   }
//   .el-button--primary {
//     background: #4168f6;
//   }
// }
</style>
