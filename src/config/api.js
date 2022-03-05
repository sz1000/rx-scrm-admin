import http from '../utils/request'
import request from '@/utils/requestNew'
import { BASE_URL } from './app'

const wechatServiceApi = '/wechat-service'
const userServiceApi = '/user-service'
const commonServiceApi = '/common-service'
const materialServiceApi = '/material-service'
const customerServiceApi = '/customer-service'

export const GetCrop = () => {
        return http.get(`${userServiceApi}/Corp/getCrop`)
    } // 企业详情
export const UsersList = (data) => {
        return http.get(`${userServiceApi}/user/getlist/${data}`)
    } // 企业员工列表

// oss上传下载
export const uploadFileUrl =
    BASE_URL + commonServiceApi + '/oss/uploadfileparam'

export const uploadToOss = (data) => {
        return http.post(`${commonServiceApi}/oss/uploadfileparam`, data)
    } // 上传
export const downloadFromOss = (data) => {
        return http.post(`${commonServiceApi}/oss/downloadfile`, data)
    } // 下载

// 素材模板
export const ArticleList = (data) => {
        return http.get(`${materialServiceApi}/article/list`, data)
    } // 获取文章列表
export const ArticleDetail = (data) => {
        return http.get(`${materialServiceApi}/article/${data}/detail`)
    } // 获取文章详情
export const AddArticle = (data) => {
        return http.post(`${materialServiceApi}/article`, data)
    } // 新增文章
export const ModifyArticle = (data) => {
        return http.put(`${materialServiceApi}/article`, data)
    } // 修改文章
export const DeleteArticle = (data) => {
        return http.delete(`${materialServiceApi}/article/${data}`)
    } // 删除文章
export const ArticleFromReprint = (data) => {
        return http.get(`${materialServiceApi}/article/wechat_article`, data)
    } // 拉取微信公众号文章

export const SaleDocumentList = (data) => {
        return http.get(`${materialServiceApi}/sale_document/list`, data)
    } // 获取文件列表
export const SaleDocumentDetail = (data) => {
        return http.get(`${materialServiceApi}/sale_document/${data}/detail`)
    } // 获取文件详情
export const AddSaleDocument = (data) => {
        return http.post(`${materialServiceApi}/sale_document`, data)
    } // 新增文件
export const ModifySaleDocument = (data) => {
        return http.put(`${materialServiceApi}/sale_document`, data)
    } // 修改文件
export const DeleteSaleDocument = (data) => {
        return http.delete(`${materialServiceApi}/sale_document/${data}`)
    } // 删除文件

export const PosterList = (data) => {
        return http.get(`${materialServiceApi}/sale-poster-entity/list`, data)
    } // 获取海报列表

// 获取海报详情
export const PosterDetail = (data) => {
    return request({
        url: materialServiceApi + `/sale-poster-entity/${data}/detail`,
        method: 'get',
        params: data,
    })
}

export const AddPoster = (data) => {
        return http.post(`${materialServiceApi}/sale-poster-entity`, data)
    } // 添加营销海报
export const DeletePoster = (data) => {
        return http.delete(`${materialServiceApi}/sale-poster-entity/${data}`)
    } // 删除营销海报

export const MaterialDetail = (data) => {
        return http.get(
            `${materialServiceApi}/material_operation/${data.materialId}/detail?materialType=${data.materialType}&pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`
        )
    } // 获取素材详情

// 素材列表（新）

export const NewGetList = (data) => {
        return request({
            url: materialServiceApi +
                `/material_operation/${data.corpId}/${data.materialType}/list`,
            method: 'get',
            params: data,
        })
    }
    // 获取素材详情(新)
export const NewMaterialDetail = (data) => {
        return request({
            url: materialServiceApi +
                `/material_operation/${data.materialId}/${data.materialType}/info`,
            method: 'get',
            params: data,
        })
    }
    // 浏览记录
export const material_operation = (data) => {
        return request({
            url: materialServiceApi +
                `/material_operation/${data.materialId}/${data.materialType}/detail`,
            method: 'get',
            params: data,
        })
    }
    // 商机阶段
export const BusinessOpportunitiesList = (data) => {
        return http.get(
            `${customerServiceApi}/business-opportunities/stage/list`,
            data
        )
    } // 获取商机阶段
export const ModifyBusinessOpportunities = (data) => {
        return http.put(`${customerServiceApi}/business-opportunities/stage`, data)
    } // 修改商机阶段
export const ModifyBusinessOpportunitiesEnable = (data) => {
        return http.put(
            `${customerServiceApi}/business-opportunities/stage/${data.stageId}?isEnable=${data.isEnable}`
        )
    } // 修改商机阶段是否启用

// 商机
export const OpportunitiesList = (data) => {
        return http.get(`${customerServiceApi}/business-opportunities/list/${data}`)
    } // 获取商机
export const AddOpportunities = (data) => {
        return http.post(`${customerServiceApi}/business-opportunities`, data)
    } // 新增商机
export const ModifyOpportunities = (data) => {
        return http.put(`${customerServiceApi}/business-opportunities`, data)
    } // 修改商机
export const DeleteOpportunities = (data) => {
        return http.delete(`${customerServiceApi}/business-opportunities/${data}`)
    } // 删除商机
export const ModifyOpportunitiesStatus = (data) => {
        return http.put(
            `${customerServiceApi}/business-opportunities/status/${data.id}?stageNo=${data.stageNo}&status=${data.status}`
        )
    } // 修改商机对应阶段
export const OpportunitiesStageList = (data) => {
        return http.get(
            `${customerServiceApi}/business-opportunities/stages/${data.corpId}?isEnd=${data.isEnd}`
        )
    } // 获取商机阶段概要信息
export const StageReasonList = (data) => {
        return http.get(
            `${customerServiceApi}/business-opportunities/stage-reason/${data}`
        )
    } // 获取阶段原因
export const ChargeUserInfoList = (data) => {
        return http.get(
            `${customerServiceApi}/business-opportunities/charge-user-info/${data}`
        )
    } // 获取可选商机负责人

//通用设置
export const assistantRuleSetting = (data) => {
        return http.post(
            `${customerServiceApi}/generalSettings/wechatFriendRuleSetting`,
            data
        )
    } // 协助人规则配置
export const friendsLimitsWarningSetting = (data) => {
        return http.post(
            `${customerServiceApi}/generalSettings/friendsOrGroupLimitsWarningSetting`,
            data
        )
    } // 加好友/建群频率预警配置
export const settings = (data) => {
        return http.get(`${customerServiceApi}/generalSettings/settings`, data)
    } //企业下的所有配置
export const switchover = (data) => {
        return http.get(`${customerServiceApi}/generalSettings/switchover/${data}`)
    } //配置开关
export const interactiveRadarSetting = (data) => {
        return http.post(
            `${customerServiceApi}/generalSettings/interactiveRadarSetting`,
            data
        )
    } //
    // 会话存档
export const ChatSensitiveWordsList = (data) => {
        return http.get(`${userServiceApi}/chat-sensitive-words-entity/list`, data)
    } // 获取敏感词列表
export const AddChatSensitiveWords = (data) => {
        return http.post(`${userServiceApi}/chat-sensitive-words-entity`, data)
    } // 新增敏感词
export const ModifyChatSensitiveWords = (data) => {
        return http.put(`${userServiceApi}/chat-sensitive-words-entity`, data)
    } // 修改敏感词
export const DeleteChatSensitiveWords = (data) => {
        return http.delete(`${userServiceApi}/chat-sensitive-words-entity/${data}`)
    } // 删除敏感词
export const ChatSensitiveWordsDetail = (data) => {
        return http.get(`${userServiceApi}/chat-sensitive-words-entity/${data}`)
    } // 获取敏感词详情
export const AddChatSensitiveWordsItem = (data) => {
        return http.post(
            `${userServiceApi}/chat-sensitive-words-entity/config-rel`,
            data
        )
    } // 新增敏感词内容
export const ChatSensitiveWordsSyn = (data) => {
        return http.get(`${userServiceApi}/chat-sensitive-words-entity/syn`, data)
    } // 同步敏感词

export const DepartmentUserRels = (data) => {
        return http.get(
            `${userServiceApi}/userdepartment/department-user-rels/${data.corpId}?name=${data.name}`
        )
    } // 部门员工关联信息

export const ContactsList = (data) => {
        return http.get(`${wechatServiceApi}/msg-audit/contacts`, data)
    } // 获取联系人
export const ChatDataList = (data) => {
        return http.get(`${wechatServiceApi}/msg-audit/list`, data)
    } // 获取聊天信息
export const ChatFileDataList = (data) => {
        return http.get(`${wechatServiceApi}/msg-audit/file/msgs`, data)
    } // 获取聊天信息（file）
export const GroupList = (data) => {
        return http.get(`${wechatServiceApi}/msg-audit/group/list`, data)
    } // 获取聊天群
export const ViolationList = (data) => {
        return http.get(`${wechatServiceApi}/msg-audit/violation-tips`, data)
    } // 获取违规提醒列表
export const IfIsOpen = (data) => {
        return http.get(`${wechatServiceApi}/msg-audit/is-open`, data)
    } // 会话存档是否打开

export const UsersInfo = (data) => {
        return http.get(`${userServiceApi}/user/getUser/${data}/info`)
    } // 员工信息详情