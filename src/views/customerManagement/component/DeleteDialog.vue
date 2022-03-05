<template>
    <el-dialog class="close_dialog_wrap" title="温馨提示" :visible.sync="dialog" width="420px">
        <div class="close_item">
            <img class="icon" src="@/assets/images/icon_error@2x.png" alt="">
            <div class="tips">{{text}}</div>
        </div>
        <span slot="footer" class="dialog_footer">
            <el-button size="small" @click="dialog = false">否</el-button>
            <el-button class="red" size="small" type="primary" @click="confirmDeleteFun">是</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'DeleteDialog',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            default: '是否确认删除？',
        },
    },
    data(){
        return {
            dialog: false,
        }
    },
    methods: {
        confirmDeleteFun(){
            this.$emit('sure')
            this.dialog = false
        }
    },
    watch:{
        value(val){
            this.dialog = val
        },
        dialog(val){
            if(this.value==val){return false}
            this.$emit('input',val)
        },
    },
}
</script>

<style lang="less" scoped>
@main: #4168F6;
@white: #fff;
@fontMain: #3C4353;
@red: #D14343;
.close_dialog_wrap{
    /deep/ .el-dialog{
        border-radius: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        max-height: 80%;
        margin: 0!important;
    }
    /deep/ .el-dialog__header{
        background: @white;
        // padding: 14px 16px;
        border-radius: 8px 8px 0px 0px;
        .el-dialog__title{
            font-weight: 600;
            font-size: 16px;
        }
        .el-dialog__headerbtn{
            .el-icon-close{
                color: #000;
                font-size: 20px;
            }
        }
    }
    /deep/ .el-dialog__body{
        padding: 16px;
    }
    /deep/ .el-dialog__footer{
        padding: 16px;
        border: none;
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
                                color:@main;
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
                        color: @main;
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
                    .img_box{
                        width: 100%;
                        height: 100%;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
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
</style>