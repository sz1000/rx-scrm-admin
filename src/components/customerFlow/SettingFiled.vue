<template>
  <div class="fieldWarp">
    <el-dialog title="设置字段" :visible.sync="visible" :before-close="dialogFormCancel"
      :close-on-click-modal="false" width="520px">
      <div class="tableCheck">
        <div class="headertxt">
          <span>显示</span>
          <span>列表</span>
        </div>
        <el-checkbox-group v-model="checkedCities" @change="onCheckId">
          <li v-for="(city,index) in cities" :key="index" class="rowcheck">
            <el-checkbox :label="city.code">{{city.name}}</el-checkbox>
          </li>
        </el-checkbox-group>
      </div>
      <span slot="footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getFieldList } from '../../api/custom'
export default {
  props: {
    visible: {
      type: Boolean,
    },
    tempField: {
      type: Array,
    },
  },
  data() {
    return {
      checkedCities: [],
      cities: [],
    }
  },
  created() {
    this.getDetail()
  },
  mounted() {
    this.checkedCities = this.tempField
  },
  methods: {
    getDetail() {
      getFieldList().then((res) => {
        this.cities = res.data.params
      })
    },
    dialogFormCancel() {
      this.$emit('cancelBox')
    },
    onCheckId(val) {},
    save() {
      let fieldList = []
      this.cities.forEach((item) => {
        this.checkedCities.forEach((val) => {
          if (val == item.code) {
            fieldList.push(item)
          }
        })
      })
      this.$emit('hideField', fieldList)
      // console.log('-----this.checkedCities', this.checkedCities)
    },
  },
}
</script>
<style lang="less" scoped>
@import url('../../styles/elementStyle.less');
.fieldWarp {
  .tableCheck {
    .headertxt {
      line-height: 40px;
      height: 40px;
      background: #fafbff;
      font-size: 14px;
      color: #3c4353;
      border-bottom: 1px solid #f0f2f7;
      span {
        display: inline-block;
        width: 188px;
        box-sizing: border-box;
      }
      span:nth-child(1) {
        padding-left: 32px;
      }
      span:nth-child(2) {
        padding-left: 10px;
      }
    }
    .rowcheck {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #f0f2f7;
      /deep/.el-checkbox__input {
        width: 188px;
        padding-left: 32px;
      }
      .el-checkbox__label {
        padding-left: 0;
      }
    }
  }
  /deep/.el-dialog__header {
    background: #fafbff;
    border-radius: 8px 8px 0px 0px;
    border-bottom: 1px solid #f0f2f7;
    font-size: 16px;
  }
  /deep/.el-dialog__body {
    height: 487px;
    overflow-y: auto;
    padding: 0;
  }
  /deep/.el-dialog__footer {
    border-top: 1px solid #f0f2f7;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #3c4353;
    letter-spacing: 0;
    font-weight: 400;
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__inner {
    background-color: #4168f6 !important;
    border-color: #4168f6 !important;
  }
}
</style>