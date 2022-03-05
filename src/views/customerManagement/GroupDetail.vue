<template>
  <div class="group_detail">
    <div class="goback pointer">
      <div class="back_area" @click="goback">
        <img src="../../assets/images/goback.png" alt="" /> 返回
      </div>
    </div>
    <div class="main_content">
      <div class="topHeader">
        <div class="left">
          <div class="top">
            <div class="groupName">
              <div class="groupLogo">群</div>
              <div>
                <div class="titleName">{{ titleName }}</div>
                <div class="groupInfo">
                  <span>群主:{{ groupManage }}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span>共{{ peopleNum }}位群成员</span>
                </div>
              </div>
            </div>
            <!-- <div class="addBtn pointer"
                 @click="synchronous">
              <img src="../../assets/images/bgwhite.png"
                   alt="" />
              同步
            </div> -->
          </div>
          <div class="bottom">
            <div class="box">
              <span>{{ totality }}</span>
              <span>总人数</span>
            </div>
            <div class="box">
              <span>{{ todayAdd }}</span>
              <span>今日新增</span>
            </div>
            <!-- <div class="box">
              <span>{{subtract}}</span>
              <span>今日退群</span>
            </div> -->
          </div>
        </div>
        <div class="right">
          <div class="notice">群公告</div>
          <div>{{ notice }}</div>
        </div>
      </div>
      <div class="bottomTable">
        <el-table style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
          <el-table-column label="编号" type="index" width="90"></el-table-column>
          <el-table-column v-for="(item, index) in tableLabel" :key="index" :prop="item.prop" :label="item.label">
          </el-table-column>
          <!-- <el-table-column fixed="right"
                           label="操作"
                           width='120'>
            <template slot-scope="scope">
              <span @click="handleClick(scope.$index, scope.row)"
                    class="table_txt">详情</span>
            </template>
          </el-table-column> -->
        </el-table>
        <NoDate v-if="!tableData.length"></NoDate>
      </div>
      <div class="pagePosition">
        <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '../../components/elPagination.vue'
import NoDate from '../../components/noDate'
import { formatDate } from '../../utils/tool'
import {
  group_getGroupDetail,
  group_getGroupUserPage,
  group_syncGroupDetail,
} from '@/api/customer'
export default {
  components: {
    NoDate,
    Pagination,
  },
  data() {
    return {
      titleName: '',
      groupManage: '',
      notice: '',
      peopleNum: '',
      totality: '',
      todayAdd: '',
      subtract: '',
      tableData: [],
      tableLabel: [
        { label: '全部成员', prop: 'showName' },
        { label: '类型', prop: 'type' },
        { label: '入群时间', prop: 'joinTime' },
        { label: '入群方式', prop: 'joinScene' },
        { label: '邀请员工', prop: 'invitorName' },
      ],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
    }
  },
  created() {
    this.getTopData()
    this.getList()
  },
  methods: {
    getTopData() {
      let obj = {
        chatId: this.$route.query.chatId,
      }
      group_getGroupDetail(obj).then((res) => {
        if (res.result) {
          this.titleName = res.data.name
          this.groupManage = res.data.owmerName
          this.peopleNum = res.data.usersum
          this.totality = res.data.usersum
          this.todayAdd = res.data.joinsum
          this.subtract = res.data.leavesum
          this.notice = res.data.notice
        }
      })
    },
    getList() {
      let obj = {
        chatId: this.$route.query.chatId,
        ...this.pageInfo,
      }
      group_getGroupUserPage(obj).then((res) => {
        if (res.result) {
          let tempList = res.data.data.records
          tempList.forEach((item) => {
            item.joinTime = item.joinTime
              ? formatDate(item.joinTime, 'yyyy-MM-dd hh:mm:ss')
              : '-'
            item.type = item.type == '1' ? '企业成员' : '外部联系人'
            if (item.joinScene == '1') {
              item.joinScene = '直接邀请入群'
            } else if (item.joinScene == '2') {
              item.joinScene = '通过邀请链接入群'
            } else {
              item.joinScene = '通过扫描群二维码入群'
            }
            item.showName = item.showName ? item.showName : item.name
          })
          this.tableData = tempList
          this.total = res.data.data.total
        }
      })
    },
    goback() {
      this.$router.go(-1)
    },
    synchronous() {
      let obj = {
        chatId: this.$route.query.chatId,
      }
      group_syncGroupDetail(obj).then((res) => {
        if (res.result) {
          this.$message({
            type: 'success',
            message: '同步成功',
          })
          this.getList()
        }
      })
    },
    pageChange(item) {
      console.log('', item)
      this.getList()
    },
  },
}
</script>
<style lang="less" scoped>
.group_detail {
  .goback {
    margin: 0 0 16px 0;
    color: #4168f6;
    font-family: 600;
    .back_area {
      width: 100px;
    }
    img {
      width: 8px;
      height: 12px;
      vertical-align: middle;
    }
  }
  .main_content {
    height: 774px;
    background: #ffffff;
    border-radius: 8px;
    .topHeader {
      padding: 16px;
      height: 217px;
      display: flex;
      justify-content: space-between;
      .left {
        width: 719px;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .groupName {
            display: flex;
            .groupLogo {
              margin-right: 16px;
              width: 60px;
              height: 60px;
              background: #4168f6;
              border-radius: 8px;
              text-align: center;
              line-height: 60px;
              color: #fff;
              font-size: 24px;
            }
            .titleName {
              font-size: 24px;
              font-weight: 600;
              color: #3c4353;
            }
            .groupInfo {
              margin-top: 7px;
              font-size: 14px;
              font-weight: 400;
              color: #838a9d;
            }
          }
          .addBtn {
            line-height: 32px;
            text-align: center;
            font-size: 14px;
            width: 76px;
            height: 32px;
            color: #fff;
            border-radius: 4px;
            border: 1px solid #4168f6;
            background: #4168f6;
            img {
              width: 12px;
              height: 12px;
            }
          }
        }
        .bottom {
          margin-top: 17px;
          display: flex;
          // justify-content: space-between;
          .box {
            margin-right: 40px;
            width: 229px;
            height: 108px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #d9dae4;
            text-align: center;
            padding-top: 23px;
            span {
              display: block;
            }
            span:nth-child(1) {
              margin-bottom: 7px;
              color: #4168f6;
              font-size: 24px;
              font-weight: 600;
            }
            span:nth-child(2) {
              font-size: 14px;
              font-weight: 400;
              color: #3c4353;
            }
          }
        }
      }
      .right {
        width: 461px;
        height: 185px;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #d9dae4;
        margin-left: 16px;
        padding: 16px;
        overflow-y: scroll;
        .notice {
          font-size: 14px;
          font-weight: 600;
          color: #3c4353;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            width: 4px;
            height: 14px;
            background: #4168f6;
            left: -7px;
            top: 3px;
          }
        }
      }
    }
    .bottomTable {
      padding: 16px;
      min-height: 500px;
      /deep/.el-table {
        tr td .cell {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1; /*可以显示的行数，超出部分用...表示 */
          -webkit-box-orient: vertical;
        }
        .el-table__fixed-right::before,
        .el-table__fixed::before {
          background: #fff;
        }

        &::before {
          background: #fff;
        }
        .el-tooltip__popper {
          max-width: 20%;
        }
      }
    }
  }
  /deep/.el-table__empty-block {
    display: none !important;
  }
}
</style>