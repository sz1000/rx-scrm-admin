<template>
  <div>
    <div class="goAack" @click="goaBack">
      <img class="left-img" src="../../../assets/images/goback.png" alt="" />
      <span class="back-text">返回</span>
    </div>

    <div>
      <el-card>
        <el-row>
          <div class="hed-liveness">
            <el-col :span="24"
              ><div class="">
                <span class="leng"></span>
                <span class="overview family-Medium">群群发详情</span>
              </div></el-col
            >
          </div>
        </el-row>
        <!-- 群发详情 -->

        <div class="detail_warp flex_between">
          <div>
            <ul>
              <li class="detail_list">
                <span class="detail_name">任务名称：</span>
                <span class="detail_name">{{ massDetail.taskName }}</span>
              </li>
              <li class="detail_list">
                <span class="detail_name">创建人员：</span>
                <span class="detail_name">{{ massDetail.createBy }}</span>
              </li>
              <li class="detail_list">
                <span class="detail_name">创建时间：</span>
                <span class="detail_name">{{
                  formatDate(massDetail.createTime, "yyyy-MM-dd hh:mm:ss")
                }}</span>
              </li>
              <li class="detail_list">
                <span class="detail_name">发送规则：</span>
                <span class="detail_name" v-if="massDetail.sendType == 1"
                  >立即发送</span
                >
                <span class="detail_name" v-if="massDetail.sendType == 2"
                  >定时发送</span
                >
              </li>
              <li class="detail_list">
                <span class="detail_name">发送时间：</span>
                <span class="detail_name">{{
                  formatDate(massDetail.sendTime, "yyyy-MM-dd hh:mm:ss")
                }}</span>
              </li>
              <li class="flex_baseline detail_list">
                <div class="detail_name centwarp">群发内容：</div>
                <div>
                  <p class="detail_name namecenter">
                    {{ massDetail.massContent || "暂无" }}
                  </p>
                  <!-- <div
                    class="flex_center img_top"
                    v-for="item in customerMassResourcesEntityList"
                    :key="item.id"
                  >
                    <div class="detail_img">
                      <img
                        :src="item.ossUrl"
                        v-if="item.ossUrl != null"
                        alt=""
                      />
                    </div>
                    <div class="ml-16" v-if="item.ossUrl != null">
                      <p class="link_name">{{ item.ossObjectname }}</p>
                      <p class="img_size">27.35k</p>
                    </div>
                  </div> -->
                  <!-- <div class="flex_center img_top">
                    <div class="detail_img">
                      <img src="../../../assets/images/mainfour.png" alt="" />
                    </div>
                    <div class="ml-16">
                      <p class="img_name">src=http___itegsbz.png</p>
                      <p class="img_size">27.35k</p>
                    </div>
                  </div>
                  <div class="link_warp flex_center">
                    <div>
                      <p class="detail_name">锐信科技</p>
                      <p class="link_name">
                        We're sorry but 极洲科技do oesn't work properly wit…
                      </p>
                    </div>
                    <div class="link_img">
                      <img src="../../../assets/images/mainone.png" alt="" />
                    </div>
                  </div> -->
                       <div class="flex_center img_top link_warp" v-for="(item,index) in warpImgList" :key="index">
                    <div class="detail_img">
                      <img :src="item.ossUrl" alt="" />
                    </div>
                    <div class="ml-16">
                      <p class="img_name show">{{item.ossObjectname}}</p>
                      <!-- <p class="img_size">27.35k</p> -->
                    </div>
                  </div>
                       <div class="flex_center img_top link_warp" v-for="(item,index) in mediaImageList" :key="index">
                    <div class="detail_img">
                      <img :src="item.ossUrl" alt="" />
                    </div>
                    <div class="ml-16">
                      <p class="img_name show">{{item.ossObjectname}}</p>
                      <!-- <p class="img_size">27.35k</p> -->
                    </div>
                  </div>
                  <div class="link_warp flex_center" v-for="(item,index) in warpUrlList " :key="index">
                    <div>
                      <p class="detail_name show">{{item.title}}</p>
                      <p class="link_name">
                        {{item.desc}}
                      </p>
                    </div>
                    <div class="link_img">
                      <img :src="item.picurl" alt="" />
                    </div>
                  </div>
                      <div class="link_warp flex_center" v-for="(item,index) in warpMediaList " :key="index">
                    <div>
                      <p class="detail_name show">{{item.title}}</p>
                      <p class="link_name">
                        {{item.desc}}
                      </p>
                    </div>
                    <div class="link_img" >
                       <img :src="item.url" alt="" v-if="item.type == 3">
                      <img :src="item.picurl"  alt="" v-if="item.type == 1" />
                      <!-- <img src="../../../assets/images/pdf_image.png" alt="" v-if="item.type == 2"> -->
                      <img :src="item.picurl" alt="" v-if="item.type == 2">
                    </div>
                  </div>
                </div>
              </li>
              <!-- <li class="flex_baseline detail_list"> -->
                <!-- <div class="detail_name centwarp">链接：</div> -->
                <!-- <div> -->
                  <!-- <p
                    class="detail_name namecenter"
                    v-for="item in customerMassResourcesEntityList"
                    :key="item.id"
                  >
                    {{ item.value }}
                  </p> -->
                  <!-- <div class="flex_center img_top">
                    <div class="detail_img">
                      <img src="../../../assets/images/mainfour.png" alt="" />
                    </div>
                    <div class="ml-16">
                      <p class="img_name">src=http___itegsbz.png</p>
                      <p class="img_size">27.35k</p>
                    </div>
                  </div> -->
                  <!-- <div class="link_warp flex_center">
                    <div>
                      <p class="detail_name">锐信科技</p>
                      <p class="link_name">
                        We're sorry but 极洲科技do oesn't work properly wit…
                      </p>
                    </div>
                    <div class="link_img">
                      <img src="../../../assets/images/mainone.png" alt="" />
                    </div>
                  </div> -->
                <!-- </div>
              </li> -->
            </ul>
          </div>
          <div>
            <ul>
              <li class="flex_baseline detail_list">
                <div class="detail_name centwarp">发送对象：</div>
                <div>
                  <div class="send_warp">
                    <div class="detail_name mb-16">
                      <div
                        class="tag_names"
                        v-for="item in groupLists"
                        :key="item.id"
                      >
                        <span class="groupname">{{ item[1] }}</span>
                        <span class="namelsity"> 群主：{{ item[0] }}</span>
                      </div>

                      <!-- <span
                        >所在群聊：<span
                          v-for="item in userchooseEntityList"
                          :key="item.id"
                          >{{ item.name }}</span
                        ></span
                      > -->
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-card>
      <!-- 数据统计  -->
      <el-card>
        <div>
          <el-row>
            <div class="hed-liveness">
              <el-col :span="24"
                ><div class="">
                  <span class="leng"></span>
                  <span class="overview family-Medium">数据统计</span>
                </div></el-col
              >
            </div>
          </el-row>
          <div class="flex statistics-between">
            <div class="statistics flex">
              <div class="mr-60">
                <p class="statistics_num">{{ dataStatisticsvo.userSendNum }}</p>
                <p class="statistice_tite">任务发送群主</p>
              </div>
              <div>
                <p class="statistics_num">
                  {{ dataStatisticsvo.groupSendNum }}
                </p>
                <p class="statistice_tite">任务送达群聊</p>
              </div>
            </div>
            <div class="statistics flex">
              <div class="mr-60">
                <p class="statistics_num">
                  {{ dataStatisticsvo.alreadyUserSendNum }}
                </p>
                <p class="statistice_tite">已发送群主</p>
              </div>
              <div>
                <p class="statistics_num">
                  {{ dataStatisticsvo.alreadyGroupSendNum }}
                </p>
                <p class="statistice_tite">已送达群聊</p>
              </div>
            </div>
            <div class="statistics flex">
              <div class="mr-60">
                <p class="statistics_num">
                  {{ dataStatisticsvo.noUserSendNum }}
                </p>
                <p class="statistice_tite">未发送群主</p>
              </div>
              <div>
                <p class="statistics_num">
                  {{ dataStatisticsvo.noGroupSendNum }}
                </p>
                <p class="statistice_tite">未送达群聊</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <div class="flex mt-10">
        <div class="details_warp">
          <el-row>
            <div class="hed-liveness">
              <el-col :span="24"
                ><div class="">
                  <span class="leng"></span>
                  <span class="overview family-Medium">群主详情</span>
                </div></el-col
              >
            </div>
          </el-row>
          <ul>
            <li
              class="details_list"
              v-for="item in userchooseEntityList"
              :key="item.id"
            >
              <div class="details">
                <!-- ../../../assets/images/mainone.png -->
                <img :src="item.avatar" alt="" />

                    <el-tooltip :content="item.name" placement="top">

                <span class="name_details">{{ item.name || "暂无" }}</span>
                     </el-tooltip>
                <span class="but_details" v-if="item.sendStatus == 1"
                  >未发送</span
                >
                <span class="but_sent" v-if="item.sendStatus == 2">已发送</span>
              </div>
              <!-- <div class="remind">提醒</div> -->
            </li>
          </ul>
        </div>
        <div class="details_warp">
          <el-row>
            <div class="hed-liveness">
              <el-col :span="24"
                ><div class="">
                  <span class="leng"></span>
                  <span class="overview family-Medium">群聊</span>
                </div></el-col
              >
            </div>
          </el-row>

          <ul>
            <li
              class="details_list"
              v-for="item in customerMassScreenEntityList"
              :key="item.id"
            >
              <div class="details">
                <!-- <img v-if="item.avatar != ''" :src="item.avatar" alt="" /> -->
                <!-- <img :src="item.avatar" alt="" /> -->
                <div class="img_active">{{ item.name.substring(0, 1) }}</div>
                <el-tooltip  :content="item.name" placement="top">
                  <div class="name_details">{{ item.name }}</div>
                 </el-tooltip>
                <div class="but_details" v-if="item.sendStatus == 0">
                  未送达
                </div>
                <div class="but_sent" v-if="item.sendStatus == 1">已送达</div>
                <div class="but_goodfriend" v-if="item.sendStatus == 3">
                  客户接收已上线
                </div>
                <div class="but_goodfriend" v-if="item.sendStatus == 2">
                  非好友
                </div>
              </div>
                <div class="detail_namep">
               <span> 通过</span>
                  <el-tooltip :content="item.userName" placement="top">
                 <span class="name">  {{ item.userName || "暂无人员" }}</span>
             </el-tooltip>
              <span>发送</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 客户标签弹框
import { formatDate } from "../../../utils/tool";
export default {
  data() {
    return {
      groupLists: [],
      customerMassResourcesEntityList: [],
      groupAddUp: false, //客户标签弹框
      massDetail: [], //群发详情
      sendPerson: [], //发送对象
      dataStatisticsvo: [], //数据统计
      userchooseEntityList: [], //成员详情
      customerMassScreenEntityList: [], //群详情
       warpUrlList:[],
      warpMediaList:[],
      warpImgList:[],
       mediaImageList:[],
    };
  },
  created() {
    console.log(this.$route.query.id, "详情");
    this.getOneCustomerMass();
  },
  methods: {
    // 返回
    goaBack() {
      this.$router.go(-1);
    },
    // 请求详情接口
    getOneCustomerMass() {
      this.$network
        .get("/customer-service/cluecustomerMass/getOneCustomerMass", {
          massNo: this.$route.query.id,
        })
        .then((res) => {
          console.log(res.data.sendPerson.map);
          this.groupLists = Object.entries(res.data.sendPerson.map);
          // let group = Object.entries(res.data.sendPerson.map);
          // let group = {
          //   厉害啊: "、,ooo,uu,rewrr,rwer,、,、",
          //   厉害啊: "、,ooo,uu,rewrr,rwer,、,、",
          // };

          // console.log(group, " res.data.sendPerson.ma");
          // group.forEach((item) => {
          //   console.log(item[0], "---------");
          // });
          this.customerMassResourcesEntityList =
            res.data.customerMassResourcesEntityList;
          this.massDetail = res.data.massDetail; //群发详情
          this.massDetail.createBy = res.data.sendPerson.createName;
          this.sendPerson = res.data.sendPerson; //发送对象
          this.dataStatisticsvo = res.data.dataStatisticsGroupVO; //数据统计
          this.userchooseEntityList = res.data.userchooseEntityList; //成员详情
          this.customerMassScreenEntityList = res.data.groupResult; //群详情
             this.warpUrlList = res.data.url,
            this.warpMediaList = res.data.mediaUrl
            this.warpImgList = res.data.image
             this.mediaImageList = res.data.mediaImage
        });
    },
  },
};
</script>
<style  lang="less" scoped>
.img_active {
  width: 54px;
  height: 54px;
  border-radius: 4px;
  background: #4168f6;
  text-align: center;
  line-height: 54px;
  color: #fff;
}
// 头部
.namecenter {
  table-layout: fixed;
  word-break: break-all;
  overflow: hidden;
  width: 350px;
}
.centwarp {
  // width: 70px;
}
.namelsity {
  font-size: 12px;
  color: #838a9d;
  letter-spacing: 0;
}
.groupname {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
}
.hed-liveness {
  height: 40px;
  line-height: 40px;
  // border-bottom: 1px solid rgba(240, 242, 247, 1);
  margin-bottom: 16px;
}
.leng {
  width: 2px;
  height: 14px;
  background: #4168f6;
  display: inline-block;
  vertical-align: middle;
}
.overview {
  font-size: 14px;
  font-weight: 600;
  color: #3c4353;
  margin: 0 8px;
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
// 详情
.detail_name {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
   .name{
     overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width:80px;
  // // display: inline-block;
  // margin: 0 4px;
  }
}
.detail_namep {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
  display: flex;
  .name{
     overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width:80px;
  display: inline-block;
  margin: 0 2px;
  }
}
.show{
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 120px;
}
.flex {
  display: flex;
}
.flex_between {
  display: flex;
  justify-content: space-between;
}
.flex_baseline {
  display: flex;
  // align-items: baseline;
}
.flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail_list {
  margin-bottom: 16px;
}
.detail_img {
  img {
    width: 60px;
    height: 60px;
  }
}
.ml-16 {
  margin-left: 16px;
}
.img_name {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
}
.img_size {
  font-size: 12px;
  color: #c0c4cc;
  letter-spacing: 0;
  font-weight: 400;
}
.link_warp {
  width: 250px;
  height: 100px;
  background: #ffffff;
  border: 1px solid #d9dae4;
  margin-top: 8px;
}
.img_top {
  margin-top: 8px;
}
.link_name {
  width: 152px;
  height: 34px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #c0c4cc;
  letter-spacing: 0;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 6px;
}
.link_img {
  img {
    width: 50px;
    height: 50px;
  }
}
.send_warp {
  width: 520px;
  // height: 236px;
  background: #fafbff;
  border: 1px solid #d9dae4;
  border-radius: 4px;
  margin-top: 16px;
  padding: 16px;
}
.mb-16 {
  margin-bottom: 16px;
}
.tag_name {
  background: #ffffff;
  border: 1px solid #d9dae4;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 14px;
  color: #838a9d;
  font-weight: 400;
  margin: 0 10px 10px 0;

  // display: inline-block;
}
.tag_names {
  // background: #ffffff;
  // border: 1px solid #d9dae4;
  // border-radius: 4px;
  // padding: 2px 8px;
  // font-size: 14px;
  // color: #838a9d;
  // font-weight: 400;
  margin: 0 10px 10px 0;

  // display: inline-block;
}
.flex_warp {
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  // height: 23px;
}
.tite_send {
  // width: 120px;
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 400;
}
.statistics {
  // width: 280px;
  padding: 0 30px;
  height: 120px;
  background: rgba(65, 104, 246, 0.02);
  border: 1px solid #4168f6;
  border-radius: 4px;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
      flex: 1;
    margin-right: 16px;
  // margin-right: 16px;
}
.statistics-between {
  justify-content: space-between;
}
.statistics_num {
  font-size: 24px;
  color: #3c4353;
  text-align: center;
  font-weight: 700;
  margin-bottom: 8px;
}
.statistice_tite {
  font-size: 14px;
  color: #838a9d;
  text-align: center;
  font-weight: 400;
}
/deep/ .el-card.is-always-shadow {
  margin-top: 16px;
}
.details_warp {
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  transition: 0.3s;
  padding: 20px;
  width: 50%;
  // height: 100px;
  margin-right: 20px;
  border-radius: 4px;
}
.mt-10 {
  margin-top: 16px;
}
.details_list {
  // width: 574px;
  height: 120px;
  background: #fafbff;
  border: 1px solid #d9dae4;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  margin-bottom: 16px;
}
.details {
  display: flex;
  align-items: center;
  img {
    width: 54px;
    height: 54px;
    border-radius: 4px;
  }
}
.name_details {
  font-size: 14px;
  color: #3c4353;
  letter-spacing: 0;
  font-weight: 500;
  margin: 0 16px 0 8px;
  width: 60px;
  height: 20px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.but_details {
  background: rgba(65, 104, 246, 0.02);
  border: 1px solid #4168f6;
  border-radius: 2px;
  padding: 0 8px;
  font-size: 12px;
  color: #4168f6;
  font-weight: 400;
}
.but_goodfriend {
  background: rgba(65, 104, 246, 0.02);
  border: 1px solid #ffb020;
  border-radius: 2px;
  padding: 0 8px;
  font-size: 12px;
  color: #ffb020;
  font-weight: 400;
}
.but_sent {
  background: rgba(65, 104, 246, 0.02);
  border: 1px solid #52bd94;
  border-radius: 2px;
  padding: 0 8px;
  font-size: 12px;
  color: #52bd94;
  font-weight: 400;
}
.remind {
  padding: 9px 16px;
  background: #4168f6;
  border-radius: 4px;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 14px;
  font-weight: 400;
}
</style>