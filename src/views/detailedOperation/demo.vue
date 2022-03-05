<template>
    <div class="demo">
        <SelectList :data="list" @sure="savaFun"></SelectList>
    </div>
</template>

<script>
import SelectList from './components/selectList'
export default {
    components: {
        SelectList
    },
    data(){
        return {
            list: [
                {
                    type: 'img',
                    text: 'dsadasdasda',
                },
                {
                    type: 'link',
                    text: '2222222222222',
                },
            ]
        }
    },
    methods: {
        savaFun(val){
            console.log('submit',val)
        },
    },
}
</script>

<style lang="less" scoped>
.demo{
    background: #fff;
    width: 100%;
    min-height: calc(100vh - 88px);
    padding: 20px;
}
</style>