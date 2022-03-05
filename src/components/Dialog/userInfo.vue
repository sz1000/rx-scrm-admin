<template>
  <div class="user-info-box">
    <div v-if="userData" class="user-info">
      <img class="left" :src="userData.avatar ? userData.avatar : require('../../assets/images/default_header.jpg')" alt="">
      <ul class="center">
        <li class="name one-line">{{ userData.name }}</li>
        <li class="company one-line">{{ userData.departments }}</li>
      </ul>
      <div class="right pointer" @click="showWechat">
        <img src="../../assets/images/icon_qiwei.png" alt="">
        <span>加企业微信</span>
      </div>
    </div>
    <wechat-qrcode ref="wechatQrcode"></wechat-qrcode>
  </div>
</template>
<script>
import WechatQrcode from './wechatQrcode'

export default {
  name: 'userInfo',
  props: {
    userData: {
      default: null,
    },
  },
  methods: {
    showWechat() {
      this.$refs.wechatQrcode.show(this.userData.qrCode)
    },
  },

  components: {
    WechatQrcode,
  },
}
</script>
<style lang="less" scoped>
@import url('../../styles/color');
.user-info-box {
  // /deep/ .van-overlay {
  //   width: 100%;
  //   left: 50%;
  //   transform: translateX(-50%);
  // }
  // margin-bottom: 20px;
  .user-info {
    width: 100%;
    height: 72px;
    padding: 16px;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
    background-color: @white;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    .left {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-right: 8px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .center {
      display: inline-block;
      max-width: 60%;
      vertical-align: middle;
      .name {
        color: @fontMain;
        font-size: 14px;
      }
      .company {
        margin-top: 4px;
        color: @fontSub2;
        font-size: 14px;
      }
    }
    .right {
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      position: absolute;
      right: 14px;
      top: 0;
      img {
        width: 24px;
        height: 24px;
        margin: 12px auto 8px;
      }
      span {
        font-size: 12px;
      }
    }
  }
}
</style>