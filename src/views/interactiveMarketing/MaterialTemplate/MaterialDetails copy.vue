<template>
  <div class="material-details-box">
    <go-back></go-back>
    <div class="content-box material-details">
      <div class="table-warp">
        <el-table :data="enterTable" v-loading="dataLoading" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }">
          <el-table-column type="index" width="60px" label="编号" align="left"></el-table-column>
          <el-table-column prop="customerName" show-overflow-tooltip label="姓名"></el-table-column>
          <el-table-column prop="visitorsCount" show-overflow-tooltip label="电话" width="130"></el-table-column>
          <el-table-column prop="externalType" label="客户状态">
            <template slot-scope="scope">{{ scope.row.externalType | getType }}</template>
          </el-table-column>
          <el-table-column prop="chargeName" show-overflow-tooltip label="负责人"> </el-table-column>
          <el-table-column prop="followUserNames" show-overflow-tooltip label="协助人"> </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">{{ scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "-"}}</template>
          </el-table-column>
          <el-table-column prop="address" show-overflow-tooltip label="地区"> </el-table-column>
          <el-table-column prop="duration" label="浏览时长" width="170">
            <template slot-scope="scope">{{ scope.row.duration ? formatDuring(scope.row.duration*1000) : "0秒" }}</template>
          </el-table-column>
          <el-table-column label="打开时间" width="170">
            <template slot-scope="scope">
              {{
                            scope.row.beginTime
                                ? formatDate(scope.row.beginTime, "yyyy-MM-dd hh:mm:ss")
                                : "-"
                            }}
            </template>
          </el-table-column>
          <el-table-column label="离开时间" width="170">
            <template slot-scope="scope">
              {{
                            scope.row.endTime
                                ? formatDate(scope.row.endTime, "yyyy-MM-dd hh:mm:ss")
                                : "-"
                            }}
            </template>
          </el-table-column>
        </el-table>

        <no-date v-if="!enterTable.length"></no-date>

      </div>
      <pagination v-if="enterTable.length" :total="total" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>
    </div>
  </div>
</template> 
<script>
import { MaterialDetail, NewMaterialDetail } from '../../../config/api'

import { formatDuring, formatDate } from '../../../utils/tool'

import GoBack from '../../../components/MaterialTemplate/goBack'
import NoDate from '../../../components/noDate'
import Pagination from '../../../components/elPagination'

export default {
  name: 'materialDetails',
  data() {
    return {
      dataLoading: false,
      articleId: '',
      documentId: '',
      total: 0,
      pageInfo: {
        page: 1,
        limit: 10,
      },
      enterTable: [],
    }
  },
  created() {
    const { articleId, documentId } = this.$route.query

    this.articleId = articleId
    this.documentId = documentId
    this.getList()
  },
  methods: {
    getList() {
      this.dataLoading = true
      let materialId = this.articleId,
        materialType = 1
      if (this.documentId) {
        materialId = this.documentId
        materialType = 2
      }
      const { page, limit } = this.pageInfo

      let params = {
        pageIndex: page,
        pageSize: limit,
        materialId,
        materialType,
      }

      NewMaterialDetail(params).then((res) => {
        const { code, data, msg } = res
        if (code === 'success') {
          this.enterTable = data.page ? data.page.records : []
          this.total = data.page ? data.page.total : ''
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
  },
  components: {
    Pagination,
    GoBack,
    NoDate,
  },
}
</script>
<style lang="less" scoped>
@import url('./style/main');
.material-details-box {
  height: calc(100% - 40px);
  .material-details {
    padding: 16px;
  }
}
</style>