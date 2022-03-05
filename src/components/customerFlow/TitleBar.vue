<template>
  <div class="titlebar">{{title}}</div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => {},
    },
  },
}
</script>
<style lang="less" scoped>
.titlebar {
  padding-left: 10px;
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 600;
  border-bottom: 1px solid #f0f2f7;
  position: relative;
  &::before {
    content: '';
    width: 2px;
    height: 14px;
    background: #4168f6;
    position: absolute;
    left: 0;
    top: 15px;
  }
}
</style>