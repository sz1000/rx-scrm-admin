<template>
    <div class="charts_box">
        <div class="type_box">
            <div class="type" v-for="(item,i) in color" :key="i">
                <div class="dot" :style="{'background':item}"></div>
                <div class="text">{{nameList[i]}}</div>
            </div>
        </div>
        <div class="charts" ref="customerGroupCharts"></div>
    </div>
</template>

<script>
export default {
    name: 'CustomerGroupCharts',
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
            color: ['#81adf8','#a3c3fa'],
            nameList: ['入群客户数','退群客户数'],
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
            }
            dataObj[0] = []
            dataObj[1] = []
            let color = JSON.parse(JSON.stringify(this.color)).reverse(),
            nameList = JSON.parse(JSON.stringify(this.nameList)).reverse()
            this.time.forEach(el => {
                // this.data[el]
                dataObj[0].push(this.data[el].outCount)
                dataObj[1].push(this.data[el].inGroupCount)
            })
            color.forEach((el,i) => {
                let Obj = {
                    data: dataObj[i],
                    name: nameList[i],
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    showSymbol: false,
                    color: el,
                    areaStyle: {
                        color: el
                    },
                    lineStyle: {
                        color: el,
                        width: 0
                    },
                    emphasis: {
                        itemStyle: {
                            color: el,
                            borderColor: 'white',
                            borderWidth: 2,
                        },
                    },
                }
                seriesArr.push(Obj)
            })
            var option = {
                grid:{
                    left:'left',
                    bottom: 20,
                    top:120,
                    right:45,
                    left:20,
                    containLabel:true
                },
                tooltip: {
                    trigger: 'axis',
                    // showContent: false ,
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            type: 'dashed',
                            color: '#eee'
                        },
                    }
                },
                // legend: {
                //     orient: 'horizontal',
                //     top: '68',
                //     left: '20',
                //     icon: 'circle',
                //     itemGap: 30,
                //     selectedMode: false,
                //     formatter: (name) => {
                //         return name
                //     }
                // },
                xAxis: [
                    {
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
                    }
                ],
                yAxis: [
                    {
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
                    }
                ],
                series: seriesArr
                // [
                //     {
                //         name: '入群客户数',
                //         type: 'line',
                //         stack: '总量',
                //         smooth: true,
                //         showSymbol: false,
                //         color: '#a3c3fa',
                //         areaStyle: {
                //             color: '#a3c3fa'
                //         },
                //         lineStyle: {
                //             color: '#a3c3fa',
                //             width: 0
                //         },
                //         emphasis: {
                //             itemStyle: {
                //                 color: '#a3c3fa',
                //                 borderColor: 'white',
                //                 borderWidth: 2,
                //             },
                //         },
                //         data: [520, 432, 701, 234, 390, 530, 320]
                //     },
                //     {
                //         name: '退群客户数',
                //         type: 'line',
                //         stack: '总量',
                //         smooth: true,
                //         showSymbol: false,
                //         color: '#81adf8',
                //         areaStyle: {
                //             color: '#81adf8'
                //         },
                //         lineStyle: {
                //             color: '#81adf8',
                //             width: 0,
                //         },
                //         emphasis: {
                //             itemStyle: {
                //                 color: '#81adf8',
                //                 borderColor: 'white',
                //                 borderWidth: 2,
                //             },
                //         },
                //         data: [820, 932, 901, 934, 1290, 1330, 1320]
                //     }
                // ]
            }
            this.myChart = this.$echarts.init(this.$refs.customerGroupCharts)
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
        left: 20px;
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
                background: #81adf8;
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
    }
}
</style>