<template>
  <el-dialog title="" :visible.sync="showVisible" width="375px" :modal='false' :close-on-click-modal='false'>
    <div class="content_code">
      <img :src="imgUrl" alt="">
    </div>

  </el-dialog>
</template>
<script>
export default {
  name: 'wechatQrcode',
  data() {
    return {
      showVisible: false,
      imgUrl: '',
    }
  },
  methods: {
    show(data) {
      this.imgUrl = data
      this.showVisible = true
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  .content_code {
    margin-top: 30%;
    margin-left: 28px;
    img {
      width: 300px;
      height: 300px;
    }
  }
}
</style>