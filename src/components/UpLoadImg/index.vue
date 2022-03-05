<template>
  <div class="el-upload-img-component" :class="{disabled: disabled || hidePlus}">
    <el-upload drag :disabled="disabled" :file-list="computedImgs" :on-success="uploadImgSuccess" :on-error="uploadImgError" :headers="headers"
               :multiple="false" :limit="limit" :name="name" :action="uploadFileUrl" :before-upload="beforeUpload" :data="fileData"
               :before-remove="handleImgBeforeRemove" :on-exceed="exceed" :on-preview="previewPic" :on-remove="handleImgRemove"
               :class="uploadDisabled ? 'pic_disabled' : ''">
      <!-- <div class="upload-option">
                <i class="el-icon-plus"></i>
                <span class="tips-text">上传图片</span>
            </div> -->
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <preview-img :show.sync="showPreviewImg" :modal="modal" :url.sync="previewImgUrl"></preview-img>
  </div>
</template>

<script>
// imgs为组件初始化加载的图片，支持数组和字符串两种形式，暂时不支持组件外部直接修改imgs来改变图片的功能

import { uploadFileUrl } from '../../config/api'
import PreviewImg from '../PreviewImg/index'
import { byteConvert } from '../../utils/tool'

export default {
  data() {
    return {
      uploadFileUrl,
      name: 'imgOrMp3',
      showPreviewImg: false,
      previewImgUrl: '',
      computedImgs: [],
      changeFlag: false, // flag标识，组件内部变化引发的图片变化则为true
      uploadDisabled: false,
      fileData: { filetype: '', type: 'material' },
    }
  },
  props: {
    type: {
      type: String,
      default: 'string', // string或者array
    },
    imgs: {
      // 接收数组或者以';'分割的字符串
      default: () => '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modal: {
      // 预览背景图的时候加上半透明底色背景
      type: Boolean,
      default: true,
    },
    limit: {
      type: Number,
      default: 3,
    },
    hidePlus: {
      type: Boolean,
      default: false,
    },
    httpsUrl: {
      type: Boolean,
      default: false,
    },
    gif: {
      type: Boolean,
      default: false,
    },
    maxFileSize: {
      type: Number,
      default: 2048 * 1024 * 5,
    },
    imgName: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    // 初始化的时候将不同形式的imgs都转化为数组[{name:'',url:''}]
    const imgs = this.imagesToArr(this.imgs)
    this.computedImgs = imgs.map((img) => ({
      name: img,
      url: img,
    }))

    if (this.httpsUrl) {
      this.name = 'file'
    }
  },
  watch: {
    imgs(val) {
      if (this.changeFlag === true) {
        this.changeFlag = false
      } else {
        const imgs = this.imagesToArr(val)
        this.computedImgs = imgs.map((img) => ({
          name: img,
          url: img,
        }))
      }

      if (this.imgs && this.imgs.length && this.limit <= 1) {
        this.uploadDisabled = true
      } else {
        this.uploadDisabled = false
      }
    },
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
    if (this.imgs && this.imgs.length && this.limit <= 1) {
      this.uploadDisabled = true
    }
  },
  methods: {
    imagesToArr(imgs) {
      if (this.type === 'array') {
        if (Array.isArray(imgs)) {
          return imgs
        } else {
          return []
        }
      } else {
        if (typeof imgs === 'string') {
          imgs = imgs.split(';').filter((i) => i !== '')
        } else {
          imgs = []
        }
      }
      return imgs
    },
    imgsChange(images = []) {
      this.changeFlag = true
      if (!Array.isArray(images)) {
        images = []
      }
      this.computedImgs = images
      if (this.imgName) {
        this.$emit('update:imgs', images)
        return
      }
      if (this.type === 'array') {
        images = images.map((image) => image.url)
      } else {
        let imgString = ''
        images.forEach((image) => {
          imgString = imgString + (imgString ? ';' : '') + image.url
        })
        images = imgString
      }
      this.$emit('update:imgs', images)
    },
    copyImgs() {
      return JSON.parse(JSON.stringify(this.computedImgs))
    },
    uploadImgSuccess(response, fileData, fileDataList) {
      const imgs = this.copyImgs()
      if (
        fileData &&
        fileData.response &&
        fileData.response.code === 'success'
      ) {
        imgs.push({
          name: fileData.name,
          url: fileData.response.data.url,
          objectname: fileData.objectname,
        })
        this.$emit('add-img', {
          url: fileData.response.data,
          index: imgs.length - 1,
        })
        this.$emit('change', response.data)
      } else {
        const index = imgs.findIndex(
          (i) => fileData.objectname === i.objectname
        )
        imgs.splice(index, 1)
        this.$message.error(response.msg || '上传失败！')
      }
      this.imgsChange(imgs)
    },
    uploadImgError(e) {
      this.$message.error(e.msg || '上传失败！')
    },
    handleImgBeforeRemove(file, fileList) {
      const imgs = this.copyImgs()
      // 添加图片时，如果上传的文件不符合要求，会触发on-remove事件，将其remove，这时filelist有这个文件，但是upload组件的file-list（这里对应imgs）里面没有，这时直接允许其移除，不需要用户确定
      if (imgs.length !== fileList.length) {
        return true
      }
      return this.$confirm(`确定删除${file.name}?`, '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((res) => {
        const delIndex = fileList.findIndex(
          (item) => item.objectname === file.objectname
        )

        this.$emit('del-img', { index: delIndex, url: file.url })
      })
    },
    handleImgRemove(file, fileList) {
      this.imgsChange(fileList)
    },
    beforeUpload(file) {
      if (file.size > this.maxFileSize) {
        this.$message.error(`请选择小于${byteConvert(this.maxFileSize)}的图片`)
        return false
      }
      if (!/\.png$|\.jpg$|\.jpeg$/i.test(file.name)) {
        this.$message.error('请上传png、jpg格式的图片')
        return false
      }

      this.fileData.filetype = file.name.substring(
        file.name.lastIndexOf('.') + 1
      )
    },
    exceed() {
      this.$message({
        message: '超出文件个数限制！',
        type: 'warning',
      })
    },
    previewPic(file) {
      this.showPreviewImg = true
      this.previewImgUrl = file.url
    },
  },
  components: {
    PreviewImg,
  },
}
</script>

<style lang="less" scoped>
.el-upload-img-component.disabled {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
.upload-option {
  height: 100%;
  position: relative;
  .el-icon-plus,
  .tips-text {
    color: #c0c4cc;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .el-icon-plus {
    top: 30%;
  }
  .tips-text {
    height: 100%;
    bottom: -15%;
  }
}
</style>
<style>
.pic_disabled .el-upload--picture-card {
  display: none !important;
}
</style>