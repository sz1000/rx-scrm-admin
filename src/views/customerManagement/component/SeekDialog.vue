<template>
    <DetailDialog title="找到相似客户" :modalClick="false" width="736px" v-model="dialog">
        <div class="seek_content">
            <div class="name">线索名称：{{name}}</div>
            <div class="list_item" v-if="search.page < 2 && list.length">
                <div class="tips">找到完全相同名称的客户：</div>
                <div class="list">
                    <div class="li" @click="radioFun(item,index)" v-for="(item,index) in list" :key="item.clueCustomerNo">
                        <div class="info">
                            <div class="avatar" :class="{'bg':!item.avatar}">
                                <img class="img" v-if="item.avatar" :src="item.avatar" alt="">
                                <span class="text" v-else>{{item.oldCusName | avatar}}</span>
                                <img class="logo" v-if="item.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                                <img class="logo" v-if="item.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
                            </div>
                            <div class="val">
                                <div class="name_box">
                                    <div class="name" :class="{'main':item.customerCalled == name}" v-html="item.customerCalled"></div>
                                    <div class="alt" :class="{'green':item.externalType == 1}">{{item | alt}}</div>
                                </div>
                                <div class="text_box">
                                    <div class="time">建档时间：{{item.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</div>
                                    <div class="person">负责人：{{item | optString}}<span v-if="userNo == item.userNo">(我)</span></div>
                                </div>
                            </div>
                        </div>
                        <el-radio v-if="userNo == item.userNo" class="radio" size="medium" v-model="radioId" :label="item.clueCustomerNo"></el-radio>
                    </div>
                </div>
            </div>
            <div class="list_item" v-if="dimList.length">
                <div class="tips">找到以下相似客户：</div>
                <div class="list">
                    <div class="li" @click="radioFun(item,index)" v-for="(item,index) in dimList" :key="item.clueCustomerNo">
                        <div class="info">
                            <div class="avatar" :class="{'bg':!item.avatar}">
                                <img class="img" v-if="item.avatar" :src="item.avatar" alt="">
                                <span class="text" v-else>{{item.oldCusName | avatar}}</span>
                                <img class="logo" v-if="item.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                                <img class="logo" v-if="item.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
                            </div>
                            <div class="val">
                                <div class="name_box">
                                    <div class="name" :class="{'main':item.customerCalled == name}" v-html="item.customerCalled"></div>
                                    <div class="alt" :class="{'green':item.externalType == 1}">{{item | alt}}</div>
                                </div>
                                <div class="text_box">
                                    <div class="time">建档时间：{{item.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</div>
                                    <div class="person">负责人：{{item | optString}}<span v-if="userNo == item.userNo">(我)</span></div>
                                </div>
                            </div>
                        </div>
                        <el-radio v-if="userNo == item.userNo" class="radio" size="medium" v-model="radioId" :label="item.clueCustomerNo"></el-radio>
                    </div>
                </div>
            </div>
            <div class="pagination_wrap">
                <el-pagination
                    hide-on-single-page
                    layout="total, prev, pager, next"
                    @current-change="pageFun"
                    :current-page="search.page"
                    :page-size="search.limit"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <template slot="detailFooter">
            <el-button :type="radioId == null ? 'primary' : 'warning'" size="medium" @click="confirmFun">{{operaBtn}}</el-button>
        </template>
    </DetailDialog>
</template>

<script>
import { DetailDialog } from '@/components'
import { 
    queryClue_customers,
    cluecustomer_clueMergeToCustomer,
    cluecustomer_wechat_Contact,        //是否微信好友
} from '@/api/customer'
export default {
    name: 'SeekDialog',
    components: {
        DetailDialog
    },
    props: {
        value:{
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            search: {
                searchParam: '',
                corpId: '',
                type: '3',
                // isFriend: 0,
                page: 1,
                limit: 20,
            },
            radio: null,
            radioId: null,
            preciseList: [],    //绝对匹配
            dimList: [],        //相似
            total: 0,
            isWxFriends: false,
        }
    },
    computed: {
        dialog: {
            get(){
                return this.value
            },
            set(val){
                this.$emit('input',val)
            }
        },
        corpId() {
            return this.$store.getters.corpId
        },
        userNo() {
            let token = this.$store.getters.token
            return token ? token.split('|')[1] : ''
        },
        list(){
            let list = []
            if(this.isWxFriends){
                list = this.preciseList.filter(el => {
                    return Number(el.isFriend) == 0
                })
                list = list ? list : []
            }else{
                list = this.preciseList
            }
            return list
        },
        operaBtn(){
            return this.radioId == null ? '转为新客户' : '将线索与该客户合并'
        },
    },
    methods: {
        confirmFun(){   //确定
            if(this.radioId == null){
                this.dialog = false
                this.$emit('sure')
            }else{     //线索合客户
                let obj = {
                    clueNo: this.id,
                    customerNo: this.radioId,
                }
                console.log('sub',obj)
                // return false
                cluecustomer_clueMergeToCustomer(obj).then(res => {
                    if(res.result){
                        this.dialog = false
                        this.$message({ type: 'success', message: '合并成功!'})
                        this.$router.replace('/customerManagement/account')
                    }
                })
            }
        },
        getIsWxFriends(){   //是否微信好友
            let data = {
                userNo: this.userNo,
                customerNo: this.id,
                corpId: this.corpId,
            }
            cluecustomer_wechat_Contact(data).then(res => {
                if(res.result){
                    this.isWxFriends = res.data
                    this.getList()
                }
            })
        },
        getList(){      //获取相似客户
            this.search.searchParam = this.name
            this.search.corpId = this.corpId
            queryClue_customers(this.search).then(res => {
                if(res.result){
                    let data = res.data
                    console.log('result',data.dimData)
                    this.preciseList = data.preciseData
                    this.dimList = data.dimData.records
                    this.total = data.dimData.total
                }
            })
        },
        radioFun(row,i){
            if(row.userNo == this.userNo){
                if(this.radioId == row.clueCustomerNo){
                    this.radio = null
                    this.radioId = null
                }else{
                    // this.radio = i
                    this.radioId = row.clueCustomerNo
                }
            }
        },
        pageFun(val){
            this.search.page = val
			this.getList()
        },
    },
    watch: {
        dialog(val){
            if(val){
                this.preciseList = []
                this.dimList = []
                this.total = 0
                this.radio = null
                this.getIsWxFriends()
            }
        }
    },
    filters: {
        avatar(val){
            return val ? val.substring(0,1) : ''
        },
        optString(val){
            return val.userName && val.deptName ? `${val.userName}-${val.deptName}` : val.userName
        },
        alt(val){
            return Number(val.externalType) ? val.externalType == 1 ? '@微信' : `@${val.customerName}` || `@${val.cropFullName}` : ''
        },
    },
}
</script>

<style lang="less" scoped>
.seek_content{
    padding: 15px 32px;
    .name{
        font-size: 14px;
        line-height: 20px;
        color: @fontMain;
    }
    .tips{
        font-size: 14px;
        line-height: 20px;
        color: @fontSub2;
        margin: 20px 0 8px;
    }
    .list_item{
        margin-bottom: 20px;
        &:last-child{
            margin-bottom: 0;
        }
    }
    .list{
        width: 100%;
        margin-bottom: 20px;
        .li{
            width: 100%;
            height: 52px;
            padding: 10px 72px 10px 0;
            word-break: break-all;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            &:hover::after{
                content: '';
                width: calc(100% + 32px);
                height: 100%;
                background: rgba(@main,.03);
                position: absolute;
                left: -16px;
                top: 0;
            }
            &::before{
                content: '';
                height: 1px;
                width: calc(100% + 32px);
                background: @lineColor;
                position: absolute;
                left: -16px;
                bottom: 0;
            }
            .info{
                width: 100%;
                display: flex;
                align-items: center;
                .avatar{
                    width: 32px;
                    height: 32px;
                    position: relative;
                    margin-right: 8px;
                    text-align: center;
                    &.bg{
                        background: @main;
                        border-radius: 50%;
                    }
                    .img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                    .text{
                        line-height: 32px;
                        font-size: 14px;
                        color: @white;
                    }
                    .logo{
                        width: 18px;
                        height: 18px;
                        position: absolute;
                        right: -2px;
                        bottom: -2px;
                    }
                }
                .val{
                    width: calc(100% - 40px);
                }
                .name_box{
                    width: 100%;
                    display: flex;
                    align-items: center;
                }
                .name{
                    font-size: 16px;
                    line-height: 22px;
                    color: @fontMain;
                    margin-right: 2px;
                    &.main{
                        color: @main;
                    }
                }
                .alt{
                    font-size: 12px;
                    line-height: 16px;
                    color: @yellow;
                    &.green{
                        color: @green;
                    }
                }
            }
            .text_box{
                width: 100%;
                display: flex;
                align-items: center;
                color: @fontSub2;
                font-size: 12px;
                .time{
                    line-height: 20px;
                }
                .person{
                    line-height: 20px;
                    margin-left: 40px;
                }
            }
            /deep/ .radio{
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                .el-radio__label{
                    display: none;
                }
                .el-radio__input{
                    font-size: 0;
                }
                .el-radio__inner{
                    width: 18px;
                    height: 18px;
                }
                .el-radio__inner::after{
                    content: '';
                    width: 5px;
                    height: 5px;
                }
            }
        }
    }
    .pagination_wrap{
        text-align: center;
    }
}
</style>