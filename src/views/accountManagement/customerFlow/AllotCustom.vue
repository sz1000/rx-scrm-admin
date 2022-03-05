<template>
  <div class="customerWarp" v-loading='loading'>
    <TitleBar title="客户分配规则"></TitleBar>
    <SwitchButton @fnOpen='fnOpen' @fnHide='fnHide' v-model='switchBtn' :distype="expandedKeys.some((item) => item.enName == 'switch')" />
    <div class="ruleBox" v-show="switchBtn">
      <div class="addFriend">
        <el-checkbox v-model="recycleRoleType" false-label='0' true-label='1' @change="handleChange">
          客户被分配后
          <el-input v-model="recycleRole" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')">
          </el-input>
          <el-select v-model="recycleUnit" placeholder="">
            <el-option label="分钟" value="min"></el-option>
            <el-option label="小时" value="hour"></el-option>
          </el-select>
          未被跟进，将被回收到客户公海重新分配
        </el-checkbox>
      </div>
      <div class="addRule pointer" @click="onAddrule">
        <img src="../../../assets/images/icon_add@2x.png" alt="" />
        添加规则
      </div>
      <div class="ruleTable">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF', 'text-align': 'left' }">
          <el-table-column type="index" label="编号" width="80px" align="left">
          </el-table-column>
          <el-table-column label="规则" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.roleName == '默认规则'"> {{scope.row.roleName}}</span>
              <div v-else>
                <div class="tagBox">
                  <div class="tagTitle">
                    <span>标签包含：</span>
                  </div>
                  <div class="tagAll">
                    <span v-for="(item,index) in scope.row.satisfyTag" :key="index" class="spanClasss">{{item.name}}</span>
                  </div>
                </div>
                <div class="sourceBox">
                  <div class="tagTitle">
                    <span>来源包含：</span>
                  </div>
                  <div class="tagAll">
                    <span v-for="(item,index) in scope.row.satisfySource" :key="index" class="spanClasss">{{item.name}}</span>
                  </div>
                </div>
              </div>
            </template>

          </el-table-column>
          <el-table-column prop="userNames" label="被分配员工">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <span @click="handleEdit(scope.$index, scope.row)" class="table_txt">编辑</span>
              <!-- v-show="expandedKeys.some(item=>item.enName == 'edit')" -->
              <span @click="deleteRow(scope.$index, scope.row)" class="table_txt" v-if="scope.row.roleName !== '默认规则'">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button type="primary" class="saveBtn" @click="savePage">保存</el-button>
    </div>
    <NewAddRule :addVisible='addVisible' @closeAddForm='closeAddForm' :ruleTitle='title' :regularId='id' :editObj='editObj' v-if="addVisible">
    </NewAddRule>
  </div>
</template>
<script>
import TitleBar from '../../../components/customerFlow/TitleBar'
import SwitchButton from '../../../components/customerFlow/SwitchButton.vue'
import NewAddRule from '../../../components/customerFlow/NewAddRule.vue'
import MyMixin from '../../../mixins/permissions'
import {
  getHomeInfo,
  changeBtnStatus,
  saveCustomRule,
  deleteRole,
} from '../../../api/custom'
export default {
  components: {
    TitleBar,
    SwitchButton,
    NewAddRule,
  },
  mixins: [MyMixin],
  data() {
    return {
      switchBtn: '',
      recycleRoleType: '',
      recycleRole: '',
      recycleUnit: '',
      tableData: [],
      addVisible: false,
      id: '',
      title: '',
      editObj: [],
      loading: false,
    }
  },
  created() {
    this.getDetail()
  },
  mounted() {},
  methods: {
    getDetail() {
      this.loading = true
      let obj = { regularType: 2 }
      getHomeInfo(obj).then((res) => {
        this.switchBtn = res.data.regular.buttonType
        this.recycleRoleType = res.data.regular.recycleRoleType.toString()
        this.recycleRole = res.data.regular.recycleRole
        this.recycleUnit = res.data.regular.recycleUnit || 'min'
        this.tableData = res.data.regularRoleList
        this.id = res.data.regular.id
        this.loading = false
      })
    },
    fnOpen(v) {
      this.switchBtn = v
      console.log(v)
      let params = {
        buttonType: v,
        id: this.id,
      }
      changeBtnStatus(params).then((res) => {})
    },
    fnHide(v) {
      this.switchBtn = v
      let params = {
        buttonType: v,
        id: this.id,
      }
      changeBtnStatus(params).then((res) => {})
    },
    handleChange() {},
    onAddrule() {
      this.title = '新增规则'
      this.addVisible = true
      this.editObj = {}
    },
    handleEdit(i, val) {
      console.log(val)
      this.title = '编辑规则'
      this.addVisible = true
      this.editObj = val
    },
    deleteRow(index, row) {
      this.$confirm('是否确认删除此条分配规则？', '温馨提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'error',
        confirmButtonClass: 'sureBtn',
        cancelButtonClass: 'cancelBtn',
      })
        .then(() => {
          deleteRole({ id: row.id }).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
            })
            this.getDetail()
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'success',
          //   message: '已取消',
          // })
        })
    },
    savePage() {
      let params = {
        recycleRole: this.recycleRole,
        recycleRoleType: this.recycleRoleType,
        recycleUnit: this.recycleUnit,
        id: this.id,
      }
      saveCustomRule(params).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功',
        })
      })
    },
    closeAddForm() {
      this.addVisible = false
      this.getDetail()
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
@import './checkBox.less';
.customerWarp {
  min-height: 100vh;
  border-radius: 8px;
  background-color: #fff;
  padding: 0 16px;
  .ruleBox {
    .addFriend {
      margin: 16px 0;
      .el-input {
        width: 41px;
        margin: 0 8px;

        /deep/.el-input__inner {
          height: 22px;
          line-height: 22px;
          padding: 0;
          text-align: center;
          background: #f5f6fa;
        }
      }
      .el-select {
        width: 62px;
        /deep/.el-input__inner {
          background: #f5f6fa;
          height: 22px;
          line-height: 22px;
          padding: 0;
          padding-left: 8px;
        }
        /deep/.el-input__icon {
          line-height: 22px !important;
          height: 22px !important;
        }
      }
    }
    .addRule {
      margin-bottom: 16px;
      width: 104px;
      font-size: 14px;
      height: 32px;
      background: rgba(65, 104, 246, 0.04);
      border-radius: 4px;
      border: 1px solid #4168f6;
      text-align: center;
      color: #4168f6;
      line-height: 32px;
      img {
        width: 12px;
        vertical-align: -3%;
      }
    }
    .ruleTable {
      .table_txt {
        display: inline-block;
        color: #4168f6;
        margin-right: 8px;
        cursor: pointer;
      }
      .sourceBox {
        margin-top: 9px;
      }
      .tagBox,
      .sourceBox {
        display: flex;
        .tagTitle {
          min-width: 65px;
          span {
            display: inline-block;
          }
        }
        .tagAll {
          flex: 1;
          .spanClasss {
            display: inline-block;
            padding: 0 8px;
            font-size: 12px;
            color: #838a9d;
            background: #fafbff;
            border: 1px solid #d9dae4;
            border-radius: 4px;
            margin-left: 12px;
            margin-bottom: 8px;
          }
        }
      }
    }
    .saveBtn {
      margin-top: 16px;
    }
  }
}
</style>