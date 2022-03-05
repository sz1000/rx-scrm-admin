<template>
    <div class="charts" ref="visitReportCharts"></div>
</template>

<script>
export default {
    name: 'VisitReportCharts',
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        time: {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            myChart: null,
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
            let data = [],data1 = []
            if(this.time && this.time.length){
                this.time.forEach(el => {
                    data.push(this.data[el].visitNewCount)
                    data1.push(this.data[el].visitOldCount)
                })
            }
            var option = {
                color: ['#5985EE', ' #91CC74'],
                barMaxWidth: 36,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: 'rgba(246, 247, 249, 0.5)'
                        },
                    },
                    backgroundColor: '#fff',
                    textStyle: {
                        color: '#3C4353',
                        fontSize: 10,
                    },
                    extraCssText: 'box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.1);padding:12px;'
                },
                legend: {
                    top: 60,
                    x:'center', //可设定图例在左、右、居中
                    icon: 'roundRect',
                    itemGap: 40,
                    textStyle: { //图例文字的样式
                        color: '#8C8C8C',
                        fontSize: 12,
                    },
                    data: ['拜访已有客户数', '拜访新客户数']
                },
                grid: {
                    top: 120,
                    left: 20,
                    right: 20,
                    bottom: 20,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#838a9d',
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#eee'
                        },
                    },
                    boundaryGap: [0, 0.01],
                    data: this.time
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee'
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#eee'
                        },
                    },
                    axisLabel: {
                        color: '#838a9d',
                    },
                    minInterval: 1,
                },
                series: [
                    {
                        name: '拜访已有客户数',
                        type: 'bar',
                        label: {
                            show: false,
                        }, // 柱子上方的数值
                        itemStyle: {
                            barBorderRadius: [6,6,0,0],
                            // color: '#5985EE'
                        },
                        data: data1
                    },
                    {
                        name: '拜访新客户数',
                        type: 'bar',
                        label: {
                            show: false,
                        }, // 柱子右方的数值
                        itemStyle: {
                            barBorderRadius: [6,6,0,0],
                            // color: '#91CC74'
                        },
                        data: data
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.visitReportCharts)
            this.myChart.resize()
            if(this.time){
                this.myChart.setOption(option)
            }else{
                this.myChart.clear()
            }
        },
    },
}
</script>

<style lang="less" scoped>
.charts{
    width: 100%;
    height: 100%;
}
</style>