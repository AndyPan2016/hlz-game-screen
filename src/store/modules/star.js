/**
 * 疯狂数钱星星 store模块
 * @author AndyPan
 * @createdate 2019年11月25日14:51:05
 * @lastupdatedate 2019年11月25日14:53:11
 * @remark
 */

export const StarStore = {
  state: {
    starGroup: [],
    isRenderStar: false
  },
  getters: {
    getStarState (state) {
      return state
    }
  },
  mutations: {
    starStoreUpdate (state, params) {
      // state.starGroup = params
      for (let key in params) {
        state[key] = params[key]
      }
    }
  },
  actions: {
    starStoreUpdate (context, params) {
      context.commit('starStoreUpdate', params)
    }
  }
}
