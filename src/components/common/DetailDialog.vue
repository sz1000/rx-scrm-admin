<template>
    <el-dialog class="dialog_wrap" :close-on-click-modal="modalClick" :width="width" :visible.sync="dialog" :title="title">
        <el-scrollbar class="dialog_content" :style="{'max-height':height}" ref="scrollbar">
            <slot></slot>
        </el-scrollbar>
        <div class="dialog_footer" v-if="getSlotIsHave('detailFooter')">
            <slot name="detailFooter"></slot>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name:'DetailDialog',
    props:{
        value:{
            type:Boolean,
            default:false
        },
        modalClick:{
            type:Boolean,
            default:true
        },
        width:{
            type:String,
            default:'640px'
        },
        title:{
            type:String,
            default:'title'
        },
        height: {
            type:String,
            default:'100%'
        }
    },
    data(){
        return {}
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
    },
    methods:{
        getSlotIsHave(slotName){
            return this.$slots[slotName]
        }
    },
    watch: {
        dialog(val){
            if(val){
                this.$nextTick(() => {
                    if(this.$refs['scrollbar'] && this.$refs['scrollbar'].wrap){
                        this.$refs['scrollbar'].wrap.scrollTop = 0
                    }
                })
            }
        },
    },
}
</script>
<style lang="less" scoped>
.dialog_wrap{
    .dialog_title{
        font-size: 16px;
        line-height: 20px;
        border-bottom: 1px solid @lineColor;
        padding: 16px 20px;
    }
    .dialog_content{
        position: relative;
        height: calc(80vh - 118.5px);
        /deep/ .el-scrollbar__wrap{
            overflow-x: hidden;
        }
    }
    .dialog_footer{
        padding: 16px;
        text-align: right;
        border-top: 1px solid @lineColor;
        position: relative;
    }
}
</style>