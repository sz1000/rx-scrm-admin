import request from '@/utils/requestNew'
let BASE_Prefix = '/customer-service'
export function sop_add(data) { //新增sop规则
    return request({
        url: BASE_Prefix + '/sop/add',
        method: 'post',
        data: data
    })
}
export function sop_edit(data) { //编辑sop规则
    return request({
        url: BASE_Prefix + '/sop/edit',
        method: 'post',
        data: data
    })
}
export function sop_employeeList() { //当前登录用户企业员工列表-新增SOP规则使用员工下拉选
    return request({
        url: BASE_Prefix + '/sop/employeeList',
        method: 'get'
    })
}
export function sop_groupList() { //当前登录用户企业员工管理群列表-新增SOP规则使用群下拉选
    return request({
        url: BASE_Prefix + '/sop/groupList',
        method: 'get'
    })
}
export function sop_pageList(data) { //获取sop列表
    return request({
        url: BASE_Prefix + '/sop/pageList',
        method: 'post',
        data: data
    })
}
export function sop_detail(id) { //sop规则详情
    return request({
        url: BASE_Prefix + '/sop/detail/' + id,
        method: 'get'
    })
}
export function sop_switchStatus(id) { //启用/禁用SOP规则
    return request({
        url: BASE_Prefix + '/sop/switchStatus/' + id,
        method: 'get',
    })
}
export function sop_delete(data) { //删除SOP
    return request({
        url: BASE_Prefix + '/sop/delete',
        method: 'post',
        data: data
    })
}
export function sopSendTotal_pageList(data) { //获取详情数据统计列表
    return request({
        url: BASE_Prefix + '/sopSendTotal/pageList',
        method: 'post',
        data: data
    })
}
export function sopSendDetail_detail(id) { //SOP规则发送记录详情
    return request({
        url: BASE_Prefix + '/sopSendTotal/detail/' + id,
        method: 'get'
    })
}
export function sop_sopNameValidate(id) { //SOP名称校验
    return request({
        url: BASE_Prefix + '/sop/sopNameValidate/' + id,
        method: 'get'
    })
}
