<template>
  <div class="micoWarp" v-loading='loading'>
    <div class="info_title">
      <span class="icon"></span>
      <span>企业通讯录授权</span>
      <div class="normal" v-if="corpSecretStatus">
        <span class="normal_l">
          <img src="../../assets/images/icon_correct@2x.png" alt="" />
          已完成授权
        </span>
        <span class="normal_r">
          状态:<span class="correct_icon"></span>正常
        </span>
      </div>
      <div class="abnormal" v-else>
        <span class="normal_l">
          <img src="../../assets/images/icon_error@2x.png" alt="" />
          未完成授权
        </span>
        <span class="abnormal_r">
          状态:<span class="error_icon"></span>异常
        </span>
      </div>
    </div>
    <div class="enterprise">
      <div>
        <span style="color:red">*</span>
        <span>Secret</span>
        <el-input v-model="input" placeholder="请输入" :disabled='showbtn' @change='changeInput'></el-input>
      </div>
      <div class="save" v-show="!showbtn">
        <div class="box cancel pointer" @click="cancel(1)">取消</div>
        <div class="box sure pointer" @click="saveSecret(1)">保存</div>
      </div>
      <div class="amend pointer" @click="showbtn=false" v-show="showbtn && expandedKeys.some(item=>item.enName == 'edit')">修改</div>
    </div>
    <div class="info_title custonWarp">
      <span class="icon"></span>
      <span>客户联系授权</span>
      <div class="normal" v-if="customSecretStatus">
        <span class="normal_l">
          <img src="../../assets/images/icon_correct@2x.png" alt="" />
          已完成授权
        </span>
        <span class="normal_r">
          状态:<span class="correct_icon"></span>正常
        </span>
      </div>
      <div class="abnormal" v-else>
        <span class="normal_l">
          <img src="../../assets/images/icon_error@2x.png" alt="" />
          未完成授权
        </span>
        <span class="abnormal_r">
          状态:<span class="error_icon"></span>异常
        </span>
      </div>
    </div>
    <div class="enterprise">
      <div>
        <span style="color:red">*</span>
        <span>Secret</span>
        <el-input v-model="input1" placeholder="请输入" :disabled='showCuston' @change="changeCustom"></el-input>
      </div>
      <div class="save" v-show="!showCuston">
        <div class="box cancel pointer" @click="cancel(2)">取消</div>
        <div class="box sure pointer" @click="saveSecret(2)">保存</div>
      </div>
      <div class="amend pointer" @click="showCuston=false" v-show="showCuston && expandedKeys.some(item=>item.enName == 'edit')">修改</div>
    </div>
  </div>
</template>
<script>
import MyMixin from '../../mixins/permissions'
export default {
  mixins: [MyMixin],
  data() {
    return {
      corpSecretStatus: 0,
      customSecretStatus: 0,
      input: '',
      input1: '',
      showbtn: true,
      showCuston: true,
      obtainId: '',
      copyInput: '',
      copyInput1: '',
      loading: false,
    }
  },
  created() {
    this.getScret()
  },
  methods: {
    getScret() {
      this.loading = true
      this.$network.get('/user-service/Corp/getCropSecret').then((res) => {
        this.loading = false
        this.obtainId = res.data.id
        this.input = res.data.corpSecret
        this.copyInput = res.data.corpSecret
        this.input1 = res.data.customSecret
        this.copyInput1 = res.data.customSecret
        this.corpSecretStatus = res.data.corpSecretStatus
        this.customSecretStatus = res.data.customSecretStatus
      })
    },
    changeInput(val) {
      // console.log(val)
      this.input = val
    },
    changeCustom(val) {
      // console.log(val)
      this.input1 = val
    },

    saveSecret(v) {
      let params = {
        corpSecret: this.input,
        customSecret: this.input1,
        id: this.obtainId,
      }
      if (v == 1) {
        this.$network
          .post('/user-service/Corp/updateCropSecret', params)
          .then((res) => {
            this.showbtn = true
          })
      } else {
        this.$network
          .post('/user-service/Corp/updateCropSecret', params)
          .then((res) => {
            this.showCuston = true
          })
      }
    },
    cancel(val) {
      if (val == 1) {
        this.input = this.copyInput
        this.showbtn = true
      } else {
        this.showCuston = true
        this.input1 = this.copyInput1
      }
    },
  },
}
</script>
<style lang="less" scoped>
.micoWarp {
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
    .normal_l {
      margin-right: 47px;
    }
    .normal {
      display: inline-block;
      margin-left: 55px;
      span {
        display: inline-block;
        img {
          width: 14px;
          height: 14px;
          vertical-align: middle;
        }
      }
      .correct_icon {
        margin: 0 8px;
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #52bd94;
        border-radius: 50%;
      }
    }
    .abnormal {
      display: inline-block;
      margin-left: 55px;
      span {
        display: inline-block;
        img {
          width: 14px;
          height: 14px;
          vertical-align: middle;
        }
      }
      .error_icon {
        margin: 0 8px;
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #ffb020;
        border-radius: 50%;
      }
    }
  }
  .enterprise {
    display: flex;
    padding: 32px 0 0 16px;
    span {
      display: inline-block;
      line-height: 32px;
    }
    .el-input {
      margin-left: 16px;
      width: 626px;
      // flex: 1;
      /deep/.el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .amend {
      display: inline-block;
      width: 60px;
      height: 32px;
      background: #4168f6;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      line-height: 32px;
      margin-left: 32px;
    }
    .save {
      // margin-left: 32px;
      display: inline-block;
      width: 300px;
      .box {
        display: inline-block;
        width: 60px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
      }
      .cancel {
        margin-left: 32px;
        border: 1px solid #d9dae4;
      }
      .sure {
        margin-left: 16px;
        background: #4168f6;
        color: #fff;
      }
    }
  }
  .custonWarp {
    margin-top: 64px;
  }
}
</style>