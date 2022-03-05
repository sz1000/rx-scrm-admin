<template>
  <el-dialog class="mt-upload" title="上传海报" :visible.sync="uploadPosterDialogVisible" :close-on-click-modal="false" width="520px"
             v-if="uploadPosterDialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="95px" label-position="right">
      <el-form-item label="海报图片:" prop="posterUrl">
        <upload-img :imgs.sync="form.posterUrl" :limit="1" :imgName="true" httpsUrl @change='SuccessImg'></upload-img>
      </el-form-item>
      <el-form-item label="海报标题:" prop="title">
        <el-input :rows="6" v-model="form.title" placeholder="请输入标题" maxlength="108"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'

import { AddPoster, PosterDetail } from '../../../config/api'

import UploadImg from '../../UpLoadImg/index'

export default {
  name: 'mtUpload',
  props: ['isPublic'],
  data() {
    return {
      uploadPosterDialogVisible: false,
      uploadLoading: false,
      form: {
        posterName: '',
        posterUrl: '',
        corpId: '',
        title: '',
      },
      rules: {
        posterUrl: [
          { required: true, message: '请上传海报', trigger: ['change'] },
        ],
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  computed: {
    ...mapState(['corpId']),
  },
  inject: ['getList'],
  methods: {
    show(data) {
      if (data) {
        this.documentId = data
        this.getData()
      } else {
        this.documentId = null
      }
      this.uploadPosterDialogVisible = true
    },
    hide() {
      this.form = this.initForm()
      this.uploadPosterDialogVisible = false
    },
    async getData() {
      let { code, data, msg } = await PosterDetail(this.documentId)
      if (code === 'success') {
        this.form = data
        this.form.title = data.posterName
        // console.log(this.form)
      } else {
        this.$message.error(msg)
      }
    },
    initForm() {
      return {
        posterName: '',
        posterUrl: '',
        corpId: '',
        title: '',
      }
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve(this.form)
          } else {
            reject('请完善表单')
          }
        })
      })
    },
    SuccessImg(data) {
      if (data && data.url) {
        const { name = '', url = '', size = null } = data
        this.form.title = name
      }
    },
    confirm() {
      // console.log(this.form.posterUrl, '-------')
      if (
        Array.isArray(this.form.posterUrl) &&
        this.form.posterUrl.length === 1
      ) {
        let form = this.form.posterUrl[0]
        // this.form = this.form.posterUrl[0]
        this.form.posterName = this.form.title
        this.form.posterUrl = form.url
        this.form.corpId = this.corpId
        this.form.isPublic = this.isPublic == 1 ? false : true
      }
      this.validate()
        .then(async () => {
          AddPoster(this.form).then((res) => {
            const { code, msg } = res
            if (code === 'success') {
              this.getList()
              this.$message.success(msg)
              this.hide()
            } else {
              this.$message.error(msg)
            }
          })
        })
        .catch((err) => {
          console.warn(err)
        })
    },
  },
  components: {
    UploadImg,
  },
}
</script>
<style lang="less" scoped>
.mt-upload {
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
      min-height: 185px;
      padding: 32px 16px;
      .el-form-item {
        margin-bottom: 20px;
        .el-form-item__label {
          line-height: 32px;
          font-weight: 500;
        }
        .el-form-item__content {
          line-height: 32px;
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
    }
    .el-dialog__footer {
      padding: 16px;
      border-top: 1px solid #f0f2f7;
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
}
</style>