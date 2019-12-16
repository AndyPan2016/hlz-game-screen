/**
 * 活动加入信息 store模块
 * @author AndyPan
 * @createdate 2019年11月26日18:21:02
 * @lastupdatedate 2019年11月26日18:21:09
 * @remark
 */

export const ActivityJoinStore = {
  state: {
    // 已加入的成员信息
    activityMemberInfos: []
  },
  getters: {
    getActivityJoinState (state) {
      return state
    }
  },
  mutations: {
    // 更新状态
    activityJoinStoreUpdate (state, params) {
      for (let key in params) {
        state[key] = params[key]
      }
    }
  },
  actions: {
    activityJoinStoreUpdate (context, params) {
      context.commit('activityJoinStoreUpdate', params)
    }
  }
}
