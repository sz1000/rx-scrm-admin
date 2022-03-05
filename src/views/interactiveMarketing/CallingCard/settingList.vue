<template>
  <div class="list_wrap">
    <div class="top_black" @click="$router.go(-1)">返回</div>
    <div class="list_content">
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
        <div class="opera_box">
          <el-button class="btn" @click="searchFun" size="small" type="primary"
            >查询</el-button
          >
          <el-button size="small" @click="resetFun">重置</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="list"
          :header-cell-style="{ background: '#FAFBFF', color: '#3C4353' }"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="编号"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="customerName"
            show-overflow-tooltip
            label="联系人姓名"
            
          >
            <template slot-scope="scope">
              <div class="user_box">
              
                <div class="name">{{ scope.row.customerName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerPhone"
            label="手机号"
               show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="customerGender" label="性别">
            <template slot-scope="scope">{{
              scope.row.customerGender | sexFilter
            }}</template>
          </el-table-column>
          <el-table-column prop="customerArea" label="地区"    show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="customerTiming"
            label="浏览时长"
          ></el-table-column>
          <el-table-column
            prop="customerOpenTime"
            label="浏览时间"
               show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="customerLeaveTime"
            label="离开时间"
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
  </div>
</template>

<script>
import Pagination from "@/components/elPagination.vue";
import { userBusinessCardViewLog_pageList } from "@/api/card";
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
        userBusinessCardId: 1, //是否个人
        current: 1,
        size: 10,
      },
      pageInfo: {
        page: 1,
        limit: 10,
      },
      list: ["", "", "", "", ""],
      total: 10,
    };
  },
  mounted() {
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
      this.searchFun();
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
@import "~@/styles/color.less";
.list_wrap {
  width: 100%;
  min-height: calc(100vh - 88px);
  position: relative;
  .top_black {
    font-size: 16px;
    line-height: 22px;
    color: @main;
    font-weight: 500;
    margin-bottom: 16px;
    cursor: pointer;
    position: relative;
    padding-left: 20px;
    display: inline-block;
    &::before {
      content: "<";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .list_content {
    width: 100%;
    min-height: calc(100vh - 126px);
    background: @white;
    border-radius: 8px;
    padding: 16px;
    .search_wrap {
      width: 100%;
      display: flex;
    }
    .search_box {
      display: flex;
      .search_item {
        margin-right: 15px;
        display: flex;
        align-items: center;
        &:last-child {
          margin-right: 0;
        }
        .label {
          font-size: 14px;
          color: @fontMain;
          white-space: nowrap;
        }
        .val {
          width: 205px;
          &.time {
            width: 234px;
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
            width: 100%;
          }
        }
      }
    }
    .opera_box {
      display: flex;
      margin-left: 32px;
      .btn {
        background: @main;
        border-color: @main;
        &:hover {
          background: rgba(@main, 0.85);
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
}
</style>