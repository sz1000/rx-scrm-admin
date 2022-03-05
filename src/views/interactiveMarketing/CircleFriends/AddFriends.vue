<template>
  <div class="addWarp" v-loading='loading'>
    <div class="goback pointer" @click="goback">
      <img src="../../../assets/images/goback.png" alt="" /> 返回
    </div>
    <div class="mainContent">
      <div class="navBar">
        <span>发表朋友圈</span>
        <span class="tips">每位客户的朋友圈每个月最多展示4条企业发表的内容</span>
      </div>
      <div class="seeCustome">
        <span>可见客户：</span>
        <span>公开</span>
      </div>
      <div class="textBox">
        <span><span style="color:red"> &nbsp;&nbsp;&nbsp; *</span> 标题：</span>
        <span class="text-area">
          <el-input v-model="linkTitle" placeholder="请输入标题"></el-input>
        </span>
      </div>
      <div class="textBox">
        <span>文字内容：</span>
        <span class="text-area">
          <el-input type="textarea" v-model="textInput" placeholder="请输入文字内容(文字内容和附件不可同时为空)" :rows="10" maxlength="500" show-word-limit></el-input>
        </span>
      </div>

      <div class="fileBox">
        <span>上传附件：</span>
        <div class="upload_content">
          <div class="e_val">
            <!-- <el-radio class="radio" v-model="attachmentType" label="image" @change="changeRadio">图片</el-radio>
            <el-radio class="radio" v-model="attachmentType" label="video" @change="changeRadio">视频</el-radio>
            <el-radio class="radio" v-model="attachmentType" label="link" @change="changeRadio">链接</el-radio> -->
            <el-radio class="radio" v-model="attachmentType" label="material" @change="changeRadio">素材库</el-radio>
          </div>
          <div class="upload_wrap" v-if="attachmentType == 'image'">
            <div class="upload_row">
              <div class="upload_box_list" v-for="(item,index) in lists" :key="index" v-show="lists.length>0">
                <div class="img_box">
                  <img :src="item" alt="">
                  <img src="../../../assets/images/dtfriend.png" alt="" class="deleteIcon" @click="fnDeleteImg(item,index)" />
                </div>
              </div>
              <div class="upload_box" v-if="lists.length<9">
                <div class="upload">
                  <div class="icon_box">
                    <div class="icon"></div>
                    <div class="text">添加图片</div>
                  </div>
                  <input class="file" type="file" @change="uploadFun($event,'image','friend','png,jpg,jpeg','10')" accept=".png,.jpg,.jpeg" />
                </div>
              </div>
            </div>
            <div class="upload_tips" v-if="!lists.length">最多可上传9张图片，单张图片大小不超过10M，格式支持jpeg、jpg、png</div>
          </div>
          <div class="upload_wrap" v-if="attachmentType == 'video'">
            <div class="upload_row">
              <div class="upload_box">
                <div class="upload_box_list" v-if="videoUrl">
                  <div class="img_box video_box">
                    <video :src="videoUrl" controls="controls" ref="video" />
                    <img src="../../../assets/images/dtfriend.png" alt="" class="deleteIcon" @click="fnDeleteVideo" />
                  </div>
                </div>
                <div class="upload" v-else>
                  <div class="icon_box">
                    <div class="icon"></div>
                    <div class="text">添加视频</div>
                  </div>
                  <input class="file" type="file" @change="uploadVideo($event,'video','friend','mp4','10')" accept=".mp4" />
                </div>
              </div>
            </div>
            <div class="upload_tips" v-if="!videoUrl">上传视频最大支持10M</div>
          </div>
          <div class="link_wrap" v-if="attachmentType == 'link'">
            <div class="input_item">
              <el-input v-model="inputUrl" @input="inputUrl=inputUrl.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\S+$]/g,'')"
                        placeholder="链接地址请以http或https开头" @keyup.enter.native="onSubmit"></el-input>
              <div class="link_title">
                <span class="labelTxt">链接标题：</span>
                <span class="input_warp">
                  <el-input v-model="linkTitle" placeholder=""></el-input>
                </span>
              </div>
              <div class="link_abstract">
                <span class="labelTxt">链接摘要：</span>
                <span class="input_warp">
                  <el-input v-model="linkAbstract" placeholder=""></el-input>
                </span>
              </div>
              <div class="link_cover">
                <span class="labelTxt">链接封面：</span>
                <span class="uploadLink" v-if="!this.linkImgUrl">
                  <el-upload class="upload-demo" ref='upload' drag action='#' :http-request='handleChange' :file-list="linkImgList"
                             :on-remove="handleImgRemove" :limit='1' :on-change="changeFile">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </span>
                <span v-else class="cover-warp">
                  <img :src=" this.linkImgUrl" alt="" class="imgcover" />
                  <img @click="dleatImg" src="../../../assets/images/dtfriend.png" alt="" class="dtfriend">
                </span>
              </div>
            </div>
          </div>
          <div class="material_warp" v-if="attachmentType == 'material'">
            <div v-if="openDialog">
              <MaterialDialog @sure='fnMaterialInfo' ref='mater' :dialogVisible='openDialog' v-show="openDialog"></MaterialDialog>
            </div>
            <div class="mater_content">
              <div class="articleShow" v-show="materObj.tab == 1 ">
                <span>文章：<span class="name_tite">{{materObj.title}}</span></span>
                <div class="txt_btn" @click="resetSlect">重新选择</div>
                <div class="card_article" v-if="Object.keys(materObj).length > 1">
                  <div class="title">{{materObj.title}}</div>
                  <div class="content">
                    <div class="left">{{materObj.contentAbstract}}</div>
                    <div class="right">
                      <!-- <img src="../../../assets/images/article.png" alt=""> -->
                      <img :src="materObj.cover" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="fileSHow" v-show="materObj.tab == 2">
                <span>文件：{{materObj.name}}</span>
                <span class="txt_btn" @click="resetSlect">重新选择</span>
                <div class="card_article" v-if="Object.keys(materObj).length > 1">
                  <div class="content">
                    <div class="left">
                      <!-- <img src="../../../assets/images/pdf_image.png" alt=""> -->
                      <img :src="materObj.cover" alt="" v-if="materObj.cover" />
                      <img src="../../../assets/images/pdf_image.png" alt="" v-else />
                    </div>
                    <div class="right">
                      <div class="fileName">{{materObj.name}}</div>
                      <div class="fileSize">{{(materObj.fileSize/1024).toFixed(2)}}kb</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="photoSHow" v-show="materObj.tab == 3">
                <span>海报：{{materObj.posterName}}</span>
                <div class="photo_card">
                  <span class="phonto_box">
                    <img :src="materObj.posterUrl" alt="" />
                  </span>
                  <span class="txt_btn" @click="resetSlect">重新选择</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="noticeBtn">
        <el-button type="primary" @click="submitForm" v-preventReClick>通知成员发表</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { addFriend, getarticle } from '../../../api/friend'
import { AddPoster, uploadToOss, uploadFileUrl } from '../../../config/api'
import MaterialDialog from '../../../components/materialDialog/index.vue'
export default {
  components: {
    MaterialDialog,
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
  },
  data() {
    return {
      uploadFileUrl,
      textInput: '',
      attachmentType: '',
      url: '',
      videoUrl: '',
      inputUrl: '',
      lists: [],
      loading: false,
      materObj: {},
      linkTitle: '',
      linkAbstract: '',
      linkImgList: [],
      linkImgUrl: '',
      shareUrlOrigin: '',
      openDialog: false,
      title: '',
      Circletitle: '',
    }
  },
  created() {
    if (!this.corpId) {
      this.$store.dispatch('getCorpId').then(() => {})
    }
  },
  computed: {
    userNo() {
      let token = this.$store.getters.token ||  localStorage.getItem("token")
      return token.split('|')[1]
    },
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    changeRadio() {
      console.log(this.attachmentType)
      if (this.attachmentType == 'image') {
        this.linkTitle = ''
      } else if (this.attachmentType == 'video') {
        this.linkTitle = ''
      } else if (this.attachmentType == 'link') {
        this.linkTitle = ''
      } else {
        this.linkTitle = ''
      }
      this.openDialog = true
    },
    onSubmit() {
      console.log(1)
      this.loading = true
      let params = {
        articleUrl: window.btoa(this.inputUrl),
      }
      console.log(params, '---parasm----')

      getarticle(params).then((res) => {
        console.log(res)
        if (res.result) {
          this.linkTitle = res.data.title
          this.linkTitle = res.data.title
          this.linkAbstract = res.data.contentAbstract
          this.linkImgUrl = res.data.cover
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    uploadFun(e, fileType, type, accept, size) {
      // console.log(e)
      let _this = this
      let ve = e
      let file = e.target.files[0]
      var reader = new FileReader()
      _this
        .$uploadFun(ve, fileType, type, size, accept)
        .then((res) => {
          // console.log('----111---', res, ve)
          _this.lists.push(res.url)
          let data = {
            corpId: this.corpId,
            name: res.name,
            posterName: res.name,
            posterUrl: res.url,
            url: res.url,
            uid: new Date().getTime(),
          }
          AddPoster(data).then((res) => {})
        })
        .catch((err) => {
          // console.log(err)
          ve.target.value = ''
        })
      reader.readAsDataURL(file)
      // reader.onload = function (e) {
      //   // console.log(e)
      //   let img = new Image()
      //   img.src = e.target.result
      //   img.onload = function () {
      //     let w = this.width
      //     let h = this.height
      //     if (w > 1080 || h > 1440) {
      //       _this.$message({
      //         type: 'error',
      //         message: '图片像素不能超过1440*1080',
      //       })
      //       return false
      //     } else {
      //       //文件上传
      //       _this.$uploadFun(ve, fileType, type, size, accept).then((res) => {
      //         // console.log('----111---', res)
      //         _this.lists.push(res.url)
      //       })
      //     }
      //   }
      // }
    },
    uploadVideo(e, fileType, type, accept, size) {
      let _this = this
      let file = e.target.files[0]
      let filename = e.target.files[0].name
      let url = URL.createObjectURL(file)
      // console.log('---e----', accept, e, filename)
      if (filename.indexOf(accept) == -1) {
        _this.$message({
          type: 'error',
          message: '请上传MP4格式文件',
        })
        e.target.value = ''
        return false
      }
      let audioElement = new Audio(url)
      audioElement.addEventListener('loadedmetadata', function () {
        let duration = audioElement.duration
        if (duration > 30) {
          _this.$message({
            type: 'error',
            message: '视频不能超过30s',
          })
          e.target.value = ''
          return false
        } else {
          _this.$uploadFun(e, fileType, type, size, accept).then((res) => {
            _this.videoUrl = res.url
          })
        }
      })
    },
    handleChange(request) {
      // console.log(request)
      let formData = new FormData()
      formData.append('file', request.file)
      formData.append('filetype', 'image')
      formData.append('type', 'friend')
      uploadToOss(formData).then((res) => {
        if (res.result) {
          this.linkImgUrl = res.data.url
          // AddPoster(data).then((res) => {})
        }
      })
    },
    changeFile(file, fileList) {
      // this.$refs.upload.clearFiles()
    },
    handleImgRemove(file, fileList) {},
    fnDeleteImg(v, i) {
      this.lists.splice(i, 1)
    },
    fnDeleteVideo() {
      this.videoUrl = ''
    },
    fnMaterialInfo(obj) {
      console.log('----obj---', obj)
      if (obj.tab == 1) {
        this.linkTitle = obj.title
      } else if (obj.tab == 2) {
        this.linkTitle = obj.name
      } else {
        this.linkTitle = obj.posterName
      }

      this.materObj = obj
      this.openDialog = false
    },
    resetSlect() {
      // console.log(this.$refs.mater)
      // this.$refs.mater.dialogVisible = true
      this.openDialog = true
    },
    dleatImg() {
      //  this.linkImgUrl =""
      this.linkImgUrl = ''
    },
    submitForm() {
      if (!this.linkTitle) {
        this.$message.error('请输入标题')
      } else {
        let imgArr = []
       
        if (window.location.origin == 'https://console.jzcrm.com') {
          this.shareUrlOrigin = 'https://h5.jzcrm.com'
        } else {
          this.shareUrlOrigin = 'https://test-h5.jzcrm.com'
        }
        if (this.attachmentType == 'image') {
          imgArr = this.lists
        } else if (this.attachmentType == 'video') {
          imgArr = [this.videoUrl]
        } else if (this.attachmentType == 'link') {
          imgArr = [
            this.inputUrl,
            this.linkImgUrl,
            this.linkTitle,
            this.linkAbstract,
          ]
        } else {
          if (this.materObj.tab == 1) {
            imgArr = [
              {
                url: `${this.shareUrlOrigin}/materialTemplate?materialId=${
                  this.materObj.articleId
                }&type=${this.materObj.tab}&corpId=${localStorage.getItem(
                  'corpId'
                )}&createUserNo=${this.userNo}`,
                ...this.materObj,
              },
            ]
          } else if (this.materObj.tab == 2) {
            imgArr = [
              {
                url: `${this.shareUrlOrigin}/materialTemplate?materialId=${
                  this.materObj.documentId
                }&type=${this.materObj.tab}&corpId=${localStorage.getItem(
                  'corpId'
                )}&createUserNo=${this.userNo}`,
                ...this.materObj,
              },
            ]
          } else {
            imgArr = [this.materObj]
          }
        }
        let params
        if (this.attachmentType == 'material') {
          params = {
            content: this.textInput,
            urlList: imgArr,
            msgtype: this.attachmentType,
            title: this.linkTitle,
          }
        } else {
          params = {
            content: this.textInput,
            urls: imgArr,
            msgtype: this.attachmentType,
            title: this.linkTitle,
          }
        }
     
        console.log(params, '=====params')
        // if(this.linkTitle == "" && this.attachmentType == "link"){
        // this.$message({
        //   type: 'error',
        //   message: '请输入链接标题',
        // })
        this.loading = true
        // }else{
        addFriend(params)
          .then((res) => {
            this.$message({
              type: 'success',
              message: '新增成功',
            })
            this.loading = false
            this.$router.go(-1)
          })
          .catch((err) => {
            this.loading = false
          })
      }
    },
  },
}
</script>
<style lang="less" scoped>
.addWarp {
  font-size: 14px;
  color: #3c4353;
  .goback {
    margin: 0 0 16px 0;
    color: #4168f6;
    font-family: 600;
    img {
      width: 8px;
      height: 12px;
      vertical-align: middle;
    }
  }
  .mainContent {
    min-height: 100vh;
    background: #fff;
    border-radius: 8px;
    padding: 0 16px;
    .navBar {
      color: #3c4353;
      font-weight: 600;
      font-size: 14px;
      line-height: 44px;
      padding: 0 16px 0 10px;
      position: relative;
      border-bottom: 1px solid #f0f2f7;
      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 14px;
        background: #4168f6;
        left: 0;
        top: 14px;
      }
      .tips {
        display: inline-block;
        font-size: 12px;
        font-weight: 400;
        color: #c0c4cc;
        margin-left: 16px;
      }
    }
    .seeCustome {
      margin-top: 15px;
    }
    .textBox {
      display: flex;
      margin-top: 20px;
      .text-area {
        min-width: 704px;
      }
    }
    .fileBox {
      margin-top: 20px;
      display: flex;
      .upload_content {
        /deep/.el-radio__input.is-checked + .el-radio__label {
          color: #4168f6;
        }
        /deep/.el-radio__input.is-checked .el-radio__inner {
          border-color: #4168f6;
          background: #4168f6;
        }
        .upload_wrap {
          margin-top: 16px;
          border: 1px solid #f0f2f7;
          border-radius: 4px;
          width: 704px;
          min-height: 142px;
          display: flex;
          padding-left: 16px;
          .upload_row {
            margin-top: 16px;
            font-size: 0;
            display: flex;
            flex-wrap: wrap;
            .afresh_file {
              margin-left: 16px;
              height: 20px;
              font-size: 14px;
              color: #4168f6;
              position: relative;
              .file {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
          .upload_box_list {
            height: 110px;
            width: 110px;
            margin-right: 16px;
            margin-bottom: 16px;
            .img_box {
              width: 100%;
              height: 100%;
              margin-right: 16px;
              position: relative;
              img {
                width: 100%;
                height: 100%;
              }
              video {
                height: 110px;
                width: 110px;
              }
              .deleteIcon {
                cursor: pointer;
                width: 14px;
                height: 14px;
                position: absolute;
                right: -5px;
                top: -5px;
                z-index: 10;
              }
            }
          }
          .upload_box {
            width: 110px;
            height: 110px;
            border-radius: 4px;
            // overflow: hidden;
            position: relative;
            font-size: 0;
            .upload {
              width: 100%;
              height: 100%;
              border: 1px dashed #d9dae4;
              border-radius: 4px;
              text-align: center;
              padding-top: 34px;
              position: relative;
              .icon_box {
                .icon {
                  width: 24px;
                  height: 24px;
                  margin-bottom: 16px;
                  position: relative;
                  display: inline-block;
                  &::before {
                    content: '';
                    width: 2px;
                    height: 100%;
                    background: #c0c4cc;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    transform: translateX(-50%);
                  }
                  &::after {
                    content: '';
                    height: 2px;
                    width: 100%;
                    background: #c0c4cc;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                  }
                }
                .text {
                  height: 20px;
                  font-size: 14px;
                  color: #c0c4cc;
                  text-align: center;
                }
              }
              .file {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
          .upload_tips {
            font-size: 14px;
            color: #c0c4cc;
            padding-top: 106px;
            padding-left: 16px;
          }
        }
        .link_wrap {
          margin-top: 16px;
          padding: 16px;
          width: 704px;
          // line-height: 64px;
          border: 1px solid #f0f2f7;
          .input_box {
            width: 100%;
          }
          .link_title,
          .link_abstract {
            margin-top: 16px;
            display: flex;
            align-items: center;

            .input_warp {
              flex: 1;
            }
          }
          .labelTxt {
            color: #3c4353;
          }
          .link_cover {
            margin-top: 16px;
            display: flex;
            .cover-warp {
              position: relative;
              //  margin-top: 15px;
              .imgcover {
                width: 128px;
                height: 128px;
                border-radius: 4px;
              }
              .dtfriend {
                width: 20px;
                height: 20px;
                position: absolute;
                top: -10px;
                right: -10px;
              }
            }
          }
        }
        .material_warp {
          margin-top: 16px;
          border: 1px solid #f0f2f7;
          border-radius: 4px;
          width: 704px;
          min-height: 142px;
          display: flex;
          padding: 16px;
          font-size: 14px;
          color: #3c4353;
          .txt_btn {
            cursor: pointer;
            color: #4168f6;
            display: inline-block;
            margin-left: 16px;
          }
          .mater_content {
            .articleShow {
              .name_tite {
                word-break: break-all;
              }
              span {
                display: inline-block;
                margin-bottom: 8px;
              }
              .card_article {
                width: 250px;
                border: 1px solid #d9dae4;
                padding: 16px;
                margin-top: 16px;
                line-height: 20px;
                .title {
                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .content {
                  display: flex;
                  .left {
                    width: 152px;
                    margin-right: 16px;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                    font-size: 12px;
                    color: #c0c4cc;
                  }
                  .right {
                    img {
                      width: 50px;
                      height: 50px;
                    }
                  }
                }
              }
            }
            .fileSHow {
              .card_article {
                width: 250px;
                border: 1px solid #d9dae4;
                padding: 16px;
                margin-top: 16px;
                .title {
                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .content {
                  display: flex;
                  .left {
                    margin-right: 8px;
                    // width: 60px;
                    // height: 60px;
                    // img {
                    //   width: 60px !important;
                    //   height: 60px !important;
                    // }
                  }
                  .right {
                    .fileSize {
                      font-size: 12px;
                      color: #c0c4cc;
                      margin-top: 4px;
                    }
                    .fileName {
                      font-size: 14px;
                      color: #3c4353;
                      width: 145px;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      height: 40px;
                    }
                  }
                }
              }
            }
            .photoSHow {
              .photo_card {
                .phonto_box {
                  margin-top: 16px;
                  display: inline-block;
                  width: 128px;
                  height: 128px;
                  background: #ffffff;
                  border-radius: 4px;
                  border: 1px solid #d9dae4;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
          }
        }
      }
    }
    .noticeBtn {
      padding-left: 70px;
      margin-top: 32px;
      .el-button--primary {
        background-color: #4168f6;
        border-color: #4168f6;
        width: 132px;
        height: 32px;
        line-height: 32px;
        padding: 0;
      }
    }
  }
}
</style>