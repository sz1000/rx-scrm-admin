<template>
  <div class="main-friend">
    <div class="searchBar">
      <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm" :rules="rules" label-position="right">
        <el-row type="flex" justify="space-between" :gutter="20">
          <el-col>
            <el-form-item label="创建人员:">
              <el-input v-model="ruleForm.name" placeholder="请输入" maxlength="30" minlength="2">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="发表情况:">
              <el-select v-model="ruleForm.published" placeholder="请选择" @change="changeSource" clearable>
                <el-option v-for="item in optionsCreat" :key="item.value" :label="item.name" :value="item.status">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <div class="time_flex">
              <div>
                <el-form-item label="创建时间:">
                  <el-date-picker v-model="creatDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                                  value-format="yyyy-MM-dd" @change="changeDate">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="flex ml-10">
              <el-button type="primary" @click="submitForm()" class="but_click">查询</el-button>
              <el-button @click="resetForm()" class="but_hove">重置</el-button>
            </div>
          </el-col> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="标题:">
              <el-input v-model="ruleForm.title" placeholder="请输入标题" maxlength="30" minlength="2">
              </el-input>
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
    <div class="operation flex">
      <el-button class="addBtn pointer" @click="newgroup" v-show="expandedKeys.some(item=>item.enName == 'add')">
        <img src="../../../assets/images/icon_add@2x.png" alt="" />
        新增
      </el-button>
    </div>
    <div class="tableWarp" v-loading='loading'>
      <el-table style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }" :data="tableData">
        <el-table-column label="编号" width="80px" type="index"></el-table-column>
        <el-table-column label="标题" prop="title" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
            <div v-show="scope.row.msgtype == 'image'" class="imgBox">
              <span v-for="(item,index) in (scope.row.imageUrl).slice(0,3)" :key="index">
                <img :src="item" alt="" />
              </span>
              <span class="allPage" v-show="scope.row.imageUrl.length>0">共{{scope.row.urls ? scope.row.urls.length : 0}}张</span>
            </div>
            <div v-show="scope.row.msgtype == 'video'" class="imgBox">
              <video :src="scope.row.urls" controls="controls" ref="video" />
            </div>
            <div v-show="scope.row.msgtype == 'link'">
              {{scope.row.urls ? scope.row.urls[0] : ''}}
            </div>
            <div v-if="scope.row.msgtype == 'pdf' && scope.row.content == ''">
              文件
            </div>
          </template> -->
        </el-table-column>
        <el-table-column label="创建人员" prop="createBy" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="发表情况">
          <template slot-scope="scope">
            {{scope.row.jobStatus ? '已发表' :' 未发表'}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <span @click="handleClick(scope.$index, scope.row)" class="table_txt">查看详情</span>
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
</template>
<script>
import { getDetail } from '../../../api/friend'
import { formatDate } from '../../../utils/tool'
import MyMixin from '../../../mixins/permissions'
import Pagination from '../../../components/elPagination.vue'
export default {
  components: {
    Pagination,
  },
  mixins: [MyMixin],
  data() {
    return {
      ruleForm: {
        published: '',
        name: '',
        title: '',
      },
      creatDate: [],
      optionsCreat: [
        { name: '未发表', status: '0' },
        { name: '已发表', status: '1' },
      ],
      rules: {},
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
    this.getList()
  },
  methods: {
    formatDate,
    getList() {
      this.loading = true
      let createTimeSta = this.creatDate.length
        ? this.creatDate[0] + ' 00:00:00'
        : ''
      let createTimeEnd = this.creatDate.length
        ? this.creatDate[1] + ' 23:59:59'
        : ''
      let params = {
        name: this.ruleForm.name,
        status: this.ruleForm.published,
        createTimeSta: createTimeSta,
        createTimeEnd: createTimeEnd,
        title: this.ruleForm.title,
        ...this.pageInfo,
      }
      getDetail(params).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.iPage.total
        this.loading = false
      })
    },
    submitForm() {
      this.pageInfo.page = 1
      this.getList()
    },
    resetForm() {
      Object.keys(this.ruleForm).forEach((item) => {
        this.ruleForm[item] = ''
      })
      this.creatDate = []
      this.getList()
    },
    changeDate(val) {
      // console.log(val, this.creatDate)
    },
    changeSource() {},
    newgroup() {
      this.$router.push({
        path: 'addFriends',
        query: {
          menuFlag: true,
        },
      })
    },
    handleClick(index, row) {
      this.$router.push({
        path: 'detailFriend',
        query: { rows: JSON.stringify(row) },
      })
    },
    pageChange(item) {
      this.getList()
      // console.log('', item)
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
/deep/.el-input__inner {
  line-height: 32px !important;
}
.main-friend {
  min-height: 100vh;
  border-radius: 8px;
  background-color: #fff;
  padding-bottom: 16px;
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
      .el-input__icon {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .operation {
    padding: 0 16px;
    justify-content: flex-end;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    margin-bottom: 16px;
    img {
      width: 12px;
      height: 12px;
    }

    .addBtn {
      width: 76px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      color: #4168f6;
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
    .imgBox {
      img,
      video {
        width: 40px;
        height: 40px;
        margin-right: 4px;
      }
      .allPage {
        font-size: 12px;
        font-weight: 400;
        color: #838a9d;
        display: inline-block;
        margin-left: 8px;
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
</style>