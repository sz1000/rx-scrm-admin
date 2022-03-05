<template>
  <div class="myCluesWarp">
    <div class="goback pointer" @click="goback">
      <img src="../../assets/images/goback.png" alt="" /> 返回
    </div>
    <div class="detailHeader">
      <div class="top_warp">
        <div class="top_info">
          <div class="avatar" :class="{'bg':!formDate.avatar}">
            <img v-if="formDate.avatar" class="img" :src="formDate.avatar" alt="">
            <span v-else>{{formDate.customerCalled | avatar}}</span>
            <img class="logo" v-if="formDate.externalType == 1" src="@/assets/svg/wx.svg" alt="">
            <img class="logo" v-if="formDate.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
          </div>
          <div class="val">
            <div class="title_box">
              <span class="tit">{{ formDate.customerCalled }}</span>
              <img class="gender" v-if="formDate.gender == 1" src="@/assets/images/icon_male.png" alt="">
              <img class="gender" v-if="formDate.gender == 2" src="@/assets/images/icon_female.png" alt="">
              <span class="select" v-if="Number(formDate.type) > 2">{{formDate.stage}}</span>
            </div>
            <div class="other">
              <div class="text_item" v-if="formDate.cropFullName">
                <div class="label">企业名称: </div>
                <div class="text">{{ formDate.cropFullName }}</div>
              </div>
              <div class="text_item" v-if="formDate.name">
                <div class="label">联系人: </div>
                <div class="text">{{ formDate.name }}</div>
              </div>
              <div class="text_item" v-if="formDate.phone">
                <div class="label">手机号码: </div>
                <div class="text">{{ formDate.phone }}</div>
              </div>
              <div class="text_item" v-if="formDate.address">
                <div class="label">办公地址: </div>
                <div class="text">{{ formDate.address }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tag_content">
          <div class="operatBtn">
            <div v-for="(item, index) in items" :key="index" class="box" @click="fnSelectBtn(item, index)" v-show="item.showHide">
              <div>
                <!-- <img :src="item.icon1" alt="" v-if="isShowActive == index" /> -->
                <img :src="item.icon" alt="" />
                {{ item.name }}
              </div>
            </div>
            <div class="box" @click="addNicheFun" v-if="type > 2 && nicheTotal == 0">
              <div>
                <img src="@/assets/images/icon_edit1.png" alt="" />
                新增商机
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-row :gutter="20">
        <div class="boxWarp">
          <el-col :span="16">
            <div class="l_continer">
              <!-- 商机start -->
              <stage-list ref="stage" :customerNo="$route.query.customno" :formType="type" @sure="getData" @getTotal="getTotalFun"></stage-list>
              <!-- 商机end -->

              <div class="table_head" v-if="type == 1 || type == 3">
                <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                跟进人信息
              </div>
              <el-table v-if="type == 1 || type == 3" :data="followUserlist" border style="width: 100%;"
                        :cell-style="{'text-align':'center',border:'0.5px solid #EBEEF5 !important',padding:'3px 0',color:'#838a9d'}"
                        :header-cell-style="{background:'#fafbff',color:'#3C4353','text-align':'center'}">
                <el-table-column prop="userName" label="所属员工">
                </el-table-column>
                <el-table-column label="来源">
                  <template slot-scope="scope">
                    <span>{{scope.row.sourceName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="addTimestr" label="添加服务时间" :show-overflow-tooltip="isTip">
                </el-table-column>
                <el-table-column prop="followTimestr" label="最近沟通时间" :show-overflow-tooltip="isTip">
                </el-table-column>
                <el-table-column prop="permission" label="权限">
                </el-table-column>
                <el-table-column prop="followrole" label="跟进角色">
                </el-table-column>
              </el-table>
              <!-- 基本信息 start -->
              <DetailBasicInfo :data="formDate" :list="userDefinedList"></DetailBasicInfo>
              <!-- <section>
                <div class="table_head">
                  <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                  基本信息
                </div>
                <div class="table_box" v-if="type == 1 || type == 2">
                  <div class="rowTable">
                    <span class="keyText">姓名</span>
                    <span class="valueTxt" :title="formDate.name">{{formDate.name}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">手机号</span>
                    <span class="valueTxt">{{ formDate.phone }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">性别</span>
                    <span class="valueTxt">{{formDate.gender == "0" ||formDate.gender == "-" ||formDate.gender == ""? "未知"
                    : formDate.gender == "1"
                    ? "男"
                    : "女"}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">职务</span>
                    <span class="valueTxt">{{ formDate.position }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">企业名称</span>
                    <span class="valueTxt" :title="formDate.cropFullName">{{formDate.cropFullName}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">所属行业</span>
                    <span class="valueTxt" :title="formDate.cropSubIndustry">{{formDate.cropSubIndustry}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">线索来源</span>
                    <span class="valueTxt" :title="formDate.sourceName">{{formDate.sourceName}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">邮箱</span>
                    <span class="valueTxt" :title="formDate.email">{{formDate.email}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">微信号</span>
                    <span class="valueTxt">{{ formDate.weixin }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">地址</span>
                    <span class="valueTxt" :title="formDate.address">{{formDate.address}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">描述</span>
                    <span class="valueTxt" :title="formDate.describe">{{formDate.describe}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">备注</span>
                    <span class="valueTxt" :title="formDate.remark">{{formDate.remark}}</span>
                  </div>
                </div>
                <div class="table_box" v-if="type == 3 || type == 4">
                  <div class="rowTable">
                    <span class="keyText">客户名称</span>
                    <span class="valueTxt" :title="formDate.customerCalled">{{formDate.customerCalled}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">客户来源</span>
                    <span class="valueTxt" :title="formDate.source">{{formDate.sourceName}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">客户阶段</span>
                    <span class="valueTxt" :title="formDate.stage">{{formDate.stage}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">客户类型</span>
                    <span class="valueTxt" :title="formDate.customerType">{{formDate.customerType == 0
                    ? "未知"
                    : formDate.customerType == 1
                    ? "微信用户"
                    : "企微用户"}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">建档时间</span>
                    <span class="valueTxt">{{formDate.createTime
                    ? formatDate(formDate.createTime, "yyyy-MM-dd hh:mm:ss")
                    : "-"}}</span>
                  </div>
                </div>
              </section> -->
              <!-- 基本信息 end -->

              <!-- 企业信息 start -->
              <!-- <section>
                <div class="table_head">
                  <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                  企业信息
                </div>
                <div class="table_box">
                  <div class="rowTable">
                    <span class="keyText">企业名称</span>
                    <span class="valueTxt" :title="formDate.cropFullName">{{formDate.cropFullName}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">企业简称</span>
                    <span class="valueTxt" :title="formDate.customerName">{{formDate.customerName}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">企业规模</span>
                    <span class="valueTxt" :title="formDate.cropscale">{{formDate.cropscale}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">行业领域</span>
                    <span class="valueTxt" :title="formDate.cropSubIndustry">{{formDate.cropSubIndustry}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">固定电话</span>
                    <span class="valueTxt" :title="formDate.mobil">{{formDate.mobil}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">办公地址</span>
                    <span class="valueTxt" :title="formDate.address">{{formDate.address}}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">备注</span>
                    <span class="valueTxt" :title="formDate.remark">{{formDate.remark }}</span>
                  </div>
                </div>
              </section> -->
              <!-- 企业信息 end -->

              <!-- 联系人信息 start -->
              <!-- <section>
                <div class="table_head">
                  <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                  联系人信息
                </div>
                <div class="table_box">
                  <div class="rowTable">
                    <span class="keyText">联系人</span>
                    <span class="valueTxt">{{ formDate.name }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">手机号</span>
                    <span class="valueTxt">{{ formDate.phone }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">微信昵称</span>
                    <span class="valueTxt">{{ formDate.weixin }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">微信号</span>
                    <span class="valueTxt">{{ formDate.weixin }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">头像</span>
                    <span class="valueTxt">
                      <img :src="formDate.avatar" alt="" v-if="formDate.avatar" />
                    </span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">性别</span>
                    <span class="valueTxt">{{
                  formDate.gender == "-" ||
                  formDate.gender == "0" ||
                  formDate.gender == ""
                    ? "未知"
                    : formDate.gender == "1"
                    ? "男"
                    : "女"
                }}</span>
                  </div>

                  <div class="rowTable">
                    <span class="keyText">职务</span>
                    <span class="valueTxt">{{ formDate.position }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">邮箱</span>
                    <span class="valueTxt" :title="formDate.email">{{
                  formDate.email
                }}</span>
                  </div>
                </div>
              </section> -->
              <!-- 联系人信息 end -->

              <!-- 自定义信息 start -->
              <!-- <section v-show="userDefinedList.length > 0">
                <div class="table_head">
                  <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                  自定义信息
                </div>
                <div class="table_box">
                  <div class="rowTable" v-for="(item,index) in userDefinedList" :key="index">
                    <span class="keyText" :title="item.name">{{item.name}}</span>
                    <span class="valueTxt">{{ item.value }}</span>
                  </div>
                </div>
              </section> -->
              <!-- 自定义信息 end -->

              <!-- 系统信息 start -->
              <!-- <section>
                <div class="table_head">
                  <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                  系统信息
                </div>
                <div class="table_box">
                  <div class="rowTable">
                    <span class="keyText">添加人员</span>
                    <span class="valueTxt">{{ formDate.createBy }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">添加客户时间</span>
                    <span class="valueTxt">{{
                  formDate.createTime
                    ? formatDate(formDate.createTime, "yyyy-MM-dd hh:mm:ss")
                    : "-"
                }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">前负责人</span>
                    <span class="valueTxt">{{ formDate.beBelongBy }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">转换时间</span>
                    <span class="valueTxt">{{
                  formDate.turnTime
                    ? formatDate(formDate.turnTime, "yyyy-MM-dd hh:mm:ss")
                    : "-"
                }}</span>
                  </div>

                </div>
              </section> -->
              <!-- 系统信息 end -->

              <!-- 企微信息 start -->
              <!-- <section v-show="formDate.externalType !== 0">
                <div class="table_head">
                  <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                  <span> {{formDate.externalType == 2 ? '企微好友信息' :  '微信好友信息'}}</span>
                </div>
                <div class="table_box">
                  <div class="rowTable">
                    <span class="keyText">微信昵称</span>
                    <span class="valueTxt">{{ formDate.weixin }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">微信号</span>
                    <span class="valueTxt">{{ formDate.weixin }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">头像</span>
                    <span class="valueTxt">
                      <img :src="formDate.avatar" alt="" v-if="formDate.avatar" />
                    </span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">性别</span>
                    <span class="valueTxt">{{
                  formDate.gender == "-" ||
                  formDate.gender == "0" ||
                  formDate.gender == ""
                    ? "未知"
                    : formDate.gender == "1"
                    ? "男"
                    : "女"
                }}</span>
                  </div>

                  <div class="rowTable">
                    <span class="keyText">职务</span>
                    <span class="valueTxt">{{ formDate.position }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">邮箱</span>
                    <span class="valueTxt" :title="formDate.email">{{
                  formDate.email
                }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">添加人员</span>
                    <span class="valueTxt" :title="formDate.createBy">{{
                  formDate.createBy
                }}</span>
                  </div>
                  <div class="rowTable">
                    <span class="keyText">添加时间</span>
                    <span class="valueTxt">{{
                    formDate.createTime
                    ? formatDate(formDate.createTime, "yyyy-MM-dd hh:mm:ss")
                    : "-"
                }}</span>
                  </div>
                </div>
              </section> -->
              <!-- 企微信息 end -->

            </div>
          </el-col>
          <el-col :span="8">
            <div class="r_continer">

              <Updata v-if="isUpData" :type="formDate.type"></Updata>

              <div class="table_head">
                <img src="../../assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span v-if="type == 1 || type == 2">线索动态</span>
                <span v-if="type == 3 || type == 4">客户动态</span>
              </div>
              <div class="allInfo">
                <span v-for="(item,index) in navList" @click="fnChangeAll(index)" :class="{'textBtn':isShowAll == index}" :key="index">{{item}}</span>
              </div>
              <div class="timeLine">
                <el-timeline>
                  <el-timeline-item v-for="(item, index) in timeLineList" :key="index" color="#4168F6" type="danger ">
                    <div class="recordBox">
                      <div class="inLine">
                        <span class="descTxt">{{ item.optName }}</span>
                        <span class="time_right">
                          <img src="../../assets/images/icon_time@2x.png" alt="" />
                          {{ formatDate(item.createTime, "yyyy-MM-dd hh:mm:ss") }}
                        </span>
                      </div>
                      <div class="inLineTwo" v-if="item.title != '编辑'">
                        <span class="opt_name" v-if="noNameList.indexOf(item.optType) == -1">{{item.optUserName}}</span>
                        {{ $getTextFun(item) }}
                      </div>
                      <div v-if="item.punckStatus == 1 && item.title == '编辑' || item.punckStatus == 3" class="inLineTwo">
                        <div v-if="item.optType == 21">
                          <div v-for="(i, iIndex) in JSON.parse(item.context)" :key="iIndex + i">
                            <p v-for="(j, jIndex) in Object.keys(i)" :key="jIndex + j" v-show="j.substr(0, 2) != '历史'" class="item-data">
                              <span class="keys">{{ j }}: </span>
                              <span>{{ Object.values(i)[jIndex] }}</span>
                            </p>
                            <p v-for="(j, jIndex) in Object.keys(i)" :key="jIndex + j + 1" v-show="j.substr(0, 2) == '历史'"
                               class="item-data history-text">
                              <span class="keys">{{ '(' + j }}: </span>
                              <span>{{ Object.values(i)[jIndex] + ')' }}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="inLineEnd">操作人：{{ item.userName }}</div> -->
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </el-col>
        </div>
      </el-row>
      <div v-if="followDialog">
        <FollowUp :followDialog="followDialog" @shutDown="closeDialog"></FollowUp>
      </div>
      <div v-if="editCules">
        <!-- <EditCules :addCule="editCules" @closeAddCule="closeAddCule"></EditCules> -->
        <ClueEditDialog v-model="editCules" @sure="getData"></ClueEditDialog>
      </div>
      <!-- 线索转客户 -->
      <div v-if="transferPeople">
        <TransferCustomer v-model="transferPeople" :isPrev="isCus" @back="toCustomerBackFun" @sure="backListFun"></TransferCustomer>
        <!-- <TransferDialog :transferPeople="transferPeople" @closetransferPeople="closetransferPeople">
        </TransferDialog> -->
      </div>
      <div v-if="changeDialog">
        <ChangePeople :changeDialog="changeDialog" @closeChange="closeChange"></ChangePeople>
      </div>
      <div v-if="distrDialog">
        <Distribution :distrDialog="distrDialog" @closeDistribution="closeDistribution">
        </Distribution>
      </div>
      <div v-if="customEdit">
        <CustomEdit :customEdit="customEdit" :id="formDate.clueCustomerNo" :name="formDate.customerCalled" @closecustomEdit="closecustomEdit" @validateName="openValidNameDialog"></CustomEdit>
      </div>
      <div v-if="helperEdit">
        <HelperEdit :helperEdit="helperEdit" :type="formDate.type" @closehelperEdit="closehelperEdit"></HelperEdit>
      </div>
      <div v-if="isManTag">
        <el-dialog title="提示" :visible.sync="dialogVisible" width="736px" :before-close="handleClose">
          <EditManTag :personList="personList"></EditManTag>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- 新增客户检测相似客户弹窗 -->
    <AddCustomerDialog v-model="dialog_add" :type="formDate.type" :name="formDate.customerCalled" @sure="addCustomerDialogFun"></AddCustomerDialog>
    <SeekDialog v-model="dialog_box" :type="formDate.type" :id="formDate.clueCustomerNo" :name="formDate.customerCalled" @sure="openDialog"></SeekDialog>
  </div>
</template>
<script>
import FollowUp from './component/FollowUp.vue'
import EditCules from './component/EditCules.vue'
import TransferDialog from './component/TransferDialog.vue'
import ChangePeople from './component/ChangePeople.vue'
import Distribution from './component/Distribution.vue'
import CustomEdit from './component/CustomEdit.vue'
import { formatDate } from '../../utils/tool'
import EditManTag from './tagsComponent/EditManTag.vue'
import HelperEdit from './component/EditHelper.vue'
import Updata from './component/UpData.vue'
import StageList from './component/BusinessOpportunities/stageList'
import {
  DetailBasicInfo,ClueEditDialog,SeekDialog,TransferCustomer,AddCustomerDialog
} from './component'
import {
  cluecustomer_getClueCustomerByNo,
  clueCustomerFollowUser_selectFollowMsgList,
  cluecustomer_giveUpType,
  cluecustomer_getclue,
  cluecustomer_delClueCustomer,
  queryClue_customers,      //获取相似客户 （转客户用）
} from '@/api/customer'
export default {
  components: {
    FollowUp,
    EditCules,
    TransferDialog,
    ChangePeople,
    Distribution,
    CustomEdit,
    EditManTag,
    HelperEdit,
    Updata,
    StageList,
    DetailBasicInfo,
    ClueEditDialog,
    SeekDialog,TransferCustomer,AddCustomerDialog
  },
  data() {
    return {
      noNameList: [57,70,72],
      dialog_add: false,
      dialog_box: false,
      isTip: true,
      isAll: '',
      isDuXie: '',
      timeAll: '',
      isUpData: false,
      dialogVisible: false,
      isManTag: false,
      isShowActive: null,
      title: '',
      items: [],
      itemsOnlyDu: [],
      itemsDuXie: [],
      formDate: {
        externalType: '', //企微和微信
        customerCalled: '', //客户名称
        avatar: '',
        remark: '',
        name: '', //联系人
        phone: '',
        address: '',
        position: '',
        weixin: '',
        gender: '',
        email: '',
        cropFullName: '',
        cropSubIndustry: '',
        source: '',
        sourceName: '',
        describe: '',
        createBy: '',
        createTime: '',
        uname: '',
        getTime: '',
        followRecord: '',
        followTime: '',
        updateBy: '',
        updateTime: '',
        beBelongBy: '',
        turnTime: '',
        customerName: '',
        cropscale: '',
        customerType: '',
        externalName: '',
        externalType: '',
        externalCorpName: '',
        externalCorpFullName: '',
        externalGender: '',
        externalPosition: '',
        stage: '',
        externalSource: '',
        externalSourceName: '',
        isWcCus: '',
      },
      userDefinedList: [],
      isShowAll: 0,
      timeLineList: [],
      followDialog: false,
      editCules: false,
      transferPeople: false,
      changeDialog: false,
      type: this.$route.query.type,
      female: null,
      distrDialog: false,
      customEdit: false,
      helperEdit: false,
      tagList: [
        // { name: 'hahha' },
        // { name: '啊飞洒飞洒发' },
        // { name: '是个复读生' },
        // { name: '立刻脚后跟' },
        // { name: '八十多岁的给' },
        // { name: '3213' },
        // { name: '4324' },
        // { name: '55VF' },
        // { name: 'VFDSB' },
        // { name: 'BDYYYYGB' },
        // { name: 'BDG4B' },
        // { name: '34' },
        // { name: '43BGDB' },
        // { name: 'BG43434FB' },
        // { name: '543' },
      ],
      personList: [
        // { name: '立刻脚后跟' },
        // { name: '八十多岁的给' },
        // { name: '3213' },
        // { name: '4324' },
        // { name: '55VF' },
        // { name: 'VFDSB' },
        // { name: 'BDYYYYGB' },
        // { name: 'BDG4B' },
        // { name: '34' },
      ],
      followUserlist: [],
      nicheTotal: 0,  //商机数量
      validName: '',
      isCus: true,
    }
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
    navList(){
      let str = Number(this.formDate.type) > 2 ? '客户动态' : '线索动态'
      let list = ['全部',str,'跟进记录','其他']
      return list
    },
  },
  created() {
    this.isAll = this.$route.query.isAll
    // console.log(this.isAll)
    // console.log(typeof this.isAll)
    this.getAllData()

    // console.log('----query---', JSON.parse(this.$route.query.expandedKeys))
  },
  mounted() {
    let _this = this
    _this.$nextTick(() => {
      _this.getTimeList('')
    })
  },
  // 父组件中返回要传给下级的数据
  provide() {
    return {
      getAllData: this.getAllData,
    }
  },
  methods: {
    formatDate,
    getTotalFun(val){   //获取商机数量
      this.nicheTotal = val
    },
    addNicheFun(){  //新增商机弹窗
      this.$refs.stage.handleEdit()
    },
    getData(){  //获取所有数据
      this.getAllData()
      this.getTimeList()
    },
    genBtnData(data) {
      let list = JSON.parse(this.$route.query.expandedKeys) || []
      let isWcCus = data.clueCustomerVO.isWcCus
      // console.log('=====>>>>isWcCus', data, isWcCus)
      this.items = [
        {
          name: '写跟进',
          icon: require('../../assets/images/icon_repair2.png'),
          icon1: require('../../assets/images/icon_repair1.png'),
          showHide: list.some((item) => item.enName == 'write'),
        },
        {
          name: '编辑',
          icon: require('../../assets/images/icon_edit1.png'),
          icon1: require('../../assets/images/icon_edit2.png'),
          showHide: list.some((item) => item.enName == 'edit'),
        },
        {
          name: '转客户',
          icon: require('../../assets/images/icon_change1.png'),
          icon1: require('../../assets/images/icon_change2.png'),
          showHide: list.some((item) => item.enName == 'turn'),
        },
        {
          name: '变更负责人',
          icon: require('../../assets/images/icon_change11.png'),
          icon1: require('../../assets/images/icon_change22.png'),
          showHide: list.some((item) => item.enName == 'change'),
        },
        {
          name: '编辑协助人',
          icon: require('../../assets/images/icon_xiezuo.png'),
          icon1: require('../../assets/images/icon_xiezuo.png'),
          showHide: list.some((item) => item.enName == 'change'),
        },
        {
          name: '放弃',
          icon: require('../../assets/images/icon_clear1.png'),
          icon1: require('../../assets/images/icon_clear2.png'),
          showHide: list.some((item) => item.enName == 'giveup'),
        },
        {
          name: '删除',
          icon: require('../../assets/images/icon_delete1.png'),
          icon1: require('../../assets/images/icon_delete2.png'),
          showHide: list.some((item) => item.enName == 'delete') && !isWcCus,
        },
        {
          name: '分配',
          icon: require('../../assets/images/icon_share1.png'),
          icon1: require('../../assets/images/icon_share2.png'),
          showHide: list.some((item) => item.enName == 'allot'),
        },
        {
          name: '领取',
          icon: require('../../assets/images/icon_like1.png'),
          icon1: require('../../assets/images/icon_like2.png'),
          showHide: list.some((item) => item.enName == 'get'),
        },
      ]
    },
    genBtnDataOnlyDu() {
      let list = JSON.parse(this.$route.query.expandedKeys) || []
      this.items = []
    },
    genBtnDataDuXie() {
      let list = JSON.parse(this.$route.query.expandedKeys) || []
      this.items = [
        {
          name: '写跟进',
          icon: require('../../assets/images/icon_repair2.png'),
          icon1: require('../../assets/images/icon_repair1.png'),
          showHide: list.some((item) => item.enName == 'write'),
        },
        {
          name: '编辑',
          icon: require('../../assets/images/icon_edit1.png'),
          icon1: require('../../assets/images/icon_edit2.png'),
          showHide: list.some((item) => item.enName == 'edit'),
        },
      ]
    },
    genBtnDataAllCus() {
      let list = JSON.parse(this.$route.query.expandedKeys) || []
      this.items = [
        {
          name: '分配',
          icon: require('../../assets/images/icon_change11.png'),
          icon1: require('../../assets/images/icon_change22.png'),
          showHide: true,
        },
        {
          name: '编辑协助人',
          icon: require('../../assets/images/icon_xiezuo.png'),
          icon1: require('../../assets/images/icon_xiezuo.png'),
          showHide: true,
        },
      ]
    },
    getAllData() {
      //线索详情
      let obj = {
        no: this.$route.query.customno,
      }
      cluecustomer_getClueCustomerByNo(obj).then((res) => {
        if (res.result) {
          let data = res.data
          let isDuXie = res.data.permFlag
          let isAll = this.isAll
          console.log('this.isAll>>>', isAll)
          if (isDuXie == '2' && !isAll) {
            this.genBtnDataOnlyDu() //只读
            this.isUpData = false
          } else if (isDuXie == '1' && !isAll) {
            this.genBtnDataDuXie() //读写
            this.isUpData = true
          } else if (isDuXie == '0' && !isAll) {
            this.genBtnData(data) //全部按钮
            this.isUpData = true
          } else if (isAll == '1') {
            this.genBtnDataAllCus() //全部客户唯二按钮
            this.isUpData = true
          }
          /*测试时放开*/
          /*    	this.genBtnData() 
            this.isUpData= true*/
          /*测试时放开*/
  
          // if (this.type == 1 || this.type == 2) {
          //   this.title = data.clueCustomerVO.name
          // } else {
          //   this.title = data.clueCustomerVO.customerCalled
          // }
          if (data.clueCustomerVO.gender !== '-') {
            this.female = data.clueCustomerVO.gender
          }
          this.formDate = data.clueCustomerVO
          this.followUserlist = data.followUserlist

          let tempColum = res.data.clueCustomerVO.corpCustomColumnMap
          this.userDefinedList = []
          res.data.columnValueNameList.forEach((item) => {
            let obj = {}
            obj.name = item.columnName
            if (tempColum) {
              obj.value = tempColum[item.columnValue]
            } else {
              obj.value = ''
            }
            this.userDefinedList.push(obj)
          })
        }
      })
    },
    getTimeList() {
      var obj = {
        clueCustomerNo: this.$route.query.customno,
        punckStatus: 0,
        queryFlag: this.isShowAll == 0 ? '' : this.isShowAll == 4 ? 3 : this.isShowAll  // ''：全部，1：客户/线索动态，2：跟进记录，3：其他
      }
      clueCustomerFollowUser_selectFollowMsgList(obj).then((res) => {
        if (res.result) {
          let list = res.data.dataList.records
          if(list && list.length > 0){
            list.forEach(el => {
              el.fromUser = el.fromUser ? JSON.parse(el.fromUser) : el.fromUser
              el.toUser = el.toUser ? JSON.parse(el.toUser) : el.toUser
              if(el.optType == 21){
                el.context = JSON.parse(el.context)
              }
            })
          }
          this.timeLineList = list
        }
      })
    },
    fnSelectBtn(item, index) {
      console.log(item)
      this.isShowActive = index
      if (item.name == '写跟进') {
        this.followDialog = true
      } else if (item.name == '编辑') {
        console.log(this.type)
        if (this.type == 1 || this.type == 2) {
          this.editCules = true
        } else {
          this.customEdit = true
        }
      } else if (item.name == '转客户') {
        let data = {
          searchParam: this.formDate.customerCalled,
          corpId: this.corpId,
          type: '3',
          // isFriend: 0,
          page: 1,
          limit: 20,
        }
        this.isCus = true
        console.log('asd',data)
        // return false
        queryClue_customers(data).then(res => {
          if(res.result){
            let data = res.data
            console.log(data.preciseData.length,data.dimData.total)
            if(data.preciseData.length == 0 && data.dimData.total == 0 ){
              this.isCus = false
              this.transferPeople = true
            }else{
              this.isCus = true
              this.dialog_box = true
            }
          }
        })
        // this.transferPeople = true
      } else if (item.name == '变更负责人') {
        this.changeDialog = true
      } else if (item.name == '编辑协助人') {
        this.helperEdit = true
      } else if (item.name == '放弃') {
        this.givUp()
      } else if (item.name == '删除') {
        this.deleteClue()
      } else if (item.name == '领取') {
        this.receive()
      } else if (item.name == '分配') {
        this.distrDialog = true
      }
    },
    openDialog(){   //转客户弹窗确定后
      this.transferPeople = true
    },
    toCustomerBackFun(){  //线索转客户返回
      this.dialog_box = true
    },
    backListFun(){    //转客户成功跳转线索列表
      this.$router.replace('/customerManagement/account')
    },
    openValidNameDialog(val){  //编辑客户校验客户名相似性
      console.log('asd')
      this.validName = val
      this.dialog_add = true
    },
    addCustomerDialogFun(val){   //新增客户名称校验完成回调
      console.log('确定',val)
      this.formDate.customerCalled = val
      this.customEdit = true
    },
    closeDialog() {
      this.followDialog = false
      this.getAllData()
    },
    closeAddCule() {
      this.editCules = false
      this.getAllData()
    },
    closetransferPeople(v) {
      if (v == 2) {
        this.$router.go(-1)
      }
      this.transferPeople = false
    },
    closeChange(v) {
      if (v == 2) {
        this.$router.go(-1)
      }
      this.changeDialog = false
    },
    closehelperEdit(v) {
      if (v == 2) {
        this.$router.go(-1)
      }
      this.helperEdit = false
    },
    closeDistribution(v) {
      this.distrDialog = false
      if (v == 2) {
        this.$router.go(-1)
      }
    },
    closecustomEdit(v) {
      this.customEdit = false
      this.getAllData()
    },
    givUp() {
      const h = this.$createElement
      this.$confirm('', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        customClass: 'culesDliongError',
        type: 'error',
        title: '放弃警告',
        message: h('p', null, [
          h('div', { style: 'font-size:14px' }, '是否放弃返回到公海？ '),
          h(
            'div',
            { style: 'font-size:12px' },
            '* 放弃到公海后，此客户数据将属于公共资源，原归属人员不能 再维护跟进和更新此客户数据。'
          ),
        ]),
      })
        .then(() => {
          let data = {
            clueCustomerNo: this.$route.query.customno,
            type: this.$route.query.type,
          }
          cluecustomer_giveUpType(data).then((res) => {
            if (res.result) {
              this.$router.go(-1)
              this.$message({
                type: 'success',
                message: '操作成功',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消',
          })
        })
    },
    receive() {
      console.log(this.type)
      let text
      this.type == 2
        ? (text = '是否确认领取所选择的线索?')
        : (text = '是否确认领取所选择的客户')
      const h = this.$createElement
      this.$confirm('', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        customClass: 'clueConfirmClass',
        type: 'warning',
        title: '领取提示',
        message: h('p', null, [
          h('div', { style: 'font-size:14px;font-weight:600' }, text),
          h('div', { style: 'font-size:12px' }, '确认申领该条资源吗？'),
        ]),
      })
        .then(() => {
          let data = {
            clueCustomerNo: this.$route.query.customno,
            type: this.$route.query.type,
          }
          cluecustomer_getclue(data).then((res) => {
            if (res.result) {
              this.$router.go(-1)
              this.$message({
                type: 'success',
                message: '操作成功',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消',
          })
        })
    },
    deleteClue() {
      this.$confirm('是否确认删除并返回', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'clueConfirmClass',
        type: 'error',
        customClass: 'clueConfirmClass',
      })
        .then(() => {
          let data = {
            clueCustomerNo: this.$route.query.customno,
          }
          cluecustomer_delClueCustomer(data).then((res) => {
            if (res.result) {
              this.$router.go(-1)
              this.$message({
                type: 'success',
                message: '已删除',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消',
          })
        })
    },
    fnChangeAll(i) {
      this.isShowAll = i
      this.getTimeList()
    },
    goback() {
      this.$router.go(-1)
    },
    modifyTag() {
      console.log('-----修改企业标签------')
      /*this.editManTag = true*/
      console.log('-----修改标签------')
      this.editTag = true
    },
    clickEditManTag() {
      console.log('-----修改个人标签------')
      this.isManTag = true
      this.dialogVisible = true
    },
  },
  filters: {
    avatar(val){
      return val ? val.substring(0,1) : ''
    }
  },
}
</script>
<style lang="less" scoped>
.myCluesWarp {
  .goback {
    margin: 0 0 16px 0;
    color: #4168f6;
    font-family: 600;
    img {
      width: 8px;
      height: 12px;
      vertical-align: middle;
    }
  }
  .detailHeader {
    // padding: 0 16px;
    // min-height: 138px;
    // background: #ffffff;
    border-radius: 8px;
    .top_warp {
      // height: 118px;
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      .top_info{
        width: 100%;
        display: flex;
        // align-items: center;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 12px;
          text-align: center;
          position: relative;
          &.bg{
            background: @main;
          }
          .img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          span{
            display: block;
            font-size: 20px;
            color: @white;
            line-height: 50px;
          }
          .logo{
            width: 18px;
            height: 18px;
            position: absolute;
            right: -3px;
            bottom: -3px;
          }
        }
        .val{
          width: calc(100% - 62px);
          .title_box{
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            .tit{
              font-size: 18px;
              line-height: 24px;
              color: @fontMain;
              font-weight: bold;
            }
            .gender{
              margin-left: 4px;
              width: 16px;
              height: 16px;
            }
            .select{
              margin-left: 8px;
              font-size: 12px;
              line-height: 20px;
              background: @main;
              color: @white;
              border-radius: 10px;
              text-align: center;
              padding: 0 10px;
            }
          }
          .other{
            width: 100%;
            display: flex;
            .text_item{
              max-width: 25%;
              display: flex;
              // align-items: center;
              font-size: 14px;
              line-height: 20px;
              color: @fontSub2;
              margin-right: 32px;
              &:last-child{
                margin-right: 0;
              }
              .label{
                margin-right: 8px;
                white-space: nowrap;
              }
              .text{
                // max-width: calc(100% - 100px);
                width: fit-content;
                word-break: break-all;
              }
            }
          }
        }
      }
    }
    .titleBox {
      font-size: 16px;
      font-weight: 500;
      color: #3c4353;
      .green {
        font-size: 14px;
        display: inline-block;
        color: #52bd94;
        margin-right: 8px;
      }
      .yellow {
        font-size: 14px;
        display: inline-block;
        color: #ffb020;
        margin-right: 8px;
      }
      img {
        width: 14px;
        height: 14px;
      }
      float: left;
    }
    .txtCompany {
      // margin-top: 16px;
      width: 100%;
      display: flex;
      margin-bottom: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #838a9d;
      span {
        display: inline-block;
        margin-right: 32px;
      }
    }
    .tag_content {
      border-top: 1px solid #f0f2f7;
      margin-top: 18px;
      .enterpriseTag,
      .personTag {
        display: flex;
        border-bottom: 1px solid #f0f2f7;
        font-size: 10px;
        padding: 15px 0;
        .groupName {
          border: none;
          width: 60px;
          word-wrap: break-word;
          word-break: normal;
        }
        .tagStyle {
          // margin-left: 20px;
          width: 85%;
          .creatTag {
            background: #fafbff;
            display: inline-block;
            color: #838a9d;
            text-align: center;
            line-height: 20px;
            font-size: 10px;
            height: 22px;
            border: 1px solid #d9dae4;
            margin-left: 8px;
            padding: 0 8px;
            border-radius: 4px;
            margin-bottom: 8px;
          }
        }
        .modify {
          margin-left: 52px;
        }
      }
    }

    .operatBtn {
      margin-top: 16px;
      display: flex;
      img {
        width: 14px;
        height: 14px;
      }
      .active {
        background: rgba(65, 104, 246, 0.04) !important;
        border-color: #4168f6 !important;
        color: #4168f6 !important;
      }
      .box {
        cursor: pointer;
        padding: 0 15px;
        font-size: 14px;
        color: #3c4353;
        min-width: 76px;
        height: 32px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #d9dae4;
        margin-right: 16px;
        text-align: center;
        line-height: 32px;
      }
    }
  }
  .el-row {
    margin-left: 0 !important;
    // background: #ffffff;
    // padding-bottom: 16px;
  }
  .boxWarp {
    overflow-x: auto;
    height: 658px;
    background: #ffffff;
    border-radius: 8px;
    margin-top: 16px;
    padding: 16px;
    // display: flex;
    .table_head {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      img {
        position: relative;
        top: 4px;
      }
    }
    .l_continer {
      // width: 100%;
      // margin-right: 16px;
      // width: 704px;
      .table_box {
        margin-top: 16px;
        margin-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .rowTable {
          display: inherit;
          width: 50%;
          font-size: 14px;
          color: #3c4353;
          span {
            display: inline-block;
            line-height: 32px;
          }
          .keyText {
            width: 30%;
            // width: 112px;
            height: 32px;
            background: #fafbff;
            border: 1px solid #f0f2f7;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .valueTxt {
            color: #838a9d;
            padding-left: 16px;
            // width: 240px;
            width: 70%;
            height: 32px;
            line-height: 32px;
            border: 1px solid #f0f2f7;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            img {
              width: 24px;
              height: 24px;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .r_continer {
      // width: 50%;
      .allInfo {
        margin: 20px 0;
        span {
          display: inline-block;
          line-height: 20px;
          padding: 0 8px;
          vertical-align: middle;
          text-align: center;
          color: #3c4353;
          font-size: 14px;
          cursor: pointer;
          position: relative;
          &:not(:first-child)::before {
            content: '';
            width: 1px;
            height: 70%;
            background-color: #3c4353;
            position: absolute;
            left: 0;
            top: 15%;
          }
        }
        .textBtn {
          color: #4168f6;
        }
      }
      .el-timeline {
        padding-left: 0 !important;
      }
      .recordBox {
        // width: 462px;
        // min-height: 108px;
        background: rgba(65, 104, 246, 0.06);
        border-radius: 8px;
        color: #3c4353;
        padding: 16px;
        .inLine {
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          .time_right {
            font-size: 12px;
            color: #838a9d;
          }
          img {
            width: 10px;
            height: 10px;
          }
        }
        .inLineTwo {
          margin-bottom: 8px;
          display: inline-block;
          word-break: normal;
          word-break: break-all;
          word-break: keep-all;
          word-break: break-word;
          .opt_name{
            margin-right: 8px;
          }
          .item-data {
            margin-bottom: 8px;
            .keys {
              margin-bottom: 8px;
            }
          }
          .history-text {
            color: #a2a5b4;
          }
        }
        .inLineCard {
          .inlineRow {
            margin-bottom: 8px;
            span:nth-child(1) {
              display: inline-block;
              margin-right: 8px;
            }
          }
        }
        .inLineEnd {
          text-align: right;
        }
        .descTxt {
          font-size: 14px;
          font-weight: 600;
          color: #3c4353;
        }
      }
    }
  }
}
.userBox {
  width: 100%;
  height: 54px;
  line-height: 54px;
}
.userImg {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  float: left;
  margin-right: 20px;
}
.el-message-box__status .el-icon-warning {
  color: #4168f6 !important;
}
.el-table td {
  border-bottom: 1px solid #ebeef5 !important;
}
/deep/.el-table--scrollable-x ::-webkit-scrollbar {
  display: none;
}
</style>