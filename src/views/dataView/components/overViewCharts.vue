<template>
    <div class="charts_box">
        <div class="type_box">
            <div class="type" v-for="(item,i) in color" :key="i">
                <div class="dot" :style="{'border-color':item}"></div>
                <div class="text">{{nameList[i]}}</div>
            </div>
        </div>
        <div class="charts" ref="dataOverView"></div>
    </div>
</template>

<script>
export default {
    name: 'DataOverView',
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
            color: ['#9F81E5','#81E5A4','#00A9F5'],
            myChart: null,
            nameList: ['线索数','客户数','客户群数'],
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
            let seriesArr = [],dataObj = {
                0: [820, 932, 901, 934, 1290, 1330, 1320],
                1: [220, 432, 601, 534, 1590, 1130, 120],
                2: [1820, 432, 501, 734, 890, 130, 1520],
            }
            dataObj[0] = []
            dataObj[1] = []
            dataObj[2] = []
            this.time.forEach(el => {
                // this.data[el]
                dataObj[0].push(this.data[el].clueCount)
                dataObj[1].push(this.data[el].cusCount)
                dataObj[2].push(this.data[el].groupCount)
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
                    symbol: 'none',
                    smooth: true
                }
                seriesArr.push(Obj)
            })
            var option = {
                grid:{
                    left:'left',
                    bottom: 20,
                    top:110,
                    right:40,
                    left:20,
                    containLabel:true
                },
                tooltip: {
                    trigger: 'axis',
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
                            type: 'dashed'
                        },
                    },
                    minInterval: 1,
                },
                series: seriesArr
            }
            this.myChart = this.$echarts.init(this.$refs.dataOverView)
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
.charts_box{
    width: 100%;
    height: 100%;
    position: relative;
    .type_box{
        display: flex;
        position: absolute;
        right: 46px;
        top: 68px;
        .type{
            margin-right: 32px;
            display: flex;
            align-items: center;
            &:last-child{
                margin-right: 0;
            }
            .dot{
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid #9F81E5;
                margin-right: 4px;
            }
            .text{
                font-size: 12px;
                line-height: 16px;
                color: @fontSub2;
            }
        }
    }
    .charts{
        width: 100%;
        height: 100%;
        position: relative;
    }
}
</style>