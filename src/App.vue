<template>
  <div id="app">
    <!-- <router-view /> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted() {
    // window.onbeforeunload = function (event) {
    //   if (
    //     (event.clientX > document.body.clientWidth && event.clientY < 0) ||
    //     event.altKey
    //   ) {
    //     var storage = window.localStorage //方法
    //     storage.clear()
    //   }
    // }
  },
}
</script>

<style lang="less"
>
.invit_popver {
  font-size: 12px !important;
  text-align: center !important;
  line-height: 32px !important;
  color: #fff !important;
  min-width: 92px !important;
  height: 32px !important;
  background: rgba(112, 112, 112, 0.9) !important;
  border-radius: 4px !important;
  padding: 0 !important;
  .popper__arrow {
    &::after {
      border-bottom-color: rgba(112, 112, 112, 0.9) !important;
    }
  }
}
.invitCode {
  height: 160px !important;
}
</style>
