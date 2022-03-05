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
                <span class="overview family-Medium">标签建群</span>
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
              maxlength="30"
              :onkeyup="(ruleForm.name = ruleForm.name.replace(/\s+/g, ''))"
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
              placeholder="请选择群发员工 （可多选）"
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
                    :picker-options="pickerOptions"
                  >
                    >
                  </el-date-picker>
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
          <el-form-item label="入群引导语:" prop="desc">
            <el-input
              type="textarea"
              placeholder="请输入群引导语～"
              v-model="ruleForm.desc"
              show-word-limit
              maxlength="300"
            ></el-input>
          </el-form-item>
          <el-form-item class="hide">
            <div class="enclosure_box">
              <div
                class="e_item"
                v-for="(item, index) in addData.sopContentAttachmentVOS"
                :key="index"
              >
                <div class="label">二维码{{ index + 1 }}：</div>
                <div class="val">
                  <div
                    class="delete_btn"
                    @click="deleteEnclosureFun(index, item)"
                  >
                    删除
                  </div>
                  <div class="e_line">
                    <div class="e_val">
                      <el-radio
                        class="radio"
                        v-model="item.attachmentType"
                        label="1"
                        >图片</el-radio
                      >
                    </div>
                  </div>
                  <div class="labetArea">
                    <el-form-item>
                      <el-select
                        v-model="item.tupeLab"
                        @change="labelGroupList(item)"
                      >
                        <!-- <el-option label="区域一" value="shanghai"></el-option> -->
                        <el-option
                          v-for="item in groupListData"
                          :label="item.name"
                          :value="item.chatId"
                          :key="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="upload_wrap" v-if="item.attachmentType == '1'">
                    <div class="upload_row flex">
                      <div class="upload_box">
                        <div class="img_box" v-if="item.url">
                          <img :src="item.url" alt="" />
                        </div>
                        <div class="upload" v-else>
                          <div class="icon_box">
                            <div class="icon"></div>
                            <div class="text">上传图片</div>
                          </div>
                          <input
                            class="file"
                            type="file"
                            @change="
                              uploadFun(
                                $event,
                                'images',
                                'label',
                                'png,jpg,jpeg',
                                '2',
                                index
                              )
                            "
                            accept=".png,.jpg,.jpeg"
                          />
                        </div>
                      </div>

                      <div class="afresh_file" v-if="item.url">
                        <span class="pointer">重新上传</span
                        ><input
                          class="file"
                          type="file"
                          @change="
                            uploadFun(
                              $event,
                              'images',
                              'label',
                              'png,jpg,jpeg',
                              '2',
                              index
                            )
                          "
                          accept=".png,.jpg,.jpeg"
                        />
                      </div>
                    </div>
                    <div class="upload_tips">
                      群当前可加用户
                      <!-- <span class="nump">{{ groupUserNum }}</span> 人 -->
                      <span class="nump">{{ item.groupUserNum }}</span> 人
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <el-form-item>
              <div class="flex center_add">
                <div class="codeBtn pointer" @click="addEnclosureFun">
                  <img src="../../assets/images/icon_add@2x.png" alt="" />
                  新增企微群码
                </div>
                <!-- <span class="tite_add"
                  ><span
                    >（最多可添加
                    <span>{{ addData.sopContentAttachmentVOS.length }}</span
                    >/
                  </span>
                  9<span>个附件</span>）</span
                > -->
              </div>
              <p class="client_send">
                实际发送客户数量:
                <span class="sends_num">{{ fleltDatanum }}</span>
                <span class="colordata"
                  >（已在群聊中的客户将不会收到邀请）</span
                >
              </p>
            </el-form-item>
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
// import ComponenMaterial from "./ComponentMaterial.vue";

export default {
  components: {
    GroupAdd,
    // ComponenMaterial,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      //   pickerOptions: {
      //     disabledDate(time) {
      //       return time.getTime() < Date.now() - 8.64e7; //8.64e7当前时间可以选择  8.64e6当前时间不可选
      //     },
      //   },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //8.64e7当前时间可以选择  8.64e6当前时间不可选
        },
      },
      addUploadList: [], //新增上传列表
      userdataList:[],
      loading: true,
      groupUserNum: 0,
      groupPage: 1,
      grouplimit: 10,
      // 删选
      qungroupPage: 1,
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
      addData: {
        name: "",
        promptTime: "",
        promptTimeMsg: "",
        content: "",
        modifyType: "", //insert-新增，update-修改，delete-删除

        pushType: "1", //推送类型
        m: "30",
        d: "1",
        timeType: "M",
        time: "12:00",
        form: {
          name: "",
          region: "",
          date1: "",
          date2: "",
          delivery: false,
          type: [],
          resource: "",
          desc: "",
        },
        sopContentAttachmentVOS: [],
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
      clueCustomerListTo: [],
      groupListData: [],
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
        desc: [{ required: true, message: "请输入群引导语", trigger: "blur" }],
      },
      wordsList: [
        // {
        // text: "",
        // imageUrl: "",
        // pdf: "",
        // url: "",
        // activeIndex: "image",
        // },
      ],
      listAll: [],
      dateList: [],
      tagidList: [],
      dataGroup: [],

      csList: [],
      groupListDataCopy: [],
      validList: [],
      jsonData: {
        lableList: [],
        gender: "",
        addEndTime: "",
        addStartTime: "",

        groupList: [],
        lableList: [],
        groupDataList: [],
      },
      fleltDatanum: 0,
      scType: "",
    };
  },
  created() {
    this.chooseCustomerMass(); //获取群发员工接口
    this.chooseCustomerGroup(); //获取所在群聊接口
    this.getGroupInfoList();
    // this.tagFilterCustomers();
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
        console.log(1111);
        // this.ruleForm.gender = "";
        (this.ruleForm.addStarTime = ""),
          (this.ruleForm.addEndTime = ""),
          (this.groupDataList = []),
          (this.customerlistdata = []);
      } else {
        console.log(2222);
        this.Screeningcustomer();
      }
    },
  },
  methods: {
    getGroupInfoList() {
      this.$network
        .get("/customer-service/tagEstablishGroup/chooseTagGroupSend")
        .then((res) => {
          if (res.result) {
            this.groupListData = res.data;
            this.groupListDataCopy = res.data;
            console.log(res);
            this.loading = false;
          } else {
          }
        });
    },
    tagFilterCustomers() {
      this.$network
        .post("/customer-service/tagEstablishGroup/tagFilterCustomers", {
          clueCustomerList: this.clueCustomerLists,
          groupList: this.listAll,
        })
        .then((res) => {
          console.log(res);
          this.fleltDatanum = res.data.estimateNum;
          this.clueCustomerListTo = res.data.clueCustomerList;
          //   this.$set(this.fleltDatanum, "showDisabled", true);
        });
    },

    labelGroupList(value) {
      console.log(this.addData.sopContentAttachmentVOS);
      console.log(value.tupeLab);
      //   this.listAll = [];
      //   console.log("---1------", this.listAll);
      //   this.listAll.push(value.tupeLab);
      let list = this.addData.sopContentAttachmentVOS.map(
        (item) => item.tupeLab
      );
      this.listAll = list;
      console.log("---222----", list);
      this.tagFilterCustomers();

      this.groupListData.forEach((item, it) => {
        if (item.chatId == value.tupeLab) {
          console.log(item.groupUserNum);
          value.groupUserNum = item.groupUserNum;
        }
      });

      //
    },

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
      // let listGroup = this.grouprst;
      let listGroup = this.userdataList;
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
        .post("/customer-service/tagEstablishGroup/tagCustomerScreen", _data)
        .then((res) => {
          console.log(res);
          this.clueCustomerLists = res.data.clueCustomerList;
          this.screenGroupnum = res.data.estimateNum;
        });
    },

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
      this.validList = [];
      this.customerList.forEach((item) => {
        this.validList.push(item.tagid);
      });
      // let listto = this.customerlistdata;
      // this.jsonData.lableList.groutList = ["111"];
      console.log(this.validList, "this.jsonData.lableList.groutList");
      // let listGroup = this.grouprst;
      let listGroup = this.userdataList;
      let _data = {
        userList: listGroup,
        gender: this.ruleForm.gender, //性别
        addEndTime: this.ruleForm.addEndTime,
        addStartTime: this.ruleForm.addStarTime,
        lableList: this.validList || [],
        groupList: this.groupDataList || [],
      };
      this.$network
        .post("/customer-service/tagEstablishGroup/tagCustomerScreen", _data)
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
      console.log(val);
      this.ruleForm.addStarTime = val[0] + " " + "00:00:00";
      this.ruleForm.addEndTime = val[1] + " " + "23:59:59";
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
      // let templist = this.wordsList.map((item) => {
      //   this.urlList.push(item.url);
      //   if (!this.$httpReg(item.url) || !this.$linkReg(item.url)) {
      //     this.$message({ message: "请填写正确的链接地址格式", type: "error" });
      //   }

      //   // };
      // });
      console.log(this.addData.sopContentAttachmentVOS, "----");

      this.$refs[formName].validate((valid) => {
        if (this.fleltDatanum == 0) {
          this.$confirm("当前选择客户为空,请检查客户筛选条件", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
 customClass: "remindicon",
            type: "warning",
          })
            .then(() => {
              this.$message({
                type: "error",
                message: "请重新删选",
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        } else {
          if (valid) {
            console.log(this.wordsList, "------this.wordsList");
            // let list = [];
            // let obj = {};
            // this.wordsList.forEach((item) => {
            //   if (item.type == "image") {
            //     obj.url = item.image;
            //     obj.Objectname = item.text || "";
            //     list.push(obj);
            //   }
            // });
            let list = this.addData.sopContentAttachmentVOS.map((item) => {
              return {
                url: item.url,
                objectname: item.objectName,
                chatId: item.tupeLab,
              };
            });
            console.log(list, "11111");
            this.dataGroup = [];
            let templist = this.addData.sopContentAttachmentVOS.forEach(
              (item) => {
                this.dataGroup.push(item.tupeLab);
              }
            );

            let params = {
              taskName: this.ruleForm.name,
              massType: null,
              massContent: this.ruleForm.desc,
              userList: this.grouprst,
              gender: this.ruleForm.gender,
              addStartTime: this.ruleForm.addStarTime,
              addEndTime: this.ruleForm.addEndTime,
              groupList: this.dataGroup, //this.groupDataList || [],
              lableList: this.customerlistdata || [],
              sendType: this.ruleForm.regulat,
              sendTime:
                this.ruleForm.timingdata + " " + this.ruleForm.timingTime,
              urlList: this.urlList || [],
              allCustomer: this.ruleForm.resource,
              fileList: list,
              customerList: this.clueCustomerListTo, //this.clueCustomerLists,
            };
            // console.log('---this.wordsList----', params)
            this.$network
              .post(
                "/customer-service/tagEstablishGroup/addTagCustomerScreen",
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
                    path: "/customerManagement/lableGroup",
                  });
                }
                // this.$emit('closeAddDialog')
              });
            // }
            // }
          }
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
    addEnclosureFun(i) {
      //添加附件
      let _data = {
        attachmentType: "1",
        content: "",
        cover: "",
        sopContentId: "",
        title: "",
        url: "",
        urlAbstract: "",
        fileName: "",
        fileSize: "",
        objectName: "",
        modifyType: "insert",
        tupeLab: "",
        groupUserNum: 0,
      };
      if (!this.addData.sopContentAttachmentVOS) {
        this.addData.sopContentAttachmentVOS = [];
      }
      this.addData.sopContentAttachmentVOS.push(_data);
      console.log(this.addData.sopContentAttachmentVOS);
      let tempList = JSON.parse(JSON.stringify(this.groupListData));
      this.addData.sopContentAttachmentVOS.forEach((val) => {
        tempList.forEach((item, index) => {
          if (val.tupeLab == item.chatId) {
            tempList.splice(index, 1);
          }
        });
      });
      this.groupListData = tempList;
    },
    // 点击新增素材按钮
    newAddTech() {
      if (this.wordsList.length < 9) {
        this.wordsList.push({
          text: "",
          image: "",
          pdf: "",
          url: "",
          activeIndex: "image",
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

    // 获取选择群发员工接口
    chooseCustomerMass() {
      this.$network
        .get("/customer-service/tagEstablishGroup/chooseTagCustomerMass", {
          page: this.groupPage,
          limit: this.grouplimit,
        })
        .then((res) => {
          if (res.data.list == []) {
          } else {
            let tempList = res.data.list;

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
    groupStaff(value) {

     var groupData =[]
        //  console.log(this.groupList)
         this.groupList.forEach(el =>{
           if(value.includes(el.userNo) ){
                groupData.push(el)
           }
         })
        //  console.log(groupData,"0000")
        this.userdataList = groupData

      this.grouprst = value;
      console.log(value);
      this.Screeningcustomer();
      console.log(this.grouprst);
      if (value.length == 0) {
        this.screenGroupnum = 0;
      }
    },
    //筛选客户接口
    Screeningcustomer() {
      console.log(this.grouprst);
      if (this.ruleForm.resource == 2) {
        let listGroup = this.grouprst;
        this.$network
          .post("/customer-service/tagEstablishGroup/tagCustomerScreen", {
            userList: this.userdataList,
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
        // let listGroup = this.grouprst;
        let listGroup = this.userdataList;
        this.$network
          .post("/customer-service/tagEstablishGroup/tagCustomerScreen", {
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
    deleteEnclosureFun(i, item) {
      console.log(i, item, "------");
      this.groupUserNum = 0;
      this.groupListDataCopy.forEach((val) => {
        if (val.chatId == item.tupeLab) {
          this.groupListData.push(val);
        }
      });
      console.log(this.groupListData);
      //删除附件
      this.addData.sopContentAttachmentVOS.splice(i, 1);
    },
    uploadFun(e, fileType, type, accept, size, index) {
      //文件上传
      let fileName = e.target.files[0].name;
      let fileSize = e.target.files[0].size;
      this.$uploadFun(e, fileType, type, size, accept).then((res) => {
        console.log(res);
        if (res) {
          this.addData.sopContentAttachmentVOS[index].url = res.url;
          this.addData.sopContentAttachmentVOS[index].objectName =
            res.objectname;
          this.addData.sopContentAttachmentVOS[index].fileName = fileName;
          this.addData.sopContentAttachmentVOS[index].fileSize =
            this.$filterSize(fileSize);
        }
      });
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
@main: #4168f6;
@white: #fff;
@fontMain: #3c4353;
@red: #d14343;
/deep/.el-input__inner{
  line-height: 32px !important;
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
input {
  font-size: 0;
}
.colordata {
  font-size: 14px;
  color: #c0c4cc;
}
// .groupter{}
.nump {
  width: 58px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #d9dae4;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  line-height: 28px;
  color: #000;
  margin: 0 10px;
}
.btn_add {
  display: inline-block;
  width: 132px;
  height: 32px;
  background: rgba(65, 104, 246, 0.04);
  border-radius: 4px;
  border: 1px solid @main;
  color: @main;
  padding-left: 32px;
  position: relative;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(65, 104, 246, 0.1);
  }
  .icon {
    width: 12px;
    height: 12px;
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
  }
  .text {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #4168f6;
    display: inline-block;
  }
}
.add_box {
  display: flex;
  align-items: center;
  margin-top: 16px;
  .tips {
    margin-left: 8px;
    color: #c0c4cc;
    font-size: 14px;
    line-height: 20px;
  }
}
// 头部
.labetArea {
  position: absolute;
  left: 50%;
  /deep/.el-input__inner {
    width: 132px;
  }
}
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
  vertical-align: leng;
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
/deep/.el-input__inner,
.el-input--suffix {
  width: 702px;
  height: 32px;
}
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
.client_send {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
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
.enclosure_box {
  width: 100%;
  .e_item {
    width: 100%;
    line-height: 20px;
    font-size: 14px;
    display: flex;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .label {
      //   width: 48px;
      margin-left: -60px;
      color: #3c4353;
      white-space: nowrap;
    }
    .val {
      //   width: calc(100% - 48px);
      margin-bottom: 10px;
      width: 376px;
      min-height: 100px;
      border: 1px solid #d9dae4;
      border-radius: 4px;
      padding: 16px;
      position: relative;
      .delete_btn {
        height: 20px;
        font-size: 14px;
        color: #3c4353;
        position: absolute;
        right: 16px;
        top: 16px;
        padding-left: 18px;
        cursor: pointer;
        &::before {
          content: "";
          width: 14px;
          height: 14px;
          background: url("../../assets/images/icon_delete@2x.png") no-repeat;
          background-size: 100%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .e_line {
        width: 100%;
        display: flex;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 16px;
        .e_tit {
          width: 84px;
          color: #3c4353;
          margin-right: 16px;
        }
        .e_val {
          width: calc(100% - 100px);
          .radio {
            margin-right: 16px;
          }
        }
      }
    }
  }
  .upload_wrap {
    width: 100%;
    .upload_row {
      display: flex;
      align-items: flex-end;
      margin-bottom: 16px;
      font-size: 0;
      .afresh_file {
        cursor: pointer;
        margin-left: 16px;
        height: 20px;
        font-size: 14px;
        color: #4168f6;
        position: relative;

        .file {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
    .upload_box {
      width: 128px;
      height: 128px;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      font-size: 0;
      .img_box {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .upload {
        width: 100%;
        height: 100%;
        border: 1px dashed #d9dae4;
        border-radius: 4px;
        text-align: center;
        padding-top: 34px;
        position: relative;
        .icon_box {
          .icon {
            width: 24px;
            height: 24px;
            margin-bottom: 16px;
            position: relative;
            display: inline-block;
            &::before {
              content: "";
              width: 2px;
              height: 100%;
              background: #c0c4cc;
              position: absolute;
              left: 50%;
              top: 0;
              transform: translateX(-50%);
            }
            &::after {
              content: "";
              height: 2px;
              width: 100%;
              background: #c0c4cc;
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
            }
          }
          .text {
            height: 20px;
            font-size: 14px;
            color: #c0c4cc;
            text-align: center;
          }
        }
        .file {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
    .upload_tips {
      height: 20px;
      font-size: 14px;
      color: #c0c4cc;
    }
  }
  .link_wrap {
    width: 100%;
    .input_box {
      width: 100%;
    }
  }
}
</style>