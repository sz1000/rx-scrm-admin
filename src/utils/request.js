import router from '../router/index'
import { BASE_URL } from '../config/app'
import axios from 'axios'
// import { Message } from 'element-ui'
import { message } from '@/utils/resetMessage'
// console.log(process.env)
let instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
})

// 请求
instance.interceptors.request.use(
        (config) => {
            // console.log('--------', config.url)
            // 如果有token 就携带tokon
            const token = window.localStorage.getItem('token')
            const user_no = window.localStorage.getItem('user_no')
                // console.log('------token----', token)
                // config.headers.common.token = 'e479f7|3F111AEB9F5949378C7C69E2917EAF40'
            if (token) {
                config.headers.common.token = token
                config.headers.common.user_no = user_no
            }
            return config
        },
        (error) => Promise.reject(error)
    )
    //响应
instance.interceptors.response.use(
    // 响应包含以下信息data,status,statusText,headers,config
    // (res) => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
    (res) => {
        // console.log('---resUse------', res)
        if (res.status === 200) {
            if (res.data) {
                return Promise.resolve(res)
            } else {
                // console.log('-----resdata----', res)
                if (res.data.code == 'fail') {
                    Message({
                        message: res.data.msg,
                        type: 'error',
                    })
                    return Promise.reject(res)
                } else if (
                    res.data.code == 'error_token_expired' ||
                    res.data.code == 'error_token_null'
                ) {
                    localStorage.removeItem('token')
                    window.location.href = '/#/login'
                } else {
                    Message({
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            }
        } else {
            return Promise.reject(res)
        }
    },

    (err) => {
        // console.log(11111111)
        const { response } = err
        // console.log('--------', response)
        if (response) {
            errorHandle(response.status, response.data)
            return Promise.reject(response)
        } else {
            console.log('请求失败')
        }
    }
)
const errorHandle = (status, other) => {
    // console.log(other)
    switch (status) {
        case 400:
            console.log('信息校验失败')
            break
        case 401:
            // console.log('---1111-----', router)
            router.replace({
                path: '/login',
            })
            console.log('认证失败')
            break
        case 403:
            console.log('token校验失败')
            break
        case 404:
            console.log('请求的资源不存在')
            break
        case 500:
            if (other.path == '/user-service/user/logout') {
                localStorage.removeItem('token')
                router.replace('/login')
            }
            console.log('请求500错误')
            break
    }
}

const methods = ['post', 'get', 'delete', 'put']

let http = {}
methods.forEach((item) => {
    http[item] = function(url, params = {}, config = {}) {
        let innerInstance
        if (['get', 'delete'].includes(item)) {
            innerInstance = instance[item](url, { params: params, ...config })
        } else {
            innerInstance = instance[item](url, params, config)
        }
        return innerInstance
            .then((res) => {
                let data = res.data
                    // console.log('---res1----', res)
                if (
                    data.result ||
                    data.code == 'error_name_exit' ||
                    data.code == '-1'
                ) {
                    return Promise.resolve(data)
                } else {
                    if (
                        data.code == 'error_token_expired' ||
                        data.code == 'error_token_null' ||
                        data.code == 'error_token_empty' ||
                        data.code == 'error_busy' ||
                        data.code == 'error_code' ||
                        data.code == 'error_forbid' ||
                        data.code == 'error_corp_forbid'
                    ) {
                        localStorage.removeItem('token')
                        setTimeout(function() {
                            window.location.reload()
                        }, 2000)
                        // router.replace('/login')
                    }
                    message({
                        message: res.data.msg,
                        // message: '账号已过期，请重新登录',
                        type: 'error',
                        customClass: 'mainMessage',
                    })
                    return Promise.reject(data.msg)
                }
            })
            .catch((err) => {
                return Promise.reject(err)
            })
    }
})

export default http