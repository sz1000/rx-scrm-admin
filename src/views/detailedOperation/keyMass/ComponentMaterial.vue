<template>
  <div class="select_list">
    <div class="list" v-loading="loading">
      <div class="li" v-for="(item, index) in list" :key="index">

        <div class="radio_box">
          <span class="text">选择素材类型</span>
          <el-radio @change="valdata(item, index)" v-model="item.type" v-for="(se, i) in typeList" :key="i" :label="se.code">{{ se.name }}</el-radio>
          <el-button type="text" class="delete_btn" @click="deleteFun(index)">
            <img src="../../../assets/images/icon_delete@2x.png" alt="" />
            删除
          </el-button>
        </div>
        <div class="content" v-if="item.type == 'img'">
          <div class="upload_wrap">
            <div class="upload_row">
              <div class="upload_box">
                <div class="img_box" v-if="item.image">
                  <img :src="item.image" alt="" />
                </div>
                <div class="upload" v-else>
                  <div class="icon_box">
                    <div class="icon"></div>
                    <div class="text">上传图片</div>
                  </div>
                  <input class="file" type="file" @change="
                      uploadFun(
                        $event,
                        'images',
                        'sop',
                        'png,jpg,jpeg',
                        '2',
                        index
                      )
                    " accept=".png,.jpg,.jpeg" />
                </div>
              </div>
              <div class="afresh_file" v-if="item.image">
                重新上传<input class="file" type="file" @change="
                    uploadFun(
                      $event,
                      'images',
                      'sop',
                      'png,jpg,jpeg',
                      '2',
                      index
                    )
                  " accept=".png,.jpg,.jpeg" />
              </div>
            </div>
            <div class="upload_tips">
              建议上传大小不超过2MB的图片，格式支持jpeg、jpg、png
            </div>
          </div>
        </div>

        <div class="content" v-if="item.type == 'link'">
          <div class="link_wrap">
            <div class="input_item">
              <el-input v-model="item.url" @keyup.enter.native="onSubmit" @input="
                  item.url = item.url.replace(
                    /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\S+$]/g,
                    ''
                  )
                " placeholder="链接地址请以http或https开头"></el-input>
            </div>
            <div class="l_item">
              <div class="l_label">
                <span style="color: red">*</span>链接标题：
              </div>
              <div class="l_val">
                <el-input v-model="item.urltite" placeholder=""></el-input>
              </div>
            </div>
            <div class="l_item">
              <div class="l_label">链接摘要：</div>
              <div class="l_val">
                <el-input v-model="item.urlAbstract" placeholder=""></el-input>
              </div>
            </div>
            <div class="l_item">
              <div class="l_label mr">链接封面：</div>
              <div class="l_val upload_wrap">
                <div class="upload_row">
                  <div class="upload_box">
                    <div class="img_box" v-if="item.linkImgUrl">
                      <img :src="item.linkImgUrl" alt="" />
                    </div>
                    <div class="upload" v-else>
                      <div class="icon_box">
                        <div class="icon"></div>
                        <div class="text">上传图片</div>
                      </div>
                      <input class="file" type="file" @change="
                          uploadFuns(
                            $event,
                            'images',
                            'sop',
                            'png,jpg,jpeg',
                            '2',
                            index
                          )
                        " accept=".png,.jpg,.jpeg" />
                    </div>
                  </div>
                  <!-- <div class="afresh_file" v-if="item.url">重新上传<input class="file" type="file" @change="uploadFun($event,'images','sop','png,jpg,jpeg','2',index)" accept=".png,.jpg,.jpeg" /></div> -->
                  <div class="afresh_file" v-if="item.linkImgUrl">
                    重新上传<input class="file" type="file" @change="
                        uploadFuns(
                          $event,
                          'images',
                          'sop',
                          'png,jpg,jpeg',
                          '2',
                          index
                        )
                      " accept=".png,.jpg,.jpeg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="data-warp" v-if="item.type == 'sucai'">
          <div class="articleShow" v-show="item.tab == 1">
            <span>文章：{{ item.title }}</span>
            <div class="txt_btn" @click="resetSlect">重新选择</div>
            <div class="card_article" v-show="item.tab == 1 && item.title">
              <div class="title">{{ item.title }}</div>
              <div class="content">
                <div class="left">{{ item.contentAbstract }}</div>
                <div class="right">
                  <img :src="item.cover" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="fileSHow" v-show="item.tab == 2">
            <span>文件：{{ item.name }}</span>
            <span class="txt_btn" @click="resetSlect">重新选择</span>
            <div class="card_article" v-show="item.tab == 2 && item.name">
              <div class="content">
                <div class="left">
                  <img :src="item.cover" alt="" v-if="item.cover" />
                  <img src="../../../assets/images/pdf_image.png" alt="" v-else />
                </div>
                <div class="right">
                  <div class="fileName">{{ item.name }}</div>
                  <div class="fileSize">
                    {{ (item.fileSize / 1024).toFixed(2) }}kb
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="photoSHow" v-show="item.tab == 3">
            <span>海报：{{ item.posterName }}</span>
            <div class="photo_card">
              <span class="phonto_box" v-show="item.tab == 3 && item.posterUrl">
                <img :src="item.posterUrl" alt="" />
              </span>
              <span class="txt_btn" @click="resetSlect">重新选择</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="opera">
      <div class="flex center_add">
        <div class="codeBtn pointer" @click="addFun">
          <img src="../../../assets/images/icon_add@2x.png" alt="" />
          新增素材内容
        </div>
        <span class="tite_add"><span>（最多可添加 <span>{{ this.list.length }}</span>/
          </span>
          9<span>个附件</span>）</span>
      </div>
      <!-- <el-button class="btn" @click="addFun" type="primary" plain
        >新增</el-button
      > -->
      <!-- <el-button @click="submit" type="primary">确定</el-button> -->
      <div class="inform_send pointer" @click="submit">
        通知成员发送
      </div>
    </div>
    <!-- 素材库 -->
    <div v-if="openDialog">

      <MaterialDialog @sure="fnMaterialInfo" ref="mater" :dialogVisible="openDialog" :modals="modalsData"></MaterialDialog>
    </div>
  </div>
</template>

<script>
import { uploadToOss } from '../../../config/api'
import { getarticle } from '../../../api/friend'
import MaterialDialog from '../../../components/materialDialog/index.vue'
export default {
  name: 'SelectList',
  components: {
    MaterialDialog,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      typeShow: 'img',
      openDialog: false,
      modalsData: true,
      fromData: {
        fileList: [],
        linkImgList: [],
      },
      typeList: [
        // { name: "图片", code: "img" },
        // { name: "链接", code: "link" },
        { name: '素材库', code: 'sucai' },
      ],
      list: [],
      rowIndex: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    resetSlect() {
      this.openDialog = true
    },
    init() {
      if (this.data && this.data.length) {
        this.list = this.data
      }
    },
    valdata(val, index) {
      console.log(val.type)
      this.rowIndex = index
      this.typeShow = val.type
      if (val.type == 'sucai') {
        this.openDialog = true
      }
    },
    addFun() {
      let obj = {
        type: '',
        text: '',
        urltite: '',
        image: '',
        sucai: '',
        url: '',
        urltite: '',
        urldigest: '',
        linkImgUrl: '',
        mediaDesc: '',
        meiapicul: '',
        mediatite: '',
        mediatype: '',
        url: '',
        objList: {},
        listurl: '',
        urls: '',
        urlAbstract: '',
        objectName: '',
      }
      if (this.list.length < 9) {
        this.list.push(obj)
      }
    },
    deleteFun(index) {
      this.list.splice(index, 1)
    },

    submit() {
      this.$emit('sure', this.list)
    },
    // 上传
    uploadFun(e, fileType, type, accept, size, index) {
      //文件上传
      let fileName = e.target.files[0].name
      let fileSize = e.target.files[0].size
      this.$uploadFun(e, fileType, type, size, accept).then((res) => {
        if (res) {
          console.log(res)
          this.list[index].image = res.url
          this.list[index].objectName = res.name
          // this.addData.sopContentAttachmentVOS[index].fileName = fileName
          // this.addData.sopContentAttachmentVOS[index].fileSize = this.$filterSize(fileSize)
        }
      })
    },
    uploadFuns(e, fileType, type, accept, size, index) {
      //文件上传
      let fileName = e.target.files[0].name
      let fileSize = e.target.files[0].size
      this.$uploadFun(e, fileType, type, size, accept).then((res) => {
        if (res) {
          console.log(res)
          this.list[index].image = res.url
          // // this.addData.sopContentAttachmentVOS[index].objectName = res.objectname
          // this.addData.sopContentAttachmentVOS[index].fileName = fileName
          // this.addData.sopContentAttachmentVOS[index].fileSize = this.$filterSize(fileSize)
        }
      })
    },
    onSubmit() {
      console.log(1)
      if (
        !this.$httpReg(this.list[this.rowIndex].url) ||
        !this.$linkReg(this.list[this.rowIndex].url)
      ) {
        this.$message({ message: '请填写正确的链接地址格式', type: 'error' })
      } else {
        this.loading = true
        let params = {
          articleUrl: window.btoa(this.list[this.rowIndex].url),
        }
        //  console.log(params,'---parasm----')

        getarticle(params).then((res) => {
          console.log(res)
          if (res.result) {
            this.list[this.rowIndex].urltite = res.data.title
            this.list[this.rowIndex].urlAbstract = res.data.contentAbstract
            this.list[this.rowIndex].linkImgUrl = res.data.cover
            this.loading = false
          } else {
            this.loading = false
          }
        })
      }
    },
    saveFun() {},
    fnMaterialInfo(obj) {
      console.log('----obj---', obj)
      this.list[this.rowIndex].objList = Object.assign(
        this.list[this.rowIndex],
        obj
      )
      // this.list[this.rowIndex].objList = obj;
      console.log(this.list)
      this.openDialog = false
    },
  },
}
</script>

<style lang="less" scoped>
.select_list {
  width: 100%;
  .list {
    width: 100%;
    .li {
      border-radius: 4px;
      border: 1px solid #eee;
      border-radius: 4px;
      color: #000;
      padding: 20px;
      margin-bottom: 20px;
      .radio_box {
        .text {
          margin-right: 20px;
        }
        width: 100%;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        .delete_btn {
          color: #000;
          position: absolute;
          right: 40px;
          img {
            width: 14px;
            height: 14px;
            vertical-align: -10%;
          }
        }
      }
      .content {
        // width: 100%;
        .upload {
          width: 120px;
          height: 120px;
          border: 1px solid #eee;
        }
        .upload_wrap {
          width: 100%;
          .upload_row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 16px;
            font-size: 0;
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
          .upload_box {
            width: 128px;
            height: 128px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            font-size: 0;
            .img_box {
              width: 100%;
              height: 100%;
              img {
                width: 100%;
                height: 100%;
              }
            }
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
            height: 20px;
            font-size: 14px;
            color: #c0c4cc;
          }
        }
        .link_wrap {
          width: 100%;
          .input_item {
            margin-bottom: 10px;
          }
          .l_item {
            display: flex;
            line-height: 40px;
            font-size: 14px;
            margin-bottom: 10px;
            .l_label {
              width: 85px;
              color: @fontMain;
            }
            .l_val {
              width: calc(100% - 70px);
            }
            .upload_wrap {
              .upload_row {
                .upload {
                  .text {
                    margin-top: -30px;
                  }
                }
              }
            }
          }
        }
      }
      .data-warp {
        .share_box {
          width: 250px;
          height: 100px;
          background: #fff;
          border: 1px solid #d9dae4;
          padding: 16px;
          display: flex;
          .title {
            font-size: 14px;
            line-height: 20px;
            color: #3c4353;
            width: 145px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            height: 40px;
            line-height: 40px;
          }
          .line {
            width: 100%;
            display: flex;
            align-items: center;
            .des {
              width: calc(100% - 66px);
              font-size: 12px;
              line-height: 17px;
              color: #c0c4cc;
              word-break: break-all;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .img_box {
              width: 50px;
              height: 50px;
              margin-left: 16px;
              // background: #FAFBFF;
            }
            .img_box {
              width: 50px;
              height: 50px;
              margin-left: 16px;
              // background: #FAFBFF;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .articleShow {
          .txt_btn {
            cursor: pointer;
            color: #4168f6;
            display: inline-block;
            margin-left: 16px;
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
          .txt_btn {
            cursor: pointer;
            color: #4168f6;
            display: inline-block;
            margin-left: 16px;
          }
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
            .txt_btn {
              cursor: pointer;
              color: #4168f6;
              display: inline-block;
              margin-left: 16px;
            }
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
  .opera {
    .tite_add {
      font-size: 14px;
      color: #c0c4cc;
      letter-spacing: 0;
      font-weight: 400;
    }

    // display: flex;
    margin-top: 20px;
    .btn {
      margin-right: 20px;
    }
    .codeBtn {
      width: 132px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      text-align: center;
      color: #4168f6;
      line-height: 32px;

      img {
        width: 12px;
        height: 12px;
      }
    }
  }
  .inform_send {
    width: 132px;
    height: 32px;
    background: #4168f6;
    border-radius: 4px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    border: 1px solid transparent;
    margin-top: 30px;
  }
}
</style>
