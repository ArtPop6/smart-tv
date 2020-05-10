import Vuex from 'vuex'
import session from './modules/session'
import settings from './modules/settings'
import authority from './modules/authority'

const store = new Vuex.Store({
  modules: {
    session,
    settings,
    authority
  }
})

export default store
