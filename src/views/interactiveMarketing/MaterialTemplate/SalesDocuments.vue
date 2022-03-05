<template>
  <div class="content-box sales-documents">
    <div class="checkedTab">
      <span @click="tabClick('1')" :class="{'active':tab=='1'}">个人素材库</span>
      <span @click="tabClick('2')" :class="{'active':tab=='2'}">公共素材库</span>
    </div>
    <!-- 查询重置 -->
    <search ref="search" :title="`文件名称`" hasTime='1'></search>

    <div v-show="expandedKeys.some(item=>item.enName == 'upload')" class="pointer add-btn" @click="showUpload">
      <img src="../../../assets/images/icon_shangchuan.png" alt="" />
      上传
    </div>
    <div class="table-warp">
      <el-table :data="enterTable" v-loading="dataLoading" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }">
        <el-table-column type="index" width="60px" label="编号" align="left"></el-table-column>
        <el-table-column label="文件名称" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            <div class="item_one">
              <img :src="scope.row.cover" alt="" />
              <span>{{scope.row.materialName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="newClueCount" label="带来新线索" min-width="120"> </el-table-column>
        <el-table-column prop="clueCount" label="带来线索" min-width="120"> </el-table-column>
        <el-table-column prop="customerCount" label="带来客户" min-width="100"> </el-table-column>
        <el-table-column prop="visitorsCount" label="浏览人数" min-width="100"> </el-table-column>
        <el-table-column prop="openCount" label="浏览次数" min-width="100"> </el-table-column>
        <el-table-column prop="createUserName" show-overflow-tooltip label="创建人员"> </el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            {{
                        scope.row.createTime
                            ? formatDate(scope.row.createTime, "yyyy-MM-dd hh:mm:ss")
                            : "-"
                        }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <span v-show="expandedKeys.some(item=>item.enName == 'shareurl')" @click="shareLink(scope.row.materialId)" class="table_txt">
              分享
            </span>
            <span @click="preview(scope.row)" class="table_txt">
              预览
            </span>
            <span v-show="expandedKeys.some(item=>item.enName == 'edit')" @click="handleEdit(scope.row.materialId)" class="table_txt">
              编辑
            </span>
            <span v-show="expandedKeys.some(item=>item.enName == 'delete')" @click="deleteRow(scope.row.materialId)" class="table_txt">
              删除
            </span>
            <span @click="handleClick(scope.row.materialId)" class="table_txt">
              浏览详情
            </span>
          </template>
        </el-table-column>
      </el-table>

      <no-date v-if="!enterTable.length"></no-date>
    </div>

    <pagination v-if="enterTable.length" :total="total" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>

    <upload-dialog ref="uploadDialog" :isPublic='tab'></upload-dialog>

    <share-dialog ref="shareDialog"></share-dialog>

    <delete-dialog ref="deleteDialog"></delete-dialog>
    <!-- 预览 -->
    <preview-box ref="previewBox"></preview-box>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

import {
  SaleDocumentList,
  DeleteSaleDocument,
  NewGetList,
} from '../../../config/api'

import { formatDate } from '../../../utils/tool'
import PreviewBox from '../../../components/Dialog/PreviewBox/index'
import MyMixin from '../../../mixins/permissions'
import NoDate from '../../../components/noDate'
import Search from '../../../components/MaterialTemplate/search'
import Pagination from '../../../components/elPagination'
import UploadDialog from '../../../components/MaterialTemplate/dialog/upload'
import ShareDialog from '../../../components/MaterialTemplate/dialog/share'
import DeleteDialog from '../../../components/MaterialTemplate/dialog/delete'

export default {
  name: 'salesDocuments',
  mixins: [MyMixin],
  data() {
    return {
      total: 0,
      tab: 1,
      pageInfo: {
        page: 1,
        limit: 10,
      },
      enterTable: [],
      dataLoading: false,
    }
  },
  computed: {
    ...mapState(['corpId']),
  },
  provide() {
    return {
      doDelete: this.doDelete,
      checkTable: this.checkTable,
      resetTable: this.resetTable,
      getList: this.getList,
    }
  },
  async created() {
    await this.getCorpId()
    this.getList()
  },
  methods: {
    ...mapActions(['getCorpId']),
    // 预览
    preview(obj) {
      console.log(obj)
      this.$refs.previewBox.show({ materialType: '2', ...obj })
    },
    // t个人 公共切换
    tabClick(val) {
      // console.log(val)
      this.tab = val
      this.getList()
    },
    getList(paramsData) {
      this.dataLoading = true
      const { title, beginTime = null, endTime = null } = paramsData || {}
      const { page, limit } = this.pageInfo
      let params = {
        materialType: '2',
        pageIndex: page,
        pageSize: limit,
        name: title,
        beginTime,
        endTime,
        corpId: this.corpId,
        isPersonal: this.tab == 1 ? true : false,
      }

      NewGetList(params).then((res) => {
        const { code, data, msg } = res
        if (code === 'success') {
          this.enterTable = data.records
          this.total = data.total
        } else {
          this.$message.error(msg)
        }
        this.dataLoading = false
      })
    },
    pageChange(item) {
      console.log('', item)
      this.getList()
    },
    // 查询
    checkTable(data, date) {
      this.pageInfo.page = 1
      const { beginTime = null, endTime = null } = date

      let paramsData = {
        title: data,
        beginTime,
        endTime,
      }
      this.getList(paramsData)
    },
    resetTable() {
      // this.$refs.search.searchText = ''
      this.$refs.search.initData()
      this.getList()
    },

    // 新增
    showUpload() {
      this.$refs.uploadDialog.show()
    },

    // 操作
    shareLink(documentId) {
      this.$refs.shareDialog.show(documentId, 2, this.tab)
    },
    handleEdit(documentId) {
      this.$refs.uploadDialog.show(documentId)
    },
    handleClick(documentId) {
      const params = {
        documentId,
        menuFlag: true,
        type: 1,
      }
      this.$router.push({
        path: '/interactivemarketing/materialDetails',
        query: params,
      })
    },
    deleteRow(id) {
      this.$refs.deleteDialog.show(id)
    },
    async doDelete(id) {
      const { code, msg } = await DeleteSaleDocument(id)
      if (code === 'success') {
        this.getList()
        this.$message.success(msg)
        this.$refs.deleteDialog.hide()
      } else {
        this.$message.error(msg)
      }
    },

    formatDate,
  },
  components: {
    NoDate,
    Search,
    Pagination,
    UploadDialog,
    ShareDialog,
    DeleteDialog,
    PreviewBox,
  },
}
</script>
<style lang="less" scoped>
@import url('./style/main');
.table-warp {
  .item_one {
    display: flex;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>