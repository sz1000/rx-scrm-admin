<template>
  <div class="edit_dialog">
    <el-dialog title="新增客户" :visible.sync="addCule" :before-close="dialogFormCancel" :close-on-click-modal='false' width="736px">
      <!-- 客户信息 -->
      <section>
        <!-- <div style="margin-bottom: 12px;">
          <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px" />
          <span class="titleAdd">客户信息</span>
        </div> -->
        <!-- <div class="tips_info">
          <img src="../../../assets/images/info_icon.png" alt="" />
          <span>管理员已设置客户根据【客户名称】不可重复</span>
        </div> -->
        <el-form :model="addCodeForm" :rules="editRules" label-width="84px" ref="ruleForm">
          <el-form-item label="客户名称:" prop="customerCalled" :rules="[
      { required: true, message: '请输入客户名称', trigger: ['blur','change'] },
    ]">
            <el-input v-model="addCodeForm.customerCalled" maxlength="13" placeholder="请输入"></el-input>
          </el-form-item>
          <!-- <KehuTip :addChildForm="addCodeForm" v-on:getacf="getacf"></KehuTip> -->
          <el-form-item label="联系人:" prop="name" :rules="[
      { required: true, message: '请输入联系人姓名', trigger: ['blur','change'] },
    ]">
            <el-input v-model="addCodeForm.name" maxlength="30" placeholder="请输入"></el-input>
          </el-form-item>
          <!-- <el-form-item label="固定电话:">
            <el-input v-model="addCodeForm.mobil" maxlength="13" placeholder="请输入"></el-input>
          </el-form-item> -->
          <el-form-item label="手机号码:">
            <el-input v-model.trim="addCodeForm.phone" maxlength="11" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="客户来源:" prop="source">
            <el-select v-model="addCodeForm.source" placeholder="请选择" @change="sourceChange" clearable>
              <el-option v-for="item in optionSource" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户阶段:">
            <el-select v-model="addCodeForm.stage" placeholder="请选择" @change="customChange" clearable>
              <el-option v-for="item in optionsStage" :key="item.value" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户类型:" prop="customerType">
            <el-select v-model="addCodeForm.customerType" placeholder="请选择" @change="customChange" clearable>
              <el-option v-for="item in optionsCustom" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <GongsiTip :addChildForm="addCodeForm" v-on:getgst="getgst"></GongsiTip>
          <el-form-item label="企业规模:">
            <el-select v-model="addCodeForm.corpScale" placeholder="请选择" @change="scaleChange" clearable>
              <el-option v-for="item in optionsScale" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行业领域:">
            <el-cascader size="large" :props="{ expandTrigger: 'click',value:'id' ,label:'name'}" :options="optionsCreat"
                         v-model="addCodeForm.industry" @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="办公地址:">
            <el-input v-model="addCodeForm.address" maxlength="100" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="addCodeForm.remark" type="textarea" show-word-limit placeholder="请输入" maxlength="200"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <!-- 联系人信息 -->
      <!-- <section>
        <div class="bottom_form" style="margin-bottom: 12px;">
          <img src="../../../assets/images/icon_label@2x.png" alt="" style="width:18px;height:18px" />
          <span class="titleAdd">联系人信息</span>
        </div>
        <el-form :model="botForm" :rules="botRules" ref="ruleForm" label-width="84px">
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
            <el-input v-model="botForm.name" maxlength="30" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="性别:">
            <el-select v-model="addCodeForm.gender" placeholder="请选择" @change="sexChange" clearable>
              <el-option v-for="item in optionsSex" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号:">
            <el-input v-model.trim="botForm.phone" maxlength="11" placeholder="手机号与微信号选填一个即可"></el-input>
          </el-form-item>
          <el-form-item label="微信号:">
            <el-input v-model="botForm.weixin" maxlength="20" placeholder="手机号与微信号选填一个即可"></el-input>
          </el-form-item>
          <el-form-item label="微信昵称">
            <el-input v-model="botForm.wechatNickname" maxlength="20" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="职务:">
            <el-input v-model="botForm.position" maxlength="30" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:">
            <el-input v-model="botForm.email" maxlength="60" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </section> -->
      <!-- 自定义信息 -->
      <!-- <section>
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
      </section> -->
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
import { getlistFiled } from '@/api/customer'
export default {
  components: {
    KehuTip,
    GongsiTip,
  },
  props: {
    addCule: {
      type: Boolean,
    },
    commonType: {
      type: String,
    },
  },

  data() {
    return {
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
        stage: '',
        name: '',
        phone: '',
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
        // { label: '未知', value: 0 },
        // { label: '微信用户', value: '1' },
        // { label: '企微用户', value: '2' },
      ],
      optionsStage: [],
      optionsScale: [],
      optionsCreat: [],
      optionsSex: [
        { name: '未知', value: '0' },
        { name: '男', value: '1' },
        { name: '女', value: '2' },
      ],
      editRules: {
        source: [{ required: true, trigger: 'blur', message: '请选择来源' }],
        // customerType: [
        //   { required: true, trigger: 'blur', message: '请选择类型' },
        // ],
      },
      botRules: {
        name: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入姓名',
          },
        ],
        // phone: [{ validator: this.checkPhone, trigger: 'blur' }],
      },
      imageUrl: '',
      loading: false,
    }
  },
  created() {
    this.getDataList()
    this.getFiledChange()
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
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
            if (item.type == 'stage') {
              this.optionsStage.push(item)
              this.optionsStage = this.optionsStage.sort((a, b) => {
                return a.value - b.value
              })
            } else if (item.type == 'source') {
              this.optionSource.push(item)
              this.optionSource = this.optionSource.sort((a, b) => {
                return a.value - b.value
              })
            } else if (item.type == 'customer_type') {
              this.optionsCustom.push(item)
              this.optionsCustom = this.optionsCustom.sort((a, b) => {
                return a.value - b.value
              })
            }
          })
        }
      })
      // console.log(this.optionsCreat, '---------optionsCreat')
    },

    open() {
      this.$confirm('是否取消创建，所填内容将清空？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('closeAddCule')
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
    sourceChange(val) {
      console.log(val)
    },
    customChange(val) {
      console.log(val)
    },
    stageChange(val) {
      console.log(val)
    },
    scaleChange(val) {
      console.log(val)
    },
    handleChange(val) {
      console.log(val)
    },
    sexChange(val) {
      console.log(val)
      this.botForm.gender = val
    },
    getDataList() {
      this.$network.get('/customer-service/cluecustomer/toadd').then((res) => {
        this.processTree(res.data.comlist)
        // this.optionSource = res.data.list
        this.optionsScale = res.data.corpScaleList
        // this.optionsStage = res.data.stageList
        this.dealHeader(res.data.head)
      })
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
      // console.log(this.textList, this.selectList, this.dateList)
    },
    processTree(data) {
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].children.length < 1) {
      //     /**children长度小于1, 将children置为null */
      //     data[i].children = null
      //   } else {
      //     /**否则继续进入循环 */
      //     this.processTree(data[i].children)
      //   }
      // }
      // this.optionsCreat = JSON.parse(JSON.stringify(data))
      data.forEach((item) => {
        if (item.children.length) {
          this.optionsCreat.push(item)
          return this.processTree(item.children)
        } else {
          item.children = null
        }
      })
      // console.log(this.optionsCreat)
    },
    dialogFormCancel() {
      // console.log(111)
      this.$emit('closeAddCule')
    },
    getacf(acfValue) {
      // acfValue就是子组件传过来的值
      console.log('acfValue--->>', acfValue)
      this.addCodeForm.customerName = acfValue.customerName
    },
    getgst(gstValue) {
      // gstValue就是子组件传过来的值
      // console.log('gstValue--->>', gstValue)
      this.addCodeForm.cropFullName = gstValue.cropFullName
    },
    dialogFormSure(ruleForm) {
      // let tempText = [],
      //   tempSelect = [],
      //   tempDate = []
      // let textObj = {},
      //   selectObj = {},
      //   dateObj = {}
      // this.textList.forEach((item, index) => {
      //   let obj = {}
      //   obj[this.textList[index].columnValue] = item.value || ''
      //   tempText.push(obj)
      // })
      // tempText.forEach((el) => {
      //   textObj = Object.assign(textObj, el)
      // })
      // this.selectList.forEach((item, index) => {
      //   let obj = {}
      //   obj[this.selectList[index].columnValue] = item.value || ''
      //   tempSelect.push(obj)
      // })
      // tempSelect.forEach((el) => {
      //   selectObj = Object.assign(selectObj, el)
      // })

      // this.dateList.forEach((item, index) => {
      //   let obj = {}
      //   obj[this.dateList[index].columnValue] = item.value || ''
      //   tempDate.push(obj)
      // })
      // tempDate.forEach((el) => {
      //   dateObj = Object.assign(dateObj, el)
      // })
      // console.log(textObj, selectObj, dateObj)

      // if (
      //   this.addCodeForm.customerName &&
      //   this.addCodeForm.source &&
      //   (this.addCodeForm.customerType || this.addCodeForm.customerType == '0')
      // )
      if (this.addCodeForm.customerCalled !== '') {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.$confirm('是否保存编辑', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                // if (this.botForm.weixin || this.botForm.phone)
                if (true) {
                  // let cropSubIndustry = this.addCodeForm.industry.toString()
                  // let params = {
                  //   avatar: this.imageUrl,
                  //   ...this.addCodeForm,
                  //   ...this.botForm,
                  //   ...{
                  //     cropSubIndustry: cropSubIndustry,
                  //     type: this.commonType,
                  //   },
                  //   corpCustomColumn: JSON.stringify({
                  //     ...textObj,
                  //     ...selectObj,
                  //     ...dateObj,
                  //   }),
                  // }
                  let cropSubIndustry = this.addCodeForm.industry.toString()
                  let params = {
                    type: this.commonType,
                    cropSubIndustry: cropSubIndustry,
                    ...this.addCodeForm,
                  }
                  this.$network
                    .post('/customer-service/cluecustomer/addCul', params)
                    .then((res) => {
                      // console.log('-----editres---', res)
                      this.$emit('closeAddCule')
                      this.$message({
                        type: 'success',
                        message: '保存成功!',
                      })
                    })
                } else {
                  // this.$message({
                  //   type: 'error',
                  //   message: '手机号微信号请选填其一！',
                  // })
                }
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消保存',
                })
              })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请完善信息',
        })
      }
    },
    checkPhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('不能为空'))
        // return
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    position: relative;
    /*overflow-y: scroll;*/
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
      .tips_info {
        display: flex;
        align-items: center;
        padding-left: 10px;
        margin-bottom: 16px;
        color: #838a9d;
        img {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
      }
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
      // margin-bottom: 45px;
      display: flex;
      height: 32px;
    }
    .el-form-item__content {
      line-height: 32px;
      flex: 1;
      margin-left: 0 !important;
      padding-left: 12px;
    }
    .el-form-item__label {
      line-height: 32px;
      font-size: 14px;
      font-weight: 400;
      color: #3c4353;
      // padding: 0 12px 0 0;
      padding: 0;
    }
    .el-form-item__error {
      padding: 0 0 0 12px;
    }
    .el-input,
    .el-select,
    .el-cascader,
    .el-input__inner {
      width: 100%;
      // width: 634px;
      // flex: 1;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }

    .el-dialog__footer {
      // position: absolute;
      // bottom: 16px;
      // right: 16px;
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
