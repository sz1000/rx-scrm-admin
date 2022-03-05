<template>
  <div class="mt-search">
    <div class="item">
      <span class="label">{{ title }}:</span>
      <span class="value">
        <el-input v-model="searchText" :placeholder="`请输入${title}`" clearable></el-input>
      </span>
    </div>
    <div class="item" v-if="hasTime == 1">
      <span class="label">{{ timeName }}:</span>
      <span class="value">
        <el-date-picker v-model="creatDate" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
                        value-format="yyyy-MM-dd" @change="changeDate">
        </el-date-picker>
      </span>
    </div>
    <div class="btns">
      <el-button type="primary" @click="checkTable(searchText, date)" class="item">查询</el-button>
      <el-button @click="resetTable" class="item">重置</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mtSearch',
  props: {
    title: {
      type: String,
      default: '文章标题',
    },
    timeName: {
      type: String,
      default: '创建时间',
    },
    hasTime: {
      default: 0,
    },
  },
  data() {
    return {
      searchText: '',
      date: {
        beginTime: null,
        endTime: null,
      },
      creatDate: null,
    }
  },
  inject: ['checkTable', 'resetTable'],
  methods: {
    changeDate(val) {
      if (!val) {
        this.date.beginTime = null
        this.date.endTime = null
        return
      }

      if (val[0] == val[1]) {
        this.date.beginTime = val[0] + ' 00:00:00'
        this.date.endTime = val[0] + ' 23:59:59'
      } else {
        this.date.beginTime = val[0] + ' 00:00:00'
        this.date.endTime = val[1] + ' 23:59:59'
      }
    },
    initData() {
      this.searchText = ''
      this.creatDate = null
      this.date = {
        beginTime: null,
        endTime: null,
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/elementStyle';
.mt-search {
  line-height: 64px;
  border-radius: 8px;
  background: #ffffff;
  color: #3c4353;
  font-size: 14px;
  .item {
    display: inline-block;
    vertical-align: middle;
    &:not(:last-child) {
      margin-right: 32px;
    }
    span {
      display: inline-block;
    }
    .label {
      width: 80px;
    }
    .value {
      min-width: 200px;
    }
  }
  .btns {
    display: inline-block;
    width: 145px;
    .item {
      margin: 0;
      &:first-child {
        margin: 0 16px 0 0;
      }
    }
  }
}
</style>