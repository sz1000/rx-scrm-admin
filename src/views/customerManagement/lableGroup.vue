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
            <el-form-item label="创建时间:">
              <el-date-picker v-model="creator" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeCreatorDate" :picker-options="pickerOptions">
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
    <!--    v-show="expandedKeys.some((item) => item.enName == 'add')" -->
    <div class="operation flex">
      <div @click="newgroup" class="dispalyblock">
        <el-button class="addBtn pointer">
          <img src="../../assets/images/icon_add@2x.png" alt="" />
          新增
        </el-button>
      </div>
    </div>
    <div class="tableWarp">
      <el-table :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
        <el-table-column label="编号" type="index" width="60px"></el-table-column>

        <el-table-column prop="taskName" label="任务名称" min-width="120px" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" min-width="120px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userNum" label="任务发送成员" min-width="120px" show-overflow-tooltip />
        <el-table-column prop="clueNum" label="任务目标客户" min-width="120px" show-overflow-tooltip />
        <el-table-column prop="sendUserNum" label="已发送成员" width="120px" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="sendClueNum" label="已发送客户" min-width="120px" show-overflow-tooltip>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <span @click="particularsClick(scope.$index, scope.row)" class="table_txt">详情</span>
          </template>
        </el-table-column>
        <div slot="empty" class="empty" style="padding-top: 100px">
          <img src="../../assets/images/nodae.png" alt="" style="width: 280px; height: 233px" />
        </div>
      </el-table>
    </div>
    <!-- <NoDate v-if="imgshow == false"></NoDate> -->
    <div class="pagePosition">
      <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
    </div>
  </div>
</template>
<script>
// import NoDate from "../../components/noDate";
import MyMixin from '../../mixins/permissions'
import Pagination from '../../components/elPagination.vue' //分页
import { formatDate } from '../../utils/tool'
import {
  group_getOwmerList,
  tagEstablishGroup_getTagCustomerMass,
  cluecustomerMass_updateIsDelete,
} from '@/api/customer'
export default {
  components: {
    Pagination,
  },
  mixins: [MyMixin],
  data() {
    return {
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
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
      groupDataList: [],
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    //   点击新增
    newgroup() {
      this.$router.push({
        path: './lableGroupDetails',
      })
    },
    getOwmerList() {
      group_getOwmerList().then((res) => {
        if (res.result) {
          this.groupManager = res.data
        }
      })
    },
    getTableList() {
      let obj = {
        massType: null,
        ...this.ruleForm,
        ...this.pageInfo,
      }
      tagEstablishGroup_getTagCustomerMass(obj).then((res) => {
        if (res.result) {
          if (res.data.list == null) {
            this.tableData = []
            this.imgshow = false
          } else {
            this.imgshow = true
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
    //创建时间
    changeCreatorDate(val) {
      console.log(val + '-----创建时间')
      this.ruleForm.createStartTime = val[0] + ' 00:00:00'
      this.ruleForm.createEndTime = val[1] + ' 23:59:59'
    },
    changeGroup(val) {
      console.log(val)
    },
    // 点击详情
    particularsClick(index, row) {
      console.log(index, row)
      this.$router.push({
        path: './lableGroupProp',
        query: { id: row.massNo },
      })
    },
    pageChange(item) {
      // console.log('', item)
      this.getTableList()
    },
    // 点击取消发送按钮
    undosend(data) {
      console.log(data, '-------------取消')
      cluecustomerMass_updateIsDelete(data.massNo).then((res) => {
        if (res.result) {
          if (res.result) {
            this.$message.error('已取消发送')
            this.getTableList()
          }
        }
      })
    },

    //点击编辑
    redactClick(index, row) {
      console.log(row)
      this.$router.push({
        path: '/interactiveMarketing/Clientsend',
        query: { id: row.massNo },
      })
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
/deep/.el-input__inner {
  line-height: 32px !important;
}
.dispalyblock {
  display: inline-block;
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
</style>