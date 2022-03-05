<template>
  <div class="import_warp">
    <el-dialog
      title="分配客户"
      :visible.sync="importVisible"
      :before-close="dialogFormCancel"
      :close-on-click-modal="false"
      width="736px"
    >
      <div class="dispose">
        <div class="groupLable">
          <div class="name" :class="this.lableList.length >= 6 ?'wr':''">已选择客户:</div>
          <div class="warp_tite">
            <span
              class="warp_item"
              v-for="(item, index) in lableList"
              :key="index"
              >{{ item.name }} <span class="delet" @click="deleteClick(item)">X</span></span
            >
          </div>
        </div>
        <div>
          <el-form ref="from">
            <el-form-item
              label="指定所属人:"
              :rules="[{ required: true, message: '指定所属人' }]"
            >
              <el-select v-model="from.belongs" placeholder="选择员工"
               @change="sourceChange"
                v-loadmore="loadMore"
              >
                <el-option
                  v-for="item in optionsCreat"
                  :key="item.value"
                  :label="item.name"
                  :value="item.userNo"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="tips_warp">
        <p>注意：因企业微信限制，90天内客户只能被转接两次。</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogFormSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fnImportExcle } from "../../../api/custom";
import {inJobTransferCustomer_getUserList,inJobTransferCustomer_assignCustomer} from "../../../api/customer"
import { BASE_URL } from "../../../config/app.js";
import axios from "axios";
export default {
  components: {},
  props: {
    importVisible: {
      type: Boolean,
    },
    listdata: {
      type: Array,
    },
  },

  data() {
    return {
      radio: "",
      excleList: [],
      filename: "",
      BASE_URL,
      from: {
        belongs: "",
      },
      lableList: [],
        optionsCreat: [],
           groupPage: 1,
      grouplimit: 10,
      dataObj:""
    };
  },
  created() {
    this.lableList = JSON.parse(JSON.stringify(this.listdata))  
    console.log(this.listdata, "父组件传递的值");
    this.CustomerMass()
  },
  methods: {
    deleteClick(el){
      console.log(el)
      this.lableList.forEach((item,index)=>{
           if(el.name == item.name){
              this.lableList.splice(index, 1);
           }
      })
      console.log(this.lableList,"删除")
    },

    reloadUpload() {
      // console.log(this.excleList)
      this.excleList = [];
    },
    dialogFormCancel() {
      this.$emit("closeImport");
        this.$emit("datalsit", this.lableList);
    },

    dialogFormSure() {
       if(this.dataObj== ""){
      
          this.$message.error('指定所属人不可为空');
          
       }else{

         let obj ={
           customerList:this.lableList,
           user:{},
           type:1
         }
             this.optionsCreat.forEach(item =>{
           if( item.userNo == this.dataObj){
             obj.user.name = item.name
             obj.user.userId = item.userId
             obj.user.userNo = item.userNo
           }
         })
           console.log(obj,"---")
         inJobTransferCustomer_assignCustomer(obj).then(res =>{
           if(res.result){
         this.$emit("closeImport",);
         this.$emit("datalsit", this.lableList);
         console.log(res.data)
         res.data.forEach(item =>{
           console.log(item,"000==")
           setTimeout(() => {
	            this.$message.error(item);
          }, 10);
          //  this.$message.error(item);
        //        this.$message({
        //   dangerouslyUseHTMLString: true,
        //   message: `<div>
        //      <p>${item}</p>
        //   </div>`
        // });
        //   this.$message({
        //   showClose: true,
        //   duration:3,
        //   message: item,
        //   type: 'error'
        // });
         })
       
           }else{
              this.$message.error('错了哦，这是一条错误消息');
           }
          
         })
       }

    },
      loadMore() {
        console.log(111)
      this.groupPage++;
      this.CustomerMass();
    },
         //负责人
     CustomerMass(){
        let obj = {
          page: this.groupPage,
          limit: this.grouplimit,
        }
        inJobTransferCustomer_getUserList(obj).then(res =>{
          if(res.result){
            if (res.data.records == []) {
            } else {
              let tempList = res.data.records;
              let cent = this.optionsCreat.concat(tempList);
              console.log(this.optionsCreat.concat(tempList));
              this.optionsCreat = cent;
            }
            console.log(res)

          }
        })

        
     },
         sourceChange(value) {
      console.log(value)
       this.dataObj = value
      
    },
  },
};
</script>
<style lang="less" scoped>
.import_warp {
  .el-form-item {
    display: flex;
    /deep/.el-form-item__content {
      width: 392px;
    }
  }
  /deep/.el-dialog {
    // position: relative;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .el-dialog__header {
      height: 50px;
      line-height: 50px;
      padding: 0 16px;
      background: #fafbff;
      border-radius: 8px 8px 0px 0px;
      border-bottom: 1px solid #f0f2f7;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
        color: #3c4353;
      }
      .el-dialog__headerbtn {
        top: 0;
      }
    }
    .el-dialog__body {
      padding: 32px;
      overflow-y: scroll;
      // height: 492px;

      .mb_warp {
        font-size: 14px;
        margin-bottom: 20px;
        span {
          color: #4168f6;
          cursor: pointer;
        }
      }
      .dispose {
        margin-bottom: 20px;

        .symbol {
          color: red;
          display: inline-block;
          vertical-align: middle;
        }
        .groupLable {
          display: flex;
          // align-items: center;
          margin-bottom: 20px;
          .warp_tite {
            // max-width: 118px;

            // background: #FAFBFF;
            // border-radius: 4px;
            // border: 1px solid #D9DAE4;
            // line-height: 28px;
            //  font-size: 14px;
            //  text-align: center;

            // color: #838A9D;
            // margin-left: 10px;
            .warp_item {
              // max-width: 118px;
               margin-top: 10px;
              height: 28px;
              text-align: center;
              line-height: 28px;
              padding: 0 12px;
              background: #fafbff;
              border-radius: 4px;
              border: 1px solid #d9dae4;
              line-height: 28px;
              font-size: 14px;
              text-align: center;
              display: inline-block;
              color: #838a9d;
              margin-left: 10px;
            }
            .delet {
              font-size: 12px;
              margin-left: 6px;
              cursor: pointer;
            }
          }
          .name {
            color: #3c4353;
          height: 48px;
          line-height: 48px;
          width: 80px;
          }
          .wr{
            min-width:100px;
           
          }
        }
      }

      .tips_warp {
        color: #c0c4cc;
        p {
          margin-top: 20px;
          font-weight: 400;
          color: #c0c4cc;
        }
      }
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
</style>
