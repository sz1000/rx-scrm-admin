<template>
  <div class="detail_warp">
    <el-dialog title="话术详情"
               :visible.sync="detailVisible"
               width="520px"
               :close-on-click-modal='false'
               :before-close="dialogBeforeClose">
      <div class="detail-row">
        <span>所属分组:</span>
        <span>{{detailObj.groupName}}</span>
      </div>
      <div class="detail-row">
        <span>话术标题:</span>
        <span>{{detailObj.title}}</span>
      </div>
      <div class="detail-row">
        <span>最后编辑人员:</span>
        <span>{{detailObj.updateBy}}</span>
      </div>
      <div class="detail-row">
        <span>最后编辑时间:</span>
        <span>{{this.formatDate(detailObj.updateTime,'yyyy-MM-dd hh:mm:ss')}}</span>
      </div>
      <div class="detail-row">
        <span>创建人员:</span>
        <span>{{detailObj.createBy}}</span>
      </div>
      <div class="detail-row">
        <span>创建时间:</span>
        <span>{{this.formatDate(detailObj.createTime,'yyyy-MM-dd hh:mm:ss')}}</span>
      </div>
      <div class="detail-row">
        <span>话术内容:</span>
        <div class="context-text">
          <div v-for="(item,index) in detailObj.contentList"
               :key="index"
               class="rowText">
            {{item.value}}
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <!-- <el-button @click="dialogBeforeClose">取 消</el-button> -->
        <el-button type="primary"
                   @click="save">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    detailVisible: {
      type: Boolean,
    },
    groupType: {
      type: String,
    },
    copyObj: {
      type: Object,
    },
  },
  data() {
    return {
      // newlabel: '',
      detailObj: {},
    }
  },
  created() {
    console.log(this.copyObj)

    this.detailObj = JSON.parse(JSON.stringify(this.copyObj))
  },
  methods: {
    dialogBeforeClose() {
      this.$emit('closeDetail')
    },

    save() {
      this.$emit('closeDetail')
    },
  },
}
</script>
<style lang="less" scoped>
.detail_warp {
  /deep/.el-dialog {
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
      height: 491px;
      overflow-y: scroll;
      .detail-row {
        display: flex;
        margin-bottom: 20px;
        span {
          display: inline-block;
          font-size: 14px;
          color: #3c4353;
        }
        span:nth-child(1) {
          width: 100px;
          text-align: right;
        }
        span:nth-child(2) {
          flex: 1;
          margin-left: 10px;
        }
        .context-text {
          flex: 1;
          .rowText {
            margin-left: 8px;
            margin-bottom: 20px;
          }
        }
      }
      .el-input__inner {
      }
    }
    .el-dialog__footer {
      padding: 0;
    }
    .dialog-footer {
      height: 64px;
      line-height: 64px;
      padding-right: 16px;
      border-top: 1px solid #f0f2f7;
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
</style>