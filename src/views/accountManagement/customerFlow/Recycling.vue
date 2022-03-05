<template>
  <div class="customerWarp" v-loading='loading'>
    <TitleBar title="公海回收规则"></TitleBar>
    <SwitchButton @fnOpen='fnOpen' @fnHide='fnHide' v-model='switchBtn' :distype="expandedKeys.some((item) => item.enName == 'switch')" />
    <div v-show="switchBtn">
      <div class="ruleBox">
        <p class="ruleTitle">回收规则:</p>
        <p class="inline">当客户满足以下条件时，会在第二天02:00被自动回收到公海</p>
        <p class="inputNum">
          <el-input v-model="input" size="mini" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" class="inputClass" />
          <span>天未跟进</span>
          <span class="infoText">数字为0则规则不生效，请设置>0的整数</span>
        </p>
        <p class="endRecycling">回收后:</p>
        <p>
          <el-input v-model="inputOver" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')" size="mini" class="inputClass" />
          <span>天不允许原跟进人领取</span>
        </p>
      </div>
      <el-button type="primary" class="saveBtn" @click="savePage">保存</el-button>
    </div>
  </div>
</template>
<script>
import TitleBar from '../../../components/customerFlow/TitleBar'
import SwitchButton from '../../../components/customerFlow/SwitchButton.vue'
import { getHomeInfo, changeBtnStatus, updatePage } from '../../../api/custom'
import MyMixin from '../../../mixins/permissions'
export default {
  components: {
    TitleBar,
    SwitchButton,
  },
  mixins: [MyMixin],
  data() {
    return {
      switchBtn: '',
      showBox: false,
      num: '',
      input: '',
      inputOver: '',
      id: '',
      defaultId: '',
      loading: false,
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getHomeInfo({ regularType: 3 }).then((res) => {
        this.switchBtn = res.data.regular.buttonType
        this.id = res.data.regular.id
        if (res.data.regularRoleList.length) {
          this.input = res.data.regularRoleList[0].reRecycleTime
          this.inputOver = res.data.regularRoleList[0].recycleTime
          this.defaultId = res.data.regularRoleList[0].id
        }
        this.loading = false
      })
    },
    fnOpen(v) {
      this.switchBtn = v
      console.log(v)
      let params = {
        buttonType: v,
        id: this.id,
      }
      changeBtnStatus(params).then((res) => {})
    },
    fnHide(v) {
      this.switchBtn = v
      let params = {
        buttonType: v,
        id: this.id,
      }
      changeBtnStatus(params).then((res) => {})
    },
    handleChange() {},
    savePage() {
      console.log('this.taglist---', this.input, this.inputOver)
      let params = {
        reRecycleTime: this.input,
        recycleTime: this.inputOver,
        regularId: this.id,
        id: this.defaultId,
      }
      updatePage(params).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功',
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
.customerWarp {
  min-height: 100vh;
  border-radius: 8px;
  background-color: #fff;
  padding: 0 16px;
  .ruleBox {
    margin-top: 16px;
    min-height: 216px;
    background: #fafbff;
    border: 1px solid #d9dae4;
    border-radius: 4px;
    padding-top: 16px;
    color: #3c4353;
    .ruleTitle {
      font-weight: 600;
    }
    p {
      margin-bottom: 16px;
      font-size: 14px;
      padding-left: 16px;
    }
    .inputNum {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -16px;
        height: 1px;
        width: 100%;
        background: #f0f2f7;
      }
      .infoText {
        display: inline-block;
        margin-left: 8px;
        font-size: 12px;
        color: #c0c4cc;
      }
    }
    .inputClass {
      width: 58px;
      height: 32px;
      margin-right: 8px;
      /deep/.el-input__inner {
        height: 22px;
        line-height: 22px;
        text-align: center;
      }
    }
    .endRecycling {
      margin-top: 32px;
      font-weight: 600;
    }
  }
  .saveBtn {
    margin-top: 16px;
  }
}
</style>