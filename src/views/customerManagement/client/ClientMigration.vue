<template>
  <div class="addrole-warp">
   
    <div class="newRole" v-loading='loading'>
    
 
      <div class="permissionsSet">
   
        <div class="checkedTab">
          <span @click="tabClick('fenpei')" :class="{'active':tab=='fenpei'}">客户分配</span>
          <span @click="tabClick('lishi')" :class="{'active':tab=='lishi'}">分配历史</span>
        </div>
        <div class="tableWarp">
          <div v-if="tab=='fenpei'">
            <SubTable ref="addRole"></SubTable>
          </div>
          <div v-if="tab=='lishi'">
            <AddMobile ref="addmobile"></AddMobile>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SubTable from './AllocationHistory'
import AddMobile from './ClientalloCation'
export default {
  components: {
    SubTable,
    AddMobile,
  },
  data() {
    return {
      loading: false,
      tab: 'fenpei',
    }
  },

  created() {},
  methods: {
     tabClick(v) {
      this.tab = v
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
    //   margin-top: 26px;
      .checkedTab {
        margin-top: 16px;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: calc(~'100% - 246px');
          height: 1px;
          background: #d9dae4;
          bottom: 0;
          left: 195px;
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
        // max-height: 580px;
        overflow-y: scroll;
        // margin-top: 16px;
        /deep/.el-table tbody tr:hover > td {
          background-color: #f4f6fe;
        }
        /deep/.el-table__empty-block {
          display: none !important;
        }
        /deep/.el-table thead {
          color: #3c4353;
          font-family: PingFangSC-Medium;
          font-size: 14px;
        }
        .el-table {
          color: #3c4353;
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