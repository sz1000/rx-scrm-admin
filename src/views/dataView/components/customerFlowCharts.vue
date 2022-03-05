<template>
    <div class="charts" ref="customerFlowCharts"></div>
</template>

<script>
export default {
    name: 'CustomerFlowCharts',
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
            color: ['#00A9F5','#81E5A4','#9F81E5'],
            nameList: ['有效线索认定规则','客户分配规则','公海回收规则'],
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
            let seriesArr = [],dataObj = {
                0: [820, 932, 901, 934, 1290, 1330, 1320],
                1: [220, 432, 601, 534, 1590, 1130, 120],
                2: [1820, 432, 501, 734, 890, 130, 1520],
            }
            dataObj[0] = []
            dataObj[1] = []
            dataObj[2] = []
            this.time.forEach(el => {
                // autoAssignCount(分配) autoRecoverCount(回收) autoChangeCount(认定)
                dataObj[0].push(this.data[el].autoChangeCount)
                dataObj[1].push(this.data[el].autoAssignCount)
                dataObj[2].push(this.data[el].autoRecoverCount)
            })
            this.color.forEach((el,i) => {
                let Obj = {
                    data: dataObj[i],
                    name: this.nameList[i],
                    type: 'line',
                    color: el,
                    lineStyle: {
                        width: 5,
                        color: el,
                    },
                    areaStyle: {
                        color: `rgba(${this.$colorRGB(el)},.06)`,
                    },
                    emphasis: {
                        itemStyle: {
                            color: el,
                            borderColor: 'white',
                            borderWidth: 2,
                        },
                    },
                    symbolSize: 6,
                    showSymbol: false,
                    smooth: true,
                }
                seriesArr.push(Obj)
            })
            var option = {
                grid:{
                    left:'left',
                    bottom: 20,
                    top:120,
                    right:40,
                    left:20,
                    containLabel:true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none',
                        // type: 'line',
                        // lineStyle: {
                        //     type: 'dashed',
                        //     color: '#eee'
                        // },
                    }
                },
                legend: {
                    top: 60,
                    x:'center', //可设定图例在左、右、居中
                    icon: 'circle',
                    textStyle: { //图例文字的样式
                        color: '#8C8C8C',
                        fontSize: 12,
                    },
                    
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#eee',
                            type: 'dashed'
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee',
                            type: 'dashed'
                        },
                    },
                    axisLabel: {
                        color: '#838a9d',
                    },
                    data: this.time
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#838a9d',
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee',
                            type: 'dashed'
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#eee',
                            type: 'dotted'
                        },
                    },
                    minInterval: 1,
                },
                series: seriesArr
            }
            this.myChart = this.$echarts.init(this.$refs.customerFlowCharts)
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
    position: relative;
}
</style>