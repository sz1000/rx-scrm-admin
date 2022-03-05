<template>
  <div class="customWarp">
    <div class="selectTab">
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" label-position="right">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名:">
              <el-input v-model="ruleForm.customerName" placeholder="请输入姓名" maxlength="30">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="原负责人:">
              <el-select v-model="ruleForm.userNo" placeholder="请输入负责人" @change="sourceChange" v-loadmore="loadMore" clearable>
                <el-option v-for="item in optionsCreat" :key="item.value" :label="item.name" :value="item.userNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="新负责人:">
              <el-select v-model="ruleForm.newuserNo" placeholder="请输入负责人" @change="newSourceChange" v-loadmore="loadMore" clearable>
                <el-option v-for="item in optionsCreat" :key="item.value" :label="item.name" :value="item.userNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人:">
              <el-select v-model="ruleForm.operuserNo" placeholder="请输入操作人" @change="operatorChange" v-loadmore="loadMore" clearable>
                <el-option v-for="item in optionsCreat" :key="item.value" :label="item.name" :value="item.userNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row type="flex" :gutter="6">
          <el-col :span="6">
            <el-form-item label="添加时间:">
              <el-date-picker v-model="creatDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接替时间:">
              <el-date-picker v-model="creatDateTake" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeDateTake">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户来源:">
              <el-select v-model="ruleForm.source" placeholder="客户来源" @change="groupChange" clearable>
                <el-option v-for="item in optionsSource" :key="item.value" :label="item.name" :value="item.corpId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户阶段:">
              <el-select v-model="ruleForm.stage" placeholder="客户阶段" @change="stageChange" clearable>
                <el-option v-for="item in optionsStage" :key="item.value" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8" class="btnCol">
            <el-form-item>
              <el-button type="primary" @click="submitForm()" class="but_click">查询</el-button>
              <el-button @click="resetForm()" class="but_hove">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="tableWarp" v-loading="loading">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF'}">

        <el-table-column label="编号" width="60px" type="index">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="customerName" label="企业简称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="corpName" label="公司简称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sourceName" label="客户来源" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="stage" label="客户阶段" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="addTime" label="添加时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="oldUserName" label="原负责人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="newUserName" label="新负责人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="takeoverTime" label="接替时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row">接替完毕</span>

          </template>
        </el-table-column>
        <el-table-column prop="createName" label="操作人" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <NoDate v-if="!tableData.length"></NoDate>
    </div>

    <div v-if="showImport">
      <!--  @datalsit="datalsit" -->
      <ImportDialog :importVisible="showImport" :listdata="multipleSelection" @closeImport="closeImport" type="3"></ImportDialog>
    </div>
    <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
  </div>
</template>
<script>
import { BASE_URL } from '../../../config/app.js'
import NoDate from '../../../components/noDate'
import axios from 'axios'
// import Pagination from "../../../components/elPagination.vue";
import Pagination from '../../../components/elPagination.vue'
import ImportDialog from '../component/allocation.vue'
import { formatDate } from '../../../utils/tool'

import {
  inJobTransferCustomer_getAllotCustomerHistory,
  inJobTransferCustomer_getUserList,
  common_getlist,
} from '../../../api/customer'

export default {
  components: {
    Pagination,
    ImportDialog,
    NoDate,
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
  },
  data() {
    return {
      type: '3',
      ruleForm: {
        source: '',
        customName: '',
        createTimeSta: '',
        createTimeEnd: '',
        createTakeTimeSta: '',
        createTakeTimeEnd: '',
        userNo: '',
        stage: '',
        newuserNo: '',
        operuserNo: '',
      },
      creatDate: [],
      creatDateTake: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 10,
      },
      optionsSource: [],
      optionsStage: [],
      options: [],
      optionsCreat: [],
      multipleSelection: [],
      tableLabel: [],
      filterList: null,
      tableData: [],
      addCule: false,
      culeDetail: false,
      loading: false,
      showImport: false,
      BASE_URL,
      groupPage: 1,
      grouplimit: 10,
    }
  },
  created() {
    this.getList()
    this.CustomerMass()
    this.customerSource()
    // this.customerStage()
    // console.log(this.corpId,"---")
  },
  mounted() {
    // this.customerStage()
  },
  methods: {
    loadMore() {
      console.log(111)

      this.groupPage++
      this.CustomerMass()
    },
    //负责人
    CustomerMass() {
      let obj = {
        page: this.groupPage,
        limit: this.grouplimit,
      }
      inJobTransferCustomer_getUserList(obj).then((res) => {
        if (res.result) {
          if (res.data.records == []) {
          } else {
            let tempList = res.data.records
            let cent = this.optionsCreat.concat(tempList)
            console.log(this.optionsCreat.concat(tempList))
            this.optionsCreat = cent
          }
          console.log(res)
        }
      })
    },
    //客户来源
    customerSource() {
      let obj = {
        parentId: 1,
        corpId: this.corpId,
      }
      common_getlist(obj).then((res) => {
        if (res.result) {
          console.log(res, '客户来源')
          this.optionsSource = res.data
          this.customerStage()
        }
      })
    },
    //客户阶段
    customerStage() {
      let obj = {
        type: 'stage',
        corpId: this.corpId,
      }
      common_getlist(obj).then((res) => {
        if (res.result) {
          console.log(res, '客户阶段')
          this.optionsStage = res.data
        }
      })
    },

    // 列表数据
    getList() {
      let obj = {
        corpId: this.corpId,
        addStartTime: this.ruleForm.createTimeSta,
        addEndTime: this.ruleForm.createTimeEnd,
        createStartTime: this.ruleForm.createTakeTimeSta,
        creatEndTime: this.ruleForm.createTakeTimeEnd,
        limit: this.pageInfo.limit,
        name: this.ruleForm.customerName,
        page: this.pageInfo.page,
        source: this.ruleForm.source,
        stage: this.ruleForm.stage,
        oldUserNo: this.ruleForm.userNo,
        newUserNo: this.ruleForm.newuserNo,
        createBy: this.ruleForm.operuserNo,
        type: 1,
      }
      inJobTransferCustomer_getAllotCustomerHistory(obj).then((res) => {
        if (res.result) {
          this.total = res.data.total
          console.log(res, '0000')
          this.tableData = res.data.records
        }
      })
    },

    //

    groupChange(val) {
      this.ruleForm.source = val
    },
    stageChange(val) {
      this.ruleForm.stage = val
    },
    labelHead(h, { column, index }) {
      let l = column.label.length
      let f = 14
      column.minWidth = f * (l + 1)
      return h('div', { class: 'table-head', style: { width: '100%' } }, [
        column.label,
      ])
    },

    filterChange(data) {
      console.log(data)
      let a = Object.keys(data)[0]
      let b = data[Object.keys(data)[0]][0]
      console.log(a, b)
      console.log(this.tableData)
      let list = JSON.parse(JSON.stringify(this.tableData))
      let s = list.map((item) => {
        console.log(item[a])
        if (item[a] == b) {
          console.log(item)
          return item
        }
      })
      this.tableData = s
      console.log(this.tableData)
    },
    filterHandler(value, row, column) {
      // console.log('=====>>>>>>>>>', value, row, column)
      const property = column['property']
      return row[property] === value
    },
    userChange() {},
    sourceChange(val) {
      console.log(val)
      this.ruleForm.userNo
    },
    newSourceChange(val) {
      console.log(val)
      this.ruleForm.newuserNo
    },
    operatorChange(val) {
      console.log(val)
      this.ruleForm.operuserNo
    },
    changeDate(val) {
      if (val[0] == val[1]) {
        this.ruleForm.createTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTimeEnd = val[0] + ' 23:59:59'
      } else {
        this.ruleForm.createTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTimeEnd = val[1] + ' 23:59:59'
      }
    },
    changeDateTake(val) {
      if (val[0] == val[1]) {
        this.ruleForm.createTakeTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTakeTimeSta = val[0] + ' 23:59:59'
      } else {
        this.ruleForm.createTakeTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTakeTimeSta = val[1] + ' 23:59:59'
      }
    },

    submitForm() {
      this.pageInfo.page = 1
      this.getList()
    },
    resetForm() {
      this.ruleForm = {}
      this.creatDate = []
      this.creatDateTake = []
      this.getList()
    },

    pageChange(item) {
      console.log('', item)
      this.getList()
    },

    closeAddCule() {
      this.addCule = false
      this.getList()
    },

    closeculeDetail() {
      this.culeDetail = false
    },

    closeImport(v) {
      if (v == 1) {
        console.log('hjkahdkahdhsak')
      }
      this.showImport = false
    },

    datalsit(el) {
      // this.multipleSelection = [];
      // this.getList()
      console.log(el, '子组件传回的值')
      // //  this.multipleSelection= el;
      console.log(this.multipleSelection, '-------')
      //           this.$nextTick(() => {
      //         this.$refs.multipleTable.clearSelection()
      //       for (let i = 0; i < this.tableData.length; i++) {
      //          el.forEach(item =>{
      //            if(this.tableData[i].id == item.id){
      //               // this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true)
      //               this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true)
      //            }
      //          })
      //
      //       }
      //     })
    },
    // toggleSelection() {
    //   this.multipleSelection.forEach(row => {
    // this.$refs.multipleTable.toggleRowSelection( ,true); });
    // }
  },
}
</script>
<style>
.el-tooltip__popper {
  max-width: 500px !important;
}
</style>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
.customWarp {
  min-height: 812px;
  background: #ffffff;
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
      // width: 76px;
      padding: 0 16px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      color: #4168f6;
    }
    .export {
      margin-right: 16px;
      margin-left: 0;
    }
    .tongbu {
      margin-left: 0;
      width: 104px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      margin-right: 16px;
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
        font-family: PingFangSC-Medium;
        font-size: 14px;
        .cell {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;
          .el-table__column-filter-trigger {
            position: absolute;
            top: -5px;
            right: 0;
          }
        }
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
    }
    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
    }
  }
  // .pagePosition {
  //   position: absolute;
  //   bottom: 0;
  // }
}
</style>
