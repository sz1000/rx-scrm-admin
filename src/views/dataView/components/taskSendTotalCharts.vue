<template>
    <div class="charts" ref="taskSendTotalCharts"></div>
</template>

<script>
export default {
    name: 'TaskSendTotalCharts',
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
        list(){
            let list = JSON.parse(JSON.stringify(this.data))
            if(list.length){
                list[1].itemStyle = {
                    color: 'white'
                }
            }
            return list
        },
        total(){
            let num = 0
            this.data.forEach(el => {
                num+=Number(el.value)
            })
            return num
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
                    formatter: '{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    top: '44%',
                    left: '64%',
                    // right: '14%',
                    icon: 'circle',
                    itemGap: 30,
                    formatter: (name) => {
                        return name + '     ' + this.getLabelValue(name) + '%'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '56%'],
                        center: ['38%', '54%'],
                        avoidLabelOverlap: true,
                        color: ['#5E78FF','#FFBB33'],
                        zlevel: 2,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '28',
                                fontWeight: 'bold',
                                color: '#3C4353',
                                formatter: function(v){
                                    return v.data.value
                                },
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.data
                        // [
                        //     {value: 335, name: '直接访问'},
                        //     {value: 234, name: '联盟广告'},
                        // ]
                    },
                    {
                        type: 'pie',
                        radius: ['37.4%', '38%'],
                        center: ['38%', '54%'],
                        avoidLabelOverlap: true,
                        silent: true,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        data: this.list
                        // [
                        //     {value: 335, name: '直接访问'},
                        //     {value: 234, name: '联盟广告',
                        //         itemStyle: {
                        //             color: 'white'
                        //         },
                        //     },
                        // ]
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.taskSendTotalCharts)
            this.myChart.resize()
            if(this.data){
                this.myChart.setOption(option)
            }else{
                this.myChart.clear()
            }
        },
        getLabelValue(val){
            let str = null
            if(this.data && this.data.length){
                this.data.forEach(el => {
                    if(el.name == val){
                        str = el.value/this.total
                    }
                })
            }
            return str ? this.$percentageFun(str) : 0
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