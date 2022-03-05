<template>
  <div class="manageWarp" ref="main">
    <div class="selectTab">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="70px" class="demo-ruleForm" label-position="left">
        <el-row type="flex" justify="space-between" :gutter="24">
          <el-col :span="6">
            <el-form-item label="员工姓名:">
              <el-input v-model="ruleForm.name" placeholder="请输入姓名" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式:" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入手机号" maxlength="13"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="所属部门:">
              <el-select v-model="ruleForm.dept"
                         placeholder="请选择部门">
                <el-option v-for="item in organOption"
                           :key="item.value"
                           :label="item.name"
                           :value="item.depId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="启用系统:">
              <el-select v-model="ruleForm.scrm_status" placeholder="是否启用" clearable>
                <el-option label="启用" value="1"></el-option>
                <el-option label="不启用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属角色:">
              <el-select v-model="ruleForm.roleId" placeholder="请选择角色" clearable>
                <el-option v-for="item in roleList" :key="item.value" :label="item.name" :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
          <el-col :span="24" class="btnCol">
            <el-button type="primary" @click="submitForm(ruleForm)" class="but_click">查询</el-button>
            <el-button @click="resetForm(ruleForm)" class="but_hove">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="operation relative">
      <span class="deleteBtn" v-show="false">
        <i class="el-icon-delete"></i>
        批量删除
      </span>
      <el-button class="addBtn pointer tongbu" @click="synchronous" v-preventReClick>
        <img src="../../assets/images/tongbu.png" alt="" />
        同步
      </el-button>
      <el-popover trigger="hover" popper-class="invitCode" v-show="expandedKeys.some((item) => item.enName == 'invite')">
        <div class="addBtn pointer" slot="reference">
          <img src="../../assets/images/icon_invite@2x.png" alt="" style="width: 14px; height: 14px" />
          邀请
        </div>
        <div class="qrCodeWarp absolute pointer">
          <div id="qrcode" ref="qrcode" class="codeBox"></div>
          <a :href="hrefCode" download="二维码" class="download-code">
            <!-- <i class="el-icon-download"></i> -->
            下载二维码
          </a>
        </div>
      </el-popover>
    </div>
    <div class="tableWarp">
      <div class="leftSection">
        <div class="sectionTitle">部门信息</div>
        <div class="tree-box">
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="expandedKey" :indent="5"
                   node-key="depId" class="showTree">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span class="text_node">
                <img src="../../assets/images/wenjian.png" alt="" style="width: 14px; height: 12px; vertical-align: 10%" />
                <!-- <span class="nodeName">{{ node.label.length>10 ?node.label.slice(0,10) +'...' :node.label}}</span> -->
                <span class="nodeName">{{ node.label }}</span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="rightTable" v-loading="loading">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" empty-text="" :header-cell-style="{ background: '#FAFBFF' }">
          <el-table-column type="index" label="编号" width="70">
          </el-table-column>
          <el-table-column prop="name" label="员工姓名" show-overflow-tooltip=""> </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              {{
                scope.row.gender == 1
                  ? "男"
                  : scope.row.gender == 2
                  ? "女"
                  : "未知"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="所属部门" prop="deptname" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="position" label="职务" show-overflow-tooltip> </el-table-column>
          <el-table-column label="是否为上级" width="100px">
            <template slot-scope="scope">
              {{
                scope.row.isLeaderInDept
                  ? scope.row.isLeaderInDept == 0
                    ? "否"
                    : "是"
                  : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column label="所属角色" prop="rolename" show-overflow-tooltip>
            <!-- <template slot-scope="scope"> 
              <span>{{
							scope.row.roleId == '1'
								? '超级管理员'
								: scope.row.roleId == '2'
								? '员工管理员'
								: '普通员工'
						}}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="启用系统" v-if="expandedKeys.some(item=>item.enName == 'edit')">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.scrmStatus" :active-value="1" :inactive-value="0" active-color="#4168F6" inactive-color="#B9B9B9"
                         :disabled="scope.row.showDisabled" @change="changeSwitch(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <span @click="handleEdit(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'edit')">编辑</span>
              <span @click="handleClick(scope.$index, scope.row)" class="table_txt">详情</span>
              <!-- <span @click="deleteRow(scope.$index, scope.row)" class="table_txt"
                    v-if="scope.row.rolename !== '超级管理员' && expandedKeys.some(item=>item.enName == 'delete')">
                删除
              </span> -->
            </template>
          </el-table-column>
        </el-table>
        <NoDate v-if="!tableData.length"></NoDate>
      </div>
    </div>
    <div v-if="dialogFormVisible">
      <EditForm @statusDialog="statusDialog" :dialogFormVisible="dialogFormVisible" :editFormInfo="editDate" :roleInfo="list" :showRoled="showRoled">
      </EditForm>
    </div>
    <div v-if="showInfo">
      <DetailForm :infoFormVisible="showInfo" @closeInfoForm="closeInfoForm" :detailInfo="detailForm"></DetailForm>
    </div>
    <div class="detail_dialog"></div>
    <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="tableData.length"></Pagination>
  </div>
</template>
<script>
import NoDate from '../../components/noDate'
import QRCode from 'qrcodejs2'
import Pagination from '../../components/elPagination.vue'
import EditForm from './editForm.vue'
import DetailForm from './detailForm.vue'
import MyMixin from '../../mixins/permissions'
export default {
  components: {
    Pagination,
    EditForm,
    DetailForm,
    QRCode,
    NoDate,
  },
  mixins: [MyMixin],
  data() {
    return {
      ruleForm: {
        name: '',
        phone: '',
        dept: '',
        scrm_status: '',
        roleId: '',
      },
      roleList: [],
      list: [],
      tableData: [],
      organOption: [],
      gender: '',
      scrmStatus: '',
      dialogFormVisible: false,
      editDate: {},
      showInfo: false,
      showImg: false,
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      showRoled: false,
      detailForm: {},
      hrefCode: '',
      link: '',
      rules: {
        // phone: [{ validator: this.checkPhone, trigger: 'blur' }],
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'depId',
      },
      depId: '',
      expandedKey: [],
      loading: false,
      // showDisabled: false,
    }
  },
  mounted() {
    document.addEventListener('click', this.bodyCloseMenus)
  },
  created() {
    this.getTableList()
    this.getList()
    this.showQrCode()
  },
  beforeDestroy() {
    document.removeEventListener('click', this.bodyCloseMenus)
  },
  methods: {
    getList() {
      this.$network.get('/user-service/userdepartment/getlist').then((res) => {
        this.treeData = res.data
        this.expandedKey.push(res.data[0].depId)
        // console.log('----default-expanded-keys', this.expandedKey)
      })
    },
    synchronous() {
      this.$confirm('每10分钟可同步一次，你确认同步吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        title: '确认同步',
        type: 'warning',
      }).then((res) => {
        this.$network.get('/user-service/user/syncUserlist').then((res) => {
          this.$message({
            type: 'success',
            message: '同步成功',
          })
          this.getTableList()
          this.getList()
        })
      })
    },
    qrcode() {
      this.$refs.qrcode.innerHTML = ''
      let qrcode = new QRCode('qrcode', {
        width: 120,
        height: 120,
        text: this.link,
        render: 'canvas',
        colorDark: '#000000',
        colorLight: '#ffffff',
      })
      this.hrefCode = document
        .getElementById('qrcode')
        .getElementsByTagName('canvas')[0]
        .toDataURL('image/png')
      this.$refs.qrcode.title = ''
    },
    getTableList() {
      this.loading = true
      let params = Object.assign({}, this.pageInfo, this.ruleForm, {
        depId: this.depId,
      })
      this.$network
        .get('/user-service/user/getUserList', params)
        .then((res) => {
          this.loading = false
          let data = res.data
          this.total = parseInt(data.user.total)
          this.roleList = res.data.roleList
          this.organOption = data.deptlist
          data.user.records.forEach((item) => {
            if (item.rolename == '超级管理员') {
              // this.showDisabled = true
              this.$set(item, 'showDisabled', true)
            } else {
              this.$set(item, 'showDisabled', false)
            }
          })
          this.tableData = data.user.records
        })
    },
    submitForm(ruleForm) {
      // console.log('---ruleForm----', ruleForm)
      this.pageInfo.page = 1
      this.getTableList()
    },
    resetForm() {
      this.ruleForm = {}
      this.getTableList()
    },
    changeSwitch(row) {
      // console.log('----switch---', row)
      this.$network
        .get('/user-service/user/updateScrmstatus', { userNo: row.userNo })
        .then((res) => {
          // console.log('---res---', res)
          if (res.code == 'error_count') {
            this.$message({
              type: 'error',
              message: res.data,
            })
          }
          this.getTableList()
        })
    },
    handleEdit(index, row) {
      console.log(row)
      this.list = this.roleList
      this.editDate = row
      if (row.rolename == '超级管理员') {
        this.showRoled = true
      } else {
        this.showRoled = false
      }
      this.dialogFormVisible = true
    },
    handleClick(index, row) {
      this.showInfo = true
      this.detailForm = row
      console.log(row)
    },
    deleteRow(index, row) {
      // console.log(row)
      this.$confirm('是否确认删除', '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        confirmButtonClass: 'sureBtn',
        cancelButtonClass: 'cancelBtn',
        type: 'error',
      })
        .then(() => {
          this.$network
            .post('/user-service/user/deleteUser', { userNo: row.userNo })
            .then((res) => {
              let totalPage = Math.ceil((this.total - 1) / this.pageInfo.limit)
              let pageIndex =
                this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page
              this.pageInfo.page = pageIndex < 1 ? 1 : pageIndex
              this.getTableList()
              this.$message({
                type: 'success',
                message: '已删除!',
              })
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
      this.pageInfo.limit = item.limit
      this.pageInfo.page = item.page
      this.getTableList()
    },
    statusDialog() {
      this.dialogFormVisible = false
      this.getTableList()
    },
    closeInfoForm() {
      this.showInfo = false
    },
    showQrCode() {
      this.$network.get('/user-service/user/getWXtoaddUser').then((res) => {
        let domain = ''
        if (
          location.hostname == 'dev-console.jzcrm.com' ||
          location.hostname == 'localhost'
        ) {
          domain = 'https://dev-console.jzcrm.com'
        } else if (location.hostname == 'test-console.jzcrm.com') {
          domain = 'https://test-console.jzcrm.com'
        } else {
          domain = 'https://console.jzcrm.com'
        }
        this.link = `${domain}/#/writeCodeInfo?corpid=${res.data.corpid}&permanent_code=${res.data.permanentcode}`
        this.qrcode()
        // window.open(this.link)
      })
    },
    bodyCloseMenus(e) {
      let self = this
      // console.log('e-------', e)
      if (self.showImg == true) {
        self.showImg = false
      }
    },
    checkPhone(rule, value, callback) {
      if (!value) {
        return
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    },
    handleNodeClick(data) {
      // console.log(data)
      this.depId = data.depId
      this.getTableList()
    },
  },
}
</script>
<style>
.el-tooltip__popper {
  max-width: 500px !important;
}
</style>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
.download-code {
  display: block;
  font-size: 14px;
  display: flex !important;
  justify-content: center;
  margin-top: 3px;
}
.manageWarp {
  min-height: 782px;
  background: #fff;
  // height: 100%;
  padding: 16px;
  border-radius: 8px;
  .selectTab {
    /deep/.el-form-item__label {
      padding: 0;
    }
  }
  .btnCol {
    padding-left: 30px;
    // text-align: right;
  }
  .operation {
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
    img {
      width: 12px;
      height: 12px;
    }
    .codeTxt {
      color: #fff;
    }
    .qrCodeWarp {
      font-size: 14px;
      color: #3c4353;
      background: #fff;
      padding: 10px;
      height: 180px;
      width: 160px;
      text-align: center;
      right: -10px;
      top: 34px;
      z-index: 3000;
      box-shadow: darkgrey 2px 0px 10px 2px;
      .codeBox {
        padding-left: 10px;
      }

      .download-code {
        display: block;
        font-size: 16px;
        color: #4168f6;
      }
    }
    .deleteBtn {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4168f6;
    }
    .addBtn {
      display: inline-block;
      width: 80px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      font-size: 14px;
      color: #4168f6;
      text-align: center;
      line-height: 32px;
      margin-left: 16px;
    }
    .tongbu {
      color: #000;
      border: 1px solid #d9dae4;
    }
  }
  .tableWarp {
    height: 100%;
    width: 100%;
    display: flex;
    .leftSection {
      position: relative;
      width: 300px;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        background: #f0f2f7;
        height: 100%;
      }
      .sectionTitle {
        font-size: 16px;
        font-weight: 600;
        color: #3c4353;
        margin-bottom: 16px;
      }
      .tree-box {
        overflow: auto;
        margin-right: 16px;
        vertical-align: top;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
          // opacity: 0;
          // display: none;
        }
      }
      .custom-tree-node {
        font-size: 14px;
        width: 100%;
        .text_node {
          display: inline-block;
          width: 100%;
          .nodeName {
            display: inline-block;
            margin-left: 5px;
            width: 90%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .rightTable {
      // flex: 1;
      min-height: 580px;
      width: 90%;
      /deep/.el-table tbody tr:hover > td {
        background-color: #f4f6fe;
      }
    }
    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
    }
    .empty {
      padding-top: 40px;
    }
  }
  /deep/.el-table__empty-block {
    display: none !important;
  }
}
/deep/.el-table th > .cell {
  color: #3c4353;
}
</style>
