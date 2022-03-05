import request from '@/utils/requestNew'
let BASE_USER_SERVICE = '/user-service'
let BASE_CUSTOMER_SERVICE = '/customer-service'
export function notice_personal_pageList(data) { //客户动态通知列表
    return request({
        url: BASE_USER_SERVICE + '/notice/personal/pageList',
        method: 'post',
        data: data
    })
}
export function notice_clueCustomerFollowUser(id,page,size) { //系统通知通知列表
    return request({
        url: BASE_CUSTOMER_SERVICE + '/clueCustomerFollowUser/list/' + id + '?pageIndex=' + page + '&pageSize=' + size,
        method: 'get',
    })
}
export function cluecustomer_homedata() { //获取首页数据
    return request({
        url: BASE_CUSTOMER_SERVICE + '/cluecustomer/homedata',
        method: 'get'
    })
}
export function livecode_homedata() { //获取首页数据
    return request({
        url: BASE_USER_SERVICE + '/livecode/homedata',
        method: 'get'
    })
}
export function user_getUserName(type = 'pc') { //获取权限数据
    return request({
        url: BASE_USER_SERVICE + '/user/getUserName?endPoint=' + type,
        method: 'get'
    })
}