<template>
  <div class="copy_warp">
    <el-dialog
      title="复制话术"
      :visible.sync="copyDialog"
      width="520px"
      :close-on-click-modal="false"
      :before-close="dialogBeforeClose"
    >
      <span>复制到:</span>
      <el-radio-group v-model="radio" @change="changeRadio">
        <el-radio :label="1">个人话术库</el-radio>
        <el-radio :label="2">公共话术库</el-radio>
      </el-radio-group>

      <div class="select_group">
        <span class="groupname"><span>*</span>分组:</span>
        <SelectTree
          :options="options"
          v-model="value"
          :multiple="false"
          :searchable="false"
          noOptionsText="暂无分组"
          placeholder="请选择上级分组"
          :normalizer="normalizer"
          @select="changeSelect"
        >
          <label
            slot="option-label"
            slot-scope="{ node, labelClassName }"
            :class="labelClassName"
          >
            <img
              src="../../../assets/images/wenjian.png"
              alt=""
              style="width: 14px; height: 12px"
            />
            <span class="nodeName">{{ node.label }}</span>
          </label>
        </SelectTree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBeforeClose">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SelectTree from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: {
    copyDialog: {
      type: Boolean,
    },
    groupType: {
      type: String,
    },
    copyObj: {
      type: Object,
    },
  },
  components: {
    SelectTree,
  },
  data() {
    return {
      options: [],
      value: null,
      normalizer(node) {
        if (
          node.children == null ||
          node.children == "null" ||
          node.children.length == 0
        ) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children,
        };
      },
      radio: null,
    };
  },
  created() {
    // this.radio = this.groupType
    // this.getGroupList()
  },
  methods: {
    getGroupList() {
      this.$network
        .get("/material-service/verbaltrickgroup/getlist", {
          groupType: this.radio,
          type: 1,
        })
        .then((res) => {
          // console.log(res)
          this.options = res.data;
          // this.processTree(res.data)
        });
    },
    changeRadio(val) {
      // console.log('-----radio---', val)
      this.value = null;
      this.radio = val;
      this.getGroupList();
    },
    changeSelect(val) {
      // console.log('-----val---', val)
      this.value = val.id;
    },
    dialogBeforeClose() {
      this.$emit("closeCopy");
    },

    save() {
      this.$network
        .get("/material-service/verbaltrick/copyverbal", {
          groupId: this.value,
          verbalId: this.copyObj.id,
        })
        .then((res) => {
          this.$emit("closeCopy");
          this.$message({
            type: "success",
            message: "操作成功",
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.copy_warp {
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
      height: 186px;
      .el-radio-group {
        margin-left: 16px;
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
      }
      .select_group {
        display: flex;
        margin-top: 20px;
      }
      .groupname {
        display: inline-block;
        width: 60px;
        line-height: 32px;
        text-align: right;
        padding-right: 15px;
        span {
          color: red;
          vertical-align: -5%;
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
      .el-input__inner {
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