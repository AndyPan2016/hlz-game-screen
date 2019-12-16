/**
 * 创建vuex实例
 * @author AndyPan
 * @createdate 2019年10月28日11:47:25
 * @lastupdatedate 2019年10月28日11:47:30
 * @remark
 */

import Vue from 'vue'
import Vuex from 'vuex'

let { ResponseStore } = StoreModules.require(StoreModules.response)
let { StarStore } = StoreModules.require(StoreModules.star)
let { ActivityInfoStore } = StoreModules.require(StoreModules.activityInfo)
let { ActivityJoinStore } = StoreModules.require(StoreModules.activityJoin)
let { ActivityRankStore } = StoreModules.require(StoreModules.activityRank)

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    ResponseStore,
    StarStore,
    ActivityInfoStore,
    ActivityJoinStore,
    ActivityRankStore
  }
})

export default store
