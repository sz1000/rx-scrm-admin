<template>
    <div class="charts" ref="lookPieCharts"></div>
</template>

<script>
export default {
    name: 'LookPieCharts',
    props: {
        data: {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            color: ['#25F3E6','#9F81E5','#FFC107','#FD8383','#4285F4'],
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
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/> {b} : {c} ({d}%)'
                },
                toolbox: {
                    show: true,
                },
                series: [
                    {
                        name: '浏览时长',
                        type: 'pie',
                        radius: [40, 180],
                        center: ['50%', '55%'],
                        color: this.color,
                        roseType: 'area',
                        label: {
                            color: '#3C4353'
                        },
                        data: this.data
                        // [
                        //     {value: 10, name: '60s +'},
                        //     {value: 5, name: '0-5s'},
                        //     {value: 15, name: '5-20s'},
                        //     {value: 25, name: '20-40s'},
                        //     {value: 20, name: '40-60s'},
                        // ]
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.lookPieCharts)
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