// i系统管理
export const systList = [{
            url: '/accountManagement/numManage',
            title: '员工通讯录',
            icon: require('../../assets/images/icon_notebook@2x.png'),
            // childrenList: [],
        },
        {
            url: '/accountManagement/roleSetting',
            title: '角色权限',
            icon: require('../../assets/images/icon_limit@2x.png'),
        },
        {
            url: '/accountManagement',
            title: '客户流转规则',
            icon: require('../../assets/images/icon_rule@2x.png'),
            childrenList: [{
                    url: '/accountManagement/customeFlow',
                    title: '有线索认定规则',
                },
                {
                    url: '/accountManagement/allotCustom',
                    title: '客户分配规则',
                },
                {
                    url: '/accountManagement/recycling',
                    title: '公海回收规则',
                },
            ],
        },
        {
            url: '/accountManagement',
            title: '业务设置',
            icon: require('../../assets/images/icon_bussiness.png'),
            childrenList: [{
                url: '/accountManagement/opportunityStage',
                title: '商机阶段设置',
            }],
        },
        {
            url: '/accountManagement/seaSetting',
            title: '多公海设置',
            icon: require('../../assets/images/icon_setting@2x.png'),
        },
        {
            url: '/accountManagement/accredit',
            title: '企微授权',
            icon: require('../../assets/images/icon_warrant@2x.png'),
        },
        {
            url: '/accountManagement/companyInformation',
            title: '企业信息',
            icon: require('../../assets/images/icon_message@2x.png'),
        },
        {
            url: '/accountManagement/personSet',
            title: '个人设置',
            icon: require('../../assets/images/icon_management@2x.png'),
        },
    ]
    // 拓客工具
export const markTool = [{
            url: '/markcenter',
            title: '企微活码',
            icon: require('../../assets/images/qiwei.png'),
            childrenList: [{
                    url: '/markcenter/enterpriseLive',
                    title: '活码列表',
                },
                {
                    url: '/markcenter/myCode',
                    title: '我的活码',
                },
                {
                    url: '/markcenter/myGroupCode',
                    title: '我的群活码',
                },
                {
                    url: '/markcenter/groupCode',
                    title: '群活码',
                },
                {
                    url: '/markcenter/channelManagement',
                    title: '渠道配置',
                },
            ],
        },
        {
            url: '/markcenter',
            title: '留资表单',
            icon: require('../../assets/images/liuzi.png'),
            childrenList: [{
                    url: '/markcenter/enterpriseForm',
                    title: '企业表单库',
                },
                {
                    url: '/markcenter/myCreateForm',
                    title: '我创建的表单',
                },
            ],
        },
        {
            url: '/markcenter',
            title: '云锁客',
            icon: require('../../assets/images/yunsk.png'),
            childrenList: [{
                    url: '/markcenter/mapGuest',
                    title: '地图获客',
                },
                {
                    url: '/markcenter/onlySoking',
                    title: '智能搜客',
                },
                {
                    url: '/markcenter/cluesExploration',
                    title: '线索探查',
                },
                {
                    url: '/markcenter/configuration',
                    title: '额度配置',
                },
            ],
        },
    ]
    // 客户管理
export const customeList = [{
            url: '/customerManagement',
            title: '线索客户',
            icon: require('../../assets/images/xiansuo.png'),
            childrenList: [{
                    url: '/customerManagement/account',
                    title: '我的线索',
                },
                {
                    url: '/customerManagement/role',
                    title: '线索公海',
                },
                {
                    url: '/customerManagement/myCustome',
                    title: '我的客户',
                },
                {
                    url: '/customerManagement/myAllCus',
                    title: '全部客户',
                },
                {
                    url: '/customerManagement/customeGroup',
                    title: '客户公海',
                },
                {
                    url: '/customerManagement/allClue',
                    title: '全部线索',
                },
            ],
        },
        {
            url: '/customerManagement',
            title: '客户群运营',
            icon: require('../../assets/images/icon_peoples@2x.png'),
            childrenList: [{
                    url: '/customerManagement/groupList',
                    title: '群列表',
                },
                {
                    url: '/customerManagement/welcomeLanguage',
                    title: '入群欢迎语',
                },
            ],
        },
        {
            url: '/customerManagement',
            title: '标签管理',
            icon: require('../../assets/images/icon_tag@2x.png'),
            childrenList: [{
                    url: '/customerManagement/enterpriseLabel',
                    title: '企业标签',
                },
                // {
                //     url: '/customerManagement/welcomeLanguage',
                //     title: '入群欢迎语',
                // },
            ],
        },
        {
            url: '/customerManagement/sopProcess',
            title: 'SOP标准流程',
            icon: require('../../assets/images/icon_branch@2x.png'),
        },
    ]
    // 营销互动
export const interactive = [{
            url: '/interactivemarketing',
            title: '话术库',
            icon: require('../../assets/images/words.png'),
            childrenList: [{
                    url: '/interactivemarketing/individualWords',
                    title: '个人话术',
                },
                {
                    url: '/interactivemarketing/publicWords',
                    title: '公共话术',
                },
            ],
        },
        {
            url: '/interactivemarketing',
            title: '素材群发',
            icon: require('../../assets/images/material.png'),
            childrenList: [{
                    url: '/interactivemarketing/customergroup',
                    title: '客户群发',
                },
                {
                    url: '/interactivemarketing/customermassgroup',
                    title: '客户群群发',
                },

            ],
        },
        {
            url: '/interactivemarketing',
            title: '内容素材',
            icon: require('../../assets/images/icon_peoples@2x.png'),
            childrenList: [{
                    url: '/interactivemarketing/recommendableArticle',
                    title: '种草文章',
                },
                {
                    url: '/interactivemarketing/salesDocuments',
                    title: '销售文件',
                },
                {
                    url: '/interactivemarketing/marketingPoster',
                    title: '营销海报',
                },
            ],
        },
    ]
    // 企业风控
export const riskControl = [{
            url: '/riskControl/outonTrack',
            title: '员工外出轨迹',
            icon: 'track',
            icon: require('../../assets/images/icon_notebook@2x.png'),
            // childrenList: [],
        },
        {
            url: '/riskControl',
            title: '会话存档',
            icon: require('../../assets/images/icon_record.png'),
            childrenList: [{
                    url: '/riskControl/sessionRecord',
                    title: '会话记录',
                },
                {
                    url: '/riskControl/sensitiveWordSettings',
                    title: '敏感词设置',
                },
                {
                    url: '/riskControl/violationReminder',
                    title: '违规提醒',
                },
            ],
        }
    ]
    // 数据报表
export const dataReport = []