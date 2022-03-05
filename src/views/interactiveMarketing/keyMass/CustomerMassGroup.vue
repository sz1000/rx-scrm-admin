<template>
  <div class="group_warp" v-loading="loading">
    <div class="selectTab">
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" label-position="right">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="6">
            <el-form-item label="任务名称:" prop="name">
              <el-input v-model="ruleForm.taskName" placeholder="请输入任务名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发送时间:">
              <el-date-picker v-model="senddate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeSendDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:">
              <el-date-picker v-model="creator" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeCreatorDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="btnCol">
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="operation flex">
      <div @click="newgroup" class="dispalyblock">
        <el-button class="addBtn pointer">
          <img src="../../../assets/images/icon_add@2x.png" alt="" />
          新增
        </el-button>
      </div>
    </div>
    <div class="tableWarp">
      <el-table :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
        <el-table-column label="编号" type="index" width="60px"></el-table-column>

        <el-table-column prop="taskName" label="任务名称" min-width="120px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sendType" label="发送规则" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.sendType == 1 ? "立即发送" : "定时发送" }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" min-width="120px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" min-width="120px" show-overflow-tooltip />
        <el-table-column prop="massContent" label="群发内容" min-width="120px" show-overflow-tooltip />
        <el-table-column prop="userNum" label="任务发送群主" min-width="120px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="clueNum" label="任务目标群聊" min-width="120px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sendUserNum" label="已发送群主" min-width="120px" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="sendClueNum" label="已发送群聊" min-width="120px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 3"> 待发送</span>
            <span v-if="scope.row.status == 4"> 已发送</span>
            <span v-if="scope.row.status == 2">已取消</span>
            <span v-if="scope.row.status == 1">未取消</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <span @click="particularsClick(scope.$index, scope.row)" class="table_txt">详情</span>
            <!-- ||
                scope.row.status.clueNum == scope.row.status.sendClueNum -->
            <!-- <span
              @click="redactClick(scope.$index, scope.row)"
              class="table_txt"
              v-if="scope.row.status != 2 && scope.row.status != 4"
              >编辑</span
            > -->
            <!-- <span
              @click="redactClick(scope.$index, scope.row)"
              class="table_txt"
              v-if="scope.row.status.clueNum == scope.row.status.sendClueNum"
              >编辑</span
            > -->
            <span @click="remindOpenClick(scope.$index, scope.row)" class="table_txt"
                  v-if="scope.row.status != 2 && scope.row.status != 4">提醒发送</span>
            <span @click="undosend(scope.row)" class="table_txt" v-if="
                scope.row.status != 2 &&
                scope.row.status != 4 &&
                scope.row.sendType != 1
              ">取消发送</span>
          </template>
        </el-table-column>
        <div slot="empty" class="empty" style="padding-top: 100px">
          <img src="../../../assets/images/nodae.png" alt="" style="width: 280px; height: 233px" />
        </div>
      </el-table>
    </div>

    <div class="pagePosition">
      <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
    </div>
  </div>
</template>
<script>
import NoDate from '../../../components/noDate'
import Pagination from '../../../components/elPagination.vue' //分页
import { formatDate } from '../../../utils/tool'
export default {
  components: {
    Pagination,
    NoDate,
  },
  data() {
    return {
      loading: true,
      groupDataList: [],
      imgshow: false,
      ruleForm: {
        // userId: "",
        taskName: '',
        // createTimeSta: "",
        // createTimeEnd: "",
        sendStartTime: '',
        sendEndTime: '',
        createStartTime: '',
        createEndTime: '',
      },
      senddate: [], //发送时间
      creator: [], //创建时间
      groupManager: [],

      tableData: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
    }
  },
  created() {
    this.getTableList()
    // this.getOwmerList();
    // console.log(this.tabeList);
  },
  methods: {
    //   点击新增
    newgroup() {
      this.$router.push({
        // path: "newaddedgroup",
        path: 'NewAddedGroupPlural',
      })
    },
    getOwmerList() {
      this.$network.get('/customer-service/group/getOwmerList').then((res) => {
        this.groupManager = res.data
      })
    },
    // /customer-service/group/list
    getTableList() {
      this.$network
        .get('/customer-service/cluecustomerMass/getCustomerMass', {
          // owmer: this.ruleForm.userId,
          massType: 2,
          ...this.ruleForm,

          ...this.pageInfo,
        })
        .then((res) => {
          if (res.data.list == null) {
            this.tableData = []
            this.imgshow = false
            this.loading = false
          } else {
            this.imgshow = true
            this.loading = false
            let tempList = res.data.list
            console.log(res.data.total)
            tempList.forEach((item) => {
              item.createTime = item.createTime
                ? formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')
                : '-'
              item.sendTime = item.sendTime
                ? formatDate(item.sendTime, 'yyyy-MM-dd hh:mm:ss')
                : '-'
            })
            this.tableData = tempList
            this.total = res.data.total
          }
        })
    },
    //查寻
    submitForm() {
      this.pageInfo.page = 1
      this.getTableList()
    },
    resetForm() {
      this.ruleForm = {}
      this.creator = []
      this.senddate = []
      this.pageInfo.page = 1
      this.getTableList()
    },
    // 发送时间
    changeSendDate(val) {
      console.log(val)
      this.ruleForm.sendStartTime = val[0]
      this.ruleForm.sendEndTime = val[1]
      //   if (val[0] == val[1]) {
      //     this.ruleForm.createTimeSta = val[0] + " 00:00:00";
      //     this.ruleForm.createTimeEnd = val[0] + " 23:59:59";
      //   } else {
      //     this.ruleForm.createTimeSta = val[0];
      //     this.ruleForm.createTimeEnd = val[1];
      //   }
    },
    //创建时间
    changeCreatorDate(val) {
      console.log(val + '-----创建时间')
      this.ruleForm.createStartTime = val[0]
      this.ruleForm.createEndTime = val[1]
      //   if (val[0] == val[1]) {
      //     this.ruleForm.createTimeSta = val[0] + " 00:00:00";
      //     this.ruleForm.createTimeEnd = val[0] + " 23:59:59";
      //   } else {
      //     this.ruleForm.createTimeSta = val[0];
      //     this.ruleForm.createTimeEnd = val[1];
      //   }
    },
    changeGroup(val) {
      console.log(val)
    },
    // 点击详情
    particularsClick(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/interactivemarketing/ParticularsGroupPlural',
        query: { id: row.massNo, menuFlag: true },
      })
    },
    pageChange(item) {
      // console.log('', item)
      this.getTableList()
    },
    //点击发送按钮
    remindOpenClick(index, row) {
      this.$confirm(
        '确认后将会给所有未发送群主发送提醒通知，是否发送？',
        '温馨提示',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          customClass: 'remindicon',
        }
      )
        .then(() => {
          this.$network
            .get('/customer-service/cluecustomerMass/getOneCustomerMass', {
              massNo: row.massNo,
            })
            .then((res) => {
              console.log(res.data)
              let customList = res.data.sendPerson.customerMassGroupEntityList
              if (customList != null) {
                customList.forEach((item) => {
                  this.groupDataList.push(item.chatId)
                  console.log(item)
                })
              }
              console.log(this.groupDataList, '-----this.groupDataList')
              this.$network
                .post('/customer-service/sendGroupMsg/createGroupMag', {
                  massNo: row.massNo,
                  massContent: res.data.massDetail.massContent, //性别
                  taskName: res.data.massDetail.taskName,
                  massType: res.data.massDetail.massType,
                  groupList: this.groupDataList,
                  clueCustomerList: [],
                })
                .then((res) => {
                  // console.log(res);
                  this.$message({
                    type: 'success',
                    message: '提醒成功!',
                  })
                })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提醒',
          })
        })
    },
    // 点击取消发送按钮
    undosend(data) {
      console.log(data, '-------------取消')
      this.$network
        .post(
          `/customer-service/cluecustomerMass/updateIsDelete?massNo=${data.massNo}`,
          {
            // massNo: data.massNo,
          }
        )
        .then((res) => {
          console.log(res)
          if (res.result) {
            this.$message.error('已取消发送')
            this.getTableList()
          }
          // massNo = data.massNo;
        })

      //
    },

    //点击编辑
    redactClick(index, row) {
      console.log(row)
      this.$router.push({
        path: '/detailedOperation/ClientsendPlural',
        query: { id: row.massNo },
      })
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
.dispalyblock {
  display: inline-block;
}
/deep/.el-input__inner {
  line-height: 32px;
}
.group_warp {
  min-height: 500px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  .selectTab {
    /deep/.el-form-item__label {
      padding: 0;
    }
    /deep/.el-form-item__content {
      margin-left: 80px !important;
    }
  }
  .operation {
    justify-content: flex-end;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    margin-bottom: 16px;
    img {
      width: 12px;
      height: 12px;
    }
    .headerlist {
      width: 104px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #d9dae4;
      margin-right: 16px;
    }
    .addBtn {
      width: 76px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      color: #4168f6;
    }
  }
  .tableWarp {
    min-height: 500px;
    /deep/.el-table {
      color: #3c4353;
      &::before {
        width: 0;
      }
      thead {
        color: #3c4353;
        font-size: 14px;
      }
      tr td .cell {
        // overflow: hidden;
        text-overflow: ellipsis;
        // display: -webkit-box;
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
    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
    }
  }
}
// /deep/.el-table__empty-block {
//   display: none !important;
// }
</style>