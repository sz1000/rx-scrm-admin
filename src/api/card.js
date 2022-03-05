
import request from '@/utils/requestNew'
let BASE_Prefix = '/user-service'
export function userBusinessCard_edit(data) { //名片基础信息新增
    return request({
        url: BASE_Prefix + '/userBusinessCard/edit',
        method: 'post',
        data: data
    })
}
export function userBusinessCard_personalCard() { //获取详情信息
    return request({
        url: BASE_Prefix + '/userBusinessCard/personalCard',
        method: 'get'
    })
}
export function userdepartment_getAlllist() { //获取所有部门列表
    return request({
        url: BASE_Prefix + '/userdepartment/getAlllist',
        method: 'get'
    })
}
export function userBusinessCardViewLog_pageList(data) { //获取浏览列表
    return request({
        url: BASE_Prefix + '/userBusinessCardViewLog/pageList',
        method: 'post',
        data: data
    })
}
export function userBusinessCardViewLog_personalCard() { //获取浏览数据
    return request({
        url: BASE_Prefix + '/userBusinessCardViewLog/personalCard',
        method: 'get'
    })
}