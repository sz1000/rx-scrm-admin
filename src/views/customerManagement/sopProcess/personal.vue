<template>
    <div class="list_wrap">
        <div class="search_wrap">
            <div class="search_box">
                <div class="search_item">
                    <div class="label">规则名称：</div>
                    <div class="val">
                        <el-input v-model="search.ruleName" placeholder="请输入规则名称"></el-input>
                    </div>
                </div>
                <div class="search_item">
                    <div class="label">使用员工：</div>
                    <div class="val">
                        <el-select class="select" v-model="search.userId" placeholder="请选择使用员工">
                            <el-option
                                v-for="item in userList"
                                :key="item.id"
                                :label="item.userName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search_item">
                    <div class="label">创建人员：</div>
                    <div class="val">
                        <el-select class="select" v-model="search.createUserId" placeholder="请选择创建人员">
                            <el-option
                                v-for="item in userList"
                                :key="item.id"
                                :label="item.userName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="search_item">
                    <div class="label">创建时间：</div>
                    <div class="val">
                        <el-date-picker
                            class="select"
                            v-model="creatDate"
                            @change="timeChangeFun"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="opera_box">
                <el-button class="btn" @click="searchFun" size="small" type="primary">查询</el-button>
                <el-button size="small" @click="resetFun">重置</el-button>
            </div>
        </div>
        <div class="content">
            <div class="btn_box" v-show="expandedKeys.some(item=>item.enName == 'add')">
                <div class="btn_add" @click="$router.push({path:'/customerManagement/sopProcess/personalAdd',query: {menuFlag: true,type: 1}})">
                    <img class="icon" src="@/assets/images/icon_add@2x.png" alt="" />
                    <span class="text">新增</span>
                </div>
            </div>
            <div class="table">
                <el-table :data="list" :header-cell-style="{ background: '#FAFBFF',color: '#3C4353' }" style="width: 100%">
                    <el-table-column type="index" label="编号" width="50"></el-table-column>
                    <el-table-column prop="ruleName" show-overflow-tooltip label="规则名称"></el-table-column>
                    <el-table-column prop="userNames" show-overflow-tooltip label="使用员工"></el-table-column>
                    <el-table-column prop="createUserName" label="创建人员"></el-table-column>
                    <el-table-column prop="createTimeStr" label="创建时间"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.enableStatus" @change="switchStatusFun(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" v-show="expandedKeys.some(item=>item.enName == 'edit')" @click="editFun(scope.row)">编辑</el-button>
                            <el-button type="text" size="medium" @click="toDetail(scope.row)">详情</el-button>
                            <el-button type="text" size="medium" v-show="expandedKeys.some(item=>item.enName == 'delete')" @click="deleteDialog(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    <div slot="empty" class="empty" style="padding-top: 100px">
                        <img src="@/assets/images/nodae.png" style="width: 280px; height: 233px"/>
                    </div>
                </el-table>
            </div>
            <div class="pagePosition">
                <Pagination
                    :total="total"
                    :pageInfo="pageInfo"
                    @pageChange="pageChange"
                    v-if="total">
                </Pagination>
            </div>
        </div>
        <!-- 删除弹窗 -->
        <DeleteDialog v-model="dialog" @sure="deleteSopFun"></DeleteDialog>
    </div>
</template>

<script>
import Pagination from "@/components/elPagination.vue"
import DeleteDialog from "@/views/customerManagement/component/DeleteDialog.vue"
import { sop_pageList,sop_employeeList,sop_switchStatus,sop_delete } from '@/api/sop'
import MyMixin from '@/mixins/permissions'
export default {
    components: {
        Pagination,DeleteDialog
    },
    mixins: [MyMixin],
    data(){
        return {
            creatDate: '',
            value: '',
            options: [],
            search: {
                sopType: 0,     //SOP类型:0-个人SOP，1-群SOP
                ruleName: '',
                userId: '',
                createUserId: '',
                createTimeBegin: '',
                createTimeEnd: '',
                current: 1,
                size: 10,
            },
            pageInfo: {
                page: 1,
                limit: 10,
            },
            list: [],
            total: 0,
            userList: [],
            dialog: false,
            deleteData: {
                id: '',
                version: ''
            },
        }
    },
    mounted(){
        this.getUserList()
        this.getList()
    },
    methods: {
        getList(){  //获取列表
            sop_pageList(this.search).then(res => {
                if(res.result){
                    let list = res.data.records
                    let total = res.data.total
                    this.list = list
                    this.total = total
                }
            })
        },
        editFun(row){  //编辑
            this.$router.push({
                path: '/customerManagement/sopProcess/personalAdd',
                query: {
                    id: row.id
                },
            })
        },
        toDetail(row){  //详情
            this.$router.push({
                path: '/customerManagement/sopProcess/personalDetail',
                query: {
                    menuFlag: true,
                    type: 1,
                    id: row.id
                },
            })
        },
        switchStatusFun(row){   //启用 / 禁用
            sop_switchStatus(row.id).then(res => {
                if(res.result){
                    this.$message({ message: '操作成功！',type: 'success' })
                    this.getList()
                }
            })
        },
        deleteDialog(row){     //删除弹窗
            this.deleteData.id = row.id
            this.deleteData.version = row.version
            this.dialog = true
        },
        deleteSopFun(){     //删除sop
            sop_delete(this.deleteData).then(res => {
                if(res.result){
                    this.$message({ message: '操作成功！',type: 'success' })
                    if(this.total % 10 == 1){
                        this.search.current--
                    }
                    this.getList()
                }
            })
        },
        timeChangeFun(e){
            if(e && e.length > 0){
                this.search.createTimeBegin = e[0] + ' 00:00:00'
                this.search.createTimeEnd = e[1] + ' 23:59:59'
            }else{
                this.search.createTimeBegin = ''
                this.search.createTimeEnd = ''
            }
        },
        searchFun(){
            this.search.current = 1
            this.getList()
        },
        pageChange(e) {
            console.log('page',e)
            this.search.current = e.page
            this.getList()
        },
        resetFun(){     //重置
            let data = this.search
            data.ruleName = ''
            data.userId = ''
            data.createUserId = ''
            this.creatDate = ''
            data.createTimeBegin = ''
            data.createTimeEnd = ''
            this.searchFun()
        },
        getUserList(){  //获取员工列表
            sop_employeeList().then(res => {
                if(res.result){
                    let list = res.data
                    this.userList = list
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
@main: #4168F6;
@white: #fff;
@fontMain: #3C4353;
@fontSub2: #838A9D;
@lineColor: #F0F2F7;
@dialogBg: #FAFBFF;
@red: #D14343;
.list_wrap{
    width: 100%;
    min-height: calc(100vh - 88px);
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    .search_wrap{
        margin-bottom: 16px;
        .search_box{
            width: 100%;
            display: flex;
            .search_item{
                width: calc((100% - 96px)/4);
                margin-right: 32px;
                display: flex;
                align-items: center;
                &:last-child{
                    margin-right: 0;
                }
                .label{
                    width: 90px;
                    font-size: 14px;
                    color: #3C4353;
                    white-space: nowrap;
                }
                .val{
                    width: calc(100% - 70px);
                    /deep/ .el-input__inner{
                        height: 32px;
                    }
                    /deep/ .el-input__icon{
                        line-height: 32px;
                        height: 32px;
                    }
                    /deep/ .el-date-editor .el-range-separator{
                        height: 32px;
                        min-width: 14px;
                    }
                    .select{
                        width: 100%;
                    }
                }
            }
        }
        .opera_box{
            margin-top: 16px;
            .btn{
                background: @main;
                border-color: @main;
                &:hover{
                    background: rgba(@main,.85);
                }
            }
        }
    }
    .content{
        .btn_box{
            margin-bottom: 16px;
            text-align: right;
        }
        .btn_add {
            display: inline-block;
            width: 76px;
            height: 32px;
            background: rgba(65, 104, 246, 0.04);
            border-radius: 4px;
            border: 1px solid #4168f6;
            color: #4168f6;
            padding-left: 32px;
            position: relative;
            text-align: left;
            cursor: pointer;
            transition: all .2s;
            &:hover{
                background: rgba(65, 104, 246, 0.1);
            }
            .icon{
                width: 12px;
                height: 12px;
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
            }
            .text{
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                color: #4168F6;
                display: inline-block;
            }
        }
        /deep/ .el-table::before{
            height: 0;
        }
    }
}
    
</style>