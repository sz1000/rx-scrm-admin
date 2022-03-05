<template>
  <div class="mater_box">
    <el-dialog title="从素材库选择" :visible.sync="dialogVisible" :modal="modals" width="800px" :before-close="dialogBeforeClose">
       <div class="material-tab">
        <div :class="{'active' : type == 1}" class="nomalText" @click="tabClick(1)">个人素材库</div>
        <div :class="{'active' : type == 2}" class="nomalText mr" @click="tabClick(2)">公共素材库</div>
      </div>
      <div class="tabBar">
        <span class="title" :class="{'active' : tab==1}" @click="selectTab(1)">文章</span>
        <span class="title" :class="{'active' : tab==2}" @click="selectTab(2)">文件</span>
        <span class="title" :class="{'active' : tab==3}" @click="selectTab(3)">海报</span>
      </div>
      <div class="searchTitie">
        <span class="articleName">{{articTitle}}</span>
        <span class="search">
          <el-input placeholder="请输入内容" v-model="searchInput">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
        </span>
      </div>
      <div class="radio_group" v-loading='loading'>
        <el-radio-group v-model="radio" @change='changeRadio'>
          <div v-if="tab == 1">
            <el-radio v-for="(item,index) in radioList" :key="index" :label="item">
              <span class="tab_article">
                <img :src="item.cover" alt="" v-if="item.cover" />
                <img src="../../assets/images/article.png" alt="" v-else />
                <span>{{item.title}}</span>
              </span>
            </el-radio>
          </div>
          <div v-if="tab == 2">
            <el-radio v-for="(item,index) in radioList" :key="index" :label="item">
              <span class="tab_article">
                <img :src="item.cover" alt="" />
                <!-- <img src="../../assets/images/pdf_image.png" alt="" /> -->
                <span> {{item.name}}</span>
              </span>
            </el-radio>
          </div>
          <div v-if="tab == 3">
            <el-radio v-for="(item,index) in radioList" :key="index" :label="item">
              <span class="tab_article">
                <img v-if="item.posterUrl" :src="item.posterUrl" alt="" />

                <span> {{item.posterName}}</span>
              </span>
            </el-radio>
          </div>
        </el-radio-group>
      </div>
      <div>
        <!-- :isTo="3" -->
        <!-- <Pagination :total="total" :isTo="5" :pageInfo="pageInfo" @pageChange="pageChange" v-if="radioList.length"></Pagination> -->
        <div class="page_data" v-if="radioList.length">

          <Pagination :total="total" :isTo="5" :pageInfo="pageInfo" @pageChange="pageChange" v-if="radioList.length"></Pagination>

        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogBeforeClose">取 消</el-button>
        <el-button type="primary" @click="sureDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '../sucaiPage.vue'
import { ArticleList, SaleDocumentList, PosterList } from '../../config/api'
export default {
  components: {
    Pagination,
  },
  props: ['dialogVisible', 'modals'],
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
  },
  data() {
    return {
      type: 1,
      tab: 1,
      articTitle: '文章名称',
      searchInput: '',
      // dialogVisible: true,
      // modals:false,
      radioList: [],
      radio: '',
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      loading: false,
    }
  },
  watch: {
    searchInput(val) {
      if (val == '') {
        this.pageInfo.page = 1
      }
    },
  },
  created() {
    if (!this.corpId) {
      this.$store.dispatch('getCorpId').then(() => {
        this.getArticle()
      })
    } else {
      this.getArticle()
    }
  },

  methods: {
        tabClick(val) {
           this.radio = ''
      this.type = val
      this.tab = 1
       this.initPage(this.tab)
      // this.getList()
        this.getArticle()
    },

    selectTab(v) {
      this.pageInfo.page = 1
      this.tab = v
      this.radio = ''
      if (v == 1) {
        this.articTitle = '文章名称'
        this.getArticle()
      } else if (v == 2) {
        this.articTitle = '文件名称'
        this.getFile()
      } else {
        this.articTitle = '海报名称'
        this.getPoster()
      }
    },
    initPage(type) {
      if (type == 1) {
        this.pageInfo.page = 1
        // this.radioList = []
      } else if (type == 2) {
        this.pageInfo.page = 1
        // this.radioList = []
      } else if (type == 3) {
        this.pageInfo.page = 1
        // this.radioList = []
      }
    },
    handleCurrentChange(val) {
      console.log(val)
      this.pageInfo.page = val
        this.getArticle()

    },
    dialogBeforeClose() {
      console.log(1111)
      // this.dialogVisible = false
      // if()
      //  this.tab = 1
      console.log(this.radio, '---')
      // return
      this.$emit('sure', { tab: this.tab })
      // this.$emit('sure', { tab: this.tab, ...this.radio })
    },
    sureDialog() {
      this.$emit('sure', { tab: this.tab, ...this.radio })
      // this.dialogVisible = false
    },
    changeRadio() {
      console.log(this.radio)
    },
    pageChange(item) {
      console.log(item)
      if (this.tab == 1) {
        this.getArticle()
      } else if (this.tab == 2) {
        this.getFile()
      } else {
        this.getPoster()
      }
    },
    search() {
      if (this.tab == 1) {
        this.pageInfo.page = 1
        this.getArticle()
      } else if (this.tab == 2) {
        this.pageInfo.page = 1
        this.getFile()
      } else {
        this.pageInfo.page = 1
        this.getPoster()
      }
    },
    getArticle() {
      this.loading = true
      const { page, limit } = this.pageInfo
      let params = {
        pageIndex: page,
        pageSize: limit,
        // title: this.searchInput,
       isPersonal: this.type == 1 ? true : false,
        corpId: this.corpId,
      }
      ArticleList(params).then((res) => {
        // const { code, data, msg } = res
        // console.log
        // if (code === 'success') {
        this.radioList = res.data.page.records
        this.total = res.data.page.total
        // } else {
        //   this.$message.error(msg)
        // }
        this.loading = false
      })
    },
    getFile() {
      this.loading = true
      const { page, limit } = this.pageInfo
      let params = {
        pageIndex: page,
        pageSize: limit,
        // name: this.searchInput,
         isPersonal: this.type == 1 ? true : false,
        corpId: this.corpId,
      }

      SaleDocumentList(params).then((res) => {
        // const { code, data, msg } = res
        // if (code === 'success') {
        this.radioList = res.data.page.records
        this.total = res.data.page.total
        // } else {
        //   this.$message.error(msg)
        // }
        this.loading = false
      })
    },
    getPoster() {
      this.loading = true
      const { page, limit } = this.pageInfo
      let params = {
        pageIndex: page,
        pageSize: limit,
        // name: this.searchInput,
        isPersonal: this.type == 1 ? true : false,
        corpId: this.corpId,
      }

      PosterList(params).then((res) => {
        this.radioList = res.data.page.records
        this.total = res.data.page.total
        // const { code, data, msg } = res
        // if (code === 'success') {
        //   this.radioList = data.records
        //   this.total = data.total
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: msg,
        //   })
        // }
        this.loading = false
      })
    },
  },
}
</script>
<style lang="less" scoped>
.mater_box {
     .material-tab {
    height: 40px;
    line-height: 40px;
    display: flex;
    font-size: 14px;
    // justify-content: space-around;
    border-bottom: 1px solid #e6e6e6;
    .nomalText {
      // color: #838a9d;
      // width: 80px;
      text-align: center;
    }
    .mr{
      margin-left: 20px;
    }
    .active {
      // color: #3c4353;4168F6
      color: #ffffff;
      color: #4168F6;
      font-weight: bold;
      position: relative;
      border-radius: 4px 4px 0px 0px;
      // padding: 0 8px;
      // &::after {
      //   content: '';
      //   position: absolute;
      //   bottom: 0;
      //   left: 43%;
      //   width: 56px;
      //   height: 8px;
      //   background: #4168f6;
      //   border-radius: 4px;
      // }
    }
  }

  .page_data {
    width: 200px;
    // margin: 0 auto;
    margin-left: -24px;
  }
  /deep/.el-dialog {
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #3c4353;
      }
    }
    .el-dialog__body {
      padding: 16px 32px;
      // height: 491px;
    }
    .el-dialog__footer {
      border-top: 1px solid #d9dae4;
      .el-button {
        width: 60px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        padding: 0;
        border: 1px solid #d9dae4;
      }
      .el-button--primary {
        background: #4168f6;
      }
    }
  }
  .tabBar {
    margin-top: 10px;
    .title {
      display: inline-block;
      text-align: center;
      line-height: 32px;
      margin-right: 8px;
      cursor: pointer;
      width: 60px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px 4px 0px 0px;
      border: 1px solid #d9dae4;
      border-bottom: none;
    }
    .active {
      background: @main;
      color: @white;
    }
  }
  .searchTitie {
    // margin-top: 16px;
    background: #fafbff;
    height: 40px;
    line-height: 40px;
    padding-left: 48px;
    padding-right: 32px;
    display: flex;
    justify-content: space-between;
    .articleName {
      color: #3c4353;
      font-size: 14px;
      font-weight: bold;
      margin-right: 16px;
    }
    .search {
      /deep/.el-input {
        height: 28px;
        line-height: 28px;
        .el-input__inner {
          height: 28px;
          line-height: 28px;
          width: 196px;
        }
        .el-icon-search {
          line-height: 28px;
          cursor: pointer;
        }
      }
    }
  }
  .radio_group {
    height: 355px;
    overflow: auto;
    .el-radio {
      display: flex;
      height: 52px;
      line-height: 52px;
      align-items: center;
      &:hover {
        background: #f0f2f7;
      }
      /deep/.el-radio__input {
        line-height: 52px;
      }
    }
    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
    .tab_article {
      display: flex;
      align-items: center;
      span {
        // white-space: pre-wrap;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 600px;
      }
    }
  }
}
</style>