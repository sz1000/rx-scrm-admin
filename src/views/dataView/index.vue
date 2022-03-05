<template>
  <div class="data_wrap">
    <div class="top_box">
      <div class="total_wrap">
        <div class="total_item">
          <div class="total">
            <div class="num">{{totalData.customerCount}}</div>
            <div class="text">客户总数</div>
          </div>
          <svg class="jz_icon" aria-hidden="true">
            <use xlink:href="#icon-customer"></use>
          </svg>
        </div>
        <div class="total_item">
          <div class="total">
            <div class="num">{{totalData.groupCount}}</div>
            <div class="text">客户群总数</div>
          </div>
          <svg class="jz_icon" aria-hidden="true">
            <use xlink:href="#icon-customer-group"></use>
          </svg>
        </div>
        <div class="total_item">
          <div class="total">
            <div class="num">{{totalData.clueCount}}</div>
            <div class="text">线索总数</div>
          </div>
          <svg class="jz_icon" aria-hidden="true">
            <use xlink:href="#icon-clue"></use>
          </svg>
        </div>
      </div>
      <div class="tag_box">
        <div class="tag" @click="tagClickFun(item.code)" :class="{'cur':tagActive == item.code}" v-for="item in tagList" :key="item.code">
          {{item.name}}</div>
      </div>
    </div>
    <!-- 客户数据 -->
    <div class="data_content" v-if="tagActive == 'khsj'">
      <div class="row">
        <div class="data_item">
          <div class="data_title">数据概览</div>
          <div class="select_box">
            <el-select v-model="overViewType" @change="getOverView" placeholder="请选择">
              <el-option v-for="item in selectTypeList_data" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <OverViewCharts :time="overViewTime" :data="overViewData"></OverViewCharts>
        </div>
        <div class="data_item">
          <div class="data_title">标签看板</div>
          <TagCharts v-if="tagData.length" :data="tagData"></TagCharts>
          <NoData v-else></NoData>
        </div>
      </div>
      <div class="data_item clue">
        <div class="data_title">线索转化率</div>
        <div class="select_box">
          <el-select v-model="overViewTypeClue" @change="getClueView" placeholder="请选择">
            <el-option v-for="item in selectTypeList_clue" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <ClueCharts :time="clueTime" :data="clueData"></ClueCharts>
      </div>
      <div class="data_item group">
        <div class="data_title">客户群概览</div>
        <div class="select_box">
          <el-select v-model="overViewTypeGroup" @change="getCustomerGroupView" placeholder="请选择">
            <el-option v-for="item in selectTypeList_group" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <CustomerGroupCharts :time="customerGroupTime" :data="customerGroupData"></CustomerGroupCharts>
      </div>
    </div>
    <!-- 素材 -->
    <div class="data_content" v-if="tagActive == 'sc'">
      <div class="row w5">
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">内容浏览效果图</div>
          <LookPieCharts :data="lookData"></LookPieCharts>
        </div>
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">优质内容TOP10</div>
          <div class="select_box">
            <el-select v-model="materialViewType" @change="getMaterialTop" placeholder="请选择">
              <el-option v-for="item in selectTypeList_material" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <TopBarCharts v-if="topSortData.length" :data="topSortData"></TopBarCharts>
          <NoData v-else></NoData>
        </div>
      </div>
    </div>
    <!-- 朋友圈 -->
    <div class="data_content" v-if="tagActive == 'pyq'">
      <div class="data_item friend mtp0" :style="{'height':getMinChartHeight(490)}">
        <div class="data_title">朋友圈发送量</div>
        <div class="select_box">
          <el-select v-model="friendViewType" @change="getFriendCircle" placeholder="请选择">
            <el-option v-for="item in selectTypeList_friend" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <FriendCircleCharts :time="friendTime" :data="friendData"></FriendCircleCharts>
      </div>
    </div>
    <!-- 商机 -->
    <div class="data_content" v-if="tagActive == 'sj'">
      <div class="row">
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">商机报告</div>
          <div class="select_box">
            <el-select v-model="nicheViewType" @change="getNicheReportView" placeholder="请选择">
              <el-option v-for="item in selectTypeList_niche" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <NicheCharts :time="nicheTime" :data="nicheData"></NicheCharts>
        </div>
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">销售漏斗</div>
          <SaleCharts v-if="scaleTotal > 0" :data="scaleData"></SaleCharts>
          <NoData v-else></NoData>
        </div>
      </div>
    </div>
    <!-- 群发 -->
    <div class="data_content" v-if="tagActive == 'qf'">
      <div class="row w5">
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">任务送达统计</div>
          <TaskTotalCharts :data="taskTotalData"></TaskTotalCharts>
        </div>
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">任务送达群聊统计</div>
          <TaskSendTotalCharts :data="taskSendData"></TaskSendTotalCharts>
        </div>
      </div>
    </div>
    <!-- SOP -->
    <div class="data_content" v-if="tagActive == 'sop'">
      <div class="row w5">
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">个人SOP统计</div>
          <SopPersonalCharts :data="sopPersonalData"></SopPersonalCharts>
        </div>
        <div class="data_item" :style="{'height':getMinChartHeight(460)}">
          <div class="data_title">群SOP统计</div>
          <SopGroupCharts :data="sopGroupData"></SopGroupCharts>
        </div>
      </div>
    </div>
    <!-- 拜访 -->
    <div class="data_content" v-if="tagActive == 'bf'">
      <div class="data_item visit mtp0" :style="{'height':getMinChartHeight(516)}">
        <div class="data_title">拜访报告</div>
        <div class="select_box">
          <el-select v-model="visitViewType" @change="getVisitView" placeholder="请选择">
            <el-option v-for="item in selectTypeList_visit" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <VisitReportCharts :time="visitViewTime" :data="visitViewData"></VisitReportCharts>
      </div>
    </div>
    <!-- 客户流转 -->
    <div class="data_content" v-if="tagActive == 'khlz'">
      <div class="data_item flow mtp0" :style="{'height':getMinChartHeight(520)}">
        <div class="data_title">客户流转统计</div>
        <div class="select_box">
          <el-select v-model="customerFlowViewType" @change="getCustomerFlowView" placeholder="请选择">
            <el-option v-for="item in selectTypeList_customerFlow" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <CustomerFlowCharts :time="customerFlowTime" :data="customerFlowData"></CustomerFlowCharts>
      </div>
    </div>
  </div>
</template>

<script>
import {
  OverViewCharts,
  TagCharts,
  ClueCharts,
  CustomerGroupCharts,
  LookPieCharts,
  TopBarCharts,
  FriendCircleCharts,
  NicheCharts,
  SaleCharts,
  TaskTotalCharts,
  TaskSendTotalCharts,
  SopPersonalCharts,
  SopGroupCharts,
  VisitReportCharts,
  CustomerFlowCharts,
  NoData,
} from './components'
import {
  dataReport_getDataCount,
  dataReport_getCustomerDataOverview,
  dataReport_getLabelView,
  dataReport_getCustomerGroupDataOverview,
  dataReport_getClueDataOverview,
  dataReport_getAllCustomerDataOverview,
  dataReport_getAllMaterialDataOverview, //素材所有数据
  dataReport_getMaterialTOP, //获取素材TOP10
  dataReport_getFriendCircle, //获取朋友圈发送量
  dataReport_getAllBusinessOpportunities, //获取朋友圈发送量
  dataReport_getOpportunityReport, //获取商机报告
  dataReport_getAllCustomerMassScreen, //获取群发所有数据
  dataReport_getAllSOPData, //获取SOP所有数据
  dataReport_getVisitDataOverview, //获取拜访所有数据
  dataReport_getCustomerCirculationDataOverview, //获取客户流转所有数据
} from '@/api/data'
export default {
  components: {
    OverViewCharts,
    TagCharts,
    ClueCharts,
    CustomerGroupCharts,
    LookPieCharts,
    TopBarCharts,
    FriendCircleCharts,
    NicheCharts,
    SaleCharts,
    TaskTotalCharts,
    TaskSendTotalCharts,
    SopPersonalCharts,
    SopGroupCharts,
    VisitReportCharts,
    CustomerFlowCharts,
    NoData,
  },
  data() {
    return {
      tagList: [
        { name: '客户数据', code: 'khsj' },
        { name: '素材', code: 'sc' },
        { name: '朋友圈', code: 'pyq' },
        { name: '商机', code: 'sj' },
        { name: '群发', code: 'qf' },
        { name: 'SOP', code: 'sop' },
        // {name: '拜访',code: 'bf'},
        { name: '客户流转', code: 'khlz' },
      ],
      tagActive: 'khsj',
      myChart: null,
      overViewData: {},
      overViewTime: [],
      customerGroupData: {},
      customerGroupTime: [],
      clueData: {},
      clueTime: [],
      tagData: [],
      lookData: [],
      totalData: {},
      friendData: {},
      friendTime: [],
      taskTotalData: [],
      taskSendData: [],
      sopPersonalData: [],
      sopGroupData: [],
      topSortData: [],
      nicheTime: [],
      nicheData: {},
      scaleData: [],
      visitViewData: {},
      visitViewTime: [],
      customerFlowData: {},
      customerFlowTime: [],
      overViewType: 'year',
      overViewTypeGroup: 'year',
      overViewTypeClue: 'year',
      materialViewType: 'year',
      friendViewType: 'year',
      nicheViewType: 'year',
      visitViewType: 'year',
      customerFlowViewType: 'year',
      selectTypeList_data: [
        { name: '近一年', code: 'year' },
        { name: '近一个月', code: 'month' },
      ],
      selectTypeList_clue: [],
      selectTypeList_group: [],
      selectTypeList_material: [],
      selectTypeList_friend: [],
      selectTypeList_niche: [],
      selectTypeList_customerFlow: [],
      selectTypeList_visit: [
        { name: '近一年', code: 'year' },
        { name: '近一周', code: 'week' },
      ],
    }
  },
  computed: {
    corpId() {
      return this.$store.getters.corpId
    },
    minChartHeight() {
      return this.$store.getters.dataChartsHeight
    },
    scaleTotal() {
      let list = this.scaleData.find((el) => {
        return el.name == 'total'
      })
      return list ? list.num : 0
    },
  },
  mounted() {
    let copyData = JSON.parse(JSON.stringify(this.selectTypeList_data))
    this.selectTypeList_clue = copyData
    this.selectTypeList_group = copyData
    this.selectTypeList_material = copyData
    this.selectTypeList_friend = copyData
    this.selectTypeList_niche = copyData
    this.selectTypeList_customerFlow = copyData
    if (this.corpId) {
      this.getData()
    } else {
      this.$store.dispatch('getCorpId').then((res) => {
        if (res) {
          this.getData()
        }
      })
    }
    this.clientWidthResize()
    window.onresize = () => {
      this.clientWidthResize()
    }
    console.log(process.env.NODE_ENV)
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    clientWidthResize() {
      this.$store.commit(
        'SET_RESIZEWIDTH',
        Number(document.documentElement.clientWidth)
      )
      this.$store.commit(
        'SET_DATACHARTSHEIGHT',
        Number(document.documentElement.clientHeight - 311)
      )
    },
    getData() {
      // this.getTotal()
      // this.getOverView()
      // this.getTagView()
      // this.getClueView()
      // this.getCustomerGroupView()

      // 获取所有数据
      dataReport_getAllCustomerDataOverview(this.corpId).then((res) => {
        if (res.result) {
          let data = res.data
          this.totalData = data.dataCount

          this.overViewData = data.customerDataOverview.data
          this.overViewTime = data.customerDataOverview.dateTime

          data.labelView.forEach((el) => {
            el.value = el.uscount
          })
          this.tagData = data.labelView

          this.clueData = data.clueDataOverview.data
          this.clueTime = data.clueDataOverview.dateTime

          this.customerGroupData = data.customerGroupDataOverview.data
          this.customerGroupTime = data.customerGroupDataOverview.dateTime
        }
      })
    },
    tagClickFun(code) {
      //类型切换
      this.tagActive = code
      switch (code) {
        case 'khsj': //客户数据
          this.getData()
          break
        case 'sc': //素材
          this.getAllMaterialDataView()
          break
        case 'pyq': //朋友圈
          this.getFriendCircle()
          break
        case 'sj': //商机
          this.getNicheAllView()
          break
        case 'qf': //群发
          this.getGroupSendAllView()
          break
        case 'sop': //sop
          this.getSopAllView()
          break
        case 'bf': //拜访
          this.getVisitView()
          break
        case 'khlz': //客户流转
          this.getCustomerFlowView()
          break
        default:
          break
      }
    },
    getTotal() {
      //获取数据总数
      dataReport_getDataCount(this.corpId).then((res) => {
        if (res.result) {
          this.totalData = res.data
        }
      })
    },
    getOverView() {
      //获取概览
      dataReport_getCustomerDataOverview(this.corpId, this.overViewType).then(
        (res) => {
          if (res.result) {
            this.overViewData = res.data.data
            this.overViewTime = res.data.dateTime
          }
        }
      )
    },
    getTagView() {
      //获取标签看板
      dataReport_getLabelView(this.corpId).then((res) => {
        if (res.result) {
          res.data.forEach((el) => {
            el.value = el.uscount
          })
          this.tagData = res.data
        }
      })
    },
    getClueView() {
      //获取线索转化率
      dataReport_getClueDataOverview(this.corpId, this.overViewTypeClue).then(
        (res) => {
          if (res.result) {
            this.clueData = res.data.data
            this.clueTime = res.data.dateTime
          }
        }
      )
    },
    getCustomerGroupView() {
      //获取客户群概览
      dataReport_getCustomerGroupDataOverview(
        this.corpId,
        this.overViewTypeGroup
      ).then((res) => {
        if (res.result) {
          this.customerGroupData = res.data.data
          this.customerGroupTime = res.data.dateTime
        }
      })
    },
    getAllMaterialDataView() {
      //获取素材所有数据
      dataReport_getAllMaterialDataOverview(this.corpId).then((res) => {
        if (res.result) {
          let data = res.data
          let arr = [],
            arr1 = []
          for (let key in this.objectOrder(data.materialPieChart)) {
            let obj = {
              value: data.materialPieChart[key],
              name: this.getTimeName(key),
              key: key,
            }
            arr.push(obj)
          }
          this.lookData = arr

          data.materialTOP.data.forEach((el) => {
            let obj = {
              name: Object.keys(el)[0],
              value: this.$percentageFun(el[Object.keys(el)[0]]),
            }
            arr1.push(obj)
          })
          this.topSortData = arr1
        }
      })
    },
    getMaterialTop() {
      //获取素材TOP10
      dataReport_getMaterialTOP(this.corpId, this.materialViewType).then(
        (res) => {
          if (res.result) {
            let arr1 = []
            res.data.data.forEach((el) => {
              let obj = {
                name: Object.keys(el)[0],
                value: this.$percentageFun(el[Object.keys(el)[0]]),
              }
              arr1.push(obj)
            })
            this.topSortData = arr1
          }
        }
      )
    },
    getFriendCircle() {
      //获取朋友圈发送量
      dataReport_getFriendCircle(this.corpId, this.friendViewType).then(
        (res) => {
          if (res.result) {
            this.friendData = res.data.data
            this.friendTime = res.data.dateTime
          }
        }
      )
    },
    getNicheAllView() {
      //获取商机所有数据
      dataReport_getAllBusinessOpportunities(this.corpId).then((res) => {
        if (res.result) {
          let data = res.data,
            arr = []
          this.nicheData = data.opportunityReport.data
          this.nicheTime = data.opportunityReport.dateTime

          data.salesFunnel.forEach((el) => {
            let list = el.split('_')
            let obj = {
              name: list[0],
              id: Number(list[0].split('stage')[1]),
              num: Number(list[1]),
            }
            arr.push(obj)
          })
          arr.sort((a, b) => {
            return a.id - b.id
          })
          this.scaleData = arr
        }
      })
    },
    getNicheReportView() {
      //获取商机报告
      dataReport_getOpportunityReport(this.corpId, this.nicheViewType).then(
        (res) => {
          if (res.result) {
            this.nicheData = res.data.data
            this.nicheTime = res.data.dateTime
          }
        }
      )
    },
    getGroupSendAllView() {
      //获取群发所有数据
      dataReport_getAllCustomerMassScreen(this.corpId).then((res) => {
        if (res.result) {
          let data = res.data
          let arr = [
              { name: '已送达客户', value: data.customerMassScreen.sended },
              { name: '未发送客户', value: data.customerMassScreen.notSend },
            ],
            arr1 = [
              { name: '已送达群聊', value: data.customerMassGroup.sended },
              { name: '未送达群聊', value: data.customerMassGroup.notSend },
            ]
          this.taskTotalData = arr
          this.taskSendData = arr1
        }
      })
    },
    getSopAllView() {
      //获取SOP所有数据
      dataReport_getAllSOPData(this.corpId).then((res) => {
        if (res.result) {
          let data = res.data
          let arr = [
              { name: '已执行', value: data.personalSOP.executed },
              { name: '未执行', value: data.personalSOP.unexecuted },
            ],
            arr1 = [
              { name: '已执行', value: data.groupSOP.executed },
              { name: '未执行', value: data.groupSOP.unexecuted },
            ]
          this.sopPersonalData = arr
          this.sopGroupData = arr1
        }
      })
    },
    getVisitView() {
      //获取拜访所有数据
      dataReport_getVisitDataOverview(this.corpId, this.visitViewType).then(
        (res) => {
          if (res.result) {
            this.visitViewData = res.data.data
            this.visitViewTime = res.data.dateTime
          }
        }
      )
    },
    getCustomerFlowView() {
      //获取客户流转所有数据
      dataReport_getCustomerCirculationDataOverview(
        this.corpId,
        this.customerFlowViewType
      ).then((res) => {
        if (res.result) {
          this.customerFlowData = res.data.data
          this.customerFlowTime = res.data.dateTime
        }
      })
    },
    getMinChartHeight(val) {
      //echarts最小高度
      return this.minChartHeight > val ? this.minChartHeight + 'px' : val + 'px'
    },
    getTimeName(val) {
      let obj = {
        count1: '0-5s',
        count2: '5-20s',
        count3: '20-40s',
        count4: '40-60s',
        count5: '60s+',
      }
      return obj[val]
    },
    objectOrder(obj) {
      //排序的函数
      var newkey = Object.keys(obj).sort() //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      var newObj = {} //创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]] //向新创建的对象中按照排好的顺序依次增加键值对
      }
      // console.log('newObj',newObj)
      return newObj //返回排好序的新对象
    },
  },
}
</script>

<style type="text/css">
.jz_icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

<style lang="less" scoped>
@import '~@/styles/layout.less';
.data_wrap {
  width: 100%;
  .top_box {
    width: 100%;
    padding: 20px 20px 0;
    .total_wrap {
      width: 100%;
      display: flex;
      .total_item {
        width: calc((100% - 40px) / 3);
        height: 135px;
        background: @white;
        box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid @dataBd;
        margin-right: 20px;
        padding: 0 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:last-child {
          margin-right: 0;
        }
        .total {
          .num {
            font-size: 32px;
            color: @fontMain;
            &.red {
              color: @dataRed;
            }
            &.yellow {
              color: @dataYellow;
            }
          }
          .text {
            font-size: 16px;
            line-height: 22px;
            color: @fontSub2;
          }
        }
        .jz_icon {
          width: 74px;
          height: 74px;
        }
      }
    }
    .tag_box {
      width: 100%;
      display: flex;
      margin: 20px 0 0;
      .tag {
        width: 104px;
        height: 40px;
        font-size: 18px;
        line-height: 40px;
        color: @fontSub2;
        background: @white;
        box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 40px;
        text-align: center;
        margin-right: 20px;
        cursor: pointer;
        transition: all 0.2s;
        &.cur {
          color: @white;
          background: @main;
          cursor: pointer;
        }
      }
    }
  }
  .data_content {
    width: 100%;
    padding: 20px;
    // height: calc(100vh - 271px);
    // overflow-y: scroll;
    .data_item {
      width: 100%;
      // min-height: 460px;
      height: 460px;
      background: @white;
      margin-top: 20px;
      box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      position: relative;
      &.mtp0 {
        margin-top: 0;
      }
      &.clue {
        height: 430px;
      }
      &.group {
        height: 444px;
      }
      &.friend {
        height: 490px;
      }
      &.flow {
        height: 520px;
      }
      &.visit {
        height: 516px;
      }
      .data_title {
        font-size: 18px;
        font-weight: bold;
        color: @fontMain;
        position: absolute;
        left: 20px;
        top: 20px;
        z-index: 99;
      }
      .charts {
        width: 100%;
        height: 100%;
      }
      .select_box {
        width: 104px;
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 9;
        /deep/ .el-input__inner {
          height: 28px;
          line-height: 28px;
          border-radius: 16px;
        }
        /deep/ .el-input__icon {
          line-height: 28px;
        }
        /deep/ .el-select-dropdown__item.selected {
          color: @main;
        }
        /deep/ .el-select .el-input.is-focus .el-input__inner {
          border-color: @main;
        }
      }
    }
    .row {
      width: 100%;
      display: flex;
      &.w5 .data_item {
        width: 50%;
        &:last-child {
          width: 50%;
        }
      }
      .data_item {
        width: calc((100% - ((100% - 30px) / 3)));
        margin-top: 0;
        &:last-child {
          width: calc((100% - 30px) / 3);
          margin-left: 20px;
        }
      }
    }
  }
}
</style>