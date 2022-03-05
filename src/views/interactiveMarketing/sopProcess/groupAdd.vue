<template>
  <div class="add_wrap">
    <div class="top_black" @click="$router.go(-1)">返回</div>
    <div class="add_content">
      <el-form :model="detail" :rules="rules" ref="ruleForm" label-width="76px" class="ruleForm">
        <div class="item_wrap">
          <div class="line_title">创建群SOP规则</div>
          <el-form-item label="规则名称：" prop="ruleName">
            <el-input v-model="detail.ruleName" maxlength="30" @input="detail.ruleName=detail.ruleName.replace(' ','')" show-word-limit
                      placeholder="请输入规则名称"></el-input>
          </el-form-item>
          <el-form-item label="使用群聊：" prop="groupIdArr">
            <el-select class="select" v-model="detail.groupIdArr" multiple placeholder="请选择群聊（可多选）">
              <el-option v-for="item in groupList" :key="item.id" :label="`${item.name}（${item.usersum}）群主：${item.owmerName}`" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推送规则：" prop="promptRule">
            <el-radio-group v-model="radio" @change="radioFun">
              <el-radio label="0">定时推送</el-radio>
              <el-radio label="1">周期推送</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="detail.promptRule == '1'" label="设定时间：" prop="promptPeriodBegin">
            <div class="time_row">
              <div class="time_item">
                <div class="tit">开始时间</div>
                <div class="val">
                  <el-date-picker class="select" :picker-options="pickerOptions" v-model="detail.promptPeriodBegin" value-format="yyyy-MM-dd"
                                  type="date" placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
              <div class="time_item">
                <div class="tit">结束时间</div>
                <div class="val">
                  <el-date-picker class="select" :picker-options="pickerOptionsEnd" v-model="detail.promptPeriodEnd" value-format="yyyy-MM-dd"
                                  type="date" placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="item_wrap">
          <div class="line_title">设置推送周期及内容</div>
          <div class="btn_add" @click="addDialog">
            <img class="icon" src="@/assets/images/icon_add@2x.png" alt="" />
            <span class="text">添加内容</span>
          </div>
          <div class="setting_detail_wrap" v-if="!isNoData && list && list.length > 0">
            <div class="detail_box" v-show="item.modifyType != 'delete'" v-for="(item,index) in list" :key="index">
              <div class="dot"></div>
              <div class="opera_box">
                <div class="edit_btn" @click="editFun(index)">编辑</div>
                <div class="delete_btn" @click="deleteFun(index)">删除</div>
              </div>
              <div class="item">
                <div class="label">内容名称：</div>
                <div class="val">{{item.name}}</div>
              </div>
              <div class="item">
                <div class="label">推送时间：</div>
                <div class="val">{{item.promptTimeMsg}}</div>
              </div>
              <div class="item">
                <div class="label">推送内容：</div>
                <div class="val">
                  <p class="tit">{{item.content}}</p>
                  <div class="inside_box" v-for="(son,i) in item.sopContentAttachmentVOS" :key="i">
                    <!-- <div class="img_row" v-if="son.fileName">
                                            <div class="img_box">
                                                <img :src="son.url" alt="">
                                            </div>
                                            <div class="info_r">
                                                <div class="name">{{son.fileName}}</div>
                                                <div class="size">{{son.fileSize}}</div>
                                            </div>
                                        </div>
                                        <div class="share_link" v-else>{{son.url}}</div> -->
                    <div class="img_row" v-if="son.attachmentType == 3 && son.tab == 3">
                      <div class="img_box">
                        <img :src="son.cover" alt="" v-if="son.title">
                        <img :src="son.url" alt="" v-else>
                      </div>
                      <div class="info_r">
                        <div class="name">{{son.fileName || son.title}}</div>
                        <div class="size">{{son.fileSize}}</div>
                      </div>
                    </div>
                    <div class="img_row" v-if="son.attachmentType == 1">
                      <div class="img_box">
                        <img :src="son.url" alt="">
                      </div>
                      <div class="info_r">
                        <div class="name">{{son.fileName}}</div>
                        <div class="size">{{son.fileSize}}</div>
                      </div>
                    </div>
                    <!-- <div class="share_link" v-else>{{son.url}}</div> -->
                    <!-- <div class="share_box" v-if=" son.attachmentType == 2 ">
                                            <div>
                                              <div class="title">{{son.title}}</div>
                                              <div class="des">{{son.urlAbstract}}</div>
                                            </div>
                                                <div class="line">
                                                <div class="img_box">
                                                    <img :src="son.cover" alt="">
                                               </div>
                                            </div>
                                        </div> -->
                    <div class="share_box" v-if=" son.attachmentType == 2">
                      <div>
                        <div class="title">{{son.title}}</div>
                        <div class="des">{{son.urlAbstract}}</div>
                      </div>
                      <div class="line">
                        <div class="img_box">
                          <img :src="son.cover" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="share_box" v-if="son.attachmentType == 3 && son.tab == 1">
                      <div>
                        <div class="title">{{son.title}}</div>
                        <div class="des">{{son.urlAbstract}}</div>
                      </div>
                      <div class="line">
                        <div class="img_box">
                          <img :src="son.cover" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="share_box" v-if=" son.attachmentType == 3 && son.tab == 2 ">
                      <div class="line">
                        <div class="img_box">
                          <!-- <img src="../../../assets/images/pdf_image.png" alt=""> -->
                          <img :src="son.cover" alt="">
                        </div>
                      </div>
                      <div>
                        <div class="title">{{son.title}}</div>
                        <div class="des">{{$filterSize(son.fileSizes)}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-button v-if="!isNoData && list && list.length > 0" class="creat_btn" @click="addFun" size="small" type="primary" v-preventReClick>
            {{id?'保存修改':'创建'}}</el-button>
          <div class="no_data" v-if="isNoData">
            <img class="img" src="@/assets/images/sop_nodata.png" alt="">
          </div>
        </div>
      </el-form>
    </div>
    <!-- 添加内容 -->
    <el-dialog class="dialog_wraps" title="添加内容" :visible.sync="dialog_add" width="736px">
      <div class="dialog_content">
        <el-form :model="addData" :rules="addRules" ref="ruleFormAdd" label-width="76px" class="ruleForm">
          <el-form-item label="内容名称：" prop="name">
            <el-input v-model="addData.name" @input="addData.name=addData.name.replace(' ','')" maxlength="30" show-word-limit placeholder="请输入内容名称">
            </el-input>
          </el-form-item>
          <el-form-item :class="{'lh22':detail.promptRule != '0'}" label="推送时间：" prop="pushType">
            <div v-if="detail.promptRule == '0'">
              <div class="d_line">
                <el-radio v-model="addData.pushType" label="1">配置本条规则后</el-radio>
                <el-input class="small_input small" maxlength="3" v-model="addData.m" @input="addData.m=addData.m.replace(/[^\d]/g,'')"></el-input>
                <el-select class="small_select" v-model="addData.timeType">
                  <el-option v-for="item in timeOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <span class="text">提醒群主发送消息</span>
              </div>
              <div class="d_line">
                <el-radio v-model="addData.pushType" label="2">配置本条规则后</el-radio>
                <el-input class="small_input small" maxlength="3" v-model="addData.d" @input="addData.d=addData.d.replace(/[^\d]/g,'')"></el-input>
                <span class="text mr">天后，当日</span>
                <el-time-picker v-model="addData.time" :picker-options="{
                                        selectableRange: '00:00:00 - 23:59:59'
                                    }" format="HH:mm" value-format="HH:mm" :clearable="false" placeholder="时间">
                </el-time-picker>
                <span class="text">提醒群主发送消息</span>
              </div>
            </div>
            <div class="d_line" v-else>
              <el-radio v-model="addData.pushType" label="1" style="margin-right: 8px">配置本条规则后，每天</el-radio>
              <el-time-picker v-model="addData.time" :picker-options="{
                                    selectableRange: '00:00:00 - 23:59:59'
                                }" format="HH:mm" value-format="HH:mm" :clearable="false" placeholder="时间">
              </el-time-picker>
              <span class="text">提醒群主发送消息</span>
            </div>
          </el-form-item>
          <el-form-item label="推送内容：" prop="content">
            <el-input class="textarea" type="textarea" :autosize="{ minRows: 9}" v-model="addData.content" maxlength="500" show-word-limit
                      placeholder="请输入文字内容"></el-input>
          </el-form-item>
          <el-form-item class="hide" label="附件">
            <div class="enclosure_box">
              <div class="e_item" v-for="(item,index) in addData.sopContentAttachmentVOS" :key="index">
                <div class="label">附件{{index+1}}：</div>
                <div class="val">
                  <div class="delete_btn" @click="deleteEnclosureFun(index)">删除</div>
                  <div class="e_line">
                    <div class="e_tit">选择消息类型</div>
                    <div class="e_val">
                      <!-- <el-radio class="radio" v-model="item.attachmentType" label="1">图片</el-radio>
                      <el-radio class="radio" v-model="item.attachmentType" label="2" @change="chaneLink(index,'link')">链接</el-radio> -->
                      <el-radio class="radio" v-model="item.attachmentType" label="3" @change="changeRadio(index,'sucai')">素材库</el-radio>
                    </div>
                  </div>
                  <div class="upload_wrap" v-if="item.attachmentType == '1'">
                    <div class="upload_row">
                      <div class="upload_box">
                        <div class="img_box" v-if="item.url">
                          <img :src="item.url" alt="">
                        </div>
                        <div class="upload" v-else>
                          <div class="icon_box">
                            <div class="icon"></div>
                            <div class="text">上传图片</div>
                          </div>
                          <input class="file" type="file" @change="uploadFun($event,'images','sop','png,jpg,jpeg','2',index)"
                                 accept=".png,.jpg,.jpeg" />
                        </div>
                      </div>
                      <div class="afresh_file" v-if="item.url">重新上传<input class="file" type="file"
                               @change="uploadFun($event,'images','sop','png,jpg,jpeg','2',index)" accept=".png,.jpg,.jpeg" /></div>
                    </div>
                    <div class="upload_tips">建议上传大小不超过2MB的图片，格式支持jpeg、jpg、png</div>
                  </div>
                  <div class="link_wrap" v-if="item.attachmentType == '2'">
                    <div class="input_item">
                      <el-input v-model="item.url" @keyup.enter.native="onSubmit"
                                @input="item.url=item.url.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[^\S+$]/g,'')" placeholder="链接地址请以http或https开头">
                      </el-input>
                    </div>
                    <div class="l_item">
                      <div class="l_label"><span style="color:red">*</span> 链接标题：</div>
                      <div class="l_val">
                        <el-input v-model="item.title" placeholder=""></el-input>
                      </div>
                    </div>
                    <div class="l_item">
                      <div class="l_label">链接摘要：</div>
                      <div class="l_val">
                        <el-input v-model="item.urlAbstract" placeholder=""></el-input>
                      </div>
                    </div>
                    <div class="l_items">
                      <div class="l_label mr">链接封面：</div>
                      <div class="l_val upload_wrap">

                        <!-- <el-upload v-if="!item.linkImgUrl" class="upload-demo" ref='upload' drag action='#' :http-request='handleChange' :file-list="linkImgList"
                                                   :limit='1' >
                                                     <i class="el-icon-upload"></i>
                                                     <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                                 </el-upload> -->
                        <!-- <div v-else  class="cover_img">
                                                    <img :src="item.linkImgUrl" alt="" class="cover_warp">
                                                      <img @click="dleatImg" src="../../../assets/images/dtfriend.png" alt="" class="dtfriend">
                                                </div> -->
                        <div class="upload_row">
                          <div class="upload_box">
                            <div class="img_box" v-if="item.cover">
                              <img :src="item.cover" alt="">
                            </div>
                            <div class="upload" v-else>
                              <div class="icon_box">
                                <div class="icon"></div>
                                <div class="text">上传图片</div>
                              </div>
                              <input class="file" type="file" @change="uploadFuns($event,'images','sop','png,jpg,jpeg','2',index)"
                                     accept=".png,.jpg,.jpeg" />
                            </div>
                          </div>
                          <!-- <div class="afresh_file" v-if="item.url">重新上传<input class="file" type="file" @change="uploadFun($event,'images','sop','png,jpg,jpeg','2',index)" accept=".png,.jpg,.jpeg" /></div> -->
                          <div class="afresh_file" v-if="item.cover">重新上传<input class="file" type="file"
                                   @change="uploadFuns($event,'images','sop','png,jpg,jpeg','2',index)" accept=".png,.jpg,.jpeg" /></div>
                        </div>
                      </div>
                    </div>
                    <!-- <div class="l_item">
                                            <div class="l_label">链接标题：</div>
                                            <div class="l_val"></div>
                                        </div>
                                        <div class="l_item">
                                            <div class="l_label">链接摘要：</div>
                                            <div class="l_val"></div>
                                        </div> -->
                  </div>
                  <div class="material_warp" v-if="item.attachmentType == '3'">
                    <div class="mater_content">
                      <div class="articleShow" v-show="item.objectName == 1">
                        <span>文章：{{item.title}}</span>
                        <div class="txt_btn" @click="resetSlect(index)">重新选择</div>
                        <div class="card_article" v-show="item.objectName == 1 && item.title">
                          <div class="title">{{item.title}}</div>
                          <div class="content">
                            <div class="left">{{item.urlAbstract}}</div>
                            <div class="right">
                              <img :src="item.cover" alt="">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="fileSHow" v-show="item.objectName == 2">
                        <span>文件：{{item.title}}</span>
                        <span class="txt_btn" @click="resetSlect(index)">重新选择</span>
                        <div class="card_article" v-show="item.objectName == 2 && item.title">
                          <div class="content">
                            <div class="left">
                              <!-- <img src="../../../assets/images/pdf_image.png" alt=""> -->
                              <img :src="item.cover" alt="">
                            </div>
                            <div class="right">
                              <div class="fileName">{{item.title}}</div>
                              <div class="fileSize">{{$filterSize(item.fileSizes)}}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="photoSHow" v-show="item.objectName == 3">
                        <span>海报：{{item.fileName}}</span>
                        <div class="photo_card">
                          <span class="phonto_box" v-show="item.objectName == 3 && item.url">
                            <img :src="item.url" alt="" />
                          </span>
                          <span class="txt_btn" @click="resetSlect(index)">重新选择</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="add_box"
                 v-if="!addData.sopContentAttachmentVOS || (addData.sopContentAttachmentVOS && addData.sopContentAttachmentVOS.length < 9)">
              <div class="btn_add" @click="addEnclosureFun">
                <img class="icon" src="@/assets/images/icon_add@2x.png" alt="" />
                <span class="text">添加附件</span>
              </div>
              <span class="tips">（最多可添加9个附件）</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog_footer">
        <el-button size="small" @click="dialog_add = false">取 消</el-button>
        <el-button size="small" class="btn" type="primary" @click="confirmFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 素材库 -->
    <div v-if="openDialog">
      <MaterialDialog @sure='fnMaterialInfo' ref='mater' :dialogVisible='openDialog' :modals='modalsData'></MaterialDialog>
    </div>
    <!-- 删除弹窗 tips -->
    <DeleteDialog v-model="dialog_delete" @sure="confirmDeleteFun"></DeleteDialog>
  </div>
</template>

<script>
import DeleteDialog from '@/views/customerManagement/component/DeleteDialog.vue'
import { getarticle } from '../../../api/friend'
import {
  sop_add,
  sop_detail,
  sop_edit,
  sop_groupList,
  sop_sopNameValidate,
} from '@/api/sop'
import MaterialDialog from '../../../components/materialDialog/index.vue'
export default {
  components: {
    DeleteDialog,
    MaterialDialog,
  },
  data() {
    return {
      linkImgUrl: '',
      modalsData: true,
      openDialog: false,
      linkImgList: [],
      indesMum: '',
      imgArrUrl: [],
      materObj: {},
      // id: this.$route.query.id,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 //8.64e7当前时间可以选择  8.64e6当前时间不可选
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          let delay = this.detail.promptPeriodBegin
          if (delay) {
            // const dd = new Date('2019-09-03').getTime();//9月3号
            // return time.getTime() < dd;
            return time.getTime() < new Date(delay).getTime()
          }
        },
      },
      value: '',
      options: [],
      index2: null,
      detail: {
        groupId: '',
        groupIdArr: [], //本地用
        sopType: 1, //个人0  群1
        ruleName: '',
        promptRule: '0', //推送规则
        promptPeriodBegin: '',
        promptPeriodEnd: '',
        sopContentVOS: [
          // {
          //     name: '',
          //     promptTime: '',
          //     timeStr: '',    //暂时新增
          //     content: '',
          //     sopContentAttachmentVOS: [
          //         {
          //             attachmentType: 2,    //附件类型:0-文本、1-图片、2-链接
          //             content: '',
          //             cover: '',
          //             sopContentId: '',
          //             title: '',
          //             url: '',
          //             urlAbstract: '',
          //         }
          //     ]
          // }
        ],
      },
      rules: {
        ruleName: [
          { required: true, message: '请输入规则名称', trigger: 'change' },
        ],
        groupIdArr: [
          { required: true, message: '请选择群聊', trigger: 'change' },
        ],
        promptRule: [
          { required: true, message: '请选择推送规则', trigger: 'change' },
        ],
        promptPeriodBegin: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value || !this.detail.promptPeriodEnd) {
                callback('请选择设定时间')
              } else {
                callback()
              }
            },
            trigger: 'change',
          },
        ],
      },
      dialog_add: false,
      radio: '0',
      num: '30',
      timeOption: [
        { value: 'M', label: '分钟' },
        { value: 'H', label: '小时' },
      ],
      dayTime: '12:00:00',
      addStatus: false,
      dialog_delete: false,
      addData: {
        name: '',
        promptTime: '',
        promptTimeMsg: '',
        content: '',
        modifyType: '', //insert-新增，update-修改，delete-删除

        pushType: '1', //推送类型
        m: '30',
        d: '1',
        timeType: 'M',
        time: '12:00',

        sopContentAttachmentVOS: [
          // {
          //     attachmentType: '2',
          //     content: '',
          //     cover: '',
          //     sopContentId: '',
          //     title: '',
          //     url: '',
          //     urlAbstract: '',
          //     fileName: '',
          //     fileSize: '',
          //     type: 'link',
          //     modifyType: 'insert'
          // }
        ],
      },
      addRules: {
        name: [
          { required: true, message: '请输入内容名称', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入推送内容', trigger: 'change' },
        ],
        pushType: [
          { required: true, message: '请选择推送时间', trigger: 'change' },
        ],
      },
      groupList: [],
      editIndex: null,
      deleteIndex: null,
      deleteData: [],
      isAdd: false,
      sourceRuleName: '',
    }
  },
  computed: {
    userNo() {
      let token = this.$store.getters.token || localStorage.getItem("token")
      return token.split('|')[1]
    },
    id() {
      return this.$route.query.id
    },
    list() {
      let list = []
      if (this.detail.sopContentVOS && this.detail.sopContentVOS.length > 0) {
        list = this.detail.sopContentVOS
        // list = this.detail.sopContentVOS.filter(el => {
        //     return el.modifyType != 'delete'
        // })
      }
      return list
    },
    isNoData() {
      //是否没有可展示数据
      let status = true,
        list = []
      if (this.detail.sopContentVOS && this.detail.sopContentVOS.length > 0) {
        list = this.detail.sopContentVOS.filter((el) => {
          return el.modifyType != 'delete'
        })
      }
      if (list.length > 0) {
        status = false
      }
      return status
    },
  },
  mounted() {
    this.getGroupList()
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    resetSlect(i) {
      // console.log(this.$refs.mater)
      // this.$refs.mater.dialogVisible = true
      this.index2 = i
      this.openDialog = true
    },
    changeRadio(i) {
      // this.deleteIndex = i
      this.index2 = i
      this.openDialog = true
      //   this.dialog_add = false
    },
    chaneLink(i, val) {
      if (val == 'link') {
        this.addData.sopContentAttachmentVOS[i].url = ''
        this.addData.sopContentAttachmentVOS[i].title = ''
        this.addData.sopContentAttachmentVOS[i].urlAbstract = ''
        this.addData.sopContentAttachmentVOS[i].cover = ''
        // this.addData.sopContentAttachmentVOS[this.indesMum].url = ''
      }
      console.log(i)
      this.indesMum = i
    },
    dleatImg() {
      //  this.linkImgUrl =""
      this.linkImgUrl = ''
    },
    fnMaterialInfo(obj) {
      console.log('----obj---', obj)
      let data = this.addData.sopContentAttachmentVOS[this.index2]
      console.log(data)
      data.tab = obj.tab
      data.objectName = obj.tab
      // data.tabs = obj.tab
      data.urlAbstract = obj.contentAbstract
      if (data.tab == 1) {
        data.title = obj.title
        // data.attachmentType = 4
      } else {
        data.title = obj.name
      }
      data.cover = obj.cover
      data.url = obj.posterUrl
      ;(data.fileSizes = obj.fileSize),
        (data.fileName = obj.posterName),
        (this.openDialog = false)
      data.objList = obj
    },
    onSubmit() {
      this.loading = true
      let data_url = this.addData.sopContentAttachmentVOS[this.indesMum].url
      let params = {
        articleUrl: window.btoa(data_url),
      }
      //  console.log(params,'---parasm----')

      getarticle(params).then((res) => {
        console.log(res, '----00')
        if (res.result) {
          let data = this.addData.sopContentAttachmentVOS[this.indesMum]
          data.title = res.data.title
          data.urlAbstract = res.data.contentAbstract
          // data.linkImgUrl = res.data.cover
          data.cover = res.data.cover
          //  this.itemInfo.urltite = res.data.title
          //  this.itemInfo.urldigest = res.data.contentAbstract
          //  this.itemInfo.linkImgUrl = res.data.cover
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    getDetail() {
      //获取详情
      sop_detail(this.id).then((res) => {
        if (res.result) {
          let data = res.data
          this.sourceRuleName = JSON.parse(JSON.stringify(data.ruleName))
          data.sopContentVOS.forEach((el) => {
            if (
              !el.content &&
              el.sopContentAttachmentVOS &&
              el.sopContentAttachmentVOS.length > 0
            ) {
              el.content = el.sopContentAttachmentVOS[0].content
            }
          })
          data.promptRule = String(data.promptRule)
          this.detail = Object.assign(this.detail, data)
          this.radio = this.detail.promptRule
          let arr = data.groupId.split('|')
          arr.forEach((el) => {
            this.detail.groupIdArr.push(Number(el))
          })
        }
      })
    },
    confirmFun() {
      //确定添加内容 or 编辑内容
      let data = JSON.parse(JSON.stringify(this.addData))
      console.log(data, '点击确定')
      // data.promptTime = this.getPromptTime(data)
      data.sopContentAttachmentVOS.forEach((item, indexs) => {
        if (item.objList) {
          console.log(item, '-----item')
          let imgArr = []
          if (window.location.origin == 'https://console.jzcrm.com') {
            this.shareUrlOrigin = 'https://h5.jzcrm.com'
          } else {
            this.shareUrlOrigin = 'https://test-h5.jzcrm.com'
          }
          if (item.tab == 1) {
            imgArr = [
              {
                urls: `${this.shareUrlOrigin}/materialTemplate?materialId=${
                  item.objList.articleId
                }&type=${item.objList.tab}&corpId=${localStorage.getItem(
                  'corpId'
                )}&createUserNo=${this.userNo}`,
                ...item.objList,
              },
            ]
          } else if (item.objList.tab == 2) {
            imgArr = [
              {
                urls: `${this.shareUrlOrigin}/materialTemplate?materialId=${
                  item.objList.documentId
                }&type=${item.objList.tab}&corpId=${localStorage.getItem(
                  'corpId'
                )}&createUserNo=${this.userNo}`,
                ...item.objList,
              },
            ]
          } else {
            imgArr = [item.objList]
          }
          // }
          // console.log(imgArr,"---l ")
          this.imgArrUrl = imgArr
          this.imgArrUrl.forEach((item) => {
            //  console.log(item,"---------l")
            if (item.tab == 1 || item.tab == 2) {
              data.sopContentAttachmentVOS[indexs].url = item.urls
            }
          })
        }
      })
      if (this.detail.promptRule == '1') {
        //周期推送
        data.promptTime = '0D-' + data.time
        data.promptTimeMsg =
          '配置本条规则后，每天' + data.time + '提醒群主发送消息'
      } else {
        data.promptTime = this.getPromptTime(data)
        data.promptTimeMsg = this.getPromptTime(data, 'name')
      }
      let isEnclosureEmpty = false,
        isLink = false
      if (
        data.sopContentAttachmentVOS &&
        data.sopContentAttachmentVOS.length > 0
      ) {
        data.sopContentAttachmentVOS.forEach((el) => {
          el.content = data.content
          el.attachmentType = Number(el.attachmentType)
          if (el.url == '') {
            isEnclosureEmpty = true
          }
          if (
            el.attachmentType == 2 &&
            (!this.$httpReg(el.url) || !this.$linkReg(el.url))
          ) {
            isLink = true
          }
        })
      }
      if (isEnclosureEmpty) {
        this.$message({ message: '请填写完整的附件信息', type: 'error' })
        return false
      }
      if (isLink) {
        this.$message({ message: '请填写正确的链接地址格式', type: 'error' })
        return false
      }
      console.log('confirm ', data)
      this.$refs.ruleFormAdd.validate((valid) => {
        if (valid) {
          console.log('submit! valid')
          if (this.editIndex === null) {
            //新增
            data.modifyType = 'insert'
            this.detail.sopContentVOS.push(data)
          } else {
            //编辑
            let modifyData = this.detail.sopContentVOS[this.editIndex]
            modifyData = Object.assign(modifyData, data)
            if (modifyData.id) {
              modifyData.modifyType = 'update'
            }
            if (
              modifyData.sopContentAttachmentVOS &&
              modifyData.sopContentAttachmentVOS.length > 0
            ) {
              modifyData.sopContentAttachmentVOS.forEach((el) => {
                if (!el.modifyType) {
                  el.modifyType = 'update'
                }
              })
            }
          }
          this.dialog_add = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addFun() {
      //新增规则确定
      let data = this.detail
      data.groupId = data.groupIdArr.join('|')
      console.log('submit', data)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('submit! valid')
          if (
            new Date(data.promptPeriodEnd).getTime() <
            new Date(data.promptPeriodBegin).getTime()
          ) {
            this.$message({
              message: '设定时间结束时间不能小于开始日期',
              duration: 2000,
              type: 'error',
            })
            return false
          }
          this.checkRuleNameFun().then((checkResult) => {
            //校验是否重复
            if (checkResult) {
              if (this.id) {
                sop_edit(data).then((res) => {
                  if (res.result) {
                    this.$message({ message: '修改成功！', type: 'success' })
                    this.$router.replace(
                      '/interactivemarketing/sopProcess/group'
                    )
                  }
                })
              } else {
                sop_add(data).then((res) => {
                  if (res.result) {
                    this.$message({ message: '创建成功！', type: 'success' })
                    this.$router.replace(
                      '/interactivemarketing/sopProcess/group'
                    )
                  }
                })
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addDialog() {
      //添加内容弹窗
      this.addData = this.$options.data().addData
      if (this.editIndex !== null || this.isAdd) {
        this.$refs.ruleFormAdd.resetFields()
      }
      this.editIndex = null
      this.isAdd = true
      this.dialog_add = true
    },
    editFun(i) {
      //编辑内容
      this.editIndex = i
      let data = this.addData
      data = Object.assign(
        data,
        JSON.parse(JSON.stringify(this.detail.sopContentVOS[i]))
      )
      let arr = data.promptTime.split('-') || []
      if (this.detail.promptRule == '1') {
        //定期
        data.pushType = '1'
        data.time = arr[arr.length - 1]
      } else {
        if (data.promptTime.indexOf('D') > -1) {
          data.pushType = '2'
          data.time = arr[arr.length - 1]
          data.d = parseInt(arr[0], 10)
        } else {
          data.pushType = '1'
          data.m = parseInt(data.promptTime, 10)
          data.timeType = data.promptTime.indexOf('M') > -1 ? 'M' : 'H'
        }
      }
      if (
        data.sopContentAttachmentVOS &&
        data.sopContentAttachmentVOS.length > 0
      ) {
        data.sopContentAttachmentVOS.forEach((el) => {
          // el.attachmentType = el.fileName ? '1' : '2'
          el.attachmentType = el.attachmentType.toString()
        })
      }
      this.dialog_add = true
    },
    deleteFun(i) {
      //删除内容
      this.deleteIndex = i
      this.dialog_delete = true
    },
    confirmDeleteFun() {
      //确认删除内容
      let i = this.deleteIndex
      let _data = this.detail.sopContentVOS
      if (_data[i].id) {
        _data[i].modifyType = 'delete'
        if (
          _data[i].sopContentAttachmentVOS &&
          _data[i].sopContentAttachmentVOS.length > 0
        ) {
          _data[i].sopContentAttachmentVOS.forEach((el) => {
            el.modifyType = 'delete'
          })
        }
      } else {
        _data.splice(i, 1)
      }
      this.dialog_delete = false
    },
    addEnclosureFun() {
      //添加附件
      let _data = {
        attachmentType: '',
        content: '',
        cover: '',
        sopContentId: '',
        title: '',
        url: '',
        urlAbstract: '',
        fileName: '',
        fileSize: '',
        objectName: '',
        modifyType: 'insert',

        urlImg: '',
        tab: '',
        titles: '',
        contentAbstract: '',
        name: '',
        fileSizes: '',
        posterName: '',
        posterUrl: '',
        linkImgUrl: '',
        objList: {},
        listurl: '',
      }
      if (!this.addData.sopContentAttachmentVOS) {
        this.addData.sopContentAttachmentVOS = []
      }
      this.addData.sopContentAttachmentVOS.push(_data)
    },
    deleteEnclosureFun(i) {
      //删除附件
      this.addData.sopContentAttachmentVOS.splice(i, 1)
    },
    uploadFun(e, fileType, type, accept, size, index) {
      //文件上传
      let fileName = e.target.files[0].name
      let fileSize = e.target.files[0].size
      this.$uploadFun(e, fileType, type, size, accept).then((res) => {
        if (res) {
          this.addData.sopContentAttachmentVOS[index].url = res.url
          this.addData.sopContentAttachmentVOS[index].objectName =
            res.objectname
          this.addData.sopContentAttachmentVOS[index].fileName = fileName
          this.addData.sopContentAttachmentVOS[index].fileSize =
            this.$filterSize(fileSize)
        }
      })
    },
    uploadFuns(e, fileType, type, accept, size, index) {
      //文件上传
      let fileName = e.target.files[0].name
      let fileSize = e.target.files[0].size
      this.$uploadFun(e, fileType, type, size, accept).then((res) => {
        if (res) {
          console.log(res)
          this.addData.sopContentAttachmentVOS[index].cover = res.url
          // this.addData.sopContentAttachmentVOS[index].objectName = res.objectname
          // this.addData.sopContentAttachmentVOS[index].fileName = fileName
          // this.addData.sopContentAttachmentVOS[index].fileSize = this.$filterSize(fileSize)
        }
      })
    },
    getGroupList() {
      //获取群列表
      sop_groupList().then((res) => {
        if (res.result) {
          let list = res.data
          this.groupList = list
        }
      })
    },
    checkRuleNameFun() {
      //校验规则名称是否可用
      let result = true
      if (this.id && this.sourceRuleName == this.detail.ruleName) {
        result = false
      }
      return new Promise((resolve, reject) => {
        if (result) {
          sop_sopNameValidate(this.detail.ruleName).then((res) => {
            if (res.result) {
              resolve(true)
            } else {
              reject(false)
            }
          })
        } else {
          resolve(true)
        }
      }).catch((err) => {})
    },
    getPromptTime(data, val) {
      let str = ''
      if (data.pushType == '1') {
        //一天内
        if (val) {
          let util = null
          this.timeOption.forEach((el) => {
            if (el.value == data.timeType) {
              util = el.label
            }
          })
          str = '配置本条规则后' + data.m + util + '提醒群主发送消息'
        } else {
          str = data.m + data.timeType
        }
      } else {
        //一天以上
        if (val) {
          str =
            '配置本条规则后' +
            data.d +
            '天后，当日' +
            data.time +
            '提醒群主发送消息'
        } else {
          str = data.d + 'D-' + data.time
        }
      }
      return str
    },
    radioFun() {
      //推送规则切换
      let list = this.detail.sopContentVOS
      if (list && list.length > 0) {
        this.$confirm('此操作会导致设置的推送内容置空, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.detail.promptRule = this.radio
            if (this.radio == '0') {
              this.detail.promptPeriodBegin = ''
              this.detail.promptPeriodEnd = ''
            }
            if (this.id) {
              let list = this.detail.sopContentVOS.filter((el) => {
                return el.id
              })
              list.forEach((el) => {
                el.modifyType = 'delete'
              })
              this.detail.sopContentVOS = list
            } else {
              this.detail.sopContentVOS = []
            }
          })
          .catch(() => {
            this.radio = this.detail.promptRule
          })
      } else {
        this.detail.promptRule = this.radio
      }
      console.log('asd', this.detail.promptRule)
    },
  },
}
</script>

<style lang="less" scoped>
@main: #4168f6;
@white: #fff;
@fontMain: #3c4353;
@red: #d14343;
.add_wrap {
  width: 100%;
  /deep/ .el-tag.el-tag--info {
    background: none;
    border: none;
    position: relative;
    &::after {
      content: ',';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    &:last-child::after {
      content: '';
    }
    .el-tag__close {
      display: none;
    }
  }
  /deep/ .el-form-item {
    margin-bottom: 20px;
    &.hide .el-form-item__label {
      opacity: 0;
    }
    &.lh22 .el-form-item__label {
      line-height: 22px;
    }
    .el-form-item__label {
      padding-right: 0;
      font-weight: 400;
      line-height: 32px;
      white-space: nowrap;
    }
    .el-form-item__content {
      line-height: 32px;
    }
  }
  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  /deep/ .el-input__icon {
    line-height: 32px;
    height: 32px;
  }
  /deep/ .el-radio__input.is-checked .el-radio__inner {
    border-color: @main;
    background: @main;
  }
  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: @main;
  }
  .btn_add {
    display: inline-block;
    width: 104px;
    height: 32px;
    background: rgba(65, 104, 246, 0.04);
    border-radius: 4px;
    border: 1px solid @main;
    color: @main;
    padding-left: 32px;
    position: relative;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      background: rgba(65, 104, 246, 0.1);
    }
    .icon {
      width: 12px;
      height: 12px;
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
    }
    .text {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #4168f6;
      display: inline-block;
    }
  }
  .top_black {
    display: inline-block;
    font-size: 16px;
    line-height: 22px;
    color: #4168f6;
    font-weight: 500;
    margin-bottom: 16px;
    cursor: pointer;
    position: relative;
    padding-left: 20px;
    &::before {
      content: '<';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .add_content {
    width: 100%;
    min-height: calc(100vh - 126px);
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    .item_wrap {
      width: 782px;
      /deep/ .el-form-item {
        .el-form-item__content {
          .el-select__tags {
            .el-tag {
              overflow: auto;
            }
          }
        }
      }
      .line_title {
        font-size: 14px;
        line-height: 20px;
        color: #3c4353;
        font-weight: bold;
        position: relative;
        padding-left: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f2f7;
        margin-bottom: 20px;
        &:first-child {
          margin-bottom: 16px;
        }
        &::before {
          content: '';
          width: 2px;
          height: 14px;
          background: #4168f6;
          position: absolute;
          left: 0;
          top: 3px;
        }
      }
      .select {
        width: 100%;
      }
      .mbt32 {
        margin-bottom: 32px;
      }
      /deep/ .el-form-item:last-child {
        margin-bottom: 32px;
      }
    }
    .no_data {
      width: 100%;
      text-align: center;
      .img {
        width: 180px;
        display: inline-block;
      }
    }
    .creat_btn {
      width: 104px;
      background: @main;
      border-color: @main;
      margin-top: 20px;
      &:hover {
        background: rgba(@main, 0.85);
      }
    }
    .setting_detail_wrap {
      width: 100%;
      padding-left: 14px;
      padding-top: 36px;
      margin-top: 20px;
      position: relative;
      &::before {
        content: '';
        width: 1px;
        height: 20px;
        background: #f0f2f7;
        position: absolute;
        left: 1px;
        top: 12px;
      }
      &::after {
        content: '';
        width: 8px;
        height: 8px;
        background: @main;
        border-radius: 50%;
        position: absolute;
        left: -3px;
        top: 0;
      }
      .detail_box {
        width: 765px;
        min-height: 124px;
        background: #fafbff;
        border-radius: 8px;
        padding: 16px;
        position: relative;
        margin-bottom: 16px;
        &:last-child {
          margin-bottom: 0;
          &::before {
            content: '';
            height: calc(100% - 12px);
          }
        }
        &::before {
          content: '';
          width: 1px;
          height: calc(100% - 2px);
          background: #f0f2f7;
          position: absolute;
          left: -13px;
          top: 13px;
        }
        .inside_box {
          margin-bottom: 12px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .opera_box {
          display: flex;
          position: absolute;
          right: -16px;
          bottom: 0;
          transform: translateX(100%);
          .edit_btn {
            height: 20px;
            font-size: 14px;
            color: @main;
            position: relative;
            padding-left: 18px;
            cursor: pointer;
            margin-right: 16px;
            &::before {
              content: '';
              width: 14px;
              height: 14px;
              background: url('../../../assets/images/icon_edit2.png') no-repeat;
              background-size: 100%;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .delete_btn {
            height: 20px;
            font-size: 14px;
            color: @main;
            position: relative;
            padding-left: 18px;
            cursor: pointer;
            &::before {
              content: '';
              width: 14px;
              height: 14px;
              background: url('../../../assets/images/icon_delete2.png')
                no-repeat;
              background-size: 100%;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
        .dot {
          width: 8px;
          height: 8px;
          background: @main;
          border-radius: 50%;
          position: absolute;
          left: -17px;
          top: 0;
          &::before {
            content: '';
            width: 4px;
            height: 4px;
            background: @white;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .item {
          width: 100%;
          line-height: 20px;
          font-size: 14px;
          display: flex;
          margin-bottom: 16px;
          &:last-child {
            margin-bottom: 0;
          }
          .label {
            width: 80px;
            color: #3c4353;
          }
          .val {
            width: calc(100% - 70px);
            color: #838a9d;
            .tit {
              margin-bottom: 8px;
            }
            .img_row {
              width: 250px;
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              padding: 16px;
              border: 1px solid #d9dae4;
              .img_box {
                width: 60px;
                height: 60px;
                border-radius: 4px;
                overflow: hidden;
                margin-right: 16px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .info_r {
                width: calc(100% - 96px);
                .name {
                  line-height: 20px;
                  font-size: 14px;
                  color: #3c4353;
                  margin-bottom: 4px;
                  width: 145px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                .size {
                  height: 17px;
                  font-size: 12px;
                  color: #c0c4cc;
                }
              }
            }
            .share_box {
              width: 250px;
              height: 100px;
              background: #fff;
              border: 1px solid #d9dae4;
              padding: 16px;
              display: flex;
              .title {
                font-size: 14px;
                line-height: 20px;
                color: #3c4353;
                width: 145px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                height: 40px;
                line-height: 40px;
              }
              .line {
                width: 100%;
                display: flex;
                align-items: center;
                .des {
                  width: calc(100% - 66px);
                  font-size: 12px;
                  line-height: 17px;
                  color: #c0c4cc;
                  word-break: break-all;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                }
                .img_box {
                  width: 50px;
                  height: 50px;
                  margin-left: 16px;
                  // background: #FAFBFF;
                }
                .img_box {
                  width: 50px;
                  height: 50px;
                  margin-left: 16px;
                  // background: #FAFBFF;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
          }
        }
      }
    }
    .time_row {
      display: flex;
      .time_item {
        display: flex;
        align-items: center;
        margin-right: 32px;
        &:last-child {
          margin-right: 0;
        }
        .tit {
          width: 64px;
          font-size: 14px;
          line-height: 20px;
          color: @fontMain;
        }
        .val {
          width: 180px;
          .select {
            width: 100%;
          }
        }
      }
    }
  }
  // 弹窗 style
  .dialog_wraps {
    &.close {
      /deep/ .el-dialog__header {
        background: @white;
      }
      /deep/ .el-dialog__body {
        padding: 16px;
      }
      /deep/ .el-dialog__footer {
        border: none;
      }
    }
    /deep/ .el-dialog {
      border-radius: 8px;
    }
    /deep/ .el-dialog__header {
      background: #fafbff;
      padding: 14px 16px;
      border-radius: 8px 8px 0px 0px;
    }
    /deep/ .el-dialog__body {
      padding: 0;
    }
    /deep/ .el-dialog__footer {
      padding: 16px;
      border-top: 1px solid #f0f2f7;
      .btn {
        background: #4168f6;
        &:hover {
          background: rgba(#4168f6, 0.85);
        }
      }
    }
    .close_item {
      width: 100%;
      display: flex;
      .icon {
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
      .tips {
        font-size: 14px;
        color: @fontMain;
      }
    }
    .dialog_content {
      padding: 16px;
      /deep/ .select .el-input__icon {
        line-height: 22px;
        height: 22px;
      }
      .d_line {
        width: 100%;
        display: flex;
        align-items: center;
        .el-radio {
          margin-right: 0;
          display: flex;
        }
        /deep/ .el-radio__input.is-checked + .el-radio__label {
          color: #3c4353;
        }
        /deep/ .el-input__inner {
          height: 22px;
          line-height: 22px;
          padding: 0 5px;
        }
        /deep/ .el-input__icon {
          height: 22px;
          line-height: 22px;
        }
        /deep/ .el-input__prefix {
          right: 2px;
          left: auto;
        }
        .small_input {
          width: 40px;
          margin: 0 8px;
          /deep/ .el-input__inner {
            text-align: center;
          }
        }
        .small_select {
          width: 67px;
          margin-right: 8px;
          /deep/ .el-input__inner {
            padding-left: 10px;
          }
        }
        /deep/ .el-date-editor {
          width: 70px;
          margin-right: 8px;
          height: 22px !important;
          line-height: 22px !important;
          .el-input__inner {
            padding-left: 10px;
          }
        }
        .text {
          font-size: 14px;
          line-height: 20px;
          color: #3c4353;
          &.mr {
            margin-right: 8px;
          }
        }
      }
      /deep/ .textarea .el-textarea__inner {
        padding: 8px 16px;
      }
      .add_box {
        display: flex;
        align-items: center;
        margin-top: 16px;
        .tips {
          margin-left: 8px;
          color: #c0c4cc;
          font-size: 14px;
          line-height: 20px;
        }
      }
      .enclosure_box {
        width: 100%;
        .e_item {
          width: 100%;
          line-height: 20px;
          font-size: 14px;
          display: flex;
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
          .label {
            width: 48px;
            color: #3c4353;
            white-space: nowrap;
          }
          .val {
            width: calc(100% - 48px);
            min-height: 100px;
            border: 1px solid #d9dae4;
            border-radius: 4px;
            padding: 16px;
            position: relative;
            .delete_btn {
              height: 20px;
              font-size: 14px;
              color: #3c4353;
              position: absolute;
              right: 16px;
              top: 16px;
              padding-left: 18px;
              cursor: pointer;
              &::before {
                content: '';
                width: 14px;
                height: 14px;
                background: url('../../../assets/images/icon_delete@2x.png')
                  no-repeat;
                background-size: 100%;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            .e_line {
              width: 100%;
              display: flex;
              font-size: 14px;
              line-height: 20px;
              margin-bottom: 16px;
              .e_tit {
                width: 90px;
                color: #3c4353;
                margin-right: 16px;
              }
              .e_val {
                width: calc(100% - 100px);
                .radio {
                  margin-right: 16px;
                }
              }
            }
          }
        }
        .upload_wrap {
          width: 100%;
          .upload_row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 16px;
            font-size: 0;
            .afresh_file {
              margin-left: 16px;
              height: 20px;
              font-size: 14px;
              color: #4168f6;
              position: relative;
              .file {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
          .upload_box {
            width: 128px;
            height: 128px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            font-size: 0;
            .img_box {
              width: 100%;
              height: 100%;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .upload {
              width: 100%;
              height: 100%;
              border: 1px dashed #d9dae4;
              border-radius: 4px;
              text-align: center;
              padding-top: 34px;
              position: relative;
              .icon_box {
                .icon {
                  width: 24px;
                  height: 24px;
                  margin-bottom: 16px;
                  position: relative;
                  display: inline-block;
                  &::before {
                    content: '';
                    width: 2px;
                    height: 100%;
                    background: #c0c4cc;
                    position: absolute;
                    left: 50%;
                    top: 0;
                    transform: translateX(-50%);
                  }
                  &::after {
                    content: '';
                    height: 2px;
                    width: 100%;
                    background: #c0c4cc;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                  }
                }
                .text {
                  height: 20px;
                  font-size: 14px;
                  color: #c0c4cc;
                  text-align: center;
                }
              }
              .file {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
          .upload_tips {
            height: 20px;
            font-size: 14px;
            color: #c0c4cc;
          }
        }
        .link_wrap {
          width: 100%;
          .input_box {
            width: 100%;
          }
          .l_items {
            display: flex;
            align-items: normal;
            margin-top: 10px;
            .mr {
              margin-right: 4px;
              width: 90px;
            }
            .cover_img {
              position: relative;
              margin-top: 6px;
              .cover_warp {
                width: 128px;
                height: 128px;
                border-radius: 3px;
              }
              .dtfriend {
                width: 20px;
                height: 20px;
                position: absolute;
                top: -10px;
                right: -10px;
              }
            }
          }
          .l_item {
            display: flex;
            align-items: center;
            margin-top: 10px;
            .l_label {
              width: 95px;
            }
            .l_val {
              width: 100%;
            }
          }
        }
      }
    }
    .dialog_footer {
      .red {
        color: @white;
        background: @red;
        border-color: @red;
        &:hover {
          background: rgba(@red, 0.85);
        }
      }
    }
  }
  .material_warp {
    margin-top: 16px;
    border: 1px solid #f0f2f7;
    border-radius: 4px;
    //   width: 704px;
    min-height: 142px;
    display: flex;
    padding: 16px;
    font-size: 14px;
    color: #3c4353;
    .txt_btn {
      cursor: pointer;
      color: #4168f6;
      display: inline-block;
      margin-left: 16px;
    }
    .mater_content {
      .articleShow {
        span {
          display: inline-block;
          margin-bottom: 8px;
        }
        .card_article {
          width: 250px;
          border: 1px solid #d9dae4;
          padding: 16px;
          margin-top: 16px;
          line-height: 20px;
          .title {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .content {
            display: flex;
            .left {
              width: 152px;
              margin-right: 16px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              line-clamp: 3;
              -webkit-box-orient: vertical;
              font-size: 12px;
              color: #c0c4cc;
            }
            .right {
              img {
                width: 50px;
                height: 50px;
              }
            }
          }
        }
      }
      .fileSHow {
        .card_article {
          width: 250px;
          border: 1px solid #d9dae4;
          padding: 16px;
          margin-top: 16px;
          .title {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .content {
            display: flex;
            .left {
              margin-right: 8px;
              img {
                width: 60px;
                height: 60px;
              }
            }
            .right {
              .fileSize {
                font-size: 12px;
                color: #c0c4cc;
                margin-top: 4px;
              }
              .fileName {
                font-size: 14px;
                color: #3c4353;
                width: 80px;
                height: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      .photoSHow {
        .photo_card {
          .phonto_box {
            margin-top: 16px;
            display: inline-block;
            width: 128px;
            height: 128px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #d9dae4;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>