<template>
  <div class="edit_dialog">
    <el-dialog :title="ruleTitle" :visible.sync="addVisible" :before-close="dialogFormCancel" :close-on-click-modal="false" width="520px">
      <el-form :model="addCodeForm" label-position="right" label-width="75px">
        <div class="classification">选择客户分类</div>
        <el-form-item label="客户标签:" prop="value1">
          <el-select v-model="addCodeForm.tag" multiple collapse-tags placeholder="请选择标签" @change="changeTag" clearable>
            <el-option v-for="item in childTagList" :key="item.value" :label="item.name" :value="item.tagid">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="排除客户:" prop="value1">
          <el-select v-model="addCodeForm.value1" multiple collapse-tags placeholder="请选择"
            @change="userChange" clearable>
            <el-option v-for="item in organOption" :key="item.value" :label="item.name"
              :value="item.userNo">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="来源:" prop="value1">
          <el-select v-model="addCodeForm.source" multiple collapse-tags placeholder="请选择来源" @change="changeSource" clearable>
            <el-option v-for="item in sourceList" :key="item.value" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="turnStaff classification">被分配员工</div>
        <el-form-item label="选择员工:" prop="value1">
          <el-select v-model="addCodeForm.user" multiple collapse-tags placeholder="请选择员工" @change="userChange" clearable>
            <el-option v-for="item in organOption" :key="item.value" :label="item.name" :value="item.userNo">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  tagList,
  getFieldList,
  getAllUser,
  addRule,
  updatePage,
} from '../../api/custom'
export default {
  props: {
    addVisible: {
      type: Boolean,
    },
    regularId: {
      type: Number,
    },
    ruleTitle: {
      type: String,
      default: '新增规则',
    },
    editObj: {
      type: Object,
    },
  },

  data() {
    return {
      addCodeForm: {
        tag: '',
        source: '',
        user: '',
      },
      organOption: [],
      childTagList: [],
      sourceList: [],
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      tagList().then((res) => {
        let list = res.data
        let allChildTag = list.map((item) => {
          return item.children
        })
        this.childTagList = [].concat.apply([], allChildTag)
        if (this.editObj.satisfyTag) {
          this.addCodeForm.tag = this.editObj.satisfyTag.map((item) => {
            return item.tagid
          })
        }
      })
      getFieldList().then((res) => {
        this.sourceList = res.data.sources
        if (this.editObj.satisfySource) {
          this.addCodeForm.source = this.editObj.satisfySource.map((item) => {
            return item.id
          })
        }
      })
      getAllUser().then((res) => {
        this.organOption = res.data
        if (this.editObj.userNos) {
          this.addCodeForm.user = this.editObj.userNos
        }
      })
    },
    changeTag() {
      // console.log(this.addCodeForm)
    },
    changeSource() {},
    userChange(val) {},

    dialogFormCancel() {
      this.$emit('closeAddForm')
    },
    dialogFormSure() {
      let userList = []
      let tagList = []
      let souList = []
      this.organOption.forEach((item) => {
        this.addCodeForm.user.forEach((val) => {
          if (item.userNo == val) {
            userList.push(item)
          }
        })
      })
      this.childTagList.forEach((item) => {
        this.addCodeForm.tag.forEach((val) => {
          if (item.tagid == val) {
            tagList.push(item)
          }
        })
      })
      this.sourceList.forEach((item) => {
        this.addCodeForm.source.forEach((val) => {
          if (item.id == val) {
            souList.push(item)
          }
        })
      })

      let params = {
        regularId: this.regularId,
        satisfyTag: tagList,
        satisfySource: souList,
        users: userList,
        satisfyTagType: 1,
        satisfySourceType: 1,
        id: this.editObj.id,
      }
      console.log(this.ruleTitle)
      if (this.ruleTitle == '编辑规则') {
        console.log(11111111)
        updatePage(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功',
            duration: 1000,
          })
          this.$emit('closeAddForm')
        })
      } else {
        addRule(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功',
            duration: 1000,
          })
          this.$emit('closeAddForm')
        })
      }
    },
  },
}
</script>
<style lang="less" scoped>
.edit_dialog {
  /deep/.el-dialog {
    height: 500px;
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
        font-weight: 600;
        color: #3c4353;
      }
    }
    .el-dialog__body {
      padding: 16px;
      height: 392px;
      overflow-y: auto;
    }

    .rulesChannel {
    }
    .el-form-item {
      margin-bottom: 20px;
      height: 32px;
    }
    .el-form-item__content {
      line-height: 32px;
    }
    .el-form-item__label {
      line-height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3c4353;
      padding: 0 12px 0 0;
    }
    .el-input,
    .el-select,
    .el-input__inner {
      width: 404px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
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
.classification {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 600;
  margin-bottom: 16px;
}
.turnStaff {
  margin-top: 32px;
}
</style>
