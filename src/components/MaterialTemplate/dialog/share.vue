<template>
  <el-dialog class="mt-share" title="分享链接" :visible.sync="shareDialogVisible" :close-on-click-modal="false" width="520px">
    <el-form :model="form" label-width="70px" label-position="right">
      <el-form-item label="联系人:" prop="person">
        <el-select v-model="form.person" placeholder="请选择联系人" @change="choosePerson" clearable :disabled='disabled'>
          <el-option v-for="item in personOption" :key="item.id" :label="item.name" :value="item.userNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="linkData" class="qrcode-box" label="二维码:">
        <div id="qrcode" ref="qrcode" class="codeBox"></div>
        <span class="tips">也可在企业微信“侧边栏-素材”直接点击进行发送</span>
      </el-form-item>
    </el-form>
    <span v-if="qrCodeData" slot="footer" class="dialog-footer">
      <el-button><a :href="qrCodeData" download="二维码">下载二维码</a></el-button>
      <el-button type="primary" class="copy-btn" @click="copy" :data-clipboard-text="linkData">复制分享链接</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { UsersList } from '../../../config/api'
import QRCode from 'qrcodejs2'
import ClipboardJS from 'clipboard'

export default {
  name: 'mtShare',
  data() {
    return {
      disabled: false,
      isCommon: '',
      materialId: '',
      shareDialogVisible: false,
      form: {
        person: '',
      },
      personOption: [],
      linkData: '',
      qrCodeData: '',
      type: 1, // 1: 文章，2: 文件
      shareUrlOrigin: '',
    }
  },
  computed: {
    ...mapState(['corpId']),
    userNo() {
      let token = this.$store.getters.token || localStorage.getItem('token')
      return token.split('|')[1]
    },
  },

  methods: {
    show(data, type, isCommon) {
      // console.log('---isCommon----', isCommon)
      this.isCommon = isCommon
      this.materialId = data
      this.type = type
      this.getList()
      this.initData()
      this.shareDialogVisible = true
    },
    hide() {
      this.shareDialogVisible = false
    },
    initData() {
      this.linkData = ''
      this.qrCodeData = ''
      this.form.person = ''
    },
    async getList() {
      const { code, data, msg } = await UsersList(this.corpId)
      if (code === 'success') {
        this.personOption = data
        if (this.isCommon == 1) {
          this.disabled = true
          this.form.person = this.userNo
          this.choosePerson(this.userNo)
        } else {
          this.disabled = false
        }
      } else {
        this.$message.error(msg)
      }
    },
    creatQrCode() {
      this.$refs.qrcode.innerHTML = ''
      let qrcode = new QRCode(this.$refs.qrcode, {
        text: this.linkData,
        width: 120,
        height: 120,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      })
      qrcode._el.title = ''
      this.qrCodeData = document
        .getElementById('qrcode')
        .getElementsByTagName('canvas')[0]
        .toDataURL('image/png')
    },
    choosePerson(item) {
      console.log(item)
      if (window.location.origin == 'https://console.jzcrm.com') {
        this.shareUrlOrigin = 'https://h5.jzcrm.com'
      } else {
        this.shareUrlOrigin = 'https://test-h5.jzcrm.com'
      }
      this.linkData = `${this.shareUrlOrigin}/materialTemplate?materialId=${this.materialId}&type=${this.type}&userNo=${item}`
      this.creatQrCode()
    },
    copy() {
      var clipboard = new ClipboardJS('.copy-btn')
      clipboard.on('success', (e) => {
        clipboard.destroy()
        this.$message.success('复制成功')
      })
    },
  },
}
</script>
<style lang="less" scoped>
.mt-share {
  /deep/ .el-dialog {
    border-radius: 8px;
    overflow: hidden;
    .el-dialog__header {
      padding: 14px 16px;
      background-color: #fafbff;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
      }
    }
    .el-dialog__body {
      padding: 16px;
      .el-form-item {
        height: 32px;
        margin-bottom: 20px;
        .el-form-item__label {
          line-height: 32px;
          font-weight: 500;
        }
        .el-form-item__content {
          line-height: 32px;
        }
      }
      .qrcode-box {
        height: auto;
        .tips {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          color: #cecece;
        }
      }
    }
    .el-input,
    .el-select {
      width: 100%;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      .el-input__icon {
        line-height: 32px;
      }
    }
    .el-button {
      height: 32px;
      padding: 0 16px;
    }
    .el-button--primary {
      border-color: #4168f6;
      background-color: #4168f6;
    }
  }
}
</style>