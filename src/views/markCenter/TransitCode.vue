<template>
  <div class="imgBox">
    <div class="groupWarp">
      <span>{{groupName}}</span>
      <span>{{addHint}}</span>
      <img :src='imgUrl' alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgUrl: '',
      addHint: '',
      groupName: '',
    }
  },
  mounted() {
    let bodyStyle = document.body.style
    let htmlStyle = document.getElementsByTagName('html')[0].style
    console.log(bodyStyle, htmlStyle)
    htmlStyle['min-width'] = '0px'
    bodyStyle['min-width'] = '0px'
  },
  beforeDestroy() {
    let bodyStyle = document.body.style
    let htmlStyle = document.getElementsByTagName('html')[0].style
    console.log(bodyStyle, htmlStyle)
    htmlStyle['min-width'] = '1200px'
    bodyStyle['min-width'] = '1200px'
  },
  created() {
    let name = this.$route.query.name
    this.$network
      .get('/user-service/livecodegroup/contact', {
        name: name,
      })
      .then((res) => {
        this.imgUrl = res.data.address
        this.addHint = res.data.addHint
        this.groupName = res.data.groupName
      })
  },
}
</script>
<style lang="less" scoped>
.imgBox {
  height: 100%;
  width: 100%;
  background: #fafbff;
  padding-top: 50px;
  .groupWarp {
    // width: 330px;
    width: 80%;
    height: 424px;
    background: #fff;
    border-radius: 8px;
    margin: 0 auto;
    text-align: center;
    padding: 40px 0 0 16px;
    box-shadow: 0 0 30px rgba(65, 104, 246, 0.06);
    span {
      display: block;
      text-align: left;
    }
    span:nth-child(1) {
      font-size: 18px;
      font-weight: 500;
    }
    span:nth-child(2) {
      font-size: 16px;
    }
    img {
      margin-top: 60px;
      width: 200px;
      height: 200px;
    }
  }
}
</style>