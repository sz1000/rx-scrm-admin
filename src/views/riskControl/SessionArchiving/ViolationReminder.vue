<template>
    <div class="content-box violation-reminder">
        <!-- 查询重置 -->
        <search ref="search" title="规则名称" timeName="发送时间" hasTime="1"></search>

        <div class="table-warp">
            <el-table
                :data="enterTable"
                v-loading="dataLoading"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{ background: '#FAFBFF' }"
            >
                <el-table-column type="index" width="60px" label="编号" align="left"></el-table-column>
                <el-table-column prop="sensitiveWordContent" show-overflow-tooltip min-width="120" label="拦截敏感词"></el-table-column>
                <el-table-column prop="sensitiveWordName" label="所属规则"> </el-table-column>
                <el-table-column prop="fromUserName" label="发送人"> </el-table-column>
                <el-table-column prop="departmentName" show-overflow-tooltip label="部门"> </el-table-column>
                <el-table-column show-overflow-tooltip label="消息来源"> 
                    <template slot-scope="scope">
                        <span class="pointer">{{ scope.row.msgSource }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送时间" show-overflow-tooltip min-width="120">
                <template slot-scope="scope">
                    {{
                    scope.row.sendTime
                        ? formatDate(scope.row.sendTime, "yyyy-MM-dd hh:mm:ss")
                        : "-"
                    }}
                </template>
                </el-table-column>
            </el-table>

            <no-date v-if="!enterTable.length"></no-date>

        </div>

        <pagination
        v-if="enterTable.length"
        :total="total"
        :pageInfo="pageInfo"
        @pageChange="pageChange"></pagination>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { ViolationList } from "../../../config/api"

import { formatDate } from "../../../utils/tool"

import MyMixin from '../../../mixins/permissions'

import NoDate from "../../../components/noDate"
import Search from "../../../components/MaterialTemplate/search"
import Pagination from "../../../components/elPagination"

export default {
    name: 'recommendableArticle',
    mixins: [MyMixin],
    data() {
        return {
            dataLoading: false,
            total: 0,
            pageInfo: {
                page: 1,
                limit: 10,
            },
            enterTable: [],
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    provide() {
        return {
            checkTable: this.checkTable,
            resetTable: this.resetTable
        }
    },
    async created() {
        await this.getCorpId()
        this.getList()
    },
    methods: {
        ...mapActions(["getCorpId"]),
        getList(paramsData) {
            const { sensitiveWordName = '', beginTime = null, endTime = null } = paramsData || {}

            const {page, limit} = this.pageInfo
            
            let params = {
                pageIndex: page,
                pageSize: limit,
                sensitiveWordName,
                corpId: this.corpId,
                beginTime,
                endTime
            };
            ViolationList(params).then(res => {
                const { code, data, msg } = res
                if (code === 'success') {
                    this.enterTable = data.records;
                    this.total = data.total;
                } else {
                    this.$message.error(msg)
                }
                this.dataLoading = false
            })
        },
        pageChange(item) {
            console.log('', item)
            this.getList();
        },
        // 查询
        checkTable(data, date) {
            this.pageInfo.page = 1
            const { beginTime = null, endTime = null } = date

            let paramsData = {
                sensitiveWordName: data,
                beginTime,
                endTime
            }

            this.getList(paramsData)
        },
        resetTable() {
            this.$refs.search.initData()
            this.getList()
        },
        goDetail(item) {
            const { fromUserId, fromUserName, toUserId, msgType, msgid } = item

            const params = {
                id: fromUserId,
                name: fromUserName,
                toUserId: toUserId,
                msgType: msgType,
                msgid: msgid
            }

            this.$router.push({path: '/riskControl/sessionRecord', query: params})
        },

        formatDate
    },
    components: {
        NoDate,
        Search,
        Pagination
    }
}
</script>
<style lang="less" scoped>
.content-box {
    min-height: 100%;
    padding: 0 16px 16px;
    border-radius: 8px;
    background-color: #fff;
}
.violation-reminder {
    .table-warp {
        padding: 16px;
        /deep/.el-table thead {
            color: #3c4353;
            font-family: PingFangSC-Medium;
            font-size: 14px;
        }
        .el-table {
            color: #3c4353;
            &::before {
                width: 0;
            }
        }
        .table_txt {
            display: inline-block;
            margin-right: 8px;
            color: #4168f6;
            cursor: pointer;
        }
        /deep/.el-table tbody tr:hover > td {
            background-color: #f4f6fe;
        }
        /deep/.el-table__empty-block {
            display: none !important;
        }
    }
}
</style>