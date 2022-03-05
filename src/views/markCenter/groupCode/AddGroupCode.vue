<template>
  <div class="edit_dialog">
    <el-dialog title="新增群活码" :visible.sync="addCode" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <el-form :model="addCodeForm" :rules="editRules" ref="ruleForm" label-width="120px" label-position="right">
        <el-form-item label="活码名称:" prop='name'>
          <el-input v-model.trim="addCodeForm.name" placeholder="请输入活码名称" maxlength="12" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="渠道:" prop='region' class="channelItem">
          <el-dropdown trigger="click" placement='bottom-start'>
            <span class="el-dropdown-link">
              <div class="channelLink" @mouseover='showIcon=false' @mouseleave='showIcon=true'>
                <span class="channelName">{{addCodeForm.region}}</span>
                <i class="el-icon-arrow-down el-icon--right" v-if='showIcon'>
                </i>
                <i class="el-icon-circle-close pointer" v-else @click="clearInput">
                </i>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown" class="channelGroupMenu">
              <div @click="add" class="channelBtn">
                <i class="el-icon-plus"></i>
                添加渠道
              </div>
              <div class="addinput">
                <el-input v-model="addInput" placeholder="输入后回车完成" v-show="showInput" maxlength="15" @keydown.enter.native="newItem"></el-input>
              </div>
              <el-dropdown-item v-for="(item,index) in items" :key="index" @click.native="selectInput(item)">{{item.name}}</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>

        </el-form-item>
        <el-form-item label="拉群方式:" prop='addBy'>
          <el-select v-model="addCodeForm.addBy" placeholder="请选择拉群方式" @change="changeWay" clearable>
            <el-option v-for="item in groupStyle" :key="item.value" :label="item.label" :value="item.addBy">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开启添加联系人:">
          <el-switch v-model="addCodeForm.switchStatus" active-color="#4168F6" inactive-color="#B9B9B9" :disabled='showRoled'
                     @change="switchOpenBtn" />
        </el-form-item>
        <el-form-item label="使用员工:" prop='userArr' v-if="addCodeForm.switchStatus">
          <el-select v-model="addCodeForm.userArr" placeholder="请选择使用员工，可多选" multiple collapse-tags @change="userChange" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.userNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="群名称设置:" v-if='!addCodeForm.switchStatus'>
          <el-input v-model.trim="addCodeForm.groupName" placeholder="请输入活码名称" maxlength="12" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="入群提示:" v-if='!addCodeForm.switchStatus'>
          <el-input v-model.trim="addCodeForm.addHint" placeholder="请输入入群提示" maxlength="16" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="入群引导语:" prop="contest" label-width="120px" class="textItem" v-if="addCodeForm.switchStatus">
          <el-input show-word-limit v-model="addCodeForm.contest" type="textarea" maxlength="300" placeholder="请输入入群引导语"></el-input>
        </el-form-item>
        <div v-for="(item,index) in logoImgs" :key="index" class="groupBox">
          <span style="color:red;position: absolute;top:8px;left:37px">*</span>
          <el-form-item :label="'二维码'+ (index + 1)+':' " label-width="120px">
            <el-upload class="avatar-uploader" action="#" :ref="'upload'+index" accept="image/png,image/jpg,image/jpeg" list-type="picture"
                       :show-file-list="false" :auto-upload="false" :file-list="item.fileList"
                       :on-change="changeFile.bind(null, {'index':index,'data':item})" :on-remove="removeFile.bind(null, {'index':index,'data':item})"
                       :on-success="handleAvatarSuccess.bind(null, {'index':index,'data':item})" :before-upload="beforeAvatarUpload">
              <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" />
              <div v-else class="textCode"><i class="el-icon-plus avatar-uploader-icon"></i>
                <span>请上传二维码</span>
              </div>
            </el-upload>
            <i class="el-icon-delete" v-if="logoImgs.length>1" @click="deleteImg(item,index)"></i>
            <div class="maxPeople">
              <span>群上限人数</span>
              <span>
                <el-input-number v-model="item.groupTotal" controls-position="right" size="small" :min="1" :max="200" maxlength='3'
                                 @change="changeMax(item)"></el-input-number>
              </span>
              <span style="margin-left:8px;display:inline-block">人</span>
            </div>
            <div class="selectGroup" v-if="showRoled">
              <el-select v-model="item.chatId" placeholder="选择群聊" @change="changeGroup" clearable>
                <el-option v-for="item in groupList" :key="item.value" :label="item.name" :value="item.chatId">
                </el-option>
              </el-select>

            </div>
          </el-form-item>
        </div>
      </el-form>
      <div class="codeBtn pointer" @click="addEnterCode">
        <img src="../../../assets/images/icon_add@2x.png" alt="" />
        新增群活码
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" v-preventReClick @click="dialogFormSure('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    addCode: {
      type: Boolean,
    },
  },

  data() {
    return {
      addCodeForm: {
        name: '',
        contest: '',
        switchStatus: true,
        addBy: '',
        region: '',
        chId: '',
        groupName: '',
        addHint: '',
        address: '',
        userArr: [],
      },
      options: [],
      showIcon: null,
      showInput: false,
      items: [
        // { name: '哈哈哈' },
        // { name: '阿达' },
        // { name: '是大概多少' },
        // { name: '给对方s' },
      ],
      addInput: '',
      groupStyle: [
        {
          label: '群二维码拉群',
          addBy: 1,
        },
        {
          label: '企微活码拉群',
          addBy: 2,
        },
      ],
      groupList: [],
      logoImgs: [
        {
          groupTotal: '200',
          chatId: '',
        },
      ],
      showRoled: true,
      editRules: {
        name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入活码名称',
          },
        ],
        userArr: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value && value.length > 0) {
                callback()
              } else {
                callback('请选择使用员工')
              }
            },
          },
        ],

        region: [
          {
            required: true,
            message: ' 请选择渠道 ',
            trigger: 'change',
          },
        ],
        contest: [
          { required: true, trigger: ['blur', 'change'], message: '请输入' },
        ],
        addBy: [
          { required: true, message: '请选择拉群方式', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    this.getChannelList()
    this.getGroupInfoList()
  },
  methods: {
    getGroupInfoList() {
      this.$network
        .get('/customer-service/group/getGroupInfoList')
        .then((res) => {
          this.groupList = res.data
        })
    },
    dialogFormCancel() {
      this.addCodeForm = {}
      this.$emit('closeaddCode')
    },
    dialogFormSure(formName) {
      let domain = ''
      if (
        location.hostname == 'dev-console.jzcrm.com' ||
        location.hostname == 'localhost'
      ) {
        domain = 'https://dev-console.jzcrm.com'
      } else if (location.hostname == 'test-console.jzcrm.com') {
        domain = 'https://test-console.jzcrm.com'
      } else {
        domain = 'https://console.jzcrm.com'
      }
      if (!this.addCodeForm.switchStatus) {
        this.addCodeForm.address = `${domain}/#/transitCode?name=${this.addCodeForm.name}`
      }
      let isCode = this.logoImgs.some((item) => {
        return !item.imageUrl
      })
      // console.log(isCode)
      let tempImgs = JSON.parse(JSON.stringify(this.logoImgs))
      // console.log('tempImgs-----', tempImgs)

      tempImgs = tempImgs.map((item) => {
        return {
          groupId: item.chatId,
          groupTotal: item.groupTotal,
          groupAddress: item.imageUrl,
        }
      })

      let params = {
        groupEntityList: tempImgs,
        livecodeEntity: this.addCodeForm,
        userArr: this.addCodeForm.userArr,
      }
      this.$refs[formName].validate((valid) => {
        if (valid && !isCode) {
          this.$network
            .post('/user-service/livecodegroup/add', params)
            .then((res) => {
              this.$emit('closeaddCode')
              this.addCodeForm = {}
            })
        } else {
          this.$message({
            type: 'error',
            message: '请完善信息',
          })
        }
      })
    },
    userChange(val) {
      // console.log(val)
    },
    switchOpenBtn(val) {
      // console.log(this.addCodeForm.switchStatus)
    },
    changeWay(val) {
      // console.log(val)
      if (val == 2) {
        this.showRoled = false
      } else {
        this.showRoled = true
        this.addCodeForm.switchStatus = true
      }
    },
    changeGroup(val) {
      console.log(val)
    },
    changeMax(item) {
      console.log(item)
    },
    handleAvatarSuccess(obj, res, file) {
      let p = 'upload' + obj.index
      this.$refs[p][0].clearFiles()
      var imgList = this.logoImgs
      var index = obj.index
      imgList[index].imageUrl = URL.createObjectURL(file.raw)
      this.$set(this.logoImgs, index, {})
      // console.log('2222222222222----------', this.logoImgs)
    },
    beforeAvatarUpload(file) {
      // console.log(file)
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
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      return isJPG && isLt2M
    },
    changeFile(obj, file, fileList) {
      // console.log('---上传--', obj, file, fileList)
      let index = obj.index
      this.logoImgs[index].fileList = fileList.slice(-1)
      let formData = new FormData()
      formData.append('file', file.raw)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      if (this.beforeAvatarUpload(file)) {
        this.$network
          .post('/user-service/livecodegroup/upload', formData, config)
          .then((res) => {
            this.$set(this.logoImgs, index, {
              imageUrl: res.data.url,
              groupTotal: '200',
              chatId: '',
            })
          })
      }
      // console.log('this.logoImgs------------', this.logoImgs)
    },

    removeFile(obj, file, fileList) {
      console.log(obj, file, fileList)
      this.logoImgs[obj.index].fileList = fileList // 再一次赋值
      this.logoImgs[obj.index].imageUrl = ''
    },
    addEnterCode() {
      this.logoImgs.push({ imageUrl: '', chatId: '', groupTotal: '200' })
      // console.log('111111111111111----', this.logoImgs)
    },
    deleteImg(item, v) {
      console.log(item, v)
      this.logoImgs.splice(v, 1)
    },
    add() {
      this.showInput = true
      this.addInput = ''
    },
    selectInput(item) {
      // console.log(item)
      this.addCodeForm.region = item.name
      this.addCodeForm.chId = item.chId
      this.$refs['ruleForm'].clearValidate()
      // this.resign()
    },
    getChannelList() {
      // console.log(this.addInput)
      this.$network
        .get('/user-service/livecodegroup/getselect', { name: this.addInput })
        .then((res) => {
          this.options = res.data.userlist
          this.items = res.data.chlist
          this.items.forEach((v) => {
            if (v.name === this.addInput) {
              this.addCodeForm.chId = v.chId
            }
          })
          if (!res.result) {
            this.addCodeForm.region = ''
            this.$message({
              message: res.msg,
              type: 'error',
            })
          }
        })
    },
    newItem() {
      this.addCodeForm.region = this.addInput
      this.showInput = false
      // this.items.push({ name: this.addCodeForm.region })
      this.getChannelList()
      // this.resign()
    },
    clearInput() {
      this.addCodeForm.region = ''
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    height: 606px;
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
      height: 491px;
      padding: 16px;
      overflow-y: scroll;
      .textItem {
        margin-bottom: 205px;
      }
      .el-textarea__inner {
        height: 218px !important;
      }
      .groupBox {
        margin-bottom: 180px;
        position: relative;
        .el-icon-delete {
          position: absolute;
          right: 12px;
          top: 12px;
          cursor: pointer;
        }
        .el-form-item__content {
          height: 204px;
          border-radius: 4px;
          border: 1px solid #d9dae4;
          padding: 10px 0 0 16px;
        }
        .avatar-uploader {
          .el-upload {
            width: 128px;
            height: 128px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .textCode {
            span {
              display: block;
              color: #d9dae4;
            }
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            // width: 128px;
            height: 60px;
            line-height: 110px;
            text-align: center;
          }
        }
        .maxPeople {
          color: #838a9d;
          span {
            display: inline-block;
          }
          .el-input-number__decrease,
          .el-input-number__increase {
            display: none;
          }
          .el-input,
          .el-input-number {
            margin: 0 2px;
            width: 58px;
          }
          .el-input__inner {
            width: 58px;
            height: 28px;
            background: #ffffff;
            border-radius: 4px;
            padding: 0 5px;
          }
        }
        .selectGroup {
          position: absolute;
          right: 48px;
          top: 16px;
          .el-input__inner {
            width: 116px;
          }
        }
      }
      .el-dropdown {
        width: 100%;

        .channelLink {
          // width: 406px;
          padding-left: 16px;
          height: 32px;
          background: #ffffff;
          box-shadow: 0px 3px 40px 0px rgba(0, 0, 0, 0.04);
          border-radius: 4px;
          border: 1px solid #d9dae4;
          .channelName {
            display: inline-block;
            // width: 320px;
            width: 90%;
          }
        }
      }
      .channelItem {
        // font-size: 0;
        position: relative;
        .el-dropdown-link {
          &:focus-visible {
            outline: none !important;
          }
        }
      }
      &::-webkit-scrollbar {
        width: 0;
      }
    }
    .codeBtn {
      width: 104px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      text-align: center;
      color: #4168f6;
      line-height: 32px;
      margin-left: 120px;
      img {
        width: 12px;
        height: 12px;
      }
    }
    .el-form-item {
      margin-bottom: 20px;
      height: 32px;
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
      width: 100%;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
      position: absolute;
      bottom: 0;
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
