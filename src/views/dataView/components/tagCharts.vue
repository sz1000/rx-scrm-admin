<template>
    <div class="charts" ref="tagCharts"></div>
</template>

<script>
import "echarts-wordcloud";
export default {
    name: 'TagCharts',
    props: {
        data: {
            type: Array,
            default: () => []
        },
    },
    data(){
        return {
            color: [
                '66,133,244,',
                '159,129,229,',
                '132,141,252,',
                '66,133,244,',
            ],
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
            let _self = this
            var option = {
                title: {
                    x: "center"
                },
                backgroundColor: "#fff",
                series: [{
                    type: "wordCloud",
                    //用来调整词之间的距离
                    gridSize: 10,
                    //用来调整字的大小范围
                    // Text size range which the value in data will be mapped to.
                    // Default to have minimum 12px and maximum 60px size.
                    sizeRange: [14, 60],
                    // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
                    //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
                    // rotationRange: [-45, 0, 45, 90],
                    // rotationRange: [ 0,90],
                    rotationRange: [0, 0],
                    //随机生成字体颜色 
                    textStyle: {
                        normal: {
                            color: function() {
                                let opacity = Math.random() * 1
                                let i = parseInt(Math.random() * 3,10)
                                opacity = opacity < 0.2 ? 0.2 : opacity
                                return(
                                    "rgba(" +
                                    _self.color[i] + opacity +
                                     ")"
                                    // "rgba(" +
                                    // Math.round(Math.random() * 255) +
                                    // ", " +
                                    // Math.round(Math.random() * 255) +
                                    // ", " +
                                    // Math.round(Math.random() * 255) +
                                    // ", " + opacity +
                                    // ")"
                                );
                            }
                        }
                    },
                    //位置相关设置 
                    left: "center",
                    top: "center",
                    right: null,
                    bottom: null,
                    // width: "100%",
                    // height: "100%",
                    //数据
                    data: this.data
                }]
            }
            this.myChart = this.$echarts.init(this.$refs.tagCharts)
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