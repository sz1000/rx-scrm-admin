import request from '@/utils/requestNew'
let BASE_Prefix = '/customer-service'
    //左侧字段列表
export const fieldList = (data) => {
        return request({
            url: BASE_Prefix + '/clueCustomerExtraColumns/fixedList',
            method: 'post',
            data: data,
        })
    }
    //右侧字段列表
export const customList = (data) => {
        return request({
            url: BASE_Prefix + '/clueCustomerExtraColumns/customList',
            method: 'post',
            data: data,
        })
    }
    // 编辑、新增自定义字段
export const editList = (data) => {
        return request({
            url: BASE_Prefix + '/clueCustomerExtraColumns/edit',
            method: 'post',
            data: data,
        })
    }
    // 编辑单个
export const editOneSort = (data) => {
        return request({
            url: BASE_Prefix + '/clueCustomerExtraColumns/sort',
            method: 'post',
            data: data,
        })
    }
    // 删除
export const deleteField = (data) => {
        return request({
            url: BASE_Prefix + `/clueCustomerExtraColumns/delete/${data}`,
            method: 'get',
        })
    }
    // 字段开关
export const switchField = (data) => {
        return request({
            url: BASE_Prefix + `/clueCustomerExtraColumns/switchover/${data}`,
            method: 'get',
        })
    }
    // 左侧查询
export const fixedColumnList = (data) => {
        return request({
            url: BASE_Prefix + `/clueCustomerExtraColumnsOptions/fixedColumnList`,
            method: 'post',
            data: data,
        })
    }
    // 左侧编辑、确定
export const fixedColumnEdit = (data) => {
    return request({
        url: BASE_Prefix + `/clueCustomerExtraColumnsOptions/fixedColumnEdit`,
        method: 'post',
        data: data,
    })
}