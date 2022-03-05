<template>
  <div class="edit_dialog">
    <el-dialog title="编辑标签组" :visible.sync="editTag" :before-close="dialogFormCancel" :close-on-click-modal='false' width="520px">
      <el-form :model="addCodeForm" :rules="editRules" ref="ruleForm" label-width="100px" label-position="right">
        <el-form-item label="标签组名称:" prop="content">
          <el-input show-word-limit v-model="addCodeForm.content" maxlength="30" @change="changeInput" placeholder="请输入标签组名称"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label">标签名称:</span>
          <Draggable v-model="tagList" @update="datadragEnd" ghostClass="chosen" animation="300">
            <transition-group>
              <div class="tagName" v-for="(item,index) in tagList" :key="index">
                <el-input v-model.trim="item.name" show-word-limit maxlength="30" placeholder="请输入标签名称"></el-input>
                <img src="../../../assets/images/reduceone@2x.png" alt="" @click="reduceOne(item,index)" v-if="tagList.length>1" />
                <img src="../../../assets/images/drag.png" alt="" v-if="tagList.length>1" style="cursor: pointer;" />
              </div>
            </transition-group>
          </Draggable>
        </el-form-item>
      </el-form>
      <div class="codeBtn pointer" @click="addLabel">
        <img src="../../../assets/images/icon_add@2x.png" alt="" />
        添加标签
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="deletetext" @click="deleteTag">删除标签组</div>
        <div>
          <el-button @click="dialogFormCancel">取 消</el-button>
          <el-button type="primary" v-preventReClick @click="dialogFormSure('ruleForm')">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
export default {
  components: { Draggable },
  props: {
    editTag: {
      type: Boolean,
    },
    editTagList: {
      type: Object,
    },
    allTagList: {
      type: Array,
    },
  },

  data() {
    return {
      addCodeForm: {
        content: '',
      },
      tagList: [{}],
      tempList: [],
      editRules: {
        content: [
          { required: true, trigger: 'blur', message: '请输入标签组名称' },
        ],
      },
      stagList: [],
      isName: true,
    }
  },
  created() {
    this.addCodeForm.content = this.editTagList.name
    this.tagList = this.editTagList.children
    console.log(this.tagList)
    // this.tempList = JSON.parse(JSON.stringify(this.editTagList.children))
  },
  watch: {},
  methods: {
    dialogFormCancel() {
      this.addCodeForm = {}
      this.$emit('closeEditTag')
    },
    contrast() {
      // console.log(this.tagList, this.stagList)
      this.tagList.forEach((item, index) => {
        this.stagList.forEach((item1, index1) => {
          if (item.name == item1.name) {
            this.tagList.splice(index, 1, item1)
          }
        })
      })
    },

    dialogFormSure(formName) {
      this.contrast()
      // console.log('11111111111111----', this.tagList)
      let params = {
        ...this.editTagList,
        name: this.addCodeForm.content,
        children: this.tagList,
      }
      let isTag = false
      try {
        this.tagList.forEach((item) => {
          if (item.name == '') {
            this.$message({
              type: 'error',
              message: '标签不能为空',
            })
            isTag = false
            throw new Error()
          } else {
            isTag = true
          }
        })
      } catch (e) {}
      // console.log(isTag)
      if (isTag) {
        const beginTime = this.tagList.map((value) => value.name)
        const beginTimeSet = new Set(beginTime)
        if (beginTimeSet.size != beginTime.length) {
          this.$message({
            message: '不能添加相同标签!',
            type: 'error',
          })
          return false
        }
        for (let i = 0; i < this.allTagList.length; i++) {
          // console.log(this.allTagList[i].id, params)
          if (
            this.allTagList[i].name == this.addCodeForm.content &&
            this.allTagList[i].id !== params.id
          ) {
            this.$message({
              type: 'error',
              message: '已存在相同标签组名',
            })
            this.isName = false
            break
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid && this.isName) {
            this.$network
              .post('/customer-service/tag/update', params)
              .then((res) => {
                this.$emit('closeEditTag')
                this.addCodeForm = {}
                this.stagList = []
              })
          }
        })
      }
    },
    changeInput() {},
    addLabel() {
      let sortIndex = Math.max.apply(
        Math,
        this.tagList.map((item) => {
          return item.orderBy
        })
      )
      this.tagList.push({ name: '', orderBy: sortIndex + 1 })
    },
    reduceOne(item, index) {
      this.stagList.push(item)
      this.tagList.splice(index, 1)
    },
    datadragEnd(evt) {
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
      // console.log(this.tagList)
      this.tagList.forEach((item, index) => {
        item.orderBy = index + 1
      })
    },
    deleteTag() {
      // console.log(this.editTagList)
      this.$confirm(
        '删除标签组，将删除组内所有标签，是否确认删除？',
        '温馨提示',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          confirmButtonClass: 'sureBtn',
          cancelButtonClass: 'cancelBtn',
          type: 'error',
        }
      )
        .then(() => {
          this.$network
            .get('/customer-service/tag/delete', { id: this.editTagList.id })
            .then((res) => {
              this.$emit('closeEditTag')
              this.$message({
                type: 'success',
                message: '已删除!',
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消',
          })
        })
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
        font-weight: 500;
        color: #3c4353;
      }
    }
    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-dialog__body {
      height: 386px;
      overflow-y: scroll;
      padding: 16px;
      .codeBtn {
        width: 104px;
        height: 32px;
        background: rgba(65, 104, 246, 0.04);
        border-radius: 4px;
        border: 1px solid #4168f6;
        text-align: center;
        color: #4168f6;
        line-height: 32px;
        margin-left: 100px;
        img {
          width: 12px;
          height: 12px;
        }
      }
      .tagName {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        img {
          margin-left: 10px;
          width: 14px;
          height: 14px;
        }
      }
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
    }
    .el-input,
    .el-select,
    .el-input__inner {
      height: 32px;
      line-height: 32px;
      background: #ffffff;
      border-radius: 4px;
      width: 302px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog__footer {
      .dialog-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .deletetext {
          color: #4168f6;
          cursor: pointer;
        }
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
}
</style>
