<template>
  <div v-loading="loading">
    <div class="goAack" @click="goaBack">
      <img class="left-img" src="../../assets/images/goback.png" alt="" />
      <span class="back-text">返回</span>
    </div>

    <div>
      <el-card>
        <el-row>
          <div class="hed-liveness">
            <el-col :span="24"
              ><div class="">
                <span class="leng"></span>
                <span class="overview family-Medium">群发详情</span>
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
                <span class="detail_name"
                  >受邀群聊：<span
                    class="tag_names"
                    v-for="item in sendPersonData.customerMassGroupEntityList"
                    :key="item.id"
                    >{{ item.name }}
                    <span class="namelsity"> 群主:{{ item.owmerName }}</span>
                  </span></span
                >
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li class="flex_baseline detail_list">
                <div class="detail_name centwarp">发送对象:</div>
                <div v-if="massDetail.allCustomer == 1">
                  <div>
                    <p class="detail_name">在全部客户中满足以下条件的用户</p>
                    <div class="send_warp">
                      <div class="detail_name mb-16">
                        <span
                          >性别：
                          <span v-if="sendPerson.gender == 1">男</span>
                          <span v-if="sendPerson.gender == 2">女</span>
                          <span v-if="sendPerson.gender == 3">全部用户</span>
                        </span>
                      </div>
                      <div class="detail_name mb-16">
                        <span
                          >添加时间：<span
                            v-if="
                              sendPerson.addStartTime != null ||
                              sendPerson.addEndTime != null
                            "
                            >{{
                              formatDate(sendPerson.addStartTime, "yyyy-MM-dd")
                            }}
                            至
                            {{
                              formatDate(sendPerson.addEndTime, "yyyy-MM-dd")
                            }}</span
                          >
                          <span v-else>暂无</span></span
                        >
                      </div>
                      <!-- <div class="detail_name mb-16">
                        <span
                          >所在群聊：<span
                            class="tag_names"
                            v-for="item in sendPersonData.customerMassGroupEntityList"
                            :key="item.id"
                            >{{ item.name }}</span
                          ></span
                        >
                      </div> -->

                      <div class="mb-16 flex">
                        <p class="tite_send">客户标签：</p>
                        <div class="flex_warp">
                          <p
                            class="tag_name"
                            v-for="item in sendPersonData.customerMassScreenlabelEntityList"
                            :key="item.id"
                          >
                            {{ item.name }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="massDetail.allCustomer == 2">
                  <div class="send_warp">
                    <div class="detail_name mb-16">
                      <span
                        >群发客户：<span class="tag_names">全部客户</span></span
                      >
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
                <p class="statistice_tite">任务发送成员</p>
              </div>
              <div>
                <p class="statistics_num">
                  {{ dataStatisticsvo.customerSendNum }}
                </p>
                <p class="statistice_tite">任务送达客户</p>
              </div>
            </div>
            <div class="statistics ml_aut flex">
              <div class="mr-60">
                <p class="statistics_num">
                  {{ dataStatisticsvo.alreadyUserSendNum }}
                </p>
                <p class="statistice_tite">已发送成员</p>
              </div>
              <div>
                <p class="statistics_num">
                  {{ dataStatisticsvo.alreadyCustomerSendNum }}
                </p>
                <p class="statistice_tite">已送达客户</p>
              </div>
            </div>
            <div class="statistics ml_aut flex">
              <div class="mr-60">
                <p class="statistics_num">
                  {{ dataStatisticsvo.noUserSendNum }}
                </p>
                <p class="statistice_tite">未发送成员</p>
              </div>
              <div>
                <p class="statistics_num">
                  {{ dataStatisticsvo.noCustomerSendNum }}
                </p>
                <p class="statistice_tite">未送达客户</p>
              </div>
            </div>
            <div class="statistics flex">
              <div class="mr-60">
                <p class="statistics_num">
                  {{ dataStatisticsvo.alreadyInGroupNum }}
                </p>
                <p class="statistice_tite">已入群客户</p>
              </div>
              <div>
                <p class="statistics_num">
                  {{ dataStatisticsvo.onGroupNum || 0 }}
                </p>
                <p class="statistice_tite">未入群客户</p>
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
                  <span class="overview family-Medium">成员详情</span>
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
                <!-- ../../assets/images/mainone.png -->
                <img :src="item.avatar" alt="" />

                <span class="name_details">{{ item.name || "暂无" }}</span>
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
                  <span class="overview family-Medium">客户详情</span>
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
                <div class="name_details">{{ item.name }}</div>
                <div class="but_details" v-if="item.receiveStatus == 0">
                  未送达
                </div>
                <div class="but_sent" v-if="item.receiveStatus == 1">
                  已送达
                </div>
                <div class="but_goodfriend" v-if="item.receiveStatus == 3">
                  客户接收已上线
                </div>
                <div class="but_goodfriend" v-if="item.receiveStatus == 2">
                  非好友
                </div>
              </div>
              <div class="detail_name">
                通过{{ item.userName || "暂无人员" }}发送
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
import { formatDate } from "../../utils/tool";
import {
  tagEstablishGroup_getOneTagCustomerMass,
} from '@/api/customer'
export default {
  data() {
    return {
      customerMassResourcesEntityList: [],
      groupAddUp: false, //客户标签弹框
      massDetail: [], //群发详情
      sendPerson: [], //发送对象
      sendPersonData: [],
      dataStatisticsvo: [], //数据统计
      userchooseEntityList: [], //成员详情
      customerMassScreenEntityList: [], //群详情
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
      let obj = {
        massNo: this.$route.query.id
      }
      tagEstablishGroup_getOneTagCustomerMass(obj).then(res => {
        if(res.result){
          this.customerMassResourcesEntityList = res.data.customerMassResourcesEntityList;
          this.massDetail = res.data.massDetail; //群发详情
          this.massDetail.createBy = res.data.sendPerson.createName;
          this.sendPerson = res.data.massDetail; //发送对象
          this.sendPersonData = res.data.sendPerson;
          //   this.sendPerson = res.data.sendPerson.customerMassGroupEntityList; //发送对象
          this.dataStatisticsvo = res.data.dataTagStatisticsVO; //数据统计
          this.userchooseEntityList = res.data.userchooseEntityList; //成员详情
          this.customerMassScreenEntityList = res.data.customerMassScreenEntityList; //群详情
        }
      })
    },
  },
};
</script>
<style  lang="less" scoped>
// 头部
.namecenter {
  table-layout: fixed;
  word-break: break-all;
  overflow: hidden;
  width: 350px;
}
.centwarp {
  width: 70px;
}
.img_active {
  width: 54px;
  height: 54px;
  border-radius: 4px;
  background: #4168f6;
  text-align: center;
  line-height: 54px;
  color: #fff;
}
.hed-liveness {
  height: 40px;
  line-height: 40px;
  // border-bottom: 1px solid rgba(240, 242, 247, 1);
  margin-bottom: 16px;
}
.namelsity {
  font-size: 12px;
  color: #838a9d;
  letter-spacing: 0;
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
  align-items: baseline;
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
    width: 80px;
    height: 80px;
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
.ml_aut {
  margin: 0 16px;
}
.statistics {
  width: 280px;
  padding: 0 30px;
  height: 120px;
  background: rgba(65, 104, 246, 0.02);
  border: 1px solid #4168f6;
  border-radius: 4px;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
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