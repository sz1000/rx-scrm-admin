<template>
  <div class="edit_dialog">
    <el-dialog title="编辑线索" :visible.sync="addCule" :before-close="dialogFormCancel" :close-on-click-modal='false' width="736px">
      <el-form :model="addCodeForm" :rules="editRules" label-width="90px" label-position="right">
        <!-- <div class="demo-input-suffix">头像
	          <el-upload
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="imageUrl" :src="imageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload> 
						<div class="repush">
							重新上传
						</div>
						<div class="imgTip">
							建议上传800*800像素、大小不超过2MB的图片，格式支持jpeg、jpg、png
						</div>
        </div> -->
        <el-form-item label="线索名称:" prop='customerCalled'>
          <el-input v-model.trim="addCodeForm.customerCalled" placeholder="请输入" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="addCodeForm.name" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="addCodeForm.gender" @select="sexChange" clearable>
            <el-option label="未知" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model.trim="addCodeForm.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="微信号:">
          <el-input v-model.trim="addCodeForm.weixin" maxlength="20"></el-input>
        </el-form-item>
        <!-- <el-form-item label="微信昵称"
                      prop='wxname'>
          <el-input v-model.trim="addCodeForm.name"
                    placeholder="请输入"
                    maxlength="30"></el-input>
        </el-form-item>-->
        <el-form-item label="邮箱:">
          <el-input v-model.trim="addCodeForm.email" maxlength="60"></el-input>
        </el-form-item>
        <el-form-item label="电话:">
          <el-input v-model.trim="addCodeForm.mobil" placeholder="请输入" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="线索来源:">
          <el-select v-model="addCodeForm.source" placeholder="请选择" @change="userChange" clearable>
            <el-option v-for="item in optionSource" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称:">
          <el-input v-model="addCodeForm.cropFullName" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="职务:">
          <el-input v-model="addCodeForm.position" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="行业领域:">
          <el-cascader size="large" :props="{ expandTrigger: 'click',value:'id' ,label:'name'}" :options="optionsCreat" v-model="addCodeForm.industry"
                       @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="企业规模:">
          <!-- <el-cascader size="large" :props="{ expandTrigger: 'click',value:'id' ,label:'name'}" :options="optionsScale"
                       v-model="addCodeForm.corpScale" @change="scaleChange">
          </el-cascader> -->
          <el-select v-model="addCodeForm.cropscale" placeholder="请选择" @change="scaleChange" clearable>
            <el-option v-for="item in optionsScale" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址:">
          <el-input v-model="addCodeForm.address" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="addCodeForm.remark" type="textarea" placeholder="请输入" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getlistFiled } from '@/api/customer'
export default {
  props: {
    addCule: {
      type: Boolean,
    },
  },

  data() {
    return {
      optionsScale: [],
      addCodeForm: {
        customerCalled: '',
        name: '',
        phone: '',
        weixin: '',
        remark: '',
        gender: '',
        position: '',
        source: '',
        cropFullName: '',
        industry: [],
        address: '',
        email: '',
        cropscale: '',
      },
      optionsCreat: [],
      optionSource: [],
      editRules: {
        customerCalled: [
          { required: true, trigger: 'blur', message: '请输入姓名' },
        ],
      },
    }
  },
  created() {
    this.getData()
    this.getFiledChange()
    this.getDataList()
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
            // if (item.type == 'stage') {
            //   this.stageList.push(item)
            // } else
            if (item.type == 'source') {
              this.optionSource.push(item)
            }
            //  else if (item.type == 'external_source') {
            //   this.weixinList.push(item)
            // } else if (item.type == 'customer_type') {
            //   this.leixingList.push(item)
            // }
          })
        }
      })
      // console.log(this.optionsCreat, '---------optionsCreat')
    },
    getDataList() {
      this.$network.get('/customer-service/cluecustomer/toadd').then((res) => {
        this.processTree(res.data.comlist)
        // this.optionSource = res.data.list
        this.optionsScale = res.data.corpScaleList
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
    open() {
      this.$confirm('是否取消修改？', '温馨提示', {
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
          // this.$message({
          //   type: 'info',
          //   message: '返回编辑',
          // })
        })
    },
    getData() {
      this.$network
        .get('/customer-service/cluecustomer/toupdate', {
          clueCustomerNo: this.$route.query.customno,
        })
        .then((res) => {
          this.processTree(res.data.comlist)
          // this.optionSource = res.data.list
          this.addCodeForm = res.data.clueCustomerEntity
          if (res.data.clueCustomerEntity.cropSubIndustry) {
            let arr = res.data.clueCustomerEntity.cropSubIndustry.split(',')
            this.addCodeForm.industry = arr.map(Number)
          } else {
            this.addCodeForm.industry = []
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
    sexChange(val) {
      console.log(val)
    },
    handleChange(val) {
      // console.log(val)
    },
    scaleChange(val) {
      console.log(val)
    },
    userChange(val) {
      console.log(val)
    },
    dialogFormCancel() {
      this.$emit('closeAddCule')
    },
    dialogFormSure() {
      this.$confirm('是否保存编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (this.addCodeForm.weixin || this.addCodeForm.phone) {
            // if (this.addCodeForm.phone.length !== 11) {
            //   return this.$message({
            //     type: 'error',
            //     message: '请输入正确手机号',
            //   })
            // }
            let cropSubIndustry = this.addCodeForm.industry.toString()
            let params = {
              ...this.addCodeForm,
              ...{
                cropSubIndustry: cropSubIndustry,
                clueCustomerNo: this.$route.query.customno,
              },
            }
            this.$network
              .post('/customer-service/cluecustomer/update', params)
              .then((res) => {
                // console.log('-----editres---', res)
                this.$emit('closeAddCule')
                this.$message({
                  type: 'success',
                  message: '编辑成功!',
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
      overflow-y: scroll;
      max-height: 500px;
      padding: 42px;
      .el-textarea__inner {
        // width: 634px !important;
      }
    }
    .el-form {
      // display: flex;
      // justify-content: space-between;
      // flex-wrap: wrap;
    }
    .el-form-item {
      // margin-bottom: 45px;
      height: 32px;
      display: flex;
    }
    .el-form-item__content {
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
      // padding: 0;
    }
    .el-input,
    .el-select,
    .el-cascader,
    .el-input__inner {
      // width: 634px;
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
.demo-input-suffix {
  position: relative;
}
.repush {
  width: 56px;
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #4168f6;
  letter-spacing: 0;
  font-weight: 400;
  margin-left: 14px;
  position: absolute;
  top: 95px;
  left: 180px;
}
.el-icon-warning:before {
  color: #4168f6;
}
</style>
