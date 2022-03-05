<template>
  <div class="detailWarp">
    <div class="goback pointer" @click="goback">
      <img src="../../../assets/images/goback.png" alt="" /> 返回
    </div>
    <div class="mainContent">
      <div class="navBar">朋友圈详情</div>
      <div class="seeCustome">
        <span>创建人员：</span>
        <span>{{createBy}}</span>
      </div>
      <div class="seeCustome">
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标题：</span>
        <span>{{title}}</span>
      </div>
      <div class="seeCustome">
        <span>创建时间：</span>
        <span>{{ createTime ? formatDate( createTime ,'yyyy-MM-dd hh:mm:ss') : '-'}}</span>
      </div>
      <div class="seeCustome">
        <span>内容详情：</span>
        <div class="detailBox">
          <span class="content_txt">{{content}}</span>
          <div class="imgBox" v-show="msgtype == 'image'">
            <span v-for="(item,index) in dataList" :key="index">
              <img :src="item" alt="" />
            </span>
          </div>
          <div v-show="msgtype == 'video'" class="imgBox">
            <video :src="imgText" controls="controls" ref="video" />
          </div>
          <div v-show="msgtype == 'link'" class="linkBox">
            <!-- {{imgText}} -->
            <!-- <p class="linkBox_cont">111</p> -->
            <div class="linkBox_flex">
              <div>
                <div class="linkBox_tite">{{title}}</div>
                <div class="linkBox_link">{{Listdetails.link}}</div>
              </div>
              <div class="linkBox_img">
                <img :src="Listdetails.img" alt="">
              </div>
            </div>
          </div>
          <div v-show="msgtype == 'pdf'" class="linkBox">

            <div class="linkBox_flex">
              <div class="linkBox_img">
                <img src="../../../assets/images/pdf_image.png" alt="">
              </div>
              <div>
                <div class="linkBox_tite">{{Listdetails.tite}}</div>
                <div class="linkBox_link">{{Listdetails.size}}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tableContent">
      <div class="navBar">员工发表情况</div>
      <div class="searchBar">
        <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm" label-position="right">
          <el-row type="flex" :gutter="20">
            <el-col :span="6">
              <el-form-item label="发表员工：">
                <el-input v-model="ruleForm.name" placeholder="请输入" maxlength="30" minlength="2">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发表情况：">
                <el-select v-model="ruleForm.status" placeholder="请选择" @change="changeSource" clearable>
                  <el-option v-for="item in optionsCreat" :key="item.value" :label="item.name" :value="item.type">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div class="flex ml-10">
                <el-button type="primary" @click="submitForm()" class="but_click">查询</el-button>
                <el-button @click="resetForm()" class="but_hove">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tableWarp" v-loading='loading'>
        <el-table style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
          <el-table-column label="编号" type="index" width="200px"></el-table-column>
          <el-table-column label="发表员工" prop="name" align="center" min-width="33%"></el-table-column>
          <el-table-column label="发表情况" align="right" min-width="33%">
            <template slot-scope="scope">
              {{scope.row.status ? '已发表' :' 未发表'}}
            </template>
          </el-table-column>
          <div slot="empty" class="empty" style="padding-top: 100px">
            <img src="../../../assets/images/nodae.png" alt="" style="width: 280px; height: 233px" />
          </div>
        </el-table>
      </div>
      <div class="pagePosition">
        <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from '../../../utils/tool'
import { getTableData } from '../../../api/friend'
import Pagination from '../../../components/elPagination.vue'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      createBy: '',
      title: '',
      createTime: '',
      content: '',
      Listdetails: [
        {
          tite: '',
          link: '',
          img: '',
          Abstrac: '',
          size: '',
        },
      ],
      msgtype: '',
      imgText: null,
      momentId: null,
      ruleForm: {
        name: '',
        status: '',
      },
      optionsCreat: [
        { name: '未发表', type: '0' },
        { name: '已发表', type: '1' },
      ],
      tableData: [],
      dataList: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      loading: false,
    }
  },
  created() {},
  mounted() {
    let rowObj = JSON.parse(this.$route.query.rows)
    console.log('---rowObj---', rowObj)
    this.createBy = rowObj.createBy
    this.title = rowObj.title
    this.dataList = rowObj.urls
    this.Listdetails.link = rowObj.urls[0]
    this.Listdetails.img = rowObj.urls[1]
    this.Listdetails.tite = rowObj.urls[2]
    // this.Listdetails.tite = rowObj.urls[3]
    this.Listdetails.Abstrac = rowObj.urls[4]
    this.Listdetails.size = this.$filterSize(rowObj.urls[4])

    // this.Listdetails.link = rowObj.urls[3]
    // this.Listdetails.img = rowObj.urls[2]
    // this.Listdetails.tite = rowObj.urls[1]
    // this.Listdetails.Abstrac = rowObj.urls[3]
    // this.Listdetails.size =   this.$filterSize(rowObj.urls[4])

    this.createTime = rowObj.createTime
    this.content = rowObj.content
    if (rowObj.msgtype == 'link' || rowObj.msgtype == 'video') {
      this.imgText = rowObj.urls[0] || ''
    } else {
      this.imgText = rowObj.urls || []
    }
    this.msgtype = rowObj.msgtype
    this.momentId = rowObj.momentId
    this.getTableList()
  },
  methods: {
    formatDate,
    goback() {
      this.$router.go(-1)
    },
    getTableList() {
      this.loading = true
      let params = {
        momentId: this.momentId || '',
        ...this.ruleForm,
        ...this.pageInfo,
      }
      getTableData(params).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    changeSource() {},
    submitForm() {
      this.pageInfo.page = 1
      this.getTableList()
    },
    resetForm() {
      Object.keys(this.ruleForm).forEach((item) => {
        this.ruleForm[item] = ''
      })
      this.getTableList()
    },
    pageChange(item) {
      this.getTableList()
      // console.log('', item)
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
.detailWarp {
  font-size: 14px;
  color: #3c4353;
  // font-family: PingFangSC-Regular, PingFang SC;
  .goback {
    margin: 0 0 16px 0;
    color: #4168f6;
    font-family: 600;
    img {
      width: 8px;
      height: 12px;
      vertical-align: middle;
    }
  }
  .mainContent {
    background: #fff;
    border-radius: 8px;
    padding: 0 16px 16px;
    .navBar {
      color: #3c4353;
      font-weight: 600;
      font-size: 14px;
      line-height: 44px;
      padding: 0 16px 0 10px;
      position: relative;
      border-bottom: 1px solid #f0f2f7;

      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 14px;
        background: #4168f6;
        left: 0;
        top: 14px;
      }
    }
    .seeCustome {
      display: flex;
      margin-top: 15px;
      .detailBox {
        width: 816px;
        min-height: 140px;
        background: #fafbff;
        border-radius: 4px;
        border: 1px solid #d9dae4;
        padding: 16px;
        .content_txt {
          word-wrap: break-word;
        }
        .imgBox {
          display: flex;
          margin-top: 8px;
          img,
          video {
            width: 80px;
            height: 80px;
            margin-right: 8px;
          }
        }
        .linkBox {
          margin-top: 8px;
          // padding: 16px;
          // width: 300px;
          // height: 80px;
          // background: #ffffff;
          // border: 1px solid #d9dae4;
          .linkBox_cont {
            font-weight: 400;
            color: #3c4353;
            font-size: 14px;
          }
          .linkBox_flex {
            display: flex;
            width: 300px;
            height: 80px;
            background: #ffffff;
            border: 1px solid #d9dae4;
            align-items: center;
            justify-content: space-around;
            .linkBox_tite {
              font-size: 14px;
              font-weight: 400;
              color: #3c4353;
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .linkBox_link {
              font-weight: 400;
              color: #c0c4cc;
              font-size: 12px;
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-top: 11px;
            }
            .linkBox_img {
              img {
                width: 50px;
                height: 50px;
              }
            }
          }
        }
      }
    }
  }
  .tableContent {
    margin-top: 16px;
    background: #fff;
    border-radius: 8px;
    padding: 0 16px 16px;
    .navBar {
      color: #3c4353;
      font-weight: 600;
      font-size: 14px;
      line-height: 44px;
      padding: 0 16px 0 10px;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 14px;
        background: #4168f6;
        left: 0;
        top: 14px;
      }
    }
    .searchBar {
      padding: 16px 0 0 0;
      /deep/.el-form-item__label {
        padding: 0;
      }
      /deep/.el-form-item__content {
        margin-left: 80px !important;
      }
      /deep/.el-select {
        height: 32px;
        width: 100%;
        line-height: 32px;
        .el-input__icon {
          height: 32px;
          line-height: 32px;
        }
      }
    }
    .tableWarp {
      min-height: 500px;
      padding: 0 16px;
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
        }
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
    }
  }
}
</style>