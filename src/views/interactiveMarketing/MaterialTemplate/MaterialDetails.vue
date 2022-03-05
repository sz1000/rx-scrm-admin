<template>
  <div class="material-details-box">
    <go-back></go-back>
    <div class="content-box material-details">
      <div class="search_warp">
        <div class="item">
          <span class="label">姓名:</span>
          <span class="value">
            <el-input v-model="userName" placeholder="请输入姓名" clearable></el-input>
          </span>
        </div>
        <div class="item">
          <span class="label">负责人:</span>
          <span class="select_value">
            <!-- <el-input v-model="responUser" placeholder="请选择" clearable></el-input> -->
            <el-select v-model="responUser" collapse-tags placeholder="请选择" @change="userChange" clearable>
              <el-option v-for="item in userList" :key="item.value" :label="item.userName" :value="item.userNo">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="btns">
          <el-button type="primary" @click="checkTable" class="item_btn">查询</el-button>
          <el-button @click="resetTable" class="item_btn">重置</el-button>
        </div>
      </div>
      <div class="tab_warp">
        <span v-for="(item,index) in tabList" :key="index" :class="{'active':indexLi == item.id}" @click="tabClick(item)">{{item.name}}</span>
      </div>
      <div class="table-warp">
        <el-table :data="enterTable" v-loading="dataLoading" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }">
          <el-table-column type="index" width="60px" label="编号" align="left"></el-table-column>
          <el-table-column prop="customerName" show-overflow-tooltip label="姓名" min-width="120px">
            <template slot-scope="scope">
              <div class="info">
                <div class="avatar_user" :class="{'bguser':!scope.row.avatar}">
                  <img v-if="scope.row.avatar" class="img_user" :src="scope.row.avatar" alt="">
                  <span v-else>{{scope.row.customerName | avatar}}</span>
                </div>
                <div class="name">{{scope.row.customerName}}</div>
                <div :class="scope.row.externalType == 1 ? 'green': 'yellow'">
                  {{scope.row.externalType == 1 ? '@微信' : (scope.row.externalCorpFullName || scope.row.externalCorpName) ? `@${scope.row.externalCorpFullName || scope.row.externalCorpName}` : ''}}
                </div>
              </div>

            </template>
          </el-table-column>
          <!-- <el-table-column prop="visitorsCount" show-overflow-tooltip label="电话" width="130"></el-table-column> -->
          <el-table-column prop="externalType" label="状态">
            <template slot-scope="scope">
              <span
                    :class="scope.row.customerType == 1 ? 'customer': scope.row.customerType == 2 ? 'clues' : 'newClues'">{{ scope.row.customerType | getType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" show-overflow-tooltip label="负责人"> </el-table-column>
          <!-- <el-table-column prop="followUserNames" show-overflow-tooltip label="协助人"> </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">{{ scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "-"}}</template>
          </el-table-column>
          <el-table-column prop="address" show-overflow-tooltip label="地区"> </el-table-column> -->
          <el-table-column prop="openCount" label="浏览次数"> </el-table-column>
          <el-table-column prop="duration" label="浏览时长" width="170">
            <template slot-scope="scope">{{ scope.row.duration ? formatDuring(scope.row.duration*1000) : "0秒" }}</template>
          </el-table-column>
          <el-table-column label="最后浏览时间" prop="lastBrowseTime" width="170"></el-table-column>
          <!-- <el-table-column label="离开时间" width="170">
            <template slot-scope="scope">
              {{
                            scope.row.endTime
                                ? formatDate(scope.row.endTime, "yyyy-MM-dd hh:mm:ss")
                                : "-"
                            }}
            </template>
          </el-table-column> -->
          <el-table-column label="操作" fixed="right" width="240">
            <template slot-scope="scope">
              <span @click="handleClick(scope.row)" class="table_txt">
                浏览记录
              </span>
            </template>
          </el-table-column>
        </el-table>
        <no-date v-if="!enterTable.length"></no-date>
      </div>
      <pagination v-if="enterTable.length" :total="total" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>
      <BrowsingHistory v-if="showHistory" :infoFormVisible='showHistory' @closeInfoForm='closeInfoForm' :customerRow='customerRow'></BrowsingHistory>
    </div>
  </div>
</template> 
<script>
import { MaterialDetail, NewMaterialDetail } from '../../../config/api'
import { sop_employeeList } from '@/api/sop'
import { formatDuring, formatDate } from '../../../utils/tool'

import GoBack from '../../../components/MaterialTemplate/goBack'
import NoDate from '../../../components/noDate'
import Pagination from '../../../components/elPagination'
import BrowsingHistory from './BrowsingHistory'
export default {
  name: 'materialDetails',
  data() {
    return {
      dataLoading: false,
      articleId: '',
      documentId: '',
      posterId: '',
      total: 0,
      pageInfo: {
        page: 1,
        limit: 10,
      },
      enterTable: [],
      userName: '',
      responUser: '',
      userList: [],
      showHistory: false,
      indexLi: 0,
      tabList: [
        { name: '全部', id: 0 },
        { name: '带来客户', id: 1 },
        { name: '带来线索', id: 2 },
        { name: '带来新线索', id: 3 },
      ],
      customerRow: {},
    }
  },
  created() {
    const { articleId, documentId, posterId } = this.$route.query

    this.articleId = articleId
    this.documentId = documentId
    this.posterId = posterId
    this.getList()
    this.getUserList()
  },
  methods: {
    checkTable() {
      this.getList()
    },
    resetTable() {
      this.userName = ''
      this.responUser = ''
      this.getList()
    },
    getUserList() {
      //获取员工列表
      sop_employeeList().then((res) => {
        if (res.result) {
          this.userList = res.data
        }
      })
    },
    tabClick(v) {
      this.indexLi = v.id
      this.getList()
    },
    handleClick(row) {
      // console.log('---customerId---', row)
      this.showHistory = true
      this.customerRow = row
    },
    closeInfoForm() {
      this.showHistory = false
    },
    getList() {
      this.dataLoading = true
      let materialId = this.articleId,
        materialType = 1
      if (this.documentId) {
        materialId = this.documentId
        materialType = 2
      }
      if (this.posterId) {
        materialId = this.posterId
        materialType = 3
      }
      const { page, limit } = this.pageInfo

      let params = {
        pageIndex: page,
        pageSize: limit,
        materialId,
        materialType,
        customerType: this.indexLi,
        customerName: this.userName,
        userNo: this.responUser,
      }

      NewMaterialDetail(params).then((res) => {
        const { code, data, msg } = res
        if (code === 'success') {
          this.enterTable = data.page ? data.page.records : []
          this.total = data.page ? data.page.total : 0
        } else {
          this.$message.error(msg)
        }
        this.dataLoading = false
      })
    },
    pageChange() {
      this.getList()
    },
    formatDuring,
    formatDate,
    // 选择负责人
    userChange(val) {},
  },
  filters: {
    getType(type) {
      if (type == 1) {
        return '客户'
      } else if (type == 2) {
        return '线索'
      } else if (type == 3) {
        return '新线索'
      }
    },
    avatar(val) {
      return val ? val.substring(0, 1) : ''
    },
  },
  components: {
    Pagination,
    GoBack,
    NoDate,
    BrowsingHistory,
  },
}
</script>
<style lang="less" scoped>
@import url('./style/main');
@import '@/styles/elementStyle';
.material-details-box {
  height: calc(100% - 40px);
  .material-details {
    padding: 16px;
  }
}
</style>