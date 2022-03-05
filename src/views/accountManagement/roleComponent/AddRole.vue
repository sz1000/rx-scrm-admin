<template>
  <div class="addrole-warp">
    <div class="goback pointer" @click="goback">
      <img src="../../../assets/images/goback.png" alt="" /> 返回
    </div>
    <div class="newRole" v-loading='loading'>
      <div class="addText">
        新增角色
      </div>
      <div class="roleName">
        <div class='labelArea'>
          <span>*</span>
          <span>角色名称:</span>
        </div>
        <div class="inputArea">
          <el-input v-model.trim="characterName" @change="fnInput" placeholder="请输入角色名称" maxlength="20" show-word-limit />
        </div>
      </div>
      <div class="permissionsSet">
        <div class="permissTitle">权限设置:</div>
        <div class="checkedTab">
          <span @click="tabClick('pc')" :class="{'active':tab=='pc'}">PC工作台</span>
          <span @click="tabClick('mobile')" :class="{'active':tab=='mobile'}">企业微信H5页面</span>
          <span @click="tabClick('access')" :class="{'active':tab=='access'}">数据权限</span>
        </div>
        <div class="tableWarp">
          <div v-show="tab=='pc'">
            <SubTable ref="addRole"></SubTable>
          </div>
          <div v-show="tab=='mobile'">
            <AddMobile ref="addmobile"></AddMobile>
          </div>
              <div v-show="tab=='access'" class="assdata">
           <div class="roleTable" v-loading='loading'>
            <el-table :data="roleTableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF', 'text-align': 'left' }">
            
              <el-table-column prop="levelname" label="权限级别" align="left">
              </el-table-column>
              <el-table-column prop="describe" label="权限描述" align="left">
              </el-table-column>
             
              <el-table-column label="状态" align="left">
                <!-- slot-scope="scope" -->
                <template slot-scope="scope">
                 
                   <el-switch :disabled="scope.row.disabled" v-model="scope.row.scrmStatus" @change="switchlevel(scope.row)" :active-value="1" :inactive-value="0" active-color="#4168F6" inactive-color="#B9B9B9"
                          />
                           <span class="ml" v-if="scope.row.scrmStatus == 1">已开启</span>
                           <span class="ml" v-else>已关闭</span>
                </template>
              </el-table-column>
            </el-table>
   
            </div>
          </div>
        </div>
        <el-button type="primary" class="creatRole" @click="fnCreateRole">
          创建角色</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import SubTable from './SubTable'
import AddMobile from './wechatTable.vue'
export default {
  components: {
    SubTable,
    AddMobile,
  },
  data() {
    return {
      loading: false,
      tab: 'pc',
      characterName: '',
      dateList: [],
      phoneList: [],
      tableDate: [],
      defaultProps: {
        children: 'childrenList',
        label: 'title',
      },
      pcList: [],
      mobileList: [],
      idList: [],
      level:"",
      copyList: [],
         roleTableData:[
        {
          levelname:"仅本人",
          describe:"默认权限级别，只允许查看和操作本人相关的数据",
          scrmStatus:1,
          level:"P0",
          disabled: false,
          name:"1"
        },
        {
          levelname:"本人及所属部门",
          describe:"允许查看和操作本人及所属部门相关的数据",
          scrmStatus:0,
          level:"P1",
          disabled: false,
          name:"1"
        },
        {
          levelname:"本人及所属部门与所有下级部门",
          describe:"允许查看和操作本人及所属部门与所有下级部门相关的数据",
          scrmStatus:0,
          level:"P2",
          disabled: false,
          name:"1"
        },
        {
          levelname:"全公司",
          describe:"最高数据权限，允许查看和操作全公司的所有数据",
          scrmStatus:0,
          level:"P3",
          disabled: false,
          name:"1"
        },
      ]
    }
  },

  created() {},
  methods: {
    tabClick(v) {
      this.tab = v
      if(v == "access"){
        this.roleTableData.forEach((el,index) =>{
          if(el.level == "P0"){
            el.scrmStatus = 1
            el.disabled = true
          }else{
            el.scrmStatus = 0
            el.disabled = false
          }
        })
      }
    },
        switchlevel(val){
        console.log(val,"00000--")
        this.level = val.level
        // this.roleTableData.filter(el =>{
        //     if(el.level !== val.level){
        //       el.scrmStatus = 0
        //     }
        // })
        this.roleTableData.forEach((el,index) =>{
            if(el.level !== val.level){
              el.scrmStatus = 0
              el.disabled = false
            }else{
              el.scrmStatus = 1
              el.disabled = true
            }
        })
    },
    goback() {
      this.$router.go(-1)
    },
    fnCreateRole() {
      // console.log(
      //   '-----this.dateList--',
      //   this.$refs.addRole.dateList,
      //   this.$refs.addmobile.dateList
      // )
      let addlist = this.$refs.addRole.dateList || []
      let monilelist = this.$refs.addmobile.dateList || []
      this.pcList = []
      this.mobileList = []
      this.getTreeId(addlist)
      this.getMobileId(monilelist)
      this.setPermissions()
    },
    getTreeId(treeList) {
      // console.log('treeList-----', treeList)
      for (let i in treeList) {
        if (treeList[i].checked || treeList[i].isIndeterminate) {
          this.pcList.push(treeList[i].id)
        }
        if (treeList[i].childrenList.length > 0) {
          this.getTreeId(treeList[i].childrenList)
        }
      }
    },
    getMobileId(treeList) {
      for (let i in treeList) {
        if (treeList[i].checked || treeList[i].isIndeterminate) {
          this.mobileList.push(treeList[i].id)
        }
        if (treeList[i].childrenList.length) {
          this.getMobileId(treeList[i].childrenList)
        }
      }
    },
    setPermissions() {
      // console.log('-----this.pcList新增--', this.pcList)
      // console.log('-----this.mobileList新增--', this.mobileList)
      // console.log('-----this.characterName新增--', this.characterName)
      if (this.characterName !== '') {
        let params = {
          role: {
            name: this.characterName,
            dataPermission:this.level || "P0"
          },
          pcList: this.pcList,
          mobileList: this.mobileList,
        }
        this.$network.post('/user-service/role/addRole', params).then((res) => {
          if (res.code == 'success') {
            this.$router.push('roleSetting')
            this.$message({
              type: 'success',
              message: '添加成功',
              duration: 1000,
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请输入角色名称',
          duration: 1000,
        })
      }
    },
    fnInput() {},
  },
}
</script> 
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
.addrole-warp {
  .goback {
    width: 100px;
    margin: 0 0 16px 0;
    color: #4168f6;
    font-family: 600;
    img {
      width: 8px;
      height: 12px;
      vertical-align: middle;
    }
  }
  .newRole {
    height: 894px;
    background: #ffffff;
    border-radius: 8px;
    margin-top: 16px;
    padding: 16px;
    .addText {
      padding-left: 8px;
      font-size: 14px;
      font-weight: 600;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f2f7;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 3px;
        width: 2px;
        height: 14px;
        background: #4168f6;
      }
    }
    .roleName {
      display: flex;
      align-items: center;
      margin-top: 16px;
      font-size: 14px;
      .labelArea {
        margin-right: 8px;
        span:nth-child(1) {
          color: red;
        }
      }
      .inputArea {
        .el-input {
          width: 704px;
        }
      }
    }

    .permissionsSet {
      margin-top: 26px;
      .checkedTab {
        margin-top: 16px;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: calc(~'92% - 246px');
          height: 1px;
          background: #d9dae4;
          bottom: 0;
          left: 352px;
        }
        .active {
          color: #4168f6;
          background: #fff;
          border-bottom: none;
        }
        span {
          cursor: pointer;
          font-size: 14px;
          box-sizing: border-box;
          display: inline-block;
          padding: 6px 16px;
          background: #fafbff;
          border: 1px solid #d9dae4;
          border-radius: 6px 6px 0 0;
          margin-right: 16px;
        }
      }
      .permissTitle {
        font-size: 14px;
      }
      .tableWarp {
        max-height: 580px;
        overflow-y: scroll;
        margin-top: 16px;
        /deep/.el-table tbody tr:hover > td {
          background-color: #f4f6fe;
        }
        /deep/.el-table__empty-block {
          display: none !important;
        }
        /deep/.el-table thead {
          color: #3c4353;
          font-size: 14px;
        }
        .el-table {
          color: #3c4353;
        }
        .ml{
          margin-left: 10px;
        }
      }
    }
    .creatRole {
      margin-top: 32px;
      width: 104px;
    }
  }
}
</style>