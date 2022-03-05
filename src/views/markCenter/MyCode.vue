<template>
  <div class="enterCodeWarp">
    <div class="selectHeader">
      <el-row :gutter="24">
        <el-col :span="6">
          <span class="inputName"> 活码名称:</span>
          <el-input placeholder="请输入活码名称" v-model="livename" maxlength="30">
          </el-input>
        </el-col>
        <el-col :span="6">
          <span class="inputName"> 使用员工:</span>
          <el-input placeholder="请输入名称" v-model="name" maxlength="30">
          </el-input>
        </el-col>
        <el-col :span="6">
          <span class="width60"> 渠道:</span>
          <el-select v-model="chId" placeholder="请选择渠道" @change="changeList" clearable>
            <el-option v-for="item in channelList" :key="item.value" :label="item.name" :value="item.chId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <span class="inputName"> 创建时间:</span>
          <el-date-picker v-model="creatTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="yyyy-MM-dd" @change="changeDate">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <div @click="checkTable" class="check btnBox pointer but_click">
            查询
          </div>
          <div @click="resetTable" class="reset btnBox pointer but_hove">
            重置
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="btnTwoBox">
      <div class="codeBtn pointer" @click="addEnterCode" v-show="expandedKeys.some(item=>item.enName == 'add')">
        <img src="../../assets/images/icon_add@2x.png" alt="" />
        新增活码
      </div>
    </div>

    <div class="enterTableWarp">
      <el-table :data="enterTable" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }">
        <el-table-column type="index" width="60px" label="编号" align="left">
        </el-table-column>
        <el-table-column label="二维码">
          <template slot-scope="scope">
            <img :src="scope.row.address" alt="" style="width: 60px; height: 60px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="活码名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="userNames" label="使用员工" show-overflow-tooltip=""> </el-table-column>
        <el-table-column prop="createBy" label="创建人员" show-overflow-tooltip=""> </el-table-column>
        <el-table-column prop="chName" label="渠道" show-overflow-tooltip> </el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip="">
          <template slot-scope="scope">
            {{
              scope.row.createTime
                ? formatDate(scope.row.createTime, "yyyy-MM-dd hh:mm:ss")
                : "-" 
            }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <span @click="downLoadCode(scope.$index, scope.row)" class="table_txt">
              下载
            </span>
            <span @click="handleEdit(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'edit')">
              编辑
            </span>
            <span @click="handleClick(scope.$index, scope.row)" class="table_txt">
              详情
            </span>
            <span @click="deleteRow(scope.$index, scope.row)" class="table_txt" v-show="expandedKeys.some(item=>item.enName == 'delete')">
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <NoDate v-if="!enterTable.length"></NoDate>
    </div>
    <div v-if="addTable">
      <AddForm @closeAddForm="closeAddForm" :addVisible="addTable"></AddForm>
    </div>
    <div v-if="editTable">
      <CodeEditForm @closeDialog="closeDialog" :dialogFormVisible="editTable" :editForm="objInfo">
      </CodeEditForm>
    </div>
    <div v-if="detailDialog">
      <CodeDetailForm :infoFormVisible="detailDialog" @closeInfoForm="closeInfoForm" :detailForm="objInfo"></CodeDetailForm>
    </div>
    <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="enterTable.length"></Pagination>
  </div>
</template>
<script>
import NoDate from '../../components/noDate'
import CodeEditForm from './CodeEditForm.vue'
import CodeDetailForm from './CodeDetailForm.vue'
import AddForm from './AddForm.vue'
import Pagination from '../../components/elPagination.vue'
import { formatDate } from '../../utils/tool'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import MyMixin from '../../mixins/permissions'
import {
  livecode_getLivecodeList,
  livecode_toadd,
  livecode_delLivecode,
} from '@/api/tools'
export default {
  name: 'enterpriseLive',
  mixins: [MyMixin],
  components: {
    NoDate,
    AddForm,
    Pagination,
    CodeEditForm,
    CodeDetailForm,
    VueQrcode,
  },
  data() {
    return {
      livename: '',
      name: '',
      createBy: '',
      creatTime: [],
      enterTable: [],
      options: [],
      channelList: [],
      chId: '',
      editTable: false,
      detailDialog: false,
      addTable: false,
      total: 0,
      pageInfo: {
        page: 1,
        limit: 10,
      },
      objInfo: {},
      expandedKeys: [],
      // transit: `https://console-scrm.ruixin.tech/#/transitCode`,
    }
  },
  created() {
    this.getTableList()
    this.getChanelList()
  },
  methods: {
    formatDate,
    getTableList() {
      let params = {
        type: 1,
        livename: this.livename,
        chId: this.chId,
        name: this.name,
        createBy: this.createBy,
        createTimeSta: this.creatTime[0] || '',
        createTimeEnd: this.creatTime[1] || '',
        ...this.pageInfo,
      }
      livecode_getLivecodeList(params).then((res) => {
        if (res.result) {
          this.options = res.data.userlist
          this.enterTable = res.data.iPage.records
          this.total = res.data.iPage.total
        }
      })
    },
    getChanelList() {
      livecode_toadd().then((res) => {
        if (res.result) {
          this.channelList = res.data.chlist
        }
      })
    },
    addEnterCode() {
      this.addTable = true
    },
    closeAddForm() {
      this.addTable = false
      this.getTableList()
      this.getChanelList()
    },
    checkTable() {
      this.pageInfo.page = 1
      this.getTableList()
    },
    resetTable() {
      this.livename = ''
      this.chId = ''
      this.name = ''
      this.createBy = ''
      this.creatTime = []
      this.getTableList()
    },
    userChange(item) {
      console.log(item)
    },
    changeList() {},
    changeDate(value) {
      this.creatTime = [value[0] + ' 00:00:00', value[1] + ' 23:59:59']
    },
    downLoadCode(index, row) {
      this.downloadIamge(row.address, 'pic')
    },
    downloadIamge(imgsrc, name) {
      //下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },
    handleEdit(index, row) {
      console.log(row)
      this.objInfo = row
      this.editTable = true
    },
    handleClick(index, row) {
      this.detailDialog = true
      console.log(row)
      this.objInfo = row
    },
    deleteRow(index, rows) {
      this.$confirm('是否确认删除', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'sureBtn',
        cancelButtonClass: 'cancelBtn',
        type: 'error',
      })
        .then(() => {
          let data = {
            livecodeNo: rows.livecodeNo,
          }
          livecode_delLivecode(data).then((res) => {
            if (res.result) {
              let totalPage = Math.ceil((this.total - 1) / this.pageInfo.limit)
              let pageIndex =
                this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page
              this.pageInfo.page = pageIndex < 1 ? 1 : pageIndex
              this.getTableList()
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    pageChange(item) {
      // console.log('', item)
      this.getTableList()
    },
    closeInfoForm() {
      this.detailDialog = false
      this.getTableList()
    },
    closeDialog() {
      this.editTable = false
      this.getTableList()
      this.getChanelList()
    },
  },
}
</script>
<style>
.el-tooltip__popper {
  max-width: 500px !important;
}
</style>
<style lang="less" scoped>
.enterCodeWarp {
  min-height: calc(100vh - 88px);
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #3c4353;
  .selectHeader {
    // display: flex;
    .el-row:nth-child(1) {
      margin-bottom: 16px;
    }
    .el-input {
      height: 32px;
      // width: 203px;
      /deep/.el-input__inner {
        height: 32px;
        // width: 203px;
      }
    }
    /deep/.el-select {
      height: 32px;
      width: 100%;
      // margin-right: 32px;
      .el-input__inner {
        height: 32px;
        // width: 100%;
      }
      .el-input__icon {
        line-height: 32px;
      }
    }
    /deep/.el-range-editor.el-input__inner {
      width: 100%;
      height: 32px;
      // margin-right: 32px;
      padding: 0 10px;
      .el-date-editor .el-range__icon {
        line-height: 0;
      }
    }
    .el-col {
      display: flex;
    }
    .inputName {
      line-height: 32px;
      display: inline-block;
      width: 90px;
      text-align: center;
    }
    .width60 {
      line-height: 32px;
      display: inline-block;
      min-width: 60px;
      text-align: center;
    }
    .btnBox {
      width: 60px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #d9dae4;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
    }
    .check {
      color: #fff;
      background: #4168f6;
      // margin-left: 32px;
    }
    .reset {
      margin-left: 16px;
    }
  }
  .codeBtn {
    width: 104px;
    height: 32px;
    background: rgba(65, 104, 246, 0.04);
    border-radius: 4px;
    border: 1px solid #4168f6;
    text-align: center;
    color: #4168f6;
    line-height: 32px;
    margin: 16px 0;
    float: right;
    img {
      width: 12px;
      height: 12px;
    }
  }
  .daochuBtn {
    width: 104px;
    height: 32px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    border: 1px solid #d9dae4;
    text-align: center;
    color: #3c4353;
    line-height: 32px;
    margin: 16px 0;
    float: left;
    img {
      width: 12px;
      height: 12px;
      color: #3c4353;
    }
  }

  .enterTableWarp {
    min-height: 500px;
    /deep/.el-table thead {
      color: #3c4353;
      font-size: 14px;
    }
    .el-table {
      color: #3c4353;
      &::before {
        width: 0;
      }
    }
    .table_txt {
      display: inline-block;
      color: #4168f6;
      margin-right: 8px;
      cursor: pointer;
    }
    /deep/.el-table tbody tr:hover > td {
      background-color: #f4f6fe;
    }
    // /deep/.el-table {
    //   tr td .cell {
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    //     display: -webkit-box;
    //     -webkit-line-clamp: 1; /*可以显示的行数，超出部分用...表示 */
    //     -webkit-box-orient: vertical;
    //   }
    // }
  }
}
/deep/.el-table__empty-block {
  display: none !important;
}
.btnTwoBox {
  width: 220px;
  height: 34px;
  float: right;
  margin-bottom: 50px;
}
</style>
