<template>
  <div class="main-content" v-loading='loading'>
    <TitleBar title="有效线索认定规则"></TitleBar>
    <SwitchButton @fnOpen='fnOpen' @fnHide='fnHide' labelText="该规则设置完成后，线索将自动转换为客户" v-model='switchBtn'
                  :distype="expandedKeys.some((item) => item.enName == 'switch')" />
    <div class="setContnt" v-show="switchBtn">
      <div class="customBox">
        <el-checkbox v-model="checkedCustom" false-label='0' true-label='1' @change="customerTag">
          客户标签
        </el-checkbox>
        <span :class="checkedCustom == 1 ? 'active' :'tagText'" v-show="checkedCustom == 1 " class="commonText" @click="setingTag">设置标签</span>
        <div class="tagBox" v-show="checkedCustom == 1">
          <span class="tagOne" v-for="(item,index) in tagList" :key="index">
            {{item.name}}
          </span>
        </div>
      </div>
      <div class="customBox ">
        <el-checkbox v-model="checkedCondition" false-label='0' true-label='1' @change="fnCondition">
          满足以下条件的线索
        </el-checkbox>
        <span :class="checkedCondition == 1 ? 'active' :'tagText'" v-show="checkedCondition == 1 " class="commonText" @click="setingField">设置字段</span>
        <div class="tagBox" v-show="checkedCondition == 1">
          <span class="tagOne" v-for="(item,index) in arrFiled" :key="index">
            {{item.name}}
          </span>
        </div>
      </div>
      <el-button type="primary" class="saveBtn" @click="savePage">保存</el-button>
    </div>
    <GroupTagList :groupVisible='tagDialog' @groupVisibleFrom='groupVisibleFrom' @closeDialog='closeDialog' :tabeList='tabeList' v-if="tagDialog">
    </GroupTagList>

    <SettingFiled :visible='fildDialog' @cancelBox='cancelBox' @hideField='hideField' :tempField='tempField' v-if="fildDialog"></SettingFiled>
  </div>
</template>
<script>
import TitleBar from '../../../components/customerFlow/TitleBar'
import SwitchButton from '../../../components/customerFlow/SwitchButton.vue'
import GroupTagList from '../../../components/customerFlow/GroupTagList'
import SettingFiled from '../../../components/customerFlow/SettingFiled.vue'
import { getHomeInfo, changeBtnStatus, updatePage } from '../../../api/custom'
import MyMixin from '../../../mixins/permissions'
export default {
  components: {
    TitleBar,
    SwitchButton,
    GroupTagList,
    SettingFiled,
  },
  created() {
    this.getDetail()
  },
  mixins: [MyMixin],
  data() {
    return {
      switchBtn: 0,
      checkedFriend: '',
      checkedCustom: '',
      checkedCondition: '',
      tagList: [],
      tabeList: [],
      arrFiled: [],
      tempField: [],
      tagDialog: false,
      fildDialog: false,
      id: '',
      defaultId: '',
      loading: false,
    }
  },
  methods: {
    getDetail() {
      let obj = { regularType: 1 }
      this.loading = true
      getHomeInfo(obj).then((res) => {
        this.loading = false
        this.switchBtn = res.data.regular.buttonType
        this.id = res.data.regular.id
        if (res.data.regularRoleList.length) {
          this.checkedCustom =
            res.data.regularRoleList[0].satisfyTagType.toString()
          this.checkedCondition =
            res.data.regularRoleList[0].satisfyParamType.toString()
          this.defaultId = res.data.regularRoleList[0].id || ''
          this.tagList = res.data.regularRoleList[0].satisfyTag || []
          this.arrFiled = res.data.regularRoleList[0].satisfyParam || []
        }
      })
    },
    fnOpen(v) {
      this.switchBtn = v
      console.log(v)
      let params = {
        buttonType: v,
        id: this.id,
      }
      changeBtnStatus(params).then((res) => {})
    },
    fnHide(v) {
      this.switchBtn = v
      let params = {
        buttonType: v,
        id: this.id,
      }
      changeBtnStatus(params).then((res) => {})
    },
    customerTag(val) {},
    fnCondition(val) {},
    setingTag() {
      this.tagDialog = true
      this.tabeList = this.tagList
    },
    setingField() {
      this.fildDialog = true
      this.tempField = this.arrFiled.map((item) => item.code)
    },
    closeDialog() {
      // console.log(111111111)
      this.tagDialog = false
    },
    groupVisibleFrom(list) {
      // console.log(222222222222)
      this.tagDialog = false
      this.tagList = list
    },
    cancelBox() {
      this.fildDialog = false
    },
    hideField(arr) {
      this.fildDialog = false
      this.arrFiled = arr
    },

    savePage() {
      // console.log('this.taglist---', this.tagList, this.arrFiled)
      let params = {
        satisfyTag: this.tagList,
        satisfyParam: this.arrFiled,
        satisfyParamType: Number(this.checkedCondition),
        satisfyTagType: Number(this.checkedCustom),
        regularId: this.id,
        id: this.defaultId,
      }
      updatePage(params).then((res) => {
        this.$message({
          type: 'success',
          message: '操作成功',
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../styles/elementStyle.less';
@import './checkBox.less';
.main-content {
  min-height: 100vh;
  border-radius: 8px;
  background-color: #fff;
  padding: 0 16px;
}
.setContnt {
  margin-top: 16px;
  .addFriend {
    margin-bottom: 16px;
  }
  .customBox {
    margin-bottom: 16px;
    .commonText {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      letter-spacing: 0;
      font-weight: 400;
      display: inline-block;
      margin-left: 32px;
      cursor: pointer;
    }
    .active {
      color: #4168f6;
    }
    .tagText {
      color: #3c4353;
    }
    .tagBox {
      margin-top: 16px;
      width: 100%;
      background: #fafbff;
      border: 1px solid #d9dae4;
      border-radius: 4px;
      min-height: 88px;
      padding: 18px 0 18px 24px;
      .tagOne {
        font-size: 14px;
        color: #838a9d;
        background: #ffffff;
        border: 1px solid #d9dae4;
        border-radius: 4px;
        padding: 2px 8px;
        display: inline-block;
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }
  }
  .saveBtn {
    margin-top: 16px;
  }
}
</style>