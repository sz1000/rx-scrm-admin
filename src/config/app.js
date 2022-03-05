let BASE_URL = ''
if (location.hostname == 'localhost') {
    // BASE_URL = 'http://172.10.6.177:8099' //葛
    // BASE_URL = 'http://172.10.7.114:8099' //袁
    // BASE_URL = 'http://172.10.7.200:8099' //刘
    // BASE_URL = 'http://172.10.7.170:8099' //稳
    // BASE_URL = 'http://172.10.6.144:8099' //李泉
    // BASE_URL = 'https://dev-api.jzcrm.com'
    BASE_URL = 'https://test-api.jzcrm.com' // 测试
} else if (location.hostname == 'dev-console.jzcrm.com') {
    BASE_URL = 'https://dev-api.jzcrm.com' //开发
} else if (location.hostname == 'test-console.jzcrm.com') {
    BASE_URL = 'https://test-api.jzcrm.com' // 测试
} else {
    BASE_URL = 'https://api.jzcrm.com' //生产
}
let ROUTER_MODE = ''
let IMG_BASE_URL = BASE_URL
export { BASE_URL, ROUTER_MODE, IMG_BASE_URL }