import axios from 'axios'
import store from '@/store'
import { BASE_URL } from '../config/app'
import { message } from '@/utils/resetMessage'
import { Loading } from 'element-ui'
let IndicatorHaveLoadCount = 0
let loadingService = {
    text: '加载中',
    // spinner: 'vab-loading-type',
    // background: '#fff',
    // customClass: 'ip_page_loading'
}
let protocol = window.location.protocol
let loadingIndicator = ''
    // axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.timeout = 120000
axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'
const service = axios.create({
    baseURL: BASE_URL,
    //baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    //withCredentials: true, // send cookies when cross-domain requests
    //timeout: 30000, // request timeout
})
let pendingData = []
let CancelToken = axios.CancelToken
let removePendingData = (config) => {
    for (let i = 0, len = pendingData.length; i < len; i++) {
        if (pendingData[i] && pendingData[i].url === config.baseURL + config.url) {
            pendingData[i].cancelFun()
            pendingData.splice(i, 1)
        }
    }
}
service.interceptors.request.use(
    (config) => {
        // config.baseURL = config.baseURL ? config.baseURL : process.env.VUE_APP_BASE_API
        const token = window.localStorage.getItem('token')
        const user_no = window.localStorage.getItem('user_no')
            // console.log('------token----', token)
            // config.headers.common.token = 'e479f7|3F111AEB9F5949378C7C69E2917EAF40'
        if (token) {
            config.headers.common.token = token
            config.headers.common.user_no = user_no
        }
        IndicatorHaveLoadCount += 1
        if (!config.headers['noLoading']) {
            // Indicator.open({
            //     text: '加载中...',
            //     spinnerType: 'double-bounce'
            // });
            loadingIndicator = Loading.service(loadingService)
            delete config.headers['noLoading']
        } else {
            delete config.headers['noLoading']
        }
        removePendingData(config)
        config.cancelToken = new CancelToken((callback) => {
            pendingData.push({
                url: config.baseURL + config.url,
                cancelFun: callback,
            })
        })
        return config
    },
    (error) => {
        // Indicator.close();
        if (loadingIndicator) {
            loadingIndicator.close()
        }
        Promise.reject(error)
    }
)
service.interceptors.response.use(
    (response) => {
        let noMessage = response.config.headers.noMessage || false
        removePendingData(response.config)
        IndicatorHaveLoadCount -= 1
        if (IndicatorHaveLoadCount < 1) {
            IndicatorHaveLoadCount = 0
            if (loadingIndicator) {
                loadingIndicator.close()
            }
        }
        const res = response.data
        if (!noMessage && res.code != 'success') {
            if (res.code == 401) {
                message({
                    message: '请重新登录',
                    type: 'error',
                    duration: 2000,
                })
                store.dispatch('signOut', [])
                setTimeout(function() {
                    window.location.reload()
                }, 2000)
            } else {
                if (res.resultType != 0 || res.resultType != 1) {
                    message({
                        message: res.msg,
                        type: 'error',
                        duration: 2000,
                        customClass: 'mainMessage',
                    })
                    return false
                }
            }
        }
        return res
    },
    (error) => {
        // removePendingData(response.config)
        IndicatorHaveLoadCount -= 1
        if (IndicatorHaveLoadCount < 1) {
            IndicatorHaveLoadCount = 0
            if (loadingIndicator) {
                loadingIndicator.close()
            }
        }
        if (error.response) {
            if (error.response.status == 401) {
                message({
                    message: '请重新登录',
                    type: 'error',
                    duration: 2000,
                })
                store.dispatch('signOut', [])
                setTimeout(function() {
                    window.location.reload()
                }, 2000)
            } else if (error.response.status == 400) {
                message({
                    message: '请输入正确的参数',
                    type: 'error',
                    duration: 2000,
                })
            } else {
                message({
                    message: '请求出错，请重试',
                    type: 'error',
                    duration: 2000,
                })
            }
        } else {
            // console.log('error',error)
            // message({
            //     message: '请求出错，请重试',
            //     type: 'error',
            //     duration: 2000,
            // })
        }
        return Promise.reject(error)
    }
)

export default service