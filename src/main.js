
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import store from './store'
import router from './routes'
import components from './components'
import App from './app'

Vue.use(Antd)
Vue.use(components)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
