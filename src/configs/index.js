/**
 * 全局配置
 * @author AndyPan
 * @createdate 2019年10月28日14:09:43
 * @lastupdatedate 2019年10月28日14:09:48
 * @remark 针对不同环境的相关配置项：api接口等信息
 */

let Lang = Configs.require(Configs.lang)
let Status = Configs.require(Configs.status)

// 当前环境
let environment = 'build'

let host = window.location.href.split('/')[2]

// 环境配置
let envConfigs = {
  // 开发环境配置
  develop: {
    // api接口地址
    apiHost: '/api/',
    socketHost: 'ws://192.168.66.56:8088/'
  },
  // 测试环境配置
  test: {
    apiHost: '/api/',
    socketHost: 'ws://192.168.55.45:8088/'
  },
  // 正式环境配置
  build: {
    apiHost: '/',
    socketHost: 'ws://' + host + '/'
  }
}

// 当前配置
let environmentConfigs = envConfigs[environment]

// api host
export const APIHOST = environmentConfigs.apiHost
export const SocketHost = environmentConfigs.socketHost

// 通用语言文本配置
export const LANG = Lang.default

// 通用状态配置
let thisStatus = {}
for (let key in Status.default) {
  thisStatus[key] = environment + '_' + Status.default[key]
}
export const STATUS = thisStatus
