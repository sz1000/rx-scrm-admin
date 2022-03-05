<template>
  <div v-if="newAddTech" class="warpList" v-loading="loading">
    <ul class="radio-type">
      <span class="mr">选择素材类型</span>
      <li
        v-for="(item, index) in radioList"
        :key="index"
        @click="changeRadio(item, index)"
      >
        <span
          :class="{ active: itemInfo.activeIndex == item.value }"
          class="defaultBorder"
        ></span>
        <span
          :class="{ activeTxt: itemInfo.activeIndex == item.value }"
          class="defaultColor"
          >{{ item.name }}</span
        >
      </li>
      <!--   v-show="this.allList.length > 1" -->
      <li class="deletebtn" @click="deleteIndex()">
        <img src="../../../assets/images/icon_delete@2x.png" alt="" />
        删除
      </li>
    </ul>
    <div class="textarea-box">
      <section class="text-content"></section>
      <section
        class="upload-box"
        v-show="
          itemInfo.activeIndex == 'image' || itemInfo.activeIndex == 'text'
        "
      >
        <el-upload
          class="avatar-uploader"
          action="http://172.10.7.200:8099/customer-service/oss/uploadfileparam"
          ref="upload"
          :auto-upload="false"
          :show-file-list="true"
          :file-list="fileList"
          :on-change="changeFile"
          :on-remove="removeFile"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="itemInfo.imageUrl"
            :src="itemInfo.imageUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div
          class="adviceTxt"
          v-show="
            itemInfo.activeIndex == 'image' || itemInfo.activeIndex == 'text'
          "
        >
          建议上传大小不超过2MB的图片，格式支持jpeg、jpg、png
        </div>
      </section>

      <section class="link-box" v-show="itemInfo.activeIndex == 'url'">
        <!-- <el-input v-model="itemInfo.url" placeholder=""></el-input> -->
        <!-- <el-form> -->
        <el-form>
          <el-form-item>
            <el-input
              v-model="itemInfo.url"
              @input="
                itemInfo.url = itemInfo.url.replace(
                  /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\S+$]/g,
                  ''
                )
              "
              placeholder="链接地址请以http或https开头"
               @blur="blurUrl"
            ></el-input>
          </el-form-item>
       
          <el-form-item>
            <div class="flex">
              <span class="line_text"><span class="red">*</span> 链接标题:</span>
              <el-input v-model="itemInfo.urltite"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flex">
              <span class="line_text">链接摘要:</span>
              <el-input v-model="itemInfo.urldigest"></el-input>
            </div>
          </el-form-item>

            <el-form>
            <div class="link_cover">
              <span class="labelTxt">链接封面：</span>
              <span class="uploadLink" v-if="!this.itemInfo.linkImgUrl">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  drag
                  action="#"
                  :http-request="handleChange"
                  :file-list="linkImgList"
                  :on-remove="handleImgRemove"
                  :limit="1"
                  :on-change="changeFileurl"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                </el-upload>
              </span>
              <span v-else
               class="cover-warp" >
               <img :src=" this.itemInfo.linkImgUrl" alt="" class="imgcover"
              />
              <img @click="dleatImg" src="../../../assets/images/dtfriend.png" alt="" class="dtfriend">
              </span>
            </div>
          </el-form>
        </el-form>
        <!-- <el-form-item>
            <el-input
              v-model="itemInfo.url"
              @input="
                itemInfo.url = itemInfo.url.replace(
                  /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\S+$]/g,
                  ''
                )
              "
              placeholder="链接地址请以http或https开头"
            ></el-input>
          </el-form-item> -->
        <!-- </el-form> -->
      </section>
         <section class="material_warp border_none" v-show="itemInfo.activeIndex == 'sucai'">
        <MaterialDialog
          @sure="fnMaterialInfo"
          :dialogVisible="openDialog"
          ref="mater"
        ></MaterialDialog>
        <div class="mater_content">
          <div class="articleShow" v-show="materObj.tab == 1">
            <span>文章：{{ materObj.title }}</span>
            <div class="txt_btn" @click="resetSlect">重新选择</div>
            <div class="card_article">
              <div class="title">{{ materObj.title }}</div>
              <div class="content">
                <div class="left">{{ materObj.contentAbstract }}</div>
                <div class="right">
                  <!-- <img src="../../../assets/images/article.png" alt="" /> -->
                  <img :src="materObj.cover" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="fileSHow" v-show="materObj.tab == 2">
            <span>文件：{{ materObj.name }}</span>
            <span class="txt_btn" @click="resetSlect">重新选择</span>
            <div class="card_article" v-show="materObj.tab == 2 && materObj.name">
              <div class="content">
                <div class="left">
                  <img src="../../../assets/images/pdf_image.png" alt="" />
                </div>
                <div class="right">
                  <div class="fileName">{{ materObj.name }}</div>
                  <div class="fileSize">
                    {{ (materObj.fileSize / 1024).toFixed(2) }}kb
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="photoSHow" v-show="materObj.tab == 3">
            <span>海报：{{ materObj.posterName }}</span>
            <div class="photo_card">
              <span class="phonto_box" v-show="materObj.tab == 3 && materObj.posterUrl">
                <img :src="materObj.posterUrl" alt="" />
              </span>
              <span class="txt_btn" @click="resetSlect" >重新选择</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import UploadImg from "../../../components/UpLoadImg/index";
import { addFriend ,getarticle} from '../../../api/friend'
import MaterialDialog from "../../../components/materialDialog/index.vue";
import { AddPoster, uploadToOss, uploadFileUrl } from "../../../config/api";
export default {
  components: {
    UploadImg,
    MaterialDialog,
  },
  props: {
    single: {
      type: Number,
    },
    itemInfo: {
      type: Object,
    },
    allList: {
      type: Array,
    },
    newAddTech: {
      type: Boolean,
    },
  },
  created() {
    // console.log('------链接组件-------', this.allList)
  },
  data() {
    return {
      linkImgUrl: "",
      openDialog: false,
      materObj: {},
      loading: false,
      fromLis: {
        skipUrl: "",
      },
      checkItem: {
        skipUrl: [
          // { required: true, message: "请输入活动名称", trigger: "blur" },
          { required: true, validator: this.checkUrl, trigger: "blur" },
        ],
      },
      radioList: [
        // { name: "文字", value: "text" },
        { name: "图片", value: "image" },
        // { name: 'PDF', value: 'pdf' },
        { name: "链接", value: "url" },
           { name: "素材库", value: "sucai" },
      ],
      // activeIndex: 'txt',
      // text: '',
      // imageUrl: '',
      fileList: [],
      linkImgList: [],
      pdfList: [],
      pdfName: "",
      pdfFileSize: "",
      url: "",
      showPdf: false,
      urlimgLIst: [],
    };
  },
  methods: {


    fnMaterialInfo(obj) {
      console.log("----obj---", obj);
       this.materObj = obj;
       this.openDialog = false;
       this.itemInfo.mediaDesc = obj.contentAbstract
       this.itemInfo.meiapicul = obj.cover
       this.itemInfo.mediatite = obj.title
     
       this.itemInfo.mediatype = obj.tab
       this.itemInfo.objList = obj
       if(obj.tab == 3 ){
              // this.itemInfo.meiapicul = obj.posterUrl
             this.itemInfo.mediatite = obj.posterName
             this.itemInfo.urls = obj.posterUrl
           this.itemInfo.mediatype = obj.tab
       }
         if(obj.tab == 2){
           this.itemInfo.mediatite = obj.name
           this.itemInfo.mediatype = obj.tab
       }
    },
    
        resetSlect() {
      // console.log(this.$refs.mater)
      // this.$refs.mater.dialogVisible = true
      this.openDialog = true;
    },

        blurUrl(){
       console.log(1)
       if(!this.$httpReg(this.itemInfo.url) || !this.$linkReg(this.itemInfo.url)){
       this.$message({ message: '请填写正确的链接地址格式',type: 'error' })
       }else{
          
       this.loading = true
       let params = {
         articleUrl: window.btoa(this.itemInfo.url)
       } 
      //  console.log(params,'---parasm----')
      
       getarticle(params).then((res)=>{
         console.log(res)
         if(res.result){
         this.itemInfo.urltite = res.data.title
         this.itemInfo.urldigest = res.data.contentAbstract
         this.itemInfo.linkImgUrl = res.data.cover
         this.loading = false
         }else{
           this.loading = false
         }
     
       })
       }
    },
    dleatImg(){
      //  this.linkImgUrl =""
       this.itemInfo.linkImgUrl = ""
    },
    changeRadio(item, index) {
      console.log(item, index);
      this.itemInfo.activeIndex = item.value;
         if (item.value == "sucai") {
        this.openDialog = true;
      }
          console.log("aa", item.value);
      this.$emit("getType", item.value);
    },
    checkUrl(rule, value, callback) {
      console.log(value);
      if (!value) {
        // return callback(new Error("不能为空"));
      } else {
        // const reg = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,20}$/;
        const reg =
          /((http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?)/g;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入规范的url地址"));
        }
      }
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      const isJPG =
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/jpg" ||
        file.raw.type == "image/png";
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isJPG || !isLt2M) {
        // this.$message.error(
        //   "上传头像图片只能是 JPG,PNG,JEPG 格式，大小不能超过 2MB!"
        // );
      }
      // console.log(isJPG, isLt2M)
      return isJPG && isLt2M;
    },
    beforePdfUpload(file) {
      // console.log('----pdf2222----', file)
      const isPdf = file.raw.type == "application/pdf";
      const pdfSize = file.size / 1024 / 1024 < 20;
      if (!isPdf || !pdfSize) {
        this.$message.error("上传文件格式为pdf,大小不能超过 20MB!");
      }
      return isPdf && pdfSize;
    },
    changeFile(file, fileList) {
      this.loading = true;
      console.log(this.itemInfo, "itemInfo----");
      console.log("111111", file, fileList);
      let formData = new FormData();
      formData.append("file", file.raw);
      formData.append("type", "qunqunfa");
      formData.append("filetype", "image");

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // let params = {
      //   type: "群发",
      //   filetype: "image",
      //   formData,
      //   config,
      // };
      if (this.beforeAvatarUpload(file)) {
        console.log("通过校验----");
        this.$network
          .post("/common-service/oss/uploadfileparam", formData, config)
          .then((res) => {
            console.log(res, "------------");
            console.log(this.urlimgLIst, "---------zhiaian");
            if (res.result) {
              // this.urlimgLIst.push(res.data.url);
              // this.$set(this.itemInfo, "urlimgLIst", res.data.url);
              this.itemInfo.image = res.data.url;
              this.itemInfo.text = res.data.objectname;
              this.loading = false;
            } else {
                this.loading = false;
              this.$message({
                message: "上传图片失败",
                type: "warning",
              });
            }

            console.log(this.itemInfo, "---------");
          });
      }else{
        this.loading = false;
      }
      this.$emit("childEvent", file);
      if (this.beforeAvatarUpload(file)) {
        this.itemInfo.imageUrl = URL.createObjectURL(file.raw);
        this.fileList = fileList.slice(-1);
      } else {
        this.fileList = [];
      }
      console.log("---this.itemInfo--", this.itemInfo);
    },
    // changePdf(file, pdfList) {
    //   console.log("-----pdf1111-----", file, pdfList);
    //   let formData = new FormData();
    //   formData.append("file", file.raw);
    //   let config = {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   };
    //   if (this.beforeAvatarUpload(file)) {
    //     console.log("通过校验----");
    //     this.$network
    //       .post("/customer-service/oss/uploadfileparam", formData, config)
    //       .then((res) => {
    //         console.log(res, "------------");
    //         // this.$set(this.logoImgs, index, {
    //         //   imageUrl: res.data.url,
    //         //   groupTotal: '200',
    //         //   chatId: '',
    //         // })
    //       });
    //   }
    //   if (this.beforePdfUpload(file)) {
    //     this.showPdf = true;
    //     this.pdfName = file.name;
    //     this.pdfFileSize =
    //       Math.round((file.size / 1024 / 1024) * 100) / 100 + "M";
    //     // this.pdfFileSize = (file.size / 1024 / 1024).toFixed(1)
    //     this.pdfList = pdfList.slice(-1);
    //   } else {
    //     this.fileList = [];
    //   }
    // },
    removeFile(file, fileList) {
      console.log(fileList);
      this.fileList = fileList;
      // this.imageUrl = "";
      this.itemInfo.imageUrl = "";
      console.log(this.itemInfo.imageUrl);
    },
    removePdf(file, pdfList) {
      console.log("-------padList---", pdfList);
      this.pdfList = pdfList;
    },
    deletePdf() {
      this.showPdf = false;
      this.removePdf();
      console.log(this.pdfList);
    },
    deleteIndex() {
      console.log(this.single);
      this.$emit("fnDelete", this.single);
    },
    // ----------------
      handleChange(request) {
      // console.log(request)
      let formData = new FormData();
      formData.append("file", request.file);
      formData.append("filetype", "image");
      formData.append("type", "friend");
      uploadToOss(formData).then((res) => {
        console.log(res,"----dd")
        if (res.result) {
          // this.linkImgUrl = res.data.url;
           this.itemInfo.linkImgUrl = res.data.url;
          // AddPoster(data).then((res) => {})
        }
      });
    },
       handleImgRemove(file, fileList) {},
          changeFileurl(file, fileList) {
      console.log(file)
      // this.$refs.upload.clearFiles()
    },
  },
};
</script>
<style lang="less" scoped>
.material_warp {
  margin-top: 16px;
  border: 1px solid #f0f2f7;
  border-radius: 4px;
  // width: 704px;
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
            img {
              width: 60px;
              height: 60px;
            }
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
              width: 80px;
              height: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
.border_none{
  border: none;
}
.link_cover {
  display: flex;
  .upload-demo {
    margin-top: 10px;
  }
  .cover-warp{
  position: relative;
      margin-top: 15px;
      .imgcover {
    width: 128px;
    height: 128px;
    border-radius:4px;
    
  }
  .dtfriend{
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
  }
  }

}
.warpList {
  border: 1px solid #d9dae4;
  border-radius: 4px;
  padding: 0px 10px 10px;

  margin-bottom: 20px;
}
.mr {
  margin-right: 20px;
}
.radio-type {
  display: flex;
  padding: 0;
  margin: 20px 0;
  position: relative;
  li {
    cursor: pointer;
    list-style: none;
    margin-right: 16px;
    .defaultBorder {
      display: inline-block;
      width: 12px;
      height: 12px;
      border: 1px solid #d9dae4;
      border-radius: 50%;
      vertical-align: -2%;
      margin-right: 6px;
    }
    .active {
      vertical-align: -2%;
      border: 4px solid #4168f6;
    }
    .activeTxt {
      color: #4168f6;
    }
    .defaultColor {
    }
  }
  .deletebtn {
    position: absolute;
    right: 0;
    img {
      width: 14px;
      height: 14px;
      vertical-align: -5%;
    }
  }
}
.textarea-box {
  .text-content {
    /deep/.el-textarea__inner {
      background: #fafbff;
      height: 232px;
    }
  }
  .upload-box,
  .pdf-box {
    position: relative;
    .avatar-uploader {
      background: #fafbff;
      border-radius: 4px;
      border: 1px solid #d9dae4;
      height: 196px;
      padding: 16px;
      display: flex;
      align-items: center;
      /deep/.el-upload-list__item-name {
        width: 300px;
        overflow: hidden;
      }
    }
    .adviceTxt {
      color: #d9dae4;
      position: absolute;
      // bottom: 16px;
      bottom: 0px;
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
      background: #fff;
      color: #8c939d;
      width: 128px;
      height: 128px;
      line-height: 128px;
      text-align: center;
    }

    .pdf-file-success {
      height: 148px;
      background: #fafbff;
      border: 1px solid #d9dae4;
      padding: 16px;
      .pdf-img {
        position: relative;
        width: 250px;
        height: 80px;
        background: #ffffff;
        border: 1px solid #d9dae4;
        display: flex;
        align-items: center;
        padding-left: 16px;
        img {
          margin-right: 8px;
        }
        span {
          display: block;
        }
        span:nth-child(2) {
          font-size: 12px;
          color: #c0c4cc;
          margin-top: 4px;
        }
        .el-icon-circle-close {
          position: absolute;
          right: -6px;
          top: -5px;
          cursor: pointer;
        }
      }
    }
  }
  .link-box {
    // height: 196px;
    // height: 81px;
    background: #fafbff;
    border: 1px solid #d9dae4;
    padding: 16px;
    /deep/.el-input__inner {
      width: 100% !important;
    }
        /deep/.el-form{
   margin-bottom: 10px !important;
}
  }
  .line_text {
    font-size: 14px;
    color: #3c4353;
    letter-spacing: 0;
    font-weight: 400;
    width: 82px;
     .red{
      color: red;
    }
  }
}
.link_cover {
  display: flex;
  .upload-demo {
    margin-top: 10px;
  }
  .cover-warp{
  position: relative;
      margin-top: 15px;
      .imgcover {
    width: 128px;
    height: 128px;
    border-radius:4px;
    
  }
  .dtfriend{
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
  }
  }

}
   /deep/.el-form-item{
      .el-form-item__content{
        margin-bottom: 10px !important;
      }
    }
</style>
