<template>
  <div class="edit_dialog">
    <el-dialog title="新增线索" :visible.sync="dialog" :close-on-click-modal="false" width="736px">

      <el-form :model="addCodeForm" ref="ruleForm" :rules="editRules" label-width="90px" label-position="right">
        <el-form-item label="线索名称:" prop='customerCalled'>
          <el-input v-model.trim="addCodeForm.customerCalled" placeholder="请输入" maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="联系人:" prop='name'>
          <el-input v-model.trim="addCodeForm.name" placeholder="请输入" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:">
          <el-input v-model.trim="addCodeForm.phone" placeholder="请输入" @input="addCodeForm.phone=addCodeForm.phone.replace(/[^\d]/g,'')" maxlength="11">
          </el-input>
        </el-form-item>
        <el-form-item label="线索来源:" prop="source" :rules="[{ required: true, message: '请选择', trigger: ['blur']}]">
          <el-select v-model="addCodeForm.source" placeholder="请选择" @change="userChange" clearable>
            <el-option v-for="item in optionSource" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称:">
          <el-input v-model="addCodeForm.cropFullName" placeholder="请输入" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="企业规模:">
          <el-select v-model="addCodeForm.corpScale" placeholder="请选择" clearable>
            <el-option v-for="item in optionsScale" :key="item.value" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务:">
          <el-input v-model="addCodeForm.position" placeholder="请输入" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="行业领域:">
          <el-cascader size="large" :props="{ expandTrigger: 'click',value:'id' ,label:'name'}" :options="optionsCreat" v-model="addCodeForm.industry"
                       @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="办公地址:">
          <el-input v-model="addCodeForm.address" placeholder="请输入" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="addCodeForm.remark" type="textarea" placeholder="请输入" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cluecustomer_toadd,cluecustomer_addCul } from '@/api/customer'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    commonType: {
      type: String,
    },
    sourceList: {
      type: Array,
    },
  },
  data() {
    return {
      addCodeForm: {
        customerCalled: '',
        imageUrl: '',
        name: '',
        phone: '',
        weixin: '',
        remark: '',
        gender: '',
        position: '',
        source: '',
        corpScale: '',
        cropFullName: '',
        industry: [],
        address: '',
        email: '',
      },
      optionsSex: [
        { name: '未知', value: '0' },
        { name: '男', value: '1' },
        { name: '女', value: '2' },
      ],
      optionsCreat: [],
      optionSource: [],
      optionsScale: [],     //行业规模
      editRules: {
        customerCalled: [
          { required: true, trigger: 'blur', message: '请输入线索名称' },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur',
          },
        ],
        // phone: [{ validator: this.checkPhone, trigger: 'blur' }],
      },
    }
  },
  computed: {
    dialog: {
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    },
  },
  created() {
    this.optionSource = JSON.parse(JSON.stringify(this.sourceList))
    this.getDate()
  },
  methods: {
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      //const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2

      /*if (!isJPG) {
			  this.$message.error('上传头像图片只能是 JPG 格式!');
			}*/
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    getDate() {   //获取筛选数据
      let noLoading = true
      cluecustomer_toadd(noLoading).then(res => {
        if(res.result){
          this.processTree(res.data.comlist)
          this.optionsScale = res.data.corpScaleList
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
    handleChange(val) {
      console.log(val)
    },
    sexChange(val) {
      console.log(val)
    },
    userChange(val) {
      console.log(val)
    },
    dialogFormSure(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否确认创建？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let cropSubIndustry = this.addCodeForm.industry.toString()
              let params = {
                ...this.addCodeForm,
                ...{
                  cropSubIndustry: cropSubIndustry,
                  type: this.commonType,
                },
              }
              cluecustomer_addCul(params).then(res => {
                if(res.result){
                  this.$emit('sure')
                  this.$message({
                    type: 'success',
                    message: '保存成功!',
                  })
                }
              })
            })
            .catch(() => {})
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    checkPhone(rule, value, callback) {
      if (!value) {
        return
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
    height: 606px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      background: #fafbff;
      padding: 14px 16px;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      position: relative;
      .el-dialog__title {
        font-size: 16px;
        line-height: 22px;
        font-weight: 500;
        color: #3c4353;
      }
      .el-dialog__headerbtn{
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .el-dialog__body {
      overflow-y: scroll;
      max-height: 500px;
      padding: 16px;
    }
    .el-form-item {
      display: flex;
      height: 32px;
    }
    .el-form-item__content {
      // width: 100%;
      flex: 1;
      line-height: 32px;
      margin-left: 0 !important;
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
    .el-cascader,
    .el-input__inner {
      // width: 634px;
      width: 100%;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
      width: 100%;
      background: #ffffff;
      border-radius: 0px 0px 8px 8px;
      padding: 20px;
      .el-button {
        width: 60px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        padding: 0;
      }
    }
  }
  /deep/ .el-textarea__inner{
    resize: none;
    min-height: 120px !important;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.imgTip {
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #c0c4cc;
  letter-spacing: 0;
  font-weight: 400;
}
.el-icon-warning:before {
  color: #4168f6;
}
</style>
