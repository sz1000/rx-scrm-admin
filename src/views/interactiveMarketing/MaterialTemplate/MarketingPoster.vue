<template>
  <div class="content-box marketing-poster">
    <div class="checkedTab">
      <span @click="tabClick('1')" :class="{'active':tab=='1'}">个人素材库</span>
      <span @click="tabClick('2')" :class="{'active':tab=='2'}">公共素材库</span>
    </div>
    <!-- 查询重置 -->
    <search ref="search" :title="`海报名称`" hasTime='1'></search>

    <div v-show="expandedKeys.some(item=>item.enName == 'upload')" class="pointer add-btn" @click="showUpload">
      <img src="../../../assets/images/icon_shangchuan.png" alt="" />
      上传
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
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="scope">
            <span @click="shareLink(scope.row.materialId)" class="table_txt">
              分享
            </span>
            <span @click="preview(scope.row)" class="table_txt">
              预览
            </span>
            <span v-show="expandedKeys.some(item=>item.enName == 'download')" @click=" downLoadfile(scope.row)" class="table_txt">
              下载
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

    <delete-dialog ref="deleteDialog"></delete-dialog>
    <!-- 预览 -->
    <preview-box ref="previewBox"></preview-box>
    <!-- 分享 -->
    <share-dialog ref="shareDialog"></share-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

import { PosterList, DeletePoster, NewGetList } from '../../../config/api'

import MyMixin from '../../../mixins/permissions'

import NoDate from '../../../components/noDate'
import Search from '../../../components/MaterialTemplate/search'
import Pagination from '../../../components/elPagination'
import UploadDialog from '../../../components/MaterialTemplate/dialog/uploadPoster'
import DeleteDialog from '../../../components/MaterialTemplate/dialog/delete'
import PreviewBox from '../../../components/Dialog/PreviewBox/index'
import ShareDialog from '../../../components/MaterialTemplate/dialog/share'

export default {
  name: 'marketingPoster',
  mixins: [MyMixin],
  data() {
    return {
      tab: 1,
      total: 0,
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
    // console.log('--expandedKeys---', this.expandedKeys)
    await this.getCorpId()
    this.getList()
  },
  methods: {
    ...mapActions(['getCorpId']),
    // 预览
    preview(obj) {
      // console.log(obj)
      this.$refs.previewBox.show({ materialType: '3', ...obj })
    },
    // 分享
    shareLink(documentId) {
      this.$refs.shareDialog.show(documentId, 3, this.tab)
    },
    // 下载
    downLoadfile(file) {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', file.cover)
      a.click()
    },
    // 编辑
    handleEdit(documentId) {
      this.$refs.uploadDialog.show(documentId)
    },
    // 浏览
    handleClick(posterId) {
      const params = {
        posterId,
        menuFlag: true,
        type: 1,
      }
      this.$router.push({
        path: '/interactivemarketing/materialDetails',
        query: params,
      })
    },
    tabClick(val) {
      this.tab = val
      this.getList()
    },
    getList(paramsData) {
      this.dataLoading = true
      const { title, beginTime = null, endTime = null } = paramsData || {}
      const { page, limit } = this.pageInfo
      let params = {
        // pageIndex: page,
        // pageSize: limit,
        // name,
        // corpId: this.corpId,
        // isPersonal: this.tab == 1 ? true : false,
        materialType: '3',
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
          this.$message({
            type: 'error',
            message: msg,
          })
        }
        this.dataLoading = false
      })
    },
    pageChange(item) {
      console.log('', item)
      this.getList()
    },
    // 新增
    showUpload() {
      this.$refs.uploadDialog.show()
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

    deleteRow(posterId) {
      this.$refs.deleteDialog.show(posterId)
    },
    async doDelete(id) {
      const { code, msg } = await DeletePoster(id)
      if (code === 'success') {
        this.getList()
        this.$message.success(msg)
        this.$refs.deleteDialog.hide()
      } else {
        this.$message.error(msg)
      }
    },
  },
  components: {
    NoDate,
    Search,
    Pagination,
    UploadDialog,
    DeleteDialog,
    PreviewBox,
    ShareDialog,
  },
}
</script>
<style lang="less" scoped>
@import url('./style/main');
.table-warp {
  margin-top: 64px;
  padding: 16px 0;
  .box {
    display: inline-block;
    width: 226px;
    vertical-align: middle;
    margin: 0 0 16px 16px;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    .img {
      width: 226px;
      height: 226px;
      border-radius: 8px;
      background-color: #f6f7f9;
      overflow: hidden;
      position: relative;
      .img-url {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .mask-box {
        width: 226px;
        height: 226px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: -100%;
        left: 0;
        ul {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .item {
          width: 76px;
          height: 32px;
          line-height: 32px;
          border-radius: 4px;
          font-size: 14px;
          color: #fff;
          &:hover {
            border: 1px solid #fff;
          }
          a {
            display: block;
          }
        }
      }
    }
    p {
      margin-top: 8px;
      word-break: break-all;
      font-size: 14px;
      color: #3c4353;
    }
    &:hover {
      .mask-box {
        top: 0;
      }
    }
  }
}
</style>