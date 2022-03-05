<template>
    <div class="charts" ref="sopPersonalCharts"></div>
</template>

<script>
export default {
    name: 'SopPersonalCharts',
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
        bottom(){
            let state = false
            this.data.forEach(el => {
                if(el.value == 0){
                    state = true
                }
            })
            return state ? 20 : 40
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
                    bottom: this.bottom,
                    itemGap: 40,
                    left: 'center',
                    selectedMode: false,
                    data: ['已执行','未执行']
                },
                series: [
                    {
                        type: 'pie',
                        radius: '57%',
                        center: ['50%', '50%'],
                        color: ['#5E78FF','#FFC107'],
                        hoverAnimation: false ,
                        avoidLabelOverlap: true,
                        zlevel: 2,
                        labelLine: {
                            length: 50,
                            length2: 16,
                        },
                        itemStyle: {
                            borderWidth: 4,
                            borderColor: 'white',
                        },
                        label: {
                            formatter: function(v){
                                return v.percent + '%'
                            },
                        },
                        data: this.data
                        // [
                        //     {value: 5, name: '未执行'},
                        //     {value: 10, name: '已执行'}
                        // ],
                    },
                    {
                        type: 'pie',
                        radius: ['62.4%', '63%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: true,
                        color: '#EEEEEE',
                        silent: true,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        data: [
                            {value: 99999, name: 'all'},
                        ]
                    }
                ]
            }
            this.myChart = this.$echarts.init(this.$refs.sopPersonalCharts)
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