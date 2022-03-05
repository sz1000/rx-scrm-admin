import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission' // permission control
import ElementUI from 'element-ui'
import '@/assets/plugins/element-ui/theme/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import VueCookies from 'vue-cookies'
import echarts from 'echarts'
import Network from './utils/request'
import _ from 'lodash'
import './assets/icons'
import preventReClick from './utils/directive.js' //防多次点击，重复提交
import loadmore from './utils/directive.js' //下拉框滚动加载
import './utils/directive.js'
import { formatDate } from './utils/tool'
import moment from 'moment'
import animated from 'animate.css'
import VueClipboard from 'vue-clipboard2'
import AFTableColumn from 'af-table-column'
import bases from '@/utils/functions'
import filters from '@/utils/filters'
import directives from '@/utils/directives'
import globalComponents from '@/components/global/index.js'

import { message } from '@/utils/resetMessage'
Vue.use(bases)
Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]))
Object.keys(directives).forEach((d) => Vue.directive(d, directives[d]))
Object.keys(globalComponents).forEach((g) =>
    Vue.component(g, globalComponents[g])
)
moment.locale("zh-cn")

Vue.prototype._ = _
Vue.prototype.$network = Network
Vue.prototype.$message = message
Vue.prototype.$echarts = echarts
Vue.prototype.formatDate = formatDate
Vue.prototype.moment = moment
Vue.use(VueCookies)
Vue.use(preventReClick)
Vue.use(loadmore)
Vue.use(animated)
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.config.productionTip = false

Vue.use(AFTableColumn)
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')