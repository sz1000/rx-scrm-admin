<template>
  <div>
    <go-back></go-back>
    <div class="content-box edit-article">
      <el-form class="edit-article-form" v-loading="dataLoading" ref="form" :rules="rules" :model="form" label-width="95px" label-position="right">
        <el-form-item label="文章标题:" prop="title">
          <el-input v-model.trim="form.title" placeholder="请输入文章标题" maxlength="128" show-word-limit clearable=""></el-input>
        </el-form-item>
        <el-form-item label="作者:" prop="author">
          <el-input v-model="form.author" placeholder="请输入来源/作者" maxlength="16" show-word-limit clearable=""></el-input>
        </el-form-item>
        <el-form-item label="发布时间:" prop="pushTime">
          <el-checkbox v-model="form.isTimeShow" class="checkbox-customize">显示时间</el-checkbox>
          <el-date-picker v-if="form.isTimeShow" v-model="form.pushTime" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文章内容:" prop="content">
          <div ref="editor" class="editor" v-loading="uploadLoading" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)"></div>
        </el-form-item>
        <el-form-item label="文章封面:" prop="cover">
          <upload-img :imgs.sync="form.cover" :limit="1" httpsUrl></upload-img>
        </el-form-item>
        <el-form-item label="文章摘要:" prop="contentAbstract">
          <el-input type="textarea" class="text-area" :rows="6" v-model="form.contentAbstract" placeholder="请输入文章摘要" maxlength="108" show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="confirm">创建文章</el-button>
        <el-button @click="preview">预览文章</el-button>
      </div>
    </div>
    <preview-box ref="previewBox"></preview-box>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import {
  ArticleDetail,
  uploadToOss,
  AddArticle,
  ModifyArticle,
  ArticleFromReprint,
} from '../../../config/api'
import E from 'wangeditor'

import GoBack from '../../../components/MaterialTemplate/goBack'
import UploadImg from '../../../components/UpLoadImg/index'
import PreviewBox from '../../../components/Dialog/PreviewBox/index'

export default {
  name: 'editArticle',
  data() {
    return {
      dataLoading: false,
      articleId: '',
      articleUrl: '',
      isPublic: '',
      form: {
        title: '',
        author: '',
        isTimeShow: false,
        pushTime: '',
        content: '',
        cover: '',
        contentAbstract: '',
        corpId: '',
      },
      uploadLoading: false,
      loadingText: '上传图片中...',
      rules: {
        title: [
          {
            required: true,
            message: '请输入文章标题',
            trigger: ['blur', 'change'],
          },
          {
            min: 1,
            max: 128,
            message: '长度在 1 到 128 个字符',
            trigger: ['blur', 'change'],
          },
        ],
        cover: [
          {
            required: true,
            message: '请上传封面',
            trigger: ['change'],
          },
        ],
        content: [{ required: true, message: '请输入文章内容' }],
        pushTime: [
          {
            validator: (rule, value, callback) => {
              if (this.form.isTimeShow && !value) {
                callback(new Error('请选择日期'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  computed: {
    ...mapState(['corpId']),
  },
  watch: {
    'form.content'(val) {
      if (val) {
        this.$refs.form.clearValidate('content')
      } else {
        this.$refs.form.validate('content')
      }
    },
  },
  created() {
    const { articleId, articleUrl, tab } = this.$route.query
    this.isPublic = tab
    if (articleId || articleUrl) {
      this.dataLoading = true
      this.articleId = articleId
      this.articleUrl = articleUrl
      this.getDetails()
    } else {
      this.$nextTick(() => {
        this.initEditor()
      })
    }
  },
  methods: {
    getDetails() {
      let ApiOpts = ArticleDetail,
        params = this.articleId

      if (this.articleUrl) {
        ApiOpts = ArticleFromReprint
        params = {
          articleUrl: decodeURIComponent(this.articleUrl),
        }
      }

      ApiOpts(params).then((res) => {
        const { code, data, msg } = res
        if (code === 'success') {
          this.form = data
          this.$nextTick(() => {
            this.initEditor()
          })
        } else {
          this.$message.error(msg)
          this.goBack()
        }
        this.dataLoading = false
      })
    },
    confirm() {
      this.validate()
        .then(async () => {
          let ApiOpts = null

          if (this.articleId) {
            ApiOpts = ModifyArticle
          } else {
            ApiOpts = AddArticle
          }

          this.form.corpId = this.corpId
          this.form.isPublic = this.isPublic == 1 ? false : true

          ApiOpts(this.form).then((res) => {
            const { code, msg } = res
            if (code === 'success') {
              this.$message.success(msg)
              this.goBack()
            } else {
              this.$message.error(msg)
            }
          })
        })
        .catch((err) => {
          console.warn(err)
        })
    },
    goBack() {
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    },
    preview() {
      this.validate()
        .then(async (data) => {
          this.$refs.previewBox.show({ materialType: '1', ...data })
        })
        .catch((err) => {
          console.warn(err)
        })
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
    // 初始化富文本
    initEditor() {
      let editor = new E(this.$refs.editor)
      editor.config.zIndex = 1000
      editor.config.placeholder = '请输入文章内容'
      // 关闭粘贴样式的过滤
      editor.config.pasteFilterStyle = false
      editor.config.onchange = (html) => {
        // console.log('change' , html)
        this.form.content = html
      }
      // 图片上传
      editor.config.customUploadImg = (files, insert) => {
        this.uploadToOss(files, insert, '图片上传失败!', '上传图片中...')
      }
      // 视频上传
      editor.config.customUploadVideo = async (files, insert) => {
        this.uploadToOss(files, insert, '视频上传失败!', '上传视频中...')
      }

      // 跨域上传中如果需要传递 cookie 需设置 withCredentials
      // editor.config.withCredentials = true;
      editor.create()
      editor.txt.html(this.form.content)
    },
    uploadToOss(files, insert, errTips, loadingText) {
      let formData = new FormData()
      formData.append('file', files[0])

      const fileName = files[0].name
      let fileType = fileName.substring(fileName.lastIndexOf('.') + 1)

      formData.append('filetype', fileType)
      formData.append('type', 'material')

      this.loadingText = loadingText
      this.uploadLoading = true

      uploadToOss(formData)
        .then((res) => {
          this.uploadLoading = false
          const { code, data } = res
          if (code === 'success' && data && data.url) {
            insert(data.url)
          }
        })
        .catch(() => {
          this.$message.error(errTips)
          this.uploadLoading = false
        })
    },
  },
  components: {
    GoBack,
    UploadImg,
    PreviewBox,
  },
}
</script>
<style lang="less" scoped>
@import url('./style/main');
.edit-article {
  padding: 16px;
  .edit-article-form {
    max-width: 800px;
    /deep/ .el-form-item__label {
      color: #3c4353;
    }
  }
  .btns {
    button {
      height: 32px;
      padding: 0 16px;
    }
    /deep/ .el-button--primary {
      border-color: #4168f6;
      background-color: #4168f6;
    }
  }
  .checkbox-customize {
    margin-right: 16px;
  }
  .editor {
    max-width: 720px;
    text-align: left;
    line-height: normal;
    /deep/ .w-e-toolbar {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    /deep/ .w-e-text-container {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    /deep/ .w-e-text-container {
      z-index: 999 !important;
    }
  }
  /deep/ .el-textarea__inner {
    padding: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
  }
}
</style>