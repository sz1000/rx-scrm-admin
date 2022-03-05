<template>
    <div class="charts" ref="friendCircleCharts"></div>
</template>

<script>
export default {
    name: 'FriendCircleCharts',
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
            let data = []
            this.time.forEach(el => {
                data.push(this.data[el])
            })
            var option = {
                grid:{
                    left:'left',
                    bottom: 20,
                    top:88,
                    right:45,
                    left:20,
                    containLabel:true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            type: 'dashed',
                            color: '#eee'
                        },
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
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
                        name: '朋友圈发送量',
                        type: 'line',
                        showSymbol: false,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#3992F4' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#BFDDFF' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        },
                        
                        lineStyle: {
                            color: '#3992F4',
                            width: 4
                        },
                        emphasis: {
                            itemStyle: {
                                color: '#3992F4',
                                borderColor: 'white',
                                borderWidth: 2,
                            },
                        },
                        areaStyle: {},
                        data: data
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.friendCircleCharts)
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