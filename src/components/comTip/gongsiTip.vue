<template>
  <div class="tipBox">
    <!-- <span style="color:red">*</span> -->
    <el-form-item label="企业名称:" class="gongsiForm" prop="cropFullName">
      <el-input v-model="addChildForm.cropFullName" maxlength="100" @input="isGongsiListFun" placeholder="请输入"></el-input>
    </el-form-item>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['corpId']),
  },
  props: {
    addChildForm: {
      type: Object,
    },
  },
  data() {
    return {
      isGongsiList: false,
      optGongsi: [],
    }
  },
  methods: {
    remoteMethodGongsi() {
      if (this.addChildForm.cropFullName !== '') {
        this.getGongsiList()
        this.isGongsiList = true
      } else {
        this.optGongsi = []
        this.isGongsiList = false
      }
    },
    isGongsiListFun() {
      this.isGongsiList = false
      let gst = this.addChildForm
      console.log('gst--->', gst)
      this.$emit('getgst', gst)
    },
    getGongsiList() {
      let params = {
        cropFullName: this.addChildForm.cropFullName,
        corpId: this.corpId,
      }
      this.$network
        .post(
          '/common-service/elasticSearch/queryCustomerRecord/customers',
          params
        )
        .then((res) => {
          let GongsiList = []
          GongsiList = res.data
          /* 
          for(let i = 0;i<GongsiList.length;i++){
			    		GongsiList[i].value = GongsiList[i].name
			    }*/
          this.optGongsi = GongsiList
          console.log('this.optGongsi=====', this.optGongsi)
        })
    },
  },
}
</script>
<style lang="less" scoped>
.tipBox {
  // display: flex !important;
}
</style>
