<template>
    <div class="customerWarp" >
        <TitleBar title="通用设置"></TitleBar>
        <div class="warp_box">
            <el-switch
                @change="FriendcloseFn"
                class="mout_switch"
                v-model="value1"
                :active-text="Friendclose"
                inactive-text="加好友频率预警：">
            </el-switch>

            <div v-if="value1">
                <div class="friend_warp">
                    <div class="cent_warp">
                        <div class="cent_friend">
                        <el-input class="inputClass" size="mini" maxlength="3" v-model="frindVal"></el-input>
                        <span>分种内，</span>
                        <span>分钟内，加好友超过</span>
                        <el-input class="inputClassTo" size="mini" maxlength="3" v-model="frindNumVal"></el-input>
                        <span class="mr_8">个，进行预警，发送通知给</span>
                        <el-checkbox v-model="frindChecked" @change="frindCheckedFn"></el-checkbox>
                        <span class="self_tite">本人</span>
                        <el-checkbox v-model="leadershipChecked" @change="leadershipCheckedFn"></el-checkbox>
                        <span class="leadership">上级领导</span>
                        </div>
                     <div class="save_btn" @click="saveClink1">保存</div>   
                    </div>   
                </div>
            </div>
        </div>
        <div class="warp_box">
            <el-switch
                @change="FriendgroupFn"
                class="mout_switchs"
                v-model="value2"
                :active-text="Friendgroup"
                inactive-text="建群频率预警：">
            </el-switch>

            <div v-if="value2">
                <div class="friend_warp">
                    <div class="cent_warp">
                        <div class="cent_friend">
                        <el-input class="inputClass" size="mini" maxlength="3" v-model="groupVal"></el-input>
                        <span>分种内，</span>
                        <span>分钟内，加好友超过</span>
                        <el-input class="inputClassTo" size="mini" maxlength="3" v-model="groupNumVal"></el-input>
                        <span class="mr_8">个，进行预警，发送通知给</span>
                        <el-checkbox v-model="groupChecked" @change="groupCheckedFn"></el-checkbox>
                        <span class="self_tite">本人</span>
                        <el-checkbox v-model="groupshipChecked" @change="groupshipCheckedFn"></el-checkbox>
                        <span class="leadership">上级领导</span>
                    </div>
                     <div class="save_btn" @click="saveClink2">保存</div>   
                    </div>   
                </div>
            </div>
        </div>
         <div class="warp_box disabled_class">
             <span class="assistant">协助人规则：</span>
            <el-switch
                @change="FriendruleFn"
                class="mout_switchrule"
                v-model="value3"
                disabled
                :active-text="Friendrule"
                >
            </el-switch>

            <div v-if="value3">
                <div class="friend_warp">
                    <div class="cent_warp">
                    <p class="rule_tite">1. 请选择员工添加客户微信或者企业微信成为好友后的转化方式：</p>
                    <div class="radio_tab">
                        <el-radio v-model="areradios" @change="radiochanges"  label="1">添加好友后，自动转化为“线索”</el-radio>
                        <el-radio v-model="areradios" @change="radiochanges" label="2">添加好友后，自动转化为“客户”</el-radio>
                    </div>
                    <p class="rule_tite">2. 第二个及之后添加客户为好友的员工，是否自动成为该客户的协助人？</p>
                    <div class="radio_tab">
                        <el-radio v-model="areradio" @change="radiochange"  label="1">是，自动成为协助人</el-radio>
                        <el-radio v-model="areradio" @change="radiochange" label="0">否，可向该客户的负责人发起申请成为协助人</el-radio>
                    </div>
                        <div class="cent_friend">
                        <!-- <el-input class="inputClass" size="mini" maxlength="3" v-model="groupVal"></el-input>
                        <span>分种内，</span> -->
                        <span>发起申请成为协助人后</span>
                        <el-input class="inputClassTo" size="mini" maxlength="3" v-model="ruleNumVal"></el-input>
                        <span class="mr_8">小时内，负责人未处理，自动</span>
                        <div>
                            <el-radio v-model="ruleadio" @change="rulechange"  label="1">通过</el-radio>
                            <el-radio v-model="ruleadio" @change="rulechange" label="2">拒绝</el-radio>
                            <el-radio v-model="ruleadio" @change="rulechange" label="3">不做处理</el-radio>
                        </div>
                       
                        </div>
                     <div class="save_btn" @click="saveClink3">保存</div>   
                    </div>   
                </div>
            </div>
        </div>
          <div class="warp_box">
      
                <div class="assistants">
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="互动雷达以营销组件作为载体，自动完成线索收集，支持全域通道接入">
                        <img src="../../../assets/images/jingao.png" slot="reference" alt="" />
                    </el-popover>
                  <span class="tite" slot="reference"> 互动雷达：</span>
                <el-switch
                    @change="FriendradarFn"
                    class="mout_switch"
                    v-model="value4"
                    :active-text="Friendradar"
                    inactive-text="">
                </el-switch>
                </div>
            <!-- </span> -->

            <div v-if="value4">
                <div class="friend_warp">
                    <div class="cent_warp cent_warps">
                        <div class="cent_friend">
                       <el-checkbox-group v-model="prohibitSend" @change="interactiChange">
                        <div class="multiple_list">
                        <el-checkbox label="素材线索" name="1" @change="threadbox"></el-checkbox>
                        </div>
                        <div class='multiple_list'>
                        <el-checkbox label="名片线索" name="2" @change='cardbox'></el-checkbox>
                        </div>
                        <div class="multiple_list multiple">
                        <el-checkbox label="广告线索" name="3" @change="materialbox"></el-checkbox>
                        <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="如需接入广告线索，请联系我们">
                        <img src="../../../assets/images/jingao.png" slot="reference" alt="" />
                    </el-popover>
                        </div>
       
                      </el-checkbox-group>
                        </div>
                     <div class="save_btn save_btns" @click="saveClink4">保存</div>   
                    </div>   
                </div>
            </div>
        </div>

              <div class="warp_box">
      
                <div class="assistants">
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="根据【客户名称】作为客户的唯一标识，
                        在进行客户相关操作时，避免存在相同【客户名称】的客户，如新增、导入等情况">
                        <img src="../../../assets/images/jingao.png" slot="reference" alt="" />
                    </el-popover>
                  <span class="tite" slot="reference" > 客户自动去重：</span>
                <el-switch
                    @change="FriendgroupFns"
                    class="mout_switch"
                    v-model="value5"
                    :active-text="Friendremoval"
                    inactive-text="">
                </el-switch>
                </div>
        </div>
    </div>
</template>
<script>
import TitleBar from "../../../components/customerFlow/TitleBar";
import { formatDate } from '../../../utils/tool';
import {assistantRuleSetting,friendsLimitsWarningSetting,settings,switchover,interactiveRadarSetting} from "../../../config/api"
export default {
  components: {
    TitleBar,

  },

  data() {
    return {
          id:"",

        Friendclose:"已关闭",
        value1: false,
        frindVal:'5',
        frindNumVal:"5",
        frindChecked:true,
        leadershipChecked:true,
        frindChecked1:"",
        leadershipChecked1:"",

         groupVal:"5",
         value2: false,
         Friendgroup:"已关闭",
         groupNumVal:"5",
        groupChecked:true,
        groupshipChecked:false,
        groupChecked1:'',
        groupshipChecked1:"",

         value3: true,
         Friendrule:"已开启",
         areradio:"",
         ruleNumVal:"24",
         ruleadio:"",
         areradios:"",
         materialsbox:"",

         value4:true,
         prohibitSend: [], 
         Friendradar:"已开启",
         threadsbox:"",
         cardsbox:"",

         value5:true,
         Friendremoval:'已开启',
 
        dataList:[]
    };
  },
  created() {
      this.Settings()
  
      if(this.value2){
           this.Friendgroup = "已开启"
      }else{
            this.Friendgroup = "已关闭"
      }
    //   if(this.value4){
           
    //         this.Friendradar = "已开启"
    //   }else{
    //         this.Friendradar = "已关闭"
    //   }
      if(this.value5){
         this.Friendremoval = "已开启"
      }else{
             this.Friendremoval = "已关闭"
      }
    //   this.FriendgroupFn()
        //  this.frindCheckedFn()
  },
  methods: {
      FriendcloseFn(val){
          this.switchList()
          console.log(val)
          if(val){
               this.value1 = val
               this.Friendclose = "已开启"
          }else{
                this.Friendclose = "已关闭"
          }
      },
      FriendgroupFn(val){
            this.switchList()
           if(val){
               this.value2 = val
               this.Friendgroup = "已开启"
          }else{
                this.Friendgroup = "已关闭"
          }
      },
      FriendruleFn(val){
            this.switchList()
            if(val){
               this.value3 = val
               this.Friendrule = "已开启"
          }else{
                this.Friendrule = "已关闭"
          }
      },
      FriendradarFn(val){
        if(val){
          this.$confirm('开启互动雷达后，将开启自动线索收集，确定开启吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$message({
            type: 'success',
            message: '开启成功'
          });
             this.switchList()
             this.value4 = true
             this.Friendradar = "已开启"
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消'
          });    
            this.value4 = false    
              
        });

          }else{
            
             this.$confirm('关闭互动雷达后，将关闭自动线索收集，确定关闭吗？', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
        }).then(() => {
             this.$message({
             type: 'success',
             message: '关闭成功!'
          });
             this.switchList()
             this.value4 = val
             this.Friendradar = "已关闭"
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });      
             this.value4 = true      
             this.switchList()    
        });
          }
      },
      FriendgroupFns(val){
       
          if (val) {
            this.$confirm('开启客户自动去重后，客户将根据【客户名称】自动去重，确定开启吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$message({
            type: 'success',
            message: '开启成功!'
          });
            this.Friendremoval = "已开启"
             this.switchList()
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消'
          });     
          this.value5 = false     
          this.switchList()
        });
            
          }else{
            this.$confirm('关闭客户自动去重后，客户将不再根据【客户名称】自动去重，可能存在重复的客户名称，确定关闭吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$message({
            type: 'success',
            message: '关闭成功!'
          });
              this.switchList()
            this.Friendremoval = "已关闭"
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消'
          });      
            this.switchList()
            this.value5 = true    
        });

             
          }
      },
      radiochange(val){
         console.log(val)
         this.areradio = val
      },
      radiochanges(val){
         console.log(val)
         this.areradios = val
      },
      rulechange(val){
          console.log(val)
          this.ruleadio = val
      },
      frindCheckedFn(val){
          console.log(val,"--P")
          if(val){
            this.frindChecked1 = 1
            console.log(this.frindChecked1)
          }else{
               this.frindChecked1 = 0
          }
      },
      leadershipCheckedFn(val){
          console.log(val)
          if(val){
            this.leadershipChecked1 = 1
          }else{
               this.leadershipChecked1 = 0
          }
      },
      groupCheckedFn(val){
          console.log(val)
          if(val){
            this.groupChecked1 = 1
          }else{
               this.groupChecked1 = 0
          }
      },
      groupshipCheckedFn(val){
          console.log(val)
          if(val){
            this.groupshipChecked1 = 1
          }else{
               this.groupshipChecked1 = 0
          }
      },
      interactiChange(val){
       
        val.forEach(el =>{
            if(el){
               if(el == "素材线索"){
                   
               }
            }
        })
      },
      saveClink1(){
        //   this.frindCheckedFn()
           this.friendList()
           console.log(this.frindChecked1)
      },
      saveClink2(){
        this.groupList()
      },
      saveClink3(){
        this.assistantList()
      },
      saveClink4(){
        this.interactiveList()
      },
      threadbox(val){
        if(val){
          this.threadsbox = 1
        }else{
             this.threadsbox = 0
        }
      },
      cardbox(val){
         if(val){
            this.cardsbox = 1
            }else{
                this.cardsbox = 0
            }
      },
      materialbox(val){
         if(val){
            this.materialsbox = 1
            }else{
                this.materialsbox = 0
            }
      },
    //   加好友
      friendList(){
             let params = {
                settingItem:"friends_limits_warning",
                friendsLimitsWarningVO: {
                friendsInMinutes: this.frindVal,
                friendsLimitsNumber:this.frindNumVal,
                friendsNoticeToSelf: this.frindChecked1 || 0,
                friendsNoticeToSuperior: this.leadershipChecked1
                },
            }
          friendsLimitsWarningSetting(params).then(res =>{
             if(res.result){
                  this.$message({
                    message: res.msg,
                    type: 'success'
                });
             }
          })
      },
    //  健群
      groupList(){
             let params = {
                settingItem:"group_limits_warning",
                groupLimitsWarningVO: {
                groupInMinutes: this.groupVal,
                groupLimitsNumber:this.groupNumVal,
                groupNoticeToSelf: this.groupChecked1 || 0,
                groupNoticeToSuperior: this.groupshipChecked1
                },
            }
          friendsLimitsWarningSetting(params).then(res =>{
                if(res.result){
                  this.$message({
                    message: res.msg,
                    type: 'success'
                });
             }
          })
      },
      // 协助人
      assistantList(){
         let params = {
            assistantRuleVO: {
            assistantAuto: this.ruleadio,
            assistantManualInHours: this.areradio,
            assistantManualInHoursAction: this.ruleNumVal
            },
            wechatFriendAuto: this.areradios
                }
          assistantRuleSetting(params).then(res =>{
                if(res.result){
                  this.$message({
                    message: res.msg,
                    type: 'success'
                });
             }
          })
      },
      //互动雷达
      interactiveList(){
          let params = {
                addsClueSwitch: this.materialsbox,
                cardClueSwitch: this.cardsbox,
                materialClueSwitch: this.threadsbox
          }
          interactiveRadarSetting(params).then(res =>{
             if(res.result){
                  this.$message({
                    message: res.msg,
                    type: 'success'
                });
             }
          })
      },
    //   配置开关
    switchList(){
        
          switchover(this.id).then(res =>{
                 if(res.result){
                  this.$message({
                    message: res.msg,
                    type: 'success'
                });
             }
          })
    },
    //   所以配置
     async Settings() {
            let { code, data } = await settings()

            if (code == 'success') {
                this.dataList = data
               
                this.dataList.forEach(item =>{
                  if(item.settingItem == "friends_limits_warning"){
                      this.value1 = item.enableStatus
                      this.id = item.id
                    }else if(item.settingItem == "group_limits_warning"){
                      this.value2 = item.enableStatus
                      
                       this.id = item.id
                    }else if(item.settingItem == "interactive_radar"){
                        this.value4 = item.enableStatus
                         console.log(item.enableStatus,"======")
                         if(this.value4){
                              this.Friendradar = "已开启"
                         }else{
                              this.Friendradar = "已关闭"
                         }
                         this.id = item.id
                    }else if(item.settingItem == "customer_duplicate_switch"){
                        this.value5 = item.enableStatus
                         
                         this.id = item.id
                    }
                    if(item.settingsRulesVOS){
                        item.settingsRulesVOS.forEach(el =>{ 
                            if(el.settingRuleKey == "friends_in_minutes"){
                                this.frindVal = el.settingRuleValue
                            }else if(el.settingRuleKey == "friends_limits_number"){
                                    this.frindNumVal = el.settingRuleValue 
                            }else if(el.settingRuleKey == "friends_notice_to_self" && el.settingRuleValue == 0){
                                 this.frindChecked = false
                                 this.frindChecked1 = 0
                                
                            }else if(el.settingRuleKey == "friends_notice_to_self" && el.settingRuleValue == 1){
                                  this.frindChecked = true
                                   this.frindChecked1 = 1
                            }else if(el.settingRuleKey == "group_notice_to_sel" && el.settingRuleValue == 1){
                                  this.groupChecked = true
                                   this.groupChecked1 = 1
                            }else if(el.settingRuleKey == "group_notice_to_sel" && el.settingRuleValue == 0){
                                  this.groupChecked = false
                                   this.groupChecked1 = 0

                            }else if(el.settingRuleKey == "friends_notice_to_superior" && el.settingRuleValue == 0){
                                  this.leadershipChecked = false
                            }else if(el.settingRuleKey == "friends_notice_to_superior" && el.settingRuleValue == 1){
                                  this.leadershipChecked = true
                            }else if(el.settingRuleKey == "group_in_minutes"){
                                this.groupVal = el.settingRuleValue
                            }else if(el.settingRuleKey =="group_limits_number"){
                                this.groupNumVal =  el.settingRuleValue
                            }else if(el.settingRuleKey =="group_notice_to_superior" && el.settingRuleValue == 0){
                                this.groupshipChecked =  false
                            }else if(el.settingRuleKey =="group_notice_to_superior" && el.settingRuleValue == 1){
                                this.groupshipChecked =  true
                            }else if(el.settingRuleKey == "group_notice_to_self" && el.settingRuleValue == 0){
                                this.groupChecked =  false
                            }else if(el.settingRuleKey =="group_notice_to_self" && el.settingRuleValue == 1){
                                this.groupChecked =  true
                            }else if(el.settingRuleKey == "assistant_auto"){
                                this.areradio = el.settingRuleValue
                            }else if(el.settingRuleKey == "assistant_manual_in_hours" ){
                            }else if(el.settingRuleKey == "wechat_friend_auto"){
                                this.areradios = el.settingRuleValue
                            }else if(el.settingRuleKey == "assistant_manual_in_hours" ){
                                this.ruleNumVal = el.settingRuleValue
                            
                            }else if(el.settingRuleKey == "assistant_manual_in_hours_action" ){
                                this.ruleadio = el.settingRuleValue
                            }else if(el.settingRuleKey == "assistant_manual_in_hours_action" ){
                                this.ruleadio = el.settingRuleValue
                            }else if(el.settingRuleKey == "material_clue_switch" && el.settingRuleValue == "1"){
                                this.prohibitSend.push("素材线索")
                            
                            }else if(el.settingRuleKey == "card_clue_switch" && el.settingRuleValue == "1"){
                                this.prohibitSend.push("名片线索")
                            
                            }else if(el.settingRuleKey == "adds_clue_switch" && el.settingRuleValue == "1"){
                                this.prohibitSend.push("广告线索")
                            
                            }else if(el.settingRuleKey == "material_clue_switch" && el.settingRuleValue == "0"){
                                this.prohibitSend.push()
                            
                            }else if(el.settingRuleKey == "card_clue_switch" && el.settingRuleValue == "0"){
                                this.prohibitSend.push()
                            
                            }else if(el.settingRuleKey == "adds_clue_switch" && el.settingRuleValue == "0"){
                                this.prohibitSend.push()
                            }
                        })
                    }
                })
              
            }
        },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/elementStyle.less";
.customerWarp {
  min-height: 100vh;
  border-radius: 8px;
  background-color: #fff;
  padding: 0 16px;
  .warp_box{
      .assistant{
        font-size: 14px;
        color: #3C4353;
        margin-left: 27px;
      }
      .assistants{
        display:flex;
        align-items: center;
        font-size: 14px;
        color: #3C4353;
        margin-left: 20px;
        img{
            width: 16px;
            height: 16px;
            margin-right:2px;
            margin-top: 2px;
        }
        .tite{
            margin-right: 10px;
            margin-bottom: 3px;
        }
      }
      padding: 15px 0;
          border-bottom: 1px solid #f0f2f7;
      .mout_switch{
         /deep/ .is-active{
              color: #3C4353;
          }
        
      }
      .mout_switchs{
          margin-left: 14px;
         /deep/ .is-active{
              color: #3C4353;
          }
       }
      .mout_switchrule{
          margin-left: 10px;
         /deep/ .is-active{
              color: #3C4353;
          }
       }
      .friend_warp{
         .cent_warps{
        //   margin: 0px 0 16px 122px;
        .multiple{
            display: flex;
            align-items: center;
        }
          .multiple_list{
             margin-bottom: 16px;
             .is-checked{
                 /deep/ .el-checkbox__label{
                     color: #3C4353;
                 }
             }
             span{
                 /deep/ .el-popover__reference-wrapper{
                     img{
                          width: 16px;
                          height: 16px;
                          margin-left: 5px;
                     }
                  }
             }
          }
          .save_btns{
              margin-top: 0 !important;
          }
          
         }
        .cent_warp{
        .rule_tite{
            font-size: 14px;
            color: #3C4353;
            }
        .radio_tab{
              margin: 12px 0 17px;
            }
            margin: 16px 0 16px 122px;
        .cent_friend{
            display: flex;
            font-size: 14px;
            color: #3C4353;
            // margin: 16px 0 16px 122px;
   
        .inputClass {
            width: 52px;
            height: 22px;
            margin-right: 8px;
            /deep/.el-input__inner {
            height: 22px;
            line-height: 22px;
            text-align: center;
                                   }
                     }
        .inputClassTo {
            width: 52px;
            height: 22px;
            margin: 0 8px;
            /deep/.el-input__inner {
            height: 22px;
            line-height: 22px;
            text-align: center;
                                   }
                     }
        .self_tite{
            margin-left: 4px;
            margin-right: 16px;
        }
        .mr_8{
            margin-right: 8px;
        }
        .el-checkbox{
            margin-right: 0;
        }
        }
         .save_btn{
            width: 76px;
            height: 32px;
            background: #4168F6;
            border-radius: 4px;
            text-align: center;
            line-height:32px;
            color: #FFFFFF;
            margin-top: 16px;
         }
           }
      }
  }
//   .disabled_class{
//      /deep/ .el-switch{

//          .el-switch__label{
//               color: #3C4353;
//           }
//      }
//   }
}
</style>