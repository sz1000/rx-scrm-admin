<<template>
	<div class="page">
		<el-pagination
			background
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="pageInfo.page"
			:page-sizes="[10, 20, 50, 100]"
			:page-size="pageInfo.limit"
      :pager-count="isTo"
			prev-text="上一页"
			next-text="下一页"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>
	</div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          page: 1,
          limit: 20,
        }
      },
    },
    isTo: {
      type: Number,
      default: () => {
        return 7
      },
    },
  },

  // props: ['total'],
  data() {
    return {
      // 页码参数
      // page: {},
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageInfo.limit = val
      console.log(`每页 ${this.pageInfo.limit} 条`)
      this.$emit('pageChange', this.pageInfo)
    },
    handleCurrentChange(val) {
      this.pageInfo.page = val
      console.log(`当前页: ${this.pageInfo.page}`)
      this.$emit('pageChange', this.pageInfo)
    },
  },
}
</script>

<style lang="less" scoped>
.page {
  text-align: right;
  margin-top: 16px;
  // position: absolute;
  // bottom: 36px;
  // right: 16px;
  /deep/.el-pagination {
    .el-pagination__total {
      font-size: 14px;
      // font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #838a9d;
      line-height: 32px;
    }
    .el-input__inner {
      width: 111px;
      height: 32px;
      border-radius: 4px;
    }
    .el-pager {
      .number {
        color: #838a9d;
        width: 32px;
        height: 32px;
        background: #ffffff;
      }
      .active {
        background-color: #4168f6 !important;
      }
    }
    .btn-prev,
    .btn-next {
      width: 74px;
      height: 32px;
      background: #f5f6fa;
      border-radius: 4px 0px 0px 4px;
    }
    .el-pagination__jump {
      .el-input__inner {
        width: 35px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #d9dae4;
      }
    }
    .el-pagination__editor {
      width: 50% !important;
    }
  }
}
</style>
