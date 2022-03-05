<template>
    <div class="charts" ref="clueCharts"></div>
</template>

<script>
export default {
    name: 'ClueCharts',
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
    },
    methods: {
        initChart(){
            var echarts = this.$echarts
            var dataAxis = this.time;
            var data = [];
            
            if(this.time && this.time.length){
                this.time.forEach(el => {
                    let _num = this.$accMul(this.data[el],100)
                    data.push(_num)
                })
            }
            var option = {
                grid:{
                    left:'left',
                    bottom: 20,
                    top:80,
                    right:20,
                    left:20,
                    containLabel:true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: (params) => {
                        let obj = params[0]
                        let html = "<span style='display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:#4285F4'></span>"
                        let arr = obj.data ? obj.data.toString().split('.') : []
                        let num = arr.length == 2 && arr[1].length > 1 ? obj.data.toFixed(2) : obj.data
                        return `${obj.name}<br /> ${html}${num}% `
                    }
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        textStyle: {
                            color: '#838a9d'
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                },
                yAxis: {
                    axisLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#eee'
                        },
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#838a9d'
                        },
                        formatter: '{value}%'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#eee'
                        },
                    },
                    splitNumber: 10,
                    minInterval: 10,
                    min: 10,
                    max: 100,
                    // interval: 10,
                    // maxInterval: 100,
                },
                series: [
                    {
                        type: 'bar',
                        barMaxWidth: 18,
                        itemStyle: {
                            barBorderRadius: 10,
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#4285F4'},
                                    {offset: 1, color: '#81ADF8'}
                                ]
                            )
                        },
                        data: data
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.clueCharts)
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