<template>
    <div class="charts" ref="sopGroupCharts"></div>
</template>

<script>
export default {
    name: 'SopGroupCharts',
    props: {
        data: {
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
            var option = {
                // tooltip: {
                //     trigger: 'item',
                //     formatter: '{b}: {c} ({d}%)'
                // },
                legend: {
                    left: 'center',
                    icon: 'circle',
                    bottom: 40,
                    itemGap: 40,
                    selectedMode: false,
                    data: ['已执行', '未执行']
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '60%'],
                        color: ['#6D85F9','#59DB94'],
                        hoverAnimation: false ,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        itemStyle: {
                            borderWidth: 4,
                            borderColor: 'white'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                formatter: [
                                    '{a| {d}%}\n',
                                    '{b| {c}}{c| 个}',
                                ].join('\n'),
                                rich: {
                                    a: {
                                        lineHeight: 45,
                                        fontSize: 32,
                                        color: '#3C4353',
                                        fontWeight: '500',
                                    },
                                    b: {
                                        color: '#FFC107',
                                        fontSize: 40,
                                        padding: [0,0,46,0],
                                        fontWeight: '500',
                                    },
                                    c: {
                                        color: '#3C4353',
                                        fontSize: 24,
                                        fontWeight: '500',
                                        padding: [0,0,46,0],
                                    },
                                },
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.data
                        // [
                        //     {value: 780, name: '已执行'},
                        //     {value: 220, name: '未执行'},
                        // ]
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.sopGroupCharts)
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
.charts{
    width: 100%;
    height: 100%;
}
</style>