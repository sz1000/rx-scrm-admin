<template>
  <div class="channelWarp">
    <div class="channeelHeader">
      <el-form :model="channelForm" ref="channelForm" label-width="70px" class="demo-channelForm" label-position="left">
        <el-row :gutter="20" class="rows">
          <el-col :span="8">
            <el-form-item label="渠道名称:">
              <el-input placeholder="请输入名称" v-model="channelForm.name" maxlength="30">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人员:">
              <el-select v-model="channelForm.createBy" placeholder="请选择创建人" @change="userChange" clearable>
                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.userNo">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:">
              <el-date-picker v-model="creatTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="changeDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="添加时间:">
              <el-date-picker v-model="addTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd" @change="addDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="btnCol">
            <el-button type="primary" @click="checkTable(channelForm)" class="but_click">查询
            </el-button>
            <el-button @click="resetTable" class="but_hove">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="codeBtn pointer" @click="apendChannel" v-show="expandedKeys.some(item=>item.enName == 'add')">
      <img src="../../assets/images/icon_add@2x.png" alt="" />
      新增渠道
    </div>
    <div class="chanelTable" v-loading='loading'>
      <el-table :data="channelTable" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }">
        <el-table-column type="index" width="60px" label="编号" align="left">
        </el-table-column>
        <el-table-column prop="name" label="渠道名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createBy" label="创建人员"> </el-table-column>
        <el-table-column prop="livecodeSum" label="活码数"> </el-table-column>
        <el-table-column prop="cusSum" label="添加客户数"> </el-table-column>
        <el-table-column label="客户添加时间" show-overflow-tooltip="">
          <template slot-scope="scope">
            {{
              scope.row.addTime
                ? formatDate(scope.row.addTime, "yyyy-MM-dd hh:mm:ss")
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="渠道创建时间" show-overflow-tooltip="">
          <template slot-scope="scope">
            {{
              scope.row.createTime
                ? formatDate(scope.row.createTime, "yyyy-MM-dd hh:mm:ss")
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'edit')">
              编辑
            </span>
            <span @click="handleClick(scope.$index, scope.row)" class="table_txt">
              详情
            </span>
            <span @click="deleteRow(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'delete')">
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <NoDate v-if="!channelTable.length"></NoDate>
    </div>
    <div v-if="showAddChannel">
      <AddChannel :addChannel="showAddChannel" @closeAddChannel="closeAddChannel"></AddChannel>
    </div>
    <EditChannel @closeDialog="closeDialog" :dialogFormVisible="editChannel" :editForm="editForm">
    </EditChannel>
    <div v-if="channelDetail">
      <DetailChannel @closeChannel="closeChannel" :rowDate="rowDate" :channelVisible.sync="channelDetail"></DetailChannel>
    </div>
    <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="channelTable.length"></Pagination>
  </div>
</template>
<script>
import NoDate from '../../components/noDate'
import AddChannel from './AddChannel.vue'
import EditChannel from './EditChannel.vue'
import DetailChannel from './DetailChannel.vue'
import Pagination from '../../components/elPagination.vue'
import { formatDate } from '../../utils/tool.js'
import MyMixin from '../../mixins/permissions'
import { channel_getChannelList, channel_delChannel } from '@/api/tools'
export default {
  mixins: [MyMixin],
  name: 'ChannelManagement',
  components: {
    Pagination,
    EditChannel,
    DetailChannel,
    AddChannel,
    NoDate,
  },
  data() {
    return {
      channelForm: {
        name: '',
        createBy: '',
        createTimeSta: '',
        createTimeEnd: '',
        addTimeSta: '',
        addTimeEnd: '',
      },
      creatTime: [],
      addTime: [],
      options: [],
      channelTable: [],
      editChannel: false,
      channelDetail: false,
      showAddChannel: false,
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      editForm: {},
      rowDate: {},
      loading: false,
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    formatDate,
    getTableList() {
      let params = { ...this.pageInfo, ...this.channelForm }
      channel_getChannelList(params).then((res) => {
        if (res.result) {
          this.options = res.data.userlist
          this.channelTable = res.data.channelEntityPage.records
          this.total = res.data.channelEntityPage.total
        }
      })
    },
    checkTable() {
      this.pageInfo.page = 1
      this.getTableList()
    },
    resetTable() {
      this.channelForm = {}
      this.creatTime = []
      this.addTime = []
      this.getTableList()
    },
    userChange(item) {
      console.log(item)
    },
    changeDate(value) {
      // console.log('-----value---', value)
      this.channelForm.createTimeSta = value[0] + ' 00:00:00'
      this.channelForm.createTimeEnd = value[1] + ' 23:59:59'
      // if (value[0] == value[1]) {
      // } else {
      //   this.channelForm.createTimeSta = value[0]
      //   this.channelForm.createTimeEnd = value[1]
      // }
    },
    addDate(value) {
      this.channelForm.addTimeSta = value[0] + ' 00:00:00'
      this.channelForm.addTimeEnd = value[1] + ' 23:59:59'
      // if (value[0] == value[1]) {
      // } else {
      //   this.channelForm.addTimeSta = value[0];
      //   this.channelForm.addTimeEnd = value[1];
      // }
    },
    apendChannel() {
      this.showAddChannel = true
    },
    closeAddChannel() {
      this.showAddChannel = false
      this.getTableList()
    },
    handleEdit(index, row) {
      // console.log(row)
      this.editForm = row
      this.editChannel = true
    },
    handleClick(index, row) {
      this.rowDate = row
      this.channelDetail = true
    },
    deleteRow(index, rows) {
      console.log(rows)
      this.$confirm('是否确认删除', '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'error',
      })
        .then(() => {
          let data = {
            id: rows.id,
          }
          channel_delChannel(data).then((res) => {
            if (res.result) {
              let totalPage = Math.ceil((this.total - 1) / this.pageInfo.limit)
              let pageIndex =
                this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page
              this.pageInfo.page = pageIndex < 1 ? 1 : pageIndex
              this.getTableList()
              this.$message({
                type: 'success',
                message: '已删除!',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    pageChange(item) {
      // console.log('', item)
      this.getTableList()
    },
    closeDialog() {
      this.editChannel = false
      this.getTableList()
    },
    closeChannel() {
      this.channelDetail = false
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
.channelWarp {
  min-height: 812px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  color: #3c4353;
  .channeelHeader {
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/.el-form-item__label {
      padding: 0;
    }
    /deep/.el-range-editor.el-input__inner {
      height: 32px;
      width: 100%;
    }
    .rows {
      margin-bottom: 16px;
      height: 32px;
      line-height: 32px;
    }
  }
  .codeBtn {
    width: 104px;
    height: 32px;
    background: rgba(65, 104, 246, 0.04);
    border-radius: 4px;
    border: 1px solid #4168f6;
    text-align: center;
    color: #4168f6;
    line-height: 32px;
    margin-bottom: 16px;
    float: right;
    img {
      width: 12px;
      height: 12px;
    }
  }
  .chanelTable {
    min-height: 500px;
    /deep/.el-table thead {
      color: #3c4353;
      font-size: 14px;
    }
    /deep/.el-table tbody tr:hover > td {
      background-color: #f4f6fe;
    }
    .el-table {
      color: #3c4353;
      &::before {
        width: 0;
      }
    }
    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
    }
    .empty {
      padding-top: 100px;
    }
  }
  /deep/.el-table__empty-block {
    display: none !important;
  }
}
</style>
