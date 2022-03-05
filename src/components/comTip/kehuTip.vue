<template>
  <div class="tipBox">
    <el-form-item class="kehuForm" label="企业简称:" prop='customerName'>
      <el-input v-model="addChildForm.customerName" maxlength="30" @input="isKehuListFun" placeholder="请输入"></el-input>
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
      isKehuList: false,
      optKehu: [],
    }
  },
  methods: {
    isKehuListFun() {
      this.isKehuList = false
      console.log(this.addChildForm)
      let acf = this.addChildForm
      this.$emit('getacf', acf)
    },
  },
}
</script>
<style lang="less">
</style>
