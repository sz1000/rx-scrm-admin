<template>
  <div class="technique_wrap">
    <!-- <img src="https://jizhoucrm-sit.oss-cn-hangzhou.aliyuncs.com/verbalTrick/%E5%95%8A%E5%95%8A%E5%95%8A.png"
         alt=""> -->
    <div class="search_title">
      <span>话术:</span>
      <span class="inputCol">
        <el-input v-model="inputText" placeholder="请输入话术内容" @change="changeInput"></el-input>
      </span>
      <span class="btnCol">
        <el-button type="primary" @click="submitForm()" class="but_click">查询</el-button>
        <el-button @click="resetForm()" class="but_hove">重置</el-button>
      </span>
    </div>
    <div class="bottom_warp">
      <div class="group_left">
        <div class="add_group" v-show="expandedKeys.some(item=>item.enName == 'addPacket')">
          <img src="../../assets/images/addgroup.png" alt="" />
          <span @click="newAddGroup">添加分组</span>
        </div>
        <div class="all_group">
          <el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handleNodeClick" highlight-current :expand-on-click-node="false"
                   :default-expanded-keys="expandedKey" :indent="15" class="showTree">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div class="text_node">
                <img src="../../assets/images/wenjian.png" alt="" style="width: 14px; height: 12px" />
                <div class="nodeName">
                  <span :title="node.label">{{ node.label }}</span>
                </div>
                <span class="look_more" v-show="isShowOperate == data.id && data.id != 0">
                  <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                      <img src="../../assets/images/group_more.png" alt="" style="width: 18px; height: 18px" />
                    </span>
                    <el-dropdown-menu slot="dropdown">

                      <el-dropdown-item :command="beforeHandleCommand(node, data, 'setName')"
                                        v-show="expandedKeys.some(item=>item.enName == 'rename')">重命名</el-dropdown-item>
                      <el-dropdown-item :command="beforeHandleCommand(node, data, 'deleteName')"
                                        v-show="expandedKeys.some(item=>item.enName == 'deletePacket')">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </div>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="table_right">
        <div class="operation flex">
          <div class="addBtn pointer" @click="addTable" v-show="expandedKeys.some(item=>item.enName == 'add')">
            <img src="../../assets/images/icon_add@2x.png" alt="" />
            新增
          </div>
        </div>
        <div class="table_content" v-loading='loading'>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" empty-text="" :header-cell-style="{ background: '#FAFBFF' }">
            <el-table-column type="index" width="60px" label="编号">
            </el-table-column>
            <el-table-column prop="title" label="话术标题" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="话术内容" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="wordContent">{{ scope.row.value }}</div>
                <div class="allNum">共{{ scope.row.contentList ? scope.row.contentList.length : 0 }}条</div>
              </template>
            </el-table-column>
            <el-table-column prop="groupName" label="所属分组" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateBy" label="最后编辑人员" min-width="110px">
            </el-table-column>
            <el-table-column label="最后编辑时间" show-overflow-tooltip min-width="110px">
              <template slot-scope="scope">
                {{scope.row.updateTime? formatDate(scope.row.updateTime, "yyyy-MM-dd hh:mm:ss"):'-' }}
              </template>
            </el-table-column>
            <el-table-column prop="createBy" label="创建人员" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.createTime ?  formatDate(scope.row.createTime, "yyyy-MM-dd hh:mm:ss") :'-'}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">

                <span @click="copyRow(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'copy')">复制</span>
                <span @click="handleEdit(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'edit')">编辑</span>
                <span @click="handleClick(scope.$index, scope.row)" class="table_txt">详情</span>
                <span @click="deleteRow(scope.$index, scope.row)" class="table_txt"
                      v-show="expandedKeys.some(item=>item.enName == 'delete')">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <NoDate v-if="!tableData.length"></NoDate>
        </div>
        <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
      </div>
    </div>
    <div v-if="addVisible">
      <AddWords :addVisible="addVisible" @closeAddDialog="closeAddDialog" :groupType="groupType"></AddWords>
    </div>
    <div v-if="dialogName">
      <RenameLabel :dialogName="dialogName" :oldLabel="oldLabel" :groupType="groupType" @closeRename="closeRename"></RenameLabel>
    </div>
    <div v-if="newGroup">
      <AddNewGroup :newGroup="newGroup" :addGroupVal="addGroupVal" @closeNewGroup="closeNewGroup" :groupType="groupType"></AddNewGroup>
    </div>
    <div v-if="copyDialog">
      <CopyWords :copyDialog="copyDialog" @closeCopy="closeCopy" :copyObj="copyObj" :groupType="groupType"></CopyWords>
    </div>
    <div v-if="editVisible">
      <EditWords :editVisible="editVisible" @closeEdit="closeEdit" :isShowOperate="isShowOperate" :copyObj="copyObj" :groupType="groupType">
      </EditWords>
    </div>
    <div v-if="detailVisible">
      <DetailWords :detailVisible="detailVisible" @closeDetail="closeDetail" :copyObj="copyObj" :groupType="groupType"></DetailWords>
    </div>
  </div>
</template>
<script>
import Pagination from '../../components/elPagination.vue'
import NoDate from '../../components/noDate'
import AddWords from './wordsDialog/AddWords.vue'
import RenameLabel from './wordsDialog/RenameLabel'
import CopyWords from './wordsDialog/CopyWords.vue'
import AddNewGroup from './wordsDialog/AddNewGroup.vue'
import EditWords from './wordsDialog/EditWords.vue'
import DetailWords from './wordsDialog/DetailWords.vue'
import { formatDate } from '../../utils/tool'
import MyMixin from '../../mixins/permissions'
export default {
  components: {
    Pagination,
    NoDate,
    AddWords,
    RenameLabel,
    AddNewGroup,
    CopyWords,
    EditWords,
    DetailWords,
  },
  mixins: [MyMixin],
  data() {
    return {
      inputText: '',
      tableData: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      addVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id',
      },
      oldLabel: {},
      isShowOperate: '',
      addGroupVal: '',
      dialogName: false,
      newGroup: false,
      copyDialog: false,
      editVisible: false,
      detailVisible: false,
      copyObj: {},
      groupType: '1',
      expandedKey: [],
      loading: false,
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    formatDate,
    getDataList() {
      this.loading = true
      let params = {
        value: this.inputText,
        groupType: this.groupType,
        groupId: this.isShowOperate,
        ...this.pageInfo,
      }
      this.$network
        .get('/material-service/verbaltrick/getlist', params)
        .then((res) => {
          this.loading = false
          if (res.data.iPage) {
            this.tableData = res.data.iPage.records
            this.total = res.data.total
          } else {
            this.tableData = []
          }
        })
    },
    getGroupList() {
      let params = {
        groupType: 1,
        parentId: 0,
        type: 0,
      }
      this.$network
        .get('/material-service/verbaltrickgroup/getlist', params)
        .then((res) => {
          this.treeData = res.data
          this.isShowOperate = res.data[0].id
          this.expandedKey.push(res.data[0].id)
          this.getDataList()
        })
    },
    changeInput(val) {
      // console.log(val)
      this.inputText = val
    },
    submitForm() {
      this.getDataList()
    },
    resetForm() {
      this.inputText = ''

      this.getDataList()
    },
    pageChange(item) {
      // console.log('', item)
      this.pageInfo.limit = item.limit
      this.pageInfo.page = item.page
      this.getDataList()
    },
    newAddGroup() {
      this.newGroup = true
    },
    closeNewGroup() {
      this.newGroup = false
      this.getGroupList()
      // this.getDataList()
    },
    addTable() {
      this.addVisible = true
    },
    closeAddDialog() {
      this.addVisible = false
      // this.getGroupList()
      this.getDataList()
    },
    handleNodeClick(data) {
      // console.log(data)
      if (data.id) {
        this.isShowOperate = data.id
      }
      if (data.id && data.parentId == 0) {
        this.addGroupVal = data.id
      } else {
        this.addGroupVal = data.parentId
      }
      this.getDataList()
    },
    handleCommand(command) {
      // console.log(command)
      let { node, data } = command
      switch (command.command) {
        case 'setName':
          this.oldLabel = data
          this.dialogName = true
          break
        case 'deleteName': //删除
          const h = this.$createElement
          this.$confirm('', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            confirmButtonClass: 'sureBtn',
            cancelButtonClass: 'cancelBtn',
            type: 'error',
            title: '警告',
            message: h('p', null, [
              h(
                'div',
                { style: 'font-size:14px' },
                '此操作将删除本分组及分组内全部内容，是否确认删除分组？ '
              ),
            ]),
          }).then(() => {
            // const parent = node.parent
            // const children = parent.data.children || parent.data
            // const index = children.findIndex((d) => d.id === data.id)
            // children.splice(index, 1)
            this.$network
              .get('/material-service/verbaltrickgroup/delete', {
                id: this.isShowOperate,
              })
              .then((res) => {
                this.getGroupList()
                // console.log('---------', this.addGroupVal)
                this.addGroupVal = 0
                // this.getDataList()
                this.$message({
                  type: 'success',
                  message: '删除成功',
                })
              })
          })
          break
      }
    },

    beforeHandleCommand(node, data, command) {
      return {
        node: node,
        data: data,
        command: command,
      }
    },
    closeRename() {
      this.dialogName = false
      this.getGroupList()
      // this.getDataList()
    },
    copyRow(index, row) {
      console.log(row)
      this.copyDialog = true
      this.copyObj = row
    },
    closeCopy(v) {
      // console.log('---v----', v)
      this.copyDialog = false
      // this.getGroupList()
      this.getDataList()
    },
    handleEdit(index, row) {
      this.copyObj = row
      this.editVisible = true
    },
    closeEdit() {
      this.editVisible = false
      // this.getGroupList()
      this.getDataList()
    },
    handleClick(index, row) {
      // console.log(row)
      this.copyObj = row
      this.detailVisible = true
    },
    closeDetail() {
      this.detailVisible = false
    },
    deleteRow(index, row) {
      // console.log(row)
      const h = this.$createElement
      this.$confirm('', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        confirmButtonClass: 'sureBtn',
        cancelButtonClass: 'cancelBtn',
        type: 'error',
        title: '警告',
        message: h('p', null, [
          h('div', { style: 'font-size:14px' }, '是否确认删除此条话术？'),
        ]),
      })
        .then(() => {
          this.$network
            .post('/material-service/verbaltrick/deleteverbal', {
              ...row,
            })
            .then((res) => {
              // this.getGroupList()
              this.getDataList()
              this.$message({
                type: 'success',
                message: '删除成功',
              })
            })
        })
        .catch((e) => {
          // console.log(e)
        })
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
.technique_wrap {
  .search_title {
    height: 64px;
    background: #ffffff;
    border-radius: 8px;
    line-height: 64px;
    color: #3c4353;
    font-size: 14px;
    padding-left: 16px;
    span {
      display: inline-block;
    }
    .inputCol {
      margin-left: 8px;
      margin-right: 32px;
    }
  }
  .bottom_warp {
    background: #fff;
    margin-top: 16px;
    padding: 16px;
    display: flex;
    .group_left {
      cursor: pointer;
      width: 200px;
      border-right: 1px solid #f0f2f7;
      .add_group {
        font-size: 14px;
        color: #3c4353;
        line-height: 32px;
        padding-left: 8px;
        img {
          width: 12px;
          height: 12px;
          margin-right: 4px;
          vertical-align: -2%;
        }
      }
      .all_group {
        .custom-tree-node {
          font-size: 14px;
          width: 100%;
          .text_node {
            display: inline-block;
            width: 100%;
            .nodeName {
              display: inline-block;
              margin-left: 5px;
              width: 70%;
              vertical-align: middle;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .look_more {
              position: absolute;
              right: 0;
            }
          }
        }
      }
    }
    .table_right {
      flex: 1;
      overflow: auto;
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
        .addBtn {
          width: 76px;
          height: 32px;
          background: rgba(65, 104, 246, 0.04);
          border-radius: 4px;
          border: 1px solid #4168f6;
          color: #4168f6;
        }
      }
      .table_content {
        min-height: 600px;
        /deep/.el-table tbody tr:hover > td {
          background-color: #f4f6fe;
        }
        /deep/.el-table thead {
          color: #3c4353;
          font-size: 14px;
        }
        .el-table {
          color: #3c4353;
          &::before {
            width: 0;
          }
        }
        .wordContent {
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .allNum {
          font-size: 12px;
          color: #838a9d;
        }
        .table_txt {
          display: inline-block;
          color: #4168f6;
          margin-right: 8px;
          cursor: pointer;
        }
        /deep/.el-table__empty-block {
          display: none !important;
        }
      }
    }
  }
}
</style>
<style>
.el-tooltip__popper {
  max-width: 500px !important;
}
</style>