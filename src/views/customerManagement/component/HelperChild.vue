<template>
  <div>
    <div class="demo">
      <div class="bumenBox" @click="getHelperList(treeData.depId)">
        <img class="txtRight" v-if="!isRU" src="../../../assets/icons/txtRight.png" />
        <img class="txtUp" v-else src="../../../assets/icons/txtUp.png" />
        <img class="wenjianCont" src="../../../assets/images/wenjian.png" /><span class="bumenName">{{treeData.name}}</span>
      </div>
      <el-checkbox-group v-if="isClick" v-model="checkList" @change="handleCheckedChange" class="checkBoxlabel">
        <el-checkbox style="display:block;" @change="handleOneChange(item)" class="checkClass" :label="item.userId" v-for="(item, index) in heperList"
                     :checked="item.checked" :disabled="item.disabled" :key="index">
          {{item.name}}
          <div class="diBox"><span class="zhiwei">{{item.isLeaderInDept == '0'? '普通成员':'部门上级'}}</span><span class="powerName">{{item.rolename}}</span>
          </div>
        </el-checkbox>

      </el-checkbox-group>
      <!--<div v-if="isClick" class="heperBox" >
		    		{{item.name}}
		    	</div>-->
      <treeComp v-for="(item, index) in treeData.children" :key="index" :treeData="item">
      </treeComp>
    </div>
  </div>
</template>
<script>
import { ram } from '../../../ramdata/ram.js'
export default {
  name: 'treeComp',
  props: {
    treeData: {
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      isRU: false,
      isClick: false,
      heperList: [],
      checkList: [],
      disabled: false,
      checked: false,
      childYiList: [],
    }
  },
  created() {
    ram.$on('getyiList', (res) => {
      this.childYiList = res
      /*this.yiList.splice(i,1)*/
    })

    console.log('getyiList++', this.childYiList)
  },
  mounted() {
    //	console.log(heperList)
    //this.getHelperList()
  },
  methods: {
    checkedChange(e) {},
    handleOneChange(item) {
      let _this = this
      item.permission = 2
      console.log(item)
      if (true == item.checked) {
        console.log('已push')
      } else {
        ram.$emit('getStr', item)
      }
      _this.heperList.map((e) => {
        if (e.userId == item.userId) {
          e.checked = !e.checked

          item.disabled = true
        }
      })
      console.log(_this.heperList)

      ram.$emit('getheperList', _this.heperList)
    },
    handleCheckedChange(value) {
      //    for (let i = 0; i < value.length; i++) {
      //    	let obj = {}
      //    	obj.name = value[i]
      //				    checkList.push(obj)
      //			}
    },
    getHelperList(e) {
      this.isRU = !this.isRU
      console.log('???', e)
      let _this = this
      _this.isClick = !_this.isClick
      let params = {
        cluecustomerno: this.$route.query.customno,
        depId: e,
        limit: 1000,
      }
      this.$network
        .get('/user-service/user/getUserList', params)
        .then((res) => {
          _this.heperList = res.data.user.records
          if (_this.heperList.length == 0) {
            this.$message({
              type: 'success',
              message: '当前部门没有员工',
            })
          }

          _this.heperList.map((item) => {
            item.checked = false
          })

          _this.childYiList.map((e) => {
            _this.heperList.map((item) => {
              if (item.userId == e.userId) {
                //item.checked = true
                item.disabled = true
              }
            })
          })
          console.log(_this.heperList)
        })
    },
  },
}
</script>
<style type="text/css" scoped>
/* .el-checkbox__input {
  position: relative;
  bottom: 21px;
}
.el-checkbox {
  margin-left: 13px;
  height: 53px;
} */
</style>
<style lang="less" scoped>
.checkBoxlabel {
  /deep/.el-checkbox__input {
    position: relative !important;
    bottom: 21px !important;
  }
  .el-checkbox {
    margin-left: 13px;
    height: 53px;
  }
}
.demo {
  padding: 0px 0;
  margin: 1px 10px;
  text-align: left;
  font-size: 16px;
  max-width: 350px;
  margin: -22px 5px;

  &:before {
    content: '';
    display: inline-block;
    padding: 0 4px;
  }
}
.bumenBox {
  width: 352px;
  height: 32px;
  line-height: 32px;
  background: #ffffff;
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
}
.bumenBox:hover {
  background: #f4f6fe;
}
.wenjianCont {
  width: 14px;
  margin-right: 8px;
}
.diBox {
  width: 270px;
  height: 17px;
  line-height: 17px;
  font-size: 12px;
  color: #838a9d;
  letter-spacing: 0;
  font-weight: 400;
  margin-top: 4px;
}
.powerName {
  display: inline-block;
  float: right;
}
/deep/.el-checkbox-group {
  font-size: 0;
  overflow-y: scroll;
  max-height: 300px;
}
.txtRight {
  width: 6px;
  margin-right: 5px;
}
.txtUp {
  width: 10px;
  margin-right: 5px;
  position: relative;
  bottom: 2px;
}
</style>