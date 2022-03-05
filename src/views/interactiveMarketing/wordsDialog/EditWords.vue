<template>
  <div class="dialogWarp">
    <el-dialog title="编辑话术"
               :visible.sync="editVisible"
               :before-close="dialogFormCancel"
               :close-on-click-modal='false'
               width="736px">
      <div class="selectBox">
        <div class="select_group">
          <span class="groupname"><span>*</span>分组:</span>
          <SelectTree :options="options"
                      v-model="value"
                      :multiple="false"
                      :searchable='false'
                      placeholder='请选择分组'
                      :normalizer="normalizer"
                      @select='changeSelect'>
            <label slot="option-label"
                   slot-scope="{ node,  labelClassName }"
                   :class="labelClassName">
              <img src="../../../assets/images/wenjian.png"
                   alt=""
                   style="width:14px;height:12px" />
              <span class="nodeName">{{ node.label}}</span>
            </label>
          </SelectTree>
        </div>
        <div class="input_text">
          <span class="groupname"><span>*</span>话术标题:</span>
          <el-input v-model.trim="wordTitle"
                    placeholder="请输入话术标题名称"
                    show-word-limit
                    maxlength="30"></el-input>
        </div>
      </div>
      <div class="techniqueBox">
        <ComponentWord :single='index'
                       :itemInfo='item'
                       :allList='wordsList'
                       @fnDelete='fnDelete'
                       v-for="(item,index) in wordsList"
                       :key='index'></ComponentWord>
      </div>
      <div class="operation flex">
        <div class="addBtn pointer"
             @click="newAddTech">
          <img src="../../../assets/images/icon_add@2x.png"
               alt="" />
          新增话术内容
        </div>
        <span>(最多可新增9条话术内容)</span>
      </div>
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
import SelectTree from '@riophae/vue-treeselect'
import ComponentWord from './ComponentWord.vue'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {
    SelectTree,
    ComponentWord,
  },
  props: {
    editVisible: {
      type: Boolean,
    },
    copyObj: {
      type: Object,
    },
    groupType: {
      type: String,
    },
    isShowOperate: {
      type: Number,
    },
  },
  data() {
    return {
      wordTitle: '',
      options: [],
      value: null,
      normalizer(node) {
        if (
          node.children == null ||
          node.children == 'null' ||
          node.children.length == 0
        ) {
          delete node.children
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        }
      },
      wordsList: [
        {
          text: '',
          imageUrl: '',
          pdf: '',
          url: '',
          activeIndex: 'text',
        },
      ],
      tempObj: {},
    }
  },
  created() {
    this.tempObj = JSON.parse(JSON.stringify(this.copyObj))
    // console.log('---this.copyObj ---', this.tempObj)
    this.wordTitle = this.tempObj.title
    this.wordsList = this.tempObj.contentList.map((item) => {
      return {
        text: item.value,
        url: item.value,
        activeIndex: item.type,
      }
    })
    this.value = this.isShowOperate
    // console.log('---this.isShowOperate ---', this.isShowOperate)
    this.getGroupList()
  },
  methods: {
    getGroupList() {
      this.$network
        .get('/material-service/verbaltrickgroup/getlist', {
          groupType: this.groupType,
          type: 1,
        })
        .then((res) => {
          // console.log(res)
          this.options = res.data

          // res.data.forEach((item) => {
          //   if (item.id == this.tempObj.groupId) {
          //     this.value = item.id
          //     console.log('-----this.value--', this.value)
          //   }
          // })

          // this.processTree(res.data)
        })
    },
    dialogFormCancel() {
      this.$emit('closeEdit')
    },
    dialogFormSure() {
      this.filterList(this.wordsList)
      let templist = this.wordsList.map((item) => {
        return {
          type: item.activeIndex,
          value: item[item.activeIndex],
        }
      })
      // console.log('------templist----', templist)
      let params = {
        id: this.tempObj.id,
        groupType: this.groupType,
        groupId: this.value,
        title: this.wordTitle,
        contentList: templist,
      }
      // console.log('---this.wordsList----', params)
      this.$network
        .post('/material-service/verbaltrick/updateverbal', params)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '新增成功',
          })
          this.$emit('closeEdit')
        })
    },
    filterList(list) {
      // console.log('---list----', list)
      if (this.value == '' || this.wordTitle == '') {
        this.$message({
          type: 'error',
          message: '请填写分组信息',
        })
      } else {
        list.forEach((item) => {
          if (item[item.activeIndex] == '') {
            this.$message({
              type: 'error',
              message: '请完善话术内容',
            })
          }
        })
      }
    },
    changeSelect(val) {
      console.log('-----val---', val)
      this.value = val.id
    },

    newAddTech() {
      if (this.wordsList.length < 9) {
        this.wordsList.push({
          text: '',
          image: '',
          pdf: '',
          url: '',
          activeIndex: 'text',
        })
      }
    },
    fnDelete(index) {
      // console.log('2222222222------------', index, this.wordsList)
      if (this.wordsList.length > 1) {
        this.wordsList.splice(index, 1)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.dialogWarp {
  /deep/.el-dialog {
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
      height: 493px;
      overflow-y: scroll;
      .rowStyle {
        margin-bottom: 20px;
        line-height: 32px;
      }
      .el-select,
      .el-input__inner {
        width: 329px;
        height: 32px;
      }
      .el-input__icon {
        line-height: 32px;
      }
      .selectBox {
        .groupname {
          display: inline-block;
          width: 70px;
          line-height: 32px;
          text-align: right;
          margin-right: 8px;
          span {
            color: red;
            vertical-align: -5%;
          }
        }
        .select_group {
          display: flex;
          margin-top: 15px;
        }
        .input_text {
          display: flex;
          margin-top: 20px;
          .el-input,
          .el-input__inner {
            width: 100%;
            flex: 1;
          }
        }
        .vue-treeselect {
          flex: 1;
          .nodeName {
            display: inline-block;
            margin-left: 8px;
            color: #3c4353;
            font-size: 14px;
            font-weight: normal;
          }
        }
      }
      .techniqueBox {
      }
      .operation {
        justify-content: flex-start;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        margin: 20px 0;
        img {
          width: 12px;
          height: 12px;
        }
        .addBtn {
          padding: 0 8px;
          height: 32px;
          background: rgba(65, 104, 246, 0.04);
          border-radius: 4px;
          border: 1px solid #4168f6;
          color: #4168f6;
          margin-right: 20px;
        }
        span {
          color: #c0c4cc;
        }
      }
    }
    .el-dialog__footer {
      padding: 0;
    }
    .dialog-footer {
      height: 64px;
      line-height: 64px;
      padding-right: 16px;
      border-top: 1px solid #f0f2f7;
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
</style>