const state = {
    // permissionsList: [],
    // permissionsList: JSON.parse(sessionStorage.getItem('permissionsList')),
    outonTrackObj: {},
}
const mutations = {
    setOutonTrackObj(state, val) {
        state.outonTrackObj = val
    },
}
const getters = {
    outonTrackObj: (state) => state.outonTrackObj,
}
const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}