import http from '../utils/request'
import request from '@/utils/requestNew'
const customerServiceApi = '/customer-service'
const userServiceApi = '/user-service'
    // 页面详情
export const getHomeInfo = (params) => {
        return http.get(
            `${customerServiceApi}/clueCustomerRegular/getByRegularType`,
            params
        )
    }
    // 按钮状态
export const changeBtnStatus = (params) => {
        return http.get(
            `${customerServiceApi}/clueCustomerRegular/buttonstatus`,
            params
        )
    }
    // 标签列表
export const tagList = () => {
        return http.get(`${customerServiceApi}/tag/list`)
    }
    //字段列表
export const getFieldList = () => {
        return http.get(`${customerServiceApi}/clueCustomerRegular/paramList`)
    }
    // 保存\客户规则编辑
export const updatePage = (params) => {
        return http.post(
            `${customerServiceApi}/clueCustomerRegular/modifyReqular`,
            params
        )
    }
    // 删除
export const deleteRole = (params) => {
        return http.post(
            `${customerServiceApi}/clueCustomerRegular/deleteRole`,
            params
        )
    }
    //客户规则保存
export const saveCustomRule = (params) => {
        return http.post(
            `${customerServiceApi}/clueCustomerRegular/modifyReqularById`,
            params
        )
    }
    //新增
export const addRule = (params) => {
        return http.post(`${customerServiceApi}/clueCustomerRegular/addrole`, params)
    }
    //所有员工
export const getAllUser = () => {
    return http.get(`${userServiceApi}/user/getAllUser`)
}

// 导出
export const fneExportExcle = (data) => {
        return http.post(`${customerServiceApi}/clueCustomerInExport/export`, data)
    }
    // 导入
    // export const fnImportExcle = (data, config) => {
    //         return http.post(
    //             `${customerServiceApi}/clueCustomerInExport/importExcel`,
    //             data,
    //             config
    //         )
    //     }
export const fnImportExcle = (data, config) => {
    return request({
        url: customerServiceApi + '/clueCustomerInExport/importExcel',
        method: 'post',
        headers: config.headers,
        data: data,
    })
}

// 历史记录

export const pageList = (data, config) => {
    return request({
        url: customerServiceApi + '/importHistory/pageList',
        method: 'post',
        data: data,
    })
}