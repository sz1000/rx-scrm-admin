<template>
  <div>
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
                <span class="overview family-Medium">编辑群发</span>
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
          <el-form-item label="任务名称:" prop="taskName">
            <el-input
              v-model="ruleForm.taskName"
              show-word-limit
              maxlength="30"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择群主:" prop="region" label-width="120px">
            <el-select
              multiple
              class="group"
              v-model="ruleForm.region"
              placeholder="请选择群发员工 （可多选）"
              @change="groupStaff"
            >
              <!-- <el-option label="区域一" value="shanghai"></el-option> -->
              <el-option
                v-for="(item, index) in groupList"
                :key="index"
                :label="item.owmerName"
                :value="item.chatId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发送规则:" prop="sendType" label-width="120px">
            <el-radio-group v-model="ruleForm.sendType">
              <el-radio :label="1">立即发送</el-radio>
              <el-radio :label="2">定时发送</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动时间" required v-if="ruleForm.sendType == 2">
            <div class="activity_time">
              <el-form-item prop="date1">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="ruleForm.timingdata"
                  class="select_day"
                  value-format="yyyy-MM-dd"
                  @change="activityday"
                ></el-date-picker>
              </el-form-item>

              <el-form-item prop="date2">
                <el-time-picker
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
              placeholder="欢迎您加入哈哈哈哈哈哈，一起加油吧~"
              v-model="ruleForm.massContent"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!--  新增素材列表 -->
            <div class="enclosure_box">
              <div
                class="e_item"
                v-for="(item, index) in fujianList"
                :key="index"
              >
                <!-- <div class="label">附件{{ index + 1 }}：</div> -->
                <div class="val">
                  <div class="delete_btn" @click="deleteEnclosureFun(index)">
                    删除
                  </div>
                  <div class="e_line">
                    <div class="e_tit">选择素材类型</div>
                    <div class="e_val">
                      <el-radio class="radio" v-model="item.type" label="image"
                        >图片</el-radio
                      >
                      <el-radio class="radio" v-model="item.type" label="url"
                        >链接</el-radio
                      >
                    </div>
                  </div>
                  <div class="upload_wrap" v-if="item.type == 'image'">
                    <div class="upload_row">
                      <div class="upload_box">
                        <div class="img_box" v-if="item.ossUrl">
                          <img :src="item.ossUrl" alt="" />
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
                                'image',
                                'qunqunfa',
                                'png,jpg,jpeg',
                                '2',
                                index
                              )
                            "
                            accept=".png,.jpg,.jpeg"
                          />
                        </div>
                      </div>
                      <div class="afresh_file" v-if="item.ossUrl">
                        重新上传<input
                          class="file"
                          type="file"
                          accept=".png,.jpg,.jpeg"
                        />
                      </div>
                    </div>
                    <div class="upload_tips">
                      建议上传大小不超过2MB的图片，格式支持jpeg、jpg、png
                    </div>
                  </div>
                  <div class="link_wrap" v-else>
                    <div class="input_item">
                      <el-input
                        v-model="item.value"
                        placeholder="链接地址请以http或https开头"
                      ></el-input>
                    </div>
                    <!-- <div class="l_item">
                                <div class="l_label">链接标题：</div>
                                <div class="l_val"></div>
                            </div>
                            <div class="l_item">
                                <div class="l_label">链接摘要：</div>
                                <div class="l_val"></div>
                            </div> -->
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="flex center_add">
              <div class="codeBtn pointer" @click="newAddTech">
                <img src="../../assets/images/icon_add@2x.png" alt="" />
                新增素材内容
              </div>
              <span class="tite_add">（最多可添加9个附件）</span>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="inform_send" @click="submitForm('ruleForm')">
              通知成员
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
import { oss_uploadfileparam } from "@/api/base";
// 客户标签弹框
import GroupAdd from "../../components/groupPopout/customergroup.vue";
// 新增素材内容
import ComponenMaterial from "./ComponentMaterial.vue";
import { formatDate } from "../../utils/tool";
export default {
  components: {
    GroupAdd,
    ComponenMaterial,
  },
  data() {
    return {
      fujianList: [
        {
          type: "url",
          ossUrl: "",
          value: "",
          objectname: "",
        },
        {
          type: "image",
          ossUrl: "",
          value: "",
          objectname: "",
        },
      ],
      ruleForm: {
        taskName: "", //任务名称

        groupresource: "", //选择群发客户
        sendType: 1, //发送规则
        timingdata: "", //设定时间日期
        timingTime: "", //设定时间
        region: [],
        gender: null, //性别
        type: [],
        addEndTime: "", //筛选结束时间
        addStarTime: "", //筛选开始时间
        massContent: "",
        group: [],
      },
      datalist: [], //
      userNoList: [],
      // regionName: [1, 2], //选择群发员工
      groupinList: [], //所在群聊
      customerList: [], // 获取客户标签：
      groupList: [], //获取群发员工接口数据
      grouprst: [], //获取选择群发员工数据
      customerlistdata: [],
      groupStaffsetShow: true, //获取选择群发员工下拉框取消展示
      newAddbut: false, //新增素材
      groupAddUp: false, //客户标签弹框
      allGroupnum: "", //全部客户
      screenGroupnum: 0, //删选客户数量
      massDetail: [],
      groutListBox: [],
      customerListTagid: [],
      clueCustomerList: [],
      groupListChat: [],
      urlList: [],
      rules: {
        taskName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        timingdata: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        timingTime: [
          {
            type: "date",
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
        sendType: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        groupresource: [
          { required: true, message: "请选择活动资源去", trigger: "change" },
        ],
        descs: [
          { required: true, message: "请选择发送规则", trigger: "change" },
        ],
        // desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      wordsList: [
        // {
        //   text: "",
        //   imageUrl: "",
        //   pdf: "",
        //   url: "",
        //   activeIndex: "text",
        // },
      ],
      dateList: [],
      tagidList: [],
      sendPerson: [],
    };
  },
  created() {
    this.chooseCustomerMass(); //获取群发员工接口
    this.chooseCustomerGroup(); //获取所在群聊接口
    this.getOneCustomerMass();
    // if (this.userNoList != "") {
    // this.groupStaffse();

    // }
    // this.ruleForm = this.$route.query.id;
    // console.log("==========");
  },

  updated() {
    // console.log(this.userNoList, "mounted");
  },

  watch: {
    "ruleForm.resource": function (val, oldval) {
      console.log(val + "aaa");
      if (val == 1) {
        this.Screeningcustomer();
        console.log(1111);
        (this.ruleForm.gender = ""), //性别
          (this.ruleForm.addStarTime = ""),
          (this.ruleForm.addEndTime = ""),
          (this.groupDataList = ""),
          (this.customerlistdata = "");
      } else {
        console.log(2222);
        this.Screeningcustomer();
      }
    },
  },
  methods: {
    uploadFun(e, fileType, type, accept, size, index) {
      //文件上传
      let fileName = e.target.files[0].name;
      let fileSize = e.target.files[0].size;
      // let allowFileType = accept ? accept.split(',') : []
      // let nameData = fileName.toLowerCase().split('.')
      console.log("fileName", fileName);
      console.log("fileSize", fileSize, this.$filterSize(fileSize));

      oss_uploadfileparam(e, fileType, type).then((res) => {
        if (res.result) {
          e.target.value = "";
          let data = res.data;
          this.fujianList[index].ossUrl = data.url;
          this.fujianList[index].objectname = data.objectname;
          console.log(this.fujianList[index], this.fujianList, "----上传后");
          this.$forceUpdate();
          // this.addData.sopContentAttachmentVOS[index].fileSize =
          // this.$filterSize(fileSize);
        }
      });
    },
    deleteEnclosureFun(i) {
      //删除附件
      this.fujianList.splice(i, 1);
    },
    save() {
      let urlList = [];
      this.detail.list.forEach((el) => {
        if (el.type == "url") {
          urlList.push(el);
        } else {
          imageList.push(el);
        }
      });
    },
    //     // 请求详情接口-----编辑
    getOneCustomerMass() {
      this.$network
        .get("/customer-service/cluecustomerMass/getOneCustomerMass", {
          massNo: this.$route.query.id,
        })
        .then((res) => {
          this.fujianList = res.data.customerMassResourcesEntityList;
          this.sendPerson.gender = res.data.massDetail.gender; //回显性别
          this.ruleForm.massContent = res.data.massDetail.massContent; //群发内容
          console.log(res.data, "-------------------编辑");
          this.wordsList = res.data.customerMassResourcesEntityList;
          this.ruleForm.taskName = res.data.massDetail.taskName; //群发详情
          // this.ruleForm.region = ; //
          console.log(res.data.massDetail.allCustomer, "=======回显");
          this.ruleForm.groupresource = res.data.massDetail.allCustomer; //回显选择群发客户
          res.data.userchooseEntityList.forEach((item) => {
            // console.log(item.userNo);
            // this.ruleForm.region.push(item.name); //
            // this.ruleForm.region = [item.userNo];
            this.ruleForm.region.push(item.chatId);
            this.userNoList.push(item.chatId);
          });
          console.log(this.userNoList);

          // this.groupStaffse();
          this.Screeningcustomer();

          this.sendPerson = res.data.sendPerson; //发送对象
          this.ruleForm.sendType = res.data.massDetail.sendType;
          // this.datalist = ["2021-09-10", "2021-10-10"];
          let starData = formatDate(this.sendPerson.addEndTime, "yyyy-MM-dd ");
          let entData = formatDate(this.sendPerson.addEndTime, "yyyy-MM-dd");
          this.ruleForm.timingdata = formatDate(
            res.data.massDetail.sendTime,
            "yyyy-MM-dd"
          );
          this.ruleForm.timingTime = formatDate(
            res.data.massDetail.sendTime,
            "hh:mm:ss"
          );
          console.log(formatDate(res.data.massDetail.sendTime, "yyyy-MM-dd"));
          console.log(formatDate(res.data.massDetail.sendTime, "hh:mm:ss"));

          this.ruleForm.addStarTime = starData;
          this.ruleForm.addEndTime = entData;
          this.datalist = [starData, entData];

          if (
            Array.isArray(this.sendPerson.customerMassGroupEntityList) &&
            this.sendPerson.customerMassGroupEntityList.length > 0
          ) {
            this.sendPerson.customerMassGroupEntityList.forEach((item) => {
              // console.log(item.name);
              this.ruleForm.group.push(item.chatId);
              this.groupListChat.push(item.chatId);
            });
          } else {
            this.sendPerson.customerMassGroupEntityList = [];
          }

          if (
            Array.isArray(this.sendPerson.customerMassScreenlabelEntityList) &&
            this.sendPerson.customerMassGroupEntityList.length > 0
          ) {
            this.sendPerson.customerMassScreenlabelEntityList.forEach(
              (item) => {
                this.customerList.push(item);
                //this.customerListTagid.push(item.tagid);
                this.customerlistdata.push(item.tagid);
                // console.log(this.customerListTagid, "-------id222");
              }
            );
          } else {
            this.sendPerson.customerMassScreenlabelEntityList = [];
          }
          // this.sendPerson.customerMassGroupEntityList.forEach((item) => {
          //   // console.log(item.name);
          //   this.ruleForm.group.push(item.chatId);
          //   this.groupListChat.push(item.chatId);
          // });
          // this.sendPerson.customerMassScreenlabelEntityList.forEach((item) => {
          //   this.customerList.push(item);
          //   this.customerListTagid.push(item.tagid);
          //   // console.log(this.customerListTagid, "-------id222");
          // });
          // this.groupStaffse();
          // this.Screeningcustomer();
          // this.dataStatisticsvo = res.data.dataStatisticsVO; //数据统计
          // this.userchooseEntityList = res.data.userchooseEntityList; //成员详情
          // this.customerMassScreenEntityList =
          //   res.data.customerMassScreenEntityList; //群详情
        });
    },
    // 返回
    goaBack() {
      this.$router.go(-1);
    },
    // 客户标签弹框  显示
    customerClick() {
      this.groupAddUp = true;
    },
    // 客户标签弹框 隐藏
    groupVisibledata(valDta) {
      this.groupAddUp = false;
      console.log(valDta);
      // console.log(listdata, +"-----listdata--------");
      this.customerList = valDta[0];
      this.customerlistdata = valDta[1];
      console.log(this.customerList);
      console.log(this.customerlistdata);
      // this.customerlistdata.forEach((item) => {
      //   // console.log(item.tagid);
      //   this.dateList.push(item.tagid);
      // });
      // console.log(this.dateList);
    },
    // 获取添加时间
    addchangeDate(val) {
      console.log(val);
      this.ruleForm.addStarTime = val[0];
      this.ruleForm.addEndTime = val[1];
      // console.log(this.ruleForm.datalist);
      this.Screeningcustomer();
    },
    // 获取活动时间
    activityday(val) {
      console.log(val);
    },
    activitytime(val) {
      console.log(val);
    },
    // 点击提交验证
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       alert("submit!");
    //       console.log(this.ruleForm);
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
    // 选择所在群聊
    // groupStaffse(value) {
    //   console.log(this.userNoList);
    //   // if (this.userNoList != "") {
    //   this.$network
    //     .post(
    //       `/customer-service/cluecustomerMass/chooseGroupSend`,
    //       // groutList
    //       {
    //         // params: {
    //         page: 1,
    //         limit: 20,
    //         userList: this.userNoList,
    //         // },
    //       }
    //     )
    //     .then((res) => {
    //       console.log(res.data);
    //       this.groupinList = res.data;
    //       // this.groupinList = res.data.list.records;
    //     });
    //   // }
    // },
    // 点击提交验证
    groupid(value) {
      console.log(value);
      this.ruleForm.groupresource = value;
    },
    submitForm(formName) {
      // let isTrue = this.filterList(this.wordsList);
      // console.log(isTrue);
      // console.log(isTrue[0], "isTRue");
      let listgroupList = [];
      let obj = {};
      this.fujianList.forEach((item) => {
        if (item.type == "image") {
          obj.url = item.ossUrl;
          obj.Objectname = item.objectname || "";
          listgroupList.push(obj);
        }
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          // if (!isTrue[0]) {
          // if (this.value == '' || this.wordTitle == '') {
          //   this.$message({
          //     type: 'error',
          //     message: '请填写分组信息',
          //   })
          // } else {
          let templist = this.fujianList.map((item) => {
            if (item.value != null) {
              this.urlList.push(item.value);
            }
            // return {
            //   type: item.activeIndex,
            //   value: item[item.activeIndex],
            // };
            // this.imgList.push(item.imageUrl);
            // this.urlList.push(item.url);11111
            // console.log("------templist----", item);
            // console.log(item.imageUrl, "-----------img");
          });

          let params = {
            taskName: this.ruleForm.taskName,
            massType: 2,
            massContent: this.ruleForm.massContent,
            gender: this.gender,
            addStartTime: this.ruleForm.addStarTime || "",
            addEndTime: this.ruleForm.addEndTime || "",
            groupList: this.userNoList, //this.groupListChat, //this.groupDataList || [],
            lableList: this.customerlistdata || [], //this.customerListTagid
            sendType: this.ruleForm.sendType,
            sendTime: this.ruleForm.timingdata + " " + this.ruleForm.timingTime,
            urlList: this.urlList,
            allCustomer: this.ruleForm.groupresource, //this.ruleForm.resource,
            fileList: listgroupList,
            // customerList: this.clueCustomerList,
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
              if (res.result) {
                this.$router.push({
                  path: "/interactivemarketing/customermassgroup",
                });
              }
              console.log(res);
              // this.$emit('closeAddDialog')
            });
          // }
        }
        // console.log(this.ruleForm);
        // } else {
        //   console.log("error submit!!");
        //   return false;
        // }
      });
    },
    //点击删除客户标签
    tagtName(list, indexs) {
      console.log(list.tagid, "---------点击id");
      // console.log(this.customerList, "-------点击删除");
      console.log(this.customerlistdata, "-------");
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
      // console.log(this.tagidList + "------------id");
    },
    // 点击新增素材按钮
    newAddTech() {
      console.log("222", this.wordsList);
      if (this.wordsList.length < 9) {
        this.wordsList.push({
          text: "",
          image: "",
          pdf: "",
          url: "",
          activeIndex: "text",
        });
        this.newAddbut = true;
      }
    },
    fnDelete(index) {
      // console.log('2222222222------------', index, this.wordsList)
      if (this.wordsList.length > 1) {
        this.wordsList.splice(index, 1);
      }
    },

    groupStaff(value) {
      console.log(value);
      // console.log(this.userNoList);
      // this.userNoList = [];
      // console.log(this.userNoList);

      this.grouprst = value;
    },
    // 获取选择群发员工接口
    chooseCustomerMass() {
      this.$network
        .get("/customer-service/cluecustomerMass/chooseGroupSend", {
          page: 1,
          limit: 20,
        })
        .then((res) => {
          console.log(res);

          this.groupList = res.data;
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
      this.groupListChat = valdata;
    },
    //筛选客户接口
    Screeningcustomer() {
      console.log(this.userNoList, "--------userNoList");
      let listGroup = this.grouprst;
      this.$network
        .post("/customer-service/cluecustomerMass/customerScreen", {
          userList: this.userNoList,
          gender: this.ruleForm.gender, //性别
          addStarTime: this.ruleForm.addStarTime,
          addEndTime: this.ruleForm.addEndTime,
          groupList: this.groupListChat || [],
          lableList: this.customerlistdata || [],
        })
        .then((res) => {
          console.log(res);
          this.screenGroupnum = res.data.estimateNum;
          this.clueCustomerList = res.data.clueCustomerList;
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
  },
};
</script>
<style  lang="less" scoped>
.group {
  /deep/ .el-input__inner,
  .el-input--suffix {
    width: 680px;
    height: 32px;
  }
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
      width: 48px;
      color: #3c4353;
      white-space: nowrap;
    }
    .val {
      width: calc(100% - 48px);
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
          /deep/ .el-radio__input.is-checked + .el-radio__label {
            color: #4168f6;
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
// 头部
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
/deep/.el-input__inner,
.el-input--suffix {
  // width: 702px;
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
  margin-top: 15px;
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
  margin-top: -60px;
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
}
</style>