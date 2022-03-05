<template>
  <div class="error-page">
    <div class="box">
      <img src="../../assets/images/working.png"
           alt="">
      <div class="error-handle">
        <router-link to="/">
          <el-button type="primary"
                     size="large">返回首页</el-button>
        </router-link>
        <el-button class="error-btn"
                   type="primary"
                   size="large"
                   @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>


<style lang='less' scoped>
.error-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fff;
  box-sizing: border-box;
  img {
    width: 280px;
    // height: 233px;
    margin-bottom: 40px;
  }
}
.error-handle {
}
.error-btn {
  margin-left: 80px;
}
</style>
