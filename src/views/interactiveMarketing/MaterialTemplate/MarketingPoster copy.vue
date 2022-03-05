<template>
  <div class="content-box marketing-poster">
    <div class="checkedTab">
      <span @click="tabClick('1')" :class="{'active':tab=='1'}">个人素材库</span>
      <span @click="tabClick('2')" :class="{'active':tab=='2'}">公共素材库</span>
    </div>
    <!-- 查询重置 -->
    <search ref="search" :title="`海报名称`"></search>

    <div v-show="expandedKeys.some(item=>item.enName == 'upload')" class="pointer add-btn" @click="showUpload">
      <img src="../../../assets/images/icon_shangchuan.png" alt="" />
      上传
    </div>
    <div v-loading="dataLoading" class="table-warp">
      <div v-for="i in enterTable" class="box" :key="i.mediaId">
        <div class="img">
          <img class="img-url" :src="i.posterUrl" alt="">
          <div class="mask-box">
            <ul>
              <li v-show="expandedKeys.some(item=>item.enName == 'download')" class="item download">
                <a :href="i.posterUrl">
                  <img src="../../../assets/images/icon_download.png" alt="">
                  <span>下载</span>
                </a>
              </li>
              <li v-show="expandedKeys.some(item=>item.enName == 'delete')" class="item delete" @click="deleteRow(i.posterId)">
                <img src="../../../assets/images/icon_delete.png" alt="">
                <span>删除</span>
              </li>
            </ul>
          </div>
        </div>
        <p class="one-line">{{i.posterName}}</p>
      </div>

      <no-date v-if="!enterTable.length"></no-date>
    </div>

    <pagination v-if="enterTable.length" :total="total" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>

    <upload-dialog ref="uploadDialog"></upload-dialog>

    <delete-dialog ref="deleteDialog"></delete-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

import { PosterList, DeletePoster } from '../../../config/api'

import MyMixin from '../../../mixins/permissions'

import NoDate from '../../../components/noDate'
import Search from '../../../components/MaterialTemplate/search'
import Pagination from '../../../components/elPagination'
import UploadDialog from '../../../components/MaterialTemplate/dialog/uploadPoster'
import DeleteDialog from '../../../components/MaterialTemplate/dialog/delete'

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
    await this.getCorpId()
    this.getList()
  },
  methods: {
    ...mapActions(['getCorpId']),
    tabClick(val) {
      this.tab = val
      this.getList()
    },
    getList(name) {
      this.dataLoading = true
      const { page, limit } = this.pageInfo
      let params = {
        pageIndex: page,
        pageSize: limit,
        name,
        corpId: this.corpId,
        isPersonal: this.tab == 1 ? true : false,
      }

      PosterList(params).then((res) => {
        const { code, data, msg } = res
        if (code === 'success') {
          this.enterTable = data.page.records
          this.total = data.page.total
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
    checkTable(data) {
      this.pageInfo.page = 1
      this.getList(data)
    },
    resetTable() {
      this.$refs.search.searchText = ''
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