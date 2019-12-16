/**
 * 接口服务
 * @author AndyPan
 * @createdate 2019年9月25日10:35:38
 * @lastupdatedate 2019年11月12日18:11:05
 * @remark
 */

let { StructureService } = Services.require(Services.axiosService)

let serviceGroups = [
  { service: 'activityInfo', remark: '大屏展示活动信息' },
  { service: 'activityJoinInfo', remark: '活动用户参与情况' },
  { service: 'activityRankingInfo', remark: '游戏排行榜' },
  { service: 'bulletScreenList', remark: '弹幕列表' },
  { service: 'activityGameInfo', remark: '红包剩余数' }
]

let projectionGroups = [
  { service: 'authorization', remark: '投屏授权' }
]

export const commonService = StructureService(serviceGroups, 'projection/activity/')
export const projectionService = StructureService(projectionGroups, 'projection/')
