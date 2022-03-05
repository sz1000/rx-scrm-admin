import router from './router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration
router.beforeEach(async(to, from, next) => {
    // console.log('-----pcConsole----', to)
    if (Object.keys(to.query).length > 0) {
        // let newToken = to.query.redirect.split('?')[1].split('=')[1]
        let newToken = to.query.token
        if (newToken) {
            store.commit('SET_TOKEN', decodeURI(newToken))
        }
    }
    let token = localStorage.getItem('token')
    let redirect = to.query.redirect || ''
    let whiteList = [
        '/login',
        '/loginPedding',
        '/pedding',
        '/writeCodeInfo',
        '/transitCode',
    ]

    if (token) {
        console.log('token', to.path, redirect)
        NProgress.start()
        if (to.path == '/login') {
            next({ path: redirect || '/' })
        } else {
            next()
        }
    } else {
        console.log('no token', to.path)
        NProgress.start()
        if (whiteList.indexOf(to.path) > -1) {
            next()
        } else {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            })
        }
    }
})

router.afterEach(async(to, from, next) => {
    NProgress.done()
})