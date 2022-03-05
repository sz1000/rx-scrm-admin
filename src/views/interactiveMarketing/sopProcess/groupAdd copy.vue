<template>
    <div class="add_wrap">
        <div class="top_black" @click="$router.go(-1)">返回</div>
        <div class="add_content">
            <el-form :model="detail" :rules="rules" ref="ruleForm" label-width="76px" class="ruleForm">
                <div class="item_wrap">
                    <div class="line_title" @click="addFun">创建群SOP规则</div>
                    <el-form-item label="规则名称：" prop="name">
                        <el-input v-model="detail.name" maxlength="30" show-word-limit placeholder="请输入规则名称"></el-input>
                    </el-form-item>
                    <el-form-item label="使用群聊：" prop="name">
                        <el-select class="select" v-model="value" multiple collapse-tags placeholder="请选择群聊（可多选）">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推送规则：" prop="name">
                        <el-radio v-model="detail.push" label="1">定时推送</el-radio>
                        <el-radio v-model="detail.push" label="2">周期推送</el-radio>
                    </el-form-item>
                    <el-form-item v-if="detail.push == '2'" label="设定时间：" prop="name">
                        <div class="time_row">
                            <div class="time_item">
                                <div class="tit">开始时间</div>
                                <div class="val">
                                    <el-date-picker
                                        class="select"
                                        v-model="value"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                            </div>
                            <div class="time_item">
                                <div class="tit">结束时间</div>
                                <div class="val">
                                    <el-date-picker
                                        class="select"
                                        v-model="value"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <div class="item_wrap">
                    <div class="line_title">设置推送周期及内容</div>
                    <div class="btn_add" @click="dialog_add = true">
                        <img class="icon" src="@/assets/images/icon_add@2x.png" alt="" />
                        <span class="text">添加内容</span>
                    </div>
                    <div class="setting_detail_wrap" v-if="detail.list && detail.list.length > 0">
                        <div class="detail_box" v-for="(item,index) in detail.list" :key="index">
                            <div class="dot"></div>
                            <div class="opera_box">
                                <div class="edit_btn">编辑</div>
                                <div class="delete_btn" @click="deleteFun(index)">删除</div>
                            </div>
                            <div class="item">
                                <div class="label">内容名称：</div>
                                <div class="val">{{item.name}}</div>
                            </div>
                            <div class="item">
                                <div class="label">推送时间：</div>
                                <div class="val">{{item.time}}</div>
                            </div>
                            <div class="item">
                                <div class="label">推送内容：</div>
                                <div class="val">
                                    <p class="tit">{{item.contentName}}</p>
                                    <div class="img_row" v-if="item.fileName">
                                        <div class="img_box"></div>
                                        <div class="info_r">
                                            <div class="name">{{item.fileNmae}}</div>
                                            <div class="size">{{item.fileSize}}</div>
                                        </div>
                                    </div>
                                    <div class="share_box" v-for="(son,i) in item.list" :key="i">
                                        <div class="title">{{son.title}}</div>
                                        <div class="line">
                                            <div class="des">{{son.des}}</div>
                                            <div class="img_box"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <el-button class="creat_btn" size="small" type="primary">创建规则</el-button>
                </div>
            </el-form>
        </div>
        <!-- 添加内容 -->
        <el-dialog class="dialog_wrap" title="添加内容" :visible.sync="dialog_add" width="736px">
            <div class="dialog_content">
                <el-form :model="detail" :rules="rules" ref="ruleForm" label-width="76px" class="ruleForm">
                    <el-form-item label="内容名称：" prop="name">
                        <el-input v-model="detail.name" placeholder="请输入内容名称"></el-input>
                    </el-form-item>
                    <el-form-item label="推送时间：" prop="name">
                        <div v-if="detail.push == '1'">
                            <div class="d_line">
                                <el-radio v-model="radio" label="1">配置本条规则后</el-radio>
                                <el-input class="small_input small" v-model="num"></el-input>
                                <el-select class="small_select" v-model="minute">
                                    <el-option
                                        v-for="item in timeOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <span class="text">提醒群主发送消息</span>
                            </div>
                            <div class="d_line">
                                <el-radio v-model="radio" label="0">配置本条规则后</el-radio>
                                <el-input class="small_input small" v-model="num"></el-input>
                                <span class="text mr">天后，当日</span>
                                <el-time-picker
                                    v-model="dayTime"
                                    :picker-options="{
                                        selectableRange: '00:00:00 - 23:59:59'
                                    }"
                                    format="HH:mm"
                                    value-format="HH:mm"
                                    :clearable="false"
                                    placeholder="时间">
                                </el-time-picker>
                                <span class="text">提醒群主发送消息</span>
                            </div>
                        </div>
                        <div class="d_line" v-else>
                            <el-radio v-model="radio" label="1">配置本条规则后</el-radio>
                            <el-input class="small_input small" v-model="num"></el-input>
                            <span class="text mr">每天</span>
                            <el-time-picker
                                v-model="dayTime"
                                :picker-options="{
                                    selectableRange: '00:00:00 - 23:59:59'
                                }"
                                format="HH:mm"
                                value-format="HH:mm"
                                :clearable="false"
                                placeholder="时间">
                            </el-time-picker>
                            <span class="text">提醒群主发送消息</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="推送内容：" prop="des">
                        <el-input class="textarea" type="textarea" :autosize="{ minRows: 9}" v-model="detail.des" maxlength="500" show-word-limit placeholder="请输入文字内容"></el-input>
                    </el-form-item>
                    <el-form-item class="hide" label="附件">
                        <div class="enclosure_box">
                            <div class="e_item" v-for="(item,index) in enclosureList" :key="index">
                                <div class="label">附件{{index+1}}：</div>
                                <div class="val">
                                    <div class="delete_btn" @click="deleteEnclosureFun(index)">删除</div>
                                    <div class="e_line">
                                        <div class="e_tit">选择消息类型</div>
                                        <div class="e_val">
                                            <el-radio class="radio" v-model="item.type" label="img">图片</el-radio>
                                            <el-radio class="radio" v-model="item.type" label="link">链接</el-radio>
                                        </div>
                                    </div>
                                    <div class="upload_wrap" v-if="item.type == 'img'">
                                        <div class="upload_row">
                                            <div class="upload_box">
                                                <div class="upload">
                                                    <div class="icon_box">
                                                        <div class="icon"></div>
                                                        <div class="text">上传图片</div>
                                                    </div>
                                                    <input class="file" type="file" accept=".png,.jpg,.jpeg" />
                                                </div>
                                            </div>
                                            <div class="afresh_file" v-if="item.url">重新上传<input class="file" type="file" accept=".png,.jpg,.jpeg" /></div>
                                        </div>
                                        <div class="upload_tips">建议上传大小不超过2MB的图片，格式支持jpeg、jpg、png</div>
                                    </div>
                                    <div class="link_wrap" v-else>
                                        <div class="input_item">
                                            <el-input v-model="item.url" placeholder="链接地址请以http或https开头"></el-input>
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
                        <div class="add_box" v-if="enclosureList.length < 9">
                            <div class="btn_add" @click="addEnclosureFun">
                                <img class="icon" src="@/assets/images/icon_add@2x.png" alt="" />
                                <span class="text">添加附件</span>
                            </div>
                            <span class="tips">（最多可添加9个附件）</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog_footer">
                <el-button size="small" @click="dialog_add = false">取 消</el-button>
                <el-button size="small" class="btn" type="primary" @click="dialog_add = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除弹窗 tips -->
        <el-dialog class="dialog_wrap close" title="温馨提示" :visible.sync="dialog_delete" width="420px">
            <div class="close_item">
                <img class="icon" src="@/assets/images/icon_error@2x.png" alt="">
                <div class="tips">是否确认删除？</div>
            </div>
            <span slot="footer" class="dialog_footer">
                <el-button size="small" @click="dialog_delete = false">否</el-button>
                <el-button class="red" size="small" type="primary" @click="dialog_delete = false">是</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { sop_add } from '@/api/sop'
export default {
    data(){
        return {
            value: '',
            options: [],
            detail: {
                name: '',
                des: '',
                push: '1',
                list: [{
                    name: '123456',
                    contentName: '你是谁',
                    time: '配置本条规则后30分钟提醒群主发送消息',
                    img: '',
                    fileNmae: 'src=http___itegsbz.png',
                    fileSize: '27.35K',
                    list: [{
                        type: 'link',
                        url: 'url',
                        title: '锐信科技',
                        des: "We're sorry but 极洲科技dooesn't work properly wit…",
                        img: '',  
                    }]
                },{
                    name: '123456',
                    contentName: '欢迎您加入哈哈哈哈哈哈，一起加油吧~',
                    time: '配置本条规则1天后，当日12:00提醒群主发送消息', 
                }],
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                des: [
                    { required: true, message: '请输入文字内容', trigger: 'blur' },
                ],
            },
            dialog_add: false,
            radio: '1',
            num: '30',
            timeOption: [
                {value: 'minute',label: '分钟'},
            ],
            minute: 'minute',
            dayTime: '12:00:00',
            addStatus: false,
            dialog_delete: false,
            enclosureList: [{
                type: 'img',
                url: '',
            },]
        }
    },
    methods: {
        addFun(){
            let _data = {}
            sop_add(_data).then(res => {
                console.log('aa',res)
            })
        },
        deleteFun(){    //删除内容
            this.dialog_delete = true
        },
        addEnclosureFun(){  //添加附件
            let _data = {
                type: 'link',
                url: '',
            }
            this.enclosureList.push(_data)
        },
        deleteEnclosureFun(i){   //删除附件
            this.enclosureList.splice(i,1)
        },
    },
}
</script>

<style lang="less" scoped>
@main: #4168F6;
@white: #fff;
@fontMain: #3C4353;
@red: #D14343;
.add_wrap{
    width: 100%;
    /deep/ .el-form-item{
        margin-bottom: 20px;
        &.hide .el-form-item__label{
            opacity: 0;
        }
        .el-form-item__label{
            padding-right: 0;
            font-weight: 400;
            line-height: 32px;
            white-space: nowrap;
        }
        .el-form-item__content{
            line-height: 32px;
        }
    }
    /deep/ .el-input__inner{
        height: 32px;
        line-height: 32px;
    }
    /deep/ .el-input__icon{
        line-height: 32px;
        height: 32px;
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner{
        border-color: #4168F6;
        background: #4168F6;
    }
    .btn_add {
        display: inline-block;
        width: 104px;
        height: 32px;
        background: rgba(65, 104, 246, 0.04);
        border-radius: 4px;
        border: 1px solid #4168f6;
        color: #4168f6;
        padding-left: 32px;
        position: relative;
        text-align: left;
        cursor: pointer;
        transition: all .2s;
        &:hover{
            background: rgba(65, 104, 246, 0.1);
        }
        .icon{
            width: 12px;
            height: 12px;
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
        }
        .text{
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #4168F6;
            display: inline-block;
        }
    }
    .top_black{
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
    .add_content{
        width: 100%;
        min-height: calc(100vh - 126px);
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        .item_wrap{ 
            width: 782px;
            .line_title{
                font-size: 14px;
                line-height: 20px;
                color: #3C4353;
                font-weight: bold;
                position: relative;
                padding-left: 10px;
                padding-bottom: 8px;
                border-bottom: 1px solid #F0F2F7;
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
            .select{
                width: 100%;
            }
            .mbt32{
                margin-bottom: 32px;
            }
            /deep/ .el-form-item:last-child{
                margin-bottom: 32px;    
            }
        }
        .creat_btn{
            width: 104px;
            background: @main;
            margin-top: 20px;
            &:hover{
                background: rgba(@main,.85);
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
                background: #F0F2F7;
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
                    background: #F0F2F7;
                    position: absolute;
                    left: -13px;
                    top: 13px;
                }
                .opera_box{
                    display: flex;
                    position: absolute;
                    right: -16px;
                    bottom: 0;
                    transform: translateX(100%);
                    .edit_btn{
                        height: 20px;
                        font-size: 14px;
                        color: @main;
                        position: relative;
                        padding-left: 18px;
                        cursor: pointer;
                        margin-right: 16px;
                        &::before{
                            content: '';
                            width: 14px;
                            height: 14px;
                            background: url('../../../assets/images/icon_edit2.png') no-repeat;
                            background-size: 100%;
                            position: absolute;
                            left: 0;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                    }
                    .delete_btn{
                        height: 20px;
                        font-size: 14px;
                        color: @main;
                        position: relative;
                        padding-left: 18px;
                        cursor: pointer;
                        &::before{
                            content: '';
                            width: 14px;
                            height: 14px;
                            background: url('../../../assets/images/icon_delete2.png') no-repeat;
                            background-size: 100%;
                            position: absolute;
                            left: 0;
                            top: 50%;
                            transform: translateY(-50%);
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
                        width: 70px;
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
                                background: #fff;
                                margin-right: 16px;
                            }
                            .info_r{
                                width: calc(100% - 96px);
                                .name{
                                    line-height: 20px;
                                    font-size: 14px;
                                    color: #3C4353;
                                    margin-bottom: 4px;
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
        .time_row{
            display: flex;
            .time_item{
                display: flex;
                align-items: center;
                margin-right: 32px;
                &:last-child{
                    margin-right: 0;
                }
                .tit{
                    width: 64px;
                    font-size: 14px;
                    line-height: 20px;
                    color: @fontMain;
                }
                .val{
                    width: 180px;
                    .select{
                        width: 100%;
                    }
                }
            }
        }
    }
    // 弹窗 style
    .dialog_wrap{
        &.close{
            /deep/ .el-dialog__header{
                background: @white;
            }
            /deep/ .el-dialog__body{
                padding: 16px;
            }
            /deep/ .el-dialog__footer{
                border: none;
            }
        }
        /deep/ .el-dialog{
            border-radius: 8px;
        }
        /deep/ .el-dialog__header{
            background: #FAFBFF;
            padding: 14px 16px;
            border-radius: 8px 8px 0px 0px;
            .el-dialog__title{
                font-size: 16px;
            }
        }
        /deep/ .el-dialog__body{
            padding: 0;
        }
        /deep/ .el-dialog__footer{
            padding: 16px;
            border-top: 1px solid #F0F2F7;
            .btn{
                background: @main;
                border-color: @main;
                &:hover{
                    background: rgba(@main,.85);
                }
            }
        }
        .close_item{
            width: 100%;
            display: flex;
            .icon{
                width: 18px;
                height: 18px;
                margin-right: 8px;
            }
            .tips{
                font-size: 14px;
                color: @fontMain;
            }
        }
        .dialog_content{
            padding: 16px;
            /deep/ .select .el-input__icon{
                line-height: 22px;
                height: 22px;
            }
            .d_line{
                width: 100%;
                display: flex;
                align-items: center;
                .el-radio{
                    margin-right: 0;
                    display: flex;
                }
                /deep/ .el-radio__input.is-checked+.el-radio__label{
                    color: #3C4353;
                }
                /deep/ .el-input__inner{
                    height: 22px;
                    line-height: 22px;
                    padding: 0 5px;
                }
                /deep/ .el-input__icon{
                    height: 22px;
                    line-height: 22px;
                }
                /deep/ .el-input__prefix{
                    right: 2px;
                    left: auto;
                }
                .small_input{
                    width: 40px;
                    margin: 0 8px;
                    /deep/ .el-input__inner{
                        text-align: center;
                    }
                }
                .small_select{
                    width:67px;
                    margin-right: 8px;
                    /deep/ .el-input__inner{
                        padding-left: 10px;
                    }
                }
                /deep/ .el-date-editor{
                    width: 70px;
                    margin-right: 8px;
                    height: 22px !important;
                    line-height: 22px !important;
                    .el-input__inner{
                        padding-left: 10px;
                    }
                }
                .text{
                    font-size: 14px;
                    line-height: 20px;
                    color: #3C4353;
                    &.mr{
                        margin-right: 8px;
                    }
                }
            }
            /deep/ .textarea .el-textarea__inner{
                padding: 8px 16px;
            }
            .add_box{
                display: flex;
                align-items: center;
                margin-top: 16px;
                .tips{
                    margin-left: 8px;
                    color: #C0C4CC;
                    font-size: 14px;
                    line-height: 20px;
                }
            }
            .enclosure_box{
                width: 100%;
                .e_item{
                    width: 100%;
                    line-height: 20px;
                    font-size: 14px;
                    display: flex;
                    margin-bottom: 20px;
                    &:last-child{
                        margin-bottom: 0;
                    }
                    .label{
                        width: 48px;
                        color: #3C4353;
                        white-space: nowrap;
                    }
                    .val{
                        width: calc(100% - 48px);
                        min-height: 100px;
                        border: 1px solid #D9DAE4;
                        border-radius: 4px;
                        padding: 16px;
                        position: relative;
                        .delete_btn{
                            height: 20px;
                            font-size: 14px;
                            color: #3C4353;
                            position: absolute;
                            right: 16px;
                            top: 16px;
                            padding-left: 18px;
                            cursor: pointer;
                            &::before{
                                content: '';
                                width: 14px;
                                height: 14px;
                                background: url('../../../assets/images/icon_delete@2x.png') no-repeat;
                                background-size: 100%;
                                position: absolute;
                                left: 0;
                                top: 50%;
                                transform: translateY(-50%);
                            }
                        }
                        .e_line{
                            width: 100%;
                            display: flex;
                            font-size: 14px;
                            line-height: 20px;
                            margin-bottom: 16px;
                            .e_tit{
                                width: 84px;
                                color: #3C4353;
                                margin-right: 16px;
                            }
                            .e_val{
                                width: calc(100% - 100px);
                                .radio{
                                    margin-right: 16px;
                                }
                                /deep/ .el-radio__input.is-checked+.el-radio__label{
                                    color:#4168F6;
                                }
                            }
                        }
                    }
                }
                .upload_wrap{
                    width: 100%;
                    .upload_row{
                        display: flex;
                        align-items: flex-end;
                        margin-bottom: 16px;
                        font-size: 0;
                        .afresh_file{
                            margin-left: 16px;
                            height: 20px;
                            font-size: 14px;
                            color: #4168F6;
                            position: relative;
                            .file{
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
                    .upload_box{
                        width: 128px;
                        height: 128px;
                        border-radius: 4px;
                        overflow: hidden;
                        position: relative;
                        font-size: 0;
                        .upload{
                            width: 100%;
                            height: 100%;
                            border: 1px dashed #D9DAE4;
                            border-radius: 4px;
                            text-align: center;
                            padding-top: 34px;
                            position: relative;
                            .icon_box{
                                .icon{
                                    width: 24px;
                                    height: 24px;
                                    margin-bottom: 16px;
                                    position: relative;
                                    display: inline-block;
                                    &::before{
                                        content: '';
                                        width: 2px;            
                                        height: 100%;       
                                        background: #C0C4CC;
                                        position: absolute;
                                        left: 50%;
                                        top: 0;
                                        transform: translateX(-50%);
                                    }
                                    &::after{
                                        content: '';
                                        height: 2px;            
                                        width: 100%;       
                                        background: #C0C4CC;
                                        position: absolute;
                                        top: 50%;
                                        left: 0;
                                        transform: translateY(-50%);
                                    }
                                }
                                .text{
                                    height: 20px;
                                    font-size: 14px;
                                    color: #C0C4CC;
                                    text-align: center;
                                }
                            }
                            .file{
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
                    .upload_tips{
                        height: 20px;
                        font-size: 14px;
                        color: #C0C4CC;
                    }
                }
                .link_wrap{
                    width: 100%;
                    .input_box{
                        width: 100%;
                    }
                }
            }
        }
        .dialog_footer{
            .red{
                color: @white;
                background: @red;
                border-color: @red;
                &:hover{
                    background: rgba(@red,.85);
                }
            }
        }
    }
}
</style>