<template>
  <div class="edit_dialog">
    <el-dialog title="编辑协助人" :visible.sync="helperEdit" :before-close="dialogFormCancel" :close-on-click-modal='false' width="736px">
      <el-row :gutter="20">
        <el-col :span="12">
          <!--<el-input v-model="inputSerch" placeholder="搜索员工(此功能暂未开放)"></el-input>-->
          <div class="titleLeft" style="margin-top: 3px;">
            部门信息
          </div>
          <treeComp :treeData="jiaList"></treeComp>
        </el-col>
        <el-col :span="12">
          <div class="titleRight">
            已选中员工
            <span class="allFucs" style="margin-left: 192px;">
              <!--<el-checkbox style="top:20px;position: relative;" v-model="checkAll" @change="handAllChange" :indeterminate="isIndeterminate">
		  				<span style="position: relative;bottom: 21px;">全选</span>
		  			</el-checkbox>-->
            </span>
          </div>
          <el-checkbox-group v-model="checkList" @change="changeRightList" class="checkBoxlabelEdit">
            <el-checkbox style="display:block;top:30px;position: relative;" @change="checkedChange" class="checkClass" :label="item.userId"
                         v-for="(item, index) in yiList" :key="index">
              <span style="position: relative;bottom: 21px;">{{item.name}}</span>
              <span class="rightBox" @change="onlyChange(item)">
                <el-radio v-model="item.permission" :label="2">只读</el-radio>
                <el-radio v-model="item.permission" :label="1">读写</el-radio>
              </span>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import treeComp from './HelperChild.vue'
import { ram } from '../../../ramdata/ram.js'
export default {
  props: {
    helperEdit: {
      type: Boolean,
    },
    type: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      cities: [],
      isIndeterminate: true,
      upArr: [],
      checkAll: false,
      checkList: [],
      // radioBook:1,
      inputSerch: '',
      yiList: [],
      jiaList: '',
      toData: [], //目标数据类型
      checkListLeft: [],
      checkedYL: false,
      allCheck: [],
    }
  },
  created() {
    let _this = this
    ram.$on('getStr', (res) => {
      /*_this.yiList.map(e => {	
						if (e.userId == res.userId) {
								console.log('已存在')
						}else{*/
      var arr = Array.prototype.slice.call(_this.yiList)

      _this.yiList = arr
      _this.yiList.push(res)

      _this.checkList.push(res.userId)
      //})

      /*let obj = Object.assign({}, _this.yiList)
				  	_this.yiList = []
				  	_this.yiList = obj*/
      console.log('y_result>>>', _this.yiList)
      /*	this.$nextTick(() => {
							this.$refs.getFuc.handleOneChange
						})*/

      try {
        this.changeRightList() //可能会导致错误的代码
        console.log('trytrytrytrytry')
      } catch (error) {
        console.log('catchcatchcatch') //在错误发生时怎么处理
      }
    })

    /*ram.$on( 'getheperList', (childheperList) => {
 			
 				console.log('childheperList>>>',childheperList)
 			
 					childheperList.map(e => {
			 				this.yiList.map(item => {
			 					if (item.userId == e.userId) {
			 							item.checked = e.checked
			 						}
			 					})
			 				})
			 			
 		})*/

    /*this.yiList.splice(i,1)*/
  },
  components: {
    treeComp,
  },
  mounted() {
    this.getBumenList()
    this.getyiList()
  },
  watch: {},
  //引用vue getAllData
  inject: ['getAllData'],
  methods: {
    onlyChange(e) {
      console.log(e)

      //let obj = Object.assign({}, this.yiList)
      let obj = [...this.yiList]
      this.yiList = []
      this.yiList = obj
      e.permission == 1 ? 2 : 1
      console.log(this.yiList)
      this.changeRightList()
    },
    handAllChange(val) {
      console.log(val)

      //this.checkAll = !this.checkAll

      let _this = this
      /*let objc=[..._this.checkList]
  	_this.checkList = []
  	_this.checkList = objc*/
      //let allCheck = val ? _this.checkList : []

      // _this.checkList = allCheck

      //   this.isIndeterminate = false
      //console.log(_this.checkList)
      console.log(_this.checkList)
    },
    changeRightList(e) {
      let _this = this
      //				console.log(e)
      let upArr = [] //上传时的最终数据upArr
      //	let newCheckList = []
      _this.checkList.map((e) => {
        _this.yiList.map((item) => {
          if (item.userId == e) {
            //item.checked = true
            upArr.push(item)
            //this.checkList.push(item.userId)
            /*newCheckList.push(item.userId)
					    newCheckList = newCheckList.concat(this.checkList)
						this.checkList = 	newCheckList*/
          }
        })
      })

      /*  let objupArr = [...this.upArr]
	      _this.upArr = []
	      _this.upArr = objupArr*/

      _this.upArr = upArr

      /*let checkedCount = e.length;
        _this.checkAll = checkedCount === _this.yiList.length;
        _this.isIndeterminate = checkedCount > 0 && checkedCount < _this.yiList.length;*/

      /*console.log(_this.checkList)
		console.log(_this.yiList)
		console.log(upArr)*/
    },
    checkedChange(e) {
      /*	console.log(e)
		console.log(this.checkList)*/
    },
    hasHelperChange(item) {
      console.log(item)
    },
    getBumenList() {
      let _this = this
      _this.$network.get('/user-service/userdepartment/getlist').then((res) => {
        console.log(res.data)
        _this.jiaList = res.data[0]
      })
    },
    getyiList() {
      let _this = this
      let params = {
        cluecustomerno: this.$route.query.customno,
      }

      _this.$network
        .get(
          '/customer-service/clueCustomerFollowUser/getFollowUserList',
          params
        )
        .then((res) => {
          console.log(res.data)

          _this.yiList = res.data

          ram.$emit('getyiList', _this.yiList)
          let checkList = []

          for (let i = 0; i < _this.yiList.length; i++) {
            let objid = {}
            objid = _this.yiList[i].userId
            checkList.push(objid)
          }
          console.log(checkList)
          _this.checkList = checkList
        })
    },
    dialogFormCancel() {
      this.$emit('closehelperEdit', 1)
    },
    dialogFormSure() {
      let _this = this
      this.$confirm('是否保存编辑', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          /*let checkListRight = []
			 			value.map(e => {
			 				this.heperList.map(item => {		
			 					if (item.name == e) {				
			 						checkListLeft.push({
			 							"name":item.name,
			 							"userId":item.userId,
			 							"userNo":item.userNo,
			 							"permission": 2,
			 						})
			 					}				
			 				})
			 			})*/

          let params = {
            clueCustomerNo: this.$route.query.customno,
            userList: this.upArr,
            type: this.type
          }
          this.$network
            .post(
              '/customer-service/clueCustomerFollowUser/updateFollowUser',
              params
            )
            .then((res) => {
              console.log(res)
              this.$emit('closeChange', 2)
              this.$message({
                type: 'success',
                message: '编辑成功!',
              })
              this.getyiList()
              _this.getAllData()
              this.$emit('closehelperEdit', 1)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存',
          })
        })
    },
  },
}
</script>
<style type="text/css">
.el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #fff !important;
  border-color: #fff !important;
}
</style>
<style lang="less" scoped>
.checkBoxlabelEdit {
  /deep/.el-checkbox__input {
    position: relative !important;
    bottom: 21px !important;
  }
  .el-checkbox {
    margin-left: 13px;
    height: 34px;
  }
}

.el-checkbox__input {
  position: relative;
  top: 0px;
}
.el-checkbox {
  line-height: 32px;
  height: 32px;
  margin-right: 0px;
}
.el-radio {
  margin-right: 12px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.edit_dialog {
  /deep/.el-dialog {
    /*height: 606px;*/
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
      .rowStyle {
        margin-bottom: 20px;
        line-height: 32px;
      }
      .el-select,
      .el-input__inner {
        /*width: 329px;*/
        height: 32px;
      }
      .el-input__icon {
        line-height: 32px;
      }
    }

    .el-dialog__footer {
      /* position: absolute;*/
      bottom: 16px;
      right: 16px;
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
.titleLeft,
.titleRight {
  width: 100%;
  height: 22px;
  font-size: 16px;
  color: #3c4353;
  font-weight: bold;
  margin: 16px;
  line-height: 22px;
}
.titleRight {
  margin: 0;
}
.rightBox {
  /*margin-left: 140px;
	position: relative;
	bottom: 18px;*/
  position: absolute;
  bottom: 29px;
  right: 0;
}
</style>
