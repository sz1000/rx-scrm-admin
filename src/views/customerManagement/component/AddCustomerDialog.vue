<template>
    <DetailDialog :title="title" :modalClick="false" width="736px" v-model="dialog">
        <div class="seek_content" v-loading="loading">
            <div class="search_item">
                <div class="label">客户名称：</div>
                <div class="val">
                    <el-input v-model="search.searchParam" @input="searchFun" maxlength="13" placeholder="请输入客户名称"></el-input>
                </div>
            </div>
            <div class="list_item" v-if="search.page < 2 && preciseList.length">
                <div class="tips">找到完全相同名称的客户：</div>
                <div class="list">
                    <div class="li" v-for="(item,index) in preciseList" :key="index">
                        <div class="info">
                            <div class="avatar" :class="{'bg':!item.avatar}">
                                <img class="img" v-if="item.avatar" :src="item.avatar" alt="">
                                <span class="text" v-else>{{item.oldCusName | avatar}}</span>
                                <img class="logo" v-if="item.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                                <img class="logo" v-if="item.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
                            </div>
                            <div class="val">
                                <div class="name_box">
                                    <div class="name" :class="{'main':item.customerCalled == search.searchParam}" v-html="item.customerCalled"></div>
                                    <div class="alt" :class="{'green':item.externalType == 1}">{{item | alt}}</div>
                                </div>
                                <div class="text_box">
                                    <div class="time">建档时间：{{item.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</div>
                                    <div class="person">负责人：{{item | optString}}<span v-if="userNo == item.userNo">(我)</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list_item" v-if="total > 0">
                <div class="tips">找到以下相似客户：</div>
                <div class="list">
                    <div class="li" v-for="(item,index) in dimList" :key="index">
                        <div class="info">
                            <div class="avatar" :class="{'bg':!item.avatar}">
                                <img class="img" v-if="item.avatar" :src="item.avatar" alt="">
                                <span class="text" v-else>{{item.oldCusName | avatar}}</span>
                                <img class="logo" v-if="item.externalType == 1" src="@/assets/svg/wx.svg" alt="">
                                <img class="logo" v-if="item.externalType == 2" src="@/assets/svg/wx_q.svg" alt="">
                            </div>
                            <div class="val">
                                <div class="name_box">
                                    <div class="name" :class="{'main':item.customerCalled == search.searchParam}" v-html="item.customerCalled"></div>
                                    <div class="alt" :class="{'green':item.externalType == 1}">{{item | alt}}</div>
                                </div>
                                <div class="text_box">
                                    <div class="time">建档时间：{{item.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</div>
                                    <div class="person">负责人：{{item | optString}}<span v-if="userNo == item.userNo">(我)</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="noData" :class="{'pdt':search.searchParam}" v-if="total == 0 && preciseList.length == 0">
                <div class="box">
                    <img class="img" :src="noDataImg" alt="">
                    <div class="text">{{search.searchParam ? '没有找到相似客户' : '请先完成客户检索'}}</div>
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
            <el-button type="primary" :disabled="preciseList.length ? true : false" size="medium" @click="confirmFun">下一步</el-button>
        </template>
    </DetailDialog>
</template>

<script>
import { DetailDialog } from '@/components'
import { 
    queryClue_customers,
} from '@/api/customer'
export default {
    name: 'AddCustomerDialog',
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
        type: {
            type: String,
            default: ''
        },
        isReload: {
            type: Boolean,
            default: true
        },
    },
    data(){
        return {
            search: {
                searchParam: '',
                corpId: '',
                type: '',
                isFriend: 0,
                page: 1,
                limit: 20,
            },
            preciseList: [],    //绝对匹配
            dimList: [],        //相似
            total: 0,
            loading: false,
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
            return token.split('|')[1]
        },
        noDataImg(){
            let url = require('@/assets/svg/noData_search.svg')
            if(this.search.searchParam){
                url = require('@/assets/svg/nodata_empty.svg')
            }
            return url
        },
        title(){
            return this.name ? '编辑客户' : '新增客户'
        },
    },
    methods: {
        confirmFun(){   //确定
            if(this.preciseList.length){ return false }
            console.log('sure confirm',this.search.searchParam)
            this.dialog = false
            this.$emit('sure',this.search.searchParam)
        },
        getList(){      //获取相似客户
            this.loading = true
            this.search.corpId = this.corpId
            this.search.type = this.type
            queryClue_customers(this.search,true).then(res => {
                if(res.result){
                    this.loading = false
                    let data = res.data
                    this.preciseList = data.preciseData
                    this.dimList = data.dimData.records
                    this.total = data.dimData.total
                }
            })
        },
        pageFun(val){
            this.search.page = val
			this.getList()
        },
        searchFun(){
            if(this.search.searchParam == ''){
                this.preciseList = []
                this.dimList = []
                this.total = 0
            }else{
                this.search.page = 1
                this.getList()
            }
        },
    },
    watch: {
        dialog(val){
            if(val){
                if(this.isReload){
                    this.search.searchParam = ''
                    this.preciseList = []
                    this.dimList = []
                    this.total = 0
                }
                if(this.name){
                    this.search.searchParam = this.name
                    console.log('asd confirm')
                    this.getList()
                }
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
            // console.log(val.externalType)
            return Number(val.externalType) ? val.externalType == 1 ? '@微信' : `@${val.customerName}` || `@${val.cropFullName}` : ''
        },
    },
}
</script>

<style lang="less" scoped>
.noData{
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 30px 0 0;
    &.pdt{
        padding-top: 70px;
    }
    .box{
        display: flex;
        justify-content: center;
        flex-flow: column;
        text-align: center;
        .img{
            background: @white;
            width: 220px;
            height: auto;
            margin-bottom: 8px;
        }
        .text{
            font-size: 14px;
            line-height: 22px;
            color: @fontSub2;
        }
    }
}
.seek_content{
    padding: 15px 32px;
    .search_item{
        font-size: 14px;
        line-height: 20px;
        color: @fontMain;
        display: flex;
        align-items: center;
        .label{
            width: 70px;
        }
        .val{
            width: calc(100% - 70px);
        }
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
                    margin-left: 60px;
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