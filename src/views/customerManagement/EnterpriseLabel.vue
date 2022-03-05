<template>
  <div class="roleWarp">
    <div class="checkDemand">
      <span class="inputName"> 标签:</span>
      <el-input placeholder="请输入标签组或标签" v-model.trim="input1">
      </el-input>
      <div @click="checkTable" class="check btnBox pointer but_click">查询</div>
      <div @click="resetTable" class="reset btnBox pointer but_hove">重置</div>
    </div>
    <div class="operation flex">
      <el-button class="addBtn pointer" @click="synchronous" v-preventReClick>
        <img src="../../assets/images/tongbu.png" alt="" />
        同步
      </el-button>
      <div class="addGroup pointer" @click="fnTagAdd" v-show="expandedKeys.some(item=>item.enName == 'addtagPacket')">
        <img src="../../assets/images/icon_add@2x.png" alt="" />
        新增标签组
      </div>
    </div>
    <div class="roleTable">
      <Draggable v-model="tagList" @update="datadragEnd" ghostClass="chosen" animation="300">
        <transition-group>
          <div class="tagRow" v-for="(item, index) in tagList" :key="index">
            <div class="groupName">{{ item.name }}</div>
            <div class="tagStyle">
              <span class="addBtn pointer" @click="addTag(item, index)">+添加</span>
              <span class="perchInput" v-if="showInput == index && isShow">
                <el-input class="addInput" v-model.trim="tagName" placeholder="输入后按回车完成" @keyup.enter.native="onSubmit(item)" maxlength="30">
                </el-input>
              </span>
              <span class="creatTag" v-for="(list, index) in item.children" :key="index" v-show="list.name">{{ list.name }}</span>
            </div>

            <div class="modify pointer" @click="modifyTag(item)" v-show="expandedKeys.some(item=>item.enName == 'edit')">
              <div><i class="el-icon-edit"></i>修改</div>
            </div>
            <div class="drag_img" v-show="expandedKeys.some(item=>item.enName == 'edit')">
              <img src="../../assets/images/drag_more.png" alt="" style="cursor: pointer" />
            </div>
          </div>
        </transition-group>
      </Draggable>
      <NoDate v-if="!tagList.length"></NoDate>
    </div>
    <div v-if="showAddTag">
      <TagAddGroup :showAddTag="showAddTag" :allTagList="tagList" @shutTag="shutTag"></TagAddGroup>
    </div>
    <div v-if="editTag">
      <EditGroupTag :editTag="editTag" :allTagList="tagList" @closeEditTag="closeEditTag" :editTagList="editTagList"></EditGroupTag>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import NoDate from '../../components/noDate'
// import Pagination from '../../components/elPagination.vue'
import TagAddGroup from './tagsComponent/TagAddGroup.vue'
import EditGroupTag from './tagsComponent/EditGroupTag.vue'
import MyMixin from '../../mixins/permissions'
import {
  tag_syncTag,
  tag_list,
  tag_update,
  tag_toOrder,
} from '@/api/customer'
export default {
  components: {
    NoDate,
    // Pagination,
    Draggable,
    TagAddGroup,
    EditGroupTag,
  },
  mixins: [MyMixin],
  data() {
    return {
      input1: '',
      tagName: '',
      tagList: [],
      total: 0,
      pageInfo: {
        page: 1,
        limit: 20,
      },
      showInput: null,
      isShow: false,
      showAddTag: false,
      editTag: false,
      editTagList: [],
    }
  },
  created() {
    this.getTagList()
  },
  methods: {
    synchronous() {
      tag_syncTag().then(res => {
        if(res.result){
          this.$message({
            type: 'success',
            message: '同步成功',
          })
          this.getTagList()
        }
      })
    },
    getTagList() {
      let params = { name: this.input1 }
      tag_list(params).then(res => {
        if(res.result){
          this.tagList = res.data
        }
      })
    },
    checkTable() {
      this.pageInfo.page = 1
       this.addTag()
      this.getTagList()
    },
    resetTable() {
      this.input1 = ''
      this.getTagList()
    },
    fnTagAdd() {
      this.showAddTag = true
    },
    onSubmit(item) {
      let childList = item.children
      let sortIndex = 0
      if (childList.length > 0) {
        sortIndex = Math.max.apply(
          Math,
          childList.map((item) => {
            return item.orderBy
          })
        )
      }
      // console.log(item, childList)
      let isrepeat = childList.some((item) => item.name == this.tagName)
      // console.log(isrepeat)
      if (this.tagName) {
        if (!isrepeat) {
          item.children.push({ name: this.tagName, orderBy: sortIndex + 1 })
          tag_update(item).then(res => {
            if(res.result){
              this.getTagList()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '已存在相同标签',
          })
        }
      }
      this.showInput = null
      this.isShow = false
    },
    addTag(item, index) {
      this.tagName = ''
      this.showInput = index
      this.isShow = !this.isShow
    },
    datadragEnd(evt) {
      // console.log('拖动前的索引 :' + evt.oldIndex)
      // console.log('拖动后的索引 :' + evt.newIndex)
      // console.log(this.tagList)
      let orderList = this.tagList
      tag_toOrder(orderList).then(res => {
        if(res.result){}
      })
    },
    modifyTag(item) {
      console.log(item)
      this.editTag = true
      this.editTagList = item
    },
    shutTag() {
      this.showAddTag = false
      this.getTagList()
    },
    closeEditTag() {
      this.editTag = false
      this.getTagList()
    },
  },
}
</script>
<style lang="less" scoped>
.roleWarp {
  font-size: 14px;
  color: #3c4353;
  min-height: 500px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  .checkDemand {
    display: flex;
    .el-input {
      margin-left: 10px;
      height: 32px;
      width: 203px;
      /deep/.el-input__inner {
        height: 32px;
        width: 203px;
      }
    }
    .inputName {
      line-height: 32px;
      display: inline-block;
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
      margin-left: 32px;
    }
    .reset {
      margin-left: 16px;
    }
  }
}
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
  .headerlist {
    width: 104px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #d9dae4;
    margin-right: 16px;
  }
  .addBtn {
    width: 76px;
    height: 32px;
    background: rgba(65, 104, 246, 0.04);
    border-radius: 4px;
    // border: 1px solid #4168f6;
    color: #000;
    margin-right: 20px;
  }
  /deep/.el-button {
    padding: 0;
  }
  .addGroup {
    width: 118px;
    height: 32px;
    background: rgba(65, 104, 246, 0.04);
    border-radius: 4px;
    border: 1px solid #4168f6;
    color: #4168f6;
  }
}
.roleTable {
  min-height: 500px;
  .tagRow {
    display: flex;
    border-top: 1px solid #f0f2f7;
    padding: 16px 0;
    min-height: 59px;
    &:last-child {
      border-bottom: 1px solid #f0f2f7;
    }
    span {
      display: inline-block;
      color: #838a9d;
      font-size: 14px;
      text-align: center;
      line-height: 28px;
      height: 28px;
      border: 1px solid #d9dae4;
      margin-left: 16px;
      padding: 0 16px;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .groupName {
      border: none;
      width: 102px;
      word-wrap: break-word;
      word-break: normal;
    }
    .tagStyle {
      // margin-left: 20px;
      width: 89%;
      .perchInput {
        border: none;
        .addInput {
          height: 28px;
          /deep/.el-input__inner {
            height: 28px;
            width: 146px;
          }
        }
      }
      .creatTag {
        background: #fafbff;
      }
    }
    .modify {
      min-width: 60px;
    }
    .drag_img {
      img {
        display: inline-block;
        width: 14px;
        vertical-align: -10%;
      }
    }
  }
}
</style>
