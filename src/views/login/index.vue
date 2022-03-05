<template>
  <div class="login-container">
    <div class="l-content"></div>
    <div class="r-content">
      <!-- <svg-icon class-name="iconStyle"
                icon-class='icon_notebook'></svg-icon> -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">
        <div class="title-container">
          <span class="title">登录</span>
        </div>

        <el-form-item prop="account">
          <div class="form-text">手机号</div>
          <el-input ref="username" v-model="loginForm.account" placeholder="请输入手机号" name="username" type="text" tabindex="1" autocomplete="on">
          </el-input>
        </el-form-item>
        <el-form-item prop="pass_word">
          <div class="form-text">验证码</div>
          <el-input ref="password" v-model="loginForm.pass_word" placeholder="请输入密码" name="password" tabindex="2" autocomplete="on"
                    @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin">
            <template slot="suffix">
              <el-button class="verCode pointer" v-preventReClick type="text" @click.native="getPhoneCode" :disabled="disabled">
                {{ btnTitle }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-button :loading="loading" type="primary" class="loginBtn" @click.native.prevent="handleLogin" :disabled="isClick">登录</el-button>
        <div class="qywx">
          <a :href="authLink">
            <img src="../../assets/images/qiyewx.png" alt="" style="width: 400px; height: 40px" />
          </a>
        </div>
        <div class="bottom-txt">
          ———————————登陆前请先
          <span @click="goPower">
            <span class="btnTxt">授权</span> ———————————
          </span>
        </div>
      </el-form>
    </div>
    <!-- 二维码容器 -->
    <div class="login-box">
      <div class="wx-box">
        <div id="wx_box"></div>
      </div>
    </div>
    <div>
      <el-dialog title="请选择公司" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false" width="520px">
        <div v-for="(item, index) in items" :key="index" class="selectCompany" @click="changeCompany(item)">
          {{ item.corpName }}
        </div>
      </el-dialog>
    </div>
    <UserPact :userPop="userPop" @closePact="closePact" @cancelPop="cancelPop"></UserPact>

  </div>
</template>
<script>
import UserPact from './comTip/userPact.vue'
export default {
  components: {
    UserPact,
  },
  data() {
    return {
      loginForm: {
        account: '',
        pass_word: '',
      },
      btnTitle: '获取验证码',
      disabled: false,
      capsTooltip: false,
      // passwordType: 'password',
      userToken: '',
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        pass_word: [
          { required: true, trigger: 'blur', message: '验证码不能为空' },
        ],
      },
      loading: false,
      authLink: '',
      authLink1: '',
      dialogVisible: false,
      items: [],
      userPop: false,
    }
  },
  created() {
    //this.getAuthoriz();
    this.getLogin()
  },
  mounted() {},
  computed: {
    //手机号和验证码都不能为空
    isClick() {
      if (!this.loginForm.account || !this.loginForm.pass_word) {
        return true
      } else {
        return false
      }
    },
  },
  provide() {
    return {
      getAuthoriz: this.getAuthoriz,
    }
  },
  methods: {
    closePact() {
      this.userPop = false
      this.getAuthoriz()
    },
    cancelPop() {
      this.userPop = false
    },
    goPower() {
      this.userPop = true
    },
    // 授权loginPedding
    getAuthoriz() {
      this.$network
        .get('/user-service/user/getWxTologin', {
          href: '/#/loginPedding',
        })
        .then((res) => {
          let authParams = {
            appid: res.data.appid, // * 服务商的CorpID
            redirect_url: encodeURIComponent(
              'https://' + res.data.redirect_uri
            ), // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
            redirect_uri: encodeURIComponent(res.data.redirect_uri + '?'), // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
            state: '', // ? 用于企业或服务商自行校验session，防止跨域攻击
            usertype: 'admin', // ? 支持登录的类型。admin代表管理员登录（使用微信扫码）,member代表成员登录（使用企业微信扫码），默认为admin
            suiteId: res.data.suiteId,
            authCode: res.data.content,
          }
          // 授权登录
          this.authLink1 = `https://open.work.weixin.qq.com/3rdapp/install?suite_id=${authParams.suiteId}&pre_auth_code=${authParams.authCode}&redirect_uri=${authParams.redirect_uri}&state=${authParams.state}`
          window.location.href = this.authLink1
          //   console.log(window)
          //   window.WwLogin({
          //     id: 'wx_box', // 登录页面显示二维码的容器id
          //     appid: authParams.appid, // 企业微信的CorpID，在企业微信管理端查看
          //     agentid: 1000000, // 授权方的网页应用id，在具体的网页应用中查看
          //     redirect_uri: authParams.redirect_uri, // 重定向的地址，需要进行encode
          //     state: '',
          //   })
        })
    },
    // 登录验证pedidng
    getLogin() {
      this.$network
        .get('/user-service/user/getWxTologin', {
          href: '/#/pedding',
        })
        .then((res) => {
          let authParams = {
            appid: res.data.appid, // * 服务商的CorpID
            redirect_url: encodeURIComponent(
              'https://' + res.data.redirect_uri
            ), // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
            redirect_uri: encodeURIComponent(res.data.redirect_uri + '?'), // * 授权登录之后目的跳转网址，需要做urlencode处理。所在域名需要与授权完成回调域名一致
            state: '', // ? 用于企业或服务商自行校验session，防止跨域攻击
            usertype: res.data.usertype, // ? 支持登录的类型。admin代表管理员登录（使用微信扫码）,member代表成员登录（使用企业微信扫码），默认为admin
            suiteId: res.data.suiteId,
            authCode: res.data.content,
          }
          // 身份验证
          this.authLink = `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=${authParams.appid}&redirect_uri=${authParams.redirect_url}&state=${authParams.state}&usertype=${authParams.usertype}`
          // window.location.href = this.authLink1
        })
    },
    checkCapslock(e) {
      // console.log(e)
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    handleLogin() {
      // 账号密码登录
      let p = this.loginForm
      this.$network.post('/user-service/user/login', p).then((res) => {
        localStorage.setItem('token', res.data.access_token)
        this.$router.push('/')
      })
      // return
      //验证码登录
      let params = {
        phone: this.loginForm.account,
        code: this.loginForm.pass_word,
      }
      this.$network
        .get('/user-service/user/validateSms', params)
        .then((res) => {
          if (res.code == 'corp_mult') {
            this.dialogVisible = true
            this.items = res.data.corplist
          } else {
            localStorage.setItem('token', res.data.access_token)
            this.$router.push('/')
          }
        })
    },
    changeCompany(item) {
      this.$network
        .get('/user-service/user/tovalidateSms', {
          phone: this.loginForm.account,
          corpId: item.corpId,
        })
        .then((res) => {
          localStorage.setItem('token', res.data.access_token)
          this.$router.push('/')
        })
    },
    // 获取验证吗、
    getPhoneCode() {
      if (this.validatePhone()) {
        this.validateBtn()
        //发送网络请求
        this.$network
          .post('/user-service/user/loginByPhone', {
            phone: this.loginForm.account,
          })
          .then((res) => {
            // console.log(res)
          })
      }
    },
    validateBtn() {
      //倒计时
      let time = 60
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer)
          this.disabled = false
          this.btnTitle = '获取验证码'
        } else {
          this.btnTitle = time + '秒后重试'
          this.disabled = true
          time--
        }
      }, 1000)
    },
    validatePhone() {
      //判断输入的手机号是否合法
      if (!this.loginForm.account) {
        this.$message({
          message: '请输入手机号',
          type: 'error',
        })
        return false
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginForm.account)) {
        this.$message({
          message: '请输入正确是手机号',
          type: 'error',
        })
        return false
      } else {
        // this.errors = {}
        return true
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
  },
}
</script>
<style lang="less" scoped>
.login-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  .l-content {
    width: 40%;
    height: 900px;
    background: url('../../assets/images/logo_left.png') no-repeat;
    background-size: cover;
  }
  .r-content {
    width: 60%;
    max-width: 100%;
    position: relative;
    .login-form {
      position: absolute;
      left: 30%;
      top: 20%;
      width: 480px;
      height: 504px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
      padding: 40px;
      margin: 0 auto;
      overflow: hidden;
      .title-container {
        font-size: 24px;
        color: #3c4353;
        font-weight: 500;
        text-align: center;
      }
      .verCode {
        color: #4168f6;
        font-size: 14px;
        z-index: 10;
        border: none;
        // background: #fff;
      }
      .loginBtn {
        width: 400px;
        height: 40px;
        background: #4168f6;
        border-radius: 4px;
        font-size: 14px;
      }
      .qywx {
        margin-top: 16px;
        cursor: pointer;
      }
      .bottom-txt {
        margin-top: 52px;
        font-size: 12px;
        color: #c0c4cc;
        text-align: center;
        .btnTxt {
          cursor: pointer;
          color: #4168f6;
        }
      }
    }
  }
  .el-input {
    display: inline-block;
    height: 40px;
    width: 400px;

    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #d9dae4;
      // caret-color: $cursor;
    }
  }

  .el-form-item {
    margin-bottom: 30px;
    .el-input__inner {
      width: 400px;
    }
    .form-text {
      font-size: 14px;
      color: #3c4353;
    }
  }
}
/deep/.el-dialog {
  height: 490px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  .el-dialog__header {
    height: 50px;
    background: #fafbff;
    border-radius: 8px 8px 0px 0px;
    border-bottom: 1px solid #f0f2f7;
    padding: 14px 16px;
    .el-dialog__title {
      font-size: 16px;
      font-weight: 500;
      color: #3c4353;
    }
  }
  .el-dialog__body {
    overflow-y: auto;
    height: 400px;
  }
  .selectCompany {
    width: 456px;
    height: 40px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #d9dae4;
    font-size: 14px;
    color: #3c4353;
    margin-bottom: 16px;
    padding-left: 16px;
    line-height: 40px;
    cursor: pointer;
  }
}
</style>
