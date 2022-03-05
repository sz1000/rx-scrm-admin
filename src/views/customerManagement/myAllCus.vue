<template>
  <div class="customWarp">
    <div class="selectTab">
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" label-position="right">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="6">
            <el-form-item label="关键词:">
              <el-input v-model="ruleForm.searchParam" placeholder="客户名称/企业名称/联系人/手机号码" maxlength="30">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="建档时间:">
              <el-date-picker
                v-model="creatDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd"
                @change="changeDateFun($event,'create')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户来源:">
              <el-select v-model="ruleForm.source" placeholder="请选择客户来源" clearable>
                <el-option v-for="item in optionsCreat" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户阶段:">
              <el-select v-model="ruleForm.customerStage" placeholder="请选择客户阶段" @change="optionsStage" clearable>
                <el-option v-for="item in stageList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="6">
            <el-form-item label="客户类型:">
              <el-select v-model="ruleForm.customerType" placeholder="请选择" clearable>
                <el-option v-for="item in leixingList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责类型:">
              <el-select v-model="ruleForm.followRole" placeholder="请选择" @change="followRoleChange" clearable>
                <el-option label="我负责的" value="1">
                </el-option>
                <el-option label="我协助的" value="2">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人:">
              <el-select v-model="ruleForm.chargeUserNo" placeholder="请选择" clearable>
                <el-option v-for="item in userList" :key="item.id" :label="item.userName" :value="item.userNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="协助人:">
              <el-select v-model="ruleForm.collaborativeUserNo" placeholder="请选择" clearable>
                <el-option v-for="item in userList" :key="item.value" :label="item.userName" :value="item.userNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
          <el-col :span="6" class="btnCol">
            <el-form-item label="商机阶段:">
              <el-select v-model="ruleForm.stageNum" collapse-tags placeholder="请选择" multiple clearable @change="changeStage">
                <el-option v-for="item in shangjiList" :key="item.sortNo" :label="item.name" :value="item.sortNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="微信来源:">
              <el-select v-model="ruleForm.externalSource" placeholder="请选择" clearable>
                <el-option v-for="item in weixinList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="建档类型:">
              <el-select v-model="ruleForm.genMethod" placeholder="请选择" clearable>
                <el-option v-for="item in filingTypeList" :key="item.id" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="跟进时间:">
              <el-date-picker
                v-model="followDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd"
                @change="changeDateFun($event,'follow')">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="btnCol">
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="operation flex">
      <div class="btn_box">
        <div class="btn" :class="{'cur':item.active}" @click="clickBtnSearch(item)" v-for="(item,index) in btnList" :key="index">{{item.name}}</div>
      </div>
      <el-button class="addBtn pointer" @click="downData">
        <img src="../../assets/images/icon_shangchuan.png" alt="" />
        按条件导出
      </el-button>
    </div>
    <div class="tableWarp" v-loading="loading">
      <el-table style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
        <el-table-column label="编号" width="60px" type="index"></el-table-column>
        <!-- <template v-for="(item) in tableLabel">
          <af-table-column :key="item.id" :prop="item.prop" :label="item.label" show-overflow-tooltip>
          </af-table-column>
        </template> -->
        <!-- <af-table-column v-for="(item) in tableLabel" :key="item.id" :prop="item.prop" :label="item.label" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="info" v-if="item.label == '客户名称'">
              <div class="avatar" :class="{'bg':!scope.row.avatar}">
                <img v-if="scope.row.avatar" class="img" :src="scope.row.avatar" alt="">
                <span v-else>{{scope.row[item.prop] | avatar}}</span>
                <img class="logo" v-if="scope.row.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                <img class="logo" v-if="scope.row.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
              </div>
              <div class="name">{{scope.row[item.prop]}}</div>
            </div>
            <span :class="{'tag':scope.row[item.prop]}" v-else-if="item.label == '客户阶段'">{{scope.row[item.prop]}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </af-table-column> -->
        <el-table-column v-for="(item) in tableLabel" :prop="item.prop" :label="item.label" show-overflow-tooltip :key="item.id" :min-width="setWidthFun(item.label)">
          <template slot-scope="scope">
            <div class="info" v-if="item.label == '客户名称'">
              <div class="avatar" :class="{'bg':!scope.row.avatar}">
                <img v-if="scope.row.avatar" class="img" :src="scope.row.avatar" alt="">
                <span v-else>{{scope.row[item.prop] | avatar}}</span>
                <img class="logo" v-if="scope.row.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                <img class="logo" v-if="scope.row.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
              </div>
              <div class="name">{{scope.row[item.prop]}}</div>
            </div>
            <span :class="[{'tag':scope.row[item.prop]},getColor(scope.row[item.prop])]" v-else-if="item.label == '客户阶段'">{{scope.row[item.prop]}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" v-if="tableLabel.length>0">
          <template slot-scope="scope">
            <span @click="handleClick(scope.$index, scope.row)" class="table_txt">详情</span>
          </template>
        </el-table-column>
        <div slot="empty" class="empty" style="padding-top: 100px">
          <img src="../../assets/images/nodae.png" alt="" style="width: 280px; height: 233px" />
        </div>
      </el-table>
    </div>
    <div v-if="addCule">
      <CustomAdd :addCule="addCule" @closeAddCule="closeAddCule" :commonType="type"></CustomAdd>
    </div>
    <div class="pagePosition">
      <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
    </div>
  </div>
</template>
<script>
import { BASE_URL } from '../../config/app.js'
import Pagination from '../../components/elPagination.vue'
import CustomAdd from './component/CustomAdd.vue'
import { formatDate } from '../../utils/tool'
import MyMixin from '../../mixins/permissions'
import axios from 'axios'
import {
  cluecustomer_getAllCustomerList,
  clueCustomerFollowUser_selectUserDeptList,
  getlistFiled,
  opportunitiesList,
} from '@/api/customer'
import { sop_employeeList } from '@/api/sop'
export default {
  components: {
    Pagination,
    CustomAdd,
  },
  mixins: [MyMixin],
  data() {
    return {
      loading: false,
      deptList: [],
      stageList: [],
      shangjiList: [],
      weixinList: [],
      leixingList: [],
      filingTypeList: [],
      BASE_URL,
      downUrl: '',
      type: '3',
      ruleForm: {
        chargeUserNo: '', //负责人
        collaborativeUserNo: '', //协助人
        stageNum: [], //商机阶段
        businessOpportunitiesStageNos: [], //商机阶段1
        businessOpportunitiesStageStatus: [], //商机阶段2
        customerType: '', //客户类型
        customerStage: '', //客户阶段
        searchParam: '', //关键词、
        isWcCus: '', //仅查看微信
        userNo: '',
        phone: '', //手机号
        cropFullName: '', //企业名称
        createTimeSta: '', //创建时间开始
        createTimeEnd: '', //创建时间结束
        userName: '', //员工姓名
        followRole: '', //跟进角色
        dept: '', //员工部门（部门ID）
        name: '', //联系人
        customerName: '', //企业简称
        externalSource: '', //微信来源
      },
      creatDate: [],
      followDate: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      options: [],
      optionsCreat: [],
      tableLabel: [],
      tableData: [],
      addCule: false,
      culeDetail: false,
      userList: [], //负责人、协助人
      btnList: [
        { name: '今日新增',code: 'today',active: false },
        { name: '线索转客户',code: 'clue',active: false },
        { name: '商机客户',code: 'niche',active: false },
        { name: '加微线索',code: 'wx',active: false },
      ],
      isHome: true,
      isFZR: true,
    }
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
    userNo() {
      let token = this.$store.getters.token
      return token ? token.split('|')[1] : ''
    },
  },
  created() {
    this.getList()
    this.optionsDouble()
    this.getUserList()
    this.getFiledChange()
    this.getBusinessOpportunitiesList()
  },
  methods: {
    getColor(val){
      let str = ''
      switch (val) {
        case '成交':
          str = 'green'
          break;
        case '输单':
          str = 'red'
          break;
        case '无效':
          str = 'gray'
          break;
        case '意向客户':
          str = 'yellow'
          break;
        default:
          break;
      }
      return str
    },
    setWidthFun(name){
      let str = '120px'
      if(name == '客户名称'){
        str = '200px'
      }
      return str
    },
    clickBtnSearch(row){   //按钮搜索
      let type = row.code
      switch (type) {
        case 'today':      //今日新增
          if(row.active){
            this.creatDate = ''
            this.ruleForm.createTimeSta = ''
            this.ruleForm.createTimeEnd = ''
          }else{
            let nowDate = this.moment().format('YYYY-MM-DD')
            this.creatDate = [nowDate + ' 00:00:00',nowDate + ' 23:59:59']
            this.ruleForm.createTimeSta = this.creatDate[0]
            this.ruleForm.createTimeEnd = this.creatDate[1]
          }
          break;
        case 'clue':   //线索转客户
          if(row.active){
            this.ruleForm.genMethod = ''
          }else{
            this.ruleForm.genMethod = '5'
          }
          break;
        case 'niche':   //商机客户
          if(row.active){
            this.ruleForm.stageNum = []
            this.ruleForm.businessOpportunitiesStageStatus = []
            this.ruleForm.businessOpportunitiesStageNos = []
          }else{
            let arr = this.shangjiList.filter(el => {
              return typeof el.sortNo == 'string'
            })
            let arr1 = this.shangjiList.filter(el => {
              return typeof el.sortNo == 'number'
            })
            arr.forEach(el => {
              this.ruleForm.businessOpportunitiesStageStatus.push(el.sortNo)
            })
            arr1.forEach(el => {
              this.ruleForm.businessOpportunitiesStageNos.push(el.sortNo)
            })
            this.ruleForm.stageNum = this.shangjiList.map(el => {
              return el.sortNo
            })
          }
          break;
        case 'wx':         //加微线索
          if(row.active){
            this.ruleForm.isWcCus = 0
          }else {
            this.ruleForm.isWcCus = 1
          }
          break;
        default:
          break;
      }
      row.active = !row.active
      this.getList()
    },
    changeDateFun(e,type){    //时间选择
      // console.log('change',e,type)
      let obj = {}
      if(type == 'follow'){
        obj.startTime = 'followTimeSta'
        obj.endTime = 'followTimeEnd'
      }else{
        obj.startTime = 'createTimeSta'
        obj.endTime = 'createTimeEnd'
      }
      if(e && e.length > 0){
        this.ruleForm[obj.startTime] = e[0] + ' 00:00:00'
        this.ruleForm[obj.endTime] = e[1] + ' 23:59:59'
      }else{
        this.ruleForm[obj.startTime] = ''
        this.ruleForm[obj.endTime] = ''
      }
    },
    // 商机选择
    changeStage(val) {
      // console.log(val, this.shangjiList, '------')
      if (val && val.length > 0) {
        this.ruleForm.businessOpportunitiesStageStatus = val.filter((item) => {
          if (typeof item == 'string') {
            return item
          }
        })
        this.ruleForm.businessOpportunitiesStageNos = val.filter((item) => {
          if (typeof item == 'number') {
            return item
          }
        })
      } else {
        this.ruleForm.businessOpportunitiesStageStatus = []
        this.ruleForm.businessOpportunitiesStageNos = []
      }
      // console.log(this.ruleForm)
    },
    getBusinessOpportunitiesList() {
      // 商机阶段
      let params = {
        corpId: this.corpId,
      }
      opportunitiesList(params).then((res) => {
        this.shangjiList = res.data
      })
    },
    getFiledChange() {
      let params = {
        corpId: this.corpId,
      }
      getlistFiled(params).then((res) => {
        if (res.result) {
          let list = res.data
          list.forEach((item) => {
            if(item.type == 'gen_method'){
              this.filingTypeList.push(item)
            }
            if (item.type == 'stage') {
              this.stageList.push(item)
              this.stageList = this.stageList.sort((a, b) => {
                return a.value - b.value
              })
            } else if (item.type == 'source') {
              this.optionsCreat.push(item)
              this.optionsCreat = this.optionsCreat.sort((a, b) => {
                return a.value - b.value
              })
            } else if (item.type == 'external_source') {
              this.weixinList.push(item)
            } else if (item.type == 'customer_type') {
              this.leixingList.push(item)
              this.leixingList = this.leixingList.sort((a, b) => {
                return a.value - b.value
              })
            }
          })
        }
      })
    },
    getUserList() {
      //获取员工列表
      sop_employeeList().then((res) => {
        if (res.result) {
          this.userList = res.data
        }
      })
    },
    getList() {
      console.log(this.creatDate)
      let params = {
        ...this.ruleForm,
        ...this.pageInfo,
        type: this.type,
      }
      if(this.$route.query.time && this.isHome){
        this.isHome = false
        let arr = JSON.parse(localStorage.getItem('home_time'))
        this.creatDate = arr
        params.createTimeSta = arr[0]
        params.createTimeEnd = arr[1]
      }
      if(this.$route.query.fzr && this.isFZR){
        this.isFZR = false
        this.ruleForm.chargeUserNo = this.userNo
        params.chargeUserNo = this.userNo
      }
      cluecustomer_getAllCustomerList(params).then((res) => {
        if (res.result) {
          // this.loading = true
          let _res = res.data.dataList
          this.total = _res.total
          let tempList = _res.records
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

            if (item.followrole == '1') {
              item.followrole = '我负责的'
            } else {
              item.followrole = '我协助的'
            }
            let itemObj = { ...item, ...item.corpCustomColumnMap }
            this.tableData.push(itemObj)
          })
          // this.tableData = tempList
          // this.optionsCreat = _res.sourcelist
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
          // this.$nextTick(() => {
          //   setTimeout(() => {
          //     this.loading = false
          //   },1500)
          // })
        }
      })
    },
    filterHandler(value, row, column) {
      // console.log('=====>>>>>>>>>', value, row, column)
      const property = column['property']
      return row[property] === value
    },
    userChange() {},
    sourceChange() {},
    changeDate(e) {
      if (e && e.length > 0) {
        this.ruleForm.createTimeSta = e[0] + ' 00:00:00'
        this.ruleForm.createTimeEnd = e[1] + ' 23:59:59'
      } else {
        this.ruleForm.createTimeSta = ''
        this.ruleForm.createTimeEnd = ''
      }
    },
    submitForm() {
      this.pageInfo.page = 1
      this.getList()
    },
    resetForm() {
      this.ruleForm = {}
      this.creatDate = []
      this.followDate = []
      this.btnList.forEach(el => {
        el.active = false
      })
      this.getList()
    },
    handleClick(index, row) {
      this.$router.push({
        path: 'cluesDetail',
        query: {
          menuFlag: true,
          type: 3,
          isAll: 1,
          customno: row.clueCustomerNo,
          expandedKeys: JSON.stringify(this.expandedKeys),
        },
      })
    },
    pageChange(item) {
      console.log('', item)
      this.getList()
    },
    addCuleDialog() {
      this.addCule = true
    },
    followRoleChange(value) {
      console.log('负责人>>>', value)
      this.ruleForm.followRole = value
    },
    optionsStage(value) {
      console.log('客户阶段>>>', value)
      this.ruleForm.customerStage = value
    },
    optionsDept(value) {
      console.log('客户阶段>>>', value)
      this.ruleForm.dept = value
    },
    closeAddCule() {
      this.addCule = false
      this.getList()
    },
    showClue() {
      this.culeDetail = true
    },
    closeculeDetail() {
      this.culeDetail = false
    },
    optionsDouble() {
      clueCustomerFollowUser_selectUserDeptList().then((res) => {
        if (res.result) {
          // this.stageList = res.data.stage
          // this.deptList = res.data.depts
        }
      })
    },
    downData() {
      this.loading = true
      console.log(this.ruleForm)
      let params = { ...this.ruleForm } //, type: this.type
      let token = localStorage.getItem('token')
      axios({
        method: 'get',
        url:
          BASE_URL +
          '/customer-service/exportcluecustomer/downloadcluecustomer?type=' +
          this.type,
        headers: {
          token: token,
        },
        params: params,
        responseType: 'blob',
      })
        .then((res) => {
          if (res && this.tableData.length > 0) {
            console.log(res, '---res----')
            // 文件下载
            const blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel;charset=utf-8',
            })
            let link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.setAttribute('download', '客户信息导出.xlsx')
            link.click()
            link = null
            this.loading = false
            this.$message.success('导出成功')
          } else {
            // 返回json
            this.loading = false
            this.$message.warning(res.data.msg)
          }
        })
        .catch((err) => {
          console.log('this.tableData.length>>>', this.tableData.length)
          if (this.tableData.length == 0) {
            this.$message.error('当前列表为空则无法导出')
          } else {
            this.$message.error('很抱歉，暂时无法导出')
          }
          this.loading = false
        })
    },
    getMaxLength(arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          let calcLen = this.getTextWidth(item)
          if (acc < calcLen) {
            acc = calcLen
          }
        }
        return acc
      }, 0)
    },
    getTextWidth(str) {
      let width = 0
      let html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },
  },
  filters: {
    avatar(val){
      return val ? val.substring(0,1) : ''
    }
  },
}
</script>
<style>
.el-tooltip__popper {
  max-width: 500px !important;
}
</style>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
.customWarp {
  min-height: 812px;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  /deep/ .selectTab {
    .el-form-item__label {
      padding: 0;
      white-space: nowrap;
      padding-right: 8px;
    }
    .el-date-editor .el-range-separator{
      min-width: 5%;
      width: auto;
    }
  }
  /deep/ .el-table__empty-block{
    min-width: calc(100vw - 240px) !important;
  }
  .operation {
    justify-content: space-between;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    margin-bottom: 16px;
    margin-top: 16px;
    .btn_box{
      display: flex;
      user-select: none;
      .btn{
        color: @fontMain;
        font-size: 14px;
        line-height: 20px;
        padding: 5px 12px;
        border: 1px solid @bdColor;
        border-radius: 16px;
        margin-right: 16px;
        cursor: pointer;
        &.cur{
          color: @main;
          border-color: @main;
        }
      }
    }
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
      width: 118px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      color: #4168f6;
    }
    .tongbu {
      width: 76px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #d9dae4;
      margin-right: 16px;
      color: #000;
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
    .tag{
      color: @main;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid @main;
      padding: 3px 8px;
      &.yellow{
        color: @yellow;
        border-color: @yellow;
      }
      &.green{
        color: @green;
        border-color: @green;
      }
      &.red{
        color: @red;
        border-color: @red;
      }
      &.gray{
        color: @fontSub2;
        border-color: @fontSub2;
      }
    }
    .info{
      display: flex;
      align-items: center;
      .avatar{
        width: 24px;
        height: 24px;
        position: relative;
        text-align: center;
        &.bg{
          background: @main;
          border-radius: 50%;
        }
        span{
          display: block;
          color: @white;
          line-height: 24px;
        }
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .logo{
          width: 10px;
          height: 10px;
          position: absolute;
          right: -2px;
          bottom: -2px;
        }
      }
      .name{
        width: calc(100% - 30px);
        margin-left: 4px;
        font-size: 14px;
        line-height: 20px;
        color: @fontMain;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    /deep/ .el-table__empty-block{
      max-width: calc(100vw - 220px);
    }
  }
  /deep/ .el-table td{
    padding: 11px 0;
  }
  /deep/ .el-table .cell{
    line-height: 26px;
  }
  // /deep/ .el-table .cell{
  //   overflow: unset;
  // }
  // .pagePosition {
  //   position: absolute;
  //   bottom: 0;
  // }
}
</style>
