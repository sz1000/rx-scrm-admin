<template>
  <div class="edit_dialog">
    <el-dialog title="编辑线索" :visible.sync="dialog" :close-on-click-modal="false" width="736px">
      <section>
        <div style="margin-bottom: 12px;">
          <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px" />
          <span class="titleAdd">基本信息</span>
        </div>
        <el-form :model="addCodeForm" :rules="editRules" label-width="90px">
          <el-form-item label="线索名称:" prop="customerCalled" :rules="[{ required: true, message: '请输入客户名称', trigger: ['blur','change'] }]">
            <el-input v-model="addCodeForm.customerCalled" maxlength="13" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="线索来源:" prop="source">
            <el-select v-model="addCodeForm.source" placeholder="请选择" @change="sourceChange" clearable>
              <el-option v-for="item in optionSource" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 企业信息 -->
          <div class="bottom_form" style="margin-bottom: 12px;">
            <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px" />
            <span class="titleAdd">企业信息</span>
          </div>
          <GongsiTip :addChildForm="addCodeForm" v-on:getgst="getgst"></GongsiTip>
          <KehuTip :addChildForm="addCodeForm" v-on:getacf="getacf"></KehuTip>
          <el-form-item label="企业规模:" prop="cropscale">
            <el-select v-model="addCodeForm.cropscale" placeholder="请选择" @change="scaleChange" clearable>
              <el-option v-for="item in optionsScale" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业领域:" prop="industry">
            <el-cascader size="large" :props="{ expandTrigger: 'click',value:'id' ,label:'name'}" :options="optionsCreat"
                         v-model="addCodeForm.industry" @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="固定电话:">
            <el-input v-model="addCodeForm.mobil" maxlength="13"></el-input>
          </el-form-item>

          <el-form-item label="办公地址:" prop="address">
            <el-input v-model="addCodeForm.address" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="addCodeForm.remark" type="textarea" placeholder="请输入" maxlength="200">
            </el-input>
          </el-form-item>
        </el-form>
      </section>

      <!-- 联系人信息 -->
      <section>
        <div class="bottom_form" style="margin-bottom: 12px;">
          <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px" />
          <span class="titleAdd">联系人信息</span>
        </div>
        <el-form :model="botForm" :rules="botRules" ref="ruleForm" label-width="84px">
          <el-form-item label="头像:" class="upload_avatar">
            <div class="demo-input-suffix">
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
            <el-input v-model="botForm.name" maxlength="30" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:" prop="phone">
            <el-input v-model.trim="botForm.phone" maxlength="11" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="微信昵称:">
            <el-input v-model="botForm.wechatNickname" maxlength="20" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="微信号:">
            <el-input v-model="botForm.weixin" maxlength="20" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="性别:">
            <el-select v-model="addCodeForm.gender" placeholder="请选择" @change="sexChange" clearable>
              <el-option v-for="item in optionsSex" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职务:">
            <el-input v-model="botForm.position" maxlength="30" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:">
            <el-input v-model="botForm.email" maxlength="60" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <!-- 自定义信息 -->
      <section v-if="textList && textList.length">
        <div class="user_form" style="margin-bottom: 12px;">
          <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px" />
          <span class="titleAdd">自定义信息</span>
        </div>
        <el-form ref="form" :model="userForm" label-width="auto">
          <el-form-item :label="item.columnName+':'" v-for="(item) in textList" :key="item.id">
            <el-input v-model="item.value" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item :label="item.columnName+':'" v-for="(item) in selectList" :key="item.id">
            <el-select v-model="item.value" placeholder="请选择" clearable>
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
        <el-button @click="open">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import KehuTip from '../../../components/comTip/kehuTip.vue'
import GongsiTip from '../../../components/comTip/gongsiTip.vue'
import { uploadToOss } from '../../../config/api'
import {
  cluecustomer_toupdate, 
  getlistFiled,
  cluecustomer_update,
} from '@/api/customer'
export default {
  components: {
    KehuTip,
    GongsiTip,
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    customEdit: {
      type: Boolean,
    },
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
    dialog: {
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    },
  },
  data() {
    return {
      addCodeForm: {
        customerCalled: '',
        stage: '',
        customerName: '',
        name: '',
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
      optionsCustom: [
        // { label: '未知', value: 0 },
        // { label: '微信用户', value: 1 },
        // { label: '企微用户', value: 2 },
      ],
      phaseList: [],
      optionsScale: [],
      optionsCreat: [],
      optionSource: [],
      optionsSex: [
        { name: '男', value: '1' },
        { name: '女', value: '2' },
        { name: '未知', value: '0' },
      ],
      editRules: {
        // customerName: [
        //   { required: true, trigger: 'blur', message: '请输入姓名' },
        // ],
        cropFullName: [
          { required: true, trigger: 'blur', message: '请输入企业名称' },
        ],
        cropscale: [{ required: true, trigger: 'blur', message: '' }],
        address: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入办公地址',
          },
        ],
        source: [{ required: true, trigger: 'blur', message: '请选择来源' }],
        customerType: [
          { required: true, trigger: 'blur', message: '请选择类型' },
        ],
      },
      botRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        phone: [
          {
            validator: this.checkPhone,
            required: true,
            trigger: ['blur', 'change'],
          },
        ],
      },
      imageUrl: '',
      loading: false,
    }
  },
  created() {
    this.getData()
    this.getFiledChange()
  },
  methods: {
    getFiledChange() {
      let params = {
        corpId: this.corpId,
      }
      getlistFiled(params).then((res) => {
        if (res.result) {
          let list = res.data
          list.forEach((item) => {
            if (item.type == 'source') {
              this.optionSource.push(item)
              this.optionSource = this.optionSource.sort((a, b) => {
                return a.value - b.value
              })
            } else if (item.type == 'customer_type') {
              this.optionsCustom.push(item)
              this.optionsCustom = this.optionsCustom.sort((a, b) => {
                return a.value - b.value
              })
            } else if (item.type == 'stage') {
              this.phaseList.push(item)
              this.phaseList = this.phaseList.sort((a, b) => {
                return a.value - b.value
              })
            }
          })
        }
      })
      console.log(this.optionsCustom, 'hahahhahahahah')
    },

    checkPhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    },
    getacf(acfValue) {
      // acfValue就是子组件传过来的值
      // console.log('acfValue--->>', acfValue)
      this.addCodeForm.customerName = acfValue.customerName
    },
    getgst(gstValue) {
      // gstValue就是子组件传过来的值
      // console.log('gstValue--->>', gstValue)
      this.addCodeForm.cropFullName = gstValue.cropFullName
    },
    open() {
      this.$confirm('是否取消创建，所填内容将清空？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('closecustomEdit', 1)
          this.$message({
            type: 'success',
            message: '操作已取消!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '返回编辑',
          })
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

    getData() {     //获取数据
      let id = this.$route.query.customno
      cluecustomer_toupdate(id).then(res => {
        if(res.result){
          this.processTree(res.data.comlist)
          // this.phaseList = res.data.stageList
          // this.optionSource = res.data.list
          this.optionsScale = res.data.corpScaleList
          this.addCodeForm = res.data.clueCustomerEntity
          this.botForm = res.data.clueCustomerEntity
          if (this.addCodeForm.customerType == '0') {
            this.addCodeForm.customerType = '未知'
          }
          this.imageUrl = res.data.clueCustomerEntity.avatar
          if (res.data.clueCustomerEntity.cropSubIndustry) {
            let arr = res.data.clueCustomerEntity.cropSubIndustry.split(',')
            this.addCodeForm.industry = arr.map(Number)
          } else {
            this.addCodeForm.industry = []
          }
          this.dealHeader(res.data.head)
        }
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
    scaleChange(val) {
      // console.log(val)
      this.addCodeForm.corpScale = val
    },
    handleChange(val) {
      // console.log(val)
    },
    sourceChange(val) {
      console.log(val)
    },
    customChange(val) {
      console.log(val, 'adasdasdsad')
    },
    userChange(val) {
      console.log(val)
    },
    sexChange(val) {
      // console.log(val)
      this.botForm.gender = val
    },
    dialogFormSure(ruleForm) {
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

      let tempSource = this.optionSource
      tempSource.forEach((item) => {
        if (item.name == this.addCodeForm.source) {
          this.addCodeForm.source = item.value
        }
      })
      let temptype = this.optionsCustom
      temptype.forEach((item) => {
        if (item.label == this.addCodeForm.customerType) {
          this.addCodeForm.customerType = item.value
        }
      })
      // console.log(this.addCodeForm, '----d-adsadad-------')
      if (
        this.addCodeForm.cropFullName &&
        this.addCodeForm.source &&
        this.addCodeForm.customerCalled &&
        this.addCodeForm.stage &&
        this.addCodeForm.customerType &&
        this.addCodeForm.cropscale &&
        this.addCodeForm.address &&
        this.addCodeForm.industry
      ) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.$confirm('是否保存编辑', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              if (this.botForm.weixin || this.botForm.phone) {
                let cropSubIndustry = this.addCodeForm.industry.toString()
                let params = {
                  ...this.addCodeForm,
                  ...this.botForm,
                  ...{
                    cropSubIndustry: cropSubIndustry,
                    clueCustomerNo: this.$route.query.customno,
                    avatar: this.imageUrl,
                  },
                  corpCustomColumn: JSON.stringify({
                    ...textObj,
                    ...selectObj,
                    ...dateObj,
                  }),
                }
                // console.log(params, '------params')
                cluecustomer_update(params).then(res => {
                  if(res.result){
                    this.dialog = false
                    this.$emit('sure')
                    this.$message({ type: 'success',message: '编辑成功!'})
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '手机号微信号请选填其一！',
                })
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '请完善联系人信息',
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请完善客户信息',
        })
      }
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
      .el-textarea__inner {
        // width: 634px !important;
      }
      .titleAdd {
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        margin-left: 8px;
        position: relative;
        bottom: 3px;
      }
      .bottom_form {
        margin-top: 40px;
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
      font-weight: 400;
      color: #3c4353;
      padding: 0 12px 0 0;
    }
    .el-input,
    .el-select,
    .el-cascader,
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
