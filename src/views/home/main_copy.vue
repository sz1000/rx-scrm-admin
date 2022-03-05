<template>
  <div class="mainWarp">
    <div class="left_container">
      <div class="custrom oneBox">
        <div class="header_title">客户统计</div>
        <div class="board">
          <div class="totalNum everyBox">
            <div class="variable">{{ formObj.totalNum }}</div>
            <div class="describe">我的线索</div>
          </div>
          <div class="newAdd everyBox">
            <div class="variable">{{ formObj.newAdd }}</div>
            <div class="describe">线索公海</div>
          </div>
          <div class="disappear everyBox">
            <div class="variable">{{ formObj.disappear }}</div>
            <div class="describe">我的客户</div>
          </div>
          <div class="apply everyBox">
            <div class="variable">{{ formObj.apply }}</div>
            <div class="describe">客户公海</div>
          </div>
        </div>
      </div>
      <div class="groupBase oneBox">
        <div class="header_title">客户群统计</div>
        <div class="groupCont">
          <div v-for="(item, index) in items" :key="index" class="numBox">
            <div class="topNum">{{ item.num }}</div>
            <div class="botTxt">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="groupBase oneBox">
        <div class="header_title">活码统计</div>
        <div class="groupCont">
          <div v-for="(item, index) in groupItem" :key="index" class="numBox">
            <div class="topNum">{{ item.num }}</div>
            <div class="botTxt">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <!-- <div class="satisfid oneBox">
        <div class="header_title">客户满意度</div>
        <div class="reviews">
          <div class="satisfaction">
            <div class="leftNum">1289</div>
            <div class="centerImg">
              <img
                src="../../assets/images/icon_happy@2x.png"
                alt=""
                style="width: 50px; height: 50px"
              />
              <div>正面评论</div>
            </div>
            <div class="rightNum">90%</div>
          </div>
          <div class="discontent satisfaction">
            <div class="leftNum">50</div>
            <div class="centerImg">
              <img
                src="../../assets/images/icon_sad@2x.png"
                alt=""
                style="width: 50px; height: 50px"
              />
              <div>负面评论</div>
            </div>
            <div class="rightNum">8%</div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="right_container">
      <div class="oneBox">
        <div class="header_title">快捷操作</div>
        <div class="shortcuts">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
              <!-- <router-link to="/markcenter/myCode"> -->
              <div @click="goDetail('/markcenter/myCode')" class="pointer">
                <img src="../../assets/images/icon_huoma.png" alt="" />
                <div class="descrition">我的活码</div>
              </div>
              <!-- </router-link> -->
            </el-col>
            <el-col :span="6">
              <!-- <router-link to="/customerManagement/account"> -->
              <div @click="goDetail('/customerManagement/account')" class="pointer">
                <img src="../../assets/images/icon_xiansuo.png" alt="" />
                <div class="descrition">我的线索</div>
              </div>
              <!-- </router-link> -->
            </el-col>
            <el-col :span="6">
              <!-- <router-link to="/customerManagement/myCustome"> -->
              <div @click="goDetail('/customerManagement/myCustome')" class="pointer">
                <img src="../../assets/images/icon_heart.png" alt="" />
                <div class="descrition">我的客户</div>
              </div>
              <!-- </router-link> -->
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
              <!-- <router-link to="/customerManagement/groupList"> -->
              <div @click="goDetail('/customerManagement/groupList')" class="pointer">
                <img src="../../assets/images/icon_peoples.png" alt="" />
                <div class="descrition">群列表</div>
              </div>
              <!-- </router-link> -->
            </el-col>
            <el-col :span="6">
              <!-- <router-link to="/interactivemarketing/individualWords"> -->
              <div @click="goDetail('/interactivemarketing/individualWords')" class="pointer">
                <img src="../../assets/images/icon_qiu.png" alt="" />
                <div class="descrition">个人话术</div>
              </div>
              <!-- </router-link> -->
            </el-col>
            <el-col :span="6">
              <!-- <router-link to="/accountManagement/companyInformation"> -->
              <div @click="goDetail('/accountManagement/companyInformation')" class="pointer">
                <img src="../../assets/images/icon_tongxunlu.png" alt="" />
                <div class="descrition">企业信息</div>
              </div>
              <!-- </router-link> -->
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="oneBox">
        <div class="header_title">新增客户数量</div>
        <div class="lineChart" v-if="monthData.length > 0">
          <LineChart :options="option" :monthData="monthData"></LineChart>
        </div>
        <div class="notice_flex">
          <div class="notice" @click="getNoticeList">
            <jzIcon class="iconfont" type="icon-tongzhi"></jzIcon>
          </div>
          <div class="badge" v-if="tipsNum">{{tipsNum}}</div>
          <!-- 通知列表 -->
          <div class="notice_list_wrap" :class="{'hidden': !notice_dialog}">
            <div class="notice_header">
              <div class="title_box">
                <div class="title" @click="noticeNavFun(item)" :class="{'cur':item.code == noticeActive}" v-for="item in noticeNavList"
                     :key="item.code">{{item.name}}</div>
              </div>
              <!-- <span class="iconfont icon-caozuo-quanping-shousuo notice_close" @click="notice_dialog = false"></span> -->
              <jzIcon class="iconfont notice_close" type="icon-caozuo-quanping-shousuo" @click.native="notice_dialog = false"></jzIcon>
            </div>
            <el-scrollbar class="notice_list" v-if="noticeTotal > 0" wrap-class="scrollbar_wrap">
              <div class="list_box" v-infinite-scroll="noticeLoadFun" :infinite-scroll-disabled="scrollDisabled">
                <div class="li" v-for="(item,i) in noticeList" :key="i">

                  <div class="val">
                    <div class="name">{{item.customerContactName}}</div>
                    <div class="des" v-if="item.customerName">客户：{{item.customerName}}</div>
                    <div class="des"><span v-if="item.alt">{{item.alt | $alt}}</span> {{item.noticeContent}}</div>
                    <div class="time">{{item.promptTime}}</div>
                  </div>
                </div>
                <div class="notice_tips" v-if="!loading">没有更多了~</div>
              </div>
            </el-scrollbar>
            <div class="no_notice" v-else>
              <img class="img" src="@/assets/images/nodae.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="温馨提示" :visible.sync="dialogFormVisible" :show-close='false' :close-on-click-modal="false" :close-on-press-escape='false'
               width="520px">
      <div class="instruction">
        感谢您认可我们的产品，如需继续使用，请联系我们的客服，可通过扫描
        二维码或电话联系我们。</div>
      <div class="content">
        <div class="left">
          <img src="../../assets/images/kefuxw.png" alt="">
          <div>客服小薇</div>
        </div>
        <div class="right">
          <div class="bottomText">
            <p>电话:</p>
            <p class="numberPhone">400-820-8999</p>
            <p>工作时间:</p>
            <p>周一至周五：9:30-18:00</p>
          </div>
          <div class="textPhone">电话联系</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import LineChart from '../../components/echart/lineChart.vue'
import {
  cluecustomer_homedata,
  livecode_homedata,
  user_getUserName,
  notice_personal_pageList,
  notice_clueCustomerFollowUser,
} from '@/api/home'

import { settings } from '@/config/api'
import { BASE_URL } from '@/config/app'
export default {
  components: {
    LineChart,
  },
  data() {
    return {
      formObj: {
        totalNum: '',
        newAdd: '',
        disappear: '',
        apply: '',
      },
      items: [
        {
          name: '群总数',
          num: '',
        },
        {
          name: '群总人数',
          num: '',
        },
        {
          name: '新增入群人数',
          num: '',
        },
      ],
      groupItem: [
        {
          name: '活码总数',
          num: '',
        },
        {
          name: '添加客户数',
          num: '',
        },
        {
          name: '渠道数',
          num: '',
        },
      ],
      option: {},
      dialogFormVisible: false,
      input: '',
      input1: '',
      monthData: [],
      routeList: [],

      noticeSearch: {
        current: 1,
        size: 10,
      },
      notice_dialog: false,
      websock: null,
      tipsNum: 0,
      noticeList: [],
      noticeTotal: 0,
      loading: false,
      noticeNavList: [
        { name: '客户动态', code: 'khdt' },
        { name: '系统通知', code: 'xttz' },
      ],
      noticeActive: 'khdt',
      scrollDisabled: false,
    }
  },
  computed: {
    token() {
      return this.$store.getters.token
    },
    corpId() {
      return this.$store.getters.corpId
    },
  },
  destroyed() {
    // 销毁监听
    if (this.websock) {
      this.webSocketCloseFun()
    }
  },
  created() {
    this.getUserName()
    this.$store.dispatch('getCorpId').then(() => {})
    this.initWebSocket()
    this.commonSettingfn()
  },
  mounted() {
    this.getHomeData()
    this.getSubHomeData()
  },
  methods: {
    commonSettingfn() {
      settings().then((res) => {
        this.$store.commit('SET_COMMONSETTING', res.data)
      })
    },

    getUserName() {
      user_getUserName().then((res) => {
        if (res.result) {
          this.dialogFormVisible = !res.data.haveSecret
          let list = res.data.userEntity.permissionList
          this.getPageName(list)
        }
      })
    },
    getHomeData() {
      cluecustomer_homedata().then((res) => {
        if (res.result) {
          this.items[0].num = res.data.groupSum.groupSum
          this.items[1].num = res.data.groupSum.personSum
          this.items[2].num = res.data.groupSum.addPersonSum
          this.groupItem[1].num = res.data.liveAddSum
          this.formObj.totalNum = res.data.myThread
          this.formObj.newAdd = res.data.derThread
          this.formObj.disappear = res.data.myCustomer
          this.formObj.apply = res.data.derCustomer
          this.monthData = res.data.monList.map((item) => {
            return item.sums
          })
        }
      })
    },
    getSubHomeData() {
      livecode_homedata().then((res) => {
        if (res.result) {
          this.groupItem[0].num = res.data.liveSum
          this.groupItem[2].num = res.data.channSum
        }
      })
    },
    goDetail(v) {
      // this.$emit('father', v)
      let list = [...this.routeList]
      // console.log(v, list)
      if (list.includes(v)) {
        this.$emit('father', v)
      } else {
        this.$message({
          type: 'error',
          message: '暂无权限',
          duration: 1000,
        })
      }
    },
    noticeNavFun(row) {
      //通知切换
      this.noticeActive = row.code
      this.loading = true
      this.noticeSearchFun()
    },
    noticeLoadFun() {
      //滚动加载
      if (!this.loading) {
        return false
      }
      console.log('asd')
      this.getNoticeList()
    },
    noticeSearchFun() {
      this.noticeSearch.current = 1
      this.getNoticeList()
    },
    getNoticeList() {
      //获取通知列表
      // if (this.notice_dialog) {
      //   return false
      // }
      this.scrollDisabled = true
      if (this.noticeActive == 'khdt') {
        //客户动态
        notice_personal_pageList(this.noticeSearch).then((res) => {
          if (res.result) {
            this.loading = false
            let list = res.data.records
            let total = res.data.total
            if (this.noticeSearch.current == 1) {
              this.noticeList = []
            }
            this.noticeList = this.noticeList.concat(list)
            this.noticeTotal = total
            this.notice_dialog = true
            this.tipsNum = 0
            if (
              this.noticeSearch.current * this.noticeSearch.size <
              this.noticeTotal
            ) {
              this.loading = true
            }
            this.noticeSearch.current++
            this.scrollDisabled = false
          }
        })
      } else {
        //系统通知
        let page = this.noticeSearch.current,
          size = this.noticeSearch.size
        notice_clueCustomerFollowUser(this.corpId, page, size).then((res) => {
          if (res.result) {
            this.loading = false
            let list = []
            let total = res.data.total
            if (res.data.records && res.data.records.length) {
              res.data.records.forEach((el) => {
                let _data = JSON.parse(el.context)
                let obj = {
                  customerPortrait: _data.sendUserInfo.avatar,
                  customerContactName: _data.sendUserInfo.userName,
                  noticeContent: _data.content,
                  promptTime: el.createTime,
                  alt: _data.receiveUserInfo,
                  customerName: el.customerName,
                }
                list.push(obj)
              })
            }
            console.log('content', list)
            if (this.noticeSearch.current == 1) {
              this.noticeList = []
            }
            this.noticeList = this.noticeList.concat(list)
            this.noticeTotal = total
            this.notice_dialog = true
            this.tipsNum = 0
            if (
              this.noticeSearch.current * this.noticeSearch.size <
              this.noticeTotal
            ) {
              this.loading = true
            }
            this.noticeSearch.current++
            this.scrollDisabled = false
          }
        })
      }
    },
    initWebSocket() {
      //初始化weosocket
      let arr = BASE_URL.split('//')
      const wsuri = `wss://${arr[1]}/user-service/ws/${this.token}`
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      console.log('连接成功')
      // let actions = {"test":"12345"}; JSON.stringify(actions)
      // this.websocketsend('111');
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) {
      //数据接收
      // const redata = JSON.parse(e.data);
      this.tipsNum += Number(e.data)
      console.log('数据接收', e, e.data)
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data)
    },
    websocketclose(e) {
      //关闭
      console.log('断开连接', e)
    },
    webSocketCloseFun() {
      this.websock.close()
      // console.log('关闭') //
    },

    changeInput(val) {
      // console.log(val)
      this.input = val
    },
    changeCustom(val) {
      // console.log(val)
      this.input1 = val
    },
    getPageName(data) {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].title == '我的活码' ||
          data[i].title == '我的线索' ||
          data[i].title == '我的客户' ||
          data[i].title == '全部客户' ||
          data[i].title == '群列表' ||
          data[i].title == '个人话术' ||
          data[i].title == '企业信息'
        ) {
          this.routeList.push(data[i].url)
          // console.log('---routeList---', this.routeList)
        } else if (data[i].childrenList.length) {
          this.getPageName(data[i].childrenList)
        }
      }
    },
  },
  filters: {
    $alt(val) {
      let arr = []
      if (val && val.length) {
        val.forEach((el) => {
          arr.push(el.userName)
        })
      }
      return arr.length ? '@' + arr.join('@') : ''
    },
  },
}
</script>
<style lang="less" scoped>
.mainWarp {
  display: flex;
  justify-content: space-between;
  .header_title {
    font-size: 14px;
    color: #3c4353;
    height: 52px;
    border-bottom: 1px solid #f0f2f7;
    padding-left: 16px;
    line-height: 52px;
    font-weight: 600;
  }
  .oneBox {
    border-radius: 8px;
    background: #fff;
    margin-bottom: 16px;
    position: relative;
    .notice_flex {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0px 5px 20px 5px rgba(0, 27, 127, 0.08);
      cursor: pointer;
      position: absolute;
      right: 0;
      bottom: 16px;
      .notice {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 48px;
        .iconfont {
          color: #4168f6;
          font-size: 20px;
        }
      }
      .badge {
        background: #d14343;
        font-size: 12px;
        line-height: 16px;
        color: #fff;
        padding: 0 5px;
        border-radius: 8px;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateY(-50%);
      }
      .notice_list_wrap {
        width: 430px;
        height: 460px;
        background: #fff;
        box-shadow: 0px 5px 20px 5px rgba(0, 27, 127, 0.08);
        border-radius: 8px;
        overflow: hidden;
        position: absolute;
        left: -7px;
        bottom: 0;
        transform: translateX(-100%);
        transition: all 0.25s ease-out;
        &.hidden {
          width: 0;
          height: 0;
        }
        .notice_header {
          width: 100%;
          height: 52px;
          padding: 0 16px;
          border-bottom: 1px solid #f0f2f7;
          display: flex;
          justify-content: space-between;
          .title_box {
            display: flex;
            .title {
              padding: 16px 0;
              margin-right: 24px;
              &.cur {
                color: @main;
                border-bottom: 2px solid @main;
              }
            }
          }
          .notice_close {
            line-height: 52px;
            height: 52px;
          }
        }
        /deep/ .scrollbar_wrap {
          overflow-x: hidden !important;
        }
        .notice_list {
          width: 100%;
          height: calc(100% - 52px);
          .list_box {
            width: 100%;
            .notice_tips {
              width: 100%;
              font-size: 12px;
              line-height: 16px;
              color: @fontSub2;
              text-align: center;
              padding-bottom: 12px;
            }
          }
          .li {
            width: 100%;
            padding: 8px 16px;
            margin-bottom: 8px;
            display: flex;
            position: relative;
            border-top: 1px solid #f0f2f7;
            border-bottom: 1px solid #f0f2f7;
            &:first-child {
              border-top: none;
            }
            .avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              overflow: hidden;
              background: rgba(#d14343, 0.04);
              margin-right: 8px;
              img {
                width: 100%;
                height: 100%;
                &:not([src]) {
                  opacity: 0;
                }
              }
            }
            .val {
              // width: calc(100% - 40px);
              width: 100%;
              color: #000000;
              font-size: 14px;
              line-height: 20px;
              position: relative;
              .name {
                margin-bottom: 6px;
              }
              .des {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .time {
                color: #838a9d;
                position: absolute;
                right: 0;
                top: 0;
              }
            }
          }
        }
        .no_notice {
          width: 100%;
          height: calc(100% - 52px);
          display: flex;
          justify-content: center;
          align-items: center;
          .img {
            width: 200px;
          }
        }
      }
    }
  }
  .left_container {
    // width: 618px;
    width: 44%;
    .custrom {
      // min-width: 618px;
      width: 100%;
      height: 350px;
      .everyBox {
        // float: left;
        color: #fff;
        // width: 285px;
        width: 45%;
        height: 125px;
        border-radius: 8px;
        padding-left: 32px;
        padding-top: 32px;
        .variable {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .describe {
          font-size: 14px;
        }
      }
      .board {
        padding: 15px 16px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        // &::after {
        // 	content: '.';
        // 	display: block;
        // 	height: 0;
        // 	clear: both;
        // 	visibility: hidden;
        // }
      }
      .totalNum {
        background: url('../../assets/images/mainone.png') no-repeat;
        background-size: contain;
      }
      .newAdd {
        background: url('../../assets/images/maintwo.png') no-repeat;
        background-size: contain;
      }
      .disappear {
        margin-top: 16px;
        background: url('../../assets/images/mainfour.png') no-repeat;
        background-size: contain;
      }
      .apply {
        margin-top: 16px;
        background: url('../../assets/images/mainthree.png') no-repeat;
        background-size: contain;
      }
    }
    .groupBase {
      height: 200px;
      .numBox {
        width: 232px;
        text-align: center;
      }
      .groupCont {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 124px;
        .topNum {
          font-size: 24px;
          // color: #4168f6;
          text-align: center;
          margin-bottom: 8px;
        }
        .botTxt {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #838a9d;
        }
      }
    }
    .satisfid {
      height: 200px;
      .reviews {
        height: 170px;
        display: flex;
        align-items: center;
        .satisfaction {
          width: 50%;
          display: flex;
          justify-content: center;
          position: relative;
          &::after {
            top: -60px;
            right: 0;
            position: absolute;
            content: '';
            height: 170px;
            width: 1px;
            background: #f0f2f7;
          }
          .centerImg {
            text-align: center;
            margin: 0 35px;
            font-size: 14px;
            color: #838a9d;
            img {
              margin-bottom: 8px;
            }
          }
          .leftNum {
            line-height: 50px;
            font-size: 24px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #3c4353;
          }
          .rightNum {
            line-height: 50px;
            font-size: 24px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #52bd94;
          }
        }
        .discontent {
          .rightNum {
            color: #d14343;
          }
        }
      }
    }
  }
  .right_container {
    // width: 49%;
    margin-left: 16px;
    flex: 1;
    .shortcuts {
      height: 199px;
      padding-top: 31px;
      img {
        height: 32px;
        width: 32px;
      }
      .descrition {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3c4353;
      }
      .el-row {
        margin-bottom: 16px;
      }
      .el-col {
        text-align: center;
      }
    }
    .lineChart {
      height: 461px;
    }
  }
  /deep/.el-dialog__header {
    background: #fafbff;
    border-radius: 8px 8px 0px 0px;
    border-bottom: 1px solid #f0f2f7;
  }
  /deep/ .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: #3c4353;
  }
  /deep/.el-dialog__body {
    height: 250px;
    padding: 16px 32px;
    .instruction {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #3c4353;
      letter-spacing: 0;
      font-weight: 400;
    }
    .content {
      margin-top: 25px;
      display: flex;
      justify-content: space-around;
      .left {
        text-align: center;
        img {
          width: 114px;
          height: 114px;
          margin-bottom: 16px;
        }
      }
      .right {
        .textPhone {
          text-align: center;
        }
        .bottomText {
          margin-bottom: 16px;
          padding: 16px 0 0 32px;
          width: 220px;
          height: 120px;
          background: #fafbff;
          border-radius: 8px;
          .numberPhone {
            color: #4168f6;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
  .el-button {
    width: 60px;
    height: 32px;
    background: #4168f6;
    border-radius: 4px;
    padding: 0;
  }
}
.el-container {
  .el-main {
    padding: 10px !important;
  }
}
</style>
