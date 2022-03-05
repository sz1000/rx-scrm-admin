<template>
  <el-dialog v-load="loading" class="mt-upload" title="上传文件" :visible.sync="uploadDialogVisible" :close-on-click-modal="false" width="520px"
             :before-close="hide" v-if="uploadDialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="95px" label-position="right">
      <el-form-item label="上传文件:" prop="name" class="upload-event">
        <upload-pdf ref="uploadPdf" :detail="form" @change="FileUploadChange"></upload-pdf>
      </el-form-item>
      <el-form-item label="文件标题:" prop="name">
        <el-input :rows="6" v-model="form.name" placeholder="请输入标题" maxlength="108"></el-input>
      </el-form-item>
      <el-form-item label="上传封面:" prop="cover">
        <upload-img :imgs.sync="form.cover" :limit="1" httpsUrl></upload-img>
      </el-form-item>

      <el-form-item label="摘要:" prop="contentAbstract">
        <el-input type="textarea" :rows="6" v-model="form.contentAbstract" placeholder="请输入摘要" maxlength="108" show-word-limit></el-input>
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

import { throttle } from '../../../utils/tool'

import {
  SaleDocumentDetail,
  AddSaleDocument,
  ModifySaleDocument,
} from '../../../config/api'

import UploadPdf from '../../UploadPdf/index' // 可上传多种类型的文件
import UploadImg from '../../UpLoadImg/index'

export default {
  name: 'mtUpload',
  props: ['isPublic'],
  data() {
    return {
      loading: false,
      uploadDialogVisible: false,
      uploadLoading: false,
      form: {
        name: '',
        documentUrl: '',
        cover: '',
        contentAbstract: '',
        fileSize: null,
        title: '',
      },
      documentId: null,
      rules: {
        name: [{ required: true, message: '请上传文件', trigger: ['change'] }],
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: ['blur', 'change'],
          },
        ],
        cover: [{ required: true, message: '请上传封面', trigger: ['change'] }],
      },
    }
  },
  computed: {
    ...mapState(['corpId']),
  },
  inject: ['getList'],
  created() {},
  methods: {
    show(data) {
      if (data) {
        this.documentId = data
        this.getData()
      } else {
        this.documentId = null
      }
      this.uploadDialogVisible = true
    },
    hide() {
      this.form = this.initForm()
      this.uploadDialogVisible = false
    },
    async getData() {
      let { code, data, msg } = await SaleDocumentDetail(this.documentId)

      if (code === 'success') {
        this.form = data
        console.log(this.form)
      } else {
        this.$message.error(msg)
      }
    },
    initForm() {
      return {
        name: '',
        documentUrl: '',
        cover: '',
        contentAbstract: '',
        title: '',
      }
    },
    FileUploadChange(data) {
      if (data && data.url) {
        const { name = '', url = '', size = null } = data
        this.form.name = name
        this.form.documentUrl = url
        this.form.fileSize = size
        this.form.title = name
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
    confirm() {
      if (!throttle()) {
        return
      }
      this.validate()
        .then(async () => {
          this.loading = true
          let ApiOpts = AddSaleDocument

          if (this.documentId) {
            ApiOpts = ModifySaleDocument
          }

          this.form.corpId = this.corpId
          this.form.isPublic = this.isPublic == 1 ? false : true

          ApiOpts(this.form).then((res) => {
            const { code, msg } = res
            if (code === 'success') {
              this.getList()
              this.$message.success(msg)
              this.hide()
            } else {
              this.$message.error(msg)
            }
            this.loading = false
          })
        })
        .catch((err) => {
          console.warn(err)
        })
    },
  },
  components: {
    UploadPdf,
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
      .upload-event {
        .el-form-item__label {
          line-height: 41px;
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