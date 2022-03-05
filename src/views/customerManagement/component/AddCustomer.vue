<template>
    <DetailDialog title="新增客户" :modalClick="false" width="736px" v-model="dialog">
        <div class="add_dialog">
            <el-form :model="addCodeForm" :rules="editRules" label-width="84px" ref="ruleForm">
                <el-form-item label="客户名称:" prop="customerCalled" :rules="[{ required: true, message: ' '}]">
                    <el-input v-model="name" maxlength="13" disabled placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="联系人:" prop="name" :rules="[{ required: true, message: '请输入联系人姓名', trigger: ['blur','change'] }]">
                    <el-input v-model="addCodeForm.name" maxlength="30" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="手机号码:">
                    <el-input v-model.trim="addCodeForm.phone" maxlength="11" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="客户来源:" prop="source">
                    <el-select v-model="addCodeForm.source" placeholder="请选择">
                        <el-option v-for="item in optionSource" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户阶段:">
                    <el-select v-model="addCodeForm.stage" placeholder="请选择" clearable>
                        <el-option v-for="item in optionsStage" :key="item.value" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户类型:" prop="customerType">
                    <el-select v-model="addCodeForm.customerType" placeholder="请选择" clearable>
                        <el-option v-for="item in optionsCustom" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <GongsiTip :addChildForm="addCodeForm" v-on:getgst="getgst"></GongsiTip>
                <el-form-item label="企业规模:">
                    <el-select v-model="addCodeForm.corpScale" placeholder="请选择" clearable>
                        <el-option v-for="item in optionsScale" :key="item.value" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行业领域:">
                    <el-cascader size="large" :props="{ expandTrigger: 'click',value:'id' ,label:'name'}" :options="optionsCreat" v-model="addCodeForm.industry"></el-cascader>
                </el-form-item>
                <el-form-item label="办公地址:">
                    <el-input v-model="addCodeForm.address" maxlength="100" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="addCodeForm.remark" type="textarea" show-word-limit placeholder="请输入" maxlength="200"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template slot="detailFooter">
            <div class="black" @click="backFun">上一步</div>
            <el-button size="medium" @click="dialog = false">取 消</el-button>
            <el-button type="primary" size="medium" @click="dialogFormSure('ruleForm')">确 定</el-button>
        </template>
    </DetailDialog>
</template>

<script>
import GongsiTip from '@/components/comTip/gongsiTip.vue'
import { DetailDialog } from '@/components'
import { uploadToOss } from '@/config/api'
import {
    getlistFiled,
    cluecustomer_toadd,
    cluecustomer_addCul,
} from '@/api/customer'
export default {
    name: 'AddCustomer',
    components: {
        DetailDialog,GongsiTip,
    },
    props: {
        value:{
            type: Boolean,
            default: false
        },
        name: {   //客户名称
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        isReload: {
            type: Boolean,
            default: true
        },
    },
    data(){
        return {
            addCodeForm: {
                customerCalled: '',
                customerName: '',
                mobil: '',
                source: '',
                customerType: '',
                cropFullName: '',
                corpScale: '',
                industry: '',
                address: '',
                remark: '',
                stage: '',
                name: '',
                phone: '',
            },
            botForm: {
                name: '',
                phone: '',
                gender: '',
                position: '',
                weixin: '',
                wechatNickname: '',
                email: '',
            },
            userForm: {},
            textList: [],
            selectList: [],
            dateList: [],
            optionSource: [],
            optionsCustom: [
                // { label: '未知', value: 0 },
                // { label: '微信用户', value: '1' },
                // { label: '企微用户', value: '2' },
            ],
            optionsStage: [],
            optionsScale: [],
            optionsCreat: [],
            optionsSex: [
                { name: '未知', value: '0' },
                { name: '男', value: '1' },
                { name: '女', value: '2' },
            ],
            editRules: {
                source: [{ required: true, trigger: 'change', message: '请选择来源' }],
            },
            botRules: {
                name: [{ required: true, trigger: ['blur', 'change'], message: '请输入姓名'}],
            },
            imageUrl: '',
        }
    },
    computed: {
        corpId() {
            return this.$store.getters.corpId
        },
        dialog: {
            get(){
                return this.value
            },
            set(val){
                this.$emit('input',val)
            }
        },
    },
    // mounted(){
    //     this.getDataList()
    //     this.getFiledChange()
    // },
    methods: {
        dialogFormSure(ruleForm){
            this.addCodeForm.customerCalled = this.name
            if (this.addCodeForm.customerCalled !== '') {
                this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    this.$confirm('是否保存编辑', '温馨提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                    .then(() => {
                        let cropSubIndustry = this.addCodeForm.industry.toString()
                        let params = {
                            type: this.type,
                            cropSubIndustry: cropSubIndustry,
                            ...this.addCodeForm,
                        }
                        cluecustomer_addCul(params).then(res => {
                            if(res.result){
                                this.dialog = false
                                this.$emit('sure')
                                this.$message({ type: 'success',message: '保存成功!'})
                            }
                        })
                    }).catch(() => {
                        this.$message({ type: 'info', message: '已取消保存'})
                    })
                }
                })
            } else {
                this.$message({ type: 'error', message: '请完善信息'})
            }
        },
        backFun(){  //上一步
            this.dialog = false
            console.log('上一步')
            this.$emit('back')
        },
        handleAvatarSuccess(request) {
            if (this.beforeAvatarUpload(request.file)) {
                let formData = new FormData()
                formData.append('file', request.file)
                formData.append('filetype', 'image')
                formData.append('type', 'friend')
                uploadToOss(formData).then((res) => {
                    if (res.result) {
                        this.imageUrl = res.data.url
                        this.loading = false
                    }
                })
            }
        },
        deleteImg() {
            this.imageUrl = ''
        },
        beforeAvatarUpload(file) {
            const isJPG =
                file.type == 'image/jpeg' ||
                file.type == 'image/jpg' ||
                file.type == 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG || !isLt2M) {
                this.$message.error(
                '上传头像图片只能是 JPG,PNG,JEPG 格式，大小不能超过 2MB!'
                )
            }
            return isJPG && isLt2M
        },
        sexChange(val) {
            this.botForm.gender = val
        },
        getDataList() {     //获取选择数据
            cluecustomer_toadd().then(res => {
                if(res.result){
                    this.processTree(res.data.comlist)
                    this.optionsScale = res.data.corpScaleList
                    this.dealHeader(res.data.head)
                }
            })
        },
        dealHeader(list) {
            list.forEach((item) => {
                if (item.columnType == 1) {
                    this.textList.push(item)
                } else if (item.columnType == 2) {
                    this.selectList.push(item)
                } else if (item.columnType == 3) {
                    this.dateList.push(item)
                }
            })
        },
        processTree(data) {
            data.forEach((item) => {
                if (item.children.length) {
                    this.optionsCreat.push(item)
                    return this.processTree(item.children)
                } else {
                    item.children = null
                }
            })
        },
        getgst(gstValue) {
            this.addCodeForm.cropFullName = gstValue.cropFullName
        },
        getFiledChange() {  //获取选择数据列表
            let params = {
                corpId: this.corpId,
            }
            getlistFiled(params).then((res) => {
                if (res.result) {
                    let list = res.data
                    list.forEach((item) => {
                        if (item.type == 'stage') {
                            this.optionsStage.push(item)
                        }
                        if (item.type == 'source') {
                            this.optionSource.push(item)
                        }
                        if (item.type == 'customer_type') {
                            this.optionsCustom.push(item)
                        }
                    })
                }
            })
        },
        resetFun(){
            this.optionsStage = []
            this.optionSource = []
            this.optionsCustom = []
            if(this.isReload){
                console.log('reload')
                this.addCodeForm.customerCalled = ''
                this.addCodeForm.customerName = ''
                this.addCodeForm.mobil = ''
                this.addCodeForm.source = ''
                this.addCodeForm.customerType = ''
                this.addCodeForm.cropFullName = ''
                this.addCodeForm.corpScale = ''
                this.addCodeForm.industry = ''
                this.addCodeForm.address = ''
                this.addCodeForm.remark = ''
                this.addCodeForm.stage = ''
                this.addCodeForm.name = ''
                this.addCodeForm.phone = ''
                this.$nextTick(() => {
                    this.$refs['ruleForm'].resetFields()
                })
            }
        },
    },
    watch: {
        dialog(val){
            if(val){
                this.resetFun()
                this.getDataList()
                this.getFiledChange()
            }
        }
    },
}
</script>

<style lang="less" scoped>
.add_dialog{
    padding: 16px;
    /deep/ .el-textarea__inner{
        min-height: 120px !important;
        resize: none;
    }
    /deep/ .el-cascader{
        width: 100%;
    }
}
.black{
    font-size: 14px;
    line-height: 20px;
    color: @main;
    cursor: pointer;
    position: absolute;
    left: 32px;
    top: 50%;
    transform: translateY(-50%);
}
</style>