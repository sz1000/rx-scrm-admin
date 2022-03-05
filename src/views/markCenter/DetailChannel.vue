<template>
  <div class="edit_dialog">
    <el-dialog title="渠道详情" :visible.sync="channelVisible" :before-close="dialogFormCancel" :close-on-click-modal="false" width="736px">
      <div class="basicInfo">基本信息:</div>
      <div class="rowStyle">
        <div class="left_con">
          <span class="item_name">渠道名称:</span>
          <span>{{ channelName }}</span>
        </div>
        <div class="right_con">
          <span class="item_name">对应活码数:</span>
          <span>{{ livecodeSum }}</span>
          <!-- <img src="../../assets/logo.png"
               alt=""
               style="width:60px;height:60px" /> -->
        </div>
      </div>
      <div class="rowStyle">
        <div class="left_con">
          <span class="item_name">添加客户数:</span>
          <span>{{ channelNum }}</span>
        </div>
        <div class="right_con">
          <span class="item_name">客户最近添加时间:</span>
          <span>{{ date }}</span>
        </div>
      </div>
      <div class="rowStyle">
        <div class="left_con">
          <span class="item_name">渠道创建人:</span>
          <span>{{ createBy }}</span>
        </div>
        <div class="right_con">
          <span class="item_name">渠道欢迎语:</span>
          <span class="item_value">{{ welText }}</span>
        </div>
      </div>
      <div class="customInfo">客户信息</div>
      <div class="customTable">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" height="270" :header-cell-style="{ background: '#FAFBFF' }">
          <el-table-column prop="name" label="姓名"> </el-table-column>
          <el-table-column prop="weixin" label="微信账号"> </el-table-column>
          <el-table-column prop="cropFullName" label="所在企业">
          </el-table-column>
          <el-table-column prop="position" label="职务"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormCancel">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from '../../utils/tool'
export default {
  props: {
    channelVisible: {
      type: Boolean,
    },
    rowDate: {
      type: Object,
    },
  },

  data() {
    return {
      channelName: '',
      channelNum: '',
      livecodeSum: '',
      createBy: '',
      date: '',
      welText: '',
      tableData: [],
    }
  },
  created() {
    // console.log('--12313----', this.rowDate, this.channelVisible)
    this.getDetailData()
  },
  methods: {
    getDetailData() {
      this.$network
        .get('/user-service/channel/getChannelById', { id: this.rowDate.id })
        .then((res) => {
          this.channelName = res.data.channelEntity.name
          this.livecodeSum = res.data.channelEntity.livecodeSum
          this.channelNum = res.data.channelEntity.cusSum
          this.createBy = res.data.channelEntity.createBy
          this.date = res.data.channelEntity.createTime
            ? formatDate(
                res.data.channelEntity.createTime,
                'yyyy-MM-dd hh:mm:ss'
              )
            : '-'
          this.welText = res.data.channelEntity.welText
          this.tableData = res.data.list
        })
    },
    dialogFormCancel() {
      this.$emit('closeChannel')
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
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
      height: 556px;
      overflow-y: scroll;
      .basicInfo {
        font-size: 14px;
        font-weight: 600;
        color: #3c4353;
      }
      .rowStyle {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        font-size: 14px;
        font-weight: 400;
        color: #3c4353;
        .left_con {
          .item_name {
            vertical-align: top;
            margin-right: 8px;
            display: inline-block;
          }
        }
        .right_con {
          width: 300px;
          .item_name {
            vertical-align: top;
            margin-right: 8px;
            display: inline-block;
          }
          .item_value {
          }
        }
      }
      .customInfo {
        font-size: 14px;
        font-weight: 600;
        color: #3c4353;
        margin-top: 32px;
        margin-bottom: 8px;
      }
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
</style>
