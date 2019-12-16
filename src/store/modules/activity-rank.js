/**
 * 活动排行榜 store模块
 * @author AndyPan
 * @createdate 2019年11月27日09:31:45
 * @lastupdatedate 2019年11月26日18:21:09
 * @remark
 */

export const ActivityRankStore = {
  state: {
    // 排行榜列表
    activityMemberRankingInfos: []
  },
  getters: {
    getActivityRankState (state) {
      return state
    }
  },
  mutations: {
    // 更新状态
    activityRankStoreUpdate (state, params) {
      for (let key in params) {
        state[key] = params[key]
      }
    }
  },
  actions: {
    activityRankStoreUpdate (context, params) {
      context.commit('activityRankStoreUpdate', params)
    }
  }
}
