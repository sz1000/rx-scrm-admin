<template>
  <div class="import_warp">
    <el-dialog title="导入" :visible.sync="importVisible" :before-close="dialogFormCancel" :close-on-click-modal='false' width="736px">
      <div class="info_tips" v-if="Number(type) > 2">
        <img src="@/assets/images/icon_info.png" alt="" />
        <span>管理员已设置客户根据【客户名称】不可重复</span>
      </div>
      <div class="mb_warp">点击下载&nbsp;<span @click="downloadTemp">模板</span>，帮助您快速完成导入</div>
      <!-- <div class="dispose">
        <span class="symbol">*</span>
        <span>重复数据处理方式：</span>
        <span>
          <el-radio-group v-model="radio" @change="changeWay">
            <el-radio :label="1">
              <span>覆盖原数据</span>
              <span>
                <el-popover placement="bottom" title="" trigger="hover" width='400'
                            content="1.如果已存在该客户，则覆盖该客户的所有原数据为导入的新数据，即不保留所有原数据。2.如果不存在该客户，则新增该客户数据，即导入为新客户">
                  <div class="info_icon" slot="reference">
                    <img src="../../../assets/images/info_icon.png" alt="">
                  </div>
                </el-popover>
              </span>
            </el-radio>
            <el-radio :label="2">
              <span>不做任何处理</span>
              <span>
                <el-popover placement="bottom" title="" trigger="hover" width='400'
                            content="1.如果已存在该客户，则查找该客户是否存在空白信息。如果存在空白信息，则进行数据填充。反之，如果非空白，则不做任何处理。2.如果不存在该客户，则新增该客户数据，即导入为新客户">
                  <div class="info_icon" slot="reference">
                    <img src="../../../assets/images/info_icon.png" alt="">
                  </div>
                </el-popover>
              </span>
            </el-radio>
          </el-radio-group>
        </span>
      </div> -->
      <div class="upload_warp">
        <el-upload class="upload-demo" ref='upload' drag action='#' :auto-upload="false" :on-change="handleChange" :file-list="excleList"
                   accept='.xlsx' :show-file-list="false" :on-remove="handleImgRemove" :before-upload="beforeAvatarUpload">
          <div class="file_warp" v-if="excleList.length">
            <img src="../../../assets/images/file_excle.png" alt="">
            <div class="right_file">
              <p class="file_name">{{filename}}</p>
              <p class="uploadText" @click="reloadUpload">重新上传</p>
            </div>
          </div>
          <div v-else>
            <img src="../../../assets/images/upload_import.png" alt="">
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传文件</em></div>
          </div>
        </el-upload>
      </div>
      <div class="tips_warp">
        <p>1. 仅支持 xlsx 格式的文件</p>
        <p>2. 请按照提供的标准模板填写信息，确保表单字段正确性和一致性</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="history_btn" @click="fnHistory">历史导入记录</div>
        <div>
          <el-button @click="dialogFormCancel">取 消</el-button>
          <el-button type="primary" @click="dialogFormSure('ruleForm')">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <div class="history_warp">
      <el-dialog title="历史导入记录" :visible.sync="dialogVisible" width="736px" :before-close="dialogBeforeClose">
        <div class="info_tips">
          <img src="@/assets/images/icon_info.png" alt="" />
          <span>历史导入记录仅保留7天，请及时处理，过期不可找回</span>
        </div>
        <div class="search_warp">
          <span class="date_text">导入时间:</span>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="yyyy-MM-dd" @change="selectHistory">
          </el-date-picker>
        </div>
        <div class="table_hist">
          <el-table :data="historyTable" tooltip-effect="dark" style="width: 100%"
                    :header-cell-style="{ background: '#FAFBFF', 'text-align': 'left' }">
            <el-table-column type="index" label="编号" width="70px" align="left">
            </el-table-column>
            <el-table-column prop="createTime" label="导入时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="importUserName" label="操作人" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="导入文件" show-overflow-tooltip min-width="120">
              <template slot-scope="scoped">
                <a class="herf_down" :href="scoped.row.importFileUrl" :download="scoped.row.importFileUrl">{{scoped.row.importFileName}}</a>
              </template>
            </el-table-column>
            <el-table-column label="导入结果" show-overflow-tooltip min-width="120">
              <template slot-scope="scoped">
                <a class="herf_down" :href="scoped.row.importFailedUrl" :download="scoped.row.importFailedUrl"
                   v-if="scoped.row.importFailedUrl !== null">{{scoped.row.importFailedName}}</a>
                <span v-else>{{scoped.row.importFailedName}}</span>
              </template>
            </el-table-column>
          </el-table>
          <NoDate v-if="!historyTable.length"></NoDate>
          <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="historyTable.length"></Pagination>
        </div>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import NoDate from '@/components/noDate'
import Pagination from '@/components/elPagination.vue'
import { fnImportExcle, pageList } from '../../../api/custom'
import { BASE_URL } from '../../../config/app.js'
import axios from 'axios'
export default {
  components: {
    NoDate,
    Pagination,
  },
  props: {
    importVisible: {
      type: Boolean,
    },
    type: {
      type: String,
    },
  },

  data() {
    return {
      radio: '',
      excleList: [],
      filename: '',
      BASE_URL,
      dialogVisible: false,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      total: 0,
      dateRange: [],
      historyTable: [],
      createTimeBegin: '',
      createTimeEnd: '',
    }
  },
  created() {},
  methods: {
    downloadTemp() {
      let token = localStorage.getItem('token')
      axios({
        method: 'get',
        url:
          BASE_URL +
          `/customer-service/clueCustomerInExport/template/download/${this.type}`,
        headers: {
          token: token,
        },
        responseType: 'blob',
      })
        .then((res) => {
          if (res) {
            // 文件下载
            const blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel;charset=utf-8',
            })
            let link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.setAttribute('download', '客户导入模板.xlsx')
            // console.log('------', res)
            link.click()
            link = null
            this.$message.success('导出成功')
          } else {
            // 返回json
            this.$message.warning(res.data.msg)
          }
        })
        .catch((err) => {})
    },
    changeWay() {},
    handleChange(file, fileList) {
      console.log(file, fileList)
      if (this.beforeAvatarUpload(file)) {
        this.excleList = fileList.slice(-1)
        this.filename = file.name
      } else {
        this.$message({
          type: 'error',
          message: '请上传xlsx格式的文件',
        })
        this.excleList = []
      }
    },
    beforeAvatarUpload(file) {
      var FileExt = file.name.match(/.xlsx/g) || []
      if (FileExt.length) {
        return true
      } else {
        return false
      }
    },
    handleImgRemove(file, fileList) {
      this.excleList = fileList
    },
    reloadUpload() {
      // console.log(this.excleList)
      this.excleList = []
    },
    dialogFormCancel() {
      this.$emit('closeImport')
    },

    dialogFormSure(ruleForm) {
      // console.log(
      //   '--upload---',
      //   this.radio,
      //   this.type,
      //   this.$refs.upload,
      //   this.$refs.upload.uploadFiles[0]
      // )
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      let file = this.$refs.upload.uploadFiles[0]
      let formData = new FormData()
      formData.append('excel', file.raw)
      formData.append('mode', this.radio)
      formData.append('type', this.type)
      fnImportExcle(formData, config).then((res) => {
        if (res.result) {
          this.$emit('closeImport', 1)
        }
      })
    },
    selectHistory(e) {
      // console.log(val)
      this.pageInfo.page = 1
      if (e && e.length > 0) {
        this.createTimeBegin = e[0] + ' 00:00:00'
        this.createTimeEnd = e[1] + ' 23:59:59'
      } else {
        this.createTimeBegin = ''
        this.createTimeEnd = ''
      }
      this.getList()
    },
    fnHistory() {
      this.dialogVisible = true
      this.getList()
    },
    dialogBeforeClose() {
      this.dialogVisible = false
    },
    pageChange(item) {
      // this.getRoleList()
      this.getList()
    },
    getList() {
      let params = {
        current: this.pageInfo.page,
        size: this.pageInfo.limit,
        createTimeBegin: this.createTimeBegin,
        createTimeEnd: this.createTimeEnd,
      }
      pageList(params).then((res) => {
        this.historyTable = res.data.records
        this.total = res.data.total
      })
    },
  },
}
</script>
<style lang="less" scoped>
.import_warp {
  /deep/.el-dialog {
    // position: relative;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      line-height: 50px;
      padding: 0 16px;
      background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
        color: #3c4353;
      }
      .el-dialog__headerbtn {
        top: 0;
      }
    }
    .el-dialog__body {
      padding: 32px;
      overflow-y: scroll;
      height: 492px;
      .info_tips {
        height: 32px;
        line-height: 32px;
        background: rgba(65, 104, 246, 0.08);
        border-radius: 4px;
        border: 1px solid #4168f6;
        padding-left: 16px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
      .mb_warp {
        font-size: 14px;
        margin-bottom: 20px;
        span {
          color: #4168f6;
          cursor: pointer;
        }
      }
      .dispose {
        margin-bottom: 20px;
        .el-radio {
          &.is-checked {
            .el-radio__input.is-checked .el-radio__inner {
              background: #4168f6;
              border-color: #4168f6;
            }
            .el-radio__label {
              color: #4168f6;
            }
          }
        }
        .symbol {
          color: red;
          display: inline-block;
          vertical-align: middle;
        }
        .info_icon {
          display: inline-block;
          img {
            width: 14px;
            height: 14px;
            vertical-align: -10%;
          }
        }
      }
      .upload_warp {
        .el-upload {
          width: 100%;
          .el-upload-dragger {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 240px;
            background: #fafbff;
            img {
              width: 80px;
              height: 80px;
            }
            em {
              color: #4168f6;
            }
          }
        }
        .file_warp {
          width: 390px;
          height: 100px;
          background: #ffffff;
          box-shadow: 0px 3px 15px 0px rgba(0, 0, 0, 0.04);
          display: flex;
          padding: 13px;
          img {
            margin-right: 16px;
          }
          .uploadText {
            cursor: pointer;
            color: #4168f6;
            text-align: left;
            font-size: 14px;
          }
          .file_name {
            font-size: 16px;
            color: #3c4353;
            margin-bottom: 16px;
          }
        }
      }
      .tips_warp {
        color: #838a9d;
        p {
          margin-top: 20px;
        }
      }
    }

    .el-dialog__footer {
      border-top: 1px solid #f0f2f7;
      .dialog-footer {
        display: flex;
        justify-content: space-between;
      }
      .history_btn {
        font-size: 14px;
        color: #4168f6;
        line-height: 20px;
        cursor: pointer;
      }
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
  .history_warp {
    /deep/.el-table__empty-block {
      display: none !important;
    }
    // /deep/tr td .cell {
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   display: -webkit-box;
    //   -webkit-line-clamp: 1; /*可以显示的行数，超出部分用...表示 */
    //   -webkit-box-orient: vertical;
    // }
    .search_warp {
      display: flex;
      margin-bottom: 16px;
      height: 32px;
      line-height: 32px;
      .date_text {
        display: inline-block;
        margin-right: 8px;
      }
      .el-range-editor.el-input__inner {
        padding: 0 10px;
      }
    }
    .herf_down {
      cursor: pointer;
      color: #4168f6;
    }
  }
}
</style>
