<template>
  <div>
    <el-upload drag :file-list="fileList" class="upload-demo" :multiple="false" :limit="1" :headers="headers" :data="fileData" :action="uploadFileUrl"
               :before-upload="BeforeUpload" :on-success="Success" :on-remove="OnRemove">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <!-- <el-button class="btn" size="small" type="primary" plain>上传文件</el-button> -->
      <!-- <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过20M</div> -->
    </el-upload>
  </div>
</template>

<script>
import { uploadFileUrl } from '../../config/api'

export default {
  props: ['detail'],
  watch: {
    detail(val) {
      if (val && val.documentUrl) {
        this.fileList = [
          {
            url: val.documentUrl,
            name: val.name,
          },
        ]
        this.hideBtn()
      } else {
        this.fileList = []
        this.showBtn()
      }
    },
  },
  data() {
    return {
      uploadFileUrl,
      fileList: [],
      fileData: { filetype: '', type: 'material' },
    }
  },
  computed: {
    headers() {
      return {
        Accept: 'application/json',
        token: localStorage.getItem('token'),
      }
    },
  },
  mounted() {
    if (this.detail && this.detail.documentUrl) {
      this.fileList = [
        {
          url: this.detail.documentUrl,
          name: this.detail.name,
        },
      ]
      this.hideBtn()
    } else {
      this.showBtn()
    }
  },
  methods: {
    Clear() {
      this.fileList = []
    },
    BeforeUpload(file) {
      console.log('FILE:::', file)
      // if (file.type !== 'application/pdf' || file.size / 1024 / 1024 >= 20) {
      if (
        !/\.ppt$|\.pptx$|\.doc$|\.docx$|\.xls$|\.xlsx$|\.pdf$|\.mp4$/i.test(
          file.name
        )
      ) {
        this.$message.error(
          '上传文件格式为ppt、pptx、doc、docx、xls、xlsx、pdf、MP4'
        )
        return false
      }
      if (/\.mp4$/i.test(file.name) && file.size / 1024 / 1024 >= 10) {
        this.$message.error('上传视频大小不能超过10MB!')
        return false
      }
      if (file.size / 1024 / 1024 >= 10) {
        this.$message.error('上传文件大小不能超过10MB!')
        return false
      }
      this.fileData.filetype = file.name.substring(
        file.name.lastIndexOf('.') + 1
      )
    },
    Success(response, file, fileList) {
      if (response.code === 'success') {
        this.hideBtn()
        response.data.size = file.size
        this.$emit('change', response.data)
      }
    },
    OnRemove() {
      this.$emit('change', null)
      this.showBtn()
    },
    showBtn() {
      document.getElementsByClassName('el-upload')[0].style.display = 'block'
    },
    hideBtn() {
      document.getElementsByClassName('el-upload')[0].style.display = 'none'
    },
  },
}
</script>
<style lang="less" scoped>
.upload-demo {
  .btn {
    width: 88px;
    border-radius: 4px;
    background-color: rgba(65, 104, 246, 0.04);
    border-color: #4168f6;
    color: #4168f6;
  }
  /deep/ .el-upload {
    text-align: left;
  }
}
</style>