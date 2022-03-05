<template>
  <div>
    <el-dialog class="preview-box" title="" :visible.sync="previewBoxDialogVisible" width="375px" :close-on-click-modal='false'>
      <UserInfo :userData="userData"></UserInfo>
      <div class="preview-content">
        <template v-if="formData.materialType == 1" class="content_warp">
          <h2 class="title">{{formData.title}}</h2>
          <div v-if="formData.author || formData.pushTime" class="info">
            <span v-if="formData.author" class="author">{{formData.author}}</span>
            <span v-if="formData.isTimeShow" class="time">{{formData.pushTime ? formatDate(formData.pushTime, "yyyy-MM-dd") : ''}}</span>
          </div>
          <p class="content" v-html="formData.content"></p>
        </template>

        <div v-if="formData.materialType == 2 && formData && formData.documentUrl" class="file-content">
          <iframe class="file-box" :src="'https://view.xdocin.com/view?src=' + encodeURIComponent(formData.documentUrl)" width="100%"
                  height="auto"></iframe>
        </div>
        <div v-if="formData.materialType == 3 && formData && formData.cover" class="img_preview">
          <img :src="formData.cover" alt="">
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import UserInfo from '../userInfo.vue'
import { formatDate } from '../../../utils/tool'
import { UsersInfo } from '../../../config/api'
export default {
  name: 'previewBox',
  components: {
    UserInfo,
  },
  data() {
    return {
      previewBoxDialogVisible: false,
      formData: {},
      userData: null,
    }
  },
  computed: {
    userNo() {
      let token = this.$store.getters.token
      return token.split('|')[1]
    },
  },
  methods: {
    getQecode() {
      UsersInfo(this.userNo).then((res) => {
        const { code, data } = res
        if (code === 'success') {
          this.userData = data
        }
      })
    },
    show(data) {
      // console.log('---materialType---', data)
      this.formData = data
      this.previewBoxDialogVisible = true
      this.getQecode()
    },
    hide() {
      this.previewBoxDialogVisible = false
    },
    formatDate,
  },
}
</script>
<style lang="less" scoped>
.preview-box {
  /deep/ .el-dialog {
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
    }
    .el-dialog__body {
      overflow-y: auto;
      height: 667px;
      padding: 16px 0;
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
    img {
      max-width: 100%;
    }
  }
  .preview-content {
    padding: 0 16px;
    .title {
      margin: 0 0 14px;
      font-size: 22px;
    }
    .info {
      margin-bottom: 22px;
      font-size: 0;
      span {
        display: inline-block;
        line-height: 20px;
        font-size: 15px;
      }
      .author,
      .time {
        margin: 0 10px 10px 0;
      }
      .time {
        color: rgba(0, 0, 0, 0.3);
      }
    }
    .content {
      font-size: 15px;
    }
  }
  .file-content {
    .file-box {
      // min-height: calc(100vh - 270px);
      height: 100vh;
      border: none;
    }
    .h2 {
      min-height: calc(100vh - 70px);
    }
  }
  .img_preview {
    img {
      width: 100%;
    }
  }
}
</style>