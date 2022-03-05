<template>
  <div v-loading="loading">
    <div class="goAack" @click="goaBack">
      <img class="left-img" src="../../assets/images/goback.png" alt="" />
      <span class="back-text">返回</span>
    </div>
    <el-card>
      <div style="width: 810px">
        <el-row>
          <div class="hed-liveness">
            <el-col :span="24"
              ><div class="">
                <span class="leng"></span>
                <span class="overview family-Medium">新增群发</span>
                <!-- <span class="liveness family-Regular">查看今日活跃账户</span> -->
              </div></el-col
            >
          </div>
        </el-row>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="任务名称 :" prop="name" label-width="120px">
            <el-input
              v-model.trim="ruleForm.name"
              show-word-limit
              :onkeyup="(ruleForm.name = ruleForm.name.replace(/\s+/g, ''))"
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="groupListwind"
            label="选择群发员工: "
            prop="region"
            label-width="120px"
          >
            <el-select
              multiple
              v-model="ruleForm.region"
              placeholder="请选择群发员工（可多选）"
              v-loadmore="loadMore"
              @visible-change="groupStaffset"
              @change="groupStaff"
            >
              <!-- <el-option label="区域一" value="shanghai"></el-option> -->
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.userNo"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="选择群发客户: "
            prop="resource"
            label-width="120px"
            class="groupListwind"
          >
            <el-radio-group v-model="ruleForm.resource" @change="groudSend">
              <el-radio :label="2">全部客户</el-radio>
              <el-radio :label="1">筛选客户</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item>
            <h1 v-if="ruleForm.resource == 1">11111</h1>
          </el-form-item> -->
          <el-form-item>
            <div v-if="ruleForm.resource == 1">
              <div class="screen_group">
                <el-form-item label="性别:">
                  <el-radio-group
                    v-model="ruleForm.gender"
                    @change="radioGender"
                  >
                    <el-radio :label="null">全部</el-radio>
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                    <el-radio :label="0">未知</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="添加时间:">
                  <el-date-picker
                    v-model="datalist"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="addchangeDate"
                  >
                    >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="所在群聊: ">
                  <el-select
                    class="group_name"
                    v-model="ruleForm.group"
                    multiple
                    placeholder="请选择所在群聊 （可多选）"
                    @change="groupchat"
                    v-loadmore="loadMoreGroup"
                  >
                    <!-- <el-option label="区域一" value="shanghai1"></el-option> -->
                    <el-option
                      v-for="item in groupinList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.chatId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客户标签:">
                  <div
                    class="customer"
                    :class="
                      customerList == '' || customerList == undefined
                        ? 'h32'
                        : 'h_auto'
                    "
                    @click.stop="customerClick"
                  >
                    <span
                      class="hint_tite"
                      v-if="customerList == '' || customerList == undefined"
                      >请按照标签筛选客户</span
                    >
                    <div
                      class="tage_name"
                      v-for="(item, index) in customerList"
                      :key="index"
                    >
                      <span>{{ item.name }}</span>
                      <span
                        class="delete_img pointer"
                        @click.stop="tagtName(item, index)"
                      >
                        <img
                          style="width: 12px; height: 12px; margin-left: 5px"
                          src="../../assets/images/Shutdown.png"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            :class="ruleForm.resource == 1 ? 'sent_grop' : 'sent_warp'"
          >
            <p class="client_sends">
              预计发送客户数量:
              <span class="sends_num">{{ screenGroupnum }}</span>
            </p>
          </el-form-item>
          <el-form-item label="发送规则:" prop="regulat" label-width="120px">
            <el-radio-group v-model="ruleForm.regulat">
              <el-radio :label="1">立即发送</el-radio>
              <el-radio :label="2">定时发送</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="活动时间:"
            required
            v-if="ruleForm.regulat == 2"
            label-width="120px"
          >
            <div class="activity_time">
              <el-form-item prop="timingdata">
                <el-date-picker
                  :picker-options="pickerOption"
                  placeholder="选择日期"
                  v-model="ruleForm.timingdata"
                  class="select_day"
                  value-format="yyyy-MM-dd"
                  @change="activityday"
                ></el-date-picker>
              </el-form-item>

              <el-form-item prop="timingTime">
                <el-time-picker
                  :editable="false"
                  placeholder="选择时间"
                  v-model="ruleForm.timingTime"
                  class="select_time"
                  value-format="HH:mm:ss"
                  @change="activitytime"
                ></el-time-picker>
              </el-form-item>
            </div>
          </el-form-item>
          <el-row>
            <div class="hed-liveness">
              <el-col :span="24"
                ><div class="">
                  <span class="leng"></span>
                  <span class="overview family-Medium">群发消息</span>
                  <span class="liveness family-Regular"
                    >注意：客户每个月最多接收来自同一企业的管理员的 4
                    条群发消息，4条消息可在同一天发送。</span
                  >
                </div></el-col
              >
            </div>
          </el-row>
          <el-form-item label="群发内容:">
            <el-input
              type="textarea"
              placeholder="请输入文字内容"
              v-model="ruleForm.desc"
              show-word-limit
              maxlength="500"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!--  新增素材列表 -->
            <div>
              <ComponenMaterial
                :single="index"
                :newAddTech="newAddbut"
                :itemInfo="item"
                :allList="wordsList"
                :lode="loading"
                @fnDelete="fnDelete"
                @childEvent="childEvent"
                @getType="getTypeFun"
                v-for="(item, index) in wordsList"
                :key="index"
              />
              <!-- <ComponentMaterialTwo
                :list="addUploadList"
                @save="getAddData"
              ></ComponentMaterialTwo> -->
            </div>
          </el-form-item>
          <el-form-item v-if="this.wordsList.length < 9">
            <div class="flex center_add">
              <div class="codeBtn pointer" @click="newAddTech">
                <img src="../../assets/images/icon_add@2x.png" alt="" />
                新增素材内容
              </div>
              <span class="tite_add"
                ><span
                  >（最多可添加 <span>{{ this.wordsList.length }}</span
                  >/
                </span>
                9<span>个附件</span>）</span
              >
            </div>
          </el-form-item>

          <el-form-item>
            <div class="inform_send pointer" @click="submitForm('ruleForm')">
              通知成员发送
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 客户标签弹框 -->
      <div v-if="groupAddUp">
        <GroupAdd
          :groupVisible="groupAddUp"
          :tabeList="customerList"
          @groupVisibleFrom="groupVisibledata(arguments)"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// 客户标签弹框

import GroupAdd from "../../components/groupPopout/customergroup.vue";
import { formatDate } from "../../utils/tool";
// 新增素材内容
import ComponenMaterial from "./ComponentMaterial.vue";
import ComponentMaterialTwo from "./ComponentMaterialTwo.vue";
export default {
  components: {
    GroupAdd,
    ComponenMaterial,
    ComponentMaterialTwo,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //8.64e7当前时间可以选择  8.64e6当前时间不可选
        },
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //8.64e7当前时间可以选择  8.64e6当前时间不可选
        },
      },
      addUploadList: [], //新增上传列表
      groupPage: 1,
      grouplimit: 10,
      // 删选
      qungroupPage: 1,
      loading: true,
      qungrouplimit: 10,
      ruleForm: {
        name: "", //任务名称
        region: [], //选择群发员工
        resource: "", //选择群发客户
        regulat: 1, //发送规则
        timingdata: "", //设定时间日期
        timingTime: "", //设定时间

        gender: null, //性别
        type: [],
        addEndTime: "", //筛选结束时间
        addStarTime: "", //筛选开始时间
        desc: "",
        group: [],
      },
      datalist: [], //添加时间
      fileList: [],
      groupinList: [], //所在群聊
      customerList: [], // 获取客户标签：
      groupList: [], //获取群发员工接口数据
      grouprst: [], //获取选择群发员工数据
      customerlistdata: [],
      groupStaffsetShow: true, //获取选择群发员工下拉框取消展示
      newAddbut: false, //新增素材
      groupAddUp: false, //客户标签弹框
      allGroupnum: "", //全部客户
      imgList: [], //新增图片
      urlList: [], //新增链接
      screenGroupnum: 0, //删选客户数量
      clueCustomerLists: [],
      rules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],

        region: [
          { required: true, message: "请选择群发员工", trigger: "change" },
        ],
        timingdata: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        timingTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择发送客户", trigger: "change" },
        ],
        regulat: [
          { required: true, message: "请选择发送规则", trigger: "change" },
        ],
        // desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      wordsList: [
        // {
        // text: "",
        // imageUrl: "",
        // pdf: "",
        // url: "",
        // activeIndex: "image",
        // },
        //  { listurl:[],}
      ],
      //  listUrl:[],
       imgArrUrl:[],
      dateList: [],
      tagidList: [],
      loading: false,
      csList: [],
      validList: [],
      shareUrlOrigin: '',
      attachmentType: 'image',
      // materObj: {},
      // jsonData: {
      //   lableList: [],
      //   gender: "",
      //   addEndTime: "",
      //   addStartTime: "",

      //   groupList: [],
      //   lableList: [],
      //   groupDataList: [],
      // },
      scType: "",
    };
  },
  created() {
    this.chooseCustomerMass(); //获取群发员工接口
    this.chooseCustomerGroup(); //获取所在群聊接口
    console.log(this.$route.query.id, "新增");
    // console.log(this.ruleForm.resource, "==========");
    // console.log("==========");
    this.childEvent();
  },
  watch: {
    "ruleForm.resource": function (val, oldval) {
      // console.log(val );
      if (val == 1) {
        this.Screeningcustomer();
        // console.log(1111);
        (this.ruleForm.gender = ""), //性别
        (this.ruleForm.addStarTime = ""),
        (this.ruleForm.addEndTime = ""),
        (this.groupDataList = []),
        (this.customerlistdata = []);
      } else {
        // console.log(2222);
        this.Screeningcustomer();
      }
    },
  },
  methods: {
    getAddData(val) {
      console.log("add upload data", val);
    },
    getTypeFun(data) {
      console.log("val", data);
      this.scType = data;
    },
    loadMoreGroup() {
      console.log("所在群聊");
      this.qungroupPage++;
      this.groupStaffset();
    },
    loadMore() {
      this.groupPage++;
      this.chooseCustomerMass();
    },
    childEvent(data) {
      console.log(data);
      // this.$network
      //   .get("/customer-service/oss/uploadfileparam", {})
      //   .then((res) => {
      //     console.log(res);
      //   });
    },
    // 返回
    goaBack() {
      this.$router.go(-1);
    },
    shanxuangroup() {
      console.log(this.groupDataList, "-------this.customerlistdata");
      let listGroup = this.grouprst;
      let _data = {
        userList: listGroup,
        gender: this.ruleForm.gender, //性别
        addEndTime: this.ruleForm.addEndTime,
        addStartTime: this.ruleForm.addStarTime,

        groupList: this.groupDataList || [],
        lableList: this.customerlistdata || [],
      };
      // console.log(
      //   "_data",
      //   JSON.parse(JSON.stringify(_data)),
      //   this.customerlistdata,
      //   this.csList
      // );
      // return false;
      this.$network
        .post("/customer-service/cluecustomerMass/customerScreen", _data)
        .then((res) => {
          console.log(res);
          this.clueCustomerLists = res.data.clueCustomerList;
          this.screenGroupnum = res.data.estimateNum;
        });
    },
    // shanxuangroup1() {
    //   let listGroup = this.grouprst;
    //   let _data = {
    //     userList: listGroup,
    //     gender: this.ruleForm.gender, //性别
    //     addEndTime: this.ruleForm.addEndTime,
    //     addStartTime: this.ruleForm.addStarTime,

    //     groupList: this.groupDataList || [],
    //     lableList: this.csList,
    //   };
    //   this.$network
    //     .post("/customer-service/cluecustomerMass/customerScreen", _data)
    //     .then((res) => {
    //       console.log(res);
    //       this.clueCustomerLists = res.data.clueCustomerList;
    //       this.screenGroupnum = res.data.estimateNum;
    //     });
    // },
    // 客户标签弹框  显示
    customerClick() {
      this.groupAddUp = true;
    },
    // 客户标签弹框 隐藏
    groupVisibledata(valDta) {
      this.groupAddUp = false;

      this.customerList = valDta[0];
      this.customerlistdata = valDta[1];
      // console.log(valDta);
      this.customerList.forEach((item) => {
        this.validList.push(item.tagid);
      });
      // let listto = this.customerlistdata;
      // this.jsonData.lableList.groutList = ["111"];
      // console.log(this.validList, "this.jsonData.lableList.groutList");
      let listGroup = this.grouprst;
      let _data = {
        userList: listGroup,
        gender: this.ruleForm.gender, //性别
        addEndTime: this.ruleForm.addEndTime,
        addStartTime: this.ruleForm.addStarTime,
        lableList: this.validList || [],
        groupList: this.groupDataList || [],
      };
      this.$network
        .post("/customer-service/cluecustomerMass/customerScreen", _data)
        .then((res) => {
          console.log(res);
          this.clueCustomerLists = res.data.clueCustomerList;
          this.screenGroupnum = res.data.estimateNum;
        });
      // console.log(listto, "8888888888888");
      // this.shanxuangroup1();
    },
    // 获取添加时间
    addchangeDate(val) {
      if (val == null) {
        this.ruleForm.addStarTime = "";
        this.ruleForm.addEndTime = "";
      }
      // console.log(val);
      this.ruleForm.addStarTime = val[0] + " " + "00:00:00";
      this.ruleForm.addEndTime = val[1] + " " + "00:00:00";
      // console.log(this.ruleForm.datalist);
      this.Screeningcustomer();
    },
    // 获取活动时间
    activityday(val) {
      console.log(val);
      this.ruleForm.timingdata = val;
    },
    activitytime(val) {
      console.log(val);
      this.ruleForm.timingTime = val;
    },
    // 点击提交验证
    submitForm(formName) {

   



       console.log(this.wordsList, "----wordsList");
     
this.wordsList.forEach((item,indexs)=>{
 console.log(item,"-----item")
 console.log(item.objList.articleId,"-----item.objList.tab")
      let imgArr = []
      if (window.location.origin == 'https://console.jzcrm.com') {
        this.shareUrlOrigin = 'https://h5.jzcrm.com'
      } else {
        this.shareUrlOrigin = 'https://test-h5.jzcrm.com'
      }
  
        if (item.objList.tab == 1) {
          imgArr = [
            {
              urls: `${this.shareUrlOrigin}/materialTemplate?materialId=${item.objList.articleId}&type=${item.objList.tab}`,
              ...item.objList,
            },
          ]
            console.log(imgArr,"---l素材 ",this.shareUrlOrigin)
        } else if (item.objList.tab == 2) {
          imgArr = [
            {
              url: `${this.shareUrlOrigin}/materialTemplate?materialId=${item.objList.documentId}&type=${item.objList.tab}`,
              ...item.objList
            },
          ]
        } else {
          imgArr = [item.objList]
        }
      // }
      // console.log(imgArr,"---l ")
       this.imgArrUrl = imgArr
         this.imgArrUrl.forEach(item=>{
         console.log(item,"---------l")
         this.wordsList[indexs].listurl = item.urls
      })
      })
   
     
 
      console.log( this.wordsList,"---++通知")
      this.$refs[formName].validate((valid) => {
        if (this.screenGroupnum == 0) {
          this.$confirm("当前选择客户为空,请检查客户筛选条件", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "remindicont",
            type: "warning",
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "请重新删选",
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        }
        if (valid) {
          console.log(this.wordsList, "------this.wordsList");
     
          let list = this.wordsList.map((item) => {
            return {
              url: item.image,
              objectname: item.text,
            };
          });

          let templist = this.wordsList.map((item) => {
            // return {
            // type: item.activeIndex,
            // this.urlList.push(item[item.activeIndex]);

            this.urlList.push(item.url);
            if (
              !this.$httpReg(item.url) ||
              !this.$linkReg(item.url) ||
              item.url == ""
            ) {
              // this.$message({
              //   message: "请填写正确的链接地址格式",
              //   type: "error",
              // });
            }

            // };
          });

      let imgList =[],listLink = [],mediaLink = []
          this.wordsList.forEach(el => {
            console.log('asd',el)
            if(el.activeIndex == 'sucai'){
              let obj = {
                desc: el.mediaDesc,
              picurl: el.meiapicul,
              title:el.mediatite,
              url:el.listurl,
              type:el.mediatype
              };
              // if(el.mediatite){
                mediaLink.push(obj)
              // }
            }
            if(el.activeIndex == 'url'){
              let obj = {
                desc: el.urldigest,
                picurl: el.linkImgUrl,
                title:el.urltite,
                url:el.url
              };
              // if(el.url){
                  listLink.push(obj)
              // }
              
            }

          })

          
  // let listLink = this.wordsList.map((item) => {
  //           return {
  //             desc: item.urldigest,
  //             picurl: item.linkImgUrl,
  //             title:item.urltite,
  //             url:item.url
  //           };
  //         });
  // let mediaLink = this.wordsList.map((item) => {
  //           return {
  //             desc: item.mediaDesc,
  //             picurl: item.meiapicul,
  //             title:item.mediatite,
  //             url:item.listurl,
  //             type:item.mediatype
  //           };
  //         });
     
          let params = {
            taskName: this.ruleForm.name,
            massType: 1,
            massContent: this.ruleForm.desc,
            userList: this.grouprst,
            gender: this.gender,
            addStartTime: this.ruleForm.addStarTime,
            addEndTime: this.ruleForm.addEndTime,
            groupList: this.groupDataList || [],
            lableList: this.customerlistdata || [],
            sendType: this.ruleForm.regulat,
            sendTime: this.ruleForm.timingdata + " " + this.ruleForm.timingTime,
            urlList: listLink,// this.urlList
            allCustomer: this.ruleForm.resource,
            fileList: list,
            customerList: this.clueCustomerLists,
            mediaList:mediaLink
          };
          // console.log('---this.wordsList----', params)
          this.$network
            .post(
              "/customer-service/cluecustomerMass/addCustomerScreen",
              params
            )
            .then((res) => {
              // this.$router.go(-1);
              // this.$message({
              //   type: "success",
              //   message: "新增成功",
              // });
              console.log(res);
              if (res.result) {
                this.$message({
                  type: "success",
                  message: "新增发送成功",
                });
                this.$router.push({
                  path: "/interactivemarketing/customergroup",
                });
              }
              // this.$emit('closeAddDialog')
            });
          // }
          // }
        }
      });
    },
    filterList(list) {
      const p = list.map((item) => {
        // if (item[item.activeIndex] == "") {
        //   this.$message({
        //     type: "error",
        //     message: "请完善话术内容",
        //   });
        //   return false;
        // }
        // else {
        return true;
        // }
      });
      return p;
    },
    //点击删除客户标签
    tagtName(list, indexs) {
      console.log(list.tagid, "---------点击id");
      // console.log(this.customerList, "-------点击删除");
      console.log(this.customerlistdata, "-------customerlistdata");
      let custlist = this.customerlistdata;

      // console.log(custlist);
      custlist.forEach((item, index) => {
        if (item == list.tagid) {
          custlist.splice(index, 1);
        }
      });
      console.log(custlist);

      this.customerList.forEach((item, index) => {
        // console.log(item.tagid);
        // this.tagidList.push(item.tagid);
        if (list.id == item.id) {
          this.customerList.splice(index, 1);
          // console.log(this.customerList, "------tagid");
        }
      });
      this.shanxuangroup();
      // console.log(this.tagidList + "------------id");
    },
    // 点击新增素材按钮
    newAddTech() {
      if (this.wordsList.length < 9) {
        this.wordsList.push({
          text: "",
          image: "",
          sucai: "",
          url: "",
          urltite:"",
          urldigest:"",
          activeIndex: "image",
          linkImgUrl:"",
          mediaDesc:"",
          meiapicul:'',
          mediatite:"",
          mediatype:"",
          url:"",
          objList:{},
          listurl:"",
        });
        this.newAddbut = true;
      }
    },
    fnDelete(index) {
      // console.log('2222222222------------', index, this.wordsList)
      // if (this.wordsList.length > 1) {
      this.wordsList.splice(index, 1);
      // }
    },
    // 选择所在群聊
    groupStaffset(value) {
      let groutList = this.grouprst;
      if (value == false) {
        this.$network
          .post(
            `/customer-service/cluecustomerMass/chooseCustomerGroup`,
            // groutList
            {
              // params: {
              page: this.qungroupPage,
              limit: this.qungrouplimit,
              userList: groutList,
              // },
            }
          )
          .then((res) => {
            if (res.data.groupList == []) {
            } else {
              let tempList = res.data.groupList;
              let cent = this.groupinList.concat(tempList);

              this.groupinList = cent;
              // this.groupinList = cent;
              // console.log(this.groupinList.concat(tempList));
            }
          });
      }
    },
    groupStaff(value) {
      // console.log(value);
      console.log("000-")
     console.log(this.groupList)
      this.grouprst = value;
       this.Screeningcustomer();
    },
    // 获取选择群发员工接口
    chooseCustomerMass() {
      this.$network
        .get("/customer-service/cluecustomerMass/chooseCustomerMass", {
          page: this.groupPage,
          limit: this.grouplimit,
        })
        .then((res) => {
          if (res.data.list == []) {
            this.loading = false;
          } else {
            let tempList = res.data.list;
            this.loading = false;
            let cent = this.groupList.concat(tempList);
            console.log(this.groupList.concat(tempList));
            this.groupList = cent;
          }
        });
    },
    // 获取所在群聊接口 grouprst
    chooseCustomerGroup() {
      console.log(this.grouprst, "-------------------");
      console.log(111, "-------------------");
    },
    //获取所在群聊
    groupchat(valdata) {
      console.log(valdata);
      this.groupDataList = valdata;
      this.shanxuangroup();
    },
    //筛选客户接口
    Screeningcustomer() {
      if (this.ruleForm.resource == 2) {
        let listGroup = this.grouprst;
        this.$network
          .post("/customer-service/cluecustomerMass/customerScreen", {
            userList: listGroup,
            gender: "", //性别
            addEndTime: "",
            addStartTime: "",

            groupList: [],
            lableList: [],
          })
          .then((res) => {
            console.log(res);
            this.clueCustomerLists = res.data.clueCustomerList;
            this.screenGroupnum = res.data.estimateNum;
          });
      } else {
        let listGroup = this.grouprst;
        this.$network
          .post("/customer-service/cluecustomerMass/customerScreen", {
            userList: listGroup,
            gender: this.ruleForm.gender, //性别
            addEndTime: this.ruleForm.addEndTime,
            addStartTime: this.ruleForm.addStarTime,

            groupList: this.groupDataList || [],
            lableList: this.customerlistdata || [],
          })
          .then((res) => {
            console.log(res);
            this.clueCustomerLists = res.data.clueCustomerList;
            this.screenGroupnum = res.data.estimateNum;
          });
      }
    },

    //
    // loadMore() {
    //   // 这里写入要触发的方法
    // },
    // 获取性别

    radioGender(value) {
      console.log(value);
      this.ruleForm.gender = value;
      this.Screeningcustomer();
    },
    //选择群发客户
    groudSend(value) {
      this.ruleForm.resource = value;
      console.log(value);
    },
  },
};
</script>
<style  lang="less" scoped>
/deep/.el-input__inner{
line-height: 32px;
}
/deep/.el-textarea {
  .el-input__count {
    height: 26px;
    background: none;
  }
  textarea {
    height: 232px;
  }
}
// .groupter{}
// 头部
.groupListwind {
  /deep/.el-form-item__label {
    white-space: nowrap;
  }

}
.hed-liveness {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid rgba(240, 242, 247, 1);
  margin-bottom: 16px;
}
.leng {
  width: 2px;
  height: 14px;
  background: #4168f6;
  display: inline-block;
  vertical-align: sub;
}
.overview {
  font-size: 14px;
  font-weight: 600;
  color: #3c4353;
  margin: 0 8px;
}
.liveness {
  font-weight: 400;
  color: #838a9d;
  font-size: 12px;
}
.goAack {
  margin-bottom: 16px;
  cursor: pointer;
}

.left-img {
  width: 8px;
  height: 12px;
}
.back-text {
  font-size: 16px;
  color: #4168f6;

  font-weight: 600;
  margin-left: 5px;
}
.el-card {
  height: 100%;
}
.el-col {
  display: flex;
}
// .groupListwind{
  /deep/.el-input__inner,
.el-input--suffix {
  width: 678px;
  height: 32px;
}
// }

.el-input {
  width: 98%;
}
//表单样式
.client_sends {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
  // margin-top: 35px;
  margin-left: 25px;
}
.sends_num {
  font-size: 14px;
  color: #4168f6;
  letter-spacing: 0;
  font-weight: 400;
}
.sent_warp {
  margin-top: -30px;
  height: 40px;
}
.sent_grop {
  // margin-top: -60px;
  height: 40px;
}
.screen_group {
  width: 704px;
  // height: 244px;
  background: #fafbff;
  border: 1px solid #d9dae4;
  border-radius: 4px;
  margin-left: 20px;
  padding: 16px 16px 0 0;
  box-sizing: content-box;
  /deep/.el-form-item {
    margin-bottom: 10px;
  }
}
.el-range-editor.el-input__inner {
  width: 602px;
  padding: 0 10px;
}
.group_name {
  /deep/.el-input__inner {
    width: 602px;
  }
}
.h32 {
  height: 32px;
}
.h_auto {
  padding: 10px;
}
.sent_num {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
}
.customer {
  width: 602px;
  // height: 32px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  line-height: 32px;
  padding-left: 15px;
  box-sizing: border-box;
}
.hint_tite {
  font-size: 14px;
  color: #c0c4cc;
  letter-spacing: 0;
  font-weight: 400;
}
.delete_img {
  display: inline-block;
}
.tage_name {
  background: #fafbff;
  border: 1px solid #d9dae4;
  border-radius: 4px;
  font-size: 14px;
  color: #c0c4cc;
  font-weight: 400;
  padding: 0 8px;
  margin-right: 8px;
  display: inline-block;
  margin-bottom: 10px;
}
.activity_time {
  display: flex;
}
.select_day {
  /deep/ .el-input__inner {
    width: 180px;
  }
}
.select_time {
  /deep/ .el-input__inner {
    width: 128px;
  }
}
.center_add {
  align-items: center;
}
.tite_add {
  font-size: 14px;
  color: #c0c4cc;
  letter-spacing: 0;
  font-weight: 400;
}
.codeBtn {
  width: 132px;
  height: 32px;
  background: rgba(65, 104, 246, 0.04);
  border-radius: 4px;
  border: 1px solid #4168f6;
  text-align: center;
  color: #4168f6;
  line-height: 32px;

  img {
    width: 12px;
    height: 12px;
  }
}
.inform_send {
  width: 132px;
  height: 32px;
  background: #4168f6;
  border-radius: 4px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  border: 1px solid transparent;
}
</style>