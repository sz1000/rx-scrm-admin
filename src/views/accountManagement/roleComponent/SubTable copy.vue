 <template>
  <div class="permission-subTable">
    <div v-if="!menu.showRow" class="content-item">
      <div class="cell">
        <el-checkbox v-model="menu.checked" class="hasEllipsis" :indeterminate="menu.indeterminate"
                     @change="(checked) => handleCheck(checked, menu)">
          {{ menu.title }}
        </el-checkbox>
      </div>
      <div class="last-content" v-if="menu.typeCode == 'page'">
        <div v-if="menu.childrenList && menu.childrenList.length " class="three-box">
          <template>
            <div v-for="child in menu.childrenList" :key="child.id" class="last-child-item"
                 v-show="child.typeCode == 'button' ">
              <el-checkbox v-model="child.checked"
                           @change="(checked) => handleCheck(checked, child)">
                {{ child.title }}
              </el-checkbox>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="pageBox">
        <div v-if="menu.childrenList && menu.childrenList.length " class="three-box">
          <template>
            <div v-for="child in menu.childrenList" :key="child.id" class="last-child-item"
                 v-show="child.typeCode == 'page' || child.typeCode == 'menu' ">
              <el-checkbox v-model="child.checked" :indeterminate="menu.indeterminate"
                           @change="(checked) => handleCheck(checked, child)">
                {{ child.title }}
              </el-checkbox>
            </div>
          </template>
        </div>
      </div>
      <div class="last-content" v-if="menu.typeCode == 'menu'">
        <div v-if="menu.childrenList && menu.childrenList.length " class="three-box">
          <template>
            <div v-for="child in menu.childrenList" :key="child.id" class="last-child-item"
                 v-show="child.typeCode == 'button' ">
              <el-checkbox v-model="child.checked"
                           @change="(checked) => handleCheck(checked, child)">
                {{ child.title }}
              </el-checkbox>
            </div>
          </template>
        </div>
      </div>
      <div v-else :class="{'menuBox' : menu.typeCode == 'nav' }">
      </div>
    </div>
    <div class="table" v-else>
      <div class="title">
        <el-checkbox v-model="menu.checked" class="hasEllipsis" :indeterminate="menu.indeterminate"
                     @change="(checked) => handleCheck(checked, menu)">
          {{ menu.title }}
        </el-checkbox>
      </div>
      <div class="content">
        <SubTable v-for="item in menu.childrenList" :key="item.id" :menu="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { ram } from '../../../ramdata/ram'
export default {
  name: 'SubTable',
  props: {
    menu: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
  created() {},
  watch: {
    // indeterminate:半选状态
    // checked：选中状态
    'menu.childrenList': {
      handler(data) {
        // console.log('----data-----', data)
        if (data) {
          // if (data.typeCode == 'button') return
          if (!data.length) return
          const checkedAll = !data.some((item) => !item.checked)
          // console.log('----checkedAll---', checkedAll)
          const menu = this.menu
          // console.log('----meun------', menu)
          this.$set(menu, 'checked', checkedAll)
          // console.log('----menu11111111111---', menu)
          const isIndeterminate = data.filter((item) => item.indeterminate)
          // console.log('----isIndeterminate1111111----', isIndeterminate)
          if (isIndeterminate.length) {
            this.$set(menu, 'indeterminate', true)
          } else {
            const checkChild = data.filter((item) => item.checked)
            // console.log('----icheckChild2222222----', checkChild, data)
            const indeterminate =
              checkChild.length < data.length && checkChild.length > 0
            this.$set(menu, 'indeterminate', indeterminate)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // console.log('mounted-------', this.menu)
  },
  methods: {
    handleCheck(checked, item) {
      // console.log('----checked-----', checked, item)
      this.checkChild(checked, item)
      ram.$emit('getheperList')
      this.$forceUpdate()
    },
    checkChild(checked, data) {
      // console.log('---123-12-3-213-', checked, data)
      if (data.childrenList && data.childrenList.length) {
        data.childrenList.forEach((item) => {
          // console.log('---item---', item)
          // item.indeterminate = checked
          item.checked = checked
          this.checkChild(checked, item)
        })
      } else {
        // data.immediate = !checked
        data.checked = checked
      }
    },
  },
}
</script>

<style scoped lang="less">
.table {
  display: flex;
  overflow: auto;
}
.title {
  min-width: 197px;
  display: flex;
  align-items: center;
  justify-content: left;
  border: 0.5px solid #f0f2f7;
  padding-left: 16px;
}
.content {
  flex: 1;
  // min-width: 400px;
  // border: 1px solid #f0f2f7;
}
.item-content {
  display: flex;
}
.cell {
  width: 197px;
  border: 0.5px solid #f0f2f7;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 10px 16px;
  .table-expand {
    cursor: pointer;
    margin-right: 2px;
  }
}

.last-content {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
  border: 0.5px solid #f0f2f7;
  max-height: 200px;
  overflow: auto;
  padding: 0 12px;
  .three-box {
    display: flex;
    flex-wrap: wrap;
  }
  .box-wid {
    width: 176px;
    border-right: 0.5px solid #f0f2f7;
  }
}
.pageBox {
  display: block;
  width: 197px;
  border: 1px solid #f0f2f7;
  .three-box {
    display: block;
    width: 197px;
    .last-child-item {
      padding-left: 16px !important;
      margin-right: 0;
      padding: 10px 0;
      border-top: 0.5px solid #f0f2f7;
      border-bottom: 0.5px solid #f0f2f7;
    }
  }
}
.menuBox {
  display: block;
  width: 197px;
  border-right: 1px solid #f0f2f7;
  .three-box {
    display: block;
    width: 185px;
    // border-right: 1px solid #f0f2f7;
  }
}
.last-child-item {
  // flex: 40%;
  margin-right: 20px;
  padding: 4px 0;
}
.content-item {
  display: flex;
}
</style>
<style lang="less" scoped>
.permission-subTable {
  .hasEllipsis {
    .el-checkbox__label {
      // width: 120px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #4168f6 !important;
  border-color: #4168f6 !important;
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #4168f6 !important;
}
</style>




