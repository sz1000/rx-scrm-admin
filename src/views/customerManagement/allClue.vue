<template>
  <div class="customWarp">
    <div class="selectTab">
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" :rules="rules" label-position="right">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col :span="6">
            <el-form-item label="关键词:">
              <el-input v-model="ruleForm.searchParam" placeholder="线索名称/企业名称/联系人" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间:">
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
            <el-form-item label="线索来源:">
              <el-select v-model="ruleForm.source" placeholder="请选择" clearable>
                <el-option v-for="item in optionsCreat" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线索类型:">
              <el-select v-model="ruleForm.clueType" placeholder="请选择" clearable>
                <el-option v-for="item in clueList" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
          <el-col :span="6">
            <el-form-item label="负责类型:">
              <el-select v-model="ruleForm.followRole" placeholder="请选择" clearable>
                <el-option v-for="item in followTypeList" :key="item.id" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="负责人:">
              <el-select v-model="ruleForm.chargeUserNo" placeholder="请选择" clearable>
                <el-option v-for="item in userList" :key="item.id" :label="item.userName" :value="item.userNo"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="协助人:">
              <el-select v-model="ruleForm.collaborativeUserNo" placeholder="请选择" clearable>
                <el-option v-for="item in userList" :key="item.id" :label="item.userName" :value="item.userNo"></el-option>
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
            <el-button type="primary" @click="submitForm()" style="margin-right: 6px">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="operation flex">
      <div class="btn_box">
        <div class="btn" :class="{'cur':item.active}" @click="clickBtnSearch(item)" v-for="(item,index) in btnList" :key="index">{{item.name}}</div>
      </div>
      <div class="opera">
        <!-- <el-button class="addBtn pointer tongbu" @click="uploadList" v-preventReClick>
          <img src="../../assets/images/icon_tongbu@2x.png" alt="" />
          同步线索
        </el-button> -->
        <el-button class="addBtn pointer tongbu" @click="exportExcel" v-preventReClick>
          <img src="../../assets/images/download_two.png" alt="" />
          按条件导出
        </el-button>
        <!-- <el-button class="addBtn pointer export" @click="importExcel">
          <img src="../../assets/images/upload_two@2x.png" alt="" />
          导入
        </el-button>
        <div class="addBtn pointer" @click="addCuleDialog" v-show="expandedKeys.some(item=>item.enName == 'add')">
          <img src="../../assets/images/icon_add@2x.png" alt="" />
          新增
        </div> -->
      </div>
    </div>
    <div class="tableWarp" v-loading='loading'>
      <el-table style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
        <el-table-column label="编号" type="index" width="60px"></el-table-column>
        <el-table-column v-for="(item) in tableLabel" :prop="item.prop" :label="item.label" show-overflow-tooltip :key="item.id" :min-width="setWidthFun(item.label)">
          <template slot-scope="scope">
            <div class="info" v-if="item.label == '线索名称'">
              <div class="avatar" :class="{'bg':!scope.row.avatar}">
                <img v-if="scope.row.avatar" class="img" :src="scope.row.avatar" alt="">
                <span v-else>{{scope.row[item.prop] | avatar}}</span>
                <img class="logo" v-if="scope.row.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                <img class="logo" v-if="scope.row.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
              </div>
              <div class="name">{{scope.row[item.prop]}}</div>
            </div>
            <span v-else-if="item.label == '性别'">{{scope.row[item.prop] | $gender}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <!-- <af-table-column v-for="(item) in tableLabel" :key="item.id" :prop="item.prop" :label="item.label" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="info" v-if="item.label == '线索名称'">
              <div class="avatar" :class="{'bg':!scope.row.avatar}">
                <img v-if="scope.row.avatar" class="img" :src="scope.row.avatar" alt="">
                <span v-else>{{scope.row[item.prop] | avatar}}</span>
                <img class="logo" v-if="scope.row.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                <img class="logo" v-if="scope.row.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
              </div>
              <div class="name">{{scope.row[item.prop]}}</div>
            </div>
            <span v-else-if="item.label == '性别'">{{scope.row[item.prop] | $gender}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </af-table-column> -->
        <template>
        </template>
        <el-table-column fixed="right" label="操作" width="70">
          <template slot-scope="scope">
            <span @click="handleClick(scope.$index, scope.row)" class="table_txt">详情</span>
          </template>
        </el-table-column>
        <div slot="empty" class="empty" style="padding-top: 100px">
          <img src="../../assets/images/nodae.png" alt="" style="width: 280px; height: 233px" />
        </div>
      </el-table>
    </div>
    <!-- <TableHeader :culeDetail='culeDetail'
                 @closeculeDetail='closeculeDetail'></TableHeader> -->
    <div v-if="addCule">
      <NewAddCule v-model="addCule" :commonType="type" :sourceList="optionsCreat" @sure="getAddSureFun"></NewAddCule>
    </div>
    <div v-if="showImport">
      <ImportDialog :importVisible='showImport' @closeImport='closeImport' type='1'></ImportDialog>
    </div>
    <div class="pagePosition">
      <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
    </div>
  </div>
</template>
<script>
import { BASE_URL } from '../../config/app.js'
import axios from 'axios'
import Pagination from '../../components/elPagination.vue'
import NewAddCule from './component/NewAddCule.vue'
import ImportDialog from './component/ImportDialog.vue'
import { formatDate } from '../../utils/tool'
// import TableHeader from './component/dragTabHeader.vue'
import MyMixin from '../../mixins/permissions'
import { cluecustomer_getAllCustomerList,cluecustomer_getcluecustomerlist, getlistFiled,cluecustomer_synccus,opportunitiesList, } from '@/api/customer'
import { sop_employeeList } from '@/api/sop'
export default {
  components: {
    Pagination,
    // TableHeader,
    ImportDialog,
    NewAddCule,
  },
  mixins: [MyMixin],
  data() {
    return {
      type: '1',
      ruleForm: {
        stageNum: [], //商机阶段
        businessOpportunitiesStageNos: [], //商机阶段1
        businessOpportunitiesStageStatus: [], //商机阶段2
        shangjiList: [],
        customerCalled: '',
        chargeUserNo: '',
        source: '',
        name: '',
        phone: '',
        cropFullName: '',
        createTimeSta: '',
        createTimeEnd: '',
        followTimeSta: '',
        followTimeEnd: '',
        userNo: '',
        valueCreat: '',
        searchParam: '',
      },
      creatDate: '',
      followDate: '',
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      options: [],
      optionsCreat: [],
      followTypeList: [       //负责类型
        {name: '我负责的',value: 1},
        {name: '我协助的',value: 2},
      ],
      userList: [],           //负责人、协助人
      clueList: [],           //线索类型
      btnList: [
        { name: '今日新增',code: 'today',active: false },
        { name: '素材线索',code: 'material',active: false },
        // { name: '线索转客户',code: 'clue',active: false },
        // { name: '商机客户',code: 'niche',active: false },
        { name: '加微线索',code: 'wx',active: false },
      ],
      tableLabel: [
        { label: '线索名称', prop: 'customerCalled' },
        { label: '线索来源', prop: 'source' },
        { label: '线索类型', prop: 'clueTypeName' },
        { label: '企业名称', prop: 'cropFullName' },
        { label: '联系人', prop: 'name' },
        { label: '手机号', prop: 'phone' },
        { label: '负责人', prop: 'uname' },
        { label: '创建时间', prop: 'createTime' },
        { label: '最后跟进时间', prop: 'followTime', labelWidth: '120px' }
      ],
      tableData: [],
      addCule: false,
      culeDetail: false,
      showImport: false,
      rules: {
        // phone: [{ validator: this.checkPhone, trigger: 'blur' }],
      },
      loading: false,
      isHome: true,
      isFZR: true,
    }
  },
  created() {
    this.getList()
    this.getFiledChange()
    this.getBusinessOpportunitiesList()
  },
  mounted() {
    this.getUserList()
  },
  computed: {
    token() {
      return this.$store.getters.token
    },
    corpId() {
      return this.$store.getters.corpId
    },
    userNo() {
      let token = this.$store.getters.token
      return token ? token.split('|')[1] : ''
    },
  },
  methods: {
    setWidthFun(name){
      let str = '120px'
      if(name == '线索名称'){
        str = '200px'
      }
      return str
    },
    // clickBtnSearch(row){   //按钮搜索
    //   let type = row.code
    //   switch (type) {
    //     case 'today':      //今日新增
    //       if(row.active){
    //         this.creatDate = ''
    //         this.ruleForm.createTimeSta = ''
    //         this.ruleForm.createTimeEnd = ''
    //       }else{
    //         let nowDate = this.moment().format('YYYY-MM-DD')
    //         this.creatDate = [nowDate + ' 00:00:00',nowDate + ' 23:59:59']
    //         this.ruleForm.createTimeSta = this.creatDate[0]
    //         this.ruleForm.createTimeEnd = this.creatDate[1]
    //       }
    //       break;
    //     case 'clue':   //线索转客户
    //       if(row.active){
    //         this.ruleForm.genMethod = ''
    //       }else{
    //         this.ruleForm.genMethod = '5'
    //       }
    //       break;
    //     case 'niche':   //商机客户
    //       if(row.active){
    //         this.ruleForm.stageNum = []
    //         this.ruleForm.businessOpportunitiesStageStatus = []
    //         this.ruleForm.businessOpportunitiesStageNos = []
    //       }else{
    //         let arr = this.shangjiList.filter(el => {
    //           return typeof el.sortNo == 'string'
    //         })
    //         let arr1 = this.shangjiList.filter(el => {
    //           return typeof el.sortNo == 'number'
    //         })
    //         arr.forEach(el => {
    //           this.ruleForm.businessOpportunitiesStageStatus.push(el.sortNo)
    //         })
    //         arr1.forEach(el => {
    //           this.ruleForm.businessOpportunitiesStageNos.push(el.sortNo)
    //         })
    //         this.ruleForm.stageNum = this.shangjiList.map(el => {
    //           return el.sortNo
    //         })
    //       }
    //       break;
    //     case 'wx':         //加微线索
    //       if(row.active){
    //         this.ruleForm.isWcCus = 0
    //       }else {
    //         this.ruleForm.isWcCus = 1
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    //   row.active = !row.active
    //   this.getList()
    // },
    getBusinessOpportunitiesList() {
      // 商机阶段
      let params = {
        corpId: this.corpId,
      }
      opportunitiesList(params).then((res) => {
        this.shangjiList = res.data
      })
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
        case 'material':   //素材线索
          if(row.active){
            this.ruleForm.clueType = ''
          }else{
            this.ruleForm.clueType = '3'
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
    getFiledChange() {
      let params = {
        corpId: this.corpId,
      }
      getlistFiled(params).then((res) => {
        if (res.result) {
          let list = res.data
          list.forEach((item) => {
            if(item.type == 'clue_type') {
              this.clueList.push(item)
            }
            if(item.type == 'source') {
              this.optionsCreat.push(item)
            }
          })
        }
      })
    },
    getList() {
      // console.log("this type "+this.type)
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
      // cluecustomer_getcluecustomerlist
      cluecustomer_getAllCustomerList(params).then((res) => {
        if (res.result) {
          // this.loading = true
          let _res = res.data
          console.log(res)
          this.total = _res.dataList.total
          let tempList = _res.dataList.records
          tempList.forEach(el => {
            el.followTime = this.moment(el.followTime).format('YYYY-MM-DD HH:mm:ss')
            el.createTime = this.moment(el.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
          this.tableData = tempList
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
          //   },1000)
          // })
        }
      })
    },
    getUserList() {
      //获取员工列表
      sop_employeeList().then(res => {
        if (res.result) {
          this.userList = res.data
        }
      })
    },
    submitForm() {
      this.pageInfo.page = 1
      this.getList()
    },
    resetForm() {   //重置
      this.ruleForm = {}
      this.creatDate = ''
      this.followDate = ''
      this.btnList.forEach(el => {
        el.active = false
      })
      this.getList()
    },
    handleClick(index, row) {
      // console.log(row)
      this.$router.push({
        path: 'cluesDetail',
        query: {
          menuFlag: true,
          type: 1,
          customno: row.clueCustomerNo,
          expandedKeys: JSON.stringify(this.expandedKeys),
        },
      })
    },
    pageChange(item) {
      // console.log('', item)
      this.getList()
    },
    addCuleDialog() {
      this.addCule = true
    },
    getAddSureFun() {
      this.addCule = false
      this.getList()
    },
    showClue() {
      this.culeDetail = true
    },
    closeculeDetail() {
      this.culeDetail = false
    },
    checkPhone(rule, value, callback) {
      if (!value) {
        // return callback(new Error('不能为空'))
        return
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    },
    uploadList() {
      this.$confirm('每10分钟可同步一次，你确认同步吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        title: '确认同步',
        type: 'warning',
      }).then((res) => {
        cluecustomer_synccus().then((res) => {
          if (res.result) {
            this.$message({
              type: 'success',
              message: res.data,
            })
            // this.getList()
          }
        })
      })
    },
    // 导入
    importExcel() {
      this.showImport = true
    },
    closeImport(v) {
      if (v == 1) {
        this.getList()
        // console.log('hjkahdkahdhsak')
      }
      this.showImport = false
    },
    // 导出
    exportExcel() {
      this.loading = true
      console.log(this.ruleForm)
      let params = { ...this.ruleForm, ...this.pageInfo, type: this.type }
      let token = this.token
      axios({
        method: 'post',
        url: BASE_URL + '/customer-service/clueCustomerInExport/export',
        headers: {
          token: token,
        },
        data: params,
        responseType: 'blob',
      })
        .then((res) => {
          if (res && this.tableData.length > 0) {
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
          if (this.tableData.length == 0) {
            this.$message.error('当前列表为空则无法导出')
          } else {
            this.$message.error('很抱歉，暂时无法导出')
          }
          this.loading = false
        })
    },
  },
  filters: {
    avatar(val){
      return val ? val.substring(0,1) : ''
    }
  },
}
</script>
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
    .opera{
      display: flex;
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
      width: 76px;
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
    /deep/.el-table tbody tr:hover > td {
      background-color: #f4f6fe;
    }
    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
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
          line-height: 22px;
        }
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .logo{
          width: 13px;
          height: 13px;
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
      max-width: calc(100% - 220px);
    }
  }
}
.time_flex {
  width: 500px;
  display: flex;
}
.ml-10 {
  margin-left: 10px;
  margin-top: 3px;
}
/deep/.el-input {
  .el-input__inner {
    // color: #c0c4cc !important;
    border: 1px solid #d9dae4 !important;
  }
}
</style>
<style>
.el-tooltip__popper {
  max-width: 500px !important;
}
</style>