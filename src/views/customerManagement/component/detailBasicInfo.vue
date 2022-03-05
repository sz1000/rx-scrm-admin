<template>
    <div class="info_box" v-if="data">
        <section class="info_row">
            <div class="table_head">
                <img src="@/assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span>基本信息</span>
            </div>
            <div class="table_box">
                <div class="rowTable">
                    <span class="keyText">{{getDetailType('name')}}名称</span>
                    <span class="valueTxt">{{data.customerCalled}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">{{getDetailType('name')}}来源</span>
                    <span class="valueTxt">{{data.sourceName}}</span>
                </div>
                <div class="rowTable" v-if="getDetailType('code') == 'customer'">
                    <span class="keyText">客户阶段</span>
                    <span class="valueTxt">{{data.stage}}</span>
                </div>
                <div class="rowTable" v-if="getDetailType('code') == 'customer'">
                    <span class="keyText">客户类型</span>
                    <span class="valueTxt">{{data.customerTypeName}}</span>
                </div>
                <div class="rowTable" v-else>
                    <span class="keyText">线索类型</span>
                    <span class="valueTxt">{{data.clueTypeName}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">{{timeTypeName}}</span>
                    <span class="valueTxt">{{data.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
            </div>
        </section>
        <section class="info_row">
            <div class="table_head">
                <img src="@/assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span>企业信息</span>
            </div>
            <div class="table_box">
                <div class="rowTable">
                    <span class="keyText">企业名称</span>
                    <span class="valueTxt">{{data.cropFullName}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">企业简称</span>
                    <span class="valueTxt">{{data.customerName}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">企业规模</span>
                    <span class="valueTxt">{{data.cropscale}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">行业领域</span>
                    <span class="valueTxt">{{data.cropSubIndustry}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">固定电话</span>
                    <span class="valueTxt">{{data.mobil}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">办公地址</span>
                    <span class="valueTxt">{{data.address}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">备注</span>
                    <span class="valueTxt" :title="data.remark">{{data.remark }}</span>
                </div>
            </div>
        </section>
        <section class="info_row">
            <div class="table_head">
                <img src="@/assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span>联系人信息</span>
            </div>
            <div class="table_box">
                <div class="rowTable">
                    <span class="keyText">联系人</span>
                    <span class="valueTxt">{{ data.name }}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">手机号</span>
                    <span class="valueTxt">{{ data.phone }}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">微信昵称</span>
                    <span class="valueTxt">{{ data.wechatNickname }}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">微信号</span>
                    <span class="valueTxt">{{ data.weixin }}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">头像</span>
                    <span class="valueTxt">
                        <img :src="data.avatar" alt="" v-if="data.avatar" />
                    </span>
                </div>
                <div class="rowTable">
                    <span class="keyText">性别</span>
                    <span class="valueTxt">{{data.gender | $gender}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">职务</span>
                    <span class="valueTxt">{{ data.position }}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">邮箱</span>
                    <span class="valueTxt">{{data.email}}</span>
                </div>
            </div>
        </section>
        <section class="info_row" v-if="list && list.length">
            <div class="table_head">
                <img src="@/assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span>自定义信息</span>
            </div>
            <div class="table_box">
                <div class="rowTable" v-for="(item,index) in list" :key="index">
                    <span class="keyText">{{item.name}}</span>
                    <span class="valueTxt">{{item.value}}</span>
                </div>
            </div>
        </section>
        <section class="info_row">
            <div class="table_head">
                <img src="@/assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span>详细信息</span>
            </div>
            <div class="table_box">
                <div class="rowTable">
                    <span class="keyText">添加人员</span>
                    <span class="valueTxt">{{data.createBy}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">添加时间</span>
                    <span class="valueTxt">{{data.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">前负责人</span>
                    <span class="valueTxt">{{data.beBelongBy}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">最后跟进时间</span>
                    <span class="valueTxt">{{data.followTime | $time('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
                <div class="rowTable" v-if="getDetailType('code') == 'clue'">
                    <span class="keyText">回归公海时间</span>
                    <span class="valueTxt">{{data.recycleTime | $time('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">转客户时间</span>
                    <span class="valueTxt">{{data.turnTime | $time('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
            </div>
        </section>
        <section class="info_row" v-if="data.sourceStatus == 1 || data.sourceStatus == 2">
            <div class="table_head">
                <img src="@/assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span>线索信息</span>
            </div>
            <div class="table_box">
                <div class="rowTable">
                    <span class="keyText">线索名称</span>
                    <span class="valueTxt">{{data.customerCalled}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">线索来源</span>
                    <span class="valueTxt">{{data.sourceName}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">线索类型</span>
                    <span class="valueTxt">{{data.clueType}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">创建时间</span>
                    <span class="valueTxt">{{data.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
            </div>
        </section>
        <section class="info_row" v-if="data.isWcCus">
            <div class="table_head">
                <img src="@/assets/images/icon_label@2x.png" alt="" style="width: 18px; height: 18px" />
                <span>{{data.externalType == 1 ? '微信' : '企微'}}好友信息</span>
            </div>
            <div class="table_box">
                <div class="rowTable">
                    <span class="keyText">微信昵称</span>
                    <span class="valueTxt">{{ data.wechatNickname }}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">头像</span>
                    <span class="valueTxt">
                        <img :src="data.avatar" alt="" v-if="data.avatar" />
                    </span>
                </div>
                <div class="rowTable">
                    <span class="keyText">性别</span>
                    <span class="valueTxt">{{data.gender | $gender}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">职务</span>
                    <span class="valueTxt">{{ data.position }}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">邮箱</span>
                    <span class="valueTxt">{{data.email}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">添加人员</span>
                    <span class="valueTxt">{{data.createBy}}</span>
                </div>
                <div class="rowTable">
                    <span class="keyText">添加时间</span>
                    <span class="valueTxt">{{data.createTime | $time('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'DetailBasicInfo',
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        list: {     //自定义列表
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            type: this.$route.query.type,   //1.我的线索  2.线索公海  3.我的客户  4.客户公海  5.全部客户
        }
    },
    computed: {
        detailType(){
            let obj = {
                1: 'myClue',
                2: 'clue',
                3: 'myCustomer',
                4: 'customer',
                5: 'customerAll',
            }
            return obj[this.type]
        },
        timeTypeName(){
            return this.type > 2 ? '建档时间' : '创建时间'
        },
    },
    methods: {
        getDetailType(val = 'name'){
            console.log('val',val)
            return val == 'code' ? this.type > 2 ? 'customer' : 'clue' : this.type > 2 ? '客户' : '线索'
        }
    },
}
</script>

<style lang="less" scoped>
.info_box{
    width: 100%;
    .info_row{
        width: 100%;
        .table_head {
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 16px;
            img {
                position: relative;
                top: 4px;
            }
        }
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
}
</style>