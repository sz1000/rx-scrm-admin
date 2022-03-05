<template>
  <div class="employees-warp">
    <div class="select-condition">
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" label-position="right">
        <el-row type="flex" justify="space-between" :gutter="24">
          <el-col :span="6">
            <el-form-item label="员工:">
              <el-input v-model="ruleForm.name" placeholder="请输入" @input="updateView($event)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门:" prop="depts">
              <el-input v-model="ruleForm.depts" placeholder="请输入" @input="updateView($event)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间:">
              <el-date-picker v-model="creatDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="submitForm" class="but_click">查询</el-button>
            <el-button @click="resetForm" class="but_hove">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-warp" v-loading='loading'>
      <el-table :data="tableData" :header-cell-style="{ background: '#FAFBFF' }" style="width: 100%">
        <el-table-column label="编号" type="index" width="70px"> </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scoped">
            {{ formatDate(scoped.row.dateNow, "yyyy-MM-dd") }}
          </template>
        </el-table-column>
        <el-table-column label="员工姓名" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="性别" prop="gender"> </el-table-column>
        <el-table-column label="部门" prop="departments" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="职务" prop="position"> </el-table-column>

        <el-table-column label="打卡次数" prop="punckNum"> </el-table-column>
        <el-table-column label="拜访已有客户数" prop="visitOldCustomerNum" min-width="100px">
        </el-table-column>
        <el-table-column label="拜访新客户数" prop="visitNewCustomerNum">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <span @click="checkDetail(scope.$index, scope.row)" class="table_txt">详情</span>
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
</template>
<script>
import Pagination from '../../components/elPagination.vue'
import { formatDate } from '../../utils/tool'
import MyMixin from '../../mixins/permissions'
export default {
  components: {
    Pagination,
  },
  mixins: [MyMixin],
  data() {
    return {
      ruleForm: {
        name: '',
        depts: '',
        createTimeSta: '',
        createTimeEnd: '',
      },
      creatDate: [],
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
    this.getData()
  },
  computed: {
    outonTrackObj() {
      return this.$store.state.app.outonTrackObj
    },
  },
  methods: {
    formatDate,
    getData() {
      this.loading = true
      let obj = { ...this.outonTrackObj }
      // console.log('hahahhahah---', obj)
      this.ruleForm.name = obj.name
      this.pageInfo.page = obj.page || 1
      this.pageInfo.limit = obj.limit || 20
      this.ruleForm.depts = obj.departments
      this.creatDate = obj.creatDate || []
      let params = {
        page: this.pageInfo.page || obj.page,
        limit: this.pageInfo.limit || obj.limit,
        name: this.ruleForm.name || obj.name,
        departments: this.ruleForm.depts || obj.depts,
        punchStartTime: this.ruleForm.createTimeSta || obj.punchStartTime,
        punchEndTime: this.ruleForm.createTimeEnd || obj.punchEndTime,
      }
      this.$network
        .get('/user-service/punckClock/getPunckClockList', params)
        .then((res) => {
          this.loading = false
          // console.log('----res---', res)
          if (res.data) {
            this.total = res.data.total
            res.data.plist.forEach((item) => {
              if (item.gender == 0) {
                item.gender = '未知'
              } else if (item.gender == 1) {
                item.gender = '男'
              } else {
                item.gender = '女'
              }
            })

            this.tableData = res.data.plist
          } else {
            this.tableData = []
          }
        })
    },
    updateView(e) {
      // console.log('---e-----', e)
      this.$forceUpdate()
    },
    submitForm() {
      let obj = {
        name: this.ruleForm.name,
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        departments: this.ruleForm.depts,
        punchStartTime:
          this.creatDate.length > 0 ? this.creatDate[0] + ' 00:00:00' : '',
        punchEndTime:
          this.creatDate.length > 0 ? this.creatDate[1] + ' 23:59:59' : '',
        creatDate: this.creatDate,
      }
      // console.log('-------', obj)
      this.$store.commit('app/setOutonTrackObj', obj)
      this.getData()
    },
    resetForm() {
      this.pageInfo.page = 1
      this.ruleForm = {}
      this.$store.commit('app/setOutonTrackObj', this.ruleForm)
      this.creatDate = []
      this.getData()
    },
    organChagne() {},
    changeDate(val) {
      this.creatDate = val
      if (val[0] == val[1]) {
        this.ruleForm.createTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTimeEnd = val[0] + ' 23:59:59'
      } else {
        this.ruleForm.createTimeSta = val[0] + ' 00:00:00'
        this.ruleForm.createTimeEnd = val[1] + ' 23:59:59'
      }
    },
    checkDetail(index, row) {
      console.log(row)
      this.$router.push({
        path: 'clockCard',
        query: {
          userNo: row.userNo,
          dateNow: row.dateNow,
        },
      })
    },
    pageChange(item) {
      this.pageInfo = item
      let obj = {
        name: this.ruleForm.name,
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        departments: this.ruleForm.depts,
        punchStartTime:
          this.creatDate.length > 0 ? this.creatDate[0] + ' 00:00:00' : '',
        punchEndTime:
          this.creatDate.length > 0 ? this.creatDate[1] + ' 23:59:59' : '',
        creatDate: this.creatDate,
      }
      // console.log('-------', obj)
      this.$store.commit('app/setOutonTrackObj', obj)
      this.getData()
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
.employees-warp {
  // height: 100%;
  min-height: 812px;
  background: #fff;
  padding: 16px;
  padding-bottom: 70px;
  border-radius: 8px;
  position: relative;
  .select-condition {
    color: #3c4353;
  }
  .table-warp {
    /deep/.el-table tbody tr:hover > td {
      background-color: #f4f6fe;
    }
    /deep/.el-table thead {
      color: #3c4353;
      font-size: 14px;
    }
    .el-table {
      color: #3c4353;
      &::before {
        width: 0;
      }
    }

    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
    }
  }
  .page-warp {
    position: absolute;
    right: 16px;
    bottom: 16px;
  }
}
</style>