<template>
    <div class="home_wrap">
        <div class="row">
            <div class="col data">
                <div class="top">
                    <div class="title_box">
                        <div class="tit">数据看板</div>
                        <div class="nav_box" v-if="dataPermission != 'P0'">
                            <div class="nav" @click="navClickFun(item)" :class="{'cur':search.dataType == item.code}" v-for="item in navList" :key="item.code">{{item.name}}</div>
                        </div>
                        <div class="time">
                            <el-date-picker
                                v-model="time"
                                @change="timeChangeFun"
                                type="daterange"
                                range-separator="-"
                                value-format="yyyy-MM-dd"
                                format="yyyy/MM/dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="card_box">
                        <div class="card" @click="toFun('cardClue')">
                            <div class="item">
                                <div class="text_box">
                                    <div class="total">
                                        <span class="num">{{totalData.clueSum}}</span>
                                        <span class="util">个线索</span>
                                    </div>
                                    <div class="text">已经加微</div>
                                </div>
                                <div class="img_box">
                                    <img class="img" src="@/assets/images/home_xs.png" alt="">
                                </div>
                            </div>
                            <div class="bottom_info" @click.stop="toFun('cardClue','','time')">
                                <div class="num">{{totalData.addClueSum}}</div>
                                <div class="text">新增线索</div>
                            </div>
                        </div>
                        <div class="card" @click="toFun('cardCustomer')">
                            <div class="item">
                                <div class="text_box">
                                    <div class="total">
                                        <span class="num">{{totalData.customerSum}}</span>
                                        <span class="util">个客户</span>
                                    </div>
                                    <div class="text">已经成交</div>
                                </div>
                                <div class="img_box customer">
                                    <img class="img" src="@/assets/images/home_kh.png" alt="">
                                </div>
                            </div>
                            <div class="bottom_info" @click.stop="toFun('cardCustomer','','time')">
                                <div class="num">{{totalData.addCustomerSum}}</div>
                                <div class="text">新增客户</div>
                            </div>
                        </div>
                        <div class="card" @click="toFun('group')">
                            <div class="item">
                                <div class="text_box">
                                    <div class="total">
                                        <span class="num">{{totalData.chatSum}}</span>
                                        <span class="util">个客户群</span>
                                    </div>
                                    <div class="text">查看列表</div>
                                </div>
                                <div class="img_box group">
                                    <img class="img" src="@/assets/images/home_khq.png" alt="">
                                </div>
                            </div>
                            <div class="bottom_info">
                                <div class="num">{{totalData.addChatSum}}</div>
                                <div class="text">新增客户群</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="view">
                    <div class="box">
                        <div class="title_box flex">
                            <div class="tit">我的线索</div>
                            <img class="icon" @click="toFun('clue')" src="@/assets/svg/icon_right.svg" alt="">
                        </div>
                        <div class="list" v-if="clueList && clueList.length">
                            <div class="li" v-for="(item,index) in clueList" :key="item.id">
                                <div class="num">{{index+1}}</div>
                                <div class="info">
                                    <div class="avatar" :class="{'bg':!item.avatar}">
                                        <img v-if="item.avatar" class="img" :src="item.avatar" alt="">
                                        <span v-else>{{item.customerCalled | $textAvatar}}</span>
                                        <img class="logo" v-if="item.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                                        <img class="logo" v-if="item.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
                                    </div>
                                    <div class="val">
                                        <div class="name">{{item.customerCalled}}</div>
                                        <div class="alt" :class="{'green':item.externalType == 1}">{{item | $alt}}</div>
                                    </div>
                                </div>
                                <div class="type">{{item.clueTypeName}}</div>
                            </div>
                        </div>
                        <div class="no_notice" v-else>
                            <img class="img" src="@/assets/images/nodae.png" />
                        </div>
                    </div>
                    <div class="box">
                        <div class="title_box flex">
                            <div class="tit">我的客户</div>
                            <img class="icon" @click="toFun('customer')" src="@/assets/svg/icon_right.svg" alt="">
                        </div>
                        <div class="list" v-if="customerList && customerList.length">
                            <div class="li" v-for="(item,index) in customerList" :key="index">
                                <div class="num">{{index+1}}</div>
                                <div class="info">
                                    <div class="avatar" :class="{'bg':!item.avatar}">
                                        <img v-if="item.avatar" class="img" :src="item.avatar" alt="">
                                        <span v-else>{{item.customerCalled | $textAvatar}}</span>
                                        <img class="logo" v-if="item.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                                        <img class="logo" v-if="item.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
                                    </div>
                                    <div class="val">
                                        <div class="name">{{item.customerCalled}}</div>
                                        <div class="alt" :class="{'green':item.externalType == 1}">{{item | $alt}}</div>
                                    </div>
                                </div>
                                <div class="type">{{item.stage}}</div>
                            </div>
                        </div>
                        <div class="no_notice" v-else>
                            <img class="img" src="@/assets/images/nodae.png" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col notice">
                <div class="scroll_box">
                    <div class="icon_title">
                        <img class="icon" src="@/assets/svg/icon_news.svg" alt="">
                        <div class="tit">全部动态</div>
                    </div>
                    <el-scrollbar class="scrollbar_content" v-if="allDynamicTotal > 0" wrap-class="scrollbar_wrap">
                        <div class="time_list" v-infinite-scroll="noticeLoadFun" :infinite-scroll-disabled="scrollDisabled">
                            <div class="li" @click="toFun('detail',item)" v-for="(item,index) in allDynamicList" :key="index" :data-id="item.id">
                                <div class="name">
                                    <span v-if="noNameList.indexOf(item.optType) == -1">{{item.optUserName}}</span>
                                    <span>{{$getTextFun(item)}}</span>
                                </div>
                                <div class="time">{{moment(item.createTime).fromNow()}}</div>
                            </div>
                            <div class="no_tips" v-if="!allLoading">没有更多了~</div>
                        </div>
                    </el-scrollbar>
                    <div class="no_notice" v-else>
                        <img class="img" src="@/assets/images/nodae.png" />
                    </div>
                </div>
                <div class="scroll_box">
                    <div class="icon_title">
                        <img class="icon" src="@/assets/svg/icon_log.svg" alt="">
                        <div class="tit">跟进记录</div>
                    </div>
                    <el-scrollbar class="scrollbar_content" v-if="followTotal > 0" wrap-class="scrollbar_wrap">
                        <div class="time_list" v-infinite-scroll="followLoadFun" :infinite-scroll-disabled="scrollDisabled_follow">
                            <div class="li" @click="toFun('detail',item)" v-for="(item,index) in followList" :key="index" :data-id="item.id">
                                <div class="name">
                                    <span v-if="noNameList.indexOf(item.optType) == -1">{{item.optUserName}}</span>
                                    <span>{{$getTextFun(item)}}</span>
                                </div>
                                <div class="time">{{moment(item.createTime).fromNow()}}</div>
                            </div>
                            <div class="no_tips" v-if="!followLoading">没有更多了~</div>
                        </div>
                    </el-scrollbar>
                    <div class="no_notice" v-else>
                        <img class="img" src="@/assets/images/nodae.png" />
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="温馨提示" class="dialog_wrap" :visible.sync="dialog" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" width="520px">
            <div class="dialog_content">
                <div class="instruction">感谢您认可我们的产品，如需继续使用，请联系我们的客服，可通过扫描二维码或电话联系我们。</div>
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
            </div>
        </el-dialog>
    </div>
</template>

<script>
import MyMixin from '@/mixins/permissions'
import {
    cluecustomer_fnHomePage,
    my_queryFollowMsgPage,
} from '@/api/customer'
import {
  user_getUserName,
} from '@/api/home'
import { settings } from '@/config/api'
export default {
    mixins: [MyMixin],
    data(){
        return {
            noNameList: [57,70],
            navList: [
                { name: '全员数据',code: 2},
                { name: '个人数据',code: 1}
            ],
            activeNav: 2,
            time: [],
            clueList: [],
            customerList: [],
            search: {
                dataType: 2,    //1个人 2全员
                createTimeSta: '',
                createTimeEnd: '',
            },
            searchMsg: {    //动态
                limit: 20,
                page: 1,
                isMang: 0,
                punckStatus: 0,
                queryFlag: 6,
            },
            searchFollow: {    //跟进动态
                limit: 20,
                page: 1,
                isMang: 0,
                punckStatus: 0,
                queryFlag: 2,
            },
            followList: [],
            followTotal: 0,
            allDynamicList: [],
            allDynamicTotal: 0,
            totalData: {},
            allLoading: false,
            followLoading: false,
            scrollDisabled: false,
            scrollDisabled_follow: false,
            dialog: false,
        }
    },
    computed: {
        dataPermission(){   //数据权限
            return this.$store.getters.dataPermission
        }
    },
    mounted(){
        this.$store.dispatch('getCorpId').then(() => {})
        this.initFun()
    },
    methods: {
        initFun(){  //初始化进入
            let arr = [this.moment().subtract(7, 'days').format('YYYY-MM-DD'),this.moment().format('YYYY-MM-DD')]
            this.time = arr
            this.search.createTimeSta = arr[0] + ' 00:00:00'
            this.search.createTimeEnd = arr[1] + ' 23:59:59'
            this.getDataView()
            this.getDynamic('first')
            this.getUserName()
            this.commonSettingfn()
        },
        commonSettingfn() {
            settings().then((res) => {
                if(res.result){
                    this.$store.commit('SET_COMMONSETTING', res.data)
                }
            })
        },
        getUserName() {
            user_getUserName().then((res) => {
                if (res.result) {
                    this.dialog = !res.data.haveSecret
                }
            })
        },
        navClickFun(row){
            this.search.dataType = row.code
            this.getDataView()
        },
        toFun(type,row,time){
            let url = '',query = null
            switch (type) {
                case 'detail':
                    url = '/customerManagement/cluesDetail'
                    query = {
                        type: row.type,
                        customno: row.clueCustomerNo,
                        expandedKeys: JSON.stringify(this.expandedKeys),
                    }
                    // let link = null
                    // switch (Number(row.type)) {
                    //     case 1:
                    //         link = '/customerManagement/account'
                    //         break;
                    //     case 2:
                    //         link = '/customerManagement/role'
                    //         break;
                    //     case 3:
                    //         link = '/customerManagement/myCustome'
                    //         break;
                    //     case 4:
                    //         link = '/customerManagement/customeGroup'
                    //         break;
                    //     default:
                    //         break;
                    // }
                    // let permissionsList = JSON.parse(sessionStorage.getItem('permissionsList'))
                    // this.$listFilter(permissionsList,link)
                    break;
                case 'clue':
                    url = '/customerManagement/account'
                    break;
                case 'customer':
                    url = '/customerManagement/myCustome'
                    break;
                case 'group':
                    url = '/customerManagement/groupList'
                    break;
                case 'cardClue':
                    query = {}
                    if(this.search.dataType == 2){
                        url = '/customerManagement/allClue'
                    }else{
                        url = '/customerManagement/account'
                        query.fzr = true
                    }
                    if(time){
                        query.time = true
                        localStorage.setItem('home_time',JSON.stringify(this.time))
                    }
                    break;
                case 'cardCustomer':
                    query = {}
                    if(this.search.dataType == 2){
                        url = '/customerManagement/myAllCus'
                    }else{
                        url = '/customerManagement/myCustome'
                        query.fzr = true
                    }
                    if(time){
                        query.time = true
                        localStorage.setItem('home_time',JSON.stringify(this.time))
                    }
                    break;
                default:
                    break;
            }
            this.$emit('father',url,query)
        },
        timeChangeFun(e){
            if(e && e.length > 0){
                this.search.createTimeSta = e[0] + ' 00:00:00'
                this.search.createTimeEnd = e[1] + ' 23:59:59'
            }else{
                this.search.createTimeSta = ''
                this.search.createTimeEnd = ''
            }
            this.getDataView()
        },
        getDataView(){  //获取首页信息
            if(this.dataPermission == 'P0'){
                this.search.dataType = 1
            }
            cluecustomer_fnHomePage(this.search).then(res => {
                if(res.result){
                    let data = res.data
                    this.totalData = data.sum
                    this.clueList = data.myClue
                    this.customerList = data.myCustomer
                }
            })
        },
        getDynamic(type){   //获取全部动态
            this.scrollDisabled = true
            my_queryFollowMsgPage(this.searchMsg).then(res => {
                if(res.result){
                    this.allLoading = false
                    let data = res.data.data
                    let list = data.records
                    if(list && list.length > 0){
                        list.forEach(el => {
                            el.fromUser = el.fromUser ? JSON.parse(el.fromUser) : el.fromUser
                            el.toUser = el.toUser ? JSON.parse(el.toUser) : el.toUser
                        })
                    }
                    this.allDynamicTotal = data.total
                    if (this.searchMsg.page == 1) {
                        this.allDynamicList = []
                    }
                    this.allDynamicList = this.allDynamicList.concat(list)
                    if (this.searchMsg.page * this.searchMsg.limit < this.allDynamicTotal) {
                        this.allLoading = true
                    }
                    this.searchMsg.page++
                    this.scrollDisabled = false
                    if(type == 'first'){
                        this.getFollowMsg()
                    }
                }
            })
        },
        getFollowMsg(){   //获取跟进动态   全部 6  跟进 2
            this.scrollDisabled_follow = true
            my_queryFollowMsgPage(this.searchFollow).then(res => {
                if(res.result){
                    this.followLoading = false
                    let data = res.data.data
                    let list = data.records
                    if(list && list.length > 0){
                        list.forEach(el => {
                            el.fromUser = el.fromUser ? JSON.parse(el.fromUser) : el.fromUser
                            el.toUser = el.toUser ? JSON.parse(el.toUser) : el.toUser

                            let whiteList = [21]
                            if(whiteList.indexOf(el.optType) > -1){
                                el.context = JSON.parse(el.context)
                            }
                        })
                    }
                    this.followTotal = data.total
                    if (this.searchFollow.page == 1) {
                        this.followList = []
                    }
                    this.followList = this.followList.concat(list)
                    if (this.searchFollow.page * this.searchFollow.limit < this.followTotal) {
                        this.followLoading = true
                    }
                    this.searchFollow.page++
                    this.scrollDisabled_follow = false
                }
            })
        },
        noticeLoadFun() {   //滚动加载 全部
            if (!this.allLoading) {
                return false
            }
            this.getDynamic()
        },
        followLoadFun(){    //滚动加载 跟进
            if (!this.followLoading) {
                return false
            }
            this.getFollowMsg()
        },
    },
}
</script>

<style lang="less" scoped>
@navColor:#5880F5;
@cirClue:#FF8A27;
@cirCustomer:#558EFE;
@cirGroup:#4245FB;
@type:#B3B3B3;
@dot:#D8D8D8;
.dialog_wrap{
    .dialog_content{
        height: 250px;
        padding: 16px 32px;
    }
    .instruction {
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
.home_wrap{
    width: 100%;
    min-height: 100%;
    .title_box{
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        position: relative;
        &.flex{
            justify-content: space-between;
            .icon{
                width: 20px;
                height: auto;
                cursor: pointer;
            }
        }
        .tit{
            font-size: 18px;
            line-height: 22px;
            color: @fontMain;
            font-weight: bold;
        }
        .nav_box{
            display: flex;
            margin-left: 12px;
            .nav{
                color: @fontMain;
                font-size: 12px;
                line-height: 16px;
                padding: 4px 11px;
                cursor: pointer;
                border: 1px solid @navBd;
                &.cur{
                    color: @white;
                    background: @navColor;
                    border-color: @navColor;
                }
                &:first-child{
                    border-radius: 4px 0px 0px 4px;
                    border-right: none;
                }
                &:last-child{
                    border-radius: 0px 4px 4px 0px;
                    border-left: none;
                }
            }
        }
        .time{
            width: 240px;
            position: absolute;
            right: 0;
            .el-date-editor{
                width: 100%;
            }
        }
    }
    .row{
        width: 100%;
        display: flex;
        .col{
            width: 376px;
            margin-left: 16px;
            &.data{
                flex: 1;
                margin: 0;
                display: flex;
                flex-direction: column;
                .top{
                    width: 100%;
                    height: 242px;
                    background: @white;
                    margin-bottom: 16px;
                    border-radius: 12px;
                    padding: 16px;
                }
                .view{
                    width: 100%;
                    display: flex;
                    flex: 1;
                    .box{
                        width: calc(50% - 8px);
                        background: @white;
                        border-radius: 12px;
                        padding: 16px 16px 0;
                        &:last-child{
                            margin-left: 16px;
                        }
                    }
                }
            }
            .scroll_box{
                width: 100%;
                height: 398px;
                min-height: calc((100vh - 104px)/ 2);
                background: @white;
                margin-bottom: 16px;
                border-radius: 12px;
                padding: 16px;
                &:last-child{
                    margin-bottom: 0;
                }
                .icon_title{
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                    .icon{
                        width: 22px;
                        height: 22px;
                        margin-right: 8px;
                    }
                    .tit{
                        font-size: 16px;
                        line-height: 22px;
                        color: @fontMain;
                        font-weight: bold;
                    }
                }
                .time_list{
                    width: 100%;
                    position: relative;
                    &::before{
                        content: '';
                        width: 0;
                        height: calc(100% - 30px);
                        border-left: 1px dashed @dashedLine;
                        position: absolute;
                        left: 3px;
                        top: 8px;
                    }
                    .li{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        line-height: 16px;
                        margin-bottom: 16px;
                        padding-left: 18px;
                        cursor: pointer;
                        position: relative;
                        &:last-child{
                            margin-bottom: 0;
                        }
                        &::before{
                            content: '';
                            width: 7px;
                            height: 7px;
                            border-radius: 50%;
                            background: @dot;
                            position: absolute;
                            left: 0;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        .name{
                            color: @fontMain;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: calc(100% - 70px);
                        }
                        .time{
                            color: @type;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .no_tips{
                        width: 100%;
                        font-size: 12px;
                        line-height: 16px;
                        color: @fontSub2;
                        text-align: center;
                    }
                }
                /deep/ .scrollbar_wrap {
                    overflow-x: hidden !important;
                }
                .scrollbar_content{
                    width: 100%;
                    height: calc(100% - 44px);
                }
            }
        }
    }
    .card_box{
        width: 100%;
        display: flex;
        .card{
            flex: 1;
            height: 168px;
            background: linear-gradient(315deg, #55A7FE 0%, #55BBFE 100%);
            box-shadow: 0px 3px 12px 0px rgba(#55A7FE, 0.3);
            margin-right: 16px;
            border-radius: 8px;
            padding: 28px 16px 0 16px;
            cursor: pointer;
            transition: all .25s;
            overflow: hidden;
            position: relative;
            &:hover{
                box-shadow: 5px 10px 15px 0px rgba(#55A7FE, 0.5);
                transform: scale(1.04);
            }
            &:first-child{
                background: linear-gradient(341deg, #FFAE20 0%, #FFC96A 100%);
                box-shadow: 0px 3px 12px 0px rgba(#FFB635, 0.3);
                &:hover{
                    box-shadow: 5px 10px 15px 0px rgba(#FFB635, 0.5);
                    transform: scale(1.04);
                }
            }
            &:last-child{
                background: linear-gradient(137deg, #4390FF 0%, #4168F6 100%);
                box-shadow: 0px 3px 12px 0px rgba(#4390FF, 0.3);
                margin-right: 0;
                &:hover{
                    box-shadow: 5px 10px 15px 0px rgba(#4390FF, 0.5);
                    transform: scale(1.04);
                }
            }
            .item{
                width: 100%;
                display: flex;
                .text_box{
                    width: calc(100% - 74px);
                    color: @white;
                    font-weight: 500;
                    .total{
                        display: flex;
                        align-items: flex-end;
                        margin-bottom: 8px;
                        .num{
                            font-size: 32px;
                            line-height: 36px;
                        }
                        .util{
                            font-size: 16px;
                            line-height: 28px;
                            margin-left: 4px;
                        }
                    }
                    .text{
                        font-size: 16px;
                        line-height: 20px;
                        font-weight: 500;
                    }
                }
                .img_box{
                    width: 74px;
                    height: 74px;
                    border-radius: 50%;
                    background: rgba(@cirClue,.28);
                    position: relative;
                    &.customer{
                        background: rgba(@cirCustomer,.28);
                    }
                    &.group{
                        background: rgba(@cirGroup,.28);
                    }
                    .img{
                        width: 60px;
                        height: auto;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
            .bottom_info{
                width: 100%;
                height: 48px;
                background: rgba(255, 255, 255, 0.16);
                box-shadow: -1px 1px 0px 0px rgba(255, 255, 255, 0.7);
                border-top: 1px solid rgba(@white,.7);
                color: @white;
                padding: 14px 16px;
                display: flex;
                align-items: flex-end;
                position: absolute;
                left: 0;
                bottom: 0;
                .num{
                    font-size: 20px;
                    line-height: 24px;
                    font-weight: 500;
                }
                .text{
                    font-size: 12px;
                    line-height: 20px;
                    margin-left: 6px;
                }
            }
        }
    }
    .list{
        width: 100%;
        .li{
            width: 100%;
            display: flex;
            align-items: center;
            padding: 12px 0;
            .num{
                font-size: 18px;
                line-height: 24px;
                color: @fontMain;
                font-weight: 600;
                margin-right: 30px;
            }
            .info{
                width: calc(100% - 100px);
                display: flex;
                align-items: center;
                .avatar{
                    width: 30px;
                    height: 30px;
                    margin-right: 12px;
                    text-align: center;
                    position: relative;
                    &.bg{
                        background: @main;
                        border-radius: 50%;
                    }
                    span{
                        display: block;
                        color: @white;
                        line-height: 30px;
                    }
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                    .logo{
                        width: 13px;
                        height: 13px;
                        position: absolute;
                        right: -2px;
                        bottom: -2px;
                    }
                }
                .val{
                    display: flex;
                    align-items: center;
                    width: calc(100% - 42px);
                    .name{
                        font-size: 16px;
                        line-height: 20px;
                        color: @fontMain;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 50%;
                    }
                    .alt{
                        font-size: 12px;
                        line-height: 16px;
                        color: @yellow;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-left: 6px;
                        &.green{
                            color: @green;
                        }
                    }
                }
            }
            .type{
                font-size: 14px;
                line-height: 20px;
                color: @type;
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
@media (max-width: 1200px) {
    /deep/ html,body{
        min-width: none;
    }
    .notice {
        display: none;
    }
}
</style>