// 拓客工具
import request from '@/utils/requestNew'
let BASE_USER_SERVICE = '/user-service'
export function livecode_getLivecodeList(data) { //获取活码列表
    return request({
        url: BASE_USER_SERVICE + '/livecode/getLivecodeList',
        method: 'get',
        params: data
    })
}
export function livecode_toadd() {
    return request({
        url: BASE_USER_SERVICE + '/livecode/toadd',
        method: 'get'
    })
}
export function livecode_delLivecode(data) {    //删除活码
    return request({
        url: BASE_USER_SERVICE + '/livecode/delLivecode',
        method: 'post',
        data
    })
}
export function livecodegroup_getlist(data) {    //群活码列表
    return request({
        url: BASE_USER_SERVICE + '/livecodegroup/getlist',
        method: 'get',
        params: data
    })
}
export function livecodegroup_getselect() {
    return request({
        url: BASE_USER_SERVICE + '/livecodegroup/getselect',
        method: 'get'
    })
}
export function livecodegroup_delete(data) {    //删除群活码
    return request({
        url: BASE_USER_SERVICE + '/livecodegroup/delete',
        method: 'post',
        data
    })
}
export function channel_getChannelList(data) {    //渠道列表
    return request({
        url: BASE_USER_SERVICE + '/channel/getChannelList',
        method: 'get',
        params: data
    })
}
export function channel_delChannel(data) {    //删除渠道
    return request({
        url: BASE_USER_SERVICE + '/channel/delChannel',
        method: 'post',
        data
    })
}