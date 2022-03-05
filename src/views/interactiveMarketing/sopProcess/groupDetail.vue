<template>
    <div class="detail_wrap">
        <div class="top_black" @click="$router.go(-1)">返回</div>
        <div class="detail_row">
            <div class="item_wrap">
                <div class="line_title">群SOP规则详情</div>
                <div class="p">规则名称：{{detail.ruleName}}</div>
                <div class="p">使用群聊：{{detail.groupNames}}</div>
                <div class="p">推送规则：{{detail.promptRule == 0 ? '定时推送' : '周期推送'}}</div>
                <div class="p" v-if="detail.promptRule">设定时间：{{detail.promptPeriodBegin | time}} 至 {{detail.promptPeriodEnd | time}}</div>
                <div class="p">创建人员：{{detail.createUserName}}</div>
                <div class="p">创建时间：{{detail.createTimeStr}}</div>
            </div>
            <div class="item_wrap">
                <div class="line_title">推送内容</div>
                <div class="setting_detail_wrap" v-if="detail.sopContentVOS && detail.sopContentVOS.length > 0">
                    <div class="detail_box" v-for="(item,index) in detail.sopContentVOS" :key="index">
                        <div class="dot"></div>
                        <div class="item">
                            <div class="label">内容名称：</div>
                            <div class="val">{{item.name}}</div>
                        </div>
                        <div class="item">
                            <div class="label">推送时间：</div>
                            <div class="val">{{item.promptTimeMsg}}</div>
                        </div>
                        <div class="item">
                            <div class="label">推送内容：</div>
                            <div class="val">
                                <p class="tit">{{item.content}}</p>
                                <div class="inside_box" v-for="(son,i) in item.sopContentAttachmentVOS" :key="i">
                                   <!-- <h1>{{son.objectName}}</h1> -->
                                    <!-- <div class="img_row" v-if="son.fileName">
                                        <div class="img_box">
                                            <img :src="son.url" alt="">
                                        </div>
                                        <div class="info_r">
                                            <div class="name">{{son.fileName}}</div>
                                            <div class="size">{{son.fileSize}}</div>
                                        </div>
                                    </div>
                                    <div class="share_link" v-else>{{son.url}}</div> -->
                                         <div class="share_box" v-if="son.objectName == 1 || son.attachmentType == 2 ">
                                           <div>
                                              <div class="title">{{son.title}}</div>
                                              <div class="des">{{son.urlAbstract}}</div>
                                            </div>
                                                <div class="line">
                                                <div class="img_box">
                                                    <img :src="son.cover" alt="">
                                               </div>
                                            </div>
                                         </div>
                                               <div class="share_box" v-if="son.objectName == 2 ">
                                                <div class="line">
                                                <div class="img_box">
                                                     <img :src="son.cover" alt="">
                                               </div>
                                             </div>
                                              <div>
                                              <div class="title">{{son.title}}</div>
                                              <div class="des">{{$filterSize(son.fileSizes)|| "" }}</div>
                                            </div>
                                         </div>
                                           <div class="share_box" v-if="son.objectName == 3 ">
                                               <div class="img_box">
                                                <img :src="son.url" alt="">
                                            </div>
                                            <div class="info_r">
                                                <div class="name">{{son.fileName}}</div>
                                                <div class="size">{{son.fileSize}}</div>
                                            </div>
                                         </div>
                                             <div class="share_box" v-if="son.attachmentType == 1 ">
                                               <div class="img_box">
                                                <img :src="son.url" alt="">
                                            </div>
                                            <div class="info_r">
                                                <div class="name">{{son.fileName}}</div>
                                                <div class="size">{{son.fileSize}}</div>
                                            </div>
                                         </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="detail_row">
            <div class="item_wrap">
                <div class="line_title">数据统计</div>
                <div class="total_wrap">
                    <div class="total_box">
                        <div class="total_item">
                            <div class="num">{{detail.taskSendGroupOwnerCount}}</div>
                            <div class="text">任务发送群主</div>
                        </div>
                        <div class="total_item">
                            <div class="num">{{detail.taskSendGroupCount}}</div>
                            <div class="text">任务送达群聊</div>
                        </div>
                    </div>
                    <div class="total_box">
                        <div class="total_item">
                            <div class="num">{{detail.sentGroupOwnerCount}}</div>
                            <div class="text">已发送群主</div>
                        </div>
                        <div class="total_item">
                            <div class="num">{{detail.sentGroupCount}}</div>
                            <div class="text">已送达群聊</div>
                        </div>
                    </div>
                    <div class="total_box">
                        <div class="total_item">
                            <div class="num">{{detail.notSendGroupOwnerCount}}</div>
                            <div class="text">未发送群主</div>
                        </div>
                        <div class="total_item">
                            <div class="num">{{detail.notSendGroupCount}}</div>
                            <div class="text">未送达群聊</div>
                        </div>
                    </div>
                </div>
                <div class="table">
                    <el-table :data="list" :header-cell-style="{ background: '#FAFBFF',color: '#3C4353' }" style="width: 100%">
                        <el-table-column type="index" label="编号" width="50"></el-table-column>
                        <el-table-column prop="senderName" show-overflow-tooltip label="发送群主"></el-table-column>
                        <el-table-column prop="customerName" show-overflow-tooltip label="客户群"></el-table-column>
                        <el-table-column prop="promptTime" label="提醒时间" min-width="160px"></el-table-column>
                        <el-table-column prop="content" show-overflow-tooltip label="发送内容名称"></el-table-column>
                        <el-table-column prop="msgCount" label="发送消息数量"></el-table-column>
                        <el-table-column prop="msgSendCount" label="实发消息数量"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="openDialog(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                        <div slot="empty" class="empty" style="padding-top: 100px">
                            <img src="@/assets/images/nodae.png" style="width: 280px; height: 233px"/>
                        </div>
                    </el-table>
                </div>
                <div class="pagePosition">
                    <Pagination
                        :total="total"
                        :pageInfo="pageInfo"
                        @pageChange="pageChange"
                        v-if="total">
                    </Pagination>
                </div>
            </div>
        </div>
        <!-- 发送详情 -->
        <el-dialog class="dialog_wrap" title="发送详情" :visible.sync="dialog" width="520px">
            <div class="dialog_content">
                <div class="d_line">
                    <div class="label">发送群主：</div>
                    <div class="val">{{detailData.senderName}}</div>
                </div>
                <div class="d_line">
                    <div class="label">客户群：</div>
                    <div class="val">{{detailData.customerName}}</div>
                </div>
                <div class="d_line">
                    <div class="label">提醒时间：</div>
                    <div class="val">{{detailData.promptTime}}</div>
                </div>
                <div class="d_line">
                    <div class="label">发送消息数量：</div>
                    <div class="val">{{detailData.msgCount}}</div>
                </div>
                <div class="d_line">
                    <div class="label">实发消息数量：</div>
                    <div class="val">{{detailData.msgSendCount}}</div>
                </div>
                <el-table class="bd" :data="detailData.sopSendDetailVOS" :header-cell-style="{ color: '#3C4353' }" style="width: 100%">
                    <el-table-column type="index" label="编号" width="50"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="attachmentName" label="推送内容">
                        <template slot-scope="scope">
                            <!-- <div class="column_item" v-if="scope.row.fileName">
                                <div class="img_box">
                                    <img :src="scope.row.url" alt="">
                                </div>
                                <div class="val">
                                    <div class="name">{{scope.row.fileName}}</div>
                                    <div class="size">{{scope.row.fileSize}}</div>
                                </div>
                            </div>
                            <span v-else>{{scope.row.url || scope.row.attachmentName}}</span> -->
                            <span v-if="!scope.row.objectName">{{ scope.row.attachmentName}}</span>
                            <div class="column_item" v-if="scope.row.objectName == 1">
                                <div class="img_box">
                                    <img :src="scope.row.cover" alt="">
                                </div>
                                <div class="val">
                                    <div class="name">{{scope.row.title}}</div>
                                    <!-- <div class="size">{{scope.row.url}}</div> -->
                                </div>
                            </div>
                            <div class="column_item" v-if="scope.row.objectName == 2">
                                <div class="img_box">
                                    <img :src="scope.row.cover" alt="">
                                </div>
                                <div class="val">
                                    <div class="name">{{scope.row.title}}</div>
                                    <!-- <div class="size">{{scope.row.url}}</div> -->
                                </div>
                            </div>
                            <div class="column_item" v-if="scope.row.objectName == 3">
                                <div class="img_box">
                                    <img :src="scope.row.url" alt="">
                                </div>
                                <div class="val">
                                    <div class="name">{{scope.row.fileName}}</div>
                                    <!-- <div class="size">{{scope.row.url}}</div> -->
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发送时间"></el-table-column>
                    <el-table-column prop="sendStatus" label="发送状态" width="90">
                        <template slot-scope="scope">
                            {{scope.row.sendStatus ? '已发送' : '未发送'}}
                        </template>
                    </el-table-column>
                    <div slot="empty" class="empty" style="padding-top: 100px">
                        <img src="@/assets/images/nodae.png" style="width: 280px; height: 233px"/>
                    </div>
                </el-table>
            </div>
            <span slot="footer" class="dialog_footer">
                <el-button size="small" class="btn" type="primary" @click="dialog = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/elPagination.vue"
import { sop_detail,sopSendTotal_pageList,sopSendDetail_detail } from '@/api/sop'
export default {
    components: {
        Pagination
    },
    data(){
        return {
            id: this.$route.query.id,
            detail: {},
            list: [],
            total: 0,
            dialog: false,
            search: {
                sopId: this.$route.query.id,
                current: 1,
                size: 10,
            },
            pageInfo: {
                page: 1,
                limit: 10,
            },
            detailData: {},
        }
    },
    mounted(){
        this.getDetail()
        this.getTotalList()
    },
    methods: {
        getDetail(){    //获取详情
            sop_detail(this.id).then(res => {
                if(res.result){
                    this.detail = res.data
                }
            })
        },
        getTotalList(){     //获取统计列表
            sopSendTotal_pageList(this.search).then(res => {
                if(res.result){
                    let list = res.data.records,total = res.data.total
                    this.list = list
                    this.total = total
                }
            })
        },
        openDialog(row){   //查看发送详情
            sopSendDetail_detail(row.id).then(res => {
                if(res.result){
                    let data = res.data
                    this.detailData = data
                    this.dialog = true
                }
            })
        },
        pageChange(e) {
            console.log('page',e)
            this.search.current = e.page
            this.getTotalList()
        },
    },
    filters: {
        time(val){
            let arr = null
            if(val){
                arr = val.split(' ')
            }
            return arr ? arr[0] : ''
        },
    },
}
</script>

<style lang="less" scoped>
@main: #4168F6;
@white: #fff;
@fontMain: #3C4353;
@fontSub2: #838A9D;
@lineColor: #F0F2F7;
@dialogBg: #FAFBFF;
@red: #D14343;
.detail_wrap{
    width: 100%;
    .top_black{
        display: inline-block;
        font-size: 16px;
        line-height: 22px;
        color: #4168F6;
        font-weight: 500;
        margin-bottom: 16px;
        cursor: pointer;
        position: relative;
        padding-left: 20px;
        &::before{
            content: '<';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }
    .detail_row{
        width: 100%;
        // min-height: calc(100vh - 126px);
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        &:last-child{
            margin-bottom: 0;
        }
        .item_wrap{
            width: 100%;
            margin-bottom: 32px;
            &:last-child{
                margin-bottom: 0;
            }
            .line_title{
                font-size: 14px;
                line-height: 20px;
                color: #3C4353;
                font-weight: bold;
                position: relative;
                padding-left: 10px;
                margin-bottom: 20px;
                &:first-child{
                    margin-bottom: 16px;
                }
                &::before{
                    content: '';
                    width: 2px;
                    height: 14px;
                    background: #4168F6;
                    position: absolute;
                    left: 0;
                    top: 3px;
                }
            }
            .p{
                width: 100%;
                display: flex;
                font-size: 14px;
                line-height: 20px;
                color: @fontMain;
                margin-bottom: 16px;
                &:last-child{
                    margin-bottom: 0;
                }
            }
            .total_wrap{
                width: 100%;
                display: flex;
                margin-bottom: 16px;
                .total_box{
                    width: calc((100% - 32px)/ 3);
                    height: 120px;
                    background: rgba(@main, 0.02);
                    border: 1px solid @main;
                    border-radius: 4px;
                    margin-right: 16px;
                    display: flex;
                    &:last-child{
                        margin-right: 0;
                    }
                    .total_item{
                        width: 50%;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        position: relative;
                        &:first-child::before{
                            content: '';
                            width: 1px;
                            height: 60px;
                            background: @lineColor;
                            position: absolute;
                            right: 0px;
                            top: 50%;
                            transform: translate(50%,-50%);
                        }
                        .num{
                            font-size: 24px;
                            line-height: 28px;
                            color: @fontMain;
                            font-weight: bold;
                            margin-bottom: 8px;
                        }
                        .text{
                            font-size: 14px;
                            line-height: 20px;
                            color: @fontSub2;
                        }
                    }
                }
            }
            .table{
                /deep/ .el-table::before{
                    height: 0;
                }
            }
        }
        .setting_detail_wrap{
            width: 100%;
            padding-left: 14px;
            padding-top: 36px;
            margin-top: 20px;
            position: relative;
            &::before{
                content: '';
                width: 1px;
                height: 20px;
                background: @lineColor;
                position: absolute;
                left: 1px;
                top: 12px;
            }
            &::after{
                content: '';
                width: 8px;
                height: 8px;
                background: @main;
                border-radius: 50%;
                position: absolute;
                left: -3px;
                top: 0;
            }
            .detail_box{
                width: 765px;
                min-height: 124px;
                background: #FAFBFF;
                border-radius: 8px;
                padding: 16px;
                position: relative;
                margin-bottom: 16px;
                &:last-child{
                    margin-bottom: 0;
                    &::before{
                        content: '';
                        height: calc(100% - 12px);
                    }
                }
                &::before{
                    content: '';
                    width: 1px;
                    height: calc(100% - 2px);
                    background: @lineColor;
                    position: absolute;
                    left: -13px;
                    top: 13px;
                }
                  .inside_box{
                    margin-bottom: 12px;
                    &:last-child{
                        margin-bottom: 0;
                    }
                      .share_box{
                              .img_box{
                                    width: 50px;
                                    height: 50px;
                                    margin-right: 16px;
                                    // background: #FAFBFF;
                                    img{
                                          width: 50px;
                                        height: 50px;
                                    }
                                }
                                .info_r{
                                    .name{
                                        width: 145px;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        height: 40px;
                                    //  margin-left: 16px;
                                    }
                                }
                            width: 250px;
                            height: 100px;
                            background: #fff;
                            border: 1px solid #D9DAE4;
                            padding: 16px;
                            display: flex;
                                   .des{
                                    width: calc(100% - 66px);
                                    font-size: 12px;
                                    line-height: 17px;
                                    color: #C0C4CC;
                                    word-break: break-all;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 2;
                                    overflow: hidden;
                                }
                            .title{
                                font-size: 14px;
                                line-height: 20px;
                                color: #3C4353;
                                width: 145px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                height: 40px;
                               line-height: 40px;
                            }
                            .line{
                                width: 100%;
                                display: flex;
                                align-items: center;
                         
                                .img_box{
                                    width: 50px;
                                    height: 50px;
                                    margin-left: 16px;
                                    // background: #FAFBFF;
                                    img{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                        }
                }
                .dot{
                    width: 8px;
                    height: 8px;
                    background: @main;
                    border-radius: 50%;
                    position: absolute;
                    left: -17px;
                    top: 0;
                    &::before{
                        content: '';
                        width: 4px;
                        height: 4px;
                        background: @white;
                        border-radius: 50%;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                    }
                }
                .item{
                    width: 100%;
                    line-height: 20px;
                    font-size: 14px;
                    display: flex;
                    margin-bottom: 16px;
                    &:last-child{
                        margin-bottom: 0;
                    }
                    .label{
                        width: 80px;
                        color: #3C4353;
                    }
                    .val{
                        width: calc(100% - 70px);
                        color: #838A9D;
                      
                        .tit{
                            margin-bottom: 8px;
                        }
                        .img_row{
                            width: 100%;
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            .img_box{
                                width: 80px;
                                height: 80px;
                                border-radius: 4px;
                                overflow: hidden;
                                margin-right: 16px;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .info_r{
                                width: calc(100% - 96px);
                                .name{
                                    line-height: 20px;
                                    font-size: 14px;
                                    color: #3C4353;
                                    margin-bottom: 4px;
                                    width: 145px;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    height: 40px;
                                }
                                .size{
                                    height: 17px;
                                    font-size: 12px;
                                    color: #C0C4CC;
                                }
                            }
                        }
                        .share_box{
                            width: 250px;
                            height: 100px;
                            background: #fff;
                            border: 1px solid #D9DAE4;
                            padding: 16px;
                            .title{
                                font-size: 14px;
                                line-height: 20px;
                                color: #3C4353;
                            }
                            .line{
                                width: 100%;
                                display: flex;
                                align-items: center;
                                .des{
                                    width: calc(100% - 66px);
                                    font-size: 12px;
                                    line-height: 17px;
                                    color: #C0C4CC;
                                    word-break: break-all;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 2;
                                    overflow: hidden;
                                }
                                .img_box{
                                    width: 50px;
                                    height: 50px;
                                    margin-left: 16px;
                                    background: #FAFBFF;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    // 弹窗 style
    .dialog_wrap{
        /deep/ .el-dialog{
            border-radius: 8px;
        }
        /deep/ .el-dialog__header{
            background: @dialogBg;
            padding: 14px 16px;
            border-radius: 8px 8px 0px 0px;
            border-bottom: 1px solid @lineColor;
            .el-dialog__title{
                font-size: 16px;
            }
        }
        /deep/ .el-dialog__body{
            padding: 16px;
            .dialog_content{
                width: 100%;
                .d_line{
                    width: 100%;
                    font-size: 14px;
                    line-height: 20px;
                    color: @fontMain;
                    display: flex;
                    margin-bottom: 20px;
                    .label{
                        width: 100px;
                        white-space: nowrap;
                        text-align: right;
                    }
                    .val{
                        width: calc(100% - 100px);
                    }
                }
            }
        }
        /deep/ .el-dialog__footer{
            padding: 0;
            .dialog_footer{
                // border-top: 1px solid @lineColor;
                box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1);
                padding: 16px;
                display: block;
                border-radius: 8px;
                .btn{
                    background: @main;
                    border-color: @main;
                    &:hover{
                        background: rgba(@main,.85);
                    }
                }
            }
        }
        .column_item{
            width: 140px;
            display: flex;
            align-items: center;
            .img_box{
                width: 40px;
                height: 40px;
                margin-right: 8px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .val{
                width: calc(100% - 48px);
                .name{
                    font-size: 14px;
                    line-height: 20px;
                    color: @fontMain;
                    margin-bottom: 3px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .size{
                    font-size: 12px;
                    line-height: 16px;
                    color: @fontSub2;
                }
            }
        }
    }
}
</style>