import http from '../utils/request'

const materialServiceApi = '/material-service'
    // 列表
export const getDetail = (data) => {
        return http.get(
            `${materialServiceApi}/friendCircle/getAllFriendCircleList`,
            data
        )
    }
    // 新增
export const addFriend = (data) => {
        return http.post(`${materialServiceApi}/friendCircle/addFriendCircle`, data)
    }
    //详情页列表
export const getTableData = (data) => {
        return http.get(
            `${materialServiceApi}/friendCircle/friendCircleUserList`,
            data
        )
    }
    // 读取链接
export const getarticle = (data) => {
    return http.get(
        `${materialServiceApi}/article/wechat_article`,
        data
    )
}