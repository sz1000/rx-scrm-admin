<template>
  <div class="customWarp">
    <div class="warp_box">
       <div class="left">
            <tree-box  ref="treeBox" headerTitle="员工列表" :comeFrom="1" :checkedList="checkedList"></tree-box>
       </div>
  
        <div class="right">
         <div class="selectTab">
           
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" label-position="right">
        <el-row type="flex"  :gutter="24">
              <el-col :span="8">
                <el-form-item label="姓名:">
                  <el-input v-model="ruleForm.customerName" placeholder="请输入姓名" maxlength="30">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负责人:">
                  <el-select v-model="ruleForm.userNo" placeholder="请输入负责人" @change="sourceChange" v-loadmore="loadMore" clearable>
                    <el-option v-for="item in optionsCreat" :key="item.value" :label="item.name" :value="item.userNo">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="添加时间:">
                  <el-date-picker v-model="creatDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                                  value-format="yyyy-MM-dd" @change="changeDate">
                  </el-date-picker>
                </el-form-item>
              </el-col>
        </el-row>
        <el-row type="flex" :gutter="24">
               <el-col :span="8">
            <el-form-item label="客户来源:">
              <el-select v-model="ruleForm.source" placeholder="客户来源" @change="groupChange" clearable>
                <el-option v-for="item in optionsSource" :key="item.value" :label="item.name" :value="item.type">
                </el-option>
              </el-select>
            </el-form-item>
               </el-col>
              <el-col :span="8">
                <el-form-item label="客户阶段:">
                  <el-select v-model="ruleForm.stage" placeholder="客户阶段" @change="stageChange" clearable>
                    <el-option v-for="item in optionsStage" :key="item.value" :label="item.name" :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态:">
                  <el-select placeholder="请选择状态" @change="stateChange" clearable v-model="ruleForm.state">
                    <el-option label="全部" value="1"></el-option>
                    <el-option label="接替中" value="2"></el-option>
                    <el-option label="待接替" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
          <!-- <el-col :span="8" class="btnCol">
            <el-form-item>
              <el-button type="primary" @click="submitForm()" class="but_click">查询</el-button>
              <el-button @click="resetForm()" class="but_hove">重置</el-button>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
         </div>
         <div class="operation flex">
      <!-- <el-button
        class="addBtn pointer tongbu"
        @click="uploadList"
        v-preventReClick
      >
        <img src="../../../assets/images/icon_tongbu@2x.png" alt="" />
        同步客户
      </el-button> -->

      <el-button class="addBtn pointer export" @click="importExcel">
        <img src="../../../assets/images/icon_share2.png" alt="" />
        分配
      </el-button>
         </div>
         <div class="tableWarp" v-loading="loading">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"  :row-key="getRowKey"
                :header-cell-style="{ background: '#FAFBFF' }" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="isDisableFun" :reserve-selection="true" width="55" v-model="checkbox">

        </el-table-column>
        <el-table-column label="编号" width="60px" type="index">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="customerName" label="企业简称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="cropFullName" label="公司简称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="stage" label="客户阶段" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sourceName" label="客户来源" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userName" label="负责人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">接替完毕</span>
            <span v-if="scope.row.status == 2">接替中</span>
            <span v-if="scope.row.status == 3">待接替</span>
          </template>
        </el-table-column>
      </el-table>
      <NoDate v-if="!tableData.length"></NoDate>
         </div>
         </div>
    </div>
    <div v-if="showImport">
      <!--  @datalsit="datalsit" -->
      <ImportDialog :importVisible="showImport" :listdata="multipleSelection" @closeImport="closeImport" @datalsit="datalsit" type="3"></ImportDialog>
    </div>
    <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
  </div>
</template>
<script>
import TreeBox from "../../../components/SessionArchiving/treeBox"
import { BASE_URL } from '../../../config/app.js'
import NoDate from '../../../components/noDate'
import axios from 'axios'
// import Pagination from "../../../components/elPagination.vue";
import Pagination from '../../../components/elPagination.vue'
import ImportDialog from '../component/allocation.vue'
import { formatDate } from '../../../utils/tool'

import {
  inJobTransferCustomer_getUserList,
  getInJobUserCustomer,
  common_getlist,
  inJobTransferCustomer_synchronizeCustomers,
} from '../../../api/customer'

export default {
  components: {
    Pagination,
    ImportDialog,
    NoDate,
     TreeBox,
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
  },
    provide() {
        return {
            getCheckedList: this.getCheckedList,
        }
    },
  data() {
    return {
      checkbox: '',
      type: '3',
      ruleForm: {
        source: '',
        customName: '',
        createTimeSta: '',
        createTimeEnd: '',
        userNo: '',
        stage: '',
        state: '',
      },
      creatDate: [],
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
      allDataList: [],
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
    console.log(this.allDataList, '---')
  },
  mounted() {
    // this.customerStage()
  },
  methods: {
    checkedList(data){
      console.log(data)
    },
          // 选中员工
        getCheckedList(data) {
          console.log(data)
             this.$refs.treeBox.resetTreeData(this.checkedList)
                console.log("结果---checkedList:::", this.checkedList)
            // if (data.type == 3 && data.isChecked == true) {
            //     this.checkedList = []
            //     this.checkedList.push(data)
            //     this.checkedList[0].content = this.checkedList[0].id
            //     this.$refs.treeBox.resetTreeData(this.checkedList)
            //     console.log("结果---checkedList:::", this.checkedList)
            //     this.doGetContactsList(0)
            // } else if (data.type == 3 && data.isChecked == false && data.id == this.checkedStaff.id) {
            //     data.isChecked = true
            // }
        },
    isDisableFun(row, index) {
      return row.status != 2 ? true : false
    },
    //   cellcb(row){
    //     console.log(row,"00000===")
    //   if(row.row.status == 2){
    //     return "myCell"
    //   }
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.allDataList = val
      // console.log(val, "0000---");
      console.log(this.allDataList, '---')
    },
    getRowKey(row) {
      return row.id
    },
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
        createAddTime: this.ruleForm.createTimeSta,
        createEndTime: this.ruleForm.createTimeEnd,
        limit: this.pageInfo.limit,
        name: this.ruleForm.customerName,
        page: this.pageInfo.page,
        source: this.ruleForm.source,
        stage: this.ruleForm.stage,
        userNo: this.ruleForm.userNo,
        status: this.ruleForm.state,
      }
      getInJobUserCustomer(obj).then((res) => {
        if (res.result) {
          this.total = res.data.total
          console.log(res, '0000')
          this.tableData = res.data.list
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
    stateChange(val) {
      this.ruleForm.state = val
    },
    labelHead(h, { column, index }) {
      let l = column.label.length
      let f = 14
      column.minWidth = f * (l + 1)
      return h('div', { class: 'table-head', style: { width: '100%' } }, [
        column.label,
      ])
    },
    PgetList() {
      this.loading = true
      let params = { ...this.ruleForm, ...this.pageInfo, type: this.type }
      this.$network
        .get('/customer-service/cluecustomer/getcluecustomerlist', params)
        .then((res) => {
          this.loading = false
          let _res = res.data
          this.total = _res.iPage.total
          let tempList = _res.iPage.records
          this.tableData = []
          tempList.forEach((item) => {
            if (item.gender && item.gender == '1') {
              item.gender = '男'
            } else if (item.gender && item.gender == '2') {
              item.gender = '女'
            } else if (item.gender && item.gender == '0') {
              item.gender = '未知'
            }
            item.followTime = item.followTime
              ? formatDate(item.followTime, 'yyyy-MM-dd hh:mm:ss')
              : '-'
            item.createTime = item.createTime
              ? formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')
              : '-'
            let itemObj = { ...item, ...item.corpCustomColumnMap }
            this.tableData.push(itemObj)
          })
          // this.tableData = tempList
          // console.log('----this.tableData---', this.tableData)
          // this.optionsCreat = _res.sourcelist;
          this.options = _res.list
          this.tableLabel = res.data.head.map((item) => {
            if (item.optionsVOList) {
              let list = item.optionsVOList
              list.forEach((val) => {
                val.text = val.columnOption
                val.value = val.columnOption
              })
            }
            return {
              label: item.columnName,
              prop: item.columnValue,
              optionsVOList: item.optionsVOList,
            }
          })
          console.log('---------tableLabel--', this.tableLabel)
        })
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
    changeDate(val) {
      if (val[0] == val[1]) {
        this.ruleForm.createTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTimeEnd = val[0] + ' 23:59:59'
      } else {
        this.ruleForm.createTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTimeEnd = val[1] + ' 23:59:59'
      }
    },
    submitForm() {
      this.pageInfo.page = 1
      this.getList()
    },
    resetForm() {
      this.ruleForm = {}
      this.creatDate = []
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
    uploadList() {
      inJobTransferCustomer_synchronizeCustomers().then((res) => {
        if (res.result) {
          this.$message({
            type: 'success',
            message: '同步成功',
          })
          this.getList()
        }
      })
    },
    // 导入
    importExcel() {
      if (this.allDataList.length != 0) {
        this.showImport = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择分配客户',
          type: 'warning',
        })
      }
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
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
        for (let i = 0; i < this.tableData.length; i++) {
          el.forEach((item) => {
            console.log(item, '---00')
            if (this.tableData[i].id == item.id) {
              // this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true)
              this.$refs.multipleTable.toggleRowSelection(
                this.tableData[i],
                true
              )
            }
          })
        }
      })
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
.myCell {
  /deep/ .cell {
    .el-checkbox {
      .el-checkbox__input {
        display: none !important;
      }
    }
  }
}
.customWarp {
  .warp_box{
      display: grid;
  grid-template-columns: 20% 80% ;
  }
  .right{
    // flex: 1;
    // width: 966px;
  }
      .left {
        .tree-box{
        // width: 262px;
        height: 100%;
        padding: 16px;
        overflow-x: hidden;
        overflow-y: auto;
    
        border: 1px solid #D9DAE4;
            border-top: 0;
        }
       }
  min-height: 812px;
  background: #ffffff;
  border-radius: 8px;
  // padding: 16px;
  .selectTab {
     padding-top: 16px;
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
