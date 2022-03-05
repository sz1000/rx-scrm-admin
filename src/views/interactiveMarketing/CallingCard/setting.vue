<template>
  <div class="setting_wrap">
    <div class="look box" v-if="isSetting">
      <div class="text">
        今日名片浏览次数<i>{{ detail.todayViewedCount }}</i>
      </div>
      <jzIcon class="iconfont" type="icon-xiangyou2" @click.native="toFun"></jzIcon>
    </div>
    <div class="box code" v-if="isSetting">
      <div class="img_box" v-if="detail">
        <img :src="detail.businessQrAddress" alt="" />
      </div>
      <div class="tips">微信扫码后，点击右上角分享</div>
      <div class="opera_box">
        <a
          :href="detail.businessQrAddress"
          :download="detail.businessQrAddress"
          target="_blank"
          class="btn"
          >下载名片</a
        >
        <a class="btn" @click="copyFun">复制分享链接</a>
        <a class="btn" @click="openDialog">预览</a>
      </div>
    </div>
    <!-- 暂未设置信息 -->
    <div class="no_setting" v-else>
      <img class="img" src="@/assets/images/card_no_setting.png" />
    </div>
    <!-- 二维码预览 -->
    <el-dialog
      class="dialog_wrap"
      title="二维码预览"
      :visible.sync="dialog"
      width="520px"
    >
      <div class="dialog_content">
        <div class="code_box" v-if="isSetting">
          <img :src="detail.businessQrAddress" alt="" />
        </div>
      </div>
      <span slot="footer" class="dialog_footer">
        <el-button
          size="small"
          class="btn"
          type="primary"
          @click="dialog = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userBusinessCardViewLog_personalCard } from "@/api/card";
export default {
  data() {
    return {
      dialog: false,
      detail: {},
      isSetting: true,
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      //获取浏览数据
      userBusinessCardViewLog_personalCard().then((res) => {
        if (res.result) {
          this.detail = res.data;
          if (res.data) {
            this.isSetting = true;
          } else {
            this.isSetting = false;
          }
        }
      });
    },
    openDialog() {
      this.dialog = true;
    },
    toFun() {
      this.$router.push({
        path: "/interactivemarketing/callingCard/settingList",
        query: {
          menuFlag: true,
          type: 1,
        },
      });
    },
    copyFun() {
      let _self = this;
      if(this.detail.miniProgramUrlLink== null){
            _self.$message.error("链接为空,复制失败！");
      }
      let data = this.detail.miniProgramUrlLink ? this.detail.miniProgramUrlLink : ''
      this.$copyText(data).then(
        function (e) {
          console.log("Copied");
          _self.$message.success("复制成功！");
          console.log(e);
        },
        function (e) {
          console.log("Can not copy");
          _self.$message.error("复制失败！");
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.setting_wrap {
  width: 100%;
  min-height: calc(100vh - 88px);
  background: @white;
  padding: 16px;
  position: relative;
  // 弹窗 style
  .dialog_wrap {
    /deep/ .el-dialog {
      border-radius: 8px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      // max-height: 80%;
      margin: 0 !important;
    }
    /deep/ .el-dialog__header {
      background: @dialogBg;
      border-bottom: 1px solid @lineColor;
      padding: 14px 16px;
      border-radius: 8px 8px 0px 0px;
      .el-dialog__title {
        font-size: 16px;
      }
    }
    /deep/ .el-dialog__body {
      padding: 0;
    }
    /deep/ .el-dialog__footer {
      padding: 16px;
      border-top: 1px solid @lineColor;
    }
    .dialog_content {
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .code_box {
        width: 300px;
        height: 300px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .dialog_footer {
      .btn {
        background: @main;
        width: 60px;
        &:hover {
          background: rgba(@main, 0.85);
        }
      }
    }
  }
  .box {
    width: 400px;
    border: 1px solid @bdColor;
    border-radius: 4px;
    display: flex;
    &.look {
      min-height: 76px;
      margin-bottom: 16px;
      padding: 28px 24px;
      justify-content: space-between;
      .text {
        font-size: 14px;
        line-height: 20px;
        color: @fontMain;
        i {
          font-style: normal;
          color: @main;
          font-size: 24px;
          font-weight: bold;
          vertical-align: middle;
          margin-left: 8px;
        }
      }
      .iconfont {
        font-size: 18px;
        color: @main;
        cursor: pointer;
      }
    }
    &.code {
      height: 280px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img_box {
        width: 160px;
        height: 160px;
        // background: @bdColor;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .tips {
        font-size: 14px;
        line-height: 20px;
        color: @fontSub2;
        margin: 16px 0;
      }
      .opera_box {
        display: flex;
        .btn {
          font-size: 14px;
          line-height: 20px;
          color: @main;
          margin-right: 16px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          &::before {
            content: "";
            width: 1px;
            height: 12px;
            background: @lineColor;
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translate(50%, -50%);
          }
          &:last-child {
            margin-right: 0;
            &::before {
              display: none;
            }
          }
          &:hover {
            color: rgba(@main, 0.8);
          }
        }
      }
    }
  }
  .no_setting {
    width: 100%;
    min-height: calc(100vh - 120px);
    display: flex;
    justify-content: center;
    align-items: center;
    .img {
      width: 240px;
    }
  }
}
</style>