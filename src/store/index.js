import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.js'
import { GetCrop } from '../config/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
    },
    state: {
        corpId: localStorage.getItem('corpId'),
        token: localStorage.getItem('token'),
        commonSetting: JSON.parse(localStorage.getItem('commonSetting')),
        clientWidth: 0,
        dataChartsHeight: 0,
        dataPermission: localStorage.getItem('dataPermission'),
    },

    getters: {
        token: state => state.token,
        corpId: state => state.corpId,
        clientWidth: state => state.clientWidth,
        dataChartsHeight: state => state.dataChartsHeight,
        commonSetting: state => state.commonSetting,
        dataPermission: state => state.dataPermission,
    },

    mutations: {
        SET_CORPID(state, val) {
            localStorage.setItem('corpId', val)
            state.corpId = val
        },
        SET_TOKEN(state, val) {
            localStorage.setItem('token', val)
            state.token = val
        },
        SET_RESIZEWIDTH(state, val) {
            localStorage.setItem('clientWidth', val)
            state.clientWidth = val
        },
        SET_DATACHARTSHEIGHT(state, val) {
            localStorage.setItem('dataChartsHeight', val)
            state.dataChartsHeight = val
        },
        SET_COMMONSETTING(state, val) {
            localStorage.setItem('commonSetting', JSON.stringify(val))
            state.dataChartsHeight = val
        },
        SET_DATAPERMISSION(state, val) {
            localStorage.setItem('dataPermission', JSON.stringify(val))
            state.dataPermission = val
        },
    },

    actions: {
        getCorpId({ commit }) {
            return new Promise((resolve, reject) => {
                GetCrop().then(res => {
                    const { code, data } = res

                    if (code === 'success' && data) {
                        commit('SET_CORPID', data.corpId)
                        resolve(data.corpId)
                    } else {
                        reject()
                    }
                }).catch(reject)
            })
        }
    }
})

export default store