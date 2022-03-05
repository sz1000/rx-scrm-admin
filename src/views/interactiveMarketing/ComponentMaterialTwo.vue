<template>
  <div class="upload_box">
    <div class="warpList" v-for="(item, index) in list" :key="index">
      <ul class="radio-type">
        <span class="mr">选择素材类型</span>
        <li
          v-for="(el, i) in radioList"
          :key="i"
          @click="changeRadio(item, el)"
        >
          <span
            :class="{ active: item.type == el.value }"
            class="defaultBorder"
          ></span>
          <span
            :class="{ activeTxt: item.type == el.value }"
            class="defaultColor"
            >{{ el.name }}</span
          >
        </li>
        <!--  -->
        <li class="deletebtn" @click="deleteIndex()">
          <img src="../../assets/images/icon_delete@2x.png" alt="" />
          删除
        </li>
      </ul>
      <div class="textarea-box">
        <section class="text-content"></section>
        <!-- v-show="
            itemInfo.activeIndex == 'image' || itemInfo.activeIndex == 'text'
          " -->
        <section class="upload-box" v-if="item.type == 'image'">
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
            <img v-if="item.val" :src="item.val" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="adviceTxt">
            建议上传大小不超过2MB的图片，格式支持jpeg、jpg、png
          </div>
        </section>

        <section class="link-box" v-else>
          <!-- <el-input v-model="itemInfo.url" placeholder=""></el-input> -->
          <el-form>
            <el-form-item>
              <el-input
                v-model="item.val"
                @input="
                  item.val = item.val.replace(
                    /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\S+$]/g,
                    ''
                  )
                "
                placeholder="链接地址请以http或https开头"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <div class="flex">
                <span class="line_text">链接标题:</span>
                <el-input v-model="itemInfo.url"></el-input>
              </div>
            </el-form-item> -->
            <!-- <el-form-item>
              <div class="flex">
                <span class="line_text">链接摘要:</span>
                <el-input v-model="itemInfo.url"></el-input>
              </div>
            </el-form-item> -->
          </el-form>
        </section>
      </div>
    </div>
    <el-button @click="addFun">add</el-button>
  </div>
</template>

<script>
import UploadImg from "../../components/UpLoadImg/index";

export default {
  components: {
    UploadImg,
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
    list: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    // console.log('------链接组件-------', this.allList)
  },
  data() {
    return {
      // list: [
      //   {
      //     type: "url",
      //     val: "",
      //   },
      // ],
      radioList: [
        // { name: "文字", value: "text" },
        { name: "图片", value: "image" },
        // { name: 'PDF', value: 'pdf' },
        { name: "链接", value: "url" },
      ],
      // activeIndex: 'txt',
      // text: '',
      // imageUrl: '',
      fileList: [],
      pdfList: [],
      pdfName: "",
      pdfFileSize: "",
      url: "",
      showPdf: false,
      urlimgLIst: [],
    };
  },
  methods: {
    addFun() {
      let _data = {
        type: "image",
        val: "",
      };
      this.list.push(_data);
    },
    saveFun() {
      this.$emit("save", this.list);
    },
    changeRadio(item, el) {
      item.type = el.value;
      // this.$emit("getType", item.value);
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      const isJPG =
        file.raw.type == "image/jpeg" ||
        file.raw.type == "image/jpg" ||
        file.raw.type == "image/png";
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isJPG || !isLt2M) {
        this.$message.error(
          "上传头像图片只能是 JPG,PNG,JEPG 格式，大小不能超过 2MB!"
        );
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
      console.log(this.itemInfo, "itemInfo----");
      console.log("111111", file, fileList);
      let formData = new FormData();
      formData.append("file", file.raw);
      formData.append("type", "qunfa");
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
              this.radioList.image = res.data.url;
              this.radioList.text = res.data.objectname;
            }

            console.log(this.itemInfo, "---------");
          });
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
  },
};
</script>
<style lang="less" scoped>
.mr {
  margin-right: 20px;
}
.warpList {
  border: 1px solid #d9dae4;
  border-radius: 4px;
  padding: 0px 10px 10px;

  margin-bottom: 20px;
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
  }
  .line_text {
    font-size: 14px;
    color: #3c4353;
    letter-spacing: 0;
    font-weight: 400;
    width: 82px;
  }
}
</style>
