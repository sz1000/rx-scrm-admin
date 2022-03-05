<template>
  <div class="roleWarp">
    <div class="checkDemand">
      <span class="inputName"> 欢迎语:</span>
      <el-input placeholder="请输入要搜索的欢迎语" v-model.trim="input1">
      </el-input>
      <div @click="checkTable" class="check btnBox pointer but_click">查询</div>
      <div @click="resetTable" class="reset btnBox pointer but_hove">重置</div>
    </div>
    <div class="operation flex">
      <el-tooltip class="item" effect="dark" content="入群欢迎语创建上限为100条" placement="top-start">
        <div class="addBtn pointer" @click="addDiscourse" v-show="expandedKeys.some((item) => item.enName == 'add')">
          <img src="../../assets/images/icon_add@2x.png" alt="" />
          新增
        </div>
      </el-tooltip>
    </div>
    <div class="roleTable" v-loading='loading'>
      <el-table style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }" :data="roleTableData">
        <el-table-column label="编号" width="60px" type="index"></el-table-column>
        <el-table-column label="入群欢迎语" label-width="20%" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>欢迎语1：{{ scope.row.textVal }}</span>
            <div v-if="scope.row.imagePicUrl">
              <span style="height: 60px" class="inlineBlock">欢迎语2:</span>
              <img :src="scope.row.imagePicUrl" alt="" style="
                  width: 60px;
                  height: 60px;
                  vertical-align: bottom;
                  margin-left: 10px;
                " />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some((item) => item.enName == 'edit')">编辑</span>
            <span @click="handleClick(scope.$index, scope.row)" class="table_txt">详情</span>
            <span @click="deleteRow(scope.$index, scope.row)" class="table_txt" v-if="scope.row.roleId !== '1'"
                  v-show="expandedKeys.some((item) => item.enName == 'delete')">
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>

      <NoDate v-if="!roleTableData.length"></NoDate>
    </div>
    <div>
      <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="roleTableData.length"></Pagination>
    </div>
    <div v-if="showAddChannel">
      <AddDiscourse :addChannel="showAddChannel" @closeAddChannel="closeAddChannel"></AddDiscourse>
    </div>
    <div v-if="detailVisible">
      <DetailForm :detailVisible="detailVisible" @closeFrom="closeFrom" :detailForm="detailForm"></DetailForm>
    </div>
    <div v-if="editVisible">
      <EditForm :editVisible="editVisible" @closeEdit="closeEdit" :detailForm="detailForm"></EditForm>
    </div>
  </div>
</template>
<script>
import NoDate from '../../components/noDate'
import Pagination from '../../components/elPagination.vue'
import AddDiscourse from './welcomeComponent/AddDiscourse.vue'
import DetailForm from './welcomeComponent/DetailForm.vue'
import EditForm from './welcomeComponent/EditForm.vue'
import { formatDate } from '../../utils/tool'
import MyMixin from '../../mixins/permissions'
import { greeting_list, greeting_del } from '@/api/customer'
export default {
  components: {
    NoDate,
    Pagination,
    AddDiscourse,
    DetailForm,
    EditForm,
  },
  mixins: [MyMixin],
  data() {
    return {
      input1: '',
      roleTableData: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      showAddChannel: false,
      detailVisible: false,
      editVisible: false,
      detailForm: {},
      loading: false,
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      let params = { textval: this.input1, ...this.pageInfo }
      greeting_list(params).then((res) => {
        if (res.result) {
          let tempList = res.data.records
          tempList.forEach((item) => {
            item.createTime = item.createTime
              ? formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')
              : '-'
          })
          this.roleTableData = tempList
          this.total = res.data.total
        }
      })
    },
    checkTable() {
      this.pageInfo.page = 1
      this.getListData()
    },
    resetTable() {
      this.input1 = ''
      this.getListData()
    },
    pageChange(item) {
      // console.log('', item)
      this.getListData()
    },
    handleEdit(index, row) {
      this.detailForm = row
      this.editVisible = true
      this.getListData()
    },
    handleClick(index, row) {
      // console.log(row)
      this.detailForm = row
      this.detailVisible = true
    },
    deleteRow(index, row) {
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('p'),
          h(
            'p',
            { style: 'padding-top:20px' },
            '删除入群欢迎语，已使用的客户群不受影响，是否删除？'
          ),
        ]),
        confirmButtonText: '是',
        cancelButtonText: '否',
        confirmButtonClass: 'sureBtn',
        cancelButtonClass: 'cancelBtn',
        type: 'error',
        title: '温馨提示',
      }).then(() => {
        let obj = {
          templateId: row.templateId,
        }
        greeting_del(obj).then((res) => {
          if (res.result) {
            let totalPage = Math.ceil((this.total - 1) / this.pageInfo.limit)
            let pageIndex =
              this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page
            this.pageInfo.page = pageIndex < 1 ? 1 : pageIndex
            this.getListData()
            this.$message({
              type: 'success',
              message: '已删除',
            })
          }
        })
      })
    },
    addDiscourse() {
      this.showAddChannel = true
    },
    closeAddChannel() {
      this.showAddChannel = false
      this.getListData()
    },
    closeFrom() {
      this.detailVisible = false
    },
    closeEdit() {
      this.editVisible = false
      this.getListData()
    },
  },
}
</script>
<style lang="less" scoped>
.roleWarp {
  font-size: 14px;
  color: #3c4353;
  min-height: 500px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  .checkDemand {
    display: flex;
    .el-input {
      margin-left: 10px;
      height: 32px;
      width: 203px;
      /deep/.el-input__inner {
        height: 32px;
        width: 203px;
        line-height: 32px;
      }
    }
    .inputName {
      line-height: 32px;
      display: inline-block;
    }
    .btnBox {
      width: 60px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #d9dae4;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
    }
    .check {
      color: #fff;
      background: #4168f6;
      margin-left: 32px;
    }
    .reset {
      margin-left: 16px;
    }
  }
}
.operation {
  justify-content: flex-end;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 16px;
  img {
    width: 12px;
    height: 12px;
  }
  .headerlist {
    width: 104px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #d9dae4;
    margin-right: 16px;
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
.rowText {
  // display: inline-block;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
}
.roleTable {
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
    // tr td .cell {
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   display: -webkit-box;
    //   -webkit-line-clamp: 1; /*可以显示的行数，超出部分用...表示 */
    //   -webkit-box-orient: vertical;
    // }
  }
  .table_txt {
    display: inline-block;
    color: #4168f6;
    margin-right: 8px;
    cursor: pointer;
  }
  margin-top: 16px;
  min-height: 500px;
  /deep/.el-table__empty-block {
    display: none !important;
  }
}
</style>
