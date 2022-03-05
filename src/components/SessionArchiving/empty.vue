<template>
  <div class="empty">
    <img v-if="type == 0" src="../../assets/images/icon_empty.png" alt="" />
    <img v-else src="../../assets/images/icon_nodata.png" alt="" />
    <p>{{ tips }}</p>
  </div>
</template>
<script>
export default {
  props: {
      type: {
        default: 0
      },
      tips: {
        type: String,
        default: ''
      }
  },
}
</script>
<style lang="less" scoped>
.empty {
    width: 100%;
    background: @white;
    text-align: center;
    p {
        margin-top: 3px;
        font-size: 14px;
        color: @fontSub2;
    }
}
</style>
