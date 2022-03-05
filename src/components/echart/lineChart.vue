<template>
  <div ref="moreLine"
       style="height: 100%; width: 100%"></div>
</template>

<script>
import resize from '../../mixins/resize'
export default {
  // name: 'moreLine',
  mixins: [resize],
  props: {
    options: {
      type: Object,
      default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    monthData: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      // console.log(this.monthData, this.options)
      this.initEchart()
    })
  },
  methods: {
    initEchart() {
      this.myChart = this.$echarts.init(this.$refs.moreLine)
      this.myChart.setOption(
        {
          title: {
            text: '2021年新增客户数量',
            left: '40%',
            top: '20',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
          },
          grid: {
            left: 50,
            right: 20,
            bottom: 40,
            top: 100,
          },
          legend: {
            show: false,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
              ],
              axisLine: {
                lineStyle: {
                  color: '#cecece',
                },
              },
              axisLabel: {
                color: '#666',
              },
              axisTick: {
                show: false,
              },
              axisPointer: {
                snap: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: '#cecece',
                },
              },
              axisLabel: {
                color: '#666',
              },
              splitLine: {
                lineStyle: {
                  // 使用深浅的间隔色
                  color: '#eee',
                  type: 'dashed',
                },
              },
              axisPointer: {
                snap: false,
              },
            },
          ],
          series: [
            {
              name: '客户数',
              type: 'line',
              // data: [32, 34, 39, 35, 20, 36, 34, 38, 36, 34, 20, 40],
              data: this.monthData,
              smooth: true,
              showSymbol: true,
              symbol: 'circle', //标记的图形为实心圆
              lineStyle: {
                normal: {
                  width: 3,
                  color: '#C589FC ', // 线条颜色
                },
              },
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(197, 137, 252, 1)', // 0% 处的颜色
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(216, 150, 255, 0.5)', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(248, 222, 255, 0)', // 100% 处的颜色
                      },
                    ],
                  },
                  shadowColor: '#C589FC',
                  shadowBlur: 5,
                },
              },

              itemStyle: {
                normal: {
                  color: '#C589FC',
                  borderColor: '#fff', //边框
                  borderWidth: 2,
                },
              },
            },
          ],
        },
        true
      )
    },
  },
}
</script>
