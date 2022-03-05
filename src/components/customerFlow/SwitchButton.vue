<template>
  <div class="switch-box">
    <el-switch v-model="openHide" :active-value="1" :inactive-value="0" active-color="#4168F6" inactive-color="#F5F6FA" @change="switchOpen"
               :disabled='!distype' :active-text='activetext' class="switchBtn" />
    <span class="instructions" v-show="openHide == 1">{{labelText}}</span>
  </div>
</template>
<script>
export default {
  props: {
    labelText: {
      type: String,
    },
    value: {
      type: Number | String,
    },
    distype: {
      type: Boolean,
      default: () => {
        // return false
      },
    },
  },
  watch: {
    value(val) {
      this.openHide = val
    },
    openHide(val) {
      if (val == 1) {
        this.activetext = '已开启'
      } else {
        this.activetext = '已关闭'
      }
      this.$emit('input', val)
    },
  },
  data() {
    return {
      activetext: '',
      openHide: '',
    }
  },
  created() {
    // console.log('----disabled-----', this.distype)
  },
  methods: {
    switchOpen(val) {
      if (val == 1) {
        this.$emit('fnOpen', 1)
      } else {
        this.$emit('fnHide', 0)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.switch-box {
  margin-top: 16px;
  .switchBtn {
    /deep/.el-switch__label.is-active {
      color: #4168f6;
    }
  }
  .instructions {
    display: inline-block;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #c0c4cc;
    letter-spacing: 0;
    font-weight: 400;
    margin-left: 16px;
  }
}
</style>