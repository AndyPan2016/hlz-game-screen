/**
 * 所有接口服务
 * @author AndyPan
 * @createdate 2019年10月28日11:47:03
 * @lastupdatedate 2019年10月28日11:47:07
 * @remark 所有服务统一入口
 */

// 公共服务
let { commonService, projectionService } = Services.require(Services.commonService)

export const CommonService = commonService
export const ProjectionService = projectionService
