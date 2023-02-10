import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'allLink-user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY) // 当前登录用户的登录状态（token等数据）
  },
  getters: {
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中
      // window.localStorage.setItem(USER_KEY, JSON.stringify(
      //   state.user))
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
