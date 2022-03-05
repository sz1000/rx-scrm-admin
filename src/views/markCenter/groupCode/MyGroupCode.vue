<template>
  <div class="enterCodeWarp">
    <div class="selectHeader">
      <el-row :gutter="24" class="firstRow">
        <el-col :span="6">
          <span class="inputName"> 活码名称:</span>
          <el-input placeholder="请输入活码名称" v-model="livename"> </el-input>
        </el-col>
        <el-col :span="6">
          <span class="inputName"> 使用员工:</span>
          <el-input placeholder="请输入成员" v-model="name"> </el-input>
        </el-col>
        <el-col :span="6">
          <span class="width60">渠道:</span>
          <el-select v-model="chId" placeholder="请选择渠道" clearable>
            <el-option v-for="item in channelList" :key="item.chId" :label="item.name" :value="item.chId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <span class="inputName">创建时间:</span>
          <el-date-picker v-model="creatTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="yyyy-MM-dd" @change="changeDate">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="inputName">拉群方式:</span>
          <el-select v-model="addBy" placeholder="请选择拉群方式" clearable>
            <el-option v-for="item in addList" :key="item.value" :label="item.label" :value="item.addBy">
            </el-option>
          </el-select>
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
        <img src="../../../assets/images/icon_add@2x.png" alt="" />
        新增群活码
      </div>
    </div>
    <div class="enterTableWarp">
      <el-table :data="enterTable" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#FAFBFF' }">
        <el-table-column type="index" width="60px" label="编号" align="left">
        </el-table-column>
        <el-table-column label="二维码">
          <template slot-scope="scope">
            <img :src="scope.row.address" alt="" style="width: 60px; height: 60px" v-if="scope.row.switchStatus" />
            <div :id="'Qrcode' + scope.row.id" v-else>
              <VueQrcode :value="scope.row.address" :options="{ width: 360 }" :ref="'Qrcode' + scope.row.id" class="qrcode-box"></VueQrcode>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="活码名称" show-overflow-tooltip=""> </el-table-column>
        <el-table-column prop="userNames" label="使用员工" show-overflow-tooltip=""> </el-table-column>
        <el-table-column prop="createBy" label="创建人员" show-overflow-tooltip=""> </el-table-column>
        <el-table-column prop="chName" label="渠道" show-overflow-tooltip=""> </el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column prop="total" label="添加好友数" show-overflow-tooltip=""> </el-table-column>
        <el-table-column label="拉群方式" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.addBy == "1" ? "群二维码拉群" : "企微活码拉群" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
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
    <div v-if="addCode">
      <AddGroupCode @closeaddCode="closeaddCode" :addCode="addCode"></AddGroupCode>
    </div>
    <div v-if="detailVisible">
      <GroupDetail @closeDetailForm="closeDetailForm" :detailVisible="detailVisible" :detailForm="objInfo"></GroupDetail>
    </div>
    <div v-if="editCode">
      <EditGroup :editCode="editCode" @closeEditCode="closeEditCode" :editForm="objInfo">
      </EditGroup>
    </div>
    <Pagination :total="total" :pageInfo="pageInfo" @pageChange="pageChange" v-if="enterTable.length"></Pagination>
  </div>
</template>
<script>
import NoDate from '../../../components/noDate'
import Pagination from '../../../components/elPagination.vue'
import { formatDate } from '../../../utils/tool'
import AddGroupCode from './AddGroupCode'
import GroupDetail from './GroupDetail'
import EditGroup from './EditGroup'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import MyMixin from '../../../mixins/permissions'
import {
  livecodegroup_getlist,
  livecodegroup_getselect,
  livecodegroup_delete,
} from '@/api/tools'
export default {
  name: 'groupCode',
  mixins: [MyMixin],
  components: {
    NoDate,
    Pagination,
    AddGroupCode,
    GroupDetail,
    EditGroup,
    VueQrcode,
  },
  data() {
    return {
      livename: '',
      name: '',
      createBy: '',
      addBy: '',
      chId: '',
      creatTime: [],
      enterTable: [],
      options: [],
      channelList: [],
      addList: [
        { label: '群二维码拉群', addBy: '1' },
        { label: '企微活码拉群', addBy: '2' },
      ],
      addCode: false,
      editCode: false,
      detailVisible: false,
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      objInfo: {},
      qrcodeImg: '',
      expandedKeys: [],
    }
  },
  created() {
    this.$nextTick(() => {
      this.getTableList()
    })
    this.getSelectList()
  },
  mounted() {},
  methods: {
    formatDate,

    getTableList() {
      let params = {
        type: 1,
        name: this.name,
        createBy: this.createBy,
        livename: this.livename,
        addBy: this.addBy,
        chId: this.chId,
        createTimeSta: this.creatTime[0] || '',
        createTimeEnd: this.creatTime[1] || '',
        ...this.pageInfo,
      }
      livecodegroup_getlist(params).then((res) => {
        if (res.result) {
          this.total = res.data.iPage.total
          let tempList = res.data.iPage.records
          tempList.forEach((item) => {
            if (!item.switchStatus) {
              item.address = encodeURI(item.address)
            }
          })
          this.enterTable = tempList
        }
      })
    },
    getSelectList() {
      livecodegroup_getselect().then((res) => {
        if (res.result) {
          this.channelList = res.data.chlist
          this.options = res.data.userlist
        }
      })
    },
    addEnterCode() {
      this.addCode = true
    },
    closeaddCode() {
      this.addCode = false
      this.getTableList()
      this.getSelectList()
    },
    checkTable() {
      this.pageInfo.page = 1
      this.getTableList()
    },
    resetTable() {
      this.name = ''
      this.livename = ''
      this.createBy = ''
      this.creatTime = []
      this.addBy = ''
      this.chId = ''
      this.getTableList()
    },
    changeDate(value) {
      this.creatTime = [value[0] + ' 00:00:00', value[1] + ' 23:59:59']
    },
    downLoadCode(index, row) {
      // console.log(row)
      if (row.switchStatus) {
        this.downloadIamge(row.address, '二维码')
      } else {
        let p = 'Qrcode' + row.id
        let canvas = document.getElementById(p).getElementsByTagName('canvas')
        const a = document.createElement('a')
        a.href = canvas[0].toDataURL('img/png')
        // console.log(canvas[0].toDataURL('img/png'))
        a.download = '二维码'
        a.click()
      }
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
    handleClick(index, row) {
      console.log(row)
      this.objInfo = row
      this.detailVisible = true
    },
    handleEdit(index, row) {
      console.log(row)
      this.editCode = true
      this.objInfo = row
    },
    deleteRow(index, rows) {
      this.$confirm('是否确认删除', '温馨提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        confirmButtonClass: 'sureBtn',
        cancelButtonClass: 'cancelBtn',
        type: 'error',
      })
        .then(() => {
          let data = {
            livecodeNo: rows.livecodeNo,
          }
          livecodegroup_delete(data).then((res) => {
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
      this.getTableList()
    },
    closeDetailForm() {
      this.detailVisible = false
    },
    closeEditCode() {
      this.editCode = false
      this.getTableList()
      this.getSelectList()
    },
  },
}
</script>
<style lang="less" scoped>
.enterCodeWarp {
  min-height: 812px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #3c4353;
  .selectHeader {
    .firstRow {
      margin-bottom: 16px;
    }
    .el-input {
      height: 32px;
      /deep/.el-input__inner {
        height: 32px;
        width: 100%;
      }
    }
    /deep/.el-select {
      height: 32px;
      width: 100%;
      .el-input__inner {
        height: 32px;
      }
      .el-input__icon {
        line-height: 32px;
      }
    }
    /deep/.el-range-editor.el-input__inner {
      height: 32px;
      padding: 0 10px;
      width: 100%;
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
      width: 100px;
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
  .enterTableWarp {
    min-height: 500px;
    margin-top: 32px;
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
    /deep/.el-table {
      .qrcode-box {
        width: 60px !important;
        height: 60px !important;
      }
      // tr td .cell {
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   display: -webkit-box;
      //   -webkit-line-clamp: 1; /*可以显示的行数，超出部分用...表示 */
      //   -webkit-box-orient: vertical;
      // }
    }
  }
}
/deep/.el-table__empty-block {
  display: none !important;
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
.btnTwoBox {
  width: 220px;
  height: 34px;
  float: right;
  margin-bottom: 50px;
}
</style>
