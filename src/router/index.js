import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index.vue'
import LoginPedding from '../views/login/LoginPeding.vue'
import pedding from '../views/login/pedding.vue'

// layout布局
import Home from '../views/home/index.vue'

// 主页
import Main from '../views/home/main.vue'

// 拓客工具
// import MarketingMaterial from '../views/markcenter/marketingMaterial.vue'
import TransitCode from '../views/markCenter/TransitCode.vue'
import EnterpriseLive from '../views/markCenter/enterpriseLive.vue'
import ChannelManagement from '../views/markCenter/channelManagement.vue'
import GroupCode from '../views/markCenter/groupCode/GroupIndex.vue'
import MyGroupCode from '../views/markCenter/groupCode/MyGroupCode.vue'
import MyCode from '../views/markCenter/MyCode.vue'

// 客户管理
import Account from '../views/customerManagement/account.vue'
import Role from '../views/customerManagement/role.vue'
import MyCustome from '../views/customerManagement/myCustome.vue'
import myAllCus from '../views/customerManagement/myAllCus.vue'
import CustomeGroup from '../views/customerManagement/customeGroup.vue'
import CluesDetail from '../views/customerManagement/CluesDetail.vue'
import GroupList from '../views/customerManagement/GroupList.vue'
import GroupDetail from '../views/customerManagement/GroupDetail.vue'
import WelcomeList from '../views/customerManagement/WelcomeList.vue'
import LableGroup from '../views/customerManagement/lableGroup.vue'
import LableGroupDetails from '../views/customerManagement/lableGroupDetails.vue'
import LableGroupProp from '../views/customerManagement/lableGroupProp.vue'
import EnterpriseLabel from '../views/customerManagement/EnterpriseLabel.vue'
import GroupLable from '../views/customerManagement/GroupLable.vue'
//全部线索
import AllClue from '../views/customerManagement/allClue.vue'

// import SopPersonal from '../views/customerManagement/sopProcess/personal.vue'
// import Group from '../views/customerManagement/sopProcess/group.vue'
// import PersonalAdd from '../views/customerManagement/sopProcess/personalAdd.vue'
// import GroupAdd from '../views/customerManagement/sopProcess/groupAdd.vue'
// import PersonalDetail from '../views/customerManagement/sopProcess/personalDetail.vue'
// import GroupSopDetail from '../views/customerManagement/sopProcess/groupDetail.vue'
import ClientMigration from '../views/customerManagement/client/ClientMigration.vue'

// 系统管理
import WriteCodeInfo from '../views/accountManagement/WriteCodeInfo.vue'
import NumManage from '../views/accountManagement/numManage.vue'
import RoleSetting from '../views/accountManagement/roleSetting.vue'
import AddRole from '../views/accountManagement/roleComponent/AddRole.vue'
import EditRole from '../views/accountManagement/roleComponent/EditRole.vue'
import MicroAuthorized from '../views/accountManagement/MicroAuthorized.vue'
import CompanyInformation from '../views/accountManagement/CompanyInformation.vue'
import OpportunityStage from '../views/accountManagement/BusinessSettings/opportunityStage'
import FieldSetting from '../views/accountManagement/customField/FieldSetting.vue'
import GeneralSettings from '../views/accountManagement/customField/GeneralSettings.vue'

// 营销互动
import MyTask from '../views/interactiveMarketing/MyTask.vue'
import IndividualWords from '../views/interactiveMarketing/IndividualWords.vue'
import PublicWords from '../views/interactiveMarketing/PublicWords.vue'

import RecommendableArticle from '../views/interactiveMarketing/MaterialTemplate/RecommendableArticle.vue' // 种草文章页面
import SalesDocuments from '../views/interactiveMarketing/MaterialTemplate/SalesDocuments.vue' // 销售文件页面
import MarketingPoster from '../views/interactiveMarketing/MaterialTemplate/MarketingPoster.vue' // 营销海报页面
import EditArticle from '../views/interactiveMarketing/MaterialTemplate/EditArticle' // 文章新建/编辑
import MaterialDetails from '../views/interactiveMarketing/MaterialTemplate/MaterialDetails' // 详情
import EnterpriseFriend from '../views/interactiveMarketing/CircleFriends/EnterpriseFriend.vue' // 朋友圈
import AddFriends from '../views/interactiveMarketing/CircleFriends/AddFriends.vue' // 朋友圈新增
import DetailFriend from '../views/interactiveMarketing/CircleFriends/DetailFriend.vue' // 朋友圈详情
import CardInfo from '../views/interactiveMarketing/CallingCard/info.vue' // 名片基础信息
import CardSetting from '../views/interactiveMarketing/CallingCard/setting.vue' // 个人名片设置
import SettingList from '../views/interactiveMarketing/CallingCard/settingList.vue' // 个人名片设置 列表
import CardData from '../views/interactiveMarketing/CallingCard/data.vue' // 名片浏览数据

// 精细运营
/**一键拉群 */
import CustomerGroup from '../views/interactiveMarketing/keyMass/CustomerGroup' //客户群发
import NewAddedGroup from '../views/interactiveMarketing/keyMass/NewAddedGroup.vue' //客户群发新增按钮页面
import NewAddedGroupPlural from '../views/interactiveMarketing/keyMass/NewAddedGroupPlural.vue' //客户群群发新增按钮面
import ParticularsGroup from '../views/interactiveMarketing/keyMass/ParticularsGroup.vue' //客户群发详情按钮页面
import ParticularsGroupPlural from '../views/interactiveMarketing/keyMass/ParticularsGroupPlural.vue' //客户群群发详情按钮页面
// import Clientsend from '../views/interactiveMarketing/keyMass/Clientsend.vue' //客户群发编辑按钮页面
// import ClientsendPlural from '../views/interactiveMarketing/keyMass/ClientsendPlural.vue' //客户群发编辑按钮页面
import CustomerMassGroup from '../views/interactiveMarketing/keyMass/CustomerMassGroup.vue' //客户群群发

// import Demo from '../views/interactiveMarketing/demo.vue'

/*客户流转规则*/

import EffectiveRules from '../views/interactiveMarketing/customerFlow/EffectiveRules.vue'
import AllotCustom from '../views/interactiveMarketing/customerFlow/AllotCustom.vue'
import Recycling from '../views/interactiveMarketing/customerFlow/Recycling.vue'
/**sop */
import SopPersonal from '../views/interactiveMarketing/sopProcess/personal.vue'
import Group from '../views/interactiveMarketing/sopProcess/group.vue'
import PersonalAdd from '../views/interactiveMarketing/sopProcess/personalAdd.vue'
import GroupAdd from '../views/interactiveMarketing/sopProcess/groupAdd.vue'
import PersonalDetail from '../views/interactiveMarketing/sopProcess/personalDetail.vue'
import GroupSopDetail from '../views/interactiveMarketing/sopProcess/groupDetail.vue'

/**企业风控*/
// import OutonTrack from '../views/interactiveMarketing/OutonTrack.vue'
// import ClockCard from '../views/interactiveMarketing/ClockCard.vue'

// 数据报表与分析
import DataView from '../views/dataView/index.vue'

import SessionRecord from '../views/riskControl/SessionArchiving/SessionRecord' // 会话记录
import ViolationReminder from '../views/riskControl/SessionArchiving/ViolationReminder' // 违规提醒
import SensitiveWordSettings from '../views/riskControl/SessionArchiving/SensitiveWordSettings.vue' // 敏感词设置

//暂未开发
import Error from '../views/error/404.vue'
import test from '../views/home/test.vue'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err)
}

const routes = [{
        path: '/login',
        name: 'login',
        meta: {
            title: '登陆',
        },
        component: Login,
    },
    {
        path: '/loginPedding',
        name: 'loginPedding',
        component: LoginPedding,
    },
    {
        path: '/pedding',
        name: 'pedding',
        component: pedding,
    },
    {
        path: '/writeCodeInfo',
        name: 'writeCodeInfo',
        component: WriteCodeInfo,
    },
    {
        path: '/transitCode',
        name: 'transitCode',
        component: TransitCode,
    },
    {
        path: '/test',
        name: 'test',
        component: test,
    },
    // 首页
    {
        path: '/',
        redirect: '/readme',
    },
    {
        path: '/readme',
        component: Home,
        redirect: '/readme/main',
        // noDropdown: true,
        children: [{
            path: 'main',
            name: 'main',
            meta: {
                title: '首页',
                home: true,
            },
            component: Main,
        }, ],
    },
    // 拓客工具
    {
        path: '/markcenter',
        redirect: {
            path: '/markcenter/myCode',
        },
        name: 'markcenter',
        meta: {
            title: '拓客工具',
        },
        component: Home,
        children: [{
                path: 'enterpriseLive',
                name: 'enterpriseLive',
                meta: {
                    title: '活码列表',
                },
                component: EnterpriseLive,
            },
            {
                path: 'myCode',
                name: 'myCode',
                meta: {
                    title: '我的活码',
                },
                component: MyCode,
            },
            {
                path: 'myGroupCode',
                name: 'myGroupCode',
                meta: {
                    title: '我的群活码',
                },
                component: MyGroupCode,
            },
            {
                path: 'groupCode',
                name: 'groupCode',
                meta: {
                    title: '群活码',
                },
                component: GroupCode,
            },
            {
                path: 'channelManagement',
                name: 'channelManagement',
                meta: {
                    title: '渠道配置',
                },
                component: ChannelManagement,
            },
            {
                path: 'enterpriseForm',
                name: 'enterpriseForm',
                meta: {
                    title: '企业表单库',
                },
                component: Error,
            },
            {
                path: 'myCreateForm',
                name: 'myCreateForm',
                meta: {
                    title: '我创建的表单',
                },
                component: Error,
            },
            {
                path: 'mapGuest',
                name: 'mapGuest',
                meta: {
                    title: '地图获客',
                },
                component: Error,
            },
            {
                path: 'onlySoking',
                name: 'onlySoking',
                meta: {
                    title: '智能搜客',
                },
                component: Error,
            },
            {
                path: 'cluesExploration',
                name: 'cluesExploration',
                meta: {
                    title: '线索探查',
                },
                component: Error,
            },
            {
                path: 'configuration',
                name: 'configuration',
                meta: {
                    title: '额度配置',
                },
                component: Error,
            },
        ],
    },
    //客户管理
    {
        path: '/customerManagement',
        meta: {
            title: '客户管理',
        },
        redirect: '/customerManagement/account',
        component: Home,
        children: [{
                path: 'account',

                name: 'account',
                meta: { title: '我的线索' },
                component: Account,
            },
            {
                path: 'role',
                name: 'role',
                meta: {
                    title: '线索公海',
                },
                component: Role,
            },
            {
                path: 'allClue',
                name: 'allClue',
                meta: { title: '全部线索' },
                component: AllClue,
            },
            {
                path: 'myCustome',
                name: 'myCustome',
                meta: { title: '我的客户' },
                component: MyCustome,
            },
            {
                path: 'myAllCus',
                name: 'myAllCus',
                meta: { title: '全部客户' },
                component: myAllCus,
            },
            {
                path: 'customeGroup',
                name: 'customeGroup',
                meta: { title: '客户公海' },
                component: CustomeGroup,
            },
            {
                path: 'cluesDetail',
                name: 'cluesDetail',
                meta: { title: '详情页' },
                component: CluesDetail,
            },
            {
                path: 'groupList',
                name: 'groupList',
                meta: {
                    title: '群列表',
                },
                component: GroupList,
            },

            {
                path: 'groupDetail',
                name: 'groupDetail',
                meta: {
                    title: '群详情',
                },
                component: GroupDetail,
            },
            {
                path: 'welcomeLanguage',
                name: 'welcomeLanguage',
                meta: {
                    title: '入群欢迎语',
                },
                component: WelcomeList,
            },
            {
                path: 'lablegroup',
                name: 'lablegroup',
                meta: {
                    title: '标签建群',
                },
                component: LableGroup,
            },
            {
                path: 'lableGroupDetails',
                name: 'lableGroupDetails',
                meta: {
                    title: '标签建群添加',
                },
                component: LableGroupDetails,
            },
            {
                path: 'lableGroupProp',
                name: 'lableGroupProp',
                meta: {
                    title: '标签建群详情',
                },
                component: LableGroupProp,
            },
            {
                path: 'enterpriseLabel',
                name: 'enterpriseLabel',
                meta: {
                    title: '企业标签',
                },
                component: EnterpriseLabel,
            },
            {
                path: 'grouplable',
                name: 'grouplable',
                meta: {
                    title: '群标签',
                },
                component: GroupLable,
            },
            // {
            //     path: 'sopProcess/personal',
            //     name: 'sopProcessPersonal',
            //     meta: {
            //         title: '',
            //     },
            //     component: SopPersonal,
            // },
            // {
            //     path: 'sopProcess/group',
            //     name: 'sopProcessGroup',
            //     meta: {
            //         title: 'SOP标准流程',
            //     },
            //     component: Group,
            // },
            // {
            //     path: 'sopProcess/personalAdd',
            //     name: 'personalAdd',
            //     meta: {
            //         title: '新增个人SOP',
            //     },
            //     component: PersonalAdd,
            // },
            // {
            //     path: 'sopProcess/groupAdd',
            //     name: 'groupAdd',
            //     meta: {
            //         title: '新增群SOP',
            //     },
            //     component: GroupAdd,
            // },
            // {
            //     path: 'sopProcess/personalDetail',
            //     name: 'personalDetail',
            //     meta: {
            //         title: '个人SOP详情',
            //     },
            //     component: PersonalDetail,
            // },
            // {
            //     path: 'sopProcess/groupDetail',
            //     name: 'sopGroupDetail',
            //     meta: {
            //         title: '群SOP详情',
            //     },
            //     component: GroupSopDetail,
            // },
            {
                path: 'client/ClientMigration',
                name: 'ClientMigration',
                meta: {
                    title: '在职转接',
                },
                component: ClientMigration,
            },
            {
                path: 'dimission/inheritIndex',
                name: 'dimissioninheritIndex',
                meta: {
                    title: '离职继承',
                },
                component: Error,
            },
        ],
    },
    // 系统管理
    {
        path: '/accountManagement',
        redirect: '/accountManagement/numManage',
        component: Home,
        children: [{
                path: 'numManage',
                name: 'numManage',
                meta: {
                    title: '员工管理',
                },
                component: NumManage,
            },
            {
                path: 'roleSetting',
                name: 'roleSetting',
                meta: {
                    title: '角色设置',
                },
                component: RoleSetting,
            },
            {
                path: 'addRole',
                name: 'addRole',
                meta: {
                    title: '新增角色',
                },
                component: AddRole,
            },
            {
                path: 'editRole',
                name: 'editRole',
                meta: {
                    title: '编辑角色',
                },
                component: EditRole,
            },
            {
                path: 'customeFlow',
                name: 'customeFlow',
                meta: {
                    title: '有线索认定规则',
                    // keepAlive: true,
                },
                component: EffectiveRules,
            },

            {
                path: 'accredit',
                name: 'accredit',
                meta: {
                    title: '企微授权',
                },
                component: MicroAuthorized,
            },
            {
                path: 'companyInformation',
                name: 'companyInformation',
                meta: {
                    title: '企业信息',
                },
                component: CompanyInformation,
            },
            {
                path: 'personSet',
                name: 'personSet',
                meta: {
                    title: '个人设置',
                },
                component: Error,
            },
            {
                path: 'opportunityStage',
                name: 'opportunityStage',
                meta: {
                    title: '商机阶段设置',
                },
                component: OpportunityStage,
            },
            {
                path: 'fieldSetting',
                name: 'fieldSetting',
                meta: {
                    title: '字段设置',
                },
                component: FieldSetting,
            },
            {
                path: 'sensitiveWordSettings',
                name: 'sensitiveWordSettings',
                meta: {
                    title: '敏感词设置',
                },
                component: SensitiveWordSettings,
            },
            {
                path: 'generalsettings',
                name: 'generalsettings',
                meta: {
                    title: '同用设置',
                },
                component: GeneralSettings,
            },
        ],
    },
    //营销互动
    {
        path: '/interactivemarketing',
        redirect: '/interactivemarketing/recommendableArticle',
        component: Home,
        children: [{
                path: 'myTask',
                name: 'myTask',
                meta: {
                    title: '我下发的任务',
                },
                component: MyTask,
            },
            {
                path: 'individualWords',
                name: 'individualWords',
                meta: {
                    title: '个人话术',
                },
                component: IndividualWords,
            },
            {
                path: 'publicWords',
                name: 'publicWords',
                meta: {
                    title: '公共话术',
                },
                component: PublicWords,
            },
            {
                path: 'recommendableArticle',
                name: 'recommendableArticle',
                meta: {
                    title: '种草文章',
                },
                component: RecommendableArticle,
            },
            {
                path: 'salesDocuments',
                name: 'salesDocuments',
                meta: {
                    title: '销售文件',
                },
                component: SalesDocuments,
            },
            {
                path: 'marketingPoster',
                name: 'marketingPoster',
                meta: {
                    title: '营销海报',
                },
                component: MarketingPoster,
            },
            {
                path: 'editArticle',
                name: 'editArticle',
                meta: {
                    title: '写文章',
                },
                component: EditArticle,
            },
            {
                path: 'materialDetails',
                name: 'materialDetails',
                meta: {
                    title: '详情',
                },
                component: MaterialDetails,
            },
            {
                path: 'callingCard/info',
                name: 'cardInfo',
                meta: {
                    title: '名片基础信息',
                },
                component: CardInfo,
            },
            {
                path: 'callingCard/setting',
                name: 'CardSetting',
                meta: {
                    title: '个人名片设置',
                },
                component: CardSetting,
            },
            {
                path: 'callingCard/data',
                name: 'CardData',
                meta: {
                    title: '名片浏览数据',
                },
                component: CardData,
            },
            {
                path: 'callingCard/settingList',
                name: 'SettingList',
                meta: {
                    title: '个人名片设置',
                },
                component: SettingList,
            },
            {
                path: 'enterpriseFriend',
                name: 'enterpriseFriend',
                meta: {
                    title: '朋友圈',
                },
                component: EnterpriseFriend,
            },
            {
                path: 'addFriends',
                name: 'addFriends',
                meta: {
                    title: '朋友圈新增',
                },
                component: AddFriends,
            },
            {
                path: 'detailFriend',
                name: 'detailFriend',
                meta: {
                    title: '朋友圈详情',
                },
                component: DetailFriend,
            },
            {
                path: 'customergroup',
                name: 'customergroup',
                meta: {
                    title: '客户群发',
                },
                component: CustomerGroup,
            },
            {
                path: 'customermassgroup',
                name: 'customermassgroup',
                meta: {
                    title: '客户群群发', //customermassgroup
                },
                component: CustomerMassGroup,
            },
            // {
            //     path: 'demo',
            //     name: 'demo',
            //     meta: {
            //         title: '客户群群发', //customermassgroup
            //     },
            //     component: Demo,
            // },

            {
                path: 'newaddedgroup',
                name: 'newaddedgroup',
                meta: {
                    title: '新增按钮页面',
                },
                component: NewAddedGroup,
            },
            {
                path: 'newaddedgroupplural',
                name: 'newaddedgroupplural',
                meta: {
                    title: '新增按钮页面客户群群发',
                },
                component: NewAddedGroupPlural,
            },
            {
                path: 'particularsgroup',
                name: 'particularsgroup',
                meta: {
                    title: '详情按钮页面',
                },
                component: ParticularsGroup,
            },
            {
                path: 'particularsgroupplural',
                name: 'particularsgroupplural',
                meta: {
                    title: '群群详情按钮页面',
                },
                component: ParticularsGroupPlural,
            },
            // {
            //     path: 'clientsend',
            //     name: 'clientsend',
            //     meta: {
            //         title: '编辑按钮页面',
            //     },
            //     component: Clientsend,
            // },
            // {
            //     path: 'clientsendplural',
            //     name: 'clientsendplural',
            //     meta: {
            //         title: '编辑群发按钮页面',
            //     },
            //     component: ClientsendPlural,
            // },
            // {
            //     path: 'clientsendplural',
            //     name: 'clientsendplural',
            //     meta: {
            //         title: '编辑群发按钮页面',
            //     },
            //     component: ClientsendPlural,
            // },
            {
                path: 'customerFlow/effectiveRule',
                name: 'effectiveRule',
                meta: {
                    title: '有线索认定规则',
                },
                component: EffectiveRules,
            },
            {
                path: 'customerFlow/allotCustom',
                name: 'allotCustom',
                meta: {
                    title: '客户分配规则',
                },
                component: AllotCustom,
            },
            {
                path: 'customerFlow/recycling',
                name: 'recycling',
                meta: {
                    title: '公海回收规则',
                },
                component: Recycling,
            },
            {
                path: 'sopProcess/personal',
                name: 'sopProcessPersonal',
                meta: {
                    title: '',
                },
                component: SopPersonal,
            },
            {
                path: 'sopProcess/group',
                name: 'sopProcessGroup',
                meta: {
                    title: 'SOP标准流程',
                },
                component: Group,
            },
            {
                path: 'sopProcess/personalAdd',
                name: 'personalAdd',
                meta: {
                    title: '新增个人SOP',
                },
                component: PersonalAdd,
            },
            {
                path: 'sopProcess/groupAdd',
                name: 'groupAdd',
                meta: {
                    title: '新增群SOP',
                },
                component: GroupAdd,
            },
            {
                path: 'sopProcess/personalDetail',
                name: 'personalDetail',
                meta: {
                    title: '个人SOP详情',
                },
                component: PersonalDetail,
            },
            {
                path: 'sopProcess/groupDetail',
                name: 'sopGroupDetail',
                meta: {
                    title: '群SOP详情',
                },
                component: GroupSopDetail,
            },
        ],
    },
    // 精细运营
    // {
    //     path: '/interactiveMarketing',
    //     redirect: '/interactiveMarketing/customergroup',
    //     component: Home,
    //     children: [
    //         // {
    //         //     path: 'outonTrack',
    //         //     name: 'outonTrack',
    //         //     meta: {
    //         //         title: '员工外出轨迹',
    //         //     },
    //         //     component: OutonTrack,
    //         // },
    //         // {
    //         //     path: 'clockCard',
    //         //     name: 'clockCard',
    //         //     meta: { title: '员工轨迹详情页' },
    //         //     component: ClockCard,
    //         // },
    //     ],
    // },
    //企业风控
    {
        path: '/riskControl',
        redirect: '/riskControl/sessionRecord',
        component: Home,
        children: [{
                path: 'sessionRecord',
                name: 'sessionRecord',
                meta: {
                    title: '会话记录',
                },
                component: SessionRecord,
            },
            // {
            //     path: 'sensitiveWordSettings',
            //     name: 'sensitiveWordSettings',
            //     meta: {
            //         title: '敏感词设置',
            //     },
            //     component: SensitiveWordSettings,
            // },
            {
                path: 'violationReminder',
                name: 'violationReminder',
                meta: {
                    title: '违规提醒',
                },
                component: ViolationReminder,
            },
        ],
    },
    // 数据报表与分析
    {
        path: '/dataView',
        component: Home,
        children: [{
            path: '',
            name: '',
            meta: {
                title: '数据报表',
                noPadding: true,
            },
            component: DataView,
        }, ],
    },
    {
        path: '/404',
        component: Error,
    },
]

const router = new VueRouter({
    // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes,
})

export default router