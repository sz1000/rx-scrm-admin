<template>
  <div class="edit_dialog">
    <el-dialog title="转客户" :visible.sync="transferPeople" :before-close="dialogFormCancel" :close-on-click-modal='false' width="736px">
      <div class="infoTitle">
        <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px;vertical-align:-15%" />
        客户信息
      </div>
      <el-form :model="addCodeForm" :rules="editRules" ref="editRules" label-width="auto">
        <el-form-item label="客户名称:" prop="customerCalled" :rules="[{ required: true, message: '请输入客户名称', trigger: ['blur','change'] }]">
          <el-input v-model="addCodeForm.customerCalled" :disabled="true" maxlength="13" placeholder="请输入"></el-input>
        </el-form-item>
        <KehuTip :addChildForm="addCodeForm" v-on:getacf="getacf"></KehuTip>
        <el-form-item label="固定电话:">
          <el-input v-model="addCodeForm.mobil" maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="客户来源:" prop="source">
          <el-select v-model="addCodeForm.source" placeholder="请选择" clearable>
            <el-option v-for="item in optionSource" :key="item.value" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型:" prop="customerType">
          <el-select v-model="addCodeForm.customerType" placeholder="请选择" clearable>
            <el-option v-for="item in optionsCustom" :key="item.customerType" :label="item.label" :value="item.customerType">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客户阶段:">
          <el-select v-model="addCodeForm.stage" placeholder="请选择" clearable>
            <el-option v-for="item in optionsStage" :key="item.value" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>

        <GongsiTip :addChildForm="addCodeForm" v-on:getgst="getgst"></GongsiTip>
        <el-form-item label="企业规模:">
          <el-select v-model="addCodeForm.corpScale" placeholder="请选择" clearable>
            <el-option v-for="item in optionsScale" :key="item.value" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业:">
          <el-cascader size="large" :props="{ expandTrigger: 'click',value:'id' ,label:'name'}" :options="optionsCreat" v-model="addCodeForm.industry"></el-cascader>
        </el-form-item>
        <el-form-item label="地址:">
          <el-input v-model="addCodeForm.address" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="addCodeForm.remark" type="textarea" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom_form">
        <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px;vertical-align:-15%" />
        联系人信息
      </div>
      <el-form :model="botForm" :rules="botRules" label-width="auto">

        <el-form-item label="头像:" class="upload_avatar">
          <div class="demo-input-suffix" v-loading='loading'>
            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleAvatarSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="resetUpload" v-show="imageUrl">重新上传</div>
            </el-upload>
            <i v-show="imageUrl" class="el-icon-circle-close" @click="deleteImg"></i>
            <div class="imgTip">
              建议上传800*800像素、大小不超过2MB的图片,格式支持jpeg、jpg、png
            </div>
          </div>
        </el-form-item>
        <el-form-item label="联系人:" prop="name">
          <el-input v-model="botForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="addCodeForm.gender" placeholder="请选择" @change="sexChange" clearable>
            <el-option v-for="item in optionsSex" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="botForm.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="微信号:">
          <el-input v-model="botForm.weixin" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="微信昵称:">
          <el-input v-model="botForm.wechatNickname" maxlength="20" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="职务:">
          <el-input v-model="botForm.position" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="botForm.email" maxlength="60"></el-input>
        </el-form-item>
      </el-form>
      <!-- 自定义信息 -->
      <section>
        <!-- <div class="user_form" style="margin-bottom: 12px;">
          <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px" />
          <span class="titleAdd">自定义信息</span>
        </div> -->
        <div class="bottom_form">
          <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px;vertical-align:-15%" />
          自定义信息
        </div>
        <el-form ref="form" :model="userForm" label-width="auto">
          <el-form-item :label="item.columnName+':'" v-for="(item) in textList" :key="item.id">
            <el-input v-model="item.value" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item :label="item.columnName+':'" v-for="(item) in selectList" :key="item.id">
            <el-select v-model="item.value" placeholder="请选择" clearable @change="changeCustom">
              <el-option v-for="(val) in item.optionsVOList" :key="val.id" :label="val.columnOption" :value="val.columnOption">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="dateList.length>0">
            <el-form-item :label="item.columnName+':'" v-for="(item) in dateList" :key="item.id">
              <el-date-picker v-model="item.value" type="datetime" placeholder="选择日期时间" align="right" value-format='yyyy-MM-dd HH:mm:ss'>
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </section>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure('editRules')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import KehuTip from '../../../components/comTip/kehuTip.vue'
import GongsiTip from '../../../components/comTip/gongsiTip.vue'
import { uploadToOss } from '../../../config/api'
export default {
  components: {
    KehuTip,
    GongsiTip,
  },
  props: {
    transferPeople: {
      type: Boolean,
    },
  },

  data() {
    return {
      isKehuList: false,
      isGongsiList: false,
      optGongsi: [],
      optKehu: [],
      addCodeForm: {
        customerCalled: '',
        customerName: '',
        mobil: '',
        source: '',
        customerType: '',
        cropFullName: '',
        corpScale: '',
        industry: '',
        address: '',
        remark: '',
      },
      botForm: {
        name: '',
        phone: '',
        gender: '',
        position: '',
        weixin: '',
        wechatNickname: '',
        email: '',
      },
      userForm: {},
      textList: [],
      selectList: [],
      dateList: [],
      optionSource: [],
      optionsCustom: [
        { label: '未知', customerType: 0 },
        { label: '微信用户', customerType: 1 },
        { label: '企微用户', customerType: 2 },
      ],
      optionsScale: [],
      optionsCreat: [],
      optionsSex: [
        { name: '未知', value: '0' },
        { name: '男', value: '1' },
        { name: '女', value: '2' },
      ],
      editRules: {
        customerName: [
          { required: true, trigger: 'blur', message: '请输入姓名' },
        ],
        source: [{ required: true, trigger: 'blur', message: '请选择来源' }],
        customerType: [
          { required: true, trigger: 'blur', message: '请选择类型' },
        ],
      },
      botRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
      },
      optionsStage: [],
      imageUrl: '',
      loading: false,
    }
  },
  created() {
    this.getDataList()
  },
  mounted() {
    //this.getKehuList()
  },
  methods: {
    getacf(acfValue) {
      // acfValue就是子组件传过来的值
      console.log('acfValue--->>', acfValue)
      this.addCodeForm.customerName = acfValue.customerName
    },
    getgst(gstValue) {
      // gstValue就是子组件传过来的值
      console.log('gstValue--->>', gstValue)
      this.addCodeForm.cropFullName = gstValue.cropFullName
    },
    remoteMethodGongsi() {
      if (this.addCodeForm.cropFullName !== '') {
        this.getGongsiList()
        this.isGongsiList = true
      } else {
        this.optGongsi = []
        this.isGongsiList = false
      }
    },
    getGongsiList() {
      let params = {
        name: this.addCodeForm.cropFullName,
      }
      this.$network
        .post(
          '/common-service/elasticSearch/queryCustomerRecord/customers',
          params
        )
        .then((res) => {
          let GongsiList = []
          GongsiList = res.data
          /* 
          for(let i = 0;i<GongsiList.length;i++){
			    		GongsiList[i].value = GongsiList[i].name
			    }*/
          this.optGongsi = GongsiList
          console.log('this.optGongsi=====', this.optGongsi)
        })
    },
    remoteMethod() {
      if (this.addCodeForm.customerName !== '') {
        this.getKehuList()
        this.isKehuList = true
      } else {
        this.optKehu = []
        this.isKehuList = false
      }
    },
    getKehuList() {
      let params = {
        name: this.addCodeForm.customerName,
      }
      this.$network
        .post(
          '/common-service/elasticSearch/queryCustomerRecord/customers',
          params
        )
        .then((res) => {
          let kehuList = []
          kehuList = res.data

          for (let i = 0; i < kehuList.length; i++) {
            kehuList[i].value = kehuList[i].customerName
          }
          this.optKehu = kehuList
          console.log('this.optKehu=====', this.optKehu)
        })
    },
    tipPop() {
      console.log('tipPop')
      this.$message({
        type: 'error',
        message: '仅为提示作用',
      })
    },
    handleAvatarSuccess(request) {
      // console.log('--2----', request)
      this.imageUrl = ''
      if (this.beforeAvatarUpload(request.file)) {
        this.loading = true
        let formData = new FormData()
        formData.append('file', request.file)
        formData.append('filetype', 'image')
        formData.append('type', 'friend')
        uploadToOss(formData).then((res) => {
          if (res.result) {
            this.imageUrl = res.data.url
            this.loading = false
          }
        })
      }
    },
    deleteImg() {
      this.imageUrl = ''
    },
    dealHeader(list) {
      list.forEach((item) => {
        if (item.columnType == 1) {
          this.textList.push(item)
        } else if (item.columnType == 2) {
          this.selectList.push(item)
        } else if (item.columnType == 3) {
          this.dateList.push(item)
        }
      })
      this.fnMapEntiy()
    },
    fnMapEntiy() {
      let CustomObj = this.botForm.corpCustomColumnMap
      console.log(this.selectList)
      let tempTextList = JSON.parse(JSON.stringify(this.textList))
      let tempSelectList = JSON.parse(JSON.stringify(this.selectList))
      let tempDateList = JSON.parse(JSON.stringify(this.dateList))
      for (var i in CustomObj) {
        // console.log(i)
        tempTextList.forEach((item) => {
          if (item.columnValue == i) {
            item.value = CustomObj[i]
          }
        })
        tempSelectList.forEach((item) => {
          if (item.columnValue == i) {
            item.value = CustomObj[i]
          }
        })
        tempDateList.forEach((item) => {
          if (item.columnValue == i) {
            item.value = CustomObj[i]
          }
        })
      }
      this.textList = tempTextList
      this.selectList = tempSelectList
      this.dateList = tempDateList
    },
    changeCustom(val) {
      // console.log(val)
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type == 'image/jpeg' ||
        file.type == 'image/jpg' ||
        file.type == 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG || !isLt2M) {
        this.$message.error(
          '上传头像图片只能是 JPG,PNG,JEPG 格式，大小不能超过 2MB!'
        )
      }
      // console.log(isJPG, isLt2M)
      return isJPG && isLt2M
    },
    sexChange(val) {
      console.log(val)
      this.botForm.gender = val
    },
    getDataList() {
      this.$network
        .get('/customer-service/cluecustomer/toupdate', {
          clueCustomerNo: this.$route.query.customno,
        })
        .then((res) => {
          this.addCodeForm = res.data.clueCustomerEntity
          this.botForm = res.data.clueCustomerEntity
          this.imageUrl = res.data.clueCustomerEntity.avatar
          this.processTree(res.data.comlist)
          this.optionSource = res.data.list
          this.optionsScale = res.data.corpScaleList
          this.optionsStage = res.data.stageList
          if (res.data.clueCustomerEntity.cropSubIndustry) {
            let arr = res.data.clueCustomerEntity.cropSubIndustry.split(',')
            this.addCodeForm.industry = arr.map(Number)
          } else {
            this.addCodeForm.industry = []
          }
          this.dealHeader(res.data.head)
        })
    },
    processTree(data) {
      data.forEach((item) => {
        if (item.children.length) {
          this.optionsCreat.push(item)
          return this.processTree(item.children)
        } else {
          item.children = null
        }
      })
    },
    dialogFormCancel() {
      // console.log(111)
      this.$emit('closetransferPeople', 1)
    },
    dialogFormSure(editRules) {
      let tempText = [],
        tempSelect = [],
        tempDate = []
      let textObj = {},
        selectObj = {},
        dateObj = {}
      this.textList.forEach((item, index) => {
        let obj = {}
        obj[this.textList[index].columnValue] = item.value || ''
        tempText.push(obj)
      })
      tempText.forEach((el) => {
        textObj = Object.assign(textObj, el)
      })
      this.selectList.forEach((item, index) => {
        let obj = {}
        obj[this.selectList[index].columnValue] = item.value || ''
        tempSelect.push(obj)
      })
      tempSelect.forEach((el) => {
        selectObj = Object.assign(selectObj, el)
      })

      this.dateList.forEach((item, index) => {
        let obj = {}
        obj[this.dateList[index].columnValue] = item.value || ''
        tempDate.push(obj)
      })
      tempDate.forEach((el) => {
        dateObj = Object.assign(dateObj, el)
      })
      this.$refs[editRules].validate((valid) => {
        if (valid) {
          this.$confirm('是否确认转成客户', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              if (this.botForm.weixin || this.botForm.phone) {
                let cropSubIndustry = this.addCodeForm.industry.toString()
                let params = {
                  ...this.addCodeForm,
                  ...this.botForm,
                  cropSubIndustry: cropSubIndustry,
                  clueCustomerNo: this.$route.query.customno,
                  type: this.$route.query.type,
                  avatar: this.imageUrl,
                  corpCustomColumn: JSON.stringify({
                    ...textObj,
                    ...selectObj,
                    ...dateObj,
                  }),
                }
                this.$network
                  .post('/customer-service/cluecustomer/cluetocustomer', params)
                  .then((res) => {
                    // console.log('-----editres---', res)
                    this.$emit('closetransferPeople', 2)
                    this.$message({
                      type: 'success',
                      message: '转换成功!',
                    })
                  })
              } else {
                this.$message({
                  type: 'error',
                  message: '手机号微信号请选填其一！',
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消保存',
              })
            })
        } else {
          this.$message({
            type: 'error',
            message: '请完善信息',
          })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    position: relative;
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
      padding: 16px;
      overflow-y: scroll;
      height: 491px;
      .bottom_form {
        margin: 40px 0 16px 0;
        font-weight: 600;
      }
      .infoTitle {
        margin: 16px 0;
        font-weight: 600;
      }
    }
    .el-form {
      .upload_avatar {
        height: 128px;
        .demo-input-suffix {
          display: flex;
          position: relative;
        }
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          width: 128px;
          height: 128px;
          border-radius: 6px;
          cursor: pointer;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409eff;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          line-height: 128px;
          text-align: center;
        }
        .avatar {
          width: 100%;
          height: 100%;
        }
        .resetUpload {
          position: absolute;
          left: 144px;
          top: 30%;
          color: #4168f6;
          cursor: pointer;
        }
        .el-icon-circle-close {
          position: absolute;
          left: 120px;
          top: -5px;
          cursor: pointer;
        }
        .imgTip {
          font-size: 14px;
          color: #c0c4cc;
          letter-spacing: 0;
          font-weight: 400;
          position: absolute;
          bottom: 0;
          left: 144px;
        }
      }
    }
    .el-form-item {
      // margin-bottom: 45px;
      display: flex;
      height: 32px;
    }
    .el-form-item__content {
      line-height: 32px;
      flex: 1;
      margin-left: 0 !important;
    }
    .el-form-item__label {
      line-height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3c4353;
      padding: 0px 12px 0 0;
    }
    .el-input,
    .el-select,
    .el-cascader,
    .el-input__inner {
      width: 100%;
      height: 32px;
      line-height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
      /*position: absolute;
      bottom: 16px;
      right: 16px;*/
      width: 100%;
      height: 64px;
      background: #ffffff;
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

.el-icon-warning:before {
  color: #4168f6;
}
</style>
