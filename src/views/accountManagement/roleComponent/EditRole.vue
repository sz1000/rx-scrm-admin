<template>
  <div class="addrole-warp">
    <div class="goback pointer" @click="goback">
      <img src="../../../assets/images/goback.png" alt="" /> 返回
    </div>
    <div class="newRole" v-loading='loading'>
      <div class="addText">
        权限配置
      </div>
      <div class="roleName">
        <div class='labelArea'>
          <span>*</span>
          <span>角色名称:</span>
        </div>
        <div class="inputArea">
          <el-input v-model="characterName" @change="fnInput" placeholder="请输入角色名称" maxlength="20" show-word-limit />
        </div>
      </div>
      <div class="permissionsSet">
        <div class="permissTitle">权限设置:</div>
        <div class="checkedTab">
          <span @click="tabClick('pc')" :class="{'active':tab=='pc'}">PC工作台</span>
          <span @click="tabClick('mobile')" :class="{'active':tab=='mobile'}">移动端H5(企微)</span>
          <span @click="tabClick('access')" :class="{'active':tab=='access'}">数据权限</span>
        </div>
        <div class="tableWarp">
          <div v-show="tab=='pc'">
            <!-- <SubTable v-for="(item,index) in dateList" :key="index" :menu='item'></SubTable> -->
            <SubTable ref="addRole"></SubTable>
          </div>
          <div v-show="tab=='mobile'">
            <!-- <SubTable v-for="(item,index) in phoneList" :key="index" :menu='item'></SubTable> -->
            <EditTable ref="addmobile"></EditTable>
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
      </div>
      <el-button type="primary" class="creatRole" @click="fnCreateRole">保存修改</el-button>
    </div>
  </div>
</template>
<script>
import SubTable from './SubTable.vue'
import EditTable from './wechatTable.vue'
// import SubTable from './SubTable copy.vue'

export default {
  components: {
    SubTable,
    EditTable,
  },
  data() {
    return {
      level:"",
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
      mobileList: [],
      pcList: [],
      role: {},
      roleTableData:[
        {
          levelname:"仅本人",
          describe:"默认权限级别，只允许查看和操作本人相关的数据",
          scrmStatus:0,
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

  created() {
    this.getDetail()
  },
  mounted() {},
  methods: {
    switchlevel(val){
        console.log(val,"00000--")
        this.role.dataPermission = val.level
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
        // this.roleTableData.forEach((el,index) =>{
        //     if(el.level == val.level){
        //       el.scrmStatus = 1
        //       el.disabled = true
        //     }
        // })
    },
    getDataList() {
      this.$network
        .get('/user-service/role/getRole2PermissionList', {
          endPoint: this.tab,
        })
        .then((res) => {
          this.dateList = res.data.pc
          this.phoneList = res.data.mobile
          this.showRow(this.dateList)
          this.showRow(this.phoneList)
        })
    },
    getDetail() {
      this.loading = true
      this.$network
        .get('/user-service/role/getDetail', {
          id: this.$route.query.id,
        })
        .then((res) => {
          this.characterName = res.data.role.name
          this.role = res.data.role
          this.loading = false
          this.level = res.data.role.dataPermission
        })
    },
    tabClick(v) {
      this.tab = v
      this.getDetail()
      if(v == "access"){
        console.log(this.level,"----p")
        this.roleTableData.forEach((el,index) =>{
           console.log(this.level)
            if(el.level == this.level){
              el.scrmStatus = 1
                el.disabled = true
            }else{
               el.scrmStatus = 0
              el.disabled = false
            }
           
         })
      }
    },
    showRow(list) {
      // console.log('---list----', list)
      list.forEach((item) => {
        item.showRow = this.hasThreeChild(item.childrenList)
        // console.log('----this.pclist---', this.pcList)
        this.pcList.forEach((pid) => {
          if (item.id == pid) {
            item.checked = true
          }
        })
        this.mobileList.forEach((pid) => {
          if (item.id == pid) {
            item.checked = true
          }
        })
        if (item.childrenList && item.childrenList.length !== 0) {
          this.showRow(item.childrenList)
        }
      })
    },
    hasThreeChild(list) {
      return list.some((item) => item.childrenList.length !== 0)
    },
    goback() {
      this.$router.go(-1)
    },
    fnCreateRole() {
      let addlist = this.$refs.addRole.dateList || []
      let monilelist = this.$refs.addmobile.dateList || []
      this.pcList = []
      this.mobileList = []
      this.getTreeId(addlist)
      this.getMobileId(monilelist)
      this.setPermissions()
    },
    getTreeId(treeList) {
      for (let i in treeList) {
        if (treeList[i].checked || treeList[i].isIndeterminate) {
          this.pcList.push(treeList[i].id)
        }
        if (treeList[i].childrenList.length) {
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
      // console.log('-----this.pcList编辑--', this.pcList)
      // console.log('-----this.mobileList编辑--', this.mobileList)
      // console.log('-----this.characterName编辑--', this.characterName)
      if (this.characterName !== '') {
        let params = {
          role: {
            ...this.role,
            name: this.characterName,
          },
          pcList: this.pcList,
          mobileList: this.mobileList,
        }
        this.$network
          .post('/user-service/role/modifyRole', params)
          .then((res) => {
            if (res.code == 'success') {
              this.$router.go(-1)
              this.$router.push({
                name: 'roleSetting',
                params: {
                  reset: true,
                },
              })
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
    fnInput() {
      // console.log('--characterName--', this.characterName)
    },
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
          width: calc(~'93% - 246px');
          height: 1px;
          background: #d9dae4;
          bottom: 0;
          left: 347px;
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
        .assdata{
          /deep/.el-table__empty-block {
            display: none !important;
        }
        }
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