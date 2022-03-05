<template>
    <div class="tree-box">
        <div v-if="comeFrom == 2" class="search">
            <el-input class="search-input" v-model.trim="searchText" placeholder="搜索成员或部门" @input="doChange" @keyup.enter.native="departmentUserRels(searchText)"></el-input>
            <div class="icon-search pointer" @click.stop.prevent="departmentUserRels(searchText)"><jzIcon class="jz_icon" type="icon-icon_search"></jzIcon></div>
        </div>
        <div class="list">
            <div v-if="comeFrom == 1 || comeFrom == 2 && treesData && treesData.length" class="list-box">
                <h3>{{ headerTitle }}</h3>

                <div v-if="comeFrom == 1" class="search">
                    <el-input class="search-input" v-model.trim="searchText" placeholder="搜索成员" @input="doChange" @keyup.enter.native="departmentUserRels(searchText)"></el-input>
                    <div class="icon-search pointer" @click.stop.prevent="departmentUserRels(searchText)"><jzIcon class="jz_icon" type="icon-icon_search"></jzIcon></div>
                </div>

                <div v-loading="dataLoading">
                    <div v-if="comeFrom == 1 && treesData && treesData.length || comeFrom == 2" class="tree" :class="{'dialog-tree': comeFrom == 2}">
                        <tree-list ref="treeList" :comeFrom="comeFrom" :listData="treesData" :level="1" v-on="$listeners"></tree-list>
                    </div>

                    <template v-if="comeFrom == 1 && searchList && searchList.length">
                        <search-tree-box :comeFrom="comeFrom" :searchList="searchList"></search-tree-box>
                    </template>
                </div>
            </div>
            <div v-else-if="comeFrom == 2 && searchList && searchList.length" v-loading="dataLoading">
                <search-tree-box :comeFrom="comeFrom" :searchList="searchList"></search-tree-box>
            </div>
        </div>
    </div>
</template>
<script>
import { DepartmentUserRels } from "../../config/api"
import TreeList from "./treeList"
import SearchTreeBox from "./searchTreeBox"
import { mapState } from 'vuex'

export default {
    name: 'treeBox',
    props: {
        headerTitle: {
            type: String,
            default: ''
        },
        comeFrom: {
            default: 2 // 1: 会话记录页面；2：敏感词设置弹窗
        },
        checkedList: {
            default() {
                return []
            }
        }
    },
    data() {
        return {
            loading: false,
            dataLoading: true,
            searchText: '',
            treesData: [],
            searchList: []
        }
    },
    computed: {
        corpIdData() {
            return this.corpId
        },
        ...mapState(["corpId"]),
    },
    watch: {
        corpIdData(val) {
            if (val) {
                this.departmentUserRels()
            }
        }
    },
    created() {
        if (this.corpId) {
            this.departmentUserRels()
        }
    },
    methods: {
        // 获取部门信息列表
        async departmentUserRels(name) {
            let params = {
                corpId: this.corpId,
                name: name ? name : ''
            }

            let { code, data } = await DepartmentUserRels(params)

            this.dataLoading = false

            if (code == 'success' && data) {
                if (!name) { // 非搜索结果
                    this.searchList = []
                    this.treesData = [data]
                } else { // 搜索结果
                    this.treesData = []
                    this.searchList = data && data.departmentUserRelModelList
                    if (!this.searchList.length) {
                        this.$message.warning('暂无相关数据')
                    }
                }
                this.resetTreeData(this.checkedList)
            }
        },
        pushChecked(arr, checkedData) {
            for (let i = 0; i < arr.length; i++) {
                arr[i].isChecked = false
                this.getLastChecked(arr[i], checkedData)

                if (arr[i].departmentUserRelModelList && arr[i].departmentUserRelModelList.length) {
                    this.pushChecked(arr[i].departmentUserRelModelList, checkedData)
                }
            }
        },
        getLastChecked(item, checkedData) {
            Array.isArray(checkedData) && checkedData.map(e => {
                if (item.onlyKey == e.onlyKey) {
                    item.isChecked = true
                }
            })
            this.$forceUpdate()
        },
        resetTreeData(checkedData) {
            if (this.treesData && this.treesData.length) {
                this.pushChecked(this.treesData, checkedData)
                this.initIsExpand()
                this.treesData = JSON.parse(JSON.stringify(this.treesData))
            } else if (this.searchList && this.searchList.length) {
                this.pushChecked(this.searchList, checkedData)
                this.searchList = JSON.parse(JSON.stringify(this.searchList))
            }
        },
        // 初始展开企业
        initIsExpand() {
            this.treesData[0].isExpand = true
        },
        doChange(v) {
            if (!v) {
                this.departmentUserRels()
            }
        },
    },
    components: {
        TreeList,
        SearchTreeBox
    }
}
</script>
<style lang="less" scoped>
    .tree-box {
        .search {
            margin-bottom: 16px;
            position: relative;
            /deep/ .el-input, .el-select {
                width: 100% !important;
                .el-input__inner {
                    height: 32px;
                }
                .el-input__icon {
                    line-height: 32px;
                }
            }
            .icon-search {
                width: 28px;
                height: 32px;
                position: absolute;
                right: 0;
                top: 0;
                .jz_icon {
                    width: 16px;
                    height: 16px;
                    margin: 8px 0;
                }
            }
        }
        .list {
            .list-box {
                h3 {
                    margin: 0 16px 16px;
                    color: #3C4353;
                    font-size: 16px;
                }
                .dialog-tree {
                    padding-right: 16px;
                }
            }
        }
    }
</style>