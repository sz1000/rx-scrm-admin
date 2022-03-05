<template>
    <div class="select_list">
        <div class="list">
            <div class="li" v-for="(item,index) in list" :key="index">
                <div class="radio_box">
                    <el-radio @change="valdata(item)" v-model="item.type" v-for="(se,i) in typeList" :key="i" :label="se.code">{{se.name}}</el-radio>
                    <el-button type="text" class="delete_btn" @click="deleteFun(index)">删除</el-button>
                </div>
                <div class="content" >
                    <el-input class="input" v-model="item.text" placeholder="请输入"></el-input>
                    <div class="upload"></div>
                </div>
            </div>
        </div>
        <div class="opera">
            <el-button class="btn" @click="addFun" type="primary" plain>新增</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectList',
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data(){
        return {
            typeList: [
                { name: '图片', code: 'img',},
                { name: '链接', code: 'link',},
                { name: '素材库', code: 'ku',},
            ],
            list: []
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            if(this.data && this.data.length){
                this.list = this.data
            }
        },
        valdata(val){
         console.log(val)
        },
        addFun(){
            let obj = {
                type: 'img',
                text: '',
            }
            this.list.push(obj)
        },
        deleteFun(index){
            this.list.splice(index,1)
        },
        submit(){
            this.$emit('sure',this.list)
        },
    },
}
</script>

<style lang="less" scoped>
.select_list{
    width: 100%;
    .list{
        width: 100%;
        .li{
            border-radius: 4px;
            border: 1px solid #eee;
            border-radius: 4px;
            color: #000;
            padding: 20px;
            margin-bottom: 20px;
            .radio_box{
                width: 100%;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
            }
            .content{
                width: 100%;
                .input{
                    width: 500px;
                    margin-bottom: 20px;
                }
                .upload{
                    width: 120px;
                    height: 120px;
                    border: 1px solid #eee;
                }
            }
        }
    }
    .opera{
        display: flex;
        margin-top: 20px;
        .btn{
            margin-right: 20px;
        }
    }
}
</style>