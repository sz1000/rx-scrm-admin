<template>
  <div class="group_warp">
    <div class="selectTab">
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" label-position="right">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="6">
            <el-form-item label="群主:">
              <el-select v-model="ruleForm.userId" placeholder="请选择群主" @change="changeGroup" clearable>
                <el-option v-for="item in groupManager" :key="item.value" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="群名称:" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入要搜索的群名称" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:">
              <el-date-picker v-model="creatDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="btnCol">
            <el-button type="primary" @click="submitForm()" class="but_click">查询</el-button>
            <el-button @click="resetForm()" class="but_hove">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="operation flex">
      <el-button class="addBtn pointer" @click="synchronous" v-preventReClick>
        <img src="../../assets/images/icon_tongbu@2x.png" alt="" />
        同步
      </el-button>
    </div>
    <div class="tableWarp" v-loading='loading'>
      <el-table style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
        <el-table-column label="编号" width="60px" type="index"></el-table-column>
        <el-table-column v-for="(item, index) in tableLabel" :key="index" :prop="item.prop" :label="item.label" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <span @click="handleClick(scope.$index, scope.row)" class="table_txt">详情</span>
          </template>
        </el-table-column>
      </el-table>
      <NoDate v-if="!tableData.length"></NoDate>
    </div>
    <div class="pagePosition">
      <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
    </div>
  </div>
</template>
<script>
import Pagination from '../../components/elPagination.vue'
import NoDate from '../../components/noDate'
import { formatDate } from '../../utils/tool'
import MyMixin from '../../mixins/permissions'
import {
  group_getOwmerList,
  group_list,
  group_syncGroupList,
} from '@/api/customer'
export default {
  components: {
    NoDate,
    Pagination,
  },
  mixins: [MyMixin],
  data() {
    return {
      ruleForm: {
        userId: '',
        name: '',
        createTimeSta: '',
        createTimeEnd: '',
      },
      creatDate: [],
      groupManager: [],
      tableLabel: [
        { label: '群名称', prop: 'name' },
        { label: '群主', prop: 'owmerName' },
        { label: '群人数', prop: 'usersum' },
        { label: '当日入群', prop: 'joinsum' },
        // { label: '当日退群', prop: 'leavesum' },
        { label: '创建时间', prop: 'createTime' },
        { label: '群ID', prop: 'chatId' },
      ],
      tableData: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      loading: false,
    }
  },
  created() {
    this.getTableList()
    this.getOwmerList()
  },
  methods: {
    getOwmerList() {
      group_getOwmerList().then((res) => {
        if (res.result) {
          this.groupManager = res.data
        }
      })
    },
    getTableList() {
      let obj = {
        owmer: this.ruleForm.userId,
        ...this.ruleForm,
        ...this.pageInfo,
      }
      group_list(obj).then((res) => {
        if (res.result) {
          let tempList = res.data.groupEntityPage.records
          tempList.forEach((item) => {
            item.createTime = item.createTime
              ? formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')
              : '-'
          })
          this.tableData = tempList
          this.total = res.data.groupEntityPage.total
        }
      })
    },
    submitForm() {
      this.pageInfo.page = 1
      this.getTableList()
    },
    resetForm() {
      this.ruleForm = {}
      this.creatDate = []
      this.getTableList()
    },
    changeDate(val) {
      this.ruleForm.createTimeSta = val[0] + ' 00:00:00'
      this.ruleForm.createTimeEnd = val[1] + ' 23:59:59'
      // if (val[0] == val[1]) {
      // } else {
      //   this.ruleForm.createTimeSta = val[0]
      //   this.ruleForm.createTimeEnd = val[1]
      // }
    },
    changeGroup(val) {
      console.log(val)
    },
    synchronous() {
      group_syncGroupList().then((res) => {
        if (res.result) {
          this.$message({
            type: 'success',
            message: '同步成功',
          })
          this.getTableList()
        }
      })
    },
    handleClick(index, row) {
      console.log(row)
      this.$router.push({
        path: './groupDetail',
        query: { menuFlag: true, chatId: row.chatId },
      })
    },
    pageChange(item) {
      // console.log('', item)
      this.getTableList()
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
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
    /deep/.el-table tbody tr:hover > td {
      background-color: #f4f6fe;
    }
    /deep/.el-table {
      color: #3c4353;
      &::before {
        width: 0;
      }
      thead {
        color: #3c4353;
        font-size: 14px;
      }
      // tr td .cell {
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   display: -webkit-box;
      //   -webkit-line-clamp: 1; /*可以显示的行数，超出部分用...表示 */
      //   -webkit-box-orient: vertical;
      // }
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
/deep/.el-table__empty-block {
  display: none !important;
}
</style>