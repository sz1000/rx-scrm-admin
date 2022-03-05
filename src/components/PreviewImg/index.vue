<template>
  <div class="preview-box">
    <el-dialog
      title="预览图片"
      :modal="modal"
      :visible.sync="show"
      width="840px"
      :before-close="handleClose"
      :modal-append-to-body="true"
      :append-to-body="true"
    >
      <img class="img" :src="url" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ""
    },
    modal: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:show", false);
      this.$emit("update:url", "");
    }
  }
};
</script>

<style lang="less" scoped>
  .el-dialog__wrapper /deep/ .el-dialog__body .img {
    display: block;
    max-width: 800px;
    max-height: 800px;
    margin: 0 auto;
  }
</style>

