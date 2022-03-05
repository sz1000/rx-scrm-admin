<template>
    <div class="content-box opportunity-stage">
        <div class="table-warp">
            <div class="plank"></div>
            <div class="tip">跟进中</div>
            <el-table
                class="top-table"
                :data="enterTable"
                v-loading="dataLoading"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{ background: '#FAFBFF' }"
            >
                <el-table-column prop="stage" width="100" label="排序" align="left"></el-table-column>
                <el-table-column prop="name" width="200" label="阶段名称"></el-table-column>
                <el-table-column prop="explain" label="阶段说明"></el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <!-- <span
                        v-show="expandedKeys.some(item=>item.enName == 'edit')"
                        @click="handleEdit(scope.row)"
                        class="table_txt"
                        > -->
                        <span
                        @click="handleEdit(false, scope.row)"
                        class="table_txt edit"
                        >
                        修改
                        </span>
                        <div class="table_txt switch-btn">
                            <el-switch @change="doChange($event, scope.row)" :active-value="true" :inactive-value="false" v-model="scope.row.isEnable"></el-switch>
                            <span class="text">{{scope.row.isEnable | getText}}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <no-date v-if="!enterTable.length"></no-date>
        </div>

        <div class="table-warp">
            <div class="tip end-tip">跟进结束</div>
            <el-table
                :data="endTable"
                v-loading="dataLoading"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{ background: '#FAFBFF' }"
            >
                <el-table-column prop="defaultStatus" width="100" label="默认状态" align="left"></el-table-column>
                <el-table-column prop="name" width="200" label="阶段名称"></el-table-column>
                <el-table-column prop="explain" label="阶段说明"></el-table-column>
                <el-table-column label="原因设置" width="300">
                    <template slot-scope="scope">
                        <span v-for="(i, index) in scope.row.stageReasonRelList" v-show="i && i.content" :key="i.id" v-html="`${index + 1}. ${i.content}；<br>`"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <!-- <span
                        v-show="expandedKeys.some(item=>item.enName == 'edit')"
                        @click="handleEdit(scope.row)"
                        class="table_txt"
                        > -->
                        <span
                        @click="handleEdit(true, scope.row)"
                        class="table_txt edit"
                        >
                        修改
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <no-date v-if="!endTable.length"></no-date>
        </div>
        <modify-stage ref="modifyStage"></modify-stage>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { BusinessOpportunitiesList, ModifyBusinessOpportunitiesEnable } from "../../../config/api"
import MyMixin from '../../../mixins/permissions'

import NoDate from "../../../components/noDate"
import ModifyStage from "../../../components/BusinessSettings/dialog/modifyStage"

export default {
    name: 'recommendableArticle',
    mixins: [MyMixin],
    data() {
        return {
            dataLoading: true,
            enterTable: [],
            endTable: []
        }
    },
    computed: {
        ...mapState(["corpId"]),
    },
    async created() {
        await this.getCorpId()
        this.getList(true)
        this.getList(false)
    },
    provide() {
        return {
            getList: this.getList
        }
    },
    methods: {
        ...mapActions(["getCorpId"]),
        getList(isEnd) {
            let params = {
                isEnd,
                corpId: this.corpId
            }

            BusinessOpportunitiesList(params).then(res => {
                const { code, data, msg } = res
                if (code === 'success') {
                    if (!isEnd) {
                        this.getEnterTable()
                        this.enterTable.map((item, index) => {
                            data.map((dataItem, dataIndex) => {
                                if (dataIndex == index) {
                                    item = Object.assign(item, dataItem)
                                }
                            })
                        })
                    } else {
                        this.endTable = data
                    }
                } else {
                    this.$message.error(msg)
                }
                this.dataLoading = false
            })
        },
        getEnterTable() {
            let arr = new Array(10)

            this.enterTable = []
            for(let i = 0; i < arr.length; i++) {
                this.enterTable.push({stage: `阶段${this.getStage(i)}`})
            }
        },
        getStage(index) {
            let result = ''
            switch (index) {
                case 0:
                    result = '一'
                    break
                case 1:
                    result = '二'
                    break
                case 2:
                    result = '三'
                    break
                case 3:
                    result = '四'
                    break
                case 4:
                    result = '五'
                    break
                case 5:
                    result = '六'
                    break
                case 6:
                    result = '七'
                    break
                case 7:
                    result = '八'
                    break
                case 8:
                    result = '九'
                    break
                case 9:
                    result = '十'
                    break
            }
            return result
        },
        handleEdit(isEnd, formData) {
            this.$refs.modifyStage.show(isEnd, formData)
        },
        async doChange(v, obj) {
            if (v == true && !obj.name) {
                obj.isEnable = false
                this.$message.warning('商机阶段名称为空，不能开启')
                return
            }

            let params = {
                stageId: obj.stageId,
                isEnable: v
            }
            
            let { code, msg } = await ModifyBusinessOpportunitiesEnable(params)

            if (code == 'success') {
                this.enterTable = JSON.parse(JSON.stringify(this.enterTable))
                this.$message.success(msg)
            } else {
                this.$message.error(msg)
            }
        }
    },
    filters: {
        getText(data) {
            let result = data ? '已开启' : '已关闭'
            return result
        }
    },
    components: {
        NoDate,
        ModifyStage
    }
}
</script>
<style lang="less" scoped>
    @import url('./main');
</style>