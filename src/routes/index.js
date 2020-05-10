import Vue from 'vue'
import VueRouter from 'vue-router'

import SignIn from '../pages/login'
import Home from './home'

Vue.use(VueRouter)

const routes = [
  {
    name: 'login',
    path: '/login',
    component: SignIn
  }
].concat(Home)

export default new VueRouter({
  mode: 'history',
  routes,
})
