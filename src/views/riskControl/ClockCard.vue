<template>
  <div class="clock_deatil">
    <div class="goback pointer" @click="goback">
      <img src="../../assets/images/goback.png" alt="" /> 返回
    </div>
    <div class="main_content">
      <div class="nav-title">打卡记录</div>
      <div class="flex particulars">
        <div class="msg-box">
          <div class="item-style left-span">
            <span>日期:</span>
            <span>{{ nowDate }}</span>
          </div>
          <div class="item-style left-span">
            <span>员工姓名:</span>
            <span>{{ name }}</span>
          </div>
          <div class="item-style left-span">
            <span>性别:</span>
            <span>{{ gender }}</span>
          </div>
        </div>
        <div class="msg-box">
          <div class="item-style mid-span">
            <span>部门:</span>
            <span>{{ dept }}</span>
          </div>
          <div class="item-style mid-span">
            <span>职务:</span>
            <span>{{ position }}</span>
          </div>
          <div class="item-style mid-span">
            <span>打卡次数:</span>
            <span>{{ punckNum }}</span>
          </div>
        </div>
        <div class="msg-box">
          <div class="item-style right-span">
            <span>拜访已有客户数:</span>
            <span>{{ visitOldCustomerNum }}</span>
          </div>
          <div class="item-style right-span">
            <span>拜访新客数:</span>
            <span>{{ num }}</span>
          </div>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" :header-cell-style="{ background: '#FAFBFF' }" style="width: 100%">
          <el-table-column type="index" label="编号" width="60px">
          </el-table-column>
          <el-table-column label="打卡时间" min-width="90" show-overflow-tooltip>
            <template slot-scope="scoped">
              {{ formatDate(scoped.row.punchTime, "yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="punchPlace" label="打卡地址" min-width="90" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="客户类型" min-width="90">
            <template slot-scope="scoped">
              {{
                scoped.row.customerType && scoped.row.customerType == 2
                  ? "新客户"
                  : "已有客户"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="customerNames" label="企业简称" min-width="90">
          </el-table-column>
          <el-table-column label="联系人" prop="clueCustomerName" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="customerPlace" label="客户地址" show-overflow-tooltip min-width="90">
          </el-table-column>
          <el-table-column prop="content" label="备注" min-width="90" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="打卡图片" min-width="90" class-name="img-box">
            <template slot-scope="scope">
              <img :src="scope.row.ossUrl" alt="" style="width: 60px; height: 60px" />
              <span class="table_txt" @click="preview(scope.$index, scope.row)">预览</span>
            </template>
          </el-table-column>
          <div slot="empty" class="empty" style="padding-top: 100px">
            <img src="../../assets/images/nodae.png" alt="" style="width: 280px; height: 233px" />
          </div>
        </el-table>
      </div>
      <div class="page-warp">
        <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
      </div>
    </div>
    <div v-if="dialogVisible">
      <el-dialog title="图片预览" :close-on-click-modal="false" :visible.sync="dialogVisible" width="520px" :before-close="handleClose">
        <div class="img-view">
          <img :src="imgUrl" alt="" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Pagination from '../../components/elPagination'
import { formatDate } from '../../utils/tool'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      nowDate: '',
      name: '',
      gender: '',
      dept: '',
      position: '',
      punckNum: '',
      visitOldCustomerNum: '',
      num: '',
      tableData: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      imgUrl: '',
      dialogVisible: false,
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    formatDate,
    getDetail() {
      // let date = this.formatDate(
      //   this.$route.query.dateNow,
      //   'yyyy-MM-dd hh:mm:ss'
      // )
      let params = {
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        userNo: this.$route.query.userNo,
        dateNow: this.$route.query.dateNow,
      }
      this.$network
        .get('/user-service/punckClock/getOnePunckClock', params)
        .then((res) => {
          if (res.data) {
            this.nowDate = this.formatDate(
              res.data.punchClockVo.dateNow,
              'yyyy-MM-dd'
            )
            this.name = res.data.punchClockVo.name
            this.dept = res.data.punchClockVo.departments
            this.position = res.data.punchClockVo.position
            this.punckNum = res.data.punchClockVo.punckNum
            this.visitOldCustomerNum = res.data.punchClockVo.visitOldCustomerNum
            this.num = res.data.punchClockVo.visitNewCustomerNum
            if (res.data.punchClockVo.gender == 0) {
              this.gender = '未知'
            } else if (res.data.punchClockVo.gender == 1) {
              this.gender = '男'
            } else {
              this.gender = '女'
            }
            this.tableData = res.data.plist
            this.total = res.data.total
          }
        })
    },
    goback() {
      this.$router.go(-1)
    },
    pageChange(item) {
      // console.log('', item)
      this.getDetail()
    },
    handleClose() {
      this.dialogVisible = false
    },
    preview(index, row) {
      // console.log(row)
      this.dialogVisible = true
      this.imgUrl = row.ossUrl
    },
  },
}
</script>
<style lang="less" scoped>
.clock_deatil {
  .goback {
    margin: 0 0 16px 0;
    color: #4168f6;
    font-family: 600;
    img {
      width: 8px;
      height: 12px;
      vertical-align: -3%;
    }
  }
  .main_content {
    min-height: 774px;
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 16px 60px;
    position: relative;
    .nav-title {
      font-size: 14px;
      color: #3c4353;
      letter-spacing: 0;
      font-weight: 500;
      padding-left: 8px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 3px;
        width: 2px;
        height: 14px;
        background: #4168f6;
      }
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -8px;
        width: 100%;
        height: 1px;
        background: #f0f2f7;
      }
    }
    .particulars {
      .msg-box {
        font-size: 14px;
        color: #3c4353;
        letter-spacing: 0;
        font-weight: 400;
        // display: flex;
        margin-top: 24px;
        margin-right: 86px;
        .item-style {
          margin-bottom: 16px;
          span {
            display: inline-block;
          }
        }
        .left-span {
          span:nth-child(1) {
            width: 65px;
            text-align: right;
            margin-right: 8px;
          }
        }
        .mid-span {
          span:nth-child(1) {
            width: 65px;
            text-align: right;
            margin-right: 8px;
          }
        }
        .right-span {
          span:nth-child(1) {
            width: 110px;
            text-align: right;
            margin-right: 8px;
          }
        }
      }
    }
    .table-content {
      /deep/.el-table thead {
        color: #3c4353;
        font-size: 14px;
      }
      .el-table {
        color: #3c4353;
        &::before {
          width: 0;
        }
        .table_txt {
          display: block;
          color: #4168f6;
          margin-right: 8px;
          padding-left: 16px;
          cursor: pointer;
        }
      }
      .img-box {
      }
    }
    .page-warp {
      position: absolute;
      right: 16px;
      bottom: 16px;
    }
  }
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
      height: 385px;
      overflow-y: scroll;
      .img-view {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        img {
          display: block;
          width: 300px;
          margin: 0 auto;
        }
      }
    }
    .el-form-item {
      margin-bottom: 20px;
      height: 32px;
    }
    .el-form-item__content {
      line-height: 32px;
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
    .el-input__inner {
      width: 404px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
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
<style>
.el-tooltip__popper {
  max-width: 500px !important;
}
</style>