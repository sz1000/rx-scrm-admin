<template>
  <div class="data_wrap">
    <div class="search_wrap">
      <div class="search_box">
        <div class="search_item">
          <div class="label">联系人姓名：</div>
          <div class="val">
            <el-input
              v-model="search.customerName"
              placeholder="请输入联系人姓名"
            ></el-input>
          </div>
        </div>
        <div class="search_item">
          <div class="label">手机号码：</div>
          <div class="val">
            <el-input
              v-model="search.customerPhone"
              placeholder="请输入手机号"
            ></el-input>
          </div>
        </div>
        <div class="search_item">
          <div class="label">浏览时间：</div>
          <div class="val time">
            <el-date-picker
              class="select"
              v-model="creatDate"
              @change="timeChangeFun"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="search_box">
        <div class="search_item">
          <div class="label user">员工姓名：</div>
          <div class="val">
            <el-select
              class="select"
              v-model="search.userName"
              placeholder="请选择姓名"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.userName"
                :value="item.userName"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="search_item">
          <div class="label">所属部门：</div>
          <div class="val">
            <el-select
              class="select"
              v-model="search.userDepartments"
              placeholder="请选择部门"
            >
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="opera_box">
          <el-button class="btn" @click="searchFun" size="small" type="primary"
            >查询</el-button
          >
          <el-button size="small" @click="resetFun">重置</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="list"
        :header-cell-style="{ background: '#FAFBFF', color: '#3C4353' }"
        style="width: 100%"
      >
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column
          prop="userName"
          show-overflow-tooltip
          label="员工姓名"
        ></el-table-column>
        <el-table-column
          prop="userDepartments"
          label="所属部门"
        ></el-table-column>
        <el-table-column
          prop="customerName"
          show-overflow-tooltip
          label="联系人姓名"
          width="100"
        >
          <template slot-scope="scope">
            <div class="user_box">
             
              <div class="name">{{ scope.row.customerName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="手机号"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="customerGender" label="性别">
          <template slot-scope="scope">{{
            scope.row.customerGender | sexFilter
          }}</template>
        </el-table-column>
        <el-table-column prop="customerArea" label="地区"></el-table-column>
        <el-table-column
          prop="customerTiming"
          label="浏览时长"
           show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="customerOpenTime"
          label="浏览时间"
          width="180"
           show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="customerLeaveTime"
          label="离开时间"
          width="180"
           show-overflow-tooltip
        ></el-table-column>
        <div slot="empty" class="empty" style="padding-top: 100px">
          <img
            src="@/assets/images/nodae.png"
            style="width: 280px; height: 233px"
          />
        </div>
      </el-table>
      <div class="pagePosition">
        <Pagination
          :total="total"
          :pageInfo="pageInfo"
          @pageChange="pageChange"
          v-if="total"
        >
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/elPagination.vue";
import {
  userBusinessCardViewLog_pageList,
  userdepartment_getAlllist,
} from "@/api/card";
import { sop_employeeList } from "@/api/sop";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      creatDate: "",
      search: {
        customerName: "",
        customerPhone: "",
        customerOpenTimeBegin: "",
        customerOpenTimeEnd: "",
        userName: "",
        userDepartments: "",
        current: 1,
        size: 10,
      },
      pageInfo: {
        page: 1,
        limit: 10,
      },
      userList: [],
      departmentList: [],
      list: [],
      total: 0,
    };
  },
  mounted() {
    this.getUserList();
    this.getDepartmentList();
    this.getList();
  },
  methods: {
    getList() {
      //获取列表
      userBusinessCardViewLog_pageList(this.search).then((res) => {
        if (res.result) {
          let list = res.data.records;
          let total = res.data.total;
          this.list = list;
          this.total = total;
        }
      });
    },
    timeChangeFun(e) {
      if (e && e.length > 0) {
        this.search.customerOpenTimeBegin = e[0] + " 00:00:00";
        this.search.customerOpenTimeEnd = e[1] + " 23:59:59";
      } else {
        this.search.customerOpenTimeBegin = "";
        this.search.customerOpenTimeEnd = "";
      }
    },
    searchFun() {
      this.search.current = 1;
      this.getList();
    },
    pageChange(e) {
      this.search.current = e.page;
      this.getList();
    },
    resetFun() {
      //重置
      this.search.customerName = "";
      this.search.customerPhone = "";
      this.creatDate = "";
      this.search.customerOpenTimeBegin = "";
      this.search.customerOpenTimeEnd = "";
      this.search.userName = "";
      this.search.userDepartments = "";
      this.searchFun();
    },
    getUserList() {
      //获取员工列表
      sop_employeeList().then((res) => {
        if (res.result) {
          let list = res.data;
          this.userList = list;
        }
      });
    },
    getDepartmentList() {
      //获取部门列表
      userdepartment_getAlllist().then((res) => {
        if (res.result) {
          let list = res.data;
          this.departmentList = list;
        }
      });
    },
  },
  filters: {
    sexFilter(val) {
      let json = {
        0: "未知",
        1: "男",
        2: "女",
      };
      return json[val];
    },
  },
};
</script>

<style lang="less" scoped>
.data_wrap {
  width: 100%;
  min-height: calc(100vh - 88px);
  background: @white;
  padding: 16px;
  position: relative;
  .search_wrap {
    width: 100%;
    .search_box {
      display: flex;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      .search_item {
        margin-right: 32px;
        display: flex;
        align-items: center;
        &:last-child {
          margin-right: 0;
        }
        .label {
          font-size: 14px;
          color: @fontMain;
          white-space: nowrap;
          &.user {
            width: 84px;
            text-align: right;
          }
        }
        .val {
          width: 205px;
          &.time {
            width: 220px;
          }
          /deep/ .el-input__inner {
            height: 32px;
           line-height: 32px;
          }
          /deep/ .el-input__icon {
            line-height: 32px;
            height: 32px;
          }
          /deep/ .el-date-editor .el-range-separator {
            height: 32px;
            min-width: 14px;
          }
          .select {
            // width: 100%;
          }
        }
      }
    }
    .opera_box {
      display: flex;
      .btn {
        background: @main;
        border-color: @main;
        &:hover {
          background: rgba(@main, 0.85);
        }
      }
    }
  }
  .table {
    margin-top: 16px;
    /deep/ .el-table::before {
      height: 0;
    }
    .user_box {
      display: flex;
      align-items: center;
      .avatar {
        width: 28px;
        height: 28px;
        background: rgba(@main, 0.05);
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .name {
        font-size: 14px;
        line-height: 20px;
        color: @fontMain;
        margin-left: 8px;
      }
    }
  }
}
</style>