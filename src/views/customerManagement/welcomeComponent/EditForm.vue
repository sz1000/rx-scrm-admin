<template>
  <div class="edit_dialog">
    <el-dialog title="编辑入群欢迎语" :visible.sync="editVisible" :before-close="dialogForm" :close-on-click-modal="false" width="736px">
      <el-form :model="addCodeForm" :rules="editRules" ref="ruleForm" label-width="84px" label-position="right">
        <el-form-item label="欢迎语1:" prop="content">
          <div class="addBtn pointer" @click="addName('[用户昵称]')">
            插入客户昵称
          </div>
          <el-input show-word-limit v-model="addCodeForm.content" id="textarea" type="textarea" maxlength="300" @change="changeInput"
                    placeholder="请输入回复内容"></el-input>
        </el-form-item>
        <el-form-item label="欢迎语2:">
          <el-upload class="avatar-uploader" action="#" ref="upload" :show-file-list="true" :auto-upload="false" :file-list="fileList"
                     :on-change="changeFile" :on-remove="removeFile" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <i class="el-icon-circle-close deleteBtn pointer" @click="deleteImg"></i>
          <div class="adviceTxt">
            建议上传大小不超过2MB的图片，格式支持jpeg、jpg、png
          </div>
        </el-form-item>
        <el-form-item label="消息提醒:">
          <el-switch v-model="addCodeForm.value" active-value="1" inactive-value="0" active-color="#4168F6" inactive-color="#B9B9B9" disabled
                     @change="changeData">
          </el-switch>
          <span class="switchText">开启后，新建该条欢迎语会通过“客户群”群发通知企业全部员工。</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    editVisible: {
      type: Boolean,
    },
    detailForm: {
      type: Object,
    },
  },

  data() {
    return {
      addCodeForm: {
        content: '',
        value: 1,
      },
      imageUrl: '',
      fileList: [],
      editRules: {
        content: [
          { required: true, trigger: 'blur', message: '请输入回复内容' },
        ],
      },
    }
  },
  created() {
    // console.log('----this.conte----', this.detailForm)
    this.addCodeForm.content = this.detailForm.textVal
    this.imageUrl = this.detailForm.imagePicUrl
    this.addCodeForm.value = this.detailForm.notify
  },
  watch: {},
  methods: {
    changeData(val) {
      // console.log(typeof val)
    },
    deleteImg() {
      // console.log('-----file----', this.fileList)
      this.imageUrl = ''
      this.fileList = []
      this.$refs.upload.clearFiles()
      // this.$refs.upload.uploadFiles = []
      // console.log('-----1111111----', this.$refs.upload.uploadFiles)
    },
    dialogForm() {
      this.addCodeForm = {}
      this.$emit('closeEdit')
    },
    dialogFormSure(formName) {
      // console.log('----222222-----', this.$refs.upload.uploadFiles)
      let tempText = this.addCodeForm.content.replace(/\[.*?\]/g, '%NICKNAME%')
      let formData = new FormData()
      let file = ''
      let config = ''
      if (this.$refs.upload.uploadFiles[0]) {
        file = this.$refs.upload.uploadFiles[0].raw
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      } else {
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      }
      // console.log('---1-11111----', file, config)
      formData.append('file', file)
      formData.append('textval', this.addCodeForm.content)
      formData.append('textcontent', tempText)
      formData.append('notify', this.addCodeForm.value)
      formData.append('templateId', this.detailForm.templateId)
      formData.append('imagePicUrl', this.imageUrl)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(
            '确认编辑入群欢迎语，已使用的客户群将同步更新？',
            '温馨提示',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning',
            }
          ).then(() => {
            this.$network
              .post('/customer-service/greeting/update', formData, config)
              .then((res) => {
                this.$emit('closeEdit')
                this.addCodeForm = {}
                this.$refs.upload.clearFiles()
              })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeInput() {},
    async addName(myValue) {
      // console.log(typeof myValue)
      const myField = document.getElementById('textarea')
      // console.log(myField, myValue)
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.addCodeForm.content =
          myField.value.substring(0, startPos) +
          myValue +
          myField.value.substring(endPos, myField.value.length)
        await this.$nextTick()
        myField.focus()
        myField.setSelectionRange(
          endPos + myValue.length,
          endPos + myValue.length
        )
      } else {
        this.addCodeForm.content += myValue
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(this.imageUrl)
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.raw.type == 'image/jpeg' ||
        file.raw.type == 'image/jpg' ||
        file.raw.type == 'image/png'
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isJPG || !isLt2M) {
        this.$message.error(
          '上传头像图片只能是 JPG,PNG,JEPG 格式,大小不能超过 2MB!'
        )
      }
      // console.log(isJPG, isLt2M)
      return isJPG && isLt2M
    },
    changeFile(file, fileList) {
      // console.log('----change---', file, fileList)
      if (this.beforeAvatarUpload(file)) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.fileList = fileList.slice(-1)
      }
    },

    removeFile(file, fileList) {
      // console.log(file, fileList)
      this.fileList = fileList
      this.imageUrl = ''
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
.edit_dialog {
  .addBtn {
    width: 116px;
    height: 32px;
    background: rgba(65, 104, 246, 0.04);
    border-radius: 4px;
    border: 1px solid #4168f6;
    color: #4168f6;
    text-align: center;
    line-height: 32px;
    margin-bottom: 8px;
  }
  /deep/.el-dialog {
    height: 748px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #3c4353;
      }
    }
    .el-dialog__body {
      padding: 16px;
      .el-textarea__inner {
        height: 218px !important;
      }
      .switchText {
        display: inline-block;
        margin-left: 8px;
        font-size: 14px;
        font-weight: 400;
        color: #838a9d;
      }
    }
    .avatar-uploader {
      border-radius: 4px;
      border: 1px solid #d9dae4;
      height: 196px;
      padding: 16px;
      display: flex;
      align-items: center;
      .el-upload-list__item-name {
        width: 150px;
        overflow: hidden;
      }
    }
    .deleteBtn {
      position: absolute;
      top: 22px;
      left: 140px;
      // color: #d9dae4;
      color: #fafafa;
      background: #d9dae4;
      border-radius: 50%;
      z-index: 10;
    }
    .adviceTxt {
      color: #d9dae4;
      position: absolute;
      bottom: 0;
      left: 16px;
    }
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      img {
        width: 128px;
        height: 128px;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 128px;
      height: 128px;
      line-height: 128px;
      text-align: center;
    }
    .el-form-item__content {
      line-height: 32px;
    }
    .el-form-item__label {
      line-height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3c4353;
      padding: 0 12px 0 0;
    }
    .el-input,
    .el-select,
    .el-input__inner {
      width: 404px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
      position: absolute;
      bottom: 16px;
      right: 16px;
      .el-button {
        width: 60px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        padding: 0;
        border: 1px solid #d9dae4;
      }
      .el-button--primary {
        background: #4168f6;
      }
    }
  }
}
</style>
