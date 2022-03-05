<template>
    <div class="scope-of-use">
        <el-dialog
            class="scope-of-use-dialog"
            title="使用范围"
            :visible.sync="scopeOfUseDialogVisible"
            :close-on-click-modal="false"
            @close="hide"
            :destroy-on-close="true"
            width="736px">
            <div class="content-box">
                <div class="left">
                    <!-- 使用范围树 -->
                    <tree-box ref="treeBox" headerTitle="部门信息" :comeFrom="2" :checkedList="checkedList"></tree-box>
                </div>
                <div class="divider"></div>
                <div class="right">
                    <h3>已选择的成员或部门</h3>
                    <ul class="chosed-box">
                        <li v-for="(i, index) in checkedList" :key="i.onlyKey" class="item">
                            <span class="right-left">
                                <jzIcon v-if="i.type == 2" class="jz_icon" type="icon-icon_folder"></jzIcon>
                                <jzIcon v-if="i.type == 3" class="jz_icon" type="icon-icon_header"></jzIcon>
                                <span>{{ i.name }}</span>
                            </span>
                            <span class="right-right pointer" @click="removeRightItem(index)">
                                <jzIcon class="jz_icon" type="icon-icon_remove"></jzIcon>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="hide">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import TreeBox from "../treeBox"

export default {
    name: 'scopeOfUse',
    props: {
        sensitiveWordId: {
            default: null
        },
        userRels: {
            default() {
                return []
            }
        },
        departmentRels: {
            default() {
                return []
            }
        }
    },
    data() {
        return {
            scopeOfUseDialogVisible: false,
            checkedList: []
        }
    },
    inject: ['getScopeOfUseData'],
    provide() {
        return {
            getCheckedList: this.getCheckedList,
        }
    },
    methods: {
        show(data) {
            this.checkedList = data
            this.scopeOfUseDialogVisible = true
            this.$nextTick(()=> {
                this.resetTreeData()
            })
        },
        hide() {
            this.scopeOfUseDialogVisible = false
        },
        getCheckedList(data) {
            if (data.isChecked == true) {
                this.checkedList.push(data)
                this.checkedList = this.resetCheckedList(this.checkedList)
                for (let i = 0; i < this.checkedList.length; i++) {
                    if (!this.sensitiveWordId) {
                        this.checkedList[i].content = this.checkedList[i].id
                    } else if (this.sensitiveWordId) {
                        if (this.checkedList[i].type == 3 && this.userRels && this.userRels.length) {
                            this.userRels.map(item => {
                                if (this.checkedList[i].onlyKey != item.onlyKey) {
                                    this.checkedList[i].content = this.checkedList[i].id
                                }
                            })
                        } else if (this.checkedList[i].type == 2 && this.departmentRels && this.departmentRels.length) {
                            this.departmentRels.map(item => {
                                if (this.checkedList[i].onlyKey != item.onlyKey) {
                                    this.checkedList[i].content = this.checkedList[i].id
                                }
                            })
                        } else {
                            this.checkedList[i].content = this.checkedList[i].id
                        }
                    }
                }
            } else if (data.isChecked == false) {
                this.removeLeftItem(data)
            }

            console.log("checkedList>>>", this.checkedList)
        },
        removeLeftItem(leftItem) {
            this.checkedList.map((item, index) => {
                if (item.onlyKey == leftItem.onlyKey) {
                    this.checkedList.splice(index, 1)
                }
            })
        },
        // 去重
        resetCheckedList(arr) {
            let newArr = []
            for (let i = 0; i < arr.length; i++) {
                if (this.noHas(newArr, arr[i].onlyKey)) {
                    newArr.push(arr[i])
                }
            }
            return newArr
        },
        noHas(arr, onlyKey) {
            let result = arr.filter((item) =>{
                return item.onlyKey == onlyKey
            })
            return result.length == 0 ? true : false
        },
        // 移除使用范围的某一项
        removeRightItem(index) {
            this.checkedList.splice(index, 1)
            this.resetTreeData()
        },
        resetTreeData() {
            this.$refs.treeBox.resetTreeData(this.checkedList)
        },
        async confirm() {
            sessionStorage.setItem('JZCRM_SCOPEOFUSE_CHECKEDLIST', JSON.stringify(this.checkedList))
            this.getScopeOfUseData()
            this.hide()
        },
    },
    components: {
        TreeBox
    }
}
</script>
<style lang="less" scoped>
    @import url('../style/dialog');

    /deep/ .el-dialog{
        .el-dialog__body {
            padding: 0 !important;
        }
    }

    .scope-of-use {
        .scope-of-use-dialog {
            .content-box {
                display: flex;
                width: 100%;
                height: 100%;
                min-height: 185px;
                .left {
                    flex: 1;
                    padding: 16px;
                    max-height: 500px;
                    overflow-y: auto;
                }
                .right {
                    flex: 1;
                    padding: 16px;
                    h3 {
                        margin-bottom: 16px;
                        color: @fontMain;
                        font-size: 16px;
                    }
                    .chosed-box {
                        .item {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 12px;
                            .right-left {
                                .jz_icon {
                                    margin-right: 8px;
                                }
                            }
                        }
                    }
                }
                .divider {
                    width: 1px;
                    min-height: 185px;
                    max-height: 500px;
                    background-color: @lineColor;
                }
            }
        }
    }
</style>