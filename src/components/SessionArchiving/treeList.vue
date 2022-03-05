<template>
    <ul class="tree-list">
        <li v-for="i in listData" :key="i.onlyKey" class="tree-list-item">
            <div v-show="isChild(i)" class="item-father pointer" :style="{'padding-left': 16*level + 'px'}" :class="{'hover-active': comeFrom == 1}">
                <span class="icon-solid-arrow" @click="toggleChild(i, 1)"><jzIcon class="jz_icon" :class="{'unchecked': !i.isExpand}" type="icon-icon_solid_arrow"></jzIcon></span>
                <span class="item-father-des" @click="toggleChild(i, 2)">
                    <jzIcon v-if="i.type == 2" class="jz_icon" type="icon-icon_folder"></jzIcon>
                    <span class="name">{{ i.name }}</span>
                    <jzIcon v-show="comeFrom == 2 && i.isChecked" class="jz_icon" type="icon-icon_chosed"></jzIcon>
                </span>
            </div>
            <div v-show="!isChild(i)" class="item-child" :style="{'padding-left': 16*level + 'px'}" :class="{'hover-active': comeFrom == 1, 'checked': comeFrom == 1 && i.type == 3 && i.isChecked}">
                <div class="item-child-info pointer" @click="getChosed(i)">
                    <jzIcon v-if="i.type == 2" class="jz_icon" type="icon-icon_folder"></jzIcon>
                    <jzIcon v-if="i.type == 3" class="jz_icon" type="icon-icon_header"></jzIcon>
                    <span class="name">{{ i.name }}</span>
                    <jzIcon v-show="comeFrom == 2 && i.isChecked" class="jz_icon" type="icon-icon_chosed"></jzIcon>
                </div>
                <div v-if="comeFrom == 2 && i.type == 3" class="item-child-tags">
                    <span>{{ i.isLeaderInDept ? '部门上级' : '普通员工' }}</span>
                    <span>{{ i.systemPosition }}</span>
                </div>
            </div>
            <tree-list v-show="isChild(i) && i.isExpand" :level="level + 1" :comeFrom="comeFrom" :listData="i.departmentUserRelModelList"></tree-list>
        </li>
    </ul>
</template>
<script>
export default {
    name: 'treeList',
    props: {
        listData: {
            default() {
                return []
            },
        },
        comeFrom: {
            default: 2
        },
        level: {
            type: Number
        }
    },
    inject: ['getCheckedList'],
    methods: {
        // 是否有子集
        isChild(item) {
            return item.departmentUserRelModelList && item.departmentUserRelModelList.length
        },
        // 选中部门或员工
        getChosed(item) {
            if (item['isChecked']) {
                item.isChecked = false
            } else {
                item.isChecked = true
            }
            this.$forceUpdate()
            this.getCheckedList(item)
        },

        // 展开收起
        toggleChild(item, type) {
            if (type == 1 || type == 2 && this.comeFrom == 1) {
                if (item['isExpand']) {
                    item.isExpand = false
                } else {
                    item.isExpand = true
                }
                this.$forceUpdate()
            } else if (type == 2 && this.comeFrom == 2) {
                this.getChosed(item)
            }
        }
    },
}
</script>
<style lang="less" scoped>
    .tree-list {
        .tree-list-item {
            .jz_icon {
                width: 14px;
                height: 14px;
                margin-right: 8px;
            }
            .item-father {
                display: flex;
                padding: 6px 0 6px 8px;
                .icon-solid-arrow {
                    .unchecked {
                        transform: rotate(-90deg);
                    }
                }
                .item-father-des {
                    flex: 1;
                    .name {
                        margin-right: 8px;
                        font-size: 14px;
                        color: #3C4353;
                    }
                }
            }
            .item-child {
                padding: 6px 0 6px 8px;
                .item-child-info {
                    .name {
                        margin-right: 8px;
                        margin-right: 8px;
                        font-size: 14px;
                        color: #3C4353;
                    }
                }
                .item-child-tags {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 5px;
                    padding-left: 22px;
                    span {
                        font-size: 12px;
                        color: #838A9D;
                    }
                }
            }
            .hover-active {
                &:hover {
                    border-radius: 4px;
                    background-color: #F4F6FE;
                }
            }
            .checked {
                background-color: #F4F6FE;
            }
        }
    }
</style>