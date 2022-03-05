<template>
  <div class="infoWarp" v-loading='loading'>
    <div class="info_title">
      <span class="icon"></span>
      <span>企业信息</span>
    </div>
    <div class="rowContent">
      <span>企业名称:</span>
      <span>{{companyObj.corpName}}</span>
    </div>
    <div class="rowContent">
      <span>企业地址:</span>
      <span>{{companyObj.location}}</span>
    </div>
    <div class="rowContent">
      <span>企业类型:</span>
      <span>{{companyObj.subjectType}}</span>
    </div>
    <div class="rowContent">
      <span>企业规模:</span>
      <span>{{companyObj.corpScale}}</span>
    </div>
    <div class="rowContent">
      <span>所属行业:</span>
      <span>{{companyObj.corpIndustry}}</span>
    </div>
    <div class="rowContent">
      <span>企业ID:</span>
      <span>{{companyObj.corpId}}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      companyObj: {
        corpName: '',
        subjectType: '',
        corpScale: '',
        corpIndustry: '',
        corpId: '',
        location: '',
        loading: false,
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      this.$network.get('/user-service/Corp/getCrop').then((res) => {
        this.companyObj = res.data
        this.loading = false
      })
    },
  },
}
</script>
<style lang="less" scoped>
.infoWarp {
  height: 812px;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  color: #3c4353;
  .info_title {
    font-weight: 600;
    line-height: 52px;
    height: 52px;
    border-bottom: 1px solid #f0f2f7;
    .icon {
      display: inline-block;
      width: 4px;
      height: 14px;
      background: #4168f6;
      margin-right: 8px;
    }
  }
  .rowContent {
    // padding-left: 16px;
    span {
      display: inline-block;
      margin-top: 31px;
    }
    span:nth-child(1) {
      margin-right: 16px;
      width: 100px;
      text-align: right;
    }
  }
}
</style>