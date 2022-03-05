import request from '@/utils/requestNew'
let BASE_Prefix = 'customer-service'
export function dataReport_getDataCount(id) { //获取数据总数
    return request({
        url: BASE_Prefix + '/dataReport/getDataCount?corpId=' + id,
        method: 'post'
    })
}
export function dataReport_getCustomerDataOverview(id,type) { //获取数据概览
    return request({
        url: BASE_Prefix + '/dataReport/getCustomerDataOverview?corpId=' + id + '&dateFlag=' + type,
        method: 'post'
    })
}
export function dataReport_getClueDataOverview(id,type) { //获取线索转化率
    return request({
        url: BASE_Prefix + '/dataReport/getClueDataOverview?corpId=' + id + '&dateFlag=' + type,
        method: 'post'
    })
}
export function dataReport_getCustomerGroupDataOverview(id,type) { //获取客户群概览
    return request({
        url: BASE_Prefix + '/dataReport/getCustomerGroupDataOverview?corpId=' + id + '&dateFlag=' + type,
        method: 'post'
    })
}
export function dataReport_getLabelView(id,limit = 20) { //获取标签看板
    return request({
        url: BASE_Prefix + '/dataReport/getLabelView?corpId=' + id + '&limit=' + limit,
        method: 'post'
    })
}
export function dataReport_getAllCustomerDataOverview(id,type = 'year') { //获取所有数据
    return request({
        url: BASE_Prefix + '/dataReport/getAllCustomerDataOverview?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getAllMaterialDataOverview(id,type = 'year') { //获取素材所有数据
    return request({
        url: BASE_Prefix + '/dataReport/getAllMaterialDataOverview?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getMaterialTOP(id,type) { //获取素材top10
    return request({
        url: BASE_Prefix + '/dataReport/getMaterialTOP?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getFriendCircle(id,type) { //朋友圈发送量
    return request({
        url: BASE_Prefix + '/dataReport/getFriendCircle?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getAllBusinessOpportunities(id,type = 'year') { //获取商机所有数据
    return request({
        url: BASE_Prefix + '/dataReport/getAllBusinessOpportunities?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getOpportunityReport(id,type) { //获取商机报告
    return request({
        url: BASE_Prefix + '/dataReport/getOpportunityReport?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getAllCustomerMassScreen(id,type = 'year') { //获取群发所有数据
    return request({
        url: BASE_Prefix + '/dataReport/getAllCustomerMassScreen?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getAllSOPData(id,type = 'year') { //获取SOP所有数据
    return request({
        url: BASE_Prefix + '/dataReport/getAllSOPData?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getVisitDataOverview(id,type = 'year') { //获取拜访所有数据
    return request({
        url: BASE_Prefix + '/dataReport/getVisitDataOverview?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}
export function dataReport_getCustomerCirculationDataOverview(id,type = 'year') { //获取客户流转所有数据
    return request({
        url: BASE_Prefix + '/dataReport/getCustomerCirculationDataOverview?corpId=' + id + '&dateFlag=' + type,
        method: 'get'
    })
}