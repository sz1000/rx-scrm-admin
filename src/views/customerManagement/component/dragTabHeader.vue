<template>
  <div class="edit_dialog">
    <el-dialog title="新增线索"
               :visible.sync="culeDetail"
               :before-close="dialogFormCancel"
               :close-on-click-modal='false'
               width="520px">　
      <table class="dataTabble"
             width='100%'>
        <thead>
          <tr class="tabHeader">
            <th width='92px'
                align='center'>显示</th>
            <th width='200px'
                align='center'>列名</th>
            <th align='center'>拖动调整顺序</th>
          </tr>
        </thead>
        <Draggable v-model="tablelist"
                   draggable=".item"
                   element="tbody"
                   :move="getdata"
                   @update="datadragEnd">
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
          <tr v-for="(item,id) in tablelist"
              :key="id"
              :class="{'item':item.checked}"
              class="tbodytr">
            <td>
              <el-checkbox v-model="item.checked"
                           @change='changeBox'>
              </el-checkbox>
            </td>
            <td align='center'>{{item.name}}</td>
            <td v-show="item.checked"
                align='center'>
              <img src="../../../assets/images/icon_sort@2x.png"
                   alt=""
                   style="width:14px;height:14px" />
            </td>
          </tr>
        </Draggable>

      </table>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary"
                   @click="dialogFormSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入拖拽组件
import Draggable from 'vuedraggable'
export default {
  components: {
    //调用组件
    Draggable,
  },
  props: {
    culeDetail: {
      type: Boolean,
    },
  },
  data() {
    return {
      tablelist: [
        { id: 1, name: '活动消息1', checked: false },
        { id: 2, name: '公司消息2', checked: false },
        { id: 3, name: '个人消息3', checked: false },
        { id: 4, name: '客户消息4', checked: false },
      ],
      checkedCities: [],
      tempArr: [],
    }
  },
  methods: {
    changeBox(value) {
      console.log(value)
      this.tempArr = []
      this.tablelist.forEach((v) => {
        if (v.checked) {
          this.tempArr.push(v)
        }
      })
      console.log(this.tempArr)
    },
    getdata(evt) {
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.tablelist)
    },
    dialogFormCancel() {
      this.$emit('closeculeDetail')
    },
    dialogFormSure() {
      this.$emit('closeculeDetail')
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    height: 606px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      // background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #3c4353;
      }
    }
    .el-dialog__body {
      padding: 0;
      // padding: 16px 32px;
    }
    .el-dialog__footer {
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
  .dataTabble {
    thead {
      width: 100%;
      background: #fafbff;
    }
    tr {
      th {
        height: 40px;
      }
      td {
        line-height: 40px;
        padding: 0 32px;
        border-bottom: 1px solid #fafbff;
      }
    }
  }
}
</style>