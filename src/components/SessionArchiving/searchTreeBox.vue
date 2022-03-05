<template>
    <ul v-if="searchList && searchList.length" class="search-tree-box">
        <li v-for="i in searchList" :key="i.onlyKey" class="item" :class="{'hover-active': comeFrom == 1, 'checked': comeFrom == 1 && i.type == 3 && i.isChecked}">
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
        </li>
    </ul>
</template>
<script>
export default {
    name: 'searchTreeBox',
    props: {
        comeFrom: {
            default: 2 // 1: 会话记录页面；2：敏感词设置弹窗
        },
        searchList: {
            default() {
                return []
            }
        }
    },
    inject: ['getCheckedList'],
    methods: {
        getChosed(item) {
            if (item['isChecked']) {
                item.isChecked = false
            } else {
                item.isChecked = true
            }
            this.getCheckedList(item)
        }
    },
}
</script>
<style lang="less" scoped>
    .search-tree-box {
        .jz_icon {
            width: 14px;
            height: 14px;
            margin-right: 8px;
        }
        .item {
            padding: 6px 16px;
            .item-child-info {
                .name {
                    margin-right: 8px;
                    margin-right: 8px;
                    font-size: 14px;
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
</style>