<template>
    <div>
        <el-dialog
            class="rule-edit"
            :title="title"
            :visible.sync="ruleEditDialogVisible"
            :close-on-click-modal="false"
            @close="hide"
            :destroy-on-close="true"
            width="520px">
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="90px"
                label-position="right"
            >
                <el-form-item label="规则名称:" prop="ruleName">
                    <el-input
                        v-model.trim="form.ruleName"
                        placeholder="请输入"
                        maxlength="20"
                        show-word-limit
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="使用范围:" prop="scopeOfUseDataList">
                    <div class="user-box pointer" @click="showUsersDialog">
                        <span v-if="!form.scopeOfUseDataList || form.scopeOfUseDataList && !form.scopeOfUseDataList.length" class="placeholder">请选择</span>
                        <div v-if="form.scopeOfUseDataList && form.scopeOfUseDataList.length">
                            <span v-for="(i, index) in form.scopeOfUseDataList" :key="i.id" class="user-item">
                                <jzIcon v-if="i.type == 2" class="jz_icon" type="icon-icon_folder"></jzIcon>
                                <jzIcon v-if="i.type == 3" class="jz_icon" type="icon-icon_header"></jzIcon>
                                <span>{{ i.name }}</span> 
                                <span class="delete-user" @click.prevent.stop="deleteUser(index)">×</span>
                            </span>
                        </div>
                        <div class="jz_icon-box"><jzIcon class="jz_icon" type="icon-icon_down_arrow"></jzIcon></div>
                    </div>
                </el-form-item>
                <el-form-item label="拦截方式:" prop="interceptType">
                    <el-radio-group v-model="form.interceptType">
                        <el-radio :label="1">警告并拦截发送</el-radio>
                        <el-radio :label="2">仅发警告</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="其他拦截:">
                    <el-checkbox-group v-model="prohibitSend" @change="getProhibitSend">
                        <el-checkbox v-for="i in prohibitSendList" :key="i.name" :label="i.value">{{ i.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="敏感词:" prop="sensitiveWordsRels">
                    <div v-for="(i, index) in form.sensitiveWordsRels" :key="i.id">
                        <el-input
                            v-model.trim="i.content"
                            class="sensitiv-words-inp"
                            placeholder="请输入"
                            maxlength="32"
                            show-word-limit
                            clearable
                        ></el-input>
                        <img v-show="form.sensitiveWordsRels.length > 1" @click="removeSensitiveWords(index)" class="delete-btn pointer" src="../../../assets/images/reduceone@2x.png" alt="">
                    </div>
                    <div v-if="form.sensitiveWordsRels.length < 300" class="add-btn pointer" @click="addSensitiveWords">
                        <img src="../../../assets/images/icon_add@2x.png" alt="" />
                        <span>添加敏感词</span>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" :class="{'dialog-footer-delete': sensitiveWordId}">
                <span v-if="sensitiveWordId" class="delete pointer" @click="deleteRow(sensitiveWordId)">删除规则</span>
                <span>
                    <el-button @click="hide">取消</el-button>
                    <el-button type="primary" @click="confirm">确定</el-button>
                </span>
            </span>
        </el-dialog>
        
        <!-- 使用范围弹窗 -->
        <scope-of-use ref="scopeOfUse" :sensitiveWordId="sensitiveWordId" :userRels="form.userRels" :departmentRels="form.departmentRels"></scope-of-use>
    </div>
</template>
<script>
import { ChatSensitiveWordsDetail, AddChatSensitiveWords, ModifyChatSensitiveWords } from "../../../config/api"
import ScopeOfUse from "../../../components/SessionArchiving/dialog/scopeOfUse"
import { mapState } from 'vuex'
import { throttle } from "../../../utils/tool"

export default {
    name: 'ruleEdit',
    data() {
        return {
            ruleEditDialogVisible: false,
            title: '新增规则',
            sensitiveWordId: null,
            form: {
                ruleName: '',
                departmentRels: [],
                userRels: [],
                scopeOfUseDataList: [], // 使用范围回显数据
                interceptType: 1,
                prohibitSendEmail: false,
                prohibitSendMobile: false,
                prohibitSendRedPacket: false,
                sensitiveWordsRels: [
                    {
                        content: '',
                        type: 1
                    }
                ]
            },
            prohibitSend: [], // 其他拦截回显数据
            rules: {
                ruleName: [
                    { required: true, message: '请输入规则名称', trigger: ['blur', 'change']},
                    { max: 20, message: '长度在 0 到 20 个字符', trigger: ['blur', 'change']}
                ],
                scopeOfUseDataList: [
                    { required: true, message: '请选择使用范围', trigger: ['blur', 'change']},
                ],
                interceptType: [
                    { required: true, message: '请选择拦截方式', trigger: ['change']},
                ],
                sensitiveWordsRels: [
                    { required: true, message: '请添加敏感词', trigger: ['change']}
                ]
            }
        }
    },
    computed: {
        ...mapState(["corpId"]),
        prohibitSendList() {
            let arr = [
                {label: this.form.prohibitSendMobile, name: '手机号码', value: 1},
                {label: this.form.prohibitSendEmail, name: '邮箱地址', value: 2},
                {label: this.form.prohibitSendRedPacket, name: '红包', value: 3}
            ]

            return arr
        },
    },
    inject: ['getList', 'deleteRow'],
    provide() {
        return {
            getScopeOfUseData: this.getScopeOfUseData,
        }
    },
    methods: {
        show(type, id) {
            if (type == 1) {
                this.title = '新增规则'
            } else if (type == 2) {
                this.title = '修改规则'
                this.sensitiveWordId = id
                this.chatSensitiveWordsDetail()
            }
            this.ruleEditDialogVisible = true
        },
        hide() {
            this.initForm()
            this.ruleEditDialogVisible = false
        },
        initForm() {
            this.sensitiveWordId = null
            this.form = {
                ruleName: '',
                departmentRels: [],
                userRels: [],
                scopeOfUseDataList: [],
                interceptType: 1,
                prohibitSendEmail: false,
                prohibitSendMobile: false,
                prohibitSendRedPacket: false,
                sensitiveWordsRels: [
                    {
                        content: '',
                        type: 1
                    }
                ]
            }
            this.prohibitSend = []
            this.$refs.scopeOfUse.checkedList = []
        },
        // 获取敏感词详情
        async chatSensitiveWordsDetail() {
            let { code, data } = await ChatSensitiveWordsDetail(this.sensitiveWordId)

            if (code == 'success') {
                this.form = data
                this.initScopeOfUseDataList()
                this.initProhibitSend()
            }
        },
        // 初始回显使用范围
        initScopeOfUseDataList() {
            const { departmentRels = [], userRels = [] } = this.form

            this.form.scopeOfUseDataList = departmentRels.concat(...userRels)
        },
        // 初始回显其他拦截
        initProhibitSend() {
            let arr = []

            this.prohibitSendList.map(item => {
                if (item.label == true) {
                    arr.push(item.value)
                }
            })
            this.prohibitSend = Array.from(new Set(arr))
        },
        // 显示使用范围选择弹窗
        showUsersDialog() {
            this.$refs.scopeOfUse.show(this.form.scopeOfUseDataList)
        },
        // 获取使用范围数据
        getScopeOfUseData() {
            this.form.scopeOfUseDataList = JSON.parse(sessionStorage.getItem('JZCRM_SCOPEOFUSE_CHECKEDLIST'))
            this.$forceUpdate()
            sessionStorage.removeItem('JZCRM_SCOPEOFUSE_CHECKEDLIST')
        },
        // 移除使用范围的某一项
        deleteUser(index) {
            this.form.scopeOfUseDataList.splice(index, 1)
            this.$nextTick(() => {
                this.$refs.scopeOfUse.resetTreeData()
            })
            if (!this.form.scopeOfUseDataList.length) {
                this.form.departmentRels = []
                this.form.userRels = []
            }
            this.form = JSON.parse(JSON.stringify(this.form))
        },
        // 选择其他拦截
        getProhibitSend(v) {
            this.prohibitSendList.map(item => {
                v.map(e => {
                    if (item.value == e) {
                        item.label = true
                    }
                })
            })
        },
        // 增加敏感词
        addSensitiveWords() {
            if (this.form.sensitiveWordsRels && this.form.sensitiveWordsRels.length >= 300) {
                this.$message.warning("最多只能添加三百个敏感词")
                return false
            }

            if (!this.checkSensitiveWords()) {
                return false
            }

            let item = {
                content: '',
                type: 1
            }

            this.form.sensitiveWordsRels.push(item)
        },
        checkSensitiveWords() {
            let result = this.form.sensitiveWordsRels && this.form.sensitiveWordsRels.length && this.form.sensitiveWordsRels.every((item) => {
                return item.content
            })

            if (!result) {
                this.$message.warning("敏感词内容不能为空")
                return false
            }

            return true
        },
        // 移除敏感词
        removeSensitiveWords(index) {
            this.form.sensitiveWordsRels.splice(index, 1)
        },
        // 获取使用范围最终数据
        getscopeOfUseResult() {
            this.form.scopeOfUseDataList.map(item => {
                delete item.id
            })

            let departmentRels = [], userRels = []

            this.form.scopeOfUseDataList.map(item => {
                if (item.type == 2) {
                    departmentRels.push(item)
                }else if (item.type == 3) {
                    userRels.push(item)
                }
            })

            this.form.departmentRels = departmentRels && departmentRels.length && departmentRels[0] ? departmentRels : []
            this.form.userRels = userRels && userRels.length && userRels[0] ? userRels : []
        },
        // 获取其他拦截最终数据
        getProhibitSendResult() {
            this.prohibitSendList.map(item => {
                if (item.value == 1) {
                    this.form.prohibitSendMobile = item.label
                } else if (item.value == 2) {
                    this.form.prohibitSendEmail = item.label
                } else if (item.value == 3) {
                    this.form.prohibitSendRedPacket = item.label
                }
            })
        },
        async confirm() {
            if(!throttle()) {
                return
            }

            if (!this.checkSensitiveWords()) {
                return false
            }
            
            this.getscopeOfUseResult()
            this.getProhibitSendResult()

            this.validate().then(async () => {
                this.form.corpId = this.corpId

                let ApiOpt = null

                if (this.sensitiveWordId) {
                    ApiOpt = ModifyChatSensitiveWords
                } else {
                    ApiOpt = AddChatSensitiveWords
                }

                let { code, msg } = await ApiOpt(this.form)

                if (code == 'success') {
                    this.getList()
                    this.$message.success(msg)
                    this.hide()
                } else {
                    this.$message.error(msg)
                }
            }).catch(err => {
                console.warn(err);
            })
        },
        validate() {
            return new Promise((resolve, reject) => {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        resolve(this.form);
                    } else {
                        reject('请完善表单');
                    }
                });
            })
        },
    },
    components: {
        ScopeOfUse
    }
}
</script>
<style lang="less" scoped>
    @import url('../style/dialog');

    .rule-edit {
        /deep/ .el-dialog__body {
            max-height: 600px;
            padding: 15px 16px;
            overflow-y: auto;
        }
        .user-box {
            width: 86%;
            height: 32px;
            line-height: 32px;
            padding: 0 0 0 15px;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            position: relative;
            .jz_icon-box {
                width: 29px;
                height: 100%;
                padding: 0 8px;
                background-color: @white;
                position: absolute;
                right: 0;
                top: 0;
                .jz_icon {
                    width: 14px;
                    height: 14px;
                }
            }
            .placeholder {
                color: #C0C4CC;
            }
            .user-item {
                display: inline-block;
                height: 24px;
                line-height: 24px;
                padding: 0 8px;
                margin-right: 8px;
                border-radius: 4px;
                border: 1px solid @bdColor;
                color: @fontSub2;
                .jz_icon {
                    margin-right: 3px;
                }
                .delete-user {
                    margin-left: 6px;
                }
            }
        }
        .sensitiv-words-inp {
            margin-bottom: 16px;
        }
        .add-btn {
            width: 118px;
            height: 32px;
            padding: 0 12px;
            background: rgba(65, 104, 246, 0.04);
            border-radius: 4px;
            border: 1px solid @main;
            img {
                width: 12px;
                height: 12px;
            }
            span {
                margin-left: 6px;
                line-height: 32px;
                font-size: 14px;
                color: @main;
            }
        }
        .delete-btn {
            width: 12px;
            height: 12px;
            margin-left: 16px;
        }
        .dialog-footer-delete {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .delete {
                color: @main;
                font-size: 14px;
            }
        }
    }
</style>