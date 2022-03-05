<template>
    <DetailDialog title="无权限查看" width="736px" v-model="dialog">
        <div class="look_content">
            <div class="item">
                <div class="label">联系人：</div>
                <div class="val">大萨达</div>
            </div>
            <div class="item">
                <div class="label">创建时间：</div>
                <div class="val">发生发顺丰</div>
            </div>
            <div class="item">
                <div class="label">当前负责人：</div>
                <div class="val">方式方法</div>
            </div>
        </div>
    </DetailDialog>
</template>

<script>
import { DetailDialog } from '@/components'
export default {
    name: 'LookDialog',
    components: {
        DetailDialog
    },
    props: {
        value:{
            type: Boolean,
            default: false
        },
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
    methods: {},
}
</script>

<style lang="less" scoped>
.look_content{
    padding: 15px 32px;
    .item{
        display: flex;
        font-size: 14px;
        line-height: 20px;
        color: @fontMain;
        margin-bottom: 20px;
        &:last-child{
            margin-bottom: 0;
        }
        .label{
            width: 80px;
            white-space: nowrap;
            text-align: right;
        }
        .val{
            width: calc(100% - 80px);
        }
    }
}
</style>