<template>
  <div class="setfiled_warp">
    <div class="left_warp space">
      <div class="fixedFiled">
        <span class="main_title">固定字段设置</span>
        <!-- <span class="explan">(不可修改)</span> -->
      </div>
      <div class="filedTable">
        <div class="filed_title left_filed_title">
          <span class="left_filed_text">字段名称</span>
          <span class="left_stust">状态</span>
          <span class="filed_cz">操作</span>
        </div>
        <div class="filed_body left_filed_body">
          <Draggable v-model="filedList" @update="datadragEnd" ghostClass="chosen" animation="300">
            <transition-group>
              <div v-for="item in filedList" :key="item.id" class="li_box">
                <span class="name_left">{{item.columnName}}</span>
                <span class="status_left">
                  <el-switch v-model="item.enableStatus" active-color="#4168F6" inactive-color="#B9B9B9" :disabled="!item.editableStatus"
                             @change="changeSwitch(item)" />
                </span>
                <span class="cz">
                  <span v-show="item.columnValue == 'source' || item.columnValue == 'stage' " @click="changeFiled(item)">
                    <i class="el-icon-edit" style="margin-right:4px"></i>
                    修改
                  </span>
                  <img src="../../../assets/images/drag_more.png" alt="" style="cursor: pointer" />
                </span>
              </div>
            </transition-group>
          </Draggable>
        </div>
        <div class="filed_fotter">
          <span @click="reset">恢复默认</span>
          <span @click="allOpen">全部开启</span>
        </div>
      </div>
    </div>
    <div class="right_warp space">
      <div class="fixedFiled">
        <span class="main_title">自定义字段设置</span>
        <span class="explan">(最多可添加99个)</span>
      </div>
      <div class="operation flex">
        <el-button class="addBtn pointer" @click="newgroup">
          <!-- v-show="expandedKeys.some(item=>item.enName == 'add')" -->
          <img src="../../../assets/images/icon_add@2x.png" alt="" />
          添加字段
        </el-button>
      </div>
      <div class="filedTable">
        <div class="filed_title">
          <span class="one">自定义字段名称</span>
          <span class="two">字段类型</span>
          <span class="three">状态</span>
          <span class="four">操作</span>
        </div>
        <div class="filed_body">
          <Draggable v-model="filedListCustom" @update="datadragEndCustom" ghostClass="chosen" animation="300">
            <transition-group>
              <div v-for="(item,index) in filedListCustom" :key="item.id" class="li_box custom_box">
                <span class="custom_name">{{item.columnName}}</span>
                <span>{{item.columnType == 1? '文本' : item.columnType == 2 ? '选择' : '时间'}}</span>
                <span class="status_box">
                  <el-switch v-model="item.enableStatus" active-color="#4168F6" inactive-color="#B9B9B9" :disabled="!item.editableStatus"
                             @change="rightSwitch(item)" />
                </span>
                <div class="handle_btn">
                  <span @click="eidtBtn(item,index)" class="eidt_text"><i class="el-icon-edit" style="margin-right:4px"></i>修改</span>
                  <span @click="deleteFiled(item,index)" class="delet_text"><i class="el-icon-delete" style="margin-right:4px"></i>删除</span>
                  <img src="../../../assets/images/drag_more.png" alt="" style="cursor: pointer" />
                </div>
              </div>
            </transition-group>
          </Draggable>
        </div>
        <NoDate class="nodateImg" v-show="!filedListCustom.length"></NoDate>
      </div>
    </div>
    <div v-if="leftEdit">
      <EditLeftFiled :leftEdit='leftEdit' @sureDialog='sureDialog' :leftObj='leftObj'></EditLeftFiled>
    </div>
    <div v-if="showAddTag">
      <NewAddFiled :showAddTag="showAddTag" @shutTag="shutTag" :totalList='this.filedListCustom.length'></NewAddFiled>
    </div>
    <div v-if="showEdit">
      <EditField :showEdit="showEdit" :detailObj='detailObj' @closeEdit='closeEdit' :totalList='this.filedListCustom.length'></EditField>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import NoDate from '../../../components/noDate'
import NewAddFiled from './AddFiled.vue'
import EditField from './EditField.vue'
import EditLeftFiled from './EditLeftFiled.vue'
import {
  fieldList,
  editList,
  editOneSort,
  customList,
  deleteField,
  switchField,
} from '../../../api/field'
export default {
  components: {
    NewAddFiled,
    NoDate,
    Draggable,
    EditField,
    EditLeftFiled,
  },
  data() {
    return {
      showAddTag: false,
      showEdit: false,
      leftEdit: false,
      filedList: [],
      filedListCustom: [],
      detailObj: null,
      leftObj: {},
    }
  },
  created() {
    this.getDateList()
    this.getRightList()
  },
  methods: {
    // b4fcb8|6445B968A1FF41F4AA40E06D9EF1E3A5
    changeFiled(val) {
      this.leftObj = val
      this.leftEdit = true
    },
    getDateList() {
      fieldList({}).then((res) => {
        this.filedList = res.data
      })
    },
    getRightList() {
      customList({}).then((res) => {
        this.filedListCustom = res.data
      })
    },
    shutTag() {
      this.showAddTag = false
      this.getRightList()
    },
    sureDialog() {
      this.leftEdit = false
    },
    closeEdit() {
      this.showEdit = false
      this.getRightList()
    },
    changeSwitch(val) {
      // console.log(val)
      // let { columnType, ...params } = val
      // delete val.columnType
      // editList(params).then((res) => {
      //   this.getDateList()
      // })
      switchField(val.id).then((res) => {
        this.getDateList()
      })
    },
    rightSwitch(val) {
      switchField(val.id).then((res) => {
        this.getRightList()
      })
    },
    datadragEnd(evt) {
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
      let orderList = this.filedList.map((item, index) => {
        item.priority = index + 1
        return item
      })
      // console.log(orderList)
      editOneSort(orderList).then((res) => {})
    },
    datadragEndCustom(evt) {
      let orderList = this.filedListCustom.map((item, index) => {
        item.priority = index + 1
        return item
      })
      // console.log(orderList)
      editOneSort(orderList).then((res) => {})
    },
    reset() {
      this.filedList.forEach((item) => {
        item.priority = item.defaultPriority
        item.enableStatus = item.defaultEnableStatus
      })
      editOneSort(this.filedList).then((res) => {
        this.filedList = res.data.sort((a, b) => {
          return a.priority - b.priority
        })
      })
    },
    allOpen() {
      this.filedList.forEach((item) => {
        item.enableStatus = true
      })
      editOneSort(this.filedList).then((res) => {})
    },
    newgroup() {
      this.showAddTag = true
    },
    eidtBtn(item, index) {
      // console.log(item, index)
      this.detailObj = item
      this.showEdit = true
    },
    deleteFiled(item, index) {
      this.$confirm('是否确认删除', '温馨提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        confirmButtonClass: 'sureBtn',
        cancelButtonClass: 'cancelBtn',
        type: 'error',
      })
        .then(() => {
          deleteField(item.id).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            customList({}).then((res) => {
              let list = res.data
              if (list && list.length > 0) {
                list.forEach((item, index) => {
                  item.priority = index + 1
                })
                editOneSort(list).then((res) => {
                  this.filedListCustom = res.data
                })
              } else {
                this.filedListCustom = list
              }
            })
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消',
          // })
        })
    },
  },
}
</script>
<style lang="less" scoped>
.setfiled_warp {
  display: flex;
  font-size: 14px;
  .space {
    width: 50%;
    background: #fff;
    min-height: 100vh;
    border-radius: 8px;
    padding: 16px;
    .fixedFiled {
      position: relative;
      padding-left: 8px;
      &::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 14px;
        background: #4168f6;
        left: 0;
        top: 3px;
      }
      .main_title {
        font-size: 14px;
        font-weight: 600;
        color: #3c4353;
        display: inline-block;
        margin-right: 8px;
      }
      .explan {
        font-size: 12px;
        color: #c0c4cc;
      }
    }
  }
  .filedTable {
    margin-top: 16px;
    .filed_title {
      background: #fafbff;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #3c4353;
      font-weight: 600;
      padding-left: 16px;
      .spanStyle();
    }
    .left_filed_title {
      .left_filed_text {
        display: inline-block;
        width: 30% !important;
      }
      .left_stust {
        display: inline-block;
        width: 30% !important;
      }
      .filed_cz {
        display: inline-block;
        width: 35% !important;
        text-align: right;
        padding-right: 26px;
      }
    }
    .spanStyle {
      span {
        display: inline-block;
      }
      span:nth-child(1) {
        width: 25%;
      }
      span:nth-child(2) {
        width: 15%;
      }
      span:nth-child(3) {
        width: 20%;
      }
      span:nth-child(4) {
        width: 40%;
      }
      .one {
        widows: 25% !important;
      }
      .two {
        width: 15% !important;
      }
      .three {
        width: 20% !important;
      }
      .four {
        width: 40% !important;
        text-align: right;
        padding-right: 16px;
      }
    }
    .filed_body {
      height: 656px;
      overflow-y: scroll;
      .li_box {
        padding-left: 16px;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f0f2f7;

        img {
          display: inline-block;
          width: 14px;
          vertical-align: -10%;
        }
        .spanStyle();
      }
      .custom_box {
        .custom_name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
        .status_box {
          width: 20% !important;
        }
        .handle_btn {
          cursor: pointer;
          display: inline-block;
          width: 40% !important;
          text-align: right;
          padding-right: 16px;
          .eidt_text {
            display: inline-block;
            min-width: 60px;
          }
          .delet_text {
            display: inline-block;
            min-width: 60px;
            margin-right: 16px;
          }
        }
      }
    }
    .left_filed_body {
      .li_box {
        .name_left {
          display: inline-block;
          width: 30% !important;
        }
        .status_left {
          display: inline-block;
          width: 30% !important;
        }
        .cz {
          padding-right: 20px;
          text-align: right;
          width: 35% !important;
          span:nth-child(1) {
            margin-right: 16px;
            cursor: pointer;
            width: 70px;
          }
        }
      }
    }
    .filed_fotter {
      text-align: right;
      margin-top: 16px;
      span {
        display: inline-block;
        width: 88px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #d9dae4;
        text-align: center;
        line-height: 32px;
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }
  .left_warp {
    margin-right: 16px;
  }
  .right_warp {
    .operation {
      justify-content: flex-end;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      margin-bottom: 16px;
      img {
        width: 12px;
        height: 12px;
      }
      .addBtn {
        // width: 76px;
        padding: 0 16px;
        height: 32px;
        line-height: 32px;
        background: rgba(65, 104, 246, 0.04);
        border-radius: 4px;
        border: 1px solid #4168f6;
        color: #4168f6;
      }
    }
    .filedTable {
      position: relative;
      .nodateImg {
        position: absolute;
        top: 20%;
      }
    }
  }
}
</style>