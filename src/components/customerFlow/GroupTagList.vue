<!-- 客户标签弹框 -->
<template>
  <div>
    <el-dialog title="选择标签" :visible.sync="groupVisible" :before-close="groupVisibleCancel"
      :close-on-click-modal="false">
      <div v-loading='loading'>
        <ul>
          <li class="label_warp" v-for="itemlist in customerstagList" :key="itemlist.id">
            <div class="label_tite">{{ itemlist.name }}</div>
            <div class="label_box">
              <span v-for="(itemchildren, index) in itemlist.children" :key="index"
                class="label_name" :class="{
                    active_name:
                      highLightArr.findIndex((item) => {
                        return item.tagid == itemchildren.tagid;
                      }) > -1,
                  }" @click="getLabelName(itemchildren, index)">{{ itemchildren.name }}</span>
            </div>
            <!-- :class="{ active_name: labename.indexOf(index) > -1 }"  -->
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupVisibleCancel">取 消</el-button>
        <el-button type="primary" @click="confirmVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { tagList } from '../../api/custom'
export default {
  props: {
    groupVisible: {
      type: Boolean,
    },
    tabeList: {
      type: Array,
    },
  },
  data() {
    return {
      tagidList: [],
      highLightArr: [],
      namelabutArr: [],
      activeIndex: 0,
      labename: [], //获取客户标签内容
      customerstagList: [],
      loading: false,
    }
  },
  created() {
    this.getTagList()
    // console.log(this.tabeList, '父组件传的值')
  },
  methods: {
    // 标签列表
    getTagList() {
      this.loading = true
      this.highLightArr = []
      this.namelabutArr = []
      tagList().then((res) => {
        this.loading = false
        // console.log("------data-----", res.data);
        this.customerstagList = res.data
        let allChildTag = res.data.map((item) => {
          return item.children
        })
        let childTag = [].concat.apply([], allChildTag)
        // console.log(childTag)
        this.tabeList.forEach((item) => {
          childTag.forEach((chItem, chIndex) => {
            if (item.tagid == chItem.tagid) {
              this.highLightArr.push(chItem)
              this.namelabutArr.push(chItem)
            }
          })
        })
      })
    },

    //   点击取消
    groupVisibleCancel() {
      this.$emit('closeDialog')
      this.getTagList()
    },
    // 点击确定
    confirmVisible() {
      let tempList = JSON.parse(JSON.stringify(this.highLightArr))
      this.$emit('groupVisibleFrom', tempList)
      this.highLightArr.forEach((item) => {
        this.tagidList.push(item.tagid)
      })
    },
    // 点击获取标签内容
    getLabelName(list, index) {
      var result = this.highLightArr.findIndex((item) => {
        return item.tagid == list.tagid
      })
      if (result > -1) {
        this.highLightArr.forEach((item, index) => {
          if (item.tagid == list.tagid) {
            this.highLightArr.splice(index, 1)
          }
        })
      } else {
        this.highLightArr.push(list)
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import url('../../styles/elementStyle.less');
// /deep/.el-dialog {
//   height: 100%;
// }
/deep/.el-dialog__header {
  background: #fafbff;
  border-radius: 8px 8px 0px 0px;
  border-bottom: 1px solid #f0f2f7;
}
/deep/ .el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #3c4353;
}
// 弹框样式
.label_warp {
  display: flex;
  margin-bottom: 20px;
}
.label_tite {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 500;
  width: 120px;
}
.label_box {
  display: flex;
  flex-wrap: wrap;
  width: 500px;
  //   justify-content: space-between;
}
.label_name {
  background: #fafbff;
  border: 1px solid #d9dae4;
  border-radius: 4px;
  padding: 4px 16px;
  text-align: center;
  margin-bottom: 10px;
  margin-left: 16px;
  cursor: pointer;
  color: #838a9d;
  height: 28px;
}
.active_name {
  background: #4168f6;
  color: #fff;
}
/deep/.el-dialog__body {
  height: 500px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}
/deep/.el-dialog__footer {
  border-top: 1px solid #f0f2f7;
  // padding: 25px 16px 0 0;
}
</style>
