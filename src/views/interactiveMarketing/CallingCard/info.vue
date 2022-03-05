<template>
  <div class="info_wrap">
    <div class="line_title">名片基础信息</div>
    <div class="notice_box" v-if="isClose">
      <img class="icon" src="@/assets/images/icon_warning.png" alt="" />
      <span class="text">管理员已关闭名片功能，请及时联系管理员开启</span>
    </div>
    <div class="item">
      <div class="label">名片功能：</div>
      <div class="val">
        <el-switch
          v-model="enableStatus"
          @change="saveFun"
          :active-text="enableStatus ? '已开启' : '已关闭'"
        ></el-switch>
        <!-- <span class="link">预览</span> -->
      </div>
    </div>
    <div class="item" v-show="enableStatus">
      <div class="label">企业介绍：</div>
      <div class="val text_content">
        <div class="item">
          <div class="label">标题：</div>
          <div class="val">
            <el-input
              type="text"
              v-model="detail.enterpriseTitle"
              placeholder="请输入标题"
              maxlength="100"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="item">
          <div class="label">内容：</div>
          <div class="val">
            <div ref="editor" class="editor"></div>
          </div>
        </div>
        <div class="opera_box">
          <el-button class="btn" :disabled="disableds" type="primary" @click="saveFun" size="medium"
            >保存</el-button
          >
          <el-button
            class="btn plain"
            size="medium"
            @click="dialog = true"
            plain
            >清除</el-button
          >
        </div>
      </div>
    </div>
    <!-- 删除弹窗 -->
    <DeleteDialog
      v-model="dialog"
      text="清除内容企业信息将为空，是否确认清除？"
      @sure="clearFun"
    ></DeleteDialog>
  </div>
</template>

<script>
import { oss_uploadfileparam } from "@/api/base";
import {
  userBusinessCard_edit,
  userBusinessCard_personalCard,
} from "@/api/card";
import E from "wangeditor";
import DeleteDialog from "@/views/customerManagement/component/DeleteDialog.vue";
export default {
  components: {
    DeleteDialog,
  },
  data() {
    return {
      isClose: false,
      enableStatus: false,
      detail: {
        enableStatus: 0,
        enterpriseTitle: "",
        enterpriseDescription: "",
      },
      dialog: false,
      editor: null,
    
    };
  },
  computed:{
    disableds(){
      let _data = this.detail,state = false
      if(_data && !_data.enterpriseTitle && !_data.enterpriseDescription){
        state = true
      }
      return state
    },
  },
  mounted() {
    this.getDetail();
  },

  methods: {
    getDetail() {
      //获取详情
      userBusinessCard_personalCard().then((res) => {
        if (res.result) {
          let data = res.data;
          if (data) {
            this.detail = Object.assign(this.detail, data);
            if (data.enableStatus) {
              this.enableStatus = true;
            }
          }
          if (!this.editor) {
            this.$nextTick(() => {
              this.initEditor();
            });
          }
        }
      });
    },
    saveFun() {
      //保存
      let data = this.detail;
      if (this.enableStatus) {
        data.enableStatus = 1;
      } else {
        data.enableStatus = 0;
      }
      userBusinessCard_edit(data).then((res) => {
        if (res.result) {
          this.$message.success("保存成功！");
          this.getDetail();
        }
      });
    },
    // 初始化富文本
    initEditor() {
      let editor = new E(this.$refs.editor);
      this.editor = editor;
      editor.config.menus = [
        "head",
        "bold",
        "fontSize",
        "fontName",
        "italic",
        "underline",
        "strikeThrough",
        "indent",
        "lineHeight",
        "foreColor",
        "backColor",
        "link",
        "list",
        "justify",
        "quote",
        "emoticon",
        "image",
        // 'table',
        // 'code',
        "splitLine",
        "undo",
        "redo",
      ];
      editor.config.zIndex = 1000;
      editor.config.placeholder = "请输入";
      // 关闭粘贴样式的过滤
      editor.config.pasteFilterStyle = false;
      editor.config.onchange = (html) => {
        this.detail.enterpriseDescription = html;
      };
      // 图片上传
      editor.config.customUploadImg = (files, insert) => {
        this.uploadFun(files, insert);
      };
      editor.create();
      editor.txt.html(this.detail.enterpriseDescription);
    },
    uploadFun(e, insert) {
      console.log("aaa", e);
      oss_uploadfileparam(e, "images", "card", true, e).then((res) => {
        this.uploadLoading = false;
        if (res.result) {
          insert(res.data.url);
        }
      });
    },
    clearFun() {
      //确认清除
      console.log("清除");
      this.detail.enterpriseDescription = "";
      this.detail.enterpriseTitle =""
      this.editor.txt.clear();
    },
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy();
    this.editor = null;
  },
};
</script>

<style lang="less" scoped>
.info_wrap {
  width: 100%;
  min-height: calc(100vh - 88px);
  background: @white;
  padding: 16px;
  position: relative;
  /deep/ .el-switch__label.is-active {
    color: @fontMain;
  }
  .notice_box {
    padding-left: 18px;
    position: absolute;
    left: 368px;
    top: 16px;
    .icon {
      width: 14px;
      height: 14px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .text {
      color: @red;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .line_title {
    font-size: 14px;
    line-height: 20px;
    color: @fontMain;
    font-weight: bold;
    position: relative;
    padding-left: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid @lineColor;
    margin-bottom: 20px;
    &:first-child {
      margin-bottom: 16px;
    }
    &::before {
      content: "";
      width: 2px;
      height: 14px;
      background: @main;
      position: absolute;
      left: 0;
      top: 3px;
    }
  }
  .item {
    display: flex;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
    .label {
      width: 70px;
      white-space: nowrap;
      color: @fontMain;
    }
    .val {
      width: 704px;
      &.text_content {
        padding-top: 36px;
        .item {
          width: 100%;
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 32px;
          }
          .label {
            width: 42px;
            line-height: 32px;
          }
          .val {
            width: calc(100% - 42px);
          }
          /deep/ .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }
      }
      .link {
        color: @main;
        margin-left: 32px;
        vertical-align: middle;
      }
      .opera_box {
        width: 100%;
        .btn {
          height: 32px;
          width: 76px;
          padding: 8px 20px;
          &.plain {
            color: @btnColor;
            border-color: @btnBdColor;
            &:hover {
              border-color: rgba(@fontSub2, 0.5);
            }
          }
        }
      }
    }
  }
}
</style>