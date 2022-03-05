// 客户管理
import request from '@/utils/requestNew'
let BASE_CUSTOMER_SERVICE = '/customer-service'
let BASE_COMMON_SERVICE = '/common-service'
export function cluecustomer_getcluecustomerlist(data) {
    //线索列表
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/getcluecustomerlist',
        method: 'post',
        data: data,
    })
}
export function cluecustomer_getClueCustomerByNo(data) {
    //线索详情
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/getClueCustomerByNo',
        method: 'get',
        params: data,
    })
}
export function clueCustomerFollowUser_selectPCFollowMsgList(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/clueCustomerFollowUser/selectPCFollowMsgList',
        method: 'get',
        params: data,
    })
}
export function clueCustomerFollowUser_selectFollowMsgList(data, loading = false) { // 当前客户跟进信息
    return request({
        url: BASE_CUSTOMER_SERVICE + '/clueCustomerFollowUser/selectFollowMsgList',
        method: 'get',
        headers: {
            noLoading: loading
        },
        params: data
    })
}
export function cluecustomer_giveUpType(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/giveUpType',
        method: 'get',
        params: data,
    })
}
export function cluecustomer_getclue(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/getclue',
        method: 'get',
        params: data,
    })
}
export function cluecustomer_delClueCustomer(data) {
    //删除
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/delClueCustomer',
        method: 'get',
        params: data,
    })
}
export function cluecustomer_synccus() {
    //同步
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/synccus',
        method: 'get',
    })
}
export function cluecustomer_getAllCustomerList(data) {
    //获取全部客户列表
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/getAllCustomerList',
        method: 'post',
        data: data,
    })
}
export function clueCustomerFollowUser_selectUserDeptList(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/clueCustomerFollowUser/selectUserDeptList',
        method: 'post',
        data,
    })
}
export function group_getOwmerList() {
    //获取群主列表
    return request({
        url: BASE_CUSTOMER_SERVICE + '/group/getOwmerList',
        method: 'get',
    })
}
export function group_list(data) {
    //获取群列表
    return request({
        url: BASE_CUSTOMER_SERVICE + '/group/list',
        method: 'get',
        params: data,
    })
}
export function group_syncGroupList(data) {
    //同步
    return request({
        url: BASE_CUSTOMER_SERVICE + '/group/syncGroupList',
        method: 'post',
        data,
    })
}
export function group_getGroupDetail(data) {
    //获取群详情
    return request({
        url: BASE_CUSTOMER_SERVICE + '/group/getGroupDetail',
        method: 'get',
        params: data,
    })
}
export function group_getGroupUserPage(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/group/getGroupUserPage',
        method: 'get',
        params: data,
    })
}
export function group_syncGroupDetail(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/group/syncGroupDetail',
        method: 'get',
        params: data,
    })
}
export function greeting_list(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/greeting/list',
        method: 'get',
        params: data,
    })
}
export function greeting_del(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/greeting/del',
        method: 'get',
        params: data,
    })
}
export function grouptag_list(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/grouptag/list',
        method: 'get',
        params: data,
    })
}
export function tagEstablishGroup_getTagCustomerMass(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/tagEstablishGroup/getTagCustomerMass',
        method: 'get',
        params: data,
    })
}
export function cluecustomerMass_updateIsDelete(id) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomerMass/updateIsDelete?massNo=' + id,
        method: 'post',
    })
}
export function tagEstablishGroup_getOneTagCustomerMass(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/tagEstablishGroup/getOneTagCustomerMass',
        method: 'get',
        params: data,
    })
}
export function tag_syncTag() {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/tag/syncTag',
        method: 'post',
    })
}
export function tag_list(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/tag/list',
        method: 'get',
        params: data,
    })
}
export function tag_update(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/tag/update',
        method: 'post',
        data: data,
    })
}
export function tag_toOrder(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/tag/toOrder',
        method: 'post',
        data: data,
    })
}
export function grouptag_update(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/grouptag/update',
        method: 'post',
        data: data,
    })
}
export function grouptag_toOrder(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/grouptag/toOrder',
        method: 'post',
        data: data,
    })
}
export function inJobTransferCustomer_getUserList(data, loading = true) {
    //客户分配，负责人下拉框
    return request({
        url: BASE_CUSTOMER_SERVICE + '/inJobTransferCustomer/getUserList',
        method: 'get',
        headers: {
            noLoading: loading,
        },
        params: data,
    })
}

export function getInJobUserCustomer(data) {
    //客户分配，列表页
    return request({
        url: BASE_CUSTOMER_SERVICE + '/inJobTransferCustomer/getInJobUserCustomer',
        method: 'post',
        data: data,
    })
}
export function common_getlist(data) {
    //客户分配，客户来源/客户阶段
    return request({
        url: BASE_CUSTOMER_SERVICE + '/common/getlist',
        method: 'get',
        params: data,
    })
}
export function inJobTransferCustomer_assignCustomer(data) {
    //客户分配，客户来源/客户阶段
    return request({
        url: BASE_CUSTOMER_SERVICE + '/inJobTransferCustomer/assignCustomer',
        method: 'post',
        data: data,
    })
}
export function inJobTransferCustomer_synchronizeCustomers(data) {
    //客户分配，同步客户
    return request({
        url: BASE_CUSTOMER_SERVICE + '/inJobTransferCustomer/synchronizeCustomers',
        method: 'get',
        params: data,
    })
}
export function inJobTransferCustomer_getAllotCustomerHistory(data) {
    //分配历史
    return request({
        url: BASE_CUSTOMER_SERVICE + '/inJobTransferCustomer/getAllotCustomerHistory',
        method: 'post',
        data: data,
    })
}

//客户字段新增

export function getlistFiled(data) {
    //分配历史
    return request({
        url: BASE_CUSTOMER_SERVICE + '/common/getlist',
        method: 'get',
        params: data,
    })
}
// 商机阶段
export function opportunitiesList(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/business-opportunities/corpStage/list',
        method: 'get',
        params: data,
    })
}
//新增通知群发
export function cluecustomerMass_addCustomerScreen(data) {
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomerMass/addCustomerScreen',
        method: 'post',
        data: data,
    })
}
export function cluecustomer_toadd(loading = false) {  //筛选数据 all (客户/线索)
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/toadd',
        method: 'get',
        headers: {
            noLoading: loading,
        },
    })
}
export function cluecustomer_addCul(data) {  //新增(线索 or 客户)
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/addCul',
        method: 'post',
        data: data
    })
}
export function cluecustomer_update(data) {  //更新(线索/客户)
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/update',
        method: 'post',
        data: data
    })
}
export function queryClue_customers(data,loading = false) {  //相似客户筛选
    return request({
        url: BASE_COMMON_SERVICE + '/elasticSearch/queryClueCustomerPage/customers',
        method: 'post',
        headers: {
            noLoading: loading,
        },
        data: data
    })
}
export function cluecustomer_toupdate(id) {  //获取详情（线索/客户）
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/toupdate?clueCustomerNo=' + id,
        method: 'get',
    })
}
export function cluecustomer_cluetocustomer(data) {  //线索转客户
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/cluetocustomer',
        method: 'post',
        data: data
    })
}
export function cluecustomer_clueMergeToCustomer(data) {  //线索合并客户
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/clueMergeToCustomer',
        method: 'post',
        params: data
    })
}
export function cluecustomer_fnHomePage(data) {  //首页信息
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/fnHomePage',
        method: 'post',
        data: data
    })
}
export function my_queryFollowMsgPage(data) {  //首页动态
    return request({
        url: BASE_CUSTOMER_SERVICE + '/my/queryFollowMsgPage',
        method: 'post',
        // headers: {
        //     noLoading: true,
        // },
        data: data
    })
}
export function cluecustomer_wechat_Contact(data) {  //是否微信好友
    return request({
        url: `${BASE_CUSTOMER_SERVICE}/cluecustomer/${data.userNo}/${data.customerNo}/${data.corpId}/wechat-contact`,
        method: 'get'
    })
}