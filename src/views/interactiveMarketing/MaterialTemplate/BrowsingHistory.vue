<template>
  <div class="edit_dialog">
    <el-dialog title="浏览记录" :visible.sync="infoFormVisible" :before-close="dialogFormCancel" :close-on-click-modal="false" width="756px">
      <div class="table_warp">
        <div class="one">
          <div class="left">
            <img :src="customerRow.avatar" alt="" v-if="customerRow.avatar">
            <!-- <img src="../../images/img_head.png" alt="" v-else> -->
            <div class="name_warp">
              <div class="top">
                <span>{{customerRow.customerName}}</span>
                <span
                      :class="customerRow.externalType == 1 ? 'green': 'yellow'">{{customerRow.externalType == 1 ? '@微信' : (customerRow.externalCorpFullName || customerRow.externalCorpName) ? `@${customerRow.externalCorpFullName || customerRow.externalCorpName}` : ''}}</span>
                <span v-show="customerRow.customerType == 3" class="newClues">新线索</span>
                <span v-show="customerRow.customerType == 2" class="clues">线索</span>
                <span v-show="customerRow.customerType == 1" class="customer">客户</span>
              </div>
              <p>共浏览{{customerRow.openCount}}次，总时长{{secondToDate(customerRow.duration)}}</p>
            </div>
          </div>
        </div>
        <ul class="list_warp">
          <li v-for="item in recordList" :key="item.id">
            <span>浏览了{{secondToDate(item.duration)}}</span>
            <span>浏览时间:{{item.createTime}}</span>
            <span>素材分享人: <img :src="item.shareUserAvatar" alt=""> {{item.shareUserName | filterName}}</span>
          </li>
        </ul>
        <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="recordList.length"></Pagination>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogFormCancel">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Pagination from '../../../components/elPagination'
import { material_operation } from '../../../config/api'
export default {
  props: {
    infoFormVisible: {
      type: Boolean,
    },
    customerRow: {
      type: Object,
    },
  },
  components: {
    Pagination,
  },
  data() {
    return {
      page: 1,
      pageSize: 20,
      total: 0,
      articleId: '',
      recordList: [],
      pageInfo: {
        page: 1,
        limit: 20,
      },
      type: '',
      avatar: '',
    }
  },
  mounted() {
    const { articleId, documentId, type } = this.$route.query

    this.articleId = articleId
    this.documentId = documentId
    this.type = type
    this.getDetail()
  },
  methods: {
    pageChange() {
      this.getDetail()
    },
    getDetail() {
      let params = {
        materialType: this.type,
        materialId: this.articleId,
        customerId: this.customerRow.customerId,
        pageIndex: this.page,
        pageSize: this.pageSize,
      }
      material_operation(params).then((res) => {
        if (res.result && res.data) {
          this.recordList = res.data.page.records || []
          this.total = res.data.page.total || 0
          this.avatar = res.data.avatar
        }
      })
    },
    dialogFormCancel() {
      this.$emit('closeInfoForm')
    },
    secondToDate(result) {
      let _str = ''
      var h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      var m =
        Math.floor((result / 60) % 60) < 10
          ? '0' + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
      var s =
        Math.floor(result % 60) < 10
          ? '0' + Math.floor(result % 60)
          : Math.floor(result % 60)
      if (Number(h)) {
        _str = h + '小时' + m + '分' + s + '秒'
      } else if (Number(m)) {
        _str = m + '分' + s + '秒'
      } else {
        if (Number(s) > 0) {
          _str = Number(s) + '秒'
        } else {
          _str = '0秒'
        }
      }
      return _str
    },
  },
  filters: {
    filterName(name) {
      if (name && name.length > 3) {
        return name.slice(0, 3) + '...'
      } else {
        return name
      }
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    // height: 606px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #3c4353;
      }
    }
    .el-dialog__body {
      padding: 16px;
      .table_warp {
        .one {
          display: flex;
          justify-content: space-between;
          align-items: center;
          // padding: 0 32px 32px;
          border-bottom: 1px solid #e6e6e6; /* no */
          .left {
            display: flex;
            max-width: 80%;
            .name_warp {
              display: flex;
              flex-direction: column;
              justify-content: center;
              .top {
                span {
                  display: inline-block;
                }
                span:nth-child(1) {
                  font-size: 14px;
                  color: #262626;
                  font-weight: bold;
                }
                .green {
                  font-size: 12px;
                  display: inline-block;
                  color: #52bd94;
                  margin-right: 8px;
                  margin-left: 4px;
                }
                .yellow {
                  font-size: 12px;
                  display: inline-block;
                  color: #ffb020;
                  margin-right: 8px;
                  margin-left: 4px;
                }
                .newClues {
                  font-size: 10px;
                  border: 1px solid #fb8f28; /* no */
                  color: #fb8f28;
                  padding: 2px 16px;
                  border-radius: 21px;
                }
                .clues {
                  font-size: 10px;
                  border: 1px solid #55a7fe; /* no */
                  color: #55a7fe;
                  padding: 1px 8px;
                  border-radius: 10px;
                }
                .customer {
                  font-size: 10px;
                  border: 1px solid #4168f6; /* no */
                  color: #4168f6;
                  padding: 1px 8px;
                  border-radius: 10px;
                }
              }
              p {
                margin-top: 8px;
                color: #b3b3b3;
                font-size: 12px;
              }
            }
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-right: 8px;
            }
          }
        }
        .list_warp {
          li {
            display: flex;
            align-items: center;
            // justify-content: space-between;
            width: 100%;
            padding: 16px 14px;
            span:nth-child(1) {
              display: inline-block;
              width: 202px;
            }
            span:nth-child(2) {
              display: inline-block;
              width: 270px;
            }
            span:nth-child(3) {
              display: flex;
              align-items: center;
              width: 168px;
              img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      position: absolute;
      bottom: 16px;
      right: 16px;
      .el-button {
        width: 60px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
        padding: 0;
        border: 1px solid #d9dae4;
      }
      .el-button--primary {
        background: #4168f6;
      }
    }
  }
}
.dialog-footer {
  height: 64px;
  line-height: 64px;
  padding-right: 16px;
  border-top: 1px solid #f0f2f7;
  text-align: right;
  .el-button {
    width: 60px;
    height: 32px;
    border-radius: 4px;
    text-align: center;
    padding: 0;
    border: 1px solid #d9dae4;
  }
  .el-button--primary {
    background: #4168f6;
  }
}
</style>
