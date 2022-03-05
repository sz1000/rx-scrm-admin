<template>
    <div class="goback pointer"
         @click="goback">
      <img src="../../assets/images/goback.png"
           alt="" /> 返回
    </div>
</template>
<script>
export default {
    methods: {
        goback() {
            this.$router.go(-1)
        },
    }
}
</script>
<style lang="less" scoped>
    .goback {
        margin: 0 0 16px 0;
        color: #4168f6;
        font-family: 600;
        img {
        width: 8px;
        height: 12px;
        vertical-align: middle;
        }
    }
</style>