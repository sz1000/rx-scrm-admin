<template>
  <div class="roleWarp">
    <div class="checkDemand">
      <span class="inputName"> 角色名称:</span>
      <el-input placeholder="请输入角色名称" v-model.trim="input1" maxlength="30">
      </el-input>
      <div @click="checkTable" class="check btnBox pointer but_click">查询</div>
      <div @click="resetTable" class="reset btnBox pointer but_hove">重置</div>
    </div>
    <div class="operation flex">
      <el-button class="addBtn pointer" @click="newgroup" v-show="expandedKeys.some(item=>item.enName == 'add')">
        <img src="../../assets/images/icon_add@2x.png" alt="" />
        新增
      </el-button>
    </div>
    <div class="roleTable" v-loading='loading'>
      <el-table :data="roleTableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF', 'text-align': 'left' }">
        <el-table-column type="index" label="编号" width="200px" align="left">
        </el-table-column>
        <el-table-column prop="name" label="角色名称" align="left">
        </el-table-column>
        <el-table-column prop="sump" label="已绑账号数" align="left">
        </el-table-column>
        <el-table-column prop="dataPermission" label="数据权限级别" align="left">
             <template slot-scope="scope">
                  <span v-if="scope.row.dataPermission == 'P0'">
                    仅本人
                  </span>
                  <span v-if="scope.row.dataPermission == 'P1'">
                    本人及所属部门
                  </span>
                  <span v-if="scope.row.dataPermission == 'P2'">
                    本人及所属部门与所有下级部门
                  </span>
                  <span v-if="scope.row.dataPermission == 'P3'">
                    全公司
                  </span>
             </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'edit')">权限配置</span>
            <!-- <span @click="deleteRow(scope.$index, scope.row)" class="table_txt"
                  v-show="scope.row.code == 'custom' && expandedKeys.some(item=>item.enName == 'delete')">删除</span> -->
            <span @click="deleteRow(scope.$index, scope.row)" class="table_txt"
                  v-show="scope.row.type == 2">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <NoDate v-if="!roleTableData.length"></NoDate>
    </div>
    <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="roleTableData.length"></Pagination>
  </div>
</template>
<script>
import NoDate from '../../components/noDate'
import Pagination from '../../components/elPagination.vue'
import MyMixin from '../../mixins/permissions'
export default {
  components: {
    NoDate,
    Pagination,
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
      loading: false,
    }
  },
  created() {
    if (this.$route.params.reset) {
      location.reload()
    }
    this.getRoleList()
  },

  methods: {
    newgroup() {
      // console.log('111111111111111')
      this.$router.push({
        path: 'addRole',
        query: {
          menuFlag: true,
        },
      })
    },
    getRoleList() {
      this.loading = true
      let params = { name: this.input1, ...this.pageInfo }
      this.$network
        .get('/user-service/role/getRoleList', params)
        .then((res) => {
          this.loading = false
          this.roleTableData = res.data.records
          this.total = res.data.total
        })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: 'editRole',
        query: { id: row.id, menuFlag: true ,level:row.dataPermission},
      })
    },
    deleteRow(index, row) {
      this.$confirm(
        row.sump > 0
          ? `此角色有${row.sump}人正在使用，请修改角色后再删除`
          : '此角色删除后将不可再用，是否确认删除',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          confirmButtonClass: 'sureBtn',
          cancelButtonClass: 'cancelBtn',
        }
      )
        .then(() => {
          this.$network
            .post('/user-service/role/delRole', {
              id: row.id,
            })
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1000,
              })
              this.getRoleList()
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'success',
          //   message: '已取消',
          // })
        })
    },
    checkTable() {
      this.pageInfo.page = 1
      this.getRoleList()
    },
    resetTable() {
      this.input1 = ''
      this.getRoleList()
    },
    pageChange(item) {
      // console.log('', item)
      this.getRoleList()
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/elementStyle.less';
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
  .roleTable {
    margin-top: 16px;
    min-height: 500px;
    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
    }
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
  }
  /deep/.el-table__empty-block {
    display: none !important;
  }
}
</style>
