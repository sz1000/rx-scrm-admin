<template>
  <div :class="[isOpenAll?'upBoxAll':'upBox']">

    <!--:file-list="fileList.slice(-3)"-->
    <el-upload :visible.sync="helperEdit" class="upload-demo" :action="`${BASE_URL}/customer-service/cluecustomeraccessory/upload`"
               :on-change="handleChange" :headers="headers" :data="fileData" :file-list="eleList" :on-success="onSuccess" :on-error="onError"
               :multiple="false" :before-upload="BeforeUpload">
      <div class="headBox">
        <div class="headLeft">
          <div class="blueDiv">
          </div>
          <p>附件</p>
        </div>
        <div class="headRight">
          <img src="../../../assets/images/icon_shangchuan.png" />
          <span size="small" class="upBtn" type="primary">上传附件</span>
        </div>
      </div>
      <!--<div slot="tip" class="el-upload__tip">只能上传.doc,.txt,.pdf,.xls,.docx,.xlsx,.png,.jpeg,.jpg文件，且不超过500kb</div>-->
    </el-upload>

    <div class="listBox" v-for="(item, index) in upList" :key="index">
      <div class="listBoxLeft">
        <span class="listName" :title="item.name">{{item.name}}</span>
      </div>
      <div class="listBoxRight">
        <span v-if="!/\.png$|\.jpg$|\.pdf$|\.avi$|\.mp4$/i.test(item.name)? false : true" class="sessionOpen"
              @click="sessionOpen(item.ossUrl,item.name)">预览</span>
        <span v-else class="sessionOpen" style="opacity: 0;">归零</span>
        <span class="upDown" @click="upDown"><a :href="item.ossUrl" :download="item.name" target="_blank">下载</a></span>
        <span class="delList" @click="delList(item.id)">删除</span>
      </div>
    </div>
    <div class="btnBg">
      <div class="openAll" @click="openAll">
        <span v-if="listNum>3?true:false"> {{isOpenAll?"∧ 收起":"ｖ展开"}}</span>
      </div>
    </div>
    <div class="isImg" v-if="isImg">
      <YulanImg :isImg="isImg" @closeYulanPop="closeYulanPop" :imgUrl="imgUrl"></YulanImg>
    </div>
    <div class="isVideo" v-if="isVideo">
      <YulanVideo :isVideo="isVideo" @closeYulanVideo="closeYulanVideo" :videoUrl="videoUrl"></YulanVideo>
    </div>

  </div>
</template>
<script>
import { BASE_URL } from '../../../config/app.js'
/*	import YulanVideo from './comTip/yulanImg.vue'*/
import YulanImg from './comTip/yulanImg.vue'
import YulanVideo from './comTip/yulanVideo.vue'
export default {
  props: {
    helperEdit: {
      type: Boolean,
    },
    type: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      isOpenAll: false,
      clueCustomerNo: this.$route.query.customno,
      fileData: {
        clueCustomerNo: this.$route.query.customno
      },
      eleList: [],
      upList: '',
      listNum: '',
      upLA: [],
      BASE_URL,
      isImg: false,
      imgUrl: '',
      isYulanBtn: true,
      isVideo: false,
      videoUrl: '',
    }
  },
  created() {
    this.getList()
  },
  computed: {
    headers() {
      return {
        Accept: 'application/json',
        token: localStorage.getItem('token'),
      }
    },
  },
  mounted() {},
  components: {
    YulanImg,
    YulanVideo,
  },
  watch: {},
  methods: {
    closeYulanVideo() {
      this.isVideo = false
    },
    closeYulanPop() {
      this.isImg = false
    },
    openAll() {
      this.isOpenAll = !this.isOpenAll
    },
    delList(id) {
      console.log('删除')
      let _this = this
      let obj = `clueCustomerNo=${_this.clueCustomerNo}&id=${id}`
      //表单传参，需要如上转译。

      this.$network
        .post('/customer-service/cluecustomeraccessory/delupload', obj)
        .then((res) => {
          console.log(res)
          this.$message({
            type: 'success',
            message: res.msg,
          })
          //this.$set(this.upList)
          _this.getList()
        })
    },
    upDown() {
      console.log('下载')
    },
    isYulanBtnFuc(name) {
      if (!/\.png$|\.jpg$|\.pdf$|\.avi$|\.mp4$/i.test(name)) {
        this.isYulanBtn = false
      }
    },
    sessionOpen(ossurl, name) {
      console.log('预览')
      console.log(ossurl)
      console.log(name)
      if (!/\.png$|\.jpg$|\.pdf$|\.avi$|\.mp4$/i.test(name)) {
        this.$message.error('抱歉,目前预览仅支持.pdf,.avi,.mp4,.png,.jpg格式')
        return false
      }
      if (/\.avi$|\.mp4$/i.test(name)) {
        this.isVideo = true
        this.videoUrl = ossurl
      }
      if (/\.png$|\.jpg$/i.test(name)) {
        this.isImg = true
        this.imgUrl = ossurl
      }
      if (/\.pdf$/i.test(name)) {
        /*this.isPdf = true
  			this.pdfUrl = ossurl*/
        window.open(ossurl)
      }
    },
    getList() {
      let _this = this
      let params = {
        clueCustomerNo: this.$route.query.customno,
      }
      this.$network
        .get('/customer-service/cluecustomeraccessory/getList', params)
        .then((res) => {
          console.log(res)
          let upLA = res.data //所有附件
          let upLT = upLA.slice(-3) //保留三个附件
          _this.listNum = upLA.length //所有附件的数量
          _this.upList = upLA
          console.log(_this.upList)
          console.log(_this.listNum)
        })
    },
    BeforeUpload(file) {
      console.log(file.name)
      /*if (!/\.png$|\.jpg$|\.jpeg$|\.gif$|\.doc$|\.txt$|\.pdf$|\.xls$|\.docx$|\.xlsx$/i.test(file.name)) {
	                	this.$message.error("请上传.doc,.txt,.pdf,.xls,.docx,.xlsx,.png,.jpeg,.jpg,.gif文件");
	                	return false;
            		}*/
      if (file.size / 1024 / 1024 >= 20) {
        this.$message.error('大小不能超过20MB!')
        return false
      }
      this.fileData.filetype = file.name.substring(
        file.name.lastIndexOf('.') + 1
      )
      this.fileData.type = this.type
    },
    onSuccess(res, file, fileList) {
      this.eleList = []
      if(res.result){
        this.$message({
          type: 'success',
          message: '上传成功!',
        })
        this.getList()
      }else{
        this.$message({
          type: 'error',
          message: res.msg,
        })
      }
    },
    onError(err, file, fileList) {
      console.log(err)
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    changePeople() {
      let params = {
        clueCustomerNo: this.$route.query.customno,
      }
      this.$network
        .get('/customer-service/cluecustomer/getuserList', params)
        .then((res) => {
          this.people = res.data.userNo
          this.options = res.data.list
        })
    },

    dialogFormSure() {
      this.$confirm('是否保存编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let params = {
            cluecustomerno: this.$route.query.customno,
            user_no: this.region,
            oldname: this.people,
          }
          this.$network
            .get('/customer-service/cluecustomer/turnBlon', params)
            .then((res) => {
              // console.log('-----editres---', res)
              this.$emit('closeChange', 2)
              this.$message({
                type: 'success',
                message: '编辑成功!',
              })
            })
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
.btnBg {
  width: 100%;
  height: 34px;
  background: #ffffff;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 100;
}
.openAll {
  width: 50px;
  height: 14px;
  font-size: 14px;
  letter-spacing: 0;
  font-weight: 400;
  position: absolute;
  bottom: 16px;
  right: 16px;
  text-align: right;
  line-height: 14px;
}
.upBoxAll {
  width: 100%;
  background: #ffffff;
  border: 1px solid #d9dae4;
  border-radius: 8px;
  position: relative;
  padding-bottom: 35px;
  .el-button--primary:focus,
  .el-button--primary:hover {
    background: #ffffff00;
    border: none;
    color: #4168f6;
  }
  .el-button:focus,
  .el-button:hover {
    background: #ffffff00;
    border: none;
    color: #4168f6;
  }
}
.upBtn {
  color: #4168f6;
  border: none;
  width: 56px;
  background: #fafbff05;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  white-space: nowrap;
  /* position: relative; */
  /* left: 29px; */
  position: -webkit-sticky !important;
  float: left;
  /* display: inline-block; */
  margin-left: 6px;
}
.upBox {
  overflow: hidden;
  width: 100%;
  height: 174px;
  background: #ffffff;
  border: 1px solid #d9dae4;
  border-radius: 8px;
  position: relative;
  .el-button--primary:focus,
  .el-button--primary:hover {
    background: #ffffff00;
    border: none;
    color: #4168f6;
  }
  .el-button:focus,
  .el-button:hover {
    background: #ffffff00;
    border: none;
    color: #4168f6;
  }
}
.upload-demo {
  padding: 0px 16px;
  margin-bottom: 12px;
}
.headBox {
  width: 100%;
  height: 21px;
  margin-top: 17px;
}
.headLeft {
  float: left;
  width: 50px;
  height: 16px;
  font-size: 16px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 500;
  line-height: 16px;
}
.blueDiv {
  width: 4px;
  height: 16px;
  background: #4168f6;
  float: left;
  margin-right: 6px;
}
.headRight {
  width: 80px;
  height: 16px;
  background: #fafbff05;
  float: left;
  position: absolute;
  right: 5px;
  top: 19px;
}
.headRight img {
  width: 10px;
  height: 10px;
  background: #4168f6;
  /* margin-right: -10px; */
  background: #fafbff05;
  position: relative;
  /* left: 16px; */
  float: left;
  top: 5px;
}
.el-upload {
  text-align: left;
}
.listBox {
  width: 100%;
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
  margin-bottom: 8px;
}
.listBoxLeft {
  height: 20px;
  float: left;
  margin-left: 16px;
  width: 130px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.listBoxRight {
  width: 116px;
  height: 20px;
  float: right;
}
.sessionOpen,
.upDown,
.delList {
  margin-right: 9px;
  cursor: pointer;
}
</style>
