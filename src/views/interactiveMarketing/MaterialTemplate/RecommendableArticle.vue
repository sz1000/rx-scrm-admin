<template>
  <div class="content-box recommendable-article">
    <div class="checkedTab">
      <span @click="tabClick('1')" :class="{'active':tab=='1'}">个人素材库</span>
      <span @click="tabClick('2')" :class="{'active':tab=='2'}">公共素材库</span>
    </div>
    <!-- 查询重置 -->
    <search ref="search" hasTime='1'></search>
    <div v-show="expandedKeys.some(item=>item.enName == 'add')" class="pointer add-btn" @click.stop.prevent="showAddBox">
      <img src="../../../assets/images/icon_add@2x.png" alt="" />
      新增
      <ul v-if="ifShowAddBox" class="add-btns">
        <li class="item" @click="write(1)">写文章</li>
        <li class="item" @click="write(2)">转载公众号文章</li>
      </ul>
    </div>
    <div class="table-warp">
      <el-table :data="enterTable" v-loading="dataLoading" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }">
        <el-table-column type="index" width="60px" label="编号" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="120" label="标题">
          <template slot-scope="scope">
            <div class="info">
              <div class="avatar" :class="{'bg':!scope.row.cover}">
                <img v-if="scope.row.cover" class="img" :src="scope.row.cover" alt="">
                <!-- <span v-else>{{scope.row.materialName | avatar}}</span> -->
              </div>
              <div class="name">{{scope.row.materialName}}</div>
            </div>

          </template>

        </el-table-column>

        <el-table-column prop="newClueCount" label="带来新线索" min-width="120"> </el-table-column>
        <el-table-column prop="clueCount" label="带来线索" min-width="100"> </el-table-column>
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
        <el-table-column label="操作" fixed="right" width="240">
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
    <!-- 分享链接 -->
    <share-dialog ref="shareDialog"></share-dialog>
    <!-- 转载公众号文章 -->
    <reprint-dialog ref="reprintDialog"></reprint-dialog>
    <!-- 删除 -->
    <delete-dialog ref="deleteDialog"></delete-dialog>
    <!-- 预览 -->
    <preview-box ref="previewBox"></preview-box>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { ArticleList, DeleteArticle, NewGetList } from '../../../config/api'

import { formatDate } from '../../../utils/tool'

import MyMixin from '../../../mixins/permissions'

import NoDate from '../../../components/noDate'
import Search from '../../../components/MaterialTemplate/search'
import Pagination from '../../../components/elPagination'
import ShareDialog from '../../../components/MaterialTemplate/dialog/share'
import reprintDialog from '../../../components/MaterialTemplate/dialog/reprint'
import DeleteDialog from '../../../components/MaterialTemplate/dialog/delete'
import PreviewBox from '../../../components/Dialog/PreviewBox/index'

export default {
  name: 'recommendableArticle',
  mixins: [MyMixin],
  data() {
    return {
      tab: '1',
      dataLoading: true,
      total: 0,
      pageInfo: {
        page: 1,
        limit: 10,
      },
      enterTable: [],
      ifShowAddBox: false,
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
    }
  },
  async created() {
    await this.getCorpId()
    this.getList()
  },
  filters: {
    avatar(val) {
      return val ? val.substring(0, 1) : ''
    },
  },
  methods: {
    ...mapActions(['getCorpId']),
    // 切换
    tabClick(index) {
      this.$refs.search.initData()
      this.tab = index
      this.getList()
    },
    getList(paramsData) {
      const { title, beginTime = null, endTime = null } = paramsData || {}
      const { page, limit } = this.pageInfo
      let params = {
        materialType: '1',
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
      // this.pageInfo.page = 1
      // this.getList(data)
    },
    resetTable() {
      // this.$refs.search.searchText = ''
      this.$refs.search.initData()
      this.getList()
    },

    // 新增
    write(type) {
      switch (type) {
        case 1:
          this.$router.push({
            path: '/interactivemarketing/editArticle',
            query: {
              tab: this.tab,
            },
          })
          break
        case 2:
          this.$refs.reprintDialog.show(this.tab)
          break
      }
    },

    // 操作
    shareLink(articleId) {
      this.$refs.shareDialog.show(articleId, 1, this.tab)
    },
    handleEdit(articleId) {
      const params = {
        articleId,
        menuFlag: true,
        type: 1,
      }
      this.$router.push({
        path: '/interactivemarketing/editArticle',
        query: params,
      })
    },
    handleClick(articleId) {
      const params = {
        articleId,
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
      const { code, msg } = await DeleteArticle(id)
      if (code === 'success') {
        this.getList()
        this.$message.success(msg)
        this.$refs.deleteDialog.hide()
      } else {
        this.$message.error(msg)
      }
    },

    preview(obj) {
      console.log(obj)
      this.$refs.previewBox.show({ materialType: '1', ...obj })
    },

    // 显示新增内部选项
    showAddBox() {
      this.ifShowAddBox = !this.ifShowAddBox
      this.appClick()
    },
    appClick() {
      document.getElementById('app').onclick = () => {
        this.ifShowAddBox = false
      }
    },

    formatDate,
  },
  components: {
    NoDate,
    Search,
    Pagination,
    ShareDialog,
    reprintDialog,
    DeleteDialog,
    PreviewBox,
  },
}
</script>
<style lang="less" scoped>
@import url('./style/main');
</style>