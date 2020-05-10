import $http from '../../components/http'

const state = {
  lastUpdated: null,
  menu: [],
  authority: {}
}

const getters = {}

const mutations = {
  fetchSuccess (state, { data }) {
    state.lastUpdated = Date.now()
    state.menu = data
  },
  fetchFail (state) {
  },

  initAuthority (state, { data }) {
    const _tmp = filterData(data)
    state.authority = _tmp
  }
}

const actions = {
  getAuthority ({ commit, state }) {
    $http.get('/staffs/menu').then(
      (res) => {
        commit('fetchSuccess', { data: res.data })
        commit('initAuthority', { data: res.data })
      },
      () => {
        commit('fetchFail')
      }
    )
  }
}

function filterData (data) {
  const tmp = {}
  function _loop (items) {
    for (const item of items) {
      if (!tmp[item.id]) {
        tmp[item.id] = {}
      }
      tmp[item.id].enable = true
      tmp[item.id].name = item.key

      for (const cell of item.functions) {
        if (!tmp[cell.id]) {
          tmp[cell.id] = {}
        }
        tmp[cell.id].enable = true
        tmp[cell.id].name = cell.key
      }

      if (item.children && item.children.length > 0) {
        _loop(item.children)
      }
    }
  }
  _loop(data)
  return tmp
}

export default {
  state,
  getters,
  actions,
  mutations
}
