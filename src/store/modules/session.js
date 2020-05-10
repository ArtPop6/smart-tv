import * as types from '../mutation-types'
import $http from '../../components/http'

const state = {
  isFetching: false,
  lastUpdated: null,
  user: {
    id: 0,
    nick_name: '',
    real_name: '',
    user_name: '',
    img_url: ''
  }
}

const getters = {}

const mutations = {
  [types.FETCH_SESSION](state) {
    state.isFetching = true
  },
  [types.FETCH_SESSION_SUCCESS] (state, { data }) {
    state.isFetching = false
    state.lastUpdated = Date.now()
    state.user = data
  },
  [types.FETCH_SESSION_FAILURE] (state) {
    state.isFetching = false
  }
}

const actions = {
  updateSession ({ commit, state }) {
    commit(types.FETCH_SESSION)
    $http.get('/users/avatar').then(
      (res) => {
        commit(types.FETCH_SESSION_SUCCESS, { data: res.data })
      },
      () => {
        commit(types.FETCH_SESSION_FAILURE)
      }
    )
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
