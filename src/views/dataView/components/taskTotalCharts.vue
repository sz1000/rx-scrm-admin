<template>
    <div class="charts_box">
        <div class="type_box" v-if="data && data.length">
            <div class="type" v-for="(item,i) in color" :key="i">
                <div class="dot" :style="{'background':item}"></div>
                <div class="text" v-if="data && data.length">{{data[i].name}}<span class="num">{{data[i].value}}</span></div>
            </div>
        </div>
        <div class="charts" ref="taskTotalCharts"></div>
    </div>
</template>

<script>
export default {
    name: 'TaskTotalCharts',
    props: {
        data: {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            myChart: null,
            color: ['#5E78FF','#C8D2FF'],
            // nameList: [
            //     {name: '已送达客户',value: 72},
            //     {name: '未发送客户',value: 128},
            // ],
        }
    },
    computed: {
        clientWidth(){
            return this.$store.getters.clientWidth
        },
        minChartHeight(){
            return this.$store.getters.dataChartsHeight
        },
    },
    mounted(){
        this.initChart()
    },
    watch:{
        data(){
            this.initChart()
        },
        clientWidth(){
            this.initChart()
        },
        minChartHeight(){
            this.initChart()
        },
    },
    methods: {
        initChart(){
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                series: [
                    {
                        type: 'pie',
                        radius: [12, '56%'],
                        center: ['50%', '54%'],
                        color: this.color,
                        roseType: 'radius',
                        startAngle: '60',
                        label: {
                            color: '#3C4353',
                            fontWeight: '500',
                            formatter: (v) => {
                                return v.percent +'%'
                            },
                        },
                        data: this.data
                        // [
                        //     {value: 64, name: '已送达客户'},
                        //     {value: 36, name: '未发送客户'},
                        // ]
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.taskTotalCharts)
            this.myChart.resize()
            if(this.data){
                this.myChart.setOption(option)
            }else{
                this.myChart.clear()
            }
        },
    },
}
</script>

<style lang="less" scoped>
.charts_box{
    width: 100%;
    height: 100%;
    position: relative;
    .type_box{
        display: flex;
        position: absolute;
        left: 50%;
        bottom: 40px;
        transform: translateX(-50%);
        .type{
            margin-right: 40px;
            display: flex;
            align-items: center;
            &:last-child{
                margin-right: 0;
            }
            .dot{
                width: 14px;
                height: 14px;
                background: #81adf8;
                border-radius: 2px;
                margin-right: 4px;
            }
            .text{
                font-size: 12px;
                line-height: 16px;
                color: @fontMain;
                font-weight: 500;
                .num{
                    margin-left: 16px;
                }
            }
        }
    }
    .charts{
        width: 100%;
        height: 100%;
    }
}
</style>