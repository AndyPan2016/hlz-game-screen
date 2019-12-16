/**
 * 活动信息 store模块
 * @author AndyPan
 * @createdate 2019年11月26日16:12:07
 * @lastupdatedate 2019年11月26日16:14:43
 * @remark
 */

export const ActivityInfoStore = {
  state: {
    // 活动信息
    activityInfo: null,
    // 游戏类型
    projectionGameType: '',
    // 活动名称
    blessingsText: '加载中',
    // 活动备注
    blessingsRemark: '加载中',
    // 活动名称样式级别
    blessingsGradeGame: 'leave-1',
    // 游戏状态
    gameStatus: 'ing',
    // 红包游戏的红包剩余数
    surplusRedPackNum: '0'
  },
  getters: {
    getActivityInfoState (state) {
      return state
    }
  },
  mutations: {
    // 更新状态
    activityInfoStoreUpdate (state, params) {
      for (let key in params) {
        state[key] = params[key]
      }
    }
  },
  actions: {
    activityInfoStoreUpdate (context, params) {
      context.commit('activityInfoStoreUpdate', params)
    }
  }
}
