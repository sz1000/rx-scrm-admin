<template>
  <div class="rename_warp">
    <el-dialog title="新建分组"
               :visible.sync="newGroup"
               width="520px"
               :close-on-click-modal='false'
               :before-close="dialogBeforeClose">
      <div class="select_group">
        <span class="groupname"><span>*</span>上级分组:</span>
        <SelectTree :options="options"
                    v-model="value"
                    :multiple="false"
                    :searchable='false'
                    noOptionsText='暂无分组'
                    placeholder='请选择上级分组'
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
        <span class="groupname"><span>*</span>分组名称:</span>
        <el-input v-model.trim="newlabel"
                  placeholder="请输入分组名称"
                  show-word-limit
                  maxlength="20"
                  @change="changeName"></el-input>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogBeforeClose">取 消</el-button>
        <el-button type="primary"
                   @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SelectTree from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  props: {
    newGroup: {
      type: Boolean,
    },
    groupType: {
      type: String,
    },
    addGroupVal: {
      type: Number,
      default: 0,
    },
  },
  components: {
    SelectTree,
  },
  data() {
    return {
      newlabel: '',
      options: [
        // {
        //   id: 1,
        //   label:
        //     '一级1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1一级 1',
        //   children: [
        //     {
        //       id: 4,
        //       label: '二级 1-1',
        //       children: [
        //         {
        //           id: 9,
        //           label: '三级 1-1-1',
        //         },
        //         {
        //           id: 10,
        //           label: '三级 1-1-2',
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   id: 2,
        //   label: '一级 2',
        //   children: [
        //     {
        //       id: 5,
        //       label: '二级 2-1',
        //     },
        //     {
        //       id: 6,
        //       label: '二级 2-2',
        //     },
        //   ],
        // },
        // {
        //   id: 3,
        //   label: '一级 3',
        //   children: [
        //     {
        //       id: 7,
        //       label: '二级 3-1',
        //     },
        //     {
        //       id: 8,
        //       label: '二级 3-2',
        //     },
        //   ],
        // },
      ],
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
    }
  },
  created() {
    // console.log('-- this.addGroupVal----', this.addGroupVal)
  },
  mounted() {
    this.groupList()
  },
  methods: {
    groupList() {
      this.$network
        .get('/material-service/verbaltrickgroup/getSelect', {
          groupType: this.groupType,
        })
        .then((res) => {
          // console.log(res)
          this.options = res.data
          // this.processTree(res.data)
          this.value = this.addGroupVal || 0
          console.log('----this.value---', this.value)
        })
    },
    processTree(data) {
      data.forEach((item) => {
        if (item.children.length) {
          this.options.push(item)
          return this.processTree(item.children)
        } else {
          item.children = null
        }
      })
      console.log(this.options)
    },
    changeName(val) {
      this.newlabel = val
    },
    dialogBeforeClose() {
      this.$emit('closeNewGroup')
    },

    save() {
      if (this.newlabel == '') {
        this.$message({
          type: 'error',
          message: '请填写分组名称',
        })
      } else {
        this.$network
          .post('/material-service/verbaltrickgroup/add', {
            groupType: this.groupType,
            name: this.newlabel,
            parentId: this.value,
          })
          .then((res) => {
            this.$message({
              type: 'success',
              message: '操作成功',
            })
            this.$emit('closeNewGroup')
          })
      }
    },
    changeSelect(val) {
      // console.log('-----val---', val)
      this.value = val.parentId
    },
  },
}
</script>
<style lang="less" scoped>
.rename_warp {
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
      height: 185px;
      .groupname {
        display: inline-block;
        width: 90px;
        line-height: 32px;
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
      }
      .el-input,
      .el-input__inner {
        flex: 1;
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